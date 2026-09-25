# Galois Theory

"The symmetries of roots." Fifteen interactive explainers from the equation-solvers of the Renaissance through the fundamental theorem of Galois theory and the insolvability of the quintic, to the absolute Galois group and its action on dessins d'enfants. The most beautiful correspondence in algebra: subgroups of the Galois group ↔ intermediate fields, with solvability by radicals determined entirely by whether the group is solvable.

## Locked plan

**Spine.** Galois theory answers a question that stood open for three centuries: why can the quadratic, cubic, and quartic be solved by radicals, but the general quintic cannot? The answer is not that we lack ingenuity but that the symmetry group of the roots — the Galois group — has a structural property (solvability) that fails for degree ≥ 5. The series tells this story as a three-act arc. Act I builds from the historical problem through field extensions and splitting fields to the first explicit Galois group computations. Act II develops the fundamental theorem — the lattice correspondence between subgroups and intermediate fields — and the solvability criterion. Act III proves the insolvability of the quintic, introduces computational methods, poses the inverse Galois problem, and culminates in the absolute Galois group acting on dessins d'enfants, connecting back to mathematical-diagrams 10 and forward to the Langlands program.

**Reader endpoint.** After this series a reader should be able to: (a) define field extensions and compute degrees; (b) construct splitting fields and identify Galois groups for degree ≤ 4 polynomials; (c) state and use the fundamental theorem of Galois theory; (d) draw the lattice of intermediate fields and its dual lattice of subgroups; (e) define solvable groups and state the solvability-by-radicals criterion; (f) prove (sketch) that the general quintic is unsolvable; (g) compute Galois groups via discriminants and resolvents; (h) state the inverse Galois problem and know which groups are realised; (i) describe the absolute Galois group Gal(Q̄/Q) and its action on dessins.

**Identity.** Slug `galois-theory`, title *Galois Theory*, tagline *"The symmetries of roots."* Voice is first-person-plural with a strong historical narrative thread. Visual register matches the ecosystem: 740px article width, Source Serif 4 / Source Sans 3 / Source Code Pro, D3 v7 + SVG + KaTeX. The series leans heavily on Hasse diagrams (mathematical-diagrams 01) for lattice visualisation and on dessins d'enfants (mathematical-diagrams 10) for the Act III climax.

**Shape.** Three acts, five explainers each.

- **Act I: Roots and Radicals** (5 explainers). The historical quest from Cardano to Galois. Field extensions and degrees. Splitting fields and the birth of the Galois group. Automorphisms: what Gal(E/F) really is. First explicit examples: quadratic, cubic, quartic.
- **Act II: The Fundamental Theorem** (5 explainers). The fundamental theorem of Galois theory (subgroups ↔ intermediate fields). Hasse diagrams of field/subgroup lattices. Normal and separable extensions. Cyclotomic fields: Gal(ℚ(ζ_n)/ℚ) ≅ (ℤ/nℤ)*. Solvability by radicals ↔ solvable groups.
- **Act III: Insolvability and Absolutes** (5 explainers). The Abel–Ruffini theorem: why the quintic has no formula. Computing Galois groups: discriminant, resolvent, examples. The inverse Galois problem. The absolute Galois group and dessins. The Langlands program and modern arithmetic geometry.

**Per-explainer shape.** 500–700 lines. Historical framing (1–2 paragraphs naming the key figures), formal math with KaTeX, at least one substantial interactive figure, 1–2 insight boxes, closing reflection.

**Rendering stack.** D3 v7 + SVG + KaTeX, no build step. Shared library `lib/galois-math.js` provides: field-extension degree computation, cyclotomic polynomial and ϕ(n), discriminant and resolvent for degree ≤ 4, Galois-group identification (S_n, A_n, D_n, cyclic, Klein), small-group data (subgroups, composition series, solvability check), lattice/Hasse-diagram data for subgroup-field correspondence, units mod n and their structure.

## Phase state

- [x] **Phase 0** — write this spine
- [ ] **Phase 1** — build `lib/galois-math.js` + Act I (5 explainers)
- [ ] **Phase 2** — Act II (5 explainers)
- [ ] **Phase 3** — Act III (5 explainers)
- [ ] **Phase 4** — audit pass, cross-series links, SPH standard sweep

## Explainer list

### Act I · Roots and Radicals

**01. The Equation-Solvers: From Cardano to Galois.** Historical frame: Cardano's cubic (1545), Ferrari's quartic, 250 years of failed quintic attempts, Ruffini (1799), Abel (1824), Galois (1832). Solvability by radicals means using only +, −, ×, ÷, ⁿ√. The quadratic and cubic formulas as explicit radical expressions. The question: *why* does the pattern break at degree 5? Interactive: polynomial-degree-vs-solvability timeline, Cardano's cubic solver with step-by-step radicals, mathematician influence graph.

**02. Field Extensions: Adjoining Roots.** Fields (ℚ, ℝ, ℂ, 𝔽_p). Extensions F ⊆ E. Degree [E:F] = dim of E as F-vector space. Simple extension F(α). Minimal polynomial. Tower law: [E:K] = [E:F]·[F:K]. Algebraic vs transcendental. Examples: ℚ(√2), ℚ(∛2), ℚ(√2,√3). Interactive: field-tower builder with degree bar chart, lattice diagram of extensions (cross-ref mathematical-diagrams 01), algebraic/transcendental selector.

**03. Splitting Fields and the Birth of the Galois Group.** Splitting field of f(x): smallest extension where f factors into linears. Normal extensions. Galois extension = normal + separable (separable is automatic in char 0). Aut(E/F): automorphisms fixing F. Gal(E/F) = Aut(E/F) when E/F is Galois. |Gal(E/F)| = [E:F]. Example: splitting field of x³−2 is ℚ(∛2, ζ₃) with Gal ≅ S₃. Interactive: splitting-field visualiser showing tower of extensions, permutation action on roots with cycle notation, Hasse diagram of intermediate fields.

**04. Automorphisms and Symmetries.** A field automorphism σ: E → E preserves + and ×, fixes F pointwise. Determined by action on generators: σ(α) must be another root of min poly of α. Explicit computation for ℚ(√2)/ℚ (2 elements: id, conjugation) and ℚ(√2,√3)/ℚ (Klein four-group). Composition of automorphisms. Cayley tables. Interactive: automorphism builder for ℚ(√2,√3) with validity checking, cycle-notation display, Cayley table generator.

**05. First Examples: Quadratic, Cubic, Quartic.** Quadratics: Δ = b²−4ac; Gal ≅ ℤ/2ℤ always. Cubics: Δ = −4p³−27q²; Gal ≅ A₃ (Δ square) or S₃ (Δ non-square). Quartics: resolvent cubic determines Gal ∈ {V₄, ℤ/4ℤ, D₄, A₄, S₄}. The pattern: Galois groups grow, but remain solvable through degree 4. Interactive: quadratic/cubic/quartic solvers computing discriminant, Galois group, and solvability; comparative Cayley tables for ℤ/2ℤ, S₃, D₄, S₄.

### Act II · The Fundamental Theorem

**06. The Fundamental Theorem of Galois Theory.** The bijection: intermediate fields F ⊆ L ⊆ E ↔ subgroups H ⊆ Gal(E/F). L ↦ Gal(E/L), H ↦ E^H (fixed field). Inclusion-reversing. [E:L] = |Gal(E/L)|. L/F Galois iff Gal(E/L) ⊴ Gal(E/F). Worked examples: ℚ(√2,√3)/ℚ (Klein four, diamond lattice) and splitting field of x³−2 (S₃, non-abelian). Interactive: dual-pane lattice visualiser — field lattice on left, subgroup lattice on right, click to highlight correspondences; fixed-field computation interface; degree/index checker.

**07. Hasse Diagrams and Lattices of Subfields.** Hasse diagrams encode the poset of intermediate fields and subgroups. Drawing conventions: base at bottom, edges labelled by degree/index. The FGGT as a mirror: field lattice upside-down = subgroup lattice. Normal subgroups ↔ Galois intermediate extensions. Cross-reference mathematical-diagrams 01. Interactive: field-lattice builder for ℚ(√2,√3), ℚ(∛2,ζ₃), ℚ(ζ_n) with dual subgroup pane; normal-subgroup highlighting; mirror-flip animation.

**08. Normal and Separable Extensions.** Normal: every irreducible polynomial with a root in E splits completely in E. Equivalently: E is a splitting field. ℚ(√2)/ℚ is normal; ℚ(∛2)/ℚ is not (two complex roots missing). Separable: no repeated roots (automatic in char 0). Galois = normal + separable. Non-Galois extensions have |Aut(E/F)| < [E:F]. Interactive: normal-vs-non-normal example viewer showing roots in/out of extension; normal-closure constructor (adjoin missing roots); separability inspector via gcd(f,f').

**09. Cyclotomic Fields and Roots of Unity.** ℚ(ζ_n) = splitting field of x^n−1. Cyclotomic polynomial Φ_n(x), degree ϕ(n). Gal(ℚ(ζ_n)/ℚ) ≅ (ℤ/nℤ)* via σ_a(ζ_n) = ζ_n^a. Structure of (ℤ/nℤ)*: cyclic for prime powers, product of cyclics via CRT. Intermediate fields via FGGT = subgroups of (ℤ/nℤ)*. Gauss periods. Interactive: root-of-unity visualiser on unit circle with Galois-action animation, lattice of subfields for ℚ(ζ_5), ℚ(ζ_8), ℚ(ζ_12), structure inspector for (ℤ/nℤ)*.

**10. Solvability by Radicals ↔ Solvable Groups.** A group G is solvable if it has a composition series with all abelian quotients. S_n is solvable for n ≤ 4 (composition series exist) but not for n ≥ 5 (A_n is simple and non-abelian). Galois's theorem: f is solvable by radicals iff Gal(E/F) is solvable. All degree-≤-4 Galois groups are solvable. The stage is set for the quintic. Interactive: solvability checker for groups (finds composition series or proves non-existence), degree-vs-solvability chart, radical-tower builder for cubics, composition-series visualiser.

### Act III · Insolvability and Absolutes

**11. Why the General Quintic Has No Formula.** The general degree-n polynomial has Gal ≅ S_n. For n ≥ 5, S_n is not solvable (A_n is simple, non-abelian). By Galois's theorem, the general quintic is not solvable by radicals. The proof does NOT say all degree-5 polynomials are unsolvable (x⁵−1 is solvable; x⁵−x−1 is not). Interactive: S_5 composition-series failure animation, generic-vs-special polynomial comparison, Abel–Ruffini proof flowchart.

**12. Computing Galois Groups: Discriminant, Resolvent, Examples.** Discriminant: Disc(f) square ⟹ Gal ⊆ A_n. Resolvent cubic for quartics. Factorisation in extension towers. Worked examples: x³−2 (S₃), x³−3x+1 (A₃), x⁴−2 (D₄), x⁵−x−1 (S₅). Interactive: discriminant calculator, resolvent-cubic factorer, Galois-group deduction table for degree 4, example-polynomial solver.

**13. The Inverse Galois Problem.** Given a finite group G, does there exist f ∈ ℚ[x] with Gal ≅ G? Known: all cyclic, all abelian, all S_n, all A_n. Open in general. Many sporadic groups realised; Monster status uncertain. Rigidity methods, patching arguments. Interactive: realisability database (group → known polynomial), explicit polynomial finder, realisability timeline.

**14. The Absolute Galois Group and Dessins d'Enfants.** Q̄ = algebraic closure of ℚ. Gal(Q̄/ℚ) is a profinite group (inverse limit of finite Galois groups). It acts faithfully on dessins d'enfants via Belyi's theorem. The passport of a dessin is preserved; the combinatorial structure can change. Grothendieck's *Esquisse d'un Programme*. Cross-reference mathematical-diagrams 10. Interactive: dessin viewer with Galois-orbit display, Belyi-function visualiser, passport-equivalence browser.

**15. The Langlands Program and Modern Arithmetic Geometry.** Galois representations ρ: Gal(Q̄/ℚ) → GL_n. L-functions. Langlands's vision: every arithmetic L-function arises from an automorphic form. Wiles's proof of Fermat via modularity of elliptic curves. Galois cohomology. Étale topology. Connection to modular-forms series. Interactive: Galois-representation visualiser for elliptic curves, Fermat's-Last-Theorem proof roadmap, grand concept-map of the Langlands landscape.

## Dependencies

1. **`mathematical-diagrams` series is a direct visual dependency.** Hasse diagrams (01) for lattice visualisation throughout Act II. Dessins d'enfants (10) for Act III climax.
2. **`monstrous-moonshine` series connects via the absolute Galois group** and its representations (Act III explainers 14–15).
3. **`modular-forms` series (if built) is the natural sequel** to Act III explainer 15 (Langlands, modularity).
4. **`representation-theory` series (if built) provides the group-theory machinery** that supports the solvability criterion.
5. **No hard prerequisites** beyond comfort with polynomials and basic algebra. Group theory is introduced as needed.

## What this series will not do

- **Full proofs of the fundamental theorem.** The FGGT is stated and used; the proof is sketched, not given in full.
- **Algebraic geometry beyond Belyi's theorem.** Schemes, étale cohomology, and the full Langlands machinery are mentioned, not developed.
- **Characteristic p in depth.** Inseparability and Frobenius endomorphisms are mentioned but the series works in char 0 throughout.
- **Computational algebra.** Algorithms for large Galois groups (Stauduhar, van der Waerden) are referenced but not implemented.
- **Class field theory.** Artin reciprocity and its generalisations are mentioned in explainer 15 as "what comes next."

## Files

```
plans/galois-theory/
  README.md                              (this file)

docs/galois-theory/
  lib/
    galois-math.js                       (field extensions, discriminants, resolvents, Galois-group ID, lattice data, units mod n)
    test.html                            (in-browser sanity checks)
  index.html                             (series landing page)
  01-equation-solvers.html
  02-field-extensions.html
  03-splitting-fields.html
  04-automorphisms.html
  05-quadratic-cubic-quartic.html
  06-fundamental-theorem.html
  07-hasse-lattices.html
  08-normal-separable.html
  09-cyclotomic-fields.html
  10-solvability.html
  11-abel-ruffini.html
  12-computing-galois-groups.html
  13-inverse-galois-problem.html
  14-absolute-galois-dessins.html
  15-langlands-and-beyond.html
```
