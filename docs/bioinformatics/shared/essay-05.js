// BioEssay05: the simulated RNA-seq experiment and the statistics of essay 05 (Differential
// Expression): negative binomial counts, limma-trend's empirical Bayes moderated t-test,
// Benjamini-Hochberg, Storey's pi0, and the many-seed summaries the prose quotes.
// Browser global `BioEssay05`, and `module.exports` under node. No fetch, no Math.random.
//
// ---- The experiment (all simulated) ------------------------------------------------
// Two groups of n replicates: TP53-wildtype cells ("wildtype") and the same cells with TP53
// knocked out ("knockout"). M = mean log2 count (knockout) - mean log2 count (wildtype), so
// a p53 target that needs p53 to be transcribed has M < 0.
// 2,000 genes. Each gene: baseline mean count mu = exp(ln 60 + 1.6 Z); with probability 0.1
// a true log2 change of +-(0.6 + |Z|) (sign 50/50); counts are negative binomial with mean
// mu (wildtype) or mu 2^lfc (knockout) and variance mu + 0.08 mu^2 (gamma-Poisson mixture).
// 116 slots carry the real p53 target genes of Fischer 2017 (Oncogene 36:3943, Table 1: the
// genes activated by p53 in at least 6 of 16 genome-wide data sets; P53_SET). Ten of them
// (P53_TARGETS) get a fixed baseline and a clear planted fall in the knockout. The other 106
// keep the baseline drawn for their slot and get a small fixed fall, 0.2 to 0.6 log2 units
// (SET_FALL_MIN/MAX): the case gene-set enrichment is for (Mootha et al. 2003). All sizes
// are our choice (simulated). The random draws for those slots are still consumed, so the
// other 1,884 genes do not depend on the planting. Each gene's counts come from its own seeded stream, so changing the
// replicate count keeps the same genes and adds or removes samples (3 reps = first 3 of 8).
// Expression on the test scale is log2(count + 0.5); A = the gene's mean over all 2n samples.
//
// ---- The test ------------------------------------------------------------------------
// limma-trend (Smyth 2004; Law et al. 2014): per gene, M and the pooled variance s2 on
// d = 2n - 2 df. squeezeVar / fitFDist estimate a prior variance s0^2(A), a natural cubic
// spline in A with 4 df (two interior knots at the 1/3 and 2/3 quantiles), and prior df d0 by
// moments of log s2. The posterior variance (d0 s0^2 + d s2) / (d0 + d) replaces s2 in t, and
// p comes from Student t on d0 + d df (capped at the pooled residual df, as limma does).
// fitFDist here follows limma 3.68.5's code line by line; essay-05.json holds limma's own
// output on these simulated counts (scripts/bio-05-limma-ref.mjs) and runChecks compares.
//
// ---- API -------------------------------------------------------------------------
//   BioEssay05.N_GENES, FRAC_DE, DISPERSION, DEFAULT_SEED (35), DEFAULT_REPS (3)
//   BioEssay05.P53_TARGETS     [{symbol, slot, mu, lfc}]  the ten named, clearly planted targets
//   BioEssay05.P53_SET         [{symbol, tableSymbol, datasets, slot, lfc, named}] all 116 of Table 1
//   BioEssay05.gsea(genes, slots, {nPerm, seed, weight}) preranked GSEA on the moderated t
//        -> {es, nes, p, pRaw, peak, leading, positions, running, nPerm, nNull, k}
//   BioEssay05.gseaES(w, positions, N) running-sum extremes from hit positions
//   BioEssay05.gseaRunning(w, isHit) the full running sum;  gseaNull(w, k, nPerm, seed)
//   BioEssay05.simulate({seed, reps}) -> {seed, reps, genes, counts?}
//        gene: {i, id, symbol|null, mu, isDE, trueLfc, A, M, s2}
//        opts.keepCounts: also return counts {wt: [[...]], ko: [[...]]} per gene
//   BioEssay05.analyze(sim)    adds p, q, nlq, s2post, s0 to every gene; returns
//                              {d0, df, dfTotal, genes, sorted (by p), fit}
//   BioEssay05.run(seed, reps) simulate + analyze
//   BioEssay05.plainT(sim)     ordinary two-sample t (pooled variance) p-values
//   BioEssay05.fitFDist(x, df1, covariate) -> {scale: [..] | number, df2}
//   BioEssay05.bh(p) -> q (same order);  bhCutoff(sortedP, q) -> k (step-up rank)
//   BioEssay05.storeyPi0(p, lambda = 0.5)
//   BioEssay05.pHistogram(genes, bins = 20) -> [{x0, x1, changed, unchanged}]
//   BioEssay05.callStats(genes, mode, fc, q) -> {n, fp, tp, nDE, fdp, power}
//   BioEssay05.seedSummary(reps, seeds, q, fc) -> many-seed summary (prose numbers)
//   BioEssay05.tTwoSided(t, df), digamma, trigamma, tetragamma, trigammaInverse
//   BioEssay05.runChecks(print, data) -> [{name, ok, detail}]
(function (root) {
  "use strict";

  const N_GENES = 2000, FRAC_DE = 0.1, DISPERSION = 0.08, DEFAULT_SEED = 35, DEFAULT_REPS = 3;

  // Real p53 targets (Fischer 2017 Table 1); slot, baseline mean count and planted log2 change
  // in the knockout are simulation choices. Spread over the abundance range on purpose:
  // CDKN1A high and strongly down; BAX well expressed but only slightly down; BBC3 and TP53I3
  // low-count, where the funnel is widest.
  const P53_TARGETS = [
    { symbol: "CDKN1A",  mu: 900, lfc: -2.6 },
    { symbol: "MDM2",    mu: 500, lfc: -1.6 },
    { symbol: "RRM2B",   mu: 300, lfc: -1.2 },
    { symbol: "DDB2",    mu: 200, lfc: -1.0 },
    { symbol: "GADD45A", mu: 120, lfc: -1.4 },
    { symbol: "ZMAT3",   mu: 150, lfc: -0.8 },
    { symbol: "BAX",     mu: 400, lfc: -0.6 },
    { symbol: "SESN1",   mu: 60,  lfc: -1.1 },
    { symbol: "TP53I3",  mu: 25,  lfc: -1.8 },
    { symbol: "BBC3",    mu: 8,   lfc: -1.3 }
  ].map((t, k) => Object.assign({ slot: 17 + 199 * k }, t));
  const TARGET_BY_SLOT = new Map(P53_TARGETS.map(t => [t.slot, t]));

  // Fischer 2017 Table 1, in the table's order: symbol and the number of the 16 genome-wide
  // data sets that found it. Parsed from the PMC XML (PMC5511239) and checked against
  // HGNC: four symbols have been renamed since (FAM198B -> GASK1B, FAM212B -> INKA2,
  // FAM210B -> MIMS2, WDR63 -> DNAI3); the current symbol is used, the printed one kept.
  const FISCHER_TABLE1 = ("CDKN1A:16 HSPA4L:9 PLCL2:7 RRM2B:16 ISCU:9 PRKAB1:7 MDM2:15 PHLDA3:9 PTP4A1:7 GDF15:14 " +
    "SERPINB5:9 SPATA18:7 SUSD6:14 SLC12A4:9 TGFA:7 BTG2:13 TRAF4:9 TLR3:7 DDB2:13 TRIM22:9 ZNF219:7 " +
    "GADD45A:13 CCDC90B:8 ZNF337:7 PLK3:13 CES2:8 ZNF79:7 TIGAR:13 DYRK3:8 ARHGEF3:6 RPS27L:12 " +
    "FAM13C:8 CD82:6 TNFRSF10B:12 GASK1B:8 CDIP1:6 TRIAP1:12 INKA2:8 CERS5:6 ZMAT3:12 KITLG:8 CSF1:6 " +
    "BAX:11 NADSYN1:8 DUSP14:6 BLOC1S2:11 NTPCR:8 EPS8L2:6 PGF:11 ORAI3:8 MIMS2:6 POLH:11 SESN2:8 " +
    "FUCA1:6 PPM1D:11 SLC30A1:8 GRHL3:6 PSTPIP2:11 TM7SF3:8 HHAT:6 SULF2:11 TMEM68:8 IER5:6 XPC:11 " +
    "DNAI3:8 IGDCC4:6 AEN:10 ZNF561:8 IKBIP:6 ANKRA2:10 ACER2:7 LAPTM5:6 FAS:10 ANXA4:7 MAST4:6 " +
    "GPR87:10 APOBEC3C:7 MICALL1:6 NINJ1:10 ASCC3:7 PADI4:6 PLK2:10 ASTN2:7 PANK1:6 SERTAD1:10 ATF3:7 " +
    "PMAIP1:6 SESN1:10 BBC3:7 PRDM1:6 TP53I3:10 CPE:7 RAP2B:6 TP53INP1:10 DCP1B:7 RNF19B:6 ABCA12:9 " +
    "EDA2R:7 RRAD:6 CCNG1:9 ENC1:7 SAC3D1:6 CMBL:9 EPHA2:7 SYTL1:6 CYFIP2:9 FDXR:7 TNFRSF10D:6 " +
    "DRAM1:9 FOSL1:7 TSPAN11:6 FBXO22:9 LIF:7 VWCE:6 FBXW7:9 PGPEP1:7").split(" ").map(x => x.split(":"));
  const RENAMED = { GASK1B: "FAM198B", INKA2: "FAM212B", MIMS2: "FAM210B", DNAI3: "WDR63" };
  const SET_FALL_MIN = 0.2, SET_FALL_MAX = 0.6;
  // The 106 unnamed members: slots on a stride of 19 (skipping the ten named slots), and
  // falls spread evenly over [0.2, 0.6] in a scrambled order, the same in every experiment.
  const P53_SET = (function () {
    const named = new Map(P53_TARGETS.map(t => [t.symbol, t])), used = new Set(TARGET_BY_SLOT.keys()), out = [];
    let j = 0, c = 0;
    const others = FISCHER_TABLE1.filter(r => !named.has(r[0]));
    for (const [sym, n] of FISCHER_TABLE1) {
      const t = named.get(sym), base = { symbol: sym, tableSymbol: RENAMED[sym] || sym, datasets: +n };
      if (t) { out.push(Object.assign(base, { slot: t.slot, lfc: t.lfc, named: true })); continue; }
      let slot; do { slot = (5 + 19 * c++) % N_GENES; } while (used.has(slot));
      used.add(slot);
      const r = (37 * j++) % others.length;
      out.push(Object.assign(base, { slot, lfc: -(SET_FALL_MIN + (SET_FALL_MAX - SET_FALL_MIN) * r / (others.length - 1)), named: false }));
    }
    return out;
  })();
  const SET_BY_SLOT = new Map(P53_SET.filter(m => !m.named).map(m => [m.slot, m]));

  // ---- Random numbers -------------------------------------------------------------
  function mulberry32(s) {
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function makeSampler(rng) {
    function norm() { let u = 0; while (!u) u = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng()); }
    function gamma(k) { // Marsaglia-Tsang, shape k, scale 1
      if (k < 1) return gamma(k + 1) * Math.pow(rng(), 1 / k);
      const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
      for (;;) {
        const x = norm(); let v = 1 + c * x; if (v <= 0) continue; v = v * v * v;
        const u = rng(); if (Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
      }
    }
    function poisson(lam) {
      if (lam > 60) return Math.max(0, Math.round(lam + Math.sqrt(lam) * norm()));
      const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= rng(); } while (p > L); return k - 1;
    }
    // Negative binomial as a gamma-Poisson mixture: mean mu, variance mu + phi mu^2
    function negbin(mu, phi) { return poisson(mu * gamma(1 / phi) * phi); }
    return { norm, gamma, poisson, negbin };
  }

  // ---- Special functions ----------------------------------------------------------
  function lgamma(x) { // Lanczos (g = 7, n = 9), |rel err| < 1e-13 for x > 0
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1; let a = c[0]; const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function betacf(a, b, x) { // modified Lentz continued fraction for the incomplete beta
    const qab = a + b, qap = a + 1, qam = a - 1, TINY = 1e-300;
    let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < TINY) d = TINY; d = 1 / d; let h = d;
    for (let m = 1; m <= 5000; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY; c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY; c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  }
  function ibeta(a, b, x) { // regularized incomplete beta I_x(a, b)
    if (x <= 0) return 0; if (x >= 1) return 1;
    const lbt = lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log1p(-x);
    return x < (a + 1) / (a + b + 2) ? Math.exp(lbt) * betacf(a, b, x) / a : 1 - Math.exp(lbt) * betacf(b, a, 1 - x) / b;
  }
  // Two-sided Student t p-value, 2 P(T_df > |t|). For huge df, the normal tail.
  function tTwoSided(t, df) {
    t = Math.abs(t);
    if (!isFinite(t)) return 0;
    if (df > 1e7) return erfc(t / Math.SQRT2);
    return ibeta(df / 2, 0.5, df / (df + t * t));
  }
  function erfc(x) { // via the regularized upper incomplete gamma Q(1/2, x^2), continued fraction
    if (x < 0) return 2 - erfc(-x);
    if (x < 1.5) { // series for erf
      let sum = x, term = x; const x2 = x * x;
      for (let n = 1; n < 200; n++) { term *= -x2 / n; const add = term / (2 * n + 1); sum += add; if (Math.abs(add) < 1e-17 * Math.abs(sum)) break; }
      return 1 - 2 / Math.sqrt(Math.PI) * sum;
    }
    const a = 0.5, z = x * x, TINY = 1e-300; let b = z + 1 - a, c = 1 / TINY, d = 1 / b, h = d;
    for (let i = 1; i < 500; i++) {
      const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < TINY) d = TINY;
      c = b + an / c; if (Math.abs(c) < TINY) c = TINY; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-z + a * Math.log(z) - lgamma(a)) * h;
  }
  // Polygamma functions: recurrence up to x >= 10, then the asymptotic series.
  function digamma(x) {
    let r = 0; while (x < 10) { r -= 1 / x; x++; }
    const f = 1 / (x * x);
    return r + Math.log(x) - 0.5 / x - f * (1 / 12 - f * (1 / 120 - f * (1 / 252 - f * (1 / 240 - f / 132))));
  }
  function trigamma(x) {
    let r = 0; while (x < 10) { r += 1 / (x * x); x++; }
    const f = 1 / (x * x);
    return r + 1 / x + f / 2 + f / x * (1 / 6 - f * (1 / 30 - f * (1 / 42 - f * (1 / 30 - f * 5 / 66))));
  }
  function tetragamma(x) { // psigamma(x, deriv = 2)
    let r = 0; while (x < 10) { r -= 2 / (x * x * x); x++; }
    const f = 1 / (x * x);
    return r - f - f / x - f * f * (1 / 2 - f * (1 / 6 - f * (1 / 6 - f * (3 / 10 - f * 5 / 6))));
  }
  // limma's trigammaInverse: Newton iteration from y = 0.5 + 1/x (Smyth 2004, appendix).
  function trigammaInverse(x) {
    if (!(x >= 0)) return NaN;
    if (x > 1e7) return 1 / Math.sqrt(x);
    if (x < 1e-6) return 1 / x;
    let y = 0.5 + 1 / x;
    for (let iter = 0; iter < 50; iter++) {
      const tri = trigamma(y), dif = tri * (1 - tri / x) / tetragamma(y);
      y += dif; if (-dif / y < 1e-8) break;
    }
    return y;
  }
  const logmdigamma = x => Math.log(x) - digamma(x);

  // ---- Natural cubic spline regression (the span of splines::ns(x, df = 4, intercept = TRUE))
  function quantile7(sorted, p) { // R's default quantile type 7
    const h = (sorted.length - 1) * p, lo = Math.floor(h);
    return lo + 1 < sorted.length ? sorted[lo] + (h - lo) * (sorted[lo + 1] - sorted[lo]) : sorted[lo];
  }
  // ESL (Hastie, Tibshirani, Friedman) eq. 5.4-5.5 basis; same column space as ns().
  function nsDesign(x, df) {
    const s = x.slice().sort((a, b) => a - b), lo = s[0], hi = s[s.length - 1], span = hi - lo || 1;
    const knots = [lo];
    for (let k = 1; k <= df - 2; k++) knots.push(quantile7(s, k / (df - 1)));
    knots.push(hi);
    const u = knots.map(k => (k - lo) / span), K = u.length;
    const dk = (v, k) => (Math.pow(Math.max(0, v - u[k]), 3) - Math.pow(Math.max(0, v - u[K - 1]), 3)) / (u[K - 1] - u[k]);
    const row = xv => {
      const v = (xv - lo) / span, r = [1, v];
      for (let k = 0; k < K - 2; k++) r.push(dk(v, k) - dk(v, K - 2));
      return r;
    };
    return { X: x.map(row), row, knots };
  }
  // Least squares by Householder QR; returns fitted values and the residual mean square
  // over n - rank (limma's mean(fit$effects[-(1:rank)]^2)).
  function lsFit(X, y) {
    const n = X.length, p = X[0].length, A = X.map(r => r.slice()), b = y.slice();
    for (let j = 0; j < p; j++) {
      let norm = 0; for (let i = j; i < n; i++) norm += A[i][j] * A[i][j];
      norm = Math.sqrt(norm); const alpha = A[j][j] > 0 ? -norm : norm;
      const v = new Float64Array(n); for (let i = j; i < n; i++) v[i] = A[i][j]; v[j] -= alpha;
      let vv = 0; for (let i = j; i < n; i++) vv += v[i] * v[i];
      if (vv === 0) continue;
      for (let c = j; c < p; c++) { let s = 0; for (let i = j; i < n; i++) s += v[i] * A[i][c]; s = 2 * s / vv; for (let i = j; i < n; i++) A[i][c] -= s * v[i]; }
      let s = 0; for (let i = j; i < n; i++) s += v[i] * b[i]; s = 2 * s / vv; for (let i = j; i < n; i++) b[i] -= s * v[i];
    }
    const beta = new Array(p).fill(0);
    for (let j = p - 1; j >= 0; j--) { let s = b[j]; for (let c = j + 1; c < p; c++) s -= A[j][c] * beta[c]; beta[j] = s / A[j][j]; }
    let rss = 0; for (let i = p; i < n; i++) rss += b[i] * b[i];
    const fitted = X.map(r => r.reduce((s, v, j) => s + v * beta[j], 0));
    return { beta, fitted, resVar: rss / (n - p), rank: p };
  }

  // limma::fitFDist for a common df1, optional covariate (limma 3.68.5).
  function fitFDist(x, df1, covariate) {
    const n = x.length;
    let splinedf = 1;
    if (covariate) {
      splinedf = 1 + (n >= 3) + (n >= 6) + (n >= 30);
      splinedf = Math.min(splinedf, new Set(covariate).size);
      if (splinedf < 2) covariate = null;
    }
    const xs = x.map(v => Math.max(v, 0)), sorted = xs.slice().sort((a, b) => a - b);
    let m = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    if (m === 0) m = 1;
    const e = xs.map(v => Math.log(Math.max(v, 1e-5 * m)) + logmdigamma(df1 / 2));
    let emean, evar;
    if (covariate) {
      const des = nsDesign(covariate, splinedf), fit = lsFit(des.X, e);
      emean = fit.fitted; evar = fit.resVar;
    } else {
      const mu = e.reduce((s, v) => s + v, 0) / n;
      emean = e.map(() => mu); evar = e.reduce((s, v) => s + (v - mu) * (v - mu), 0) / (n - 1);
    }
    evar -= trigamma(df1 / 2);
    let df2, scale;
    if (evar > 0) {
      df2 = 2 * trigammaInverse(evar);
      scale = emean.map(v => Math.exp(v - logmdigamma(df2 / 2)));
    } else {
      df2 = Infinity;
      scale = covariate ? emean.map(Math.exp) : emean.map(() => xs.reduce((s, v) => s + v, 0) / n);
    }
    return { scale: covariate ? scale : scale[0], df2, evar: evar + trigamma(df1 / 2) };
  }

  // ---- Simulation ---------------------------------------------------------------------
  // Gene parameters (baseline, changed or not, true change) come from one seeded stream, and
  // each gene's counts from its own stream seeded by (seed, gene), drawn wildtype/knockout in
  // replicate order. So the replicate count changes only the measurements: the genes stay
  // the same, and 3 replicates are the first 3 of the 8.
  function geneSeed(seed, g) { let h = Math.imul(seed ^ 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(g + 1, 0xC2B2AE35); h ^= h >>> 16; h = Math.imul(h, 0x27D4EB2F); return (h ^ h >>> 15) | 0; }
  function simulate(opts) {
    opts = opts || {};
    const seed = opts.seed == null ? DEFAULT_SEED : opts.seed, n = opts.reps || DEFAULT_REPS;
    const rng = mulberry32(seed), S = makeSampler(rng), genes = [], counts = opts.keepCounts ? { wt: [], ko: [] } : null;
    for (let g = 0; g < N_GENES; g++) {
      let mu = Math.exp(Math.log(60) + 1.6 * S.norm());
      let isDE = rng() < FRAC_DE;
      let trueLfc = isDE ? (rng() < 0.5 ? -1 : 1) * (0.6 + Math.abs(S.norm()) * 1.0) : 0;
      const tgt = TARGET_BY_SLOT.get(g) || SET_BY_SLOT.get(g);
      if (tgt) { if (tgt.mu) mu = tgt.mu; isDE = true; trueLfc = tgt.lfc; }
      const C = makeSampler(mulberry32(geneSeed(seed, g))), a = [], b = [];
      for (let r = 0; r < n; r++) { a.push(C.negbin(mu, DISPERSION)); b.push(C.negbin(mu * Math.pow(2, trueLfc), DISPERSION)); }
      const la = a.map(v => Math.log2(v + 0.5)), lb = b.map(v => Math.log2(v + 0.5));
      const ma = mean(la), mb = mean(lb);
      const s2 = (ssq(la, ma) + ssq(lb, mb)) / (2 * n - 2);   // pooled variance, df 2n - 2
      genes.push({ i: g, id: tgt ? tgt.symbol : "gene " + String(g + 1).padStart(4, "0"), symbol: tgt ? tgt.symbol : null,
        inSet: !!tgt, mu, isDE, trueLfc, A: (ma + mb) / 2, M: mb - ma, s2 });
      if (counts) { counts.wt.push(a); counts.ko.push(b); }
    }
    return { seed, reps: n, genes, counts };
  }
  function mean(a) { let s = 0; for (const v of a) s += v; return s / a.length; }
  function ssq(a, m) { let s = 0; for (const v of a) s += (v - m) * (v - m); return s; }

  // limma-trend: eBayes(lmFit(y, design), trend = TRUE) for a two-group design.
  function analyze(sim) {
    const genes = sim.genes, n = sim.reps, d = 2 * n - 2, G = genes.length;
    const fit = fitFDist(genes.map(x => x.s2), d, genes.map(x => x.A));
    const d0 = fit.df2, dfTotal = Math.min(d + d0, d * G);
    genes.forEach((x, i) => {
      const s0 = fit.scale[i];
      x.s0 = s0;
      x.s2post = isFinite(d0) ? (d0 * s0 + d * x.s2) / (d0 + d) : s0;
      x.t = x.M / Math.sqrt(x.s2post * 2 / n);
      x.p = tTwoSided(x.t, dfTotal);
    });
    const q = bh(genes.map(x => x.p));
    genes.forEach((x, i) => { x.q = q[i]; x.nlq = -Math.log10(Math.max(q[i], 1e-300)); });
    const sorted = genes.slice().sort((a, b) => a.p - b.p);
    return { seed: sim.seed, reps: n, d0, df: d, dfTotal, genes, sorted, fit };
  }
  function run(seed, reps) { return analyze(simulate({ seed, reps })); }

  // Ordinary two-sample t-test with pooled variance (no borrowing). A gene whose log counts
  // are constant within both groups has no variance estimate and is given p = 1.
  function plainT(sim) {
    const n = sim.reps, d = 2 * n - 2;
    const p = sim.genes.map(x => x.s2 > 0 ? tTwoSided(x.M / Math.sqrt(x.s2 * 2 / n), d) : 1);
    return { p, q: bh(p) };
  }

  // ---- Multiple testing ---------------------------------------------------------------
  // BH adjusted p-values (R's p.adjust(method = "BH")), returned in input order.
  function bh(p) {
    const m = p.length, idx = p.map((v, i) => i).sort((a, b) => p[a] - p[b]), q = new Array(m);
    let prev = 1;
    for (let r = m - 1; r >= 0; r--) { prev = Math.min(prev, p[idx[r]] * m / (r + 1)); q[idx[r]] = Math.min(1, prev); }
    return q;
  }
  // Step-up rank: the largest k with p_(k) <= k q / m (0 if none). sortedP ascending.
  function bhCutoff(sortedP, q) {
    const m = sortedP.length; let k = 0;
    for (let i = 0; i < m; i++) if (sortedP[i] <= (i + 1) * q / m) k = i + 1;
    return k;
  }
  // Storey (2002) pi0 estimate at a single lambda: #{p > lambda} / (m (1 - lambda)).
  function storeyPi0(p, lambda) {
    lambda = lambda == null ? 0.5 : lambda;
    let c = 0; for (const v of p) if (v > lambda) c++;
    return Math.min(1, c / (p.length * (1 - lambda)));
  }
  function pHistogram(genes, bins) {
    bins = bins || 20;
    const out = []; for (let b = 0; b < bins; b++) out.push({ x0: b / bins, x1: (b + 1) / bins, changed: 0, unchanged: 0 });
    for (const x of genes) { const b = Math.min(bins - 1, Math.floor(x.p * bins)); out[b][x.isDE ? "changed" : "unchanged"]++; }
    return out;
  }
  function passes(x, mode, fc, q) {
    const big = Math.abs(x.M) >= fc, sig = x.q <= q;
    return mode === "fc" ? big : mode === "q" ? sig : big && sig;
  }
  function callStats(genes, mode, fc, q) {
    let n = 0, tp = 0, nDE = 0;
    for (const x of genes) { if (x.isDE) nDE++; if (passes(x, mode, fc, q)) { n++; if (x.isDE) tp++; } }
    return { n, tp, fp: n - tp, nDE, fdp: n ? (n - tp) / n : 0, power: nDE ? tp / nDE : 0 };
  }

  // ---- Gene-set enrichment (preranked GSEA, Subramanian et al. 2005) ----------------------
  // Genes are ranked by the moderated t, largest first (rank 0 = most raised in the knockout).
  // Walking down the list, a set member adds w_j / N_R (w_j = |t_j|^weight, N_R the members'
  // total weight) and every other gene subtracts 1 / (N - k); the enrichment score ES is the
  // running sum's largest deviation from zero (the min when |min| >= |max|, as gseapy does).
  // Significance: gene-set permutation, as in GSEAPreranked, fgsea and gseapy prerank: random
  // k-gene sets on the same ranked list. NES = ES / |mean null ES of the same sign|;
  // p = (b + 1) / (n + 1), b of the n same-sign null scores at least as extreme (pRaw = b / n,
  // gseapy's nominal p). Gene permutation treats genes as independent, which they are here.
  function gseaOrder(genes) {
    const order = genes.map((g, i) => i).sort((a, b) => genes[b].t - genes[a].t || a - b);
    return { order, metric: order.map(i => genes[i].t) };
  }
  // Extremes of the running sum from the sorted hit positions (0-based ranks) alone.
  function gseaES(w, pos, N) {
    const k = pos.length; let NR = 0;
    for (let i = 0; i < k; i++) NR += w[pos[i]];
    const miss = 1 / (N - k); let cum = 0, maxv = 0, minv = 0, maxAt = -1, minAt = -1;
    for (let i = 0; i < k; i++) {
      const before = cum - (pos[i] - i) * miss;           // after the last miss before hit i
      if (before < minv && pos[i] > i) { minv = before; minAt = pos[i] - 1; }
      cum += w[pos[i]] / NR;
      const after = cum - (pos[i] - i) * miss;
      if (after > maxv) { maxv = after; maxAt = pos[i]; }
    }
    return Math.abs(maxv) > Math.abs(minv) ? { es: maxv, peak: maxAt } : { es: minv, peak: minAt };
  }
  function gseaRunning(w, isHit) {
    const N = w.length; let k = 0, NR = 0;
    for (let i = 0; i < N; i++) if (isHit[i]) { k++; NR += w[i]; }
    const out = new Float64Array(N), miss = 1 / (N - k); let cum = 0;
    for (let i = 0; i < N; i++) { cum += isHit[i] ? w[i] / NR : -miss; out[i] = cum; }
    return out;
  }
  function gseaNull(w, k, nPerm, seed) {
    const N = w.length, rng = mulberry32(seed), idx = new Int32Array(N), pos = new Int32Array(k), out = new Float64Array(nPerm);
    for (let i = 0; i < N; i++) idx[i] = i;
    for (let p = 0; p < nPerm; p++) {
      for (let i = 0; i < k; i++) { const j = i + Math.floor(rng() * (N - i)), v = idx[i]; idx[i] = idx[j]; idx[j] = v; pos[i] = idx[i]; }
      pos.sort();
      out[p] = gseaES(w, pos, N).es;
    }
    return out;
  }
  const gseaNullCache = new Map();
  function gsea(genes, slots, opts) {
    opts = opts || {};
    const nPerm = opts.nPerm || 10000, seed = opts.seed == null ? 2005 : opts.seed, weight = opts.weight == null ? 1 : opts.weight;
    const { order, metric } = opts.ranked || gseaOrder(genes), N = metric.length;
    const w = metric.map(v => Math.pow(Math.abs(v), weight));
    const rankOf = new Int32Array(N); order.forEach((g, r) => { rankOf[g] = r; });
    const positions = slots.map(s => rankOf[s]).sort((a, b) => a - b), k = positions.length;
    const obs = gseaES(w, positions, N);
    // The null depends only on the ranked list and k, so the page can reuse it across set variants.
    const key = opts.cacheKey != null ? opts.cacheKey + ":" + k + ":" + nPerm + ":" + seed + ":" + weight : null;
    let nul = key && gseaNullCache.get(key);
    if (!nul) { nul = gseaNull(w, k, nPerm, seed); if (key) { if (gseaNullCache.size > 40) gseaNullCache.clear(); gseaNullCache.set(key, nul); } }
    let nSame = 0, sum = 0, b = 0;
    for (const v of nul) {
      if (obs.es < 0 ? v < 0 : v >= 0) { nSame++; sum += v; if (obs.es < 0 ? v <= obs.es : v >= obs.es) b++; }
    }
    const nes = nSame ? obs.es / Math.abs(sum / nSame) : NaN;
    const isHit = new Uint8Array(N); positions.forEach(r => { isHit[r] = 1; });
    const leading = positions.filter(r => obs.es < 0 ? r > obs.peak : r <= obs.peak).map(r => order[r]);
    return { es: obs.es, peak: obs.peak, nes, p: (b + 1) / (nSame + 1), pRaw: nSame ? b / nSame : NaN, b, nNull: nSame,
      nPerm, k, N, positions, leading, order, metric, running: gseaRunning(w, isHit), nullES: nul };
  }
  // Set slots for the page's two variants: all 116 members, or those not called at q.
  function setSlots(genes, opts) {
    opts = opts || {};
    return P53_SET.map(m => m.slot).filter(s => !(opts.dropCalled && genes[s].q <= (opts.q == null ? 0.05 : opts.q)));
  }

  // Many-seed summary at one replicate count (q and fc thresholds as on the page).
  // With gseaPerm > 0, also preranked GSEA of the p53 set: all members, and without the members
  // called at q.
  function seedSummary(reps, seeds, q, fc, gseaPerm) {
    q = q == null ? 0.05 : q; fc = fc == null ? 1 : fc;
    const rows = [];
    for (const seed of seeds) {
      const sim = simulate({ seed, reps }), res = analyze(sim), g = res.genes;
      const qs = callStats(g, "q", fc, q), fs = callStats(g, "fc", fc, q), bs = callStats(g, "both", fc, q);
      const pt = plainT(sim); let ptN = 0, ptTP = 0;
      pt.q.forEach((v, i) => { if (v <= q) { ptN++; if (g[i].isDE) ptTP++; } });
      const nulls = g.filter(x => !x.isDE);
      rows.push({ seed, d0: res.d0, qN: qs.n, qFDP: qs.fdp, qPower: qs.power, fcN: fs.n, fcFDP: fs.fdp,
        bothN: bs.n, bothFDP: bs.fdp, bothPower: bs.power, plainN: ptN, plainTP: ptTP,
        null05: nulls.filter(x => x.p < 0.05).length / nulls.length,
        null001: nulls.filter(x => x.p < 0.001).length / nulls.length,
        pi0: storeyPi0(g.map(x => x.p)), truePi0: nulls.length / g.length,
        maxNlq: Math.max(...g.map(x => x.nlq)),
        cdkn1aQ: g[P53_TARGETS[0].slot].q,
        setCalled: P53_SET.filter(m => g[m.slot].q <= q).length });
      if (gseaPerm) {
        const row = rows[rows.length - 1], ranked = gseaOrder(g), o = { nPerm: gseaPerm, ranked };
        const all = gsea(g, setSlots(g), o), rest = gsea(g, setSlots(g, { dropCalled: true, q }), o);
        Object.assign(row, { gseaP: all.p, gseaNES: all.nes, restP: rest.p, restK: rest.k });
      }
    }
    const avg = k => mean(rows.map(r => r[k]));
    const med = k => { const s = rows.map(r => r[k]).sort((a, b) => a - b), h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
    return {
      reps, seeds: seeds.length, q, fc,
      d0Median: med("d0"), qFDPMean: avg("qFDP"), qFDPAbove: rows.filter(r => r.qFDP > q).length,
      qFDPZero: rows.filter(r => r.qFDP === 0).length, qFDPMax: Math.max(...rows.map(r => r.qFDP)),
      qPowerMean: avg("qPower"), qNMean: avg("qN"), fcFDPMean: avg("fcFDP"), bothNMean: avg("bothN"),
      bothFDPMean: avg("bothFDP"), plainNMean: avg("plainN"), plainTPMean: avg("plainTP"),
      plainZero: rows.filter(r => r.plainN === 0).length, null05: avg("null05"), null001: avg("null001"),
      pi0Mean: avg("pi0"), truePi0Mean: avg("truePi0"), maxNlqMedian: med("maxNlq"),
      cdkn1aCalled: rows.filter(r => r.cdkn1aQ <= q).length, setCalledMean: avg("setCalled"),
      setCalledZero: rows.filter(r => r.setCalled === 0).length,
      gsea: gseaPerm ? { nPerm: gseaPerm, pMax: Math.max(...rows.map(r => r.gseaP)), nesMedian: med("gseaNES"),
        restMaxP: Math.max(...rows.map(r => r.restP)), restBelow01: rows.filter(r => r.restP <= 0.01).length,
        restKMean: avg("restK") } : null, rows
    };
  }

  // ---- Checks ---------------------------------------------------------------------------
  function runChecks(print, data) {
    const out = [];
    const check = (name, ok, detail) => { out.push({ name, ok: !!ok, detail: detail || "" }); if (print) console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); };
    const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);

    // Special functions against closed forms.
    check("trigamma(1) = pi^2/6", rel(trigamma(1), Math.PI * Math.PI / 6) < 1e-12, trigamma(1).toPrecision(15));
    check("trigamma(1/2) = pi^2/2", rel(trigamma(0.5), Math.PI * Math.PI / 2) < 1e-12);
    check("digamma(1) = -Euler gamma", rel(digamma(1), -0.5772156649015329) < 1e-12);
    check("tetragamma(1) = -2 zeta(3)", rel(tetragamma(1), -2 * 1.2020569031595942) < 1e-12);
    check("trigammaInverse(trigamma(y)) = y", [0.3, 1, 2.5, 12, 80].every(y => rel(trigammaInverse(trigamma(y)), y) < 1e-7));
    // Student t: textbook critical values (two-sided 0.05) and closed forms.
    check("t(4) = 2.776445 gives p = 0.05", rel(tTwoSided(2.7764451051977987, 4), 0.05) < 1e-9);
    check("t(1) is Cauchy: p(1) = 0.5", rel(tTwoSided(1, 1), 0.5) < 1e-12);
    check("t(2): p = 1 - t / sqrt(2 + t^2)", [0.5, 3, 40].every(t => rel(tTwoSided(t, 2), 1 - t / Math.sqrt(2 + t * t)) < 1e-10));
    check("huge df tends to the normal: p(1.959964, 1e9) = 0.05", rel(tTwoSided(1.959963984540054, 1e9), 0.05) < 1e-9);
    // BH: hand-worked example. p = .01 .02 .03 .04 .05 .5 (m = 6): p*m/i = .06 .06 .06 .06 .06 .5
    const qq = bh([0.04, 0.01, 0.5, 0.03, 0.02, 0.05]);
    check("BH on a worked example", [0.06, 0.06, 0.5, 0.06, 0.06, 0.06].every((v, i) => Math.abs(qq[i] - v) < 1e-12), qq.map(v => v.toFixed(3)).join(" "));
    check("BH step-up takes the last crossing", bhCutoff([0.001, 0.03, 0.02 + 1e-9, 0.02, 0.9].sort((a, b) => a - b), 0.05) === 4);
    // fitFDist recovers known prior parameters from scaled-F draws (generative check).
    {
      const rng = mulberry32(5), S = makeSampler(rng), d1 = 4, d0 = 12, s0 = 0.3, G = 20000;
      const chi = k => 2 * S.gamma(k / 2);
      const x = []; for (let i = 0; i < G; i++) x.push(s0 * (chi(d1) / d1) / (chi(d0) / d0));
      const f = fitFDist(x, d1);
      check("fitFDist recovers d0 = 12, s0^2 = 0.3 from 20,000 scaled-F draws", Math.abs(f.df2 - d0) / d0 < 0.15 && Math.abs(f.scale - s0) / s0 < 0.05, "d0 " + f.df2.toFixed(2) + ", s0^2 " + f.scale.toFixed(4));
      const xc = []; for (let i = 0; i < G; i++) xc.push(s0 * chi(d1) / d1);
      const fc = fitFDist(xc, d1);
      check("no extra spread -> d0 large (true d0 infinite)", fc.df2 > 200, "d0 " + fc.df2.toFixed(0));
    }
    // Simulation sanity.
    const sim = simulate({ seed: DEFAULT_SEED, reps: DEFAULT_REPS }), res = analyze(sim);
    const nDE = sim.genes.filter(x => x.isDE).length;
    const nOther = sim.genes.filter(x => x.isDE && !x.inSet).length;
    check("about 10% of the 1,884 genes outside the p53 set changed", nOther > 140 && nOther < 240, nOther + " of 1,884; " + nDE + " changed in all");
    check("the p53 targets sit in their slots", P53_TARGETS.every(t => sim.genes[t.slot].symbol === t.symbol && sim.genes[t.slot].isDE));
    check("BH q never below p and monotone in p", res.sorted.every((x, i) => x.q >= x.p - 1e-15 && (i === 0 || x.q >= res.sorted[i - 1].q - 1e-15)));
    {
      const r2 = run(DEFAULT_SEED, DEFAULT_REPS);
      check("seeded: same seed gives identical p-values", r2.genes.every((x, i) => x.p === res.genes[i].p));
    }
    // Null calibration: with no planted changes the moderated p-values are close to uniform.
    // (Run on the default-seed genes that are unchanged.)
    {
      const nulls = res.genes.filter(x => !x.isDE), f05 = nulls.filter(x => x.p < 0.05).length / nulls.length;
      check("null genes: P(p < 0.05) within 0.03-0.07", f05 > 0.03 && f05 < 0.07, f05.toFixed(4));
    }

    // The p53 set: Fischer 2017 Table 1 has 116 genes; the ten named targets are among them.
    check("p53 set: 116 distinct genes in 116 distinct slots", P53_SET.length === 116 && new Set(P53_SET.map(m => m.symbol)).size === 116 && new Set(P53_SET.map(m => m.slot)).size === 116);
    check("p53 set: the ten named targets are Table 1 genes", P53_TARGETS.every(t => P53_SET.some(m => m.symbol === t.symbol && m.named)));
    check("p53 set: every member planted with a fall", sim.genes.filter(x => x.inSet).length === 116 && P53_SET.every(m => sim.genes[m.slot].isDE && sim.genes[m.slot].trueLfc < 0));
    // GSEA by hand. Metric 3 2 1 -1 -2 -3, set = ranks 0 and 4 (weights 3 and 2, N_R = 5), a miss
    // costs 1/4: running sum 0.6 0.35 0.1 -0.15 0.25 0, so ES = 0.6 at rank 0. Unweighted
    // (weight 0, the Kolmogorov-Smirnov form): 0.5 0.25 0 -0.25 0.25 0, ES = 0.5.
    {
      const toy = [3, 2, 1, -1, -2, -3].map((t, i) => ({ i, t }));
      const g1 = gsea(toy, [0, 4], { nPerm: 50 }), g0 = gsea(toy, [0, 4], { nPerm: 50, weight: 0 });
      const want = [0.6, 0.35, 0.1, -0.15, 0.25, 0];
      check("GSEA running sum and ES on a hand-worked example", Math.abs(g1.es - 0.6) < 1e-12 && g1.peak === 0 && want.every((v, i) => Math.abs(g1.running[i] - v) < 1e-12) && Math.abs(g0.es - 0.5) < 1e-12,
        "ES " + g1.es + ", unweighted " + g0.es);
      // -1 and -3 at ranks 3 and 5: sums -.25 -.5 -.75 -.5 -.75 0, ES -0.75 first reached at rank 2,
      // so both members lie past the peak (the leading edge of a negative score).
      const neg = gsea(toy, [3, 5], { nPerm: 50 });
      check("GSEA negative ES, peak and leading edge", Math.abs(neg.es + 0.75) < 1e-12 && neg.peak === 2 && neg.leading.length === 2, "ES " + neg.es + " peak " + neg.peak);
    }
    // The fast hit-position ES equals the extreme of the full running sum on random sets.
    {
      const { order, metric } = gseaOrder(res.genes), w = metric.map(Math.abs), rng = mulberry32(99);
      let worst = 0;
      for (let rep = 0; rep < 50; rep++) {
        const k = 5 + Math.floor(rng() * 200), hit = new Uint8Array(N_GENES), pos = [];
        while (pos.length < k) { const r = Math.floor(rng() * N_GENES); if (!hit[r]) { hit[r] = 1; pos.push(r); } }
        pos.sort((a, b) => a - b);
        const run = gseaRunning(w, hit); let mx = 0, mn = 0; for (const v of run) { if (v > mx) mx = v; if (v < mn) mn = v; }
        worst = Math.max(worst, Math.abs(gseaES(w, pos, N_GENES).es - (Math.abs(mx) > Math.abs(mn) ? mx : mn)));
      }
      check("GSEA ES from hit positions equals the running-sum extreme (50 random sets)", worst < 1e-12, "worst " + worst.toExponential(1));
      const nul = gseaNull(w, 116, 4000, 3), mean = nul.reduce((a, b) => a + b, 0) / nul.length;
      check("GSEA null of random sets is centered (mean ES of 4,000 random 116-gene sets near 0)", Math.abs(mean) < 0.02, mean.toFixed(4));
    }
    // gseapy prerank on the same ranked lists (scripts/bio-05-gsea-ref.mjs).
    if (data && data.gsea) {
      for (const ref of data.gsea.runs) {
        const r = run(ref.seed, ref.reps);
        const g = gsea(r.genes, setSlots(r.genes, { dropCalled: ref.set === "rest", q: 0.05 }), { nPerm: 10000 });
        const lead = new Set(g.leading), sameLead = ref.lead.length === lead.size && ref.lead.every(i => lead.has(i));
        let worstRun = 0; ref.runIdx.forEach((rk, k) => { worstRun = Math.max(worstRun, Math.abs(g.running[rk] - ref.runVal[k])); });
        const tag = `(seed ${ref.seed}, ${ref.reps} reps, ${ref.set === "rest" ? "uncalled members" : "all 116"})`;
        check("gseapy " + data.gsea.version + " ES and leading edge " + tag, rel(g.es, ref.es) < 1e-9 && g.k === ref.k && sameLead && worstRun < 1e-9,
          "ES " + g.es.toFixed(6) + " vs " + ref.es.toFixed(6) + ", leading edge " + lead.size + (sameLead ? " same" : " differs vs " + ref.lead.length));
        check("gseapy NES and p " + tag, Math.abs(g.nes - ref.nes) / Math.abs(ref.nes) < 0.03 && g.p < 0.01 && ref.p < 0.01,
          "NES " + g.nes.toFixed(3) + " vs " + ref.nes.toFixed(3) + "; p " + g.p.toExponential(1) + " vs " + ref.p.toExponential(1) + " (" + ref.nPerm + " perms)");
      }
    } else check("gseapy reference present in essay-05.json", false, "run scripts/bio-05-gsea-ref.mjs");

    // limma reference (essay-05.json, written by scripts/bio-05-limma-ref.mjs from limma's own
    // eBayes(lmFit(...), trend = TRUE) on these simulated counts).
    if (data && data.limma) {
      for (const ref of data.limma.runs) {
        const r = run(ref.seed, ref.reps);
        if (ref.d0 === "Inf") check(`limma d0 = Inf (seed ${ref.seed}, ${ref.reps} reps)`, r.d0 === Infinity, String(r.d0));
        else check(`limma d0 (seed ${ref.seed}, ${ref.reps} reps)`, rel(r.d0, ref.d0) < 1e-6, r.d0.toFixed(6) + " vs limma " + ref.d0.toFixed(6));
        let worstS0 = 0, worstP = 0, worstLogP = 0;
        ref.idx.forEach((i, k) => {
          worstS0 = Math.max(worstS0, rel(r.genes[i].s0, ref.s2prior[k]));
          worstP = Math.max(worstP, rel(r.genes[i].p, ref.p[k]));
          worstLogP = Math.max(worstLogP, Math.abs(Math.log10(r.genes[i].p) - Math.log10(ref.p[k])));
        });
        check(`limma s2.prior at ${ref.idx.length} genes (seed ${ref.seed}, ${ref.reps} reps)`, worstS0 < 1e-6, "worst rel " + worstS0.toExponential(1));
        check(`limma p-values at ${ref.idx.length} genes (seed ${ref.seed}, ${ref.reps} reps)`, worstP < 1e-6 || worstLogP < 1e-6, "worst rel " + worstP.toExponential(1));
        if (ref.pOrdinary) {
          const pt = plainT(simulate({ seed: ref.seed, reps: ref.reps }));
          let worst = 0;
          ref.idx.forEach((i, k) => { if (ref.pOrdinary[k] != null && r.genes[i].s2 > 0) worst = Math.max(worst, rel(pt.p[i], ref.pOrdinary[k])); });
          check(`ordinary t p-values match R (seed ${ref.seed}, ${ref.reps} reps)`, worst < 1e-6, "worst rel " + worst.toExponential(1));
        }
        const nSig = r.genes.filter(x => x.q <= 0.05).length;
        check(`limma calls at q <= 0.05 (seed ${ref.seed}, ${ref.reps} reps)`, nSig === ref.nSig005, nSig + " vs limma " + ref.nSig005);
      }
    } else check("limma reference present in essay-05.json", false, "run scripts/bio-05-limma-ref.mjs");

    // The prose numbers: recompute the many-seed summaries quoted on the page.
    if (data && data.summaries) {
      for (const ref of data.summaries) {
        const seeds = []; for (let s = ref.seedFrom; s < ref.seedFrom + ref.seeds; s++) seeds.push(s);
        const sm = seedSummary(ref.reps, seeds, ref.q, ref.fc, ref.gsea ? ref.gsea.nPerm : 0);
        const keys = ["qFDPMean", "qFDPAbove", "qPowerMean", "fcFDPMean", "plainNMean", "plainZero", "qNMean", "bothNMean", "d0Median", "cdkn1aCalled", "setCalledMean", "setCalledZero"];
        const bad = keys.filter(k => Math.abs(sm[k] - ref[k]) > 1e-9 * Math.max(1, Math.abs(ref[k])));
        if (ref.gsea) ["pMax", "nesMedian", "restMaxP", "restBelow01", "restKMean"].forEach(k => { if (Math.abs(sm.gsea[k] - ref.gsea[k]) > 1e-9 * Math.max(1, Math.abs(ref.gsea[k]))) bad.push("gsea." + k); });
        check(`many-seed summary, ${ref.reps} reps over ${ref.seeds} seeds`, bad.length === 0, bad.length ? "differs: " + bad.join(", ") : "FDP " + (100 * sm.qFDPMean).toFixed(1) + "%, " + sm.qFDPAbove + " runs above q");
      }
    }
    return out;
  }

  const api = {
    N_GENES, FRAC_DE, DISPERSION, DEFAULT_SEED, DEFAULT_REPS, P53_TARGETS, P53_SET, FISCHER_TABLE1, SET_FALL_MIN, SET_FALL_MAX,
    gsea, gseaES, gseaRunning, gseaNull, gseaOrder, setSlots,
    mulberry32, makeSampler, simulate, analyze, run, plainT, fitFDist, nsDesign, lsFit,
    bh, bhCutoff, storeyPi0, pHistogram, passes, callStats, seedSummary,
    tTwoSided, lgamma, digamma, trigamma, tetragamma, trigammaInverse, runChecks
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay05 = api;
})(typeof self !== "undefined" ? self : this);
