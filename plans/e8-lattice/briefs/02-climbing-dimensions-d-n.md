# 02 — Climbing Dimensions: the D_n Family

## Pitch

The D_n family is the natural generalization of the 2D checkerboard and 3D face-centered cubic: integer vectors whose coordinate sum is even. It gives us a single uniform recipe for "the best lattice you can easily write down" in every dimension, and by computing its kissing number as 2n(n−1) we can watch the numbers climb — 4, 12, 24, 40, 60, 84, 112 — and learn that D_n is optimal in dimensions 3, 4, 5 but stops being the answer somewhere higher up. The explainer sets up the question the series is built around: *something beats D_8 in dimension 8, and its name starts with E.*

## Figures

1. **D_n definition.** Interactive — set n via slider, see the rule "even coordinate sum" applied to a coordinate grid. For n=2 confirm D_2 = square lattice (rotated). For n=3 confirm D_3 = FCC (rotated). Canvas for n=3 view with depth cues.
2. **Root count table.** Dimensions 2 through 10, computing 2n(n−1) directly, highlighting n=8 at 112. SVG.
3. **The D_n dimension climb.** Line chart: kissing number vs dimension for D_n, alongside the best-known kissing number in each dimension. The gap at n=8 between 112 (D_8) and 240 (E_8, grayed out as "next time") is the payoff panel. SVG.
4. **D_4 in parallel coordinates.** Its 24 minimal vectors drawn as polylines across 4 axes. This is our bridge from "3D I can rotate" to "higher dimensions I can only see in projection." SVG.
5. **Historical milestones table.** Which mathematicians proved D_n optimal in which dimension, with dates (e.g. Kepler–Hales for 3D, Cohn–Kumar for 4D–8D in 2003). Static.

## Key formulas / constructions

- D_n = { x ∈ ℤⁿ : Σ xᵢ ∈ 2ℤ }.
- Minimal vectors of D_n: all permutations of (±1, ±1, 0, ..., 0) with exactly two non-zero entries.
- Kissing number of D_n = 2n(n−1). Verification for n=2: 4; n=3: 12; n=8: 112.
- D_n ⊂ ℤⁿ with index 2.

## Dependencies

- #01 (lattice, kissing number, projection-idiom vocabulary).
- Lib: introduces `E8.roots.integer(n)` for D_n roots (subset of what `E8.roots.all()` will return).

## Reader takeaway

The reader can construct D_n in any dimension, compute its kissing number, and see on a chart that dimension 8 has a "step up" that D_n does not explain. They have seen parallel coordinates as a tool for looking at high-D vectors without projecting to 2D/3D, which becomes load-bearing when the 240 E8 roots arrive in the next explainer.
