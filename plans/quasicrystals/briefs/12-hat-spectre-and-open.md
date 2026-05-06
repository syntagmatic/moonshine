# 12 - The Hat, the Spectre, and what's still open

## Pitch

Close the series with a fifty-year-old question that was finally answered in 2023 — and the questions still open behind it. The *einstein problem* asks: does there exist a single tile that tiles the plane only aperiodically? Penrose's two-tile system from 1974 settled the two-tile case. The one-tile case stayed open for half a century until David Smith, an amateur tiler from East Yorkshire, sent a sketch to Joseph Myers in November 2022. Together with Craig Kaplan and Chaim Goodman-Strauss, they posted "An aperiodic monotile" in March 2023. The shape — a 13-sided polykite with no name in the literature — they called *the Hat*. Reflections were required, which made many object that the Hat was strictly a one-tile-up-to-reflection answer rather than a single chiral tile. Three months later the same authors posted "A chiral aperiodic monotile" describing the *Spectre*: a related shape that tiles aperiodically with no reflections needed. Both questions: closed.

The series's natural endpoint is to use the closure as a frame for what remains open. Three problems the essay should name. First, the equivalence question of essay 11 is still open in full generality: precisely which substitution tilings are model sets? Which have pure-point diffraction? The Pisot conjecture (Solomyak 1997, Bombieri & Taylor 1986) — that every PV-substitution tiling has pure-point diffraction in some appropriate sense — is open in dimensions ≥ 2. Second, the natural-quasicrystal question: is icosahedrite the only natural quasicrystal? After 2009, several other natural samples were identified, all from the same Khatyrka meteorite. Whether terrestrial natural quasicrystals exist is unknown. Third, the *spectral gap* question: do the Bragg peaks of an H₃ quasicrystal have a positive minimum spacing in 3D? The 1D and 2D answers are yes (Meyer's theorem); the 3D case is more subtle.

The essay should not pretend to resolve any of this. Its job is to leave the reader at the live edge.

## Math basis

The Hat tile is a 13-sided polykite (each side is one of 13 unit-kite edges). Smith–Myers–Kaplan–Goodman-Strauss prove aperiodicity via a hierarchical substitution argument: the Hat decomposes into smaller Hats (with chirality flips) at four-tile level, and the resulting hierarchy admits no non-trivial translation symmetry. The Spectre tile is geometrically related but with all-edges-equal arcs forcing chirality preservation. The connection to cut-and-project is not yet fully understood; whether the Hat's vertex set is a model set in some formulation is open.

## Figures

1. **The Hat** (interactive, hero): the 13-sided tile with reflections allowed. Reader places tiles to build a patch; the figure flags rule violations and chirality flips. The hierarchical four-tile substitution is overlaid as an option.
2. **The Spectre** (interactive): same affordance for the chiral version. Reader sees that no reflection is required.
3. **Penrose vs. Hat** (static comparison): Penrose's two-tile system (kite-and-dart) next to the Hat's one-tile system. Annotated with "1974" and "2023."
4. **The einstein-problem timeline** (static): 1961 Wang's tile-set conjecture; 1966 Berger's first aperiodic Wang set (~20,426 tiles); 1971 Robinson (six tiles); 1974 Penrose (two tiles); 2023 Smith–Myers–Kaplan–Goodman-Strauss (one tile, the Hat / Spectre).
5. **Open questions card** (static): three named open problems with brief framing — Pisot conjecture, natural-quasicrystal census, spectral-gap dimension question.

## Key terms

- `einstein problem`: the question of a single aperiodic tile (German *ein Stein*, "one stone"; pun intended).
- `the Hat`: 13-sided polykite tiling aperiodically with reflections allowed (SMKG 2023).
- `the Spectre`: a chiral relative of the Hat tiling aperiodically without reflections (SMKG 2023, follow-up).
- `Pisot conjecture`: every PV-substitution tiling has pure-point diffraction in an appropriate sense.
- `polykite`: a polyform built from kite-shaped unit cells.

## Misreadings to avoid

- Do not present the Hat as "settling" the einstein problem unconditionally. The reflection ambiguity was real; the Spectre paper resolved it three months later; the literature now treats the question as closed in both forms.
- Do not claim the Hat is a model set. Whether it has a cut-and-project realisation is open as of the writing of this brief; the construction is hierarchical-substitution, not projection.
- Do not collapse the open questions into "still some technical loose ends." The Pisot conjecture is genuinely difficult; the natural-quasicrystal question is empirical and may be settled by further meteorite samples; the spectral-gap question is mathematical and open.
- Do not end on uncritical celebration. The Hat is a real result; the einstein problem closing is real progress; but essay 11's broader landscape — the four definitions, undecidability, pure-point spectrum conditions — is the live edge of the field, not the Hat alone.

## Library substrate

- The Hat and Spectre are not in squishy-thing's scope. A small inline implementation in `quasi-viz.js` is appropriate for figures 1 and 2.
- The series can link to the original SMKG papers (arXiv:2303.10798 and the Spectre follow-up) and to the interactive Hat-tile pages maintained by Craig Kaplan.

## Bridge notes

Essay 11 opened the question of where cut-and-project ends; this essay closes the einstein problem inside that broader question and points to three open ones. The series ends here. A natural cross-link is to `parallel-coordinates/17-quasicrystals.html` — the existing single-chapter version — which the index page should now subordinate to this series.

## Reader takeaway

In 2023, Smith, Myers, Kaplan, and Goodman-Strauss produced the first single-tile aperiodic tiling: the Hat (with reflections) and three months later the Spectre (chiral, no reflections needed). The einstein problem is closed. Three larger questions remain open: precisely which substitution tilings have pure-point diffraction; whether terrestrial natural quasicrystals exist; whether the spectral-gap property of 1D / 2D model sets extends to 3D. The series ends here, at the live edge.
