// Graph statistics and null models for the connectomes series.
//
// Nodes are integers 0..n-1. An undirected edge list holds [a, b] with a < b;
// a directed edge list holds [pre, post]. No self-loops, no multi-edges.
//
// Statistics: average clustering (Watts and Strogatz 1998; nodes of degree
// below 2 count as 0, as in networkx), mean shortest path over connected
// ordered pairs, and the 16-class triad census (Batagelj and Mrvar 2001,
// following networkx's implementation and tricode table).
//
// Null models:
//   er             same n and edge count, uniformly at random
//   spatial        same number of edges in each distance bin, placed uniformly
//                  among the node pairs in that bin
//   swap           degree-preserving double-edge swaps (Maslov and Sneppen 2002);
//                  with binOf, a swap is kept only if the two new edges fall in the
//                  same distance bins as the two old ones, so the edge-length
//                  histogram is preserved too (in the spirit of Betzel and Bassett 2018)
//   swapDirected   in- and out-degree preserving swaps of directed edges
//   swapReciprocal also preserves the reciprocal (mutual) pairs: one-way edges
//                  swap among themselves and stay one-way, mutual pairs swap among
//                  themselves (Milo et al. 2002's null)
//
// The whole library is one factory so a page can rebuild it inside a Worker
// from GraphLib.factory.toString(). Works in the browser (window.GraphLib)
// and in node (module.exports).
(function (root, factory) {
  const lib = factory();
  lib.factory = factory;
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  else root.GraphLib = lib;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Seeded generator (mulberry32).
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const key = (a, b) => a * 65536 + b; // n < 65536

  // ---- undirected ----

  function undirected(n, directed) {
    const s = new Set(), out = [];
    for (const [a, b] of directed) {
      if (a === b) continue;
      const k = key(Math.min(a, b), Math.max(a, b));
      if (!s.has(k)) { s.add(k); out.push([Math.min(a, b), Math.max(a, b)]); }
    }
    return out;
  }

  // Compressed adjacency: neighbours of i are nbr[off[i] .. off[i+1]), sorted.
  function csr(n, edges) {
    const deg = new Int32Array(n);
    for (const [a, b] of edges) { deg[a]++; deg[b]++; }
    const off = new Int32Array(n + 1);
    for (let i = 0; i < n; i++) off[i + 1] = off[i] + deg[i];
    const fill = off.slice(0, n), nbr = new Int32Array(off[n]);
    for (const [a, b] of edges) { nbr[fill[a]++] = b; nbr[fill[b]++] = a; }
    for (let i = 0; i < n; i++) nbr.subarray(off[i], off[i + 1]).sort();
    return { n, off, nbr, deg };
  }

  function degrees(n, edges) { return csr(n, edges).deg; }

  function clustering(n, edges) {
    const g = csr(n, edges), mark = new Int32Array(n).fill(-1);
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const k = g.deg[i];
      if (k < 2) continue;
      for (let p = g.off[i]; p < g.off[i + 1]; p++) mark[g.nbr[p]] = i;
      let t = 0;
      for (let p = g.off[i]; p < g.off[i + 1]; p++) {
        const j = g.nbr[p];
        for (let q = g.off[j]; q < g.off[j + 1]; q++) if (mark[g.nbr[q]] === i) t++;
      }
      sum += t / (k * (k - 1)); // t counts each triangle at i twice
    }
    return sum / n;
  }

  // Transitivity: 3 x triangles / connected triples, the global clustering that
  // Newman's configuration-model estimate refers to.
  function transitivity(n, edges) {
    const g = csr(n, edges), mark = new Int32Array(n).fill(-1);
    let closed = 0, triples = 0;
    for (let i = 0; i < n; i++) {
      const k = g.deg[i];
      triples += k * (k - 1) / 2;
      for (let p = g.off[i]; p < g.off[i + 1]; p++) mark[g.nbr[p]] = i;
      for (let p = g.off[i]; p < g.off[i + 1]; p++) {
        const j = g.nbr[p];
        for (let q = g.off[j]; q < g.off[j + 1]; q++) if (mark[g.nbr[q]] === i) closed++;
      }
    }
    return triples ? closed / 2 / triples : 0;
  }

  // Mean shortest-path length over ordered pairs (i, j), i != j, j reachable from i.
  function meanPath(n, edges) {
    const g = csr(n, edges), dist = new Int32Array(n), queue = new Int32Array(n);
    let tot = 0, cnt = 0;
    for (let s = 0; s < n; s++) {
      dist.fill(-1); dist[s] = 0;
      let h = 0, t = 0; queue[t++] = s;
      while (h < t) {
        const u = queue[h++];
        for (let p = g.off[u]; p < g.off[u + 1]; p++) {
          const v = g.nbr[p];
          if (dist[v] < 0) { dist[v] = dist[u] + 1; tot += dist[v]; cnt++; queue[t++] = v; }
        }
      }
    }
    return tot / cnt;
  }

  function nullER(n, m, r) {
    const s = new Set(), out = [];
    while (out.length < m) {
      const a = Math.floor(r() * n), b = Math.floor(r() * n);
      if (a === b) continue;
      const lo = Math.min(a, b), hi = Math.max(a, b), k = key(lo, hi);
      if (!s.has(k)) { s.add(k); out.push([lo, hi]); }
    }
    return out;
  }

  // Quantile bins of pairwise distance: every bin holds about the same number of
  // node pairs. Returns binOf(a, b) and the pairs in each bin.
  function distanceBins(n, dist, nbins) {
    const pairs = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push(j * n + i);
    const d = p => dist(p % n, Math.floor(p / n));
    const sorted = pairs.map(p => [d(p), p]).sort((x, y) => x[0] - y[0]);
    const bin = new Uint16Array(n * n), byBin = Array.from({ length: nbins }, () => []);
    sorted.forEach(([, p], r) => {
      const b = Math.min(nbins - 1, Math.floor(r * nbins / sorted.length));
      const i = p % n, j = Math.floor(p / n);
      bin[i * n + j] = bin[j * n + i] = b;
      byBin[b].push([i, j]);
    });
    return { nbins, binOf: (a, b) => bin[a * n + b], byBin, edges: e => e.map(([a, b]) => bin[a * n + b]) };
  }

  function nullSpatial(edges, bins, r) {
    const count = new Int32Array(bins.nbins);
    for (const [a, b] of edges) count[bins.binOf(a, b)]++;
    const out = [];
    for (let b = 0; b < bins.nbins; b++) {
      const pool = bins.byBin[b], c = count[b];
      // partial Fisher-Yates on a copy of the indices
      const idx = Int32Array.from(pool.keys());
      for (let k = 0; k < c; k++) {
        const j = k + Math.floor(r() * (idx.length - k));
        const t = idx[k]; idx[k] = idx[j]; idx[j] = t;
        out.push(pool[idx[k]]);
      }
    }
    return out;
  }

  // Degree-preserving double-edge swaps: (a-b, c-d) -> (a-d, c-b).
  // Runs until iters * m swaps succeed or 200 * iters * m attempts are spent.
  function swap(n, edges, r, opts = {}) {
    const iters = opts.iters ?? 10, binOf = opts.binOf;
    const E = edges.map(e => e.slice()), m = E.length, s = new Set(E.map(([a, b]) => key(a, b)));
    let done = 0, tries = 0;
    const goal = iters * m, cap = 200 * goal;
    while (done < goal && tries < cap) {
      tries++;
      const x = Math.floor(r() * m), y = Math.floor(r() * m);
      if (x === y) continue;
      const [a, b] = E[x];
      let [c, d] = E[y];
      if (r() < 0.5) { const t = c; c = d; d = t; }
      if (a === c || a === d || b === c || b === d) continue;
      const k1 = key(Math.min(a, d), Math.max(a, d)), k2 = key(Math.min(c, b), Math.max(c, b));
      if (s.has(k1) || s.has(k2)) continue;
      if (binOf) {
        const o1 = binOf(a, b), o2 = binOf(c, d), n1 = binOf(a, d), n2 = binOf(c, b);
        if (!((o1 === n1 && o2 === n2) || (o1 === n2 && o2 === n1))) continue;
      }
      s.delete(key(Math.min(a, b), Math.max(a, b))); s.delete(key(Math.min(c, d), Math.max(c, d)));
      s.add(k1); s.add(k2);
      E[x] = [Math.min(a, d), Math.max(a, d)]; E[y] = [Math.min(c, b), Math.max(c, b)];
      done++;
    }
    return { edges: E, done, tries };
  }

  // ---- directed ----

  function mutualPairs(edges) {
    const s = new Set(edges.map(([a, b]) => key(a, b)));
    let c = 0;
    for (const [a, b] of edges) if (a < b && s.has(key(b, a))) c++;
    return c;
  }

  function swapDirected(n, edges, r, iters = 10) {
    const E = edges.map(e => e.slice()), m = E.length, s = new Set(E.map(([a, b]) => key(a, b)));
    let done = 0, tries = 0;
    while (done < iters * m && tries < 200 * iters * m) {
      tries++;
      const x = Math.floor(r() * m), y = Math.floor(r() * m);
      const [a, b] = E[x], [c, d] = E[y];
      if (a === c || a === d || b === c || b === d) continue;
      if (s.has(key(a, d)) || s.has(key(c, b))) continue;
      s.delete(key(a, b)); s.delete(key(c, d)); s.add(key(a, d)); s.add(key(c, b));
      E[x] = [a, d]; E[y] = [c, b];
      done++;
    }
    return E;
  }

  function swapReciprocal(n, edges, r, iters = 10) {
    const s = new Set(edges.map(([a, b]) => key(a, b)));
    const one = [], two = [];
    for (const [a, b] of edges) {
      if (!s.has(key(b, a))) one.push([a, b]);
      else if (a < b) two.push([a, b]);
    }
    const free = (a, b) => !s.has(key(a, b)) && !s.has(key(b, a));
    function run(L, mutual) {
      const m = L.length;
      let done = 0, tries = 0;
      while (done < iters * m && tries < 200 * iters * m) {
        tries++;
        const x = Math.floor(r() * m), y = Math.floor(r() * m);
        const [a, b] = L[x];
        let [c, d] = L[y];
        if (mutual && r() < 0.5) { const t = c; c = d; d = t; }
        if (a === c || a === d || b === c || b === d) continue;
        if (!free(a, d) || !free(c, b)) continue;
        s.delete(key(a, b)); s.delete(key(c, d)); s.add(key(a, d)); s.add(key(c, b));
        if (mutual) { s.delete(key(b, a)); s.delete(key(d, c)); s.add(key(d, a)); s.add(key(b, c)); }
        L[x] = [a, d]; L[y] = [c, b];
        done++;
      }
    }
    run(two, true); run(one, false);
    const out = one.slice();
    for (const [a, b] of two) out.push([a, b], [b, a]);
    return out;
  }

  const TRIADS = ['003', '012', '102', '021D', '021U', '021C', '111D', '111U', '030T', '030C', '201', '120D', '120U', '120C', '210', '300'];
  // networkx TRICODES: tricode (6 bits, see triadCensus) -> 1-based triad index
  const TRICODES = [1, 2, 2, 3, 2, 4, 6, 8, 2, 6, 5, 7, 3, 8, 7, 11, 2, 6, 4, 8, 5, 9, 9, 13, 6, 10, 9, 14, 7, 14, 12, 15,
    2, 5, 6, 7, 6, 9, 10, 14, 4, 9, 9, 12, 8, 13, 14, 15, 3, 7, 8, 11, 7, 12, 14, 15, 8, 14, 13, 15, 11, 15, 15, 16];
  // One example tricode per class, for drawing: bit order (v->u... see below).
  const EXAMPLE = TRIADS.map((_, t) => TRICODES.indexOf(t + 1));
  // Bits of a tricode for nodes (v, u, w): 1 v->u, 2 u->v, 4 v->w, 8 w->v, 16 u->w, 32 w->u.
  const BITS = [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [2, 1]]; // [from, to] with 0 = v, 1 = u, 2 = w
  const tricode = (has, v, u, w) => (has(v, u) ? 1 : 0) + (has(u, v) ? 2 : 0) + (has(v, w) ? 4 : 0) +
    (has(w, v) ? 8 : 0) + (has(u, w) ? 16 : 0) + (has(w, u) ? 32 : 0);

  function triadCensus(n, edges) {
    const out = Array.from({ length: n }, () => new Set()), inn = Array.from({ length: n }, () => new Set());
    for (const [a, b] of edges) { out[a].add(b); inn[b].add(a); }
    const has = (a, b) => out[a].has(b);
    const und = out.map((s, i) => new Set([...s, ...inn[i]]));
    const census = new Float64Array(16);
    for (let v = 0; v < n; v++) {
      for (const u of und[v]) {
        if (u <= v) continue;
        const S = new Set([...und[v], ...und[u]]); S.delete(u); S.delete(v);
        for (const w of S) {
          if (u < w || (v < w && w < u && !und[v].has(w))) {
            census[TRICODES[tricode(has, v, u, w)] - 1]++;
          }
        }
        census[has(u, v) && has(v, u) ? 2 : 1] += n - S.size - 2;
      }
    }
    const total = n * (n - 1) * (n - 2) / 6;
    census[0] = total - census.reduce((s, x, i) => s + (i ? x : 0), 0);
    return Array.from(census);
  }

  // Edges of an example triad of class t, as [from, to] over corners 0, 1, 2.
  function triadEdges(t) {
    const code = EXAMPLE[t];
    return BITS.filter((_, i) => code & (1 << i));
  }

  function mean(a) { return a.reduce((s, x) => s + x, 0) / a.length; }
  function sd(a) { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1)); }

  // ---- checks (node: require(...).runChecks()) ----
  function runChecks(log = console.log) {
    const res = [];
    const ok = (name, pass, detail = '') => { res.push({ name, pass }); log((pass ? 'pass ' : 'FAIL ') + name + (detail ? ': ' + detail : '')); };
    const near = (a, b, tol) => Math.abs(a - b) <= tol;

    // Complete graph K5: C = 1, L = 1.
    const K5 = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) K5.push([i, j]);
    ok('K5 clustering 1', near(clustering(5, K5), 1, 1e-12));
    ok('K5 path length 1', near(meanPath(5, K5), 1, 1e-12));
    // Ring lattice, n = 30, each node joined to 2 neighbours on each side: C = 3(k-2)/(4(k-1)) = 0.5.
    const ring = []; for (let i = 0; i < 30; i++) for (const s of [1, 2]) { const j = (i + s) % 30; ring.push([Math.min(i, j), Math.max(i, j)]); }
    ok('ring lattice clustering 0.5', near(clustering(30, ring), 0.5, 1e-12));
    // Path graph on 4 nodes: mean distance over ordered pairs = (3*1 + 2*2 + 1*3) * 2 / 12 = 20/12.
    ok('path P4 mean distance 5/3', near(meanPath(4, [[0, 1], [1, 2], [2, 3]]), 5 / 3, 1e-12));
    // Star: centre has C 0, leaves degree 1: average 0.
    ok('K5 transitivity 1, star 0', near(transitivity(5, K5), 1, 1e-12) && transitivity(5, [[0, 1], [0, 2], [0, 3], [0, 4]]) === 0);
    // Triangle plus a pendant on one corner: 1 triangle, 5 connected triples -> 3/5.
    ok('triangle with pendant transitivity 3/5', near(transitivity(4, [[0, 1], [1, 2], [0, 2], [2, 3]]), 0.6, 1e-12));
    ok('star clustering 0', clustering(5, [[0, 1], [0, 2], [0, 3], [0, 4]]) === 0);

    // Triad census against brute force on a random directed graph.
    const r = rng(7), n = 14, D = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && r() < 0.2) D.push([i, j]);
    const fast = triadCensus(n, D);
    const S = new Set(D.map(([a, b]) => key(a, b))), has = (a, b) => S.has(key(a, b));
    const brute = new Array(16).fill(0);
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) {
      brute[TRICODES[tricode(has, a, b, c)] - 1]++;
    }
    ok('triad census matches brute force', fast.every((x, i) => x === brute[i]), fast.join(','));
    // Each example triad, built alone on 3 nodes, lands in its own class.
    ok('triad examples classify to themselves', TRIADS.every((_, t) => triadCensus(3, triadEdges(t))[t] === 1));
    // Known class shapes: 030T is a feedforward loop (3 one-way edges, one node sends 2);
    // 030C is a 3-cycle; 300 is all six edges; 102 is one mutual pair.
    const shape = t => { const e = triadEdges(t), o = [0, 0, 0]; e.forEach(([a]) => o[a]++); return e.length + ':' + o.slice().sort().join(''); };
    ok('030T is a feedforward loop', shape(8) === '3:012');
    ok('030C is a cycle', shape(9) === '3:111');
    // MAN labels: 021D is A <- B -> C (one sender), 021U is A -> B <- C (one receiver),
    // 120D is 021D plus a mutual pair between the receivers.
    ok('021D is an out-star', shape(3) === '2:002');
    ok('021U is an in-star', shape(4) === '2:011');
    ok('120D: the sender of two one-way edges', (() => { const e = triadEdges(11), o = [0, 0, 0]; e.forEach(([a]) => o[a]++); return e.length === 4 && o.includes(2) && mutualPairs(e) === 1 && e.filter(([a]) => o[a] === 2).every(([a, b]) => !e.some(([c, d]) => c === b && d === a)); })());
    // 111D is A <-> B <- C (the one-way edge enters the pair), 111U is A <-> B -> C.
    const oneWay = t => { const e = triadEdges(t); return e.find(([a, b]) => !e.some(([c, d]) => c === b && d === a)); };
    const inPair = (t, x) => triadEdges(t).filter(([a, b]) => a === x || b === x).length >= 2 && triadEdges(t).some(([a, b]) => (a === x || b === x) && triadEdges(t).some(([c, d]) => c === b && d === a));
    ok('111D: one-way edge enters the pair', inPair(6, oneWay(6)[1]) && !inPair(6, oneWay(6)[0]));
    ok('111U: one-way edge leaves the pair', inPair(7, oneWay(7)[0]) && !inPair(7, oneWay(7)[1]));
    ok('300 is complete', triadEdges(15).length === 6);
    ok('102 is one mutual pair', triadEdges(2).length === 2 && mutualPairs(triadEdges(2)) === 1);

    // Null models preserve what they claim to.
    const big = nullER(60, 240, rng(3));
    ok('ER has the right edge count, no duplicates', big.length === 240 && undirected(60, big).length === 240);
    const sw = swap(60, big, rng(4)).edges;
    const d0 = degrees(60, big), d1 = degrees(60, sw);
    ok('swap preserves degrees', d0.every((x, i) => x === d1[i]) && undirected(60, sw).length === 240);
    const pos = Array.from({ length: 60 }, (_, i) => i), bins = distanceBins(60, (a, b) => Math.abs(pos[a] - pos[b]) + 1e-6 * (a + b), 8);
    const sl = swap(60, big, rng(5), { binOf: bins.binOf }).edges;
    const hist = e => { const h = new Array(8).fill(0); e.forEach(([a, b]) => h[bins.binOf(a, b)]++); return h.join(','); };
    const d2 = degrees(60, sl);
    ok('length-binned swap preserves degrees and bin histogram', d0.every((x, i) => x === d2[i]) && hist(sl) === hist(big));
    ok('spatial null preserves bin histogram', hist(nullSpatial(big, bins, rng(6))) === hist(big));
    const outDeg = e => { const o = new Array(n).fill(0), i = new Array(n).fill(0); e.forEach(([a, b]) => { o[a]++; i[b]++; }); return o.join() + '|' + i.join(); };
    const sd1 = swapDirected(n, D, rng(8));
    ok('directed swap preserves in and out degree', outDeg(sd1) === outDeg(D) && new Set(sd1.map(([a, b]) => key(a, b))).size === D.length);
    const sr = swapReciprocal(n, D, rng(9));
    ok('reciprocal swap preserves degrees and mutual pairs', outDeg(sr) === outDeg(D) && mutualPairs(sr) === mutualPairs(D) && new Set(sr.map(([a, b]) => key(a, b))).size === D.length,
      mutualPairs(sr) + ' vs ' + mutualPairs(D));
    return res;
  }

  // Checks on the shipped worm graph (worm-varshney.json) against values computed
  // independently with networkx 3 (average_clustering, all_pairs_shortest_path_length,
  // triadic_census) and against the published counts of Varshney et al. 2011.
  function dataChecks(data, log = console.log) {
    const res = [];
    const ok = (name, pass, detail = '') => { res.push({ name, pass }); log((pass ? 'pass ' : 'FAIL ') + name + (detail ? ': ' + detail : '')); };
    const n = data.nodes.length, D = data.chem.map(e => [e[0], e[1]]);
    ok('279 neurons, 2,194 chemical pairs, 6,394 synapses', n === 279 && D.length === 2194 && data.chem.reduce((s, e) => s + e[2], 0) === 6394);
    const U = undirected(n, D);
    ok('1,961 undirected pairs', U.length === 1961);
    const C = clustering(n, U), L = meanPath(n, U);
    ok('clustering 0.32030 (networkx)', Math.abs(C - 0.32030) < 5e-6, C.toFixed(5));
    ok('path length 2.56953 (networkx)', Math.abs(L - 2.56953) < 5e-6, L.toFixed(5));
    ok('transitivity 0.19874 (networkx)', Math.abs(transitivity(n, U) - 0.19874) < 5e-6, transitivity(n, U).toFixed(5));
    ok('233 reciprocal pairs', mutualPairs(D) === 233);
    const nx = [3077866, 409609, 55878, 7118, 8478, 12279, 3134, 3200, 1453, 65, 359, 385, 552, 180, 175, 48];
    const tc = triadCensus(n, D);
    ok('triad census equals networkx', tc.every((x, i) => x === nx[i]), tc.join(','));
    const UG = undirected(n, D.concat(data.gap.map(e => [e[0], e[1]]))), k = degrees(n, UG);
    const club = data.nodes.filter((_, i) => k[i] >= 44).map(d => d.name).sort().join(',');
    ok('degree >= 44 with gap junctions is Towlson 2013\'s rich club', club === 'AVAL,AVAR,AVBL,AVBR,AVDL,AVDR,AVEL,AVER,DVA,PVCL,PVCR', club);
    return res;
  }

  return {
    dataChecks, rng, undirected, csr, degrees, clustering, transitivity, meanPath, nullER, distanceBins, nullSpatial, swap,
    mutualPairs, swapDirected, swapReciprocal, triadCensus, triadEdges, TRIADS, mean, sd, runChecks,
  };
});
