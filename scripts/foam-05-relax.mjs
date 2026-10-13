// Mesh-refinement study behind the relaxed C15 wall costs quoted in
// docs/foam/05-why-it-recurs.html (Figure 5). The page relaxes C15 on a coarse mesh
// (one 1-to-4 split of every triangle); this script repeats the run on finer meshes
// and extrapolates, the same way scripts/foam-test.mjs --convergence does for the
// Kelvin and Weaire-Phelan foams of part 4.
// Usage: node scripts/foam-05-relax.mjs          (about a minute)
// The numbers it prints are embedded in the page as FINE = { ... }.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const lib = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs/foam/lib");
const Cells = require(path.join(lib, "cells.js"));
const Evolver = require(path.join(lib, "evolver.js"));
const Frustration = require(path.join(lib, "05-frustration.js"));

// Each refinement halves the triangle size and the error in area falls about fourfold,
// so the last three levels give a Richardson estimate of the fine-mesh limit.
function study(name, foam, levels) {
  const welded = Cells.weld(foam);
  const s = levels.map((r) => {
    const m = Evolver.build(welded, r), t0 = Date.now();
    let prev = Infinity, cur = m.step(50), steps = 50;
    while (prev - cur > 2e-8 && steps < 600) { prev = cur; cur = m.step(50); steps += 50; }
    console.log(`  ${name}, level ${r}: ${m.triangles} triangles, ${steps} steps, ${((Date.now() - t0) / 1000).toFixed(1)} s, s = ${cur.toFixed(6)}`);
    return { triangles: m.triangles, s: cur };
  });
  const n = s.length, d1 = s[n - 3].s - s[n - 2].s, d2 = s[n - 2].s - s[n - 1].s, ratio = d1 / d2;
  const limit = s[n - 1].s - d2 / (ratio - 1);
  console.log(`${name}: flat ${foam.s.toFixed(5)}; levels ${levels.join(",")} -> ` +
    `${s.map((v) => v.s.toFixed(6)).join(" ")}; error ratio ${ratio.toFixed(2)}; extrapolated ${limit.toFixed(5)}`);
  return limit;
}

const c15 = Frustration.sites.c15(), mg = [0, 1, 2, 3, 4, 5, 6, 7];
const out = {
  c15Equal: study("C15, equal volumes", Frustration.equalVolume(c15, mg).foam, [0, 1, 2, 3]),
  c15Voronoi: study("C15, nearest-point volumes (16-faced cells 23% larger)", Cells.foam(c15), [0, 1, 2, 3]),
  a15Equal: study("A15, equal volumes (Weaire-Phelan)", Cells.equalVolumeA15().foam, [0, 1, 2, 3]),
  a15Voronoi: study("A15, nearest-point volumes (14-faced cells 3.2% larger)", Cells.foam(Cells.sites.a15()), [0, 1, 2, 3]),
  kelvin: study("Kelvin", Cells.foam(Cells.sites.bcc()), [1, 2, 3, 4]),
};
console.log("\nFINE = " + JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, +v.toFixed(5)]))));
