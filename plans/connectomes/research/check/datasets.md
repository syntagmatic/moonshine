# Section 6 dataset inventory: verification against primary sources

Checked 2026-09-30. Scope: REPORT.md Section 6 (lines 2452-2520), the 6.1 table and the 6.2 discrepancy claims. Every download location was fetched; file names and byte sizes are from today's listings or downloads. Counts marked "computed" were computed here from the released files, not copied from a paper.

Verdicts: correct / wrong / unverifiable (no source found either way) / invented (a specific figure or artifact with no source, where the real value is known and differs, or the thing does not exist).

## Summary

| Dataset | Headline counts | Citation | License | Download location | Overall |
|---|---|---|---|---|---|
| C. elegans herm (Cook 2019) | 302 neurons and 132 muscles right; end organs, chemical edges, synapses, gap junctions all wrong | correct | wrong (not CC-BY; none stated) | wormwiring.org real (XLSX); OpenWorm formats invented | numbers need replacing |
| C. elegans male (Cook 2019) | 385 and 91 right; muscles, chemical edges, gap junctions wrong | correct | wrong | wormwiring.org real (XLSX only) | numbers need replacing |
| Witvliet 2021 | 8 animals right; neurons per volume, L1/adult synapse counts, 5.01-fold wrong | correct | wrong (not CC-BY) | bossdb, supplement real; NemaNode JSON is the handy source | numbers need replacing |
| Winding 2023 | 3,016 neurons, 548k synapses, 93 types right; 150k edges and 44,124 w>=2 wrong | correct | CC BY via Europe PMC manuscript | "Cambridge repository" and GraphML invented; Data S1 CSV real | solid with edge counts replaced |
| Hemibrain v1.2.1 | 21,739 traced right; 3,428,212 edges and 20.4 M wrong | correct | correct | bucket path invented (real: gs://hemibrain/v1.2/) | solid with fixes |
| Male CNS v1.0 | 162,521 / 11,751 reproduce from the v1.0 file but are not the paper's (166,691 / 11,691); 130+ M wrong | wrong (cited paper is MANC) | correct | gs://flyem-male-cns/v1.0/ real | citation and numbers need replacing |
| FlyWire v783 | 139,255, 54.5 M, 15.1 M right; W>=5 5.34 M wrong (2,700,513) | correct | correct (Zenodo) | Codex gated; Zenodo 10676866 is the open source | solid, fix W>=5 |
| MICrONS | 120k neurons (both subvolumes), 523 M right; 1,183 proofread and 48,212 edges invented | wrong (should be MICrONS Consortium 2025 Nature) | correct | real; CSV/pickle, not Parquet | solid dataset, invented detail |
| Allen Oh 2014 / Knox 2019 | 213/426 belongs to Oh, not Knox; 1.8e5, 112, ">1,000 experiments" wrong | correct | label invented (Allen terms, non-commercial) | real (CSV; Oh XLSX) | 6.2 has the releases backwards |
| Markov 2014 | 29, 91, 29x91 right; "6 orders" wrong (5); SLN is a different paper | correct (CoCoMac wrong) | CC BY-NC, not "Academic Open Access" | core-nets.org down today; files were XLS | usable via mirrors |
| H01 | 57k cells, 16k neurons, 150 M right; 41k glia and 1,200 proofread wrong | correct | correct (data CC-BY) | real; JSON/Avro, not Parquet | solid, fix two numbers |

Every "smallest useful browser extract" in the 6.1 table (sizes such as ~120 KB, ~850 KB, the 540-neuron/8,200-edge MICrONS column, the 180-neuron H01 subgraph, the 103-neuropil male CNS matrix) is a proposal, not an existing released file. None was found as a published artifact. Treat them as build targets.

Section 6.3 also cites "44,124 reliable edges of the larval fly" and a 36 MB dense larval matrix; the real dense CSVs are 29 to 35 MB each (2,952 x 2,952), so the size is about right but the edge count is not.

## User-notes claims presented as published (male CNS)

- "input ~95% complete, output ~42% traced": the report states this in the 6.1 table as a dataset property with no attribution. The published figure (Berg et al., male CNS paper) is "94% pre- and 42% postsynaptic completion rates", which means 94% of presynaptic sites (neuron outputs) and 42% of postsynaptic densities (neuron inputs) lie on proofread neurons. The note's labels are inverted: it is output ~94%, input ~42%. FlyWire reports the same pattern (93.7% pre, 44.7% post).
- "dimorphic 13x": not in Section 6, but it appears at REPORT.md line 2018 as a "13-fold segregation metric". The paper has no 13x figure; its nearest statistic is 6.3% of male versus 1.3% of female central-brain edges being dimorphic (about 5x).
- The same 95/42 claim recurs outside Section 6 as published fact: line 357 (table row), lines 448-451 (figure spec), line 2109, line 2536 ("roughly 95% complete ... 42% traced"), and line 2576, which attributes it to "Takemura et al. 2023; Scheffer et al. 2020". Neither paper states it; the published source is Berg et al. (male CNS), with the labels the other way round.


# Per-dataset tables

## C. elegans hermaphrodite (Cook et al. 2019)

Counts below marked "computed" were parsed from the WormWiring SI spreadsheets downloaded today. "Neuron-only" means rows and columns restricted to the 302 hermaphrodite neurons (393 neurons across both sexes, from `SI 4 Cell lists.xlsx`), self-loops dropped.

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | Cook et al. (2019) / WormWiring | Cook SJ, Jarrell TA, Brittin CA, et al., "Whole-animal connectomes of both Caenorhabditis elegans sexes", Nature 571:63-71 (2019), doi:10.1038/s41586-019-1352-7 | https://api.crossref.org/works/10.1038/s41586-019-1352-7 | correct |
| Neurons | 302 | 302 (paper: "460 nodes (302 neurons, 132 muscles, and 26 non-muscle end organs)"); cell lists give 20 pharyngeal + 274 sex-shared + 8 herm-specific = 302 (computed) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6889226/ | correct |
| Muscles | 132 | 132 | same | correct |
| End organs | 22 | 26 non-muscle end organs | same | wrong |
| Chemical edges | 3,638 directed | Paper: 4,887 chemical (directed) edges for the whole 460-node graph. Computed from `SI 5 ... corrected July 2020.xlsx`: 4,879 nonzero cells in the whole-graph matrix; 3,671 neuron-to-neuron directed edges. From `SI 2 Synapse adjacency matrices.xlsx` (scored synapses only, no extrapolation): 3,207 neuron-to-neuron edges. 3,638 matches none | paper; WormWiring SI 2 and SI 5 | wrong |
| Chemical synapses | 6,629 | SI 3 synapse list: 7,318 chemical and 2,355 electrical synapse entries (all partners incl. muscle). SI 5 weights are EM section counts (size-weighted), not synapse counts: neuron-to-neuron sum 20,848 sections. 6,629 found nowhere | WormWiring SI 3, SI 5 | invented |
| Gap junctions | 890 | Paper: 1,447 gap-junction (undirected) edges, whole graph. Computed neuron-to-neuron undirected pairs: 1,091 (corrected July 2020) / 1,093 (original); scored-only (SI 2): 915 | paper; SI 5; SI 2 | wrong |
| License | CC-BY 4.0 | None stated. Nature article is not open access (Springer TDM license in Crossref; PMC copy is an author manuscript). WormWiring pages carry no license text. Treat as "freely downloadable, cite Cook et al. 2019" | Crossref; wormwiring.org | wrong |
| Location | wormwiring.org; GitHub openworm/CElegansNeuroML (CSV, JSON, GraphML) | wormwiring.org is live; files are XLSX only (see below). openworm/CElegansNeuroML (last push 2023-03, no license set) holds NeuroML cell morphologies and the older Varshney `NeuronConnectFormatted.xlsx`; it has no Cook 2019 CSV, JSON or GraphML. The Cook matrices are mirrored as XLSX in openworm/c302 and openworm/ConnectomeToolbox, and as JSON in ConnectomeToolbox `cect/cache/` | https://wormwiring.org/pages/adjacency.html ; https://github.com/openworm/CElegansNeuroML | partly wrong (formats and repo invented) |
| Browser extract | 302x302 + 3D coords + NT, ~120 KB JSON | Plausible, but must be assembled: Cook has no positions or transmitters; those come from OpenWorm NeuroML and a transmitter atlas (see recommended sources) | n/a | design suggestion, not an existing file |

Real files at https://wormwiring.org/si/ (listed on https://wormwiring.org/pages/adjacency.html; sizes are bytes downloaded today):

| File | Size | Contents |
|---|---|---|
| `SI 5 Connectome adjacency matrices, corrected July 2020.xlsx` | 4,188,190 | sheets: hermaphrodite chemical (herm 454 x 454 cells incl. muscles/end organs), herm gap jn symmetric/asymmetric, male chemical, male gap jn symmetric/asymmetric. Weights = EM serial sections, size-weighted, with gap extrapolation |
| `SI 5 Connectome adjacency matrices.xlsx` | 4,367,796 | original July 2019 version |
| `SI 2 Synapse adjacency matrices.xlsx` | 1,316,665 | scored synapse counts per pair, no extrapolation (polyads counted once per partner) |
| `SI 3 Synapse lists.xlsx` | 1,310,019 | every synapse: contin id, EM series, pre, post partners in order, type, sections |
| `SI 4 Cell lists.xlsx` | 27,039 | cell lists (pharynx, sex-shared, herm-specific, male-specific) with cell type (sensory/inter/motor/muscle/...) |
| `SI 6 Cell class lists.xlsx` | 11,454 | class membership |
| `SI 7 Cell class connectome adjacency matrices, corrected July 2020.xlsx` | 235,706 | class-level matrices |
| `Adult and L4 nerve ring neighbors.xlsx` | not fetched | membrane contact (Brittin) |

Section 6.2 item 3 (C. elegans):

| Item | Report claim | Verified value | Verdict |
|---|---|---|---|
| Varshney 279 | 279-neuron graph arose from "physical gaps in the ventral nerve cord and anterior bulb" | Varshney et al. 2011 used the 279 somatic neurons with synapses: 302 minus the 20 pharyngeal neurons (separate network) minus CANL/R and VC06, which make no synapses. It was not a gap artefact; Varshney actually filled the ventral cord gaps by re-annotation | wrong explanation |
| Cook "restoring the full 302" | re-imaged archival prints | Cook re-annotated the White et al. micrographs (hermaphrodite) and Sulston/Jarrell male tail series, plus new male head micrographs; no re-imaging of the hermaphrodite. 302 was never in dispute | misleading |
| Male 385 | discovered male has 385 neurons | 385 correct (294 shared + 91 male-specific). The male neuron count was established earlier (Sulston et al. 1980); Cook completed the male head | number correct, framing wrong |
| "chemical synapse counts revised upward by over 25%" | | No such statement found in the paper | unverifiable |

## C. elegans male (Cook et al. 2019)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Neurons | 385 | 385 ("579 nodes (385 neurons, 155 muscles, and 39 non-muscle end organs)") | https://pmc.ncbi.nlm.nih.gov/articles/PMC6889226/ | correct |
| Male-specific neurons | 91 | "91 neurons and 39 sex muscles are specific to the male"; cell list: 56 sensory + 35 interneurons (computed) | same; SI 4 | correct |
| Muscles | 178 | 155 | same | wrong |
| Chemical edges | 5,142 | Paper: 5,315 whole graph. Computed: 5,306 nonzero whole-graph cells; 3,988 neuron-to-neuron directed edges (SI 5); 3,410 scored-only (SI 2) | paper; SI 5; SI 2 | wrong |
| Gap junctions | 1,524 | Paper: 1,755 whole graph. Computed neuron-to-neuron undirected pairs: 1,281 (corrected) / 1,282 (original) | same | wrong |
| Synapse list size | (not claimed) | SI 3 male sheet: 9,394 chemical + 5,457 electrical entries | SI 3 | for reference |
| License | CC-BY 4.0 | none stated (as hermaphrodite) | | wrong |
| Location / format | wormwiring.org (CSV, GraphML) | wormwiring.org, XLSX only (same SI workbooks as above) | | partly wrong (no CSV/GraphML) |
| Browser extract | herm vs male shared core 200x200, ~180 KB | design suggestion; feasible from SI 5 | | not an existing file |

## C. elegans developmental series (Witvliet et al. 2021)

Computed from the NemaNode JSON export (identical content to the WormWiring `witvliet_2020_N *.xlsx` files: pre, post, type, synapses). "Neurons" = connected nodes minus body-wall muscles and glia/other (NemaNode cell types).

| Dataset | Stage (hours after birth) | Neurons with connections | All connected nodes | Chemical edges | Chemical synapses | Electrical edges |
|---|---|---|---|---|---|---|
| 1 | L1, ~0 h | 161 | 187 | 775 | 1,296 | 83 |
| 2 | L1, ~5 h | 162 | 194 | 986 | 1,895 | 124 |
| 3 | L1, ~8 h | 162 | 198 | 1,012 | 2,128 | 94 |
| 4 | L1, ~16 h | 168 | 204 | 1,136 | 2,777 | 209 |
| 5 | L2, ~23 h | 174 | 211 | 1,515 | 4,116 | 292 |
| 6 | L3, ~27 h | 174 | 216 | 1,525 | 4,456 | 214 |
| 7 | adult, ~50 h | 180 | 222 | 2,202 | 7,467 | 291 |
| 8 | adult, ~50 h | 180 | 219 | 2,186 | 7,970 | 310 |

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | Witvliet et al. (2021) Nature | Witvliet D, Mulcahy B, Mitchell JK, et al., "Connectomes across development reveal principles of brain maturation", Nature 596:257-261 (2021), doi:10.1038/s41586-021-03778-8 (bioRxiv 2020.04.30.066209) | Crossref | correct |
| Individuals | 8 | 8 isogenic hermaphrodites, L1 to adult | paper | correct |
| Neurons per volume | 165 to 210 | 161 to 180 neurons with connections (computed); paper: "the brain's 204 cells" at birth, which includes muscles and glia | paper; NemaNode | wrong |
| L1 synapses | 1,328 | ~1,300 (paper); 1,296 chemical synapses in dataset 1 (computed) | https://pmc.ncbi.nlm.nih.gov/articles/PMC8756380/ | wrong precision (invented digits) |
| Adult synapses | 6,654 | ~8,000 (paper); 7,467 and 7,970 in datasets 7 and 8 (computed) | same | wrong |
| Fold change | 5.01-fold | paper: "increased 6-fold (~1300 at birth to ~8000 in adults)"; elsewhere "5-fold increase in synapse number"; computed 5.8x and 6.2x | same | wrong (invented precision) |
| License | CC-BY 4.0 | Not open access (Springer TDM in Crossref; PMC copy is author manuscript). NemaNode and github.com/dwitvliet/nature2021 state no license | Crossref; GitHub API | wrong |
| Location / format | bossdb.org / Nature Supplementary Data (XLSX, CSV) | bossdb.org/project/witvliet2020 is live (EM and volumes). Connectivity: Nature Supplementary Table (XLSX; mirrored in ConnectomeToolbox as `41586_2021_3284_MOESM5_ESM.xlsx`, 129,504 B, sheets `restricted_cells`, `M` (contact), `C` (chemical), `G` (gap) with per-dataset deltas); WormWiring XLSX per dataset; NemaNode JSON API (no CSV) | https://bossdb.org/project/witvliet2020 ; https://wormwiring.org/pages/witvliet.html | mostly correct (format detail off) |
| Paper's own variability figure (context for Section 7 Fact 2) | "over 40% of connections unique" | "About 43% of all cell-cell connections, accounting for 16% of all chemical synapses, are not conserved between isogenic animals" | PMC8756380 | close; say 43% of connections but only 16% of synapses |

## Larval Drosophila brain (Winding et al. 2023)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | Winding et al. (2023) Science | Winding M, Pedigo BD, Barnes CL, et al., "The connectome of an insect brain", Science 379:eadd9330 (2023), doi:10.1126/science.add9330 | Crossref | correct |
| Neurons | 3,016 | "3016 neurons" (480 input neurons + 2,536 brain neurons) | https://pmc.ncbi.nlm.nih.gov/articles/PMC7614541/ | correct |
| Synapses | 548,000 | "~548,000 synaptic sites"; 75% linked to a neuron | same | correct |
| Released matrix size | (implied 3,016 nodes) | Data S1 matrices are 2,952 x 2,952 (computed) | Data S1 | note |
| Directed edges (unthresholded) | 150,000 | 110,677 nonzero pairs in `all-all_connectivity_matrix.csv`, total weight 352,611 (computed). By compartment: a-d 63,545, a-a 40,636, d-d 9,019, d-a 3,722 | Data S1 | wrong |
| Reliable edges W>=2 | 44,124 | 58,631 at w>=2 in all-all (computed); 37,209 in a-d; 20,533 at w>=5 in all-all | Data S1 | wrong |
| 93 cell types | 93 | "identified 93 types" by hierarchical clustering on connectivity; cluster labels in Data S2 column `level_7_cluster` | paper; Data S2 | correct |
| License | CC-BY 4.0 | Europe PMC author manuscript (EMS175448) is CC BY; the Science version is under Science's own license | Europe PMC | correct via the author manuscript |
| Location / format | catmaid-server / "Cambridge University repository" / Science Data (CSV, GraphML) | Supplementary Data S1-S4 (CSV) on Science and on Europe PMC; CATMAID at https://catmaid.virtualflybrain.org/ (L1 larval CNS, live); code on Zenodo 7473710, 7473718, 7474133. No Cambridge repository and no GraphML in the release | PMC7614541 | partly wrong ("Cambridge repository" and GraphML invented) |
| Browser extract | 93-type matrix or MB circuit, ~650 KB | Feasible: 93-cluster aggregation of the a-d matrix is a few KB. Not an existing file | | design suggestion |

Real Winding supplementary files (from Europe PMC bundle `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7614541/supplementaryFiles`, 10.9 MB zip; the PMC direct links sit behind a captcha):

| File | Size (bytes) | Contents |
|---|---|---|
| `EMS175448-supplement-Supplementary_Data_S1.zip` | 1,054,841 | `all-all_connectivity_matrix.csv` (34.9 MB), `ad_...` (34.5 MB), `aa_...` (34.5 MB), `dd_...` (30.5 MB), `da_...` (28.7 MB): dense 2,952 x 2,952 synapse counts indexed by CATMAID skeleton id; `inputs.csv`, `outputs.csv` (55 KB each: per-neuron axon/dendrite input and output totals) |
| `EMS175448-supplement-Supplementary_Data_S2.csv` | 65,148 | left_id, right_id, celltype, additional_annotations, level_7_cluster (1,372 rows: homologous pairs and unpaired) |
| `EMS175448-supplement-Supplementary_Data_S3.csv` | 59,709 | skid, celltype, axonIO_ratio |
| `EMS175448-supplement-Supplementary_Data_S4.csv` | 34,029 | skid, celltype, dendritic output/input ratio |

Also: github.com/neurodata/bilateral-connectome `data/elife/G_edgelist.txt` (2.5 MB, 119,010 weighted edges over 3,554 skeletons, a later snapshot used by Pedigo et al. 2023 eLife) with `meta_data.csv` (2.8 MB).

## Macaque inter-areal matrix (Markov et al. 2014)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | Markov et al. (2014) Cerebral Cortex / CoCoMac | Markov NT, Ercsey-Ravasz MM, Ribeiro Gomes AR, et al., "A weighted and directed interareal connectivity matrix for macaque cerebral cortex", Cereb Cortex 24(1):17-36 (2014; epub 2012), doi:10.1093/cercor/bhs270. CoCoMac is an unrelated literature-collation database, not a source of this matrix | Crossref; Europe PMC | correct for Markov; "CoCoMac" wrong |
| Injected areas | 29 | 29 injected (target) areas, 39 injections ("cases") (computed from table) | abstract; Cercor table | correct |
| 91 areas | "91 target cortical areas" | 91 areas are the source areas where labeled cells are counted; in retrograde tracing the 29 injected areas are the targets. Terminology inverted | abstract | wrong wording |
| Matrix | 29 x 91 directed weighted | G29x91; 1,615 pathways (computed from table: 1,615 source-target pairs with FLNe > 0) | abstract; table | correct |
| FLNe range | "6 orders of magnitude" | "range 5 log units" (abstract); data span 2.6e-6 to 0.76, about 5.5 decades (computed) | abstract; table | wrong |
| 29x29 subgraph | edge-complete, with laminar SLN | G29x29 has 536 of 812 possible links, 66% density (computed; paper "two-thirds"). SLN is not part of this paper; SLN comes from Markov et al. 2014 J Comp Neurol 522:225-259 and covers only 11 visual targets (628 pathways) in the public table | abstracts; tables | partly wrong (SLN is a different paper and does not cover 29x29) |
| License | Academic Open Access | Cereb Cortex article is CC BY-NC (Europe PMC); JCN SLN article is CC BY. core-nets data has no stated license | Europe PMC | label invented; NC restriction matters |
| Location | core-nets.org (CSV, TXT) | core-nets.org is currently down (WordPress PHP parse error, HTTP 500, today). Archived files are XLS, not CSV/TXT: `Cercor_2012 Table.xls` (323,584 B; columns CASE, MONKEY, SOURCE, TARGET, FLNe, NEURONS, STATUS, BIBLIOGRAPHY; 1,989 rows) and `JCN_2013 Table.xls` (88,576 B; To, From, SLN(%), Dist(mm); 628 rows) | https://web.archive.org/web/20220428032305/http://core-nets.org/download/Cercor_2012%20Table.xls ; https://web.archive.org/web/20220428032250/http://core-nets.org/download/JCN_2013%20Table.xls | partly wrong (site down; XLS format) |
| Browser extract | 29x29 with SLN, ~45 KB | FLNe 29x29 is trivially small; SLN only exists for 11 targets in the public JCN table. BALSA "Monkey Interareal Measures" (Burt et al. 2018) ships FLN and SLN as CIFTI pconn (~0.5 MB each) | https://balsa.wustl.edu/Gkvq | partly feasible |


Checked 2026-09-30. Counts marked "computed" were computed here from the released flat files (downloaded and parsed with pyarrow / Python csv), not copied from a paper.

## Hemibrain v1.2.1 (Scheffer et al. 2020, eLife 9:e57443)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Version | v1.2.1 | neuPrint serves `hemibrain:v1.2.1` (last-mod 2020-12-05). The flat-file export is labelled v1.2 (Dec 2020); v1.2.1 is the neuPrint patch of the same release | https://neuprint.janelia.org/api/dbmeta/datasets ; https://www.janelia.org/project-team/flyem/hemibrain | correct |
| Citation | Scheffer et al. 2020 eLife | Scheffer LK et al. 2020, "A connectome and analysis of the adult Drosophila central brain", eLife 9:e57443, doi:10.7554/eLife.57443. Paper describes v1.0/v1.1 data, not v1.2.1 | https://doi.org/10.7554/eLife.57443 | correct (with version caveat) |
| Traced neurons | 21,740 traced/named | 21,739 non-cropped Traced neurons in `traced-neurons.csv` (21,740 lines incl. header) (computed). neuPrint blurb: "~22k fully reconstructed neurons and ~76k truncated neurons" | https://storage.googleapis.com/hemibrain/v1.2/exported-traced-adjacencies-v1.2.tar.gz | correct (off by one: the report counted the CSV header) |
| "out of ~26,000 bodies" | ~26,000 | Paper: "around 25,000 neurons"; neuPrint: ~22k complete + ~76k truncated | Scheffer 2020 text (PMC7546738); neuPrint metadata | wrong (conflates neuron estimate with body count) |
| Directed edges | 3,428,212 | 3,550,403 neuron-to-neuron pairs among the 21,739 traced neurons (computed; 1,764,123 at w>=2; 662,578 at w>=5; 305,058 at w>=10). Paper: "approximately 25,000 nodes and approximately 3 million edges" | same tarball; Scheffer 2020 | wrong (no release matches: v1.0 = 3,413,160, v1.1 = 3,521,163, v1.2 = 3,550,403) |
| Synapses | 20.4 million T-bars / PSDs | Paper: "about 20 million chemical synapses". Sum of weights among traced neurons at v1.2 = 14,329,229 (computed). "20.4 million" not found; T-bars and PSDs are different quantities and not 20.4 M each | Scheffer 2020 (PMC7546738); tarball | wrong/unverifiable (the ~20 M headline is right; the precise 20.4 M and the T-bar/PSD framing are not supported) |
| License | CC-BY 4.0 | "Hemibrain is licensed under CC-BY"; paper CC BY | https://www.janelia.org/project-team/flyem/hemibrain | correct |
| Download location | `gs://flyem-hemibrain/v1.2.1/` (CSV, Feather) | `gs://flyem-hemibrain` returns HTTP 403 / not a public bucket; no v1.2.1 prefix found anywhere. Real public buckets: `gs://hemibrain/v1.2/` and `gs://hemibrain-release/` | https://storage.googleapis.com/storage/v1/b/hemibrain/o?prefix=v1.2/ | wrong (invented path) |
| Format | CSV, Feather | Correct in spirit: CSV tarball plus Feather tables in `gs://hemibrain/v1.2/` | as above | correct |

Real files in `https://storage.googleapis.com/hemibrain/v1.2/` (sizes from the GCS JSON API):

| File | Size |
|---|---|
| exported-traced-adjacencies-v1.2.tar.gz (traced-neurons.csv 0.58 MB, traced-total-connections.csv 82 MB, traced-roi-connections.csv 126 MB, README) | 45.9 MB |
| hemibrain-v1.2-all-traced-adjacencies.tar.gz | 80.8 MB |
| hemibrain-v1.2-body-mean-neurotransmitters.feather | 45.6 MB |
| hemibrain-v1.2-synapse-partners.feather | 859 MB |
| hemibrain-v1.2-synapse-points-with-body-roi-type-status.feather | 1,838 MB |
| hemibrain-v1.2-tbar-neurotransmitters.feather.bz2 | 443 MB |
| hemibrain-v1.2-skeletons.tar.gz | 1,881 MB |
| roi-meshes.tar.gz | 193 MB |

Older: `gs://hemibrain/v1.1/exported-traced-adjacencies-v1.1.tar.gz` (45.5 MB), `gs://hemibrain/v1.0/conn_summary.tgz` (47.4 MB); neo4j dumps in `gs://hemibrain-release/neuprint/` (hemibrain_v1.0 4.08 GB, v1.0.1 4.08 GB, v1.1 4.50 GB, v1.2 6.18 GB; no v1.2.1 file).

Notes. The traced-neuron CSV is the natural browser source: 21,739 nodes with type/instance, and at w>=10 about 305k edges, which is still too big for a <5 MB page without further subsetting (type-to-type aggregation or a neuropil subset).

## Section 6.2 hemibrain claims

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| v1.0 traced neurons | 21,663 (Jan 2020) | 21,663 non-cropped traced neurons in v1.0 `conn_summary.tgz` (computed); v1.0 released 2020-01-22 | https://storage.googleapis.com/hemibrain/v1.0/conn_summary.tgz | correct |
| v1.0 synapses | "roughly 20 million" | paper: "about 20 million chemical synapses"; traced-to-traced sum at v1.0 = 13,603,750 (computed) | Scheffer 2020 | correct as the paper headline |
| Change v1.0 to v1.2.1 | "targeted proofreading added extensive olfactory PNs and CX arborizations" to reach 21,740 | Net change is +76 traced neurons (21,663 to 21,733 at v1.1 to 21,739 at v1.2); edges 3.41 M to 3.55 M. No evidence the change was driven by PN/CX work; the Janelia page lists v1.2 changes as neuPrint+ upgrade and mitochondria prediction | Janelia hemibrain page; computed | invented narrative |
| Total bodies | "exceed 100,000 bodies" | neuPrint: ~22k complete + ~76k truncated neurons (~98k Neuron bodies); raw segments number in the millions | neuPrint metadata | roughly right if "Neuron bodies" is meant; imprecise |
| Debris | "90% of which are anucleated axonal debris" | No source; ~76k are described as truncated neurons (cut by volume boundary), not debris | neuPrint metadata | invented |
| Filter | filter `status = "Traced"` | Correct practice; the flat exports already restrict to non-cropped Traced | README in tarball | correct |

## Fly male CNS v1.0

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | Takemura et al. 2023 bioRxiv 2023.06.05.543757 | That DOI is "A Connectome of the Male Drosophila Ventral Nerve Cord" (Takemura S-y et al., posted 2023-06-06), i.e. the MANC paper (VNC only, ~23k neurons; published eLife 2024). The male CNS paper is Berg S et al., "Sexual dimorphism in the complete connectome of the Drosophila male central nervous system", bioRxiv 2025.10.09.680999 (v2), published in Cell 2026-09-03 (https://www.cell.com/cell/fulltext/S0092-8674(26)00942-6, per male-cns.janelia.org) | https://api.crossref.org/works/10.1101/2023.06.05.543757 ; https://www.biorxiv.org/content/10.1101/2025.10.09.680999v2 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC12636603/ | wrong (wrong paper) |
| Neurons | 162,521 typed neurons | Paper: "166,691 neurons ... fully proofread and annotated". neuPrint: "167k neurons"; Codex MCNS v1.0: 166,700. In the v1.0 annotation file, neurons that are status Traced and have a type = exactly 162,521 (computed; 166,700 rows have a superclass; 164,506 are typed) | body-annotations-male-cns-v1.0-minconf-0.5.feather | correct as a derived count, but not the published headline (use 166,691) |
| Cell types | 11,751 | Paper: 11,691 types. v1.0 annotation file: 11,751 distinct `type` values (computed) | same | correct for the v1.0 file; paper says 11,691 |
| Synapses | "130+ million" | Paper: 46 M presynapses connected to 312 M PSDs; 25.6 M edges between 166,391 neurons. Press coverage: "125 million synaptic connections". v1.0 traced-only weights file: 25,563,197 edges, sum of weights 124,025,046 (computed) | PMC12636603; connectome-weights-...-traced-only.feather | wrong (no source gives 130+ M; 124 to 125 M is the neuron-to-neuron synapse count) |
| Edges (not claimed) | n/a | 25,563,197 traced-to-traced edges; 15,270,273 at w>=2; 6,235,682 at w>=5; 2,749,407 at w>=10 (computed). Codex lists 6,242,118 connections (its w>=5 convention) | computed; https://codex.flywire.ai | (for reference) |
| "input ~95% complete, output ~42% traced" | presented as a dataset property | From the user's unpublished notes. The paper does publish a close figure with the opposite labelling: "94% pre- and 42% postsynaptic completion rates in neuropils", i.e. 94% of presynaptic sites (neuron outputs) and 42% of PSDs (neuron inputs) lie on proofread neurons; 40.1% of connections have both sides proofread | PMC12636603 | wrong as worded (numbers near the published 94/42 but input/output inverted; must cite Berg et al. and say pre/post) |
| "dimorphic 13x" (user notes) | not in the table row but flagged by user | No 13x figure in the paper. Published dimorphism figures: 7,205 isomorphic, 114 dimorphic, 262 male-specific, 69 female-specific types; 6.3% of male vs 1.3% of female central-brain edges dimorphic (about 5x); dimorphic/sex-specific types = 4.8% of central brain | PMC12636603 | unverifiable/unpublished; do not present as published |
| License | CC-BY 4.0 | "The Male CNS dataset is licensed under CC-BY"; preprint CC BY 4.0 | https://male-cns.janelia.org/ | correct |
| Download location | `gs://flyem-male-cns/v1.0/` (Arrow/Feather flat files) | Exists and is publicly listable | https://storage.googleapis.com/storage/v1/b/flyem-male-cns/o?prefix=v1.0/connectome-data/ | correct |
| "103-neuropil regional matrix" | 103 neuropils | neuPrint v1.0 lists 144 super-level ROIs; brain ROI volume has max label 96 and VNC ROI volume 27. 103 not found | neuPrint metadata; bucket README | unverifiable |

Real files in `https://storage.googleapis.com/flyem-male-cns/v1.0/connectome-data/flat-connectome/` (sizes from GCS API):

| File | Size |
|---|---|
| body-annotations-male-cns-v1.0-minconf-0.5.feather (211,577 rows, 36 cols incl. type, superclass, class, flywireType, hemibrainType, mancType, dimorphism, fruDsx, somaLocation, status) | 14.5 MB |
| body-neurotransmitters-male-cns-v1.0.feather | 43.3 MB |
| body-stats-male-cns-v1.0-minconf-0.5.feather | 778 MB |
| connectome-weights-male-cns-v1.0-minconf-0.5.feather | 1,051 MB |
| connectome-weights-male-cns-v1.0-minconf-0.5-traced-only.feather (cols body_pre, body_post, weight, type_pre, type_post) | 508 MB |
| connectome-weights-male-cns-v1.0-minconf-0.5-significant-only.feather | 502 MB |
| syn-partners-male-cns-v1.0-minconf-0.5.feather (+ traced-only, significant-only at ~2.97 GB each) | 6,777 MB |
| syn-points-male-cns-v1.0-minconf-0.5.feather | 13,061 MB |
| tbar-neurotransmitters-male-cns-v1.0.feather | 2,652 MB |

Also in the bucket: v0.9 release (same file set), neuroglancer JSON (`v1.0/male-cns-v1.0.json`), skeletons, meshes, `README_RELEASE_BUCKET.md` (still written for v0.9). The paper's type-to-type cross-matched edges with dimorphism labels are in github.com/flyconnectome/2025malecns. Also served through neuPrint (`male-cns:v1.0`) and Codex (MCNS v1.0).

Notes. Every number in this row except the bucket path and license needs replacing. The 162,521 / 11,751 figures reproduce exactly from the v1.0 annotation file, so they were computed from real data (likely the user's notes), but the essay should cite the paper's 166,691 neurons / 11,691 types, or state the filter used. The traced-only weights file with type_pre/type_post columns is the best starting point for a type-to-type browser extract.

## FlyWire v783 (Dorkenwald et al. 2024; Schlegel et al. 2024, Nature 634)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | Dorkenwald et al. 2024; Schlegel et al. 2024 Nature | Dorkenwald S et al., "Neuronal wiring diagram of an adult brain", Nature 634:124-138 (2024), doi:10.1038/s41586-024-07558-y; Schlegel P et al., "Whole-brain annotation and multi-connectome cell typing of Drosophila", Nature 634:139-152 (2024), doi:10.1038/s41586-024-07686-5. Published 2 Oct 2024 | Europe PMC PMC11446842 | correct |
| Neurons | 139,255 proofread | "139,255 neurons"; Codex FAFB v783: 139,255 | PMC11446842; codex.flywire.ai | correct |
| Synapses | 54.5 million | "54.5 million synapses between these neurons" (abstract rounds to 5 x 10^7); whole brain ~130 M detected synapses | PMC11446842 | correct |
| Directed edges, unthresholded | 15.1 million | 15,091,983 neuron pairs in proofread_connections_783.feather after summing its 16,847,997 per-neuropil rows; total synapses 54,492,922 (computed) | proofread_connections_783.feather (Zenodo 10676866) | correct |
| Edges at W>=5 | 5.34 million (64.6% drop) | Paper: "We observed 2,700,513 such connections [>=5 synapses] between 134,181 identified neurons". Computed from Zenodo file: 2,700,513 pairs at w>=5 among 134,181 neurons (exact match); 7,595,967 at w>=2; 4,916,231 at w>=3; 1,066,822 at w>=10. The drop from 15.1 M to 2.7 M is 82.1%, not 64.6%. 5.34 M matches no threshold | PMC11446842 | wrong |
| License | CC-BY 4.0 | Zenodo 10676866 and 10877326: cc-by-4.0; papers CC BY. Codex browsing and its Download app require Google sign-in and acceptance of the FlyWire Terms of Service | https://zenodo.org/records/10676866 | correct for Zenodo data |
| Download location | codex.flywire.ai / CAVEclient / flat TSV tables (TSV, Feather) | Codex download requires sign-in (not scriptable anonymously). Open anonymous flat files: Zenodo 10676866 (Feather/NPY) and GitHub flyconnectome/flywire_annotations (TSV/CSV) | see below | partly correct (Codex gated; Zenodo is the real open source) |

Zenodo 10676866, "FlyWire Whole-brain Connectome Connectivity Data", version 783, 2024-06-02, CC-BY-4.0:

| File | Size |
|---|---|
| proofread_connections_783.feather | 852 MB |
| proofread_root_ids_783.npy | 1.1 MB |
| per_neuron_neuropil_count_pre_783.feather | 16.9 MB |
| per_neuron_neuropil_count_post_783.feather | 234 MB |
| flywire_synapses_783.feather | 9,493 MB |

Zenodo 10877326, "Supplemental Files for Schlegel et al., Nature (2024)", CC-BY-4.0: nblast_flywire_all_right_aba_comp.feather (809 MB), sk_lod1_783_healed_ds2.parquet (5,356 MB), nblast_flywire_hemibrain_min_comp.feather (212 MB), nblast_flywire_mirrored_hemibrain_min_comp.feather (223 MB).

GitHub flyconnectome/flywire_annotations `supplemental_files/`: Supplemental_file1_neuron_annotations.tsv (31.7 MB; per-neuron super_class, cell_class, cell_type, hemibrain_type, side, nerve, NT, soma position), Supplemental_file2_non_neuron_annotations.tsv (0.13 MB), Supplemental_file3_summary_with_ngl_links.csv (0.76 MB), Supplemental_file4_hemilineages_clustering.csv (2.3 MB), Supplemental_file5_hemibrain_meta.csv (2.6 MB). No license field set on the repo.

## Section 6.2 FlyWire claims

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Early preprints | "roughly 120,000 neurons and 40 million synapses" | bioRxiv 2023.06.27.546656 v1 (2023-06-30) and v2 (2023-07-11) abstract: "5x10^7 chemical synapses between ~130,000 neurons" | https://api.biorxiv.org/details/biorxiv/10.1101/2023.06.27.546656 | wrong |
| Final release | Oct 2024 Nature, v783, 139,255 neurons, 54.5 M synapses | as above | PMC11446842 | correct |
| Unthresholded edges | 15.1 million | 15,091,983 neuron pairs in proofread_connections_783.feather after summing its 16,847,997 per-neuropil rows; total synapses 54,492,922 (computed) | Zenodo file | correct |
| W>=5 edges | 5.34 M, a 64.6% drop | 2,700,513 (paper) Computed from Zenodo file: 2,700,513 pairs at w>=5 among 134,181 neurons (exact match); 7,595,967 at w>=2; 4,916,231 at w>=3; 1,066,822 at w>=10. The drop from 15.1 M to 2.7 M is 82.1%, not 64.6%. 5.34 M matches no threshold | PMC11446842 | wrong |

Notes. The published FlyWire default threshold is >=5 synapses (Codex uses it). Codex's headline "3,732,460 connections" for FAFB v783 does not match the Zenodo file at any simple threshold (per-neuropil rows at w>=5 = 2,710,038), probably because Codex now uses the newer synapse predictions; cite the paper's 2,700,513 with the threshold stated. Browser note: proofread_connections_783.feather carries per-edge mean neurotransmitter probabilities (gaba/ach/glut/oct/ser/da_avg) and a neuropil column, so a neuropil-by-neuropil or type-by-type matrix split by transmitter is a small aggregation away. Also worth knowing for the male CNS row: FlyWire reports the same asymmetric completeness pattern (93.7% of presynapses and 44.7% of postsynapses attached to proofread neurons), which is the published analogue of the "95/42" note.

Checked 2026-09-30 against primary sources (Crossref metadata, paper full text where reachable, live bucket listings via the S3 and GCS JSON APIs, Allen download server, Nature supplementary page). File sizes are Content-Length / object size in bytes as listed today.

## MICrONS minnie65 (mouse visual cortex)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | "minnie65 (v661 / Turner 2020; MICrONS 2021)" | MICrONS Consortium, "Functional connectomics spanning multiple areas of mouse visual cortex", Nature 640(8058):435-447, 9 Apr 2025, doi:10.1038/s41586-025-08790-w (preprint bioRxiv 10.1101/2021.07.28.454025, 2021). Turner et al. is Cell 185:1082 (2022) and describes the earlier pinky100 L2/3 volume, not minnie65. v661 is a real static materialization (skeletons and a CAVE export exist at v661), but the public static versions run 117, 343, 661, 785, 943, 1078, 1181, 1300 (tutorial now at 1718) | https://api.crossref.org/works/10.1038/s41586-025-08790-w ; https://www.microns-explorer.org/data | wrong (Turner 2020 does not exist as the minnie65 citation; primary citation should be MICrONS Consortium 2025 Nature) |
| Neurons | "120,000 neurons in 1 mm3" | microns-explorer.org cortical-mm3 page states ~200,000 cells and 120,000 neurons (both subvolumes). The v117 manifest counts 82,247 neurons in the minnie65 segmented volume; press coverage of the Nature package says ~84,000 neurons | https://www.microns-explorer.org/cortical-mm3 ; https://www.microns-explorer.org/manifests/mm3-v117 | correct as the site's headline figure; note minnie65 alone has ~82-84K |
| Proofread neurons | "1,183 fully proofread" | No source gives 1,183. Proofreading table `proofreading_status_and_strategy` at v1718 lists axon strategies: partially extended 1,608, fully extended 547, interareal 120, none 41 (~2,300 cells); tutorial says ~1,800 cells have axons usable for output analysis (~1,700 "fully proofread" at v1300) | https://tutorial.microns-explorer.org/quickstart_notebooks/03-cave-query-proofread-cells.html ; https://tutorial.microns-explorer.org/proofreading.html | invented (number not found anywhere; real figure is version-dependent, ~1,700-2,300) |
| Synapses | "523 million automatic synapses" | 523 million detected, but that is minnie65 (337,312,429) plus minnie35 (186,268,895) | https://www.microns-explorer.org/manifests/mm3-v117 | correct (total for both subvolumes, not minnie65 alone) |
| Proofread edges | "proofread core: 1,183 neurons, 48,212 verified edges" | No such figure in any release doc or paper abstract found | n/a | invented |
| License | CC-BY 4.0 | CC BY 4.0 (site terms); Nature paper also CC BY 4.0 | https://www.microns-explorer.org/terms-and-conditions | correct |
| Location / format | "microns-explorer.org / BossDB / CAVE (Parquet, CSV)" | Location correct. Flat files are CSV / CSV.gz and pandas pickle, not Parquet. See file list below | https://bossdb-open-data.s3.amazonaws.com/?list-type=2&prefix=iarpa_microns/minnie/minnie65/ | partly wrong (no Parquet) |
| Browser extract | "L2/3 columnar network: 540 neurons, 8,200 edges + orientation tuning (~850 KB)" | No such packaged extract exists. Closest real small product: the "Minnie Column" (>1,300 neurons in a 100x100 um column) with coarse types in `allen_visp_column_soma_coarse_types_v1.csv` (129,868 B, 2,204 rows incl. non-neuronal). Orientation tuning per neuron is in the Ding et al. 2025 node/edge pickles (large) | https://tutorial.microns-explorer.org/proofreading.html | invented (the specific 540/8,200 extract); would need to be built |

Real files (s3://bossdb-open-data/iarpa_microns/..., also served at https://bossdb-open-data.s3.amazonaws.com/iarpa_microns/...):

| Path | Size (bytes) | Content |
|---|---|---|
| minnie/minnie65/synapse_graph/cave_exports/v1300/connections_with_nuclei.csv.gz | 2,996,965,416 | neuron-to-neuron edge list: pre_pt_root_id, post_pt_root_id, n_syn, sum_size, pre_nuc_id, post_nuc_id |
| minnie/minnie65/synapse_graph/cave_exports/v1300/synapses_pni_2_v1_filtered_view.csv.gz | 20,045,982,920 | every synapse with pre/ctr/post positions, size, root ids (also v1078, v1181) |
| minnie/minnie65/synapse_graph/cave_exports/v661/mat661_soma_soma_connections.csv | 560,565,873 | soma-to-soma connections at v661 |
| minnie/minnie65/synapse_graph/cave_exports/v661/mat661_synapses.csv | 24,535,174,251 | synapses at v661 |
| minnie/minnie65/synapse_graph/synapses_pni_2.csv | 51,020,159,848 | raw synapse table |
| minnie/minnie65/cell_types/allen_visp_column_soma_coarse_types_v1.csv | 129,868 | column cells, coarse type, xyz |
| minnie/minnie65/cell_types/allen_soma_ei_class_model_v1.csv | 4,400,727 | E/I class for all somas |
| minnie/minnie65/nucleus_detection/nucleus_detection_v0.csv | 10,988,660 | nucleus table |
| minnie/minnie65/cell_types/nucleus_neuron_svm.csv | 13,439,975 | neuron vs glia classifier |
| minnie/functional_data/functional_connectomics/node_and_edge_properties/v1/node_data_v1.pkl | 294,635,032 | Ding et al. 2025 nodes (layer, area, OSI, preferred orientation) |
| minnie/functional_data/functional_connectomics/node_and_edge_properties/v1/edge_data_v1.pkl | 201,511,086 | Ding et al. 2025 edges (n_synapses, signal correlation, delta orientation) |
| minnie/minnie65/skeletons/v661/ (skeletons SWC, meshworks H5, metadata JSON) | many files | per-neuron skeletons |

Notes. The dataset itself is solid and openly licensed, but the report's specific "1,183 / 48,212 / 540 / 8,200" figures have no source. For a browser figure, a real route is: take the column cell-type CSV (130 KB) and filter `connections_with_nuclei.csv.gz` (3 GB, needs offline processing) to those nucleus ids; or take the Ding et al. edge pickle filtered to `population == "Connected"` for a like-to-like orientation figure. Both require an offline build script; nothing under 5 MB ships ready-made.

## Allen mouse mesoscale connectivity (Oh 2014 / Knox 2019)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Oh 2014 citation | Oh et al. 2014 | Oh et al., "A mesoscale connectome of the mouse brain", Nature 508:207-214 (2014), doi:10.1038/nature13186 | https://api.crossref.org/works/10.1038/nature13186 | correct |
| Knox citation | "Knox et al. (2019)" | Knox et al., "High-resolution data-driven model of the mouse connectome", Network Neuroscience 3(1):217-236 (2019), doi:10.1162/netn_a_00066 | https://api.crossref.org/works/10.1162/netn_a_00066 | correct |
| Oh 2014 regions (6.2) | "112-structure matrix" | 213 regions: Supp. Table 3 is the linear-model matrix with 213 sources (rows) x 213 ipsilateral + 213 contralateral targets (columns); 295 non-overlapping regions used for the injection-level data (Supp. Table 2) | https://www.nature.com/articles/nature13186 (Supplementary Information section) | wrong |
| Oh 2014 experiments | "469 AAV tracer experiments" | 469 injections (Supp. Table 2) | same | correct |
| Knox regions | "213 ipsilateral / 213 contralateral (426 total)", "426 x 426 dense matrix" | 213/426 is the Oh 2014 layout, and even there the matrix is 213 x 426, not 426 x 426. Knox regionalizes to 291 gray-matter summary structures; the released CSVs are 461 source rows x 916 target columns (461 ipsi + 455 contra, including parent structures of the ontology) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6372022/ ; normalized_connection_strength.csv (inspected) | wrong (numbers belong to Oh 2014, misattributed to Knox) |
| Edge count | "1.8 x 10^5 directed projections" | Appears to be 426^2 = 181,476, derived from the wrong shape. Oh 2014 matrix has 213 x 426 = 90,738 cells; Knox CSV has 461 x 916 = 422,276 cells (420,543 nonzero) | computed from downloaded file | wrong |
| Knox experiments (6.2) | "over 1,000 injection experiments" | 428 anterograde tracing experiments in wild-type C57BL/6J | https://pmc.ncbi.nlm.nih.gov/articles/PMC6372022/ | wrong |
| Knox voxels (6.2) | "100 um voxels" | 100 um voxels (~2 x 10^5 source voxels, ~5 x 10^5 targets) | same | correct |
| Knox improvement (6.2) | "elimination of false-positive tracer spillover in the Knox voxel inversion" | Knox's stated advance is dropping the within-region homogeneity assumption via kernel regression over injection centroids; the paper does not frame it as removing spillover false positives | same | unverifiable / mischaracterized |
| License | "Allen Institute Terms of Use (Open Academic Non-Commercial)" | Custom Allen Institute Terms of Use: use, copy, distribute and derive for research or other noncommercial purposes with attribution; commercial redistribution needs written permission; limited sets may be published with citation. "Open Academic Non-Commercial" is not the name of any license. Code repo is BSD-2 plus a non-commercial clause | https://alleninstitute.org/terms-of-use/ ; https://github.com/AllenInstitute/mouse_connectivity_models/blob/master/LICENSE | correct in substance, label invented |
| Location / format | "download.alleninstitute.org / Allen SDK (JSON, CSV)" | Exists: http://download.alleninstitute.org/publications/A_high_resolution_data-driven_model_of_the_mouse_connectome/ (CSV and CSV.gz; JSON only for 2 tiny mask files). Oh 2014 matrices are XLSX on Nature | listing fetched | correct |
| Browser extract | "43-cortical-area subnetwork matrix (strength, density, centroid distances), ~110 KB" | A real 43 x 43 ipsilateral cortical normalized-density matrix exists: normalized_connection_density_ipsi_ctx.csv, 19,649 B. Centroid distances are not in the Knox release; they are in Oh 2014 Supp. Table 4 (213 regions) | listing fetched | mostly correct (file real; distances must come from Oh or be computed) |

Real files at http://download.alleninstitute.org/publications/A_high_resolution_data-driven_model_of_the_mouse_connectome/ :

| File | Size (bytes) |
|---|---|
| normalized_connection_density_ipsi_ctx.csv | 19,649 (43 x 43 cortex, ipsi) |
| normalized_connection_strength.csv | 4,712,738 (461 x 916) |
| normalized_connection_strength.csv.gz | 1,595,759 |
| normalized_connection_density.csv | 3,947,812 |
| normalized_connection_density.csv.gz | 1,622,011 |
| connection_strength.csv | 4,970,886 |
| connection_strength.csv.gz | 1,552,201 |
| connection_density.csv | 4,730,866 |
| connection_density.csv.gz | 1,593,081 |
| source_mask_params.json, target_mask_params.json | 159 each (12 major-division structure ids) |
| weights.csv.gz | 145,052,675 (voxel model factor) |
| nodes.csv.gz | 490,386,367 (voxel model factor) |

Oh 2014 supplementary (https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fnature13186/MediaObjects/41586_2014_BFnature13186_MOESM{NN}_ESM.xlsx):

| MOESM | Content | Size (bytes) |
|---|---|---|
| 69 | Supp. Table 1: 295 regions, which 213 enter the linear model | 89,984 |
| 70 | Supp. Table 2: 469 injections x 295 targets (ipsi + contra), normalized projection volume | 3,006,078 |
| 71 | Supp. Table 3: linear-model matrix, 213 sources x (213 ipsi + 213 contra) | 1,570,515 |
| 72 | Supp. Table 4: centroid distances for the 213-region pairs | 4,500,921 |

Notes. Section 6.2 item 4 has the two releases backwards: 213 regions and the ipsi/contra split are Oh 2014; Knox used 428 experiments (fewer, not more than 1,000) and its released regional matrix is 461 x 916 including hierarchy. For a browser figure, the 43 x 43 cortical CSV (20 KB) ships as is; the Oh 2014 Supp. Table 3 (1.5 MB XLSX) converted to JSON gives the classic 213-region matrix with its distance companion. Note the non-commercial terms if the site is ever monetized.

## H01 (human temporal cortex)

| Item | Report claim | Verified value | Source URL | Verdict |
|---|---|---|---|---|
| Citation | Shapson-Coe et al. 2024 Science | Shapson-Coe et al., "A petavoxel fragment of human cerebral cortex reconstructed at nanoscale resolution", Science 384(6696):eadk4858, 10 May 2024, doi:10.1126/science.adk4858 | https://api.crossref.org/works/10.1126/science.adk4858 | correct |
| Cells | "57,000 cells in 1 mm3" | 57,180 cells: 49,080 neurons and glia plus 8,100 blood-vessel-related cells | paper full text (par.nsf.gov/servlets/purl/10548801) | correct |
| Neurons | "~16,000 neurons" | 16,087 | same | correct |
| Glia | "41,000 glia" | 32,315 (glia outnumber neurons 2:1; oligodendrocytes 20,139). 41,000 is roughly glia plus vascular cells, not glia | same | wrong |
| Synapses | "150 million automatic synapses" | 149,871,669 detected (111,272,315 excitatory, 38,599,354 inhibitory); release landing page says 183 million annotated (later count) | same ; https://h01-release.storage.googleapis.com/landing.html | correct |
| Proofread neurons | "1,200 proofread neurons" | The paper release has 104 proofread neurons (gs://h01-release/data/20210601/proofread_104); landing page says "100 proofread cells"; community CAVE proofreading continues but no 1,200 figure found | https://h01-release.storage.googleapis.com/data.html | invented |
| License | CC-BY 4.0 | "All released datasets are licensed under a Creative Commons Attribution 4.0 License" (the Science article itself is not CC-BY) | https://h01-release.storage.googleapis.com/data.html | correct |
| Location / format | "h01-release.storage.googleapis.com / Neuroglancer (Parquet, CSV)" | Location correct (web face of gs://h01-release). Synapse export is newline-delimited JSON plus Apache Avro, 166 shards each: 126.1 GB JSON, 32.9 GB Avro, at data/20210729/c3/synapses/exported/. Volumes/meshes/skeletons are Neuroglancer precomputed. The only CSV is proofread_104/synapse_locations.csv. No Parquet | GCS JSON API listing | partly wrong (no Parquet) |
| Browser extract | "multi-synaptic axon subgraphs (>=10 synapses per dendrite, 180 neurons) ~320 KB" | No such packaged extract. The paper reports rare axonal inputs of up to 50 synapses (53 in Fig. 7E) | paper | invented (extract would need to be built) |

Real files (https://storage.googleapis.com/h01-release/...):

| Path | Size (bytes) |
|---|---|
| data/20210601/proofread_104/synapse_locations.csv (columns: segment id, pre/post, x,y,z, pre xyz, post xyz) | 18,917,333 |
| data/20210601/proofread_104/skeletons/104_proofread_neurons_swc.zip | 59,832,937 |
| data/20210601/proofread_104/segment_properties/info (JSON, per-neuron labels) | 5,198 |
| data/20210729/c3/synapses/exported/export0000000000NN.json (x166, ~758 MB each) | 126,066,253,429 total |
| data/20210729/c3/synapses/exported/export0000000000NN (Avro, x166, ~197 MB each) | 32,859,876,087 total |
| data/20210601/cell_bodies/ (precomputed segmentation, ~50,000 somas) | multiscale |

Notes. Headline counts (57K cells, 16K neurons, 150M synapses) are right; the glia count and the proofread count are wrong. For a browser figure the 104-neuron synapse_locations.csv (19 MB) can be reduced to a per-pair count table well under 1 MB offline; the whole-volume synapse table is ~160 GB and is not practical to process casually.

---

# Recommended small, browser-shippable sources

## C. elegans hermaphrodite and male, full connectome

1. Connectivity, both sexes, authoritative: WormWiring SI 5 (corrected July 2020).
   - URL: `https://wormwiring.org/si/SI%205%20Connectome%20adjacency%20matrices,%20corrected%20July%202020.xlsx` (XLSX, 4.2 MB, six sheets: herm/male x chemical/gap symmetric/gap asymmetric). Weights are size-weighted EM section counts.
   - For synapse counts instead of section weights: `https://wormwiring.org/si/SI%202%20Synapse%20adjacency%20matrices.xlsx` (XLSX, 1.3 MB).
   - Cell categories: `https://wormwiring.org/si/SI%204%20Cell%20lists.xlsx` (27 KB) and `SI 6 Cell class lists.xlsx` (11 KB).
   - Neuron-only herm graph from this is 302 nodes, 3,671 chemical edges, 1,091 gap pairs; male 385 nodes, 3,988 chemical, 1,281 gap pairs. Converted to a sparse JSON edge list this is roughly 100 to 150 KB per sex before gzip.
2. Same data already as JSON: OpenWorm ConnectomeToolbox (MIT, actively maintained).
   - `https://raw.githubusercontent.com/openworm/ConnectomeToolbox/main/cect/cache/Cook2019HermReader.json` (5.8 MB) and `.../Cook2019MaleReader.json` (8.9 MB): keys `nodes`, `connections.{Generic_CS, Generic_GJ}` as dense matrices (473 x 473 herm incl. muscles/end organs). Also `WitvlietDataReader1..8.json`, `Wang2024HermReader.json` / `Wang2024MaleReader.json` (20.8 / 32.7 MB, Wang et al. 2024 update), `White_whole.json`, `VarshneyDataReader.json`. Too big to ship raw; one Python/Node pass cuts them to a sparse list.
3. 3D neuron positions (hermaphrodite) plus transmitter tags: OpenWorm c302 full network NeuroML.
   - `https://raw.githubusercontent.com/openworm/c302/master/examples/c302_A_Full.net.nml` (XML, 1.4 MB, MIT). 397 populations (302 neurons + 95 body-wall muscles), each with `<location x y z>` in microns (Virtual Worm body coordinates, AP along y) and a `neurotransmitter` property (older Loer/Pereira-era calls: ACh 125, Glu 64, GABA 26, DA 8, 5-HT 7, ...). Extract name, xyz, NT to ~20 KB JSON. Ignore its connectivity (older Varshney data).
   - Per-cell morphology with soma coordinates: `https://github.com/openworm/CElegansNeuroML/tree/master/CElegans/generatedNeuroML2` (302 `*.cell.nml`, 5.3 MB total).
4. Neurotransmitter identity, both sexes, current: Wang et al. 2024 eLife "A neurotransmitter atlas of C. elegans males and hermaphrodites" (eLife 95402, CC BY).
   - Mirrored at `https://raw.githubusercontent.com/openworm/ConnectomeToolbox/main/cect/data/elife-95402-supp2-v1.xlsx` (73 KB, hermaphrodite, 325 rows) and `.../elife-95402-supp3-v1.xlsx` (101 KB, male-specific neurons). Wide layout of reporter expression per gene; needs a hand-curated reduction to one NT label per neuron.
5. Cell metadata with class, type and a compact NT code for all cells: NemaNode API.
   - `https://nemanode.org/api/cells` (JSON, 50 KB): name, class, type code (s/i/m/...), neurotransmitter code (a = ACh, l = Glu, g = GABA, d = DA, s = 5-HT, o = octopamine, t = tyramine, n = none/unknown), embryonic, inhead, intail. No license stated.
6. Male neuron positions: no flat table found. WormWiring shows per-neuron skeleton maps interactively only. Practical route: reuse c302 positions for the 294 shared neurons and place the 91 male-specific (mostly tail ray and preanal ganglion) neurons by hand from WormAtlas male diagrams; label as schematic.

Best single pick for a first C. elegans figure: WormWiring SI 5 corrected (connectivity, both sexes) plus c302_A_Full.net.nml (positions) plus NemaNode /api/cells (types and NT), converted offline to one JSON under 300 KB.

## The 8 Witvliet developmental datasets

- NemaNode JSON edge lists (no auth, CORS not checked): `https://nemanode.org/api/download-connectivity?datasetId=witvliet_2020_1` through `witvliet_2020_8` (JSON array of {pre, post, type: chemical|electrical, synapses}); sizes 52,306 / 67,673 / 67,377 / 82,046 / 110,332 / 106,136 / 152,141 / 152,297 bytes. Stage metadata at `https://nemanode.org/api/datasets` (hours after birth per dataset). Also `white_1986_jsh`, `white_1986_n2u`, `white_1986_jse`, `white_1986_whole`.
- Same content as XLSX: `https://wormwiring.org/witvliet/witvliet_2020_1%20L1.xlsx` ... `witvliet_2020_8%20adult.xlsx` (21.8 to 53.2 KB each).
- Paper's classification of every connection as stable / variable / developmentally dynamic, and contact matrix: Nature Supplementary Table, mirrored at `https://raw.githubusercontent.com/openworm/ConnectomeToolbox/main/cect/data/41586_2021_3284_MOESM5_ESM.xlsx` (129,504 B).
- Richer per-synapse and geometry data: `https://github.com/dwitvliet/nature2021/tree/master/data`: `nemanode/witvliet_2020_N.json` (219 KB to 888 KB, per-connection synapse ids), `synapses/DatasetN_synapses.json` (341 KB+, per-synapse size and partner weights), `physical_contact/DatasetN_adjacency.csv` (124 to 157 KB, contact areas; dataset 7 missing), `skeletons/DatasetN_skeletons.json` (7 to 27 MB, CATMAID arbors, the only source of 3D positions for this series; reduce offline to one centroid per neuron). No license stated.

## Larval Drosophila (Winding 2023)

- Science Data S1 via Europe PMC: `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7614541/supplementaryFiles` (zip, 10.9 MB, slow server) containing `EMS175448-supplement-Supplementary_Data_S1.zip` (1.05 MB zipped; five dense 2,952 x 2,952 CSVs: all-all, ad, aa, dd, da; plus inputs.csv/outputs.csv). As a sparse all-all edge list: 110,677 edges (about 1.5 MB JSON raw, a few hundred KB gzipped); at w>=5, 20,533 edges.
- Cell types and 93 clusters: `EMS175448-supplement-Supplementary_Data_S2.csv` (65 KB).
- Alternative ready edge list: `https://raw.githubusercontent.com/neurodata/bilateral-connectome/main/data/elife/G_edgelist.txt` (2.5 MB) with `meta_data.csv` (2.8 MB, includes left/right, class, hemilineage, color), license field unset.
- Neuron positions: not in the supplement; would need CATMAID (catmaid.virtualflybrain.org, L1 larval CNS project) skeleton roots via its public API.

## Macaque Markov 2014 FLNe / SLN / distances

- FLNe (29 x 91, per-injection rows): `https://raw.githubusercontent.com/INM-6/multi-area-model/master/multiarea_model/data_multiarea/raw_data/Markov2014_FLN_rawdata.csv` (224 KB, tab-separated, same rows as the core-nets Cercor table: case, monkey, source, target, FLNe, neurons, Known/NFP). Repo license CC BY-NC-SA 4.0.
- SLN plus distance per pathway (11 visual targets x 91 sources): `.../raw_data/SLN_Data.csv` (17 KB; columns INDEX, TO, FROM, S, I, TOT, DIST, DENS, Monkey, lFLN, SLN, INJ, FLN, cSLN), from Markov et al. 2014 J Comp Neurol (CC BY).
- Inter-areal distances in the Markov 91-area parcellation: `.../raw_data/Thom_Distances_MERetal12.csv` (117 KB, 91 x 91, header note "Distances provided by Rembrandt"; provenance to confirm against Ercsey-Ravasz et al. 2013 Neuron before citing).
- Originals, archived (core-nets.org itself is down today): `https://web.archive.org/web/20220428032305id_/http://core-nets.org/download/Cercor_2012%20Table.xls` (XLS, 323,584 B) and `https://web.archive.org/web/20220428032250id_/http://core-nets.org/download/JCN_2013%20Table.xls` (XLS, 88,576 B; SLN and distance).
- Atlas geometry for drawing the 91 areas: Scalable Brain Atlas MERetal14 (`https://scalablebrainatlas.incf.org/macaque/MERetal14`).
- Cite the paper's license (CC BY-NC) and note non-commercial use.
