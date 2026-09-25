# Track brief: figure and pedagogy pass over one series cluster

The gallery's prose and correctness passes are done. What's left is the
figures, which are the reason these pages exist. I want every figure to earn
its place, to work on a phone, to work in dark mode, and to be usable without
a mouse. Your track owns one cluster of series and does this pass on them
(Phase 4 of `plans/audit/PLAN.md`).

## Setup (you are in your own git worktree)

- Fast-forward to main first: `git merge --ff-only main`.
- Link the vendored assets: `ln -s /Users/kai/git/moonshine/docs/vendor docs/vendor`.
- Serve with `python3 -m http.server <port> -d docs` on the port your prompt
  gives you. Stop it when you're done.
- Read `AGENTS.md`, the Anti-Slop and design sections of
  `plugins/moonshine/SKILL.md`, and your series' findings files in
  `plans/audit/findings/`.

## What to check, per figure

1. **Does it earn its place?** It computes or shows something the prose can't.
   Two figures in one article that differ only in their controls (same chart
   type, same data) get merged into one or one gets cut. A decorative figure
   that teaches nothing goes. When you cut a figure, fix the prose that
   pointed at it.
2. **Phone width (390px).** Take a Playwright screenshot of each page at
   390x844. Labels don't collide or clip, controls fit, nothing scrolls
   sideways. Fix the layout rather than hiding content.
3. **Dark mode.** Screenshot with `colorScheme: 'dark'`. Text and marks keep
   contrast, and no white canvas or hardcoded light fill sits on a dark page.
   Values passed through a d3 scale or interpolator must be resolved hex, not
   `var(--x)`.
4. **No hover-only information.** Anything shown only on hover must also be
   reachable by tap or click, or be visible by default.
5. **Accessibility floor.** Every interactive SVG or canvas has a `role` and
   an `aria-label` that says what it shows. Controls are real `<button>`,
   `<input>` or `<select>` elements, or have `tabindex` and key handlers.
   Every figure has a caption.
6. **Motion.** Animations check `Motion.reduced()` (from `docs/lib/motion.js`)
   and pause off-screen via IntersectionObserver. `Math.random` in a figure
   meant to be reproducible becomes a seeded PRNG. A shuffle button can stay
   random.

View each screenshot once, and write down what you saw. Don't re-read the
same PNG.

## What not to change

- Math, claims and what a figure computes, unless you find it's wrong. Then
  confirm it before fixing, and record it.
- Prose, beyond what a figure change requires. It was just rewritten.
- Structure. Don't merge, split or renumber articles.
- Anything outside your series directories and your findings file.

## Gate before committing

- `node ~/.claude/scripts/render-check.mjs http://localhost:<port>/<series>/<page>`
  passes on every page you touched.
- For every figure you changed, drive its main interaction headlessly
  (Playwright: drag, slide, click, or keyboard, whatever a reader would do),
  and confirm there are no errors and the display changes.
- No em dashes in any text you wrote.
- Commit on your worktree branch, staging only your own files. Don't merge and
  don't push.

## Findings file: `plans/audit/findings/figures-<track>.md`

- Per series: figures cut or merged, and why
- Layout, dark mode and accessibility fixes, briefly
- Randomness left in place deliberately, and why
- Anything you think is wrong but didn't fix, and anything that needs a human

## Report back

At most 400 words: branch name, final commit, figures cut or merged, the most
common problems, and anything unresolved. Everything else goes in the findings
file.
