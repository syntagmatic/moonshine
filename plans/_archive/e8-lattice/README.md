# E8 and the Shape of 8 Dimensions

Fifteen-part interactive series on the E8 lattice, its structure, and its reach.

## Locked plan

**Spine.** E8 as a concrete geometric object you can compute with. Not applications-led, not rep-theory-led. Reader endpoint: geometric fluency + computational fluency + cultural fluency. No Lie-algebra rep theory; acknowledged as a gap in #15.

**Identity.** Slug `e8-lattice`, title *E8 and the Shape of 8 Dimensions*, first-person-plural voice matching the SPH-audited parallel-coordinates register.

**Relationship to existing coverage.** Orthogonal lens to the parallel-coords mini-arc (`18`–`22` in `docs/parallel-coordinates/`). Different visualization idiom, different hands-on treatment, different narrative. Post-series, we revisit the parallel-coords treatment for improvement.

**Shape.** Three acts, 15 explainers.

- **Act I — Meeting E8 (4):** lattices & kissing numbers in 2D/3D → D_n family dimension-climbing → meet the 240 roots with coordinate workbench → the Dynkin diagram.
- **Act II — Exploring the structure (8):** Weyl reflections → Gosset polytope 4₂₁ → subsystems as peeling → Coxeter plane → projection pluralism → from roots to lattice (D₈⁺) → kissing number 240 → Viazovska's optimal packing.
- **Act III — E8 in the wider world (3):** the Leech lattice as E8's bigger sibling → E8 as an error-correcting code (Hamming → E8 via Construction A) → capstone.

**Per-explainer shape.** 1200–1800 lines depending on content density. 3–9 figures each. Moderate math rigor ("show then claim"). KaTeX for expressions. Proof sketches where they fit, narrative where they don't. Never fake rigor.

**Rendering stack.** D3 + SVG + KaTeX default. 2D canvas with manual projection math only where 3D depth is load-bearing (#1 FCC kissing, #6 Gosset polytope, #9 projection pluralism). No three.js, no WebGL, no build step.

**Shared lib** (breaks the standalone idiom, deliberately): `docs/e8-lattice/lib/e8-math.js` and `docs/e8-lattice/lib/e8-viz.js`. Both attach to a single `E8` global. Loaded via plain `<script src>`. Figure-specific code stays inline per explainer.

**Canonical coordinates.** Standard 8D form (112 integer + 128 half-integer, even minus count, squared length 2). D₈⁺ form as derived view in #10. Simple-root basis as derived view in #4 and #5. Bourbaki simple-root ordering frozen in `E8.simpleRoots`. Octonions skipped except a paragraph in #15.

## Phase state

- [x] **Phase 0** — write 15 briefs + `e8-math.js` stub
- [x] **Phase 1** — grill the briefs, revise #09/#12/#13/#14
- [x] **Phase 2** — build Act I (4 explainers), flesh out `e8-math.js`, create `e8-viz.js`, add `lib/test.html`
- [x] **Phase 3** — build Act II (8 explainers), extend lib for Weyl/Coxeter/lattice/subsystems
- [x] **Phase 4** — build Act III (3 explainers)
- [x] **Phase 5** — series index, cross-refs, root `docs/index.html` entry, audit sweep

## Files

```
plans/e8-lattice/
  README.md                            (this file)
  briefs/
    01-lattices-and-kissing-numbers.md
    02-climbing-dimensions-d-n.md
    03-meet-e8-240-roots.md
    04-the-dynkin-diagram.md
    05-weyl-reflections.md
    06-the-gosset-polytope.md
    07-subsystems-as-peeling.md
    08-the-coxeter-plane.md
    09-projection-pluralism.md
    10-from-roots-to-lattice.md
    11-kissing-number-240.md
    12-viazovska-and-optimal-packing.md
    13-the-leech-lattice.md
    14-lattices-and-codes.md
    15-e8-out-in-the-world.md

docs/e8-lattice/
  lib/
    e8-math.js                         (stubbed in Phase 0, fleshed out in Phase 2)
    e8-viz.js                          (created in Phase 2)
    test.html                          (created in Phase 2 for in-browser sanity checks)
  01-lattices-and-kissing-numbers.html (built in Phase 2)
  ... (14 more explainer files built in Phases 2–4)
  index.html                           (built in Phase 5)
```

## Brief template

Each brief should be ~250–400 words with the following sections:

- **Pitch** — 3 sentences: what it covers, what makes it click, what the reader leaves with.
- **Figures** — one line per figure, numbered, interactive/static noted. Aim for 3–9.
- **Key formulas / constructions** — KaTeX-ready math the explainer will display, in plain form.
- **Dependencies** — which earlier explainers it leans on, which `E8.*` lib functions it needs.
- **Reader takeaway** — what the reader can do/say/recognize that they couldn't before.
