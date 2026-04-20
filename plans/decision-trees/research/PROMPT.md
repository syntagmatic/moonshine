Produce an in-depth research report on decision trees as a mathematical, statistical, and algorithmic object, oriented toward a 12–15 part interactive-explainer series. The audience is technically literate: assume familiarity with basic probability, calculus, and ML vocabulary. Aim for 20–40 pages. For each topic, include (a) the precise mathematical formulation, (b) historical/intellectual origin with primary sources, (c) the geometric or information-theoretic intuition, (d) at least one concrete worked numerical example, (e) known failure modes and misconceptions, and (f) 1–3 ideas for what could be *interactively visualized* (what the user would drag, toggle, or animate to feel the idea).

Cover, as separate sections:

1. **The greedy-split paradigm.** CART (Breiman et al., 1984), ID3 (Quinlan, 1986), C4.5, CHAID. Why greedy and not globally optimal? Hyafil–Rivest 1976 NP-hardness result. Impurity measures: Gini, entropy, misclassification — derive each, compare their shapes on [0,1], explain why Gini and entropy behave similarly and why misclassification is bad for splitting.

2. **Regression trees.** Variance reduction as the splitting criterion. Friedman's MAE variants. Why regression trees produce step functions and what that implies for extrapolation. The relationship to piecewise-constant approximation and to histogram regression.

3. **Geometry of splits.** Axis-aligned partitions as a hyper-rectangle tiling of feature space. Oblique trees (OC1, Murthy et al. 1994). Why axis-aligned is a blessing (interpretability, scale-invariance per-feature) and a curse (can't represent a 45° separator efficiently). Connection to k-d trees.

4. **Overfitting, pruning, stopping.** Cost-complexity pruning (weakest-link). Minimum description length. Reduced-error pruning. Why a fully grown tree on clean data has zero training error and high variance. The bias–variance decomposition specifically for trees.

5. **Bagging and bias–variance.** Breiman 1996. Why averaging uncorrelated trees reduces variance but not bias. The independence assumption and why it's only approximately true. Out-of-bag error as a free cross-validation.

6. **Random forests.** Breiman 2001. The two sources of randomness: bootstrap + feature subsampling. Why √p or p/3 features. Extremely randomized trees (Geurts et al. 2006). Empirical strengths: tabular data, missing values, mixed types.

7. **Boosting as functional gradient descent.** AdaBoost (Freund & Schapire 1997) and the exponential loss view. Friedman's gradient boosting machine (2001) as steepest descent in function space. The loss-function menu (L2, Huber, logistic, Poisson). Why boosting is bias-reducing where bagging is variance-reducing.

8. **Modern GBM implementations.** XGBoost (Chen & Guestrin 2016) — second-order Taylor expansion, regularized objective, sparse-aware splits. LightGBM's histogram-based splitting and leaf-wise growth. CatBoost's ordered boosting and target-encoding trick. Practical tuning intuition (learning rate, tree depth, regularization).

9. **Information-theoretic view.** Mutual information I(Y; X_j > t) and its relationship to information gain. Gain ratio (C4.5's correction for high-cardinality features). The MDL / two-part code view. Connection to decision stumps as weak learners.

10. **Feature importance and interpretation.** Mean decrease in impurity, permutation importance, and their biases (Strobl et al. 2007). SHAP (Lundberg & Lee 2017), TreeSHAP's polynomial-time exact Shapley values for trees. Partial dependence plots and ICE plots. What tree interpretability buys you and where it lies.

11. **Causal and uplift trees.** Athey & Imbens 2016 (causal forests). Rzepakowski & Jaroszewicz uplift splits. The fundamental problem of causal inference mapped onto tree splits. Applications to A/B testing, marketing, medicine.

12. **Soft trees, neural decision trees, and hybrids.** Differentiable trees (Kontschieder et al. 2015 "Deep Neural Decision Forests"). Neural oblivious decision ensembles (NODE). TabNet. Why fully differentiable trees are attractive in theory and how they empirically compare to GBMs on tabular data (the "tabular deep learning vs. GBM" debate — Shwartz-Ziv & Armon 2022, Grinsztajn et al. 2022).

13. **Decision trees as search: MCTS.** Monte Carlo Tree Search (Kocsis & Szepesvári 2006, Coulom). UCT. The rollout/backup loop. AlphaGo's marriage of MCTS with neural value/policy networks. The deep distinction between fitting a tree and searching one.

14. **Oblivious trees and decision diagrams.** Oblivious decision trees (same split at each level of a tree) → what CatBoost uses. Ordered Binary Decision Diagrams (OBDDs) in hardware verification. The connection between tree representation and function representation.

15. **Frontier topics and open problems.** Globally optimal tree learning via MIO (Bertsimas & Dunn 2017). Sparse decision trees with dynamic programming (GOSDT, Hu et al. 2019). Streaming / online trees (Hoeffding trees, Domingos & Hulten 2000). Privacy-preserving trees. Fairness-constrained splits.

For each of the 15 sections, flag which ones would make especially vivid interactive visualizations and describe the proposed interaction briefly (e.g., "drag a decision boundary and watch the impurity function", "animate bagging variance collapse as n_trees grows").

Include at the end:
- A "surprising facts" list: 10–15 non-obvious facts that most ML practitioners don't know (e.g., that Gini and entropy agree on >99% of splits on real data; that extremely randomized trees can outperform random forests on some problems; that TreeSHAP is exact polynomial-time where general SHAP is exponential).
- A "common misconceptions" list (e.g., "random forests don't overfit" — they do, just less; "feature importance tells you causation" — it doesn't).
- A cross-reference table: for each of the 15 topics, which adjacent fields it connects to (information theory, functional analysis, optimization, combinatorics, causal inference, complexity theory).
- A complete bibliography with primary sources and at least one canonical modern textbook treatment (Hastie/Tibshirani/Friedman ESL, Murphy, etc.).

Prioritize *mathematical precision* and *historical accuracy* over breadth. Where a claim is contested or empirical, say so and cite. Where a practitioner rule of thumb exists without theoretical backing, flag that too. Where there are beautiful pictures to be drawn (impurity as a function of class proportion, feature-space partitioning, convergence of bagging variance), describe them carefully enough that they could be rebuilt from the text alone.
