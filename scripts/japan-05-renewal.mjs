// Build docs/japan-earthquakes/shared/data/05-renewal.json for japan-earthquakes
// essay 05: the event sequences and published numbers behind shared/05-renewal.js.
//
//   node scripts/japan-05-renewal.mjs
//
// Two kinds of value, kept apart:
//
//   NOAA dates (computed here). Each Nankai Trough earthquake in HERP's list is
//   one or two NOAA Significant Earthquake records (the Tokai and Nankai halves
//   of 1096/1099, 1854 and 1944/1946 are split). The ids below are read from
//   shared/data/05-history.json, which scripts/japan-05-history.mjs fetched from
//   the NOAA NCEI hazard API; the event time is the mean of the records' decimal
//   years. The script checks that this reproduces HERP's own decimal years to
//   0.1 yr, so the "one source" rule holds and the NOAA dates are cross-checked.
//
//   HERP values (transcribed, with document and page). No API exists for them:
//   they are in the two PDFs below, which this script downloads to check their
//   sha256 against the copy that was read. Page numbers are PDF page numbers and
//   were confirmed against each PDF's extracted text. Values:
//     - the 2025 summary (pp. 2, 3, 4, 7, 9): the 30-year probabilities with their
//       dates, the BPT inputs, the five event cases, and the Murotsu harbour
//       uplifts (mean and standard deviation);
//     - the 2019 Japan Trench evaluation (pp. 4, 5, 9, 27): the five deposit events,
//       mean interval about 550 to 600 yr, alpha 0.2 to 0.3, probability "ほぼ0%".
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'docs/japan-earthquakes/shared/data');
const hist = JSON.parse(fs.readFileSync(path.join(DATA, '05-history.json'), 'utf8'));
const byId = new Map(hist.records.map(r => [r.id, r]));

const leap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const CUM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const decimalYear = (y, m, d) => y + (CUM[m - 1] + (m > 2 && leap(y) ? 1 : 0) + d - 1) / (leap(y) ? 366 : 365);

const DOCS = {
  herp2025: {
    title: '南海トラフの地震活動の長期評価（第二版一部改訂）について 概要資料',
    en: 'HERP, Long-term evaluation of seismic activity of the Nankai Trough (second edition, partial revision), summary, 26 Sep 2025',
    url: 'https://www.jishin.go.jp/main/chousa/25sep_nankai/nankai_gaiyou2_3.pdf',
    pages: 10, sha256: 'e63c65ac9d884f0e29d930506d6c5ae59ed4575dfeb9851cab1fb1cd67f843ad'
  },
  herp2019: {
    title: '日本海溝沿いの地震活動の長期評価（令和元年改訂）',
    en: 'HERP, Long-term evaluation of seismic activity along the Japan Trench, 2019',
    url: 'https://www.jishin.go.jp/main/chousa/kaikou_pdf/japan_trench.pdf',
    pages: 144, sha256: '89dc82c55c7541e0bcd65da7cd3de033544bd1408d018160ee6765ea209d7ce1'
  }
};

// HERP 2025 summary p.7: the nine earthquakes, with HERP's decimal years and the NOAA ids
const NANKAI = [
  { name: 'Hakuho', ja: '白鳳', ids: [162], herp: 684.9 },
  { name: 'Ninna', ja: '仁和', ids: [262], herp: 887.7 },
  { name: 'Kowa-Eicho', ja: '康和・永長', ids: [375, 7381], herp: 1098.1 },
  { name: 'Shohei', ja: '正平', ids: [556], herp: 1361.6 },
  { name: 'Meio', ja: '明応', ids: [7383], herp: 1498.7 },
  { name: 'Keicho', ja: '慶長', ids: [833], herp: 1605.1 },
  { name: 'Hoei', ja: '宝永', ids: [1178], herp: 1707.8 },
  { name: 'Ansei', ja: '安政', ids: [1969, 1971], herp: 1855.0 },
  { name: 'Showa', ja: '昭和', ids: [3791, 3845], herp: 1946.0 }
];
const events = NANKAI.map(e => {
  const rs = e.ids.map(id => { const r = byId.get(id); if (!r) throw new Error('NOAA id ' + id + ' missing'); return r; });
  const ts = rs.map(r => decimalYear(r.year, r.month, r.day));
  const t = ts.reduce((a, b) => a + b, 0) / ts.length;
  if (Math.abs(t - e.herp) > 0.1) throw new Error(e.name + ': NOAA ' + t.toFixed(2) + ' vs HERP ' + e.herp);
  return {
    name: e.name, ja: e.ja, ids: e.ids,
    noaa: rs.map(r => r.year + '-' + String(r.month).padStart(2, '0') + '-' + String(r.day).padStart(2, '0')),
    t: +t.toFixed(2), herp: e.herp
  };
});

const trenchRec = id => { const r = byId.get(id); return +decimalYear(r.year, r.month, r.day).toFixed(2); };
const trench = {
  alpha: [0.2, 0.3],
  events: [
    { key: 'bce4', name: 'c. 4th-3rd century BCE', ja: '紀元前4～3世紀頃', from: -400, to: -201, deposit: true },
    { key: 'ce4', name: 'c. 4th-5th century', ja: '4～5世紀頃', from: 301, to: 500, deposit: true },
    { key: 'jogan', name: 'Jogan', ja: '貞観', id: 247, t: trenchRec(247) },
    { key: 'kyotoku', name: 'Kyotoku (1454)', ja: '享徳', t: 1454.5, noNoaa: true, note: 'year only; NOAA has no record' },
    { key: 'keicho', name: 'Keicho-Sanriku', ja: '慶長三陸', id: 856, t: trenchRec(856) },
    { key: 'tohoku', name: 'Tohoku', ja: '東北地方太平洋沖', id: 9799, t: trenchRec(9799) }
  ],
  jogan: { mw: [8.3, 8.6], orMore: true, doc: 'herp2019', pages: [5, 9], text: '貞観地震：規模はMw8.3～8.6もしくはそれ以上（東北地方太平洋沖地震はM9.0、貞観など以前の地震は「やや小さい」）' },
  spanYears: { years: 3000, doc: 'herp2019', pages: [4, 9], text: '津波堆積物調査によると、超巨大地震（東北地方太平洋沖型）は過去3,000年間に5回' },
  herp2019: { doc: 'herp2019', last: trenchRec(9799), muYears: [550, 600], alpha: [0.2, 0.3], evalDate: 2019.0, p30: 0, p30Text: 'ほぼ0%', pages: [9, 27] }
};

const doc25 = 'herp2025';
const out = {
  source: 'NOAA NCEI Significant Earthquake Database (via shared/data/05-history.json) for dates; HERP PDFs for every other value',
  fetched: new Date().toISOString().slice(0, 10),
  docs: DOCS,
  nankai: {
    events,
    cases: { I: [0, 1, 2, 3, 4, 5, 6, 7, 8], II: [0, 1, 2, 3, 4, 6, 7, 8], III: [3, 4, 5, 6, 7, 8], IV: [3, 4, 6, 7, 8], V: [6, 7, 8] },
    casesDoc: { doc: doc25, page: 7 },
    uplift: [
      { event: 6, mean: 1.83, sd: 0.51 }, { event: 7, mean: 1.13, sd: 0.52 }, { event: 8, mean: 1.02, sd: 0.06 }
    ],
    upliftDoc: { doc: doc25, page: 4, site: 'Murotsu harbour', from: 'Hashimoto et al. 2024' },
    tp: { mu: 88.2, alpha: [0.20, 0.24], doc: doc25, page: 3 }
  },
  // HERP's published 30-year probabilities for an earthquake of M8 to M9 on the Nankai Trough, in percent.
  // date: evaluation date as a decimal year (January 1 of the year given). openEnd: HERP writes "or more".
  herp: [
    { id: 'tp2013', model: 'tp', date: 2013.0, lo: 60, hi: 70, doc: doc25, pages: [2, 9], text: '60%～70%（2013年1月時点）' },
    { id: 'tp2014', model: 'tp', date: 2014.0, lo: 70, hi: 70, doc: doc25, pages: [9], text: '70％程度（2014）' },
    { id: 'tp2018', model: 'tp', date: 2018.0, lo: 70, hi: 80, doc: doc25, pages: [9], text: '70%～80%（2018）' },
    { id: 'tp2025', model: 'tp', date: 2025.0, lo: 80, hi: 80, doc: doc25, pages: [2, 9], text: '80%程度（2025年1月時点）' },
    { id: 'bpt2013', model: 'bpt', cases: ['III', 'IV', 'V'], date: 2013.0, lo: 10, hi: 30, doc: doc25, pages: [2, 3], text: 'BPTモデル（ケースⅢ～Ⅴ）10%～30%（2013年1月時点）' },
    { id: 'ssd2025', model: 'ssd', date: 2025.0, lo: 60, hi: 90, openEnd: true, ci: 70, doc: doc25, pages: [3, 10], text: 'すべり量依存BPTモデル 60%～90%程度以上（70%信用区間）；94.5%以上は「90%程度以上」と表現' },
    { id: 'bpt2025', model: 'bpt', cases: ['III'], date: 2025.0, lo: 20, hi: 50, ci: 70, doc: doc25, pages: [3, 10], text: 'BPTモデル（ケースⅢ）20%～50%（70%信用区間）' }
  ],
  rank3: { pct: 26, doc: doc25, page: 3, text: '30年以内の発生確率26％以上は最も高い「Ⅲランク」（海溝型地震）' },
  trench
};

// Check the PDFs are the ones the page numbers were confirmed against
for (const [k, d] of Object.entries(DOCS)) {
  try {
    const res = await fetch(d.url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const sha = crypto.createHash('sha256').update(Buffer.from(await res.arrayBuffer())).digest('hex');
    if (sha !== d.sha256) console.warn(`WARNING ${k}: sha256 is now ${sha}, the values were read from ${d.sha256}`);
    else console.log(`${k}: sha256 matches`);
  } catch (e) { console.warn(`WARNING ${k}: could not fetch to check (${e.message})`); }
}

// One record per line, raw UTF-8
const lines = JSON.stringify(out, null, 1).replace(/\n\s{2,}/g, ' ').replace(/\n\s*([\]}])/g, ' $1');
fs.writeFileSync(path.join(DATA, '05-renewal.json'), lines + '\n');
console.log('wrote 05-renewal.json', lines.length, 'bytes;', events.map(e => e.t).join(' '));
