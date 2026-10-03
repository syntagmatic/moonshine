// BioEssay07: the models behind essay 07, Dimensionality Reduction. Simulated single cells
// (counts drawn from a library size, then normalized), PCA by Jacobi eigendecomposition, exact
// t-SNE with scikit-learn's default optimizer settings, and the measures the essay plots:
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
    return out;
  }

  const api = { dmath: dmath, mulberry32: mulberry32, gaussian: gaussian, poisson: poisson,
    GENES: GENES, TYPES: TYPES, GRADIENT: GRADIENT, fraction: fraction, simulateCells: simulateCells, expression: expression,
    moons: moons, pca: pca, jacobiEigen: jacobiEigen, sqdist: sqdist, affinities: affinities,
    tsneSettings: tsneSettings, TSNE: TSNE, tsneRun: tsneRun, klDivergence: klDivergence, gradient: gradient,
    rankMatrix: rankMatrix, neighbors: neighbors, recallCurve: recallCurve, groupScore: groupScore,
    pairDistances: pairDistances, spearman: spearman, pearson: pearson, ranks: ranks, centroids: centroids,
    fingerprint: fingerprint, runChecks: runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay07 = api;
})(typeof self !== "undefined" ? self : this);
