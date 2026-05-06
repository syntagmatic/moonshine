# Aperiodic Order: Quasicrystals from Lattice Projections

Twelve-part interactive explainer series on aperiodic order — the geometry that lets you tile space without ever repeating, with exact arithmetic, embedded periodicity in higher dimensions, and a real physical instantiation discovered in 1982.

## Locked plan

**Spine.** Aperiodic order is the cleanest "geometry has surprising depth" story in modern math. A 1D projection of ℤ² along an irrational slope produces a non-repeating sequence with two tile lengths in ratio φ. The same recipe in higher dimensions produces Penrose tilings, the icosahedral H₃ quasicrystal, and Elser–Sloane's 4D H₄ object — all with diffraction patterns whose Bragg peaks live at irrational positions in reciprocal space. Reader endpoint: a working understanding of cut-and-project, the role of exact ℤ[φ] arithmetic, what phason flips are, why icosahedral symmetry is impossible for a periodic crystal but routine for a quasicrystal, and what Shechtman actually saw in 1982.

**Identity.** Slug `quasicrystals`, title *Aperiodic Order: Quasicrystals from Lattice Projections*. Audience is curious generalists with some math comfort but no assumed background in crystallography or Coxeter theory. Voice should be exact and concrete — every claim either has a worked example, a figure, or both. The series should explain the math through small, fully manipulable instances rather than through general theorems quoted from references.

**Shape.** Two acts, 12 explainers, 6/6.

- **Act I — The geometry of aperiodic order:** the Fibonacci tiling; cut-and-project; the golden ratio as exact arithmetic; Penrose tilings; inflation and self-similarity; phason flips.
- **Act II — Higher dimensions and matter:** icosahedral symmetry (H₃); the icosian ring inside E8; diffraction; Shechtman and the discovery; substitution and undecidability; the Hat / Spectre and the open questions.

**Important framing.** "Quasicrystal" has at least four roughly-equivalent definitions: cut-and-project model set, substitution-rule fixed point, matching-rule tiling, and pure-point-diffraction set. The series should treat the cut-and-project definition as primary because it is the most computational and the most visualizable, but every essay should be honest about which definition it is using and where the equivalences are conditional. The mathematical object and the physical alloy are different things and deserve to be kept apart even when the same word is used.

**Visual style.** Manipulable figures first. The phason slider is the signature interactive: sweep an offset through internal space and watch vertices wink in and out. Inflation should be animated as a fixed-point map. Diffraction should be live: change the window, change the envelope. Penrose and Fibonacci should both be re-projectable from their ambient lattice in real time. Avoid decorative kaleidoscopic imagery; every visual should expose a *parameter*.

**Rendering stack.** Standalone HTML/CSS/JS, no build step. SVG for tilings and lattice diagrams; canvas for diffraction patterns and dense vertex clouds. A shared helper at `docs/quasicrystals/lib/quasi-viz.js` attaches to a single `QUASI` global. Where the library substrate exists, prefer to cite it: squishy-thing's `packages/e8-core/src/cut-and-project.ts` is the implementation reference for `elserSloane`, `h3Quasicrystal`, `penroseFromE8`, `fibonacciScheme`, phason mechanics, and the diffraction oracle. The series can either embed squishy-thing's standalone interactives via `<iframe>` or re-implement the small ones (Fibonacci, phason) directly in `quasi-viz.js`. Pick per-essay; the trade-off is build-step weight vs. inspectability.

## Research grounding

The series should treat the named books and papers as anchors, not transcripts. The squishy-thing dossiers are the in-house substrate.

- *Aperiodic Order, Vol. I & II* (Baake & Grimm, 2013/2017) — the canonical mathematical reference. Use for cut-and-project, model sets, diffraction, and the four-definition landscape.
- *Quasicrystals and Geometry* (Senechal, 1995) — older but still the most accessible introduction; especially good on the relationship between cut-and-project and substitution rules.
- *The Second Kind of Impossible* (Steinhardt, 2019) — popular history of the discovery, the physics community's resistance, and the natural-quasicrystal expedition. Use for narrative texture in essay 10.
- Shechtman, Blech, Gratias, Cahn, "Metallic Phase with Long-Range Orientational Order and No Translational Symmetry," *PRL* 53, 1951 (1984). The discovery paper. Cite directly.
- Smith, Myers, Kaplan, Goodman-Strauss, "An aperiodic monotile" (2023, arXiv:2303.10798) and the follow-up "Hat" / "Spectre" papers. The 2023 single-tile breakthrough; required for essay 12.
- Squishy-thing's `research/03-cut-and-project/synthesis.md` is the in-house mathematical anchor for the library substrate; `research/22-galois-pair-lattice/` covers the icosian-ring details for essay 8; `research/15-icosian-quaternions/` carries the Hopf-fibration framing.

## Key terms

Introduce each term once carefully and avoid silently reusing it.

- `cut-and-project scheme` — the four-part object (Λ, π_∥, π_⊥, W) where Λ is a lattice in ambient ℝ^N, π_∥ projects to the physical subspace, π_⊥ projects to the internal subspace, and W is a bounded acceptance window in the internal space.
- `model set` — the projected vertex set Λ★ = { π_∥(p) : p ∈ Λ, π_⊥(p) ∈ W }. Also the offset version Λ★(o).
- `Delone set` — uniformly discrete and relatively dense; the geometric setting in which "quasicrystal" lives.
- `Meyer set` — a Delone set where Λ★ − Λ★ is also Delone; the regularity class of model sets.
- `phason` — the internal offset o ∈ E_⊥. Sliding the phason produces vertex-by-vertex flips. Distinct from the dynamical phason mode in physics, which is a low-frequency excitation; the math object is the offset itself.
- `inflation factor` — the scalar (φ for Penrose, φ for Fibonacci, φ³ for the H₃ quasicrystal) under which the vertex set maps to a subset of itself.
- `acceptance window` — W ⊂ E_⊥. Different windows give different model sets even from the same lattice and projection.
- `pure-point spectrum` — a diffraction measure supported on a discrete set; the empirical hallmark of long-range order without periodicity.
- `Bragg peak` — a delta function in the diffraction measure, located at k_∥ = π_∥(K) for K ∈ Λ*.
- `H₂, H₃, H₄` — the non-crystallographic Coxeter groups (regular pentagon, icosahedron, 600-cell). None of these are symmetries of any periodic ℤ³ lattice.
- `icosian ring` — the ring of quaternions over ℤ[φ] generated by the 120 unit icosians (vertices of the 600-cell). Substrate for the H₄ quasicrystal and the bridge to E8.
- `Galois automorphism σ` — the field automorphism of ℚ(φ) sending φ ↦ 1−φ. Relates the physical and internal projections of the icosian Galois-pair embedding.
- `local-isomorphism class` — the equivalence class of model sets under finite-radius patch matching. The 8-torus T⁸ = ℝ⁸/E₈ parametrizes this class for the Elser–Sloane scheme.
- `matching rule` — local constraint on tile adjacency that forces an aperiodic global structure. Equivalent to cut-and-project for many examples; the equivalence is non-trivial.
- `substitution rule` — an inflation-and-replacement map on tiles that, iterated, produces an aperiodic tiling as a fixed point.

## Series outline

### Act I — The geometry of aperiodic order

1. **The Fibonacci tiling.** Open the series with the smallest cut-and-project: ℤ² → ℝ along slope 1/φ with a unit-interval acceptance window. The reader sees two tile lengths (long and short, in ratio φ:1) emerge from a periodic 2D lattice. Figure: live ℤ² lattice with the projection line and the strip; vertices inside the strip project down to the 1D tiling; sliders for slope (irrational vs. rational) and window width.
2. **Cut-and-project.** Generalize the Fibonacci recipe. The four-part object (Λ, π_∥, π_⊥, W). Why both gates are load-bearing: physical-only pruning never terminates because π_⊥(Λ) is dense in E_⊥. Figure: schematic of ambient → physical/internal split, with the window sketched in internal space.
3. **The golden ratio is not decoration.** Why exact ℤ[φ] arithmetic matters. The Galois automorphism σ: φ ↔ 1−φ as the bridge between physical and internal projections in the Elser–Sloane / icosian construction. Floating-point breaks aperiodic geometry. Figure: side-by-side comparison of exact ℤ[φ] enumeration vs. naïve floating-point, showing accumulated drift at modest projection radius.
4. **Penrose tilings as projection.** Kites and darts; thick and thin rhombs; the H₂ tiling as a double-slice descent from the Elser–Sloane 8D scheme. Matching rules vs. cut-and-project as two equivalent definitions for this case. Figure: live cut-and-project with a 5-fold-aligned slice; reader can rotate to see how slice angle picks out the symmetry.
5. **Inflation and self-similarity.** Multiply the vertex set by φ: vertices map to a subset of themselves. Fractal-but-discrete. The substitution rule perspective. Figure: animated φ-inflation overlaying scaled vertex sets; the reader can step inflation level and see the nesting.
6. **Phason flips.** The offset parameter o ∈ E_⊥ slides through internal space. Vertices wink in and out as the window shifts. Generic offsets give locally-isomorphic tilings; singular offsets (where the window boundary contains lattice points) produce topology jumps. Figure: the signature phason slider — Fibonacci or Penrose with a dragable o, showing per-vertex acceptance state and a counter for flips.

### Act II — Aperiodic order in higher dimensions and matter

7. **Three-fold, five-fold, two-fold: icosahedral symmetry.** H₃ as the symmetry group of the regular icosahedron. The crystallographic restriction theorem: no periodic 3D lattice admits 5-fold rotational symmetry. The escape hatch: drop periodicity, keep long-range order. Figure: rotation-axis diagram of the icosahedron with 5-fold, 3-fold, and 2-fold axes, plus a side-by-side of "what 5-fold periodic would have to look like" (impossible) vs. "what 5-fold quasiperiodic looks like" (a real diffraction pattern).
8. **The icosian ring and E8.** The quaternionic substrate. H₄ as the symmetry of the 600-cell. The icosian ring ℋ as quaternions over ℤ[φ]; the Galois-pair embedding ℋ[φ] ↪ ℝ⁸ as `(g, σ(g))`. Wilson's `E8 = 2ℐ ∪ τ·2ℐ` construction. Quasicrystals as windowed projections of 8-dimensional periodicity. Figure: live 8D → 4D → 3D projection with H₄ acting on the 600-cell; the reader can pick a slicing axis.
9. **Diffraction: how you actually see aperiodic order.** Pure-point spectrum. Bragg peaks at k_∥ = π_∥(K) for K in the reciprocal lattice. The window's Fourier transform as the amplitude envelope; peak positions are exact, only amplitudes are window-dependent. Figure: live diffraction pattern; reader can swap window (ball, interval, 600-cell), change projection, and see the peak set transform.
10. **Shechtman and the discovery.** 1982 electron diffraction of an Al-Mn alloy showing 10-fold (i.e., 5-fold with inversion) symmetry. The 1984 paper. The years of rejection — Pauling's "there are no quasicrystals, only quasi-scientists." The 2011 Nobel. What Shechtman actually saw, why crystallography needed years to expand its definition, and what counts as a "natural" quasicrystal (the 2009 Khatyrka meteorite). Figure: reproduction of Shechtman's diffraction image alongside the predicted H₃-quasicrystal pattern.
11. **Beyond cut-and-project.** Substitution tilings (Robinson, Penrose-from-substitution, the chair tiling). Wang tiles and the undecidability of the domino problem (Berger 1966). Where the four definitions of "quasicrystal" diverge: not every substitution tiling is a model set; not every model set has matching rules; pure-point diffraction is conditional. Figure: a substitution-rule animation for the chair tiling, with annotations marking which essays' definition this object satisfies and which it doesn't.
12. **The Hat, the Spectre, and what's still open.** Smith–Myers–Kaplan–Goodman-Strauss 2023: a single tile that tiles the plane only aperiodically. Why the chirality question matters and how Spectre resolved it. What's still open: equivalence-of-definitions in full generality, the Pisot conjecture for substitution diffraction, and the long shadow of "natural quasicrystals" — are there more than two? Figure: the Hat tiling next to a Penrose tiling, with a toggle that re-projects each into the other's frame where possible.

## Visual approach

- Every figure should expose a parameter the reader can change. Static images are reserved for proofs and historical artifacts.
- Use distinct semantic palettes for physical space (warm) vs. internal space (cool). The phason slider should always make this color contrast load-bearing.
- Prefer interactions that reveal a distinction: cut-and-project vs. substitution; matching rule vs. cut-and-project window; generic vs. singular offset; inflation vs. translation; periodic vs. aperiodic vs. amorphous.
- Animate inflation as a fixed-point map (vertices map into themselves), not as a "zoom in" effect.
- Where squishy-thing already ships an interactive (`penrose-phason`, `fibonacci-phason`, `diffraction-lab`, `cut-and-project`), prefer iframe embeds over re-implementation. The library substrate is the source of truth.

## Source cautions

- Do not present "quasicrystal" as having a single agreed-on definition. The four definitions are equivalent under conditions, not unconditionally.
- Do not promote E8 quasicrystals as a theory of physics. Lisi's "An Exceptionally Simple Theory of Everything," Quantum Gravity Research's Quasicrystalline Spin Network, and adjacent papers are speculative; the geometry is rigorous but the physics interpretation is not settled science. Mention them where relevant; do not endorse.
- Do not conflate the math object with the physical alloy. The math is exact and parametric; the physics is empirical and contingent on metallurgy.
- Do not hardcode an offset as canonical. The local-isomorphism class is parameterized by a torus; defaults are conventions, not canonical values.
- Do not present cut-and-project as the only path to aperiodic order. Substitution and matching-rule constructions exist and sometimes do not coincide with model sets.
- Do not skip Shechtman's reception history in essay 10. The years of rejection are part of why the discovery matters.

## Sources

Primary anchors:

- Baake, M. & Grimm, U., *Aperiodic Order, Vol. I: A Mathematical Invitation* (CUP, 2013): https://www.cambridge.org/core/books/aperiodic-order/
- Baake, M. & Grimm, U., *Aperiodic Order, Vol. II: Crystallography and Almost Periodicity* (CUP, 2017).
- Senechal, M., *Quasicrystals and Geometry* (CUP, 1995).
- Steinhardt, P. J., *The Second Kind of Impossible* (Simon & Schuster, 2019).
- Shechtman, D., Blech, I., Gratias, D., Cahn, J. W., "Metallic Phase with Long-Range Orientational Order and No Translational Symmetry," *Phys. Rev. Lett.* 53, 1951 (1984).
- Smith, D., Myers, J. S., Kaplan, C. S., Goodman-Strauss, C., "An aperiodic monotile," arXiv:2303.10798 (2023).
- Smith, D., Myers, J. S., Kaplan, C. S., Goodman-Strauss, C., "A chiral aperiodic monotile" (Spectre), arXiv:2305.17743 (2023).
- Bindi, L., Steinhardt, P. J., et al., "Natural Quasicrystals," *Science* 324, 1306 (2009).

In-house substrates:

- `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts` — `elserSloane`, `h3Quasicrystal`, `penroseFromE8`, `fibonacciScheme`, phason mechanics, diffraction.
- `/Users/kai/git/squishy-thing/research/03-cut-and-project/synthesis.md` — the mathematical anchor.
- `/Users/kai/git/squishy-thing/research/22-galois-pair-lattice/synthesis.md` — icosian-ring substrate; essay 8 cites this directly.
- `/Users/kai/git/squishy-thing/apps/gallery/src/interactives/{penrose-phason,fibonacci-phason,diffraction-lab,cut-and-project}.ts` — shipped interactives available for embed.
- `/Users/kai/git/moonshine/docs/parallel-coordinates/17-quasicrystals.html` — the existing single chapter; this series re-frames its content as essay 1 + essay 8.

## Files

Planned implementation:

```text
plans/quasicrystals/
  README.md
  briefs/
    01-fibonacci-tiling.md
    02-cut-and-project.md
    03-golden-arithmetic.md
    04-penrose-tilings.md
    05-inflation-and-self-similarity.md
    06-phason-flips.md
    07-icosahedral-symmetry.md
    08-icosian-ring-and-e8.md
    09-diffraction.md
    10-shechtman-and-discovery.md
    11-beyond-cut-and-project.md
    12-hat-spectre-and-open.md
  vocabulary/
    structured-vocabulary.md
    concept-graphs.md
  sources/
    README.md
    source-map.md
    library-substrate.md

docs/quasicrystals/
  lib/
    quasi-viz.js
  index.html
  01-fibonacci-tiling.html
  02-cut-and-project.html
  03-golden-arithmetic.html
  04-penrose-tilings.html
  05-inflation-and-self-similarity.html
  06-phason-flips.html
  07-icosahedral-symmetry.html
  08-icosian-ring-and-e8.html
  09-diffraction.html
  10-shechtman-and-discovery.html
  11-beyond-cut-and-project.html
  12-hat-spectre-and-open.html
```

## Brief template

Each brief should be 400–700 words and include:

- **Pitch** — the concept, why it matters, and what becomes clearer through the figure.
- **Math basis** — the precise object(s) being explained, with squishy-thing function references where relevant.
- **Figures** — 3–5 visual elements, marked interactive/static, with parameter list.
- **Key terms** — terms introduced or used; flag any reuse from earlier essays.
- **Misreadings to avoid** — likely distortions or oversimplifications.
- **Library substrate** — squishy-thing functions or research dossiers this essay cites.
- **Reader takeaway** — what the reader can now distinguish, compute, or predict.

## Phase state

- [ ] **Phase 0** — research grounding and locked series plan recorded.
- [ ] **Phase 1** — write 12 briefs.
- [ ] **Phase 1a** — source packet, library-substrate cross-references, and vocabulary graph.
- [ ] **Phase 1b** — visualization audit: figure inventory, identify cross-essay primitives for `quasi-viz.js`, decide iframe-embed vs. re-implementation per figure.
- [ ] **Phase 2** — build `docs/quasicrystals/lib/quasi-viz.js` and `docs/quasicrystals/index.html`.
- [ ] **Phase 3** — build Act I explainers (01 Fibonacci first as the visual-grammar opener; then 06 phason; then 02–05).
- [ ] **Phase 4** — build Act II explainers (08 icosian-and-E8 first as the substrate cite; then 07, 09–11; then 12).
- [ ] **Phase 5** — root index entry, cross-link pass to `parallel-coordinates/17-quasicrystals.html`, source-caution pass, mobile/browser audit.
