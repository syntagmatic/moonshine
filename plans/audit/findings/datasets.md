# Dataset provenance audit (2026-09-24)

Every page that attributes data or numbers to a real source was checked against
that source. Evidence and scripts lived in a session scratchpad and are not kept; this
file records the conclusions. Every item below was fixed unless marked otherwise.

## Inventory (pages embedding data or numbers attributed to a real source)
- PC 02 Iris (150 rows), PC 04 mtcars (32 rows), PC 05 wine (fixed in fce2cc7),
  PC 08 "simulates 303 patients from the distributions of the UCI Heart Disease dataset"
- grateful-dead 01-04 + gd-grammar.json (gdshowsdb)
- japan-earthquakes CSV (USGS, 16,792 M4.5+)
- lithium-ion (Chen 2020 graphite fit, other cited params), bioinformatics 03
  genome coordinates
- Everything else with numbers is simulated and says so (bio 05/06, li-ion 05,
  lattice 03 census is a live simulation, emergence sweeps).

## PC 04 mtcars
All 32 rows x 11 columns match R datasets::mtcars exactly.

## PC 02 Iris
Compared to UCI iris.data and R datasets::iris.
- Rows 35 and 38 differ from UCI but match R/Fisher; UCI's own notes list those
  two rows as UCI errata. Page is correct.
- Row 105 is wrong: page has [6.5,3.0,5.8,1.8,virginica], source is petal width 2.2.
  Line 771 of docs/parallel-coordinates/02-what-crossings-tell-you.html.
  Fixed.

## japan-earthquakes
CSV genuine: all 16,792 events match USGS exactly (lat 24-46, lon 122-150,
M>=4.5, 2000-01-01 to 2025-12-31 00:00; 3 events on Dec 31 missing). Topojson real.
Most prose stats verified. Corrections:
1. 07 EN+JA: S-P gap grows ~12 s per 100 km, not ~7 s (at 6 / 3.5 km/s).
2. 04: "cutoffs M5.2-5.5 predict between 32 and 35" -> 32 and 36 (M5.4 gives 36.4).
3. 01: Izu-Bonin deep events 357 -> 338 (count from the page's own box).
4. 01 subtitle: 25 years -> 26.
5. 06 EN+JA: Miyako run-up 38.9 m outdated, contradicts adjacent ">40 m"; ~40.5 m.
6. 02: Nankai 30-yr probability 70-80% outdated (80% Jan 2025; "60-90% or more" Sep 2025).
7. 05: 39-event historical array credited to NOAA NCEI mixes Japanese catalog
   values (Meio 1498, Meiji-Sanriku 1896, Ansei 1854, Fukui 1948, etc.); 1596
   Keicho-Fushimi absent from NOAA; 8 tsunami flags disagree. Relabel source or
   conform values. Detail: jp/noaa_cmp.txt.
8. 02: hand-drawn plate boundaries: Sagami Trough misplaced, Ryukyu Trench on
   wrong side of the arc, Izu-Bonin Trench missing.

## grateful-dead
All embedded data is real gdshowsdb (commit 2ccd86c) and matches; no arrays to
regenerate. Prose fixes:
1. 02: "June, July and August roughly a third" -> 25.2%; seasonal paragraph
   contradicts its own Fig 5 (peaks Mar/Apr, Jun, Sep/Oct).
2. 03: Drums 36/41 (1976), Space 62/75 (1979), 84/87 (1980) count plays, not
   shows; show counts are 34, 57, 79.
3. 03: says source has only openers/closers and no set split; false for
   gdshowsdb, true only of gd-grammar.json.
4. 02: Nassau counted under New York's 165, but its 42 shows are filed as Uniondale.
5. 02: "70-85 shows per year" in the 1980s; 1982-84 and 1986 had 61, 66, 64, 46.
Minor: year spans vs distinct years (Spectrum, Oakland, Shoreline); "encore" =
source's set 3, worth a caption note.

## lithium-ion
- Graphite curve (lithium-ion/lib/battery-math.js L37-40) matches PyBaMM Chen2020
  exactly. Nit: Chen's electrode is graphite-SiOx.
- LFP: text says 3.42 V (correct), drawn curve sits at 3.37-3.39 V (two edge
  terms pull it down). Flip sign of second edge term or raise centre to 3.46.
- NMC/LFP curves are schematic, not labelled as such next to the real graphite fit.
- 03: SEI "tens to a few hundred nm" -> "a few to a few tens of nm" (own model: 45 nm at 5 y).
- 03: 40-60 kJ/mol activation energy uncited (plausible). Not fixed.
- Rest verified (Tafel, Model 3 pack, IATA 30%, Feng 2018 onsets, Semenov, Plett, 05 charging).

## bioinformatics
- 03 claims GRCh38; chr2 243->242, chr5 181->182 are GRCh37. ABL1 133->130.8 and
  t(9;22) ribbon 132-134 -> 130-132; BRCA1 41->43; PIK3CA 178->179; CDKN2A 21->22.
- 03 prose promises G-banded ideogram; code draws unbanded arms.
- 03 Fig 6 synteny is random; 4 of 18 pairings don't exist (hsa1-mmu6, hsa5-mmu2,
  hsa5-mmu5, hsa6-mmu6). Caption says simulated but prose reads it as real evolution.
  No synthetic footer on 03; Fig 5 caption doesn't say simulated.
- 08 forest plot: real consortium names (TCGA, METABRIC, PCAWG, Hartwig, ICGC,
  TARGET) with invented years/n/effects ("TCGA Ovarian 2014" doesn't exist).
  Same pattern as PC 05 wine. Rename rows generically, caption "simulated".
- 02 (labelled simulated) uses GRCh37 EGFR coords with wrong neighbour genes/strands.
- 01 TP53 hotspots/domains correct; 04-07 clean.

## PC 08 heart disease
The figure simulated 303 patients from made-up class distributions and credited
the UCI dataset. Replaced with the real Cleveland file (processed.cleveland.data),
299 of 303 rows (4 lack a vessel count). On the real data, vessel count
(d=1.04), oldpeak (0.94) and max HR (-0.91) still separate best, so the Cohen's d
ordering holds. Two prose claims were corrected: vessel count is 0 for 81% of
healthy patients but 33% of disease patients (not "spreads across 1-3"), and the
young-vs-old paragraph now reports what the data shows (max HR separates far
better under 50 than over 60; oldpeak is flat with age).

## How the fixes were made
- PC 02: Iris row 105 petal width 1.8 -> 2.2.
- PC 08: real Cleveland data replaces the simulation; prose corrected.
- japan 05: now 37 events with magnitude, deaths and tsunami flag from NOAA NCEI,
  each value's NOAA record id in a code comment. 1596 Keicho-Fushimi (not in
  NOAA) and 1662 Kanbun (no NOAA magnitude) dropped; 684 has only a death range
  and is left out of the correlation (now 0.29). Several inland quakes now show
  a tsunami because NOAA links one; the intro says "whether NOAA records a tsunami".
- japan 02: boundaries redrawn from Bird (2003) PB2002, clipped to the map; Kuril
  and Izu-Bonin trenches added. The PB2002 Sagami segment that crosses the Izu
  peninsula on land is omitted, leaving a small gap. Japan Trench label still
  overlaps some offshore dots.
- bio 03: GRCh38 throughout; real G-bands from the UCSC cytoband file; Fig 6 is
  real UCSC hg38 netMm39 top-level fills (blocks >= 3 Mb, human chr1-6); every
  caption says what is real and what is simulated.
- bio 02: real Ensembl GRCh38 gene models and UCSC CpG islands around EGFR
  (CCT6A dropped, outside window); strand arrows fixed; expression and
  conservation remain simulated and captioned so.
- bio 08: forest-plot rows renamed Study A-H; captions say simulated.
- li-ion: LFP curve shifted up 0.04 V to sit at 3.42 V; NMC/LFP captioned as
  hand-drawn, graphite as the Chen 2020 graphite-SiOx fit; SEI thickness fixed.
- GD 02/03: prose corrected as listed above; data untouched.

## Lesson for the skill (Phase 5)
Batch-generated pages attached invented numbers to real names three times
(PC 05 wine, PC 08 heart, bio 08 consortia) and mixed sources or assemblies
twice (japan 05, bio 03). Real public data was small enough to embed in every
case. The skill should say: embed the real file or label the data simulated
in the caption, never "simulated from the distributions of" a named dataset.
