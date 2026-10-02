# Sources for article 4 (verification pass of 2026-10-02)

## Chen, Hall & Chklovskii 2006, PNAS 103(12): 4723-4728 (PMC1550972)

Read from the PMC page; equations 2, 3 and 5 are images and were read directly.

- Eq. 2: C^int = 1/(2 alpha) sum_i sum_j A_ij |x_i - x_j|^zeta. Eq. 3: C^ext = sum_i sum_k S_ik |x_i - s_k|^zeta + (1/alpha) sum_i sum_l M_il |x_i - m_l|^zeta. Eq. 5: x = Q^-1 [S s + (1/alpha) M m], Q_ij = delta_ij ((1/alpha) sum_p A_ip + sum_k S_ik + (1/alpha) sum_l M_il) - (1/alpha) A_ij.
- "A ij ... representing the total number of synapses between neurons i and j in both directions ... matrix A is symmetric ... independent of synapse polarity"
- "making an average of 58.6 en passant synapses and neuromuscular junctions with only two neurites ... (alpha = 29.3 or 58.6 synapses per neuron divided between two neurites). Sensory neurons, on the other hand, typically send one specialized neurite to the sensory organ ... needs not be normalized."
- "We consider 279 neurons (pharyngeal and unconnected neurons excluded)"; "The length of the worm is >10 times greater than its diameter"
- "On average, the cost-minimized neuron is located at 9.71% of the worm body length away from the actual location. Half of the predicted positions lie within 5.10%"; random: "mean deviation from the actual position 34.6% and the median of 30.9%"
- "the total wiring cost of the actual network is almost four times greater than that of the optimized solution ... C int ... makes up 91.7% of total cost in the actual worm. This value is 6.24 greater than the internal cost from the predicted layout ... ratio of actual to predicted external costs ... 0.93"; "the total cost ratio of optimized to actual to random layout is 1:4:16"
- "The lowest mean deviation, 9.71%, is achieved by using the cost function with normalization coefficient ≈27 and exponent ≈2"
- "The top 10 outliers in the network are in the neuron classes PVQ, PVT, DVC, PVN, PVP, PVW, and PVC ... The biggest outliers in the head are AVA, AVG, and RID. In the midbody, SDQL, HSNL, and DA06"
- "This group of neurons includes all developmental pioneers of the ventral cord currently known in C. elegans: AVG, PVPL/R, and PVQL/R ... all pioneers are outliers ... (P = 0.002)"; AVG "sends the first posterior-directed projection into what eventually becomes the right ventral cord" (ref. 39, Durbin 1987 PhD thesis, Cambridge); PVP and PVQ "are born in the tail and send pioneering processes forward"
- Command interneurons: "a small group of 12 neurons with predominately postsynaptic terminals (>75%) near the cell body ... includes all, except PVCR, of the command interneurons"
- Shared-wire model with rules for command interneurons and pioneers: "mean deviation of 9.41%"

Our reproduction on the 2011 wiring (Varshney et al.) with the WormAtlas fixed points: 9.69% / 5.20%, random 34.5% (exact expectation), cost ratio 4.18, internal 5.85, external 1.36, random 15.7. Same top outlier classes. The external ratio differs from the paper's 0.93; the wiring version is the likely cause (not checked further).

## Markov et al. 2014, Cereb Cortex 24: 17-36 (PMC3862262, CC BY-NC)

- Abstract: 29 injected areas in a 91-area parcellation; FLNe weights "range 5 log units".
- The supplementary table (core-nets.org `Cercor_2012 Table.xls`, archived 2022-04-28) has one row per labelled source per injection: CASE, MONKEY, SOURCE, TARGET, FLNe, NEURONS, STATUS.
- Repeat-injection averaging: the paper discusses geometric means of neuron counts for ordering (Fig. 3) and lognormal fits; it does not state one averaging rule for a published matrix in the text read. We use the arithmetic mean over a target's injections with 0 for an unlabelled injection, and say so in the caption.

## Markov et al. 2014, J Comp Neurol 522: 225-259 (PMC4255240, CC BY)

- Table 2: To, From, SLN(%), Dist(mm), 628 pathways into 7A, 8L, 8m, MT, STPc, TEO, TEpd, V1, V2, V4, DP. Distances "measured through the white matter in a 3D reconstruction of the M132 brain atlas ... between geometric centers of cortical areas" (see data-other.md).

## Horvát et al. 2016, PLoS Biol 14(7): e1002512 (PMC4956175)

- Table 1: macaque lambda_exp (white matter) 0.188 mm^-1; mouse 0.78. Text: "exponential decay of the wiring probability p(d) with projection distance d ... (in the macaque lambda ≅ 0.19 mm^-1, corresponding to a decay length of 1/lambda ≅ 5.2 mm)", citing Ercsey-Ravasz et al. 2013 (Neuron 80, 184) for the macaque data. The fit is to the distribution of labelled neurons over distance, not to per-pathway FLNe.
