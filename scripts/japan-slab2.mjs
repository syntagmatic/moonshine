// Build docs/japan-earthquakes/shared/data/slab2.json for the shared Slab
// library (shared/slab.js): the USGS Slab2 subduction-zone model clipped to the
// catalog box, and the Smithsonian Holocene volcanoes, for essays 01 and 02.
//
//   node scripts/japan-slab2.mjs [cacheDir]
//
// Sources
//   Slab2 (Hayes et al. 2018, Science 362:58; data doi 10.5066/F7PV6JNV), the
//   ScienceBase regional items below. Each region publishes depth (dep),
//   uncertainty (unc), dip and strike grids at 0.05 degree as ASCII xyz. File
//   URLs contain content hashes, so they are resolved through the item JSON.
//     kur  Kamchatka-Kuril Islands-Japan  5aa4060de4b0b1c392eaaee2  (Pacific slab, Kuril to central Honshu)
//     izu  Izu-Bonin                      5aa3185ee4b0b1c392ea3f0d  (Pacific slab, Boso south to Mariana)
//     ryu  Ryukyu                         5aa40aafe4b0b1c392eaaefa  (Philippine Sea slab, Nankai to Taiwan)
//   The Manila (man) and Philippines (phi) regions have no nodes inside the box;
//   the script checks this and stops if that ever changes.
//   izu also publishes a supplement: the hypocentre and trench-sediment points
//   that define the overturned part of the Izu-Bonin slab, which a depth-only
//   grid cannot hold. It is thinned and stored as `supp`.
//   Smithsonian GVP Holocene volcanoes (Global Volcanism Program), WFS layer
//   GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes, bbox of the box.
//
// Output (raw UTF-8, compact):
//   box            [lat0, lat1, lon0, lon1] of the catalog box
//   slabs[name]    { lat0, lon0, step, nlat, nlon, dep, unc } on a 0.1 degree
//                  lattice, row-major from the south-west corner, cropped to
//                  the slab's own extent in the box. Every node is an original
//                  0.05 degree node. dep is depth in 0.1 km (integer), run-length
//                  coded: a negative entry -k stands for k nodes with no slab.
//                  unc lists the published uncertainty in whole km for the nodes
//                  that have a depth, in the same order (-1 if none).
//   supp           { cell, pts: [lat, lon, depth_km, ...] } thinned izu supplement
//   volcanoes      [{ n: name, la, lo, r: subregion index }], subregions[]
//   check          held-out original nodes and published dip / strike values,
//                  used by Slab.runChecks (the independent reference)
//   source         provenance, fetch date, file names and sha256 of each download
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'docs', 'japan-earthquakes', 'shared', 'data', 'slab2.json');
const cache = process.argv[2] || path.join(os.tmpdir(), 'japan-slab2-cache');
fs.mkdirSync(cache, { recursive: true });

const BOX = [23.5, 46.5, 121.5, 150.5];   // lat0, lat1, lon0, lon1 (the catalog box)
const ITEMS = {
  kur: { id: '5aa4060de4b0b1c392eaaee2', name: 'Kamchatka-Kuril Islands-Japan' },
  izu: { id: '5aa3185ee4b0b1c392ea3f0d', name: 'Izu-Bonin' },
  ryu: { id: '5aa40aafe4b0b1c392eaaefa', name: 'Ryukyu' }
};
const EXTRA_EMPTY = { man: '5aa4076fe4b0b1c392eaaee8', phi: '5aa40a33e4b0b1c392eaaef4' };
const VOLC_URL = 'https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature' +
  '&typeName=GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes&outputFormat=application%2Fjson&bbox=122,24,150,46';

async function itemFiles(id) {
  const r = await fetch(`https://www.sciencebase.gov/catalog/item/${id}?format=json`);
  if (!r.ok) throw new Error(`item ${id}: HTTP ${r.status}`);
  return (await r.json()).files;
}
const hashes = {};
async function getFile(files, re) {
  const f = files.find(x => re.test(x.name));
  if (!f) throw new Error('no file matching ' + re);
  const dest = path.join(cache, f.name);
  if (!fs.existsSync(dest) || fs.statSync(dest).size !== f.size) {
    const r = await fetch(f.url);
    if (!r.ok) throw new Error(`${f.name}: HTTP ${r.status}`);
    await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(dest));
  }
  hashes[f.name] = crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex');
  return dest;
}

// ASCII xyz "lon,lat,value" -> Map keyed by integer 0.05 degree indices
function readXyz(file, sign = 1) {
  const m = new Map();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [lo, la, z] = line.split(',');
    if (!z || z.startsWith('NaN')) continue;
    let lon = +lo; if (lon > 180) lon -= 360;
    const lat = +la;
    if (lat < BOX[0] || lat > BOX[1] || lon < BOX[2] || lon > BOX[3]) continue;
    m.set(Math.round(lon * 20) + ',' + Math.round(lat * 20), sign * +z);
  }
  return m;
}

const slabs = {}, check = { heldout: [], dip: [] };
const rng = (() => { let s = 20260101; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; })();
const files = {};
for (const [name, it] of Object.entries(ITEMS)) {
  const fl = await itemFiles(it.id);
  files[name] = fl;
  const dep = readXyz(await getFile(fl, new RegExp(`^${name}_slab2_dep_.*\\.xyz$`)), -1);   // depth positive down
  const unc = readXyz(await getFile(fl, new RegExp(`^${name}_slab2_unc_.*\\.xyz$`)));
  const dip = readXyz(await getFile(fl, new RegExp(`^${name}_slab2_dip_.*\\.xyz$`)));
  const str = readXyz(await getFile(fl, new RegExp(`^${name}_slab2_str_.*\\.xyz$`)));
  // the 0.1 degree lattice: nodes whose 0.05 indices are both even
  const keys = [...dep.keys()].map(k => k.split(',').map(Number));
  const lat = keys.filter(([x, y]) => x % 2 === 0 && y % 2 === 0);
  const ix = lat.map(k => k[0] / 2), iy = lat.map(k => k[1] / 2);
  const x0 = Math.min(...ix), x1 = Math.max(...ix), y0 = Math.min(...iy), y1 = Math.max(...iy);
  const nlon = x1 - x0 + 1, nlat = y1 - y0 + 1;
  const D = new Array(nlon * nlat).fill(-1), U = new Array(nlon * nlat).fill(-1);
  for (let j = 0; j < nlat; j++) for (let i = 0; i < nlon; i++) {
    const k = (2 * (x0 + i)) + ',' + (2 * (y0 + j));
    if (!dep.has(k)) continue;
    D[j * nlon + i] = Math.max(0, Math.round(dep.get(k) * 10));
    U[j * nlon + i] = unc.has(k) ? Math.max(0, Math.round(unc.get(k) * 10)) : -1;
  }
  const rle = [], uv = [];
  for (let n = 0; n < D.length; n++) {
    if (D[n] < 0) { if (rle.length && rle[rle.length - 1] < 0) rle[rle.length - 1]--; else rle.push(-1); }
    else { rle.push(D[n]); uv.push(U[n] < 0 ? -1 : Math.round(U[n] / 10)); }
  }
  slabs[name] = { lat0: +(y0 / 10).toFixed(1), lon0: +(x0 / 10).toFixed(1), step: 0.1, nlat, nlon, dep: rle, unc: uv };
  // held-out reference nodes: original 0.05 nodes OFF the 0.1 lattice, with all four
  // lattice corners of their cell present (so the bilinear sample exists)
  const off = keys.filter(([x, y]) => (x % 2 !== 0 || y % 2 !== 0));
  const cellOK = ([x, y]) => [[0, 0], [2, 0], [0, 2], [2, 2]].every(([a, b]) => dep.has((x - (x % 2 + 2) % 2 + a) + ',' + (y - (y % 2 + 2) % 2 + b)));
  const pool = off.filter(cellOK);
  for (let n = 0; n < 150 && pool.length; n++) {
    const [x, y] = pool.splice(Math.floor(rng() * pool.length), 1)[0];
    check.heldout.push([name, +(y / 20).toFixed(2), +(x / 20).toFixed(2), +dep.get(x + ',' + y).toFixed(2)]);
  }
  // published dip and strike at lattice nodes whose four neighbours (+-0.1) all exist
  const inner = lat.filter(([x, y]) => [[2, 0], [-2, 0], [0, 2], [0, -2]].every(([a, b]) => dep.has((x + a) + ',' + (y + b))) && dip.has(x + ',' + y) && str.has(x + ',' + y));
  for (let n = 0; n < 200 && inner.length; n++) {
    const [x, y] = inner.splice(Math.floor(rng() * inner.length), 1)[0];
    check.dip.push([name, +(y / 20).toFixed(2), +(x / 20).toFixed(2), +dip.get(x + ',' + y).toFixed(2), +str.get(x + ',' + y).toFixed(2)]);
  }
  console.log(name, 'nodes', lat.length, 'grid', nlon, 'x', nlat, 'max depth', Math.max(...D) / 10);
}

// the regions that should be empty in the box
for (const [name, id] of Object.entries(EXTRA_EMPTY)) {
  const fl = await itemFiles(id);
  const dep = readXyz(await getFile(fl, new RegExp(`^${name}_slab2_dep_.*\\.xyz$`)), -1);
  if (dep.size) throw new Error(`${name} has ${dep.size} nodes in the box; add it to ITEMS`);
}

// izu supplement: lon, lat, depth, strike?, thickness? Print the header so a change shows
const sup = fs.readFileSync(await getFile(files.izu, /^izu_slab2_sup_.*\.csv$/), 'utf8').trim().split('\n');
console.log('izu supplement header:', sup[0]);
const supCell = 0.2, supDz = 25, seen = new Map();
let supN = 0, supMax = 0;
for (const line of sup.slice(1)) {
  const c = line.split(',').map(Number);
  let [lon, lat, z] = c;
  if (lon > 180) lon -= 360;
  if (!(lat >= BOX[0] && lat <= BOX[1] && lon >= BOX[2] && lon <= BOX[3])) continue;
  z = Math.abs(z); supN++; supMax = Math.max(supMax, z);
  const k = Math.floor(lat / supCell) + ',' + Math.floor(lon / supCell) + ',' + Math.floor(z / supDz);
  if (!seen.has(k)) seen.set(k, [0, 0, 0, 0]);
  const a = seen.get(k); a[0] += lat; a[1] += lon; a[2] += z; a[3]++;
}
const pts = [];
for (const a of seen.values()) pts.push(+(a[0] / a[3]).toFixed(2), +(a[1] / a[3]).toFixed(2), Math.round(a[2] / a[3]));
console.log('supplement points in box', supN, '-> thinned', pts.length / 3);

// volcanoes
const gvp = await (await fetch(VOLC_URL)).json();
const subregions = [];
const volcanoes = gvp.features.map(f => {
  const p = f.properties, [lo, la] = f.geometry.coordinates;
  let r = subregions.indexOf(p.Subregion); if (r < 0) { r = subregions.length; subregions.push(p.Subregion); }
  return { n: p.Volcano_Name, la: +la.toFixed(3), lo: +lo.toFixed(3), r };
}).filter(v => v.la >= BOX[0] && v.la <= BOX[1] && v.lo >= BOX[2] && v.lo <= BOX[3]);

const json = {
  source: {
    slab2: 'USGS Slab2 (Hayes et al. 2018, Science 362:58), doi 10.5066/F7PV6JNV; ScienceBase parent item 5aa1b00ee4b0b1c392e86467. Regions: ' +
      Object.entries(ITEMS).map(([k, v]) => `${k} = ${v.name} (item ${v.id})`).join('; ') + '. Depth and uncertainty grids thinned from 0.05 to the 0.1 degree lattice and cropped to the catalog box; depth in 0.1 km.',
    volcanoes: 'Smithsonian Institution Global Volcanism Program, Holocene volcanoes, WFS GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes, bbox 122,24,150,46',
    fetched: new Date().toISOString().slice(0, 10),
    sha256: hashes,
    script: 'scripts/japan-slab2.mjs'
  },
  box: BOX,
  slabs,
  supp: { cell: [supCell, supDz], maxDepthKm: supMax, note: 'izu_slab2_sup: points of the overturned Izu-Bonin slab; one mean point per 0.2 degree by 25 km cell; [lat, lon, depth_km, ...]', pts },
  subregions,
  volcanoes,
  published: {
    note: 'Values quoted in the essay that cannot be computed from the grids. Carried over from the q-02 audit (temp/japan-audit/q02/pb.out for the rates, EarthByte for the ages); this script does not recompute them.',
    pacificAgeMa: { japanTrench: [133, 135], off02A: 133.5, off02D: 143, source: 'EarthByte 2020 seafloor age grid (age.2020.1.GTS2012.6m.nc), sampled seaward of each trench' },
    rateMmYr: { japanTrench: 88.9, speedRange: [91, 93], source: 'PB2002 Euler poles (Bird 2003, PB2002_poles.dat.txt), trench-normal rate PA\\OK at the Japan Trench; reproduces PB2002_steps.dat.txt speeds to 0.05 mm/yr' },
    nankaiAgeMa: { range: [17, 30], source: 'EarthByte 2020 age grid seaward of the Nankai Trough' },
    tohoku: { seafloorMoveM: 50, peakSlipM: [55, 69], source: 'Fujiwara et al. 2011 (seafloor displacement); published slip models, Part 6' },
    herp2025: { ssdBptPct: { lo: 60, hi: 90, orMore: true }, bptCase3Pct: [20, 50], source: 'HERP Earthquake Research Committee, 2025-09 Nankai Trough summary (jishin.go.jp/main/chousa/25sep_nankai/nankai_gaiyou2_3.pdf, p.3 and p.9): both values given side by side, neither preferred' }
  },
  check
};
fs.writeFileSync(out, JSON.stringify(json) + '\n');
console.log('wrote', out, (fs.statSync(out).size / 1024).toFixed(0), 'KB;', volcanoes.length, 'volcanoes');
