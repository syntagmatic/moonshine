# moonshine

Agent skill + gallery for interactive technical explanations inspired by Distill.pub.
Two halves: the `/shine` skill (a Claude Code plugin) that authors explanations, and
`docs/`, a static site of finished essay series built with that skill. No build step,
no dependencies; `package.json` is plugin-marketplace metadata only.

## Layout

- `plugins/moonshine/` — the skill itself
  - `SKILL.md` — workflow (story discovery → outline → build one section → complete),
    editorial tone, anti-slop rules, design principles, pedagogy
  - `ARTICLE.md` — HTML scaffold, CSS foundation, layout patterns, series structure
  - `VISUALS.md` — D3 patterns, interaction, live KaTeX formulas, data, accessibility
  - `commands/shine.md` — the `/shine` command definition
- `docs/` — the published gallery (one directory per series, e.g. `autoresearch/`,
  `emergence/`, `modular-forms/`). Each series has its own `index.html` (an article
  with intro prose + cards) plus numbered articles (`01-the-loop.html`, ...).
  `docs/index.html` is the homepage; `docs/lib/motion.js` is the shared
  site chrome: the motion and light/dark toggles (top right), the
  reduced-motion callout, and the machine-generated notice.
- `plans/` — one `<series>/PROMPT.md` per live series: a prompt that could
  regenerate the series as it stands, kept in sync with its pages (see
  `plans/README.md`). Ledgers sit beside them as `LEDGER.md`
- `tests/` — in-browser unit tests for some series' math libraries
  (`tests/<series>.html`); kept out of `docs/` so they aren't published
- `temp/` — scratch research

## Commands

- Vendor assets: `./scripts/vendor.sh` — run once before serving. Fetches KaTeX,
  D3, fonts and topology data into `docs/vendor/` (gitignored)
- Serve: `python3 -m http.server 8000 -d docs` (or any static server); pages also
  work opened directly as files. Directory URLs need a trailing slash, or the
  relative `../vendor/` paths resolve one level too high. `docs/serve.json` (serve reads it from the served dir) makes
  `serve` redirect to add it (and keeps `.html` URLs intact). The root `serve.json`
  does the same for `serve` run from the repo root (pages under `/docs/...`); keep
  the two in sync.
- Tests: serve the repo root (`python3 -m http.server 8000`) and open
  `tests/<series>.html`; each page reports its pass/fail count. No build or lint

## Vendored assets

Pages load KaTeX, D3, fonts and topology data from `docs/vendor/` by relative
path — never from a CDN. This lets them render inside a network-restricted
sandbox and keeps them working offline.

- `docs/vendor/` is gitignored; `scripts/vendor.sh` refetches it, and the Pages
  workflow runs the same script before deploying
- Font sets live in `scripts/font-sets.txt`, the single source of truth shared
  by the vendor script and any page rewriter. Add a set there rather than
  pointing a page back at `fonts.googleapis.com`
- New pages should reference `vendor/...` paths. A CDN URL in a page will work
  on your machine and silently fail in a sandboxed container

## Authoring and registering an essay

1. Articles are self-contained HTML: vanilla JS + D3 v7 from `vendor/js/`, fonts
   Source Serif 4 / Source Sans 3 / Source Code Pro from `vendor/fonts/`. The
   plugin scaffold uses CDN URLs (right for plugin users); swap them for
   `vendor/` paths in this repo. Start from the scaffold in
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

- Load KaTeX JS + CSS from `vendor/katex@<version>/`. `katex.render(expr, el)`
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
  The skill's claims ledger goes in `plans/<series>/LEDGER.md`, not next to
  the pages, so it isn't published.
- Repo pages use `docs/lib/motion.js` (`Motion.reduced()`, `Motion.onVisible`)
  where the plugin scaffold has its own `reducedMotion()` / `loop()` helpers.
- Dark mode: every page needs `@media (prefers-color-scheme: dark)` CSS, and JS
  that bakes in colors reads `matchMedia('(prefers-color-scheme: dark)')`. The
  toggle in `motion.js` forces both to the reader's saved choice
  (`localStorage['moonshine-theme']`) and reloads, so don't hand-roll a separate
  `[data-theme]` theme. Load `motion.js` in `<head>`, before any `<style>` or
  `<link>`, so the forced theme applies before first paint.
- Motion is on by default for everyone, even when the OS asks for reduced
  motion, because many figures only work animated; readers turn it off with the
  toggle (`localStorage['moonshine-motion'] = 'reduced'`). `motion.js` forces
  `prefers-reduced-motion` in CSS and matchMedia to match, the same way as the
  theme, so page code keeps using `Motion.reduced()` and the usual media query.
- Respect reduced motion: animations should check `Motion.reduced()` and only run
  when in view (IntersectionObserver).
- Editorial: no em dashes, no KPI cards / metric grids / status badges / colored
  callout boxes, no emoji headers, no grand summaries. Articles, not dashboards —
  see the Anti-Slop section of `plugins/moonshine/SKILL.md` before delivering.
- Linked views: pass a `source` param when emitting state to avoid redraw loops;
  observe a CSS-sized wrapper to avoid ResizeObserver loops.
