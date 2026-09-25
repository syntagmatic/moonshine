# Findings: prose pass, applied track

Series: mathematical-diagrams, bioinformatics, lithium-ion, japan-earthquakes
(restricted). Word counts are prose words outside `<script>`, `<style>`, `<svg>`
and display math. Em dash counts are reader-visible text (including `<title>`)
plus lines of JS that put an em dash into a string.

## Numbers

| series | words before | words after | change | visible em dashes | JS em dash strings |
|---|---|---|---|---|---|
| mathematical-diagrams (11 pages) | 11,440 | 10,645 | -7% | 0 -> 0 | 2 -> 0 |
| bioinformatics (9 pages) | 7,895 | 7,344 | -7% | 9 -> 0 | 1 -> 0 |
| lithium-ion (6 pages) | 7,212 | 7,004 | -3% | 6 -> 0 | 4 -> 0 |
| japan-earthquakes (8 pages, restricted) | 7,394 | 7,339 | -1% | 0 -> 0 | 1 -> 1 (see below) |

Per page, before -> after:

- md 01 613 -> 564, 02 1534 -> 1534 (untouched, reads well), 03 1197 -> 974,
  04 1107 -> 1090, 05 1243 -> 1187, 06 1303 -> 1164, 07 933 -> 868,
  08 1163 -> 1105, 09 1072 -> 957, 10 1077 -> 1004, index 198 -> 198.
- bio 01 1219 -> 1055, 02 498 -> 454, 03 1065 -> 928, 04 807 -> 739,
  05 769 -> 769 (title only), 06 1165 -> 1079, 07 1011 -> 1011 (title only),
  08 1110 -> 1065, index 251 -> 244.
- li 01 1403 -> 1279, 02 778 -> 805, 03 1620 -> 1631, 04 885 -> 816,
  05 2408 -> 2355, index 118 -> 118.
- jp 02 1224 -> 1210, 03 756 -> 742, 04 848 -> 847, 06 1350 -> 1337,
  07 987 -> 974; index, 01 and 05 untouched.

The cut is well short of the 20-30% target. The restructure tracks had already
removed the recaps, takeaway lists and dashboards in these series, and most of
what remains is dense technical content. Lithium-ion 02 and 03 grew slightly:
they were written in arrow-and-semicolon shorthand ("Low current -> η_ct
dominates", "Inevitable, predictable, Arrhenius."), and turning that into
sentences costs words. I chose not to cut content to hit the number.

## What changed

- Titles "X — Y" became "X · Y" (bioinformatics and lithium-ion), matching
  mathematical-diagrams. JS strings with em dashes rewritten (md 05 hover
  labels, li 02 panel titles, li 03 status line, bio 06 placeholder now "none").
- Callouts: four `<div class="insight">` boxes in md 05, 06, 07 unwrapped into
  plain paragraphs. The dead `.insight` CSS rules are still in those files.
- bio 01: five "Scale: ..." banner pills removed (dashboard chrome, same call
  the lithium-ion track made for its SCALE pills); the residue count moved into
  the lollipop prose.
- Bolded lead-ins removed throughout ("Play:", "Build:", "Try the ...:",
  "The LFP tradeoff.", "Arrhenius has teeth.", "Three current laws."), generic
  "The Core Concept" headers renamed (md 01, 05, 06).
- Recap intros cut to a pointer (li 05, bio 04), a forward reference in bio 03
  that jumped to article 08 removed, "Where the triangle shows up next" in md 03
  (a repeat of the section above it, pointing at a series it doesn't link) cut.

## Errors fixed (confirmed)

- **li 03, time to damage threshold.** "Fade at 45 °C is only ~2x ... but it
  arrives at the damage threshold twice as fast." With δ ∝ √(kt), the time to
  reach a fixed δ is δ²/k, so 4x k means 4x sooner. Now says four times.
- **li 03, Deal-Grove.** The parabolic law is the thick-oxide limit of
  Deal-Grove; the thin-oxide limit is linear. Also "iron rusting" (aqueous
  corrosion, not parabolic) became high-temperature oxidation of metals, which
  is what Wagner's theory covers.
- **li 03, Mullins-Sekerka.** "Every wavelength of a flat interface is
  unstable, short wavelengths limited only by surface tension" became: unstable
  to every perturbation longer than a cutoff, with surface tension stabilising
  the shorter ones.
- **li 01 vs li 05.** 01 said LFP systems re-anchor with "scheduled full
  discharges" and "lean entirely on coulomb counting"; 05 (whose numbers were
  checked against readouts) says full charges re-anchor at the steep top of the
  curve and the EKF still corrects near the ends. 01 now matches 05.
- **li 04.** "Li+ must tunnel through a thickening SEI" became "cross"; ions
  migrate through SEI, they don't tunnel.
- **li 05.** "Tripling the current cuts the total from 82 to 53 minutes,
  because the CV tail grows" had the causation backwards; now "even though".
- **bio 02, Figure 2 caption.** "Exons (thick) are the parts that become
  protein" contradicted the track list (UTRs are exons too). Now says coding
  exons are thick and UTRs are untranslated exon sequence.
- **bio 04.** "Genome-wide comparison" of ten targets is not genome-wide; now
  "comparing many targets".
- **md 03.** "In that geometry geometry" typo.

## Suspected, not changed

- **li 04.** "σ_W rises as ... lost lithium inventory steepens the
  concentration gradient." The Warburg coefficient scales with 1/(c√D); loss
  of lithium inventory changes the concentration, but "steepens the gradient"
  is a loose description. Left as is.
- **li 03.** "Why EVs are often set to stop at 70%": manufacturer defaults
  vary (80-90% is more common for daily charging). Left, since "often" hedges
  it, but a human may want "80%".
- **bio index.** The "vocabulary" colour legend is a five-card grid. It is a
  legend rather than a metric grid, so I left it.
- **md 02.** "Almost anything you draw comes out a genuine knot": true for
  reduced alternating diagrams, but a scribble can have nugatory crossings.
  "Almost" covers it.

## Japan-earthquakes: English paragraphs changed (translations need updating)

Only clear slop, no length trimming. Every change is listed so the Japanese in
each page's `PAGE_JA` can be updated by a human. No keys were renamed.

1. `02-plates/index.html`, key `h2_preparedness`
   - old: Why This Matters for Preparedness
   - new: What the Geometry Means for Preparedness
2. `02-plates/index.html`, key `p15`, last sentence
   - old: If you're in Tokyo, it's everything at once, which is why the city's
     seismic infrastructure is arguably the most sophisticated in the world.
   - new: If you're in Tokyo, it's everything at once.
3. `03-when/index.html`, key `p8` (whole paragraph)
   - old: Japan's building codes and early warning systems are among the best
     anywhere. But the physics is non-negotiable: another great earthquake is a
     matter of when, not if. Knowing what the difference between background
     noise and a major sequence looks like, that's part of living in earthquake
     country.
   - new: The plates are still moving, so another great earthquake will come.
     Part of living in earthquake country is knowing what the background looks
     like, so that a major sequence stands out from it.
4. `04-gutenberg-richter/index.html`, key `p1`, first sentence
   - old: ... and the ratio between them is remarkably steady.
   - new: ... and the ratio between them is steady.
5. `06-tsunami/index.html`, key `p9`, last two sentences
   - old: These heights were not just the result of shoaling. They were
     amplified by the geography of the coast itself.
   - new: Shoaling explains only part of these heights. The shape of the coast
     amplified them further.
6. `06-tsunami/index.html`, key `p16`, middle sentences
   - old: The warning time is brutally short for the nearest coast, and the ria
     geography of Sanriku amplifies what arrives. The 2011 disaster was not a
     surprise in the geological sense. It was the latest in a pattern
     stretching back centuries.
   - new: The warning time is short for the nearest coast, and the ria
     geography of Sanriku amplifies what arrives. Geologically, the 2011
     disaster was the latest in a pattern stretching back centuries.
7. `07-early-warning/index.html`, key `p16` (whole paragraph)
   - old: Japan's earthquake early warning system comes from hard-won
     experience, big public investment, and a culture that takes disaster
     preparedness seriously. Other countries are building similar systems
     (Mexico's SASMEX, the US ShakeAlert along the West Coast, systems in China
     and Taiwan), but Japan's is still the fastest and most comprehensive.
   - new: Japan's earthquake early warning system grew out of repeated
     disasters and large public investment. Other countries run or are building
     similar systems: Mexico's SASMEX, ShakeAlert on the US West Coast, and
     systems in China and Taiwan.

The one remaining em dash in the series is `06-tsunami` JS line ~567,
`if (!isFinite(hours)) return "—";`, a missing-value mark in a readout. It is
language-neutral on a bilingual page, so I left it; replacing it with English
("n/a") would show English in Japanese mode.

## Needs a human

- Japanese translations for the seven keys above.
- Whether 20-30% cuts are wanted on lithium-ion and the newer
  mathematical-diagrams pages (02, 05, 06, 08) at the cost of content. I'd
  leave them.

## Gate

- Em dashes: 0 visible and 0 JS strings across mathematical-diagrams,
  bioinformatics and lithium-ion; japan-earthquakes has the one placeholder
  above.
- render-check passes on every touched page (served on 8106): all 11
  mathematical-diagrams pages, all 9 bioinformatics pages, lithium-ion 01-05,
  japan-earthquakes 02, 03, 04, 06, 07.
- Re-read lithium-ion 03 and mathematical-diagrams 06 end to end after the
  edits; both read better, and one awkward sentence in md 06 was fixed on the
  re-read.
