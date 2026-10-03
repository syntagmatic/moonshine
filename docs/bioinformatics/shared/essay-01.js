// BioEssay01: the model code behind essay 01, Five Views of a Broken Pathway.
// Browser global `BioEssay01`, and `module.exports` under node. No fetch, no Math.random.
//
//   newcombeDiff(x1, n1, x2, n2, z?)  difference of two proportions p1 - p2 with the
//       Newcombe (1998) hybrid score interval (his method 10, from two Wilson intervals).
//       -> {d, lo, hi}. Checked against statsmodels confint_proportions_2indep
//       (method "newcomb") and against Newcombe's Table II examples.
//   wilson(x, n, z?)  Wilson score interval for one proportion -> [lo, hi].
//
//   CELLS  the simulated single-cell experiment of Figure 5: two tumours (TP53 wildtype,
//       TP53 R175H), eight cell types, eleven genes. The somatic mutation is in the
//       malignant cells only, so only the malignant compartment's p53 targets (CDKN1A,
//       MDM2) change; every other cell type is TP53 wildtype in both tumours and keeps its
//       parameters, so it is the internal control. Parameters are drawn once; each tumour
//       samples its cells from its own seeded stream, so the control differs only by
//       sampling noise. Raising nCells extends each stream (the first cells stay the same).
//   simulateCells({nCells, seed}) -> {params, wt, mut}; wt/mut map "GENE|Cell type" to
//       {gene, ct, n, nExp, frac, mean (over all cells), posMean (over expressing cells)}.
//
//   PATHWAY  nodes and edges of Figure 4 (DNA damage, ATM, MDM2, TP53, CDKN1A, BAX and the
//       two outcomes), including both MDM2 edges: MDM2 -| TP53 (ubiquitin ligase) and
//       TP53 -> MDM2 (transcription, the feedback loop).
//   pathwayState({damage, mutant}) -> {lit: {id: step}, nodeStep: {id: step},
//       edges: [{s, t, kind, status, step}]}
//       status "on" | "idle" | "blocked"; step is the round of propagation at which the
//       element reached its final state (the order Figure 4 animates in). Propagation runs
//       on the edge list to a fixed point; nothing about the order is written by hand.
//
//   HOTSPOTS  the six TP53 hotspot codons and their class (Olivier, Hollstein and Hainaut
//       2010: R248 and R273 contact DNA; R175, G245, R249, R282 are structural).
//   codonCounts(data, cls) -> [{codon, n, missense, truncating, inframe, top}] for the
//       mutation class "all" | "missense" | "truncating"; data is essay-01.json.
//   mutationSummary(data, cls) -> {total, placed, dbd, dbdShare, hot, hotShare, ranked}
//
//   runChecks(print, data) -> [{name, ok, detail}]
(function (root) {
  "use strict";

  // ---- seeded randomness --------------------------------------------------------
  function mulberry32(s) {
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function mix() {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < arguments.length; i++) {
      h ^= arguments[i] >>> 0; h = Math.imul(h, 16777619) >>> 0;
      h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15;
    }
    return h >>> 0;
  }
  function normal(rng) {
    const u1 = Math.max(rng(), 1e-12), u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  // ---- intervals --------------------------------------------------------------
  const Z95 = 1.959963984540054;
  function wilson(x, n, z) {
    z = z || Z95;
    if (n === 0) return [0, 1];
    const p = x / n, z2 = z * z;
    const centre = (p + z2 / (2 * n)) / (1 + z2 / n);
    const half = (z / (1 + z2 / n)) * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n));
    return [Math.max(0, centre - half), Math.min(1, centre + half)];
  }
  function newcombeDiff(x1, n1, x2, n2, z) {
    z = z || Z95;
    const p1 = x1 / n1, p2 = x2 / n2, d = p1 - p2;
    const [l1, u1] = wilson(x1, n1, z), [l2, u2] = wilson(x2, n2, z);
    const lo = d - Math.sqrt((p1 - l1) ** 2 + (u2 - p2) ** 2);
    const hi = d + Math.sqrt((u1 - p1) ** 2 + (p2 - l2) ** 2);
    return { d, lo, hi };
  }

  // ---- Figure 5: the single-cell experiment -------------------------------------
  const CELL_TYPES = ["T cells", "B cells", "NK cells", "Monocytes", "Dendritic", "Fibroblasts", "Endothelial", "Epithelial"];
  const MALIGNANT = "Epithelial";
  // Markers first (one per cell type), then the three genes the essay is about.
  const CELL_GENES = [
    { name: "CD3D", marker: "T cells" }, { name: "MS4A1", marker: "B cells" },
    { name: "NKG7", marker: "NK cells" }, { name: "CD14", marker: "Monocytes" },
    { name: "FCER1A", marker: "Dendritic" }, { name: "COL1A1", marker: "Fibroblasts" },
    { name: "PECAM1", marker: "Endothelial" }, { name: "EPCAM", marker: "Epithelial" },
    { name: "TP53", marker: null }, { name: "MDM2", marker: null }, { name: "CDKN1A", marker: null }
  ];
  // Seed 1 is the first seed at which all seven non-malignant CDKN1A intervals and the
  // malignant TP53 interval contain 0 at 120 cells; 68% of seeds 1-300 do (runChecks).
  const CELL_DEFAULT_SEED = 1;
  // In the mutant tumour only the malignant cells lose p53 activity. Their CDKN1A and
  // MDM2 (both p53 targets) keep this share of the wildtype expressing fraction, and
  // the expressing cells' mean drops by MEAN_DROP (log-normalised units).
  const TARGET_KEEP = { CDKN1A: 0.25, MDM2: 0.45 };
  const MEAN_DROP = { CDKN1A: 0.9, MDM2: 0.5 };

  function cellParams(seed) {
    const rng = mulberry32(mix(seed, 1));
    const p = {};
    CELL_GENES.forEach(g => CELL_TYPES.forEach(ct => {
      let frac, mean;
      if (g.marker === ct) { frac = 0.72 + 0.16 * rng(); mean = 2.6 + 0.8 * rng(); }
      else if (g.marker) { frac = 0.02 + 0.05 * rng(); mean = 0.6 + 0.3 * rng(); }
      else if (g.name === "TP53") { frac = 0.45 + 0.25 * rng(); mean = 1.1 + 0.4 * rng(); }
      else if (g.name === "MDM2") { frac = 0.20 + 0.20 * rng(); mean = 0.9 + 0.3 * rng(); }
      else { // CDKN1A: higher in stroma and epithelium than in lymphocytes
        const hi = ct === "Fibroblasts" || ct === "Endothelial" || ct === MALIGNANT || ct === "Monocytes";
        frac = (hi ? 0.50 : 0.30) + 0.15 * rng(); mean = (hi ? 1.9 : 1.3) + 0.4 * rng();
      }
      const wt = { frac, mean };
      let mut = { frac, mean };
      if (ct === MALIGNANT && TARGET_KEEP[g.name] != null) {
        mut = { frac: frac * TARGET_KEEP[g.name], mean: Math.max(0.4, mean - MEAN_DROP[g.name]) };
      }
      p[g.name + "|" + ct] = { wt, mut };
    }));
    return p;
  }

  function simulateCells(opts) {
    opts = opts || {};
    const nCells = opts.nCells || 120, seed = opts.seed == null ? CELL_DEFAULT_SEED : opts.seed;
    const params = cellParams(seed);
    const out = { params, nCells, wt: {}, mut: {} };
    ["wt", "mut"].forEach((arm, ai) => {
      CELL_GENES.forEach((g, gi) => CELL_TYPES.forEach((ct, ci) => {
        const key = g.name + "|" + ct, par = params[key][arm];
        const rng = mulberry32(mix(seed, 2 + ai, gi + 1, ci + 1));
        let nExp = 0, sumAll = 0;
        for (let i = 0; i < nCells; i++) {
          const expressed = rng() < par.frac;
          const v = Math.max(0.1, par.mean + 0.7 * normal(rng)); // drawn either way, keeps streams aligned
          if (expressed) { nExp++; sumAll += v; }
        }
        out[arm][key] = { gene: g.name, ct, n: nCells, nExp, frac: nExp / nCells,
          mean: sumAll / nCells, posMean: nExp ? sumAll / nExp : 0 };
      }));
    });
    return out;
  }

  // ---- Figure 4: the pathway -----------------------------------------------------
  const PATHWAY = {
    nodes: [
      { id: "DNA", label: "DNA damage", kind: "signal", source: true,
        desc: "Double-strand breaks or replication stress: the trigger." },
      { id: "ATM", label: "ATM", kind: "kinase",
        desc: "Kinase that senses breaks. It phosphorylates p53 (serine 15) and MDM2, so MDM2 lets go of p53." },
      { id: "MDM2", label: "MDM2", kind: "gene", basal: true,
        desc: "E3 ubiquitin ligase that marks p53 for degradation. It is made all the time at a low level, and p53 switches on more of it." },
      { id: "TP53", label: "TP53", kind: "hub",
        desc: "p53, a transcription factor. Kept scarce by MDM2 until damage stabilises it." },
      { id: "CDKN1A", label: "CDKN1A", kind: "gene",
        desc: "p21, a CDK inhibitor. Stops the cell cycle." },
      { id: "BAX", label: "BAX", kind: "gene",
        desc: "Pro-apoptotic BCL-2 family member. Drives cell death when damage is beyond repair." },
      { id: "ARREST", label: "Cell-cycle arrest", kind: "outcome", desc: "Division pauses so DNA can be repaired." },
      { id: "DEATH", label: "Apoptosis", kind: "outcome", desc: "Programmed cell death." }
    ],
    edges: [
      { s: "DNA", t: "ATM", kind: "activates" },
      { s: "ATM", t: "TP53", kind: "activates" },
      { s: "ATM", t: "MDM2", kind: "inhibits" },
      { s: "MDM2", t: "TP53", kind: "inhibits" },
      { s: "TP53", t: "MDM2", kind: "activates", transcribes: true },
      { s: "TP53", t: "CDKN1A", kind: "activates", transcribes: true },
      { s: "TP53", t: "BAX", kind: "activates", transcribes: true },
      { s: "CDKN1A", t: "ARREST", kind: "activates" },
      { s: "BAX", t: "DEATH", kind: "activates" }
    ]
  };

  // Rules, applied to every edge alike:
  //   a node is lit when it is a source that is switched on, when it has a basal level
  //   (MDM2), or when an activating edge into it is on;
  //   an activating edge is on when its source is lit, unless it is a transcriptional edge
  //   out of a mutant TP53, which is then "blocked" (once TP53 is lit);
  //   an inhibiting edge is on when its source is lit and its source is not itself held by
  //   an inhibiting edge that is on (ATM -| MDM2 stops MDM2 -| TP53).
  // Rounds repeat until nothing changes; the round at which each element settles is its step.
  function pathwayState(opts) {
    const damage = !!(opts && opts.damage), mutant = !!(opts && opts.mutant);
    const N = PATHWAY.nodes, E = PATHWAY.edges;
    let lit = {}; N.forEach(n => { lit[n.id] = false; });
    let st = E.map(() => "idle");
    const history = [];
    for (let round = 0; round < 20; round++) {
      const nextLit = {};
      N.forEach(n => {
        nextLit[n.id] = (n.source && damage) || !!n.basal ||
          E.some((e, i) => e.t === n.id && e.kind === "activates" && st[i] === "on");
      });
      const held = id => E.some((e, i) => e.t === id && e.kind === "inhibits" && st[i] === "on");
      const nextSt = E.map(e => {
        if (!nextLit[e.s]) return "idle";
        if (e.kind === "activates") return e.transcribes && mutant ? "blocked" : "on";
        return held(e.s) ? "idle" : "on";
      });
      // an inhibited target with no activating input is not lit (MDM2 -| TP53 at rest)
      history.push({ lit: nextLit, st: nextSt });
      const same = N.every(n => nextLit[n.id] === lit[n.id]) && nextSt.every((s, i) => s === st[i]);
      lit = nextLit; st = nextSt;
      if (same) break;
    }
    const settle = get => {
      const final = get(history[history.length - 1]);
      let k = history.length - 1;
      while (k > 0 && get(history[k - 1]) === final) k--;
      return k;
    };
    const litStep = {}, nodeStep = {};
    N.forEach(n => { nodeStep[n.id] = settle(h => h.lit[n.id]); if (lit[n.id]) litStep[n.id] = nodeStep[n.id]; });
    return {
      damage, mutant, rounds: history.length,
      lit: litStep, nodeStep,
      edges: E.map((e, i) => Object.assign({}, e, { status: st[i], step: settle(h => h.st[i]) }))
    };
  }

  // ---- Figure 2: real TP53 mutations ---------------------------------------------
  const HOTSPOTS = [
    { codon: 175, label: "R175", cls: "structural" },
    { codon: 245, label: "G245", cls: "structural" },
    { codon: 248, label: "R248", cls: "contact" },
    { codon: 249, label: "R249", cls: "structural" },
    { codon: 273, label: "R273", cls: "contact" },
    { codon: 282, label: "R282", cls: "structural" }
  ];
  const DBD = [102, 292];
  function codonCounts(data, cls) {
    cls = cls || "all";
    return data.codons.map(c => {
      const n = cls === "all" ? c.missense + c.truncating + c.inframe + c.other : c[cls];
      return { codon: c.codon, n, missense: c.missense, truncating: c.truncating, inframe: c.inframe, top: c.top };
    }).filter(c => c.n > 0);
  }
  function mutationSummary(data, cls) {
    const cc = codonCounts(data, cls);
    const total = cls === "all" || !cls ? data.totals.mutations : data.totals[cls];
    const placed = cc.reduce((a, c) => a + c.n, 0);
    const dbd = cc.filter(c => c.codon >= DBD[0] && c.codon <= DBD[1]).reduce((a, c) => a + c.n, 0);
    const hotSet = new Set(HOTSPOTS.map(h => h.codon));
    const hot = cc.filter(c => hotSet.has(c.codon)).reduce((a, c) => a + c.n, 0);
    const ranked = cc.slice().sort((a, b) => b.n - a.n || a.codon - b.codon);
    return { total, placed, sites: cc.length, dbd, dbdShare: dbd / placed, hot, hotShare: hot / placed, ranked };
  }

  // ---- checks ------------------------------------------------------------------
  function runChecks(print, data) {
    const out = [];
    const check = (name, ok, detail) => { out.push({ name, ok: !!ok, detail: detail || "" }); if (print) print(name, ok, detail); };
    const near = (a, b, tol) => Math.abs(a - b) <= tol;

    // Newcombe interval against statsmodels 0.14 confint_proportions_2indep(method="newcomb");
    // the first two are Newcombe 1998 (Stat Med 17:873) Table II examples (a) and (b).
    const ref = [
      [56, 70, 48, 80, 0.05243147240236498, 0.33387265403690614],
      [9, 10, 3, 10, 0.1705227239345029, 0.809017973535488],
      [6, 7, 2, 7, 0.05822792748231209, 0.8062496375242278],
      [5, 56, 0, 29, -0.038137147903536936, 0.19256001385511165],
      [0, 10, 0, 20, -0.1611251580528194, 0.27753279986288926],
      [10, 10, 0, 20, 0.6790860371419145, 1.0],
      [78, 120, 18, 120, 0.3839849701148519, 0.595510158807889],
      [50, 120, 47, 120, -0.0978625529438199, 0.1468070024934973]
    ];
    let worst = 0;
    ref.forEach(r => {
      const c = newcombeDiff(r[0], r[1], r[2], r[3]);
      worst = Math.max(worst, Math.abs(c.lo - r[4]), Math.abs(c.hi - r[5]));
    });
    check("Newcombe hybrid score interval matches statsmodels and Newcombe 1998 Table II", worst < 1e-9, `8 cases, max error ${worst.toExponential(1)}`);
    const w = wilson(81, 263);
    check("Wilson interval, 81/263 (Newcombe 1998 Stat Med 17:857 example)", near(w[0], 0.2553, 5e-5) && near(w[1], 0.3662, 5e-5), w.map(v => v.toFixed(4)).join(" to "));

    // cells
    const s1 = simulateCells(), s2 = simulateCells();
    check("cells: same seed, same experiment", JSON.stringify(s1.wt) === JSON.stringify(s2.wt) && JSON.stringify(s1.mut) === JSON.stringify(s2.mut));
    const changed = Object.keys(s1.params).filter(k => JSON.stringify(s1.params[k].wt) !== JSON.stringify(s1.params[k].mut));
    check("cells: only the malignant cells' CDKN1A and MDM2 differ between tumours",
      changed.length === 2 && changed.includes("CDKN1A|" + MALIGNANT) && changed.includes("MDM2|" + MALIGNANT), changed.join(", "));
    check("cells: TP53 has one set of parameters per cell type, used by both tumours",
      CELL_TYPES.every(ct => JSON.stringify(s1.params["TP53|" + ct].wt) === JSON.stringify(s1.params["TP53|" + ct].mut)));
    const big = simulateCells({ nCells: 400 });
    check("cells: raising nCells extends each stream (first 120 cells unchanged)",
      (function () {
        // recount the first 120 cells of one stream at n = 400 and compare with n = 120
        const key = "CDKN1A|Fibroblasts", par = big.params[key].wt;
        const gi = CELL_GENES.findIndex(g => g.name === "CDKN1A") + 1, ci = CELL_TYPES.indexOf("Fibroblasts") + 1;
        const rng = mulberry32(mix(CELL_DEFAULT_SEED, 2, gi, ci));
        let nExp = 0;
        for (let i = 0; i < 120; i++) { if (rng() < par.frac) nExp++; normal(rng); }
        return nExp === s1.wt[key].nExp;
      })());
    const ci = ct => { const a = s1.wt["CDKN1A|" + ct], b = s1.mut["CDKN1A|" + ct]; return newcombeDiff(b.nExp, b.n, a.nExp, a.n); };
    const m = ci(MALIGNANT);
    check("cells: malignant CDKN1A fraction falls, interval excludes 0 (n = 120)", m.hi < 0 && m.d < -0.2, `${(m.d * 100).toFixed(0)} points, ${(m.lo * 100).toFixed(0)} to ${(m.hi * 100).toFixed(0)}`);
    const ctrl = CELL_TYPES.filter(ct => ct !== MALIGNANT).map(ct => [ct, ci(ct)]);
    check("cells: every non-malignant CDKN1A interval contains 0 at the default seed (n = 120)",
      ctrl.every(([, c]) => c.lo <= 0 && c.hi >= 0), ctrl.map(([ct, c]) => `${ct} ${(c.d * 100).toFixed(0)}`).join(", "));
    const t = (() => { const a = s1.wt["TP53|" + MALIGNANT], b = s1.mut["TP53|" + MALIGNANT]; return newcombeDiff(b.nExp, b.n, a.nExp, a.n); })();
    check("cells: malignant TP53 interval contains 0 at the default seed (n = 120)", t.lo <= 0 && t.hi >= 0, `${(t.d * 100).toFixed(0)} points`);
    const worstCtrl = Math.max.apply(null, ctrl.map(([, c]) => Math.abs(c.d)));
    check("cells: the malignant CDKN1A drop is larger than any control change", Math.abs(m.d) > 2 * worstCtrl,
      `${(Math.abs(m.d) * 100).toFixed(0)} vs ${(worstCtrl * 100).toFixed(0)} points`);
    // how typical the default seed is, and whether the intervals are calibrated
    let typical = 0, cover = 0, comps = 0;
    for (let sd = 1; sd <= 100; sd++) {
      const s = simulateCells({ seed: sd });
      const inside = (g, ct) => { const a = s.wt[g + "|" + ct], b = s.mut[g + "|" + ct]; const c = newcombeDiff(b.nExp, b.n, a.nExp, a.n); return c.lo <= 0 && c.hi >= 0; };
      if (CELL_TYPES.filter(ct => ct !== MALIGNANT).every(ct => inside("CDKN1A", ct)) && inside("TP53", MALIGNANT)) typical++;
      Object.keys(s.wt).forEach(k => {
        if (k === "CDKN1A|" + MALIGNANT || k === "MDM2|" + MALIGNANT) return;
        const parts = k.split("|"); comps++; if (inside(parts[0], parts[1])) cover++;
      });
    }
    check("cells: the default seed is typical (the same holds for 55-80% of seeds 1-100)", typical >= 55 && typical <= 80, `${typical} of 100`);
    check("cells: 95% intervals for unchanged cells contain 0 in 93-98% of comparisons (seeds 1-100)", cover / comps >= 0.93 && cover / comps <= 0.98, `${(100 * cover / comps).toFixed(1)}% of ${comps}`);

    // pathway
    const rest = pathwayState({ damage: false, mutant: false });
    const es = (st, s, t) => st.edges.find(e => e.s === s && e.t === t).status;
    check("pathway at rest: MDM2 -| TP53 on, TP53 not lit, nothing downstream",
      es(rest, "MDM2", "TP53") === "on" && !("TP53" in rest.lit) && !("CDKN1A" in rest.lit) && rest.lit.MDM2 != null);
    const wt = pathwayState({ damage: true, mutant: false });
    check("pathway, wildtype + damage: arrest and apoptosis lit, MDM2 -| TP53 released, TP53 -> MDM2 on",
      "ARREST" in wt.lit && "DEATH" in wt.lit && es(wt, "MDM2", "TP53") === "idle" && es(wt, "ATM", "MDM2") === "on" && es(wt, "TP53", "MDM2") === "on");
    check("pathway, wildtype + damage: steps run DNA < ATM < TP53 < CDKN1A < ARREST",
      wt.lit.DNA < wt.lit.ATM && wt.lit.ATM < wt.lit.TP53 && wt.lit.TP53 < wt.lit.CDKN1A && wt.lit.CDKN1A < wt.lit.ARREST,
      ["DNA", "ATM", "TP53", "CDKN1A", "ARREST"].map(k => k + " " + wt.lit[k]).join(", "));
    const mu = pathwayState({ damage: true, mutant: true });
    const blocked = mu.edges.filter(e => e.status === "blocked").map(e => e.t);
    check("pathway, R175H + damage: TP53 lit, its three transcriptional edges blocked, no outcome",
      "TP53" in mu.lit && blocked.length === 3 && ["MDM2", "CDKN1A", "BAX"].every(t => blocked.includes(t)) &&
      !("CDKN1A" in mu.lit) && !("ARREST" in mu.lit) && !("DEATH" in mu.lit), blocked.join(", "));
    const muRest = pathwayState({ damage: false, mutant: true });
    check("pathway, R175H at rest: same lit set as wildtype at rest",
      JSON.stringify(Object.keys(muRest.lit).sort()) === JSON.stringify(Object.keys(rest.lit).sort()));

    // real mutation data
    if (data && data.codons) {
      const sum = data.codons.reduce((a, c) => a + c.missense + c.truncating + c.inframe + c.other, 0);
      check("TCGA TP53 data: per-codon counts add up to the total", sum + data.totals.unplaced === data.totals.mutations,
        `${sum} placed + ${data.totals.unplaced} unplaced = ${data.totals.mutations}`);
      check("TCGA TP53 data: class totals add up", data.totals.missense + data.totals.truncating + data.totals.inframe + data.totals.other === data.totals.mutations);
      check("TCGA TP53 data: 32 studies; sequenced and mutated samples add up",
        data.studies.length === 32 && data.studies.reduce((a, s) => a + s.sequenced, 0) === data.sequenced &&
        data.studies.reduce((a, s) => a + s.tp53Mutated, 0) === data.tp53MutatedSamples,
        `${data.tp53MutatedSamples} of ${data.sequenced} samples`);
      const all = mutationSummary(data, "all");
      const top3 = all.ranked.slice(0, 3).map(c => c.codon);
      check("TCGA TP53 data: the three commonest codons are 273, 248, 175 (prose)", JSON.stringify(top3) === "[273,248,175]", top3.join(", "));
      const r175 = data.codons.find(c => c.codon === 175).top[0];
      const singles = [];
      data.codons.forEach(c => c.top.forEach(t => singles.push(t)));
      singles.sort((a, b) => b[1] - a[1]);
      check("TCGA TP53 data: R175H is the commonest single protein change (prose)", singles[0][0] === "R175H" && r175[0] === "R175H", `${singles[0][0]} ${singles[0][1]}, then ${singles[1][0]} ${singles[1][1]}`);
      const mis = mutationSummary(data, "missense"), tr = mutationSummary(data, "truncating");
      check("TCGA TP53 data: missense mutations concentrate in the DNA-binding domain more than truncating ones (prose)",
        mis.dbdShare > 0.9 && tr.dbdShare < mis.dbdShare && mis.hotShare > 3 * tr.hotShare,
        `DBD ${(mis.dbdShare * 100).toFixed(0)}% vs ${(tr.dbdShare * 100).toFixed(0)}%; hotspots ${(mis.hotShare * 100).toFixed(0)}% vs ${(tr.hotShare * 100).toFixed(0)}%`);
      check("UniProt domains: DNA-binding 102-292, zinc ligands 176, 179, 238, 242",
        data.domains.some(d => d.name === "DNA-binding" && d.start === 102 && d.end === 292) && data.zinc.join() === "176,179,238,242");
    }
    if (typeof module !== "undefined" && module.exports) {
      try {
        const BC = require("./cohort.js");
        check("HOTSPOTS agree with BioCohort.HOTSPOTS (codon and class)",
          JSON.stringify(BC.HOTSPOTS.map(h => [h.codon, h.cls])) === JSON.stringify(HOTSPOTS.map(h => [h.codon, h.cls])));
      } catch (e) { /* cohort.js absent: nothing to compare */ }
    }
    return out;
  }

  const api = {
    mulberry32, mix, wilson, newcombeDiff,
    CELL_TYPES, CELL_GENES, MALIGNANT, CELL_DEFAULT_SEED, cellParams, simulateCells,
    PATHWAY, pathwayState, HOTSPOTS, DBD, codonCounts, mutationSummary, runChecks
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay01 = api;
})(typeof window !== "undefined" ? window : this);
