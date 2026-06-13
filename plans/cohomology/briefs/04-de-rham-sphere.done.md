# Brief 04 — de Rham: differential forms on $S^2$

**Slug.** `04-de-rham-sphere`
**Target file.** `docs/cohomology/04-de-rham-sphere.html`
**Series.** *Holes Have Names* — [spine](../README.md) · [AGENTS](../AGENTS.md)
**Act.** II — From rings to computation.

## One-line claim

A closed 1-form integrated along a loop gives a number that depends only on the loop's homology class — and that number is exactly the same as the Kronecker pairing the simplicial side computes.

## Motivating frame

Acts I built cohomology combinatorially: dualize chains, take δ, quotient. This essay shows the *same answer* coming out of differential geometry. A 1-form on $S^2$ is a smooth assignment of a covector to each tangent space; it is closed if $d\omega = 0$, exact if $\omega = df$, and de Rham cohomology is the quotient. The de Rham theorem says $H^*_\text{dR}(S^2) \cong H^*(S^2; \mathbb{R})$. We do not prove it; we *witness* it: the reader integrates closed forms along loops on the sphere and finds the answer is always zero (because $H^1(S^2) = 0$, and an exact form has zero integral on every loop). Then we swap to the annulus, where $H^1 = \mathbb{Z}$, and the integral suddenly counts winding.

The historical anchor is short: Cartan's exterior calculus, de Rham's 1931 thesis. The point of the essay is the identity $d \circ d = 0$ on the form side equals $\delta \circ \delta = 0$ on the cochain side, dualized.

## Mathematical content

- **The exterior derivative.** $d: \Omega^k \to \Omega^{k+1}$ on smooth manifolds; for a 0-form (function) $f$, $df$ is its differential; for a 1-form $\omega = P\,dx + Q\,dy$, $d\omega = (\partial_x Q - \partial_y P)\,dx \wedge dy$.
- **$d^2 = 0$.** Computed by hand on a 0-form: $d(df) = d(\partial_x f\,dx + \partial_y f\,dy) = 0$.
- **Closed and exact.** $\omega$ closed: $d\omega = 0$. $\omega$ exact: $\omega = df$. Every exact form is closed. The converse is the cohomology question.
- **De Rham cohomology.** $H^k_\text{dR}(M) = \ker d_k / \mathrm{im}\,d_{k-1}$, a real vector space.
- **The pairing.** A closed $k$-form pairs with a $k$-cycle by integration:
  $$\langle \omega, c \rangle = \int_c \omega.$$
  This is well-defined on $H^k_\text{dR} \otimes H_k$ (Stokes). Same shape as the Kronecker pairing on the simplicial side.
- **De Rham theorem.** $H^k_\text{dR}(M) \cong H^k(M; \mathbb{R})$, naturally with respect to the pairing. *Stated, not proved.*
- **The specific computations.**
  - On $S^2$: $H^0 = \mathbb{R}$ (constants), $H^1 = 0$ (every closed 1-form is exact: integrating around any loop yields zero), $H^2 = \mathbb{R}$ (the area form is closed, not exact).
  - On the annulus: $H^0 = \mathbb{R}$, $H^1 = \mathbb{R}$ (the form $d\theta = (x\,dy - y\,dx)/(x^2+y^2)$ is closed but not globally defined — its integral around the central loop is $2\pi$).

## Interactive figure

**Two linked panels.**

- **Left.** The sphere $S^2$ as an icosphere with one or two subdivisions (so the reader sees the mesh, not a smooth render — keeps the visual coherent with the simplicial essays). A 1-form is drawn as a small arrow per oriented edge, or per face center pointing tangent. A preset dropdown: "df for f = z" (exact, gradient of latitude), "df for f = x" (exact, gradient of longitude restricted to the equator), "bump form" (closed but locally supported), "the area form" (a 2-form, displayed as face shading).
- **Right.** A *draggable loop* on the sphere — the reader drags a small polyline through a sequence of mesh vertices. Below the sphere, a live readout of $\int_\gamma \omega$ as a big number. For all closed 1-forms on $S^2$, this number is 0 (up to numerical noise, which the readout shows as a "≈ 0" tag).

A *swap surface* button toggles to the annulus (flat, drawn in the plane). On the annulus, the 1-form preset is "$d\theta$ — closed, not exact." The reader drags a loop. If the loop encircles the central hole, the integral reads $\pm 2\pi$ (rounded); if it doesn't, the integral reads $\approx 0$. The number depends only on which homology class the loop is in. This is the de Rham theorem made tactile.

A third small inset shows $d\omega$ rendered as face shading: positive in `--c-coboundary` red, negative in blue, zero in white. For all preset forms, $d\omega = 0$ everywhere (numerical noise tolerable). When the reader perturbs the form manually (a small "noise" slider that adds a non-closed component), $d\omega$ lights up. The pairing on loops then becomes loop-dependent. Visual: noisy → unreliable; closed → loop-class-only.

**Distinct visual grammar.** Vectors on a triangulated sphere + a draggable loop + a single big integral readout. The dominant visual is the *vector field on a curved surface*; no matrices, no tables, no barcodes.

## Color tokens

| token | role |
|---|---|
| `--c-form` | the 1-form arrows on edges/faces |
| `--c-pair` | the big $\int_\gamma \omega$ readout |
| `--c-H1` | the loop γ |
| `--c-coboundary` | dω face shading where it is non-zero |
| `--c-H2` | the area form on $S^2$ when toggled |

## Lib contract

- `COH.deRham.sphereMesh(2)` returns an icosphere with 2 levels of subdivision.
- `COH.deRham.oneForm(mesh, preset)` for the four named presets.
- `COH.deRham.d(mesh, omega)` for the dω face values.
- `COH.deRham.integrate(mesh, omega, loop)` for the line integral.
- For the annulus mode, the essay uses an inline 2D mesh (not in the lib by default) plus an inline $d\theta$ formula. ~30 lines of code; OK to inline per AGENTS.md.

## Cross-references

- **Explainer 02.** "We took $\partial^T$ to get δ. Here we take $d$ on forms; the duality is the same."
- **Explainer 06 (later).** Foreshadow: "Persistent cohomology gives us a 1-cocycle on a point cloud; the line integral becomes the *angle* coordinate."
- **TDA series.** No direct reference needed; this is the smooth-manifold side.

## Pitfalls

- Do not call de Rham cohomology a "limit" or "smooth version" of singular cohomology. They are isomorphic by a theorem, not by definition. Use careful language.
- The icosphere is a discretization; the figure does *not* claim to compute a true integral, only a Riemann-sum-on-edges approximation. Add a one-line caveat in the figure caption.
- The "noise slider" must clearly correspond to *adding a non-closed component*, not "increasing noise" in a vague sense. Label it $\|\omega - \omega_\text{closed}\|$.
- The area form on $S^2$ is a 2-form, not a 1-form. When toggling to the area-form preset, the visual layer must change (face shading, not edge arrows). Do not confuse the reader.

## Closing — what we take with us

- $d^2 = 0$ is the same identity as $\delta^2 = 0$, just on a different cochain complex.
- A closed 1-form integrates to zero on every loop of $S^2$ because $H^1(S^2) = 0$.
- On the annulus, $d\theta$ is the canonical non-exact closed 1-form; its integral measures winding.
- De Rham and singular are two computations of the same object, and the pairing is the bridge.
- Next: compute cohomology a third way, recursively, by chopping the space into pieces — Mayer–Vietoris.
