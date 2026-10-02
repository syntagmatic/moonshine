# Connectomes

I want an eight-article series on connectomes, the wiring diagrams of nervous systems, for a technically literate reader: comfortable with linear algebra, graphs, probability and a little dynamical systems, but not a neuroscientist. Each article makes one argument and carries two figures (three in the last), and every figure computes what it shows at runtime from real, cited data.

The through-line is that a connectome is a measurement, not a blueprint. What a wiring diagram tells you depends on what was counted and how reliably, what you compare it against, and how you draw it; and even a perfect one leaves out much of what the animal does. The first two articles are about the measurement itself, the middle four about reading the graph (null models, wire cost, ordering, flow), and the last two about what the graph can and cannot settle.

C. elegans anchors the series: 302 neurons, both sexes, eight animals across development, small enough that every graph computation (null ensembles, eigenvectors, rankings, layouts) runs in the page. The larval fly, the adult fly mushroom body, the mouse visual cortex, human temporal cortex and macaque cortex come in where they are the best example. The adult male fly CNS appears only in article 2 (completeness) and article 8 (sex differences).

By the end the reader should be able to look at a published connectome figure or headline and ask the right three questions: what is an edge here, compared to what, and drawn how.

## Articles

### 1. What Gets Counted
The same word, connectome, names graphs whose edges mean different physical things, and their weights cannot be compared across methods.
- **One pathway, three rulers.** Mouse primary visual cortex (VISp) to its nine neighbouring higher visual areas, measured by diffusion MRI (Trinkle et al. 2021, five brains, undirected) and by Allen anterograde tracer projection density (every wild-type VISp injection, with the Knox et al. 2019 model beside them). Each modality on its own axis (units differ), joined by lines per target area so the reader sees where the rankings agree and cross; the reader toggles normalisation (raw, fraction of total, rank). Then the third ruler, which can't join the comparison: the MICrONS cubic millimetre contains only VISp, RL and AL, and its proofread VISp axons put a few percent of their synapses into those areas, mostly local wiring across the border. EM counts synapses exactly but sees only what fits in the block. Computes: each modality's values from its released data, the rank correlation between dMRI and tracer, and the per-axon share of synapses landing outside VISp.
- **What an edge is made of.** The H01 human cortex histogram of synapses per connection (log count axis): almost all connections are a single synapse, and a few axons make dozens onto one target. The reader slides the "edge exists if at least k synapses" threshold and watches the share of edges and the share of synapses kept diverge. Computes: both shares from the released connection counts.
The article ends on scale: H01's cubic millimetre took most of a year of imaging, and what that rate implies for a whole mouse brain.

### 2. How Far to Trust an Edge
A connectome is an estimate. Strong edges are reproducible and weak ones are often noise, and the errors are not symmetric between a neuron's inputs and outputs.
- **Does this edge exist in the next animal?** For every edge, its synapse count against the chance it reappears: across the eight Witvliet worms, and across the left and right hemispheres of FlyWire (and the hemibrain, as Schlegel et al. 2024 did). The reader picks a weight threshold and sees what fraction of the kept edges replicate and what fraction of replicating edges were thrown away. Computes: replication rates by weight bin from the edge tables.
- **Inputs nearly complete, outputs not.** In the male fly CNS about 94% of presynaptic sites and 42% of postsynaptic sites sit on traced bodies, because the lost fragments are thin postsynaptic twigs. So a traced neuron's input partners are mostly known while its output weights are undercounted by about 2.4 times. A model figure: take a real weight distribution, thin each synapse with the reader's completeness probability, and watch which edges fall below a threshold, and how an output-side ranking reshuffles. Computes: the binomial thinning, labelled as a model on real weights.
Tractography's version of the problem (Maier-Hein et al. 2017's phantom challenge: most true bundles found, alongside many more invalid ones) closes the article in prose.

### 3. Surprising Compared to What?
Every "brains are small-world / reciprocal / rich-club" claim is a comparison with a null model, and the answer depends on which null.
- **A ladder of nulls.** The C. elegans chemical graph's clustering and path length against ensembles generated in the page: Erdős–Rényi, a distance-binned spatial null, a degree-preserving rewiring, and degree plus wire length preserved. Distributions as dot strips with the observed value marked; the small-world index falls from about 6 to about 2 as the null learns more, and most of the drop comes from degree, not geometry. Computes: every ensemble by rewiring in a web worker, and the index for each.
- **Motifs and the reciprocity trap.** The 16-class triad census of the worm graph as z-scores against a configuration null and a reciprocity-preserving null: many "enriched motifs" shrink once reciprocal pairs are held fixed, the point Song et al. 2005 made in cortex (bidirectional pairs 4 times chance). Computes: the census and the null ensembles.
The worm rich club (Towlson et al. 2013) is stated in prose with its null.

### 4. The Cost of Wire
Brains are cheap to wire but not as cheap as possible. Geometry predicts much of a connectome, and the residual is where the interest lies.
- **Where the neurons would sit.** Chen, Hall and Chklovskii's 2006 model: fix sensory endings and muscles, place every other neuron to minimise the sum of squared wire lengths weighted by synapse count. One linear solve gives predicted positions along the body; a scatter of predicted against actual, with the reader able to change the cost exponent and drag a neuron off its optimum to see the total cost rise. Computes: the quadratic placement and the total cost.
- **The exponential distance rule.** Macaque interareal connection weights (FLNe, Markov et al. 2014) against white-matter distance on a log axis (the 628 pathways into 11 target areas whose white-matter distances are published; the full distance matrix is not public), with an exponential fit. The reader drags the decay constant against the best fit and switches between pooled and per-target-area fits: distance explains the pooled trend but leaves most of the per-pathway variance. Computes: the fits and R².

### 5. Reading the Matrix
A connectivity matrix looks like whatever order you put its rows in, and some famous summary statistics are degree in disguise.
- **Ordering changes the picture.** The worm adjacency matrix under alphabetical, degree, cell-class, random and spectral (Fiedler vector) orders, animated between them, with a mean-edge-span readout and a side strip of each neuron's body position. The spectral order is the best by span and turns out to be the head-to-tail axis, not a sensory-to-motor one. Computes: every ordering and its span.
- **Controllability is degree.** Average controllability (Gu et al. 2015) against weighted degree for every node of a structural network, live: the reader changes the normalisation and time horizon and the correlation stays near 0.9. Computes: average controllability from the eigendecomposition of the normalised matrix, and the correlation.
The modularity resolution limit is derived in prose with a small diagram.

### 6. Which Way Signals Flow
Rankings and cascades turn a recurrent graph into layers from sense to action; the layers are real but their boundaries depend on the model's settings.
- **SpringRank on the worm.** Every neuron placed at its SpringRank height, coloured sensory, inter or motor, with the edges that point down the hierarchy marked. The reader changes the regularisation and toggles gap junctions, and picks a neuron to see its inputs and outputs. Computes: the sparse linear solve and the fraction of synaptic weight flowing down.
- **Hops from each sense.** A probabilistic cascade through the 3,016-neuron larval fly brain (Winding et al. 2023) seeded from one sensory modality at a time, as a modality-by-hop heatmap of how many neurons are first reached at each hop; the reader moves the transmission threshold and watches the layer assignments slide. Computes: the cascade, many runs per setting, in a worker.

### 7. Random by Design?
The fly mushroom body was the textbook case of random wiring. Testing that claim properly takes the right null, and the answer is "almost, with structure that geometry largely explains".
- **Which inputs share a Kenyon cell.** The glomerulus-by-glomerulus co-occurrence matrix of projection-neuron inputs onto single Kenyon cells, as z-scores against a degree-preserving shuffle run in the page. Food-odour glomeruli converge more than chance (Zheng et al. 2022), and a spatially local shuffle removes most of the excess. Computes: the co-occurrence counts and both shuffled ensembles.
- **What random wiring is good for.** Real odour responses (Hallem and Carlson 2006) pushed through the real PN to Kenyon cell wiring and a 5% winner-take-all: similar odours get overlapping Kenyon cell tags, the sparse-hashing view of Dasgupta et al. 2017. The reader picks odour pairs and swaps in shuffled wiring to see that the property survives. Computes: the projection, the tags and their overlap.

### 8. Same Genes, Different Wiring
A connectome is one animal at one time, in one sex, and it omits the signals that don't travel by synapse.
- **Growing up.** Witvliet et al. 2021's eight worms from birth to adulthood: synapse counts per connection against age, with stable, variable and developmentally changing connections separated, and the reader brushing a neuron to follow its connections. Computes: growth per connection and the class shares.
- **Two sexes.** For the neurons shared by the hermaphrodite and the male (Cook et al. 2019), each connection's weight in one sex against the other on log axes, with sex-specific connections on the axes; then the fly, where most cell types match between sexes and the dimorphic ones are a small, widely connected set (Berg et al.). Computes: the joined edge table and its shares.
- **The wireless layer.** The worm's neuropeptide network (Ripoll-Sanchez et al. 2023) against its synaptic network on one layout: far denser, with different hubs. Computes: densities and degrees from the released matrices.
It ends where the series began: the graph is a measurement of one thing, and behaviour needs more.

## What to get right

- Every dataset is fetched from its primary source by a script in `scripts/connectomes/`, trimmed, saved under `docs/connectomes/shared/data/`, and cited on the page with its release version. Counts differ between releases (Varshney 2011, Cook 2019, Witvliet; hemibrain v1.0 vs v1.2.1; FlyWire versions); always name the version.
- Licences: Cook 2019 and Witvliet 2021 data state none; Markov 2014 is CC BY-NC. Say so in the data notes and cite the papers.
- The worm's 302 neurons include 20 pharyngeal neurons with their own network; analyses that use 279 dropped those and three that make no synapses. Chemical synapses are directed, gap junctions are not; never mix them silently.
- Tractography streamlines are not axons, FLNe is a fraction of labelled neurons in one injection, and EM weights are synapse counts. Never put two modalities on one numeric axis.
- Small-world claims must name their null. In the worm the index stays above 2 even against degree and wire-length preserving nulls; don't repeat the "it's just geometry" story.
- The male fly CNS completeness gap: 94% presynaptic, 42% postsynaptic sites on traced bodies (Berg et al., Cell); the lost fragments are postsynaptic twigs, so outputs are undercounted.
- Facts drafts get wrong: Takemura 2013 did not identify Mi4 or Mi9 as T4 inputs; Witvliet synapses rise about six-fold (about 1,300 to about 8,000) and the reconstructions cover the brain (nerve ring), not ventral cord motor neurons; Caron et al. 2013 found about 7 inputs per Kenyon cell on average; Pang et al. 2023's main critique is a bioRxiv commentary by Faskowitz et al., not a journal paper.
- Series colors: observed data in the ink color; null models and expected values in one muted color; sensory, inter and motor neurons in three fixed hues used across both worm and fly; gap junctions and neuropeptides each get their own color, distinct from chemical synapses.
