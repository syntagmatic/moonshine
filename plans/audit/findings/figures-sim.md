# Figure pass: sim track (emergence, lattice-simulation)

Phase 4 figure and pedagogy pass under `FIGURE-BRIEF.md`. Every page in both
series was audited at 390x844 in light and dark: overflow, clipped or
overlapping SVG labels, role/aria-label, captions, and per-figure screenshots.
The page's main interactions were then driven in Playwright. All 22 pages pass
render-check.

## Summary

- Cut: one figure element, the emergence 14 Fig 1 gauge dial, because it
  repeated the live r readout. No whole figures were merged or cut. Where two
  figures share a chart type, they run different models or data.
- Most common problems:
  1. Fixed wide viewBoxes (640 to 700) shrank chart text to about 5px on a
     phone. Fixed in emergence 02, 03 and 11, and in lattice 02, 03 and 06, by
     sizing the viewBox to the column or switching to a narrow layout.
  2. KaTeX display equations widened the page (emergence 12 and 05 to 08,
     lattice 01, 03, 05 and 06). Fixed with `.katex-display { overflow-x: auto }`.
  3. No svg or canvas had a role or aria-label. All have them now. Decorative
     index art is `aria-hidden`.
  4. Loops ran off screen or ignored reduced motion (emergence 01, 04, 05, 06,
     09, 12, 13 and 14, and lattice 05).
  5. Figures opened empty until clicked (emergence 06 Fig 2, 07 histogram, 09
     Fig 3, 13 Figs 2 and 5, and lattice 02 Figs 1 and 2, 06 Figs 1 to 3). They
     now pre-run or run once when scrolled into view.
- Dark mode: neither series has a dark theme. Under a dark OS setting the
  pages render fully light, including their form controls, so no light figure
  sits on a dark page. Adding dark themes would be a site-wide decision (needs
  a human). Canvas palettes are hardcoded hex throughout, so it would be real
  work.
- Status pills: the lattice 06 "Above Tc" pill is gone (details below). The
  same pattern was removed or flattened in lattice 03 (the stabiliser badge)
  and emergence 09 ("TRAPPED").

## lattice-simulation

### 01 Lattices and wallpaper groups
- Cut/merged: none. The figures are a builder, a tiler with 17 groups, and a quiz.
- The KaTeX display overflowed to a scrollWidth of 843, now fixed.
- The wallpaper tiles were click-only divs. They now have role=button,
  tabindex, Enter/Space and aria-pressed. The thumbnail svgs are aria-hidden.
- The quiz options had role=button but no key handler. Enter/Space now answer,
  and an aria-label announces right or wrong.
- The builder svg has an aria-label. The tiler svg's label updates with the
  chosen group. The quiz svgs' labels don't give away the answer.
- Verified: Enter on the p6 tile switches the tiler, Space on a quiz option
  reveals the answer, and the gamma slider moves the lattice to Hexagonal.

### 02 Symplectic integrators
- Inline `grid-template-columns` styles beat the phone media query, so the Fig
  2 "steps" slider collapsed to its thumb and the Fig 3 row ran off the right
  edge. These are now classes that stack below 640px.
- Fig 1 opened with three dots and flat energy lines. It now takes 100 steps
  at load, so Euler has already escaped while RK4 and Verlet close their
  orbits. Run continues from there.
- Fig 2 now opens at 200 steps (area 1.65), not 0.
- The Fig 3 energy chart's viewBox now fits the column (legible axis labels).
- aria-labels are on all eleven svgs.
- Verified: Fig 2 Play goes from 1.65 to 2.70. Fig 3's h slider changes ΔL.
  Run toggles to Pause.

### 03 Life and symmetry attractors
- The stabiliser "badge" (a tinted box with a coloured left border) was the
  same status-pill pattern as lattice 06. It is now a plain "Stabiliser"
  readout in the info-box style. The group name keeps its legend colour, since
  that colour is data, and the readout is aria-live. Five prose and caption
  mentions of "the badge" now say "the readout" (or "Figure 1").
- The Fig 3 census had 5px text on a phone. Below 560px each row puts the most
  common shapes on a second line under its bar, and the viewBox matches the
  column.
- The Life canvas, the eight orbit canvases and the census svg have aria-labels.
- The Figure 1 KaTeX display overflowed by 4px, now fixed.
- Verified: Pulsar gives a D4 readout, Play advances generations, and the
  census fills on scroll (159 rects).
- Randomness: the soups and census are deliberately random, since the caption
  says the numbers move between runs.

### 04 HPP vs FHP
- aria-labels are on the rules diagrams, the tensor heat maps, the four
  lattice canvases and the decay plot.
- The numbers in the darkest tensor cells were dark red on dark red. They are
  now white.
- The panel heads wrap on a phone.
- The loop was already gated on visibility and reduced motion (verified that
  it holds at step 0 under reduced motion).
- Randomness: the initial occupations stay random. The fit readouts are live,
  and the caption cites no run-specific number.

### 05 Lattice Boltzmann
- Bug: the visibility observer fired "not intersecting" on page load and set
  running to false, so the flow never animated unless the reader found Pause
  (which read "Play" by then) and pressed it. The loop now just steps while
  the figure is on screen. Under reduced motion it waits for Play.
- Fig 1: the moving-channel bars were drawn on a 0.6 scale, so the 1/36
  diagonals were about 4px stubs. They are now drawn on a 0.2 scale (the rest
  circle keeps its own scale). The values computed are unchanged.
- The boxed explanatory note under Fig 1 is now plain secondary text (it had
  been a callout box).
- The D2Q9 stencil inset covered part of the 300x90 flow on a phone. It is
  hidden below 560px, since the caption and Fig 1 already show the stencil.
- The KaTeX display overflowed to a scrollWidth of 868, now fixed.
- Verified: step 0 before scroll, 268 when visible, holds off screen,
  reduced-motion Play works, and the Fig 1 diagonal preset redraws.
- Needs a human: clicking the canvas adds obstacle cells, but there is no
  keyboard path. The select control covers the obstacle choice, so I left it.

### 06 Ising and the Z2 break
- The status pill is gone. The "Above Tc / Near Tc / Below Tc" tinted box and
  its JS are removed. T / Tc is now a plain row in the Live state readout. No
  prose referred to it.
- Fig 1 opened as salt-and-pepper noise at sweep 0, and Fig 2 was empty. The
  boot now runs 150 Metropolis sweeps, so critical domains and a trace show
  before anyone touches it.
- Fig 1 feeds Fig 2, but it paused as soon as Fig 1 left the screen, so the
  trace froze while the reader looked at it. It now pauses only when both
  figures are off screen.
- Fig 3 was an empty chart until Run was pressed, and had 5px text on a phone.
  It now runs once when first scrolled into view, sizes its viewBox to the
  column, and renders "Tc" with a real subscript instead of "T_c".
- **Caption corrected (confirmed by rerun):** Fig 3 said the points
  "undershoot" Onsager near Tc. I replicated the figure's exact procedure
  (L=32, ascending from all-up, 200 warm-up and 400 samples) six times. At
  T=2.25 the sim gives 0.71 to 0.76 against Onsager's 0.672. At 2.35 to 2.46
  it gives 0.12 to 0.50 against 0. So the points overshoot and stay above zero
  past Tc, which is the finite-size effect the prose describes. The caption
  now says so. Script: scratchpad `l06-fig3.mjs`.
- The KaTeX display overflowed to a scrollWidth of 608, now fixed. The three
  figures have aria-labels.
- Verified: boot sweeps 150, Play advances, still running at Fig 2, paused far
  away, a preset updates T/Tc, and Fig 3 draws 25 points.
- Randomness: Metropolis and Wolff stay random. Nothing cites a specific run.
- Still open, not a figure issue: "ten million flips per second" and the
  64×64 vs 80×80 prose mismatch (see prose-sim).

### index
- The header art svg is now aria-hidden (decorative).

## emergence

The per-article notes follow. They were written while each page was worked on.

### Figure pass notes: emergence 01-04

Nothing was cut or merged in these four pages. Each figure differs from its neighbours in both chart type and data.

Dark mode: none of the pages has a dark theme. Under a dark OS setting they render fully light and stay consistent (checked with the audit's dark scheme). No change made.

#### 01 cellular automata (4 figures)
- Cut/merged: none. Fig 1 is a space-time plot plus a rule editor. Fig 2 is the ant grid plus a distance chart. Fig 3 is the Lenia field plus kernel and growth plots. Fig 4 is the survival heatmap plus a replay. They are different kinds of figure.
- Layout: the Fig 3 kernel and growth axis titles collided with their tick labels and were clipped at the bottom of the svg at 390px. I raised the bottom margin from 30 to 36 and moved both titles up.
- A11y:
  - role="img" and a specific aria-label on the Fig 1 space-time svg, the ant canvas and chart, the Lenia canvas, the kernel and growth svgs, and the map replay canvas.
  - The truth-table output cells were click-only divs. They now have role=button, tabindex, Enter/Space, and aria-pressed.
  - The Fig 3 probe was hover or tap only. The canvas is now focusable: the arrow keys move the probe (Shift moves it further) and Escape clears it.
  - The Fig 4 heatmap cells are now focusable buttons with Enter/Space and an aria-label (R, T, outcome, ratio). The svg is role=group.
  - Added a focus-visible outline for all of the above.
- Motion: the ant's Play loop now stops while the figure is off screen and resumes when it comes back. Lenia and the map viewer were already gated on visibility and reduced motion.
- Randomness left in place: "Random start" in Fig 1 is an explicit reader-triggered random seed.
- Not fixed or needs a human:
  - Editing single cells of the Fig 1 top row is still mouse or tap only. Keyboard users can still use Single cell, Random start, the preset and the rule number.
  - Under reduced motion, the Fig 4 replay still plays. It fast-forwards over about 30 frames, which is under a second, and it is the result of a click.
- Verified:
  - Truth table via the keyboard: rule 110 changed to 238.
  - Lenia arrow-key probe: the readout gains u and G(u).
  - Heatmap cell via Enter: the replay switches run.
  - Ant slider: the readout changes.
  - No errors, with or without reduced motion.

#### 02 flocking (3 figures)
- Cut/merged: none. Figs 1 and 2 are both particle canvases, but they run different models (boids vs Vicsek). Fig 2 adds the φ trace. Fig 3 is a measured sweep.
- Layout: the Fig 3 sweep used a fixed 680-wide viewBox, which made its text about 5px tall at 390px. Under 520px the chart now uses a 380-wide viewBox, and "random headings" sits inside the plot above its line. The "moving" curve label was clipped at the top, so it now drops below the first point when it would leave the plot. The "noise η" axis title was also clipped at desktop width, so I nudged it up.
- A11y: role and aria-label added to all three canvases and to the sweep svg. Clicking the chart to set η has a keyboard equivalent in the Fig 2 noise slider.
- Motion: already correct. Every loop is gated by visibility and REDUCED.
- Randomness left in place: the page uses a seeded mulberry32, but the seeds come from Date.now(). The prose numbers (the background runs, η*, the frozen and moving maxima) are filled in live from the same run, so no fixed seed is needed.
- Not fixed: the Fig 2 caption says "the trace on the right", but on a phone the trace sits below the canvas. That is a prose wording question, so I left it.
- Verified: clicking the sweep chart changed η from 1 to 3.6 in Fig 2. No errors.

#### 03 traffic shockwaves (4 figures)
- Cut/merged: none. Fig 1 is the IDM ring with its space-time diagram. Fig 2 is the stability map. Fig 3 is the NaSch road. Fig 4 is the fundamental diagram.
- Layout:
  - Figs 2 and 4 used fixed 680-wide viewBoxes, which gave about 5px text at 390px. Under 520px they now use a 400-wide viewBox (a little taller), 11px tick labels and fewer x ticks.
  - The "uniform flow unstable" label had dots showing through it, so it now has a halo in the tongue colour.
  - In Fig 4, the "IDM, uniform equilibrium" label overlapped "NaSch, p = 0.25 (measured)" near the peak, so it moved 30 cars/km along the curve. "IDM rings (measured)" now has a white halo over the dots.
- A11y: role and aria-label on all five canvases (ring, space-time, speed key, road, CA space-time) and both svgs. The click-a-car interaction has a real button next to it (Brake one car). Clicking the stability map has keyboard equivalents in the N and a sliders.
- Motion: already correct. Onvisible gating, REDUCED run buttons, and Fig 3 autoplays only when not reduced.
- Randomness left in place:
  - Fig 3 NaSch uses Math.random. It is a stochastic model, and the caption describes only qualitative behaviour.
  - The Fig 4 NaSch points use Math.random. They are averages over 1000 ticks on 400 cells, so they are stable to the eye.
- Not fixed or needs a human:
  - The Fig 1 caption says "Left ... Right", but on a phone the panels stack.
  - The wave speeds and jam fronts in the prose were never rerun. This is already listed in CUTS.md.
- Verified: clicking the stability map changed Fig 1's N from 45 to 87. Fig 4 finishes measuring (data-done=1). No errors.

#### 04 coarsening and consensus (5 figures)
- Cut/merged: none. Fig 1 shows the rule. Fig 2 is coarsening with a log-log L(t). Fig 3 is outcome bars. Fig 4 is the opinion traces. Fig 5 is the cluster-count sweep.
- Layout: the Fig 3 legend ran off the right edge at 390px ("still moving" was cut). It now wraps into two rows, with a taller top margin, when the chart is under 440px wide.
- A11y: role and aria-label on the three canvases and the three d3 svgs. All controls were already real buttons and inputs.
- Motion: the Play loops in Figs 1, 2 and 4 kept running off screen. A new whenHidden() helper now pauses each one when its figure leaves the viewport. The autoplay of Figs 2 and 4 already respected REDUCED.
- Randomness left in place: every figure here is a stochastic model (random-order updates, random initial mixes, random meetings). The prose and captions give ranges ("between about 0.42 and 0.54", "usually"), and the specific numbers are live readouts, so nothing needs a seed.
- Verified: Play in Fig 1 advanced to 950 sweeps. After scrolling to Fig 5 the button reads "Play", so the loop paused. No errors, with or without reduced motion.

All four pages pass render-check. There are no em dashes in the edited files.

### Figure pass notes: emergence 05-08

All four pages: 390px light audit is clean (no overflow, clipping or label overlap left; every
figure svg/canvas has role + aria-label; every figure has a caption). Under a dark OS setting
the pages stay fully light (no dark theme exists), so nothing looks broken; no dark fixes made.
`.katex-display { overflow-x: auto }` added to each page. render-check PASS on all four.

#### 05 spin glass
- Cut/merged: none. Fig 1 (bond frustration), Fig 2 (annealing traces), Fig 3 (exhaustive
  valley scatter) are three different chart types on different data.
- A11y: Fig 1 and Fig 2 lattices are role=group with labels; each spin is a focusable
  role=button circle, Enter/Space flips it (Fig 2 only while paused, as before) and keeps focus.
  Run chips were click-only spans; now real `<button>`s. Fig 3 scatter is focusable; arrow keys
  step through valleys in energy order (hover/tap already worked). Mini-config svg labelled.
- Layout: Fig 2 "Cooling progress" axis label was clipped by 1-2px; bottom margin 30 -> 36.
- Motion: annealing is user-started (no autoplay); it now pauses while off-screen via
  Motion.onVisible and resumes on return.
- Randomness left: bonds, spins, Metropolis and quenches. Prose gives ranges across draws
  ("between about 40 and 150", "one in fifteen to one in four"), so no single run needs seeding.
- Minor, not fixed: Fig 1 has ~60px of empty space under the lattice at phone width.
- Verified (Playwright): keyboard flip changes energy and keeps focus; Run annealing completes
  and makes a chip; Space flips a spin after the run (fill and energy change); ArrowRight x6 on
  Fig 3 changes the selected valley readout. No errors.

#### 06 percolation
- Cut/merged: none. Fig 3 (cluster map) and Fig 4 (its size distribution) share data but are
  different views; Fig 6/7 likewise (SOC map vs fire-size histogram).
- Bug fixed: Fig 2's caption says "Drag the blue line to change the density in the forest
  above", but `window._forest` was never defined, so the drag only updated Fig 3 (below). Added
  `window._forest.setDensity` in the Fig 1 IIFE (sets slider, label, regenerates forest).
- Fig 2 was empty until "Run sweep" was clicked; it now runs once when first scrolled into
  view (same IntersectionObserver pattern Fig 5 already used).
- A11y: Fig 2 svg is now role=slider with aria-valuenow, focusable; arrows nudge the density
  line 1%, a tap anywhere on the plot moves it (drag still works). Labels on all 7 figures.
  Fig 1 canvas click-to-ignite has adjacent Ignite buttons, so no extra keyboard path.
- Motion: Fig 1 fire loop pauses off-screen. Fig 6 Drossel-Schwabl ran forever with no
  off-screen pause and still animated under reduced motion; now it stops scheduling when
  off-screen or paused, and with reduced motion it runs 1500 steps synchronously, starts paused
  with a "Resume" button, so the forest and Fig 7 histogram already show a settled state.
- Randomness left: forest generation, fire spread, sweeps and SIR outbreaks. Prose and captions
  cite thresholds and ranges, not a specific run; Fig 7's slope is fitted live.
- Verified: ignite + Play burns; sweep auto-fills 32 points; ArrowLeft x5 moves line and both
  Fig 1 and Fig 3 density sliders; tap at 80% sets both to 82; SOC fires grow, stop on Pause,
  stop off-screen; reduced-motion run starts paused at ~650 fires and Resume runs it. No errors.

#### 07 sandpile
- Cut/merged: none.
- Caption: the sandpile figure had none. Added "Figure 1" caption (grid size, color key, click
  vs auto-drop) and folded the stray one-line paragraph "Colors encode grain count, lightest 0
  to darkest 3." into it; removed the duplicate click-hint. Renumbered the others to Figures
  2-4 (no prose referenced the old numbers).
- Empty figures: Fig 1 starts empty on purpose (the prose narrates the pile filling up), but
  that left Fig 2 (avalanche histogram) empty unless the reader drove Fig 1 to criticality.
  Now, if Fig 2 scrolls into view with no avalanches recorded and auto-drop is off, 50,000
  grains are dropped synchronously (30,000 = Skip, then 20,000 recorded). Result: ~12,800
  avalanches, fitted tau 1.10, matching the prose "settles near 1.1".
- A11y: sandpile canvas focusable, Enter/Space drops a grain at the centre; labels on the
  canvases and the three svgs; focus-visible outline on canvas.
- Motion: auto-drop is user-started; now pauses off-screen and resumes on return.
- Randomness left: drop sites (the model is defined with random drops); tau is fitted live.
- Needs a human: Fig 1 still opens blank by design. If the pedagogy rule "no blank canvas"
  should win, start it at the critical state and adjust the paragraph above it.
- Verified: 5 x Enter -> 5 grains; Auto-drop runs (490 grains in 0.8 s) and stops off-screen;
  fresh load then scroll to Fig 2 -> 38 dots, tau 1.10. No errors.

#### 08 Laplacian growth
- Cut/merged: none. Fig 1 (DLA + arrival heatmap), Fig 2 (stickiness pair), Fig 3 (DBM eta),
  Fig 4 (landscape + Horton chart) each show a different mechanism.
- Layout: `.stat-row` did not wrap, so Fig 4's "Slope / steady-state prediction" readout ran
  off the right edge at 390px and Fig 2's labels wrapped word by word. Now flex-wrap with
  nowrap labels. Horton chart: "segments Nω" axis label overlapped the third legend line;
  top margin 64 -> 72.
- Hover-only: Horton river points reacted to mouseenter/focus; added click so a tap works, and
  the note reads "Hover, tap or tab to a blue point".
- A11y: labels on all five canvases (Horton svg already had one).
- Motion: all four loops already honoured onVisible and started paused under reduced motion,
  but then Figs 1-3 showed a black canvas. Now with reduced motion each pre-grows for about
  0.3 s synchronously (Fig 1 ~3,000 particles, D 1.58; Fig 2 both clusters; Fig 3 ~650 steps).
  Fig 4 already shows a channelled terrain.
- Randomness left: all four are stochastic growth models; prose cites typical values only.
- Needs a human: Fig 3 (DBM) at eta = 1 mostly creeps along the top and side edges rather than
  growing "downward from a point" as the caption says; a trunk appears but most growth hugs the
  grounded boundary (same in normal and reduced runs, ~650-870 steps). Likely the phi = 0
  boundary next to the seed; changing it would change the model, so not touched.
- Verified: Fig 1 grows while visible; river-point click and Tab both update the note; Fig 3
  runs to 870 steps. No errors.

### Figure pass notes: emergence 09, 10, 11, index

#### 09 Self-Avoiding Walks
- Cut/merged: none. The three figures show different things: an overlay of walk ensembles, a log-log scaling fit, and trapping (one walk plus a histogram).
- Phone layout: in the stacked (<=600px) layout, `.fig-split` used `align-items: flex-start`, so each column shrank to fit its content. Fig 1 canvases were only about 145px wide, and the Fig 3 histogram was a thumbnail with its axis label on top of the tick labels. Fixed with `align-items: stretch`. The canvases and histogram are now sized from their wrapper (stacked aspect 0.75/0.6), the histogram's bottom margin is larger, and stat-row row-gap is 0.35rem (it had 24px gaps between stacked readouts).
- Sensible default: Fig 3 used to open empty ("Collect walks to build histogram"). It now opens with one walk already run into its trap and a histogram of 500 trapped walks, so the median and P(survive) readouts are filled in.
- Status readout "TRAPPED" is now lowercase "trapped" (a plain readout).
- Motion: the Fig 1 batch reveal pauses off-screen (Motion.onVisible). Under reduced motion it draws all 80 walks at once. Fig 3 Run: under reduced motion it jumps straight to the trap. The running loop pauses off-screen.
- A11y: role="img" and a specific aria-label on all 5 canvases/svgs. All controls were already buttons and inputs. KaTeX display overflow rule added.
- Randomness left in: all of it. These are ensemble statistics. The prose cites a range (0.59-0.65) and no single run.
- Interactions verified: slider plus Reset (Fig 1), Run (Fig 2), New Walk plus Run, Collect 500 (Fig 3). Also Fig 1 and Fig 3 under reduced motion. No errors.

#### 10 Stigmergy
- Cut/merged: none. Four different models: Physarum, the double bridge, the active walker, termites.
- Motion was already good: a shared makeRunner pauses off-screen and settles offline under reduced motion.
- A11y: role="img" and an aria-label on all 4 canvases and the bridge chart svg. KaTeX display overflow rule added.
- Phone layout at 390px was clean. The one empty spot is the bridge histogram area, which stays blank until "Run 20 colonies" is clicked; I left it as it is.
- Randomness left in: all of it. The quoted outcomes (14-17 of 20 colonies and so on) are batch statistics.
- Needs a human (already flagged in prose-sim): the Fig 1 caption says 45° is "the values Jones used most often".
- Interactions verified: Run 20 colonies, Reset on growth/trails/termites, Emission Off, and termites under reduced motion. No errors.

#### 11 Predator-Prey in Space
- Cut/merged: none. Three different figures: the ODE phase plane, the RD field with a probe strip, and the lattice with a lambda sweep.
- Phone layout: the Fig 1 phase plane and time strip used a 680-wide viewBox, so their text shrank to about 5px. The Fig 2 strip had the same problem. On narrow screens they now use a 400-wide viewBox, with axis and label text at 13px. Margins were adjusted so strip ticks don't clip and the Fig 3 "predation rate" label doesn't collide with tick labels.
- The Fig 2 caption's parameter list was one unbreakable KaTeX span. It overflowed and was clipped (D_P hidden), so it is now split into one span per parameter.
- Touch/keyboard: on a phone the Fig 1 start handle was about 4px. There is now a 22-unit invisible hit circle, tapping anywhere on the plot moves the start there, and the svg is focusable with arrow keys. The Fig 2 canvas is focusable, and Enter/Space draws a vertical barrier that steps right across the grid (the keyboard equivalent of drag-to-draw).
- A11y: role="img" and aria-labels on all 6 svgs/canvases. KaTeX display overflow rule added.
- Motion was already handled. Fig 1 and Fig 2 keep a rAF loop ticking off-screen but do no work there. Fig 2 pre-runs 3000 steps and pauses under reduced motion.
- Randomness left in: the noise init in Fig 2 and the lattice and sweep in Fig 3. These are stochastic, and the text cites no specific run.
- Not fixed: the Fig 2 canvas has `touch-action: none` (needed for drawing barriers), so a phone reader can't scroll while their finger is on that near-full-width canvas. The caption still says "Left:/Right:" for Fig 3, which is stacked on a phone. The "time" label in the Fig 1 strip slightly overlaps the curves.
- Interactions verified: tapping the plot, arrow keys, dragging, the satiation mode button, the Fig 2 pause plus Enter barrier, and the Fig 3 lambda slider. No errors.

#### index
- The header boid flock ignored reduced motion. It now runs 400 steps offline and draws once. It was already paused off-screen.
- The header svg and the 14 card thumbnails are decorative, so they are aria-hidden (the card text names each article). The audit script still lists them because it doesn't read aria-hidden.
- Math.random in the header flock left in (decorative).
- The phone layout was clean (scrollWidth 390).

render-check PASS on all four pages. No em dashes in the added text.

### Figure pass notes: emergence 12-14

All three pages have no dark theme and render fully light under a dark OS
setting (the audit flags the whole page as light, as expected). No figure looked
broken in dark mode, so no dark changes.

#### 12 Reaction-diffusion

- Cut/merged: none. The four figures are a live 2D sim, a parameter mosaic, a
  scaling chart and a noise comparison. Each is a different chart and data.
- Layout: the page scrolled sideways to 665px at 390px because of the display
  equation. Added `.katex-display { overflow-x: auto }`. Fig 2's preset labels
  were drawn at 10px in a 400px canvas space, so they shrank to about 7px on a
  phone and collided (Coral/Stripes, Solitons/Mitosis/Mazes). The overlay now
  sizes its backing store to its CSS size times dpr and draws 11px labels. Four
  labels sit on the left of their dot. The saddle-node curve label moved to the
  empty lower-left corner. The status bar wraps.
- Hover-only: Fig 2's f/k hover tip was hover-only. The status bar now always
  shows "Figure 1 at f = ..., k = ...", which updates on click, tap, or preset.
- A11y: role="img" and aria-labels on the sim canvas, the param map (the
  overlay is aria-hidden), both Fig 3 svgs and both Fig 4 canvases. The Fig 1
  canvas draws by drag. Perturb is the button that does the same. The map
  click is matched by the preset buttons and Fig 1's sliders.
- Motion: the Fig 1 rAF loop ran forever, even off-screen, and under reduced
  motion it still animated at 1 step per frame. It now stops off-screen
  (Motion.onVisible). Under reduced motion it starts paused, showing a pattern
  after 1500 steps computed up front (debounced when sliders reseed), and Play
  starts it. Removed the "fps" readout, which was debug output.
- Randomness left: Fig 1 seeds and Perturb are random, because the prose says
  the spacing does not depend on where the seeds went. Figs 3 and 4 were
  already seeded (prng).
- Verified: Pause/Play stops and starts the step count, the loop stops when
  scrolled away, a click on the param map sets Fig 1's f slider and the
  readout, and the reduced-motion start shows step 1500 paused.

#### 13 Excitable media

- Cut/merged: none. Fig 3 (1D cable CA) repeats the collision point from Fig 2,
  but it is a different model and a different view. It also sets up the
  cardiac section. Kept.
- Layout: Fig 1 x-axis labels overlapped the tick labels ("0" and "u
  (activator)", "20" and "time"). The bottom margin went up and the labels
  moved down.
- Defaults: Fig 2 (BZ dish) and Fig 5 (spirals) opened on blank tissue. Fig 2
  now starts with two waves launched so they collide. Fig 5 opens on the "Seed
  spiral pair" state. Fig 3 stays at rest until poked, with its buttons right
  under it.
- A11y: role/aria-label on both Fig 1 svgs and all four canvases. The Fig 2
  canvas is the only way to start a wave, so it got tabindex=0, and
  Enter/Space starts a wave at a random point. Fig 3 and Fig 5 canvas clicks
  have button equivalents.
- Motion: `reducedMotion` was declared but never used, and all five rAF loops
  ran forever. Every loop now stops off-screen. Under reduced motion: Fig 1
  integrates a full 400-step window at once and draws it still (again on
  slider or reset). Figs 2, 4 and 5 start paused on a pre-computed state
  (160, 400 and 600 steps) with Play to start. Fig 1 also rendered the SVG on
  every integration step, and now renders once per frame. Added a
  Pause/Play button to Fig 5, which had none. Every scenario button now
  redraws at once, so it shows while paused.
- Randomness left: "Induce fibrillation" and the keyboard stimulus are
  random. They are shuffle-like actions, and no result is cited.
- Not fixed: the Fig 5 stats row has a "Regime: resting / conducting /
  tachycardia / fibrillation" label. It is plain text, not a pill, but it is
  a status readout. A human could decide whether to keep it. Fig 4's "Heart
  rate ... bpm" assumes 8 ms per step, which is an arbitrary scale.
- Verified, both motion modes: each canvas moves or holds as expected, Pause
  and Play toggle it, the spirals stop off-screen, Enter on the BZ canvas
  pokes, "Poke both ends" moves the cable, and the phase plane redraws on the
  excitability slider.

#### 14 Kuramoto

- Cut: the Fig 1 semicircular gauge (SVG dial plus needle). It repeated r,
  which the arrow in the circle and the number already show, and it read as a
  dashboard dial. The readout is now a plain "Order parameter r = 0.62" line.
  No prose referred to it.
- Layout: Fig 2 was 136px tall at 390px, with a plot area of about 76px. The
  height is now at least 200px. Fig 3's histogram domain ran from the
  Lorentzian extremes (about -55 to 10), which crushed the bulk into two bars.
  The domain now uses the 5th to 95th percentile (at least ±3), outliers pile
  into the end bins, and a "n further out" note is drawn. freqToColor uses the
  same robust range and clamps it. Before, Lorentzian tails made nearly every
  dot the same colour in Figs 1 and 3, although the caption says they are
  colored by frequency.
- Hover/tap: the Fig 2 drag set K only on a drag movement. A tap now sets it
  too (d3.drag 'start'). The svg has tabindex=0, and Left/Right arrows step K
  by 0.1 for Fig 1.
- A11y: role/aria-label on all svgs and canvases. The fireflies canvas got
  tabindex, and Enter/Space perturbs a random patch. The ring's click has the
  "Perturb 3" button as its equivalent.
- Motion: `reducedMotion` was declared but never used, and all four rAF loops
  ran forever. Every loop now stops off-screen. Under reduced motion, Figs 1
  and 3 integrate 400 steps at once and draw the end state, again on every K
  or distribution change. The fireflies (flashing) and the ring start paused
  on a precomputed state. Added Pause/Play buttons to Figs 4 and 5. The ring's
  recovery timer now counts simulated time, so a pause or scrolling away no
  longer inflates it.
- Randomness left: all of it. Frequencies, phases and perturbations are
  stochastic. Fig 2's r(K) curve is recomputed from random runs on each load,
  and the caption cites only the 1/sqrt(N) scale, not specific values, so it
  was not seeded.
- Not fixed: Fig 3 has a large empty gap between the histogram and the circle
  at phone width (the flex column layout). It is cosmetic.
- Verified, both motion modes: the circle animates or stays still, the Synced
  preset gives r of 0.62 live after 4 s and 0.85 settled, a tap on Fig 2 sets
  K = 2, arrows step it to 2.2, the distribution button redraws the
  histogram, fireflies and ring Pause/Play work, and Perturb 3 starts the
  recovery timer.

render-check passes on all three pages. No em dashes in the three files.
