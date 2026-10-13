# Foam 06, The Lattice Recipe: enrichment ledger (2026-10-13)

Page `docs/foam/06-the-lattice-recipe.html`, helper `docs/foam/lib/06-lattice.js` (93 checks in
`runChecks()`, all passing; `node scripts/foam-test.mjs` reports 320 of 320), long run
`scripts/foam-06-local-test.mjs`. Three figures added (5, 6, 7); Figures 1 to 4 kept. Words:
prose 1,126 to 1,377, captions 410 to 581 (three new captions are 227 of those), total 1,536 to
1,958. Sources were opened on 2026-10-13. Dark-mode checks were run over http
(`python3 -m http.server -d docs`), since a saved theme does not apply to a `file://` page.

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Covering score: balls blown up to the cell's farthest corner cover space; score = ball volume per cell volume | derived | The farthest point of a Voronoi cell from its centre is a corner, so balls of that radius at every lattice point cover; thickness = V_n R^n / det | Fig 5, `moments(cell).thickness` |
| Rounding error (quantizer score): mean squared distance to the nearest lattice point, per coordinate, cell scaled to volume 1 | derived | G = (1/n) int \|x\|^2 dx / V^(1+2/n). `moments()` cuts the cell into simplices (cell centre, wall centre, ..., an edge's two ends) and uses int \|x\|^2 = V (sum \|v_i\|^2 + \|sum v_i\|^2)/((n+1)(n+2)) on each | runChecks: the simplices add up to the cell volume for nine lattices (worst gap 2e-14) |
| Covering values: triangular 1.2092, square 1.5708; FCC 2.0944, BCC 1.4635, cubic 2.7207; D4 2.4674, A4* 1.7655, A4 3.1780, 4D cubic 4.9348 | computed | runChecks against closed forms 2 pi/(3 sqrt 3), pi sqrt(3)/2, 2 pi/3, 5 sqrt(5) pi/24, pi^2/4, pi^2/2 to 1e-12 | Fig 5 prints three decimals |
| Rounding-error values: triangular 0.080188, square and cubes 1/12; FCC 0.078745, BCC 0.078543; D4 0.076603, A4* 0.077559, A4 0.078020 | computed | runChecks against 5/(36 sqrt 3), 19/(192 2^(1/3)), 2^(-11/3), 13/(120 sqrt 2), 1/12 to 1e-12. The closed forms are from memory; the page relies on the computed values and the published table below | Fig 5 prints five decimals |
| Published best coverings 1.2092, 1.4635, 1.7655 (A2*, A3*, A4*) | sourced | Schuermann and Vallentin, "Computational approaches to lattice packing and covering problems", arXiv:math/0403272, Table 1: 1.209199, 1.463505, 1.765529 (read via ar5iv) | The page computes 1.209200, 1.463503, 1.765529; the exact BCC value 5 sqrt(5) pi/24 is 1.4635031, so the table's last digit for A3* differs from it by 2e-6. The readout shows four places, where they agree |
| Published best rounding errors 0.080188, 0.078543, 0.076603 (A2, A3*, D4) | sourced | Agrell and Allen, "On the best lattice quantizers", arXiv:2202.09605 (accepted June 2023), Table I: 0.080187537, 0.078543281, 0.076603235 | Page agrees to all nine digits (runChecks) |
| Rounding error and wall cost rank the lattices the same way in two, three and four dimensions; in 3D only packing picks a different winner (FCC), in 4D only covering does (A4*) | computed | runChecks '3D: BCC is best at covering, second moment and wall cost; FCC only at packing' and '4D: D4 is best at packing, second moment and wall cost; A4* at covering; ...agree on the whole order' | True of the lattices in the figure. Among all lattices the covering winners are proved (Schuermann and Vallentin: A_d* optimal for d up to 5) and the rounding-error winner is proved only up to 3D (Agrell and Allen: "proofs of optimality are known only in dimensions up to three"); neither sentence is on the page, it was cut for length |
| Hexagons: 3 walls 120 degrees apart at every corner | computed | `junctions()`, `plateau()`; runChecks | Fig 6 |
| BCC flat foam: 3 walls round every edge at 109.47, 125.26, 125.26; 4 lines at every corner, two pairs 90 and four pairs 120 degrees apart; fails both rules | computed | runChecks 'BCC: 3 walls round each of 36 edges...', 'BCC: 4 lines at each of 24 corners...' | Agrees with part 3 |
| FCC flat foam: 3 walls exactly 120 degrees apart round every edge; at 8 of 14 corners 4 lines 109.47 apart (passes); at the 6 tips 6 cells and 8 lines toward the corners of a cube, neighbours 70.53 apart (fails) | computed | runChecks 'FCC: ...' (three checks) | Fig 6 |
| D4 flat foam: 3 walls 120 apart round every triangle; 4 cells and 4 triangles 109.47 apart round every edge; at every corner 8 cells and 16 edges toward the corners of a hypercube (from any one: 4 at 60, 6 at 90, 4 at 120, 1 at 180 degrees) | computed | runChecks 'D4: ...' (four checks) | Answers the lead: yes, the dihedral angle is exactly 120 and three cells meet round each triangle |
| A junction of eight lines toward a cube's corners is not one a film can rest in (only three walls at 120 and four lines at 109.47 are) | second-hand | Taylor 1976 as reported in Liang, "Uniqueness of 2-dimensional minimal cones in R^3", arXiv:1808.09695: "Jean Taylor gave a complete classification in 1976": plane, Y, T. Part 3 already cites Taylor 1976 | Taylor's paper not opened |
| Brakke proved in 1991 that the cone over the hypercube's codimension-2 skeleton is area-minimizing in dimensions above three and not in two or three | sourced | Brakke's own papers page (kenbrakke.com/papers/default.htm), entry for "Minimal cones on hypercubes", J. Geom. Anal. 1 (1991) 329-338: in dimensions greater than three the minimal hypersurface separating the faces of a hypercube is the cone; not minimal in two and three. Citation data confirmed at Crossref (10.1007/BF02921309) | Abstract read, paper itself not opened |
| Cesaroni and Novaga 2023: no rearrangement of the flat 24-cell foam inside a small enough ball has less wall | sourced | arXiv:2302.07112, Proposition 4.2 (minimizer in every ball of radius below sqrt 2); proof lists the four local cones (hyperplane, three half-hyperplanes at 120, tetrahedron cone times a line, cone over the 2-skeleton of a hypercube) and cites Taylor 1976 and Brakke 1991 | Reread today. Their problem (1) is over all lattices and all fundamental domains, so "best lattice foam" on the page is their wording's sense |
| Of the seven lattices above the plane in Figure 4, only D4 passes at every junction | computed | runChecks 'A4* and the 4D cubic lattice fail where walls meet (so of SC, FCC, BCC, Z4, A4, A4*, D4 only D4 passes everywhere)'; A4 passes on walls and fails at 30 of its 70 edges (6 cells, 8 lines) | For codimension 4 `plateau()` accepts only the simplex and hypercube cones; no lattice here is rejected on that level alone |
| Bezdek's 2006 conjecture; September 2026 preprints by Cesaroni and Novaga (arXiv:2609.02384) and Hales and Song (arXiv:2609.00997) | sourced | Both arXiv abstract pages reread today; v2 of each (9 and 11 Sep 2026); no journal reference on either | Unchanged from LEDGER.md; moved to the last section |
| March 2026 preprint: BCC a strict local minimiser of wall cost among lattices, FCC a saddle | sourced | arXiv:2603.27221, Cesaroni and Novaga, Theorems 3.1 and 3.3 (read at arxiv.org/html/2603.27221v1); no journal reference | New on the page (was in LEDGER.md as background only) |
| Nothing comparable is proved for lattices in four dimensions | from memory | A search today found only Cesaroni and Novaga's local result and their "24-cell conjecture" for foams with fixed inradius (arXiv:2407.07534) | An absence claim; a human should confirm |
| Figure 7 at its default (20 seeded directions each, 8 cells per curve at 1.25 to 5 percent): curves that dip below zero: FCC 4, BCC 0, A4 16, Kelvin's relative 0, D4 0; D4's curves nearly coincide | computed | In the page; seeds 31, 32, 41, 42, 43. At the 200-curve limit: 57, 0, 148, 0, 0 | A curve "dips" if any of its eight sampled points is below the undeformed cost |
| "No way down from BCC, Kelvin's relative or D4 in thousands of directions" | computed (script, not in page) | `node scripts/foam-06-local-test.mjs`: at 0.5, 2 and 5 percent, BCC 0 of 20,000 each, A4* 0 of 2,000 each, D4 0 of 2,000 each; FCC about 3,300 of 20,000, A4 about 1,060 of 2,000. Change over eps^2 ranges 0.78 to 1.58 (BCC), 0.67 to 1.67 (A4*), 1.23 to 1.40 (D4) | Evidence, as the page says. The narrow D4 range is why its curves coincide |
| Left to slide downhill, FCC ends at BCC and A4 at D4; A4* and D4 return to themselves | computed (script, not in page) | Same script: three starts each, 5 percent out of shape; FCC settles at 5.31474 with density 68.02%; A4 at 6.72717; A4* at 6.83112; D4 at 6.72717 | Random-direction descent, 2,400 to 5,600 cells per run, too slow for the page in 4D |
| Four dimensions has at least two bowls, at 6.727 and 6.831 | computed | The two rows above, plus Fig 7 | |
| FIXED: `voronoi()` returned a wrong volume and NaN cost for cells a hair from a special lattice (an edge about a millionth long) | bug | Corners were matched to walls by a 1e-6 tolerance and merged on a 1e-6 grid, so the two ends of a very short edge were each put on the other's walls. About 1 cell in 3,000 of slightly deformed FCC and A4; one of Figure 7's first 100 curves hit it. Now a corner lies on exactly the planes that produced it and two solutions merge only when equal to nine digits. Outputs for 55 reference lattices are identical to before; 80,000 deformed FCC cells and 2,400 A4 cells now all pass volume = det | Figures 1 to 4 never reached such a cell |
| CHANGED: `solve()` works in a reused buffer | speed | Same arithmetic in the same order; 200,000 random systems give bit-identical answers. A 4D cell takes 5 ms instead of 14 | Needed for Figure 7 |
| FIXED: Figure 4's plane panel labelled its axis "share filled by balls" | caption | Now "share covered by discs" | |
| Figure 2's "dips twice" read as if FCC were a local optimum for foams | reworded | Last section says it is a dip along one family only and a saddle among lattices | |
| CUT from prose: the 24-cell is its own dual; "24 corners, 96 edges, 96 triangles"; "a four-dimensional cube costs 8"; the name "rhombic dodecahedron" | cut | Still true and still in LEDGER.md; Figures 3 and 4 print the counts and the 8 | Space for the new sections |
| "Whether any packing at all does better [than D4] is open" | unchanged | Cohn, arXiv:1611.01685. arXiv:2609.25120 (Bhattacharjee et al., 20 Sep 2026) claims a proof; unreviewed, not mentioned on the page | For a human to decide |

## Tried and dropped

- Two-parameter landscape (heat map over a tetragonal or orthorhombic family). Figure 7 tests
  every direction at once and reaches four dimensions; a 3D heat map would repeat Figure 2's
  message with one more axis.
- Change in packing density beside change in wall cost for each deformation. All 400 random
  deformations of BCC lower its density, yet BCC is not a local best packer: along the
  tetragonal stretch toward FCC the nearest-neighbour distance d^2 = 1/(2c) + c^2/4 has its
  minimum at c = 1. Random sampling misses that thin set of directions, so the picture would
  have misled.
- Showing the tip junction losing to a competitor. Opening a small square of half-side t in the
  cube cone (flat pieces, cube of half-side 1) gives area 4t^2 + 8(1+t) sqrt(1+(1-t)^2) +
  4 sqrt 2 (1-t): 16.97056 at t = 0, 16.97022 at 0.05, 16.97036 at 0.1, a gain of 0.002
  percent. Too small to draw honestly, and the four-dimensional side would rest on Brakke's
  theorem anyway.
- A live downhill run. 2,400 to 5,600 cells per run; fine in 3D, 20 seconds in 4D. Kept as a
  script and one sentence.
- Replacing Figure 4 with the four-contest chart. Kept both: the scatter is the two-contest
  claim itself.

## For the shared files

- `plans/foam/PROMPT.md`, article 6: add the three figures (four scores ranked per dimension;
  junction test of the flat foams with the hypercube corner; random deformations showing FCC
  and A4 as saddles and BCC, A4* and D4 as bowls).
- `LEDGER.md`: the count "54 checks" for `06-lattice.js` is now 93.
