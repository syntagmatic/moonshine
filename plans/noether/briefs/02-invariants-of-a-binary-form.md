# 02 — Invariants of a Binary Form

## Pitch

In 1907, Noether's doctoral thesis was on invariants of ternary biquadratic forms — the computational end of a branch of 19th-century mathematics that would be largely supplanted by abstract methods within two decades and then return, transformed, as her own abstract algebra. This explainer takes the reader into the simpler case she grew up on: binary forms `f(x, y) = a x² + b x y + c y²` and `f(x, y) = a x³ + b x²y + c x y² + d y³`. Under a linear substitution `(x, y) ↦ (αx + βy, γx + δy)` the coefficients shuffle in a complicated way, but a few special quantities — the discriminant above all — stay put up to a power of `det M`. By the end, the reader has watched the discriminant survive every GL₂ substitution they throw at it, and has felt why a career built on such computations left Noether hungry for the abstract method.

## Figures

1. **A quadratic form, visualized.** A plot of `a x² + b x y + c y²` as a shaded height over the unit disk. Sliders for `(a, b, c)`. Level curves shift from ellipses to hyperbolas as the discriminant crosses zero. SVG.
2. **Transformation workshop.** Sliders for `(α, β, γ, δ)` define `M ∈ GL₂(ℝ)`. Apply `M` to the form; coefficients `(a, b, c)` update live. The discriminant `Δ₂ = b² − 4ac` is displayed beside them and transforms as `(det M)² · Δ₂`. A "normalize to SL₂" toggle divides by `(det M)²` and shows `Δ₂` fixed. SVG.
3. **Cubic forms and the cubic discriminant.** The same workshop for the binary cubic, with discriminant `Δ₃ = 18abcd − 4b³d + b²c² − 4ac³ − 27a²d²`. Under `M ∈ GL₂`, `Δ₃ ↦ (det M)⁶ · Δ₃`. Reader drags the form, watches `Δ₃` survive. SVG.
4. **An orbit in coefficient space.** Restrict to `det M = 1`. Starting from `x² − y²`, sample many `SL₂` images and plot their coefficient vectors `(a, b, c)`. The cloud lies on a 2D surface of constant `Δ₂`. SVG.
5. **Historical vignette.** A scanned page from Noether's 1907 thesis with a KaTeX overlay translating one equation into modern notation, and a one-sentence caption on Paul Gordan's symbolic-computation school. Static.

## Key formulas / constructions

- Binary quadratic: `f(x, y) = a x² + b x y + c y²`, discriminant `Δ₂ = b² − 4ac`.
- Under `M ∈ GL₂`: `Δ₂ ↦ (det M)² · Δ₂`.
- Binary cubic: `f(x, y) = a x³ + b x²y + c x y² + d y³`, discriminant `Δ₃ = 18abcd − 4b³d + b²c² − 4ac³ − 27a²d²`.
- Under `M ∈ GL₂`: `Δ₃ ↦ (det M)⁶ · Δ₃`.
- Weight rule: the discriminant of a binary form of degree `n` is a relative invariant of weight `n(n−1)`.
- Hilbert's finiteness theorem (1890): the ring of polynomial invariants of `GL_n` acting on forms in `n` variables, over a field of characteristic zero, is finitely generated. This is the result that ended the symbolic program and prefigured Act III.

## Dependencies

- #01 (group action and invariant function).
- Lib: `NOETHER.forms.quadratic(a, b, c)`, `NOETHER.forms.cubic(a, b, c, d)`, `NOETHER.forms.transform(form, M)`, `NOETHER.forms.discriminant(form)`.

## Reader takeaway

The reader has computed a discriminant by hand, watched it survive a GL₂ substitution, and understood that "invariant under a group action" is a calculable property rather than a hidden secret. They know the historical punchline: Hilbert's 1890 finite-generation theorem made symbolic-invariant computation obsolete and pushed the field toward abstract ring theory — the revolution Noether would lead fifteen years later.
