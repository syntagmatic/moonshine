# 03 — Grundy Values and mex

## Pitch

Every impartial game position has a unique non-negative integer called its *Grundy value* (or nimber, or Sprague–Grundy number). The value captures everything about the position that matters strategically: two positions with the same Grundy value play identically, and a position is losing iff its Grundy value is 0. The value is computed by a simple recursive formula involving a new operator, **mex** (minimum excludant). This explainer teaches `mex`, shows how to compute Grundy values for arbitrary game trees by hand, and introduces an interactive game-tree editor the reader can use to build their own positions and see the values propagate.

## The playable game

**The Grundy Value Calculator.** The reader builds a small game tree — a directed acyclic graph with a designated starting position — by clicking "add child" nodes. Each leaf node (no outgoing edges) is automatically assigned Grundy value 0. Internal nodes compute their value as `mex{G(child) : child ∈ options}`, displayed live as the tree grows.

**Challenge mode:** the explainer presents a game tree with some values pre-filled; the reader clicks nodes whose Grundy values are missing and types them in. Immediate feedback (correct / incorrect) with the `mex` calculation shown on wrong answers.

## Figures

1. **The `mex` operator** — an interactive set: the reader drags non-negative integers into a set, `mex` of the set computes live. Shows that `mex({0, 1, 2}) = 3`, `mex({1, 2}) = 0`, `mex(∅) = 0`.
2. **Computing Grundy values bottom-up** — a small fixed game tree with terminal nodes labeled 0. The reader clicks "propagate" and watches values climb the tree.
3. **The Grundy Value Calculator** — the interactive game-tree editor described above.
4. **Nim heap Grundy values** — for Nim heap of size `n`, Grundy value is `n`. Show the computation explicitly for small `n`: a heap of size 3 has options {0, 1, 2}, so `mex({0, 1, 2}) = 3`.
5. **Two different games, same Grundy value** — a Nim heap of size 2 side by side with a different impartial game that also has Grundy value 2. Equivalence is about values, not structure.

## Key theorems / notation

- **`mex`:** for a set `S` of non-negative integers, `mex(S)` is the smallest non-negative integer not in `S`. `mex(∅) = 0`.
- **Grundy value (recursive):** `G(x) = mex{G(y) : y is an option from x}`. Base case: terminal positions have value 0.
- **Losing positions:** a position is losing for the player to move iff its Grundy value is 0.
- **Value of a Nim heap of size `n` is `n`.**

## Dependencies

- #01 (Nim as a specific game with a known pattern).
- #02 (game equivalence).
- **Lib:** adds `CGT.math.mex(set)` and `CGT.math.grundyValue(position, optionsFn)`. The `optionsFn` is a callback returning the list of child positions; `grundyValue` memoizes recursively. Game engines (`CGT.games.nim`, `CGT.games.hackenbush`) now expose a `grundy(pos)` method that delegates to this infrastructure.

## Reader takeaway

Reader can compute Grundy values for any small impartial game by hand, using the recursive `mex` formula. They understand that the Grundy value is the complete strategic invariant of an impartial game position — everything you need to play optimally. Ready for #04, which will state and prove that *every* impartial game is equivalent to a Nim heap whose size is the Grundy value, making Nim the universal model.
