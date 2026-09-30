// Build docs/japan-earthquakes/shared/data/06-bathy-profile.json for
// japan-earthquakes essay 06 (tsunami propagation): the seafloor and land
// elevation along one straight line through the 2011 Tohoku epicentre,
// perpendicular to the Japan Trench, for the tsunami-source figure.
//
//   node scripts/japan-06-bathy-profile.mjs
//
// Source: ETOPO1 (NOAA NCEI, 1 arc-minute global relief), served as
// "etopo180" by the NOAA CoastWatch ERDDAP at
//   https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180
// The script fetches a box around the line, finds the trench axis (the deepest
// point between 143 and 145.5 E on each grid row, 37.3-39.3 N), fits a straight
// line to it, and runs the profile along the great circle through the
// epicentre at the fitted strike + 90 degrees. Elevation is sampled bilinearly
// every 1 km.
//
// Output: { source, epicentre, strike, azimuth, s0, ds, elev[] } where s is the
// distance along the profile in km, negative to the west (land) and positive
// to the east (Pacific), starting at s0 in steps of ds; elev is metres above
// sea level (negative below), rounded to 1 m.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EPI = [38.297, 142.373]; // USGS ComCat, event official20110311054624120_30
const BOX = { lat0: 36.5, lat1: 39.8, lon0: 140.0, lon1: 147.5 };
const S0 = -180, S1 = 320, DS = 1;
const R = 6371;
const URL_ = 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.csv?altitude' +
  `%5B(${BOX.lat0}):1:(${BOX.lat1})%5D%5B(${BOX.lon0}):1:(${BOX.lon1})%5D`;
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'docs', 'japan-earthquakes', 'shared', 'data', '06-bathy-profile.json');

const res = await fetch(URL_);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const lines = (await res.text()).trim().split('\n').slice(2);
const grid = new Map();
const lats = new Set(), lons = new Set();
for (const ln of lines) {
  const [la, lo, al] = ln.split(',').map(Number);
  const k = `${la.toFixed(4)},${lo.toFixed(4)}`;
  grid.set(k, al); lats.add(la); lons.add(lo);
}
const LAT = [...lats].sort((a, b) => a - b), LON = [...lons].sort((a, b) => a - b);
const step = LAT[1] - LAT[0];
const at = (la, lo) => grid.get(`${la.toFixed(4)},${lo.toFixed(4)}`);

// Trench axis and its strike.
const axis = [];
for (const la of LAT) {
  if (la < 37.3 || la > 39.3) continue;
  let best = null;
  for (const lo of LON) {
    if (lo < 143 || lo > 145.5) continue;
    const v = at(la, lo);
    if (best === null || v < best[1]) best = [lo, v];
  }
  axis.push([la, best[0]]);
}
const n = axis.length;
const mx = axis.reduce((a, p) => a + p[0], 0) / n, my = axis.reduce((a, p) => a + p[1], 0) / n;
const b = axis.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0) / axis.reduce((a, p) => a + (p[0] - mx) ** 2, 0);
const kmLon = Math.cos(EPI[0] * Math.PI / 180);
const strike = Math.atan2(b * kmLon, 1) * 180 / Math.PI;
const az = strike + 90;

function dest(lat, lon, azDeg, km) {
  const r = Math.PI / 180, d = km / R, t = azDeg * r, p1 = lat * r, l1 = lon * r;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(t));
  const l2 = l1 + Math.atan2(Math.sin(t) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [p2 / r, l2 / r];
}
function sample(lat, lon) {
  const i = Math.floor((lat - LAT[0]) / step), j = Math.floor((lon - LON[0]) / step);
  const la0 = LAT[i], lo0 = LON[j], fy = (lat - la0) / step, fx = (lon - lo0) / step;
  const v00 = at(la0, lo0), v01 = at(la0, LON[j + 1]), v10 = at(LAT[i + 1], lo0), v11 = at(LAT[i + 1], LON[j + 1]);
  return (1 - fy) * ((1 - fx) * v00 + fx * v01) + fy * ((1 - fx) * v10 + fx * v11);
}

const elev = [];
let ends = [];
for (let s = S0; s <= S1; s += DS) {
  const [la, lo] = dest(EPI[0], EPI[1], az, s);
  if (s === S0 || s === S1) ends.push([+la.toFixed(4), +lo.toFixed(4)]);
  elev.push(Math.round(sample(la, lo)));
}

const json = {
  source: 'ETOPO1 1 arc-minute global relief (NOAA NCEI), via NOAA CoastWatch ERDDAP griddap etopo180; sampled bilinearly by scripts/japan-06-bathy-profile.mjs',
  url: 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180',
  epicentre: EPI,
  strike: +strike.toFixed(1),
  azimuth: +az.toFixed(1),
  ends,
  s0: S0, ds: DS,
  elev
};
fs.writeFileSync(out, JSON.stringify(json) + '\n');
console.log(`strike ${strike.toFixed(1)} az ${az.toFixed(1)}; ${elev.length} samples; min ${Math.min(...elev)} m; ends ${JSON.stringify(ends)}`);
