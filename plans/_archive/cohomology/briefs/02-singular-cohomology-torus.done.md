# Brief 02 — Singular cohomology on a triangulated torus

**Slug.** `02-singular-cohomology-torus`
**Target file.** `docs/cohomology/02-singular-cohomology-torus.html`
**Series.** *Holes Have Names* — [spine](../README.md) · [AGENTS](../AGENTS.md)
**Act.** I — From holes to rings.

## One-line claim

To compute $H^*(X; \mathbb{Z}/2)$, take the boundary matrix you already built for homology, transpose it, and run the same Gaussian elimination.

## Motivating frame

Explainer 01 motivated cohomology as the right quotient. This one computes it. The reader walks through assembling $\delta_0$ and $\delta_1$ for a triangulated torus, reduces them, reads off $H^0 = H^2 = \mathbb{Z}/2$ and $H^1 = (\mathbb{Z}/2)^2$, and inspects the two generators of $H^1$ explicitly as cocycles on edges. A dropdown swaps to the sphere ($H^1 = 0$, the picture goes flat) and to $\mathbb{RP}^2$ ($H^1 = \mathbb{Z}/2$, one of the two torus loops survives). The historical anchor — Poincaré built homology, dualization came later — is one sentence. The point of the essay is that *the matrix transpose is the whole construction*.

## Mathematical content

- The torus $T^2$ admits a minimal triangulation with 7 vertices, 21 edges, 14 triangles (Möbius–Kantor). Euler characteristic: $7 - 21 + 14 = 0$. ✓
- Singular cohomology over $\mathbb{Z}/2$ on a finite simplicial complex coincides with simplicial cohomology (Eilenberg–Steenrod, but cited not proved).
- $\delta_k : C^k \to C^{k+1}$ has matrix equal to the transpose of $\partial_{k+1} : C_{k+1} \to C_k$.
- $H^0(T^2; \mathbb{Z}/2) = \mathbb{Z}/2$ (one connected component → constants).
- $H^1(T^2; \mathbb{Z}/2) = (\mathbb{Z}/2)^2$ (two independent 1-cocycles dual to the two generators of $H_1$).
- $H^2(T^2; \mathbb{Z}/2) = \mathbb{Z}/2$ (fundamental class; over $\mathbb{Z}/2$ everything is orientable).
- Comparison: $H^*(S^2) = (\mathbb{Z}/2, 0, \mathbb{Z}/2)$; $H^*(\mathbb{RP}^2; \mathbb{Z}/2) = (\mathbb{Z}/2, \mathbb{Z}/2, \mathbb{Z}/2)$.

## Interactive figure

**The cohomology computer.** Two stacked panels.

- **Top panel.** The triangulated surface (default: torus, drawn either as a flat rectangle with identifications labeled, or as a 3D embedding that the reader can rotate; pick one and stick with it — the flat fundamental domain is more honest about the triangulation). Each edge and triangle is labeled with a small number; cocycle status is shown by edge color. Two slots in the top-right corner show the **current cocycle basis** for $H^1$ — two generators, each rendered as a colored sub-graph of edges in the triangulation. On the torus these are the meridian and longitude class representatives.
- **Bottom panel.** A *boundary matrix grid* showing $\partial_2$ (rows = edges, cols = triangles). The reader clicks a "transpose" button: the grid pivots 90° to become $\delta_1$ (rows = triangles, cols = edges). Then a "reduce" button steps through Gaussian elimination, one column op at a time, highlighting pivot and target columns. When reduction completes, the nullspace basis is read off and rendered on the top panel as the two $H^1$ generators.

A dropdown swaps the surface: torus / $S^2$ / $\mathbb{RP}^2$ / Klein bottle. For each, the same pipeline runs; reader watches the basis shrink or grow.

Below the two panels, a small "Betti number summary" table:

| | $H^0$ | $H^1$ | $H^2$ |
|---|---|---|---|
| $T^2$ | 1 | 2 | 1 |
| $S^2$ | 1 | 0 | 1 |
| $\mathbb{RP}^2$ | 1 | 1 | 1 |
| Klein | 1 | 2 | 1 |

Live-updates as the dropdown changes.

**Distinct visual grammar.** A surface + a *matrix grid* + a *reduction step button*. The matrix is the load-bearing visual; this is the only essay where the matrix grid is on screen for the whole time.

## Color tokens

| token | role |
|---|---|
| `--c-H0` | $H^0$ basis (constants, single component) |
| `--c-H1` | $H^1$ basis cocycles (edges) |
| `--c-H2` | $H^2$ basis (a single triangle representative) |
| `--c-coboundary` | pivot rows during reduction |
| `--c-cocycle` | nullspace columns (cocycles) |

## Lib contract

- `COH.tri.torus7()`, `COH.tri.s2()`, `COH.tri.rp2()`, `COH.tri.klein()` for the four canonical triangulations.
- `COH.coboundary.matrix(complex, k)` for the δ matrix.
- `COH.cohomology.compute(complex, k)` for the betti number and basis (the reduction algorithm is exposed; the figure animates a step-by-step version inline since the lib returns only the final answer).
- The step-by-step reduction animation must be implemented inline in the essay (the lib does not expose intermediate state). Roughly 40 lines of code; OK.

## Cross-references

- **Explainer 01.** "We motivated the quotient; now we compute it."
- **TDA explainer 03.** Already has the boundary matrix grid for $\partial$; this essay's grid is its transpose. Mirror the visual style so the reader recognizes the pair.
- **Explainer 03 (next).** "We have $H^1(T^2; \mathbb{Z}/2) = (\mathbb{Z}/2)^2$. What is the *product* of those two generators?"

## Pitfalls

- The minimal 7-vertex torus triangulation is famous but visually busy on a small canvas. Consider drawing it on a $7 \times 7$ fundamental domain grid (with identifications drawn as arrows) rather than as a 3D embedding.
- $\mathbb{RP}^2$ requires the antipodal identification to be visible; mark identified vertices with matching tick marks.
- The transpose-then-reduce sequence is the conceptual high point of the essay. Linger on it. The reader has seen ∂ being reduced in TDA; this essay's punchline is that *nothing else changes*.

## Closing — what we take with us

- The matrix transpose *is* the construction of cohomology from homology.
- $H^1(T^2; \mathbb{Z}/2) = (\mathbb{Z}/2)^2$ with two explicit cocycle generators along meridian and longitude.
- Different closed surfaces have different Betti numbers, but Betti numbers alone do not distinguish $T^2$ from $S^1 \vee S^1 \vee S^2$ — that needs the cup product, the next essay.
