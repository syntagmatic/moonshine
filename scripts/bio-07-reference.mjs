// Builds docs/bioinformatics/shared/data/essay-07.json: reference values that essay-07.js
// checks itself against. The library generates the simulated cells, the default moons and the
// default t-SNE and PCA layouts; numpy, scipy and scikit-learn (scripts/bio-07-reference.py)
// recompute eigenvalues, t-SNE affinities, an exact t-SNE KL, recall@k and Spearman from them.
// Usage: node scripts/bio-07-reference.mjs   (needs python3 with numpy, scipy, scikit-learn;
// set PYTHONPATH if scikit-learn lives elsewhere). Intermediate files go to temp/bio-audit/f07/.
import { createRequire } from "node:module";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const L = require(path.join(root, "docs/bioinformatics/shared/essay-07.js"));
const tmp = path.join(root, "temp/bio-audit/f07");
mkdirSync(tmp, { recursive: true });

const sim = L.simulateCells(), X = L.expression(sim, "norm");
const ts = L.tsneRun(X, {});
const init = (() => { const r = L.mulberry32(1), Y = []; for (let i = 0; i < X.length; i++) Y.push([L.gaussian(r) * 1e-4, L.gaussian(r) * 1e-4]); return Y; })();
const moons = L.moons({ noise: 0.3 }).map((m) => m.x);
const tsm = L.tsneRun(moons, {});
const input = { X, moons, init, Ytsne: ts.Y, Ypca: L.pca(X, 2).Y, ks: [5, 10, 30, 100] };
writeFileSync(path.join(tmp, "ref-in.json"), JSON.stringify(input));
execFileSync("python3", [path.join(root, "scripts/bio-07-reference.py"), path.join(tmp, "ref-in.json"), path.join(tmp, "ref-out.json")], { stdio: "inherit" });
const ref = JSON.parse(readFileSync(path.join(tmp, "ref-out.json"), "utf8"));
ref.fingerprints = { cellsNorm: L.fingerprint(ts.Y), moonsDefault: L.fingerprint(tsm.Y) };
ref.note = "Reference values for essay-07.js runChecks. pcaCells/pcaMoons: numpy.linalg.eigh of the covariance; sklearnP: sklearn.manifold._t_sne._joint_probabilities rows 0-2 at perplexity 30; sklearnKL: sklearn TSNE(method='exact', learning_rate=50, early_exaggeration=12, max_iter=1000) from the same random start; measures: numpy recall@k and scipy spearmanr on the library's own layouts; fingerprints: FNV-1a of the default layouts' float64 bits (node).";
writeFileSync(path.join(root, "docs/bioinformatics/shared/data/essay-07.json"), JSON.stringify(ref) + "\n");
console.log("wrote essay-07.json", ref.fingerprints, "sklearn KL", ref.sklearnKL);
