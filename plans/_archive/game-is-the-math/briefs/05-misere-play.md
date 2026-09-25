# 05 — Misère Play

## Pitch

Everything so far has assumed the *normal-play convention*: the player who makes the last move wins. Flip that: in **misère play**, the player who makes the last move *loses*. For most of a game, this change is invisible — the strategies that worked before still work now. But near the end, something strange happens: the theorems collapse. The Sprague–Grundy structure does not hold in misère play. Some misère games have a known theory (misère Nim is almost like normal Nim, with a specific endgame twist), but most don't. This explainer teaches misère Nim, shows why it's *almost* the same as normal Nim, and is honest about how much harder misère play becomes in general — it's still an active research area.

## The playable game

**Misère Nim.** Same mechanics as Nim: several heaps, take any number from one heap, alternate turns. But the player who takes the last object **loses**.

**The twist.** Misère Nim has a beautiful near-duality with normal Nim: for "fat" positions (at least one heap of size ≥ 2), the winning strategy is identical to normal Nim — move to make the XOR zero. But when the position collapses to all-ones (every heap is size 0 or 1), the rule inverts: you want the XOR to be 1, not 0. Formally:

- If the position contains a heap of size ≥ 2: a move is winning iff it produces a position with XOR 0 and at least one heap ≥ 2, OR a position with all heaps size 1 and an *odd* number of them.
- If all heaps are 0 or 1: a move is winning iff it produces an odd number of 1-heaps (which is a losing position for the opponent).

**Misère Marienbad.** Start at 3-5-7. The player to move (reader) must force the opponent to take the last object.

## Figures

1. **Misère Nim vs normal Nim, side by side.** Same starting position. Reader plays one as normal and the other as misère, sees where the strategies diverge (in the endgame).
2. **The endgame rule.** Show positions with all heaps ≤ 1: the winning condition flips. Interactive mini-grid showing winning/losing for each small all-ones position.
3. **Playable Misère Marienbad.** 3-5-7 start, misère convention, reader plays vs optimal computer.
4. **The theorem (misère Nim only).** State the fat-position vs thin-position rule precisely. The reader can check any position against the rule.
5. **Misère Hackenbush is hard.** Show a simple Hackenbush position that's winning under normal play but losing under misère play, and vice versa, to illustrate that the translation breaks. No clean theorem is promised.

## Key theorems / notation

- **Normal play convention:** last move wins. (All previous explainers used this.)
- **Misère play convention:** last move loses.
- **Misère Nim theorem:** Let `P = (n₁, ..., n_k)` be a Nim position. Under misère play:
  - If `max_i n_i ≥ 2`: `P` is losing iff `n₁ ⊕ ... ⊕ n_k = 0` (same as normal play).
  - If `max_i n_i ≤ 1`: `P` is losing iff the number of 1-heaps is *odd*. (With m = 1 the player must take the last 1 and lose under misère; m = 2 is winning because you leave m = 1 for the opponent; m odd is losing, m even is winning.)
- **Note:** The Sprague–Grundy theorem does **not** hold in misère play in general. Misère theory uses a different algebraic structure (misère quotients) which is outside this series' scope.

## Dependencies

- #01 (Nim, normal play).
- #04 (Sprague–Grundy, to contrast with what happens in misère).
- **Lib:** extends `CGT.games.nim` with a `convention: 'normal' | 'misere'` parameter. The optimal-move function branches on convention.

## Reader takeaway

Reader can play misère Nim competently and understands the fat-vs-thin position distinction. They know that misère play exists, that it's genuinely harder than normal play, and that the theory we've been building works only under normal play. This is a natural closing point for Act I (impartial games) — we've seen the theory reach its limits. Act II takes us in a completely different direction: partizan games, where Left and Right have different available moves, and the Grundy values are replaced by a richer structure called *game values*, including the surreal numbers.
