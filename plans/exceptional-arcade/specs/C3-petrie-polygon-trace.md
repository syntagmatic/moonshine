# C3 — Petrie Polygon Trace

## Prerequisite

E8 series **#08 The Coxeter Plane**. The reader must already know that the Coxeter element has order 30, that applying it repeatedly to any root traces out a 30-vertex regular polygon (the Petrie polygon), and that the 240 roots split into 8 orbits of 30 under this action.

## Mechanic

The Coxeter-plane projection of all 240 roots is displayed in light gray. One root is highlighted in red. The reader must click the next position in the orbit — where the red root will land after applying the Coxeter element `c` once. Correct → the red position advances to the clicked spot, and the reader continues tracing the polygon. Wrong → the correct next position flashes, the streak resets.

## Round structure

- A round is one complete Petrie polygon orbit: 30 successive correct clicks trace the whole 30-gon back to the starting root.
- Rounds can overlap orbits (the 8 orbits give 8 distinct polygons to trace), chosen randomly.
- The reader's best streak (longest consecutive correct clicks) is the round score.

## Feedback on correct

- The red highlight moves to the clicked position with a brief animation.
- A thin red line segment connects the old position to the new one, building up the Petrie polygon as the round progresses.
- Streak counter increments.

## Feedback on wrong

- Red flash on the clicked wrong position.
- The correct next position highlights in amber briefly.
- Streak resets to 0.
- Current red position does *not* advance — the reader can try again from the same start.

## Difficulty tiers

- **Tutorial** — the correct next position is faintly marked (small dot) before the reader clicks. They just have to click on it. This builds visual recognition.
- **Fluency** — no marker. The reader must predict by reading the rotational pattern (each step is 12° counter-clockwise in the Coxeter plane).
- **Challenge** — 2.5-second timer per click. Runs out → counts as wrong, streak resets.

## Scoring

- Longest streak in a round.
- Fastest complete orbit (30 consecutive correct clicks in the shortest total time).
- Total correct clicks across all sessions.

## Lib needs

- **From `e8-math.js`:** `E8.roots.all()`, `E8.coxeterApply(r)`, `E8.project.toCoxeterPlane(r)`.
- **From `arcade.js`:** `arcade.scoreboard`, `arcade.timer`, `arcade.streakCounter`.
- **Inline:** a Voronoi-style "click nearest root" helper — converts click coordinates to the nearest of the 240 projected roots.

## Teaching payload

The reader internalizes the 12° rotational step of the Coxeter element acting on the Coxeter plane. After many rounds they can predict the next step in an orbit without conscious computation. This builds:
1. Visual fluency with the Coxeter plane's 30-fold symmetry.
2. Understanding that the 8 Petrie polygons are concentric and rotate in lockstep.
3. Intuition for why the Coxeter number is 30 (the polygons close after exactly 30 steps).

## Scope guardrails

- The game is about tracing, not about constructing. The Coxeter plane is pre-computed via the `e8-math.js` lib; the reader never sees the eigendecomposition.
- Only the minimal shell is traced (squared length 2). Higher shells also have Petrie polygons but are out of arcade scope.
- The game doesn't teach *why* the orbits close after 30 steps — that's covered in the narrative explainer. Here we practice the visual pattern, not the reason.

## Scope note on interaction

The "click near the next root" mechanic requires hit-testing against 240 projected points. The simplest implementation: compute each root's screen position, find the nearest one within a click tolerance (say, 15 pixels). If no root is within tolerance, count as a miss (not a click). This keeps the game responsive without penalizing near-misses that are obviously not targeting any root.
