# Claims: Algorithms & ML series

Built 2026-09-25 as the second pass of the series audit (the first pass is `AUDIT.md`
beside this file). Every checkable claim in the prose, captions, equations, readouts
and alt text of the six essays and the series index, each checked this session:
**Computed** means the page's own model code was extracted and run in node (or the
figure read in headless Chromium), **Derived** means worked by hand, **Sourced** means
read in the named primary source. `[x]` verified, `[ ]` wrong, `[?]` unverifiable
(reword or cut). Line numbers refer to the pages as of commit a15169a. The node and
Playwright scripts were session scratch and were not kept; each entry says what was run.

The wrong and unverifiable entries below were all addressed in the fix pass the same
day (corrected, reworded or cut); `AUDIT.md` "Fix pass" records what changed on each
page and the new numbers each entry now carries. The entries themselves still describe
the pages as audited, before the fixes.

## Status

| # | article | verified | wrong | unverifiable | render-check | notes |
|---|---|---|---|---|---|---|
| 01 | Gradient descent | 25 | 11 | 7 | PASS | weakest essay; Fig 2 and Fig 4 do not show what the prose says |
| 02 | Backpropagation | 42 | 5 | 2 | PASS | small-net gradients match finite differences to 4e-11 |
| 03 | Attention | 39 | 1 | 5 | PASS | model really trains; head roles are seed-dependent, prose already hedges |
| idx | Series index | 12 | 2 | 3 | PASS | five-role-color claim false for 03 |
| 04 | PCA | 26 | 8 | 5 | PASS | reconstruction error = n x dropped variance holds; elbow 2 to 3 holds |
| 05 | Bayes' theorem | 27 | 6 | 8 | PASS | CI gloss wrong; no historical claims to source |
| 06 | Reinforcement learning | 34 | 6 | 3 | PASS | both epsilons find the 12-step route in 200/200 seeds; reward differs |
| | **Total** | **205** | **39** | **33** | | |

## 01 Gradient descent

File: docs/algorithms-ml/01-gradient-descent.html. Checked 2026-09-25. Node scripts in this scratchpad: m1.mjs (Fig 1, Fig 2), m2.mjs (Fig 2 learning-rate sweep), m3.mjs (Fig 3), m4.mjs (Fig 4); browser: shot.mjs, dark.mjs (screenshots fig-*.png). render-check.mjs: PASS, no console errors.

### Prose and equations

- [x] Gradient descent repeats: step downhill, feel slope, step again (`311`) : Derived. Matches update rule and every figure's loop.
- [x] Update rule theta_{t+1} = theta_t - eta grad L(theta_t) (`514`, caption `324`) : Derived. Standard; matches Fig 1, 2, 3 SGD code.
- [x] Loss surface: horizontal axes are parameters, vertical/color is loss (`316`) : Derived. Fig 1 and 3 axes are w1, w2; color is loss.
- [x] "Some reach the global minimum; others settle into a local minimum" (`332`) : Computed. m1.mjs: 4 minima, global at (-1.421, -0.970) f=0.965; basins from a 31x31 start grid: 330/961 global, rest in the three local minima. Browser: 6 Random-start walkers split 5 global, 1 local.
- [x] "The gradient points in the direction of steepest ascent" (`351`) : Derived. Standard (directional derivative is maximized along grad).
- [x] Learning rate is the step distance factor; too small inches, too large overshoots (`357`) : Derived as a general statement.
- [?] "you inch toward the minimum over thousands of steps" (`359`) : Unverifiable against the figure. At the default small rate 0.02 the run needs about 200 steps (m2.mjs) and is within 0.05 of the minimum by step 80. Only the slider floor (0.001) needs thousands. Reword to "hundreds of steps" or tie it to the slider.
- [ ] "Too large, and you overshoot the valley, bouncing across it or flying off entirely" (`359`) plus panel label "Too large" (`365`) : WRONG for this figure. No slider value diverges: swept lr 0.001 to 2.000 in 0.001 steps, none leaves |x|<20 (m2.mjs). At the default 0.95 the dot overshoots once to 0.993 and settles at 1.154 within 7 steps, faster than "Just right" 0.15 (14 steps). Stability limit at that minimum is lr < 2/1.851 = 1.08. See P1 below.
- [ ] "In between, convergence is fast and stable" (`361`) : WRONG at defaults. The "just right" 0.15 panel is slower than the "too large" 0.95 panel (14 vs 7 steps to within 0.01).
- [x] Figure 2 caption "Each step moves the dot by the gradient times the learning rate" (`393`) : Derived. Code `nx = x - lr * lossGrad(x)`; lossGrad matches finite difference (m1.mjs: -0.0887318 both).
- [x] "Three gradient descent runs on the same 1D loss curve" (`393`) : Computed. Same lossFn, start 3.2, one lr per panel.
- [x] "The optimal learning rate depends on the shape of the loss surface, which changes as you move through it" (`398`) : Derived. Stable step bound is 2/curvature; Fig 2 curve has curvature 1.85 at x=1.154 and 3.05 at x=-0.287.
- [x] "Modern optimizers adapt the learning rate during training" (`399`) : Sourced. Kingma and Ba 2014 (arXiv 1412.6980) describe per-parameter adaptive step sizes from moment estimates.
- [ ] "Plain gradient descent (often called vanilla SGD)" and Fig 3 legend "SGD" (`405`, `426`) : WRONG-ish naming. Fig 3's "SGD" uses the exact full gradient; nothing is stochastic. The article then says (`450`) "Everything above assumes ... your entire dataset", so the "SGD" label conflicts with its own later definition. Call it "gradient descent" (GD) in Fig 3.
- [?] "The gradient points across the steep walls ... so the optimizer zigzags and makes slow progress along the valley floor" (`405`) : Partially true. Slow progress: yes, default SGD ends 2.39 from the minimum (1,1) after 200 steps. Zigzag: not shown. With lr 0.004 the across-valley curvature times lr is below 2 except near x>2.5, so after one overshoot at step 1 the path creeps along the floor with 1 sign change of the across-valley step (m3.mjs, fig-optimizers.png). Either raise SGD's rate so it zigzags, or drop "zigzags".
- [ ] "Momentum adds a velocity term, so ... the oscillations cancel" (`411`) : WRONG at default. Momentum is the path that oscillates: 33 across-valley sign changes, loops out to y=-0.39 and back (fig-opt-race.png). It does win (dist 0.016 at step 200, first within 0.05 at step 143). Reword to "builds up speed along the valley; it can overshoot and swing before settling."
- [ ] "Adam tracks the first moment (mean) and second moment (variance)" (`412`) : WRONG as worded. Kingma and Ba Section 2: estimates of "the 1st moment (the mean) and the 2nd raw moment (the uncentered variance)" (found via search of the arXiv text; PDF body not machine-readable here). Code correctly averages g^2. Say "mean squared gradient" or "uncentered variance".
- [x] Adam "scales that parameter's effective learning rate" (`413`) : Derived/Sourced. Code divides per-coordinate by sqrt(v_hat)+eps; matches Algorithm 1. Defaults beta1 0.9, beta2 0.999, eps 1e-8 in code match the paper's suggested defaults.
- [x] Momentum equation v_{t+1} = beta v_t + grad L; theta_{t+1} = theta_t - eta v_{t+1} (`519`) : Derived. Matches runMomentum exactly (heavy-ball in the PyTorch form).
- [x] Momentum caption: "beta sets how much of the previous step to keep" (`418`) : Derived. With fixed eta, keeping beta of v is keeping beta of the previous step.
- [x] "Adam does not always win" (`443`) : Computed. At the default start Adam ends 2.38 from the minimum, no better than SGD; momentum wins (m3.mjs).
- [x] "On some problems, well-tuned SGD with momentum generalizes better" (`443`) : Sourced. Wilson et al. 2017, "The Marginal Value of Adaptive Gradient Methods in Machine Learning" (arXiv 1705.08292): adaptive methods "generalize worse (often significantly worse) than SGD". Consider citing it inline.
- [?] "practitioners usually pick an optimizer by experiment" (`444`) : Unverifiable generalization. Soften to "often" or cut.
- [x] Mini-batch estimate is noisy; single sample points roughly the right way; larger batch cleaner but costlier (`450`) : Computed. m4.mjs: straightness (chord/length) 0.47 at batch 1 rising to 0.87 at 64; sharp turns 28 to 0 (200 runs each).
- [x] MSE over mini-batch equation (`524`) : Derived. Code loss matches; analytic gradient matches finite difference (node check, -1.0367 both).
- [?] "y-hat_i(theta)" never defined (`524`, `479`) : Unverifiable to a reader. The model y-hat = w x + b is only in code. State it in the caption.
- [x] "The noise ... can bounce the optimizer out of a shallow local minimum" (`484`) : Sourced. Kleinberg, Li, Yuan, ICML 2018 (arXiv 1802.06175), SGD as working on a smoothed loss and escaping bad local minima. Hedged "can" is fine. Not shown by any figure (Fig 4 loss is convex).
- [?] "it biases the model toward flatter minima, which tend to generalize better" (`485`) : Contested. Keskar et al. 2017 (arXiv 1609.04836) report small-batch runs converge to flat minimizers and generalize better, attributing it to gradient noise; Dinh et al. 2017 (arXiv 1703.04933) argue "most notions of flatness are problematic for deep models and can not be directly applied to explain generalization." Reword: "Keskar et al. (2017) found small batches tend to land in flatter minima that generalized better, though whether flatness explains generalization is debated."

### Figure 1 (landscape)

- [x] "A 2D loss surface with multiple minima" (`347`) : Computed. 4 minima (m1.mjs).
- [x] "Each walker follows the negative gradient from its starting point" (`347`) : Computed. lr 0.05 central-difference gradient; all 961 grid starts stop within 300 steps and within 0.1 of a minimum.
- [x] "viridis: bright = low, dark = high" (`347`) : Computed. Domain [vMax, vMin] on interpolateViridis; screenshot shows yellow at the global minimum.
- [x] Alt text "one global minimum and three local minima" (`653`) : Computed. m1.mjs.

### Figure 2 (learning rates)

- [ ] Panel labels "Too small / Just right / Too large" and alt text "the second settles in the minimum, the third overshoots" (`363`, `834`) : WRONG at defaults. After the run (fig-lr.png) all three dots sit on the same point. "Too large" 0.95 converges fastest. Also the curve has two minima: global at x=-0.287 (L 1.945) and local at x=1.154 (L 2.27); all three defaults settle in the shallower local one while the deeper one is visible on screen, and "the minimum" is never qualified. Medium rates 0.537 to 0.653 reach the global one.
- [?] Alt text "the first creeps" (`834`) : Partially. It creeps during the animation but ends 0.05 from the minimum, visually indistinguishable at rest.

### Figure 3 (optimizers)

- [x] "SGD, momentum and Adam on the same elongated valley" (`437`) : Computed. Rosenbrock-like, b=8, plus a Gaussian bump at (-1.5, 1); minimum (1,1), f=3e-6.
- [ ] Implicit race story (prose `404`-`413`) : see zigzag / oscillation entries above. Also Adam's default path leaves the plot through the top edge (y>4) and is drawn over the margin (fig-opt-race.png), and the SGD path is hidden under Adam's because both end at about (1.796, 3.25).

### Figure 4 (mini-batch)

- [x] "walker takes fifty steps" (`479`) : Computed. maxSteps 50.
- [x] "each on a fresh random mini-batch" (`479`) : Computed, with a caveat: at batch 64 of N=64 every "mini-batch" is the full dataset, so the run is plain full-batch GD.
- [x] "shading deepens as the loss rises" (`479`) : Computed. Light mode: white to blue; dark mode: dark to lighter blue (fig-batch-dark.png), still reads as deepening.
- [ ] "the green dot is the optimum" / legend "True minimum" / label "true minimum" (`479`, `475`) : WRONG. Marker is at the generating parameters (0.7, 1.2); sample OLS optimum is (0.654611, 1.191189), gradient at the marker (0.484, 0.010). Already AUDIT finding 4.
- [x] "At batch size 1 it zigzags" (`479`) : Computed. Default page run: 31 sharp turns in 50 steps (fig-batch.png).
- [ ] "at 64 it heads almost straight for the minimum" (`480`) : WRONG as worded. The batch-64 path is an L-shaped curve (straightness 0.868): it runs right along w first, then down in b, and stops at (0.664, 1.666), 0.47 from the marker, having not reached it (slow Hessian eigenvalue 2.0, contraction 0.964 per step, 0.16 of the error left after 50 steps). Reword "follows a smooth curve toward the minimum" and extend steps or raise lr if it should arrive.
- [ ] Readout "Final distance to minimum" as evidence for the batch-size story : WRONG signal. Mean over 200 runs: 0.508 at batch 1, 0.467 at 64. The readout barely moves because neither run converges; it is dominated by the unconverged bias coordinate, not noise.
- [?] Data is simulated (y = 0.7x + 1.2 + uniform noise, N=64, seed 42) but no caption says so (`479`) : Unlabeled. Already in AUDIT editorial debt. Add "simulated data".

### Anti-slop pass

- Em dashes: none in the file (grep for U+2014 and &mdash;).
- No KPI cards, metric grids, status badges, callout boxes, or gradient banners (grep for callout/box-shadow/badge/pill/linear-gradient: none). The two readouts ("6 walkers", "Final distance to minimum") are one-line readouts, allowed.
- Headings "Learning Rate: Step Size Matters", "Beyond Vanilla: Momentum and Adaptive Methods", "Stochastic: Learning from Samples" use the colon-subtitle template. Plain headings would read less generic.
- `350`-`352` "The gradient points in the direction of steepest ascent. Gradient descent goes the opposite way." restates the update-rule caption; filler after Figure 1. Cut or fold into the intro.
- Figure 3 caption says nothing to notice ("SGD, momentum and Adam on the same elongated valley"). Editorial rule: captions say what to notice.
- `484`-`486` closing paragraph states contested research as fact (see flat minima entry); otherwise no grand summary.
- Palette: accent #2563eb blue plus model role #8b5cf6 violet is the generic blue-and-purple pair; series-wide choice from the index, flagged only.
- Role colors misapplied: parameters (model role) are drawn in loss red in Fig 2 and Fig 4, Fig 4's loss contours use the data blue, and Fig 3 colors SGD with the loss red and Adam with the target green. PROMPT.md calls the five role colors the series' shared language.
- Simulated data unlabeled in Fig 4 (above).

## 02 Backpropagation

File: docs/algorithms-ml/02-backpropagation.html. Checked 2026-09-25. Scripts in this scratchpad: small.mjs (2-3-1 net, finite differences), xor.cjs (Figure 3 training), deep.cjs + run.cjs + run2.cjs (Figure 4, original vs corrected), fd.cjs (deep-net finite-difference check), br.mjs / br2.mjs (Chromium, 1200px and 390px). render-check.mjs: PASS, no console errors.

Note on attributions: the essay names no historical sources (no Rumelhart/Hinton/Williams 1986, Linnainmaa, Werbos, or Minsky-Papert). The only citation is He et al. 2015. Nothing historical to verify; the absence is an editorial choice, not an error.

### Prose and equations

- [x] Network is two inputs, three hidden nodes, one output (`242`) : Computed. createNetwork/forward at 385-412 build 2-3-1.
- [x] Sigmoid output lies between 0 and 1 (`242`) : Derived.
- [x] Forward equation a = sigma(Wx + b) (`244`, KaTeX at 1156) : Derived; matches forward() at 401.
- [x] Loss is zero at match and grows with the gap; L = (a - y)^2 (`270`, `272`, KaTeX 1159) : Derived; matches loss() at 448 and dLoss = 2(a - y) at 416.
- [x] Chain rule dL/dW = dL/da * da/dz * dz/dW (`282`) : Derived (correct for the output layer, which is what it denotes).
- [x] For a sigmoid node the local gradient is the slope sigma(z)(1 - sigma(z)) (`280`, `326`) : Derived.
- [x] Backprop gradients of the 2-3-1 net are correct (`278`-`298`, Figure 2) : Computed. Central finite differences on all 13 parameters at inputs (0.6, 0.4), target 0.85: max abs error 3.7e-11.
- [x] Update W <- W - eta dL/dW; "each one shifts against it, in proportion to its size" (`302`, `304`) : Derived; matches updateWeights at 437.
- [x] XOR is a 2D pattern no single straight line can separate (`309`) : Derived. w2+b>0 and w1+b>0 give w1+w2+2b>0; with b<0 from (0,0) this forces w1+w2+b>0, contradicting (1,1) -> 0.
- [x] sigma'(z) is 0.25 at z = 0, its maximum (`326`) : Derived.
- [x] "ten layers at a quarter each is about one millionth" (`326`) : Derived. 0.25^10 = 9.5e-7.
- [x] "With weights of ordinary size, each factor is around a quarter" (`326`) : Computed. Figure 4 at scale 1, depth 10 shows x3.84 shrink per layer (seed 7); seed sweep 1..30 median x4.06, range 3.78-4.45.
- [x] Figure 4 setup: 16-unit layers, random weights, batch of 64 random inputs, random targets, log scale (`328`) : Computed from layerGradients at 1216.
- [ ] "computes a squared-error loss against random targets, and backpropagates" (`328`) : WRONG as implemented. Line 1235 draws a fresh target per component of the backward signal, so the backward pass is not the gradient of any single squared-error loss. fd.cjs: FD error 3.5e-2 against a gradient of max size 3.4e-2 (original), 8.8e-11 (one target per example). This is AUDIT finding 1.
- [ ] "The plot shows the typical size of the loss gradient for each layer's weights" (`328`) : WRONG in detail. Line 1244 is RMS over per-example gradient entries, not the RMS of the batch-loss gradient. Say "typical size of a single example's gradient" or accumulate the batch gradient. AUDIT finding 1 second half.
- [x] Sigmoid at scale 1: gradient falls roughly x4 per layer, first layer several orders of magnitude below last (`343`) : Computed. Shipped figure: ratio 1.8e5, x3.84/layer. Corrected (one target per example): ratio 4.6e5, x4.26. Corrected batch-gradient RMS: 5.3e5, x4.33. Holds under all three.
- [x] Raising the scale pushes sums onto the flat part and the readout's average slope drops (`343`) : Computed. Average slope 0.24 (s=0.5), 0.23 (1), 0.19 (2), 0.12 (4), 0.07 (8).
- [ ] "Near scale 8 the two effects roughly cancel and the gradient stops shrinking from layer to layer" (`343`) : WRONG (overstated; true only for the default seed). Default seed 7, depth 10: shipped x1.06/layer (ratio 1.71), corrected x1.14 (ratio 3.2). Seeds 1..30 at depth 10: median x1.21, range 0.96-1.50, both shipped and corrected; corrected batch-gradient median x1.34. At depth 20, seed 7: shipped ratio 51, corrected 21, corrected-batch 72. Reword: "near scale 8 the shrink drops from about 4x to about 1.2x per layer". Also note 8 is the slider maximum.
- [x] "by then most units sit close to 0 or 1" (`343`) : Computed. Scale 8, depth 10: 59% of sigmoid activations are below 0.05 or above 0.95 (57% at depth 20). Not visible in the figure; consider adding it to the readout.
- [x] ReLU has slope exactly 1 wherever a unit is active (`343`) : Derived; fp at 1221. Readout "average slope 0.47" is the active fraction.
- [x] He et al. 2015 proposed weight std sqrt(2/n) for ReLU; the page's scale sqrt(2) with std scale/sqrt(16) equals sqrt(2/16) (`343`, `340`) : Sourced. He, Zhang, Ren, Sun, "Delving Deep into Rectifiers", arXiv 1502.01852, Sec. 2.2: "a zero-mean Gaussian distribution whose standard deviation (std) is sqrt(2/n_l)". Link target correct.
- [ ] "with the weight scale near sqrt(2) ... its gradients stay at a similar size from the last layer to the first" (`343`) : WRONG by implication. True at sqrt(2) (x1.04/layer), but the figure shows the same flat ReLU profile at every scale: seed 7 depth 10 ratio 1.37 at s=0.5, 1.0 and 1.41, 2.88 at s=8; seed-sweep median x0.99-1.02 at s=1, 1.41, 8. With no biases, ReLU nets are positively homogeneous, so the layer-to-layer ratio of weight gradients is scale-independent. What sqrt(2) controls in this figure is the absolute size: first-layer RMS 1e-5 at s=0.5, 0.1 at s=1.41, 1e12 at s=8 (depth 10). Reword to say the flat profile holds at any scale here and He scaling keeps the overall size from vanishing or exploding with depth. See new finding N1.
- [x] "one of the reasons deep networks moved from sigmoid to ReLU hidden units" (`343`) : Sourced (hedged). Glorot, Bordes, Bengio, "Deep Sparse Rectifier Neural Networks", AISTATS 2011 (proceedings.mlr.press/v15/glorot11a): rectifier nets train deep supervised networks without pretraining. Consider citing it; the claim is hedged enough to keep.
- [?] "A neural network starts with random weights and produces nonsense" (`237`) : Unverifiable as stated (a random net produces arbitrary but not meaningless outputs). Loose; reword "produces outputs unrelated to the task" or keep as colloquial.

### Figure 1 (forward pass)

- [x] Caption: edge width = weight magnitude, color = sign (blue positive, red negative), node shading = activation (`264`) : Computed in drawNetwork 557-567. At the default state (step 1) edges are gray and hidden/output nodes unshaded, so the caption describes steps 2 to 5, not the load state. Minor.
- [x] Three panels follow h2 and the output (`264`) : Computed; panels are titled "Weighted sum into h2", "Sigmoid at h2", "Prediction vs target".
- [x] Readouts at default inputs (0.60, 0.40): h2 contributions 0.42, 0.14, 0.05, sum 0.61, activation 0.65; prediction 0.52; target 0.85; loss 0.108 : Computed. Node script matches Chromium text exactly; (0.5216 - 0.85)^2 = 0.1078.
- [x] Step 2 text: blue bars push the sum up, red pull it down (`STEPS`, 522) : Computed; bar fill by sign at 603.
- [x] Step 3 text: sums far from zero land near 0 or 1, near zero around 0.5 : Derived.
- [x] Step 5 text: squared error penalizes large mistakes more than small ones : Derived.
- [x] Alt text (aria-labels at 578, 657-659) report the same values as the figure : Computed in Chromium.

### Figure 2 (backward pass)

- [x] Edge labels are dL/dw for each weight: output weights -0.082, -0.106, -0.073; input weights 0.001, 0.001, 0.011, 0.007, -0.019, -0.012 : Computed; FD-verified (above).
- [x] "dL/dy = -0.657" : Computed as 2(a - target). Correct as the derivative with respect to the output activation, but conflicts with the equation's notation where y is the target (new finding N2).
- [x] Hidden-node labels "grad 0.002 / 0.019 / -0.031" : Computed; these are dL/dz (pre-activation), not dL/dh (which is 0.009, 0.082, -0.125). Unlabeled which one (N3).
- [x] h2 slope 0.23 : Computed; 0.6476 * 0.3524 = 0.228.
- [x] Mean |gradient| output layer 0.0868, hidden layer 0.0086 : Computed.
- [x] Caption: red pulses carry gradients from output back toward inputs (`295`) : Computed (grad-color #dc2626, animated target->source). Under reduced motion no pulses are drawn; labels only.
- [?] Legend "Larger magnitudes mean more responsibility for the error" (870) : Unverifiable as phrased. |dL/dw| is sensitivity, not blame for the current error (a weight can be large-gradient because its input is large). Reword "Larger magnitudes mean the loss is more sensitive to that weight".

### Figure 3 (XOR training)

- [x] Up to 200 epochs (`321`) : Computed; loop stops at epoch 200.
- [x] Default run learns XOR : Computed. lr 3.02 (label "3.0"): loss 0.2520 at epoch 1, 0.0025 at 200; outputs 0.024, 0.954, 0.951, 0.070. Chromium shows "Epoch: 200 | Loss: 0.0025". At the slider minimum (lr 0.10) loss stays 0.2496 and nothing is learned in 200 epochs; no prose claims otherwise.
- [x] Blue where output near 1, red near 0 (`321`) : Computed; d3.interpolateRdYlBu over [0,1] (red at 0, blue at 1); screenshot agrees.
- [x] Left/Center/Right panel order (`321`) : Computed at 1200px. At 390px the three panels stack vertically (prior debt, confirmed).
- [x] "Online SGD, one sample at a time", seeded shuffle : Computed (code only, not a reader claim).

### Figure 4 (deep-network gradients)

- [x] Caption: std = scale/sqrt(16) (`340`) : Computed, line 1224.
- [x] Caption: layer 1 next to the input through the last hidden layer, one batch (`340`) : Computed.
- [ ] Caption: "Root-mean-square gradient of the loss with respect to each layer's weights" (`340`) : WRONG in detail, same as `328` above (per-example RMS, wrong backward signal).
- [x] Caption: gray line is the other activation with the same settings (`340`) : Computed; dashed var(--text-2), same seed/depth/scale.
- [x] Readout at default: "1.8e+5 (about x3.84 per layer). Average slope 0.23" : Computed in node and Chromium.
- [x] Slider maps 0..40 to scale 0.5..8, default 1.0 : Computed (0.5 * 16^(10/40) = 1.0; value 15 -> 1.41).

### Anti-slop pass

- Em dashes in reader-visible text: none (grep of the file; the only "--" hits are CSS variables and the placeholders in N8).
- KPI cards, metric grids, status badges, colored callouts: none. Figure 2's two "Mean |gradient|" readouts are inline text under the figure, acceptable.
- Grand summary: the closing "This is one of the reasons deep networks moved from sigmoid to ReLU hidden units" is hedged and specific; no Takeaways section. Acceptable.
- Generic AI phrasing / filler: light. "produces nonsense" (`237`) and "more responsibility for the error" (870) are the two loose spots. Headings are plain.
- Simulated data labeling: Figure 4 says "random weights", "random inputs", "random targets" in prose (`328`); XOR is an exact pattern. No named datasets. Fine.
- Fonts and palette: Source stack via vendor. Accent #2563eb plus model purple #8b5cf6 is close to the "default blue and purple" tell, but it is the series-wide role palette; not flagged for this essay alone.

## 03 Attention and the series index

Audited 2026-09-25. No files under docs/ were edited.

Tools used this session:
- `attn.mjs` (scratchpad): pulls `makeAttnModel` out of the page (lines 476-623) and runs the page's own training loop (400 Adam steps, batch 16, lr 0.03, seed-driven) in node for seeds 1 through 12. It logs every training sentence, so it can count how many of the 300 evaluation sentences were already seen in training.
- `gradcheck.mjs` (scratchpad): central finite differences against the page's backprop gradients on 51 random parameters, all parameter blocks. Largest relative error 1.2e-5, so the gradients are correct.
- `pw.mjs`, `pw2.mjs`, `pwi.mjs` (scratchpad): headless Chromium at 1200px and 390px with reduced motion. Reads every figure's text and readouts at default state, soft mode, slider at step 0, and after one Retrain.
- `render-check.mjs`: PASS for both pages. No console errors.
- Primary sources read this session: Vaswani et al. 2017 (ar5iv HTML of arXiv 1706.03762), Clark et al. 2019 (ar5iv HTML of arXiv 1906.04341, full text grepped), Bahdanau, Cho and Bengio 2014 (arXiv abstract 1409.0473).

Tally: 03 has 45 claims (39 verified, 1 wrong, 5 unverifiable or needing a reword). The index has 17 claims (12 verified, 2 wrong, 3 unverifiable or needing a reword). Total: 51 verified, 3 wrong, 8 unverifiable or reword.

### 03 Attention

Opening and lookup (Figure 1)
- [x] "sat" needs who sat (the cat) and where (the mat) (`300`) : Derived. This is an illustration, not a checkable fact. Fine as written.
- [x] Earlier sequence models compressed the sentence into one fixed-size vector, which lost information in long sentences (`302`) : Sourced. Bahdanau et al. 2014 conjecture that the fixed-length vector is a bottleneck, and cite Cho et al. 2014 for performance falling as sentences get longer. The page gives no citation. Recommend linking Bahdanau et al. 2014 here. It would also help to say that attention was first added on top of these sequence models, before transformers dropped the recurrence. As written, "look at every word at once" describes self-attention.
- [x] Hard lookup vs soft lookup framing: a weighted blend of values (`307`, `309`) : Derived. The code computes exactly that.
- [x] Match score = shared letter pairs with word boundaries, and weights = softmax of the scores (`317`) : Computed. The scores are cat 4, car 2, cap 2, cup 1, coat 3. Softmax gives 59/8/8/3/22 %, and the browser shows those same numbers in soft mode. The code comment's "^c, ca, at, t$" is correct.
- [x] Hard mode: only the exact match passes (`317`, aria at `678`) : Computed. The browser shows 100% on cat and no other weights.
- [x] "hover over keys to see the scores" (`317`) : Computed. The hover tooltip shows the letter-pair count and weight. It is pointer-only (prior finding 12).
- [x] Figure 1 aria-label (query on the left, five keys, line widths show weights) (`678`) : Computed. Matches the SVG.

Q, K, V
- [x] Q, K, V each come from multiplying the input by a learned W_Q, W_K, W_V (`323`, eq-qkv) : Sourced plus Computed. Vaswani eq. for head_i uses QW_i^Q and so on. `proj()` in the page does the same.
- [x] Every word plays all three roles (`327`) : Derived. q, k, v are computed for every position.
- [x] One attention layer with two heads; Q/K/V have 6 numbers each (`329`) : Computed. H=2, d=6.
- [x] The input vector marks which word it is and where it sits (`329`) : Computed. It is a token one-hot concatenated with a position one-hot (P=8).
- [x] Toy grammar example "the old dog slept under a box" is generable (`329`) : Computed. DET ADJ N1 VERB PREP DET N2 is in the grammar.
- [x] Optional adjective in each half, so no word always sits at the same position (`329`) : Computed. Every vocabulary word has at least two possible positions. The first determiner slot is always position 0, but no single word is tied to it.
- [x] Readout targets: det/adj name their noun, the verb names its subject, a preposition names its noun, each noun names the verb; plus the previous word (`329`) : Computed. `parse()` matches exactly (N1 and N2 both map to vi, V maps to n1, P maps to n2). The first word's "previous" target is itself, and the prose at `399` acknowledges that.
- [x] Nobody writes down an attention pattern; W_Q, W_K, W_V and the readout start random and are trained by backprop for 400 steps (`329`) : Computed. No attention weights are hardcoded. Init is Gaussian with scale 0.3, TRAIN_STEPS=400, and training uses Adam. The finite-difference check passes (max relative error 1.2e-5). Mean loss over the last 20 steps falls from about 2.3 to about 0.0006 on all 12 seeds.
- [x] Figure 2 shows the first head of the trained model on "The cat sat on the mat" (`338`) : Computed. `initFig2` reads `run.final.heads[0]`.
- [x] The two ends of each color scale are positive and negative entries (`338`) : Computed. The diverging scale has domain [m, -m].
- [?] "The bars show the softmax of that query's dot product with every key, scaled by √6" (`338`) : Computed that the bars are softmax(q.k/√6), and the bar title says "/ √6". "Scaled by √6" reads as multiplied. Reword to "divided by √6".
- [x] Figure 2 readout at default ("sat" query): cat 99%, sum 1.0000 : Computed in browser.

Scaling and softmax
- [x] Attention(Q,K,V) = softmax(QK^T / √d_k) V (eq-attn) : Sourced. Vaswani et al. 2017, Eq. 1. The page never names the paper. Recommend citing it here.
- [?] Rationale: dot products grow with dimension, large inputs make softmax peaked so one word gets nearly all the weight, so divide by √d_k (`344`, `374`) : Sourced, partly. Vaswani's footnote says that if the components are independent with mean 0 and variance 1, q.k has variance d_k. The paper's stated reason is that softmax is pushed "into regions where it has extremely small gradients", and it hedges with "We suspect". The page is right about the peaking but leaves out the gradient reason, which is what the paper actually gives. Recommend: "their spread grows like √d_k ... pushes softmax into near one-hot rows where its gradients are tiny (Vaswani et al., 2017)".
- [x] Softmax rows sum to 1 and multiply V to give each word's output (`344`, `378`) : Computed. The code does this. The Σ readouts show 1.0000.
- [x] Step 1 "Larger numbers mean the query and key point in more similar directions" (`370`) : Derived. This is roughly true for a dot product, which also scales with length. Acceptable.
- [x] Figure 3 caption: first head, three stages, buttons or scrolling, click a row (`364`) : Computed. The stage buttons, the IntersectionObserver on the steps, and the row click all work.
- [x] Slider replays weights saved every 20 steps, from the random start to the end (`364`) : Computed. There are 21 snapshots (steps 0, 20, ..., 400) and slider max = 20.
- [x] At the left end, with random W_Q/W_K, the weights in each row are spread over several words with no pattern (`383`) : Computed. At step 0 the head 1 weights range from 12 to 22% (uniform would be 16.7%). The max weight per row is 0.18 to 0.28 across 12 seeds.
- [x] As training proceeds, most rows concentrate on one word (`383`) : Computed. At seed 1, step 400, the row maxima are 0.93 to 0.99.
- [x] In this head it is usually the row's target: "sat" goes to cat, and "on" and the second "the" go to mat (`383`) : Computed in node and browser. The head 1 argmax per row is The, sat, cat, mat, mat, sat, so 5 of 6 rows land on the attached word.
- [x] The readout can only name "cat" from the output at "sat" if cat's value vector is mixed in (`383`) : Derived. There is no residual connection, so z_i is only a mix of value vectors, and only cat's token one-hot carries "cat". The claim holds for the two heads together. One head is enough.

Multi-head (Figure 4)
- [x] Two heads, each with its own W_Q, W_K, W_V; nothing assigns heads to questions (`388`) : Computed.
- [?] "Both heads feed one shared readout" (`388`) : Computed. There are two linear readouts (U[0] and U[1], one per question), and each reads the concatenation of both heads. Reword: "Both heads feed both readouts".
- [x] Full-size transformers have more heads; outputs are concatenated and projected back to model dimension (`388`) : Sourced. Vaswani: MultiHead = Concat(head_1..head_h) W^O, h = 8.
- [x] Figure 4 caption: the text counts argmax rows on the attached and previous word, and gives accuracy on fresh sentences (`396`) : Computed. `describe()` and `accuracy(300)` do this. The browser shows "head 1 ... 5 of 6 rows and ... 2; head 2: 2 and 5 ... 100% ... 100%".
- [?] "accuracy on fresh sentences" / "On 300 fresh sentences" (`396`, readout at `1257`) : Computed. The sentences are newly sampled, but the grammar only has 5,184 sentences. Training draws 6,400 samples (about 3,100 unique), and 221 to 239 of the 300 evaluation sentences (74 to 80%) appeared word for word in training, on all 12 seeds. Accuracy is 100/100 on every seed, so the unseen subset is also 100%. Recommend filtering out training sentences and saying "sentences it never saw", or stating the overlap. "Fresh" alone suggests a held-out test.
- [x] "Retraining runs the same 400 steps from a different random start" (`396`) : Computed. Seeds go 2, 3, .... The seed also changes the training sentences, since one RNG drives both. That is acceptable, but "a different random start and different training sentences" would be more exact.
- [x] First run: head 1 mostly fetches the attached word, head 2 mostly the previous word (`399`) : Computed in node and browser, seed 1. Head 1 is 5/6 attached and head 2 is 5/6 previous.
- [x] Exception at the first "The": head 1 looks at itself, head 2 fetches "cat" (`399`) : Computed. The head 1 row 0 argmax is "The" (98%) and the head 2 row 0 argmax is "cat".
- [x] Retraining: some runs swap roles, and in others a head spreads across both questions or looks at words that answer neither, and the readout still recovers both (`399`) : Computed over seeds 1 to 12. Seeds 1 and 2 give the default split. Seeds 3 and 8 swap cleanly, and seed 5 mostly swaps. Seeds 4, 6, 7, 9, 10, 11 and 12 are mixed; for example, seed 4 head 2 has only 1 attached and 2 previous, with the other rows on neither. Accuracy is 100% on every seed. The head roles depend on the seed, and the prose is hedged correctly. Note: the first Retrain click is seed 2, which reproduces the seed 1 split exactly, so a reader needs a second click to see anything different.

Closing
- [x] The model was told what to predict and nothing about where to look (`404`) : Computed.
- [x] Real transformers are trained on next-word or masked-word prediction with many layers of many heads (`404`) : Sourced. Clark et al. 2019 describe BERT's masked language modelling and 144 heads (base model).
- [ ] Clark and colleagues (2019) found heads "where verbs attend to their direct objects and nouns to their determiners" (`404`) : WRONG direction. Clark et al. 2019, section 4: "for all relations in Table 1 except pobj, the dependent attends to the head word rather than the other way around", and "in head 8-10 direct objects attend to their verbs". So in BERT, direct objects attend to their verbs and determiners attend to their nouns. Fix: "heads where direct objects attend to their verbs and determiners to their nouns". This also matches the toy, where determiners name their noun.
- [x] Clark et al. 2019 found heads attending to the previous or next token (`404`) : Sourced. Section 3.1: four heads put more than 50% of their attention on the previous token and five on the next token.
- [x] Many other heads have no such clean reading (`404`) : Sourced. Clark reports broad bag-of-vectors heads, heavy attention to [SEP] used as a "no-op", and "no single attention head that does well at syntax overall".
- [x] Link https://arxiv.org/abs/1906.04341 is the right paper (`404`) : Sourced. "What Does BERT Look At?", Clark, Khandelwal, Levy, Manning, 2019.
- [?] Role colors in the equations: Q and K rendered in the data color, and V and the whole softmax(...)V in the prediction color (`447-456`) : Unverifiable as a role mapping, and it contradicts the index. The index lists W_Q, W_K, W_V as model (purple) and "tokens" as data. Q and K are learned projections, not data, and V is not a prediction. See new finding N1.

### Index

- [x] "Six interactive explanations" (`162`) : Computed. The browser shows 6 cards and 6 article files exist. The homepage entry count is 6 (`docs/index.html:242`).
- [x] Five roles, in order data, model, prediction, loss, target, with a feedback arc from loss to model (`167`, header viz) : Computed. The header SVG has those labels. The arc runs from the loss node to the model node.
- [x] data: "Raw values flowing into the algorithm" (`203-205`) : Derived. This is a reasonable definition.
- [x] model: "What the algorithm is learning, the adjustable part" (`213-215`) : Derived.
- [x] prediction: "What the model outputs when given data" (`223-225`) : Derived.
- [x] loss: "The error signal, how wrong the prediction was, and the direction to fix it" (`233-235`) : Derived. Examples checked: 04 has a reconstruction error term and 06 has a "TD error" in the loss color.
- [ ] target: examples include "prior in Bayes" (`245`) : WRONG, as in the prior audit. A prior is a modelling assumption, not ground truth. Recommend moving "prior" to model, or listing "observed data / likelihood" instead.
- [ ] "Figures and equations across the series use these five colors" (`167-171`) : WRONG for 03. Article 03 has zero `.t-*` role terms. Its figures use a separate Q blue / K red / V green palette (keys in the loss red, values in the target green), and its equation colors do not follow the index vocabulary (N1). Articles 01, 02, 04, 05 and 06 do use the role classes (6 to 13 each).
- [x] "The first three build on each other ... attention layer trained that way in the page" (`175-177`) : Computed. 03 trains by backprop in the page.
- [x] "Decision trees have their own series" link (`178`) : Computed. `docs/decision-trees/` exists.
- [?] "PCA applied to gene expression data, next to t-SNE, is in the bioinformatics series" (`179`) : Computed that bioinformatics/07 has PCA and t-SNE. That page says its data is synthetic, so "gene expression data" overstates it. Reword: "simulated expression data".
- [x] Card 01 blurb "Contour landscapes, learning rate explorer, optimizer race" (`261`) : Computed. All three exist. It leaves out the mini-batch section, which is acceptable.
- [x] Card 02 blurb "XOR network trained live, why gradients vanish through stacked sigmoid layers" (`266`) : Computed. The sections exist. The figure behind "why gradients vanish" has the prior P1 bug (AUDIT 1), so recheck the blurb once that is fixed.
- [x] Card 03 blurb "two-head attention layer trained in your browser, and the patterns its heads learn" (`271`) : Computed.
- [?] Card 04 blurb "Draggable projection axes, variance as information" (`276`) : Partly checked. The draggable axis exists. "Variance as information" is vague and the scree/keep-k figure is not mentioned. Recommend "a draggable projection axis, components computed step by step, and a scree plot".
- [?] Card 05 blurb "Area models, sequential updates, and prior sensitivity" (`281`) : Checked, and the sections exist, but the blurb leaves out the Bayesian-vs-frequentist section. That is fine, but consider adding it.
- [x] Card 06 blurb "why the policy it learns differs from the way it behaves while exploring" (`286`) : Computed. 06 line 338 explains off-policy Q-learning in exactly those terms.

### Caption vs figure (default state, headless Chromium, 1200 and 390 px)

- Figure 1: the caption matches in both modes (hard 100% on cat; soft 59/8/8/3/22). There is no mismatch. The phone clipping is the prior finding.
- Figure 2: the caption matches. By default the "sat" query puts 99% on "cat", so the bar chart backs up the prose at `383`.
- Figure 3: at step 400 the rows are The>The 98%, cat>sat 98%, sat>cat 99%, on>mat 98%, the>mat 97%, mat>sat 93%, as the prose says. At step 0 the rows are 12 to 22%, also as the prose says. There is one tension (N3): Step 2's text says scaling prevents near-one-hot rows, but the Softmax stage directly after it shows rows at 93 to 99% by default.
- Figure 4: the readout and the prose at `399` match (5/2 and 2/5, 100%/100%). After one Retrain (seed 2) the readout is identical to seed 1.
- The aria-labels for Figures 1 to 4 match what is drawn.

### Anti-slop pass

03:
- There are no em or en dashes in reader-visible text (grep and innerText checked). The box-drawing characters appear only in code comments.
- There are no KPI cards, metric grids, status badges or colored callouts. The Σ readouts are one-line readouts under the figures, which the skill allows.
- There is no grand summary. The closing section ends on a sourced, hedged sentence. Good.
- Filler: "The interesting part is how the model learns those weights." (`302`) is a mild throat-clear. It could be cut, or folded into the next section.
- Subtitle "How transformers decide which words matter for understanding each other word" (`297`) is a little clumsy but not generic.
- Style: "neighbour" (`388`) uses British spelling on an otherwise American page. This is trivial.

Index:
- There are no em or en dashes in visible text (innerText checked).
- The vocabulary block is a legend with swatches, not a metric grid. That is acceptable.
- Card blurbs use sentence fragments ("Contour landscapes, learning rate explorer, optimizer race."). This is acceptable for cards. "Variance as information" (04) is the vaguest line on the page.
- The header viz labels the red node "loss", while the prose names it "error signal". This is a minor inconsistency.
- `index.html` defines thumbnails for articles that do not exist (convolution, embeddings, Markov, trees, kNN, k-means, around lines 390-560). This dead code is not reader-visible.

## 04 PCA

File: docs/algorithms-ml/04-pca.html. Checked 2026-09-25. Node script: scratchpad/pca04.mjs (reruns the page's seeded generators, then diagonalizes the sample covariance with Jacobi). Browser checks: scratchpad/b.mjs, c.mjs, d.mjs, e.mjs (Chromium, file://, 1200px and 390px). render-check: PASS, no console errors.

The essay has no dates or named attributions (no Pearson 1901, no Hotelling 1933, no Cattell for the scree plot). The only sourced material is in the "Where PCA Is Used" paragraph.

Computed values (1/n covariance, as the page uses):
- Fig 1/2 (seed 12345, n=50): cov [[6.0812, 3.5349], [3.5349, 3.0828]], corr 0.816. Eigenvalues 8.4217, 0.7423 (91.9% / 8.1%). PC1 at 33.5 deg. Default axis 45 deg captures 88.6% (readout 89%).
- Fig 3 (seed 99999, n=100): eigenvalues 7.1234, 1.2346, 0.0744 (84.5 / 14.6 / 0.9%). Page power iteration + deflation matches Jacobi to 4 dp, vectors orthogonal. The code comment "roughly 5, 2, 0.3" is wrong but not reader visible.
- Fig 3 reconstruction error (summed over 100 points) equals exactly 100 x dropped variance for every toggle combination: no PC3 7.44, PC1 only 130.89, no PC2 123.46, no PC1 712.34, PC2 only 719.78, PC3 only 835.80.
- Fig 4 (seed 77777, N=120), for finding 2: sample eigenvalues (1/n) 5.5521, 3.2251, 0.7765, 0.4110, 0.2751, 0.1360, 0.0923, 0.0556, total 10.5237. With 1/(n-1): 5.5988, 3.2522, 0.7830, 0.4145, 0.2775, 0.1371, 0.0930, 0.0561. Share %: 52.8, 30.6, 7.4, 3.9, 2.6, 1.3, 0.9, 0.5. Cumulative: 52.8, 83.4, 90.8, 94.7, 97.3, 98.6, 99.5, 100. The page shows presets 52/31/7/4/3/2/1/1 and cumulative 52/83/90/94/97/98/99/100. Rounded, the bar labels differ at PC1 (53 vs 52) and PC6 (1 vs 2). Cumulative differs at k=1 (53 vs 52), k=3 (91 vs 90), k=4 (95 vs 94) and k=6 (99 vs 98). Consecutive ratios l_k/l_(k+1): 1.72, 4.15, 1.89, 1.49, 2.02, 1.47, 1.66. The largest gap is between PC2 and PC3. Reconstruction error with true sample PCs, summed: k=1 596.59, 2 209.58, 3 116.40, 4 67.08, 5 34.06, 6 17.75, 7 6.67, equal to N x dropped eigenvalues. Projecting onto the generating basis (what the page does) gives slightly larger errors: 598.48, 214.41, 118.79, 69.12, 35.46, 18.65, 7.36. The generating axes are close to the sample PCs (|cos| 0.96 to 0.998), so the fix changes the numbers only slightly and leaves the elbow where it is.

### Ledger

- [x] "Figure 1 shows 50 correlated points in an elliptical cloud" (`250`) : Computed. n=50, correlation 0.816.
- [x] Rotating the axis changes the projected spread (`250`, `258`) : Computed. 66% at 0 deg, 89% at 45 deg (default), 34% at 90 deg.
- [x] Aligned with the long direction the variance peaks, perpendicular it bottoms out (`258`) : Computed + browser. Keyboard-rotated to 33 deg the readout shows 92% (the analytic max is 91.9% at 33.5 deg), and at the perpendicular it shows 8%.
- [x] "The direction of maximum variance is the first principal component" (`258`) : Derived (Rayleigh quotient). Fig 2's PC1 comes from the same covariance.
- [x] Fig 1 caption: the projected points and histogram update as you drag (`255`) : Browser. They do, with one caveat: the histogram bins only [-6, 6], so at the default 45 deg 3 of 50 projected points fall outside and are silently left out (2 at PC1). See new finding N3.
- [x] Covariance is Sigma = (1/n) X^T X on centered data (`eq-cov`, `262`) : Derived. It matches the code (1/n, data centered first). The prose says "centers the data" first, so centered X is implied.
- [x] Sigma v_i = lambda_i v_i. The direction does not rotate, it only scales by the variance along it (`266`, `eq-eig`) : Derived. v^T Sigma v = lambda for unit v. Numerically, Fig 3 power-iteration values equal the Jacobi eigenvalues, and the Fig 1 projected variance at PC1 equals lambda1.
- [x] "Its eigenvectors point along the directions of maximum and minimum variance, and its eigenvalues give the variance along each" (`262`) : Derived. True as stated for the extremes. In d > 2 the middle eigenvectors are saddle directions, which "along each" covers.
- [x] The new axes are uncorrelated (`279`) : Derived. This holds for true eigenvectors. Fig 4's generating axes are not uncorrelated (cov 0.11927), so the figure currently contradicts this sentence (finding 2).
- [?] "the first few carry most of the variance, and the rest can be dropped" (`279`) : Unverifiable as a general claim, because it depends on the data. Hedge it: "in data like this, the first few...".
- [?] "Keeping only the axes with the most variance reduces the dimension without losing much" (`246`) : Unverifiable in general. Hedge it: "often without losing much", or tie it to the intro's conditional.
- [x] z = W^T x and E = ||x - W W^T x||^2 (`eq-proj`, `eq-recon`, `283`) : Derived. W has orthonormal columns and x is centered. This is per point, while the Fig 3 readout sums over points. Consistent with line 311's "sum of squared distances".
- [x] Remove PC3, the data collapses to a plane and loses little (`289`) : Computed + browser. Kept 99%, error 7.4 (0.9% of variance).
- [x] Remove PC2 as well, it collapses to a line and the error is substantial (`289`) : Computed + browser. Kept 84%, error 130.9. The screenshot shows a line.
- [x] "a 3D dataset shaped like a flattened ellipsoid" (`289`) : Computed. Standard deviations 2.67, 1.11, 0.27.
- [x] Reconstruction error (sum of squared distances) is proportional to the total variance of the dropped components (`311`) : Computed. Error = n x dropped eigenvalue sum, exactly, for all 7 Fig 3 toggle states and all k in Fig 4 with sample PCs. This meets the PROMPT.md requirement. The prose could name the constant (the number of points).
- [x] Fig 3 readouts "Variance kept" and "Recon. error" (`302-307`) : Browser. 100%/0.0, 99%/7.4, 84%/130.9, matching node.
- [x] Scree plot: "steep drop followed by a leveling off", elbow as a common cut (`315`) : Derived/common practice. Hedged with "tend to" and "common". Acceptable. The originator (Cattell 1966) is not named, so there is no attribution to check.
- [ ] Fig 4 bars and cumulative line are "each component's variance" (`330`) : WRONG. They are the preset generating values [5, 3, 0.7, ...], not the sample's. The sample values are listed above (finding 2).
- [ ] "Variance explained" readout (`325`) : WRONG at k = 1, 3, 4, 6 by 1 point (52/90/94/98 shown, sample 53/91/95/99). Same root cause.
- [x] "Here the elbow is around 2 to 3 components" (`330`) : Computed. On both preset and sample eigenvalues the biggest drop is PC2 to PC3 (ratio 4.15; 3.23 to 0.78). The bend sits at PC3, so keeping 2 is right. The wording holds after the fix too.
- [ ] "the data below is projected into that many dimensions" (`330`) : WRONG for k >= 3. Only the first 3 coordinates are drawn (finding 8).
- [x] "Some practitioners instead keep enough components to explain 90% or 95%" (`333`) : Sourced, loosely. The scikit-learn PCA docs (read this session) implement "select the number of components such that the amount of variance ... is greater than the percentage specified". I could not open a primary source for the specific 90/95 cutoffs: Jolliffe & Cadima 2016 returned 403/captcha. Acceptable as a hedged "some practitioners".
- [x] "others use cross-validation to see whether more components improve predictions" (`333`) : Sourced at the bibliographic level. Wold 1978, Technometrics 20:397-405, "Cross-validatory estimation of the number of components..." (title and venue confirmed this session, full text not read). "Predictions" here means predictions of held-out entries. Fine.
- [x] "Noisy data slopes gradually, while data with clear low-dimensional structure drops sharply" (`333`) : Derived. Qualitative and consistent with Fig 4.
- [ ] "the first principal component of a ring of points passes straight through the center, missing the ring entirely" (`335`) : WRONG. For a centered ring the covariance is isotropic (lambda1 = lambda2), so PC1 is not even defined, and any line through the center crosses the ring at two points rather than missing it. Reword: "a ring has equal variance in every direction, so PCA has no preferred axis, and projecting onto any line folds opposite sides of the ring onto each other."
- [?] "It does not find clusters, categories" (`335`) : Unverifiable as stated, and it conflicts with line 339 ("components that separate cell types"). Reword: "it is not designed to find clusters, though it separates them when they differ along high-variance directions."
- [x] Gene expression "with 20,000 dimensions" (`339`) : Sourced. GENCODE stats page (read this session): release 50 lists 19,442 protein-coding genes. "About 20,000" is fine.
- [?] "collapse to a handful of components that separate cell types" (`339`) : Unverifiable as written. The linked bioinformatics essay (line 184) says pipelines use the top 30 to 50 PCs. Reword "a handful" to "a few dozen".
- [ ] Linked essay "runs PCA next to t-SNE on simulated cells, including a case where PCA's variance ranking picks the wrong directions" (`339`) : WRONG in detail. In docs/bioinformatics/07-dimensionality-reduction.html, PCA sits next to t-SNE only in Figure 2, which uses two moons plus noise dimensions, not simulated cells. Figure 1 (cells) is t-SNE only. The "wrong directions" case is real (line 182, noise ~0.9). Reword: "runs PCA next to t-SNE on synthetic data".
- [ ] "Image datasets with millions of pixels have principal components that look like eigenfaces" (`339`) : WRONG framing. Eigenfaces are by definition the PCs of face image sets (Sirovich & Kirby 1987, Turk & Pentland 1991; checked this session only via secondary sources, since the primary PDF was unreadable). Other image datasets do not give eigenfaces, and the classic sets were small images (the Turk & Pentland example is 256x256 = 65,536 pixels, per search snippet only). Reword: "Principal components of a set of face photos look like ghostly faces, the 'eigenfaces' used in early face recognition."
- [x] "Financial returns across hundreds of stocks compress to a few market factors" (`339`) : Sourced. Plerou et al., arXiv cond-mat/0108023 abstract (read this session): 422 to 1000 US stocks, "the largest eigenvalue corresponds to an influence common to all stocks", and a few deviating eigenvectors map to business sectors. Laloux et al. 1999 abstract (read) supports the "most eigenvalues are noise" part.
- [x] Fig 2 caption: order of mean, center, PC1, PC2, and bars on the right showing eigenvalues (`275`) : Browser. The stages play in that order. The bars show 92% / 8%, which are eigenvalue shares (8.42, 0.74). Accurate enough, though the bars are labeled with percentages rather than eigenvalues.
- [ ] Fig 2 caption "PC2 perpendicular to it" (`275`) : WRONG as drawn. In data space the vectors are orthogonal, but unequal x/y pixel scales put the on-screen angle at 103.6 deg at 1200px and 50 deg at 390px (new finding N1).
- [ ] Fig 3 alt text "with its principal axes" (`fig3 aria-label`, line ~1084) : WRONG. No axes are drawn: the SVG holds only points and 100 error lines, with no text (new finding N2).
- [x] Fig 1 alt text (draggable axis, projections, histogram, arrow keys) : Browser. Accurate. Left/Right rotate by 3 deg.
- [x] Fig 4 alt text : Accurate apart from the preset-spectrum issue (finding 2).
- [x] Closing "PCA keeps what varies most. Whether what varies most is what matters is a separate question." (`341`) : True, but see anti-slop.

Counts: 26 verified, 8 wrong, 5 unverifiable (reword).

### Captions vs figures (default state, 1200px)

- Fig 1: default axis at 45 deg, readout 89%, histogram present. Accurate. The cloud is anisotropically stretched (plot 460x350 px for the same 12-unit domain), so on screen the axis sits at 40.2 deg and the drop lines at 139.8 deg, 99.6 deg apart rather than 90. Finding 7 reproduced at desktop too, not only on phones.
- Fig 2: the default before autoplay is raw points only. After autoplay the caption is accurate apart from "perpendicular" (N1). At 390px the scatter gets about 64px of width, and the PC1/PC2 labels overlap on top of the cloud (screenshot fig2-390.png) (N1).
- Fig 3: the default (all on) shows no ghost points or error lines, and the caption does not say what the red lines and gray ghosts mean. The caption should name them (editorial).
- Fig 4: the default k=2 shows bar labels 52/31/7/4/3/2/1/1 and readout 83%. The elbow claim holds visually.

### Anti-slop pass

- Em dashes in visible text: none (only in JS comments).
- KPI cards, metric grids, badges, callouts: none. Fig 3's "Variance kept / Recon. error" readouts sit inline in the control bar. Acceptable.
- Grand summary: line 341, "PCA keeps what varies most. Whether what varies most is what matters is a separate question." is a closing aphorism and kicker. It is borderline. The previous paragraph already makes the point via the bioinformatics link. Recommend cutting, or folding it into line 335.
- Filler / generic phrasing: "The scree plot is a starting point for that judgment." (`333`) adds nothing, cut it. "and you just found it by hand" (`258`) is mild but fine. "PCA automates the dragging" (`262`) is good.
- Universal claims to hedge: lines 246 and 279 (see ledger).
- Captions restating prose: the Fig 2 caption repeats the prose steps. Fig 3's caption says nothing to notice.
- Simulated data: no caption says the data is simulated (already in AUDIT editorial debt). Reproduced: none of the four captions says so.

## 05 Bayes' theorem

File: docs/algorithms-ml/05-bayes-theorem.html (not edited). Scripts: scratchpad/calc05.mjs (closed-form recomputation), fns.js (page's own beta functions), pw05.mjs (headless Chromium at 1200px and 390px). render-check: PASS. No console errors at either width.

Note: the essay makes no historical attributions (no Bayes, Price 1763, Laplace, dates, names or quotes), so there are none to source.

Prose and equations

- [x] "95% accurate test ... tempting to conclude 95% chance" (`244`) : Derived. Framing only; consistent with the 95/95 example that follows.
- [x] 1% prevalence, 95% sensitivity, 95% specificity gives posterior "about 16%" (`248`) : Computed. 0.0095 / (0.0095 + 0.0495) = 0.16102. Browser readout at default: 16.1%.
- [x] The sensitivity and specificity glosses (`248`) : Derived. Both definitions are correct.
- [x] "four rectangles: true positives, false negatives, false positives and true negatives" (`250`) : Computed. Code draws exactly those four boxes (`505-510`).
- [x] "At the default settings, most of the highlighted area belongs to healthy people" (`272`) : Computed. Joint mass is FP 4.95% against TP 0.95%. At 1200px the rendered areas are 603.9x13.4 px against 6.1x254.6 px (about 5.2:1).
- [x] "even an accurate test produces more false positives than true positives when a condition is rare" (`272`) : Derived. True whenever prev*sens < (1-prev)(1-spec). For 95/95 that holds when prevalence is below 5%, so it is true for this test but conditional in general. Acceptable.
- [x] "At 10% prevalence the same test gives a posterior above 67%" (`272`) : Computed. 0.095 / 0.140 = 0.67857. Browser readout: 67.9%.
- [x] Bayes' theorem P(H|E) = P(E|H) P(H) / P(E) (`1193`, shown at `278`) : Derived. Correct. Colors: posterior=prediction, likelihood=model, prior=target, evidence=data, matching the prose spans at `280`.
- [x] Word glosses of posterior, likelihood, prior, evidence (`280`) : Derived. Correct. (Calling the prior a "target" is AUDIT's index item, not repeated here.)
- [x] "The denominator P(positive) accounts for all the ways you could test positive ... drags the posterior down when the base rate is low" (`282`) : Derived. Correct. Small notation slip: the displayed equation says P(E), the prose says P(positive).
- [x] "the posterior after one flip becomes the prior for the next" (`286`) : Derived. Beta-Bernoulli conjugacy; code increments alpha/beta per flip (`610`).
- [x] Uniform prior = Beta(1,1), "every bias from 0 to 1 is equally plausible" (`286`, `604`, `635`) : Derived. Correct. (But the plotted curve is forced to 0 at x=0 and x=1, AUDIT 5.)
- [?] "After 5 flips you have a rough idea; after 50 the distribution is tight" (`301`) : Computed but vague. 3H/2T gives sd 0.175 (61% of the prior's 0.289, per the browser readout); 30H/20T gives sd 0.067, 95% half-width about 0.13. "Tight" is a stretch for plus or minus 0.13. Recommend stating the numbers ("after 50 flips the posterior sd is about 0.07"). Also Figure 2 has only single-flip buttons, so reaching 50 takes 50 clicks.
- [ ] "The belief moves toward certainty gradually, in proportion to the evidence" (`301`) : WRONG. The posterior sd shrinks like 1/sqrt(n) (sd^2 = ab/((a+b)^2(a+b+1))), so width falls with the square root of the evidence, not in proportion to it. Reword: "the width shrinks roughly as one over the square root of the number of flips".
- [x] Three priors: uniform, skeptical (the coin is probably fair), credulous (probably biased toward heads) (`305`) : Computed. Code: Beta(1,1) mean 0.5, Beta(20,20) mean 0.5, Beta(14,6) mean 0.7 (`786-790`).
- [?] "With few observations the three estimates differ; with enough, they converge" (`320`) : Computed. Asymptotically true, but the skeptical prior carries 40 pseudo-counts. Expected means at true bias 0.6: n=20 gives 0.591/0.533/0.650 (spread 0.117, from 0.200 at n=0); n=100 gives 0.598/0.571/0.617; n=1000 gives 0.600/0.596/0.602. The figure's one action (Auto-flip 20) leaves a clearly visible spread; visible convergence needs about 10 clicks and about 40 s. Recommend saying how many flips it takes, or adding a larger auto-flip.
- [?] "The frequentist tradition, dominant in much of classical statistics" (`324`) : Unverifiable as stated but low stakes; framing. Leave it, or drop "dominant in much of classical statistics".
- [x] "the frequentist view on the left ... the Bayesian view on the right" (`324`) : Computed at 1200px (freq x=275, bayes x=608). At 390px the panels stack (freq above bayes, same x). This falls under AUDIT's general left/right-on-phones item.
- [ ] Frequentist view "gives a point estimate with a 95% confidence interval" (`324`, and the drawn label "95% CI" at `1082`) : WRONG in part. The interval is a Wald interval, which does not have 95% coverage at small n. Exact coverage at p=0.6: n=1 gives 0.000, n=5 gives 0.835, n=10 gives 0.899, n=20 gives 0.928, n=50 gives 0.941 (Wilson: 1.000, 0.990, 0.982, 0.963, 0.941). NIST e-Handbook 7.2.4.1 (read this session) recommends Wilson or exact intervals over the Wald formula. Name the method, or switch to Wilson (this is AUDIT 3).
- [x] "Both narrow with more data and converge on the truth" (`324`) : Computed. At 150 flips, 88H: p-hat 0.587, CI [0.508, 0.665], posterior mean 0.586, around the true 0.60.
- [?] "the probability that the bias is between 0.55 and 0.65 is 73%" (`324`) : Unverifiable as written (no data or prior stated; AUDIT editorial item). Computed: with a uniform prior, 69 heads in 115 flips gives P(0.55 < p < 0.65) = 0.730 (100 of 60 gives 0.697; 120 of 72 gives 0.741). Recommend "for example, after 69 heads in 115 flips, a uniform prior gives 73% probability that the bias is between 0.55 and 0.65", or label it illustrative.
- [x] "which a confidence interval does not [support]" (`324`) : Sourced. NIST e-Handbook 7.1.4: the 95% refers to intervals across repeated sampling, not to probability for one realized interval.
- [ ] Frequentist question: "If I repeated this experiment many times, what range would contain the true value 95% of the time?" (`351`) : WRONG (the gloss PROMPT.md flags). It implies one fixed range that contains the fixed parameter 95% of the time. The correct reading (NIST e-Handbook 7.1.4, read this session): "if the same population is sampled on numerous occasions and interval estimates are made on each occasion, the resulting intervals would bracket the true population parameter in approximately 95% of the cases." Suggested rewrite: "The frequentist asks, 'What procedure gives intervals that, over many repeats of this experiment, contain the true value 95% of the time?'"
- [x] Bayesian question and "treats probability as a description of what you know, which is why it can be updated flip by flip" (`351`) : Derived. Correct.
- [?] "For a single decision under uncertainty, the Bayesian answer is often more directly useful" (`351`) : Unverifiable opinion, hedged with "often". Acceptable as the author's view; could cut, since it closes the article on a verdict.

Captions, readouts, alt text

- [x] Fig 1 caption: "Each rectangle's area is proportional to the joint probability" (`269`) : Computed. Width = prevalence, height = conditional rate (`491-500`).
- [x] Fig 1 caption: "the highlighted regions are everyone who tested positive" (`269`) : Computed. The dashed red outline is on TP and FP only (`540`). At default the two regions are a 6px (1200) or 2.8px (390) sliver and a 13px (5px at 390) strip. Neither gets an in-box label (labels need w>40, h>24); the only in-box label drawn is "True −". It is true but hard to see; see new finding P3-a.
- [x] Fig 1 readout: TP 0.95%, FP 4.95%, 16.1% (`573-577`) : Computed, matches closed form. The wording "only" is wrong at high posteriors: new finding P3-b.
- [x] Fig 1 alt text (`458`) : Computed. Matches the drawing.
- [x] Fig 2 caption: "Top: belief distribution (a beta distribution). Bottom: the posterior mean ... as observations accumulate" (`298`) : Computed. The bottom chart is empty at default (0 paths) and fills on the first flip. Acceptable.
- [x] Fig 2 readout: uniform sd 0.289; "Width has shrunk to X% of the uniform prior" (`636-644`) : Computed. sqrt(1/12) = 0.2887. After 3H/2T the browser shows 61% (0.175/0.289 = 0.606).
- [x] Fig 2 alt texts (`661`, `724`) : Computed. The mean is drawn as a dashed line (`702-707`).
- [x] Fig 3 caption "Three priors, same evidence." (`317`) : Computed.
- [?] Fig 3 convergence reference line "true = 0.6" (`935-939`) : Computed only for Auto-flip. Manual Heads/Tails clicks are not drawn from 0.6, yet the line still claims the truth is 0.6. Recommend labeling it "auto-flip bias = 0.6" or showing it only after auto flips.
- [ ] Fig 3 alt text "The three posterior means converging as observations accumulate" (`910`) : WRONG at default. The chart has no lines until the first flip (0 paths measured) and shows a 0.117 spread after the one Auto-flip 20. Reword: "The three posterior means after each flip, against the true bias."
- [x] Fig 4 caption "The same flips analyzed both ways, with the true bias set by the slider" (`348`) : Computed. The slider sets the sampling bias (`977`), but moving it keeps old flips (AUDIT 6).
- [x] Fig 4 readout P(bias in [mean-0.05, mean+0.05]) (`1160-1167`) : Computed. Beta(89,63) gives 0.7894 on the page against 0.7897 exact; Beta(1,2) gives 0.1337 against 0.1333 exact. Displayed bounds are rounded to 2 decimals (e.g. "[0.54, 0.64]" for a computed [0.536, 0.636]): new finding P3-c.
- [ ] Fig 4 Bayesian alt text "with its mean and 95% credible interval" (`1094`) : WRONG. No credible interval is drawn or computed anywhere (the only texts are the axis label and "mean = x"). Draw the 2.5%/97.5% beta quantiles, which would also give the side-by-side comparison the prose implies, or drop the phrase.
- [?] Fig 4 frequentist alt text "Frequentist estimate after each flip with its 95% confidence interval" (`1011`) : Partly wrong. Only the current estimate is drawn, not a history "after each flip". Reword: "the current estimate and its interval".

Counts: 27 verified, 6 wrong, 8 unverifiable or needing a reword.

### Anti-slop pass

(line by line, 235-356 plus all JS-generated text)
- Em dashes: none in reader-visible text (grep for U+2014, U+2013 and &mdash; is empty). The box labels "False −"/"True −" use U+2212 minus, which is fine.
- KPI cards, metric grids, stat tiles, status badges, colored callouts: none. Readouts are one-line prose with bold numbers; `.posterior-highlight` is inline accent text. Fine.
- Grand summary: the final paragraph (`351`) ends on a verdict ("often more directly useful"). It is mild and hedged; consider cutting the last sentence so the article ends when the comparison is made.
- Generic AI phrasing and filler: `272` "The test is the same; only the population is different." is a restating flourish; it could be cut. `301` "The belief moves toward certainty gradually" is filler and also wrong (see above). `320` "The prior matters when data is scarce and less as evidence accumulates." restates the previous sentence; it could be cut. Nothing else found.
- Design: moonshine type stack and vendored assets are in use; the tails button uses a red "neg" style, which is fine. No gradients, glows or emoji.

## 06 Reinforcement learning

File: docs/algorithms-ml/06-reinforcement-learning.html. Checked 2026-09-25.
Tools: node sim with the page's grid, RNG and Q-learning code copied verbatim (scratchpad `rl-sim.mjs`, `fig4rep.mjs`); Playwright/Chromium at 1200px, 390px and with reduced motion on (`pw.mjs`, screenshots `fig3.png`, `fig4-*.png`); render-check PASS, no console errors. Sources read this session: Sutton and Barto, *Reinforcement Learning: An Introduction*, 2nd ed. (2018/2020 PDF, incompleteideas.net), Sections 6.4 and 6.5; Mnih et al., "Human-level control through deep reinforcement learning", Nature 518, 529 (2015), DeepMind PDF.

Not present in the essay, so nothing to check: Watkins 1989, TD-Gammon, AlphaGo, Atari game counts, chess/Go state-space numbers, an explicit Bellman equation. The "tables do not scale" section gives only the 196-entry count. The word "off-policy" never appears (PROMPT asks for it; see P3 below).

### Grid world and rewards

- [x] Grid is 7x7 (`277`, `391`) : Computed. ROWS = COLS = 7; 49 rects rendered.
- [x] Blue is start, green is goal, red cells are pits (`277`) : Computed. Rendered fills: 1 light blue (#93c5fd) at (0,0), 1 green (#86efac) at (6,6), 2 pink/red (#fca5a5) at (2,3), (4,2).
- [x] Goal +10, pits -10 (`277`, cell labels) : Computed. REWARD_GOAL = 10, REWARD_PIT = -10.
- [ ] "Every step costs -1" (`277`; "every step costs a small amount" `259`) : WRONG as stated. The terminal step returns +10 or -10 instead of -1 (getReward, `416`). Walking the 12-step route in Fig 1 in the browser gives total -1 (11 x -1 + 10), not -2. Say "every non-terminal step costs -1; the step into the goal or a pit earns +10 or -10 instead". Already in AUDIT editorial.
- [ ] Fig 1 alt text: "pits in red and walls in gray" (`391`) : WRONG. There are no walls. Gray cells are ordinary empty cells; the only blocking is the grid boundary. Replace "walls in gray" with "empty cells in gray".
- [x] Shortest safe path from start to goal is 12 steps (`301`, `338`) : Computed. BFS avoiding pits = 12 = Manhattan distance. 349 of the 924 monotone 12-step paths avoid both pits.
- [ ] "the best path balances directness ... against safety (avoiding pits)" (`280`) : WRONG for this grid. Moves are deterministic and 349 shortest paths avoid both pits, so there is no trade-off: the shortest path is already safe. Reword to "finding a short route that avoids the pits", or save the trade-off for the cliff-walking paragraph where it is real.
- [x] Fig 1 lets you move with arrow keys or the buttons "above" (`277`) : Computed. The arrow pad is above the caption. Arrow keys work only when a slider is not meant to have them (AUDIT 9).

### Q-learning update and epsilon-greedy

- [x] Q-learning update Q(s,a) <- Q(s,a) + alpha[r + gamma max_a' Q(s',a') - Q(s,a)] (`288`, KaTeX `1269`) : Sourced. Matches Sutton and Barto eq. 6.8; the code at `708`, `726`, `821`, `1052` implements it, with Q(terminal) left at 0 as S&B require.
- [x] Bracket labeled "TD error" (`1271`) : Sourced. S&B use TD error for this bracket (Section 6.1/6.5).
- [x] Q-values initialized to zero (`284`) : Computed. makeQTable.
- [x] alpha is the step size, gamma discounts future reward (`290`) : Sourced. S&B 6.5. Page values alpha 0.2, gamma 0.9 (not stated in prose; fine).
- [x] "Q-value for being in cell (3,2) and moving right" (`284`) : Illustrative example, no claim to check.
- [x] epsilon-greedy: with probability epsilon a random action, otherwise argmax (`310`, KaTeX `1277`) : Computed. Code `704`, `818`: the random draw can pick the greedy action too, which matches the formula as written.
- [x] "with epsilon = 0.5, half the moves are random" (`338`) : Computed. True of the code; the non-greedy share is 0.5 x 3/4 = 37.5%. Fine as written.

### Figure 2

- [x] Each cell shows four triangles, one per action; green high, red low, gray unknown (`301`) : Computed. 184 polygons (46 non-terminal cells x 4); qColor returns gray for exactly 0, interpolates to green for >0 and red for <0.
- [x] Arrows mark the current best action (`301`) : Computed. Drawn only when max Q is not 0; at default no arrows (0 lines), consistent with "unknown".
- [ ] "Steps last ep falls toward the optimal 12 as the policy converges" (`301`) : WRONG as a description of the readout. With fixed epsilon 0.15 (seed 42), episodes 900-1000 average 12.2 steps but only 30% are exactly 12; the readout ranges 5 to 18 (browser samples after 5000 episodes: 12, 18, 8, 16, 7, 5, 14...). Short values are pit falls. P(no non-greedy move in 12 steps) = (1 - 0.15 x 0.75)^12 = 0.24. The greedy route does converge to 12 (greedyPath at 1000 = 12). Reword: "the greedy route settles at 12 steps; individual episodes still vary because 15% of moves stay random." Already in AUDIT editorial.
- [x] "The green triangles spread backward from the goal, one episode at a time" (`304`) : Computed, with a caveat. Value propagates backward along visited paths. But the greenness stops about halfway: under the optimal policy V*(d) = -10 + 20 x 0.9^(d-1), positive only within about 7 steps of the goal; V*(start) = -3.72. Cells in the top-left end up red. Not wrong, but a reader will see a red top-left half and could be told why.
- [?] "cells near pits develop low ones" (`290`) : Partly true. In Fig 2 the triangle pointing into a pit goes red; the cell's other triangles do not. Reword to "actions that lead into pits develop low ones".

### Figure 3 and exploration (200-seed node run, page code, A eps 0.1 / B eps 0.5)

- [x] "Run both agents for a few hundred episodes. On this grid, both greedy paths settle at 12 steps" (`338`) : Computed. Greedy path = 12 steps in 200/200 seeds for both agents at 200, 300 and 500 episodes. At 100 episodes only 42.5% (A) and 42% (B); at 50 episodes 3% and 8%, the rest "loops". Median first episode with a 12-step greedy path: 54 (A), 56 (B). Page default seeds (101/202): both "loops" at ep 100, both 12 at ep 200; browser at ep 1200: both "12 steps". Extremes eps 0.01 vs 0.9 at 300 episodes: both 200/200. No agent "settles for" a worse route, consistent with PROMPT.
- [x] "the agent with the larger epsilon keeps collecting less reward per episode" (`338`) : Computed. Mean reward per episode over the last 50 of 300: A -3.17, B -14.63. Cumulative over 300: A -2698, B -5829. Browser chart at ep 1200: blue (A) line sits above amber (B).
- [x] "some of them walk into a pit" (`338`) : Computed. Pit falls per 300-episode run: A 31.5, B 128.5.
- [x] The update uses max over next actions regardless of the action taken; Q-values estimate what the greedy policy earns; random moves only decide which pairs get updated (`338`) : Sourced. S&B 6.5: "the learned action-value function, Q, directly approximates q*, ... independent of the policy being followed. The policy still has an effect in that it determines which state-action pairs are visited and updated."
- [?] "Too much exploitation locks it onto the first decent route and it misses shorter ones" (`308`) : True in general (S&B ch. 2) but not on this grid: eps = 0.01 finds the 12-step route in 200/200 seeds. The reason is that zero initial Q-values are optimistic against -1 step costs, so untried actions look better than tried ones and the agent explores systematically. Either hedge ("can lock it onto") and add one sentence on why low epsilon still works here, or leave as general.
- [x] "Greedy path follows each agent's current best action from the start, with no random moves" (`335`) : Computed. greedyPath `967`.
- [x] Chart shows reward per episode (`335`) : Computed; it is a 10-episode moving average, labeled "Reward (smoothed)" on the axis. Chart is empty at default until 2 episodes exist.
- [x] SARSA replaces the max with the Q-value of the action actually taken next (`340`) : Sourced. S&B eq. 6.7, Section 6.4.
- [x] Cliff walking is Example 6.6 in Sutton and Barto; SARSA learns a longer route away from the edge, Q-learning learns the edge route and falls in during training (`340`) : Sourced. S&B 2nd ed. Example 6.6 "Cliff Walking": "Q-learning learns values for the optimal policy, that which travels right along the edge of the cliff. Unfortunately, this results in its occasionally falling off the cliff because of the epsilon-greedy action selection", Sarsa takes "the longer but safer path", eps = 0.1. The page's "row of pits" paraphrases the cliff region (in S&B it sends the agent back to start rather than ending the episode); acceptable. Link resolves to the book page.

### Figure 4 and policy

- [x] Arrow opacity encodes gap between best and second-best Q (`344`) : Computed. opacity = min(0.3 + 0.15 gap, 1), `1163`.
- [x] Heatmap shows each cell's max Q (`344`) : Computed. `1123`.
- [x] Learn (200 episodes) gives greedy path length 12, total reward -1 (readouts `357-358`) : Computed. Node: path (0,0)->...->(6,6), 12 steps, total -1. Browser: "12", "-1". 20 successive Learn clicks (the RNG is not reset) all give 12; 200/200 seeds with this setup give 12.
- [ ] "labeling the reward at each step" (`361`) : WRONG. Labels are the running total (-1, -2, ..., -11, then -1 at the goal), not the per-step reward (-1 ... -1, +10). Say "labeling the running total at each step", or label per-step rewards.
- [ ] "Value ... drops sharply near pits" (`364`) and "dark cells far or dangerous" (`344`) : WRONG. The heatmap plots max Q, which ignores the pit-facing action, so pit neighbours are not low: under V* they are identical to any cell at the same distance from the goal (e.g. (3,3) 1.81, (2,4) 1.81). In the learned seed-303 table, pit neighbours read 1.76, 1.81, 0.02, -0.04, 0.75, -0.43, -2.57, -2.45; the two dark ones are no darker than far, rarely visited cells such as (0,5) -2.03 or (6,0) -2.11. What the heatmap shows is distance from the goal plus under-exploration off the main route. Reword to "Value radiates outward from the goal and fades with distance; the pits show up in the arrows, which steer around them, not in the values of their neighbours."
- [x] "The policy is then walk uphill" (`364`) : Derived. With deterministic moves the greedy action moves to the neighbour of highest value. Fine.

### Beyond the table

- [x] Q-table has 49 x 4 = 196 entries (`368`) : Derived. (Only 46 x 4 = 184 are ever updated; the 3 terminal cells stay 0. Fine as written.)
- [x] Each entry updated only when that cell-action pair is taken (`368`) : Computed. Tabular update touches Q[r][c][a] only.
- [x] DQN, Mnih et al. 2015, Nature (`368`) : Sourced. doi:10.1038/nature14236, Nature 518, 529 (26 Feb 2015); link resolves.
- [x] Network maps a state to one Q-value per action (`368`) : Sourced. "a separate output unit for each possible action, and only the state representation is an input". Input is the last 4 preprocessed frames; "a game screen" is a fair simplification.
- [x] Trained toward r + gamma max Q(s',a') (`368`) : Sourced. Paper eq. 1 loss uses r + gamma max_a' Q(s',a'; theta_i^-).
- [x] Generalization causes instability; the target moves with the network (`368`) : Sourced. Methods: "an update that increases Q(s_t,a_t) often also increases Q(s_t+1,a) for all a and hence also increases the target y_j, possibly leading to oscillations".
- [x] Replay buffer of past transitions (`368`) : Sourced. "experience replay ... randomizes over the data".
- [?] "a separate, slowly updated copy of the network" (`368`) : Essentially right but imprecise. The paper clones the network "every C updates" and holds it fixed between ("only periodically updated"). "Slowly updated" now usually means soft (Polyak) updates from later work. Reword to "a separate copy of the network, refreshed only every few thousand updates".

Totals: 43 claims. Verified 34 (x), wrong 6, imprecise or not shown by this grid, reword 3 (?).

### Anti-slop pass

(line by line, `255`-`368` plus visible figure text)
- Em dashes: none in reader-visible text. En dashes appear only as empty-readout placeholders (`298`, `326`, `330`, `357`, `358`, JS `–`); fine. The "──" in JS comments is not visible.
- KPI cards, metric grids, status badges, colored callouts: none. `.stats-row` readouts are single lines of text under controls, allowed. Fig 1's bold colored "Goal reached!" / "Fell in pit!" (`549`) is close to a status pill with an exclamation mark; optional P3 to make it plain text ("Reached the goal." / "Fell in a pit.").
- Grand summary: none; the essay ends on the DQN paragraph.
- Generic AI phrasing and filler: light. "a tax on indecision" (`259`) is a small flourish; "Reinforcement learning works the same way" (`255`) is fine. No "delve", "crucial", "powerful", no restating conclusions.
- Palette: blue #2563eb plus purple #8b5cf6 is the series role palette (data/model), a series-level choice, not specific to this essay.

