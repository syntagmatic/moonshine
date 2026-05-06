# 03 - The golden ratio is not decoration

## Pitch

Examine the arithmetic that essays 1 and 2 have been quietly using. Aperiodic order is sensitive to the irrationality of the slope or projection in a way periodic order is not: floating-point drift accumulates with projection radius, and the "exactly two tile lengths in ratio φ:1" answer degrades within a few inflations. ℤ[φ] = { a + bφ : a, b ∈ ℤ } makes the answer exact. Squishy-thing's `PhiExact` represents these as integer pairs; addition, multiplication, and the Galois automorphism are all exact integer operations.

The deeper move is the Galois automorphism σ: ℚ(φ) → ℚ(φ) that sends φ ↦ 1 − φ. It is the only non-trivial field automorphism of ℚ(φ). In the canonical icosian Galois-pair embedding ℋ[φ] ↪ ℝ⁸, each ℤ-generator g maps to (g, σ(g)) ∈ ℝ⁴ × ℝ⁴: physical projection takes the first half, internal takes the σ-image. So σ *is* the relationship between physical and internal projections of the canonical scheme. That is the structural reason ℤ[φ] keeps appearing — not because φ is aesthetically golden, but because it is the smallest algebraic integer with a non-trivial Galois conjugate, and that Galois conjugate is the σ that the cut-and-project orthogonal split needs.

## Math basis

ℤ[φ] is the ring of algebraic integers in ℚ(φ); φ satisfies x² − x − 1 = 0. PhiExact represents (a + bφ) as the pair (a, b). Multiplication: (a + bφ)(c + dφ) = (ac + bd) + (ad + bc + bd)φ. Galois automorphism: σ(a + bφ) = (a + b) − bφ, i.e., (a, b) ↦ (a + b, −b). σ² = identity. Norm: N(x) = x · σ(x) = a² + ab − b² ∈ ℤ.

## Figures

1. **Float drift, side by side** (interactive): Fibonacci tile-length ratio computed two ways. Floating-point: ratio plotted vs. projection radius; visible drift from φ at modest radii. PhiExact: ratio holds to any depth. Reader switches modes.
2. **σ as a button** (interactive): a ℤ[φ] element shown as (a, b) with its position on the real line. A σ button maps it to (a + b, −b) — the second irrational position. The reader sees that σ takes φ ≈ 1.618 to 1 − φ ≈ −0.618 and verifies σ² = identity.
3. **Galois-pair embedding preview** (interactive): an icosian shown as a quaternion (a + bφ, c + dφ, e + fφ, g + hφ). The corresponding 8-vector is (q, σ(q)) = (a + bφ, …, σ(a + bφ), …). Reader drags physical coordinates; internal updates via σ. Foreshadows essay 8.
4. **Why φ specifically** (static): the minimal polynomial x² = x + 1; comparison with ℤ[√2] (octagonal tilings) and ℤ[ζ_12] (dodecagonal). φ is one example among a small family.

## Key terms

- `PhiExact`: typed integer-pair representation of ℤ[φ].
- `Galois automorphism σ`: the field automorphism φ ↔ 1 − φ.
- `algebraic integer`: a root of a monic integer polynomial.
- `norm N(x) = x · σ(x)`: the Galois-invariant integer associated to an element of ℤ[φ].

## Misreadings to avoid

- Do not suggest floating-point is "good enough" for quasicrystal computation. Drift compounds; even Penrose at modest radii loses the exact φ-ratio, and inflation tests fail.
- Do not claim ℤ[φ] is special because φ is special. ℤ[√2] supports octagonal aperiodic tilings; ℤ[ζ_12] supports dodecagonal. φ is the smallest example, not the only one.
- Do not conflate the algebraic Galois automorphism σ with a geometric reflection. σ is a field automorphism of ℚ(φ) realized as a coordinate swap in the embedding; the geometric content is downstream.

## Library substrate

- `PhiExact` and the icosian `CANONICAL_ICOSIANS` (120 unit icosians as exact ℤ[φ] quaternions) in `/Users/kai/git/squishy-thing/packages/e8-core/src/`.
- Tests verifying inflation invariance, tile-length ratio, and 600-cell facet enumeration all use exact arithmetic.
- Squishy-thing's `AGENTS.md` "Architecture Invariants" declares exact arithmetic as a load-bearing project invariant for non-crystallographic systems.

## Bridge notes

Essay 4 uses PhiExact for Penrose vertex coordinates; the kite-and-dart edge ratios are exact. Essay 5 uses σ explicitly: inflation by φ in physical space corresponds to inflation by σ(φ) = 1 − φ in internal space. Essay 8 makes the (g, σ(g)) Galois-pair embedding the central object.

## Reader takeaway

The golden ratio is not decoration. It is the smallest algebraic integer that supports cut-and-project; ℤ[φ] is the smallest ring that makes the projections exact. The Galois automorphism σ is the bridge between physical and internal projections in the canonical scheme. Floating-point breaks the construction; PhiExact preserves it.
