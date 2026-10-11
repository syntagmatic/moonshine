// Runs the foam libraries' runChecks() in node, then the mesh-refinement study behind
// the relaxed wall costs quoted in docs/foam/04-the-counterexample.html.
// Usage: node scripts/foam-test.mjs [--convergence]   (exit code 1 on any failure)
import { createRequire } from "node:module";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lib = path.join(root, "docs/foam/lib");
const Cells = require(path.join(lib, "cells.js"));

let total = 0, failed = 0;
for (const file of readdirSync(lib).filter((f) => f.endsWith(".js")).sort()) {
  let api;
  try { api = require(path.join(lib, file)); } catch (e) { console.log(`-- ${file}: not loadable in node (${String(e.message).split("\n")[0]})`); continue; }
  if (!api || typeof api.runChecks !== "function") { console.log(`-- ${file}: no runChecks`); continue; }
  console.log(`== ${file}`);
  let results;
  try { results = api.runChecks(file === "evolver.js" ? Cells : undefined); }
  catch (e) { results = [{ name: "runChecks threw", ok: false, detail: String(e) }]; }
  for (const r of results) {
    total++; if (!r.ok) failed++;
    console.log(`${r.ok ? "PASS" : "FAIL"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  }
}
console.log(`\n${total - failed} / ${total} passed`);

if (process.argv.includes("--convergence")) {
  // Each refinement halves the triangle size; the error in area falls about fourfold,
  // so three successive levels give a Richardson estimate of the fine-mesh limit.
  const Evolver = require(path.join(lib, "evolver.js"));
  const study = (name, welded, levels, published) => {
    const s = levels.map((r) => { const m = Evolver.build(welded, r); m.step(1500); return m.s(); });
    const n = s.length, d1 = s[n - 3] - s[n - 2], d2 = s[n - 2] - s[n - 1];
    console.log(`${name}: levels ${levels.join(",")} -> ${s.map((v) => v.toFixed(6)).join(" ")}; error ratio ${(d1 / d2).toFixed(2)}; extrapolated ${(s[n - 1] - d2 / (d1 / d2 - 1)).toFixed(5)}; published ${published}`);
  };
  console.log("\n== mesh refinement");
  study("Kelvin", Cells.weld(Cells.foam(Cells.sites.bcc())), [1, 2, 3, 4], 5.30628);
  study("Weaire-Phelan", Cells.weld(Cells.equalVolumeA15().foam), [0, 1, 2, 3], 5.28834);
}
process.exit(failed ? 1 : 0);
