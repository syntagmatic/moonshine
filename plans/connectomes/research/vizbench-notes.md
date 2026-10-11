# Connectomes: what vizbench already has

Internal notes, not for the research agent (PROMPT.md stays portable). Written
2026-09-29 from `~/git/vizbench` at 6b2e00d. Use these once the research report is back
and the arc is being chosen.

## Fly male CNS (`vizbench/apps/fly-connectome/`, plan `docs/fly-release.md`)

Source: `gs://flyem-male-cns/v1.0/` (CC-BY 4.0), flat feather files read in Node with
apache-arrow + lz4js. Build scripts in `apps/fly-connectome/scripts/`.

- Neuropil matrix, 103 neuropils / 319 leaves, rebuilt from per-neuron `roiInfo` with
  neuPrint's rule (matches cached weights within 0.17%). Split by predicted transmitter.
  Mesh volumes exact (whole-nm vertex grid). Weight vs centroid distance scatter, same
  side vs crossing. Wiring-space MDS morph from anatomy.
- Cell types: 11,751 types, 162,521 typed neurons, type-pair edges.
- Significant-only weights caveat (checked 2026-09-27): input ~95% complete, output ~42%;
  absolute output counts ~2.4x low. Good material for essay topic 2 (trust).
- Flow traversal (hemibrain/FlyWire probabilistic model, threshold 0.3, 256 runs) on the
  type graph, with checks: photoreceptor to L1 2.1 steps, T4 4, ORN to DA1 PN 2, KC 3.3,
  MBON01 4.3; touch reaches motor in median 3.9, vision 7.9. Topic 7; the threshold
  sensitivity question is unasked there.
- Dimorphism: 2,368 neurons in 478 types; dimorphic-to-dimorphic synapses ~13x what
  their shares predict. Topic 11.
- Olfaction: PN to KC to MBON through single Kenyon cells; claw position explains 7 of
  14 departures from type-level prediction. Topic 10.

## Mouse (`vizbench/apps/mouse-connectome/`)

Knox et al. 2019 regional matrices (strength, density, normalized, ipsi ctx) from
download.alleninstitute.org, hashes in `data/sources.json`. Shared viewer in
`vizbench/src/connectome/` (matrix, 3D map, weight vs distance, parallel coords, icicle).
Topics 1, 5, 6.

## Carrying over

- moonshine rules: data real and cited, figures compute at runtime, vendored assets,
  phone width. Vizbench bundles (1-2 MB per page) are about the right size, but essays
  should rebuild their extracts with their own script in moonshine `scripts/`, not
  import vizbench files.
- Vizbench is dashboards with linked views; moonshine essays need one argument per
  figure. Reuse the computations, not the layouts.
- The fly male CNS is already explored in depth, so the series should not lean on it
  alone. C. elegans (302 neurons, both sexes, development) fits in-page computation best.
