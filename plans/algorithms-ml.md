# Algorithms & ML — 12 Moonshine Explainers

Interactive explanations of the algorithms behind machine learning. Each article has four figures you can touch.

## Context

- **Audience:** Readers who can follow a working prototype but want intuition, not formal math. Every article deliberately avoids LaTeX and replaces symbols with prose and interaction.
- **Quality target:** SPH-standard. Footer nav, viewport-aware animations, ResizeObservers on canvas, shared semantic color vocabulary across all 12 articles.
- **Output:** `docs/algorithms-ml/NN-slug.html`, one file per article, no companion data.
- **Index:** `docs/algorithms-ml/index.html` — SPH-style flat card list with static SVG thumbnails and a 5-color pipeline header viz.

## The unifying skeleton

Every algorithm in the series follows the same pipeline:

> *Data goes in, a **model** transforms it, a **prediction** comes out, an error **signal** corrects the model, and a **target** defines what "correct" means.*

The five roles recur everywhere — θ in gradient descent, Q/K/V in attention, splits in trees, centroids in clustering, axes in PCA, kernels in convolution, vectors in word2vec, policies in RL. The color vocabulary below encodes them.

## Color vocabulary spec

Shared across all 12 articles and the index page. Declared in each file's `:root` block.

```css
:root {
  --c-data:       #2563eb;  /* blue    */
  --c-model:      #8b5cf6;  /* violet  */
  --c-prediction: #0891b2;  /* teal    */
  --c-loss:       #ef4444;  /* red     */
  --c-target:     #10b981;  /* emerald */
}

.t-data       { color: var(--c-data);       font-weight: 600; }
.t-model      { color: var(--c-model);      font-weight: 600; }
.t-prediction { color: var(--c-prediction); font-weight: 600; }
.t-loss       { color: var(--c-loss);       font-weight: 600; }
.t-target     { color: var(--c-target);     font-weight: 600; }
```

### Role meanings

| Var | Role | Where it maps in each article |
|---|---|---|
| `--c-data` | Inputs / observations | Samples (GD, kNN, clustering, PCA), tokens (attention), states (Markov, RL), contexts (word2vec), pixels (convolution) |
| `--c-model` | Learned parameters | θ (GD, backprop), Q (attention), transition matrix (Markov), splits (trees), centroids (clustering), principal axes (PCA), kernels (convolution), vectors (embeddings), policy (RL) |
| `--c-prediction` | Model output | ŷ, softmax output, cluster assignment, projected coords, posterior, feature map, Q-value |
| `--c-loss` | Error / correction signal | ∇L (GD, backprop), KL (attention), impurity (trees), reconstruction error (PCA), TD-error (RL) |
| `--c-target` | Ground truth / goal | Labels, prior (Bayes), reward/goal (RL), true distribution (embeddings) |

### Rules for applying the vocabulary

1. **Figures use the vars directly** — stroke/fill in SVG and canvas should reference the CSS vars (via `getComputedStyle` for canvas or `currentColor`/CSS for SVG) so recoloring is a one-line change.
2. **Prose uses the `.t-*` classes** — wrap key nouns (`<span class="t-data">data</span>`) when you want to cross-reference a figure's color in prose. Don't overdo it; aim for the first mention and anywhere the reader might lose the thread.
3. **`--accent` (existing `#2563eb`) is the same hex as `--c-data`** — this is intentional. Data is the default subject of most figures; existing blue strokes keep working without edits.
4. **Per-article local palettes are allowed alongside the shared vocab** — several articles already declare article-specific vars (e.g., `--q-color/--k-color/--v-color` in attention, `--pos-color/--neg-color` in backprop). Keep those; they are the fine-grained layer on top of the shared vocab.
5. **Not every article uses every var.** Markov chains has no "loss" concept; kNN has no "target" in the training sense. Skip what doesn't apply.
6. **Never use the vocabulary for decorative color.** If a bar chart uses rainbow colors purely to distinguish categories, those are not `--c-*` vars. Reserve the vocabulary for semantic role.

## The 12 Explainers

### Optimization & Learning (3)

**01. Gradient Descent** — `01-gradient-descent.html`
Finding the bottom of a bowl you cannot see. Four figures: (1) 2D loss landscape with click-to-add walkers, (2) 1D loss curve with three learning rates running in parallel, (3) SGD / Momentum / Adam racing the same surface, (4) mini-batch gradient estimates converging toward the true gradient.

**04. Backpropagation** — `04-backpropagation.html`
Gradients flowing backward through a neural network. Live forward/backward pass on a 2-3-1 network with draggable inputs, step-by-step weighted-sum construction, and visible blame assignment.

**12. Reinforcement Learning** — `12-reinforcement-learning.html`
Learning from reward, not examples. Grid world with Q-value heatmaps, side-by-side agents at different exploration rates, and a learned policy view (arrow field + value heatmap).

### Neural Networks (3)

**02. The Attention Mechanism** — `02-attention-mechanism.html`
How a transformer decides what to look at. QKV matrices, attention heatmaps, multi-head views. Uses a local `--q-color / --k-color / --v-color` palette layered on top of the shared vocab.

**10. Convolution** — `10-convolution.html`
Sliding a kernel across a signal. Feature maps, stride, pooling, and the hierarchy of abstraction.

**11. Word Embeddings** — `11-word-embeddings.html`
Representing words as vectors where geometry encodes meaning. Semantic scatter, vector arithmetic (`king - man + woman`), similarity explorer, and a training animation.

### Probabilistic Reasoning (2)

**03. Markov Chains** — `03-markov-chains.html`
Stochastic processes with no memory. State machines, transition matrices, convergence to steady state, and absorption (gambler's ruin). Uses local `--sunny / --cloudy / --rainy` palette for the weather example.

**08. Bayes' Theorem** — `08-bayes-theorem.html`
Updating beliefs with evidence. Area models, sequential updates, and prior sensitivity.

### Classical ML (4)

**05. Decision Trees** — `05-decision-trees.html`
Splitting space by asking questions. Interactive splits, overfitting demonstration, and random forests. Uses local `--class-a / --class-b / --split-color` palette for the two-class example.

**06. K-Nearest Neighbors** — `06-k-nearest-neighbors.html`
Classification by neighborhood vote. Expanding neighborhoods, the curse of dimensionality.

**07. Principal Component Analysis** — `07-pca.html`
Finding the directions where data varies most. Draggable projection axes, variance as information.

**09. Clustering** — `09-clustering.html`
Grouping points without labels. K-means animation, dendrograms, and failure modes.

## SPH audit status

All 12 articles were brought to SPH standard on 2026-04-13. Pass-by-pass:

- **Pass 1 — Footer nav:** ✅ 12/12 have prev/next footers linking through the series.
- **Pass 2 — Semantic colors:** ✅ 12/12 have the `--c-*` vars and `.t-*` classes in `:root`.
- **Pass 3 — Color-coded KaTeX:** ⚫ **No-op.** This series deliberately avoids formal math notation. No article uses KaTeX. The `.t-*` classes cover the prose-side equivalent.
- **Pass 4 — Viewport-aware animations:** ✅ IntersectionObserver added to 03 and 12. 01's three rAF loops are bounded self-terminating animations and don't qualify.
- **Pass 5 — ResizeObserver:** ✅ Already present in 11/12 files; 04 has no canvas or fixed-size SVG to observe.
- **Pass 6 — Prose anti-slop:** ✅ Verified clean. Em dashes only in `<title>` tags (legitimate per methodology) and one JS comment.

## Known article-local palettes

These declare their own vars alongside the shared vocab. Don't delete them.

| File | Local vars |
|---|---|
| `02-attention-mechanism.html` | `--q-color`, `--k-color`, `--v-color` |
| `03-markov-chains.html` | `--sunny`, `--cloudy`, `--rainy`, `--amber-light`, `--amber-border` |
| `04-backpropagation.html` | `--pos-color`, `--neg-color`, `--grad-color`, `--pulse-color` |
| `05-decision-trees.html` | `--class-a`, `--class-b`, `--class-a-light`, `--class-b-light`, `--split-color` |
