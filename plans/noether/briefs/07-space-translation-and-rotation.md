# 07 — Space Translation and Rotation

## Pitch

Two more symmetries, two more conservation laws. A Lagrangian that doesn't care about *where* in space you put the system has translational momentum conserved; one that doesn't care about *orientation* has angular momentum conserved. This explainer is the workout phase of Noether's first theorem: the reader runs the machine on spatial translation and rotation, watches linear momentum and angular momentum fall out, and sees each law break the moment the symmetry breaks.

## Figures

1. **Two bodies in free space.** Two masses interacting through a distance-only potential `V(|q₁ − q₂|)`. Shift the whole system by a uniform vector `c`; `V` is unchanged; the Lagrangian is translation-invariant. The conserved current `Q = p₁ + p₂` — total momentum — is displayed tracking the center of mass through the animation. Interactive drag of initial positions. SVG.
2. **Break the translation symmetry.** Add an external gravitational term `−m g · q`. `L` is no longer translation-invariant vertically but is still invariant horizontally. A live plot shows `p_x` staying flat while `p_y` drifts. SVG.
3. **Rotation and angular momentum.** A single particle in a central potential `V(|q|)`. Rotate the plane; `L` is unchanged. Derive the conserved quantity `L_z = m (x qdot_y − y qdot_x)`. Show an orbit and the angular momentum holding steady as the orbit sweeps out area at a constant rate (Kepler's second law, foreshadowing #08). SVG.
4. **Break the rotation symmetry.** Swap the central potential for a quadrupole `V(q) = q_x² − q_y²` (no continuous SO(2); only a finite order-4 symmetry group containing the 180° rotation and the two coordinate-axis reflections). The orbit now has an angular momentum that oscillates. Conservation breaks because the symmetry broke. SVG.
5. **The three classical triples.** A static card tabulating the three famous Noether pairs: time → energy, space → momentum, rotation → angular momentum, with Lagrangians and symmetry generators side by side. Static.

## Key formulas / constructions

- Translation: `q ↦ q + ε c`. Generator `X = c`. Conserved current `Q = c · p`. If `L` is invariant under *all* `c`, the full vector `p = ∂L/∂qdot` is conserved.
- Rotation around `z`: `q ↦ R_z(ε) q`, with `R_z(ε) = I + ε J_z + O(ε²)`, `J_z = [[0, −1, 0], [1, 0, 0], [0, 0, 0]]`. Generator `X = J_z q`. Conserved current `L_z = (J_z q) · p = x p_y − y p_x`.
- Angular momentum vector: `L = q × p = m (q × qdot)`.
- For a central potential `V(|q|)`: `dL/dt = q × F = q × (−V'(|q|) q̂) = 0`.
- Quadrupole `V = q_x² − q_y²`: invariant under a finite order-4 group (180° rotation + two axis reflections), not under SO(2). No continuous rotation symmetry means no conserved angular momentum.

## Dependencies

- #05 (Noether's first theorem).
- #06 (time translation pattern, for reuse).
- Lib: `NOETHER.symmetry.translation(c)`, `NOETHER.symmetry.rotation(axis)`, `NOETHER.systems.twoBody`, `NOETHER.systems.centralForce`, `NOETHER.noether.current`.

## Reader takeaway

The reader can go from a Lagrangian to its translations and rotations and read off momentum and angular momentum as conserved currents directly. They have watched a symmetry break in real time (the quadrupole potential) and seen angular momentum stop being conserved. They hold the three classical conservation laws in hand — the scaffolding for the next explainer's surprise.
