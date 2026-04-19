# Exceptional Arcade

A game-first fluency companion to the E8 and octonion series. Fifteen standalone games, each drilling one specific skill you couldn't build through reading alone.

## Locked plan

**Spine.** Not a narrative, not a tour — an arcade. The E8 and octonion series give the reader *understanding*; this project gives them *fluency*. Every file is a self-contained game with a clear goal, scoring, failure-that-teaches, and difficulty tiers. The reader arrives already knowing what E8 is and what octonions are, and leaves with muscle-memory speed at the operations those series introduce. Reading is for comprehension; the arcade is for practice.

**Reader endpoint.** After spending time in the arcade, the reader should have *reflexive* fluency with:
- Computing inner products of E8 roots in their head
- Navigating the Fano plane to find octonion basis products without thinking
- Identifying which E8 subsystem results from deleting a given Dynkin node
- Composing quaternion rotations to reach a target orientation
- Recognizing lattice shell membership from squared length alone
- Decoding Golay codewords from corrupted input
- Tracking Coxeter element orbits by eye
- Naming the octavian unit octonions on sight

This is practice, not learning. The arcade assumes the reader has completed at least one of the narrative series first.

**Identity.** Slug `exceptional-arcade`, title *Exceptional Arcade*, tagline *"Fluency games for the exceptional geometric objects of 8 and 24 dimensions."* Visual register is arcade-flavored but not kitschy — the craft quality of the E8 series, not a 1985 CRT aesthetic. First-person-plural voice, but more sparing than the narrative series (games don't need essays).

**Relationship to existing projects.** Explicit companion. The arcade assumes prerequisite knowledge from:
- **E8 series** (`docs/e8-lattice/`) — for all root, subsystem, lattice, Coxeter games
- **Octonion series** (`docs/octonions/`, when built) — for all octonion, Fano plane, octavian games
- **Parallel-coordinates E8 material** (`docs/parallel-coordinates/18`–`20`) — optional, as a second view of the same objects

Every game file has a prerequisite line: "Assumes familiarity with [specific explainer in narrative series]." Readers who try the arcade first are politely redirected.

**Shape.** Not three acts — **five tracks**, each a themed cluster of 3 games, for a total of 15. Tracks can be played in any order; games within a track progress easy → medium → hard.

- **Track A: Root System Arcade (3 games)**
  - A1 *Inner Product Sprint* — pick the inner product of two displayed E8 roots against a clock.
  - A2 *Dynkin Peeler* — delete nodes to reach a target subsystem type (E7, D7, A1⊕A6, ...).
  - A3 *Weyl Chamber Navigator* — apply simple reflections to move a starting root to a target.
- **Track B: Octonion Arcade (3 games)**
  - B1 *Fano Plane Sprint* — identify the product e_i·e_j for random pairs, timed.
  - B2 *Cayley–Dickson Predictor* — predict a specific component of a doubled product (C→H→O).
  - B3 *Octavian Unit Hunt* — given a candidate 8-vector, decide whether it is an octavian integer unit.
- **Track C: Polytope Arcade (3 games)**
  - C1 *Gosset Face Counter* — given a face of 4₂₁, identify its dimension and type.
  - C2 *Kissing Arrangement* — place unit spheres around a central one; invalid overlaps fail immediately.
  - C3 *Petrie Polygon Trace* — click the next root in the Coxeter orbit before time runs out.
- **Track D: Lattice & Code Arcade (3 games)**
  - D1 *Shell Sorter* — drop vectors into the correct squared-length shell (k = 2, 4, 6, 8).
  - D2 *Hamming Decoder* — given a corrupted [8, 4, 4] codeword, find the nearest valid one.
  - D3 *Golay Nearest Neighbor* — same challenge in 24D with the extended binary Golay code.
- **Track E: Composite Arcade (3 games)**
  - E1 *Quaternion Rotation Puzzle* — reach a target 3D orientation via unit quaternion composition.
  - E2 *Construction A Builder* — assemble E8 lattice vectors from a Hamming codeword via Construction A, scaled.
  - E3 *Coxeter Element Decomposer* — express a given rotation as a specific word in simple reflections.

Fifteen games, five tracks. A reader who completes all five tracks has practiced every operation the two narrative series introduce.

**Per-game shape.** 500–900 lines per file (smaller than narrative-series explainers because there's no prose). Every game has:
- **Prerequisite line** — which narrative explainer this practices.
- **Mechanic** — one-sentence statement of what the player does.
- **Tutorial level** — the player can't lose; shows how controls work, what "correct" looks like.
- **Fluency level** — a fixed-length round with scoring, no time pressure.
- **Challenge level** — timed, adversarial positions, or harder variants.
- **Failure-teaches behavior** — a wrong answer shows the correct one *with the reasoning*, not just the answer. E.g., in Fano Plane Sprint, a wrong product displays the correct Fano plane line with arrows.
- **Progress persistence** — optional localStorage-backed high score, track completion, best time. No login, no server, just per-browser persistence.

**Rendering stack.** D3 + SVG + KaTeX default. Canvas for games with many pieces or animation needs (Petrie Polygon Trace's rotating orbit, Kissing Arrangement's 3D rotation). No three.js, no WebGL, no build step.

**Shared lib.** Three files in `docs/exceptional-arcade/lib/`:
- `arcade.js` — game engine primitives: timer, scoring UI, level progression, localStorage helper, feedback panel scaffolding, prerequisite-check banner. All games import from this.
- `e8-math.js` — a **symlink or hard copy** of `docs/e8-lattice/lib/e8-math.js`. This is a deliberate duplication decision to keep the arcade self-contained; if E8 series lib evolves, we propagate via `Grep` + `Edit` just as we would for standalone explainers.
- `oct-math.js` — same treatment for `docs/octonions/lib/oct-math.js` (once the octonion series is built; for now, stub).

Trade-off: we accept the duplication cost in exchange for the arcade being independently deployable. If the user wants tighter coupling later, we can switch to relative imports.

**Game design commitments.**
1. **Every game has a single, clear mechanic.** No "you can do anything" sandbox modes. If the player doesn't know what to do within 5 seconds of opening the file, the design failed.
2. **Failure is always pedagogically rich.** A wrong answer shows the right answer *plus the reasoning* — the Fano plane line, the subsystem that would have worked, the correct Coxeter orbit position.
3. **No pointless gamification.** No XP bars, no loot boxes, no "daily streaks." Scoring is honest: correct/incorrect and time. Practice, not manipulation.
4. **Tutorial mode can't frustrate.** The easiest difficulty is always winnable by a patient reader who has read the prerequisite explainer.
5. **Games respect the reader's time.** Each session is 2–10 minutes. A game that requires 30 minutes to play is two games in a trench coat.
6. **High scores are local.** No leaderboards, no social features. The opponent is the math, not other readers.

## Phase state

- [ ] **Phase 0** — write game specs for all 15 games (mechanic, scoring, feedback design, difficulty tiers)
- [ ] **Phase 1** — build `arcade.js` (game engine primitives), create the lobby `index.html`, build Track A (Root System Arcade, 3 games)
- [ ] **Phase 2** — build Track B (Octonion Arcade) and Track C (Polytope Arcade)
- [ ] **Phase 3** — build Track D (Lattice & Code Arcade) and Track E (Composite Arcade)
- [ ] **Phase 4** — polish pass: cross-game visual consistency, persistence, prerequisite banners, audit sweep

## Game spec template

Each game spec is ~250–350 words with the following sections:

- **Prerequisite** — the narrative-series explainer this game drills.
- **Mechanic** — one-sentence description of what the player does.
- **Round structure** — how long a round is, how many items per round.
- **Feedback on correct** — what happens when the player gets an answer right.
- **Feedback on wrong** — what happens on a wrong answer, including the pedagogical payload.
- **Difficulty tiers** — tutorial, fluency, challenge. How each differs.
- **Scoring** — what the player sees after a round, what gets persisted.
- **Lib needs** — which existing library functions the game uses; what new `arcade.js` primitives it introduces.

## Files

```
plans/exceptional-arcade/
  README.md                              (this file)
  specs/
    A1-inner-product-sprint.md
    A2-dynkin-peeler.md
    A3-weyl-chamber-navigator.md
    B1-fano-plane-sprint.md
    B2-cayley-dickson-predictor.md
    B3-octavian-unit-hunt.md
    C1-gosset-face-counter.md
    C2-kissing-arrangement.md
    C3-petrie-polygon-trace.md
    D1-shell-sorter.md
    D2-hamming-decoder.md
    D3-golay-nearest-neighbor.md
    E1-quaternion-rotation-puzzle.md
    E2-construction-a-builder.md
    E3-coxeter-element-decomposer.md

docs/exceptional-arcade/
  lib/
    arcade.js                            (game engine primitives)
    e8-math.js                           (copy of docs/e8-lattice/lib/e8-math.js)
    oct-math.js                          (copy of docs/octonions/lib/oct-math.js)
    test.html                            (in-browser sanity checks)
  A1-inner-product-sprint.html
  A2-dynkin-peeler.html
  A3-weyl-chamber-navigator.html
  B1-fano-plane-sprint.html
  B2-cayley-dickson-predictor.html
  B3-octavian-unit-hunt.html
  C1-gosset-face-counter.html
  C2-kissing-arrangement.html
  C3-petrie-polygon-trace.html
  D1-shell-sorter.html
  D2-hamming-decoder.html
  D3-golay-nearest-neighbor.html
  E1-quaternion-rotation-puzzle.html
  E2-construction-a-builder.html
  E3-coxeter-element-decomposer.html
  index.html                             (the arcade lobby; built in Phase 1 as the entry point)
```

## Dependencies and build order

The arcade builds on the E8 and octonion series:

1. **E8 series must be complete** before Track A, Track C, Track D (Shell Sorter), and Track E (Quaternion Puzzle uses quaternions but for the composition game; Construction A Builder; Coxeter Element Decomposer) can be built. That means Phases 1–3 here depend on `docs/e8-lattice/` being finished first. (It is.)
2. **Octonion series should be complete** before Track B and parts of Track E. The octonion lib needs to exist with `OCT.oct.mul`, `OCT.octavian.isUnit`, and Cayley–Dickson helpers. Until then, Track B is a placeholder.
3. **Parallel-coordinates E8 material** is a nice reference but not a hard prerequisite.

If the octonion series is not complete when arcade work begins, Phase 2 (Track B) should be deferred and the arcade ships with Tracks A, C, D, E only (12 games) until octonion content is ready.

## What the arcade will *not* do

- **Teach concepts.** The arcade assumes concepts are already understood. If the player doesn't know what "apply a simple reflection" means, they're in the wrong place — the narrative series is upstream.
- **Tell stories.** Historical context, biographical asides, and mathematical narrative are out of scope. Those live in the narrative series. The arcade is pure practice.
- **Compete with other readers.** No leaderboards, no social scores. The feedback loop is between the player and the math.
- **Expand the math.** No new theorems, no new objects beyond what E8 and octonions introduce. The arcade's job is drill.
- **Be exhaustive.** Not every operation from E8 or octonions gets a game. We pick 15 that are highest-leverage for fluency, and the rest stay as sandbox interactives in the narrative series.
