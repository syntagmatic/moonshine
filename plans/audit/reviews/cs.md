# Group "cs" review: algorithms-ml, decision-trees, bioinformatics, type-systems

Scores are S F C Fit (Substance, Figures, Craft, Fit), each 1-5. Figure code was checked in the HTML for at least 3 articles per series. Pages marked "(code checked)" had their figure code read.

## algorithms-ml (12 articles, ~11.4k words, all added 2026-04-13)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-gradient-descent (code checked) | 3 4 3 3 | KEEP | Standard intro, but Fig 4 really samples mini-batches and runs SGD on an MSE surface. Correct and honest. Generic. |
| 02-attention-mechanism (code checked) | 3 1 3 2 | CUT | The heatmap uses a hardcoded `designedWeights` matrix ("Override attention pattern to be pedagogically clear"), and scores are reverse-engineered from it. The prose then says "The heatmap is not designed; it emerges from training." That is false as written. Alammar and Distill already cover this. |
| 03-markov-chains | 3 3 3 3 | CUT | The weather chain, steady state, and gambler's ruin are textbook material (the Setosa explainer does this better). Nothing non-obvious here. |
| 04-backpropagation | 3 4 3 3 | FIX | A reasonable XOR training demo and 2-3-1 forward/backward pass. It closes on a generic summary ("Credit Assignment"). It needs one sharp idea, for example why vanishing gradients follow from the sigmoid slope, which the page hints at but never develops. |
| 05-decision-trees | 3 4 3 1 | MERGE -> decision-trees/01 + 03 | Gini, recursive growth, depth overfitting, and a 5-tree forest all duplicate the decision-trees series. |
| 06-k-nearest-neighbors | 3 3 3 2 | CUT | Correct (curse-of-dimensionality numbers check out: 0.05^(1/10)=0.74, 0.05^(1/20)=0.86) but encyclopedic. It includes a "not X but Y" line ("The goal is not to minimize either one..."). |
| 07-pca (code checked) | 3 4 3 2 | KEEP | Real 2x2 eigendecomposition and a drag-to-rotate variance figure. Solid but standard. Overlaps bioinformatics/04. |
| 08-bayes-theorem | 3 4 3 3 | KEEP | Area model and Beta updating. Numbers verified (16.1% at 1% prevalence, 67.9% at 10%). Standard but clean. |
| 09-clustering | 3 3 3 2 | CUT | K-means, elbow, dendrogram, DBSCAN. Encyclopedic. The dendrogram overlaps bioinformatics/01. |
| 10-convolution | 2 3 3 3 | CUT | The CNN edge->texture->part hierarchy figure is schematic, not computed. The padding/stride figure is arithmetic only. |
| 11-word-embeddings (code checked) | 2 1 3 3 | CUT | The 2D coordinates of all 40 words are hand-typed in `WORDS` (x/y literals) and labeled "simulated t-SNE". Analogies and cosine similarities are computed on fake coordinates. The training figure is a storyboard. |
| 12-reinforcement-learning | 3 4 3 3 | FIX | Real tabular Q-learning gridworld. It is also the standard version of this demo. It ends with an em-dash life-lesson summary. |

The series is a competent ML-101 textbook with a one-day batch shape: every article uses the same skeleton (hook, 4 figures, "one-sentence summary" close) and the same five-color role vocabulary. None of it clears a Distill bar on novelty. Each topic has a better-known canonical explainer elsewhere. Two of the most famous topics (attention, embeddings) fake their central figure, and attention's prose contradicts its own code. Keep a small core (GD, PCA, Bayes, possibly backprop and RL after work). Fold 05 into decision-trees and cut the rest. Estimated cut is 7/12 articles (58%), about 57% of words.

## decision-trees (8 chapters, ~7.1k words, added 2026-04-20)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-single-tree | 4 4 3 2 | KEEP | Good non-obvious point (the misclassification tie on a pure-leaf split, the ESL 400/400 example, arithmetic correct). The regression staircase is useful. It has 16 em dashes and a takeaways list, and overlaps algorithms-ml/05. Absorb that page here. |
| 02-geometry-and-pruning | 4 3 3 4 | KEEP | Rank invariance, the diagonal blind spot, and cost-complexity pruning are real ideas. Four controls on one figure is busy. Minor em-dash cleanup. |
| 03-voting-ensembles | 3 3 3 3 | FIX | A correct bagging/RF/Extra-Trees tour, but it is a list of facts. It never shows why correlation caps variance reduction (rho*sigma^2 + (1-rho)sigma^2/B is the obvious formula to put live). |
| 04-boosting | 4 4 2 4 | FIX | The residual-fitting figure is good. The XGBoost/LightGBM/CatBoost "cards" with badges ("careful / fast / rigorous") and the "Picking one" section are listicle/vendor-guide slop. Cut them. |
| 05-reading-the-forest (code checked) | 4 4 3 5 | KEEP | The ID-column gain-ratio trap is a real insight. The SHAP figure computes exact Shapley values by subset enumeration (honest, though it is brute force, not TreeSHAP). The best chapter. |
| 06-causal-trees (code checked) | 3 1 2 5 | FIX | The honest-estimation figure is fake. Both "naive" and "honest" estimates use a hardcoded region `x<0.3 && y<0.3` instead of a split selected on the training half, so the selection bias the prose describes cannot appear. There are 27 em dashes. Errors: "Causal trees maximise Var(tau \| leaf)" is backwards (the goal is heterogeneity of tau *across* leaves). "Only work with randomized treatment" overstates it (unconfoundedness/propensity weighting is standard in causal forests). |
| 07-trees-unbound | 2 3 2 2 | CUT | A grab-bag of soft trees and MCTS glued by the word "tree", and the page admits they "share almost nothing". "Grinsztajn: XGBoost won 36 of 45" is not a figure that paper reports and looks invented. |
| 08-frontier (code checked) | 2 2 2 3 | CUT | The "optimal tree" in Fig 2 is hardcoded to split at x=0.5 then y=0.5, so there is no solver. The OBDD figure is hand-built. Wrong: "optimal sparse trees in seconds where CART runs for years" (CART is fast). "OBDD merging requires building the tree oblivious-first" is false. The page uses a listicle ("Three more directions") and a grand "Series summary". Salvage the greedy-vs-XOR point into 01. |

This is the stronger of the two ML series: it has an arc (build, ensemble, interpret, intervene) and several genuinely non-obvious points (misclassification tie, rank invariance, gain ratio, honest splitting). Craft is its weak side: 110 em dashes across 8 pages, a "Takeaways" bullet list closing every chapter, and vendor cards. The back half degrades into survey material, and two late figures hardcode the answer they claim to discover. Trim 07 and 08, fix 06's figure and its factual errors, and absorb algorithms-ml/05. Estimated cut is 2/8 articles (25%), about 25% of words.

## bioinformatics (15 articles, ~7.6k words; 01-09 added 2026-04-11, 10-15 added 2026-04-18)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-heatmap-dendrogram (422w) | 2 3 3 2 | MERGE -> 12 | Thin "what is a heatmap". The dendrogram cut duplicates algorithms-ml/09. |
| 02-ma-plot (382w) | 3 3 4 2 | MERGE -> 03 | Careful prose (the mean-variance funnel) but three short sections. It belongs in a single differential-expression essay with 03. |
| 03-volcano-plot (302w, code checked) | 2 4 3 2 | MERGE (with 02) | Real Benjamini-Hochberg q-values computed in-browser. The prose is a chart-type definition. |
| 04-dimensionality-reduction (code checked) | 3 1 3 2 | FIX | The UMAP and t-SNE panels are faked from the class labels (`// Fake: place each class at its own centroid`), so the "recovery" of the moons is circular. Fig 1 is a "hand-crafted UMAP-style layout". The prose warnings about UMAP distances are good. Overlaps algorithms-ml/07. Run a real small t-SNE or drop the claim. |
| 05-genome-browser | 3 3 4 4 | KEEP | The 0-based vs 1-based coordinate point is the kind of concrete detail that makes a page worth reading. Pannable browser. |
| 06-circos-plot | 4 4 3 4 | KEEP | The richest page. Accurate history (Nowell/Hungerford 1960, Rowley 1973, BCR::ABL1). It says honestly when circos fails. 23 em dashes to remove. |
| 07-survival-curves (code checked) | 4 4 3 4 | KEEP | Real KM, log-rank, and Cox HR, with a good warning about threshold scanning making p anti-conservative. Drop the closing "pipeline" list. |
| 08-dot-plot (357w) | 2 3 3 3 | MERGE -> 10 | Small. The R175H point is useful (though "mRNA may accumulate" should say protein). |
| 09-lollipop-mutation (276w) | 2 2 3 3 | MERGE -> 10 | The thinnest page. Hotspot residues are correct (R175/G245/R248/R249/R273/R282; p53 393 aa, p21 164 aa). Essentially one static chart. |
| 10-five-views | 3 3 3 3 | FIX | A good spine idea (one TP53->CDKN1A story across scales), but each view gets about 150 words and the GWAS panel invents risk peaks at TP53/CDKN1A. It should absorb 08, 09 and carry the story. |
| 11-chip-seq | 4 4 4 4 | KEEP | The best writing in the series: input control, IDR, correct p53 RE motif (RRRCWWGYYY), contact vs structural hotspot distinction. |
| 12-multi-omics-heatmap | 3 3 3 3 | FIX | The "same phenotype, two routes" idea is real. The clusters are planted and the "consensus clustering" is a stand-in, so it doesn't compute what it names. The subtype "cards" border on a dashboard. |
| 13-waterfall-plot (406w) | 2 3 2 2 | MERGE -> 07 | Chart definition. "TMB is elevated in TP53 mutants due to impaired DNA repair" is loose. |
| 14-forest-plot (322w, code checked) | 3 4 3 3 | MERGE -> 07 | Real DerSimonian-Laird tau^2/I^2 and leave-one-out. Honest but thin. |
| 15-gene-portrait | 1 2 2 1 | CUT | A recap page: six mini-panels re-drawn from earlier articles, a KPI-style "Numeric summary" table with Delta column, and a grand "Series summary". |

The thin-page suspicion is confirmed: seven pages are under 425 words and read as "what is chart type X" glossary entries. The figures mostly compute honestly (BH, KM/log-rank, DL meta-analysis), which is better than the ML series, but the dimensionality-reduction page fakes UMAP/t-SNE using the labels. The best material (circos, ChIP-seq, survival, genome browser) is solid. Restructure into about 7 essays: DE (02+03), heatmaps (01+12), dim reduction (fixed), genome browser, circos, ChIP-seq, clinical evidence (07+13+14), plus five-views absorbing 08+09. Cut 15. Estimated cut is 7/15 standalone articles (47%) but only about 20% of words, since most of it merges.

## type-systems (12 articles, ~10.9k words, all added 2026-04-18)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-force-directed-graph | 2 2 1 1 | CUT | Pipe/"signature diagram" figures are decorative. Build notes leak into prose ("We added... TV.pipe, TV.product... SC.loop"). Wrong: "240-element root system in #12" (240 is E8; #12 is A2 with 6 roots). "S3 permuting SIR compartments" is also wrong: SIR dynamics have no such symmetry. Force layout duplicates d3-power-tools/force. |
| 02-boids | 2 3 1 1 | CUT | A boids sim with Haskell newtypes pasted on. The leader-follower automorphism panel is a non sequitur. Duplicates emergence/01-flocking. |
| 03-springs-and-constraints | 2 3 2 3 | CUT | "Solver is a fold" is the entire idea. It calls the free monoid "a group action in disguise". |
| 04-predator-prey (code checked) | 3 4 2 2 | CUT (salvage) | "Refinement type = axis wall" is a restatement of positivity. The RPS panel with a 5% lower-label bias is a real, interesting sim. Move it to emergence/33. Duplicates emergence/07. |
| 05-traffic-flow | 1 3 1 1 | CUT | Magnetite's Verwey transition appears for no reason. The "RG flow" is majority blocking of random seeds, which has nothing to do with traffic dynamics or Nagel-Schreckenberg. Duplicates emergence/04. |
| 06-sir-on-a-graph | 2 3 2 1 | CUT | "Conservation = simplex" is true and trivial. Duplicates emergence/05. |
| 07-n-body-symplectic | 3 4 2 4 | FIX / MERGE | The one real idea: two integrators with the same value type but different geometric promises, shown live as Euler energy drift vs leapfrog. Worth rewriting as a standalone symplectic-integration essay without the series scaffolding. Check for overlap with the sph series first. |
| 08-random-walks | 2 3 2 2 | CUT | "Seeded RNG replays" is trivial. Duplicates emergence/18. |
| 09-reaction-diffusion | 2 3 2 1 | CUT | Shape-indexed types add nothing to Gray-Scott. The D4 vs isotropic stencil comparison is the only content. Duplicates emergence/03. |
| 10-fitness-ga | 2 3 2 1 | CUT | The typeclass-contract point is thin. "METHINKS IT IS LIKE A WEASEL" is well-trodden. Duplicates emergence/16. |
| 11-type-lattice (code checked) | 1 1 1 3 | CUT | Parallel coordinates of hand-assigned integers from `lib/signatures.js`, then PCA of 10 points in 9D. It likens this to the 230 space groups, which is word association. |
| 12-root-systems (code checked) | 2 1 2 2 | CUT | The commuting-square figure: `step` is a rigid rotation and the "Weyl action" is a label permutation, so they trivially commute and the green check is drawn unconditionally. Wrong: it treats Weyl(A2) (order 6, only 120-degree rotations) as the six-fold hex symmetry (D6, order 12). |

The series title and thesis ("Programs have geometry") don't match the content: the pages are emergence-style simulations with Haskell type signatures and group-theory vocabulary laid over them. 7 of 12 sims duplicate emergence articles (flocking, reaction-diffusion, traffic, epidemic, predator-prey, GA, random walks), and 01 duplicates d3-power-tools/force. The type-specific figures (pipe diagrams, parcoords of hand-picked integers, a commuting square with a hardcoded check) are decorative. The math is name-dropping with several errors. The prose leaks authoring scaffolding ("Carry-forward: We added TV.sum..."). Cut the series. Salvage 07 as a standalone symplectic essay and move the RPS Z3-bias panel into emergence. Estimated cut is 11/12 articles (92%), about 92% of words.

## Cross-group overlap noticed
- type-systems <-> emergence: 7 direct topic duplicates (listed above). type-systems/01 <-> d3-power-tools/force.
- type-systems/12 root systems: likely overlaps exceptional-atlas (not verified).
- algorithms-ml/07 PCA <-> bioinformatics/04; algorithms-ml/09 dendrogram <-> bioinformatics/01; possibly topological-data-analysis and information-geometry (Bayes/Beta posteriors), not verified.
- emergence/21 neural-networks-as-emergence may overlap algorithms-ml/04 (not verified).
