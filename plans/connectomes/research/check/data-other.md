# Data check: H01, larva, worm extras, macaque, Witvliet

Checked 2026-10-01 by fetching each source (curl, GitHub raw, Europe PMC, Wayback CDX).
Local copies are under `scripts/connectomes/.cache/<topic>/` (gitignored scratch, not
published). Sources already confirmed in `datasets.md` ("Recommended small,
browser-shippable sources") are not repeated except where this check corrects them.

Corrections to `datasets.md`:

- The "Witvliet classification" file named there,
  `ConnectomeToolbox/cect/data/41586_2021_3284_MOESM5_ESM.xlsx`, is **Brittin et al. 2021**
  (Nature article 41586_2021_3284), not Witvliet. Its sheets are `restricted_cells`, `M`
  (membrane contact), `C` (chemical), `G` (gap), each `cell_1, cell_2, weight, delta`. The
  Witvliet table is `41586_2021_3778_MOESM8_ESM.csv` (question 6 below).
- `SLN_Data.csv` (INM-6) has 188 rows for 6 targets (MT, TEO, V1, V2, V4, DP), not 11. The
  11-target table is the JCN 2013 Table 2 (`JCN_2013_Table.xls`, 628 pairs).

---

## 1. H01 synapses per axon-to-target connection

**Verdict: obtainable.** The histogram itself is published as two small JSON files.

- Bucket (public, no auth): `gs://h01_paper_public_files/csa_10000e_or_i_axons_from_each_gp_strength_agg20200916c3_eirepredict_0ax_15um_displacement_xy_rp_not_added_20um_soma_exc/`
  - HTTP: `https://storage.googleapis.com/h01_paper_public_files/csa_10000e_or_i_axons_from_each_gp_strength_agg20200916c3_eirepredict_0ax_15um_displacement_xy_rp_not_added_20um_soma_exc/all_counts_total_goog14r0s5c3.synapse_c3_eirepredict_clean_dedup.json` (139,018 B)
  - same folder, `all_counts_gp_goog14r0s5c3.synapse_c3_eirepredict_clean_dedup.json` (139,014 B)
  - same folder, `all_edges.csv` (3,953,150,171 B; not downloaded). Columns
    `,pair_count,pre_seg_id,i_count,e_count,region`, one row per axon-to-target pair.
- Generating code: `https://raw.githubusercontent.com/ashapsoncoe/h01/main/connection_strengths_analysis.py`
  (BigQuery over synapse table `goog14r0s5c3.synapse_c3_eirepredict_clean_dedup`).
- Structure: `{excitatory|inhibitory: {layer: {"0".."999": count}}}`, layers `Layer 1` to
  `Layer 6` and `White matter`.
  - `all_counts_total`: number of axon-to-target pairs with N synapses. Totals:
    excitatory 85,510,881 pairs, 99.00% single-synapse, max 19; inhibitory 26,719,489 pairs,
    98.21% single-synapse, max 46.
  - `all_counts_gp`: one entry per axon, at the synapse count of its strongest partner.
- Filters (from the code): presynaptic segment is a "pure axon fragment" that does not
  synapse onto any axon initial segment; postsynaptic segment typed neuron or dendrite.
  E/I is by majority of the pair's predicted synapse types (ties dropped). Region is the
  axon's layer.
- Licence: H01 release pages say CC BY 4.0. Paper: Shapson-Coe et al. 2024 Science
  (PMC11718559, not in the OA subset).
- Cache `h01/`: both JSONs plus the analysis script. Shipping: reduce to nonzero bins,
  about 2 KB.

## 2. Larval fly (Winding et al. 2023) modalities and outputs

**Verdict: obtainable.** Use Data S2 for labels and Data S1 `all-all` for edges; the ids
match (CATMAID skeleton ids).

- Data S2 `EMS175448-supplement-Supplementary_Data_S2.csv` (65,148 B), from the Europe PMC
  supplement zip `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7614541/supplementaryFiles`
  (10.9 MB). Columns `left_id, right_id, celltype, additional_annotations, level_7_cluster`;
  one row per pair (`no pair` for unpaired); 1,373 rows, 2,610 neurons.
  - Sensory modality is labelled: `celltype=sensory` with `additional_annotations` in
    olfactory, gustatory-external, gustatory-pharyngeal, gut, respiratory, thermo-cold,
    thermo-warm, visual. Neurons present in the matrix: 42 / 131 / 107 / 85 / 26 / 6 / 4 / 29.
  - Somatosensory has no sensory neurons in the brain volume; it enters as
    `celltype=ascending` (46 neurons) annotated mechano-Ch, mechano-II/III, noci, proprio,
    or unknown modality. Use these as seeds for the somatosensory modalities.
  - Outputs are labelled: `DN-VNC` (182 in matrix), `DN-SEZ` (164), `RGN` (54, ring gland).
    There are no motor neurons in the brain dataset; descending and ring-gland neurons are
    the outputs.
  - Also: second-order PNs per modality (`olfactory 2nd_order PN`, `noci 2nd_order PN`, ...),
    `pre-DN-VNC`, `pre-DN-SEZ`, LHN, MBON, MBIN, KC, CN, and the 93 level-7 clusters.
- Data S1 zip (1,054,841 B; 163 MB unzipped): five dense 2,952 x 2,952 CSVs (`all-all`,
  `aa`, `ad`, `da`, `dd`) with skeleton ids as row and column headers, plus `inputs.csv` /
  `outputs.csv` (per-neuron axon and dendrite input/output totals, for normalising to
  fractional input). `all-all`: 110,677 nonzero edges, 352,611 synapses. 2,606 of 2,610 S2
  ids are in the matrix.
- neurodata `meta_data.csv` (2.8 MB; 3,591 rows, index = skeleton id) labels sensories by
  nerve or receptor type, not modality (`class2`: AN, MN, ORN, vtd, photoRh5/6, PaN,
  thermo; `merge_class` sens-AN, sens-MN, ...). Its `motor` flag is just the 56 RGNs.
  `G_edgelist.txt` (2,514,626 B; `pre post weight`, 119,010 edges, 3,554 nodes, 376,091
  synapses) is a later, larger graph than the paper's 2,952; 2,607 S2 ids are in it. Repo
  licence field unset.
- Licence: CC BY (Europe PMC author manuscript PMC7614541, Science 2023).
- Cache `larva/`: S1 zip, S2, S3 (axon IO ratio), S4 (dendritic output-input ratio),
  `meta_data.csv`, `G_edgelist.txt`. Shipping: S1 all-all as a sparse list is about 1.5 MB
  raw, a few hundred KB gzipped; thresholded at w >= 5, 20,533 edges.

## 3. C. elegans neuropeptide network (Ripoll-Sanchez et al. 2023)

**Verdict: obtainable.**

- Repo: `https://github.com/LidiaRipollSanchez/Neuropeptide-Connectome` (MIT licence;
  paper Neuron 2023, CC BY, PMC7615469). Matrices updated 2024-02-02 for dmsr-5 and npr-34.
- Aggregate matrices, `Adjacency matrices for networks/`:
  - `01022024_neuropeptide_connectome_short_range_model.csv` (185,765 B; 31,417 nonzero)
  - `01022024_neuropeptide_connectome_mid_range_model.csv` (185,866 B; 40,425 nonzero)
  - `01022024_neuropeptide_connectome_long_range_model.csv` (186,132 B; 53,558 nonzero,
    density 0.59, max 20)
  - `08062023_monoamine_connectome.csv` (185,444 B)
- Format: CSV, 302 x 302, header `Row,I1L,I1R,...`, same neuron order on both axes
  (`Scripts & data/26012022_num_neuronID.txt`). **Rows send, columns receive** (the Matlab
  script builds `B = receptor_expression .* neuropeptide_expression` with NPP in rows and
  plots rows as "Sending neurons"). Weight = number of NPP-GPCR pairs linking the two
  neurons (sum over 92 individual networks).
- Per-pair networks: `Individual NPP-GPCR networks SR|MR|LR/` (92 files each, 185 KB each),
  identities in `neuropeptide_pairs (network identities for Individual_net folders).csv`.
  Thresholds: CeNGEN threshold 4, EC50 500 nM; other thresholds in `Sensitivity Analysis/`.
- Interactive companion: nemamod.org.
- Cache `worm/neuropeptide/`: three aggregate matrices, monoamine matrix, neuron id list,
  anatomical class table, CeNGEN expression, ligand-receptor list, `neuropeptide_pairs.csv`,
  Table S5 (NPP-GPCR pairs) and S6 (neuron info) xlsx, README, LICENSE. Shipping: short-range
  as a sparse list is roughly 250 KB raw.

## 4. C. elegans neuron positions

**c302: obtainable, 3D for all 302.** `c302_A_Full.net.nml` (1,422,606 B; URL in
`datasets.md`) has 397 populations, 302 neurons plus 95 body-wall muscles, each with one
`<location x y z>` (NeuroML2 unit: micrometres). All 302 neurons have a location.

- Axes, checked on bilateral and dorsal/ventral pairs: **y = anterior-posterior**,
  negative = head (RMED -275.8, ADFL -267.9) to positive = tail (PLML +410.2), span about
  686 um; **z = dorsal-ventral**, positive dorsal (RMED z 58.5 vs RMEV z 35.7); **x =
  left-right**, positive = left (ADAL +8.65 vs ADAR -12.9; RMEL +4.65 vs RMER -8.9).
- Correlation of c302 y with WormAtlas soma position: r = 0.994 (213 shared names). The
  body is about 0.6x the Kaiser scale (head-to-tail 686 um vs 1.14 mm), so treat it as a
  schematic body in um, not a measured adult.

**Kaiser & Hilgetag 2006 celegans277: obtainable, 2D in mm.**

- `http://www.biological-networks.org/pubs/suppl/celegans277.zip` (6,416 B; live) holds
  `celegans277positions.csv` (277 x 2), `celegans277labels.csv`, `celegans277matrix.csv`
  (277 x 277 binary directed). Also `celegans277.mat` (cs.cornell.edu/~arb/data/spatial-Celegans/
  per `topics-1-8.md`) and `celegans131.zip`.
- Column 1 is AP in mm, anterior positive (head about 0.1, tail -1.03); r = -0.998 with
  WormAtlas soma position. Column 2 is a small transverse offset (about +-0.05 mm),
  uncorrelated with c302 z (r = -0.12), so treat it as layout only. No licence stated.

**Chen, Hall & Chklovskii 2006: fixed points and actual positions public; predicted
positions not published as data.**

- PNAS Supporting Information (Wayback snapshot of `pnas.org/content/103/12/4723/suppl/DC1`)
  is Supporting Text plus Figs. 5 to 7 as PDFs. There is no data table; predicted positions
  appear only in figures. PMC and PNAS block direct SI downloads by script.
- The inputs are on WormAtlas ("Neuronal Wiring", `https://www.wormatlas.org/neuronalwiring.html`,
  which cites Chen et al. 2006 and Varshney et al. 2011):
  - `https://www.wormatlas.org/images/NeuronFixedPoints.xls` (61,440 B; 650 rows:
    `Neuron, Landmark, Landmark Position, Weight`). Landmarks: 20 sensory organs, 95
    body-wall muscles, vulva, anus. Positions are normalised AP (0 = nose, 1 = tail); 200
    neurons.
  - `https://www.wormatlas.org/images/NeuronType.xls` (60,928 B; 279 neurons; `Soma
    Position` normalised AP 0 to 1, Soma Region H/M/T, synapse counts by region, AY ganglion).
    These are the actual 1D positions the paper compared against.
  - `https://www.wormatlas.org/images/NeuronConnect.xls` (518,144 B; 6,417 rows:
    `Neuron 1, Neuron 2, Type (S, R, EJ, NMJ, Rp, Sp), Nbr`).
  - With these, the paper's quadratic wiring-cost layout (normalisation about 27, exponent
    2) can be recomputed in the browser as one linear solve. That gives "predicted vs actual"
    without the unpublished predicted table.
- Cache `worm/positions/`: c302 NML, celegans277 zip and mat, celegans131 zip, the three
  WormAtlas xls.

## 5. Macaque Markov et al. 2014

**Verdict: FLNe and SLN obtainable. White-matter distances only for the 11 JCN targets (628
pathways). The full 29 x 29 / 91 x 91 white-matter matrix is not public now. Area centres are
obtainable as label-placement centres.**

- INM-6 `multi-area-model/multiarea_model/data_multiarea/raw_data/` (repo CC BY-NC-SA 4.0
  per `datasets.md`):
  - `Markov2014_FLN_rawdata.csv` (224,199 B; tab-separated, 2 header lines): 1,989 rows
    `case, monkey, source, target, FLNe, neurons, status`; 29 targets, 91 sources, 39 cases;
    1,316 Known, 673 NFP. Identical content to core-nets `Cercor_2012 Table.xls`.
  - `SLN_Data.csv` (17,074 B): 188 rows, 6 targets, columns `INDEX TO FROM S I TOT DIST DENS
    Monkey lFLN SLN INJ FLN cSLN` (from Markov 2014 JCN).
  - `Thom_Distances_MERetal12.csv` (116,956 B): 91-area Markov parcellation, symmetric
    (parsed 92 x 92), header "Distances provided by Rembrandt". **Not the paper's
    white-matter distances.** Against JCN white-matter values for 524 matching pairs:
    r = 0.91, JCN/Thom median ratio 0.84. Method undocumented in the repo.
  - `Thom_Distances.csv`, `Euclidean_Distances.csv` (32 FV91 areas, CoCoMac centre-point
    distances) and `Median_Distances_81areas.csv` (CoCoMac voxel-pair median; used by the
    multi-area model) are in the FV91 parcellation, not Markov's. Not white-matter.
  - Also `Markov2014_InjectionSites.csv` (injection F99 coordinates per case),
    `hierarchy_Markov.csv`, `cortical_surface.csv`, `SchemeTranslation.csv`.
- White-matter distances that are public: Markov et al. 2014 JCN Table 2 (CC BY,
  PMC4255240): `To, From, SLN(%), Dist(mm)`, 628 pathways into 11 targets (7A, 8L, 8m, MT,
  STPc, TEO, TEpd, V1, V2, V4, DP), Dist 3.6 to 46.4 mm. The paper says these "were measured
  through the white matter in a 3D reconstruction of the M132 brain atlas ... between
  geometric centers of cortical areas". Archived:
  `https://web.archive.org/web/20220428032250id_/http://core-nets.org/download/JCN_2013%20Table.xls`
  (88,576 B).
- Full matrix: Ercsey-Ravasz et al. 2013 Neuron and Markov et al. 2013 PNAS both point to
  core-nets.org for distances; the file was `core-nets.org/download/PNAS_2013_Distance_Matrix.xlsx`.
  The Wayback has only a 301 (2022-07) and a 404 (2022-11) for it, no content. core-nets.org
  today returns HTTP 500 (WordPress PHP error). The 2024 archived core-nets FLN download is
  byte-identical to `Cercor_2012 Table.xls`. No GitHub mirror found. Neither paper is in the
  PMC OA subset, so their SI could not be scripted. Fallbacks: Thom MERetal12 (state it is a
  different, longer measure), or Euclidean distance between centres.
- Area centres: Scalable Brain Atlas region-centres service
  (`https://scalablebrainatlas.incf.org/services/regioncenters.php`, form-driven; template
  `MERetal14_on_F99`, left hemisphere). Output is `acronym, rgb, x (L-R), y (P-A), z (I-S)` in
  mm, F99 space, 92 rows (91 areas plus `[-]`). They are "optimized for label placement",
  not true centroids. The MERetal14 NIfTI linked from the SBA page now returns 404, so true
  centroids cannot be recomputed from SBA today.
- Licences: Markov 2014 Cereb Cortex CC BY-NC (PMC3862262); JCN 2014 CC BY; INM-6 repo
  CC BY-NC-SA 4.0.
- Cache `macaque/`: all INM-6 raw files above, `Cercor_2012_Table.xls`, `JCN_2013_Table.xls`,
  SBA centres (`SBA_regioncenters_MERetal14_on_F99_left.tsv` is clean;
  `..._MERetal14_left.tsv` starts with PHP warning lines), `MERetal14_acr2full.json`,
  `MERetal14_rgb2acr.json`.

## 6. Witvliet et al. 2021 ages and connection classes

**Verdict: obtainable, and the names match NemaNode exactly.**

- Ages, hours after birth: Dataset 1 to 8 = 0, 5, 8, 16, 23, 27, 50, 50 (stages L1, L1, L1,
  L1, L2, L3, adult, adult). Same values in NemaNode `https://nemanode.org/api/datasets` field
  `time` (ignore `visual_time` 1/5/9/15/23/27/46/50, which is display spacing) and in
  `https://raw.githubusercontent.com/dwitvliet/nature2021/master/src/data/dataset_info.py`.
  Dataset 6 coordinates need a 1.1 shrinkage upscale; Dataset 7 has no volumetric data.
- Classification: Nature SI Supplementary Table 6,
  `https://static-content.springer.com/esm/art%3A10.1038%2Fs41586-021-03778-8/MediaObjects/41586_2021_3778_MOESM8_ESM.csv`
  (92,737 B). Columns `pre, post, classification`; 3,676 chemical connections: variable
  1,995; stable 829; post-embryonic brain integration 554; developmentally dynamic
  (strengthened) 278; developmentally dynamic (weakened) 20. Gap junctions are not
  classified.
- Match to NemaNode: every chemical edge in all 8 `download-connectivity?datasetId=witvliet_2020_N`
  lists is in MOESM8 (775 / 986 / 1,012 / 1,136 / 1,515 / 1,525 / 2,202 / 2,186). MOESM8 is
  exactly their union: 3,676 of 3,676, identical neuron names, no unclassified neuron-neuron
  edges.
- Other SI in the same folder: MOESM3 (ST1, cell classes, types, NT/vesicle notes, 8 KB),
  MOESM4 (synapse count matrices per dataset, 837 KB), MOESM5 (synapse size matrices, 776 KB,
  no Dataset 7), MOESM6 (contact-area matrices, 1.16 MB), MOESM7 (per-synapse list, 32k rows,
  880 KB), MOESM9 (ST7 modules per dataset, 52 KB). Classifier code:
  `https://raw.githubusercontent.com/dwitvliet/nature2021/master/src/classify_edges.py`.
- Licence: Nature 2021 (not OA; author manuscript PMC8756380); the repo has no LICENSE file.
  Cite the paper; the data are facts tables.
- Cache `worm/witvliet/`: MOESM3 to MOESM9, `nemanode/witvliet_2020_1..8.json` and
  `nemanode/datasets.json`, `dataset_info.py`, `classify_edges.py`. Shipping: the 8 edge lists
  plus the class per edge come to about 150 KB gzipped.

---

Scratch caches from the earlier pass (`.cache/q1` to `q10`) are untouched. Everything used
above was copied into `h01/`, `larva/`, `worm/`, `macaque/`.
