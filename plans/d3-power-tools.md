# D3 Power Tools — 37 Moonshine Skill Explainers

Interactive demonstrations of every visualization skill in `d3-power-tools`. Each article teaches one technique and uses that technique on itself.

## Context

- **Audience:** Practitioners who want to build better D3 visualizations. Not a beginner tutorial; assumes familiarity with D3 basics and focuses on judgment calls.
- **Quality target:** SPH-standard. Prev/next footer nav, shared semantic color vocabulary, IntersectionObserver on toggle-based rAF loops, ResizeObserver on canvas.
- **Output:** `docs/d3-power-tools/<slug>.html`, one file per skill (semantic slugs, not numbered).
- **Index:** `docs/d3-power-tools/index.html` — SPH-typography card grid grouped into eight categories, with a 5-color pipeline header viz.
- **Source:** The series explains the skills documented in [d3-power-tools](https://github.com/kaidrumm/d3-power-tools).

## The unifying skeleton

Every visualization is a chain:

> *Data becomes marks through a channel, the viewer acts through interaction, and the designer guides attention with highlight.*

Every skill in this series teaches one link in that chain. The color vocabulary below encodes those five roles.

## Color vocabulary spec

Shared across all 37 articles and the index page. Declared in each file's `:root` block.

```css
:root {
  --c-data:      #2563eb;  /* blue    */
  --c-mark:      #8b5cf6;  /* violet  */
  --c-channel:   #0891b2;  /* teal    */
  --c-interact:  #f59e0b;  /* amber   */
  --c-highlight: #10b981;  /* emerald */
}

.t-data      { color: var(--c-data);      font-weight: 600; }
.t-mark      { color: var(--c-mark);      font-weight: 600; }
.t-channel   { color: var(--c-channel);   font-weight: 600; }
.t-interact  { color: var(--c-interact);  font-weight: 600; }
.t-highlight { color: var(--c-highlight); font-weight: 600; }
```

### Role meanings

| Var | Role | Where it maps in each skill |
|---|---|---|
| `--c-data` | Raw values / records | Rows, points, edges, pixels — the input to every chart |
| `--c-mark` | Visual marks | Dots, lines, bars, paths, shapes rendered from data |
| `--c-channel` | The mapping apparatus | Scales, axes, colormaps, projections, the code that turns numbers into pixels |
| `--c-interact` | User input | Brushes, drags, hovers, clicks, keystrokes, scroll |
| `--c-highlight` | Annotations / focused subset | Callouts, selected marks, emphasized regions, tooltips |

### Rules for applying the vocabulary

1. **Figures reference the vars directly** — SVG stroke/fill via CSS vars; canvas via `getComputedStyle(document.documentElement).getPropertyValue('--c-mark')` so recoloring is a one-line change.
2. **Prose uses the `.t-*` classes** — wrap key nouns in `<span class="t-mark">mark</span>` when you want a prose word to echo a figure color. First mention is usually enough; don't overdo it.
3. **`--accent` equals `--c-data`** (`#2563eb`). Data is the default subject; existing blue strokes keep working without edits.
4. **Per-article local palettes are allowed.** Many articles will declare skill-specific vars (e.g. `--c-voronoi`, `--c-path-a`). Keep them. The shared vocabulary is a base layer, not a ceiling.
5. **Not every article uses every var.** Cartography barely has "interaction"; Sparkcharts barely has "channel". Skip what doesn't apply.
6. **Never use the vocabulary for decorative color.** Categorical palettes for non-semantic distinctions (e.g. six arbitrary party colors) are NOT `--c-*` vars.

## The 37 Skills (reading / nav order)

### Seeing Patterns (5)
- **`parallel-coordinates.html`** — See relationships across many dimensions at once.
- **`brushing.html`** — Ask questions with your hand.
- **`linked-views.html`** — Multiple views that reveal different aspects of the same data.
- **`coordination.html`** — The event bus that lets charts talk to each other.
- **`distributions.html`** — Show the distribution, not just the summary. (H1: "The Shape of Data")

### Seeing Structure (5)
- **`hierarchy-layouts.html`** — Choose the right layout for the insight.
- **`hierarchy-interaction.html`** — Navigate large trees without losing context.
- **`edge-bundling.html`** — Reveal connection patterns in dense graphs.
- **`force.html`** — Let structure emerge from constraints. (H1: "Force-Directed Layouts")
- **`network.html`** — Pick the right representation for the graph. (H1: "Four Views of One Network")

### Seeing Place (1)
- **`cartography.html`** — Maps as analytical instruments.

### Seeing Change (4)
- **`time-series.html`** — Time as a first-class dimension.
- **`motion.html`** — Guide the eye with movement.
- **`choreography.html`** — Orchestrate multi-stage transitions.
- **`shape-morphing.html`** — Show continuity between states.

### Making It Legible (6)
- **`scales.html`** — Map data to visual space correctly.
- **`color.html`** — Color as encoding, not decoration.
- **`visual-texture.html`** — A second channel beyond color.
- **`annotation.html`** — Tell the viewer what matters.
- **`data-table.html`** — An equal representation, not a fallback. (H1: "Data Tables as Visualization")
- **`canvas-accessibility.html`** — Make Canvas visible to everyone.

### Making It Work (4)
- **`canvas.html`** — When SVG runs out of room. (H1: "Canvas Rendering")
- **`webgl.html`** — When Canvas runs out of room. (H1: "WebGL for Massive Datasets")
- **`navigation.html`** — Move through visual space. (H1: "Zoom and Navigation")
- **`responsive.html`** — Fit any container without losing meaning. (H1: "Responsive Means Redesigning")

### Before You Render (4)
- **`exploratory-design.html`** — Find the data's natural form.
- **`data-gathering.html`** — Get data into shape.
- **`sparkcharts.html`** — Charts at the size of a word. (H1: "Sparklines")
- **`small-multiples.html`** — Repeat to compare.

### Meta (8)
- **`d3-idioms.html`** — Code style that communicates intent.
- **`jig-template.html`** — Multi-skill assembly.
- **`visual-critic.html`** — Design quality evaluation.
- **`encoding-integrity.html`** — Data honesty.
- **`stress-test.html`** — Interaction robustness. (H1: "Interaction Stress Testing")
- **`cognitive-load.html`** — Clarity and working memory.
- **`calibrate-tool.html`** — Measure skill effectiveness.
- **`sharpen-tool.html`** — Audit and compress skills.

Total: **37**. The prev/next footer chain follows this reading order.

## SPH audit status

- **Pass 1 — Footer nav:** ✅ 37/37. All articles have SPH prev/next footers linking through the series.
- **Pass 2 — Semantic colors:** ✅ 37/37. The `--c-*` vars and `.t-*` classes are declared in every file's `:root`.
- **Pass 3 — Color-coded KaTeX:** ⚫ **No-op.** This series avoids formal math notation; no article uses KaTeX.
- **Pass 4 — Viewport-aware animations:** 🟡 **Partial — outstanding.** The following files have `requestAnimationFrame` loops that may warrant IntersectionObserver treatment. Review each case-by-case; bounded self-terminating loops (fade-ins, progress animations) don't qualify, but unbounded toggle-based loops do:
  - `canvas-accessibility.html`, `canvas.html`, `choreography.html` (IO already present), `jig-template.html`, `motion.html`, `navigation.html`, `parallel-coordinates.html`, `responsive.html`, `stress-test.html`, `time-series.html`
- **Pass 5 — ResizeObserver:** 🟡 **Partial — outstanding.** Most articles don't have `ResizeObserver`. Add on a per-file basis for canvas figures and fixed-size SVG. Files that already have RO: `responsive.html`, `small-multiples.html`, `sharpen-tool.html`, `time-series.html`, `jig-template.html`.
- **Pass 6 — Prose anti-slop:** ✅ 37/37. Em dashes cleaned from prose; title-tag separators left intact.

## Known article-local palettes to preserve

Some articles declare skill-specific vars alongside the shared vocab. Don't delete them — they are the fine-grained layer on top of the base vocabulary. (Exact list will be added as they surface during Pass 4/5 work.)
