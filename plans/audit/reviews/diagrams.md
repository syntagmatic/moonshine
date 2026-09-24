# Review group: diagrams

Series: mathematical-diagrams, game-is-the-math, foam (calibration).
Scores: S = Substance, F = Figures, C = Craft, Fit, each 1-5.
Figure code I actually read: foam 01/02/03; md 06 (Kauffman state sum), 08 (Gram/det classifier), 10 (dessin lib), 12 (4T check), 19 (tropical grid); game 09 (Domineering search), 11 (Dom "value" engine), 14 (parity panel).

---

## foam (calibration: Sept 2026, newer model)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-the-honeycomb | 4 4 4 5 | KEEP | One argument (Plateau's 120 degrees makes the hexagon the answer). Fig 1 is a real Lloyd relaxation on a Voronoi froth with live junction-angle, mean-sides and wall-cost readouts. Constants check out (1.861 / 2 / 2.280). Fixes: 8 em dashes; the closing line says "next, Kelvin" but the next article is Double Bubble. |
| 02-the-double-bubble | 4 4 3 5 | KEEP (minor fix) | Fig 2 builds three circular arcs through the triple points at 120 degrees and integrates the volumes (Pappus), so the geometry is real. Physics error: "the bigger, lower-pressure chamber pushes the partition toward its smaller, higher-pressure neighbor" gets the direction backwards, and "bends toward the small side, equivalently bulges into the large one" contradicts itself. The torus figure is a static schematic that doesn't really show a torus. 11 em dashes. |
| 03-kelvins-bubble | 4 3 4 5 | KEEP (minor fix) | The rotatable truncated octahedron is real, and the dihedral angles (109.47 / 125.26) and s-values (5.315 / 5.306 / 5.288) are right. But relaxing the faces, the article's actual idea, is only described, never shown. Fig 3 is a hardcoded bar chart. It links to a nonexistent 04 and a nonexistent series index. |

The series is short (700 to 1,200 words an article), each piece makes one argument, and the history is dated correctly (Hales 1999/2001, Hass-Hutchings-Schlafly 1995, HMRR 2002, Taylor 1976). The figures mostly compute what the prose claims. It is unfinished: there is no index.html, it isn't registered in docs/index.html, and the "Next" links from 03 are dead. It also breaks the repo's no-em-dash rule on every page. Use it as the bar: short, one idea, figures that do the computation, and correct dates.

---

## mathematical-diagrams (23 articles; 01-14 all added 2026-04-16, 15-23 added 2026-05-04/05)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-hasse-diagrams | 2 3 2 2 | CUT | 430 words of glossary plus a "Concept Summary" list. The up-set/down-set widget is fine but trivial. Wrong in general: "width = the level with most nodes" (that only holds for Sperner posets), and levels vs. chain length is off by one. |
| 02-young-diagrams | 2 3 2 3 | MERGE -> 21 | The hook-length widget computes correctly (staircase = 768 is right), but the prose is a definitions list. The SYT-as-paths story already lives in 21. |
| 03-cayley-graphs | 2 3 2 1 | CUT | Glossary. The "subgroup appears as a connected subgraph through every node" claim is muddled. Duplicates parallel-coordinates/19-cayley-graphs. |
| 04-commutative-diagrams | 3 3 3 3 | FIX | The Build mode, where commutativity has to be *asserted*, is a real authorial point. Conflates mono/epi with injective/surjective. The KPI-ish summary list needs to go. |
| 05-braid-diagrams | 2 3 2 2 | MERGE -> 06 | Builder is fine, prose is encyclopedic. Belongs as a section of the knot article (Alexander's theorem is the bridge). |
| 06-knot-diagrams | 3 4 3 3 | KEEP (trim) | Real Kauffman bracket state sum on user-drawn curves. The descending-diagram unknot trick is a genuine insight. 10 em dashes. Cut the Concept Summary. |
| 07-string-diagrams | 2 2 2 2 | CUT | Dragging boxes is decorative, since no equation is checked or computed. Pure definitions. |
| 08-dynkin-diagrams | 4 4 3 1 | MERGE -> exceptional-atlas/07-pruning-and-diophantine | The build-your-own Gram/det classifier (finite/affine/indefinite, E8+1 lands on det 0) is excellent. But "why the list stops" is exactly exceptional-atlas 05/07's job. |
| 09-quiver-diagrams | 2 3 2 2 | MERGE -> 22 | The mutation widget is real. Summary claims are wrong: arrows are not "irreducible morphisms between simples", and the orientation/derived-equivalence and tilting claims are overstated. |
| 10-dessins-denfants | 2 1 2 2 | CUT | Fake figure. Genus is hardcoded to 0 (F = E - V + 2) in lib/diagram-math.js, so the "Euler characteristic stays invariant" demo is a tautology. The cube preset has 10 edges but claims degrees summing to 12, the tetrahedron preset lists 3 black vertices for passport [3,3], and "triangle" has 6 edges. |
| 11-weight-diagrams | 2 3 2 1 | CUT | Standard sl2/sl3 pictures. Overlaps exceptional-atlas/03-sl2-and-weyl. |
| 12-chord-diagrams | 2 2 2 3 | CUT | The "weight-system check" just does arithmetic on four numbers the user types. Wrong: "count of crossing chord pairs is the simplest finite-type invariant" (it is not a knot invariant; c2 is). The 1T relation is omitted. Stat-card KPI tiles. |
| 13-tangle-diagrams | 3 3 2 3 | FIX | Conway's rational-tangle theorem is a real, non-obvious idea and the twist builder computes the fraction. The prose is a glossary. Could fold into 06. |
| 14-penrose-notation | 2 2 2 1 | MERGE -> 23 | Same content as 23, but weaker. |
| 15-ternary-diagrams | 3 3 2 2 | FIX | Viviani and closure are good. Has a timeline listicle. Dubious claims: the entropy contours are "pulled by the Fisher metric", "three alpha-connections agree only at the metric midpoint", "Gibbs 1873 introduced the ternary phase diagram", and the forced "probability covector" link to Penrose. Overlaps information-geometry 01/02/06. |
| 16-coxeter-diagrams | 3 3 3 2 | MERGE -> 08 (or with it into exceptional-atlas) | Rank-2 mirror widget and a rank-3 eigen-signature test. Same positivity story as 08. |
| 17-crystal-graphs | 3 3 3 3 | FIX | The tensor-product signature widget is real. Prose hedges ("the safest statement is structural") instead of stating the rule. |
| 18-spectral-sequence-charts | 4 4 4 4 | KEEP | Best in the series. The sandbox makes you *decree* differentials, which lands the real point (the chart doesn't know its own differentials), plus a genuine choice point and extension-problem panel. |
| 19-tropical-curves | 4 4 3 5 | KEEP | Winner-regions are computed on a grid, plus amoeba-to-spine, the lifted Newton subdivision and a balancing inspector. Correct. A little long. |
| 20-ribbon-graphs | 4 4 3 3 | KEEP | Theta-graph cyclic order changes boundary cycles and genus, computed via sigma/alpha (pants vs. punctured torus checks out). |
| 21-bratteli-diagrams | 3 3 3 3 | KEEP | Path counts via incidence matrices. Absorb 02's hook-length material. |
| 22-associahedra-exchange-graphs | 3 3 3 2 | FIX | Flip graph and Ptolemy exchange are correct (A2 = pentagon, A3 = hexagon). Overlaps parallel-coordinates/18-permutohedron-associahedron. Absorb 09's mutation. |
| 23-tensor-network-diagrams | 4 4 3 3 | KEEP | Contraction-order cost is computed (720 vs 1500 vs 1.08M intermediates). A real, practical point. |

Two tiers. Articles 01-14 were written in one day. Each is about 450 words: a definition list, a "Concept Summary" bullet grid, and a widget that mostly lets you rearrange nodes. They are encyclopedic, and several have wrong claims (10, 12, 09) or fake figures (10, 12's 4T check, 07). Articles 15-23, written three weeks later, are twice as long, better argued, and three of them (18, 19, 23) meet the bar. 06 and 08 were clearly upgraded later and carry the best interactives of the early tier. The index copy is still "not just pictures, they are the math itself" boilerplate. Restructure to roughly 11 articles: 04, 06(+05, 13), 15, 17, 18, 19, 20, 21(+02), 22(+09), 23(+14). Send 08/16 to exceptional-atlas.

Outside overlap: exceptional-atlas (05 Dynkin, 07 "pruning" = md 08's sandbox thesis, 03 sl2/Weyl = md 11, 13 Gosset-Coxeter vs md 16); parallel-coordinates (19-cayley-graphs, 18-permutohedron-associahedron vs md 03, 22); information-geometry vs md 15; cohomology/06 vs md 18 (light); modular-forms vs md 10.

---

## game-is-the-math (15 articles, 2026-04-14, ~46k words)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-nim | 4 4 3 3 | FIX | Real Bouton engine and classifier, and a clean proof. **Wrong claim:** it says 7->6 or 5->4 from (3,5,7) loses, but (3,5,6) and (3,4,7) have XOR 0, so those are *winning* moves. It calls (3,5,7) "Marienbad", while 05 correctly uses (1,3,5,7). |
| 02-green-hackenbush | 4 4 3 3 | KEEP | Stalk = heap, colon principle, stepwise tree reduction. All correct. Trim the "Takeaways". |
| 03-grundy-values-and-mex | 3 3 3 2 | MERGE -> 04 | The DAG editor with live mex is good, but half the article re-derives what 04 restates. |
| 04-sprague-grundy-theorem | 3 3 2 2 | FIX (merge target) | The Sum Challenge is real. The stalk explanation ("each edge has Grundy value equal to its height... bamboo argument") is nonsense. Repeats 03. 18 em dashes. |
| 05-misere-play | 4 4 3 4 | KEEP | The side-by-side normal/misère boards with a divergence alert are the best figure in the series. (1,1) vs (2,2) is correct. |
| 06-blue-red-hackenbush | 4 4 3 3 | KEEP | Every stalk value I checked is right (BR 1/2, BRRR 1/8, BRBR 5/8, BBBRR 9/4, sums). The move-by-move computer is real. |
| 07-the-surreal-numbers | 3 2 2 2 | MERGE -> 08 | The comparison and addition figures admit they "trust the arithmetic" rather than unfold the recursion. The simplicity rule is stated here, in 06 and in 08. Padded Knuth/Conway history. |
| 08-simplicity-theorem | 3 3 3 2 | FIX (absorb 07) | The calculator and the two-method stalk check are real. The "binary fraction rule" description is slightly off. |
| 09-domineering | 3 4 3 3 | FIX | A genuine exhaustive win/loss search, and 2x2 = {1 \| -1} is right. **Errors:** the Fig 5 3x1 strip is +1, not "+2", so the "+2 and -2 cancel" arithmetic is wrong. The "8x8 value computed in the 1990s" is wrong (the 8x8 outcome was solved in 2000, and its value is not known). |
| 10-temperature-and-cooling | 3 3 3 3 | FIX | Switch thermographs only (a trivial triangle). **Error:** "total swing = sum of temperatures 4+1 = 5 to whoever moves first". For {6\|-2}+{2\|0} the stops are 6 and 0 around a mean of 3. |
| 11-sums-of-games | 1 2 2 1 | CUT | A recap of 04/06/10. **Contradicts 09:** it says the 2x2 Domineering board = {0\|0} = * (wrong, it is {1\|-1}). The "optimal" engine collapses options to their means and picks the "simplest number" with ceil/floor, so it isn't CGT. |
| 12-hex-and-positional-games | 3 4 2 4 | FIX (halve) | The fill checker and strategy-stealing walkthrough are fine. Errors: Cantor's diagonal "before Hermite gave a specific transcendental" (Liouville 1844 and Hermite 1873 both predate it), the made-up "Hellinger-Hales-Jewett theorem", and TwixT/Havannah said to inherit a first-player win (both can draw). 3.8k words. |
| 13-go-endgames | 2 2 2 2 | MERGE -> 10 | It admits it is "a CGT exercise in Go costume". Three switches repeat 10's arithmetic, and the "Theorem 11 of Berlekamp-Wolfe" citation looks invented. |
| 14-dots-and-boxes | 2 3 3 4 | FIX (major) | **The core rule is wrong:** it reverses the long-chain parity (4x4 dots = 16 dots, where the first player wants an *even* number of long chains). It uses length >=4 for long chains (Berlekamp uses >=3). Position B shows "three long chains" of length >=4 on 9 boxes, which is impossible. The "1982 MSRI edition" is made up, and Barker-Korf actually solved 4x5 boxes in 2012, not "5x5 in 2002". The playable game is worth keeping. |
| 15-loopy-games-and-beyond | 2 1 1 2 | CUT | 6.3k words, no interactives, a reading list, a "By the numbers" tile grid of every theorem, and a grand summary ("What you do with it now is up to you. We are done."). Errors: epsilon_0 called "the first transfinite limit ordinal", the all-small definition is wrong, "Grundy's game (octal 0.6)", and Geography is called loopy while it also says it's finite. |

The strongest pedagogical design in the group is "play first, then the theorem". Nim, Hackenbush, misère and Domineering have real engines. But each article is 2-4k words with a recap opener, "Takeaways", "Honesty moment" asides and a forward-promo closer. The partizan core (06/07/08) states the simplicity rule three times, and Act III contains confident factual errors in exactly the places a reader can't check (Dots and Boxes parity, Hex history, Domineering). 11 contradicts 09 on the most basic example. Keep about 10 articles, cut the length of each by about 40%, and do a full fact-check pass before anything ships. No overlap with series outside this group.
