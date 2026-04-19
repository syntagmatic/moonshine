# C1 — Gosset Face Counter

## Prerequisite

E8 series **#06 The Gosset Polytope 4₂₁**. The reader must already know that the 240 roots are the vertices of a uniform 8-polytope, that faces at each dimension have specific counts, and that the counts come from Gosset's 1900 enumeration.

## Mechanic

A face description appears at the top: a dimension (0 through 7) and a face type (e.g., "triangular faces," "7-simplex facets," "tetrahedral cells"). Four candidate counts appear below as buttons. The reader clicks the one they believe is correct.

## Round structure

- 8 challenges per round, one per face dimension from vertices (0) up to facets (7).
- At dimension 7 where facets split into 7-simplices (17,280) and 7-cross-polytopes (2,160), these appear as separate challenges.
- Challenge order is shuffled each round.

## Feedback on correct

- Green flash on chosen button.
- Brief display of the count with its derivation sketch: "17,280 = Weyl orbit of one facet, stabilizer order X."
- Auto-advance.

## Feedback on wrong

- Red flash.
- Display the correct count and a brief explanation: "triangular faces = 60,480, from Weyl orbit of a single face."
- Comparison line: "you picked 6,720 — that's the edge count. Triangular faces are one dimension up."
- Pause 3 seconds, then advance.

## Difficulty tiers

- **Tutorial** — distractors are clearly wrong (e.g., for vertices, the 4 choices are {120, **240**, 480, 960}). Differences are orders of magnitude.
- **Fluency** — distractors are plausible (for a given dimension, the 4 choices are all drawn from the Gosset face count list, requiring the reader to actually know which count belongs to which dimension).
- **Challenge** — 10-second timer per challenge. Distractors include off-by-one and off-by-factor answers.

## Scoring

- Correct count out of 8.
- Perfect-run streaks.
- Per-dimension accuracy tracked separately (show the reader which dimensions they're weakest on).

## Lib needs

- **From `arcade.js`:** `arcade.round`, `arcade.scoreboard`, `arcade.timer`.
- **Inline:** a hardcoded face-count table. Face counts of 4₂₁ are fixed constants:
  - Dimension 0 (vertices): 240
  - Dimension 1 (edges): 6,720
  - Dimension 2 (triangular faces): 60,480
  - Dimension 3 (tetrahedral cells): 241,920
  - Dimension 4: 483,840
  - Dimension 5: 483,840
  - Dimension 6: 207,360
  - Dimension 7 (7-simplex facets): 17,280
  - Dimension 7 (7-cross-polytope facets): 2,160
- Distractors drawn from neighboring dimensions and common off-by-factor answers.

## Teaching payload

The reader develops quick recall of the 4₂₁ face counts. More importantly, they build intuition for what each count *means* — that 6,720 edges means 240 × 56 / 2 (each vertex has 56 edge-neighbors), that 60,480 triangular faces follow from Weyl orbit counting, and that the facet split (17,280 + 2,160) is the signature of a uniform-but-not-regular polytope.

## Scope guardrails

- No Hasse diagram of face incidences — that's deeper than fluency work warrants.
- No face-gluing animation — the arcade shows numbers, not construction.
- The vertex-figure connection (the 56 neighbors of a vertex form a 2₃₁ polytope) is *not* part of this game. Fluency with counts, nothing more.
