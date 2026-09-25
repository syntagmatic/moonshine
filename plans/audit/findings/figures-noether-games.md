# Figure pass: noether and game-is-the-math

Track "noether-games", Phase 4 of `plans/audit/PLAN.md`, following
`plans/audit/FIGURE-BRIEF.md`. Every page was screenshotted per figure at
390x844 in light and dark, and every changed figure was driven headlessly
(click, key, select or slider, plus a reduced-motion run for animated ones).

## Shared changes (both series)

- `lib/figure-a11y.js` (one copy per series). After load and after every
  redraw it gives each figure's `<svg>`/`<canvas>` a `role` (`img`, or `group`
  when it has clickable parts) and an `aria-label` taken from the first
  sentence of the caption, links it to the caption with `aria-describedby`,
  and turns every clickable non-control element (edges, cells, beads, nodes)
  into a focusable `role="button"` that clicks on Enter or Space. It also puts
  a floor under SVG label size: text drawn in a viewBox is enlarged in user
  units until it renders at 9px or more on screen (before this, most labels
  were 5-6px at 390px). Figures can opt out with `data-text-floor`, and
  elements that have their own keyboard handling use `data-a11y-skip`.
- Dark mode, added to both series (none existed anywhere in the gallery):
  `lib/theme.css` overrides the base tokens under
  `prefers-color-scheme: dark`; each page has a generated block that maps its
  own `--c-*` concept tokens and hardcoded panel colors with one rule (light
  tints become dark tints of the same hue, near-black ink becomes light,
  accents are lifted and slightly desaturated). `lib/theme.js` applies the
  same rule at runtime: every hex literal in page scripts goes through
  `Theme.c(hex)`, and the canvas heatmaps and d3 interpolators get resolved
  hex endpoints. No toggle.
- `.katex-display` scrolls inside its own box, and tables scroll inside their
  own box under 640px, so no page scrolls sideways at 390px (15 of the 23 articles did).

## noether

Cut or merged:
- 01 Figure 5 ("two senses of invariance") cut: same rotation slider, same
  point and circle as Figure 1, and the prose already points to Figure 1 for
  both senses.
- 03 Figure 4 (path bundle) merged into Figure 2: the bundle of detours,
  colored by action, is now the background of the draggable free-particle
  path. The old bundle never contained the straight line its caption
  claimed (30 amplitudes stepped over A = 0).
- 05 Figures 2 and 3 (free particle, pendulum) merged into the generator
  workshop, which now also plots q(t). They were the workshop's own
  translation cases. The pendulum caption's content moved into the prose.
  Numbering also started at Figure 2 before; it is now Figure 1.
- 06 Figure 1 (two static callout cards) replaced by the two equations and a
  sentence. Figures renumbered.
- 07 Figure 1 (Kepler orbit) merged into Figure 2 (the perturbation slider
  now starts at 0, so it opens as the pinned-vector figure). Figure 3 (so(4)
  circles) cut as decorative; its J± decomposition sentence moved into prose.
- 08 Figure 2 (static list of three Lagrangian terms with checkmarks) cut;
  the prose makes the same point.
- 12 Figure 2 (proof schematic) and Figure 3 (propagation chain) cut as
  decorative; the proof card states the proof, and the variety consequence
  from Figure 3's caption moved into prose.

Fixed because it was wrong:
- 03 Figure 1: the brachistochrone y scale was inverted, so the bead ran
  uphill from "start" to "end". Fixed the scale.
- 03 Figure 3: the caption says E = T + V is conserved but the plot had no E
  curve. Added the dashed E line; the KPI-style T/V/L cards are now one line.
- 03 Figure 2 caption said "piecewise-quadratic"; the path is one quadratic.
- 02 Figure 3 caption called diag(2, 3) "a 2×3 matrix".
- 07 perturbation slider went to α = 0.25. Above α ≈ 0.134 this orbit has no
  centrifugal barrier and falls into r = 0. Capped at 0.12.
- 07 monitor figure: reset left the old traces on screen (render returned
  early with one sample). It now clears; toggling the perturbation restarts
  the run.
- 11 Figure 4 caption said "each circle"; the boxes are rectangles. 11
  Figures 2 and 4 clipped their first box at the left edge; both are now
  drawn top to bottom.

Layout, defaults, motion, accessibility:
- Physics figures (03 pendulum, 06 all four, 07 orbit and monitors) opened
  empty until "play". They now start on load. All d3.timer loops go through
  `NOETHER.viz.timer`, which runs only while the figure is on screen and,
  under reduced motion, fast-forwards the simulation and shows the end state.
  The 03 pendulum used wall-clock dt, so it now uses the timer's own clock.
- Sensible defaults: 11 Figure 1 opens on (12) ⊂ (6) ⊂ (3), 11 Figure 3 on
  I = (x², xy², y³) instead of the empty ideal, 13 Figure 1 at x = 1.5 (two
  preimages) instead of 0.6 (none), 08 Figure 3 at β = 0.4 instead of 0
  (both columns identical), 07 LRL arrow drawn 2.5x longer.
- Keyboard: 01 Figure 3 and 03 Figure 2 drag points take arrow keys; 06
  Figure 1 has a select of starting points (the plot was click-only); 10
  Figure 1 is one tab stop with arrow-key selection.
- Hover-only: 10 Figure 1 lattice norms showed only on hover; tap and keys
  now show them too.
- Phone layout: selects in 04/05 workshops overflowed; 04 sample table
  wrapped to two lines per row; 09 slider labels landed next to the wrong
  sliders; 10 Figure 3 squeezed text and math into flex columns; 11/12
  monomial grids and 10 Figures 2 and 4 and 07 Bohr diagram were redrawn in
  narrower viewBoxes so labels do not collide.
- Seeded: 01 invariance check samples, 02 Figure 4 orbit sample.

## Randomness left in place

- noether 01 "Apply a random shuffle", 02 "random M" buttons: shuffles.

## Needs a human

- The whole gallery had no dark theme. These two series now have one; the
  homepage and other series may not match until their tracks land.
- noether 02, 04, 05 still use colored verdict boxes (green/red bars) inside
  the workshops. They are part of the readout, so I left them.
- noether 06 Figures 1 and 2 both draw the pendulum phase portrait; Figure 2
  adds H(t) and the kick, so I kept both.
