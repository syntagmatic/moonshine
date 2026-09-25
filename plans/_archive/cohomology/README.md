# Holes Have Names

Six interactive explainers on cohomology — the algebraic shadow of every hole. From a cocycle on a triangulated torus to a persistent cohomology barcode, with the cup product as the move that turns groups into a ring you can compute on.

## Locked plan

**Spine.** Cohomology gets taught twice and learned never. The first pass is "dualize the chain complex" — true but unmemorable. The second pass is "sheaves and derived functors" — true but too soon. This series picks a third path: cohomology as the answer to a concrete question that homology cannot answer. Why does the sphere admit no nonvanishing vector field? Why does $\mathbb{RP}^2$ have the cohomology ring it does and not a different one? What does it mean to integrate a 1-form around a loop and get a number that depends only on the loop's class? Each essay answers one of these in a small, fully manipulable instance. The cup product is the spine — once a reader has multiplied two cocycles on a triangulated $\mathbb{RP}^2$ by hand, the rest of cohomology stops being a translation exercise.

**Reader endpoint.** After this series a reader should be able to: build a singular cochain complex on a small simplicial complex, compute $H^*$ over $\mathbb{Z}/2$ and read it as a graded ring; compute the cup product on a triangulated $\mathbb{RP}^2$ or $T^2$; integrate a closed 1-form on $S^2$ and recover its de Rham class; run a Mayer–Vietoris computation as an actual algorithm on a cover; and read a persistent cohomology barcode as the time-reversed dual of persistent homology. They will also have a working sense of *what cohomology is for* — namely, naming obstructions in a way that composes.

**Identity.** Slug `cohomology`, title *Holes Have Names*, tagline *"Six interactive explainers on cohomology — the algebraic shadow of every hole."* Visual register: triangulated surfaces (torus, $\mathbb{RP}^2$, $S^2$) with cochains drawn as labels on simplices, cup-product cells highlighted, Mayer–Vietoris covers as overlapping translucent disks, persistent cohomology bars extending leftward from death to birth (the time-reversed dual). Color encodes cohomological degree (H⁰ blue, H¹ emerald, H² amber — same palette as the TDA series for cross-series legibility); the coboundary operator δ is red; the cup product is violet.

**Shape.** Two acts, six explainers, 3/3.

- **Act I — From holes to rings** (3 explainers). Builds the structural vocabulary: why dualize, the singular cochain complex with worked δ on a small complex, the cup product as the algebraic operation that promotes graded groups into a ring.
- **Act II — From rings to computation** (3 explainers). Three concrete ways to *compute* cohomology: de Rham (integration of forms on $S^2$); Mayer–Vietoris (a recursive algorithm on a cover); persistent cohomology (the multiscale dual). The acts mirror each other — act I is "what cohomology is," act II is "how to get it."

**Per-explainer shape.** 300–600 lines. Each follows the moonshine essay template: 1–2 paragraph motivating frame, mathematical development with KaTeX and at least one interactive D3 figure, an insight box per major idea, and a closing "what we take with us" list that sets up the next piece. Each essay's interactive figure uses a **distinct visual grammar** so the series does not feel like one chart re-skinned: cell-labelled triangulation (01, 02), cup-product cellular table (03), gradient/curl vector field on a sphere (04), animated cover refinement (05), birth/death dual barcode (06). Per the moonshine convention, math-heavy code gets one short comment explaining the geometry, not the implementation.

**Rendering stack.** D3 v7 + SVG/Canvas + KaTeX, same as the rest of the moonshine ecosystem. No build step, no external data files. Shared computational engine at `docs/cohomology/lib/coh-math.js` attaches a `COH` global. The lib **depends on** `docs/topological-data-analysis/lib/tda-math.js` (loaded first); cohomology is built on top of the simplicial complex and $\mathbb{Z}/2$ boundary code already in `TDA.complex` and `TDA.boundary`. Cochains are the dual chain groups; coboundary is the transposed boundary; cup product is implemented combinatorially via the front-face / back-face Alexander–Whitney formula on ordered simplices.

## Semantic color vocabulary

```css
:root {
  /* Cohomological degree — shared with the TDA series for legibility */
  --c-H0: #2563eb;      /* blue    — H⁰ (functions / constants on components) */
  --c-H1: #059669;      /* emerald — H¹ (1-cocycles / closed 1-forms) */
  --c-H2: #d97706;      /* amber   — H² (2-cocycles / closed 2-forms) */

  /* Operators */
  --c-cocycle: #16a34a;     /* green   — a closed cochain (δα = 0) */
  --c-coboundary: #dc2626;  /* red     — the differential δ (or an exact cochain) */
  --c-cup: #7c3aed;         /* violet  — the cup product α ∪ β */

  /* Structural roles */
  --c-form: #0891b2;        /* cyan    — a differential form (de Rham essay) */
  --c-cover: #94a3b8;       /* slate   — an open set in a Mayer–Vietoris cover */
  --c-pair: #f59e0b;        /* gold    — a pairing (integral, evaluation, Kronecker) */
}
```

The H0/H1/H2 palette is intentionally identical to the TDA series. A reader who has read TDA already associates blue/emerald/amber with components/loops/voids; cohomology should reinforce, not override, that pairing. Cocycle-green vs coboundary-red is the load-bearing cohomology-specific addition: every figure that shows δ uses red, every figure that shows ker δ uses green, and a cohomology class shows them both at once (a green dot inside a red boundary, the picture of "closed but not exact").

## Phase state

- [x] **Phase 0** — write this spine
- [x] **Phase 1** — ship `lib/coh-math.js` API surface (v0.1.0, sanity checks green)
- [x] **Phase 2** — Act I (3 explainers): 01, 02, 03 (2026-05-26, 3 parallel agents)
- [x] **Phase 3** — Act II (3 explainers): 04, 05, 06 (2026-05-26, 3 parallel agents)
- [ ] **Phase 4** — SPH 6-pass audit (nav, semantic colors, color KaTeX, reducedMotion, ResizeObserver, prose anti-slop)

## Explainer list

Six explainers in two acts. Each is described in enough detail that a parallel agent can implement it from its brief alone. See [`briefs/`](briefs/) for the per-essay self-contained briefs that act as work units.

### Act I — From holes to rings

**01. From holes to obstructions: why dualize at all.** Homology counts holes. Cohomology gives those holes *names* — names that you can add, multiply, and pair against chains. This explainer motivates the dualization. We start with a concrete obstruction: there is no nonvanishing vector field on $S^2$, and the cleanest statement of why is a cohomology class (the Euler class) that refuses to be zero. We do not prove this; we *show* what it would mean to name an obstruction with a number that depends only on the topology. The figure is a small triangulated annulus with a 1-cochain (a number on each oriented edge) and a slider that adds an exact piece $\delta f$ to it; the reader watches the *evaluation* on each 1-cycle stay invariant while the cochain itself changes. The closing claim: cohomology classes are the things that survive this slider. Interactive: triangulated annulus, ~30 edges. Reader edits a base 1-cochain by clicking edges; a second slider scales an added $\delta f$ for a chosen vertex function $f$. The pairing $\langle \alpha, \gamma \rangle$ on each of two displayed cycles is shown live and is provably constant under δ-perturbation.

**02. Singular cohomology on a triangulated torus.** Build the cochain complex by hand: $C^k = \mathrm{Hom}(C_k, \mathbb{Z}/2)$, with $\delta = \partial^T$. Walk through a small triangulated torus (the standard 7-vertex Möbius–Kantor triangulation, or a 9-vertex flat torus). Reader steps through assembling the boundary matrix from `TDA.complex`, takes its transpose to get $\delta$, computes $H^k = \ker \delta_k / \mathrm{im}\,\delta_{k-1}$ by Gaussian elimination. Output: $H^0 = \mathbb{Z}/2$, $H^1 = (\mathbb{Z}/2)^2$, $H^2 = \mathbb{Z}/2$. The figure is a *cell-labelled* triangulation: each edge and triangle carries a number; cocycles are drawn green, coboundaries red, generators of $H^1$ as two colored loops. A dropdown swaps in $S^2$ (where $H^1 = 0$, the picture flatlines) and $\mathbb{RP}^2$ (where $H^1 = \mathbb{Z}/2$, one loop remains). The historical anchor is short: Poincaré built homology; the dualization is later. The point is that *the matrix transpose is the whole construction* — nothing else changes.

**03. The cup product on $\mathbb{RP}^2$ and $T^2$.** The most important move in cohomology. The cup product $\smile : H^p \otimes H^q \to H^{p+q}$ turns the graded group $H^*$ into a graded-commutative ring, and that ring detects things the underlying groups cannot. The torus and the wedge $S^1 \vee S^1 \vee S^2$ have the same Betti numbers, but their cohomology rings are different: on $T^2$, two generators of $H^1$ cup to a generator of $H^2$; on the wedge they cup to zero. The figure is the **cup product table** for a triangulated $\mathbb{RP}^2$ (over $\mathbb{Z}/2$): a 3×3 grid whose cells fill in as the reader applies Alexander–Whitney to cocycle representatives. Interactive: a $\mathbb{RP}^2$ triangulation (the 6-vertex minimal, $\{1,\ldots,6\}$ with antipodal identification), two clickable 1-cocycles $\alpha, \beta \in H^1$, a button "compute $\alpha \smile \beta$" that animates the front-face/back-face splitting on each 2-simplex and writes the result into the table cell. Toggling to the wedge or to $S^2$ shows the table collapse. The closing claim: the ring $H^*(\mathbb{RP}^2; \mathbb{Z}/2) = \mathbb{Z}/2[\alpha]/(\alpha^3)$ is *the same algebra* as the Cayley plane $H^*(\mathrm{OP}^2; \mathbb{Z}) = \mathbb{Z}[\alpha]/(\alpha^3)$ (cross-reference: squishy-thing/research/36-octonionic-projective-plane), only the dimension of $|\alpha|$ differs.

### Act II — From rings to computation

**04. de Rham: differential forms on $S^2$.** A different construction. Instead of cochains-on-simplices, take *differential forms* on a smooth manifold; instead of δ, take the exterior derivative $d$. The de Rham theorem says you get the same answer as singular cohomology with real coefficients. We do not prove de Rham; we *show* what the comparison feels like. The figure is the standard sphere with a 1-form drawn as a vector field; the reader can choose between an exact form ($df$ for various smooth $f$ — curl-free, integrates to zero around any loop), a closed but locally-supported "bump" form, and the generator-of-$H^1(S^1)$ pulled back along latitude. A second canvas shows the integral $\oint \omega$ along a draggable loop on the sphere; for closed forms, the integral depends only on the homology class of the loop. The historical anchor: Élie Cartan's *Sur certaines expressions différentielles*; de Rham's 1931 thesis. Closing: $d \circ d = 0$ on the form side is the *same identity* as $\partial \circ \partial = 0$ on the chain side, dualized. Cohomology is forgiving: it doesn't notice that one universe is smooth and the other combinatorial.

**05. Mayer–Vietoris as a computation engine.** $H^*$ of a space built from pieces can be computed from the pieces and their intersection, via the long exact sequence

$$\cdots \to H^{k-1}(U \cap V) \to H^k(U \cup V) \to H^k(U) \oplus H^k(V) \to H^k(U \cap V) \to \cdots$$

The point of this essay: this is not just a theorem, it is an *algorithm*. The figure is an animated cover of $T^2$ by two pieces ($U$ = a punctured torus, $V$ = a disk around the puncture); reader steps through the long exact sequence, seeing each map computed on actual basis cocycles from explainer 02. A "swap target" dropdown does the same for $S^2$, $\mathbb{RP}^2$, and Klein bottle. The sheaf flavor is named but not formalised: a cover is the data of a Čech 0-cochain valued in subspaces; Mayer–Vietoris is what happens when you push that through cohomology. Closing: Čech and singular agree under mild hypotheses. The recursion is the same shape as the Vietoris–Rips construction in TDA, only the boundary maps run in the other direction.

**06. Persistent cohomology and circular coordinates.** Persistent homology lives in the TDA series; persistent cohomology is its dual, and it computes something the homology side cannot easily: *coordinates*. A persistent $H^1$ class on a filtration of a point cloud sampled from a circle gives a literal map "angle around the circle" out of the data (de Silva–Vejdemo-Johansson 2009). The figure is the **dual barcode**: bars run from death to birth (left-to-right reversed from the homology side), each bar colored by dimension. Reader picks a long $H^1$ bar; a side panel shows a 1-cocycle representative; a third panel displays the cocycle's integration $\theta : \text{points} \to S^1$ as a hue around the sample points. The historical anchor: the cocycle algorithm of Morozov–Bauer–de Silva. Closing meditation: cohomology was the "dualize the chain complex" pass once; now it has six handles — Euler-class obstruction, singular ring, cup product, de Rham, Mayer–Vietoris, persistent. The series ends with a small zoo: a sphere, a torus, $\mathbb{RP}^2$, an annulus, a figure-eight, each with its full cohomology ring named and its persistent dual computed live.

## Dependencies

1. **TDA series** is the soft prerequisite. Explainers 01–05 of TDA cover simplicial complexes and homology over $\mathbb{Z}/2$; cohomology dualizes that. Cohomology 01 cross-references TDA 03 ("we built $\partial$; now take its transpose"). The lib reuse is the structural form of this dependency.
2. **No hard prerequisites** beyond linear algebra (rank, kernel, image over $\mathbb{Z}/2$).
3. **Library dependency:** `coh-math.js` loads after `tda-math.js`. Cochain groups are the duals of `TDA.boundary`; cup product is implemented in `coh-math.js` itself; persistent cohomology calls back into `TDA.persistence` after dualization.
4. **Optional cross-references:** squishy-thing/research/36-octonionic-projective-plane (the OP² cohomology ring as a closing companion fact in essay 03); moonshine/docs/mathematical-diagrams/18-spectral-sequence-charts (sequel direction, not in scope).

## What this series will not do

- **Sheaf cohomology** as derived functors. Mayer–Vietoris is the sheaf flavor we ship; Čech-via-resolutions is named but not developed. (The `microlocal-sheaf` idea in asterism/ideas.md is the right home for that, if it graduates.)
- **Étale, crystalline, motivic cohomology.** Out of scope; the topology-first lineup picks $\mathbb{Z}/2$ singular as the spine.
- **Spectral sequences.** The Mayer–Vietoris LES is shipped; Leray–Serre and friends are sequel material. (moonshine/docs/mathematical-diagrams/18-spectral-sequence-charts is the orientation explainer for readers who want it now.)
- **Chern, Stiefel–Whitney, Pontryagin classes.** Characteristic classes are the *next* series; we point to them in essay 06's closing zoo.
- **Hodge theory and harmonic forms.** Named once in essay 04, not developed.
- **Group cohomology** as a standalone construction. Touched only as "the cup product on $K(\pi,1)$" if at all.
- **Equivariant, orbifold, and Floer cohomology.** Out of scope.
- **Software tutorials.** No GUDHI / Ripser / Macaulay2 walkthroughs.

## Files

```
plans/cohomology/
  README.md                    (this file — the locked spine)
  AGENTS.md                    (rules for parallel agents)
  CLAIMS.md                    (one-page claim table)
  briefs/
    01-from-holes-to-obstructions.md
    02-singular-cohomology-torus.md
    03-cup-product-rp2-t2.md
    04-de-rham-sphere.md
    05-mayer-vietoris.md
    06-persistent-cohomology.md

docs/cohomology/
  lib/
    coh-math.js                (cochain complex, cup product, MV, dual persistence)
    test.html                  (in-browser sanity checks — to be added)
  index.html                   (series landing page)
  01-from-holes-to-obstructions.html
  02-singular-cohomology-torus.html
  03-cup-product-rp2-t2.html
  04-de-rham-sphere.html
  05-mayer-vietoris.html
  06-persistent-cohomology.html
```
