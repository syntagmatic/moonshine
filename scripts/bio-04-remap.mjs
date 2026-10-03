// Build docs/bioinformatics/shared/data/essay-04.json for essay 04 (ChIP-seq Peaks):
// every real TP53 ChIP-seq peak that ReMap 2022 holds in the BioLocus CDKN1A window.
//
//   node scripts/bio-04-remap.mjs [--refresh]
//
// Source: the UCSC Genome Browser REST API, track ReMapTFs on hg38
// (/gbdb/hg38/reMap/reMap2022.bb; Hammal et al. 2022, Nucleic Acids Res 50:D316).
// ReMap reprocesses public ChIP-seq experiments with one pipeline. Each bed item is
// one peak from one experiment: name = "<experiment>.<TF>.<biosample>", thickStart
// = the summit (0-based), chromStart/chromEnd = the peak (0-based half-open).
// Only TF == "TP53" is kept. The raw response is cached under
// temp/bio-audit/remap-04/ (gitignored); a rerun reuses it and rebuilds the same JSON.
//
// The essay uses these peaks for one thing: to ask, of each p53 motif match in the
// window, how many independent TP53 experiments put a peak on it.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const OUT = path.join(root, 'docs/bioinformatics/shared/data/essay-04.json');
const CACHE = path.join(root, 'temp/bio-audit/remap-04');
const REFRESH = process.argv.includes('--refresh');
fs.mkdirSync(CACHE, { recursive: true });

// The same window as BioLocus regions.cdkn1a: chr6 [36,662,000, 36,702,000).
const WIN = { chrom: 'chr6', start0: 36662000, end0: 36702000 };
const url = `https://api.genome.ucsc.edu/getData/track?genome=hg38;track=ReMapTFs;chrom=${WIN.chrom};start=${WIN.start0};end=${WIN.end0}`;

const file = path.join(CACHE, 'remap-cdkn1a.json');
const meta = path.join(CACHE, 'remap-cdkn1a.meta.json');
if (REFRESH || !fs.existsSync(file) || !fs.existsSync(meta)) {
  const r = await fetch(url, { headers: { 'User-Agent': 'moonshine-bio-04-remap/1.0' } });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  fs.writeFileSync(file, await r.text());
  fs.writeFileSync(meta, JSON.stringify({ url, retrieved: new Date().toISOString() }));
  console.log('fetched', url);
}
const raw = fs.readFileSync(file);
const m = JSON.parse(fs.readFileSync(meta, 'utf8'));
const d = JSON.parse(raw);
const items = d.ReMapTFs;
if (!Array.isArray(items)) throw new Error('no ReMapTFs array in the response');

const tp53 = items.filter(r => r.TF === 'TP53')
  .filter(r => r.chromEnd > WIN.start0 && r.chromStart < WIN.end0)
  .sort((a, b) => a.chromStart - b.chromStart || a.name.localeCompare(b.name));
const names = [...new Set(tp53.map(r => r.name))].sort();
const idx = new Map(names.map((n, i) => [n, i]));
const experiments = names.map(n => {
  // The target field can name a modified form, e.g. TP53_PS15 (phospho-Ser15 antibody).
  const [exp, target, ...bio] = n.split('.');
  if (!/^TP53(_|$)/.test(target)) throw new Error('unexpected name ' + n);
  return [exp, target, bio.join('.')];
});
const peaks = tp53.map(r => {
  if (!(r.thickStart >= r.chromStart && r.thickStart < r.chromEnd)) throw new Error('summit outside peak ' + JSON.stringify(r));
  return [r.chromStart, r.chromEnd, r.thickStart, idx.get(r.name)];
});

const out = {
  about: 'Real TP53 ChIP-seq peaks from ReMap 2022 in the BioLocus CDKN1A window (chr6 [36,662,000, 36,702,000), GRCh38), for essay 04. Built by scripts/bio-04-remap.mjs; read by docs/bioinformatics/shared/essay-04.js (BioEssay04).',
  conventions: 'peaks: [start0, end0, summit0, experimentIndex], 0-based half-open as in BED; summit0 is the bed thickStart. experiments: [experiment accession, antibody target as ReMap names it, biosample] for each index.',
  source: {
    name: 'ReMap 2022 (Hammal et al. 2022, Nucleic Acids Res 50:D316), UCSC hg38 track ReMapTFs',
    url, bigDataUrl: d.bigDataUrl, retrieved: m.retrieved.slice(0, 10),
    sha256: crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16),
    itemsInWindow: items.length
  },
  window: WIN,
  tf: 'TP53',
  experiments,
  peaks
};
// Raw UTF-8, one peak per line so diffs stay readable.
const lines = JSON.stringify(out, null, 1).replace(/\[\n\s+(-?\d+),\n\s+(-?\d+),\n\s+(-?\d+),\n\s+(-?\d+)\n\s+\]/g, '[$1, $2, $3, $4]')
  .replace(/\[\n\s+("[^"]*"),\n\s+("[^"]*"),\n\s+("[^"]*")\n\s+\]/g, '[$1, $2, $3]');
fs.writeFileSync(OUT, lines + '\n');
console.log(`wrote ${path.relative(root, OUT)}: ${peaks.length} TP53 peaks from ${experiments.length} experiments (of ${items.length} ReMap items in the window)`);
