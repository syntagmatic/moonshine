# 05 — Noether's First Theorem, in Pictures

## Pitch

This is the moment the whole first half of the series has been building toward. Given a Lagrangian `L(q, qdot, t)` and a continuous one-parameter symmetry `q ↦ q + ε X`, there is a conserved quantity `Q = (∂L/∂qdot) · X − F`, where `F` comes from any quasi-symmetry piece. The theorem is short enough to write on a napkin, but its content is that *every continuous symmetry of the action gives you a conservation law, for free*. This explainer walks through the derivation visually, watches it work on a free particle (translation → momentum), and sets up the concrete instances in Act II.

## Figures

1. **The derivation, step by step.** A five-step KaTeX carousel. (i) `L` is a quasi-symmetry, so `δL = dF/dt`. (ii) Expand `δL` using chain rule as `(∂L/∂q) X + (∂L/∂qdot) Xdot`. (iii) Use Euler-Lagrange to rewrite `∂L/∂q` as `d/dt(∂L/∂qdot)`. (iv) Collect into `d/dt[(∂L/∂qdot) X] = dF/dt`. (v) Therefore `Q = (∂L/∂qdot) X − F` is conserved along solutions. Static with step controls.
2. **Free particle, translation → momentum.** `L = ½ m qdot²`, symmetry `X = 1` (spatial translation). The conserved quantity is `Q = m qdot = p`. An animated particle trajectory with `Q(t)` plotted as a horizontal line that doesn't move. SVG + ODE integration.
3. **Pendulum does not have momentum conservation.** Same workshop, pendulum Lagrangian; the `X = 1` symmetry fails (`δL ≠ 0`). If you naively treat `m l² thetadot` as a conserved current, it isn't — because the pendulum has no angular symmetry (gravity breaks it). The plot shows `m l² thetadot` oscillating. SVG.
4. **A symmetry-current workshop.** Pick a Lagrangian from a menu (free particle, harmonic oscillator, pendulum, Kepler) and a symmetry from a menu (`X = 1`, `X = q`, rotation, Galilean boost). Compute `Q` live; integrate the trajectory; verify `Q(t) ≈ Q(0)` numerically. A red warning when the symmetry check fails. SVG.
5. **Theorem card.** A framed restatement of Noether's first theorem with assumptions (continuous symmetry of the action, smooth Lagrangian) and conclusion (a conserved current). Cites Noether's 1918 paper *Invariante Variationsprobleme*. Static.

## Key formulas / constructions

- Noether's first theorem: if `L` has a continuous symmetry `q ↦ q + ε X` with `δL = dF/dt`, then `Q = (∂L/∂qdot) · X − F` is conserved along solutions of the EOM.
- Key step: `δL = d/dt[(∂L/∂qdot) X] = dF/dt`, so `d/dt[(∂L/∂qdot) X − F] = 0`.
- Free particle: `L = ½ m qdot²`, `X = 1`, `F = 0`, `Q = m qdot` (momentum).
- Free particle, Galilean boost `X = t`: `L = ½ m qdot²`, `F = m q`, `Q = m qdot t − m q`. On any free-particle trajectory `q(t) = q₀ + v t` this reduces to `Q = −m q₀`, the initial position (constant in time).
- Particle in potential `V(q)`: translation is a symmetry only if `V` is constant (no force).

## Dependencies

- #03 (Lagrangian and Euler-Lagrange).
- #04 (symmetries and quasi-symmetries of `L`).
- Lib: `NOETHER.noether.current(L, X, F, q, qdot)`, `NOETHER.noether.verify(L, X, q0, qdot0, steps)`.

## Reader takeaway

The reader has read Noether's first theorem in a form they can apply, walked through the derivation line by line, and verified it numerically on a free particle. They understand the shape of the conserved-current formula and know that every conservation law in Act II is an instance of this one statement. They are primed to recognize energy, momentum, and angular momentum as the three classical outputs of a single machine.
