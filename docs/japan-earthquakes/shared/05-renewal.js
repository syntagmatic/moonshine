// Renewal models for japan-earthquakes essay 05, "Thirteen Centuries of Earthquakes".
//
// How the official long-term probability of the next Nankai Trough earthquake is
// built, so the essay can show how sensitive it is. Nothing here is a forecast.
//
// 1. Brownian Passage Time (BPT): the inverse Gaussian distribution of the time
//    between earthquakes, mean mu and aperiodicity alpha (shape mu / alpha^2).
//    Conditional probability of an earthquake in the next dt years given that
//    `elapsed` years have passed without one (Matthews, Ellsworth, Reasenberg 2002).
// 2. Maximum-likelihood fit of mu and alpha to a set of intervals (closed form).
// 3. Time-predictable model (Shimazaki and Nakata 1980): the next interval is
//    proportional to the uplift of the last earthquake. HERP fits the slope to
//    the Murotsu harbour uplifts and uses the predicted interval as the BPT mean.
// 4. Two ways to carry uncertainty into the probability, standing in for HERP's
//    2025 Bayesian models (which the page does not reproduce):
//      mcTimePredictable: Monte Carlo over the uplift errors and alpha;
//      bptPosterior: flat-prior grid posterior of (mu, alpha) for one interval set.
// 5. counterfactual: the same BPT method run on the Japan Trench deposit
//    sequence as it stood on the day before 2011-03-11.
//
// Works in the browser (window.Renewal) and in node (module.exports).
// No fetch in here: the page passes in shared/data/05-renewal.json. Under node,
// runChecks() reads that file itself when it is not handed one.
(function (root) {
  "use strict";
  const SQRT2 = Math.SQRT2, SQRTPI = Math.sqrt(Math.PI);
  // where this script was loaded from, for the browser test page to find the data next to it
  const SRC = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : null;

  // ---- normal distribution, accurate far into the tail ----
  // erfc(z) for z >= 0: power series for z < 2, continued fraction beyond.
  function erfcPos(z) {
    if (z < 2) {
      let term = z, sum = z;
      for (let n = 1; n < 200; n++) {
        term *= 2 * z * z / (2 * n + 1);
        sum += term;
        if (term < 1e-18 * sum) break;
      }
      return 1 - 2 / SQRTPI * Math.exp(-z * z) * sum;
    }
    return Math.exp(-z * z) / (SQRTPI * erfcCF(z));
  }
  // erfc(z) = exp(-z^2) / (sqrt(pi) * (z + (1/2)/(z + (2/2)/(z + (3/2)/(z + ...)))))
  function erfcCF(z) {
    let t = z;
    for (let k = 120; k >= 1; k--) t = z + (k / 2) / t;
    return t;
  }
  function normCdf(x) {
    return x >= 0 ? 1 - 0.5 * erfcPos(x / SQRT2) : 0.5 * erfcPos(-x / SQRT2);
  }
  // log of Phi(-u) for u >= 0, without underflow
  function logPhiNeg(u) {
    const z = u / SQRT2;
    if (z < 2) return Math.log(0.5 * erfcPos(z));
    return -z * z - Math.log(2 * SQRTPI * erfcCF(z));
  }

  // ---- BPT ----
  // F(t) = Phi(u1) + exp(2/alpha^2) Phi(-u2); the second term is formed in log
  // space because exp(2/alpha^2) is about 1e26 at alpha = 0.18.
  function bptCdf(t, mu, alpha) {
    if (!(t > 0)) return 0;
    const r = Math.sqrt(t / mu), s = 1 / r;
    const u1 = (r - s) / alpha, u2 = (r + s) / alpha;
    return Math.min(1, normCdf(u1) + Math.exp(2 / (alpha * alpha) + logPhiNeg(u2)));
  }
  function bptPdf(t, mu, alpha) {
    if (!(t > 0)) return 0;
    return Math.sqrt(mu / (2 * Math.PI * alpha * alpha * t * t * t)) *
      Math.exp(-(t - mu) * (t - mu) / (2 * alpha * alpha * mu * t));
  }
  // P(earthquake in the next dt years | none for `elapsed` years)
  function condProb(mu, alpha, elapsed, dt) {
    if (dt == null) dt = 30;
    const f0 = bptCdf(elapsed, mu, alpha), f1 = bptCdf(elapsed + dt, mu, alpha);
    const s = 1 - f0;
    return s < 1e-300 ? 1 : Math.min(1, Math.max(0, (f1 - f0) / s));
  }
  function logLik(intervals, mu, alpha) {
    let s = 0;
    for (const x of intervals) s += Math.log(Math.max(bptPdf(x, mu, alpha), 1e-300));
    return s;
  }
  // Closed-form maximum likelihood: mu = mean, lambda = n / sum(1/x - 1/mu), alpha^2 = mu / lambda
  function fitBPT(intervals) {
    const n = intervals.length, mu = intervals.reduce((a, b) => a + b, 0) / n;
    const inv = intervals.reduce((a, x) => a + 1 / x - 1 / mu, 0);
    const lambda = n / inv;
    return { mu, alpha: Math.sqrt(mu / lambda), lambda, n };
  }
  const diffs = ts => ts.slice(1).map((t, i) => t - ts[i]);

  // ---- time-predictable: next interval = slope x last uplift (line through the origin) ----
  function timePredictable(uplifts, intervals) {
    let num = 0, den = 0;
    uplifts.forEach((u, i) => { if (i < intervals.length) { num += u * intervals[i]; den += u * u; } });
    const slope = num / den;
    return { slope, predict: u => slope * u };
  }

  // ---- seeded random numbers ----
  function rng(seed) {
    let a = seed >>> 0;
    const u = () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const normal = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
    return { u, normal };
  }
  const quantile = (sorted, q) => {
    const x = q * (sorted.length - 1), i = Math.floor(x), f = x - i;
    return i + 1 < sorted.length ? sorted[i] * (1 - f) + sorted[i + 1] * f : sorted[i];
  };
  function band(ps) {
    const s = Float64Array.from(ps).sort();
    return { mean: ps.reduce((a, b) => a + b, 0) / ps.length, lo: quantile(s, 0.15), hi: quantile(s, 0.85), med: quantile(s, 0.5) };
  }

  // Monte Carlo over the uplift errors: draw each earthquake's uplift from a
  // normal (mean, sd), refit the time-predictable slope on the two earthquakes
  // that have a following interval, predict the next interval from the latest
  // earthquake's uplift, and draw alpha uniformly. Draws with a non-positive
  // slope uplift are dropped. cfg: {uplifts:[{mean,sd}...], intervals, alpha:[lo,hi]}.
  function mcTimePredictable(seed, N, cfg) {
    const r = rng(seed), up = cfg.uplifts, k = up.length - 1, mus = [], alphas = [];
    for (let i = 0; i < N; i++) {
      const u = up.map(x => x.mean + x.sd * r.normal());
      const a = cfg.alpha[0] + (cfg.alpha[1] - cfg.alpha[0]) * r.u();
      if (u.slice(0, k).some(x => x < 0.1)) continue;
      const mu = timePredictable(u.slice(0, k), cfg.intervals).slope * u[k];
      mus.push(mu); alphas.push(a);
    }
    return { mu: mus, alpha: alphas };
  }
  function drawsBand(d, elapsed, dt) {
    return band(d.mu.map((m, i) => condProb(m, d.alpha[i], elapsed, dt)));
  }

  // Flat-prior grid posterior of (mu, alpha) given the intervals, pruned to the
  // cells that hold 99.5% of the weight. Returns {mu[], alpha[], w[]}.
  function bptPosterior(intervals, opt) {
    opt = opt || {};
    const m0 = opt.mu || [60, 300, 2], a0 = opt.alpha || [0.05, 1, 0.01];
    const cells = [];
    let max = -Infinity;
    for (let mu = m0[0]; mu <= m0[1]; mu += m0[2])
      for (let a = a0[0]; a <= a0[1] + 1e-9; a += a0[2]) {
        const l = logLik(intervals, mu, a);
        cells.push([mu, a, l]);
        if (l > max) max = l;
      }
    let tot = 0;
    cells.forEach(c => { c[2] = Math.exp(c[2] - max); tot += c[2]; });
    cells.sort((x, y) => y[2] - x[2]);
    const out = { mu: [], alpha: [], w: [] };
    let acc = 0;
    for (const c of cells) {
      out.mu.push(c[0]); out.alpha.push(c[1]); out.w.push(c[2] / tot);
      acc += c[2] / tot;
      if (acc > 0.995) break;
    }
    return out;
  }
  // Posterior mean and 70% credible interval of the conditional probability
  function posteriorBand(post, elapsed, dt) {
    const p = post.mu.map((m, i) => [condProb(m, post.alpha[i], elapsed, dt), post.w[i]]);
    p.sort((a, b) => a[0] - b[0]);
    const tot = p.reduce((a, c) => a + c[1], 0);
    let acc = 0, lo = null, hi = null, mean = 0;
    for (const [v, w] of p) {
      mean += v * w / tot; acc += w / tot;
      if (lo == null && acc >= 0.15) lo = v;
      if (hi == null && acc >= 0.85) hi = v;
    }
    return { mean, lo, hi };
  }

  // ---- decimal years from NOAA dates ----
  const leap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const CUM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  // Year plus the fraction of the year elapsed at the start of the day, proleptic Gregorian
  function decimalYear(y, m, d) {
    const doy = CUM[m - 1] + (m > 2 && leap(y) ? 1 : 0) + d - 1;
    return y + doy / (leap(y) ? 366 : 365);
  }

  // ---- Japan Trench: the deposit sequence before 2011 ----
  // Sequence = the two older deposit events, 869, and `prev` (1454 or 1611).
  // The two older events are only known to a century range, so take the extremes
  // and the middle of each; alpha 0.2 to 0.3 as HERP uses. Returns the range of
  // 30-year probability over those combinations, and the mean interval range.
  function trenchCounterfactual(tr, prevKey, evalYear, dt) {
    const ev = k => tr.events.find(e => e.key === k);
    const o4 = ev("bce4"), o5 = ev("ce4"), j = ev("jogan"), prev = ev(prevKey);
    const ps = [], mus = [];
    for (const a4 of [o4.from, (o4.from + o4.to) / 2, o4.to])
      for (const a5 of [o5.from, (o5.from + o5.to) / 2, o5.to]) {
        const seq = [a4, a5, j.t, prev.t], iv = diffs(seq), mu = iv.reduce((a, b) => a + b, 0) / iv.length;
        mus.push(mu);
        for (const al of tr.alpha) ps.push(condProb(mu, al, evalYear - prev.t, dt));
      }
    return { lo: Math.min.apply(null, ps), hi: Math.max.apply(null, ps), muLo: Math.min.apply(null, mus), muHi: Math.max.apply(null, mus) };
  }

  // ---- checks ----
  // Reference values from scipy 1.13 (scripts/japan-05-scipy-ref.py): invgauss
  // cdf and pdf, and Nelder-Mead maximum-likelihood fits. Rows: [mu, alpha, t, cdf, pdf].
const BPT_REF = [
  [88.2, 0.15, 26.46, 1.23001229015552e-17, 3.16509787649145e-17],
  [88.2, 0.15, 211.68, 0.999999999509008, 1.06510582926878e-10],
  [88.2, 0.24, 141.12, 0.982466549327428, 0.00132074463442965],
  [88.2, 0.5, 110.25, 0.757588109990759, 0.00585702406790154],
  [88.2, 1, 79.38, 0.625023202586492, 0.0052682329393306],
  [117, 0.15, 64.35, 3.41068566257863e-05, 1.55872830727164e-05],
  [117, 0.24, 35.1, 7.82432896569247e-08, 6.01588275345784e-08],
  [117, 0.24, 280.8, 0.999952828413813, 3.18735356552169e-06],
  [117, 0.5, 187.2, 0.887336375789328, 0.00214853141868656],
  [117, 1, 146.25, 0.751660635867788, 0.00237958828686849],
  [180, 0.15, 162, 0.264325608776053, 0.0135191482992507],
  [180, 0.24, 99, 0.00758264444932205, 0.000926546564878041],
  [180, 0.5, 54, 0.00837183376177159, 0.0010287038536353],
  [180, 0.5, 432, 0.981592253104292, 0.000232810755424036],
  [180, 1, 288, 0.829534581084745, 0.000978587034757133],
  [575, 0.15, 718.75, 0.941716622278118, 0.00108952328981606],
  [575, 0.24, 517.5, 0.373069248820178, 0.00307453360573431],
  [575, 0.5, 316.25, 0.155899281297079, 0.00162903163661112],
  [575, 1, 172.5, 0.165726619829399, 0.00186589204079902],
  [575, 1, 1380, 0.921054956535094, 0.000124047622537578],
];
const MLE_REF = [
  ["I", 157.637502, 0.369839759],
  ["III", 116.88, 0.18303117],
  ["V", 119.1, 0.242790511],
];

  function loadData() {
    try {
      if (typeof module !== "undefined" && module.exports && typeof require === "function") {
        return JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "data", "05-renewal.json"), "utf8"));
      }
      if (typeof XMLHttpRequest !== "undefined" && SRC) {
        const x = new XMLHttpRequest();
        x.open("GET", SRC.replace(/[^/]*$/, "data/05-renewal.json"), false);
        x.send();
        if (x.status === 200) return JSON.parse(x.responseText);
      }
    } catch (e) { /* fall through */ }
    return null;
  }
  // The page and the checks share this: the intervals of one HERP case, from NOAA dates
  function caseTimes(nk, c) { return nk.cases[c].map(i => nk.events[i].t); }

  function runChecks(print, data) {
    const out = [];
    const check = (name, ok, detail) => out.push({ name, ok: !!ok, detail });
    // The browser test page can hand over another library's data object, so check the shape
    if (!data || !data.nankai || !data.herp) data = loadData();

    let w = 0;
    BPT_REF.forEach(r => { w = Math.max(w, Math.abs(bptCdf(r[2], r[0], r[1]) - r[3])); });
    check("BPT cdf matches scipy.stats.invgauss at " + BPT_REF.length + " points", w < 1e-9, "max diff " + w.toExponential(1));
    // pdf: relative, since the values span 1e-18 to 1e-2
    w = 0;
    BPT_REF.forEach(r => { w = Math.max(w, Math.abs(bptPdf(r[2], r[0], r[1]) / r[4] - 1)); });
    check("BPT pdf matches scipy to 1e-9 relative", w < 1e-9, "max rel diff " + w.toExponential(1));
    // cdf against the integral of the pdf (Simpson on a log grid in t)
    w = 0;
    [[88.2, 0.24, 141], [117, 0.18, 130], [575, 0.5, 400]].forEach(c => {
      const n = 4000, a = Math.log(c[2] * 1e-3), b = Math.log(c[2]);
      let s = 0;
      for (let i = 0; i <= n; i++) {
        const t = Math.exp(a + (b - a) * i / n), f = bptPdf(t, c[0], c[1]) * t;
        s += f * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
      }
      w = Math.max(w, Math.abs(s * (b - a) / n / 3 - bptCdf(c[2], c[0], c[1])));
    });
    check("BPT cdf equals the integral of its pdf", w < 1e-8, "max diff " + w.toExponential(1));
    check("BPT mean is mu: the pdf-weighted mean of t", (() => {
      const mu = 117, al = 0.3; let s = 0, m = 0; const dt = 0.05;
      for (let t = dt / 2; t < 4000; t += dt) { const f = bptPdf(t, mu, al) * dt; s += f; m += f * t; }
      return Math.abs(m / s - mu) < 1e-3 && Math.abs(s - 1) < 1e-6;
    })());
    check("conditional probability: 30 years from the origin is the cdf", Math.abs(condProb(100, 0.3, 0, 30) - bptCdf(30, 100, 0.3)) < 1e-12);


    if (!data) { check("data/05-renewal.json loaded", false, "not found"); return finish(out, print); }
    const nk = data.nankai, ev = nk.events;

    // Closed-form fit against scipy's Nelder-Mead maximum, on HERP's own decimal years (p.7)
    let wm = 0, wl = 1;
    MLE_REF.forEach(r => {
      const iv = diffs(nk.cases[r[0]].map(i => ev[i].herp));
      const f = fitBPT(iv);
      wm = Math.max(wm, Math.abs(f.mu / r[1] - 1), Math.abs(f.alpha / r[2] - 1));
      // the fit is a maximum: nudging mu or alpha either way lowers the likelihood
      const l0 = logLik(iv, f.mu, f.alpha);
      [[1.01, 1], [0.99, 1], [1, 1.01], [1, 0.99]].forEach(d => { if (logLik(iv, f.mu * d[0], f.alpha * d[1]) >= l0) wl = 0; });
    });
    check("closed-form BPT fit equals the scipy Nelder-Mead maximum (cases I, III, V) to 1e-7 relative", wm < 1e-7, "max rel diff " + wm.toExponential(1));
    check("fitted (mu, alpha) is a likelihood maximum", wl === 1);

    // Data: NOAA-derived decimal years against HERP's list (summary p.7)
    const dmax = Math.max.apply(null, ev.map(e => Math.abs(e.t - e.herp)));
    check("NOAA-derived event years match HERP's list (p.7) to 0.1 yr", dmax <= 0.1 && ev.length === 9, "max diff " + dmax.toFixed(2) + " yr");
    check("every event is one or two NOAA records", ev.every(e => e.ids.length >= 1 && e.ids.length <= 2 && e.noaa.length === e.ids.length));

    // HERP's time-predictable series: mu 88.2, last event 1946.0, alpha 0.20 to 0.24
    const last = ev[8].t, tp = nk.tp;
    const herp = id => data.herp.find(h => h.id === id);
    let ok = true, det = [];
    ["tp2013", "tp2014", "tp2018", "tp2025"].forEach(id => {
      const h = herp(id), a = condProb(tp.mu, tp.alpha[0], h.date - last) * 100, b = condProb(tp.mu, tp.alpha[1], h.date - last) * 100;
      const lo = Math.min(a, b), hi = Math.max(a, b);
      // the published value is a rounded range or a "程度" value: allow 2.5 points either side
      if (hi < h.lo - 2.5 || lo > h.hi + 2.5) ok = false;
      det.push(h.date + ": " + lo.toFixed(1) + "-" + hi.toFixed(1) + " vs " + h.lo + (h.hi !== h.lo ? "-" + h.hi : ""));
    });
    check("time-predictable BPT (mu 88.2, alpha 0.20-0.24) reproduces HERP's 2013, 2014, 2018 and 2025 values", ok, det.join("; "));

    // BPT on cases III to V at 2013-01: HERP gives 10-30%
    const p13 = ["III", "IV", "V"].map(c => {
      const f = fitBPT(diffs(caseTimes(nk, c))); return condProb(f.mu, f.alpha, 2013 - last) * 100;
    });
    check("BPT maximum-likelihood fits of cases III-V at 2013 fall within HERP's 10-30%", p13.every(p => p >= 10 && p <= 30), p13.map(p => p.toFixed(1)).join(", "));

    // Bayesian BPT, case III at 2025-01: HERP's 70% interval 20-50%
    const post = bptPosterior(diffs(caseTimes(nk, "III")));
    const pb = posteriorBand(post, 2025 - last);
    const h25 = herp("bpt2025");
    check("flat-prior BPT posterior, case III at 2025: 70% interval within 3 points of HERP's 20-50%",
      Math.abs(pb.lo * 100 - h25.lo) <= 3 && Math.abs(pb.hi * 100 - h25.hi) <= 3, (pb.lo * 100).toFixed(1) + "-" + (pb.hi * 100).toFixed(1) + ", mean " + (pb.mean * 100).toFixed(1));

    // Monte Carlo over the uplift errors, standing in for HERP's SSD-BPT
    const cfg = {
      uplifts: data.nankai.uplift.map(u => ({ mean: u.mean, sd: u.sd })),
      intervals: [ev[7].t - ev[6].t, ev[8].t - ev[7].t], alpha: tp.alpha
    };
    const mc = mcTimePredictable(1, 20000, cfg), mb = drawsBand(mc, 2025 - last);
    const s25 = herp("ssd2025");
    check("uplift Monte Carlo at 2025: lower 70% bound 55-65%, upper at least 90% (HERP SSD-BPT 60-90% or more)",
      mb.lo * 100 >= 55 && mb.lo * 100 <= 65 && mb.hi * 100 >= 90, (mb.lo * 100).toFixed(1) + "-" + (mb.hi * 100).toFixed(1) + ", mean " + (mb.mean * 100).toFixed(1));
    const again = mcTimePredictable(1, 2000, cfg);
    check("the seeded Monte Carlo repeats exactly", again.mu[0] === mc.mu[0] && again.mu[1500] === mc.mu[1500] && again.alpha[1500] === mc.alpha[1500]);
    const slope = timePredictable(cfg.uplifts.slice(0, 2).map(u => u.mean), cfg.intervals).slope;
    check("through-origin slope of the mean uplifts reproduces the intervals within 20%", (() => {
      return cfg.uplifts.slice(0, 2).every((u, i) => Math.abs(slope * u.mean / cfg.intervals[i] - 1) < 0.2);
    })(), "slope " + slope.toFixed(1) + " yr/m");

    // Japan Trench, HERP's own inputs at 2019.0
    const jt = data.trench.herp2019;
    let jmax = 0;
    jt.muYears.forEach(m => jt.alpha.forEach(a => { jmax = Math.max(jmax, condProb(m, a, jt.evalDate - jt.last)); }));
    check("Japan Trench at 2019 (mu 550-600, alpha 0.2-0.3): 30-year probability below 0.1%, HERP's ほぼ0%", jmax < 0.001, (jmax * 100).toExponential(1) + "%");
    const c54 = trenchCounterfactual(data.trench, "kyotoku", jt.last - 0.02), c61 = trenchCounterfactual(data.trench, "keicho", jt.last - 0.02);
    check("Japan Trench the day before 2011: far higher if the previous event was 1454 than if it was 1611",
      c54.lo > c61.hi * 1.5 && c54.lo > 0.05, "1454 " + (c54.lo * 100).toFixed(0) + "-" + (c54.hi * 100).toFixed(0) + "%, 1611 " + (c61.lo * 100).toFixed(0) + "-" + (c61.hi * 100).toFixed(0) + "%");
    return finish(out, print);
  }
  function finish(out, print) {
    if (print !== false && typeof console !== "undefined")
      out.forEach(r => console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.detail ? "  (" + r.detail + ")" : "")));
    return out;
  }

  const api = {
    normCdf, bptCdf, bptPdf, condProb, logLik, fitBPT, diffs, timePredictable, rng, band,
    mcTimePredictable, drawsBand, bptPosterior, posteriorBand, decimalYear, trenchCounterfactual,
    caseTimes, runChecks
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Renewal = api;
})(typeof window !== "undefined" ? window : globalThis);
