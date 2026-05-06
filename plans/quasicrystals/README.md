# Aperiodic Order: Quasicrystals from Lattice Projections

Four-article interactive explainer series on aperiodic order — the geometry that lets you tile space without ever repeating, with exact arithmetic, embedded periodicity in higher dimensions, and a real physical instantiation discovered in 1982.

## Locked plan

**Spine.** Aperiodic order is the cleanest "geometry has surprising depth" story in modern math. A 1D projection of ℤ² along an irrational slope produces a non-repeating sequence with two tile lengths in ratio φ. The same regular cut-and-project recipe in higher dimensions produces Penrose tilings, the icosahedral H₃ quasicrystal, and the icosian Galois-pair H₄ model set — all with pure-point diffraction whose Bragg peaks are indexed by finite-rank Fourier modules rather than by an ordinary reciprocal lattice. Reader endpoint: a working understanding of cut-and-project, the role of exact ℤ[φ] arithmetic, what phason flips are, why icosahedral symmetry is impossible for a periodic crystal but routine for a quasicrystal, and what Shechtman actually saw in 1982.

**Identity.** Slug `quasicrystals`, title *Aperiodic Order: Quasicrystals from Lattice Projections*. Audience is curious generalists with some math comfort but no assumed background in crystallography or Coxeter theory. Voice should be exact and concrete — every claim either has a worked example, a figure, or both. The series should explain the math through small, fully manipulable instances rather than through general theorems quoted from references.

**Shape.** Two acts, 4 explainers, 2/2. The original twelve briefs remain as source packets, but the shipped reader experience is collapsed into four denser articles.

- **Act I — The geometry of aperiodic order:** Fibonacci/cut-and-project/phasons; Penrose projection/inflation.
- **Act II — Higher dimensions and matter:** icosahedral diffraction/discovery; beyond cut-and-project.

**Important framing.** "Quasicrystal" has at least four roughly-equivalent definitions: cut-and-project model set, substitution-rule fixed point, matching-rule tiling, and pure-point-diffraction set. Locked decision: articles 1-3 use regular model sets / cut-and-project with pure-point diffraction as the working definition because it is the most computational and the most visualizable. Article 4 compares substitution, matching-rule, and diffraction-first definitions explicitly, including where the equivalences are conditional or fail. The mathematical object and the physical alloy are different things and deserve to be kept apart even when the same word is used.

**Visual style.** Manipulable figures first. The phason slider is the signature interactive: sweep an offset through internal space and watch vertices wink in and out. Inflation should be animated as a fixed-point map. Diffraction should be live: change the window, change the envelope. Penrose and Fibonacci should both be re-projectable from their ambient lattice in real time. Avoid decorative kaleidoscopic imagery; every visual should expose a *parameter*.

**Rendering stack.** Standalone HTML/CSS/JS, no build step. SVG for tilings and lattice diagrams; canvas for diffraction patterns and dense vertex clouds. A shared helper at `docs/quasicrystals/lib/quasi-viz.js` attaches to a single `QUASI` global. Where the library substrate exists, prefer to cite it: squishy-thing's `packages/e8-core/src/cut-and-project.ts` is the implementation reference for `elserSloane`, `h3Quasicrystal`, `fibonacciScheme`, phason mechanics, and the diffraction oracle. `penroseFromE8` is a related in-house 2D slice, not the canonical 5-fold Penrose construction; article 2 should use a classical Z5 implementation unless a 5-fold-aligned H4 slice ships first. The series can either embed squishy-thing's standalone interactives via `<iframe>` or re-implement the small ones (Fibonacci, phason, classical Penrose) directly in `quasi-viz.js`. Pick per-essay; the trade-off is build-step weight vs. inspectability.

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
- `pure-point spectrum` — a diffraction measure supported on atoms / Bragg peaks. For aperiodic crystals those peaks lie in a finite-rank Fourier module that may be dense, so "pure point" does not mean "uniformly spaced reciprocal lattice."
- `Bragg peak` — a delta function in the diffraction measure, located at k_∥ = π_∥(K) for K ∈ Λ*.
- `H₂, H₃, H₄` — the non-crystallographic Coxeter groups (regular pentagon, icosahedron, 600-cell). None of these are symmetries of any periodic ℤ³ lattice.
- `icosian ring` — the quaternionic order generated by the 120 unit icosians (vertices of the 600-cell). Substrate for the H₄ quasicrystal; Wilson's E8 construction is a nearby metric realization, not the source lattice of `elserSloane()`.
- `Galois automorphism σ` — the field automorphism of ℚ(φ) sending φ ↦ 1−φ. Relates the physical and internal projections of the icosian Galois-pair embedding.
- `local-isomorphism class` — the equivalence class of model sets under finite-radius patch matching. For cut-and-project schemes, the full hull is torus-parametrized by the ambient lattice quotient; the phason view is the internal offset chart. Do not label the Elser–Sloane parameter torus as an E8 torus.
- `matching rule` — local constraint on tile adjacency that forces an aperiodic global structure. Equivalent to cut-and-project for many examples; the equivalence is non-trivial.
- `substitution rule` — an inflation-and-replacement map on tiles that, iterated, produces an aperiodic tiling as a fixed point.

## Series outline

### Act I — The geometry of aperiodic order

1. **Fibonacci, cut-and-project, and phasons.** Merge the smallest model set, exact Z[phi] coordinates, and the offset chart. The reader sees the Z2 lattice, physical projection, internal projection, acceptance window, internal-density buildup, two-gate pruning, and phason boundary crossings in one place.
2. **Penrose projection and inflation.** Merge the classical five-grid Penrose construction with local matching rules and phi-inflation. `penroseFromE8` remains a related in-house slice, not the public canonical construction.

### Act II — Aperiodic order in higher dimensions and matter

3. **Icosahedral diffraction and discovery.** Merge the crystallographic restriction theorem, H3/H4 and icosian-ring substrate, pure-point diffraction, and Shechtman's historical evidence. The reader sees the difference between multiple twinning and a coherent non-crystallographic Fourier module.
4. **Beyond cut-and-project.** Merge definitions, substitution/matching-rule examples, Wang tiles, Hat, Spectre, and open questions. The article keeps equivalence claims conditional and avoids presenting monotiles as ordinary regular model sets.

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
- Socolar, J. E. S., "Quasicrystalline structure of the Smith monotile tilings," *Phys. Rev. B* 108, 224109 (2023).
- Bindi, L., Steinhardt, P. J., et al., "Natural Quasicrystals," *Science* 324, 1306 (2009).
- Bindi, L., Kolb, W., Eby, G. N., Asimow, P. D., Wallace, T. C., Steinhardt, P. J., "Accidental synthesis of a previously unknown quasicrystal in the first atomic bomb test," *PNAS* 118 (2021).
- Bindi, L., Pasek, M. A., Ma, C., Hu, J., Cheng, G., Yao, N., Asimow, P. D., Steinhardt, P. J., "Electrical discharge triggers quasicrystal formation in an eolian dune," *PNAS* 120 (2023).

In-house substrates:

- `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts` — `elserSloane`, `h3Quasicrystal`, `penroseFromE8`, `fibonacciScheme`, phason mechanics, diffraction.
- `/Users/kai/git/squishy-thing/research/03-cut-and-project/synthesis.md` — the mathematical anchor.
- `/Users/kai/git/squishy-thing/research/22-galois-pair-lattice/synthesis.md` — icosian-ring substrate; essay 8 cites this directly.
- `/Users/kai/git/squishy-thing/apps/gallery/src/interactives/{penrose-phason,fibonacci-phason,diffraction-lab,cut-and-project}.ts` — shipped interactives available for embed.
- `/Users/kai/git/moonshine/docs/parallel-coordinates/17-quasicrystals.html` — the existing single chapter; this series re-frames its content as essay 1 + essay 8.

## Files

Source packets plus shipped implementation:

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
    figure-risk-register.md
    visualization-audit.md

docs/quasicrystals/
  lib/
    quasi-viz.js
  index.html
  01-fibonacci-cut-and-project-phasons.html
  02-penrose-projection-and-inflation.html
  03-icosahedral-diffraction-and-discovery.html
  04-beyond-cut-and-project.html
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

## UX quality pass state

- [x] **Phase 0** — research grounding and locked series plan recorded.
- [x] **Phase 1** — write 12 briefs.
- [x] **Phase 1a** — source packet, library-substrate cross-references, and vocabulary graph.
- [x] **Phase 1b** — visualization audit: figure inventory, identify cross-essay primitives for `quasi-viz.js`, decide iframe-embed vs. re-implementation per figure.
- [x] **Phase 2** — first-pass `docs/quasicrystals/lib/quasi-viz.js`, `docs/quasicrystals/style.css`, and `docs/quasicrystals/index.html`.
- [x] **Phase 3** — first-pass Act I explainers: Fibonacci, cut-and-project, golden arithmetic, Penrose projection, inflation, and phason flips.
- [x] **Phase 4** — first-pass Act II explainers: icosahedral symmetry, icosian / nearby E8, diffraction, Shechtman, definitions beyond cut-and-project, and Hat / Spectre.
- [x] **Phase 5a** — root index entry, cross-link pass to `parallel-coordinates/17-quasicrystals.html`, and source-caution pass.
- [x] **Phase 5b** — collapse to six denser articles and add the six missing signature standalone interactives.
- [x] **Phase 5c** — combine articles 1-2 and 4-5 into the shipped four-article pass, with a new visual glyph for the final article.
- [ ] **Phase 5d** — optional full figure build-out from the visualization audit. The shipped docs are a strengthened four-article pass, not the complete 47-figure version.

May 2026 UX pass:

- Article renderer now supports multiple figures per essay.
- Added load-bearing figures for essay 02 (internal density and two-gate pruning), essay 04 (matching-rule checker and five-direction order), essay 06 (boundary-distance graph), essay 07 (periodic-vs-aperiodic contrast), and essay 11 (substitution / Wang-tile local-rule comparison).
- Collapsed the public docs from twelve article shells to six, then four denser articles.
- Added first-pass signature figures for classical pentagrid Penrose, Penrose phi-inflation, H3/H4 substrate, finite diffraction oracle, Shechtman twinning comparison, and Hat/Spectre patch exploration.
- Replaced the final article's card glyph with a local-rule / monotile glyph instead of the reused projection-strip mark.
- Replaced the Hat / Spectre decorative placeholder with actual monotile-family outlines.
- Removed unused D3 script tags from the shipped quasicrystal HTML shells.

Remaining enhancement backlog: replace first-pass H3/H4 and diffraction schematics with audited squishy-thing embeds/oracles; deepen the classical de Bruijn Penrose primitive; source rights-safe historical imagery if desired; replace compact Hat/Spectre patch diagrams with validated larger tiling patches.

## Article-count decision

The shipped experience is collapsed to four stronger articles:

1. **Fibonacci, cut-and-project, and phasons** — merge previous articles 1 and 2.
2. **Penrose projection and inflation** — keep previous article 3.
3. **Icosahedral diffraction and discovery** — merge previous articles 4 and 5.
4. **Beyond cut-and-project: Hat, Spectre, and definitions** — keep previous article 6, with a new local-rule / monotile glyph.

This four-article shape reduces repeated setup prose, gives every article several substantial figures, and makes the series feel intentionally dense rather than thinly serialized. The original twelve briefs remain useful as source packets for a future 47-figure expansion.
