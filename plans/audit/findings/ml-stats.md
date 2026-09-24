# Findings: ml-stats track

Series: algorithms-ml, bioinformatics, decision-trees. Review: `plans/audit/reviews/cs.md`.
Article count: 35 before (12 + 15 + 8), 20 after (6 + 8 + 6).

## Cut, merged, renumbered

### algorithms-ml (12 -> 6)

| old | new |
|---|---|
| 01-gradient-descent | 01-gradient-descent (footer only) |
| 04-backpropagation | 02-backpropagation |
| 02-attention-mechanism | 03-attention-mechanism |
| 07-pca | 04-pca |
| 08-bayes-theorem | 05-bayes-theorem |
| 12-reinforcement-learning | 06-reinforcement-learning |
| 05-decision-trees | merged into decision-trees/01 (its Fig 2), then deleted |
| 03-markov-chains, 06-k-nearest-neighbors, 09-clustering, 10-convolution | cut (reviewer verdicts) |
| 11-word-embeddings | cut |

Reading order changed so attention follows backprop (its model is trained by backprop in the page).

### decision-trees (8 -> 6)

01-06 keep their names. 07-trees-unbound and 08-frontier deleted.

### bioinformatics (15 -> 8)

| new | built from |
|---|---|
| 01-five-views | 10-five-views + 09-lollipop (TP53 figure) + 08-dot-plot (WT vs mutant figure) |
| 02-genome-browser | 05-genome-browser |
| 03-circos-plot | 06-circos-plot |
| 04-chip-seq | 11-chip-seq |
| 05-differential-expression | 02-ma-plot + 03-volcano-plot (rewritten, new simulation) |
| 06-clustered-heatmaps | 01-heatmap-dendrogram + 12-multi-omics-heatmap |
| 07-dimensionality-reduction | 04-dimensionality-reduction (rewritten, new computation) |
| 08-clinical-evidence | 07-survival-curves + 13-waterfall-plot + 14-forest-plot |
| 15-gene-portrait | cut (recap page) |

Order: spine first, then genome, binding, expression, clustering, embedding, patients.
Merged pages were assembled with a build script from the original page sources: scripts wrapped
per source, figures renumbered, prose written fresh around them.

## Errors confirmed and fixed

- **Attention: "the heatmap is not designed; it emerges from training."** It was designed
  (`designedWeights`, scores reverse-engineered from it). Fixed by making it true, see Figures below.
- **RL Fig 3 caption: low-ε agent "may settle for a suboptimal path", high-ε "can discover better
  routes".** I simulated it with the page's own seeds and update rule: both greedy policies reach the
  12-step optimum by about 200 episodes; the difference is reward collected while learning (pit rate
  about 0.1 vs 0.4 in the last 100 episodes). Caption rewritten, a live "greedy path" readout added,
  and a paragraph on off-policy learning and SARSA/cliff-walking (Sutton and Barto, Example 6.6).
- **Causal trees: "Causal trees maximise Var(τ | leaf)".** Backwards. Athey and Imbens (2016) reward
  heterogeneity of the leaf effects across leaves, with a penalty for noisy leaves. Rewritten.
- **Causal trees: "only work with randomized treatment".** Overstated. Causal forests are used under
  unconfoundedness; GRF (Athey, Tibshirani and Wager 2019) uses local centering. Rewritten, with the
  assumption stated.
- **Five-views dot plot: R175H "mRNA may accumulate".** It is the protein that accumulates (mutant
  p53 cannot induce MDM2). Prose fixed, and the simulated mutant TP53 mRNA level (which was set
  higher than wildtype, 2.8 vs 2.2) set equal to wildtype.
- **Waterfall: "TMB is elevated in TP53 mutants due to impaired DNA repair."** Loose. Rewritten as an
  association with two explanations (tolerance of damage without p53; mutagen exposure causing
  both), and noted that the synthetic cohort builds it in.
- **Circos: caption claimed "low-resolution cytobands anchored to GRCh38".** Chromosome lengths and
  centromeres are real, but the band pattern came from a seeded RNG. Bands are no longer drawn
  (arms and centromere only); caption, prose and the karyogram label say so. The RNG draws are still
  consumed so the rest of the seeded synthetic data is unchanged.
- **Old dim-reduction narrative "PCA fails, t-SNE/UMAP recover the moons".** With real computation
  this is false on the page's own setup: PCA keeps the moons better than t-SNE on all 12 dimensions
  at low and moderate noise (e.g. 76% vs 64% same-moon neighbours at noise SD 0.5); only near SD 0.9
  does PCA drop to chance (53%) while t-SNE keeps about 60%. Prose now reports what the computation shows.
- **Backprop (my own first draft).** I first wrote that larger weights don't rescue sigmoid
  gradients; the figure's own computation showed that near weight scale 8 the per-layer shrink
  disappears (with average slope 0.07). Prose corrected before commit.
- **DT 03 "Chapter 8 covers a structural fix"**, **DT 02 "Chapter 7 covers..."**, "Chapter N of 8"
  subtitles: stale references removed.
- **DT 04 vendor cards**: unverified "5-10x faster" and "default above a million rows" dropped with
  the cards; the replacement paragraph states only documented design choices.

## Errors rejected or moot

- **"Grinsztajn: XGBoost won 36 of 45."** The benchmark has 45 datasets (arXiv 2207.08815), but the
  paper reports aggregate performance curves, not a win count; I found no source for 36. The claim
  lived only in 07, which is cut. Grep confirms it survives nowhere.
- **"Optimal sparse trees in seconds where CART runs for years."** Wrong as the reviewer said (CART is
  fast); lived only in 08, cut. Not present elsewhere.
- **"OBDD merging requires building the tree oblivious-first."** In 08, cut; not checked further.
- Reviewer's KNN curse-of-dimensionality numbers and Bayes percentages were already verified by the
  reviewer; KNN is cut, Bayes untouched.
- **Oncoprint TP53/MDM2 mutual exclusivity** (five-views): kept. It is a real, well-known pattern;
  the synthetic data plants it and the prose now says so.

## Figures made honest or removed

- **Attention (algorithms-ml/03)**: `designedWeights`, the four hand-typed "heads" and the hand-typed
  soft-lookup weights are gone. The page now trains a real two-head attention layer (d = 6, learned
  W_Q, W_K, W_V and a shared linear readout, Adam, 400 steps of 16 sentences) on a toy grammar, in the
  browser at load. Targets: each word names the word it attaches to and the previous word. Fig 2
  shows the trained Q/K/V and the real softmax; Fig 3 has a training slider over saved snapshots;
  Fig 4 shows both heads, counts which rows fetch which target, reports held-out accuracy (100%/100%),
  and retrains from new seeds. Fig 1 weights are the softmax of shared letter bigrams. The heatmap's
  4th "Output" stage (which showed the weights again) was removed.
- **Word embeddings**: cut instead of fixed. An honest version needs trained vectors; a toy word2vec on
  a tiny corpus would not produce the analogies the page is built on.
- **Backprop**: new Fig 5 computes per-layer RMS gradients in a deep MLP (sigmoid vs ReLU, depth,
  weight scale); replaces the "Credit Assignment" summary.
- **Causal trees Fig 2**: rebuilt. A depth-2 causal tree is grown on one half, the highest-uplift leaf
  is picked, its uplift is estimated on the same half and on the other half, and compared to the
  exact true uplift (rectangle-area overlap with the known effect regions), for one example and over
  200 simulated datasets. Defaults: same-half bias +31pp, other-half +1pp; nominal 95% CI coverage
  41% vs 93%.
- **Decision trees 01**: new Fig 2 (ported from algorithms-ml/05: greedy growth with linked tree
  diagram) plus an XOR dataset and an exhaustive search for the best depth-2 tree. Greedy depth-2 on
  XOR averaged 71% over 40 samples (best depth-2: always 100%). Default sample is seed 1 (62%); seed 7
  (97%) was avoided as unrepresentative.
- **Decision trees 03**: new Fig 1 simulates averages of B correlated predictors and checks
  Var = ρσ² + (1-ρ)σ²/B (ESL eq. 15.1).
- **Five-views GWAS/Manhattan panel**: removed (it invented risk peaks at TP53 and CDKN1A).
- **Five-views PPI network**: removed. It was a hand-typed graph with invented evidence weights that
  mixed transcriptional targets (BAX, PUMA, NOXA) into a "physical interaction" network.
- **Volcano plot p-values** were drawn from hand-set distributions independent of the data. The new
  differential-expression page simulates negative-binomial counts, runs a moderated t-test
  (variance shrunk toward an abundance trend, limma-trend style) and Benjamini-Hochberg, and draws the
  MA and volcano plots from the same results; Fig 2 uses the known truth to show what each filter
  lets through.
- **Multi-omics "consensus clustering" stand-in**: the ordering sorted by planted labels. Now real
  consensus clustering (Monti 2003: 100 resamples of 80%, k-means++ best of 5, average linkage on
  1 - consensus), recovering 74/80 planted subtypes; new Fig 6 draws the consensus matrix. (Found and
  fixed a `d3.shuffle(array, rng)` misuse on the way: d3's second argument is a start index.)
  Subtype fingerprint cards removed (dashboard pattern).
- **Dimensionality reduction**: the label-placed UMAP/t-SNE and the "hand-crafted UMAP-style layout"
  are gone. Real exact t-SNE (with early exaggeration, gains, momentum; lr 20 after lr 100 diverged
  on n = 200) and real PCA (power iteration). UMAP removed along with claims that depended on it.
  Fig 2 adds a noise slider and a same-moon-neighbour score per panel, plus a "t-SNE on top 2 PCs"
  option. A prose claim I drafted (T/NK neighbour lines "mostly cross") was false by the page's
  data and was replaced before commit.

## Salvage notes (not rehomed)

- `algorithms-ml/09-clustering.html` (deleted): k-means step-through and DBSCAN failure-mode figures;
  real computation. Possible home: a clustering essay, or 06-clustered-heatmaps if it grows a
  "choosing k" section.
- `algorithms-ml/06-k-nearest-neighbors.html`: K-slider decision boundary and curse-of-dimensionality
  figure. No home in these series.
- `algorithms-ml/10-convolution.html`: 1D/2D sliding-kernel figures (the CNN hierarchy figure was
  schematic).
- `algorithms-ml/03-markov-chains.html`: stationary-distribution convergence and gambler's ruin.
- `algorithms-ml/05-decision-trees.html`: Fig 3 (depth vs train/test accuracy) and Fig 4 (5-tree
  forest vote) duplicate decision-trees 02 and 03, not ported.
- `bioinformatics/13-waterfall-plot.html`: threshold explorer with a real Fisher exact test; dropped
  because KM Fig 2 makes the threshold-scanning point. Easy to restore in 08.
- `bioinformatics/02-ma-plot.html`: brush-to-table candidate extraction; `03-volcano-plot.html`:
  top-N labelling. Dropped with their fake data.
- `bioinformatics/08-dot-plot.html` Fig 1 (10 genes x 8 cell types) and `09-lollipop` CDKN1A panel.

All deleted sources are in git history at `abfd27d`.

## Unresolved, needs a human

- Pre-existing layout bugs in the Kaplan-Meier split figure (bio 08): the at-risk table is clipped
  at the bottom, and a censor mark renders just past the 60-month axis.
- The attention model trains at page load (about 0.3 to 0.5 s, chunked). Figures 2 to 4 appear once it
  finishes; fine in the render check, but worth a look on a slow phone.
- Remaining em dashes in paragraphs I did not otherwise touch (e.g. decision-trees 01 "Why
  misclassification fails", circos prose, backprop body). Left for the prose pass per the brief.
- Five-views methylation claim ("CDKN1A promoter methylation can be associated with reduced
  response") is hedged and plausible (reported in some leukemias) but I did not check a primary
  source.
- The lollipop recurrence counts are simulated (positions and contact/structural classes are real);
  a version using public counts (e.g. TCGA/IARC) would be stronger.

## Inbound links from other series

- `docs/index.html:193` -> `bioinformatics/06-circos-plot.html` (now `bioinformatics/03-circos-plot.html`).

No other page outside these three series links to a deleted or renamed page (checked every
`href` in `docs/` plus plain path strings in .html/.js).

## Homepage entries

- **Algorithms & ML**: count 6. desc: "Gradient descent, backpropagation, attention, PCA, Bayes and
  Q-learning, each with figures that run the algorithm in your browser, including an attention layer
  trained on the page." tags: optimization · neural networks · attention · PCA · Bayes · RL.
- **Bioinformatics**: count 8. desc: "One gene pair, TP53 and p21, followed through the plots of
  modern bioinformatics: oncoprints, genome browsers, ChIP-seq, differential expression, consensus
  clustering, t-SNE and survival analysis, all computed in the page." tags: genomics · expression ·
  single-cell · survival · meta-analysis.
- **Decision Trees**: count 6. desc: "Building a tree, why greedy splitting fails on XOR, the
  correlation floor of ensembles, boosting, Shapley values and honest causal trees." tags: trees ·
  ensembles · boosting · SHAP · causal inference.
