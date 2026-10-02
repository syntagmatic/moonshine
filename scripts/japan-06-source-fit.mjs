// Fit the map-view 2011 source for japan-earthquakes essay 06 ("The Sanriku
// Coast") and write docs/japan-earthquakes/shared/data/06-source-fit.json.
//
//   node scripts/japan-06-source-fit.mjs
//
// Needs 06-bathy-grid.json and 06-bathy-profile.json (scripts/japan-06-bathy-
// grid.mjs and japan-06-bathy-profile.mjs). Takes about two minutes.
//
// The fault is the cross-section figure's: a plane dipping 10 degrees to the
// west from a top edge 1 km below the trench floor where the profile crosses
// the trench, 180 km wide down dip, along the profile's fitted trench strike.
// Four numbers are fitted: where it ends to the north (a0) and south (a1)
// along the trench, its slip at the top edge, and how much the slip falls by
// the bottom edge. Okada displacement and the linear shallow-water model are
// both linear in slip, so the script runs the model once for each 20 km
// stretch of trench and two slip shapes (uniform, and falling linearly to 0),
// then every candidate's gauge records and seafloor motion are sums of those.
//
// Score: sum of squared, scaled misfits to
//   - the six NOWPHAS GPS buoys' highest crest in the first 40 minutes (log
//     ratio, scale 0.2) and its time (scale 2 min); heights corrected for the
//     land-station subsidence except Iwate North, which PARI leaves raw
//     (Kawai et al. 2011, Report of PARI 50(4), Tables 3.1 and 3.5);
//   - the cabled pressure gauge TM1, more than 5 m (Maeda et al. 2011), scored
//     only if the model falls short;
//   - vertical seafloor and ground motion (scale 1 m; 2 m for the two
//     preliminary Tohoku University sites and the near-trench band);
// as listed in plans/japan-earthquakes/LEDGER.md (06, map-view source).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const D = path.join(here, '..', 'docs', 'japan-earthquakes', 'shared');
const TS = require(path.join(D, '06-tsunami-source.js'));
const grid = JSON.parse(fs.readFileSync(path.join(D, 'data', '06-bathy-grid.json')));
const P = JSON.parse(fs.readFileSync(path.join(D, 'data', '06-bathy-profile.json')));

const ORIGIN = 14 * 60 + 46 + 24 / 60;   // 14:46:24 JST, USGS ComCat
const clock = c => { const [h, m] = c.split(':').map(Number); return +(h * 60 + m - ORIGIN).toFixed(2); };

// GPS buoys: Kawai et al. 2011 Table 3.1 (site) and 3.5 (peak, subsidence).
// trace: the raw record each minute from 14:48 to 15:25 JST (m, against the
// 14:30-14:46 mean), digitized from the vector paths of their Fig. 4.2,
// good to about 0.15 m and half a minute; the heights in Table 3.5 are the
// fit's targets, the traces are drawn for comparison only.
const BUOYS = [
  { id: 'iwn', code: '807G', en: 'Iwate North (off Kuji)', ja: '岩手北部沖（久慈沖）', lat: 40.1167, lon: 142.0667, depth: 125, peak: 4.02, raw: 4.02, sub: null, clock: '15:19',
    trace: [-0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.19, -0.19, -0.19, -0.19, -0.19, -0.35, -0.35, -0.35, -0.35, -0.35, -0.19, -0.0, -0.0, -0.0, -0.0, 1.33, 4.05, 2.53, -0.0, 1.68, 1.84, 1.17, 1.68] },
  { id: 'iwc', code: '804G', en: 'Iwate Central (off Miyako)', ja: '岩手中部沖（宮古沖）', lat: 39.6272, lon: 142.1867, depth: 200, peak: 6.07, raw: 6.30, sub: 0.23, clock: '15:12',
    trace: [-0.16, -0.16, -0.16, -0.16, -0.16, -0.16, -0.32, -0.32, -0.32, -0.51, -0.51, -0.67, -0.51, -0.32, -0.16, 0.0, 0.19, 0.51, 0.85, 0.85, 0.69, 0.51, 1.2, 4.05, 6.08, 2.88, 1.87, 3.23, 1.71, 1.52, 1.52, 0.85, 1.36, 0.51, 0.0, 0.69, 1.01, -0.51] },
  { id: 'iws', code: '802G', en: 'Iwate South (off Kamaishi)', ja: '岩手南部沖（釜石沖）', lat: 39.2586, lon: 142.0969, depth: 204, peak: 6.13, raw: 6.67, sub: 0.54, clock: '15:12',
    trace: [0.0, 0.0, 0.0, 0.0, 0.0, -0.16, -0.16, -0.32, -0.32, -0.32, -0.32, -0.32, -0.16, 0.19, 0.69, 1.2, 1.71, 1.87, 2.03, 2.03, 2.21, 2.88, 4.24, 6.27, 5.92, 3.23, 1.87, 1.52, 1.01, 0.69, 1.36, 0.85, 1.52, 1.71, 1.87, 1.2, 0.69, 0.35] },
  { id: 'myn', code: '803G', en: 'Miyagi North (off Hirota Bay)', ja: '宮城北部沖（広田湾沖）', lat: 38.8578, lon: 141.8944, depth: 160, peak: 5.02, raw: 5.68, sub: 0.66, clock: '15:14',
    trace: [-0.35, -0.35, -0.35, -0.35, -0.35, -0.35, -0.35, -0.35, -0.35, -0.35, -0.35, -0.19, -0.19, -0.0, 0.16, 0.51, 0.83, 1.17, 1.52, 2.03, 2.69, 3.04, 3.04, 3.55, 4.37, 5.23, 5.57, 4.05, 2.85, 1.84, -1.36, -1.52, -0.0, -1.01, 0.16, 0.83, 1.01, 1.52] },
  { id: 'myc', code: '801G', en: 'Miyagi Central (off Kinkasan)', ja: '宮城中部沖（金華山沖）', lat: 38.2325, lon: 141.6836, depth: 144, peak: 4.83, raw: 5.78, sub: 0.95, clock: '15:16',
    trace: [-0.35, -0.16, -0.16, -0.16, -0.0, -0.16, -0.16, -0.16, -0.0, -0.0, -0.0, 0.16, 0.35, 0.51, 0.51, 0.51, 0.67, 1.01, 1.17, 1.52, 2.03, 2.53, 2.88, 3.39, 4.21, 4.72, 4.72, 5.57, 5.73, 5.57, 5.73, 5.07, 3.04, 0.67, -2.03, -4.91, -2.53, -1.17] },
  { id: 'fks', code: '806G', en: 'Fukushima (off Onahama)', ja: '福島県沖（小名浜沖）', lat: 36.9714, lon: 141.1856, depth: 137, peak: 2.14, raw: 2.62, sub: 0.38, clock: '15:16',
    trace: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.19, 0.19, 0.35, 0.35, 0.51, 0.69, 0.85, 0.85, 1.01, 0.85, 0.85, 0.85, 0.69, 0.35, 0.35, 0.19, 0.19, 0.51, 1.52, 2.53, 2.37, 2.21, 2.21, 2.03, 2.03, 2.03, 1.71, 1.71, 1.36, 1.36] }
].map(b => Object.assign(b, { t: clock(b.clock) }));
// Cabled ocean-bottom pressure gauges off Kamaishi (Maeda et al. 2011; sites
// from Satake et al. 2013 Table 1). TM1 peaked above 5 m.
const OBP = [
  { id: 'tm1', en: 'TM1 seafloor pressure gauge', ja: '海底水圧計TM1', lat: 39.23119, lon: 142.76835, depth: 1618, atLeast: 5 },
  { id: 'tm2', en: 'TM2 seafloor pressure gauge', ja: '海底水圧計TM2', lat: 39.24889, lon: 142.44115, depth: 1013 }
];
// Vertical ground and seafloor motion (m). GSI Oshika; JCG GPS-A (Sato et al.
// 2011, JCG 2011 report); Tohoku University GJT3/GJT4 (Kido et al. 2011,
// preliminary verticals).
const GEO = [
  { id: 'oshika', en: 'GSI GNSS station Oshika', ja: '国土地理院の電子基準点「牡鹿」', lat: 38.301, lon: 141.501, elev: 40, up: -1.2, scale: 1 },
  { id: 'MYGW', en: 'Seafloor station MYGW (Japan Coast Guard)', ja: '海底局 宮城沖2（海上保安庁）', lat: 38.150, lon: 142.433, elev: -1100, up: -0.8, scale: 1 },
  { id: 'MYGI', en: 'Seafloor station MYGI (Japan Coast Guard)', ja: '海底局 宮城沖1（海上保安庁）', lat: 38.083, lon: 142.916, elev: -1700, up: 3.0, scale: 1 },
  { id: 'KAMS', en: 'Seafloor station KAMS (Japan Coast Guard)', ja: '海底局 釜石沖1（海上保安庁）', lat: 38.637, lon: 143.263, elev: -2200, up: 1.5, scale: 1 },
  { id: 'KAMN', en: 'Seafloor station KAMN (Japan Coast Guard)', ja: '海底局 釜石沖2（海上保安庁）', lat: 38.888, lon: 143.362, elev: -2300, up: 1.5, scale: 1 },
  { id: 'FUKU', en: 'Seafloor station FUKU (Japan Coast Guard)', ja: '海底局 福島沖（海上保安庁）', lat: 37.166, lon: 142.083, elev: -1200, up: 0.9, scale: 1 },
  { id: 'GJT3', en: 'Seafloor station GJT3 (Tohoku University)', ja: '海底局 GJT3（東北大学）', lat: 38.273, lon: 143.483, elev: -3236, up: 5, scale: 2 },
  { id: 'GJT4', en: 'Seafloor station GJT4 (Tohoku University)', ja: '海底局 GJT4（東北大学）', lat: 38.407, lon: 142.833, elev: -1485, up: 3.5, scale: 2 }
];

// Fault geometry from the profile, as in the cross-section figure.
const R = 6371;
function dest(lat, lon, azDeg, km) {
  const r = Math.PI / 180, d = km / R, t = azDeg * r, p1 = lat * r, l1 = lon * r;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(t));
  const l2 = l1 + Math.atan2(Math.sin(t) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [p2 / r, l2 / r];
}
const iOf = s => Math.round((s - P.s0) / P.ds);
let iT = iOf(0);
for (let i = iOf(0); i < iOf(250); i++) if (P.elev[i] < P.elev[iT]) iT = i;
const sT = P.s0 + iT * P.ds, zTrench = -P.elev[iT] / 1000;
const anchor = dest(P.epicentre[0], P.epicentre[1], P.azimuth, sT).map(v => +v.toFixed(4));
const base = { anchor, strike: P.strike + 180, zTop: +(zTrench + 1).toFixed(3), W: 180, dipDeg: 10 };
// Near-trench band (Fujiwara et al. 2011): about 10 m up over the 40 km of
// slope next to the trench, on the profile line; five points, scored as their mean.
for (let k = 0; k < 5; k++) {
  const s = sT - 36 + k * 8, [lat, lon] = dest(P.epicentre[0], P.epicentre[1], P.azimuth, s);
  GEO.push({ id: 'band' + k, band: true, lat: +lat.toFixed(4), lon: +lon.toFixed(4), elev: P.elev[iOf(s)], up: 10, scale: 2 });
}

const SEG = 20, A0 = -320, A1 = 240, TEND = 2700, GE = 10, WIN = 40;
const gauges = [...BUOYS, ...OBP];
const SHAPES = { u: () => 1, r: f => 1 - f };
const t0 = Date.now();
const gf = [];
for (let a = A0; a < A1; a += SEG) {
  const row = {};
  for (const [k, fn] of Object.entries(SHAPES)) {
    const o = Object.assign({}, base, { a0: a, a1: a + SEG, slipAt: fn });
    const disp = TS.seafloorDisplacementMap(grid, o);
    const { eta } = TS.initialSurfaceMap(grid, disp, false);
    const sim = TS.simulateMap(grid, eta, { tEnd: TEND, gaugeEvery: GE, gauges, keepFrames: false });
    const geo = GEO.map(st => TS.seafloorDisplacementMap(
      { lat0: st.lat, lon0: st.lon, dlat: 1, dlon: 1, nlat: 1, nlon: 1, elev: [st.elev] }, o).uz[0]);
    row[k] = { series: sim.series.map(s => Float64Array.from(s)), geo };
  }
  gf.push(row);
  process.stdout.write('.');
}
console.log(` ${gf.length} segments in ${((Date.now() - t0) / 1000).toFixed(0)} s`);

const nt = gf[0].u.series[0].length, nWin = Math.min(nt, WIN * 60 / GE + 1);
function combine(a0, a1, top, fall) {
  // slip(f) = top (1 - fall f) = top (1 - fall) + top fall (1 - f)
  const cu = top * (1 - fall), cr = top * fall;
  const i0 = (a0 - A0) / SEG, i1 = (a1 - A0) / SEG;
  const series = gauges.map(() => new Float64Array(nt)), geo = new Float64Array(GEO.length);
  for (let s = i0; s < i1; s++) {
    const { u, r } = gf[s];
    series.forEach((out, m) => { const su = u.series[m], sr = r.series[m]; for (let k = 0; k < nt; k++) out[k] += cu * su[k] + cr * sr[k]; });
    for (let m = 0; m < GEO.length; m++) geo[m] += cu * u.geo[m] + cr * r.geo[m];
  }
  return { series, geo };
}
function peakOf(s) { let k = 0; for (let i = 0; i < nWin; i++) if (s[i] > s[k]) k = i; return { peak: s[k], t: k * GE / 60 }; }
function score(M) {
  let chi = 0;
  gauges.forEach((g, m) => {
    const { peak, t } = peakOf(M.series[m]);
    if (g.peak) {
      chi += (Math.log(Math.max(peak, 0.05) / g.peak) / 0.2) ** 2;
      chi += ((t - g.t) / 2) ** 2;
    } else if (g.atLeast && peak < g.atLeast) chi += (Math.log(Math.max(peak, 0.05) / g.atLeast) / 0.3) ** 2;
  });
  let band = 0, nb = 0;
  GEO.forEach((st, m) => {
    if (st.band) { band += M.geo[m]; nb++; return; }
    chi += ((M.geo[m] - st.up) / st.scale) ** 2;
  });
  chi += ((band / nb - 10) / 2) ** 2;
  return chi;
}
let best = null, n = 0;
for (let a0 = A0; a0 <= 0; a0 += SEG)
  for (let a1 = Math.max(a0 + 60, 0); a1 <= A1; a1 += SEG)
    for (const fall of [0, 0.25, 0.5, 0.75, 0.9, 1])
      for (let top = 10; top <= 90; top += 2) {
        const c = score(combine(a0, a1, top, fall)); n++;
        if (!best || c < best.score) best = { score: c, a0, a1, top, fall };
      }

const M = combine(best.a0, best.a1, best.top, best.fall);
const mean = best.top * (1 - best.fall / 2);
const M0 = 4e10 * (best.a1 - best.a0) * 1e3 * base.W * 1e3 * mean;
const r2 = v => +v.toFixed(2);
const out = {
  note: 'Written by scripts/japan-06-source-fit.mjs: best of ' + n + ' candidates; the page recomputes everything from fault.',
  fault: Object.assign({}, base, { a0: best.a0, a1: best.a1, slipTop: best.top, slipBottom: r2(best.top * (1 - best.fall)) }),
  Mw: r2((Math.log10(M0) - 9.1) / 1.5),
  score: r2(best.score),
  traceStart: clock('14:48'),
  buoys: BUOYS.map(b => Object.assign({}, b, { model: peakOf(M.series[gauges.indexOf(b)]) })).map(b => Object.assign(b, { model: { peak: r2(b.model.peak), t: r2(b.model.t) } })),
  obp: OBP.map(g => Object.assign({}, g, { model: (p => ({ peak: r2(p.peak), t: r2(p.t) }))(peakOf(M.series[gauges.indexOf(g)])) })),
  geo: GEO.filter(g => !g.band).map((g, i) => Object.assign({}, g, { model: r2(M.geo[GEO.indexOf(g)]) })),
  band: { up: 10, model: r2(GEO.reduce((s, g, m) => s + (g.band ? M.geo[m] : 0), 0) / 5), points: GEO.filter(g => g.band).map(g => [g.lat, g.lon]) }
};
fs.writeFileSync(path.join(D, 'data', '06-source-fit.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`best: a0 ${best.a0} a1 ${best.a1} (L ${best.a1 - best.a0} km) slip ${best.top} -> ${out.fault.slipBottom} m, Mw ${out.Mw}, score ${out.score}`);
out.buoys.forEach(b => console.log(`  ${b.id} model ${b.model.peak} m at ${b.model.t} min; measured ${b.peak} m at ${b.t} min`));
out.obp.forEach(b => console.log(`  ${b.id} model ${b.model.peak} m at ${b.model.t} min`));
out.geo.forEach(g => console.log(`  ${g.id} model ${g.model} m up; measured ${g.up}`));
console.log(`  band model ${out.band.model} m up; measured 10`);
