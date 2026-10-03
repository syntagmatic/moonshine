# Sources for article 6 (verification pass of 2026-10-02)

## De Bacco, Larremore & Moore 2018, Sci Adv 4: eaar8260 (PMC6054508, CC BY-NC)

Full text from Europe PMC (`fullTextXML`), cached as `scripts/connectomes/.cache/papers/debacco2018.xml`.

- Eq. 1: "the spring corresponding to an edge i -> j has energy H_ij = 1/2 (s_i - s_j - 1)^2 ... minimized when s_i - s_j = 1"; Eq. 2: H(s) = 1/2 sum A_ij (s_i - s_j - 1)^2.
- Eq. 3: [D_out + D_in - (A + A^T)] s* = [D_out - D_in] 1, with D_out and D_in the weighted out- and in-degrees; "not invertible ... translation-invariant"; one fix is to "invert the matrix in the subspace orthogonal to its" nullspace, giving mean rank zero.
- Eq. 4 and 5: H_alpha(s) = H(s) + alpha/2 sum s_i^2, "a spring that attracts every node to the origin"; [D_out + D_in - (A + A^T) + alpha I] s* = [D_out - D_in] 1; "the value alpha = 2 corresponds to the Colley matrix method".
- "Since H(s) scales with the total edge weight M ... while H_0(s) scales with N, for a fixed value of alpha, this regularization becomes less relevant as networks become denser".
- "iterative solvers that take advantage of the sparsity of the system can find s* for networks with millions of nodes and edges in seconds".
- Significance test: ground-state energy per edge, against a null that randomizes "the direction of each edge while preserving the total number A_ij + A_ji of edges between each pair of vertices".
- The paper does not analyse C. elegans.

Our numbers on the worm (chemical synapses, Varshney 2011): JS conjugate gradient equals numpy `lstsq`/`solve` to 6 decimals at alpha 0, 1, 10, 100 with and without gap junctions. Share of synapses running down 0.8896; energy per synapse 0.1976; direction-shuffled 0.580 +/- 0.005 and 0.478 +/- 0.002 (100 graphs, node).

## Winding, Pedigo, Barnes et al. 2023, Science 379: eadd9330 (Europe PMC PMC7614541, author manuscript, CC BY)

Full text cached as `scripts/connectomes/.cache/papers/winding2023.xml`.

- "The resulting dataset contains 480 input neurons and 2536 differentiated brain neurons (3016 neurons total), and ~548,000 synaptic sites"; "Most neurons (>99%) were reconstructed to completion".
- "The dominant synaptic network of the brain comprised a-d connections".
- Cascade methods: "each synapse is assigned an equal probability p of transmission, with p = 0.05"; Bernoulli trial per synapse from each active non-stop node to each previously unactivated node; "Every node that was active at time t is moved to the set S_D, the deactivated nodes which cannot be activated again"; "These cascades were run 1000 times"; "Neurons were considered to receive cascade signals when visited in most cascade iterations". Based on the independent cascade model, citing Goldenberg, Libai & Muller 2001 (ref. 120).
- "In cascades started at SNs, the signal generally reached DNs VNC in 3 to 6 hops and rarely more than 8 hops ... We therefore stop the cascades at either 8 or 5 hops".
- "Overall, olfaction and gustation displayed the shortest pathways to output neurons, whereas the ascending somatosensory modalities displayed the longest."
- "Very few neurons (12 or 14% with 8- or 5-hop cascades, respectively) received signals from only one modality".
- "5-hop pathways were shown to be functional in the larva (specifically, MD class IV neurons to MB DANs) (19), but no studies have yet functionally tested 6-, 7-, or 8-hop pathways."
- Layering by order: "we defined the order of a neuron according to its lowest order input from any input neuron type ... Many brain neurons (545; 21%) were 2nd order, but most (1410; 56%) were 3rd order ... 4th order (377; 15%), but only 16 neurons (<1%) were 5th order ... 188 brain neurons (7%) ... not categorized ... no brain neuron was more than 4 hops removed from at least one input neuron". The text near these counts states no edge threshold, so the page does not give one.
- Synapse counts as strength proxy: ref. 61, Barnes, Bonnery & Cardona (2022).

Code (mwinding/connectome_tools and connectome_analysis on GitHub, cached in `scripts/connectomes/.cache/larva/code/`):
- `generate_data/cascades_all-modalities.py`: `Promat.pull_adj(type_adj='ad', subgraph=['mw brain and inputs', 'mw brain accessory neurons'])`; modalities in the order olfactory, gustatory-external, gustatory-pharyngeal, enteric, thermo-warm, thermo-cold, visual, noci, mechano-Ch, mechano-II/III, proprio, respiratory, each from the meta-annotation `mw <name>`; stop nodes `mw brain outputs`; p = 0.05, max_hops = 8, n_init = 1000, simultaneous = True.
- `contools/traverse/cascade.py`: transmission matrix 1 - (1 - p)^adj; `allow_loops = False`; `cascade_analysis.py` passes `max_hops + 1` "because max_hops includes hop 0". `pairwise_threshold` sums hits over hops 1..h and compares with `threshold = n_init / 2`, averaging left/right homologues (the page does not average pairs).
- `scripts/cascades/multisensory_integration_cascades.py`: the unimodal count goes through UpSet-plot groupings with exclusions, so our 11.7% is a reproduction of the definition "reached from exactly one modality", not of their exact pipeline.

## Data provenance

- Data S1 `ad_connectivity_matrix.csv` and Data S2 from the Europe PMC supplement bundle (cached since 2026-10-01). 2,952 neurons; 63,545 nonzero a-d connections, 234,958 synapses; rows presynaptic (checked: the 430 sensory neurons send 50+ times the a-d synapses they receive).
- CATMAID (l1em.catmaid.virtualflybrain.org, project 1, public; POST endpoints need the CSRF cookie): the 12 modality meta-annotations' skeleton sets, restricted to the matrix, equal Data S2's modality labels exactly. `mw dVNC`, `mw dSEZ`, `mw RGN` give 182, 184 and 54 matrix neurons; Data S2 types 20 of the DN-SEZ as CN, LHN, MBON or MB-FBN.
- Independent numpy cascade (dense, following the code above) against the page's JS: z-scores of hit shares have SD 1.002 over 166,290 node-hop-modality cells; unimodal 11.8% vs 11.7%; median hop to DN-VNC identical for all 12 modalities.
