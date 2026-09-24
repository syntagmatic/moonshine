# Findings: grateful-dead

Track verdict: trim. Cut the MFCC piece and merge two pairs. The series goes from 7 articles to 4.

## Cut, merged, renumbered

| old | new | action |
|---|---|---|
| 01-setlist-archaeology.html | 01-setlist-archaeology.html | rewritten, with the era material from 06 merged in |
| 02-touring-life.html | 02-touring-life.html | fixed |
| 03-show-grammar.html | 03-show-grammar.html | fixed; fake figures rebuilt from real data |
| 04-segue-graph.html | 04-segue-graph.html | rewritten, with the co-occurrence material from 05 merged in |
| 05-songs-together.html | (deleted) | merged into 04 |
| 06-the-eras.html | (deleted) | merged into 01 |
| 07-mfcc-timbral-DNA.html | (deleted) | cut |

The surviving filenames are unchanged, so nothing had to be renamed.

JSON files deleted, since no surviving page loads them (all data is inlined): `gd-archaeology.json`, `gd-cooccurrence.json`, `gd-eras.json`, `gd-segues.json`, `gd-touring.json`. `gd-grammar.json` stays because `index.html` fetches it for the header sparkline (with an inline fallback). Code comments in 03 and 04 still name the deleted files as their source; git history has them.

## Data provenance

The data is real, not invented. It comes from gdshowsdb (Jef Smith's open show database), and the evidence is internal consistency:
- `gd-touring.json` lists 2,358 dated shows. Its per-show song counts sum to 39,774, which matches `_total_songs` in `gd-eras.json` for every year.
- Per-year show counts agree across `gd-touring`, `gd-eras` and `gd-grammar`.
- Venue counts, debut years (Casey Jones 1969, Bertha 1971, Terrapin 1977, Throwing Stones 1982) and the four 1975 shows (Kezar, Winterland, Great American Music Hall, Lindley Meadow) all match known history.

I did not re-derive the JSON from the gdshowsdb source. The script that produced it is not in the repo, so the data can't be regenerated.

Caveats a reader needs, now stated in the prose:
- 282 shows have no setlist (n=0), and 281 of them are before 1971. Only 268 of the 539 shows from 1965-69 have a setlist.
- The counts are setlist entries, not shows. A reprise counts twice, which is why Playing in the Band has 750 entries.
- Only the top 60 songs by career entries are included, the top 100 segue pairs, and the top 200 co-occurrence pairs. The "436 songs" figure on the old index can't be checked against anything shipped, so I removed it.
- There is one source-data error: a single 1974 "Estimated Prophet" entry, when the song debuted on 1977-02-26. I removed it from 01's inline data.
- The source data had U+FFFD replacement characters in five venue names (Rüsselsheim, Café au Go-Go, Walter Köbel Halle, Zénith Paris, Daniel-Meyer Coliseum). Fixed in 02.

The hand-authored arrays the review flagged were real fakes, and all are gone: 03's set-length and position heatmap and its Sankey, 04's chains and segue timeline, 05's hand-assigned clusters, and 07's MFCC profiles.

## 01 Setlist Archaeology (merged with 06 The Eras)

- The six eras now appear as prose and as debut cohorts coloring the streamgraph and sparklines, instead of as separate figures.
- Figures kept:
  - Fig 1 streamgraph, now colored by the debut era of each song, with a click-to-isolate status line.
  - Fig 2 sparklines, now covering all 60 songs, sortable, with a hover tooltip. The old version showed only 24 of them.
- Figures dropped:
  - 01's heatmap and lifespan charts: same data as the sparklines.
  - 01's "new songs per year" chart: its tiers were meaningless, because every top-60 song has at least 266 entries, so the "tried and dropped" tier was always empty.
  - 06's timeline: shows per year duplicates 02 Fig 2, and songs per show duplicates 03 Fig 5.
  - 06's second streamgraph.
  - 06's radar fingerprints and era comparison.
  - 06's novelty and entropy charts: computed on a fixed 30-song panel, so they can't support the diversity claims made from them.

Errors confirmed and fixed:
- "Casey Jones vanished after 1974 for two decades": the data has it at 4-7 a year in 1977-84.
- "Drum solos occasional before 1978" (01) and "Drums barely exist before 1970" (06): Drums has 130 entries in 1969 and 123 in 1970. The dip in 1971-74 lines up with Mickey Hart's absence, and the text now says so.
- Estimated Prophet listed as a 1974 debut: fixed via the data correction above.
- "Touch of Grey era has more shows than any other": 312, against the Arena era's 634. Removed.
- "Bertha and Jack Straw arrive with the 1970 albums": both debuted in 1971. Fixed.
- "Songs peaking in the 1980s (Drums, ...)": Drums peaks in 1969. The seven songs that actually peak after 1979 are now listed.
- "Uncle John's Band, Casey Jones ... dropped into rotation in a single year": both were 1969 live debuts. Fixed.
- "By the end of 1973 roughly 40 percent of the career staples existed": it's 50 of 60.
- "Dark Star performed five times total 1975-88": it's six.
- "70-90 shows per year from 1976": the range was 41-87.
- The late-career narrowing story (01) and "58 songs a year in the Golden Road vs 35-40 in Touch of Grey" (06) are contradicted by the data. The number of top-60 songs played each year rises from 45 in 1972 to 55-59 in every year from 1979 on. The panel is chosen by career totals, so it can't test narrowing at all, and the article now says exactly that. What the data does show is setlist length falling from 21.9 entries per show (Golden Road) to 18.8 (Final Years).
- "Turn On Your Lovelight reappears" in the Touch of Grey era: it came back in 1981 and was regular from 1985. Corrected in the new prose.
- Removed: 06's meta-hedge paragraph with em dashes, the `.insight` callout, and the grand-summary closer.

Errors checked and confirmed correct: the era show counts (539/424/105/634/312/344); Drums and Space in 1978 (74/44) and 1980 (88/84 of 87 shows); Playing in the Band at 8 in 1995; 864 entries in 1995; Truckin' played at least 8 times a year in 1977-95; Cryptical at 73/92 and 8 in 1985.

## 02 Touring Life

- Removed the "Quality over quantity" 1977 paragraph and rewrote it plainly. 60 shows is fewer than any year from 1978 to 1985.
- Fixed an em dash in a caption. The remaining em dashes are in JS comments only. Removed the unused `.insight` CSS. The review's "callout box" was that paragraph; no callout element existed.
- "46 states": the data has 45 states plus DC. Fixed.
- Europe trips: added 1971 (Herouville). "Each trip lasted a few weeks at most" was wrong for 1972, which ran seven weeks from April 7 to May 26. Fixed.
- **Rejected:** the review said "cities 308 not 314". There are 314 distinct city+state pairs and 308 distinct city names; Portland OR and Portland ME are different cities. 314 is correct.
- Verified correct: London 20, Toronto 14, Vancouver 10, 98 international shows, 587 venues, NY 165, Philadelphia 67, Boston 53, Chicago 50, Spectrum 53 (1968-95), Nassau 42, MSG 52 from 1979, Bay Area 500+ (600 by my city list).

## 03 Grammar of a Show

- **Fig 1 Anatomy:** the invented widths for Break, Set 2a, Drums, Space and Set 2b are gone. It now has three blocks from `avg_songs_per_set` (9.1 / 10.1 / encore 1.7).
- **Sankey removed.** It was built on independence-assumption joint counts. Removed with it: the d3-sankey script, the "most common arc" reading, the Standing on the Moon paragraph and the closing summary.
- **Set length by year:** this was a hand-typed array. It is now computed from per-show setlist counts, with hollow dots where fewer than 90% of a year's shows have a setlist.
- **Position heatmap:** only the first and last cells were real. It is now a six-column matrix of real opener and closer counts, sortable by column.
- Confirmed and fixed:
  - "Sugar Magnolia closed Set 2 nearly three times more than the next": it's 359 vs 247.
  - "U.S. Blues 265, more than any single slot": Sugar Magnolia's 359 is higher.
  - "Drums/Space nightly from 1978": Space was only 44/81 in 1978, so the text now says nightly from 1980.
  - "Hart returned in 1978": he returned in 1976.
  - The "first-set test... the pattern held" paragraph had no data behind it. Removed.
- Verified: Jack Straw 191, Bertha 157, China Cat 198, Scarlet 179, Deal 230, NFA 247, Lovelight 201, U.S. Blues 265.

## 04 Segue Graph (merged with 05 Songs Together)

- Kept from 04: the force graph, the Markov walk and the top-20 pair bars.
- Brought in from 05: the observed/expected co-occurrence figure, rebuilt as Fig 4 with a toggle between two chance models, career totals and same-year play rates. Its data is generated by script from the JSON. Under same-year rates, the El Paso "affinities" drop to about 1.05, and the top five pairs are all top-100 segues.
- Removed from 04: the chord diagram (the same 100 pairs again), the unsourced key/tempo "musical logic" section, the hand-typed segue timeline (which invented Dark Star > St. Stephen in 1989-94) and the chain diagram.
- Removed from 05: the matrix, cluster network, affinity radial, Set 1/Set 2 networks and Venn diagram. All depended on hand-assigned clusters, or on a flat chance model with a `|| 200` fallback.
- Confirmed and fixed:
  - China Cat > Rider "from 1966": China Cat debuts in 1968 and Rider has no 1968 plays, so the pair can only date from 1969.
  - "Across 2,358 shows": it's 2,076 with setlists.
  - The Markov prose claimed Playing in the Band ranks high. It ranks 23rd at 1.1%; Fig 2 now draws the exact long-run share as a tick on each bar.
  - Dark Star's "many destinations": only two are in the top 100.
  - Dropped three claims the data can't show: the Sugaree vs Loser "role equivalence" (the pair isn't in the data), Sugar Magnolia and Sugaree "expected nearly as high", and Me and My Uncle and PITB "never segue".
- Inline data verified against `gd-segues.json`, `gd-cooccurrence.json` and `gd-archaeology.json`.

## Salvage (no home in this track)

- `docs/grateful-dead/07-mfcc-timbral-DNA.html` at commit 3d487ca (`git show 3d487ca:docs/grateful-dead/07-mfcc-timbral-DNA.html`) has three generic, genuinely computed figures:
  - Fig 1: harmonic sliders (H1-H5 plus the fundamental) that redraw a composite waveform and its spectrum.
  - Fig 2: the mel-scale curve m(f) = 2595 log10(1 + f/700), with hover.
  - Fig 3: a mel filterbank with a filter-count slider.
  - Suggested home: any future audio or signal-processing series. Its Dead-specific figures were hand-tuned and must not be salvaged.
- 05's affinity radial would need the same-year chance model before any reuse. It has no obvious home.

## Unresolved (needs a human)

- 03's rocker/ballad/cover/original colors come from a hand classification (`SONG_TYPES`), not from data. The intro's "more covers in Set 1" is unverified.
- 03 treats set 3 as the encore. The shipped data can't confirm this.
- The generation script for the JSON is missing, so the inline data can't be regenerated.
- The 06 era narratives made historical claims (Cornell '77 "greatest rock concert", Wall of Sound debts, Garcia's 1986 coma). I kept only brief, well-known ones in 01 and did not source them.

## Inbound links

No page outside `docs/grateful-dead/` links to 05, 06 or 07, or to the deleted JSON files. The homepage links only to `grateful-dead/index.html`.

## Homepage entry

```
{ title: "Grateful Dead: 2,358 Shows", count: 4, href: "grateful-dead/index.html",
  desc: "Thirty years of concerts through setlists: how the repertoire grew across six eras, where the band toured, what opened and closed a show, and which songs flowed into each other.",
  tags: "setlists · segues · touring · eras", thumb: "music" },
```
