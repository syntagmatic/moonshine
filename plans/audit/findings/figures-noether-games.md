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

## game-is-the-math

Cut or merged: none. Every figure pair I checked differs in data or chart
type (01 Figures 3 and 4: bit grid for three heaps vs. n-heap winning-move
readout; 08 Figures 1 and 2: game tree vs. thermograph of the same switch; 09
Figures 1 and 2: play vs. random full boards with a no-draw tally).

Fixed because it was wrong:
- 10: an unclosed `@media (max-width: 640px) {` swallowed the rest of the
  stylesheet, so the footer styles applied only on phones. Removed.

Layout, defaults, accessibility:
- Keyboard: every clickable piece (heap rows, beads, Hackenbush edges, game
  tree nodes, board cells, hex cells, number chips) is now a focusable button
  through `lib/figure-a11y.js`. 10 Figure 1 had one click handler on the whole
  board; the segments now carry their own labels ("Horizontal segment, row 2,
  column 3") and show the hover highlight on focus.
- Hover-only: 01 Figure 2 cell details showed only on hover; tap now shows
  them and the text says so.
- Phone layout: 04 Figure 3 set the theorem as one wide KaTeX `aligned` block
  that was cut off; it is now text with inline math. 06 Figure 1 day-4 labels
  collided (they now alternate between two rows) and the day labels were
  clipped; 06 Figure 4 option chips overflowed their panel; 07 Figure 2 board
  was a fixed 360px and was cut off; 07 Figure 3 strip table used 18px cells
  per square, so the length-8 row was about 170px tall; 05 Figure 5 (18 small stalks) was a
  two-column stack two screens tall and is now four columns; 01 an inline
  list of eight pairs could not wrap.
- Sensible defaults: 09 Figure 2 opened on an empty board; it now opens on a
  seeded full board with the winning chain drawn.
- Dark mode: text on filled accents (active buttons, set bits) flips to
  near-black, since the accents get lighter.
- Motion: this series has no animation loops, only short delayed computer
  moves; 03 and 08 already skip the delay under reduced motion.
- 03 Figure 2 opened on a random preset; it now opens on the first one.

## Randomness left in place

- noether 01 "Apply a random shuffle", 02 "random M" buttons: shuffles.
- games 01 "Random position", 02 "Random length", 04 "random shared
  position", 09 "Random fill", 03 "New position": reader-requested shuffles.
- games 09 and 10 computer opponents break ties with a little noise, so they
  do not replay the same game every time. That is the point of an opponent.

## Needs a human

- The whole gallery had no dark theme. These two series now have one; the
  homepage and other series may not match until their tracks land.
- noether 02, 04, 05 still use colored verdict boxes (green/red bars) inside
  the workshops. They are part of the readout, so I left them.
- games: several figures still use dashboard-style pieces (04 FAT/WINNING
  badges, 05 value badge, 10 score cards, colored "your turn" banners). They
  are game state, not decoration, so I left them, but they are the closest
  thing to status badges left in these series.
- games 02 and 05: Hackenbush edges are short on a phone (a 3-edge stalk is
  about 40px tall), so tapping one edge is fiddly. Keyboard works.
- noether 06 Figures 1 and 2 both draw the pendulum phase portrait; Figure 2
  adds H(t) and the kick, so I kept both.
