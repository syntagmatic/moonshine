# Algorithms & ML

I want six interactive explanations of the algorithms underneath machine learning, for readers who can follow working code and want intuition they can touch. Every figure should run the actual algorithm in the browser, so what the reader sees is the computation itself.

The through-line is a shared skeleton. Data goes in, a model transforms it, a prediction comes out, an error signal corrects the model, and a target defines what correct means. Those five roles get five fixed colors used in prose, equations and figures across all six pieces, and the series index should teach that vocabulary. The first three articles build on each other: gradient descent, then backpropagation to get gradients through a network, then an attention layer trained that way on the page. The last three stand alone. By the end a reader has trained a small transformer layer in their browser and watched an agent learn a grid world.

## Articles

**Act I: Learning by Gradient**

### 1. How Gradient Descent Finds Minima
How gradient descent uses the local slope to reach a minimum. The reader drops walkers on a 2D loss surface with several minima, then compares learning rates side by side on one curve, races plain SGD, momentum and Adam down an elongated valley, and finally watches mini-batch descent on a real regression loss zigzag at batch size 1 and run nearly straight at 64.

### 2. Backpropagation
How a network computes the gradient of its loss with respect to every weight. The reader steps a small network's forward pass with input sliders, then watches gradient pulses run backward with each weight's gradient labeled, then trains it on XOR while a loss curve, the weights and the decision boundary evolve together. It closes with a measured figure of per-layer gradient size in a deep network, sigmoid against ReLU, with depth and weight scale as controls, showing why deep sigmoid nets stall.

### 3. The Attention Mechanism
How an attention layer weights the other words of a sentence when it computes each word's output. It starts from hard versus soft dictionary lookup, then introduces queries, keys and values, scaling and softmax. The signature piece is a real two-head attention layer trained in the page on a toy grammar where one head should learn to find the word each word attaches to and the other the previous word; the reader scrubs through training snapshots, inspects the learned heatmaps, sees held-out accuracy, and retrains from a new seed. A closing section says plainly what the toy leaves out.

**Act II: Structure and Uncertainty**

### 4. Principal Component Analysis
Variance has a direction, and PCA finds the directions that carry the most. The reader drags a projection axis through a 2D cloud and watches the projected histogram widen and narrow, then sees the components computed step by step, toggles components off a 3D cloud, and uses a scree plot with a keep-k slider that reports variance kept and reconstruction error.

### 5. Bayes' Theorem
Updating beliefs with evidence. It opens on the base-rate trap with an area model where the reader sets base rate, sensitivity and specificity and sees the positive-test region. Then the reader flips coins and watches a beta posterior sharpen, compares three priors fed the same evidence, and sets a true bias to see the same flips read the Bayesian and the frequentist way.

**Act III: Learning from Reward**

### 6. Reinforcement Learning
Learning by trial, error and reward. The reader first walks a small grid world with pits and a goal by hand, then watches tabular Q-learning fill in per-action values until the greedy path reaches the optimum. Two agents with different exploration rates learn side by side, and the learned policy can be traced from start to goal. It ends on why tables do not scale.

## What to get right

- Every figure computes. The attention weights must come from a model actually trained in the page; a hand-designed heatmap presented as learned is the exact failure to avoid. Same for Q-values, gradients and eigenvectors.
- Exploration versus exploitation: with a sensible setup both a low and a high exploration rate usually find the optimal path eventually. The real difference is reward collected while learning. Check any claim about one agent "settling for" a worse route against the simulation, and mention off-policy learning and the cliff-walking contrast with SARSA.
- Deep sigmoid networks: the vanishing-gradient story has an exception at large weight scales, where the per-layer shrink can disappear. Let the gradient figure's own numbers decide what the prose says.
- PCA: reconstruction error is proportional to the variance of the dropped components (scaled by the sample count). Any stated scree elbow must match the generated data. Any Bayesian-vs-frequentist interval example must be computed or labeled illustrative, and the confidence-interval gloss must be the correct one.
- The five role colors are the series' shared language; keep them consistent in every figure, equation and inline term.
