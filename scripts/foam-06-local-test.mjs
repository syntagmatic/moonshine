// A longer run of the local test drawn in Figure 7 of docs/foam/06-the-lattice-recipe.html.
// For each lattice: deform it by many seeded random shape changes x -> x (I + eps S)
// (S symmetric, trace zero, unit norm) and count how many lower the wall cost of its
// Voronoi cell. Then a descent: start from each lattice knocked 5 percent out of shape
// and walk downhill in wall cost, to see where it settles.
// Usage: node scripts/foam-06-local-test.mjs [--quick]
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const L = require(path.join(root, "docs/foam/lib/06-lattice.js"));
const quick = process.argv.includes("--quick");

const lattices = {
  "face-centered cubic": L.bases.fcc(),
  "body-centered cubic": L.bases.bcc(),
  "A4": L.squareBasis(L.bases.a4()),
  "A4* (Kelvin's relative)": L.squareBasis(L.bases.a4dual()),
  "D4": L.bases.d4(),
};

console.log("== random shape changes (seed 6)");
for (const [name, basis] of Object.entries(lattices)) {
  const n = basis.length, base = L.voronoi(basis), rand = L.rng(6);
  const N = (n === 4 ? 2000 : 20000) / (quick ? 10 : 1);
  for (const eps of [0.005, 0.02, 0.05]) {
    let lower = 0, bad = 0, lo = Infinity, hi = -Infinity;
    for (let i = 0; i < N; i++) {
      const c = L.voronoi(L.deform(basis, L.strain(n, rand), eps));
      if (!c.ok) bad++;
      const d = c.cost - base.cost;
      if (d < 0) lower++;
      lo = Math.min(lo, d / (eps * eps)); hi = Math.max(hi, d / (eps * eps));
    }
    console.log(`${name}: eps ${eps}: ${lower} of ${N} lower the cost; change / eps^2 from ${lo.toFixed(3)} to ${hi.toFixed(3)}${bad ? `; ${bad} cells failed volume = det` : ""}`);
  }
}

// Downhill walk in the space of shapes: try a step along each of a fresh set of random
// directions, keep any that lowers the cost, halve the step when none does.
function descend(basis, seed, maxEvals) {
  const n = basis.length, rand = L.rng(seed);
  let B = basis, cost = L.voronoi(B).cost, step = 0.02, evals = 0;
  while (step > 1e-6 && evals < maxEvals) {
    let moved = false;
    for (let t = 0; t < 4 * n * n && evals < maxEvals; t++) {
      const S = L.strain(n, rand);
      for (const sgn of [1, -1]) {
        const T = L.deform(B, S, sgn * step), c = L.voronoi(T); evals++;
        if (c.ok && c.cost < cost - 1e-13) { B = T; cost = c.cost; moved = true; break; }
      }
    }
    if (!moved) step /= 2;
  }
  return { cost, evals, cell: L.voronoi(B) };
}
console.log("\n== downhill from each lattice knocked 5 percent out of shape");
for (const [name, basis] of Object.entries(lattices)) {
  const n = basis.length, base = L.voronoi(basis);
  for (let s = 1; s <= (quick ? 1 : 3); s++) {
    const start = L.deform(basis, L.strain(n, L.rng(100 + s)), 0.05), c0 = L.voronoi(start).cost;
    const r = descend(start, 200 + s, quick ? 1500 : 6000);
    console.log(`${name} (${base.cost.toFixed(5)}), start ${s} at ${c0.toFixed(5)}: settles at ${r.cost.toFixed(5)} after ${r.evals} cells; density ${(100 * r.cell.density).toFixed(2)}%, ${r.cell.planes.length} walls`);
  }
}
