# Mouse data check: VISp to higher visual areas, three ways

Checked 2026-10-01 by fetching each source anonymously (curl against the Allen RMA API, Allen download server, Nature and Europe PMC pages, UChicago Knowledge InvenioRDM API, BossDB S3 and the public `mat_dbs` GCS bucket). Sizes are bytes as served today.

Cache: `scripts/connectomes/.cache/mouse/` (gitignored, 305 MB). Scripts that produced every number below: `.cache/mouse/analysis/allen.py` (Allen API pull), `xlsx.py` (stdlib xlsx reader for the Oh tables), `mic2.py` (MICrONS join). They need only python3 + numpy + scipy. The earlier `q1/` downloads were re-fetched and are byte-identical (Knox gz files, Oh MOESM71) or value-identical (all 33 x 4 Allen projection densities checked).

Area names: Allen CCFv3 acronyms. VISl in Allen is the area MICrONS and the literature call LM (VISlm).

## (a) Allen tracer: experiments, Oh 2014, Knox 2019

**Verdict: obtainable.** All three are anonymous downloads, all in CCF acronyms, all under 2 MB for what a figure needs.

### Per-experiment projection values (Allen Mouse Brain Connectivity API)

- Injections: `service::mouse_connectivity_injection_structure[injection_structures$eq385]` returns 283 experiments with primary structure VISp; 33 are wild type (C57BL/6J, `transgenic-line` empty), all in the right hemisphere. (Note: adding `[primary_structure_only$eqtrue]` makes the service fail today; filter on `structure-id == 385` instead. URL-encode `$` as `%24` or the service errors.)
- Values: `model::ProjectionStructureUnionize` with `section_data_set_id$in<33 ids>`, `structure_id$in<HVA ids>`, `is_injection$eqfalse`, ipsilateral hemisphere (`hemisphere_id` 2). Fields used: `projection_density` (fraction of target voxels with signal) and `normalized_projection_volume` (projection volume / injection volume). Other fields present: `projection_energy`, `projection_intensity`, `projection_volume`, `volume`, `max_voxel_*`.
- Structure ids: VISal 402, VISl 409, VISpm 533, VISam 394, VISrl 417, VISli 312782574, VISpl 425, VISpor 312782628, VISa 312782546. All nine HVAs are present.
- Saved: `allen_visp_wt_hva_ipsi.csv` (7,218 bytes; 33 rows: experiment id, injection volume and coordinates, `<HVA>_pd`, `<HVA>_npv`), plus the raw JSON (`allen_visp_injections.json`, `allen_visp_wt_unionizes.json`).
- Licence: Allen Institute Terms of Use: free for research and other noncommercial use, citation required (alleninstitute.org/terms-of-use, fetched). Commercial use needs written permission.

VISp (33 WT injections) to ipsilateral HVA, median and interquartile range:

| target | projection_density median | IQR | normalized_projection_volume median | IQR |
|---|---|---|---|---|
| VISal | 0.118 | 0.038-0.272 | 0.157 | 0.123-0.247 |
| VISl | 0.238 | 0.053-0.501 | 0.344 | 0.225-0.605 |
| VISpm | 0.116 | 0.040-0.197 | 0.186 | 0.128-0.257 |
| VISam | 0.050 | 0.017-0.143 | 0.069 | 0.049-0.095 |
| VISrl | 0.086 | 0.026-0.235 | 0.196 | 0.079-0.269 |
| VISli | 0.144 | 0.033-0.295 | 0.110 | 0.084-0.153 |
| VISpl | 0.140 | 0.024-0.343 | 0.161 | 0.108-0.273 |
| VISpor | 0.113 | 0.009-0.275 | 0.195 | 0.084-0.337 |
| VISa | 0.011 | 0.003-0.036 | 0.031 | 0.013-0.056 |

Caveat for the page: injection volumes range 0.039 to 1.08 mm3 (median 0.24) and many injections spill into neighbouring HVAs (the first experiment, 180296424, lists VISl, VISpl, VISli and VISpor as injection structures). The spread per target is wide because retinotopic position matters: each injection covers a different part of the visual field map.

### Oh et al. 2014 regional matrix

- Nature 508:207, doi:10.1038/nature13186, marked open access on nature.com (no CC licence string on the page). Supplementary Table 3 = `https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fnature13186/MediaObjects/41586_2014_BFnature13186_MOESM71_ESM.xlsx` (1,570,515 bytes). Sheets `W_ipsi`, `PValue_ipsi`, `W_contra`, `PValue_contra`, each 213 x 213 sources x targets in 2011 ARA acronyms; W is normalized connection strength from the linear model (Fig. 4a). Also saved: Table 1 (MOESM69, region list), Table 2 (MOESM70, per-injection values for 469 injections x 295 regions), Table 4 (MOESM72, distances).
- The 2011 atlas has only five HVAs: VISal, VISam, VISl, VISpl, VISpm. VISrl, VISli, VISpor, VISa do not exist in it.

| VISp to | VISal | VISl | VISpm | VISam | VISpl |
|---|---|---|---|---|---|
| W_ipsi | 0.407 | 0.0656 | 0.00432 | 0.225 | 0 |
| p-value | 2.6e-47 | 4.8e-11 | 0.69 | 1.0e-31 | n/a (#NUM!) |

These disagree with the raw experiments (VISl is the strongest target in every other measurement; here VISpm is non-significant and VISpl is zero). The regional model is a nonnegative regression with neighbouring sources competing for the same signal, so adjacent-area entries are unreliable. That is itself a usable point for a page, but do not present Oh W as the tracer ground truth for this pathway.

### Knox et al. 2019 voxel-model regional matrices

- Network Neuroscience 3:217, doi:10.1162/netn_a_00066. Files at `https://download.alleninstitute.org/publications/A_high_resolution_data-driven_model_of_the_mouse_connectome/` (last modified 2025-02-21):
  - `connection_strength.csv.gz` 1,552,201; `connection_density.csv.gz` 1,593,081; `normalized_connection_strength.csv.gz` 1,595,759; `normalized_connection_density.csv.gz` 1,622,011. Each is 291 sources (right hemisphere) x 577 targets (row 1 `ipsi`/`contra`, row 2 CCF structure ids), CCFv3 summary structures.
  - `normalized_connection_density_ipsi_ctx.csv` 19,649 bytes: 43 x 43 isocortex, ipsilateral, labelled by acronym. This one file covers the whole pathway.
  - Not downloaded: `weights.csv.gz` 145,052,675 and `nodes.csv.gz` 490,386,367 (the voxel model itself).
- Licence: data from the Allen Institute (Terms of Use above); the paper is open access.

VISp row, ipsilateral (`knox_visp_row.json`):

| VISp to | VISal | VISl | VISpm | VISam | VISrl | VISli | VISpl | VISpor | VISa |
|---|---|---|---|---|---|---|---|---|---|
| normalized_connection_density (x1e-4) | 6.94 | 10.65 | 6.29 | 4.57 | 5.89 | 7.47 | 6.94 | 4.57 | 1.42 |
| normalized_connection_strength | 0.261 | 0.659 | 0.329 | 0.178 | 0.297 | 0.186 | 0.273 | 0.288 | 0.102 |
| connection_strength | 928 | 2339 | 1167 | 631 | 1055 | 660 | 968 | 1023 | 360 |

Across the nine HVAs, Spearman rank correlation of the Allen experiment median projection density with Knox normalized connection density is 0.95.

## (b) Mouse diffusion MRI

**Verdict: Calabrese 2015 is not public in usable form; Trinkle et al. 2021 is obtainable and is the file to use.**

### Calabrese et al. 2015 (Cerebral Cortex 25:4628, doi:10.1093/cercor/bhv121, PMC4715247, paper CC BY-NC 4.0)

- Paper says matrices are at `http://www.civm.duhs.duke.edu/mouseconnectome/`; that URL now redirects to an unrelated page (`/rhesusatlas`). The project page `https://www.civm.duhs.duke.edu/duke-CIVM-sup-mouse-brain-connectome` links "Connectivity Matrix Graph Data" to CIVMVoxPort studies 208, 240 and 251, which all redirect to a login page ("register for access"; data stated as CC BY-NC-SA 3.0, academic use, and the page asks users to request copyright permission before publishing). Not token-free.
- Labels: 148 per hemisphere (296 seeds), Waxholm Space for subcortex and the Ullmann et al. 2013 Paxinos-Franklin style neocortex atlas. Visual labels are V1, V1B, V1M, V2L, V2ML, V2MM (supplementary Table 1, saved as `calabrese2015_supp_table1_labels.pdf`). There are no Allen HVAs, so even with an account it cannot give VISp to VISal/VISl/VISrl etc.
- Europe PMC supplementary zip (52 MB) holds only the label PDF and a figures .doc; no matrix.

### Trinkle et al. 2021 (NeuroImage 244:118576, doi:10.1016/j.neuroimage.2021.118576, PMC8611903)

- Data: UChicago Knowledge, doi:10.6082/uchicago.3310, `https://knowledge.uchicago.edu/records/n21gc-zjn63`, access "Open", rights listed as MIT license (plus the repository distribution licence).
  - `Connectivity matrices.zip` 61,266,042 bytes (md5 d0a52551b83bd9f20a554d35c1a743ec, verified). Saved as `trinkle2021_connectivity_matrices.zip`, extracted to `trinkle2021/`.
  - Not downloaded: `diffusion_data.zip` 776,798,548 (raw dMRI). Also present: `Fiber distances.csv` 4,959,773, `Make surrogates.py`.
- Content: 21 CSVs, each 572 x 572 = 286 CCFv3 regions (Knox's 291 minus five midline structures) x ipsi/contra, labelled `<acronym>-I` / `<acronym>-C`. All nine HVAs present. Five ex vivo C57BL/6 brains (`n1`..`n5`), 125 um isotropic, b=3000, 30 directions, MRtrix3 probabilistic tracking, 2000 seeds per voxel, about 400 M streamlines per brain. Four weightings per brain: `tract_endpoints_rawcounts`, `tract_endpoints_SIFT2`, `tract_dense_rawcounts`, `tract_dense_SIFT2` ("endpoints" assigns a streamline to the regions at its two ends; "dense" to every region it passes through). Weights are streamline counts divided by the product of the two region volumes; matrices are symmetric (undirected) with hemispheric symmetry enforced. `tracer_w.csv` is Knox normalized connection density made undirected by summing A to B and B to A (checked: VISp-VISl 0.002693 = 0.001065 + 0.001628).
- Units: the volume normalization unit is not stated in the files, so treat values as relative within a matrix.

VISp row, mean over 5 brains (coefficient of variation across brains), `trinkle2021_visp_row.json`:

| variant | VISal | VISl | VISpm | VISam | VISrl | VISli | VISpl | VISpor | VISa |
|---|---|---|---|---|---|---|---|---|---|
| endpoints, raw counts | 0.0609 (0.13) | 0.109 (0.18) | 0.0953 (0.14) | 0.0378 (0.26) | 0.0646 (0.23) | 0.0494 (0.33) | 0.0956 (0.24) | 0.0354 (0.15) | 0.0237 (0.29) |
| endpoints, SIFT2 (x1e-3) | 2.49 (0.11) | 4.22 (0.33) | 4.07 (0.20) | 1.43 (0.09) | 3.10 (0.18) | 1.83 (0.45) | 3.53 (0.12) | 1.31 (0.18) | 1.16 (0.13) |
| dense, raw counts | 0.522 (0.18) | 0.646 (0.11) | 0.682 (0.13) | 0.424 (0.21) | 0.505 (0.12) | 0.546 (0.09) | 0.393 (0.14) | 0.196 (0.13) | 0.210 (0.22) |
| tracer_w (Knox, symmetrised, x1e-3) | 2.03 | 2.69 | 2.01 | 1.58 | 1.71 | 2.59 | 1.90 | 2.02 | 0.83 |

Spearman over the nine HVAs: endpoints raw counts vs Knox directed density 0.78, vs Allen experiment medians 0.70; dense raw counts vs Knox 0.68. Tractography gets VISl on top and VISa at the bottom but overrates VISpm and VISpl and underrates VISpor (the long, ventral target), which matches the paper's finding that tractography loses weight with distance.

Comparison caveat for the figure: tractography is undirected, so it measures VISp-VISl, not VISp to VISl. Compare it with the directed Knox row and say so, or with `tracer_w` (both directions summed).

## (c) MICrONS minnie65

**Verdict: obtainable, token-free, from the static `mat_dbs` dumps.** CAVE itself is not token-free.

### Access routes

- CAVE `minnie65_public`: anonymous requests to `https://global.daf-apis.com/info/api/v2/datastack/full/minnie65_public` and `https://minnie.microns-daf.com/materialize/api/v3/datastack/minnie65_public/versions` both 302 to `sticky_auth` login. The tutorial confirms a Google login, a terms-of-service click and a user token are required.
- BossDB S3 (`s3://bossdb-open-data/iarpa_microns/minnie/minnie65/synapse_graph/cave_exports/`): anonymous. v1300 `connections_with_nuclei.csv.gz` 2,996,965,416 (columns `pre_pt_root_id, post_pt_root_id, n_syn, sum_size, pre_nuc_id, post_nuc_id`; over the 1 GB limit, not downloaded); `synapses_pni_2_v1_filtered_view.csv.gz` about 20 GB per version; v661 `mat661_soma_soma_connections.csv` 560,565,873 (soma-to-soma pairs; no area labels, older proofreading).
- Static materialization dumps, anonymous: `https://storage.googleapis.com/mat_dbs/public/minnie65_phase3_v1/v<version>/<table>.csv.gz` plus `<table>_header.csv` (headerless CSV; header file gives column names and types). Versions listed: 117, 343, 661, 795, 943, 1078, 1181, 1300, 1412, 1484, 1507, 1718. v1507 has the full set of annotation tables; v1718 has only the big synapse/connection files. The live release is v1926 (2026-09-28) through CAVE only.
- MICrONS 2025 Nature papers: the consortium paper (Nature 640:435, doi:10.1038/s41586-025-08790-w, CC BY 4.0) has only two supplementary PDFs, no source-data tables; it points to microns-explorer and BossDB. Code: github.com/AllenInstitute/MicronsFunctionalConnectomics.
- Licence: no data licence string on microns-explorer or the dumps. The paper is CC BY 4.0; the BossDB AWS registry entry lists CC BY 4.0 / CC0 / CC BY-NC-SA 4.0 across its datasets without per-dataset mapping. Cite the consortium paper and treat it as CC BY 4.0 with that caveat recorded.

### Files used (all v1507, `.cache/mouse/microns_v1507/`)

| file | bytes | columns | use |
|---|---|---|---|
| `synapses_with_axon_proofreading.csv.gz` | 80,191,720 | `id, ctr_pt_position_x/y/z, size, pre_pt_supervoxel_id, pre_pt_root_id, post_pt_supervoxel_id, post_pt_root_id, strategy_axon` | every synapse made by a proofread axon: 2,089,627 synapses, all from cells in the proofreading status table (2,182 cells) |
| `aibs_cell_info_merged.csv.gz` | 5,696,726 | `id, pt_root_id, nuc_volume, broad_type, cell_type, mtype, dendrite_cleaned, axon_cleaned, dendrite_strategy, axon_strategy, visual_area, pt_position_x/y/z` (+ sources) | one row per nucleus (144,120) with area V1/RL/AL/LM and cell type |
| `nucleus_functional_area_assignment_merged.csv.gz` | 6,220,400 | `id, tag (area), target_id, value, volume, pt_*` | same areas; used to assign synapse locations to an area by nearest nucleus |
| `proofreading_status_and_strategy_merged.csv.gz` | 69,077 | `status_dendrite, status_axon, strategy_dendrite, strategy_axon, pt_root_id` | 2,182 proofread cells; `strategy_axon` one of `axon_partially_extended` 1,750, `axon_fully_extended` 267, `axon_interareal` 124, `none` 41 |

Coordinates are in 4 x 4 x 40 nm voxels for both synapses and nuclei. Root ids in the synapse and cell tables join directly at v1507.

### How much of the volume is HVA

- Nuclei (all cells) by area: V1 90,765 (63.0%), RL 31,622 (21.9%), AL 20,859 (14.5%), LM 874 (0.6%).
- Neurons (excitatory + inhibitory): V1 49,168 (65.2%), RL 17,363 (23.1%), AL 8,489 (11.3%), LM 385 (0.5%).
- Tangential footprint (10 um grid in the x-z plane, nearest-nucleus area): V1 59.2%, RL 21.6%, AL 18.5%, LM 0.6%. So about 41% of the volume is HVA, nearly all RL and AL; LM is a sliver at the edge.

### VISp to HVA synapses

Proofread cells with V1 somata: 1,910 (partially extended 1,631, fully extended 223, interareal 18, none 38). Their 1,872 proofread axons made 1,809,220 synapses in the table (the 38 V1 cells with axon strategy `none` contribute none). Assigning each synapse to the area of the nearest nucleus (location) or to the area of the postsynaptic soma (target cell):

| V1 axons, by class | axons | synapses | located in RL / AL / LM | share in HVA | onto RL/AL/LM somata |
|---|---|---|---|---|---|
| excitatory | 1,562 | 780,573 | 44,760 / 8,823 / 1,066 | 7.0% | 44,554 |
| inhibitory (BC, MC, BPC, NGC) | 307 | 1,028,437 | 9,933 / 1,284 / 559 | 1.1% | 11,757 |
| axon_interareal subset (18; 23P 7, 4P 4, 5P-IT 3, 6P-IT 2, 5P-NP 1, 6P-CT 1) | 18 | 11,961 | 1,523 / 627 / 34 | 18.3% | 1,619 |

Postsynaptic soma area for all V1 axons: V1 1,502,065, RL 47,506, AL 7,966, LM 839, and 250,844 onto fragments with no soma in the volume.

Per-axon counts: `microns_v1507_v1_axon_targets.csv` (143,429 bytes, 1,872 rows: `pre_pt_root_id, strategy_axon, cell_type, n_out, post_soma_V1/RL/AL/LM, post_nosoma, loc_V1/RL/AL/LM`). This is the small file for the figure. Per interareal axon, the HVA share runs from 0 to 55% (a 6P-IT axon: 154 RL + 43 AL + 2 LM of 360).

Reading these numbers honestly:

- Most "V1 to HVA" synapses here are local wiring across the V1/RL and V1/AL borders, not the long feedforward projection the tracers measure. Inhibitory basket cells near the border put thousands of synapses into RL; they have no long-range axon.
- Only 18 V1 axons were proofread specifically as interareal projections (`axon_interareal`); the other 106 interareal axons have RL or AL somata (feedback direction).
- The volume holds the retinotopic border region of V1, RL and AL, with almost no LM, VISpm, VISam or other HVAs. MICrONS can answer "how many synapses does one V1 axon make in RL and AL, and onto which cells", not "VISp to each HVA" in the Allen sense.
- Counts are per proofread axon, which is the right normalisation; dividing by total synapses per axon (the "share in HVA" column) avoids weighting by axon length.

## What the figure can use

| modality | file | size | regions |
|---|---|---|---|
| tracer, per experiment | `allen_visp_wt_hva_ipsi.csv` | 7 KB | 9 HVAs, 33 injections |
| tracer, model | `knox_normalized_connection_density_ipsi_ctx.csv` (or the VISp row from the 291 x 577 files) | 20 KB | 9 HVAs |
| dMRI | VISp rows of `trinkle2021/tract_endpoints_rawcounts_n{1..5}_w.csv` (extract to a few KB) | 6.7 MB each, 61 MB zip | 9 HVAs, 5 brains, undirected |
| EM | `microns_v1507_v1_axon_targets.csv` | 143 KB | RL, AL, LM (sliver), per proofread axon |
