# moonshine

**A skill for distilling interactive technical explanations from AI generated complexity.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

AI tools generate complexity faster than people can consume it. Inspired by [Distill.pub](https://distill.pub), moonshine helps apply distillation to the flood of technical output, turning complex ideas into explorable, visual, interactive articles.

Each explanation is a self-contained HTML file with vanilla JS and D3 v7. Open the file in a browser and it works.

```
> /shine how gradient descent finds minima
What is the key insight you want the reader to walk away with?
```

## Install

**Claude Code (marketplace):**
```shell
# Add the marketplace and install
/plugin marketplace add enjalot/moonshine
/plugin install moonshine@moonshine-marketplace
```

**Manual install:**
```bash
git clone --depth 1 https://github.com/enjalot/moonshine.git /tmp/moonshine
cp -r /tmp/moonshine/plugins/moonshine ~/.claude/skills/moonshine
rm -rf /tmp/moonshine
```

## Usage

Run `/shine` to start a new explanation. Moonshine will ask you questions about the concept, audience, and key insight before writing any code.

```
/shine                              # start from scratch
/shine fourier transforms           # start with a topic
```

## What It Does

The `/shine` command guides you through:

1. **Story discovery** Clarify the concept, audience, key insight, and progression of understanding
2. **Interaction design** Decide where static prose, interactive explorations, linked views, and scroll-driven narrative serve the explanation best
3. **Project scaffolding** Generate a self-contained HTML file with D3 visualizations and moonshine typography
4. **Iterative building** Build the most important figure first, then the rest, with prose written alongside
5. **Verification** Check every claim against a derivation, a computation, or a source (the ledger), and test each figure at phone width, in dark mode, from the keyboard, and with reduced motion

Moonshine includes a built-in D3 visualization reference (`VISUALS.md`) covering chart types (line, bar, scatter, network, hierarchy, heatmap, distributions), interaction patterns (brushing, scroll-driven narrative, linked views), and the editorial style foundation. No external dependencies needed.

## Project Structure

```
plugins/
└── moonshine/
    ├── SKILL.md          workflow, the claims ledger, editorial and design rules
    ├── ARTICLE.md        HTML scaffold, shared helpers, layout, series structure
    ├── VISUALS.md        D3 visualization patterns and recipes
    └── commands/
        └── shine.md      /shine command definition
```

## Output

Each explanation lives in `~/.agent/moonshine/project-name/`:

```
~/.agent/moonshine/project-name/
  index.html          # Self-contained explanation
  LEDGER.md           # Each claim and how it was checked
  data/               # Real datasets, as fetched from their source
```

## Inspirations

- [Distill.pub, "Research Debt"](https://distill.pub/2017/research-debt/) — Why distillation matters
- [Mike Bostock](https://bost.ocks.org/mike/) — D3.js and interactive articles
- [Bret Victor](http://worrydream.com/ExplorableExplanations/) — Explorable explanations
- [Nicky Case](https://ncase.me/) — Playful interactive explanations
- [Bartosz Ciechanowski](https://ciechanow.ski/) — Long-form interactive explanations
- [The Pudding](https://pudding.cool/) — Data-driven visual essays

## License

MIT
