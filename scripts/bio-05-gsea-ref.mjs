// Adds gseapy's answer to docs/bioinformatics/shared/data/essay-05.json for essay 05's
// gene-set enrichment figure: for a few (seed, reps) experiments, the page's genes ranked by
// the moderated t go to gseapy prerank (weight 1, gene-set permutation), with the p53 set of
// Fischer 2017 Table 1 (all 116 members, and the members not called at q <= 0.05).
// BioEssay05.runChecks compares ES, the running sum, the leading edge, NES and p.
// Needs Python with gseapy in a throwaway venv, never in the repo:
//   uv venv temp/bio-audit/g05/venv && uv pip install --python temp/bio-audit/g05/venv/bin/python gseapy
// Usage: node scripts/bio-05-gsea-ref.mjs   (GSEAPY_PYTHON overrides the interpreter)
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const E = require(path.join(root, "docs/bioinformatics/shared/essay-05.js"));
const work = path.join(root, "temp/bio-audit/g05/gsea-ref");
mkdirSync(work, { recursive: true });
const py = process.env.GSEAPY_PYTHON || path.join(root, "temp/bio-audit/g05/venv/bin/python");
const N_PERM = 1000;

const pyScript = `
import sys, json, pandas as pd, gseapy as gp
rnk = pd.read_csv(sys.argv[1], sep="\\t", header=None, names=["gene", "t"])
sets = json.load(open(sys.argv[2]))
pre = gp.prerank(rnk=rnk, gene_sets=sets, permutation_num=int(sys.argv[4]), weight=1, min_size=5, max_size=1000,
                 seed=7, outdir=None, threads=1, verbose=False)
out = {"version": gp.__version__}
for term, r in pre.results.items():
    lead = r["lead_genes"]
    lead = lead.split(";") if isinstance(lead, str) else list(lead)
    out[term] = {"es": float(r["es"]), "nes": float(r["nes"]), "p": float(r["pval"]), "lead": [g for g in lead if g],
                 "RES": [float(v) for v in r["RES"]]}
json.dump(out, open(sys.argv[3], "w"))
`;
writeFileSync(path.join(work, "ref.py"), pyScript);

const RUNS = [{ seed: 35, reps: 3 }, { seed: 35, reps: 2 }, { seed: 35, reps: 8 }, { seed: 11, reps: 3 }];
const runs = [];
let version = "";
for (const cfg of RUNS) {
  const res = E.run(cfg.seed, cfg.reps), g = res.genes, tag = `s${cfg.seed}r${cfg.reps}`;
  const id = i => "g" + String(i).padStart(4, "0");
  writeFileSync(path.join(work, tag + ".rnk"), g.map(x => id(x.i) + "\t" + x.t.toPrecision(17)).join("\n") + "\n");
  const variants = { all: E.setSlots(g), rest: E.setSlots(g, { dropCalled: true, q: 0.05 }) };
  writeFileSync(path.join(work, tag + ".sets.json"), JSON.stringify({ all: variants.all.map(id), rest: variants.rest.map(id) }));
  execFileSync(py, [path.join(work, "ref.py"), path.join(work, tag + ".rnk"), path.join(work, tag + ".sets.json"), path.join(work, tag + ".out.json"), String(N_PERM)], { stdio: "inherit" });
  const out = JSON.parse(readFileSync(path.join(work, tag + ".out.json"), "utf8"));
  version = out.version;
  for (const set of ["all", "rest"]) {
    if (set === "rest" && variants.rest.length === variants.all.length) continue;   // nothing called: same set
    const r = out[set], js = E.gsea(g, variants[set], { nPerm: 10000 });
    // The running sum at every 25th rank and at the peak.
    const runIdx = []; for (let k = 0; k < E.N_GENES; k += 25) runIdx.push(k); runIdx.push(js.peak);
    runs.push({ seed: cfg.seed, reps: cfg.reps, set, k: variants[set].length, es: r.es, nes: r.nes, p: r.p, nPerm: N_PERM,
      lead: r.lead.map(s => +s.slice(1)).sort((a, b) => a - b), runIdx, runVal: runIdx.map(k => r.RES[k]) });
    console.log(`${tag} ${set} (k ${variants[set].length}): gseapy ES ${r.es.toFixed(6)} NES ${r.nes.toFixed(3)} p ${r.p} lead ${r.lead.length}; JS ES ${js.es.toFixed(6)} NES ${js.nes.toFixed(3)} p ${js.p.toExponential(2)} lead ${js.leading.length}`);
  }
}
const file = path.join(root, "docs/bioinformatics/shared/data/essay-05.json");
const data = JSON.parse(readFileSync(file, "utf8"));
data.gsea = { version, nPerm: N_PERM, runs };
data.about = data.about.replace(/; gsea: .*$/, "") + "; gsea: gseapy " + version + " prerank (weight 1, " + N_PERM + " gene-set permutations) on the moderated t, written by scripts/bio-05-gsea-ref.mjs.";
writeFileSync(file, JSON.stringify(data) + "\n");
console.log("updated " + path.relative(root, file));
