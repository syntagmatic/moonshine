# Brief 06 — Persistent cohomology and circular coordinates

**Slug.** `06-persistent-cohomology`
**Target file.** `docs/cohomology/06-persistent-cohomology.html`
**Series.** *Holes Have Names* — [spine](../README.md) · [AGENTS](../AGENTS.md)
**Act.** II — From rings to computation.

## One-line claim

A persistent $H^1$ class on a point cloud sampled from a circle hands you the angle coordinate as a literal function from data to $S^1$ — something persistent homology alone cannot do.

## Motivating frame

This essay closes the series. Persistent homology lives in the TDA series; its dual, persistent cohomology, computes *the same barcode* and one additional thing: a representative cocycle for each long bar. When the bar is in $H^1$, that cocycle integrates to a map from the data to $S^1$. The reader has met the algebra in 01–03 and the computation in 04–05; now we apply all of it to a point cloud sampled from an annulus and recover the angle around the central hole as an honest coordinate function — *learned from the data, not assumed*.

The closing meditation: this series began asking what cohomology is *for*. The six handles — Euler-class obstruction, singular ring, cup product, de Rham, Mayer–Vietoris, persistent — are six answers to the same question. Each gives the reader a different grip on the same object.

## Mathematical content

- **Persistent homology, briefly.** Recall from TDA: filter a Rips complex by ε, track when each homology class is born and dies, render as a barcode.
- **Persistent cohomology, dually.** Same filtration; instead of reducing the boundary matrix $\partial$ left-to-right by scale, reduce the coboundary $\delta$ right-to-left. The pivots pair up the same way; the bars are the same. The new thing: each bar comes with a *cocycle representative*, which persistent homology does not produce naturally.
- **Why the dual is computed.** Practical reason: persistent cohomology is faster (a known computational fact). Pedagogical reason: a 1-cocycle representative for a long $H^1$ bar gives you something explicit.
- **From cocycle to circular coordinate.** Given a 1-cocycle $\eta$ on a filtered Rips complex, the algorithm of de Silva, Morozov, Vejdemo-Johansson (2011) lifts $\eta$ to a function $\theta : X \to S^1$ on the underlying point cloud. Sketch:
  - Smooth $\eta$ to an integer-valued cocycle (over $\mathbb{Z}$, with the $\mathbb{Z}/2$ cohomology lifted to a torsion-free representative).
  - Compute the harmonic representative by solving a discrete Laplace problem.
  - Integrate along a spanning tree to assign each vertex an angle.
- **Worked example.** Points sampled from an annulus in the plane with noise. The persistent $H^1$ bar (one long, several short) corresponds to a wrap-around the hole. The circular coordinate recovered from the cocycle is — up to sign and constant — the angle $\arctan(y / x)$.

## Interactive figure

**The dual barcode.** Three panels.

- **Top panel.** A point cloud (default: noisy annulus, ~80 points). A radius slider controls the Rips ε. The growing Rips complex is drawn live (edges, faintly-shaded triangles).
- **Middle panel.** The persistent cohomology *dual barcode*. Bars run from death (left) to birth (right) — visually mirrored from the persistent homology barcode the TDA series shows. Each bar is colored by dimension (`--c-H0` for $H^0$, `--c-H1` for $H^1$). One long $H^1$ bar dominates. Reader hovers a bar; a side annotation shows the cocycle representative as a set of edges in the top panel.
- **Bottom panel.** A *colored point cloud* — the same points from the top panel, now colored by the circular coordinate $\theta$ computed from the selected $H^1$ cocycle. The color wheel is HSL with hue running around the circle. Reader clicks "compute circular coords"; the angles fill in as a sweeping animation.

A "swap data" dropdown: noisy annulus, two linked circles (two $H^1$ bars, each with its own circular coordinate), figure-eight (more subtle — two crossing loops), Klein-bottle slice. A "noise" slider perturbs the points; long bars survive, short bars die.

A reflective sidebar — the closing meditation. A small "shape zoo" with six entries (sphere, torus, $\mathbb{RP}^2$, annulus, figure-eight, wedge $S^1 \vee S^1 \vee S^2$). For each: $H^0$, $H^1$, $H^2$, the cup product ring, the persistent cohomology when sampled. Static; this is the wall of trophies the series ends with.

**Distinct visual grammar.** Time-reversed barcode + circularly-colored point cloud. The reversed bars are the unique visual; the colored points are the punchline.

## Color tokens

| token | role |
|---|---|
| `--c-H0`, `--c-H1`, `--c-H2` | barcode color by dimension |
| `--c-form` | cocycle representative edges in the top panel |
| `--c-pair` | the circular coordinate readout legend |
| `--c-cover` | Rips simplices at higher dimension |

Note: the hue wheel for the circular coordinate is a *resolved* CSS palette (per the d3-css-vars memory) — use HSL evaluated directly, not `var(--*)`.

## Lib contract

- `TDA.points.annulus(80, 0.5, 0.8, 0.05)` and friends for the point cloud.
- `TDA.rips.build`, `TDA.filtration.fromRips` for the filtered complex.
- `COH.persistCoh.compute(filtration)` returns bars with cocycle representatives.
- `COH.persistCoh.circularCoords(points, filtration, rep)` returns per-point angles.

## Cross-references

- **TDA series, explainer 07 (persistent homology and barcodes).** Direct mirror. Open with "This is the same barcode, computed the other direction."
- **Explainer 04 (de Rham).** "On the annulus, $d\theta$ was the canonical closed 1-form. Now we *learn* $\theta$ from a finite sample."
- **Explainer 03 (cup product).** The closing zoo lists the cup product ring for each shape; cross-reference the table.
- **Asterism connections/11 (algebraic topology and TDA).** Note that persistent *cohomology* is a key on-ramp for the proposed `persistron` library; this explainer is the first moonshine essay to develop it.
- **Bauer–Edelsbrunner et al. references** for the cocycle algorithm. Cite, do not derive.

## Pitfalls

- The point cloud must be small enough that the figure stays responsive (≤100 points; the algorithm is O(n³) in the worst case).
- The circular coordinate is well-defined only up to additive constant and orientation. Render it as a hue wheel that wraps, not as a number; the wrap is the point.
- Persistent cohomology over $\mathbb{Z}/2$ is *not enough* for the circular coordinate algorithm — that needs integer lifts. Be honest about this in one line, then move on; the lib handles the lift internally.
- The reversed-direction barcode is the visual signature, but readers familiar with TDA's left-to-right bars may find it confusing. Explicitly label both ends: "death (computed first)" on the left, "birth" on the right.
- Do not overstate: persistent cohomology is *not* always faster than persistent homology (it depends on the data). Cite the cited result; do not generalise.

## Closing — what we take with us

- Persistent cohomology computes the same barcode as persistent homology, dually — but it hands you cocycle representatives for free.
- A persistent $H^1$ cocycle integrates to a circular coordinate $\theta : X \to S^1$ on the data.
- This is what cohomology was *for* all along: to name an obstruction in a way that composes — and sometimes, to hand the name back to you as a coordinate.
- The six handles of this series — Euler obstruction, singular ring, cup product, de Rham, Mayer–Vietoris, persistent — are six faces of one object.
- Beyond: characteristic classes (Stiefel–Whitney, Chern), spectral sequences ([mathematical-diagrams/18](../../mathematical-diagrams/18-spectral-sequence-charts.html)), sheaf cohomology proper (the [microlocal-sheaf idea](../../../../asterism/ideas.md#17-microlocal-sheaf)). The series ends; the algebra keeps going.
