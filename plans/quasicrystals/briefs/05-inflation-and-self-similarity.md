# 05 - Inflation and self-similarity

## Pitch

Multiply every Penrose vertex by φ. The result is a subset of the original vertex set. This is *inflation*: the vertex set maps into itself under scaling by the golden ratio. The same property holds for Fibonacci (inflation factor φ), the H₃ quasicrystal (inflation factor φ³), and Elser–Sloane (inflation factor φ). The figure should make this kinetic — a fixed-point map where each scaled copy contains its own scaled copy, indefinitely.

The substitution-rule perspective is the same content in dual frame. Instead of inflating vertices, decompose tiles. Each Penrose tile decomposes into a fixed set of smaller tiles in a deterministic way: a kite becomes one kite plus two dart-halves; a dart becomes one dart plus a kite-half. Iterate from a single tile and you generate the entire infinite tiling. Same result, different verb. The equivalence (for Penrose) is a theorem; essay 11 returns to where it breaks.

## Math basis

For a cut-and-project scheme with inflation factor τ, the vertex set Λ★ satisfies τ · Λ★(o) ⊆ Λ★(σ(o)) where σ is the Galois automorphism of essay 3. In physical space, vertices scale by τ; in internal space, the offset scales by σ(τ). For Penrose, τ = φ and σ(φ) = 1 − φ ≈ −0.618; the contraction in internal space is the dual of the expansion in physical space. The substitution matrix M for Penrose is `[[1, 1], [1, 2]]` for (kites, darts) per inflation step; its eigenvalues are φ² and 1 − φ — the inflation factor squared (one inflation produces tiles of two scales) and its Galois conjugate.

## Figures

1. **φ-inflation animation** (interactive): Penrose tiling with an inflation depth slider. At depth N, the original vertex set is shown alongside its φᴺ-scaled image. The scaled image fits inside the original. Reader can advance depth and see the nesting accumulate.
2. **Fibonacci inflation** (interactive): same map applied to the 1D Fibonacci tiling. Easier to verify by eye — the long tiles at depth N+1 align with long-tile boundaries at depth N.
3. **Substitution rule for Penrose** (interactive): a single kite or dart on the left; the figure decomposes it into smaller tiles per the substitution rule; iterate to depth N. Reader picks N.
4. **Inflation matrix card** (static): the Penrose substitution matrix M; its eigenvalues; the Perron-Frobenius eigenvector giving the asymptotic tile-density ratio (φ:1 again). Same φ that appeared in essay 1.
## Key terms

- `inflation factor τ`: the scalar (φ for Penrose / Fibonacci, φ³ for H₃) under which the vertex set scales into itself.
- `PV number`: Pisot-Vijayaraghavan; algebraic integer > 1 with all Galois conjugates inside the unit circle. The class of inflation factors that give pure-point diffraction.
- `substitution rule`: a tile-replacement map that, iterated, produces the entire tiling from a single seed tile.
- `inflation matrix M`: the integer matrix whose (i, j) entry is the number of type-i tiles in the substitution of a type-j tile.

## Misreadings to avoid

- Do not equate inflation with self-similarity in the strict sense. Inflation maps Λ★ to a *subset* of itself (or into a different offset), not to itself bijectively. The proper term is self-similar Delone set or, for the substitution view, self-affine.
- Do not claim every quasicrystal has an inflation symmetry. Cut-and-project schemes have it under conditions (window must be compatible with the inflation acting on internal space); substitution-defined ones have it by construction. Essay 11 shows constructions where neither holds.
- Do not conflate inflation (a vertex-set scaling) with substitution (a tile-replacement map). They produce the same infinite output but operate on different objects; the equivalence is a theorem.
- Do not present φ as a free parameter. The inflation factor is forced by the underlying Coxeter geometry — H₂ for Penrose locks φ; H₃ locks φ³.

## Library substrate

- Test invariant #4 in `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.test.ts`: φ-inflation maps interior vertices to a subset of the same Elser–Sloane vertex set.
- `PhiExact` makes the φ-multiplication exact, so the subset relation can be checked by integer comparison rather than tolerance.
- A first-class `inflate(scheme, factor)` verb is not yet in squishy-thing; its absence is a follow-up checkbox in the dossier. The essay can use direct vertex multiplication for figure 1.

## Bridge notes

Essay 6 already showed that the offset torus parametrizes the LI class; inflation acts on this torus via σ — different offsets inflate to different points but stay in the same LI class. Essay 9 will use the inflation matrix to predict diffraction structure (peak hierarchy and PV-number-driven pure-point spectrum). Essay 11 returns to substitution rules as a definition of "quasicrystal" independent of cut-and-project.

## Reader takeaway

A Penrose tiling is self-similar under scaling by φ: the vertex set contains a φ-scaled copy of itself, and that copy contains its own, and so on. Equivalently, each tile decomposes into smaller tiles in a deterministic way; iterate to generate the whole tiling from one seed. Both descriptions are exact; both produce the same infinite set; the scaling factor φ is locked by the underlying H₂ Coxeter geometry, not chosen.
