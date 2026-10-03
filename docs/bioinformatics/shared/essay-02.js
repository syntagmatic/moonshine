// BioEssay02: the model code behind essay 02 (Genome Browser), kept out of the page so it
// can be checked on its own. Browser global `BioEssay02`; `module.exports` under node.
//
// What the page relies on:
//   - interpret(record, countFrom): where a coordinate lands when its number is read in
//     a given convention. The figure's coordinate control is this function.
//   - simulateReads(opts): seeded short reads over a real reference slice, a set
//     fraction carrying one planted variant, plus random sequencing errors. Labelled
//     simulated on the page.
//   - pileup(reads, lo1, hi1): depth and per-base counts at every position.
//   - packRows(reads, lo1, hi1, gap): stacks reads into rows for drawing.
//   - alleles(column, refBase): depth, reference and alternative counts at one base.
//
// Coordinates follow BioLocus: names ending in 1 are 1-based closed (VCF, Ensembl, the
// browser box); names ending in 0 are 0-based half-open (BED). Sequences are + strand.
//
// API
//   mulberry32(seed) -> () => [0, 1)
//   complement(s), revcomp(s), translateCodon(c)   standard genetic code, '*' stop
//   interpret({format: 'vcf', pos} | {format: 'bed', start, end}, countFrom 1 | 0)
//       -> {pos1, intended: bool, shift}  pos1 is the base the number points at when
//          read as a 1-based position (countFrom 1) or a 0-based start (countFrom 0).
//          intended is true when the convention matches the format (VCF 1, BED 0);
//          shift is pos1 minus the intended base.
//   simulateReads({ref, refStart1, center1, half, readLen, depth, vaf, varPos1, alt,
//                  errRate, seed}) -> [{id, start1, end1, strand, seq, mut, errors}]
//       reads start uniformly so that every base in center1 +- half is expected to have
//       `depth` reads; each read carries `alt` at varPos1 with probability vaf; every
//       base is then miscalled with probability errRate (as one of the other three).
//   pileup(reads, lo1, hi1) -> [{pos1, depth, A, C, G, T}]  (depth by difference array)
//   packRows(reads, lo1, hi1, gap = 1) -> {rows, rowOf: Map(id -> row)}  greedy by start
//       on the read extents clipped to [lo1, hi1]; minimal for interval graphs.
//   alleles(column, refBase) -> {depth, ref, alt, altBase, vaf}
//   runChecks(print, data) -> [{name, ok, detail}]; data = essay-02.json (Ensembl slices).
(function (root) {
  "use strict";

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const COMP = { A: "T", C: "G", G: "C", T: "A", N: "N" };
  function complement(s) { return s.split("").map(b => COMP[b] || "N").join(""); }
  function revcomp(s) { return complement(s).split("").reverse().join(""); }

  // Standard code, bases in TCAG order (NCBI translation table 1).
  const AA = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  const IDX = { T: 0, C: 1, A: 2, G: 3 };
  function translateCodon(c) {
    if (!c || c.length !== 3) return "X";
    const i = IDX[c[0]], j = IDX[c[1]], k = IDX[c[2]];
    if (i == null || j == null || k == null) return "X";
    return AA[i * 16 + j * 4 + k];
  }

  function interpret(record, countFrom) {
    const n = record.format === "vcf" ? record.pos : record.start;
    const pos1 = countFrom === 1 ? n : n + 1;
    const intendedFrom = record.format === "vcf" ? 1 : 0;
    const truePos1 = intendedFrom === 1 ? n : n + 1;
    return { pos1, intended: countFrom === intendedFrom, shift: pos1 - truePos1 };
  }

  function simulateReads(o) {
    const readLen = o.readLen || 100;
    const rng = mulberry32(o.seed == null ? 1 : o.seed);
    const lo = o.center1 - o.half - readLen + 1, hi = o.center1 + o.half;
    const span = hi - lo + 1;
    const n = Math.round(o.depth * span / readLen);
    const refEnd1 = o.refStart1 + o.ref.length - 1;
    const reads = [];
    for (let r = 0; r < n; r++) {
      let start1 = lo + Math.floor(rng() * span);
      start1 = Math.max(o.refStart1, Math.min(refEnd1 - readLen + 1, start1));
      const end1 = start1 + readLen - 1;
      const strand = rng() < 0.5 ? "+" : "-";
      const mut = rng() < o.vaf;
      const bases = o.ref.slice(start1 - o.refStart1, end1 - o.refStart1 + 1).split("");
      if (mut && o.varPos1 >= start1 && o.varPos1 <= end1) bases[o.varPos1 - start1] = o.alt;
      let errors = 0;
      for (let i = 0; i < bases.length; i++) {
        if (rng() < o.errRate) {
          const others = "ACGT".replace(bases[i], "");
          bases[i] = others[Math.floor(rng() * 3)];
          errors++;
        }
      }
      reads.push({ id: r, start1, end1, strand, seq: bases.join(""), mut: mut && o.varPos1 >= start1 && o.varPos1 <= end1, errors });
    }
    reads.sort((a, b) => a.start1 - b.start1 || a.id - b.id);
    return reads;
  }

  function pileup(reads, lo1, hi1) {
    const len = hi1 - lo1 + 1;
    const diff = new Int32Array(len + 1);
    const cols = [];
    for (let i = 0; i < len; i++) cols.push({ pos1: lo1 + i, depth: 0, A: 0, C: 0, G: 0, T: 0 });
    for (const r of reads) {
      const a = Math.max(lo1, r.start1), b = Math.min(hi1, r.end1);
      if (a > b) continue;
      diff[a - lo1] += 1; diff[b - lo1 + 1] -= 1;
      for (let p = a; p <= b; p++) {
        const base = r.seq[p - r.start1];
        if (cols[p - lo1][base] != null) cols[p - lo1][base]++;
      }
    }
    let run = 0;
    for (let i = 0; i < len; i++) { run += diff[i]; cols[i].depth = run; }
    return cols;
  }

  function packRows(reads, lo1, hi1, gap) {
    gap = gap == null ? 1 : gap;
    const ends = [];
    const rowOf = new Map();
    const vis = reads.filter(r => r.end1 >= lo1 && r.start1 <= hi1)
      .map(r => ({ id: r.id, a: Math.max(lo1, r.start1), b: Math.min(hi1, r.end1) }))
      .sort((x, y) => x.a - y.a || x.id - y.id);
    for (const r of vis) {
      let row = ends.findIndex(e => e + gap < r.a);
      if (row < 0) { row = ends.length; ends.push(r.b); } else ends[row] = r.b;
      rowOf.set(r.id, row);
    }
    return { rows: ends.length, rowOf };
  }

  function alleles(col, refBase) {
    const depth = col.A + col.C + col.G + col.T;
    let altBase = null, alt = 0;
    for (const b of "ACGT") if (b !== refBase && col[b] > alt) { alt = col[b]; altBase = b; }
    return { depth, ref: col[refBase] || 0, alt, altBase, vaf: depth ? alt / depth : 0 };
  }

  function runChecks(print, data) {
    const out = [];
    const add = (name, ok, detail) => { out.push({ name, ok: !!ok, detail: detail || "" }); if (print) print(`${ok ? "PASS" : "FAIL"} ${name}${detail ? "  (" + detail + ")" : ""}`); };

    // Coordinate conventions against Ensembl's own slices (fetched independently of the
    // UCSC sequence in locus.json). R175H: VCF 17 7675088 C T, BED chr17 7675087 7675088.
    if (data && data.slices && data.slices.tp53Window) {
      const w = data.slices.tp53Window;
      const base = p => w.seq[p - w.start1];
      const vcf = { format: "vcf", pos: 7675088 }, bed = { format: "bed", start: 7675087, end: 7675088 };
      const v1 = interpret(vcf, 1), v0 = interpret(vcf, 0), b0 = interpret(bed, 0), b1 = interpret(bed, 1);
      add("VCF POS read 1-based lands on the REF base C", v1.intended && v1.pos1 === 7675088 && base(v1.pos1) === "C", `pos ${v1.pos1}, base ${base(v1.pos1)}`);
      add("BED start read 0-based lands on the same base", b0.intended && b0.pos1 === v1.pos1, `pos ${b0.pos1}`);
      add("VCF POS read as a 0-based start lands one right, on G", !v0.intended && v0.shift === 1 && base(v0.pos1) === "G", `pos ${v0.pos1}, base ${base(v0.pos1)}`);
      add("BED start read as 1-based lands one left, on G", !b1.intended && b1.shift === -1 && base(b1.pos1) === "G", `pos ${b1.pos1}, base ${base(b1.pos1)}`);
      const plus = w.seq.slice(7675087 - w.start1, 7675089 - w.start1 + 1);
      const tx = revcomp(plus);
      const c = data.slices.tp53Codon175;
      add("Codon 175 on the minus strand is the reverse complement of the + strand", c && tx === c.seq, `+ ${plus}, transcript ${tx}, Ensembl -1 ${c && c.seq}`);
      const mutTx = tx[0] + "A" + tx[2]; // c.524G>A, the middle base of the codon
      add("c.524G>A turns CGC (Arg) into CAC (His)", translateCodon(tx) === "R" && translateCodon(mutTx) === "H" && revcomp(mutTx)[1] === "T", `${tx} ${translateCodon(tx)} -> ${mutTx} ${translateCodon(mutTx)}; + strand ${plus} -> ${revcomp(mutTx)}`);
    } else add("essay-02.json present", false, "no Ensembl slices passed");
    if (data && data.slices && data.slices.cdkn1aStart) {
      add("CDKN1A CDS starts with ATG (Ensembl slice)", data.slices.cdkn1aStart.seq === "ATG" && translateCodon("ATG") === "M", data.slices.cdkn1aStart.seq);
      const e1 = data.slices.cdkn1aExon1;
      add("BED length (end - start) equals the 1-based closed length", e1 && e1.seq.length === e1.end1 - (e1.start1 - 1), `exon 1: ${e1 && e1.seq.length} bases, BED ${e1 && e1.start1 - 1}-${e1 && e1.end1}`);
    }

    // Genetic code: 61 sense codons, 3 stops (TAA TAG TGA), 20 amino acids.
    const all = [];
    for (const a of "TCAG") for (const b of "TCAG") for (const c of "TCAG") all.push(translateCodon(a + b + c));
    add("translation table has 3 stops and 20 amino acids", all.filter(x => x === "*").length === 3 && new Set(all.filter(x => x !== "*")).size === 20 && translateCodon("TGA") === "*");

    // Simulated reads: pileup depth against a naive count; packing has no overlaps and
    // uses exactly as many rows as the deepest column (interval graphs are perfect).
    const ref = data && data.slices && data.slices.tp53Window ? data.slices.tp53Window.seq : "ACGT".repeat(40);
    const refStart1 = data && data.slices && data.slices.tp53Window ? data.slices.tp53Window.start1 : 1000;
    const opts = { ref: ref.repeat(1), refStart1, center1: refStart1 + 48, half: 10, readLen: 40, depth: 25, vaf: 0.4, varPos1: refStart1 + 48, alt: "T", errRate: 0.005, seed: 7 };
    const reads = simulateReads(opts);
    const lo = opts.center1 - opts.half, hi = opts.center1 + opts.half;
    const pile = pileup(reads, lo, hi);
    let ok = true;
    for (const c of pile) {
      const naive = reads.filter(r => r.start1 <= c.pos1 && r.end1 >= c.pos1).length;
      if (naive !== c.depth || c.depth !== c.A + c.C + c.G + c.T) ok = false;
    }
    add("pileup depth equals a naive count and the base counts", ok, `${reads.length} reads`);
    const pack = packRows(reads, lo, hi, 0);
    let overlap = false;
    const byRow = {};
    for (const r of reads) {
      if (!pack.rowOf.has(r.id)) continue;
      const row = pack.rowOf.get(r.id);
      const a = Math.max(lo, r.start1), b = Math.min(hi, r.end1);
      for (const [x, y] of (byRow[row] || [])) if (!(b < x || a > y)) overlap = true;
      (byRow[row] = byRow[row] || []).push([a, b]);
    }
    const maxDepth = Math.max(...pile.map(c => c.depth));
    add("read packing: no overlaps, rows equal the deepest column", !overlap && pack.rows === maxDepth, `${pack.rows} rows, max depth ${maxDepth}`);
    const mism = reads.every(r => {
      for (let i = 0; i < r.seq.length; i++) {
        const p = r.start1 + i, rb = ref[p - refStart1];
        if (r.seq[i] !== rb && !(p === opts.varPos1 && r.mut) && r.errors === 0) return false;
      }
      return true;
    });
    add("reads differ from the reference only at the variant or by an error", mism);

    // Over many seeds the observed allele fraction and error rate match the inputs
    // (binomial expectation; tolerance is several standard errors).
    let altSum = 0, depSum = 0, errSum = 0, baseSum = 0;
    for (let s = 1; s <= 300; s++) {
      const rs = simulateReads(Object.assign({}, opts, { seed: s, errRate: 0.01 }));
      const col = pileup(rs, opts.varPos1, opts.varPos1)[0];
      altSum += rs.filter(r => r.mut).length; depSum += col.depth;
      errSum += rs.reduce((t, r) => t + r.errors, 0); baseSum += rs.reduce((t, r) => t + r.seq.length, 0);
    }
    const vaf = altSum / depSum, err = errSum / baseSum;
    const seV = Math.sqrt(0.4 * 0.6 / depSum), seE = Math.sqrt(0.01 * 0.99 / baseSum);
    add("allele fraction over 300 seeds matches vaf 0.4", Math.abs(vaf - 0.4) < 4 * seV, `${vaf.toFixed(4)} (4 SE = ${(4 * seV).toFixed(4)})`);
    add("error rate over 300 seeds matches 0.01", Math.abs(err - 0.01) < 4 * seE, `${err.toFixed(5)}`);
    const a = alleles({ A: 2, C: 20, G: 1, T: 17 }, "C");
    add("alleles(): top alternative and fraction", a.altBase === "T" && a.alt === 17 && a.depth === 40 && Math.abs(a.vaf - 0.425) < 1e-12);
    return out;
  }

  const api = { mulberry32, complement, revcomp, translateCodon, interpret, simulateReads, pileup, packRows, alleles, runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay02 = api;
})(typeof self !== "undefined" ? self : this);
