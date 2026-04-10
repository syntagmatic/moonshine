---
name: visuals
description: Visualization patterns for interactive technical explanations — technology-agnostic, prose-compiled
---

# Visuals

Visualization patterns for moonshine explanations. This guide tells the compiler (you) how to turn prose visual descriptions into working interactive figures. The output is self-contained HTML. The rendering technology is your choice — use whatever produces the best result for each figure.

## The Compilation Model

Moonshine articles contain `:::viz` blocks — prose descriptions of visual figures. Your job is to compile each block into working code inside a self-contained HTML file.

```markdown
:::viz
A scatter plot of GDP vs life expectancy for 50 countries.
Dots sized by population, colored by continent.
Hover shows country name and values.
Brushing a region highlights those countries in a linked bar chart below.
:::
```

When compiling a `:::viz` block:
1. Read the prose description and the surrounding article context
2. Choose the right visualization type, rendering technology, and interaction model
3. Generate the code — inline JS/CSS in the HTML file
4. The prose description stays in the source as documentation of intent

The output HTML must work when opened in a browser. No build tools. No server. No API keys.

## Rendering Technology

Choose the technology that fits each figure. You are not limited to one library.

**SVG** — Best for figures under 2,000 elements where you need crisp text, CSS styling, accessibility, and DOM-based interaction. Most figures in explanations are SVG.

**Canvas 2D** — Best for dense data (2K-100K points), real-time animation, or pixel-level effects. Requires manual hit detection (quadtree) and loses DOM accessibility without extra work.

**WebGL** — Best for massive datasets (100K+) or GPU-computed effects. High setup cost. Use only when Canvas can't keep up.

**HTML + CSS** — Best for tables, icon arrays, text-heavy layouts, and simple progress indicators. Underrated. A well-styled HTML table is a visualization.

**Hybrid** — Canvas for the data layer, SVG for axes and labels, HTML for controls and tooltips. This is often the right answer for complex figures.

**Libraries:** Use D3 v7 for scales, layouts, data transforms, and DOM bindling. Use other libraries when they're the right tool — d3-sankey for Sankey diagrams, topojson-client for geographic data, KaTeX for math rendering. Load from CDN. Prefer fewer dependencies.

**Judgment:** Start with SVG. Switch to Canvas only when you hit a performance wall you can feel. The explanation's job is to communicate, not to benchmark.

## Article Foundation

Every moonshine explanation is a single HTML file with this structure:

- Google Fonts: Source Serif 4 (body), Source Sans 3 (headings/UI), Source Code Pro (code)
- CSS custom properties: `--text: #1a1a2e`, `--text-2: #4a4a6a`, `--accent: #2563eb`, `--accent-light: #dbeafe`, `--bg: #fafafa`, `--fig-bg: #ffffff`, `--border: #e2e2e8`
- Article container: max-width 740px, centered, generous vertical padding
- Figure containers: white background, 1px border, 6px radius, caption below in heading font
- Insight boxes: blue-left-border, light blue background
- Risk boxes (when needed): amber-left-border, light amber background
- Controls: heading font, 0.85rem, inside the figure container

Responsive: observe container width with ResizeObserver, redraw on resize. Use pointer events (not mouse events) for touch compatibility. Respect `prefers-reduced-motion` for all animations.

## Visualization Types

### Statistical Charts

**Scatter plot** — Two continuous variables. Size encodes a third (use area-proportional scaling, not radius). Color encodes category. Add jitter for overlapping points. Voronoi overlay for hover on sparse data.

**Line chart** — Values over a continuous axis (usually time). Handle missing data by breaking the line, not connecting across gaps. Confidence bands as a shaded area behind the line. Limit to 7 series before it becomes spaghetti.

**Area chart** — Like a line chart but filled to the baseline. Stacked areas show composition over time. Streamgraph (centered stacking) for symmetric aesthetics but harder to read individual layers.

**Bar chart** — Categorical comparison. Horizontal for long labels. Grouped for 2-3 subcategories, stacked for part-to-whole. Always include zero in the baseline. Sort by value when category order is arbitrary.

**Histogram** — Distribution of a single continuous variable. Bin count matters: too few hides structure, too many creates noise. Let the data suggest the bin width, or use a density curve.

**Heatmap** — Two categorical axes, color encodes the value at each cell. Sequential palette for one-direction data, diverging for data with a meaningful center. Label cells when the grid is coarse.

**Box plot** — Five-number summary. Quick comparison across groups but hides distribution shape. Always consider violin or bee swarm as alternatives.

**Violin plot** — Mirrored density showing distribution shape. KDE bandwidth is an editorial choice — too narrow creates false peaks, too wide smooths away real bimodality. Show the kernel bandwidth choice explicitly when it matters.

**Bee swarm** — Every data point visible, dodged to avoid overlap. Best for small N (<200 per group) where individual observations matter.

**Strip/jitter plot** — Points along one axis with random offset on the other. Simpler than bee swarm, works for quick looks.

**Ridgeline** — Stacked density plots offset vertically. Beautiful for comparing 5-12 groups. Fails at 20+.

**QQ plot** — Quantile-quantile comparison against a reference distribution. Points on the diagonal mean the distributions match. Deviations reveal skew, heavy tails, or mixture.

### Flow & Connection

**Sankey diagram** — Quantities flowing through a pipeline. Nodes are stages, links are flows with width proportional to quantity. Conservation is visible: inputs equal outputs at each node. No cycles allowed.

**Chord diagram** — Flows between groups arranged in a circle. Ribbon width shows volume. Good for showing which groups exchange the most. Requires a square matrix.

**Network graph (force-directed)** — Nodes and edges with physics-based layout. Forces: link springs, charge repulsion, centering, collision. Drag to reposition. Becomes a hairball past 200 nodes without careful force tuning.

**Adjacency matrix** — Same graph as a grid. Sort by cluster to reveal community structure as dense diagonal blocks. Better than node-link for dense graphs.

**Arc diagram** — Nodes on a line, links as semicircular arcs. Reveals ordering effects. Good for sequential data (timeline connections, sentence dependencies).

**Node-link tree** — Hierarchical connections. Horizontal (wide) or radial (compact). Links via smooth curves. Collapsible for large trees.

**Edge bundling** — Hierarchical edge bundling routes cross-group connections through the tree structure, revealing patterns that straight lines hide. Tension parameter controls grouping. High tension creates phantom clusters — the bundling reflects tree structure, not data similarity.

**Markov chain** — States as nodes, transition probabilities as directed edges with width proportional to probability. Self-loops for staying in state. Animate a particle walking the chain to show the process. Steady-state distribution as node size.

**State machine** — Similar to Markov but with labeled transitions (events, not probabilities). Highlight the current state. Animate transitions on trigger events.

**Judgment:** Node-link for topology (how things connect). Matrix for density (which pairs connect). Chord for inter-group flow. Sankey for pipeline quantities. Markov for probabilistic processes. State machine for event-driven systems.

### Hierarchical

**Treemap** — Area encodes value within a nested hierarchy. Squarified tiling for best aspect ratios. Labels only in cells large enough to read. Color by category or depth.

**Pack (circle packing)** — Nested circles showing containment. Wastes ~21% of space geometrically but clearly shows nesting structure.

**Sunburst** — Radial partition. Angle encodes fraction, radius encodes depth. Click to zoom into subtrees. Use sqrt scaling on radius so outer rings don't dominate.

**Icicle / partition** — Rectangular version of sunburst. Easier to read, less compact.

**Collapsible tree** — Start with 2 levels visible. Click to expand/collapse. Animate node entry/exit. Show breadcrumbs for navigation context.

**Zoomable treemap** — Click a cell to zoom in, children fill the space. Breadcrumbs to navigate back. Scale domains swap, no layout recomputation.

### Geographic

**Choropleth** — Color-filled geographic regions. Classification method matters: quantile, equal-interval, natural breaks each tell a different story about the same data. Use area-proportional projections (Equal Earth) for thematic maps.

**Bubble map** — Sized circles on geographic positions. Better than choropleth for absolute quantities (choropleth conflates geographic area with data magnitude).

**Projection comparison** — Show the same geography under different projections to reveal distortion. Tissot's indicatrices (small circles) make distortion visible.

**Flow map** — Directed arcs between geographic locations with width encoding flow volume. Curved arcs avoid overlap.

**Globe** — Orthographic projection with drag-to-rotate. Versor quaternion rotation for smooth pole-to-pole movement.

### Temporal

**Time series** — Line chart with time axis. Use UTC scale to avoid timezone surprises. Handle gaps (missing days, weekends in financial data) by breaking the line or using index-based spacing.

**Horizon chart** — Folded area chart that compresses vertical space. 3 bands is standard. Requires reader training. Use for dense multi-series temporal comparison.

**Cycle plot** — Separate panels for each period unit (one per day of week, one per month). Reveals seasonal patterns that line charts bury.

**Gantt / swimlane** — Horizontal bars on a timeline. Rows are categories or resources. Shows duration, overlap, and scheduling.

**Streaming** — Real-time data appending from the right. Circular buffer for fixed window. Translate-and-clip for smooth scrolling. RAF gating for frame budget.

### Specialized

**Parallel coordinates** — Multiple vertical axes, one per dimension. Lines connecting values across axes. Crossing patterns reveal correlations. Axis ordering changes the story. Brush on individual axes to filter.

**Radar / spider chart** — Multivariate comparison for a small number of items (2-4) across 5-8 dimensions. Avoid for comparison — the area encoding is perceptually weak.

**Sparkline** — Word-sized chart (60-80px wide, 16-20px tall) embedded in text or table cells. No axes. End dot for current value. Normal range band for context.

**Small multiples** — Same chart repeated for each category in a grid. Shared scales across panels for fair comparison. Synchronized interaction: brush in one, highlight all. 20-25 panels maximum.

**Bullet chart** — Qualitative ranges (poor/good/excellent) with a measure bar and target marker. Compact alternative to gauges.

**Icon array** — Grid of icons where each represents a unit (1 person, $1M, 1 case). More intuitive than percentages for general audiences.

**Waffle chart** — 10x10 grid of squares, colored by proportion. Replaces pie charts with a more accurately decoded encoding.

**Waterfall chart** — Running total with positive and negative contributions shown as floating bars. Good for explaining how a starting value becomes an ending value.

**Slope chart** — Two points per item connected by a line, showing before/after or two-point comparison. Highlights who gained and who lost.

**Dumbbell chart** — Two dots per item on a horizontal axis, connected by a line. Shows the gap between two values per category.

## Interaction

### Direct Manipulation

**Brush** — Drag to select a region (2D), a range (1D), or a freeform area (lasso). Selection drives data filtering across linked views. Ghost/active layer: dim unselected data instead of hiding it.

**Drag** — Reposition elements (force layout nodes), adjust parameters (threshold handle), or reorder (axis dragging in parallel coordinates).

**Zoom & pan** — Geometric zoom scales everything (including text — usually wrong for charts). Semantic zoom rescales the data domain (text stays readable). Always constrain zoom bounds. Add a minimap for context at high zoom.

**Scrub** — Move cursor across the chart to see values at each position. Vertical crosshair with value readout. Good for time series exploration.

### Controls

**Slider** — Continuous parameter. Show current value. Use `input` event for live feedback, not `change`. One slider per parameter.

**Toggle** — Binary state (on/off, show/hide). Checkboxes for independent toggles, radio buttons for mutually exclusive modes.

**Button** — Trigger discrete actions (sort, reset, play, step forward). Clear label describing the action, not the state.

**Dropdown** — Select from many options (datasets, encoding channels, sort order). Use when there are too many options for buttons.

### Details on Demand

**Hover tooltip** — Positioned HTML div near the cursor. Show on pointer enter, hide on pointer leave. Clamp to viewport edges. For sparse point charts, use Voronoi detection so the nearest point responds, not just the point under the cursor.

**Click to expand** — Reveal detail panels, drill into hierarchy levels, or show related data. Click again to collapse.

**Focus + context** — Overview chart shows the full picture, detail chart shows the selected region. Brush on the overview controls the detail. The reader always knows where they are.

### Linking

**Shared selection** — Brush in chart A highlights corresponding elements in chart B. Use an event bus pattern: chart A emits selection, chart B listens and updates its rendering. Guard against feedback loops (check event source before re-emitting).

**Shared parameter** — A slider controls a value that multiple charts react to. Central state store with subscriber pattern.

**Coordinated zoom** — Zoom in one chart rescales the same domain in another. Share the zoom transform.

**Judgment:** Link 2-3 views maximum. Every additional linked view costs the reader working memory. If you need more, use a master-detail pattern (one overview drives all details) instead of full cross-linking.

## Motion & Narrative

### Transitions

Animate between states to show what changed. Use transitions for:
- **Object constancy** — elements move to new positions rather than appearing/disappearing
- **State comparison** — morphing between two views shows they represent the same data
- **Attention guidance** — entering elements catch the eye

Don't use transitions for:
- Decoration (fade-in-on-load adds latency, not understanding)
- Frequent updates (a 500ms transition on every keystroke creates a "drunk" feel)

**Duration:** 200-400ms for responsive UI (slider feedback, hover). 500-800ms for major state changes (sort, filter). Never over 1000ms.

**Easing:** Cubic-out for responsive snaps (fast start, gentle stop). Linear for data playback. Cubic-in-out for position changes.

**Interruption:** Always cancel in-flight transitions before starting new ones. Rapid interaction without interruption queues transitions, making the chart lag behind input.

**Stagger:** Sequential delay across elements (20-40ms per item) reveals ordering. Keep total stagger under 500ms.

### Scroll-Driven Narrative

The "sticky graphic" pattern: a figure stays fixed while text scrolls alongside. Each text block triggers a stage transition in the figure.

**Stages:** Each stage is an idempotent function that transitions the figure to a specific state. Forward and backward must both work — scrolling up should reverse the progression, not leave the figure in its last forward state.

**Detection:** Intersection Observer on each text step. Threshold 0.5 for discrete stages. Lower threshold for early triggering.

**Design:** 4-6 stages maximum. Each stage should make one change. The reader processes one transition at a time.

### Choreography

Multi-stage transitions that play in sequence. Three approaches:
1. **Coordinated delays** — compute offsets so exit, move, and enter don't overlap. Most robust.
2. **Async/await** — `await transition.end()` between stages. Clean but fails on interruption (wrap in try/catch).
3. **RAF loop** — requestAnimationFrame with elapsed-time state machine. Full control, most code.

### Shape Morphing

Show that two visual representations are the same data by morphing between them.
- **Parametric** — shapes that share parameters (circle ↔ rectangle via corner radius, bar ↔ arc via angle/radius) interpolate naturally
- **Point resampling** — shapes that differ in topology: resample both to N equal-spacing points, interpolate the point arrays. 128 points is visually smooth.
- **Projection transition** — geographic maps morphing between projections by interpolating the projection function output

**Judgment:** Morphing should prove equivalence ("this bar chart and this pie chart show the same data"). Don't morph between unrelated states for spectacle.

## Data

### Inline Data

For explanations, embed the data directly in the HTML as JS arrays or objects. No external fetches. No CSV parsing. The explanation must work offline.

For synthetic data, use a seeded random number generator for reproducibility — the same data every page load.

### Transformations

Group, aggregate, bin, sort, normalize, pivot — transform data to match the visual encoding. Common operations:
- **Group by category** — partition rows by a key column
- **Rollup / aggregate** — reduce groups to summary values (mean, sum, count, min, max)
- **Bin** — partition a continuous variable into intervals
- **Stack** — compute cumulative y0/y1 for stacked charts
- **Hierarchy** — build tree structure from flat parent-child or nested data
- **Graph** — assemble nodes and edges from relationship data

### Generated Data

When explaining a concept (not a dataset), generate synthetic data that demonstrates the concept clearly. Design the data to show the pattern — a normal distribution, a bimodal split, a clear outlier, a trend with noise. The data is in service of the explanation.

## Annotation & Labeling

**Callout** — Leader line from data point to label text. Use for the 1-3 most important features. More than 3 callouts means you have a list, not a story.

**Reference line** — Horizontal or vertical rule at a meaningful threshold. Dashed, lighter than data. Label at the end.

**Shaded region** — Highlight a range (time period, value band) with a semi-transparent rectangle behind the data.

**Direct label** — Place the series name at the end of the line instead of using a legend. Works for up to 5 series.

**Legend** — Use only when direct labeling isn't practical. Position near the chart, not below it. Color swatches match the encoding exactly.

**Force-based label placement** — For many labels, run a physics simulation to prevent overlap. Pre-compute (no animation) by running 120 ticks synchronously before rendering.

**Judgment:** Annotate the surprising. Let the obvious speak for itself. If a reader needs the annotation to understand the chart's main message, the encoding is wrong.

## Color

**Sequential** — One-direction data (0 to max). Single-hue (blues) for simple, multi-hue (viridis) for wider range. Viridis is colorblind-safe.

**Diverging** — Data with a meaningful center (zero, average, threshold). Red-blue or brown-teal. The midpoint must be semantically meaningful, not arbitrary.

**Categorical** — Distinct groups. Tableau10 for up to 10, Tol Bright for 7 with colorblind safety. Beyond 10 categories, group into top-N + "other."

**Colorblind safety** — 8% of males have color vision deficiency. Test with deuteranopia simulation. Use redundant encoding (color + shape, color + position) as insurance.

**Dark mode** — Respect `prefers-color-scheme`. Invert grays, adjust lightness of hue-bearing colors. Don't just `filter: invert()` — it destroys carefully chosen palettes.

**WCAG contrast** — 4.5:1 minimum for text against background. Test labels against their chart background, not just the page background.

## Scales & Axes

**Linear** — Default for continuous quantitative data. Include zero in bar chart baselines. Use `.nice()` for clean round numbers, but skip it when the domain has semantic meaning.

**Log** — Data spanning 2+ orders of magnitude. Strictly positive values only (log of zero is undefined). Reveals patterns that linear scales crush.

**Sqrt** — Area encoding. Use for bubble/circle size so perceived area matches data value.

**Band** — Categorical data with equal spacing. Padding between bars (0.2 is a good default).

**Time** — Use UTC to avoid timezone surprises. Format ticks for the zoom level (years at broad view, days when zoomed in). Handle gaps (weekends, missing data) deliberately.

**Responsive ticks** — Compute tick count from chart width: `Math.max(2, width / 80)`. Fewer ticks at narrow widths prevents collision. If labels still collide: filter, stagger, then rotate as last resort.

## Iteration Protocol

Generating a visualization in one pass often produces something that works but doesn't communicate well. Use iteration to refine.

### First Pass: Structure

Get the data, encoding, and layout right. Don't worry about polish. Ask:
- Does the visualization type match the data question?
- Are the axes, scales, and color encoding correct?
- Is the data binding right (right data to right elements)?

### Second Pass: Legibility

Make it readable. Ask:
- Can the reader identify values from the encoding?
- Do labels fit without collision?
- Is the color palette accessible?
- Does the axis formatting help or distract?

### Third Pass: Interaction

Add interaction only where it serves understanding. Ask:
- Does this interaction help build intuition that prose alone can't?
- Is the interaction discoverable (does the reader know they can brush/drag/hover)?
- Does the interaction work on touch devices?

### Fourth Pass: Narrative

Connect the visualization to the explanation's story. Ask:
- Does an annotation highlight the key insight?
- Is the figure caption informative (not just "Figure 1")?
- Does the visual flow match the article's progression?

### Fifth Pass: Stress

Test edge cases. Ask:
- What happens at extreme values (min, max, zero, negative)?
- What happens during rapid interaction (fast brush drag, rapid clicks)?
- Does it work at narrow widths (400px)?
- Does it respect prefers-reduced-motion?

### Iteration Between Figures

When an article has multiple figures, iterate across them:
- Consistent color encoding (same category = same color everywhere)
- Consistent axis scales where comparison matters
- Linked interactions that don't create feedback loops
- A visual progression that matches the narrative arc

## Performance

**Budget:** 16ms per frame (60fps). If a single render takes longer, the chart feels sluggish during interaction.

**SVG limit:** ~2,000 elements before interactions stutter. Switch to Canvas at this threshold.

**Canvas limit:** ~100,000 elements with batched rendering. Switch to WebGL beyond this.

**Dirty-flag rendering:** Don't redraw everything on every event. Track which layers changed and redraw only those. Coalesce rapid events with requestAnimationFrame.

**Pre-computation:** Run expensive layouts (force simulation, label placement) synchronously before first render. Don't animate the computation — animate the result.

## Accessibility

**Keyboard navigation** — All interactive elements reachable via Tab/Arrow keys. Focus rings visible.

**Screen reader support** — ARIA labels on figures, live regions for dynamic updates. Hidden data table as fallback for complex charts.

**Reduced motion** — Check `prefers-reduced-motion`. Replace animations with instant state changes. Don't just set duration to 0 — also disable stagger and continuous animation.

**Text alternatives** — Every figure needs a caption that describes what the reader should notice. The caption is not the alt text — it's the editorial judgment about what matters.
