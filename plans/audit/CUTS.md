# Cut ranking (2026-09-23)

Eight reviewers scored every series against one rubric (`reviews/RUBRIC.md`),
using foam as the reference for the current bar. Per-article verdicts and
reasons are in `reviews/<group>.md`. Scores are out of 10. "Cut" counts both
deletions and merges into a sibling article.

Each score is one reviewer's judgment, and the factual errors they cite still
need confirming when we fix them. Treat the verdicts as a strong prior, not a
final ruling.

| # | Series | Score | Verdict | Articles | Cut % (articles) | Cut % (words) |
|---|---|---|---|---|---|---|
| 1 | foam | 7 | keep, finish (index, homepage, 02 pressure error) | 3 | 0 | 0 |
| 2 | noether | 6 | trim (07, 15) | 15 | 13 | 12 |
| 3 | cohomology | 6 | keep, serious fix pass (05 Betti, 06 Z/2 lift) | 6 | 0 | 0 |
| 4 | decision-trees | 6 | trim (07, 08) | 8 | 25 | 25 |
| 5 | lithium-ion | 6 | restructure: merge 01-03 | 7 | 29-43 | 25 |
| 6 | modular-forms | 5 | restructure: cut 13, 14, 17, 18; merge 02+05, 06+09 | 20 | 35 | 27 |
| 7 | grateful-dead | 5 | trim: cut MFCC, merge two | 7 | 43 | 35 |
| 8 | game-is-the-math | 5 | trim + fact-check; survivors about 40% shorter | 15 | 33 | 38 (about 60 after shortening) |
| 9 | bioinformatics | 5 | restructure into about 8 essays (TP53 spine) | 15 | 47 | 20 |
| 10 | sph | 5 | trim 04, maybe merge 03 into 01 | 4 | 25-50 | 7 |
| 11 | lattice-simulation | 5 | restructure: keep 02, 04, 06-09 | 15 | 60 | 58 |
| 12 | exceptional-atlas | 5 | restructure; owns Lie/E8/Leech; absorb PC 16 | 17 | 47 | 40 |
| 13 | parallel-coordinates | 5 | trim to the Inselberg core, 01-11 | 23 | 43 | 51 |
| 14 | mathematical-diagrams | 4 | restructure: keep 15-23 tier, 08 to exceptional-atlas | 23 | 52 | 37 |
| 15 | japan-earthquakes | 4 | restructure to 6-7 articles (co-author: check first) | 20 | 55 | 49 |
| 16 | emergence | 4 | restructure into about 12 essays by mechanism | 43 | 63 | 52 |
| 17 | algorithms-ml | 4 | restructure: keep GD, PCA, Bayes; fix backprop, RL | 12 | 58 | 57 |
| 18 | quasicrystals | 3 | rewrite from 01, or cut | 4 | 75-100 | 75-100 |
| 19 | topological-data-analysis | 3 | cut; fold 01's Rips builder into cohomology | 3 | 100 | 100 |
| 20 | autoresearch | 3 | cut (internal tooling docs, invented stats) | 13 | 100 | 100 |
| 21 | information-geometry | 2 | cut (e/m roles swapped, invented conjectures) | 15 | 100 | 100 |
| 22 | type-systems | 2 | cut; salvage 07 (symplectic drift) | 12 | 92 | 92 |
| 23 | atlas-of-atlases | 2 | cut (meta-index of the gallery) | 8 | 100 | 100 |
| 24 | directions | 2 | cut (roadmap brainstorm, rigged demos) | 24 | 100 | 100 |
| 25 | d3-power-tools | 2 | cut (skill-pack docs, wrong D3 code) | 37 | 100 | 100 |

## Totals

- About 228 of 369 articles go (62%), leaving about 140.
- About 330k of 560k words go (about 59%). The figure rises to about 65% once
  game-is-the-math's survivors are shortened.
- Seven whole series are cut: d3-power-tools, directions, autoresearch,
  atlas-of-atlases, information-geometry, type-systems and
  topological-data-analysis. That is 112 articles and 209k words, over a third
  of the site. Quasicrystals would make eight unless it is rewritten.

## Patterns behind the cuts

- Batch generation: a whole series written in one day, one template repeated
  (a hook, a named model, sliders, a one-line moral).
- Figures that pose as computation: hardcoded "results", hand-typed data labeled
  derived, `Math.random` standing in for real datasets, simulated LLMs.
- Late-series drift: series start strong, then stretch their frame into
  off-theme topics, where the errors cluster (parallel-coordinates 14-23,
  lattice-simulation 10-15, exceptional-atlas 08-10).
- Confident errors in places readers can't check: theorem statements, history,
  statistics, quotes.
- Topics duplicated across series: E8/Dynkin/Leech in four series; boids, SIR,
  Ising, Life and lattice Boltzmann in three.

## Worth salvaging before deleting

- d3-power-tools: the navigation page's zoom figure, the projection
  morphing.
- directions: 21 (Cleveland-McGill), 22 (Simpson's quiz), 13 (sonification),
  as seeds for new essays.
- information-geometry: the math library; it could support about 4
  rewritten essays.
- type-systems/07, the rock-paper-scissors panel from 04, and TDA 01's Rips
  builder.

## Before cutting

- japan-earthquakes credits a co-author, Daniel Overstreet.
- Cutting information-geometry breaks links from modular-forms 14 and 20.
  Other cross-series links need a sweep after the cuts.
- Delete outright (git keeps the history) or move to an unlisted archive?

## Status (2026-09-24)

Batch 1 is merged. There are now 158 registered articles, down from 369, and
all 184 pages pass the render check. Per-track records, including errors
confirmed, errors rejected and unresolved items, are in `findings/<track>.md`.

| Series | Before | After |
|---|---|---|
| 7 whole-series cuts | 112 | 0 |
| emergence / lattice-simulation | 43 / 15 | 14 / 6 |
| exceptional-atlas / parallel-coordinates | 17 / 23 | 9 / 12 |
| algorithms-ml / bioinformatics / decision-trees | 12 / 15 / 8 | 6 / 8 / 6 |
| modular-forms | 20 | 14 |
| game-is-the-math | 15 | 10 |
| japan-earthquakes | 20 | 7 |
| quasicrystals | 4 (shells) | 4 (rewritten) |

Batch 2 was merged on 2026-09-24. There are now 139 registered articles, and all
163 pages pass the render check and the internal link check.

| Series | Before | After |
|---|---|---|
| mathematical-diagrams | 23 | 10 |
| noether | 15 | 13 |
| lithium-ion / sph | 7 / 4 | 5 / 2 |
| grateful-dead | 7 | 4 |
| foam / cohomology | 3 / 6 | 3 / 6 (foam gets an index and a homepage entry) |

Findings are in `findings/diagrams.md`, `noether.md`, `li-sph.md`,
`grateful-dead.md` and `foam-cohomology.md`.

Needs a human:
- The Nankai 30-year probability (japan/02, revised in 2025).
- The Japanese translations of rewritten japan paragraphs.
- Numbers in the emergence flocking and traffic prose (their workers left no
  notes).
- Citations marked "from memory" in the findings files.
- sph is Ian Johnson's series, imported from enjalot/moonshine, and batch 2 cut it
  from 4 articles to 2. Confirm with him, as was done for japan.
- The lithium-ion runaway-propagation parameters are the track's own modelling
  choices; they need a check by someone who knows battery safety.
- grateful-dead 03 colors songs by type using a hand classification.
- About 150 em dashes remain in untouched prose across noether and cohomology,
  left for the prose pass.

Batch 3, the prose pass, was merged on 2026-09-24. It ran as six tracks (data,
forms, sim, atlas, noether-games, applied) under `PROSE-BRIEF.md`; their
records are `findings/prose-<track>.md`. The site still has 163 pages, and all
of them pass the render check and the internal link check. Reader-visible em
dashes are at zero, apart from the exceptions below. Page titles use
"Title · Series". Prose cuts ranged from 3% to 21%, because the pages
restructured in batches 1 and 2 were already lean. The worst errors fixed by
confirmed derivation were in exceptional-atlas 09 (the Leech lattice built from
E₈³, and the Conway groups called quotients), noether 02 and 08, cohomology
02 and 03, and lithium-ion 03.

Em dash exceptions: sph (excluded until Ian OKs it), one language-neutral
missing-value mark in japan 06, and the unregistered `lib/test.html` pages.

Needs a human, from batch 3 (details in the findings files):
- Japanese translations for the seven English paragraphs changed in
  japan-earthquakes (`findings/prose-applied.md` lists old and new text).
- Figure: the lattice 06 status pill. (Fixed in 3399547: emergence 06 now fits
  its exponent live, noether 04 has a genuinely anisotropic potential, and PC 11
  Fig 5 solves for weights and flags points in non-convex dents.)
- Specialist checks:
  - modular-forms 10: the Shimura/CM attribution, the Frey conductor
    normalisation, and saying that FLT for n = 3 and 4 is classical.
  - The Gannon proof date (2012 or 2016).
  - The Lepowsky–Meurman 1982 citation (EA 09).
  - The Delsarte bound values.
  - The Extra-Trees default m (decision-trees 03).
  - The Inselberg collision-detection claim (PC 09).
- Numbers never rerun:
  - Traffic wave speeds and jam fronts (emergence 03).
  - "Ten million flips per second" (lattice 06).
  - The Domineering and Hex solve dates.
- Dead navigator JS in EA 06.
- Open structural suggestions: merge PC 08 into 05; possibly cut deeper in
  game-is-the-math 07, 09 and 10.

## Batch 4: figure and pedagogy pass (2026-09-24)

The pass ran as six tracks under `FIGURE-BRIEF.md`; their records are
`findings/figures-<track>.md`. All 163 pages pass the render check and the
internal link check.

- Every series now has a dark theme that follows `prefers-color-scheme`, with
  no toggle. Each series keeps its own `lib/theme.css` / `theme.js` (japan and
  lithium-ion use `shared/`), and colors drawn from JS are resolved hex. The
  homepage and the `motion.js` banners follow the same scheme.
- Figures fit a 390px screen. Before, 680-720-unit viewBoxes put text at 5-7px
  on a phone, and wide equations made most pages scroll sideways.
- Every figure surface has a role and a label, and clickable parts can be
  reached from the keyboard. Dense EA figures use a roving tabindex.
- Animations respect `Motion.reduced()` and pause off screen. Physics figures
  no longer open empty.
- About 25 redundant figures were cut or merged (mostly in noether,
  parallel-coordinates, EA and bioinformatics).
- Real bugs fixed:
  - noether 03's brachistochrone ran uphill.
  - lithium-ion's SEI rate constant was about 1600x too large.
  - The fundamental-domain outline in mf 07 didn't line up with its heatmap.
  - An uppercase CSS rule mangled the maths in coh 04.
  - Unclosed CSS blocks disabled whole stylesheets in EA 08 and games 10.
  - lattice 06's Fig 3 caption said "undershoot" where the points overshoot.
- PC 05's wine data was fabricated: only 3 of its 179 rows matched UCI, and
  the "Phenols" column held ash. It is now the real `wine.data` (fce2cc7).

Needs a human, from batch 4:
- **Audit every embedded dataset that claims a real source** against that
  source. PC 05 shows the batch-generated pages invented "real" data.
- Captions that still say left/right for panels that stack on a phone: dt 01
  Fig 2, dt 04, lithium-ion 05, and some in EA.
- Mouse-only paths:
  - emergence 01 cell editing and lattice 05 obstacles.
  - The EA 04 diagram builder.
  - Building a loop on the coh 04 sphere and dragging in coh 06.
  - PC 12's Shift+drag rotation (touch can't reach it).
  - Small touch targets: PC 10 joint limits, Hackenbush edges.
- Figure-content issues:
  - The emergence 08 Fig 3 caption says the discharge grows "downward from a
    point"; in the model it hugs the grounded edges.
  - The japan 07 caption mentions a dashed line the timeline never draws.
  - The japan 06 strike-slip arrows point the wrong way, and its "deep"
    label is clipped.
  - The Fig 5 "Regime" label in emergence 13.
- Readouts that lean toward KPI cards: dt stat panels, coh 01/05 Betti
  readouts, EA 03/05/09, noether workshop verdict bars, and games score cards.
- Structural suggestions:
  - EA 09 has 14 figures and could take a deeper cut.
  - Possible merges: EA 02 Figs 2-3, EA 05 Figs 3-4, and the irrep bar in
    both mf 12 and 13.
  - PC 05 and 08 overlap: the outlier-drag and process-monitor figures are
    the same interaction on different data.
- The per-series `theme.css` files map colors by exact hex value, so a new
  color added to a figure stays light in dark mode.
