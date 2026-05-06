# 01 - The Fibonacci tiling

## Pitch

Open the series with the smallest cut-and-project: a one-dimensional tiling produced by projecting the integer lattice ℤ² onto a line of irrational slope. The figure shows the whole machine on one page. A periodic 2D lattice; a line through it at slope 1/φ; an acceptance strip a fixed width above and below the line; whichever lattice points fall inside the strip get projected down to the line. The result is a non-repeating 1D sequence with exactly two tile lengths, in ratio φ:1.

The page should make two distinctions immediately visible. *Random vs. aperiodic*: the Fibonacci sequence is fully deterministic — given slope and window, exactly one such tiling exists — but it never repeats. *Rational vs. irrational slope*: at slope p/q the projection is periodic with period determined by p and q; at the irrational limit, periodicity vanishes and the two-tile structure stabilizes.

This is the visual-grammar opener: the strip-and-projection figure and the warm/cool physical-vs-internal palette will recur in essays 2, 4, 6, 8, and 9, doing the same work at successively higher dimension.

## Math basis

The Fibonacci scheme is the cut-and-project quadruple (Λ, π_∥, π_⊥, W) where Λ = ℤ², π_∥ projects to the line of slope 1/φ, π_⊥ projects to the orthogonal direction, and W is an interval of half-width φ²/(2·√(1+φ²)) ≈ 0.688 — the minimal width that produces exactly two tile lengths in ratio φ:1. The model set Λ★ = { π_∥(p) : p ∈ ℤ², π_⊥(p) ∈ W } is the 1D Fibonacci tiling. Squishy-thing ships this as `fibonacciScheme()` in `cut-and-project.ts`.

## Figures

1. **The strip and the projection** (interactive, hero): ℤ² lattice with the slope-1/φ line and the acceptance strip drawn parallel to it. Lattice points inside the strip light up; their projections appear as the 1D tiling below. Drag the line angle and strip width.
2. **Rational vs. irrational** (interactive): slope slider with detents at successive Fibonacci ratios (1/2, 2/3, 3/5, 5/8, 8/13, …) approaching 1/φ. At each rational, the projection is periodic; the period grows with the denominator; at the irrational limit, periodicity vanishes.
3. **Window width matters** (interactive): too narrow gives gaps; w ≈ 0.688 gives exactly two tile lengths in φ ratio; too wide multiplies tile lengths. The figure surfaces the precise width as a number so the choice reads as computable, not chosen.
4. **Two patches, no match** (interactive): two draggable windows on the projected tiling. The reader can find finite patches that match exactly (at φ-related distances) but no translation that maps the whole tiling to itself.
5. **Anatomy card** (static): the four-part object (Λ, π_∥, π_⊥, W) labeled, with the warm/cool palette convention. Recurs un-annotated in later essays.

## Key terms

- `cut-and-project scheme`: the four-part object (Λ, π_∥, π_⊥, W). First introduction; essay 2 elaborates.
- `model set`: the projected vertex set Λ★.
- `physical projection π_∥` / `internal projection π_⊥`: the two halves of the orthogonal split. Color convention introduced here.
- `acceptance window W`: the bounded region in internal space that gates which lattice points are kept.
- `aperiodic order`: order without translational periodicity. Named here for the first time.

## Misreadings to avoid

- Do not equate "irrational slope" with "random." The tiling is deterministic.
- Do not present the two-tile-lengths-in-φ-ratio outcome as a coincidence. Window width forces it; widen W and tile lengths proliferate.
- Do not gloss the physical/internal role assignment. The slope-1/φ line is physical because the tiling lives there; the orthogonal direction is internal because it gates membership.
- Do not imply this is merely a toy. The same recipe at higher ambient dimension produces Penrose, the H₃ quasicrystal, and Elser–Sloane.

## Library substrate

- `fibonacciScheme()` and `project(scheme, bounds)` in `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts`.
- `apps/gallery/src/interactives/fibonacci-phason.ts` — shipped interactive available for iframe embed in figure 1 (with the phason slider hidden until essay 6).
- `cut-and-project.test.ts` test invariants: φ-ratio of tile lengths; sinc-envelope diffraction.

## Bridge notes

Essay 2 generalizes the recipe. Essay 3 examines the ℤ[φ] arithmetic that makes "exactly two tile lengths in φ ratio" computable. Essay 4 instantiates the same construction at ambient dim 5 → physical 2 (Penrose). Essay 6 activates the phason slider hidden in figure 1.

## Reader takeaway

Aperiodic order is exact and constructive. Rational slope gives periodicity; irrational slope gives a non-repeating tiling with finitely many tile lengths. Window width chooses how many lengths. The whole recipe is four objects — lattice, physical projection, internal projection, window — and the rest of the series is what happens when you change one of them.
