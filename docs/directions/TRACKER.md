# 24 Future Directions for D3 Power Tools

Each direction is a moonshine interactive explanation exploring where d3-power-tools could go, especially in ways that support building interactive technical explanations.

## Directions

### Craft & Process
1. **Collaborative Visualization** — Real-time co-authoring of D3 explanations (shared state over WebSocket, OT/CRDT for SVG, cursor presence)
2. **Narrative Grammars** — A declarative language for specifying scroll-driven narratives (stage definitions, transition rules, reversibility constraints)
3. **Explanation Templates** — Reusable explanation archetypes (parameter explorer, compare & contrast, progressive disclosure, annotation-driven)
4. **Version-Controlled Visualization** — Git-like diffing and branching for D3 charts (visual diffs, A/B comparison, rollback)

### Data & Scale
5. **Streaming Visualization** — Real-time data pipelines with D3 (WebSocket ingestion, circular buffers, LTTB on the fly, backpressure)
6. **SQL in the Browser** — DuckDB-WASM as a data backend for D3 (query-driven rendering, cross-filtering via SQL, 10M+ row support)
7. **Observable Plot Bridge** — When to use Observable Plot's concise grammar vs D3's full control, and how to mix them in one explanation
8. **Serverless Rendering** — Generating D3 visualizations server-side (Playwright, JSDOM, headless Canvas) for thumbnails, social cards, PDF export

### Intelligence & Automation
9. **AI-Assisted Annotation** — LLM reads the chart, identifies notable features, and generates annotation callouts automatically
10. **Adaptive Complexity** — Visualizations that adjust their complexity based on viewer behavior (time spent, zoom level, interaction patterns)
11. **Natural Language Queries** — "Show me the outliers" → brush highlights outliers; "Compare A and B" → filters to A and B. LLM as a visualization command interpreter.
12. **Skill Composition Engine** — Automatic skill selection and layering: given a dataset and a question, compose the right combination of skills

### Accessibility & Inclusion
13. **Sonification** — Data as sound: pitch mapping, rhythm encoding, audio sparklines, screen-reader-friendly data exploration via audio
14. **Multilingual Explanations** — D3 visualizations that adapt text, number formatting, reading direction, and cultural conventions for different locales
15. **Tactile Visualization** — SVG-to-tactile export (embossed diagrams, 3D-printable data sculptures, haptic feedback for touch)
16. **Cognitive Accessibility** — Beyond screen readers: visualizations adapted for ADHD, dyslexia, low numeracy, and cognitive fatigue

### Medium & Platform
17. **Portable Components** — D3 visualizations as Web Components (custom elements, shadow DOM, framework-agnostic embedding)
18. **Notebook Integration** — Bridging Jupyter/Observable notebooks and moonshine explanations (explore in notebook, publish as explanation)
19. **Print & Static Export** — Generating publication-quality static figures from interactive D3 (PDF, SVG, high-DPI PNG with all the right type and spacing)
20. **Embeddable Microexplanations** — Tiny self-contained explanations that embed in GitHub READMEs, Notion pages, Slack messages (iframe, web component, screenshot fallback)

### Evaluation & Quality
21. **Perceptual Testing** — Automated Cleveland-McGill accuracy tests for generated charts (how well can viewers decode the encoding?)
22. **Explanation Effectiveness** — Measuring whether an interactive explanation actually teaches (pre/post comprehension, time-to-insight, misconception detection)
23. **Cross-Model Benchmarks** — Generating the same visualization with different LLMs and comparing quality (Claude, Gemini, GPT, open models)
24. **Skill Ecology** — How skills interact, compete, and compose: dependency graphs, conflict detection, emergent behaviors when multiple skills activate

## Progress

| # | Direction | Status | File |
|---|-----------|--------|------|
| 1 | Collaborative Visualization | done | 01-collaborative-visualization.html |
| 2 | Narrative Grammars | done | 02-narrative-grammars.html |
| 3 | Explanation Templates | done | 03-explanation-templates.html |
| 4 | Version-Controlled Visualization | done | 04-version-controlled-visualization.html |
| 5 | Streaming Visualization | done | 05-streaming-visualization.html |
| 6 | SQL in the Browser | done | 06-sql-in-the-browser.html |
| 7 | Observable Plot Bridge | done | 07-observable-plot-bridge.html |
| 8 | Serverless Rendering | done | 08-serverless-rendering.html |
| 9 | AI-Assisted Annotation | done | 09-ai-assisted-annotation.html |
| 10 | Adaptive Complexity | done | 10-adaptive-complexity.html |
| 11 | Natural Language Queries | done | 11-natural-language-queries.html |
| 12 | Skill Composition Engine | done | 12-skill-composition-engine.html |
| 13 | Sonification | done | 13-sonification.html |
| 14 | Multilingual Explanations | done | 14-multilingual-explanations.html |
| 15 | Tactile Visualization | done | 15-tactile-visualization.html |
| 16 | Cognitive Accessibility | done | 16-cognitive-accessibility.html |
| 17 | Portable Components | done | 17-portable-components.html |
| 18 | Notebook Integration | done | 18-notebook-integration.html |
| 19 | Print & Static Export | done | 19-print-and-static-export.html |
| 20 | Embeddable Microexplanations | done | 20-embeddable-microexplanations.html |
| 21 | Perceptual Testing | done | 21-perceptual-testing.html |
| 22 | Explanation Effectiveness | done | 22-explanation-effectiveness.html |
| 23 | Cross-Model Benchmarks | done | 23-cross-model-benchmarks.html |
| 24 | Skill Ecology | done | 24-skill-ecology.html |
