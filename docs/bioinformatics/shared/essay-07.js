// BioEssay07: the models behind essay 07, Dimensionality Reduction. Simulated single cells
// (counts drawn from a library size, then normalized), PCA by Jacobi eigendecomposition, exact
// t-SNE with scikit-learn's default optimizer settings, UMAP following umap-learn, and the
// measures the essay plots:
// neighbor recall against k, pairwise-distance rank correlation, centroid-distance ranks.
// Browser global `BioEssay07`, and `module.exports` under node. No fetch, no Math.random.
//
// ---- Same layout in every engine ---------------------------------------------------
// Math.exp, Math.log, Math.sin and Math.cos are "implementation-approximated" in ECMAScript,
// and engines differ in the last bit. t-SNE is chaotic, so a one-ulp difference at iteration 1
// becomes a different map by iteration 100. Everything here that feeds a layout uses the
// functions in `dmath` instead: range reduction and a polynomial in +, -, *, / only, which
// IEEE 754 fixes to the bit (JS has no fused multiply-add). Math.sqrt is used where needed;
// IEEE 754 requires it correctly rounded. Seeded runs are therefore bit-identical across
// engines; runChecks pins the default layouts by fingerprint.
//
// ---- API -------------------------------------------------------------------------
//   dmath.exp/log/sin/cos(x)     deterministic versions (|error| ~ 1 ulp)
//   mulberry32(seed) -> rng      uniform [0, 1)
//   gaussian(rng)                standard normal (Marsaglia polar, dmath.log)
//   poisson(rng, lambda)         Knuth's product method (lambda up to a few hundred)
//   GENES, TYPES, GRADIENT       the 24 genes, 5 cell types, per-type gradient names
//   simulateCells(opts)          { cells: [{id, type, s, lib, counts}], genes, types }
//                                opts.seed (2718), opts.perType (100). Counts ~ Poisson(lib * fraction(type, s, gene))
//   expression(sim, mode)        rows of log(1 + x): mode "norm" uses x = counts / lib * 1e4
//                                (scanpy normalize_total + log1p); "raw" uses x = counts
//   moons({noise, seed, n})      two interlocking half-moons + 10 noise dimensions
//   pca(X, k)                    { Y, values, vectors, explained, mean } via jacobiEigen
//   jacobiEigen(A)               { values (descending), vectors (columns as rows) }
//   sqdist(X)                    Float64Array n*n of squared Euclidean distances
//   affinities(D, perplexity)    joint P (n*n, symmetric, sums to 1), sklearn's construction
//   tsneSettings(n)              { perplexity 30, exaggeration 12, exaggerationIters 250,
//                                  momentum 0.5 -> 0.8, learningRate max(n/12/4, 50), iters 1000 }
//   TSNE(X, opts)                { Y, step(), iter, kl(), total } exact gradient, sklearn gains
//   tsneRun(X, opts)             runs to opts.iters and returns the TSNE object
//   klDivergence(P, Y)           KL(P || Q) for a layout
//   gradient(P, Y, exag)         the exact gradient (for the finite-difference check)
//   rankMatrix(D, n)             per row, the rank of every other point (0 = nearest)
//   recallCurve(Dhigh, Dlow, n)  r[k] = mean |kNN_high ∩ kNN_low| / k, k = 1..n-1
//   groupScore(D, n, labels, k)  share of each point's k nearest that share its label
//   pairDistances(X)             Float64Array of the n(n-1)/2 Euclidean distances
//   spearman(a, b)               rank correlation (average ranks for ties)
//   pearson(a, b)
//   centroids(X, labels, g)      per-group mean rows
//   umapSettings(n)              umap-learn defaults: 15 neighbors, min_dist 0.1, spread 1, 500 epochs
//                                (n <= 10,000), 5 negative samples, init "spectral" | "random" | array
//   fitAB(spread, minDist)       { a, b } by Levenberg-Marquardt, as find_ab_params
//   smoothKnn(knnD, k)           { sigma, rho } per point, as smooth_knn_dist
//   fuzzyGraph(X, opts)          { W (dense n*n fuzzy union), knnIdx, knnD, sigma, rho }
//   graphComponents(W, n)        { labels, count }
//   componentLayout, spectralLayout   umap-learn's spectral start, multi-component case included
//   UMAP(X, opts)                { Y, step() (one epoch), iter, total, a, b, spectral } ; umapRun runs it out
//   fingerprint(Y)               short hash of a layout's exact bits
//   runChecks(print, data) -> [{name, ok, detail}]
(function (root) {
  "use strict";

  // ---------------- deterministic elementary functions ----------------
  const LN2 = 0.6931471805599453;
  const LN2_HI = 6.93147180369123816490e-01, LN2_LO = 1.90821492927058770002e-10;
  const INV_LN2 = 1.4426950408889634;
  // exact powers of two, 2^-1074 .. 2^1023
  const POW2 = new Float64Array(2098);
  (function () { let v = 1; for (let k = 0; k <= 1023; k++) { POW2[k + 1074] = v; v *= 2; }
    v = 1; for (let k = 0; k >= -1074; k--) { POW2[k + 1074] = v; v *= 0.5; } })();
  function pow2(k) { return POW2[k + 1074]; }

  function dexp(x) {
    if (x !== x) return NaN;
    if (x > 709.78) return Infinity;
    if (x < -745.2) return 0;
    const k = Math.round(x * INV_LN2);
    const r = (x - k * LN2_HI) - k * LN2_LO;
    // e^r, |r| <= 0.347, Taylor to r^14 (truncation < 1e-18)
    let p = 1 / 87178291200;
    p = p * r + 1 / 6227020800; p = p * r + 1 / 479001600; p = p * r + 1 / 39916800;
    p = p * r + 1 / 3628800; p = p * r + 1 / 362880; p = p * r + 1 / 40320; p = p * r + 1 / 5040;
    p = p * r + 1 / 720; p = p * r + 1 / 120; p = p * r + 1 / 24; p = p * r + 1 / 6;
    p = p * r + 0.5; p = p * r + 1; p = p * r + 1;
    if (k > 1023) return p * 2 * pow2(k - 1);
    if (k < -1022) return (p * pow2(-1000)) * pow2(k + 1000);
    return p * pow2(k);
  }
  function dlog(x) {
    if (x !== x || x < 0) return NaN;
    if (x === 0) return -Infinity;
    if (x === Infinity) return Infinity;
    let m = x, e = 0;
    while (m >= 2) { m *= 0.5; e++; }
    while (m < 1) { m *= 2; e--; }
    if (m > 1.4142135623730951) { m *= 0.5; e++; }
    const s = (m - 1) / (m + 1), s2 = s * s;
    // 2 atanh(s) = 2 (s + s^3/3 + ...), |s| <= 0.1716, to s^31
    let t = 1 / 31;
    for (let j = 29; j >= 1; j -= 2) t = t * s2 + 1 / j;
    const lm = 2 * s * t;
    return e * LN2_HI + (e * LN2_LO + lm);
  }
  const PI = 3.141592653589793, HALF_PI = 1.5707963267948966;
  // sin on [-pi/2, pi/2] by Taylor to x^23
  function sinCore(x) {
    const x2 = x * x;
    let p = -1 / 25852016738884976640000;
    const c = [1 / 51090942171709440000, -1 / 121645100408832000, 1 / 355687428096000, -1 / 1307674368000,
      1 / 6227020800, -1 / 39916800, 1 / 362880, -1 / 5040, 1 / 120, -1 / 6, 1];
    for (let i = 0; i < c.length; i++) p = p * x2 + c[i];
    return p * x;
  }
  function dsin(x) {
    // reduce to [-pi, pi], then fold to [-pi/2, pi/2]
    const k = Math.round(x / (2 * PI));
    let r = x - k * 2 * PI;
    if (r > HALF_PI) r = PI - r; else if (r < -HALF_PI) r = -PI - r;
    return sinCore(r);
  }
  function dcos(x) { return dsin(HALF_PI - x); }
  const dmath = { exp: dexp, log: dlog, sin: dsin, cos: dcos };

  // ---------------- randomness ----------------
  function mulberry32(s) {
    return function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function gaussian(rng) {
    let u, v, s;
    do { u = 2 * rng() - 1; v = 2 * rng() - 1; s = u * u + v * v; } while (s >= 1 || s === 0);
    return u * Math.sqrt(-2 * dlog(s) / s);
  }
  function poisson(rng, lambda) {
    if (lambda <= 0) return 0;
    // split large lambda into chunks so exp(-chunk) stays well inside double range
    let total = 0, left = lambda;
    while (left > 0) {
      const l = Math.min(left, 200); left -= l;
      const L = dexp(-l); let k = 0, p = 1;
      do { k++; p *= rng(); } while (p > L);
      total += k - 1;
    }
    return total;
  }

  // ---------------- simulated cells ----------------
  // Real HGNC symbols as labels for invented expression fractions (Seurat PBMC3k marker table:
  // IL7R/CCR7 naive CD4 T, IL7R/S100A4 memory CD4 T, CD14/LYZ classical monocytes,
  // FCGR3A/MS4A7 non-classical monocytes, GNLY/NKG7 NK, MS4A1 B, FCER1A/CST3 dendritic).
  const TYPES = ["T cell", "NK cell", "B cell", "Monocyte", "Dendritic"];
  const GENES = ["CD3D", "CD3E", "IL7R", "CCR7", "S100A4", "CCL5", "GZMA", "NKG7", "GNLY", "KLRD1",
    "FCGR3A", "MS4A1", "CD79A", "CD19", "CD14", "LYZ", "S100A8", "FCER1A", "CST3", "CLEC10A",
    "PTPRC", "ACTB", "MALAT1", "B2M"];
  const GRADIENT = ["naive to memory", "CD56-bright to CD56-dim", null, "classical (CD14) to non-classical (FCGR3A)", null];
  const AMBIENT = 2e-4;           // fraction for a gene the type does not express
  const MEDIAN_LIB = 2000, LIB_SD = 0.45;
  // expected fraction of a cell's transcripts for gene g, given type t and gradient position s
  // gradients are exponential in s, so they are linear after the log transform
  function ramp(lo, hi, s) { return lo * dexp(s * dlog(hi / lo)); }
  function fraction(t, s, g) {
    const pan = { PTPRC: 0.006, ACTB: 0.025, MALAT1: 0.04, B2M: 0.03 };
    if (pan[g]) return pan[g];
    let f = 0;
    if (t === 0) f = { CD3D: 0.010, CD3E: 0.008, IL7R: 0.007, CCR7: ramp(0.012, 0.0004, s), S100A4: ramp(0.0004, 0.012, s),
      CCL5: ramp(0.0002, 0.008, s), GZMA: ramp(0.0002, 0.004, s) }[g];
    else if (t === 1) f = { NKG7: 0.015, GNLY: 0.015, KLRD1: 0.008, CCL5: 0.008, GZMA: ramp(0.003, 0.010, s),
      FCGR3A: ramp(0.001, 0.010, s), S100A4: 0.004 }[g];
    else if (t === 2) f = { MS4A1: 0.010, CD79A: 0.012, CD19: 0.005 }[g];
    else if (t === 3) f = { CD14: ramp(0.015, 0.0005, s), LYZ: 0.025, S100A8: ramp(0.025, 0.002, s), FCGR3A: ramp(0.0005, 0.015, s),
      CST3: 0.006, S100A4: 0.004 }[g];
    else f = { FCER1A: 0.010, CST3: 0.015, CLEC10A: 0.008, LYZ: 0.010 }[g];
    return (f || 0) + AMBIENT;
  }
  function simulateCells(opts) {
    opts = opts || {};
    const rng = mulberry32(opts.seed == null ? 2718 : opts.seed), per = opts.perType || 100;
    let cells = [];
    for (let t = 0; t < TYPES.length; t++) for (let c = 0; c < per; c++) {
      const s = GRADIENT[t] ? rng() : 0;
      const lib = Math.max(200, Math.round(MEDIAN_LIB * dexp(LIB_SD * gaussian(rng))));
      const counts = GENES.map(function (g) { return poisson(rng, lib * fraction(t, s, g)); });
      cells.push({ type: t, s: s, lib: lib, counts: counts });
    }
    // seeded Fisher-Yates so the matrix order carries no information
    const r2 = mulberry32(3);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); const tmp = cells[i]; cells[i] = cells[j]; cells[j] = tmp; }
    cells.forEach(function (c, i) { c.id = i; });
    return { cells: cells, genes: GENES.slice(), types: TYPES.slice() };
  }
  function expression(sim, mode) {
    return sim.cells.map(function (c) {
      return c.counts.map(function (k) { return dlog(1 + (mode === "raw" ? k : k / c.lib * 1e4)); });
    });
  }

  // ---------------- two moons ----------------
  function moons(opts) {
    opts = opts || {};
    const n = opts.n || 200, noise = opts.noise == null ? 0.3 : opts.noise;
    const rng = mulberry32(opts.seed == null ? 99 : opts.seed), out = [];
    for (let i = 0; i < n; i++) {
      const up = i < n / 2, t = PI * rng();
      const mx = up ? dcos(t) : 1 - dcos(t), my = up ? dsin(t) : 0.5 - dsin(t);
      const row = [mx + 0.06 * gaussian(rng), my + 0.06 * gaussian(rng)];
      for (let k = 0; k < 10; k++) row.push(noise * gaussian(rng));
      out.push({ moon: up ? 0 : 1, t: t, x: row });
    }
    return out;
  }

  // ---------------- PCA ----------------
  function jacobiEigen(A0) {
    const d = A0.length, A = A0.map(function (r) { return r.slice(); });
    const V = []; for (let i = 0; i < d; i++) { V.push(new Array(d).fill(0)); V[i][i] = 1; }
    for (let sweep = 0; sweep < 100; sweep++) {
      let off = 0;
      for (let p = 0; p < d; p++) for (let q = p + 1; q < d; q++) off += A[p][q] * A[p][q];
      if (off < 1e-30) break;
      for (let p = 0; p < d; p++) for (let q = p + 1; q < d; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < d; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < d; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
        for (let k = 0; k < d; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
      }
    }
    const idx = []; for (let i = 0; i < d; i++) idx.push(i);
    idx.sort(function (a, b) { return A[b][b] - A[a][a] || a - b; });
    return {
      values: idx.map(function (i) { return A[i][i]; }),
      vectors: idx.map(function (i) {
        const v = V.map(function (row) { return row[i]; });
        // sign convention: largest-magnitude entry positive
        let m = 0; for (let j = 1; j < d; j++) if (Math.abs(v[j]) > Math.abs(v[m])) m = j;
        return v[m] < 0 ? v.map(function (x) { return -x; }) : v;
      })
    };
  }
  function pca(X, k) {
    const n = X.length, d = X[0].length, mean = new Array(d).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) mean[j] += X[i][j];
    for (let j = 0; j < d; j++) mean[j] /= n;
    const Xc = X.map(function (r) { return r.map(function (v, j) { return v - mean[j]; }); });
    const C = [];
    for (let a = 0; a < d; a++) { C.push(new Array(d)); }
    for (let a = 0; a < d; a++) for (let b = a; b < d; b++) {
      let s = 0; for (let i = 0; i < n; i++) s += Xc[i][a] * Xc[i][b];
      C[a][b] = C[b][a] = s / (n - 1);
    }
    let total = 0; for (let j = 0; j < d; j++) total += C[j][j];
    const E = jacobiEigen(C), vecs = E.vectors.slice(0, k);
    return {
      Y: Xc.map(function (r) { return vecs.map(function (u) { let s = 0; for (let j = 0; j < d; j++) s += r[j] * u[j]; return s; }); }),
      values: E.values, vectors: vecs, mean: mean,
      explained: E.values.slice(0, k).map(function (l) { return l / total; })
    };
  }

  // ---------------- t-SNE ----------------
  function sqdist(X) {
    const n = X.length, d = X[0].length, D = new Float64Array(n * n);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let s = 0; for (let k = 0; k < d; k++) { const t = X[i][k] - X[j][k]; s += t * t; }
      D[i * n + j] = D[j * n + i] = s;
    }
    return D;
  }
  // Conditional p_{j|i} with per-point precision found by bisection on entropy = log(perplexity)
  // (as sklearn's _binary_search_perplexity: 100 steps, tolerance 1e-5), then
  // P = max((P + P^T) / sum, eps). `conditional` is returned for the calibration check.
  function affinities(D, perplexity, n) {
    n = n || Math.round(Math.sqrt(D.length));
    const H = dlog(perplexity), C = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      let beta = 1, lo = -Infinity, hi = Infinity, sum = 0;
      for (let it = 0; it < 100; it++) {
        sum = 0; let sumDP = 0;
        for (let j = 0; j < n; j++) {
          if (j === i) { C[i * n + j] = 0; continue; }
          const p = dexp(-D[i * n + j] * beta); C[i * n + j] = p; sum += p;
        }
        if (sum === 0) sum = 1e-8;
        for (let j = 0; j < n; j++) { C[i * n + j] /= sum; sumDP += D[i * n + j] * C[i * n + j]; }
        const ent = dlog(sum) + beta * sumDP;
        const diff = ent - H;
        if (Math.abs(diff) <= 1e-5) break;
        if (diff > 0) { lo = beta; beta = hi === Infinity ? beta * 2 : (beta + hi) / 2; }
        else { hi = beta; beta = lo === -Infinity ? beta / 2 : (beta + lo) / 2; }
      }
    }
    const P = new Float64Array(n * n);
    let total = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) total += C[i * n + j] + C[j * n + i];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      P[i * n + j] = i === j ? 0 : Math.max((C[i * n + j] + C[j * n + i]) / total, 2.220446049250313e-16);
    }
    P.conditional = C;
    return P;
  }
  function tsneSettings(n) {
    return { perplexity: 30, exaggeration: 12, exaggerationIters: 250, momentum0: 0.5, momentum1: 0.8,
      learningRate: Math.max(n / 12 / 4, 50), iters: 1000, minGain: 0.01, init: "random", seed: 1 };
  }
  function qmatrix(Y, n) {
    const num = new Float64Array(n * n); let Z = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = Y[i][0] - Y[j][0], dy = Y[i][1] - Y[j][1], q = 1 / (1 + dx * dx + dy * dy);
      num[i * n + j] = num[j * n + i] = q; Z += 2 * q;
    }
    return { num: num, Z: Z };
  }
  function gradient(P, Y, exag) {
    const n = Y.length, Q = qmatrix(Y, n), num = Q.num, Z = Q.Z, G = [];
    for (let a = 0; a < n; a++) {
      let gx = 0, gy = 0;
      for (let b = 0; b < n; b++) {
        if (a === b) continue;
        const q = num[a * n + b], m = (exag * P[a * n + b] - q / Z) * q;
        gx += m * (Y[a][0] - Y[b][0]); gy += m * (Y[a][1] - Y[b][1]);
      }
      G.push([4 * gx, 4 * gy]);
    }
    return G;
  }
  function klDivergence(P, Y) {
    const n = Y.length, Q = qmatrix(Y, n); let kl = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const p = P[i * n + j], q = Math.max(Q.num[i * n + j] / Q.Z, 2.220446049250313e-16);
      kl += p * dlog(p / q);
    }
    return kl;
  }
  function TSNE(X, opts) {
    const n = X.length, o = Object.assign(tsneSettings(n), opts || {});
    const P = o.P || affinities(sqdist(X), o.perplexity, n);
    let Y;
    if (o.init === "pca") {
      const Yp = pca(X, 2).Y; let m = 0, v = 0;
      for (let i = 0; i < n; i++) m += Yp[i][0]; m /= n;
      for (let i = 0; i < n; i++) v += (Yp[i][0] - m) * (Yp[i][0] - m);
      const sd = Math.sqrt(v / n);
      Y = Yp.map(function (p) { return [p[0] / sd * 1e-4, p[1] / sd * 1e-4]; });
    } else {
      const rng = mulberry32(o.seed);
      Y = []; for (let i = 0; i < n; i++) Y.push([gaussian(rng) * 1e-4, gaussian(rng) * 1e-4]);
    }
    const U = [], Gn = [];
    for (let i = 0; i < n; i++) { U.push([0, 0]); Gn.push([1, 1]); }
    const num = new Float64Array(n * n);
    let iter = 0;
    function step() {
      const early = iter < o.exaggerationIters, exag = early ? o.exaggeration : 1;
      const mom = early ? o.momentum0 : o.momentum1, lr = o.learningRate;
      let Z = 0;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const dx = Y[i][0] - Y[j][0], dy = Y[i][1] - Y[j][1], q = 1 / (1 + dx * dx + dy * dy);
        num[i * n + j] = num[j * n + i] = q; Z += 2 * q;
      }
      // all gradients first (from the same Y), then the update, as sklearn does
      const g = new Float64Array(2 * n);
      for (let a = 0; a < n; a++) {
        let gx = 0, gy = 0;
        for (let b = 0; b < n; b++) {
          if (a === b) continue;
          const q = num[a * n + b], m = (exag * P[a * n + b] - q / Z) * q;
          gx += m * (Y[a][0] - Y[b][0]); gy += m * (Y[a][1] - Y[b][1]);
        }
        g[2 * a] = 4 * gx; g[2 * a + 1] = 4 * gy;
      }
      for (let a = 0; a < n; a++) for (let d = 0; d < 2; d++) {
        const gr = g[2 * a + d];
        if (U[a][d] * gr < 0) Gn[a][d] += 0.2; else Gn[a][d] *= 0.8;
        if (Gn[a][d] < o.minGain) Gn[a][d] = o.minGain;
        U[a][d] = mom * U[a][d] - lr * Gn[a][d] * gr;
        Y[a][d] += U[a][d];
      }
      iter++;
    }
    return { Y: Y, P: P, step: step, settings: o, total: o.iters,
      get iter() { return iter; }, kl: function () { return klDivergence(P, Y); } };
  }
  function tsneRun(X, opts) { const ts = TSNE(X, opts); while (ts.iter < ts.total) ts.step(); return ts; }

  // ---------------- UMAP ----------------
  // McInnes, Healy and Melville 2018, following umap-learn 0.5 step for step: exact kNN (self
  // included, as umap-learn does below 4,096 points), smooth_knn_dist, the fuzzy union
  // A + A^T - A*A^T, find_ab_params, spectral initialization (multi_component_layout when the
  // graph is disconnected), and the SGD epoch with negative sampling and its schedule.
  // Differences: float64 throughout (umap-learn uses float32), and negative samples come from
  // one mulberry32 stream instead of umap-learn's per-point tausworthe generators.
  function umapSettings(n) {
    return { nNeighbors: 15, minDist: 0.1, spread: 1, nEpochs: n <= 10000 ? 500 : 200, negativeSampleRate: 5,
      repulsion: 1, initialAlpha: 1, localConnectivity: 1, init: "spectral", seed: 1 };
  }
  // a and b of 1 / (1 + a d^(2b)) fitted by least squares to 1 below min_dist and
  // exp(-(d - min_dist) / spread) above it, on 300 points of [0, 3 spread] (scipy curve_fit's
  // Levenberg-Marquardt from a = b = 1, as umap-learn's find_ab_params).
  function fitAB(spread, minDist) {
    const xs = [], ys = [], step = 3 * spread / 299;
    for (let i = 0; i < 300; i++) { const x = i * step; xs.push(x); ys.push(x < minDist ? 1 : dexp(-(x - minDist) / spread)); }
    function eval_(a, b) {
      let sse = 0, jaa = 0, jab = 0, jbb = 0, ga = 0, gb = 0;
      for (let i = 0; i < 300; i++) {
        const x = xs[i];
        const lx = x > 0 ? dlog(x) : 0, p = x > 0 ? dexp(2 * b * lx) : 0, den = 1 + a * p, f = 1 / den, r = f - ys[i];
        const da = -p / (den * den), db = x > 0 ? -a * p * 2 * lx / (den * den) : 0;
        sse += r * r; jaa += da * da; jab += da * db; jbb += db * db; ga += da * r; gb += db * r;
      }
      return { sse: sse, jaa: jaa, jab: jab, jbb: jbb, ga: ga, gb: gb };
    }
    let a = 1, b = 1, lam = 1e-3, cur = eval_(a, b);
    for (let it = 0; it < 500; it++) {
      const A11 = cur.jaa * (1 + lam), A22 = cur.jbb * (1 + lam), A12 = cur.jab, det = A11 * A22 - A12 * A12;
      const da = (-cur.ga * A22 + cur.gb * A12) / det, db = (-cur.gb * A11 + cur.ga * A12) / det;
      const nxt = eval_(a + da, b + db);
      if (nxt.sse < cur.sse) {
        const done = Math.abs(da) <= 1e-13 * Math.abs(a) && Math.abs(db) <= 1e-13 * Math.abs(b);
        a += da; b += db; cur = nxt; lam = Math.max(lam / 10, 1e-12);
        if (done) break;
      } else { lam *= 10; if (lam > 1e12) break; }
    }
    return { a: a, b: b, sse: cur.sse };
  }
  // For each point: rho = distance to its nearest other point, sigma by 64 bisection steps so that
  // sum_j exp(-(d_ij - rho) / sigma) over the k - 1 others = log2(k) (umap-learn smooth_knn_dist).
  // knnD rows are sorted distances with the point itself first (distance 0).
  const FLOATMAX32 = 3.4028234663852886e38;
  function smoothKnn(knnD, k, localConnectivity) {
    const n = knnD.length, lc = localConnectivity == null ? 1 : localConnectivity;
    const target = dlog(k) * INV_LN2, sigma = new Float64Array(n), rho = new Float64Array(n);
    let meanAll = 0; for (let i = 0; i < n; i++) for (let j = 0; j < k; j++) meanAll += knnD[i][j]; meanAll /= n * k;
    for (let i = 0; i < n; i++) {
      const row = knnD[i], nz = row.filter(function (d) { return d > 0; });
      const idx = Math.floor(lc), interp = lc - idx;
      if (nz.length >= lc) {
        if (idx > 0) { rho[i] = nz[idx - 1]; if (interp > 1e-5) rho[i] += interp * (nz[idx] - nz[idx - 1]); }
        else rho[i] = interp * nz[0];
      } else if (nz.length > 0) rho[i] = Math.max.apply(null, nz);
      let lo = 0, hi = FLOATMAX32, mid = 1;
      for (let it = 0; it < 64; it++) {
        let psum = 0;
        for (let j = 1; j < k; j++) { const d = row[j] - rho[i]; psum += d > 0 ? dexp(-(d / mid)) : 1; }
        if (Math.abs(psum - target) < 1e-5) break;
        if (psum > target) { hi = mid; mid = (lo + hi) / 2; }
        else { lo = mid; if (hi >= FLOATMAX32) mid *= 2; else mid = (lo + hi) / 2; }
      }
      sigma[i] = mid;
      let mrow = 0; for (let j = 0; j < k; j++) mrow += row[j]; mrow /= k;
      if (rho[i] > 0) { if (sigma[i] < 1e-3 * mrow) sigma[i] = 1e-3 * mrow; }
      else if (sigma[i] < 1e-3 * meanAll) sigma[i] = 1e-3 * meanAll;
    }
    return { sigma: sigma, rho: rho, target: target };
  }
  // The fuzzy simplicial set: directed memberships exp(-(d - rho_i) / sigma_i) on each point's k
  // nearest, then the fuzzy union w = a + a' - a a'. W is dense n*n (symmetric, zero diagonal).
  function fuzzyGraph(X, opts) {
    const n = X.length, k = (opts && opts.nNeighbors) || 15, D = (opts && opts.D) || sqdist(X);
    const knnIdx = [], knnD = [];
    for (let i = 0; i < n; i++) {
      const idx = []; for (let j = 0; j < n; j++) idx.push(j);
      idx.sort(function (a, b) { return (a === i ? -1 : 0) - (b === i ? -1 : 0) || D[i * n + a] - D[i * n + b] || a - b; });
      knnIdx.push(idx.slice(0, k)); knnD.push(idx.slice(0, k).map(function (j) { return Math.sqrt(D[i * n + j]); }));
    }
    const sk = smoothKnn(knnD, k, opts && opts.localConnectivity);
    const A = new Float64Array(n * n);
    for (let i = 0; i < n; i++) for (let j = 0; j < k; j++) {
      const t = knnIdx[i][j], d = knnD[i][j] - sk.rho[i];
      A[i * n + t] = t === i ? 0 : (d <= 0 || sk.sigma[i] === 0 ? 1 : dexp(-(d / sk.sigma[i])));
    }
    const W = new Float64Array(n * n);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const a = A[i * n + j], b = A[j * n + i]; W[i * n + j] = a + b - a * b; }
    return { W: W, n: n, k: k, knnIdx: knnIdx, knnD: knnD, sigma: sk.sigma, rho: sk.rho, directed: A };
  }
  function graphComponents(W, n) {
    const lab = new Int32Array(n).fill(-1); let c = 0;
    for (let s = 0; s < n; s++) {
      if (lab[s] >= 0) continue;
      const stack = [s]; lab[s] = c;
      while (stack.length) { const u = stack.pop(); for (let v = 0; v < n; v++) if (lab[v] < 0 && W[u * n + v] > 0) { lab[v] = c; stack.push(v); } }
      c++;
    }
    return { labels: lab, count: c };
  }
  // smallest eigenvectors 2..dim+1 of the normalized Laplacian I - D^-1/2 W D^-1/2 on nodes idx
  function laplacianEmbedding(W, n, idx, dim) {
    const m = idx.length, sq = idx.map(function (j) { let s = 0; for (let t = 0; t < m; t++) s += W[idx[t] * n + j]; return Math.sqrt(s); });
    const L = [];
    for (let a = 0; a < m; a++) { L.push(new Array(m)); for (let b = 0; b < m; b++) L[a][b] = (a === b ? 1 : 0) - W[idx[a] * n + idx[b]] / (sq[a] * sq[b]); }
    const E = jacobiEigen(L), out = [];
    for (let a = 0; a < m; a++) { const r = []; for (let d = 1; d <= dim; d++) r.push(E.vectors[m - 1 - d][a]); out.push(r); }
    return { Y: out, values: E.values.slice().reverse() };
  }
  // umap-learn component_layout: spectral embedding (scikit-learn SpectralEmbedding) of the
  // component centroids with affinity exp(-d^2), scaled so its largest entry is 1
  function componentLayout(X, labels, count, dim) {
    const d = X[0].length, C = [], cnt = [];
    for (let c = 0; c < count; c++) { C.push(new Array(d).fill(0)); cnt.push(0); }
    X.forEach(function (r, i) { cnt[labels[i]]++; for (let j = 0; j < d; j++) C[labels[i]][j] += r[j]; });
    C.forEach(function (r, c) { for (let j = 0; j < d; j++) r[j] /= cnt[c]; });
    const A = [];
    for (let a = 0; a < count; a++) { A.push(new Array(count)); for (let b = 0; b < count; b++) {
      let s = 0; for (let j = 0; j < d; j++) { const t = C[a][j] - C[b][j]; s += t * t; } A[a][b] = a === b ? 0 : dexp(-s); } }
    const dd = A.map(function (r) { return Math.sqrt(r.reduce(function (s, v) { return s + v; }, 0)); });
    const L = A.map(function (r, a) { return r.map(function (v, b) { return a === b ? 1 : -v / (dd[a] * dd[b]); }); });
    const E = jacobiEigen(L);
    const vecs = [];
    for (let t = 0; t <= dim; t++) {
      let v = E.vectors[count - 1 - t].map(function (x, a) { return x / dd[a]; });
      let mi = 0; for (let a = 1; a < count; a++) if (Math.abs(v[a]) > Math.abs(v[mi])) mi = a;
      if (v[mi] < 0) v = v.map(function (x) { return -x; });
      vecs.push(v);
    }
    const emb = []; let mx = -Infinity;
    for (let a = 0; a < count; a++) { const r = []; for (let t = 1; t <= dim; t++) { r.push(vecs[t][a]); mx = Math.max(mx, vecs[t][a]); } emb.push(r); }
    return { Y: emb.map(function (r) { return r.map(function (v) { return v / mx; }); }), centroids: C };
  }
  function spectralLayout(X, W, n, dim) {
    const comp = graphComponents(W, n);
    if (comp.count === 1) return { Y: laplacianEmbedding(W, n, Array.from({ length: n }, function (_, i) { return i; }), dim).Y, components: comp };
    let meta;
    if (comp.count > 2 * dim) meta = componentLayout(X, comp.labels, comp.count, dim).Y;
    else {
      const kk = Math.ceil(comp.count / 2), base = [];
      for (let a = 0; a < kk; a++) { const r = new Array(dim).fill(0); if (a < dim) r[a] = 1; base.push(r); }
      meta = base.concat(base.map(function (r) { return r.map(function (v) { return -v; }); })).slice(0, comp.count);
    }
    const Y = new Array(n);
    for (let c = 0; c < comp.count; c++) {
      const idx = []; for (let i = 0; i < n; i++) if (comp.labels[i] === c) idx.push(i);
      let dr = Infinity;
      for (let o = 0; o < comp.count; o++) { let s = 0; for (let t = 0; t < dim; t++) s += (meta[c][t] - meta[o][t]) * (meta[c][t] - meta[o][t]); s = Math.sqrt(s); if (s > 0 && s < dr) dr = s; }
      dr /= 2;
      if (idx.length < 2 * dim || idx.length <= dim + 1) { idx.forEach(function (i) { Y[i] = meta[c].slice(); }); continue; }
      const e = laplacianEmbedding(W, n, idx, dim).Y;
      let mx = 0; e.forEach(function (r) { r.forEach(function (v) { mx = Math.max(mx, Math.abs(v)); }); });
      idx.forEach(function (i, a) { Y[i] = e[a].map(function (v, t) { return v * dr / mx + meta[c][t]; }); });
    }
    return { Y: Y, components: comp, meta: meta };
  }
  function UMAP(X, opts) {
    const n = X.length, o = Object.assign(umapSettings(n), opts || {});
    const ab = o.a != null ? { a: o.a, b: o.b } : fitAB(o.spread, o.minDist), a = ab.a, b = ab.b;
    const G = o.graph || fuzzyGraph(X, o), W = G.W;
    // prune edges too weak to be sampled once in nEpochs (simplicial_set_embedding)
    let wmax = 0; for (let i = 0; i < W.length; i++) if (W[i] > wmax) wmax = W[i];
    const thr = wmax / (o.nEpochs > 10 ? o.nEpochs : 500), Wp = new Float64Array(W.length);
    const head = [], tail = [], wt = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const w = W[i * n + j]; if (w > 0 && w >= thr) { Wp[i * n + j] = w; head.push(i); tail.push(j); wt.push(w); } }
    const rng = mulberry32(o.seed);
    let Y, spec = null;
    if (o.init === "spectral") {
      spec = spectralLayout(X, Wp, n, 2);
      let mx = 0; spec.Y.forEach(function (r) { mx = Math.max(mx, Math.abs(r[0]), Math.abs(r[1])); });
      Y = spec.Y.map(function (r) { return [r[0] * 10 / mx + 1e-4 * gaussian(rng), r[1] * 10 / mx + 1e-4 * gaussian(rng)]; });
    } else if (Array.isArray(o.init)) Y = o.init.map(function (r) { return r.slice(); });
    else { Y = []; for (let i = 0; i < n; i++) Y.push([-10 + 20 * rng(), -10 + 20 * rng()]); }
    for (let t = 0; t < 2; t++) {
      let lo = Infinity, hi = -Infinity; Y.forEach(function (r) { lo = Math.min(lo, r[t]); hi = Math.max(hi, r[t]); });
      Y.forEach(function (r) { r[t] = 10 * (r[t] - lo) / (hi - lo); });
    }
    const E = head.length, eps = new Float64Array(E), epn = new Float64Array(E), nextS = new Float64Array(E), nextN = new Float64Array(E);
    for (let e = 0; e < E; e++) { eps[e] = wmax / wt[e]; epn[e] = eps[e] / o.negativeSampleRate; nextS[e] = eps[e]; nextN[e] = epn[e]; }
    const gamma = o.repulsion, total = o.nEpochs;
    let epoch = 0, alpha = o.initialAlpha;
    function clip(v) { return v > 4 ? 4 : v < -4 ? -4 : v; }
    function step() {
      const nE = epoch;
      for (let e = 0; e < E; e++) {
        if (nextS[e] > nE) continue;
        const j = head[e], cur = Y[j], oth = Y[tail[e]];
        let dx = cur[0] - oth[0], dy = cur[1] - oth[1], d2 = dx * dx + dy * dy, gc = 0;
        if (d2 > 0) { const pb = dexp(b * dlog(d2)); gc = -2 * a * b * (pb / d2) / (a * pb + 1); }
        let g = clip(gc * dx); cur[0] += g * alpha; oth[0] -= g * alpha;
        g = clip(gc * dy); cur[1] += g * alpha; oth[1] -= g * alpha;
        nextS[e] += eps[e];
        const nNeg = Math.trunc((nE - nextN[e]) / epn[e]);
        for (let p = 0; p < nNeg; p++) {
          const kk = Math.floor(rng() * n), q = Y[kk];
          dx = cur[0] - q[0]; dy = cur[1] - q[1]; d2 = dx * dx + dy * dy;
          if (d2 > 0) {
            const pb = dexp(b * dlog(d2)); gc = 2 * gamma * b / ((0.001 + d2) * (a * pb + 1));
            cur[0] += clip(gc * dx) * alpha; cur[1] += clip(gc * dy) * alpha;
          }
        }
        nextN[e] += nNeg * epn[e];
      }
      alpha = o.initialAlpha * (1 - nE / total);
      epoch++;
    }
    return { Y: Y, graph: G, a: a, b: b, edges: E, spectral: spec, settings: o, step: step, total: total,
      get iter() { return epoch; } };
  }
  function umapRun(X, opts) { const u = UMAP(X, opts); while (u.iter < u.total) u.step(); return u; }

  // ---------------- measures ----------------
  // ranks[i*n + j] = position of j in i's neighbor order (0 = nearest; i itself gets -1).
  function rankMatrix(D, n) {
    const R = new Int32Array(n * n), idx = new Array(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) idx[j] = j;
      idx.sort(function (a, b) {
        if (a === i) return -1; if (b === i) return 1;
        return D[i * n + a] - D[i * n + b] || a - b;
      });
      for (let r = 0; r < n; r++) R[i * n + idx[r]] = r - 1;
    }
    return R;
  }
  function neighbors(D, n, i, k) {
    const idx = []; for (let j = 0; j < n; j++) if (j !== i) idx.push(j);
    idx.sort(function (a, b) { return D[i * n + a] - D[i * n + b] || a - b; });
    return k == null ? idx : idx.slice(0, k);
  }
  // recall[k] for k = 1..n-1: j is in both k-neighborhoods of i iff max(rankH, rankL) < k
  function recallCurve(Dh, Dl, n) {
    const Rh = rankMatrix(Dh, n), Rl = rankMatrix(Dl, n), hist = new Float64Array(n);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) continue;
      hist[Math.max(Rh[i * n + j], Rl[i * n + j])] += 1;
    }
    const out = [NaN]; let cum = 0;
    for (let k = 1; k < n; k++) { cum += hist[k - 1]; out.push(cum / (n * k)); }
    return out;
  }
  function groupScore(D, n, labels, k) {
    let hit = 0;
    for (let i = 0; i < n; i++) neighbors(D, n, i, k).forEach(function (j) { if (labels[j] === labels[i]) hit++; });
    return hit / (n * k);
  }
  function pairDistances(X) {
    const n = X.length, d = X[0].length, out = new Float64Array(n * (n - 1) / 2); let p = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let s = 0; for (let k = 0; k < d; k++) { const t = X[i][k] - X[j][k]; s += t * t; }
      out[p++] = Math.sqrt(s);
    }
    return out;
  }
  function ranks(a) {
    const n = a.length, idx = new Array(n);
    for (let i = 0; i < n; i++) idx[i] = i;
    idx.sort(function (x, y) { return a[x] - a[y] || x - y; });
    const r = new Float64Array(n);
    for (let i = 0; i < n;) {
      let j = i; while (j + 1 < n && a[idx[j + 1]] === a[idx[i]]) j++;
      const avg = (i + j) / 2 + 1;
      for (let m = i; m <= j; m++) r[idx[m]] = avg;
      i = j + 1;
    }
    return r;
  }
  function pearson(a, b) {
    const n = a.length; let ma = 0, mb = 0;
    for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
    ma /= n; mb /= n;
    let sab = 0, saa = 0, sbb = 0;
    for (let i = 0; i < n; i++) { const x = a[i] - ma, y = b[i] - mb; sab += x * y; saa += x * x; sbb += y * y; }
    return sab / Math.sqrt(saa * sbb);
  }
  function spearman(a, b) { return pearson(ranks(a), ranks(b)); }
  function centroids(X, labels, g) {
    const d = X[0].length, out = [], cnt = [];
    for (let t = 0; t < g; t++) { out.push(new Array(d).fill(0)); cnt.push(0); }
    X.forEach(function (r, i) { cnt[labels[i]]++; for (let j = 0; j < d; j++) out[labels[i]][j] += r[j]; });
    return out.map(function (r, t) { return r.map(function (v) { return v / cnt[t]; }); });
  }
  // FNV-1a over the float64 bits of every coordinate
  function fingerprint(Y) {
    const buf = new Float64Array(2 * Y.length);
    Y.forEach(function (p, i) { buf[2 * i] = p[0]; buf[2 * i + 1] = p[1]; });
    const bytes = new Uint8Array(buf.buffer); let h = 0x811c9dc5;
    for (let i = 0; i < bytes.length; i++) { h ^= bytes[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ("00000000" + h.toString(16)).slice(-8);
  }

  // ---------------- checks ----------------
  function runChecks(print, data) {
    const out = [];
    function check(name, ok, detail) { out.push({ name: name, ok: !!ok, detail: detail || "" }); if (print) console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); }
    function rel(a, b) { return Math.abs(a - b) / Math.max(Math.abs(b), 1e-300); }

    // 1. deterministic math against the engine's own
    let me = 0, ml = 0, ms = 0;
    for (let i = 0; i <= 2000; i++) {
      const x = -700 + i * 0.35 + 0.0123; me = Math.max(me, rel(dexp(x), Math.exp(x)));
      const y = Math.pow(10, -300 + i * 0.3) * 1.37; ml = Math.max(ml, Math.abs(dlog(y) - Math.log(y)) / Math.max(1, Math.abs(Math.log(y))));
      const z = -10 + i * 0.01; ms = Math.max(ms, Math.abs(dsin(z) - Math.sin(z)), Math.abs(dcos(z) - Math.cos(z)));
    }
    check("dmath.exp matches Math.exp", me < 1e-14, "max rel err " + me.toExponential(2));
    check("dmath.log matches Math.log", ml < 1e-15, "max rel err " + ml.toExponential(2));
    check("dmath.sin/cos match Math", ms < 4e-15, "max abs err " + ms.toExponential(2));

    // 2. randomness
    const rng = mulberry32(7); let s1 = 0, s2 = 0, N = 200000;
    for (let i = 0; i < N; i++) { const g = gaussian(rng); s1 += g; s2 += g * g; }
    check("gaussian: mean 0, variance 1", Math.abs(s1 / N) < 0.01 && Math.abs(s2 / N - 1) < 0.01, "mean " + (s1 / N).toFixed(4) + ", var " + (s2 / N).toFixed(4));
    let p1 = 0, p2 = 0; const lam = 12.5, M = 50000;
    for (let i = 0; i < M; i++) { const k = poisson(rng, lam); p1 += k; p2 += k * k; }
    const pm = p1 / M, pv = p2 / M - pm * pm;
    check("poisson(12.5): mean and variance 12.5", Math.abs(pm - lam) < 0.1 && Math.abs(pv - lam) < 0.4, "mean " + pm.toFixed(3) + ", var " + pv.toFixed(3));

    // 3. simulated cells
    const sim = simulateCells(), Xn = expression(sim, "norm");
    const labels = sim.cells.map(function (c) { return c.type; });
    const NC = sim.cells.length;
    check("cells: 500 cells x 24 genes, 100 per type", NC === 500 && Xn[0].length === 24 &&
      [0, 1, 2, 3, 4].every(function (t) { return labels.filter(function (l) { return l === t; }).length === 100; }));
    const zeros = sim.cells.reduce(function (a, c) { return a + c.counts.filter(function (k) { return k === 0; }).length; }, 0) / (NC * 24);
    check("cells: a third or more of counts are zero", zeros > 0.33, (100 * zeros).toFixed(1) + "% zero");

    // 4. PCA against an independent reference (numpy.linalg.eigh, stored)
    if (data && data.pcaCells) {
      const P = pca(Xn, 2), ref = data.pcaCells.values;
      const err = Math.max.apply(null, ref.map(function (v, i) { return rel(P.values[i], v); }));
      check("PCA eigenvalues match numpy eigh (cells)", err < 1e-9, "max rel err " + err.toExponential(2) + "; top " + P.values.slice(0, 3).map(function (v) { return v.toFixed(4); }).join(", "));
    }
    if (data && data.pcaMoons) {
      const mm = moons({ noise: 0.3 }), P = pca(mm.map(function (m) { return m.x; }), 2), ref = data.pcaMoons.values;
      const err = Math.max.apply(null, ref.map(function (v, i) { return rel(P.values[i], v); }));
      check("PCA eigenvalues match numpy eigh (moons, noise 0.3)", err < 1e-9, "max rel err " + err.toExponential(2));
    }
    // Jacobi on a closed-form 2x2
    const J = jacobiEigen([[2, 1], [1, 2]]);
    check("jacobiEigen: [[2,1],[1,2]] has eigenvalues 3 and 1", Math.abs(J.values[0] - 3) < 1e-14 && Math.abs(J.values[1] - 1) < 1e-14);

    // 5. affinities: perplexity calibration, and sklearn's P
    const D = sqdist(Xn), P = affinities(D, 30, NC), C = P.conditional;
    let worst = 0;
    for (let i = 0; i < NC; i++) { let h = 0; for (let j = 0; j < NC; j++) { const p = C[i * NC + j]; if (p > 0) h -= p * dlog(p); } worst = Math.max(worst, Math.abs(h - dlog(30))); }
    check("affinities: every row's entropy is log(30)", worst <= 1.01e-5, "max |H - log 30| " + worst.toExponential(2));
    let psum = 0; for (let i = 0; i < P.length; i++) psum += P[i];
    check("affinities: P sums to 1", Math.abs(psum - 1) < 1e-9, psum.toFixed(12));
    if (data && data.sklearnP) {
      let err = 0; const rows = data.sklearnP.rows;
      rows.forEach(function (row, r) { row.forEach(function (v, j) { err = Math.max(err, Math.abs(P[r * NC + j] - v) / Math.max(v, 1e-12)); }); });
      check("affinities match sklearn _joint_probabilities (first 3 rows; sklearn bisects on float32 distances)", err < 1e-3, "max rel err " + err.toExponential(2));
    }

    // 6. gradient against a finite difference of KL
    const rngY = mulberry32(11), Y0 = [];
    for (let i = 0; i < NC; i++) Y0.push([gaussian(rngY), gaussian(rngY)]);
    const G = gradient(P, Y0, 1); let gerr = 0;
    [[0, 0], [17, 1], [123, 0], [499, 1]].forEach(function (ad) {
      const h = 1e-4, Yp = Y0.map(function (p) { return p.slice(); }), Ym = Y0.map(function (p) { return p.slice(); });
      Yp[ad[0]][ad[1]] += h; Ym[ad[0]][ad[1]] -= h;
      const fd = (klDivergence(P, Yp) - klDivergence(P, Ym)) / (2 * h);
      gerr = Math.max(gerr, Math.abs(fd - G[ad[0]][ad[1]]) / Math.max(Math.abs(fd), 1e-8));
    });
    check("t-SNE gradient matches finite differences of KL", gerr < 1e-5, "max rel err " + gerr.toExponential(2));

    // 7. the essay's default runs, pinned
    const ts = tsneRun(Xn, {});
    const kl1000 = ts.kl();
    check("t-SNE settings: learning rate 50, exaggeration 12 for 250 iterations, 1000 iterations",
      ts.settings.learningRate === 50 && ts.settings.exaggerationIters === 250 && ts.settings.iters === 1000);
    if (data && data.fingerprints) {
      check("Figure 1 layout (normalized) is bit-identical to the stored run", fingerprint(ts.Y) === data.fingerprints.cellsNorm, fingerprint(ts.Y) + " vs " + data.fingerprints.cellsNorm);
    }
    // converged: running 1000 more iterations changes KL by little
    const ts2 = TSNE(Xn, {}); while (ts2.iter < 2000) ts2.step();
    const kl2000 = ts2.kl();
    check("t-SNE converged: KL at 2000 iterations within 3% of KL at 1000", Math.abs(kl2000 - kl1000) / kl1000 < 0.03, "KL " + kl1000.toFixed(4) + " -> " + kl2000.toFixed(4));
    if (data && data.sklearnKL) {
      check("converged KL close to sklearn exact t-SNE on the same P", Math.abs(kl1000 - data.sklearnKL.cellsNorm) / data.sklearnKL.cellsNorm < 0.15,
        "ours " + kl1000.toFixed(4) + ", sklearn " + data.sklearnKL.cellsNorm.toFixed(4));
    }

    // 8. measures against numpy/scipy computed on our exported layouts
    if (data && data.measures) {
      const Yp = pca(Xn, 2).Y, Dl = sqdist(ts.Y), Dp = sqdist(Yp);
      const rT = recallCurve(D, Dl, NC), rP = recallCurve(D, Dp, NC), m = data.measures;
      let rerr = 0;
      [5, 10, 30, 100].forEach(function (k, i) { rerr = Math.max(rerr, Math.abs(rT[k] - m.recallTsne[i]), Math.abs(rP[k] - m.recallPca[i])); });
      check("recall@k matches numpy on the same layouts", rerr < 1e-12, "t-SNE @5,10,30,100 " + [5, 10, 30, 100].map(function (k) { return rT[k].toFixed(3); }).join(", "));
      const dh = pairDistances(Xn), sT = spearman(dh, pairDistances(ts.Y)), sP = spearman(dh, pairDistances(Yp));
      check("pairwise Spearman matches scipy", Math.abs(sT - m.spearmanTsne) < 1e-9 && Math.abs(sP - m.spearmanPca) < 1e-9,
        "t-SNE " + sT.toFixed(4) + ", PCA " + sP.toFixed(4));
    }
    // spearman on a textbook example with ties: x = 1,2,3,4,5; y = 5,6,7,8,7 -> rho = 0.8208
    check("spearman with ties (scipy: 0.820782)", Math.abs(spearman([1, 2, 3, 4, 5], [5, 6, 7, 8, 7]) - 0.8207826816681233) < 1e-12);
    // recall curve of a layout identical to the data is 1 everywhere
    const id = recallCurve(D, D, NC);
    check("recall of the identity layout is 1 at every k", id.slice(1).every(function (v) { return Math.abs(v - 1) < 1e-12; }));

    // 9. moons
    if (data && data.fingerprints) {
      const mm = moons({ noise: 0.3 }), tsm = tsneRun(mm.map(function (m) { return m.x; }), {});
      check("Figure 2 default t-SNE is bit-identical to the stored run", fingerprint(tsm.Y) === data.fingerprints.moonsDefault, fingerprint(tsm.Y) + " vs " + data.fingerprints.moonsDefault);
    }

    // 10. UMAP, piece by piece against umap-learn
    const ab = fitAB(1, 0.1);
    const U = data && data.umap;
    if (U) check("UMAP a, b match umap-learn find_ab_params(1, 0.1)", rel(ab.a, U.a) < 1e-6 && rel(ab.b, U.b) < 1e-6,
      "a " + ab.a.toFixed(6) + " vs " + U.a.toFixed(6) + ", b " + ab.b.toFixed(6) + " vs " + U.b.toFixed(6));
    const UG = fuzzyGraph(Xn, { nNeighbors: 15, D: D });
    let tgt = 0;
    for (let i = 0; i < NC; i++) { let s = 0; for (let j = 1; j < 15; j++) { const d = UG.knnD[i][j] - UG.rho[i]; s += d > 0 ? dexp(-d / UG.sigma[i]) : 1; } tgt = Math.max(tgt, Math.abs(s - dlog(15) * INV_LN2)); }
    check("UMAP smooth kNN: every point's memberships sum to log2(15)", tgt < 1e-5, "max |sum - log2 15| " + tgt.toExponential(2));
    if (U) {
      let es = 0, er = 0;
      for (let i = 0; i < 5; i++) { es = Math.max(es, rel(UG.sigma[i], U.sigma[i])); er = Math.max(er, Math.abs(UG.rho[i] - U.rho[i])); }
      check("UMAP sigma and rho match umap-learn smooth_knn_dist (float32 there)", es < 1e-4 && er < 1e-5, "sigma rel " + es.toExponential(2) + ", rho abs " + er.toExponential(2));
      let nnz = 0; for (let i = 0; i < UG.W.length; i++) if (UG.W[i] > 0) nnz++;
      let ew = 0; U.row0.idx.forEach(function (j, t) { ew = Math.max(ew, Math.abs(UG.W[j] - U.row0.val[t])); });
      const row0n = Array.from(UG.W.subarray(0, NC)).filter(function (v) { return v > 0; }).length;
      check("UMAP fuzzy graph matches umap-learn (edge count, row 0 weights)", nnz === U.nnz && row0n === U.row0.idx.length && ew < 1e-5,
        nnz + " vs " + U.nnz + " edges; row 0 max abs err " + ew.toExponential(2));
    }
    const comp = graphComponents(UG.W, NC);
    if (U) {
      const meta = componentLayout(Xn, comp.labels, comp.count, 2).Y;
      let em = 0; meta.forEach(function (r, c) { r.forEach(function (v, t) { em = Math.max(em, Math.abs(v - U.meta[c][t])); }); });
      check("UMAP spectral start: " + comp.count + " components, placed as umap-learn component_layout", comp.count === U.components && em < 1e-6, "max abs err " + em.toExponential(2));
    }
    const um = UMAP(Xn, { graph: UG });
    while (um.iter < um.total - 10) um.step();
    const before = um.Y.map(function (p) { return p.slice(); });
    while (um.iter < um.total) um.step();
    let mv = 0, lo0 = Infinity, hi0 = -Infinity;
    um.Y.forEach(function (p, i) { mv += Math.sqrt((p[0] - before[i][0]) * (p[0] - before[i][0]) + (p[1] - before[i][1]) * (p[1] - before[i][1])); lo0 = Math.min(lo0, p[0]); hi0 = Math.max(hi0, p[0]); });
    mv /= NC * (hi0 - lo0);
    check("UMAP settles: cells move under 1% of the map width over the last 10 of 500 epochs", mv < 0.01, (100 * mv).toFixed(2) + "%");
    if (U && U.fingerprint) check("UMAP default layout is bit-identical to the stored run", fingerprint(um.Y) === U.fingerprint, fingerprint(um.Y) + " vs " + U.fingerprint);
    if (U) {
      const r = recallCurve(D, sqdist(um.Y), NC), m = U.runs.spectral.mean;
      check("UMAP neighbor recall at k = 10 and 15 within 0.03 of umap-learn's seed average", Math.abs(r[10] - m[0]) < 0.03 && Math.abs(r[15] - m[1]) < 0.03,
        "ours " + r[10].toFixed(3) + ", " + r[15].toFixed(3) + "; umap-learn " + m[0].toFixed(3) + ", " + m[1].toFixed(3));
    }
    return out;
  }

  const api = { dmath: dmath, mulberry32: mulberry32, gaussian: gaussian, poisson: poisson,
    GENES: GENES, TYPES: TYPES, GRADIENT: GRADIENT, fraction: fraction, simulateCells: simulateCells, expression: expression,
    moons: moons, pca: pca, jacobiEigen: jacobiEigen, sqdist: sqdist, affinities: affinities,
    tsneSettings: tsneSettings, TSNE: TSNE, tsneRun: tsneRun, klDivergence: klDivergence, gradient: gradient,
    umapSettings: umapSettings, fitAB: fitAB, smoothKnn: smoothKnn, fuzzyGraph: fuzzyGraph, graphComponents: graphComponents,
    spectralLayout: spectralLayout, componentLayout: componentLayout, UMAP: UMAP, umapRun: umapRun,
    rankMatrix: rankMatrix, neighbors: neighbors, recallCurve: recallCurve, groupScore: groupScore,
    pairDistances: pairDistances, spearman: spearman, pearson: pearson, ranks: ranks, centroids: centroids,
    fingerprint: fingerprint, runChecks: runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay07 = api;
})(typeof self !== "undefined" ? self : this);
