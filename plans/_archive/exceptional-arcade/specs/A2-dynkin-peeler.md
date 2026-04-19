# A2 — Dynkin Peeler

## Prerequisite

E8 series **#04 The Dynkin Diagram** and **#07 Subsystems as Peeling**. The reader must already know which of the 8 deletions produces which subsystem type and why.

## Mechanic

The E8 Dynkin diagram (8 nodes, 7 edges) is displayed. At the top of the screen: a target subsystem type, e.g., "Produce **E₇**" or "Produce **D₇**" or "Produce **A₁ ⊕ A₆**". The reader clicks one of the 8 nodes to delete it. If the resulting subsystem matches the target, correct; if not, show the actual subsystem type that resulted.

## Round structure

- 8 challenges per round, one per distinct subsystem type reachable by single-node deletion.
- Types cycled in a shuffled order so the reader doesn't memorize position-to-answer.
- End of round shows which types were correct / which were missed.

## Feedback on correct

- Target subsystem lights up on the diagram (highlighting which 126-or-so roots belong to it, projected to the Coxeter plane).
- Counter advances.

## Feedback on wrong

- Show the *actual* subsystem type that resulted from the reader's deletion, with its root count and its own Dynkin sub-diagram extracted.
- Show the *correct* deletion that would have produced the target, with the node that should have been clicked highlighted.
- Pause 3 seconds, then advance.

## Difficulty tiers

- **Tutorial** — the target subsystem is shown alongside the 8 possible deletions listed, each with its resulting subsystem labeled. The reader essentially just has to click the matching one.
- **Fluency** — the target subsystem is shown by name only. The reader must know which deletion produces it.
- **Challenge** — reverse mode. A subsystem type is shown, the reader must identify *all* single-node deletions that produce something matching (some targets have multiple valid deletions; e.g., if "something containing E₆" is the target, deleting α₇ gives E₆ ⊕ A₁ which counts).

## Scoring

- Correct count out of 8 challenges per round.
- Average thinking time per challenge.
- Perfect-round count (all 8 correct in a row).

## Lib needs

- **From `e8-math.js`:** `E8.dynkin` (adjacency, edges, node labels), `E8.subsystems.byDeletion(i)`, `E8.coxeterPlane`, `E8.project.toCoxeterPlane(r)`.
- **From `arcade.js`:** `arcade.round`, `arcade.scoreboard`, `arcade.highlightNode`.
- **Inline:** a subsystem classifier that takes a list of root indices and returns a type label. Can be hardcoded for the 8 possible deletions since we know them all (see `04-the-dynkin-diagram.html` for the lookup table).

## Teaching payload

The reader builds intuition for how the Dynkin diagram's branch and leg structure determines subsystem types. After this game:
1. They know that deleting α₈ gives E₇ (the extreme of the long leg extends E₇ to E₈).
2. They know that deleting the branch node α₄ shatters the diagram into 3 disconnected components (A₁ ⊕ A₂ ⊕ A₄).
3. They can predict, for any node, what happens when it's deleted — by simple graph reasoning.

## Scope guardrails

- The game is about *identifying* subsystems, not proving they're subsystems. The underlying fact (that deletion yields a sub-root-system) is assumed from the prerequisite.
- No "multi-step peeling" — one deletion per challenge. Iterated peeling (E₈ → E₇ → E₆ → …) is covered in the narrative explainer, not the arcade.
