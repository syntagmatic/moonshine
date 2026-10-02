// Early-warning model for japan-earthquakes essay 07, "Earthquake Early Warning".
//
// 1. Travel times from JMA's own table, JMA2001 (tjma2001: P and S first
//    arrivals by source depth and epicentral distance), read by bilinear
//    interpolation. runChecks() compares them with an independent ray tracer
//    through JMA's velocity model (vjma2001, Earth-flattened), which is the
//    counterpart of the cutde check in 06.
// 2. The warning model: alert = P arrival at the second-nearest station +
//    a processing delay; warning at a place = S arrival there - alert.
// 3. Si and Midorikawa (1999) peak ground velocity, point source, converted to
//    JMA instrumental intensity (Midorikawa et al. 1999).
// 4. The processing delay fitted to JMA's published warning records, and the
//    detection check against them (data/07-eew-jma.json, scripts/japan-07-eew.mjs).
//
// Units: km, s. No fetch in here: the page loads the JSON and calls init(data).
// Works in the browser (window.EEW) and in node (module.exports).
(function (root) {
  "use strict";
  const RAD = Math.PI / 180, R_EARTH = 6371;
  const AMP = 1.4;          // site amplification, engineering bedrock -> typical ground
  const I_5LOWER = 4.5;     // JMA instrumental intensity at shindo 5-lower

  function haversine(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * RAD, dLon = (lon2 - lon1) * RAD;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2;
    return R_EARTH * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function quantileSorted(a, p) {
    const n = a.length; if (!n) return NaN;
    const i = (n - 1) * p, i0 = Math.floor(i), i1 = Math.min(n - 1, i0 + 1);
    return a[i0] + (a[i1] - a[i0]) * (i - i0);
  }
  function bisectRight(a, x) { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] <= x) lo = m + 1; else hi = m; } return lo; }
  const sorted = a => Float64Array.from(a).sort();
  const median = a => quantileSorted(sorted(a), 0.5);

  // ---- JMA2001 travel times ----
  // data.tt = { scale, depth: [km], dist: [km], P: [depth][dist], S: [depth][dist] } in 1/scale s
  let TT = null;
  function init(data) {
    const t = data.tt;
    TT = { depth: t.depth, dist: t.dist, P: t.P.map(r => Float64Array.from(r, v => v / t.scale)), S: t.S.map(r => Float64Array.from(r, v => v / t.scale)) };
    return TT;
  }
  // index i with a[i] <= v < a[i+1], clamped so i+1 exists
  function slot(a, v) { let lo = 0, hi = a.length - 2; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (a[m] <= v) lo = m; else hi = m - 1; } return lo; }
  // first-arrival time of phase "P" or "S" for a source at depth (km) and epicentral distance (km).
  // Past the last tabulated distance the last slope is extended.
  function travelIn(T, phase, depth, dist) {
    const tab = phase === "P" ? T.P : T.S, hs = T.depth, ds = T.dist;
    const h = Math.max(0, Math.min(hs[hs.length - 1], depth)), d = Math.max(0, dist);
    const i = slot(hs, h), u = (h - hs[i]) / (hs[i + 1] - hs[i]);
    const nd = ds.length;
    const at = j => (1 - u) * tab[i][j] + u * tab[i + 1][j];
    if (d > ds[nd - 1]) { const a = at(nd - 2), b = at(nd - 1); return b + (b - a) / (ds[nd - 1] - ds[nd - 2]) * (d - ds[nd - 1]); }
    const j = slot(ds, d), v = (d - ds[j]) / (ds[j + 1] - ds[j]);
    return (1 - v) * at(j) + v * at(j + 1);
  }
  function travel(phase, depth, dist) { return travelIn(TT, phase, depth, dist); }
  // epicentral distance a wavefront has reached after t seconds (0 until it reaches the surface above the source)
  function radiusAt(phase, depth, t) {
    if (t <= travel(phase, depth, 0)) return 0;
    let lo = 0, hi = 3000;
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (travel(phase, depth, m) <= t) lo = m; else hi = m; }
    return lo;
  }

  // ---- shaking: Si and Midorikawa (1999), point source ----
  // PGV (cm/s) on engineering bedrock, X = hypocentral distance (km); crustal
  // term 0 above 60 km, intraplate +0.12 below; times AMP; I = 2.68 + 1.72 log10 PGV.
  function pgvLog(M, D, X) {
    const d = D > 60 ? 0.12 : 0;
    return 0.58 * M + 0.0038 * Math.min(D, 200) + d - 1.29 - Math.log10(X + 0.0028 * 10 ** (0.5 * M)) - 0.002 * X;
  }
  function intensityAt(M, D, X) { return 2.68 + 1.72 * (Math.log10(AMP) + pgvLog(M, D, X)); }
  // hypocentral distance at which the modeled intensity falls to 5-lower
  function radius5(M, D) {
    if (intensityAt(M, D, D) < I_5LOWER) return 0;
    let lo = D, hi = 3000;
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (intensityAt(M, D, m) >= I_5LOWER) lo = m; else hi = m; }
    return lo;
  }
  function shindoIdx(I) { const c = [0.5, 1.5, 2.5, 3.5, 4.5, 5.0, 5.5, 6.0, 6.5]; let k = 0; while (k < c.length && I >= c[k]) k++; return k; }
  const surfR = (r3d, D) => r3d > D ? Math.sqrt(r3d * r3d - D * D) : 0;

  // ---- warning model ----
  // P arrivals at the two stations nearest the epicenter (travel time grows with distance, so the
  // nearest two by distance are the first two to detect).
  function stationTimes(q, stations) {
    let d1 = Infinity, d2 = Infinity;
    for (const s of stations) {
      const d = haversine(q.lat, q.lon, s.lat, s.lon);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    return { d1, d2, t1: travel("P", q.D, d1), t2: travel("P", q.D, d2) };
  }
  // S arrival times sorted ascending, for the sorted array S and the alert time a
  function warnStats(S, a) {
    const n = S.length;
    return { alert: a, n, min: S[0] - a, max: S[n - 1] - a, med: quantileSorted(S, 0.5) - a,
      q1: quantileSorted(S, 0.25) - a, q3: quantileSorted(S, 0.75) - a, blind: bisectRight(S, a) / n };
  }
  // Hexagonal station grid, one per ~spacing km of land, plus stations on any land
  // the grid leaves farther than spacing/sqrt(3) from a station (peninsulas, small islands).
  // isLand(lon, lat) -> bool; cells = [{lon, lat}] land cell centers.
  function buildStations(isLand, cells, spacing) {
    spacing = spacing || 20;
    const out = [], bins = new Map(), key = (i, j) => i + "," + j;
    const add = s => { out.push(s); const k = key(Math.floor(s.lon * 4), Math.floor(s.lat * 4)); if (!bins.has(k)) bins.set(k, []); bins.get(k).push(s); };
    const within = (lon, lat, km) => {
      const i = Math.floor(lon * 4), j = Math.floor(lat * 4);
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
        const a = bins.get(key(i + di, j + dj));
        if (a) for (const s of a) if (haversine(lat, lon, s.lat, s.lon) < km) return true;
      }
      return false;
    };
    const dLat = spacing * Math.sqrt(3) / 2 / 111.2;
    let row = 0;
    for (let lat = 24; lat <= 46; lat += dLat, row++) {
      const dLon = spacing / (111.2 * Math.cos(lat * RAD));
      for (let lon = 123 + (row % 2 ? dLon / 2 : 0); lon <= 154; lon += dLon) if (isLand(lon, lat)) add({ lon, lat });
    }
    const gap = spacing / Math.sqrt(3);
    for (const c of cells) if (!within(c.lon, c.lat, gap)) add({ lon: c.lon, lat: c.lat });
    return out;
  }

  // ---- calibration against JMA's records ----
  // ev (data.events[i]): lat, lon, D (JMA hypocenter), detect (first P detection, s after JMA origin),
  // warnT (first warning report, s after origin), firstT (first report, only when the page lists all of them).
  // Events whose detection precedes their origin were triggered by an earlier shock and are left out.
  // a first report counts only when the page lists every report and it carries a magnitude (PLUM-era placeholders say M1.0)
  const usableFirst = ev => ev.firstT != null && ev.firstM >= 2;
  function eventFit(ev, stations) {
    if (ev.detect == null || ev.detect < 0 || ev.warnT == null) return null;
    const st = stationTimes(ev, stations);
    return { id: ev.id, t1: st.t1, t2: st.t2, det: ev.detect - st.t1, proc: ev.warnT - st.t2,
      first: usableFirst(ev) ? ev.firstT - st.t2 : null, firstGap: usableFirst(ev) ? ev.firstT - ev.detect : null,
      warnGap: ev.warnT - ev.detect };
  }
  function fitProc(events, stations) {
    const rows = events.map(e => eventFit(e, stations)).filter(Boolean);
    const q = (a, p) => quantileSorted(sorted(a), p);
    const procs = rows.map(r => r.proc), firsts = rows.filter(r => r.first != null).map(r => r.first);
    return { n: rows.length, proc: q(procs, 0.5), q1: q(procs, 0.25), q3: q(procs, 0.75),
      nFirst: firsts.length, procFirst: q(firsts, 0.5), rows };
  }

  // ---- independent check: first arrivals by ray tracing through vjma2001 ----
  // vm = { z: [km], vp: [], vs: [] } sampled every 0.5 km. Earth flattening (z -> -R ln((R-z)/R),
  // v -> v R/(R-z)), constant-velocity slabs, ray parameter swept for the direct upgoing ray and the
  // rays that turn at the top of each faster layer below the source; first arrival by lower envelope.
  function rayTrace(vm, phase, hsrc, dists) {
    const R = R_EARTH, vk = phase === "P" ? vm.vp : vm.vs, segs = [];
    let fz = 0;
    for (let i = 0; i < vm.z.length - 1; i++) {
      const z0 = vm.z[i], z1 = vm.z[i + 1]; if (z1 <= z0) continue;
      const h = -R * Math.log((R - z1) / R) + R * Math.log((R - z0) / R);
      segs.push({ top: fz, bot: fz + h, v: (vk[i] + vk[i + 1]) / 2 * R / (R - (z0 + z1) / 2) }); fz += h;
    }
    const hf = -R * Math.log((R - hsrc) / R), vsrc = segs.find(s => s.bot > hf).v;
    const integ = (p, zmax) => {
      let x = 0, t = 0;
      for (const s of segs) {
        if (s.top >= zmax) break;
        const dz = Math.min(s.bot, zmax) - s.top, q = 1 - p * p * s.v * s.v;
        if (q <= 0) return null;
        const c = Math.sqrt(q); x += dz * p * s.v / c; t += dz / (s.v * c);
      }
      return { x, t };
    };
    const up = [], N = 4000;
    for (let i = 0; i < N; i++) { const r = integ((i / N) / vsrc, hf); if (r) up.push([r.x, r.t]); }
    const turn = [];
    for (let j = 0; j < segs.length; j++) {
      if (segs[j].top < hf) continue;
      let vmax = 0; for (let k = 0; k < j; k++) vmax = Math.max(vmax, segs[k].v);
      if (segs[j].v <= vmax) continue;
      for (const f of [0.99999, 0.9999]) {
        const a = integ(f / segs[j].v, segs[j].top), b = integ(f / segs[j].v, hf);
        if (a && b) turn.push([2 * a.x - b.x, 2 * a.t - b.t]);
      }
    }
    turn.sort((a, b) => a[0] - b[0]);
    const env = (br, d, best) => { for (let i = 0; i < br.length - 1; i++) { const [x0, t0] = br[i], [x1, t1] = br[i + 1]; if (d >= x0 && d <= x1) best = Math.min(best, t0 + (t1 - t0) * (d - x0) / (x1 - x0)); } return best; };
    return dists.map(d => env(turn, d, env(up, d, Infinity)));
  }

  // ---- checks ----
  function loadData() {
    try {
      if (typeof module !== "undefined" && module.exports && typeof require === "function") {
        const fs = require("fs"), path = require("path");
        return JSON.parse(fs.readFileSync(path.join(__dirname, "data", "07-eew-jma.json"), "utf8"));
      }
      if (typeof XMLHttpRequest !== "undefined" && typeof document !== "undefined") {
        const x = new XMLHttpRequest(); x.open("GET", SCRIPT_BASE + "data/07-eew-jma.json", false); x.send();
        return JSON.parse(x.responseText);
      }
    } catch (e) { /* fall through */ }
    return null;
  }
  const SCRIPT_BASE = (typeof document !== "undefined" && document.currentScript) ? document.currentScript.src.replace(/[^/]*$/, "") : "";

  function runChecks(print, data) {
    const out = [];
    const check = (name, ok, detail) => out.push({ name, ok: !!ok, detail });
    data = data || loadData();
    if (!data) {
      check("07-eew-jma.json is available", false, "could not load shared/data/07-eew-jma.json");
      return out;
    }
    init(data);
    const jt = data.tt;

    // 1. the ray tracer reproduces JMA's own table
    let worst = 0, wAt = "", cnt = 0;
    for (const h of [10, 30, 60, 100, 200, 400]) for (const ph of ["P", "S"]) {
      const ds = [10, 30, 50, 100, 150, 200, 300, 400, 600];
      const rt = rayTrace(data.vmodel, ph, h, ds);
      ds.forEach((d, i) => { const e = Math.abs(rt[i] - travel(ph, h, d)); cnt++; if (!(e <= worst)) { worst = isFinite(e) ? e : Infinity; wAt = `${ph} h${h} d${d}`; } });
    }
    check("ray tracing through JMA's velocity model (vjma2001) matches the JMA2001 table", worst <= 0.1, `${cnt} P and S arrivals, depth 10-400 km, 10-600 km out; worst ${worst.toFixed(3)} s (${wAt})`);

    // 2. interpolation: build from every other node, read the nodes in between
    const half = { depth: jt.depth.filter((_, i) => i % 2 === 0), dist: jt.dist.filter((_, i) => i % 2 === 0) };
    const sub = ph => half.depth.map(h => half.dist.map(d => TT[ph][jt.depth.indexOf(h)][jt.dist.indexOf(d)]));
    const T2 = { depth: half.depth, dist: half.dist, P: sub("P"), S: sub("S") };
    let w2 = 0, w2Shallow = 0;
    for (let i = 1; i < jt.depth.length - 1; i += 2) for (let j = 1; j < jt.dist.length - 1; j += 2) {
      for (const ph of ["P", "S"]) {
        const e = Math.abs(travelIn(T2, ph, jt.depth[i], jt.dist[j]) - TT[ph][i][j]);
        if (e > w2) w2 = e;
        if (jt.depth[i] <= 50 && jt.dist[j] <= 300 && e > w2Shallow) w2Shallow = e;
      }
    }
    check("travel() interpolates held-out JMA2001 nodes to 0.3 s (0.2 s for depth <= 50 km, distance <= 300 km)", w2 <= 0.3 && w2Shallow <= 0.2,
      `built from every other node, so the real grid is about four times closer; worst ${w2.toFixed(3)} s overall, ${w2Shallow.toFixed(3)} s in the shallow near field`);

    // 3. near field: JMA2001 agrees with a constant 3.5 km/s S wave to 1.5 s inside 150 km
    let w3 = 0;
    for (const d of [20, 50, 80, 110, 140]) w3 = Math.max(w3, Math.abs(travel("S", 10, d) - Math.hypot(d, 10) / 3.5));
    check("within 150 km of a 10 km deep source JMA2001 S is within 1.5 s of a constant 3.5 km/s", w3 <= 1.5, `worst ${w3.toFixed(2)} s`);
    // far field: the constant-speed shortcut the page used to take is wrong there
    const s373 = travel("S", 24, 373), p373 = travel("P", 24, 373);
    check("Tokyo from the 2011 USGS epicenter (373 km, 24 km deep): S - P is 39 s, not the 44 s of constant speeds", Math.abs((s373 - p373) - 39.2) < 0.5 && Math.abs(s373 - 91.8) < 0.5,
      `S ${s373.toFixed(1)} s, P ${p373.toFixed(1)} s`);

    // 4. the wavefront radius inverts the travel time
    let w4 = 0;
    for (const [ph, h, t] of [["P", 10, 20], ["S", 24, 60], ["S", 100, 90], ["P", 300, 70]]) w4 = Math.max(w4, Math.abs(travel(ph, h, radiusAt(ph, h, t)) - t));
    check("radiusAt() inverts travel()", w4 < 1e-3, `worst ${w4.toExponential(1)} s`);

    // 5. Si and Midorikawa (1999) against the published equation, M7, D 10 km, X 20 km:
    // log PGV = 0.58 M + 0.0038 D + d - 1.29 - log(X + 0.0028 * 10^(0.5 M)) - 0.002 X = 1.3078, PGV 20.3 cm/s
    const pgv = 10 ** pgvLog(7, 10, 20);
    const iExp = 2.68 + 1.72 * Math.log10(20.3 * AMP);
    check("Si-Midorikawa PGV for Mw 7 at 20 km and 10 km depth is 20.3 cm/s; intensity follows", Math.abs(pgv - 20.3) < 0.1 && Math.abs(intensityAt(7, 10, 20) - iExp) < 0.01,
      `PGV ${pgv.toFixed(2)} cm/s, intensity ${intensityAt(7, 10, 20).toFixed(2)}`);

    // 6. the station grid
    const st = data.stations.map(s => ({ lon: s[0], lat: s[1] }));
    let near = [];
    for (let i = 0; i < st.length; i += 25) { let m = Infinity; for (let j = 0; j < st.length; j++) if (j !== i) m = Math.min(m, haversine(st[i].lat, st[i].lon, st[j].lat, st[j].lon)); near.push(m); }
    check("the station grid has one station per about 20 km of land", st.length > 1000 && st.length < 3000 && median(near) > 15 && median(near) < 24,
      `${st.length} stations, median nearest-neighbor spacing ${median(near).toFixed(1)} km`);

    // 7. detection against JMA: first P detection - model first P arrival
    const fit = fitProc(data.events, st);
    const dets = fit.rows.map(r => r.det), medDet = median(dets);
    const odd = fit.rows.filter(r => r.det < -1 || r.det > 4).map(r => r.id);
    check("JMA's first P detection follows the model's first land-station P arrival (median 0 to 3 s late)", medDet >= 0 && medDet <= 3 && odd.length <= 1,
      `n ${dets.length}, median ${medDet.toFixed(1)} s, range ${Math.min(...dets).toFixed(1)} to ${Math.max(...dets).toFixed(1)} s; outside -1..4 s: ${odd.join(", ") || "none"}`);

    // 8. the stored fit reproduces
    check("the fitted processing delay recomputes from the records", fit.n >= 15 && Math.abs(fit.proc - data.fit.proc) < 0.05 && Math.abs(fit.q1 - data.fit.q1) < 0.05 && Math.abs(fit.q3 - data.fit.q3) < 0.05,
      `n ${fit.n}, median ${fit.proc.toFixed(2)} s (stored ${data.fit.proc}), IQR ${fit.q1.toFixed(1)}-${fit.q3.toFixed(1)} s`);

    if (print && typeof console !== "undefined") out.forEach(r => console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.detail ? "  (" + r.detail + ")" : "")));
    return out;
  }

  const api = { init, travel, travelIn, radiusAt, haversine, quantileSorted, median, pgvLog, intensityAt, radius5, shindoIdx, surfR,
    stationTimes, warnStats, buildStations, eventFit, fitProc, usableFirst, rayTrace, runChecks, AMP, I_5LOWER };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.EEW = api;
})(typeof window !== "undefined" ? window : globalThis);
