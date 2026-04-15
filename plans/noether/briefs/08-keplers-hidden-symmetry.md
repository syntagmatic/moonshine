# 08 — Kepler's Hidden Symmetry

## Pitch

The Kepler problem has the conserved quantities you expect — energy, angular momentum, and the orbital plane — and one you don't: the Laplace-Runge-Lenz vector, which points along the ellipse's semi-major axis and is constant for an inverse-square force. LRL isn't a Noether current of a point transformation like the ones in #05; it's the conserved quantity of a *velocity-dependent* symmetry, and it's the standard example of what Noether's theorem buys you once you let the symmetry act on phase space. This explainer unveils the LRL vector, watches it survive on orbits the reader can perturb, and names the hidden group — SO(4) — whose existence is why hydrogen's energy levels degenerate the way they do.

## Figures

1. **Kepler orbit with LRL vector.** The sun at one focus, a planet on an elliptical orbit. An arrow from the sun along the semi-major axis represents the LRL vector. Play the orbit; the LRL vector does not rotate with the planet — it stays fixed. Play/pause/step controls. SVG + ODE integration.
2. **LRL under a perturbation.** Add a small `1/r³` correction (the leading general-relativity term). The LRL vector now precesses slowly, and so does the orbit. A slider controls the correction strength. SVG.
3. **Energy, L, and A in one panel.** A three-panel monitor during an orbit: `E` (flat), `L_z` (flat), `|A|` (flat). Flip to the perturbed case and `A`'s direction starts to rotate even as `|A|` may stay nearly fixed. SVG.
4. **SO(4) on bound orbits.** A schematic showing that bound Kepler states can be mapped to points on a 3-sphere `S³ ⊂ ℝ⁴`, and the six-parameter group SO(4) — rotations of `S³` — acts on them. The three rotation generators are `L`, the three LRL generators are `A/√(−2mE)`. Schematic with KaTeX. Static.
5. **Quantum Kepler preview.** A Bohr energy-level diagram annotated with the `n²` degeneracies: 1, 4, 9, 16. Caption explains that Pauli used the LRL vector to derive the hydrogen spectrum algebraically in 1926, a clean instance of symmetry-first quantum mechanics. Static.

## Key formulas / constructions

- Kepler Lagrangian: `L_kep = ½ m |qdot|² + G M m / |q|`.
- Angular momentum: `L = m (q × qdot)`, conserved.
- Laplace-Runge-Lenz vector: `A = p × L − G M m² q̂`, where `p = m qdot` and `q̂ = q/|q|`.
- Calculation: `dA/dt = 0` under the inverse-square force.
- Interpretation: `A` points from the focus to perihelion; `|A| = G M m² · e`, where `e` is the eccentricity.
- Hidden symmetry: for bound states `E < 0`, the six operators `(L, A/√(−2mE))` close under Poisson brackets (or commutators) to the Lie algebra `so(4)`.
- Consequence: the hydrogen energy levels depend only on the principal quantum number `n`, not on the orbital quantum number `ℓ`, because the symmetry group is SO(4), not just SO(3).

## Dependencies

- #07 (rotation → angular momentum).
- #05 (Noether's first theorem) in spirit: LRL is a conserved quantity of a *velocity-dependent* (phase-space) symmetry rather than a point transformation of configuration space, so it lives just outside #05's exact formula. The explainer should say so explicitly: Noether's theorem extends to canonical transformations of phase space, and LRL is the standard example of what the extension buys you.
- Lib: `NOETHER.systems.kepler`, `NOETHER.systems.keplerLRL`, `NOETHER.integrate.rk4`.

## Reader takeaway

The reader has watched a conservation law that isn't on the usual list — the Laplace-Runge-Lenz vector — and understood that "conservation law" includes surprising quantities whose origin is a hidden symmetry. They have seen a perturbation restore precession and met SO(4) as the Kepler problem's real symmetry group, which is why hydrogen's energy levels degenerate the way they do. Noether's first theorem is more than a three-item list.
