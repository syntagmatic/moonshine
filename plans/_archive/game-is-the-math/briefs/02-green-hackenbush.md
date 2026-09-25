# 02 — Green Hackenbush

## Pitch

Hackenbush is played on graphs attached to the ground. On your turn, you chop any edge; all edges no longer connected to the ground by a path fall off. The "green" version is the impartial case — both players can chop any edge — and its structural theorem is stunning: a straight-line Hackenbush "stalk" of length *n* is exactly equivalent to a Nim heap of size *n*. Two games that look completely different play identically. This explainer introduces the idea of *game equivalence*: two games are equivalent if they have the same value in every sum.

## The playable game

**Green Hackenbush on trees.** The board is a graph of green edges with one or more edges touching a horizontal "ground" line. On each turn, a player selects an edge and removes it; any edge that is no longer connected to the ground through a path of remaining edges also drops. The player who removes the last edge wins.

**Initial positions.**
1. **Single stalk of length 5.** The reader plays; it's exactly Nim on one heap of size 5. The reader will win trivially.
2. **Three stalks of lengths 3, 5, 7.** The reader plays. This is Nim (3, 5, 7) — the Marienbad position. Same optimal strategy, different game board.
3. **A tree** with branches. This is more complex; the explainer derives its Nim-equivalent value via the colon principle.

**Computer opponent.** On each turn, the computer converts the current position to its Nim value (stalk lengths → Nim heap sizes; the colon principle reduces trees to Nim values), then plays the optimal Nim move: find a branch whose length can be reduced so that the XOR of all branch lengths becomes zero.

## Figures

1. **The stalk-to-Nim correspondence.** Start with a Nim heap of 5 coins on the left; grow a green Hackenbush stalk of length 5 on the right. Animate the equivalence: each move on one side corresponds exactly to a move on the other.
2. **Playable Hackenbush on stalks** — start with the (3, 5, 7) position as three stalks attached to ground. The reader plays vs computer.
3. **The colon principle** — a branch above a fulcrum is equivalent to a single stalk whose length is the Nim sum (XOR) of the sub-branch lengths. Interactive: draw a tree, watch it reduce.
4. **Equivalence demonstration** — start with a complex tree, repeatedly apply the colon principle to reduce it to a Nim position. The reader clicks through the reduction steps.
5. **Game equivalence definition** — side panel explaining that two games `G` and `H` are equivalent iff `G + X` and `H + X` have the same winner for every game `X`. The colon principle is an instance.

## Key theorems / notation

- **Stalk theorem:** A green Hackenbush stalk of length `n` is equivalent to a Nim heap of size `n`.
- **Colon principle (fusion principle):** In a green Hackenbush position, a branch rooted at a fulcrum is equivalent to a stalk whose length is the Nim sum of the lengths of the sub-branches meeting at the fulcrum.
- **Game equivalence:** `G ≡ H` iff the sum `G + (-H)` has Grundy value 0 (we write `-H` as `H` for impartial games since every impartial game is its own inverse).

## Dependencies

- #01 (Nim, XOR rule).
- **Lib:** adds `CGT.games.hackenbush.*` — position as a graph with a ground set; legal moves as edge selections; the `applyColonPrinciple` reduction; optimal-move computation via reducing to Nim.

## Reader takeaway

Reader has seen two different-looking games that play identically, and can reduce a green Hackenbush tree to an equivalent Nim heap by hand using the colon principle. The idea of "game equivalence" — two games being the same despite looking different — is now concrete and load-bearing for the rest of the series. Primed for #03, which generalizes "equivalent to a Nim heap of what size?" into the universal invariant called the Grundy value.
