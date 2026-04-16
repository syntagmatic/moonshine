# The Shape of Data

"Data has shape, and the shape matters." Fifteen interactive explainers on topological data analysis, from the Vietoris-Rips complex on a handful of points in the plane to Borcherds-style persistence on real scientific datasets, with the stability theorem as the hinge that makes it all work on noisy finite data.

## Locked plan

**Spine.** Topological data analysis has a natural three-act pedagogy. Act I builds the combinatorial and algebraic vocabulary (simplicial complexes, boundary maps, homology groups, Betti numbers) without assuming any topology background beyond linear algebra. Act II introduces the multiscale idea that makes TDA distinctive: filtrations parameterised by a radius or threshold, persistent homology as the functor that tracks features across scales, barcodes and persistence diagrams as the visual output, and the stability theorem of Cohen-Steiner-Edelsbrunner-Harer that makes the whole framework robust to noise. Act III turns theory into practice: the matrix-reduction algorithm that computes persistence, the Mapper algorithm as an alternative pipeline, applications to real scientific data, multiparameter persistence as the open frontier, and a closing meditation on the relationship between geometry and algebra.

**Reader endpoint.** After this series, a reader should be able to take a point cloud, build a Vietoris-Rips filtration at increasing radius, compute its persistent homology via the standard column-reduction algorithm, read the output as a barcode or persistence diagram, assess significance by appealing to the stability theorem, and recognise Mapper and multiparameter persistence as research-frontier extensions. They will also have a working intuition for what "the shape of data" means and why topological invariants are the right language for it.

**Identity.** Slug `topological-data-analysis`, title *The Shape of Data*, tagline *"Data has shape, and the shape matters."* Visual register: point clouds growing into simplicial complexes, barcodes as horizontal bars extending rightward against a filtration axis, persistence diagrams as scatter plots above a diagonal. The dominant motion is *growth*: simplices fade in as a radius sweeps, bars extend as features persist. Color encodes homological dimension (H0 blue, H1 emerald, H2 amber), not act. 740px article width and the same font stack as the rest of the moonshine ecosystem.

**Shape.** Three acts, thirteen explainers total. Acts are named after what they achieve:

- **Act I: Shape Without Coordinates** (3 explainers). Builds the vocabulary: simplicial complexes, homology groups (with chain-builder, Betti-explorer, and Betti-timeline interactives), Betti numbers, the Euler-Poincare formula, and functoriality. Explainers 03-05 from the original plan were combined into a single substantial homology explainer with three interactive figures.
- **Act II: Persistence** (5 explainers). The multiscale idea. Filtrations, the Rips construction, the persistence algorithm, barcodes and persistence diagrams as dual representations, Cech-vs-Rips interleaving, and the stability theorem. A reader who finishes Act II understands why TDA works on real data.
- **Act III: The Computational Frontier** (5 explainers). How to actually compute persistence (the reduction algorithm), the Mapper alternative, three application case studies, multiparameter persistence as a frontier, and a closing reflection.

**Per-explainer shape.** 300-600 lines. Each explainer follows the series template: a 1-2 paragraph motivating frame, mathematical development with KaTeX and at least one interactive D3 figure, an insight box per major idea, and a closing "what we take with us" list that sets up the next piece. Figures favour point clouds, growing simplicial complexes, barcodes, persistence diagrams, and boundary matrices, all D3-renderable in SVG or Canvas.

**Rendering stack.** D3 v7 + SVG/Canvas + KaTeX, same as the rest of the moonshine ecosystem. No build step, no external data files (point clouds are generated procedurally via `lib/tda-math.js`), no server calls.

## Semantic color vocabulary

```css
:root {
  /* Homological dimension -- the primary semantic axis */
  --c-H0: #2563eb;      /* blue    -- connected components (H_0) */
  --c-H1: #059669;      /* emerald -- loops / 1-cycles (H_1) */
  --c-H2: #d97706;      /* amber   -- voids / 2-cycles (H_2) */

  /* Lifecycle */
  --c-birth: #16a34a;   /* green   -- the moment a feature appears */
  --c-death: #dc2626;   /* red     -- the moment a feature is killed */

  /* Structural roles */
  --c-simplex: #7c3aed; /* violet  -- a simplex being highlighted or added */
  --c-diagonal: #94a3b8;/* slate   -- the diagonal in a persistence diagram */
}
```

The H0/H1/H2 palette is the load-bearing convention. Every barcode, persistence diagram, highlighted cycle, and Betti-number readout uses these three colors consistently across all 15 explainers.

## Phase state

- [x] **Phase 0** -- write this spine
- [x] **Phase 1** -- build `lib/tda-math.js` + Act I (5 explainers)
- [x] **Phase 2** -- Act II (5 explainers)
- [x] **Phase 3** -- Act III (5 explainers)
- [x] **Phase 4** -- SPH 6-pass audit (nav, semantic colors, color KaTeX, reducedMotion, ResizeObserver, prose anti-slop)

## Explainer list

Fifteen explainers in three acts. Each entry includes the pedagogical substance, the key objects and formulas, and the intended interactive figure.

### Act I -- Shape Without Coordinates

**01. Points, Proximity, and the Rips Complex.** Data points in the plane are just a scatter plot. But draw a ball of radius epsilon around each point and connect points whose balls overlap, and structure appears: at small epsilon, isolated points; at large epsilon, a single blob; in between, clusters and loops that reflect the geometry of the sample. This explainer introduces the Vietoris-Rips complex as the central construction and asks the question the series will answer: how do we read "shape" from a growing complex? Interactive: a canvas of 30-50 draggable points in 2D with a horizontal epsilon slider. Translucent discs grow around each point as the slider advances; edges, triangles, and tetrahedra of the Rips complex fade in when the pairwise-distance condition is met. Dragging individual points creates or destroys simplices. A counter reports current simplex counts.

**02. Simplicial Complexes as Combinatorial Shapes.** The Rips complex from explainer 01 was geometric, embedded in the plane. But the algebraic machinery we are about to build needs only the combinatorial data: which subsets of vertices form simplices. This explainer defines abstract simplicial complexes, the face relation, dimension, the f-vector, and the Euler characteristic. We show that the same abstract complex can be realised geometrically in many different ways, and that topological invariants depend only on the combinatorics. Interactive: an abstract complex editor. Click vertices and toggle simplices on/off; the left panel shows the Hasse diagram (face lattice) and the right panel shows a draggable geometric realisation. Readout displays f-vector and Euler characteristic live. Preset buttons load named complexes: boundary of tetrahedron, Mobius band, torus (7-vertex minimal), hollow triangle.

**03. Homology: Counting Holes Algebraically.** A loop in a simplicial complex might bound a filled-in triangle, or it might not. The ones that do not are the "holes." Homology makes this precise: chain groups, boundary operators, cycles, boundaries, and the quotient H_k = ker(partial_k) / im(partial_{k+1}). We compute H_0 (connected components), H_1 (loops), and H_2 (voids) by hand on small examples, showing that the boundary-of-a-boundary is always zero and that homology groups are the algebraic residue of that fact. Historical anchor: Noether's 1925 remark that Betti numbers should be upgraded to groups (cross-reference Noether series explainer 15, vignette 4). Interactive: a small simplicial complex (6-8 vertices) with a step-through computation. The reader clicks "next step" to walk through C_2 -> C_1 -> C_0, seeing boundary matrices assemble column by column. The current chain is highlighted on the geometric picture with signed orientation. When finished, independent cycles generating H_1 are drawn as colored loops. Dropdown swaps between presets (hollow triangle: H_1 = Z; filled triangle: H_1 = 0; torus: H_1 = Z^2, H_2 = Z).

**04. Holes in Every Dimension.** H_0 counts connected components; H_1 counts independent loops; H_2 counts enclosed voids. But homology extends to every dimension. This explainer builds intuition for higher-dimensional "holes" using the boundary of a tetrahedron (H_2 = Z), the boundary of a 4-simplex (H_3 = Z), and the hollow n-simplex pattern. We also meet Betti numbers as ranks of homology groups and the Euler-Poincare formula. Interactive: a "shape selector" with buttons for circle, sphere, torus, genus-2 surface, Klein bottle (over Q). For each shape, a 3D-projected simplicial triangulation rotates slowly, and Betti numbers appear as a bar chart. Toggles for wireframe, surface, and cycle-highlight views.

**05. From Shape to Functor.** Homology is not just a collection of groups; it is a functor, turning maps between spaces into maps between groups. When a simplicial complex grows, the inclusion map induces a linear map on homology. This functoriality is what makes persistence work in Act II: as the filtration parameter increases, homology classes are born, persist, and die, and the induced maps track which class at one scale is "the same" class at another. This explainer also introduces reduced homology and the exact sequence of a pair. Interactive: two complexes K subset L. Click "include K in L" to animate the extra simplices fading in; below, a commutative diagram shows chain maps and induced maps on homology. A slider selects intermediate stages K_0 c K_1 c ... c L, previewing the filtration concept.

### Act II -- Persistence

**06. Filtrations and the Birth-Death Story.** A filtration is a nested sequence of complexes K_0 c K_1 c ... c K_n, parameterised by a real number (epsilon, a density threshold, a function value). As the parameter grows, topological features are born and die. This explainer defines filtrations precisely, introduces birth/death times, and shows that inclusion-induced maps on homology track features across scales. Interactive: animated filtration of a Rips complex built on ~40 points sampled from a noisy annulus. Epsilon slider or play/pause button; simplices are highlighted briefly on arrival. Below, a running event log: "epsilon = 0.31: edge (3,7) added. H_0 death: components merge." Points are draggable.

**07. Persistent Homology and Barcodes.** The central object of TDA. A persistence barcode is a multiset of intervals [birth, death), one per topological feature. Long bars are signal; short bars are noise. This explainer constructs the barcode from the filtration of explainer 06 and shows it is a complete invariant of the filtration's homology up to isomorphism. Interactive: split-screen. Top: growing Rips complex. Bottom: barcode with horizontal axis matching the epsilon axis above. Bars extend in real time; on death, bars terminate with a cap. Colored by homological dimension. Click a bar to highlight the corresponding cycle above. A "noise" slider adds Gaussian jitter and recomputes, showing long bars are stable.

**08. Persistence Diagrams and the Diagonal.** An equivalent representation: plot each feature as a point (birth, death) in the plane. Features with long lifetimes sit far from the diagonal y = x; short-lived features cluster near it. This explainer defines the persistence diagram, proves the bijection with the barcode, introduces the diagonal-with-infinite-multiplicity convention, and explains why the diagonal matters for stability. Interactive: left panel persistence diagram (birth vs death, dashed diagonal, dots colored by dimension); right panel corresponding barcode. Click-to-highlight linking between them. "Rotate to lifetime" toggle smoothly interpolates axes from (birth, death) to (birth, death - birth).

**09. Cech vs Rips, and the Nerve Theorem.** The Rips complex depends only on pairwise distances (computationally convenient). The Cech complex (nerve of a union of balls) is geometrically correct via the nerve theorem: the nerve of a good cover is homotopy equivalent to the underlying space. Interleaving: Cech(eps) c Rips(eps) c Cech(2*eps). In practice Rips is good enough. Interactive: ~20 points with epsilon slider. Left panel: Cech complex (balls drawn transparently, intersections highlighted). Right panel: Rips at same epsilon. Second slider shows Cech at 2*epsilon, demonstrating the sandwich. Toggle overlays persistence diagrams.

**10. The Stability Theorem.** The reason TDA works on real data. If two point clouds are close in Hausdorff distance, their persistence diagrams are close in bottleneck distance. Defines the bottleneck distance (infimum over matchings of the supremum matched-pair distance), states the Cohen-Steiner-Edelsbrunner-Harer theorem (2007), explains why the diagonal convention is essential (unmatched points match to the diagonal). Also introduces Wasserstein distance. Interactive: two persistence diagrams from noisy samples of the same shape. Noise-level slider increases perturbation; bottleneck distance displayed and grows proportionally. "Animate matching" button draws optimal matching lines. Reader can drag individual dots and watch bottleneck update live.

### Act III -- The Computational Frontier

**11. Computing Persistence: The Matrix Reduction Algorithm.** The theory becomes computable via column-reduction on the boundary matrix of the filtered complex. Order simplices by filtration value, build the boundary matrix (Z/2 coefficients), reduce by left-to-right column operations (Gaussian elimination), read the barcode from pivot positions. Cubic complexity; mention practical speedups (clearing, compression). Interactive: a small filtered complex (15-20 simplices) with its boundary matrix displayed as a grid. "Step" button performs one column operation at a time, highlighting pivot column, added column, and result. Reduced entries turn green. When finished, pivot pairs connect to barcode bars via arcs. "Random complex" button generates new examples.

**12. The Mapper Algorithm.** A different philosophy: instead of exact homology, Mapper produces a combinatorial graph summarising shape. Pipeline: choose lens function f: X -> R, cover range with overlapping intervals, cluster preimages, build the nerve. Output: a graph of clusters and overlaps. Interactive: 2D point cloud (presets: noisy circle, Y-shape, linked rings, figure-eight). Lens dropdown (x-coordinate, centroid distance, eccentricity, density). Two sliders: number of intervals and percent overlap. Left: point cloud with lens as color gradient and interval boundaries. Right: Mapper graph updating live. Hover node highlights cluster.

**13. TDA on Real Data.** Three case-study vignettes. (a) Image patches: the space of 3x3 high-contrast patches from natural images forms a Klein-bottle-like shape, detected by persistent H_1 and H_2 (Carlsson et al. 2008). (b) Protein structure: Ramachandran plot (phi, psi) angles have persistent features corresponding to secondary structure. (c) Cyclic data: periodic signals have a persistent H_1 feature whose gap measures periodicity strength. Interactive per vignette: (a) PCA scatter of patches with persistence diagram overlay; (b) Ramachandran scatter filterable by amino acid; (c) synthetic periodic signal with period-strength slider.

**14. Multiparameter Persistence.** The Rips filtration uses one parameter. Real data often has multiple natural scales (spatial + density, two function values). Multiparameter persistent homology replaces the totally ordered filtration with a poset-indexed one (typically R^2). The bad news: no barcode exists (decomposition theorem fails for width > 1 posets). The good news: rank function, Hilbert function, and fibered barcodes give partial summaries. Active research frontier. Interactive: point cloud with two parameters (Rips radius on x-axis, density threshold on y-axis). 2D trackpad or linked sliders control both. Complex updates in left panel. Right panel shows fibered barcode for a chosen line through parameter space. "Sweep direction" dial rotates the line. Inset: rank function as heatmap over the 2D parameter plane.

**15. Shape, Algebra, and the View from Here.** Closing meditation. The series began asking "what is the shape of data?" and built an answer: shape means the pattern of topological features that persist across scales. Survey: Morse theory and sublevel-set filtrations, persistent cohomology and circular coordinates, sheaf-theoretic persistence, persistence modules as functors. Philosophical close: algebra is not a retreat from geometry but a way of making geometry portable. Interactive: a "shape zoo" gallery of point cloud shapes (circle, sphere, torus, figure-eight, trefoil, linked rings, genus-2 surface, random clusters). For each, the full pipeline auto-runs: Rips filtration, persistence computation, barcode, persistence diagram. Adjustable sample size and noise. All three outputs shown with click-to-highlight linking. "Overlay" toggle superimposes diagrams of visited shapes.

## Dependencies

1. **Noether series explainer 15** is a soft prerequisite. Its homology vignette (boundary maps, H_0/H_1 for small complexes) is the historical origin point. TDA explainer 03 cross-references it. Link text: "We met simplicial homology briefly in the Noether series; now we build it from scratch."
2. **No hard prerequisites.** Act I is self-contained for a reader with linear algebra (matrices, rank, kernel, image).
3. **No library dependencies beyond `tda-math.js` and the usual D3 + KaTeX stack.** Point clouds are generated procedurally; no external datasets.

## What this series will not do

- **Persistent cohomology and circular coordinates.** Mentioned in explainer 15 but not developed.
- **Discrete Morse theory.** Speeds up computation but is not conceptually essential for the first encounter.
- **Zigzag persistence.** Requires derived-category language that would break Act I's accessibility.
- **Extended persistence and relative homology.** Assumes manifold structure point-cloud data rarely has.
- **Sheaf-theoretic and categorical persistence.** Mentioned as a frontier in explainer 15 but not formalised.
- **Software tutorials.** No Ripser, GUDHI, Dionysus, or scikit-tda walkthroughs.
- **Statistical inference on persistence diagrams.** Confidence sets, bootstrap, hypothesis testing.
- **Torsion in homology.** All computations over Z/2 or Q.
- **Cubical complexes.** Important for image data but adds complexity without enough pedagogical payoff.
- **Dimensionality reduction (UMAP, t-SNE, PCA).** Related but not TDA.

## Files

```
plans/topological-data-analysis/
  README.md                              (this file)

docs/topological-data-analysis/
  lib/
    tda-math.js                          (simplicial complexes, filtrations, persistence, Mapper, point cloud generators)
    test.html                            (in-browser sanity checks)
  index.html                             (series landing page)
  01-points-proximity-rips.html
  02-simplicial-complexes.html
  03-homology.html
  04-holes-in-every-dimension.html
  05-from-shape-to-functor.html
  06-filtrations-birth-death.html
  07-persistent-homology-barcodes.html
  08-persistence-diagrams.html
  09-cech-vs-rips.html
  10-the-stability-theorem.html
  11-matrix-reduction.html
  12-the-mapper-algorithm.html
  13-tda-on-real-data.html
  14-multiparameter-persistence.html
  15-shape-algebra-and-beyond.html
```
