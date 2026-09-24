# Geometry group review: exceptional-atlas, atlas-of-atlases, parallel-coordinates, quasicrystals

Scores are S F C Fit (1-5 each): Substance, Figures, Craft, Fit.

## Who should own which topic

| Topic | Owner | Who else covers it now (and what to do) |
|---|---|---|
| Lie algebra to root system to Dynkin classification | exceptional-atlas 01-07 | type-systems/12-root-systems, mathematical-diagrams/08-dynkin, 16-coxeter. Cut their duplication or link to EA. |
| McKay correspondence | EA 07b | modular-forms/16-the-monster-and-mckay, mathematical-diagrams/09-quiver, PC-17 closing paragraph |
| E8 roots, Gosset 4_21, Coxeter plane, golden fold H4+phiH4, ten 24-cells | EA 13 | PC-14, PC-15, PC-16 (the best E8 figure in the gallery), EA-10b, PC-23 |
| E8 lattice, theta = E4, Leech, Golay, Construction A | EA 14 | modular-forms/17-lattices-e8-and-leech, PC-15, PC-21 |
| Monster / j-coefficients | modular-forms | EA-15, PC-15 fig 6, atlas-of-atlases 02 |
| Cut-and-project, Penrose, Fibonacci, phasons, diffraction | quasicrystals | PC-17 (a whole parallel treatment), EA-15 fig 1 (E8 cut-and-project), PC-23 connection 1 |
| Cayley graphs / permutohedron | none (off-thesis) | PC-18, PC-19, PC-22, mathematical-diagrams |

---

## exceptional-atlas (17 pages, about 37k words, all dated 2026-04-17/19)

| Article | S F C Fit | Verdict | Reason |
|---|---|---|---|
| 01 Lie algebras & symmetry | 3 3 3 2 | MERGE -> 02 | Competent textbook definition chapter (sl2 bracket calculator, so(3) = cross product). Humphreys ch.1 with widgets; nothing non-obvious. |
| 02 Cartan, Killing, roots | 3 3 3 3 | FIX | Clear sl3 root-space figure. The positive-definiteness "proof" is wrong: "positive diagonal, integer off-diagonals, therefore positive definite by a linear-algebra lemma" is not a valid argument. |
| 03 sl2 ladders & Weyl | 4 4 3 4 | KEEP | The E8 reflection (126 fixed / 114 moved) and orbit-growth figures really compute this, via lib/e8-math.js reflect/orbit. Fix "a few dozen reflections" to 120, the length of the longest element. |
| 04 Crystallographic restriction | 3 3 3 2 | MERGE -> 05 | One idea (4cos²θ in {0,1,2,3}) spread over 1.2k words. Says the "more negative" Cartan integer comes from the longer root; 05 says the shorter one. |
| 05 Simple roots & Dynkin | 3 4 3 3 | FIX | Good E8 node-deletion and coefficient explorer. Absorb 04 and 06. |
| 06 Classical families | 2 2 3 2 | MERGE -> 05 | A table recital of A/B/C/D with a rank slider. |
| 07 Pruning & Diophantine | 4 4 3 4 | KEEP | The real argument (tree and valency proofs, 1/p+1/q+1/r>1, Borel-de Siebenthal on affine E8, with a correct list). Fix "E8 is the largest in the ADE family" and the garbled enumeration table. |
| 07b McKay correspondence | 3 3 3 2 | FIX | Right story. "Every a_ij is in {0,1}" is false for Z/2 (affine A1 has a double edge). Overlaps modular-forms/16 and mathematical-diagrams/09. |
| 08 Normed division algebras | 1 2 1 3 | CUT | Gamified "Mission" widgets. Treats i, j, k as "90° rotations" (wrong). "Additive property of angles is the foundation of algebraic geometry." Leaves raw $...$ LaTeX in prose. |
| 09 Fano, non-assoc, S7 | 3 3 2 3 | FIX (absorb 10) | The Fano table and Moufang verifier are fine, and the octonion split of 240 = 2+126+112 checks out. Drop the "Mission" games (zero-divisor minefield, S7 navigator). |
| 10 Triality, G2, magic square | 1 1 1 3 | CUT (salvage magic square -> 09) | The "Triality Balancer" is fake: it only checks θ_R = θ_V + θ_L and prints "PERFECT TRIALITY!". The 78-triad count 18+18+42 = dim E6 is hardcoded numerology ("from Wilson's analysis"). Says E6 is the isometry group of OP² (it is F4, which 11 corrects). Says "10D spacetime (8 space + 2 time)". The "Cayley plane intersection hunt" is decorative. |
| 10b Icosahedron to E8 (Clifford) | 2 3 2 2 | MERGE -> 13 (H3->H4 part only) | The central claim is false. The 120 even plus 120 odd pinors in Cl(3) with the Euclidean norm form two orthogonal copies of H4, not E8, and it contradicts its own Fig 7 (φ-scaled shells). Also says "only the icosahedral column gives an exceptional terminal", but F4 is on its list. The H3->H4 pair-product figure (465 pairs -> 120) is real and worth keeping. |
| 11 F4 and E6 | 3 3 3 3 | FIX | The 27-lines graph is good. "E6 is the smallest algebra containing the SM with right fermion content" is wrong (SU(5)). "Three 27s, same object" overclaims. |
| 12 E7, E8, end of series | 2 2 3 1 | MERGE -> 07 | Repeats 07's (6,3,2)/E9 argument. Calls the fake monster Lie algebra "hyperbolic Kac-Moody" (it is a Borcherds/generalized KM algebra). |
| 13 240 roots, Gosset, Coxeter | 4 4 2 4 | FIX (trim by half, own E8) | The figures really compute (Coxeter-plane basis from the null space, subsystem deletion, slices 14+64+84+64+14). But it runs 5.7k words with an 18-mode "Figure 0". Says "30 ... is the same as the number of rings" (there are 8 rings of 30). Should absorb PC-16's fold scrubber and drop its own duplicate. |
| 14 Packing & Leech | 4 3 3 4 | FIX | The strongest prose (Construction A count 224+16, Viazovska toy LP). Errors: the kissing table claims the LP bound is tight in d=3 and d=4 (it is not: 13.16 in 3D, and Musin needed an extension in 4D). Construction A on Golay "194,352 minimal vectors" (it is 48). Co2/Co3 are stabilisers of type-2/3 vectors, not type-4/6. Owns this topic over modular-forms/17. |
| 15 E8 out in the world | 2 2 1 2 | CUT | Capstone recap with "By the numbers" KPI tiles and "Where you stand" grand summary. Stale: says octonions were "deliberately left out", though 08-10 cover them, and says "fourteen explainers". Move its E8 cut-and-project figure to quasicrystals. |
| index | - | FIX | Says "Seventeen explainers" while pages say "Part N of 15". CDN-style marketing lede ("bizarre objects... physics of the universe"). |

**Series.** 01-07 is a faithful Humphreys retelling. It is correct in the main, and the E8 figures (03, 05, 07, 13) truly compute on a shared, self-checking library (lib/e8-math.js runChecks). It is also encyclopedic rather than argued, and it repeats type-systems/12 and mathematical-diagrams/08. The octonion block (08-10) is a different, worse voice: "Missions", "Harmony %", fake widgets and several factual errors. It reads as a later bolt-on. 10b, 12 and 15 are redundant or wrong. The real spine is 03 -> 05 -> 07 -> 13 -> 14 (reflections, Dynkin, classification proof, the 240 roots, lattice/packing). Restructure to about 9 articles: merge 01+02, merge 04+05+06, keep 03, 07, 07b, one octonion article (09 + magic square), 11 folded with 12's E7 paragraph, a trimmed 13 carrying PC-16, and 14. Overall 5/10, RESTRUCTURE. Cut or merge about 8 of 17 pages (about 47%), about 40% of words.

---

## atlas-of-atlases (8 articles + index, about 7.4k words, all 2026-04-20)

| Article | S F C Fit | Verdict | Reason |
|---|---|---|---|
| 01 Series landscape | 2 2 2 1 | CUT | A prerequisite DAG plus tag matrix of the gallery itself. "21 series" hand-maintained. Belongs on the homepage if anywhere. |
| 02 Group theory | 1 2 2 1 | CUT | Hasse of concepts with badge chips. "Weyl group of SL(2,Z)", "E8 ... a finite-index subgroup's quotient", "D4 is the smallest non-abelian group whose subgroup lattice isn't a chain" (S3 already isn't), invented "height ~10², width ~10⁸" for the Monster's subgroup lattice. |
| 03 Graphs & networks | 1 2 2 1 | CUT | Taxonomy of graph types with series chips. |
| 04 Spectral methods | 2 3 2 1 | CUT | The Laplacian/Fiedler demo does compute, but is a stock example. "Natural gradient is an eigen-decomposition of the Hessian" is wrong. |
| 05 Geometry & manifolds | 1 2 2 1 | CUT | Curvature axis with badges. "Stiefel manifolds" placed as positive-curvature examples. |
| 06 Dynamics & time | 1 2 2 1 | CUT | 2x2 quadrant of formalisms with chips. |
| 07 Data & statistics | 1 2 2 1 | CUT | "MLE, posterior mode and KL projection are literally the same number" (only under a flat prior). |
| 08 Visual grammar | 1 2 1 1 | CUT | Self-referential "the chart is the example of itself" plus grand summary. |

**Series.** This series is a navigation layer, not essays. It is eight copies of one widget: a hover-highlight Hasse diagram whose nodes carry hardcoded `series:[...]` / `h:'...'` link arrays, plus a matrix. The claims are about the gallery ("the Monster never meets a decision tree"), so they teach nothing, and every cut elsewhere in the review silently falsifies its metadata. The 45 explainer links resolve today. 5-18 em dashes per page. Overall 2/10, CUT (100% of articles and words). If a cross-series map is wanted, rebuild one generated view on the homepage from the `series` array after the cull.

---

## parallel-coordinates (23 articles + index, about 31k words; 01-04 2026-04-12, 05-15 04-17, 16-23 04-19)

| Article | S F C Fit | Verdict | Reason |
|---|---|---|---|
| 01 The duality | 4 4 3 5 | KEEP | Point <-> line, convergence point d/(1-m), N-D indexed points. Correct, and the figures are bidirectional and live. |
| 02 What crossings tell you | 3 4 3 4 | KEEP | Correlation <-> crossing geometry, Iris, shuffle test. Some overclaim ("the crossing pattern *is* the distribution"). |
| 03 Surfaces you can't see | 4 3 3 4 | FIX | Envelope / cusp-inflection duality is the non-obvious idea. The prose conflates "locus of convergence points" with "envelope". |
| 04 Axis order | 3 4 3 4 | KEEP | mtcars, all 12 orderings, greedy chain. Solid and practical. |
| 05 Bundles & deviations | 3 4 3 3 | FIX | Bowtie plus Mahalanobis decomposition is good. Overlaps 02 and 08. |
| 06 Inside or outside | 2 1 3 4 | FIX (serious) | The figure is fake. The blue/red "contained" colour comes from a Cartesian `isInsideCircle` / barycentric test. `segmentInsideEnvelope` (the actual PC test) is defined and never called. The "union <-> intersection" duality contradicts its own explanation. The 3D claim ("inside iff within both pairwise hstars") is false for general convex sets. |
| 07 Brushing is slicing | 4 4 3 4 | KEEP | Axis vs angular brushing, wedge selection. "Angular brushing is strictly more expressive" is overstated. |
| 08 Anomaly & classification | 2 3 3 2 | MERGE -> 05 | Synthetic reactor and heart data, nearest-centroid classifier. Generic. |
| 09 Collision courses | 3 3 3 4 | FIX | Inselberg's origin problem, CPA computed. The "separation envelope" figure is loosely tied to the hypersurface claim. |
| 10 Robot arms | 3 4 3 4 | KEEP | IK as brushing on end-effector axes, 2- vs 3-link null space. A clean applied example. |
| 11 Pareto front | 3 3 3 3 | FIX | Dominance and weighted sums are fine, but the "envelope" framing is hand-wavy. |
| 12 Polytopes in parallel | 3 3 3 3 | MERGE -> 13 | Six regular polychora table and viewer. "PC views are always distinct" overclaims. |
| 13 Structure in 4D | 2 2 3 3 | FIX | "Which polylines cross between which axes = edge connectivity / incidence = topological invariant" is wrong: crossing depends on coordinate order, not adjacency, and Fig 6 is built on it. The tesseract -> 16-cell "morph" is meaningless. The 24-cell "only regular self-dual non-simplex" ignores polygons. |
| 14 Curse and promise | 2 2 3 2 | CUT | Generic overplotting tips plus an E8/Leech teaser that 15 repeats. |
| 15 Exceptional structures | 2 3 2 1 | CUT | Re-covers EA and modular-forms (E8, Borel-de Siebenthal, Leech, Golay, Monster). Repeats the false 10b claim ("every E8 root = rotor x {1, φ}"). |
| 16 E8 folds to 600-cells | 4 4 3 2 | MERGE -> EA-13 | The best E8 piece in the gallery. It really computes Coxeter eigenplanes (1,11)/(7,13), radii √(1±1/√5), and the Galois-swapped shells. It belongs in EA. 40 em dashes. |
| 17 Quasicrystals | 1 2 2 1 | CUT (Fibonacci-brushing figure -> quasicrystals 01) | "Fibonacci icosagrid / Compound of Five Cuboctahedra nucleus" is Quantum Gravity Research material presented as established physics. The "Penrose" window is a disc in 2D perp space (no index coordinate), so it is not the Penrose model set. "Projection matrix has φ and 1−φ as eigenvalues" is wrong. It leaks internal jargon ("in-house model-set substrate is Hurwitz-golden"). The McKay/E8 paragraph conflates constructions. |
| 18 Permutohedron & associahedron | 3 4 2 2 | FIX or move | Loday-Ronco and the Tamari lattice are nice and the f-vectors are right. But the model's reasoning leaked into the text ("wait, that's two moves; the adjacency is subtler"). It says the 120-cell has 720 edges (1200, per its own article 12). "Associahedron faces <-> non-crossing partitions" is wrong. PC is incidental here. |
| 19 Cayley graphs | 2 3 3 2 | CUT | Standard small groups. Overlaps 18 and mathematical-diagrams. Stale cross-references ("article 17"). |
| 20 Knot invariants | 2 3 3 3 | FIX | Plausible PC-on-a-catalog use, but only 31 knots despite "2,977". The KT and Conway data rows are identical except g and g4, yet the text says they "disagree on bridge, braid, Jones breadth" (mutants share Jones). The genus difference contradicts "distinguished not by any classical invariant" and "indistinguishable pre-1980" (Gabai 1986). "Milnor's inequality g4 ≤ u" is misattributed. |
| 21 Error-correcting codes | 2 3 3 2 | CUT | Generic. Construction A on Hamming[7,4] "kissing number 14" is wrong (56 at norm 3). Mariner 9 used RM(1,5), not RM(1,3). Duplicates EA-14. |
| 22 Birkhoff polytope | 3 3 3 2 | CUT (standalone candidate) | Mostly correct (dim (n−1)², Sinkhorn, HLP majorization), but PC is just "16 axes". Off-thesis. |
| 23 Connections | 1 2 1 2 | CUT | "Seven Connections" listicle and grand summary ("Twenty-five articles. One duality. Everything else is consequence."). Counts 24/25 articles for a 23-article series. "Dynkin diagram involution is the Lie-theoretic duality" is wrong. |

**Series.** 01-14 is a coherent, on-thesis Inselberg course (01-07 theory, 09-11 applications). It is the most defensible of the four series, but generic in places and has two broken figures or claims (06, 13). 15-23 were written in a burst on 04-19. They turn "parallel coordinates" into a thin lens over the gallery's favourite objects (E8, quasicrystals, Cayley graphs, knots, codes, Birkhoff) and duplicate EA, quasicrystals, modular-forms and mathematical-diagrams. Trim to about 13 articles ending at 11, with 12+13 merged and fixed, and optionally 18/20 fixed. Move 16 to EA. Overall 5/10, TRIM. Cut or merge 10 of 23 (43%), about 51% of words.

---

## quasicrystals (4 articles + index, dated 2026-05-06)

**Why the extract is empty.** Each HTML page is an 18-line shell: `<div id="article-root">` plus `QUASI.mountArticle('01')`. All prose (about 250-400 words per article: 3-5 sections of 2 short paragraphs, plus a "takeaway") lives as JS string literals in `docs/quasicrystals/lib/quasi-viz.js` (2,655 lines, 140 KB), and the page renders it on the client. So it is not a stub. It is a figure gallery wrapped in a very thin essay. Git: aa2233f "Ship quasicrystal explainer series" -> 43ef462 "Correct math and add labels" -> 517f675 "attempt fix quasicrystals". That last commit also deleted plans/quasicrystals/sources/figure-risk-register.md and ux-quality-pass.md. The prose reads like that risk register leaked onto the page: "This is the public Penrose construction, not the related in-house E8 slice", "The in-house Elser-Sloane substrate is best labeled as a Hurwitz-golden Galois-pair lattice", "E8 ... should not be named as the projected source", "The comparison below is schematic and rights-safe", "The local checker is intentionally small".

| Article | S F C Fit | Verdict | Reason |
|---|---|---|---|
| 01 Fibonacci, cut-and-project, phasons | 3 4 2 4 | FIX | The figures really compute: the Z² strip model set, the phason slider counting boundary crossings, the nearest-boundary-distance curve with singular offsets. The prose is a list of assertions. Move the text into HTML and write it properly. |
| 02 Penrose projection & inflation | 2 1 2 3 | CUT or rewrite | The "pentagrid" figure is fake. The line offsets use an arbitrary `phase*sin(i*1.7)`; the right panel ignores the grids; "phase" only wobbles dots by `sin(p.y)`. The Z⁵ "internal" coordinate is the norm of the mean-subtracted 5-vector, which includes the physical plane, so the acceptance window is wrong. |
| 03 Icosahedral diffraction & discovery | 2 2 2 3 | CUT or rewrite | The diffraction "oracle" is a sinc² envelope over the same flawed internal norm (schematic). The Shechtman history is 2 short paragraphs. The trace argument for 5-fold restriction is the only real content, and EA-04 / PC-17 repeat it. |
| 04 Beyond cut-and-project | 2 2 2 3 | CUT | The Hat/Spectre "patch" is 8 hand-placed tiles at fixed positions deformed in lockstep, so it is not a tiling and gaps or overlaps appear. Mostly caveats ("equivalence is a theorem, not a slogan"). |

**Series.** It has the right thesis and one genuinely good computational core (01's Fibonacci model set and phasons), but it is a failed repair. The prose is spec-notes, two of the headline figures are fake or wrong, and the same material appears three more times: PC-17, EA-15 fig 1, and PC-23 connection 1. This series should own cut-and-project, but only if it is rewritten as real HTML articles. Seed it from 01 and absorb PC-17's Ammann-Beenker and brushing figures (dropping the icosagrid material) and EA-15's E8 cut-and-project figure. Overall 3/10, RESTRUCTURE (or CUT if no rewrite is planned). Cut 3 of 4 (75%) and about 70% of the (small) word count. Nearly all of the value is in the JS.

---

## Overlap outside this group
- modular-forms/16 (Monster & McKay), 17 (lattices E8 & Leech), 18/20 (moonshine) vs EA-07b, EA-14, EA-15, PC-15.
- mathematical-diagrams/08 (Dynkin), 09 (quiver/McKay), 14 (Penrose notation, unrelated), 16 (Coxeter diagrams) vs EA-04..07, PC-19.
- type-systems/12-root-systems vs EA-02..05 (atlas-of-atlases also says type-systems builds B2).
