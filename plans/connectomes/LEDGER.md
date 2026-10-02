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
