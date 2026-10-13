// The survey behind Figure 5 of docs/foam/01-the-honeycomb.html: 96 foams of 64 equal-area
// bubbles on one periodic box, each relaxed with the film model of docs/foam/lib/07-coarsen.js
// (gas frozen, one unit per bubble) until its film length stops changing.
//   56 start as the 8 x 8 honeycomb with 8 to 128 walls swapped at random (seeds 1 to 7 each);
//   40 start as random Voronoi froths (seeds 1 to 40).
// Usage: node scripts/foam-01-survey.mjs            print the rows and a summary (about 30 s)
//        node scripts/foam-01-survey.mjs --write    also rewrite the SURVEY block in lib/01-honeycomb.js
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const lib = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs/foam/lib");
const F = require(path.join(lib, "07-coarsen.js"));
const H = require(path.join(lib, "01-honeycomb.js"));

const rows = [], notes = [];
function run(k, seed) {
  const f = k ? H.scrambled(F, k, seed) : H.equalAreaRandom(F, seed);
  const before = H.census(f), settled = H.settle(f), c = H.census(f);
  if (!settled || c.cells !== H.CELLS || f.t2 !== 0 || c.maxAreaError > 1e-4) notes.push(`k ${k} seed ${seed}: settled ${settled}, cells ${c.cells}, vanished ${f.t2}, area error ${c.maxAreaError.toExponential(1)}`);
  rows.push([k, seed, c.nonHex, +c.cost.toFixed(5)]);
  console.log(`${k ? k + " swapped" : "random start"}, seed ${seed}: not hexagons ${before.nonHex} -> ${c.nonHex}, cost ${c.cost.toFixed(5)} (+${(100 * (c.cost / H.HEX - 1)).toFixed(2)}%), ${f.steps} steps`);
}
const KS = [8, 16, 24, 32, 48, 64, 96, 128];
for (const k of KS) for (let s = 1; s <= 7; s++) run(k, s);
for (let s = 1; s <= 40; s++) run(0, s);

const stat = (list) => { const v = list.map((r) => r[3]).sort((a, b) => a - b), m = v.reduce((s, x) => s + x, 0) / v.length; return `n ${v.length}, cost ${v[0].toFixed(4)} to ${v[v.length - 1].toFixed(4)}, mean ${m.toFixed(4)} (+${(100 * (m / H.HEX - 1)).toFixed(2)}%), median ${v[v.length >> 1].toFixed(4)}`; };
console.log("\nhoneycomb", H.HEX.toFixed(5));
for (const k of KS) { const l = rows.filter((r) => r[0] === k); console.log(`${k} swapped: healed completely ${l.filter((r) => r[2] === 0).length} of ${l.length}; not hexagons ${l.map((r) => r[2]).join(" ")}; ${stat(l)}`); }
console.log("random starts:", stat(rows.filter((r) => r[0] === 0)), "; not hexagons", Math.min(...rows.filter((r) => r[0] === 0).map((r) => r[2])), "to", Math.max(...rows.filter((r) => r[0] === 0).map((r) => r[2])));
const def = rows.filter((r) => r[2] > 0);
// least squares through the honeycomb point: cost - HEX = slope * (cells that are not hexagons)
const slope = def.reduce((s, r) => s + r[2] * (r[3] - H.HEX), 0) / def.reduce((s, r) => s + r[2] * r[2], 0);
console.log(`foams that kept a defect: ${def.length}; cheapest ${Math.min(...def.map((r) => r[3])).toFixed(5)}; line through the honeycomb: ${slope.toFixed(5)} per cell that is not a hexagon (${(100 * slope / H.HEX).toFixed(3)}%)`);
console.log(`below the honeycomb: ${rows.filter((r) => r[3] < H.HEX - 1e-6).length}`);
console.log(notes.length ? "PROBLEMS\n" + notes.join("\n") : "every foam settled with 64 bubbles of equal area and no bubble removed");

if (process.argv.includes("--write")) {
  const file = path.join(lib, "01-honeycomb.js"), src = readFileSync(file, "utf8");
  const block = "/* SURVEY-BEGIN */\n  var SURVEY = [\n" + rows.map((r) => "    " + JSON.stringify(r)).join(",\n") + "\n  ];\n  /* SURVEY-END */";
  const out = src.replace(/\/\* SURVEY-BEGIN \*\/[\s\S]*?\/\* SURVEY-END \*\//, block);
  if (out === src) console.log("SURVEY block unchanged"); else { writeFileSync(file, out); console.log("SURVEY block rewritten in", file); }
}
