---
name: article
description: HTML scaffold, CSS foundation, shared helpers, layout patterns, and series structure for moonshine explanations
---

# Article Structure

How moonshine articles are built as self-contained HTML files: the scaffold, its CSS and helpers, layout patterns, and series structure.

## Tech Stack

Self-contained HTML, vanilla JS, D3 v7, and KaTeX when there is math, loaded from pinned CDN URLs. Open the file in a browser and it works. If the pages must render offline or inside a network-restricted sandbox, download those files next to the pages and point the tags at the local copies.

## Output Location

```
~/.agent/moonshine/project-name/
  index.html          # Self-contained article (HTML + CSS + JS)
  LEDGER.md           # Claims and how each was checked (see SKILL.md)
  data/               # Real datasets, as fetched from their source
```

For a series:

```
~/.agent/moonshine/project-name/
  index.html          # Series index: intro prose, then article cards
  01-first-concept.html
  02-second-concept.html
  LEDGER.md
  data/
```

## HTML Scaffold

Every article starts from this template. Dark mode, phone layout, reduced motion, and scrolling equations are built in; keep them when you edit.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Article Title · Series Title</title>
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
<!-- With math:
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@400;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  color-scheme: light dark;
  --article-width: 740px;
  --body-font: 'Source Serif 4', Georgia, serif;
  --heading-font: 'Source Sans 3', system-ui, sans-serif;
  --mono-font: 'Source Code Pro', monospace;
  --body-size: 1.125rem;
  --line-height: 1.6;
  --text: #1a1a2e;
  --text-2: #4a4a6a;
  --accent: #2563eb;
  --accent-light: #dbeafe;
  --bg: #fafafa;
  --fig-bg: #ffffff;
  --border: #e2e2e8;
  /* Series concept colors (--c-*) go here, with dark values below. */
}
@media (prefers-color-scheme: dark) {
  :root {
    --text: #e4e4ec; --text-2: #a9abbf;
    --accent: #60a5fa; --accent-light: #1e3a5f;
    --bg: #14161b; --fig-bg: #1c1f26; --border: #353945;
  }
}

body {
  font-family: var(--body-font); font-size: var(--body-size); line-height: var(--line-height);
  color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased;
}

.article { max-width: var(--article-width); margin: 0 auto; padding: 2rem 1rem 6rem; }
h1, h2, h3 { font-family: var(--heading-font); font-weight: 700; line-height: 1.2; }
h1 { font-size: 2.5rem; margin: 0 0 0.5rem; }
h2 { font-size: 1.5rem; margin: 3rem 0 1rem; }
h3 { font-size: 1.15rem; margin: 2rem 0 0.75rem; }
p { margin: 0 0 1rem; }
a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
.subtitle { font-family: var(--heading-font); font-size: 1.15rem; color: var(--text-2); }

.figure { margin: 2rem 0; padding: 1.5rem; background: var(--fig-bg); border: 1px solid var(--border); border-radius: 6px; }
.figure svg, .figure canvas { display: block; max-width: 100%; }
.figure-wide { margin-left: -2rem; margin-right: -2rem; }
.figure-caption { font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2); margin-top: 0.75rem; }
.figure-label { font-weight: 600; color: var(--text); }
.readout { font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2); min-height: 1.4em; font-variant-numeric: tabular-nums; }

.margin-note { font-size: 0.8125rem; color: var(--text-2); line-height: 1.4; border-left: 2px solid var(--border); padding-left: 0.75rem; margin: 1rem 0; }

.controls { display: flex; align-items: center; gap: 0.75rem 1rem; flex-wrap: wrap; margin-bottom: 1rem; font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2); }
.controls input[type="range"] { width: 160px; max-width: 100%; accent-color: var(--accent); }
.controls button { font: inherit; min-height: 32px; padding: 0 0.75rem; }

svg text { font-family: var(--heading-font); }
svg .axis text { font-size: 11px; fill: var(--text-2); }
svg .axis line, svg .axis path { stroke: var(--border); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Wide equations scroll inside their own box, never the page. */
.katex-display { overflow-x: auto; overflow-y: hidden; padding: 2px 0; }

@media (max-width: 640px) {
  h1 { font-size: 1.75rem; }
  .figure { padding: 1rem 0.75rem; }
  .figure-wide { margin-left: 0; margin-right: 0; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
}
</style>
</head>
<body>
<div class="article">
  <header>
    <h1>Title</h1>
    <p class="subtitle">A clear one-sentence description of what the reader will understand.</p>
  </header>

  <!-- Sections: an h2, prose, and figures. A figure:
  <div class="figure" id="fig-1">
    <div class="controls">...</div>
    <div class="fig-body"><svg role="img" aria-label="What the figure shows, in one sentence."></svg></div>
    <p class="readout" aria-live="polite"></p>
    <p class="figure-caption"><span class="figure-label">Figure 1.</span> What to notice.</p>
  </div> -->

  <footer style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2);">
    <p>Built with <a href="https://github.com/enjalot/moonshine" style="color: var(--text-2);">moonshine</a>.</p>
  </footer>
</div>

<script>
// ── Shared helpers ──

// Seeded random numbers: the figure the reader sees matches the caption you wrote.
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(42);

// A CSS color resolved to its current value. d3 scales, interpolators and
// canvas need this; they cannot read var(--x).
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = () => matchMedia('(max-width: 600px)').matches;

// Draw at the container's width, and redraw when it changes or the OS
// switches between light and dark. Observe a wrapper whose width CSS sets
// (.fig-body), so the drawing's own height can't retrigger it.
function responsive(el, render) {
  let w = 0;
  const draw = () => render(el.clientWidth);
  new ResizeObserver(() => {
    if (el.clientWidth > 0 && el.clientWidth !== w) { w = el.clientWidth; draw(); }
  }).observe(el);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
}

// An animation that runs only while its figure is on screen. With reduced
// motion it never starts; showFinal draws the end state instead.
function loop(el, frame, showFinal) {
  if (reducedMotion()) { showFinal(); return; }
  let raf = null;
  const tick = t => { frame(t); raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && raf === null) raf = requestAnimationFrame(tick);
    else if (!e.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }).observe(el);
}

// Arrow keys for anything draggable. onStep(dx, dy) gets unit steps, x10
// with Shift; it should move the element and update aria-valuetext.
function keyHandle(node, label, onStep) {
  d3.select(node).attr('tabindex', 0).attr('role', 'slider').attr('aria-label', label)
    .on('keydown', e => {
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!d) return;
      e.preventDefault();
      const k = e.shiftKey ? 10 : 1;
      onStep(d[0] * k, d[1] * k);
    });
}

// State coordination (see below). Each figure lives in its own IIFE.
const state = {};
const dispatch = d3.dispatch('update', 'select', 'hover');
</script>
</body>
</html>
```

## CSS Foundation

**Type stack:**
- `--body-font` (Source Serif 4): article prose
- `--heading-font` (Source Sans 3): headings, captions, controls, SVG text
- `--mono-font` (Source Code Pro): inline code, data values

**Color palette:** `--text` / `--text-2` for text, `--accent` / `--accent-light` for interactive elements and highlights, `--bg` / `--fig-bg` / `--border` for structure. Every color has a dark value in the `prefers-color-scheme: dark` block.

**Colors in figures.** In D3 `.style()` calls and CSS, reference the palette as `var(--text)`, which follows dark mode on its own. Anything that computes with a color (a d3 scale or interpolator, `d3.color`, canvas fills, blending) needs the resolved value: `css('--accent')`. Resolve at render time, so the `responsive` redraw picks up the dark values. A figure color that isn't in the palette gets its own custom property with a dark value, never a hex literal in the JS.

**Semantic colors.** For a series, define a small set of concept colors as `--c-*` custom properties (for example `--c-kernel`, `--c-density`), each with a dark value. Use them wherever the concept appears: figures, KaTeX equations (`\color{#hex}{}`, which needs the resolved hex), prose (`.t-*` utility classes), and scales anchored to a concept color. Define the vocabulary in the plan and copy the `:root` block into every article of the series.

## Layout Patterns

**Wide figures:** `.figure-wide` lets a data-dense figure break out of the 740px column on desktop; on a phone it falls back to full width.

**Phone layout:** design each figure for 390px as well as desktop. Draw at the container's width with `responsive()` rather than scaling a fixed `viewBox` (a 700-unit viewBox shrinks 11px labels to 6px). Under 600px (`narrow()`), stack multi-panel figures vertically, thin the ticks, and shorten labels. When panels stack, captions say "top/bottom" or name the panel instead of "left/right".

**Figure captions:** every figure gets one: `<span class="figure-label">Figure N.</span>` then what the reader should notice. Write it after the figure runs, from what it actually shows. It is editorial judgment, not alt text; the `aria-label` on the SVG carries the literal description.

**Readouts:** a live value goes in a one-line `.readout` sentence under the figure ("Step 12: loss 0.043, still falling"), with reserved height so the page doesn't jump. Not a grid of stat cards.

**Sparklines in headers:** a small inline chart (60-80px wide) in the header gives an immediate visual hook when the article's primary data has a natural shape.

**Margin notes:** `.margin-note` for context that would interrupt the narrative as a parenthetical.

**Scroll-driven layout:** the figure stays sticky while text steps scroll past. Under 640px, drop the side-by-side layout and put the figure above the steps.
```css
.scroll-container { display: flex; gap: 2rem; }
.scroll-figure { position: sticky; top: 2rem; flex: 1; height: fit-content; }
.scroll-steps { flex: 1; }
.step { min-height: 60vh; padding: 2rem 0; }
@media (max-width: 640px) { .scroll-container { flex-direction: column; } .scroll-figure { position: static; } }
```

**Math:** KaTeX. `katex.render(expr, el, { throwOnError: false, displayMode: true })` for display math, `katex.renderToString(expr, { throwOnError: false })` for inline. The scaffold's `.katex-display` rule keeps wide equations from scrolling the page; for very long ones, break the line with `aligned`.

**Reactive math:** when a draggable handle's value appears in a nearby formula, re-render the formula on each drag tick, keeping the symbolic form alongside, and color-match the substituted number to the handle. See "Live Formulas" in `VISUALS.md`.

**Hover cross-references:** a term in prose can highlight its element in a nearby figure. Use `data-ref="name"` attributes and one shared handler bound to `pointerenter`, `focus`, and `click`, so it works on touch and from the keyboard (give the prose term `tabindex="0"`).

**Equations and code:** when pairing an equation with pseudocode, stack them (equation above), color-code the variables in both, and use a light code background so the colored variables stay readable.

## Article Series

When a concept is too large for one article, break it into a series in which each piece stands alone.

**Index page:** the index is itself an article: introductory prose that frames the series, then a card list. The header can carry a small visual (sparkline, small chart) that gives a sense of the subject.

Each card has a title, a one-sentence description of what the reader will learn, optionally tags naming the visualization techniques, and a small thumbnail (80-120px): an inline SVG that abstracts the article's main figure.

```html
<div class="card-list" style="display: flex; flex-direction: column; gap: 1rem; margin: 2rem 0;">
  <a class="card" href="01-first-concept.html" style="display: block; background: var(--fig-bg); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem 1.5rem; text-decoration: none;">
    <div style="font-family: var(--mono-font); font-size: 0.8rem; color: var(--text-2);">01</div>
    <div style="font-family: var(--heading-font); font-weight: 700; font-size: 1.2rem; color: var(--text); margin-bottom: 0.4rem;">Article Title</div>
    <p style="font-size: 0.95rem; color: var(--text-2); margin: 0;">One sentence about what the reader will learn.</p>
    <div style="font-family: var(--heading-font); font-size: 0.75rem; color: var(--accent); margin-top: 0.6rem;">scatter plot &middot; brushing &middot; linked views</div>
  </a>
</div>
```

**Footer navigation:** each article's footer links back to the series index and to the next article, plus attribution and data credits. Link only to pages that exist; add the "Next" link when the next article is written. Page titles follow "Article Title · Series Title".

```html
<footer style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2);">
  <p>Part of <a href="index.html" style="color: var(--text-2);">Series Title</a>. Next: <a href="02-next.html">Next Article</a>.</p>
  <p>Data: <a href="https://source.example/dataset">Dataset name</a>, publisher, year. Built with <a href="https://github.com/enjalot/moonshine" style="color: var(--text-2);">moonshine</a>.</p>
</footer>
```

## State Coordination

Cross-chart communication without a framework: `d3.dispatch` is the event bus, and a shared state object is the source of truth.

```js
const dispatch = d3.dispatch("select", "hover", "filter");
const state = { selected: new Set(), hovered: null, param: 0.5 };

// Chart A listens
dispatch.on("select.chartA", (keys, source) => {
  if (source === "chartA") return;   // skip its own events: no redraw loop
  state.selected = new Set(keys);
  renderChartA();
});

// Chart B emits, naming itself as the source
brushGroup.on("brush end", event => {
  if (!event.selection) return;
  const keys = data.filter(d => inBrush(d, event.selection)).map(d => d.id);
  dispatch.call("select", null, keys, "chartB");
});
```

For deeper state (zoom + filter + sort + brush), use a store:

```js
function createStore(init) {
  let s = { ...init };
  const subs = new Set();
  return {
    get: () => s,
    set(u) { s = { ...s, ...u }; for (const fn of subs) fn(s); },
    sub(fn) { subs.add(fn); return () => subs.delete(fn); },
  };
}
```

## Responsive

`responsive(el, render)` in the scaffold covers resizing: it observes the `.fig-body` wrapper, whose width CSS sets, and passes the width to `render`. Build every scale and layout from that width inside `render`.

Use pointer events (`pointerenter`/`pointerleave`/`pointerdown`) rather than mouse events; they unify mouse, touch, and pen. Touch targets need at least a 24px hit area: give small marks an invisible larger hit circle or a Voronoi overlay.
