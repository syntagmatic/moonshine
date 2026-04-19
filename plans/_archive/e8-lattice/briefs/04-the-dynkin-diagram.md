# 04 — The Dynkin Diagram

## Pitch

The 240 roots compress down to 8 *simple roots* — a basis in which every root is an integer linear combination — and the 8 simple roots compress further to a diagram: 8 nodes, 7 edges, one branch point. That diagram is the entire root system in compressed form, and every structural fact we will prove in Act II is already latent in those eight nodes. The explainer shows how to read a root's "spectrum" (its coefficients in the simple-root basis), how to identify subsystems by deleting nodes, and why the branch point is the thing that makes E8 *the last one in the ADE climb*.

## Figures

1. **The E8 Dynkin diagram.** 8 nodes labeled α₁ through α₈ in Bourbaki order, 7 edges, with the branch node visually marked. SVG.
2. **Simple roots, in coordinates.** Explicit table of the 8 Bourbaki-ordered simple roots as 8D vectors, with their inner products displayed as an 8×8 Cartan matrix below. SVG.
3. **Every root as a combination.** Click any of the 240 roots (shown in a scrollable grid); the explainer shows its 8-coefficient expansion against the simple roots as a colored bar chart. All coefficients are integers of the same sign. SVG + interactive.
4. **Root height histogram.** Compute the height (sum of simple-root coefficients) for every positive root; bar chart from 1 to 29. Highlight the highest root at height 29. SVG.
5. **Subsystem preview.** Click a node in the Dynkin diagram to "delete" it; the remaining sub-diagram is highlighted and labeled (E7, E6, D7, A7, ...). Acts as a teaser for explainer #07. SVG + interactive.
6. **ADE climb.** Static figure showing the ADE series (A_n, D_n, E₆, E₇, E₈) as a family of diagrams, making visible that E8 is the largest member. SVG.

## Key formulas / constructions

- Simple roots α₁, …, α₈ in Bourbaki ordering (coordinates in standard 8D form).
- Cartan matrix Cᵢⱼ = 2⟨αᵢ, αⱼ⟩ / ⟨αⱼ, αⱼ⟩. For E8, Cᵢᵢ = 2 and Cᵢⱼ ∈ {0, −1} off-diagonal, with the pattern determined by the Dynkin diagram.
- Every root α = Σ cᵢ αᵢ with cᵢ ∈ ℤ, all the same sign (positive or negative root).
- Highest root: cᵢ = (2, 3, 4, 6, 5, 4, 3, 2) in Bourbaki labeling (height = 29).

## Dependencies

- #03 (the 240 roots, coordinate form, inner product).
- Lib: `E8.simpleRoots`, `E8.cartanMatrix`, `E8.rootAsSimpleCoefficients(r)`, `E8.dynkin.adjacency`, `E8.dynkin.nodeLabels`.

## Reader takeaway

The reader can read the Dynkin diagram — pointing to any node and saying what it represents. They know that every root decomposes into 8 integer coefficients against a chosen basis, and that the Dynkin diagram records the angles between those basis vectors. They have a preview of how deleting a node peels off a subsystem, which becomes the spine of #07. They understand that E8 is "the last ADE" in a precise sense — the largest indecomposable diagram in that family.
