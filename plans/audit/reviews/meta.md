# Group "meta": directions + autoresearch

Both series were added on 2026-04-10 (commits f457d73, 6ff4e1b, 9d72be9, 447c646). Neither one explains an idea
for an outside reader. Both are internal material about the sibling repo ~/git/d3-power-tools: its
autoresearch loop and its product roadmap, written up in the gallery's essay format.

## autoresearch (13 articles + index, ~17k words)

What it is: documentation of d3-power-tools' `iterate-block.py` loop (see ~/git/d3-power-tools/notes/AUTORESEARCH.md,
scripts/iterate_lib.py, evals/iterations/history.tsv). The core facts check out against the repo: the -0.3 composite
gate, the LOC gate, the 0.30/0.25/0.25/0.20 weights, the rule that 3 discards in a row stop the run, worktree + squash, and bee-swarm exp 27/28
244->241. Articles 01-07 describe the system as it runs today. Articles 08-13 propose improvements and illustrate them with simulated data.

Fabricated or suspect claims:
- 01: "Karpathy's 2025 thread on autoresearch". karpathy/autoresearch is a 2026 repo (train.py / val_bpb loop), so the year is
  probably wrong. The paraphrase saying Karpathy thought "the hardest part was bookkeeping" has no source and looks invented.
- 02: "Score distribution across 107 blocks" and the dimension correlations (~0.45, ~0.12, ~0.25) come from 11 anchor
  blocks padded out with mulberry32(42) random scores (02-the-scorecard.html ~l.1048). The page presents them as real statistics.
  The calibration story ("three prompt revisions", "shifted ~15% of pairwise rankings", blocks 1-42/43-84 splits) has
  no source in the repo.
- 04: the scatter uses real history rows, but the per-dimension deltas are synthesized from the composite with a sin() hash
  (l.1105-1140). The 4-slider panel therefore re-classifies invented data.
- The articles contradict each other. Collapsible-tree keep rate is 77% in 03 and 20/27 = 74% in 07. Hierarchy-bundles has 20 experiments in 03 and 83
  in 07's data. Cost per experiment is $0.05-0.10 in 03 and $0.15 in 07/12. Audit noise is "±0.25" in 04 and "±0.5" in 12. The real overall
  keep rate in history.tsv is 135/231 = 58%, where 04 says ~65%.
- 09: adaptive-weight example states two formulas (with and without base weight) and gives 0.42/0.08 and 0.43/0.07.
- "Sonnet-generated" and model-specific claims will go stale.

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-the-loop | 2 3 3 2 | MERGE -> single "autoresearch" essay (or d3-power-tools repo docs) | Accurate loop description with real data in Fig 2. The Karpathy date and quote are suspect. Fig 3 is a toy (1+1)-ES with random fitness |
| 02-the-scorecard | 2 2 2 1 | CUT | 107-block distribution and correlations are seeded RNG shown as findings. Duplicates gallery d3-power-tools/visual-critic, encoding-integrity, cognitive-load, stress-test pages |
| 03-the-trajectories | 2 3 2 1 | MERGE -> 01 | Real trajectories, but three archetypes padded to ~1.4k words. Its cost numbers contradict 07 |
| 04-the-threshold | 3 3 3 2 | MERGE -> 01 | Draggable threshold over real history rows is the best figure in the series. Per-dim panel runs on synthesized data |
| 05-the-proposer | 2 2 2 1 | CUT | Prompt-template walkthrough. Internal docs |
| 06-the-tracks | 2 2 2 1 | CUT | Lists three decision predicates. Much of it covers a track that was never built |
| 07-the-yield | 2 2 2 1 | CUT | Leaderboard and budget sliders over hardcoded numbers that disagree with 03 |
| 08-vision-auditor | 1 1 2 1 | CUT | Proposal. The "simulated vision audit" has planted bugs and no model behind it |
| 09-reward-shaping | 2 2 2 1 | CUT | Generic Pareto/adaptive-weights material that contradicts itself. Speculative |
| 10-proposer-strategies | 1 1 2 1 | CUT | Taxonomy plus a random simulator that "shows" scheduling wins by construction |
| 11-context-distillation | 1 2 2 1 | CUT | Token-budget arithmetic for an 8K window that isn't the real constraint. Proposal |
| 12-ensemble-auditing | 2 2 2 1 | CUT | Standard median-of-N argument. Noise numbers inconsistent with 04 |
| 13-transfer-learning | 1 1 2 1 | CUT | Proposal with an invented anecdote (three parallel-coords blocks) |

Series: 3/10. CUT from the gallery. It describes one person's tooling as a series of essays, most of it with
invented statistics, and 6 of 13 pieces propose features that were never built. Anything worth keeping (01+03+04, about 4k words,
real data) belongs in d3-power-tools' own docs or as one essay. It also overlaps heavily with the gallery's d3-power-tools
series (visual-critic.html, stress-test.html, encoding-integrity.html, cognitive-load.html).

## directions (24 articles + index, ~83k words)

What it is: the index says it outright: "24 interactive explorations of where two sibling projects could go next".
It is a product-roadmap brainstorm (moonshine + d3-power-tools) with each idea stretched to 2.3-5.5k words. Every page
follows the same template: "What if..." pitch, generic survey of existing tech, a simulated demo, then a "risks" callout. Pages also
cross-reference each other as a numbered roadmap ("Directions 1-4 considered authoring... 21 proposed perceptual_accuracy") and
cite internal repo files (scripts/test-viz.py, generate-blocks-gemini.py, best-blocks.json).

Fabricated, wrong, or stale:
- 06: the DuckDB vs JS latency bars come from invented power laws (`0.5*(n/1000)^0.6`, "sublinear, columnar"). A full-scan
  GROUP BY is O(n) in DuckDB too, and the figure is fake.
- 11: the "LLM" is keyword matching (`q.includes('outlier')`, l.1073-1126). 09's AI annotations are a hardcoded array (l.1325).
- 14: "d3.format(',d') ... No locale parameter. The comma is hardcoded". This is wrong: `,` means "use locale grouping" and
  d3.formatDefaultLocale / d3.formatLocale change it.
- 16: "15-20 percent of the population has dyslexia" repeats an advocacy upper bound. Clinical prevalence is usually 5-10%.
- 15: "39 million blind" is the 2010 WHO figure. Current estimates are ~43M.
- 21: Cleveland-McGill never measured color saturation experimentally, so "errors of 50% or more" is unsupported. The angle-bias claim is garbled.
- 22: the page says "The overall numbers above are real", but the hospital data is invented (the Simpson arithmetic itself checks out).
- 12/24: "d3-power-tools ships 37 skills". The repo now has 29 in skills/. 23 benchmarks "gpt-4o, llama-70b", which are stale model names.
- 07: attribution of Plot to Bostock + Philippe Rivière is correct. 16: the WCAG 2.2 date (Oct 2023) and SC 3.3.7/3.3.8 are correct. 13: WHO 2.2B is correct.
- Craft: no em dashes, but "X is not Y" constructions are frequent (11 and 16 worst), 27 colored risk callouts, listicle
  "three formats / five layers / four strategies" structure throughout.

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-collaborative-visualization | 2 2 2 1 | CUT | Pitch plus a fake two-cursor demo. Generic CRDT/WebSocket survey |
| 02-narrative-grammars | 2 1 2 1 | CUT | JSON spec sketch for a nonexistent runtime. No figure |
| 03-explanation-templates | 2 2 2 1 | CUT | Five archetypes on toy data. It restates the skill's own docs |
| 04-version-controlled-visualization | 2 2 2 1 | CUT | Scripted five-commit diff. Ends by pointing at autoresearch |
| 05-streaming-visualization | 2 2 2 1 | CUT | Ring buffer + LTTB tutorial with synthetic stream. Encyclopedic |
| 06-sql-in-the-browser | 2 1 2 1 | CUT | DuckDB overview. Latency figure is invented |
| 07-observable-plot-bridge | 2 2 2 1 | CUT | Plot vs D3 comparison, a docs-level summary |
| 08-serverless-rendering | 2 1 2 1 | CUT | Playwright/jsdom/resvg survey tied to d3-power-tools scripts |
| 09-ai-assisted-annotation | 2 1 2 1 | CUT | LLM pipeline pitch. Annotations hardcoded |
| 10-adaptive-complexity | 2 2 2 1 | CUT | Engagement-signal speculation |
| 11-natural-language-queries | 2 1 1 1 | CUT | "LLM" demo is string matching. Heaviest "not X" pattern |
| 12-skill-composition-engine | 2 2 2 1 | CUT | Internal tooling idea. Stale skill count |
| 13-sonification | 3 3 2 2 | CUT (salvage candidate) | Most substantive page, but it is a survey. A real sonification essay would start over |
| 14-multilingual-explanations | 2 2 2 1 | CUT | Localization checklist with a factual error about d3.format |
| 15-tactile-visualization | 2 1 2 1 | CUT | Swell paper/3D print survey. Stale stat |
| 16-cognitive-accessibility | 2 2 1 1 | CUT | Inflated prevalence stats. Slogan-heavy |
| 17-portable-components | 2 1 2 1 | CUT | Web Components tutorial, 4.6k words, one control |
| 18-notebook-integration | 2 1 2 1 | CUT | 5.5k words, one control. Jupyter/Observable pitch |
| 19-print-and-static-export | 2 2 2 1 | CUT | Export how-to. Belongs in d3-power-tools docs |
| 20-embeddable-microexplanations | 2 2 2 1 | CUT | Embed-format table plus pitch |
| 21-perceptual-testing | 3 2 2 2 | CUT (salvage candidate) | Cleveland-McGill is a real idea, but claims are garbled and it is framed as roadmap item 21 |
| 22-explanation-effectiveness | 3 3 2 2 | CUT (salvage candidate) | Pre/post Simpson's quiz is the one real interactive, but the data is labeled "real" |
| 23-cross-model-benchmarks | 1 1 2 1 | CUT | Protocol pitch for internal scripts. Stale models |
| 24-skill-ecology | 2 2 2 1 | CUT | Internal skill dependency graph. Stale count. Overlaps gallery d3-power-tools series |

Series: 2/10. CUT whole. This is a planning doc, not a set of explanations. Every figure except 22 simulates
something that doesn't exist, and several simulations are rigged (06 latency, 11 "LLM", 09 annotations). About 83k words of
roadmap brainstorm dilute the gallery and date quickly (skill counts, model names). If anything survives, it should be rewritten from
scratch as a standalone essay in a relevant series: 21 (encoding accuracy, with a real estimation experiment), 22
(Simpson's paradox), 13 (sonification). The roadmap itself belongs in plans/ or the d3-power-tools repo.

## Overlap outside the group
- Gallery `d3-power-tools/` series (37 pages): visual-critic, stress-test, encoding-integrity, and cognitive-load pages duplicate
  autoresearch 02. Skill pages duplicate directions 12/24's skill ecology. That series' own count (37) is also stale against the repo's 29 skills.
- grateful-dead/02 and d3-power-tools/exploratory-design also cite Cleveland-McGill (directions 21).
