# Brief 05 — Mayer–Vietoris as a computation engine

**Slug.** `05-mayer-vietoris`
**Target file.** `docs/cohomology/05-mayer-vietoris.html`
**Series.** *Holes Have Names* — [spine](../README.md) · [AGENTS](../AGENTS.md)
**Act.** II — From rings to computation.

## One-line claim

The Mayer–Vietoris long exact sequence is not just a theorem; it's an algorithm that computes $H^*(X)$ from a two-piece cover by exact-sequence bookkeeping.

## Motivating frame

This essay is about *the recursion*. The reader has seen $H^*$ computed two ways — combinatorially in 02–03 and analytically in 04. Now we compute it a third way: by chopping a space into two pieces $U \cup V = X$, computing $H^*(U)$, $H^*(V)$, and $H^*(U \cap V)$, and bookkeeping the result through a long exact sequence.

The sheaf flavor is named but not formalised. A cover is the data of a Čech 0-cochain valued in subspaces; Mayer–Vietoris is what happens when you push that through cohomology. The conceptual unlock: cohomology *glues*. The combinatorial cup product of explainer 03 was about *internal* multiplication; Mayer–Vietoris is about *gluing*. Both are first-class operations.

## Mathematical content

- **The setup.** $X$ a space with open cover $X = U \cup V$. There are inclusions $i_U: U \cap V \hookrightarrow U$, $i_V: U \cap V \hookrightarrow V$, and the cover map $\pi: U \sqcup V \to X$.
- **The long exact sequence.**
  $$\cdots \to H^{k-1}(U \cap V) \xrightarrow{\delta^*} H^k(X) \xrightarrow{\pi^*} H^k(U) \oplus H^k(V) \xrightarrow{i_U^* - i_V^*} H^k(U \cap V) \xrightarrow{\delta^*} H^{k+1}(X) \to \cdots$$
- **Exactness.** Image of each map equals kernel of the next. The reader sees this as a *rank check* in the figure.
- **The connecting map $\delta^*$.** Given a cocycle $\eta$ on $U \cap V$, extend it (any way) to a cochain $\eta_U$ on $U$ and $\eta_V$ on $V$; then $\delta\eta_U$ and $\delta\eta_V$ agree on $U \cap V$ and patch to a cocycle on $X$. The cohomology class of that cocycle is $\delta^*[\eta]$.
- **The torus example.** Cover $T^2$ by $U$ = punctured torus (homotopy equivalent to wedge $S^1 \vee S^1$) and $V$ = small disk around the puncture. Then $U \cap V \simeq S^1$. The LES gives $H^*(T^2)$ in terms of known $H^*(S^1)$ and $H^*(S^1 \vee S^1)$. Reader watches this resolve.

## Interactive figure

**The cover staircase.** A vertically-scrolling diagram with three layers from top to bottom:

- **Layer 1: the space and cover.** A triangulated surface (default: torus, swap-to dropdown: $S^2$, $\mathbb{RP}^2$, Klein) drawn with two overlapping translucent disks representing $U$ and $V$. Reader can drag the disks; vertices light up in three colors: blue (in $U$ only), green (in $V$ only), violet (in $U \cap V$).
- **Layer 2: the three cohomology groups.** Three "score-card" boxes side by side, one for $H^*(U)$, one for $H^*(V)$, one for $H^*(U \cap V)$, each showing $\beta_0, \beta_1, \beta_2$ as columns. Updates live as the cover changes.
- **Layer 3: the long exact sequence.** Six boxes in a row: $H^0(U \cap V)$, $H^0(X)$, $H^0(U) \oplus H^0(V)$, $H^0(U \cap V)$, $H^1(X)$, $H^1(U) \oplus H^1(V)$. The arrows between them are labeled with their rank. Reader sees: at each box, *(incoming rank) + (outgoing kernel) = (box dimension)*, the algebraic statement of exactness. A "verify" button lights up each box green when the LES rank conditions are met.

A "step through" button walks the reader through the computation:

1. Highlight $H^0(U \cap V)$.
2. Show the image of $\delta^*$ in $H^1(X)$.
3. Highlight the kernel of $\pi^*$ in $H^1(X)$ as the image of $\delta^*$.
4. Step forward to $H^1(U) \oplus H^1(V)$.
5. ...

The figure functions as a small Mayer–Vietoris debugger: change the cover, see which boxes update, see whether exactness holds.

**Distinct visual grammar.** Three vertically-stacked layers: cover diagram, scorecards, LES boxes. The dominant visual element is the *horizontally scrolling row of group-boxes with arrows between them* — unique to this essay.

## Color tokens

| token | role |
|---|---|
| `--c-cover` | $U$ background; $V$ uses a paired tint (variant of slate) |
| `--c-cup` | $U \cap V$ (overlap region) |
| `--c-H0`, `--c-H1`, `--c-H2` | scorecard column tints by degree |
| `--c-coboundary` | the connecting map $\delta^*$ (red, the same as inside-cochain δ — they are the same operation up to bookkeeping) |
| `--c-cocycle` | exactness-verified boxes (green) |

## Lib contract

- `COH.mv.cover(complex, vertexMask)` for the cover from a 0/1/2/3 vertex mask.
- `COH.mv.restrict`, `COH.mv.difference`, `COH.mv.connecting` for the three map types.
- `COH.mv.longExactSequence(cover, 2)` returns the full LES (groups + maps + rank checks) — the figure renders directly from this.
- `COH.tri.torus7()`, etc. for the four target surfaces.

## Cross-references

- **Explainer 02.** "We computed $H^*(T^2)$ once by reducing the full coboundary matrix. Now we compute it again, recursively, from pieces."
- **Explainer 06 (next).** "Both sides of Mayer–Vietoris compute the *same* $H^*$. Persistent cohomology does this gluing across a *filtration* — pieces parameterised by a scale."
- **TDA series, explainer 09 (Čech vs Rips).** Cover-based constructions on point clouds; the structural analogue.

## Pitfalls

- Do not formalise sheaves. One sentence: "A cover is the data of subsets that glue; sheaf cohomology generalises this past two pieces, but the two-piece case is the whole flavor." That is the entire sheaf treatment.
- The connecting map $\delta^*$ is the conceptual mountain of Mayer–Vietoris. Spend the most space on it. The figure step-through (3 of 5) should linger here.
- *Exactness* is a property, not a definition. Lead with the rank check, not with the abstract definition. "The image of the incoming map exactly fills the kernel of the outgoing map" — show this with arrow widths or column heights in the figure.
- The torus example is the showcase. Run it slowly. The other surfaces are dropdown sanity checks.

## Closing — what we take with us

- Mayer–Vietoris computes $H^*(X)$ from $H^*(U), H^*(V), H^*(U \cap V)$ by exact-sequence bookkeeping.
- The connecting map $\delta^*$ is the new piece: it takes a cocycle on the overlap and produces one on the whole.
- Cohomology *glues*. The cover doesn't have to be open or smooth — the same algebra runs on a simplicial cover.
- Same answer as the matrix reduction of explainer 02; same answer as integrating forms in explainer 04. Three computations, one $H^*$.
- Next: do the same recursion across a *filtration* of scales, and discover that the persistent dual hands you a coordinate.
