"""Larval Drosophila brain connectome (Winding et al. 2023) for connectomes article 6.

Run: python3 scripts/connectomes/fetch-larva.py   (standard library only)

Source: Winding, Pedigo, Barnes et al. 2023, "The connectome of an insect brain",
Science 379: eadd9330. Supplementary data from the Europe PMC author manuscript
(PMC7614541, CC BY), whose bundle is
https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7614541/supplementaryFiles
(a zip holding EMS175448-supplement-Supplementary_Data_S1.zip and _S2.csv),
cached under scripts/connectomes/.cache/larva/ (gitignored):
- Data S1: dense 2,952 x 2,952 synapse-count matrices indexed by CATMAID skeleton id,
  one per compartment pairing. We use ad_connectivity_matrix.csv (presynaptic axon to
  postsynaptic dendrite, rows presynaptic), the graph the paper's signal cascades run on
  (mwinding/connectome_analysis generate_data/cascades_all-modalities.py: type_adj='ad').
- Data S2: cell types per homologous left/right pair (celltype, additional_annotations).
  Sensory modality is the annotation of celltype 'sensory'; the somatosensory modalities
  enter the brain as ascending neurons ('ascending', annotated noci, mechano-Ch,
  mechano-II/III, proprio).
- The paper's own neuron sets, from the public CATMAID server (L1 CNS project,
  https://l1em.catmaid.virtualflybrain.org/): the skeletons under the meta-annotations
  the cascade code seeds from ('mw olfactory', ..., 'mw respiratory'), and the brain
  outputs it stops at ('mw brain outputs' = 'mw dVNC', 'mw dSEZ', 'mw RGN'). The seed sets
  equal S2's modality labels exactly; the outputs include 20 neurons that S2 types as
  CN, LHN, MBON or MB-FBN, so output flags come from CATMAID.

Writes docs/connectomes/shared/data/larva-winding.json:
  skid:  CATMAID skeleton id per node, in the matrix order
  type:  index into types (cell type from S2; 'other' for the 342 matrix neurons S2 omits)
  mod:   index into modalities for the seed neurons, else -1
  pair:  node index of the left/right homologue from S2, else -1
  out:   index into outputs (DN-VNC, DN-SEZ, RGN) from CATMAID for the cascade's stop
         nodes, else -1
  ad:    CSR of the a-d graph: off (n + 1 row offsets), to (column indices, each row's
         ascending and delta-encoded: first absolute, then differences), w (synapses)
"""
import csv, http.cookiejar, io, json, sys, urllib.parse, urllib.request, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / 'scripts/connectomes/.cache/larva'
OUT = ROOT / 'docs/connectomes/shared/data/larva-winding.json'
BUNDLE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7614541/supplementaryFiles'
S1 = 'EMS175448-supplement-Supplementary_Data_S1.zip'
S2 = 'EMS175448-supplement-Supplementary_Data_S2.csv'

# The order of the paper's code (cascades_all-modalities.py); 'gut' is its 'enteric'.
MODALITIES = ['olfactory', 'gustatory-external', 'gustatory-pharyngeal', 'gut', 'thermo-warm', 'thermo-cold',
              'visual', 'noci', 'mechano-Ch', 'mechano-II/III', 'proprio', 'respiratory']
OUTPUTS = ['DN-VNC', 'DN-SEZ', 'RGN']
CATMAID = 'https://l1em.catmaid.virtualflybrain.org'
# CATMAID annotation names; the modality ones are meta-annotations over cell-type annotations
ANNOT = {**{m: 'mw ' + ('enteric' if m == 'gut' else m) for m in MODALITIES},
         'DN-VNC': 'mw dVNC', 'DN-SEZ': 'mw dSEZ', 'RGN': 'mw RGN'}


def fetch():
    if not (CACHE / S1).exists() or not (CACHE / S2).exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        print('fetching', BUNDLE, '(about 11 MB, slow server)', file=sys.stderr)
        req = urllib.request.Request(BUNDLE, headers={'User-Agent': 'moonshine-fetch'})
        z = zipfile.ZipFile(io.BytesIO(urllib.request.urlopen(req, timeout=600).read()))
        for name in (S1, S2):
            member = next(m for m in z.namelist() if m.endswith(name))
            (CACHE / name).write_bytes(z.read(member))


def catmaid():
    """Skeleton ids under each annotation in ANNOT, cached in catmaid-sets.json."""
    p = CACHE / 'catmaid-sets.json'
    sets = json.loads(p.read_text()) if p.exists() else {}
    if all(k in sets for k in ANNOT):
        return {k: set(v) for k, v in sets.items()}
    jar = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.open(CATMAID + '/', timeout=60).read()  # sets the CSRF cookie the POST endpoints need
    tok = next(c.value for c in jar if c.name.startswith('csrftoken'))
    ids = {a['name']: a['id'] for a in json.load(op.open(CATMAID + '/1/annotations/', timeout=300))['annotations']}

    def under(name):
        data = urllib.parse.urlencode({'annotated_with[0]': ids[name], 'types[0]': 'neuron', 'types[1]': 'annotation'}).encode()
        req = urllib.request.Request(CATMAID + '/1/annotations/query-targets', data=data,
                                     headers={'X-CSRFToken': tok, 'Referer': CATMAID + '/'})
        out = set()
        for e in json.load(op.open(req, timeout=300))['entities']:
            out |= set(e['skeleton_ids']) if e['type'] == 'neuron' else under(e['name'])
        return out

    for k, name in ANNOT.items():
        if k not in sets:
            print('CATMAID', name, file=sys.stderr)
            sets[k] = sorted(under(name))
            p.write_text(json.dumps(sets))
    return {k: set(v) for k, v in sets.items()}


def matrix():
    with zipfile.ZipFile(CACHE / S1) as z:
        member = next(m for m in z.namelist() if m.endswith('/ad_connectivity_matrix.csv') and '__MACOSX' not in m)
        rows = csv.reader(io.TextIOWrapper(z.open(member), encoding='utf-8'))
        head = next(rows)
        cols = [int(float(x)) for x in head[1:]]
        adj = []
        for i, r in enumerate(rows):
            assert int(float(r[0])) == cols[i], 'row and column skeleton ids differ'
            adj.append([(j, int(float(v))) for j, v in enumerate(r[1:]) if v not in ('0', '0.0', '')])
    return cols, adj


def labels(skids):
    idx = {s: i for i, s in enumerate(skids)}
    n = len(skids)
    ctype, mod, pair = ['other'] * n, [-1] * n, [-1] * n
    in_s2 = 0
    for r in csv.DictReader(open(CACHE / S2, encoding='utf-8')):
        ids = [int(r[k]) for k in ('left_id', 'right_id') if r[k] != 'no pair']
        ann = [a.strip() for a in r['additional_annotations'].split(';')]
        m = next((a for a in ann if a in MODALITIES), None) if r['celltype'] in ('sensory', 'ascending') else None
        present = [idx[s] for s in ids if s in idx]
        in_s2 += len(present)
        for i in present:
            ctype[i] = r['celltype']
            if m is not None:
                mod[i] = MODALITIES.index(m)
        if len(present) == 2:
            pair[present[0]], pair[present[1]] = present[1], present[0]
    return ctype, mod, pair, in_s2


def main():
    fetch()
    skids, adj = matrix()
    n = len(skids)
    ctype, mod, pair, in_s2 = labels(skids)
    sets = catmaid()
    for k, m in enumerate(MODALITIES):
        assert {skids[i] for i in range(n) if mod[i] == k} == sets[m] & set(skids), m
    out = [next((k for k, t in enumerate(OUTPUTS) if s in sets[t]), -1) for s in skids]
    s2_out = sum(t in OUTPUTS for t in ctype)
    assert all(o >= 0 for o, t in zip(out, ctype) if t in OUTPUTS)
    types = sorted(set(ctype) - {'other'}) + ['other']
    off, to, w = [0], [], []
    for row in adj:
        prev = 0
        for k, (j, v) in enumerate(row):
            to.append(j if k == 0 else j - prev)
            prev = j
            w.append(v)
        off.append(len(to))

    # Orientation: rows are presynaptic. Sensory neurons have axons but no dendrites in
    # the brain, so in the a-d graph they send and almost never receive.
    sens = [i for i in range(n) if ctype[i] == 'sensory']
    out_s = sum(v for i in sens for _, v in adj[i])
    in_s = sum(v for row in adj for j, v in row if ctype[j] == 'sensory')
    assert out_s > 50 * max(in_s, 1), (out_s, in_s)

    edges, syn = len(w), sum(w)
    print(f'{n} neurons ({in_s2} labelled in S2), a-d graph: {edges} connections, {syn} synapses', file=sys.stderr)
    print('seeds per modality: ' + ', '.join(f'{m} {mod.count(k)}' for k, m in enumerate(MODALITIES)), file=sys.stderr)
    print('outputs (CATMAID): ' + ', '.join(f'{t} {out.count(k)}' for k, t in enumerate(OUTPUTS)) +
          f'; {sum(o >= 0 for o in out) - s2_out} of them typed otherwise in S2', file=sys.stderr)
    OUT.write_text(json.dumps({
        'source': 'Winding et al. 2023, Science 379: eadd9330 (CC BY, Europe PMC PMC7614541), '
                  'Data S1 ad_connectivity_matrix.csv and Data S2 cell types; output neurons from the '
                  'L1 CNS CATMAID annotations mw dVNC, mw dSEZ, mw RGN',
        'modalities': MODALITIES, 'outputs': OUTPUTS, 'types': types,
        'skid': skids, 'type': [types.index(t) for t in ctype], 'mod': mod, 'pair': pair, 'out': out,
        'ad': {'off': off, 'to': to, 'w': w},
    }, ensure_ascii=False, separators=(',', ':')))
    print(f'-> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)', file=sys.stderr)


if __name__ == '__main__':
    main()
