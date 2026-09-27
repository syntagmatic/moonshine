# Decision Trees

I want six chapters on one of the oldest and most useful models in machine learning, for technically literate readers who know basic probability and ML vocabulary. A single tree is a flowchart of yes-or-no questions and is easy to read. Practical tree models combine hundreds or thousands of them, which predicts better and is much harder to read. The series builds both, with figures where the reader drags thresholds and adds trees by hand.

Two moves recur throughout and hold it together. The first is the split: at each node, pick the question that separates the data best, which means trees care about rankings and ignore distances. The second is the ensemble: one tree is unstable and many are stable, whether averaged (bagging, random forests) or added so each corrects the last (boosting). The last two chapters recover what the ensemble costs in readability and then turn the same machinery toward a causal question: where does an intervention change the outcome.

## Articles

### 1. The Single Tree
How a tree scores a split, and why growing one greedily works until it doesn't. The reader drags a split line through a strip of points and switches between Gini, entropy and misclassification, watching each impurity curve and the gain update, including a preset that shows why misclassification error is the wrong score. A second figure grows a tree level by level with the decision regions linked to the tree diagram, then puts greedy growth on XOR next to the best depth-2 tree found by exhaustive search. Regression trees and their staircase fits appear along the way.

### 2. Geometry and Pruning
Trees cut the plane with axis-aligned lines, which makes them blind to monotone rescaling and weak on diagonals. In one combined figure the reader rotates the true boundary from vertical through 45 degrees to horizontal, toggles oblique splits, applies monotone transforms to an axis and sees the same points land in the same leaves, and sweeps the cost-complexity pruning parameter while training and test error trace out the overfitting curve.

### 3. Voting Ensembles
Averaging trees cancels their jitter, down to a floor set by how correlated they are. The reader first simulates the variance of an average of correlated predictors against the textbook formula as the number of predictors and the correlation change. Then a forest of faint individual trees and their thick average responds to the number of trees and features per split, showing how random forests and Extra-Trees buy lower correlation. It also covers why bagged trees should be grown deep and where forests shine.

### 4. Boosting
Boosting trains trees one at a time, each fit to the residuals of the ensemble so far. The reader adds trees by hand on a 1D regression problem, seeing the prediction close in on the true function beside the residuals and a preview of the next tree, with controls for learning rate, leaves per tree, and level-wise versus leaf-wise growth. Push the learning rate to 1 with many leaves and test error climbs after the first tree. It frames boosting as gradient descent in function space with any differentiable loss and briefly describes the design choices of modern implementations.

### 5. Reading the Forest
Two ways to read a model of a thousand trees. First, split-based feature importance, and the ID-column trap: the reader raises the sample size and watches a meaningless unique identifier win under raw information gain and collapse under gain ratio. Second, Shapley values, which split one prediction among its features; the reader walks a single prediction from a baseline to its value as a waterfall of feature contributions that always sum exactly. It names TreeSHAP and ends on what SHAP does not tell you.

### 6. Causal Trees
Trees that look for where a treatment changes the outcome, as opposed to where the outcome is high. On a promo-code example the reader toggles the tree between predicting purchase and maximizing uplift and sees it find different regions. Then 200 simulated studies show the double-dipping problem: a leaf's effect estimated on the data that chose it is badly biased with poor interval coverage, while honest estimation on a held-out half is close to unbiased.

## What to get right

- Everything is simulated from seeded synthetic data, and the figures must actually compute what the captions say: the greedy-versus-best depth-2 comparison, the correlated-variance check, the honest-estimation bias and coverage. Pick a representative default sample, never a lucky one.
- The Shapley figure is exact Shapley values by subset enumeration on a small hand-written model with a stated baseline. If it is not TreeSHAP on a trained forest, the caption must say so.
- Causal trees reward heterogeneity of effects across leaves, with a penalty for noisy leaves; they do not maximize within-leaf variance. They also work beyond randomized experiments under unconfoundedness (generalized random forests), so do not claim randomization is required.
- Extra-Trees' default feature count is the same as a random forest's, not one; a single random feature is "totally randomized trees". "Boosting beats bagging on tabular data because of bias" is folk wisdom; flag it as such if used. Do not state vendor speedups or benchmark win counts without a source.
- Keep a fixed color language across chapters: the two classes, each impurity measure, the split, truth versus prediction.
