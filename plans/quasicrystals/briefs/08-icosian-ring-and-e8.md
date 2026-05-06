# 08 - The icosian ring and E8

## Pitch

Identify the algebraic substrate. The 120 vertices of the regular 600-cell are a finite subgroup of the unit quaternions, called the *binary icosahedral group* 2ℐ. The ℤ-linear combinations of these quaternions form a ring — the icosian ring ℋ, with W(H₄)-symmetric multiplicative structure. Tensor with ℤ[φ]: ℋ[φ] = ℋ ⊗_ℤ ℤ[φ]. This is the substrate squishy-thing's canonical scheme uses.

The Galois-pair embedding ℋ[φ] ↪ ℝ⁸ is the move that makes everything connect. Each ℤ-generator g of ℋ[φ] becomes the 8-vector (g, σ(g)) ∈ ℝ⁴ × ℝ⁴, where σ is the Galois automorphism from essay 3 acting coordinate-wise. The image Λ = ρ(ℋ[φ]) is a discrete rank-8 lattice; physical projection picks the first 4 coordinates, internal picks the last 4. Because σ takes φ to 1 − φ ≈ −0.618, the Galois conjugate is *contractive* — the internal projection of large physical-space vertices stays bounded, and the cut-and-project enumerator terminates.

E8 enters one further metric twist away. Wilson's identity `E8 = 2ℐ ∪ τ · 2ℐ` (where τ = φ in a Bourbaki-compatible frame) realises the 240-root E8 lattice as the union of the icosians and their τ-scaled copy. The image Λ = ρ(ℋ[φ]) sits inside the icosian root lattice L_I at index 4; L_I sits inside Wilson's E8 at one further metric step. Three lattices share the icosian ring as arithmetic source but occupy distinct metric frames; squishy-thing exposes all three (`elserSloane`, `elserSloaneLI`, `icosianE8HopfQuaternionic`) and tracks the distinctions in research dossier 22.

## Math basis

ℋ = ℤ⟨1, i, j, ω⟩ where ω = (1 + i + j + k) / 2 is the Hurwitz half-integer; 2ℐ is the 120-element subgroup whose ℤ-span is ℋ. ℋ[φ] = ℤ⟨1, i, j, ω, φ, φi, φj, φω⟩ has rank 8 over ℤ. The embedding ρ: ℋ[φ] → ℝ⁸ is g ↦ (g, σ(g)). The 600-cell window `sixHundredCell(1)` ⊂ ℝ⁴ is built from the convex hull of the 120 unit icosians; squishy-thing computes its 600 facet centroids by enumerating 4-cliques of the 2ℐ nearest-neighbour graph. Apothem √((2 + 3φ) / 8) ≈ 0.9256.

## Figures

1. **The 600-cell** (interactive): rotatable 4D rendering with H₄ acting; vertices shown as the 120 unit icosians; Hopf fibration optionally overlaid.
2. **Galois-pair embedding** (interactive): the 8-coordinate view. Reader drags the first 4 (physical) coordinates of an icosian; the last 4 (internal) update via σ. The figure highlights that σ is contractive: a physical step of size φ produces an internal step of size |1 − φ| < 1.
3. **Three lattices, one ring** (static): a Venn-style diagram showing Λ = ρ(ℋ[φ]) ⊂ L_I ⊂ Wilson's E8, with vertex-counts and shell populations (24, 48, 216, 288, 624 for ρ(ℋ[φ]); 120, 240, 600, 1440 for L_I; 240, 2160, 6720, 17520 for E8).
4. **Slice descents** (interactive): the same 8D Elser–Sloane scheme, sliced down to 4D (`elserSloane`), 3D (`h3Quasicrystal`), or 2D (`penroseFromE8`) by promoting physical coordinates to internal. The reader picks slice depth and watches the vertex set descend.

## Key terms

- `binary icosahedral group 2ℐ`: the 120-element subgroup of unit quaternions; vertices of the regular 600-cell.
- `icosian ring ℋ`: the ℤ-span of 2ℐ; a non-commutative ring with W(H₄)-symmetric multiplication.
- `ℋ[φ]`: ℋ ⊗_ℤ ℤ[φ]; rank-8 over ℤ; substrate for the canonical cut-and-project scheme.
- `Galois-pair embedding ρ`: g ↦ (g, σ(g)) ∈ ℝ⁸; physical and internal projections take the first and last 4 coordinates.
- `Wilson's E8 identity`: E8 = 2ℐ ∪ τ · 2ℐ in a Bourbaki-compatible frame.

## Misreadings to avoid

- Do not say "the icosian ring is E8." The icosian ring is a quaternionic ring; ρ(ℋ[φ]) is a rank-8 sublattice of L_I; L_I is a different metric realisation of E8. The three are distinct objects sharing one arithmetic source.
- Do not present `elserSloane()` as projecting from E8. It projects from ρ(ℋ[φ]), an index-4 sublattice; the E8 realisation is `icosianE8HopfQuaternionic()` and uses a different metric frame. Squishy-thing's research dossier 22 documents the distinction.
- Do not conflate the H₄ symmetry of the ambient lattice with the H₃ symmetry of the H₃ quasicrystal slice. H₃ is the stabilizer of a chosen slice axis inside H₄.
- Do not promote the icosian ring's appearance in E8 as a physics theory of everything. The mathematics is rigorous; the physics interpretations (Lisi, QGR, etc.) are speculative and called out in the series-level cautions.

## Library substrate

- `CANONICAL_ICOSIANS` (120 unit icosians as exact ℤ[φ] quaternions), `quaternionFromAmbient`, `icosianE8HopfQuaternionic` in `/Users/kai/git/squishy-thing/packages/e8-core/src/icosian.ts`.
- `elserSloane`, `elserSloaneLI`, `lIAdditiveCosetShifts`, `icosianRootLatticePoints` in `cut-and-project.ts`.
- `research/22-galois-pair-lattice/` and `research/15-icosian-quaternions/` are the in-house anchors.

## Bridge notes

Essay 9 takes diffraction of `elserSloane()` and the H₃ slice; the icosian-ring substrate determines the reciprocal lattice and the 600-cell window FT. Essay 10 connects this to Shechtman's 1984 alloy as the empirical instantiation. Essay 11 returns to constructions that *don't* arise from this substrate.

## Reader takeaway

The 120 vertices of the 600-cell form a quaternionic group whose ℤ-span is the icosian ring ℋ. Tensoring with ℤ[φ] and embedding via the Galois-pair map (g, σ(g)) puts ℋ[φ] in ℝ⁸; physical projection picks the first 4, internal picks the last. The whole canonical cut-and-project scheme is one ring, one Galois automorphism, and one orthogonal split. E8 sits one metric step away.
