# 09 — Phase Rotation and Electric Charge

## Pitch

Up to now every symmetry has been geometric — something you can see on the page. With this explainer the series crosses into *internal* symmetries, transformations that don't move the particle but change something "inside" it. The simplest is phase rotation: multiply a complex-valued wave function `ψ` by a global phase `e^{iα}`, and the Schrödinger Lagrangian is unchanged. Run Noether's machine on this symmetry and out drops a conserved current whose density is `|ψ|²` and whose integral is electric charge. This is the prototype of every gauge theory.

## Figures

1. **Phase as rotation in ℂ.** A one-dimensional complex field `ψ(x)` plotted with color for phase and height for amplitude. Rotate globally by `α`; color shifts uniformly; amplitude is unchanged. SVG.
2. **Complex Schrödinger Lagrangian.** The full `L = (iℏ/2)(ψ* ψdot − ψdot* ψ) − (ℏ²/2m) |∇ψ|² − V(x) |ψ|²`. Hover each term to see that the global phase `ψ ↦ e^{iα} ψ` cancels everywhere. A flip toggle shows the transformed `L` term by term. SVG.
3. **The conserved current.** Noether's infinitesimal symmetry `δψ = iα ψ` gives probability density `ρ = |ψ|²` and current `j = (ℏ / 2mi)(ψ* ∇ψ − (∇ψ*) ψ)` (up to an overall constant that sets the physical charge unit). The local conservation law `∂_t ρ + ∇ · j = 0` is displayed with a live probability-flow animation for a moving Gaussian wave packet. SVG + canvas.
4. **Global vs. local phase.** A slider toggles from global (same phase everywhere) to local (phase varies with position). The global case leaves `L` invariant; the local case introduces an extra `∂_μ α(x)` term that does not cancel — unless we add a gauge field `A_μ` that transforms to absorb it. "Electromagnetism appears to fix the local symmetry." SVG.
5. **From charge to the Standard Model.** A single-panel summary: U(1) → electric charge (QED), SU(2) → weak isospin, SU(3) → color. Every unbroken continuous symmetry of the Standard Model Lagrangian gives a conserved charge of matter. Static.

## Key formulas / constructions

- Schrödinger Lagrangian: `L = (iℏ/2)(ψ* ψdot − ψdot* ψ) − (ℏ²/2m) |∇ψ|² − V(x) |ψ|²`.
- Global U(1) symmetry: `ψ ↦ e^{iα} ψ`, `α ∈ ℝ` constant.
- Infinitesimal: `δψ = iα ψ`, `δψ* = −iα ψ*`.
- Noether density and current: `ρ = |ψ|²`, `j = (ℏ / 2mi)(ψ* ∇ψ − (∇ψ*) ψ)`.
- Local conservation: `∂_t ρ + ∇ · j = 0`, which is the probability (or charge) continuity equation.
- Local symmetry requires gauge field: `A_μ ↦ A_μ + ∂_μ α / q`, giving QED after minimal coupling `∂_μ ψ → (∂_μ − iq A_μ / ℏ) ψ`.

## Dependencies

- #05 (Noether's first theorem).
- #06–#07 (pattern of symmetry → current).
- Lib: `NOETHER.fields.schrodinger`, `NOETHER.noether.currentField(L, deltaField)`.

## Reader takeaway

The reader understands that symmetries don't have to be geometric, that phase rotation of a quantum field is a real symmetry, and that its Noether current is electric (or probability) charge. They have seen the global-to-local distinction introduced — setting up the next explainer's treatment of Noether's second theorem — and understand why physicists reach for gauge theory every time they want a new conserved charge.
