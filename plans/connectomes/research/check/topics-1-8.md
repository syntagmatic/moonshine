# Fact-check of REPORT.md, Topics 1 to 8 (report lines 54 to 1486)

Checked 2026-09-30 against primary papers (PMC / eLife / bioRxiv full text where available, abstracts otherwise) and, where a public dataset was quick to fetch, by recomputing the numbers. Scratch work (scripts, raw per-claim tables with more detail) is in the session scratchpad: `worm.py`, `arith.py`, `verify-t1-3.md`, `verify-t4-6.md`, `verify-t7-8.md`, `worm_results.json`.

Verdicts: **confirmed**, **wrong** (a real source says something else), **overstated**, **unverifiable** (not found in the cited source; may exist elsewhere), **invented** (inputs have no source, or the thing named does not exist).

## Overall

- The (b) tables are a mix. Dataset headline counts (White 1986, Oh 2014, Markov 2014 Cereb Cortex, FlyWire neuron and synapse counts, H01, Maier-Hein bundle counts, Kaiser & Hilgetag 48% / 32%, Ercsey-Ravasz lambda = 0.188/mm, Towlson rich club, Felleman & Van Essen) are right. Secondary quantitative claims attached to them (reproducibility percentages, precision/recall, variance explained, Z-scores, p-values, "sigma drops to 1.0") are very often wrong or not in the cited paper. Bibliographic details are wrong in about a dozen places.
- Every (d) worked example in Topics 1 to 8 uses invented inputs. The arithmetic on them is correct (I recomputed all of it: Gramian eigenvalues, SpringRank solution, probit inversions, greedy-navigation distances, EDR ratios, resolution-limit Delta Q all reproduce to the printed digits), which is what made the self-audit call them "verified". Where the inputs can be checked against real data, they are wrong, and in two cases (C. elegans spatial null, macaque MT hierarchy) the conclusion itself is reversed.
- Several numbers were lifted from the internal `vizbench-notes.md` (the user's own computations on the male CNS v1.0 data) and relabelled as published results: "Cheong et al. 2024" male CNS counts (162,521 typed neurons, 11,751 types, 103/319 neuropils), "vizbench release notes 2026" (input ~95% / output ~42% / 2.4x), "256 runs" of the traversal model attributed to Schlegel 2021, and "touch 3.9 steps, vision 7.9 steps" attributed to Dorkenwald 2024. The prompt explicitly said the report should be portable; these leaked and were given fake provenance.
- The user's example strings "Knox 0.0842" and "MICrONS 12,840 synapses across 482 branches" do not occur in Topics 1 to 8. 0.0842 appears at line 2188 (Topic 12) as a Varshney 2011 Fiedler eigenvalue; Varshney's algebraic connectivity is 0.12 (gap-junction giant component) and the "2-SUM reduced by 85.5%" claim there is not in the paper. The Topic 1 MICrONS example is "4 synapses, 0.86 um^2".

---

## Topic 1: What a connectome is at each scale

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| White 1986: 302 neurons, ~5,000 chemical synapses, ~2,000 NMJs, ~600 gap junctions | 129 | confirmed | Abstract states exactly this. https://doi.org/10.1098/rstb.1986.0056 |
| Cook 2019: herm 6,447 chem / 890 gap; male 8,644 chem / 1,410 gap | 133-139 | wrong | Cook counts edges: herm 4,887 chemical (directed) and 1,447 gap-junction edges; male 5,315 and 1,755. Node counts 460 / 579 and 91 male-specific neurons are correct. https://pmc.ncbi.nlm.nih.gov/articles/PMC6889226/ |
| Witvliet 2021: ~1,300 synapses at L1, ~6,600 adult (>5x); Nature 596:257-262 | 141 | wrong (adult) | ~1,300 at birth to ~8,000 in adult (about 6-fold); pages 257-261. 6.6 is the mean synapse count of stable connections. https://pmc.ncbi.nlm.nih.gov/articles/PMC8756380/ |
| Winding 2023: 3,016 neurons, 548,000 synapses | 145 | confirmed | https://pmc.ncbi.nlm.nih.gov/articles/PMC7614541/ |
| Winding 2023: "93% of neurons participate in recurrent loops" | 146 | wrong | 41% of brain neurons receive long-range recurrent input. Same URL |
| Hemibrain eLife 9:e57448 | 150 | wrong | e57443. ~25,000 neurons, ~20 M synapses between traced neurons, 5,609 connectivity types. https://pmc.ncbi.nlm.nih.gov/articles/PMC7546738/ |
| FlyWire: 139,255 neurons, 54.5 M synapses, 33 person-years | 153 | confirmed | https://pmc.ncbi.nlm.nih.gov/articles/PMC11446842/ |
| FlyWire: 8,453 types (credited to Dorkenwald); >140 m cable | 155 | misattributed / slightly off | 8,453 types are Schlegel 2024 (Nature 634:139-152). Cable ~149 m. https://pmc.ncbi.nlm.nih.gov/articles/PMC11446831/ |
| Male CNS "Cheong et al. 2024": 162,521 typed neurons, 11,751 types, ~110 M synapses, 103/319 neuropils | 157 | misattributed; numbers from internal notes | The paper is Berg, Beckett, Costa, Schlegel, Januszewski, Marin et al., "Sexual dimorphism in the complete connectome of the Drosophila male central nervous system", bioRxiv 2025 (doi 10.1101/2025.10.09.680999): 166,691 neurons, 11,691 types. Cheong et al. is the MANC descending-to-motor analysis (eLife RP96084). The 162,521 / 11,751 / 103 / 319 figures come from vizbench-notes.md (a count over the v1.0 release files), not a paper. https://www.biorxiv.org/content/10.1101/2025.10.09.680999 |
| MICrONS: 1.4 x 0.87 x 0.84 mm, ~200k cells, ~120k neurons, >523 M synapses; "Bae et al. 2021" | 161 | confirmed (numbers, dataset page); citation misattributed | Cite MICrONS Consortium, bioRxiv 2021 / Nature 640:435-447 (2025). https://www.microns-explorer.org/cortical-mm3 |
| H01: Science 384:eadf8927; ~57k cells, ~150 M synapses, 230 mm vessels, 1.4 PB, up to 50-synapse inputs | 165 | numbers confirmed; article number wrong | eadk4858. https://pmc.ncbi.nlm.nih.gov/articles/PMC11718559/ |
| Oh 2014: 469 injections, 295 structures | 169 | confirmed | https://pmc.ncbi.nlm.nih.gov/articles/PMC5102064/ |
| Knox et al. 2019 Nat Neurosci 22:77-85 | 170 | wrong | Network Neuroscience 3(1):217-236 (2019); 100 um voxels, 428 WT injections. https://pmc.ncbi.nlm.nih.gov/articles/PMC6372022/ |
| Markov 2014: 29 injected / 91 areas, 1,615 pathways, density 66%, FLNe over 5 orders, log-normal | 173 | confirmed | 66% is the 29 x 29 subgraph density. https://pmc.ncbi.nlm.nih.gov/articles/PMC3862262/ |
| Maier-Hein 2017: 96 pipelines, 90% of bundles found, >4 false-positive bundles per valid one | 178 / 360 | confirmed | 96 submissions from 20 groups; mean 21 of 25 bundles; 88 +/- 58 invalid bundles per tractogram. https://pmc.ncbi.nlm.nih.gov/articles/PMC5677006/ |
| Maier-Hein: ">50% false-positive rate" / ">50% of streamlines in fake tracts" | 179 / 361 | wrong | 36 +/- 17% of streamlines were invalid, 54 +/- 23% valid. Same URL |
| Calabrese 2015, 43 um isotropic | 200 | confirmed (resolution) | Title is "A Diffusion MRI Tractography Connectome of the Mouse Brain and Comparison with Neuronal Tracer Data", Cereb Cortex 25:4628-4637. https://pmc.ncbi.nlm.nih.gov/articles/PMC4715247/ |
| (d) dMRI: V1 3.2 mm^3, AL 0.4 mm^3, 5,000 streamlines/voxel, S = 4,200 | 200-203 | invented | Framed with "let"; no dataset value. Also divides by volumes while the formula (line 77) uses surface areas |
| (d) Allen experiment #112881857, V_inj 0.238, VISal 0.412, V_seg 0.0047, W = 0.0479 | 207-213 | invented | Experiment 112881857 does not exist in the Allen API (SectionDataSet query returns 0 rows). A real equivalent: experiment 114008926 (C57BL/6J, VISp injection, injection volume 0.159 mm^3): VISal projection_density 0.0509, projection_volume 0.0426 mm^3, normalized_projection_volume 0.268, VISal volume 0.836 mm^3 (both hemispheres). https://api.brain-map.org/api/v2/data/query.json?criteria=model::ProjectionStructureUnionize,rma::criteria,[section_data_set_id$eq114008926],[hemisphere_id$eq3],[is_injection$eqfalse],structure[acronym$eq%27VISal%27] |
| (d) MICrONS cell IDs 864691135472023456 / ...028912, 4 synapses, PSD areas 0.18/0.31/0.12/0.25 um^2, 1,842 um axon | 216-222 | invented (almost certainly) | Root-ID prefix format is real but these IDs look made up (sequential-looking tails); no source given. Could be replaced by a real CAVE query (needs a token) |
| (d) "1 mm^3 contains ~1.2 x 10^5 neurons; >99.5% of pairs zero" | 226-231 | roughly right in spirit | Order of magnitude consistent with the MICrONS page; the percentage is not sourced |
| (e) dMRI graphs 20-50% dense, macaque 66%, EM 10^-4 to 10^-3 | 239 | plausible, not sourced | 66% confirmed; the others are typical ranges |

## Topic 2: Reconstruction and trust

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| Januszewski 2018 FFN: ~10x fewer errors, error-free path >1 mm | 346 | confirmed | 1.1 mm mean error-free path, zebra finch SBEM (not 8 nm FIB-SEM as stated). https://doi.org/10.1038/s41592-018-0049-4 |
| Buhmann 2021: P = 0.89, R = 0.82, F1 = 0.85, partner assignment 88% on hemibrain v1.2 | 348 | invented | Buhmann is on FAFB, not the hemibrain. Best f-score 0.74 (P 0.72, R 0.77); per-region 0.59-0.73. https://pmc.ncbi.nlm.nih.gov/articles/PMC7611460/ |
| "P_syn 0.85-0.92, R_syn 0.80-0.89" in published pipelines | 315 | overstated | Same source: about 0.7 |
| Eckstein 2024: ACh 90%, GABA 93%, Glu 86%, monoamines 78-85%; >98% at >50 synapses | 322 / 351 | head numbers confirmed, per-class wrong, 98% unverifiable | 87% per synapse, 94% per neuron, 91% per known type. No ">98% at >50 synapses". https://pmc.ncbi.nlm.nih.gov/articles/PMC11106717/ |
| FlyWire ">3 million manual edits" | 355 / 434 | unverifiable | Not in the Dorkenwald 2024 text |
| Input ~95% vs output ~42% completeness, 2.4x output undercount; "vizbench release notes 2026" | 327 / 357 | provenance fabricated; mechanism inverted | The numbers are from vizbench-notes.md (the user's own check on male CNS v1.0), not a release note. The report's explanation (a neuron's own thin axon twigs are orphaned) is backwards for fly EM. Scheffer 2020: "The postsynaptic densities are typically in smaller neurites, and it is these that are difficult for both machine and human to connect", with PSD completeness 20-85% by region. The consistent reading: a neuron's inputs come from T-bars on well-traced axons (so input partners are mostly known), while its outputs land on the fine dendritic twigs of downstream cells, which are often orphan fragments. The gap is real; the arbor story in lines 330-333 and 380-381 is wrong. https://pmc.ncbi.nlm.nih.gov/articles/PMC7546738/ |
| Thomas 2014: dMRI false-positive rates 40-70% | 363 | unverifiable | Paper shows a sensitivity-specificity trade-off; best Youden index <= 0.59; no 40-70% figure. https://pmc.ncbi.nlm.nih.gov/articles/PMC4246325/ |
| Witvliet: edges with w >= 10 are 100% conserved; w = 1-2 <50% reproducible | 366 | unverifiable (not in paper) | Paper classes connections as stable (~43%), variable (~43%, holding ~16% of synapses, mean 1.4 synapses), developmentally dynamic (~14%). Same URL as Topic 1 |
| Schlegel 2024: left/right edge correlation r = 0.85-0.92; single-synapse edges <35% conserved | 369 | wrong | Cell-type edge weights: R = 0.97 left vs right in FlyWire, R = 0.8 FlyWire vs hemibrain. A 1-synapse hemibrain edge appears in one FlyWire hemisphere 42% of the time, in both 16%. Edges >10 synapses (or >0.9% of input) recur >90%. https://pmc.ncbi.nlm.nih.gov/articles/PMC11446831/ |
| (d) "DA1_adPN" | 386-391 | wrong (no such type) | DA1 projection neurons are DA1_lPN (lateral neuroblast lineage, about 8 per hemisphere) and DA1_vPN. DL5_adPN is real. https://www.virtualflybrain.org/term/adult-antennal-lobe-projection-neuron-da1-lpn-fbbt_00067363/ |
| (d) dendrite 1,420 um, axon 11,800 um, 312 twigs at 42 nm, S_in 1,250, S_out 1,100, 4 h cap, 35 h, 78 of 312 twigs, 462 / 638 outputs | 393-414 | invented | Built backwards from the 95% / 42% note (1,188/1,250 = 95.0%, 462/1,100 = 42.0%). No proofreading-hours data exist per neuron in any release |
| Figure 2.2 premise "merge errors cause exponential collapse" | 453-463 | unsourced | Reasonable intuition, but no paper is cited for the quantitative claim |

## Topic 3: Cell types

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| NBLAST (Costa 2016): FlyCircuit ~16,000; 98% accuracy on 40+ glomerular PN types | 534 | overstated | 16,129 neurons; 97.6% on 35 PN types. https://pmc.ncbi.nlm.nih.gov/articles/PMC4961245/ |
| Hemibrain ~21,700 neurons into ~5,620 types; "Li et al. 2020" typing method | 537 | roughly right; citation misattributed | 5,609 connectivity types (5,229 morphology types). Li et al. 2020 is the mushroom-body connectome paper; typing (NBLAST + CBLAST) is in Scheffer 2020 |
| FlyWire 8,453 types, 4,581 new, 9 superclasses | 511-513 / 540 | confirmed | Schlegel 2024. ">90% of central-brain cells paired L/R" not checked; about a third of hemibrain types could not be re-identified |
| Male CNS 162,521 / 11,751 (Cheong) | 543 | misattributed | See Topic 1 |
| Scala 2021: ~115 t-types, ~45 me-types | 546 | invented | Scala defined no me-types; reference taxonomy has 133 t-types. Continuum within families is confirmed. https://pmc.ncbi.nlm.nih.gov/articles/PMC8113357/ |
| Zeng & Sanes 2017, Cembrowski & Spruston 2019, Vogelstein 2015 FAQ | 547-551 / 504 | confirmed | NRN 18:530-546; NRN 20:193-204; PLoS One 10:e0121002 |
| (d) DA1 and DL5 "both from the anterodorsal lineage" | 577 | wrong | DA1 PNs are lateral lineage (lPN); DL5 is adPN. Both use the mALT (correct) |
| (d) NBLAST scores 0.864 / 0.682 | 580-581 | invented | No source. Real values are computable with navis/nat on hemibrain or FlyWire skeletons |
| (d) Or67d -> DA1_R 485, Or7a -> DL5_R 462, Or67d -> DA1_L 472; cosines 0.915 / 0.038 | 589-597 | invented, internally inconsistent | No source. With only the two stated input types the cosine would be exactly 1 and 0; the "..." terms are unspecified. Or67d -> DA1 and Or7a -> DL5 pairings are correct. Real counts need a neuPrint query (ORN_DA1 -> DA1_lPN) |
| (d) alpha = 0.5 joint distance, cutoff 0.25 | 600-603 | arithmetic on invented inputs | |
| (e) "Many hemibrain types split into 2-3 in FlyWire because bilateral data showed mirrored variation" | 609 | overstated | Schlegel 2024 revised many types both ways (merges and splits) and could not re-identify about a third; the specific causal story is not from the paper |

## Topic 4: Graph statistics and null models

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| Watts & Strogatz 1998: n = 282, C 0.28 vs 0.05, L 2.65 vs 2.25 | 722 | confirmed | sigma = 4.75 is the report's arithmetic (Humphries & Gurney 2008 index), not a W&S number. https://doi.org/10.1038/30918 |
| Song 2005: bidirectional 5.3% vs 1.4% (3.9x), p < 10^-6 | 725 | overstated | 218/4,025 = 5.4% vs 1.35% expected (about 4x), p < 0.0001. https://pmc.ncbi.nlm.nih.gov/articles/PMC1054880/ |
| Song 2005: triplet motifs 7 (FFL) and 16 enriched | 726 | wrong | Patterns 1-9 near 1x (pattern 7 about 1x); patterns 10-16 enriched (16 about 8x on only 3 counts). Song's null already includes the observed reciprocity. Song numbering is not Milo's |
| Milo 2002: C. elegans FFL Z > 4 | 728 | wrong | FFL Z = 3.7 (125 vs 90 +/- 10); bi-fan Z = 5.3. Null preserves in/out degree and mutual-edge counts |
| van den Heuvel & Sporns 2011: Phi_norm > 1.2 for k > 25; fronto-parietal and insular hubs | 731 | wrong | 12 regions: bilateral precuneus, superior frontal, superior parietal, hippocampus, putamen, thalamus (no insula). Phi_norm > 1 for k = 11-17 (unweighted). https://pmc.ncbi.nlm.nih.gov/articles/PMC6623027 |
| Clauset 2009 rejected power laws "across connectomes, p < 0.01" | 669 / 734 / 807 | invented | None of Clauset's 24 datasets is neural. Broido & Clauset 2019 (927 networks) found strong scale-free structure rare, but no connectome-specific test either. https://arxiv.org/abs/0706.1062 |
| Betzel 2016: 13 models, human dMRI and mouse tracer, EDR explains >85% of clustering and degree variance | 737 | wrong / invented | 13 models, human dMRI only (380 people, 3 cohorts); best model is spatial penalty plus homophily (matching index). No 85% figure; exponential form was not better than power law. https://pmc.ncbi.nlm.nih.gov/articles/PMC4655950/ |
| Roberts 2016: geometric null explains almost all clustering; sigma drops to ~1.0 | 740 | unverifiable / overstated | Abstract: geometry makes a "major, but not definitive" contribution; hubs and rich-club links deviate from geometry. The degree- and length-preserving rewiring null is Roberts', not Betzel's (line 710). https://doi.org/10.1016/j.neuroimage.2015.09.009 |
| Towlson 2013 (cited in brief only) | - | confirmed | 11 rich-club neurons (AVA, AVB, AVD, AVE, PVC pairs plus DVA), k >= 44. https://pmc.ncbi.nlm.nih.gov/articles/PMC4104292 |
| (d) C. elegans N = 279, M = 2,194 directed chemical edges | 756 | confirmed | Varshney 2011; recomputed from NeuronConnectFormatted.xlsx (OpenWorm): 279 neurons, 2,194 directed pairs, 6,394 synapses |
| (d) C_actual 0.280, L_actual 2.65 on the directed 279-neuron graph | 758 | wrong source mixing | Those are W&S values on a different (282-neuron, undirected, chemical plus gap) graph. On the Varshney chemical graph (undirected, 276 neurons with positions, largest component) I get C = 0.319, L = 2.58 |
| (d) Spatial null: lambda_spatial 125 um, C_spatial 0.258 +/- 0.011, L_spatial 2.52; sigma collapses 4.75 -> 1.03; 91% of excess clustering explained by distance | 771-776 | invented, and the conclusion is contradicted by the data | Recomputed with Kaiser & Hilgetag 2006 neuron positions (2D, 277 neurons) and the Varshney chemical graph, 20 random graphs per null. ER: C 0.051, L 2.43, sigma 5.92. Distance-binned spatial null (20 quantile bins of empirical P(edge given d)): C 0.060, sigma 5.04. Fitted exponential EDR (xi = 0.76 mm, nearly flat): sigma 5.41. Degree-preserving (Maslov-Sneppen): C 0.127, sigma 2.32. Degree plus edge-length-bin preserving rewiring: C 0.139, sigma 2.16. Space alone explains about 4% of the excess clustering, not 91%; degree sequence explains more; sigma stays above 2 under every null. Caveat: positions are 2D lateral projections with heavy head/tail clustering, so distance is a weak predictor inside the nerve ring |
| (e) table: small-world "collapses", reciprocity "survives ~4x above distance-matched", FFL survives, rich club survives | 780-803 | unsourced | No citations; the small-world row is contradicted for C. elegans by the recomputation above. The rows are plausible hypotheses, not results |
| Concept 4.1 "sigma 8.4 under ER, 1.03 under EDR"; 4.2 Z-score ranges | 815-820 | invented | Should be computed live |

## Topic 5: Wiring economy and space

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| Cherniak 1994: all 11!/2 = 19,958,400 orderings of 11 ganglia; actual is the minimum | 862 | wrong count | 11! = 39,916,800; actual layout is the minimum wirelength ordering. https://terpconnect.umd.edu/~cherniak/globopt.htm |
| Chen, Hall, Chklovskii 2006: optimal positions correlate r > 0.85 | 865 | invented (as stated) | No correlation reported. Mean deviation 9.71% of body length (median 5.10%) vs 34.6% for random layouts; outliers include PVQ, PVT, DVC, AVA, AVG, RID, SDQL, HSNL, DA06. https://pmc.ncbi.nlm.nih.gov/articles/PMC1550972/ |
| Kaiser & Hilgetag 2006: wiring 48% (worm) / 32% (macaque) above minimum | 868 | confirmed | Numbers right. "Extra wire buys shortcuts" / "reduce path lengths by up to 60%" (line 915) overstated: placement reordering does not change hop length; longer paths appear only when long-range projections are removed. https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.0020095 |
| Ercsey-Ravasz 2013: lambda = 0.188/mm, xi = 5.3 mm; 80% of weight < 10 mm | 871 | lambda confirmed; 80% unverifiable | lambda = 0.188/mm describes the distribution of projection lengths of labelled neurons (white-matter distances); the log(FLN)-vs-distance slope is 0.150/mm. https://pmc.ncbi.nlm.nih.gov/articles/PMC3954498 |
| Markov 2014 Cereb Cortex | 874 | confirmed | See Topic 1. "core-periphery clique" wording is loose |
| Mishchenko 2010: 107 um^3; axons synapse on 20% of spines they touch | 877 | volume wrong; 20% roughly right | Four volumes totalling 670 um^3 of rat CA1 neuropil; synapse density about 0.2 of touch density. https://pmc.ncbi.nlm.nih.gov/articles/PMC3215280 |
| Kasthuri 2015: 1,500 um^3; proximity insufficient | 880 | confirmed | "Refute[s]" Peters' rule as sufficient. https://www.cell.com/cell/fulltext/S0092-8674(15)00824-7 |
| (e) "geometry accounts for 65-75% of cortical edge presence and weight" | 917 | unsourced | On a public extract of the Markov 29 x 91 matrix I get R^2 = 0.21 for ln(FLNe) vs distance across 1,660 present pathways (slope 0.136/mm), so per-pathway weight is far from 70% explained by distance alone. Presence is better predicted (Ercsey-Ravasz show EDR reproduces many graph properties) but no 65-75% figure was found |
| (d) distances V2-V1 4 mm, MT-V1 15 mm, 8l-V1 35 mm; FLNe 0.158 / 0.0182 / 0.00034; ratios 8.68 and 464.7 | 903-911 | invented | Real (white-matter distances and FLNe into V1, from the Markov-lab 29 x 91 extract in netneurotools): V2 9.3 mm, FLNe 0.732; MT 12.5 mm, 0.0588; 8L 45.6 mm, 0.000215. Observed ratios 12.4 and 3,408; EDR with lambda = 0.188 predicts 1.8 and 920. So the EDR does not "capture the 460-fold drop within scatter" for these pathways; it underpredicts both contrasts. Also the example reads exp(-lambda d) as a connection probability, which is not what lambda = 0.188 describes |
| (e) "V1 to A1 orders of magnitude weaker than predicted" | 919 | unsourced | |

## Topic 6: Modules, hierarchy, ordering

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| Resolution-limit derivation, k_s < sqrt(2m) | 946-958 | confirmed | Matches Fortunato & Barthelemy 2007 (l_s below about sqrt(2L)). https://arxiv.org/abs/physics/0607100 |
| Newman & Girvan 2004 benchmarked on C. elegans | 993 | wrong | Karate club, collaboration network, food web, dolphins, Les Miserables. https://arxiv.org/abs/cond-mat/0308217 |
| Peixoto nested SBM "273 networks" | 999 | wrong number / misattributed | Peixoto 2014 PRX 4:011047 is real. The large-corpus study is Vaca-Ramirez & Peixoto 2022 (275 networks). https://arxiv.org/abs/2201.01658 |
| Bar-Joseph 2001 optimal leaf ordering O(N^3) | 975 / 1002 | wrong | 2001 paper: O(n^4) time. O(n^3) is later work |
| Felleman & Van Essen 1991: 305 connections, 32 areas, 10 levels | 1005 | confirmed | 14 levels including retina/LGN and entorhinal/hippocampus |
| Markov 2014 probit model explains >85% of laminar variance; sourced to Cereb Cortex | 982 / 1008 | unverifiable; wrong paper | The SLN hierarchy is Markov et al. 2014 J Comp Neurol 522:225-259, beta-binomial GLM with probit link; fit reported as correlations (median r about 0.81), no % variance. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4255240/ |
| Harris 2019: 37 cortical and 24 thalamic areas; shallow hierarchy 0-1.5 | 1011 | roughly confirmed | ~1,256 experiments; global hierarchy score 0.128 vs ~0.68 for a perfect hierarchy. "Mouse lacks strict layer 4" (1059) is overstated. https://pmc.ncbi.nlm.nih.gov/articles/PMC8433044 |
| Good, de Montjoye, Clauset 2010: 15-30% of boundary nodes change with seed | 1057 | paper real; percentage unsourced | |
| (d) m = 2,990 synapses in C. elegans chemical connectome | 1031 | invented | Varshney: 6,393 chemical synapses, 2,194 directed connections (about 1,900 undirected pairs). 2,990 matches nothing |
| (d) egg-laying circuit (HSNL/R, VC1-5) internal 38, external 24 synapses | 1035 | wrong | Recomputed from Varshney data: internal 36 synapses, 197 outgoing and 33 incoming to the rest of the network. The circuit's total degree is far above the report's 62, and Delta Q conclusions change accordingly |
| (d) "motor pool k2 = 180, l12 = 12" | 1039 | invented | |
| (d) SLN V1->V2 0.982, V1->MT 0.891, V4->V1 0.012; MT sits below V2 | 1045-1053 | inputs unverifiable; conclusion wrong | In Markov 2014 JCN, MT sits above V2 and V3 and slightly above V4. Inverting single pathways with a raw probit also ignores the model's dispersion and scale |

## Topic 7: Signal flow and layering

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| SpringRank formulation and Laplacian system | 1115-1132 | confirmed | Correct derivation. Citation article number is eaar8260, not eaar8280; it "often" outperforms alternatives (BTL wins on some datasets). https://pmc.ncbi.nlm.nih.gov/articles/PMC6054508/ |
| Schlegel 2021: theta = 0.30, 256 runs | 1158 | half wrong | 30% threshold confirmed; 10,000 runs (5,000 per RN type), hemibrain v1.2. 256 is the vizbench setting. https://pmc.ncbi.nlm.nih.gov/articles/PMC8298098/ |
| Schlegel 2021 layers ORN 0, uPN 1.00 +/- 0.04, KC 2.31 +/- 0.18, MBON 3.42 +/- 0.31; LH feedback 28% | 1158 | invented | Paper numbers layers from 1 (ALRN seeds); PNs in layer 2; KCs and LHNs span layers 3 and 4. No SD table, no 28% |
| Dorkenwald 2024: touch 3.9 steps, vision 7.9 steps, max depth 14 | 1162 / 1238 | invented and misattributed | Dorkenwald reports percentile ranks, and found motor/descending neurons are reached early for both mechanosensory and visual input. 3.9 / 7.9 are from vizbench-notes.md (male CNS type graph). https://pmc.ncbi.nlm.nih.gov/articles/PMC11446842/ |
| Scheffer 2020: sensory >70% feedforward, >45% feedback in CX and MB | 1166 | invented | The paper never uses feedforward/recurrent in this sense |
| (d) SpringRank W for ALML, AVDL, AVAL, VA1 ("verified chemical synapse counts") | 1193-1200 | invented | Varshney data: ALML->AVDL 0, ALML->AVAL 0, AVDL->AVAL 13 (not 22), AVDL->VA1 0, AVAL->AVDL 1 (not 8), AVAL->ALML 0, AVAL->VA1 0. ALML's real top outputs: BDUL 6, PVCL 4, CEPDL 3. AVAL's: DA6 11, PVCL 10, VA8 9. The solution s and H = 14.79 are correct for the invented matrix |
| (d) PN->KC 4.2 synapses, KC ~26 claws; theta sensitivities; MBON step 5.2 | 1227-1231 | invented / wrong | KCs have about 6-7 claws on average (Caron 2013), not 26; per-KC input counts not sourced. The whole example is unsupported |
| (e) theta = 0.10 collapses depth 8 -> 4; theta = 0.60 fragments graph | 1241 | unsourced | Worth computing, not established |

## Topic 8: Spectra, communication, control

| Claim | Line | Verdict | Correct value and source |
|---|---|---|---|
| Atasoy 2016: ~10,000 vertices; LSD shift in the same paper | 1333 | wrong on both | 20,484 vertices, 10 HCP subjects. LSD is Atasoy et al. 2017 Sci Rep 7:17661. https://pmc.ncbi.nlm.nih.gov/articles/PMC4735826/ |
| Pang 2023: >10,000 task maps, 255 subjects, R^2 > 0.80 with K = 50 | 1337 | wrong | Main analysis: 47 contrasts from 7 HCP tasks, 255 subjects. The ~10,000 NeuroVault maps are a separate wavelength analysis. Measure is Pearson r: r about 0.38 at 10 modes, about 0.80 at about 100 modes. https://pmc.ncbi.nlm.nih.gov/articles/PMC10266981/ |
| Critique: "Faskowitz, Sporns & Betzel 2023/2024, bioRxiv 2023.07.03.547547, PNAS 2024"; spin-rotated noise gives R^2 0.80; connectome modes explain interhemispheric FC r > 0.65 | 1340-1341 / 1449 | wrong authors, wrong DOI, invented venue and results | Real: Faskowitz, Moyer, Handwerker, Gonzalez-Castillo, Bandettini, Jbabdi, Betzel, "Commentary on Pang et al. (2023) Nature", bioRxiv doi 10.1101/2023.07.20.549785 (no journal version found). They showed that modes from a sphere, other brains and random blob shapes, and spin-rotated real task maps, reconstruct about as well, so the method lacks specificity; connectome modes "similarly lack specificity". Other real exchanges: Patil, Jung, Eickhoff commentary (doi 10.1101/2023.10.06.561240); Pang et al. reply (10.1101/2023.10.06.560797); Mansour L., Behjat, Van De Ville, Smith, Yeo, Zalesky, "Eigenmodes of the brain: revisiting connectomics and geometry" (10.1101/2024.04.16.589843), showing better-built connectome eigenmodes match geometric ones; Pang et al. reply (10.1101/2024.08.21.608487). https://www.biorxiv.org/content/10.1101/2023.07.20.549785v1 |
| Seguin 2018: macaque 29, mouse 112, human 219; SR > 0.80; coordinate randomisation cuts success 45-60% | 1345 | partly wrong | Human: 75 HCP subjects at 256/360/512/1,024 nodes (no 219). Macaque and mouse SR 100%; human SR 89-96%. The 45-60% drop is for rewiring topology or repositioning nodes, on navigation performance generally. https://pmc.ncbi.nlm.nih.gov/articles/PMC6004443/ |
| Gu 2015: N = 234, DMN high average, cognitive-control high modal | 1349 | confirmed | Gu itself reports AC vs weighted degree r = 0.91, modal vs degree r = -0.99. https://pmc.ncbi.nlm.nih.gov/articles/PMC4600713/ |
| Tu 2018: condition number > 10^15; 90% of state space needs energy > 10^14 | 1353 / 1455 | overstated / unverifiable | Tu reports Gramian smallest eigenvalues about 1e-14 to 1e-17 (statistically indistinguishable from zero) and that null models reproduce AC/MC-degree relations; no "90% of state space" statement. Replies: Pasqualetti, Gu, Bassett 2019 NeuroImage 197:586-588; Suweis et al. 2019 NeuroImage 200:552-555. https://pmc.ncbi.nlm.nih.gov/articles/PMC6607911/ |
| Suarez 2020: AC correlates r > 0.95 with degree; "Suarez 2024" | 1357 / 1452 | misattributed | The AC-degree result is Gu 2015 (r = 0.91), plus Wu-Yan 2018 and Karrer 2020. Suarez 2024 is the conn2res reservoir-computing paper, unrelated |
| (d) 8-region "empirical tractography streamline matrix" and Gramian spectrum | 1387-1420 | invented input; arithmetic correct; interpretation wrong | Matrix is not from Gu or Tu. I reproduce lambda_max 113.34 and all eight Gramian eigenvalues exactly. But sigma_8 = 6.8e-16 sits at double-precision noise, so kappa ~ 10^16 is partly a floating-point artifact, and "1.4 trillion volts" confuses a squared-input energy with a voltage |
| (d) Macaque 3D coordinates for V1, V2, V4, TEO, LIP, FEF; greedy path V1 -> V4 -> LIP -> FEF, stretch 1.128 | 1423-1442 | invented | No coordinates of this kind are in Markov 2014. Neighbour sets are asserted, not read from the matrix. Arithmetic on the invented coordinates checks |
| (e) "geometric modes get R^2 0.80 on pure rotated noise" | 1449 | invented | See the critique row above |

---

## Results that are solid and drawable from public data

These are the things I would build figures on. Each is either confirmed in the primary paper or recomputed here from a public file.

1. **C. elegans small-world against a ladder of nulls (recomputed).** Varshney 2011 chemical graph (OpenWorm `NeuronConnectFormatted.xlsx`, 279 neurons, 2,194 directed pairs, 6,394 synapses) plus Kaiser & Hilgetag 2006 2D neuron positions (`celegans277.mat`, https://www.cs.cornell.edu/~arb/data/spatial-Celegans/). C = 0.319, L = 2.58; sigma is 5.9 (ER), 5.0 (distance-binned spatial), 2.3 (degree-preserving), 2.2 (degree plus length preserving). The honest story is the opposite of the report's: in the worm, degree heterogeneity, not geometry, eats most of the "small-world" excess, and sigma stays above 2. Runs in a browser in seconds. Scripts: scratchpad `worm.py`, results `worm_results.json`.
2. **Watts & Strogatz 1998 table values** (n = 282, C 0.28 vs 0.05, L 2.65 vs 2.25) as the historical starting point.
3. **Towlson 2013 rich club:** 11 neurons (AVA, AVB, AVD, AVE, PVC pairs, DVA), k >= 44; recomputable from the same file.
4. **Real command-circuit wiring** for a SpringRank or flow figure: AVD -> AVA 13 + 19 + 16 + 15 synapses, AVA outputs onto DA/VA/AS motor neurons, ALM -> BDU/PVC; SpringRank on the full 279-neuron graph is a sparse solve, drawable live. Use the real matrix, not the report's.
5. **Macaque interareal FLNe and distances (Markov 2014, 29 x 91, 1,615 pathways, 66% dense among the 29):** V2 -> V1 FLNe 0.73 at 9.3 mm, MT -> V1 0.059 at 12.5 mm, 8L -> V1 0.00021 at 45.6 mm; FLNe spans 5 orders of magnitude, log-normal per target. lambda = 0.188/mm (projection-length distribution) and 0.150/mm (log FLN vs distance) from Ercsey-Ravasz 2013. Per-pathway ln FLNe vs distance R^2 is only about 0.2, a good "geometry predicts a lot but not everything" figure. Get the matrix from core-nets.org (the netneurotools OSF extract `macaque_markov` has a corrupted row, label "2" duplicates V2, and columns do not sum to 1, so don't ship it).
6. **Allen mouse projection values** straight from the API, e.g. experiment 114008926 VISp -> VISal: projection_density 0.0509, normalized_projection_volume 0.268. A real three-modality comparison is possible for mouse: Calabrese 2015 dMRI connectome vs Oh 2014 / Knox 2019 tracer matrices (Calabrese compared exactly these).
7. **Kaiser & Hilgetag 48% / 32% wiring reduction** and **Chen, Hall, Chklovskii 2006 predicted vs actual positions** (mean deviation 9.7% of body length vs 34.6% random) for a wiring-economy figure; the quadratic-cost layout is a linear solve on the worm graph.
8. **Cherniak's 11-ganglion placement**, 11! = 39,916,800 orderings, actual layout minimal.
9. **Resolution limit** (exact derivation, k_s < sqrt(2m)) on a ring of cliques: pure math, fully drawable.
10. **FlyWire / hemibrain stereotypy numbers** (Schlegel 2024): edge-weight R = 0.97 L vs R, 0.8 across brains; 1-synapse edges reappear 42% (one side) / 16% (both); >10-synapse edges >90%. **Witvliet 2021** stable vs variable connections (43% variable, holding 16% of synapses; mean 1.4 vs 6.6 synapses). Good for a trust / thresholding figure.
11. **Maier-Hein 2017**: 21 of 25 bundles found on average, 88 +/- 58 invalid bundles per tractogram, 36% of streamlines invalid.
12. **Song 2005**: connection probability 0.116, bidirectional pairs 5.4% vs 1.35% expected, triplet patterns 10-16 enriched against a reciprocity-aware null. Small table, drawable as a bar chart.
13. **Input vs output completeness gap** in fly EM is real (the user's own 95% / 42% male CNS check), but explain it correctly: postsynaptic twigs of downstream partners are the untraced fragments.
14. **Controllability**: AC vs degree r = 0.91 and modal vs degree r = -0.99 (Gu 2015) is directly recomputable on any public structural matrix; that collinearity is the cleanest critique figure. Tu 2018's point is the near-zero smallest Gramian eigenvalue.
15. **Seguin 2018 navigation**: SR 100% in macaque (29) and mouse (112), 89-96% human; drawable on the Markov matrix with real area centroids once coordinates are obtained from the atlas (not the report's invented ones).
