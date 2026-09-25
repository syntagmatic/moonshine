# The Game Is the Math

Fifteen-part interactive series on combinatorial game theory, where every explainer *is* a playable game and the mathematical theory emerges from the play patterns.

## Locked plan

**Spine.** Every combinatorial game is a mathematical object, and playing it is the same activity as computing its theory. Each explainer opens with the reader playing the game against the computer, against themselves, or against another human. The theorems — Grundy values, the Sprague–Grundy theorem, the surreal numbers, temperature theory — emerge from patterns the reader has already seen in their own play. Play first, theorem second, abstraction third.

**Reader endpoint.** By the end of the series, the reader should be able to:
- Play a dozen combinatorial games competently and explain the winning strategy for each.
- Compute Grundy values by hand for simple impartial games.
- Apply the Sprague–Grundy theorem to decompose sums of games.
- Construct the first few surreal numbers from Left/Right position definitions.
- Read a game value like `{2 | -1}` and explain what it means.
- Understand why Hex has no draws and why the first player wins.
- Analyze a Dots and Boxes endgame using long-chain rules.

Not just "know the facts" — actually *play* these games and *win* against non-experts.

**Identity.** Slug `game-is-the-math`, title *The Game Is the Math*, tagline *"A tour of combinatorial game theory, one game at a time."* First-person-plural voice matching the SPH-audited register from other Moonshine series. The title is a deliberate homage-adjacent choice; *Winning Ways for Your Mathematical Plays* (Berlekamp, Conway, Guy) is the primary source but the title is distinct.

**Relationship to existing projects.** Disjoint from both E8 and octonion series. Different content area (combinatorial game theory vs. geometry/algebra), different audience (game-curious readers vs. geometry-curious), no shared prerequisites. The three projects will share the Moonshine visual style and `SPH-standard` craft register but nothing else. Not a sequel, not a companion — an independent third track.

**Shape.** Three acts, 15 explainers.

- **Act I — Impartial games (5):** Nim → Green Hackenbush → Grundy values & mex → Sprague–Grundy theorem → misère play.
- **Act II — Partizan games and surreal numbers (6):** Blue-Red Hackenbush → the surreal numbers → simplicity theorem and values of short games → Domineering → temperature and cooling → sums of games.
- **Act III — Games in the wild (4):** Hex and positional games → Go endgames (CGT applied to real Go) → Dots and Boxes → loopy games and connections outward.

**Per-explainer shape.** 1000–1500 lines depending on mathematical depth. 4–7 interactive figures each. One figure is *always* the playable game itself — not a demonstration, not a sandbox, a game you can win or lose. Other figures cover: the mathematical machinery (Grundy value computers, game-tree explorers, surreal number renderers), proof sketches where they fit, historical context.

**Game-first pedagogy commitments.**
1. **Every explainer opens with play.** Before any theory, the reader plays the game. Against the computer (with optimal strategy), against themselves on separate boards, or in a puzzle challenge. At least 2 minutes of genuine gameplay before the first theorem.
2. **Every game has a "play vs computer" mode** where the computer uses the optimal strategy. The reader discovers the theory by losing against the computer and asking why.
3. **Every theorem is introduced via a play pattern** the reader can reproduce. "Notice that positions with this property always lose for the player to move. That's not a coincidence — here's the theorem."
4. **Failure modes are pedagogical.** When the reader loses, the explainer shows the losing position's game value, the optimal move they missed, and why the move they made was losing.
5. **Optional difficulty tiers per game:** tutorial (can't lose), fluency (normal), challenge (adversarial positions or time pressure).
6. **Progression across explainers.** Earlier games' theory (Grundy values, game sums) is used to analyze later games. The reader's fluency carries forward.

**Rendering stack.** D3 + SVG + KaTeX default. Canvas for game boards with many pieces or where animation matters (Hex grid with hundreds of cells, Dots and Boxes animated chains). No three.js, no WebGL, no build step.

**Shared lib.** Two files in `docs/game-is-the-math/lib/`:
- `cgt-math.js` — mathematical primitives: Grundy value computation via mex, game equivalence checker, surreal number arithmetic (birthday-indexed), temperature computation, game sum operator. Attached to a single `CGT` global.
- `cgt-games.js` — game engines: Nim, Hackenbush (green, blue-red), Sprouts, Domineering, Hex, Go (subsets), Dots and Boxes, Wythoff, Turning Turtles. Each game exports `{moves, play, terminal, winner, optimalMove}` so the lib can drive any game against a common interface. Also attached to the `CGT` global under `CGT.games.*`.

**Canonical conventions.**
- **Player names.** Conventional CGT vocabulary: **Left** (blue) and **Right** (red) for partizan games; **Alice** and **Bob** or **next player** / **previous player** for impartial games.
- **Game value notation.** Conway notation `{L | R}` for partizan game values, displayed via KaTeX.
- **Grundy value formula.** `G(x) = mex{G(y) : y is an option from x}`, where `mex` is the minimum excludant (smallest non-negative integer not in the set).
- **Sum operator.** Direct-sum `⊕` written as `+` in game notation; the reader learns early that summing games is not ordinary arithmetic.

## Phase state

- [ ] **Phase 0** — write 15 briefs + `cgt-math.js` stub (mex, Grundy value computer, surreal seed)
- [ ] **Phase 1** — grill briefs for factual and pedagogical errors, revise
- [ ] **Phase 2** — build Act I (5 explainers), flesh out `cgt-math.js`, create `cgt-games.js` with Nim, Hackenbush, Sprouts engines
- [ ] **Phase 3** — build Act II (6 explainers), extend `cgt-math.js` for surreal numbers and temperature, extend `cgt-games.js` with Domineering and game-sum machinery
- [ ] **Phase 4** — build Act III (4 explainers), add Hex, Go-endgame, Dots and Boxes engines
- [ ] **Phase 5** — series index as an "arcade lobby," cross-references, audit sweep

## Source material

Primary references — the lib and briefs should lean heavily on these:

- **Berlekamp, Conway, Guy** — *Winning Ways for Your Mathematical Plays* (4 volumes, A K Peters 2001–2004). The bible of combinatorial game theory.
- **Conway** — *On Numbers and Games* (A K Peters 1976). The original source for surreal numbers and the game-theoretic construction of the real numbers.
- **Siegel** — *Combinatorial Game Theory* (AMS 2013). Modern graduate-level treatment.
- **Albert, Nowakowski, Wolfe** — *Lessons in Play* (A K Peters 2007). Undergraduate-friendly introduction.

Each explainer's brief should cite the specific chapter it draws from.

## Brief template

Each brief should be ~350–500 words with the following sections:

- **Pitch** — 3–4 sentences: which game, why it matters, what theorem the play reveals.
- **The playable game** — specific mechanic spec: board, moves, win condition, optimal-strategy implementation, difficulty tiers.
- **Figures** — one line per figure, numbered; at least one is always the game itself.
- **Key theorems / notation** — the mathematical content in KaTeX-ready form.
- **Dependencies** — which earlier explainers (games, theorems, notation) this one leans on.
- **Reader takeaway** — what the reader can do, compute, or prove after this explainer that they couldn't before.

## Files

```
plans/game-is-the-math/
  README.md                             (this file)
  briefs/
    01-nim.md
    02-green-hackenbush.md
    03-grundy-values-and-mex.md
    04-sprague-grundy-theorem.md
    05-misere-play.md
    06-blue-red-hackenbush.md
    07-the-surreal-numbers.md
    08-simplicity-theorem.md
    09-domineering.md
    10-temperature-and-cooling.md
    11-sums-of-games.md
    12-hex-and-positional-games.md
    13-go-endgames.md
    14-dots-and-boxes.md
    15-loopy-games-and-beyond.md

docs/game-is-the-math/
  lib/
    cgt-math.js                         (stubbed in Phase 0, fleshed out in Phases 2–4)
    cgt-games.js                        (created in Phase 2, extended in 3 and 4)
    test.html                           (in-browser sanity checks)
  01-nim.html
  02-green-hackenbush.html
  03-grundy-values-and-mex.html
  04-sprague-grundy-theorem.html
  05-misere-play.html
  06-blue-red-hackenbush.html
  07-the-surreal-numbers.html
  08-simplicity-theorem.html
  09-domineering.html
  10-temperature-and-cooling.html
  11-sums-of-games.html
  12-hex-and-positional-games.html
  13-go-endgames.html
  14-dots-and-boxes.html
  15-loopy-games-and-beyond.html
  index.html                            (built in Phase 5; "arcade lobby" layout)
```

## What the series will *not* cover

Explicit scope limits so the reader knows where the series ends:

- **Game tree search and AI.** Minimax, alpha-beta, Monte Carlo tree search — these are AI topics, not combinatorial game theory. Mentioned in passing at most.
- **Economic / strategic game theory.** Nash equilibria, Prisoner's Dilemma, auction theory — a different field, different tools, different readers. Not in this series.
- **Full-size Go or Chess analysis.** The endgame explainer uses restricted Go positions where CGT actually applies; full-board Go and Chess are out of scope.
- **Misère play theory in depth.** Misère play gets one explainer, but the full theory (misère quotients, indistinguishability classes) is a current research area beyond our register.
- **Connections to set theory.** Surreal numbers interact deeply with set theory (Conway's construction of ON as a class of games), but we stop at rational surreals plus a glimpse of ω.

The final explainer (#15) acknowledges these gaps and points at the standard references.
