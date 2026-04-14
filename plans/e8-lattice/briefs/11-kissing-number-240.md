# 11 — Kissing Number 240 and Why It's Optimal

## Pitch

The kissing number question asks: how many equal spheres can simultaneously touch a central sphere without overlapping? In 8 dimensions the answer is exactly 240, achieved by the E8 root configuration, and optimality was proven by Odlyzko and Sloane in 1979 using a linear-programming bound that meets the E8 lower bound on the nose. This explainer explains *why* the LP bound works — an elegant argument using positive-definite functions on the sphere — sketches the specific function that pinches the bound to 240, and shows why 8 and 24 are the two dimensions where the LP bound is known to be tight. The reader leaves knowing not just "the answer is 240" but "here is the shape of the proof."

## Figures

1. **Recap: kissing across dimensions.** Table of best-known kissing numbers in dimensions 1 through 24, with the proven-optimal rows highlighted (n = 1, 2, 3, 4, 8, 24). SVG.
2. **The LP bound, in words and formulas.** Show the Delsarte-Goethals-Seidel inequality for spherical codes: if `f` is a positive-definite function on [−1, 1] with `f(t) ≤ 0` for `t ≤ 1/2`, then the kissing number is bounded by `f(1) / f(0)` (after normalization). SVG with KaTeX.
3. **The specific function for dimension 8.** The Odlyzko–Sloane witness is a specific polynomial in the Gegenbauer expansion whose coefficients pinch the bound to exactly 240. Plot the function and mark its root at 1/2. SVG.
4. **Bound meets lower bound.** Chart showing the LP upper bound and the E8 lower bound (240) as a function of dimension 8, both hitting the same value. The gap closes. SVG.
5. **Why only 8 and 24?** For most dimensions the LP bound is strictly greater than the best-known lower bound. Show the gap graphically across dimensions 1–24. SVG.
6. **Historical note.** Odlyzko & Sloane 1979, Levenshtein 1979 (simultaneous independent proofs), and the parallel story for the Leech lattice in dimension 24. Static.

## Key formulas / constructions

- Kissing number problem: maximum `N` such that `N` unit vectors in ℝⁿ exist with pairwise inner products ≤ 1/2.
- LP bound (Delsarte): `N ≤ (Σ_k f_k) / f_0`, where `f_k` are Gegenbauer coefficients of a function `f` satisfying positivity conditions.
- E8 achieves 240 via its root system: the 240 roots normalized to unit length have pairwise inner products in {−1, −1/2, 0, 1/2, 1}, so any two distinct normalized roots satisfy `⟨α, β⟩ ≤ 1/2`.
- Tight dimensions: 1, 2, 3, 4, 8, 24 — proven; all others have a gap.

## Dependencies

- #01 (kissing number definition).
- #03 (240 roots, inner-product structure).
- #10 (lattice vs root system distinction — we're asking about the minimal shell specifically).
- Lib: `E8.roots.all()` (normalized), `E8.kissingConfiguration` (returns the 240 normalized unit vectors).

## Reader takeaway

The reader can state the kissing number in 8 dimensions, knows it is 240, knows it is achieved by E8, and understands the structure of the LP-bound proof. They can sketch *why* the inequality works even if they can't reproduce the specific polynomial. They know that 8 and 24 are the only dimensions above 4 where kissing is proven tight, and they are ready to hear that the same LP machinery, with a much cleverer function, will work for sphere packing in dimension 8 — but only after 37 more years of waiting for Viazovska.
