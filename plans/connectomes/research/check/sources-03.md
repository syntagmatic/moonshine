# Source check for 03-surprising-compared-to-what.html (2026-10-01)

All checks done this session against primary text (full text where noted). Local copies of
downloaded texts sit beside this file (ws.txt, ms.txt, milo.txt, roberts.txt, triads.txt,
mow.txt, towlson.txt, vsrc/ LaTeX, nsrc/ LaTeX, hg_e00*.png, song_fig2.png).

## 1. Watts & Strogatz 1998, Nature 393, 440-442. CONFIRMED (with detail)
Source: full PDF, https://snap.stanford.edu/class/cs224w-readings/watts98smallworld.pdf
Table 1 rows (L_actual, L_random, C_actual, C_random):
- "Film actors 3.65 2.99 0.79 0.00027"
- "Power grid 18.7 12.4 0.080 0.005"
- "C. elegans 2.65 2.25 0.28 0.05"
Legend: "compared to random graphs with the same number of vertices (n) and average number of
edges per vertex (k). (Actors: n = 225,226, k = 61. Power grid: n = 4,941, k = 2.67.
C. elegans: n = 282, k = 14.) ... For C. elegans, an edge joins two neurons if they are
connected by either a synapse or a gap junction. We treat all edges as undirected and
unweighted, and all vertices as identical, recognizing that these are crude approximations."
Text: "the electrical power grid of the western United States, and the neural network of the
nematode worm C. elegans [17]". Ref 17 = Achacoso & Yamamoto, AY's Neuroanatomy of C. elegans
for Computation (CRC Press, 1992). Mean degree k = 14.

## 2. Humphries & Gurney 2008, PLoS ONE 3(4), e0002051. CONFIRMED (notation note)
Source: PMC2323569 full text + equation images from journals.plos.org.
Title: "Network 'small-world-ness': a quantitative method for determining canonical network
equivalence". Eq. 3: gamma_g = C^Delta_g / C^Delta_rand; Eq. 4: lambda_g = L_g / L_rand;
Eq. 5: S^Delta = gamma_g / lambda_g. Also S^ws using the Watts-Strogatz (mean local) C.
"A network is said to be a small-world network if S^Delta > 1". Random reference = matched
random graph, "same number of nodes and edges". They call it S (S^Delta, S^ws), not sigma; they
"consider mainly C^Delta" (transitivity, triangle-based), reporting C^ws where it differs.

## 3. Maslov & Sneppen 2002, Science 296, 910-913. CONFIRMED
Source: arXiv cond-mat/0205380 (journal_ref Science 296, 910-913 (2002)).
"Randomized versions of these two networks were constructed by randomly reshuffling links,
while keeping the in- and out-degree of each node constant. A convenient numerical algorithm
performing such randomization consists of first randomly selecting a pair of directed edges
A->B and C->D. The two edges are then rewired in such a way that A becomes connected to D,
while C to B. However, in case if one or both of these new links already exist in the network
this step is aborted and a new pair of edges is selected."
(Applied to yeast protein interaction and regulatory networks.)

## 4. Roberts et al. 2016, NeuroImage 124(Pt A), 379-393. CITATION CONFIRMED; NULL DESCRIPTION WRONG
Source: full text PDF, https://publications.qimrberghofer.edu.au/attachment/download/866
Authors: Roberts JA, Perry A, Lord AR, Roberts G, Mitchell PB, Smith RE, Calamante F,
Breakspear M. doi 10.1016/j.neuroimage.2015.09.009. Issue dated Jan 2016 (online 2015).
What the null preserves: weighted, nearly fully connected tractography matrices (513 regions,
75 adults). Edge weights are de-trended for fibre length (cubic fit of log weight in mean,
then variance), shuffled, trends restored -> "a random reference graph that, by construction,
preserves the edge weight distribution and low-order weight-distance relationship of the
empirical data". Then an iterative correction gives strength-preserving (W_SP) or
strength-sequence-preserving (W_SSP) variants. It does NOT preserve degree, and the paper
contrasts itself with Samu et al. 2014 (Maslov-Sneppen rewiring that keeps total wiring length;
"although the total wiring length is preserved, the distance distributions are not") and says
its method "will not work for sparse networks ... nor binary networks".
Appendix A floats binning by length and shuffling within bins as an alternative, not used.
Correct source for "degree sequence + edge-length distribution preserving" null:
Betzel & Bassett 2018, PNAS 115(21), E4880-E4889 (PMC6003515): "a randomized null model in
which a network's degree sequence and edge weight distribution were exactly preserved and in
which a network's connection length distribution and length-weight relationship were preserved
approximately" (interareal connectomes: mouse, macaque, human). This is netneurotools'
match_length_degree_distribution, which cites Betzel & Bassett 2018.
Also relevant: Roberts abstract: geometry makes "a major, but not definitive, contribution".

## 5. Newman 2003, SIAM Review 45(2), 167-256. CONFIRMED (equivalent form)
Source: arXiv cond-mat/0303516 LaTeX source, section on the configuration model:
"We can also find an expression for the clustering coefficient ... of the configuration model.
A simple calculation shows that [EMB02, Newman03b]
C = (1/(n z1)) [z2/z1]^2 = (z/n) [ (<k^2> - <k>) / <k>^2 ]^2"
With z = <k>, this equals (<k^2> - <k>)^2 / (n <k>^3). Newman credits Ebel, Mielsch &
Bornholdt 2002 (Phys Rev E 66, 035103) and Newman 2003 (Handbook of Graphs and Networks).
Also notes it can exceed 1 for heavy tails (alpha < 7/3) where the formalism breaks down.

## 6. Milo et al. 2002, Science 298, 824-827. CONFIRMED (worm graph details below)
Source: full PDF, https://www.cs.cornell.edu/courses/cs6241/2019sp/readings/Milo-2002-motifs.pdf
Table 1 row: "C. elegans 252 [nodes] 509 [edges] | FFL 125, 90 +/- 10, Z 3.7 | bi-fan 127,
55 +/- 13, Z 5.3 | bi-parallel 227, 35 +/- 10, Z 20".
Legend: "synaptic connections between neurons in C. elegans, including neurons connected by at
least five synapses (24)"; ref 24 = White, Southgate, Thomson, Brenner, Phil Trans R Soc B 314,
1 (1986). Text: "Nodes represent neurons (or neuron classes), and edges represent synaptic
connections". Z = (Nreal - Nrand)/SD, 1000 randomized networks.
Null, note 17: "The randomized networks used for detecting three-node motifs preserve the
numbers of incoming, outgoing, and double edges with both incoming and outgoing arrows for each
node. The randomized networks used for detecting four-node motifs preserve the above
characteristics as well as the numbers of all 13 three-node subgraphs". So per-node in, out and
mutual-edge counts (stronger than "mutual edge counts" globally).
Note: whether "synaptic" includes gap junctions is not stated in the paper.

## 7. Batagelj & Mrvar 2001, Social Networks 23(3), 237-243. CONFIRMED
Source: author preprint (Wayback copy of http://vlado.fmf.uni-lj.si/pub/networks/doc/triads/triads.pdf);
Crossref: doi 10.1016/S0378-8733(01)00035-1, July 2001.
Title: "A subquadratic triad census algorithm for large sparse networks with small maximum
degree". Abstract: "In the paper a subquadratic (O(m), m is the number of arcs) triad census
algorithm for large and sparse networks with small maximum degree is presented. The algorithm is
implemented in the program Pajek." Contrasts with Moody 1998's O(n^2).

## 8. Song et al. 2005, PLoS Biol 3(3), e68. CONFIRMED
Source: PMC1054880 full text + Figure 2 image.
"We studied connectivity among thick tufted layer 5 neurons in rat visual cortex with quadruple
whole-cell recordings". "the rate of connectivity was p = 11.6% (931 connections out of 8,050
possible connections)". "We find that the actual number of bidirectionally connected pairs is
four times that of the expected numbers (p < 0.0001)". Fig. 2A: P = 0.116 x 0.116 = 0.0135.
Fig. 2B counts: unconnected 3312, unidirectional 495, bidirectional 218 (4,025 pairs).
Expected bidirectional = 4025 x 0.0135 = 54; 218/54 = 4.0 (bar about 4.1x). Unidirectional
is under-represented (about 0.65x).

## 9. Towlson et al. 2013, J Neurosci 33(15), 6380-6387. CONFIRMED (graph clarified)
Source: PMC4104292 full text.
"N = 279 neurons (the 282 nonpharyngeal neurons excluding VC6 and CANL/R, which are missing
connectivity data) and M = 2287 synaptic connections ... An undirected binary form of the
network was used to characterize rich club topology."
Rich club: "There are 11 neurons in this rich club: eight are located anteriorly in the
lateral ganglia of the head (AVAR/L, AVBR/L, AVDR/L, AVER/L) and three are located posteriorly
in the lumbar (PVCR/L) and dorsorectal (DVA) ganglia". "we will focus on more detailed analysis
of the rich club defined by degree threshold k = 44. This is the lowest degree threshold in the
range 44 <= k < 53 that satisfies the most conservative statistical 3 sigma criterion".
Rich club = nodes with degree >= 44 (equivalently > 43). Table 1 degrees: AVAR 94, AVAL 93,
AVBL 76, AVBR 75, AVER 57, AVDR 56, AVEL 56, ...
Graph: the paper says only "synaptic connections". Recomputed from the repo's Varshney data
(docs/connectomes/shared/data/worm-varshney.json): undirected chemical pairs 1,961 + gap pairs
514 -> union 2,287 exactly; so M = 2287 is chemical + gap junctions, undirected. In that union
graph k >= 44 gives exactly these 11 (AVDL is 44); chemical only gives 10 (AVDL 42). Union
degrees run 1 lower than Table 1 (AVAR 93 vs 94), likely a data-release difference.
Normalisation: "normalized relative to the rich club curves of 1000 comparable random networks.
The random networks were generated by performing multiple (100 x M) double edge swaps ... This
permutation procedure ensures that the number of nodes and edges, and the degree distribution
... are all conserved". Phi_norm = Phi / Phi_random.

## 10. Varshney et al. 2011, PLoS Comput Biol 7(2), e1001066. CONFIRMED (6,393 in paper)
Source: published text has numbers as images; checked against arXiv 0907.2373v4 LaTeX source
(same text) and the PMC abstract/text.
"The C. elegans nervous system contains 302 neurons and is divided into the pharyngeal nervous
system containing 20 neurons and the somatic nervous system containing 282 neurons. ... Since
neurons CANL/R and VC06 do not make synapses with other neurons, we restrict our attention to
the remaining 279 somatic neurons. The wiring diagram consists of 6393 chemical synapses, 890
gap junctions, and 1410 neuromuscular junctions." "The new version of the wiring diagram
incorporates original data from White et al." Abstract: "Using materials from White et al. and
new electron micrographs we assemble ...". Gap network: "279 neurons and 514 gap junction
connections, consisting of one or more junctions"; chemical: "279 neurons and 2194 directed
connections". Note: the released data file (NeuronConnect) sums to 6,394 chemical synapses and
887 gap junctions; the paper says 6,393 and 890.

## 11. White et al. 1986, Phil Trans R Soc B 314(1165), 1-340. CONFIRMED IN SUBSTANCE
Source: abstract (Crossref) and full text at WormAtlas "Mind of the Worm"
(https://www.wormatlas.org/MoW_built0.92/MoW.html).
Abstract: "Processes from neurons run in defined positions within bundles of parallel
processes, synaptic connections being made en passant." Text: "Chemical synapses in C. elegans
occur en passant between neighbouring parallel processes." "Synaptic contacts are made en
passant between adjacent processes". "An extensive region of neuropile, the circumpharyngeal
nerve ring, encircles the centre region of the isthmus and has cell bodies clustered adjacent
to it". "The neuropile of the nerve ring also excludes cell bodies". Ventral cord is the other
main synaptic region (e.g. AVA/PVC synapse along the cord).
I found no sentence saying "synapses are not made on cell bodies"; that part is an inference
from the above (synapses between processes in neuropile that excludes cell bodies). Phrase it
as "between processes in the neuropil" rather than attributing "not on cell bodies" to White.

## 12. OpenWorm c302 licence. CONFIRMED
GitHub API repos/openworm/c302: license MIT (spdx MIT); LICENSE on master:
"MIT License / Copyright (c) 2024 OpenWorm".

## Process note
While locating an open copy of Roberts 2016, one Unpaywall API query was sent with the user's
email as the required contact parameter. It should not have been; no other use.
