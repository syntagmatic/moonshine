# Track findings: japan (docs/japan-earthquakes)

20 articles down to 7. Every figure now plots the shipped USGS catalog (16,792 events, M4.5+, 2000-2025) or, in 05, a hand-compiled list of historical events from standard sources. The co-author credit (Daniel Overstreet) is now on the series index subtitle as well as the homepage entry.

## Cut, merged, renumbered

The catalog CSV moved from `01a-spatial-brush/data/earthquakes.csv` to `shared/data/earthquakes.csv`, since four pages load it now.

| old | new |
|---|---|
| 01a-spatial-brush | 01-where |
| 13-tectonic-plates | 02-plates |
| 02b-temporal-animation | 03-when |
| 03b-scale-small-multiples + 03a-scale-gutenberg-richter (rewritten as one) | 04-gutenberg-richter |
| 07-noaa-database + 04a-impact-scroll (rewritten as one) | 05-history |
| 15-tsunami-propagation | 06-tsunami |
| 16-early-warning | 07-early-warning |
| 01b, 02a, 04b, 05, 06, 08, 09, 10, 11, 12, 14 | deleted |

I put plates second, not fifth as in the brief's list. The map in 01 raises the question the plates answer, and 02's cross-sections reuse the depth reading that 01 introduces.

I didn't find a cut figure worth rehoming inside this track. My survey subagent couldn't launch (concurrency limit), so I checked the cut pages myself, at the level of their figure code and the reviewer's notes:
- 11-live-api: a real USGS API fetch with fallback. It's off-topic here but could suit d3-power-tools (source: `docs/japan-earthquakes/11-live-api/index.html` at commit abfd27d).
- 02a-temporal-calendar: a calendar heatmap of real daily counts. It duplicates 03's timeline, so I dropped it. If the series ever needs a seasonality test, it could come back with an actual test.
- 14-magnitude-scales: its energy arithmetic (31.6x per unit) is correct, but 03 and 04 now cover energy and magnitude types from the data.
- 04a: the scroll map only drove a KPI readout. Its content survives as prose in 05.
- 05, 06, 08, 12: invented data, nothing to keep.

## Errors confirmed and fixed

- **Tohoku magnitude.** The catalog says M9.1 (mww), so every page now uses 9.1. 07 notes JMA's 9.0 once. Depth in 06 is now the catalog's 29 km (it was 24). The series uses USGS values for modern events throughout: Kumamoto M7.0 (JMA 7.3), Noto M7.5 (JMA 7.6). 03 and 05 say so where it matters.
- **03 energy (was 02b).** M9.1/M6.0 is 44,700x (it said 22,000) and M9.1/M4.5 is 7.9 million x (it said 700 million). "1,000x all other quakes combined" was wrong: summing the catalog with log E = 1.5M + 4.8, Tohoku is 86% of the total, about 6.3x everything else. The "aftershock rate 200x background" claim is replaced with computed figures: 531 events in the first 24 h, and 2,081 in 30 days against a 2001-2010 background of about 1 a day, roughly 70x. The "M6.6 near Akita" was wrong. It's replaced with the real triggered events from the catalog: M6.2 at the Nagano/Niigata border, M6.2 off Akita, and M6.0 near Fuji.
- **03 data.** The inline array held 800 real events, 566 of them from 2011, while the page claimed "every M4.5+ quake 2010-2024". The page now plays the full CSV.
- **04 "GR predicts 33 M7+ almost exactly" (was 03a).** Confirmed wrong. With b=1 anchored at M4.5 the law predicts 53, and the maximum-likelihood b at M4.5 is 1.21, which predicts 16. For cutoffs from M5.2 to M5.5, b is about 1.0 and predicts 32-35. The page now computes this live as you drag the cutoff.
- **04 regional b-values.** The old values came from a least-squares fit to cumulative counts, a biased method, which is where the reviewer's "Kanto 1.17, Kansai 1.36" came from. They're now maximum-likelihood b with a standard error, computed from the CSV. At Mc=5.0: Tohoku 0.95, Kyushu 0.97, Hokkaido 1.09, Okinawa 1.16, Kanto 1.17, Chubu 1.14±0.28, Kansai 1.18±0.34, Chugoku/Shikoku 0.80±0.16. The prose says the interior values carry little meaning. The old "Okinawa close second" count (4,412) matched no box on the map. Okinawa is now a drawn box (2,312 events, third).
- **01.** "About 1,500 M4+ quakes a year" is now a count from the catalog: about 500 M4.5+ in a typical year and 3,754 in 2011. The deep-focus prose pointed readers at central Honshu, but 357 of the 522 events below 300 km are under Izu-Bonin, and the prose now says so.
- **02 (was 13).** "Slab reaches the lower mantle" is wrong: the deepest events, about 680 km, sit at the base of the transition zone. "Hoei triggered Fuji" is softened to "49 days later". "600+ km on transect A" wasn't true on the old line (max about 460 km), so A now runs (42N,130E) to (40N,145.5E), where the real slab is visible to 650 km. The Japan Trench trace sat up to 1 degree west of the axis. I corrected it (still approximate).
- **06 "within about 10%" at 4,000 m.** Confirmed loose. Using great-circle distances now computed in JS: at 4,000 m, Hilo comes out at 8.8 h against about 7.4 h observed, and Crescent City at 10.6 h against about 9.6 h. At 5,000 m they're within 7%. The caption says this, the slider defaults to 5,000, and the propagation animation now uses sqrt(g*5000) rather than a flat 700 km/h.
- **07 "Tokyo got ~60 s of warning".** Confirmed false as a claim about the warning system. The public EEW (initial estimate M7.2) went only to Miyagi, Iwate, Fukushima, Akita and Yamagata. The physical S-P gap at Tokyo is 44 s (at VP=6, VS=3.5), not 60. Both passages are rewritten. The simulation caption now says that the station positions are schematic and that it models an ideal alert.
- **05 (was 07).** "Four thousand years" became "Thirteen Centuries". "Forty earthquakes" became 39, the actual array length. The magnitude-deaths "weak correlation" is now a computed Spearman rho (0.31). Several other fixes:
  - Meiji-Sanriku is labeled as its surface-wave magnitude.
  - The "Ainu records" claim is removed.
  - "Jogan tsunami on the Sanriku coast" is corrected to the Sendai plain.
  - The claim that 1923 deaths came from weak buildings is not repeated. The 1923 deaths are attributed to fire.

## Errors rejected

- **Reviewer's "completeness roll-off at M4.5-4.6".** The histogram doesn't roll off at 4.5: the count is still rising (3,943 events at 4.5, 3,378 at 4.6). The steep low end comes from the change of magnitude type: 90% of events below M5.0 are mb, and most above M5.5 are Mw. The page shows this as a per-bin strip.
- **Reviewer's "Kansai steepest at 1.36".** That value is an artifact of the least-squares fit on 51 events. See the regional b-values above.
- **Station count conflict (1,000 vs 4,000).** Both pages that used 4,000 are deleted. "Over 1,000 seismometers" in 07 is true, since JMA plus Hi-net comes to more than 1,000. The 4,000+ figure counts seismic-intensity meters, which is a different network.

## Figures made honest or removed

- 02: `generateEarthquakes()` (Math.random) is replaced by the CSV on the map and in all three cross-sections. The hand-drawn slab curves and slab depth ticks are gone, and the dots are the slab. Trench markers are now computed by intersecting each transect with the trench traces. Annotations are placed from binned catalog depths.
- 03: the full CSV replaces the skewed inline subset.
- 04: all counts, fits, the M7 prediction and the magnitude-type strip are computed at runtime from the CSV. Nothing in it is hand-typed.
- 05: the correlation is computed in the page.
- 06: distances and the animation speed are computed. The readouts show observed arrivals next to the model.
- Series index header: about 200 hand-placed dots, colored by an invented "peak shindo" model, are replaced by the 3,705 real M5+ events colored by depth.
- Callout boxes are folded into prose on every page, grand closers are removed, the index "technique" badges are dropped, and em dashes are gone from visible text.

## Unresolved, needs a human

- 02 p8 keeps "70-80% probability of a Nankai quake in 30 years". I believe the government revised this in 2025, possibly to "60-90% or higher". It needs checking against the Earthquake Research Committee.
- 05 historical death tolls and pre-modern magnitudes for 684, 1293, 1361, 1586 and 1605 are uncertain. I left them as they were. Noto's death toll (245) is a mid-2024 figure. "More than 200 direct deaths" in the prose is conservative.
- 05 Meiji-Sanriku is plotted at Ms 7.2. Its Mw is about 8, so the point sits low on the magnitude axis, and the text says why.
- 06's "seafloor uplift 5-8 m over an area the size of Kyushu" is unverified. I left it.
- 06/07 observed arrival times (Hilo about 7.4 h, Crescent City about 9.6 h) and the "about 8 s after first detection" EEW timing are from memory, without network access.
- The JA translations of the paragraphs I rewrote are my own. A native speaker should review them.
- The cut pages' prose and technique content, if anyone wants 11 (live API) for d3-power-tools.

## Inbound links

I grepped all of `docs/`. No page outside `docs/japan-earthquakes/` links to any article URL in the series. The homepage links only to `japan-earthquakes/index.html`, which still exists.

## Homepage entry

```js
{ title: "Japan Earthquakes", count: 7, href: "japan-earthquakes/index.html",
  desc: "Where Japan's earthquakes strike and why, fitted and replayed from 16,792 real USGS events, plus thirteen centuries of history, tsunamis and early warning. Made with Daniel Overstreet.",
  tags: "seismology · geospatial · Gutenberg-Richter", thumb: "seismo" }
```
