# Claims: Japan Earthquakes series

Built 2026-09-25. Every checkable claim in the English prose, captions, figure
annotations and tooltips of the seven articles and the series index, each checked
this session. Articles are named by slug (01-where ... 07-early-warning, idx for the
series index), not by path, because the pages are moving from `NN-slug/index.html`
to flat `NN-slug.html`. Paragraph keys in backticks are the `data-i18n` keys, which
survive the move; line numbers would not.

How each claim is known:

- **Computed (CSV)**: recomputed this session in Python from
  `shared/data/earthquakes.csv` (USGS catalog, M4.5+, 2000-2025, 24-46N, 122-150E),
  value shown.
- **Computed (page)**: the page calculates it at runtime from the data or model; the
  same calculation was reproduced in Python and the value is shown.
- **Sourced**: read in a named source this session (NOAA NCEI hazard API, USGS, JMA,
  a paper or official page).
- **Derived**: worked by hand from the stated formula.

`[x]` verified, `[ ]` wrong (right value given), `[?]` unverifiable or a
figure/prose mismatch that needs rewording. Nothing under `docs/` was changed. The
Python scripts were session scratch and not kept; each entry says what was run.

The claims a previous audit called verified (16,792 rows; Tohoku 86%; 344 >= M6;
33 >= M7; 522 below 300 km; deepest ~680 km; March 2011 1,980; 30 days post-Tohoku
2,081; 2001-2010 ~1/day; Aki b at Mc 4.5 ~1.21 predicting ~16; Mc 5.5 b ~1.00; 37
historical quakes; rank correlation 0.29; S-P ~12 s per 100 km; 797 km/h at 5000 m)
were all recomputed from scratch. All hold, with one caveat on the first: the 16,792
rows include 5 North Korean nuclear tests (see Series-wide).

## Fixes applied (2026-09-25, after this ledger was built)

The `[ ]` entries below record the pages as they were when checked. These were then
fixed in docs/ (English and Japanese):

- Nuclear tests: every page's CSV loader now drops rows whose `type` is not
  `earthquake` (the CSV itself is the unmodified USGS export). Prose counts are now
  16,787 and 3,701. The Mc 4.5 prediction became 15.5, so 04 `p3` now says "about 15".
  No b-value, the 86% share, or other figure changes at its stated precision.
- idx `shindo_intro`: now says the card glyphs use the shindo colors and the maps
  color by depth, red shallow and blue deep.
- 03 sparkline: the y axis is now linear, so the Tohoku step is 86% of the height and
  `p5` holds; the caption and aria label say linear.
- 05: 1896 Meiji-Sanriku Ms is 7.2 in `p6` and the tooltip.
- 06: observed arrivals are now Hilo 7h 56m and Crescent City 9h 47m (NOAA). The caption
  says about 10% slow at 4,000 m and within about 3% at 5,000 m. The map tooltip distance
  is the great-circle distance. The "bunch up" sentence is gone. `p8` gives Green's law
  as about 5-8x, and the shoaling figure's "40 m" is labelled as run-up.
  `insight_30min` says the trench is about 200 km off, and the rupture began 70 km off.
- 02 Hoei is now "estimated M8.4 to 8.6", which agrees with 05's NOAA 8.4.

The `[?]` items still stand as they were (07's timeline presents modeled times, the
06 Hokkaido 1.0 h label, and the Sanriku "highest risk" superlative).

## Enrichment pass (2026-09-30)

A graphics audit, then one fix-and-enrich pass per article (commits 17319d0, 3e6f9a3,
42109bd, 9b35f02, e0e105e, 1f62eea, 6b1de7a; shared depth ramp 0561a0e). Each article
gained one headline figure. Entries below supersede the rows further down where they
disagree; every new number is computed in-page.

- **Series-wide**: one depth ramp (shared/depth.js). The site notice is translated in
  Japanese mode. Place names such as "?funato" are how USGS itself serves older events
  (the ComCat CSV carries a literal `?` for long vowels); the CSV is left as the source
  gives it.
- **01**: 17 of 33 M7+ lie along the trench, carrying 93% of M7+ energy (the old 18
  counted a 2003 Tokachi-oki event on the Kuril Trench). Typical year about 530 (median [superseded 2026-10-01, see Quality pass]
  530.5). The old claim that the timeline showed the steady deep rate was false; the new [superseded 2026-10-01, see Quality pass]
  heatmap shows it: events above 70 km put 13.5% in March 2011 alone, monthly variance
  291x the mean; the 300+ km band has none extra, variance 1.3x the mean, drifting from
  23 to 17 a year. Catalog default depths (33 km in 2000-2003, 10 km later) make 30 km
  splits unreliable. The shallow rate rose about 65% after 2011, which overlaps a
  magnitude-type change (mww 1 of 4,347 before, 1,150 of 8,686 after).
- **02**: deepest event 683.4 km (was "about 680"); the three below 660 km are all 2015
  Bonin. Transect D (28.5N): slab dip about 75 deg. B-B' Pacific-slab events west of [superseded 2026-10-01, see Quality pass]
  Tokyo are 258-349 km (was 300-350). C-C' runs western Honshu to Shikoku, not Kyushu
  to Kii. B-B' cannot separate its two slabs at M4.5+; the text says so.
- **03**: M6+ is 343 (344 included the 2017 nuclear test). Aftershock counts exclude
  the mainshock: 530 in 24 h, 2,080 in 30 days, 68x background (1.01/day,
  2001-2010). Tokachi-oki is M8.16 in the catalog, so Tohoku releases 25.7x its energy
  (22x is the rounded M8.2). Omori-Utsu over the Tohoku box: p = 0.96, c = 0.42 d; the
  rate falls below background after 7.1 years (5 to 10.6 depending on the box), so [superseded 2026-10-01, see Quality pass]
  "weeks or months" became "years".
- **04**: the regions went from 8 boxes covering 75.4% to 9 covering 99.0%. Chubu's
  largest is M7.5 (Noto 2024), not M6.2. Tohoku-Kanto b gap 3.8 se if independent, 2.9
  under a year-block bootstrap (was "about four"). M6+ per year: 13.10 predicted, 13.19
  observed; 2011 had 84 against a 7-21 band; 4 of 26 years fall outside. Mainshocks
  (Gardner-Knopoff) have dispersion 1.95 against 16.9 for all events, "much closer to
  chance", not Poisson. Ten-year windows forecast 0.64-2.20 M7+ a year.
- **05**: the selection is now every NOAA Japan record with more than 100 deaths: 88 of
  429, adding 1792 Unzen and dropping 1741 (NOAA lists it as tsunami only). The rank
  correlation is 0.27 over the 89 records with a magnitude and at least 10 deaths
  (0.20 over the timeline), not 0.29. p14: 10 M8+ Sanriku events. `[?]` 1982
  Urakawa-oki: NOAA gives 110 deaths, while Japanese records list 167 injured and no
  deaths; NOAA is kept and flagged. NOAA tolls differ from Japanese catalogues for
  1751, 1766, 1793, 1828, 1854 Iga-Ueno, 1872, 1925 and 1930; NOAA is kept. Before 1600
  the record holds 8 M8+ against about 92 expected at the 20th-century rate.
- **06**: Kamaishi first arrival 0h 04m (NOAA gauge), largest wave 0h 35m (was
  "~0h 30m"). Tokyo Bay 1h 54m (Harumi), not "~1h"; the Sapporo claim is removed.
  4,000 m speed about 710 km/h (was 720). Shoaling speeds 713/159/36 km/h,
  wavelengths about 45 km and 10 km; Green's law growth about 4.5x. Hawaii about
  6,000 km (was 6,200). The old map rings reached Hilo about 1.2 h late and California
  3.4 h late (degree circles). The 2011 gauges: DART median 820 km/h (about 5,300 m);
  far tide gauges a median 71 min behind the 5,000 m line; 26 of 142 within 3%.
- **07**: Tokyo's "44 s" is its S-P gap; its model warning is 86 s, Sendai's 18 s (the [superseded 2026-10-01, see Quality pass]
  old "Sendai 16 s" was also an S-P gap). The model alert comes 20.1 s after rupture,
  6.1 s after first detection (the real one was 8.6 s). Noto alert 8.7 s, not 45.8 s
  (no Japan Sea stations before). The `[?]` rows for the timeline and actions captions
  are resolved: both now say modeled or illustrative. The range plot: 32 M6.5+ quakes;
  median no-warning share 31% near land and 29% offshore at 6 s processing (6% and 100% [superseded 2026-10-01, see Quality pass]
  near land at 3 s and 9 s); Tohoku 0%, median 41 s. The audit's "100% inland" held
  only down to M5. Point-source shaking biases the no-warning share high, not low: a
  line source lowered it in every row (near-land median 31% to 19%).

## 06 tsunami-source figure (2026-09-30)

The step cartoon under "How a Tsunami Forms" became a model (shared/06-tsunami-source.js,
checks in tests/japan-earthquakes.html: Okada matches cutde to 5e-11 m per m of slip at 45
points; Kajiura volume; shallow-water volume and speed). Profile: ETOPO1 via ERDDAP
etopo180, scripts/japan-06-bathy-profile.mjs, azimuth 101.5 deg (fitted trench strike
11.5 deg + 90) through the USGS epicentre 38.297 N 142.373 E; trench 7,443 m at 144 km;
coast 79 km west of the epicentre. Observations verified by a subagent from primary
sources (full table in temp/japan-audit/06-source-obs.md, gitignored):

- [x] GSI GEONET Oshika (960550), 38.301 N 141.501 E: about 5.3 m ESE, about 1.2 m down
  (GSI crustal-deformation pages).
- [x] MYGI (JCG GPS-acoustic), 38.083 N 142.916 E, about 1,700 m: about 24 m ESE, nearly
  3 m up (Sato et al. 2011, Science 332:1395).
- [x] MYGW, 38.150 N 142.433 E: about 15 m ESE, about 0.8 m down (JCG 2011 report Fig. 6,
  read off a figure).
- [x] Near-trench seafloor, 40 km band next to the trench on the 38 N track: about 50 m
  ESE and about 10 m up (Fujiwara et al. 2011, Science, abstract; "7-10 m" is the press
  release).
- [x] Miyagi-Central GPS buoy (NOWPHAS 801G), 38.2325 N 141.6836 E, 144 m, about 19 km off
  the line: peak 4.83 m datum-corrected (5.78 m raw) at 15:16 JST. The Kamaishi buoy's
  famous 6.7 m is the raw value; corrected 6.13 m.
- [x] Peak near-trench slip in published models: 55 m (USGS FFM file; its metadata field
  "19.2" is wrong), 57 m (Maeda 2011), about 62 m (Sun 2017), 69 m (Satake 2013).
- [x] USGS W-phase dip 14 deg, FFM 15 deg at the hypocentre; the page's plane is 10 deg
  from the trench, which puts the catalog hypocentre (29 km) on the plane. Not claimed.
- The 2011 preset (60 m at the trench tapering to 15 m, 180 km down dip, 10 deg, 210 km
  long, Mw 9.10) is a grid-search best fit to the marks above
  (temp/japan-audit/f06src/fit.cjs). Fitted vs measured, up/east m: Oshika -2.3/8 vs
  -1.2/5.3; MYGW -1.9/17 vs -0.8/14; MYGI 1.8/25 vs 3/22; trench band 10.4/38 vs 10/50.
  `p3` says the verticals miss by about a meter.
- Model at the Miyagi-Central buoy depth (first cell >= 140 m): 11.0 m at 33.7 min against
  4.83 m at about 30 min; `p3b` says "more than twice ... within a few minutes". Presets at
  that gauge: even slip 9.9 m at 52 min; farther down 14.7 m at 27 min.
- `p3`: "5 to 8 meters" of uplift replaced by the measured values above.

## 06 map-view source, "The Sanriku Coast" (2026-10-01)

New figure under "The Sanriku Coast": the cross-section's model on a map. Library additions
in shared/06-tsunami-source.js (seafloorDisplacementMap, initialSurfaceMap with a separable
Kajiura filter, createMapSim/simulateMap: linear shallow water on the sphere, C grid, walls
at the coast below 10 m, 16-cell sponge), five new checks in tests/japan-earthquakes.html
(12/12). Grid: ETOPO1 1 arc-minute, 35.6-41.2 N, 140.3-146.0 E,
scripts/japan-06-bathy-grid.mjs. Fit: scripts/japan-06-source-fit.mjs writes
shared/data/06-source-fit.json; the page recomputes everything from its fault.

Observations (verified by a subagent from Kawai, Satoh, Kawaguchi, Seki 2011, Report of PARI
50(4), Tables 3.1 and 3.5; full table in temp/japan-audit/06-buoy-obs.md, gitignored):

- [x] Six NOWPHAS GPS buoys, peak corrected / raw: Iwate North 807G (40.1167 N 142.0667 E,
  125 m) 4.02 raw only, 15:19; Iwate Central 804G (39.6272, 142.1867, 200 m) 6.07/6.30,
  15:12; Iwate South 802G (39.2586, 142.0969, 204 m) 6.13/6.67, 15:12; Miyagi North 803G
  (38.8578, 141.8944, 160 m) 5.02/5.68, 15:14; Miyagi Central 801G (38.2325, 141.6836,
  144 m) 4.83/5.78, 15:16; Fukushima 806G (36.9714, 141.1856, 137 m) 2.14/2.62, 15:16 (its
  maximum is the second wave). Aomori East 805G was offline. None of the records is cut.
- [L] The traces drawn are digitized by the subagent from the vector paths of Kawai Fig. 4.2,
  each minute 14:48-15:25, good to about 0.15 m and half a minute; drawn only, not fitted.
  Corrected by subtracting PARI's subsidence; Iwate North left raw, as PARI does.
- [x] TM1 seafloor pressure gauge peaked above 5 m (Maeda et al. 2011); site from Satake
  et al. 2013 Table 1.
- [L] DART 21418: 1.84 m at 33 min (06:19 UTC), computed by the subagent from the raw NDBC
  file (ndbc.noaa.gov/data/historical/dart/21418t2011.txt.gz); NOAA's own "1.8 m" was only
  seen in a search snippet.
- [x] JCG KAMS, KAMN, FUKU verticals (1.5, 1.5, 0.9 m up) and Tohoku Univ. GJT3, GJT4
  (about 5 and 3.5 m up, preliminary) from temp/japan-audit/06-source-obs.md rows 2c-3b.

Findings:

- The cross-section's source on the map (210 km centred on the line, 60 to 15 m) gives
  10.9 m at Miyagi Central (2.26x), 3.6 at Iwate Central (-41%), 3.0 at Fukushima (+42%).
  Along-coast spreading barely changes the overshoot (1D gave 10.5 m at the same spot), so
  the old `p3b` and caption claim ("its wave cannot spread along the coast, so its heights
  near shore are upper bounds") was wrong as an explanation; both now say the source is
  the cause and point to the map.
- Fit (four numbers, 20 km steps, 63,960 candidates; score in the script header): a0 -200,
  a1 +80 km along strike from the line's trench point, so 280 km; slip 40 m at the top
  falling to 10 m; Mw 9.07. Model vs measured peak: Iwate N 4.20/4.02 (+5%), Iwate C
  5.60/6.07 (-8%), Iwate S 6.94/6.13 (+13%), Miyagi N 7.02/5.02 (+40%), Miyagi C
  6.02/4.83 (+25%), Fukushima 1.80/2.14 (-16%). Iwate crests 2.5 min early. TM1 3.0 vs >5.
  Verticals: Oshika -1.5/-1.2, MYGW -1.3/-0.8, MYGI 1.1/3, KAMS 2.1/1.5, KAMN 2.2/1.5,
  FUKU -0.4/0.9, GJT3 3.7/5, GJT4 0.3/3.5, trench band 6.0/10.
- A north/south split of the slip (5 parameters) improves the score only 36 to 34 and
  pushes slip south; not used. Adding the slope term fits no better (L 300, Mw 9.15).
- DART 21418, run on a wider 1' grid (to 149.5 E): 2.41 m at 27.8 min vs 1.84 at 32.6.
  `p_coast2` says 31 percent high and 5 minutes early, and names dispersion and the
  instant rupture as the missing pieces (not tested here).
- Resolution: the buoys are not converged. 2' to 1' raises them about 13%, 1' to 0.5'
  (bilinear upsample of ETOPO1) another 8% (Miyagi C 5.5, 6.3, 6.9 for the 2' fit's
  source). The fit is done at 1', the page's grid, so it absorbs this; a finer grid would
  ask for a weaker source. Not stated on the page.

## Quality pass (2026-10-01)

Essays 01-05 and 07 raised to the level of 06: each now has a shared library with checks
against an independent reference, external observations or published values in
shared/data/, and prose that says where the model misses (commits be4ef5a 02, e39f7cb 03,
920d0e9 07, 4a81694 05, 33f8f98 01, 9c119d0 04; test registry 9287aa6). Rows below
supersede the per-article rows above where they disagree; the old rows are marked in
place. Per-essay agent reports: temp/japan-audit/qfix-0N.md (gitignored).

Series-wide finding: the catalog records M4.5-4.9 more completely after about 2010
(M4.5-4.9 per M5+ event 2.5 before 2010 vs 4.4 from 2012, whole catalog; M5+ per year
flat at 107 vs 115). Completeness.eraContrast puts the lowest stable cutoff at M5.0.
Fits and rates at M5+ where it matters; maps keep every quake; each page says why once.

### 01 Where

- [x] PB2002 plate boundaries, Bird 2003 G-cubed 4(3):1027 (fetched; sha in 01-plates.json).
- [x] GCMT: 943 solutions Mw>=5.5, 2000-2025 (scripts/japan-01-plates.mjs; sha prefixes in 01-gcmt.json).
- [x] 72% of 16,787 quakes within 30 km of a Slab2 surface vs 13% for a seeded random-position control; free depths 79% (control 12%), default depths (34% of events) 59%; holdout 2018 on 80% vs 79% for 2000-2016; deep (300+) 87% within 50 km, median 34 km, 33% within 30 km (page, from the csv and slab2.json).
- [x] 17 M7+ off Tohoku: 13 on the plate, 4 seaward (outer rise). Closes the old [?] on p7.
- [x] GCMT mechanism shares: 854 of 1,095 M5.5+ matched (60 s, 100 km); on the plate 81% thrust (n=500), 68% within 30 deg of the slab thrust; above the plate 29% thrust; seaward 72% normal (70% before the 2026-10-02 side-of-trench rule); deep 50% oblique; since 2018 88% of 125 on-plate are thrust (Frohlich-Apperson plunge limits; Kagan 1991 angle checked vs scipy).
- [x] Nankai: nine great earthquakes since 684; since 1361 gaps 91-147, mean 117, last 1946 (from 05-history.json via NOAA ids). Replaces "roughly every 100-150 years".
- [x] Deep (300+) steadiness: variance/mean 1.08 at M5+ (chi-square p 0.17, consistent with steady), 1.26 at M4.5 (p 0.001); deep rate 23 to 17 a year at M4.5 vs 7.5 to 6.3 at M5+ (the M4.5 excess is partly the catalog). Replaces the old "1.3x" row.
- [x] Shallow rate: 92 to 97 a year at M5+; the old "320 to 530" is the catalog's M4.5 recording.
- [x] "Where stress is building" replaced: Nankai box 31.5-34.5N 132-137.5E, <60 km: 37 M5+ in 26 years vs 705 in a same-size box off Tohoku.
- [L] Slab2 uses some GCMT thrusts and relocated hypocentres as input (Hayes 2018 methods not read; stated generically).
- [L] Locked-fault silence at Nankai ("can mean"; coupling studies such as Yokota et al. 2016, none read).
- [L] 2015 Bonin M7.8 outside the main slab in the literature (Obayashi 2017; Ye 2016); the page states only the distance.

Still misses: 2015 M7.8 at 664 km is 169 km from the slab; Noto 2024 and Kumamoto 2016 are crustal (about 215 and 176 km); 2,133 events (13%) more than 20 km above a slab; default depths; Slab2 circularity. Seaward vs back-arc was a heuristic until 2026-10-02 (see Follow-ups). The time brush does not filter the mechanism panel. The ECDF null uses one seed.

### 02 Plates

- [x] Slab2 (Hayes et al. 2018, Science 362:58; doi 10.5066/F7PV6JNV), ScienceBase 5aa1b00ee4b0b1c392e86467; kur 5aa4060de4b0b1c392eaaee2, izu 5aa3185ee4b0b1c392ea3f0d, ryu 5aa40aafe4b0b1c392eaaefa; versions 02.24.18 (kur, izu), 02.26.18 (ryu); fetch date and sha256 in slab2.json.
- [x] 85.5% (1,927 of 2,254) of events at 70 km or deeper lie 0-50 km below the Slab2 top (3D distance to the triangulated surface); by transect A 98%, B 96%, D 76%, C 38%; median offset by depth band 20/21/33/40 km.
- [x] Dips: Pacific apparent 22-29 deg on A; D apparent 62 deg (100-400 km), true dip peaks 69 deg. The old "dip about 75" is retracted: it came from dots 36-42 km inside the slab.
- [x] Age does not set the angle: Pacific 28 vs 62 deg at 134 vs 143 Ma (EarthByte 2020 ages; in slab2.json `published`, from the q-02 prototype, not recomputed by script).
- [x] Pacific plate rate 8.9 cm/yr (PB2002 poles, trench-normal 88.9 mm/yr).
- [x] Nankai plate age 17-30 Ma (EarthByte 2020) replaces "15 to 50 Ma"; 50 Ma is the West Philippine Basin at the Ryukyu Trench.
- [x] Volcano depth above the slab (GVP Holocene volcanoes, WFS GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes): median 109 km under 40 NE Japan arc volcanoes, 88 km under the front (84-130), Izu 106, Kuril 97, Ogasawara 134.
- [x] 2015 Bonin events 169-182 km from the nearest Slab2 point; transect C: 15 of 17 events nearest the Philippine Sea slab lie above its top (median 10 km); 2023 M4.9 at 645 km 76 km out. Kanto 376 events >=30 km: 239 Pacific only, 44 Philippine Sea only, 25 both, 68 neither; Slab2's Philippine Sea slab ends at 139.9E.
- [x] Tohoku: seafloor moved about 50 m (Fujiwara et al. 2011), peak slip 55-69 m (published models, Part 6). Supersedes "slip as much as 50 meters".
- [x] HERP 2025: SSD-BPT 60-90% or more and BPT case III 20-50% given side by side, neither preferred (nankai_gaiyou2_3.pdf pp.3, 9; read by 05). Supersedes "60-90% main model, 20-50% alternative" (old 02 `p8`).
- [L] "Arc volcanoes stand over slab roughly 100 km deep" (Syracuse and Abers 2006; England et al. 2004): exact means not verified.
- [L] "Young, warm slab stops breaking sooner" (thermal parameter, Kirby et al. 1996): stated as expected, untested.
- [L] A Japan-specific model (Hirose et al. 2008; Iwasaki et al. 2015) would cover eastern Kanto; availability unchecked.
- [L] Bonin deep events vs a slab hanging through 660 km (published picture): not checked.
- [L] Which parts of Slab2 use hypocentres and CMTs (circularity statement): not confirmed in Hayes et al. 2018.

Still misses: 2015 Bonin events, transect C's events above its top (Slab2 too deep, ComCat depths too shallow, or the degree-space projection: not separated), the 2023 Korea-Russia event, circularity; Slab2 `thk` unused; no Philippine Sea slab under eastern Kanto; supplement distances are point-based. Ages and rates not recomputed by a script.

### 03 When

- [x] M4.5-4.9 per M5+ event 2.5 (2000-2009) vs 4.4 (2012-2025); M5+ 107 vs 115 a year (page, from earthquakes.csv).
- [x] Box M5+ per year 28 (2017-2024) vs 30 (2001-2010). Supersedes "7.1 years" and "1.3x its pre-2011 rate in 2023-24", which were reporting changes at M4.5.
- [x] Helmstetter, Kagan & Jackson 2006, BSSA 96:90-106: Mc(t) = Mmain - 4.5 - 0.75 log10 t (6.10 / 5.35 / 4.50 computed; 4.5 reached at 1.36 d).
- [x] Jalilian 2019, J. Stat. Softw. 88(CS1) pp. 29-32: beta 1.9734 (b 0.857), mu 0.5505, c 0.0296 d (43 min), alpha 1.6579, p 1.1534, background probability mean 0.5452 (read from the PDF; stored with citation in 03-etas-fit.json).
- [x] Ogata's SAPP (CRAN 1.0.9-4) on main2003JUL26: exact likelihoods and optima in the data file; the JS matches (scripts/japan-03-sapp-fixture.R).
- [x] ETAS fit, box M5.0: mu 15.0 a year, c 8 min (ln c se 0.31), alpha 2.16, p 1.066 +- 0.016, background 26% (M5.5 32%, M4.5 7%), branching ratio 1.00, KS D 0.047. Supersedes "c = 0.42 d, p = 0.96" (plain Omori c is 0.26, 0.08, 0.03 d at M4.5, 5.0, 5.5: mostly the catalog's incomplete first hours).
- [x] Tohoku-descent share of box M5+ events by year: 69, 46, 34, 18% for 2012, 14, 16, 24; direct offspring 31% of expected events after day 1 (page).
- [x] Bath's law: largest aftershock in the box M7.9 at 29 min, dM 1.20; model median 1.11 (16-84%: 0.54-1.51, 400 seeded runs).
- [x] Far-field triggering: M6.2 near Nagano-Niigata and M6.2 off Akita within 15 h, M6.0 near Fuji at 4 d (catalog, regional windows).
- [x] Row correction: 04's Tohoku box holds 4,515 events, not 4,584 (old 03 `p7` row).
- [L] Bath (1965) Tectonophysics 2:483-514, dM 1.2: standard, not re-read.
- [L] Utsu, Ogata & Matsu'ura 1995 p range: no longer cited.
- [L] Seif et al. 2017 on supercritical bias: "known bias" in prose, not read; soften or verify.
- [L] Only M7+ events in the box get a scored-out window; other large shocks are not gapped.

Still misses: branching ratio 1.00 (critical; 0.61 to 2025); M4.5 fit has p = 0.995 and reads the post-2010 rise as triggering; KS fails modestly at M5.0 (passes at M5.5); time-only model (no space: Nagano/Akita/Fuji and the 42N edge not modeled); c poorly determined (factor 1.4 either way). D5 energy units, the min-mag slider not driving Fig 2, spatial ETAS: not done.

### 04 Gutenberg-Richter

- [x] USGS FDSN 1900-1999 M6.5+ in 122-150E 24-46N: 401 earthquakes, 327 in 1920-99 (scripts/japan-04-century.mjs).
- [x] HERP 2026-01-01 summary (ichiran.pdf, sha256 df8f77cd...): p.34 Kuril 17th-century type M8.8+, mean interval 340-380 yr, 30-yr 7-40%, 10-yr 2-10%; Japan Trench Tohoku-oki type M9.0, 550-600 yr, 30-yr ほぼ0%; p.35 Sagami M8 class 180-590 yr; p.36 pre-2011 reference row 4-6 / 10-20 / 20-30%; notes 1 (Poisson vs BPT) and 4 (340-380 from tsunami deposits).
- [x] b-stability Mc 5.2 (seismostats 1.0.1 and 04-gr.js). Cao & Gao 2002 / Woessner & Wiemer 2005 as method [L: not re-read].
- [x] Gardner-Knopoff windows = OpenQuake hmtk GardnerKnopoffWindow (53.2 km / 499 d at M6; 128.7 km / 1,072 d at M9.1).
- [x] Era change in M4.5-4.9 recording (Completeness.eraContrast, 2000-09 vs 2013-25): 3.5 vs 5.3 per M5+ event, M5+ 107 vs 112 a year, cutoff M5.0; b at M4.5 1.04 vs 1.36; above M5.2 0.96 vs 1.10.
- [x] 26-year fit (b 1.02, M5.2+) vs USGS 1920-99: M7+ 100 predicted (84-119) vs 125; M8+ 9.5 vs 12; M8.5+ 2.9 vs 1; M9 0.9 vs 0. Mainshock b 0.82 predicts 5.2 M8.5+ in 80 years vs 1. Tapered law 2000-25 at M5.2+: corner M9.35, 95% lower bound M8.7, no upper bound.
- [x] HERP gives per-source mean intervals, not a box-wide rate, and its 30-year numbers are renewal-conditional: the old "M8.8+ once per 221 yr" is only a floor (210-233 yr). Tapered law reaches the Japan Trench M9 interval (550-600 yr) at corner M8.77-8.79; box M8.8+ then every 137-145 yr vs 55 yr for the plain line.
- [x] 2011 window miss: 19 mainshocks M6+ vs band 2-13; 15 struck after the M9.1 within 500 km (135-476 km), incl. M7.9 29 min later (page).
- [x] Reference checks: b to 1e-6 at Mc 4.5-6.0 and all test statistics to 1e-10 vs seismostats; GK flags vs hmtk 99.4% on 348 M5.5+ events (98.3% on all 16,787, ties); tapered survival vs scipy 1e-9. Utsu b reads about 0.5% below exact ML (1.021 vs 1.026 at M5.2).
- [L] Mizrahi, Nandan & Wiemer 2021, SRL 92:2333: declustering lowers b by up to 30% (from the q-04 reading; the in-page ETAS check confirms the direction: all 1.01, mainshocks 0.92).
- [L] Kagan 2002 tapered-law form (checked vs scipy; formula from memory). Bird & Kagan 2004 and Kagan & Jackson 2013 not cited.
- [L] Magnitude scatter 0.2 inflating counts by 1.12 (arithmetic; ISC-GEM uncertainties not checked).
- [L] Early-era events named in p14 (Kanto 1923, Sanriku 1933, Tonankai/Nankai 1944-46, Tokachi 1952, Kuril 1958/1963) not matched to rows of 04-century.json.
- [L] "G-R enters only for background earthquakes" (J-SHIS/HERP): left out of the prose.
- The stale 04 section further down (16,792 events, eight boxes, Tohoku 4,584 and the rest) is superseded where it conflicts with the 2026-09-30 enrichment row and this section; not rewritten row by row.

Still misses: the plain law is low by about a quarter at M7-7.5 and high at M8.5+ by a factor of 3 (era split and magnitude scatter are only candidate explanations); mainshock b cannot be extrapolated; 26 years cannot bound the largest earthquake. Fig 3's Poisson range for the held-out count not built; GK ties vs hmtk not reconciled.

### 05 History

- [x] HERP 2025 summary (jishin.go.jp/main/chousa/25sep_nankai/nankai_gaiyou2_3.pdf, sha256 e63c65ac...) p.7: nine earthquakes 684.9, 887.7, 1098.1, 1361.6, 1498.7, 1605.1, 1707.8, 1855.0, 1946.0; cases I-V. NOAA ids 162; 262; 375+7381; 556; 7383; 833; 1178; 1969+1971; 3791+3845 reproduce them to 0.05 yr (script check).
- [x] Same PDF p.4: Murotsu uplift Hoei 1.83 +- 0.51 m, Ansei 1.13 +- 0.52 m, Showa 1.02 +- 0.06 m (Hashimoto et al. 2024).
- [x] Same PDF pp.2, 3, 9, 10: 30-year probabilities: time-predictable 60-70% (2013-01), 70% (2014), 70-80% (2018), about 80% (2025-01); BPT cases III-V 10-30% (2013-01); 2025 SSD-BPT 60-90% or more (70% credible interval; 94.5%+ written 90%程度以上), BPT case III 20-50%; mu 88.2 yr, alpha 0.20 and 0.24; HERP does not rank the two models and advises stressing the higher value.
- [x] HERP 2019 Japan Trench (jishin.go.jp/main/chousa/kaikou_pdf/japan_trench.pdf, sha256 89dc82c5...): five deposit events in 3,000 years, Jogan Mw 8.3-8.6 or more, "やや小さい" than M9.0, mean interval about 550-600 yr, alpha 0.2-0.3, 30-year probability ほぼ0%, previous event 1454 or 1611. Supersedes "comparable magnitude" and "due" in p13.
- [x] Page-computed (library plus script): case fits and P30 at 2025 (I 17%, II 8%, III 37%, IV 18%); time-predictable slope 80 yr/m, Showa predicts 82 yr; Monte Carlo 61-97% (mean 81%); case III grid posterior 19-48%; Japan Trench the day before 2011: 12-23% (1454), 1-6% (1611). The history alone moves BPT 8 to 37%; the model gap (BPT case III 37% vs time-predictable about 80%) is bigger. Library checks vs scipy to 7e-16 (cdf), 2e-8 (MLE).
- [x] Hand-typed NOAA numbers (p5, p6, p7, c3, c4, c8; 1964 deaths, 1293, M of Noto) now spans from the JSON; 916 derived as 1600 - 684.
- [L] Deposit ages for the two older Japan Trench events taken from HERP's century wording (Sawai et al. 2012 not read).
- [L] 1454 Kyotoku has no NOAA record; 1454.5 is a placeholder.
- [L] How HERP derives 88.2 yr from its earlier uplifts (our through-origin fit gives 80.5 yr/m).
- [L] 2014 and 2018 time-predictable values read from p.9's version table (2.5 points of slack in the check).
- [L] 1944/46 Tokai and Nankai halves "up to two years apart".
- [L] Showa uplift "much better documented" is inferred from the sd (0.06), not read.

Still misses: HERP's own Bayesian SSD-BPT (the Monte Carlo is a stand-in; the grid posterior agrees to 3 points); mu 88.2 taken as given; Keicho and neighbouring segments not modeled; the Trench counterfactual rests on century-range ages. The browser test page leaks a stale `var data` (tests/ not editable by the pass).

### 07 Early warning

Source for every JMA row: JMA 緊急地震速報（警報）発表状況, https://www.data.jma.go.jp/eew/data/nc/pub_hist/, page of the event id (`events[].page` in 07-eew-jma.json).

- [x] JMA2001 P and S travel-time table and velocity model (tjma2001.zip, vjma2001.zip, data.jma.go.jp/eqev/data/bulletin/catalog/appendix/trtime/), trimmed to depth <= 700 km, distance <= 1500 km. A ray tracer through vjma2001 reproduces the table to 0.065 s on 108 arrivals; held-out nodes to 0.18 s worst case.
- [x] Tokyo S-P 39 s, S 91.8 s, P 52.6 s from the USGS epicenter (373 km, 24 km deep); ideal-alert warning 70 s on the model, 63.8 s from JMA's hypocenter and real warning. Supersedes 44.4 s (constant speeds) and 86 s.
- [x] Regional S gain about 24 s per 100 km (S(20 km deep, 300 km) - S(100 km))/2. Supersedes "29 s"; the old "12 s per 100 km" S-P row is dropped from the prose.
- [x] JMA 2011-03-11 record (pub_hist 20110311144640): origin 14:46:18.1, 24 km, M9.0, detection 14:46:40.2 (+22.1 s), reports 1-15 at M4.3, 5.9, 6.8, 7.2 (the warning, report 4, 14:46:48.8, +30.7 s), 6.3, 6.6, 6.6, 7.2, 7.6, 7.7, 7.7, 7.9, 8.0, 8.1, 8.1. The catalog (USGS) origin is 6.0 s later than JMA's.
- [x] Correction: "the initial estimate was M7.2" is wrong; M7.2 was the fourth report, the warning; the first report was M4.3. Supersedes the old row "Initial estimate M7.2".
- [x] First report 3.2 to 7.9 s after first detection, median 4.4 s (13 events with a magnitude on report 1). Replaces "3-5 s" and "3-8 s".
- [x] Fitted processing delay 7.36 s (IQR 5.2-8.1, n 16) after the second-nearest land station's P, from JMA's hypocenter and JMA2001; Noto 2024 excluded (detection precedes origin). Supersedes `PROCESSING_TIME = 3` and the 6 s default.
- [x] JMA first detection minus the model's first land-station P: median +1.5 s (-4.1 to +3.3 s, 16 events).
- [x] 2011 from JMA's hypocenter and the real warning: Sendai 16.0 s, Oshika tip 2.7 s, Tokyo 63.8 s; model alert 3.9 s before JMA's warning at the fitted delay. Consistent with the lead "alert preceded strong motion by roughly 15 s in parts of Miyagi" (Hoshiba et al. 2011; still not read).
- [x] Noto 2024 (pub_hist 20240101161010): first warning (report 1, M5.5) 16:10:16.0, 6.5 s before the M7.6 origin 16:10:22.5; M5.9 origin 16:10:09.5; wider warning (report 20) +20.6 s.
- [x] 2025-12-08 off Aomori (20251208231519): detection +9.8 s, warning +13.9 s; JMA detected 4.1 s before the land-station model.
- [x] 2016-11-21 off Fukushima (20161122055958): report 1 at +19.1 s, warning at report 6 +27.7 s.
- [x] No JMA warning on record for 2011-03-11 M7.9 off Ibaraki or 2020-02-13 M7.0 Kuril (no matching entry within -120/+180 s); why is not established.
- [x] Public warnings began 2007-10-01 (range plot limited to it; the pub_hist list starts 2008-04).
- [x] No-warning share at the fitted delay, 19 warning-era rows: near land 48% (n 9; 31% at 6 s), offshore 5% (n 7; 0%). Supersedes "31% near land, 29% offshore" over 32 quakes.
- [L] Si and Midorikawa (1999) data cover Mw up to about 8.3 (`source.gmpe.mwMax`): check against the paper.
- [L] Offshore cable networks (S-net) as the reason for early detection off Aomori 2025 ("most likely"): inference.
- [L] "JMA has since updated its algorithms to better handle cascading ruptures" (p14): unsourced (IPF/PLUM 2016-2018).
- [L] Cut: "Some Tokyo residents saw the alert on TV" (unsourced); cut: actions chart thresholds (5/10/15/30/60 s), which were illustrative.

Still misses: the alert is the model's own (P at second station + delay); JMA's also waits for the magnitude (Fukushima 2016: +17.9 s over the model's P). One median delay blurs eras (IPF 2016, PLUM 2018, S-net). Land stations only (Aomori 2025 4 s late). Point source, hypocentral distance, Mw 9.1 outside the relation's range, so shares for M7.5+ lean high. Warning counted to S onset, not peak shaking. The page runs from the USGS hypocenter (6 s and 50 km from JMA's for 2011). Offshore share rests on 7 rows. No finite-fault footprint. The tests page runs the 07 checks through synchronous XHR; not opened in a browser.

### Follow-ups (2026-10-02)

- [x] 01: seaward means the subducting-plate side of the nearest PB2002 trench (runChecks case); 198 of 2,861 no-slab events changed class, none M7+; seaward normal share 72%. The mechanism panel follows the map, time and depth brushes with n per row (rows under 10 faded). Random control over 20 seeds: 13% within 30 km, range 12-13% (2646e02).
- [x] 03: energy sparkline names log10 E = 1.5 M + 4.8 as a radiated-energy estimate; the min-magnitude slider is stated as map-only (Fig 2 stays at or above the M5.0 cutoff); p7's deep-M6.0 shindo example removed for lack of a primary source, p7 now says only that shindo falls with distance and depth (db0a94e).
- [x] 04: Fig 3 readout gives the exact Poisson 95% range of the held-out M7+ count with b spread by its standard error (checked against scipy at six means); 2000-2010 training window: forecast 19.4, range 10-31, observed 17, inside. Gardner-Knopoff ties now follow numpy heapsort order: 100% agreement with hmtk on the 348-event fixture (was 99.4%), mainshocks 4,197 to 4,192; full-catalog agreement not re-measured (3f01885).
- [x] 07: page 5,967 to 5,552 px at 1280 and 9,095 to 7,082 px at 390, no claims cut, all 19 warning-era rows kept; 07-eew-jma.json 296 to 217 KB (further thinning failed the 0.3 s held-out check); 2011-04-07 depth note in the caption (fe6e59d).
- Libraries no longer load their own data: tests/japan-earthquakes.libs.js passes 03-etas-fit.json, 05-renewal.json and 07-eew-jma.json to runChecks (e75e5ae). 113/113.

## Status

| # | article | verified | wrong | unverifiable | notes |
|---|---|---|---|---|---|
| idx | Series index | 9 | 2 | 0 | shindo palette sentence contradicts the depth-colored map above it |
| 01 | Where | 14 | 0 | 1 | every catalog number recomputes exactly |
| 02 | Plates | 29 | 0 | 3 | transect captions all hold; Nankai 2025 revision correct |
| 03 | When | 23 | 1 | 0 | sparkline is log scale, so "flat then vertical" is false |
| 04 | Gutenberg-Richter | 24 | 0 | 0 | every fit and regional b reproduces to 2 decimals |
| 05 | History | 29 | 1 | 2 | all 37 rows match NOAA NCEI; 1896 Ms wrong; tooltip descs are one entry |
| 06 | Tsunami | 30 | 6 | 5 | observed arrivals, 4,000 m caption, tooltip distances, bunching caption, shoaling factor, trench distance |
| 07 | Early warning | 19 | 0 | 3 | S-P arithmetic and 2011 alert facts hold |
| all | Series-wide | 1 | 1 | 1 | nuclear tests counted as earthquakes; Hoei M8.6 vs M8.4 |
| | **Total** | **178** | **11** | **15** | |
| qp | Quality pass 2026-10-01 (01-05, 07) | 55 | 0 | 28 | new rows only: counts are [x] and [L] in the Quality pass section; they supersede old rows where marked, so the audit totals above are not recomputed |

## Series-wide

- [ ] "16,792 earthquakes" (idx `intro`; 02 `p2`; 03 `p2`, `p5`; 04 `p2`; 01 status
  bar "16,792 earthquakes loaded") : Computed (CSV). 16,792 rows is right, but 5 of
  them have USGS `type = nuclear explosion`: the North Korean tests at Punggye-ri
  (2009-05-25, 2013-02-12, 2016-01-06, 2016-09-09, 2017-09-03). Earthquakes proper:
  **16,787**. 4 of the tests are M5+, so the idx map's 3,705 "earthquakes" includes 4
  explosions (3,701 earthquakes). Either filter `type == "earthquake"` in every page
  (all derived numbers shift slightly; recompute), or say "events". No other statistic
  in this ledger changes at the stated precision if they are dropped, but exact counts
  (16,792, 3,705, 344 if any test is M6+: the 2017 test is M6.3, so >=M6 earthquakes
  are **343**) would.
- [?] 1707 Hoei magnitude: 02 `p8` says "estimated M8.6 ... ruptured the full
  length of the trough"; 05 `p5` and the 05 timeline say M8.4 and "most of the Nankai
  Trough". Sourced: NOAA NCEI eq 1178 gives 8.4; HERP/JMA commonly use 8.6; published
  estimates run 8.4 to 9.3. Neither is wrong, but the series should pick one (NOAA 8.4
  is the series' stated source for history) and note the range once.
- [x] "Japan sits where four tectonic plates meet" (idx, 01, 02, 03, 06) : Sourced.
  Pacific, Philippine Sea, Eurasian (Amurian), Okhotsk/North American; Bird (2003)
  PB2002 model.

## idx Series index

- [x] 16,792 M4.5+ events 2000-2025 (`intro`) : Computed (CSV). 16,792 rows,
  2000-01-03 to 2025-12-30. See Series-wide on nuclear tests.
- [x] 3,705 events at M5.0+ on the header map (`intro`, aria-label) : Computed (CSV).
  3,705 (includes 4 nuclear tests).
- [x] "Seven interactive articles" (`subtitle`) : Seven article files present.
- [x] Card 2: hypocenters trace the slabs "down to 650 km" (`d_2`) : Computed (CSV).
  The deepest event on transect A is 645 km; the catalog's deepest is 683 km (off the
  transects). Consistent with 02.
- [x] Card 3: "26 years", "one M9.1 carries 86% of the catalog's energy" (`d_3`) :
  Computed (CSV). E = 10^(1.5M+4.8); Tohoku share 0.8639.
- [x] Card 5: record "from 684 to 2024" (`d_5`) : Computed (page data). 05's 37 rows
  run 684 to 2024.
- [x] Card 6: v = sqrt(g d) (`d_6`) : Derived. Standard shallow-water speed.
- [x] Shindo: "Ten levels" (`shindo_intro`) : Sourced. JMA scale 0,1,2,3,4,5-,5+,6-,6+,7
  = 10 levels.
- [x] Shindo level descriptions 0 to 7 (`s0`..`s7`) : Sourced. Paraphrase of JMA's
  seismic intensity explanation table (気象庁震度階級関連解説表). JMA's current table
  describes 6-upper and 7 in one row for human perception ("impossible to remain
  standing ... may be thrown"); the building descriptions differ as written here.
- [ ] "The glyphs and figures across this series use the shindo palette: a blue dot
  is a weak quake, a red dot is a severe one" (`shindo_intro`) : WRONG. Only the
  card glyphs use the shindo palette. The header map directly above, and every map in
  01, 02 and idx, color by **depth**: red = shallow, blue = deep (`depthColor`, domain
  0-650 km). 03 colors by magnitude (green/yellow/orange/red). A reader following this
  sentence will read the header map backwards. Restrict it to the card glyphs.
- [ ] Shindo 7 swatch implied red (same sentence) : WRONG detail. `--shindo-7` is
  purple (#7b1fa2 in the glyph palette); red is 6-upper. Fold into the fix above.

## 01 Where

Checked against the page's own CSV parsing and its brush/preset code.

- [x] "In a typical year the USGS records about 500 earthquakes of M4.5+" (`p1`) :
  Computed (CSV). Median year 530.5; excluding 2011 median 523, mean 521.5.
- [x] "in 2011 it recorded 3,754" (`p1`) : Computed (CSV). 3,754.
- [x] "about 16,800 events" (`p3`) : Computed (CSV). 16,792.
- [x] Caption: depth scale "0 km (shallow, red) to 600+ km (deep, blue)" (`fig_caption`) :
  Computed (page). `depthMax = 650`, red to blue ramp. "600+" is loose but true.
- [x] "March 2011 holds 1,980 of the catalog's events" (`insight_1`) : Computed (CSV).
  2011-03-01 to 2011-04-01 UTC: 1,980. The preset button brushes exactly this window.
- [x] Band follows the Japan Trench, Pacific under Okhotsk (`insight_1`, `p7`) :
  Sourced. PB2002 (Bird 2003).
- [x] Four plates "Pacific, Philippine Sea, Eurasian, and Okhotsk (North American)"
  (`p6`) : Sourced. As above.
- [?] Japan Trench: "Most of Japan's largest earthquakes come from here" (`p7`) :
  Partly checkable. Computed (CSV): 18 of the 33 M7+ events lie off Tohoku along the
  Japan Trench, but several are intraslab or outer-rise events rather than interface
  quakes (e.g. 2005-11-14, 2011-03-11 M7.7, 2012-12-07, 2013-10-25 outer rise;
  2011-04-07 intraslab). In the historical record the Nankai Trough is as prolific.
  Soften to "many of".
- [x] Nankai: "a great earthquake roughly every 100-150 years" (`p8`) : Sourced. HERP [superseded 2026-10-01, see Quality pass]
  long-term evaluation of the Nankai Trough (intervals 90-150 years; 1361, 1498, 1605,
  1707, 1854, 1944/46).
- [x] Ryukyu Trench reaches toward Taiwan (`p9`) : Sourced. PB2002.
- [x] Deep events "300 to 680 km down" (`p10`) : Computed (CSV). Deepest 683.4 km.
- [x] "Of the 522 events deeper than 300 km, 338 sit under the Izu-Bonin arc" (`p10`) :
  Computed (CSV). 522 with depth > 300 km; 338 of them inside the Bonin preset box
  (137-143E, 25.5-33.5N).
- [x] Deep quakes "between 10 and 33 a year below 300 km ... with no burst in 2011"
  (`insight_2`) : Computed (CSV). Yearly min 10 (2018), max 33 (2007); 2011: 23.
- [x] Timeline annotation "2011 Tohoku" at 2011-03-11 : Computed (page).
- [x] Deep slab under the Sea of Japan is the Pacific slab (`p10`) : Sourced. Standard
  (e.g. Hayes et al. 2018 Slab2).

## 02 Plates

Transect statistics reproduced with the page's own projection code (degree-space
perpendicular distance, corridor 1.2 deg for A and B, 1.3 deg for C, frac -0.05 to
1.05).

- [?] "Four separate plates converge in a space smaller than California" (`p1`) :
  Unverifiable as stated (what space?). Japan is 378,000 km², California 424,000 km².
  Reword or cut.
- [x] Pacific under Japan east, Philippine Sea from south, Japan straddles
  Eurasian/North American (`p3`) : Sourced. PB2002.
- [x] Wadati 1930s, Benioff 1940s (`p4`) : Sourced. Wadati 1928-1935 papers on deep
  earthquakes; Benioff 1949 (GSA Bulletin) and 1954.
- [x] Map plots all 16,792 events; cross-section shows events "within about 1.2°"
  (`p2`) : Computed (page). A and B use 1.2°, C uses 1.3° (C's own caption says 1.3°).
  Fine as "about".
- [x] Caption: red shallow to blue deep (`caption_map`) : Computed (page).
- [x] Pacific plate "biggest ... fastest-moving of the four" (`p5`) : Sourced.
  Pacific is the largest plate; Japan Trench convergence about 8-9 cm/yr (MORVEL,
  DeMets et al. 2010) vs 3-5 cm/yr at the Nankai Trough. "Oldest" holds for oceanic
  lithosphere at the trenches.
- [x] About 130 million years old where it meets Japan (`p5`) : Sourced. Seafloor age
  grids (Müller et al. 2008) give ~130 Ma at the Japan Trench.
- [x] Moves WNW at roughly 8-10 cm/yr (`p5`) : Sourced. As above.
- [x] Japan Trench runs from off Hokkaido past the Boso Peninsula (`p5`) : Sourced.
  Erimo seamount to the Boso triple junction.
- [x] A-A': near the trench "mostly 10 to 60 km" (`p6`) : Computed. 1,249 of 1,512
  corridor events are 0-60 km deep, at 1,008-1,256 km along the line.
- [x] A-A': "about 100 km deep under the Pacific coast, 150 to 200 km under the Sea of
  Japan coast" (`p6`) : Computed. 80-120 km events at median lon 141.5E (Pacific coast
  of northern Tohoku); 150-200 km events at median lon 140.0E (Sea of Japan coast).
- [x] A-A': dip "roughly 20 to 30 degrees" (`p6`, A caption) : Computed. From the
  shallow cluster (~1,130 km along) to 100 km depth at ~976 km along is ~30°; 100 to
  175 km over ~120 km is ~32°. Upper end of the stated range; acceptable.
- [x] A-A': lull between 250 and 350 km (`p6`, A caption) : Computed. Depth histogram
  250-300: 2 events, 300-350: 0.
- [x] A-A': reappears at 400-650 km, "more than 1,000 km from where the plate went
  down" (`p6`, A caption) : Computed. 25 events at 400-645 km, median 129 km along vs
  the trench cluster median at 1,129 km: ~1,000 km.
- [x] B-B' caption: overlap at 30-120 km; Pacific slab at 300-350 km under central
  Honshu : Computed. 24 events deeper than 250 km, depths 258-349 km, median lon 137.1E.
- [x] C-C': Philippine Sea slab M4.5+ only to about 140 km (`p7`, C caption) :
  Computed. Deepest non-Pacific-slab event 140.0 km, next 125.7.
- [x] C-C': deep events at the southeast end 400-500 km belong to the Pacific slab
  (`p7`, C caption) : Computed. 8 events at 398-502 km, 471-634 km along a 612 km
  line.
- [x] Pacific slab under Tohoku "stays active to 650 km" (`p7`) : Computed. A-A' max
  645 km.
- [x] Philippine Sea plate "about 15 to 50 million years old" (`p7`) : Sourced. [superseded 2026-10-01, see Quality pass]
  Shikoku Basin ~15-27 Ma at the Nankai Trough, West Philippine Basin ~50 Ma.
- [x] 1707 Hoei "estimated M8.6", "49 days later Mt. Fuji began its most recent
  eruption" (`p8`) : Sourced. Hoei earthquake 28 Oct 1707, Hoei eruption began
  16 Dec 1707 = 49 days. For M8.6 vs 05's 8.4, see Series-wide.
- [x] ERC Nankai 30-year probability "about 80%" in January 2025 (`p8`) : Sourced.
  ERC January 2025 update (80%程度).
- [x] September 2025 split: "60-90% or more" main model, "20-50%" alternative (`p8`) : [superseded 2026-10-01, see Quality pass]
  Sourced. Japan Times 2025-09-27; JST Science Japan 2025-11-26. The ERC wording is
  "60-90%程度以上"; the raw upper value was 94.5%.
- [x] Kanto: Philippine Sea under North American, Pacific under both (`p9`) :
  Sourced. Standard; Boso triple junction.
- [x] "one of the only places on Earth where two oceanic plates subduct beneath a
  third" (`p9`) : Sourced. The Boso triple junction is the only trench-trench-trench
  triple junction on Earth.
- [x] 1923 Great Kanto M7.9 on the Philippine Sea / North American boundary (`p10`) :
  Sourced. NOAA NCEI eq 3227: 7.9; Sagami Trough.
- [x] Shallow crustal earthquakes "under ~20 km" in the brittle upper crust (`p12`) :
  Sourced. Standard seismogenic depth in Japan's crust, ~15-20 km.
- [x] 1995 Kobe M6.9, 16 km deep, "over 6,400" killed (`p12`) : Sourced. USGS Mw 6.9;
  JMA depth 16 km; NOAA NCEI eq 5399 deaths 6,434.
- [x] Deepest event "about 680 km, the deepest event in this catalog" (`p13`) :
  Computed (CSV). 683.4 km.
- [?] "A 500 km deep earthquake under the Sea of Japan will rattle buildings in
  Tokyo, but gently" (`p13`) : Unverifiable as a general rule. Deep Sea of Japan events
  do produce widespread, "abnormal" felt intensity on the Pacific side (e.g. the 2015
  Bonin M7.8 at 664 km gave shindo 5+ in Kanagawa), which cuts against "gently". Soften.
- [x] Earthquakes happen inside the cold slab (`insight_cross_section`) : Sourced.
  Standard Wadati-Benioff zone physics.
- [x] Tohoku ruptured "about 500 km", slip "as much as 50 meters", reaching the trench [superseded 2026-10-01, see Quality pass]
  (`insight_tohoku`) : Sourced. Fujiwara et al. 2011 (Science) ~50 m horizontal
  displacement near the trench; rupture ~400-500 km long.
- [?] "If you're in Tokyo, it's everything at once" (`p15`) : Rhetorical; leave or
  soften.

## 03 When

- [x] "Twenty-six years" (`subtitle`) : 2000-2025 inclusive.
- [x] "all 16,792 of them" (`p2`) : Computed (CSV). See Series-wide.
- [x] Caption: dots fade after 30 days; speed in days per second; sparkline log scale
  (`fig_caption`) : Computed (page). `FADE_WINDOW_MS = 30 days`;
  `currentTime += speed * DAY_MS * dt`; `sparkY = d3.scaleLog()`.
- [x] "About ten dots a week ... mostly M4.5 to M5.5" (`p3`) : Computed (CSV). Mean
  non-2011 year 521.5 = 10.0/week; 93.5% of events are below M5.5.
- [x] Tohoku M9.1, 11 March 2011 (`p4`) : Computed (CSV). 2011-03-11 05:46:24 UTC,
  mag 9.1.
- [x] "531 events of M4.5 or larger in the first 24 hours" (`p4`) : Computed (CSV).
  531 from the mainshock time to +24 h (inclusive of the mainshock).
- [x] "the 2001-2010 background averaged about one M4.5+ event a day"
  (`insight_aftershock`) : Computed (CSV). 3,704 events / 3,652 days = 1.01/day.
- [x] "Over the 30 days after the mainshock the catalog counts 2,081, roughly 70 times
  the background rate" (`insight_aftershock`) : Computed (CSV). 2,081; 69.4/day /
  1.01/day = 68x.
- [x] "Within 15 hours a M6.2 near the Nagano-Niigata border" (`insight_aftershock`) :
  Computed (CSV). 2011-03-11 18:59 UTC, M6.2, 13 km E of Arai, +13.2 h.
- [x] "another M6.2 ... off Akita" (`insight_aftershock`) : Computed (CSV).
  2011-03-11 19:46 UTC, M6.2, 88 km WNW of Noshiro, +14.0 h.
- [x] "four days later a M6.0 shook the foot of Mount Fuji" (`insight_aftershock`) :
  Computed (CSV). 2011-03-15 13:31 UTC, M6.0, 6 km NNW of Fujinomiya, +4.3 days.
- [x] "each whole number represents about 32 times more energy" (`p5`) : Derived.
  10^1.5 = 31.6.
- [x] Tohoku "accounts for 86% of it, about six times everything else combined"
  (`p5`) : Computed (CSV). 0.8639; 0.8639/0.1361 = 6.3.
- [ ] "The cumulative energy line is essentially flat for most of the timeline, then
  jumps vertically on March 11, 2011" (`p5`) : WRONG for the figure as drawn. The
  sparkline y is `scaleLog` from the first event's energy to the total. Computed
  log10 cumulative energy: first event 11.55, end of Jan 2000 ~13, end of 2000 16.1,
  before Tohoku 17.35, after 18.49, end 18.51. So about 65% of the axis is climbed in
  2000 alone, the 2003 Tokachi-oki step (0.7 decades) is comparable to Tohoku's (1.14
  decades), and Tohoku is a step of about 16% of the height. Either switch the
  sparkline to a linear y (where the claim becomes true: 86% of the height in one day)
  or describe the log curve as it is.
- [x] "about 45,000 earthquakes of M6.0, or about 8 million of M4.5" (`p6`) : Derived.
  10^(1.5 x 3.1) = 44,700; 10^(1.5 x 4.6) = 7.9 million.
- [x] "344 events of M6.0 or larger" (`p6`) : Computed (CSV). 344 (343 earthquakes;
  the 2017 North Korean test is M6.3).
- [x] "second-largest event, the M8.2 Tokachi-oki earthquake of 2003, released less
  than a twentieth of Tohoku's energy" (`p6`) : Computed (CSV). Catalog mag 8.16 is the
  second largest; ratio 10^(1.5 x 0.94) = 25.7, so 1/26.
- [x] Kumamoto foreshock April 14, mainshock 28 hours later (`insight_notable`) :
  Computed (CSV). 2016-04-14 12:26 UTC M6.2 to 2016-04-15 16:25 UTC M7.0 = 28.0 h.
- [x] Noto on New Year's Day 2024 (`insight_notable`) : Computed (CSV). 2024-01-01
  07:10 UTC, M7.5.
- [x] USGS Kumamoto M7.0 and Noto M7.5; JMA 7.3 and 7.6 (`insight_notable`) :
  Computed (CSV) for USGS; Sourced for JMA (JMA event pages: Mj 7.3, Mj 7.6).
- [x] "the offshore trench east of Honshu is the single biggest source of earthquakes" [superseded 2026-10-01, see Quality pass]
  (`p7`) : Computed (CSV). 04's Tohoku box holds 4,584 events, the most of any region;
  events east of 141E between 35-41.5N: 5,828 (35%).
- [x] Legend magnitude bins M4.5-5.0, 5.0-6.0, 6.0-7.0, 7.0+ : Computed (page),
  `magColor`.
- [x] Energy formula log10 E = 1.5M + 4.8 (page code) : Sourced. Gutenberg-Richter
  energy relation (joules).
- [x] Scenario "A deep M6.0 ... gentle sway in Tokyo, while a shallow M5.5 directly
  beneath the city is a sharp jolt" (`p7`) : Sourced as a general statement
  (intensity attenuates with hypocentral distance); illustrative.

## 04 Gutenberg-Richter [superseded 2026-10-01, see Quality pass]

Reproduced with the page's own rounding (`Math.round(mag*10)/10`), Aki-Utsu estimator
b = log10(e) / (mean - (Mc - 0.05)), se = b/sqrt(n), and prediction
N7 = n 10^(-b(7-Mc)).

- [x] Gutenberg and Richter 1944, log10 N = a - bM (`p1`) : Sourced. Gutenberg &
  Richter (1944), "Frequency of earthquakes in California", BSSA 34.
- [x] "a b of 1 means exactly a factor of ten per magnitude unit" (`p1`) : Derived.
- [x] 16,792 events (`p2`) : Computed (CSV). [superseded 2026-10-01, see Quality pass]
- [x] Caption: magnitudes rounded to 0.1; ML fit above cutoff; b=1 dashed; mb gray,
  Mw blue, other amber (`cap_gr`) : Computed (page). `TYPE_COLORS`, `magFamily`.
- [x] "a b of 1 predicts 16,792 / 10^2.5 ≈ 53 earthquakes of M7 or larger" (`p3`) :
  Derived/Computed. 53.1.
- [x] "The catalog holds 33" (`p3`) : Computed (CSV). 33 at rounded M >= 7.0.
- [x] ML fit at Mc 4.5 "b ≈ 1.21, which predicts only about 16" (`p3`) : Computed.
  b = 1.214 ± 0.009, prediction 15.5.
- [x] "By M5.2 it is close to 1.0" (`p4`) : Computed. b(5.2) = 1.021.
- [x] Cutoff M5.2 to M5.5 gives predictions "between 32 and 36" (`p4`) : Computed.
  32.5, 34.7, 36.4, 34.8 (readout rounds to 32 to 36).
- [x] "Below M5.0, nine events in ten are measured with the body-wave magnitude mb"
  (`p4`) : Computed (CSV). 89.9%.
- [x] "Above M5.5, most get a moment magnitude Mw" (`p4`) : Computed (CSV). 86.7%
  above 5.5.
- [x] mb from the first seconds of P; Mw from the whole rupture; scales disagree for
  moderate events (`p4`) : Sourced. Standard (mb saturates near 6; USGS magnitude
  types page).
- [x] Law gives average rates, not timing; basis of hazard maps (`p5`) : Sourced.
  Standard PSHA practice.
- [x] Eight regions, north to south, first match wins (`p6`, `data_note`) : Computed [superseded 2026-10-01, see Quality pass]
  (page). `REGIONS`, `BOUNDS`, `regionOf`.
- [x] Tohoku 4,584 events (`p7`) : Computed. 4,584. [superseded 2026-10-01, see Quality pass]
- [x] Kanto second with 3,126 (`p7`) : Computed. 3,126.
- [x] Okinawa third at 2,312 (`p7`) : Computed. 2,312 (Hokkaido 2,002 is fourth).
- [x] Chubu, Kansai, Chugoku/Shikoku have the fewest events (`p8`) : Computed. 77,
  51, 101 (Kyushu 410).
- [x] "Kansai's largest event in the window is M5.8 and Chubu's is M6.2" (`p8`) :
  Computed. 5.8 and 6.2.
- [x] 1995 Kobe M6.9 in Kansai, five years before the record (`p8`) : Sourced. USGS
  Mw 6.9, 1995-01-17.
- [x] At Mc 5.0: Tohoku 0.95, Kyushu 0.97, Hokkaido 1.09, Okinawa 1.16, Kanto 1.17
  (`p9`) : Computed. 0.95, 0.97, 1.09, 1.16, 1.17.
- [x] "the gap between Tohoku and Kanto is about four times its uncertainty" (`p9`) :
  Computed. (1.17 - 0.95) / sqrt(0.03² + 0.05²) = 3.9.
- [x] Chugoku/Shikoku 0.80 and Kansai 1.18 "from only 24 and 12 events, with standard
  errors of about 0.16 and 0.34" (`p9`) : Computed. n 24 and 12; se 0.16 and 0.34.
- [x] Estimator attribution "Aki 1965, with Utsu's half-bin correction" (`data_note`) :
  Sourced. Aki (1965) Bull. Earthq. Res. Inst. 43; Utsu (1966) correction for binned
  magnitudes.

## 05 History

All 37 rows cross-checked against the NOAA NCEI hazard API
(`/hazel/hazard-service/api/v1/earthquakes?country=JAPAN`, 429 Japan records) for
year, `eqMagnitude`, `deathsTotal`, and linked tsunami. Every row matches its cited
NOAA id, including the 1741 Oshima-Oshima row (NOAA tsunami event 419: M6.9, 2,000
deaths) and the 684 deaths order code 3 (101-1,000). Note: NOAA's 1933 Sanriku toll
(3,022) equals its 1927 Kita-Tango toll; Japanese sources give ~3,064 dead and missing
for 1933. The page reports NOAA faithfully.

- [x] Oldest well-documented earthquake: Hakuho 684, Nankai Trough (`p1`) : Sourced.
  Nihon Shoki; NOAA eq 162 (lat 32.5, lon 134, M8.4).
- [x] NOAA database reaches back to 2150 BCE; inclusion criteria deaths / ~$1 million
  damage / M7.5+ / MMI X+ / tsunami (`p2`) : Sourced. NCEI Significant Earthquake
  Database description.
- [x] 37 significant earthquakes from 684 to 2024 (`p4`, `h2_forty`, `caption_map`) :
  Computed (page data). 37 rows.
- [x] Caption: vertical = magnitude, area = deaths (sqrt), blue tsunami / orange none
  (`caption_timeline`) : Computed (page).
- [x] 1707 Hoei M8.4, most of the Nankai Trough, Fuji 49 days later (`p5`) : Sourced.
  NOAA eq 1178 M8.4; eruption 16 Dec 1707.
- [x] 869 Jogan M8.6, tsunami several km inland across the Sendai plain (`p5`) :
  Sourced. NOAA eq 247 M8.6; Minoura et al. 2001 (deposits ~4 km inland).
- [x] Pre-modern magnitudes back-calculated with large uncertainty (`p5`) : Sourced.
  Standard.
- [x] 1923 Great Kanto M7.9, about 105,000 dead, mostly from fire (`p6`) : Sourced.
  NOAA eq 3227: 105,385; Moroi & Takemura 2004 (~92,000 of the deaths by fire).
- [ ] 1896 Meiji-Sanriku "surface-wave magnitude ... only 7.6" (`p6`; also the 1896
  tooltip `desc` "surface-wave magnitude only 7.6"; mirrored in PAGE_JA) : WRONG.
  Sourced: the published Ms is **7.2** (Kanamori 1972; Abe 1979; Tanioka & Satake 1996,
  GRL 23). Abe's tsunami magnitude Mt is 8.2-8.6. The M8.3 plotted is NOAA eq 2489.
- [x] 1896 tsunami "up to 38 meters", killed about 27,000 (`p6`) : Sourced. 38.2 m at
  Ryori; NOAA deathsTotal 27,122.
- [x] Tsunami earthquakes rupture slowly (`p6`) : Sourced. Kanamori 1972.
- [x] "across the 36 events with a recorded toll, the rank correlation ... is only
  0.29" (`p7`) : Computed (page), reproduced. Spearman rho = 0.292 (scipy), n = 36;
  `#md-corr` is filled at runtime.
- [x] 1293 Kamakura M7.1 killed about 23,000; 1964 Niigata M7.6 killed 36 (`p7`) :
  Sourced. NOAA eq 494 (23,024); eq 4322 (36).
- [x] Caption: horizontal magnitude, vertical log deaths (`caption_mag_deaths`) :
  Computed (page).
- [x] Sanriku and Nankai recur; 1891 Mino-Owari and 1995 Kobe inland (`p8`) :
  Computed (page data). Both in the 37 with tsunami false/true as NOAA.
- [x] Jogan tsunami drowned about a thousand, recorded figure (`p12`) : Sourced.
  Nihon Sandai Jitsuroku ("about 1,000"); NOAA tsunami event 74.
- [x] Geologists studying Jogan deposits had warned; pre-2011 Fukushima hazard models
  did not fully account (`p13`) : Sourced. Minoura et al. 2001; Satake et al. 2008;
  Sawai et al. 2012; Diet investigation (NAIIC 2012).
- [x] Sanriku coast appears in 869, 1611, 1896, 1933, 2011 (`p14`) : Computed (page
  data). All five rows present.
- [x] 1923 at 11:58 a.m.; 1924 Urban Building Law revision introduced Japan's first
  seismic requirement; wider roads and firebreaks; Sept 1 Disaster Prevention Day
  (`c2`) : Sourced. 市街地建築物法 1924 revision (seismic coefficient 0.1); 防災の日
  established 1960.
- [x] 1948 Fukui: 5,131 by NOAA, 3,769 in Japanese sources (`c3`) : Sourced. NOAA eq
  3884; Fukui Prefecture / JMA 3,769.
- [x] JMA added shindo 7 the following year (1949); 1950 Building Standard Law (`c3`) :
  Sourced.
- [x] 1995 Kobe at 5:46 a.m., 6,434 killed, pre-1981 buildings, Hanshin Expressway,
  retrofit programs (`c4`) : Sourced. NOAA eq 5399; 1981 新耐震 code; 1995 耐震改修促進法.
- [x] 2004 Chuetsu: Joetsu Shinkansen derailed at speed, first in-service Shinkansen
  derailment in forty years, no injuries, guides fitted afterward (`c5`) : Sourced.
  Toki 325, 23 Oct 2004; JR East L-shaped car guides.
- [x] 2011 run-up as high as 40 m; ~5 km inland on the Sendai plain (`c6`) : Sourced.
  Mori et al. 2011 GRL (40.5 m); Sendai plain inundation ~5 km.
- [x] "About 15,900 people were killed and some 2,500 are still missing" (`c6`) :
  Sourced. National Police Agency: 15,900 dead, 2,520 missing.
- [x] Planning now considers the largest physically possible event (`c6`) : Sourced.
  Central Disaster Management Council 2011 ("L2" maximum-class tsunami).
- [x] Kumamoto M6.2 foreshock (JMA 6.5), M7.0 mainshock (JMA 7.3) 28 hours later;
  JMA changed aftershock messaging (`c7`) : Computed (CSV) for USGS values and timing;
  Sourced for JMA (August 2016 change to "similar-size quake may follow").
- [x] Noto 2024 M7.5 (JMA 7.6), more than 200 direct deaths, NOAA 549 including
  related deaths (`c8`) : Sourced. NOAA eq 10727 (549); Ishikawa Prefecture ~228
  direct deaths.
- [x] Data note: 1741 from NOAA tsunami database; 869 toll from tsunami database; 684
  range 101-1,000; 2011 counts dead and missing (`data_note`) : Sourced. NOAA tsunami
  event 419; eq 247 has no deaths field; eq 162 order code 3; eq 9799 deathsTotal
  18,423.
- [x] Tooltip descriptions (Hakuho earliest tsunami record; Tensho destroyed Nagahama
  Castle; Keicho 1605 tsunami earthquake; 1611 reached eastern Hokkaido; Genroku Sagami
  Trough; Oshima-Oshima sector collapse; Yaeyama 30 m on Ishigaki; Zenkoji during
  pilgrimage season with landslide-dam floods; Ansei-Tokai/Nankai 32 hours apart;
  Ansei-Edo and namazu-e; Mino-Owari Neodani scarp; 1933 outer-rise normal fault;
  Tottori and Tonankai/Mikawa wartime censorship; Nankai 1946 completing the 1944
  sequence; Niigata liquefaction toppling apartments; 1983 tsunami within minutes;
  Okushiri 2-5 minutes; Kobe; Chuetsu landslides; Kashiwazaki-Kariwa damage;
  Iwate-Miyagi landslides; Tohoku largest recorded; Kumamoto Castle; Iburi blackout;
  Noto) : Sourced, standard accounts (Wikipedia event articles and their cited
  sources, NOAA comments). Counted as one entry in the status table; all hold
  except the two below.
- [?] Mino-Owari "Japan's largest inland earthquake" (tooltip) : Commonly stated (M8.0
  JMA); true for the historical record but not a checkable superlative. Soften to
  "largest known".
- [?] Kita-Tango "triggered major research into fault mechanics" (tooltip) : Vague;
  unverifiable as worded.

## 06 Tsunami

Wave speed and arrivals reproduced with the page code (g = 9.8, great-circle
distances from 38.3N 142.4E, R 6,371 km). Observed travel times checked against the
NOAA NCEI tsunami runup database for event 5413 (6,000 runup records; tide-gauge
records, type 2).

- [x] 14:46 local time, 11 March 2011, M9.1 (`p1`) : Computed (CSV) and Sourced (JMA).
- [x] Ruptured "a 500-kilometer stretch" (`p1`) : Sourced. ~400-500 km (USGS).
- [x] Epicenter "roughly 70 km off the coast of Miyagi" (`p1`) : Sourced. USGS: ~70 km
  east of the Oshika Peninsula.
- [x] Tsunami killed more than 15,000; Fukushima Daiichi meltdown (`p1`) : Sourced.
  NPA 15,900.
- [x] 40-meter waves on the Sanriku coast (`p1`, `p9`) : Sourced. Mori et al. 2011.
- [x] Tsunami is a shallow-water wave moving the whole water column (`p2`) : Derived.
- [x] Began at a depth of about 29 km on a thrust, Pacific under Okhotsk (`p3`, `p13`)
  : Computed (CSV) depth 29.0 km; Sourced mechanism (USGS W-phase thrust).
- [x] Seafloor uplift "as much as 5 to 8 meters" (`p3`) : Sourced. Ito et al. 2011
  (~5 m, ocean-bottom pressure); Fujiwara et al. 2011 (~7 m near the trench).
- [?] "over an area roughly the size of Kyushu" (`p3`) : Unverifiable as worded.
  Kyushu is ~37,000 km²; the uplift zone's area depends on the model. Cut or cite a
  deformation model.
- [x] Shallow-water approximation applies when wavelength >> depth (`p4`) : Derived.
- [x] At 4,000 m "roughly 200 m/s, about 720 km/h" (`p5`) : Derived. 198 m/s = 713 km/h.
- [x] At 10 m "about 36 km/h" (`p5`) : Derived. 35.6 km/h.
- [x] 5,000 m gives 797 km/h (readout at the slider default; map ring speed) :
  Computed (page). sqrt(9.8 x 5000) x 3.6 = 797.
- [x] Kamaishi "only about 120 km away" (`caption_speed`) : Computed (page). 117 km.
- [ ] Observed first arrivals in the table: Hilo ~7h 24m (obs 7.4), Crescent City
  ~9h 36m (obs 9.6) (page `destinations`) : WRONG against the sources. NOAA NCEI
  runup database, tide gauges: **Hilo 7h 56m** (6,310 km), **Crescent City 9h 47m**
  (7,560 km). California Geological Survey: first arrival at the Crescent City gauge
  7:42 a.m. PST = **9h 56m**. Kamaishi obs 0.5 h is consistent with JMA's first
  large waves at 15:12-15:21 JST, keep.
- [ ] Caption: at 4,000 m "the estimates for Hilo and Crescent City run 10 to 20
  percent slow" (`caption_speed`) : WRONG once the observed times above are fixed.
  Computed: estimates 8h 50m (Hilo) and 10h 35m (Crescent City) vs NOAA 7h 56m and
  9h 47m: **11% and 8% slow** ("about 10 percent"). Against the page's current obs
  values the 19% and 10% hold, so this changes with the fix.
- [x] Caption: at 5,000 m "both land within about 7 percent of the observed first
  arrivals" (`caption_speed`) : Computed. Against NOAA: Hilo 7h 54m vs 7h 56m (0.4%),
  Crescent City 9h 28m vs 9h 47m (3%). Holds (and gets better) with the corrected obs.
- [x] Open ocean wave "perhaps 1 meter tall", wavelength 200 km or more
  (`insight_invisible`) : Sourced. DART records across the Pacific 0.2-1.8 m;
  wavelength ~ period x speed (~15-30 min x 200 m/s = 180-360 km).
- [x] Epicenter 38.3N 142.4E (`p6`) : Computed (CSV). 38.297, 142.373.
- [x] First waves reached Sanriku within 30 minutes (`p6`, map annotation "Only 30
  min warning") : Sourced. JMA: first large waves 15:12-15:21 JST.
- [x] Hawaii "about 7 hours", US West Coast "around 10 hours", Chile "roughly 22 hours"
  (`p6`; map labels 7, 10, 22 h) : Sourced. NOAA: Hilo 7h 56m (Kauai/Oahu gauges
  earlier), Crescent City 9h 47m, Chilean gauges 21h 18m (Iquique) to 23h 08m
  (Constitucion). Hawaii "7" is on the early side; "7-8 hours" would be safer.
- [x] Map annotation "7 hours across 6,200 km of open ocean" : Computed. Label point
  6,082 km, Hilo 6,296 km.
- [x] Map annotation "22 h later, still destructive at 17,000 km" : Computed/Sourced.
  Label point 16,870 km; Chilean gauges 16,200-17,100 km, run-ups to 2.5 m with damage
  at Dichato and Talcahuano harbors.
- [ ] Map tooltip "Distance: ~N km" computed as `hours x 700` : WRONG. It shows
  Sanriku 350 km, Hokkaido 700 km, Hawaii 4,900 km, California 7,000 km, Chile
  15,400 km. Great-circle distances from the epicenter to the page's own label points:
  Sanriku **~150 km**, Hokkaido **~530 km**, Hawaii **6,080 km**, California
  **8,060 km**, Chile **16,870 km**. The Hawaii tooltip (4,900) contradicts the
  annotation beside it (6,200). Compute with `d3.geoDistance` as the speed table does.
- [ ] Caption: "Wavefronts bunch up near coastlines where shallow water slows the
  wave" (`caption_propagation`) : WRONG for this figure. The rings expand at one
  constant speed (`waveSpeeds` all sqrt(9.8 x 5000)), as `p7` itself says ("The map
  above ignores all of that and expands every ring at one speed"). Nothing bunches.
  Cut the sentence.
- [?] Caption: "Arrival times shown for key locations" (`caption_propagation`) : The
  arrival labels are hard-coded hours (0.5, 1, 7, 10, 22), not computed from the
  rings. Hokkaido 1.0 h is unsourced. Say "approximate observed arrivals".
- [x] Bathymetry refracts wavefronts; ridges and seamounts focus energy (`p7`) :
  Sourced. Standard (Titov et al. 2005).
- [x] Shoaling: front slows, wave compresses, wavelength shrinks (`p8`) : Derived.
- [ ] "The wave height can amplify by a factor of 10 to 40" from shoaling (`p8`) :
  WRONG as a shoaling figure. Green's law (amplitude ~ d^-1/4) gives 4.5x from 4,000 m
  to 10 m and 8x from 4,000 m to 1 m. The 10-40 m coastal heights come from shoaling
  plus bay resonance, funnelling and run-up, which `p9` and `p10` then say. Reword to
  "several-fold" or cite Green's law. The shoaling figure's "~1 m to 10-40 m" panels
  inherit the same issue; label them as including run-up.
- [x] Highest surveyed run-up about 40.5 m at Aneyoshi, Miyako (`p9`) : Sourced. Tohoku
  Earthquake Tsunami Joint Survey Group; Tsuji et al. 2011.
- [x] Sanriku ria topography funnels waves (`p10`) : Sourced. Standard.
- [x] 1896 run-up 38.2 m, 1933 run-up 28.7 m (`p11`) : Sourced. Both at Ryori
  (Ofunato), standard values.
- [?] "The Sanriku coast has the highest tsunami risk in Japan" (`p11`) : Unverifiable
  superlative; the Nankai coast (Kochi, Wakayama, Shizuoka) carries the largest
  projected tsunami heights in the 2012 Cabinet Office scenarios (34 m at Kuroshio).
  Soften.
- [ ] "The Japan Trench lies only 70 to 200 km off the Pacific coast of Tohoku"
  (`insight_30min`) : WRONG lower bound. 70 km is the epicenter's distance offshore.
  The trench axis is ~200-220 km off the coast (at 38.3N, trench ~144.0E vs Oshika
  141.5E: ~218 km; at 40N ~205 km). Say "about 200 km", or "the rupture began only
  70 km offshore".
- [x] 15 to 30 minutes before the first tsunami (`insight_30min`) : Sourced. JMA
  observed arrivals ~25-35 min for the Sanriku gauges; shorter for some.
- [x] JMA tsunami alert within 3 minutes; initial estimates 3 to 6 m; actual 10 to
  40 m; system redesigned (`insight_30min`) : Sourced. JMA 14:49 warning (Miyagi 6 m,
  Iwate and Fukushima 3 m); JMA 2013 revision (qualitative "巨大" for M8+).
- [x] Three conditions for tsunami generation; deep and strike-slip events pose less
  risk (`p12`, `p14`, `caption_fault_types`) : Sourced. Standard.
- [x] Tohoku "rupture area of roughly 500 × 200 km" (`p13`) : Sourced. USGS finite
  fault.
- [x] Japan Trench and Nankai Trough are the tsunamigenic subduction zones (`p15`) :
  Sourced. Standard.
- [?] "The Sea of Japan side ... faces much lower tsunami risk" (`p15`) : Relative
  claim; 05 itself lists deadly Sea of Japan tsunamis (1741, 1983, 1993, 2024). "Lower"
  is defensible; "much lower" is not checked. Soften.
- [?] Shoaling diagram labels (~1 m / ~200 km; ~2-3 m / ~50 km; 10-40 m / ~1 km) :
  Illustrative, not computed. See the Green's law entry.

## 07 Early warning

- [x] P waves about 6 km/s, S waves about 3.5 km/s in the crust (`p2`, legend) :
  Sourced. Standard crustal values; page `VP = 6`, `VS = 3.5`.
- [x] Gap grows "about 12 seconds for every 100 km" (`insight_key`) : Derived. [superseded 2026-10-01, see Quality pass]
  100/3.5 - 100/6 = 11.9 s.
- [x] "Tokyo is 373 km from the 2011 Tohoku epicenter ... about 44 seconds" [superseded 2026-10-01, see Quality pass]
  (`insight_key`) : Computed (page). Haversine from 38.3N 142.4E: 373 km, 44.4 s.
  (From the USGS epicenter 38.297, 142.373: 372 km, 44.2 s.)
- [x] "Sendai, 134 km away, had a gap of about 16 seconds" (`insight_key`) : Computed [superseded 2026-10-01, see Quality pass]
  (page). 134 km, 15.9 s.
- [x] Caption: warning modeled 3 s after the third station detection; stations [superseded 2026-10-01, see Quality pass]
  schematic (`caption_simulation`) : Computed (page). `PROCESSING_TIME = 3`.
- [x] "JMA can issue a preliminary warning within about 3-8 seconds of detecting the [superseded 2026-10-01, see Quality pass]
  first P-wave" (`p5`) : Sourced. 2011: first forecast 5.4 s, public warning 8.6 s
  after first detection (Hoshiba et al. 2011, EPS 63).
- [?] Timeline caption "Timeline of the 2011 Tohoku earthquake early warning sequence"
  (`caption_timeline`) : The times are the schematic model's, not the 2011 record.
  Model: first detection 17.2 s, third 25.7 s, warning 28.7 s after rupture (11.5 s
  after first detection). Recorded: first detection 14:46:40.2 at OURI, 138 km away,
  public warning 8.6 s later. Say "modeled" in the caption.
- [x] "over 1,000 seismometers" (`p7`) : Sourced. JMA: ~690 JMA stations plus ~1,000
  NIED Hi-net stations feed the EEW.
- [x] Three or more stations, ~3-5 s (`p8`) : Sourced as typical (JMA EEW [superseded 2026-10-01, see Quality pass]
  description).
- [x] Initial estimate M7.2; final M9.1 (JMA 9.0) (`p9`, `p14`) : Sourced. Hoshiba et [superseded 2026-10-01, see Quality pass]
  al. 2011: M7.2 at the fourth update, the warning.
- [x] Warnings for areas expected at shindo 4 or above (`p10`) : Sourced. JMA issues
  a warning when max predicted shindo is 5-lower or more, to areas predicted 4 or more.
  Accurate as a description of who is warned.
- [x] Broadcast channels (TV, radio, phones, factories, trains, elevators) (`p11`) :
  Sourced. JMA EEW description.
- [x] "the public warning went out about 8 seconds after the first station detected [superseded 2026-10-01, see Quality pass]
  the P wave" (`insight_2011`) : Sourced. 8.6 s (Hoshiba et al. 2011).
- [x] Warning covered Miyagi, Iwate, Fukushima, Akita and Yamagata; Kanto never
  warned; no warning for Tokyo (`insight_2011`) : Sourced. Hoshiba et al. 2011; JMA
  2011 EEW report.
- [?] "Along the Miyagi coast ... strong shaking arrived within seconds of the alert
  or before it" (`insight_2011`) : Not confirmed this session; Hoshiba et al. 2011 is
  paywalled here. The paper reports the alert preceding strong motion by roughly
  15 s in parts of Miyagi. Check the paper's Fig. 5 before keeping this.
- [x] Tohoku Shinkansen coastal seismometers cut power; no trains in passenger service
  derailed (`insight_2011`) : Sourced. JR East 2011 (one out-of-service test train
  derailed at low speed near Sendai).
- [?] Actions chart: 5 s drop/cover, 10 s windows, 15 s elevator, 30 s bullet trains, [superseded 2026-10-01, see Quality pass]
  60 s factory shutdown (`caption_actions`) : Illustrative thresholds, no source.
  Label as rough, or cite (e.g. JMA EEW guidance).
- [x] Near the epicenter there is no gap; alert may arrive after shaking (`p13`) :
  Derived (blind zone).
- [x] Large earthquakes don't reveal their size in the first seconds; JMA updated
  algorithms (IPF 2016, PLUM 2018) (`p14`) : Sourced.
- [x] False alarms occur (e.g. 2018-01-05 Ibaraki/Toyama double-count) (`p15`) :
  Sourced.
- [x] SASMEX, ShakeAlert, China and Taiwan systems (`p16`) : Sourced.
- [x] Scenario magnitudes Tohoku 9.1, Noto 7.5; Noto epicenter 37.50N 137.27E
  (`opt_*`, `SCENARIOS`) : Computed (CSV). Noto 37.4874, 137.2710, M7.5.

## Japanese strings (PAGE_JA)

Checked mechanically: every `data-i18n` element's English digits compared with the
digits in its PAGE_JA entry, for all eight pages (script: parse both, diff the sorted
number lists). Every difference is a counter or unit rewrite that preserves the value:
4つ, 3月, 1つ, 10件中9件, 800万 (8 million), 20分の1 (a twentieth), 1億3000万年
(130 million years), 1500万〜5000万年 (15-50 million years), 100万ドル ($1 million),
7世紀, 震度7, 9月1日, 40年 ("forty"), 28時間 ("twenty-eight"). No numeric mismatches.
The JA strings carry the same wrong values as the English where the English is wrong
(1896 Ms 7.6 in 05 `p6`; 06 caption and tooltip values; idx `shindo_intro` palette
sentence), so fix both together. 02 transect captions (`captionJa`) match the English
numbers.

## Leads from FACT-CHECK.md (2026-09-27)

Settled after the fixes above; docs/ changed where marked (English and Japanese).

- [ ] "about ten dots a week" (03 `p3`) vs "about one M4.5+ event a day" for 2001-2010
  (03 `insight_aftershock`) : Computed (CSV, earthquakes only, the figure's default
  min mag 4.5). 2001-2010: 3,703 events / 3,652 days = 1.01/day = 7.1/week (median
  week 5). The earlier "10/week" was the 2000-2025 mean without 2011, which still
  carries other aftershock sequences. Fixed: `p3` now says "about one new dot a day",
  which agrees with `insight_aftershock`.
- [ ] Fault-types caption "Only shallow thrust faults produce the vertical seafloor
  displacement that generates major tsunamis" (06 `caption_fault_types`) vs `p12`
  "thrust (or normal)" : WRONG as worded. Shallow normal faults also lift or drop the
  seafloor; the 1933 Showa Sanriku tsunami (28.7 m at Ryori, ~3,000 dead) came from an
  outer-rise normal fault (Kanamori 1971; see 05 tooltip entry). `p12` holds. Fixed:
  the caption now names the three panels as earthquakes (shallow thrust, deep,
  strike-slip), says the thrust raises a tsunami and the other two barely move the
  seafloor, and notes that a shallow normal fault, not drawn, can also do it (1933).
- Non-claim, Japan Trench map label hidden by dots: 01 map label moved from 145.5E to
  146.0E (east of the outer-rise events) and given a halo; 02 boundary labels were
  drawn before the dots and so sat under them, now raised above the dots with a halo.

### Second opinion (fact-check hunt, 2026-09-27)

- [ ] "Once three or more stations have picked up the P-wave" (07 `p8`), and the figure
  model (warning 3 s after the third detection; `caption_simulation`, timeline label and
  aria text) : WRONG. JMA locates the hypocenter and issues EEW from two or more
  stations (Kodera et al. 2021, Front. Earth Sci. 9:726045: "hypocenter estimates using
  two or more stations"; the two-station rule exists to screen out single-station
  noise). Fixed in English and Japanese: `p8` now says two or more stations and
  "locate" (heading "2. Locate." / 「2. 震源決定。」, since two stations do not
  triangulate); caption says 2+ stations and the second detection; the model now uses
  the second detection (`WARNING_STATIONS_NEEDED = 2`, timeline "2 stations detect").
  Tohoku scenario: warning at 26.1 s after rupture (was 28.7), 8.9 s after first
  detection, close to the recorded 8.6 s. Checked headless: status bar runs "need 2" to
  warning at t=26.1 s, no page errors.
- [ ] "A 500 km deep earthquake under the Sea of Japan will rattle buildings in Tokyo,
  but gently" (02 `p13`) : WRONG. The 2015-05-30 Bonin earthquake (CSV: us20002ki3,
  Mw 7.8, 664 km; JMA M8.1, 682 km), about 870 km south of Tokyo, gave JMA intensity 4
  across central Tokyo and 5-upper at Ninomiya, Kanagawa (and Hahajima), and was felt in
  all 47 prefectures for the first time on record; 13 injured, no major damage (JMA via
  Japanese Wikipedia and tenki.jp event page). Fixed in English and Japanese: the
  sentence now says deep does not always mean gentle and cites this event.
- [?] "over an area roughly the size of Kyushu" (06 `p3`) : needs a human. Still
  unsourced. Open sources found this session give only the whole source area (about
  500 x 200 km, Tsushima et al. 2011, which includes subsidence) and a >2 m
  initial-height region about 100 km wide (Saito et al. 2011 GRL, via search snippet;
  paper paywalled). If that zone runs 300 to 400 km along the trench it is 30,000 to
  40,000 km², against Kyushu's ~37,000, so the comparison is plausible but not shown.
  Page left as is. Either cite a deformation model's uplift area or cut the clause.
