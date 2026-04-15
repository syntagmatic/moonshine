# 07 — 7-Dimensional Cross Products

## Pitch
Most people only learn the 3D cross product. This explainer reveals the only other dimension where it works: 7D. We derive it using the imaginary parts of the Octonions. It's a "bonus" for having 8D multiplication.

## Figures
1. **The Cross-Product Map.** 2D vs 3D vs 7D. Highlight that $R^3$ and $R^7$ are the only vector spaces with a bilinear, non-zero cross product.
2. **The 7D Spinner.** A 3D projection of a 7D cross product. Drag two vectors and watch the result obey the Fano Plane. Interactive.
3. **Property Check.** Interactive verification that $x \times y$ is always perpendicular to $x$ and $y$.

## Key formulas / constructions
- Cross product: $x \times y = \text{Im}(xy)$ for imaginary $x, y$ in $O$
- Only possible in $n=3$ (Quaternions) and $n=7$ (Octonions)

## Dependencies
- #04 (Fano Plane)
- Lib: `OCT.oct.mul`
