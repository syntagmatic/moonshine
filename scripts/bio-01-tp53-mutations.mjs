// Build docs/bioinformatics/shared/data/essay-01.json for essay 01 (Five Views of a
// Broken Pathway): real TP53 somatic mutations per codon across the 32 TCGA PanCancer
// Atlas studies, as served by the cBioPortal public API, plus the TP53 domain and
// zinc-ligand annotation from UniProt P04637.
//
//   node scripts/bio-01-tp53-mutations.mjs [--refresh]
//
// Raw responses are cached under temp/bio-audit/bio-01-raw/ (gitignored); a rerun
// reuses the cache and rebuilds the same JSON. --refresh refetches everything.
//
// Sources
//   cBioPortal REST API, https://www.cbioportal.org/api
//     studies?keyword=pan_can_atlas_2018         the 32 TCGA PanCancer Atlas studies
//     sample-lists/{study}_sequenced             samples with mutation data (denominator)
//     molecular-profiles/{study}_mutations/mutations?entrezGeneId=7157
//                                                every TP53 mutation call in those samples
//   UniProt REST, https://rest.uniprot.org/uniprotkb/P04637.json
//     DNA binding, Region and Binding site features (domains and the four zinc ligands)
//
// Classes. Missense_Mutation -> missense; Nonsense_Mutation, Frame_Shift_Del/Ins,
// Splice_Site, Splice_Region, Nonstop_Mutation, Translation_Start_Site -> truncating;
// In_Frame_Del/Ins -> inframe; anything else -> other. A mutation is placed at its
// proteinPosStart codon; calls without a codon in 1..393 are counted but not placed.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const OUT = path.join(root, 'docs/bioinformatics/shared/data/essay-01.json');
const CACHE = path.join(root, 'temp/bio-audit/bio-01-raw');
const REFRESH = process.argv.includes('--refresh');
fs.mkdirSync(CACHE, { recursive: true });

const CBIO = 'https://www.cbioportal.org/api';
const UNIPROT = 'https://rest.uniprot.org/uniprotkb/P04637.json';

async function cached(name, url) {
  const file = path.join(CACHE, name + '.json');
  if (!REFRESH && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const body = await res.json();
  const rec = { url, retrieved: new Date().toISOString(), body };
  fs.writeFileSync(file, JSON.stringify(rec));
  return rec;
}
const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);

const TRUNC = new Set(['Nonsense_Mutation', 'Frame_Shift_Del', 'Frame_Shift_Ins', 'Splice_Site',
  'Splice_Region', 'Nonstop_Mutation', 'Translation_Start_Site']);
const INFRAME = new Set(['In_Frame_Del', 'In_Frame_Ins']);
const cls = t => t === 'Missense_Mutation' ? 'missense' : TRUNC.has(t) ? 'truncating' : INFRAME.has(t) ? 'inframe' : 'other';

const studiesRec = await cached('studies', `${CBIO}/studies?keyword=pan_can_atlas_2018&projection=SUMMARY`);
const studyIds = studiesRec.body.map(s => s.studyId).filter(id => /_tcga_pan_can_atlas_2018$/.test(id)).sort();
if (studyIds.length !== 32) throw new Error(`expected 32 PanCancer Atlas studies, got ${studyIds.length}`);

const studies = [];
const byCodon = new Map();
const totals = { mutations: 0, missense: 0, truncating: 0, inframe: 0, other: 0, unplaced: 0 };
const mutatedSamples = new Set();
let sequenced = 0;
const hashes = [];
for (const id of studyIds) {
  const sl = await cached(`samples-${id}`, `${CBIO}/sample-lists/${id}_sequenced`);
  const muts = await cached(`tp53-${id}`, `${CBIO}/molecular-profiles/${id}_mutations/mutations?sampleListId=${id}_sequenced&entrezGeneId=7157&projection=SUMMARY`);
  hashes.push(sha(JSON.stringify(muts.body)));
  const n = sl.body.sampleCount;
  sequenced += n;
  const mutSamples = new Set();
  for (const m of muts.body) {
    const c = cls(m.mutationType);
    totals.mutations++; totals[c]++;
    mutSamples.add(m.sampleId); mutatedSamples.add(m.sampleId);
    const codon = m.proteinPosStart;
    if (!(codon >= 1 && codon <= 393)) { totals.unplaced++; continue; }
    let rec = byCodon.get(codon);
    if (!rec) { rec = { codon, missense: 0, truncating: 0, inframe: 0, other: 0, changes: {} }; byCodon.set(codon, rec); }
    rec[c]++;
    rec.changes[m.proteinChange] = (rec.changes[m.proteinChange] || 0) + 1;
  }
  studies.push({ id: id.replace('_tcga_pan_can_atlas_2018', ''), sequenced: n, tp53Mutated: mutSamples.size });
}

// Per codon: counts by class and the three commonest protein changes.
const codons = [...byCodon.values()].sort((a, b) => a.codon - b.codon).map(r => ({
  codon: r.codon, missense: r.missense, truncating: r.truncating, inframe: r.inframe, other: r.other,
  top: Object.entries(r.changes).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 3)
}));

const up = await cached('uniprot-P04637', UNIPROT + '?fields=ft_domain,ft_region,ft_dna_bind,ft_binding,length');
const feats = up.body.features;
const pick = (type, desc) => {
  const f = feats.find(x => x.type === type && (desc == null || (x.description || '') === desc));
  if (!f) throw new Error(`UniProt feature missing: ${type} ${desc}`);
  return [f.location.start.value, f.location.end.value];
};
const domains = [
  { name: 'Transactivation (acidic)', range: pick('Region', 'Transcription activation (acidic)') },
  { name: 'DNA-binding', range: pick('DNA binding', '') },
  { name: 'Oligomerization', range: pick('Region', 'Oligomerization') },
  { name: 'Basic (regulatory)', range: pick('Region', 'Basic (repression of DNA-binding)') }
].map(d => ({ name: d.name, start: d.range[0], end: d.range[1] }));
const zinc = feats.filter(f => f.type === 'Binding site').map(f => f.location.start.value).sort((a, b) => a - b);

const out = {
  about: 'Real TP53 somatic mutation calls per codon in the 32 TCGA PanCancer Atlas studies (cBioPortal), and UniProt P04637 domains. Built by scripts/bio-01-tp53-mutations.mjs.',
  sources: {
    cbioportal: { url: `${CBIO}/molecular-profiles/{study}_tcga_pan_can_atlas_2018_mutations/mutations?sampleListId={study}_tcga_pan_can_atlas_2018_sequenced&entrezGeneId=7157`, retrieved: studiesRec.retrieved.slice(0, 10), sha256: sha(hashes.join('')) },
    uniprot: { url: UNIPROT, retrieved: up.retrieved.slice(0, 10), sha256: sha(JSON.stringify(feats)) }
  },
  proteinLength: 393,
  sequenced, tp53MutatedSamples: mutatedSamples.size,
  totals, studies, domains, zinc, codons
};
fs.writeFileSync(OUT, JSON.stringify(out) + '\n');
console.log(`wrote ${path.relative(root, OUT)}: ${codons.length} codons, ${totals.mutations} mutations in ${mutatedSamples.size} of ${sequenced} samples`);
console.log('domains', JSON.stringify(domains), 'zinc', zinc.join(','));
