// Build docs/japan-earthquakes/shared/data/05-history.json for japan-earthquakes
// essay 05 (Thirteen Centuries of Earthquakes) from the NOAA NCEI hazard API.
//
//   node scripts/japan-05-history.mjs
//
// One source for every value: NOAA NCEI's Significant Earthquake Database
// (every record with country JAPAN) and its Tsunami Event Database (for the
// tsunami linked to each earthquake record).
//
// The output holds every Japan earthquake record, slimmed to the fields the
// page uses, and marks the ones the page's timeline, scatter and map show.
// The selection rule, applied here and nowhere else:
//
//   1. An earthquake record is shown when NOAA puts its toll above 100 deaths:
//      its total death count is over 100, or, when it gives no count, its
//      death band is 101-1,000 or over 1,000. Where the earthquake record has
//      no count, the count of its linked tsunami record is used (869 Jogan).
//   2. Records dated to the same day that both pass rule 1 are one earthquake
//      that NOAA splits by region (1605, 1707); the record with the larger toll
//      stands for it.
//
// The record-completeness figure uses every record, selected or not.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), '..',
  'docs/japan-earthquakes/shared/data/05-history.json');

async function getAll(kind) {
  const items = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${API}/${kind}?country=JAPAN&itemsPerPage=200&page=${page}`);
    if (!res.ok) throw new Error(`${kind} page ${page}: HTTP ${res.status}`);
    const j = await res.json();
    items.push(...j.items);
    if (page >= j.totalPages) {
      if (items.length !== j.totalItems) throw new Error(`${kind}: got ${items.length} of ${j.totalItems}`);
      return items;
    }
  }
}

const eqs = await getAll('earthquakes');
const tsus = await getAll('tsunamis/events');
const tsuById = new Map(tsus.map(t => [t.id, t]));
// A linked tsunami outside the Japan list is fetched on its own
for (const e of eqs) {
  if (e.tsunamiEventId && !tsuById.has(e.tsunamiEventId)) {
    const res = await fetch(`${API}/tsunamis/events/${e.tsunamiEventId}`);
    if (res.ok) tsuById.set(e.tsunamiEventId, await res.json());
  }
}

const count = r => r.deathsTotal ?? r.deaths ?? null;
const band = r => r.deathsAmountOrderTotal ?? r.deathsAmountOrder ?? null;
const clean = s => s.replace(/\s+/g, ' ').trim();

const records = eqs.map(e => {
  const t = e.tsunamiEventId ? tsuById.get(e.tsunamiEventId) : null;
  let dead = count(e), deadFrom;
  if (dead == null && t && count(t) != null) { dead = count(t); deadFrom = 'tsunami'; }
  const r = {
    id: e.id, year: e.year, month: e.month ?? null, day: e.day ?? null,
    loc: clean(e.locationName),
    lat: e.latitude ?? null, lon: e.longitude ?? null,
    mag: e.eqMagnitude ?? null,
    dead, deadBand: band(e),
    dmgBand: e.damageAmountOrderTotal ?? e.damageAmountOrder ?? null,
  };
  if (deadFrom) r.deadFrom = deadFrom;
  if (t) r.tsu = { id: t.id, validity: t.eventValidity ?? null, maxH: t.maxWaterHeight ?? null };
  if (e.volcanoEventId) r.volcano = e.volcanoEventId;
  return r;
});

// Rule 1
const passes = r => r.dead != null ? r.dead > 100 : (r.deadBand ?? 0) >= 3;
// Rule 2: same-day records that both pass
const byDay = new Map();
for (const r of records) {
  if (!passes(r)) continue;
  if (r.month == null || r.day == null) { r.sel = true; continue; }
  const k = `${r.year}-${r.month}-${r.day}`;
  if (!byDay.has(k)) byDay.set(k, []);
  byDay.get(k).push(r);
}
const tollRank = r => r.dead ?? (r.deadBand >= 4 ? 1001 : 101);
for (const group of byDay.values()) {
  group.sort((a, b) => tollRank(b) - tollRank(a));
  group[0].sel = true;
  if (group.length > 1) group[0].alsoIds = group.slice(1).map(r => r.id);
  for (const r of group.slice(1)) r.sameAs = group[0].id;
}

records.sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0) || (a.day ?? 0) - (b.day ?? 0) || a.id - b.id);

const out = {
  source: 'NOAA NCEI Significant Earthquake Database and Tsunami Event Database, hazard API ' + API,
  fetched: new Date().toISOString().slice(0, 10),
  rule: 'shown (sel): NOAA puts the toll above 100 deaths (count > 100, or, with no count, death band 3 or 4); same-day records that both pass are one earthquake, shown by the one with the larger toll',
  records,
};
fs.writeFileSync(OUT, '{\n' +
  Object.entries(out).filter(([k]) => k !== 'records').map(([k, v]) => `"${k}": ${JSON.stringify(v)},\n`).join('') +
  '"records": [\n' + records.map(r => JSON.stringify(r)).join(',\n') + '\n]\n}\n');

// ---- Verification log (numbers the page's prose relies on) ----
const sel = records.filter(r => r.sel);
console.log(`records ${records.length}, tsunami events ${tsuById.size}, shown ${sel.length}`);
console.log(`shown with a count ${sel.filter(r => r.dead != null).length}, band only ${sel.filter(r => r.dead == null).length}, no magnitude ${sel.filter(r => r.mag == null).length}`);
console.log('merged:', records.filter(r => r.alsoIds).map(r => `${r.year} ${r.id}+${r.alsoIds}`).join('; '));
function spearman(a, b) {
  const rank = v => {
    const idx = v.map((_, i) => i).sort((i, j) => v[i] - v[j]), r = new Array(v.length);
    for (let i = 0; i < idx.length;) {
      let j = i;
      while (j + 1 < idx.length && v[idx[j + 1]] === v[idx[i]]) j++;
      for (let q = i; q <= j; q++) r[idx[q]] = (i + j) / 2;
      i = j + 1;
    }
    return r;
  };
  const ra = rank(a), rb = rank(b), m = x => x.reduce((s, y) => s + y, 0) / x.length;
  const ma = m(ra), mb = m(rb);
  let n = 0, da = 0, db = 0;
  ra.forEach((x, i) => { n += (x - ma) * (rb[i] - mb); da += (x - ma) ** 2; db += (rb[i] - mb) ** 2; });
  return n / Math.sqrt(da * db);
}
const md = sel.filter(r => r.mag != null && r.dead != null);
console.log(`spearman shown (mag and count): n=${md.length} rho=${spearman(md.map(r => r.mag), md.map(r => r.dead)).toFixed(3)}`);
const all10 = records.filter(r => r.mag != null && r.dead >= 10);
console.log(`spearman all records with mag and >=10 deaths: n=${all10.length} rho=${spearman(all10.map(r => r.mag), all10.map(r => r.dead)).toFixed(3)}`);
const all10u = all10.filter(r => !r.sameAs);
console.log(`  same, one record per earthquake (the page's scatter): n=${all10u.length} rho=${spearman(all10u.map(r => r.mag), all10u.map(r => r.dead)).toFixed(3)}`);
for (const thr of [7, 8]) {
  const rate = records.filter(r => r.year >= 1900 && r.year <= 1999 && r.mag >= thr).length / 100;
  const pre = records.filter(r => r.year < 1600 && r.mag >= thr).length;
  console.log(`M${thr}+: 1900-1999 rate ${rate}/yr; before 1600 recorded ${pre}, expected ${(rate * (1600 - 684)).toFixed(1)} (684-1599)`);
}
const sk = records.filter(r => r.mag >= 8 && r.lat >= 37.5 && r.lat <= 41 && r.lon >= 141.5 && r.lon <= 146);
console.log('Sanriku box M8+:', sk.map(r => r.year).join(', '));
