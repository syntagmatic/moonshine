I'm planning a series of interactive essays about brain connectomes, the wiring diagrams of nervous systems, and I want a deep research report to build it on. Each essay will have an argument and one or two interactive figures that compute what they show at runtime from real, cited data. So I need two things from you at once: the science stated precisely enough that I can check every claim against a primary source, and a clear picture of which datasets are public, how big they are, what their numbers actually mean, and what could be drawn from them in a browser.

The readers are technically literate: comfortable with linear algebra, graphs, probability and a bit of dynamical systems, but not neuroscientists. I have already spent time with two datasets, the adult male fruit fly central nervous system connectome (neuropil-level matrices, cell-type wiring, predicted neurotransmitters, sexually dimorphic neurons, the olfactory pathway into the mushroom body, and the layered "steps from each sense" traversal) and the Allen mouse mesoscale connectivity model at the level of regional matrices. I don't need a tour of those releases' headline numbers. I do need the methods behind them explained and checked, and I want the series to reach well past them: other species, other scales, and the mathematics people use to read these graphs.

Aim for 25 to 40 pages. For each topic below, give (a) the precise formulation (what is a node, what is an edge, what is the weight, what is being computed), (b) the primary sources, with year and the specific result, (c) the intuition, (d) at least one worked numerical example on a real dataset, (e) failure modes, contested claims and common misreadings, and (f) one to three ideas for an interactive figure: what the reader drags, toggles or scrubs, and what they should come away feeling.

1. **What a connectome is at each scale.** Macroscale (diffusion MRI tractography), mesoscale (tracer injections, the mouse and macaque projection atlases) and microscale (electron microscopy: C. elegans from White et al. 1986 through Cook et al. 2019 and Witvliet et al. 2021; the larval Drosophila brain; the adult fly hemibrain, the whole female brain, the male ventral nerve cord and the male CNS; the cubic millimetre of mouse visual cortex; the human temporal cortex fragment). For each: what is counted, what the edge weight means, and why weights from different modalities cannot be compared directly.

2. **How a connectome is made, and how much to trust it.** Imaging, automated segmentation, proofreading, synapse detection, and neurotransmitter prediction from EM images. Known error rates. What "traced" means against untraced fragments, and how that makes input counts nearly complete while output counts can be far from it. Tractography's false-positive problem. How reproducible edges are across two animals, and across left and right in one animal.

3. **Cell types.** How types are defined from morphology and connectivity (NBLAST and its descendants, connectivity-based clustering, cross-hemisphere and cross-dataset matching), how hierarchical annotations are organised, how many types there are, and whether "type" is a well-posed notion or a convenient partition. Where types disagree between datasets.

4. **Graph statistics against the right null model.** Degree and weight distributions, reciprocity, triplet motifs (Song et al. 2005 in cortex, Milo et al. 2002), rich clubs, small-worldness (Watts and Strogatz 1998 used C. elegans). For each claim, what null model it was tested against (Erdős–Rényi, configuration, degree- and space-preserving), and which claims survive a spatially embedded null. I want to know which famous results are robust and which are artefacts.

5. **Wiring economy and space.** Component placement optimisation (Cherniak), the wiring-minimisation account of C. elegans neuron positions (Chen, Hall and Chklovskii 2006), the exponential distance rule in macaque cortex (Ercsey-Ravasz et al. 2013), Peters' rule and its violations. How much of a connectome's structure is predicted by geometry alone.

6. **Modules, hierarchy and ordering.** Modularity and its resolution limit, degree-corrected stochastic block models, spectral clustering, and matrix seriation, including how the chosen ordering changes what a matrix picture appears to show. Cortical hierarchy from laminar projection patterns (Felleman and Van Essen 1991, Markov et al. 2014, Harris et al. 2019 for mouse cortex and thalamus).

7. **Signal flow and layering.** Feedforwardness, minimum-violation and spring-based rankings, cascade and probabilistic-traversal models of information flow from sensory neurons, and "how many synapses from sense to action". How sensitive the layer assignments are to the model's threshold and to edge-weight cutoffs.

8. **Spectra and dynamics on the graph.** Laplacian eigenmodes of the connectome ("connectome harmonics") and the 2023 argument that cortical geometry alone explains them better. Communication models (shortest paths, diffusion, navigation). Network control theory applied to brains and its published critiques.

9. **From wiring to function.** Connectome-constrained models and what they predicted: direction selectivity in the fly motion pathway (from Takemura et al. 2013 to connectome-constrained deep networks of the fly visual system), the head-direction ring attractor in the fly central complex, whole-brain spiking models of the fly built from the connectome, and the functional-connectomics results from the mouse cortex volume (like-to-like connectivity). And the counter-case: why the C. elegans connectome alone did not yield its behaviour (gap junctions, neuromodulation, state).

10. **Randomness and structure: the mushroom body.** Projection-neuron to Kenyon-cell wiring as near-random (Caron et al. 2013), the random-projection and sparse-hashing view (Dasgupta et al. 2017), and later evidence of structured deviations from randomness. How to test "is this wiring random?" properly, and what the answer means for learning.

11. **Variability: individuals, sides, sexes, development.** Stereotypy across animals and hemispheres, sexually dimorphic circuits in worm and fly (fruitless and doublesex neurons), and connectome change across development (Witvliet et al. 2021). What varies and what doesn't.

12. **Drawing connectomes.** Matrix, node-link, anatomical and flow views; the hairball problem; edge bundling; showing log-scaled weights, directedness, and uncertainty honestly. Which published figures mislead and why.

13. **The frontier.** Whole mouse brain EM (scale, cost and timeline estimates from the people proposing it), expansion and X-ray microscopy approaches, molecular barcoding of projections, and what open problems a complete mammalian connectome would and would not settle.

Datasets are the part I most need to get right. Give a table of public datasets that could feed a browser figure, with: organism and region, modality, release version, node and edge counts at that version, license, direct download location and format, and the size of the smallest useful extract (a full small graph, a cell-type matrix, a regional matrix, one circuit). Favour ones small enough to ship as a few megabytes: the C. elegans hermaphrodite and male connectomes, the larval fly brain, the fly central complex and mushroom body circuits, regional matrices for mouse and macaque. Where counts differ between releases or papers, give each with its version rather than one number.

At the end include:
- 10 to 15 surprising facts a technically literate reader probably doesn't know, each with its source.
- A list of common misconceptions (for example, that a connectome determines behaviour, or that tractography streamlines count axons), each with the evidence against it.
- A table mapping each topic to the mathematics it uses (graph theory, spectral theory, statistics of random graphs, optimisation, dynamical systems, information theory).
- A full bibliography with primary sources, plus the key data papers for each dataset.

Prioritise precision and accuracy over breadth. Say when a claim is contested or depends on a threshold, a release version or a choice of null model. Describe the most drawable results carefully enough that a figure could be rebuilt from your description alone.

Out of scope: clinical neuroimaging and disease biomarkers, beyond a sentence where it helps; artificial neural network "connectomes" except as a contrast; and any project-specific names, function names, paths, or implementation instructions.
