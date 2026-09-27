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

None. The 2026-09-27 hunt's leads (about 95, every series but sph) were
worked the same night, one commit per series (1413b3e..a33b6b0); outcomes
are in each series' `LEDGER.md` (cohomology and foam: the Claims section).
Add new leads here under a `### <series>` heading.

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
- 09: the Delsarte LP upper bounds (46.34, 82.63, ... 37974) were
  recomputed with an LP solver, not copied from Odlyzko-Sloane 1979; the
  caption says so. Compare against the printed table.

### mathematical-diagrams

- 03: Aitchison is credited with powering "in that paper and his 1986
  book"; the 1982 paper's power-transformation section wasn't seen.

### decision-trees

- 04: the Breiman arcing papers (dated loosely 1997-1999) and the claim
  that they read boosting as optimization were written from memory.

### lattice-simulation

- 05: the page says shedding starts near Re 47, the open-flow value. The
  cylinder sits in a narrow channel (D = 22 in 90), which likely raises the
  onset; sweep the slider and see where the figure actually starts shedding.

### lithium-ion

- 03: the Schmalstieg et al. 2014 activation energy (exp(-6976/T), about
  58 kJ/mol) was confirmed through a secondary source, not the paper.
- 03: the DLA attribution, the cryo-EM dendrite claim and "EVs stop
  charging at 80 or 90%" were fixed from memory, not re-fetched sources.

### japan-earthquakes

- Translator review: 03 `p3` and 06 `caption_fault_types` changed in both
  English and Japanese.
- Translator review (hunt fixes): 07 `p8` heading and body (2局以上),
  07 `caption_simulation`, 07 timeline aria text and label (2地点で検出),
  02 `p13` last sentences (uses the catalog's M7.8; JMA gives M8.1).
- 06 p3: "roughly the size of Kyushu" is still unsourced; cite a
  fault-slip model or cut the clause.

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
- grateful-dead 02: 124 venues were geocoded from the 2023 Census
  Gazetteer; places it lacks are plotted at the containing or nearest place
  (listed in a code comment). One US show has no city and stays off the map.
- algorithms-ml 05 (from the first `/critique` trial run, 2026-09-27; its
  six recomputed claims all held):
  - Figs 2-4 are empty or flat at load. Pre-run a seeded flip sequence.
  - Figs 3-4 use unseeded `Math.random`.
  - Figs 2-4 are all the same Beta-curve chart; Fig 2 could show
    prior x likelihood = posterior instead.
  - Fig 1's "blue column" and "amber strip" read as red dashes.
  - Colors collide across figures (red, amber, and the cyan/blue for
    "posterior").
  - Fig 3's legend is struck through by the curves.
  - The ledger's post-fix state lives in AUDIT.md, not LEDGER.md.
