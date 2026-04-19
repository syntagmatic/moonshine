# Monstrous Moonshine

"The most incredible coincidence in mathematics" and its eventual explanation. Ten interactive explainers from John McKay's 1978 observation that 196884 = 196883 + 1 to Richard Borcherds' 1992 proof that the coincidence was no coincidence, with the Monster simple group, the j-function, the Leech lattice, and vertex operator algebras meeting at the centre.

## Locked plan

**Spine.** The moonshine story is famously told in three acts: the observation (McKay, Thompson, Conway, Norton — late 1970s), the structural explanation via vertex operator algebras (Frenkel–Lepowsky–Meurman, 1988), and the proof (Borcherds, 1992; Fields Medal 1998). We follow that historical arc exactly, because it is also the pedagogical arc: each act answers a question the previous act raised. Act I shows the reader the coincidence and accumulates enough supporting structure to frame it as a mystery. Act II introduces the machinery — modular forms, Monster characters, VOAs — that reformulates the mystery as a specific, testable conjecture. Act III explains Borcherds' actual proof strategy (the Monster Lie algebra, the no-ghost theorem, denominator identities) and points forward to the many moonshines discovered since.

**Reader endpoint.** After this series, a reader should be able to state what the moonshine conjecture was (in Conway–Norton's 1979 form), sketch why the 196883/196884 coincidence is not a coincidence, recognise what a vertex operator algebra <em>is for</em> even if they cannot compute with one, and explain Borcherds' proof strategy in a single paragraph. They will also see the E8/Leech/Monster "trinity" of exceptional lattices-and-groups in one unified picture, which retroactively justifies the effort spent on E8 in the `e8-lattice` series.

**Identity.** Slug `monstrous-moonshine`, title *Monstrous Moonshine*, tagline *"How the largest sporadic simple group talks to a classical modular function, and what the conversation tells us."* Visual register: reverent without being mystical, historical narrative alongside live mathematics, first-person-plural voice. 740px article width and the same font stack as `e8-lattice`.

**Shape.** Three acts, ten explainers total (4 + 2 + 4). Acts are named after the question they answer:

- **Act I: The Coincidence** (4 explainers). What did McKay notice, and why did anyone take it seriously? Introduces the j-function, the Monster (with its character table), and the Conway–Norton conjecture.
- **Act II: The Structural Bridge** (2 explainers). E₈ and the Leech lattice as geometric engines, the E₈ → Leech → Monster bridge, and the graded-module formalism that turns "coincidence" into a precise specification.
- **Act III: The Proof** (4 explainers). VOAs, the moonshine module V♮, Borcherds' generalised Kac–Moody algebras and the Monster Lie algebra, and the denominator-identity argument that finishes the proof. The last explainer zooms out to the post-1992 moonshine landscape.

**Per-explainer shape.** 400–700 lines. Each explainer follows the moonshine-series template: a 1–2 paragraph historical framing, a mathematical section with KaTeX and at least one interactive figure, a "watch for this" insight box, and a closing reflection that sets up the next piece. Figures favour q-expansions, cycle diagrams, modular-domain visualisations, and small character tables — all D3-renderable in SVG.

**Rendering stack.** D3 v7 + SVG + KaTeX, same as `e8-lattice` and the `exceptional-arcade` exhibits. No build step, no external data files, no server calls. A new `lib/moonshine-math.js` will hold the j-function q-series coefficients, Monster character data as a small JSON table, and helpers for drawing the modular fundamental domain.

## Phase state

- [x] **Phase 0** — write this spine
- [x] **Phase 0.5** — absorb deep-research results and fill in per-explainer descriptions
- [x] **Phase 1** — build `lib/moonshine-math.js` + Act I (5 explainers)
- [x] **Phase 2** — Act II (5 explainers)
- [x] **Phase 3** — Act III (5 explainers)
- [x] **Phase 4** — audit pass, cross-series links, SPH standard sweep

## Explainer list

Ten explainers in three acts (4 + 2 + 4), compressed from the original 15 by merging overlapping or thin articles.

### Act I · The Coincidence (4 explainers)

**01. The Modular j-Function.** q-expansion, SL₂(ℤ) invariance, Hardy–Ramanujan growth, Ramanujan constant.

**02. Phase Portrait and Hyperbolic Tessellation.** Domain colouring, Escher-like SL₂(ℤ) tessellation, interactive Poincaré viewer.

**03. The Monster Group and Its Character Table.** (Merged from original 03 + 04.) The Monster as largest sporadic group, Griess construction, prime factorisation, Ogg's Jack Daniel's problem, 194 irreps, dimension browser, twin anomaly χ₁₇₉ = χ₁₈₀, irrep vs j-coefficient comparison chart.

**04. McKay's Coincidence.** 196884 = 1 + 196883, Thompson's extension, Conway–Norton conjecture, Hauptmodul constraint, interactive decomposer.

### Act II · The Structural Bridge (2 explainers)

**05. E₈, the Leech Lattice, and the Coxeter Projection.** (Merged from original 06 + 07 + 08.) E₈ definition and Dynkin diagram, Leech lattice facts and shell table, Conway groups, Coxeter-plane ring projection, E₈³ deep hole schematic.

**06. The Bridge and the Moonshine Specification.** (Merged from original 09 + 10.) Four-step E₈ → Leech → Monster bridge via triality and Miyamoto bijection, graded vector spaces, graded traces, Conway–Norton wish list (V₋₁ = ℂ, V₀ = 0), the missing 744.

### Act III · The Proof (4 explainers)

**07. Vertex Operator Algebras.** VOA axioms, vertex operators Y(v,z), Virasoro algebra, central charge.

**08. The Moonshine Module V♮.** FLM 1988, Leech orbifold construction, graded dimension j(τ) − 744, Aut(V♮) = 𝕄.

**09. Borcherds' Algebras and the Monster Lie Algebra.** (Merged from original 13 + 14.) GKM algebras and imaginary simple roots, denominator formula, root-type interactive, no-ghost theorem, Monster Lie algebra 𝔪, Koike–Norton–Zagier identity and product explorer.

**10. Borcherds' Proof, and What Came After.** Twisted denominator identities, replication formulas, finite check, Fields Medal 1998, Umbral/Mathieu/O'Nan moonshine landscape.

## Dependencies

1. **`e8-lattice` series is a soft prerequisite.** A reader who has completed it will find Act I's Leech lattice explainer much easier. We link to specific e8-lattice explainers rather than re-teaching.
2. **The planned `modular-forms` series (if built) would be a perfect prerequisite.** If it doesn't exist yet, Act II explainer 6 has to introduce modular forms from scratch — budget extra length there.
3. **The `lie-algebras` series is a soft prerequisite for Act III** (Monster Lie algebra, generalised Kac–Moody). If that series isn't built, Act III explainer 11 has to introduce generalised Kac–Moody algebras from scratch — again budget extra length.
4. **No library dependencies beyond `moonshine-math.js` and the usual D3 + KaTeX stack.** Monster character data is small enough to ship as inline JSON.

## What this series will not do

- **Teach finite group theory from scratch.** The reader is assumed to know what a group is. "Simple" and "representation" are introduced on a need-to-know basis.
- **Derive VOAs in complete detail.** VOAs are a deep topic. We give enough intuition to make Act II explainer 9 meaningful; we do not teach the reader to compute OPE coefficients.
- **Cover umbral moonshine in depth.** It gets one paragraph at the end of Act III and a pointer to the literature.
- **Get into conformal field theory physics.** The no-ghost theorem is motivated as "a theorem Borcherds needed", not as a topic in its own right.
- **Re-prove the Monster's simplicity or its classification as a sporadic group.** Those facts are stated and used; their proofs belong in a finite-group-theory series.
- **Survey the open moonshine conjectures.** One paragraph each, max. The series is about what is known, not what is not.

## Files

```
plans/monstrous-moonshine/
  README.md                              (this file)
  research/                              (populated from the user's deep research pass)

docs/monstrous-moonshine/
  lib/
    moonshine-math.js                    (j-function q-series, Monster character table, domain helpers)
    test.html                            (in-browser sanity checks)
  index.html                             (series landing page)
  01-the-j-function.html
  02-phase-portrait-and-tessellation.html
  03-the-monster-group.html              (merged 03+04)
  04-mckay-coincidence.html
  05-lattices-e8-and-leech.html          (merged 06+07+08)
  06-the-bridge-and-moonshine-specification.html  (merged 09+10)
  07-vertex-operator-algebras.html
  08-the-moonshine-module.html
  09-borcherds-algebras-and-the-monster-lie-algebra.html  (merged 13+14)
  10-borcherds-proof-and-beyond.html
```
