# Enrichment ledger: article 04, The Counterexample (2026-10-13)

Page: `docs/foam/04-the-counterexample.html`. New helper: `docs/foam/lib/04-measure.js`
(28 checks in `node scripts/foam-test.mjs`). Precompute: `scripts/foam-04-refine.mjs`.
Rows below are new or changed claims, and existing claims found wrong. Rows in
`LEDGER.md` "Claims: article 04" that are not listed here were rechecked and stand
(counts, pentagon side lengths, 125/1024 and 129/1024, 0.2% wall shift, flat and relaxed
angles, flatness of squares and hexagons, 16-step costs 5.30644 and 5.28850).

Primary source opened this session: Kusner and Sullivan, "Comparing the Weaire-Phelan
equal-volume foam to Kelvin's foam", Forma 11 (1996) 233-242, author's PDF via the
Wayback Machine copy of torus.math.uiuc.edu/jms/Papers/foams/forma.pdf (the link on
Brakke's Kelvin page; the live host is down). Read as extracted text, so formulas were
garbled; each one used here was rebuilt and matched against the number printed beside it.
Their cost is mu = A^3 / V^2 with A half the mean cell area ("A is really half the
boundary area of a typical cell"); this series uses <s> = cell area / V^(2/3), so
<s> = 2 mu^(1/3).

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Published values 5.30628 and 5.28834 are Kusner and Sullivan's Evolver results | sourced (was second-hand) | K-S p. 5: "Experiments with the evolver show partitions in the Kelvin pattern with cost just under 18.67582"; p. 7: "Experiments with the evolver give better partitions in this pattern, with cost just under 18.4871". 2 x 18.67582^(1/3) = 5.306277, 2 x 18.4871^(1/3) = 5.288343 | Replaces the Boulder handout row in LEDGER.md. `KS.kelvin`, `KS.wp` in the helper |
| Fig 3 caption said the published values come "from far finer meshes" | unsupported, cut | K-S do not state their mesh | Caption now says "the dashed lines are the published values" |
| "Repeating the run on finer meshes and extrapolating gives 5.30628 and 5.28835" | wrong in the last digit, replaced by Fig 5 | The 5.28835 came from a level-3 Weaire-Phelan run stopped at 1,500 steps (5.288373), not yet converged (12,000 steps: 5.288369). With levels 2, 3, 4 the estimate is 5.28834 | Sentence removed; Fig 5 shows the study |
| Kusner and Sullivan "proved that the Weaire-Phelan foam beats every foam whose cells are arranged like Kelvin's" | imprecise, reworded | K-S define the Kelvin pattern as "any partition which has this same combinatorics and symmetry", bound it below by a slicing argument (each slice a Y, "at least as much length as the Steiner tree on these points"), and compare with the unrelaxed weighted Voronoi partition: "even this unrelaxed, polyhedral partition in the A15 pattern has less cost than any Kelvin partition" | Page now says arrangement and symmetry, describes the slicing, and says the flat foam is what the proof uses |
| No foam in the Kelvin pattern costs less than 5.2973 | sourced, converted | K-S p. 5: cost "bounded below by mu > (27/16)(sqrt(3/2) + 1)^3 > 18.5816". The formula is my reading of garbled text; it evaluates to 18.58166, matching the printed 18.5816 (the other reading, sqrt(3)/2, gives 10.96). 2 x 18.58166^(1/3) = 5.29734 | `KS.floor`; dashed line in Fig 7 |
| Flat equal-volume foam costs 5.29695 by an exact formula | sourced and computed | K-S p. 7: A = 3 + 3 sqrt 6 + (6 sqrt 5 - 4 sqrt 6 - 3) / 16^(1/3), V = 8, "just under 18.57752". <s> = 2A / V^(2/3) = A / 2 = 5.2969504. `equalVolumeA15().foam.s` = 5.2969504 agrees to 1e-15 | So the page's flat foam is exactly K-S's polyhedral partition |
| It beats the floor by 0.0004 | derived | 5.29734 - 5.29695 = 0.00039 | 1/46 of the gap between the relaxed foams |
| Flat cost as a function of the dodecahedron's share v (grey line, Fig 7) | sourced and computed | K-S: 8A = 24 + 24 sqrt 6 + (12 sqrt 5 - 8 sqrt 6 - 6) c^2, dodecahedron volume 4 c^3 in a cube of 64, so c^3 = 16 v and <s> = 8A / 16. Matches `cells.js` at v = 125/1024 and 1/8 to 1e-12 (`flatCost`) | |
| Nearest-point walls cost 5.2950; equalizing raises it to 5.2970 | computed | `foam(sites.a15()).s` = 5.295025; closed form with c = 5/4 gives the same. Fig 2 readout now shows the cost at every slider setting (it showed it only at equal volumes) | |
| A cube costs 6 and a sphere 4.836 | derived | 6; (36 pi)^(1/3) = 4.83598 | Scale sentence in the intro |
| Eight points per cube: corners shared by eight cubes, faces by two | derived | 8/8 + 1 + 12/2 = 8 | Added because the recipe as written places 21 points |
| Fig 5 live meshes: Kelvin 288, 1,152, 4,608 triangles give 5.30874, 5.30690, 5.30643; Weaire-Phelan 276, 1,104, 4,416 give 5.29043, 5.28884, 5.28846 | computed in the page | `Foam04.LIVE`: Kelvin levels 1-3 at 60, 100, 300 steps; W-P levels 0-2 at 300, 300, 600 steps. About 1.4 s in headless Chromium, chunked, only while the figure is on screen | The third of each is Fig 3's mesh, run longer than Fig 3's 16 steps |
| Fig 5 hollow dots: Kelvin 18,432 and 73,728 triangles give 5.306314 and 5.306286; W-P 17,664 and 70,656 give 5.288369 and 5.288349 | computed, precomputed | `node scripts/foam-04-refine.mjs` (about five minutes): 6,000, 12,000, 12,000, 12,000 steps. Output pasted into `Foam04.FINE`. The relaxer still creeps in the seventh digit at these counts (under 1e-6 per doubling of steps) | Caption says precomputed and names the script |
| Error falls about fourfold per halving of the triangles | computed | Successive differences: Kelvin 1841, 470, 115, 28 (x 1e-6), ratios 3.92, 4.07, 4.08. W-P 1589, 391, 82, 20, ratios 4.06, 4.75, 4.03 | "about" because of the 4.75 |
| Limits fitted to the three live meshes: 5.30628 and 5.28832 | computed in the page | least squares <s> = limit + a h^2 (`fitLimit`): 5.306280 and 5.288325 | Within 0.00002 of published, as the prose says |
| Limits from the three finest meshes: 5.30628 and 5.28834 | computed in the page | Richardson on live level 3 (or 2) with the two precomputed: 5.306277 and 5.288343 | Agree with K-S to all six digits |
| "Run a finer mesh here" gives 5.30632 and 5.28837 against 5.30631 and 5.28837 ahead of time | computed in the page | 200 steps of the 18,432-triangle Kelvin mesh and 300 of the 17,664-triangle W-P mesh, about 2.5 s | A short run stops a few 1e-6 high |
| Fig 3's mesh is off by about 0.00015, a hundredth of the gap | computed | 16-step values 5.30644 and 5.28850 less 5.30628 and 5.28834: 0.00016 each; gap 0.0179 | |
| A foam's cost is the average of its cells' costs | derived | equal volumes V: mean over cells of area / V^(2/3) = (mean area) / V^(2/3). Checked: mean of the eight cell costs equals `mesh.s()` to 1e-12 | |
| Fig 6, flat: Kelvin's cell 5.3147, dodecahedron 5.3243, fourteen-faced cell 5.2878, average 5.2970 | computed in the page | `Foam04.cellCost` on each cell's triangles, averaged over the 2 and the 6 | The flat dodecahedron is dearer than Kelvin's flat cell and than a regular dodecahedron (5.3116) |
| Fig 6, relaxed (16 steps): 5.3064, 5.2574, 5.2989, 5.2885 | computed in the page | same, on Fig 3's meshes as they stand. Converged level-2 values: 5.2570 and 5.2990 | Follows Fig 3 live, including "flat again" |
| Flat, the whole advantage sits in the fourteen-faced cells; relaxed, two thirds comes from the dodecahedra | computed in the page | gap = (2/8)(sK - s12) + (6/8)(sK - s14). Flat: -0.04% and +0.38% of 0.33%. Relaxed: 0.23% and 0.11% of 0.34% | Readout of Fig 6 |
| The dodecahedra are at higher pressure; their walls bulge outward on balance | sourced and computed | K-S Fig 4 caption: "a dodecahedron with slightly higher pressure than the neighboring cells". Sign of the measured pressure difference below; a film curves toward the low-pressure side (Laplace) | "on balance": mean curvature, not every point |
| Fig 7 relaxed line: 5.28652, 5.28749, 5.28847, 5.28946, 5.29044 at dodecahedron shares 12.21, 12.35, 12.50, 12.65, 12.80% | computed in the page | walls slider t = 0, 0.5, 1, 1.5, 2; level 2 (4,416 triangles), 60 steps each, about 0.5 s | |
| Smaller dodecahedra make a cheaper foam, flat or relaxed | computed | both lines rise across the whole slider range; the flat one by the closed form above | Only within the range shown; no claim about where the minimum is |
| Pressure in the dodecahedra exceeds their neighbors' by 0.33 film tensions per cube edge | computed two ways | (a) Slope: one repeat in a unit cube has area equal to <s>; gas dv into each of 2 dodecahedra from 6 neighbors changes area by 2 (p12 - p14) dv, so p12 - p14 = (d<s>/dv) / 2 = 0.665 / 2 = 0.3325. Stable across levels 1-2 and 16 to 3,000 steps (0.6645 to 0.6653). (b) Force balance: least-squares multipliers in grad(area) = sum p_k grad(V_k) on the relaxed mesh (`pressures`): 0.3324 at levels 1, 2, 3; the six fourteen-faced cells agree to 5e-5; Kelvin's two cells differ by 1e-8 | No published value found to set beside it. With V the cell volume it is 0.166 film tensions / V^(1/3). It drifts from 0.335 to 0.330 across the slider |
| About 5 percent of the pressure in a free bubble of the same volume | derived | free bubble: 2 sigma / R with R = (3V / 4 pi)^(1/3) = 0.6204 V^(1/3), so 3.224 sigma / V^(1/3). 0.166 / 3.224 = 5.2% | sigma is the tension of the whole film (both faces) |
| In a real Weaire-Phelan foam the dodecahedra would slowly shrink | derived | gas diffuses through films from high pressure to low (Part 7's premise) and every wall of a dodecahedron faces a lower-pressure cell | Not simulated here. First-order rate if 07 wants it: dV/dt = -k (p12 - p14) x (dodecahedron area 1.314) = -0.437 k sigma L, k the film permeability, L the cube edge |
| Kelvin's foam has one cell shape and one pressure | derived and computed | all cells congruent by lattice translation; `pressures` gives 1e-8 | |
| Gabbrielli: "six layers of about 1,500 equal bubbles" | ambiguous, reworded | Nature news blog, 28 Nov 2011 (reopened): "the 6 layers of about 1,500 bubbles were ordered into the WP structure". The paper's abstract, seen only as a search snippet, says "foam samples consisted of approximately 1500 bubbles" | second-hand for the abstract. Page now says "about 1,500 equal bubbles, six layers deep" |
| Carfrae quote | sourced, rechecked | Plus magazine, "Swimming in mathematics" (reopened): "In spite of its complete regularity, when it is viewed at an arbitrary angle it appears totally random and organic" | unchanged |
| SVG text in Figs 3 and 4 rendered at 10.5 px on desktop and 9.7 px at 390 px wide | wrong, fixed | measured in headless Chromium; the charts had fixed 680 and 340 viewBoxes scaled down to the figure | Charts now use the figure's own width, so 11 px stays 11 px |
| Fig 8 (was 5) readout "shapes with 6 to 6 sides" for a face-on cut at depth 0 | wrong, fixed | driven headlessly | prints "6 sides" |
| Intro sentence "This page builds it from eight points, relaxes it ... and then cuts a slice" | cut | talks about the page | replaced by the cube-and-sphere scale |
| LEDGER.md: "largest vertex displacement after 16 steps: Kelvin 0.015" | note | I measure 0.0116 (Kelvin) and 0.0121 (W-P) | The page's "under 2 percent" holds either way |

## Tried and dropped

- A scale axis from the cube (6) to the sphere (4.836). Article 03's zoomed axis and
  article 06's score chart already carry candidates on an axis; here one sentence in the
  intro does it. I would not add a second axis in 03 either.
- Area by face type. Computed: relaxing grows Kelvin's squares 8.8% and shrinks its
  hexagons 2.8%; in Weaire-Phelan the hexagons shrink 8.3%, the dodecahedron's pentagons
  1.3%, and the other pentagons grow 5.8%. True but it does not compare the two foams;
  the per-cell split (Fig 6) does.
- A map of mean curvature on the relaxed cells. Constant on the dodecahedron's walls and
  zero on the rest, so nothing to look at.
- Kusner and Sullivan's floor as a line in Fig 3's chart. The flat foam clears it by 2 px
  on that axis; Fig 7's axis shows the margin.
- Cost against triangle size squared with a straight line. The two finest meshes land
  1 and 5 px from the axis and overprint. Equal steps per quadrupling with the fitted
  h-squared curve shows the same rule and keeps the points apart.
- Linking Fig 7's slider to Fig 2's. Different ranges, five figures apart; Fig 7 has its own.
- Relaxing the fine meshes fully in the page. The 17,664-triangle Weaire-Phelan mesh needs
  12,000 steps (46 s in node); the button runs 300.

## Words

Visible words in the article (prose, headings, captions, control labels): 1,228 before,
1,728 after. Prose and headings 869 to 1,165; captions 329 to 527. Figures 5 to 8.
