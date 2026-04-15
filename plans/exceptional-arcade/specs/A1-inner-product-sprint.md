# A1 — Inner Product Sprint

## Prerequisite

E8 series **#03 Meet E8: the 240 Roots**. The reader must already know what the 240 roots are, how they split into integer and half-integer families, and why every pair's inner product lies in `{−2, −1, 0, 1, 2}`.

## Mechanic

Two random E8 roots appear side by side as 8-tuples. The reader clicks one of 5 buttons labeled `−2`, `−1`, `0`, `1`, `2` to name their inner product. Correct → next pair, +1 point. Wrong → show the actual inner product computation with each coordinate contribution highlighted, then proceed.

## Round structure

- 10 pairs per round. A round ends when all 10 are answered.
- After the round, show score (out of 10) and best time per pair.
- Optional: "play another round" button keeps the reader going indefinitely.

## Feedback on correct

- Brief green flash around the correct button.
- Button shows a checkmark for ~300 ms.
- Auto-advance to next pair.

## Feedback on wrong

- Red flash around the chosen button.
- Display the two roots with coordinate-by-coordinate products: `(1, 1, 0, 0, 0, 0, 0, 0) · (-1, 1, 0, 0, 0, 0, 0, 0) = -1 + 1 = 0`.
- Annotate: "these two roots are perpendicular — inner product 0."
- Pause 2.5 seconds, then auto-advance.

## Difficulty tiers

- **Tutorial** — both roots drawn from the integer family only (112 roots), no time pressure. The arithmetic is simple integer dot products over at most 2 nonzero components each.
- **Fluency** — both roots drawn from all 240, no time limit, accuracy-scored.
- **Challenge** — 5-second timer per pair, any of the 240. Wrong answer or timeout ends the round.

## Scoring

- Correct count out of round length.
- Fastest correct answer in milliseconds.
- Longest consecutive-correct streak.
- Local high-score stored in `localStorage` keyed by difficulty tier.

## Lib needs

- **From `e8-math.js`:** `E8.roots.all()`, `E8.roots.integer()`, `E8.dot(a, b)`.
- **From `arcade.js`:** `arcade.round({rounds, generator, validator, correctFeedback, wrongFeedback})` which runs a generic round with the four callbacks. Also `arcade.timer(ms, onTimeout)`, `arcade.scoreboard(key)`, `arcade.localStorage(key)` helpers.

## Teaching payload

The reader builds reflexive fluency with:
1. Reading an 8-tuple without stopping to identify its family.
2. Computing an inner product mentally (usually 1 or 2 nonzero terms).
3. Recognizing the five possible values as the only possible values — rare values (+2, −2) only happen for `β = ±α`, and the tutorial tier avoids those to build confidence first.

After ~50 rounds, the reader should be able to dot two E8 roots in under 2 seconds.

## Scope guardrails

- No time-based scoring in the tutorial tier; accuracy only. Speed pressure destroys learners who are still figuring out what they're looking at.
- Wrong answers never penalize score beyond "didn't get it right" — no lives, no game-over, no humiliating animations. Every wrong answer is a learning opportunity, not a punishment.
