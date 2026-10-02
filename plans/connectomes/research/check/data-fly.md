# Fly data check: edge reproducibility, PN x KC, Hallem-Carlson

Checked 2026-10-01 by fetching each source anonymously (curl against Zenodo API, GCS JSON API and HTTP range reads, raw.githubusercontent.com, Nature and PMC pages). No login or token was needed for anything listed as obtainable. Sizes are bytes as served today. Background on FlyWire v783 and hemibrain v1.2 file inventories is in `datasets.md` (same folder) and is not repeated here.

Cache: `scripts/connectomes/.cache/fly/` (gitignored). Large files are hard links to the earlier `q2/` and `q4/` downloads (same inode, no extra disk). Checksums of the reused files were re-verified against the Zenodo md5 and GCS md5 listings. Analysis scripts that produced every number below are in `.cache/fly/analysis/` (`q1_lr.py`, `q2_pnkc.py`, `derive.py`; run with `uv run --with pandas --with pyarrow python <script>`), outputs in `.cache/fly/derived/`.

## 1. Edge reproducibility versus synapse count

**Verdict: obtainable with work** (no published FlyWire-vs-hemibrain edge table; computable from open files in about a minute, and my computation reproduces the paper's headline numbers). A ready-made matched-edge table does exist for a different pair: male CNS vs FlyWire (below).

### What Schlegel et al. 2024 published

- Nature 634:139-152, doi:10.1038/s41586-024-07686-5, CC BY 4.0. The analysis is Fig. 4e-g and Extended Data Fig. 6d,e. "Edge" means all synapses between two cell types, no threshold; 572,980 type-to-type edges across three hemispheres; 2,954 hemibrain types used after excluding KCs, ALRNs, VPNs, left-only hemibrain types, `outlier_seg` types and many:1 matches.
- Headline numbers in the text: 53% of hemibrain edges found in FlyWire; FlyWire left to right 61%, right to left 59%; a 1-synapse hemibrain edge has 42% chance in one FlyWire hemisphere and 16% in both; any edge above 10 synapses is found more than 90% of the time; those edges are 16% of edges but about 79% of synapses; normalized threshold 0.9% of target input.
- Supplementary files (Nature page, checked): Supplementary Information PDF, Supplementary Data 1-5 (neuron annotations TSV, non-neuron TSV, hemilineage summary, hemilineage clustering, hemibrain meta), videos, peer review file. No source-data files, no edge table. Zenodo 10877326 holds only NBLAST scores and skeletons. GitHub `flyconnectome/flywire_annotations` holds the same five supplemental files. No other flyconnectome repo (39 listed) contains the Fig. 4 edge table.

### Ready-made alternative: male CNS vs FlyWire matched type edges

- `https://raw.githubusercontent.com/flyconnectome/2025malecns/main/supplemental_data/mcns_fw_edge_comp.feather`, 100,367,578 bytes (Berg et al., Cell 2026). Columns: `pre`, `post` (cross-matched type), `weight_m`, `weight_f` (total synapses, whole central brain, both sides pooled), `t`, `p_corr`, `verdict_corr` (isomorphic / dimorphic / noise). 3,761,792 rows. Companion `mcns_fw_edge_comp_mappings.json` (6.7 MB) gives neuron-to-label assignment. Repo has no LICENSE file; underlying data are CC BY.
- Computed: P(edge present in male | female weight w): w=1 0.337, 2 0.520, 3 0.646, 5 0.790, 8-10 0.894, 11-15 0.933, 21-30 0.968, >100 0.992. The reverse direction saturates lower (0.93 at >100) because male-specific types and higher male completeness add edges with no female partner. Cached as `fly/mcns_fw_edge_comp.feather`.

### Computing it from FlyWire v783 + hemibrain v1.2 (done)

Files (all anonymous):

| File | URL | Size | Use |
|---|---|---|---|
| proofread_connections_783.feather | https://zenodo.org/records/10676866/files/proofread_connections_783.feather (CC BY 4.0) | 852,022,274 | `pre_pt_root_id, post_pt_root_id, neuropil, syn_count, gaba_avg..da_avg`; 16,847,997 rows, 15,091,983 neuron pairs, 54,492,922 synapses |
| Supplementary Data 1 (Nature MOESM5) | https://static-content.springer.com/esm/art%3A10.1038%2Fs41586-024-07686-5/MediaObjects/41586_2024_7686_MOESM5_ESM.tsv (CC BY 4.0) | 27,015,208 | per neuron: `root_id, super_class, cell_class, cell_sub_class, cell_type, hemibrain_type, side, status, top_nt`, soma xyz; 139,255 rows. Matches annotations release v2.1.0 (the paper's) |
| Supplemental_file1_neuron_annotations.tsv (GitHub HEAD, v3.x) | https://raw.githubusercontent.com/flyconnectome/flywire_annotations/main/supplemental_files/Supplemental_file1_neuron_annotations.tsv (no licence file in repo) | 31,720,298 | newer types revised against male CNS, adds `supertype, dimorphism, synonyms`. Use v2.1.0 to match the paper |
| Supplementary Data 5 (MOESM9) | Nature ESM | 2,618,808 | hemibrain `bodyId, type, side, cropped`; gives hemibrain soma side |
| exported-traced-adjacencies-v1.2.tar.gz | https://storage.googleapis.com/hemibrain/v1.2/exported-traced-adjacencies-v1.2.tar.gz (CC BY) | 45,872,577 | `traced-neurons.csv` (bodyId, type, instance; 21,739), `traced-total-connections.csv` (bodyId_pre, bodyId_post, weight; 3,550,403 pairs) |

Yes, the public annotation table gives both the hemibrain-matched type (`hemibrain_type`, composite labels like `SIP078,SIP080` for merged types) and side (`side`: left 69,959, right 69,093, center 173). Consensus type = `cell_type` if set else `hemibrain_type`. Side labels are biologically correct (the FAFB image inversion is already fixed). No neuron-to-neuron left/right pairing is published, but singleton types (one neuron per side) give matched neuron pairs directly.

Method: aggregate neuron pairs into (pre type, pre side, post type, post side); an edge on one side is "found" if its mirror (L<->R on both ends) has weight >= 1. Results (P found on the other side, by weight on this side):

| weight | 1 | 2 | 3 | 4 | 5 | 6-7 | 8-10 | 11-15 | 16-20 | 21-30 | 31-50 | 51-100 | >100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FlyWire L/R, all typed neurons (3.20 M edges) | 0.316 | 0.502 | 0.634 | 0.723 | 0.787 | 0.844 | 0.902 | 0.944 | 0.970 | 0.982 | 0.990 | 0.995 | 0.998 |
| FlyWire L/R, central-brain style subset (2.72 M) | 0.314 | 0.499 | 0.634 | 0.723 | 0.787 | 0.846 | 0.905 | 0.948 | 0.974 | 0.986 | 0.993 | 0.997 | 0.999 |
| FlyWire L/R, singleton types = matched neuron pairs (852 k) | 0.310 | 0.506 | 0.644 | 0.737 | 0.806 | 0.862 | 0.922 | 0.959 | 0.981 | 0.989 | 0.995 | 0.998 | 0.999 |
| FlyWire L to R, 3,047 hemibrain-matched types, ipsilateral (340 k) | 0.351 | 0.548 | 0.680 | 0.768 | 0.831 | 0.881 | 0.931 | 0.963 | 0.982 | 0.990 | 0.995 | 0.998 | 1.000 |
| hemibrain (right) edge found in FlyWire right (408 k) | 0.284 | 0.455 | 0.589 | 0.677 | 0.733 | 0.799 | 0.865 | 0.916 | 0.950 | 0.964 | 0.982 | 0.988 | 0.997 |
| hemibrain edge in both FlyWire hemispheres | 0.143 | 0.284 | 0.418 | 0.519 | 0.592 | 0.676 | 0.772 | 0.855 | 0.913 | 0.942 | 0.971 | 0.982 | 0.996 |

Overall: FlyWire left found on right 56.6%, right on left 55.0% (all typed); 59.5% in the hemibrain-matched subset (paper: 61/59%). Hemibrain found in FlyWire right 52.4% (paper: 53%); in at least one FlyWire hemisphere 63.8%. A 1-synapse hemibrain edge: 41% in at least one FlyWire side, 14% in both (paper: 42%, 16%). Edges above 10 synapses: 14.6% of edges, 86% of synapses, found on the other side 97.4% (all typed); 13.0% / 70% / 97.5% in the central subset. The approximation differs from the paper in the type set and in not clipping FlyWire to the hemibrain volume, which is why the hemibrain comparison runs a few points low at mid weights.

Browser size: the by-weight table is a few hundred bytes; a type-to-type edge list for one figure (e.g. central subset at w >= 1, two weights per edge) is ~2.7 M rows, too big, so ship binned counts or a sampled subset. Results JSON: `fly/derived/flywire_lr_and_hemibrain_edge_replication.json`.

## 2. Mushroom body PN (glomerulus) x KC

**Verdict: obtainable.** Smallest anonymous files with glomerulus labels:

| Source | File | Size | Contents |
|---|---|---|---|
| Zheng et al. 2022 (FAFB, CATMAID tracing) | https://raw.githubusercontent.com/bocklab/pn_kc/master/data/201001_bouton_claw_table.csv (also `revision` branch as `STable_201001_bouton_claw_table.csv`; MIT) | 529,548 | one row per claw: `pn_skid, kc_skid, pn_names, kc_names, pn_type` (glomerulus), `claw_ids`. 113 PNs, 54 glomeruli, 1,354 KCs, 6,466 claws, 4.78 +/- 1.51 claws per KC |
| hemibrain v1.2 | exported-traced-adjacencies-v1.2.tar.gz (above) + https://raw.githubusercontent.com/flyconnectome/hemibrain_olf_data/master/FIB_uPNs.csv (MIT, 8,796 B) | 45.9 MB | `FIB_uPNs.csv` gives bodyid to `glomerulus` for 130 right-side uPNs (51 glomeruli), with the corrected names VC5->VM6, VC3l->VC3, VC3m->VC5 that neuPrint v1.2 types do not have |
| FlyWire v783 | proofread_connections_783.feather (852 MB) + Supplementary Data 1 | 879 MB | ALPN `cell_sub_class` = uniglomerular (277), glomerulus from `cell_type`/`hemibrain_type` prefix (e.g. `DA1_lPN`); KCs `cell_class` = Kenyon_Cell (5,177) |

There is no small pre-made FlyWire PN x KC file; the 852 MB feather is the smallest open source (Codex exports need Google sign-in).

Computed (derived edge lists in `fly/derived/`):

- hemibrain v1.2: 1,927 traced KCs (KCg-m 590, KCab-m 354, KCab-c 252, KCab-s 223, KCa'b'-ap2 127, KCa'b'-m 119, KCg-d 99, KCa'b'-ap1 91, KCab-p 60, others 12). uPN to KC: 11,224 pairs (9,657 at w>=3), 173,436 synapses; 108 uPNs x 1,761 KCs receive; glomerulus x KC matrix 51 x 1,761 with 10,650 nonzero; 5.33 glomeruli and 5.53 PNs per KC at w>=3. `hemibrain_v1.2_uPN_KC_edges.csv` (pn, glomerulus, kc, kc_type, weight) is 393 KB.
- FlyWire v783, ipsilateral: left 117 uPNs x 2,395 KCs, 12,988 pairs (11,117 at w>=3), 169,651 synapses, 4.59 glomeruli per KC; right 119 x 2,421, 12,729 pairs, 141,709 synapses, 4.47 glomeruli per KC. 55 glomeruli including thermo/hygro VP1d, VP1m, VP2, VP4. 99.3% of uPN-KC synapses are in MB_CA_L/R. `flywire_v783_uPN_KC_edges.csv` (pn, glomerulus, pn_side, kc, kc_type, kc_side, weight, weight_calyx) is 1.6 MB. Glomerulus names already match hemibrain_olf_data (VC3, VC5, VM6).

Zheng 2022 co-sampling data (Curr Biol 32:3334, doi:10.1016/j.cub.2022.06.031; paper states code and data at github.com/bocklab/pn_kc; neurons promised to VFB CATMAID). The data sit on the repo's `master` branch under `data/` (default branch is `revision`, which has the code and the claw table only):

- `data/200514_pn_kc_bi_conn.npy` (1,225,952 B): binary 1,356 KC x 113 PN matrix, 6,416 ones.
- `data/pre_post_info/pn_all_kc` (10,149,744 B, JSON): 65,783 PN to KC synapse records, 113 PNs, 1,355 KCs, 26,509 connectors; each row `[connector_id, [x,y,z], pn_treenode, pn_skid, ., ., [x,y,z], kc_treenode, kc_skid, ., ., [x,y,z]]` in FAFB14 nm (calyx: x 407-472 k, y 118-169 k, z 173-224 k). This gives synapse positions in the calyx; claw positions follow by grouping a KC's synapses per `claw_ids` row (claw table) or by clustering per PN-KC pair.
- `data/skids/{PN,RandomDraw,kcab,kcprime,kcy}`, `data/neurons_names`, `data/glom_class`, `data/kc_class`, plus `tables/` xlsx (PN metadata, glomerulus ids). `modeling/data/200926-RD_local_random_tbl.csv` (160 KB) is their local-random null output.
- Licence MIT (Zhihao Zheng 2019). Paper is an NIH author manuscript (PMC9413950), not CC.

Spatial null options: Zheng gives claw counts and synapse xyz (best, 10 MB, shrinkable to ~0.5 MB as per-claw centroids). Hemibrain synapse positions need `hemibrain-v1.2-synapse-points-with-body-roi-type-status.feather` (1,838,033,050 B; columns z,y,x,kind,conf,body,roi,type,...) plus `hemibrain-v1.2-synapse-partners.feather` (859,399,658 B; pre_id, post_id point ids): over the 1 GB limit, not downloaded. FlyWire synapse positions are only in `flywire_synapses_783.feather` (9,492,998,242 B; pre/post xyz, neuropil, scores): not downloaded. Schemas read with HTTP range requests. Neither connectome has claw labels.

## 3. Hallem and Carlson 2006 odorant matrix

**Verdict: obtainable.** Cell 125:143-160, doi:10.1016/j.cell.2006.01.050. The publisher supplement is not scriptable (cell.com and sciencedirect return 403 to curl; Elsevier open-archive user licence, not CC), so use one of the two mirrors, which agree.

| Copy | URL | Size | Licence | Notes |
|---|---|---|---|---|
| drosolf | https://raw.githubusercontent.com/tom-f-oconnell/drosolf/master/drosolf/data/Hallem_Carlson_2006.csv | 10,819 | repo GPL-3.0 (data are measurements) | two header rows (glomerulus, receptor), 110 odors + `spontaneous firing rate` row, 24 receptors, `cas_number`. Values are changes from spontaneous rate (spikes/s); add the SFR row for absolute rates. Smallest machine-readable copy |
| drosolf alt | .../drosolf/data/hc_data.csv | 16,281 | same | adds odor class column and the lower-concentration and fruit series |
| DoOR.data | https://raw.githubusercontent.com/ropensci/DoOR.data/master/data/Or22a.csv etc. (one file per receptor, column `Hallem.2006.EN`) | ~85 KB each | CC BY-SA 4.0 | stores absolute rates: matches drosolf + SFR exactly (checked Or22a: all 62 CAS-matched odors differ by exactly the 4 spikes/s SFR). Also `door_response_matrix_non_normalized.csv` (293 KB, 691 odors x 78 units) is DoOR's merged consensus, not H&C |

Receptor to glomerulus: DoOR `door_mappings.csv` (12.8 KB, CC BY-SA, columns receptor, sensillum, OSN, glomerulus, co.receptor, ...) agrees with drosolf's mapping; hemibrain_olf_data `AL_gloms_RN_info.csv` and `odour_scenes.csv` (MIT) give glomerulus to receptor and key ligand for every glomerulus; drosolf `glomeruli_and_receptors.txt` is from Task et al. 2022. Saved as `fly/derived/hallem_carlson_receptor_glomerulus.csv`.

The 24 H&C receptors cover 23 glomeruli, all present in both PN sets from (2): DA3 (Or23a), DA4l (43a), DA4m (2a), DC1 (19a), DL1 (10a), DL3 (65a), DL4 (85f), DL5 (7a), DM2 (22a), DM3 (47a), DM4 (59b), DM5 (85a), DM6 (67a), VA1d (88a), VA1v (47b), VA5 (49b), VA6 (82a), VC3 (35a), VC4 (67c), VM2 (43b), VM3 (9a), VM5d (85b), VM5v (98a). Or33b goes to both DM3 and DM5 (weak, usually dropped in models).

Glomeruli in (2) with no H&C receptor (28 of 51 hemibrain uPN glomeruli): D, DA1, DA2, DC2, DC3, DC4, DL2d, DL2v, DM1, DP1l, DP1m, V, VA2, VA3, VA4, VA7l, VA7m, VC1, VC2, VC5, VL1, VL2a, VL2p, VM1, VM4, VM6, VM7d, VM7v; FlyWire adds VP1d, VP1m, VP2, VP4 (and VP1l+_lvPN, which makes no KC synapses). DoOR consensus responses cover 47 of the 55 FlyWire glomeruli (missing DL2d, DL2v, VA7m, VM6 and the VP glomeruli), if a wider but model-merged odor space is acceptable.

## Not downloaded (over ~1 GB or not needed)

hemibrain-v1.2-synapse-points-with-body-roi-type-status.feather 1.84 GB; hemibrain-v1.2-skeletons.tar.gz 1.88 GB; flywire_synapses_783.feather 9.49 GB; male CNS connectome-weights (0.5 to 1.05 GB, see datasets.md). hemibrain-v1.2-synapse-partners.feather (859 MB) was skipped because it is useless without the 1.84 GB points file (bodies live there).

## Cache contents (`scripts/connectomes/.cache/fly/`)

- FlyWire: `proofread_connections_783.feather`, `proofread_root_ids_783.npy`, `schlegel2024_SupplData1_neuron_annotations_nature.tsv`, `flywire_annotations_Supplemental_file1_neuron_annotations.tsv` (GitHub HEAD), `schlegel2024_SupplData5_hemibrain_meta.csv`
- hemibrain: `hemibrain-v1.2-exported-traced-adjacencies.tar.gz` and its extracted folder; `hemibrain_olf_data_*` (uPNs, mPNs, VP PNs, LHS uPNs, RNs, AL_gloms_RN_info, odour_scenes, README, LICENSE)
- male CNS vs FlyWire: `mcns_fw_edge_comp.feather`
- Zheng 2022: `zheng2022_bocklab_pn_kc/` (claw table, binary matrix, synapse JSON, skid lists, xlsx tables, LICENSE)
- Odors: `drosolf_*` (Hallem_Carlson_2006.csv, hc_data.csv, glomeruli files, task22_table3.csv, orns.py for the mapping notes), `door_*` (mappings, dataset_info, Or22a, ORs, consensus matrix), `DoOR.data_DESCRIPTION.txt`
- `derived/`: replication JSON, PN-KC summary JSON, hemibrain and FlyWire uPN-KC edge CSVs, H&C receptor-glomerulus CSV
- `analysis/`: the three scripts
