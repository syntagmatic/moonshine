# Findings: prose pass, data track

Series: `docs/parallel-coordinates/` (12 + index), `docs/decision-trees/` (6 + index),
`docs/algorithms-ml/` (6 + index). All 27 pages pass render-check.

## Numbers

Word counts cover reader-visible text outside `<script>`, `<style>`, `<svg>` and math, so
they include button labels, readouts and figure labels. The pass did not touch those, so
the running prose was cut more than these totals show. "Em dashes" counts visible text
plus JS string literals.

| series | words before | after | change | em dashes before | after |
|---|---|---|---|---|---|
| parallel-coordinates | 11961 | 10170 | -15% | 34 + 1 JS | 0 |
| decision-trees | 5386 | 4988 | -7% | 60 + 7 JS | 0 |
| algorithms-ml | 6989 | 5904 | -16% | 4 | 0 |
| total | 24336 | 21062 | -13% | 98 + 8 JS | 0 |

The cut is below the 20-30% target, for three reasons:

- The previous track had already rewritten PC 06 and 12 and decision-trees 06. Those
  pages got a light touch.
- Decision-trees prose was already tight. I re-read 01 after the pass, and cutting more
  would have lost content.
- UI text is included in the counts.

Only code comments still contain em dashes.

Three changes apply across all three series:

- `<title>` separators changed from " — " to " | ".
- Decision-trees stat-box "—" placeholders are now blank, and a missing value shows "n/a".
- The decision-trees index title "Eight Chapters" is now just "Decision Trees", since the
  series has six chapters.

## Worst patterns found

- Captions that repeated the paragraph before them and then the click hint. This showed
  up in nearly every figure in PC 07/08/10/11 and algorithms-ml 01/04/05. PCA stated
  "the direction of max variance is PC1" three times.
- Bold lead-in paragraphs used as fake callouts: PC 01/05/06/07/08, captions in
  decision-trees, and Momentum/Adam in algorithms-ml 01.
- Grand closers and aphorisms: PC 07 "Every brush is a geometric operation", decision-trees
  05 "Two views" (a near-verbatim repeat), algorithms-ml 05 "Being Less Wrong", 04
  "Variance is information".
- Staccato triplets ("Not 95%. Not even close.", "It has no teacher. It has no labeled
  examples.") and not-X-but-Y lines ("This is a theorem, not a visual coincidence").
- "Envelope" used as a buzzword where nothing computes an envelope (PC 09, 10, 11).

## Errors confirmed and fixed (wording only; no figure code changed)

- **PC 02:** "the crossing pattern *is* the distribution" was an overclaim; I replaced it.
- **PC 03:** the text conflated the locus of convergence points with the envelope. It now
  says the convergence points of the tangents trace the dual curve, which is also the
  envelope of the segments.
- **PC 03:** the cusp/inflection mechanism was backwards. It now says an inflection
  becomes a cusp in the dual, and a cusp becomes an inflection.
- **PC 03:** the parabola's dual is now called a hyperbola, not just a "rational curve".
  Derivation: tangent at (a, a²) maps to u = 1/(1−2a), y = −a²/(1−2a), which gives
  u² + 4uy − 2u + 1 = 0 with discriminant 16 > 0.
- **PC 05:** the per-axis Mahalanobis split is exact only for diagonal covariance. The
  figure's data is independent per axis (checked in code), and a sentence now says so.
  The "next explainer formalizes brushing" link now points to article 7.
- **PC 04:** the crossing-patterns link pointed at 01; it now points at 02.
- **PC 06:** the text implied a circle's hstar is not a hyperbola. It is: the PC map is a
  projective correlation, and any ellipse has two tangents of slope 1.
- **PC 07:** the Fig 2 caption had the brush bands swapped. X2 is the horizontal axis in
  the code. I also softened "strictly more expressive".
- **PC 09:** Fig 4's "dangerous region" is a per-axis bounding box of the dangerous
  samples, not an envelope of the collision hypersurface. The prose claimed safe
  polylines stay outside it, which doesn't follow, since CPA depends on coordinate
  differences. The prose now describes what is drawn. The section is renamed "Where the
  Dangerous Pairs Sit".
- **PC 11:** added the caveat that a weighted sum only reaches the convex part of the
  Pareto front. The "envelope" framing is replaced.
- **PC 12:** the Fig 5 caption said a self-dual polytope looks like its dual "up to
  rotation", which contradicts the page's point that rotation changes the picture.
  Reworded.
- **Decision-trees 01:** "averaging many trees in chapters 3 and 4" now reads
  "combining". Boosting (chapter 4) doesn't average.
- **Decision-trees 05:** the Fig 2 caption described TreeSHAP on a forest. The code is a
  hand-written pricing formula with a fixed reference-house baseline and exact subset
  enumeration. The caption now says that.
- **Algorithms-ml 04:** reconstruction error "equals" the variance of the dropped
  components is now "is proportional to". The sum of squares is n (or n−1) times the
  variance.
- **Algorithms-ml continuity:** 02 now opens with a pointer back to 01, and its
  learning-rate recap is reduced to a pointer. Back links all read "Algorithms & ML".

## Suspected errors, not fixed

- **PC 09 history:** the page called collision detection "Inselberg's original
  motivation". My understanding is that he conceived PC as a geometry question around
  1959, and air-traffic conflict work came later. It is softened to "one of the early
  applications" and needs a primary source.
- **PC 11 Fig 5:** "click a polyline to find weights that favor it" can't succeed for a
  Pareto point in a non-convex dent. I didn't inspect the code.
- **PC 08:** the claim that "young patients with disease have more extreme values" was
  kept. I didn't check whether the synthetic generator encodes it.
- **PC 05:** means and stds are computed with the 5 injected defects included, which
  deflates D slightly. This is figure code.
- **PC 06:** the circle band "pinching toward the extremes" is loosely worded and not
  checked against the figure.
- **Decision-trees 03:** "Extra-Trees is m = 1". Geurts et al.'s default is K = √p for
  classification and p for regression. m = 1 is "totally randomized trees".
- **Decision-trees 04:** "boosting wins on tabular data because errors come more from
  bias than variance" is a folk explanation.
- **Algorithms-ml 04:** the elbow at "2 to 3 components" is not checked against the
  generated data.
- **Algorithms-ml 05:** the 73% interval example is illustrative, not computed. The CI
  gloss is the usual loose one.

## Needs a human

- **Decision-trees index:** header panel 4 is labelled "unbound" and draws the deleted
  chapter 07's MCTS tree. It should become a causal-trees glyph. There is also dead
  drawing code for the 07/08 cards.
- **PC index:** dead `createThumb` calls for 11 deleted cards remain.
- **PC 08 into 05:** the reviewer's merge suggestion is still open. The two overlap on
  outliers.
