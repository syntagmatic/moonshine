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
// Flow: SpringRank (De Bacco, Larremore and Moore 2018) by conjugate gradient, the
// share of weight running down a ranking, their direction-shuffling null, and the
// signal cascade of Winding et al. 2023 on a CSR graph.
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

  // ---- spectral ----

  // Eigendecomposition of a symmetric matrix (rows of Float64Array or arrays):
  // Householder reduction to tridiagonal form, then the implicit QL method
  // (tred2 and tql2, as in JAMA). Returns eigenvalues ascending and V with
  // V[i][j] = component i of eigenvector j.
  function eigh(M) {
    const n = M.length, V = M.map(r => Float64Array.from(r)), d = new Float64Array(n), e = new Float64Array(n);
    for (let j = 0; j < n; j++) d[j] = V[n - 1][j];
    for (let i = n - 1; i > 0; i--) {
      let scale = 0, h = 0;
      for (let k = 0; k < i; k++) scale += Math.abs(d[k]);
      if (scale === 0) {
        e[i] = d[i - 1];
        for (let j = 0; j < i; j++) { d[j] = V[i - 1][j]; V[i][j] = 0; V[j][i] = 0; }
      } else {
        for (let k = 0; k < i; k++) { d[k] /= scale; h += d[k] * d[k]; }
        let f = d[i - 1], g = Math.sqrt(h);
        if (f > 0) g = -g;
        e[i] = scale * g; h -= f * g; d[i - 1] = f - g;
        for (let j = 0; j < i; j++) e[j] = 0;
        for (let j = 0; j < i; j++) {
          f = d[j]; V[j][i] = f; g = e[j] + V[j][j] * f;
          for (let k = j + 1; k <= i - 1; k++) { g += V[k][j] * d[k]; e[k] += V[k][j] * f; }
          e[j] = g;
        }
        f = 0;
        for (let j = 0; j < i; j++) { e[j] /= h; f += e[j] * d[j]; }
        const hh = f / (h + h);
        for (let j = 0; j < i; j++) e[j] -= hh * d[j];
        for (let j = 0; j < i; j++) {
          f = d[j]; g = e[j];
          for (let k = j; k <= i - 1; k++) V[k][j] -= f * e[k] + g * d[k];
          d[j] = V[i - 1][j]; V[i][j] = 0;
        }
      }
      d[i] = h;
    }
    for (let i = 0; i < n - 1; i++) {
      V[n - 1][i] = V[i][i]; V[i][i] = 1;
      const h = d[i + 1];
      if (h !== 0) {
        for (let k = 0; k <= i; k++) d[k] = V[k][i + 1] / h;
        for (let j = 0; j <= i; j++) {
          let g = 0;
          for (let k = 0; k <= i; k++) g += V[k][i + 1] * V[k][j];
          for (let k = 0; k <= i; k++) V[k][j] -= g * d[k];
        }
      }
      for (let k = 0; k <= i; k++) V[k][i + 1] = 0;
    }
    for (let j = 0; j < n; j++) { d[j] = V[n - 1][j]; V[n - 1][j] = 0; }
    V[n - 1][n - 1] = 1; e[0] = 0;

    for (let i = 1; i < n; i++) e[i - 1] = e[i];
    e[n - 1] = 0;
    let f = 0, tst1 = 0;
    const eps = Math.pow(2, -52);
    for (let l = 0; l < n; l++) {
      tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
      let m = l;
      while (m < n - 1 && Math.abs(e[m]) > eps * tst1) m++;
      if (m > l) {
        do {
          let g = d[l], p = (d[l + 1] - g) / (2 * e[l]), r = Math.hypot(p, 1);
          if (p < 0) r = -r;
          d[l] = e[l] / (p + r); d[l + 1] = e[l] * (p + r);
          const dl1 = d[l + 1];
          let h = g - d[l];
          for (let i = l + 2; i < n; i++) d[i] -= h;
          f += h;
          p = d[m];
          let c = 1, c2 = c, c3 = c, s = 0, s2 = 0;
          const el1 = e[l + 1];
          for (let i = m - 1; i >= l; i--) {
            c3 = c2; c2 = c; s2 = s;
            g = c * e[i]; h = c * p; r = Math.hypot(p, e[i]);
            e[i + 1] = s * r; s = e[i] / r; c = p / r;
            p = c * d[i] - s * g; d[i + 1] = h + s * (c * g + s * d[i]);
            for (let k = 0; k < n; k++) {
              h = V[k][i + 1]; V[k][i + 1] = s * V[k][i] + c * h; V[k][i] = c * V[k][i] - s * h;
            }
          }
          p = -s * s2 * c3 * el1 * e[l] / dl1; e[l] = s * p; d[l] = c * p;
        } while (Math.abs(e[l]) > eps * tst1);
      }
      d[l] += f; e[l] = 0;
    }
    for (let i = 0; i < n - 1; i++) {
      let k = i, p = d[i];
      for (let j = i + 1; j < n; j++) if (d[j] < p) { k = j; p = d[j]; }
      if (k !== i) {
        d[k] = d[i]; d[i] = p;
        for (let j = 0; j < n; j++) { const t = V[j][i]; V[j][i] = V[j][k]; V[j][k] = t; }
      }
    }
    return { values: d, vectors: V };
  }

  // Dense symmetric weight matrix from undirected [a, b, w] edges (w defaults to 1).
  function dense(n, edges) {
    const A = Array.from({ length: n }, () => new Float64Array(n));
    for (const [a, b, w = 1] of edges) { A[a][b] += w; A[b][a] += w; }
    return A;
  }

  // The Fiedler vector: eigenvector of the second smallest eigenvalue of the
  // Laplacian L = D - A, or of the normalised Laplacian I - D^-1/2 A D^-1/2
  // (returned as D^-1/2 times the eigenvector, the random-walk form). Sorting
  // nodes by it minimises the relaxed sum of A_ij (x_i - x_j)^2 (spectral
  // seriation, Atkins, Boman and Hendrickson 1998). The graph must be connected.
  function fiedler(A, normalized = false) {
    const n = A.length, k = A.map(r => r.reduce((s, x) => s + x, 0));
    const L = A.map((r, i) => Float64Array.from(r, (x, j) => {
      const v = (i === j ? k[i] : 0) - x;
      return normalized ? (i === j ? 1 - x / k[i] : -x / Math.sqrt(k[i] * k[j])) : v;
    }));
    const { values, vectors } = eigh(L);
    const f = Float64Array.from(vectors, (r, i) => normalized ? r[1] / Math.sqrt(k[i]) : r[1]);
    return { vector: f, lambda2: values[1] };
  }

  // Mean |position(pre) - position(post)| over edges, positions given by an order
  // (order[p] = node at position p).
  function edgeSpan(order, edges) {
    const pos = new Int32Array(order.length);
    order.forEach((v, p) => { pos[v] = p; });
    let s = 0;
    for (const [a, b] of edges) s += Math.abs(pos[a] - pos[b]);
    return s / edges.length;
  }

  // Average controllability (Gu et al. 2015) of every node for a symmetric
  // weight matrix A: with A scaled to A / (c + xi), xi its largest |eigenvalue|,
  // and x(t+1) = A x(t) + e_i u(t), the trace of the controllability Gramian over
  // horizon T is sum_{t<T} |A^t e_i|^2 = sum_j V_ij^2 (1 - l_j^{2T}) / (1 - l_j^2);
  // T = Infinity gives sum_j V_ij^2 / (1 - l_j^2). Pass rho instead of c to scale
  // the largest |eigenvalue| to rho directly; pass eig = eigh(A) to reuse it.
  function avgControl(A, { c = 1, rho, T = Infinity, eig } = {}) {
    const n = A.length, { values, vectors } = eig || eigh(A);
    const xi = Math.max(Math.abs(values[0]), Math.abs(values[n - 1]));
    const scale = rho === undefined ? 1 / (c + xi) : rho / xi;
    const g = Float64Array.from(values, l => {
      const q = (l * scale) ** 2;
      return T === Infinity ? 1 / (1 - q) : (q === 1 ? T : (1 - q ** T) / (1 - q));
    });
    return Float64Array.from(vectors, r => r.reduce((s, v, j) => s + v * v * g[j], 0));
  }

  function pearson(x, y) {
    const n = x.length, mx = mean(x), my = mean(y);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : NaN;
  }
  // Ranks with ties averaged.
  function ranks(x) {
    const idx = Array.from(x, (_, i) => i).sort((a, b) => x[a] - x[b]), r = new Float64Array(x.length);
    for (let i = 0; i < idx.length;) {
      let j = i;
      while (j + 1 < idx.length && x[idx[j + 1]] === x[idx[i]]) j++;
      for (let k = i; k <= j; k++) r[idx[k]] = (i + j) / 2 + 1;
      i = j + 1;
    }
    return r;
  }
  const spearman = (x, y) => pearson(ranks(x), ranks(y));

  // Least-squares line y = a + b x, with R^2. Pass slope to fit the intercept only.
  function linfit(x, y, slope) {
    const mx = mean(x), my = mean(y);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < x.length; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
    const b = slope === undefined ? sxy / sxx : slope, a = my - b * mx;
    let ss = 0;
    for (let i = 0; i < x.length; i++) ss += (y[i] - a - b * x[i]) ** 2;
    return { intercept: a, slope: b, r2: 1 - ss / syy, se: Math.sqrt(ss / (x.length - 2) / sxx) };
  }

  // Solve Q x = b in place for symmetric positive definite Q (n x n, row-major
  // Float64Array). Returns false if Q is not positive definite.
  function cholSolve(Q, b, n) {
    for (let j = 0; j < n; j++) {
      const rj = j * n;
      let s = Q[rj + j];
      for (let k = 0; k < j; k++) s -= Q[rj + k] * Q[rj + k];
      if (!(s > 0)) return false;
      const d = Math.sqrt(s);
      Q[rj + j] = d;
      for (let i = j + 1; i < n; i++) {
        const ri = i * n;
        let t = Q[ri + j];
        for (let k = 0; k < j; k++) t -= Q[ri + k] * Q[rj + k];
        Q[ri + j] = t / d;
      }
    }
    for (let i = 0; i < n; i++) { let t = b[i]; for (let k = 0; k < i; k++) t -= Q[i * n + k] * b[k]; b[i] = t / Q[i * n + i]; }
    for (let i = n - 1; i >= 0; i--) { let t = b[i]; for (let k = i + 1; k < n; k++) t -= Q[k * n + i] * b[k]; b[i] = t / Q[i * n + i]; }
    return true;
  }

  // Wire-cost placement (Chen, Hall and Chklovskii 2006). Every node gets one
  // position x_i along a line; the cost is
  //   sum over edges [a, b, w] of (w / alpha) |x_a - x_b|^zeta
  //   + sum over anchors [i, kind, p, w] of (w / alpha if kind is 'm', else w) |x_i - p|^zeta
  // (edges may repeat; their weights add). Sensory endings ('s') have one dedicated
  // neurite each, so only synapses and muscles are divided by alpha, the number of
  // synapses that share one neurite. zeta = 2 is one linear solve; other zeta > 1 use
  // iteratively reweighted least squares with backtracking (the cost is convex).
  // pins: Map node -> fixed position. Returns { x, cost: {internal, external}, iters }.
  function placement(n, edges, anchors, { zeta = 2, alpha = 29.3, pins = new Map(), x0, maxIter = 200, tol = 1e-10 } = {}) {
    const free = [], slot = new Int32Array(n).fill(-1);
    for (let i = 0; i < n; i++) if (!pins.has(i)) { slot[i] = free.length; free.push(i); }
    const m = free.length;
    const E = edges.map(([a, b, w]) => [a, b, w / alpha]);
    const X = anchors.map(([i, k, p, w]) => [i, p, k === 'm' ? w / alpha : w]);
    let x = Float64Array.from({ length: n }, (_, i) => pins.has(i) ? pins.get(i) : x0 ? x0[i] : 0.5);
    const total = y => wireCost(y, edges, anchors, { zeta, alpha });
    const eps = 1e-4;
    const step = (y, first) => {
      // Reweighted quadratic: weight w |d|^(zeta - 2) at the current positions.
      const r = d => zeta === 2 || first ? 1 : Math.max(Math.abs(d), eps) ** (zeta - 2);
      const Q = new Float64Array(m * m), b = new Float64Array(m);
      for (const [a, c, w] of E) {
        const k = w * r(y[a] - y[c]), sa = slot[a], sc = slot[c];
        if (sa >= 0) { Q[sa * m + sa] += k; if (sc >= 0) { Q[sa * m + sc] -= k; } else b[sa] += k * y[c]; }
        if (sc >= 0) { Q[sc * m + sc] += k; if (sa >= 0) { Q[sc * m + sa] -= k; } else b[sc] += k * y[a]; }
      }
      for (const [i, p, w] of X) { const s = slot[i]; if (s < 0) continue; const k = w * r(y[i] - p); Q[s * m + s] += k; b[s] += k * p; }
      if (!cholSolve(Q, b, m)) throw new Error('placement: system is singular (a component has no anchor)');
      const out = Float64Array.from(y);
      free.forEach((v, s) => { out[v] = b[s]; });
      return out;
    };
    if (zeta === 2 || !x0) x = step(x, true);
    if (zeta === 2) return { x, cost: total(x), iters: 1 };
    const sum = c => c.internal + c.external;
    let c = sum(total(x)), it = 0;
    for (; it < maxIter; it++) {
      const y = step(x, false);
      let t = 1, z = y, cz = sum(total(z));
      while (cz > c && t > 1e-3) { t /= 2; z = x.map((v, i) => v + t * (y[i] - v)); cz = sum(total(z)); }
      if (cz > c) break;
      const done = c - cz <= tol * c;
      x = z; c = cz;
      if (done) break;
    }
    return { x, cost: total(x), iters: it + 1 };
  }

  // For the quadratic cost (zeta = 2): the rise in the minimum cost when node i
  // alone is pinned at target[i] and every other node re-settles, for every i at
  // once. Minimising a quadratic with one coordinate fixed leaves a parabola in that
  // coordinate whose curvature is 1 / (Q^-1)_ii, so the rise is
  // (target_i - x_i)^2 / (Q^-1)_ii, with x the unpinned optimum and Q the system
  // matrix of placement() (here without the factor 2 the gradient would carry).
  function pinPrice(n, edges, anchors, target, { alpha = 29.3 } = {}) {
    const Q = new Float64Array(n * n);
    for (const [a, b, w] of edges) { const k = w / alpha; Q[a * n + a] += k; Q[b * n + b] += k; Q[a * n + b] -= k; Q[b * n + a] -= k; }
    for (const [i, k, , w] of anchors) Q[i * n + i] += k === 'm' ? w / alpha : w;
    const L = Float64Array.from(Q), x = placement(n, edges, anchors, { alpha }).x;
    if (!cholSolve(L, new Float64Array(n), n)) throw new Error('pinPrice: singular');
    // (Q^-1)_ii = |L^-1 e_i|^2 summed over rows of L^-1: solve L y = e_i for each i.
    const diag = new Float64Array(n), y = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      y.fill(0);
      for (let r = i; r < n; r++) { let t = r === i ? 1 : 0; for (let k = i; k < r; k++) t -= L[r * n + k] * y[k]; y[r] = t / L[r * n + r]; diag[i] += y[r] * y[r]; }
    }
    return Float64Array.from(x, (v, i) => (target[i] - v) ** 2 / diag[i]);
  }

  // The two parts of the placement cost above for positions x.
  function wireCost(x, edges, anchors, { zeta = 2, alpha = 29.3 } = {}) {
    let internal = 0, external = 0;
    for (const [a, b, w] of edges) internal += w * Math.abs(x[a] - x[b]) ** zeta;
    for (const [i, k, p, w] of anchors) external += (k === 'm' ? w / alpha : w) * Math.abs(x[i] - p) ** zeta;
    return { internal: internal / alpha, external };
  }

  // ---- flow: SpringRank and signal cascades ----

  // SpringRank (De Bacco, Larremore and Moore 2018). Every directed edge [i, j, w]
  // is w springs of rest length 1 pulling s_i one unit above s_j; alpha pulls every
  // node toward 0. The ranks minimise
  //   1/2 sum w (s_i - s_j - 1)^2 + alpha/2 sum s_i^2,
  // so [D_out + D_in - (A + A^T) + alpha I] s = d_out - d_in (their Eq. 5). Undirected
  // edges (gap junctions) go in both directions, which nets to a spring of rest length 0
  // and stiffness 2w. The matrix is a sparse Laplacian plus alpha I; conjugate gradient
  // from 0 stays orthogonal to the constant vector, so alpha = 0 gives the mean-zero
  // solution of their Eq. 3. Returns { s, iters }.
  function springRank(n, edges, { alpha = 0, undirected: und = [], tol = 1e-12, maxIter = 10000 } = {}) {
    const all = edges.concat(und.flatMap(([a, b, w]) => [[a, b, w], [b, a, w]]));
    const diag = new Float64Array(n).fill(alpha), rhs = new Float64Array(n), nb = new Map();
    for (const [i, j, w] of all) {
      diag[i] += w; diag[j] += w; rhs[i] += w; rhs[j] -= w;
      const k = key(Math.min(i, j), Math.max(i, j));
      nb.set(k, (nb.get(k) || 0) + w);
    }
    const off = new Int32Array(n + 1);
    for (const k of nb.keys()) { off[Math.floor(k / 65536) + 1]++; off[k % 65536 + 1]++; }
    for (let i = 0; i < n; i++) off[i + 1] += off[i];
    const col = new Int32Array(off[n]), val = new Float64Array(off[n]), fill = off.slice(0, n);
    for (const [k, w] of nb) {
      const a = Math.floor(k / 65536), b = k % 65536;
      col[fill[a]] = b; val[fill[a]++] = w; col[fill[b]] = a; val[fill[b]++] = w;
    }
    const mul = (x, y) => {
      for (let i = 0; i < n; i++) {
        let t = diag[i] * x[i];
        for (let k = off[i]; k < off[i + 1]; k++) t -= val[k] * x[col[k]];
        y[i] = t;
      }
    };
    const s = new Float64Array(n), r = Float64Array.from(rhs), p = Float64Array.from(rhs), q = new Float64Array(n);
    const dot = (x, y) => { let t = 0; for (let i = 0; i < n; i++) t += x[i] * y[i]; return t; };
    let rr = dot(r, r), it = 0;
    const stop = tol * tol * Math.max(rr, 1e-300);
    for (; it < maxIter && rr > stop; it++) {
      mul(p, q);
      const a = rr / dot(p, q);
      for (let i = 0; i < n; i++) { s[i] += a * p[i]; r[i] -= a * q[i]; }
      const rn = dot(r, r);
      for (let i = 0; i < n; i++) p[i] = r[i] + (rn / rr) * p[i];
      rr = rn;
    }
    if (alpha === 0) { const m = mean(s); for (let i = 0; i < n; i++) s[i] -= m; }
    return { s, iters: it };
  }

  // Share of the weight of directed edges [i, j, w] that runs from a higher s to a
  // lower one ("down" the ranking), and the SpringRank energy per unit weight,
  // 1/(2M) sum w (s_i - s_j - 1)^2 (their test statistic, without the alpha term).
  function flowStats(s, edges) {
    let down = 0, tot = 0, h = 0;
    for (const [i, j, w] of edges) { tot += w; if (s[i] > s[j]) down += w; h += w * (s[i] - s[j] - 1) ** 2; }
    return { down: down / tot, energy: h / (2 * tot) };
  }

  // Their null for the energy test: keep the number of edges between every pair,
  // A_ij + A_ji, and give each one a direction by a fair coin.
  function randomDirections(edges, r) {
    const pair = new Map();
    for (const [i, j, w] of edges) { const k = key(Math.min(i, j), Math.max(i, j)); pair.set(k, (pair.get(k) || 0) + w); }
    const out = [];
    for (const [k, t] of pair) {
      const a = Math.floor(k / 65536), b = k % 65536;
      let f = 0;
      for (let u = 0; u < t; u++) if (r() < 0.5) f++;
      if (f) out.push([a, b, f]);
      if (t - f) out.push([b, a, t - f]);
    }
    return out;
  }

  // Signal cascade (Winding et al. 2023; their code: mwinding/connectome_tools,
  // traverse/cascade.py). Seeds are active at hop 0. At each hop every active node
  // that is not a stop node tries each out-edge [i -> j, w synapses] once, succeeding
  // with probability 1 - (1 - p)^w (each synapse transmits with p); targets active at
  // an earlier hop are dropped, so a node is active at most once per run. Stop nodes
  // (brain outputs) become active but do not pass the signal on. g: { n, off, to, w }
  // with to decoded (absolute column indices). Returns hits, a Float64Array n x hops
  // (hops = 9 for levels 0..8) of the share of runs in which node v was active at hop h,
  // at hits[v * hops + h].
  function cascade(g, seeds, stop, { p = 0.05, runs = 1000, hops = 9, seed = 1 } = {}) {
    const { n, off, to, w } = g, r = rng(seed);
    const q = Float64Array.from(w, x => 1 - (1 - p) ** x);
    const hits = new Float64Array(n * hops), seen = new Int32Array(n).fill(-1);
    let cur = new Int32Array(n), nxt = new Int32Array(n);
    for (let run = 0; run < runs; run++) {
      let nc = 0;
      for (const s of seeds) if (seen[s] !== run) { seen[s] = run; cur[nc++] = s; }
      for (let h = 0; h < hops && nc; h++) {
        let nn = 0;
        for (let k = 0; k < nc; k++) {
          const v = cur[k];
          hits[v * hops + h]++;
          if (stop[v]) continue;
          for (let e = off[v]; e < off[v + 1]; e++) {
            const t = to[e];
            if (seen[t] === run) continue; // active now, earlier, or already hit this hop
            if (r() < q[e]) { seen[t] = run; nxt[nn++] = t; }
          }
        }
        [cur, nxt] = [nxt, cur]; nc = nn;
      }
    }
    for (let i = 0; i < hits.length; i++) hits[i] /= runs;
    return hits;
  }

  // Decode the delta-encoded CSR of larva-winding.json into absolute column indices.
  function decodeCSR({ off, to, w }) {
    const n = off.length - 1, col = new Int32Array(to.length);
    for (let i = 0; i < n; i++) for (let k = off[i], j = 0; k < off[i + 1]; k++) { j = k === off[i] ? to[k] : j + to[k]; col[k] = j; }
    return { n, off: Int32Array.from(off), to: col, w: Int32Array.from(w) };
  }

  // The hop at which each node counts as reached: the first h >= 1 at which the share
  // of runs that have reached it by hop h is at least theta (the paper's threshold is
  // half the runs, summed over hops 1..8). -1 if never.
  function firstHop(hits, n, hops, theta, from = 1) {
    const out = new Int8Array(n).fill(-1);
    for (let v = 0; v < n; v++) {
      let c = 0;
      for (let h = from; h < hops; h++) { c += hits[v * hops + h]; if (c >= theta - 1e-12) { out[v] = h; break; } }
    }
    return out;
  }

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

    // Spectral: path graph P_n has Laplacian eigenvalues 2 - 2cos(k pi / n), and
    // its Fiedler vector is monotone along the path.
    const P = []; for (let i = 0; i < 9; i++) P.push([i, i + 1]);
    const AP = dense(10, P), LP = AP.map((row, i) => row.map((x, j) => (i === j ? row.reduce((s, y) => s + y, 0) : 0) - x));
    const ev = eigh(LP).values;
    ok('path P10 Laplacian eigenvalues 2 - 2cos(k pi/10)', ev.every((l, k) => near(l, 2 - 2 * Math.cos(k * Math.PI / 10), 1e-10)));
    const fv = fiedler(AP).vector, mono = s => fv.every((x, i) => i === 0 || s * (x - fv[i - 1]) > 0);
    ok('Fiedler vector of a path is monotone', mono(1) || mono(-1));
    // Random symmetric matrix: A V = V diag(values), V orthonormal.
    const R = Array.from({ length: 12 }, () => new Float64Array(12)), rr = rng(12);
    for (let i = 0; i < 12; i++) for (let j = i; j < 12; j++) R[i][j] = R[j][i] = rr() * 2 - 1;
    const E2 = eigh(R);
    let err = 0;
    for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
      let av = 0, vv = 0;
      for (let k = 0; k < 12; k++) { av += R[i][k] * E2.vectors[k][j]; vv += E2.vectors[k][i] * E2.vectors[k][j]; }
      err = Math.max(err, Math.abs(av - E2.values[j] * E2.vectors[i][j]), Math.abs(vv - (i === j ? 1 : 0)));
    }
    ok('eigh: A V = V L and V orthonormal', err < 1e-10, err.toExponential(1));
    // Average controllability against the Gramian summed directly.
    const W4 = dense(5, [[0, 1, 2], [1, 2, 1], [2, 3, 3], [3, 4, 1], [0, 4, 1], [1, 3, 2]]);
    const xi = Math.max(...eigh(W4).values.map(Math.abs)), An = W4.map(r => r.map(x => x / (1 + xi)));
    const direct = T => W4.map((_, i) => {
      let v = W4.map((__, j) => (j === i ? 1 : 0)), s = 0;
      for (let t = 0; t < T; t++) { s += v.reduce((a, x) => a + x * x, 0); v = An.map(r => r.reduce((a, x, j) => a + x * v[j], 0)); }
      return s;
    });
    const ac3 = avgControl(W4, { T: 3 }), d3v = direct(3), acInf = avgControl(W4), d400 = direct(400);
    ok('average controllability, T = 3, equals the summed Gramian', ac3.every((x, i) => near(x, d3v[i], 1e-12)));
    ok('average controllability, T = infinity, equals the long sum', acInf.every((x, i) => near(x, d400[i], 1e-9)));
    // T = 2 is 1 plus the squared weights of the node's column, scaled.
    const ac2 = avgControl(W4, { T: 2 });
    ok('T = 2 is 1 + sum of squared weights / (1 + xi)^2', ac2.every((x, i) => near(x, 1 + W4[i].reduce((s, w) => s + w * w, 0) / (1 + xi) ** 2, 1e-12)));
    // Placement: a chain held at both ends by stiff anchors spreads evenly.
    const chain = placement(4, [[0, 1, 2], [1, 2, 2], [2, 3, 2]], [[0, 's', 0, 1e9], [3, 's', 1, 1e9]], { alpha: 2 }).x;
    ok('placement: chain between two anchors is evenly spaced', [0, 1 / 3, 2 / 3, 1].every((v, i) => near(chain[i], v, 1e-7)), Array.from(chain, v => v.toFixed(4)).join(' '));
    // One free node, three anchors, zeta = 1.5: compare with golden-section search.
    const A3 = [[0, 's', 0, 1], [0, 'm', 0.6, 3], [0, 's', 1, 2]];
    const f1 = x => wireCost([x], [], A3, { zeta: 1.5, alpha: 1 }).external;
    let lo = 0, hi = 1;
    for (let k = 0; k < 200; k++) { const m1 = lo + (hi - lo) * 0.382, m2 = lo + (hi - lo) * 0.618; if (f1(m1) < f1(m2)) hi = m2; else lo = m1; }
    const p3 = placement(1, [], A3, { zeta: 1.5, alpha: 1, x0: [0.5] }).x[0];
    ok('placement: zeta = 1.5 single node matches golden-section search', near(p3, lo, 1e-5), p3.toFixed(6) + ' vs ' + lo.toFixed(6));
    // Small random graph, zeta = 3 and 1.5, one node pinned: the gradient vanishes at every free node.
    const r5 = rng(7), E5 = Array.from({ length: 11 }, (_, i) => [i, i + 1, 1]), A5 = [];
    for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) if (r5() < 0.3) E5.push([a, b, 1 + Math.floor(r5() * 5)]);
    for (let i = 0; i < 12; i += 2) A5.push([i, i % 4 ? 'm' : 's', r5(), 1 + r5() * 3]);
    for (const zeta of [1.5, 3]) {
      const pins = new Map([[3, 0.9]]), x0 = placement(12, E5, A5, { alpha: 4, pins }).x;
      const P = placement(12, E5, A5, { zeta, alpha: 4, pins, x0, tol: 1e-14 }).x;
      const g = new Float64Array(12), dz = d => zeta * Math.abs(d) ** (zeta - 1) * Math.sign(d);
      for (const [a, b, w] of E5) { const t = w / 4 * dz(P[a] - P[b]); g[a] += t; g[b] -= t; }
      for (const [i, k, p, w] of A5) g[i] += (k === 'm' ? w / 4 : w) * dz(P[i] - p);
      const gmax = Math.max(...Array.from(g).filter((_, i) => i !== 3).map(Math.abs));
      ok(`placement: zeta = ${zeta} gradient vanishes at free nodes, pin held`, gmax < 1e-4 && P[3] === 0.9, gmax.toExponential(1));
    }
    const lf = linfit([0, 1, 2, 3], [1, 3, 4, 8]);
    ok('linfit slope 2.2, intercept 0.7, R^2 1 - 1.8 / 26', near(lf.slope, 2.2, 1e-12) && near(lf.intercept, 0.7, 1e-12) && near(lf.r2, 1 - 1.8 / 26, 1e-12), lf.r2.toFixed(6));
    ok('rho = xi / (1 + xi) is the same as c = 1', avgControl(W4, { rho: xi / (1 + xi) }).every((x, i) => near(x, acInf[i], 1e-12)));
    ok('Spearman with ties', near(spearman([1, 2, 2, 3], [1, 2, 3, 4]), 0.9486832980505138, 1e-12));

    // SpringRank: a directed path relaxes every spring, heights 1, 0, -1, energy 0, all down.
    const sp = springRank(3, [[0, 1, 1], [1, 2, 1]]).s;
    ok('SpringRank of a path is 1, 0, -1 with zero energy', [1, 0, -1].every((v, i) => near(sp[i], v, 1e-10)) && near(flowStats(sp, [[0, 1, 1], [1, 2, 1]]).energy, 0, 1e-20) && flowStats(sp, [[0, 1, 1], [1, 2, 1]]).down === 1);
    // Random weighted digraph: conjugate gradient equals a dense solve of Eq. 5, and an
    // undirected edge equals the same edge listed in both directions.
    const rs = rng(21), E6 = [], U6 = [];
    for (let a = 0; a < 15; a++) for (let b = 0; b < 15; b++) if (a !== b && rs() < 0.25) E6.push([a, b, 1 + Math.floor(rs() * 6)]);
    for (let a = 0; a < 15; a++) for (let b = a + 1; b < 15; b++) if (rs() < 0.1) U6.push([a, b, 1 + Math.floor(rs() * 3)]);
    const Q6 = new Float64Array(225), b6 = new Float64Array(15);
    for (const [a, b, w] of E6) { Q6[a * 15 + a] += w; Q6[b * 15 + b] += w; Q6[a * 15 + b] -= w; Q6[b * 15 + a] -= w; b6[a] += w; b6[b] -= w; }
    for (let i = 0; i < 15; i++) Q6[i * 16] += 0.7;
    cholSolve(Q6, b6, 15);
    const cg = springRank(15, E6, { alpha: 0.7 }).s;
    ok('SpringRank by conjugate gradient equals the dense solve (alpha 0.7)', cg.every((v, i) => near(v, b6[i], 1e-9)));
    const both = springRank(15, E6.concat(U6.flatMap(([a, b, w]) => [[a, b, w], [b, a, w]])), { alpha: 0.7 }).s;
    ok('undirected edges equal edges in both directions', springRank(15, E6, { alpha: 0.7, undirected: U6 }).s.every((v, i) => near(v, both[i], 1e-9)));
    const pairTot = e => { const m = new Map(); e.forEach(([a, b, w]) => { const k = key(Math.min(a, b), Math.max(a, b)); m.set(k, (m.get(k) || 0) + w); }); return Array.from(m).sort((x, y) => x[0] - y[0]).join(); };
    ok('random directions keep each pair\'s total', pairTot(randomDirections(E6, rng(3))) === pairTot(E6));
    // Cascade with p = 1: every connection transmits, so hops are BFS layers, each node
    // active once, and stop nodes are reached but pass nothing on.
    const C7 = [[0, 1, 1], [0, 2, 3], [1, 3, 1], [2, 3, 1], [3, 4, 2], [2, 5, 1], [5, 6, 1], [4, 0, 1]];
    const csr7 = (n, e) => {
      const off = new Int32Array(n + 1); e.forEach(([a]) => off[a + 1]++);
      for (let i = 0; i < n; i++) off[i + 1] += off[i];
      const f = off.slice(0, n), to = new Int32Array(e.length), w = new Int32Array(e.length);
      e.slice().sort((x, y) => x[0] - y[0] || x[1] - y[1]).forEach(([a, b, c]) => { to[f[a]] = b; w[f[a]++] = c; });
      return { n, off, to, w };
    };
    const g7 = csr7(7, C7), stop7 = [0, 0, 0, 0, 0, 1, 0];
    const h7 = cascade(g7, [0], stop7, { p: 1, runs: 3, hops: 5 });
    const want = [0, 1, 1, 2, 3, 2, -1]; // 6 sits behind stop node 5; 0 is never re-activated by 4
    ok('cascade at p = 1 is breadth-first layers with stop nodes', want.every((hh, v) => Array.from({ length: 5 }, (_, h) => h7[v * 5 + h]).every((x, h) => x === (h === hh ? 1 : 0))));
    // One connection of w synapses is crossed with probability 1 - (1 - p)^w.
    const h8 = cascade(csr7(2, [[0, 1, 4]]), [0], [0, 0], { p: 0.1, runs: 40000, hops: 2, seed: 5 });
    const pw = 1 - 0.9 ** 4;
    ok('cascade crosses a 4-synapse connection with probability 1 - 0.9^4', Math.abs(h8[3] - pw) < 4 * Math.sqrt(pw * (1 - pw) / 40000), h8[3].toFixed(4) + ' vs ' + pw.toFixed(4));
    // firstHop: cumulative share reaching theta.
    const fh = firstHop(Float64Array.from([1, 0, 0, 0, 0.3, 0.3, 0, 0.1, 0.4]), 3, 3, 0.5);
    ok('first hop by cumulative share', fh[0] === -1 && fh[1] === 2 && fh[2] === 2);
    const dc = decodeCSR({ off: [0, 2, 3, 3], to: [1, 1, 0], w: [5, 6, 7] });
    ok('delta-encoded CSR decodes', Array.from(dc.to).join() === '1,2,0' && Array.from(dc.w).join() === '5,6,7');
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
    // Article 5, against numpy 2.0 (numpy.linalg.eigh, scipy.stats.spearmanr).
    const ap = data.nodes.map(d => d.ap), F = fiedler(dense(n, U));
    const ord = Array.from(F.vector.keys()).sort((a, b) => F.vector[a] - F.vector[b]);
    ok('Laplacian lambda2 0.8847, spectral edge span 33.02 (numpy)', Math.abs(F.lambda2 - 0.88470) < 5e-5 && Math.abs(edgeSpan(ord, D) - 33.02) < 0.005,
      F.lambda2.toFixed(5) + ', ' + edgeSpan(ord, D).toFixed(3));
    ok('Fiedler vector rank correlation with body position 0.776 (numpy)', Math.abs(Math.abs(spearman(F.vector, ap)) - 0.77591) < 5e-5, spearman(F.vector, ap).toFixed(5));
    const W = dense(n, data.chem.concat(data.gap)), s = W.map(r => r.reduce((x, y) => x + y, 0)), ac = avgControl(W);
    ok('average controllability vs strength r 0.822, rho 0.734 (numpy, c = 1, T infinite)', Math.abs(pearson(ac, s) - 0.8222) < 5e-4 && Math.abs(spearman(ac, s) - 0.7338) < 5e-4,
      pearson(ac, s).toFixed(4) + ', ' + spearman(ac, s).toFixed(4));
    return res;
  }

  // Article 4's data (worm-anchors.json, macaque-fln.json) against numpy 2.0 and
  // scipy 1.13 (numpy.linalg.solve for zeta = 2, L-BFGS-B for zeta = 1.5 and 3).
  function wireChecks(worm, anch, fln, log = console.log) {
    const res = [];
    const ok = (name, pass, detail = '') => { res.push({ name, pass }); log((pass ? 'pass ' : 'FAIL ') + name + (detail ? ': ' + detail : '')); };
    const n = worm.nodes.length, ap = worm.nodes.map(d => d.ap), A = anch.anchors;
    ok('649 anchors on 199 neurons', A.length === 649 && new Set(A.map(a => a[0])).size === 199);
    const E = worm.chem.concat(worm.gap), devs = x => Array.from(x, (v, i) => Math.abs(v - ap[i]));
    const med = a => { const s = a.slice().sort((p, q) => p - q); return (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2; };
    const P = placement(n, E, A), dv = devs(P.x), c = P.cost.internal + P.cost.external;
    ok('zeta 2, alpha 29.3: mean deviation 0.09689, median 0.05203, cost 4.88213 (numpy)', Math.abs(mean(dv) - 0.09689) < 5e-6 && Math.abs(med(dv) - 0.05203) < 5e-6 && Math.abs(c - 4.882127) < 5e-6,
      mean(dv).toFixed(5) + ', ' + med(dv).toFixed(5) + ', ' + c.toFixed(6));
    const ca = wireCost(ap, E, A), ratio = (ca.internal + ca.external) / c;
    ok('actual layout costs 4.1765 times the optimum (internal 5.8455, external 1.3606)', Math.abs(ratio - 4.1765) < 5e-5 && Math.abs(ca.internal / P.cost.internal - 5.8455) < 5e-5 && Math.abs(ca.external / P.cost.external - 1.3606) < 5e-5, ratio.toFixed(4));
    for (const [zeta, want, wc] of [[1.5, 0.10578, 11.08837], [3, 0.10470, 1.039424]]) {
      const Q = placement(n, E, A, { zeta, x0: P.x }), m = mean(devs(Q.x)), cq = Q.cost.internal + Q.cost.external;
      ok(`zeta ${zeta}: mean deviation ${want}, cost ${wc} (L-BFGS-B)`, Math.abs(m - want) < 1e-4 && Math.abs(cq - wc) / wc < 1e-5, m.toFixed(5) + ', ' + cq.toFixed(6) + ', ' + Q.iters + ' iterations');
    }
    const pr = pinPrice(n, E, A, ap), top = Array.from(pr.keys()).sort((a, b) => pr[b] - pr[a]);
    const direct = top.slice(0, 3).map(i => { const Q = placement(n, E, A, { pins: new Map([[i, ap[i]]]) }); return Q.cost.internal + Q.cost.external - c; });
    ok('pinPrice equals a direct pinned solve; costliest AVAR, AVAL, PVCR, PVCL, DVA', direct.every((d, k) => Math.abs(d - pr[top[k]]) < 1e-9 * c) &&
      top.slice(0, 5).map(i => worm.nodes[i].name).join() === 'AVAR,AVAL,PVCR,PVCL,DVA', top.slice(0, 5).map(i => worm.nodes[i].name + ' ' + (100 * pr[i] / c).toFixed(1)).join(', '));
    const pins = new Map(top.slice(0, 10).map(i => [i, ap[i]])), Q10 = placement(n, E, A, { pins });
    ok('ten costliest pinned at their cell bodies: 2.46 times the optimum (numpy)', Math.abs((Q10.cost.internal + Q10.cost.external) / c - 2.46) < 0.005, ((Q10.cost.internal + Q10.cost.external) / c).toFixed(4));
    const F = fln.pathways, L = linfit(F.map(p => p[2]), F.map(p => Math.log10(p[3])));
    ok('628 pathways into 11 targets', F.length === 628 && new Set(F.map(p => p[0])).size === 11);
    ok('pooled fit: lambda 0.15955 per mm, R^2 0.26408 (numpy polyfit)', Math.abs(-L.slope * Math.LN10 - 0.15955) < 5e-6 && Math.abs(L.r2 - 0.26408) < 5e-6, (-L.slope * Math.LN10).toFixed(5) + ', ' + L.r2.toFixed(5));
    return res;
  }

  // Article 6's data: SpringRank of the worm against numpy 2.0 (dense lstsq / solve of
  // Eq. 3 and 5), and the larval cascades against an independent numpy implementation
  // of Winding et al.'s cascade (1,000 runs per modality, a different random stream, so
  // compared within Monte Carlo error).
  function flowChecks(worm, larva, log = console.log) {
    const res = [];
    const ok = (name, pass, detail = '') => { res.push({ name, pass }); log((pass ? 'pass ' : 'FAIL ') + name + (detail ? ': ' + detail : '')); };
    const n = worm.nodes.length, E = worm.chem;
    const s0 = springRank(n, E).s, f0 = flowStats(s0, E);
    ok('worm SpringRank: s of ADAL, ADAR, ADEL 0.627137, 0.407969, 0.870302 (numpy)', [0.627137, 0.407969, 0.870302].every((v, i) => Math.abs(s0[i] - v) < 5e-7));
    ok('89.0% of synapses run down, energy 0.1976 per synapse (numpy)', Math.abs(f0.down - 0.8896) < 5e-5 && Math.abs(f0.energy - 0.1976) < 5e-5, f0.down.toFixed(4) + ', ' + f0.energy.toFixed(4));
    const sg = springRank(n, E, { undirected: worm.gap }).s, s1 = springRank(n, E, { alpha: 1 }).s;
    ok('with gap junctions s(ADAL) 0.518246, down 0.8833; alpha 1 s(ADAL) 0.580123 (numpy)', Math.abs(sg[0] - 0.518246) < 5e-7 && Math.abs(flowStats(sg, E).down - 0.8833) < 5e-5 && Math.abs(s1[0] - 0.580123) < 5e-7);
    const L = larva, g = decodeCSR(L.ad), syn = g.w.reduce((a, b) => a + b, 0);
    ok('larva: 2,952 neurons, 63,545 axon-to-dendrite connections, 234,958 synapses', g.n === 2952 && g.to.length === 63545 && syn === 234958);
    const seeds = L.modalities.map((_, k) => L.mod.flatMap((m, i) => (m === k ? [i] : [])));
    ok('seed neurons per modality as in the authors\' CATMAID annotations', seeds.map(s => s.length).join() === '42,131,107,85,4,6,29,12,12,2,8,26');
    ok('420 output neurons: 182 DN-VNC, 184 DN-SEZ, 54 RGN', [0, 1, 2].map(k => L.out.filter(o => o === k).length).join() === '182,184,54');
    const ty = L.type.map(t => L.types[t]), stop = L.out.map(o => o >= 0);
    const brain = Array.from({ length: g.n }, (_, i) => i).filter(i => L.mod[i] < 0 && ty[i] !== 'sensory' && ty[i] !== 'ascending');
    const tot = [1835.2, 1955.7, 1844.7, 1527.3, 1596.3, 1588.5, 1628.2, 1620.9, 1627.5, 1323.9, 1363.2, 1368.6];
    const mh = [3.382, 3.332, 3.900, 5.486, 4.974, 5.095, 4.901, 4.677, 4.861, 6.085, 6.052, 6.009];
    const fh = [], dev = [];
    seeds.forEach((sd, k) => {
      const h = cascade(g, sd, stop, { seed: k + 1 }), f = firstHop(h, g.n, 9, 0.5);
      let t = 0; for (const v of h) t += v;
      let s = 0, c = 0; for (const i of brain) if (f[i] > 0) { s += f[i]; c++; }
      fh.push(f); dev.push([Math.abs(t - tot[k]) / tot[k], Math.abs(s / c - mh[k])]);
    });
    ok('cascades: expected activations within 1.5%, mean hop within 0.05 of numpy, all 12 modalities', dev.every(([a, b]) => a < 0.015 && b < 0.05),
      'worst ' + (100 * Math.max(...dev.map(d => d[0]))).toFixed(2) + '%, ' + Math.max(...dev.map(d => d[1])).toFixed(3));
    let reached = 0, uni = 0;
    for (const i of brain) { const k = fh.filter(f => f[i] > 0).length; if (k) reached++; if (k === 1) uni++; }
    ok('2,476 brain neurons; one modality only for 11.7% of those reached (numpy 11.8%)', brain.length === 2476 && Math.abs(100 * uni / reached - 11.8) < 0.5, (100 * uni / reached).toFixed(1) + '%');
    return res;
  }

  return {
    dataChecks, flowChecks, rng, undirected, csr, degrees, clustering, transitivity, meanPath, nullER, distanceBins, nullSpatial, swap,
    mutualPairs, swapDirected, swapReciprocal, triadCensus, triadEdges, TRIADS, mean, sd, runChecks,
    eigh, dense, fiedler, edgeSpan, avgControl, pearson, ranks, spearman, linfit, cholSolve, placement, pinPrice, wireCost, wireChecks,
    springRank, flowStats, randomDirections, cascade, decodeCSR, firstHop,
  };
});
