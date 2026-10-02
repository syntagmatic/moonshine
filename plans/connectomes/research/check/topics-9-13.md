# Fact check: REPORT.md Topics 9 to 13, Section 7, Section 9

Checked 2026-09-30 against primary sources (Europe PMC / PMC full text, Crossref metadata, publisher pages). Line numbers refer to `plans/connectomes/research/REPORT.md` as of this date.

Verdict key:

- **confirmed**: matches the cited source.
- **wrong**: the source says something different (value, direction, venue, or mechanism).
- **overstated**: direction right, magnitude or certainty inflated, or scope stretched.
- **unverifiable**: not in the cited source and no other source found; may be true.
- **invented**: specific numbers or entities that do not appear in the cited source and are inconsistent with it or with known data (typically made-up inputs with correct arithmetic done on them).

## Overall

The pattern you suspected holds. The qualitative framing of each topic is mostly sound, the headline numbers that come straight from paper abstracts are usually right, and nearly every "(d) worked numerical example" is built on invented inputs with correct arithmetic done on them. The arithmetic checks out in every case I recomputed (Z-scores, p-values, ratios, storage costs), which is presumably why the self-audit passed. The inputs are the problem. There are also a few real inversions: the fly EM completeness claim (Fact 5) has pre- and postsynaptic completeness swapped, and Fact 8 and the Topic 9 example put Mi9 on the wrong side of the T4 dendrite. The bibliography has a DOI error rate of about 20%: 8 DOIs resolve to unrelated papers, 6 return 404, and several titles are paraphrased or invented.

---

## Topic 9: From wiring to function (lines 1489 to 1682)

| Claim | Line | Verdict | Correct value / source |
|---|---|---|---|
| Takemura 2013 is a connectome-constrained deep network of motion detection (with Lappalainen 2024) | 1510 | wrong | Takemura 2013 is an anatomical reconstruction with no trained model. Only Lappalainen 2024 trains a model. https://doi.org/10.1038/nature12450 |
| Takemura 2013 used FIB-SEM | 1572, 1596 | wrong | Serial-section TEM, 40 nm sections, 379 neurons, 8,637 synapses in the medulla. FIB-SEM came with Takemura 2017 (eLife 6:e24394). https://pmc.ncbi.nlm.nih.gov/articles/PMC3799980/ |
| Takemura 2013 found Mi4, Mi9, CT1 inhibitory inputs to T4 and "confirmed a hybrid HR/BL mechanism" | 1572 | wrong | Mi4, Mi9 and CT1 do not appear in the 2013 paper. It identified Mi1 and Tm3 as the main T4 inputs, plus C3 (about 10x fewer). The full input set (Mi1, Tm3, TmY15, Mi4, Mi9, C3, CT1) is from Takemura 2017, which also could not reproduce the 2013 Mi1/Tm3 offset. https://elifesciences.org/articles/24394 |
| T4a dendrite receives exactly 384 inputs: Mi1 82, Tm3 68, Mi4 38, Mi9 44, CT1 31, other 121 | 1596 to 1604 | invented | No such counts in Takemura 2013, which has no Mi4, Mi9 or CT1 at all. Per-type T4 input counts exist in Takemura 2017 and in FlyWire/optic-lobe data, and could be pulled from those. |
| Input centroids Tm3 +1.1 deg, Mi1 0.0, Mi9 -1.2, Mi4 -1.4 (both inhibitory inputs on the leading edge) | 1608 to 1612 | invented; layout wrong | 2013: Mi1/Tm3 centroids offset by less than one inter-ommatidial distance, and later not reproducible. Actual layout (Borst, Haag, Mauss 2020, from Takemura 2017 and Shinomiya 2019): Mi9 on the preferred side; Mi1, Tm3 and TmY15 in the centre; Mi4, C3 and CT1 on the null side. Mi9 and Mi4 are on opposite sides. https://pmc.ncbi.nlm.nih.gov/articles/PMC7069908/ |
| Mechanism: Mi1 is "delayed", Tm3 "fast"; PD coincidence of the two; ND shunting by Mi4 and Mi9 | 1613 to 1624, 1573 | wrong | Mi1 and Tm3 are both fast band-pass inputs. Mi4 and Mi9 are the slow low-pass inputs. PD enhancement comes from Mi9 (OFF-centre, glutamatergic via GluCl-alpha) on the preferred side: a bright edge first silences Mi9, which raises input resistance for the Mi1/Tm3 excitation that follows. ND suppression comes from Mi4 (GABAergic, low-pass) on the null side. Borst 2020 also flags the controversy: no PD enhancement in T4 membrane potential (Gruntman 2018), and Mi9 silencing does not reduce ON responses (Strother 2017). |
| Model "matches patch-clamp T4 null-direction shunting to within 4% of observed spike rates" | 1626 | invented | No source. T4 responses are usually measured as graded voltage or calcium signals. |
| Borst, Haag, Mauss 2020 JCPA 206:109-124 exists | 1573 | confirmed (citation); content wrong | Citation is correct. The mechanism attributed to it is wrong (see above). |
| Lappalainen 2024: Nature 634:889-897; model masked by the FlyWire visual connectome | 1574 | wrong | Nature 634:1132-1140. Connectivity for 64 cell types came from earlier Janelia optic-lobe EM reconstructions, not FlyWire. Predictions agreed with measurements from 26 studies. https://doi.org/10.1038/s41586-024-07939-3 |
| Seelig and Jayaraman 2015; Kim et al. 2017 ring attractor, E-PG bump tracks heading | 1575 | confirmed | https://doi.org/10.1038/nature14446 ; https://doi.org/10.1126/science.aal4835 |
| Hulse 2021 eLife 10:e66038 | 1576 | wrong (ID) | e66039. Actual title: "A connectome of the Drosophila central complex reveals network motifs suitable for flexible navigation and context-dependent action selection". The E-PG/P-EN/P-EG loop description is fine. |
| Ring model: "Delta7 / P-EG (global inhibitory feedback)" | 1521 | wrong | P-EG neurons are excitatory recurrent PB-to-EB neurons. Delta7 (glutamatergic) supplies the inhibition. The J0 + J2 cos kernel is a textbook CANN, not a fit to the fly data. |
| Shiu 2024: 139,255 neurons, 54.5M synapses | 1577 | wrong | The model uses FlyWire materialization v630: 127,400 proofread neurons ("more than 125,000 neurons and 50 million synaptic connections"). 139,255 / 54.5M is the later v783 count from Dorkenwald 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC11446845/ |
| Shiu 2024: "resting dynamics predict behavioral motor activation" | 1577 | wrong | The model activates specific sensory neurons (Poisson input to sugar, water, bitter GRNs and JONs) and reads out MN9 and other neurons. It does not use resting dynamics. |
| g0 = 0.27 nS unitary conductance "typical in Drosophila models" | 1545 | wrong | Shiu uses W_syn = 0.275 mV per synapse (a voltage jump, not a conductance), V_rest = V_reset = -52 mV, V_th = -45 mV, tau_m = 20 ms (10 kOhm cm2 x 2 uF/cm2), synaptic tau = 5 ms, delay 1.8 ms, refractory 2.2 ms. |
| Worked PER example: 12 sucrose GRNs, G2N 348 synapses / 8 cells, "FBN" layer 512/14, premotor 890/22, 184 synapses onto MN9, R_in 250 MOhm, tau 5 ms, V_rest -65 mV, 60.2 mV depolarization, 6 spikes in 35 ms "exactly matching in vivo electrophysiology" | 1628 to 1652 | invented | None of these numbers appear in Shiu 2024. There is no "FBN" cell type (G2N-1 is real). The paper's parameters differ throughout (above). The arithmetic is internally correct (49.68 nS x 65 mV x 250 MOhm / 13.42 = 60.2 mV), but the formula applies a steady-state conductance to a synapse count, and there is no MN9 in vivo recording to match. |
| Lee 2016: pairs with delta-theta < 15 deg connect 2.8-fold more than orthogonal pairs | 1578 | invented | The paper bins orientation difference in 22.5 deg steps (0 to 22.5, ..., 67.5 to 90). It has 29 connected pairs out of 1,980 tested, a significant trend (Cochran-Armitage P < 0.05), and states no fold-change. PSD area is >1.0 um2 for some similar pairs and 0.24 +/- 0.03 um2 for the most dissimilar pairs. https://pmc.ncbi.nlm.nih.gov/articles/PMC4844839/ |
| Like-to-like model cites Bock 2011 | 1549 | wrong | Bock 2011 found that inhibitory interneurons receive convergent input from excitatory cells with a broad range of orientations. That is the opposite of like-to-like. https://doi.org/10.1038/nature09802 |
| Better like-to-like source | n/a | recommendation | MICrONS Consortium 2025, Nature 640:435-447 (https://doi.org/10.1038/s41586-025-08790-w) and Ding et al. 2025, Nature 640:459-469 (https://doi.org/10.1038/s41586-025-08840-3). In these papers the feature (not spatial) component of tuning predicts connections beyond axon-dendrite proximity, across layers and areas, including feedback. |
| Bargmann 2012 and Bentley 2016: ">250 neuropeptides and monoamines" | 1579 | overstated | Both papers exist. The count is loose: C. elegans has over 100 neuropeptide genes encoding a few hundred peptides. "Proving a static graph supports multiple states" is Bargmann's argument, not a proof. |
| "(e)2 tree shrew and macaque V1 deviate substantially from like-to-like" | 1659 | wrong | Tree shrew V1 is the classic example of orientation-specific (like-to-like) long-range horizontal connections (Bosking et al. 1997, J Neurosci 17:2112). |
| "(e)3 in darkness the bump drifts and degrades within 5 to 10 s" | 1660 | wrong | The bump persists in darkness and keeps tracking self-rotation, with slowly accumulating drift (Seelig and Jayaraman 2015; Kim 2017). It does not degrade in seconds. |
| Figure 9.3: peripheral sensory neurons become peptidergic hubs | 1679 | wrong | See Fact 4 below. The top peptidergic hubs are AVK, PVQ, PVT and PVR (then BDU, HSN, RID), and peptidergic degree correlates positively with synaptic degree (r = 0.53). |

## Topic 10: Mushroom body randomness (lines 1683 to 1854)

| Claim | Line | Verdict | Correct value / source |
|---|---|---|---|
| About 50 glomeruli / PN types, about 2,000 KCs per side | 1687 | confirmed | Zheng 2022 says about 2,200 KCs per side. https://doi.org/10.1016/j.cub.2022.06.031 |
| LSH collision probability Pr = f(1 - theta/pi) | 1712 | wrong (misapplied) | 1 - theta/pi is the SimHash (sign random projection) collision probability. It is not derived in Dasgupta 2017 for the sparse binary expansion with WTA. |
| Caron 2013: 200 KCs, light-level clonal labelling, claw count k = 4.2 +/- 1.1, binomial sampling | 1755 | wrong | 200 KCs by photoactivation (PA-GFP) plus dye electroporation. KCs had 2 to 11 claws (average 7), about 3 glomerular inputs identified per KC, tested against 1,000 shuffled datasets (not a binomial test). https://pmc.ncbi.nlm.nih.gov/articles/PMC4148081/ |
| Dasgupta 2017: 50 PNs to 2,000 KCs (40x), about 6 inputs per KC, 5% WTA via APL; beats standard LSH on benchmarks | 1756 | confirmed | https://doi.org/10.1126/science.aam9868 |
| Li 2020 and Zheng 2020: "Z = 3.5 to 5.2" over degree-preserving nulls; food and pheromone PNs cluster in distinct calyx zones | 1757 | unverifiable (Z values), overstated | Zheng 2022 (Curr Biol 32:3334-3349; preprint 2020): in FAFB, 1,356 sampled KCs, 5.2 +/- 1.6 claws per KC. A "core community" of mostly food-responsive PN types is overconverged: 1,916 claws observed vs 1,421.7 +/- 35.7 under the random-bouton null (z = 13.8). A spatially local null model captures most of this structure, and the same community is found in the hemibrain. Li 2020 called the structure modest. |
| Hemibrain v1.2.1: N = 1,770 KCs, 10,798 claws (6.10 per KC) | 1781 to 1782 | invented | Not in Li 2020 or Zheng 2022. Checkable in neuPrint. Zheng reports 5.2 claws per KC. |
| A single DM1 PN contacts 384 KCs; DM4 312; DA1 142 | 1784 to 1786 | invented | Not in either paper. Treating DM1 as one PN contacting 22% of all KCs is implausible: about 10k claws spread over about 150 PNs averages near 70 KCs per PN. DA1 has many PNs, each with few boutons (Zheng 2022). |
| Observed DM1-DM4 co-sampling 104 vs expected 67.7 (Z = +5.49, +53%) | 1788 to 1809 | invented | The arithmetic is correct (0.2169 x 0.1763 x 1770 = 67.7; Z = 5.49; p = 4e-8), but the inputs are made up. The variance used is binomial, not the hypergeometric variance the text names, and a formula labelled "non-central hypergeometric" is actually the central one. |
| Observed DM1-DA1 14 vs expected 30.8 (Z = -3.57): food and pheromone "actively segregated" | 1811 to 1826 | invented | Same issue. Zheng 2022 describes "underconvergent" communities, but the report does not take these figures from it. |
| "(e)1 DP1m over 50 boutons, VM7 fewer than 12" | 1830 | unverifiable | Bouton counts per PN type are in Zheng 2022 Fig 2 / Table S1. Not checked individually. |
| "(e)2 Caron lacked power to detect Z = 3.5" | 1831 | invented | No source. |
| "(e)3 dorsal pheromone vs ventral food zoning" in calyx | 1832 | overstated | Jefferis 2007 showed fruit/pheromone segregation in the lateral horn. For the calyx, Zheng 2022 finds co-arborization of core-community PNs with alpha-beta and alpha'-beta' KC dendrites, not a dorsal/ventral pheromone/food split. |
| Figure 10.1: k about 6 is optimal; below 4 fails, above 12 destroys separation | 1841 | overstated | Litwin-Kumar et al. 2017 (Neuron 93:1153) derive an optimum near the observed 6 to 7 claws. The 4 and 12 thresholds are not from any source. |
| Figure 10.3: 70% of the deviations vanish under a distance-conditioned null | 1851 | invented (number) | Direction is right: Zheng's "local random" null captures most of the core-community effect. There is no 70% figure. |

## Topic 11: Stereotypy, development, dimorphism (lines 1855 to 2021)

| Claim | Line | Verdict | Correct value / source |
|---|---|---|---|
| Schlegel 2021 eLife 10:e66039 | 1915 | wrong (ID) | e66018 (e66039 is Hulse). https://doi.org/10.7554/eLife.66018 |
| Lu et al. 2020 Current Biology 30:4897-4908 (bilateral stereotypy) | 1915 | invented | No such paper. The bibliography DOI (10.1016/j.cub.2020.09.041) resolves to Dayan, "Learning rules". Nearest real work: Pedigo et al. 2023 eLife (larval bilateral symmetry) and Schlegel 2024 Nature. |
| Stereotypy numbers: skeleton overlap > 95%, NBLAST > 0.82, L-R cosine 0.68, CV < 0.18 for w > 20, weak edges w <= 3 stochastic | 1915 | invented | None of these appear in Schlegel 2021. Its real finding: connection variability between neurons of the same type is similar within a brain and across brains. The quantitative source is Schlegel 2024 Nature 634:139-152: a 1-synapse hemibrain edge has a 42% chance of appearing in one FlyWire hemisphere and 16% in both; any edge above 10 synapses is found in the other hemispheres more than 90% of the time; these edges are 16% of edges but about 79% of synapses. https://pmc.ncbi.nlm.nih.gov/articles/PMC11446831/ |
| Witvliet: 8 isogenic individuals, L1 to adult | 1916 | confirmed | https://doi.org/10.1038/s41586-021-03778-8 |
| Witvliet: synapses 1,328 to 6,654, "5.01-fold" | 1916, 1946 to 1948 | wrong | About 1,300 at birth to about 8,000 in adults, "6-fold" (the discussion also says 5-fold). Mean synapses per connection rose from 1.7 to 6.9, and connection count rose 2.4-fold. https://pmc.ncbi.nlm.nih.gov/articles/PMC8756380/ |
| Witvliet: stable core 40%, variable 60% (w <= 2) | 1916 | wrong | In the adult: stable about 43%, variable about 43%, developmentally dynamic about 14% of connections. Variable connections carry 16% of synapses. |
| Developmental addition is polarized toward feedforward | 1916 | confirmed | "With age, the brain becomes progressively more feedforward and discernibly modular." |
| Worked example AVB to DB1: 8 synapses to 42; ALM to DB1 series 1,0,1,0,0,1,0,1 | 1950 to 1980 | invented | Witvliet reconstructed the brain only (nerve ring and ventral ganglion), and DB1 is not in its cell list. These edges are not in the dataset. The arithmetic (42/8 = 5.25; 1/6654 = 1.5e-4) is correct on invented inputs. |
| Feedforward/recurrent ratio 412/328 = 1.26 rising to 2890/1142 = 2.53 (doubling) | 1982 to 1993 | invented | Witvliet reports the proportion of synapses in feedforward, feedback and recurrent connections (Fig. 3b) and a significant increase in the feedforward share. These ratios and the "107 pathways" figure are not in the paper. |
| Cook 2019: 91 male-specific neurons | 1917 | confirmed | https://pmc.ncbi.nlm.nih.gov/articles/PMC6889226/ |
| Cook 2019: 178 sex-specific muscles | 1917 | wrong | 39 male-specific sex muscles (16 hermaphrodite-specific). The male graph has 155 muscles in total. |
| Cook 2019: central core > 90% topologically isomorphic | 1917 | invented / contradicts source | In the male, 67% of shared neuron classes receive input from sex-specific neurons (16% of their input), and "a substantial number of connections differ in strength between the sexes". |
| "(e)1 over 40% of connections are non-canonical" | 1997 | confirmed (approx.) | About 43% of cell-cell connections, 16% of synapses. |
| "(e)2 Schlegel 2021: 20 to 30% L-R variance is the baseline" | 1998 | unverifiable | Not found in Schlegel 2021. |
| Figure 11.2: 1,200 bilateral cell-type pairs; CV drops 70% to 15% | 2011 to 2013 | invented | No source. The qualitative idea is supported by Schlegel 2024. |
| Figure 11.3: sex-specific CEM, HSN, ray neurons (worm); P1, pIP10, vPR6 (fly) | 2017 | partly confirmed | CEM, ray neurons (male) and HSN (hermaphrodite) are correct, and P1 is male-specific. pIP10 and vPR6 are fru+ song-circuit neurons; not verified here as sex-specific. |
| "13-fold segregation metric" chi_dimorphic | 2018 | invented / misattributed | See Fact 3. |

## Topic 12: Visual representations (lines 2024 to 2236)

I recomputed the worked example from the WormAtlas Varshney data (`NeuronConnect.xls`: 279 connected neurons, 2,194 directed chemical edges, 6,394 synapses counted from S/Sp rows). Script: `/private/tmp/claude-501/-Users-kai-git-moonshine/98e1be9a-a8b8-4cb6-9869-83c9182aeada/scratchpad/seriate.py` (session scratchpad, not in repo; data from wormatlas.org/images/NeuronConnect.xls).

| Claim | Line | Verdict | Correct value / source |
|---|---|---|---|
| C. elegans: N = 279, 2,194 directed chemical edges, 6,393 synapses, density 0.0283, mean degree 7.86 | 2148 to 2153 | confirmed | Varshney 2011 (recomputed: 279, 2,194, 6,394, 0.0283). https://doi.org/10.1371/journal.pcbi.1001066 |
| Alphabetical order: mean edge span 94.2, 2-SUM 2.84e7, "featureless scatter" | 2170 to 2175 | wrong | Recomputed: span 71.0, 2-SUM 1.86e7. The report's figures match a random permutation (mean over 200: 93.5, 2.87e7). Alphabetical order is not random because class names (DA01..DA09, L/R pairs) cluster. |
| Degree order: span 104.5, 2-SUM 3.41e7, "worse than random" | 2177 to 2182 | wrong | Recomputed: span 79.5, 2-SUM 2.31e7, which is better than random. The top-degree neurons are AVAR, AVAL, AVBL, PVCL, PVCR, AVDR, DVA; the report's list includes AWA, a sensory neuron. |
| Spectral (normalized Laplacian) order: lambda2 = 0.0842, span 31.6, 2-SUM 4.12e6, 85.5% reduction | 2184 to 2201 | partly wrong | The normalized Laplacian gives lambda2 = 0.152, span 43.3, 2-SUM 7.42e6. The combinatorial Laplacian (lambda2 = 0.452) gives span 32.2, 2-SUM 4.14e6, close to the report's figures, so the spectral numbers look like a real computation mislabelled as normalized. The alphabetical baseline and hence the "85.5%" are wrong: against the true alphabetical order the reduction is 78%. |
| Fiedler order splits into sensory (ranks 1 to 82), interneurons, motor (195 to 279) | 2192 to 2194 | wrong | The Fiedler vector is essentially the body axis. One end is ventral-cord motor neurons (60 of the first 82 are DA/DB/VA/VB/DD/VD/AS) plus tail neurons; the other end is nerve-ring/head neurons of every class (RIH, IL1/IL2, CEP, OLQ, URA, SIB, ADF). It does not separate sensory, inter and motor neurons. |
| Crossing lemma constant 1/29 with -35/29 V, attributed to Ajtai et al. 1982 | 2036, 2125 | wrong (attribution) | Ajtai et al. 1982 (and Leighton) proved cr >= c E^3/V^2 with a much smaller constant (1/100; 1/64 is the textbook probabilistic proof). The 1/29 constant is Ackerman 2019 (for E >= 7V). The asymptotic claim is fine. |
| FlyWire: V about 139,255, E about 1.51e7 | 2039 | unverifiable | The neuron count is right (v783). The unthresholded edge count was not checked. |
| Holten 2006: beta about 0.7 to 0.85 | 2123 | confirmed (approx.) | Holten recommends beta = 0.85 as the default. https://doi.org/10.1109/TVCG.2006.147 |
| Behrisch 2016: evaluated seriation on 20 benchmarks; 4.2-fold faster boundary identification | 2124 | invented | Behrisch 2016 is a survey of reordering algorithms with no user study and no 4.2-fold figure. https://doi.org/10.1111/cgf.12935 |
| EM dendritic inputs 90 to 95% traced, axonal outputs 40 to 50% | 2109 | wrong (inverted) | See Fact 5. |
| Maier-Hein 2017: about 4 false-positive bundles per true bundle; FP rate > 64% | 2113 to 2115, 2214 | 4x confirmed; 64% invented | Tractograms averaged 88 +/- 58 invalid bundles, "more than four times" the valid bundles (about 21 of 25 found on average). Four-to-one implies about 80% invalid, not 64%. At streamline level, 54 +/- 23% of connections were valid. The phantom was numerically simulated, not hardware. https://pmc.ncbi.nlm.nih.gov/articles/PMC5677006/ |
| Fly weights range 1 to over 1,500 synapses; Markov FLNe 1e-6 to 1e-1 | 2094 | unverifiable / roughly confirmed | FLNe spans about 5 orders of magnitude (Markov 2014). The fly maximum was not checked. |
| Figure 12.3: tracing error above 45% at beta = 0.85 | 2233 | invented | This would have to be measured in a user study. |

## Topic 13: Technological frontier (lines 2237 to 2450)

| Claim | Line | Verdict | Correct value / source |
|---|---|---|---|
| 1 mm3 at 4 x 4 x 30 nm = 2.08e15 voxels = 2.08 PB; mouse 500 mm3 = 1.04 EB; human 1.4e6 mm3 = 2.92 ZB | 2376 to 2410 | confirmed (arithmetic) | Consistent with H01 (1.8 PB raw, 1.4 PB final) and Abbott 2020 ("roughly 1 million terabytes"). |
| MultiSEM 505 = 61 beams, 506 = 91 beams | 2268 | confirmed | H01 used a 61-beam mSEM. The current ZEISS spec (MultiSEM 706, 91 beams) is a maximum of 80 MHz per beam and over 3 TB/h net. https://www.zeiss.com/microscopy/en/products/sem-fib-sem/sem/multisem.html |
| 91 beams x 20 MHz = 1.82 GB/s, 70% duty cycle, so 18.9 days per mm3 and 25.9 machine-years per mouse brain | 2350 to 2394 | overstated | H01 actually achieved 125 to 190 Mpx/s and took 326 days to image 1 mm3 (Shapson-Coe 2024). That is about 17x slower than the report's rate. At H01 throughput a mouse brain is about 450 machine-years. The report's figure is a vendor-peak idealization. https://pmc.ncbi.nlm.nih.gov/articles/PMC11718559/ |
| Storage at $0.004/GB-month: $250k/yr (1 mm3), $125M/yr (mouse) | 2384, 2398 | confirmed (arithmetic) | The price is an assumption, not a sourced quote. |
| Segmentation 25M GPU-hours, about $60M; total $250M to $400M; 1 mm3 costs $3M to $5M | 2400 to 2401, table | unverifiable | Abbott 2020 says only "likely to be hundreds of millions of dollars". |
| Abbott 2020 and "Lichtman et al. 2020": 1 cm3 at 4 x 4 x 40 nm, about 1 EB, 10 to 20 MultiSEMs over 5 years, > $200M | 2319 | partly invented | Abbott 2020 says: "nearly a cubic centimeter", "roughly 1 million terabytes", "hundreds of millions of dollars", "years as opposed to decades". The voxel size, instrument count and 5-year timeline are not in it. There is no "Lichtman et al. 2020" (see bibliography #46). https://par.nsf.gov/servlets/purl/10247254 |
| ExM: Chen, Tillberg and Boyden 2015, about 4x expansion, 60 to 70 nm | 2320 | confirmed | About 4.5x expansion, about 70 nm (author order Chen, Tillberg, Boyden). https://doi.org/10.1126/science.1260088 |
| "Iterative 16x expansion protocol (Gao et al. 2019)" giving 13.3 nm | 2279 | wrong | Gao 2019 is about 4x ExM combined with lattice light-sheet microscopy (ExLLSM). Iterative ExM (Chang et al. 2017, Nat Methods 14:593) reaches about 20x and about 25 nm. The 13.3 nm figure is a textbook Abbe division that ignores gel and label-size limits. |
| XNH: 25 to 50 nm isotropic across intact 1 mm3 | 2288 | overstated | Kuan 2020: "millimeter-scale volumes with sub-100-nm resolution". https://doi.org/10.1038/s41593-020-0704-9 |
| Kuan 2020 Nat Neurosci 23:711-721 | 2321 | wrong | 23(12):1637-1643. |
| Zador 2012 "formulated MAPseq"; 30-nt barcodes; Sindbis; 4^30 diversity | 2290 to 2296, 2322 | overstated | Zador 2012 proposed barcoding (BOINC). MAPseq is Kebschull 2016 (Sindbis, 30-nt barcodes). Practical uniqueness depends on library diversity (about 1e6 to 1e7), not 4^30. The Poisson P(2) at mu = 0.01 is arithmetically right. |
| BARseq maps 100,000 neurons "in an afternoon for a few thousand dollars" | 2340 | overstated | Chen 2019 mapped 3,579 neurons to 11 areas. Later BARseq work scales to about 1e5 neurons per brain, but with multi-week in situ sequencing. |
| FlyWire raw data about 100 TB | 2330 | unverifiable | Order of magnitude plausible (FAFB is tens of teravoxels at 4 x 4 x 40 nm). |
| Mouse brain sliced into "20,000 ribbons" of 30 nm | 2334 | wrong | An 8 to 10 mm brain at 30 nm is about 270,000 to 330,000 sections. H01's 0.17 mm slab alone took 5,019 sections at 33.9 nm. |
| XNH needs "4 nm resolution to see vesicles" | 2339 | overstated | Vesicles are 30 to 40 nm. Synapse-level XNH needs roughly 10 to 20 nm. |
| FIB-SEM 4 to 8 nm layers; diamond-knife 25 to 30 nm floor | 2414 | confirmed (approx.) | The hemibrain was 8 nm isotropic. H01 used 30 to 33 nm sections. |

---

## Section 7.1: Fourteen facts (lines 2525 to 2556)

| # | Claim | Verdict | Correct value / source |
|---|---|---|---|
| 1 | H01: single axons form up to 50 synapses on one target | confirmed, overstated framing | "rare powerful axonal inputs of up to ~50 synapses". 96.49% of connections are one synapse, 2.99% two, 0.35% three, 0.092% four or more. The "single dendritic segment / private conduit" framing is not from the paper. https://pmc.ncbi.nlm.nih.gov/articles/PMC11718559/ |
| 2 | Over 40% of connections unique to an individual (Witvliet) | overstated | About 43% of cell-cell connections are variable (not present in every animal), which is not the same as unique to one animal. They carry only 16% of synapses. |
| 3 | Fly dimorphic neurons connect 13.2x more than random; isolated module with no cross-talk; "Takemura et al. 2023 / FlyEM Male CNS v1.0" | misattributed + invented + contradicts source | bioRxiv 2023.06.05.543757 is Takemura et al., "A Connectome of the Male Drosophila Ventral Nerve Cord" (eLife 2024, 10.7554/eLife.97769). The male CNS paper is Berg et al., Cell 2026 189(18):5504-5526 (bioRxiv 10.1101/2025.10.09.680999). It reports 7,205 isomorphic, 114 dimorphic, 262 male-specific and 69 female-specific types; 13 of 305 connectivity clusters are enriched for dimorphic/male-specific types (72% of non-isomorphic types, 85% of dimorphic edges); enriched clusters link to 8.5 other enriched clusters vs 1.1; and the remaining 113 non-isomorphic types are "highly integrated into the isomorphic subgraph". Its conclusion is that "dimorphism propagates through the nervous system", the opposite of "no cross-talk". No 13.2x figure; possibly a garbling of "13 enriched clusters". https://pmc.ncbi.nlm.nih.gov/articles/PMC12636603/ |
| 4 | Peptidergic network 10x denser than synaptic; hubs are peripheral low-degree sensory neurons | density confirmed; hubs wrong | Density 0.344 (short-range) and 0.443 (mid-range) vs synaptic 0.0251 and monoamine 0.0236, i.e. "over 10-fold denser". Top hubs are AVK, PVQ, PVT, PVR, then BDU, HSN, RID, all neurons specialized for peptide signalling. All 11 synaptic rich-club neurons are also in the top 25 peptidergic hubs, and peptidergic degree correlates with synaptic degree (r = 0.53). https://pmc.ncbi.nlm.nih.gov/articles/PMC7615469/ |
| 5 | Postsynaptic inputs 95% complete, presynaptic outputs 42%; thin axon twigs lost (Takemura 2023; Scheffer 2020) | wrong (inverted) + misattributed | Berg et al. (male CNS): "94% pre- and 42% postsynaptic completion rates", because "presynapses typically reside on larger-calibre neurites". Hemibrain: more than 90% of T-bars are in identified neurons, and PSDs "are typically in smaller neurites" that are hard to attach. The lost twigs are postsynaptic (dendritic). MANC (the cited bioRxiv) reports about 50% connection completion. |
| 6 | Proximity has near-zero predictive power for synapses | overstated | Lee 2016: axons and dendrites of all orientation preferences come within 5 um with roughly equal probability, so proximity does not explain the specificity. Kasthuri 2015 found proximity insufficient. "Near-zero" is stronger than either paper says. |
| 7 | Tractography: 4 false-positive bundles per true positive (FP > 64%) | 4x confirmed; 64% wrong | See Topic 12. |
| 8 | T4 mechanism: Tm3/Mi1 fast and delayed excitation for PD; Mi4 and Mi9 shunting veto for ND | wrong | PD enhancement comes from Mi9 disinhibition on the preferred side; ND suppression from Mi4 (and C3, CT1) on the null side; Mi1 and Tm3 are both fast central excitation (Borst, Haag, Mauss 2020). The Takemura 2013 citation is also wrong for Mi4/Mi9 (they are from Takemura 2017). |
| 9 | Untrained LIF on the 139,255-neuron FlyWire connectome predicts feeding and grooming with 91 to 95% accuracy | overstated | 127,400 neurons (v630). "Across 164 predictions we were able to test empirically, 91% were consistent", and 84% excluding the split-GAL4 screen. The 95% figure is a robustness comparison between model variants, not accuracy against experiments. |
| 10 | Fly hash is LSH and beats standard LSH | confirmed (per Dasgupta 2017) | The headline "discards high dimensions" is backwards: it expands 50 to 2,000 and then sparsifies. |
| 11 | FF/FB ratio doubles 1.26 to 2.53 | invented | See Topic 11. Only the direction (more feedforward) is supported. |
| 12 | Ring attractor; P-EN shift the bump in darkness; matches CANN theory (Turner-Evans 2017; Hulse 2021) | confirmed | Green 2017 and Turner-Evans 2017 (P-EN angular velocity), Kim 2017 (ring attractor dynamics). https://doi.org/10.7554/eLife.23496 |
| 13 | Mouse brain EM: 1.04 EB, over 25 machine-years, over $250M (Abbott 2020; Lichtman 2020) | partly confirmed | 1 EB and "hundreds of millions" are confirmed by Abbott. 25 machine-years is an idealized vendor-peak figure (about 450 at H01's real throughput). "Lichtman et al. 2020" does not exist. |
| 14 | Like-to-like "power law": 3x connection probability for delta-phi < 15 deg, PSD 1.8x larger (Lee 2016) | invented numbers, wrong framing | Nothing in the result is a power law. Lee 2016 gives a significant trend over 22.5 deg bins (29 connected pairs) and PSD 0.24 um2 for dissimilar pairs vs > 1 um2 for some similar pairs; no 3x or 1.8x. Use MICrONS 2025 / Ding 2025 for quantitative like-to-like. |

## Section 7.2: Misconceptions (lines 2558 to 2584)

| # | Claim | Verdict | Notes |
|---|---|---|---|
| 1 | Connectome not sufficient; "over 380 neuropeptidergic pathways" (Ripoll-Sanchez) | point sound; number unverifiable | Ripoll-Sanchez built networks from 92 NPP-GPCR couples (461 peptide-receptor pairs in vitro). There is no "380" figure. |
| 2 | Tractography: > 90% of tracts found, 4 FP per TP, > 64% FP, "phantom hardware" | partly wrong | 90% and 4x are confirmed. The phantom was simulated, and 64% is not in the paper. |
| 3 | MB not random: DM1/DM4 53% above chance (p < 1e-7), pheromone PNs in dorsal calyx zones | invented numbers | The real result is Zheng 2022's food-PN core community (z = 13.8 on claw counts), largely explained by local geometry. |
| 4 | Adult connectome not static: 5 to 20% spine turnover per week; worm synapses rise 5-fold | roughly confirmed | Spine turnover is of that order in adult mouse cortex (Holtmaat and Svoboda 2009; Trachtenberg 2002). Witvliet says 6-fold. |
| 5 | Peters' rule fails (Kasthuri 2015; Shapson-Coe 2024) | confirmed for Kasthuri; H01 citation weak | H01 is not primarily a Peters' rule test. |
| 6 | EM not ground truth; post 90 to 95%, pre 40 to 60%; synapse detection 80 to 90% | pre/post inverted | Same inversion as Fact 5. The detection accuracy range is plausible. |
| 7 | Not scale-free (Clauset 2009; Broido and Clauset 2019) across worm, fly, mouse and human connectomes | overstated | Broido and Clauset tested about 1,000 networks of all kinds, not these connectomes specifically. C. elegans degree tails are exponential (Varshney 2011). The claim that brain degree is "sharply truncated log-normal" everywhere is not established. |
| 8 | EM cannot show transmitter sign; Eckstein 2024 classifier; receptor determines sign | confirmed | Eckstein 2024 is Cell 187:2574-2594 (the bibliography has wrong pages). The classifier works on synapse image patches, not explicitly on "vesicle morphology". |

---

## Section 9: Bibliography (lines 2612 to 2782)

All 84 entries were checked. 76 DOIs were resolved via Crossref (raw output: `/private/tmp/claude-501/-Users-kai-git-moonshine/98e1be9a-a8b8-4cb6-9869-83c9182aeada/scratchpad/crossref-bib.tsv`) and the rest were matched by title.

### Problems

| # | Entry as cited | Problem | Correct |
|---|---|---|---|
| 4 / 51 | Bae et al. 2021 / MICrONS 2021 bioRxiv | duplicate of the same preprint | Now published: MICrONS Consortium 2025, Nature 640:435-447, 10.1038/s41586-025-08790-w |
| 5 | Bargmann 2012 "Beyond the connectome: the cellular basis of behaviour" | wrong title | "Beyond the connectome: How neuromodulators shape neural circuits" |
| 11 / 15 | Boyden, Chen, Tillberg 2015 and Chen et al. 2015 | duplicate; #11 has the wrong author order | Chen, Tillberg, Boyden 2015 |
| 14 | Chen, Hall, Chklovskii 2006 DOI ...0506808103 | DOI 404 | 10.1073/pnas.0506806103 |
| 20 | Costa 2016 NBLAST title | wrong subtitle | "...Neuronal Structure and Construction of Neuron Family Databases" |
| 24 | Eckstein 2024 Cell 187:2541-2556 | wrong pages and title | 187(10):2574-2594, "...at synaptic sites in Drosophila melanogaster" |
| 25 | Ercsey-Ravasz 2013 title | wrong title | "A predictive network model of cerebral cortical connectivity based on a distance rule" |
| 29 | Gansner, Hu, Kobourov 2011 GMap, DOI ...2011.5742390 | wrong year; DOI resolves to a different paper (Holten et al. 2011, directed-edge readability) | PacificVis 2010:201-208, 10.1109/PACIFICVIS.2010.5429590 |
| 30 | Gao 2019 eaau3044 | DOI 404 | Science 363:eaau8302 |
| 31 | Ghani et al. 2011 VAST 281-282 | wrong venue and year | IEEE TVCG 19(12):2032-2041, 2013 |
| 33 | Harris 2019 DOI ...1716-4 | DOI 404 (typo) | 10.1038/s41586-019-1716-z |
| 36 | Hulse 2021 title | wrong title | "...reveals network motifs suitable for flexible navigation and context-dependent action selection" |
| 42 | Kuan 2020 title "Dense connectomic reconstruction in adult Drosophila using synchrotron X-ray tomography" | wrong title (also mouse tissue, not only fly) | "Dense neuronal reconstruction through X-ray holographic nano-tomography" |
| 43 | Lappalainen 2024 pages 1138-1147 | wrong pages | 634:1132-1140 |
| 46 | Lichtman, Pfister, Shavit 2020, "The prospective role of electron microscopy in connectomics", COIN 25:115-121 | invented / misattributed; DOI resolves to Gutig 2014 "To spike, or when to spike?" | Probably "The big data challenges of connectomics", Nat Neurosci 17:1448-1454 (2014), 10.1038/nn.3837 |
| 47 | Lu et al. 2020 Curr Biol 30:4880-4892 | invented; DOI resolves to Dayan "Learning rules" | No such paper |
| 50 | Markov 2014 pages 17-32 | wrong pages | 24(1):17-36 |
| 53 | Mishchenko 2010 "Ultrastructural analysis of local connectivity in neocortex", J Neurosci | invented title/venue; DOI resolves to an Angelman syndrome paper | Real Mishchenko 2010: "Ultrastructural analysis of hippocampal neuropil from the connectomics perspective", Neuron 67:1009-1020 |
| 55 | Pacureanu 2019 Nature Methods 16:1145-1152 | misattributed; DOI 404 | Pacureanu et al. 2019 is the bioRxiv preprint (10.1101/653188) of Kuan 2020 |
| 59 | Peters and Feldman 1976 subtitle | minor | "I. General description" |
| 62 | Scheffer 2020 e57449 | DOI 404 | eLife 9:e57443 |
| 63 | Schlegel 2021 e66014 | wrong ID; DOI resolves to a STAT cytokine paper | eLife 10:e66018 |
| 64 | Schlegel 2024 title | minor | "...multi-connectome cell typing of Drosophila" |
| 65 | Schneider-Mizell 2023 Nature 618:345-352 | misattributed; DOI 404 | "Structure and function of axo-axonic inhibition" is eLife 2021 10:e73783 |
| 68 | Shiu 2024 pages 1148-1158 | wrong pages (the inline citation at line 1577 is correct) | 634:210-219 |
| 71 | Sun 2021 BARseq2, Cell 184(16):4252-4268 | misattributed; DOI resolves to a potato genome commentary | Sun et al. 2021, Nat Neurosci 24:873-885, 10.1038/s41593-021-00842-4 |
| 72 | Suarez 2020 "Connectome-based models of neural information transfer: a review", Netw Neurosci 4:14-35 | invented; DOI resolves to Towlson "Synthetic ablations in the C. elegans nervous system" | Real Suarez 2020: "Linking structure and function in macroscale brain networks", Trends Cogn Sci 24:302-315 |
| 74 | Takemura 2023 "A connectome of the male Drosophila central nervous system", bioRxiv 2023.06.05.543757 | wrong title | That bioRxiv ID is "A Connectome of the Male Drosophila Ventral Nerve Cord" (eLife 2024, 10.7554/eLife.97769). The male CNS paper is Berg et al. 2026 Cell |
| 76 | Turner 2020 bioRxiv 2020.04.10.036087 | wrong DOI (resolves to a wild-mammal social network preprint) | "Reconstruction of neocortex: organelles, compartments, cells, circuits, and activity", Cell 185:1082-1100 (2022) |
| 79 | Wassie 2019 title | minor | "...uses in biological research" |
| 2 | Ajtai et al. 1982 | confirmed | North-Holland Math Studies 60:9-12 |

### Confirmed as cited (venue, year, volume and pages)

1 Abbott 2020; 3 Atasoy 2016; 6 Bates 2020; 7 Behrisch 2016; 8 Bentley 2016; 9 Bock 2011 (title adds "a group of"); 10 Borst 2020; 12 Broido 2019; 13 Caron 2013; 16 Chen X 2019; 17 Cherniak 1994; 18 Clauset 2009; 19 Cook 2019; 21 Dasgupta 2017; 22 De Bacco 2018; 23 Dorkenwald 2024; 26 Felleman 1991; 27 and 28 Fiedler 1973, 1975; 32 Green 2017; 34 Holten 2006; 35 Holtmaat 2009; 37 Jefferis 2007; 38 Kasthuri 2015; 39 Kebschull 2016; 40 Kim 2017; 41 Knox 2019; 44 Lee 2016 (issue 7599, not 7600); 45 Li 2020; 48 Maier-Hein 2017; 49 Marder 2012; 52 Milo 2002; 54 Oh 2014; 56 Pang 2023; 57 Pasqualetti 2014; 58 Peixoto 2014; 60 Prinz 2004; 61 Ripoll-Sanchez 2023; 66 Seelig 2015; 67 Shapson-Coe 2024; 69 Song 2005; 70 Sugiyama 1981; 73 Takemura 2013 (actual title: "...suggested by Drosophila connectomics"); 75 Trachtenberg 2002; 77 Turner-Evans 2017; 78 Varshney 2011; 80 Watts 1998; 81 White 1986; 82 Winding 2023; 83 Witvliet 2021; 84 Zador 2012.

Summary: of 84 entries, 4 are invented or have invented titles (#47, #53, #72, and #46 in its cited form); 5 are misattributed to the wrong venue or paper (#29, #31, #55, #65, #71); 6 have DOI typos that 404 (#14, #30, #33, #62, plus #55 and #65 already counted); 2 are duplicate pairs; and about 10 have wrong titles or pages. Missing entries the report relies on: Zheng 2022 Curr Biol (the real MB co-sampling source), Takemura 2017 eLife (T4 inputs), Schlegel 2024 edge-reproducibility numbers (in the bibliography but not used), Berg 2026 Cell (male CNS), and Ding 2025 / MICrONS 2025 (like-to-like).

---

## Solid results in these topics that could be drawn from public data

1. **Seriation of the C. elegans chemical connectome** (WormAtlas / Varshney 2011, or Cook 2019 via wormwiring.org): 279 neurons, 2,194 edges. Alphabetical ordering gives mean edge span 71, degree ordering 80, Fiedler ordering 32, random about 94. The Fiedler axis runs from ventral-cord motor neurons to head neurons. This is the honest version of Figure 12.1 and small enough for the browser.
2. **Edge reproducibility vs synapse count** (Schlegel 2024; FlyWire + hemibrain, public): a 1-synapse edge has a 42% chance of recurring in another hemisphere, while edges above 10 synapses recur more than 90% of the time and carry about 79% of synapses in 16% of edges.
3. **Witvliet 2021 developmental series** (8 datasets, nemanode.org): about 1,300 to about 8,000 synapses; 43% stable / 43% variable / 14% dynamic connections; variable edges carry 16% of synapses; rising feedforward share. A real version of Figure 11.1 using nerve-ring neurons (AVB/DB1 are not in the data).
4. **H01 multisynaptic connection histogram** (Shapson-Coe 2024, public): 96.49% / 2.99% / 0.35% / 0.092% for 1 / 2 / 3 / 4+ synapses; inputs of up to about 50; imaging took 326 days at 125 to 190 Mpx/s for 1 mm3, which grounds a scaling figure (Topic 13) in measured throughput.
5. **Peptidergic vs synaptic network in C. elegans** (Ripoll-Sanchez 2023, GitHub/nemamod): density 0.344 vs 0.0251; hubs AVK, PVQ, PVT, PVR; peptidergic degree correlates with synaptic degree (r = 0.53).
6. **PN-to-KC co-sampling with proper nulls** (Zheng 2022 on FAFB; the hemibrain replicates): food-PN core community overconverged (1,916 claws vs 1,421.7 +/- 35.7, z = 13.8); a spatially local null explains most of it. A degree-preserving shuffle can be run in the browser on the PN-by-KC matrix.
7. **T4 input layout** (Takemura 2017 FIB-SEM, or FlyWire optic lobe): Mi9 on the preferred side, Mi1/Tm3/TmY15 in the centre, Mi4/C3/CT1 on the null side. Per-T4 synapse counts are available from the data.
8. **Shiu 2024 LIF parameters and validation** (code public, Brian2): W_syn 0.275 mV, V_th -45 mV, 91% of 164 tested predictions. The published parameters could drive a small sugar-to-MN9 subcircuit.
9. **Fly male/female dimorphism** (Berg et al. 2026, male CNS + FlyWire): 7,205 / 114 / 262 / 69 isomorphic / dimorphic / male / female types; 13 of 305 clusters enriched; 94% pre / 42% post completion.
10. **C. elegans sex differences** (Cook 2019): 91 male-specific neurons and 39 sex muscles vs 8 and 16 in the hermaphrodite; 67% of shared classes receive sex-specific input.
11. **Tractography challenge** (Maier-Hein 2017): about 21 of 25 valid bundles found vs 88 +/- 58 invalid bundles per submission; 54% of streamlines valid.
