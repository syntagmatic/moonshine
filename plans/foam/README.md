# Foam: Dividing Space with the Least Surface

Seven-article interactive series on the least-area partition of space — Kelvin's
problem and its relatives, from the honeycomb to the Weaire–Phelan structure, the
crystals and ice that echo it, and the reach of the same recipe up into four
dimensions.

## Locked plan

**Spine.** One question, asked in dimension after dimension: *what is the least-area
way to divide space into equal cells?* The plane answers cleanly (hexagons, proven).
Three dimensions does not: Kelvin's beautiful guess stood for a century and then lost,
by 0.3%, to a stranger shape that also turns up in metal, ice, and self-assembling
polymers. The series caps its ambition at four dimensions, where the lattice recipe
produces the self-dual 24-cell, and closes by watching real foams refuse to hold
still. Reader endpoint: a working feel for Plateau's laws, the difference between
enclosing volumes and partitioning all of space, why packing and partition are
different optimizations that prefer different lattices, what Weaire–Phelan is and why
it recurs across physics, and how the least-area principle plays out in time.

**Scope note.** An earlier draft climbed to E8 and the high-dimensional "spherical
cubes" result. Per the locked decision, the series stops at 4D — the 8-dimensional
material is out. The two articles that replaced it (the Double Bubble, Foams in
Motion) keep the series concrete and physical, which suits the cap.

**Identity.** Slug `foam`, title *Foam: Dividing Space with the Least Surface*.
Audience is curious generalists with some math comfort; no assumed crystallography or
Coxeter theory. Voice exact and concrete — every claim gets a worked instance, a
manipulable figure, or both. The recurring intellectual move is *packing ≠
partition*: the reader should leave able to say why the best way to pack balls and the
best way to tile cells are different problems with different winners.

**Shape.** Two acts, 7 articles, 4/3 split.

- **Act I — The least-area problem (2D and 3D).**
  1. `01-the-honeycomb` — 2D foam, Plateau's 120° rule, Hales' Honeycomb Theorem.
  2. `02-the-double-bubble` — the proven two-volume optimum; 3D triple junctions, gently.
  3. `03-kelvins-bubble` — the truncated octahedron, BCC, the century-long conjecture.
  4. `04-the-counterexample` — Weaire–Phelan, the 0.3%, the Surface Evolver, the Water Cube.
- **Act II — Recurrence, reach, and motion.**
  5. `05-why-it-recurs` — Frank–Kasper / A15 / clathrates: the same geometry in metal, ice, soft matter.
  6. `06-the-lattice-recipe` — Voronoi foams, packing-vs-partition divergence, the 4D 24-cell.
  7. `07-foams-in-motion` — coarsening and von Neumann's law; the least-area principle in time.

**Editorial center of gravity.** Math ladder is the spine, but it tops out at 4D
rather than 8D. Physics (soap, crystals, ice, polymers, coarsening) is woven through
as grounding and as the answer to "why should I care," and Act II leans into it.
Article 4 (Weaire–Phelan) is the structural peak; article 7 (motion) is the grounded
coda that returns the reader to a real, living foam.

**Visual style.** Manipulable figures first, every visual exposes a parameter.
Signature interactives: a 2D wet→dry foam that relaxes to 120° vertices under drag; a
draggable double-bubble cluster with a bowing central wall; a Kelvin-vs-Weaire–Phelan
side-by-side with a live dimensionless-surface-area readout; a rotatable Frank–Kasper
coordination-shell viewer; a 24-cell rotation; and a live 2D coarsening simulation
showing von Neumann's n−6 law. Avoid decorative renders — no spinning polyhedron
without a control attached.

**Rendering stack.** Standalone HTML/CSS/JS, no build step, D3 v7 + KaTeX from CDN,
fonts per house style. 3D (truncated octahedra, the two WP cells, the 24-cell) is
**hand-rolled canvas** (locked decision): a shared `docs/foam/lib/foam3d.js` helper
(`project`, `sortFaces`, `drawCell`) with painter's-algorithm face sorting, no new
dependency, fully inspectable. Curved relaxed-foam faces are approximated as
flat-faceted with edge highlighting rather than true minimal-surface meshes.

## Research grounding

Anchors, not transcripts.

- Weaire & Hutzler, *The Physics of Foams* (1999) — canonical reference for Plateau's
  laws, Kelvin, Weaire–Phelan, and foam coarsening. Articles 1, 3, 4, 7.
- Weaire & Phelan, "A counter-example to Kelvin's conjecture on minimal surfaces,"
  *Phil. Mag. Lett.* 69 (1993). Article 4. Cite directly.
- Hales, "The Honeycomb Conjecture," *Discrete Comput. Geom.* 25 (2001). Article 1.
- Hutchings, Morgan, Ritoré, Ros, "Proof of the double bubble conjecture," *Ann.
  Math.* 155 (2002); Hass & Schlafly (equal-volume case, 1995). Article 2.
- Frank & Kasper, "Complex alloy structures regarded as sphere packings," I & II,
  *Acta Cryst.* (1958–59). Article 5.
- Conway & Sloane, *Sphere Packings, Lattices and Groups* (SPLAG) — Voronoi cells of
  BCC and D4, the lattice-foam framing. Article 6.
- von Neumann (1952) on 2D grain/bubble coarsening; MacPherson & Srolovitz, "The von
  Neumann relation generalized to coarsening of three-dimensional microstructures,"
  *Nature* 446 (2007). Article 7.

## Key terms

Introduce each once, do not silently reuse.

- `Kelvin problem` — partition ℝⁿ into unit-volume cells minimizing the (n−1)-area of
  the shared interfaces. Distinct from sphere packing. Open for all n ≥ 3.
- `Plateau's laws` — equilibrium rules for soap films (Taylor 1976): smooth faces;
  three faces meet along an edge at 120°; four edges meet at a vertex at the
  tetrahedral angle arccos(−1/3) ≈ 109.47°.
- `isoperimetric problem` — least area enclosing a *single* fixed volume → the sphere.
  The one-cell root of the whole series.
- `double bubble` — least-area surface enclosing and separating *two* volumes; for
  equal volumes, two caps meeting a flat disk at 120°. A proven theorem (2002).
- `dimensionless surface area` ⟨s⟩ — area per cell normalized to unit cell volume,
  the quantity the Kelvin problem minimizes. Kelvin ≈ 5.306, Weaire–Phelan ≈ 5.288.
- `truncated octahedron` — 14 faces (8 hexagons, 6 squares), Voronoi cell of the BCC
  lattice; Kelvin's (relaxed) cell.
- `Weaire–Phelan structure` — periodic foam, 8 cells per repeat: 2 pyritohedral
  dodecahedra (12 pentagons) + 6 tetrakaidecahedra (12 pentagons, 2 hexagons), all
  equal volume. Best known solution to the 3D Kelvin problem; not proven optimal.
- `A15 / Frank–Kasper` — tetrahedrally close-packed structure; the sphere
  arrangement whose Voronoi cells are (close to) the Weaire–Phelan cells. Same
  topology as β-tungsten (Cr₃Si) and the type-I clathrate hydrate cages.
- `Voronoi cell` — the region closer to one lattice point than any other; the recipe
  that turns a lattice into a foam.
- `packing ≠ partition` — the series' refrain: the densest sphere lattice and the
  least-area foam lattice differ (3D: FCC packs, BCC foams).
- `24-cell` — self-dual regular 4-polytope, Voronoi cell of the D4 lattice; the
  series' top rung in dimension.
- `coarsening` — slow evolution of a foam as gas diffuses across films; total area
  drops over time. Governed in 2D by von Neumann's law (rate ∝ n−6).

## Status

Articles 01-03 built (`docs/foam/`), 04-07 not started; series not yet registered on
the homepage. Center of gravity (math ladder capped at 4D) and 3D
rendering (hand-rolled canvas) are locked. Title provisional. Claims to verify before
each build are tracked in `CLAIMS.md`.
