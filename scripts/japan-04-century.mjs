// Build docs/japan-earthquakes/shared/data/04-century.json for japan-earthquakes essay 04.
//
//   node scripts/japan-04-century.mjs
//
// 1. The USGS FDSN catalog for 1900-1999, M6.5+, in the same box as the main catalog
//    (122-150E, 24-46N): the out-of-sample test of the Gutenberg-Richter fit. Earthquakes
//    only. Pre-1964 magnitudes mix sources (ISC-GEM Mw, mB/Ms, JMA mj); the magType is kept.
// 2. HERP's long-term evaluation summary (calculation date 2026-01-01), transcribed by hand
//    from https://www.jishin.go.jp/main/choukihyoka/ichiran.pdf. No API exists; the script
//    downloads the PDF, checks its sha256 against the copy that was read, and checks that
//    each transcribed string appears on the stated PDF page (needs `pypdf`, else skipped).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'docs/japan-earthquakes/shared/data/04-century.json');
const URL_USGS = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1900-01-01&endtime=2000-01-01' +
  '&minlatitude=24&maxlatitude=46&minlongitude=122&maxlongitude=150&minmagnitude=6.5&orderby=time-asc';
const URL_HERP = 'https://www.jishin.go.jp/main/choukihyoka/ichiran.pdf';
const HERP_SHA = 'df8f77cdc487f761c8884c356cba72f321ea43e9ba644b59ee348cc3562c4b3e';

function parseCSV(text) {
  const L = text.trim().split('\n'), h = L[0].split(',');
  return L.slice(1).map(l => {
    const c = []; let cur = '', q = false;
    for (const ch of l) { if (ch === '"') { q = !q; continue; } if (ch === ',' && !q) { c.push(cur); cur = ''; continue; } cur += ch; }
    c.push(cur); const o = {}; h.forEach((k, i) => o[k] = c[i]); return o;
  });
}
const fam = t => { t = (t || '').toLowerCase(); return t.startsWith('mw') ? 'Mw' : t; };

const csv = await (await fetch(URL_USGS)).text();
const events = parseCSV(csv).filter(d => d.type === 'earthquake').map(d => [
  +d.time.slice(0, 4), Math.round(+d.mag * 10) / 10, fam(d.magType), +(+d.latitude).toFixed(2), +(+d.longitude).toFixed(2), d.net
]);
console.log('century events', events.length);

// HERP, 2026-01-01 summary. Page numbers are PDF pages.
const herp = {
  doc: { title: '長期評価の概要 (海溝型地震の今後10, 30, 50年以内の地震発生確率), 算定基準日 令和8年(2026年)1月1日',
    en: 'HERP, summary of long-term evaluations, subduction-zone earthquakes, calculation date 1 January 2026',
    url: URL_HERP, pages: 36, sha256: HERP_SHA },
  rows: [
    { key: 'chishima', ja: '千島海溝沿いの地震(第三版) 超巨大地震(17世紀型)', en: 'Kuril Trench super-giant (17th-century type)',
      page: 34, M: '8.8程度以上', Mmin: 8.8, intervalYr: [340, 380], model: 'BPT', p30: [7, 40], p10: [2, 10],
      note: 'interval from tsunami deposits (note 4, p. 36)' },
    { key: 'japan_trench', ja: '日本海溝沿いの地震 超巨大地震(東北地方太平洋沖型)', en: 'Japan Trench super-giant (Tohoku-oki type)',
      page: 34, M: '9.0程度', Mmin: 9.0, intervalYr: [550, 600], model: 'renewal', p30: [0, 0], p30text: 'ほぼ0%',
      note: 'mean interval 550-600 yr from tsunami deposits; latest 14.8 yr before the calculation date' },
    { key: 'sagami', ja: '相模トラフ沿いの地震(第二版) M8クラスの地震', en: 'Sagami Trough M8 class',
      page: 35, M: '8クラス (7.9-8.6)', Mmin: 8.0, intervalYr: [180, 590], model: 'BPT', p30: [0, 6], p30text: 'ほぼ0%-6%',
      note: 'intervals vary over 180-590 yr about means of 320 and 390 yr (note 7, p. 36)' },
    { key: 'tohoku_before', ja: '(参考) 平成23年(2011年)東北地方太平洋沖地震発生直前における確率', en: 'Reference: probability just before the 2011 Tohoku-oki earthquake',
      page: 36, M: '9.0', Mmin: 9.0, p10: [4, 6], p30: [10, 20], p50: [20, 30] }
  ],
  checks: [ [34, '8.8程度以上'], [34, '約340年-380年'], [34, '550年-600年程度'], [34, '9.0程度'], [35, '180-590年'], [36, '東北地方太平洋沖地震 9.0 4%～6% 10%～20% 20%～30%'] ]
};

// verify the transcription against the PDF text when pypdf is available
try {
  const pdf = Buffer.from(await (await fetch(URL_HERP)).arrayBuffer());
  const sha = crypto.createHash('sha256').update(pdf).digest('hex');
  if (sha !== HERP_SHA) console.warn('WARNING: HERP PDF sha256 changed', sha);
  const tmp = path.join(process.env.TMPDIR || '/tmp', 'ichiran-04.pdf'); fs.writeFileSync(tmp, pdf);
  const py = `import pypdf,sys,json\nr=pypdf.PdfReader(sys.argv[1])\nprint(json.dumps({i+1:p.extract_text() for i,p in enumerate(r.pages) if i+1 in (34,35,36)}))`;
  const pages = JSON.parse(execFileSync('python3', ['-c', py, tmp], { maxBuffer: 1 << 26 }).toString());
  for (const [pg, s] of herp.checks) if (!pages[pg].replace(/\s/g, '').includes(s.replace(/\s/g, ''))) console.warn('NOT FOUND on p.' + pg + ':', s);
  console.log('HERP transcription checked against PDF text');
} catch (e) { console.warn('HERP PDF check skipped:', String(e).slice(0, 120)); }

const out = { source: 'USGS FDSN event API (1900-1999, M6.5+, 122-150E 24-46N); HERP ichiran.pdf for every other value',
  fetched: new Date().toISOString().slice(0, 10), usgsUrl: URL_USGS,
  columns: ['year', 'mag', 'magType', 'lat', 'lon', 'net'], events, herp };
fs.writeFileSync(OUT, JSON.stringify(out) + '\n');
console.log('wrote', OUT, fs.statSync(OUT).size, 'bytes');
