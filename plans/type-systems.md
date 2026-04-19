# Type Systems for Simulation — 12 Explainers

Twelve interactive explorations arguing *programs have geometry*. Types as a design language for simulation, with every signature rendered as an animated diagram and the state space of a well-typed simulation revealed, in the end, as a root system whose Weyl group is shared by simulations scattered throughout the series.

A second throughline runs under the first: **a simulation is a lattice and a group**. The lattice is the discrete substrate on which state evolves — a hexagonal Bravais lattice, a contact graph, a 1D track, a quadtree over continuous positions, a hypercubic spacetime. The group is the structure that acts on it — a point group like <em>C₆ᵥ</em>, a graph automorphism group, a cyclic species permutation <em>Z₃</em>, a Lie group action <em>SO(2)</em>, a finite reflection (Weyl) group. Together they determine what the simulation can express, what invariants survive discretization, and which macroscopic phenomena — isotropic hydrodynamics, universality classes, conservation laws, spontaneous symmetry breaking — are available to it. The type of a well-posed simulation names both. The Curry-Howard reading of the type as a proposition and the Calculus of Inductive Constructions' mechanical check of equivariance (the commuting square <code>step · apply_sym w ≡ apply_sym w · step</code>) remain the verification mechanism, but the structure the series makes visible is the lattice and the group.

## Context

- **Audience.** Readers who can read TypeScript type annotations and are comfortable with the words "sum type" and "product type." No Haskell fluency required; Haskell-ish syntax is labeled on first encounter and carried by the diagrams, not the prose.
- **Quality target.** SPH-standard. Reserved-atomic-type palette, Haskell-ish syntax for data, TypeScript as the runnable reality. Every §2 signature diagram animates; every product box is a live instance of data, not a schema.
- **Output.** `docs/type-systems/01-force-directed-graph.html` through `12-root-systems.html`, numbered. Plus `docs/type-systems/index.html` with a placeholder sim-inheritance DAG and a four-family-colored card list.
- **Index card copy.** See `docs/type-systems/index.html`. Cards are grouped implicitly by family color (force, dynamics, info, polymorphism, pivot, payoff).
- **Status.** 12/12 shipped 2026-04-18. Two forge explainers (#1, #2) retrofitted with type-data integration and had their bare §1 cold sim removed. Formal-verification / equivariance pass completed 2026-04-18 — six explainers (#2, #4, #5, #7, #9, #12) gained new structural interactives and every explainer gained prose tying it to the commuting-diagram throughline.

## Thesis stack

- **Primary.** Programs have geometry. The state space of a well-typed simulation is a mathematical object you can visualize.
- **Method.** Types as a design language. Every signature renders as an animated diagram; every atomic type has a reserved color.
- **Ratchet.** Each explainer earns its type construct with an expressiveness payoff — a combinator that falls out for free, a composition that only works because the shapes line up, a symmetry that forbids whole classes of implementations.

## What was deliberately cut

- **The "untype it" concept.** An early design had §4 as a canonical live toggle that relaxed the type discipline to produce a visible bug. User feedback, 2026-04-18: buggy output is not satisfying to watch. Removed from the skeleton. Correctness-as-ratchet is now carried in prose alongside §4 "what it lets you say," not staged as a broken-sim demo. Do not propose "watch the untyped version break" figures for new explainers.

## The spine — 12 explainers

Example-first, no act structure. Fresh minimal sims tuned to each explainer's type story rather than reused from `docs/emergence/`. Each explainer climbs one rung of type expressiveness.

Family color legend for the index and #11 parcoords:
- **force** (blue): #1–#3 — atomic geometry, composition
- **dynamics** (red): #4–#7 — state, invariants, laws
- **info** (purple): #8–#9 — effects, shape
- **polymorphism** (amber): #10 — trait contracts
- **pivot** (#11), **payoff** (#12)

1. **Force-Directed Graph Layout** — phantom types, units, branded IDs. The forge: first signature diagram, palette introduced, shared lib born.
2. **Boids** — newtyped Position/Velocity/Force. Rule combinators; the scene graph's monoid falls out.
3. **Springs and Constraints** — sum types. `Constraint = Spring | Anchor | Distance` sharing one `apply`. The scene is `[Constraint]`, the solver is a fold.
4. **Predator-Prey** — refinement types. `Pop = { p | p >= 0 }`. The axes of the phase portrait are the wall.
5. **Traffic Flow** — sum types with payloads. `Moving Speed | Braking Decel | Stopped`. The FSM diagram is the type definition.
6. **SIR on a Graph** — indexed compartments + conservation. First **sim-inheritance callback** — respecializes #1's force engine. The admissible state space is a 2-simplex.
7. **N-Body and Symplectic Integration** — phantom-tagged integrators. `Integrator Euler | Semi | Symp` with identical value signatures and different invariant guarantees. Figure-eight choreography as the payoff.
8. **Random Walks** — effect systems. `Step e = State -> e State` where `e ∈ {Det, Rand (Seed s), Rand, IO}`. Replay guarantee as a type property.
9. **Reaction-Diffusion** — shape-indexed tensor types. `Stencil k`, `Field w h`. A gallery of stencils demonstrates that shape is a compile-time witness.
10. **Fitness Landscapes and Genetic Algorithms** — typeclasses as trait contracts. `(Fitness a, Mutate a, Cross a) => step`. Same solver on 2D points, bit vectors, and English phrases.
11. **The Type Lattice as Geometry** — the pivot. Ten signatures plotted on nine-axis parallel coordinates from `lib/signatures.js`, then projected into 2D via in-browser power-iteration PCA. Signatures cluster; the cloud is not random.
12. **Root Systems as Types** — the payoff. A₂ fully interactive with Weyl group buttons, four sim-revisit tiles (3-body Lagrange, 3-species RPS, hex boids, hex RD stencil) sharing S₃ = Weyl(A₂) symmetry, and an E₈ Coxeter-plane shadow pointing at `docs/exceptional-atlas/`.

## Per-explainer skeleton (5 sections)

1. **Name the types** — Haskell-ish data block. Reader sees the type vocabulary and usually a live interactive sim that the types classify. (#1 and #2 open here; #3–#12 still open with a §1 "Cold sim" preface that should probably be trimmed if those explainers ever get the types-carry-data retrofit.)
2. **Signature diagram** — the core function rendered as colored pipes through a function box, typically via `TV.signature`. For the forge explainers (#1, #2), product boxes contain live miniatures of the sim above.
3. **What it lets you say** — expressiveness payoff. The combinator, the wall, the poset, the algebra, the FSM. Never a broken-sim bug demo.
4. **Carry-forward** — one paragraph naming what the lib gained, which later explainer reuses it, and how this signature positions on the #11 parcoords.

**Why 5 not 6:** dropped the "untype it" §4 on 2026-04-18.

## Visual design language

Reserved atomic-type palette, never shadowed across the series:

```css
:root {
  --c-position: #2563eb;  /* blue    — positions, nodes in graphs */
  --c-velocity: #d97706;  /* orange  — velocities, directions */
  --c-force:    #dc2626;  /* red     — forces, accumulated impulses */
  --c-mass:     #6b7280;  /* gray    — scalar attributes */
  --c-time:     #059669;  /* green   — time-deltas, durations */
  --c-id:       #64748b;  /* slate   — identifiers */
}
```

**Extension pool** for per-explainer atomic types: `#7c3aed` violet, `#db2777` pink, `#0891b2` teal, `#f59e0b` amber. These collide across explainers by design — scope is per-explainer, like local variables.

**Encoding conventions:**
- Sum types render as forked bands (`TV.sum`), product types as nested boxes (`TV.product`)
- Signatures render as animated pipe-diagrams with dots flowing along them
- Refinement types / invariants render as dashed walls in phase space (`TV.wall`)
- Effect capabilities render as stacked labeled pills (`TV.effectStrip`)
- Shape parameters render as bracketed tags on pipes (`TV.shapeIndex`, e.g. `[128×128]`)

## Notation

- **Primary**: colored pipe-diagrams. Not monospaced code.
- **Secondary**: Haskell-ish syntax for data types (`data Species = Prey | Predator`, `class Fitness a where ...`). Labels the diagrams; first encounter gets a one-sentence explainer in prose.
- **Tertiary**: TypeScript (or vanilla JS) as the runnable reality under every sim. If the reader opens devtools, the code they see isn't a fiction.

When a construct outruns TypeScript (refinement types, shape-indexed tensors, GADTs), the diagram extends naturally — add a wall, add a shape tag on a pipe — rather than forcing a TS hack that misrepresents the real idea.

## Shared libs

At `docs/type-systems/lib/`:

- **`typeviz.js`** — attaches `TV`. Primitives, all working:
  - `TV.palette` — the six reserved colors plus three extension slots
  - `TV.pipe({ kind, x1, y1, x2, y2 })` — colored connector with `.feed(t)` animation
  - `TV.product({ label, pipes })` — nested/paired container
  - `TV.sum({ label, variants })` — forked container with labeled bands
  - `TV.wall({ x1, y1, x2, y2, label })` — dashed boundary with predicate text
  - `TV.effectStrip({ effects })` — stacked capability tags
  - `TV.shapeIndex({ shape })` — compact `[w×h]` tag
  - `TV.signature({ inputs, output, name, tag, animate })` — spec-driven assemblage used by #10 and #12. #1–#9 hand-rolled their §2 diagrams before this helper landed and were not retrofitted.

- **`simcore.js`** — attaches `SC`. `SC.loop` (fixed-timestep rAF loop), `SC.forces` (accumulator), `SC.integrate.euler`, `SC.neighborhood.radius`, `SC.vec`. More integrators and neighborhoods can be added when later work needs them.

- **`signatures.js`** — attaches `TS_SIGNATURES`, `TS_SIGNATURE_DIMS`, `TS_SIGNATURE_DIM_META`. Authoritative ten-row data table with per-explainer `{ id, title, href, name, sig, note, dims }`. Nine dimensions per row: `arity`, `sum`, `prod`, `eff`, `shape`, `refine`, `phantom`, `invar`, `traits`. Consumed by #11.

## Accumulation principle

Simulations accumulate across the series. Every sim is built parameterizable so later explainers can respecialize instead of forking. The index page is a sim-inheritance DAG, not a flat list. `§4 Carry-forward` is allowed to be concrete about reuse, e.g. "this sim returns in #12 specialized to three bodies."

Confirmed callbacks in the shipped series:
- **#6 → #1** — SIR on a graph rebuilds #1's force layout (repulsion + linkForce + centering via `SC.forces`/`SC.integrate.euler`) with S/I/R compartment coloring.
- **#12 §5a–§5d** — four revisit tiles: 3-body equilateral Lagrange (#7), 3-species RPS (#4), hex boids (#2), hex reaction-diffusion stencil (#9). All four exhibit Weyl(A₂) symmetry.

## Types-carry-data principle

User feedback 2026-04-18: "not just the type but the data is useful. every type should show a visualization of the dataset." Every type rendering should also show a visualization of the current dataset it classifies. Type without data is a schema; type with data is a live instance.

**Pattern.** Expose the opening-section sim's live state via a top-level `SIM<N>_STATE = null;` variable (set inside the IIFE after state is created, and in any reseed handlers). Then in §2's signature-diagram IIFE, read the state each frame and draw miniature renderings inside the product boxes / beside the pipes. Throttle any O(n²) computation (e.g., per-rule mean forces in #2) to every 4–8 frames.

**Applied to:** #1 and #2 as forge exemplars. Not yet retrofitted to #3–#10. When retrofitting, the plain "§1 Cold sim" section becomes redundant (see next) and should be deleted.

## Forge-explainer restructure (#1, #2)

User feedback 2026-04-18: "the first visualization in both 1 and 2 is unnecessary, just go straight to showing the data on the graphs." The bare §1 cold sim became redundant once the §2 signature diagram showed live data inside its product boxes.

**Applied.** For #1 and #2 only, the old §1 "Cold sim" section was deleted and the old §2 "Name the types" (hover-reveal) promoted to §1. Remaining sections renumbered. #1's hover-reveal sim scaled up from 14 to 30 nodes with the full `#1` force physics. `SIM<N>_STATE` population moved into the new §1 IIFE.

**Not applied yet.** #3–#12 still open with a §1 "Cold sim" preface. Apply this restructure only after landing the types-carry-data retrofit on the respective explainer, so there's a live type-data view to open with.

## Interaction conventions

- Signature hover pins the full type to a side panel for comparison across explainers (used in #11 parcoords).
- Controls (pause, shuffle, overlay toggles, weight sliders) live in a consistent position below each figure.
- No canonical "untype it" toggle. Dropped.

## Design choices to preserve

- **Reader assumed between (a) TS-literate only and (b) basic FP/ADT fluency.** Haskell syntax is labeled on first encounter, not primed. Diagrams are the ground truth of meaning.
- **Hand-rolled §2 diagrams in #1–#9** are not retrofitted to `TV.signature` — they work, and touching them risks visual regression.
- **Extension palette collisions across explainers are fine** — per-explainer scope, like local variables. Only the six reserved atomic-type colors are cross-explainer stable.

## Phase state

- [x] **Phase 0** — spine, thesis, skeleton, palette, notation
- [x] **Phase 1** — #1, #2, #3 shipped; `typeviz.js` primitives 1–3 (pipe, product, sum)
- [x] **Phase 2** — #4, #5, #6 shipped in parallel; `TV.wall` landed
- [x] **Phase 3** — #7, #8, #9 shipped in parallel; `TV.effectStrip`, `TV.shapeIndex` landed
- [x] **Phase 4** — `TV.signature` + `signatures.js` data table
- [x] **Phase 5** — #10, #11, #12 shipped (polymorphism + pivot + payoff)
- [x] **Phase 6** — second-pass polish on #1/#2 (pipe animations, phantom bounce-back, per-field hover, Haskell simplification, regime indicator)
- [x] **Phase 7** — types-carry-data retrofit on #1 and #2 §2
- [x] **Phase 8** — drop bare §1 cold sim on #1 and #2
- [x] **Phase 9** — formal-verification / equivariance pass (2026-04-18)
- [x] **Phase 10** — lattice / group-theory reframe relaxing the focus on quantitative invariants (2026-04-19)

## Phase 9 — formal-verification / equivariance pass (what was added)

Prose enrichment across all 12 explainers and new structural figures in six. The throughline: each explainer climbs a rung of the commuting-diagram `step · apply_sym w ≡ apply_sym w · step`, grounded in specific physical pathologies that a non-equivariant implementation would produce (L4/L5 drift, spiral-wave collapse, grid-anisotropic Turing stripes, flock heading bias).

**Explainers that gained new interactive figures:**

- **#12** — (a) four-panel commuting-diagram interactive showing `step ∘ apply_sym` vs `apply_sym ∘ step` with a Weyl-element picker; both paths converge on the same BR panel with a check-mark. (b) Weyl-scaling bar chart (A₂ through E₈) with |W| on log scale and conjugacy-class count on linear — motivates why CIC reasons about F-conjugacy classes at E₈ rather than enumerating 696M elements.
- **#9** — side-by-side Gray-Scott with identical F, k, seed; left panel uses the anisotropic 5-point square Laplacian, right uses the isotropic 9-point stencil. Left panel's stripes grid-align; right panel's curl/branch obey the chemistry.
- **#7** — Lagrange equilateral triangle added as a selectable initial condition alongside Chenciner–Montgomery. Dashed reference triangle overlay in Lagrange mode. Euler destroys the equilateral equilibrium (bodies eject off the L4/L5 fixed points); leapfrog holds it.
- **#4** — 3-species spatial rock-paper-scissors lattice: two 120×120 panels, shared seed, shared RPS Monte-Carlo kernel. Left panel uses Z₃-equivariant pair contests (stable spirals); right panel injects a 5% "lower-label wins" bias (breaks Z₃; lattice collapses to species A).
- **#2** — square-snap vs hex-snap flock comparison. Same alignment/cohesion dynamics, but each frame the heading is rounded to the nearest of 4 cardinal or 6 hex directions. Direction-rose under each flock shows the asymmetry.
- **#5** — type-level phase-transition signature figure. Two regime-typed boxes (Free, Jammed) with regime-closed operators and a single legal crossing (`nucleate : Free → Jammed`). A refused dashed pipe shows `Γ ⊢ accelerate j : ⊥` — the Verwey-style typing judgment rendered.

**Explainers that gained prose only (new interactives not warranted):** #1, #3, #6, #8, #10, #11. Each gained one paragraph tying its §4 or §5 to the formal-verification / equivariance throughline.

**The research source.** Kai's deep-research brief (2026-04-18) on formal verification of physical symmetries via root systems and dependent type theory. Key insights absorbed:
- The commuting diagram `step · apply_sym w ≡ apply_sym w · step` as the central type-theoretic statement.
- Typing judgment `Γ ⊢ e : T` as the form of the guarantee.
- Weyl groups as finite sum types — but scale-limiting at E₈ (696M elements), requiring F-conjugacy-class reasoning.
- Specific physical failure modes: L4/L5 ejection, RPS extinction under biased sweeps, Turing stripe grid-alignment, flock axis-alignment, phase-transition operator misuse.
- Curry-Howard and the Calculus of Inductive Constructions as the machinery.

**Research not yet used.** The F-conjugacy exact sequence `1 → G° → G → C → 1` is referenced in prose but not illustrated. Could become a §5 side figure in a later pass if wanted.

## Phase 10 — lattice / group-theory reframe (what was added)

Second deep-research brief (Kai, 2026-04-19) on group theory and lattice structures across simulation paradigms. The brief spans Bravais lattices, HPP/FHP lattice gases, spatial partitioning structures (quadtree/octree/spatial hash), graph-automorphism controllability, directed-percolation universality, renormalization-group fixed points, and equivariant neural networks on continuous groups.

The move: relax the emphasis on **quantitative invariants** (ΔH, population counts, stripe angle) that Phase 9 concentrated on, and lean into **structural / group-theoretic** statements about the lattice itself, its symmetry group, its RG attractor, or its cluster morphology. The central reframe: the simulation's *type* should name the lattice's symmetry group and the topological / universality class its dynamics flow into, not just check a pointwise equivariance equation.

**Five themes, distributed across nine explainers:**

- **Theme A — lattice-as-type.** The spatial substrate is itself a type construct.
  - **#9** — Gray-Scott anisotropy comparison reframed as the HPP (square, D₄ — too small) vs FHP (hex, C₆ᵥ — correct 4th-order isotropic tensor) story. Prose grounds it in lattice gas hydrodynamics and adds a `Stencil k (PointGroup g)` type parameter.
  - **#6** — new topology-comparison figure: three SIR simulations (spatial 7×7 lattice, regular ring k=4, Barabási-Albert scale-free) with identical β, γ, patient zero. Cluster morphologies diverge — circular front, wave, hub burst — without any numerical extinction-rate plot.
  - **#11** — new Bravais-classification figure: the 5 2D lattice classes (square p4m, hex p6m, rhombic cmm, rectangular pmm, oblique p2) rendered as point tiles with their crystallographic point groups labeled. Prose frames the 9-axis signature parcoords as a projection of this canonical finite classification.

- **Theme B — algorithmic lattices.** Quadtree / octree / spatial hash as the data-structure analog of physical lattices.
  - **#1** — new §4 "Spatial index as type": side-by-side quadtree vs spatial-hash figure on the live §1 force layout. Type: `SpatialIndex a = Quadtree (BBox a) [a] | Hash (GridCell a) (CellSize s) | None [a]`. Prose ties the O(N²) → O(N log N) → O(1) collapse to translational symmetry of the underlying lattice.

- **Theme C — graph automorphism & controllability.** Phase 9's square/hex-snap figure in #2 was itself a quantitative comparison (heading-bin histograms). Replaced with a leader-follower controllability figure — two networks (symmetric hex-wheel |Aut|=12 with 2 orbits, vs perturbed with a single chord F₀-F₃, |Aut|=4 with 3 orbits). A consensus-dynamics broadcast from the leader shows orbit-equivalent followers evolving in lockstep; perturbation separates them. Type: `Graph (Aut g)`.

- **Theme D — universality classes / RG flow.** Replacing "sim conserves X to Y%" with "sim flows under coarse-graining to a universal fixed point."
  - **#5** — new RG figure: a 243-site 1D traffic lattice coarse-grained four times by block-of-3 majority (243 → 81 → 27 → 9 → 3). The attractive fixed points at ρ*=0 (free flow) and ρ*=1 (gridlock) bracket an unstable ρ_c = ½. Slider over ρ₀ shows basin reversal. Critical exponent ν ≈ 1.62 → 1.00 flow mentioned in prose.
  - **#4** — new directed-percolation phase-diagram figure: schematic (σ, λ) plane with a critical curve λ_c(σ), active and absorbing phase regions labeled. Two live 60×60 contact-process lattices (on either side of the critical curve) show cluster morphology per phase. A/B/C percentage readouts in the earlier RPS tiles replaced with qualitative regime badges (coexisting / dominance emerging / monoculture).

- **Theme E — continuous symmetry / equivariant architectures.**
  - **#10** — new §4b equivariant-GA figure: 4-panel commuting diagram for SO(2) instead of a finite Weyl group. Top row: input x and its rotation R_θ(x). Bottom row: ga(x) and ga(R_θ(x)). The lower-right panel overlays both ga(R_θ(x)) (teal dot) and R_θ(ga(x)) (violet cross). They coincide because mutation/fitness/crossover are SO(2)-invariant. Slider over θ; shared RNG seed makes the equality pointwise rather than distributional.

**Phase 9 quantitative readouts relaxed (not removed):**

- **#7** — the ΔH/|H₀| numeric readout receded: its value is still printed but small, muted, and subordinate to a new qualitative regime badge ("BOUNDED" / "DRIFTING" / "DIVERGING") that leads visually.
- **#4** — RPS count percentages removed; replaced by a single qualitative regime label per tile.
- **#9** — the 5pt-vs-9pt caption narrative shifted from "stripes align to axes" to "HPP failure mode" / "FHP recovery"; the morphology carries the story.

**Files touched in Phase 10:** #1, #2, #4, #5, #6, #7, #9, #10, #11 (code + prose); plans/type-systems.md and project memory updated. All nine files pass HTML parse and JS syntax validation. `docs/type-systems/` remains untracked in the repo.

**Themes carried forward.** The Bravais / crystallographic type lattice in #11 is the new destination the series points at; the #12 A₂ root system remains the smallest non-trivial instance of that classification. F-conjugacy classes at E₈ remain prose-only.

## Remaining polish (low priority)

- Retrofit types-carry-data to §2 of #3–#10; then drop their §1 cold sims.
- Retrofit #1–#9 §2 signature diagrams to `TV.signature` if consistency becomes more valuable than stability.
- Replace the index's placeholder sim-inheritance DAG edges with the real ones (`#6 → #1`, `#12 → {#2, #4, #7, #9}`).
- Title is still provisional "Type Systems for Simulation." No pressing reason to change.
- Lock a final tagline. Provisional: *"Programs have geometry."*
