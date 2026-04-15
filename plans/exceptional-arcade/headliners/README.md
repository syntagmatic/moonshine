# Exceptional Arcade · Track H: Headliners

The headline series of the Exceptional Arcade. Seven showcase interactives (one prequel H0 plus six principled exhibits H1–H6), each embodying one architectural principle from the E8 research report. Track H is deliberately *not* a fluency drill track — these are the marquee cabinets, the ones a visitor steps up to first.

## Why "headliners"

The existing arcade is organised as five tracks (A–E) of three fluency drills each. The drills are narrow, fast, and pedagogically cheap: every round practices one operation. The drills work, but they are not what you put on the poster.

The research report from which Track H was commissioned is a meta-document about *how* to build interactive high-dimensional media. It lists eight architectural principles — slicing sections, projection pluralism, folding isomorphisms, linear-programming proofs, deep-hole navigation, particle fusion, multi-plane rotation, density climb. Every principle is a full interactive in its own right. None of them fit the drill template.

So we give them their own track. Track H is the *exhibition wing* of the arcade: six pieces that each showcase one principle, each bigger and more ambitious than a drill, each designed to make a new visitor say "wait, what is that?" and sit down for ten minutes. The fluency drills are still where a reader builds reflexes; the headliners are where a reader sees what the reflexes are *for*.

## Reader endpoint

After walking through Track H, a reader should be able to answer, with a picture in their head for each:

- What does a slice of an 8D polytope by a 3-plane actually look like? (H1)
- Why does the 8-concentric-rings mandala of the Petrie projection look so different from the 24-cell grid of the B4 projection, if they're the same 240 points? (H2)
- How is the golden ratio hiding inside E8, and why does it have to be there? (H3)
- What does Viazovska's proof actually *do*? What is the object being tuned, and what makes it work in 8 dimensions when it wouldn't work in 7? (H4)
- When two E8 roots "interact", what decides whether they fuse, scatter, or annihilate? (H5)
- Why does the sphere-packing density curve from dimension 1 to 24 have spikes at 8 and 24 and nowhere else? (H6)

Each of these is a visual-intuition question, not an equation-manipulation question. Track H is about seeing, not drilling.

## Shape of a headliner

A headliner file is *bigger* than a drill file. Not because we pad it out — because the underlying interactive has more moving parts.

Typical headliner: 1000–1500 lines of HTML + inline JS, one big SVG or layered SVG + Canvas figure, 2–4 discrete controls (sliders, mode toggles, click-to-select lists), a written walkthrough broken into 3–5 numbered sections, and a closing "what you just saw" reflection. No scoreboard — headliners are exhibits, not games. There is no win condition; there is no clock; the reader leaves when they feel they've seen enough.

Per-file structure:

- **Header** — tag (`Track H · Headliner · Piece Hn`), title, subtitle.
- **Prereq banner** — one or two E8-series explainers that must be read first. (Every headliner assumes the narrative series is already internalised; they are not standalone introductions.)
- **Opening prose** — 1–2 paragraphs framing the principle and what the interactive will demonstrate.
- **The exhibit** — the main interactive figure. 2–4 controls at most. The figure should work on first load without any clicking, and clicking should make it obviously *better*, not merely different.
- **Walkthrough** — 3–5 numbered subsections, each pointing the reader at a specific thing to try ("now pull the slider past x = 0.5 — notice how the slice becomes a rhombicosidodecahedron").
- **Closing reflection** — "What you just saw" paragraph that connects the exhibit back to the narrative series and to whatever deeper principle the report flagged.
- **Nav footer** — link back to the arcade index, link forward to the next headliner or to the source explainer.

No scoring, no localStorage, no difficulty tiers. Those belong in the drill tracks.

## The seven pieces

### H0 · Ascent to E₈

**Principle.** Simple Lie algebras are built rank by rank. The chain A₁ → A₂ → A₃ → D₄ → D₅ → E₆ → E₇ → E₈ adds one simple root at a time, growing the Dynkin diagram by one node per step. Every root system above is a subsystem of every root system below it in the chain, and the root counts (2 → 6 → 12 → 24 → 40 → 72 → 126 → 240) tell you exactly how much the algebra gains at each step.

**Exhibit.** An animated step-through of all eight stages. At each step the Dynkin diagram grows by one node (highlighted in red), the 240-root Coxeter-plane picture gains a new constellation of lit points (the roots that just joined the sub-algebra), and the readouts show rank, algebra name, Coxeter number, and total root count. Play automatically, or scrub manually with Next / Back buttons or 8 step buttons for jump-to. The branch-outward addition order starts at α₄ so that D₄ appears correctly as the first branched diagram in step 4.

**Why it earns its spot.** Every other H-exhibit assumes you already know what E₈ is. This one shows you where E₈ *comes from* — it's the construction story, positioned at H0 as the opening movement of the series.

### H1 · Flatland Sections

**Principle.** An 8D polytope passing through 3D space appears as an evolving sequence of polyhedra. This is the Flatland perspective: a 2D being sees a passing 3D object as a growing and shrinking polygon. An 8D → 3D slice is the same thing, one step up.

**Exhibit.** The Gosset 4₂₁ sitting in ℝ⁸. A slider controls the position of a 3-dimensional "screen" along one 8D axis. As the slider moves, the display shows (a) which of the 240 roots are near the current slice level, and (b) the 3D polytope formed by taking the slice's vertices and rendering them in 3D with edges inherited from the 6,720-edge graph. At extreme slider values the slice vanishes; near the centre of the polytope, the slice is at its richest.

**Why it earns its spot.** The reader already knows the Gosset polytope has 240 vertices and 6,720 edges — but they have almost certainly never *seen* a cross-section of it. This is the "what does it actually look like as it passes by" answer.

### H2 · Projection Pluralism

**Principle.** There is no single "correct" 2D picture of E8. Every choice of projection plane throws away 6 dimensions and keeps 2, and different choices keep different symmetries. The Petrie projection keeps 30-fold; the Van Oss projection keeps H4's 600-cell structure; the B4 projection keeps 8-fold; the E6 projection keeps the 24-fold exceptional cluster. They're all pictures of the same 240 roots.

**Exhibit.** Four projection mode buttons. The 240 roots are drawn in the currently selected projection. A slider lets the reader *smoothly interpolate* between the currently selected and the previously selected projection: as the slider moves 0→1, the roots flow from one 2D picture to the next. Edges of the Gosset polytope are drawn as thin lines, so the interpolation shows the whole skeleton morphing between the two configurations.

**Why it earns its spot.** Most E8 explainers show one projection and move on. Showing four and morphing between them is how you convince a reader that no single projection is the truth — they are all partial shadows.

### H3 · Golden Fold

**Principle.** The 240 roots of E8 split into two sets of 120. Each set is a copy of the 600-cell (the H4 root system), scaled by a different factor: the first set at scale 1, the second at scale φ = (1 + √5)/2. This is the folding isomorphism E8 ≅ H4 ⊕ φH4.

**Exhibit.** A two-panel figure. Left panel: the 240 roots in the Coxeter plane projection, with the 120 inner-scale roots in blue and the 120 φ-scale roots in gold. Right panel: a 4D → 2D projection of the 600-cell, with the same 120 vertices highlighted. Clicking any root on the left lights up its partner on the right. A mode toggle "hides" one of the two 600-cells to let the reader see each one in isolation.

**Why it earns its spot.** The golden ratio inside E8 is one of the most surprising facts in all of high-dimensional geometry. Most readers meet it as a sentence; this exhibit makes it a picture.

### H4 · Viazovska's Tuner

**Principle.** The 2016 proof of E8 optimality uses a *magic function* f(x) whose properties force the lattice to be the densest possible packing. The function has two constraints: at every distance equal to the length of a non-zero lattice vector, f(x) ≤ 0, and at every point in frequency space, f̂(x) ≥ 0. If such a function exists and satisfies both constraints simultaneously, Cohn–Elkies LP bounds imply density is maximised by E8.

**Exhibit.** A simplified 1D model of the Viazovska construction. Two line plots stacked: f(r) on top, f̂(k) below. The reader has three sliders controlling three modular-form coefficients a, b, c. As the reader adjusts the sliders, both plots update live. Red dots on the top plot mark the E8 lattice distances (√2, √4, √6, √8, ...); green dots on the bottom plot mark the dual lattice distances. The reader's goal is to find a slider configuration where every red dot sits at or below f(r) = 0 and every green dot sits at or above f̂(k) = 0.

**Why it earns its spot.** The reader has seen the number "2016: Viazovska proves E8 is optimal" in every E8 article they've ever read. They almost certainly do not know what the proof actually tunes. This exhibit gives them a toy version of the tuning problem and lets them fail at it a few times before they believe the result.

### H5 · Particle Fusion

**Principle.** Garrett Lisi's "Exceptionally Simple Theory of Everything" reads the 240 roots of E8 as particles. When two particles interact, you add their roots: if the sum is also a root, the interaction produced a third particle; if the sum is *not* a root, nothing happens. The fusion rules of the root system become a particle-physics vertex table.

**Exhibit.** A two-column interface. Left column: the 240 roots as a selectable grid, colour-coded by "generation" (the root's squared length and position). The reader picks a root by clicking. Right column: a second root grid, same layout. Middle: when both are picked, the display computes r₁ + r₂, tests whether it's in the root set, and — if yes — names it and colours the result root, with an animated beam from r₁ through the origin to r₂ and out to the sum. If no, a dotted line shows where r₁ + r₂ would be and a note reads "not a root: scattered." A counter tracks "total fusions found" so a curious reader can try to enumerate them.

**Why it earns its spot.** Root addition is a trivial operation mathematically, but its *pattern* — which pairs fuse, which don't — is the hidden skeleton of every Lie-algebra interaction table. Seeing the pattern as a physics-style reaction table makes the underlying combinatorics visceral.

### H6 · Density Climb

**Principle.** Sphere-packing density doesn't increase monotonically with dimension. The densest 1D packing has density 1, 2D hexagonal has 0.907, 3D FCC has 0.740, and the curve slides downward — until dimension 8, where E8 spikes back up relative to its neighbours, and dimension 24, where the Leech lattice spikes again. These are the only two dimensions where a genuinely exceptional lattice beats the best "reasonable" lattice.

**Exhibit.** A line plot of the best-known sphere-packing density for each dimension from 1 to 24. The x-axis is dimension; the y-axis is density. The curve for "best known lattice" is drawn in solid blue; the curve for "cubic ℤⁿ" is drawn as a dashed reference in grey. Clicking on any dimension opens a side panel naming the lattice, giving the density formula, and — for 2, 3, 4, 8, and 24 — a small schematic of the packing. The 8 and 24 markers are highlighted in red.

**Why it earns its spot.** The reader has probably been told that E8 is the densest packing in 8D, and left wondering "densest compared to what?". This exhibit answers that question: densest compared to *every other dimension's densest*, and spectacularly so.

## Libraries

Most headliners need helpers beyond what `lib/e8-math.js` currently exposes. We add them to the same file (not a separate file) so the arcade stays self-contained. Specifically:

- `E8.polytope.edges()` — the 6,720 edge pairs of the Gosset 4₂₁, pre-computed from pairwise distance √2. Needed by H1, H2.
- `E8.project.toVanOss(v)` / `toB4(v)` / `toE6(v)` — alternative projection bases. Needed by H2.
- `E8.fold.h4Halves()` — the split of the 240 roots into two copies of the 600-cell. Needed by H3.
- `E8.fusion.table()` / `E8.fusion.sum(i, j)` — pre-computed "does root i + root j land on another root" lookup. Needed by H5.
- `E8.density.curve()` — best-known packing densities 1..24. Needed by H6.

These helpers are added *as the headliners need them*, not all upfront.

## Phase state

- [x] **Phase 0** — write this plan
- [x] **Phase 1** — add Track H to the arcade index, build H1 (Flatland Sections)
- [x] **Phase 2** — build H2 (Projection Pluralism), H3 (Golden Fold)
- [x] **Phase 3** — build H4 (Viazovska's Tuner), H5 (Particle Fusion)
- [x] **Phase 4** — build H6 (Density Climb) and complete audit pass
- [ ] **Phase 5 (future)** — optional: more exhibits from the report's remaining principles (multi-plane rotation, Clifford unfolding, genome/music isomorphisms). These live in a notional Track J and are not planned for the first release.

## Files

```
plans/exceptional-arcade/headliners/
  README.md                              (this file)

docs/exceptional-arcade/
  H1-flatland-sections.html
  H2-projection-pluralism.html
  H3-golden-fold.html
  H4-viazovska-tuner.html
  H5-particle-fusion.html
  H6-density-climb.html
  index.html                             (updated to show Track H)
  lib/
    e8-math.js                           (extended with polytope edges, projections, fold, fusion, density)
```

## What Track H will not do

- **Teach the basics.** A reader who doesn't know what the 240 roots are belongs in the narrative series, not here.
- **Drill.** No clock, no score, no high-score table. Fluency practice belongs in Tracks A–E.
- **Cover every principle from the report.** The report lists more than six ideas; we pick six that are (a) visually striking, (b) buildable in D3 + SVG + Canvas without a 3D engine, and (c) non-overlapping with the existing drill tracks. "Multi-plane rotation" and "Clifford-algebra unfolding" from the report are both good principles and neither fits the template — they live in a notional Track J someday, not here.
- **Pretend to be interactive proofs.** H4 (Viazovska's Tuner) is a *toy model* of the LP bound, not the real proof. We're honest about that in the piece itself.
