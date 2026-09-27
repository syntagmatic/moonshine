# Critique: Review a Moonshine Article

A second reader for a finished article. The author's own Verify phase (Phase 5 in `SKILL.md`) checks the work from the inside; the critique reads it cold, the way a skeptical editor would, and reports what it finds. Run it on your own article before delivering, or on anyone's article when asked for a review.

Adapted from the critique skill in [enjalot/moonshine](https://github.com/enjalot/moonshine).

## Setup

1. **Find the article.** Use the path the user gives. With no path, take the most recently modified article under `~/.agent/moonshine/` (or the repo's output directory), and ask when that's ambiguous. For a series, critique one article at a time unless asked for the whole series; for a whole series, also grade whether the articles build on each other.
2. **Load the standards.** Read `SKILL.md` (the ledger, Verify, Editorial, Anti-Slop, Design Principles, Pedagogy), plus `ARTICLE.md` and `VISUALS.md` for the scaffold and figure patterns. These are the bar. Don't grade against rules you haven't read.
3. **Read the source and the rendered page.** Read the HTML, then open it in a browser (headless is fine). Look at it at desktop width and at 390px, in light and dark mode, and with reduced motion on. Use the controls: drag, click, tab through them, push sliders to both ends. A short script that loops over those configurations beats doing it by hand. This repeats checks from the author's Verify phase on purpose: recheck them rather than trusting it.
4. **Find the ledger** (`LEDGER.md` beside the article, or wherever the project keeps it). A missing ledger is a finding, and so is one whose current state is split across files or out of date with the page; grade against the newest record and say which you used.

## Hard Rules

1. **Critique, don't fix.** Don't rewrite the prose or the code. Quote short passages as evidence and describe what should change, not how to implement it.
2. **Evidence for every finding.** Each one points at something concrete: a quoted sentence, a figure and what it shows at its default state, a CSS value, a control and what it did. "It feels generic" is not a finding.
3. **Steelman first.** Before the problems, say what the article does well and why it works. Knowing what to keep is half of a useful review.
4. **Grade strictly.** Grades run S, A, B, C, D, F, with + and - allowed. S means exceptional, not "no complaints". A is strong, C is passable, F is broken.
5. **Check, don't infer.** A caption is true only if the rendered figure shows it. A claim is sourced only if the ledger entry names a source you could open. Reading the code is not the same as watching the figure.

## Scorecard

Grade each dimension S through F, with evidence.

| # | Dimension | What to check |
|---|-----------|---------------|
| 1 | **Article, not dashboard** | Prose carries an argument and each figure makes one step of it visible. No KPI cards, metric grids, stat tiles, status pills, stacks of shadowed cards, colored callout boxes. |
| 2 | **Claims** | Sample 8 to 10 checkable claims from the prose and captions (numbers, dates, attributions, theorem statements, dataset facts), favoring the ones the argument leans on. Each should have a ledger entry that is derived, computed or sourced from a primary source. Recompute or look up at least three yourself. Flag any claim with no entry, any "sourced" entry citing a secondary summary, and any named dataset that isn't the real file. |
| 3 | **Captions match figures** | For every figure, each visual claim in its caption and the prose around it (what rises, what crosses, which color is which, left or right) is true of the rendered figure at its default state, in both themes and at phone width. |
| 4 | **Figures compute** | Displayed values come from running the model or data at runtime, not canned answers. Verdict readouts (pass/fail, converged/diverged) can be driven to both outcomes. Random figures are seeded, so the page matches its caption on every load. |
| 5 | **Prose** | Plain, specific, calm. Sentences have actors and mechanisms. Watch for performance in place of explanation: slogan or teaser headings, talking about the page ("this essay shows"), dramatic setups and reveals, personified numbers or models, closing maxims, summary endings, em dashes. |
| 6 | **Dead compliance** | Prose can pass every rule and still be lifeless: correct but unsurprising paragraphs, examples that prove the claim too neatly, a rhythm so even that nothing seems discovered. Good prose carries pressure: a concrete detail a stranger wouldn't guess, a real countercase, the point where the model breaks. |
| 7 | **Narrative progression** | A sequence of ideas, not a collection of sections. Each section needs the one before it. The key insight is reached, not announced. |
| 8 | **Figure pedagogy** | Interesting before touched: the default state shows the effect the prose describes, without the reader doing anything. Exaggerated defaults are labeled with the real value. Animations slow enough to follow; loops reset cleanly; one visual convention per concept across figures. |
| 9 | **Interaction** | Each interaction lets the reader test a claim, not just watch. The pattern fits the job (details-on-demand, explorable, linked views, scroll-driven, animated transition). No blank canvases or "click to start". Would a static figure have taught as much? |
| 10 | **Robustness** | No console errors, NaN or empty figures at any slider extreme. At 390px: no sideways scroll, SVG text at least 11px, panels stack. Dark mode legible. Every control reachable and operable by keyboard; hover content also on focus and tap. Reduced motion shows a final or static state. |
| 11 | **Visual specificity** | The swap test: if a different topic could reuse the design with only the text changed, it is too generic. Moonshine type stack or deliberate alternatives; a palette drawn from the subject; concept colors consistent between equations, prose and figures. No glows, pulses, gradient heroes, emoji headers. |
| 12 | **Hierarchy and typography** | Key insight, context, and technical detail are distinguishable at a glance. 18-20px body, 1.5-1.6 line height, 60-75 character lines (measure one: a body paragraph's character count over its rendered line count). Structure comes from type and whitespace. |

## Repairing Prose

When citing a prose problem, name what the sentence is doing and what it hides. Most performed sentences hide an actor, a mechanism, or a boundary. The repair direction usually fits this shape:

> Under [condition], [actor] does [behavior] because [mechanism]. The pattern breaks when [boundary].

Describe the repair direction; don't write the replacement sentence.

## Output

1. **Steelman.** One paragraph: what works and why, citing specific elements.
2. **Verdict.** One line: PUBLISH (minor issues only), REVISE (fixable without rethinking the approach), or RETHINK (the progression, concept, or core figures don't work). A wrong claim in the prose or a caption that contradicts its figure rules out PUBLISH.
3. **Scorecard.** The 12 dimensions, each with a grade and its evidence.
4. **Top findings.** The 3 to 5 issues that matter most, in order. For each: what (with evidence), why it matters to the reader, and the repair direction.
5. **Claims checked.** Every sampled claim with its ledger status, marking the ones you recomputed or looked up and what you found.
6. **Prose audit.** Sentences that perform instead of explain, quoted, with what each hides and the repair direction: all of them up to ten, otherwise the ten worst and the total count.
7. **Other issues.** Anything else, briefly.

Begin the critique immediately.
