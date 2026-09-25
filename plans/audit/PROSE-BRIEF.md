# Track brief: prose pass over one series cluster

The gallery has been cut from 369 articles to 139. What survives computes real
things and says true things, but most of the prose was written by an older
model, and it reads that way: em dashes everywhere, contrast tics, tricolons,
bolded lead-ins, summaries that restate the section, and paragraphs twice as
long as they need to be. I want each article to read as if a careful person
wrote it for Distill. Your track owns one cluster of series and does this pass
on them (Phase 3 of `plans/audit/PLAN.md`).

## Setup (you are in your own git worktree)

- Fast-forward to main first: `git merge --ff-only main`. Fresh worktrees can
  start at an old commit.
- `docs/vendor/` is gitignored, so link it in before anything renders:
  `ln -s /Users/kai/git/moonshine/docs/vendor docs/vendor`.
- To serve, run `python3 -m http.server <port> -d docs` on the port your
  prompt gives you.
- Read `AGENTS.md` and the Anti-Slop section of `plugins/moonshine/SKILL.md`.
  Use the humanizer skill's pattern catalog as a checklist, not an autopilot.
- Skim your series' review in `plans/audit/reviews/` and findings in
  `plans/audit/findings/` so you know what the last track already fixed and
  what it left for you.

## What to change

1. **Em dashes in reader-visible text: zero.** That includes prose, captions,
   figure labels, tooltips, and strings that JS writes into the page. Code
   comments don't matter. Rewrite the sentence; don't just swap in a colon,
   semicolon or parentheses everywhere, or you've made a new tic. En dashes in
   number ranges (1990–2000) are fine.
2. **Slop patterns.** "Not X, but Y" and "It's not just X" constructions,
   tricolons used for rhythm, bolded lead-in phrases, "The key insight" and
   "Why this matters" headers, rhetorical questions answered in the next
   sentence, grand closing summaries, hedged filler, "Let's" openers, and
   inflated words (crucial, profound, elegant, beautiful, remarkable).
3. **Length.** Cut what doesn't teach. The target is roughly 20 to 30 percent
   shorter prose with no lost content. Repetition between the prose and the
   figure caption is the easiest place to cut.
4. **Series continuity.** No intro that re-explains what the previous article
   covered; a one-line pointer back is enough. No forward references to
   articles that don't exist. Consistent notation and terminology across the
   series.
5. **Dashboard creep.** Callout boxes, metric grids, status badges and
   "takeaway" cards become prose or go away.

## What not to change

- Math, numbers, claims, citations and figure code. If you think one is wrong,
  write it in your findings file with your reasoning; fix it only if you have
  confirmed it (derivation, computation, or primary source).
- Structure. Don't merge, split or renumber articles. The last pass did that.
- A voice that already works. Some articles are good; leave their good
  paragraphs alone.
- Anything outside your series directories and your findings file.

## Gate before committing

- Reader-visible em dashes across your series: zero. Check with a script that
  strips `<script>` and `<style>` blocks and HTML comments, and separately
  grep the JS for string literals containing `—`.
- `node ~/.claude/scripts/render-check.mjs http://localhost:<port>/<series>/<page>`
  passes on every page you touched.
- Re-read two articles end to end after your edits and judge honestly whether
  they're better, not just different. If a rewrite reads worse, revert it.
- Commit on your worktree branch, staging only your own files. Don't merge
  and don't push.

## Findings file: `plans/audit/findings/prose-<track>.md`

- Per series: rough prose word count before and after, em dashes before and
  after
- Suspected errors you noticed but didn't fix, with your reasoning
- Anything that needs a human

## Report back

At most 400 words: branch name, final commit, the before/after numbers, the
worst patterns you found, and anything unresolved. Everything else goes in the
findings file.
