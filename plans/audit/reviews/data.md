# Review group: data (grateful-dead, japan-earthquakes)

Method: read every prose extract; checked shipped data files against the prose (python over the gd-*.json files and the 16,792-row USGS CSV); grepped figure code in 01/03/04/05 (GD) and 03b/05/06/08/09/12/13/15/16 (JP).

## grateful-dead (7 articles, ~11.6k words, all added 2026-04-10/11)

Data provenance: real. gd-touring.json has 2,358 shows with venue/city/state from gdshowsdb, and every per-era show count I checked in the prose (539/424/105/634/312/344) sums correctly from gd-grammar.json. The venue counts (Oakland 66, Winterland 59, Spectrum 53, MSG 52) match. The only Math.random calls are the Markov walker (legit) and force-layout init. Hand-authored data exists too, though: 03's set-length-by-year array ("normalized" by hand) and the position heatmap off-slot counts; 04's chains and segue timeline ("derived from known setlist patterns"); 07's MFCC profiles (disclosed as hand-tuned).

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01 Setlist Archaeology | 3 3 3 3 | FIX | Real per-year counts drive streamgraph/sparklines/heatmap. Fig 5 caption says "full setlist database" but code bins only the top-60 songs, so the "tried & dropped" tier is always empty. Prose contradicts its own data: Casey Jones "vanished after 1974 for two decades" (data: played 1977-84); "drum solos occasional before 1978" (data: Drums 130x in 1969); Estimated Prophet listed as 1974 debut (one-off data artifact; the page later says 1977). |
| 02 Touring Life | 3 4 3 4 | KEEP | Best of the series. Per-show data, map + year filter + animated routes all computed. Facts check (venue counts, 587 venues; cities 308 not 314). 9 em dashes and one callout box ("1977... quality over quantity") need fixing. |
| 03 Grammar of a Show | 2 2 3 3 | FIX | Opener/closer tallies are real. The Sankey is admitted to be independence-assumption guesses, yet the prose reads a "most common arc" from it. Set-length-per-year and position-heatmap values are hand-made while the page calls them "derived". The "first-set test... the pattern held" claim has no data behind it. |
| 04 Segue Graph | 3 3 3 3 | FIX | Real top-100 segue pairs; the Markov walk really runs on them. The chain diagram and timeline are hand-authored. The timeline invents Dark Star > St. Stephen revivals in 1989-94 (St. Stephen was retired in 1983). The key/tempo "musical logic" section is unsourced. It says China Cat > Rider ran "from 1966" and also that the first attempt was in 1969. |
| 05 Songs Together | 2 3 3 2 | MERGE -> 04 | Observed/expected ratio is really computed. The conclusions (China>Rider, Drums/Space, Estimated>Eyes) repeat 04. "Role equivalence" (Sugaree vs Loser anti-association) is asserted, never shown. |
| 06 The Eras | 3 3 2 2 | MERGE -> 01 | Era counts are correct. Errors: "Touch of Grey era has more shows than any other" (312 vs Arena's 634); Bertha and Jack Straw arriving with the 1970 albums (they debuted in 1971); "Drums barely exist before 1970" (data: 130 in 1969). A second streamgraph and a second account of the repertoire narrowing duplicate 01. There's an em dash, and a meta-hedge paragraph ("claims about the audio, not figures from this article"). |
| 07 Timbral DNA (MFCC) | 1 2 2 1 | CUT | By its own admission every Dead-specific figure is "hand-tuned, not measured". What remains is a generic MFCC tutorial (harmonic sliders, mel curve), and it closes with "the math sees the Dead's sound changing", which contradicts its disclaimers. Off-topic for a setlist series. |

Series paragraph: this is the stronger of the two. It has a real dataset, real computation in most figures, and a coherent subject. But it was generated in a day and it shows. The prose repeatedly asserts things its own JSON refutes, several "derived" arrays are hand-typed, and 05/06 re-tell 01/04. A tight 4-piece version (repertoire+eras, touring, grammar with real positional data, segues+co-occurrence) would be worth keeping. The MFCC piece should go.

## japan-earthquakes (20 articles, ~20.3k words, all added 2026-04-11; homepage credits "Made with Daniel Overstreet"; pages are bilingual EN/JA via shared/i18n.js)

Data provenance: mixed. Real: a 16,792-row USGS M4.5+ CSV for 2000-2025 (01a loads it; 03a/03b cumulative counts, 05 yearly and magType counts, and 02a's "434 events on 2011-03-11" all match it; 09's 104 inline points are 95 USGS matches; 11 genuinely fetches the USGS API). Fabricated or invented while presented as real: 13's map and cross-sections come from `generateEarthquakes()` using Math.random, while the caption says "Each dot is an earthquake". 12's 812 "raw earthquakes 2020-2024" are synthetic M3.x tuples (19/812 coincide with the catalog). 05's gridDensity is commented "aggregated from real data" but doesn't match (cell 24N/122E: 180 vs real 603; 36N/140E: 620 vs 1684). 08's timeline USGS counts are wrong (2011: 2150 vs real 3754; 2006: 640 vs 221) and its JMA counts are fake-precise. 06's USGS comparison (2018: 712 vs real 538) and station map are generated.

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01a Spatial brush | 3 4 3 2 | KEEP | Real 16.8k-event CSV, working bidirectional brush. Same insight as 01b/03a/13. Says M9.1 while 01b and 15 say 9.0. |
| 01b Spatial scroll | 2 2 2 1 | CUT | Same story as 01a in scrollytelling form (the index says "same insight, two ways"). 9 em dashes and a callout box. |
| 02a Calendar | 2 3 3 2 | CUT | Real counts. "No seasonal pattern" is asserted, never tested. A duplicate of 02b's insight. |
| 02b Animation | 3 3 3 2 | FIX | Energy arithmetic is wrong. M9.1/M6.0 is ~45,000x, not 22,000x. M9.1/M4.5 is ~8 million x, not 700 million. "1,000x all other quakes combined" is way off (one M8.3 is already 1/16 of M9.1). |
| 03a Gutenberg-Richter | 3 3 3 3 | MERGE -> 03b | Real cumulative counts. Ignores the obvious completeness roll-off at M4.5-4.6 (mb-dominated catalog). "GR predicts 33 M7+ almost exactly" is wrong: b=1 gives ~53. |
| 03b Small multiples | 3 4 3 3 | KEEP | b-values really fit per region from real data. The prose misstates them: Kanto is 1.17 not ~1.3, and Kansai, the steepest at 1.36, is never mentioned. |
| 04a Impact scroll | 3 2 2 2 | MERGE -> 07 | History is broadly right. Uses a Magnitude/Deaths/Damage KPI readout, 9 em dashes, and a grand closer ("No country has more experience..."). |
| 04b Impact linked | 2 3 3 2 | CUT | 20-quake cross-filter. It credits building codes with the 1923 vs 1995 death gap, but 1923 was mostly fire. Overlaps 04a/07 and d3-power-tools linked-views. |
| 05 USGS catalog | 3 2 3 3 | MERGE -> 08 | Useful record anatomy and real magType stats. The density grid is invented while labeled real. Encyclopedic. |
| 06 JMA database | 2 1 3 2 | MERGE -> 08 | USGS comparison numbers and station positions are made up. Says USGS covers Japan at M4.0+ while 05 says M4.5. |
| 07 NOAA database | 3 3 3 3 | FIX | The Jogan-to-Tohoku thread is the one genuinely good narrative in the series. The title's "four thousand years" doesn't fit data that starts in 684 CE. |
| 08 Three datasets | 2 1 3 2 | FIX | A reasonable merge target, but every timeline number is invented and must be rebuilt from real counts. |
| 09 Inline JSON | 2 2 2 1 | CUT | Web-dev tutorial, not seismology. Overlaps d3-power-tools/data-gathering. |
| 10 External files | 2 2 2 1 | CUT | Same. It claims "every block so far embedded its data", but 01a loads an external CSV. |
| 11 Live API | 2 3 2 1 | CUT (or move to d3-power-tools) | The live USGS fetch with fallback is real and works. It's off-topic for this series. |
| 12 Pre-aggregated | 1 1 2 1 | CUT | Synthetic data presented as real. "800 dots slow your browser to a crawl" is false. "Same reason beehives use hexagons" is wrong. |
| 13 Tectonic plates | 4 1 3 3 | FIX | The geology prose is the best in the series (slab ages, Kanto double slab, Wadati-Benioff). But every plotted quake is Math.random while the real CSV with depths sits in the same series. Swap in the real data and this is the lead article. |
| 14 Magnitude scales | 3 3 3 2 | FIX | Energy math is correct here (31.6x). "Tohoku released more energy than all other Japanese quakes in recorded history combined" is dubious (Jogan, Hoei and 1707-class events). Shindo content duplicates 06 and the index. |
| 15 Tsunami | 4 3 3 4 | KEEP | v=sqrt(gd) is computed live. Run-up figures check out (38.9 m, 38.2 m, 28.7 m). The "within about 10%" claim is loose (at 4 km depth, Hawaii comes out ~8.6 h vs ~7-7.5 h observed). Uses M9.0 while the series says 9.1. 10 em dashes. |
| 16 Early warning | 3 4 3 4 | FIX | P/S timing is computed (VP=6, VS=3.5). "Tokyo residents got roughly 60 seconds of warning" in 2011 is very likely false: the public EEW, based on the initial M7.2 estimate, went only to Tohoku prefectures, not Kanto. The page itself cites the M7.2 underestimate. Station count (1,000) conflicts with 06/14 (4,000). |

Series paragraph: this is a technique catalog wearing an essay series' clothes. It has paired "same insight, two ways" variants (01a/b, 02a/b, 03a/b, 04a/b), four generic data-loading tutorials, and three overlapping dataset reference pages. About a quarter of the pages plot invented numbers while claiming to plot real ones, even though a real 16.8k-event catalog ships in the repo. The contextual pieces (13, 15, 16) have real physics and could anchor a 5-6 article series: plates (13 with real data), where/when (01a + 02b), GR (03b), impact history (07 + 04a), tsunami (15), EEW (16). The homepage credits a collaborator, so check before cutting.
