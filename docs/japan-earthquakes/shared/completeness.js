// Magnitude of completeness for the japan-earthquakes series.
//
// Why this exists. The USGS catalog for Japan records M4.5-4.9 events more
// completely after about 2010 than before: about 2.5 small events per M5+ event
// in 2000-2009 and about 4.5 from 2011 on, while the yearly count of M5+ events
// stays flat near 100. Counts at M4.5 therefore change with the catalog, not with
// the Earth, and any rate or b-value that mixes the two periods is biased. Right
// after a large shock the catalog also loses small events in the coda of the big
// ones (Kagan 2004; Helmstetter, Kagan & Jackson 2006), a second, shorter gap.
// This file measures both, so an essay can move its fits to a cutoff that is
// complete everywhere and say why once. It knows nothing about any page.
//
// Works in the browser (window.Completeness) and in node (module.exports).
// No data file; runChecks() uses synthetic catalogs with known completeness.
//
// API (events are {time: ms since epoch (UTC), mag}; magnitudes are binned at
// 0.1, as in the USGS catalog; "days" are days of catalog time):
//
//   mcAfterShock(Mmain, tDays)      Mc at tDays after a shock of magnitude Mmain:
//                                   Mmain - 4.5 - 0.75 log10(t) (Helmstetter et al.
//                                   2006, BSSA 96:90-106). 6.1 at 0.01 d and 5.35
//                                   at 0.1 d for M9.1.
//   tCompleteAfter(Mmain, Mz)       days until Mc(t) falls to Mz (inverse of the
//                                   above; 0 if it is already at or below Mz).
//   bValue(mags, mMin, dm)          Aki-Utsu maximum-likelihood b with the bin
//                                   correction: {b, n, se} for mags >= mMin.
//   mcMaxCurvature(mags, dm)        Wiemer & Wyss (2000) MAXC estimate: the most
//                                   populated magnitude bin plus 0.2 (the usual
//                                   correction of Woessner & Wiemer 2005).
//   ratioCompleteness(mags, opts)   Compares counts N(>=m) for m from opts.mLow
//                                   (4.5) up to opts.mRef (5.0) with the
//                                   Gutenberg-Richter extrapolation of the
//                                   M >= mRef counts, using b fitted at M >= mRef
//                                   (or opts.b). Returns {b, nRef, small, ratio,
//                                   rows: [{m, obs, exp, frac}], mc}. mc is the
//                                   lowest m such that every bin from m to mRef
//                                   has obs >= (1 - opts.tol) * exp (tol 0.15).
//                                   small is the count in [mLow, mRef) and ratio is
//                                   small / nRef (the "small per large" figure).
//   mcByPeriod(events, periods, opts)  ratioCompleteness for each [fromMs, toMs):
//                                   an array of results with from, to, and the
//                                   MAXC estimate as mcMaxc.
//   eraContrast(events, eraA, eraB, opts)
//                                   The test the post-2010 step needs. For each m
//                                   from opts.mLow (4.5) to opts.mRef (5.0), the
//                                   count N(>=m) per N(>=mRef) in era A and era B
//                                   (eras are [fromMs, toMs)), their relative
//                                   change rel, and z = ln(rel) / sd with a
//                                   Poisson delta-method sd (clustering makes the
//                                   true sd larger, so z is an upper bound). Also
//                                   the yearly rate at mRef in both eras with its
//                                   z, to show the reference level is itself flat.
//                                   cutoff is the lowest m such that every m' >= m
//                                   has |z| < opts.zMax (3): fit at or above it and
//                                   the two eras count the same thing. Unlike the
//                                   ratio test against Gutenberg-Richter, it flags
//                                   a change in b between eras, which is what the
//                                   Japan catalog shows (b 0.94 before 2010,
//                                   1.1 after, same M5+ rate).
//   mcAfterShockWindows(events, shock, windows, opts)
//                                   The same ratio test in windows [a, b) days after
//                                   shock {time, mag}; opts.mRef should lie above
//                                   the Helmstetter Mc of the window, and b should
//                                   come from complete data (opts.b), since a short
//                                   window has too few large events to fix it. Returns the
//                                   ratioCompleteness result per window plus
//                                   mcModel, the Helmstetter value at the window's
//                                   geometric mid time.
//   cutoff(results, step)           The homogeneous magnitude cutoff: the largest
//                                   mc over a list of period results, rounded up
//                                   to step (0.1). Fit above this everywhere.
//   keepComplete(events, opts)      Events at or above opts.mMin, with, for every
//                                   shock in opts.shocks ([{time, mag}]), those
//                                   falling below its Helmstetter Mc(t) removed
//                                   (opts.days after it, default 30). Returns the
//                                   kept events.
//   runChecks(print)                [{name, ok, detail}] on synthetic catalogs.
(function (root) {
  "use strict";
  const DAY = 86400000;
  const EPS = 1e-9;

  function mcAfterShock(Mmain, tDays) { return Mmain - 4.5 - 0.75 * Math.log10(tDays); }
  function tCompleteAfter(Mmain, Mz) { return Math.max(0, Math.pow(10, (Mmain - 4.5 - Mz) / 0.75)); }

  // Aki (1965) / Utsu (1966) with the bin-width correction (Marzocchi & Sandri 2003).
  function bValue(mags, mMin, dm) {
    dm = dm || 0.1;
    let s = 0, n = 0;
    for (const m of mags) if (m >= mMin - EPS) { s += m; n++; }
    if (n < 2) return { b: NaN, n, se: NaN };
    const b = Math.log10(Math.E) / (s / n - (mMin - dm / 2));
    return { b, n, se: b / Math.sqrt(n) };
  }

  function mcMaxCurvature(mags, dm) {
    dm = dm || 0.1;
    const h = new Map();
    for (const m of mags) { const k = Math.round(m / dm); h.set(k, (h.get(k) || 0) + 1); }
    let bk = null, bn = -1;
    for (const [k, n] of h) if (n > bn || (n === bn && k < bk)) { bk = k; bn = n; }
    return bk === null ? NaN : Math.round((bk * dm + 0.2) * 100) / 100;
  }

  function ratioCompleteness(mags, opts) {
    opts = opts || {};
    const mRef = opts.mRef == null ? 5.0 : opts.mRef, mLow = opts.mLow == null ? 4.5 : opts.mLow;
    const dm = opts.dm || 0.1, tol = opts.tol == null ? 0.15 : opts.tol;
    const bv = bValue(mags, mRef, dm);
    const b = opts.b != null ? opts.b : bv.b;
    const nRef = bv.n;
    let small = 0;
    for (const m of mags) if (m >= mLow - EPS && m < mRef - EPS) small++;
    const rows = [];
    const steps = Math.round((mRef - mLow) / dm);
    for (let i = 0; i <= steps; i++) {
      const m = Math.round((mLow + i * dm) * 100) / 100;
      let obs = 0;
      for (const x of mags) if (x >= m - EPS) obs++;
      const exp = nRef * Math.pow(10, b * (mRef - m));
      rows.push({ m, obs, exp, frac: exp > 0 ? obs / exp : NaN });
    }
    // Lowest m such that all bins from m up to mRef pass
    let mc = mRef;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].obs >= (1 - tol) * rows[i].exp) mc = rows[i].m; else break;
    }
    return { b, bSe: bv.se, nRef, small, ratio: nRef ? small / nRef : NaN, rows, mc };
  }

  function mcByPeriod(events, periods, opts) {
    return periods.map(([from, to]) => {
      const mags = [];
      for (const e of events) if (e.time >= from && e.time < to) mags.push(e.mag);
      const r = ratioCompleteness(mags, opts);
      r.from = from; r.to = to; r.n = mags.length;
      r.mcMaxc = mcMaxCurvature(mags);
      return r;
    });
  }

  function eraContrast(events, eraA, eraB, opts) {
    opts = opts || {};
    const mRef = opts.mRef == null ? 5.0 : opts.mRef, mLow = opts.mLow == null ? 4.5 : opts.mLow;
    const dm = opts.dm || 0.1, zMax = opts.zMax == null ? 3 : opts.zMax;
    const pick = e => events.filter(x => x.time >= e[0] && x.time < e[1]).map(x => x.mag);
    const A = pick(eraA), B = pick(eraB);
    const yrs = e => (e[1] - e[0]) / (365.25 * DAY);
    const count = (a, m) => { let n = 0; for (const x of a) if (x >= m - EPS) n++; return n; };
    const aRef = count(A, mRef), bRef = count(B, mRef);
    const rows = [];
    const steps = Math.round((mRef - mLow) / dm);
    for (let i = 0; i <= steps; i++) {
      const m = Math.round((mLow + i * dm) * 100) / 100;
      const a = count(A, m), b = count(B, m);
      const ra = a / aRef, rb = b / bRef;
      let z = 0;
      if (i < steps) {
        // var ln(N(>=m)/N(>=mRef)) = s / (a * ref), s = a - ref (Poisson, delta method)
        const v = (a - aRef) / (a * aRef) + (b - bRef) / (b * bRef);
        z = Math.log(rb / ra) / Math.sqrt(v);
      }
      rows.push({ m, nA: a, nB: b, ratioA: ra, ratioB: rb, rel: rb / ra, z });
    }
    let cut = mRef;
    for (let i = rows.length - 1; i >= 0; i--) { if (Math.abs(rows[i].z) < zMax) cut = rows[i].m; else break; }
    const rateA = aRef / yrs(eraA), rateB = bRef / yrs(eraB);
    const refZ = Math.log(rateB / rateA) / Math.sqrt(1 / aRef + 1 / bRef);
    return { rows, cutoff: cut, ref: { rateA, rateB, rel: rateB / rateA, z: refZ },
      bA: bValue(A, mRef).b, bB: bValue(B, mRef).b };
  }

  function mcAfterShockWindows(events, shock, windows, opts) {
    return windows.map(([a, b]) => {
      const mags = [];
      for (const e of events) {
        const t = (e.time - shock.time) / DAY;
        if (t >= a && t < b) mags.push(e.mag);
      }
      const r = ratioCompleteness(mags, opts);
      r.a = a; r.b = b; r.n = mags.length;
      r.mcModel = mcAfterShock(shock.mag, Math.sqrt(a * b));
      return r;
    });
  }

  function cutoff(results, step) {
    step = step || 0.1;
    let m = -Infinity;
    for (const r of results) if (r.mc > m) m = r.mc;
    return Math.round(Math.ceil(m / step - 1e-6) * step * 100) / 100;
  }

  function keepComplete(events, opts) {
    const shocks = opts.shocks || [], days = opts.days == null ? 30 : opts.days;
    return events.filter(e => {
      if (e.mag < opts.mMin - EPS) return false;
      for (const s of shocks) {
        const t = (e.time - s.time) / DAY;
        if (t > 0 && t < days && e !== s && e.mag < mcAfterShock(s.mag, t) - EPS) return false;
      }
      return true;
    });
  }

  // ---- checks on synthetic catalogs ----
  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const erf = x => { // Abramowitz-Stegun 7.1.26
    const s = Math.sign(x); x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x));
  };
  const normCdf = (x, mu, sd) => 0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2)));
  // Binned (0.1) Gutenberg-Richter magnitudes at or above m0
  const grMag = (rnd, b, m0) => Math.round((m0 - 0.05 - Math.log10(1 - rnd()) / b) * 10) / 10;

  function runChecks(print) {
    const out = [];
    const check = (name, ok, detail) => out.push({ name, ok: !!ok, detail });
    const near = (a, b, tol) => Math.abs(a - b) <= tol;

    check("Helmstetter Mc(t) for M9.1 is 6.1 at 0.01 d, 5.35 at 0.1 d, 4.5 at 1.36 d",
      near(mcAfterShock(9.1, 0.01), 6.1, 1e-9) && near(mcAfterShock(9.1, 0.1), 5.35, 1e-9) && near(mcAfterShock(9.1, 1.36), 4.5, 0.01),
      [0.01, 0.1, 1.36].map(t => mcAfterShock(9.1, t).toFixed(2)).join(" / "));
    check("tCompleteAfter inverts mcAfterShock", near(mcAfterShock(9.1, tCompleteAfter(9.1, 5.0)), 5.0, 1e-9) && tCompleteAfter(6, 5.5) < 1e-4,
      tCompleteAfter(9.1, 5.0).toFixed(3) + " d to M5.0");

    // b-value: GR b = 1 above 4.5, 20,000 events; and with b = 0.8
    const rnd = mulberry32(11);
    const g1 = Array.from({ length: 20000 }, () => grMag(rnd, 1.0, 4.5));
    const bv = bValue(g1, 4.5);
    check("bValue recovers b = 1 within 3 standard errors", Math.abs(bv.b - 1) < 3 * bv.se, bv.b.toFixed(3) + " +- " + bv.se.toFixed(3));
    const g8 = Array.from({ length: 20000 }, () => grMag(rnd, 0.8, 4.0));
    const bv8 = bValue(g8, 4.5);
    check("bValue above a higher cutoff still recovers b = 0.8", Math.abs(bv8.b - 0.8) < 3 * bv8.se, bv8.b.toFixed(3) + " +- " + bv8.se.toFixed(3));

    // A catalog complete from 4.5, one complete only from 4.9, one with a smooth detection curve
    const make = (mcTrue, sd, n, seed) => {
      const r = mulberry32(seed), a = [];
      while (a.length < n) {
        const m = grMag(r, 1.0, 4.0);
        const p = sd > 0 ? normCdf(m, mcTrue, sd) : (m >= mcTrue - EPS ? 1 : 0);
        if (r() < p) a.push(m);
      }
      return a;
    };
    const full = ratioCompleteness(make(4.5, 0, 6000, 21)), cut = ratioCompleteness(make(4.9, 0, 6000, 22));
    check("ratio test: complete catalog gives mc 4.5, catalog complete from 4.9 gives mc 4.9",
      near(full.mc, 4.5, 0.05) && near(cut.mc, 4.9, 0.05), full.mc + " and " + cut.mc);
    const soft = ratioCompleteness(make(4.7, 0.15, 6000, 23));
    check("ratio test: a smooth detection curve (50% at 4.7, sd 0.15) gives mc between 4.7 and 5.0",
      soft.mc >= 4.7 - EPS && soft.mc <= 5.0 + EPS, String(soft.mc));
    const mx = mcMaxCurvature(make(4.9, 0, 6000, 22).concat(make(4.9, 0, 0, 1)));
    check("max curvature + 0.2 on a catalog complete from 4.9 lands within 0.2 of 4.9 (it is known to run low)",
      mx >= 4.9 - 0.2 - EPS && mx <= 4.9 + 0.3, String(mx));
    check("small-per-large ratio: 2.2 for a complete b = 1 catalog (10^0.5 - 1), well under that when incomplete",
      near(full.ratio, Math.pow(10, 0.5) - 1, 0.25) && cut.ratio < 0.5, full.ratio.toFixed(2) + " vs " + cut.ratio.toFixed(2));

    // Two eras, the step the page is about: 100 M5+ a year, small events thin before 2010
    const t0 = Date.UTC(2000, 0, 1), t1 = Date.UTC(2010, 0, 1), t2 = Date.UTC(2020, 0, 1);
    const r5 = mulberry32(31), ev = [];
    const era = (from, to, mcTrue) => {
      const nLarge = Math.round(100 * (to - from) / (365.25 * DAY));
      const target = nLarge * Math.pow(10, 0.5); // all events from 4.5 up, if complete
      let k = 0;
      while (k < target * 1.0) {
        const m = grMag(r5, 1.0, 4.5); k++;
        const keep = m >= mcTrue - EPS || (mcTrue > 4.5 && r5() < 0.3 * (m - 4.4) / (mcTrue - 4.4));
        if (keep) ev.push({ time: from + r5() * (to - from), mag: m });
      }
    };
    era(t0, t1, 4.9); era(t1, t2, 4.5);
    // The early era is built with a ramp (30% at the edge) so it is incomplete, not cut.
    const per = mcByPeriod(ev, [[t0, t1], [t1, t2]]);
    check("two-era catalog: early period has higher mc and a smaller small-per-large ratio than the later one",
      per[0].mc >= per[1].mc + 0.1 && per[0].ratio < per[1].ratio * 0.8,
      `mc ${per[0].mc} vs ${per[1].mc}; ratio ${per[0].ratio.toFixed(2)} vs ${per[1].ratio.toFixed(2)}`);
    check("the homogeneous cutoff over both periods is the higher one, and M5+ rates agree between the eras",
      cutoff(per) >= per[0].mc - EPS && Math.abs(per[0].nRef - per[1].nRef) < 0.35 * per[1].nRef,
      `cutoff ${cutoff(per)}; M5+ ${per[0].nRef} vs ${per[1].nRef}`);

    // Era contrast: A thin below 4.9, B complete from 4.5, same M5+ rate; and two equal eras
    const ec = eraContrast(ev, [t0, t1], [t1, t2]);
    check("eraContrast on the two-era catalog: cutoff 4.9 or 5.0 (the early era is gone below 4.9), M5+ rate flat",
      ec.cutoff >= 4.9 - EPS && ec.cutoff <= 5.0 + EPS && Math.abs(ec.ref.z) < 3,
      `cutoff ${ec.cutoff}; M5+ rate ${ec.ref.rateA.toFixed(0)} vs ${ec.ref.rateB.toFixed(0)} a year (z ${ec.ref.z.toFixed(1)})`);
    const evSame = [], rq = mulberry32(51);
    for (let i = 0; i < 9000; i++) evSame.push({ time: t0 + rq() * (t2 - t0), mag: grMag(rq, 1.0, 4.5) });
    const ecSame = eraContrast(evSame, [t0, t1], [t1, t2]);
    check("eraContrast on one stationary catalog split in two: cutoff 4.5, no row beyond |z| 3",
      ecSame.cutoff === 4.5 && ecSame.rows.every(r => Math.abs(r.z) < 3), "cutoff " + ecSame.cutoff + ", max |z| " + Math.max(...ecSame.rows.map(r => Math.abs(r.z))).toFixed(1));
    // b drifting between eras with no cut (the Japan pattern): flagged although the GR ratio test passes
    const evB = [], rb2 = mulberry32(52);
    for (let i = 0; i < 6000; i++) evB.push({ time: t0 + rb2() * (t1 - t0), mag: grMag(rb2, 0.9, 4.5) });
    for (let i = 0; i < 9000; i++) evB.push({ time: t1 + rb2() * (t2 - t1), mag: grMag(rb2, 1.15, 4.5) });
    const ecB = eraContrast(evB, [t0, t1], [t1, t2]);
    check("eraContrast flags a change of b between eras (0.9 vs 1.15) that the ratio test against Gutenberg-Richter passes",
      ecB.cutoff > 4.5 && mcByPeriod(evB, [[t0, t1]])[0].mc === 4.5, `cutoff ${ecB.cutoff}; b ${ecB.bA.toFixed(2)} vs ${ecB.bB.toFixed(2)}`);

    // After a shock: Omori-distributed events, magnitudes thinned by the Helmstetter Mc(t)
    const rs = mulberry32(41), after = [], shock = { time: 0, mag: 9.1 };
    for (let i = 0; i < 400000; i++) {
      const t = Math.pow(10, -2 + 4 * rs()); // days, log-uniform: rate ~ 1/t
      const m = grMag(rs, 1.0, 4.5);
      if (m >= mcAfterShock(9.1, t) - EPS) after.push({ time: t * DAY, mag: m });
    }
    const wins = mcAfterShockWindows(after, shock, [[0.01, 0.03], [0.1, 0.3], [1, 3]], { mLow: 5.0, mRef: 6.5, b: 1.0 });
    const wins2 = mcAfterShockWindows(after, shock, [[1, 3], [10, 30]], { mLow: 4.5, mRef: 5.0, dm: 0.1 });
    check("windows after an M9.1 follow the Helmstetter curve: early windows within 0.35 of it (6.5 reference, b fixed from complete data), late windows reach 4.5",
      wins.slice(0, 2).every(w => Math.abs(w.mc - w.mcModel) <= 0.35) && wins2[1].mc <= 4.5 + EPS,
      wins.map(w => `${w.mc} (model ${w.mcModel.toFixed(2)})`).join("; ") + "; late " + wins2.map(w => w.mc).join(", "));
    const kept = keepComplete(after.concat([{ time: 0, mag: 9.1 }]), { mMin: 5.0, shocks: [shock], days: 30 });
    const early = kept.filter(e => e.time > 0 && e.time < 0.1 * DAY).every(e => e.mag >= mcAfterShock(9.1, e.time / DAY) - EPS);
    check("keepComplete drops events below Mc(t) and below mMin, and keeps the mainshock", early && kept.some(e => e.mag === 9.1) && kept.every(e => e.mag >= 5.0 - EPS), kept.length + " kept of " + (after.length + 1));

    if (print && typeof console !== "undefined") out.forEach(r => console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.detail ? "  (" + r.detail + ")" : "")));
    return out;
  }

  const api = { mcAfterShock, tCompleteAfter, bValue, mcMaxCurvature, ratioCompleteness, mcByPeriod,
    eraContrast, mcAfterShockWindows, cutoff, keepComplete, runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Completeness = api;
})(typeof window !== "undefined" ? window : globalThis);
