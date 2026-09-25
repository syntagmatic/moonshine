# Brief 03 — The cup product on $\mathbb{RP}^2$ and $T^2$

**Slug.** `03-cup-product-rp2-t2`
**Target file.** `docs/cohomology/03-cup-product-rp2-t2.html`
**Series.** *Holes Have Names* — [spine](../README.md) · [AGENTS](../AGENTS.md)
**Act.** I — From holes to rings.

## One-line claim

The cup product turns $H^*$ from a list of vector spaces into a ring, and the ring detects shape that Betti numbers cannot.

## Motivating frame

This is the essay where cohomology earns its keep. Two surfaces — the torus $T^2$ and the wedge $S^1 \vee S^1 \vee S^2$ — have the same Betti numbers $(1, 2, 1)$. They are not homotopy equivalent, and the cleanest way to see this is the cup product: on $T^2$, the two generators of $H^1$ cup to the generator of $H^2$; on the wedge, they cup to zero. The reader meets the Alexander–Whitney formula as a *combinatorial recipe* on ordered simplices (no derived categories, no signs over $\mathbb{Z}/2$), computes the cup product table for $\mathbb{RP}^2$ by hand-with-help, and ends with the observation that $H^*(\mathbb{RP}^2; \mathbb{Z}/2) = \mathbb{Z}/2[\alpha]/(\alpha^3)$ — a ring whose shape recurs in places far removed from $\mathbb{RP}^2$ (the Cayley plane $\mathrm{OP}^2$, the squishy-thing dossier 36).

## Mathematical content

- **Alexander–Whitney formula.** For a simplicial complex with a chosen total vertex order, and a $(p+q)$-simplex $\sigma = [v_0, v_1, \ldots, v_{p+q}]$ written with $v_0 < v_1 < \ldots < v_{p+q}$,
  $$(\alpha \smile \beta)(\sigma) = \alpha([v_0, v_1, \ldots, v_p]) \cdot \beta([v_p, v_{p+1}, \ldots, v_{p+q}]).$$
  The two sub-simplices share the vertex $v_p$ ("front face" of α, "back face" of β).
- Over $\mathbb{Z}/2$ the cup product is graded-commutative without signs.
- $\smile$ descends to cohomology: $\delta(\alpha \smile \beta) = \delta\alpha \smile \beta + \alpha \smile \delta\beta$.
- **The two computations the essay actually does.**
  - $\mathbb{RP}^2$ minimal triangulation (6 vertices, 15 edges, 10 triangles). Pick the standard generator $\alpha \in H^1(\mathbb{RP}^2; \mathbb{Z}/2)$ as a specific 1-cocycle. Compute $\alpha \smile \alpha$ on each 2-simplex; it is the generator of $H^2$. Conclusion: $H^*(\mathbb{RP}^2; \mathbb{Z}/2) = \mathbb{Z}/2[\alpha]/(\alpha^3)$.
  - $T^2$ minimal triangulation. Two 1-cocycles $\alpha, \beta$ along meridian and longitude. Compute $\alpha \smile \beta$ on each 2-simplex; it is the generator of $H^2$. Compute $\alpha \smile \alpha$ and $\beta \smile \beta$; both are zero in $H^2$ (after subtracting an exact piece). Conclusion: $H^*(T^2; \mathbb{Z}/2) = \mathbb{Z}/2[\alpha, \beta] / (\alpha^2, \beta^2)$, an *exterior algebra*.
- **The contrast.** Swap to the wedge $S^1 \vee S^1 \vee S^2$ triangulated naively. Same Betti numbers as $T^2$. But $\alpha \smile \beta = 0$ for any 1-cocycles, because the supports of the two $H^1$ generators are disjoint and the 2-cells live on the $S^2$ summand.

## Interactive figure

**The cup product table.** A large grid, 3 rows and 3 columns (indexed $0, 1, 2$). Each cell shows $H^p \otimes H^q \to H^{p+q}$ on a chosen basis. Above the grid: the current target surface (dropdown — $\mathbb{RP}^2$ / $T^2$ / $S^1 \vee S^1 \vee S^2$ / $S^2$). Beside the grid: the triangulation, drawn small, with the active cocycles $\alpha, \beta$ highlighted on edges.

- The reader clicks a cell, e.g. $(p, q) = (1, 1)$. The right panel animates: for each 2-simplex $\sigma = [v_0, v_1, v_2]$, the front-face $[v_0, v_1]$ is highlighted in $\alpha$'s color (`--c-H1`), the back-face $[v_1, v_2]$ in $\beta$'s color; if both are 1 on those sub-edges, the 2-simplex turns violet (`--c-cup`) and contributes a 1 to the resulting 2-cochain. The animation runs through all 2-simplices, then displays the resulting cochain, then reduces it modulo coboundaries, then writes the result into the grid cell as a ring element (e.g., $\alpha^2$ for $\mathbb{RP}^2$).
- A "fill table" button does all 9 cells in a sweep.
- When the dropdown changes to the wedge, the cell at $(1,1)$ resolves to zero; the visual cue is that no triangle ever has both front-face and back-face on the same $H^1$ support. Lean into that emptiness.

A small ring-display box below the grid renders the resulting ring presentation as KaTeX. The display updates with the dropdown:

- $\mathbb{RP}^2$: $\mathbb{Z}/2[\alpha]/(\alpha^3)$.
- $T^2$: $\mathbb{Z}/2[\alpha, \beta]/(\alpha^2, \beta^2)$.
- wedge $S^1 \vee S^1 \vee S^2$: $\mathbb{Z}/2 \cdot 1 \oplus \mathbb{Z}/2 \cdot \alpha \oplus \mathbb{Z}/2 \cdot \beta \oplus \mathbb{Z}/2 \cdot \gamma$ (truncated algebra, all products of positive-degree elements zero).
- $S^2$: $\mathbb{Z}/2[\gamma]/(\gamma^2)$ with $|\gamma| = 2$.

**Distinct visual grammar.** A 3×3 *cup-product table* with an Alexander–Whitney animation. No surface-as-flat-strip, no matrix grid, no vector field. The table is the unique visual signature of this essay.

## Color tokens

| token | role |
|---|---|
| `--c-H1` | the cocycle α (and its highlighted edges) |
| `--c-H2` | a 2-cocycle, either α∪α or α∪β |
| `--c-cup` | a 2-simplex contributing to the cup product (front-face AND back-face both 1) |
| `--c-cocycle` | static cocycle indicators |
| `--c-coboundary` | exact piece (when reducing the result modulo coboundaries) |

## Lib contract

- `COH.tri.rp2()`, `COH.tri.torus7()`, `COH.tri.wedgeS1S1S2()`, `COH.tri.s2()`.
- `COH.cohomology.compute(complex, k)` returns the basis cocycles used as $\alpha, \beta$.
- `COH.cup.product(complex, alpha, beta, p, q)` returns the resulting cochain. The Alexander–Whitney animation in the figure mirrors the lib's algorithm step-by-step.
- `COH.cup.table(complex, 2)` populates the grid in one call.
- `COH.fmt.ringElement(coeffs, ['α', 'β', 'γ'])` for the ring-display box.

## Cross-references

- **Explainer 02.** "We computed $H^1(T^2) = (\mathbb{Z}/2)^2$. Now multiply the two generators."
- **squishy-thing/research/36-octonionic-projective-plane/synthesis.md.** The $\mathrm{OP}^2$ cohomology ring is $\mathbb{Z}[\alpha]/(\alpha^3)$ with $|\alpha| = 8$ — the *same algebra* as $\mathbb{RP}^2$ over $\mathbb{Z}/2$, only the degree shifts. Cite this as a one-paragraph aside in the closing.
- **Atlas of atlases / exceptional-atlas.** Cross-link to the relevant essay if/when it exists.
- **Explainer 04 (next).** "We just computed a ring with combinatorics. Now we compute it again with calculus."

## Pitfalls

- The Alexander–Whitney formula requires a *total vertex order*. State it once and stop apologizing.
- Over $\mathbb{Z}$, $\alpha \smile \beta = (-1)^{pq} \beta \smile \alpha$. Over $\mathbb{Z}/2$ there are no signs. Mention this in one line; do not dwell.
- For the wedge, *triangulate it deliberately* so that the two $H^1$ supports are visibly disjoint. A naive triangulation might accidentally have them share an edge.
- The animation "front-face highlight, back-face highlight" is the conceptual hinge of the essay. It should run slowly enough to see (≥ 300ms per 2-simplex), with a "speed up" button for impatient readers.

## Closing — what we take with us

- The cup product is computed by Alexander–Whitney: split a $(p+q)$-simplex at vertex $v_p$, evaluate $\alpha$ on the front, $\beta$ on the back, multiply.
- $H^*(\mathbb{RP}^2; \mathbb{Z}/2) = \mathbb{Z}/2[\alpha]/(\alpha^3)$ is the simplest non-trivial cohomology ring; the same ring shape appears on the Cayley plane in degree 8.
- $H^*(T^2; \mathbb{Z}/2)$ is the exterior algebra on two generators in degree 1.
- Betti numbers are not a complete invariant; the cup product is the next level of resolution.
- Next: compute $H^1(S^2) = 0$ a third way — by integrating a closed differential form along a loop and getting zero.
