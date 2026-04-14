# 06 — The Gosset Polytope 4₂₁

## Pitch

The 240 roots of E8 are the vertices of a uniform 8-dimensional polytope called 4₂₁, discovered by Thorold Gosset in 1900 and later rediscovered by Coxeter. Giving the root system a polytope identity adds structure the vertex set alone doesn't carry: edges, faces, cells, vertex figures — a combinatorial skeleton we can count, browse, and rotate. The explainer introduces the edge rule (two roots are joined by an edge iff their inner product is 1), projects a 3D shadow of 4₂₁ that the reader can rotate, and walks through the face counts at every dimension — the 2160 cells, the 17,280 edges, all of it. The aim: stop thinking of "240 roots" and start thinking of "a single geometric object in 8 dimensions."

## Figures

1. **3D projection of 4₂₁, rotatable.** Canvas + manual 8D→3D→2D projection. The reader drags to orbit. Edges drawn as lines, vertices as points. Depth-fade on the edges gives the solid a visible 3D quality. This is the first genuinely 3D figure in the series.
2. **Edge rule visualized.** Click any vertex; highlight all vertices connected to it by an edge (i.e., roots with inner product 1 relative to the chosen one). Report the neighbor count: 56. SVG overlay on the 3D projection.
3. **Vertex figure.** The 56 neighbors of a chosen vertex themselves form a smaller uniform polytope — the E_7 root polytope 2₃₁. Click a vertex and see its vertex figure extracted and displayed in a side panel as a rotated 3D projection. Canvas.
4. **Face count table.** All face counts for 4₂₁ in every dimension 0 through 7: vertices 240, edges 6720, faces 60480, … up to cells 17,280 and facets 19,440. Static SVG with citation to Coxeter's enumeration.
5. **Gosset's 1900 discovery.** Brief historical figure showing the original enumeration and the list of uniform polytopes in the E_n family (4₂₁, 2₃₁, 1₂₂). Static.

## Key formulas / constructions

- Edge rule: α and β are connected iff `⟨α, β⟩ = 1`, equivalently the angle between them is 60°.
- Vertex degree = 56 (each root has 56 neighbors at angle 60°; another 126 at angle 90°, 56 at angle 120°, one at 180°).
- 4₂₁ has 240 vertices, 6720 edges, 60,480 triangular faces, 241,920 tetrahedral cells, 483,840 4-simplex cells, 483,840 4-orthoplex cells, 207,360 4-simplex cells, 17,280 7-simplex facets, 2,160 7-orthoplex facets.
- Face counts derived from Weyl group orbit structure, not enumerated by hand.

## Dependencies

- #03 (240 roots, inner products).
- #05 (Weyl reflections — used to argue that the polytope is Weyl-invariant and that face counts are orbit sizes divided by stabilizers).
- Lib: `E8.roots.all()`, `E8.neighbors(r, innerProduct=1)`, `E8.project.to3D(roots, plane)`.

## Reader takeaway

The reader can name 4₂₁ and explain what its vertices are. They have browsed the face structure and know that the 240 number is just the vertex count of a far richer combinatorial object. They have rotated a real 3D shadow of an 8D polytope and seen that its visual complexity is compatible with rigorous face-counting arithmetic. They are primed for the next explainer, which asks *what happens if we tear subsystems out of this polytope*.
