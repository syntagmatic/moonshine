# Foam 05, Why It Recurs: enrichment ledger (2026-10-13)

Page `docs/foam/05-why-it-recurs.html`. Model code `docs/foam/lib/05-frustration.js`
(`FoamFrustration`, 81 checks, all passing; `node scripts/foam-test.mjs`). Precompute
script `scripts/foam-05-relax.mjs` (about a minute; prints the `FINE = {...}` block
embedded in the page). "Check:" below names a `runChecks()` row in the helper.

Figures after this pass: 1 gap ring (unchanged), 2 shells (15 added), 3 six-ringed bonds
(new), 4 cell mix (Z row added, flat-cost column removed), 5 cost against volume ratio
(new), 6 one cube (was 4, unchanged), 7 soft-sphere diagram (new).

Words: body prose 1110 before, 1147 after; captions 330 before, 633 after (three new
figures). Counted in the browser: header, body paragraphs, headings and the display
formula for prose; `.figure-caption` for captions.

How sources were read this session. Ziherl and Kamien: the arXiv TeX source
(`https://arxiv.org/e-print/cond-mat/0007256`, `paper.tex`), so the equations below are
the authors' own. Zr4Al3: the AFLOW CIF at
`https://aflowlib.duke.edu/prototype-encyclopedia/A3B4_hP7_191_f_de-001/aflow.cif`.
Kraynik's chart: slide 20 of the PDF at
`https://legacy.slmath.org/workshops/900/schedules/24509/documents/3410/assets/32354`,
rendered to an image and read by eye. Not reached: Kraynik, Reinelt and van Swol,
Phys. Rev. E 67, 031403 (2003) itself (paywalled); Sullivan's tables; the Reinelt and
Kraynik OSTI report 751259 was opened and has no energy values in its text.

## Claims

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Fig 2: the 15-neighbor shell is a zirconium atom in Zr4Al3; 15 neighbors, 12 bonds ringed by five and 3 by six, 26 tetrahedra | sourced data + computed | AFLOW CIF: P6/mmm, a = 5.433, c = 5.390 Å, Zr 2d (1/3, 2/3, 1/2), Zr 2e (0, 0, 1/4), Al 3f (1/2, 0, 0); AFLOW cites Wilson, Thomas and Spooner, Acta Cryst. 13, 56 (1960) and Cenzual et al., Acta Cryst. B 47, 433 (1991) for the space group. `shell(z.pts, 0, null, z.L)`. Checks: "Z phase (Zr4Al3): 2 sites with 15 neighbors, 2 with 14, 3 with 12", "Z phase 15 site: ..." (three rows), "Z phase cells fill the hexagonal repeat" | replaces "The 15 is not drawn". The helper gained `cellIn`, a Voronoi cell for any lattice, built on `FoamCells.clip` |
| Fig 2, Fig 3: Zr4Al3 is "the Z phase" | from memory | The AFLOW page does not use the name. The existing ledger row 10 (He and Wang 2024 abstract) lists Z among the Frank-Kasper phases but does not tie it to Zr4Al3 | the property is computed (all shells triangulated, 12/14/15 neighbors); only the name needs a human check |
| Fig 2 caption: none of the 24 tetrahedra is regular; readout: longest edge 22% over the shortest (27% for the 15 shell) | computed | every tetrahedron of each shell checked edge by edge in node: 0 regular of 20, 24, 26, 28. Edge ratios 1.2247 (A15, C15) and 1.267 (Z) | replaces the body sentence "22 percent longer", which the 15 shell would have made false |
| §3: if every bond is ringed by five or six, 10.4 percent must be sixes | derived | 5 + x = 2π/arccos(1/3) = 5.10430, so x = 0.10430. Check: "share of bonds that must be ringed by six, 360/70.53 - 5 = 0.1043" | |
| §3: in a shell of twelve every bond is a five, so sixes run only between atoms with 14, 15 or 16 neighbors | computed | every 12-faced cell in A15, Z and C15 has 12 pentagons. Check: "no 12 site has a six-ringed bond" | true of these three structures; stated for them, not as a theorem |
| Fig 3: A15 6 of 54 bonds (11.1%), Z 5 of 47 (10.6%), C15 16 of 160 (10.0%); A15 slightly too many, C15 too few, Z closest | computed | `bonds()` counts every wall of a repeat once. Checks: "bonds() agrees with census()", "Z phase repeat: 47 walls, 42 pentagons and 5 hexagons", "share ringed by six: C15 0.1000 < needed 0.1043 < Z 0.1064 < A15 0.1111" | |
| Fig 3: A15 straight lines in three perpendicular directions; Z flat sheets of hexagons with lines through them; C15 four at each 16-neighbor atom joined into one network | computed | angles between the six-ringed bonds at a site: 180° (A15 14-site), 120° ×3 in a plane (Z 15-site) and 180° (Z 14-site), 109.47° ×6 (C15 16-site). Connected groups modulo the lattice: A15 three chains, Z one sheet and one chain, C15 all eight 16-sites together. Checks: "A15: the two six-ringed bonds ...", "C15: the four ...", "Z: the three ...", "six-ringed bonds join A15 into three chains, Z into one sheet and one chain, C15 into one network" | blocks drawn: A15 2×2×2 cubes; Z seven hexagons wide, two repeats tall; C15 a cube of edge 1.25 with a 16-site at its corner |
| Fig 4: Z has 3 of 7 cells with 12 faces, 2 with 14, 2 with 15, mean 13.43; Z and C15 nearer the ideal 13.40 than A15, on opposite sides | computed | 94/7 = 13.4286; distances from 13.397: Z 0.031, C15 0.064, A15 0.103. Check: "Z phase mean faces per cell is 94/7 = 13.43" | flat-cost column moved to Fig 5 |
| §4: by the count A15 is the worst fit of the three, yet it is behind the best known foam | computed + Part 4 | previous row; Weaire-Phelan is the best known foam (Part 4 ledger) | no claim is made about the cost of a Z foam, which the page cannot relax (non-cubic repeat, three cell sizes) |
| §4: nearest-point C15 has 16-faced cells 23 percent larger than 12-faced ones; A15's cells start 3 percent apart | computed | volumes 0.04760 and 0.03870, ratio 1.2298; A15 129/125 = 1.032. Checks: "nearest-point C15: a 16-faced cell is 1.2298 times a 12-faced one", "nearest-point A15: ... 129/125" | unchanged claim, now with a check |
| Fig 5: relaxed wall cost on the page mesh: Kelvin 5.3069, A15 5.2888 equal and 5.2869 at its nearest-point 3.2%, C15 5.3245 equal and 5.2840 at its nearest-point 23.0% | computed in the page | `FoamEvolver` on `ratioFoam()` foams: one weight on the larger cells sets the volume ratio, the relaxer holds each volume fixed. Refinement 1 for A15 and C15 (1104 and 3264 triangles), 2 for Kelvin (1152). Checks: "relaxed equal-volume C15 on the page mesh (3264 triangles) lands in (5.3240, 5.3250)", "relaxed C15 costs more than relaxed Kelvin", "relaxing C15 keeps all 24 volumes at 1/24", "relaxed C15 with nearest-point volumes costs less than relaxed Weaire-Phelan (5.2883)" | values read back from the page readout with the slider at 0, 3 and 23 |
| Fig 5 note: fine-mesh limits Kelvin 5.30628, A15 5.28835, C15 5.32420 | precomputed | `node scripts/foam-05-relax.mjs`: C15 equal volumes at 816, 3264, 13056, 52224 triangles gives 5.325138, 5.324454, 5.324268, 5.324220, error ratio 3.83, Richardson limit 5.32420. Same script: C15 nearest-point 5.28376, A15 equal 5.28835, A15 nearest-point 5.28639, Kelvin 5.30628 | Kelvin and A15 agree with Part 4's study to five decimals |
| Fig 5 note: published Kelvin 5.30628, Weaire-Phelan 5.28834 | sourced in Part 4 | LEDGER.md, article 04 rows | not reopened here |
| Fig 5 note: published C15 "about 5.324, read off a chart" | second-hand | Kraynik's MSRI slides, slide 20, "Monodisperse Soap Froth": scatter of energy against F; the C15 marker sits at F = 13.33 between the 5.32 and 5.33 ticks, about 5.324. The slides cite Kraynik, Reinelt and van Swol, Phys. Rev. E 67, 031403 (2003), which was not opened | needs a human to read the number from the paper's table |
| Fig 5 caption: with natural volumes C15 costs less than Weaire and Phelan's foam; held to equal volumes it costs more than Kelvin's; A15 is below C15 at every ratio | computed | 5.2840 < 5.2888; 5.3245 > 5.3069; A15's line is 0.006 to 0.036 below C15's from ratio 1.25 to 1.00. Fine mesh: 5.28376 < 5.28835 and 5.32420 > 5.30628 | cost is area per cell over (mean volume)^(2/3). For unequal cells this measure falls a little by itself (Jensen: 0.006 of C15's 0.040), so most of the drop is geometry |
| Fig 5 note: on the page mesh C15 crosses Kelvin's level at 9.4% and equal-volume A15's at 20.0% | computed in the page | linear interpolation between the six C15 foams. On the fine-mesh limits the first crossing is about 9.7% | stated as "on this mesh" |
| §4: equalizing costs C15 0.040, more than twice the 0.018 between Kelvin and Weaire-Phelan; it costs A15 0.002 | computed | page mesh: 5.3245 − 5.2840 = 0.0405; 5.3069 − 5.2888 = 0.0181; 5.2888 − 5.2869 = 0.0019. Fine mesh: 0.0404, 0.0179, 0.0020 | turns the old flat-wall statement (C15 5.328 flat) into a relaxed one |
| §6: a core's center can wander only where the whole core stays inside its cell; more room means lower free energy | sourced | Ziherl and Kamien: "each micelle is contained in a cell formed by its neighbors"; "the positional entropy of a micelle is determined by the configurational space of its Voronoi or Wigner-Seitz cell"; eq. 2, F_bulk = −k_B T ln(α(β/n^(1/3) − 1)^3), with α = 2^(5/2), β = 2^(−5/6) for FCC and α = 2^2·3^(1/2), β = 2^(−5/3)·3^(1/2) for BCC, n = ρR^3 | the page's version: the cell with every wall moved inward by R. For FCC and BCC that volume equals the authors' closed form to 1e-9. Checks: "free-volume bulk term from eroded cells equals the closed form, FCC ...", "... BCC ..." |
| Fig 7: A15 bulk term from the equal-volume cells of Part 4 | computed + sourced | the authors use "a pseudo-Voronoi construction (subject to the constraint that all cells have equal volume)" and fit it with eq. 3 (S ≈ 1.64, C ≈ 1.38, "within 0.1% of the numerical result"). The page's eroded equal-volume cells agree with eq. 3 to 0.02% at n = 0.120 and 0.15% at worst from 0.110 to 0.124. Check: "A15 bulk term from eroded equal-volume cells is within 0.2% of the authors' fit" | |
| Fig 7: surface term and total | sourced | eq. 4 to 6: F_surf = 2ℓN k_B T/d, A_M d = 2(n^(−1) − 4π/3)R^3, so F_surf = (ℓN k_B T/R) γ n^(−2/3)/(n^(−1) − 4π/3); F = F_bulk + F_surf; "γ_FCC = 2^(5/6)·3 = 5.345, γ_BCC = 5.306, and γ_A15 = 5.288" | `softSphere.surfPer`, `softSphere.takeover` |
| Fig 7: wall costs 5.345, 5.306, 5.288 | computed + Part 4 | FCC from `FoamCells.foam(fcc).s` = 5.3454 at runtime. 5.306 and 5.288 are constants in the page: Part 4's relaxed limits 5.30628 and 5.28835 to three decimals, and the authors' printed values | |
| Fig 7: each ball has 162 chains, the authors' count for the 1997 molecules | sourced | "With N = 162 chains per micelle [Balagurusamy97]" | |
| Fig 7: the authors take 0.120, the melting density of hard spheres, as the lowest density | sourced | "it must be larger than the melting density, n ≈ 0.120 for hard spheres [Curtin and Ashcroft], and that it must be smaller than the close-packing density of the A15 lattice, n = 0.125" | region left of 0.120 is veiled and labelled |
| Fig 7: at 0.120 the boundaries are at ℓ = 0.092 R and 0.296 R; the authors quote about 0.1 and 0.3 | computed + sourced | "at n = 0.120 the FCC to BCC transition occurs for ℓ ≈ 0.1R and the BCC to A15 transition occurs for ℓ ≈ 0.3R. This corresponds to an entropy per chain of 0.5 k_B and 1.5 k_B". Page: 0.0921 and 0.2956, which are 0.48 and 1.55 k per chain. Checks: "at n = 0.120 BCC takes over from FCC at l = 0.092 R and A15 from BCC at 0.296 R", "those thresholds are 0.48 and 1.55 k per chain" | |
| §6: with no coat the cores choose face-centered cubic, which gives them the most room, and whose foam costs 5.345 | computed + sourced | at ℓ = 0 the bulk terms order FCC < BCC < A15 for every n on the chart (4.212, 4.795, 5.650 at 0.120). Authors: "hard-sphere crystals should form FCC structures" | the old text said "should crystallize as face-centered cubic" with the same source |
| §6: A15's upper boundary climbs without limit as the density nears 0.125, where cores along a column touch | computed | neighbors along a column are a/2 apart, so 2R = a/2 gives n = 8R^3/a^3 = 0.125; the bulk term is finite at 0.12499 and infinite at 0.12501. Check: "A15 bulk term diverges at n = 0.125" | the authors give 0.125 as A15's close-packing density |

## Audit of the existing page (cold, against CRITIQUE.md)

Verdict before the pass: REVISE. No wrong number was found. Every control was driven
at 1280 and 390 px, in dark mode and with reduced motion: no console errors, no
sideways scroll, no SVG text under 11 px. All 36 rows of "Claims: article 05" were
reread; the ones recomputed here (gap 7.356°, stretch 1.018, icosahedron 1.0515,
5.104 and 13.40, 22% edge spread, 48 + 6 walls, 23% and 3% volume spreads, flat costs
5.315, 5.297, 5.328, 4.7% corner move, 1.64 to 3.72 and 2.74 to 2.75 Å, FCC 5.345) all
hold, and the three Ziherl and Kamien quotes match the TeX source.

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Fig 2 caption: "The 15 is not drawn" | fixed | see first row above | PROMPT asks for 12, 14, 15 and 16 from real coordinates |
| Fig 3 (old) caption and §3: "nearer the ideal ... yet as a foam with flat walls and equal volumes it costs more than Kelvin's" | changed | true as stated (5.328 against 5.315), but a flat-wall comparison of foams that do not stay flat | now Fig 5, relaxed: 5.324 against 5.306 |
| §3: "forcing the volumes equal costs wall" | changed | was asserted; flat C15 goes from 5.2876 to 5.3279 per average cell | now measured relaxed in Fig 5 (0.040) |
| intro: "This part asks why ice, metal and soap should agree" | cut | talks about the page | replaced by a plain sentence |
| §5: "So is the superconductor Nb3Sn, though nothing about foam explains its superconductivity" | cut | PROMPT: keep superconductivity out of the argument | ledger row 21 no longer has a sentence on the page |
| §5: second Pauling and Marsh quote ("in the course of this work a structure was found ...") | cut | still true (row 24); the first fragment stays | word budget |
| §5: Brakke on Pauling's 1960 book | cut | still true (row 31) | word budget; not part of the argument |
| §6: "On that account the molecules are working on Kelvin's problem" | cut | personified closing line | |
| §6: "The argument has a limit ..." paragraph | changed | asserted | replaced by Fig 7 and the paragraph under it |
| Fig 2 buttons | fixed | toggle buttons had no pressed state for assistive tech | `aria-pressed` set on the four shell buttons |

## Tried and dropped

- Relaxing a Z foam. `evolver.js` works on a cubic repeat, and Z needs two weights to
  equalize three cell sizes. Out of reach without changing shared code, so the page
  makes no claim about Z's cost.
- A scatter of cost against mean faces for the whole family. Kraynik's chart already is
  that figure, and its values are not available as numbers. The volume-ratio chart says
  why C15 is expensive, which the scatter would only show.
- Twenty tetrahedra around a point as a figure. The 12-neighbor shell of Figure 2 is
  that picture from real coordinates; the sentence with 5.1 percent stays.
- Hydrate guests against cage sizes. No source with cage radii and guest diameters
  could be opened (Sloan's review is paywalled, the engineering summary returned 403),
  so nothing was built. Still a good figure if someone supplies Sloan's table: the
  smallest and the largest guests both form the C15-type hydrate, the middle ones this
  one.
- Soft-sphere diagram with C15 as a fourth candidate. It is the same calculation, but
  the authors do not make it and real C15 phases involve unequal cells, which their
  model does not have.
- Reading the relaxed C15 cost from Reinelt and Kraynik's OSTI report 751259 (opened;
  it reports stresses, not energies).

## Notes for the series

- `plans/foam/PROMPT.md`, article 5, should now mention: the 15 shell, the six-ringed
  bonds drawn for three crystals against the needed 10.4 percent, relaxed cost against
  how unequal the cells are (C15 relaxed at equal volume costs more than Kelvin), and
  the soft-sphere diagram computed from the series' cells.
- With a forced theme (`localStorage['moonshine-theme']`), pages opened as `file://` do
  not get `style.css`'s dark rules in Chromium, because `motion.js` cannot read the
  rules of a file stylesheet. Over http it works. Not specific to this page.
