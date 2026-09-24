# Findings: mathematical-diagrams track (batch 2)

The series went from 23 articles to 10. Every survivor has at least one figure that
computes the thing the prose talks about.

## Cut, merged, renumbered

Cut outright (deleted): 01 Hasse, 03 Cayley, 07 string, 08 Dynkin, 10 dessins,
11 weight, 12 chord, 16 Coxeter.

Merged, with the sources deleted:

| new file | from | notes |
|---|---|---|
| 01-commutative-diagrams.html | 04 | fixed; now the series opener |
| 02-knot-diagrams.html | 06 + 05 + 13 | rewritten as one argument: a drawing, a braid word and a tangle fraction are three notations, and one Kauffman state sum reads all three |
| 03-ternary-diagrams.html | 15 | fixed |
| 04-crystal-graphs.html | 17 | fixed |
| 05-spectral-sequence-charts.html | 18 | header, nav and Concept Summary only |
| 06-tropical-curves.html | 19 | header, nav and Concept Summary only |
| 07-ribbon-graphs.html | 20 | header, nav and Concept Summary only |
| 08-bratteli-diagrams.html | 21 + 02 | new hook-length figure |
| 09-associahedra-exchange-graphs.html | 22 + 09 | new quiver-mutation figure |
| 10-tensor-network-diagrams.html | 23 + 14 | one Penrose paragraph kept from 14 |

Where I departed from the reviewer:
- **13 folded into 02.** The review allowed this ("could fold into 06"), and 13 on
  its own was a glossary plus a broken widget.
- **16 cut, not moved.** Exceptional-atlas is outside my track, so its figure is
  written up under Salvage below.
- **08's pointers.** Readers now go to EA-03 and to the Dynkin sandbox in EA-04. The
  links are in the index footer and in 09 (finite-type cluster algebras, Gabriel).
  04 links EA-03.

I also cut the series index's "vocabulary" KPI tile grid and colour-legend card
grid, rewrote the intro and footer, and trimmed the header vignettes from 7 to 4
(Young, Commutative, Braid, Tensor).

`lib/diagram-math.js`: I removed the modules no survivor uses (poset, sugiyama,
partition, group, string, dynkin, quiver, dessin, weight, chord, tangle, penrose)
and kept braid, knot, commDiag and fmt. The dropped modules include two confirmed
bugs: `tangle.fraction` nests the continued fraction backwards, and `quiver.mutate`
is wrong with multiple arrows and allows loops. I trimmed `lib/test.html` to match,
and it gives 15/15 pass.

## Errors confirmed and fixed

- **04 (now 01): mono/epi was equated with injective/surjective.** It is now
  defined by cancellation, with the counterexample Z to Q in Ring (epi, not
  surjective).
- **04, new: fake verdict.** Explore mode compared composed label strings, so every
  genuinely commuting preset (the square, triangle, product and snake) was reported
  as "does not commute". Each preset now carries its asserted equalities, and Explore
  uses Build's rewrite checker. Without a relation that settles the question, the
  verdict is "Undecided".
- **05, new: wrong braid presets.** The "trefoil" (s1 s2)^3 closes to T(3,3), a
  3-component link (det 4). The "figure-eight" (s1 s2^-1)^4 closes to 8_18
  (det 45). Both were replaced, and they are now checked by a computed state sum.
- **13, new: 0 and infinity tangles were swapped.** As a result, N([3]) closed to the
  unknot. The builder also nested multi-stage fractions backwards (the lib bug).
  The figure was rebuilt, and on every preset the determinant equals |p|: [2]=2,
  [3]=3, 5/2=5, 7/3=7, 8/3=8.
- **06, new: the Reidemeister sketches were wrong.** The R3 sketch showed no move,
  and R2 had no over/under crossings. Both are redrawn. The Tait conjecture is now
  dated (19th century, proved in 1987).
- **09: three wrong claims dropped.** The page said that arrows are "irreducible
  morphisms between simples" (they are a basis of Ext^1). It said orientations give
  derived equivalence (true only for trees, via BGP). It called mutation a change of
  tilting object (loose).
- **15 (now 03): the Fisher-metric explanation of the entropy contours.** Wrong: the
  contours are plain level sets of H on the flat triangle.
- **15: "alpha-connections agree only at the midpoint".** False: the three geodesics
  share only their endpoints.
- **15: "Gibbs 1873 introduced the ternary phase diagram".** Wrong paper. The
  triangle is in Gibbs's "On the Equilibrium of Heterogeneous Substances"
  (1876-78). Roozeboom standardised ternary phase diagrams in 1894.
- **15: the forced Penrose covector link** is removed.
- **15: attribution of the Euclidean simplex geometry.** It was credited to
  Aitchison 1982. It is Pawlowsky-Glahn and Egozcue (2001), found independently by
  Billheimer, Guttorp and Fagan (2001).
- **17 (now 04): hedge replaced by the rules.** The page now states Kashiwara's
  tensor product rule and the type-A bracket rule.

## Errors rejected

- **The contraction costs in 23 are correct.** Recomputed: 720 and 720, 1500 and
  1500, and 1,080,000 for the outer product.
- **Hook counts are correct.** Staircase 768, 3x4 rectangle 462, (5,1,1,1) 35.
- **Associahedron counts are correct.** C3 = 5, C4 = 14, and the Ptolemy relation
  holds.
- **06's knot numbers are correct.** The review flagged only style. The trefoil
  bracket and figure-eight X check out when run live.

## Figures made honest or removed

- **02, braid closure.** It used to draw decorative arcs. It now computes the bracket,
  X, the component count and identification by state sum.
- **02, tangle builder.** The drawing was fake and the fraction was wrong. Both are
  rebuilt: a staircase layout, the fraction from twist arithmetic, the bracket of
  the numerator closure, and a determinant check.
- **02, stat tiles.** The KPI stat tiles are now a single readout line.
- **03, Viviani guides.** These were cevians, not perpendiculars. They are now true
  perpendiculars, with a measured sum of 1.000.
- **03, USDA soil polygons.** Clay overlapped Silty clay, so Silty clay could never
  be reported. The polygons now use the USDA boundaries.
- **03, Hardy-Weinberg readout.** It now uses allele frequencies.
- **03, contour card.** The "ternary contour" variant card drew hand-placed
  pseudo-contours, so I removed it. The Entropy preset already draws real contours,
  and the prose points to it.
- **04, decomposition readout.** Added "Components by size": B(1)xB(1) = B(2)+B(0)
  and B(3)xB(2) = B(5)+B(3)+B(1).
- **08, Young's lattice.** Paths are counted two ways (hook formula and Bratteli
  recurrence), and "Next tableau" unranks them into standard Young tableaux.
- **09, quiver figure.** Shows the quiver of the current triangulation. After every
  flip it mutates the old quiver and compares the result with the new triangulation's
  quiver. The hexagon matches in all 42 flips (12 of them with arrows added or
  cancelled).
- **14, dropped figure.** It was draggable nodes plus count tiles, so I didn't keep it.

## Salvage (not rehomed)

- **Old 16's rank-3 Coxeter signature test**
  (`git show 3d487ca:docs/mathematical-diagrams/16-coxeter-diagrams.html`, #fig-gram).
  - It builds G_ij = -cos(pi/m_ij) from the diagram's labels and reads the
    eigenvalue signature: finite, affine or indefinite.
  - Unlike the Cartan-integer Dynkin sandbox, it handles non-crystallographic labels
    (5, H3, I2(m)).
  - Suggested home: an extension of EA-04's sandbox, or EA-08 (H3/H4).
- **Old 16's rank-2 mirror widget.** Mirror angle pi/m with the dihedral relation.
  It overlaps EA-03's rank-2 explorer.
- **Old 02, not rehomed.** The conjugate-partition view and the hook-walk display.
- **Old 09, not rehomed.** The free-form quiver playground. It depended on the buggy
  `quiver.mutate`.

## Unresolved (needs a human or the prose pass)

- **Chirality names are arbitrary.** Figures 1-3 of 02 call s1^3 "trefoil" rather
  than "mirror trefoil". This is consistent across the three figures.
- **Em dashes remain** in 05, in two untouched lines.
- **Dead CSS in 03.** It still has unused `.history-*` and `.insight` rules.
- **Word counts.** I made no length pass on 05-07. The reviewer called 06 (old 19)
  "a little long".

## Inbound links to deleted or renamed pages

- **`docs/index.html:257`.** The series entry (count 23). Replace it with the entry
  below. Its thumb `diagram-hasse` draws a Hasse diagram, a cut topic. Consider a
  knot or tensor-network thumb.
- **`docs/cohomology/index.html:127`.** It links
  `../mathematical-diagrams/18-spectral-sequence-charts.html`, which should become
  `../mathematical-diagrams/05-spectral-sequence-charts.html`.

No other series links into mathematical-diagrams.

## Homepage entry

- title: The Visual Language of Algebra
- count: 10
- desc: Ten diagrams mathematicians compute with, each with a figure that does the
  computation. Commutative diagrams, knots with braids and rational tangles, ternary
  plots, crystal graphs, spectral sequence charts, tropical curves, ribbon graphs,
  Bratteli diagrams with Young's lattice, associahedra with quiver mutation, and
  tensor network contraction cost.
- tags: commutative diagrams · knots · crystals · spectral sequences · tropical · ribbon graphs · cluster mutation · tensor networks
