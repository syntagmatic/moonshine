# Claims — Foam series

One row per article in the status table. The second section lists facts to verify
**before building each article** — this is a math-heavy series and several headline
numbers must be independently confirmed (not taken from this plan) before they go into
prose, per the project's verify-before-implement rule. Scope is capped at 4D; no
E8 / 8D / spherical-cubes claims remain.

## Status

| # | article | slug | owner | started | finished | notes |
|---|---|---|---|---|---|---|
| 01 | The Honeycomb | `01-the-honeycomb` | main | 2026-06-19 | 2026-06-19 | done; render-check PASS; Lloyd froth + tilings + pentagon-gap figs verified visually. φ table re-derived (hex 1.861, sq 2, tri 2.280). |
| 02 | The Double Bubble | `02-the-double-bubble` | main | 2026-06-19 | 2026-06-19 | done; render-check PASS. Interactive cross-section verified: wall flat at equal vols, bows into LARGER bubble (wallMidX +7.7 when right larger). Attributions verified (Hass-Hutchings-Schlafly 1995 equal; HMRR Annals 2002 general). |
| 03 | Kelvin's Bubble | `03-kelvins-bubble` | — | — | — | planned |
| 04 | The Counterexample | `04-the-counterexample` | — | — | — | planned |
| 05 | Why It Recurs | `05-why-it-recurs` | — | — | — | planned |
| 06 | The Lattice Recipe & 24-Cell | `06-the-lattice-recipe` | — | — | — | planned |
| 07 | Foams in Motion | `07-foams-in-motion` | — | — | — | planned |

## Facts to verify before building (do not trust this plan; re-derive or re-source)

### Confirmed during planning (sources in chat / README)
- Weaire–Phelan ⟨s⟩ ≈ 5.288 vs Kelvin ⟨s⟩ ≈ 5.306, ~0.3% improvement. ✓
- Truncated octahedron = 14 faces (8 hex, 6 square), Voronoi cell of BCC. ✓ (standard)

### Article 01 — Honeycomb
- [ ] Perimeter-per-unit-area, shared edges counted once: hexagon ≈ 1.861, square = 2,
  triangle ≈ 2.280. Re-derive arithmetic before publishing the table.
- [ ] Hales Honeycomb Theorem date/venue (1999 announce / 2001 DCG paper) and that it
  covers *all* partitions, not only regular tilings.

### Article 02 — Double Bubble
- [ ] Double Bubble Theorem attribution: equal-volume case Hass & Schlafly (1995,
  computer-assisted); general case Hutchings, Morgan, Ritoré, Ros, *Ann. Math.* 155
  (2002). Confirm both.
- [ ] Geometry: two spherical caps + dividing wall, all three surfaces meeting at 120°
  along a circle; wall flat for equal volumes, bows toward larger otherwise. Confirm.
- [ ] The ruled-out competitor (toroidal bubble) framing — confirm it was a genuine
  candidate before the proof, and that it loses.
- [ ] Isoperimetric: single volume minimizer is the round sphere (Schwarz/standard).

### Article 03 — Kelvin's Bubble
- [ ] Tetrahedral vertex angle = arccos(−1/3) ≈ 109.4712°; confirm it is the Plateau
  four-edge angle and derive it (not just quote).
- [ ] Whether ⟨s⟩ ≈ 5.306 is the *relaxed* Kelvin cell or the flat truncated
  octahedron; state both values and label which is which.
- [ ] Jean Taylor (1976) as the prover of Plateau's laws — confirm attribution.
- [ ] Which faces curve on relaxation (hexagons warp to non-planar; squares) — confirm.

### Article 04 — The Counterexample
- [ ] Cell inventory: 2 dodecahedra (12 pentagons, pyritohedral symmetry) + 6
  tetrakaidecahedra (12 pentagons + 2 hexagons), 8 per repeat, all equal volume.
- [ ] Weaire & Phelan 1993, *Phil. Mag. Lett.* 69, and Surface Evolver / Ken Brakke.
- [ ] Beijing National Aquatics Center (Water Cube) facade derived from a sliced WP
  structure — confirm it is WP specifically and the slice framing.

### Article 05 — Why It Recurs
- [ ] A15 = Cr₃Si = β-tungsten; Weaire–Phelan cells are the (relaxed) Voronoi dual of
  the A15 sphere arrangement — confirm the duality phrasing precisely.
- [ ] Type-I clathrate hydrate cages = 5¹² dodecahedron + 5¹²6² tetrakaidecahedron,
  matching the WP cells. Confirm cage notation and the match.
- [ ] Frank–Kasper coordination numbers Z12, Z14, Z15, Z16 only. Confirm the list.
- [ ] Soft-matter Frank–Kasper (A15, σ) in block copolymers / dendrimers — get a
  concrete citation (Bates group, Science ~2010) before asserting.
- [ ] Tetrahedral frustration: regular-tetrahedron dihedral ≈ 70.53°, does not divide
  360° — re-derive.

### Article 06 — The Lattice Recipe & 24-Cell
- [ ] FCC/A3 densest 3D lattice packing; BCC gives the lower-area lattice foam; BCC's
  Voronoi cell is the truncated octahedron. Confirm the BCC-vs-FCC foam comparison.
- [ ] 24-cell: self-dual regular 4-polytope, Voronoi cell of D4, tiles ℝ⁴ as the
  24-cell honeycomb. D4 densest lattice packing in 4D. Confirm all four.
- [ ] State of the art on the 4D Kelvin problem — is the 24-cell a proven local min or
  just a candidate? Check recent literature (arXiv 2302.07112, 2603.27221) and report
  honestly; do not overclaim "solved in 4D."

### Article 07 — Foams in Motion
- [ ] Von Neumann's law (1952), 2D: dA/dt = κ(n − 6); confirm the exact form, that it
  is size/shape-independent and purely topological, and the constant's makeup
  (diffusion, film permeability, surface tension).
- [ ] Average bubble has 6 sides (Euler-characteristic argument for a 2D cellular net).
- [ ] MacPherson & Srolovitz, *Nature* 446 (2007), 3D generalization via mean width;
  confirm the functional's form before stating it.
- [ ] T1 (neighbor swap) vs T2 (cell disappearance) definitions — confirm standard usage.
- [ ] Laplace pressure ∝ curvature drives gas from small to large bubbles — standard,
  but confirm the 2D form.

## Notes for next pass

(Cross-article observations land here as articles get built.)

- Color tokens are provisional (`--c-area`, `--c-cell`, `--c-d12`, `--c-d14`,
  `--c-lattice`, `--c-angle`); finalize the `:root` block when article 01 is scaffolded
  and copy it across the series.
- 3D rendering locked to hand-rolled canvas (`lib/foam3d.js`). Build that helper while
  scaffolding article 03 (first heavy 3D cell); articles 06 (24-cell) and 05
  (coordination shells) reuse it.

## Claims: leads from FACT-CHECK.md (2026-09-27)

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 02 | A cube holding a unit sphere's volume "has about 23 percent more surface" | wrong, fixed | Derived: side (4π/3)^(1/3) = 1.612, area 6(4π/3)^(2/3) = 15.59, over 4π = 12.57 gives 6/(36π)^(1/3) = 1.2407, so 24%. The same calculation gives 1.490 for the regular tetrahedron, so "nearly 50 percent" holds | "about 24 percent more surface"; PROMPT.md quotes 24% |
| 02 | Hass, Hutchings and Schlafly (1995) reduced the equal-volume case to a computer search "that took twenty minutes on a 1995 PC" | fine | UC Davis Mathematics newsletter 1995, "Joel Hass solves the 2000-year old Double Bubble Problem": "reduced the double-bubble problem to 200,260 calculations, which the computer could run in about 20 minutes". Hass's own page adds the later code "takes about 10 seconds to run on a fast 1999 PC". The ERA-AMS announcement (Hass, Hutchings, Schlafly 1995) lists the three authors | none |
| PROMPT | plans/foam/PROMPT.md described seven articles; three exist | fixed | series as published: 01 honeycomb, 02 double bubble, 03 Kelvin's bubble | PROMPT rewritten to describe the three articles and the index strip, with the traps that apply to them |
| 02 | Double bubble "proved in 2002" | wrong, fixed | Hutchings, Morgan, Ritoré, Ros, "Proof of the double bubble conjecture," Electron. Res. Announc. AMS 6 (2000) 45-49; full paper Ann. Math. 155 (2002) 459-489 | Subtitle, intro, body, margin note and index card now say 2000; body notes the 2002 Annals publication; PROMPT updated |
| 01 | Fig 1: relaxing, junctions "converge on three-way forks" and cells "settle to a mean of six sides" | wrong, fixed | A generic Voronoi diagram already has only degree-3 vertices, and Euler's formula then fixes the mean side count at six from the first frame; Lloyd relaxation changes the angles (toward 120°) and narrows the side-count spread | Caption says the start is already three-way with mean six, and relaxation opens the forks toward 120° and bunches side counts; readout hint "→ 6" became "(Euler: 6)"; PROMPT updated |
| 03 | "In 1887 Lord Kelvin" | wrong, fixed | William Thomson was created Baron Kelvin in 1892; the 1887 Phil. Mag. paper "On the division of space with minimum partitional area" is signed Sir William Thomson | Subtitle and intro say "William Thomson, later Lord Kelvin" |
| 01 | "Pappus assumed no such thing existed" | overstated, fixed | Pappus, Collection Book V preface: he compares only the triangle, square and hexagon, the three regular figures that fill the plane; he does not address irregular partitions | "Pappus never considered one; he compared only the three regular shapes" |
