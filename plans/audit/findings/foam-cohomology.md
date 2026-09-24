# Findings: foam and cohomology (batch 2)

Finish-and-fix pass. Nothing cut, merged or renumbered. foam stays at 3 articles
(plus a new index), cohomology at 6.

## foam

### Added
- `docs/foam/index.html`, a new series index. It uses the series `style.css` card styles, an
  intro of two short paragraphs, three cards with small computed SVG thumbs (a hex Voronoi
  patch, a 120-degree double bubble built as in 02, a truncated octahedron projected from its
  vertex set), and a header strip that is a real Voronoi diagram of seeds sliding from random
  to a triangular lattice. The footer has references.

### Errors confirmed and fixed
- **02 pressure direction (confirmed).** The small bubble is at higher pressure
  (Young-Laplace), so it pushes the wall into the larger bubble. The text said the reverse.
  "Bends toward the small side, equivalently bulges into the large one" contradicted
  itself. I rewrote both sentences. I checked the figure numerically: the wall midpoint moves
  toward the larger bubble, and 1/r_wall = 1/r_small - 1/r_large holds to 5 digits across
  the slider range. The figure was already right.
- **03 dead links (confirmed).** The footer "Next" link to the nonexistent
  `04-the-counterexample.html` is removed. The closing paragraph and Fig 3 caption promised
  "the next article". They now state the Weaire-Phelan result directly (1993; two cell
  types, 2 pentagonal dodecahedra per 6 fourteen-faced cells; <s> about 5.288, about 0.3%
  below Kelvin; still not proved optimal).
- **01 closing line (confirmed).** It said "next, Kelvin", but the next article is the
  Double Bubble. Rewritten.

### Figures made honest
- **03 Fig 3.** It was a hardcoded bar chart on a truncated axis starting at 5.28, which
  exaggerates the gaps. It is now a dot plot on the same zoomed axis. The flat value is
  computed from (6 + 12√3)/(8√2)^(2/3) = 5.3147. The two relaxed values are labelled in the
  caption as published Surface Evolver results.

### Not done (needs a human or a later pass)
- The em dashes in foam's untouched prose (roughly 25 across 3 pages) are left for the prose
  pass, per the brief.
- 03's central idea, relaxing Kelvin's faces to 120 degrees, is still only described. Showing
  it would need a Surface Evolver-style relaxation, which is a real project.
- The 02 torus figure is still a flat schematic of the non-standard competitor.

### Homepage entry (foam, not yet registered)
- title: `Foam`
- count: `3`
- href: `foam/index.html`
- desc: `Dividing space into equal cells with the least wall. The plane is solved (Hales's hexagons), two bubbles are solved (the standard double bubble, 2002), and filling space is still open: Kelvin's cell, beaten in 1993 by Weaire and Phelan.`
- tags: `soap films · Plateau's laws · honeycomb · double bubble · Kelvin problem`
- thumb idea (`foam`): a small patch of Voronoi cells, irregular at left and relaxing into
  hexagons at right, drawn in the burnt-orange film colour (#c2410c) on a light ground. A
  cheaper alternative is three or four hexagons with one 120-degree junction marked in
  crimson (#be123c).

## cohomology

### Errors confirmed and fixed
- **05 Betti numbers (confirmed).** The text gave the torus as (1, 2, 2); β2 is 1. That
  whole paragraph described a default cover that did not work, and it is replaced.
- **05 cover logic (confirmed, and worse than flagged).** Pieces are built from a vertex
  mask, so any simplex with a U-only vertex and a V-only vertex belongs to neither piece. The
  old "verify exactness" only checked the alternating sum of Betti numbers, which never looks
  at the maps. Over 400 random masks per surface, it passed on 11-77 masks that were not
  covers at all. Also, torus7, rp2 and s2 have complete 1-skeletons, so no nontrivial
  vertex-mask cover of them exists. Fixes:
  - `COH.mv.cover` now reports `missing` simplices and `covers`.
  - New `COH.mv.exactness` computes the rank of every π*, i*−i* and δ* from its matrix and
    checks rank(in) + rank(out) = dim at all 9 nodes. Tested: exact on every true cover (310
    of 310), never exact on a non-cover.
  - The figure is rebuilt on a 4×4 grid torus, a 4×4 grid Klein bottle and an octahedron,
    each drawn flat with glued copies. Readers click vertices to paint U / both / V, or pick
    a preset (two annuli, bands sideways, star of a vertex, no overlap, hemispheres). It
    shows map ranks, colours each node by its exactness, refuses non-covers and highlights
    the missing simplices. It also compares β(X) predicted from the pieces alone
    (coker d_{k-1} + ker d_k) with β(X) computed directly.
  - The unused "Step through" button is gone.
- **05 prose.** The claim "Three Betti tables plus exactness equals one Betti table" is false
  (you need map ranks). It is replaced with the dimension formula. "49×49 system" had no
  basis (torus7 is 7/21/14) and is gone. The garbled connecting-map section is rewritten as
  an explicit computation on the octahedron: the equator generator maps to the one-triangle
  cocycle, and a parity argument shows it is not exact. The "What we take with us" summary
  list and the two callout boxes are removed.
- **06 Z/2 lift (confirmed).** Promoting a Z/2 cocycle to 0/1 integers generally fails the
  cocycle condition: a triangle with ω = 1, 1, 0 gives δω = 2. On test annuli the 0/1 reading
  broke 4-84 triangles. Also, `_h1CocycleAtScale` returned `basis[0]` for every bar, so bars
  did not get their own cocycles, and the bottom panel built its Rips complex on pixel
  coordinates with a raw-scale ε. `COH.persistCoh` is rewritten:
  - `compute(filt, {stopAt, p})` is the de Silva-Morozov-Vejdemo-Johansson cocycle algorithm
    over Z/47. It gives bar-specific live cocycles at any scale. Its bars match
    `TDA.persistence` exactly on 20 random samples.
  - `liftToZ` maps coefficients to (−p/2, p/2]. `cocycleDefect` checks the integer cocycle
    condition on every triangle (0 failures in every test).
  - `circularCoords(n, edges, intVec)` solves Lθ = δᵀω̃, pinning one vertex per component.
  - Only 06 used the old API, although the lib header calls the API frozen (it points to
    `plans/cohomology/AGENTS.md`, which I did not edit).
- **06 leaks and summary.** The `squishy-thing/research/36-...` link, the OP² dossier
  paragraph, the "Six handles / six faces" grand summary (which listed five), the shape-zoo
  trophy cards, the "closing meditation", the callout boxes and the reversed "death → birth"
  barcode are all removed. 06 is now about 1,500 words of new prose.
- **03 leak (confirmed).** "The squishy-thing dossier 36 records this fact..." is removed.
  The colour legend now says emerald and amber are where α and β are read, not "the H² colour".
- **01 pairing (confirmed).** The H¹ generator must pair to 1 with the loop around the hole
  (the pairing is perfect over Z/2), not "or both 0". Verified headlessly: it reads 1, 1 and
  stays there under the δf slider. "Homology cannot say why" (hairy ball) is softened: Betti
  numbers do not explain it, and homology can prove it via degree.
- **02.** The references to "the TDA series" are removed. The "every closed surface is
  orientable in the sense that matters" paragraph is replaced with the correct statement:
  over Z/2, H² = Z/2 for every closed connected surface; over Z, H² of RP² and of the Klein
  bottle is Z/2.

### Rips builder folded in
- The source was `plans/salvage/topological-data-analysis/01-points-proximity-rips.html`. It
  is now Figure 1 of 06: draggable points, an ε slider, discs of radius ε/2, and presets. I
  dropped its χ and tetrahedron count, because χ truncated at dimension 3 is wrong once
  5-cliques appear. I added live β0 and β1 from the same Z/47 algorithm, plus a count and
  amber shading of triangles that are in the Rips complex but not the Čech complex, using a
  minimum-enclosing-circle test.

### Index
- New subtitle and intro (the em-dash sentences rewritten), and new card text for 02, 05 and
  06 and the Act II intro. The "vocabulary" fact-tile grid (a KPI grid) is removed. The header
  barcode is flagged in code as a schematic and drawn birth → death.

### Rejected
- None of the flagged errors turned out wrong. The reviewer's "Verify exactness can fail on
  legitimate drags" was really the reverse: the old check passed on illegitimate ones.

### Unresolved
- Em dashes remain in untouched cohomology prose: 01 has 23, 02 has 20, 03 has 15, 04 has
  12, 05 has 7 and the index has 5. They are left for the prose pass.
- The 04 review had no errors flagged, and I did not change it.

### Links
- No pages were renamed or deleted, so nothing inbound breaks.
- Outbound links to check at merge: `cohomology/index.html` links
  `../mathematical-diagrams/18-spectral-sequence-charts.html` (md is being restructured),
  `../modular-forms/index.html` and `../exceptional-atlas/index.html`.
- Homepage cohomology entry: count 6 is still right. Suggested desc update: `...compute with Mayer-Vietoris on covers you paint, and end by building Rips complexes from points and turning a persistent class into circular coordinates.`
