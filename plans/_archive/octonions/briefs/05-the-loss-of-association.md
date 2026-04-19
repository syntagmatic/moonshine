# 05 — The Loss of Association

## Pitch
This is the "cliff" mentioned in Part 3. In the Octonions, $(ab)c$ is generally not equal to $a(bc)$. This explainer shows why this "associative bottleneck" makes the Octonions so much harder to work with than Quaternions, but also how it creates a richer internal structure.

## Figures
1. **The Associative Tree.** A branching diagram showing two ways to group a product of three octonions: $((x y) z)$ vs $(x (y z))$. Interactive: drag the input octonions and watch the two resulting points in 8D diverge.
2. **The Associator Explorer.** Visualizing the "Associator" $[x, y, z] = (xy)z - x(yz)$. A 3D projection of this 8D vector. Notice how it is zero for Reals, Complex, and Quaternions, but "wakes up" for Octonions.
3. **Alternative Algebra Check.** Interactive proof of the "Alternative" property: $(xx)y = x(xy)$. Even though full associativity is gone, Octonions keep this weaker version.

## Key formulas / constructions
- The Associator: $[x, y, z] = (xy)z - x(yz)$
- Alternativity: $[x, x, y] = 0$ and $[y, x, x] = 0$

## Dependencies
- #04 (Fano Plane for multiplication)
- Lib: `OCT.oct.mul`, `OCT.utils.sub`
