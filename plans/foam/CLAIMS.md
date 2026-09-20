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
