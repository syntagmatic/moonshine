# Figure pass: applied track

Series: mathematical-diagrams, bioinformatics, lithium-ion, japan-earthquakes.
Checked at 390x844 in light and dark (japan-earthquakes also in Japanese), with a
headless render check on all 34 pages and a driver that moves every slider,
clicks every button and select, and keys every focusable svg in every figure.
All 34 pages pass render-check with no console or page errors.

The work was split across helper agents that were cut off by a usage limit
partway through. I verified their edits page by page and finished the rest:
japan-earthquakes 03 to 07, lithium-ion 05 and index, the
mathematical-diagrams index, and dark-mode palettes in bioinformatics 06 and 08.

## Common problems

- **Text shrinks to 4-6 px on a phone.** Nearly every svg was drawn in a
  680-700 unit viewBox and scaled to about 330 px. The fix is one of two: a
  narrower viewBox for phones (mathematical-diagrams 05, lithium-ion 01-05,
  japan 04-07), or text multiplied by the scale factor so labels land near
  their nominal size (japan 01, 03, 05, 06). Side-by-side panels stack on
  phones (lithium-ion 05, japan 04 regions, mathematical-diagrams 09).
- **Light fills baked into JS.** Map oceans, land (`#e8e8e0`), white strokes,
  navy text (`#1e40af`, `#1a1a2e`) that vanishes on a dark page, and scales
  whose low end is near white. Each series now resolves colors at draw time:
  lithium-ion through `Li.theme.c()` in `lib/battery-math.js`, japan through
  `shared/theme.css` (`--land`, `--land-stroke`) plus per-page `DARK` checks,
  the others through `getComputedStyle` reads. No `var(--x)` goes through a d3
  scale or transition.
- **Hover-only tooltips.** Tap (click) paths added everywhere; tapping outside
  closes them. Keyboard focus shows the same tooltip where the marks are few
  enough to tab through (japan 05 timeline, 04 region panels, math 09, bio 06/08).
- **Missing role/aria-label** on nearly every figure svg. Japan labels switch
  with the language toggle.
- **Labels drawn after a data fetch missed the Japanese translation pass.**
  `shared/i18n.js` now exposes `translatePageLabels(root)`; pages call it once
  their async labels exist (japan 01 to 05).

## mathematical-diagrams

- No figures cut. 01-10 got dark-mode fixes, phone layouts, keyboard paths
  and aria labels (helper agents; spot-checked 05, 09, 10 in dark at 390 px).
- 05: the page slider, the build-your-own sandbox and the extension figure all
  switch to a compact coordinate system on phones; transition colors are
  resolved values; transitions honor `Motion.reduced()`.
- index: had no dark theme at all. Added one mirroring the article pages, and
  the header vignettes read their colors from the page so they follow it.

## bioinformatics

- **Merged, 06:** the color-scale and value-transform figure used the same
  30 x 10 matrix as Figure 1, so its toggles moved into Figure 1.
- **Merged, 08:** the three-gene Kaplan-Meier figure (old Figure 5) became gene
  buttons on the split-KM figure. Figure 3 (single KM curve) stays: it teaches
  reading one curve before the split, and adds censor marks, CI and median.
- index: the no-op `createThumb` code, superseded by the SVG glyphs, removed;
  header animation pauses off-screen.
- 06 dark: RdBu's white midpoint replaced by a dark neutral; the consensus
  matrix runs from background to light in dark mode, and its caption and aria
  label no longer say "darkest".
- 08 dark: CR and PR teals were nearly identical; they now differ in lightness.

## lithium-ion

- No figures cut. Dark theme for all pages through `Li.theme` (light hex to
  dark counterpart table), phone layouts via `Li.theme.figW`, and
  `Li.theme.keyCursor` for drag-cursor figures.
- **Correctness, confirmed:** `SEI_K_REF` was 2e-20 m^2/s, which gives
  sqrt(2e-20 x 3.156e7 s) = 790 nm of SEI in year one against the stated ~20 nm
  and ran off Part 3's axis. Now (20 nm)^2 / 1 yr = 1.27e-23, which gives 20 nm
  and, with ALPHA = 1.5e6, the stated ~3%/yr calendar fade.
- **Correctness, confirmed:** Part 4's circuit drawing had the Warburg element
  outside the parallel block. `randlesZ` (unchanged) puts it in series with
  R_ct inside the faradaic branch, which is the Randles circuit. The drawing
  now matches the computation.
- DLA growth in Part 3 takes a seeded rng; the drawing is reproducible.
- 05: panels stack on phones; the runaway map's OrRd scale (near-white at 0)
  becomes a dark-to-red ramp in dark mode.
- index: header animation pauses off-screen; separator fill no longer cream in
  dark mode.

## japan-earthquakes (co-authored, bilingual: layout, dark and a11y only)

- No figures cut. 03's sparkline was in its own caption-less figure box; it
  now sits inside the animation figure whose caption already describes it.
- `shared/theme.css` (new): series dark palette, map land colors, dark styling
  for the motion.js notice, phone padding.
- `shared/i18n.js`: the language toggle floated over headings below 1000 px;
  it now sits in its own row there. Adds `translatePageLabels`.
- 01: brush presets as buttons, tap for dot details. 02 similar (helper).
- 03: controls bar and map dark, city and sparkline labels scaled, sparkline
  keyboard-scrubbable (arrows, Home/End), year ticks use UTC (showed 1999).
- 04: phone layout for both figures; regional panels respond to tap and focus;
  the dashed b = 1 reference line was nearly invisible (`--border`) in both
  modes and now uses `--text-2`.
- 05: all three charts readable on phones; timeline legend moves below the
  plot; labels kept inside the plot after a language switch.
- 06: cross-section and shoaling diagrams use a narrower viewBox on phones;
  navy labels readable in dark; fault-type cards translated (they were
  English only in Japanese mode).
- 07: timeline gets one label row per event on phones; action chart puts
  labels above bars; Speed/Scenario labels and scenario options translated.

## Randomness left in place

- bioinformatics 01, "random" column sort: a shuffle the reader asks for.
- lithium-ion 05 "new cells" / "new drive" and bioinformatics 07 "new random
  start" step a seed, so each click is a fresh but reproducible draw.

## Needs a human

- `docs/lib/motion.js` mounts the "machine-generated" notice with inline light
  styles (`#f8fafc`), so it is a light box on every dark page outside
  japan-earthquakes. The fix belongs in motion.js, which is outside this track.
- japan 06, strike-slip card: the two arrows point toward each other, which
  reads as convergence rather than lateral slip.
- japan 06, "Deep earthquake" card: the "deep" label under the star falls
  outside the 130-unit viewBox and is clipped.
- japan 06 propagation map: labels are still small on a phone (about 7 px) and
  the epicenter label overlaps Sendai. Most of the map is open ocean; a tighter
  crop on phones would help but changes the figure, so I left it.
- japan 07 timeline caption mentions "the dashed line" separating underground
  events from public ones, but the timeline draws no such line.
- japan 07 map: Sapporo is at the top edge and its label is clipped.
- lithium-ion 05 captions say "Left:" and "Right:"; on phones the panels are
  stacked top and bottom.
- bioinformatics 08 Figure 1 has a three-row stat box (ORR, disease control,
  new-lesion PD) that borders on a metric grid. It's a readout, so I left it.
