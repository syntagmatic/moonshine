# Representation Theory

"When abstract algebra becomes concrete." Fifteen interactive explainers from the definition of a representation through characters, Young tableaux, Schur–Weyl duality, and the Peter–Weyl theorem, to the Monster group and the moonshine connection. The series unifies threads already present across the ecosystem: Young diagrams (mathematical-diagrams 02), weight diagrams (mathematical-diagrams 11), Cayley graphs (mathematical-diagrams 03), and Lie algebras.

## Locked plan

**Spine.** Representation theory is the study of abstract algebraic objects — groups, algebras — as if they were matrices acting on vectors. Every group has a representation as matrices; the question is which matrices, and what structure they reveal. The series teaches representation theory in three acts: Act I builds from the definition of a representation through characters and orthogonality to the complete classification of symmetric-group representations via Young tableaux. Act II develops the machinery: induction, restriction, Frobenius reciprocity, tensor products, Clebsch–Gordan coefficients, Lie algebra representations via highest weights, classical types, and Schur–Weyl duality. Act III goes global: the representation ring, Burnside's theorem, Peter–Weyl for compact groups, advanced symmetric-group theory (branching and plethysm), Monster representations, and a capstone synthesis. The narrative thread: *how do abstract symmetries become visible matrices, and what does the matrix structure tell us about the symmetry?*

**Reader endpoint.** After this series a reader should be able to: (a) define a representation, check irreducibility, and decompose a reducible representation using characters; (b) compute the character table of a small group and use orthogonality to decompose representations; (c) classify S_n irreps via Young diagrams and compute their dimensions via the hook-length formula; (d) state and use Frobenius reciprocity; (e) decompose tensor products via Clebsch–Gordan coefficients and the Littlewood–Richardson rule; (f) classify representations of sl₂ and classical Lie algebras via highest weights; (g) state Schur–Weyl duality and explain why S_n and GL_n share their classification; (h) state the Peter–Weyl theorem for compact groups; (i) recognise the moonshine connection: Monster irrep dimensions as j-function coefficients.

**Identity.** Slug `representation-theory`, title *Representation Theory*, tagline *"When abstract algebra becomes concrete."* Visual register matches the ecosystem: 740px article width, Source Serif 4 / Source Sans 3 / Source Code Pro, D3 v7 + SVG + KaTeX. Semantic colour vocabulary from mathematical-diagrams: `--c-element` for objects, `--c-morphism` for maps, `--c-action` for group action / selection, `--c-gen-1/2/3` for generators, `--c-structure` for verified algebraic properties.

**Shape.** Three acts: Act I (4 explainers) covers foundations. Act II (5 explainers) covers machinery. Act III (6 explainers) covers advanced topics and bridges.

- **Act I: Foundations** (4 explainers). What is a representation; group actions and linear representations; characters and orthogonality; the symmetric group S_n and Young tableaux.
- **Act II: Machinery** (5 explainers). Induction, restriction, Frobenius reciprocity; tensor products and Clebsch–Gordan; sl₂ representations as the template; classical Lie algebra representations; Schur–Weyl duality.
- **Act III: Advanced Topics and Bridges** (6 explainers). The representation ring and Burnside's theorem; Peter–Weyl for compact groups; induced representations and Mackey theory; symmetric group branching and plethysm; Monster representations; capstone synthesis.

**Per-explainer shape.** 400–700 lines. Historical framing, formal math with KaTeX, at least one interactive figure, 1–2 insight boxes, closing reflection.

**Rendering stack.** D3 v7 + SVG + KaTeX, no build step. Shared library `lib/rep-math.js` provides: character tables for small groups (Z_n, D_n, S_n for n ≤ 6, A_4, A_5, Q_8), character inner products and decomposition, Young diagram operations (hook lengths, standard tableaux enumeration, Littlewood–Richardson), sl₂ and classical-type weight/matrix computations, Schur–Weyl tensor-power decomposition, Kronecker products, Monster character data subset.

## Phase state

- [x] **Phase 0** — write this spine
- [ ] **Phase 1** — build `lib/rep-math.js` + Act I (4 explainers)
- [ ] **Phase 2** — Act II (5 explainers)
- [ ] **Phase 3** — Act III (6 explainers)
- [ ] **Phase 4** — audit pass, cross-series links, SPH standard sweep

## Explainer list

### Act I · Foundations

**01. What Is a Representation?** A representation of a group G is a homomorphism ρ: G → GL(V). Faithful vs non-faithful, dimension, trivial/natural/adjoint representations. Irreducibility: only invariant subspaces are 0 and V. Schur's lemma: if ρ is irreducible and T commutes with all ρ(g), then T is scalar. Equivalent representations (same up to change of basis). Interactive: group-action visualiser showing matrix action on vectors for Z_4, D_3, S_3 side-by-side; equivalence explorer with live change-of-basis.

**02. Group Actions and Linear Representations.** Set actions lift to linear actions on ℂ[X]. Permutation representations. The regular representation ℂ[G] (dimension |G|, contains every irrep with multiplicity equal to its dimension). Orbits and stabilisers. Interactive: action→permutation-matrix converter for S_3 acting on triangle vertices; regular representation builder with Cayley graph (cross-ref mathematical-diagrams 03).

**03. Characters and Orthogonality.** The character χ_ρ(g) = tr(ρ(g)) is a class function. Character table: |Conj(G)| × |Irr(G)|. Orthogonality: ⟨χ_ρ, χ_σ⟩ = δ_{ρσ}. Decomposition via inner product: m_i = ⟨χ_ρ, χ_{ρ_i}⟩. Column orthogonality. Sum of squares: Σ dim(ρ_i)² = |G|. Interactive: character table browser for Z_n, D_n, S_3, S_4, A_4 with orthogonality verification; decomposition tool computing multiplicities from character inner products.

**04. The Symmetric Group S_n and Young Tableaux.** Bijection: irreps of S_n ↔ partitions of n. Young symmetrisers. Hook-length formula: dim(ρ_λ) = n!/∏h_{ij}. Standard Young tableaux count = dim(ρ_λ). Littlewood–Richardson rule for tensor products. Cross-reference mathematical-diagrams 02. Interactive: hook-length computer with drag-to-build Young diagrams; standard-tableaux counter with interactive filling; tensor-product decomposer via LR rule.

### Act II · Machinery

**05. Induction, Restriction, and Frobenius Reciprocity.** Induced representation Ind^G_H(ρ) = ℂ[G] ⊗_{ℂ[H]} V. Restricted representation Res^G_H. Frobenius reciprocity: ⟨Res σ, ρ⟩_H = ⟨σ, Ind ρ⟩_G. Character formula for induced representations. Branching rules for S_n → S_{n-1}. Interactive: induction/restriction explorer with side-by-side character tables; branching diagram for S_4 → S_3.

**06. Tensor Products and Clebsch–Gordan Coefficients.** Tensor product ρ ⊗ σ: G → GL(V⊗W) via (ρ⊗σ)(g) = ρ(g)⊗σ(g). Decomposition ρ_i ⊗ ρ_j = ⊕ c^k_{ij} ρ_k. Clebsch–Gordan coefficients as change-of-basis matrices. LR rule for S_n. Dimension check: (dim ρ_i)(dim ρ_j) = Σ c^k dim ρ_k. Interactive: tensor-product decomposer for S_n and small groups; CGC matrix viewer for SU(2) spin examples.

**07. Representations of Lie Algebras: The sl₂ Template.** Lie algebra representations: ρ: 𝔤 → End(V) respecting the bracket. For sl₂: generators e, f, h with [h,e]=2e, [h,f]=-2f, [e,f]=h. Highest-weight representations: ρ(h)v = λv, ρ(e)v = 0. Finite-dimensional irreps: λ ∈ ℤ_≥0, dim = λ+1. Weight diagram as a string from -λ to +λ. Cross-reference lie-algebras series and mathematical-diagrams 11 (weight diagrams). Interactive: highest-weight slider with weight-dot visualisation; matrix representation viewer computing [h,e], [h,f], [e,f] live.

**08. Representations of Classical Lie Algebras.** A_n = sl_{n+1}, B_n = so_{2n+1}, C_n = sp_{2n}, D_n = so_{2n}. Irreps classified by Young diagrams (for A_n) or dominant weights. Weyl dimension formula: dim(V_λ) = ∏_{α>0} ⟨λ+ρ, α⟩/⟨ρ, α⟩. Tensor products via LR rule for classical types. Cross-reference mathematical-diagrams 08 (Dynkin) and 11 (weight diagrams). Interactive: Young-diagram → representation browser with Weyl dimension computation; tensor-product explorer for classical types.

**09. Schur–Weyl Duality.** V^⊗k decomposes as ⊕_{λ⊢k} V_λ^{GL_n} ⊗ V_λ^{S_k} (length(λ) ≤ n). End_{GL_n}(V^⊗k) ≅ ℂ[S_k]. Same Young diagrams classify both GL_n and S_k irreps — not a coincidence but a theorem. Schur functors. Dimension check: n^k = Σ dim(V_λ^{GL}) · dim(V_λ^{S_k}). Interactive: tensor-power decomposer showing paired GL_n/S_k irreps; Schur functor dimension as function of n.

### Act III · Advanced Topics and Bridges

**10. The Representation Ring and Burnside's Theorem.** R(G) = Grothendieck group of representations. Ring structure: [ρ⊕σ] = [ρ]+[σ], [ρ⊗σ] = [ρ][σ]. Generated by irreps over ℤ. Burnside: Σ dim(ρ_i)² = |G|. Character map R(G) → Class(G) is injective. Interactive: ring visualiser with addition/multiplication tables; character-basis explorer decomposing arbitrary class functions.

**11. Compact Lie Groups and the Peter–Weyl Theorem.** Continuous representations of compact groups. Haar measure and integration. Peter–Weyl: L²(G) = ⊕ V_ρ ⊗ V_ρ*. Matrix coefficients form an orthonormal basis. Character orthogonality via integration. Harmonic analysis on groups as Fourier analysis via irreps. Interactive: matrix-coefficient visualiser for SU(2) with angle slider; harmonic-analysis decomposition of functions on SU(2).

**12. Induced Representations and Mackey Theory.** Mackey's irreducibility criterion. Clifford theory: restriction of irreps to normal subgroups. Building irreps by induction from subgroups. Character formula for induced representations via double cosets. Interactive: induction calculator with Mackey decomposition for S_4/S_3; Clifford theory visualiser showing conjugate irreps.

**13. Symmetric Group: Branching and Plethysm.** Branching rule: Res^{S_n}_{S_{n-1}}(V_λ) = ⊕_{μ: λ\μ = box} V_μ. Plethysm ρ_λ[ρ_μ] (nested composition, notoriously hard to compute). Symmetric and exterior powers. The ring of symmetric functions Sym as the universal rep ring. Interactive: branching explorer iterating S_n → S_{n-1} → ··· → S_1 as a tree; plethysm for small examples (exterior powers of standard rep).

**14. Monster Representations and Moonshine.** The Monster 𝕄: |𝕄| ≈ 8×10^{53}, 194 conjugacy classes, 194 irreps. Smallest non-trivial irrep has dimension 196883. Moonshine: j(τ) − 744 = Σ c_n q^n where c_1 = 196884 = 1 + 196883. Character table of the Monster (194×194). The moonshine module V♮ as a graded Monster representation. Cross-reference monstrous-moonshine series. Interactive: Monster irrep dimension browser; moonshine coefficient decomposer showing j-coefficients as sums of Monster irrep dimensions.

**15. Capstone: Synthesis and Horizons.** Unifying themes: classification (characters, highest weights, partitions), orthogonality, induction. Connections to: mathematical-diagrams (Young, weight, Cayley), lie-algebras (root systems, Dynkin), monstrous-moonshine (Monster, j-function), e8-lattice (E8 representations). Applications: quantum mechanics (spin states as irreps), particle physics (Standard Model representations of SU(3)×SU(2)×U(1)), chemistry (molecular orbital symmetry). What this series did not cover: modular representations, quantum groups, infinite-dimensional representations. Interactive: series-map diagram showing cross-references; synthesis table comparing classification across finite groups, S_n, Lie algebras, compact groups, Monster.

## Dependencies

1. **`mathematical-diagrams` series is a soft cross-reference** throughout. Young diagrams (02), Cayley graphs (03), Dynkin diagrams (08), weight diagrams (11) are the visual vocabulary that representation theory explains algebraically.
2. **`lie-algebras` series is a soft prerequisite for Act II** (explainers 07–09). Root systems, Cartan subalgebras, and classical types are used without full re-derivation.
3. **`monstrous-moonshine` series is the target of Act III** (explainer 14). Monster character data and the moonshine module V♮ are the culmination of the rep-theory arc.
4. **No hard prerequisites** beyond undergraduate linear algebra and comfort with groups. Group theory is reviewed in Act I.

## What this series will not do

- **Modular representation theory.** We work over ℂ throughout. Representations over finite fields and characteristic-p subtleties are out of scope.
- **Infinite-dimensional representations.** Loop groups, affine Kac–Moody algebras, and unitary representations of non-compact groups are mentioned but not developed.
- **Categorical foundations.** Frobenius reciprocity is an adjunction; we present it operationally, not categorically.
- **Homological algebra.** Ext, Tor, derived functors, spectral sequences are out of scope.
- **Quantum groups and deformations.** U_q(sl₂) and quantum enveloping algebras are beyond scope.
- **Applications in depth.** Quantum mechanics, particle physics, chemistry each get a paragraph in the capstone, not a full treatment.

## Files

```
plans/representation-theory/
  README.md                              (this file)

docs/representation-theory/
  lib/
    rep-math.js                          (character tables, Young operations, sl₂/classical reps, Schur-Weyl, Monster data)
    test.html                            (in-browser sanity checks)
  index.html                             (series landing page)
  01-what-is-a-representation.html
  02-group-actions-and-linear-reps.html
  03-characters-and-orthogonality.html
  04-symmetric-group-and-young-tableaux.html
  05-induction-restriction-frobenius.html
  06-tensor-products-and-clebsch-gordan.html
  07-sl2-template.html
  08-classical-lie-algebra-reps.html
  09-schur-weyl-duality.html
  10-representation-ring-and-burnside.html
  11-compact-groups-peter-weyl.html
  12-induced-reps-and-mackey.html
  13-symmetric-group-branching-plethysm.html
  14-monster-representations-moonshine.html
  15-capstone-synthesis-horizons.html
```
