# Connectomes ledger

Every checkable claim in the series, and how we know it. D = derived (working in the
article or here), C = computed (by a figure at runtime, or by a node check on the shipped
data), S = sourced (read in the named primary source this session). "Open" means not yet
checked; it must be checked or cut before the article ships.

The deep-research report in `research/REPORT.md` is not a source; see
`research/check/README.md`.

## Data

| File | Source | Fetched by |
|---|---|---|
| `docs/connectomes/shared/data/worm-varshney.json` | WormAtlas `NeuronConnect.xls` (edges; rows S and Sp give the 2,194 directed chemical pairs, 6,394 synapses; EJ rows give 514 gap-junction pairs, 887 junctions) and `NeuronType.xls` (279 neurons, soma position 0 to 1 along the body), both from Varshney et al. 2011; 3D cell-body positions from OpenWorm `c302_A_Full.net.nml`; roles (s/i/m) from NemaNode `/api/cells` (AVH, AVK, RID are "n" only there and are set to interneuron). Fetched 2026-10-01. | `scripts/connectomes/fetch-worm.py` |
| `docs/connectomes/shared/data/worm-anchors.json` | WormAtlas `NeuronFixedPoints.xls` (Chen, Hall & Chklovskii 2006): 650 rows `Neuron, Landmark, Landmark Position, Weight`; VC06 (not among the 279) dropped, leaving 649 anchors on 199 neurons; landmarks "Sensory"/"SensoryNB" are sensory endings (weight 1), the rest body-wall muscles plus MANAL (weights are the M_il of Chen et al. Eq. 3, some fractional). Fetched 2026-10-01. | `scripts/connectomes/fetch-wire.py` |
| `docs/connectomes/shared/data/macaque-fln.json` | FLNe: Markov et al. 2014 Cereb Cortex supplementary table (`Cercor_2012 Table.xls`, core-nets.org via the Internet Archive, 1,989 rows, 39 injections, 29 targets); distances: Markov et al. 2014 J Comp Neurol Table 2 (`JCN_2013 Table.xls`, 628 pathways into 11 targets). Nine area spellings mapped (8L, ENTORHINAL, PERIRHINAL, PIRIFORM, SUBICULUM, TEMPORAL_POLE, INSULA, Parainsula, CORE); after mapping every distance pathway has FLNe and vice versa. Repeat injections (V1 5, V2 3, V4 2) averaged with 0 for an unlabelled injection (16 pathways affected). Same fit as the INM-6 multi-area-model CSV copy. | `scripts/connectomes/fetch-wire.py` |
| `docs/connectomes/shared/data/larva-winding.json` | Winding et al. 2023 (Science 379, eadd9330), Europe PMC author manuscript PMC7614541 (CC BY): Data S1 `ad_connectivity_matrix.csv` (axon to dendrite, 2,952 neurons, rows presynaptic; 63,545 connections, 234,958 synapses) as a delta-encoded CSR, and Data S2 cell types. Seed sets: the authors' CATMAID meta-annotations `mw olfactory` ... `mw respiratory` (public L1 CNS project), asserted equal to S2's modality labels. Output flags from `mw dVNC`, `mw dSEZ`, `mw RGN` (182, 184, 54 in the matrix; 20 of the DN-SEZ are typed CN, LHN, MBON or MB-FBN in S2). Fetched 2026-10-02. | `scripts/connectomes/fetch-larva.py` |

## Article 3: Surprising Compared to What?

| Claim | Type | How we know |
|---|---|---|
| 279 neurons, 6,394 chemical synapses on 2,194 ordered pairs; gap junctions on 514 pairs | C | `GraphLib.dataChecks` (node and `tests/connectomes.html`) on the shipped file; same counts as the 2026-09-30 check of OpenWorm's `NeuronConnectFormatted.xlsx` |
| 1,961 undirected connected pairs; 14 partners per neuron on average (2 x 1961 / 279 = 14.06) | C | `dataChecks`; arithmetic |
| C = 0.320, L = 2.57 for the undirected chemical graph | C | figure 1 at runtime; `dataChecks` pins 0.32030 and 2.56953, equal to networkx 3 `average_clustering` and `average_shortest_path_length` |
| 38,781 pairs of neurons | D | 279 x 278 / 2 |
| AVAR has 85 partners; command interneurons AVA, AVB, AVD, AVE, PVC have 42 to 85 | C | node check on the shipped file (AVDL 42, AVAR 85) |
| Index about 6 (random), 5 (distance), 2.3 (degree), 2.2 (both) at 20 bins; C about 0.05, 0.06, 0.13 | C | figure 1 default (seed 1, 30 graphs): 5.99, 5.07, 2.34, 2.18; same within 0.1 in a Python/networkx prototype with independent null code (5.93, 5.03, 2.39, 2.14) and in the 2026-09-30 check with 2D positions |
| Random graphs' C is the density | D | E[C] of G(n, m) = p = 1961 / 38781 = 0.0506 |
| Newman's estimate (transitivity) gives 0.123 from the worm's degrees; rewired graphs 0.11; worm 0.20 | C | computed live (`#newman-val`, `#trans-null` from 10 swap graphs, `#trans-obs`); worm transitivity pinned in `dataChecks` to networkx 0.19874. The formula estimates transitivity, not average local C (critique finding) |
| About half the worm's triangle closure is implied by its degrees | D | 0.108 / 0.199 = 0.54 |
| The estimate lets hubs join more than once | D | configuration-model derivation counts stub pairings including multi-edges; expected multi-edges are not negligible when k_max exceeds sqrt(2m) = 63 (AVAR 85) |
| With one bin the distance null is the random graph | D | one bin holds every pair; checked at runtime: 5.98 vs 5.92 |
| Distance alone leaves the index near 5 at any bin count | C | node sweep, 1 to 200 bins: 5.4, 5.1, 5.1, 5.0, 5.0, 5.1 (2, 10, 20, 50, 100, 200 bins) |
| Degree and distance falls to about 1.7 at 200 bins and keeps about 40% of real edges; swaps hit the 2,000-attempts-per-edge cap there; four times the swaps keep about 36%, index still below 2 | C | figure 1 readout at 200 bins (1.71 to 1.75 across seeds, 41 to 44% kept); node check with iters 10 vs 40: sigma 1.74 / 1.78, kept 0.415 / 0.357, cap reached in all 6 graphs both times; 18% at 20 bins, 12% degree only, 5% random |
| Gap junctions lower each index by a tenth or less and change none of the order | C | figure 1 with the toggle: 5.50, 4.56, 2.26, 2.11 vs 5.99, 5.07, 2.34, 2.18 (largest drop 10%) |
| 233 reciprocal pairs, 466 connections | C | `dataChecks`; figure 2 readout |
| Degree-preserving rewiring leaves about 60 reciprocal pairs; nearly four times | C | figure 2 readout: 62 (100 graphs), ratio 3.8 |
| Triad census values | C | `dataChecks` equals networkx `triadic_census` for all 16 classes; `runChecks` compares with brute force and pins MAN orientation (021D out-star, 111D one-way edge into the pair) |
| 111D, 111U, 201 enriched against degrees, depleted against degrees and reciprocal pairs | C | figure 2 default: +7/+9/+8 to about -20/-30/-25 |
| Most classes with a reciprocal pair look enriched against degrees alone | C | 7 of the 8 such classes have z > 2 at default (120C about 2) |
| Against reciprocal pairs every open class (021D, 021U, 021C, 111D, 111U, 201) is depleted; 5 of 7 closed enriched; 120C at chance; 030C depleted under both | C | figure 2 default (and the Python prototype): 021C about -5, the others below -19; 030T, 120D, 120U, 210, 300 above +12; 120C about 0; 030C -7 and -11 |
| Feedforward loop z about 2 and above 15 | C | figure 2 default: 2.2 and 16.6; 14.6 in the Python prototype (30 graphs) |
| At 3+ synapses: 745 connections, 29 reciprocal pairs, more than three times expected; same three classes go from about zero to depleted; FFL z near 7 and 10 | C | figure 2 at k = 3: 745, 29, 3.3x, FFL 7.0 and 10.2; 111D/111U/201 about +2 to about -5 to -8 |
| Rich club: 11 neurons with degree >= 44 (chemical plus gap) are Towlson's | C | `dataChecks` |
| 46 of 55 pairs among them joined; degree-preserving graphs give about 34; a random graph about 3 | C | node check: phi 0.836 (46/55) vs 0.617 +/- 0.053 over 50 swap graphs (33.9 pairs); G(n, m) density 2287 / 38781 = 0.059, x 55 = 3.2 |
| Watts and Strogatz 1998: 282 neurons, C 0.28 vs 0.05, L 2.65 vs 2.25; compared with film actors and the western US power grid; edges undirected, synapse or gap junction | S | Nature 393, 440 (Table 1 and text; data from Achacoso and Yamamoto 1992), read 2026-10-01 |
| Humphries and Gurney 2008 index | S | PLoS ONE 3, e0002051: S = (C/C_rand)/(L/L_rand), C mainly as transitivity, random graph with same n and m. Page notes the S / transitivity difference |
| Maslov and Sneppen 2002 swap procedure | S | Science 296, 910: A-B, C-D to A-D, C-B, rejecting swaps that duplicate an edge |
| Betzel and Bassett 2018 degree and edge-length preserving null on interareal connectomes | S | PNAS 115, E4880. (Roberts et al. 2016 was cited first; its null is weighted and does not keep degree, so it was replaced) |
| Newman 2003 configuration-model clustering formula | S | SIAM Rev 45, 167: C = (z/n)[(<k^2> - <k>)/<k>^2]^2, equal to the page's form; for transitivity |
| Milo et al. 2002: motifs; worm FFL z = 3.7 (125 vs 90 +/- 10); null keeps each node's in, out and mutual counts; 252 nodes, 509 edges, connections of 5+ synapses | S | Science 298, 824 and SOM. Our graph at the 5-synapse threshold: FFL z 4.3 and 4.7 (C, figure 2) |
| Batagelj and Mrvar 2001 triad census | S | Social Networks 23, 237 |
| Song et al. 2005: thick-tufted layer 5, rat visual cortex, about 4 times | S | PLoS Biol 3, e68: p = 0.116 (931 / 8,050), 218 of 4,025 pairs bidirectional vs about 54 expected |
| Towlson et al. 2013: 11 rich-club neurons, degree >= 44, degree-preserving null | S | J Neurosci 33, 6380: 279 neurons, undirected binary, M = 2,287 (equals our chemical plus gap pairs), normalised against 1,000 double-edge-swap networks |
| Varshney 2011: 279 = 302 - 20 pharyngeal - CANL, CANR, VC06; built on White et al. | S | PLoS Comput Biol 7, e1001066. Paper text says 6,393 chemical synapses and 890 gap junctions; the released tables sum to 6,394 and 887 (page uses the tables) |
| Synapses made en passant along processes, nerve ring neuropil without cell bodies | S | White et al. 1986, Phil Trans R Soc B 314, 1. Page wording "often far from either cell body" is a paraphrase, not a quote |
| c302 is MIT licensed | S | GitHub openworm/c302 LICENSE on master |

Source detail with quotes and URLs: `research/check/sources-03.md` (verification pass of 2026-10-01).

## Article 4: The Cost of Wire

Data: `worm-varshney.json`, `worm-anchors.json`, `macaque-fln.json`. Library additions in `shared/graph.js`: `linfit`, `cholSolve`, `placement` (quadratic solve, IRLS with backtracking for other exponents), `pinPrice`, `wireCost`; `runChecks` covers them (chain between anchors, golden-section search, vanishing gradient at zeta 1.5 and 3, linfit by hand) and `wireChecks` pins the shipped data to numpy and scipy (`tests/connectomes.html`, 57/57).

| Claim | Type | How we know |
|---|---|---|
| Cost function: (1/alpha) sum A_ij \|x_i - x_j\|^zeta + sum S_ik \|x_i - s_k\|^zeta + (1/alpha) sum M_il \|x_i - m_l\|^zeta; A both directions, chemical and gap alike, sign and polarity ignored; sensory not divided by alpha | S | Chen et al. 2006 PNAS 103, 4723, Eqs. 1 to 3 and text (PMC1550972; equation images read) |
| alpha = 29.3: 58.6 en passant synapses and NMJs per neuron over two neurites | S | Chen 2006, text after Eq. 3 |
| Worm more than ten times longer than wide; 1D model | S | Chen 2006: "The length of the worm is >10 times greater than its diameter" |
| zeta = 2 solution: each x_i the weighted average of partners and anchors | D | gradient of the quadratic set to zero; equals Chen's Eq. 5, x = Q^-1 [S s + M m / alpha] |
| Mean deviation 9.7%, median 5.2% (2011 wiring, gap junctions included, alpha 29.3) | C | `wireChecks` 0.09689 / 0.05203 equal to numpy `linalg.solve`; figure 1 readout |
| Published 9.71% mean, 5.10% median; random 34.6% | S | Chen 2006, "Comparison" section |
| Random layout misses by about 35% | D | E\|U - a\| = (a^2 + (1 - a)^2)/2 averaged over the 279 cell bodies = 0.3453; readout shows 34.5% |
| Anchored neurons 7.7%, the 80 unanchored 14.7%; 56 of those 80 are interneurons (12 sensory, 12 motor) | C | node check on the shipped files |
| zeta 1.5 and 3 at alpha 29.3: 10.6% and 10.5% ("about 10.5%"); 1.25 gives 12.0% | C | `wireChecks` against scipy L-BFGS-B (0.10578, 0.10470); figure readout at 1.25 (12.0%; numpy IRLS 0.1197) |
| Best near zeta 2 with alpha refit at each zeta (2: 9.7%; 1.5: 9.9% at alpha 20; 3: 10.2% at alpha 60) | C | numpy IRLS sweep over alpha in {5, 10, 20, 29.3, 40, 60, 100} |
| Chen's search: best near alpha 27, zeta 2, mean 9.71% | S | Chen 2006, "Robustness" section |
| alpha = 1: predicted positions spread less than half as widely as the real ones | C | node: SD of model positions 0.112 vs 0.260 for cell bodies |
| Real layout 4.2 times the optimum; internal 5.8, external 1.4; random about 16 | C | `wireChecks` 4.1765, 5.8455, 1.3606; readout random 16 (20 seeded layouts; numpy 15.7 over 200) |
| Chen's 1:4:16, internal 6.24, external 0.93, internal 91.7% of real cost | S | Chen 2006, "Comparison" section |
| AVG: cell body 0.22, model 0.71; pioneer of the right ventral cord during development | C, S | figure 1 side panel; Chen 2006 "Distribution of Synapse Locations" (citing Durbin 1987 thesis) |
| PVP and PVQ: tail pioneers growing forward; every known ventral-cord pioneer is an outlier | S | Chen 2006: "This group of neurons includes all developmental pioneers of the ventral cord currently known in C. elegans: AVG, PVPL/R, and PVQL/R"; "all pioneers are outliers" |
| Price formula (a_i - x_i)^2 / (Q^-1)_ii | D, C | minimising a quadratic with one coordinate fixed leaves a parabola of curvature 1/(Q^-1)_ii (Schur complement); `wireChecks` equals a direct pinned solve to 1e-9 |
| Costliest: AVAR 17.7%, AVAL 17.5%, PVCR 17.4%, PVCL 16.9%, DVA 13.4%, then DVC 13.0, PVQR 12.8, PVPR 10.8, AVG 10.7, PVQL 10.0 | C | `pinPrice` (node) equal to numpy (Q^-1 diagonal) to 0.1 |
| AVA, PVC, DVA among the most connected | C | strength chemical plus gap: AVAL 493, AVAR 478 (top two), PVCL 188 and PVCR 186 (6th, 7th), DVA 184 (9th) |
| Command interneurons have mostly inputs near the cell body | S | Chen 2006, "Directionality of Synapses": 12 neurons with >75% postsynaptic near the soma include all command interneurons but PVCR |
| Ten costliest pinned: 2.46 times the optimum, nearly half of the way to 4.2; the other 269 go from 8.4% to 9.3% | C | `wireChecks` 2.4592; figure readout (numpy 2.46, 0.0934 vs 0.0844); (2.46 - 1)/(4.18 - 1) = 0.46 |
| AVA's synapses lie along its process next to the cord motor neurons | C | article 5 ledger: about four fifths of AVA's output synapses onto cord motor neurons |
| Shared-wire model with rules for pioneers and command interneurons: 9.41% | S | Chen 2006, "Wiring Optimization Using the Shared-Wire Model" |
| Markov: 29 injected of 91 areas; FLNe = share of labelled neurons outside the injected area; spans about 5 orders of magnitude | S | Markov et al. 2014 Cereb Cortex 24, 17, abstract ("5 log units"); data 9.3e-7 to 0.76 over the 628 |
| Distances through white matter between area centres in a 3D atlas (M132) | S | Markov et al. 2014 J Comp Neurol 522, 225 (PMC4255240), methods quoted in `research/check/data-other.md` |
| Pooled lambda 0.16 per mm; e-fold 6.3 mm; tenfold 14 mm; R^2 26% | C | `wireChecks` 0.15955, 0.26408 equal to numpy `polyfit`; 1/0.1595 = 6.27; ln 10/0.1595 = 14.4 |
| 0.188 per mm, from the neuron-count distribution over distance; name "exponential distance rule" | S | Horvat et al. 2016 PLoS Biol 14, e1002512, Table 1 (macaque white matter 0.188) and text (p(d) of labelled neurons; credits Ercsey-Ravasz et al. 2013 Neuron 80, 184) |
| Residual SD 1.07 decades, log FLNe SD 1.24; height per target 32%; line per target 37% | C | figure 2 readout; numpy 1.07, 1.24, 0.325 (prints 32% in the page), 0.370 |
| Per-target lambda: MT 0.30, V2 0.28, TEO 0.25; 8l 0.082, 7A 0.085 (decay length about 12 mm) | C | figure 2 forest plot; numpy per-target polyfit |
| Residual against SLN (r = -0.42 with \|SLN - 0.5\|) not used | note | weak pathways have few labelled neurons and so extreme SLN by chance; confounded |

Source detail: `research/check/sources-04.md` (verification pass of 2026-10-02).

## Article 5: Reading the Matrix

Data: the same `worm-varshney.json`. Library additions in `shared/graph.js`: `eigh` (JAMA tred2/tql2), `fiedler`, `edgeSpan`, `avgControl`, `pearson`, `spearman`; `runChecks` covers them (path-graph Laplacian spectrum, A V = V L, Gramian summed directly, the T = 2 identity), and `dataChecks` pins the worm values against numpy 2.0.

| Claim | Type | How we know |
|---|---|---|
| Random order: two ends of a connection (n + 1)/3 = 93.3 rows apart on average | D | E\|i - j\| for distinct uniform positions in 1..n is (n + 1)/3; 50 seeded shuffles average 93.3 (node) |
| Edge spans: alphabetical 71, degree 80, cell type 65, body position 62, spectral 33 | C | figure 1 at runtime; node check with the same orders (71.0, 79.9, 65.4, 62.1, 33.0); numpy prototype 33.0 for the spectral order. Body and type orders break ties by name, so span depends slightly on tie order |
| Spectral order from the unweighted undirected Laplacian; lambda2 0.8847 | C | `dataChecks` against numpy `eigh` (0.88470, span 33.023) |
| Rank correlation with body position about 0.78 | C | `dataChecks` 0.7759 (scipy `spearmanr` 0.7759) |
| Ends of the spectral order: SIBDL, OLQVL, IL1VL, URAVL ... VB09, VD10, VD09 | C | node check, first and last ten |
| Sensory earlier, motor later on average; head motor classes RME, RMD, SIA, SIB near the head end, ahead of almost all interneurons | C | mean spectral rank sensory 95, inter 142, motor 179; within the head (ap < 0.25) sensory 71, motor 85, inter 120; each of the four classes' mean rank is ahead of 95 to 96% of interneurons |
| ALN and PLN: cell bodies in the tail, all chemical synapses with head neurons; spectral order puts them among head neurons | C | ap 0.82 to 0.83; 19 of 19 and 22 of 22 synapses (in plus out) with neurons of ap < 0.25; 85 to 100% of their ten neighbours on each side in spectral order have ap < 0.25. PLM was cut: PLML lands among head neurons, PLMR at rank 207 |
| AVA cell body in the head, placed toward the ventral cord; about four fifths of its synapses onto cord motor neurons | C | ap 0.13; spectral rank 196 and 212 of 279; output synapses onto VA/DA/VB/DB/VD/DD/AS: 121 of 143 (AVAL), 120 of 153 (AVAR) |
| Weighted Laplacian Fiedler vector localises; rank correlation with body position about 0; normalised brings it back | C | numpy prototype: weighted unnormalised rho 0.008, span 45.7, low end PLML, HSNL, VC05, ASJL; normalised rho -0.75 (sign arbitrary), span 33.1 |
| T = 1: every node scores 1; T = 2: 1 plus scaled squared weights, so exactly degree's ranks when unweighted | D | Gramian term t = 0 is e_i e_i^T (trace 1); t = 1 is A e_i e_i^T A^T (trace sum_j A_ji^2); `runChecks` T = 2 identity; figure 2 readout 1.00 (scores rounded to 10 digits before ranking) |
| Default network (weighted, chemical both ways plus gap junctions) over the grid (T 2 to infinite, eigenvalue 0.5 to 0.999 plus Gu's): rank correlation 0.62 to 0.91, Pearson 0.81 to 0.93; unweighted both above 0.74 | C | node sweep of all four network variants: weighted+gap rho 0.619 to 0.905, r 0.808 to 0.928; weighted chem rho 0.660 to 0.900, r 0.773 to 0.922; binary+gap rho 0.739 to 0.999, r 0.899 to 1.000; binary chem rho 0.742 to 0.999, r 0.880 to 1.000 |
| Default setting (Gu scaling, T infinite): r 0.82, rho 0.73; top scores AVAL, AVAR, PVCR, PVCL, AVDL, AVDR | C | `dataChecks` 0.8220 / 0.7339 equal to numpy; node top six |
| Gu scaling puts the largest eigenvalue at 0.991 for this network | C | xi = 115.2, xi/(1 + xi) = 0.9914 (0.963 unweighted) |
| Near-1 eigenvalue and infinite horizon: score becomes squared leading eigenvector entry (eigenvector centrality) | D, C | term 1/(1 - l^2) of the leading eigenvalue dominates as l -> 1; node check at c = 0.001: rank correlation with v1^2 1.000 for all four variants |
| Ring of m k-cliques: merging adjacent pairs raises Q when m > k(k - 1) + 2; 22 for k = 5 | D | with l = k(k-1)/2 and L = m(l + 1): Q_single = l/(l+1) - 1/m, Q_pairs = (2l+1)/(2(l+1)) - 2/m; difference positive iff m > 2l + 2. Diagram computes Q both ways (tie at 22: 0.86364) |
| sqrt(2 x 1961) = 62.6 | D | arithmetic |
| Ten mutually connected neurons make 45 edges | D | 10 x 9 / 2 |
| Gu et al. 2015: x(t+1) = Ax(t) + Bu(t); average controllability = trace of the infinite-horizon Gramian; 234 regions, 8 people x 3 DSI scans; r = 0.91 with strength between subject-averaged ranks; degree link derived in their supplement from (I - A^2)^-1 ~ I + A^2 | S | Nat Commun 6, 8414, Eq. 3, Results and Fig. 2b, Supp. Methods pp. 3-4. The paper normalises by the mean edge weight; A/(1 + lambda_max) is Tu et al.'s description and nctpy's default, so the page attributes it to later papers and the standard code |
| Tu et al. 2018: randomised networks give the same controllability-degree relation; rank-fit R^2 0.75 to 0.92 on four human datasets | S | NeuroImage 176, 83, abstract and Table 2. Wu-Yan et al. (J Nonlinear Sci 30, 2020) reports no correlation with degree and defines average controllability as Trace(W^-1); cut from the page |
| Fiedler 1973 (Czech Math J 23, 298); Atkins, Boman and Hendrickson 1998: minimise sum f_ij (x_i - x_j)^2 with sum x = 0, sum x^2 = 1 | S | SIAM J Comput 28, 297, Eq. 1 |
| Varshney 2011 drew the worm with normalised Laplacian eigenvector 2 as an axis (Fig. 2a, against processing depth) | S | PLoS Comput Biol 7, e1001066, Fig. 2; the axis separates head and neck neurons from ventral cord motor neurons |
| Newman and Girvan 2004 modularity; Fortunato and Barthelemy 2007: pairs of cliques beat single cliques iff (number) > (size)(size - 1) + 2, Eq. 20; sqrt(2L) bound, Eq. 21 | S | Phys Rev E 69, 026113; PNAS 104, 36 (paper writes n cliques of m nodes; the page uses m cliques of k nodes) |

Source detail with quotes and URLs: `research/check/sources-05.md` (verification pass of 2026-10-02).


## Article 6: Which Way Signals Flow

Data: `worm-varshney.json`, `larva-winding.json`. Library additions in `shared/graph.js`: `springRank` (conjugate gradient), `flowStats`, `randomDirections`, `cascade`, `decodeCSR`, `firstHop`; `runChecks` covers them (path graph, dense solve, undirected = both directions, pair totals kept, p = 1 cascade = BFS with stop nodes, one-connection crossing probability, first hop, CSR decode) and `flowChecks` pins the shipped data against numpy (`tests/connectomes.html`, 73/73).

| Claim | Type | How we know |
|---|---|---|
| 233 reciprocal pairs, about four times what the degrees produce | C | article 3 ledger (62 under degree-preserving rewiring, ratio 3.8) |
| SpringRank energy, Eq. 3 and 5, alpha as a spring to the origin, alpha matters less as networks get denser; sparse solvers handle millions of edges in seconds | S | De Bacco et al. 2018 Sci Adv 4, eaar8260 (`research/check/sources-06.md`) |
| Direction-shuffling null keeps A_ij + A_ji | S | same, "Statistical significance" section |
| 89% of synapses run down; energy 0.198 (alpha 0, chemical) | C | `flowChecks` 0.8896, 0.1976 equal to numpy; figure 1 readout |
| Shuffled: 58% down, energy 0.48 | C | node, 100 graphs: 0.5803 +/- 0.0049, 0.4784 +/- 0.0018; figure readout over 20 graphs 58.0%, 0.478 |
| 101 sensory, 73 inter, 105 motor neurons | C | node count of NemaNode roles in the shipped file |
| 3 of 105 motor neurons above the median interneuron; interneuron outranks motor neuron 94% of the time; sensory outranks inter 71%; 12 of 73 interneurons above the median sensory neuron | C | node: AUC 0.935, 0.710 (pairwise comparison), counts 3 and 12 |
| AIN and AIM near the top with almost no chemical input | C | AINL 0 input synapses (rank 5), AINR 2 (11), AIML 4 (12), AIMR 2 (8) |
| AVA, AVB, AVE rank 171st to 187th of 279 | C | AVAL 187, AVAR 183, AVBL 171, AVBR 182, AVEL 176, AVER 173 |
| Head motor RMD, SIA, SIB lower still, with the cord motor neurons | C | class mean ranks RMD 210, SIA 199, SIB 222; VB 214, DB 223, VA 227 (AVA 185) |
| Spectral order of part 5 put them with head neurons | C | article 5 ledger |
| VD and DD at the bottom; 84% of their input synapses from cord motor neurons (VA, VB, DA, DB, AS, VD, DD); most output in NMJs listed separately | C | class mean ranks VD 252, DD 272; 866 of 1,027 input synapses; WormAtlas NeuronConnect.xls has 153 NMJ rows (VD09 28, DD03 32 NMJs; DD05 1) not in the chemical graph |
| 11% of synapses run up (706 of 6,394; 438 of 2,194 connections) | C | node |
| Heaviest up: AVAL -> PVCL 10 (also AVAR -> PVCL 7, AVAL -> PVCR 6), SMD and RMD -> RIA; RIA sends SMD/RMD 174 synapses, gets 46 | C | node list of upward edges by weight; class sums |
| PLML: one chemical synapse, no inputs, three gap junctions; rank 1 at alpha 0, 21 at alpha 1, 85 at alpha 3, 80 with gap junctions | C | node and figure readout |
| Large alpha: s -> (d_out - d_in) / alpha; that order sends 77% down; rank correlation with the alpha = 0 order about 0.6 | D, C | Eq. 5 with alpha dominant; node: 0.7740 (limit), 0.777 at alpha 1000; Spearman 0.595 at alpha 1000, 0.580 at 1e5 (numpy 0.573 with ties in d_out - d_in) |
| Gap junctions: range 4.2 to 3.1, 88% down; DVB 71st to 138th | C | node: 4.196 vs 3.064; 0.8833 (`flowChecks`); DVB ranks |
| Gap junction both ways = level-pulling spring | D | (s_i - s_j - 1)^2 + (s_j - s_i - 1)^2 = 2(s_i - s_j)^2 + 2 |
| 3,016 neurons (480 input, 2,536 brain), about 548,000 synapses | S | Winding et al. 2023 |
| Released matrix 2,952 neurons; a-d 63,545 connections, 234,958 synapses; a-d is most of the network | C, S | `flowChecks`; all-all has 110,677 connections and 352,611 synapses (`research/check/datasets.md`); paper: "dominant synaptic network" |
| Cascade definition: p = 0.05 per synapse, each neuron active once, outputs stop, 1,000 runs, 8 hops, reached in most runs; a-d graph | S | paper methods and code (`sources-06.md`) |
| Brain is ten times larger than the worm's 279 | D | 3,016 / 279 = 10.8 |
| Olfactory and external gustatory reach more than 450 brain neurons within two hops; mean hop 3.4 and 3.3 | C | figure default (seeds k + 1): 471 and 475; 3.39 and 3.33 (numpy 3.382, 3.332) |
| Proprioceptive, mechano II/III, respiratory last at about 6 hops | C | 6.03, 6.09, 6.02 (numpy 6.052, 6.085, 6.009) |
| Median hop to DN-VNC 4 for smell and taste, 6 for proprioception and respiration | C | figure readout; equal in numpy |
| Paper: shortest paths for olfaction and gustation, longest for ascending somatosensory; DN-VNC in 3 to 6 hops, rarely more than 8 | S | Winding et al. 2023 |
| Paper 12% unimodal (8 hops); page 11.7% | S, C | paper text; `flowChecks` (numpy 11.8%). Their pipeline uses pair averaging and UpSet exclusions; ours is "exactly one modality" without pairing |
| p 0.025: 23.6%; p 0.1: 5.4%; threshold 0.75: 17.3%; 0.25: 6.2%; grid range 3.1% to 23.9%; olfactory mean hop 2.8 to 3.9 | C | node runs of the page's cascade at each setting (seeds k + 1); figure readout at p 0.1 gives 5.4% |
| Olfactory and both gustatory the three shallowest at all nine settings; respiratory, proprio, mechano II/III always among the four deepest | C | node: mean hop of reached brain neurons per modality, p in {0.025, 0.05, 0.1} x threshold in {0.25, 0.5, 0.75} |
| Paper's lowest-order layering: 545 (21%) 2nd, 1,410 (56%) 3rd, 377 (15%) 4th, 16 (<1%) 5th; none more than 4 hops | S | Winding et al. 2023 results |
| At published settings some neurons are first reached only at hop 7 or 8 | C | earliest hop over modalities, default: 13 at hop 7, 4 at hop 8 |
| Five-hop pathway shown functional; no 6- to 8-hop pathway tested | S | Winding et al. 2023 |
| Independent cascade model: Goldenberg, Libai & Muller 2001 | S | Winding et al. ref. 120 |

Source detail with quotes: `research/check/sources-06.md` (verification pass of 2026-10-02).
