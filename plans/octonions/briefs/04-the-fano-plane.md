# 04 — The Fano Plane: Multiplication in 8D

## Pitch

The Fano Plane is the "multiplication table" of the Octonions compressed into a single, elegant diagram. This explainer shows how to read the diagram (7 points, 7 lines, directional arrows) to compute any product of the imaginary units $e_1$ through $e_7$. It serves as the primary tool the reader will use to navigate the 8D algebra.

## Figures

1. **The Fano Plane Navigator.** The centerpiece. A 7-point diagram with arrows on the lines. Clicking two points (e.g., $e_1$ and $e_2$) highlights the line connecting them and shows the result ($e_3$). Clicking against the arrow gives $-e_3$. Interactive.
2. **The Multiplication Duel.** A game-like interactive where the reader is given pairs of imaginary units and must use the Fano Plane to find their product. Builds fluency. Interactive.
3. **The Full 8x8 Table.** A grid showing all 64 products of the basis elements, with anti-symmetric pairs highlighted on hover. SVG.

## Key formulas / constructions

- The cycle rule: $e_i e_j = e_k$ if $(i,j,k)$ is a directed line in the Fano Plane.
- Anti-commutativity: $e_j e_i = -e_k$.
- The 7 lines (cycles): (1,2,3), (1,4,5), (1,7,6), (2,4,6), (2,5,7), (3,4,7), (3,6,5).

## Dependencies

- #03 (Cayley-Dickson doubling, losing associativity).
- Lib: `OCT.oct.mul(a, b)` and the Fano Plane rendering in `oct-viz.js`.

## Reader takeaway

The reader can multiply octonion basis units visually using the Fano Plane. They have a concrete mental map of the 7 imaginary directions and how they interact, preparing them for the geometric applications in Act II.
