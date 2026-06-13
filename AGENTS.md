# moonshine

Agent skill + gallery for interactive technical explanations inspired by Distill.pub.
Two halves: the `/shine` skill (a Claude Code plugin) that authors explanations, and
`docs/`, a static site of finished essay series built with that skill. No build step,
no dependencies, no tests; `package.json` is plugin-marketplace metadata only.

## Layout

- `plugins/moonshine/` — the skill itself
  - `SKILL.md` — workflow (story discovery → outline → build one section → complete),
    editorial tone, anti-slop rules, design principles, pedagogy
  - `ARTICLE.md` — HTML scaffold, CSS foundation, layout patterns, series structure
  - `VISUALS.md` / `PROSE-VISUALS.md` — D3 patterns, interaction, live KaTeX formulas
  - `commands/shine.md` — the `/shine` command definition
- `docs/` — the published gallery (one directory per series, e.g. `autoresearch/`,
  `emergence/`, `modular-forms/`). Each series has its own `index.html` (an article
  with intro prose + cards) plus numbered articles (`01-the-loop.html`, ...).
  `docs/index.html` is the homepage; `docs/lib/motion.js` is the shared
  reduced-motion helper (`Motion.reduced()`, opt-in override banner).
- `plans/` — per-series planning docs (markdown files or dirs with briefs/CLAIMS.md)
- `temp/` — scratch research

## Commands

- Serve: `python3 -m http.server 8000 -d docs` (or any static server); pages also
  work opened directly as files
- No build, lint, or test commands exist

## Authoring and registering an essay

1. Articles are self-contained HTML: vanilla JS + D3 v7 from CDN, fonts Source
   Serif 4 / Source Sans 3 / Source Code Pro. Start from the scaffold in
   `plugins/moonshine/ARTICLE.md`.
2. New article in an existing series: add `NN-slug.html` to the series dir, add a
   card to the series `index.html`, link back to the series index in the footer.
3. New series: create `docs/<series>/` with its own index, then register it in
   `docs/index.html` — add an entry to the `series` array (title, `count`, `href`,
   `desc`, `tags`, `thumb` id) under a category, and add a matching
   `createThumb("<thumb-id>", drawFn)` hand-drawn 80px canvas thumbnail further
   down in the same file. "Work in Progress" category renders thumbs grayscale.
4. Keep the `count` field in sync with the actual number of articles.

## Math (KaTeX)

- Load KaTeX JS + CSS from `cdn.jsdelivr.net/npm/katex`. `katex.render(expr, el)`
  for display math, `katex.renderToString(expr)` for inline; pass
  `{ throwOnError: false }`.
- Series use semantic concept colors as `--c-*` CSS custom properties, mirrored in
  equations via `\color{#hex}{}` and in prose via `.t-*` classes; copy the `:root`
  block into every article of the series.
- Reactive formulas: re-render on drag ticks, coalesced in `requestAnimationFrame`
  (one render per frame, small target element).

## Pitfalls

- The skill's docs say output goes to `~/.agent/moonshine/<project>/`; essays in
  this repo live in `docs/<series>/` instead. Follow the repo convention here.
- Respect reduced motion: animations should check `Motion.reduced()` and only run
  when in view (IntersectionObserver).
- Editorial: no em dashes, no KPI cards / metric grids / status badges / colored
  callout boxes, no emoji headers, no grand summaries. Articles, not dashboards —
  see the Anti-Slop section of `plugins/moonshine/SKILL.md` before delivering.
- Linked views: pass a `source` param when emitting state to avoid redraw loops;
  observe a CSS-sized wrapper to avoid ResizeObserver loops.
