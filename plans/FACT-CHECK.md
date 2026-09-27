# Fact-check

The gallery's one queue for fact-checking. I want every claim a reader can
check to be derived, computed or sourced, and this file tracks how far each
series has got and which suspect claims are still waiting for a look.

- **Status** says which series have been through a full fact-check. A full
  check produces a claims ledger at `plans/<series>/LEDGER.md` (one row per
  claim: verified, wrong or unverifiable, with the source) and a fix pass;
  `plans/algorithms-ml/` is the reference for both.
- **Open leads** are claims someone flagged but didn't fix: during a prose
  sweep, a review, a reader report. One line each: page, the claim, and why
  it looks wrong. Add new ones under their series.
- When a series' fact-check settles a lead (fixed, or checked and fine),
  delete the line here and record the outcome in that series' ledger. This
  file only holds what's still open.

## Status

| Series | Fact-checked | Notes |
|---|---|---|
| algorithms-ml | 778056b | ledger: 205 verified / 39 wrong / 33 unverifiable, all fixed |
| emergence | 5753d65 | ledger: 528 / 91 / 90, all fixed |
| modular-forms | 1670df4 | ledger: 467 / 90 / 44, all fixed |
| japan-earthquakes | a12a28f | ledger: 178 / 11 / 15, all fixed |
| noether | | leads settled 2026-09-27; ledger holds those only |
| parallel-coordinates | | leads settled 2026-09-27; ledger holds those only |
| mathematical-diagrams | | leads settled 2026-09-27; ledger holds those only |
| exceptional-atlas | | leads settled 2026-09-27; ledger holds those only |
| bioinformatics | | leads settled 2026-09-27; ledger holds those only |
| cohomology | | leads settled 2026-09-27 (Claims section); its `LEDGER.md` is a build tracker, not a claims ledger |
| decision-trees | | leads settled 2026-09-27; ledger holds those only |
| lattice-simulation | | leads settled 2026-09-27; ledger holds those only |
| lithium-ion | | leads settled 2026-09-27; ledger holds those only |
| grateful-dead | | leads settled 2026-09-27; ledger holds those only |
| quasicrystals | | leads settled 2026-09-27; ledger holds those only |
| foam | | leads settled 2026-09-27 (Claims section); its `LEDGER.md` is a build tracker, not a claims ledger |
| sph | | Ian's series; ask before touching |

## Open leads

From a read-only hunt on 2026-09-27: one agent per series (two or three
small series per agent), each settling its candidates by derivation, by
running the page's own JS in node, or against a source before listing
them. The four already-ledgered series got a second-opinion pass, which
found most of its errors in text added by the prose sweep or by the first
check's own fixes. Marked (unchecked) where the agent said it went from
memory. sph was not checked.

### noether

- 12: `math-bad-J` renders placeholder text ("meaningless: no termination
  guarantee..."). The math is wrong too: for I = (x1, x2, ...), J_d =
  (x1, x2, ...) for every d, so the chain is constant; the proof fails at
  step (3), J_0 not finitely generated, not at step (2).
- 08: gauge rule A -> A + ∂α/q doesn't match D = ∂ - iqA/ħ; needs (ħ/q)∂α.
- 01: Fig 3 says every non-diagonal point has an 8-point orbit; points on
  an axis have 4.
- 01: "the smallest non-trivial finite group in this series is D_4", but
  S_3 is on the same page and Z/2 in 10.
- 01: "invariant functions ... theorem of Newton": it's the symmetric
  polynomials (max(a,b,c) is invariant); proved by Waring 1770 / Gauss 1816.
- 10: Kummer invented ideal numbers "trying to prove FLT"; Edwards (1975)
  traces them to his reciprocity and cyclotomic-integer work.
- 09: conserved energy "only with a Killing vector" ignores ADM/Bondi
  energy in asymptotically flat spacetimes.
- 08: table gives SU(2)_L -> W, Z and U(1)_Q -> photon; it's SU(2)_L x
  U(1)_Y -> W, Z, γ.
- 03: Fig 1 static times (1.000/0.913/0.879 s) don't match the live values
  (0.629/0.589/0.562), which are themselves off the exact 0.639/0.583
  (midpoint rule near v = 0).
- 04: Fig 1 no-JS text "δL = 1.25" should be 0.625.
- 11: a chain from (f) in k[x] has at most deg f strict steps, not deg f + 1.
- 13: Noether normalization "in fewer variables" should be "at most n"
  (the page's own affine-plane row has d = n).

### parallel-coordinates

- 09: Fig 3 says polylines "converge" at closest approach. Constant velocity
  makes the 4D state a line: evenly spaced polylines through three indexed
  points; closeness shows as xA ≈ xB, yA ≈ yB on non-adjacent axes.
- 11: "price against safety" trade-off; the generator makes safer cars
  cheaper (price = 35000 - 2000·safety), so the goals agree.
- 08: Fig 3 caption chain inlet -> outlet -> concA -> concB; greedyOrder on
  seed 123 gives concB -> concA -> inlet -> outlet, and the generator drives
  concA from inlet.
- 07: four strings still say strums select by slope (prose, status bar,
  Fig 3 aria, index card), left over from the ledger fix; and the strum is
  called "angular brushing", which Hauser et al. 2002 define by angle.
- 03: the circle's dual "traces a closed curve"; it's a hyperbola, closed
  only projectively (slope 1 at θ = 3π/4, 7π/4).
- 01: two polylines "cross once between each pair of adjacent axes"; only
  where their order reverses (Fig 6 works because its points always do).
- 04: "pairwise absolute correlations"; the matrix shows signed r.
- index: Inselberg 2009 title is missing "and Its Applications".
- 08: "299 patients from 1988"; 1988 is the UCI donation year.
- 03: "a smooth closed non-convex curve must have inflections"; needs
  "simple" (a looped limaçon has none).

### mathematical-diagrams

- 06: the tropical line rays (1,0), (0,1), (-1,-1) are min-plus; the page is
  max-plus: (-1,0), (0,-1), (1,1).
- 02: Fig 3 preset "Trefoil [3]" is the mirror of the Fig 1-2 trefoil.

### exceptional-atlas

- 09: kissing table "Delsarte LP bound ... from Odlyzko and Sloane (1979)":
  44.99, 364.09, 554.51 are Mittelmann-Vallentin 2010 SDP bounds; 78.47 and
  135.48 match nothing (M-V: 78.24, 134.45); O-S LP values are about 46.3,
  82.6, 140.0, 380.4, 595.2. The chart data (~line 1207) mixes LP (1416) and
  SDP (36764) under an "LP" legend.
- 08: "each orbit lands on a regular 30-gon, a Petrie polygon of 4_21";
  only the outer ring (radius 1.140) has (x, cx) = 1.
- 09: degree-2 families "can never" satisfy both conditions; they contain
  the linear one. What fails is degree 0.
- 08: "Figure 7 of Part 3" is Figure 6.
- 09: Leech automorphism group "contains three sporadic groups"; Co1 is a
  quotient of Co0, and Co0 contains M11-M24, HS, McL, Co2, Co3.
- 03: rank 2 "four angles give four root systems A2, B2 and C2, G2"; 90° is
  A1 x A1, and B2 = C2.
- 05: `math-tensor-decomp` shows a_ij ∈ {0,1}, which the exceptions below
  contradict.
- 09: literal "&fhat;" renders (not an entity).

### bioinformatics

- 01: the oncoprint (seed 27182) has an empty MDM2 row: 3 amplifications,
  all TP53-altered, all removed by the exclusivity step. The caption and
  aria-label describe amplifications in the wildtype stripe.
- 05: 9 vs 3 is "fourfold"; it's threefold.
- 04: "only a few of the strongest wildtype sites keep a signal"; the
  partial ones are GADD45A (4th) and TIGAR (7th), and the top three are lost.
- 04: WT pileup "roughly 200 bp wide"; SD is 200 bp, FWHM about 470.
- 08: KM figure censors at trueEventTime·rng(), which is informative
  censoring, so the curve sits about 6 points high: the very flaw the prose
  warns about.
- 05: BH "usually well below q because 90% are null"; the bound is 0.9q, and
  seed 15 at 8 replicates gives an FDP of 7.3%.
- 03: Fig 4 "50-Mb inversion much wider than a 1-Mb duplication"; widths are
  a random span of at least 8 Mb, not segment length.
- 03: circos "designed by Krzywinski in 2009"; published 2009.
- 08: forest-plot square "area proportional to weight"; side is
  5 + 14·√(w/max).

### cohomology

- 04: Fig 2 calls the integral a Riemann sum converging to 2π; wrapped
  atan2 differences give exactly 2πk for any polyline.
- 04: latitude preset "about zero in one hemisphere"; a 45°N circle gives
  2π. Winding around the z-axis is what matters.
- 04: "the polar caps light up"; only 2 of 320 faces are nonzero (±2π next
  to each pole, from atan2(0,0) at the vertex).
- index, 06: "every number over Z/2 or Z/47", "essays 02 to 05 over Z/2";
  04 is over R.
- 04: d(df) terms written in the wrong order (still 0).

### foam

- 02: double bubble "proved in 2002"; announced 2000 (ERA-AMS 6), Annals 2002.
- 01: Fig 1 "settle to a mean of six sides ... converge on three-way forks";
  a Voronoi start already has both. Relaxation changes the angles and
  the spread.
- 03: "In 1887 Lord Kelvin"; Thomson was ennobled in 1892.
- 01: "Pappus assumed no such thing existed"; he compared only the three
  regular shapes.

### decision-trees

- 05: gain ratio "drops the ID column to near zero"; with the page's
  generator at N = 120 it's 0.143, second of four, and first at N = 30 and
  200 (it falls only like 1/log2 N). The caption also gets the features
  backwards: age is strong, job weak, and city has no effect.
- 01: the "Pure-leaf" preset is meant to tie under misclassification. The
  random presets give 0.20 vs 0.10, and Gini prefers the balanced split.
  Build them from exact counts.
- 03: "Extra-Trees is m = 1"; Geurts et al. default to K = p for
  regression, and m = 1 is totally randomized trees.
- 06: missed leaf's true uplift "is the background +8pp"; usually 4-6pp
  (1 of 40 seeds exactly 8).
- 04: gradient boosting credited to Friedman alone; Mason et al. (AnyBoost),
  Breiman's arcing, Friedman-Hastie-Tibshirani 1998 were contemporaneous.

### lattice-simulation

- 05: w0 = 4/9 is "more than the eight moving channels combined" (5/9).
- 05: D2Q9 "smallest isotropic through rank 4"; eight velocities are
  isotropic. Matching the Maxwellian moments is what forces nine.

### lithium-ion

- 03: grid battery "cycle-dominated"; the page's own model gives 78%
  calendar fade at year 5 for the Grid-tied preset.
- 02: η_ct dominates at low current "because Butler-Volmer is steep"; at
  i/i0 = 0.25 it's linear, and η_ct leads because R_ct (43) > R_ohm (18 mΩ·m²).
- 02: η_ct settles "in about a second"; R_ct·C_dl = 7.5 ms by 04's defaults.
- 01: "a millivolt ... tens of percent of SOC"; the LFP slope gives 2-6%.
- 01: NMC "4.2 to 3.3 V"; the series' own cell runs 4.19 to 2.88 V.
- 03: Df ≈ 1.71 "off-lattice, Witten-Sander"; W-S was on a lattice (~1.70),
  1.71 is Meakin's off-lattice value; cryo-EM of plated Li shows whiskers,
  not fractals. (unchecked)
- 03: "EVs are often set to stop at 70%"; usually 80-90%. (unchecked)

### grateful-dead

- 02: the show map drops 260 of 2,260 US shows (127 cities missing from
  `CITY_COORDS`: Jersey City, Kansas City KS, Lake Tahoe, Inglewood, St.
  Paul...), plus the "Oakand, CA" typo; Fig 4 routes use the same filter.
- 02: Northeast loop "at least twice a year"; 1985, 1990, 1992 once, 1989
  never.
- 02: tours going Bay Area -> Pacific Northwest -> Midwest -> East; the data
  goes straight east.
- 02: 1960s ballrooms "a few hundred"; the Fillmore held about 1,300.
- 02: Europe list omits Luxembourg (1972) and UK shows outside London.

### quasicrystals

- 04: Levine-Steinhardt "five weeks later"; 12 Nov to 24 Dec 1984 is six.

### emergence

- 11: intro (sweep) says spatial structure keeps both species alive; on the
  lattice, space makes it harder (λc 0.111 mean-field -> ~0.20).
- 12: outro (sweep) says both species diffuse in 13; only the activator
  does (Dv = 0).
- 02: the sweep restored an unsourced claim about real swarm robots that
  the ledger had deliberately made a claim about the rules.
- 09: "fewer than 1 walk in 100 traps within 10 steps"; exact enumeration
  gives 1.41% by 10 (0.98% by 9).
- 06: 187/91 credited to Mertens and Moore 2018; it's den Nijs 1979 /
  Nienhuis 1982. (Also: Chan 2019 Fig 6 caption confirms Orbium σ = 0.016,
  so the ledger can cite it.)

### modular-forms

- 03: outro (sweep) "every tile touches the real axis at one rational
  point"; the T-translates of F run to i∞, as 04 already says.
- 12: "from c(4) on the combination is not even unique"; every c(n) is
  trivially non-unique via ρ1. Say small-multiplicity decompositions stop
  being unique at c(4) (a ledger fix's wording).
- 13 subtitle, index: "dimensions are the coefficients of j"; of J = j - 744.
- 06: 691 in "almost every later" denominator; asymptotically, almost no n
  have it (a density-1 set gets 691 | σ11(n)); true for early n.
- 14 subtitle: "defining identity is a product formula for j"; it's the
  denominator identity, for j(p) - j(q).

### algorithms-ml

- 04: "the 95% rule keeps 6"; the page's Fig 4 gives 5 (94.7% at 4,
  97.3% at 5).
- 01: Fig 4 "within 0.3 after about fifteen steps"; the mean levels off
  near 0.4 (0.44 at 15), as the caption's own step-50 figure says.
- 01: Fig 2 "flies off above about 3.8"; the dot leaves the chart from
  about 3.15 while the readout still says "bounces", and diverges from 3.85.

### japan-earthquakes

- 07 p8: "three or more stations"; JMA triggers on two or more.
- 02 p13 (ledger [?]): deep events rattle Tokyo "gently"; the 2015 Bonin
  M7.8 at 664 km gave shindo 5+ in Kanagawa.
- 06 p3 (ledger [?]): "roughly the size of Kyushu" is still unsourced.

## Needs a human

The earlier 2026-09-27 leads were worked that day; outcomes are in each
series' `LEDGER.md`. What follows is what those checks left for a human.

### emergence

- Three primary sources are paywalled and unverified (see the ledger's
  unverifiable rows).

### noether

- The ledger's Carroll and Eisenbud section numbers were written from
  memory; confirm them.
- 11: "Dedekind stated ACC in 1894 for rings of algebraic integers" rests on
  one secondary source (Toader, arXiv:2408.08552).

### exceptional-atlas

- 09: the dimension-12 kissing lower bound 841 comes from 2026 arXiv
  preprints (2606.18984, 2609.09179), not refereed work; keep it or fall
  back to 840. Confirm the dimension-9 value 306 against Cohn's table.

### mathematical-diagrams

- 03: Aitchison is credited with powering "in that paper and his 1986
  book"; the 1982 paper's power-transformation section wasn't seen.

### lattice-simulation

- 05: the page says shedding starts near Re 47, the open-flow value. The
  cylinder sits in a narrow channel (D = 22 in 90), which likely raises the
  onset; sweep the slider and see where the figure actually starts shedding.

### lithium-ion

- 03: the Schmalstieg et al. 2014 activation energy (exp(-6976/T), about
  58 kJ/mol) was confirmed through a secondary source, not the paper.

### japan-earthquakes

- Translator review: 03 `p3` and 06 `caption_fault_types` changed in both
  English and Japanese.

## Other open issues

Not claims, but found during checks and not yet fixed.

- mathematical-diagrams 05: about 37 math ids are duplicated (same bug as
  03 had), so a formula written twice may render only its first copy.
- japan-earthquakes 02: at desktop width the "Suruga Trough" label overlaps
  "Osaka"; the Japan Trench fix raised boundary labels above the dots, which
  may make it more visible. 02 wasn't screenshotted at phone width.
- noether 13: Fig 2 still draws the cone upright along z; the caption says
  so, but a redraw on the true axis (x = y, z = 0) would be better.
- foam: `plans/foam/README.md` and `brief.md` still describe the old
  seven-article plan; `PROMPT.md` now matches the three that exist.
- grateful-dead 03: doesn't mention the 1980 acoustic sets (the format
  claims don't depend on them).
