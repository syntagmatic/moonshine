# 03 — Meet E8: the 240 Roots

## Pitch

This is the first time the reader sees all 240 roots of E8 explicitly. The construction is a two-family recipe: take all 112 D_8 roots (the integer vectors with two non-zero coordinates each ±1), and glue on 128 half-integer vectors whose 8 coordinates are each ±½ with an even number of minuses; together they form a set with extraordinary regularity — every vector has squared length 2, and every pair has inner product in {−2, −1, 0, 1, 2}. The explainer's centerpiece is a coordinate workbench where the reader picks any two roots, sees their 8 coordinates side by side, and watches the inner product and squared length computed live — the point being that E8 is a completely concrete object the reader can check with arithmetic, not a mystical symbol from physics papers.

## Figures

1. **Integer family, parallel coordinates.** All 112 D_8 roots as polylines across 8 axes. Hover to highlight one root and read its coordinates. SVG.
2. **Half-integer family, parallel coordinates.** All 128 half-integer roots as polylines, color-contrasted with family 1. Hover highlights one. SVG.
3. **All 240 together.** Combined view with family-colored polylines. Toggle buttons for "integer only," "half-integer only," "both." SVG.
4. **Coordinate workbench (the centerpiece).** Interactive table. Pick two roots from sortable lists; see their 8 coordinates in aligned columns; watch the inner product and squared length of each computed live. Filter by family, sort by coordinate sum, by number of minuses, by chosen projection value. The reader can verify ⟨αᵢ, αⱼ⟩ for any pair. SVG + DOM table.
5. **Inner-product histogram.** Compute ⟨α, β⟩ for all C(240,2) pairs of distinct roots. Bar chart with spikes at −2, −1, 0, 1, 2. Demonstrates the claim that the inner product never exceeds 2 in absolute value. SVG.
6. **Combinatorial count.** Static figure explaining 112 = 4 · C(8,2) and 128 = 2⁷, with the total 240 arrived at by addition, not asserted.

## Key formulas / constructions

- Integer family (112 roots): { ±eᵢ ± eⱼ : 1 ≤ i < j ≤ 8 }, giving 4·C(8,2) = 112.
- Half-integer family (128 roots): { (ε₁/2, ..., ε₈/2) : εᵢ ∈ {±1}, #{i : εᵢ = −1} is even }, giving 2⁷ = 128.
- Squared length: Σᵢ xᵢ² = 2 for every root in both families.
- Pairwise inner products ⟨α, β⟩ ∈ {−2, −1, 0, 1, 2}, with ±2 only when β = ±α.

## Dependencies

- #01 (lattice, minimal vector, inner product).
- #02 (D_n construction — the 112 integer roots are exactly the D_8 roots).
- Lib: `E8.roots.all()`, `E8.roots.integer()`, `E8.roots.halfInteger()`, `E8.dot(a, b)`, `E8.squaredLength(a)`. This is the first explainer that *requires* the shared lib.

## Reader takeaway

The reader has seen the 240 roots with their own coordinates, verified their squared lengths hands-on, and understands that the two families together produce exactly 240 by an honest combinatorial count. They no longer think of E8 as an abstract symbol; it is a specific finite set of arithmetic vectors. They can answer "how many roots does E8 have, and where do they come from?" without looking it up.
