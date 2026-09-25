# Figure pass: forms track (modular-forms, cohomology)

Phase 4 of `plans/audit/PLAN.md`, following `plans/audit/FIGURE-BRIEF.md`. Every page in
`docs/modular-forms/` (01-14, index) and `docs/cohomology/` (01-06, index) was checked at
390x844 in light and dark, and every figure's controls were driven headlessly.

## Shared changes (both series)

- **`<series>/lib/theme.css`** (new, linked after each page's `<style>`). It adds:
  - dark tokens for the page palette and every `--c-*` concept colour;
  - a remap of the fixed light palette that figure scripts write as literal hex
    (SVG `fill`/`stroke` attributes, KaTeX `\color{#hex}`, and inline text colours on HTML
    readouts), one dark counterpart per light colour, so a colour means the same thing in
    figures and equations. It was generated from the colours actually used in each series;
  - `svg { fill: var(--text) }` in dark, since unfilled SVG text defaults to black;
  - `.katex-display` scrolls sideways inside its own box. Before this, display maths made
    18 of 22 pages scroll sideways at 390px (up to 997px wide);
  - tighter `.figure` padding under 600px, and a focus ring for keyboard-focusable SVG marks.
- **`<series>/lib/figkit.js`** (new, same file in both series): `width()` (lay a chart out at
  its host's pixel width instead of shrinking a fixed viewBox), `keyMove()` (arrow keys on a
  drag handle, through the same update as the drag), `pressable()` (Enter/Space on a
  clickable mark), `fit()` (flip a point label left when it would clip), `seeded()` (run a
  generator with a mulberry32 `Math.random`), `dark()` (for d3 scales that need resolved hex).
- **The most common failure** was a fixed viewBox (640-720 units wide) shrunk to a
  ~330px panel, which rendered SVG text at 5-7px and drag handles at 2-3px. About 40 SVGs
  are now laid out at the host's width. The plane figures in modular-forms 01-05 and 11
  also got equal x/y scales, so hyperbolic circles and semicircular geodesics are drawn true.
- Every figure SVG or canvas now has `role` and `aria-label`. Every drag handle can be moved
  with the arrow keys, and every clickable mark can be focused and pressed with Enter.

## modular-forms

**Cut: the index "act-machine" figure.** It was four buttons that swapped fixed strings into
three boxes (input, operation, output). It computed nothing, and the intro prose under it
already says the same four-act arc in a sentence. None of the prose pointed at it. The
header tessellation stays: it is real (the tiling from `Mod.sl2z`) and serves as the series
banner.

No other figure was cut or merged. The closest pair is 12 fig-decomp and 13 fig-decomp: both
are stacked bars splitting j-coefficients into Monster irreps. They are in different
articles, and 12 adds the assemble-it-yourself builder, so both stay. Someone should decide
whether 13's copy earns its place.

Per page:
- 01: the metric, geodesic and disk figures are laid out at the host's width with equal
  scales, and have keyboard handles. The disk caption said "same point and geodesic" but no
  geodesic is drawn, so it now says "same point".
- 02: all three figures are laid out at the host's width with equal scales, so the 180°/120°
  stabiliser angles now look right. Labels flip at the edges. The word builder hides the γτ
  dot while the word is empty (it sat on top of τ).
- 03: the tiling and reduction figures are laid out at the host's width. In the domain
  colouring, the grid overlay was placed with a negative margin, which only lined up at
  660px; it is now absolutely positioned. The white grid is kept white in dark mode.
- 04: the cusp figure drew everything in the window [-2, 2], so the default pair 1/3 and 2/5
  was two overlapping dots with colliding labels. It now zooms to the pair and shades the
  tile whose spike ends at each cusp (M·F, with M sending i∞ to the cusp). The matrix and the
  status line are unchanged. The q-expansion probe was hover-only; it now also follows
  pointer, tap and a new "probe y" slider.
- 05: the checker's readout was a `foreignObject` with a white background inside the SVG; it
  is now an HTML block below the plot. The heatmap's out-of-domain grey is resolved for dark
  mode. The bar chart is laid out at the host's width.
- 06: the lattice figure is laid out at the host's width. On dark pages the Blues ramp's
  white low end is swapped for a dim-to-bright blue ramp.
- 07: the |Δ| heatmap readout was hover-only. It now starts at τ = i, follows pointer or tap,
  and the canvas takes arrow keys. **Bug fixed:** the fundamental-domain overlay used a
  680x380 viewBox over a 140x100 canvas, so the outline was drawn about 20% too short at
  every width. It now uses the canvas's aspect ratio.
- 08: the Hecke route diagram gets a stacked "outer + weight × inner = new" layout on narrow
  screens. Eigenvalue table cells no longer wrap numbers onto three lines.
- 09: the genus chart readout was hover-only and was cleared on mouseleave. The selection now
  shows by default, follows pointer or tap, and tracks the Level N slider.
- 10: the finite-field grid puts its readout under the grid on narrow screens. The a_p chart
  readout works on tap. **Bug fixed:** the string `'ᵓD'` rendered as "ᵓD" instead of
  𝔽 (a 5-hex-digit code point in a 4-digit escape).
- 11: all four charts are laid out at the host's width, with narrow tick labels and legend
  placement. The jmap has a keyboard handle.
- 12: all three SVG charts are laid out at the host's width. Extra empty height was trimmed
  from the decomposition bar.
- 13: the two charts are laid out at the host's width. The dictionary table had no caption;
  it has one now.
- 14: the proof pipeline is a 3+3 snake on narrow screens (it was a 6-wide zig-zag at 5px).
  The root diagram and replication cascade are laid out at the host's width. KNZ grid cells
  can be focused and pressed, headers no longer wrap, and the grid scrolls inside the figure.

## cohomology

No figures were cut or merged. Each article has one or two figures of different kinds.

- All pages: `figkit.js` loads in `<head>`, because `motion.js` loads at the end of the body.
- 01: the annulus strip is laid out at the panel's width, and its labels were raised from
  0.6rem-in-viewBox to 11px. All 48 edges and 24 vertices can be focused and toggled from
  the keyboard, and focus returns to the toggled element after the redraw. The legend's
  picked-vertex dot was hardcoded `#1e293b`, invisible in dark mode; it now uses `--text`.
- 02: the surface diagram is laid out at the panel's width, with the H¹ basis slots moved
  under the square on phones (they overlapped it). The boundary matrix is drawn at 1:1 and
  scrolls inside `.matrix-wrap`, where it used to shrink to 5px labels.
- 03: the cup-table cells are keyboard buttons. The animation dwell now uses
  `Motion.reduced()`, so the reader's opt-in override is honoured.
- 04: sphere rotation was mouse-only (`mousedown`/`mousemove`), so touch could not rotate
  it. It now uses pointer events with `touch-action: none` and also takes arrow keys. The dω
  diverging scale uses resolved hex with a dark neutral midpoint. The annulus is laid out at
  the panel's width, and its handles take keys. **Bug fixed:** `.readout-label` and
  `.panel-title` were uppercasing KaTeX, so ∮γ dθ rendered as "∮Γ DΘ". The second figure's
  title was also unstyled, because the rule was scoped to `.dual-panel`.
- 05: the cover diagram's viewBox is cropped to the drawing. It had been a ~100px square in
  the middle of a 720-wide box, with 3px click targets. Vertices can be focused and cycled
  with Enter. The long exact sequence is a single labelled column on narrow screens. The U/V
  legend swatches are tokens that match the dark-remapped SVG colours.
- 06: the Rips builder and the three pipeline panels are laid out at the host's width. H¹
  bars in the barcode can be focused and selected.

## Randomness

- cohomology 06: the default datasets, and the annulus/clusters/figure-eight presets, now
  run the generators in `lib/tda-math.js` under `FigKit.seeded(...)`, so they are the same
  on every visit. The annulus seed (55) was picked for the smallest angular gap, so the loop
  reads clearly by default. The "random" button in Figure 1 and "resample" in Figure 2 are
  still random on purpose.
- cohomology 01: "α = noisy" is still random. It is a shuffle button.
- `lib/tda-math.js` itself still uses `Math.random`. Seeding is done at the call sites, so
  the shared library is untouched.

## Not fixed / needs a human

- `docs/lib/motion.js` draws the "machine-generated" notice with a white background on dark
  pages. It is site chrome outside this track.
- cohomology index banner and modular-forms 12's comparison chart: labels are still small
  on phones (banner ~6px, rotated tick labels 10px). The banner is decorative header art.
- cohomology 01 `.aside` and 05/01 big-number readouts (Betti cards, pairing cells) look
  close to the KPI-card pattern. They were left for the prose/structure owner.
- cohomology 04 loop-building needs vertex clicks on 162 small dots. There is no keyboard
  path except "Suggest loop". cohomology 06 point dragging is mouse/touch only; the ε slider
  and presets are the keyboard path.
- modular-forms 05's heatmap spends the lower half of its canvas below the fundamental
  domain (y from 0.05). Content choice, left alone.
- modular-forms 13's title string "V♮ = V_Λ⁺ ⊕ V_Λ^{T,+}" shows raw TeX-like braces.
- Dark mode remaps colours by literal value. A figure that writes a new colour not in the
  series palette will stay light until `theme.css` is regenerated. The generator lives in
  this track's scratchpad and is not in the repo.
