# Enrichment ledger: 01 The Honeycomb (2026-10-13)

Four new figures (1 four pins, 4 mixing side counts, 5 scrambled honeycombs with real
films, 6 every cell against two floors), the old froth figure rebuilt on a box that wraps
around (now Figure 2), tilings and pentagons renumbered 3 and 7. New helper
`docs/foam/lib/01-honeycomb.js` (11 checks in `node scripts/foam-test.mjs`), new script
`scripts/foam-01-survey.mjs` (writes the 96-foam table embedded in the helper).

Sources opened this session: Hales, "The honeycomb conjecture", arXiv math/9906042 (abstract
page for dates and journal reference; full text read through ar5iv.labs.arxiv.org/html/math/9906042,
saved as text in the scratch directory). Nothing else was fetched. "Computed" means by the
helper at runtime or by the named script; the browser numbers below were read back in headless
Chromium at 1200 px and 390 px, light and dark, motion on and reduced. The dark passes were run
over http (a saved dark theme does not apply to a page opened as file://).

Words: paragraph prose 868 before, 922 after; captions 175 before, 509 after (seven figures
instead of three); everything visible 1,078 before, 1,510 after.

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Intro: around 36 BC Varro was reporting what geometers said about the honeycomb | sourced | Hales, section 1: "Around 36 B.C., Marcus Terentius Varro, in his book on agriculture, wrote about the hexagonal form of the bee's honeycomb", with Varro's "The geometricians prove that this hexagon inscribed in a circular figure encloses the greatest amount of space" | replaces "the Greek geometer Pappus wrote about it around the year 340"; the date 340 had no ledger row and Hales gives none for Pappus |
| "For sixteen centuries that was a guess" | cut | depended on the unsourced date for Pappus | |
| Plateau was blind and mapped films "by having assistants describe them to him" | cut | no ledger row, not checked this session | the sentence now only names him as a nineteenth-century physicist (existing claim, not re-sourced) |
| Margin note: hexagonal grid is also the densest circle packing; packing and foam part ways in 3D | cut | covered by article 06 | cut for length, not because it is wrong |
| Fig 1: X through a unit square has length 2.828; two forks joined by a bridge reach 2.732 with the forks at 120 degrees; 3.4 percent less | derived + computed | Pins at (±1/2, ±1/2), junctions at (±b/2, 0): L(b) = b + 2 sqrt((1 - b)^2 + 1). L(0) = 2 sqrt 2 = 2.8284. dL/db = 0 at 1 - b = 1/sqrt 3, b = 0.4226, L = 1 + sqrt 3 = 2.7321; arms make atan(sqrt 3) = 60 degrees with the bridge axis, so 120 between each pair. 1 - 2.7321/2.8284 = 3.41%. `pinsMin()` finds the same by golden-section search (runChecks 2) | readout at the minimum: bridge 0.42, film 2.732, forks 120.0 |
| Fig 1: the X is a peak between two equal valleys, so a four-way crossing splits into two forks | derived | L(b) = L(-b) by the square's symmetry; slope at 0+ is 1 - 2/sqrt 2 = -0.414, so L falls on both sides of the X | the peak is a corner, not a smooth maximum |
| "three equal tugs balance only when spread evenly, 360/3 = 120" | derived | three unit vectors summing to zero form an equilateral triangle | existing claim, kept |
| Fig 2 (old Fig 1): "the cells already average six sides, as Euler's formula requires" while the readout showed 5.81 | wrong, fixed | The old figure counted only cells not touching the frame: 42 of 64 at the start with mean 5.81, 37 with mean 5.95 after relaxing (N = 24: 5.25; N = 110: 5.90). Euler gives six only for a closed surface | the froth now lives on a box that wraps around (nine copies of the sites, middle copy read off), so all 64 cells count and the readout shows 6.00 at every step; 128 junctions = 2 x 64 |
| Fig 2: "shrinks the walls and evens out the cells until the froth is a honeycomb, give or take the ragged boundary" | wrong, fixed | Lloyd relaxation stalls with defects. Old figure: 8 fives and 6 sevens among 37 interior cells at the stop, wall cost 1.895; 1.879 after 3,000 more full steps | paragraph cut; caption now says it stalls |
| Fig 2: "the forks open toward 120" had no measurement | fixed | readout now gives the rms deviation of all 384 junction angles from 120 | |
| Fig 2 default: starts with 48 of 64 cells not six-sided, forks 30.9 degrees rms off 120, wall cost 2.124; "Relax" stops at 16 cells not six-sided (all five- or seven-sided), forks 8.2 off, cost 1.881 | computed | page, seed 20260924, stop rule unchanged (mean site move under 0.05 px at step 0.22); same numbers with reduced motion | caption says "16 cells" and "8 degrees" |
| Fig 2: "New froth" used Math.random | fixed | it now continues the seeded stream, so every froth is reproducible | second froth: 43 not six-sided, 31.0 degrees, 2.109 |
| Fig 2: under reduced motion the figure opened already relaxed | fixed | it now opens in the same random state in both modes; "Relax" jumps to the stop state | |
| Fig 3: triangle 2.280, square 2.000, hexagon 1.861 | computed | were typed constants; now `polyCost(n)` = sqrt(n tan(pi/n)) at runtime: 2.2795, 2, 1.8612 = 12^(1/4) (runChecks 1) | values unchanged |
| The regular polygon has the least perimeter for its area and number of sides | derived (standard) | polygon isoperimetric theorem; Hales notes "A version for polygons was known to Zenodorus" (section 6.2, citing Heath) | not proved on the page |
| The regular heptagon costs 1.836, less than the hexagon | computed | sqrt(7 tan(pi/7)) = 1.83603 | |
| "Euler's formula caps the average at six" | derived | On a torus V - E + F = 0; every vertex has degree at least 3, so 2E >= 3V, E <= 3F, mean sides 2E/F <= 6, with equality when three walls meet everywhere. Fewer than six only raises the floor because the polygon cost falls with the number of sides | Hales uses the same step on a torus (his equation 3.3) |
| "the floor rises faster on that side than it falls on the other" (polygon cost is convex in the number of sides) | computed | second difference of sqrt(x tan(pi/x)) is positive on a grid from 2.5 to 60 (runChecks 3); 5: 1.9060, 6: 1.8612, 7: 1.8360, 8: 1.8204 | |
| Fig 4: any mix of twelve cells averaging six sides has a floor above twelve hexagons | computed | runChecks 3 enumerates all 3,798 mixes of 12 cells with 3 to 12 sides averaging six; the cheapest that is not all hexagons is one 5 and one 7, 0.00163 above | |
| Fig 4 default: six pentagons and six heptagons, floor 1.871 against 1.861 | computed | (1.90597 + 1.83603)/2 = 1.87100, +0.53%. Other trades at full: six 4s and six 8s 1.9102 (+2.63%); four 4s and eight 7s 1.8907 (+1.58%) | |
| Fig 4: the dashed line is the one Hales's proof uses; the heptagon clears it by 0.00007 | sourced + computed | Hales Theorem 4: L(P) >= -T(P) 12^(1/4) - (N(P) - 6) 0.0505 + 2 alpha(P) 12^(1/4). For a unit-area polygon T = 0, alpha = 1, so half the perimeter is at least 12^(1/4) - 0.02525 (N - 6). Regular heptagon 1.836034 against 1.835960: clear by 0.0000747, the closest of all N from 3 to 200 (runChecks 4). Hales's Remark 2: for a polygon of area 1 "the inequality in this case is essentially the one used by Phelan and Weaire" | the line is drawn with half Hales's slope because this page counts half the perimeter |
| Fejes Tóth proved the honeycomb conjecture for convex cells in 1943 | sourced | Hales, section 1: "in 1943, L. Fejes Tóth proved the honeycomb conjecture under the hypothesis that the cells are convex [FT43]" | |
| The few-line argument for straight walls (regular polygon floor, convexity, Euler) | derived; attribution from memory | each step is derived or computed above. That this is how Fejes Tóth's 1943 paper argues is from memory; the paper (Mat. Term.-tud. Értesítő 62) was not opened, and the page does not say the argument is his | Hales says only that [FT43] "transports the planar cluster to a sphere" |
| Fejes Tóth wrote in 1964 that a proof without convexity would "involve considerable difficulties" | sourced (quoted by Hales) | Hales, section 1, citing Regular Figures (1964), p. 183 | second-hand for the quotation: Regular Figures was not opened |
| A film between bubbles at different pressures is an arc of a circle; a cell with outward-bulging walls beats any polygon | sourced + computed | Hales, section 2: the minimizing boundary "consists of finitely many arcs of circles (possibly reducing to straight lines) meeting at vertices of degree 3" (citing Morgan). Symmetric five-sided bubble with 120 degree corners costs 1.8627 against the regular pentagon's 1.9060 (runChecks 5) | |
| Hales found a proof in 1999, published 2001 as "The Honeycomb Conjecture"; all equal-area partitions, walls of any shape, periodic or not | sourced | arXiv math/9906042 submitted 8 June 1999; Discrete Comput. Geom. 25:1-22 (2001). Theorem 1-A: for any locally finite graph of smooth curves whose bounded complementary regions all have unit area, limsup of perimeter over area is at least 12^(1/4) | existing claim, wording tightened; the journal name dropped from the prose for length |
| Fig 5 model: films with fixed tension, pressures that hold every bubble at the same area, nothing about hexagons or 120 degrees | computed | `07-coarsen.js` with gas diffusion off (`step(false)`) and every bubble's gas set to 1. Worst area error in the checked runs 5e-6 (runChecks 7, 9); no bubble removed in any of the 96 runs | the model's 120 degree corners and arcs are outcomes, tested in 07's own checks |
| One swapped wall in a honeycomb heals | computed | runChecks 6: two 5s and two 7s relax back to 64 hexagons at 1.861210. True for a new film of length 0.1 to 0.6 and for boxes of 8, 12, 16, 24 cells a side, 4 to 16 segments per film (scratch exp3, exp4) | not in the prose; it is why "walls swapped" starts having an effect only in bulk |
| With 8 walls swapped the honeycomb healed completely in all 7 runs; with more, cells get stuck with the wrong number of sides | computed | `scripts/foam-01-survey.mjs`: 8 swapped 7 of 7; 16 swapped 3 of 7; 24 swapped 2 of 7; 32 swapped 2 of 7; 48, 64, 96, 128 swapped 0 of 7 | 14 of 56 healed in all |
| Each stuck cell adds about 0.085 percent to the cost | computed | least-squares line through the honeycomb point over the 82 foams that kept a defect: 0.00157 per cell that is not a hexagon, 0.085% of 1.8612 | a fit over this survey, 64 cells, one box; not a law |
| Foams relaxed from a random start cost 2.1 to 4.6 percent more than the honeycomb | computed | survey, 40 seeds: 1.9010 to 1.9469, mean 1.9152 (+2.90%); 25 to 43 cells not hexagons | at 8 segments per film instead of 4, seeds 1 to 12 average 1.9173 against 1.9151, so the mesh understates by about 0.1% |
| Fig 5 default: 32 walls swapped (48 cells not hexagons, 2.163 before relaxing); "Relax" leaves 8 at wall cost 1.868 | computed | page and survey row [32, 1, 8, 1.86793]; runChecks 7 recomputes it and compares with the embedded row | which defects survive depends on the mesh: at 8 segments per film the same swaps leave 4 cells at 1.8684 |
| Fig 5: 56 scrambled honeycombs and 40 random starts, computed ahead of time; fourteen healed; none below the honeycomb | computed (precomputed) | `scripts/foam-01-survey.mjs --write` regenerates the table in the helper (unchanged on rerun). Cheapest foam that kept a defect 1.86478, 0.19% above. runChecks 11 | precomputed so the dots are identical in every browser; the foam on the left is computed live |
| Stopping rule for "relaxed until it stopped moving" | computed | film length changes by under 1e-7 per bubble over 400 steps. 40 settled foams run 100,000 further steps: no neighbor swap, no change in side counts, largest cost drift 1.1e-6 (scratch exp8) | |
| "Ninety-six foams ... prove nothing"; a relaxing foam finds the nearest valley | derived | the runs are local minima of a 64-cell periodic model | |
| Hales's floor: P/2 >= 12^(1/4) (1 - T/2) - 0.02525 (n - 6) for a cell of unit area | sourced | Theorem 4 with alpha = 1, halved. T is the sum over the cell's walls of the signed area between wall and chord, each term clipped to [-1/2, 1/2] | the page omits the clip: the largest area through one wall in the 40 random-start foams is 0.138 of a cell, so it never acts. Theorem 4 also needs area at least min(2 pi sqrt 3 /(3 N^2), 1), true for unit cells |
| The T terms cancel over the whole foam; the side terms cancel because the average is six | sourced + computed | Hales Lemma 4.1: x(e) + x(e^op) = 0 and the truncation is odd, so the sum of T(P) is 0; Euler on the torus gives sum of (1 - N/6) = 0. In the page: sum of T is 1.5e-17 and -8.3e-17, and mean slack equals cost minus 12^(1/4) to 1e-6 (runChecks 8, 10) | |
| Fig 6 default (random start 1, cost 1.934): 13 of the 18 cells with fewer than six sides are below their regular polygon; every cell is above Hales's floor; the mean margin 0.073 is the foam's excess over the honeycomb | computed | page readout and runChecks 9, 10: least margin 0.0169, mean 0.07296 = 1.93417 - 1.86121 | |
| "most cells with fewer than six sides cost less than the regular polygon" | computed | over the 40 random-start foams, 555 of 703 cells with fewer than six sides are below their polygon; none of the 1,857 cells with six or more is (scratch final.cjs) | |
| Every cell of every surveyed foam satisfies Hales's inequality | computed | least margin over all 96 x 64 cells is 4e-11, on the hexagons of the healed honeycombs, where the theorem has equality | a wrong sign in T would show here; the closest non-hexagon is a seven-sided cell 0.00004 above (runChecks 8) |
| Pentagon corners 108, 12 short of 120; three make 324, leaving 36 | derived | (5 - 2) 180/5 = 108; 360 - 324 = 36 | existing, prose shortened |

## Tried and dropped

- One five-seven pair in a honeycomb, with its cost. A single swap (two pairs side by side)
  does not survive: the films pull it back to a honeycomb at every box size and mesh tried, and
  a lone pair cannot exist on a box that wraps around. The scrambled-honeycomb survey replaced it.
- Symmetric bubbles with 120 degree corners as a second curve in Figure 4. Their costs are
  nearly flat (5 sides 1.8627, 6: 1.8612, 7: 1.8602), and a 5 and a 7 together cost only
  0.015% more than two hexagons, but such bubbles do not fit together into a foam, so the
  curve bounds nothing. Kept as a check (runChecks 5) and left off the page.
- Computing Figure 5's cloud live. It takes about 25 seconds in total and, because which
  defects survive is sensitive to the last bit, might differ between browsers. Precomputed
  instead. Firefox and WebKit could not be launched here (installed builds do not match the
  Playwright version), so the live numbers in Figures 5 and 6 are checked in Chromium only.
- A reader-dragged polygon to show that the regular one has the least perimeter. Dull, and
  the step is standard.
- Hales's line as a plotted bound in Figure 6 against T. Correct but abstract; the two-panel
  margin plot shows the same thing.
- Time evolution and von Neumann's law (article 07), and the lattice family (article 06
  Figure 1), were left alone. The wall-cost convention is the same as 06's.
