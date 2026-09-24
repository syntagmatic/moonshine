# Findings: quasicrystals track

Rewrite, not a trim. The old series (4 shells + index, all prose as strings inside a
2,655-line `lib/quasi-viz.js`) was deleted and replaced by four HTML essays with the
prose in the page and every figure computed from the construction it shows.

## Cut, merged, renumbered

| Old | New |
|---|---|
| 01-fibonacci-cut-and-project-phasons.html | 01-the-fibonacci-chain.html (rewritten from scratch) |
| 02-penrose-projection-and-inflation.html | 02-five-grids.html (pentagrid and Z^5 windows) and 03-inflation.html (substitution) |
| 03-icosahedral-diffraction-and-discovery.html | 04-diffraction.html (rewritten from scratch) |
| 04-beyond-cut-and-project.html | cut; the Hat appears only as one sourced paragraph in 03 |
| lib/quasi-viz.js | deleted; replaced by lib/qc.js (pure math, also loads in node) and lib/page.js (DOM helpers) |

Count: 4 articles before, 4 after. Word count went up (each essay is now roughly
1,500-2,000 words of prose, against 250-400 before).

On the reviewer's verdicts: I agreed with all four. 02 and 03 were marked "CUT or
rewrite"; I rewrote. 04 was cut as recommended. I added a separate inflation article
because the substitution/projection equivalence is computable and needed its own space.

## Figures (all compute; checks are real comparisons that could fail)

- 01 Fig 1: strip model set from Z^2 with slope and window sliders; counts tile lengths
  and detects a period in the visible word. Fig 2: internal-space position of each point,
  colored by the next k-tile word (shows the k+1 Sturmian intervals). Fig 3: sliding
  window, flipped points in internal space and swapped pairs in the chain.
- 02 Fig 1: de Bruijn pentagrid and its rhomb tiling, linked hover with ribbons. Fig 2:
  draggable internal shift, four pentagon windows computed as hull of projected
  hypersimplex vertices, vertex images and flipped tiles; reports vertices outside
  windows (0). Fig 3: vertex-neighborhood classes as regions of the windows.
- 03 Fig 1: Fibonacci substitution rows vs the projected chain (window [-1, 1/phi)),
  letter-by-letter agreement. Fig 2: exact coincidence fraction of t*Lambda with Lambda
  for all t in [1,3]. Fig 3: Robinson-triangle substitution with integer 5-vectors
  recovered by walking edges; vertices tested against the pentagon windows.
- 04 Fig 1: two-center crystallographic restriction argument. Fig 2: direct-sum 1D
  diffraction of Fibonacci / periodic approximant / random, overlaid with the
  window-transform prediction (agrees to 0.001). Fig 3: 2D direct-sum diffraction of
  Penrose vertices / square lattice / random points, with a rotation-correlation readout
  (Penrose 0.88 at 36 deg; square 1.00 at 90 deg).

Old figures made honest or removed: the fake pentagrid (arbitrary sin offsets, internal
norm including the physical plane), the sinc^2 "diffraction oracle", the 8-tile Hat
patch and all schematic panels were removed. Only the idea of 01's Fibonacci and phason
figures survived; the code was rewritten.

## Claims checked (node scripts, not committed)

- Strip model equals the algebraic set {a phi + b : b - a/phi in [-1/phi,1)}; two tile
  lengths, ratio phi; next tile is L iff x* >= 0.
- Substitution word equals the projected chain for window [-1, 1/phi), not for
  [-1/phi, 1) (first draft said otherwise; corrected). phi*Lambda is in Lambda for
  [-1/phi, 1) (170/170).
- Phason flips: every flip pairs a leaving and an entering point differing by (-1, 1).
- Pentagrid: indices 1-4 only, all vertices inside their pentagons, thick/thin -> phi,
  index-2/index-1 ~ phi^2.
- 2D flips arrive as rows of hexagons (36 new tiles = 12 moved vertices, etc.), not one
  at a time. The article says so.
- Robinson vertices scaled by phi are next-step vertices with internal image exactly
  -P*/phi (all vertices, steps 2-6).
- A first draft claimed the substitution wheel is a singular pentagrid with vertices on
  window edges. Computation found none on edges (min distance shrinks by 1/phi per step);
  the claim was removed. A draft claim that powers of phi are the only Z[phi] numbers
  with small conjugate was false (4 phi + 2 is a counterexample); replaced with the
  correct statement for t in [1,3].
- Bug fixed: rational slopes showed 3-4 tile lengths from floating-point on window edges.

## Sources checked

Nobel scientific background 2011 (date 8 April 1982, exposure 1725 "10 Fold ???",
icosahedral axes, 2+ years to publication, Levine-Steinhardt 24 Dec 1984, Mackay 1982,
de Bruijn 1981, IUCr definition wording, icosahedrite/Khatyrka, Penrose 1974 ref). APS
page for PRL 53, 1951 (received 9 Oct, published 12 Nov 1984). NIST "Nobel moment" page
(JAP rejection, Cahn's twins recollection, Pauling until 1994). arXiv 2303.10798 (hat,
substitution clusters, hierarchical proof). Removed or avoided: exact alloy composition
(sources disagree: 14% vs 25% Mn), the Pauling quote, "meteorite" (2009 paper predates
that finding), "first monotile".

## Unresolved, needs a human

- Hof 1995 (Comm. Math. Phys. 169, 25-43) and the de Bruijn "every Penrose rhomb tiling
  arises from a pentagrid" statement are cited from memory, not re-read.
- IUCr redefinition year given as 1992, inferred from the Nobel background footnote.
- No E8 figure: EA-15's E8 cut-and-project (ball window) was not moved in; it does not
  fit the arc. Salvage candidate if wanted: docs/exceptional-atlas/15-e8-out-in-the-world.html
  Figure 1, suggested home an appendix to 02.
- PC-17's Ammann-Beenker figure was not absorbed (octagonal analogue; would be a natural
  second example in 02). PC-17 brushing figure not needed.

## Inbound links

No page outside the series links to the deleted filenames. docs/index.html and
docs/parallel-coordinates/17-quasicrystals.html link to quasicrystals/index.html, which
still exists. PC-17's "series note" text describes the old series and should go with PC-17.

## Homepage entry

- title: Quasicrystals
- count: 4
- href: quasicrystals/index.html
- desc: Ordered patterns that never repeat, built by slicing a higher-dimensional lattice. The Fibonacci chain from the square grid, the Penrose tiling from five grids, substitution and inflation, and the diffraction that led to Shechtman's 1982 discovery.
- tags: cut-and-project · Fibonacci · Penrose · phasons · substitution · diffraction
- Can move out of "Work in Progress".
