// Build docs/japan-earthquakes/shared/data/06-tsunami-arrivals.json for
// japan-earthquakes essay 06 (tsunami propagation): first-arrival travel times
// of the 2011 Tohoku tsunami at every tide gauge and DART buoy in the NOAA
// NCEI Global Historical Tsunami Database (tsunami event 5413).
//
//   node scripts/japan-tsunami-arrivals.mjs
//
// Source: NOAA National Centers for Environmental Information, Global
// Historical Tsunami Database, runup records for event 5413, fetched from
//   https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/tsunamis/runups?tsunamiEventId=5413
// Kept: records with typeMeasurementId 2 (tide gauge) or 3 (deep-ocean gauge,
// i.e. DART bottom-pressure recorder) that carry a travel time and a position.
// Exact duplicates (same name, position and time) are dropped.
//
// Per row: n name as NCEI spells it, c country, lat, lon, km great-circle
// distance from the epicentre used on the page (38.3 N, 142.4 E; sphere of
// radius 6371 km), h travel time in hours (travHours + travMins / 60),
// t "dart" or "tide", a maximum wave amplitude in metres (runupHt; may be null).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/tsunamis/runups';
const EVENT = 5413;
const EPI = [38.3, 142.4];
const R = 6371;
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'docs', 'japan-earthquakes', 'shared', 'data', '06-tsunami-arrivals.json');

function gcKm(lat, lon) {
  const r = Math.PI / 180, p1 = EPI[0] * r, p2 = lat * r, dl = (lon - EPI[1]) * r, dp = p2 - p1;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const items = [];
for (let page = 1; ; page++) {
  const res = await fetch(`${API}?tsunamiEventId=${EVENT}&page=${page}&itemsPerPage=200`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on page ${page}`);
  const d = await res.json();
  items.push(...d.items);
  if (page >= (d.totalPages || 1)) break;
}

const seen = new Set(), rows = [];
for (const r of items) {
  const t = r.typeMeasurementId;
  if (t !== 2 && t !== 3) continue;
  if (r.travHours == null || r.latitude == null || r.longitude == null) continue;
  const h = r.travHours + (r.travMins || 0) / 60;
  const key = [r.locationName, r.latitude, r.longitude, h].join('|');
  if (seen.has(key)) continue;
  seen.add(key);
  rows.push({
    n: r.locationName, c: r.country,
    lat: r.latitude, lon: r.longitude,
    km: Math.round(gcKm(r.latitude, r.longitude)),
    h: Math.round(h * 10000) / 10000,
    t: t === 3 ? 'dart' : 'tide',
    a: r.runupHt ?? null,
  });
}
rows.sort((a, b) => a.km - b.km);

const doc = {
  source: 'NOAA NCEI Global Historical Tsunami Database, tsunami event 5413 (2011 Tohoku), runup records of type 2 (tide gauge) and 3 (deep-ocean gauge, DART)',
  url: `${API}?tsunamiEventId=${EVENT}`,
  fetched: new Date().toISOString().slice(0, 10),
  epicentre: { lat: EPI[0], lon: EPI[1] },
  fields: 'n name, c country, lat, lon, km great-circle distance from the epicentre, h first-arrival travel time (hours), t dart|tide, a maximum amplitude (m)',
  rows,
};
fs.writeFileSync(out, JSON.stringify(doc, null, 0).replace(/\},\{/g, '},\n{') + '\n');
const nD = rows.filter(r => r.t === 'dart').length;
console.log(`${items.length} records, kept ${rows.length} (${nD} DART, ${rows.length - nD} tide gauges) -> ${path.relative(process.cwd(), out)}`);
