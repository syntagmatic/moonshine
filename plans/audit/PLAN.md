# Project audit plan

I want to audit the whole gallery and the `/shine` skill. Most of it was written
with Opus 4.5, which left a recognizable set of weaknesses: prose tics,
confident but unverified math and history, figures that look right but compute
something else, interactions that were never clicked, and dashboard creep. The
goal is to find and fix those problems with evidence, not to reformat 370k lines
mechanically.

## Baseline (2026-09-23)

- 400 HTML pages across 26 series, about 370k lines. The largest page is
  `exceptional-atlas/13` at 5.6k lines.
- The load-time render sweep is already clean (d0127b0): 397 of 398 pages pass.
  Only load-time errors are covered so far. Nothing has exercised interactions.
- Signal counts (pages hit / 400):

| Signal | Pages | Note |
|---|---|---|
| em dash | 315 | 1,860 occurrences; AGENTS.md bans them |
| "not X but Y" / "isn't just" | 15 | the Opus 4.5 contrast tic |
| slop vocabulary (crucial, seamless, intricate...) | 30 | |
| callout / kpi / badge / metric classes | 40 | possible dashboard creep |
| `Math.random` | 111 | unseeded: figures change on every reload, and some may fake data |
| `Motion.reduced()` | 60 | but 300 use raw `prefers-reduced-motion` and 109 use rAF |
| IntersectionObserver | 46 | animations probably run while off screen |
| aria-label / role | 36 | |
| keyboard handlers | 20 | |
| `<figcaption>` | 12 | |
| meta description | 0 | |

- Registration drift: `foam/` has three essays but no entry on the homepage.
  `japan-earthquakes` claims 20 articles and keeps them in subdirectories.
  `galois-theory`, `representation-theory` and `simone-weil` have plans but no
  pages.

## Principles

- Scripts find problems and judgment fixes them. Each em dash gets a rewrite of
  its sentence, not a swap to a comma or colon.
- Correctness comes first. Wrong math in a figure costs more than any amount of
  slop in the prose.
- Work one series at a time, one commit per series per phase, so any regression
  bisects cleanly.
- Findings go to `plans/audit/findings/<series>.md`, where they can be read in
  later sessions.

## Phase -1: Cut first

Cut before auditing, so nothing gets polished that is about to be deleted.
Ranking and estimates: `CUTS.md`; per-article verdicts: `reviews/`.

## Phase 0: Tooling

Build `scripts/audit/` (Node, no dependencies beyond the Playwright that
render-check already uses):

1. `lint.mjs` runs cheap static checks per page and writes
   `plans/audit/scorecard.json`. It covers every signal in the baseline table,
   plus:
   - broken relative links and missing `vendor/` assets
   - series-index card count vs. the files on disk vs. `count` in
     `docs/index.html`
   - footer back-links
   - `:root --c-*` color drift between articles in the same series
   - `var(--` values reaching d3 scales
   - `<title>` present and unique
2. `interact.mjs` extends render-check. On each page it finds sliders, buttons,
   selects, draggable SVG elements and scrub targets. It exercises each one at
   desktop and 390px widths, then records page errors, NaN/Infinity in SVG
   attributes, elements outside the viewport, horizontal scroll, and controls
   that change nothing in the DOM (dead controls).
3. A screenshot sheet for each series at both widths, in light and dark, saved
   to scratch. A reviewer looks at it once; it doesn't go into the repo.

Gate: both scripts run over the full gallery in one command, and we have a
committed baseline scorecard.

## Phase 1: Structural and mechanical fixes (whole site)

These are low-judgment fixes, done in one pass:
- Register `foam`, reconcile every `count`, fix broken links and footers.
- Standardize the reduced-motion path on `Motion.reduced()`. Pause off-screen
  animation loops with IntersectionObserver.
- Replace `Math.random` with a seeded PRNG wherever the figure is meant to be
  reproducible. Randomness is legitimate in places (a "shuffle" button); leave
  those, but record them.
- Add meta descriptions and a sensible `<title>` to every page.
- Fix every error `interact.mjs` finds. A crash on an interaction path is a bug.

## Phase 2: Correctness review (per series, highest risk first)

Order: exceptional-atlas, parallel-coordinates, modular-forms, cohomology,
information-geometry, noether, quasicrystals, topological-data-analysis,
mathematical-diagrams, then the rest. One subagent per series, each with a
fixed brief:
- Check every equation, theorem statement, numeric constant, date, attribution
  and quote. Mark each one verified, wrong, or unverifiable. A citation or
  quote that can't be sourced gets cut or softened.
- For each figure, read the code and confirm it computes what the prose claims.
  Look especially for hardcoded "results" posing as computation, sliders wired
  to cosmetic parameters only, and simulations that are really animations.
  (Precedent: in parallel-coordinates/18, the rotation direction was reversed.)
- Check that the colors in equations and the `.t-*` prose classes match the
  figure encodings.

Output: `findings/<series>.md`, with each finding tagged severity, then fixed.
Anything unverifiable goes to a human.

## Phase 3: Prose pass (per series)

- Rewrite every em-dash sentence. Also rewrite contrast tics, tricolons,
  bolded lead-ins, "The key insight" headers, grand closing summaries, and
  hedged filler. Use the humanizer skill's catalog as a checklist, not as an
  autopilot.
- Series continuity: no repeated intros, no forward references to articles
  that don't exist, consistent notation across articles.
- Dashboard creep: remove the callout boxes and metric grids found in Phase 0,
  or turn them into prose or figures.
- Rerun lint afterwards. The target is zero em dashes and zero slop-list hits,
  without new tics substituted in their place.

## Phase 4: Figure and pedagogy pass (per series)

- Each figure earns its place, and figures in the same article differ in chart
  type or in data, not only in their controls.
- Dense single-screen layouts. No hover-only information, since touch devices
  can't reach it. Labels don't collide at 390px. Dark mode keeps contrast.
- Accessibility floor: every interactive SVG gets a role and label, controls
  are reachable by keyboard, and figures have captions.
- Review the screenshot sheets here and nowhere else.

## Phase 5: The skill itself

Audit `plugins/moonshine/*.md` (1.5k lines) with the writing-for-agents skill:
- Remove guidance that only existed to correct Opus 4.5 habits. Keep what still
  prevents failures, based on the problems Phases 2-4 actually found.
- Fold the lessons from this audit back in: seeded randomness, Motion.reduced,
  interaction-path verification, a correctness-verification step, and the
  failure modes that turned up most often.
- Reconcile the scaffold (CDN URLs) and the output path with this repo's
  conventions, or document the split clearly.
- Consider shipping `lint.mjs` / `interact.mjs` with the plugin, so authors run
  them before delivering.

## Phase 6: Plans hygiene

Triage `plans/`: archive plans whose series have shipped, and mark the three
page-less plans as active or shelved.

Done 2026-09-25. `plans/` now holds one PROMPT.md per live series, describing
the series as it stands after the audit; old plans live in git history.

## Cost and ordering

Phases 0-1 take one session. Phases 2-4 cost about one subagent per series
per phase (26 series), which is the bulk of the work; batch them 3-5 series
per session. Phase 5 needs the findings, so it runs last. Phase 6 can run at
any time.

## Open decisions

1. Scope of the prose pass: every series, or only the "Math" and "Concept
   Explorations" categories first? Recommendation: all of them, highest-traffic
   first.
2. Work-in-progress series: audit them to the same bar, or only for
   correctness?
3. Should the audit scripts ship in the plugin (Phase 5), or stay repo-only?

## Next-session prompt

> Start Phase 0 of plans/audit/PLAN.md. I want `scripts/audit/lint.mjs` and
> `scripts/audit/interact.mjs` built and run over all of `docs/`. Reuse
> Playwright the same way ~/.claude/scripts/render-check.mjs does. Write the
> baseline scorecard to plans/audit/scorecard.json and summarize the worst
> twenty pages per category. Don't fix anything yet.
