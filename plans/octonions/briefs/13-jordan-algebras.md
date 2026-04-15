# 13 — Jordan Algebras: The Albert Algebra

## Pitch
Matrix multiplication is the workhorse of physics, but it's usually associative. Pascual Jordan discovered a way to make non-associativity work for quantum mechanics. This explainer introduces the Jordan Product and the "Albert Algebra"—the unique 27-dimensional algebra of 3x3 Octonionic matrices.

## Figures
1. **The Jordan Product Workbench.** Input $A$ and $B$, compute $A \circ B = \frac{1}{2}(AB + BA)$. See how this product restores commutativity even if the base elements don't. Interactive.
2. **The 3x3 Grid.** Visualizing the 27 real degrees of freedom in an Hermitian $3 \times 3$ Octonionic matrix. Hover to see the real and octonionic parts. SVG.
3. **The F4 Link.** How the symmetries of the Albert Algebra create the 52-dimensional group $F_4$.

## Key formulas / constructions
- Jordan Product: $x \circ y = \frac{1}{2}(xy + yx)$
- Albert Algebra: $H_3(O)$

## Dependencies
- #05 (Non-associativity)
- Lib: `OCT.oct.mul`
