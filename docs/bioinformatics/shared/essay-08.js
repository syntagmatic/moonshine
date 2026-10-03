// BioEssay08: the statistics behind Bioinformatics Visualization essay 08 (Clinical Evidence).
// Browser global `BioEssay08`, and `module.exports` under node. No fetch, no Math.random.
//
// ---- API -------------------------------------------------------------------------
//   km(times, events)  Kaplan-Meier steps [{t, s, atRisk, events, censored, lo, hi}], with a 95%
//     Greenwood interval on the log(-log S) scale (R survfit conf.type = "log-log").
//   logrank(times, events, group)  two-group log-rank: {chi2, p, O1, E1, V, hr}; group[i] truthy =
//     group 1; hr = exp((O1 - E1) / V), the Peto one-step hazard ratio of group 1 against 0.
//   logrankK(times, events, labels)  k-group log-rank (R survdiff): {chi2, df, p, O, E, keys}.
//   cox(times, events, x)  Cox model with one covariate, Breslow ties, Newton-Raphson:
//     {beta, se, hr, lo, hi}.
//   coxMulti(times, events, X)  the same with a row of covariates per patient:
//     {beta, se, hr, p (Wald), loglik, loglik0}; a likelihood-ratio test of nested models is
//     chi2sf(2 (llBig - llSmall), extra parameters).
//   scan(times, events, values, opts)  the cutpoint scan: for each percentile pct in
//     [opts.lo = 10, opts.hi = 90], the lowest round(n pct / 100) values form group 1 ("low") and the
//     log-rank test compares them with the rest. -> [{pct, n1, cut, chi2, p, hr}]
//   permScan(times, events, values, opts)  the same scan after shuffling `values` across patients
//     (times and events stay together), opts {B = 1000, seed, keep = 30, lo, hi}.
//     -> {minP: [B], q05 (5% point of the null minimum p), curves: first `keep` null scans as p arrays,
//         corrected(pmin): share of null minima at or below pmin}
//   pcorAltman(pmin, eps)  the closed-form correction of a minimum p over cutpoints between the
//     eps and 1 - eps quantiles (Lausen and Schumacher 1992, the formula given in Altman, Lausen,
//     Sauerbrei and Schumacher 1994): phi(z)(z - 1/z) log((1 - eps)^2 / eps^2) + 4 phi(z) / z,
//     z = the (1 - pmin / 2) normal quantile.
//   meta(y, se, model)  inverse-variance pooling, model "fixed" or "random" (DerSimonian-Laird):
//     {pooled, se, lo, hi, Q, df, I2, tau2, weights, weightPct}
//   egger(y, se)  Egger's regression test: y/se on 1/se by least squares.
//     -> {intercept, slope, seIntercept, t, df, p}
//   clusterNames(BioCohort, cohort)  Part 6's four consensus clusters (BioCohort.consensus on
//     BioCohort.features, k = 4), each named by its majority planted subtype A-D.
//   chi2sf(x, df), tcdf(t, df), normInv(p), normPdf(x): distribution helpers.
//   mulberry32(seed): the series' seeded generator.
//   runChecks(print) -> [{name, ok, detail}]  against R survival (survfit, survdiff, coxph),
//     lm(), textbook values (Freireich 6-MP data; the BCG vaccine trials), and scipy.
// -----------------------------------------------------------------------------------
(function (root) {
  "use strict";

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ---- distributions ----
  function lgamma(x) { // Lanczos, g = 7
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61503916999185, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
    x -= 1; let a = c[0]; const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function gammaQ(a, x) { // regularized upper incomplete gamma (Numerical Recipes gser / gcf)
    if (x <= 0) return 1;
    const gln = lgamma(a);
    if (x < a + 1) {
      let ap = a, sum = 1 / a, del = sum;
      for (let n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
      return 1 - sum * Math.exp(-x + a * Math.log(x) - gln);
    }
    let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (let i = 1; i < 500; i++) {
      const an = -i * (i - a); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-x + a * Math.log(x) - gln) * h;
  }
  function chi2sf(x, df) { return !(x > 0) ? 1 : gammaQ(df / 2, x / 2); }
  function betacf(a, b, x) {
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-300) d = 1e-300; d = 1 / d; let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  }
  function ibeta(a, b, x) { // regularized incomplete beta I_x(a, b)
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function tcdf(t, df) { const x = df / (df + t * t), tail = 0.5 * ibeta(df / 2, 0.5, x); return t >= 0 ? 1 - tail : tail; }
  function normPdf(x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
  function normInv(p) { // Acklam's rational approximation, |relative error| < 1.2e-9
    const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
    const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
    const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425;
    if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) return -normInv(1 - p);
    const q = p - 0.5, r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }

  // ---- survival ----
  function order(times) { return times.map((t, i) => i).sort((a, b) => times[a] - times[b]); }

  function km(times, events) {
    const idx = order(times);
    let atRisk = times.length, s = 1, v = 0, i = 0, lo = 1, hi = 1;
    const out = [{ t: 0, s: 1, atRisk, events: 0, censored: 0, lo: 1, hi: 1 }];
    while (i < idx.length) {
      const t = times[idx[i]]; let d = 0, c = 0;
      while (i < idx.length && times[idx[i]] === t) { if (events[idx[i]]) d++; else c++; i++; }
      if (d) {
        s *= 1 - d / atRisk;
        if (atRisk > d) v += d / (atRisk * (atRisk - d));
        if (s > 0 && s < 1 && v > 0) {
          const th = Math.log(-Math.log(s)), se = Math.sqrt(v) / Math.abs(Math.log(s));
          lo = Math.exp(-Math.exp(th + 1.96 * se)); hi = Math.exp(-Math.exp(th - 1.96 * se));
        } else { lo = s; hi = s; }
      }
      out.push({ t, s, atRisk, events: d, censored: c, lo, hi });
      atRisk -= d + c;
    }
    return out;
  }
  function kmAt(curve, t, key) { let v = 1; key = key || "s"; for (const st of curve) { if (st.t <= t) v = st[key]; else break; } return v; }
  function kmMedian(curve) { for (const st of curve) if (st.events && st.s <= 0.5) return st.t; return null; }

  function logrankSorted(times, events, idx, group) { // idx: indices sorted by time
    let n = idx.length, n1 = 0, O1 = 0, E1 = 0, V = 0, i = 0;
    for (let k = 0; k < idx.length; k++) if (group[idx[k]]) n1++;
    while (i < idx.length) {
      const t = times[idx[i]]; let d = 0, d1 = 0, m = 0, m1 = 0;
      while (i < idx.length && times[idx[i]] === t) { const k = idx[i]; m++; if (group[k]) m1++; if (events[k]) { d++; if (group[k]) d1++; } i++; }
      if (d && n > 1) { E1 += d * n1 / n; V += d * (n1 / n) * (1 - n1 / n) * (n - d) / (n - 1); O1 += d1; }
      n -= m; n1 -= m1;
    }
    const chi2 = V > 0 ? (O1 - E1) * (O1 - E1) / V : 0;
    return { chi2, p: chi2sf(chi2, 1), O1, E1, V, hr: V > 0 ? Math.exp((O1 - E1) / V) : 1 };
  }
  function logrank(times, events, group) { return logrankSorted(times, events, order(times), group); }

  function solve(A, b) { // Gaussian elimination with partial pivoting
    const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
    return x;
  }
  function logrankK(times, events, labels) {
    const keys = Array.from(new Set(labels)).sort(), K = keys.length, idx = order(times);
    const g = labels.map(l => keys.indexOf(l));
    const nk = new Array(K).fill(0); g.forEach(j => nk[j]++);
    const O = new Array(K).fill(0), E = new Array(K).fill(0), Vm = keys.map(() => new Array(K).fill(0));
    let n = times.length, i = 0;
    while (i < idx.length) {
      const t = times[idx[i]], dk = new Array(K).fill(0), mk = new Array(K).fill(0); let d = 0;
      while (i < idx.length && times[idx[i]] === t) { const k = idx[i]; mk[g[k]]++; if (events[k]) { d++; dk[g[k]]++; } i++; }
      if (d && n > 1) {
        for (let a = 0; a < K; a++) {
          O[a] += dk[a]; E[a] += d * nk[a] / n;
          for (let b = 0; b < K; b++) Vm[a][b] += d * (n - d) / (n - 1) * (nk[a] / n) * ((a === b ? 1 : 0) - nk[b] / n);
        }
      }
      for (let a = 0; a < K; a++) nk[a] -= mk[a];
      n -= mk.reduce((x, y) => x + y, 0);
    }
    const u = O.map((o, a) => o - E[a]).slice(0, K - 1), Vr = Vm.slice(0, K - 1).map(r => r.slice(0, K - 1));
    const x = solve(Vr, u), chi2 = u.reduce((s, ui, a) => s + ui * x[a], 0);
    return { chi2, df: K - 1, p: chi2sf(chi2, K - 1), O, E, keys };
  }

  function cox(times, events, x) { // one covariate, Breslow ties
    const idx = order(times).reverse(); // descending time, so risk sets accumulate
    const groups = []; let i = 0;
    while (i < idx.length) { const t = times[idx[i]], m = []; while (i < idx.length && times[idx[i]] === t) m.push(idx[i++]); groups.push(m); }
    function pass(beta) {
      let s0 = 0, s1 = 0, s2 = 0, U = 0, I = 0;
      for (const m of groups) {
        for (const k of m) { const w = Math.exp(beta * x[k]); s0 += w; s1 += w * x[k]; s2 += w * x[k] * x[k]; }
        let d = 0, sx = 0; for (const k of m) if (events[k]) { d++; sx += x[k]; }
        if (d) { const mu = s1 / s0; U += sx - d * mu; I += d * (s2 / s0 - mu * mu); }
      }
      return { U, I };
    }
    let beta = 0;
    for (let it = 0; it < 50; it++) {
      const { U, I } = pass(beta); if (!(I > 0)) break;
      const step = Math.max(-2, Math.min(2, U / I)); beta += step;
      if (Math.abs(step) < 1e-10) break;
    }
    const { I } = pass(beta), se = I > 0 ? Math.sqrt(1 / I) : NaN;
    return { beta, se, hr: Math.exp(beta), lo: Math.exp(beta - 1.96 * se), hi: Math.exp(beta + 1.96 * se) };
  }

  function invert(A) { const n = A.length; return A.map((_, j) => solve(A, A.map((__, i) => i === j ? 1 : 0))).map((col, j, cols) => cols.map(c => c[j])); }
  function coxMulti(times, events, X) { // X: rows of covariates; Breslow ties, Newton-Raphson
    const p = X[0].length, idx = order(times).reverse(), groups = []; let i = 0;
    while (i < idx.length) { const t = times[idx[i]], m = []; while (i < idx.length && times[idx[i]] === t) m.push(idx[i++]); groups.push(m); }
    function pass(b) {
      let s0 = 0, ll = 0; const s1 = new Array(p).fill(0), s2 = b.map(() => new Array(p).fill(0)), U = new Array(p).fill(0), I = b.map(() => new Array(p).fill(0));
      for (const m of groups) {
        for (const k of m) { const x = X[k]; let eta = 0; for (let a = 0; a < p; a++) eta += b[a] * x[a]; const w = Math.exp(eta); s0 += w;
          for (let a = 0; a < p; a++) { s1[a] += w * x[a]; for (let c = 0; c < p; c++) s2[a][c] += w * x[a] * x[c]; } }
        let d = 0; const sx = new Array(p).fill(0); let seta = 0;
        for (const k of m) if (events[k]) { d++; for (let a = 0; a < p; a++) { sx[a] += X[k][a]; seta += b[a] * X[k][a]; } }
        if (d) {
          ll += seta - d * Math.log(s0);
          for (let a = 0; a < p; a++) { U[a] += sx[a] - d * s1[a] / s0; for (let c = 0; c < p; c++) I[a][c] += d * (s2[a][c] / s0 - s1[a] * s1[c] / (s0 * s0)); }
        }
      }
      return { ll, U, I };
    }
    let b = new Array(p).fill(0); const ll0 = pass(b).ll;
    for (let it = 0; it < 60; it++) {
      const { U, I } = pass(b), step = solve(I, U); let mx = 0;
      b = b.map((v, a) => { mx = Math.max(mx, Math.abs(step[a])); return v + Math.max(-2, Math.min(2, step[a])); });
      if (mx < 1e-10) break;
    }
    const fin = pass(b), V = invert(fin.I), se = V.map((r, a) => Math.sqrt(r[a]));
    return { beta: b, se, hr: b.map(Math.exp), p: b.map((v, a) => chi2sf((v / se[a]) * (v / se[a]), 1)), loglik: fin.ll, loglik0: ll0 };
  }

  // ---- the cutpoint scan ----
  function scanCore(times, events, idx, values, lo, hi) {
    const n = values.length, rank = new Array(n), byVal = values.map((v, i) => i).sort((a, b) => values[a] - values[b] || a - b);
    byVal.forEach((k, r) => { rank[k] = r; });
    const out = [], group = new Array(n);
    for (let pct = lo; pct <= hi; pct++) {
      const n1 = Math.round(n * pct / 100);
      for (let k = 0; k < n; k++) group[k] = rank[k] < n1;
      const r = logrankSorted(times, events, idx, group);
      out.push({ pct, n1, cut: (values[byVal[n1 - 1]] + values[byVal[n1]]) / 2, chi2: r.chi2, p: r.p, hr: r.hr });
    }
    return out;
  }
  function scan(times, events, values, opts) {
    opts = opts || {};
    return scanCore(times, events, order(times), values, opts.lo == null ? 10 : opts.lo, opts.hi == null ? 90 : opts.hi);
  }
  function permScan(times, events, values, opts) {
    opts = opts || {};
    const B = opts.B || 1000, keep = opts.keep == null ? 30 : opts.keep, lo = opts.lo == null ? 10 : opts.lo, hi = opts.hi == null ? 90 : opts.hi;
    const rng = mulberry32(opts.seed == null ? 20261003 : opts.seed), idx = order(times), v = values.slice();
    const minP = [], curves = [];
    for (let b = 0; b < B; b++) {
      for (let i = v.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = v[i]; v[i] = v[j]; v[j] = t; }
      const s = scanCore(times, events, idx, v, lo, hi);
      let m = 1; for (const r of s) if (r.p < m) m = r.p;
      minP.push(m);
      if (curves.length < keep) curves.push(s.map(r => r.p));
    }
    const sorted = minP.slice().sort((a, b) => a - b);
    const q05 = sorted[Math.max(0, Math.ceil(0.05 * B) - 1)];
    return { B, minP, q05, curves, corrected: pmin => sorted.filter(m => m <= pmin).length / B };
  }
  function pcorAltman(pmin, eps) {
    const z = normInv(1 - pmin / 2), f = normPdf(z);
    return Math.min(1, f * (z - 1 / z) * Math.log((1 - eps) * (1 - eps) / (eps * eps)) + 4 * f / z);
  }

  // ---- meta-analysis ----
  function meta(y, se, model) {
    const w = se.map(s => 1 / (s * s)), W = w.reduce((a, b) => a + b, 0);
    const fe = w.reduce((a, wi, i) => a + wi * y[i], 0) / W;
    const Q = w.reduce((a, wi, i) => a + wi * (y[i] - fe) * (y[i] - fe), 0), df = y.length - 1;
    const c = W - w.reduce((a, wi) => a + wi * wi, 0) / W;
    const tau2 = model === "random" && df > 0 && c > 0 ? Math.max(0, (Q - df) / c) : 0;
    const wr = se.map(s => 1 / (s * s + tau2)), Wr = wr.reduce((a, b) => a + b, 0);
    const pooled = wr.reduce((a, wi, i) => a + wi * y[i], 0) / Wr, pse = Math.sqrt(1 / Wr);
    return { pooled, se: pse, lo: pooled - 1.96 * pse, hi: pooled + 1.96 * pse, Q, df,
      I2: df > 0 && Q > df ? (Q - df) / Q * 100 : 0, tau2, weights: wr, weightPct: wr.map(x => 100 * x / Wr) };
  }
  function egger(y, se) {
    const X = se.map(s => 1 / s), Y = y.map((v, i) => v / se[i]), n = y.length;
    const mx = X.reduce((a, b) => a + b, 0) / n, my = Y.reduce((a, b) => a + b, 0) / n;
    let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (X[i] - mx) * (X[i] - mx); sxy += (X[i] - mx) * (Y[i] - my); }
    const slope = sxy / sxx, intercept = my - slope * mx;
    let rss = 0; for (let i = 0; i < n; i++) { const r = Y[i] - intercept - slope * X[i]; rss += r * r; }
    const df = n - 2, s2 = rss / df, seI = Math.sqrt(s2 * (1 / n + mx * mx / sxx)), t = intercept / seI;
    return { intercept, slope, seIntercept: seI, t, df, p: 2 * (1 - tcdf(Math.abs(t), df)) };
  }

  // ---- checks ----
  // Freireich et al. 1963 6-MP / placebo remission times (weeks; the survival package's `gehan`).
  const SIXMP = { t: [6, 6, 6, 6, 7, 9, 10, 10, 11, 13, 16, 17, 19, 20, 22, 23, 25, 32, 32, 34, 35],
    e: [1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0] };
  const PLACEBO = { t: [1, 1, 2, 2, 3, 4, 4, 5, 5, 8, 8, 8, 8, 11, 11, 12, 12, 15, 17, 22, 23], e: new Array(21).fill(1) };
  // BCG vaccine trials (Colditz et al. 1994; metafor's dat.bcg): tpos, tneg, cpos, cneg.
  const BCG = [[4, 119, 11, 128], [6, 300, 29, 274], [3, 228, 11, 209], [62, 13536, 248, 12619], [33, 5036, 47, 5761],
    [180, 1361, 372, 1079], [8, 2537, 10, 619], [505, 87886, 499, 87892], [29, 7470, 45, 7232], [17, 1699, 65, 1600],
    [186, 50448, 141, 27197], [5, 2493, 3, 2338], [27, 16886, 29, 17825]];

  // Part 6's four consensus clusters of the shared cohort, each named by its majority planted subtype.
  function clusterNames(BC, co) {
    const P = co.patients, lab = BC.consensus(BC.features(co).z, 4).labels, name = {};
    Array.from(new Set(lab)).forEach(k => {
      const c = {}; P.forEach((q, i) => { if (lab[i] === k) c[q.subtype] = (c[q.subtype] || 0) + 1; });
      name[k] = Object.keys(c).sort((a, b) => c[b] - c[a])[0];
    });
    return lab.map(k => name[k]);
  }

  function runChecks(print) {
    const out = [];
    function add(name, ok, detail) { out.push({ name, ok: !!ok, detail }); if (print) print((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); }
    const near = (a, b, tol) => Math.abs(a - b) <= tol;

    // distributions vs scipy 1.13 (chi2.sf, t.cdf, norm.ppf)
    add("chi2sf matches scipy (3.84 df1 0.050044; 7.81 df3 0.050106; 20 df3 1.6974e-4)",
      near(chi2sf(3.84, 1), 0.0500435, 2e-6) && near(chi2sf(7.81, 3), 0.0501057, 2e-6) && near(chi2sf(20, 3) / 1.69742e-4, 1, 1e-4),
      [chi2sf(3.84, 1), chi2sf(7.81, 3), chi2sf(20, 3)].map(v => v.toPrecision(6)).join(", "));
    add("tcdf matches scipy (t 2.0 df 6 two-sided 0.092426; t 2.447 df 6 0.049994)",
      near(2 * (1 - tcdf(2, 6)), 0.0924263, 2e-6) && near(2 * (1 - tcdf(2.447, 6)), 0.0499940, 2e-6),
      [2 * (1 - tcdf(2, 6)), 2 * (1 - tcdf(2.447, 6))].map(v => v.toPrecision(6)).join(", "));
    add("normInv matches scipy (0.975 -> 1.959964, 0.999 -> 3.090232)",
      near(normInv(0.975), 1.959964, 1e-6) && near(normInv(0.999), 3.090232, 1e-6));

    // Kaplan-Meier with log-log band: R survfit(Surv(time, cens) ~ 1, gehan[6-MP], conf.type = "log-log")
    const k = km(SIXMP.t, SIXMP.e), at = t => k.find(s => s.t === t);
    const ref = [[6, 0.857143, 0.619718, 0.951552], [7, 0.806723, 0.563147, 0.922809], [10, 0.752941, 0.503200, 0.889362],
      [13, 0.690196, 0.431610, 0.849066], [16, 0.627451, 0.367511, 0.804912], [22, 0.537815, 0.267779, 0.746791], [23, 0.448179, 0.188052, 0.680143]];
    add("KM and log-log band match R survfit on the 6-MP arm",
      ref.every(([t, s, lo, hi]) => near(at(t).s, s, 1e-5) && near(at(t).lo, lo, 2e-4) && near(at(t).hi, hi, 2e-4)),
      ref.map(([t]) => `${t}: ${at(t).s.toFixed(4)} [${at(t).lo.toFixed(4)}, ${at(t).hi.toFixed(4)}]`).join("; "));

    // log-rank and Cox on 6-MP vs placebo: R survdiff chisq 16.8 (16.79), O/E 9/19.25 and 21/10.75;
    // coxph(ties = "breslow") coef 1.509, se 0.4096
    const T = SIXMP.t.concat(PLACEBO.t), E = SIXMP.e.concat(PLACEBO.e), G = T.map((_, i) => i >= 21 ? 1 : 0);
    const lr = logrank(T, E, G), lk = logrankK(T, E, G.map(g => g ? "placebo" : "6-MP"));
    add("log-rank matches R survdiff on the 6-MP data (chisq 16.793, E 19.2505 / 10.7495)",
      near(lr.chi2, 16.7929, 2e-3) && near(lr.E1, 10.7495, 1e-3) && near(lk.chi2, lr.chi2, 1e-9) && near(lk.E[0], 19.2505, 1e-3),
      `chi2 ${lr.chi2.toFixed(4)}, E ${lk.E.map(v => v.toFixed(4)).join(" / ")}`);
    const cx = cox(T, E, G);
    add("Cox (Breslow ties) matches R coxph on the 6-MP data (coef 1.50919, se 0.40956)",
      near(cx.beta, 1.50919, 1e-4) && near(cx.se, 0.40956, 1e-4), `beta ${cx.beta.toFixed(4)}, se ${cx.se.toFixed(4)}`);

    // meta-analysis on the BCG trials, log risk ratios: metafor rma(method = "DL") estimate -0.7141,
    // se 0.1787, tau2 0.3088, I2 92.12%, Q 152.233; fixed effect -0.4303 (se 0.0405). Reference values recomputed in R by hand
    // (temp/bio-audit/f08/ref.R; metafor is not installed there) and matching metafor's published output.
    const y = BCG.map(([a, b, c, d]) => Math.log((a / (a + b)) / (c / (c + d))));
    const se = BCG.map(([a, b, c, d]) => Math.sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d)));
    const re = meta(y, se, "random"), fe = meta(y, se, "fixed");
    add("DerSimonian-Laird matches the BCG trials (pooled -0.7141, se 0.1787, tau2 0.3088, I2 92.1%, Q 152.23)",
      near(re.pooled, -0.7141, 2e-4) && near(re.se, 0.1787, 2e-4) && near(re.tau2, 0.3088, 2e-4) && near(re.I2, 92.12, 0.02) && near(re.Q, 152.233, 2e-3) && near(fe.pooled, -0.4303, 2e-4),
      `RE ${re.pooled.toFixed(4)} (se ${re.se.toFixed(4)}), tau2 ${re.tau2.toFixed(4)}, I2 ${re.I2.toFixed(2)}, Q ${re.Q.toFixed(3)}, FE ${fe.pooled.toFixed(4)}`);
    // Egger on the BCG trials: R lm(I(yi/sei) ~ I(1/sei)) intercept -2.1120 (se 1.5072, t -1.401, p 0.1887)
    const eg = egger(y, se);
    add("Egger regression matches R lm on the BCG trials", near(eg.intercept, -2.11204, 1e-4) && near(eg.seIntercept, 1.50722, 1e-4) && near(eg.p, 0.188707, 1e-4),
      `intercept ${eg.intercept.toFixed(4)}, se ${eg.seIntercept.toFixed(4)}, t ${eg.t.toFixed(3)}, p ${eg.p.toFixed(4)}`);

    // multivariable Cox on the shared cohort: R coxph(ties = "breslow"), temp/bio-audit/f08/cohort-ref.R.
    // The four consensus clusters are named by their majority planted subtype, as the page does.
    const BC = (typeof module !== "undefined" && module.exports) ? require("./cohort.js") : root.BioCohort;
    if (BC) {
      const co = BC.generate(), P = co.patients, tt2 = P.map(q => q.survival.time), ee2 = P.map(q => q.survival.event ? 1 : 0);
      const cl = clusterNames(BC, co);
      const c1 = coxMulti(tt2, ee2, P.map(q => [q.expr.CDKN1A]));
      const c2 = coxMulti(tt2, ee2, P.map((q, i) => [q.expr.CDKN1A, cl[i] === "B" ? 1 : 0, cl[i] === "C" ? 1 : 0, cl[i] === "D" ? 1 : 0]));
      const c3 = coxMulti(tt2, ee2, P.map(q => [q.tp53.status === "mutant" ? 1 : 0, q.expr.CDKN1A]));
      add("coxMulti matches R coxph on the cohort (loglik -213.6327, -208.1251, -205.9177; TP53 coef -0.01081 se 0.3137)",
        near(c1.loglik0, -213.6326657, 1e-5) && near(c1.loglik, -208.1251113, 1e-5) && near(c2.loglik, -205.9177032, 1e-5) &&
        near(c2.beta[0], -0.83992503, 1e-5) && near(c3.beta[0], -0.0108105, 1e-5) && near(c3.se[0], 0.313699, 1e-5) && near(c3.beta[1], -0.4493665, 1e-5),
        `${c1.loglik0.toFixed(4)}, ${c1.loglik.toFixed(4)}, ${c2.loglik.toFixed(4)}; TP53 ${c3.beta[0].toFixed(5)} (${c3.se[0].toFixed(5)})`);
      const lkc = logrankK(tt2, ee2, cl);
      add("four-cluster log-rank matches R survdiff (chisq 5.9235, 3 df)", near(lkc.chi2, 5.923545, 1e-4), lkc.chi2.toFixed(5) + ", p " + lkc.p.toFixed(4));
    }
    // the correction formula: Altman et al. 1994 say a minimum p of 0.002 over the 10th-90th
    // percentiles corresponds to about 0.05
    const pc = pcorAltman(0.002, 0.1);
    add("pcorAltman(0.002, 0.1) is about 0.05", near(pc, 0.05, 0.006), pc.toFixed(4));

    // permutation null of the scan: on null data, about 40% of minimum p fall below 0.05
    // (Altman et al. 1994; Hollander, Sauerbrei and Schumacher found 44 of 100), and the permutation
    // 5% point sits near the formula's 0.002.
    const rng = mulberry32(7), n = 100, tt = [], ee = [], vv = [];
    for (let i = 0; i < n; i++) { tt.push(-Math.log(1 - rng()) * 30); ee.push(rng() < 0.6 ? 1 : 0); vv.push(rng()); }
    const ps = permScan(tt, ee, vv, { B: 400, seed: 11, keep: 0 });
    const share = ps.minP.filter(m => m < 0.05).length / ps.B;
    add("permutation null: share of minimum p below 0.05 is 30-55%, 5% point 0.0008-0.004",
      share > 0.30 && share < 0.55 && ps.q05 > 0.0008 && ps.q05 < 0.004, `share ${share.toFixed(3)}, q05 ${ps.q05.toFixed(4)}, formula at q05 ${pcorAltman(ps.q05, 0.1).toFixed(3)}`);
    // scan agrees with the plain test at the median
    const sc = scan(tt, ee, vv), med = sc.find(r => r.pct === 50);
    const g50 = vv.map(v => v < (vv.slice().sort((a, b) => a - b)[49] + vv.slice().sort((a, b) => a - b)[50]) / 2);
    add("scan at the 50th percentile equals a direct log-rank split", near(med.p, logrank(tt, ee, g50).p, 1e-12), med.p.toFixed(5));
    return out;
  }

  const api = { mulberry32, chi2sf, tcdf, normInv, normPdf, km, kmAt, kmMedian, logrank, logrankK, cox, coxMulti, clusterNames,
    scan, permScan, pcorAltman, meta, egger, runChecks, SIXMP, PLACEBO, BCG };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay08 = api;
})(typeof self !== "undefined" ? self : this);
