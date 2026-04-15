# 04 — The Sprague–Grundy Theorem

## Pitch

Now we prove the big one. The Sprague–Grundy theorem says: every impartial game is equivalent to a Nim heap of some size, namely its Grundy value. *Every* impartial game. Subtraction games, Wythoff's game, Hackenbush, Kayles, Turning Turtles, any impartial game you can invent — all of them are Nim in disguise. This explainer proves the theorem by induction, then demonstrates the most powerful consequence: the Grundy value of a *sum* of games is the XOR of the individual Grundy values. Multi-game positions, no matter how complicated, reduce to a single XOR computation.

## The playable game

**The Sum Challenge.** The reader is shown a position that is the disjoint union of several impartial games — say, a Nim heap of 3, a Hackenbush tree, and a small subtraction-game position. The reader must (a) compute each component's Grundy value, (b) XOR them together to get the total, (c) identify the winning move (if any).

**Reader interaction:** the computer plays as the opponent after the reader's analysis is submitted. If the reader correctly identified a winning move, they win; if they chose a losing move, the computer's optimal play will show them the consequence.

**Difficulty tiers.**
- **Tutorial:** Two-component sums where each component's Grundy value is given.
- **Fluency:** Three-component sums, reader computes all values.
- **Challenge:** Four- or five-component sums, time-pressured.

## Figures

1. **Theorem statement** — Sprague–Grundy in full: every impartial game `G` with finitely many positions is equivalent to the Nim heap of size `G`'s Grundy value.
2. **Sum operator** — two games side by side, a single player (either one) chooses which component to move in. Shows that a move in game `A` doesn't change game `B`.
3. **Proof sketch** — induction on game height. Base case: terminal positions have Grundy value 0 = Nim heap 0. Inductive step: if all options of `x` are equivalent to Nim heaps, then `x` is equivalent to a Nim heap of size `mex{values}`. Prose with diagrams.
4. **The XOR-of-sums theorem** — for games `A` and `B`, `G(A + B) = G(A) ⊕ G(B)`. Interactive: change `A`, watch `A + B`'s value update.
5. **Multi-game challenge** — the Sum Challenge interactive described above.
6. **Historical note:** Roland Sprague (1935) and Patrick Grundy (1939) independently discovered the theorem, a classic example of simultaneous mathematical discovery.

## Key theorems / notation

- **Sprague–Grundy theorem:** Every impartial game under the normal-play convention (last move wins) is equivalent to a Nim heap, and the heap size is the game's Grundy value.
- **XOR of Grundy values:** `G(A + B) = G(A) ⊕ G(B)`. Proof: both sides are the Grundy value of a disjoint sum under normal play, computed by `mex` on options that update exactly one component at a time.
- **Winning in sums:** a sum of games is losing iff the XOR of component Grundy values is 0.

## Dependencies

- #01 (Nim, XOR).
- #02 (equivalence).
- #03 (Grundy values, mex).
- **Lib:** adds `CGT.math.sumGrundy(grundyValues)` (XOR helper with readable name) and the "sum challenge" position format. The game engines gain a `sumWith(otherGame)` method that exposes a combined game interface.

## Reader takeaway

Reader has seen the central structural theorem of combinatorial game theory stated and sketched. They understand that playing any impartial game optimally reduces to (a) computing Grundy values, (b) XOR-ing them, (c) finding a move to zero the XOR. They can solve multi-game positions by hand. Ready for #05, which will show what happens when you invert the win condition — the misère twist.
