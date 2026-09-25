# Prose pass findings: atlas track

Series: exceptional-atlas, quasicrystals, foam, grateful-dead.

The word counts are visible text only. Script, style and HTML comments are
stripped, and inline TeX is excluded. The counts still include figure labels
and UI text, so the drop in prose alone is a bit larger than these numbers show.
The em dash counts cover the page text, including `<title>`, and JS string
literals.

## Numbers

| series | words before | after | change | em dashes before (html + js) | after |
|---|---|---|---|---|---|
| exceptional-atlas | 16,316 | 13,691 | -16% | 39 + 9 | 0 |
| quasicrystals | 5,848 | 5,848 | 0 | 0 | 0 |
| foam | 3,064 | 2,723 | -11% | 25 + 1 | 0 |
| grateful-dead | 5,619 | 4,804 | -15% | 0 | 0 |

Per page:
- **exceptional-atlas:**
  - index: 238 to 238
  - 01: 1595 to 1429
  - 02: 1349 to 1099
  - 03: 1143 to 1057
  - 04: 1964 to 1608
  - 05: 1436 to about 1150
  - 06: 1517 to 1285
  - 07: 1847 to 1404
  - 08: 1844 to 1730
  - 09: 3383 to 2700
- **foam:**
  - 01: 1158 to 1063
  - 02: 900 to about 760
  - 03: 755 to 647
  - index: untouched
- **grateful-dead:**
  - 01: 1207 to 1175
  - 02: 1153 to 842
  - 03: 1524 to 1106
  - 04: 1339 to 1285
  - index: untouched

Several pages come in under the 20 to 30 percent target on purpose:
- EA 01, 03 and 08, foam, and GD 01 and 04 were rewritten by the last track and
  are already lean. Cutting more would have dropped derivation steps or content.
- quasicrystals was rewritten just before this pass. I grepped it for slop and
  read it through, found nothing worth changing, and left it untouched.

Every page title in the cluster now uses " · " as its separator, for example
"The Octonions · Exceptional Atlas".

## Worst patterns found

- **Bold lead-ins:** EA 02 had "Why this matters", "Three things to notice" and
  "The structural punchline". EA 09 had "Why rootless matters". GD 04 had a
  bolded lead-in on Drums/Space.
- **Liturgical flourishes in GD 03:** "hardened into liturgy", "closing prayer",
  "the universe made sense", "No ambiguity, no lingering". It also had a "start
  bright ... close with a bang" tricolon and a paragraph on the encore as a
  social contract.
- **Repetition:**
  - EA 04 listed the surviving Dynkin diagrams three times, then again in a
    nine-pill tile strip. The strip and its CSS are removed.
  - GD 02 had a whole section, "Home Base and the Circuits", that restated the
    intro and the map section. I removed its heading and moved each fact it
    alone held into the section that already covered that topic. No number was
    lost.
  - GD 03 told the Drums/Space history twice.
- **Grand closers:**
  - foam 01: "Not just the regular tilings... Everything."
  - foam 03: "the same trap as the honeycomb"
  - GD 02: "from a band into an institution" and "sustain a career, not burn
    through one"
- **Em dashes:** EA 09 held 31 of the cluster's 74.

## Errors confirmed and fixed

Checked by derivation or definition. None changes figure code logic apart from
two JS verdict strings.

- **EA 02:**
  - The intro said one simple reflection, iterated, reaches all 240 E8 roots. A
    reflection is an involution, so iterating it reaches at most 2 roots. The
    text now credits the eight simple reflections together, which is what
    Figure 3 does.
  - It called the Weyl group the invariant that distinguishes simple Lie
    algebras, but B_n and C_n share one. The sentence is removed.
  - "Reduces to classifying finite reflection groups" was too broad: H3, H4 and
    I2(m) have no Lie algebra. It now says "such sets", meaning finite,
    reflection-closed, with integer Cartan integers.
  - "Unique sign choice" for the sl2 triple is now "rescaling e and f". The pair
    is unique only up to e -> ce, f -> f/c.
- **EA 04:**
  - The Coxeter/Platonic aside said the inequality classifies all finite Coxeter
    groups. It is narrowed to finite triangle groups.
  - The F4 chain exclusion is attributed to the positivity test. The valency
    bound does not exclude it.
- **EA 01:** Dropped "the cross product exists in three dimensions because R^3
  is this Lie algebra". A 7-dimensional cross product also exists, so the line
  misleads.
- **EA 05:**
  - The 24 elements of 2T were labelled "icosian". They are the Hurwitz units.
  - "Platonic rotations" is now their double covers.
  - Dropped "first step toward monstrous moonshine". The moonshine observation
    (1978) predates McKay's correspondence (1980).
- **EA 06:** The S7 tooltip "largest parallelizable sphere that will ever exist"
  is now "No higher sphere is parallelizable (Bott, Milnor, Kervaire 1958)".
- **EA 07:** The Cartan matrix text implied every off-diagonal entry is -1.
  Entries between unjoined nodes are 0.
- **EA 09:**
  - It said Voronoi cells "start overlapping" past the packing radius. Voronoi
    cells never overlap. It now says a perturbed point can leave the original's
    cell.
  - The Figure 12 caption said two flips can decode to a wrong codeword. The
    code is extended Hamming [8,4,4]: two flips leave the word at distance 2 from
    the original and at least 2 from every other codeword, so a tie is the worst
    outcome. A wrong decode needs 3 flips or more. The caption and the JS verdict
    text are fixed.
  - It said Co0 has three sporadic groups "as quotients". Co2 and Co3 are
    subgroups (stabilisers), as the page's last paragraph already said.
  - It said the Leech lattice comes from gluing E8^3 via the hexacode. E8^3 is
    unimodular and cannot be enlarged. The text is rewritten around three
    orthogonal copies of sqrt2 E8, glued by a Turyn-type construction.
  - The Cohn-Elkies gap "remained open for decades" is fixed; the bound dates
    from 2003.
  - "The proof fills 23 pages" is now "appeared in the Annals in 2017".
  - The heading "D8^1" is fixed to D8^+.
  - The minimal vectors "sit at the roots" of the LP polynomial is fixed: it is
    their inner products that do.
  - "Two weeks" contradicted "seven days"; fixed.
- **foam 03:** Cut "the single most symmetric space-filling cell". The cube has
  the same full octahedral symmetry.
- **GD 03:**
  - Dropped "Across 2,300 shows"; only 2,076 have setlists.
  - Dropped "more covers in Set 1". It rests on the hand-made SONG_TYPES and is
    unverified.

## Suspected, not fixed

- **EA 02:** The closing gives Cartan integers in {0, ±1, ±2, ±3, ±4}. For
  β ≠ ±α the values stay within ±3, and ±4 needs β = ±2α, which a reduced root
  system excludes. It is harmless as an upper bound.
- **EA 09:**
  - The Leech rewrite cites Lepowsky-Meurman 1982 (J. Algebra 77, "An
    E8-approach to the Leech lattice and the Conway group") from memory.
    Confirm it.
  - It says Viazovska's function is built from "modular forms of weight 8 and
    12". Her construction uses quasimodular and weakly holomorphic forms, so this
    is probably loose.
  - The timeline entry "1905 Minkowski" is unverified.
  - The Delsarte LP values for d = 5, 6, 7, 9, 10 and 16 are still unverified,
    carried over from the e8 findings.
- **EA 06:** Moufang identity 4 is labelled "flexible variant". It is another
  form of the middle Moufang identity.
- **foam 02:** "Twenty minutes on a 1995 PC" (Hass-Hutchings-Schlafly) is
  unverified.
- **foam 03:** "The square faces stay nearly flat". I believe the quadrilateral
  faces of Kelvin's relaxed cell are exactly planar (their edges curve, and the
  hexagons become saddles). If a source confirms that, change "nearly flat" to
  "flat".

## Needs a human

- **GD 03:** The SONG_TYPES hand classification still colors Figures 2 and 3.
  This is a known open item, untouched.
- **foam 03:** The relaxation is still only described, not shown. Carried over.
- **EA 06:** Dead JS remains: the S7 "navigator" ("NAV-LOCK ACHIEVED!") has no
  DOM element. It is invisible, so I left it. The Figure 7 detail panel keeps a
  left-border accent box as its interactive readout.
- **EA 04:** The solver has a "D3 = A3" branch that the sliders (minimum 2)
  cannot reach. It is dead code.

## Gate

- **Reader-visible em dashes:** 0 across all four series. The check strips
  script, style and comments, and separately scans JS string literals. The
  remaining em dashes in `exceptional-atlas/lib/*.js` are all in code comments.
- **Render check:** `render-check.mjs` passes on all 17 touched pages at
  http://localhost:8112. Port 8102 was held by a stale server from another
  worktree.
- **Re-reads:** full re-reads of foam 02, GD 03 and EA 05 (by the editing
  passes), plus my review of the foam 03 and GD 02 diffs. All read better; I
  reverted nothing.
