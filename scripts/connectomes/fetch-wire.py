# /// script
# dependencies = ["xlrd"]
# ///
"""Data for connectomes article 4, The Cost of Wire.

Run: uv run scripts/connectomes/fetch-wire.py   (after fetch-worm.py)

Sources, cached under scripts/connectomes/.cache/ (gitignored):
- WormAtlas NeuronFixedPoints.xls (Chen, Hall & Chklovskii 2006, PNAS 103: 4723; the
  "Neuronal Wiring" tables): for each neuron, the sensory endings and body-wall muscles it
  attaches to, their position along the body (0 = nose, 1 = tail) and a weight (1 per
  sensory ending; neuromuscular junction counts for muscles).
- Markov et al. 2014, Cereb Cortex 24: 17 (CC BY-NC), supplementary table (core-nets.org
  "Cercor_2012 Table.xls", archived): FLNe for every source area of each of 39 retrograde
  injections into 29 target areas.
- Markov et al. 2014, J Comp Neurol 522: 225 (CC BY), Table 2 (core-nets.org
  "JCN_2013 Table.xls", archived): white-matter distance for 628 pathways into 11 targets.

Writes docs/connectomes/shared/data/
  worm-anchors.json: anchors [[node, kind, position, weight]], node indexing
      worm-varshney.json's nodes; kind 's' sensory ending, 'm' muscle.
  macaque-fln.json: pathways [[target, source, distance_mm, flne, injections_labelled,
      injections]], FLNe averaged over a target's repeat injections counting an
      unlabelled injection as 0.
"""
import json, re, sys, urllib.request
from pathlib import Path

import xlrd

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / 'scripts/connectomes/.cache'
DATA = ROOT / 'docs/connectomes/shared/data'
WB = 'https://web.archive.org/web/20220428032250id_/http://core-nets.org/download/'

SOURCES = {
    'worm/positions/NeuronFixedPoints.xls': 'https://www.wormatlas.org/images/NeuronFixedPoints.xls',
    'macaque/Cercor_2012_Table.xls': 'https://web.archive.org/web/20220428032305id_/http://core-nets.org/download/Cercor_2012%20Table.xls',
    'macaque/JCN_2013_Table.xls': WB + 'JCN_2013%20Table.xls',
}

# JCN table spellings -> Cercor table spellings
AREA = {'8L': '8l', 'ENTORHINAL': 'ENTO', 'PERIRHINAL': 'PERI', 'PIRIFORM': 'PIR', 'SUBICULUM': 'SUB',
        'TEMPORAL_POLE': 'POLE', 'INSULA': 'INS', 'Parainsula': 'Pi', 'CORE': 'Core'}


def fetch(rel, url):
    p = CACHE / rel
    if not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        print('fetching', url, file=sys.stderr)
        req = urllib.request.Request(url, headers={'User-Agent': 'moonshine-fetch'})
        p.write_bytes(urllib.request.urlopen(req, timeout=60).read())  # WormAtlas: if this fails on its certificate, fetch with curl -k
    return p


def rows(path):
    s = xlrd.open_workbook(str(path)).sheet_by_index(0)
    return [s.row_values(r) for r in range(1, s.nrows)]


def area(v):  # numbered areas are stored as floats
    return AREA.get(v, v) if isinstance(v, str) else str(int(v))


def worm(paths):
    nodes = json.loads((DATA / 'worm-varshney.json').read_text())['nodes']
    idx = {n['name']: i for i, n in enumerate(nodes)}
    idx.update({re.sub(r'0(\d)$', r'\1', n): i for n, i in list(idx.items())})
    anchors, dropped = [], set()
    for name, landmark, pos, w in rows(paths['worm/positions/NeuronFixedPoints.xls']):
        i = idx.get(name, idx.get(re.sub(r'0(\d)$', r'\1', name)))
        if i is None:
            dropped.add(name)
            continue
        anchors.append([i, 's' if landmark.startswith('Sensory') else 'm', round(pos, 4), round(w, 4)])
    assert dropped == {'VC06'}, dropped  # not among Varshney's 279 (no chemical synapses or gap junctions)
    out = DATA / 'worm-anchors.json'
    out.write_text(json.dumps({
        'source': 'Chen, Hall & Chklovskii 2006, PNAS 103: 4723, via WormAtlas NeuronFixedPoints.xls; '
                  'node indices into worm-varshney.json',
        'anchors': sorted(anchors),
    }, ensure_ascii=False, separators=(',', ':')))
    print(f'{len(anchors)} anchors on {len({a[0] for a in anchors})} neurons -> {out.relative_to(ROOT)}', file=sys.stderr)


def macaque(paths):
    dist = {(area(t), area(s)): float(d) for t, s, _, d in rows(paths['macaque/JCN_2013_Table.xls'])}
    cases, fln = {}, {}
    for case, _, src, tgt, f, *_ in rows(paths['macaque/Cercor_2012_Table.xls']):
        src, tgt = area(src), area(tgt)
        cases.setdefault(tgt, set()).add(int(case))
        fln.setdefault((tgt, src), []).append(float(f))
    assert set(dist) <= set(fln), set(dist) - set(fln)
    assert {k for k in fln if k[0] in {t for t, _ in dist}} == set(dist)
    paths_ = []
    for (t, s), d in sorted(dist.items()):
        v, nc = fln[(t, s)], len(cases[t])
        paths_.append([t, s, d, float(f'{sum(v) / nc:.4g}'), len(v), nc])
    out = DATA / 'macaque-fln.json'
    out.write_text(json.dumps({
        'source': 'FLNe: Markov et al. 2014, Cereb Cortex 24: 17 (CC BY-NC), supplementary table; '
                  'white-matter distances: Markov et al. 2014, J Comp Neurol 522: 225 (CC BY), Table 2; '
                  'both from core-nets.org via the Internet Archive',
        'pathways': paths_,
    }, ensure_ascii=False, separators=(',', ':')))
    print(f'{len(paths_)} pathways into {len({p[0] for p in paths_})} targets -> {out.relative_to(ROOT)}', file=sys.stderr)


def main():
    paths = {k: fetch(k, u) for k, u in SOURCES.items()}
    worm(paths)
    macaque(paths)


if __name__ == '__main__':
    main()
