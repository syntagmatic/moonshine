# The Visual Language of Algebra

I want ten interactive essays about diagrams that mathematicians compute with. The idea holding them together is that a good diagram is a calculation you can see: read a knot diagram crossing by crossing and you get a polynomial, count paths through a leveled graph and you get dimensions of representations, choose an order to contract a tensor network and you have set the cost of the computation. Each essay takes one kind of diagram, says what it encodes, and gives the reader a figure where they change the picture and watch the computed quantity respond.

The reader is comfortable with linear algebra and has met groups, but may never have used these diagrams. The essays stand alone and can be read in any order. By the end, a reader should be able to pick up any of the ten, say what a picture of that kind claims, and check one of those claims by hand.

## Articles

### 1. Commutative Diagrams: The Language of Category Theory
A commutative diagram asserts that paths agree; the drawing alone never shows it. The reader builds objects and arrows, declares which equalities hold, and the figure works out what those declarations imply, answering "commutes", "does not commute" or "undecided".

### 2. Knot Diagrams
A knot drawing, a braid word and a rational tangle are three notations, and one state sum reads all three. The reader computes a knot's Kauffman bracket state by state, builds a braid and sees its closure identified by the same computation, and builds a rational tangle whose continued fraction names the knot.

### 3. Ternary Diagrams: Three Numbers on a Triangle
Three proportions that sum to one live on a triangle, and each point reads off all three at once. The reader drags a point and switches presets that relabel the corners: soil texture classes, the Hardy-Weinberg curve, entropy on the probability simplex. Cover the closure problem for compositional data and the triangle's history.

### 4. Crystal Graphs: Operators After the Limit
A crystal is a colored graph whose arrows are Kashiwara's raising and lowering operators. The reader steps through the operators on a small crystal, then tensors two crystals and watches the signature rule split the product into components, e.g. B(1)⊗B(1) = B(2)+B(0). Close with the link to tableaux.

### 5. Spectral Sequence Charts
A chart shows where differentials may go, but it does not know which are nonzero; settling that is the mathematics. The reader builds a first-quadrant chart, decrees the differentials page by page, watches what survives, and sees that the survivors leave an extension problem open.

### 6. Tropical Curves: Where Linear Pieces Tie
A tropical curve is where a piecewise-linear maximum is attained twice. The reader adjusts a tropical polynomial's coefficients and watches winning regions, the corner locus and the dual subdivision of the Newton polygon change together. Include amoebas, balancing at vertices, and reading degree and genus off the picture.

### 7. Ribbon Graphs and Fatgraphs
A graph with a cyclic order of edges at each vertex determines a surface. The reader changes the cyclic orders and watches the boundary cycles and the genus update, with a pointer to dessins d'enfants.

### 8. Bratteli Diagrams: Levels, Branching, and Limits
A leveled branching graph turns counting paths into computing dimensions. The reader counts paths through Young's lattice by the branching recurrence and by the hook length formula, and steps through the standard Young tableaux those paths are. Touch on telescoping and AF algebras.

### 9. Associahedra and Exchange Graphs
Triangulations of a polygon joined by diagonal flips form the associahedron, and each flip is a cluster mutation. The reader flips diagonals in a hexagon and follows the node in the exchange graph, while the triangulation's quiver rides along and the figure checks that mutating the old quiver gives the new triangulation's quiver.

### 10. Tensor Network Diagrams: Indices, Contractions, and Cost
The order you contract a tensor network in sets its price. The reader tries contraction orders on a small network with concrete bond dimensions and compares intermediate sizes and total cost, then sees common network families and how bond dimension across a cut bounds what a network can represent.

## What to get right

- Every figure computes the thing the prose talks about: knot identification from an actual state sum, commutation verdicts from rewriting the stated relations, quiver checks from actual mutation. No decorative arcs, label-string comparisons or hand-placed contours.
- Known traps: the braid (σ₁σ₂)³ closes to a three-component link. The zero and infinity tangles are easy to swap and continued fractions easy to nest backwards; a rational tangle's determinant must equal its fraction's numerator. Mono and epi are cancellation properties and differ from injective and surjective (ℤ → ℚ is epi in rings). Ternary entropy contours are plain level sets on the flat triangle.
- Attributions: the ternary phase diagram comes from Gibbs's paper on heterogeneous equilibrium (1876-78), standardised by Roozeboom; the Euclidean geometry of the simplex is due to Pawlowsky-Glahn and Egozcue, and independently Billheimer, Guttorp and Fagan (2001). Soil texture regions follow the real USDA boundaries.
- Quiver arrows are a basis of Ext¹ between simples. Reorienting a quiver preserves the derived category only for trees.
- One small set of semantic colors runs through the series, keyed to roles (elements, morphisms, generators, duals, actions).
