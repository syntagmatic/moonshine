# 04 — Symmetries of a Lagrangian

## Pitch

A Lagrangian has a symmetry when a transformation of the coordinates leaves it unchanged — or changes it only by a total time derivative, a subtlety that will matter. This explainer is about getting clear on what that sentence means: we distinguish symmetries of the *Lagrangian* from symmetries of the *equations of motion*, we introduce infinitesimal generators, and we set up the calculation that Noether's theorem will feed on. By the end, the reader can take a Lagrangian and a candidate transformation and decide, on paper, whether it's a symmetry.

## Figures

1. **Shift a free-particle Lagrangian.** Take `L = ½ m qdot²`. Apply `q ↦ q + c` for constant `c`. `L` is literally unchanged. Then apply `q ↦ λq`: `L` picks up a factor `λ²`, which is not a symmetry of `L` strictly, even though it's a symmetry of the EOM. Side-by-side diff. SVG.
2. **A 2D particle in a central potential.** Take `L = ½ m |qdot|² − V(|q|)` with `V(r) = ½ k r²` (harmonic) or `V(r) = −1/r` (Kepler). Rotate the plane by angle `φ`: `L` is unchanged because `V` depends only on `|q|` and `|qdot|`. Now add a constant gravitational bias `−m g · q_y` to the potential: rotation is broken (the new potential picks a preferred "up"). Sliders let the reader try each. SVG.
3. **Infinitesimal generator panel.** For `q ↦ q + ε X(q, t)`, compute `δL = (∂L/∂q) X + (∂L/∂qdot) Xdot`. The reader picks `X` from a dropdown (`X = 1`, `X = q`, `X = sin q`, `X = v t` for Galilean boost) and watches `δL` computed symbolically as a KaTeX expression. A flag reads "symmetry of L" iff `δL = 0` and "quasi-symmetry" iff `δL = dF/dt`. SVG.
4. **Symmetry of L vs. symmetry of EOM.** A two-column table of three Lagrangians crossed with three transformations. Cells are colored: red (not a symmetry), green (symmetry of `L`), yellow (quasi-symmetry). Static.
5. **Why quasi-symmetries count.** A text card with a one-line derivation: if `δL = dF/dt`, then `δS = F(t₁) − F(t₀)` is a boundary term and the action is still stationary on physical paths. Noether's theorem still fires; the current just picks up the `−F` piece. Static.

## Key formulas / constructions

- Infinitesimal transformation: `q ↦ q + ε X(q, t)`.
- `δL = (∂L/∂q) X + (∂L/∂qdot) Xdot`.
- Strict symmetry: `δL = 0`. Quasi-symmetry: `δL = dF/dt` for some `F(q, t)`.
- Free particle, `X = 1` (spatial translation): `δL = 0` — strict symmetry.
- Free particle, `X = v t` (Galilean boost): `δL = m v qdot = d/dt(m v q)` — quasi-symmetry with `F = m v q`.
- Pendulum, `X = 1` (shift of `θ`): `δL = −m g l sin θ ≠ 0` — not a symmetry (gravity breaks it).

## Dependencies

- #03 (Lagrangians and Euler-Lagrange).
- Lib: `NOETHER.symmetry.delta(L, X, q, qdot)`, `NOETHER.symmetry.isSymmetry(L, X, samples)`, `NOETHER.symmetry.isQuasiSymmetry(L, X, samples)`.

## Reader takeaway

The reader can write down a candidate transformation, compute `δL`, and decide if it's a strict symmetry, a quasi-symmetry, or neither. They understand why quasi-symmetries still count (the action shifts by a boundary term), and they know the distinction between symmetries of `L` and symmetries of the EOM. This explainer is the definitional pivot that the whole conservation-law arc of Act II rests on.
