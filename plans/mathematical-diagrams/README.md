# The Visual Language of Algebra

"Every good mathematical notation is also a diagram." Seven interactive explainers on the diagrams mathematicians actually think with: Hasse diagrams, Young tableaux, Cayley graphs, commutative diagrams, braid diagrams, knot diagrams, and string diagrams. Each explainer lets you build and manipulate the diagram by hand, revealing what the spatial layout encodes.

## Locked plan

**Spine.** Mathematical diagrams are not illustrations of algebra; they *are* algebra, rendered in a visual language where position, connection, and crossing carry meaning. This series takes seven diagram types, explains what each one encodes, and makes each one interactive. The reader does not watch a diagram — they build one, rearrange it, and discover the structure it reveals.

**Reader endpoint.** After this series, a reader should be able to draw and read all seven diagram types, understand what algebraic structure each one encodes, know which domains each one appears in, and recognise when two diagrams are "the same" despite looking different (the invariance question that makes each diagram type interesting).

**Identity.** Slug `mathematical-diagrams`, title *The Visual Language of Algebra*, tagline *"Every good mathematical notation is also a diagram."* Visual register: clean node-and-edge layouts, drag-to-build interactions, smooth reflow animations. 740px article width, same font stack as the rest of the ecosystem. No single dominant colour — each diagram type gets its own small palette.

**Shape.** Seven explainers, no act structure. Each is self-contained: a reader can enter at any explainer. Light cross-references between them (e.g. the face lattice in Hasse diagrams connects to the simplicial complexes in TDA; the Cayley graph connects to the Lie algebras series; braids connect to knots). No prerequisite beyond comfort with sets and functions.

**Per-explainer shape.** 400–700 lines. Each explainer follows the series template: a motivating example, the formal definition, at least one substantial interactive figure (build-it-yourself, not just view), an insight box per major idea, cross-domain examples showing where the diagram appears, and a "what the diagram sees" closing list. Figures favour SVG with drag, click-to-add, and animated reflow.

**Rendering stack.** D3 v7 + SVG + KaTeX, same as everything else. No build step. A shared `lib/diagram-math.js` for layout algorithms (Sugiyama for DAGs, force layout for graphs, crossing minimisation for braids). Point clouds and group tables generated procedurally.

## Semantic colour vocabulary

Colours are keyed to recurring mathematical types, not per-diagram ad hoc names.

```css
:root {
  /* Primary objects — the mathematical "nouns" */
  --c-element: #2563eb;          /* blue — nodes, cells, vertices, dots, tensors */
  --c-morphism: #475569;         /* slate — edges, arrows, strands, wires, chords */

  /* Generators — multiple distinguished elements */
  --c-gen-1: #2563eb;            /* blue — first generator / strand */
  --c-gen-2: #dc2626;            /* red — second generator / strand */
  --c-gen-3: #059669;            /* green — third generator / strand */

  /* Duality — complementary pairs (over/under, black/white, upper/lower) */
  --c-dual-a: #1e293b;           /* dark — over-strand, black vertex, upper index */
  --c-dual-b: #94a3b8;           /* light — under-strand, white vertex, lower index */

  /* Group action / selection */
  --c-action: #f59e0b;           /* amber — selected, walk trail, mutation flash, path highlight */

  /* Algebraic structure — invariants verified, structure confirmed */
  --c-structure: #0f766e;        /* teal — lattice ✓, commutativity ✓, invariant, insight boxes */
  --c-structure-light: #ccfbf1;  /* teal bg — insight box background */

  /* Exceptional — rare, distinguished, or anomalous */
  --c-exceptional: #9333ea;      /* purple — E₆/E₇/E₈, highest weight, obstruction */
  --c-exceptional-light: #f3e8ff;/* purple bg */
}
```

## Phase state

- [x] **Phase 0** — write this spine
- [x] **Phase 1** — build `lib/diagram-math.js` + explainers 01–04
- [x] **Phase 2** — explainers 05–07
- [x] **Phase 2.5** — explainers 08–12 (Dynkin, quivers, dessins, weights, chords)
- [x] **Phase 2.7** — explainers 13–14 (tangles, Penrose notation)
- [ ] **Phase 3** — audit pass, cross-series links, SPH standard sweep

## Explainer list

Seven explainers. Each entry includes the mathematical content, the key objects, and the intended interactive.

### 01. Hasse Diagrams: Making Order Visible

A partially ordered set (poset) has elements and a relation ≤ that is reflexive, antisymmetric, and transitive. The Hasse diagram draws elements as nodes and covers (minimal relations) as upward edges, suppressing transitivity. The result is a compact picture of the order structure.

**Mathematical content.** Posets, covers, chains, antichains, lattices, join and meet. The Boolean lattice 2^n (subsets of {1,...,n} ordered by inclusion). The divisibility lattice of an integer. The partition lattice (set partitions ordered by refinement). The face lattice of a polytope (vertices < edges < faces, connecting to TDA explainer 02).

**Interactive.** A Hasse diagram builder. Start with a set of elements; click to add a covering relation; the diagram reflows using Sugiyama layered layout. Preset buttons load: Boolean lattice 2^3, divisors of 30, partition lattice of {1,2,3,4}, face lattice of a cube. Click a node to highlight its up-set (everything above) and down-set (everything below). A "is this a lattice?" checker tests whether every pair has a join and meet.

### 02. Young Diagrams and Tableaux: The Shape of Partitions

A partition of n is a way of writing n as a sum of positive integers in non-increasing order. A Young diagram draws a partition as left-justified rows of boxes. A standard Young tableau fills the boxes with 1,...,n so that entries increase along rows and down columns.

**Mathematical content.** Partitions, conjugate partitions (transpose the diagram), dominance order, the hook-length formula for counting standard tableaux, connection to symmetric group representations (each irrep of S_n corresponds to a partition of n). RSK correspondence (mentioned, not developed).

**Interactive.** A Young diagram editor. Click to add/remove boxes (enforcing the partition constraint: each row ≤ the row above). The conjugate partition mirrors live on the right. A "fill" mode lets you click boxes in order to build a standard Young tableau, with the interactive enforcing the row/column-increasing constraint. The hook-length formula is computed and displayed, with hooks highlighted on hover. Preset buttons load famous partitions: staircase (n, n-1, ..., 1), rectangle, hook shape, self-conjugate.

### 03. Cayley Graphs: Groups as Geometry

A Cayley graph of a group G with generators S draws one node per group element and one coloured directed edge per generator: from g to gs. The graph encodes the entire multiplication table and makes group structure visible as geometry: cosets are clusters, normal subgroups are quotient patterns, the centre is the set of nodes where all coloured paths commute.

**Mathematical content.** Groups, generators, Cayley graphs, vertex-transitivity, cosets as clusters, the word metric. Examples: Z_n (cycle), Z_2 × Z_2 (square), S_3 (six nodes, two generators), D_4 (dihedral group of square), Q_8 (quaternion group). Connection to Lie algebras series (Weyl groups have Cayley graphs).

**Interactive.** A Cayley graph explorer. Dropdown selects a group; checkboxes select generators. The graph is drawn with a force layout. Click a node to highlight it as the identity and recolour the graph relative to that element. "Multiply by a" and "multiply by b" buttons walk through the graph, leaving a trail. A "cosets" toggle highlights left cosets of a chosen subgroup. Edge labels toggle on/off.

### 04. Commutative Diagrams: The Language of Category Theory

A commutative diagram is a directed graph of objects and morphisms where every pair of directed paths with the same start and end compose to the same morphism. It is the fundamental notation of category theory and appears throughout algebra, topology, and theoretical computer science.

**Mathematical content.** Categories, objects, morphisms, composition, commutativity. The square (pullback/pushforward), the triangle (factorisation), exact sequences (kernel → domain → codomain → cokernel). The snake lemma as a diagram chase. Functors as diagram-to-diagram maps.

**Interactive.** A commutative diagram builder. Click to place objects (labelled nodes); drag between objects to create morphisms (labelled arrows). The interactive checks commutativity: for every pair of paths with the same endpoints, it composes the morphism labels and highlights whether the paths agree (green) or conflict (red). Preset buttons load: the square, the exact sequence, the snake lemma, the universal property of the product. Arrow styles: plain, mono (↪), epi (↠), iso (≅).

### 05. Braid Diagrams: Crossings and the Braid Group

A braid on n strands is a collection of n non-intersecting curves from n top points to n bottom points, up to continuous deformation. A braid diagram draws these curves with explicit over/under crossings. The braid group B_n has generators σ_i (strand i crosses over strand i+1) and the relations σ_i σ_{i+1} σ_i = σ_{i+1} σ_i σ_{i+1} (the Yang-Baxter equation).

**Mathematical content.** Braid groups, generators σ_i, the Yang-Baxter relation, braid words, Artin presentation. The symmetric group as the quotient B_n → S_n (forget over/under). Pure braids (kernel of the quotient). Connection to knot theory: the closure of a braid is a knot or link (Alexander's theorem).

**Interactive.** A braid editor. Start with n parallel strands (adjustable, 3–6). Click between adjacent strands to insert a crossing (σ_i or σ_i^{-1}). The braid word is displayed below. Drag crossings to reorder. A "simplify" button applies Yang-Baxter moves and cancellation (σ_i σ_i^{-1} = 1) to reduce the braid word. An "animate" button smoothly deforms the braid to its simplified form. A "close" button connects top to bottom to show the resulting knot/link.

### 06. Knot Diagrams: Crossings, Invariants, and Reidemeister Moves

A knot diagram is a projection of a knot in 3D onto the plane, with crossing information (which strand goes over). Two diagrams represent the same knot if and only if they are related by Reidemeister moves (three types of local crossing rearrangements). A knot invariant is a quantity computable from the diagram that does not change under Reidemeister moves.

**Mathematical content.** Knots vs links, crossings, writhe, Reidemeister moves (R1, R2, R3), the crossing number as the simplest invariant, the bracket polynomial (Kauffman bracket) as a computable invariant, the Jones polynomial (mentioned). Unknot, trefoil, figure-eight, Hopf link.

**Interactive.** A knot diagram workspace. Draw a knot by clicking a sequence of points; the interactive closes the curve and auto-assigns crossings. Click a crossing to toggle over/under. A Reidemeister-move detector highlights regions where a move can be applied; click to apply it. The crossing number, writhe, and Kauffman bracket are computed and displayed live. Preset buttons load famous knots. A "simplify" button applies available Reidemeister moves to reduce crossing number.

### 07. String Diagrams: Wiring Algebra

A string diagram is a graphical calculus for monoidal categories: objects are wires, morphisms are boxes, composition is left-to-right connection, and tensor product is vertical stacking. Wires can bend (cups and caps = units and counits of a duality) and cross (braiding). The topology of the diagram — which wires connect to which boxes — is the entire content; the layout is irrelevant up to deformation.

**Mathematical content.** Monoidal categories, tensor product as stacking, composition as connection, symmetric monoidal categories (wires can cross freely), braided monoidal categories (crossings have over/under), duals and compact closure (cups and caps). Examples from linear algebra (matrices as boxes, traces as caps), quantum computing (quantum circuits as string diagrams), and signal processing (signal flow graphs).

**Interactive.** A string diagram builder. Place boxes (morphisms) with labelled input/output ports. Drag wires between ports to compose. Boxes snap to a grid; wires route automatically. A "tensor" button stacks two diagrams vertically. A "compose" button connects outputs to inputs horizontally. An "evaluate" button traces through the diagram and computes the composite morphism (for small finite examples, e.g. matrices). Preset buttons load: identity, swap, cup-cap (trace), a simple quantum circuit (CNOT).

### 08. Dynkin Diagrams: Classifying Simple Lie Algebras

The ADE classification: a handful of dots and lines encode all semisimple Lie algebras. Nodes are simple roots, edges encode non-orthogonality (single/double/triple bonds for 120°/135°/150°). Four infinite families A_n, B_n, C_n, D_n plus five exceptionals E_6, E_7, E_8, F_4, G_2. The Cartan matrix is readable from the diagram. The McKay correspondence: finite subgroups of SU(2) biject with affine ADE Dynkin diagrams.

**Interactive.** Button grid selecting any type from the full catalog. Diagram rendered with nodes and bonds. Cartan matrix displayed as a formatted table. ADE types highlighted. McKay correspondence table.

### 09. Quiver Diagrams: Arrows, Algebras, and Mutation

A quiver is a directed graph encoding an algebra. The path algebra has directed paths as basis vectors and concatenation as multiplication. Gabriel's theorem: a connected quiver has finitely many indecomposable representations iff its underlying graph is ADE. Fomin–Zelevinsky quiver mutation: reverse arrows at a vertex, add composition arrows, cancel opposites. Connection to cluster algebras.

**Interactive.** Preset quivers (A₃, A₄, D₄, triangle, Kronecker, Jordan). Force-directed layout. Click a vertex to mutate. Mutation counter. Reset button.

### 10. Dessins d'Enfants: Children's Drawings and the Absolute Galois Group

Grothendieck's dessins: bipartite graphs on surfaces encoding algebraic curves over number fields. Belyi's theorem: a Riemann surface is defined over Q̄ iff it admits a Belyi function. The preimage of [0,1] is a dessin. The absolute Galois group Gal(Q̄/Q) acts faithfully on dessins. The passport (degree sequence triple). Connection to moonshine: the j-function is a Belyi function.

**Interactive.** Preset dessins (segment, triangle, star, tetrahedron, cube). Bipartite rendering with black/white vertices. Passport and Euler characteristic displayed. Draggable vertices.

### 11. Weight Diagrams: Representations Made Visible

Weights of Lie algebra representations as lattice points. For sl₂: a linear string from -λ to +λ. For sl₃: the hexagonal weight lattice with the famous hexagonal weight diagrams. The highest weight determines the representation. Weyl dimension formula.

**Interactive.** Two panels (sl₂ and sl₃). sl₂: slider for highest weight, dots on a number line. sl₃: preset buttons for fundamental, adjoint, symmetric square, 10-dim, 27-dim. Hexagonal lattice rendering with dot sizes proportional to multiplicity.

### 12. Chord Diagrams: From Knots to Finite-Type Invariants

Paired points on a circle connected by chords. The intersection number counts crossing chord pairs. The four-term (4T) relation: the fundamental constraint defining Vassiliev invariants. Chord diagrams modulo 4T are dual to finite-type knot invariants. Connection to the Kontsevich integral.

**Interactive.** Preset chord diagrams (1-4 chords, crossing and parallel configurations, trefoil). Chords rendered on a circle with crossing detection. Intersection count displayed. 4T relation illustration.

### 13. Tangle Diagrams: Open-Ended Knots and Rational Tangles

A tangle is a portion of a knot or link inside a 3-ball, with four boundary points on the equator. The 0-tangle has two vertical strands, the ∞-tangle has two horizontal strands. Rational tangles are built by alternating horizontal and vertical twists; each one has a continued-fraction invariant p/q. Conway's theorem: two rational tangles are equivalent iff their fractions are equal. Numerator and denominator closures connect boundary points to produce knots/links.

**Interactive.** Preset rational tangles ([2], [3], [2,3], [3,2,1]). Strands rendered with over/under crossings. Fraction p/q displayed. Numerator closure button.

### 14. Penrose Graphical Notation: Tensors as Diagrams

Roger Penrose's 1971 graphical notation for tensor algebra. Each tensor is a node with lines for indices: upper lines for contravariant, lower for covariant. Contraction = connecting an upper line to a lower line (Einstein summation). Trace = self-loop. Special tensors: metric, Kronecker delta, Levi-Civita. Applications in general relativity, quantum information, and machine learning.

**Interactive.** 7 presets (matrix×vector, matrix product, trace, inner product, outer product, Riemann R, Einstein summation). Nodes as rounded rects, contraction wires as smooth curves, free indices as open-ended lines. Draggable nodes.

## Dependencies

1. **TDA series explainer 02** is a soft cross-reference from the Hasse diagram explainer (face lattice of a polytope).
2. **Lie algebras series** is a soft cross-reference from the Cayley graph explainer (Weyl groups), and a strong cross-reference from the Dynkin diagrams (08) and weight diagrams (11) explainers.
3. **Monstrous moonshine series** is a soft cross-reference from the dessins d'enfants explainer (10) via the j-function.
4. **Braid and knot explainers (05, 06)** are soft prerequisites for the tangle explainer (13).
5. **String diagrams explainer (07)** is a soft prerequisite for Penrose notation (14) — string diagrams are the categorical abstraction that Penrose notation concretizes for tensors.
6. **No hard prerequisites.** Each explainer is self-contained.

## What this series will not do

- **Proof-heavy category theory.** Commutative diagrams are introduced as a visual tool, not as a gateway to derived categories or topos theory.
- **Knot polynomials in full generality.** The Jones polynomial is mentioned; HOMFLY-PT and Khovanov homology are not.
- **Full representation theory.** Young diagrams and weight diagrams connect to representations, but we do not develop the full theory.
- **Operads and higher categories.** String diagrams stay in the monoidal-category setting.
- **Graph theory as such.** Cayley graphs are about groups, not about graph algorithms.
- **Cluster algebra theory in depth.** Quiver mutation is introduced as a combinatorial operation; the full algebraic framework is beyond scope.
- **Algebraic geometry beyond Belyi's theorem.** Dessins d'enfants are presented combinatorially; we do not develop scheme theory.

## Files

```
plans/mathematical-diagrams/
  README.md                              (this file)

docs/mathematical-diagrams/
  lib/
    diagram-math.js                      (layout algorithms, group tables, partition logic, braid words, Dynkin, quivers, dessins, weights, chords, tangles, Penrose)
    test.html                            (in-browser sanity checks)
  index.html                             (series landing page)
  01-hasse-diagrams.html
  02-young-diagrams.html
  03-cayley-graphs.html
  04-commutative-diagrams.html
  05-braid-diagrams.html
  06-knot-diagrams.html
  07-string-diagrams.html
  08-dynkin-diagrams.html
  09-quiver-diagrams.html
  10-dessins-denfants.html
  11-weight-diagrams.html
  12-chord-diagrams.html
  13-tangle-diagrams.html
  14-penrose-notation.html
```
