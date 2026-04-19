# 01 — Numbers with Direction

## Pitch

The journey starts on familiar ground. Multiplication in the Real and Complex numbers isn't just scaling; it's a geometric rotation. By the end of this explainer, the reader will be able to visualize multiplication as a "rotate-and-scale" operation in 2D and see why the search for a 3D equivalent was the central mystery of 19th-century algebra.

## Figures

1. **The 1D slider (R).** A simple number line. Multiplying by -1 as a 180° flip. Static/interactive.
2. **The 2D rotate-and-scale (C).** Drag a dot in the complex plane to multiply it by another point. Watch the angles add and the magnitudes multiply. Interactive.
3. **The search for 3D.** A 3D Cartesian space where the reader tries to "multiply" two vectors using a broken, non-working rule. Illustrates why 3D doesn't "work" for multiplication. Interactive.
4. **Historical Vignette: Hamilton’s letter.** Scanned fragment with a KaTeX overlay of the problem he was trying to solve. Static.

## Key formulas / constructions

- Complex multiplication: $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$
- Magnitudes: $|z_1 z_2| = |z_1| |z_2|$
- Angles: $\arg(z_1 z_2) = \arg(z_1) + \arg(z_2)$

## Dependencies

- None (this is the starting point).
- Lib: `OCT.complex.mul(a, b)`.

## Reader takeaway

Multiplication is geometry. In 1D and 2D, we have a "normed division algebra" (we can multiply and divide while preserving length). The stage is set for the "crash" into 3D and the leap to 4D.
