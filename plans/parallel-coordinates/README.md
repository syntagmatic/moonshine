# Parallel Coordinates — 29 Moonshine Explainers

Interactive explorations of Inselberg's parallel coordinates framework. From point-line duality through applied domains and exceptional root systems to a final synthesis.

## Context

- **Audience:** People interested in high-dimensional geometry, data visualization, and mathematical structures. Assumes comfort with linear algebra and basic topology.
- **Quality target:** SPH-standard. Footer nav, semantic colors, color-coded KaTeX, IntersectionObserver on animation loops, hover highlighting on all polyline figures, bidirectional drag on all controllable figures.
- **Output:** `docs/parallel-coordinates/01-the-duality.html` through `29-connections.html`, numbered.
- **Index:** `docs/parallel-coordinates/index.html` — header viz showing polylines and crossings, categorized card list with canvas thumbnails and technique tags.
- **Source:** Geometric framework after Alfred Inselberg, *Parallel Coordinates: Visual Multidimensional Geometry* (Springer, 2009).

## Color vocabulary spec

Shared across all 29 articles and the index page. Declared in each file's `:root` block.

```css
:root {
  --c-polyline: #2563eb;  /* blue  — polylines, data lines */
  --c-point:    #059669;  /* green — points in Cartesian space */
  --c-crossing: #dc2626;  /* red   — crossings, convergence, highlights */
  --c-brush:    #7c3aed;  /* purple — brushed/selected regions */
  --c-surface:  #d97706;  /* amber  — envelopes, surfaces, constraints */
  --c-axis:     #64748b;  /* slate  — axes, structural elements */
}

.t-polyline { color: var(--c-polyline); font-weight: 600; }
.t-point    { color: var(--c-point);    font-weight: 600; }
.t-crossing { color: var(--c-crossing); font-weight: 600; }
.t-brush    { color: var(--c-brush);    font-weight: 600; }
.t-surface  { color: var(--c-surface);  font-weight: 600; }
.t-axis     { color: var(--c-axis);     font-weight: 600; }
```

KaTeX equations use matching `\color{#hex}{}` on key variables: point coordinates green, polyline parameters blue, crossings red, brush intervals purple, envelopes amber, axis/structural elements slate.

## Interaction design principles

The central principle: **bidirectional manipulation**. Wherever a point is shown in Cartesian space AND as a polyline in parallel coordinates, both representations should be directly draggable. Drag the Cartesian point and the PC line follows. Drag the dot where the polyline meets an axis and the Cartesian point follows.

- **PC axis dots**: draggable vertically along the axis, updating the corresponding coordinate
- **Convergence points**: draggable in the inter-axis space, snapping to the nearest valid position on the envelope (using a precomputed lookup table)
- **Click-to-place**: click in Cartesian to place a point (line in PC), click on PC axes to build a line (point in Cartesian), click between PC axes to place a convergence point (line in Cartesian)
- **Hover highlighting**: every figure with multiple polylines has pointerenter/pointerleave that dims siblings and highlights the hovered line
- **No animation on reorder**: axis reordering is instant, not animated. The reader's eyes track position, not motion.
- **Full-axis grab targets**: invisible wide rects over the full axis height, not just the label text

## Series structure

### Foundations (01–04)
| # | Title | Key interactions |
|---|-------|-----------------|
| 01 | The Duality | Bidirectional drag (Fig 1). Click-to-place explorer with 3 zones: Cartesian, PC axis, between-axes (Fig 2). Fan lines toggle. Sample button. |
| 02 | What Crossings Tell You | Draggable crossing anatomy (Fig 2). Correlation slider (Fig 1). Iris species filter (Fig 3). |
| 03 | Surfaces You Can't See | Draggable tangent point on circle + parabola. Draggable convergence point in PC with envelope-snap. Hyperplane coefficient sliders. Cusp/inflection toggle. Convexity toggle. |
| 04 | Axis Order Is Everything | Instant drag-to-reorder with full-axis grab targets. Correlation matrix linked to PC. All-orderings auto-stepper. |

### Geometric Properties (05–08)
| # | Title | Key interactions |
|---|-------|-----------------|
| 05 | Finding Clusters | Cluster count/spread sliders. Wine dataset hover highlighting. Brushing on axes. |
| 06 | The Outlier's Signature | Draggable outlier dots on PC axes, synced with deviation sliders. QC data hover. |
| 07 | Inside or Outside | Draggable test point in Cartesian + PC. Polygon vertex slider. Eccentricity/rotation sliders. |
| 08 | Brushing Is Slicing | Axis brush. Linked PC + scatterplot. Strum brush. Wedge selection. |

### Applied Domains (09–13)
| # | Title | Key interactions |
|---|-------|-----------------|
| 09 | Process Control | Draggable process-variable handles on axes. Drift/no-drift toggle. Correlation-based axis reordering. |
| 10 | Diagnosis | Heart disease profiles hover. Cohen's d bar chart. Draggable new-patient dots on PC axes synced with sliders and prediction. |
| 11 | Collision Courses | Draggable aircraft positions + velocities. CPA scatter + PC brush linking. Scenario buttons. Threshold slider. |
| 12 | Robot Arms | Draggable IK target. Link length sliders (L1, L2, L3) + tolerance. Config space brushing. Draggable joint limit boundaries on PC axes. 2-link vs 3-link redundancy comparison. |
| 13 | The Pareto Front | Hover-linked scatter + PC. Dominance click-select. Objective count toggle. Click polyline to auto-set weight sliders. |

### Hyperdimensional Geometry (14–29)
| # | Title | Key interactions |
|---|-------|-----------------|
| 14 | Polytopes in Parallel | Drag-rotate 4D wireframe + PC (bidirectional). Polytope selector. Polyline/dot toggle. ResizeObserver on canvas. |
| 15 | Symmetry You Can See | Rotation plane selector. Speed slider. Click vertex to show neighbors. IntersectionObserver on rotation loop. |
| 16 | Duality and Topology | Drag-rotate dual pair. Euler table highlight. Morph slider + play/pause. Deformation slider. |
| 17 | The Curse and the Promise | Dimension slider. Overplot strategy buttons. Hierarchical grouping. Polytope selector. E8 roots hover. |
| 18 | E8: Exceptional Symmetry | Subsystem filter hover. Coxeter animation hover. |
| 19 | Exceptional Root Systems | Small-multiples hover per panel. |
| 20 | The Leech Lattice | Shared drawPC with hover highlighting. |
| 21 | Monstrous Moonshine | McKay-Thompson series hover. |
| 22 | The Golay Code | Codeword hover. Octad hover. Neighbor hover. |
| 23 | Quasicrystals | Penrose PC hover. E8 full/projected hover. Ammann-Beenker hover. IntersectionObserver on animation. |
| 24 | Permutohedron-Associahedron | S5/600-cell hover. Loday-Ronco hover. |
| 25 | Cayley Graphs | A5/S4-conjugacy/word-metric hover with filter-aware restore. |
| 26 | Knot Invariants | Alexander coefficient hover. Invariant bounds hover. Full PC with click-select. |
| 27 | Error-Correcting Codes | Hamming/RM/Reed-Solomon codeword hover. |
| 28 | Birkhoff Polytope | DS/permutation/majorization curve hover. |
| 29 | Connections | 7 hover-enabled figures: cut-and-project, signatures, density, bundles, tesseract, Hamming, D4. |

## Remaining opportunities

### Interaction (medium priority, next conversation)
- 02-Fig1: draggable crossing region to set correlation
- 05-Fig1: draggable cluster centers
- 08-Fig2: scatterplot bands draggable to update PC brushes
- 08-Fig3: draggable strum endpoints
- 12-Fig1: draggable PC axis dots for highlighted IK solution
- 15-Fig1: drag rotation instead of slider-only

### Technical (lower priority)
- 03-Fig4: convexity envelope still uses heuristic segment splitting
- 18-24: canvas wireframes could use ResizeObserver
- JS color constants could read from CSS vars instead of duplicating hex values

## Verification

For any article:
1. Footer: prev/next links work, no dead links
2. KaTeX: colored variables render correctly
3. Hover: polylines highlight on pointerenter, restore on pointerleave
4. Drag: all grab-cursor elements update both Cartesian and PC views
5. Animations: pause when scrolled off-screen, resume on scroll-back
6. Resize: responsive figures adapt to window width
