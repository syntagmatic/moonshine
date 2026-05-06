# 07 - Three-fold, five-fold, two-fold

## Pitch

Open Act II by stepping into 3D. The icosahedron has a symmetry group W(H₃) of order 120, with rotation axes in three classes: 12 five-fold axes through pairs of opposite vertices, 20 three-fold axes through pairs of opposite faces, 15 two-fold axes through pairs of opposite edge-midpoints. This is the symmetry every snowflake-shaped molecular cluster wants to have. It is also the symmetry every 3D periodic crystal cannot have.

The crystallographic restriction theorem states that the only rotational symmetries compatible with a periodic 3D lattice are the 1, 2, 3, 4, and 6-fold rotations. Five-fold is forbidden. The proof is one paragraph: a periodic 3D lattice has a translation subgroup ℤ³; any rotational symmetry must permute lattice translations; the trace of the rotation matrix in the lattice basis must be an integer; for a rotation by 2π/n in 3D, the trace is 1 + 2 cos(2π/n); the integer values are −1, 0, 1, 2, 3, giving n ∈ {2, 3, 4, 6, 1}. Five-fold's trace is 1 + 2 cos(72°) = φ, irrational, hence impossible.

The escape hatch is dropping periodicity. An aperiodic tiling has no translation subgroup; the integer-trace argument never starts. Squishy-thing ships the icosahedral H₃ quasicrystal as `h3Quasicrystal(sliceWidth, offset)` — physical dimension 3, internal dimension 5, ambient dimension 8, with a product window `interval(sliceWidth/2) × sixHundredCell(1)`. The H₃ symmetry of the resulting vertex set is empirically finite-radius, not a global theorem; the test in `cut-and-project.test.ts` verifies closure under the four H₃ simple reflections on interior vertices, which is sufficient for a Delone-set symmetry claim without committing to enumerating the full 120-element orbit.

## Math basis

W(H₃) is the icosahedral Coxeter group: order 120, presented by three reflections satisfying (s₁s₂)⁵ = (s₂s₃)³ = (s₁s₃)² = e. Its rotation subgroup A₅ × {±1} has order 60 and is the alternating group on five elements times the center. The H₃ quasicrystal is obtained from the 4D Elser–Sloane scheme by promoting the 4th physical coordinate to internal: (8 → 4) becomes (8 → 3) with a (1 + 4)-dimensional product window. H₃ acts on the physical 3-space; H₄ acts on the ambient 8-space; the orthogonal split in essay 8 makes the action compatible.

## Figures

1. **The three rotation classes** (interactive): a 3D icosahedron with 5-fold, 3-fold, 2-fold axes color-coded and labeled. Reader rotates around any chosen axis and watches the appropriate symmetry act.
2. **The integer-trace argument** (interactive, static layout): a periodic 3D lattice with a candidate rotation; the figure computes the trace in the lattice basis as the rotation angle varies; the trace is integer only at n ∈ {1, 2, 3, 4, 6}. The reader sees 5-fold's trace land at φ, off the integer grid.
3. **Periodic vs. aperiodic with 5-fold** (interactive comparison): two attempts at a 3D tiling with icosahedral symmetry. Periodic attempt: the figure shows the contradiction develop (translates do not commute with rotations). Aperiodic attempt: `h3Quasicrystal` rendered as a 3D vertex cloud, with H₃ symmetry visible.
4. **H₃ quasicrystal interior** (interactive, hero): rotatable 3D rendering of `h3Quasicrystal()` vertex set inside a chosen physical radius. Sliders for slice width and offset. The reader sees the icosahedral symmetry holds at any interior radius.

## Key terms

- `W(H₃)`: the icosahedral Coxeter group, order 120.
- `crystallographic restriction theorem`: only 1, 2, 3, 4, 6-fold rotations are compatible with a periodic 3D lattice.
- `five-fold orientational order`: vertex links come in 12 classes related by 5-fold rotations about the icosahedral axes.
- `H₃ quasicrystal`: the 3D model set produced by `h3Quasicrystal()`; the math object behind Shechtman's 1984 alloy.

## Misreadings to avoid

- Do not say 5-fold rotation is "impossible." It is forbidden in periodic ℤ³; aperiodic order recovers it. The restriction is about periodicity, not about geometry.
- Do not present W(H₃)-symmetry of `h3Quasicrystal` as a global theorem. The shipped test verifies closure under the four simple reflections on interior vertices; full 120-element orbit enumeration is deferred and would require a careful boundary-effect argument.
- Do not conflate H₃ (3D icosahedral) with H₄ (4D 600-cell symmetry). H₃ is the stabilizer of a slice in H₄; essay 8 makes this explicit.
- Do not present icosahedral symmetry as "rare." Many real molecular clusters and viral capsids have it; what was rare before 1982 was *long-range* icosahedral order in solid matter.

## Library substrate

- `h3Quasicrystal(sliceWidth, offset)` in `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts`.
- Test invariant #2 in `cut-and-project.test.ts`: closure under the four H₃ simple reflections on interior vertices.
- `apps/gallery/src/interactives/cut-and-project.ts` includes H₃ rendering options for figure 4.

## Bridge notes

Essay 8 produces the H₃ quasicrystal from the icosian ring inside E8 — the same vertex set, derived from a quaternionic substrate. Essay 9 takes diffraction of the H₃ vertex set and recovers Shechtman's 1984 pattern. Essay 10 tells the discovery story directly.

## Reader takeaway

The icosahedron's three rotation classes — 5-fold, 3-fold, 2-fold — define an order-120 symmetry group that the crystallographic restriction theorem forbids in any periodic 3D lattice. Aperiodic tilings have no translation subgroup, so the restriction never starts. The H₃ quasicrystal is the standard 3D realisation; squishy-thing ships it as `h3Quasicrystal()`.
