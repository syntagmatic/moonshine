# Modular Forms

"A pressure system from hyperbolic geometry to monstrous moonshine." Twenty interactive explainers in four acts. The series is structured so each act earns the next constraint and moonshine is the explicit destination, not one topic among many.

## Locked plan

**Spine.** Modular forms begin as functions with severe symmetry; their q-expansions turn that symmetry into arithmetic data; that data first counts divisors, then detects elliptic curves, and ultimately becomes dimensions and traces of representations of the Monster group. Four acts: (I) **geometry creates symmetry** &mdash; the upper half-plane, SL₂(ℤ), the fundamental domain, cusps, generators; (II) **symmetry creates scarcity** &mdash; modular forms, Eisenstein series, Δ, the ring M_* = ℂ[E₄,E₆], and Hecke operators; (III) **scarcity creates arithmetic signal** &mdash; congruence subgroups, modular curves, modularity, Maass / automorphic generalisations, and the j-function as the cliff edge; (IV) **one signal becomes representation theory** &mdash; the Monster, lattices E₈ and Leech, the moonshine specification, the moonshine module V♮, and Borcherds' proof.

**Three recurring motifs.** (1) The same value under many descriptions (modular invariance). (2) Boundary behaviour controls the whole object (cusps and q-expansions). (3) Coefficients are witnesses &mdash; first divisor sums, then Hecke eigenvalues, then elliptic-curve traces, then Monster characters. Each act re-uses these motifs at a higher level.

**Reader endpoint.** After this series a reader should be able to: (a) visualise the fundamental domain and the SL₂(ℤ)-tiling of ℍ; (b) state what a modular form is, give three examples, and read a q-expansion as arithmetic data; (c) explain the finite-dimensionality of M_k and the closed form M_* = ℂ[E₄,E₆]; (d) describe Hecke operators and how they make coefficients multiplicative; (e) state the modularity theorem and explain how it connects elliptic curves to weight-2 newforms; (f) state the three roles of j (classifier of elliptic curves, Hauptmodul for SL₂(ℤ), and J = j − 744 as the moonshine-normalised graded dimension); (g) read the moonshine specification as a wish list for a graded Monster module whose graded character is J; (h) sketch the FLM construction of V♮ and the role of Borcherds' proof.

**Identity.** Slug `modular-forms`, title *Modular Forms*, tagline *"A pressure system from hyperbolic geometry to monstrous moonshine."* Visual register matches `monstrous-moonshine` and `lie-algebras`: 740px article width, Source Serif 4 / Source Sans 3 / Source Code Pro, D3 v7 + SVG + KaTeX. Voice is first-person-plural, pedagogical arc; tone after the first reveal in Act IV is procedural ("the coincidence becomes a specification, the specification becomes a construction problem, the construction becomes a trace identity").

**Shape.** Four acts, five explainers each, ascending from concrete geometry to representation-theoretic identity.

- **Act I · The Symmetry Machine** (5 explainers). The upper half-plane, SL₂(ℤ) action, fundamental domain, cusps, generators. By the end the quotient has finite area, two generators, and exactly enough symmetry to make holomorphic functions rare.
- **Act II · The Functions That Survive** (5 explainers). Modular forms, Eisenstein series, Δ and Ramanujan's τ, the ring M_* = ℂ[E₄,E₆], Hecke operators. By the end the q-coefficients are no longer just Fourier data: Hecke makes them arithmetic.
- **Act III · Coefficients Become Curves** (5 explainers). Congruence subgroups Γ₀(N) and modular curves, the modularity theorem, then two generalisations of the same machinery (Maass forms spectrally, automorphic forms across larger groups), and finally j as the cliff edge into Act IV.
- **Act IV · Coefficients Become Characters** (5 explainers). The Monster and McKay's coincidence, the lattices E₈ and Leech, the bridge and moonshine specification, vertex operators and the moonshine module V♮, Borcherds' proof and beyond. By the end the q-series was a graded trace all along.

**Per-explainer shape.** 500–800 lines. Historical framing (1–2 paragraphs), formal math with KaTeX, at least one substantial interactive figure, 1–2 insight boxes, closing reflection. Each part should answer "what new constraint did we just earn?" and tie back to one or more of the three motifs.

**Rendering stack.** D3 v7 + SVG + KaTeX, no build step. Shared library `lib/modular-math.js` provides: Eisenstein series evaluators and q-coefficients, Ramanujan τ function, j-function q-series and special values, Hecke operator action on q-series, dimension formulas, SL₂(ℤ) geometry (Möbius transformation, fundamental-domain path, Poincaré metric), Mellin-transform approximations, lattice-point generators for visualisation. `lib/moonshine-math.js` adds Monster character data, McKay–Thompson series, and graded-dimension utilities for Act IV.

## Phase state

- [x] **Phase 0** — write this spine
- [x] **Phase 1** — build `lib/modular-math.js` + Act I (5 explainers)
- [x] **Phase 2** — Act II (5 explainers)
- [x] **Phase 3** — Act III (5 explainers, j-function as Part 15 / cliff edge)
- [x] **Phase 4** — Act IV (5 explainers, Monster through Borcherds)
- [x] **Phase 5** — audit pass, cross-series links, SPH standard sweep
- [x] **Phase 6** — narrative reframe per pressure-system feedback (act intros, three-motif scaffolding, j → Part 15, dictionary table in Part 18)

## Explainer list

### Act I · The Symmetry Machine

**01. The Upper Half-Plane and Hyperbolic Geometry.** ℍ = {τ ∈ ℂ : Im τ > 0} with the Poincaré metric ds² = |dτ|²/(Im τ)². Geodesics are vertical lines and semicircles orthogonal to the real axis. The isometry group is PSL₂(ℝ). Interactive: draggable τ with metric-tensor ellipse, geodesic-drawing tool, ℍ ↔ Poincaré-disk toggle.

**02. SL₂(ℤ) and the Möbius Action.** SL₂(ℤ) acts on ℍ by γ·τ = (aτ+b)/(cτ+d). Generated by S: τ ↦ −1/τ and T: τ ↦ τ+1 with relation (ST)³ = −I. Faithful, isometric, properly discontinuous. Interactive: matrix-entry sliders, S/T/ST presets, orbit tracker.

**03. The Fundamental Domain.** F = {τ ∈ ℍ : |Re τ| ≤ 1/2, |τ| ≥ 1}. Boundary identifications by S and T. SL₂(ℤ)-translates tile ℍ; the quotient X(1) is a genus-0 modular curve. Interactive: animated tiling, boundary colours, drag-and-reduce.

**04. Cusps and the Cusp-Form Condition.** Cusps are ℚ ∪ {∞}, all SL₂(ℤ)-equivalent. Stabiliser at i∞ generates the q-expansion. Holomorphic at the cusp = no negative q-powers; cusp form = no constant term. Interactive: cusp-equivalence paths, q-expansion display, stabiliser viz.

**05. Generators, Relations, and Structure.** PSL₂(ℤ) = ⟨S, T | S² = (ST)³ = 1⟩. Elliptic points i (order 2) and ρ (order 3). Finite hyperbolic area of F is what later forces M_k to be finite-dimensional. Interactive: word builder, target puzzle, elliptic-stabiliser viz.

### Act II · The Functions That Survive

**06. Modular Forms: Definition and Weight.** Holomorphic f: ℍ → ℂ with f(γ·τ) = (cτ+d)^k f(τ) and finite growth at the cusps. The freedom of holomorphic functions is crushed by symmetry; that scarcity is what does the work in every later act. Interactive: weight-k selector, |f| heatmap, transformation-law verifier.

**07. Eisenstein Series and q-Expansions.** E_k(τ) = (1/2) Σ 1/(mτ+n)^k. Converges for k ≥ 4. Normalised q-expansion has integer coefficients involving divisor sums σ_{k−1}(n). Interactive: lattice viz, weight slider, q-coefficient table linked to divisor sums.

**08. The Discriminant, Ramanujan's τ, and Cusp Forms.** Δ = q ∏(1−q^n)^{24} = Σ τ(n)q^n, the unique weight-12 cusp form (up to scalar). Multiplicativity, congruence mod 691, Lehmer's conjecture. Interactive: τ(n) table, bar chart, mod-691 checker, |Δ| heatmap.

**09. The Ring of Modular Forms and Dimensions.** First major payoff: M_* = ℂ[E₄, E₆], the whole infinite-looking zoo generated by two animals. dim M_k from Riemann–Roch on X(1); S_k = Δ · M_{k−12}. Interactive: weight slider, dimension bar chart, basis browser, product closure.

**10. Hecke Operators and the Hecke Algebra.** T_n is a double-coset operator on M_k; on q-series T_p shifts and scales. Eigenforms have multiplicative coefficients and Euler-product L-functions &mdash; the moment a coefficient becomes a fact about a prime. Interactive: form selector, T_n slider, eigenvalue check, Euler-product display.

### Act III · Coefficients Become Curves

**11. Weight 2, Modular Curves, and L-Functions.** First symmetry trade: weaken to Γ₀(N) and the quotient becomes the richer curve X₀(N). Weight-2 cusp forms are holomorphic differentials on X₀(N); Mellin gives L(s,f) with a functional equation. Interactive: Γ₀(N) selector, genus and cusp counts, L-function plotter.

**12. The Modularity Theorem and Elliptic Curves.** Every E/ℚ arises from a weight-2 newform: L(s,E) = L(s,f). Wiles' proof, the road to FLT. Interactive: curve builder, a_p comparison, Frobenius traces.

**13. Maass Forms and Non-Holomorphic Generalisations.** Real-analytic eigenfunctions of the hyperbolic Laplacian. Fourier expansions involve Bessel functions; the Selberg trace formula relates eigenvalues to closed-geodesic lengths &mdash; the boundary-controls-everything motif restaged spectrally. Interactive: eigenfunction heatmap, nodal lines, Bessel display.

**14. The Wider Landscape: Automorphic Forms.** Modular forms are the GL₂ slice of a much larger picture: automorphic forms, Langlands' conjecture, p-adic forms, modularity lifting. The arithmetic signal earned in Act II keeps making sense across more groups and more L-functions. Interactive: landscape diagram, subgroup browser, L-function calculator.

**15. The j-Function: The Cliff Edge into Moonshine.** j(τ) = q⁻¹ + 744 + 196 884 q + …. Three roles, kept separate so the moonshine bridge has a chance: (a) classifier of complex elliptic curves; (b) Hauptmodul for SL₂(ℤ) (j induces the isomorphism X(1) ≅ ℙ¹); (c) shifted to J = j − 744, the moonshine-normalised graded dimension. Role (c) is the door into Act IV. Interactive: draggable τ with live j(τ), j-plane viewer, elliptic-curve shape, q-expansion with Monster annotations.

### Act IV · Coefficients Become Characters

**16. The Monster and McKay's Coincidence.** The largest sporadic simple group, |M| ≈ 8·10⁵³, predicted in 1973 and constructed by Griess in 1982. 194 irreps with dimensions from 1 to ≈10²⁸. McKay's 1978 letter: 196 884 = 1 + 196 883 &mdash; the first coincidence. Interactive: character-table browser, dimension ladder, coincidence decoder.

**17. Lattices: E₈ and the Leech.** E₈ in 8 dimensions with 240 roots; Leech Λ₂₄ in 24 dimensions with no roots, kissing number 196 560, automorphism group containing several sporadic groups. The rootlessness of Λ₂₄ is the geometric reason the moonshine module's degree-zero piece is empty. Interactive: root counter, kissing configuration, Niemeier scan.

**18. The Bridge and the Moonshine Specification.** Four algebraic steps connect E₈ to the Monster's generating involutions. Conway–Norton wish list: a graded Monster module V♮ whose graded character of the identity (the graded dimension) reproduces J = j − 744, with the rootlessness of Λ₂₄ explaining the vanishing degree-zero piece. A dictionary table aligns modular language (q-power, q-coefficient, modular function, McKay–Thompson series, Hauptmodul, J) with algebra (grade, dimension, graded dimension, graded trace, genus-zero rigidity, graded character of the identity).

**19. Vertex Operators and the Moonshine Module V♮.** Vertex-operator algebras as the algebraic structure that turns a graded vector space into a consistent 2D chiral CFT. Frenkel–Lepowsky–Meurman's orbifold construction of V♮ from the Leech VOA: the Monster acts, and dim V_n♮ = c(n). Interactive: VOA axioms, orbifold build, graded-character check.

**20. Borcherds' Proof and Beyond.** Standard Kac–Moody algebras can't host the j-coefficient growth. Borcherds adds imaginary simple roots, extracts the Monster Lie Algebra from V♮ via the no-ghost theorem, and the denominator identity is the j-function product formula. 1998 Fields Medal. Interactive: denominator identity, imaginary roots, post-1992 landscape.

## Dependencies

1. **`monstrous-moonshine` series is a deep cross-link.** This series now contains the moonshine destination as Act IV; the standalone moonshine series is a longer companion treatment.
2. **`lie-algebras` series is a soft prerequisite for Act IV.** Affine Kac–Moody and generalised Kac–Moody algebras are touched in Part 20.
3. **`exceptional-atlas` series provides geometric intuition** through E₈ and Leech (Parts 17–20).
4. **`information-geometry` series has a deep connection** via the Weil–Petersson metric on moduli spaces.
5. **No hard prerequisites** beyond undergraduate linear algebra and complex analysis.

## What this series will not do

- **Prove every theorem in full rigour.** The modularity theorem and Borcherds' proof are explained at the level of statement and proof strategy, not full Galois-deformation or no-ghost machinery.
- **Develop p-adic analysis or algebraic geometry in depth.** These are mentioned as frontiers.
- **Teach the full Langlands program.** Enough context to explain why modularity matters.
- **Cover computational methods.** Atkin–Lehner involutions, computing q-series to many terms, character tables of the Monster: belong in a computational-methods series.
- **Develop conformal field theory in depth.** Part 19 introduces the VOA framework; the full CFT machinery is left as a frontier.
- **Treat Maass forms in complete spectral detail.** Part 13 introduces them; the full theory requires more harmonic analysis.

## Files

```
plans/modular-forms/
  README.md                              (this file)

docs/modular-forms/
  lib/
    modular-math.js                      (Eisenstein, j-function, Hecke, dimensions, SL₂(ℤ) geometry, Mellin)
    moonshine-math.js                    (Monster characters, McKay–Thompson series, graded dimensions)
    test.html                            (in-browser sanity checks)
  index.html                             (series landing page)
  01-upper-half-plane.html
  02-sl2z-and-mobius.html
  03-fundamental-domain.html
  04-cusps-and-cusp-forms.html
  05-generators-and-structure.html
  06-modular-forms-definition.html
  07-eisenstein-series.html
  08-discriminant-and-ramanujan-tau.html
  09-ring-and-dimensions.html
  10-hecke-operators.html
  11-weight-2-and-modular-curves.html
  12-modularity-theorem.html
  13-maass-forms.html
  14-automorphic-landscape.html
  15-the-j-function.html
  16-the-monster-and-mckay.html
  17-lattices-e8-and-leech.html
  18-the-bridge-and-moonshine-specification.html
  19-vertex-operators-and-moonshine-module.html
  20-borcherds-proof-and-beyond.html
```
