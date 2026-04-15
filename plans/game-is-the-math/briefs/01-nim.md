# 01 — Nim

## Pitch

Nim is the simplest interesting combinatorial game. Several heaps of objects sit on a table; two players alternate removing any positive number of objects from any one heap; the player who takes the last object wins. It looks trivial. But the complete strategy — compute the bitwise XOR of all heap sizes and move to make it zero — is a real theorem, proved by Charles Bouton in 1901, and it is the first result of what would later become combinatorial game theory. This explainer has the reader play Nim against an optimal computer opponent, notice that certain positions always lose for the player to move, and then derive the XOR rule from the losing pattern.

## The playable game

**Three-heap Nim ("Marienbad").** Starting position: heaps of sizes 3, 5, 7 — the famous configuration from Alain Resnais's 1961 film *Last Year at Marienbad*. Players alternate turns. On each turn, the player picks one heap and removes any number of objects from it (at least one, up to the full heap). The player who takes the last object wins.

**Computer opponent.** The computer plays the optimal strategy: on each turn it computes the XOR of all heap sizes. If the XOR is zero, the position is losing — the computer plays any legal move (it will lose to optimal play). If the XOR is nonzero, the computer finds a heap whose binary representation differs from (heap XOR total-XOR) and reduces that heap to that exact value, bringing the XOR to zero. This is Bouton's strategy.

**Difficulty tiers.**
- **Tutorial:** 1-2-3 Nim (small heaps, obviously no time pressure, the reader can exhaustively enumerate).
- **Fluency:** Marienbad (3-5-7), and random starting positions drawn from {a, b, c} with each in [2, 8].
- **Challenge:** 5-heap Nim (up to 5 heaps, each in [1, 10]), where mental XOR computation becomes non-trivial.

## Figures

1. **The Marienbad Nim game** — playable against the computer, 3-5-7 start. "Reset to Marienbad" button and "Random position" button.
2. **Position classifier** — for every (a, b, c) with each in [0, 7], color the cell by whether the position is winning (nonzero XOR) or losing (zero XOR). A 3D table the reader can slice. Makes the XOR pattern visible.
3. **Binary XOR visualization** — show the current heap sizes as binary rows, highlight columns where exactly an odd number of rows have a 1. The losing condition is exactly "no column has an odd count."
4. **Many-heap Nim** — extend to 4+ heaps, same rule. Interactive: add or remove heaps, see XOR update live.
5. **Historical vignette: Charles Bouton (1901)** — portrait and title-page of *Nim, a Game with a Complete Mathematical Theory* (Annals of Mathematics). The paper that started CGT.

## Key theorems / notation

- **Bouton's theorem (1901):** A Nim position `(n₁, n₂, ..., n_k)` is losing for the player to move iff `n₁ ⊕ n₂ ⊕ ... ⊕ n_k = 0`, where `⊕` denotes bitwise XOR.
- **Winning move from a nonzero-XOR position:** let `s = n₁ ⊕ ... ⊕ n_k ≠ 0`. Find a heap `n_i` whose binary representation has a 1 in the highest bit of `s`. Reduce `n_i` to `n_i ⊕ s`. The new XOR is zero.

## Dependencies

- None (this is the first explainer).
- **Lib:** introduces the `CGT` global namespace. Contributes `CGT.games.nim.*` (position representation, legal moves, winner detection, optimal move via Bouton's strategy) and the first entry of `CGT.math.xor` (just `Array.reduce`, but named for clarity).

## Reader takeaway

Reader can play Nim competently against a human opponent, knows the XOR rule, and has seen the first real theorem of combinatorial game theory with its proof pattern (every non-losing position has a move to a losing position; losing positions have no such move). Ready for #02, which will show that Nim is not just a game — it's the *model* for all impartial games.
