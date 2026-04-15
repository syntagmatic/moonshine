# 10 — Noether's Second Theorem and the Energy of Gravity

## Pitch

Noether's *second* theorem is less famous but is what Hilbert and Klein actually invited her to Göttingen to sort out: when a Lagrangian has a *local* (gauge) symmetry — a symmetry parameterized by a function, not a constant — the equations of motion are not all independent. They satisfy identities. This explainer makes the second theorem concrete on electromagnetism, where the identity reads `∂_μ ∂_ν F^{μν} = 0`, and then gestures at general relativity, where the same machinery explains why global energy conservation in GR is a subtle, local notion rather than a global one.

## Figures

1. **Global vs. local, visualized.** A scalar field `φ(x)` on a line. A "global" slider shifts the whole field by a constant. A "local" slider lets the shift vary with position. Only the local case introduces a non-trivial `∂_μ α(x)`. SVG.
2. **Gauge identity in electromagnetism.** Maxwell's action `S = −¼ ∫ F_{μν} F^{μν} d⁴x`. Applying a local U(1) transformation, the second theorem returns the identity `∂_μ ∂_ν F^{μν} = 0`, which is automatic from the antisymmetry of `F^{μν}`. The second theorem is telling us that *this relation is forced by the gauge symmetry itself*, not by the equations of motion. Static KaTeX derivation with callouts.
3. **General relativity preview.** The Einstein-Hilbert action `S_EH = (1 / 16π G) ∫ R √(−g) d⁴x`. Its local symmetry is diffeomorphism invariance. The second theorem delivers the contracted Bianchi identity `∇_μ G^{μν} = 0`. Because the metric is dynamical, no single global tensorial energy exists — only a pseudo-tensor that depends on the coordinate chart. Schematic with KaTeX; no full tensor calculation. Static.
4. **First vs. second theorem side-by-side.** A two-column table: continuous parameter (constant vs. function), Noether output (conservation law vs. differential identity), example (U(1) global → charge vs. U(1) local → `∂_μ ∂_ν F^{μν} = 0`; Poincaré global → energy-momentum vs. `Diff(M)` → contracted Bianchi). Static.
5. **Why this matters historically.** A text card on the 1917–1918 correspondence between Hilbert, Klein, and Noether, the puzzle of energy conservation in GR that Hilbert flagged, and Noether's resolution via the second theorem. Static.

## Key formulas / constructions

- Local symmetry: `δφ = α(x) X(φ) + ∂_μ α(x) Y^μ(φ)`.
- Second theorem: if the action is invariant under such local transformations for all `α(x)`, the Euler-Lagrange expressions `E_i(L)` satisfy an identity `X · E(L) + ∂_μ (Y^μ · E(L)) = 0` *identically*, not just on-shell.
- Electromagnetism: `L = −¼ F_{μν} F^{μν}` with `F_{μν} = ∂_μ A_ν − ∂_ν A_μ`. Local gauge `A_μ ↦ A_μ + ∂_μ α` gives the identity `∂_μ ∂_ν F^{μν} ≡ 0` (antisymmetry of `F`).
- General relativity: `S_EH ∝ ∫ R √(−g)`; diffeomorphism invariance gives `∇_μ G^{μν} ≡ 0` (contracted Bianchi).
- Consequence: energy-momentum is conserved only in the covariant sense `∇_μ T^{μν} = 0`, and globally only for spacetimes with additional isometries (time-like Killing vectors).

## Dependencies

- #05 (first theorem).
- #09 (gauge U(1) and electromagnetism).
- Lib: `NOETHER.noether.secondTheoremIdentity(L, localX)` (for small electromagnetic cases, no full GR).

## Reader takeaway

The reader can distinguish Noether's two theorems, knows that *local* symmetries produce *identities* (antisymmetry of `F`, contracted Bianchi) rather than new conservation laws, and has met the historical reason the second theorem was written: Hilbert and Klein wanted to know why GR doesn't have a clean global energy law, and Noether told them. They leave Act II with an honest sense of both what the theorems say and what they don't say.
