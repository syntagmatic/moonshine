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
| 03 | Kelvin's Bubble | `03-kelvins-bubble` | main | 2026-09-20 | 2026-09-20 | done; first committed 2110ce5. Its relaxation claims (squares stay flat, hexagons warp) were confirmed by the relaxer on 2026-10-10, see article 04 rows. |
| 04 | The Counterexample | `04-the-counterexample` | main | 2026-10-10 | 2026-10-10 | done; render-check PASS; every figure viewed at desktop, 390px, dark, reduced motion; every control driven headlessly. |
| 05 | Why It Recurs | `05-why-it-recurs` | agent | 2026-10-10 | 2026-10-10 | done; render-check PASS; figures reviewed by main; one label moved in Fig 3. |
| 06 | The Lattice Recipe | `06-the-lattice-recipe` | agent | 2026-10-10 | 2026-10-10 | done; render-check PASS; figures reviewed by main; the two September 2026 arXiv citations re-fetched by main. |
| 07 | Foams in Motion | `07-foams-in-motion` | agent | 2026-10-10 | 2026-10-10 | done; render-check PASS; figures reviewed by main. No CRITIQUE pass run on 04 to 07. |

## Facts to verify before building (do not trust this plan; re-derive or re-source)

This checklist was written before any article existed. For articles 04 to 07 it is superseded by the claims sections at the end of this file, which record what was actually checked and what was cut.

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

## Claims: article 04, The Counterexample (2026-10-10)

Computed rows come from `docs/foam/lib/cells.js` and `evolver.js`; `node scripts/foam-test.mjs --convergence` reruns the checks and the refinement study.

| claim | kind | how it is known |
|---|---|---|
| Found in 1993 by Denis Weaire and Robert Phelan with computer simulation; published 1994 | sourced | Brakke, "Beating Kelvin's Partition of Space" (kenbrakke.com/kelvin/kelvin.html): "in 1993, Denis Weaire and Robert Phelan came up with a partition of space into two kinds of cells". Paper: Weaire and Phelan, "A counter-example to Kelvin's conjecture on minimal surfaces", Phil. Mag. Lett. 69(2), 107-110 (1994), doi:10.1080/09500839408241577, as cited on Wikipedia "Weaire-Phelan structure" and the TCD page below. The paper itself was not read |
| They worked at Trinity College Dublin | sourced | TCD School of Physics history page "Throwing Shapes" (tcd.ie/physics/300/history/exhibition-gallery/throwing-shapes) presents the discovery as the department's own. It does not state the affiliation in a sentence; this is the weakest sourced row here |
| The work was done in Ken Brakke's Surface Evolver | sourced | Brakke's page: "The area calculations and these images were made with the Surface Evolver program" |
| 8 cells per repeat: 2 dodecahedra with 12 pentagons, 6 cells with 12 pentagons and 2 hexagons | computed | `cells.js` runChecks: face counts of the A15 cells, before and after the volume correction. Matches Brakke's page |
| Counts in Fig 1 readout: 12 faces, 30 edges, 20 corners; 14 faces, 36 edges, 24 corners | computed | counted on the cell geometry in the page; one repeat welds to 46 vertices, 92 edges, 54 faces (runChecks) |
| Dodecahedron: 12 congruent pentagons with four equal sides and one longer. Larger cell: pentagons of two shapes | computed | edge lengths of the equal-volume flat cells: dodecahedron 12 x (0.2406 x4, 0.3150); 14-faced cell 4 of that shape, 8 x (0.1386, 0.2069 x2, 0.2406 x2), hexagons (0.2069 x4, 0.3150 x2), in cube edges |
| Ideal flat-faced cell: 5.10 sides per face, 13.4 faces | derived | interior angle 109.47 gives n = 360/(180 - 109.47) = 5.104; for a solid with three edges per corner, V - E + F = 2 with 3V = 2E and nF = 2E gives F = 12/(6 - n) = 13.397 |
| Kelvin: 14 faces averaging 5.14 sides. Weaire-Phelan: 13.5 faces, 5.11 sides | derived | Kelvin (6x4 + 8x6)/14 = 5.143. W-P faces per cell (2x12 + 6x14)/8 = 13.5; sides (2x60 + 6x72)/(2x12 + 6x14) = 552/108 = 5.111 |
| The eight points (corners, center, two per face a quarter in from each side on a midline, one axis per face pair) | computed | `sites.a15()`; the cells they produce pass the face-count checks. This is the A15 arrangement |
| 14-faced cells join hexagon to hexagon in columns along three perpendicular axes | computed | hexagonal faces link sites 2-3 along x, 4-5 along y, 6-7 along z, including across the periodic seam. Brakke's page says the same. Columns of different directions touch through pentagons, so the page says "without crossing", not "never meet" |
| Nearest-point cells are unequal: 125/1024 and 129/1024 of the cube, dodecahedra 3.1% smaller | computed | `foam(sites.a15())`: volumes 0.1220703125 and 0.1259765625 exactly |
| Equal volumes need the walls between unlike cells moved 0.2% of the cube edge | computed | `equalVolumeA15()`: weight w = -0.0024803 on the six column sites; wall shift w / (2 x 0.559) = 0.0022 |
| Flat equal-volume foam costs 5.297, below Kelvin's relaxed 5.306 | computed | `equalVolumeA15().foam.s` = 5.29695 |
| Flat Kelvin 5.3147 | derived and computed | (6 + 12 sqrt 3)/(8 sqrt 2)^(2/3); `foam(sites.bcc()).s` agrees to 1e-15 |
| In the page: Kelvin relaxes to about 5.3064 on 4,608 triangles, Weaire-Phelan to about 5.2885 on 4,416 | computed | Fig 3 at runtime; in node 5.30644 and 5.28850 after 16 steps |
| Published values 5.30628 and 5.28834 | sourced, secondhand | Kusner and Sullivan, "Comparing the Weaire-Phelan equal-volume foam to Kelvin's foam", Forma 11 (1996) 233-242, as quoted in a Boulder School lecture handout (boulderschool.yale.edu, "structure.pdf") found by search. The Forma paper was not read |
| Finer meshes extrapolate to 5.30628 and 5.28835 | computed | refinement levels 1-4 (Kelvin) and 0-3 (W-P), 1,500 steps each, Richardson estimate from the last three: 5.306279 and 5.288349 |
| Gap 0.34% | computed | (5.30628 - 5.28834)/5.30628 = 0.338%; the page's meshes give 0.34% |
| Kelvin: squares stay flat, hexagons warp. Weaire-Phelan: hexagons stay flat, every pentagon bends | computed | `mesh.flatness()` after relaxing: Kelvin squares 0, hexagons 0.0094; W-P hexagons 2e-15, smallest pentagon deviation 0.0046 |
| Bending under 2% of the cube edge | computed | largest vertex displacement after 16 steps: Kelvin 0.015, W-P 0.012 |
| Flat angles: Kelvin films 109.47 and 125.26, edges 90 and 120; W-P films 113.6 to 131.8, edges 101.5 to 126.9 | computed | `junctionAngles()` on the flat meshes |
| Relaxed angles close on 120 and 109.47; film spread narrows with refinement | computed | Kelvin films at levels 1-4: 113.1-123.4, 115.9-122.1, 117.0-121.5, 118.0-121.0. Corner angles use a three-point tangent estimate and do not narrow monotonically at a fixed 16 steps, so the caption claims it only for films |
| Kusner and Sullivan (1996) proved Weaire-Phelan beats every foam with Kelvin's arrangement | sourced | Brakke's page: they "proved analytically that the polyhedral Weaire-Phelan foam beats any foam with the Kelvin topology" |
| Not proved optimal; the problem is open | sourced | Brakke's page; Rehmeyer, "A building of bubbles", Science News, 19 July 2008 |
| Seen in a real foam in 2011: Gabbrielli and colleagues, six layers of about 1,500 bubbles, container walls shaped to fit | sourced | Nature news blog, 28 Nov 2011, "Scientists make the 'perfect' foam": "the 6 layers of about 1,500 bubbles were ordered into the WP structure"; "Normal containers have flat walls, which the Weaire-Phelan (WP) foam won't sit comfortably against". Paper: Gabbrielli, Meagher, Weaire, Brakke, Hutzler, Phil. Mag. Lett. 92 (2012) 1-6 (cited on the TCD page; not read). The blog does not say whether 1,500 is per layer or in total; the page keeps its wording |
| Water Cube: Arup, PTW, CCDI; array rotated, then a box cut out | sourced | "Inside Beijing's Big Box of Blue Bubbles", Architectural Record continuing education: designers "assemble an infinite array of the Weaire-Phelan units, rotate it in three dimensions" then "slice the packed cells to create a box" |
| Box 177 m square, 31 m high; about 22,000 steel members | sourced | Carfrae, "Engineering the Water Cube", Architecture Australia, July 2006: "177 x 177 x 31 cubic metres", "22,000 structural elements". Architectural Record: "22,000 steel tubes connected at spherical nodes" |
| Carfrae: "when it is viewed at an arbitrary angle it appears totally random and organic" | sourced | Thomas, "Swimming in mathematics", Plus magazine, 12 Sept 2008, quoting Carfrae |
| Face-on cut repeats once per cube; a generic cut never repeats | derived | the periods of the cut are the lattice vectors lying in the plane; with normal (0,0,1) these are all (a,b,0); when the normal's components are rationally independent there are none |

Not used: the rotation angle of the Water Cube array. Science News gives "about 111 degrees" without an axis; no source found states the orientation, so Fig 5 offers a free tilt and makes no claim to reproduce the facade.

## Claims: article 05, Why It Recurs (2026-10-10)

Page: `docs/foam/05-why-it-recurs.html`. Model code: `docs/foam/lib/05-frustration.js`
(`FoamFrustration`), on top of `docs/foam/lib/cells.js`. All entries checked 2026-10-10.

Run the model checks with

    node -e "const r=require('./docs/foam/lib/05-frustration.js').runChecks(); r.forEach(c=>console.log(c.ok?'ok  ':'FAIL',c.name,c.detail)); console.log(r.filter(c=>!c.ok).length,'failures of',r.length)"

Result on 2026-10-10: 0 failures of 44. "Check: ..." below names the `runChecks()` row.

How the sources were read. Publisher abstract pages for Taylor & Francis, IUCr and Nature
refused the fetch (403 or a login redirect), so the abstracts of those papers were read from
OpenAlex's copy of the publisher abstract (`https://api.openalex.org/works/doi:<doi>`). Two
papers were read in full as PDFs: Pauling and Marsh (CaltechAUTHORS copy of the PNAS scan) and
Ziherl and Kamien (arXiv). Quotes on the page were copied from those texts.

### Claims

| # | where | claim | kind | how it is known |
|---|---|---|---|---|
| 1 | intro | Weaire and Phelan's 1994 abstract calls the foam "a structure analogous to that of some clathrate compounds and also related to the β-tungsten structure" | sourced | Weaire and Phelan, "A counter-example to Kelvin's conjecture on minimal surfaces", Phil. Mag. Lett. 69 (2), 107-110 (Feb 1994), https://doi.org/10.1080/09500839408241577. Abstract read via OpenAlex: "We have found a counter-example, in the form of a structure analogous to that of some clathrate compounds and also related to the β-tungsten structure. Its surface area is approximately 0.3% less than that of Kelvin's structure." Crossref gives volume, issue, pages and date. Their reference list (Crossref) includes Kasper et al., Science 150, 1713 (1965), on silicon clathrates, and Pearson's book on metals and alloys |
| 2 | intro | A clathrate is a crystal of cages | sourced | Pauling and Marsh 1952 (row 20): "clathrate compounds, with a tetrahedral hydrogen-bonded framework of water molecules ... defining cavities large enough to contain the other molecules" |
| 3 | §1 | Four equal spheres can all touch one another only at the corners of a regular tetrahedron | derived | Four points at one common mutual distance in space form a regular tetrahedron |
| 4 | §1, Fig 1, subtitle | Dihedral angle of a regular tetrahedron is arccos(1/3) = 70.53°; five cover 352.64°; gap 7.36°; six overlap | derived + computed | arccos(1/3) = 70.5288°, 5 × = 352.644°, 360 − that = 7.3561°, 6 × = 423.2°. Fig 1 builds the five tetrahedra from coordinates and measures the angle between the two planes at the shared edge. Checks: "regular dihedral, measured from coordinates, is arccos(1/3)", "gap after five regular tetrahedra ...", "t = 0: all thirty tetrahedron edges have length 1" |
| 5 | Fig 1 caption | Lengthening the five outer edges by 1.8 percent closes the gap; each tetrahedron then takes 72° | derived + computed | Ring corners sit √3/2 from the shared edge, so an outer edge of length L subtends 2 asin(L/√3); 72° needs L = √3 sin 36° = 1.01807. Checks: "t = 1: the gap is closed", "t = 1: each tetrahedron takes 72 degrees", "t = 1: outer edges are sqrt(3) sin 36 = 1.01807". Slider driven to 1 in the browser: readout "each takes 72.00° · five take 360.00° · gap 0.00°", output ×1.018 |
| 6 | §1 | Twenty tetrahedra close into an icosahedron only if its edges are 5.1 percent longer than the spokes to its center | derived | Icosahedron edge over circumradius = 1/sin 72° = 1.05146. Check: "icosahedron edge over radius is 1 / sin 72 = 1.05146" (from corner coordinates (0, ±1, ±φ)) |
| 7 | §1 | 360°/70.53° ≈ 5.104 tetrahedra around a bond | derived | 2π/arccos(1/3) = 5.10430 |
| 8 | §1 | Part 4 met the same number as the 5.10 sides of an ideal foam face; 70.53° = 180° − 109.47° | derived | arccos(1/3) = π − arccos(−1/3). Check: "70.53 is 180 minus the Plateau angle arccos(-1/3)". Part 4's text has "n = 360°/(180° − 109.47°) ≈ 5.10 sides, F = 12/(6 − n) ≈ 13.4 faces" |
| 9 | §2 | In 1958 F. C. Frank and J. S. Kasper described these alloys; quote "tetrahedral groupings of atoms occur everywhere in the structure"; they singled out four shells with 12, 14, 15 and 16 atoms | sourced | Frank and Kasper, "Complex alloy structures regarded as sphere packings. I. Definitions and basic principles", Acta Cryst. 11, 184-190 (1958), https://doi.org/10.1107/S0365110X58000487. Abstract via OpenAlex: "A characteristic of the class of structures discussed is that tetrahedral groupings of atoms occur everywhere in the structure--alternatively stated, coordination polyhedra have only triangular faces ... Justification is given for the prominence of four such polyhedra (for coordination numbers of 12, 14, 15, and 16) in actual structures." The abstract says "prominence of four", not "only four", so the page says "singled out" |
| 10 | §2 | The eight points are called A15 and belong to this family | sourced + computed | Name: AFLOW prototype page for Cr3Si, Strukturbericht A15, Pearson cP8, space group Pm-3n no. 223, https://www.aflow.org/prototype-encyclopedia/A3B_cP8_223_c_a.html. Family: He and Wang, Polymers 16, 372 (2024), abstract (OpenAlex) lists "the five FK (i.e., σ, A15, C14, C15 and Z) phases", https://doi.org/10.3390/polym16030372. Computed: four cells meet at every one of the 46 corners, so every corner is a tetrahedron of sites, and the shells have 12 and 14 neighbors. Checks: "A15: four cells meet at every corner", "A15 corner site ...", "A15 face site ..." |
| 11 | §2 | `FoamCells.sites.a15()` is the A15 arrangement | sourced + derived | AFLOW lists Si on 2a (0,0,0), (½,½,½) and Cr on 6c (¼,0,½), (¾,0,½), (½,¼,0), (½,¾,0), (0,½,¼), (0,½,¾). cells.js has the six face points at (¼,½,0) etc., which is the same structure with the origin moved by (½,½,½): that shift maps the 2a pair to itself and 6c onto the cells.js positions. Pauling and Marsh use the cells.js setting (dodecahedra at 000 and ½½½, oxygen on 6c ¼ 0 ½) |
| 12 | §2 | Each wall is crossed by one bond; each corner of the cell (three walls) is a triangle of neighbors, hence a tetrahedron with the center atom; walls with n sides mean n tetrahedra around that bond | derived + computed | `shell()` builds triangles from cell corners and counts triangles at each neighbor. Checks: "... shell is a closed triangulated surface (V − E + F = 2, F = 2V − 4)" and "... tetrahedra around each bond equal the sides of the wall it crosses", for all four site kinds |
| 13 | Fig 2 caption and readout | A15 face site: 14 neighbors, two bonds through hexagons with six tetrahedra, twelve with five, 24 tetrahedra. Corner site: 12 neighbors, 20 tetrahedra, all bonds five | computed | `shell(a15, 2)` and `shell(a15, 0)`. Checks: "A15 face site: 14 neighbors, 12 bonds with five tetrahedra and 2 with six", "A15 corner site: 12 neighbors, 12 ... 0" |
| 14 | Fig 2 | The 16-neighbor shell comes from MgCu2 (C15): 16 neighbors, 12 bonds with five and 4 with six, 28 tetrahedra | sourced + computed | Coordinates from the AFLOW page for Cu2Mg, Strukturbericht C15, cF24, Fd-3m, "Cubic Laves": Mg on 8b (⅜,⅜,⅜), (⅝,⅝,⅝); Cu on 16c (0,0,0), (¼,¼,0), (¼,0,¼), (0,¼,¼), plus face-centering. https://www.aflow.org/prototype-encyclopedia/A2B_cF24_227_d_a.html (redirects to the `_c_b` label). Check: "C15 Mg site: 16 neighbors, 12 bonds with five tetrahedra and 4 with six" |
| 15 | §2 | Around every atom in Fig 2 the longest tetrahedron edge is 22 percent longer than the shortest | computed | A15: edges 0.5000, 0.5590, 0.6124 of the cube, 0.6124/0.5 = 1.2247. C15 Mg site: 0.3536 to 0.4330, ratio 1.2247. Shown in the Fig 2 readout for each of the three buttons |
| 16 | §3 | One repeat of A15 has 48 pentagonal and 6 hexagonal walls; bonds average 5.111 | computed | `census(a15)`: 54 walls, bySides {5: 48, 6: 6}, mean 46/9 = 5.1111. Checks: "A15 repeat: 46 corners, 92 edges, 54 walls (48 pentagons, 6 hexagons), 8 cells", "A15 mean sides per wall is 46/9" |
| 17 | §3, Fig 3 | Mean sides per wall and mean faces per cell are tied by n = 6 − 12/F; 5.104 sides goes with 13.40 faces | derived | A cell with three edges at each corner has 2E = 3V and V − E + F = 2, so its faces have 6F − 12 sides in all. Summing over cells gives mean sides = 6 − 12/(mean faces). 12/(6 − 5.1043) = 13.397. Checks: "A15/C15/BCC: mean sides = 6 − 12 / mean faces (Euler)", "ideal tetrahedra per bond ... 13.397 faces" |
| 18 | §3, Fig 3 | A15: 2 of 8 cells with 12 faces, 6 of 8 with 14, mean 13.50. C15: 16 of 24 with 12, 8 of 24 with 16, mean 13.33. Kelvin (BCC): 14 | computed | `census()`; checks "A15: 2 cells with 12 faces, 6 with 14", "C15 repeat: 136 corners, 272 edges, 160 walls, 16 cells with 12 faces and 8 with 16", "BCC mean faces per cell is 14" |
| 19 | Fig 3, §3 | Flat-walled, equal-volume wall cost: Kelvin 5.315, A15 5.297, C15 5.328. Before equalizing, the 16-faced cell of C15 is 23% larger than the 12-faced one; A15's cells differ by 3% | computed | BCC 5.3147 and A15 5.2970 are the cells.js values. C15: `equalVolume(c15, Mg sites)` slides the Mg walls (weight −0.00975) until all 24 volumes are 1/24, giving 5.3279. Plain Voronoi volumes: C15 0.04760 and 0.03870 (ratio 1.230); A15 129/1024 and 125/1024 (ratio 1.032). Checks: "equalVolume on A15 reproduces cells.js equalVolumeA15", "equal-volume C15: all 24 volumes are 1/24", "equal-volume C15 keeps 16 cells of 12 faces and 8 of 16", "flat equal-volume wall cost: C15 above BCC above A15". These are flat-wall values, not relaxed foams, and the page says so |
| 20 | §4 | Cr3Si: silicon at the corners and center, chromium at the six face points. β-tungsten is tungsten in the same arrangement | sourced | AFLOW A15 page (row 10): Si on 2a, Cr on 6c; "the A Strukturbericht designation comes from the fact that this is also the structure of β-W" |
| 21 | §4 | Nb3Sn has the same arrangement and is a superconductor; nothing about foam explains that | sourced | AFLOW A15 page lists Nb3Sn among compounds with this structure. Matthias, Geballe, Geller, Corenzwit, "Superconductivity of Nb3Sn", Phys. Rev. 95, 1435 (1954), https://doi.org/10.1103/PhysRev.95.1435, abstract via OpenAlex: "The superconducting transition temperature of Nb3Sn at 18 K is the highest one known." The page makes no claim about why |
| 22 | §4, Fig 4 | One cube of the foam has 46 corners, four edges at each, 92 edges | computed | `iceNet()` on the welded equal-volume foam. Checks: "corner network: 92 edges, four at every corner"; cells.js "Weaire-Phelan repeat: 46 vertices, 92 edges, 54 faces, 8 cells" |
| 23 | §4 | Pauling and Marsh, 1952, chlorine hydrate: 46 water molecules per cube, "two pentagonal dodecahedra and six tetrakaidecahedra", chlorine in the six larger cages | sourced | Pauling and Marsh, "The Structure of Chlorine Hydrate", PNAS 38 (2), 112-118 (1952), https://doi.org/10.1073/pnas.38.2.112; full text read from https://authors.library.caltech.edu/records/8d4x3-pvr77. "The unit cell contains 46 water molecules, with the oxygen atoms arranged so as to form two pentagonal dodecahedra and six tetrakaidecahedra"; agreement "was markedly improved if the chlorine molecules were placed within the six tetrakaidecahedra only, leaving the dodecahedra empty"; tetrakaidecahedron radius 4.46 Å at the equator against 3.85 Å for the dodecahedron. Their footnote 7 says Claussen, and Müller and von Stackelberg, arrived at the same structure independently, so the page says "published", not "discovered" |
| 24 | §4 | Quotes: "studying the structures of intermetallic compounds" and "in the course of this work a structure was found which seemed to be ideally suited to the hydrates of smaller gas molecules" | sourced | Same paper, p. 113: "We have been studying the structures of intermetallic compounds that involve icosohedral and pentagonal dodecahedral arrangements of atoms, and in the course of this work a structure was found which seemed to be ideally suited to the hydrates of smaller gas molecules." Quoted as two fragments, each verbatim |
| 25 | §4 | Methane hydrate has the same framework | sourced | Cueto Duenas, Dunn-Rankin, Chien, Energy & Fuels 38, 7862 (2024), https://doi.org/10.1021/acs.energyfuels.4c00267, abstract via OpenAlex: "Gas hydrates with methane as a guest molecule form structure I hydrates with two small dodecahedral cages and six tetra decahedral large cages." Structure I cell of 46 waters with 5^12 and 5^12 6^2 cages: Heriot-Watt Centre for Gas Hydrate Research, https://hydrate.site.hw.ac.uk/what-are-gas-hydrates/ |
| 26 | §4 | A water molecule in ice makes four hydrogen bonds; quote "differ greatly from the expected tetrahedral angle", one of their objections to an earlier proposal; the angle is 109.47°, Plateau's vertex angle | sourced + derived | Pauling and Marsh p. 112: "a tetrahedral hydrogen-bonded framework of water molecules (with O-H...O = 2.76 Å, as in ice)". On von Stackelberg's structure: "not acceptable because of the very short O-H...O distance of 2.4 Å; in addition, the hydrogen bonds are at angles between 60° and 145°, which differ greatly from the expected tetrahedral angle". The short distance was the first objection, so the page says "one of". arccos(−1/3) = 109.47°, as in Part 3 |
| 27 | Fig 4 | The oxygen positions the slider moves to | sourced data | Pauling and Marsh p. 114: space group Pm3n, a0 = 11.82 Å, 6 O on 6(c) ¼ 0 ½; 16 O on 16(i) xxx, x = 0.183; 24 O on 24(k) 0yz, y = 0.310, z = 0.116. Embedded as those four numbers in `05-frustration.js` and expanded by the Pm-3n operations. Checks: "Pauling-Marsh oxygen orbits have 6 + 16 + 24 = 46 positions", "each foam corner pairs with a different oxygen position" |
| 28 | Fig 4 caption | No corner moves more than 4.7 percent of the cube's edge; no edge is made or broken; edge lengths 1.64 to 3.72 Å in the foam scaled to 11.82 Å become 2.74 or 2.75 Å | computed | `iceNet()`: largest move 0.0467 cube edges; the same 92 edges join the same corners at both ends of the slider (the edge list is fixed and only positions move); foam edges 0.1386 to 0.3150 of the cube, × 11.82 = 1.64 to 3.72 Å; with the published positions all 92 are 2.742 to 2.749 Å, against the paper's own "O-H...O distances of 2.75 Å throughout". Checks: "published oxygen positions give all 92 bonds within 0.01 of 2.75 angstrom", "foam corners sit within 0.05 cube edges of the oxygen positions". Slider driven to 1 in the browser: readout "92 edges, 2.74 to 2.75 Å" |
| 29 | Fig 4 caption | 2 points at corners and center, 6 on faces; dodecahedron edges in teal; center dodecahedron shaded | computed | Sites 0-1 and 2-7 of `sites.a15()`. Checks: "60 of the 92 edges lie on the two dodecahedra", "center dodecahedron: 12 pentagonal walls around (1/2, 1/2, 1/2)". "Atoms" view draws 21 balls (8 corner copies, 1 center, 12 on faces), counted at runtime |
| 30 | §4 | The foam bends its walls to meet at Plateau's angles; the ice moves its corners until every bond has the same length; same network, different measurements | sourced + computed | Foam: Part 4. Ice: Pauling and Marsh, "In order for all of the O-H...O distances within the unit cell to be the same the oxygen atoms must lie in the following positions". Same network: row 28. Ziherl and Kamien (row 33) state the foam side directly: the Weaire-Phelan partition "differs from the equal-volume Voronoi construction for the A15 lattice only in a delicate curvature of the pentagonal faces" |
| 31 | §4 | Ken Brakke wrote the Surface Evolver and notes that a picture with this topology was in Pauling's 1960 chemistry book | sourced | https://kenbrakke.com/kelvin/kelvin.html: "Ironically, an image with the same topological structure was in Linus Pauling's 1960 chemistry book." Surface Evolver authorship: Weaire and Phelan's first reference is Brakke, Exp. Math. 1, 141 (1992); Ziherl and Kamien ref. 23, "Surface Evolver, a software package developed by K. Brakke". Brakke's page does not say which crystal the picture shows, and neither does this page |
| 32 | §5 | 1997, Balagurusamy, Ungar, Percec, Johansson: tree-shaped molecules gather two to twelve at a time into balls, the balls into a cubic liquid crystal with balls at corners and center and on the face bisectors at ¼ and ¾ | sourced | J. Am. Chem. Soc. 119, 1539-1555 (1997), https://doi.org/10.1021/ja963295i, abstract via OpenAlex: "an isomorphous cubic liquid-crystalline (LC) phase of Pm3̄n space group ... 12, 6, and 2 monodendrons of generation 2, 3 and 4 are self-assembled in supramolecular dendrimers resembling spherical micelles when they are centered at the corners and the body-center and respectively highly rounded tetrahedra when they are at 1/4 and 3/4 distance along one of the bisectors of each face of the cubic cell." Ziherl and Kamien cite this paper for dendrimer micelles that "arrange into the A15 lattice". "Tree-shaped": Ungar et al., Science 299, 1208 (2003), abstract, "dendron (tree-like) molecules" |
| 33 | §5 | 2000, Ziherl and Kamien: hard core, soft brush-like coat; entropy cost proportional to the wall area between cells; quote "favor area-minimizing structures, precisely the type of structures that dry foams might make" | sourced | "Soap froths and crystal structures", Phys. Rev. Lett. 85, 3528 (2000), https://arxiv.org/abs/cond-mat/0007256, full text read: "characterized by compact cores and brush-like, soft coronas"; "the brushes suffer an entropic penalty proportional to the interfacial area between the Voronoi cells surrounding each sphere. Thus they favor area-minimizing structures, precisely the type of structures that dry foams might make." Author's first name is printed "Primoz" on arXiv |
| 34 | §5 | 2010, Lee, Bluemle and Bates: a Frank-Kasper phase with 30 spheres per repeat in block copolymer melts | sourced | Science 330, 349-353 (2010), https://doi.org/10.1126/science.1195552, abstract via OpenAlex and the University of Minnesota record: "an equilibrium phase characterized by a large tetragonal unit cell containing 30 microphase-separated spheres. This structure, referred to as the sigma (σ) phase by Frank and Kasper ..." |
| 35 | §5 | 2019, Morgan Bates and colleagues: A15 in block copolymer melts | sourced | M. W. Bates, Lequieu, Barbon, Lewis, Delaney, Anastasaki, Hawker, Fredrickson, "Stability of the A15 phase in diblock copolymer melts", PNAS 116, 13194-13199 (2019), https://doi.org/10.1073/pnas.1900121116, abstract via OpenAlex: "we report that AB diblock copolymers can also self-assemble into a structure known as the A15 phase" |
| 36 | §5 | Hard spheres with no soft coat should crystallize as face-centered cubic; that lattice's foam costs 5.345, worse than Kelvin's | sourced + computed | Ziherl and Kamien: "it has been shown that the face-centered cubic (FCC) lattice maximizes the total entropy and so hard-sphere crystals should form FCC structures". FCC Voronoi foam: cells.js gives 3 · 2^(5/6) = 5.3454; Ziherl and Kamien print γ_FCC = 5.345 |

### Not on the page, checked while building

- Frank and Kasper's second paper (Acta Cryst. 12, 483, 1959) ends its abstract with "The
  relationship between alloy structures and inert gas hydrates is discussed."
- Kasper, Hagenmuller, Pouchard, Cros, Science 150, 1713 (1965): silicon clathrates Na8Si46
  and NaxSi136, "pentagonal dodecahedra with 14-face polyhedra in one case and with 16-face
  polyhedra in the other". The C15 census here gives 136 corners, 16 dodecahedra and 8
  sixteen-faced cells, matching the 136-water structure Pauling and Marsh attribute to
  Claussen ("136 water molecules ... 16 pentagonal dodecahedra and 8 hexakaidecahedra").
- Charvolin and Sadoc, J. Phys. France 49, 521 (1988), abstract: cubic micellar phases of
  amphiphiles in water are "similar to type I and II structures of water clathrates".
  Balagurusamy et al. call their phase "similar to that of the lyotropic Pm3̄n phase of
  biological lipids". The page does not mention surfactant or lipid micelles.

### Cut or changed from the brief

- Brief figure 1 asked for Z12, Z14, Z15 and Z16 shells. Z15 is not drawn: it needs a
  non-cubic structure (σ or Zr4Al3) and `cells.js` handles cubic repeats only. Z16 is built
  from C15 coordinates.
- Brief figure 3, a three-instance gallery, became Fig 4: one cube read as atoms at centers
  or water at corners, with the measured ice positions. Soft matter is prose only; a micelle
  picture would have been the "atoms" view again.
- Added Fig 1 (the gap) and Fig 3 (cell mix), which the brief's "keep frustration concrete"
  asks for in prose.
- The brief dates soft-matter Frank-Kasper phases to "Bates and co., ~2010 onward". A15 in
  dendrimer liquid crystals is 1997 (row 32); the 2010 Science paper is the σ phase, not A15
  (row 34); A15 in a diblock melt is 2019 (row 35).
- The plan's "Z12, Z14, Z15, Z16 only" is stated as "singled out four shells" (row 9).
- Pauling and Marsh print O-O-O angles of 106.1° to 114.8° on pentagons and 109.6° and
  125.2° on hexagons. Recomputing from their three-decimal coordinates gives 103.8° to
  125.2° over all angles, so the low end does not reproduce and no angle range is quoted.
- Surfactant and lipid micelles are left out: the sources above support a sentence, but
  nothing on the page computes it and the word budget was full.

## Claims: article 06, The Lattice Recipe (2026-10-10)

Computed rows come from `docs/foam/lib/06-lattice.js` (`FoamLattice`), which builds the Voronoi
cell of a lattice in 2, 3 or 4 dimensions by solving every n of the relevant bisecting planes and
keeping the solutions inside all the others, then measures faces of every dimension from the
corner-plane incidences. `FoamLattice.runChecks()` (54 checks, all pass in node and in the page)
tests it against closed forms, against `cells.js` on FCC and BCC, and checks every cell's volume
against the lattice determinant, which fails if a wall is missing. Run:
`node -e "require('./docs/foam/lib/06-lattice.js').runChecks().forEach(c=>console.log(c.ok,c.name,c.detail))"`.
Sourced rows were fetched and read on 2026-10-10.

#### Computed and derived

| claim | kind | how it is known |
|---|---|---|
| Each lattice gets two scores from one cell: packing density = volume of the largest inscribed ball over cell volume; wall cost = boundary over volume^((n-1)/n) | derived | The inscribed ball has radius half the shortest lattice vector, so balls of that radius at every point touch and do not overlap; density = V_n (d/2)^n / det. In 2D the page uses part 1's convention (half the perimeter over sqrt(area)); in 3D part 3's (area over volume^(2/3)); in 4D the same form, 3-area over 4-volume^(3/4) |
| Plane family (two equal steps at angle theta): 90 deg square, 60 deg triangular; discs cover 90.69% and wall cost 1.861 at 60 deg, both extremes of the family there; square 78.54% and 2.000 | computed | `bases.rhombic`, sampled 45 to 90 deg in 0.5 deg steps in the page; runChecks: triangular density pi/sqrt(12), half-perimeter cost 3/sqrt(3 sqrt(3)/2) = 1.8612, square pi/4 and 2. Fig 1 labels the sampled argmax and argmin (both 60) |
| Space family (three equal steps, every pair at angle alpha): 60 deg is FCC, 90 deg simple cubic, arccos(-1/3) = 109.47 deg BCC | computed | `bases.rhombohedral`; runChecks compares cost and density at the three angles with the FCC, SC and BCC closed forms to 1e-9 |
| FCC fills 74.05% (pi/sqrt(18)), wall cost 5.3454 (3 * 2^(5/6)); BCC 68.02% (pi sqrt(3)/8), 5.3147; simple cubic 52.36% (pi/6), 6.000 | computed | runChecks against the closed forms; agrees with `cells.js` on FCC and BCC to 1e-9 |
| Density has peaks at 60 and 109.47 deg with the FCC peak higher; wall cost has dips at both with the BCC dip deeper; simple cubic is the lowest density and highest cost between them | computed | Fig 2 curves, 50 to 114 deg in 0.25 deg steps plus the exact BCC angle; all 141 cells from 46 to 116 deg pass volume = det. FCC is a smooth local minimum on this family (5.34585, 5.34551, 5.34539, 5.34551, 5.34585 at 59 to 61 deg), consistent with Cesaroni and Novaga 2026a, Theorem 3.3 (local minimiser on the twelve-facet stratum, saddle overall) |
| The ball touches all 12 walls of the FCC cell, 8 of the 14 walls of the BCC cell (the six squares are not touched), 6 of 6 for the cube | computed | `kissing` and the `contact` flag on each wall (wall normal of least length); runChecks 'BCC cell: 24 corners, 36 edges, 14 faces, 8 touching', 'FCC cell: ... 12 touching'. That the six untouched BCC walls are the squares: part 3 (squares along the axes are the second-neighbour walls) |
| Weaire-Phelan with flat walls costs 5.297, below every lattice on the curve | computed | `FoamCells.equalVolumeA15().foam.s` = 5.29695 at runtime in Fig 2 (cells.js runChecks pass); least value on the curve is BCC's 5.3147 |
| FCC is the checkerboard lattice (integer points with even coordinate sum); its cell has 8 cube corners at distance sqrt(3)/2 = 0.866 and 6 tips at distance 1; 14 corners, 24 edges, 12 walls | computed | `bases.fcc` = (1,1,0),(1,0,1),(0,1,1) generates exactly the even-sum integer points; runChecks 'checkerboard cell in 3D: 6 tips at distance 1, 8 cube corners at sqrt(3)/2'. Fig 3 prints the counts and distances from the cell |
| D4 cell: 16 cube corners and 8 tips, all at distance 1; all edges of length 1; 24 corners, 96 edges, 96 triangles, 24 walls, each an octahedron (6 corners, 12 edges, 8 triangles) | computed | runChecks: f-vector 24,96,96,24 from the plane incidences; again from the corner set alone (pairs at distance 1: 96; mutually joined triples: 96); Euler 24-96+96-24 = 0; walls are octahedra; volume 2 = det D4. Fig 3 prints these at runtime |
| Half-diagonal of a unit cube is sqrt(n)/2: sqrt(3)/2 in 3D, 1 in 4D, equal to the tip distance only in 4D | derived | corner (1/2,...,1/2) has length sqrt(n)/2; tips are (1,0,...,0) |
| A turn of 4-space carries tips onto cube corners: the double rotation x -> q x with q = cos t + sin t (i+j+k)/sqrt 3 at t = 60 deg maps the 24 corners to themselves and every tip to a cube corner | computed | runChecks 'the double rotation by 60 degrees keeps the corner set and sends every cap to a cube corner'. Fig 3's readout counts rings holding a cube corner in 4D before projection: 0 of 8 at 0 to 59 deg, 8 of 8 at 60 |
| In 3D the cube's own edges are not edges of the cell; in 4D they are (32 of the 96) | computed | runChecks 'cube-to-cube edges: none of the 24 in 3D, 32 of the 96 in 4D' |
| Self-dual: the 24 nearest neighbours of a D4 point are the corners of another 24-cell, turned and scaled | computed | runChecks: the map (x1+x2, x1-x2, x3+x4, x3-x4), sqrt 2 times an orthogonal matrix, carries the 24 cell corners onto the 24 wall normals (the minimal vectors). Self-duality also in MathWorld (below) |
| In 4D the checkerboard lattice and the cube-corners-plus-centres lattice are the same lattice turned and scaled; in 3D they are FCC and BCC | computed | runChecks 'centred hypercubic lattice is D4 up to a similarity' (the same map sends the centred-cubic basis into D4 and the determinants match, 1/2 * 4 = 2), with equal cost and density |
| 24-cell wall cost: 24 octahedra of edge 1 (volume sqrt(2)/3 each) around 4-volume 2, so 8 sqrt 2 / 2^(3/4) = 2^(11/4) = 6.727 | derived, computed | octahedron of edge 1 is two square pyramids of height 1/sqrt 2; runChecks 'D4 cell boundary 8 sqrt 2', 'D4 cost 8 / 2^(1/4)', volume 2 |
| 4D cube costs 8; the A4* cell (the relative of Kelvin's cell) has 120 corners and 30 walls and costs 6.831; A4 costs 6.917 | computed | runChecks: '4D cube cost 8'; A4* f-vector 120,240,150,30 and cost equal to the permutohedron closed form (320 + 60 sqrt 6)/(125 sqrt 5)^(3/4) = 6.8311; A4 cell 30 corners, 20 walls, volume = det |
| "Kelvin's relative" and "A4": BCC is A3*, FCC is A3 | computed | runChecks 'A3* is BCC', 'A3 is FCC' (cost and density) |
| Of the four 4D lattices scored, D4 has both the densest packing (61.69% = pi^2/16) and the cheapest cell | computed | runChecks 'in 4D, D4 has both the highest density and the lowest cost of Z4, A4, A4*, D4': densities 0.3084, 0.5517, 0.4414, 0.6169; costs 8, 6.9175, 6.8311, 6.7272. Fig 4 picks the ringed dots by argmax and argmin at runtime |
| The 24-cell's walls meet three at a time at exactly 120 deg | computed | runChecks 'D4 walls all meet at 120 degrees' (angle between walls sharing a triangle). Three cells round each triangle then follows from 3 * 120 = 360 |
| Kelvin's flat cell fails the local test (its walls meet at 109.47 and 125.26 deg, never 120) | computed | runChecks 'BCC walls meet at 109.47 and 125.26 degrees'; stated in part 3 |

#### Sourced

| claim | kind | how it is known |
|---|---|---|
| Thue showed no arrangement of equal discs is denser than the triangular one (pi/sqrt(12)) | sourced | Cohn, "A conceptual breakthrough in sphere packing", arXiv:1611.01685 (ar5iv.labs.arxiv.org/html/1611.01685): "The two-dimensional problem was solved by Thue", density pi/sqrt(12) = 0.9068... No date is given there, so the page gives none |
| No equal-area partition of the plane has less wall than the hexagonal one | sourced | part 1 (Hales' honeycomb theorem, in the series ledger); restated in Cesaroni and Novaga 2023, Theorem 4.1 |
| Hales proved no packing of equal balls is denser than FCC's pi/sqrt(18); the paper appeared in 2005 | sourced | Cohn, same article: "The three-dimensional problem was solved by Hales", with Hales, "A proof of the Kepler conjecture", Annals of Mathematics 2005 in its references |
| FCC is "the pattern of a pyramid of stacked oranges" | derived | the (100) layers of FCC are square layers, each sitting in the hollows of the one below, which is the square-based pyramid stack |
| A 2006 conjecture of K. Bezdek: among convex cells that tile space by translation (parallelohedra) of a given volume, the regular truncated octahedron has the least surface area | sourced | Hales and Song, "The Truncated Octahedral Conjecture", arXiv:2609.00997 (arxiv.org/abs/2609.00997), abstract: confirms "a 2006 conjecture by K. Bezdek". Only the initial is given there, so the page says "K. Bezdek" |
| In September 2026 two preprints announced proofs: Cesaroni and Novaga; Hales and Song. Neither has yet appeared in a journal | sourced | arXiv:2609.02384, Cesaroni and Novaga, "The truncated octahedron minimizes surface area among parallelohedra of equal volume", submitted 2 Sep 2026, Theorem 1.1 (bound 3(1+2 sqrt 3)/4^(2/3) = 5.3147, equality only for the regular truncated octahedron); its introduction notes the independent proof by Hales and Song. arXiv:2609.00997, Hales and Song, submitted 1 Sep 2026, proof reduced to one inequality checked by an exact computer certificate. Neither arXiv page lists a journal reference on 2026-10-10. Not verified by me beyond reading the abstracts and introduction |
| That result would settle only the lattice (translation-tile) contest, not the Kelvin problem | sourced | arXiv:2609.02384: Theorem 1.1 "does not address arbitrary periodic equal-volume partitions, and hence does not solve the Kelvin problem" |
| Earlier local result (not quoted on the page, used to check Fig 2): BCC is a strict local minimiser of Voronoi-cell area among 3D lattices, FCC a saddle, simple cubic not stationary | sourced | arXiv:2603.27221, Cesaroni and Novaga, "Local minimality of the truncated octahedron for the isoperimetric problem on parallelohedra", 28 Mar 2026, Theorems 3.1, 3.3, 3.4. This is the second arXiv number named in LEDGER.md; it is three-dimensional only and says nothing about 4D |
| The Weaire-Phelan foam is not a lattice foam (two cell shapes) | sourced | part 4 and `cells.js` (8 cells per repeat of two kinds) |
| The 24-cell is the only regular solid in four dimensions with no direct counterpart in three; it is self-dual; 24 octahedral cells | sourced | MathWorld, "24-Cell" (mathworld.wolfram.com/24-Cell.html): "the unique regular convex polychoron which has no direct three-dimensional analog"; "The 24-cell is self-dual"; "composed of 24 octahedra"; its construction "evokes comparison with the rhombic dodecahedron" |
| The Voronoi cells of D4 are regular 24-cells | sourced, computed | Wikipedia, "24-cell": "The Voronoi cells of the D4 root lattice are regular 24-cells"; counts 24, 96, 96, 24 there match the computed ones. Regularity itself is not proved by the code, which checks equal edges, equal corner distances, octahedral walls, one dihedral angle and a symmetry mixing the two corner classes |
| D4 is the densest lattice packing known in four dimensions | sourced | Nebe and Sloane, table of densest packings known (math.rwth-aachen.de/~Gabriele.Nebe/LATTICES/density.html): dimension 4, D4, centre density 1/8 ("The entry gives the densest lattice known"); 1/8 times the ball volume pi^2/2 is the computed pi^2/16. I did not find a fetched source for the Korkine-Zolotareff proof that it is the best lattice, so the page says "known" |
| Whether any 4D packing beats D4 is open | sourced | Cohn, same article: the problem is solved in dimensions 1, 2, 3, 8, 24; D4 is "surely the best sphere packing in R^4" but unproved. A Sept 2026 preprint (arXiv:2609.25120) claiming the 4D case turned up in search; I did not read it and the page does not mention it |
| In 2023 Cesaroni and Novaga proved the flat 24-cell honeycomb minimises area inside every small enough ball; they suggest the 24-cell may solve the lattice-foam problem in 4D; not proved | sourced | arXiv:2302.07112, Cesaroni and Novaga, "Minimal periodic foams with equal cells", Feb 2023 (read via ar5iv.labs.arxiv.org/html/2302.07112). Proposition 4.2: "The 24-cell honeycomb is a minimizer for the perimeter in every ball" B_r(x), 0 < r < sqrt 2, using Taylor 1976 and Brakke 1991 on minimal cones; "This suggests that the 24-cell could be a solution to problem (1)" (least perimeter among lattice tilings); local minimality "is a necessary condition". Their follow-up arXiv:2407.07534 (Mathematika 2025), Proposition 5.4, repeats it with radius sqrt(2)/2; the two radii differ, so the page gives none |
| The least-wall partition is known only in the plane | sourced | arXiv:2302.07112: the explicit structure "has been solved only in dimension 2 by Hales, whereas it remains open in all the other cases" |

#### Cut or not claimed

- "D4 is the densest lattice packing in 4D" as a theorem (Korkine and Zolotareff): no primary or
  secondary source fetched this session states it, so the page says "densest lattice packing known".
- "FCC is the densest lattice packing (Gauss 1831)": not fetched; the page cites Hales' stronger
  result instead.
- Relaxed Weaire-Phelan 5.288 and relaxed Kelvin 5.306: not restated here; the page uses only the
  flat-wall 5.297 that `cells.js` computes.
- That the 24-cell honeycomb is conjectured optimal for the full 4D Kelvin problem: no source says
  so. The page reports the local-minimality theorem and the authors' suggestion for lattice foams.
- The series' locked plan says "packing and partition prefer different lattices" as a general
  statement. Computed here: true in 3D, false in 2D and, among Z4, A4, A4* and D4, false in 4D,
  where D4 wins both. The page says so.

## Claims: article 07, Foams in Motion (2026-10-10)

Computed rows come from `docs/foam/lib/07-coarsen.js` (`FoamCoarsen`), a two-dimensional foam
on a periodic box. Films are chains of straight segments; every node (junctions included) moves
at a speed proportional to the net pull of the segments on it plus the pressure of the bubbles
beside it; gas crosses each film at a rate D x length x pressure difference; the pressures are
solved each step so that every bubble fills the area of the gas it holds. Nothing in the update
refers to side counts or to 120 degrees. `FoamCoarsen.runChecks()` (12 checks, all pass in node)
tests it against known answers. Run:
`node -e "require('./docs/foam/lib/07-coarsen.js').runChecks().forEach(c=>console.log(c.ok,c.name,c.detail))"`
(also run by `node scripts/foam-test.mjs`). The 3,000-bubble run is
`node scripts/foam-07-coarsen-run.cjs` (about a minute). Page numbers were
read from the page in headless Chromium through `window.__foam`. Sourced rows were fetched and
read on 2026-10-10.

#### The model, and what was chosen

| item | kind | how it is known |
|---|---|---|
| Model: tension + pressure on a polyline mesh, gas leak proportional to pressure difference, film mobility M = 5 and permeability D = 1 (page settings), 4 segments on a film of typical length | choice | Chosen over a Potts model (lattice anisotropy, law only on average) and over a rule that moves nodes by their turning angle (which satisfies the law by construction, so measuring it would show nothing). Here the law has to emerge from force balance and the leak. |
| In the continuum this model obeys dA/dt = k (pi/3)(n - 6) with k = M D / (M + D) for any M/D | derived | Film motion changes a bubble's area at M [S - T], S = sum over walls of (p_i - p_j) L_ij, T = total turning of its walls (tension 1). The leak changes it at -D S. Equal rates give S = M T / (M + D), so dA/dt = -[M D / (M + D)] T, and T = 2 pi - n pi/3 when corners are at 120 degrees. M >> D is the soap-froth limit (films are arcs), D >> M is curvature flow. Checked on the lone bubble at M = 5 (runChecks 2 and 3); scratch runs at M = 2 and 20 with 12 segments per film were also within 1% (not saved). |
| Junction mobility: the 2x2 matrix (8M/9) sum a_q (n_q - nbar)(n_q - nbar)^T | derived | The one tuned ingredient. A junction owns half of each first segment. This is the mobility for which a junction whose films are off 120 degrees by small angles sweeps area out of each bubble at M times that bubble's excess corner turning, as the films beside it do; for equal segments of length l it is 4M / (3l). With the naive lumped value (M over half the three segment lengths) the junction contributes half of that, and the lone-bubble error in scratch runs was about three times larger at the same mesh (not saved). Comment in `geom()`. |
| T1 rule: a film still shrinking below 0.3 mesh lengths (about 7% of a typical film) flips, unless it borders a triangle. T2 rule: a bubble with three (or two) sides is removed below 0.6% of the mean area or when one of its films is that short; its gas goes to its neighbors | choice | Thresholds in `topology()`. Both events are counted when they happen; a flip reversed within 0.02 mean areas of time is uncounted. |

#### Computed and derived

| claim | kind | how it is known |
|---|---|---|
| The area a bubble loses through a wall is proportional to curvature times length, and for an arc that is the angle it turns through | derived | Force balance on an arc element gives pressure difference = tension x curvature (2D Laplace law); leak rate = permeability x length x pressure difference is the model's assumption, stated as such in the prose; arc length / radius = turning angle. |
| Corners turn pi/3 each, walls supply 2 pi - n pi/3 = (pi/3)(6 - n); dA/dt = (pi k / 3)(n - 6) | derived | In the page (section "Counting the turning"). `bubble(n)` computes the symmetric case; runChecks 1: corner turning + wall turning = 2 pi and curvature x length summed = (pi/3)(6 - n) for n = 2..12, worst error 1.8e-15. |
| Figure 2: symmetric n-sided bubble; n = 4 gives corners 240 degrees, walls +120 degrees (30 each, bulging out), dA/dt = -2.09 k; n = 6 straight; n = 9 walls -180 degrees (20 each, bulging in), +3.14 k | computed | `bubble(n)` at runtime; driven to n = 3, 6, 7, 9 in headless Chromium and read back. The lone simulated 4-sided bubble with frozen gas relaxes onto this arc: worst node off by under 0.001% of the radius, area drift 1e-12 (runChecks 4). |
| "The count works for any bubble whose corners sit at 120 degrees, however lopsided" | derived + computed | The argument uses only the total turning. In the 3,000-bubble froth (irregular bubbles) the mean measured rate by side count, in units of k pi/3: n = 3: -2.998, 4: -1.997, 5: -1.000, 6: -0.001, 7: 1.000, 8: 2.002, 9: 3.004, 10: 4.007, 11: 5.013, 12: 6.018. |
| A lone n-sided bubble shrinks or grows at the predicted rate | computed | runChecks 2: n = 3..9 at M = 5, D = 1: -2.6332 vs -2.6180, -1.7489 vs -1.7453, -0.8727 vs -0.8727, 0.0000 vs 0, 0.8732 vs 0.8727, 1.7486 vs 1.7453, 2.6208 vs 2.6180 (worst 0.6%). runChecks 3: error for n = 4 falls 0.20%, 0.07%, 0.01% at 3, 6, 12 segments per film. |
| "None of this was put into the foam of Figure 1"; corners are where three equal pulls balance | computed | The code has no reference to n or to 120 degrees (read `step()`, `geom()`); the junction is a node with three neighbors. The law's appearance is the measurement in Figure 3. |
| Figure 3 at load: 15,387 measurements, least-squares slope 1.000 per side, zero at 6.000 sides, rms scatter 0.014 | computed | Page, seed 1952, read from the readout and `__foam.fit()`. Each point is (polygon area at end - at start) / interval for a bubble that took part in no T1 or T2 in the interval (`Meter`). 3,000-bubble run: 196,441 measurements, slope 1.0002, zero 5.9999, r^2 0.99983, rms 0.0151, worst single point off by 0.36. runChecks froth (300 bubbles): slope 1.0000, zero 6.000, rms 0.013. |
| Scatter "comes from the finite mesh and is largest for bubbles about to vanish, such as the three-sided ones" | computed | 3,000-bubble run, rms residual by bubble area in mean areas: under 0.05: 0.061; 0.05 to 0.2: 0.021; 0.2 to 0.5: 0.013; 0.5 to 1: 0.010; 1 to 2: 0.013; over 2: 0.020. Page run: mean for n = 3 is -2.95 over 21 measurements. |
| Mean number of sides is exactly six in a foam with three-way junctions | derived + computed | Euler on the torus: V - E + F = 0 and 3V = 2E give E = 3F, mean sides 2E/F = 6. runChecks: V = 2F, E = 3F and mean sides 6 after 293 T1 and 182 T2; the page readout recomputes it every frame. Part 1's Figure 1 caption says the same. |
| "The only foam at rest is one in which every bubble has six sides" | derived + computed | From the law and mean six. runChecks 5: a 6 x 6 honeycomb has max area change 2e-16 over t = 0.5, no film moves, no events; wall cost 1.8612 matches Part 1. |
| T1: the two bubbles that shared the film are parted and the two at its ends become neighbors; one pair loses a side each, the other gains one | derived | `t1Flip()`: cl and cr lose a side, the end bubbles gain one; `audit()` recounts sides from the films and agrees. |
| T2: "In this simulation it gets there as a triangle ... its three neighbors each lose a side" | computed | Two-sided removals: 0 of 2,813 T2 in the 3,000-bubble run, 0 of 270 in the page run to 30 bubbles (`t2lens`). The code handles the two-sided case (neighbors lose two sides) but it did not occur. |
| Figure 1: 300 random bubbles, fast-forwarded to 100, stops at 30; reset replays the same foam | computed | Seed 1952, `mulberry32`; fixed step sequence, so the history does not depend on frame timing. State at 100 bubbles is identical across loads (time 2.539764 in the figure's units, 299 T1 and 200 T2 before the picture starts). From 100 to 30: 96 T1 (5 more undone at once), 70 T2, ending at time 9.06. |
| "Every such transfer shortens the total length of film"; Figure 4 film length only falls | derived + computed | dL/dt = sum_i p_i dA_i/dt = -D sum over walls L_ij (p_i - p_j)^2 <= 0 at equilibrium shapes. Page run: fell in all 149 sampled intervals to 30% of its start. 3,000-bubble run: rose in 0 of 177 intervals. runChecks: 0 of 93. |
| Total area and total gas conserved | computed | runChecks: area/box - 1 = 2e-16, gas/box - 1 = -1e-15 after 475 events; worst single bubble |area - gas| 0.0076 mean areas (just after a T2). |
| Mean bubble area grows in proportion to time once the start is forgotten | derived + computed | Dimensional: k is area per time and a self-similar foam has no other scale. 3,000-bubble run, d(mean area)/d(time) over successive doublings in the figure's units: 0.73, 0.99, 0.99, 1.06; straight-line r^2 0.99916 from mean area 4 on. Page run (300 bubbles): 0.76 at load rising to 1.00 by the end. runChecks 7 (1,200 bubbles, M = 2): 0.62, 1.04, 0.92. Lazar, MacPherson, Srolovitz (below) report the same for curvature flow from 25,000 grains: "grain size appears to grow linearly with time". |
| "About the pace of one seven-sided bubble" | computed | The rates above are in units in which a seven-sided bubble gains 1 per unit time. |
| The foam uses several percent less film than a honeycomb of as many equal cells in the same box | computed | L / (1.8612 N sqrt(mean area)): 3,000-bubble run 1.006 at the relaxed random start, then 0.943, 0.944, 0.938, 0.937 at successive doublings; page run between 0.928 and 0.967 from 100 to 30 bubbles, 0.936 at load (Figure 4 readout). No conflict with Hales, whose theorem is for equal areas. |
| Von Neumann's law in the MacPherson-Srolovitz notation: dA/dt = -2 pi M gamma (1 - n/6); "each corner cancels a sixth of a full turn" | sourced + derived | Stated in this form by Le and Du eq. (1.1) and Lazar et al. eq. (1); equals (pi/3) M gamma (n - 6). |
| "No number of faces plays the part of six" in 3D | derived | The 3D formula depends on mean width and edge lengths, which are not fixed by the number of faces. |
| Prose length | computed | About 1,095 words outside figures, captions, headings and subtitle. |

#### Sourced

| claim | kind | source |
|---|---|---|
| Von Neumann, 1952, written discussion, *Metal Interfaces* (American Society for Metals, Cleveland), pp. 108-110 | sourced | Two reference lists read: Lazar, MacPherson, Srolovitz, "A More Accurate Two-Dimensional Grain Growth Algorithm" (preprint dated 2 Sept 2009), ref. 11: "J. von Neumann, Written discussion, in: Metal Interfaces, American Society for Metals, Cleveland, Ohio, 1952, pp. 108-110", https://u.math.biu.ac.il/~lazarem/paper2D.pdf ; Le and Du (below), ref. 12: "Written discussion of grain shapes and other metallurgical applications of topology, Metal Interfaces, Am. Soc. Metals, Cleveland, 108-110, 1952". The original volume was not read. |
| The discussion was of a paper on grain shapes by Cyril Stanley Smith | sourced | Le and Du's title for the discussion (above); ASM International news, 9 Jan 2016: Smith's "Grain Shapes and Other Metallurgical Applications of Topology" "was originally published in Metal Interfaces in 1952" and was reprinted for researchers "who utilize and refer to von Neumann's Law", https://www.asminternational.org/smst/results/-/journal_content/56/10192/26134984/NEWS/ |
| Mullins, 1956 ("four years later"), same law for grains; boundary speed proportional to curvature | sourced | W. W. Mullins, "Two-dimensional motion of idealized grain boundaries", J. Appl. Phys. 27 (1956) 900-904, as cited in both reference lists above (paper itself not read). Sekerka and Paxton, obituary of Mullins, Physics Today, 1 Jan 2002: "his generalization to curved interfaces of John von Neumann's original n-6 rule for growth of bubbles ... in a two-dimensional soap froth"; "Bill showed that the time rate of change of area of a grain is proportional to n-6", https://physicstoday.aip.org/obituaries/william-wilson-mullins . Le and Du: "The Mullins equation states that the normal velocity of the domain walls satisfies v_n = M gamma K". |
| MacPherson and Srolovitz, Nature 446 (2007) 1053-1055; dV/dt = -2 pi M gamma (L(D) - (1/6) sum e_i(D)), L the mean width, e_i the lengths of the triple lines | sourced | Not read from the Nature paper (paywalled). Read from Le and Du, "A generalization of the three-dimensional MacPherson-Srolovitz formula", Commun. Math. Sci. 7 (2009) 511-520, eq. (1.2) with its definitions: "L(D) is the mean width of D, n is the number of triple lines (edges) of D, e_i(D) is the length of i-th triple line", faces meeting "at a fixed dihedral angle of 2 pi/3", https://projecteuclid.org/journals/communications-in-mathematical-sciences/volume-7/issue-2/A-generalization-of-the-three-dimensional-MacPherson-Srolovitz-formula/cms/1243443993.pdf . Same form (L minus one sixth of total triple-edge length) in Lazar, Mason, MacPherson, Srolovitz, "A More Accurate Three-Dimensional Grain Growth Algorithm", eq. (2), which calls mean width "a linear measure", https://u.math.biu.ac.il/~lazarem/paper3D.pdf . Bibliographic details: https://ideas.repec.org/a/nat/nature/v446y2007i7139d10.1038_nature05745.html |
| The 3D law is "for walls that move in proportion to their mean curvature" | sourced | Nature abstract (IDEAS page above): walls move "with a velocity proportional to their mean curvature"; Le and Du theorem 4.2. |
| T1 = exchange of neighbors, T2 = disappearance of a cell | sourced | Ohlenbusch, Aste, Dubertret, Rivier, "The topological structure of 2D disordered cellular systems" (arXiv cond-mat/9709227): "T1, exchange of neighbours"; "T2, disappearance (or apparition) of a triangular cell into a single vertex", https://ar5iv.labs.arxiv.org/html/cond-mat/9709227 |

#### Cut or not claimed

- Beer foam, which the brief's pitch ends on: cut. A glass of beer also drains and its films
  burst, and nothing fetched this session separates those from coarsening.
- The brief's third figure (two bubbles sharing a wall, gas flowing from the smaller) was
  replaced by the pick-n bubble of Figure 2, which carries the same pressure argument and also
  the derivation. A fourth figure (film length and mean area against time) was added because the
  article's thesis is about time.
- The date and place of the *Metal Interfaces* seminar: seen only in a search snippet, not on a
  page that could be fetched (HathiTrust returned 403), so left out.
- No experiment is cited for the law in real soap froths; nothing was fetched on that.
- "Gas leaks at a rate proportional to the pressure difference and the film's length" is the
  model's assumption (and von Neumann's), presented as the mechanism, not as a measured fact.
- On a slow device the fast-forward at load takes a few seconds (5,139 steps; about 1.2 s in
  headless Chromium on a heavily loaded machine).
