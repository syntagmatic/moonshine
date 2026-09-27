---
name: moonshine
description: Build interactive explanatory articles of technical concepts, inspired by Distill.pub. Use when the user wants to explain a concept with an explorable essay, an interactive figure, or an article series.
user_invocable: true
---

# Moonshine: Interactive Technical Explanations

Moonshine turns a technical idea into an explorable article: prose that carries an argument, and interactive figures that let the reader test it. It follows [Distill.pub](https://distill.pub)'s view that distilling research is creative work worth doing well.

**Reference files:**
- `ARTICLE.md`: the HTML scaffold (with dark mode, phone layout, and the shared helpers built in), layout patterns, series structure. Read it before writing the first page.
- `VISUALS.md`: D3 patterns for interaction, motion, charts, data, and accessibility. Read the section for each figure type as you build it.
- `CRITIQUE.md`: a cold review of a finished article, with a scorecard and a verdict. Run it after Verify, or when asked to review an article.

## Articles, Not Dashboards

Everything else follows from this. An article has an author's voice and a progression of ideas; each figure sits inside that argument and exists to make one step of it visible. A dashboard has widgets that stand alone and compete for attention. When a design choice is unclear, ask whether it would feel at home in a Distill article or in a Grafana panel, and pick the article.

Show equations and their behavior through figures, not code listings. Keep pseudocode minimal and paired with its equation; show implementation code only when the article is about programming.

## The Ledger

Every checkable claim in an article goes in a **ledger**: each theorem, number, formula, date, attribution, quote, and dataset, with how you know it. An entry is one of:

- **Derived**: you worked it out, and the working is in the article or checked in code.
- **Computed**: a figure or a node script calculates it from the stated model or data.
- **Sourced**: you read it in a named primary source (paper, dataset, official catalog), not recalled it.

A claim with no ledger entry gets cut or reworded until it has one. Keep the ledger in the project directory (`LEDGER.md`) and update it as you write. This is the most important rule in the skill: in an audit of 400 generated articles, every series had wrong claims in its prose, and the costliest failures were confident inventions (a theorem number that doesn't exist, a quote nobody said, invented rows presented as a real dataset).

Rules that follow from the ledger:

- **Data is real or labeled simulated.** When a figure uses a named dataset (Iris, a USGS catalog, a published study), embed the real file, fetched from its source, and cite it in the caption. Otherwise the caption says "simulated" and the data carries no real names: "Study A", not a real consortium; never "simulated from the distributions of" a named dataset. Public datasets are almost always small enough to embed.
- **Figures compute what they show.** Every value a figure displays comes from running the stated model or data at runtime. A figure that animates a canned answer, or a readout that prints a hardcoded result, is cut or rebuilt.
- **Verdicts can fail.** A figure that reports pass/fail, same/different, or converged/diverged must be shown producing both outcomes. Try an input that should fail.
- **Models get tested.** Before building a figure on a model function (an integrator, a rate law, a classifier), run it in node against a known answer: a closed form, a textbook value, a conserved quantity, a limiting case.
- **Exaggeration is labeled.** Pedagogical defaults can exaggerate a parameter so the effect is visible, but the prose or caption gives the real value.

## The Process

Moonshine is a conversation, with checkpoints where you stop and confirm with the user. The two failures to steer around are jumping straight to scaffolding, and asking a few questions then writing the whole article in one pass.

### Phase 1: Story Discovery

Ask one or two questions at a time, starting with "What are you trying to explain?", and follow the thread until you know:

- **The concept**, specifically: not "machine learning" but "how gradient descent finds minima".
- **The audience**: what they already know, what is new.
- **The key insight**: the one thing the reader should leave understanding.
- **The progression**: what the reader must learn first, second, third to reach it.
- **The misconceptions**: what people get wrong, and how an interaction could expose it.

If the user gives full context up front, move faster.

**Checkpoint:** state back concept, audience, insight, and progression ("Here's what I think we're building...") and get a yes.

### Phase 2: Article Structure

Look at what already exists in the output directory first. A new series should not re-explain a topic an existing one covers; link to it instead.

Write a short outline, not code. For each section give its role in the progression, and for each figure a prose spec: what it shows, what the reader does, what they should learn, and **the claim it computes**. A figure whose claim you can't name is decoration; cut it. Each figure in a piece should differ from the others in chart type or data, not reuse one base view with new controls. Start from prose and static figures, and add interaction only where it lets the reader test a claim.

```
3. Following the slope: the gradient points downhill
   Interactive: drag a point on the surface; an arrow shows the gradient.
   Computes: the arrow is -grad f at the dragged point, from f's closed form.
```

Decide whether it is one article or a series, and for a series, its semantic color vocabulary (see CSS Foundation in `ARTICLE.md`). Start the ledger with the claims the outline depends on.

**Checkpoint:** share the outline. Ask whether the progression, the order, and the figure specs match what the user has in mind. Changes are cheap now.

### Phase 3: Build One Section

Build the most important interactive section first, from the `ARTICLE.md` scaffold. Open it in a browser and show the user: does the interaction teach what we intended, is the example well chosen, does the encoding make sense? Iterate until it works before building the rest.

### Phase 4: Complete the Article

Build the remaining sections, writing prose alongside each figure, since the prose frames what the reader should notice. Write each caption after its figure runs, from what the figure actually shows.

### Phase 5: Verify

The article is done when every item below holds. Check each one; don't infer it from the code.

1. **Ledger complete**: every checkable claim in the prose and captions has an entry, and every entry was checked this session.
2. **Captions match figures**: for each figure, each visual claim in its caption and the surrounding prose (what rises, what crosses, which color is which, left/right) is true of the rendered figure at its default state.
3. **Every control exercised**: click, drag, and key through every control in a real browser, including the extremes of each slider. No console errors, no NaN on screen, no empty figure on load, and each figure's default state shows the effect the prose describes before the reader touches anything.
4. **Phone width**: at 390px wide there is no sideways page scroll, SVG text is at least 11px, and multi-panel figures stack. Captions say "above/below" rather than "left/right" when panels stack.
5. **Dark mode**: with the OS in dark mode, every figure's text, lines, and fills are legible.
6. **Keyboard**: every interactive element is reachable with Tab and operable with keys; anything shown on hover also shows on focus and tap.
7. **Reduced motion**: with reduced motion on, animations show their final or a static state; loops run only while on screen.
8. **Anti-slop pass**: the Editorial and Anti-Slop sections below, applied line by line.

Then run a critique (`CRITIQUE.md`) as a cold second reader, and fix what it finds. Then deliver: tell the user what the article covers and anything in the ledger you could not verify.

### Output

Create projects in `~/.agent/moonshine/project-name/` unless the user or the repo names another location. Each article is a self-contained HTML file; see `ARTICLE.md` for the scaffold and series layout. Open the result in a browser.

## Editorial

Write like a knowledgeable colleague at a whiteboard: clear, humble, direct. Remove the performance and keep the explanation.

- State what things do and let the reader judge importance. Prefer "can", "tries to", "helps" over universal claims.
- Use commas, colons, periods, or parentheses where an em dash would go. Visible text has no em dashes.
- Short, direct sentences. If a paragraph builds toward a dramatic reveal, flatten it.
- Headings describe the section or ask its question; they don't tease.
- End a section when its point is made. No closing summary, "Takeaways" list, restatement of the article, or maxim that turns the point into a slogan.
- Captions say what to notice in the figure, not what the prose already said.
- Prose over numbered lists, unless the content really is a sequence.

Prose can follow every rule here and still be dead: correct, clear, and unsurprising. Add pressure, not ornament: a concrete detail a stranger wouldn't guess, a real countercase, the boundary where the model breaks.

## Anti-Slop

The test: does this look like an article a thoughtful person made, or like a dashboard or a generic AI page? Every rule here is a case of that test.

- **Numbers live in sentences.** A quantity goes in prose, a caption, or a one-line readout under the figure, never in KPI cards, metric grids, stat tiles, or status pills.
- **Structure comes from typography and whitespace**, not stacks of shadowed cards or colored callout boxes. If something matters, write it as a strong sentence in the text.
- **Visual choices relate to the content.** Use the moonshine type stack (Source Serif 4, Source Sans 3, Source Code Pro) or fonts chosen for the piece, and a palette drawn from the subject. The generic tells are Inter/system-ui everywhere, the default blue-and-purple accent pair, glows, pulsing animations, gradient borders, emoji headers, and gradient hero banners.
- **The swap test:** if you could swap in a different topic and nothing but the text would change, the design is too generic.

Adapted in part from the anti-slop patterns in [visual-explainer](https://github.com/nicobailon/visual-explainer) by nicobailon.

## Design Principles

From [Distill.pub](https://distill.pub) and the tradition of explanatory writing:

**Information hierarchy.** Three levels, always distinguishable: the key insight and its argument; context and definitions; technical detail, proofs, and edge cases (margin notes or expandable sections). Typography and spacing carry the hierarchy.

**Visual encoding.** Position and length are the most accurate channels; spend them on the most important quantity. Color suits categories, highlights, and dense or spatial fields. Encode redundantly (color plus position or shape) so color is never the only cue. Keep one visual language across all figures.

**Typography.** 18-20px body, 1.5-1.6 line height, 60-75 character lines, clear heading levels. KaTeX for math, monospace for code, margin notes over footnotes.

**Interaction patterns.**

| Pattern | Use when |
|---------|----------|
| Details-on-demand | Supplementary info would clutter the narrative |
| Explorable explanation | The concept has a parameter space to explore |
| Linked views | The same data has several meaningful representations |
| Scroll-driven narrative | The explanation has a natural sequence of reveals |
| Animated transition | The path between two states is itself meaningful |

## Pedagogy

**Exaggerate for clarity.** Choose defaults that make the phenomenon obvious: crank the viscosity, pick parameters where two methods clearly disagree. Label the exaggeration and give the real value (see The Ledger).

**Interesting before touched.** Every figure shows the concept on load: a default element selected, data populated, the simulation already in a telling state, pre-run if it needs time to develop.

**Slow enough to follow.** Animations move slowly enough to track cause and effect. When unsure, go slower; the reader can speed up.

**One convention per concept.** A radius drawn dotted in one figure is dotted in all of them; a variable colored blue in an equation is that blue everywhere.

**Loops reset cleanly.** A looping demonstration returns to its initial state each cycle, with no accumulated values carried over.

**Seeded randomness.** Random data and simulations use a seeded generator (`rng` in the scaffold), so the figure the reader sees matches the caption you wrote.
