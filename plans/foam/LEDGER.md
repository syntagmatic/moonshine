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

## Enrichment 2026-10-13 (articles 01 to 07)

One agent per article audited the existing figures and added computed ones; the series went from 26 figures to 48. Each block below is that agent's ledger as written (merged from the per-agent `enrich-NN.md` files, now removed). The main session viewed every new figure at desktop width and reran `node scripts/foam-test.mjs` (320 checks) and the render check on all eight pages.

Rows earlier in this file that these blocks supersede:

- 03: the open checkboxes under "Article 03" in the pre-build checklist are answered by the 03 block (flat cost derived in the page, relaxed value computed, Thomson 1887 read in full).
- 04: the "published values, second-hand" row and the "extrapolating gives 5.28835" row. Kusner and Sullivan was opened (5.30628 and 5.28834 after converting their units), and the extrapolation is now Figure 5 of the page (5.28834 from the three finest meshes).
- 05: the Nb3Sn superconductivity row and the Brakke row no longer have a sentence on the page.
- 06: the helper now has 93 checks, not 54.
- 07: the honeycomb-ratio row ("several percent" is now "a few", measured 2 to 7 percent) and the prose-length row.

Cross-article agreement checked at merge: the relaxed Weaire-Phelan pressure difference is 0.332 film tension over cube edge in 04 (cost slope and force balance, `lib/04-measure.js`) and in 07 (mean width, `lib/07-law3d.js`), and the dodecahedron's rate is -0.437 k sigma L in both. In-page relaxed Kelvin values differ by mesh and each page names its mesh: 5.3063 on 18,432 triangles (03), 5.3064 on 4,608 (04 Figure 3), 5.3069 on 1,152 (05 Figure 5); 04 and 05 extrapolate to 5.30628 on finer meshes, and 03 sets its value beside the published 5.30628.

### 01 enrichment: The Honeycomb (commit 5cd0403)

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

#### Tried and dropped

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

### 02 enrichment: The Double Bubble (commit 001106f)

Page: `docs/foam/02-the-double-bubble.html`. Model code: `docs/foam/lib/02-bubbles.js`
(`FoamBubbles`), 26 rows in `runChecks()`, run by `node scripts/foam-test.mjs`. "Check:" below names
a `runChecks()` row. Every figure was driven headlessly through every control at 1200px and 390px,
light and dark, and with reduced motion (the page has no animation; every figure is direct
manipulation). Sources were fetched and read on 2026-10-13 unless marked otherwise.

Words: prose 649 before, 774 after; captions 118 before, 388 after (three figures before, six
after). The prose grew by the plane proof and the three-bubble section; the pressure and history
paragraphs were cut.

Sources opened:

- HMRR: Hutchings, Morgan, Ritoré, Ros, "Proof of the double bubble conjecture", Ann. of Math. 155
  (2002) 459-489, arXiv:math/0406017 (full text read: introduction and reference list).
- Hutchings's own page, https://math.berkeley.edu/~hutching/pub/db2ann/dbpictures.html (raw text).
- Foisy: Foisy, Alfaro, Brock, Hodges, Zimba, "The standard double soap bubble in R^2 uniquely
  minimizes perimeter", Pacific J. Math. 159 (1993) 47-59,
  https://msp.org/pjm/1993/159-1/pjm-v159-n1-p03-p.pdf (full text read).
- MN1: Milman and Neeman, "The structure of isoperimetric bubbles on R^n and S^n", arXiv:2205.09102
  (abstract page; journal reference Acta Math. 234 (1), 71-188, 2025).
- MN2: Milman and Neeman, "Plateau bubbles and the quintuple bubble theorem on S^n",
  arXiv:2307.08164 (abstract page; no journal reference listed on 2026-10-13).
- Morgan: F. Morgan, "Milman and Neeman post proof of triple and quadruple bubble conjectures in
  R^n and S^n", 11 June 2022, https://amathr.org/milman-and-neeman/ (full text read).
- Crossref record for doi:10.1515/crll.2004.011 (Wichiramala).

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Fig 1: square 1.128 and triangle 1.286 times the circle's perimeter at equal area | computed, was right | `planeRatio(n) = sqrt(n tan(pi/n) / pi)`: 1.1284, 1.2861. Check: "plane: square 1.128 and triangle 1.286 times the circle" | The figure now takes its numbers from the helper |
| Fig 2: surface over the sphere's at equal volume: icosahedron +6.5%, dodecahedron +9.8%, octahedron +18.3%, cube +24.1%, tetrahedron +49.0% | computed | `solids()` builds each solid from vertex coordinates, finds its faces as supporting planes and measures area and volume: 1.0646, 1.0984, 1.1826, 1.2407, 1.4900. Checks: "Platonic solids: face counts", "measured area ratios match the closed forms", "cube 24.07% and tetrahedron 49.00%" | Backs the old prose numbers (24%, "nearly 50%"), which are now in the figure instead of the prose |
| Fig 2: a cylinder twice as tall as wide spends 20.2% extra; no proportion gets under 14.5%, at height = diameter | derived + computed | Radius 1, height 2t: V = 2 pi t, A = 2 pi (1 + 2t), ratio 2 pi (1 + 2t) / ((36 pi)^(1/3) (2 pi t)^(2/3)). d/dt = 0 at t = 1, value (3/2)^(1/3) = 1.14471. t = 2 gives 1.20187. Check: "best cylinder is as tall as it is wide". Headless sweep of all 101 slider stops: minimum readout +14.5% at 1.00 | Slider is logarithmic, 0.25 to 4 diameters |
| Fig 2 caption: the best cylinder is "better than an octahedron, worse than a dodecahedron" | computed | 1.1447 against 1.1826 and 1.0984. The cylinder beats the cube for heights 0.439 to 2.474 diameters and the octahedron for 0.589 to 1.753; it never reaches the dodecahedron. Check: "cylinder beats the cube from 0.44 to 2.47 ..." | The bands are not quoted on the page |
| The sphere has the least surface of any solid of its volume; Hermann Schwarz proved it in 1884 | sourced | HMRR introduction: "Schwarz [S] proved that the round sphere is the least-perimeter way to enclose a given volume in R^3"; reference [S], Nachr. Ges. Wiss. Göttingen (1884) 1-13. Morgan: "In 1884 Hermann Schwarz proved ..." | New sentence |
| Fig 3: three films meet at 120 degrees at every setting; flat wall at equal volumes | derived | A film through the seam point (0, 1) with tangent at angle theta is the circle centered (tan theta, 0) of radius 1/abs(cos theta); the three films take theta = beta, beta + 120, beta + 240. beta = 30 gives cos 270 = 0, a flat wall | Same construction as the old figure |
| The wall bows into the larger bubble | computed, rechecked, was right | Check: "double bubble: the wall bows into the chamber that holds more" (23 angles, plane and space, contents from closed-form caps confirmed by quadrature to 6e-9). Headless: the drawn wall's midpoint is right of the seam for 70, 90, 95% in the right chamber, left for 5, 10, 30%, on it at 50%. Old page: wall midpoint x from -11.1 to +11.1 px, matching the exact apex. Hutchings's page: the wall "bulges out of the region with smaller volume into the region of larger volume" | The old ledger entry stands. A machine summary of Hutchings's page reversed this sentence; the raw text is as quoted |
| Wall curvature = small cap's curvature minus large cap's | derived + computed | Curvatures are abs(cos) of the three angles, and cos(b) + cos(b + 120) + cos(b + 240) = 0. Check: "double bubble: wall curvature is the difference of the cap curvatures". The bars in Fig 3 are drawn from the three radii separately | Unchanged claim; now shown by the bars |
| Fig 3 readout said "0.98 : 1" at the default, where the volumes are equal | wrong, fixed | The old page estimated volumes by summing over a 3-px grid; the estimate was off by up to 2% (0.98 for 1.000, 0.27 for 0.264, 0.78 for 0.773). Volumes are now closed-form spherical caps | Found by driving the old slider headlessly against the helper |
| Fig 3 slider "volume of right bubble" | wrong, fixed | The old slider moved the junction angle linearly from 13 to 47 degrees (volume ratio 0.26 to 3.79) and the picture kept the seam fixed, so the total volume changed with the slider. It now sets the right chamber's share of a fixed total volume, 5% to 95%, found by bisection. Check: "solveDouble returns the requested share and total volume 1" | Radii in the figure are in units where the total volume is 1 |
| Fig 4: the double bubble's film is 94.5% of two separate spheres at equal volumes (saving 5.5%) | derived + computed | Equal volumes: caps of radius R cut at R/2, so film = 2 (3 pi R^2) + (3/4) pi R^2 = 27 pi R^2 / 4 and each volume is 9 pi R^3 / 8; two spheres of that volume have 8 pi (27/32)^(2/3) R^2. Ratio 0.94494. Check: "equal volumes: flat wall, 27 pi R^2 / 4 of film, 5.51% under two spheres" | |
| Fig 4: saving 3.6% when one chamber holds a tenth; the saving is largest at equal volumes | computed | `solveDouble(3, 0.1)`: 1 - 0.96414 = 3.59%. Check: "the saving grows all the way to equal volumes" (2% to 50% in steps of 2%). At the slider's ends (5%) the saving is 2.6% | |
| Fig 4: one sphere holding all the gas has 20.6% less film than two separate spheres at equal volumes | derived | 2^(2/3) / 2 = 0.7937 | |
| "In space, the rivals that survived longest had one gas as a ring around the waist of the other" | sourced | HMRR introduction: for equal volumes a nonstandard minimizer "would have to consist of two spherical caps with a toroidal band between them"; Hutchings's page: "the inner region is a dumbbell (topologically a ball), and the outer region is topologically a solid torus", and a second type with one region in two components | |
| Fig 5: the plane rival (one region in two pieces on opposite sides of the other) balances: circular arcs, 120 degree corners, equal pressure in the two pieces | derived + computed | Each piece meets the middle region as in a standard double bubble, so the three circles through its two corners include the middle region's outer circle; by symmetry both outer arcs of the middle region lie on one circle. Checks: "split rival at equal areas: areas 1/4, 1/2, 1/4 and equal pressures in the two pieces", "all four corners meet at 120 degrees", "the drawn outline has the stated areas and perimeter" | Simulated nothing; closed form plus two nested bisections |
| Fig 5: it costs 15.3% more perimeter than the standard double bubble; two separate circles cost 11.5% more | computed | Total area 1, equal areas: rival 5.1864, standard 4.4966, two circles 5.0133. Ratios 1.1534 and 1.1149. In the plane the standard bubble saves 10.3% on two circles: (8 pi / 3 + sqrt 3) R against two circles of area (2 pi / 3 + sqrt 3 / 2) R^2 each. Check: "equal areas in the plane: 10.31% under two circles" | For split-region shares of 10% to 90% the balanced rival costs 7.1% to 25.4% more than the standard; it beats two circles only below a share of 22.6%. Check: "split rival exists and loses to the standard for split-region shares from 10% to 90%" |
| Fig 5: sliding a piece changes nothing until it touches the other, where four films meet | derived + computed | The piece and its wall turn rigidly about the center of the middle region's circle. Check: "sliding a piece round the middle circle keeps every area and the perimeter, and ends with the corners touching" (free arc 90.2 degrees at equal areas). Headless: readout identical at slide 0, 25, 50, 75, 100 | |
| Fig 5: moving gas between the pieces lowers the perimeter either way, down to the standard bubble's | computed | Check: "perimeter climbs from the standard value to a peak at the even split" (2% to 50%, mirror-symmetric; 1.00035 at a one-in-a-million split) and "slope of perimeter in area moved equals the pressure difference of the pieces". Headless: readout rises monotonically from 1.034 at 1% to 1.153 at 50% | The curve's two endpoints (0% and 100%) are set to 1 as the limit, not computed there |
| The plane proof: found in 1990 by five undergraduates at a Williams College summer program, published 1993 | sourced | Foisy acknowledgments: "Geometry Group of the Williams College SMALL Undergraduate Research Project, summer 1990 ... Professor Frank Morgan advised the group". HMRR: "proved by the 1990 Williams College 'SMALL' undergraduate research Geometry Group". Hutchings's page: "also undergraduates at the time" | |
| Its key step: an end piece can be moved along the film it sits on at no cost until it bumps into something, where four films meet | sourced | Foisy Lemma 2.4: an end component with two edges is reflected so that it travels along the adjoining arc; "the bubble cluster changes, but initially the perimeter and enclosed quantities of area remain constant"; it ends with "a new vertex with four edges leading to it", which "contradicts regularity" | The paper's other half (no trapped empty chambers, Prop. 2.8) is not described on the page; "key step" is my wording |
| A four-way crossing can always be shortened | derived + sourced | Of four directions at a point some adjacent pair is at most 90 degrees apart, and two films meeting at less than 120 degrees are shortened by a short shared stem. Foisy Regularity Theorem 1.3: a minimizer "consists of arcs of circles (or line segments) meeting in threes at angles of 120 degrees" | Part 1 says the same of a four-way crossing |
| "In space the films of a rival are not all pieces of spheres" | sourced | HMRR section 4 treats the pieces as constant-mean-curvature surfaces of revolution ("surfaces of Delaunay"). Morgan: a nonstandard minimizer adds "annular bands to a sphere ... Such bands cannot be spherical" | |
| 1995: Hass, Hutchings, Schlafly; "a two-parameter family of rivals and a computer search" | sourced | HMRR: "Any such bubble can be described by two parameters, and Hass and Schlafly [HS2] used a rigorous computer search of the parameter space"; reference [HHS] Electron. Res. Announc. AMS 1 (1995) 98-102 | "Twenty minutes on a 1995 PC" is unchanged from the 2026-09-27 ledger row |
| 2000, Annals 2002: Hutchings, Morgan, Ritoré, Ros, no computer; every rival left standing is unstable | sourced | HMRR title page (Annals 155 (2002) 459-489) and introduction: "a complete, computer-free proof ... using stability arguments, as announced in [HMRR]"; the larger region is connected and the smaller has at most two components, then instability. Hutchings's page: competitors "are unstable, i.e. they can be perturbed to decrease area while holding the volumes fixed". MN1 abstract: "confirmed in 2000" | Old wording "every conceivable non-standard double bubble is unstable" narrowed to the rivals earlier work had not excluded. Not regressed |
| "as moving gas does in Figure 5" | derived | The comparison is to the definition of unstable only. HMRR's own perturbations come from rotations about an axis orthogonal to the axis of symmetry, not from moving gas; the page does not say otherwise | |
| Fig 6: the standard triple bubble for any three areas, solved in the page | derived + computed | The symmetric cluster (straight walls, caps of radius sqrt 3 / 2 centered 1/2 out) mapped by z -> z / (1 - w z). The map keeps circles and angles, and keeps the three circles through each corner sharing a second point, which is what makes the curvatures at a corner sum to zero. Newton's method on the two numbers in w. Checks: "triple bubble solver: every area ratio from 1:1:3 to 8:8:3 is reached" (64 cases, share error under 1e-13), "corners at 120 degrees and walls curved by the pressure difference, at every ratio", "6:1:2: sampled outline areas match", "one bubble shrunk to nothing approaches the double bubble". Morgan: the general case is "obtained via conformal mapping" | The page does not claim the cluster is unique for its areas; I did not open Montesinos Amilibia (2001) |
| Fig 6: each wall's curvature equals the gap between its neighbors' pressures | computed | Pressures are read from the three outer arcs and wall curvatures from the three wall arcs, each as the circle through three mapped points; the bars are drawn from the wall arcs. Headless: every bar's two ends sit on rungs for 8 settings including 8:8:1 and 1:1:1 | |
| Fig 6: at 4 : 1 : 2 the cluster needs 83.7% of the perimeter of three separate circles | computed | Total area 1: 4.9481 against 5.9144. Pressures 2.12, 3.44, 2.71; wall curvatures 0.59, 1.32, 0.73. Equal areas give 82.7% | |
| Wichiramala proved the plane triple bubble in 2002 | sourced | Hutchings's page: "Update (2002): Wacharin Wichiramala has proved the triple bubble conjecture in R^2". MN1 abstract: the "triple-bubble conjecture on R^2" has been resolved. Crossref: "Proof of the planar triple bubble conjecture", J. reine angew. Math. 2004, pp. 1-49 | Paper itself not opened |
| Milman and Neeman, 2022: triple bubble in every dimension from three up, quadruple from four up; published 2025 | sourced | MN1 abstract: "the triple-bubble conjectures for n >= 3 and the quadruple-bubble conjectures for n >= 4"; submitted 18 May 2022; Acta Math. 234 (1), 71-188, 2025 | |
| A 2023 preprint of theirs adds five bubbles from dimension five | sourced | MN2 abstract: "we confirm the quintuple-bubble conjecture on S^n (n >= 5), and as a consequence, by approximation, also the quintuple-bubble conjecture on R^n (n >= 5) but without the uniqueness assertion". Submitted 16 July 2023, v3 28 Dec 2024, no journal reference on 2026-10-13 | Named as a preprint on the page. The page leaves out "without uniqueness" |
| One step of their proof moves volume between two pieces of a region | second-hand | Morgan's summary of MN1: every region is connected, "Otherwise the cluster would be unstable under a clever variation, which moves volume from one component of a region to another" | Morgan's account, not the paper's own text |
| Four bubbles in ordinary space were left open | sourced | MN1 covers four bubbles only for n >= 4 and says "all other cases are in general open"; MN2: the earlier approach "does not seem to allow extending these results further". A web search on 2026-10-13 found no later proof for four bubbles in R^3 | The page says "were left open", not "are open". Paolini and Tortorelli (Calc. Var. 59, 2020) settle four equal areas in the plane; not mentioned on the page |
| Old Figure 3, a torus-around-a-ball drawing | cut | It was an ellipse around a circle with no measurement, and the picture was wrong: the ball sat wholly inside the other region, a shell and not a ring. Replaced by Fig 5 | `plans/foam/PROMPT.md` and the index card still describe the old closing figure |
| Margin note "Three bubbles in space were only settled much later, and the general N-bubble problem is open" | cut | Replaced by the dated statements in the last section | |

#### Tried and dropped

- A number for the area of the real torus rival in space. HMRR, Hutchings's page and Morgan's
  summary give none, so the page gives none.
- One bubble inside the other as a third plane rival. Its perimeter is
  2 sqrt(pi) (sqrt(A1 + A2) + sqrt(min)), always more than two separate circles (34.6% over the
  standard at equal areas). True and dull; `chain().nested` still returns it.
- A third slider on Fig 5 for the area ratio. The numbers are in the table above; three sliders
  made the figure harder to read than the one fact it added.
- The plane's saving curve on Fig 4 (10.3% at equal areas). It doubled the lines without adding a
  step to the argument; the number is in this ledger.
- A curve of the cylinder's excess against its proportions. The moving dot on the shared axis
  shows the turn-around at height = diameter, and a second line chart would have repeated Fig 4's
  form.
- "For any three areas there is exactly one such cluster." Not sourced in this session.
- Lawlor's 2022 announcement of the equal-volume triple bubble in R^3. Only in Morgan's summary.

### 03 enrichment: Kelvin's Bubble (commit 8e6d686)

Page: `docs/foam/03-kelvins-bubble.html`. Helper: `docs/foam/lib/03-kelvin.js` (34 checks, run by
`node scripts/foam-test.mjs`). The page went from three figures to six. New: Figure 3 (soap film on
a cubic frame), Figure 4 (height maps of one hexagon and one square of the relaxed cell), Figure 6
(face shapes in Matzke's foam). Rebuilt: Figure 1 (now a truncation slider with a cost curve and a
fill curve), Figure 5 (was Figure 3; the relaxed value is now computed). Figure 2 is unchanged
apart from its caption.

Sources opened in this session:

- **Thomson 1887.** Sir William Thomson, "On the Division of Space with Minimum Partitional Area",
  Acta Mathematica 11 (1887-88) 121-134, the reprint of Phil. Mag. 24 (1887) 503. Read in full from
  `https://archive.ymsc.tsinghua.edu.cn/pacm_download/117/4870-11511_2007_Article_BF02612322.pdf`
  (scanned, OCR text layer; section numbers below are his).
- **Raj 2011.** S. V. Raj, "Microstructural characterization of metal foams: an examination of the
  applicability of the theoretical models for modeling foams", Mater. Sci. Eng. A 528 (2011)
  5289-5295, with its corrigendum, NASA copy
  `https://ntrs.nasa.gov/api/citations/20110016161/downloads/20110016161.pdf`. Tables 1 and 4.
- **de Almeida slides.** Rita de Almeida, lecture 3 of a foams school hosted at Trinity College
  Dublin, `https://www.maths.tcd.ie/~foams/PRESENTATIONS/Tuesday10/Tuesday10_Lecture3_RitaDeAlmeida.pdf`,
  slides 13 and 14.
- **Boulder handout.** "The Physics of Foam", structure lecture,
  `https://boulderschool.yale.edu/sites/default/files/files/%5B2%5Dstructure.pdf`, slides 5 and 11.
- Crossref record for Taylor 1976 (doi:10.2307/1970949).

Matzke's own paper (Am. J. Bot. 33 (1946) 58-80) was not reached.

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Intro: no flat-faced cell obeys the soap-film rules | sourced | Thomson 1887 section 3: the rhombic dodecahedron has every angle of meeting 120 degrees and fills space, and "certain it is that no other plane-sided polyhedron can be a solution"; section 4: its four-edged ("tetrahedral") corners are "essentially unstable" | Thomson asserts the uniqueness, he does not prove it. The page states it without the proof |
| The cut is a third of the way along each edge; 14 faces, 36 edges, 24 corners | derived | `family(1/3)`: both hexagon side lengths equal 1. 24 corners in the helper's topology; 6 x 4 + 8 x 6 = 72 face sides = 2 x 36 edges. Thomson section 10: "the 36 edges" | |
| Edge 1: six unit squares, eight hexagons of area 3 sqrt 3 / 2, volume 8 sqrt 2, so 5.315 | derived, computed | Octahedron of edge 3 has volume 9 sqrt 2; six corner pyramids of edge 1 remove 6 x sqrt 2 / 6. Checks "03 Kelvin cell: unit edges...", "03 family at depth 1/3 costs..." and "...matches the BCC cell of cells.js" (5.3147397) | Was already on the page as a bare formula |
| Fig 1 cost curve | derived, computed | Octahedron edge 3, depth d = share of each edge cut from each end: square area 9 d^2, hexagon area (9 sqrt 3 / 4)(1 - 3 d^2), volume 9 sqrt 2 (1 - 3 d^3). Check "03 family: area and volume formulas match the polyhedron built from its corners" at six depths; ends match the octahedron (5.7191) and cuboctahedron (5.3436) closed forms | |
| Fig 1 fill curve: share of space filled by copies at cube corners and centers, as large as fit | derived, computed | Tip at distance 1. Copies on a BCC lattice of cube edge a are disjoint when neither (a/2, 0, 0) nor (a/4, a/4, a/4) is inside the solid, so a = max(2(1 - d), 4/3); fill = (4/3 - 4 d^3) / (a^3 / 2). Check "03 fill formula agrees with a sampled count and the copies never overlap" (20,000 Halton points at four depths) | Octahedra 33.3%, Kelvin 100%, cuboctahedra 45/64 = 70.3% |
| Only the cut at one third fills space | computed | fill = 1 only at d = 1/3 (check "03 fill is 1 at depth 1/3 and below 1 elsewhere") | Shown for this one lattice, which is what the caption says. The general fact (a cell that tiles by translation needs centrally symmetric faces) is not claimed on the page |
| The roundest cut is where all 14 faces touch one ball; it costs 5.250 and its copies leave 13% of space empty | derived, computed | d(ln A - (2/3) ln V)/dd = 0 reduces to d = 1 - 1/sqrt 3 = 0.42265 (the d^3 terms cancel). There the squares sit at distance 1 - d = 1/sqrt 3 from the center, the same as the hexagons. Cost 5.24987, fill 0.8702. Checks "03 the cheapest cut is at depth 1 - 1/sqrt 3", "03 at that depth all 14 faces are the same distance from the center" | 5.250 is below Weaire-Phelan's 5.288. It is not a foam cost, because the solid does not fill space; the caption says so |
| Taylor proved in 1976 that Plateau's laws are the only stable possibilities | from memory | Crossref confirms the paper: Jean E. Taylor, "The Structure of Singularities in Soap-Bubble-Like and Soap-Film-Like Minimal Surfaces", Annals of Mathematics 103 (1976) 489, doi:10.2307/1970949. The paper was not read | Sentence unchanged from the old page; the bibliographic record is sourced, the statement of the theorem is from memory |
| Fig 2 caption: flat faces meet at 109.47 and 125.26 degrees, flat edges at 90 and 120 | computed | `junctionAngles()` on the flat BCC foam. Check "03 flat Kelvin corners: edges meet at 90 (x2) and 120 (x4) degrees"; evolver.js check for the wall angles | The old caption said the flat cell "breaks both" rules but gave only the wall angles. Edge angles added |
| Rhombic dodecahedron: fills space, twelve flat faces, every wall angle 120, cost 5.345 | computed, sourced | `foam(sites.fcc())`: s = 3 x 2^(5/6) = 5.3454. Check "03 rhombic dodecahedron foam: every wall angle is 120 degrees". Thomson section 3. Boulder handout slide 5 lists "FCC: 5.34539" | |
| At six of its corners eight edges and twelve films meet | computed, sourced | Check "03 rhombic dodecahedron foam: corners with 4 edges and corners with 8" (per repeat of four cells: 8 corners with four edges, 4 with eight). Thomson section 4 footnote: "six tetrahedral angles and eight trihedral angles"; "twelve plane films meeting in a point (as twelve planes from the twelve edges of a cube meeting in the centre of the cube)" | |
| "Thomson began with a simpler cell" | sourced | Thomson section 3: "Hence it might seem that the rhombic dodecahedron is the solution of our problem" | |
| Plateau dipped a cubic wire frame and the film opened a small square in the middle | second-hand | Thomson section 4, citing Plateau, Statique des Liquides, vol. i, section 182, fig. 71: "twelve films, of which eight are slightly curved and four are plane, stretched from the twelve edges to a small central plane quadrilateral film" | Plateau's book was not opened |
| Fig 3: at rest a flat square 0.185 of the frame edge across, four flat triangles, eight bent films, on 1,408 triangles | computed | `frame(8, 0.19).step(400)`: side 0.1850, square and triangles off their planes by 3e-5, the eight others by 0.017 of the frame edge. Check "03 frame: the square and the four triangles stay flat, the eight other films bend". Thomson section 4 says the same of the real film, and corrects Plateau, who called all twelve slightly curved | Finer meshes: 5,632 triangles give side 0.1859, 22,528 give 0.1861. No published value for the size was found, so there is nothing to set beside it |
| Shut, the area is 4.2426 | derived | Twelve triangles of base 1 and height sqrt 2 / 2: 3 sqrt 2 = 4.24264 | |
| Every size up to 0.28 has less area; at rest 0.07% less | computed | Corners held at side 0.01 to 0.32 and the rest relaxed 150 steps: area minus 3 sqrt 2 is -3.2e-4 at 0.28 and +3.5e-4 at 0.29. At rest 4.239677, 0.0699% below. Checks "03 frame: let go...", "03 frame: held at side 0.1 the film is below the cone, at 0.3 above it" | Finer meshes: 4.239596 (5,632 triangles), 4.239573 (22,528), about 0.072% below in the limit |
| Dashed curve in Fig 3: with flat films opening would save almost nothing | derived | Flat films: t^2 + 2(1 + t) sqrt((1 - t)^2 + 1) + sqrt 2 (1 - t). Slope 0 and second derivative -0.121 at t = 0; lowest at t = 0.073, 0.0026% below 3 sqrt 2. Check "03 frame: flat films with a square of side 0.1 match the closed form" | Chart label only; the sentence was cut from the caption |
| The square's corners approach 109.47 degrees | computed | `cornerAngle()` estimate 107.1, 107.8, 108.6 degrees at 1,408, 5,632 and 22,528 triangles. Thomson section 4: "four angles each of 109 28'" | Not stated on the page; kept as a check on the relaxer |
| Thomson blew on the square until it shut and a new one opened facing another way | sourced | Thomson section 5: "the quadrilateral contracts to a line, and the twelve films meeting in it immediately draw out a fresh little quadrilateral film similar to the former, but in a plane perpendicular to its plane"; "may be fallen from in three different ways" | The button plays the held states down to zero, turns the axis, and plays them back up |
| Thomson let every such corner open the same way, then squeezed the foam until it pulled equally in all directions; out came six equal squares and eight hexagons | sourced | Thomson sections 6 to 10: the small squares all perpendicular to one "determining force"; cells with two small and four large plane quadrilaterals and eight non-plane hexagons; the cage shrunk along one axis until the pulls are equal; "the pair of small quadrilaterals must have become enlarged to equality with the two pairs of large ones" | The printed shrink ratios are garbled in the OCR and are not quoted |
| Squares stay flat with edges bowed outward; hexagons keep six corners and three long diagonals in one plane; sectors rise and fall in turn | sourced, computed | Thomson sections 10, 11, 13 ("Fill up ... the three sectors of 60 degrees ... Hollow out symmetrically the other three"). Checks "03 relaxed square stays flat", "03 hexagon edges rise and dip in turn" | The old page called the hexagons "saddles"; they have three rises and three dips |
| Fig 4: hexagon rises and dips 2.7% of an edge length | computed | `faceMap` on the four meshes: 2.62, 2.70, 2.69, 2.67% (288 to 18,432 triangles). In cube edges 0.0094, as article 04's ledger has it | |
| Fig 4: square stays in its plane; its edges bow out 3.3% of their length | computed | Off-plane under 0.01% of an edge on every mesh. Bow 3.21, 3.30, 3.29, 3.26%. Check "03 the same edge seen from the square and from the hexagon has moved the same distance" | |
| Thomson's 1887 formula ends about 6% high | sourced, computed | Thomson section 17, eq. (10): z = 0.03626 r^3 cos 3 phi - 0.001561 r^9 cos 9 phi with the apothem as unit. Check "03 Thomson formula at r = 1 gives his sagitta 0.0245" (his eq. 14). Against the mesh at the edge: 7.9, 4.8, 5.2, 6.0% high on the four meshes; 7 to 8% high along the middle of the line on the finest | The page reports its own mesh. Thomson knew his formula was a little steep: section 19 gives its slope at the edge as 5 deg 25' against the exact 5 deg 16'. His linearised edge condition is least accurate at the corners, where the surface tilts 10 deg 44' |
| Each square grows 9%, each hexagon shrinks 3%, the total falls 0.16% | computed | Finest mesh: square +9.0%, hexagon -2.8%, six squares plus eight hexagons -0.158%. Check "03 squares grow and hexagons shrink" | Replaces "a gain of roughly two parts in a thousand" |
| Fig 5: relaxed value 5.3063 computed in the page | computed | 18,432 triangles, 200 steps: 5.306317. Coarser meshes 5.308741, 5.306900, 5.306431. Check "03 three meshes extrapolate to 5.3062 to 5.3064" (limit 5.30627) | The old Figure 3 quoted this value. A refinement panel was built and removed, because article 04's new Figure 5 is that chart |
| Published 5.30628 (Kelvin) and 5.28834 (Weaire-Phelan) | second-hand | Boulder handout slide 5, opened this session: "BCC/Kelvin: 5.30628". 5.28834 is taken from the article 04 ledger row (Kusner and Sullivan 1996, via the same handout); the handout's text layer does not show it | Kusner and Sullivan's paper was not read |
| Matzke 1946: foam built one equal bubble at a time with a syringe; 600 interior bubbles examined under a microscope; none a Kelvin cell; 13.70 faces on average | second-hand | de Almeida slides 13 and 14: "Using a serynge put thousands of monodisperse or bidisperse bubbles by hand. Using a binocular stereoscope observed and measured the system"; "600 bubbles in the bulk: <f>~13.70 ... No Kelvin cell". Boulder handout slide 11: "Matzke result <f>=13.70". Year and pages from Raj's reference 20 | The slides date the paper 1945; volume 33 is 1946 |
| Matzke: 11% four-sided, 67% five-sided, 22% six-sided faces | second-hand | Raj 2011, Tables 1 and 4: "Central: n4 = 11%; n5 = 67%; n6 = 22% 13.7 (central)" | Whole percentages, which is all Raj prints. The same table's rows for Kelvin (43, 0, 57) and Weaire-Phelan (0, 89, 11) agree with the page's own counts |
| Fig 6: Kelvin 43% squares, 57% hexagons, 14 faces; Weaire-Phelan 89% pentagons, 11% hexagons, 13.5 faces | computed | `faceMix`: 6/14 and 8/14; 96/108 and 12/108. Checks "03 Kelvin: 6/14 squares...", "03 Weaire-Phelan: 96/108 pentagons..." | |
| Last paragraph: a dodecahedron and a fourteen-faced cell whose faces are pentagons but for a few hexagons; 5.288; 0.3% less | existing rows | Article 04 ledger. 89% pentagons from the row above | Shortened; Surface Evolver and the six-to-two ratio are in article 04 |

#### Existing claims checked and changed

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Old Fig 3 caption: "the two relaxed values are Surface Evolver results" | changed | The Kelvin value is now relaxed in the page and labelled computed; published values are open diamonds | |
| "a gain of roughly two parts in a thousand" | imprecise, fixed | (5.31474 - 5.30632) / 5.31474 = 0.158% | Now "0.16 percent" |
| "the hexagons warp into gentle non-planar saddles" | imprecise, fixed | Three rises and three dips, not a two-way saddle (Thomson section 13; Fig 4) | |
| Fig 2 caption | incomplete, fixed | See the row above | |
| "In 1887 William Thomson, later Lord Kelvin" | kept | Acta reprint is signed "Sir William Thomson" | Not regressed |

The three old figures were driven headlessly at 1100 and 390 px, light and dark, before the
rewrite. No drawing or number in them was wrong.

#### Tried and dropped

- Matzke's distribution of faces per bubble (how many bubbles had 11 to 18 faces): no source that
  reproduces his table could be opened, so only the three face-shape percentages are drawn.
- A chart of single-cell quotients against the sphere: article 02's new Figure 2 is that chart.
- A mesh-refinement panel under Figure 5 (cost against triangle count, extrapolated): built, then
  removed when article 04's new Figure 5 turned out to be the same chart.
- Extending the truncation past the cuboctahedron to the cube: it needs a second lattice for the
  fill curve and adds nothing to the argument.
- Rebuilding Figure 2 from measured angles: article 04's Figure 4 already histograms them.
- The flat-film family as the whole of Figure 3: it saves 0.0026%, too little to see. It stays as
  the dashed reference curve.
- A 3D view of the bent cell: article 04's Figure 3 has it.

#### For the shared files

- `plans/foam/PROMPT.md` article 3 and the index card describe three figures; the page now has six.
- `plans/foam/LEDGER.md` open items for article 03 (tetrahedral angle, which value is relaxed,
  Taylor, which faces curve) are answered by the rows above.
- `tests/foam.html` does not load `03-kelvin.js`.

### 04 enrichment: The Counterexample (commit 1755d97)

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

#### Tried and dropped

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

#### Words

Visible words in the article (prose, headings, captions, control labels): 1,228 before,
1,728 after. Prose and headings 869 to 1,165; captions 329 to 527. Figures 5 to 8.

### 05 enrichment: Why It Recurs (commit 340c92a)

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

#### Claims

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

#### Audit of the existing page (cold, against CRITIQUE.md)

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

#### Tried and dropped

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

#### Notes for the series

- `plans/foam/PROMPT.md`, article 5, should now mention: the 15 shell, the six-ringed
  bonds drawn for three crystals against the needed 10.4 percent, relaxed cost against
  how unequal the cells are (C15 relaxed at equal volume costs more than Kelvin), and
  the soft-sphere diagram computed from the series' cells.
- With a forced theme (`localStorage['moonshine-theme']`), pages opened as `file://` do
  not get `style.css`'s dark rules in Chromium, because `motion.js` cannot read the
  rules of a file stylesheet. Over http it works. Not specific to this page.

### 06 enrichment: The Lattice Recipe (commit 06be9c0)

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

#### Tried and dropped

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

#### For the shared files

- `plans/foam/PROMPT.md`, article 6: add the three figures (four scores ranked per dimension;
  junction test of the flat foams with the hypercube corner; random deformations showing FCC
  and A4 as saddles and BCC, A4* and D4 as bowls).
- `LEDGER.md`: the count "54 checks" for `06-lattice.js` is now 93.

### 07 enrichment: Foams in Motion (commit f6735d7)

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

#### Audit against CRITIQUE.md, briefly

Read cold, the 2026-10-10 page was sound: every number sampled matched the ledger or the page,
the simulation has no side counts or angles in its rules (`step()`, `geom()` and `topology()`
read again), every control worked at both widths, in dark mode and with reduced motion, and
there were no console errors. Findings, all fixed above: the Figure 4 (now 6) readout disagreed
with Figure 1 about the number of bubbles; "several percent" overstated the margin at the end
of the run; two sections ("Why it never settles" and the third dimension) asserted their
points with no figure; a handful of sentences were slogans.

#### Tried and dropped

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

#### For the shared files (not edited by me)

- `plans/foam/PROMPT.md`, article 7: the description should gain the three figures (one
  bubble's history with its side count; a honeycomb with one film removed against one bubble
  doubled; the three-dimensional law evaluated on Kelvin's and the Weaire-Phelan cells across
  volume ratios) and drop "a third tracks mean bubble area" as the last figure.
- `docs/foam/index.html` card for article 7, if it lists figures.
- `plans/foam/LEDGER.md`, article 07 rows to amend when merging: the honeycomb-ratio row
  (0.928 to 0.978, 0.944 at load), the prose-length row, and the check count (15 in
  `07-coarsen.js`, 7 in `07-law3d.js`).
