// Adds a `umap` block to docs/bioinformatics/shared/data/essay-07.json: umap-learn's own values on
// the essay's normalized cells (find_ab_params, smooth_knn sigma/rho, the fuzzy graph, the
// component layout of the spectral start, and recall/centroid rank correlation averaged over
// many seeds), plus the library's own seed averages that the essay's prose quotes.
// Usage: PYTHON=/path/to/python-with-umap-learn node scripts/bio-07-umap-reference.mjs [seeds=50]
// (umap-learn is not a repo dependency; a throwaway venv under temp/ is fine).
import { createRequire } from "node:module";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const L = require(path.join(root, "docs/bioinformatics/shared/essay-07.js"));
const tmp = path.join(root, "temp/bio-audit/g07");
mkdirSync(tmp, { recursive: true });
const seeds = +(process.argv[2] || 50);

const sim = L.simulateCells(), X = L.expression(sim, "norm"), n = X.length, D = L.sqdist(X);
const labels = sim.cells.map((c) => c.type);
writeFileSync(path.join(tmp, "umap-ref-in.json"), JSON.stringify({ X, labels }));
execFileSync(process.env.PYTHON || "python3", [path.join(root, "scripts/bio-07-umap-reference.py"), path.join(tmp, "umap-ref-in.json"), path.join(tmp, "umap-ref-out.json"), String(seeds)], { stdio: "inherit" });
const ref = JSON.parse(readFileSync(path.join(tmp, "umap-ref-out.json"), "utf8"));

// the library's own averages over the same number of seeds (seeds 1..n; t-SNE over 10)
const PAIRS = []; for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) PAIRS.push([a, b]);
const cd = (C) => PAIRS.map((p) => Math.sqrt(C[p[0]].reduce((s, v, j) => s + (v - C[p[1]][j]) ** 2, 0)));
const cdh = cd(L.centroids(X, labels, 5));
const measures = (Y) => { const r = L.recallCurve(D, L.sqdist(Y), n); return [r[10], r[15], r[100], r[200], L.spearman(cdh, cd(L.centroids(Y, labels, 5)))]; };
const avg = (rows) => rows[0].map((_, j) => rows.reduce((s, r) => s + r[j], 0) / rows.length);
const G = L.fuzzyGraph(X, {});
const lib = {};
for (const init of ["spectral", "random"]) {
  const rows = []; for (let s = 1; s <= seeds; s++) rows.push(measures(L.umapRun(X, { graph: G, init, seed: s }).Y));
  lib[init] = { mean: avg(rows), n: seeds };
}
{ const rows = []; for (let s = 1; s <= 10; s++) rows.push(measures(L.tsneRun(X, { seed: s }).Y)); lib.tsneRandom = { mean: avg(rows), n: 10 }; }
lib.tsnePca = { mean: measures(L.tsneRun(X, { init: "pca" }).Y), n: 1 };
const u = L.umapRun(X, { graph: G });
ref.library = lib;
ref.fingerprint = L.fingerprint(u.Y);
ref.note = "umap-learn " + ref.version + " on the normalized cells: find_ab_params(1, 0.1); fuzzy_simplicial_set(precomputed Euclidean, 15) sigma/rho of points 0-4, nnz and row 0; component_layout of the spectral start; runs: mean [recall@10, @15, @100, @200, centroid Spearman] over seeds 0..n-1 per init. library: the same measures for essay-07.js (UMAP seeds 1..n, t-SNE random seeds 1..10, t-SNE PCA start). fingerprint: default UMAP layout (spectral, seed 1).";
const path07 = path.join(root, "docs/bioinformatics/shared/data/essay-07.json");
const all = JSON.parse(readFileSync(path07, "utf8"));
all.umap = ref;
writeFileSync(path07, JSON.stringify(all) + "\n");
console.log("wrote umap block", JSON.stringify({ a: ref.a, b: ref.b, runs: ref.runs, library: lib, fingerprint: ref.fingerprint }));
