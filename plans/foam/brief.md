# Seven-Article Brief — Foam

Canonical brief for the series. Update this file rather than rebuilding the article
structure. Each article holds one big idea and one signature interactive. Scope is
capped at four dimensions.

---

## 01 — The Honeycomb

**Pitch.** Start in the plane, where the problem has a clean and proven answer, and
let it teach the whole vocabulary cheaply. Three soap films always meet at 120°; the
least-perimeter way to cut the plane into equal areas is the regular hexagonal grid.
Bees, soap froth squeezed between glass plates, and a theorem all agree. This is the
on-ramp: "least area," "equilibrium angles," and "the optimum is not the obvious
shape" all appear here in a setting you can draw.

**Math basis.** 2D Plateau: three arcs meet at 120° at every vertex. Isoperimetric
comparison of regular tilings, perimeter per unit area (each shared edge counted
once): hexagon ≈ 1.861, square = 2, triangle ≈ 2.280 — hexagon wins among the three
regular tilings, and Hales' Honeycomb Theorem (2001) proves it beats *every*
partition, not just regular ones. Be explicit about the shared-edge factor of ½.

**Figures.** (1) Wet→dry foam relaxation hero: scatter bubbles, drag, watch films
straighten and vertices snap to 120° as the froth dries; show a T1 neighbor swap. (2)
Perimeter-per-area calculator for triangle/square/hexagon with the shared-edge factor
visible. (3) "Why not pentagons" — regular pentagons do not tile, the frustration
that foreshadows 3D.

**Misreadings to avoid.** Do not conflate "minimizes perimeter" with "most circular
cell." Do not state the hexagon number without the ½ convention. Do not imply Hales'
theorem was easy — flag it as a hard 1999 proof of an ancient guess.

**Reader takeaway.** In 2D the least-area foam is solved and it is the honeycomb. Hold
onto the method (equilibrium angles + isoperimetric comparison); 3D breaks the ending.

---

## 02 — The Double Bubble

**Pitch.** Before tiling all of space, solve the smallest cluster: what is the
least-area way to enclose and separate *two* equal volumes? One volume alone gives a
sphere (the isoperimetric problem). Two gives the "double bubble" everyone has blown —
two caps joined by a flat disk, the three surfaces meeting at 120°. That this familiar
shape is *provably* optimal took until 2002. The article uses it to introduce 3D
triple junctions and Plateau's laws on the simplest possible cluster, bridging one
bubble and an infinite foam.

**Math basis.** Isoperimetric: least area for one volume → sphere. Double Bubble
Theorem: for two equal volumes the standard double bubble is the unique minimizer —
equal volumes by Hass & Schlafly (1995, computer-assisted), the general case by
Hutchings, Morgan, Ritoré & Ros (*Ann. Math.* 2002). The dividing wall is flat for
equal volumes and bows toward the larger volume otherwise; all three surfaces meet at
120° along the common circle (Plateau again). Beaten competitors (e.g. the toroidal
"bubble around a tube") are part of the story of why the proof was hard.

**Figures.** (1) Draggable two-volume cluster: change the volume ratio, watch the
central wall flatten at equality and bow otherwise, with the 120° junction read out
live. (2) Isoperimetric warm-up: one volume relaxing to a sphere. (3) A "ruled-out
rivals" panel showing a plausible competitor (torus bubble) and that it loses.

**Misreadings to avoid.** Do not call the central wall flat in general — it is flat
only for equal volumes. Do not present the result as obvious; the proof is 2002 and
nontrivial. Keep "double bubble" the finite cluster, distinct from a space-filling
foam (that distinction is the jump to article 3).

**Reader takeaway.** Even two bubbles needed a hard modern proof, and the answer obeys
the same 120° law as the honeycomb. Now scale up to filling all of space.

---

## 03 — Kelvin's Bubble

**Pitch.** Lord Kelvin, 1887, asks the space-filling version and proposes an answer so
elegant it was believed for over a century: take the truncated octahedron, the shape
that tiles space as the Voronoi cells of the body-centered cubic lattice, and let its
faces relax into gentle curves to obey the soap-film laws. This article builds that
shape, states the 3D Plateau laws it must satisfy, and sets the bar (⟨s⟩ ≈ 5.306) that
the next article undercuts.

**Math basis.** Truncated octahedron: 14 faces (8 hexagons + 6 squares), 36 edges, 24
vertices; Voronoi cell of BCC; the bitruncated cubic honeycomb fills space with it. 3D
Plateau's laws (Taylor 1976): three faces meet along an edge at 120°; four edges meet
at a vertex at arccos(−1/3) ≈ 109.47°. The flat polyhedron violates these, so Kelvin's
faces curve (hexagons warp into non-planar monkey-saddles) — the relaxed cell has
dimensionless surface area ⟨s⟩ ≈ 5.306.

**Figures.** (1) Rotatable truncated octahedron, toggle flat ↔ relaxed, highlight
which faces curve. (2) Plateau-angle inspector: click an edge to read 120°, a vertex to
read 109.47°, with the tetrahedral-angle derivation on demand. (3) BCC-lattice →
Voronoi-cell construction (previewing article 6).

**Misreadings to avoid.** Do not present the flat truncated octahedron as the foam —
the foam is the *relaxed* version. Do not call 109.47° a coincidence; it is the
tetrahedral angle forced by four equal edges. Keep ⟨s⟩ defined as area per unit-volume
cell so it compares directly with article 4.

**Reader takeaway.** A single elegant cell, relaxed to obey soap-film law, gives the
best 3D foam anyone could find for 106 years. It is also wrong — barely.

---

## 04 — The Counterexample

**Pitch.** In 1993 Denis Weaire and Robert Phelan, running Ken Brakke's Surface
Evolver at Trinity College Dublin, found a foam that beats Kelvin by 0.3%. It is not
one repeated cell but two, of equal volume: a curvy pentagonal dodecahedron and a
14-faced tetrakaidecahedron, packed eight to a repeat. The improvement is tiny and the
structure is famous — its sliced facade is the skin of the Beijing Water Cube.

**Math basis.** Weaire–Phelan: 8 cells per unit cell, all equal volume — 2 pyritohedral
dodecahedra (12 pentagonal faces) + 6 tetrakaidecahedra (12 pentagons + 2 hexagons, 14
faces). Relaxed under Plateau's laws to ⟨s⟩ ≈ 5.288, about 0.3% below Kelvin's 5.306.
Still the best known but *not proven optimal* — the 3D Kelvin problem remains open.

**Figures.** (1) Side-by-side Kelvin vs Weaire–Phelan with a live ⟨s⟩ readout and the
0.3% gap called out — the series' money shot. (2) Exploded view of the 8-cell repeat,
the two cell types color-coded (`--c-d12`, `--c-d14`), equal-volume check. (3) The
Water Cube slice: take the structure, cut at the building's angle, get the facade.

**Misreadings to avoid.** Do not say Weaire–Phelan is "the solution" — it is the best
*known*. Do not imply 0.3% is trivial; emphasize a century of belief fell to it. Both
cell types have equal volume — state this, it is the non-obvious constraint.

**Reader takeaway.** The century-old elegant guess loses to a two-cell structure found
by computer. And we still cannot prove the new champion is optimal.

---

## 05 — Why It Recurs

**Pitch.** The Weaire–Phelan geometry is not a foam curiosity — it is everywhere. The
same two cages hold methane inside ice (type-I clathrate hydrate). The same packing is
the β-tungsten / Cr₃Si crystal (the A15 phase). The same structure self-assembles out
of soft blobs: block copolymers, dendrimers, surfactant micelles. Why does one
abstract shape keep materializing? Because they are all solving versions of the same
frustrated problem — pack tetrahedral neighborhoods as evenly as possible, which you
can almost but never quite do.

**Math basis.** A15 / Frank–Kasper: tetrahedrally close-packed, coordination polyhedra
limited to Z12, Z14, Z15, Z16. The Weaire–Phelan cells are (close to) the Voronoi cells
of the A15 sphere arrangement — foam and crystal are dual views of one packing. Type-I
clathrate cages are exactly the 5¹² dodecahedron and 5¹²6² tetrakaidecahedron.
Soft-matter Frank–Kasper phases (A15, σ) reported in block copolymers and dendrimer
melts (Bates and co., ~2010 onward).

**Figures.** (1) Rotatable coordination-shell viewer: pick Z12/Z14/Z15/Z16, see the
polyhedron and its frustration. (2) Foam ↔ crystal duality toggle: the same point set
as packed spheres or as Voronoi foam. (3) Three-instance gallery — clathrate cage, A15
unit cell, soft-matter micelle lattice — all the same topology.

**Misreadings to avoid.** Do not claim Weaire–Phelan and A15 are literally identical
metrically — same topology, the foam is the relaxed Voronoi dual. Keep "tetrahedral
frustration" concrete (regular tetrahedra do not tile 3D; dihedral 70.53° does not
divide 360°). Do not overstate the superconductivity link — A15 matters there for
other reasons; the structure is the point.

**Reader takeaway.** The best foam is also how ice cages gas and how some crystals and
polymers self-organize. The shape is an answer the universe reaches for repeatedly.

---

## 06 — The Lattice Recipe and the 24-Cell

**Pitch.** How do you even propose a foam in a dimension you cannot picture? You build
it from a lattice: scatter points, take each point's Voronoi cell, and you have a
space-filling foam for free. This article makes the recipe explicit and surfaces the
series' central surprise — the lattice that packs spheres best is *not* the lattice
that foams best. In 3D, FCC wins packing, BCC wins (lattice) foam. Then it climbs one
rung to 4D, where the recipe produces the 24-cell, a perfect self-dual jewel with no
3D analog. This is as far as the series reaches, and it is far enough to show the idea
outruns our ability to picture it.

**Math basis.** Voronoi tessellation → monohedral foam (one congruent cell per lattice
point). Packing-vs-partition divergence: FCC/A3 is the densest 3D sphere lattice; BCC
gives the lower-area lattice foam (its Voronoi cell is Kelvin's truncated octahedron).
4D: the 24-cell, self-dual regular polytope, Voronoi cell of the D4 lattice; the
24-cell honeycomb tiles ℝ⁴. D4 is the densest *lattice* packing in 4D.

**Figures.** (1) Lattice → Voronoi foam builder in 2D/3D: pick lattice type (square,
hex, FCC, BCC), watch the foam rebuild, read ⟨s⟩. (2) Packing-vs-partition split
screen: same lattice scored two ways, FCC and BCC trading the crown. (3) 24-cell
rotation (rotating projection or Schlegel), self-duality highlighted.

**Misreadings to avoid.** Do not imply the best foam is always a lattice foam — in 3D
the non-lattice Weaire–Phelan beats every lattice foam. The Voronoi recipe gives good
*candidates*, not proven optima. Do not claim the 24-cell is the proven optimal 4D foam
(it is a candidate; report the literature honestly). No 8D / E8 content — the series
stops here.

**Reader takeaway.** A lattice plus the Voronoi recipe gives a foam in any dimension,
and packing and partition pull toward different lattices. Four dimensions already hands
us a shape — the 24-cell — with no counterpart in the space we live in.

---

## 07 — Foams in Motion

**Pitch.** Every foam so far has been frozen at its optimum. Real foam is alive: leave
it alone and it coarsens — big bubbles eat small ones, walls drift, bubbles pop out of
existence. The astonishing part is how lawful this is. In a 2D foam a bubble's area
changes at a rate that depends only on how many sides it has: six is the knife-edge,
fewer shrink, more grow, and the rule is exact. This closing article shows the
least-area principle not as a static winner but as a force acting over time, and lands
the reader back in a glass of beer foam.

**Math basis.** Coarsening: gas diffuses across films from high (small, curved bubble)
to low pressure, driven by Laplace pressure ∝ curvature; total interfacial area
decreases monotonically. Von Neumann's law (1952, 2D): dA/dt = κ(n − 6), independent of
bubble size and shape — purely topological. Six-sided bubbles are stable; the average
bubble has six sides (Euler). 3D generalization: MacPherson & Srolovitz (*Nature*
2007), growth rate set by a mean-width-minus-edge-length functional. Topological
events: T1 neighbor swaps, T2 bubble disappearances.

**Figures.** (1) Live 2D coarsening simulation: bubbles grow/shrink per von Neumann,
colored by side count, the 6-sided threshold highlighted; watch small ones vanish (T2)
and neighbors swap (T1). (2) The n−6 law as a plot: dA/dt vs sides, a straight line
through 6. (3) Laplace-pressure intuition: two bubbles sharing a wall, gas flowing
from the smaller (more curved) to the larger.

**Misreadings to avoid.** Von Neumann's law is for 2D dry foams; do not apply the n−6
form in 3D (that needs MacPherson–Srolovitz). Coarsening reduces *total* area but is
not the same as solving the Kelvin problem — it is the relaxation dynamics, not the
global optimum. Keep T1 and T2 events distinct.

**Reader takeaway.** The least-area principle is not just a frozen optimum; it is a
force that drives real foams to evolve by an exact topological law. The honeycomb's
120° rule and a pint of foam are the same physics, still running.
