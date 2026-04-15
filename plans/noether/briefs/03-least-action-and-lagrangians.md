# 03 — Least Action and Lagrangians

## Pitch

Before we can talk about symmetries of a physical system, we need to know what a physical system *is*. The answer Noether starts from — and the answer modern physics still uses — is a *Lagrangian*: a single function `L(q, qdot, t)` that, integrated along a path, gives a quantity called the *action*, and whose stationary points are the physical trajectories. By the end of this explainer, the reader can drag a path between two endpoints, watch the action light up, and feel the Euler-Lagrange equations pull the path to its stationary shape.

## Figures

1. **Brachistochrone as a variational problem.** Two endpoints at different heights. The reader drags waypoints on a path between them; a bead slides under gravity along each candidate; the total travel time is displayed. A "release to optimum" button eases the path toward the cycloid. The caption notes that this is Bernoulli's 1696 problem — a variational problem (minimize a functional), which is the conceptual ancestor of Hamilton's principle (minimize the action `∫L dt`) that the next figures introduce. SVG + canvas for the bead animation.
2. **Free particle in 1D.** A plot of `q(t)` vs. `t`. The reader drags an interior control point of a path between fixed endpoints. The action `S = ∫ ½ m qdot² dt` is displayed live and is minimized when `q(t)` is a straight line. SVG.
3. **Pendulum Lagrangian.** The classic `L = ½ m l² thetadot² − m g l (1 − cos θ)`. Swing the pendulum. Kinetic and potential energies appear as stacked bars; the action `∫ L dt` accumulates as the bob swings. SVG.
4. **A path bundle to a single path.** 30 candidate paths between two events light up with different actions; the minimum-action path is highlighted. Click any candidate to see its action value and compare. SVG.
5. **Euler–Lagrange derivation card.** A short KaTeX-rendered walk-through: first variation of `S`, integration by parts, boundary terms vanish, and the integrand must vanish for all variations. Static.

## Key formulas / constructions

- Lagrangian: `L(q, qdot, t)`. Free particle: `L = ½ m qdot²`. Particle in potential: `L = ½ m qdot² − V(q)`.
- Action: `S[q] = ∫_{t₀}^{t₁} L(q(t), qdot(t), t) dt`.
- Hamilton's principle: physical paths are stationary points of `S` among paths with fixed endpoints.
- Euler-Lagrange: `d/dt (∂L/∂qdot) − ∂L/∂q = 0`.
- Pendulum: `L = ½ m l² thetadot² − m g l (1 − cos θ)` gives `thetadotdot + (g / l) sin θ = 0`.

## Dependencies

- #01 for the idea that transformations act on a space — here, on the space of paths.
- Lib: `NOETHER.lagrangian.action(L, path, dt)`, `NOETHER.lagrangian.euler(L, q, qdot)`, `NOETHER.lagrangian.integrate(L, q0, qdot0, steps)`.

## Reader takeaway

The reader understands that a physical system is encoded in a Lagrangian, that the action is what you minimize, and that the Euler-Lagrange equations are the inevitable consequence of that minimization. They have seen it work on a brachistochrone, a free particle, and a pendulum — enough concreteness to carry into Noether's theorem in the next two explainers.
