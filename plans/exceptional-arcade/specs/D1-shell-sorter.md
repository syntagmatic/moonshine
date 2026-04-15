# D1 — Shell Sorter

## Prerequisite

E8 series **#10 From Roots to Lattice**. The reader must already know that the E8 lattice is infinite, that its vectors group by squared length into "shells," and that the first several shell counts are 1, 240, 2160, 6720, 17520, …

## Mechanic

A lattice vector is displayed as an 8-tuple. Four (or more) labeled bins appear: `k = 2`, `k = 4`, `k = 6`, `k = 8`. The reader drags the vector into the correct bin (the bin whose label matches the vector's squared length). Correct → the vector disappears into the bin, +1 point. Wrong → the vector bounces back and the correct bin briefly highlights.

## Round structure

- 12 vectors per round.
- Vectors drawn randomly from shells 2, 4, 6, 8, roughly uniformly distributed.
- End of round shows score and accuracy.

## Feedback on correct

- Bin glows green briefly as the vector "lands" in it.
- Score increments, next vector appears.

## Feedback on wrong

- Vector bounces back to starting position.
- Correct bin highlights in amber for 1 second.
- Small callout: "this vector has squared length `4`, not `2`" with the arithmetic shown (e.g., `1² + 1² + 1² + 1² + 0·4 = 4`).

## Difficulty tiers

- **Tutorial** — only two bins (`k = 2` and `k = 4`). Vectors are purely integer, all with obviously integer squared lengths.
- **Fluency** — four bins (`k = 2, 4, 6, 8`). Mix of integer and half-integer vectors.
- **Challenge** — 20-second timer for the full round of 12. Half-integer vectors more common; the reader must compute `8 × (1/2)² = 2` quickly.

## Scoring

- Correct count out of 12.
- Per-shell accuracy (the reader sees which shells they struggle with).
- Best round time and best accuracy separately tracked.

## Lib needs

- **From `e8-math.js`:** `E8.lattice.shell(k)`, `E8.squaredLength(v)`.
- **From `arcade.js`:** `arcade.dragAndDrop(item, bins, onDrop)` — a drag-and-drop primitive returning which bin received the item. Also `arcade.scoreboard`, `arcade.timer`.
- **Inline:** vector display formatting that handles both integer and half-integer coordinates cleanly (`(1, 1, 0, ...)` vs `(½, ½, ½, ½, ½, ½, ½, −½)`).

## Teaching payload

The reader builds:
1. Quick mental computation of squared length for both integer-coordinate vectors (just sum of squares of non-zero entries) and half-integer vectors (always `8 × 1/4 = 2` if all coordinates are ±½, or more generally a multiple of `1/4`).
2. Recognition that half-integer vectors always have squared length a multiple of 2 (since they always have all 8 coordinates as ±½ and the squared length is always 2, or higher shells are integer-coordinate).
3. Distinction between "root" (shell 2) and "larger lattice point" (shells 4, 6, 8). The lattice is much bigger than just its roots.

## Scope guardrails

- Only four shells shown as bins (k = 2, 4, 6, 8). Larger shells exist but stretching to 10+ makes the computation tedious without pedagogical payoff.
- No visualization of the lattice as a point cloud — the game is about per-vector arithmetic, not geometric intuition.
- The reader never generates lattice vectors themselves; they're all pre-generated from `E8.lattice.shell()` and sampled.

## Scope note on vector display

Half-integer vectors with all 8 coordinates in {−½, +½} are part of shell 2. Vectors in shells 4, 6, 8 can have half-integer coordinates too but with some components > 1/2, so they need compact display. Use Unicode fractions (`½`) and minus signs for readability.
