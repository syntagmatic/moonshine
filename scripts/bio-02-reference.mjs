// Build docs/bioinformatics/shared/data/essay-02.json: a few reference slices fetched
// from Ensembl, independently of the UCSC sequence that BioLocus (locus.json) carries.
// BioEssay02.runChecks uses them as the outside reference for the coordinate
// conventions and the strand flip that essay 02's pileup figure teaches.
//
//   node scripts/bio-02-reference.mjs [--refresh]
//
// Raw responses are cached under temp/bio-audit/f02-raw/ (not in the repo); a rerun
// reuses the cache and rebuilds the same JSON. --refresh refetches.
//
// Source: Ensembl REST API sequence/region, GRCh38, 1-based closed coordinates.
//   https://rest.ensembl.org/sequence/region/human/<chrom>:<start>..<end>:<strand>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const OUT = path.join(root, 'docs/bioinformatics/shared/data/essay-02.json');
const CACHE = path.join(root, 'temp/bio-audit/f02-raw');
const REFRESH = process.argv.includes('--refresh');
fs.mkdirSync(CACHE, { recursive: true });

const ENS = 'https://rest.ensembl.org';

// name, chrom, start1, end1, strand (Ensembl 1 / -1), what it is
const SLICES = [
  ['tp53Window', '17', 7675040, 7675135, 1, 'TP53 exon 5 around codon 175, + strand (the pileup window)'],
  ['tp53Codon175', '17', 7675087, 7675089, -1, 'TP53 codon 175 read on the transcript (minus) strand'],
  ['cdkn1aStart', '6', 36684102, 36684104, 1, 'CDKN1A start codon (canonical CDS start), + strand'],
  ['cdkn1aRE3', '6', 36677331, 36677350, 1, "CDKN1A 3' p53 response element, + strand"],
  ['cdkn1aExon1', '6', 36678714, 36678798, 1, 'CDKN1A canonical exon 1 (85 bp), + strand']
];

async function getJSON(url, key) {
  const file = path.join(CACHE, key + '.json');
  if (!REFRESH && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8')).body;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const body = await res.json();
  fs.writeFileSync(file, JSON.stringify({ url, retrieved: new Date().toISOString(), body }, null, 1));
  return body;
}

const out = { about: 'Ensembl GRCh38 reference slices for BioEssay02.runChecks (independent of the UCSC sequence in locus.json). Coordinates are 1-based closed; strand 1 = +, -1 = minus (reverse complement).', slices: {}, sources: {} };
for (const [name, chrom, s, e, strand, what] of SLICES) {
  const url = `${ENS}/sequence/region/human/${chrom}:${s}..${e}:${strand}?content-type=application/json`;
  const body = await getJSON(url, name);
  out.slices[name] = { chrom, start1: s, end1: e, strand, seq: body.seq.toUpperCase(), id: body.id, what };
  const cached = JSON.parse(fs.readFileSync(path.join(CACHE, name + '.json'), 'utf8'));
  out.sources[name] = { url, retrieved: cached.retrieved.slice(0, 10) };
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
console.log('wrote', path.relative(root, OUT));
for (const [k, v] of Object.entries(out.slices)) console.log(k, v.id, v.seq);
