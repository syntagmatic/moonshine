// Build docs/japan-earthquakes/shared/data/06-bathy-grid.json for
// japan-earthquakes essay 06: the seafloor and land elevation off Tohoku on a
// regular latitude-longitude grid, for the map-view tsunami model in
// "The Sanriku Coast".
//
//   node scripts/japan-06-bathy-grid.mjs [factor]
//
// Source: ETOPO1 (NOAA NCEI, 1 arc-minute global relief), served as
// "etopo180" by the NOAA CoastWatch ERDDAP at
//   https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180
// The script fetches the box below at 1 arc-minute (about 1.5 km east-west and
// 1.9 km north-south at 38 N), the model's grid; a factor > 1 averages blocks
// of factor x factor cells, for resolution checks. The box reaches far enough
// south that the Fukushima buoy's second wave is not cut by the absorbing edge.
//
// Output: { source, url, lat0, lon0, dlat, dlon, nlat, nlon, elev[] } where
// elev is metres above sea level (negative below), rounded to 1 m, row-major
// from the south-west corner: elev[i * nlon + j] is the cell centred at
// lat0 + i * dlat, lon0 + j * dlon.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BOX = { lat0: 35.6, lat1: 41.2, lon0: 140.3, lon1: 146.0 };
const F = +(process.argv[2] || 1);
const URL_ = 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.csv?altitude' +
  `%5B(${BOX.lat0}):1:(${BOX.lat1})%5D%5B(${BOX.lon0}):1:(${BOX.lon1})%5D`;
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'docs', 'japan-earthquakes', 'shared', 'data', '06-bathy-grid.json');

const res = await fetch(URL_);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const lines = (await res.text()).trim().split('\n').slice(2);
const lats = new Set(), lons = new Set(), grid = new Map();
for (const ln of lines) {
  const [la, lo, al] = ln.split(',').map(Number);
  grid.set(`${la.toFixed(4)},${lo.toFixed(4)}`, al); lats.add(la); lons.add(lo);
}
const LAT = [...lats].sort((a, b) => a - b), LON = [...lons].sort((a, b) => a - b);
const at = (i, j) => grid.get(`${LAT[i].toFixed(4)},${LON[j].toFixed(4)}`);

const nlat = Math.floor(LAT.length / F), nlon = Math.floor(LON.length / F);
const elev = [];
for (let i = 0; i < nlat; i++) {
  for (let j = 0; j < nlon; j++) {
    let s = 0;
    for (let a = 0; a < F; a++) for (let b = 0; b < F; b++) s += at(i * F + a, j * F + b);
    elev.push(Math.round(s / (F * F)));
  }
}
const step = LAT[1] - LAT[0];
const json = {
  source: `ETOPO1 1 arc-minute global relief (NOAA NCEI), via NOAA CoastWatch ERDDAP griddap etopo180; ${F} x ${F} block means by scripts/japan-06-bathy-grid.mjs`,
  url: 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180',
  lat0: +(LAT[0] + (F - 1) * step / 2).toFixed(5),
  lon0: +(LON[0] + (F - 1) * step / 2).toFixed(5),
  dlat: +(F * step).toFixed(6), dlon: +(F * step).toFixed(6),
  nlat, nlon, elev
};
fs.writeFileSync(out, JSON.stringify(json) + '\n');
console.log(`${nlat} x ${nlon} cells at ${F}'; min ${elev.reduce((a, b) => Math.min(a, b))} m, max ${elev.reduce((a, b) => Math.max(a, b))} m; ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
