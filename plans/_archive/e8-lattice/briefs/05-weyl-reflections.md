# 05 — Weyl Reflections: the Computational Engine

## Pitch

A Weyl reflection is a single formula: `s_α(x) = x − ⟨x, α⟩ α` (using squared length 2 to simplify the usual expression). Apply this to any root of E8 and you get another root — the whole root system is closed under reflections through hyperplanes perpendicular to its members. This explainer makes the reflection operation the *working verb* of the series: we show that starting from any simple root and repeatedly applying reflections generates all 240 roots, that the group of all such compositions (the Weyl group) has order 696,729,600, and that every computation the reader will do in later explainers is built out of this one operation.

## Figures

1. **A single reflection in 2D.** Take the 6 roots of A_2 (hexagon). Click a root and an axis; the chosen root flips across the perpendicular hyperplane. Introduces the formula with tiny, checkable inputs. SVG.
2. **A single reflection on all 240.** Pick a simple root αᵢ via a selector; apply sᵢ to every root; show a before/after parallel-coordinates view where the ~120 roots that moved are animated. SVG.
3. **Orbit generator (the centerpiece).** Pick a starting root. Apply sequences of simple reflections (user can click buttons s₁ through s₈ to build a word); watch the orbit grow in a 2D projection. The "generate all 240" button plays a BFS that finishes in a few hundred steps. SVG + canvas projection.
4. **Fundamental chamber.** The Weyl group acts freely on the 240 roots except for the stabilizers; show the fundamental chamber as a region bounded by 8 hyperplanes, with exactly one positive-root representative per orbit. SVG.
5. **Weyl group order factorization.** Compute |W(E_8)| = 696,729,600 = 2¹⁴ · 3⁵ · 5² · 7, with a static breakdown figure and comparison to |W(A_n)| = (n+1)! and other classical orders. SVG.

## Key formulas / constructions

- Reflection formula (general): `s_α(x) = x − 2⟨x, α⟩ / ⟨α, α⟩ · α`.
- Simplified for E8 (squared length 2): `s_α(x) = x − ⟨x, α⟩ · α`.
- Weyl group: W(E_8) = ⟨s_{α₁}, …, s_{α₈}⟩, order 696,729,600 = 2¹⁴ · 3⁵ · 5² · 7.
- Braid relations from the Dynkin diagram: `(sᵢ sⱼ)^{mᵢⱼ} = 1` where `mᵢⱼ = 3` for adjacent nodes and `2` otherwise.

## Dependencies

- #03 (240 roots and inner-product machinery).
- #04 (simple roots and the Dynkin diagram as the source of the 8 generating reflections).
- Lib: `E8.reflect(x, alpha)`, `E8.weylGenerators`, `E8.orbit(start, generators)`. This explainer formalizes what "doing something with E8" means.

## Reader takeaway

The reader can apply a Weyl reflection by hand using the simplified formula, has seen that a small set of 8 reflections generates the symmetry group of the entire root system, and understands why every subsequent explainer uses reflections as its computational primitive. They know the order of the Weyl group and why it factors the way it does. This is the explainer that *locks in* computational fluency.
