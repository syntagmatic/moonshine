# 06 — Time Translation and Energy

## Pitch

Energy conservation is the oldest conservation law in physics — Lagrange and Hamilton both knew it — but Noether's theorem is the first proof that tells you *where it comes from*: the Lagrangian doesn't explicitly depend on time. This explainer plugs time translation into Noether's machine, gets the Hamiltonian `H = qdot · (∂L/∂qdot) − L` out the other side, and then watches it conserved on a pendulum trajectory the reader can perturb, push, and see settle back onto its energy level curve.

## Figures

1. **Time translation as a symmetry.** Shift `t ↦ t + ε` on the free-particle Lagrangian. `L` doesn't care (no explicit `t`). Then add a damping term so `L` acquires a `t`-dependence (through a forced potential); the symmetry breaks. A diff panel highlights the `∂L/∂t` term. SVG.
2. **Pendulum phase space.** The `(θ, thetadot)` plane. The reader clicks a point to pick initial conditions; a trajectory spirals along a level curve of `H`. A flow-field background shows the Hamiltonian flow. Interactive ODE integration. SVG + canvas for the flow field.
3. **Perturb and watch.** Start the pendulum on a trajectory, then apply an instantaneous kick via a button. Energy jumps (phase curve moves to a new level). Reinforces that `H` is conserved only without external forcing. SVG.
4. **H vs. L vs. E.** A three-column table explaining where the Hamiltonian `H`, the Lagrangian `L`, and the physical energy `E = T + V` agree and disagree. For a simple pendulum they all agree; for a time-dependent potential or a velocity-dependent one, they don't. Static.
5. **Noether derivation, direct route.** Time translation needs slightly different bookkeeping than spatial Noether, because it transforms `t` as well as `q`. The cleanest derivation is direct: compute `dL/dt = (∂L/∂q) qdot + (∂L/∂qdot) qdotdot + ∂L/∂t`, use Euler-Lagrange to replace `∂L/∂q`, and collect to get `d/dt[qdot · (∂L/∂qdot) − L] = −∂L/∂t`. When `L` has no explicit `t`-dependence, the bracketed quantity — which is the Hamiltonian `H` — is conserved. KaTeX carousel. Static.

## Key formulas / constructions

- Time translation: `t ↦ t + ε`. A direct derivation from Euler-Lagrange gives `d/dt[qdot · (∂L/∂qdot) − L] = −∂L/∂t`.
- Conserved quantity (when `∂L/∂t = 0`): `H = qdot · (∂L/∂qdot) − L`. For `L = ½ m qdot² − V(q)`, this is `H = ½ m qdot² + V(q) = E`.
- Hamiltonian: `H(q, p) = p · qdot − L`, `p = ∂L/∂qdot`.
- Pendulum energy: `E = ½ m l² thetadot² + m g l (1 − cos θ)`.
- Time-dependent `L`: `dH/dt = −∂L/∂t`, so any explicit time dependence breaks energy conservation.

## Dependencies

- #05 (Noether's first theorem).
- #03 (Lagrangian and Euler-Lagrange).
- Lib: `NOETHER.noether.hamiltonian(L, q, qdot)`, `NOETHER.systems.pendulum`, `NOETHER.integrate.rk4(system, state, dt, steps)`.

## Reader takeaway

The reader can look at a Lagrangian and decide, by inspecting for explicit time dependence, whether energy will be conserved. They know that the "energy" of a classical system is the Hamiltonian `H`, not just `T + V`, and that the two agree for a wide but not universal class of systems. They have watched energy conservation survive numerically on a real trajectory they perturbed.
