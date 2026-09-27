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
- [x] Nankai: "a great earthquake roughly every 100-150 years" (`p8`) : Sourced. HERP
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
- [x] Philippine Sea plate "about 15 to 50 million years old" (`p7`) : Sourced.
  Shikoku Basin ~15-27 Ma at the Nankai Trough, West Philippine Basin ~50 Ma.
- [x] 1707 Hoei "estimated M8.6", "49 days later Mt. Fuji began its most recent
  eruption" (`p8`) : Sourced. Hoei earthquake 28 Oct 1707, Hoei eruption began
  16 Dec 1707 = 49 days. For M8.6 vs 05's 8.4, see Series-wide.
- [x] ERC Nankai 30-year probability "about 80%" in January 2025 (`p8`) : Sourced.
  ERC January 2025 update (80%程度).
- [x] September 2025 split: "60-90% or more" main model, "20-50%" alternative (`p8`) :
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
- [x] Tohoku ruptured "about 500 km", slip "as much as 50 meters", reaching the trench
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
- [x] "the offshore trench east of Honshu is the single biggest source of earthquakes"
  (`p7`) : Computed (CSV). 04's Tohoku box holds 4,584 events, the most of any region;
  events east of 141E between 35-41.5N: 5,828 (35%).
- [x] Legend magnitude bins M4.5-5.0, 5.0-6.0, 6.0-7.0, 7.0+ : Computed (page),
  `magColor`.
- [x] Energy formula log10 E = 1.5M + 4.8 (page code) : Sourced. Gutenberg-Richter
  energy relation (joules).
- [x] Scenario "A deep M6.0 ... gentle sway in Tokyo, while a shallow M5.5 directly
  beneath the city is a sharp jolt" (`p7`) : Sourced as a general statement
  (intensity attenuates with hypocentral distance); illustrative.

## 04 Gutenberg-Richter

Reproduced with the page's own rounding (`Math.round(mag*10)/10`), Aki-Utsu estimator
b = log10(e) / (mean - (Mc - 0.05)), se = b/sqrt(n), and prediction
N7 = n 10^(-b(7-Mc)).

- [x] Gutenberg and Richter 1944, log10 N = a - bM (`p1`) : Sourced. Gutenberg &
  Richter (1944), "Frequency of earthquakes in California", BSSA 34.
- [x] "a b of 1 means exactly a factor of ten per magnitude unit" (`p1`) : Derived.
- [x] 16,792 events (`p2`) : Computed (CSV).
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
- [x] Eight regions, north to south, first match wins (`p6`, `data_note`) : Computed
  (page). `REGIONS`, `BOUNDS`, `regionOf`.
- [x] Tohoku 4,584 events (`p7`) : Computed. 4,584.
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
- [x] Gap grows "about 12 seconds for every 100 km" (`insight_key`) : Derived.
  100/3.5 - 100/6 = 11.9 s.
- [x] "Tokyo is 373 km from the 2011 Tohoku epicenter ... about 44 seconds"
  (`insight_key`) : Computed (page). Haversine from 38.3N 142.4E: 373 km, 44.4 s.
  (From the USGS epicenter 38.297, 142.373: 372 km, 44.2 s.)
- [x] "Sendai, 134 km away, had a gap of about 16 seconds" (`insight_key`) : Computed
  (page). 134 km, 15.9 s.
- [x] Caption: warning modeled 3 s after the third station detection; stations
  schematic (`caption_simulation`) : Computed (page). `PROCESSING_TIME = 3`.
- [x] "JMA can issue a preliminary warning within about 3-8 seconds of detecting the
  first P-wave" (`p5`) : Sourced. 2011: first forecast 5.4 s, public warning 8.6 s
  after first detection (Hoshiba et al. 2011, EPS 63).
- [?] Timeline caption "Timeline of the 2011 Tohoku earthquake early warning sequence"
  (`caption_timeline`) : The times are the schematic model's, not the 2011 record.
  Model: first detection 17.2 s, third 25.7 s, warning 28.7 s after rupture (11.5 s
  after first detection). Recorded: first detection 14:46:40.2 at OURI, 138 km away,
  public warning 8.6 s later. Say "modeled" in the caption.
- [x] "over 1,000 seismometers" (`p7`) : Sourced. JMA: ~690 JMA stations plus ~1,000
  NIED Hi-net stations feed the EEW.
- [x] Three or more stations, ~3-5 s (`p8`) : Sourced as typical (JMA EEW
  description).
- [x] Initial estimate M7.2; final M9.1 (JMA 9.0) (`p9`, `p14`) : Sourced. Hoshiba et
  al. 2011: M7.2 at the fourth update, the warning.
- [x] Warnings for areas expected at shindo 4 or above (`p10`) : Sourced. JMA issues
  a warning when max predicted shindo is 5-lower or more, to areas predicted 4 or more.
  Accurate as a description of who is warned.
- [x] Broadcast channels (TV, radio, phones, factories, trains, elevators) (`p11`) :
  Sourced. JMA EEW description.
- [x] "the public warning went out about 8 seconds after the first station detected
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
- [?] Actions chart: 5 s drop/cover, 10 s windows, 15 s elevator, 30 s bullet trains,
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
