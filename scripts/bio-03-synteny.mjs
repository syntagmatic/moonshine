// Build docs/bioinformatics/shared/data/essay-03.json for essay 03 (Circos Plot):
// the human-mouse synteny blocks of Figure 4, genome-wide.
//
//   node scripts/bio-03-synteny.mjs [--refresh]
//
// Source: UCSC hg38 netMm39, the alignment net of GRCm39 (mouse) onto GRCh38 (human),
// as the database table dump hgdownload.soe.ucsc.edu/goldenPath/hg38/database/netMm39.txt.gz
// (the same rows the UCSC API serves for track netMm39), plus hg38 and mm39 chrom.sizes.
// Raw downloads are cached under temp/bio-audit/g03-raw/ (not in the repo); a rerun reuses
// them and rebuilds the same JSON.
//
// A block is a level-1 (top-level) fill of the net on human chr1-22 or X whose human span
// (tEnd - tStart) is at least 3 Mb. Level-1 fills are the best-scoring chains laid down
// first; the gaps inside them hold the lower levels, so a block spans sequence that it
// does not all align. Positions are written in Mb rounded to 0.1, chrom.sizes to 0.001 Mb.
// Strand "-" means the mouse coordinate falls as the human coordinate rises. qStart/qEnd
// in the table are forward-strand mouse coordinates.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const OUT = path.join(root, 'docs/bioinformatics/shared/data/essay-03.json');
const CACHE = path.join(root, 'temp/bio-audit/g03-raw');
const REFRESH = process.argv.includes('--refresh');
fs.mkdirSync(CACHE, { recursive: true });

const BASE = 'https://hgdownload.soe.ucsc.edu/goldenPath';
const SRC = {
  net: `${BASE}/hg38/database/netMm39.txt.gz`,
  hg38: `${BASE}/hg38/bigZips/hg38.chrom.sizes`,
  mm39: `${BASE}/mm39/bigZips/mm39.chrom.sizes`
};
const MIN_SPAN = 3e6;
const HUMAN = [...Array.from({ length: 22 }, (_, i) => String(i + 1)), 'X'];

async function get(key) {
  const file = path.join(CACHE, path.basename(SRC[key]));
  if (REFRESH || !fs.existsSync(file)) {
    // Anonymous download: no identifying header of any kind.
    const r = await fetch(SRC[key]);
    if (!r.ok) throw new Error(`${SRC[key]}: HTTP ${r.status}`);
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    console.log('fetched', SRC[key]);
  }
  return file;
}

function sizes(file) {
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [name, len] = line.split('\t');
    if (name && /^chr([0-9]+|X|Y)$/.test(name)) out[name.slice(3)] = +(Number(len) / 1e6).toFixed(3);
  }
  return out;
}

const netFile = await get('net'), hgFile = await get('hg38'), mmFile = await get('mm39');
const hs = sizes(hgFile), ms = sizes(mmFile);

// Columns (netMm39.sql): bin level tName tStart tEnd strand qName qStart qEnd chainId ali score ... type ...
const rows = [];
let level1 = 0, skippedQ = 0;
const rl = readline.createInterface({ input: fs.createReadStream(netFile).pipe(zlib.createGunzip()), crlfDelay: Infinity });
for await (const line of rl) {
  const f = line.split('\t');
  if (f[1] !== '1') continue;
  const h = f[2].replace(/^chr/, '');
  if (!HUMAN.includes(h)) continue;
  level1++;
  const tStart = +f[3], tEnd = +f[4];
  if (tEnd - tStart < MIN_SPAN) continue;
  const m = f[6].replace(/^chr/, '');
  if (!/^([0-9]+|X|Y)$/.test(m)) { skippedQ++; console.log('non-chromosome mouse target skipped:', f[6], tEnd - tStart); continue; }
  rows.push({ h, tStart, tEnd, m, qStart: +f[7], qEnd: +f[8], strand: f[5], ali: +f[10], type: f[15] });
}
const hIdx = h => HUMAN.indexOf(h);
rows.sort((a, b) => hIdx(a.h) - hIdx(b.h) || a.tStart - b.tStart);

const r1 = x => +(x / 1e6).toFixed(1);
const blocks = rows.map(r => [r.h, r1(r.tStart), r1(r.tEnd), r.m, r1(r.qStart), r1(r.qEnd), r.strand]);
const mouseUsed = [...new Set(rows.map(r => r.m))];
const mouseOrder = Object.keys(ms).filter(m => mouseUsed.includes(m))
  .sort((a, b) => (a === 'X' ? 99 : a === 'Y' ? 100 : +a) - (b === 'X' ? 99 : b === 'Y' ? 100 : +b));

const aliFrac = rows.map(r => r.ali / (r.tEnd - r.tStart)).sort((a, b) => a - b);
const median = aliFrac[Math.floor(aliFrac.length / 2)];
const cover = rows.reduce((s, r) => s + r.tEnd - r.tStart, 0) / 1e6;
const humanTotal = HUMAN.reduce((s, h) => s + hs[h], 0);

const out = {
  source: 'UCSC hg38 netMm39 (GRCh38 vs GRCm39 alignment net), level-1 fills on human chr1-22 and X spanning at least 3 Mb of human sequence; hg38/mm39 chrom.sizes',
  urls: SRC,
  minSpanMb: MIN_SPAN / 1e6,
  columns: ['human chr', 'start Mb', 'end Mb', 'mouse chr', 'start Mb', 'end Mb', 'strand'],
  humanSizes: Object.fromEntries(HUMAN.map(h => [h, hs[h]])),
  mouseSizes: Object.fromEntries(mouseOrder.map(m => [m, ms[m]])),
  summary: {
    level1Fills: level1, blocks: blocks.length, mouseChromosomes: mouseOrder.length,
    spanMb: +cover.toFixed(1), humanMb: +humanTotal.toFixed(1),
    medianAlignedFraction: +median.toFixed(3),
    types: [...new Set(rows.map(r => r.type))]
  },
  blocks
};
const txt = '{\n' + Object.entries(out).map(([k, v]) => k === 'blocks'
  ? `  "blocks": [\n${v.map(b => '    ' + JSON.stringify(b)).join(',\n')}\n  ]`
  : `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n') + '\n}\n';
fs.writeFileSync(OUT, txt);
console.log(`level-1 fills on chr1-22,X: ${level1}; blocks >= 3 Mb: ${blocks.length} on ${mouseOrder.length} mouse chromosomes (${mouseOrder.join(' ')}); skipped non-chromosome targets: ${skippedQ}`);
console.log(`blocks span ${cover.toFixed(1)} of ${humanTotal.toFixed(1)} Mb of human chr1-22,X; median aligned/span ${median.toFixed(3)}`);
console.log('wrote', path.relative(root, OUT));
