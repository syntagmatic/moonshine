// Build docs/bioinformatics/shared/data/locus.json for the shared BioLocus library
// (docs/bioinformatics/shared/locus.js): the real GRCh38 CDKN1A locus on chr6 and
// the TP53 exon that carries codon 175 on chr17, for essays 01, 02 and 04.
//
//   node scripts/bio-fetch-locus.mjs [--refresh]
//
// Raw responses are cached under temp/bio-audit/locus-raw/ (gitignored) with the
// URL and retrieval time; a rerun reuses the cache and rebuilds the same JSON.
// --refresh refetches everything.
//
// Sources (all GRCh38 / hg38)
//   UCSC Genome Browser REST API, https://api.genome.ucsc.edu
//     getData/sequence   reference DNA (UCSC returns soft-masked case; stored upper case)
//     getData/track      cpgIslandExt, rmsk, cytoBand, phyloP100way
//   Ensembl REST API, https://rest.ensembl.org
//     overlap/region     every gene in the CDKN1A window
//     lookup/id          gene and transcript models (expand, utr, mane)
//     sequence/id        CDKN1A and TP53 protein sequences (for the translation checks)
//     sequence/region    an independent slice to cross-check UCSC coordinates
//     map/cds, vep/hgvs  TP53 c.524 genomic position and consequence
//     info/data          Ensembl release number
//   NCBI E-utilities, https://eutils.ncbi.nlm.nih.gov
//     esummary clinvar   VCV000012374, NM_000546.6(TP53):c.524G>A (p.Arg175His)
//     efetch nuccore     GenBank U24170.1, the p21 (WAF1) promoter sequence submitted
//                        with el-Deiry et al. 1995 Cancer Res 55:2910 (PMID 7796420)
//   JASPAR REST API, https://jaspar.elixir.no/api/v1   MA0106 versions; MA0106.3 PFM
//
// p53 response elements. The two site sequences are el-Deiry's (1995, GenBank U24170)
// 5' and 3' sites. The script finds each, exactly once, in the hg38 window and in
// U24170, and derives the +1 that the Resnick-Silverman et al. 1998 Genes Dev 12:2102
// numbering (5' site -2281..-2262, 3' site -1395..-1376) implies in U24170: both sites
// must give the same base, which is then mapped to hg38 by exact 20-mer matches.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const OUT = path.join(root, 'docs/bioinformatics/shared/data/locus.json');
const CACHE = path.join(root, 'temp/bio-audit/locus-raw');
const REFRESH = process.argv.includes('--refresh');
fs.mkdirSync(CACHE, { recursive: true });

const UCSC = 'https://api.genome.ucsc.edu';
const ENS = 'https://rest.ensembl.org';
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const JASPAR = 'https://jaspar.elixir.no/api/v1';

// CDKN1A window: 40 kb, 0-based half-open [36,662,000, 36,702,000) =
// 1-based chr6:36,662,001-36,702,000. CDKN1A (Ensembl gene 36,676,441-36,688,042)
// sits near the middle; the window reaches into RAB44 at the right edge.
const CDK = { chrom: 'chr6', start0: 36662000, end0: 36702000 };
const CDKN1A_GENE = 'ENSG00000124762';
const CDKN1A_CANON = 'ENST00000244741';
// Two alternatives: -204 starts at the upstream promoter (its exon 1 holds the 5'
// p53 site); -202 has an extra non-coding exon between exons 1 and 2.
const CDKN1A_ALT = ['ENST00000448526', 'ENST00000373711'];
const TP53_TX = 'ENST00000269305';
const TP53_MARGIN = 200;   // bases of intron kept on each side of the codon-175 exon
const P53_SITES = [
  { id: 'RE5', name: "5' (distal) p53 site", seq: 'GAACATGTCCCAACATGTTG', resnick: [-2281, -2262] },
  { id: 'RE3', name: "3' (proximal) p53 site", seq: 'GAAGAAGACTGGGCATGTCT', resnick: [-1395, -1376] }
];

const sources = {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(key, url, { what, method = 'GET', body = null, text = false } = {}) {
  const file = path.join(CACHE, key + (text ? '.txt' : '.json'));
  const meta = path.join(CACHE, key + '.meta.json');
  if (REFRESH || !fs.existsSync(file) || !fs.existsSync(meta)) {
    let r, tries = 0;
    for (;;) {
      r = await fetch(url, {
        method, body: body ? JSON.stringify(body) : undefined,
        headers: { 'User-Agent': 'moonshine-bio-fetch-locus/1.0', 'Content-Type': 'application/json', Accept: text ? 'text/plain' : 'application/json' }
      });
      if (r.ok) break;
      if (++tries > 4 || ![429, 500, 502, 503, 504].includes(r.status)) throw new Error(`${url}: HTTP ${r.status}`);
      await sleep(1500 * tries);
    }
    fs.writeFileSync(file, await r.text());
    fs.writeFileSync(meta, JSON.stringify({ url, method, body, retrieved: new Date().toISOString() }));
    await sleep(350);
  }
  const raw = fs.readFileSync(file);
  const m = JSON.parse(fs.readFileSync(meta, 'utf8'));
  sources[key] = {
    url: m.url + (m.body ? ' POST ' + JSON.stringify(m.body) : ''), what,
    retrieved: m.retrieved.slice(0, 10),
    sha256: crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16)
  };
  return text ? raw.toString('utf8') : JSON.parse(raw.toString('utf8'));
}
const assert = (c, msg) => { if (!c) throw new Error('assertion failed: ' + msg); };

// ---------- UCSC ----------
async function ucscSeq(key, chrom, s0, e0) {
  const d = await get(key, `${UCSC}/getData/sequence?genome=hg38;chrom=${chrom};start=${s0};end=${e0}`,
    { what: `hg38 reference sequence ${chrom}:${s0 + 1}-${e0} (UCSC getData/sequence)` });
  const s = d.dna.toUpperCase();
  assert(s.length === e0 - s0, `${key} length ${s.length} != ${e0 - s0}`);
  assert(/^[ACGT]+$/.test(s), `${key} has non-ACGT bases`);
  // UCSC soft-masks repeats (RepeatMasker + TRF) in lower case: keep the runs
  const softmask = [];
  for (const m of d.dna.matchAll(/[acgtn]+/g)) softmask.push([s0 + m.index, s0 + m.index + m[0].length]);
  return { seq: s, softmask };
}
async function ucscTrack(key, track, chrom, s0, e0, what) {
  const range = s0 == null ? '' : `;start=${s0};end=${e0}`;
  const d = await get(key, `${UCSC}/getData/track?genome=hg38;track=${track};chrom=${chrom}${range};maxItemsOutput=200000`,
    { what: what + ` (UCSC hg38 table ${track})` });
  if (d.dataTime) sources[key].dataTime = d.dataTime.slice(0, 10);
  return d[track] || (d[chrom] ? d[chrom] : []);
}
// phyloP100way: per-base values, quantised to 0.1 in an int8 (-128 = no data,
// values below -12.7 clamped to -12.7), base64. Also keeps a few exact values.
function encodePhylop(items, s0, e0, exactAt) {
  const n = e0 - s0, q = new Int8Array(n).fill(-128), exact = new Map();
  let clamped = 0, covered = 0;
  for (const it of items) {
    for (let p = Math.max(it.start, s0); p < Math.min(it.end, e0); p++) {
      let v = Math.round(it.value * 10);
      if (v < -127) { v = -127; clamped++; }
      if (v > 127) { v = 127; clamped++; }
      q[p - s0] = v; covered++;
      exact.set(p + 1, it.value);
    }
  }
  const ex = exactAt.filter(p => exact.has(p)).map(p => [p, exact.get(p)]);
  return { scale: 0.1, missing: -128, clampedAt: -12.7, clamped, covered,
    b64: Buffer.from(q.buffer).toString('base64'), exact: ex };
}

// ---------- Ensembl ----------
async function ens(key, pathq, what, body) {
  const sep = pathq.includes('?') ? ';' : '?';
  return get(key, `${ENS}${pathq}${sep}content-type=application/json`, { what: what + ' (Ensembl REST)', method: body ? 'POST' : 'GET', body });
}
function txModel(t) {
  const exons = t.Exon.map(e => [e.start, e.end]).sort((a, b) => a[0] - b[0]);
  const m = {
    id: t.id, version: t.version, name: t.display_name, biotype: t.biotype, strand: t.strand,
    start1: t.start, end1: t.end, canonical: !!t.is_canonical, exons
  };
  if (t.MANE && t.MANE.length) m.mane = t.MANE.map(x => `${x.type} ${x.refseq_match}`).join('; ');
  if (t.Translation) {
    m.cds = [t.Translation.start, t.Translation.end];
    m.protein = t.Translation.id;
    m.proteinLength = t.Translation.length;
    const utr5 = [], utr3 = [];
    for (const [a, b] of exons) {
      const lo = [a, Math.min(b, m.cds[0] - 1)], hi = [Math.max(a, m.cds[1] + 1), b];
      if (lo[1] >= lo[0]) (t.strand > 0 ? utr5 : utr3).push(lo);
      if (hi[1] >= hi[0]) (t.strand > 0 ? utr3 : utr5).push(hi);
    }
    m.utr5 = utr5; m.utr3 = utr3;
    // Cross-check against Ensembl's own UTR features (utr=1)
    if (t.UTR) {
      const f = t.UTR.filter(u => /five/.test(u.type)).map(u => [u.start, u.end]).sort((a, b) => a[0] - b[0]);
      const th = t.UTR.filter(u => /three/.test(u.type)).map(u => [u.start, u.end]).sort((a, b) => a[0] - b[0]);
      assert(JSON.stringify(f) === JSON.stringify(utr5), `${t.id} 5' UTR mismatch ${JSON.stringify(f)} vs ${JSON.stringify(utr5)}`);
      assert(JSON.stringify(th) === JSON.stringify(utr3), `${t.id} 3' UTR mismatch`);
    }
  }
  return m;
}
const revcomp = s => s.split('').reverse().map(c => ({ A: 'T', C: 'G', G: 'C', T: 'A' })[c] || 'N').join('');
function findAll(hay, needle) { const out = []; let i = -1; while ((i = hay.indexOf(needle, i + 1)) >= 0) out.push(i); return out; }

// ======================= CDKN1A =======================
const today = new Date().toISOString().slice(0, 10);
const ensInfo = await ens('ensembl_info', '/info/data/', 'Ensembl data release');
const ensRelease = ensInfo.releases.join(',');
const asm = await ens('ensembl_assembly', '/info/assembly/homo_sapiens', 'Ensembl human assembly');

const { seq: cdkSeq, softmask: cdkMask } = await ucscSeq('ucsc_seq_cdkn1a', CDK.chrom, CDK.start0, CDK.end0);
const cpgRaw = await ucscTrack('ucsc_cpg_cdkn1a', 'cpgIslandExt', CDK.chrom, CDK.start0, CDK.end0, 'CpG islands in the CDKN1A window');
const rmskRaw = await ucscTrack('ucsc_rmsk_cdkn1a', 'rmsk', CDK.chrom, CDK.start0, CDK.end0, 'RepeatMasker repeats in the CDKN1A window');
const cyto6 = await ucscTrack('ucsc_cyto_chr6', 'cytoBand', 'chr6', null, null, 'chr6 cytogenetic bands');
const cyto17 = await ucscTrack('ucsc_cyto_chr17', 'cytoBand', 'chr17', null, null, 'chr17 cytogenetic bands');
const phyCdkRaw = await ucscTrack('ucsc_phylop_cdkn1a', 'phyloP100way', CDK.chrom, CDK.start0, CDK.end0, 'phyloP100way per-base conservation, CDKN1A window');

const overlap = await ens('ensembl_overlap_cdkn1a', `/overlap/region/human/6:${CDK.start0 + 1}-${CDK.end0}?feature=gene`, 'genes overlapping the CDKN1A window');
const geneIds = overlap.map(g => g.id);
const lookup = await ens('ensembl_lookup_genes', '/lookup/id?expand=1;utr=1;mane=1', 'gene and transcript models', { ids: geneIds });

const genes = overlap.map(g => {
  const L = lookup[g.id];
  assert(L, 'no lookup for ' + g.id);
  const keep = L.Transcript.filter(t => t.is_canonical || (g.id === CDKN1A_GENE && CDKN1A_ALT.includes(t.id)));
  keep.sort((a, b) => (b.is_canonical ? 1 : 0) - (a.is_canonical ? 1 : 0) || a.id.localeCompare(b.id));
  return {
    id: L.id, version: L.version, symbol: L.display_name || null, biotype: L.biotype, strand: L.strand,
    start1: L.start, end1: L.end, description: (L.description || '').replace(/ \[Source:.*\]$/, '') || null,
    transcriptCount: L.Transcript.length,
    transcripts: keep.map(txModel)
  };
}).sort((a, b) => a.start1 - b.start1);
const cdkGene = genes.find(g => g.id === CDKN1A_GENE);
assert(cdkGene && cdkGene.transcripts.length === 3, 'CDKN1A canonical + 2 alternatives');
const cdkCanon = cdkGene.transcripts.find(t => t.id === CDKN1A_CANON);
assert(cdkCanon && cdkCanon.canonical, 'CDKN1A canonical id');

// Proteins and an independent Ensembl sequence slice for the coordinate cross-check
const cdkProt = await ens('ensembl_prot_cdkn1a', `/sequence/id/${cdkCanon.protein}?type=protein`, 'CDKN1A canonical protein sequence');
const ex1 = cdkCanon.exons[0];
const ensSlice = await ens('ensembl_slice_cdkn1a_ex1', `/sequence/region/human/6:${ex1[0]}..${ex1[1]}:1`, 'CDKN1A exon 1 sequence (cross-check)');
assert(ensSlice.seq === cdkSeq.slice(ex1[0] - 1 - CDK.start0, ex1[1] - CDK.start0), 'Ensembl and UCSC disagree on CDKN1A exon 1');

// p53 response elements: hg38 positions, U24170 positions, implied literature +1
const gb = await get('genbank_U24170', `${EUTILS}/efetch.fcgi?db=nuccore&id=U24170&rettype=gb&retmode=text`,
  { what: 'GenBank U24170.1, human p21 (WAF1) promoter (el-Deiry et al. 1995)', text: true });
const u = gb.split('ORIGIN')[1].split('//')[0].replace(/[^acgt]/gi, '').toUpperCase();
assert(/LOCUS\s+HSU24170\s+5143 bp/.test(gb) && u.length === 5143, 'U24170 length');
const litPlus1U = new Set();
const sites = P53_SITES.map(s => {
  const h = findAll(cdkSeq, s.seq), hr = findAll(cdkSeq, revcomp(s.seq)), uu = findAll(u, s.seq);
  assert(h.length === 1 && hr.length === 0, `${s.id} must match once on + strand in hg38`);
  assert(uu.length === 1, `${s.id} must match once in U24170`);
  const start1 = CDK.start0 + h[0] + 1, uStart = uu[0] + 1;
  litPlus1U.add(uStart - s.resnick[0]);   // site start = (+1) + rel, rel negative, no zero
  return { ...s, start1, end1: start1 + 19, uStart };
});
assert(litPlus1U.size === 1, 'the two Resnick-Silverman positions imply different +1s in U24170');
const plus1U = [...litPlus1U][0];
// map U24170 position plus1U to hg38 with exact 20-mers on both sides
const left = u.slice(plus1U - 21, plus1U - 1), right = u.slice(plus1U - 1, plus1U + 19);
const hl = findAll(cdkSeq, left), hrr = findAll(cdkSeq, right);
assert(hl.length === 1 && hrr.length === 1 && hrr[0] === hl[0] + 20, 'U24170 +1 maps uniquely to hg38');
const litTSS = CDK.start0 + hrr[0] + 1;
const ensTSS = cdkCanon.start1;
const relNoZero = (p, t) => (p >= t ? p - t + 1 : p - t);
// Where U24170 and hg38 differ between the 5' site and +1 (length difference)
const spans = [
  ["5' site start to 3' site start", sites[1].uStart - sites[0].uStart, sites[1].start1 - sites[0].start1],
  ["3' site start to +1", plus1U - sites[1].uStart, litTSS - sites[1].start1],
  ["5' site start to +1", plus1U - sites[0].uStart, litTSS - sites[0].start1]
];
const consensus = 'RRRCWWGYYYRRRCWWGYYY';
const iupac = { R: 'AG', Y: 'CT', W: 'AT', C: 'C', G: 'G' };
for (const s of sites) {
  s.consensusMatches = [...s.seq].filter((c, i) => iupac[consensus[i]].includes(c)).length;
  s.relEnsemblTSS = [relNoZero(s.start1, ensTSS), relNoZero(s.end1, ensTSS)];
  s.relLiteratureTSS = [relNoZero(s.start1, litTSS), relNoZero(s.end1, litTSS)];
  s.halfSites = [[s.start1, s.start1 + 9, s.seq.slice(0, 10)], [s.start1 + 10, s.end1, s.seq.slice(10)]];
  s.inExonOf = genes.flatMap(g => g.transcripts.filter(t => t.exons.some(([a, b]) => a <= s.start1 && s.end1 <= b)).map(t => t.id));
}

// ======================= TP53 =======================
const tp53 = await ens('ensembl_lookup_tp53', `/lookup/id/${TP53_TX}?expand=1;utr=1;mane=1`, 'TP53 canonical transcript model');
const tpModel = txModel(tp53);
const tpGene = await ens('ensembl_lookup_tp53_gene', `/lookup/id/${tp53.Parent}`, 'TP53 gene record');
assert(tpModel.strand === -1 && tpModel.canonical && /MANE_Select/.test(tpModel.mane || ''), 'TP53 canonical (MANE Select) on minus strand');
const map524 = await ens('ensembl_map_tp53_c524', `/map/cds/${TP53_TX}/523..525`, 'TP53 CDS 523-525 to GRCh38');
const vep = await ens('ensembl_vep_r175h', `/vep/human/hgvs/${TP53_TX}:c.524G>A`, 'VEP for ENST00000269305:c.524G>A');
const tpProt = await ens('ensembl_prot_tp53', `/sequence/id/${tpModel.protein}?type=protein`, 'TP53 canonical protein sequence');
const clinvar = await get('ncbi_clinvar_12374', `${EUTILS}/esummary.fcgi?db=clinvar&id=12374&retmode=json`,
  { what: 'ClinVar VCV000012374 summary (NCBI E-utilities)' });
const cv = clinvar.result['12374'];
const cvLoc = cv.variation_set[0].variation_loc.find(l => l.assembly_name === 'GRCh38');
const mm = map524.mappings[0];
const codonGenomic = [mm.start, mm.end];
assert(mm.end - mm.start === 2 && mm.strand === -1 && mm.seq_region_name === '17', 'codon 175 maps to 3 bases on chr17 minus');
const c524 = mm.end - 1;   // minus strand: c.523 is the highest coordinate, c.524 the middle
assert(+cvLoc.start === c524, `ClinVar GRCh38 ${cvLoc.start} vs Ensembl ${c524}`);
const v0 = vep[0], vt = v0.transcript_consequences.find(t => t.transcript_id === TP53_TX);
assert(v0.start === c524 && vt.codons === 'cGc/cAc' && vt.amino_acids === 'R/H' && vt.protein_start === 175, 'VEP agrees');
const exonIdx = tpModel.exons.findIndex(([a, b]) => a <= mm.start && mm.end <= b);
assert(exonIdx >= 0, 'codon 175 within one exon');
const exonNumber = tpModel.exons.length - exonIdx;   // minus strand: transcript order reversed
const tpExon = tpModel.exons[exonIdx];
const TP = { chrom: 'chr17', start0: tpExon[0] - 1 - TP53_MARGIN, end0: tpExon[1] + TP53_MARGIN };
const { seq: tpSeq, softmask: tpMask } = await ucscSeq('ucsc_seq_tp53', TP.chrom, TP.start0, TP.end0);
const phyTpRaw = await ucscTrack('ucsc_phylop_tp53', 'phyloP100way', TP.chrom, TP.start0, TP.end0, 'phyloP100way per-base conservation, TP53 exon window');
const refPlus = tpSeq.slice(mm.start - 1 - TP.start0, mm.end - TP.start0);
assert(revcomp(refPlus) === 'CGC', 'reference codon 175 is CGC on the transcript strand');
assert(tpProt.seq[174] === 'R', 'TP53 residue 175 is R');

// ======================= JASPAR =======================
const jv = await get('jaspar_ma0106_versions', `${JASPAR}/matrix/MA0106/versions/?format=json`, { what: 'JASPAR MA0106 version list' });
const latest = jv.results.map(r => r.matrix_id).sort((a, b) => +a.split('.')[1] - +b.split('.')[1]).pop();
const jm = await get('jaspar_' + latest.replace('.', '_'), `${JASPAR}/matrix/${latest}/?format=json`, { what: `JASPAR ${latest} TP53 matrix` });

// ======================= assemble =======================
const cpgIslands = cpgRaw.map(c => ({
  start0: c.chromStart, end0: c.chromEnd, length: c.length, cpgNum: c.cpgNum, gcNum: c.gcNum,
  perCpg: c.perCpg, perGc: c.perGc, obsExp: c.obsExp
}));
const repeats = rmskRaw.map(r => [r.genoStart, r.genoEnd, r.repName, r.repClass, r.repFamily, r.strand]);
const band = rows => rows.map(b => [b.chromStart, b.chromEnd, b.name, b.gieStain]);
const cdkExact = [ensTSS, litTSS, sites[0].start1, sites[1].start1, cdkCanon.cds[0]];
const tpExact = [mm.start, c524, mm.end];

const out = {
  about: 'Real GRCh38 reference data for the bioinformatics series: the CDKN1A locus on chr6 and the TP53 exon holding codon 175 on chr17. Built by scripts/bio-fetch-locus.mjs; read through docs/bioinformatics/shared/locus.js (BioLocus).',
  conventions: 'start0/end0 are 0-based half-open (BED, UCSC tables); start1/end1 and pos1 are 1-based closed (Ensembl, VCF, browser display). Sequences are the + strand of the reference. Exons are listed in ascending genomic order; exon numbers follow the transcript, so on the minus strand exon 1 is the last pair. Positions relative to a TSS use the promoter convention: the TSS base is +1, the base before it is -1, there is no 0.',
  assembly: { name: 'GRCh38', ucsc: 'hg38', ensemblRelease: ensRelease, ensemblAssembly: asm.assembly_name, patch: asm.default_coord_system_version ? asm.assembly_name : undefined },
  built: today,
  script: 'scripts/bio-fetch-locus.mjs',
  sources,
  cytobands: { source: ['ucsc_cyto_chr6', 'ucsc_cyto_chr17'], chr6: band(cyto6), chr17: band(cyto17) },
  regions: {
    cdkn1a: {
      chrom: CDK.chrom, start0: CDK.start0, end0: CDK.end0,
      cytoband: '6' + cyto6.find(b => b.chromStart <= CDK.start0 && CDK.end0 <= b.chromEnd).name,
      source: { seq: 'ucsc_seq_cdkn1a', cpgIslands: 'ucsc_cpg_cdkn1a', repeats: 'ucsc_rmsk_cdkn1a', phylop: 'ucsc_phylop_cdkn1a', genes: ['ensembl_overlap_cdkn1a', 'ensembl_lookup_genes'] },
      seq: cdkSeq,
      softmask: cdkMask,
      phylop: encodePhylop(phyCdkRaw, CDK.start0, CDK.end0, cdkExact),
      cpgIslands,
      repeatsFields: ['start0', 'end0', 'name', 'class', 'family', 'strand'],
      repeats,
      genes
    },
    tp53: {
      chrom: TP.chrom, start0: TP.start0, end0: TP.end0,
      cytoband: '17' + cyto17.find(b => b.chromStart <= TP.start0 && TP.end0 <= b.chromEnd).name,
      source: { seq: 'ucsc_seq_tp53', phylop: 'ucsc_phylop_tp53', genes: ['ensembl_lookup_tp53_gene', 'ensembl_lookup_tp53'] },
      seq: tpSeq,
      softmask: tpMask,
      phylop: encodePhylop(phyTpRaw, TP.start0, TP.end0, tpExact),
      cpgIslands: [], repeatsFields: [], repeats: [],
      genes: [{ id: tpGene.id, version: tpGene.version, symbol: tpGene.display_name, biotype: tpGene.biotype, strand: tpGene.strand,
        start1: tpGene.start, end1: tpGene.end, description: (tpGene.description || '').replace(/ \[Source:.*\]$/, '') || null,
        transcriptCount: null, transcripts: [tpModel] }]
    }
  },
  cdkn1a: {
    gene: CDKN1A_GENE, canonical: CDKN1A_CANON, alternatives: CDKN1A_ALT,
    protein: cdkProt.seq, proteinSource: 'ensembl_prot_cdkn1a',
    tss: {
      ensembl: { pos1: ensTSS, what: `5' end of the Ensembl canonical transcript ${CDKN1A_CANON}.${cdkCanon.version} (MANE Select)`, source: 'ensembl_lookup_genes' },
      literature: {
        pos1: litTSS, uPos: plus1U,
        what: 'the +1 implied by Resnick-Silverman et al. 1998 (Genes Dev 12:2102, PMC317007): their 5\' site at -2281..-2262 and 3\' site at -1395..-1376 both put +1 at GenBank U24170 position ' + plus1U + ', which maps to this hg38 base by exact 20-mers on either side',
        offsetFromEnsembl: litTSS - ensTSS, source: 'genbank_U24170'
      }
    },
    u24170: { length: u.length, spans: spans.map(([what, u24170, hg38]) => ({ what, u24170, hg38 })),
      note: 'U24170 (1995) and hg38 differ in length between the sites and +1 (sequencing or allelic differences), so published offsets do not convert to hg38 by one fixed shift; use the hg38 coordinates' },
    p53Sites: sites.map(s => ({
      id: s.id, name: s.name, seq: s.seq, strand: '+', start1: s.start1, end1: s.end1,
      halfSites: s.halfSites, consensusMatches: s.consensusMatches,
      relEnsemblTSS: s.relEnsemblTSS, relLiteratureTSS: s.relLiteratureTSS, resnick1998: s.resnick,
      u24170Start: s.uStart, inExonOf: s.inExonOf,
      sources: "Sequence: el-Deiry et al. 1995 Cancer Res 55:2910 (GenBank U24170, found once in hg38 and once in U24170). 'About 2.4 kb upstream' for the first-found site: el-Deiry et al. 1993 Cell 75:817 (PMID 8242752) abstract. Numbering: Resnick-Silverman et al. 1998 Genes Dev 12:2102."
    }))
  },
  tp53: {
    gene: tp53.Parent, transcript: TP53_TX, transcriptVersion: tpModel.version, protein: tpProt.seq, proteinSource: 'ensembl_prot_tp53',
    exon: { number: exonNumber, of: tpModel.exons.length, start1: tpExon[0], end1: tpExon[1] },
    codon175: {
      start1: codonGenomic[0], end1: codonGenomic[1], strand: -1,
      refPlus, refCodon: revcomp(refPlus), aa: 'R',
      cdsBases: { 523: mm.end, 524: c524, 525: mm.start },
      source: 'ensembl_map_tp53_c524'
    },
    r175h: {
      hgvs: 'NM_000546.6:c.524G>A, ENST00000269305:c.524G>A, p.Arg175His',
      codonChange: vt.codons, aminoAcids: vt.amino_acids,
      pos1: c524, vcf: { chrom: '17', pos: c524, ref: refPlus[1], alt: revcomp('A') },
      bed: { chrom: 'chr17', start0: c524 - 1, end0: c524 },
      dbsnp: 'rs28934578', clinvar: cv.accession, clinvarTitle: cv.title,
      clinvarClassification: (cv.germline_classification || {}).description || null,
      sources: ['ensembl_vep_r175h', 'ncbi_clinvar_12374', 'ensembl_map_tp53_c524']
    }
  },
  jaspar: {
    id: jm.matrix_id, name: jm.name, latestOf: jv.results.map(r => r.matrix_id),
    url: `https://jaspar.elixir.no/matrix/${jm.matrix_id}/`, api: `${JASPAR}/matrix/${jm.matrix_id}/`,
    type: jm.type, comment: jm.comment, pubmed: jm.pubmed_ids, uniprot: jm.uniprot_ids,
    pfm: jm.pfm, source: 'jaspar_' + latest.replace('.', '_')
  },
  crossChecks: {
    ensemblSlice: { region: `6:${ex1[0]}..${ex1[1]}:1`, seq: ensSlice.seq, source: 'ensembl_slice_cdkn1a_ex1' },
    cpgIslandTable: 'cpgIslandExt is computed on repeat-masked sequence: cpgNum and obsExp (stored with each island) against the counts in seq with softmask bases treated as N'
  }
};
assert(out.tp53.r175h.vcf.ref === 'C' && out.tp53.r175h.vcf.alt === 'T', 'VCF REF/ALT on + strand');
delete out.assembly.patch;

const json = JSON.stringify(out);
assert(!/\\u[0-9a-f]{4}/i.test(json), 'no \\u escapes');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, json);
console.log(`wrote ${path.relative(root, OUT)} ${(json.length / 1024).toFixed(1)} KB`);
console.log(`genes in window: ${genes.map(g => g.symbol || g.id).join(', ')}`);
console.log(out.cdkn1a.u24170.spans);
console.log(`CDKN1A TSS Ensembl ${ensTSS}, literature +1 ${litTSS} (U24170 ${plus1U})`);
for (const s of out.cdkn1a.p53Sites) console.log(`${s.id} ${s.seq} chr6:${s.start1}-${s.end1} rel Ensembl ${s.relEnsemblTSS} rel literature ${s.relLiteratureTSS} consensus ${s.consensusMatches}/20 in exon of ${s.inExonOf.join(',') || '-'}`);
console.log(`TP53 exon ${exonNumber}/${tpModel.exons.length} chr17:${tpExon[0]}-${tpExon[1]}; codon 175 chr17:${mm.start}-${mm.end} (-), c.524 = ${c524}, plus-strand ref ${refPlus}, ClinVar ${cv.accession}`);
console.log(`JASPAR ${jm.matrix_id} (versions ${out.jaspar.latestOf.join(', ')})`);
