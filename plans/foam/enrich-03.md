# Enrichment ledger: foam 03, Kelvin's Bubble (2026-10-13)

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

## Existing claims checked and changed

| claim | verdict | source or derivation | note |
|---|---|---|---|
| Old Fig 3 caption: "the two relaxed values are Surface Evolver results" | changed | The Kelvin value is now relaxed in the page and labelled computed; published values are open diamonds | |
| "a gain of roughly two parts in a thousand" | imprecise, fixed | (5.31474 - 5.30632) / 5.31474 = 0.158% | Now "0.16 percent" |
| "the hexagons warp into gentle non-planar saddles" | imprecise, fixed | Three rises and three dips, not a two-way saddle (Thomson section 13; Fig 4) | |
| Fig 2 caption | incomplete, fixed | See the row above | |
| "In 1887 William Thomson, later Lord Kelvin" | kept | Acta reprint is signed "Sir William Thomson" | Not regressed |

The three old figures were driven headlessly at 1100 and 390 px, light and dark, before the
rewrite. No drawing or number in them was wrong.

## Tried and dropped

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

## For the shared files

- `plans/foam/PROMPT.md` article 3 and the index card describe three figures; the page now has six.
- `plans/foam/LEDGER.md` open items for article 03 (tetrahedral angle, which value is relaxed,
  Taylor, which faces curve) are answered by the rows above.
- `tests/foam.html` does not load `03-kelvin.js`.
