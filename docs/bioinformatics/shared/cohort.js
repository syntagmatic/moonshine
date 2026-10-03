// BioCohort: one seeded, simulated tumour cohort shared by Bioinformatics Visualization
// essays 01 (oncoprint), 06 (multi-omics heatmap, consensus clustering) and 08 (survival,
// response waterfall). Every value is simulated; the gene symbols are real HGNC symbols
// used as labels for simulated values, so captions must say "simulated".
// Browser global `BioCohort`, and `module.exports` under node. No fetch, no Math.random.
//
// ---- The truth model (what was planted) -------------------------------------------
// Four planted subtypes, fixed counts (proportions of n, rounded), order shuffled by seed:
//   A  TP53-mutant         40%  TP53 mutated (missense 75%, truncating 25%); 17p loss in ~60%.
//                               p53 activity a = 0. No MDM2 amplification, ever.
//   B  MDM2-amplified      12%  TP53 wildtype; MDM2 log2 CN ~ 2.2 (amplified); p53 activity
//                               a = 0.1 (MDM2 degrades p53).
//   C  CDKN1A-methylated   18%  TP53 wildtype, no MDM2 amplification; CDKN1A promoter island
//                               methylated, so p21 is silenced while p53 itself works (a = 1;
//                               BAX and BBC3 stay normal). This is essay 01's third route.
//                               The first CEIL(30%) of C are "partial": island methylation
//                               ~0.36 instead of ~0.68, CDKN1A only partly down (p.partial).
//                               They are the honest ambiguity: the truth says C, but consensus
//                               clustering puts 5 of the 6 with D at the default seed (over
//                               seeds they split about evenly between C and D).
//   D  Pathway-intact      30%  TP53 wildtype, no MDM2 amp, unmethylated; CDKN1A high (a = 1).
// Expression is log2 normalized expression (simulated units; pages z-score per gene as
// needed). With m = island methylation (beta) and mEff = clamp((m - 0.08) / 0.60, 0, 1):
//   TP53   = 8.0 - 1.0 [truncating TP53] - 0.5 [17p loss] + N(0, 0.40)
//            (missense TP53 leaves TP53 mRNA where it was, as essay 01 says)
//   CDKN1A = 5.0 + 2.2 a - 2.4 mEff + N(0, 0.45)
//   MDM2   = 6.5 + 1.0 a + 1.2 cnMDM2 + N(0, 0.35)    (MDM2 is itself a p53 target)
//   BAX    = 7.0 + 0.8 a + N(0, 0.35)
//   BBC3   = 4.5 + 1.0 a + N(0, 0.40)                 (BBC3 is the gene for PUMA)
//   MKI67  = 6.0 - 0.35 (CDKN1A - 6) + 0.3 cnMYC + N(0, 0.50)
//   GAPDH  = 11.0 + N(0, 0.30)                        (the null gene: no effect on anything)
// Copy number (log2 ratio): TP53 17p13.1, MDM2 12q15, CDKN2A 9p21.3, MYC 8q24.21.
//   CDKN2A deep deletion 18% in every subtype (independent of the p53 routes). MYC gain 30% in
//   A, 10% elsewhere. Calls: amplification at log2 >= 1, deep deletion at log2 <= -1;
//   shallow 17p loss (about -0.6) is copy number only and is not an oncoprint alteration.
// Other mutations, independent of subtype: PIK3CA 15%, ATM 8%, PTEN 8%, RB1 6%, BRCA1 5%,
//   CDKN1A 2% (truncating). TMB (mutations per Mb): lognormal, median 7 in A, 3 elsewhere.
// Survival (months), proportional hazards with exponential baseline:
//   hazard = H0 * exp(-BETA_CDKN1A (CDKN1A - 6) + BETA_STAGE (stage - 2.5))
//   H0 = 0.021 / month, BETA_CDKN1A = ln 1.45 per log2 unit (lower CDKN1A, higher hazard),
//   BETA_STAGE = ln 1.3 per stage. Nothing else enters: subtypes differ in survival only
//   through CDKN1A, MKI67 looks prognostic only because it tracks CDKN1A, and GAPDH, age,
//   sex, TP53 status and TMB have no effect of their own.
//   Censoring is non-informative by construction: accrual uniform over months 0-36 with
//   analysis at month 60 (administrative censoring at 24-60 months of follow-up), plus
//   loss to follow-up at an exponential time (rate 0.005 / month), both drawn independently
//   of the event time. opts.censoring = "informative" instead censors high-hazard patients
//   early (for demonstrating bias only).
// Best response (RECIST-style waterfall): best % change in the sum of target lesions ~
//   N(-10 - 35 a, 25), clamped to [-99, 80], except that with probability 0.05 a every target
//   lesion disappears (-100%, complete response); otherwise a new lesion with probability
//   0.20 - 0.12 a.
//   Response depends on p53 activity only (stage and CDKN1A do not enter).
// Age ~ N(62, 10) in [30, 88]; sex 50/50; stage I-IV with probabilities .2/.3/.3/.2, all
//   independent of subtype.
//
// ---- API -------------------------------------------------------------------------
//   BioCohort.DEFAULT_SEED, BioCohort.DEFAULT_N        20261003, 100
//   BioCohort.generate(opts)  opts {seed, n, censoring: "noninformative" | "informative"}
//     -> { seed, n, censoring, patients: [patient], subtypes: SUBTYPES }
//     Same opts, same output, always. Patients are in id order; subtypes are interleaved.
//     patient = {
//       id: "P001".., index,
//       subtype: "A" | "B" | "C" | "D", partial: bool (C only),
//       age, sex: "F" | "M", stage: 1..4,
//       tp53: { status: "mutant" | "wildtype", cls: "missense" | "truncating" | null,
//               codon: int | null, change: "R175H" | ... | null (hotspots only; other
//               missense carry codon only), hotspot: bool, hotspotClass: "structural" |
//               "contact" | null, loss17p: bool },
//       alterations: { TP53, MDM2, CDKN1A, CDKN2A, ATM, RB1, PIK3CA, PTEN, BRCA1, MYC }
//               each "missense" | "truncating" | "amplification" | "deletion" | null
//               (oncoprint vocabulary; GENES.oncoprint lists the row order),
//       cn:   { TP53, MDM2, CDKN2A, MYC }  log2 ratio,
//       expr: { TP53, CDKN1A, MDM2, BAX, BBC3, MKI67, GAPDH }  log2 expression,
//       meth: { island: beta (mean over the CDKN1A promoter CpG island), extent: bp
//               offset where this patient's island methylation fades out },
//       p53Activity: 0 | 0.1 | 1,  tmb: mutations per Mb,
//       survival: { time, event: bool, trueTime, censorTime, hazard },
//       response: { bestPct, newLesion: bool, recist: "CR" | "PR" | "SD" | "PD" } }
//   BioCohort.SUBTYPES     [{ key, name, route, share }] in A, B, C, D order
//   BioCohort.GENES        { expression, copyNumber: [{gene, band}], oncoprint }
//   BioCohort.HOTSPOTS     the six TP53 hotspots essay 01 draws: {codon, change, cls, iarc}
//   BioCohort.ISLAND       { start: -246, end: 1975 } CDKN1A CpG island relative to the TSS,
//                          promoter convention as in locus.js (TSS = +1, no 0); the same
//                          bounds BioLocus asserts
//   BioCohort.betaAt(patient, offset, island?)  beta value (0..1) at a CpG `offset` bp from
//     the CDKN1A TSS: CpG-poor sequence outside the island ~0.78 for everyone, shores
//     (within 2 kb of the island) ~0.5, inside the island the patient's own level up to
//     its `extent`, fading over ~150 bp. Deterministic per (patient, offset). Pass the real
//     CpG offsets (from the locus data) so every page draws the same patients the same way.
//   BioCohort.features(cohort, opts)  the multi-omics matrix that the recoverability check
//     clusters, and that 06 should cluster to inherit that guarantee. Defaults: expression
//     TP53, CDKN1A, MDM2, BAX, BBC3, MKI67 (not GAPDH); methylation at CHECK_CPGS; copy
//     number TP53, MDM2, CDKN2A, MYC; mutation flag TP53 only (the background mutations
//     are independent of subtype, so they only add noise). opts { cpgOffsets, island,
//     expression, copyNumber, mutations } override each list. 06 may show more rows than it
//     clusters on. Passing four real CpG offsets inside -200..+700 keeps the behaviour;
//     any other change must be re-checked (PAC, ARI) before the prose relies on it.
//     -> { names, modality: ["expr" | "meth" | "cn" | "mut"], rows: [[...]] (raw values),
//          z: [[...]] (continuous columns z-scored and capped at +-3, mutation 0/1 kept) }
//   BioCohort.CHECK_CPGS   [-40, 220, 480, 900]: illustrative offsets inside the island, not
//                          claimed to be CpG positions; pages should pass real ones
//   BioCohort.FINGERPRINT  hash of JSON.stringify(generate()); runChecks fails if the default
//                          cohort ever changes, so numbers quoted in prose stay true
//   BioCohort.recist(bestPct, newLesion)  "PD" if >= +20 or new lesion, "CR" at -100 (all
//     target lesions gone), "PR" at <= -30, else "SD" (RECIST 1.1 target-lesion rules, with
//     best change measured from baseline, so the nadir rule for PD reduces to +20%)
//   BioCohort.consensus(Z, k, opts)  Monti-style consensus clustering: opts {reps 50, frac
//     0.8, seed}; k-means (k-means++ start, best of 3) on each resample, consensus matrix,
//     average-linkage cut at k. -> { M, labels, pac } with PAC = share of off-diagonal pairs
//     with consensus in (0.1, 0.9).
//   BioCohort.adjustedRand(a, b)      adjusted Rand index of two labelings
//   BioCohort.stats.km(times, events)        [{t, s, atRisk, events, censored}] steps
//   BioCohort.stats.logrank(times, events, group)  {chi2, p, hr} (hr: group 1 vs 0,
//                                            Peto-style exp((O1-E1)/V))
//   BioCohort.stats.kmAt(curve, t)           the KM estimate at time t
//   BioCohort.stats.median(arr)
//   BioCohort.TRUTH        the constants above as numbers, plus a prose summary
//   BioCohort.runChecks(print) -> [{name, ok, detail}]
//
// ---- Invariants the essays may rely on ---------------------------------------------
//   - Determinism: generate(opts) depends only on opts. Each patient draws from its own
//     stream seeded by (seed, index), so the cohort is identical in every page and in node.
//   - Exclusivity: MDM2 amplification never co-occurs with a TP53 alteration; every
//     MDM2-amplified patient is subtype B and every B patient is MDM2-amplified.
//   - Methylation route: island beta > 0.25 only in subtype C, and every C patient is TP53
//     wildtype without MDM2 amplification. CDKN1A is low in A, B and C, high in D.
//   - TP53 mRNA does not differ between missense-mutant and wildtype patients (by
//     construction; only truncating mutations and 17p loss lower it).
//   - Survival depends on CDKN1A expression and stage only; censoring is independent of
//     the event time (in the default mode).
//   - Response depends on p53 activity only.
// -----------------------------------------------------------------------------------
(function (root) {
  "use strict";

  const DEFAULT_SEED = 20261003, DEFAULT_N = 100;
  const FINGERPRINT = "6e3ed479";

  const SUBTYPES = [
    { key: "A", name: "TP53-mutant", route: "TP53 mutation: p53 cannot switch on CDKN1A", share: 0.40 },
    { key: "B", name: "MDM2-amplified", route: "MDM2 amplification: p53 is degraded", share: 0.12 },
    { key: "C", name: "CDKN1A-methylated", route: "promoter methylation silences CDKN1A; p53 works", share: 0.18 },
    { key: "D", name: "Pathway-intact", route: "no route taken: CDKN1A high", share: 0.30 }
  ];
  const PARTIAL_SHARE = 0.30; // of subtype C

  const GENES = {
    expression: ["TP53", "CDKN1A", "MDM2", "BAX", "BBC3", "MKI67", "GAPDH"],
    copyNumber: [
      { gene: "TP53", band: "17p13.1" }, { gene: "MDM2", band: "12q15" },
      { gene: "CDKN2A", band: "9p21.3" }, { gene: "MYC", band: "8q24.21" }
    ],
    oncoprint: ["TP53", "MDM2", "CDKN1A", "CDKN2A", "ATM", "RB1", "PIK3CA", "PTEN", "BRCA1", "MYC"]
  };

  // Essay 01's six hotspots. iarc = codon counts in the IARC TP53 database R13 (all
  // substitutions at that codon), used only as relative weights for which hotspot a
  // simulated hotspot mutation lands on.
  const HOTSPOTS = [
    { codon: 175, change: "R175H", cls: "structural", iarc: 1152 },
    { codon: 245, change: "G245S", cls: "structural", iarc: 745 },
    { codon: 248, change: "R248Q", cls: "contact", iarc: 1621 },
    { codon: 249, change: "R249S", cls: "structural", iarc: 573 },
    { codon: 273, change: "R273H", cls: "contact", iarc: 1551 },
    { codon: 282, change: "R282W", cls: "structural", iarc: 642 }
  ];
  const HOTSPOT_CODONS = HOTSPOTS.map(h => h.codon);

  // CDKN1A CpG island (UCSC cpgIslandExt, hg38, [36,678,467, 36,680,688) in 0-based
  // half-open coordinates) relative to the Ensembl canonical TSS chr6:36,678,714, in the
  // promoter convention locus.js uses (TSS base = +1, the base upstream = -1, no 0).
  const ISLAND = { start: -246, end: 1975 };
  const CHECK_CPGS = [-40, 220, 480, 900];

  const TRUTH = {
    H0: 0.021, BETA_CDKN1A: Math.log(1.45), BETA_STAGE: Math.log(1.3), CDKN1A_REF: 6, STAGE_REF: 2.5,
    ACCRUAL: 36, STUDY_END: 60, DROPOUT_RATE: 0.005,
    METH_UNMETH: 0.08, METH_FULL: 0.68, METH_PARTIAL: 0.36, MDM2_CN_COEF: 1.2,
    P53_ACTIVITY: { A: 0, B: 0.1, C: 1, D: 1 },
    RATES: { CDKN2A_DEL: 0.18, MYC_GAIN_A: 0.30, MYC_GAIN_OTHER: 0.10, LOSS17P_A: 0.60, LOSS17P_OTHER: 0.08,
      PIK3CA: 0.15, ATM: 0.08, PTEN: 0.08, RB1: 0.06, BRCA1: 0.05, CDKN1A: 0.02,
      TP53_TRUNCATING: 0.25, TP53_HOTSPOT_OF_MISSENSE: 0.40 },
    summary: "Four planted subtypes (TP53-mutant 40%, MDM2-amplified 12%, CDKN1A-methylated 18% " +
      "of which 30% partially methylated, pathway-intact 30%). CDKN1A is low in the first three " +
      "by three different routes. Survival hazard rises 1.45-fold per log2 unit lower CDKN1A " +
      "and 1.3-fold per stage; nothing else. Censoring is independent of event time. Best " +
      "response depends on p53 activity only. GAPDH is a null gene."
  };

  // ---- seeded randomness ----
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function mix(a, b) { // integer hash of two ints
    let h = Math.imul(a ^ 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(b + 0x632BE5AB, 0xC2B2AE35);
    h ^= h >>> 16; h = Math.imul(h, 0x7FEB352D); h ^= h >>> 15; h = Math.imul(h, 0x846CA68B); h ^= h >>> 16;
    return h >>> 0;
  }
  function stream(seed, a, b) { return mulberry32(mix(mix(seed >>> 0, a), b == null ? 0 : b)); }
  function normal(rng) { // Box-Muller, one draw per call (two uniforms)
    let u = rng(); if (u < 1e-12) u = 1e-12;
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
  }
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000;
  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }

  function subtypeCounts(n) {
    const raw = SUBTYPES.map(s => s.share * n), c = raw.map(Math.floor);
    let left = n - c.reduce((a, b) => a + b, 0);
    raw.map((v, i) => [v - c[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { c[i]++; left--; } });
    return c;
  }

  // ---- one patient ----
  function makePatient(seed, index, subtype, partial, censoring) {
    const g = stream(seed, index, 1);       // genomics
    const e = stream(seed, index, 2);       // expression noise
    const c = stream(seed, index, 3);       // clinical
    const s = stream(seed, index, 4);       // survival
    const w = stream(seed, index, 5);       // response
    const R = TRUTH.RATES;
    const p = { id: "P" + String(index + 1).padStart(3, "0"), index, subtype, partial: !!partial };

    // clinical
    p.age = Math.round(clamp(62 + 10 * normal(c), 30, 88));
    p.sex = c() < 0.5 ? "F" : "M";
    const us = c(); p.stage = us < 0.2 ? 1 : us < 0.5 ? 2 : us < 0.8 ? 3 : 4;

    // TP53
    const tp53 = { status: "wildtype", cls: null, codon: null, change: null, hotspot: false, hotspotClass: null, loss17p: false };
    const uT = [g(), g(), g(), g()];
    if (subtype === "A") {
      tp53.status = "mutant";
      if (uT[0] < R.TP53_TRUNCATING) {
        tp53.cls = "truncating";
        tp53.codon = 1 + Math.floor(uT[1] * 393);
      } else {
        tp53.cls = "missense";
        if (uT[1] < R.TP53_HOTSPOT_OF_MISSENSE) {
          const tot = HOTSPOTS.reduce((a, h) => a + h.iarc, 0);
          let u = uT[2] * tot, k = 0;
          while (u > HOTSPOTS[k].iarc && k < HOTSPOTS.length - 1) { u -= HOTSPOTS[k].iarc; k++; }
          const h = HOTSPOTS[k];
          Object.assign(tp53, { codon: h.codon, change: h.change, hotspot: true, hotspotClass: h.cls });
        } else {
          // other missense: DNA-binding domain (102-292) 90% of the time, anywhere else 10%
          let codon;
          do {
            codon = uT[2] < 0.9 ? 102 + Math.floor(g() * 191) : 1 + Math.floor(g() * 393);
          } while (HOTSPOT_CODONS.indexOf(codon) >= 0);
          tp53.codon = codon;
        }
      }
    }
    tp53.loss17p = g() < (subtype === "A" ? R.LOSS17P_A : R.LOSS17P_OTHER);
    p.tp53 = tp53;

    // copy number
    const cn = {};
    cn.TP53 = tp53.loss17p ? -0.6 + 0.12 * normal(g) : 0.1 * normal(g);
    cn.MDM2 = subtype === "B" ? Math.max(1.3, 2.2 + 0.4 * normal(g)) : 0.12 * normal(g);
    cn.CDKN2A = g() < R.CDKN2A_DEL ? Math.min(-1.05, -1.6 + 0.3 * normal(g)) : 0.15 * normal(g);
    cn.MYC = g() < (subtype === "A" ? R.MYC_GAIN_A : R.MYC_GAIN_OTHER) ? 0.85 + 0.3 * normal(g) : 0.12 * normal(g);
    Object.keys(cn).forEach(k => { cn[k] = r2(cn[k]); });
    p.cn = cn;

    // alterations (oncoprint vocabulary)
    const alt = {};
    GENES.oncoprint.forEach(k => { alt[k] = null; });
    if (tp53.status === "mutant") alt.TP53 = tp53.cls;
    if (cn.MDM2 >= 1) alt.MDM2 = "amplification";
    if (cn.CDKN2A <= -1) alt.CDKN2A = "deletion";
    if (cn.MYC >= 1) alt.MYC = "amplification";
    const other = [["PIK3CA", R.PIK3CA, ["missense"]], ["ATM", R.ATM, ["missense", "truncating"]],
      ["PTEN", R.PTEN, ["truncating", "deletion"]], ["RB1", R.RB1, ["truncating", "deletion"]],
      ["BRCA1", R.BRCA1, ["truncating", "missense"]], ["CDKN1A", R.CDKN1A, ["truncating"]]];
    other.forEach(([gene, rate, kinds]) => {
      const u = g(), v = g();
      if (u < rate) alt[gene] = kinds[Math.floor(v * kinds.length)];
    });
    p.alterations = alt;

    // methylation of the CDKN1A promoter island
    let m;
    if (subtype === "C") m = partial ? TRUTH.METH_PARTIAL + 0.05 * normal(g) : TRUTH.METH_FULL + 0.08 * normal(g);
    else m = TRUTH.METH_UNMETH + 0.03 * normal(g);
    m = clamp(m, 0.01, 0.95);
    p.meth = { island: r3(m), extent: Math.round(subtype === "C" ? 700 + g() * 1200 : 400 + g() * 800) };
    const mEff = clamp((m - TRUTH.METH_UNMETH) / (TRUTH.METH_FULL - TRUTH.METH_UNMETH), 0, 1);

    // expression
    const a = TRUTH.P53_ACTIVITY[subtype];
    p.p53Activity = a;
    const ex = {};
    ex.TP53 = 8.0 - (tp53.cls === "truncating" ? 1.0 : 0) - (tp53.loss17p ? 0.5 : 0) + 0.40 * normal(e);
    ex.CDKN1A = 5.0 + 2.2 * a - 2.4 * mEff + 0.45 * normal(e);
    ex.MDM2 = 6.5 + 1.0 * a + TRUTH.MDM2_CN_COEF * cn.MDM2 + 0.35 * normal(e);
    ex.BAX = 7.0 + 0.8 * a + 0.35 * normal(e);
    ex.BBC3 = 4.5 + 1.0 * a + 0.40 * normal(e);
    ex.MKI67 = 6.0 - 0.35 * (ex.CDKN1A - 6) + 0.3 * cn.MYC + 0.50 * normal(e);
    ex.GAPDH = 11.0 + 0.30 * normal(e);
    Object.keys(ex).forEach(k => { ex[k] = r2(ex[k]); });
    p.expr = ex;

    // TMB
    p.tmb = r1(Math.exp(Math.log(subtype === "A" ? 7 : 3) + 0.6 * normal(g)));

    // survival
    const hazard = TRUTH.H0 * Math.exp(-TRUTH.BETA_CDKN1A * (ex.CDKN1A - TRUTH.CDKN1A_REF) + TRUTH.BETA_STAGE * (p.stage - TRUTH.STAGE_REF));
    const trueTime = -Math.log(1 - s()) / hazard;
    const admin = TRUTH.STUDY_END - s() * TRUTH.ACCRUAL;
    let drop = -Math.log(1 - s()) / TRUTH.DROPOUT_RATE;
    if (censoring === "informative") {
      // for demonstration only: the sicker a patient, the sooner they leave follow-up
      drop = -Math.log(1 - s()) / (TRUTH.DROPOUT_RATE + 1.5 * hazard);
    }
    const censorTime = Math.min(admin, drop);
    const event = trueTime <= censorTime;
    p.survival = { time: r2(event ? trueTime : censorTime), event, trueTime: r2(trueTime), censorTime: r2(censorTime), hazard: +hazard.toPrecision(4) };

    // response
    const complete = w() < 0.05 * a; // all target lesions gone
    let best = clamp(-10 - 35 * a + 25 * normal(w), -99, 80);
    if (complete) best = -100;
    const newLesion = !complete && w() < 0.20 - 0.12 * a;
    p.response = { bestPct: r1(best), newLesion, recist: recist(r1(best), newLesion) };
    return p;
  }

  function generate(opts) {
    opts = opts || {};
    const seed = opts.seed == null ? DEFAULT_SEED : opts.seed >>> 0;
    const n = opts.n == null ? DEFAULT_N : Math.max(4, Math.round(opts.n));
    const censoring = opts.censoring === "informative" ? "informative" : "noninformative";
    const counts = subtypeCounts(n);
    const labels = [];
    SUBTYPES.forEach((st, i) => {
      const nPartial = st.key === "C" ? Math.ceil(PARTIAL_SHARE * counts[i]) : 0;
      for (let j = 0; j < counts[i]; j++) labels.push([st.key, j < nPartial]);
    });
    shuffle(labels, stream(seed, 0xC0FFEE, 0));
    const patients = labels.map(([st, partial], i) => makePatient(seed, i, st, partial, censoring));
    return { seed, n, censoring, patients, subtypes: SUBTYPES };
  }

  function recist(bestPct, newLesion) {
    if (newLesion || bestPct >= 20) return "PD";
    if (bestPct <= -100) return "CR";
    if (bestPct <= -30) return "PR";
    return "SD";
  }

  // ---- methylation at a CpG ----
  function betaAt(p, offset, island) {
    island = island || ISLAND;
    const rng = stream(mix(p.index + 1, Math.round(offset) + 100000), p.subtype.charCodeAt(0), 7);
    const noise = 0.035 * normal(rng);
    let mu;
    if (offset < island.start || offset > island.end) {
      const d = offset < island.start ? island.start - offset : offset - island.end;
      mu = d > 2000 ? 0.78 : 0.45 + 0.33 * (d / 2000); // shore rising to CpG-poor background
    } else {
      // inside the island: the patient's level from the island start up to its extent,
      // fading over ~150 bp beyond the extent and over the first 60 bp after the island edge
      const fadeOut = 1 / (1 + Math.exp((offset - p.meth.extent) / 150));
      const fadeIn = 1 / (1 + Math.exp(-(offset - island.start - 60) / 40));
      mu = 0.05 + (p.meth.island - 0.05) * Math.min(1, 1.15 * fadeOut) * (0.4 + 0.6 * fadeIn);
    }
    return r3(clamp(mu + noise, 0, 1));
  }

  // ---- multi-omics feature matrix ----
  function features(cohort, opts) {
    opts = opts || {};
    const pts = cohort.patients || cohort;
    const ex = opts.expression || ["TP53", "CDKN1A", "MDM2", "BAX", "BBC3", "MKI67"];
    const cpgs = opts.cpgOffsets || CHECK_CPGS;
    const cnv = opts.copyNumber || ["TP53", "MDM2", "CDKN2A", "MYC"];
    const muts = opts.mutations || ["TP53"];
    const names = [], modality = [], cols = [];
    ex.forEach(gn => { names.push(gn); modality.push("expr"); cols.push(p => p.expr[gn]); });
    cpgs.forEach(o => { names.push("CDKN1A CpG " + (o > 0 ? "+" : "") + o); modality.push("meth"); cols.push(p => betaAt(p, o, opts.island)); });
    cnv.forEach(gn => { names.push(gn + " CN"); modality.push("cn"); cols.push(p => p.cn[gn]); });
    muts.forEach(gn => {
      names.push(gn + " mut"); modality.push("mut");
      cols.push(p => (p.alterations[gn] === "missense" || p.alterations[gn] === "truncating") ? 1 : 0);
    });
    const rows = pts.map(p => cols.map(f => f(p)));
    const z = rows.map(r => r.slice());
    modality.forEach((mo, j) => {
      if (mo === "mut") return;
      const v = rows.map(r => r[j]), mean = v.reduce((a, b) => a + b, 0) / v.length;
      const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) * (b - mean), 0) / Math.max(1, v.length - 1)) || 1;
      z.forEach(r => { r[j] = clamp((r[j] - mean) / sd, -3, 3); });
    });
    return { names, modality, rows, z };
  }

  // ---- consensus clustering (Monti et al. 2003) ----
  function dist2(a, b) { let s = 0; for (let j = 0; j < a.length; j++) { const d = a[j] - b[j]; s += d * d; } return s; }
  function kmeans(X, idx, k, rng) {
    const d = X[0].length;
    const cent = [X[idx[Math.floor(rng() * idx.length)]].slice()];
    while (cent.length < k) {
      const dd = idx.map(i => Math.min.apply(null, cent.map(c => dist2(X[i], c))));
      let tot = dd.reduce((a, b) => a + b, 0), r = rng() * tot, q = 0;
      while (r > dd[q] && q < dd.length - 1) { r -= dd[q]; q++; }
      cent.push(X[idx[q]].slice());
    }
    let lab = new Int32Array(idx.length);
    for (let it = 0; it < 30; it++) {
      let changed = false;
      for (let u = 0; u < idx.length; u++) {
        let best = 0, bd = Infinity;
        for (let c = 0; c < k; c++) { const dc = dist2(X[idx[u]], cent[c]); if (dc < bd) { bd = dc; best = c; } }
        if (lab[u] !== best) { lab[u] = best; changed = true; }
      }
      for (let c = 0; c < k; c++) {
        const sum = new Float64Array(d); let cnt = 0;
        for (let u = 0; u < idx.length; u++) if (lab[u] === c) { cnt++; const x = X[idx[u]]; for (let j = 0; j < d; j++) sum[j] += x[j]; }
        if (cnt) cent[c] = Array.from(sum, v => v / cnt);
      }
      if (!changed && it > 0) break;
    }
    let ss = 0; for (let u = 0; u < idx.length; u++) ss += dist2(X[idx[u]], cent[lab[u]]);
    return { lab, ss };
  }
  function consensus(Z, k, opts) {
    opts = opts || {};
    const reps = opts.reps || 50, frac = opts.frac || 0.8, rng = mulberry32(opts.seed == null ? 90210 : opts.seed);
    const n = Z.length;
    const together = Array.from({ length: n }, () => new Float64Array(n));
    const sampled = Array.from({ length: n }, () => new Float64Array(n));
    const all = Array.from({ length: n }, (_, i) => i);
    for (let r = 0; r < reps; r++) {
      const idx = shuffle(all.slice(), rng).slice(0, Math.round(frac * n)).sort((a, b) => a - b);
      let best = null;
      for (let t = 0; t < 3; t++) { const km = kmeans(Z, idx, k, rng); if (!best || km.ss < best.ss) best = km; }
      for (let a = 0; a < idx.length; a++) for (let b = 0; b < idx.length; b++) {
        sampled[idx[a]][idx[b]]++;
        if (best.lab[a] === best.lab[b]) together[idx[a]][idx[b]]++;
      }
    }
    const M = together.map((row, i) => Array.from(row, (t, j) => sampled[i][j] ? t / sampled[i][j] : 0));
    let amb = 0, pairs = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { pairs++; if (M[i][j] > 0.1 && M[i][j] < 0.9) amb++; }
    // average linkage on 1 - M, cut at k
    let groups = all.map(i => [i]);
    const D = all.map(i => all.map(j => 1 - M[i][j]));
    let GD = groups.map((_, a) => groups.map((__, b) => D[a][b]));
    while (groups.length > k) {
      let ba = 0, bb = 1, bd = Infinity;
      for (let a = 0; a < groups.length; a++) for (let b = a + 1; b < groups.length; b++) if (GD[a][b] < bd) { bd = GD[a][b]; ba = a; bb = b; }
      const na = groups[ba].length, nb = groups[bb].length;
      for (let c = 0; c < groups.length; c++) { if (c === ba || c === bb) continue; const v = (GD[ba][c] * na + GD[bb][c] * nb) / (na + nb); GD[ba][c] = GD[c][ba] = v; }
      groups[ba] = groups[ba].concat(groups[bb]);
      groups.splice(bb, 1); GD.splice(bb, 1); GD.forEach(row => row.splice(bb, 1));
    }
    const labels = new Array(n);
    groups.forEach((gr, gi) => gr.forEach(i => { labels[i] = gi; }));
    return { M, labels, pac: amb / pairs };
  }

  function adjustedRand(a, b) {
    const n = a.length, key = new Map(), ka = new Map(), kb = new Map();
    const c2 = x => x * (x - 1) / 2;
    for (let i = 0; i < n; i++) {
      const k = a[i] + "|" + b[i];
      key.set(k, (key.get(k) || 0) + 1); ka.set(a[i], (ka.get(a[i]) || 0) + 1); kb.set(b[i], (kb.get(b[i]) || 0) + 1);
    }
    let sij = 0, sa = 0, sb = 0;
    key.forEach(v => { sij += c2(v); }); ka.forEach(v => { sa += c2(v); }); kb.forEach(v => { sb += c2(v); });
    const exp = sa * sb / c2(n), max = (sa + sb) / 2;
    return max === exp ? 1 : (sij - exp) / (max - exp);
  }

  // ---- survival statistics (small, for checks and for pages that want them) ----
  function km(times, events) {
    const idx = times.map((t, i) => i).sort((a, b) => times[a] - times[b]);
    let atRisk = times.length, s = 1;
    const out = [{ t: 0, s: 1, atRisk, events: 0, censored: 0 }];
    let i = 0;
    while (i < idx.length) {
      const t = times[idx[i]]; let d = 0, c = 0;
      while (i < idx.length && times[idx[i]] === t) { if (events[idx[i]]) d++; else c++; i++; }
      if (d) s *= 1 - d / atRisk;
      out.push({ t, s, atRisk, events: d, censored: c });
      atRisk -= d + c;
    }
    return out;
  }
  function kmAt(curve, t) { let s = 1; for (const st of curve) { if (st.t <= t) s = st.s; else break; } return s; }
  function chi2sf1(x) { return erfc(Math.sqrt(x / 2)); }
  function erfc(x) { // Numerical Recipes erfc, |error| < 1.2e-7
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }
  function logrank(times, events, group) {
    const idx = times.map((t, i) => i).sort((a, b) => times[a] - times[b]);
    let n1 = group.filter(g => g).length, n = times.length, O1 = 0, E1 = 0, V = 0, i = 0;
    while (i < idx.length) {
      const t = times[idx[i]]; let d = 0, d1 = 0, c = 0, c1 = 0;
      while (i < idx.length && times[idx[i]] === t) { const k = idx[i]; if (events[k]) { d++; if (group[k]) d1++; } else { c++; if (group[k]) c1++; } i++; }
      if (d && n > 1) { E1 += d * n1 / n; V += d * (n1 / n) * (1 - n1 / n) * (n - d) / (n - 1); O1 += d1; }
      n -= d + c; n1 -= d1 + c1;
    }
    const chi2 = V > 0 ? (O1 - E1) * (O1 - E1) / V : 0;
    return { chi2, p: chi2sf1(chi2), hr: V > 0 ? Math.exp((O1 - E1) / V) : 1, O1, E1 };
  }
  function median(arr) { const s = arr.slice().sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }

  // ---- checks ----
  function runChecks(print) {
    const out = [];
    const add = (name, ok, detail) => { out.push({ name, ok: !!ok, detail }); if (print) (typeof print === "function" ? print : console.log)(`${ok ? "PASS" : "FAIL"} ${name}${detail ? "  (" + detail + ")" : ""}`); };
    const C = generate();
    const P = C.patients;
    const pct = (k, n) => (100 * k / n).toFixed(0) + "%";

    // determinism
    const again = generate();
    add("determinism: same seed gives an identical cohort", JSON.stringify(again) === JSON.stringify(C), `seed ${C.seed}, n ${C.n}`);
    add("default cohort matches the documented fingerprint (prose numbers stay true)", fingerprint(C) === FINGERPRINT, `${fingerprint(C)} vs ${FINGERPRINT}`);
    const other = generate({ seed: C.seed + 1 });
    add("a different seed gives a different cohort", JSON.stringify(other.patients) !== JSON.stringify(P), "");
    const big = generate({ n: 160 });
    add("subtype counts follow the planted shares", ["A", "B", "C", "D"].every((k, i) => P.filter(p => p.subtype === k).length === subtypeCounts(C.n)[i])
      && big.patients.filter(p => p.subtype === "B").length === Math.round(0.12 * 160), subtypeCounts(C.n).join("/"));

    // exclusivity over many seeds
    let excl = true, amp = true, methOnlyC = true, cWild = true, nPat = 0;
    for (let sd = 1; sd <= 40; sd++) {
      for (const p of generate({ seed: sd }).patients) {
        nPat++;
        if (p.alterations.TP53 && p.alterations.MDM2) excl = false;
        if ((p.alterations.MDM2 === "amplification") !== (p.subtype === "B")) amp = false;
        if (p.meth.island > 0.25 && p.subtype !== "C") methOnlyC = false;
        if (p.subtype === "C" && (p.tp53.status !== "wildtype" || p.alterations.MDM2)) cWild = false;
      }
    }
    add("TP53 alteration and MDM2 amplification never co-occur", excl, `${nPat} patients over 40 seeds`);
    add("every MDM2 amplification is subtype B and every B is amplified", amp, "");
    add("CDKN1A promoter methylation only in TP53-wildtype, MDM2-normal tumours (subtype C)", methOnlyC && cWild, "island beta > 0.25");

    // rates at the default seed
    const nT = P.filter(p => p.alterations.TP53).length, nM = P.filter(p => p.alterations.MDM2).length;
    const nHot = P.filter(p => p.tp53.hotspot).length, nR175 = P.filter(p => p.tp53.change === "R175H").length;
    const nDel = P.filter(p => p.alterations.CDKN2A).length;
    add("default cohort: TP53 altered 40%, MDM2 amplified 12%", nT === Math.round(0.4 * C.n) && nM === Math.round(0.12 * C.n),
      `TP53 ${nT}/${C.n}, MDM2 ${nM}/${C.n}, CDKN2A deleted ${nDel}, hotspots ${nHot} (R175H ${nR175})`);
    add("default cohort has at least two R175H patients (for 01 and 04)", nR175 >= 2, `R175H ${nR175}`);
    let tot = 0, hot = 0, trunc = 0, del = 0, nAll = 0;
    for (let sd = 1; sd <= 100; sd++) for (const p of generate({ seed: sd }).patients) {
      nAll++; if (p.tp53.status === "mutant") { tot++; if (p.tp53.hotspot) hot++; if (p.tp53.cls === "truncating") trunc++; }
      if (p.alterations.CDKN2A) del++;
    }
    add("over 100 seeds: hotspots ~30% of TP53 mutations, truncating ~25%, CDKN2A deletion ~18%",
      Math.abs(hot / tot - 0.30) < 0.03 && Math.abs(trunc / tot - 0.25) < 0.03 && Math.abs(del / nAll - 0.18) < 0.02,
      `hotspot ${pct(hot, tot)}, truncating ${pct(trunc, tot)}, CDKN2A ${pct(del, nAll)}`);

    // expression facts the essays state
    const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
    const by = (f, k) => mean(P.filter(f).map(p => p.expr[k]));
    let mis = [], wt = [];
    for (let sd = 1; sd <= 20; sd++) generate({ seed: sd }).patients.forEach(p => {
      if (p.tp53.loss17p) return;
      if (p.tp53.cls === "missense") mis.push(p.expr.TP53); else if (p.tp53.status === "wildtype") wt.push(p.expr.TP53);
    });
    const misT = mean(mis), wtT = mean(wt);
    add("TP53 mRNA: missense-mutant tumours match wildtype (both without 17p loss, 20 seeds, within 0.1 log2)", Math.abs(misT - wtT) < 0.1,
      `missense ${misT.toFixed(2)} (n ${mis.length}) vs wildtype ${wtT.toFixed(2)} (n ${wt.length})`);
    const cd = k => by(p => p.subtype === k, "CDKN1A");
    add("CDKN1A low in A, B, C and high in D", Math.max(cd("A"), cd("B"), cd("C")) < cd("D") - 1.2,
      `A ${cd("A").toFixed(2)}, B ${cd("B").toFixed(2)}, C ${cd("C").toFixed(2)}, D ${cd("D").toFixed(2)}`);
    const bx = k => by(p => p.subtype === k, "BBC3");
    add("other p53 targets (BBC3) stay normal in the methylated subtype", Math.abs(bx("C") - bx("D")) < 0.4 && bx("A") < bx("C") - 0.6,
      `BBC3 A ${bx("A").toFixed(2)}, C ${bx("C").toFixed(2)}, D ${bx("D").toFixed(2)}`);

    // subtypes recoverable by consensus clustering on the multi-omics features
    const F = features(C);
    const truthLab = P.map(p => p.subtype);
    const pacs = [], aris = [];
    for (let k = 2; k <= 6; k++) { const cc = consensus(F.z, k, { reps: 40 }); pacs.push(cc.pac); aris.push(adjustedRand(cc.labels, truthLab)); }
    const kBest = 2 + pacs.indexOf(Math.min.apply(null, pacs));
    add("consensus clustering: PAC is lowest at k = 4", kBest === 4, "PAC k=2..6 " + pacs.map(v => v.toFixed(3)).join(", "));
    add("consensus clustering at k = 4 recovers the planted subtypes (ARI >= 0.8)", aris[2] >= 0.8, "ARI k=2..6 " + aris.map(v => v.toFixed(2)).join(", "));
    const cc4 = consensus(F.z, 4, { reps: 40 });
    const ownC = (f) => { const ids = P.map((p, i) => i).filter(i => f(P[i])); const cIds = P.map((p, i) => i).filter(i => P[i].subtype === "C" && !P[i].partial);
      return mean(ids.map(i => mean(cIds.filter(j => j !== i).map(j => cc4.M[i][j])))); };
    const fullC = ownC(p => p.subtype === "C" && !p.partial), partC = ownC(p => p.partial);
    add("the ambiguity is real: partially methylated C patients co-cluster with full C less often", partC < fullC - 0.15,
      `mean consensus with full C: full ${fullC.toFixed(2)}, partial ${partC.toFixed(2)}`);
    // across seeds, k = 4 is chosen most of the time
    let wins = 0; const S = 8;
    for (let sd = 1; sd <= S; sd++) {
      const Fz = features(generate({ seed: sd })).z; const pv = [];
      for (let k = 2; k <= 6; k++) pv.push(consensus(Fz, k, { reps: 25, seed: sd }).pac);
      if (pv.indexOf(Math.min.apply(null, pv)) === 2) wins++;
    }
    add("PAC picks k = 4 on most seeds", wins >= S - 2, `${wins}/${S} seeds`);

    // survival
    const times = P.map(p => p.survival.time), events = P.map(p => p.survival.event);
    const nEv = events.filter(Boolean).length;
    const medC = median(P.map(p => p.expr.CDKN1A)), medG = median(P.map(p => p.expr.GAPDH));
    const lrC = logrank(times, events, P.map(p => p.expr.CDKN1A < medC));
    const lrG = logrank(times, events, P.map(p => p.expr.GAPDH < medG));
    const lrS = logrank(times, events, P.map(p => p.subtype !== "D"));
    add("default cohort: CDKN1A-low half does worse (log-rank p < 0.05), GAPDH split does not",
      lrC.p < 0.05 && lrG.p > 0.05,
      `events ${nEv}/${C.n}; CDKN1A low vs high HR ${lrC.hr.toFixed(2)} p ${lrC.p.toPrecision(2)}; GAPDH HR ${lrG.hr.toFixed(2)} p ${lrG.p.toPrecision(2)}; A+B+C vs D HR ${lrS.hr.toFixed(2)} p ${lrS.p.toPrecision(2)}`);
    let powC = 0, fpG = 0, hrs = []; const SS = 300;
    for (let sd = 1; sd <= SS; sd++) {
      const Q = generate({ seed: sd }).patients, t = Q.map(p => p.survival.time), e = Q.map(p => p.survival.event);
      const mc = median(Q.map(p => p.expr.CDKN1A)), mg = median(Q.map(p => p.expr.GAPDH));
      const a = logrank(t, e, Q.map(p => p.expr.CDKN1A < mc)), b = logrank(t, e, Q.map(p => p.expr.GAPDH < mg));
      if (a.p < 0.05) powC++; if (b.p < 0.05) fpG++; hrs.push(a.hr);
    }
    add("over 300 seeds: CDKN1A median split is a modest, usually detectable effect; GAPDH is null",
      powC / SS >= 0.6 && powC / SS <= 0.95 && fpG / SS < 0.09 && median(hrs) > 1.5 && median(hrs) < 2.6,
      `CDKN1A p < 0.05 in ${pct(powC, SS)}, median HR ${median(hrs).toFixed(2)}; GAPDH p < 0.05 in ${pct(fpG, SS)}`);

    // non-informative censoring: KM of observed data vs the uncensored truth, many seeds
    const grid = [12, 24, 36, 48];
    // Per seed: KM estimate minus the true share still event-free (from trueTime, which
    // censoring never touches). Mean over 300 seeds, with its standard error.
    function bias(mode) {
      const R = 300, d = grid.map(() => []);
      for (let sd = 1; sd <= R; sd++) {
        const Q = generate({ seed: 1000 + sd, censoring: mode }).patients;
        const curve = km(Q.map(p => p.survival.time), Q.map(p => p.survival.event));
        grid.forEach((t, i) => { d[i].push(kmAt(curve, t) - Q.filter(p => p.survival.trueTime > t).length / Q.length); });
      }
      return d.map(v => { const m = mean(v), sd = Math.sqrt(v.reduce((a, x) => a + (x - m) * (x - m), 0) / (v.length - 1)); return { m, se: sd / Math.sqrt(v.length) }; });
    }
    const bNon = bias("noninformative"), bInf = bias("informative");
    const fmt = b => b.map(x => x.m.toFixed(4) + " (se " + x.se.toFixed(4) + ")").join(", ");
    add("non-informative censoring: KM matches the uncensored truth (|bias| < 3 se and < 0.012 at 12/24/36/48 mo)",
      bNon.every(x => Math.abs(x.m) < 3 * x.se + 1e-4 && Math.abs(x.m) < 0.012), fmt(bNon));
    add("the censoring check has teeth: informative censoring biases KM upward (> 0.03 by 48 mo)",
      bInf[bInf.length - 1].m > 0.03, fmt(bInf));
    const censTimes = P.filter(p => !p.survival.event);
    add("censoring times are independent of hazard (rank correlation near 0 over seeds)", (function () {
      let sum = 0, R = 60;
      for (let sd = 1; sd <= R; sd++) {
        const Q = generate({ seed: 2000 + sd }).patients;
        sum += spearman(Q.map(p => p.survival.censorTime), Q.map(p => p.survival.hazard));
      }
      return Math.abs(sum / R) < 0.05;
    })(), `${censTimes.length} censored in the default cohort`);

    // response
    const rA = mean(P.filter(p => p.subtype === "A").map(p => p.response.bestPct));
    const rW = mean(P.filter(p => p.p53Activity === 1).map(p => p.response.bestPct));
    const cats = ["CR", "PR", "SD", "PD"].map(k => k + " " + P.filter(p => p.response.recist === k).length).join(", ");
    add("response: p53-functional tumours shrink more than TP53-mutant ones", rW < rA - 20, `mean best change A ${rA.toFixed(1)}%, a = 1 ${rW.toFixed(1)}%; ${cats}`);
    add("RECIST rules", recist(-100, false) === "CR" && recist(-30, false) === "PR" && recist(-29.9, false) === "SD" && recist(20, false) === "PD" && recist(-60, true) === "PD", "");

    // methylation profile
    const pc = P.find(p => p.subtype === "C" && !p.partial), pd = P.find(p => p.subtype === "D");
    add("betaAt: island high only in C, CpG-poor upstream sequence methylated in everyone",
      betaAt(pc, 1) > 0.45 && betaAt(pd, 1) < 0.2 && betaAt(pd, -2265) > 0.6 && betaAt(pc, 1) === betaAt(pc, 1),
      `C ${betaAt(pc, 1)} / D ${betaAt(pd, 1)} at the TSS (+1); D ${betaAt(pd, -2265)} at -2265 (the 5' p53 site)`);

    // gene names: real HGNC symbols only
    const symbols = new Set(GENES.expression.concat(GENES.oncoprint, GENES.copyNumber.map(c => c.gene)));
    const approved = ["TP53", "CDKN1A", "MDM2", "BAX", "BBC3", "MKI67", "GAPDH", "CDKN2A", "ATM", "RB1", "PIK3CA", "PTEN", "BRCA1", "MYC"];
    add("every gene label is one of the approved HGNC symbols listed here", [...symbols].every(s => approved.indexOf(s) >= 0), [...symbols].join(" "));
    return out;
  }

  function fingerprint(obj) { // FNV-1a over the JSON text, as 8 hex digits
    const s = JSON.stringify(obj); let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(16).padStart(8, "0");
  }

  function spearman(a, b) {
    const rank = v => { const o = v.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]); const r = new Array(v.length); o.forEach(([, i], k) => { r[i] = k; }); return r; };
    const ra = rank(a), rb = rank(b), n = a.length, ma = (n - 1) / 2;
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < n; i++) { num += (ra[i] - ma) * (rb[i] - ma); da += (ra[i] - ma) ** 2; db += (rb[i] - ma) ** 2; }
    return num / Math.sqrt(da * db);
  }

  const api = {
    DEFAULT_SEED, DEFAULT_N, FINGERPRINT, SUBTYPES, GENES, HOTSPOTS, ISLAND, CHECK_CPGS, TRUTH,
    generate, betaAt, features, recist, consensus, adjustedRand,
    stats: { km, kmAt, logrank, median },
    runChecks
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioCohort = api;
})(typeof self !== "undefined" ? self : this);
