# 03 — The Cayley-Dickson Recipe: The Universal Doubling

## Pitch

If you have an algebra of dimension $n$, you can always build an algebra of dimension $2n$. This explainer reveals the "recipe" that builds $C$ from $R$, $H$ from $C$, and $O$ from $H$. The recipe is a simple formula of pairs, but it carries a hidden trap: every time you double, you lose a fundamental algebraic property.

## Figures

1. **The Recursive Doubling chart.** A hierarchy: $R \to C \to H \to O \to S$ (Sedenions). Hovering over each transition reveals the property that was lost (commutativity, associativity). SVG.
2. **The Pairs Workbench.** A step-through calculator for $(a, b) \times (c, d)$. The reader inputs two complex numbers and gets a quaternion, then two quaternions and gets an octonion. Interactive.
3. **The Property Loss checklist.** A live scoreboard that updates as the reader performs products in higher dimensions. Watching the "Associativity" checkbox fail in 8D. DOM.
4. **Historical Vignette: Arthur Cayley.** A portrait with a KaTeX overlay of the doubling formula he and Dickson generalized. Static.

## Key formulas / constructions

- Cayley-Dickson formula for multiplication of pairs $(a, b)$ and $(c, d)$:
  $(a, b)(c, d) = (ac - d\bar{b}, \bar{a}d + cb)$
- Conjugation: $(a, b)^* = (a^*, -b)$

## Dependencies

- #01 (complex numbers).
- #02 (quaternions).
- Lib: `OCT.cd(a, b)` (The Cayley-Dickson multiplier).

## Reader takeaway

Any number system can be doubled, but it's not a free lunch. The octonions (8D) are the "cliff" where we lose associativity—but it's exactly this loss that gives them their unique geometric power.
