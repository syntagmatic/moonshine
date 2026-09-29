// Build docs/sheaves/data/webkb.js for sheaves essay 06 from the WebKB graphs
// (Texas, Cornell, Wisconsin) as distributed with Geom-GCN (Pei et al., ICLR
// 2020), https://github.com/bingzhewei/geom-gcn
//
//   B=https://raw.githubusercontent.com/bingzhewei/geom-gcn/master
//   for n in texas cornell wisconsin; do
//     mkdir -p webkb/$n
//     curl -Lo webkb/$n/out1_node_feature_label.txt $B/new_data/$n/out1_node_feature_label.txt
//     curl -Lo webkb/$n/out1_graph_edges.txt $B/new_data/$n/out1_graph_edges.txt
//     for k in 0 1 2 3 4 5 6 7 8 9; do
//       curl -Lo webkb/$n/split_$k.npz $B/splits/${n}_split_0.6_0.2_$k.npz
//     done
//   done
//   node scripts/sheaves-webkb.mjs webkb
//
// Output, per graph: node count, the columns of the 1703-word vocabulary that
// occur in that graph, each page's words as indices into those columns, its
// class (0-4, as numbered in the files), the undirected edges with self-loops
// dropped, and the ten fixed splits as one string each ('t' train, 'v'
// validation, 's' test, one character per node).
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node scripts/sheaves-webkb.mjs <dir with texas/ cornell/ wisconsin/>'); process.exit(1); }

// Minimal .npz reader: a zip of .npy files, each a boolean or uint8 mask.
function readNpz(file) {
  const buf = fs.readFileSync(file), out = {};
  let p = 0;
  while (buf.readUInt32LE(p) === 0x04034b50) {
    const method = buf.readUInt16LE(p + 8), csize = buf.readUInt32LE(p + 18);
    const nlen = buf.readUInt16LE(p + 26), xlen = buf.readUInt16LE(p + 28);
    const name = buf.toString('utf8', p + 30, p + 30 + nlen);
    const start = p + 30 + nlen + xlen, raw = buf.subarray(start, start + csize);
    const data = method === 8 ? zlib.inflateRawSync(raw) : raw;
    const hl = data.readUInt16LE(8), header = data.toString('latin1', 10, 10 + hl);
    if (!/'descr': '\|(b1|u1)'/.test(header)) throw new Error(file + ' ' + name + ': unexpected dtype ' + header);
    out[name.replace(/\.npy$/, '')] = Array.from(data.subarray(10 + hl));
    p = start + csize;
  }
  return out;
}

const out = {};
for (const name of ['texas', 'cornell', 'wisconsin']) {
  const base = path.join(dir, name);
  const rows = fs.readFileSync(path.join(base, 'out1_node_feature_label.txt'), 'utf8').trim().split('\n').slice(1)
    .map(l => l.split('\t')).map(([i, f, c]) => ({ i: +i, f: f.split(',').map(Number), c: +c }))
    .sort((a, b) => a.i - b.i);
  const n = rows.length;
  rows.forEach((r, k) => { if (r.i !== k) throw new Error(name + ': node ids are not 0..n-1'); });
  const vocab = rows[0].f.length;
  const used = [...Array(vocab).keys()].filter(j => rows.some(r => r.f[j]));
  const col = new Map(used.map((j, k) => [j, k]));
  const words = rows.map(r => r.f.flatMap((x, j) => (x ? [col.get(j)] : [])));

  const seen = new Set(), edges = [];
  let lines = 0, loops = 0;
  for (const l of fs.readFileSync(path.join(base, 'out1_graph_edges.txt'), 'utf8').trim().split('\n').slice(1)) {
    const [a, b] = l.split('\t').map(Number);
    lines++;
    if (a === b) { loops++; continue; }
    const u = Math.min(a, b), v = Math.max(a, b), key = u + ',' + v;
    if (!seen.has(key)) { seen.add(key); edges.push([u, v]); }
  }
  edges.sort((p, q) => p[0] - q[0] || p[1] - q[1]);

  const splits = [];
  for (let k = 0; k < 10; k++) {
    const m = readNpz(path.join(base, 'split_' + k + '.npz'));
    let s = '';
    for (let i = 0; i < n; i++) {
      const t = m.train_mask[i], v = m.val_mask[i], te = m.test_mask[i];
      if (t + v + te !== 1) throw new Error(name + ' split ' + k + ': node ' + i + ' is in ' + (t + v + te) + ' sets');
      s += t ? 't' : v ? 'v' : 's';
    }
    splits.push(s);
  }
  const labels = rows.map(r => r.c);
  const same = edges.filter(([u, v]) => labels[u] === labels[v]).length;
  out[name] = { n, vocab, used: used.length, labels, words: words.map(w => w.map(j => j.toString(36)).join(' ')), edges, splits };
  console.error(name + ': ' + n + ' nodes, ' + used.length + ' of ' + vocab + ' words used, ' + edges.length +
    ' undirected edges (' + lines + ' lines, ' + loops + ' self-loops), edge homophily ' + (same / edges.length).toFixed(3) +
    ', split sizes ' + ['t', 'v', 's'].map(c => splits[0].split(c).length - 1).join('/'));
}

const header = '// WebKB graphs (Texas, Cornell, Wisconsin) as distributed with Geom-GCN, built by\n' +
  '// scripts/sheaves-webkb.mjs. Pages are nodes, hyperlinks are edges (undirected, no\n' +
  '// self-loops), features are bag-of-words indices into `used` columns (base 36),\n' +
  '// labels are the five classes as numbered in the files, splits are the ten fixed\n' +
  '// Geom-GCN splits (t train, v validation, s test).\n';
fs.writeFileSync('docs/sheaves/data/webkb.js', header + 'window.WEBKB = ' + JSON.stringify(out) + ';\n');
console.error('wrote docs/sheaves/data/webkb.js, ' + fs.statSync('docs/sheaves/data/webkb.js').size + ' bytes');
