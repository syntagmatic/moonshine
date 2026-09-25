# AGENTS — Cohomology series

How two (or more) agents work on this series at once without colliding.

## The work unit is a brief

Each essay is described by one self-contained brief in [`briefs/`](briefs/). A brief is sufficient context: math content, figure spec, color tokens, cross-references, dependencies. A fresh agent can open a brief, read [the spine](README.md), and start writing the HTML — without reading any other essay's brief.

## Claiming a brief

1. Pick an unclaimed brief from `briefs/`. Files named `NN-slug.md` are available.
2. Rename it: `git mv briefs/NN-slug.md briefs/NN-slug.claimed.md`.
3. Add a row to [`CLAIMS.md`](CLAIMS.md) with your session name and the date.
4. Write the essay at `/workspace/moonshine/docs/cohomology/NN-slug.html`.
5. When done: rename the brief to `NN-slug.done.md`, update `CLAIMS.md`.

The `.claimed.md` / `.done.md` suffix is the lock. It is visible in `git status` and in any `ls` of the directory. Two agents claiming the same brief is a merge conflict that surfaces immediately.

If you find a brief in `.claimed.md` state but the claim row in `CLAIMS.md` is more than 24 hours stale with no progress, that brief is recoverable: rename back to `NN-slug.md`, leave a note in `CLAIMS.md`, then re-claim.

## What is and is not yours

When you have claimed brief `NN`, **yours** are:

- `briefs/NN-slug.claimed.md` (you may edit it freely)
- `docs/cohomology/NN-slug.html` (you write it from scratch)

**Not yours** (do not edit without coordination):

- Other agents' claimed briefs or their HTMLs.
- [`README.md`](README.md), the locked spine. If your essay needs the spine to change, open a discussion in `CLAIMS.md` first.
- [`lib/coh-math.js`](../../docs/cohomology/lib/coh-math.js) — see "The library is frozen" below.
- Other moonshine series files outside `docs/cohomology/` and `plans/cohomology/`.

## The library is frozen

[`docs/cohomology/lib/coh-math.js`](../../docs/cohomology/lib/coh-math.js) has a deliberately committed API surface. Every essay consumes from this surface. **Do not extend the surface mid-series.**

If an essay needs a function that doesn't exist in `COH`, two options:

1. **Inline it in the essay HTML.** The function is local to that essay. Half a screen of math code in an essay is normal. This is the default.
2. **If the function is genuinely shared,** add a note to `CLAIMS.md` proposing the addition, name the brief(s) that need it, and wait for a maintainer-level decision before editing the lib.

Option 1 is correct ~90% of the time. The lib is the *shared* substrate, not the union of every essay's helpers.

## The shared color vocabulary is frozen

The CSS custom properties listed in the [spine](README.md#semantic-color-vocabulary) are the series' load-bearing palette. **All cohomology essays use these same tokens.** Do not introduce a new `--c-*` token mid-series; reuse `--c-coboundary` for any δ-like operator, `--c-cup` for any ring-structure visual, etc. If you genuinely need a new semantic role, add it to the spine's color block first.

The cohomological-degree palette (H⁰ blue, H¹ emerald, H² amber) is deliberately identical to the TDA series. Do not pick new colors for these.

## Writing voice and per-essay shape

Read the spine before starting your essay. Notable enforced conventions:

- **Distinct visual grammar per essay.** Read [the spine](README.md#shape)'s "per-explainer shape" block — your figure should *not* look like another essay's figure with different controls.
- 300–600 lines per essay HTML.
- One short comment for math-heavy code (explaining the geometry, not the implementation).
- No build step. Inline `<script>` and `<style>`. KaTeX from CDN. D3 v7 from CDN.
- ResizeObserver for any figure that depends on container width.
- `prefers-reduced-motion` guard on any non-essential animation.
- No external data files. Procedural generation via `COH` and `TDA`.

If your brief specifies a triangulation (e.g., "the 7-vertex minimal torus"), use exactly that triangulation. The lib provides canonical ones.

## Coordinating prose-level edits

If you find a typo or a small phrasing issue in another agent's done essay, fix it without asking. If you find a *substantive* issue (wrong math, wrong figure, broken interaction), file it as a row in `CLAIMS.md` under "Notes for next pass" — don't edit the other agent's essay.

## The TDA lib is upstream

`coh-math.js` loads `tda-math.js` first. The cohomology series **does not modify** `docs/topological-data-analysis/lib/tda-math.js`. If you find a bug there, fix it in a separate pass and note it in `CLAIMS.md`; do not bundle TDA-lib edits with a cohomology essay.

## When you finish

1. Rename `briefs/NN-slug.claimed.md` → `briefs/NN-slug.done.md`.
2. Update the row in `CLAIMS.md` (status → done, end date).
3. Update the phase checklist in [`README.md`](README.md#phase-state) if your essay closes out a phase.

## The minimum bar for "done"

- Essay HTML opens in a browser with no JS console errors.
- All interactive figures respond correctly to all named controls in the brief.
- All KaTeX renders.
- All cross-series links (TDA, exceptional-atlas, modular-forms) resolve.
- The H⁰/H¹/H² palette is used consistently. δ is red, cup is violet, cocycles are green.
- The essay is added to the cards array in `docs/cohomology/index.html`.

## When in doubt

The spine wins. The brief is your authoritative source; the spine is the brief's authoritative source. If the brief and spine disagree, the spine is right and the brief is buggy — propose a brief edit in `CLAIMS.md`.
