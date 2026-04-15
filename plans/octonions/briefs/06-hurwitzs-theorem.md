# 06 — Hurwitz’s Theorem: Why the Line Stops at 8

## Pitch
Why aren't there 16D "Sedenions" that we care about? This explainer tells the story of Adolf Hurwitz and his 1898 proof. It shows that 1, 2, 4, and 8 are the only dimensions where multiplication preserves the norm ($|ab| = |a||b|$). We cross the line and show how 16D multiplication "breaks" the link to geometry.

## Figures
1. **The Norm Property Map.** A chart of dimension vs norm-multiplication. Highlight 1, 2, 4, 8 as the "gold" dimensions. Interactive: explore $|ab|$ vs $|a||b|$ in different dimensions.
2. **The 16D Zero-Divisor Hunter.** A "game" where the reader tries to find two non-zero 16D numbers that multiply to zero. This is the failure that kills the Sedenions. Interactive.
3. **Hurwitz's logic chain.** Step-through derivation of why the Cayley-Dickson recipe fails its next double. SVG.

## Key formulas / constructions
- The Norm Property: $|xy|^2 = |x|^2 |y|^2$
- Hurwitz’s Theorem: Works only for $n = 1, 2, 4, 8$

## Dependencies
- #03 (Cayley-Dickson recipe)
- Lib: `OCT.cd` generalized to higher powers of 2.
