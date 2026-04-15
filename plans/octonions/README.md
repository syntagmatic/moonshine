# The Last Algebra: A Tour of the Octonions

Fifteen-part interactive series on the octonions, non-associativity, and the exceptional structures of the 8th dimension.

## Locked plan

**Spine.** The octonions as a concrete algebraic object you can compute with. Not just abstract algebra theory; focused on the specific 8-coordinate multiplication rules and their geometric consequences. Reader endpoint: algebraic fluency + computational fluency + historical context.

**Identity.** Slug `octonions`, title *The Last Algebra: A Tour of the Octonions*, first-person-plural voice.

**Relationship to existing coverage.** Complementary to the `e8-lattice` series. Where E8 focuses on the *lattice* (vectors in space), Octonions focus on the *multiplication* (numbers with direction). Together they provide the complete picture of 8-dimensional exceptional geometry.

**Shape.** Three acts, 15 explainers.

- **Act I — The Descent from Order (4):** Numbers as directions (R, C) → Hamilton’s bridge (Quaternions H) → The doubling recipe (Cayley-Dickson) → The Fano Plane navigator.
- **Act II — The Octonion Cliff (7):** The loss of association (ab)c ≠ a(bc) → Hurwitz’s Theorem (the 8D limit) → 7D cross products → The G2 symmetry group → Triality and spinors → Moufang loops → The seven-sphere S⁷.
- **Act III — The Magic Square (4):** The Cayley Plane OP² → Jordan algebras (27 dimensions) → Freudenthal’s Magic Square → Octonions in the wild (physics vignettes).

**Per-explainer shape.** 1000–1600 lines depending on complexity. 4–8 interactive figures each. "Mission-based" interactives (games/challenges) instead of just sandboxes. KaTeX for all math.

**Rendering stack.** D3 + SVG + KaTeX. Canvas only where performance demands it (G2 rotations). No three.js, no WebGL, no build step.

**Shared lib:** `docs/octonions/lib/oct-math.js` and `docs/octonions/lib/oct-viz.js`. Single `OCT` global.

**Canonical coordinates.** Standard e₀–e₇ basis (e₀ as the real unit). Multiplicative structure defined by the Fano Plane (1,2,3) cycle: e₁e₂ = e₃.

## Phase state

- [ ] **Phase 0** — write 15 briefs + `oct-math.js` stub
- [ ] **Phase 1** — build Act I (4 explainers), flesh out `oct-math.js`, create `oct-viz.js`
- [ ] **Phase 2** — build Act II (7 explainers), extend lib for G2 and S⁷
- [ ] **Phase 3** — build Act III (4 explainers)
- [ ] **Phase 4** — series index, cross-refs, audit sweep

## Files

```
plans/octonions/
  README.md                            (this file)
  briefs/
    01-numbers-with-direction.md
    02-hamiltons-bridge.md
    03-the-cayley-dickson-recipe.md
    ...
docs/octonions/
  lib/
    oct-math.js
    oct-viz.js
  index.html
  01-numbers-with-direction.html
  ...
```
