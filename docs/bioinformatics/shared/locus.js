// BioLocus: real GRCh38 sequence and annotation for the bioinformatics series.
//
// Why this exists. Essays 01 (promoter methylation), 02 (genome browser and read
// pileup) and 04 (ChIP-seq and the p53 motif scan) all draw the same two places in
// the genome, and each used to invent its own version of them. This file reads one
// data file, data/locus.json, built by scripts/bio-fetch-locus.mjs from UCSC,
// Ensembl, NCBI and JASPAR, and gives every essay the same coordinates, the same
// conventions and the same small set of sequence tools. It knows nothing about any
// page. No fetch here: pages load locus.json themselves and pass it to load().
//
// Works in the browser (window.BioLocus) and in node (module.exports).
//
// COORDINATES. Every name says which system it uses.
//   *0 / start0, end0   0-based half-open, as in BED and UCSC tables. [start0, end0)
//   *1 / start1, end1   1-based closed, as in Ensembl, VCF and a browser's
//                       "chr6:36,678,714-36,678,798" box. pos1 is one base.
//   Same interval:      start1 = start0 + 1, end1 = end0. Length = end0 - start0.
//   Sequences are always the + strand of the reference unless a function says
//   otherwise (codon() and translate() return the transcript strand).
//   Relative to a TSS:  promoter convention, the TSS base is +1, the base just
//                       upstream is -1, there is no 0; upstream/downstream follow
//                       the transcript's strand.
//
// DATA (locus.json, all GRCh38/hg38; every block names its source key in
// json.sources, which holds the URL, retrieval date and sha256 prefix):
//   regions.cdkn1a   chr6 [36,662,000, 36,702,000), 40 kb, cytoband 6p21.2: + strand
//                    sequence, per-base phyloP100way, UCSC cpgIslandExt (2 islands),
//                    RepeatMasker, and every Ensembl gene in the window (canonical
//                    transcript each; CDKN1A also ENST00000373711 and ENST00000448526).
//   regions.tp53     chr17 [7,674,852, 7,675,436): TP53 exon 5 (chr17:7,675,053-
//                    7,675,236) with 200 bp of intron each side (exon 6 included),
//                    per-base phyloP100way, the full TP53 canonical model.
//   cdkn1a           TSSs, the two p53 response elements, p21 protein sequence.
//   tp53             codon 175 and R175H (c.524G>A) in every coordinate system.
//   jaspar           MA0106.3 (TP53) position frequency matrix and its URL.
//   cytobands        full chr6 and chr17 bands [start0, end0, name, stain].
//
// FACTS the essays may rely on (all asserted by runChecks):
//   CDKN1A canonical ENST00000244741.10 (MANE Select NM_000389.5), + strand, TSS
//     chr6:36,678,714; exons 36,678,714-36,678,798 (5' UTR only), 36,684,097-
//     36,684,546, 36,685,751-36,687,332; CDS 36,684,102-36,685,800; 164 aa.
//   CpG islands (start0, end0): [36,678,467, 36,680,688) = TSS -246..+1975 (204 CpG,
//     obs/exp 0.81), and [36,684,097, 36,684,358) over the start of exon 2.
//   p53 sites, + strand, exact el-Deiry 1995 sequences found once in hg38:
//     RE5 GAACATGTCCCAACATGTTG chr6:36,676,449-36,676,468  (-2265 from the Ensembl TSS)
//     RE3 GAAGAAGACTGGGCATGTCT chr6:36,677,331-36,677,350  (-1383)
//     Resnick-Silverman 1998 gives -2281 and -1395; both put their +1 at GenBank
//     U24170 base 4584 = hg38 chr6:36,678,729, 15 bp downstream of the Ensembl TSS
//     (cdkn1a.tss.literature). U24170 and hg38 also differ by small indels, so the
//     published numbers do not convert by one shift: draw the hg38 coordinates.
//   TP53 ENST00000269305 (MANE Select NM_000546.6), minus strand. Codon 175 is
//     chr17:7,675,087-7,675,089, transcript CGC (+ strand GCG), Arg, in exon 5 of 11.
//     c.523 = 7,675,089, c.524 = 7,675,088, c.525 = 7,675,087.
//     R175H c.524G>A: VCF 17 7675088 C T; BED chr17 7675087 7675088; rs28934578;
//     ClinVar VCV000012374 (Pathogenic).
//
// API
//   load(json)                    -> Locus. Decodes phyloP; returns the object below.
//   Locus.region(name)            -> Region for 'cdkn1a' or 'tp53'.
//   Locus.cdkn1a, .tp53, .jaspar, .cytobands, .sources, .json  (raw blocks)
//   Locus.tss(kind)               -> pos1 of the CDKN1A TSS; kind 'ensembl' (default)
//                                    or 'literature'.
//   Locus.p53Sites()              -> [{id, name, seq, start1, end1, start0, end0,
//                                    halfSites:[[start1,end1,seq],[..]], relEnsemblTSS,
//                                    relLiteratureTSS, resnick1998, consensusMatches}]
//   Locus.pwm(opts)               -> pwmFromPfm(jaspar.pfm, opts)
//
//   Region (one per window):
//     name, chrom, start0, end0, start1, end1, length, cytoband
//     genes        [{id, symbol, biotype, strand, start1, end1, description,
//                    transcripts:[Transcript]}], ascending start. symbol may be null.
//     Transcript   {id, version, name, biotype, strand, start1, end1, canonical,
//                    mane?, exons:[[start1,end1],...] ascending genomic order,
//                    cds?:[start1,end1] (first base of ATG .. last base of stop, genomic
//                    ascending), utr5?, utr3?: [[start1,end1]], protein?}
//     cpgIslands   [{start0, end0, length, cpgNum, gcNum, perCpg, perGc, obsExp}]
//     repeats      [{start0, end0, name, cls, family, strand}]
//     contains1(pos1), contains0(start0, end0)
//     seq0(start0, end0)          + strand bases of [start0, end0).
//     seq1(start1, end1)          + strand bases of start1..end1 inclusive.
//     base1(pos1)                 one base.
//     phylop1(pos1)               phyloP100way at one base (0.1 resolution), or null.
//     phylopBins0(start0, end0, n)  n equal bins [{start0, end0, mean, min, max, n}];
//                                 mean/min/max null when a bin has no data.
//     gc0(start0, end0)           G+C fraction.
//     cpgs0(start0, end0)         1-based positions of the C of each CpG whose two
//                                 bases both lie in [start0, end0).
//     cpgStats0(start0, end0, {masked})  {length, c, g, cpg, gcFrac, obsExp}; obsExp is
//                                 the UCSC formula cpg * length / (c * g). masked: true
//                                 treats soft-masked repeat bases as N, which is how
//                                 cpgIslandExt was computed (the main island has 205
//                                 CpGs unmasked, 204 masked).
//     softmask     [[start0, end0]] UCSC lower-case (RepeatMasker + TRF) runs.
//     isMasked1(pos1)             true inside a soft-masked run.
//     gene(symbol), transcript(id), canonical(symbol)
//     tss1(tx)                    transcript 5' end (start1 on +, end1 on -).
//     exonsInOrder(tx)            [{number, start1, end1}] numbered 5' to 3'.
//     cdsPositions(tx)            1-based genomic positions of every CDS base in
//                                 transcript order (stop codon included).
//     codon(tx, n)                {n, pos1:[3, transcript order], plus:[3 ascending],
//                                 codon (transcript strand), aa, exon (number)}.
//                                 pos1/exon need only the model; codon/aa need the
//                                 bases to lie in the region (else codon null).
//     translate(tx)               protein from the CDS, '*' for the stop.
//     relToTSS(pos1, tx)          position relative to tx's TSS (no 0).
//     posFromTSS(rel, tx)         inverse.
//     motifScan0(start0, end0, pwm)  {start0, fwd, rev}: Float64Arrays, index i is the
//                                 motif window starting at start0 + i; rev scores the
//                                 reverse complement of the same window (- strand).
//     motifHits0(start0, end0, pwm, minRel)  [{start1, end1, strand, score, rel, site}]
//                                 one per window (its better strand), sorted by
//                                 score; site is read on the hit's strand.
//
//   Static helpers:
//     revcomp(s), complement(s)   A<->T, C<->G, N->N, case kept.
//     translateCodon(c)           standard code, '*' stop, 'X' unknown.
//     oneBasedToBed(start1, end1) -> {start0, end0};  bedToOneBased(start0, end0)
//                                 -> {start1, end1}.
//     relToTSS(pos1, tss1, strand), posFromTSS(rel, tss1, strand)  (strand +1 / -1)
//     pwmFromPfm(pfm, {bg, pseudo})  pfm {A:[..],C,G,T} counts. bg is a G+C fraction
//                                 (default 0.5) or {A,C,G,T}. pseudo (default 0.8)
//                                 is split by bg. Score per column
//                                 log2(((count + pseudo*bg) / (N + pseudo)) / bg).
//                                 -> {length, cols:[{A,C,G,T}], min, max, bg}.
//     scanPWM(seq, pwm)           -> {fwd, rev} Float64Arrays over every window
//                                 (-Infinity where the window has a non-ACGT base).
//     relScore(pwm, score)        (score - min) / (max - min), 0..1.
//     motifHits(seq, pwm, minRel) [{offset (0-based in seq), strand, score, rel, site}],
//                                 one per window, the better strand (ties +).
//     countHits(seq, pwm, minRel) windows whose better strand is at or above minRel.
//     mulberry32(seed)            -> () => uniform [0, 1).
//     dinucShuffle(seq, seed)     Altschul-Erickson shuffle: same first and last base
//                                 and exactly the same dinucleotide counts; uniform
//                                 over such sequences; deterministic per seed.
//     dinucCounts(seq)            {AA: n, AC: n, ...} over overlapping pairs.
//     shuffledHitCounts(seq, pwm, minRel, nShuffles, seed)  hit counts in nShuffles
//                                 dinucleotide shuffles (seeds seed, seed+1, ...).
//     consensusMatches(seq20)     matches of a 20-mer to RRRCWWGYYYRRRCWWGYYY.
//   runChecks(print, json)        [{name, ok, detail}]; with json it checks the data
//                                 against facts from independent sources (above).
(function (root) {
  "use strict";

  var COMP = { A: "T", C: "G", G: "C", T: "A", N: "N", a: "t", c: "g", g: "c", t: "a", n: "n" };
  function complement(s) { var o = ""; for (var i = 0; i < s.length; i++) o += COMP[s[i]] || "N"; return o; }
  function revcomp(s) { var o = ""; for (var i = s.length - 1; i >= 0; i--) o += COMP[s[i]] || "N"; return o; }

  var AA = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  var BI = { T: 0, C: 1, A: 2, G: 3 };
  function translateCodon(c) {
    c = String(c).toUpperCase();
    var a = BI[c[0]], b = BI[c[1]], d = BI[c[2]];
    if (c.length !== 3 || a === undefined || b === undefined || d === undefined) return "X";
    return AA[a * 16 + b * 4 + d];
  }

  function oneBasedToBed(start1, end1) { return { start0: start1 - 1, end0: end1 }; }
  function bedToOneBased(start0, end0) { return { start1: start0 + 1, end1: end0 }; }
  function relToTSS(pos1, tss1, strand) {
    var d = (strand < 0) ? tss1 - pos1 : pos1 - tss1;
    return d >= 0 ? d + 1 : d;
  }
  function posFromTSS(rel, tss1, strand) {
    if (rel === 0 || rel !== Math.round(rel)) throw new Error("relToTSS positions are nonzero integers");
    var d = rel > 0 ? rel - 1 : rel;
    return strand < 0 ? tss1 - d : tss1 + d;
  }

  // ---------- motifs ----------
  var IDX = { A: 0, C: 1, G: 2, T: 3 };
  function bgOf(bg) {
    if (bg == null) bg = 0.5;
    if (typeof bg === "number") return { A: (1 - bg) / 2, C: bg / 2, G: bg / 2, T: (1 - bg) / 2 };
    return bg;
  }
  function pwmFromPfm(pfm, opts) {
    opts = opts || {};
    var bg = bgOf(opts.bg), pseudo = opts.pseudo == null ? 0.8 : opts.pseudo;
    var L = pfm.A.length, cols = [], min = 0, max = 0;
    for (var i = 0; i < L; i++) {
      var n = pfm.A[i] + pfm.C[i] + pfm.G[i] + pfm.T[i], col = {}, lo = Infinity, hi = -Infinity;
      "ACGT".split("").forEach(function (b) {
        var v = Math.log(((pfm[b][i] + pseudo * bg[b]) / (n + pseudo)) / bg[b]) / Math.LN2;
        col[b] = v; if (v < lo) lo = v; if (v > hi) hi = v;
      });
      cols.push(col); min += lo; max += hi;
    }
    // flat array [pos*4 + base] for scanning
    var flat = new Float64Array(L * 4);
    for (var k = 0; k < L; k++) { flat[k * 4] = cols[k].A; flat[k * 4 + 1] = cols[k].C; flat[k * 4 + 2] = cols[k].G; flat[k * 4 + 3] = cols[k].T; }
    return { length: L, cols: cols, min: min, max: max, bg: bg, flat: flat };
  }
  function relScore(pwm, s) { return (s - pwm.min) / (pwm.max - pwm.min); }
  function codes(seq) {
    var c = new Int8Array(seq.length);
    for (var i = 0; i < seq.length; i++) { var v = IDX[seq[i].toUpperCase()]; c[i] = v === undefined ? -1 : v; }
    return c;
  }
  function scanPWM(seq, pwm) {
    var L = pwm.length, n = Math.max(0, seq.length - L + 1), f = pwm.flat, c = codes(seq);
    var fwd = new Float64Array(n), rev = new Float64Array(n);
    for (var i = 0; i < n; i++) {
      var s = 0, r = 0, bad = false;
      for (var k = 0; k < L; k++) {
        var b = c[i + k];
        if (b < 0) { bad = true; break; }
        s += f[k * 4 + b];
        // reverse strand: motif position L-1-k reads the complement (3 - b) of base i+k
        r += f[(L - 1 - k) * 4 + (3 - b)];
      }
      fwd[i] = bad ? -Infinity : s; rev[i] = bad ? -Infinity : r;
    }
    return { fwd: fwd, rev: rev };
  }
  // One entry per window: the better of its two strands (ties go to +). The p53
  // motif is nearly palindromic, so counting both strands would count most sites twice.
  function motifHits(seq, pwm, minRel) {
    var sc = scanPWM(seq, pwm), out = [], L = pwm.length;
    for (var i = 0; i < sc.fwd.length; i++) {
      var plus = sc.fwd[i] >= sc.rev[i], best = plus ? sc.fwd[i] : sc.rev[i], rel = relScore(pwm, best);
      if (rel < minRel) continue;
      var w = seq.slice(i, i + L);
      out.push({ offset: i, strand: plus ? "+" : "-", score: best, rel: rel, site: plus ? w : revcomp(w) });
    }
    return out.sort(function (a, b) { return b.score - a.score || a.offset - b.offset; });
  }
  function countHits(seq, pwm, minRel) {
    var sc = scanPWM(seq, pwm), t = pwm.min + minRel * (pwm.max - pwm.min), n = 0;
    for (var i = 0; i < sc.fwd.length; i++) if (sc.fwd[i] >= t || sc.rev[i] >= t) n++;
    return n;
  }

  // ---------- randomness and shuffles ----------
  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function dinucCounts(seq) {
    var o = {};
    for (var i = 0; i + 1 < seq.length; i++) { var k = seq[i] + seq[i + 1]; o[k] = (o[k] || 0) + 1; }
    return o;
  }
  // Altschul & Erickson 1985 (Mol Biol Evol 2:526), with the random last-edge
  // arborescence drawn by Wilson's loop-erased random walk (Kandel et al. 1996).
  function dinucShuffle(seq, seed) {
    if (seq.length < 3) return seq;
    var rnd = mulberry32(seed == null ? 1 : seed);
    var edges = {}, i, v;
    for (i = 0; i + 1 < seq.length; i++) (edges[seq[i]] = edges[seq[i]] || []).push(seq[i + 1]);
    var last = seq[seq.length - 1], verts = Object.keys(edges).sort();
    var inTree = {}, next = {}, lastIdx = {};
    inTree[last] = true;
    verts.forEach(function (start) {
      var u = start;
      while (!inTree[u]) {
        var k = Math.floor(rnd() * edges[u].length);
        lastIdx[u] = k; next[u] = edges[u][k]; u = next[u];
      }
      u = start;
      while (!inTree[u]) { inTree[u] = true; u = next[u]; }
    });
    var order = {};
    verts.forEach(function (u) {
      var e = edges[u].slice(), tail = null;
      if (u !== last) { tail = e[lastIdx[u]]; e.splice(lastIdx[u], 1); }
      for (var j = e.length - 1; j > 0; j--) { var r = Math.floor(rnd() * (j + 1)), t = e[j]; e[j] = e[r]; e[r] = t; }
      if (tail !== null) e.push(tail);
      order[u] = e;
    });
    var ptr = {}, out = [seq[0]], cur = seq[0];
    for (i = 1; i < seq.length; i++) { v = order[cur][ptr[cur] = (ptr[cur] || 0)]; ptr[cur]++; out.push(v); cur = v; }
    return out.join("");
  }
  function shuffledHitCounts(seq, pwm, minRel, nShuffles, seed) {
    var out = [];
    for (var k = 0; k < nShuffles; k++) out.push(countHits(dinucShuffle(seq, (seed >>> 0) + k), pwm, minRel));
    return out;
  }
  var CONS = "RRRCWWGYYYRRRCWWGYYY", IUPAC = { R: "AG", Y: "CT", W: "AT", C: "C", G: "G" };
  function consensusMatches(s) {
    var n = 0; s = s.toUpperCase();
    for (var i = 0; i < 20; i++) if (IUPAC[CONS[i]].indexOf(s[i]) >= 0) n++;
    return n;
  }

  // ---------- phyloP decoding ----------
  function decodeB64(b64) {
    var bin = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
    var a = new Int8Array(bin.length);
    for (var i = 0; i < bin.length; i++) { var c = bin.charCodeAt(i); a[i] = c > 127 ? c - 256 : c; }
    return a;
  }

  // ---------- Region ----------
  function Region(name, r) {
    var self = this;
    this.name = name; this.chrom = r.chrom; this.start0 = r.start0; this.end0 = r.end0;
    this.start1 = r.start0 + 1; this.end1 = r.end0; this.length = r.end0 - r.start0;
    this.cytoband = r.cytoband; this.genes = r.genes; this.cpgIslands = r.cpgIslands;
    this.repeats = (r.repeats || []).map(function (x) { return { start0: x[0], end0: x[1], name: x[2], cls: x[3], family: x[4], strand: x[5] }; });
    this.source = r.source;
    var seq = r.seq, ph = decodeB64(r.phylop.b64), miss = r.phylop.missing, scale = r.phylop.scale;
    this.softmask = r.softmask || [];
    var masked = new Uint8Array(seq.length);
    this.softmask.forEach(function (m) { for (var p = m[0]; p < m[1]; p++) masked[p - r.start0] = 1; });
    this.isMasked1 = function (p) { return self.contains1(p) && masked[p - self.start1] === 1; };
    this._seq = seq; this._ph = ph; this.phylopExact = r.phylop.exact;
    function chk0(a, b) {
      if (!(a >= self.start0 && b <= self.end0 && a <= b)) throw new RangeError(name + ": [" + a + ", " + b + ") outside [" + self.start0 + ", " + self.end0 + ")");
    }
    this.contains1 = function (p) { return p >= self.start1 && p <= self.end1; };
    this.contains0 = function (a, b) { return a >= self.start0 && b <= self.end0 && a <= b; };
    this.seq0 = function (a, b) { chk0(a, b); return seq.slice(a - self.start0, b - self.start0); };
    this.seq1 = function (a, b) { return self.seq0(a - 1, b); };
    this.base1 = function (p) { return self.seq0(p - 1, p); };
    this.phylop1 = function (p) {
      if (!self.contains1(p)) return null;
      var v = ph[p - self.start1]; return v === miss ? null : v * scale;
    };
    this.phylopBins0 = function (a, b, n) {
      chk0(a, b); var out = [], w = (b - a) / n;
      for (var k = 0; k < n; k++) {
        var s = Math.round(a + k * w), e = Math.round(a + (k + 1) * w), sum = 0, c = 0, lo = Infinity, hi = -Infinity;
        for (var p = s; p < e; p++) { var v = ph[p - self.start0]; if (v === miss) continue; v *= scale; sum += v; c++; if (v < lo) lo = v; if (v > hi) hi = v; }
        out.push({ start0: s, end0: e, mean: c ? sum / c : null, min: c ? lo : null, max: c ? hi : null, n: c });
      }
      return out;
    };
    this.cpgStats0 = function (a, b, opts) {
      var s = self.seq0(a, b), c = 0, g = 0, cpg = 0, mk = opts && opts.masked, o = a - self.start0;
      if (mk) s = s.split("").map(function (x, i) { return masked[o + i] ? "N" : x; }).join("");
      for (var i = 0; i < s.length; i++) {
        if (s[i] === "C") { c++; if (s[i + 1] === "G") cpg++; } else if (s[i] === "G") g++;
      }
      return { length: s.length, c: c, g: g, cpg: cpg, gcFrac: s.length ? (c + g) / s.length : 0, obsExp: c && g ? cpg * s.length / (c * g) : 0 };
    };
    this.gc0 = function (a, b) { return self.cpgStats0(a, b).gcFrac; };
    this.cpgs0 = function (a, b) {
      var s = self.seq0(a, b), out = [];
      for (var i = 0; i + 1 < s.length; i++) if (s[i] === "C" && s[i + 1] === "G") out.push(a + i + 1);
      return out;
    };
    var txIndex = {};
    (this.genes || []).forEach(function (g) { g.transcripts.forEach(function (t) { txIndex[t.id] = t; t.gene = g.symbol || g.id; }); });
    function tx(t) { var o = typeof t === "string" ? txIndex[t] : t; if (!o) throw new Error("unknown transcript " + t); return o; }
    this.transcript = function (id) { return txIndex[id] || null; };
    this.gene = function (sym) { return (self.genes || []).filter(function (g) { return g.symbol === sym; })[0] || null; };
    this.canonical = function (sym) { var g = self.gene(sym); return g ? g.transcripts.filter(function (t) { return t.canonical; })[0] : null; };
    this.tss1 = function (t) { t = tx(t); return t.strand > 0 ? t.start1 : t.end1; };
    this.relToTSS = function (p, t) { t = tx(t); return relToTSS(p, self.tss1(t), t.strand); };
    this.posFromTSS = function (rel, t) { t = tx(t); return posFromTSS(rel, self.tss1(t), t.strand); };
    this.exonsInOrder = function (t) {
      t = tx(t); var ex = t.exons.slice(); if (t.strand < 0) ex.reverse();
      return ex.map(function (e, i) { return { number: i + 1, start1: e[0], end1: e[1] }; });
    };
    this.cdsPositions = function (t) {
      t = tx(t); if (!t.cds) return [];
      var out = [];
      self.exonsInOrder(t).forEach(function (e) {
        var a = Math.max(e.start1, t.cds[0]), b = Math.min(e.end1, t.cds[1]), p;
        if (a > b) return;
        if (t.strand > 0) for (p = a; p <= b; p++) out.push(p); else for (p = b; p >= a; p--) out.push(p);
      });
      return out;
    };
    var cdsCache = {};
    this.codon = function (t, n) {
      t = tx(t);
      var cds = cdsCache[t.id] || (cdsCache[t.id] = self.cdsPositions(t));
      if (n < 1 || 3 * n > cds.length) return null;
      var pos = cds.slice(3 * n - 3, 3 * n), ok = pos.every(self.contains1);
      var c = ok ? pos.map(function (p) { var b = self.base1(p); return t.strand > 0 ? b : COMP[b]; }).join("") : null;
      var ex = self.exonsInOrder(t).filter(function (e) { return e.start1 <= pos[1] && pos[1] <= e.end1; })[0];
      return { n: n, pos1: pos, plus: pos.slice().sort(function (a, b) { return a - b; }), codon: c, aa: c ? translateCodon(c) : null, exon: ex ? ex.number : null };
    };
    this.translate = function (t) {
      t = tx(t); var cds = self.cdsPositions(t), p = "";
      for (var i = 0; i + 2 < cds.length; i += 3) p += self.codon(t, i / 3 + 1).aa || "X";
      return p;
    };
    this.motifScan0 = function (a, b, pwm) {
      var sc = scanPWM(self.seq0(a, b), pwm); return { start0: a, fwd: sc.fwd, rev: sc.rev };
    };
    this.motifHits0 = function (a, b, pwm, minRel) {
      return motifHits(self.seq0(a, b), pwm, minRel).map(function (h) {
        return { start1: a + h.offset + 1, end1: a + h.offset + pwm.length, strand: h.strand, score: h.score, rel: h.rel, site: h.site };
      });
    };
  }

  function load(json) {
    if (!json || !json.regions) throw new Error("BioLocus.load: pass the parsed locus.json");
    var regions = {};
    Object.keys(json.regions).forEach(function (k) { regions[k] = new Region(k, json.regions[k]); });
    return {
      json: json, sources: json.sources, cdkn1a: json.cdkn1a, tp53: json.tp53, jaspar: json.jaspar, cytobands: json.cytobands,
      region: function (name) { if (!regions[name]) throw new Error("no region " + name); return regions[name]; },
      tss: function (kind) { return json.cdkn1a.tss[kind || "ensembl"].pos1; },
      p53Sites: function () {
        return json.cdkn1a.p53Sites.map(function (s) {
          var o = {}; Object.keys(s).forEach(function (k) { o[k] = s[k]; });
          o.start0 = s.start1 - 1; o.end0 = s.end1; return o;
        });
      },
      pwm: function (opts) { return pwmFromPfm(json.jaspar.pfm, opts); }
    };
  }

  // ---------- checks ----------
  function runChecks(print, json) {
    var res = [];
    function check(name, ok, detail) { res.push({ name: name, ok: !!ok, detail: detail || "" }); if (print) console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); }
    function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
    function sameCounts(a, b) {
      var ka = Object.keys(a), kb = Object.keys(b);
      return ka.length === kb.length && ka.every(function (k) { return a[k] === b[k]; });
    }

    // Synthetic checks (need no data)
    var rnd = mulberry32(7), syn = "";
    for (var i = 0; i < 3000; i++) syn += "ACGT"[Math.floor(rnd() * 4)];
    check("revcomp round-trips and pairs bases", revcomp(revcomp(syn)) === syn && revcomp("AACGTN") === "NACGTT" && complement("ACGT") === "TGCA");
    check("standard code: ATG M, TGA stop, CGC R, CAC H", translateCodon("ATG") === "M" && translateCodon("TGA") === "*" && translateCodon("CGC") === "R" && translateCodon("CAC") === "H" && AA.length === 64);
    var sh = dinucShuffle(syn, 11), sh2 = dinucShuffle(syn, 11), sh3 = dinucShuffle(syn, 12);
    check("dinucleotide shuffle keeps every dinucleotide count, first and last base",
      sameCounts(dinucCounts(sh), dinucCounts(syn)) && sh.length === syn.length && sh[0] === syn[0] && sh[sh.length - 1] === syn[syn.length - 1]);
    var same = 0; for (i = 0; i < syn.length; i++) if (sh[i] === syn[i]) same++;
    check("shuffle is seeded and actually shuffles", sh === sh2 && sh !== sh3 && same / syn.length < 0.4, "identity with input " + (same / syn.length).toFixed(2));
    check("1-based <-> BED conversion round-trips", eq(bedToOneBased(oneBasedToBed(101, 120).start0, 120), { start1: 101, end1: 120 }) && oneBasedToBed(101, 120).start0 === 100);
    check("TSS-relative positions skip 0 on both strands",
      relToTSS(1000, 1000, 1) === 1 && relToTSS(999, 1000, 1) === -1 && relToTSS(1001, 1000, -1) === -1 && relToTSS(999, 1000, -1) === 2 &&
      posFromTSS(-1, 1000, 1) === 999 && posFromTSS(2, 1000, -1) === 999 && posFromTSS(relToTSS(1234, 1000, -1), 1000, -1) === 1234);
    if (!json) return res;

    var L = load(json), R = L.region("cdkn1a"), T = L.region("tp53");
    var seqOk = [R, T].every(function (g) { return g._seq.length === g.end0 - g.start0 && /^[ACGT]+$/.test(g._seq); });
    check("sequence length equals end0 - start0 (40,000 and " + T.length + " bp), ACGT only", seqOk && R.length === 40000);
    check("seq1(a, b) equals seq0(a - 1, b)", R.seq1(36678714, 36678798) === R.seq0(36678713, 36678798) && R.seq1(36678714, 36678798).length === 85);
    var xs = json.crossChecks.ensemblSlice, m = /^6:(\d+)\.\.(\d+):1$/.exec(xs.region);
    check("UCSC sequence matches an Ensembl REST slice (" + xs.region + ")", m && R.seq1(+m[1], +m[2]) === xs.seq);
    check("revcomp round-trips the 40 kb region", revcomp(revcomp(R._seq)) === R._seq && revcomp(R._seq) !== R._seq);

    // CpG islands against the UCSC table
    var isl = R.cpgIslands.map(function (c) {
      var s = R.cpgStats0(c.start0, c.end0, { masked: true }), u = R.cpgStats0(c.start0, c.end0);
      return { c: c, s: s, u: u, ok: s.cpg === c.cpgNum && Math.abs(s.c + s.g - c.gcNum) <= 1 && Math.abs(s.obsExp - c.obsExp) <= 0.005 && Math.abs(100 * s.gcFrac - c.perGc) <= 0.05 && s.length === c.length };
    });
    check("CpG islands: CpG count and obs/exp recomputed from the repeat-masked sequence equal cpgIslandExt",
      isl.length === 2 && isl.every(function (x) { return x.ok; }),
      isl.map(function (x) { return x.s.cpg + " CpG (" + x.u.cpg + " unmasked), o/e " + x.s.obsExp.toFixed(3) + " vs " + x.c.obsExp + ", G+C " + (x.s.c + x.s.g) + " vs " + x.c.gcNum; }).join("; "));
    var main = R.cpgIslands[0], up = R.cpgStats0(main.start0 - 2000, main.start0);
    check("islands meet the island criteria (unmasked too); the 2 kb upstream holding both p53 sites does not",
      isl.every(function (x) { return x.s.length >= 200 && x.u.gcFrac >= 0.5 && x.u.obsExp >= 0.6 && x.s.obsExp >= 0.6; }) && up.obsExp < 0.6,
      "upstream 2 kb: GC " + up.gcFrac.toFixed(2) + ", obs/exp " + up.obsExp.toFixed(2) + ", " + up.cpg + " CpG");
    var tssE = L.tss("ensembl"), cdk = R.canonical("CDKN1A");
    check("main island spans TSS -246..+1975", R.relToTSS(main.start0 + 1, cdk) === -246 && R.relToTSS(main.end0, cdk) === 1975 && tssE === 36678714);

    // CDKN1A model and protein
    var prot = R.translate(cdk);
    check("CDKN1A canonical CDS translates to the Ensembl p21 protein (164 aa)", prot === json.cdkn1a.protein + "*" && json.cdkn1a.protein.length === 164 && prot[0] === "M");
    var alts = json.cdkn1a.alternatives.map(R.transcript);
    check("CDKN1A alternatives share the canonical CDS", alts.every(function (t) { return t && eq(t.cds, cdk.cds) && R.translate(t) === prot; }));
    var modelOk = R.genes.concat(T.genes).every(function (g) {
      return g.transcripts.every(function (t) {
        var ex = t.exons, ok = ex.every(function (e, k) { return e[0] <= e[1] && (k === 0 || ex[k - 1][1] < e[0]); });
        if (t.cds) {
          var len = function (a) { return (a || []).reduce(function (s, e) { return s + e[1] - e[0] + 1; }, 0); };
          ok = ok && len(ex) === len(t.utr5) + len(t.utr3) + R.cdsPositions(t).length && R.cdsPositions(t).length % 3 === 0;
        }
        return ok;
      });
    });
    check("every transcript: exons ascending and disjoint; UTR5 + CDS + UTR3 = exon length", modelOk);
    check("cytobands: CDKN1A window in 6p21.2 (el-Deiry 1993), TP53 window in 17p13.1", R.cytoband === "6p21.2" && T.cytoband === "17p13.1");

    // p53 response elements
    var sites = L.p53Sites();
    check("p53 sites: hg38 bases equal the el-Deiry sequences, 18/20 consensus matches",
      sites.length === 2 && sites.every(function (s) { return R.seq1(s.start1, s.end1) === s.seq && consensusMatches(s.seq) === 18 && s.consensusMatches === 18; }));
    check("p53 sites at -2265 and -1383 from the Ensembl TSS",
      R.relToTSS(sites[0].start1, cdk) === -2265 && R.relToTSS(sites[1].start1, cdk) === -1383 &&
      relToTSS(sites[0].start1, tssE, 1) === sites[0].relEnsemblTSS[0]);
    var lit = L.tss("literature");
    check("literature +1 (Resnick-Silverman 1998 via U24170) is 15 bp downstream of the Ensembl TSS",
      lit - tssE === 15 && relToTSS(sites[1].start1, lit, 1) === -1398 && sites[1].resnick1998[0] === -1395,
      "3' site: -1395 in U24170 numbering, -1398 in hg38 from the same +1");

    // PWM scan: 04's window, TSS +/- 10 kb
    var pfm = json.jaspar.pfm;
    check("JASPAR " + json.jaspar.id + " is the latest MA0106, 18 columns", json.jaspar.id === json.jaspar.latestOf[json.jaspar.latestOf.length - 1] && pfm.A.length === 18);
    var a0 = tssE - 1 - 10000, b0 = tssE + 10000, gc = R.gc0(a0, b0), pwm = L.pwm({ bg: gc });
    var hits = R.motifHits0(a0, b0, pwm, 0.8);
    var near = function (s) { return hits.filter(function (h) { return h.start1 <= s.end1 && h.end1 >= s.start1; })[0]; };
    var h5 = near(sites[0]), h3 = near(sites[1]);
    check("both p53 sites are motif hits (relative score >= 0.80); the 5' site is the best in 20 kb",
      h5 && h3 && hits[0] === h5,
      h5 && h3 ? "5' rel " + h5.rel.toFixed(3) + " rank 1; 3' rel " + h3.rel.toFixed(3) + " rank " + (hits.indexOf(h3) + 1) + " of " + hits.length : "missing");
    var w = R.seq0(a0, b0), sc = scanPWM(w, pwm), sr = scanPWM(revcomp(w), pwm), n = sc.fwd.length, sym = true;
    for (i = 0; i < n; i += 97) if (Math.abs(sc.fwd[i] - sr.rev[n - 1 - i]) > 1e-9 || Math.abs(sc.rev[i] - sr.fwd[n - 1 - i]) > 1e-9) sym = false;
    check("scan is strand-symmetric: scoring the reverse complement swaps the strands", sym);
    var wsh = dinucShuffle(w, 2024);
    check("shuffle of the 20 kb window keeps its dinucleotide counts (CpG " + (dinucCounts(w).CG || 0) + ")", sameCounts(dinucCounts(wsh), dinucCounts(w)) && wsh !== w);

    // TP53 codon 175
    var tp = T.transcript(json.tp53.transcript), c175 = T.codon(tp, 175), d = json.tp53;
    check("TP53 codon 175 is CGC (Arg) on the minus strand, + strand GCG, exon 5 of 11",
      c175.codon === "CGC" && c175.aa === "R" && T.seq1(c175.plus[0], c175.plus[2]) === "GCG" && c175.exon === 5 && tp.exons.length === 11 && d.protein[174] === "R",
      "chr17:" + c175.plus[0] + "-" + c175.plus[2]);
    check("c.524 is chr17:7,675,088 (Ensembl map/cds, VEP and ClinVar agree)",
      c175.pos1[1] === 7675088 && d.r175h.pos1 === 7675088 && d.codon175.cdsBases["524"] === 7675088 && T.cdsPositions(tp)[523] === 7675088);
    var v = d.r175h.vcf, bed = d.r175h.bed;
    check("R175H VCF REF C is the reference base; both off-by-one readings land on a G of GCG",
      T.base1(v.pos) === v.ref && v.ref === "C" && bed.start0 + 1 === v.pos && T.base1(bed.start0) === "G" && T.base1(v.pos + 1) === "G",
      "VCF POS read as 0-based start reads chr17:" + (v.pos + 1) + " (" + T.base1(v.pos + 1) + ")");
    check("TP53 transcript translates to the Ensembl protein where its CDS is in the window",
      [174, 175, 176, 160, 190].every(function (k) { var c = T.codon(tp, k); return !c.codon || c.aa === d.protein[k - 1]; }) && d.protein.length === 393);

    // phyloP decoding
    var ph = [R, T].every(function (g) { return g.phylopExact.every(function (e) { return Math.abs(g.phylop1(e[0]) - e[1]) <= 0.05 + 1e-9; }); });
    check("phyloP decodes to within 0.05 of the exact UCSC values; every base covered",
      ph && json.regions.cdkn1a.phylop.covered === 40000 && json.regions.tp53.phylop.covered === T.length,
      "c.524 phyloP " + T.phylop1(7675088).toFixed(1));
    return res;
  }

  var api = {
    load: load, revcomp: revcomp, complement: complement, translateCodon: translateCodon,
    oneBasedToBed: oneBasedToBed, bedToOneBased: bedToOneBased, relToTSS: relToTSS, posFromTSS: posFromTSS,
    pwmFromPfm: pwmFromPfm, scanPWM: scanPWM, relScore: relScore, motifHits: motifHits, countHits: countHits,
    mulberry32: mulberry32, dinucShuffle: dinucShuffle, dinucCounts: dinucCounts, shuffledHitCounts: shuffledHitCounts,
    consensusMatches: consensusMatches, runChecks: runChecks
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioLocus = api;
})(typeof window !== "undefined" ? window : globalThis);
