// Writes docs/bioinformatics/shared/data/essay-05.json for essay 05 (Differential Expression):
//   1. limma's own answer on the page's simulated counts: for a few (seed, reps) runs, the
//      log2(count + 0.5) matrix goes to R, where lmFit + eBayes(trend = TRUE) give df.prior,
//      s2.prior and p-values; BioEssay05.runChecks compares its JavaScript port against them.
//   2. The many-seed summaries the essay's prose quotes (computed in JS; runChecks recomputes).
// Needs R with limma. If limma is not in the default library, set R_LIBS to a library that
// has it (e.g. `Rscript -e 'BiocManager::install("limma", lib = "<dir>")'`).
// Usage: R_LIBS=temp/bio-audit/f05/rlib node scripts/bio-05-limma-ref.mjs, then node scripts/bio-05-gsea-ref.mjs
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const E = require(path.join(root, "docs/bioinformatics/shared/essay-05.js"));
const work = path.join(root, "temp/bio-audit/f05/limma-ref");
mkdirSync(work, { recursive: true });

const RUNS = [{ seed: 35, reps: 2 }, { seed: 35, reps: 3 }, { seed: 35, reps: 8 }, { seed: 11, reps: 3 }, { seed: 2, reps: 3 }];
// Genes compared: the ten p53 targets, the 30 smallest p-values in limma, and 60 spread evenly.
const rScript = `
suppressMessages(library(limma))
args <- commandArgs(trailingOnly = TRUE)
y <- as.matrix(read.csv(args[1], header = FALSE))
n <- ncol(y) / 2
design <- cbind(1, rep(c(0, 1), each = n))
lf <- lmFit(y, design)
fit <- eBayes(lf, trend = TRUE)
# ordinary pooled two-sample t from the same fit, without moderation
tord <- lf$coefficients[, 2] / lf$stdev.unscaled[, 2] / lf$sigma
pord <- 2 * pt(-abs(tord), df = lf$df.residual)
q <- p.adjust(fit$p.value[, 2], "BH")
cat(sprintf("%.17g", fit$df.prior), "\\n", sep = "", file = args[2])
write.table(cbind(fit$s2.prior, fit$p.value[, 2], q, fit$Amean, pord), args[3], sep = ",", row.names = FALSE, col.names = FALSE)
cat(as.character(packageVersion("limma")), "\\n", file = args[4])
`;
writeFileSync(path.join(work, "ref.R"), rScript);

const runs = [];
let limmaVersion = "";
for (const cfg of RUNS) {
  const sim = E.simulate({ seed: cfg.seed, reps: cfg.reps, keepCounts: true });
  const rows = sim.counts.wt.map((wt, g) => wt.concat(sim.counts.ko[g]).map(v => Math.log2(v + 0.5)).map(v => v.toPrecision(17)).join(","));
  const tag = `s${cfg.seed}r${cfg.reps}`, csv = path.join(work, tag + ".csv");
  writeFileSync(csv, rows.join("\n") + "\n");
  const f = k => path.join(work, tag + k);
  execFileSync("Rscript", [path.join(work, "ref.R"), csv, f(".d0"), f(".out"), f(".ver")], { stdio: "inherit" });
  const d0raw = readFileSync(f(".d0"), "utf8").trim(), d0 = d0raw === "Inf" ? "Inf" : Number(d0raw);   // JSON has no Infinity
  const out = readFileSync(f(".out"), "utf8").trim().split("\n").map(l => l.split(",").map(Number));
  limmaVersion = readFileSync(f(".ver"), "utf8").trim();
  const byP = out.map((r, i) => i).sort((a, b) => out[a][1] - out[b][1]);
  const idx = new Set(E.P53_TARGETS.map(t => t.slot));
  byP.slice(0, 30).forEach(i => idx.add(i));
  for (let k = 0; k < 60; k++) idx.add(Math.floor(k * E.N_GENES / 60) + 7);
  const list = [...idx].sort((a, b) => a - b);
  // Also confirm Amean agrees, so the trend covariate is the same.
  const res = E.analyze(sim), pt = E.plainT(sim);
  const worstA = Math.max(...out.map((r, i) => Math.abs(r[3] - res.genes[i].A)));
  const worstP = Math.max(...out.map((r, i) => Math.abs(Math.log10(r[1]) - Math.log10(res.genes[i].p))));
  console.log(`${tag}: limma d0 ${d0 === "Inf" ? d0 : d0.toFixed(4)} (JS ${res.d0.toFixed(4)}); worst |log10 p| diff over all 2,000 genes ${worstP.toExponential(1)}; worst A diff ${worstA.toExponential(1)}`);
  runs.push({ seed: cfg.seed, reps: cfg.reps, d0, nSig005: out.filter(r => r[2] <= 0.05).length,
    idx: list, s2prior: list.map(i => out[i][0]), p: list.map(i => out[i][1]),
    pOrdinary: list.map(i => isFinite(out[i][4]) ? out[i][4] : null) });
  const testable = out.map((r, i) => i).filter(i => isFinite(out[i][4]) && sim.genes[i].s2 > 0);
  console.log(`   ordinary t: worst |log10 p| diff ${Math.max(...testable.map(i => Math.abs(Math.log10(out[i][4]) - Math.log10(pt.p[i])))).toExponential(1)} over ${testable.length} genes with variance`);
}

// Many-seed summaries quoted in the prose (seeds 1-200 at the page's thresholds q 0.05, fc 1).
const summaries = [];
for (const reps of [2, 3, 5, 8]) {
  const seeds = []; for (let s = 1; s <= 200; s++) seeds.push(s);
  const sm = E.seedSummary(reps, seeds, 0.05, 1, reps === 5 ? 0 : 1000);   // GSEA of the p53 set, 1,000 permutations
  delete sm.rows;
  summaries.push(Object.assign({ seedFrom: 1 }, sm));
  console.log(`reps ${reps}: d0 ${sm.d0Median.toFixed(1)}, q-only FDP mean ${(100 * sm.qFDPMean).toFixed(2)}% (${sm.qFDPAbove}/200 above 5%, ${sm.qFDPZero} at 0, max ${(100 * sm.qFDPMax).toFixed(1)}%), power ${(100 * sm.qPowerMean).toFixed(1)}%, q-only ${sm.qNMean.toFixed(1)} vs both ${sm.bothNMean.toFixed(1)}, fc-only FDP ${(100 * sm.fcFDPMean).toFixed(1)}%, plain t ${sm.plainNMean.toFixed(1)} (${sm.plainTPMean.toFixed(1)} true, ${sm.plainZero} zero), null P(p<.05) ${sm.null05.toFixed(4)} P(p<.001) ${sm.null001.toFixed(5)}, pi0 ${sm.pi0Mean.toFixed(3)} vs ${sm.truePi0Mean.toFixed(3)}, max -log10 q median ${sm.maxNlqMedian.toFixed(1)}, CDKN1A called ${sm.cdkn1aCalled}/200, p53 set members called ${sm.setCalledMean.toFixed(2)} (none in ${sm.setCalledZero})` +
    (sm.gsea ? `, GSEA max p ${sm.gsea.pMax.toFixed(4)}, median NES ${sm.gsea.nesMedian.toFixed(2)}, uncalled members: max p ${sm.gsea.restMaxP.toFixed(4)}, p <= 0.01 in ${sm.gsea.restBelow01}/200, mean k ${sm.gsea.restKMean.toFixed(1)}` : ""));
}

const outFile = path.join(root, "docs/bioinformatics/shared/data/essay-05.json");
let prev = {}; try { prev = JSON.parse(readFileSync(outFile, "utf8")); } catch (e) { /* first run */ }
const out = {
  about: "Essay 05 reference values. limma: output of limma " + limmaVersion + " eBayes(lmFit(y, ~group), trend = TRUE) on the simulated log2(count + 0.5) matrices of BioEssay05.simulate; summaries: many-seed results at q 0.05, |log2 FC| >= 1 computed by BioEssay05.seedSummary. Written by scripts/bio-05-limma-ref.mjs.",
  limma: { version: limmaVersion, runs },
  summaries
};
// Keep the gseapy reference written by scripts/bio-05-gsea-ref.mjs (rerun that script after this one).
if (prev.gsea) out.gsea = prev.gsea;
writeFileSync(outFile, JSON.stringify(out) + "\n");
console.log("wrote docs/bioinformatics/shared/data/essay-05.json");
