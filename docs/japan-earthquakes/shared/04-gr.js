// The statistics behind japan-earthquakes essay 04 (Gutenberg-Richter): the b-value
// estimator, a b-stability completeness check, Gardner-Knopoff declustering, Poisson
// ranges, and the tapered Gutenberg-Richter law (Kagan 2002) with a profile likelihood
// for its corner magnitude. No data file and no fetch: runChecks() is self-contained.
//
// Works in the browser (window.GutenbergRichter) and in node (module.exports).
//
// Magnitudes are binned at 0.1 (the USGS catalog's rounding). Events are {t, lat, lon,
// mag} with t in ms since the epoch.
//
// API
//   bValue(mags, mc, dm)       Aki (1965) / Utsu (1966) maximum likelihood with the half-bin
//                              correction: {b, n, se, seSB}; se = b/sqrt(n), seSB the Shi &
//                              Bolt (1982) standard error. mags >= mc.
//   bValueExact(mags, mc, dm)  The exact discrete maximum-likelihood b (about 0.5% above
//                              the Utsu form at this catalog's b).
//   bStabilityMc(mags, opts)   Mc by b-stability (Cao & Gao 2002; Woessner & Wiemer 2005):
//                              the lowest tested Mc at which |mean b(Mc..Mc+0.4) - b(Mc)| is
//                              within one Shi-Bolt se (the seismostats convention). Returns
//                              {mc, rows: [{mc, b, bAvg, dB, diff, ok}]}. opts: from (4.5),
//                              to, range (0.5), dm (0.1), minN (30).
//   gkL(M), gkT(M)             Gardner-Knopoff (1974) windows in van Stiphout et al.'s (2012)
//                              form: km, and days.
//   declusterGK(events)        Sets .main on each event (a copy is sorted by time; the
//                              objects are the caller's). Largest events first; an event
//                              inside the window of a larger or equal one, before or after,
//                              is dropped; a dropped event drops no others.
//   poisQ(lam, p)              Smallest k with P(X <= k) >= p for Poisson(lam).
//   poisInterval(k, level)     Exact (Garwood) range of the mean given an observed count k.
//   prob30(rate)               1 - exp(-30 rate): chance of one or more in 30 years.
//   surv(m, p)                 Tapered survival N(>= m) / N(>= p.mt - 0.05) for p = {mt, b,
//                              corner}; corner = Infinity gives the plain law.
//   fitTapered(mags, mt, opts) Binned maximum likelihood for b at each corner of a grid
//                              (opts.from 8, to 10.5, step 0.05), the profile of the
//                              log-likelihood and its 95% range (drop 1.92). Returns {best:
//                              {corner, b, ll}, profile: [{corner, b, ll, drop}], lower,
//                              upper (null if the range reaches the grid's end), n}.
//   rateGE(n, years, m, p)     Per-year rate of M >= m from n events at M >= p.mt.
//   returnYears(rate)          1 / rate.
//   etasCatalog(seed, opts)    A seeded space-time ETAS catalog with known b (used by the checks
//                              and by the page to show what declustering does to b).
//   runChecks(print)           [{name, ok, detail}]
(function (root) {
  "use strict";
  const LOG10E = Math.LOG10E, EPS = 1e-9;

  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function bValue(mags, mc, dm) {
    dm = dm || 0.1;
    let s = 0, n = 0;
    for (const m of mags) if (m >= mc - EPS) { s += m; n++; }
    if (n < 2) return { b: NaN, n, se: NaN, seSB: NaN };
    const mean = s / n, b = LOG10E / (mean - (mc - dm / 2));
    let ss = 0;
    for (const m of mags) if (m >= mc - EPS) ss += (m - mean) * (m - mean);
    return { b, n, se: b / Math.sqrt(n), seSB: Math.LN10 * b * b * Math.sqrt(ss / (n * (n - 1))) };
  }

  // Exact discrete maximum likelihood (Tinti & Mulargia 1987), for the size of Utsu's approximation
  function bValueExact(mags, mc, dm) {
    dm = dm || 0.1;
    let s = 0, n = 0;
    for (const m of mags) if (m >= mc - EPS) { s += m - mc; n++; }
    return LOG10E * Math.log(1 + dm / (s / n)) / dm;
  }

  function bStabilityMc(mags, opts) {
    opts = opts || {};
    const dm = opts.dm || 0.1, range = opts.range || 0.5, minN = opts.minN || 30;
    const steps = Math.round(range / dm);
    let max = -Infinity;
    for (const m of mags) if (m > max) max = m;
    const rows = [];
    let mc = null;
    const from = opts.from == null ? 4.5 : opts.from;
    for (let k = Math.round(from / dm); k * dm + range <= max + EPS; k++) {
      const m0 = Math.round(k * dm * 100) / 100, f = bValue(mags, m0, dm);
      if (f.n < minN) break;
      let sum = 0;
      for (let j = 0; j < steps; j++) sum += bValue(mags, m0 + j * dm, dm).b;
      const bAvg = sum / steps, dB = Math.abs(bAvg - f.b), diff = dB / f.seSB;
      const ok = diff <= 1;
      rows.push({ mc: m0, b: f.b, bAvg, dB, diff, ok });
      if (ok && mc === null) { mc = m0; if (!opts.all) break; }
    }
    return { mc, rows };
  }

  const gkL = M => Math.pow(10, 0.1238 * M + 0.983);
  const gkT = M => M >= 6.5 ? Math.pow(10, 0.032 * M + 2.7389) : Math.pow(10, 0.5409 * M - 0.547);

  function declusterGK(qs) {
    const s = qs.slice().sort((a, b) => a.t - b.t);
    const n = s.length, ts = s.map(q => q.t), R = Math.PI / 180;
    const dist = (a, b) => {
      const dl = (b.lat - a.lat) * R, dn = (b.lon - a.lon) * R;
      const h = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * R) * Math.cos(b.lat * R) * Math.sin(dn / 2) ** 2;
      return 2 * 6371 * Math.asin(Math.sqrt(h));
    };
    const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => s[j].mag - s[i].mag || s[i].t - s[j].t);
    const removed = new Uint8Array(n);
    const lower = t => { let a = 0, b = n; while (a < b) { const m = (a + b) >> 1; if (ts[m] < t) a = m + 1; else b = m; } return a; };
    for (const i of order) {
      if (removed[i]) continue;
      const m = s[i], L = gkL(m.mag), T = gkT(m.mag) * 864e5;
      for (let j = lower(m.t - T); j < n && ts[j] <= m.t + T; j++) {
        if (j === i || removed[j] || s[j].mag > m.mag) continue;
        if (dist(m, s[j]) <= L) removed[j] = 1;
      }
    }
    s.forEach((q, i) => { q.main = !removed[i]; });
    return qs;
  }

  function poisQ(lam, p) {
    let k = 0, pk = Math.exp(-lam), c = pk;
    while (c < p && k < 100000) { k++; pk *= lam / k; c += pk; }
    return k;
  }
  function poisCdf(k, lam) { let pk = Math.exp(-lam), c = pk; for (let i = 1; i <= k; i++) { pk *= lam / i; c += pk; } return c; }
  function poisInterval(k, level) {
    const a = (1 - (level == null ? 0.95 : level)) / 2;
    const solve = (f) => { let lo = 0, hi = k + 10 + 10 * Math.sqrt(k + 1); for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (f(mid)) lo = mid; else hi = mid; } return (lo + hi) / 2; };
    // P(X <= k | lam) decreases in lam; the lower end has P(X <= k-1) = 1 - a, the upper P(X <= k) = a
    const lower = k === 0 ? 0 : solve(l => poisCdf(k - 1, l) > 1 - a);
    const upper = solve(l => poisCdf(k, l) > a);
    return [lower, upper];
  }
  const prob30 = rate => 1 - Math.exp(-30 * rate);

  // ---- tapered Gutenberg-Richter (Kagan 2002) --------------------------------
  const M0 = m => Math.pow(10, 1.5 * m + 9.1);
  // survival from the lower edge lo = mt - 0.05; beta = 2b/3
  function survEdge(e, lo, beta, corner) {
    const t = Math.pow(M0(lo) / M0(e), beta);
    return corner === Infinity ? t : t * Math.exp((M0(lo) - M0(e)) / M0(corner));
  }
  // N(>= m) over N(>= mt) for binned magnitudes (a bin's lower edge is m - 0.05)
  function surv(m, p) { return survEdge(m - 0.05, p.mt - 0.05, 2 * p.b / 3, p.corner); }

  function binCounts(mags, mt) {
    const k0 = Math.round(mt * 10), c = new Map();
    for (const m of mags) { const k = Math.round(m * 10); if (k >= k0) c.set(k, (c.get(k) || 0) + 1); }
    return Array.from(c.entries()).sort((a, b) => a[0] - b[0]);
  }
  function llBinned(bins, mt, b, corner) {
    const lo = mt - 0.05, beta = 2 * b / 3;
    let L = 0;
    for (const [k, c] of bins) {
      const m = k / 10, p = survEdge(m - 0.05, lo, beta, corner) - survEdge(m + 0.05, lo, beta, corner);
      L += c * Math.log(Math.max(p, 1e-300));
    }
    return L;
  }
  function bestB(bins, mt, corner) {
    let lo = 0.4, hi = 1.8; const g = (Math.sqrt(5) - 1) / 2;
    let x1 = hi - g * (hi - lo), x2 = lo + g * (hi - lo), f1 = llBinned(bins, mt, x1, corner), f2 = llBinned(bins, mt, x2, corner);
    for (let i = 0; i < 40; i++) {
      if (f1 < f2) { lo = x1; x1 = x2; f1 = f2; x2 = lo + g * (hi - lo); f2 = llBinned(bins, mt, x2, corner); }
      else { hi = x2; x2 = x1; f2 = f1; x1 = hi - g * (hi - lo); f1 = llBinned(bins, mt, x1, corner); }
    }
    const b = (lo + hi) / 2;
    return { b, ll: llBinned(bins, mt, b, corner) };
  }
  function fitTapered(mags, mt, opts) {
    opts = opts || {};
    const from = opts.from == null ? 8 : opts.from, to = opts.to == null ? 10.5 : opts.to, step = opts.step || 0.05;
    const bins = binCounts(mags, mt);
    let n = 0; for (const x of bins) n += x[1];
    const profile = [];
    for (let k = 0; from + k * step <= to + EPS; k++) {
      const corner = Math.round((from + k * step) * 100) / 100, r = bestB(bins, mt, corner);
      profile.push({ corner, b: r.b, ll: r.ll });
    }
    // the plain law is the limit of an infinite corner
    const plain = bestB(bins, mt, Infinity);
    let best = profile[0];
    for (const r of profile) if (r.ll > best.ll) best = r;
    if (plain.ll > best.ll) best = { corner: Infinity, b: plain.b, ll: plain.ll };
    profile.forEach(r => { r.drop = best.ll - r.ll; });
    const inside = profile.filter(r => r.drop <= 1.92);
    const lower = inside.length ? inside[0].corner : null;
    const last = profile[profile.length - 1];
    const upper = (best.corner === Infinity || last.drop <= 1.92) ? null : inside[inside.length - 1].corner;
    return { best, profile, lower, upper, n, plain };
  }
  function rateGE(n, years, m, p) { return n / years * surv(m, p); }
  const returnYears = rate => 1 / rate;

  // ---- synthetic catalogs for the checks -------------------------------------
  function grMags(rand, n, b, lo, dmRound) { // continuous exponential above lo, rounded to 0.1
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = Math.round((lo - Math.log(1 - rand()) / (b * Math.LN10)) * 10) / 10;
    return out;
  }
  function taperedMag(rand, p) { // inverse transform of the continuous survival from lo
    const lo = p.mt - 0.05, beta = 2 * p.b / 3, u = rand();
    let a = lo, z = 12;
    for (let i = 0; i < 50; i++) { const m = (a + z) / 2; if (survEdge(m, lo, beta, p.corner) > u) a = m; else z = m; }
    return (a + z) / 2;
  }
  function normCdf(x) { // Abramowitz-Stegun 7.1.26 via erf
    const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2);
    return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }
  function poisDraw(rand, lam) { let L = Math.exp(-lam), k = 0, p = 1; do { k++; p *= rand(); } while (p > L); return k - 1; }
  // Simple space-time ETAS with known b: background events, each producing Omori-timed,
  // Gaussian-offset children with a productivity that grows as 10^(alpha (m - m0)).
  function etasCatalog(seed, o) {
    const rand = rng(seed), m0 = o.m0, T = o.days, b = o.b, alpha = o.alpha, K = o.K, p = o.p, c = o.c;
    const q = [], mag = () => Math.min(o.mmax, Math.round((m0 - 0.05 - Math.log(1 - rand()) / (b * Math.LN10)) * 10) / 10);
    const queue = [];
    for (let i = 0; i < o.n0; i++) queue.push({ t: rand() * T, lat: 30 + rand() * 10, lon: 130 + rand() * 10, mag: mag() });
    while (queue.length) {
      const e = queue.pop();
      if (e.t > T) continue;
      q.push(e);
      const kids = poisDraw(rand, K * Math.pow(10, alpha * (e.mag - m0)));
      for (let i = 0; i < kids; i++) {
        // Omori: density ~ (t + c)^-p, sampled by inversion (p > 1)
        const dt = c * (Math.pow(1 - rand(), -1 / (p - 1)) - 1);
        const sd = 0.03 * Math.pow(10, 0.2 * (e.mag - m0));
        const r1 = Math.sqrt(-2 * Math.log(1 - rand())), r2 = 2 * Math.PI * rand();
        queue.push({ t: e.t + dt, lat: e.lat + sd * r1 * Math.cos(r2), lon: e.lon + sd * r1 * Math.sin(r2), mag: mag() });
      }
    }
    q.forEach(e => { e.t = e.t * 864e5; });
    return q;
  }

  // ---- reference values from independent implementations ---------------------
  // Produced by scripts/japan-04-reference.py on the catalog shared/data/earthquakes.csv
  // (16,787 earthquakes, M4.5+, 2000-2025): ETH seismostats 1.0.1 (b, Shi-Bolt se, b-stability
  // Mc), OpenQuake hmtk 3.26 (Gardner-Knopoff), scipy (tapered survival).
  const REFERENCE = {
    hist: [3943, 3378, 2450, 1869, 1446, 847, 618, 504, 379, 258, 210, 154, 165, 116, 107, 67, 69, 46, 45, 19, 18, 14, 12, 12, 8, 10, 6, 2, 4, 4, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],                                  // counts per 0.1 bin from M4.5
    b: [{"mc": 4.5, "n": 16787, "b": 1.2141426174231453, "se_sb": 0.00982175016943614, "b_exact": 1.2221445050985462}, {"mc": 4.8, "n": 7016, "b": 1.179411683775194, "se_sb": 0.015383202366562442, "b_exact": 1.1867414124741409}, {"mc": 5.0, "n": 3701, "b": 1.0485168319409863, "se_sb": 0.01748442044287911, "b_exact": 1.0536548618253565}, {"mc": 5.2, "n": 2236, "b": 1.0214394251979293, "se_sb": 0.021445959174879146, "b_exact": 1.0261874432578637}, {"mc": 5.5, "n": 1095, "b": 0.9997949283802393, "se_sb": 0.028680172121225124, "b_exact": 1.0042458964869438}, {"mc": 6.0, "n": 343, "b": 1.0598577537731442, "se_sb": 0.057782301042594485, "b_exact": 1.0651653363167997}],
    mcStability: 5.2,
    diffBs: [2.1560800298495346, 6.222864259150361, 6.487132614066127, 6.339982171081703, 5.046148920783083, 1.8507412681701079, 1.1455419553609256, 0.7752137333953896],                               // seismostats' |b_avg - b| / se, Mc 4.5 to 5.2
    taper: { mt: 5.2, beta: 2 / 3, corner: 8.8, S8: 0.0014879885853154298, S9: 2.1551143347045572e-05, integral89: 0.0014664374410631742 },
    windows: { M6km: 53.186327077268004, M6days: 499.3441887213498, M91km: 128.70043061499987, M91days: 1071.7660600831273 },
    // the M5.5+ events of 2010-2012: [ms, lat, lon, mag, mainshock per OpenQuake run on this subset]
    gk: [
      [1263553718370,26.746,126.285,5.7,1],
      [1263708276520,37.938,143.599,5.6,0],
      [1264403708980,30.964,130.888,5.5,1],
      [1266455599510,42.587,130.703,6.9,1],
      [1267216286970,25.93,128.425,7.0,1],
      [1267345064340,34.832,141.468,5.6,1],
      [1267882272940,44.174,147.647,5.7,1],
      [1268484386380,37.594,141.299,5.6,0],
      [1268554083960,37.745,141.59,6.5,0],
      [1269910971490,43.308,138.379,5.7,1],
      [1272882465090,29.645,140.951,6.1,1],
      [1274863988030,25.773,129.944,6.5,1],
      [1275715322880,43.426,146.773,5.5,1],
      [1276274268050,26.688,142.503,5.7,1],
      [1276275516070,26.712,142.688,5.5,0],
      [1276399977240,37.372,141.625,5.9,0],
      [1276827785580,44.448,148.689,6.2,1],
      [1277726845120,30.672,141.593,5.8,1],
      [1278280551980,39.697,142.369,6.3,0],
      [1281419437540,39.406,143.148,5.9,0],
      [1283967580480,44.588,149.724,5.5,1],
      [1284356867290,41.497,141.986,5.8,1],
      [1285747200500,37.257,139.883,5.5,0],
      [1286198918860,24.27,125.154,6.3,1],
      [1287064735590,42.311,142.871,5.6,0],
      [1289158009430,24.383,141.588,5.6,1],
      [1291087480180,28.349,139.187,6.8,1],
      [1291620632710,40.904,142.967,5.7,1],
      [1292951980660,26.901,143.698,7.4,1],
      [1292953247590,27.08,143.215,5.5,0],
      [1292953285990,27.081,143.308,5.5,0],
      [1292962723490,27.096,143.236,5.6,0],
      [1292981477860,26.669,143.535,5.6,0],
      [1293054580080,26.81,143.595,6.4,0],
      [1294189052220,31.545,142.177,5.6,1],
      [1294867973860,26.973,139.882,6.4,1],
      [1297796463400,38.321,143.162,5.5,0],
      [1299638720330,38.435,142.842,7.3,0],
      [1299639436670,38.361,142.91,5.7,0],
      [1299639494080,38.246,143.102,5.7,0],
      [1299645424990,38.665,142.991,5.6,0],
      [1299694576440,38.315,142.434,6.0,0],
      [1299696278500,38.503,143.166,5.9,0],
      [1299705737580,38.345,142.648,6.0,0],
      [1299705841680,38.296,142.808,6.5,0],
      [1299744500560,38.603,143.27,5.6,0],
      [1299822384120,38.297,142.373,9.1,1],
      [1299822871940,37.712,141.184,6.3,0],
      [1299822945480,37.359,143.351,6.4,1],
      [1299823087490,37.623,142.155,6.3,0],
      [1299823171580,37.054,141.763,5.9,0],
      [1299823239300,38.095,142.492,6.2,0],
      [1299823435260,36.469,141.84,5.9,0],
      [1299823502230,36.375,141.777,5.8,0],
      [1299823573170,39.003,142.29,6.3,0],
      [1299823640880,36.419,141.876,6.4,0],
      [1299823709660,38.969,143.37,6.7,0],
      [1299823875610,36.109,141.696,5.9,0],
      [1299823956360,37.788,144.233,6.2,0],
      [1299823981040,37.211,141.601,6.2,1],
      [1299824123120,37.93,143.802,6.3,0],
      [1299824140280,36.281,141.111,7.9,1],
      [1299824329510,36.023,142.269,6.6,1],
      [1299824404110,36.004,142.067,6.5,0],
      [1299824492700,38.29,142.813,6.2,0],
      [1299824589480,39.03,142.284,6.2,0],
      [1299824750300,38.058,144.59,7.7,1],
      [1299824955990,37.812,144.233,6.1,0],
      [1299825186070,36.625,141.867,5.9,0],
      [1299825320900,35.806,141.1,5.8,0],
      [1299825425580,37.465,142.404,5.6,0],
      [1299825491330,36.094,141.665,5.8,0],
      [1299825579320,37.04,142.463,5.5,0],
      [1299825661450,39.599,141.576,5.8,1],
      [1299825991190,37.956,143.248,5.9,0],
      [1299826125590,37.961,142.724,6.2,0],
      [1299826156610,37.337,144.237,6.1,0],
      [1299826197540,40.668,141.605,5.8,1],
      [1299826348510,38.061,143.016,5.5,0],
      [1299826533600,37.562,142.855,5.9,0],
      [1299826636510,35.712,140.875,6.0,0],
      [1299826740270,37.357,144.725,6.3,0],
      [1299826871640,36.628,143.755,5.7,0],
      [1299826977260,39.693,142.529,5.8,0],
      [1299826980000,37.924,142.802,5.6,0],
      [1299827056170,38.964,142.398,5.8,0],
      [1299827121100,38.442,143.6,5.7,0],
      [1299827205820,37.778,142.98,5.6,0],
      [1299827352050,36.714,141.874,5.7,0],
      [1299827398330,36.718,141.856,5.6,0],
      [1299827459890,37.879,142.681,5.8,0],
      [1299827627620,36.103,142.358,5.9,0],
      [1299827698820,36.586,141.823,6.3,0],
      [1299827862760,37.006,142.406,5.8,0],
      [1299828196910,37.454,142.097,5.9,0],
      [1299828336460,37.934,144.529,6.1,0],
      [1299828492360,36.823,141.824,6.1,0],
      [1299828541830,39.031,142.349,6.3,0],
      [1299828618450,37.442,141.195,6.0,0],
      [1299828813660,36.323,142.71,5.7,0],
      [1299828952220,36.943,142.309,5.7,0],
      [1299829107600,39.204,142.793,5.8,0],
      [1299829375650,36.403,141.892,5.7,0],
      [1299829467990,36.195,141.813,5.8,0],
      [1299830085420,37.743,141.573,5.7,0],
      [1299830175410,37.106,142.226,5.6,0],
      [1299830388970,37.012,142.78,5.7,0],
      [1299830517000,36.936,142.7,5.9,1],
      [1299830698780,37.593,142.208,5.7,0],
      [1299831029340,36.287,140.852,5.6,0],
      [1299831127260,36.569,141.486,6.2,0],
      [1299831341850,37.047,144.541,6.1,1],
      [1299831564380,36.166,141.562,6.5,0],
      [1299831996930,37.367,143.017,6.1,0],
      [1299832071600,38.017,142.657,6.0,0],
      [1299832269260,37.469,141.176,6.0,0],
      [1299832380780,39.14,142.967,6.0,0],
      [1299832522110,36.033,140.984,5.6,0],
      [1299832752960,37.64,142.771,5.5,0],
      [1299832856140,37.447,140.984,5.9,1],
      [1299833040140,36.122,140.966,5.6,0],
      [1299833205850,37.416,142.451,5.6,0],
      [1299833543420,36.77,141.924,5.5,0],
      [1299834554680,37.683,143.311,5.5,0],
      [1299836224610,35.912,141.601,5.5,0],
      [1299838234220,39.185,142.76,6.0,0],
      [1299838922630,36.665,142.521,5.7,0],
      [1299839322690,39.397,143.592,5.9,0],
      [1299840344690,38.417,143.752,5.6,0],
      [1299841252420,37.737,141.496,5.6,0],
      [1299841858300,35.535,141.842,5.5,1],
      [1299841992980,36.38,141.778,5.5,0],
      [1299842210250,36.628,141.809,5.5,0],
      [1299842463070,35.684,140.933,5.7,0],
      [1299842489790,37.547,143.073,5.8,0],
      [1299843134800,36.238,142.396,5.7,0],
      [1299843147130,39.065,143.166,5.8,0],
      [1299843400920,39.241,142.463,6.6,0],
      [1299843868300,36.695,142.244,5.7,0],
      [1299844002500,36.004,141.171,5.8,0],
      [1299844573240,36.267,141.527,5.5,0],
      [1299844734410,35.752,142.08,5.6,0],
      [1299845574800,38.055,142.548,5.9,0],
      [1299845745320,39.084,142.264,5.8,0],
      [1299847742640,36.147,141.602,5.6,0],
      [1299848165330,37.795,141.96,5.5,0],
      [1299849411500,36.371,141.743,5.6,0],
      [1299849496630,37.575,142.827,5.5,0],
      [1299850470600,36.162,141.84,5.5,0],
      [1299850989590,38.989,144.126,5.7,1],
      [1299852038590,36.123,140.761,5.5,0],
      [1299853677040,37.112,144.036,5.5,0],
      [1299855371930,35.96,141.403,5.8,0],
      [1299856059530,36.332,141.54,5.5,0],
      [1299856394680,35.994,141.808,6.3,0],
      [1299856778270,36.247,141.856,5.5,0],
      [1299856808190,36.398,141.864,6.0,0],
      [1299856947020,35.637,141.548,5.5,0],
      [1299859890000,39.464,143.465,5.5,0],
      [1299863816210,36.999,144.159,5.6,0],
      [1299863843610,35.331,141.391,5.5,0],
      [1299867084660,37.197,142.096,5.7,0],
      [1299867427290,36.22,141.628,5.8,0],
      [1299869956540,37.014,138.376,6.2,1],
      [1299870179170,39.342,142.872,6.0,0],
      [1299870518730,36.264,140.884,5.5,0],
      [1299871464510,35.685,140.658,5.5,0],
      [1299871916250,36.943,138.3,5.7,0],
      [1299872810880,40.483,139.055,6.2,1],
      [1299874284060,39.005,142.633,6.1,0],
      [1299875021280,35.814,141.605,5.7,0],
      [1299875770270,37.829,142.828,5.5,0],
      [1299883879850,37.834,144.827,5.7,0],
      [1299890709180,36.112,141.768,5.5,0],
      [1299893649620,38.751,142.831,5.8,0],
      [1299894380540,37.328,141.754,5.5,0],
      [1299894435400,37.594,142.648,6.5,0],
      [1299898053500,37.6,143.61,5.9,0],
      [1299898907410,39.549,142.598,5.8,0],
      [1299899517760,35.952,141.344,5.9,0],
      [1299905577130,40.082,143.202,5.7,0],
      [1299910724570,39.171,142.33,5.5,0],
      [1299927210780,39.049,142.279,5.7,0],
      [1299934432100,37.734,143.506,5.9,0],
      [1299935741650,37.249,141.159,6.1,0],
      [1299938611310,38.791,142.549,5.6,0],
      [1299940990850,39.465,142.405,5.8,0],
      [1299950363850,36.517,142.482,5.8,0],
      [1299967966270,37.681,141.889,5.8,0],
      [1299972288780,38.047,141.72,6.1,0],
      [1299979564250,35.723,141.637,6.1,0],
      [1299983014520,36.344,142.344,5.8,0],
      [1300003002520,39.642,143.181,5.7,0],
      [1300009950970,38.849,141.858,5.6,0],
      [1300016250420,37.348,142.394,5.7,0],
      [1300038921600,35.152,141.1,5.6,0],
      [1300064558560,36.408,140.894,5.5,0],
      [1300083156060,37.785,142.456,6.0,0],
      [1300125581080,37.206,142.245,5.6,0],
      [1300182592640,37.367,142.301,5.8,0],
      [1300189581020,40.419,142.959,5.5,1],
      [1300195676630,37.576,142.237,6.0,0],
      [1300195906320,35.272,138.582,6.0,1],
      [1300202633850,40.335,143.288,6.1,0],
      [1300220999820,35.209,140.994,5.7,0],
      [1300247522970,35.747,140.71,5.7,0],
      [1300256943250,39.887,142.019,5.7,0],
      [1300335236780,40.136,142.168,6.2,0],
      [1300342361550,37.709,143.443,5.6,0],
      [1300365124610,35.496,140.763,5.5,0],
      [1300366492640,36.757,141.202,5.8,0],
      [1300388136930,37.125,142.335,5.5,0],
      [1300418633830,37.759,143.488,5.5,0],
      [1300491181380,39.161,142.23,5.5,0],
      [1300497764790,39.696,142.904,5.9,0],
      [1300528607710,36.796,140.268,5.7,0],
      [1300600530890,37.724,141.363,5.6,0],
      [1300622626720,39.35,141.824,5.8,0],
      [1300765115840,35.205,140.997,5.7,0],
      [1300778325380,37.244,144.003,6.4,0],
      [1300785546230,37.325,141.791,6.1,0],
      [1300787069330,39.851,143.437,6.4,1],
      [1300792899290,39.733,143.113,5.6,0],
      [1300795282420,36.866,143.188,5.6,0],
      [1300795448970,36.289,141.404,5.7,0],
      [1300801851910,35.795,141.549,5.9,0],
      [1300806226840,35.787,141.567,5.6,0],
      [1300831951820,37.065,140.638,5.5,0],
      [1300832037200,37.014,140.679,5.5,0],
      [1300833300720,37.111,140.58,5.5,0],
      [1300954860140,39.079,142.084,5.8,0],
      [1301052984490,38.772,141.88,6.2,0],
      [1301264638800,38.415,142.011,6.2,0],
      [1301396073200,37.401,142.29,6.1,0],
      [1301416549290,39.591,143.455,5.5,0],
      [1301462992520,36.143,142.464,5.7,0],
      [1301555730190,38.922,141.821,6.0,0],
      [1301659074390,39.323,141.95,5.9,0],
      [1301677426390,40.282,143.209,5.5,0],
      [1302186763290,38.276,141.588,7.1,0],
      [1302353867820,29.999,131.78,5.9,1],
      [1302509772730,37.001,140.401,6.6,1],
      [1302509810910,37.791,140.812,5.8,0],
      [1302522155130,36.98,140.356,5.5,0],
      [1302560780030,36.809,138.284,5.5,0],
      [1302563296870,35.417,140.575,6.2,0],
      [1302584861860,37.107,140.368,5.9,0],
      [1302637068290,39.368,141.895,5.6,0],
      [1302724645420,39.583,143.34,6.0,0],
      [1302726741420,39.619,143.191,5.5,0],
      [1302761327340,35.56,141.881,5.7,0],
      [1302916270380,25.435,123.897,5.7,1],
      [1302920370790,36.378,139.653,5.8,1],
      [1302986206320,36.878,143.917,5.5,0],
      [1303346343210,40.341,143.549,5.7,0],
      [1303350881580,40.306,143.628,5.8,0],
      [1303393023340,35.579,140.305,6.2,1],
      [1303402278450,37.553,141.219,5.6,0],
      [1303553566980,39.097,142.87,5.9,0],
      [1303982867230,37.455,141.653,5.5,0],
      [1304607498680,38.17,144.032,6.0,0],
      [1304637682100,26.124,128.398,5.5,0],
      [1304801540760,40.239,142.243,5.7,0],
      [1304972153560,37.739,143.536,5.6,0],
      [1305041164610,43.292,130.938,5.7,1],
      [1305329752860,37.396,141.341,6.1,0],
      [1305852376950,35.761,140.843,5.8,0],
      [1306015586390,35.597,140.492,5.6,0],
      [1306075571670,37.601,143.488,5.6,0],
      [1306208451300,39.709,143.247,5.8,0],
      [1307059500830,37.285,143.907,6.1,0],
      [1307116815030,37.067,140.912,5.5,0],
      [1308056812190,37.727,143.512,5.7,0],
      [1308396665880,37.664,141.664,5.7,0],
      [1308752939170,40.046,142.777,5.7,0],
      [1308779452350,39.955,142.205,6.7,1],
      [1308937167210,42.049,142.553,5.5,0],
      [1309965299030,36.372,141.618,5.7,0],
      [1310063740740,37.125,140.869,5.5,0],
      [1310259430800,38.034,143.264,7.0,0],
      [1310731272200,36.128,139.85,5.5,0],
      [1311395664180,38.898,141.815,6.3,0],
      [1311533485070,37.73,141.39,6.3,0],
      [1311594894080,35.273,140.933,5.6,0],
      [1311843699030,40.344,143.236,5.6,0],
      [1312052030720,36.942,140.955,6.3,0],
      [1312133757870,41.795,142.826,5.5,0],
      [1312206287300,39.837,142.083,5.7,0],
      [1312210689060,34.631,138.433,5.9,1],
      [1313086924920,37.034,140.893,5.8,0],
      [1313581448370,36.765,143.77,6.1,1],
      [1313732193040,37.671,141.652,6.2,0],
      [1314012215250,36.083,141.688,5.9,0],
      [1316073609640,36.256,141.338,6.1,0],
      [1316201200260,40.273,142.779,6.7,0],
      [1316203876090,40.235,143.24,5.7,0],
      [1316207285330,40.239,143.008,5.9,0],
      [1316208998590,40.077,143.15,5.8,0],
      [1316212846930,40.242,143.145,5.7,0],
      [1316244867690,40.265,142.657,5.7,0],
      [1316329458070,39.845,143.052,5.6,0],
      [1317692249130,26.768,140.429,5.6,0],
      [1318214757860,37.547,141.257,5.6,0],
      [1319184157950,43.892,142.479,6.1,1],
      [1319945026000,25.372,122.866,5.7,1],
      [1320721148510,27.324,125.621,6.9,1],
      [1322076271470,37.365,141.368,6.1,0],
      [1322130334030,41.898,142.639,6.2,1],
      [1323961968270,31.717,141.631,5.6,1],
      [1325395675980,31.456,138.072,6.8,1],
      [1326338449990,36.994,141.071,5.5,0],
      [1327710138940,40.177,142.211,5.6,0],
      [1329190070500,36.193,141.402,5.5,0],
      [1329200521170,36.214,141.386,5.8,0],
      [1330441655040,28.2,139.391,5.6,0],
      [1330525967830,35.2,141.001,5.6,0],
      [1331555566360,45.239,147.609,5.5,1],
      [1331716115140,40.887,144.944,6.9,1],
      [1331722164580,40.781,144.761,6.1,0],
      [1331722660100,40.755,144.806,5.6,0],
      [1331726704520,35.687,140.695,6.0,0],
      [1331839218260,35.802,139.279,5.5,1],
      [1332846044500,39.859,142.017,6.1,0],
      [1333289064910,37.116,140.957,5.7,0],
      [1334242252850,37.513,141.468,5.5,0],
      [1334311801200,36.988,141.152,5.7,0],
      [1334727475940,28.689,138.772,5.5,0],
      [1335298930410,35.622,140.472,5.5,0],
      [1335695331870,35.596,140.349,5.8,0],
      [1335711738420,39.745,142.037,5.6,0],
      [1337454318970,39.665,143.311,5.9,0],
      [1337498394880,39.548,143.248,5.6,0],
      [1337498436870,39.646,143.164,6.3,0],
      [1337785345310,41.335,142.082,5.9,1],
      [1338068890120,26.91,140.055,6.0,0],
      [1338924693750,34.943,141.132,6.1,1],
      [1339275618070,24.572,122.248,5.9,1],
      [1339965140590,38.919,141.831,6.3,0],
      [1341861907110,29.381,130.099,5.6,1],
      [1345904177080,42.419,142.913,5.9,1],
      [1346267111120,38.425,141.814,5.5,0],
      [1349130106020,39.808,143.099,6.1,0],
      [1350982418240,29.057,139.251,5.9,1],
      [1351161148190,38.306,141.699,5.6,0],
      [1352089826720,37.791,143.61,5.6,0],
      [1354868303130,37.89,143.949,7.3,0],
      [1354869074800,37.914,143.764,6.2,0],
      [1354870093040,37.828,143.607,5.5,0]
    ]
  };
  function histMags(hist) { const out = []; hist.forEach((c, i) => { for (let j = 0; j < c; j++) out.push(Math.round((4.5 + i / 10) * 10) / 10); }); return out; }

  function runChecks(print) {
    const res = [];
    const check = (name, ok, detail) => { res.push({ name, ok: !!ok, detail }); if (print) console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); };

    // 1. Estimator on synthetic catalogs of known b
    for (const b0 of [1.0, 0.8]) {
      const rand = rng(11 + Math.round(b0 * 10)), N = 2236, S = 500;
      let bias = 0, cover = 0, coverSB = 0;
      for (let s = 0; s < S; s++) {
        const f = bValue(grMags(rand, N, b0, 5.15), 5.2);
        bias += f.b - b0;
        if (Math.abs(f.b - b0) <= 1.96 * f.se) cover++;
        if (Math.abs(f.b - b0) <= 1.96 * f.seSB) coverSB++;
      }
      bias /= S;
      check("b estimator, b = " + b0 + ", n = " + N + ", " + S + " catalogs: |bias| < 0.01, 1.96 se covers 92-98%",
        Math.abs(bias) < 0.01 && cover / S >= 0.92 && cover / S <= 0.98, "bias " + bias.toFixed(4) + ", coverage " + (100 * cover / S).toFixed(1) + "% (Shi-Bolt " + (100 * coverSB / S).toFixed(1) + "%)");
    }

    // 2. b-stability on an incomplete catalog (Ogata-Katsura detection, mu 4.9, sigma 0.15)
    {
      const rand = rng(5), all = grMags(rand, 60000, 1.0, 3.95), mu = 4.9, sg = 0.15;
      const seen = all.filter(m => rand() < normCdf((m - mu) / sg));
      const r = bStabilityMc(seen, { from: 4.0 }), f = bValue(seen, r.mc);
      check("b-stability Mc on an incomplete synthetic catalog lands within 0.1 of mu + 2 sigma, b within 2 se of 1",
        r.mc !== null && Math.abs(r.mc - (mu + 2 * sg)) <= 0.1 + EPS && Math.abs(f.b - 1) <= 2 * f.se, "Mc " + r.mc + " (mu + 2 sigma = " + (mu + 2 * sg).toFixed(1) + "), b " + f.b.toFixed(3) + " +- " + f.se.toFixed(3));
    }

    // 3. Mixed magnitude scales: below 5.5 the scale is compressed (reads 0.75 of the true distance)
    {
      const rand = rng(8), mixed = grMags(rand, 40000, 1.0, 4.45).map(m => m < 5.5 ? Math.round((5.5 - 0.75 * (5.5 - m)) * 10) / 10 : m);
      const lowB = bValue(mixed.filter(m => m < 5.45), 4.7).b, hiB = bValue(mixed, 5.5).b;
      const r = bStabilityMc(mixed, { from: 4.7 });
      check("mixed scales: b is steeper below the merge (about b / 0.75) and b-stability lands at the merge",
        lowB > 1.2 && Math.abs(hiB - 1) < 0.05 && r.mc !== null && r.mc >= 5.4 && r.mc <= 5.7, "b below " + lowB.toFixed(2) + ", above " + hiB.toFixed(2) + ", Mc " + r.mc);
    }

    // 4. Tapered law: corner recovery, and the open upper side
    {
      const rand = rng(21), P = { mt: 5.2, b: 1.0, corner: 8.0 };
      const m1 = []; for (let i = 0; i < 20000; i++) m1.push(Math.round(taperedMag(rand, P) * 10) / 10);
      const f1 = fitTapered(m1, 5.2, { from: 7.0, to: 9.0 });
      check("tapered law: 20,000 synthetic events with corner 8.0 recover the corner within 0.15 and b within 0.03",
        Math.abs(f1.best.corner - 8.0) <= 0.15 && Math.abs(f1.best.b - 1) < 0.03, "corner " + f1.best.corner + ", b " + f1.best.b.toFixed(3));
      const m2 = []; for (let i = 0; i < 2236; i++) m2.push(Math.round(taperedMag(rand, { mt: 5.2, b: 1.0, corner: 9.5 }) * 10) / 10);
      const f2 = fitTapered(m2, 5.2);
      check("tapered law: 2,236 events with corner 9.5 give a 95% lower bound below 9.5 and no upper bound",
        f2.lower !== null && f2.lower < 9.5 && f2.upper === null, "lower " + f2.lower + ", upper " + f2.upper);
    }

    // 5. Independent references
    const mags = histMags(REFERENCE.hist);
    check("catalog histogram reproduces 16,787 events", mags.length === 16787, mags.length + " events");
    {
      let worst = 0, worstSe = 0;
      let dEx = 0;
      REFERENCE.b.forEach(r => { dEx = Math.max(dEx, Math.abs(bValueExact(mags, r.mc) - r.b_exact)); const f = bValue(mags, r.mc); worst = Math.max(worst, Math.abs(f.b - r.b)); worstSe = Math.max(worstSe, Math.abs(f.seSB - r.se_sb)); if (f.n !== r.n) worst = 1; });
      check("b (Utsu form), its Shi-Bolt se and the exact discrete b at Mc 4.5-6.0 match seismostats to 1e-6", worst < 1e-6 && worstSe < 1e-6 && dEx < 1e-6, "max |db| " + worst.toExponential(1) + ", |dse| " + worstSe.toExponential(1) + ", |db exact| " + dEx.toExponential(1));
      const st = bStabilityMc(mags, { all: true });
      let dd = 0; REFERENCE.diffBs.forEach((v, i) => { dd = Math.max(dd, Math.abs(v - st.rows[i].diff)); });
      check("b-stability Mc is 5.2 as in seismostats, and its test statistic matches at every Mc 4.5-5.2", st.mc === REFERENCE.mcStability && dd < 1e-6, "Mc " + st.mc + ", max |d diff| " + dd.toExponential(1));
    }
    {
      const ev = REFERENCE.gk.map(r => ({ t: r[0], lat: r[1], lon: r[2], mag: r[3], ref: r[4] }));
      declusterGK(ev);
      const bad = ev.filter(e => (e.main ? 1 : 0) !== e.ref);
      const agree = 1 - bad.length / ev.length;
      const big = bad.filter(e => e.mag >= 6);
      check("Gardner-Knopoff flags agree with OpenQuake on at least 99% of " + ev.length + " M5.5+ events (2010-2012)", agree >= 0.99,
        (100 * agree).toFixed(1) + "%; " + bad.length + " differ, " + big.length + " of them M6+" + (big.length ? ": " + big.map(e => new Date(e.t).toISOString().slice(0, 10) + " M" + e.mag).join(", ") : ""));
      const w = REFERENCE.windows;
      check("GK windows at M6 and M9.1 match OpenQuake's", Math.abs(gkL(6) - w.M6km) < 1e-6 && Math.abs(gkT(6) - w.M6days) < 1e-6 && Math.abs(gkL(9.1) - w.M91km) < 1e-6 && Math.abs(gkT(9.1) - w.M91days) < 1e-6,
        gkL(6).toFixed(1) + " km, " + gkT(6).toFixed(0) + " d; " + gkL(9.1).toFixed(1) + " km, " + gkT(9.1).toFixed(0) + " d");
    }
    {
      const t = REFERENCE.taper, p = { mt: t.mt, b: 1.5 * t.beta, corner: t.corner };
      const S8 = survEdge(8.0, t.mt - 0.05 + 0.05, t.beta, t.corner) , S9 = survEdge(9.0, t.mt, t.beta, t.corner);
      // the script's survival starts at mt itself
      const dlt = Math.max(Math.abs(S8 / t.S8 - 1), Math.abs(S9 / t.S9 - 1));
      check("tapered survival matches scipy (S at M8 and M9, and the integral of its density over 8 to 9) to 1e-9", dlt < 1e-9 && Math.abs((S8 - S9) / t.integral89 - 1) < 1e-4,
        "rel diff " + dlt.toExponential(1));
      const plain = surv(7.0, { mt: 5.2, b: 1, corner: Infinity });
      check("an infinite corner is the plain law: 10^(-b dM)", Math.abs(plain - Math.pow(10, -1.8)) < 1e-12 && Math.abs(surv(5.2, p) - 1) < 1e-12, plain.toExponential(4));
    }

    // 6. ETAS with known b: declustering lowers b (Mizrahi, Nandan & Wiemer 2021)
    {
      const q = etasCatalog(3, { m0: 4, mmax: 8, b: 1, alpha: 0.8, K: 0.18, p: 1.1, c: 0.02, n0: 1000, days: 7300 });
      declusterGK(q);
      const all = q.map(e => e.mag), main = q.filter(e => e.main).map(e => e.mag);
      const fa = bValue(all, 4.0), fm = bValue(main, 4.0);
      check("ETAS with true b = 1 (" + q.length + " events): all events give b within 2 se of 1, Gardner-Knopoff mainshocks give b at least 0.08 lower",
        Math.abs(fa.b - 1) <= 2 * fa.se && fm.b <= fa.b - 0.08, "all " + fa.b.toFixed(3) + ", mainshocks " + fm.b.toFixed(3) + " (" + main.length + " kept)");
    }

    // Poisson helpers
    {
      const iv = poisInterval(12, 0.95), q = poisQ(10, 0.975);
      check("Poisson range for a count of 12 is 6.2 to 21.0 (Garwood); the 97.5% quantile of Poisson(10) is 17", Math.abs(iv[0] - 6.2) < 0.05 && Math.abs(iv[1] - 20.96) < 0.05 && q === 17, iv.map(v => v.toFixed(2)).join(" to ") + ", " + q);
    }
    return res;
  }

  const api = { rng, bValue, bValueExact, bStabilityMc, gkL, gkT, declusterGK, poisQ, poisInterval, prob30, surv, fitTapered, rateGE, returnYears, binCounts, etasCatalog, runChecks, REFERENCE, histMags };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.GutenbergRichter = api;
})(typeof window !== "undefined" ? window : globalThis);
