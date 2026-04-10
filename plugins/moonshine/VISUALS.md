---
name: visuals
description: D3 v7 visualization patterns for interactive technical explanations
---

# Visuals

D3 v7 visualization patterns for moonshine explanations. Self-contained HTML, vanilla JS, no build tools.

## Foundation

### HTML Scaffold

Every moonshine explanation is a single HTML file: D3 from CDN, Google Fonts, inline CSS with custom properties, article container, figures with captions. No bundler, no framework.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Explanation Title</title>
<script src="https://d3js.org/d3.v7.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@400;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
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
}
body { font-family: var(--body-font); font-size: var(--body-size);
  line-height: var(--line-height); color: var(--text); background: var(--bg); }
.article { max-width: var(--article-width); margin: 0 auto; padding: 2rem 1.25rem 6rem; }
h1, h2, h3 { font-family: var(--heading-font); font-weight: 700; line-height: 1.2; }
.figure { margin: 2rem 0; padding: 1.5rem; background: var(--fig-bg);
  border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
.figure-caption { font-family: var(--heading-font); font-size: 0.85rem;
  color: var(--text-2); margin-top: 0.75rem; }
.figure-label { font-weight: 600; color: var(--text); }
.insight { background: var(--accent-light); border-left: 3px solid var(--accent);
  padding: 1rem 1.25rem; margin: 1.5rem 0; border-radius: 0 4px 4px 0; }
svg text { font-family: var(--heading-font); }
svg .axis text { font-size: 11px; fill: var(--text-2); }
svg .axis line, svg .axis path { stroke: var(--border); }
</style>
</head>
<body>
<div class="article">
  <header class="header"><h1>Title</h1></header>
  <div class="figure" id="fig-1"><!-- D3 renders here --></div>
</div>
<script>
// All visualization code here, in IIFEs to avoid globals
</script>
</body>
</html>
```

**Judgment:** The template uses `--text`, `--text-2`, `--accent`, `--bg`, `--fig-bg`, `--border` throughout. Reference these in D3 code via `"var(--text)"` in SVG style attributes. Never hardcode colors that the palette already defines.

**Pitfall:** Forgetting `box-sizing: border-box` causes padding to overflow figure containers. The reset on `*` prevents this globally.

### State Coordination

Cross-chart communication without a framework. `d3.dispatch` is the event bus; a shared state object is the source of truth.

```js
const dispatch = d3.dispatch("select", "hover", "filter");
const state = { selected: new Set(), hovered: null, param: 0.5 };

// Chart A listens
dispatch.on("select.chartA", keys => {
  state.selected = new Set(keys);
  renderChartA();
});

// Chart B emits
brushGroup.on("brush end", event => {
  if (!event.selection) return;
  const keys = data.filter(d => inBrush(d, event.selection)).map(d => d.id);
  dispatch.call("select", null, keys);
});
```

**Judgment:** Use `d3.dispatch` for 2-5 charts. For deeper state (zoom + filter + sort + brush), use a store:

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

**Pitfall:** Feedback loops. Chart A updates state, state triggers Chart A redraw, which re-emits. Fix: pass a `source` parameter and skip if the event originated from this chart. Or guard with `if (!event.sourceEvent) return`.

### Responsive Layout

Observe container size, not window. Redraw on resize with the new dimensions.

```js
const container = document.getElementById("fig-1");
const ro = new ResizeObserver(([entry]) => {
  const { width } = entry.contentRect;
  if (width > 0) render(width);
});
ro.observe(container);
```

Use `viewBox` only for decorative SVGs where text scaling does not matter. For charts with axes and labels, always redraw on resize so tick counts and font sizes adapt.

```js
const svg = d3.select("#fig-1").append("svg")
    .attr("viewBox", [0, 0, width, height]);
```

**Judgment:** Redraw > viewBox for any chart with readable text. viewBox shrinks 14px text to 7px at half width.

**Pitfall:** ResizeObserver infinite loop. If chart content changes container height, observer fires again. Fix: observe a wrapper with CSS-determined size, not chart-determined size. Set `overflow: hidden` on the wrapper.

Touch events: always use `pointerenter`/`pointerleave` over `mouseenter`/`mouseleave`. Pointer events unify mouse, touch, and pen.

## Interaction

### Controls

HTML controls (sliders, checkboxes, buttons) linked to shared state via dispatch.

```js
const slider = document.getElementById("param-slider");
const valSpan = document.getElementById("param-val");
slider.addEventListener("input", () => {
  state.param = +slider.value;
  valSpan.textContent = state.param;
  dispatch.call("filter", null, state);
});
```

CSS for controls (already in the scaffold):
```css
.controls {
  display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2);
}
.controls input[type="range"] { width: 160px; accent-color: var(--accent); }
```

**Judgment:** One slider per parameter. Checkboxes for on/off toggles. Radio buttons for mutually exclusive modes. Keep controls inside the `.figure` container, above the chart.

**Pitfall:** Using `change` instead of `input` on range sliders. `change` fires only on release; `input` fires continuously during drag for live feedback.

### Hover & Tooltips

Positioned HTML div, not SVG `<title>`. Show on `pointerenter`, hide on `pointerleave`, position near cursor and clamp to viewport.

```js
const tip = d3.select("body").append("div")
    .attr("class", "tip")
    .style("position", "fixed").style("pointer-events", "none").style("opacity", 0);

selection
  .on("pointerenter", (event, d) => {
    tip.html(`<strong>${d.name}</strong>: ${d.value}`).style("opacity", 1);
  })
  .on("pointermove", event => {
    const tw = tip.node().offsetWidth;
    const x = Math.min(event.clientX + 12, window.innerWidth - tw - 8);
    const y = Math.max(event.clientY - 32, 8);
    tip.style("left", `${x}px`).style("top", `${y}px`);
  })
  .on("pointerleave", () => tip.style("opacity", 0));
```

For sparse point charts, use Voronoi overlay so the hover target is the nearest point, not the point itself:

```js
const delaunay = d3.Delaunay.from(data, d => xScale(d.x), d => yScale(d.y));
svg.append("rect").attr("width", w).attr("height", h)
    .attr("fill", "none").attr("pointer-events", "all")
    .on("pointermove", event => {
      const [mx, my] = d3.pointer(event);
      const i = delaunay.find(mx, my);
      // highlight data[i], show tooltip at its position
    });
```

**Pitfall:** Positioning tooltip with `pageX`/`pageY` while using `position: fixed`. Use `clientX`/`clientY` for fixed positioning, `pageX`/`pageY` for absolute.

### Brushing & Selection

`d3.brush` for 2D, `d3.brushX`/`d3.brushY` for single axis. Selection drives data filter, dispatches to linked views.

```js
const brush = d3.brushX()
    .extent([[0, 0], [innerWidth, innerHeight]])
    .on("brush end", event => {
      if (!event.selection) { dispatch.call("select", null, []); return; }
      const [x0, x1] = event.selection.map(xScale.invert);
      const keys = data.filter(d => d.value >= x0 && d.value <= x1).map(d => d.id);
      dispatch.call("select", null, keys);
    });
g.append("g").call(brush);
```

Ghost/active pattern: draw the full dataset in light gray (background), then the selected subset in accent color (foreground).

```js
dispatch.on("select.chart", keys => {
  const sel = new Set(keys);
  const isActive = d => sel.size === 0 || sel.has(d.id);
  circles.attr("fill", d => isActive(d) ? color(d.cat) : "#ddd")
         .attr("opacity", d => isActive(d) ? 0.85 : 0.15);
});
```

Clear brush on click outside: in the brush `end` handler, `if (!event.selection)` means the brush was cleared.

**Pitfall:** Brush coordinates are pixels. After resize, they map to wrong data values. Convert to data domain before resize, restore after.

### Scroll-Driven Narrative

Sticky figure with scrolling text steps. IntersectionObserver detects which step is active; step index drives figure state.

```js
const steps = document.querySelectorAll(".step");
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) goToStep(+e.target.dataset.step);
  });
}, { threshold: 0.5 });
steps.forEach(el => observer.observe(el));

const stages = [showOverview, splitByGroup, highlightOutliers];
function goToStep(i) { stages[i](); }
```

CSS for sticky figure:
```css
.scroll-container { display: flex; gap: 2rem; }
.scroll-figure { position: sticky; top: 2rem; flex: 1; height: fit-content; }
.scroll-steps { flex: 1; }
.step { min-height: 60vh; padding: 2rem 0; }
```

**Judgment:** Step-based (discrete triggers) for most explanations. Progress-based (continuous scroll percentage) only when properties should scrub smoothly (e.g., rotating a 3D view).

**Pitfall:** goToStep must be idempotent. When scrolling backward, the chart must transition correctly from any state to the target step, not only from the previous step.

### Drag

`d3.drag` on SVG elements. Constrain to axis or bounds, dispatch parameter change.

```js
const drag = d3.drag()
    .on("drag", (event, d) => {
      d.x = Math.max(0, Math.min(width, event.x));
      d3.select(event.sourceEvent.target).attr("cx", d.x);
      dispatch.call("filter", null, { threshold: xScale.invert(d.x) });
    });
handle.call(drag);
```

**Pitfall:** Forgetting to set `cursor: grab` on the draggable and `cursor: grabbing` during drag. Without visual cues, users don't discover the interaction.

## Motion

### Transitions

Use `.transition().duration(ms)` on selections. Key functions for object constancy so elements track identity across data updates.

```js
svg.selectAll("circle")
  .data(data, d => d.id)
  .join(
    enter => enter.append("circle")
        .attr("r", 0).attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
      .call(e => e.transition().duration(500).attr("r", d => r(d.val))),
    update => update.call(u => u.transition().duration(500)
        .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))),
    exit => exit.call(e => e.transition().duration(300).attr("r", 0).remove())
  );
```

Interrupt previous transitions before starting new ones: `selection.interrupt()`.

Easing: `easeCubicOut` for responsive UI (fast start, gentle stop). `easeLinear` for continuous data playback. `easeCubicInOut` for smooth position changes.

**Pitfall:** Animating from undefined. If an element has no initial position, the transition starts from 0,0. Always set initial attributes in the enter callback before transitioning.

### Choreography

Sequence multi-stage transitions. Coordinated delays are more robust than `transition.end()` promises (which reject on interruption or empty selections).

```js
function staged(data) {
  const joined = svg.selectAll(".bar").data(data, d => d.id);
  const exitDur = 300, moveDur = 400, enterDur = 400;
  const moveDelay = joined.exit().empty() ? 0 : exitDur;
  joined.join(
    enter => enter.append("rect").attr("class", "bar")
        .attr("y", height).attr("height", 0)
      .call(e => e.transition().delay(moveDelay + moveDur).duration(enterDur)
        .attr("y", d => y(d.val)).attr("height", d => height - y(d.val))),
    update => update.call(u => u.transition().delay(moveDelay).duration(moveDur)
        .attr("y", d => y(d.val))),
    exit => exit.call(e => e.transition().duration(exitDur)
        .attr("height", 0).attr("y", height).remove())
  );
}
```

Stagger with delay: `.delay((d, i) => i * 30)`. Keep total stagger under 500ms.

For async sequencing: `await transition.end()` between stages. Wrap in try/catch since interrupted transitions reject.

Use `requestAnimationFrame` for custom animation loops (e.g., continuous force simulation rendering).

### Shape Morphing

Path interpolation via resampling: resample both source and target paths to N evenly-spaced points, then interpolate the arrays per frame.

Parametric morphs are simpler when shapes share parameters. Circle to rect via cornerRadius:

```js
const states = {
  circle: { w: 40, h: 40, rx: 20 },
  rect:   { w: 60, h: 40, rx: 0 },
};
function morphTo(s) {
  rects.transition().duration(600)
    .attr("width", s.w).attr("height", s.h).attr("rx", s.rx);
}
```

Bar to pie via arc parameter tweening: represent both states as arcs so D3 interpolates the angles and radii directly.

**Judgment:** Parametric morphs preserve true curves (circle stays circular). Resampling produces N-gons, visually smooth at 128 points. Use parametric when shapes share parameters, resampling only when they differ in topology.

**Pitfall:** `d3.interpolateString` on SVG path `d` attributes produces garbage when paths have different commands. Always use parametric interpolation or point resampling.

## Charts

### Line & Area

```js
const line = d3.line().x(d => x(d.date)).y(d => y(d.val))
    .defined(d => d.val != null)
    .curve(d3.curveBasis);
const area = d3.area().x(d => x(d.date))
    .y0(height).y1(d => y(d.val))
    .curve(d3.curveBasis);
```

Curve types: `curveBasis` for smooth, `curveStep` for discrete, `curveLinear` (default) for connecting points. `curveMonotoneX` for sparklines (no overshoot).

Multi-series: group data, one `<path>` per group. Confidence bands: area between `y0(d => y(d.lower))` and `y1(d => y(d.upper))`.

**Pitfall:** Missing `.defined()` on line generators. Without it, null values draw to (0,0), creating spikes that look like data crashes.

### Bar & Histogram

Vertical bars: `scaleBand` for x, `scaleLinear` for y. Horizontal: swap axes.

```js
const x = d3.scaleBand(data.map(d => d.name), [0, innerWidth]).padding(0.2);
const y = d3.scaleLinear([0, d3.max(data, d => d.val)], [innerHeight, 0]);

g.selectAll("rect").data(data).join("rect")
    .attr("x", d => x(d.name)).attr("width", x.bandwidth())
    .attr("y", d => y(d.val)).attr("height", d => innerHeight - y(d.val))
    .attr("fill", "var(--accent)");
```

Grouped bars: nested `scaleBand` within each category. Stacked: `d3.stack()` computes y0/y1 per layer.

Histogram: `d3.bin()` to bucket continuous data, then bar chart on the bins.

**Pitfall:** Bar charts must include zero in the y-domain. A bar from 50 to 80 makes 80 look almost double 50 if the baseline is at 50.

### Scatter & Bubble

Both axes `scaleLinear`. Size encoding: `scaleSqrt` for area perception, not `scaleLinear` on radius.

```js
const r = d3.scaleSqrt([0, d3.max(data, d => d.pop)], [2, 30]);
g.selectAll("circle").data(data).join("circle")
    .attr("cx", d => x(d.gdp)).attr("cy", d => y(d.life))
    .attr("r", d => r(d.pop))
    .attr("fill", d => color(d.region)).attr("opacity", 0.7);
```

Jitter for overlapping points: offset by small random amount. Density contours for very dense data: `d3.contourDensity()`.

**Pitfall:** Using `scaleLinear` for bubble radius. The eye reads area, not radius. A point with 4x the value should have 2x the radius (4x the area). `scaleSqrt` handles this.

### Heatmap & Matrix

Grid of rects, `scaleBand` for both axes. Color: `scaleSequential` + `interpolateBlues` (single-hue) or `interpolateViridis` (multi-hue, colorblind-safe).

```js
const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(matrix.flat())]);
g.selectAll("rect").data(cells).join("rect")
    .attr("x", d => xBand(d.col)).attr("y", d => yBand(d.row))
    .attr("width", xBand.bandwidth()).attr("height", yBand.bandwidth())
    .attr("fill", d => color(d.value));
```

Add cell labels when grid is coarse (cells > 30px): append `<text>` at cell center.

Adjacency matrix: same pattern, nodes on both axes. Sort by cluster then degree to reveal community structure as dense diagonal blocks.

### Network & Graph

Node-link: `d3.forceSimulation` with forces for link springs, charge repulsion, and centering.

```js
const sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(60))
    .force("charge", d3.forceManyBody().strength(-80))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", () => {
      linkSel.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
             .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      nodeSel.attr("cx", d => d.x).attr("cy", d => d.y);
    });
```

Chord diagram: `d3.chord()` + `d3.ribbon()` for group-to-group flow. Requires a square matrix.

Sankey: `d3-sankey` (separate import: `https://cdn.jsdelivr.net/npm/d3-sankey@0.12/dist/d3-sankey.min.js`).

Arc diagram: nodes on a line, links as curved arcs above/below.

**Judgment:** Node-link for topology (how things connect). Matrix for density (which pairs connect). Chord for flow volumes between groups. Sankey for quantities through a pipeline. Node-link becomes a hairball past ~500 nodes; switch to matrix.

### Hierarchy

Build the tree: `d3.hierarchy()` from nested data, `d3.stratify()` from flat id/parentId data.

```js
const root = d3.hierarchy(nested).sum(d => d.value).sort((a, b) => b.value - a.value);
```

Tree: `d3.tree().size([height, width])` for parent-child topology. Links via `d3.linkHorizontal()`.

Treemap: `d3.treemap().size([width, height]).padding(2)(root)` for size comparison within hierarchy. Each leaf gets `x0, y0, x1, y1`.

Pack: `d3.pack().size([width, height]).padding(3)(root)` for nested containment. Each node gets `x, y, r`.

Sunburst: `d3.partition().size([2 * Math.PI, radius])(root)` + `d3.arc()`. Map x to angle, y to radius. Apply `scaleSqrt` on radius so outer rings don't dominate.

Collapse/expand: toggle `node.children = node.children ? null : node._children`, recompute layout, transition.

**Judgment:** Treemap for size comparison (rectangles beat arcs and circles for area judgment). Tree for tracing paths. Pack for grouping. Sunburst for full hierarchy with depth. Wide and shallow (2-3 levels) favors treemap; narrow and deep (5+) favors sunburst.

### Distributions

Box plot: compute quartiles, whiskers, and outlier dots from sorted data.

```js
const sorted = Float64Array.from(values).sort();
const q1 = d3.quantile(sorted, 0.25), med = d3.quantile(sorted, 0.5);
const q3 = d3.quantile(sorted, 0.75), iqr = q3 - q1;
const whiskerLo = d3.min(sorted.filter(v => v >= q1 - 1.5 * iqr));
const whiskerHi = d3.max(sorted.filter(v => v <= q3 + 1.5 * iqr));
```

Violin: `d3.bin()` to build density, mirror as area left and right. Or use a Gaussian KDE. Bandwidth choice is editorial: too small creates false peaks, too large merges real modes.

Bee swarm: `d3.forceSimulation` with `forceX` pinning to data value and `forceCollide` preventing overlap. No `forceY`.

```js
d3.forceSimulation(data)
    .force("x", d3.forceX(d => xScale(d.value)).strength(0.8))
    .force("collide", d3.forceCollide(3).strength(0.7))
    .stop().tick(120);
```

Ridgeline: stacked area charts offset vertically by category. Render bottom-to-top so lower rows appear in front.

Strip/jitter: one axis categorical, other continuous. Add random offset for overlap.

**Judgment:** Box plot hides bimodality. Violin shows shape but hides individuals. Bee swarm shows every point but degrades past ~500 per group. Choose based on what matters: summary (box), shape (violin), or individual observations (bee swarm).

### Small Multiples

Grid of the same chart type repeated across categories. Shared scales for cross-panel comparison.

```js
const keys = [...d3.group(data, d => d.cat).keys()];
const cols = Math.ceil(Math.sqrt(keys.length));
keys.forEach((key, i) => {
  const col = i % cols, row = Math.floor(i / cols);
  const gPanel = svg.append("g")
      .attr("transform", `translate(${col * cellW}, ${row * cellH})`);
  renderPanel(gPanel, grouped.get(key), sharedX, sharedY);
});
```

Shared scales: compute domains from the full dataset before the per-panel loop. Independent scales hide magnitude differences, misleading viewers.

Only draw y-axis on leftmost column, x-axis on bottom row. Redundant axes waste 30-40% of each panel's pixel budget.

Synchronized interaction: brush in one panel broadcasts to all via dispatch. Guard with `if (!event.sourceEvent) return` to prevent infinite loops.

**Pitfall:** Creating scales inside the per-panel loop with `d3.extent(panelData)` accidentally produces independent scales. Compute shared domains once before the loop.

### Sparklines

Tiny line charts (60-80px wide, 20px tall). No axes, no labels. Context comes from surrounding text or table.

```js
const x = d3.scaleLinear([0, data.length - 1], [1, w - 1]);
const y = d3.scaleLinear(d3.extent(data), [h - 1, 1]);
const line = d3.line((d, i) => x(i), d => y(d)).curve(d3.curveMonotoneX);
svg.append("path").datum(data).attr("d", line)
    .attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 1.5);
svg.append("circle")
    .attr("cx", x(data.length - 1)).attr("cy", y(data.at(-1)))
    .attr("r", 1.5).attr("fill", "var(--accent)");
```

Embed in table cells or inline in prose. CSS: `svg { vertical-align: middle; margin: 0 2px; }`.

Band for normal range: area between `lo` and `hi` values behind the line. Dot for current value at the endpoint.

Use shared y-domains when sparklines sit side by side, or magnitude differences become invisible.

## Polish

### Scales & Axes

Scale selection: `scaleLinear` (default quantitative), `scaleLog` (spans 2+ orders, strictly positive), `scaleSqrt` (area encoding), `scaleBand` (categorical bars), `scaleUtc` (temporal), `scaleOrdinal` (categorical color).

```js
const x = d3.scaleUtc(d3.extent(data, d => d.date), [0, innerWidth]);
const y = d3.scaleLinear([0, d3.max(data, d => d.val)], [innerHeight, 0]).nice();
g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
g.append("g").call(d3.axisLeft(y));
```

Tick formatting: `d3.format(".0%")` for percentages, `d3.format(",.0f")` for integers, `d3.timeFormat("%b %Y")` for dates.

Responsive ticks: `ticks(Math.max(2, innerWidth / 80))`. D3's `.ticks(n)` is a suggestion; use `.tickValues([...])` for exact control.

Label collision: reduce tick count first, then truncate with tooltip, then stagger, then rotate 45 degrees as last resort:

```js
axisGroup.selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .attr("dx", "-0.5em").attr("dy", "0.3em");
```

**Pitfall:** `.nice()` on bar charts can push the lower bound below zero, breaking the zero baseline. Skip `.nice()` when the domain has semantic meaning (0-100%, explicit range).

### Color

Sequential: `d3.scaleSequential(d3.interpolateBlues)` (single hue) or `d3.scaleSequential(d3.interpolateViridis)` (multi-hue, colorblind-safe).

Diverging: `d3.scaleDiverging([min, midpoint, max], d3.interpolateRdBu)`. The midpoint must be meaningful (zero, average, threshold). Without a meaningful midpoint, use sequential.

Categorical: `d3.scaleOrdinal(d3.schemeTableau10)` for up to 10 categories. Beyond 10, group into top-N + "other".

```js
const color = d3.scaleOrdinal(d3.schemeTableau10);
bars.attr("fill", d => color(d.category));
```

Colorblind-safe defaults: Tableau10, viridis, Paul Tol's Bright palette:
```js
const tolBright = ["#4477AA","#EE6677","#228833","#CCBB44","#66CCEE","#AA3377","#BBBBBB"];
```

WCAG contrast: text against background needs minimum 4.5:1 ratio. Test `--text` against `--bg` and `--fig-bg`. For data marks, ensure labels are readable against fill colors.

Dark mode: respect `prefers-color-scheme` via CSS custom properties. Invert grays (swap `--text` and `--bg`), keep hue-bearing colors but adjust lightness. Use Tol Vibrant on dark backgrounds instead of Tol Bright.

```css
@media (prefers-color-scheme: dark) {
  :root { --text: #e8e6dd; --text-2: #a0a0b4; --bg: #1a1a2e;
    --fig-bg: #22223a; --border: #3a3a52; --accent: #60a5fa; }
}
```

### Annotation

Direct labeling of data points beats legends when there are 5 or fewer series. Leader lines connect data point to label:

```js
const callout = g.append("g");
callout.append("line")
    .attr("x1", x(d.date)).attr("y1", y(d.val))
    .attr("x2", x(d.date) + dx).attr("y2", y(d.val) + dy)
    .attr("stroke", "var(--text-2)").attr("stroke-width", 0.7);
callout.append("text")
    .attr("x", x(d.date) + dx).attr("y", y(d.val) + dy - 4)
    .attr("font-size", 12).attr("fill", "var(--text)")
    .text(d.label);
```

Reference lines for thresholds: horizontal/vertical rules with labels.

```js
g.append("line")
    .attr("x1", 0).attr("x2", innerWidth)
    .attr("y1", y(threshold)).attr("y2", y(threshold))
    .attr("stroke", "var(--accent)").attr("stroke-dasharray", "4,2");
```

Force-based label placement to avoid overlap: run a secondary simulation with `forceCollide` on label bounding boxes. Pre-compute (no animation): `simulation.stop(); simulation.tick(120);`.

**Judgment:** Annotate the surprising, not the obvious. 1-3 callouts per chart maximum. More than 3 means you have a list, not a story. Use tooltips for everything else.

**Pitfall:** Labels overflow chart bounds. Always check `label.x + label.width < innerWidth` and flip direction if needed.

### Typography in SVG

`text-anchor` controls horizontal alignment: `start` (left), `middle` (center), `end` (right).

Use `dy="0.35em"` to vertically center text on its coordinate (moves baseline to middle).

```js
g.append("text")
    .attr("x", x(d.date)).attr("y", y(d.val))
    .attr("dy", "0.35em").attr("text-anchor", "middle")
    .attr("font-family", "var(--heading-font)")
    .attr("font-size", 12).attr("fill", "var(--text)")
    .text(d.label);
```

Multi-line text: `<tspan>` elements with `dy="1.2em"` for each line break.

```js
const text = g.append("text").attr("x", tx).attr("y", ty);
lines.forEach((line, i) => {
  text.append("tspan").attr("x", tx).attr("dy", i === 0 ? 0 : "1.2em").text(line);
});
```

Rich text inside SVG: `<foreignObject>` for HTML content (paragraphs, equations, styled text).

Font: use `var(--heading-font)` (Source Sans 3) for all SVG text. Body font (Source Serif 4) is for article prose, not chart labels.

**Pitfall:** `getComputedTextLength()` returns 0 if the text element is not yet in the DOM. Append first, then measure.
