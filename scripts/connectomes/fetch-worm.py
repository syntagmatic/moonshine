# /// script
# dependencies = ["xlrd"]
# ///
"""C. elegans somatic connectome (Varshney et al. 2011) for the connectomes series.

Run: uv run scripts/connectomes/fetch-worm.py

Sources, cached under scripts/connectomes/.cache/worm/ (gitignored):
- WormAtlas "Neuronal Wiring" tables (Varshney, Chen, Paniagua, Hall & Chklovskii 2011,
  PLoS Comput Biol 7(2): e1001066): NeuronConnect.xls (edges) and NeuronType.xls
  (soma position along the body, 0 = nose, 1 = tail).
- OpenWorm c302 c302_A_Full.net.nml: one 3D location per neuron in the Virtual Worm
  body (micrometres; y anterior-posterior, z dorsal-ventral, x left-right).
- NemaNode /api/cells: cell type codes (s sensory, i inter, m motor, n modulatory).

Writes docs/connectomes/shared/data/worm-varshney.json:
  nodes: [{name, cls, role, ap, xyz}], role = first of s/i/m in NemaNode's type code (i for the 'n'-only AVH, AVK, RID)
  chem:  [[pre, post, synapses]] directed, from NeuronConnect rows of type S and Sp
  gap:   [[a, b, junctions]] undirected (a < b), from rows of type EJ
"""
import json, re, sys, urllib.request
from pathlib import Path

import xlrd

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / 'scripts/connectomes/.cache/worm'
OUT = ROOT / 'docs/connectomes/shared/data/worm-varshney.json'

SOURCES = {
    'positions/NeuronConnect.xls': 'https://www.wormatlas.org/images/NeuronConnect.xls',
    'positions/NeuronType.xls': 'https://www.wormatlas.org/images/NeuronType.xls',
    'positions/c302_A_Full.net.nml': 'https://raw.githubusercontent.com/openworm/c302/master/examples/c302_A_Full.net.nml',
    'nemanode_cells.json': 'https://nemanode.org/api/cells',
}


def fetch(rel, url):
    p = CACHE / rel
    if not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        print('fetching', url, file=sys.stderr)
        req = urllib.request.Request(url, headers={'User-Agent': 'moonshine-fetch'})
        p.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return p


def rows(path):
    s = xlrd.open_workbook(str(path)).sheet_by_index(0)
    head = [h.strip() for h in s.row_values(0)]
    return [dict(zip(head, s.row_values(r))) for r in range(1, s.nrows)]


def main():
    paths = {k: fetch(k, u) for k, u in SOURCES.items()}

    chem, gap = {}, {}
    for r in rows(paths['positions/NeuronConnect.xls']):
        a, b, t, n = r['Neuron 1'], r['Neuron 2'], r['Type'], int(r['Nbr'])
        if t in ('S', 'Sp'):
            chem[(a, b)] = chem.get((a, b), 0) + n
        elif t == 'EJ' and a < b:  # EJ rows are listed once from each side
            gap[(a, b)] = gap.get((a, b), 0) + n

    ap = {r['Neuron']: r['Soma Position'] for r in rows(paths['positions/NeuronType.xls'])}

    nml = paths['positions/c302_A_Full.net.nml'].read_text()
    xyz = {}
    for m in re.finditer(r'<population id="(\w+)".*?<location x="([^"]+)" y="([^"]+)" z="([^"]+)"', nml, re.S):
        xyz[m.group(1)] = [round(float(v), 2) for v in m.group(2, 3, 4)]

    cells = {c['name']: c for c in json.loads(paths['nemanode_cells.json'].read_text())}

    names = sorted(set(ap))
    assert len(names) == 279, len(names)
    assert all(a in ap and b in ap for a, b in chem) and all(a in ap and b in ap for a, b in gap)
    idx = {n: i for i, n in enumerate(names)}

    def cell(n):  # NemaNode writes AS1 where WormAtlas writes AS01
        return cells.get(n) or cells[re.sub(r'0(\d)$', r'\1', n)]

    def role(n):
        t = cell(n)['type']
        return next((ch for ch in t if ch in 'sim'), 'i')  # AVH, AVK, RID are 'n' only: interneurons

    nodes = [{'name': n, 'cls': cell(n)['class'], 'role': role(n), 'ap': ap[n], 'xyz': xyz.get(n) or xyz[re.sub(r'0(\d)$', r'\1', n)]} for n in names]
    out = {
        'source': 'Varshney et al. 2011, PLoS Comput Biol 7(2): e1001066, via WormAtlas NeuronConnect.xls and NeuronType.xls; '
                  '3D positions from OpenWorm c302 (c302_A_Full.net.nml); cell roles from NemaNode /api/cells',
        'nodes': nodes,
        'chem': sorted([idx[a], idx[b], n] for (a, b), n in chem.items()),
        'gap': sorted([idx[a], idx[b], n] for (a, b), n in gap.items()),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
    print(f'{len(nodes)} neurons, {len(out["chem"])} chemical pairs ({sum(e[2] for e in out["chem"])} synapses), '
          f'{len(out["gap"])} gap-junction pairs ({sum(e[2] for e in out["gap"])} junctions) -> {OUT.relative_to(ROOT)} '
          f'({OUT.stat().st_size:,} B)', file=sys.stderr)


if __name__ == '__main__':
    main()
