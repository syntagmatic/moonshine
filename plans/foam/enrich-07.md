# Enrichment ledger: article 07, Foams in Motion (2026-10-13)

Audit of the page as built on 2026-10-10, then three new computed figures (4, 5 and 7; the old
Figure 4 is now Figure 6). Rows below are new or changed claims; everything else in
`LEDGER.md`, section "Claims: article 07", was rechecked against the page and still holds
(Figure 3 at load 15,387 measurements, slope 1.000, zero 6.000, rms 0.014; 96 T1 and 70 T2 from
100 to 30 bubbles, ending at time 9.06; film fell in all 149 sampled intervals to 30%; the
3,000-bubble run reproduces 0.73, 0.99, 0.99, 1.06 and every other number in its rows).

How the numbers were read. Page numbers: headless Chromium through `window.__foam` (the run,
`__foam.defect.state()`, `__foam.law3d.cache`) and the readouts, at 1280 px and 390 px, light
and dark (dark over `http://`, since `motion.js` cannot rewrite stylesheets on `file://`), and
with reduced motion. Library numbers: `node scripts/foam-test.mjs`, which now runs
`docs/foam/lib/07-coarsen.js` (15 checks; three new, for the honeycomb experiments) and the new
`docs/foam/lib/07-law3d.js` (7 checks). Time is in the units of Figure 3 (the law reads n - 6),
areas in starting mean bubble areas (hexagon areas in Figure 5), three-dimensional rates in
units of 2 pi M gamma times the cube root of the mean cell volume. The one source opened this
session is Lazar, Mason, MacPherson and Srolovitz, "A More Accurate Three-Dimensional Grain
Growth Algorithm" (preprint, https://u.math.biu.ac.il/~lazarem/paper3D.pdf, text extracted from
the PDF and read). MacPherson and Srolovitz's Nature paper itself was not opened (the page
redirects to a login), as on 2026-10-10.

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Figure 6 readout compared the film with "a honeycomb of 103 equal cells" while Figure 1 showed 100 bubbles (31 against 30 at the end) | fixed | The time series was only sampled every 0.02 mean areas of time, so its last point lagged the picture. A sample is now taken at the hand-off to Figure 1 and at the stop. | Readout at load is now +0.77 per unit time, 53%, 94.4% of a honeycomb of 100 (was +0.76, 54%, 93.6% of 103); at the end +1.00, 30%, 97.8% of 30 (was 96.7% of 31). |
| "the foam runs several percent lower" than a honeycomb of as many equal cells | changed to "a few percent" | computed: film / honeycomb film is 0.944 at load, between 0.928 and 0.978 from 100 to 30 bubbles, 0.978 at the stop | The old ledger row's range (0.928 to 0.967) missed the last sample. |
| Figure 1: "The heavily outlined bubble is followed in Figure 4; click another to follow it instead" | computed | Point-in-polygon test on the bubble outlines, with the box's wrap-around; driven headless (a click at 31%, 42% of the canvas selects bubble 127). Figure 4's Previous and Next buttons do the same from the keyboard. | |
| Figure 4: every bubble's area against time; the followed bubble's line "bends only where the lower trace steps" | computed | The page records (time, area, sides) for each bubble at every sample and on both sides of every change of its side count (25,932 points over the run, 270 of the 300 bubbles vanish). Areas are polygon areas of the mesh. | New figure. Chart type: 300 polylines plus a step trace; no other figure on the page plots single bubbles. |
| Figure 4 at load follows a bubble that "began with seven sides and grew, lost one at time 1.3 and held its area, and has been five-sided and shrinking since 2.3" | computed | Bubble 114 of seed 1952, chosen by rule (of the 100 on show, the one that has been above six sides and is now below, with the largest peak area). Measured slopes of its stretches: 7 sides +1.00 (time 0 to 0.66) and +0.99 (0.66 to 1.31), 6 sides 0.00 (1.31 to 2.22), 5 sides -1.02 at load. It is briefly 8-sided at 0.66 and 7-sided at 2.22 (swaps undone at once). | Same bubble after Reset and in all four configurations. |
| The same bubble later | computed | 5 sides -1.01 (2.30 to 3.29 and 3.29 to 5.54), 4 sides -1.92 (5.54 to 5.84), vanishes at 5.84. | Not in the caption; it is what the figure shows as Figure 1 runs. The 4% shortfall at four sides is the scatter Figure 3's caption describes for bubbles about to vanish. |
| "Give one bubble twice the gas of the others and it stays six-sided, so nothing moves: size is not in the law" (Figure 5, second choice) | computed | `FoamCoarsen.defect(20, 16, {kind: 'inflate'})`, relaxed 600 steps with the gas frozen, then run to time 5.5: marked bubble area 1.9938 against 0.9969 for every other, six sides, largest change of any area 8e-15, no T1 or T2 in 7,657 steps. All pressures are equal (largest 9e-14), so the films are straight, and the total film length equals the honeycomb's (595.587). Same script. runChecks: "inflated bubble". | Derived too: the law has no size in it. |
| Figure 5, first choice: "The merged bubble starts at area 2 with eight sides and a five-sided bubble at each end" | derived + computed | Removing a film takes 6 off the total side count: the merged bubble has 6 + 6 - 4 = 8, each end bubble 6 - 1 = 5. `Foam.prototype.burst`; side counts {5: 2, 6: 316, 8: 1}, 319 bubbles, V = 2F, E = 3F (runChecks "burst film", on a 12 x 10 honeycomb). | The film removal is not one of the coarsening rules and nothing in `step()` or `topology()` calls it; the prose calls it "the one event on this page that is not diffusion". |
| "By time 5.5 ... it has 28 sides and 60 times the area of a hexagon, 50 bubbles have vanished, and 246 of the 269 left are still six-sided" | computed | Page, 10,867 steps: 28 sides, area 59.57, 269 bubbles, 246 six-sided, 70 T1, 50 T2. The 22 others are all five-sided and all touch the marked bubble (`node scripts/foam-07-defect-run.cjs`, which prints every Figure 5 number in this table). | Same in all configurations. |
| "shortly before it is as large as this box allows" | computed | The library's box limit (a bubble spanning a third of the box) trips at time 5.89, with 32 sides and area 69.6. The page stops at 5.5. | |
| Figure 5 readout: "gaining 22.03 per unit time over its latest stretch at 28 sides (law: 28 - 6 = 22)" | computed | Slope of the marked bubble's area over each stretch of fixed side count: 8 sides 2.00, 10: 4.01, 14: 7.99, 16: 9.98, 20: 14.0, 22: 16.0, 26: 20.0, 28: 22.0. Area at 5.5 is 59.57; the law integrated over its side counts gives 59.23. | First version of the readout measured over a 0.04 window and read 18.78 just after an event; it now uses the whole stretch. |
| "As the merged bubble grows its perimeter lengthens and touches more neighbors, so its growth speeds up" | computed | At 5.5 its perimeter is 28.9 hexagon-root-areas, 1.03 per side; sides are 3.6 times the square root of its area. Area by time: 2.0, 4.1, 8.6, 17.3, 30.3, 48.5 at times 0, 1, 2, 3, 4, 5. | A 32 x 26 honeycomb (`--wide`) gives the same history to 5.5 (59.5) and reaches 50 sides and area 180 at time 9, about 2.2 t squared, with every stretch's slope within 0.1 of its side count minus six. |
| "The honeycomb around it does not become disordered first. It stays a honeycomb until it is eaten." | computed | Every non-six bubble at 5.5 is a neighbor of the marked bubble (above); 246 six-sided of 269. | Says what this simulation does. Published single-defect studies were not opened, so none is cited. |
| The 3D law as stated: dV/dt = -2 pi M gamma (L - (1/6) sum e_i), for walls moving in proportion to mean curvature | sourced | Lazar, Mason, MacPherson, Srolovitz, eq. (1): "dV(D)/dt = -2 pi M gamma (L(D) - (1/6) M(D))", "L(D) is a one-dimensional measure of the grain size called the mean width, and M(D) is the sum of the lengths of all triple edges (along which three grains meet) of the grain"; their ref. [9] is "R. D. MacPherson, D. J. Srolovitz, The von Neumann relation generalized to coarsening of three-dimensional microstructures, Nature 446 (7139) (2007) 1053-1055". | Opened this session. Two of the four authors are the law's authors; the Nature paper was not read. Agrees with the 2026-10-10 row (Le and Du). |
| "for a cell made of flat facets, [the mean width is] the sum over every edge between facets of its length times the angle the surface turns through there, divided by 2 pi" | sourced | Same paper, eq. (3): "L(D) = (1 / 2 pi) sum_i e_i alpha_i", "where i is indexed over all edge segments (both regular and triple) of grain D", alpha_i "the exterior angle at that edge segment". | `FoamLaw3D.meanWidth`; runChecks: unit cube 3 exactly, unit ball 3.983 and 3.996 on 512 and 2,048 triangles (limit 4). |
| "For a soap foam in equilibrium the same expression gives the gas a cell loses, with the films' permeability in place of M" | derived | Each wall has constant mean curvature (pressure difference over tension), and a triple line at 120 degrees turns by pi/3, so 2 pi (L - E/6) is the integral of (k1 + k2) over the walls = sum over walls of pressure difference x area / tension. Gas crossing a wall at permeability x area x pressure difference then gives dV/dt = -2 pi D gamma (L - E/6). | Checked numerically in the next row but two. |
| Figure 7 at ratio 1, Kelvin: "mean width equals a sixth of its edge length and both cells sit at zero" | derived + computed | Flat cell: 36 edges of equal length, 12 with exterior angle 70.53 and 24 with 54.74 degrees; 12 x 70.53 + 24 x 54.74 = 36 x 60, so L = E/6 exactly (2.6727). Relaxed on 1,152 triangles: L = E/6 = 2.680, difference -7e-9. By symmetry: all cells congruent, and the excesses of the cells around any foam sum to zero. | runChecks "Kelvin cell". |
| Figure 7 at ratio 1, Weaire-Phelan: "The dodecahedron's mean width is the larger by 0.139, so it shrinks, and each fourteen-faced cell grows a third as fast" | computed | Page (1,104 triangles, 80 relaxation steps): dodecahedron L 2.663, E/6 2.524, rate -0.139; fourteen-faced cell L 2.676, E/6 2.723, rate +0.046. L - E/6 for the dodecahedron on 276, 1,104, 4,416 triangles: 0.13975, 0.13922, 0.13905, extrapolating to 0.1390. 2 x (-0.1391) + 6 x 0.0464 = 5e-6. The flat equal-volume cells of Part 4, before relaxing, give +0.1339 and -0.0446 for L - E/6. | runChecks "Weaire-Phelan at equal volumes". Converged to four digits within 50 relaxation steps. |
| "its dodecahedra are at higher pressure and empty into their neighbors" | computed, two ways | (p12 - p14) V^(1/3) / tension = 0.1662. From the mean width: 2 pi (L - E/6) / (wall area of the dodecahedron, 5.257 V^(2/3)) = 0.1663 on 1,104 triangles, 0.1662 on 4,416. Independently, from half the change of total wall area per unit volume moved into each dodecahedron (relaxed at volume ratios 0.98 and 1.02): 0.1664 and 0.1662. The second route uses no angles. | runChecks "pressure difference". Tension here is that of a wall (both faces of the film). No published value was opened to set beside it. |
| Figure 7 agrees with Part 4 (commit 1755d97), which reports the same foam's pressure difference and first-order rate | computed, cross-checked | Part 4: p12 - p14 = 0.332 sigma / L with L the edge of the 8-cell cube, and dV/dt = -0.437 k sigma L per dodecahedron. Here V^(1/3) = L/2, so 0.1662 sigma / V^(1/3) = 0.332 sigma / L, and -2 pi x 0.1391 x V^(1/3) = -0.874 V^(1/3) = -0.437 L, in units of permeability x tension. | Same units (tension of the whole film). The two pages reach the numbers by different code: Part 4 from the slope of wall cost and a force balance on the mesh, this page from mean width and edge length. |
| "From half the volume of a fourteen-faced cell to nearly twice, the dodecahedron shrinks" | computed | Rates at volume ratios 0.5, 0.75, 1, 1.3, 1.8: -0.117, -0.130, -0.139, -0.148, -0.158 (fourteen-faced: +0.039 to +0.053). Both cells keep their faces (12 pentagons; 12 pentagons and 2 hexagons) across 0.5 to 1.8; by ratio 2.8 the weighted cells have changed faces, so the slider stops at 1.8. | The rate grows with the cell because every term in the law is a length. I expected a larger dodecahedron to be at lower pressure and grow; it is at lower pressure difference but has more wall, and the sign does not change in this range. |
| "Kelvin's foam rests while its cells are exactly equal: make one of its two sets larger and that set grows at the other's expense, though both have fourteen faces" | computed | Body-centered cubic sites with a weight on one of the two, relaxed on 1,152 triangles: rate of cell A at volume ratios 0.5, 0.8, 1, 1.2, 1.3, 1.8: -0.138, -0.045, 0.000, +0.037, +0.053, +0.117; cell B the opposite. Both keep 6 squares and 8 hexagons from ratio 0.4 to 2.5. | runChecks "Kelvin with two cell sizes". Only this one way of making the cells unequal was tried. |
| "In space no number of faces plays the part of six" | computed | The row above: two cells with the same 14 faces, one growing and one shrinking; and Kelvin's 14-faced cell at rest beside Weaire-Phelan's 14-faced cell growing. | Was "derived" (the formula depends on lengths, not counts); now shown. |
| Von Neumann's 1952 discussion "takes up pages 108 to 110 of the volume Metal Interfaces" | cut | Still sourced (reference lists, 2026-10-10, and ref. 7 of the paper opened today); removed for length. | |
| "In Parts 1 to 4 least film was a property of a finished pattern. Here it is a direction of travel"; "The law gives a bubble's rate, not its fate"; "In the plane each corner cancels a sixth of a full turn. In space each unit of edge length cancels a sixth of a unit of mean width ..."; "Figure 1 halts at 30 bubbles only because its box is small"; "A growing seven-sided bubble can lose two neighbors this way and start to shrink" | cut | Slogans, or said by a figure now (Figure 4's default bubble is the seven-sided one that loses sides and shrinks; Figure 7 replaces the corner-and-edge analogy). | |
| Prose length | computed | Before: 1,175 words of prose (with headings, subtitle and footer) and 427 of captions, 1,602 in all, four figures. After: 1,227 and 738, 1,965 in all, seven figures. | Counted with a script over the rendered text; formulas count one word each. |

## Audit against CRITIQUE.md, briefly

Read cold, the 2026-10-10 page was sound: every number sampled matched the ledger or the page,
the simulation has no side counts or angles in its rules (`step()`, `geom()` and `topology()`
read again), every control worked at both widths, in dark mode and with reduced motion, and
there were no console errors. Findings, all fixed above: the Figure 4 (now 6) readout disagreed
with Figure 1 about the number of bubbles; "several percent" overstated the margin at the end
of the run; two sections ("Why it never settles" and the third dimension) asserted their
points with no figure; a handful of sentences were slogans.

## Tried and dropped

- One neighbor swap in a honeycomb as the seed defect. In this model a single T1 made by hand
  in an unstrained honeycomb does not last: with the gas frozen, the new film shrinks and flips
  back within 200 relaxation steps (tried with the new film at 0.3 and 1.0 of a hexagon side),
  and the foam is a honeycomb again. So the figure removes a film instead, which leaves a
  bubble whose side count cannot relax away. I did not check the reversal against the
  literature and the page does not mention it.
- The scaling-state statistics (side-count distribution, its second moment, Aboav-Weaire or
  Lewis against published values). Not built: it would have been a fourth new figure, and I
  opened no source for the published values. One number from the committed 3,000-bubble run,
  not on the page: the second moment of the side count is 1.53 at its end (187 bubbles).
- The flat (unrelaxed) cells in Figure 7. Their L - E/6 is close to the relaxed value (0.134
  against 0.139), but their walls do not meet at 120 degrees, so the law's one-sixth does not
  apply to them and the number is not a rate. Left out of the page, kept in the row above.
- A drawing of the cells in Figure 7. Part 4 already turns them over.
- The marked bubble's rate measured over a fixed short window (Figure 5). It lands on the
  transient after an event; the stretch-long slope is what the law speaks about.

## For the shared files (not edited by me)

- `plans/foam/PROMPT.md`, article 7: the description should gain the three figures (one
  bubble's history with its side count; a honeycomb with one film removed against one bubble
  doubled; the three-dimensional law evaluated on Kelvin's and the Weaire-Phelan cells across
  volume ratios) and drop "a third tracks mean bubble area" as the last figure.
- `docs/foam/index.html` card for article 7, if it lists figures.
- `plans/foam/LEDGER.md`, article 07 rows to amend when merging: the honeycomb-ratio row
  (0.928 to 0.978, 0.944 at load), the prose-length row, and the check count (15 in
  `07-coarsen.js`, 7 in `07-law3d.js`).
