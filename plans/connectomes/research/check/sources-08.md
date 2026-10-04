# Sources for article 8 (verification pass of 2026-10-04)

Full texts cached under `scripts/connectomes/.cache/papers/`: witvliet2021 and cook2019 (PMC OAI XML, author manuscripts PMC8756380 and PMC6889226), ripoll2023 (Europe PMC XML, PMC7615469), berg2025 (PMC OAI XML, PMC12636603). Converted to `.txt` for reading.

## Witvliet, Mulcahy, Mitchell et al. 2021, Nature 596: 257

- Brain = "its circumpharyngeal nerve ring and ventral ganglion"; eight isogenic individuals; "three L1, two L2, and one L3" in Methods wording, but NemaNode and `dataset_info.py` give stages L1 x4, L2, L3, adult x2 (datasets 5 and 6 are L2 and L3). The article follows the data files.
- "total number of chemical synapses increased 6-fold (~1300 at birth to ~8000 in adults)"; body length "~250μm to ~1150μm".
- Classes, Methods "Connection classification": quoted in the ledger. Adult partition "~43%" stable and variable, "~14%" dynamic; stable "6.6±5.8 versus 1.4±1.0 synapses per connection"; "~72%" of synapses.
- "About 43% of all cell-cell connections – accounting for 16% of all chemical synapses – are not conserved between isogenic animals."
- Extended Data Fig. 6d: variable 78% vs non-variable 93% in polyadic configuration with stable connections; 6g: no synapse threshold removes only variable connections.
- Extended Data Fig. 9b: "Re-annotation of the N2U adult connectome (Cook et al. 2019) added 1109 new connections ... suggests the use of different annotation criteria from the original annotation."
- Hubs gain inputs, not outputs (Extended Data Fig. 1f-h); interneuron connections most stable (Fig. 2d, Extended Data Fig. 7a); modulatory neurons more variable outputs (Extended Data Fig. 6j).
- The text's "4500 new synapses strengthened most connections present at birth" and "mean synapse number per connection 1.7 to 6.9" do not match a direct count on the NemaNode lists (synapses on the 775 newborn connections go from 1,296 to 4,177 adult mean; all connections 1.7 to 3.4-3.6 per connection), presumably because of normalisation or a different connection set. Not used.

## Cook, Jarrell, Brittin et al. 2019, Nature 571: 63

- 460 / 579 nodes; 302 / 385 neurons; "8 neurons and 16 sex muscles are specific to the hermaphrodite; 91 neurons and 39 sex muscles are specific to the male"; shared nervous system of 294 neurons.
- "In the male, 67% of the shared neuron classes (62 out of 93 classes) receive input from sex-specific neurons, accounting for 16% of their total input."
- Copulation network "85 male-specific and 64 shared neurons".
- Left/right variability: "edge weights varied by 10–40%"; "Gap junctions were more variable".
- Sex z: Methods (LOESS, tricube, 100 pairs). "We tested six chemical connections by in vivo synaptic labelling and confirmed that each exhibited a difference"; "A further six have been experimentally verified by others" (ref 42, Oren-Suissa, Bayer & Hobert 2016, Nature 533: 206). SI 9 marks five Oren-Suissa pairs in the chemical sheets.
- "as many as 10–30% of the substantial connections (more than three serial EM sections) ... may represent connections that differ substantially in strength between the sexes."
- Gap filling: posterior ventral cord (herm), anterior ventral cord and pharynx (male) from the other sex; a remaining posterior gap filled by extrapolation. "should be considered a conceptualization".
- Supplement quirks found while parsing: SI 9's gap-junction all-pairs sheet is a copy of the H>M sheet; three gap pairs appear in both direction sheets with different weights; two chemical rows are exact duplicates; the confirmation flags are cell fills, not values.
- Variance function: local constant (Nadaraya-Watson) tricube smoother of (L - R)^2 on (L + R)/2, width = distance to the 100th nearest pair; halved. Reproduces SI 8 sd and SI 9 Z for every row (chemical and gap). Local linear and quadratic fits miss by up to 40 to 60 in variance.

## Ripoll-Sanchez, Watteyne, Sun et al. 2023, Neuron 111: 3570

- Densities "0.3437" short, "0.4429" mid; synaptic "0.0251", monoamine "0.0236".
- "35% in the short-range network" single-couple pairs; "9%" six or more; AVD-PQR 18 couples (original matrices).
- Methods: synaptic network = Varshney et al. somatic connectome plus the pharyngeal network of Albertson and Thomson.
- Hubs: "Six neurons (AVKL/R, PVQL/R, PVT, and PVR) had a higher short-range neuropeptide degree than any of the synaptic rich club neurons"; all 11 rich-club members among the 25 highest-degree nodes; degree correlation r = 0.53 (Fig. 6G legend r = 0.54); AVK, PVT, BDU, RID express no classical transmitters or monoamines; PVQ "preponderance of dense-core vesicles".
- Pharynx: "All pharyngeal neuron classes receive 90% or more of their incoming connections from outside the pharynx" (mid-range); CAN "completely lack chemical synapses".
- Models: short-range "within the same neuronal bundle"; mid-range "between different bundles within the same body region"; long-range "between neurons in different body regions". 92 NPP-GPCR couples; CeNGEN threshold 4; EC50 500 nM (README).
- The repository's matrices were updated 2024-02-02 (dmsr-5, npr-34): densities unchanged to four places for short-range, mid 0.4428; DVA (464) now above AVKL/R (459), so four neurons, not six, outrank the rich club; max couples 19 (PQR-AVDL).

## Berg, Beckett, Costa et al. 2026, Cell 189: 5504 (bioRxiv 2025.10.09.680999; PMC12636603)

- Abstract: 166,691 neurons, 11,691 types; "7,205 isomorphic, 114 dimorphic, 262 male-specific and 69 female-specific types".
- Edge test: noise thresholds (< 8 male, < 11 FlyWire), male weights scaled by 0.581, t = mean difference over pooled L/R sd, BH FDR, 30% difference; "edges involving two isomorphic cell types: 11% of these edges (72.2k) were flagged"; "reviewing the 500 isomorphic types ... led to <5 changes"; "most apparent differences ... explained by segmentation issues or inconsistent cell type definitions"; excluded as likely false positives.
- "6.3% of edges in the male and 1.3% of edges in the female central brain are dimorphic".
- "13 out of 305 clusters ... 300 of 413 (72%) non-isomorphic types"; remaining 113 "highly integrated into the isomorphic subgraph".
- The released `mcns_fw_edge_comp.feather` (commit 67767d2 of flyconnectome/2025malecns) has 3,761,792 rows; recomputing flags from its `p_corr` gives 179k at p <= 0.1 (paper 381k) and 762k above the noise thresholds (paper 721k), so the file's columns are not the paper's pre-correction test. Fly numbers in the article are quoted from the paper only.
