// Aftershock and background model for japan-earthquakes essay 03, "When the
// Ground Won't Stop Shaking".
//
// 1. Omori-Utsu: rate(t) = mu + K (t + c)^-p, maximum-likelihood fit by Nelder-Mead
//    (moved out of the page; mu fixed).
// 2. Temporal ETAS (Ogata 1988), in the parameterization of Ogata's SAPP code:
//      lambda(t) = mu + sum_{t_j < t} K exp(alpha (M_j - Mz)) / (t - t_j + c)^p
//    over events with M >= Mz, time in days. Exact log-likelihood (SAPP etasap with
//    approx = 0), with a target window [tStart, tEnd] that may exclude gaps (the
//    minutes to hours after a large shock when the catalog is missing events; events
//    inside a gap still trigger), Nelder-Mead fit with numerical-Hessian errors,
//    expected counts, transformed (residual) times, background probability and
//    ancestry shares (Zhuang, Ogata & Vere-Jones 2002), a seeded branching simulator
//    (the equivalent of SAPP etasim), the branching ratio, and Bath's law.
// Checks: the log-likelihood and the MLE are compared with Ogata's SAPP on its own
// sample catalog (2003-07-26 northern Miyagi M6.2, 2,305 events), whose results are
// stored in the data file by scripts/japan-03-sapp-fixture.R; parameters are
// recovered from simulated catalogs; compensator, ancestry and branching ratio are
// checked against closed forms and the simulator's own bookkeeping.
//
// Units: days, magnitudes. Events are parallel arrays t[], m[] sorted by t.
// Works in the browser (window.Aftershock) and in node (module.exports).
// No fetch: the page loads the data and passes it in.
(function (root) {
  "use strict";
  const LN10 = Math.LN10;
  // ---- optimizer ----
  // Nelder-Mead with restarts; returns {x, f}. step is the initial simplex edge per axis.
  function nelderMead(f, x0, step, iters, opts) {
    opts = opts || {};
    const n = x0.length, tol = opts.tol == null ? 0 : opts.tol;
    let best = null;
    let start = x0.slice(), stepNow = step.slice();
    const rounds = opts.restarts == null ? 1 : opts.restarts;
    for (let round = 0; round < rounds; round++) {
      let S = [start.slice()];
      for (let i = 0; i < n; i++) { const x = start.slice(); x[i] += stepNow[i]; S.push(x); }
      let F = S.map(f);
      for (let it = 0; it < iters; it++) {
        const o = F.map((v, i) => i).sort((a, b) => F[a] - F[b]);
        S = o.map(i => S[i]); F = o.map(i => F[i]);
        if (tol && Math.abs(F[n] - F[0]) < tol * (1 + Math.abs(F[0]))) break;
        const cen = x0.map((_, j) => { let s = 0; for (let i = 0; i < n; i++) s += S[i][j]; return s / n; });
        const at = a => cen.map((c, j) => c + a * (S[n][j] - c));
        const r = at(-1), fr = f(r);
        if (fr < F[0]) {
          const e = at(-2), fe = f(e);
          if (fe < fr) { S[n] = e; F[n] = fe; } else { S[n] = r; F[n] = fr; }
        } else if (fr < F[n - 1]) { S[n] = r; F[n] = fr; }
        else {
          const k = at(0.5), fk = f(k);
          if (fk < F[n]) { S[n] = k; F[n] = fk; }
          else for (let i = 1; i <= n; i++) { S[i] = S[i].map((v, j) => S[0][j] + 0.5 * (v - S[0][j])); F[i] = f(S[i]); }
        }
      }
      let b = 0; for (let i = 1; i <= n; i++) if (F[i] < F[b]) b = i;
      if (!best || F[b] < best.f - 1e-12) { best = { x: S[b].slice(), f: F[b] }; start = S[b].slice(); stepNow = stepNow.map(s => s * 0.4); }
      else break;
    }
    return best;
  }

  // ---- Omori-Utsu ----
  // integral of (u + c)^-p du from a to b
  function omoriIntegral(a, b, c, p) {
    if (Math.abs(p - 1) < 1e-9) return Math.log((b + c) / (a + c));
    return (Math.pow(b + c, 1 - p) - Math.pow(a + c, 1 - p)) / (1 - p);
  }
  // Negative log-likelihood of rate mu + K (t + c)^-p for events ts in [t0, T], x = (ln K, ln c, p)
  function omoriNll(ts, T, mu, x, t0) {
    t0 = t0 || 0;
    const K = Math.exp(x[0]), c = Math.exp(x[1]), p = x[2];
    let ll = -mu * (T - t0) - K * omoriIntegral(t0, T, c, p);
    for (const t of ts) ll += Math.log(mu + K * Math.pow(t + c, -p));
    return -ll;
  }
  // Fit K, c, p. ts: event times in days since the mainshock within [t0, T].
  function omoriFit(ts, T, mu, t0) {
    t0 = t0 || 0;
    const f = x => omoriNll(ts, T, mu, x, t0);
    let r = nelderMead(f, [Math.log(300), Math.log(0.3), 1], [1, 1, 0.2], 400);
    r = nelderMead(f, r.x, [0.3, 0.3, 0.05], 300);
    return { K: Math.exp(r.x[0]), c: Math.exp(r.x[1]), p: r.x[2], nll: r.f, mu, t0, T,
      // days until the aftershock term K (t + c)^-p falls to mu
      tCross: mu > 0 ? Math.pow(Math.exp(r.x[0]) / mu, 1 / r.x[2]) - Math.exp(r.x[1]) : Infinity };
  }

  // ---- ETAS ----
  // par = {mu, K, c, alpha, p}; o = {Mz, tStart, tEnd, gaps: [[a, b], ...]}
  function segments(o) {
    const gaps = (o.gaps || []).map(g => [Math.max(g[0], o.tStart), Math.min(g[1], o.tEnd)]).filter(g => g[1] > g[0]).sort((a, b) => a[0] - b[0]);
    const seg = []; let cur = o.tStart;
    for (const g of gaps) { if (g[0] > cur) seg.push([cur, g[0]]); cur = Math.max(cur, g[1]); }
    if (o.tEnd > cur) seg.push([cur, o.tEnd]);
    return seg;
  }
  const inGap = (t, o) => { for (const g of (o.gaps || [])) if (t >= g[0] && t < g[1]) return true; return false; };

  // Intensity at time t from events strictly before t (arrays t, m)
  function etasIntensity(time, t, m, par, Mz) {
    let s = par.mu;
    for (let j = 0; j < t.length && t[j] < time; j++) s += par.K * Math.exp(par.alpha * (m[j] - Mz)) * Math.pow(time - t[j] + par.c, -par.p);
    return s;
  }
  // Compensator contribution Lambda(a, b) of all events (or only event `only`), a < b
  function etasCompensatorBetween(t, m, par, Mz, a, b, only) {
    let s = par.mu * (b - a);
    if (only != null) s = 0;
    const lo = only != null ? only : 0, hi = only != null ? only + 1 : t.length;
    for (let j = lo; j < hi; j++) {
      if (t[j] >= b) break;
      s += par.K * Math.exp(par.alpha * (m[j] - Mz)) * omoriIntegral(Math.max(a, t[j]) - t[j], b - t[j], par.c, par.p);
    }
    return s;
  }
  function etasNll(t, m, par, o) {
    if (!(par.mu >= 0 && par.K > 0 && par.c > 0 && par.p > 0 && par.alpha >= 0)) return 1e30;
    const n = t.length, Mz = o.Mz;
    const w = new Float64Array(n);
    for (let j = 0; j < n; j++) w[j] = par.K * Math.exp(par.alpha * (m[j] - Mz));
    let ll = 0;
    const c = par.c, np = -par.p;
    for (let i = 0; i < n; i++) {
      const ti = t[i];
      if (ti < o.tStart || ti > o.tEnd || inGap(ti, o)) continue;
      let lam = par.mu;
      for (let j = 0; j < i; j++) lam += w[j] * Math.pow(ti - t[j] + c, np);
      if (!(lam > 0)) return 1e30;
      ll += Math.log(lam);
    }
    let comp = 0;
    for (const [a, b] of segments(o)) {
      comp += par.mu * (b - a);
      for (let j = 0; j < n; j++) {
        if (t[j] >= b) break;
        comp += w[j] * omoriIntegral(Math.max(a, t[j]) - t[j], b - t[j], c, par.p);
      }
    }
    return -(ll - comp);
  }
  const unpack = x => ({ mu: Math.exp(x[0]), K: Math.exp(x[1]), c: Math.exp(x[2]), alpha: x[3], p: x[4] });
  const pack = par => [Math.log(Math.max(par.mu, 1e-300)), Math.log(par.K), Math.log(par.c), par.alpha, par.p];

  // Maximum-likelihood fit from a starting parameter set; x = (ln mu, ln K, ln c, alpha, p)
  function etasFit(t, m, o, start, opts) {
    opts = opts || {};
    const f = x => {
      if (x[0] < -40 || x[2] < -12 || x[2] > 4 || x[3] < 0 || x[3] > 6 || x[4] < 0.2 || x[4] > 3) return 1e30;
      return etasNll(t, m, unpack(x), o);
    };
    const r = nelderMead(f, pack(start), [0.3, 0.3, 0.3, 0.2, 0.05], opts.iters || 600, { tol: opts.tol == null ? 1e-11 : opts.tol, restarts: opts.restarts || 6 });
    return { par: unpack(r.x), x: r.x, nll: r.f };
  }
  // Standard errors of x (ln mu, ln K, ln c, alpha, p) from a central-difference Hessian
  function etasStdErr(t, m, o, x) {
    const n = 5, f = y => etasNll(t, m, unpack(y), o);
    const h = x.map((v, i) => (i === 0 || i === 1 || i === 2 ? 2e-3 : 1e-3));
    const f0 = f(x), H = Array.from({ length: n }, () => new Array(n).fill(0));
    const add = (i, di, j, dj) => { const y = x.slice(); y[i] += di; y[j] += dj; return f(y); };
    for (let i = 0; i < n; i++) {
      H[i][i] = (add(i, h[i], i, 0) - 2 * f0 + add(i, -h[i], i, 0)) / (h[i] * h[i]);
      for (let j = i + 1; j < n; j++) {
        H[i][j] = H[j][i] = (add(i, h[i], j, h[j]) - add(i, h[i], j, -h[j]) - add(i, -h[i], j, h[j]) + add(i, -h[i], j, -h[j])) / (4 * h[i] * h[j]);
      }
    }
    const inv = invert(H);
    return inv ? inv.map((r, i) => (r[i] > 0 ? Math.sqrt(r[i]) : NaN)) : x.map(() => NaN);
  }
  function invert(A) {
    const n = A.length, M = A.map((r, i) => r.concat(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))));
    for (let i = 0; i < n; i++) {
      let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
      if (Math.abs(M[p][i]) < 1e-14) return null;
      [M[i], M[p]] = [M[p], M[i]];
      const d = M[i][i]; for (let j = 0; j < 2 * n; j++) M[i][j] /= d;
      for (let r = 0; r < n; r++) if (r !== i) { const f = M[r][i]; if (f) for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[i][j]; }
    }
    return M.map(r => r.slice(n));
  }

  // Expected counts in bins [edges[k], edges[k+1]) given the catalog's own history.
  // opts.only: count only the offspring of event index `only` (plus nothing else);
  // opts.noBackground drops mu. Returns an array of expected counts per bin.
  function etasExpected(t, m, par, Mz, edges, opts) {
    opts = opts || {};
    const out = [];
    for (let k = 0; k + 1 < edges.length; k++) {
      const a = edges[k], b = edges[k + 1];
      let s = etasCompensatorBetween(t, m, par, Mz, a, b, opts.only);
      if (opts.only == null && opts.noBackground) s -= par.mu * (b - a);
      out.push(s);
    }
    return out;
  }
  // Compensator at each target event (Ogata 1988 transformed time) and its total on the segments
  function residualTimes(t, m, par, o) {
    const segs = segments(o), n = t.length, w = new Float64Array(n);
    for (let j = 0; j < n; j++) w[j] = par.K * Math.exp(par.alpha * (m[j] - o.Mz));
    const L = (time) => { // integral of lambda over the segments up to `time`
      let s = 0;
      for (const [a, b0] of segs) {
        const b = Math.min(b0, time); if (b <= a) continue;
        s += par.mu * (b - a);
        for (let j = 0; j < n; j++) { if (t[j] >= b) break; s += w[j] * omoriIntegral(Math.max(a, t[j]) - t[j], b - t[j], par.c, par.p); }
      }
      return s;
    };
    const total = L(o.tEnd), tau = [];
    for (let i = 0; i < n; i++) if (t[i] >= o.tStart && t[i] <= o.tEnd && !inGap(t[i], o)) tau.push(L(t[i]));
    return { tau, total };
  }
  // Kolmogorov-Smirnov distance of values in [0, 1] from uniform
  function ksUniform(u) {
    const v = u.slice().sort((a, b) => a - b), n = v.length; let d = 0;
    for (let i = 0; i < n; i++) d = Math.max(d, Math.abs(v[i] - i / n), Math.abs(v[i] - (i + 1) / n));
    return { D: d, n, crit95: 1.358 / Math.sqrt(n) };
  }

  // Probability that each event is background, and share descended from event `root`
  // (Zhuang, Ogata & Vere-Jones 2002). Arrays are over all events; entries before the
  // root are 0 in `anc`. root < 0 skips ancestry.
  function declustering(t, m, par, Mz, root) {
    const n = t.length, bg = new Float64Array(n), anc = new Float64Array(n), w = new Float64Array(n);
    for (let j = 0; j < n; j++) w[j] = par.K * Math.exp(par.alpha * (m[j] - Mz));
    const rho = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let trig = 0;
      for (let j = 0; j < i; j++) { const v = w[j] * Math.pow(t[i] - t[j] + par.c, -par.p); rho[j] = v; trig += v; }
      const lam = par.mu + trig;
      bg[i] = par.mu / lam;
      if (root >= 0 && i > root) {
        let a = rho[root];
        for (let j = root + 1; j < i; j++) a += rho[j] * anc[j];
        anc[i] = a / lam;
      }
    }
    return { bg, anc };
  }

  // Mean offspring per event over truncated Gutenberg-Richter magnitudes [Mz, Mmax];
  // T = Infinity gives Infinity when p <= 1.
  function branchingRatio(par, b, Mz, Mmax, T) {
    const beta = b * LN10, dM = Mmax - Mz;
    const Eexp = Math.abs(beta - par.alpha) < 1e-9 ? beta * dM / (1 - Math.exp(-beta * dM))
      : beta * (1 - Math.exp(-(beta - par.alpha) * dM)) / ((beta - par.alpha) * (1 - Math.exp(-beta * dM)));
    const inf = T === Infinity || T == null;
    if (inf && par.p <= 1) return Infinity; // the Omori tail never ends
    const Om = inf ? Math.pow(par.c, 1 - par.p) / (par.p - 1) : omoriIntegral(0, T, par.c, par.p);
    return par.K * Om * Eexp;
  }

  // ---- simulation ----
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gaussian(r) { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }
  // Poisson by inversion for small means, PTRS (Hoermann 1993) for large
  function poisson(r, lam) {
    if (lam <= 0) return 0;
    if (lam < 30) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= r(); } while (p > L); return k - 1; }
    const b = 0.931 + 2.53 * Math.sqrt(lam), a = -0.059 + 0.02483 * b, ia = 1.1239 + 1.1328 / (b - 3.4), vr = 0.9277 - 3.6224 / (b - 2);
    const lgam = x => { // Stirling series, x >= 1
      return (x - 0.5) * Math.log(x) - x + 0.9189385332046727 + 1 / (12 * x) - 1 / (360 * x * x * x);
    };
    for (;;) {
      const U = r() - 0.5, V = r(), us = 0.5 - Math.abs(U);
      const k = Math.floor((2 * a / us + b) * U + lam + 0.43);
      if (us >= 0.07 && V <= vr) return k;
      if (k < 0 || (us < 0.013 && V > us)) continue;
      if (Math.log(V) + Math.log(ia) - Math.log(a / (us * us) + b) <= -lam + k * Math.log(lam) - lgam(k + 1)) return k;
    }
  }
  function grMagnitude(r, b, Mz, Mmax) {
    const beta = b * LN10;
    return Mz - Math.log(1 - r() * (1 - Math.exp(-beta * (Mmax - Mz)))) / beta;
  }
  // Branching simulation of ETAS on [0, T]. opts.seeds: [{t, m}] extra events with
  // their offspring (no background is implied by them); opts.noBackground.
  // Returns {t, m, parent, bgIdx} sorted by time; parent is the sorted index or -1.
  function etasSimulate(par, b, Mz, Mmax, T, seed, opts) {
    opts = opts || {};
    const r = rng(seed), ev = [];
    const nb = opts.noBackground ? 0 : poisson(r, par.mu * T);
    for (let i = 0; i < nb; i++) ev.push({ t: r() * T, m: grMagnitude(r, b, Mz, Mmax), parent: -1 });
    for (const s of (opts.seeds || [])) ev.push({ t: s.t, m: s.m, parent: -1, seed: true });
    const c = par.c, p = par.p;
    for (let k = 0; k < ev.length; k++) {
      const e = ev[k], Tt = T - e.t;
      if (Tt <= 0) continue;
      const Om = omoriIntegral(0, Tt, c, p);
      const nOff = poisson(r, par.K * Math.exp(par.alpha * (e.m - Mz)) * Om);
      for (let i = 0; i < nOff; i++) {
        const q = r();
        let u;
        if (Math.abs(p - 1) < 1e-9) u = c * Math.pow((Tt + c) / c, q) - c;
        else { const g = 1 - p, c0 = Math.pow(c, g); u = Math.pow(c0 + q * (Math.pow(Tt + c, g) - c0), 1 / g) - c; }
        ev.push({ t: e.t + u, m: grMagnitude(r, b, Mz, Mmax), parent: k });
      }
    }
    const order = ev.map((e, i) => i).sort((a, b2) => ev[a].t - ev[b2].t);
    const rank = new Array(ev.length); order.forEach((oi, ni) => { rank[oi] = ni; });
    const sorted = order.map(oi => ev[oi]);
    return { t: sorted.map(e => e.t), m: sorted.map(e => e.m),
      parent: sorted.map(e => (e.parent < 0 ? -1 : rank[e.parent])), seed: sorted.map(e => !!e.seed) };
  }

  // Bath's law by simulation: the difference between a mainshock and its largest
  // aftershock in the first `days`, over nSim seeded sequences with no background.
  function bathSimulate(par, b, Mz, Mmain, days, nSim, seed) {
    const d = [];
    for (let s = 0; s < nSim; s++) {
      const sim = etasSimulate(par, b, Mz, Mmain, days, seed + s, { noBackground: true, seeds: [{ t: 0, m: Mmain }] });
      let mx = -Infinity; for (let i = 0; i < sim.t.length; i++) if (!sim.seed[i] && sim.m[i] > mx) mx = sim.m[i];
      if (mx > -Infinity) d.push(Mmain - mx);
    }
    d.sort((a, c) => a - c);
    const q = f => d[Math.min(d.length - 1, Math.floor(f * d.length))];
    return { median: q(0.5), lo: q(0.16), hi: q(0.84), n: d.length, none: nSim - d.length };
  }
  // Median of the largest of Poisson(N) Gutenberg-Richter magnitudes above Mz (closed form)
  function largestMedian(N, b, Mz) { return Mz + Math.log10(N / Math.LN2) / b; }

  // ---- checks ----
  function runChecks(print, data) {
    const out = [];
    const check = (name, ok, detail) => out.push({ name, ok: !!ok, detail });
    if (!data || !data.sapp || !data.fits) {
      check("reference data supplied (03-etas-fit.json)", false, "runChecks(print, data) got no usable data object");
      return out;
    }
    const rel = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));

    // closed form against numeric quadrature (Simpson on a log grid)
    {
      let worst = 0;
      for (const [a, b, c, p] of [[0, 10, 0.03, 1.15], [0.5, 3650, 0.4, 0.96], [0, 100, 0.1, 1], [2, 5, 1, 2.5]]) {
        const N = 4000, lo = Math.log(a + c), hi = Math.log(b + c), h = (hi - lo) / N;
        let s = 0; for (let i = 0; i <= N; i++) { const y = lo + i * h, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2; s += w * Math.exp(y) * Math.pow(Math.exp(y), -p); }
        worst = Math.max(worst, rel(omoriIntegral(a, b, c, p), s * h / 3));
      }
      check("Omori integral matches numeric quadrature (incl. p = 1 and p < 1)", worst < 1e-8, "worst relative error " + worst.toExponential(1));
    }

    // SAPP reference
    const sapp = data && data.sapp;
    if (!sapp) check("SAPP reference data present", false, "03-etas-fit.json has no sapp block");
    else {
      let worstLL = 0, worstOm = 0, fitBetter = true, nAgree = 0, nTie = 0, notes = [];
      for (const cs of sapp.cases) {
        const idx = []; for (let i = 0; i < sapp.time.length; i++) if (sapp.mag[i] >= cs.threshold - 1e-9 && sapp.time[i] <= cs.tEnd) idx.push(i);
        const t = idx.map(i => sapp.time[i]), m = idx.map(i => sapp.mag[i]);
        const o = { Mz: cs.reference, tStart: cs.tStart, tEnd: cs.tEnd };
        const e = cs.etasap, par = { mu: e.mu, K: e.K, c: e.c, alpha: e.alpha, p: e.p };
        const nll = etasNll(t, m, par, o);
        worstLL = Math.max(worstLL, rel(nll, e.negLogLik));
        // Omori-Utsu (momori): events in [tStart, tEnd] only
        const ts = t.filter(x => x >= cs.tStart);
        const mo = cs.momori, nllO = omoriNll(ts, cs.tEnd, mo.B, [Math.log(mo.K), Math.log(mo.c), mo.p], cs.tStart);
        worstOm = Math.max(worstOm, rel(nllO, mo.negLogLik));
        // our own fit from SAPP's start must do at least as well, and agree where the surface is not flat
        const fit = etasFit(t, m, o, { mu: 0.1, K: 60, c: 0.04, alpha: 2.6, p: 1.02 });
        if (fit.nll > e.negLogLik + 1e-4) fitBetter = false;
        const dp = Math.abs(fit.par.p - e.p), dc = Math.abs(Math.log(fit.par.c / e.c));
        const tied = Math.abs(fit.nll - e.negLogLik) < 1e-3; // SAPP's quasi-Newton stops early on a flat surface in the third case
        if (tied) nTie++;
        notes.push(`thr ${cs.threshold}: p ${fit.par.p.toFixed(3)} vs ${e.p.toFixed(3)}, c ${fit.par.c.toFixed(4)} vs ${e.c.toFixed(4)}, nll ${fit.nll.toFixed(4)} vs ${e.negLogLik.toFixed(4)}`);
        if (tied && dp < 0.03 && dc < 0.15) nAgree++;
      }
      check("ETAS log-likelihood at SAPP's etasap optimum equals SAPP's (3 cases, relative 1e-8)", worstLL < 1e-8, "worst " + worstLL.toExponential(1));
      check("Omori-Utsu log-likelihood at SAPP's momori optimum equals SAPP's (3 cases, relative 1e-8)", worstOm < 1e-8, "worst " + worstOm.toExponential(1));
      check("our ETAS fit reaches SAPP's likelihood or better", fitBetter, notes.join("; "));
      check("where SAPP converged, our fit agrees with its p (within 0.03) and c (within 15%)", nTie >= 2 && nAgree === nTie, nAgree + " of " + nTie + " converged cases");
    }

    // simulation, recovery and the bookkeeping checks
    const truth = { mu: 0.3, K: 0.012, c: 0.0296, alpha: 1.658, p: 1.153 }, b = 0.857, Mz = 3, Mmax = 7;
    const n0 = branchingRatio(truth, b, Mz, Mmax, Infinity);
    {
      const r = rng(7); let s = 0; const N = 200000;
      for (let i = 0; i < N; i++) s += truth.K * Math.exp(truth.alpha * (grMagnitude(r, b, Mz, Mmax) - Mz)) * Math.pow(truth.c, 1 - truth.p) / (truth.p - 1);
      check("branching ratio matches a Monte Carlo of offspring counts", rel(n0, s / N) < 0.03, `${n0.toFixed(3)} vs ${(s / N).toFixed(3)}`);
    }
    {
      // simulated totals: mean count of one seeded mainshock's cascade vs closed form of generation sum
      const par = { mu: 0, K: 0.004, c: 0.0296, alpha: 1.2, p: 1.15 }, nr = branchingRatio(par, b, Mz, Mmax, Infinity);
      const M0 = 5; let tot = 0; const R = 5000, T = 1e15;
      for (let s = 0; s < R; s++) tot += etasSimulate(par, b, Mz, Mmax, T, 100 + s, { noBackground: true, seeds: [{ t: 0, m: M0 }] }).t.length - 1;
      const first = par.K * Math.exp(par.alpha * (M0 - Mz)) * Math.pow(par.c, 1 - par.p) / (par.p - 1);
      const expect = first / (1 - nr);
      check("simulated cascade size matches first-generation count / (1 - branching ratio)", rel(tot / R, expect) < 0.06, `${(tot / R).toFixed(2)} vs ${expect.toFixed(2)} (n = ${nr.toFixed(3)})`);
    }
    {
      const nTrial = 16, T = 900;
      let hit = 0, tot = 0, sumErr = [0, 0, 0, 0, 0], sumSe = [0, 0, 0, 0, 0], N = 0, kept = 0;
      const o = { Mz, tStart: 0, tEnd: T };
      for (let s = 0; s < nTrial; s++) {
        const sim = etasSimulate(truth, b, Mz, Mmax, T, 1000 + s);
        const keep = []; for (let i = 0; i < sim.t.length; i++) if (sim.t[i] <= T) keep.push(i);
        const t = keep.map(i => sim.t[i]), m = keep.map(i => sim.m[i]);
        N += t.length; kept++;
        const fit = etasFit(t, m, o, { mu: 0.2, K: 0.02, c: 0.05, alpha: 1.2, p: 1.05 }, { iters: 400, restarts: 3 });
        const se = etasStdErr(t, m, o, fit.x), tx = pack(truth);
        for (let k = 0; k < 5; k++) {
          const z = (fit.x[k] - tx[k]) / se[k];
          sumErr[k] += fit.x[k] - tx[k]; sumSe[k] += se[k];
          tot++; if (Math.abs(z) < 1.96) hit++;
        }
      }
      const cover = hit / tot;
      check("parameter recovery: 16 simulated catalogs, mean error of each estimate within 3 standard errors of the mean (SE / sqrt 16)",
        sumErr.every((s, k) => Math.abs(s / nTrial) < 3 * (sumSe[k] / nTrial) / Math.sqrt(nTrial)), "mean error (ln mu, ln K, ln c, alpha, p): " + sumErr.map(s => (s / nTrial).toFixed(2)).join(", ") + " vs mean SE " + sumSe.map(v => (v / nTrial).toFixed(2)).join(", ") + ", average N " + Math.round(N / kept));
      check("parameter recovery: 95% intervals cover the truth in at least 80% of fits", cover >= 0.8, (100 * cover).toFixed(0) + "% of " + tot);
    }
    {
      // compensator: transformed times of a simulated catalog are uniform; ancestry and background bookkeeping
      const T = 1500, sim = etasSimulate(truth, b, Mz, Mmax, T, 4242, { });
      const o = { Mz, tStart: 0, tEnd: T };
      const rt = residualTimes(sim.t, sim.m, truth, o);
      const ks = ksUniform(rt.tau.map(x => x / rt.total));
      check("compensator: transformed times of a simulated catalog pass the Kolmogorov-Smirnov test", ks.D < ks.crit95, `D ${ks.D.toFixed(3)} < ${ks.crit95.toFixed(3)} (n ${ks.n})`);
      // truth for ancestry: root = the largest event
      let root = 0; for (let i = 1; i < sim.m.length; i++) if (sim.m[i] > sim.m[root]) root = i;
      const isDesc = new Array(sim.t.length).fill(false);
      for (let i = 0; i < sim.t.length; i++) { const pa = sim.parent[i]; if (i > root && pa >= 0 && (pa === root || isDesc[pa])) isDesc[i] = true; }
      const d = declustering(sim.t, sim.m, truth, Mz, root);
      let a = 0, tr = 0, cnt = 0, bgTrue = 0;
      for (let i = root + 1; i < sim.t.length; i++) { a += d.anc[i]; tr += isDesc[i] ? 1 : 0; cnt++; }
      for (let i = 0; i < sim.t.length; i++) bgTrue += sim.parent[i] < 0 ? 1 : 0;
      const bgEst = d.bg.reduce((s, v) => s + v, 0);
      check("ancestry: expected number of descendants of the largest event is within 20% of the simulator's", rel(a, tr) < 0.2 || Math.abs(a - tr) < 6, `${a.toFixed(1)} vs ${tr} of ${cnt} later events`);
      check("background probability: the expected number of background events is within 8% of the simulator's", rel(bgEst, bgTrue) < 0.08, `${bgEst.toFixed(0)} vs ${bgTrue} of ${sim.t.length}`);
      // expected counts add up to the compensator
      const edges = [0, 1, 10, 100, T], ex = etasExpected(sim.t, sim.m, truth, Mz, edges);
      check("expected counts per bin sum to the total compensator", rel(ex.reduce((s, v) => s + v, 0), rt.total) < 1e-9, ex.reduce((s, v) => s + v, 0).toFixed(2) + " vs " + rt.total.toFixed(2));
    }
    {
      // Bath: the simulator's largest aftershock against the Poisson extreme-value closed form
      // (alpha 2.2 against beta 2.3 keeps cascades weak; the closed form ignores them, so a loose band)
      const Mmain = 8, Mb = 4, al = 2.2, c0 = 0.03, p0 = 1.2, N1 = 300;
      const Om = omoriIntegral(0, 1e9, c0, p0);
      const par = { mu: 0, K: N1 / (Math.exp(al * (Mmain - Mb)) * Om), c: c0, alpha: al, p: p0 };
      const nr = branchingRatio(par, 1, Mb, Mmain, 1e9);
      const sim = bathSimulate(par, 1, Mb, Mmain, 1e9, 300, 9000);
      const pred = Mmain - largestMedian(N1 / (1 - nr), 1, Mb);
      check("Bath: the simulated median gap is within 0.3 of the extreme-value closed form (cascades ignored by the closed form)", Math.abs(sim.median - pred) < 0.3, `simulated ${sim.median.toFixed(2)} vs ${pred.toFixed(2)} (${(N1 / (1 - nr)).toFixed(0)} aftershocks, n = ${nr.toFixed(2)})`);
      // an Omori-productivity sequence of a great shock lands in Bath's band 0.8-1.6
      const g = data && data.fits && data.fits["5.0"], gp = g ? g.par : { mu: 0.04, K: 0.0135, c: 0.027, alpha: 1.95, p: 1.1 };
      const bs = bathSimulate(Object.assign({}, gp, { mu: 0 }), g ? g.b : 1.0, 5, 9.1, 365, 120, 500);
      check("Bath: the fitted model's median gap for an M9.1 is between 0.5 and 1.8 (law: about 1.2; sanity band, not a tight match)", bs.median > 0.5 && bs.median < 1.8, `median ${bs.median.toFixed(2)}, 16-84% ${bs.lo.toFixed(2)} to ${bs.hi.toFixed(2)}`);
    }
    if (print && typeof console !== "undefined") out.forEach(r => console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.detail ? "  (" + r.detail + ")" : "")));
    return out;
  }

  const api = { nelderMead, omoriIntegral, omoriNll, omoriFit,
    etasIntensity, etasNll, etasFit, etasStdErr, etasExpected, residualTimes, ksUniform, declustering,
    branchingRatio, etasSimulate, bathSimulate, largestMedian, segments, pack, unpack, rng, runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Aftershock = api;
})(typeof window !== "undefined" ? window : globalThis);
