# Figure pass: atlas track

Series: exceptional-atlas, quasicrystals, foam, grateful-dead. Served on port 8132.
Each page was screenshotted per figure at 390x844 in dark (and light where layout
was in doubt); each figure was also run through a text audit (overflow, clipped
and overlapping SVG labels, missing role/label, missing caption, light fills on
a dark page). One commit per series.

## Dark mode

Quasicrystals and foam already had a dark `:root` block in their `style.css`.
Exceptional Atlas and Grateful Dead had none. I added one to each:

- **quasicrystals, foam:** added `color-scheme: light dark` so native controls
  turn dark. KaTeX `\color{#hex}` values are swapped for the dark palette when
  `matchMedia('(prefers-color-scheme: dark)')` is true (`Page.tex` in
  `quasicrystals/lib/page.js`; `texSrc` inline in each foam page).
- **grateful-dead:** `lib/theme.css` holds the dark tokens and is linked after
  each page's inline style. `lib/theme.js` exposes `GD.c(hex)`, which maps the
  neutral literals that the figure JS hardcodes (text inks, strokes, map land,
  empty cells) to their dark values. It reads the media query once. The slot
  heatmap keeps dark text on its pale low-count cells in both themes.
- **exceptional-atlas:** `lib/theme.css` holds the base dark tokens. Each page
  also gets its own dark block, with its `--c-*` concept tokens and dark
  versions of the page rules that hardcode colors. I generated the blocks once
  with a script (light to dark: pale tints become dark tints, dark inks become
  light, mid concept colors are lifted). `lib/theme.js` exposes `EA.c(hex)`, a
  generated 72-color table, and every quoted hex literal in the inline scripts
  and in `lib/e8-viz.js` and `lib/oct-viz.js` now goes through it. `theme.js`
  also wraps `katex.render` and `renderToString`, so `\color{#hex}` gets the
  dark value, and it loads right after KaTeX, before auto-render and the libs.
  Hand fixes:
  - 05's sphere panel is deliberately dark in both themes, so the generated
    inversion was removed.
  - 06 Fig 7's detail panel had an inline `#f8fafc` background.
  - 01's legend swatches were inline hex.

## Access (all series)

- Every figure `<svg>`/`<canvas>` now has a role and an aria-label.
  - qc, foam and gd were labeled by hand.
  - Exceptional Atlas has 60+ surfaces across nine dense pages, so
    `lib/access.js` names each one from the first sentence of its figure
    caption ("Panel i of n." when a figure has several).
  - Decorative index thumbnails are `aria-hidden`.
- **Exceptional Atlas access shim (`lib/access.js`).** It loads in `<head>` and
  records which elements get pointer listeners (d3's `.on` uses
  `addEventListener`). After load, and after any redraw (a debounced
  MutationObserver):
  - Clickable non-controls become `tabindex=0 role=button` and answer Enter
    and Space. The accessible name comes from the d3 datum or the text.
  - Hover-only elements become focusable, with focus acting as hover. A tap
    re-enters them, so their state survives the pointerleave a tap ends with.
  - I checked it headlessly on all 9 pages, at 390 light and 1100 dark. Every
    interactive figure changed its DOM from keyboard or button input, and no
    page threw errors.
  - The 08 mandala is a canvas picked by position, so the shim couldn't reach
    it. It got explicit arrow-key stepping through the 240 roots.
- **Hand-written keyboard and tap support elsewhere:**
  - qc 01 Fig 2: arrow keys step the points; tap selects.
  - qc 02 Fig 1: arrows on both canvases; tap. qc 02 Fig 2: arrows move the
    handle. The legend buttons got names.
  - foam 03: arrow keys rotate the solid.
  - gd:
    - tooltips open on tap, and a tap elsewhere closes them;
    - the stream layers, sparkline cells, year bars, venue bars, heatmap
      headers, year line, force nodes and co-occurrence rows are all
      focusable;
    - tooltips stay on screen at the edges.
- Captions that said "Hover ..." now say "Hover or tap".
- **Motion:**
  - gd 02 routes: under reduced motion, playback jumps to the finished state,
    and it pauses while off screen.
  - gd 04 force layout: under reduced motion it settles before the first
    paint.
  - EA 05's auto-rotate starts only when the figure is in view and never
    under reduced motion.
  - EA 08's idle rAF loop stops off screen, and stage transitions are instant
    under reduced motion.
  - foam 01 and EA 07 already complied.

## Figures cut or merged

- **GD 03 Fig 1 (anatomy of a show):** cut. It drew three averages (9.1 / 10.1
  / 1.7) that the prose right above it states, plus hover notes that repeat
  the prose. Figures renumbered 1-4.
- **GD 04 Fig 2:** a second force-directed copy of Figure 1's network, drawn
  only to be clicked on. I replaced it with a start-song `<select>` and kept
  the walk and its visit-share bars. The caption now points to Figure 1.
- **EA 03 Fig 5 (static E8 Dynkin with Cartan hover links):** merged into the
  delete-node figure, which draws the same diagram. The leg facts moved to
  that caption, and the Fig 4 caption now points to Figure 6. Renumbered 5-7.
  The hover-link JS and its CSS were removed.
- **EA 08 Fig 7 (8 rings):** cut. It was the same Coxeter-plane projection as
  Fig 6, already ring-colored, and its caption repeated Fig 6's. The prose
  paragraph on orbits stays. Renumbered 7-9, and the prose reference to
  "Figure 8" was fixed.
- **EA 07 E6 figure:** removed its facts card. It was a metric list repeating
  the sentence above it. The descriptive line became the caption. Before
  this, the figure had no caption, and its node labels were clipped by the
  viewBox.
- **foam 01 Fig 2:** removed the hover highlight, which only outlined the card
  and taught nothing, and the caption sentence about it.
- **EA 06:** removed the dead S7 navigator script ("NAV-LOCK ACHIEVED!") and
  its unused `--c-s7` token.

## Layout fixes at 390px

- **qc:**
  - Strip figures (01 Figs 2 and 3, 03 Fig 1) scroll sideways at a
    560px minimum width instead of shrinking their text to about 5px.
  - Charts (03 Fig 2, 04 Fig 2) scale their text up with `.big-type`.
  - 04 Fig 1 stacks its ratio chart under the diagram on a phone.
  - `touch-action: none` now applies only to the drag surface, so the page
    scrolls over the other figures.
- **foam:**
  - The tiling and isoperimetric cards sit three across.
  - Static diagrams (01 Fig 3, 02 Fig 3) crop their viewBox to the drawing.
  - 03 Fig 2 stacks, and its caption now says "first/second panel" instead
    of left/right.
  - 03 Fig 3 is drawn narrower on a phone.
- **gd:**
  - `.figure-wide` no longer overflows (it was 402px on a 390px screen).
  - The bar charts, heatmap, line chart and streamgraph are drawn at the
    container's width, and long names are truncated.
  - The map shows 10 city labels on a phone instead of 34.
  - Year-chart annotations are lifted clear of the neighboring bars.
  - The month legend is HTML and wraps.
  - The force layout clamps labels inside the frame and is taller on a phone.
- **EA:**
  - KaTeX display math overflowed the page on 7 pages (by up to 300px). It
    now scrolls.
  - Wide tables in figures scroll on a phone.
  - 08's twin discs no longer overflow.
  - 08's radius labels moved inside the frame.
  - 09's decoder bits and comparison bars fit.
  - 07's E6 diagram is responsive.
- **Bugs found and fixed:**
  - EA 08 had two stray unclosed selectors (`.stage-track {` and
    `.spinor-ctl .progress {`). They silently disabled every CSS rule after
    them: the toggle chips, scrubber and stage track rendered as unstyled
    serif text, and the spinor progress fill never showed.
  - EA 09 used `&sup4;`, which is not an HTML entity, so the reader saw
    "π&sup4;/384" in the Fig 5 caption and in the prose. It is now ⁴.
  - EA 09 Fig 12 had a prose paragraph inside the figure box. I moved it out,
    unchanged.

## Randomness

- **Seeded:**
  - the first foam 01 froth (mulberry32);
  - GD 04's default Markov walk;
  - EA 09's first codeword.
- **Left random on purpose:**
  - foam "New froth";
  - GD "Walk 100 Steps";
  - EA 06's Moufang verifier trials;
  - EA 09's "Generate vector" and "New codeword".
  They are explicit sampling actions.
- qc 04 was already seeded. The d3-force layouts use d3's own seeded LCG.

## Not fixed / needs a human

- The site notice from `docs/lib/motion.js` (shared, outside my scope) uses
  inline light colors, so it is a light box on every dark page.
- The EA access shim covers pointer-driven elements generically, so in EA 02,
  03 and 08 dense figures get many tab stops (up to 240). EA 04 Fig 1 (the
  build-a-diagram canvas) is still mouse-only; its preset buttons are the
  keyboard route.
- Some figures still read as dashboards, but I only removed the clearest case
  (the EA 07 E6 facts card):
  - the EA 07 F4 facts card: its numbers aren't all in the prose;
  - the EA 03 Fig 1 green "Allowed" verdict box and the EA 05 Fig 4
    "Isomorphic" box;
  - EA 09 Fig 5's five colored step boxes;
  - EA 09 Fig 13's property bars.
  EA 09 has 14 figures, and several are plain tables (Figs 1, 3, 10, 14) or
  a timeline (Fig 7). It is a candidate for a deeper cut.
- Possible merges I left in place because the data differs:
  - EA 02 Figs 2 and 3: E8 parallel coordinates, a fixed/moved split versus
    orbit growth;
  - EA 05 Figs 3 and 4: quiver construction versus the Dynkin isomorphism
    check.
- Captions in qc 02 Fig 2, 03 Fig 3 and 04 Fig 3 still say "Left/Right",
  while those panels stack on a phone. This was already the case before my
  pass.
- GD 03's SONG_TYPES hand classification still colors Figs 1 and 2 (known
  open item). A few force-graph labels still touch at 390px, and the "1965"
  tick in GD 02's monthly strip is clipped at the left edge.
