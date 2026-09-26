# Algorithms & ML audit

Audited 2026-09-25. Scope: the six essays, series index, mathematical models, controls, responsive rendering, accessibility, and Moonshine conventions. This is a findings report; the essays have not been changed.

## Findings

### 1. P1: Deep-network figure does not differentiate its stated loss

`docs/algorithms-ml/02-backpropagation.html:1235`

`wOut.map(w => w * (y - gauss()))` samples a new target for every component of the backward signal. For the stated scalar loss `(y - target)^2 / 2`, every component must share the same residual: `wOut[j] * (y - target)`. The current vector is generally not the derivative of that loss, invalidating the figure's quantitative gradient measurements.

Sample one target per example and check the gradients against finite differences. Also resolve the measurement definition at line 1240: the code computes RMS over individual-example gradients, not RMS of the gradient of the batch-mean loss. Either label that statistic explicitly or accumulate the batch gradient before taking its RMS. Recheck the weight-scale claims after these corrections.

### 2. P1: Scree plot substitutes generating parameters for computed PCA

`docs/algorithms-ml/04-pca.html:1209`, `:1247`, `:1277`

Figure 4 generates a finite random sample, then calls its generating basis the sample's principal components and plots the preset `trueEigenvalues`. It never diagonalizes the sample covariance. For this seed, the variances along the generating axes start at 5.53636 and 3.20062, rather than the plotted 5 and 3; the covariance between those coordinates is 0.11927, so they are not even uncorrelated sample principal components.

Compute the eigendecomposition from `centered8`, then derive the bars, cumulative share, projection, and reconstruction error from it. This violates the series' explicit promise that each figure runs its algorithm.

### 3. P1: A single coin flip produces a zero-width “95% confidence interval”

`docs/algorithms-ml/05-bayes-theorem.html:1044`

Figure 4 applies the Wald normal approximation at every sample size. After one head, the browser displayed `95% CI: [1.000, 1.000]`; one tail produces `[0, 0]`. At the default true bias 0.6, neither possible first-flip interval contains the truth. This teaches false certainty precisely where the comparison is supposed to illustrate uncertainty.

Use a Wilson or exact binomial interval, name the method, and state the repeated-sampling interpretation in terms of the fraction of *intervals* covering the fixed true parameter. [NIST provides both methods and discusses the small-sample limitation.](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm)

### 4. P2: Regression's “true minimum” is not the minimum of its plotted loss

`docs/algorithms-ml/01-gradient-descent.html:1517`, `:1598`

The marker and distance readout use the generating parameters `(0.7, 1.2)`. The noisy finite sample's least-squares optimum is approximately `(0.654611, 1.191189)`. Evaluating the actual loss gradient at the marker gives `(0.484203, 0.009952)`, rather than zero. Even a fully converged optimizer would retain a reported distance of about 0.04624.

Compute the sample optimum for the marker and distance. If the generating parameters are retained for comparison, label them separately.

### 5. P2: Beta posteriors disappear and report zero mass after enough flips

`docs/algorithms-ml/05-bayes-theorem.html:374`, `:394`

The raw product `x^(a-1) * (1-x)^(b-1)` underflows before the later normalization. Reproduced with the page's own functions: `betaPDF(.5, 601, 601) === 0` and `betaIntervalMass(601, 601, .45, .55) === 0`. These parameters correspond to 600 heads and 600 tails, reachable in 24 uses of “Flip 50.” The posterior should be concentrated near 0.5, but the plot collapses and the central interval gets zero probability.

Evaluate densities in log space and rescale before integration, or use a stable beta CDF. Handle endpoint limits separately: the current function also forces every beta density to zero at both endpoints, including the uniform prior and one-sided observations.

### 6. P2: Changing true bias silently retains observations from the old coin

`docs/algorithms-ml/05-bayes-theorem.html:995`

Generate observations and move the true-bias slider. Existing counts and estimates remain, while the reference marker and readout immediately claim the new bias is “True.” Subsequent flips mix different generating biases while inference assumes one fixed Bernoulli parameter. Browser reproduction confirmed this behavior.

Reset observations when bias changes, or explicitly redesign this as an example of a changing data-generating process.

### 7. P2: PCA projection geometry and drag coordinates use incompatible scales

`docs/algorithms-ml/04-pca.html:491`, `:498`, `:640`

The x and y domains are both `[-6, 6]`, but their pixel scales differ. At a 390px viewport, the 324px figure leaves only 54px for scatterplot width versus 250px height. The cloud is severely stretched, and the displayed projection connectors are not visually perpendicular to the displayed axis. The drag handler then uses pixel `atan2(my, mx)` as a data-space angle without undoing that stretch, so a tiny drag can move the handle far from the pointer.

Browser reproduction: moving the pointer 1px horizontally moved the handle approximately 14.6px left and 37.1px up. Use equal spatial scales and convert pointer coordinates through those scales. Stack the histogram below the scatterplot on phones. This is a geometric teaching error as well as a layout problem.

### 8. P2: “4D” through “8D isometric” views discard the added dimensions

`docs/algorithms-ml/04-pca.html:1434`, `:1463`

For every `k >= 3`, the display reads only `pt[0]`, `pt[1]`, and `pt[2]`. Moving the slider from 3 to 8 leaves every point position unchanged, while the label claims an increasingly dimensional view. Readers cannot see the effect of keeping those components.

Label this as a fixed view of the first three coordinates and add a computed reconstruction-error readout, or choose a visual encoding that actually includes the retained dimensions.

### 9. P2: RL intercepts arrow keys intended for its sliders

`docs/algorithms-ml/06-reinforcement-learning.html:581`

The document-level keydown handler prevents the default action for every arrow key, regardless of focus. With Agent A's epsilon slider focused, pressing Right left its value at 0.10 and incremented Figure 1's step count instead. This blocks keyboard operation of the speed and epsilon sliders and moves an unrelated agent.

Scope grid navigation to a focused grid or its controls, and leave native input key handling intact.

### 10. P2: RL ignores reduced motion during learning

`docs/algorithms-ml/06-reinforcement-learning.html:403`, `:733`, `:980`

The page reads `Motion.reduced()` but never uses the result. With reduced motion emulated, “Start both” still advanced from episode 26 to 50 in about 200ms, continuously redrawing the grids and reward chart. Figure 2 also runs its animation loop normally.

Provide bounded training with a static result or explicit step controls under reduced motion. Retain the existing offscreen stopping behavior.

### 11. P2: Attention lookup boxes are clipped on phones

`docs/algorithms-ml/03-attention-mechanism.html:686`, `:779`

Value boxes end at `0.75 * W + 98`, beyond the SVG's right edge whenever `W < 392`. At the tested 390px viewport the SVG is 324px wide, so its boxes extend to x=341 and are visibly cropped. Page-level overflow checks pass because the SVG clips its contents.

Use a narrow-layout arrangement or size the columns and boxes from the available width. Check internal SVG bounds as well as document scroll width.

### 12. P2: Lookup scores are available only through pointer hover

`docs/algorithms-ml/03-attention-mechanism.html:792`

Figure 1 invites readers to inspect letter-pair scores, but its key groups have only pointer enter/move/leave handlers. They are not focusable and have no keyboard or explicit tap equivalent. Later attention figures already provide better keyboard patterns.

Make each key focusable and expose the same information on focus and tap, or print the scores directly.

### 13. P3: Adam's second moment is incorrectly called variance

`docs/algorithms-ml/01-gradient-descent.html:413`

The prose calls the second moment “variance.” The implementation correctly averages squared gradients, which estimates the second raw moment; variance subtracts the squared mean. Replace the parenthetical with “mean squared gradient.” [The original Adam paper specifies the second raw moment in Algorithm 1 and Section 2.](https://arxiv.org/pdf/1412.6980)

## Editorial and verification debt

- The claims ledger now exists as `plans/algorithms-ml/LEDGER.md` (second pass, below).
- Simulated regression and PCA data are identified in code but not clearly in figure captions. Add visible simulation labels.
- The Bayes prose's “73%” interval example at line 324 has no stated data or prior and is not tied to a computed state. Label it illustrative or derive it from a specified example.
- RL Figure 2 promises episode lengths approaching 12 despite fixed epsilon 0.15. Distinguish convergence of the greedy route from episode lengths under continued exploration, as Figure 3 already does.
- RL says every step costs -1, but `getReward` replaces that cost with +10 or -10 on terminal steps. State that convention explicitly. Its 12-step safe route earns -1 under the implementation, versus -2 if a step cost were also charged on entering the goal.
- SVG labels below the required 11px appear in five essays. In particular, the XOR epoch label is 8px and RL grid labels are 9px. Phone captions also retain “left/center/right” where the panels stack.
- The series-index breadcrumb links to Parallel Coordinates rather than identifying the current series (`index.html:157`).
- The index calls a Bayesian prior a “target” or ground truth. A prior is an assumption about uncertainty, not a label defining a correct answer. Qualify this analogy rather than forcing every essay into the supervised-learning vocabulary.

## Checks and limits

- All seven pages loaded in Chromium at 1200px/light, 390px/light, and 390px/dark with reduced motion enabled. No uncaught JavaScript errors or document-level horizontal overflow were observed in those runs. This does not imply that all internal SVG geometry fits, as finding 11 demonstrates.
- Exercised range-control minimum and maximum values; checked representative keyboard behavior, training, and figure controls. Inspected phone screenshots of the PCA and attention figures. This was not a complete screen-reader or contrast audit.
- Local HTML `href` and `src` targets resolve. Vendor paths are local, and the homepage count correctly lists six essays.
- Executed extracted model code in Node. The default XOR run classifies all four inputs correctly; the browser reports loss 0.0025 after 200 epochs. The attention model really trains, gets 100% on both tasks in its seeded 300-sentence evaluation, and reproduces the described default head assignments, including the first-token exception. This is a fresh generated evaluation sample, not proof that every evaluated sentence was excluded from training.
- The RL policy figure's default 200-episode run reaches the goal in 12 steps. The 3D PCA figure computes a covariance decomposition and squared reconstruction error; the preset-spectrum issue is in Figure 4.
- The report prioritizes reproducible model and interaction faults. It does not certify every historical attribution or every claim across all slider settings and random seeds.

## Second pass: ledger, captions, anti-slop

Run 2026-09-25, one auditor per essay (03 also took the index), covering the three
Phase 5 checks the first pass left out: the claims ledger (`LEDGER.md`), captions
against each figure's default state, and a line-by-line anti-slop pass. Each auditor
also re-ran the first-pass findings for its page. Every first-pass finding reproduced.
Nothing under `docs/` was changed.

### Most important new findings

1. P1, 01 Figure 2: the "too large" rate (0.95) lands on the same minimum as "just right" in the same 17 steps, and no value on the large slider (up to 2.0) diverges; 2.0 oscillates and stays bounded. The figure cannot show the overshoot the prose promises. Rechecked independently in node.
2. P2, 01 Figures 3 and 4: at the defaults SGD does not zigzag (momentum is the path that swings), Adam hides under SGD's endpoint and leaves the plot, and the mini-batch walker never reaches the minimum in 50 steps (distance 0.51 at batch 1, 0.47 at 64). Full-batch descent is labelled "SGD".
3. P2, 03 `:404`: the Clark et al. 2019 head examples are reversed (the paper has direct objects attending to their verbs, determiners to their nouns).
4. P2, 05 `:351`: the confidence-interval gloss puts the 95% on a fixed range. PROMPT.md singles out this exact error.
5. P2, 04 Figure 2: the same unequal-scale bug as first-pass finding 7. The "perpendicular" PC2 is drawn 104 degrees from PC1 at 1200px.
6. P2, 06 `:364`: "value drops sharply near pits" is false for the max-Q heatmap shown.
7. P2, 02 `:343`: ReLU gradients stay flat at every weight scale, not only at sqrt 2.
8. P2, 03 and index `:167`: 03 does not use the five role colors, so the index's claim that every figure and equation does is false.

Corrections that size first-pass fixes: once finding 1 is corrected, sigmoid at scale 1 shrinks by x4.26 per layer instead of x3.84, and the prose still holds. Finding 2's correct sample eigenvalues are 5.5521, 3.2251, 0.7765, 0.4110, 0.2751, 0.1360, 0.0923, 0.0556, which move the displayed percentages by at most one point. For finding 4, the gap from not converging (0.47) is ten times the 0.046 offset, so that fix matters less than 01 Figure 4's convergence.

### Per-essay new findings and recheck

#### 01 Gradient descent

**New findings**

- P1 `docs/algorithms-ml/01-gradient-descent.html:363-392`, `:834`, `:359-361` : Figure 2's "Too large" default (0.95) converges, and faster than "Just right" (7 vs 14 steps to within 0.01); no slider value (max 2.0) ever diverges, so "flying off entirely" cannot be shown. The figure's central lesson is contradicted at rest: all three dots end on the same point. Fix: set the large default above the stability bound (about 1.1 at x=1.154; e.g. 1.6 bounces, and raise the slider max past 2 so divergence is reachable) and keep the small default low enough to visibly lag; re-derive panel labels from the run.
- P2 `:1073-1076`, `:1227-1229`, `:404-413` : Figure 3 contradicts its prose at the default start. SGD does not zigzag (one overshoot, then a slow crawl), momentum is the path that oscillates wildly rather than "oscillations cancel", and Adam stalls at the same point as SGD (both near (1.80, 3.25)), hiding the red path under the green one. Adam's path also exits the plot through the top edge. Fix: tune SGD's rate so it zigzags, reword momentum as overshoot-then-settle, pick a start or Adam rate where the three are distinguishable, clip paths to the plot, and mark the minimum (1,1).
- P2 `:479-480`, `:1428`, `:1517` : Figure 4 never reaches the minimum at any batch size in 50 steps (about 0.47 away at batch 64, 0.51 at batch 1 on average), and the batch-64 path is an L-shaped curve, not "almost straight". The distance readout barely changes with batch size, so it does not support the story. Fix: more steps or larger lr (slow eigenvalue 2.0, so lr near 0.08 is still stable), or rescale x to condition the problem; then reword the caption from the run.
- P2 `:405`, `:426`, `:1227` : Fig 3 labels deterministic full-batch gradient descent "SGD", then `:450` says everything above used the whole dataset. Rename to gradient descent (GD) in legend, button and prose.
- P3 `:485` : flat-minima generalization stated as fact; it is contested (Keskar 2017 vs Dinh 2017). Attribute and hedge.
- P3 `:363-392` : Fig 2 curve has two minima and all defaults land in the shallower one while prose says "the minimum". Mention the local minimum or reshape the curve to one basin.
- P3 `:479`, `:524` : the regression model y-hat = w x + b is never stated to the reader.
- P3 `:437` : Figure 3 caption gives nothing to notice.
- P3 `:350-352`, section headings : filler restatement and colon-template headings.
- P3 Figs 2, 3, 4 : role colors used for non-role meanings (parameters in loss red, loss contours in data blue, optimizers in loss red and target green).
- P3 `:444` : "practitioners usually pick an optimizer by experiment" unsupported generalization; soften.

**Prior findings recheck**

- Finding 4 (true minimum is generating params, not the sample optimum): confirmed. OLS (0.654611, 1.191189), gradient at marker (0.484203, 0.009952), residual distance 0.04624. Secondary in practice: the walker is about 0.47 away because it has not converged (new P2).
- Finding 13 (Adam second moment called variance): confirmed. The paper itself says "2nd raw moment (the uncentered variance)", so "uncentered variance" or "mean squared gradient" both fix it.
- Editorial debt, simulated regression data unlabeled in caption: confirmed for Fig 4.
- Editorial debt, SVG labels under 11px / phone "left/right" captions: not rechecked for 01 (out of scope); Fig 2 panel labels are HTML spans, and lr labels are 0.72rem (about 11.5px), so no sub-11px text found in 01 at 1200px.
- Checks-and-limits, no console errors: confirmed (render-check PASS, no pageerror in light or dark/reduced-motion runs).

#### 02 Backpropagation

**New findings**

- N1. P2. `02-backpropagation.html:343`. The ReLU sentence ties flat gradients to the He scale sqrt(2), but the figure shows an equally flat ReLU profile at every weight scale from 0.5 to 8 (bias-free ReLU nets are homogeneous, so the ratio is scale-free). A reader who tries scale 0.5 or 8 sees the prose contradicted. Fix: say the profile stays flat at any scale here, and that He scaling is what keeps the overall gradient size near 0.1 instead of 1e-5 (scale 0.5) or 1e12 (scale 8); optionally print the absolute first-layer RMS in the readout.
- N2. P2. `02-backpropagation.html:817` vs KaTeX `1159`. Figure 2 prints "dL/dy = -0.657" and labels the output node "y" (`462`), while the loss equation uses a for the prediction and y for the target. Under the page's own equation, dL/dy is +0.657. Fix: label the output node a (or y-hat) and print dL/da, or change the equation's target symbol.
- N3. P3. `02-backpropagation.html:842`. Hidden-node "grad" labels show dL/dz (after multiplying by the sigmoid slope), not dL/dh, and the figure does not say which. Fix: label "dL/dz".
- N4. P3. `02-backpropagation.html:343`. "Near scale 8 ... the gradient stops shrinking" holds only for the default seed at depth 10 (x1.06/layer). Across 30 seeds the median is x1.21 (0.96-1.50); at depth 20 the first/last ratio is still 20-70. Fix: "shrinks about 1.2x per layer instead of 4x".
- N5. P3. `02-backpropagation.html:870`. Legend says larger gradient magnitude means "more responsibility for the error"; it means more sensitivity. Reword.
- N6. P3. Role colors: Figure 4 draws the sigmoid line in --c-data and ReLU in --c-prediction (`1283`), which are the series' data and prediction roles; Figure 3's loss curve uses --neg-color (`982`) rather than --c-loss. Use neutral or activation-specific colors for Figure 4, and --c-loss for the loss curve.
- N7. P3. `02-backpropagation.html:264`. Figure 1 caption describes edge colors and node shading that do not appear until step 2/3; at load all edges are gray. Add "from step 2 on" or show colors at step 1.
- N8. P3. Visible "--" placeholders in Figure 2 readouts (`289`, `290`) and Figure 3 info (`318`) read as double hyphens. Use an en space or "n/a"-free blank, or hide the readout until values exist.

**Prior findings recheck**

- AUDIT finding 1 (P1, fresh target per component at `1235`): REPRODUCED. Finite differences on a depth-4 sigmoid net: original backward signal errs by 3.5e-2 against gradients of max size 3.4e-2; with one target per example the error is 8.8e-11. The RMS-over-examples point at `1244` is also confirmed. Corrected numbers (seed 7, same RNG stream, drawing 16 normals and using the first as target):
  - Sigmoid, depth 10: scale 1 x3.84 -> x4.26 (batch-gradient RMS x4.33); scale 2 x2.31 -> x2.60; scale 4 x1.56 -> x1.60; scale 8 x1.06 -> x1.14 (batch x1.07).
  - Sigmoid, depth 20: scale 1 ratio 3.8e11 -> 4.2e12; scale 8 ratio 51 -> 21 (batch 72).
  - ReLU, depth 10: x1.04 -> x1.18 at scales 0.5 to 1.41; x1.12 at 4 and 8 (unchanged). Depth 20: x1.03 -> x1.02.
  - Seed sweep (30 seeds, depth 10) barely moves: sigmoid scale 1 median x4.06 -> x4.24; scale 8 x1.21 -> x1.22; ReLU x0.99-1.02 either way.
  - Prose after correction: the "factor of four", "several orders of magnitude", "average slope drops" and "most units near 0 or 1" claims still hold. "Stops shrinking near scale 8" is overstated before and after the fix (N4). The ReLU sqrt(2) sentence is misleading before and after (N1). The P1 stands on correctness, but the qualitative story survives it.
- SVG labels below 11px (editorial debt): CONFIRMED for this essay. At 390px: Figure 1 has 15 labels at 10px, Figure 2 has 6 at 10px, Figure 3 has 15 at 10px plus the 8px "Epoch" label (`975`), Figure 4 has 17 tick labels at 10px.
- Phone captions keep "Left/Center/Right" (editorial debt): CONFIRMED for Figure 3 (`321`); at 390px the panels stack at y = 4742, 4907, 5091.
- Default XOR result (AUDIT checks): REPRODUCED, loss 0.0025 at epoch 200, all four inputs classified correctly.
- No document-level horizontal overflow at 390px (scrollWidth 390) and no console errors: REPRODUCED.

#### 03 Attention and the series index

**New findings**

- N1. P2. `03-attention-mechanism.html:31-32, 323, 447-456, 866-868` and `index.html:167-171, 215`. Article 03 drops the series role palette, contradicting the index's "Figures and equations across the series use these five colors". Its prose and figures color keys red (#dc2626, near loss #ef4444) and values green (#16a34a, near target #10b981). Its equation colors K blue and V cyan, so the same symbol has different colors in the equation and in the figure. It renders W_Q/W_K/W_V (model, per the index) without the model purple, and the `cm` color is declared and never used. Fix: decide on one mapping. Either use the role colors for W (model), X (data) and the output (prediction), and keep Q/K/V in one neutral set that avoids the loss red and target green, or add a sentence on the index saying 03 uses its own Q/K/V colors. Make the equation match the figures either way.
- N2. P2. `03-attention-mechanism.html:404`. The Clark et al. 2019 syntax heads are described in the wrong direction. The paper says dependents attend to their heads: direct objects attend to their verbs (head 8-10) and determiners attend to their nouns. Fix the wording as in the ledger.
- N3. P3. `03-attention-mechanism.html:344, 374` with Figure 3 default. The √d_k rationale gives only "peaked rows" and leaves out Vaswani's actual reason (small softmax gradients, stated as a suspicion). The figure also shows trained rows at 93 to 99% right after the text says scaling prevents near-one-hot rows. Fix: cite Vaswani et al. 2017, give the variance-d_k argument and the gradient reason, and add that scaling sets the starting spread, while training can still sharpen rows when that helps the loss.
- N4. P3. `03-attention-mechanism.html:396, 1257` and `accuracy()` at `601-615`. "300 fresh sentences" is not a held-out test: 74 to 80% of them occur word for word in the training stream (5,184-sentence grammar, about 3,100 unique training sentences), on all 12 seeds checked. Fix: exclude sentences seen in training (keep a Set of training strings) and say "sentences it never saw", or state the overlap. Accuracy stays at 100% either way.
- N5. P3. `03-attention-mechanism.html:1265` (`nextSeed = 2`). The first Retrain (seed 2) reproduces seed 1's head split exactly, so a reader who clicks once sees no change and may conclude the split is robust. The prose says the opposite. Fix: start from a seed that differs visibly (3 swaps roles, 4 is mixed), or mention that it can take a few clicks.
- N6. P3. `03-attention-mechanism.html:338, 388`. Two wording fixes: "scaled by √6" should be "divided by √6", and "one shared readout" should be "both readouts" (there are two linear maps, U[0] and U[1]).
- N7. P3. `03-attention-mechanism.html:302`. The historical claim about the fixed-size-vector bottleneck has no citation. Bahdanau et al. 2014 support it (as a conjecture, with Cho et al. 2014's length-degradation result). Add the link, and say that attention first came as an addition to those sequence models.
- N8. P3. `index.html:179`. "PCA applied to gene expression data": the bioinformatics page uses synthetic expression data. Reword to "simulated expression data".

**Prior findings recheck**

- AUDIT 11 (lookup value boxes clipped at 390px): Reproduced. At a 390px viewport the SVG is 324px wide, and the value rects extend to x=341.
- AUDIT 12 (lookup scores hover-only): Reproduced. The Figure 1 SVG has 0 elements with tabindex, and the key groups have only pointer handlers.
- Debt, SVG labels under 11px: Reproduced for 03. There are 10px labels in Figures 1, 3 and 4 ("keys →", "queries", Figure 4 axis words and the Figure 1 weight labels), and 9px cell values in Figure 3 at 390px.
- Debt, index breadcrumb links to Parallel Coordinates (`index.html:157`): Reproduced. It is visible in the screenshot ("Moonshine / Parallel Coordinates").
- Debt, index calls the Bayesian prior a "target" (`index.html:245`): Reproduced (see the ledger).
- Checks note, attention model really trains, 100% on both tasks, default head assignments including the first-token exception: Reproduced in node and browser. I also confirmed the gradients by finite differences. I extended it to 12 seeds, where accuracy is always 100% and head roles depend on the seed (2 default, 2 or 3 swapped, 7 mixed). The audit's caveat that the evaluation sentences are not held out is now quantified (N4).
- Debt, no LEDGER.md: still true. This file covers 03 and the index only.

#### 04 PCA

**New findings**

- P2 `docs/algorithms-ml/04-pca.html:706`, `:711-715` (Fig 2): x and y use the same [-7, 7] domain over plotW = width - 260 and plotH = height - 50, so PC2 is drawn 103.6 deg from PC1 at 1200px and 50 deg at 390px. The caption says "perpendicular". At 390px the scatter is 64px wide and the labels collide. Fix: equal-scale axes (one px-per-unit from min(plotW, plotH)), and stack the bar chart below on narrow widths. Finding 7 names only Fig 1, but this is the same root cause in a second figure.
- P3 `:585-586` (Fig 1 histogram): `d3.bin().domain([-6, 6])` drops projected values outside the domain, and |proj| reaches 7.3. So 3 of 50 points are missing from the histogram at the default angle, at exactly the orientation where the prose says it "spreads wide". Fix: domain = +/- max |proj| over all angles (sqrt of max squared norm, about 7.3), or clamp values.
- P3 `:1084` (Fig 3 aria-label): it claims "with its principal axes", but no axes are drawn. Fix: draw the three PC axes (useful for the lesson), or drop the phrase.
- P3 `:339`: three prose inaccuracies in "Where PCA Is Used". The linked essay's PCA vs t-SNE runs on moons, not cells. "A handful" of components contradicts that essay's 30 to 50. Eigenfaces are specific to face images. Rewordings are in the ledger.
- P3 `:335`: the ring example is wrong (PC1 undefined, and a line through the center crosses the ring twice). Rewording is in the ledger.
- P3 `:938-946` (Fig 2 Reset): Reset during autoplay does not cancel the pending setTimeout. Browser run: after Reset at 1.5s, the sequence resumed and ended with both arrows and bars shown. Fix: store the timeout id and clear it on Reset.
- P3 editorial: the closing aphorism at `:341`, filler at `:333`, and unhedged universals at `:246`, `:279`.

**Prior findings recheck**

- Finding 2 (Fig 4 preset spectrum): REPRODUCED. The variances along the generating axes are 5.53636, 3.20062, 0.79685, 0.41388, 0.28053, 0.14003, 0.09407, 0.06135, and the gen1/gen2 covariance is 0.11927, matching AUDIT exactly. The correct sample eigenvalues (1/n, as elsewhere on the page) are 5.5521, 3.2251, 0.7765, 0.4110, 0.2751, 0.1360, 0.0923, 0.0556, total 10.5237. Cumulative is 52.8/83.4/90.8/94.7/97.3/98.6/99.5/100. Sizing: the bars change by under 0.6 of a unit and the displayed percentages by at most 1 point. The elbow claim (2 to 3) survives. It is a correctness and honesty fix, not a story change.
- Finding 7 (Fig 1 scale mismatch): REPRODUCED. At 390px the on-screen axis is 77.8 deg and the drop lines 102.2 deg (24 deg apart instead of 90). It also shows at 1200px (99.6 deg apart). The same bug exists in Fig 2 (new P2 above). The 1px drag jump itself was not re-measured.
- Finding 8 (Fig 4 k >= 3 view ignores dims 4..k): REPRODUCED by code reading. `iso()` at `:1434` reads only pt[0..2], and the label reads `k + 'D isometric view'`.
- Editorial "simulated data not labeled in captions": REPRODUCED for this essay (none of the 4 captions).
- Editorial "no LEDGER.md": still true. This file is the draft for the 04 section.

#### 05 Bayes' theorem

**New findings**

- P2 `05-bayes-theorem.html:351`: the confidence-interval gloss asks what "range would contain the true value 95% of the time", which puts the 95% on a fixed range. PROMPT.md explicitly requires the correct gloss. Fix: put the 95% on the procedure or intervals across repeats (wording above, per NIST 7.1.4).
- P2 `:1094`: the Fig 4 Bayesian alt text promises a 95% credible interval that is never drawn, and without it the Bayesian vs frequentist comparison has no interval to compare. Fix: compute and draw the equal-tailed beta interval with a label, or remove the claim.
- P2 `:320` with `:311`, `:831`: the prose says the three priors converge, but the figure's only bulk control stops at 20 flips, where the spread is still 0.117 (expected). The 20/20 skeptical prior needs hundreds of flips. Fix: add "Auto-flip 200" (or bounded instant flips under reduced motion), or state the flip count in the prose. Also fix the Fig 3 alt text (`:910`), which claims convergence at default.
- P3 `:301`: "in proportion to the evidence" is wrong (width goes as 1/sqrt(n)); "after 50 the distribution is tight" cannot be reached quickly in Fig 2, which has no multi-flip button. Fix: reword with the 1/sqrt(n) statement and give the sd numbers; optionally add "Flip 10".
- P3-a `:491-551`: at the default 1% base rate the two highlighted regions are a 6px column (2.8px at 390px) and a 13px strip with no in-box labels; the only label drawn is "True −". The caption's point is true but hard to see. Fix: add leader labels for TP and FP when boxes are too small, or state the pixel reality in the caption ("the thin blue sliver at left").
- P3-b `:576`: the readout always says "only X% actually have the disease", including at 97.7% (30%, 99/99). Fix: drop "only".
- P3-c `:1163`, `:1167`: the readout prints "1 flips" (no singular handling, unlike Figs 2 and 3), and it shows interval bounds rounded to 2 decimals while the mass is computed on unrounded bounds. Fix: pluralize; compute the mass on the displayed rounded bounds or print 3 decimals.
- P3 `:935`: Fig 3's "true = 0.6" line is shown for manual Heads/Tails clicks, which have no true bias. Fix as in the ledger entry.

**Prior findings recheck**

- AUDIT 3 (Wald CI zero width after one flip): REPRODUCED. One tail in the browser gave "95% CI: [0.000, 0.000]" with true 0.60. Also computed exact Wald coverage at p=0.6: 0.000 at n=1, 0.835 at n=5, 0.899 at n=10.
- AUDIT 5 (beta underflow): REPRODUCED with the page's own functions. betaPDF(.5,601,601) = 0 and betaIntervalMass(601,601,.45,.55) = 0. The first zero at 0.5 occurs by 551/551 (1100 flips). At bias 0.6 the peak underflows near n of about 1060, so about 22 uses of "Flip 50". The endpoint-zero issue is confirmed too: betaPDF(0,1,1) = betaPDF(1,1,1) = 0.
- AUDIT 6 (bias slider keeps old flips): REPRODUCED from code. The input handler (`995-1000`) only re-renders; `flips` and `nHeads` persist while the marker and "True =" readout switch to the new value.
- "73%" editorial item: REPRODUCED. There is no stated data or prior. It is achievable: with a uniform prior, 69 heads in 115 flips gives 73.0% (computed). Tie it to that example or label it illustrative.

#### 06 Reinforcement learning

**New findings**

- P2 `docs/algorithms-ml/06-reinforcement-learning.html:364` (and `:344`). "Value ... drops sharply near pits" / "dark cells far or dangerous" is false of the max-Q heatmap: pit neighbours are as bright as other cells at the same distance from the goal (V* by construction; seed-303 run: 1.8 next to the pit at (2,3)). Readers are told to look for something the figure does not show. Fix: reword as in the ledger; if the pits' effect should show, point at Fig 2's red pit-facing triangles or the Fig 4 arrows.
- P3 `:361`. Fig 4 caption says the path labels show "the reward at each step"; they are cumulative (-1 ... -11, then -1). Fix the caption or the labels.
- P3 `:391`. Fig 1 alt text describes "walls in gray"; there are no walls. Change to "empty cells in gray".
- P3 `:280`. "balances directness against safety" implies a trade-off this deterministic grid does not have (349 of 924 shortest paths avoid both pits). Reword.
- P3 `:308`. "Too much exploitation locks it onto the first decent route and it misses shorter ones" is not what this grid shows: eps 0.01 finds the 12-step route in 200/200 seeds, because zero initial Q-values are optimistic against the -1 step cost. Add one sentence saying so, or hedge with "can".
- P3 `:340`. PROMPT asks the essay to name off-policy learning. The idea is explained at `:338` but the term "off-policy" (and SARSA as "on-policy") never appears. Add the terms.
- P3 `:326`, `:330`, `:962`. At page load, before any training, both "Greedy path" readouts say "loops" (all-zero Q picks "up" from the start and bumps the wall). For the first ~100 episodes most runs keep saying "loops". Show a dash until the first episode, and consider noting in the caption that "loops" is expected early.
- P3 `:368`. "slowly updated copy" describes DQN's target network imprecisely; the paper copies it every C updates. Reword.
- P3 `:1133`. Heatmap shows "-0.0" for small negative values (cell (3,2) = -0.04). Cosmetic; format with a sign-aware rounding.

**Prior findings recheck**

- AUDIT 9 (arrow keys hijacked): REPRODUCED. Focusing Agent A epsilon slider and pressing Right left it at 0.10 and moved Fig 1's agent (steps 0 -> 1). Same for Fig 2's speed slider (stayed at 1).
- AUDIT 10 (reduced motion ignored): REPRODUCED. With reducedMotion "reduce" and Motion.reduced() === true, "Start both" reached episode 124 in 500 ms and Fig 2 reached episode 61 in 500 ms. `prefersReducedMotion` (`403`) is never read.
- Editorial, Fig 2 "approaching 12" with fixed epsilon: REPRODUCED. Readout ranges 5 to 18 after thousands of episodes; 30% of late episodes are exactly 12 (mean 12.2).
- Editorial, "every step costs -1" vs terminal reward: REPRODUCED. 12-step route totals -1 in Fig 1 and Fig 4.
- Editorial, SVG labels below 11px: REPRODUCED for this essay. Grid labels 9px (`490`, `494`, `498`), heatmap values 9px (`1131`), path labels 8px (`1210`), chart ticks and legend 10px (`924`, `926`, `944`, `948`, `952`).
- Editorial, phone captions "left/center/right": does not apply to this essay; its captions and prose use no left/right wording, and Fig 3's two grids stack at 390px (tops 4459 and 4825), no horizontal scroll (scrollWidth 390).
- Editorial, missing LEDGER.md: still true; this file is the 06 portion.

## Fix pass

Run 2026-09-25, one agent per page (03 also took the index), each fixing every first- and second-pass finding and every wrong or unverifiable ledger entry on its page. Each re-ran its model checks in node, passed render-check, and swept headless Chromium at 1200px and 390px, light and dark, reduced motion on and off, exercising every control. The main session then re-ran render-check, an em dash scan and a relative-link check on all seven pages (all clean), and independently reran 01 Figure 2 in node: 0.02 creeps, 0.5 converges, the 2.5 default bounces in a bounded 2-cycle, and rates from 3.81 up diverge. The records below are the per-page fix logs; the scripts they name were session scratch and were not kept.

Left open: 03 Figures 3 and 4 still show cell tooltips on hover only (the same values are printed in the cells); 05 has no optional "Flip 10" button.

### Fix record: 01-gradient-descent.html

Verification scripts: f01/verify.mjs (extracts the Fig 2, 3, 4 model code from the page and runs it in node), f01/pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference, all controls). Screenshots: f01/shot-*.png. render-check PASS. U+2014 count 0. No console errors, no NaN, no document overflow, no SVG content outside its SVG in any of the 8 configurations.

**AUDIT first pass**

- Finding 4 (marker/readout at generating params): fixed. Page computes the closed-form least-squares fit (0.609222, 1.191189 with the new x range); marker labelled "least-squares minimum", readout "Distance from the minimum after 50 steps" uses it. Gradient at the fit is 3e-16 (node). Generating values (0.7, 1.2) named separately in the caption.
- Finding 13 (Adam "variance"): fixed. Now "the second raw moment, the mean squared gradient".
- Editorial debt, simulated data unlabeled: fixed. Fig 4 caption says "64 simulated points".

**AUDIT second pass (01)**

- P1 Fig 2 no overshoot/divergence: fixed. New single-minimum curve L = 0.25u^2 + 0.5 sqrt(1+u^2) + 0.5, u = x - 0.5 (curvature 1.0 at bottom, 0.51 at the walls). Defaults 0.02 / 0.5 / 2.5. Panel headings now computed verdicts from each run. Node sweep over full slider ranges: small 0.001-0.072 creeps, 0.073-0.5 settles; large 0.1-1.0 settles, 1.01-1.95 bounces then settles, 1.96-3.80 bounces forever (2-cycle, at 2.5 between x = -0.833 and 1.833), 3.81-5.0 diverges (every value). Diverging runs draw their step lines off the top of the panel (clipped) and the dot goes hollow at the edge.
- P2 Fig 3 no zigzag / momentum swings / Adam hidden and off-plot: fixed. Replaced Rosenbrock with a quadratic valley (curvatures 0.1 and 12, tilted 0.35 rad, min (1,1)). GD rate 1.9/12 = 0.158; momentum same rate, beta 0.5; Adam 0.25; 100 steps; all three drawn by default; minimum marked; paths clipped. Node: across-valley offset at steps 0/5/10/20: GD 1.10/0.65/0.38/0.13 (38 sign changes), momentum 1.10/0.22/0.04/0.00; distance at 100: GD 0.53, momentum 0.10, Adam 0.27; end points separated by >= 0.18. Adam stays inside x [-1.82, 0.75], y [-0.12, 1.14]. Caption and live readout match.
- P2 Fig 4 walker never arrives: fixed. x range [-4,4] -> [-2,2] and lr 0.018 -> 0.1. 300-run node means: batch 1 first within 0.3 of the optimum at step 14.4, final 0.41, straightness 0.26; batch 64 final 0.000, straightness 0.987. Default page run (batch 1) ends 0.813; caption says the batch-1 distance varies per Resample and averages about 0.4.
- P2 "SGD" label on full-batch GD: fixed. Button/legend/prose say "Gradient descent (full gradient)"; SGD is introduced in the mini-batch section.
- P3 flat minima as fact: fixed. Attributed to Keskar et al. 2017 and Dinh et al. 2017 (abstracts read this session, arXiv 1609.04836, 1703.04933), stated as debated.
- P3 Fig 2 two minima: fixed (new curve has one).
- P3 model never stated: fixed. Prose states y-hat = w x + b; axes now "slope w", "intercept b".
- P3 Fig 3 caption gives nothing to notice: fixed (rewritten around what each path does).
- P3 filler after Fig 1 and colon headings: fixed. Filler replaced with a sentence about minima being indistinguishable to the update rule; headings "How Far to Step", "Momentum and Adam", "Learning from Mini-Batches".
- P3 role colors misused: fixed in Figs 2-4. Parameters/walker in --c-model, loss curve and Fig 4 contours in --c-loss; Fig 3 optimizers use non-role colors (orange, pink, near-white with dark casing). Fig 1 start dots left red (not flagged).
- P3 "usually pick by experiment": reworded to "the choice is often made by trying several".

**LEDGER [ ] and [?] entries**

- [?] "thousands of steps": reworded "hundreds of steps"; small default 0.02 needs 299 steps to get within 0.01.
- [ ] "Too large ... flying off entirely": fixed (see P1). Now true on the slider (>= 3.81).
- [ ] "In between, convergence is fast and stable": reworded "reach the bottom in a handful of steps"; medium 0.5 settles in 10.
- [ ] "vanilla SGD" naming: fixed.
- [?] "zigzags and makes slow progress": fixed, figure now shows it (numbers above).
- [ ] "oscillations cancel": reworded: across-valley pushes partly cancel in the velocity; added that beta 0.9 at this rate is still swinging after 20 steps (offset 0.38 at step 20, node).
- [ ] Adam "variance": fixed.
- [?] "usually by experiment": reworded.
- [?] y-hat undefined: fixed.
- [?] flat minima: reworded with sources.
- [ ] Fig 2 panel labels / alt text: fixed; labels and aria-label computed from runs.
- [?] Fig 2 "first creeps": fixed; at 80 steps the small-rate dot is 0.77 from the minimum.
- [ ] Fig 3 race story, Adam off-plot, SGD hidden: fixed.
- [ ] Fig 4 "true minimum": fixed (finding 4).
- [ ] Fig 4 "at 64 heads almost straight": now true (straightness 0.987, final 0.000).
- [ ] Fig 4 distance readout as evidence: fixed; batch 1 ~0.41 mean vs 0.000 at 64.
- [?] Fig 4 simulated data unlabeled: fixed.

**New numbers for the ledger**

- Fig 2: curve above; curvature 1.000 at min, 0.510 at x = -3 and 4; lossGrad matches finite difference to 1e-8. Defaults: 0.02 creeps (0.77 away at 80, 299 steps to arrive), 0.5 settles in 10, 2.5 bounces forever; divergence threshold 3.81; slider max 5.
- Fig 3: GD 0.53, momentum (beta 0.5) 0.10, Adam (0.25) 0.27 from the minimum after 100 steps; beta 0.9 momentum across-valley offset 0.38 at step 20. Same Adam run on the axis-aligned version of the valley (rate 0.2) ends 0.007 away, supporting the "tilted valley" explanation. Gradient matches finite differences to 1e-6.
- Fig 4: N = 64, x in [-2, 2], lr 0.1, 50 steps; least-squares fit (0.609222, 1.191189); gradient at (0.7, 1.2) is (0.242, 0.010); default page batch-1 final distance 0.813.

### Fix record: 02-backpropagation.html

Scripts: f02/deep.cjs (extracts layerGradients from the page; FD check + 30-seed sweep), chk.cjs (depth/saturation checks), br.mjs (Chromium 1200/390, light/dark, reduced motion on/off, all controls).

**AUDIT findings**
- Finding 1 (P1, fresh target per component): fixed. One gauss() target per example; loss is now mean over batch of (y - target)^2 (matches the page's L = (a - y)^2); gradients accumulated into the batch-loss gradient G[l], RMS taken over its entries. Caption and prose say "root-mean-square entry of the batch-loss gradient". FD on extracted page code (depth 5, 40 weights): max abs err 1.7e-11 (sigmoid), 2.2e-11 (ReLU).
- N1 (ReLU flat at every scale): fixed. Prose now says the profile stays roughly flat at every scale (homogeneity argument), and that scale changes the overall size; readout prints layer 1 gradient size. Claim about sqrt 2 is now depth-based and computed: 30-seed medians of layer-1 RMS from 2 to 20 layers: sqrt2 7.4e-2 -> 1.4e-2 (~5x), scale 1 3.8e-2 -> 1.9e-5 (~2000x), scale 2 1.9e-1 -> 2.4e3 (~10^4x).
- N2 (dL/dy clash): fixed. Output node labeled "a" in all network diagrams; Figure 2 prints "dL/da = -0.657"; Figure 1 caption notes the label.
- N3 (hidden grad labels): fixed, labels read "dL/dz 0.002 / 0.019 / -0.031"; caption explains dL/dz.
- N4 ("stops shrinking near 8"): reworded to "falls to about 1.3 per layer, and for some draws does not shrink at all". Numbers below.
- N5 ("responsibility"): fixed, legend says the loss is more sensitive to that weight; intro "share of the blame" and subtitle "following blame" also reworded to sensitivity/error.
- N6 (role colors): fixed. Figure 3 loss curve uses --c-loss; Figure 4 current line var(--text), ghost stays dashed --text-2.
- N7 (Figure 1 caption vs load state): fixed, "From step 2 on ... from step 3, node shading".
- N8 ("--" placeholders): fixed. Figure 2 readout hidden until run; Figure 3 shows "Epoch: 0" until a loss exists.
- Sub-11px SVG labels: fixed, all 10px/8px -> 11px, plus `svg .axis text {font-size:11px}` for d3 ticks; Figure 1 mini panels widened 150 -> 162 so "loss = 0.108" fits. Browser check: no text under 10.9px effective, no text outside its SVG, all 8 configs.
- Phone captions left/center/right: fixed, Figure 3 caption says "From left to right (top to bottom on a phone)".

**Ledger [ ] / [?] entries**
- [ ] "computes a squared-error loss against random targets" (328): fixed (code) and reworded to describe linear readout, one target per input, batch-averaged loss.
- [ ] "typical size of the loss gradient" (328): fixed, now "RMS of its entries" of the batch-loss gradient, which is what the code computes.
- [ ] Figure 4 caption "RMS gradient of the loss": fixed, plus "Simulated:" label.
- [ ] "Near scale 8 ... stops shrinking": reworded (N4).
- [ ] ReLU sqrt 2 sentence: reworded (N1).
- [?] "produces nonsense": reworded to "its outputs have nothing to do with the task".
- [?] "more responsibility for the error": reworded (N5).

**New numbers for the ledger (corrected Figure 4, batch-loss gradient)**
- Default (sigmoid, depth 10, scale 1, seed 7): ratio 1.1e6, x4.67/layer, layer-1 size 1.3e-8, avg slope 0.23, 0% near 0/1. Seeds 1-30: median x4.64 (3.13-5.55). Prose: "a factor of four or five".
- Sigmoid depth 10, 30 seeds median per-layer: s0.5 x8.73, s1 x4.64, s1.41 x3.51, s2 x2.76, s4 x1.83, s8 x1.37 (0.77-1.66; seed 7 x1.15). Depth 20 s8 median x1.31 (0.99-1.72).
- Avg sigmoid slope (seed 7, d10): 0.24, 0.23, 0.21, 0.19, 0.12, 0.07 for s = 0.5..8.
- Share of sigmoid units within 0.05 of 0 or 1 at s8: median 60% (min 46%) depth 10; 58% depth 20. Prose: "about 60%"; now in readout.
- ReLU depth 10 per-layer medians: 0.98-1.11 for s<=1.41, 1.19 for s>=2 (seed 7: x1.17-1.30). Depth 20: 0.99-1.11. Not exactly scale-free because the targets do not scale with the weights, but flat at every scale.
- Figure 2 unchanged numerically: dL/da -0.657, dL/dz 0.002/0.019/-0.031, mean |grad| 0.0868 / 0.0086. XOR default: loss 0.0025 at epoch 200 (Chromium).

**Verification**
- render-check.mjs: PASS. No U+2014. Chromium 1200/390 x light/dark x reduced/full: no console errors, no NaN, no horizontal overflow, SVG text in bounds and >= 11px, every control exercised incl. slider extremes (depth 2/20, scale 0.5/8), keyboard on the scale slider, resample, resets, XOR to epoch 200.

### Fix record: 03 Attention + series index

Pages: docs/algorithms-ml/03-attention-mechanism.html, docs/algorithms-ml/index.html. No git actions taken.

Verification (all this session): node run of the page's own `makeAttnModel` (attn03.mjs) for seeds 1-5; `render-check.mjs` PASS on both pages; Playwright (pw03.mjs) at 1200/390 px x light/dark x reduced motion on/off: no console errors, no NaN/undefined, no document overflow, every SVG text/rect/circle inside its SVG, no SVG text under 11px, in hard and soft mode and at slider 0 and 20 for all three stages; keyboard focus on a Figure 1 key shows the tooltip; one Retrain checked. Per-figure screenshots at 390 px light and dark (f-*.png). U+2014 count 0 on both pages.

**AUDIT findings**

- AUDIT 11 (lookup boxes clipped on phones): fixed. Figure 1 sizes the query radius, value-box width (min(136, 0.36 W)), value column and key column from the available width. The soft-mode "Output" label is right-aligned on narrow screens. At 390 px every element sits inside the 324 px SVG (Playwright bounds check).
- AUDIT 12 (letter-pair scores only on hover): fixed. Key groups have tabindex 0, role=button and an aria-label with score and weight. Focus, Enter/Space and a touch tap show the same tooltip, and blur/Escape hide it. A readout under the figure also prints all five scores and soft weights (cat 4, car 2, cap 2, cup 1, coat 3; 59/8/8/3/22%). Caption updated.
- Debt, SVG labels under 11px: fixed. Figure 1 weight labels, Figure 3 "keys ->"/"queries", Figure 3 cell values (were 9px at 390 px; cell size is now (W-84)/6, so values stay printed), Figure 4 axis words are all 11px. No SVG text is under 11px at 390 or 1200 px.
- Debt, index breadcrumb (Parallel Coordinates): fixed. It is now "Moonshine / Algorithms & ML", in the same plain-span pattern the bioinformatics index uses.
- Debt, index prior-as-target: reworded. The target examples now say that in Bayes the prior plays a loosely similar part, as the starting belief the data revises, but it is an assumption, not a correct answer. The intro adds the same one-sentence qualification. 05 still colors the prior with t-target; the index now says so honestly rather than asserting it is ground truth.

**Second-pass findings**

- N1 (03 off the role palette): fixed. Mapping: words, X, Q, K, V = data (blue); W_Q, W_K, W_V = model (purple); attention weights, raw/scaled scores, outputs = prediction (cyan); the words the readout must name = target (green, Figure 4 outlines and prose); the readout's cross-entropy = loss (prose). The equations use the same resolved hexes as the figures (C_DATA/C_MODEL/C_PRED constants shared by KaTeX and D3). The old Q-blue/K-red/V-green palette and the unused `cm` are gone (cm is now used for the W's). Figure 4's head colors (blue/orange) are replaced by one cyan scale with printed weights; heads are told apart by title. A prose paragraph states the mapping. Diverging scales: gray negative to blue (Q/K/V) or cyan (scores), all resolved hex.
- N2 (Clark et al. reversed): fixed. Now "heads where direct objects attend to their verbs and determiners to their nouns". Reread arXiv 1906.04341 sec. 4.2: "for all relations in Table 1 except pobj, the dependent attends to the head word".
- N3 (sqrt(d_k) rationale): fixed. Prose gives the variance-d_k argument and Vaswani's stated reason (softmax pushed into regions with extremely small gradients, "we suspect"), with a link to arXiv 1706.03762 (reread this session, sec. 3.2.1 and footnote 4). Step 2 now says scaling sets the starting spread, and training can still sharpen rows when that lowers the loss, which removes the tension with the 93-99% rows.
- N4 (test sentences overlap training): fixed in code. The model keeps a Set of every training sentence, and `accuracy()` samples 300 distinct sentences not in that Set. Readout, caption and prose now say "300 sentences it never saw in training". Seeds 1-5: 100% / 100%.
- N5 (first Retrain repeats seed 1): fixed. nextSeed starts at 3. The first Retrain now shows head 1 at 2 attached / 5 previous and head 2 at 6 / 1 (a clean swap), verified in node and the browser. The prose says "The first retrain swaps the roles, and later ones vary."
- N6 wording: fixed. "divided by sqrt 6"; "Both heads feed both readouts".
- N7 (fixed-vector history uncited): fixed. The page links Bahdanau, Cho and Bengio 2014 (arXiv 1409.0473 abstract read this session: the fixed-length vector "is a bottleneck"), says they suspected it, and says attention was added on top of the sequence model before transformers kept only attention. "Suspected" matches their conjecture. The length-degradation clause ("those models got worse as sentences got longer") is Bahdanau's summary of Cho et al. 2014.
- N8 (bioinformatics blurb): fixed. Now "PCA applied to simulated expression data".
- Index role-color claim: now true for 03 (see N1). The vocabulary examples add "the queries, keys and values computed from them" under data, "attention weights" under prediction, and "the words each word must name in attention" under target.

**Ledger [ ] / [?] entries**

03:
- [?] "scaled by sqrt 6": reworded to "divided by".
- [?] sqrt(d_k) rationale: fixed, sourced (Vaswani 2017).
- [?] "one shared readout": reworded to "both readouts".
- [?] "fresh sentences": fixed (held-out filter in code; wording "never saw in training").
- [ ] Clark direction: fixed.
- [?] equation role colors: fixed (N1).
- [x] note on Bahdanau: citation added.
- [x] note on Retrain also changing training sentences: caption now says so.
- Anti-slop: "The interesting part is how the model learns those weights." replaced with "This page is about how a model learns those weights." "neighbour" changed to "neighbor".

Index:
- [ ] prior as target: reworded (see above).
- [ ] five-color claim false for 03: fixed by the 03 changes, plus a qualifying sentence about Bayes.
- [?] gene expression data: fixed ("simulated").
- [?] Card 04 blurb: reworded to "A draggable projection axis, components computed step by step, and a scree plot." (based on the ledger's description of 04's sections; I did not open 04, since another agent owns it).
- [?] Card 05 blurb: added "and the Bayesian and frequentist readings of the same flips".
- Card count stays at six.

**New numbers for the ledger**

- Held-out evaluation: 300 distinct sentences outside the training set (about 3,100-3,150 unique training sentences out of 5,184), accuracy 100% / 100% on seeds 1-5.
- Default run (seed 1) is unchanged: head 1 has 5 attached / 2 previous, head 2 has 2 / 5; step-400 row maxima 0.93-0.99; last-20-step loss about 0.0006.
- First Retrain = seed 3: head 1 2 / 5, head 2 6 / 1; accuracy 100 / 100.
- The Figure 1 numbers are unchanged (scores 4/2/2/1/3, weights 59/8/8/3/22%).

**Not fixed**

- Figure 3 and 4 cell tooltips remain hover-only, but everything in them is now printed in the cells (Figure 3 at >= 30 px cells, which holds down to about 264 px of figure width), so no information depends on hover.
- The model math is unchanged apart from recording training sentences, so I did not repeat the finite-difference gradient check (the ledger's 1.2e-5 result still applies).

### Fix record: 04-pca.html

Verification: v04.mjs (Chromium, 1200/390 px x light/dark x reduced motion on/off; every control, 60 keyboard steps, drag, Reset mid-autoplay, all 8 slider values), shot04.mjs (per-figure screenshots s04-*.png). All 8 runs: 0 console errors, no NaN, no horizontal overflow, no SVG element outside its SVG, no text under 11px. render-check PASS. No U+2014.

**AUDIT findings**
- AUDIT 2 (Fig 4 preset spectrum): fixed. Sample covariance (1/N) of centered8 diagonalized with Jacobi in the page; bars, cumulative line, readout, projection and reconstruction error all come from it. Browser readout matches ledger's node values exactly (52.8/83.4/90.8/94.7/97.3/98.6/99.5/100%; error 596.6/209.6/116.4/67.1/34.1/17.7/6.7/0.0 = 120 x dropped eigenvalues).
- AUDIT 7 (Fig 1 scales/drag/phone): fixed. Square plot, one px-per-unit for x and y; drag converts pointer via xScale/yScale.invert; histogram below on widths < 560. Measured |cos| between axis and every drop line = 0.0000 at both widths; handle follows pointer (no 14px/37px jump).
- Second-pass #5 / N1 (Fig 2 same bug): fixed. Equal scales, bars stack below on narrow widths. Measured PC1-PC2 on-screen angle 90.00 deg at 1200 and 390.
- AUDIT 8 (4D-8D view): fixed with a different encoding. Lower panel now shows every point rebuilt from k components (x_hat = W W^T x, all k used) on original coordinates 1 and 2, ghosts + red error lines, plus a "Recon. error" readout of the full 8D error. Changes at every k.
- Histogram domain drops points (N3): fixed. Bins span +/- max point norm (7.3); histogram count = 50 at all 60 tested angles.
- Fig 2 Reset during autoplay: fixed. Timeout id stored and cleared; after Reset at 1.5s, 4s later 0 arrows/bars.
- Fig 3 alt text "principal axes": fixed by drawing the three PC axes (2 sd each way, min 1 unit), faded/dashed when toggled off; alt text updated. Also fixed Fig 3 points/labels overflowing the SVG (scale now fits data).
- Ring example (:335): reworded per ledger.
- Bioinformatics / eigenfaces sentence (:339): reworded ("synthetic data", "a few dozen components", eigenfaces = PCs of face photos).
- Simulated-data labels: all four captions now say simulated.
- Closing aphorism (:341): cut. Filler "The scree plot is a starting point..." (:333): replaced with the computed 90%/95% counts for Fig 4.
- Unhedged universals (:246, :279): hedged ("When the data is stretched along a few directions...", "In data like this...").
- SVG text 0.65rem (10.4px): raised to 0.7rem everywhere.
- Fig 1 handle: role changed so the focusable slider is not inside role=img; aria-valuenow/valuetext added.

**Ledger entries**
- [ ] Fig 4 bars/cumulative "each component's variance": fixed (computed sample PCA).
- [ ] "Variance explained" readout: fixed; now 1 decimal, sample values.
- [ ] "data below is projected into that many dimensions": replaced by the reconstruction view; caption rewritten.
- [ ] ring: reworded. [ ] linked essay "simulated cells": reworded "synthetic data". [ ] eigenfaces: reworded.
- [ ] Fig 2 "PC2 perpendicular": fixed (90.00 deg on screen).
- [ ] Fig 3 alt "principal axes": fixed (axes drawn).
- [?] :279, :246 universals: hedged. [?] "does not find clusters": reworded ("not designed to find clusters, though it separates them when they differ along high-variance directions"). [?] "a handful of components": reworded "a few dozen" (bioinformatics essay says 30 to 50).
- Recheck: elbow 2 to 3 holds on computed eigenvalues (5.5521, 3.2251, 0.7765; ratio l2/l3 4.15 largest); caption now states it. Reconstruction error = N x dropped variance holds for Fig 3 (7.4 = 100 x 0.0744, stated in prose) and every k of Fig 4 (stated in caption).

**New numbers for the ledger**
- Fig 4 cumulative: 52.8, 83.4, 90.8, 94.7, 97.3, 98.6, 99.5, 100.0%. Bar labels 53/31/7/4/3/1/1/1. 90% rule keeps 3, 95% rule keeps 6 (new prose claim).
- Fig 4 recon error (summed): 596.6, 209.6, 116.4, 67.1, 34.1, 17.7, 6.7, 0.0.
- Fig 3: dropping PC3 costs 7.4 = 100 x 0.074 (new prose claim).
- Fig 1 default still 89%; Fig 2 bars 92%/8%.

### Fix record: 05 Bayes' theorem (docs/algorithms-ml/05-bayes-theorem.html)

Scripts: f05/fns.js + test.js (node model checks), pw.mjs / pw2.mjs (Chromium 1200/390, light/dark, reduced motion on/off). render-check PASS. No console errors, no NaN, no doc overflow, all SVG text >= 11px and inside its SVG after fixes. U+2014 grep: 0.

**AUDIT findings**
- AUDIT 3 (Wald CI zero width): fixed. Fig 4 now uses the Wilson score interval, labeled "95% Wilson CI"; prose names it and says Wald collapses after one flip. One head gives [0.207, 1.000]. Exact coverage at p=0.6 (node): n=1 1.000, 5 0.990, 10 0.982, 20 0.963, 50 0.941, 100 0.948. Source read this session: NIST e-Handbook 7.2.4.1 (prc241).
- AUDIT 5 (beta underflow, endpoints): fixed. Densities via log-gamma in log space, rescaled to peak 1 before exp; interval mass via regularized incomplete beta (continued fraction). Endpoint limits exact: Beta(1,1)=1 at 0 and 1, Beta(2,1)=2 at 1, 0 at 0. Checks: pdf(.5;601,601)=27.657, mass(.45,.55)=0.9995; dCDF/dx matches pdf by finite difference at (3,5),(70,47),(601,601),(3001,2901); quantiles of Beta(1,1), Beta(2,1) exact. Browser: 50,000 flips renders.
- AUDIT 6 (bias change keeps old flips): fixed. Slider input calls reset(); caption says so. Verified with keyboard (End/Home) in browser.
- Editorial "73%": fixed. Now "after 69 heads in 115 flips ... uniform prior ... 73%" (computed 0.7305).
- Editorial simulated label: Fig 3 and Fig 4 captions say simulated.

**Second-pass findings**
- P2 :351 CI gloss: fixed. "What procedure gives intervals that, over many repeats..., contain the true value 95% of the time?" plus "the 95% belongs to the procedure" (NIST 7.1.4 read this session) and actual Wilson coverage 98% at n=10, 94% at n=50.
- P2 :1094 credible interval: fixed. Equal-tailed 2.5/97.5% beta quantiles computed, shaded under the curve, drawn as a bar, labeled "95% credible: [lo, hi]". Prose mentions it.
- P2 Fig 3 convergence: fixed. Added "Auto-flip 200" (about 4 s; instant under reduced motion; 20 also instant under RM). Prose states expected skeptical/credulous gap 0.20 / 0.12 (20 flips) / 0.03 (200 flips). Alt text reworded.
- P3 :301 proportion/"tight": reworded to 1/sqrt(n) with sd numbers (0.289, 0.175 at 3H/2T, 0.067 at 30H/20T). No Flip 10 added to Fig 2 (optional).
- P3-a Fig 1 tiny regions: fixed. Leader labels "True + (thin blue column)" and "False + (amber strip)" when a positive box is too small for an inside label; caption describes them.
- P3-b "only": dropped.
- P3-c "1 flips" pluralized; mass now computed on the displayed 2-decimal bounds (1 head: [0.62,0.72] -> 13.4% = .72^2-.62^2).
- P3 :935 "true = 0.6" line: now "auto-flip bias = 0.6", drawn only once auto-flips have happened (checked absent after manual flip).
- Restating sentences cut: "The test is the same; only the population is different.", "The prior matters when data is scarce...", closing "For a single decision... often more directly useful". "dominant in much of classical statistics" dropped.
- Left/right in Fig 4 prose: now "frequentist panel"/"Bayesian panel"; caption says left, or above on a phone.
- 10px SVG labels raised to 11px. Fig 4 p-hat/CI labels clamp at edges (were overflowing at p-hat near 0).

**Ledger entries now**
- [x] :301 width claim: sd 0.289 -> 0.175 (5 flips, 3H) -> 0.067 (50 flips, 30H); ~1/sqrt(n).
- [x] Three priors converge: expected gap 0.200 / 0.117 / 0.026 at n = 0 / 20 / 200 (bias 0.6); reachable via Auto-flip 200.
- [x] 95% confidence interval: Wilson; coverage numbers above.
- [x] 73%: Beta(70,47) mass on [0.55,0.65] = 0.7305.
- [x] CI gloss: per NIST 7.1.4.
- [x] Fig 3 alt text, Fig 4 both alt texts: match drawing.
- [x] Fig 4 readout mass: computed on displayed bounds.

### Fix record: 06 Reinforcement learning

Page: docs/algorithms-ml/06-reinforcement-learning.html. Checks: scratchpad rl06-core.mjs (grid/RNG/Q code extracted from the edited page) + rl06-check.mjs; pw06.mjs (Playwright 1200/390 x light/dark x reduced on/off, screenshots f06-*.png). render-check PASS. No U+2014.

**AUDIT first pass**
- 9 (arrow keys hijacked): fixed. Handler moved from document to #fig1-container and fires only when focus is on the grid (#fig1 now tabindex=0 with focus ring) or an arrow button. Verified all 8 configs: Right on Agent A eps slider moves it 0.10 -> 0.11 and Fig 1 stays at 0 steps; Fig 2 speed slider 1 -> 2; focused grid takes 3 arrow presses (steps 3).
- 10 (reduced motion ignored): fixed. Under Motion.reduced() Fig 2's button becomes "Train 50 episodes" and Fig 3's "Train 100 episodes"; each click trains a bounded batch synchronously and draws one static frame; speed sliders hidden; no rAF loop. Verified: Fig 2 at 250 after 5 clicks and unchanged 300 ms later; Fig 3 at 300. Offscreen IntersectionObserver stop kept for the animated mode.

**Second pass (06)**
- :364/:344 "drops sharply near pits" / "dark cells far or dangerous": reworded. Heatmap is "bright near goal, dark far from it or rarely visited"; paragraph now says pits barely show in max-Q, a dark pit neighbour is a rarely visited cell, and pits show in the arrows, which never point into them. Verified: 3 successive Learn runs (seed 303), no pit-neighbour arrow points into a pit (0/24).
- :361 path labels are running totals: fixed caption ("running total of reward after each step, -1 per move then +10 on the last, for a final -1"). Labels 8 -> 11px, end-anchored inside their cell (SVG bounds check passes at 390).
- :391 "walls in gray": fixed -> "empty cells in gray".
- :280 directness vs safety: reworded (no trade-off claimed; "finding a short route that avoids the pits"; uncertainty now "moves that sometimes slip sideways").
- :308 exploitation misses shorter routes: hedged ("can lock it") plus one sentence on zero init being optimistic against -1 steps. Verified eps 0.01 finds 12 steps in 200/200 seeds at 300 episodes.
- :340 off-policy / on-policy: added both terms (Q-learning off-policy after the max explanation; SARSA on-policy).
- :326/:330/:962 "loops" before training: fixed; readouts show an en-dash placeholder until the first episode; Fig 3 caption notes "loops" for the first few dozen episodes (193-194/200 seeds still loop at ep 50).
- :368 DQN target net: reworded to "separate copy ... held fixed between refreshes and copied from the main network only once every fixed number of updates" (no number, matches the paper's "every C updates" per ledger).
- :1133 "-0.0": fixed (|v| < 0.05 prints 0.0). Verified 0 "-0.0" labels after Learn.

**Editorial**
- Fig 2 "approaching 12" under fixed eps: fixed by adding a "Greedy route" readout to Fig 2 (greedyPath moved to shared scope) and rewriting the caption to separate greedy route (settles at 12) from exploratory episode length (varies). Numbers seed 42 eps 0.15: greedy route first 12 at ep 38 (reads loops at 50 and 100, 12 from 200 on); episodes 4001-5000 steps min 5, max 26, mean 12.90, 34.8% exactly 12.
- Terminal reward convention: fixed. Fig 1 caption states the terminal move earns +10/-10 instead of -1 and the 12-step route totals -1; intro says "every other step costs a small amount". Browser walk 6 right + 6 down: total -1.
- Labels under 11px: fixed (grid labels 9 -> 11, heatmap 9 -> 11, path labels 8 -> 11, special-cell labels 10 -> 11, chart ticks/legend/axis 10 -> 11, legend respaced). Playwright: 0 SVG text under 11px, 0 elements outside SVG bounds in all 8 configs.
- Optional P3 "Goal reached!" pill: plain text "Reached the goal." / "Fell in a pit."

**Ledger [ ]/[?] entries**
- "Every step costs -1": fixed (above).
- Fig 1 alt "walls in gray": fixed.
- "balances directness against safety": reworded.
- "Steps last ep falls toward 12": fixed (Greedy route readout + caption).
- [?] "cells near pits develop low ones" (:290): reworded to "actions that lead into pits develop low ones".
- [?] "misses shorter ones": hedged + explained.
- "labeling the reward at each step": fixed.
- "drops sharply near pits" / "dark cells ... dangerous": reworded.
- [?] "slowly updated copy": reworded.
- Fig 2 green-spread caveat (was [x] with caveat): added sentence that green reaches only about seven steps out. V*(d) = -10 + 20*0.9^(d-1): d7 0.63, d8 -0.43, V*(start) -3.72; in Fig 2's seed-42 run after 5000 episodes max Q > 0 reaches distance 7.

**New numbers for the ledger**
- Exploration (200 seeds, 300 episodes, page code): eps 0.1/0.5 -> 12-step greedy route 200/200 each; last-50 mean reward A -3.06, B -14.56. eps 0.01/0.9 -> 200/200 each; A -1.18, B -38.27. Page seeds 101/202: both loops at 100, both 12 at 200.
- Fig 4: 3 successive Learn clicks all 12 steps, total -1, labels -1..-11 then -1.
- Browser (animated): Fig 2 at ~9900 episodes greedy "12 steps", last episode 14; Fig 3 at ~10000+ with eps 0.01/0.9 both "12 steps".

Not fixed: none.
