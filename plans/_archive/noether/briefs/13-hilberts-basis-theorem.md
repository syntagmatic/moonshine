# 13 — Hilbert's Basis Theorem: Finite Generation Is Contagious

## Pitch

Noetherianness propagates under the most common algebraic construction: if `R` is Noetherian, so is `R[x]`. That is Hilbert's basis theorem — proved in 1890, long before Noether, but in a form so revolutionary that Paul Gordan (Noether's own doctoral advisor) is said to have grumbled *"Das ist nicht Mathematik, das ist Theologie"* about the non-constructive proof. The modern framing — "every ideal in `R[x]` is finitely generated" — is Noether's reformulation in terms of the chain condition, and it's the framing that makes the theorem trivial to iterate and to apply. This explainer walks through Hilbert's proof, watches it build generators one at a time, and iterates: `R` Noetherian ⇒ `R[x]` ⇒ `R[x, y]` ⇒ `…`.

## Figures

1. **Generators of an ideal in k[x, y].** A workshop: the reader inputs generators `f₁, …, f_k`, sees the ideal `I = (f₁, …, f_k)`, and watches it visualized as a "staircase" region of leading monomials in the `(i, j)` grid. Every polynomial in `I` has leading monomial in the shaded region. SVG.
2. **Hilbert's proof, animated.** Given `I ⊆ R[x]`, define `J_d = (leading coefficients of elements of I of degree ≤ d) ⊆ R`. Show: `J_0 ⊆ J_1 ⊆ …` is an ascending chain in `R`, which stabilizes at some `d*` because `R` is Noetherian. Pick finitely many polynomials whose leading coefficients generate `J_{d*}`, plus finitely many in each degree `< d*`. These finitely many polynomials generate `I`. Step-through animation. SVG.
3. **Iterating the theorem.** `ℤ` Noetherian → `ℤ[x]` → `ℤ[x, y]` → `ℤ[x₁, …, x_n]`. Same for `k`. A diagram with arrows showing the iterated lift. Static.
4. **What fails without Noetherianness.** `k[x₁, x₂, x₃, …]`. The proof of Hilbert's theorem breaks because the chain `J_0 ⊆ J_1 ⊆ …` never stabilizes — adding a new variable always grows the ideal. SVG.
5. **Gordan's lament card.** A text panel quoting Gordan, explaining that Hilbert's proof was *non-constructive* (uses existence of generators but does not compute them), and why that bothered the old symbolic-invariant school. Closes with the irony that Gordan was Noether's advisor and she would go on to build a career on exactly the abstract method he dismissed. Static.

## Key formulas / constructions

- Hilbert's basis theorem: if `R` is a Noetherian commutative ring, so is `R[x]`.
- Proof sketch: for `I ⊆ R[x]`, let `J_d = {lc(f) : f ∈ I, deg f ≤ d} ⊆ R`. The `J_d` form an ascending chain in `R`; it stabilizes at some `d*`. Pick `f_{d, 1}, …, f_{d, n_d} ∈ I` of degree `d` whose leading coefficients generate `J_d`, for each `d ≤ d*`. These finitely many `f_{d, i}` generate `I`.
- Corollary: `k[x₁, …, x_n]` is Noetherian for any field `k`.
- Application: every algebraic variety `V ⊆ k^n` is cut out by finitely many polynomial equations — the defining ideal `I(V)` is finitely generated.
- Non-example: `k[x₁, x₂, x₃, …]` is not Noetherian, and Hilbert's theorem does not apply.

## Dependencies

- #12 (ACC as the definition of Noetherian).
- Lib: `NOETHER.rings.polyRing(R, vars)`, `NOETHER.ideals.generators`, `NOETHER.hilbert.buildBasis(I)` (for small examples).

## Reader takeaway

The reader knows Hilbert's basis theorem in Noether's framing and can sketch the proof on paper. They see how it iterates (`R` Noetherian ⇒ `R[x₁, …, x_n]`) and why that iteration powers algebraic geometry: every variety has a finite set of defining equations. They have also met the historical irony that Noether's own advisor famously doubted this theorem was mathematics — and lived to see it become one of the foundations.
