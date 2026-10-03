// BioEssay06: the model code behind essay 06 (Clustered Heatmaps).
// Browser global `BioEssay06`, and `module.exports` under node. Needs BioCohort (cohort.js)
// for the cohort figures; loads it with require() under node. No fetch, no Math.random.
//
// ---- API -------------------------------------------------------------------------
//   BioEssay06.CPG_OFFSETS      [-42, 221, 476, 659]: four real CpGs in the CDKN1A promoter
//                               island (hg38, offsets from the Ensembl canonical TSS, promoter
//                               convention TSS = +1, no 0). runChecks confirms each is a "CG"
//                               in locus.json (node) or in the stored context (browser).
//   BioEssay06.geneMatrix(opts)  Figure 1's simulated matrix. opts {seed 6}.
//     30 genes x 10 samples: 10 genes higher in the 5 treated samples, 10 lower, 10 with no
//     planted pattern, each gene on its own baseline (log2 4..11). Rows and columns are put in
//     a seeded random order and only then named G01..G30 and S01..S10, so the names carry no
//     hint of the groups.
//     -> { genes: [{id, group: "up" | "down" | "none", base}], samples: [{id, condition:
//          "control" | "treated"}], X: [[log2]], Z: [[row z-score]] }
//   BioEssay06.corrDist(a, b)   1 - Pearson r
//   BioEssay06.distMatrix(rows, fn)
//   BioEssay06.hclust(D)        average linkage (UPGMA) on a distance matrix.
//     -> { n, merges: [{a, b, height, size}] (ids: leaves 0..n-1, merge i is n + i, as in
//          scipy's linkage), root, maxH, order: leaf order (left branch first) }
//   BioEssay06.cutTree(tree, h) cluster label per leaf: merges at height <= h are joined.
//                               Labels are numbered in leaf order.
//   BioEssay06.pureClades(tree, groups)  per group, the largest branch holding only that
//                               group: {size, height, members}
//   BioEssay06.pac(M, lo, hi)   proportion of ambiguous clustering: share of off-diagonal
//                               pairs with lo < M[i][j] < hi (Senbabaoglu et al. 2014).
//   BioEssay06.gaussianNull(Z, seed)  a cohort the same size as Z drawn from one multivariate
//                               normal with Z's mean and covariance (one blob, no subtypes),
//                               capped at +-3 like the real features
//   BioEssay06.permutedNull(Z, seed)  each column shuffled on its own (keeps every feature's
//                               distribution, breaks every correlation)
//   BioEssay06.matchClusters(labels, truth, keys)  one-to-one matching of computed clusters to
//                               planted keys with the largest total overlap; clusters left
//                               over map to null. -> { map: {cluster: key | null}, agree }
//   BioEssay06.analyseCohort(opts)  the cohort figures' numbers, computed with
//                               BioCohort.consensus (reps 50, seed 90210) at k = 2..6.
//     -> { C, F, ks, runs: [{k, pac, labels, M, ari}], bestK, best, map, agree, ... }
//   BioEssay06.nullCurves(Z, opts)  PAC at k = 2..6 for opts.draws Gaussian nulls (seeds
//                               1..draws; opts.keepM keeps each consensus matrix and labels)
//                               and one permuted null (seed 1)
//   BioEssay06.runChecks(print, data) -> [{name, ok, detail}]
// -----------------------------------------------------------------------------------
(function (root) {
  "use strict";

  const BC = root.BioCohort || (typeof require === "function" ? require("./cohort.js") : null);
  const CPG_OFFSETS = [-42, 221, 476, 659];
  const KS = [2, 3, 4, 5, 6];
  const CC_OPTS = { reps: 50, frac: 0.8, seed: 90210 };

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function normal(rng) { const u = rng() || 1e-12, v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
  const mean = v => v.reduce((a, b) => a + b, 0) / v.length;
  const sd = v => { const m = mean(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / Math.max(1, v.length - 1)); };
  const pad2 = i => String(i).padStart(2, "0");

  // ---- Figure 1: simulated gene-by-sample matrix ----
  function geneMatrix(opts) {
    opts = opts || {};
    const rng = mulberry32(opts.seed == null ? 6 : opts.seed);
    const groups = [];
    for (let i = 0; i < 10; i++) groups.push("up");
    for (let i = 0; i < 10; i++) groups.push("down");
    for (let i = 0; i < 10; i++) groups.push("none");
    const conds = ["control", "control", "control", "control", "control", "treated", "treated", "treated", "treated", "treated"];
    const rowOrder = shuffle(groups.map((_, i) => i), rng);
    const colOrder = shuffle(conds.map((_, i) => i), rng);
    const genes = rowOrder.map((gi, r) => ({ id: "G" + pad2(r + 1), group: groups[gi], base: 4 + 7 * rng() }));
    const samples = colOrder.map((si, c) => ({ id: "S" + pad2(c + 1), condition: conds[si] }));
    const X = genes.map(g => samples.map(s => {
      let v = g.base + 0.6 * normal(rng);
      if (s.condition === "treated" && g.group === "up") v += 2.0;
      if (s.condition === "treated" && g.group === "down") v -= 2.0;
      return Math.round(v * 1000) / 1000;
    }));
    const Z = X.map(row => { const m = mean(row), s = sd(row) || 1; return row.map(v => (v - m) / s); });
    genes.forEach(g => { g.base = Math.round(g.base * 100) / 100; });
    return { genes, samples, X, Z };
  }

  // ---- hierarchical clustering ----
  function corrDist(a, b) {
    const ma = mean(a), mb = mean(b);
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < a.length; i++) { const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
    const r = da && db ? num / Math.sqrt(da * db) : 0;
    return 1 - Math.max(-1, Math.min(1, r));
  }
  function distMatrix(rows, fn) { return rows.map(a => rows.map(b => fn(a, b))); }
  function hclust(D) {
    const n = D.length;
    let active = Array.from({ length: n }, (_, i) => ({ id: i, members: [i] }));
    const nodes = active.slice(), merges = [];
    const dist = (A, B) => { let s = 0; for (const i of A.members) for (const j of B.members) s += D[i][j]; return s / (A.members.length * B.members.length); };
    while (active.length > 1) {
      let bi = 0, bj = 1, bd = Infinity;
      for (let i = 0; i < active.length; i++) for (let j = i + 1; j < active.length; j++) {
        const d = dist(active[i], active[j]);
        if (d < bd - 1e-12) { bd = d; bi = i; bj = j; }
      }
      const A = active[bi], B = active[bj];
      const node = { id: n + merges.length, members: A.members.concat(B.members), left: A, right: B, height: bd };
      merges.push({ a: A.id, b: B.id, height: bd, size: node.members.length });
      nodes.push(node);
      active.splice(bj, 1); active.splice(bi, 1, node);
    }
    const rootNode = active[0];
    const order = [];
    (function walk(nd) { if (!nd.left) { order.push(nd.id); return; } walk(nd.left); walk(nd.right); })(rootNode);
    return { n, merges, nodes, root: rootNode, maxH: merges.length ? Math.max(...merges.map(m => m.height)) : 0, order };
  }
  function cutTree(tree, h) {
    const lab = new Array(tree.n);
    const groups = [];
    (function walk(nd) {
      if (!nd.left || nd.height <= h) { groups.push(nd.members); return; }
      walk(nd.left); walk(nd.right);
    })(tree.root);
    // number clusters in leaf order
    const pos = new Map(tree.order.map((id, i) => [id, i]));
    groups.sort((a, b) => Math.min(...a.map(i => pos.get(i))) - Math.min(...b.map(i => pos.get(i))));
    groups.forEach((g, c) => g.forEach(i => { lab[i] = c; }));
    return lab;
  }

  // ---- consensus clustering helpers ----
  function pac(M, lo, hi) {
    lo = lo == null ? 0.1 : lo; hi = hi == null ? 0.9 : hi;
    let amb = 0, pairs = 0;
    for (let i = 0; i < M.length; i++) for (let j = i + 1; j < M.length; j++) { pairs++; if (M[i][j] > lo && M[i][j] < hi) amb++; }
    return pairs ? amb / pairs : 0;
  }
  function covariance(Z) {
    const n = Z.length, d = Z[0].length;
    const mu = Array.from({ length: d }, (_, j) => Z.reduce((a, r) => a + r[j], 0) / n);
    const S = Array.from({ length: d }, (_, a) => Array.from({ length: d }, (_, b) => {
      let s = 0; for (const r of Z) s += (r[a] - mu[a]) * (r[b] - mu[b]); return s / (n - 1);
    }));
    return { mu, S };
  }
  function cholesky(A) {
    const n = A.length, L = A.map(r => r.map(() => 0));
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-10)) : s / L[j][j];
    }
    return L;
  }
  function gaussianNull(Z, seed, nOut) {
    const { mu, S } = covariance(Z);
    const L = cholesky(S), d = mu.length, rng = mulberry32((seed >>> 0) * 7919 + 1);
    const n = nOut || Z.length;
    return Array.from({ length: n }, () => {
      const e = Array.from({ length: d }, () => normal(rng));
      return L.map((row, i) => { let s = mu[i]; for (let k = 0; k <= i; k++) s += row[k] * e[k]; return nOut ? s : Math.max(-3, Math.min(3, s)); });
    });
  }
  function permutedNull(Z, seed) {
    const rng = mulberry32((seed >>> 0) * 31 + 7), X = Z.map(r => r.slice());
    for (let j = 0; j < Z[0].length; j++) {
      const col = shuffle(Z.map(r => r[j]), rng);
      X.forEach((r, i) => { r[j] = col[i]; });
    }
    return X;
  }
  function permutations(arr, k) {
    if (k === 0) return [[]];
    const out = [];
    arr.forEach((x, i) => permutations(arr.slice(0, i).concat(arr.slice(i + 1)), k - 1).forEach(p => out.push([x].concat(p))));
    return out;
  }
  function matchClusters(labels, truth, keys) {
    const ks = Array.from(new Set(labels)).sort((a, b) => a - b);
    const overlap = c => key => labels.reduce((s, l, i) => s + (l === c && truth[i] === key ? 1 : 0), 0);
    const ov = new Map(ks.map(c => [c, new Map(keys.map(key => [key, overlap(c)(key)]))]));
    let best = null, bestS = -1;
    const m = Math.min(ks.length, keys.length);
    // choose which m clusters get keys and which keys: brute force (k <= 6, 4 keys)
    permutations(ks, m).forEach(cs => permutations(keys, m).forEach(kk => {
      let s = 0; cs.forEach((c, i) => { s += ov.get(c).get(kk[i]); });
      if (s > bestS) { bestS = s; best = { cs, kk }; }
    }));
    const map = {}; ks.forEach(c => { map[c] = null; });
    best.cs.forEach((c, i) => { map[c] = best.kk[i]; });
    return { map, agree: bestS };
  }

  function analyseCohort(opts) {
    opts = opts || {};
    const C = opts.cohort || BC.generate();
    const F = BC.features(C, { cpgOffsets: CPG_OFFSETS });
    const truth = C.patients.map(p => p.subtype);
    const runs = KS.map(k => {
      const cc = BC.consensus(F.z, k, CC_OPTS);
      return { k, pac: cc.pac, labels: cc.labels, M: cc.M, ari: BC.adjustedRand(cc.labels, truth) };
    });
    const best = runs.reduce((a, b) => (b.pac < a.pac ? b : a));
    const match = matchClusters(best.labels, truth, ["A", "B", "C", "D"]);
    const named = best.labels.map(l => match.map[l]);
    const idx = f => C.patients.map((p, i) => [p, i]).filter(([p]) => f(p)).map(([, i]) => i);
    const partial = idx(p => p.partial), fullC = idx(p => p.subtype === "C" && !p.partial), D = idx(p => p.subtype === "D");
    const avgM = (A, B) => { let s = 0, n = 0; A.forEach(i => B.forEach(j => { if (i !== j) { s += best.M[i][j]; n++; } })); return n ? s / n : 0; };
    const blocks = Array.from(new Set(best.labels)).map(c => {
      const mem = idx2(best.labels, c); let s = 0, n = 0, mn = 1;
      mem.forEach(i => mem.forEach(j => { if (i < j) { s += best.M[i][j]; n++; mn = Math.min(mn, best.M[i][j]); } }));
      return { cluster: c, key: match.map[c], size: mem.length, mean: n ? s / n : 1, min: mn };
    });
    return {
      C, F, truth, ks: KS, runs, bestK: best.k, best, map: match.map, named, agree: match.agree,
      partialIds: partial.map(i => C.patients[i].id),
      partialToD: partial.filter(i => named[i] === "D").length,
      partialToC: partial.filter(i => named[i] === "C").length,
      partialWithD: avgM(partial, D), partialWithFullC: avgM(partial, fullC),
      misses: C.patients.map((p, i) => i).filter(i => named[i] !== truth[i]),
      blocks
    };
  }
  // largest branch containing only members of each group
  function pureClades(tree, groups) {
    const out = {};
    Array.from(new Set(groups)).forEach(gname => { out[gname] = { size: 0, height: 0, members: [] }; });
    tree.nodes.forEach(nd => {
      const gs = new Set(nd.members.map(i => groups[i]));
      if (gs.size !== 1) return;
      const gname = groups[nd.members[0]];
      if (nd.members.length > out[gname].size) out[gname] = { size: nd.members.length, height: nd.height || 0, members: nd.members.slice() };
    });
    return out;
  }
  function idx2(labels, c) { const out = []; labels.forEach((l, i) => { if (l === c) out.push(i); }); return out; }

  function nullCurves(Z, opts) {
    opts = opts || {};
    const draws = opts.draws == null ? 20 : opts.draws;
    const gauss = [];
    for (let s = 1; s <= draws; s++) {
      const X = gaussianNull(Z, s);
      gauss.push({ seed: s, runs: KS.map(k => { const cc = BC.consensus(X, k, CC_OPTS); return opts.keepM ? { k, pac: cc.pac, M: cc.M, labels: cc.labels } : { k, pac: cc.pac }; }) });
    }
    const Xp = permutedNull(Z, 1);
    const perm = KS.map(k => ({ k, pac: BC.consensus(Xp, k, CC_OPTS).pac }));
    const bestOf = r => r.reduce((a, b) => (b.pac < a.pac ? b : a));
    return { gauss, perm, bestPac: gauss.map(g => bestOf(g.runs).pac), bestK: gauss.map(g => bestOf(g.runs).k) };
  }

  // ---- checks ----
  function runChecks(print, data) {
    const out = [];
    const add = (name, ok, detail) => { out.push({ name, ok: !!ok, detail }); if (print) console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); };
    const near = (a, b, tol) => Math.abs(a - b) <= tol;

    // hclust against scipy
    const G = geneMatrix();
    const tree = hclust(distMatrix(G.Z, corrDist));
    if (data && data.scipy) {
      const ours = tree.merges.map(m => m.height).sort((a, b) => a - b);
      const ref = data.scipy.heights.slice().sort((a, b) => a - b);
      const maxErr = Math.max(...ours.map((h, i) => Math.abs(h - ref[i])));
      add("Figure 1 average-linkage merge heights equal scipy.cluster.hierarchy.linkage(method='average', metric='correlation')",
        ours.length === ref.length && maxErr < 1e-9, "29 merges, max |diff| " + maxErr.toExponential(1));
      const sets = t => t.merges.map((m, i) => t.nodes[t.n + i].members.slice().sort((a, b) => a - b).join(",")).sort();
      const refSets = data.scipy.clusters.map(c => c.slice().sort((a, b) => a - b).join(",")).sort();
      add("Figure 1 tree has the same 29 clusters as scipy", JSON.stringify(sets(tree)) === JSON.stringify(refSets));
      add("Figure 1 matrix is the one scipy saw (checksum)", near(G.X.flat().reduce((a, b) => a + b, 0), data.scipy.sumX, 1e-6), "sum " + G.X.flat().reduce((a, b) => a + b, 0).toFixed(3));
    } else add("scipy reference present in essay-06.json", false, "run node scripts/bio-06-reference.mjs");

    // textbook UPGMA example (Sokal and Michener style 5-taxon matrix, hand-computed)
    const T = [[0, 17, 21, 31, 23], [17, 0, 30, 34, 21], [21, 30, 0, 28, 39], [31, 34, 28, 0, 43], [23, 21, 39, 43, 0]];
    const th = hclust(T).merges.map(m => m.height);
    add("UPGMA on the Wikipedia 5-taxon example merges at 17, 22, 28, 33 (branch lengths 8.5, 11, 14, 16.5)", JSON.stringify(th) === JSON.stringify([17, 22, 28, 33]), th.join(", "));

    // Figure 1 shape: original order looks unordered; clustering recovers groups
    const runs = a => { let r = 1; for (let i = 1; i < a.length; i++) if (a[i] !== a[i - 1]) r++; return r; };
    const origRuns = runs(G.genes.map(g => g.group)), clusRuns = runs(tree.order.map(i => G.genes[i].group));
    add("Figure 1 original row order is mixed (group changes many times); clustered order is not", origRuns >= 15 && clusRuns < origRuns, "group runs: original " + origRuns + ", clustered " + clusRuns);
    const colTree = hclust(distMatrix(G.samples.map((_, s) => G.Z.map(r => r[s])), corrDist));
    const top2 = cutTree(colTree, colTree.maxH - 1e-9);
    const pure = [0, 1].every(c => new Set(G.samples.filter((_, s) => top2[s] === c).map(s => s.condition)).size === 1);
    add("Figure 1 column tree's top split separates control from treated", pure);
    const pc = pureClades(tree, G.genes.map(g => g.group));
    add("Figure 1 tree: the 10 up genes form one branch with nothing else in it; at least 9 of the 10 down genes do too",
      pc.up.size === 10 && pc.down.size >= 9, "up " + pc.up.size + " at 1 - r = " + pc.up.height.toFixed(3) + ", down " + pc.down.size + " at " + pc.down.height.toFixed(3));

    // PAC on a hand-built matrix
    const M = [[1, 1, 0.5, 0], [1, 1, 0.95, 0.05], [0.5, 0.95, 1, 0.2], [0, 0.05, 0.2, 1]];
    add("PAC counts pairs strictly inside (0.1, 0.9): 2 of 6", near(pac(M), 2 / 6, 1e-12), pac(M).toFixed(4));

    // Gaussian null reproduces the covariance
    const Zs = [[1, 2, 0], [2, 1, 1], [0, 0, -1], [3, 4, 2], [1, 1, 0], [2, 3, 1]];
    const big = gaussianNull(Zs, 3, 40000), c0 = covariance(Zs).S, c1 = covariance(big).S;
    const err = Math.max(...c0.map((r, i) => Math.max(...r.map((v, j) => Math.abs(v - c1[i][j])))));
    add("Gaussian null draws reproduce the target covariance (40,000 draws, max error < 0.05)", err < 0.05, "max |diff| " + err.toFixed(3));

    // matching
    const mm = matchClusters([0, 0, 1, 1, 2, 2, 2], ["B", "B", "A", "A", "A", "C", "C"], ["A", "B", "C", "D"]);
    add("cluster-to-label matching is one-to-one with the largest overlap", mm.map[0] === "B" && mm.map[1] === "A" && mm.map[2] === "C" && mm.agree === 6);

    // CpGs are real
    if (data && data.cpgs) {
      let ok = data.cpgs.length === 4 && data.cpgs.every((c, i) => c.offset === CPG_OFFSETS[i] && c.dinuc === "CG" && c.offset >= -200 && c.offset <= 700);
      let detail = data.cpgs.map(c => c.offset + " chr6:" + c.pos1).join(", ");
      if (typeof module !== "undefined" && module.exports && typeof require === "function") {
        try {
          const BL = require("./locus.js"), Lc = BL.load(require("./data/locus.json"));
          const R = Lc.region("cdkn1a"), tx = R.canonical("CDKN1A");
          ok = ok && CPG_OFFSETS.every(o => { const p = R.posFromTSS(o, tx); return R.seq1(p, p + 1).toUpperCase() === "CG"; });
          detail += "; re-read from locus.json";
        } catch (e) { /* browser */ }
      }
      add("the four CpG offsets are CG dinucleotides inside the CDKN1A island, -200..+700", ok, detail);
    } else add("CpG context present in essay-06.json", false);

    // cohort numbers the prose quotes
    if (BC) {
      const A = analyseCohort();
      add("cohort: PAC is lowest at k = 4", A.bestK === 4, "PAC k=2..6 " + A.runs.map(r => r.pac.toFixed(3)).join(", "));
      add("cohort: k = 4 recovers the planted subtypes (ARI >= 0.8)", A.best.ari >= 0.8, "ARI " + A.best.ari.toFixed(3) + ", agree " + A.agree + "/100");
      const tab = {}; A.C.patients.forEach((p, i) => { const k = p.subtype + (p.partial ? "*" : "") + ">" + A.named[i]; tab[k] = (tab[k] || 0) + 1; });
      add("cohort: B, D and fully methylated C are recovered whole", tab["B>B"] === 12 && tab["D>D"] === 30 && tab["C>C"] === 12, JSON.stringify(tab));
      add("cohort: the partly methylated tumours sit with the pathway-intact cluster", A.partialToD >= 5 && A.partialWithD > 0.8 && A.partialWithFullC < 0.2,
        A.partialToD + " of 6 to D; mean consensus with D " + A.partialWithD.toFixed(2) + ", with full C " + A.partialWithFullC.toFixed(2));
      const N = nullCurves(A.F.z, { draws: 20 });
      const j = A.ks.indexOf(A.bestK), atBest = N.gauss.map(g => g.runs[j].pac), at2 = N.gauss.map(g => g.runs[0].pac);
      add("cohort PAC at its best k is below all 20 Gaussian null draws at that k", A.best.pac < Math.min(...atBest),
        A.best.pac.toFixed(3) + " vs null " + Math.min(...atBest).toFixed(3) + ".." + Math.max(...atBest).toFixed(3));
      add("cohort PAC at k = 2 lies inside the null range at k = 2", A.runs[0].pac > Math.min(...at2) && A.runs[0].pac < Math.max(...at2),
        A.runs[0].pac.toFixed(3) + " in " + Math.min(...at2).toFixed(3) + ".." + Math.max(...at2).toFixed(3));
      add("some cluster-free Gaussian draw splits into two blocks with PAC below 0.1", Math.min(...at2) < 0.1,
        "lowest k = 2 PAC " + Math.min(...at2).toFixed(3) + " (draw " + (1 + at2.indexOf(Math.min(...at2))) + "); best k per draw " + N.bestK.join(""));
      add("permuted null: PAC above 0.5 at every k", N.perm.every(r => r.pac > 0.5), N.perm.map(r => r.pac.toFixed(2)).join(", "));
    }
    return out;
  }

  const api = { CPG_OFFSETS, KS, CC_OPTS, geneMatrix, corrDist, distMatrix, hclust, cutTree, pureClades, pac, covariance, gaussianNull, permutedNull, matchClusters, analyseCohort, nullCurves, mulberry32, runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay06 = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
