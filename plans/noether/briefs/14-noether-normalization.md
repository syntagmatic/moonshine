# 14 — Noether Normalization: Every Algebra Sits Over a Polynomial Ring

## Pitch

Noether normalization (1926) says: every finitely generated algebra `A` over a field `k` contains a polynomial subring `k[y₁, …, y_d]` over which `A` is *finite as a module* — `A` is finitely generated as a `k[y₁, …, y_d]`-module. This is the structural fact that gives dimension theory in algebraic geometry its teeth: the `d` is the dimension of the affine variety `Spec A`, and "finite over a polynomial ring" is exactly the picture of a finite-sheeted cover of affine space `𝔸^d`. This explainer makes the construction concrete on a curve and a surface, picks the linear change of variables that does the work, and leaves the reader seeing any variety as a finite cover of affine space.

## Figures

1. **A curve over k[x].** Take `A = k[x, y] / (y² − x³ + x)` (an elliptic curve). Plot the curve in the real plane; the projection `(x, y) ↦ x` exhibits `A` as a module over `k[x]` of rank 2: every element of `A` is of the form `a(x) + b(x) y`. An animation shows most `x`-values having two `y`-preimages on the curve — the "finite cover" picture. SVG.
2. **A surface over k[u, v].** Take `A = k[x, y, z] / (z² − x y)` (a quadric cone). A rotatable 3D view; the projection `(x, y, z) ↦ (x, y)` makes `A` finite over `k[x, y]` of rank 2: each element is `a(x, y) + b(x, y) z`. SVG with a canvas-projected 3D rendering.
3. **Why a generic linear change works.** When `A = k[x₁, …, x_n] / I`, a generic linear substitution `x_i ↦ x_i + c_i x_n` lets us eliminate `x_n` from at least one generator of `I`, reducing the number of essential variables. Iterate. A step-through animation on the elliptic curve example. Static with interactive steps.
4. **Dimension from d.** A table: variety, Krull dimension `d`, polynomial subring `k[y₁, …, y_d]` it sits finitely over, and the degree of the cover. Reader sees that `d` matches geometric dimension. Static.
5. **Normalization as dimension theory.** A closing card showing how Noether normalization gives Krull dimension: `dim A = d`, the length of the longest chain of prime ideals in `A`, equal to the transcendence degree of the polynomial subring. Static.

## Key formulas / constructions

- Noether normalization: for a finitely generated `k`-algebra `A`, there exist algebraically independent `y₁, …, y_d ∈ A` such that `A` is a finitely generated `k[y₁, …, y_d]`-module.
- The number `d` equals the Krull dimension of `A`.
- Proof sketch (characteristic 0): iteratively change variables `x_n ↦ x_n − Σ c_i x_i` with generic `c_i` to cancel the leading term of a polynomial in `I`. Eliminate one variable per step; what remains is a polynomial ring.
- Example: `A = k[x, y] / (y² − x³ + x)`, finite over `k[x]` with basis `{1, y}`. `dim A = 1`.
- Example: `A = k[x, y, z] / (z² − x y)`, finite over `k[x, y]` with basis `{1, z}`. `dim A = 2`.
- Example: `A = k[x, y] / (xy − 1)`, `A ≅ k[x, x^{−1}]`, finite over `k[x + x^{−1}]`. `dim A = 1`.

## Dependencies

- #13 (Hilbert basis, so every ideal is finitely generated).
- #11 (ideals and quotient rings).
- Lib: `NOETHER.rings.quotient(R, ideal)`, `NOETHER.normalization.find(A)` (for small algebras), `NOETHER.varieties.project(variety, map)`.

## Reader takeaway

The reader can identify the polynomial subring `k[y₁, …, y_d]` of a small quotient algebra and see the whole thing as a finite cover of affine space. They understand that `d` is Krull dimension, and that normalization is what lets algebraic geometry talk about dimension the way topology does — by counting the coordinates of a base. This closes the foundational loop Act III opened.
