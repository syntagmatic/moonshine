// Build the data for essay 01 (Where the Earth Cracks Open):
//   shared/data/01-plates.json  PB2002 plate boundaries (Bird 2003) inside the catalog box
//   shared/data/01-gcmt.json    Global CMT focal mechanisms, 2000-2025, Mw >= 5.5, inside the box
//
//   node scripts/japan-01-plates.mjs [cacheDir]
//
// Nothing is fitted. Sources, all fetched here:
//   PB2002 steps  http://peterbird.name/oldFTP/PB2002/PB2002_steps.dat.txt  (Bird 2003, G-cubed 4(3):1027;
//                 one row per 1-degree boundary step: plate pair, endpoints, class SUB/OTF/OSR/...)
//   GCMT          https://www.ldeo.columbia.edu/~gcmt/projects/CMT/catalog/jan76_dec20.ndk plus
//                 NEW_MONTHLY/YYYY/mmmYY.ndk for 2021-2025 (Ekstrom, Nettles and Dziewonski 2012;
//                 Dziewonski, Chou and Woodhouse 1981). The page matches these to catalog events.
// The slab surface itself is in shared/data/slab2.json (scripts/japan-slab2.mjs).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, '..', 'docs', 'japan-earthquakes', 'shared', 'data');
const cache = process.argv[2] || path.join(os.tmpdir(), 'japan-01-cache');
fs.mkdirSync(cache, { recursive: true });
const BOX = [23.5, 46.5, 121.5, 150.5];           // lat0, lat1, lon0, lon1 (the catalog box)
const inBox = (lat, lon, pad = 0) => lat >= BOX[0] - pad && lat <= BOX[1] + pad && lon >= BOX[2] - pad && lon <= BOX[3] + pad;
const MIN_MW = 5.5, Y0 = 2000, Y1 = 2025;

async function get(url, name) {
  const f = path.join(cache, name);
  if (!fs.existsSync(f)) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  }
  const buf = fs.readFileSync(f);
  return { text: buf.toString('latin1'), sha: crypto.createHash('sha256').update(buf).digest('hex') };
}

// ---- PB2002 ---------------------------------------------------------------
const STEPS = 'http://peterbird.name/oldFTP/PB2002/PB2002_steps.dat.txt';
const steps = await get(STEPS, 'PB2002_steps.dat.txt');
const rows = [];
for (const line of steps.text.split('\n')) {
  const t = line.replace(/:/g, ' ').trim().split(/\s+/);
  if (t.length < 14) continue;
  const [, pair, lon1, lat1, lon2, lat2] = t;
  const cls = t[t.length - 1];
  const a = [+lat1, +lon1], b = [+lat2, +lon2];
  if (!inBox(a[0], a[1], 1.5) && !inBox(b[0], b[1], 1.5)) continue;
  rows.push({ pair, cls, a, b });
}
// chain consecutive steps with the same pair and class into polylines [lat, lon, ...]
const lines = [];
for (const r of rows) {
  const last = lines[lines.length - 1];
  const end = last && last.p.slice(-2);
  if (last && last.pair === r.pair && last.cls === r.cls && Math.abs(end[0] - r.a[0]) < 1e-3 && Math.abs(end[1] - r.a[1]) < 1e-3) last.p.push(r.b[0], r.b[1]);
  else lines.push({ pair: r.pair, cls: r.cls, p: [r.a[0], r.a[1], r.b[0], r.b[1]] });
}
for (const l of lines) l.p = l.p.map(v => Math.round(v * 1000) / 1000);
const plates = {
  box: BOX,
  source: { name: 'PB2002 (Bird 2003), steps file', url: STEPS, sha256: steps.sha, fetched: new Date().toISOString().slice(0, 10),
    note: 'pair is the two plate codes (PA Pacific, PS Philippine Sea, OK Okhotsk, AM Amur, YA Yangtze, EU Eurasia, ON Okinawa, MA Mariana, NA North America); cls is Bird\'s class (SUB subduction, OTF/CTF transform, CRB/CCB/OSR spreading, CTF, OCB...). p is [lat, lon, lat, lon, ...]' },
  lines
};
fs.writeFileSync(path.join(outDir, '01-plates.json'), JSON.stringify(plates));

// ---- GCMT -----------------------------------------------------------------
const BASE = 'https://www.ldeo.columbia.edu/~gcmt/projects/CMT/catalog/';
const files = [{ url: BASE + 'jan76_dec20.ndk', name: 'jan76_dec20.ndk' }];
const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
for (let y = 2021; y <= Y1; y++) for (const m of MON) files.push({ url: `${BASE}NEW_MONTHLY/${y}/${m}${String(y).slice(2)}.ndk`, name: `${m}${String(y).slice(2)}.ndk` });
const events = [], shas = {};
let nAll = 0;
for (const f of files) {
  const { text, sha } = await get(f.url, f.name);
  shas[f.name] = sha.slice(0, 16);
  const L = text.split('\n');
  for (let k = 0; k + 4 < L.length; k += 5) {
    const h = L[k], p = L[k + 4], e = L[k + 3];
    const date = h.slice(5, 15), tm = h.slice(16, 26).trim();
    const y = +date.slice(0, 4);
    if (!(y >= Y0 && y <= Y1)) continue;
    nAll++;
    const lat = +h.slice(27, 33), lon = +h.slice(34, 41), dep = +h.slice(42, 47);
    if (!inBox(lat, lon)) continue;
    const exp = +e.slice(0, 2);
    const q = p.slice(3).trim().split(/\s+/).map(Number);   // 9 eigen values, M0 mantissa, 6 plane angles
    const mant = q[9], planes = q.slice(10, 16);
    const mw = (2 / 3) * (Math.log10(mant) + exp) - 10.7;
    if (!(mw >= MIN_MW) || planes.length !== 6 || planes.some(Number.isNaN)) continue;
    const [Y, Mo, D] = date.split('/').map(Number), [hh, mm, ss] = tm.split(':').map(Number);
    const t = Date.UTC(Y, Mo - 1, D, hh, mm, 0) / 1000 + ss;
    events.push([t, lat, lon, dep, Math.round(mw * 100) / 100, ...planes]);
  }
}
events.sort((a, b) => a[0] - b[0]);
const gcmt = {
  fields: ['time_s_utc', 'lat', 'lon', 'depth_km', 'Mw', 'strike1', 'dip1', 'rake1', 'strike2', 'dip2', 'rake2'],
  box: BOX, minMw: MIN_MW, years: [Y0, Y1],
  source: { name: 'Global CMT catalog (Ekstrom et al. 2012)', url: BASE, files: files.length, fetched: new Date().toISOString().slice(0, 10), sha256_16: shas,
    note: 'time, lat, lon, depth are the PDE hypocentre on the first line of each NDK entry (what the catalog matches), not the centroid. Mw from the scalar moment.' },
  n: events.length, nScanned: nAll, events
};
fs.writeFileSync(path.join(outDir, '01-gcmt.json'), JSON.stringify(gcmt));
console.log(`plates: ${lines.length} polylines (${rows.length} steps); gcmt: ${events.length} of ${nAll} entries 2000-2025`);
