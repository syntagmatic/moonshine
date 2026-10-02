// Build docs/japan-earthquakes/shared/data/07-eew-jma.json for japan-earthquakes essay 07
// ("Earthquake Early Warning").
//
//   node scripts/japan-07-eew.mjs
//
// 1. JMA's travel-time table and velocity model, JMA2001 (tjma2001.zip, vjma2001.zip from
//    https://www.data.jma.go.jp/eqev/data/bulletin/catalog/appendix/trtime/), trimmed to
//    depth <= 700 km and distance <= 1500 km, times in 1/100 s.
// 2. JMA's public warning records, "緊急地震速報（警報）発表状況"
//    (https://www.data.jma.go.jp/eew/data/nc/pub_hist/): the index lists every public warning since
//    2008; each event page gives JMA's origin and hypocenter, the first P detection and every report
//    (time, hypocenter, M) with the ones that were warnings marked. The script joins them to the
//    catalog's M6.4+ quakes since the public service began (2007-10-01), within -120/+180 s of the
//    catalog origin (the page id is the first detection time).
// 3. The station grid the page and the fit both use: one station per ~20 km of land, built by
//    EEW.buildStations on a 0.05 degree land raster of shared/japan.topojson.
// 4. The processing delay: median over the records of (JMA's first warning report minus the model's
//    P arrival at the second-nearest station, from JMA's own hypocenter and the JMA2001 table), with
//    its quartiles. Events whose detection precedes their origin (Noto 2024: the warning was
//    triggered by an M5.9 that began 13 s earlier) are left out.
//
// Be polite: raw pages are cached under temp/japan-audit/q07/raw/ and fetched one at a time,
// 1.5 s apart, with a contact in the User-Agent. Re-running uses the cache.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shared = path.join(root, "docs/japan-earthquakes/shared");
const RAW = path.join(root, "temp/japan-audit/q07/raw");
fs.mkdirSync(path.join(RAW, "p"), { recursive: true });
const EEW = require(path.join(shared, "07-eew.js"));
const d3 = require(path.join(root, "docs/vendor/js/d3.v7.min.js"));
const topojson = require(path.join(root, "docs/vendor/js/topojson-client.min.js"));

const UA = "moonshine-research (kai.s.chang@gmail.com; one-off scrape of public JMA warning records)";
const PUB = "https://www.data.jma.go.jp/eew/data/nc/pub_hist";
const TRT = "https://www.data.jma.go.jp/eqev/data/bulletin/catalog/appendix/trtime";
let lastFetch = 0;
async function cached(file, url, binary) {
  if (fs.existsSync(file)) return fs.readFileSync(file, binary ? undefined : "utf8");
  const wait = lastFetch + 1500 - Date.now();
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  lastFetch = Date.now();
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(file, buf);
  return binary ? buf : buf.toString("utf8");
}

// ---- 1. JMA2001 ----
async function jma2001() {
  const unzip = async name => {
    await cached(path.join(RAW, name + ".zip"), `${TRT}/${name}.zip`, true);
    return execFileSync("unzip", ["-p", path.join(RAW, name + ".zip")], { maxBuffer: 1 << 26 }).toString("utf8");
  };
  const T = (await unzip("tjma2001")).trim().split("\n").map(l => l.trim().split(/\s+/));
  const hs = [...new Set(T.map(p => +p[4]))].sort((a, b) => a - b).filter(h => h <= 700);
  const ds = [...new Set(T.map(p => +p[5]))].sort((a, b) => a - b).filter(d => d <= 1500);
  const at = new Map(T.map(p => [p[4] + "," + p[5], [+p[1], +p[3]]]));
  const grid = k => hs.map(h => ds.map(d => Math.round(at.get(h + "," + d)[k] * 100)));
  const V = (await unzip("vjma2001")).trim().split("\n").map(l => l.trim().split(/\s+/).map(Number));
  return { tt: { scale: 100, depth: hs, dist: ds, P: grid(0), S: grid(1) },
    vmodel: { z: V.map(r => r[2]), vp: V.map(r => r[0]), vs: V.map(r => r[1]) } };
}

// ---- 2. JMA warning pages ----
const strip = h => h.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
function parseIndex(html) {
  const rows = [...html.matchAll(/<td>(\d{4})\/(\d\d)\/(\d\d) (\d\d):(\d\d)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td>(.*?)<\/tr>/gs)];
  return rows.map(m => {
    const links = [...m[9].matchAll(/href="\.\/(\d{4})\/(\d\d)\/(\d{14})\/([a-z]+)\/([a-z_]+\.html)"/g)];
    const l = links.find(x => x[4] === "content") || links[0];
    if (!l) return null;
    const id = l[3];
    const idJst = Date.UTC(+id.slice(0, 4), +id.slice(4, 6) - 1, +id.slice(6, 8), +id.slice(8, 10) - 9, +id.slice(10, 12), +id.slice(12, 14));
    return { id, idUTC: idJst, place: m[6], M: +m[7], shindo: m[8].trim(), path: `${l[1]}/${l[2]}/${id}/${l[4]}/${l[5]}` };
  }).filter(Boolean);
}
function parsePage(text, id) {
  const era = { 平成: 1988, 令和: 2018 };
  const origins = [...text.matchAll(/(平成|令和)\s*(\d+|元)年\s*(\d+)月\s*(\d+)日\s*(\d+)時\s*(\d+)分([\d.]+)秒\s+(\S+)\s+(\d+)°([\d.]+)′\s+(\d+)°([\d.]+)′\s+(\d+)km\s+(\S+)\s*(\S*)/g)].map(a => ({
    utc: Date.UTC(era[a[1]] + (a[2] === "元" ? 1 : +a[2]), +a[3] - 1, +a[4], +a[5] - 9, +a[6], 0) + Math.round(+a[7] * 1000),
    tod: +a[5] * 3600 + +a[6] * 60 + +a[7], place: a[8], lat: +a[9] + a[10] / 60, lon: +a[11] + a[12] / 60, D: +a[13], M: isNaN(+a[14]) ? null : +a[14], shindo: a[15] }));
  if (!origins.length) throw new Error(`${id}: no origin line (page format changed?)`);
  const o = origins[0];
  const sinceOrigin = (h, mi, s) => { let t = h * 3600 + mi * 60 + s - o.tod; if (t < -43200) t += 86400; return t; };
  const det = text.match(/検知時刻\s+(\d+)時(\d+)分([\d.]+)秒/);
  const gray = text.match(/背景が灰色\[\s*([^\]]*)\]/);
  if (!det || !gray) throw new Error(`${id}: no detection time or warning marker (page format changed?)`);
  const warnN = new Set([...gray[1].matchAll(/第(\d+)報/g)].map(m => +m[1]));
  const reports = [...text.matchAll(/ (\d+) (\d+)時(\d+)分([\d.]+)秒 ([\d.]+) ([\d.]+) ([\d.]+) (\d+)km ([\d.]+)/g)].map(a => ({
    n: +a[1], t: +sinceOrigin(+a[2], +a[3], +a[4]).toFixed(1), lat: +a[6], lon: +a[7], D: +a[8], M: +a[9], warn: warnN.has(+a[1]) }));
  if (!reports.length || !reports.some(r => r.warn)) throw new Error(`${id}: no warning report parsed`);
  const w = reports.filter(r => r.warn);
  return { id, originUTC: new Date(o.utc).toISOString(), place: o.place, lat: +o.lat.toFixed(3), lon: +o.lon.toFixed(3), D: o.D, M: o.M, shindo: o.shindo,
    nOrigins: origins.length, detect: +sinceOrigin(+det[1], +det[2], +det[3]).toFixed(1),
    warnN: w[0].n, warnT: w[0].t, warnM: w[0].M, wideT: w.length > 1 ? w[1].t : null, widerN: w.length > 1 ? w[1].n : null,
    complete: /content_out/.test(id) ? true : null, reports };
}

// ---- 3. land raster and stations (matches the page's canvas raster: 0.05 degree cells, land if half covered) ----
function landRaster(topo) {
  const STEP = 0.05, lon0 = 122.5, lat1 = 46.5, w = Math.round((154.5 - lon0) / STEP), h = Math.round((lat1 - 23.5) / STEP);
  const land = topojson.merge(topo, topo.objects.japan.geometries);
  const segs = []; let cur = null;
  const ctx = { beginPath() {}, moveTo(x, y) { cur = [x, y]; this.first = [x, y]; }, lineTo(x, y) { segs.push([cur[0], cur[1], x, y]); cur = [x, y]; },
    closePath() { if (cur && this.first) { segs.push([cur[0], cur[1], this.first[0], this.first[1]]); cur = this.first; } }, arc() {}, rect() {} };
  d3.geoPath(d3.geoEquirectangular().scale(180 / Math.PI / STEP).translate([-lon0 / STEP, lat1 / STEP]), ctx)(land);
  const SUB = 4, cov = new Uint8Array(w * h);
  for (let sy = 0; sy < h * SUB; sy++) {
    const y = (sy + 0.5) / SUB, xs = [];
    for (const [x0, y0, x1, y1] of segs) if ((y0 <= y) !== (y1 <= y)) xs.push(x0 + (y - y0) / (y1 - y0) * (x1 - x0));
    xs.sort((a, b) => a - b);
    const j = Math.floor(sy / SUB);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] * SUB - 0.5)), b = Math.min(w * SUB - 1, Math.ceil(xs[k + 1] * SUB - 0.5) - 1);
      for (let sx = a; sx <= b; sx++) cov[j * w + (sx >> 2)]++;
    }
  }
  const isCell = (i, j) => cov[j * w + i] >= SUB * SUB / 2;
  const cells = [];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (isCell(i, j)) cells.push({ lon: lon0 + (i + 0.5) * STEP, lat: lat1 - (j + 0.5) * STEP });
  const isLand = (lon, lat) => { const i = Math.floor((lon - lon0) / STEP), j = Math.floor((lat1 - lat) / STEP); return i >= 0 && j >= 0 && i < w && j < h && isCell(i, j); };
  return { isLand, cells };
}

// ---- main ----
const out = {};
const j2001 = await jma2001();
const topo = JSON.parse(fs.readFileSync(path.join(shared, "japan.topojson"), "utf8"));
const { isLand, cells } = landRaster(topo);
const stations = EEW.buildStations(isLand, cells, 20).map(s => [+s.lon.toFixed(3), +s.lat.toFixed(3)]);
console.log(`land cells ${cells.length}, stations ${stations.length}`);

const index = parseIndex(await cached(path.join(RAW, "index.html"), `${PUB}/index.html`));
console.log(`JMA index: ${index.length} events, ${new Date(Math.min(...index.map(e => e.idUTC))).toISOString().slice(0, 10)} to ${new Date(Math.max(...index.map(e => e.idUTC))).toISOString().slice(0, 10)}`);

// the page's range-plot rows: catalog M6.5+ that the model shakes at shindo 5-lower or more somewhere on land
function shakesLand(r) {
  const X5 = EEW.radius5(r.M, r.D), R5 = EEW.surfR(X5, r.D);
  if (!X5) return false;
  return cells.some(c => { const d = EEW.haversine(r.lat, r.lon, c.lat, c.lon); return d <= R5 && Math.hypot(d, r.D) <= X5; });
}
const cat = fs.readFileSync(path.join(shared, "data/earthquakes.csv"), "utf8").trim().split("\n").slice(1)
  .map(l => { const p = l.match(/^([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),/); return { time: p[1], utc: Date.parse(p[1]), lat: +p[2], lon: +p[3], D: +p[4], M: +p[5] }; })
  .filter(r => r.M >= 6.5 && r.time >= "2007-10-01" && shakesLand(r)).sort((a, b) => b.M - a.M);
const used = new Set(), events = [], noRecord = [];
for (const r of cat) {
  const cand = index.filter(e => !used.has(e.id) && e.idUTC - r.utc > -120e3 && e.idUTC - r.utc < 180e3 && Math.abs(e.M - r.M) <= 1.0)
    .sort((a, b) => Math.abs(a.idUTC - r.utc - 15e3) - Math.abs(b.idUTC - r.utc - 15e3));
  if (!cand.length) { noRecord.push({ time: r.time, M: r.M }); continue; }
  const e = cand[0]; used.add(e.id);
  const text = strip(await cached(path.join(RAW, "p", e.id + ".html"), `${PUB}/${e.path}`));
  const ev = parsePage(text, e.id);
  ev.complete = e.path.includes("/content/");
  ev.firstT = ev.complete ? ev.reports[0].t : null;
  ev.firstN = ev.complete ? ev.reports[0].n : null;
  ev.firstM = ev.complete ? ev.reports[0].M : null;
  ev.catalog = { time: r.time, M: r.M };
  ev.page = `${PUB}/${e.path}`;
  // keep the report list short: all reports up to the warning, then the last one
  const keep = ev.reports.filter((x, i) => i < 1 || x.n <= ev.warnN + 0 || i === ev.reports.length - 1 || x.warn);
  ev.reports = ev.complete ? ev.reports.map(x => ({ n: x.n, t: x.t, M: x.M, warn: x.warn })) : keep.map(x => ({ n: x.n, t: x.t, M: x.M, warn: x.warn }));
  events.push(ev);
}
events.sort((a, b) => a.originUTC < b.originUTC ? -1 : 1);
for (const e of events) console.log(e.catalog.time.slice(0, 10), "M" + e.catalog.M, e.place, e.id, `detect ${e.detect} first ${e.firstT} warn ${e.warnT} (report ${e.warnN}, M${e.warnM})`, e.nOrigins > 1 ? `origins ${e.nOrigins}` : "");
console.log("no JMA warning record:", noRecord.map(r => r.time.slice(0, 10) + " M" + r.M).join(", "));

EEW.init(j2001);
const fit = EEW.fitProc(events, stations.map(s => ({ lon: s[0], lat: s[1] })));
const r1 = v => +v.toFixed(2);
console.log(`fit: n ${fit.n}, proc median ${r1(fit.proc)} s, IQR ${r1(fit.q1)} to ${r1(fit.q3)}; first-report median ${r1(fit.procFirst)} (n ${fit.nFirst})`);
console.log("det - t1:", fit.rows.map(r => r.det.toFixed(1)).join(" "));
console.log("excluded (detection before origin):", events.filter(e => e.detect < 0).map(e => e.id).join(", "));

const doc = {
  source: {
    warnings: "Japan Meteorological Agency, 緊急地震速報（警報）発表状況, " + PUB + "/index.html and the per-event pages listed in each event's page field; JMA terms of use allow reuse with attribution",
    travelTimes: "JMA2001 travel-time table tjma2001 and velocity model vjma2001, " + TRT + "/",
    scraped: new Date().toISOString().slice(0, 10),
    publicStart: "2007-10-01",
    publicStartNote: "JMA began public early earthquake warnings on 2007-10-01 (JMA, 緊急地震速報について); the pub_hist list itself starts in 2008",
    gmpe: { name: "Si and Midorikawa (1999)", mwMax: 8.3, note: "upper end of the Mw range of the data behind the relation (lead: confirm against the paper)" },
    note: "Times in events are seconds after JMA's origin time (originUTC). detect = first P detection; reports lists every report on pages that give them (complete) and only the warning reports on pages from 2023 on."
  },
  fit: { proc: r1(fit.proc), q1: r1(fit.q1), q3: r1(fit.q3), n: fit.n, procFirst: r1(fit.procFirst), nFirst: fit.nFirst },
  noRecord,
  tt: j2001.tt, vmodel: j2001.vmodel, stations, events
};
const file = path.join(shared, "data/07-eew-jma.json");
const keys = Object.keys(doc);
fs.writeFileSync(file, "{\n" + keys.map(k => JSON.stringify(k) + ": " + JSON.stringify(doc[k])).join(",\n") + "\n}\n");
console.log(`wrote ${path.relative(root, file)} (${(fs.statSync(file).size / 1024).toFixed(0)} KB)`);
