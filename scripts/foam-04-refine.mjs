// Fine-mesh runs behind Figure 5 of docs/foam/04-the-counterexample.html.
// The page relaxes the three coarsest meshes of each foam itself; the two finest take
// minutes, so they are run here and pasted into FINE in docs/foam/lib/04-measure.js.
// Usage: node scripts/foam-04-refine.mjs            (about five minutes)
//        node scripts/foam-04-refine.mjs --coarse   (also rerun the page's live meshes)
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const lib = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs/foam/lib");
const Cells = require(path.join(lib, "cells.js"));
const Evolver = require(path.join(lib, "evolver.js"));
const Measure = require(path.join(lib, "04-measure.js"));

const welded = { k: Cells.weld(Cells.foam(Cells.sites.bcc())), w: Cells.weld(Cells.equalVolumeA15().foam) };
// [foam, refinement level, conjugate-gradient steps]. The relaxer creeps in its last
// digits, so the step counts are part of the record: at these counts the cost was still
// falling by under 1e-6 per doubling of the steps.
const runs = [["k", 4, 6000], ["k", 5, 12000], ["w", 3, 12000], ["w", 4, 12000]];
if (process.argv.includes("--coarse")) runs.unshift(...Measure.LIVE.k.map((d) => ["k", d.level, d.steps]), ...Measure.LIVE.w.map((d) => ["w", d.level, d.steps]));

const out = { k: [], w: [] };
for (const [id, level, steps] of runs) {
  const t0 = Date.now(), mesh = Evolver.build(welded[id], level);
  mesh.step(steps);
  const row = { level, triangles: mesh.triangles, steps, s: +mesh.s().toFixed(7) };
  out[id].push(row);
  console.error(`${id} level ${level}: ${row.triangles} triangles, ${steps} steps, s = ${row.s} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
console.log(JSON.stringify(out));
