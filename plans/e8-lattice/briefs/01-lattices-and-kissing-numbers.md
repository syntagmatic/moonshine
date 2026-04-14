# 01 — Lattices and Kissing Numbers

## Pitch

A lattice is a discrete, periodic set of points in space; a kissing configuration is the set of points at minimum distance from a fixed center. Starting in 2D with the square and hexagonal lattices, then climbing to the face-centered cubic in 3D, we build the two questions that will drive the whole series — *how many spheres can touch a central one?* and *how tightly can equal spheres be packed?* — on ground where the reader can see, count, and verify every answer themselves. By the end of the explainer, the reader has the vocabulary (lattice, minimal vector, kissing number, packing density) to recognize why 8 dimensions will turn out to be special.

## Figures

1. **Interactive 2D lattice toggle.** Switch between the square lattice (ℤ²) and the hexagonal lattice. Click any point to highlight its nearest neighbors. SVG.
2. **Kissing in 2D, hands-on.** Six disks tangent to a central disk in the hexagonal configuration. The reader drags a seventh disk and sees that it cannot be added without overlap. SVG.
3. **FCC kissing in 3D.** 12 spheres around 1, face-centered cubic. Rotatable via drag. Canvas + manual 3D projection (first use of the project3D helper pattern that #6 and #9 will extend).
4. **Density vs kissing bar chart.** Shows that density and kissing are different optimization targets: e.g., honeycomb has kissing 3, hexagonal has 6, both with different densities. SVG.
5. **Foreshadowing table.** Dimension n → best known kissing number, with n=8 entry left as `???` to tease E8. Static SVG.

## Key formulas / constructions

- Square lattice density π/4 ≈ 0.7854; hexagonal density π/(2√3) ≈ 0.9069.
- FCC density π/(3√2) ≈ 0.7405.
- 2D optimal kissing = 6 (hexagonal, proven).
- 3D optimal kissing = 12 (FCC, Schütte & van der Waerden 1953).
- Definition: a *lattice* Λ ⊂ ℝⁿ is a discrete subgroup of rank n. A *kissing configuration* is the finite set of minimal vectors of Λ.

## Dependencies

- None (first explainer).
- Lib: none yet — all geometry inline. Introduces the `project3D` helper pattern that later explainers will import from `e8-math.js`.

## Reader takeaway

The reader knows what a lattice is, what a kissing number is, and that packing density and kissing optimality are distinct questions. They have seen that 2D and 3D optimal configurations are not always the same lattice, and they end the explainer curious about what happens when n > 3.
