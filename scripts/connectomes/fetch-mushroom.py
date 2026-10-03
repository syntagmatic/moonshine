"""Adult fly mushroom body wiring and odour responses for connectomes article 7.

Run: python3 scripts/connectomes/fetch-mushroom.py   (standard library only)

Wiring: Zheng, Li, Fisher et al. 2022, "Structured sampling of olfactory input by the fly
mushroom body", Curr Biol 32: 3334-3349 (FAFB, right hemisphere, CATMAID tracing). Data
from the authors' repository github.com/bocklab/pn_kc (MIT), pinned to commits:
- revision 2f7414a, STable_201001_bouton_claw_table.csv: one row per KC claw that takes
  input from a uniglomerular olfactory PN (pn_skid, kc_skid, pn_type = glomerulus, kc_names
  with the KC subtype, claw_ids).
- revision 2f7414a, tables/200704-bouton_table: one row per PN bouton in the calyx, with
  the glomerulus's behavioural category (the paper's Table S1) and core-community flag.
- master 96fb0de, data/pre_post_info/pn_all_kc: every PN-to-KC synapse (connector id and
  position in FAFB14 nm, PN skid, KC skid). A claw's position is the centroid of its
  KC's synapses from that PN; where a KC has several claws on one PN (241 pairs) the
  synapses are split into that many clusters by k-means.
FAFB names three glomeruli by the old scheme; renamed to current names (hemibrain_olf_data
README; lineages agree): VC3l -> VC3 (Or35a), VC3m -> VC5 (Ir41a), VC5 -> VM6 (Rh50).

Odours: Hallem & Carlson 2006, "Coding of odors by a receptor repertoire", Cell 125: 143.
The publisher's supplement is not scriptable, so the table comes from the drosolf package
(github.com/tom-f-oconnell/drosolf, commit 2ff3591): Hallem_Carlson_2006.csv (110 odours at
10^-2 dilution x 24 receptors, change from spontaneous firing in spikes/s, plus the
spontaneous rates) and hc_data.csv (the same rows with the paper's chemical class).
Or33b is dropped (co-expressed in DM3 and DM5; 23 receptors on 23 glomeruli remain).

Writes docs/connectomes/shared/data/fly-mushroom.json:
  glom:    54 glomeruli in the order of Zheng et al. Fig. 3B (core community first)
  cat:     index into cats per glomerulus (Zheng Table S1 via the bouton table)
  core:    1 for the ten core-community glomeruli
  kcClass: per KC (sorted by skeleton id), index into kcClasses
  claw:    g (glomerulus index), k (KC index), x, y, z (microns, FAFB14 space; x lateral
           to medial on the right side, y dorsal to ventral, z posterior to anterior)
  odour:   name, cls (index into classes), rec and gl (receptor and glomerulus per
           column), d (change from spontaneous, spikes/s), sfr (spontaneous rates)
"""
import csv, io, json, sys, urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / 'scripts/connectomes/.cache/fly/mushroom'
OUT = ROOT / 'docs/connectomes/shared/data/fly-mushroom.json'
PNKC_REV = 'https://raw.githubusercontent.com/bocklab/pn_kc/2f7414ae7ea5f18f1000398ef40b791b6a452d97/'
PNKC_MASTER = 'https://raw.githubusercontent.com/bocklab/pn_kc/96fb0de1833539a0643ecc136b8a0dcd50d34932/'
DROSOLF = 'https://raw.githubusercontent.com/tom-f-oconnell/drosolf/2ff359109ed9d4c05e2f4c296111ca186cb0e892/drosolf/data/'
FILES = {
    'claws.csv': PNKC_REV + 'STable_201001_bouton_claw_table.csv',
    'boutons.csv': PNKC_REV + 'tables/200704-bouton_table',
    'synapses.json': PNKC_MASTER + 'data/pre_post_info/pn_all_kc',
    'hc.csv': DROSOLF + 'Hallem_Carlson_2006.csv',
    'hc_classes.csv': DROSOLF + 'hc_data.csv',
}
RENAME = {'VC3l': 'VC3', 'VC3m': 'VC5', 'VC5': 'VM6'}
# Zheng et al. Fig. 3B order (ClusterOrder0707 in their cond_matrices script), FAFB names.
ORDER = ['DM2', 'DP1m', 'VM2', 'DL2v', 'DM3', 'DM4', 'DM1', 'VM3', 'VA2', 'VA4', 'DM6', 'DM5', 'DC1', 'DL2d', 'VC4',
         'VC3l', 'DP1l', 'VA6', 'VM5d', 'DL1', 'DC3', 'VA7l', 'VL2a', 'DC2', 'VM1', 'D', 'VM4', 'VA1d', 'VM7v', 'VA5',
         'VC3m', 'VC1', 'DL3', 'DL5', 'VA3', 'DC4', 'VM7d', 'VC5', 'VA1v', 'DA4l', 'VL2p', 'DL4', 'VM5v', 'VC2', 'VP3',
         'VA7m', 'VP2', 'VP1', 'V', 'VL1', 'DA4m', 'DA2', 'DA3', 'DA1']
CATS = ['food', 'aversive', 'pheromone', 'egg-laying', 'unknown']
CAT_OF = {'Food': 0, 'Aversive': 1, 'Pheromonal': 2, 'Egg-laying': 3, 'Unknown': 4}
KC_CLASSES = ['γ', 'α′β′', 'αβ', 'unclassified']
# Hallem & Carlson's chemical classes, numbered as in hc_data.csv (named from their members).
CLASSES = ['amines', 'lactones', 'acids', 'sulfur compounds', 'terpenes', 'aldehydes', 'ketones', 'aromatics',
           'alcohols', 'esters']


def fetch():
    CACHE.mkdir(parents=True, exist_ok=True)
    for name, url in FILES.items():
        p = CACHE / name
        if not p.exists():
            print('fetching', url, file=sys.stderr)
            req = urllib.request.Request(url, headers={'User-Agent': 'moonshine-fetch'})
            p.write_bytes(urllib.request.urlopen(req, timeout=120).read())


def kc_class(name):
    t = name.split()[0]
    if t.startswith('KCy'):
        return 0
    if t.startswith("KCa'B'"):
        return 1
    if t.startswith('KCaB') or t.startswith('KCab'):
        return 2
    return 3


def kmeans(P, c):
    """Deterministic Lloyd's k-means for a few points: farthest-point start, 50 rounds."""
    mean = [sum(p[d] for p in P) / len(P) for d in range(3)]
    d2 = lambda a, b: sum((a[d] - b[d]) ** 2 for d in range(3))
    C = [max(P, key=lambda p: d2(p, mean))]
    while len(C) < c:
        C.append(max(P, key=lambda p: min(d2(p, q) for q in C)))
    for _ in range(50):
        groups = [[] for _ in C]
        for p in P:
            groups[min(range(c), key=lambda j: d2(p, C[j]))].append(p)
        C = [[sum(p[d] for p in g) / len(g) for d in range(3)] if g else C[j] for j, g in enumerate(groups)]
    return C


def wiring():
    claws = list(csv.DictReader(open(CACHE / 'claws.csv', encoding='utf-8')))
    boutons = list(csv.DictReader(open(CACHE / 'boutons.csv', encoding='utf-8')))
    syn = json.load(open(CACHE / 'synapses.json', encoding='utf-8'))
    gi = {g: i for i, g in enumerate(ORDER)}
    assert set(c['pn_type'] for c in claws) == set(ORDER), 'glomerulus set differs from Fig. 3B'
    cat, core = [None] * len(ORDER), [0] * len(ORDER)
    for b in boutons:
        i = gi[b['short_glom_name']]
        cat[i] = CAT_OF[b['significance']]
        core[i] = 1 if b['community'] == 'True' else 0
    assert None not in cat and sum(core) == 10
    kcs = sorted({int(c['kc_skid']) for c in claws})
    ki = {k: i for i, k in enumerate(kcs)}
    kcls = [None] * len(kcs)
    for c in claws:
        kcls[ki[int(c['kc_skid'])]] = kc_class(c['kc_names'])
    # Synapse positions per (PN, KC) pair, in microns.
    pts = defaultdict(list)
    for r in syn:
        pts[(r[3], r[8])].append([v / 1000 for v in r[1]])
    by_pair = defaultdict(list)
    for j, c in enumerate(claws):
        by_pair[(int(c['pn_skid']), int(c['kc_skid']))].append(j)
    pos = [None] * len(claws)
    split = 0
    for pair, rows in by_pair.items():
        P = pts[pair]
        assert P, f'no synapses for {pair}'
        cents = [[sum(p[d] for p in P) / len(P) for d in range(3)]] if len(rows) == 1 else kmeans(P, len(rows))
        split += len(rows) > 1
        for j, cen in zip(rows, cents):
            pos[j] = cen
    print(f'{len(claws)} claws, {len(kcs)} KCs, {len(ORDER)} glomeruli; {split} PN-KC pairs split into several claws',
          file=sys.stderr)
    return {
        'glom': [RENAME.get(g, g) for g in ORDER], 'cats': CATS, 'cat': cat, 'core': core,
        'kcClasses': KC_CLASSES, 'kcClass': kcls,
        'claw': {
            'g': [gi[c['pn_type']] for c in claws], 'k': [ki[int(c['kc_skid'])] for c in claws],
            'x': [round(p[0], 1) for p in pos], 'y': [round(p[1], 1) for p in pos], 'z': [round(p[2], 1) for p in pos],
        },
    }


def odours(glom):
    rows = list(csv.reader(open(CACHE / 'hc.csv', encoding='utf-8')))
    gl_row, rec_row, body = rows[0], rows[1], rows[2:]
    cols = [j for j in range(1, len(rec_row) - 1) if rec_row[j] != '33b']
    rec = ['Or' + rec_row[j] for j in cols]
    gl = ['VM5d' if rec_row[j] == '85b' else gl_row[j] for j in cols]  # Or85b's glomerulus is blank in the header
    assert all(g in glom for g in gl) and len(set(gl)) == 23
    sfr = next(r for r in body if r[0] == 'spontaneous firing rate')
    body = [r for r in body if r[0] != 'spontaneous firing rate']
    cls_of = {}
    for r in list(csv.reader(open(CACHE / 'hc_classes.csv', encoding='utf-8')))[2:]:
        if r[0] and r[1]:
            cls_of[r[1]] = int(r[0]) - 1
    assert len(body) == 110 and all(r[0] in cls_of and cls_of[r[0]] < 10 for r in body)
    return {
        'name': [r[0] for r in body], 'cls': [cls_of[r[0]] for r in body], 'classes': CLASSES,
        'rec': rec, 'gl': gl, 'd': [[int(r[j]) for j in cols] for r in body], 'sfr': [int(sfr[j]) for j in cols],
    }


def main():
    fetch()
    data = wiring()
    data['odour'] = odours(data['glom'])
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('wrote', OUT.relative_to(ROOT), f'({OUT.stat().st_size // 1000} KB)', file=sys.stderr)


if __name__ == '__main__':
    main()
