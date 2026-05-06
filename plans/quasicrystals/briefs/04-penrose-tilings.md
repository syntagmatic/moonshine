# 04 - Penrose tilings as projection

## Pitch

The famous 2D case. Penrose discovered the kite-and-dart and rhomb tilings in the 1970s through *local matching rules*: tiles decorated with arcs, allowed to meet only when arcs join continuously. The rules force aperiodicity — no Penrose tiling repeats — without ever quoting a global construction. A decade later, de Bruijn showed that the same tilings arise from a 5D periodic lattice projected onto a 2D plane: ℤ⁵ → ℝ² along the (1, 1, 1, 1, 1) axis, with the window the projection of the unit cube. Squishy-thing realises Penrose differently — as a double-slice descent from the 8D Elser–Sloane scheme — but the output vertex set is the same.

Two equivalent definitions, one tiling. The essay's central move is to put them side by side and watch them produce the same patches. Matching rules force aperiodicity through local constraints; cut-and-project does it through global projection geometry; the equivalence (for Penrose specifically) is a theorem, not an obvious fact. Essay 11 will return to this and show where the equivalence breaks for other constructions.

The H₂ symmetry: Penrose tilings have local 5-fold orientational order. The crystallographic restriction theorem forbids 5-fold rotational symmetry in any periodic 2D or 3D lattice. Penrose's tilings are the standard counterexample-by-construction; aperiodicity is what buys back the forbidden symmetries.

## Math basis

Classical: ambient Λ = ℤ⁵; physical projection along (1,1,1,1,1)/√5; window is the projection of the unit cube into the orthogonal 3D internal space. Squishy-thing: `penroseFromE8(sliceWidth3, sliceWidth2, offset)` realises Penrose at ambient 8D, physical 2D, internal 6D, with a nested `interval × interval × sixHundredCell` product window — promoting coords 2 and 3 of the Elser–Sloane physical frame to internal. The default Cartesian-axis slicing is 2-fold in the icosian convention; strict 5-fold Penrose symmetry requires a rotated basis aligned with an H₄ 5-fold axis (deferred follow-up, not yet shipped).

## Figures

1. **Kites and darts** (interactive): the two tile shapes drawn with their arc decorations. Reader places tiles; the figure flags rule violations in real time. Demonstrates the local-constraint definition.
2. **The classical projection** (interactive): ℤ⁵ rendered as a 5D hypercube; projection direction (1,1,1,1,1) shown; window as projected cube. Reader can rotate the projection axis and watch the resulting 2D vertex set deform.
3. **Two paths, same vertex set** (interactive comparison): build a Penrose patch via matching-rule placement on the left; build the same patch via cut-and-project on the right. The figure superimposes them at the end.
4. **5-fold orientational order** (static): a Penrose tiling with the 5 distinct edge orientations color-coded. Compared to a periodic tiling at the same density (no 5-fold possible).
## Key terms

- `matching rule`: local constraint on tile adjacency that forces aperiodicity.
- `kite, dart, thick rhomb, thin rhomb`: the four standard Penrose tile shapes, in two equivalent dual systems.
- `5-fold orientational order`: vertex-link orientations come in 5 classes related by 72° rotations.
- `crystallographic restriction theorem`: in periodic ℤ² and ℤ³ lattices, only 1, 2, 3, 4, 6-fold rotations are allowed. 5-fold is forbidden.

## Misreadings to avoid

- Do not claim matching rules and cut-and-project are equivalent in general. They are for Penrose; essay 11 shows examples where they are not.
- Do not say "Penrose tilings are quasicrystals" without qualification. They are quasicrystal *tilings*; "quasicrystal" in the strict sense refers to the diffraction-positive object (essay 9).
- Do not say 5-fold periodic crystals are "impossible." They are forbidden in periodic ℤ² and ℤ³ Euclidean lattices; aperiodic tilings recover them. The restriction is about periodicity, not about geometry per se.
- Do not present `penroseFromE8`'s default slice as canonical 5-fold Penrose; it is 2-fold by construction. A 5-fold-aligned basis is the follow-up.

## Library substrate

- `penroseFromE8(sliceWidth3, sliceWidth2, offset)` in `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts`.
- `apps/gallery/src/interactives/penrose-phason.ts` — shipped Penrose interactive; figure 1 or 3 can iframe-embed it.
- A classical (5 → 2) implementation is not yet in squishy-thing; if the essay needs it for figure 2, it can be a small inline implementation in `quasi-viz.js`.

## Bridge notes

Essay 5 inflates Penrose tilings by φ and shows the same vertex set is its own scaled subset. Essay 7 generalizes 5-fold to icosahedral H₃ in 3D. Essay 11 returns to matching rules and substitutes them for cut-and-project where the equivalence breaks.

## Reader takeaway

Penrose tilings have two equivalent definitions: local matching rules and cut-and-project from a higher-dimensional periodic lattice. Both produce the same vertex set. They have 5-fold orientational order — exactly the symmetry the crystallographic restriction theorem forbids in periodic 2D and 3D. The escape hatch is dropping periodicity.
