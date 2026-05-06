# 06 - Phason flips

## Pitch

Activate the slider essay 1's hero figure has been hiding. The acceptance window has a position parameter — an offset `o` in the internal space — and sliding it produces a continuous family of distinct quasicrystal tilings. As `o` moves, lattice points whose internal projection enters the window appear in the physical tiling; points whose internal projection leaves it disappear. Each crossing is a *phason flip*: a discrete, local change to the vertex set, occurring exactly when an internal projection meets a window face.

Two further moves close the essay. First, distinguish *generic* offsets (no internal projection lies on a window face) from *singular* ones (one or more do). Generic offsets give vertex-by-vertex changes under small perturbations; singular offsets are where the tiling's topology jumps. Second, name what is preserved across the family: any two generic offsets give tilings that are *not* equal as point sets but share the same finite-radius patch statistics — they sit in the same *local-isomorphism class*. The space of offsets is a torus, a circle for Fibonacci, the 8-torus T⁸/E₈ for Elser–Sloane in essay 8.

## Math basis

For a scheme (Λ, π_∥, π_⊥, W) and offset `o ∈ E_⊥`, the offset model set is Λ★(o) = { π_∥(p) : p ∈ Λ, π_⊥(p) + o ∈ W }. Squishy-thing exposes the offset as first-class: `withOffset(scheme, newOffset)` updates the scheme; `windowSignedDistance(window, point)` returns the signed distance to the window boundary; `offsetGenericity(modelSet, ε)` returns `{ generic, minDistanceToBoundary, nearestBoundaryIndex }`. An offset is generic iff every internal projection sits at least ε from a window face.

## Figures

1. **The phason slider** (interactive, hero): Fibonacci tiling with a draggable `o`, plus the strip diagram from essay 1 alongside showing the acceptance interval translating in internal space. Per-vertex acceptance state highlighted; a flip counter increments at each boundary crossing.
2. **Boundary distance graph** (interactive): a plot of "distance from the nearest internal projection to a window face" as a function of `o`. Generic offsets fill the circle; singular offsets are the isolated zeros. The reader sees the singular set is measure-zero.
3. **Patch matching across offsets** (interactive): pick a finite patch at one offset; the figure finds the same patch under translation at a different offset. Makes the local-isomorphism class concrete.
4. **Generic vs. singular** (interactive comparison): two phason sweeps side by side, one ending generic, one ending singular. The reader sees the singular endpoint as a vertex-set jump rather than a continuous reorganization.
5. **Torus card** (static): the space of offsets as a circle for Fibonacci, with a hint of the higher-dimensional torus that essay 8 will need.

## Key terms

- `phason offset o`: the position parameter of the acceptance window.
- `phason flip`: a discrete vertex-set change at a window-boundary crossing.
- `generic offset`: no internal projection on a window face; small changes give small vertex-set changes.
- `singular offset`: one or more internal projections on a window face; the vertex set jumps.
- `local-isomorphism class`: model sets sharing finite-radius patch statistics. Parametrized by the offset torus.

## Misreadings to avoid

- Do not conflate the mathematical phason (offset) with the physical phason (a dynamical mode in real quasicrystals). The math object is the offset itself.
- Do not call phason flips "small perturbations." At singular offsets, they are discontinuous; at generic offsets, they are local but discrete.
- Do not say two offsets give "the same tiling." They give *locally isomorphic* tilings — equal patch statistics, not equal point sets.
- Do not present any offset as canonical. The default `o = 0` is a convention; for Elser–Sloane it is in fact singular at modest radii and is documented as such.

## Library substrate

- `withOffset`, `windowSignedDistance`, `offsetGenericity` in `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts`.
- Test invariant #5 in `cut-and-project.test.ts`: two generic nearby offsets differ by < 5% of vertices; crossing a singular offset accumulates strictly more flips than staying on one side.
- `apps/gallery/src/interactives/fibonacci-phason.ts` and `penrose-phason.ts` — the Fibonacci version is the right embed for figure 1.

## Bridge notes

Essay 6 closes Act I. The phason machinery is reused in essay 9 (diffraction amplitudes carry an `e^{2πi⟨k_⊥, o⟩}` phase factor; positions are offset-invariant) and essay 11 (substitution tilings have their own LI parametrization, which sometimes does not coincide with a cut-and-project offset torus). The torus card foreshadows the 8-torus in essay 8.

## Reader takeaway

The acceptance window has a position. Sliding it through internal space produces a continuous family of distinct quasicrystal tilings parametrized by a torus. Generic offsets reorganize vertex-by-vertex; singular offsets jump. All sit in one local-isomorphism class — different point sets, identical patch statistics.
