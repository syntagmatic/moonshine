# 08 — The Coxeter Plane

## Pitch

The most recognizable image of E8 — the one in textbooks, on T-shirts, in the AIM press release — is the Coxeter plane projection: 240 points arranged in 8 concentric circles of 30, with a perfect 30-fold rotational symmetry. It looks almost impossible, and the question this explainer answers is *why does this specific plane exist, and what makes it canonical?* The answer is algebraic: the Coxeter plane is the unique 2-plane in ℝ⁸ invariant under a special Weyl group element called the Coxeter element, whose order is the Coxeter number h = 30. Once you understand that, the 30-fold symmetry and the 8 rings of 30 fall out as forced consequences, not coincidences.

## Figures

1. **The finished image.** 240 roots projected onto the Coxeter plane. 8 concentric rings of 30 points each, with edges (at inner-product 1) drawn faintly to reveal the underlying Petrie polygon structure. SVG.
2. **Building the Coxeter element.** `c = s₁ s₂ s₃ s₄ s₅ s₆ s₇ s₈`, the product of all 8 simple reflections in Bourbaki order. Show that `c` has order 30. Interactive: apply `c` repeatedly to a starting root and watch it trace a 30-step Petrie polygon. SVG.
3. **Eigenvalues of c.** The Coxeter element has 8 complex eigenvalues of modulus 1. They come in pairs `(exp(2πi m / h), exp(−2πi m / h))` for m in the set of E_8 exponents {1, 7, 11, 13, 17, 19, 23, 29}. The Coxeter plane is the 2-plane corresponding to the pair (m=1, m=29). SVG.
4. **Projection construction.** Given the Coxeter plane, project each root onto it by the standard orthogonal projection. The result: 240 points in the 2-plane. Interactive: step through the projection formula, picking a root and watching it land in its destination ring. SVG.
5. **Ring decomposition.** The 240 roots split into 8 Coxeter-element orbits, each of size 30. Each orbit is a single ring. Color-code the projection by orbit. SVG.
6. **The Petrie polygon.** A single orbit, viewed as a 30-gon traced by iterating `c` on one root. Interactive: choose the starting root, watch the 30-gon build step by step. SVG.

## Key formulas / constructions

- Coxeter element: `c = s_{α₁} s_{α₂} ⋯ s_{α₈}`.
- Coxeter number for E_8: `h = 30`.
- Exponents of E_8: `{1, 7, 11, 13, 17, 19, 23, 29}`. These are the m values for which `exp(2πi m/h)` is an eigenvalue of `c`.
- Sum of exponents = 120 = number of positive roots.
- Coxeter plane: the real 2-plane corresponding to the pair `(e^{2πi/30}, e^{−2πi/30})`.
- Orbit structure: `240 = 8 × 30`, one orbit per pair of exponents.

## Dependencies

- #05 (Weyl reflections, Weyl group, composition).
- #04 (simple roots for building `c`).
- Lib: `E8.coxeterElement`, `E8.coxeterPlane`, `E8.project.toCoxeterPlane(roots)`, `E8.exponents`.

## Reader takeaway

The reader can explain *why* the Coxeter plane image looks the way it does. They know that the 30-fold symmetry is the Coxeter number, that the 8 rings of 30 correspond to 8 Coxeter orbits of size 30 each, and that the plane itself is uniquely determined up to conjugation by a choice of Coxeter element. They have the vocabulary to recognize similar Coxeter-plane projections for other root systems (F_4, E_6, E_7) and know what the Coxeter number is doing in each.
