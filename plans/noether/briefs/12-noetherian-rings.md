# 12 — Noetherian Rings: Why Chains Must Stabilize

## Pitch

A ring is *Noetherian* if every ascending chain of ideals `I₁ ⊆ I₂ ⊆ I₃ ⊆ …` eventually stops growing. This one-line condition, introduced by Noether in her 1921 paper *Idealtheorie in Ringbereichen*, is the finiteness hypothesis under which nearly all of modern commutative algebra works. This explainer makes the chain condition tactile: the reader builds chains in `ℤ`, `k[x]`, `k[x, y]` and watches them stabilize, then meets a non-Noetherian ring (`k[x₁, x₂, x₃, …]`) where the chain never stops. They leave with the sense that "Noetherian" is a license for every termination argument Act III depends on.

## Figures

1. **Chains in ℤ.** Build an ascending chain by clicking integers: start with `(12)`, add 6 to get `(12, 6) = (6)`, add 4 to get `(12, 6, 4) = (2)`, add 3 to get `(2, 3) = (1) = ℤ`. The chain has length at most 4 before it hits all of `ℤ`. Interactive. SVG.
2. **Chains in k[x].** Same workshop for polynomials: `(x²) ⊂ (x) ⊂ (1)`. Any strictly ascending chain starting from `(f)` contains at most `deg(f) + 1` distinct ideals, because `k[x]` is a PID and each step up corresponds to dropping one irreducible factor. Interactive: reader drops polynomials and the chain builds. SVG.
3. **A 2D chain workshop.** In `k[x, y]`, start with a monomial ideal like `(x² y, x y³)` and ascend by adding generators. Chains always stabilize but the path can be long. Monomial ideals are visualized as a "staircase" region in the `(i, j)` grid. Interactive: add generators, watch the staircase climb. SVG.
4. **A non-Noetherian counterexample.** The ring `k[x₁, x₂, x₃, …]` of polynomials in infinitely many variables. The chain `(x₁) ⊂ (x₁, x₂) ⊂ (x₁, x₂, x₃) ⊂ …` never stabilizes. A scrolling view that lets the reader see the chain extending forever. SVG.
5. **Three equivalent formulations.** A card listing the three equivalent definitions: (a) every ascending chain of ideals stabilizes; (b) every ideal is finitely generated; (c) every non-empty collection of ideals has a maximal element. Quick proof sketch that (a) ⇔ (b) ⇔ (c). Static.

## Key formulas / constructions

- Ascending chain condition (ACC): every chain `I₁ ⊆ I₂ ⊆ …` satisfies `I_n = I_{n+1} = …` for some `n`.
- Noetherian ring: a commutative ring satisfying ACC on ideals.
- Equivalent: every ideal is finitely generated, i.e., `I = (a₁, …, a_k)` for some finite `k`.
- Examples of Noetherian rings: `ℤ`, any field `k`, `k[x₁, …, x_n]` (by Hilbert basis, #13), `ℤ[i]`, `ℤ[√−5]`, any Dedekind domain.
- Non-examples: `k[x₁, x₂, x₃, …]` (infinitely many variables), the ring of continuous functions on `[0, 1]`.
- Why three formulations are equivalent: if every chain stabilizes, a non-finitely-generated ideal `I` would give an infinite strictly ascending chain by repeatedly adding a generator not yet captured.

## Dependencies

- #11 (ideals and their generation).
- Lib: `NOETHER.rings.Z`, `NOETHER.rings.kx(k, n)`, `NOETHER.ideals.chain(ideal, generator)`, `NOETHER.ideals.generators(I)`, `NOETHER.ideals.stabilized(chain)`.

## Reader takeaway

The reader can state the Noetherian condition three ways, has built ascending chains in `ℤ`, `k[x]`, and `k[x, y]` and watched them stabilize, and has seen a ring where the chain never stops. They understand "Noetherian" as a termination guarantee — the reason the rest of Act III can exist at all.
