# 02 — Hamilton’s Bridge: The Quaternions

## Pitch

In 1843, William Rowan Hamilton was walking across Brougham Bridge when the answer hit him: to multiply in 3D, you need 4D. This explainer introduces the Quaternions ($H$), the first "multi-dimensional" numbers, and the first sacrifice: to gain 4D multiplication, we must lose commutativity ($ab \neq ba$).

## Figures

1. **The Brougham Bridge inscription.** An interactive photo of the bridge where the reader can "carve" $i^2 = j^2 = k^2 = ijk = -1$ into the stone. Interactive.
2. **The 3D Rotation engine.** A 3D object rotating in space using quaternions. Sliders for $q_0, q_i, q_j, q_k$. Interactive.
3. **The Commutativity Duel.** Pick two quaternions $q_1$ and $q_2$. Compute $q_1 q_2$ and $q_2 q_1$ and watch the 3D results differ. Interactive.
4. **The Cayley multiplication table (H).** An 8x8 table of $1, i, j, k, -1, -i, -j, -k$. Hovering highlights the anti-symmetric pairs. SVG.

## Key formulas / constructions

- Fundamental formula: $i^2 = j^2 = k^2 = ijk = -1$
- Anti-commutativity: $ij = k$, but $ji = -k$.
- Quaternion norm: $q \bar{q} = |q|^2$.

## Dependencies

- #01 (complex numbers).
- Lib: `OCT.quat.mul(a, b)`.

## Reader takeaway

To solve the 3D problem, we needed a 4th dimension. In doing so, we lost "swap-ability" ($ab = ba$). The reader now accepts that higher-dimensional numbers have a price.
