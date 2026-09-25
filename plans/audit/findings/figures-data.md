# Figure pass: data track

Series: `docs/parallel-coordinates/` (12 + index), `docs/decision-trees/` (6 + index),
`docs/algorithms-ml/` (6 + index). Every page passes render-check, both over http and as a
file. Each page was audited at 390x844 in light and dark mode. The audit checked for
horizontal overflow, SVG text that is clipped or collides, SVG and canvas elements with no
role or label, light fills on a dark page, and captions. On every page I changed, each
figure's main interaction was driven headlessly: buttons, sliders, keys, drags, and on
PC 05 touch brushing. Every interaction changed the display with no errors.

## Conventions used across the three series

- **Dark mode.** Every page gets a `prefers-color-scheme: dark` block with the same
  tokens: `--bg #14141c`, `--fig-bg #1c1c28`, `--border #34344a`, text `#e6e6ee` and
  `#a3a3b8`. Each series keeps its semantic `--c-*` hues, lightened to the Tailwind 300/400
  shade.
  - Figure JS reads colors through `cs('--x')`, or through a small `DARK_SWAP` map for
    pages built on hex literals (algorithms-ml 03 to 06), so every value handed to a d3
    scale, an interpolator or a canvas is a resolved hex.
  - KaTeX `\color{#hex}` in parallel-coordinates now uses the resolved theme token.
  - Light mode is unchanged.
- **Phone width.** Figures lay out to the container's real width (`fitWidth` / `fitW`),
  capped at their design width, instead of shrinking a 700-wide viewBox to 5-6px text. Where
  that isn't enough:
  - Two-panel figures wrap (PC 10, PC 11 Fig 1) or stack (PC 05 Fig 2).
  - Labels on crowded axes are staggered on two rows.
  - PC 06 uses a 480-wide layout with larger type below 560px.
- **Keyboard.** Every drag handle, brush, pickable polyline set and rotatable canvas can be
  focused and driven by arrow keys: Shift for bigger steps, Escape to clear, Enter or Space
  for pickable labels. Hover-only readouts now also respond to a tap or click, which pins
  them, and to the arrow keys (PC 11 Figs 1 and 2).
- **Labels.** Every figure SVG and canvas has a `role` and an `aria-label` describing what
  it shows. Index-card thumbnails are `aria-hidden`, since the card text carries the content.
- **Chrome notice.** `#generated-notice` gets its light colors inline from
  `docs/lib/motion.js`, so each page overrides it with `!important`. The real fix belongs in
  `motion.js`, which is outside this track.

## parallel-coordinates

### Figures cut or merged

- **01:** "point to line" (drag a point, see its segment) is merged into the click-duality
  figure. Both drew the same Cartesian/PC pair, so the merged Figure 1 supports both drag
  and click. The article goes from 7 figures to 6.
- **05:** old Fig 5 (wine data, no colors, brushing) is merged into Fig 1 (wine data,
  colored, hover). They were the same data in the same chart with different controls.
  - Fig 1 now has a "Hide cultivar colors" toggle, a brush on every axis (mouse, touch,
    keyboard) and a count.
  - The brushing paragraph now sends the reader back to Figure 1.
  - The old Fig 5 caption said "brushing every axis to its middle range leaves the
    deviations standing out". The code only ever allowed one brush at a time, so I dropped
    that sentence.
  - The article goes from 5 figures to 4.
- **07:** the lone 5-axis brush figure is cut, because the combined Fig 3 has the same plot
  with axis brushes and strums. The strum figure is merged into the wedge figure: one strum
  line, or two for a wedge. The article goes from 5 figures to 3.
- **08:** "class profiles" is merged into "discrimination". Both were the same 303-patient
  PC plot, and the discrimination figure now carries the Cohen's d bars beneath. The article
  goes from 8 figures to 7.

### Layout, dark and accessibility fixes

- **01-03, 07, 08.** Real-width layouts and staggered labels on phones, keyboard handles and
  brushes, and seeded PRNGs in place of `Math.random`:
  - 01: 11 calls replaced
  - 02: 2 calls replaced
  - 03: 4 calls replaced
- **04.** Figures 1, 2 and 4 are laid out at their real width.
  - The correlation matrix is now sized to its content. Its last row had been clipped at the
    bottom.
  - The axes can be reordered with the Left and Right keys, as well as by dragging.
  - The cylinder legend is now a row, so it no longer covers the "wt" label.
  - The tiles are themed. The Fig 4 animation honors `Motion.reduced()`.
- **05.**
  - Fig 2 stacks on phones.
  - The Fig 2 sample cloud is seeded, so it reshapes with the slider instead of flickering.
    Before, it resampled with `Math.random` on every input.
  - Reduced motion turns Animate into an eighth-turn step per press.
  - Fig 3's dots have keyboard handles.
  - Fig 4 steps through the parts with the arrow keys, defective parts first.
- **06.**
  - Two-panel figures use a 480 layout with larger type on phones.
  - The test points have keyboard handles.
  - The status lines use sans type. They had been rendering at body-serif size.
  - The KaTeX colors are themed.
- **09.** The "Aircraft A/B" group labels and the CPA label no longer collide with tick
  labels.
- **10.**
  - The arm and PC panels wrap on phones. The PC view had been drawn at about 90px wide.
  - All four sampling sites use seeded PRNGs. Resampling on every drag tick had made the
    solution family flicker.
  - Targets, joint-limit lines and x/y brushes are keyboard-accessible.
- **11 (known issue).** The clipped "Cargo" label had a root cause: every figure drew a
  fixed 690px (Fig 1: 2x340) SVG inside a narrower content box that has `overflow: hidden`.
  - All five figures now fit their container. The PC figures have room for the axis names.
  - Fig 1 stacks on phones.
  - The hover readouts in Figs 1 and 2 respond to a tap and to the keyboard.
  - Figs 3 and 5 have keyboard picking.
  - Tooltip and handle strokes follow the theme.
- **12.**
  - The wireframe canvases were painted `#ffffff` and now use `--fig-bg`.
  - The arrow keys rotate the canvases, and Shift rotates through the fourth dimension.
  - The symmetry and dual wireframes rotate with the keyboard.
  - The vertex highlight colors follow the theme.
- **index.** Dark block. Thumbnail colors are swapped on the canvas context's setters.

### Randomness left in place

- 05 Fig 3 "Regenerate cluster" is a deliberate reroll. The first cluster is seeded.

### Overlap between 05 and 08 (the merge is out of scope)

There is some overlap between the two:

- 05 Fig 3 (inject an outlier, drag its per-axis values against a bundle) and 08 Fig 1
  (process monitor, drag the current reading against a normal bundle) are the same
  interaction on different data.
- 05 Fig 1's brushing overlaps 08 Fig 7 (age brush), and 07 covers brushing in depth.
- 05 Fig 4 (per-axis Mahalanobis breakdown) and 08 Fig 5 (per-axis Cohen's d) are
  different statistics with a similar "which axes carry it" message.

If 08 is merged into 05, 05 Fig 3 or 08 Fig 1 should go.

### Needs a human

- **05 wine data:** cultivar 2 has 72 rows, but UCI Wine has 71 (59/71/48 = 178). The page
  shows "/ 179" in the brush count while the prose says 178, so one row is probably
  duplicated. I didn't fix it because I couldn't confirm which row is the extra one.
- **10 Fig 3:** the joint-limit lines are 3px tall drag targets, which is hard to hit by
  touch. They are keyboard-accessible now; a wider invisible hit area would help touch.
- **12:** touch users cannot reach the fourth-dimension rotation, which needs Shift+drag. It
  is reachable by keyboard.
- **05 Fig 1:** the cultivar legend sits over the lines at lower right. It is pre-existing
  and readable.

## decision-trees

### Figures cut or merged

None. The 11 figures each teach something different:

- 01: split impurity, greedy growth
- 02: oblique splits and pruning
- 03: variance of correlated averages, forest averaging
- 04: the boosting residual loop
- 05: gain vs gain ratio, a Shapley waterfall
- 06: uplift splits, honest estimation

### Fixes

- **Dark mode.** Each page gets a dark block, including `color-scheme: dark` so range inputs
  go dark. JS colors come from theme variables. 01 Fig 2 resolves its class colors to hex
  because it applies alpha with `d3.color`. The index thumbnails get a dark palette.
- **01 Fig 1.** The split line moves with the arrow keys, Shift for bigger steps.
- **01 Fig 2.** The scatter and tree stack at 520px and below; before, each was squeezed
  into a 150px column. The tree's height follows its depth. Leaves are focusable buttons.
- **02.** The "sweet spot" label no longer collides with the legend.
- **03.** A tick no longer overlaps the axis title. "Show trees" keeps its label and uses
  `aria-pressed`; before, its text flipped in the opposite sense to its state.
- **05.** Both figures size to their container. Fig 2 had been at 0.54x on phones, about 5px
  text. Bar labels that don't fit inside the bar move outside it.
- **06.** The Fig 1 legend moves to a row above the plot. The Fig 2 bias strip sizes to its
  container, and its axis title is no longer clipped.

### Randomness

There is no `Math.random`. All data is seeded, and the re-sample buttons advance the seed.
The only animation is Auto-grow in 01 Fig 2. The reader starts it and it stops by itself
after six steps, with 50ms steps under `Motion.reduced()`.

### Needs a human

- The captions of 01 Fig 2 and 04 say "Left/Right", but the panels stack on phones. I left
  them because that's prose.
- The stat panels ("Tree at this α", "Status", "Over 200 datasets") lean toward the
  metric-grid pattern the anti-slop rules warn against. That's an editorial call.
- 01 Fig 1, 03 Fig 2, 04 and 06 Fig 1 still scale to about 0.75x on phones. Nothing
  collides, but real-width layout like 05 would read better.

## algorithms-ml

### Figures cut or merged

- **02:** old Fig 1 (static 2-3-1 network with input sliders) is merged into old Fig 2
  (step-through forward pass). Both drew the same network with the same weights. The
  merged Figure 1 has the sliders and the stepper, and the later figures and prose
  references are renumbered. The article goes from 5 figures to 4.

### Fixes

- **01, 02.** Dark mode, aria labels, keyboard access for the optimizer race, seeded data,
  and pausing off-screen through `Motion.onVisible`.
- **03.**
  - In dark mode the attention heatmaps use theme-aware interpolators. They run from a dark
    base to a bright hue, and the diverging scales have a dark midpoint, where before they
    were white-to-color.
  - On phones the Fig 2 rows are tall enough for their word labels, which had overlapped.
  - Words and query rows can be selected with Enter or Space.
  - Cell values show from 30px cells, so phones see them too.
  - The scroll-step cards are dark.
- **04.**
  - The projection axis rotates with the Left and Right keys.
  - On phones the scatter is taller and the histogram narrower, so the cloud keeps its
    shape.
  - The "cumulative" label no longer sits on the 100% tick.
- **05.**
  - Axis titles were cut off at the bottom of every chart and overlapped the ticks; margins
    now make room.
  - "mean = …" was clipped at the top.
  - The "Disease (1.0%)" header was clipped at the left when the column is narrow.
  - The page is in dark mode, including `.btn-neg`.
- **06.**
  - A wide display equation made the page scroll sideways, so `.katex-display` now scrolls
    on its own.
  - The grid cells and the value scale have dark shades. The goal cell's label had turned
    invisible under the swap, so the goal fill is set separately.
- **index.** Dark palette, header label, `aria-hidden` thumbnails.

### Randomness left in place

- 05: the coin flips (Flip, Auto-flip 20, Flip 10/50) are the point of the figure.
- 03: "Retrain from a new random start" is a deliberate reroll; the first run is seeded.

### Needs a human

- **03 Fig 1:** the letter-pair count per key is only in the hover tooltip. Hover also fires
  on tap, but there is no keyboard path. The weights themselves are printed.
- **03 and 06:** some sliders (speed, exploration rate) only affect the next run, so a
  headless nudge shows no change. That is by design.
