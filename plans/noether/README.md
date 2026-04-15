# Invariance: The Mathematics of Emmy Noether

Fifteen-part interactive series on Noether's work, its reach across physics and mathematics, and the idea of invariance that ties it all together.

## Locked plan

**Spine.** Invariance as the organizing principle of modern math and physics — and the career that taught everyone to see it. The reader meets Noether through her apprenticeship in invariant theory, watches her first theorem turn symmetry into conservation law in worked physics examples, then crosses into her algebraic revolution where chain conditions and finitely generated ideals reshape the foundations of commutative algebra. Reader endpoint: fluency with Noether's theorems on small examples + fluency with Noetherian reasoning on small examples + historical context for why these two legacies are one instinct seen twice.

**Identity.** Slug `noether`, title *Invariance: The Mathematics of Emmy Noether*, first-person-plural voice matching the SPH-audited register used across parallel-coordinates, e8-lattice, and octonions.

**Relationship to existing coverage.** Orthogonal to e8-lattice and octonions: those series study specific exceptional objects, while this one studies the principle (invariance under group action) that e8 and the octonions are two concrete instances of. Act I introduces invariant theory in a form that could later connect back to E8's Weyl reflections. Light cross-references, no prerequisites.

**Shape.** Three acts, 15 explainers, 5/5/5.

- **Act I — The principle of invariance (5):** what an invariant is under group action → Noether's thesis workshop (binary forms) → the action principle and Euler-Lagrange → symmetries of a Lagrangian → Noether's first theorem in pictures.
- **Act II — Conservation laws from symmetry (5):** time translation → energy; space translation and rotation → momentum and angular momentum; Kepler's hidden SO(4) symmetry; U(1) phase → electric charge; Noether's second theorem and the subtlety of energy in GR.
- **Act III — The algebraic revolution (5):** ideals as the new primes; Noetherian rings and the ascending chain condition; Hilbert's basis theorem; Noether normalization; legacy (Gröbner, algebraic geometry, equivariant ML, homology groups).

**Per-explainer shape.** 1200–1800 lines depending on content density. 3–8 figures each, mostly interactive. Moderate math rigor ("show then claim"). KaTeX for expressions. Proof sketches where they fit; narrative where they don't. Never fake rigor.

**Rendering stack.** D3 + SVG + KaTeX default. Canvas only where dense particle systems or real-time ODE integration demand it (#3 least-action path bundle, #6 pendulum phase space, #8 Kepler orbit). No three.js, no WebGL, no build step.

**Shared lib** (breaks the standalone idiom, deliberately): `docs/noether/lib/noether-math.js` and `docs/noether/lib/noether-viz.js`. Both attach to a single `NOETHER` global. Loaded via plain `<script src>`. Figure-specific code stays inline per explainer.

**Canonical conventions.**
- Group actions as left actions, written `g · x`.
- Lagrangians as `L(q, qdot, t)`, action `S[q] = ∫ L dt`, Euler-Lagrange as `d/dt(∂L/∂qdot) − ∂L/∂q = 0`.
- Symmetry parameter `ε`, infinitesimal generator `X`; quasi-symmetry boundary piece `F`.
- Conserved current `Q = (∂L/∂qdot) · X − F` for a strict or quasi-symmetry; `H = qdot · (∂L/∂qdot) − L` for time translation.
- Rings denoted `R`, ideals as `I, J` (Fraktur reserved for display math in explainers).
- Canonical failing ring `ℤ[√−5]` for the unique-factorization collapse in #11.
- Canonical polynomial ring `k[x₁, …, xₙ]` with `k = ℝ` or `ℚ` for Acts III small examples.

**Gaps acknowledged.** We skip Brauer-Hasse-Noether (central simple algebras — too specialized), detailed representation theory of finite groups, non-commutative ring theory beyond the chain-condition framing, and the full general-relativity energy pseudo-tensor story (touched in #10, not dwelt on). We do not re-derive Euler-Lagrange in full generality — #3 treats it operationally with a pointer to standard references.

## Phase state

- [x] **Phase 0** — wrote 15 briefs (300–700 words each, ~8.2k words total)
- [x] **Phase 1** — grilled the briefs; 12 issues flagged and fixed across #02, #03, #04, #05, #06, #07, #08, #09, #10, #12, #15 (sign error on pendulum δL, extra ℏ on Schrödinger density, brachistochrone-vs-Hamilton framing, LRL as velocity-dependent symmetry, rotation-symmetry figure replaced to use central potential instead of pendulum, Hilbert-theorem precision, Alexandroff-Hopf wording, etc.)
- [x] **Phase 2** — Act I built: 5 explainers + `noether-math.js` (484 lines, 41 library tests passing) + `noether-viz.js` (153 lines) + `lib/test.html`. All HTML parses cleanly and loads 200. Figure 2 of #01 has animated D₄ rotations/reflections via parameterized SVG matrices.
- [x] **Phase 3** — Act II built: 5 explainers (#06–#10) + lib extensions (`systems.centralForce2D`, `systems.kepler` with LRL helper, `noether.currentVec`, `noether.hamiltonianVec`). Verified: Kepler energy/Lz/LRL conserved on elliptic orbit; free-2D momentum/Hamiltonian formulas match analytical values.
- [x] **Phase 4** — Act III built: 5 explainers (#11–#15) + lib extensions (`rings.ZsqrtM5`, `rings.polyUni`, `rings.polyMulti` with full term arithmetic + lex order, `grobner.{sPolynomial, reduce, buchberger}`, `topology.simplicialRanks`). Verified: Z[√−5] norm/multiplication recovers both factorizations of 6; Buchberger on (x²−y, xy−1) terminates with a 4-element basis containing y³−1; simplicial-complex H₀/H₁ ranks correct on hollow/filled triangle and figure-8.
- [x] **Phase 5** — series index (`docs/noether/index.html`) + root `docs/index.html` Math-section entry with `noether` thumb factory. Cross-reference pass: #02's Gordan footnote and #13's Gordan lament now link to each other; Act II's "explainer 5" mentions (#06, #07, #08) hyperlink to #05; #05 links forward to #06/#07/#08/#09/#10; #12 links back to #11; #15 vignettes link to #01/#02 (equivariance), #12 (termination), and #13 (Hilbert basis). Audit: all 15 files have balanced script blocks; every `id="math-…"` has a matching `math()` or `fill()` call (per-file diff clean); no `<img>` references; mobile breakpoints on every file; Buchberger and LRL numerics re-verified (LRL drift 9.8e-12 over 12.5 s of integration).

## Implementation log

**Phase 0 (briefs).** Written in a single batch, ~8200 words across 15 files. Structure fixed at pitch + figures + formulas + dependencies + takeaway.

**Phase 1 (grill).** Read all 15 briefs critically. Twelve issues found, organized by severity:
- *Factual*: pendulum sign error in #04; extra ℏ on Schrödinger Noether density in #09.
- *Pedagogical*: pendulum-under-rotation figure in #04 was confused (replaced with central-potential example); time-translation derivation in #06 couldn't be force-fit into `Q = (∂L/∂q̇) X − F` (replaced with direct `dL/dt` + Euler-Lagrange derivation); LRL in #08 isn't a point-transformation Noether current (dependency on #05 softened); brachistochrone vs. Hamilton's action in #03 needed explicit framing.
- *Polish*: #02 Hilbert theorem precision, #02 "next decade" softened, #05 Galilean boost wording, #07 "discrete D₂" clarified, #12 chain-length definition, #15 Alexandroff-Hopf credit tightened.
All 12 applied via Edits to the brief files.

**Phase 4 (Act III).**

- Lib extensions in `noether-math.js`: `rings.ZsqrtM5` (record arithmetic with norm `a² + 5b²`), `rings.polyUni` (univariate polynomial helpers), `rings.polyMulti` (multivariate polynomials over ℚ stored as lex-sorted `{c, e}` term lists with `add`, `sub`, `mul`, `mulMono`, `lt`, `lm`, `lc`, `str`), `grobner.sPolynomial`, `grobner.reduce` (multivariate division remainder), `grobner.buchberger` (returns final basis plus a `history` log of each S-polynomial reduction and basis addition), and `topology.simplicialRanks` (Gaussian-elimination ranks of `∂₁` and `∂₂` for small simplicial complexes, returning `H₀, H₁` over ℚ).
- Numeric verification before building any explainer: `2·3` and `(1+√−5)(1−√−5)` both give 6 with norm 36; the four irreducible factors have norms 4, 9, 6, 6 (with the canonical norm-pair argument confirming irreducibility). Buchberger on `I = (x² − y, xy − 1)` terminates in 6 S-polynomial steps with the final basis including `y³ − 1` (the radical of the constraint `y² · y = 1` after `x = y²` substitution). Hollow triangle: `H₀ = ℚ, H₁ = ℚ`. Filled triangle: `H₀ = ℚ, H₁ = 0`. Figure-8 (two loops sharing a vertex): `H₀ = ℚ, H₁ = ℚ²`. All matched expected values.
- Explainer line counts: #11 426, #12 452, #13 351, #14 438, #15 497. All five parse cleanly with balanced script blocks; figure counts 4/4/3/2/4 respectively.
- Interactivity highlights: #11 hover-anywhere `ℤ[√−5]` lattice with norm tooltip and four highlighted irreducibles; static factorization tree; ideal-workshop card walking through `𝔭² = (2)`, `𝔮𝔮̄ = (3)`, `𝔭²𝔮𝔮̄ = (6)`; class-group panel with the two-class composition rule. #12 click-to-build chains in `ℤ` (gcd-based) with live chain length; static `k[x]` chain on `(x(x−1)²(x+1))`; click-to-grow monomial staircase in `k[x, y]` (with auto-removal of dominated generators); non-Noetherian counterexample diagram. #13 staircase rendering of `(x³, x²y, xy³, y⁴)` with red minimal generators; chain-stabilization schematic of the proof; iteration diagram k → k[x₁] → … → k[x₁, …, xₙ]. #14 elliptic curve `y² = x³ − x` with x-fiber slider showing the 2-sheeted cover and branch points at x ∈ {−1, 0, 1}; quadric-cone schematic with the projection arrow and apex branch. #15 Buchberger step-through with live basis display and per-step S-polynomial log; scheme schematic juxtaposing the classical curve with a list of closed and generic points; equivariant vs. non-equivariant network panels with the `f(g·x) = g·f(x)` check; clickable simplicial-complex selector wired to the lib's homology computation; closing card with the German opening passage of the 1921 paper.
- Series index `docs/noether/index.html` shipped (15 cards in three Act-tinted columns, with subtitles, intro paragraphs, and act-tinted left borders on each card). Root `docs/index.html` updated with a Math-section entry for the Noether series and a `noether` thumb factory that draws three nested concentric ellipses + a fixed LRL-style arrow + a planet bead.

**Phase 3 (Act II).**

- Lib extensions: added `systems.centralForce2D(m, V, Vprime)` (2D central force with `energy`/`angularMomentum` methods) and `systems.kepler(m, GM)` (specializes `centralForce2D` to `V = -GMm/r` and adds an `LRL` helper returning the Laplace-Runge-Lenz vector). Added `noether.currentVec` (vector Noether current via numerical ∂L/∂q̇_i) and `noether.hamiltonianVec` (Σ q̇_i ∂L/∂q̇_i − L).
- Sanity-checked numerically: a circular Kepler orbit at `r=1, v=1` keeps E = −½ and Lz = 1 to six digits for a full period; an elliptic orbit at `(1,0), (0,0.8)` preserves the LRL vector to four decimals under RK4. Free-2D `currentVec` returns `p_x = v_x`; `hamiltonianVec` returns `½|v|²`.
- Explainer line counts: #06 653, #07 724, #08 583, #09 485, #10 382. All five parse cleanly; script blocks balanced; figures 3/4/4/4/1 respectively (#10 is mostly derivation cards + KaTeX since the second theorem is low on animation).
- Interactivity highlights: #06 clickable pendulum phase portrait with Hamiltonian heatmap background + separatrix overlay; kick-button figure showing H jumping between level curves. #07 two-body harmonic oscillator with COM trail + live Px/Py plot; vertical-gravity break figure; central-potential orbit with Kepler's-second-law sweep wedge + Lz trace; quadrupole breaker showing Lz oscillating. #08 live LRL arrow pinned along semi-major axis; α slider on the 1/r³ correction with the LRL arrow precessing; three-panel E/Lz/arg(A) monitor with perturbation toggle; SO(4) generator schematic; Bohr-level diagram with n² degeneracies. #09 phase-hue strip for a Gaussian packet under global rotation; Lagrangian-term cancellation card; free-Schrödinger Gaussian-packet propagation with live ∫ρ dx normalization check; global-vs-local-β slider flipping δL from zero to nonzero. #10 scalar-field global-vs-local shift viewer; four-step off-shell identity derivation; first-vs-second comparison card; Hilbert/Klein/Göttingen history note.

**Phase 2 (Act I).**

- `lib/noether-math.js` grew from a stub to 484 lines, organized into sections:
  - numerical helpers (`approxEq`, `vecApproxEq`)
  - 2×2 matrices (`mat2.make`, `apply`, `mul`, `det`, `rot`)
  - groups (`D4`, `S3` with `act` methods)
  - actions (`orbit`, `stabilizer`)
  - invariants (`check` via sample-based verification)
  - binary forms (`quadratic`, `cubic`, `transform`, `discriminant`)
  - Lagrangian mechanics (`action` integral, `rk4` for scalar or vector q, `partialQ`, `partialQdot`)
  - physical systems (`freeParticle`, `harmonicOscillator`, `pendulum`, `particleInPotential`)
  - symmetry (`deltaL` via central finite differences in ε)
  - Noether (`hamiltonian`, `current`)
- Library coverage verified by 41 Node tests across two batches (26 core + 15 physics). Test battery also runnable in-browser via `lib/test.html`.
- Explainer line counts: #01 1060, #02 791, #03 749, #04 607, #05 634. Each has its own inline CSS (following the house style from e8-lattice) and a single concluding `<script>` block.
- Interactivity highlights: #01 Figure 2 D₄ animation (rotations sweep angle, reflections collapse-and-reflect through `rotate(α) scale(1, 1−2t) rotate(−α)`); #02 GL₂ workshop with numerical verification of the `(det M)^{n(n−1)}` weight rule; #03 brachistochrone with three comparable paths and a bead animation; #05 workshop that integrates the EOM forward and plots `Q(t)` to show conservation vs. drift.

## Phase 3 plan — Act II (explainers 6–10)

### Lib extensions needed

- **`NOETHER.systems.kepler(m, GM)`** — 2D central force with accel `a = -GM q / |q|³`. Returns `{ L(q, qdot), accel(q, qdot), LRL(q, qdot), angularMomentum(q, qdot) }`. `q` and `qdot` are length-2 arrays.
- **`NOETHER.systems.centralForce2D(m, V, Vprime)`** — general 2D central force with arbitrary `V(r)` and its derivative. Useful for the rotation-symmetry example in #07.
- **`NOETHER.systems.twoBody(m1, m2, V, Vprime)`** — two-particle system reduced to center-of-mass + relative coordinates.
- **`NOETHER.noether.currentVec(L, X, F, q, qdot, t)`** — vector version of the Noether-current formula. Accepts `q` and `qdot` as arrays and `X(q, t)` returning an array.
- **`NOETHER.fields.schrodinger1D(psi)`** — skeletal support for the U(1) phase-rotation demo in #09. Represents `ψ(x, t)` as a complex-valued array over a spatial grid; provides `density`, `current`, and phase-rotation helpers.
- **`NOETHER.noether.currentField(L, deltaField)`** — field-theoretic Noether current for 1+1D Schrödinger. Likely hardcoded for the specific Lagrangian since a general numerical δL over a field is too heavy for an inline figure.
- **`NOETHER.noether.secondTheoremIdentity(L, localX)`** — for #10, at the smallest-EM level: check that `∂_μ ∂_ν F^{μν} = 0` holds identically (trivially true; the explainer uses this as a consistency demo rather than a discovery).

### Per-explainer notes

- **#06 Time translation and energy.** Builds on #05 workshop. Main figure is a pendulum phase-space view with a flow field background (canvas); a second figure perturbs the trajectory via an instantaneous "kick" that moves it to a new energy level. Needs `systems.pendulum` (already there) + a phase-space renderer.
- **#07 Space translation and rotation.** 2D two-body + central-force examples. Needs `systems.centralForce2D` and `systems.twoBody`. Figure 4 (quadrupole potential) demonstrates a broken rotation symmetry; reuses the heatmap pattern from #04 figure 2.
- **#08 Kepler's hidden symmetry.** The centerpiece is an orbit with the LRL vector drawn and held steady while the planet moves. Second figure adds a `1/r³` perturbation and shows LRL precessing. Needs `systems.kepler` + ODE integration for the orbit (RK4 works).
- **#09 Phase and electric charge.** Visualizes a 1D Gaussian wave packet evolving under Schrödinger with the probability flow as an animated color field. The main interactive is "rotate the phase globally → nothing changes; rotate locally → extra term appears." Needs `fields.schrodinger1D`.
- **#10 Noether's second theorem.** Mostly static. Two interactive touches: global-vs-local slider on a scalar field (just a visualization, no physics), and a KaTeX-animated proof card showing `∂_μ ∂_ν F^{μν} = 0` as an identity.

## Phase 4 plan — Act III (explainers 11–15)

### Lib extensions needed (new branch: `NOETHER.algebra`)

- **`NOETHER.rings.Z`** — ordinary integers with `add`, `mul`, `gcd`, `eq`.
- **`NOETHER.rings.gaussianInt`** — `ℤ[i]` with norm, mul, eq.
- **`NOETHER.rings.ZsqrtMinus5`** — `ℤ[√−5]` with element `{a, b}` records, mul, norm `a² + 5b²`, eq. Used for #11.
- **`NOETHER.rings.polyUni(k)`** — univariate polynomials over a field represented as coefficient arrays. `add`, `mul`, `divmod`, `gcd`, `degree`, `lc`. Used for #12 chain-condition demos.
- **`NOETHER.rings.polyMulti(k, n, order)`** — multivariate polynomials over a field, stored as sorted lists of `{coef, exponents}` terms. Needs monomial comparison by the given order (lex or grlex). Used for #13, #14, #15. This is the biggest new thing.
- **`NOETHER.ideals.generate(ring, elements)`** — constructs an ideal from a list of elements. For polynomial rings, returns a record with generators; doesn't attempt a normal form here.
- **`NOETHER.ideals.product(I, J)`** — product of ideals, useful for the `𝔭² = (2)` factorization in #11.
- **`NOETHER.ideals.contains(I, elt)`** — for the chain-building figures in #12.
- **`NOETHER.ideals.norm(R, I)`** — the ideal norm for quadratic rings, used in #11 class-group figure.
- **`NOETHER.ideals.chain(current, generator)`** — extend a chain by adjoining a generator. Used in #12 to build ascending chains step by step.
- **`NOETHER.ideals.classGroup(R)`** — for #11 figure 4. Hardcoded for `ℤ[√−5]` (class number 2).
- **`NOETHER.hilbert.buildBasis(I, ring)`** — demo-scale build of a generating set for a given ideal, following the proof structure of the basis theorem. Only needs to work on small examples for #13 figure 2.
- **`NOETHER.normalization.find(A)`** — for small `k[x, y]/(f)` or `k[x, y, z]/(f)` quotients, find the polynomial subring over which the quotient is a finite module. Used in #14 figures 1–2.
- **`NOETHER.grobner.buchberger(I, order)`** — Buchberger's algorithm. Needs S-polynomials, polynomial reduction, and a termination check. Used in #15 figure 1; the animation walks through one S-polynomial per step.
- **`NOETHER.topology.simplicialComplex(verts, simplices)`** — small simplicial complex with boundary maps and homology groups. Used in #15 figure 4 (triangle with missing face, figure-8, torus triangulation, `ℝP²` for torsion).
- **`NOETHER.equivariance.demo(group, imagePattern)`** — minimal rotation-equivariant vs. non-equivariant classifier. Used in #15 figure 3 to illustrate the architectural difference.

### Per-explainer notes

- **#11 Ideals as new numbers.** Figures: lattice of `ℤ[√−5]` with 6 highlighted; divisibility tree showing the two factorizations; ideal workshop with `𝔭 = (2, 1+√−5)` and the multiplication `𝔭² = (2)`; class group visualization; historical timeline.
- **#12 Noetherian rings.** Figures: chain-building in `ℤ` (click integers); same in `k[x]`; 2D monomial ideals as staircases; non-Noetherian `k[x₁, x₂, …]` with an infinite chain; three equivalent formulations card.
- **#13 Hilbert basis theorem.** Figures: generators workshop for ideals in `k[x, y]`; Hilbert's proof animated (leading-coefficient chain stabilization); iterating from `ℤ` to `ℤ[x, …]`; Gordan's lament card.
- **#14 Noether normalization.** Figures: elliptic curve as a finite cover of `k[x]`; quadric cone as a finite cover of `k[u, v]`; generic-linear-substitution proof sketch; dimension table; normalization as dimension theory card.
- **#15 Legacy.** Four vignettes: Gröbner basis in action with Buchberger animated; `V(y² − x³ + x)` as a scheme; equivariant neural network comparison; homology groups of a small complex (triangle, figure-8, Klein bottle for torsion); closing quote card.

## Phase 5 plan — Series index and audit

- `docs/noether/index.html` — grid of 15 cards in three acts, following the e8-lattice index layout. Header visualization is a single striking D₄ or S₃ orbit picture (pulled from #01) as a thumbnail animation.
- Root `docs/index.html` — add a card for the Noether series under "Mathematical/Abstract".
- Cross-reference pass — #15 should explicitly link to #12, #13, #14; Act III should link back to #02 as the historical seed; Act II should link back to #05 as the theorem.
- Audit sweep — run each explainer through the SPH pass: voice consistency, figure interactivity, math correctness spot-check, broken-image check, mobile breakpoints.

## Files

```
plans/noether/
  README.md                              (this file)
  briefs/
    01-what-is-an-invariant.md
    02-invariants-of-a-binary-form.md
    03-least-action-and-lagrangians.md
    04-symmetries-of-a-lagrangian.md
    05-noethers-first-theorem.md
    06-time-translation-and-energy.md
    07-space-translation-and-rotation.md
    08-keplers-hidden-symmetry.md
    09-phase-and-electric-charge.md
    10-noethers-second-theorem.md
    11-ideals-as-new-numbers.md
    12-noetherian-rings.md
    13-hilberts-basis-theorem.md
    14-noether-normalization.md
    15-the-abstract-method-in-the-wild.md

docs/noether/
  lib/
    noether-math.js                      (stubbed Phase 0, fleshed Phase 2)
    noether-viz.js                       (created Phase 2)
    test.html                            (created Phase 2 for in-browser sanity checks)
  01-what-is-an-invariant.html           (built Phase 2)
  ... (14 more explainer files built in Phases 2–4)
  index.html                             (built Phase 5)
```

## Brief template

Each brief is ~300–500 words with the following sections:

- **Pitch** — what it covers, what makes it click, what the reader leaves with.
- **Figures** — one line per figure, numbered, interactive/static noted. 3–8 total.
- **Key formulas / constructions** — KaTeX-ready math the explainer will display, in plain form.
- **Dependencies** — earlier explainers it leans on, `NOETHER.*` lib functions it needs.
- **Reader takeaway** — what the reader can do/say/recognize that they couldn't before.
