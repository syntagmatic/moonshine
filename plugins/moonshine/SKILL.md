---
name: moonshine
description: Help users create interactive explanations of technical concepts, inspired by Distill.pub
user_invocable: true
---

# Moonshine: Interactive Technical Explanations

Moonshine helps users create interactive, web-based explanations of technical concepts. Inspired by [Distill.pub](https://distill.pub)'s argument that research distillation is valuable creative work, moonshine provides scaffolding to turn complex ideas into explorable, visual, interactive articles.

AI tools generate complexity faster than people can consume it. Moonshine is for bridging that gap: helping people digest and communicate technical concepts clearly.

**Tech stack:** Self-contained HTML, vanilla JS, D3 v7. No build tools, no frameworks.

**Visualization patterns:** See `VISUALS.md` for D3 chart types, interaction recipes, and the moonshine style foundation.

## How to Use This Skill

**Do not skip to code.** The most common failure mode is jumping straight to scaffolding without understanding what the user is trying to explain and who they're explaining it to. Always start with story discovery.

When a user invokes moonshine, guide them through this process:

### 1. Clarify the Explanation (Story Discovery)

Before writing any code, have a conversation with the user. Ask questions and listen. You need to understand:

- **What concept are you explaining?** Get specific. Not "machine learning" but "how gradient descent finds minima."
- **Who is the audience?** What can they already be assumed to know? What's new to them?
- **What is the key insight?** What is the single thing the reader should walk away understanding?
- **What is the progression of understanding?** What does the reader need to learn first, second, third to arrive at the insight? Map the dependency chain of ideas.
- **What misconceptions exist?** What do people commonly get wrong, and how can interaction expose the correct mental model?

Ask these questions one or two at a time. Start with "What are you trying to explain?" and follow the thread. Wait for answers before moving on. If the user gives you all the context upfront, you can move faster, but if they give a brief prompt, slow down and ask. The quality of the explanation depends on how well you understand the concept and audience before you start building.

### 2. Design the Interaction

For each concept in the progression, decide what combination of:

- **Static prose** clear, concise writing with careful information hierarchy
- **Static diagrams** D3-rendered figures that encode data visually
- **Interactive explorations** sliders, hover states, click-to-reveal that let readers test their understanding
- **Linked visualizations** multiple views that update together, showing the same data from different angles
- **Scroll-driven narrative** content that transforms as the reader progresses
- **Animated transitions** smooth interpolation between states to show how things change

Every interaction should serve understanding. If a slider doesn't help the reader build intuition, remove it. Gratuitous interaction is worse than none.

### 3. Scaffold the Project

Create projects in `~/.agent/moonshine/project-name/`. This keeps generated explanations separate from the user's working directory. Create the directory if it doesn't exist.

```
~/.agent/moonshine/project-name/
  index.html          # Self-contained explanation (HTML + CSS + JS)
  data/               # Optional external datasets
```

Each explanation is a single HTML file with inline CSS and JS. D3 loads from CDN. No build tools, no npm install. Open the file in a browser and it works.

After scaffolding, open the result in the browser to verify.

### 4. Build Iteratively

Start with prose and static figures. Add interaction only where it genuinely helps. Test with the question: "Does this interaction help the reader build a mental model they couldn't get from text alone?"

## Editorial Tone

Moonshine articles should have clear and humble prose. We are helping people digest, not force-feeding them. Some guidelines:

- Avoid em dashes. Use commas, periods, or restructure the sentence.
- Don't oversell. Say "this can help" not "this is a game-changer." Say "an appropriate metaphor" not "a precise metaphor."
- State what things do, not how important they are. Let the reader decide the importance.
- Prefer short, direct sentences. If a paragraph feels like it's building to a dramatic reveal, flatten it.
- Use "tries to", "can", "helps" instead of absolute claims.

The writing should feel like a knowledgeable colleague explaining something at a whiteboard, not a keynote presentation.

## Core Design Principles

These principles come from [Distill.pub](https://distill.pub) and the broader tradition of explanatory writing:

### Information Hierarchy

- **Primary:** The key insight and its supporting argument
- **Secondary:** Context, definitions, related concepts
- **Tertiary:** Technical details, proofs, edge cases (often in margin notes or expandable sections)

Use typography, spacing, and visual weight to make this hierarchy clear. The reader should be able to tell what matters most at a glance.

### Visual Encoding

- Position and length are the most accurate visual channels. Use them for the most important data.
- Color should encode categories or highlight, not carry quantitative information alone.
- Redundant encoding (color + position) improves accessibility.
- Consistent visual language across all figures in an article.

### Typography for Technical Content

- Large, readable body text (18-20px)
- Generous line height (1.5-1.6)
- Constrained line length (60-75 characters)
- Clear heading hierarchy
- Monospace for code, math font for equations
- Margin notes over footnotes (keep the reader's eyes near the content)

### Interaction Patterns

| Pattern | Use When | Example |
|---------|----------|---------|
| Details-on-demand | Supplementary info would clutter the main narrative | Hover a data point to see its values |
| Explorable explanation | The concept involves a parameter space the reader should explore | Slider that changes a function's parameters and updates its plot |
| Linked views | The same data has multiple meaningful representations | Scatterplot + histogram that highlight the same subset |
| Scroll-driven narrative | The explanation has a natural sequence of reveals | Chart that builds up as the reader scrolls through the argument |
| Animated transition | Two states are meaningfully different and the path between them matters | Morphing between two chart types to show they represent the same data |

## Template: HTML Scaffold

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Explanation Title</title>
<script src="https://d3js.org/d3.v7.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@400;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --article-width: 740px;
  --body-font: 'Source Serif 4', Georgia, serif;
  --heading-font: 'Source Sans 3', system-ui, sans-serif;
  --mono-font: 'Source Code Pro', monospace;
  --body-size: 1.125rem;
  --line-height: 1.6;
  --text: #1a1a2e;
  --text-2: #4a4a6a;
  --accent: #2563eb;
  --accent-light: #dbeafe;
  --bg: #fafafa;
  --fig-bg: #ffffff;
  --border: #e2e2e8;
}

body {
  font-family: var(--body-font);
  font-size: var(--body-size);
  line-height: var(--line-height);
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

.article { max-width: var(--article-width); margin: 0 auto; padding: 2rem 1.25rem 6rem; }
h1, h2, h3 { font-family: var(--heading-font); font-weight: 700; line-height: 1.2; }
h1 { font-size: 2.5rem; margin: 0 0 0.5rem; }
h2 { font-size: 1.5rem; margin: 3rem 0 1rem; }
h3 { font-size: 1.15rem; margin: 2rem 0 0.75rem; }
p { margin: 0 0 1rem; }

.figure { margin: 2rem 0; padding: 1.5rem; background: var(--fig-bg); border: 1px solid var(--border); border-radius: 6px; }
.figure-caption { font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2); margin-top: 0.75rem; }
.figure-label { font-weight: 600; color: var(--text); }

.insight { background: var(--accent-light); border-left: 3px solid var(--accent); padding: 1rem 1.25rem; margin: 1.5rem 0; border-radius: 0 4px 4px 0; }
.insight p { margin: 0; }

.margin-note { font-size: 0.8125rem; color: var(--text-2); line-height: 1.4; border-left: 2px solid var(--border); padding-left: 0.75rem; margin: 1rem 0; }

.controls { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; font-family: var(--heading-font); font-size: 0.85rem; color: var(--text-2); }

svg text { font-family: var(--heading-font); }
svg .axis text { font-size: 11px; fill: var(--text-2); }
svg .axis line, svg .axis path { stroke: var(--border); }
</style>
</head>
<body>
<div class="article">
  <header>
    <h1>Title</h1>
    <p style="font-family: var(--heading-font); font-size: 1.15rem; color: var(--text-2);">
      A clear one-sentence description of what the reader will understand.
    </p>
  </header>

  <!-- Sections go here -->

</div>

<script>
// State coordination pattern (replaces React Context)
const state = {};
const dispatch = d3.dispatch('update', 'select', 'hover');

// Visualization code goes here
</script>
</body>
</html>
```

## D3 Integration

Use `VISUALS.md` for visualization patterns. Key principles:

- D3 owns the DOM. No framework abstraction layer.
- Use `d3.dispatch` for cross-chart communication (see State Coordination in VISUALS.md).
- Use `.join()` for data binding with enter/update/exit.
- Use `selection.call()` to compose reusable chart functions.
- Load D3 from CDN: `https://d3js.org/d3.v7.min.js`

For any chart type (line, bar, scatter, network, hierarchy, heatmap, etc.), consult VISUALS.md for the pattern, judgment call, and common pitfall.

## Reference Skills

- **grill-me** Approach to guided question-asking to help users clarify their thinking.
