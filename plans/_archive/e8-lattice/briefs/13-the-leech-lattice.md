# 13 — E8's Bigger Sibling: the Leech Lattice

## Pitch

If E8 is the exceptional lattice of 8 dimensions, the Leech lattice is its exceptional cousin in 24 — unimodular, even, and proven optimal for sphere packing and kissing. It has no roots at all (no minimal vectors of squared length 2), a kissing number of 196,560 at squared length 4, and its automorphism group is the Conway group Co₀, whose simple quotients are three of the 26 sporadic simple groups. This explainer does not attempt to construct the Leech lattice — that story requires the hexacode or the Miracle Octad Generator and sits outside our scope — but it *does* walk the reader through what E8 and Leech have in common, how their stories run in parallel (both discovered in the 1960s, both proven optimal in 2016 in papers two weeks apart), and why Leech is the natural "where does this lead?" question a reader of this series would ask.

## Figures

1. **Side-by-side profile.** Two comparison cards. E8: 8D, 240 minimal vectors at squared length 2, packing density `π⁴/384`, automorphism group W(E₈) of order 696,729,600. Leech: 24D, 196,560 minimal vectors at squared length 4, packing density `π¹²/12!`, automorphism group Co₀ of order about `8.3 × 10¹⁸`. SVG.
2. **The Niemeier family.** There are exactly 24 even unimodular lattices in 24 dimensions (the Niemeier lattices), classified by the root sub-lattice. Twenty-three of them contain root vectors; the Leech lattice is the unique one that does not. Show the list of 24 Niemeier lattices with their root systems, with Leech highlighted at the end as "no roots." SVG.
3. **Kissing number jump.** Bar chart comparing kissing numbers across dimensions 2, 3, 4, 8, and 24. The value at 24 (196,560) is roughly 819 times E8's 240. Log-scale to make the comparison visible. SVG.
4. **Theta series, side by side.** `Θ_{E₈}(q) = 1 + 240 q² + 2160 q⁴ + 6720 q⁶ + ⋯` compared with `Θ_{Leech}(q) = 1 + 196560 q⁴ + 16773120 q⁶ + 398034000 q⁸ + ⋯`. Note the shift in minimum squared length and the modular-form relationship. SVG with KaTeX.
5. **Symmetry cascade.** Small diagram showing the chain: `W(E₈)` (order ≈ 7×10⁸) leads into the Conway groups `Co₀ ⊃ Co₁, Co₂, Co₃` (three of the sporadic simple groups), and from there into the wider sporadic landscape culminating in the Monster. Static narrative, one paragraph per arrow. SVG.
6. **Historical parallel.** Timeline with four dates: 1967 (Leech discovers the lattice, shortly after Thompson's recognition of its significance), 1968 (Conway discovers the sporadic groups from Leech's automorphisms), 1979 (Odlyzko–Sloane prove 240 kissing in 8D and 196,560 kissing in 24D), 2016 (Viazovska proves E8 packing optimal; two weeks later Cohn–Kumar–Miller–Radchenko–Viazovska prove Leech packing optimal). Static.

## Key formulas / constructions

- Leech lattice is even, unimodular, 24-dimensional, and has no vectors of squared length 2.
- Minimum squared length of Leech = 4.
- Kissing number of Leech = 196,560. Proven optimal (Odlyzko–Sloane 1979; Levenshtein 1979 independently).
- Packing density of Leech = `π¹² / 12! ≈ 0.00193`. Proven optimal (Cohn–Kumar–Miller–Radchenko–Viazovska 2016, *Annals of Mathematics*).
- Automorphism group: `|Co₀| = 8,315,553,613,086,720,000 ≈ 8.3 × 10¹⁸`.
- Niemeier lattices: 24 isomorphism classes of even unimodular lattices in 24 dimensions.
- Turyn construction (mentioned in pitch, not derived in figures): the Leech lattice can be expressed as a sub-lattice of `(ℝ⁸)³` using three copies of E₈ glued via the hexacode [6, 3, 4] over 𝔽₄. See Conway & Sloane, *Sphere Packings, Lattices, and Groups*, chapter 24 for the full construction.

## Dependencies

- #03 (240 roots of E₈, inner-product structure).
- #10 (lattice, unimodular, theta series, shell structure).
- #11, #12 (kissing and packing bound vocabulary — the Leech story uses the same machinery with very different numbers).
- Lib: no new Leech-specific computation. The figures use static comparison data or values computed once and cached. No `data/leech-sample.json` needed because we do not enumerate Leech vectors.

## Reader takeaway

The reader understands that Leech is E8's analog in 24 dimensions — exceptional, optimal, and deeply related to the sporadic simple groups through its automorphism group. They can state that Leech has no roots (which is what makes it unique among Niemeier lattices), knows its kissing number and packing density, and has the historical parallel of "both proven optimal in 2016, two weeks apart" firmly in mind. They know that there *is* a construction of Leech involving three copies of E8 glued together, and they know it's subtle enough that we're not doing it here — the pointer is to Conway & Sloane.
