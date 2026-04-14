# 09 — Projection Pluralism

## Pitch

The Coxeter plane is canonical, but it is one shadow out of infinitely many. Rotate the projection plane continuously through 8D and the 240 roots project to a continuously deforming family of 2D shadows — sometimes with accidental symmetries, sometimes generic and blobby, sometimes revealing substructures that the Coxeter plane hides. This explainer gives the reader a real-time projection-plane rotator and walks through the family of shadows. The lesson: every picture of E8 is a choice, no single picture is the "true" one, and learning to move between projections is how you actually see 8D.

## Figures

1. **The projection rotator (centerpiece).** Canvas with real-time manual projection math. Two sliders parameterize a 2D slice of the 12-dimensional Grassmannian Gr(2, 8); the 240 roots project to 2D and redraw every frame. The slice is constructed explicitly:
   - **Baseline at (0, 0):** the Coxeter plane from explainer #08.
   - **Slider 1 ("tilt"):** applies a Givens rotation in a 2-plane `(e₁, f₁)` where `f₁ = c · e₁` with `c` the Coxeter element. This smoothly tilts the Coxeter plane out of its canonical position without losing orthonormality.
   - **Slider 2 ("twist"):** applies a second Givens rotation in an orthogonal 2-plane `(e₂, f₂)` constructed the same way.
   - **Preset buttons** snap to pre-computed canonical planes: Coxeter (H₂), H₃, F₄, "integer-axis" `(e₁, e₂)` as a deliberately boring baseline, and one "generic random" plane computed once at page load. When a preset lies *off* the 2-slice the sliders cover, the projection jumps there and the sliders grey out with a tooltip reading "off-slice — sliders disabled until you return to local mode."
   - **Annotation:** a small info line above the rotator: *"You are exploring a 2D window into a 12-dimensional space of projection planes. Presets jump outside the window."*
   
   This is the single most technically demanding figure in the series and the reason we pay the 2D-canvas-with-manual-projection cost.
2. **Canonical stops on the family tour.** Preset buttons for specific planes: Coxeter plane (H₂ symmetry of order 30), H₃ plane (icosahedral projection), F_4 plane, "accidentally square" plane, and a generic "typical" plane. Each preset lets the reader jump to a known-good projection. SVG with canvas overlay.
3. **Symmetry index.** For the currently-selected projection, compute and display: the number of distinct radii (how many rings), the highest rotational symmetry order, whether the shadow is point-symmetric. Live-updating panel. SVG.
4. **The Coxeter plane is special but not unique.** Overlay the canonical Coxeter plane beside the currently-selected plane side by side, with a similarity metric computed in real time. SVG + canvas.
5. **What invariants survive?** Static figure listing what *does not* change across projections: the inner-product structure, the edge set, the Weyl group action. The projection is a lossy viewing lens; the underlying object is the same.

## Key formulas / constructions

- Projection onto a 2-plane: choose orthonormal basis `(e₁, e₂)` for the plane, then `project(x) = (⟨x, e₁⟩, ⟨x, e₂⟩)`.
- Grassmannian dimension: `dim Gr(2, 8) = 2 · (8 − 2) = 12`. The sliders expose a 2-dimensional slice; the presets live anywhere in the full 12D space.
- Givens rotation in the `(e_i, e_j)` plane: `R_{ij}(θ)` fixes all axes except `e_i`, `e_j`, which it rotates by `θ`.
- Slider 1 applies `R_{e₁, f₁}(θ₁)` to the Coxeter plane basis, where `f₁ = c · e₁` and `c` is the Coxeter element.
- Slider 2 applies `R_{e₂, f₂}(θ₂)` with `f₂ = c · e₂`, orthogonally to slider 1's rotation.
- Special planes via eigendecomposition of Weyl group elements: Coxeter plane from `c`, H₃ plane from a specific order-10 element, F₄ plane from a specific order-12 element, etc. These are the preset targets.

## Dependencies

- #08 (Coxeter plane is the canonical reference point in the family).
- #05 (Weyl group elements as the source of "symmetric" projection planes).
- #06 (edge set that persists across projections).
- Lib: `E8.project.ontoPlane(roots, e1, e2)`, `E8.project.presets` (a dictionary of canonical plane bases).

## Reader takeaway

The reader has physically rotated the projection plane and watched the shadow change. They understand that no single picture of E8 is canonical beyond the Coxeter plane's special role, and that seeing E8 in 8 dimensions is exactly the exercise of moving between projections. They know how to identify "symmetric" projections as those coming from eigenplanes of Weyl group elements. The centerpiece rotator is also a tool they can return to when any future explainer says "consider the projection where...".
