# 11 - Beyond cut-and-project

## Pitch

Essays 1–10 ran the cut-and-project line. This essay shows where that line ends. There are at least four widely-used definitions of "quasicrystal" or "aperiodic order," each capturing something different: (1) cut-and-project model set; (2) substitution-rule fixed point; (3) matching-rule tiling; (4) pure-point-diffraction Delone set. They are equivalent under specific conditions. They are *not* equivalent unconditionally. The essay maps where they agree, where they disagree, and what the disagreements are about.

The first non-cut-and-project construction is *substitution rules* alone. Robinson's 1971 hexagonal substitution and the chair tiling are well-defined infinite tilings produced by iterating a tile-replacement map from a single seed; not all of them are model sets, and not all have pure-point diffraction. Some have pure-point diffraction but require an inflation factor that is a *Pisot-Vijayaraghavan number* — algebraic integer > 1 with all Galois conjugates strictly inside the unit circle; the φ that essays 3 and 5 used qualifies, but other inflation factors (Salem numbers, non-algebraic factors) don't, and the diffraction picks up a continuous component.

The second is *Wang tiles* and the matching-rule construction. Robert Berger's 1966 thesis showed that the question "does a given finite tile-set tile the plane?" is *undecidable* — there is no algorithm. This is the strongest known result on the depth of aperiodic constructions. Wang tiles can produce aperiodic-only tile-sets that do not arise from any cut-and-project scheme; matching rules can encode arbitrary Turing-machine computation; the resulting tilings can be aperiodic for arbitrarily complicated reasons. The essay should give the reader enough of this to feel why the four-definition equivalence question is genuinely hard.

## Math basis

The four definitions, in shorthand: (CP) Λ★ = π_∥({p ∈ Λ : π_⊥(p) ∈ W}); (SUB) σ-fixed-point of a substitution map on a finite tile-set; (MR) tilings that satisfy a finite local matching condition and admit at least one tiling but no periodic one; (DIFF) Delone sets whose diffraction measure is pure-point. The implications hold under conditions: every nice CP scheme gives a DIFF Delone set (Hof 1995); every PV-number SUB gives a DIFF tiling (Solomyak 1997); some MR tilings are CP, some aren't. Squishy-thing's substrate covers (CP) and (DIFF) for the canonical schemes; (SUB) is partially exposed via inflation-invariance tests; (MR) is not in scope.

## Figures

1. **Four definitions, one Venn** (static): the four definitions as overlapping regions, with named examples placed inside. Penrose: in all four. Fibonacci: in all four. Chair tiling: SUB + DIFF, not CP, debatable MR. Random tiling: none. Pinwheel: SUB, not CP, has *continuous* diffraction component (so not strict DIFF).
2. **Robinson substitution** (interactive): the chair tile and its substitution rule. Reader picks depth N and watches the tiling generate.
3. **Wang tiles** (interactive): a small Wang-tile set; reader places tiles obeying edge-color matching; the figure flags rule violations. A fixed aperiodic-only set is shown to demonstrate that aperiodicity can be forced locally.
4. **Berger's undecidability** (static, reading): a sketch of how Wang tiles encode Turing-machine computation. Brief; this is a pointer, not a proof.
5. **Pisot vs. non-Pisot** (interactive): two substitution tilings, one with PV inflation factor (pure-point diffraction), one with non-PV (continuous component). Side-by-side diffraction patterns.

## Key terms

- `substitution rule`: a tile-replacement map; iterated, generates an infinite tiling from a seed.
- `Pisot-Vijayaraghavan number`: algebraic integer > 1 with all Galois conjugates strictly inside the unit circle. The class of inflation factors guaranteeing pure-point diffraction.
- `Wang tile`: a unit square with colored edges; valid tilings have matching colors at shared edges.
- `domino problem`: the decidability question for tile-set tileability; undecidable (Berger 1966).
- `local matching rule`: finite local constraints on tile adjacency.

## Misreadings to avoid

- Do not say "every quasicrystal is a model set." Some are. Some are substitution tilings without a CP description. Some have continuous diffraction components and fail the DIFF definition entirely.
- Do not promote one definition as "the" definition. The community uses different definitions in different contexts; the essay's job is to make the reader fluent across them.
- Do not present matching rules as equivalent to cut-and-project in general. Penrose-specific equivalence is a theorem; the general statement is false.
- Do not present Berger's undecidability as a curiosity. It is the deepest known result on aperiodic order and the reason many definition-equivalence questions remain open.

## Library substrate

- Squishy-thing covers (CP) and (DIFF). Substitution-rule infrastructure is partial: inflation-invariance is a test invariant, but a `Substitution` discriminated-union type and a `substitute(rule, depth)` enumerator are not yet in scope.
- A small inline Wang-tile and chair-substitution implementation in `quasi-viz.js` is the right path for figures 2 and 3.

## Bridge notes

Essay 10 closed the cut-and-project line at "Shechtman's pattern, predicted." This essay opens the broader question: what is "quasicrystal" outside that line? Essay 12 takes the question to the 2023 Hat / Spectre, where the *single-tile* aperiodic problem closes a question that was open for fifty years.

## Reader takeaway

"Quasicrystal" has at least four definitions: cut-and-project model set, substitution fixed point, matching-rule tiling, pure-point-diffraction Delone set. They are equivalent for Penrose, Fibonacci, and the H₃ icosahedral case; they diverge for Robinson, chair, Pinwheel, and arbitrary Wang-tile constructions. Berger's undecidability says the divergence is genuinely hard, not a quirk of small examples.
