# 15 — E8 Out in the World

## Pitch

E8 shows up outside discrete geometry, in places the first fourteen explainers deliberately avoided. Heterotic string theory uses `E_8 × E_8` as a gauge group; the 2007 Atlas of Lie Groups project computed the Kazhdan–Lusztig–Vogan polynomials for the real form of E_8 and produced 60 GB of output; Maryna Viazovska received the 2022 Fields Medal for the packing result from explainer #12; Garrett Lisi's "Exceptionally Simple Theory of Everything" proposed E8 as a unified gauge group for physics (and sparked legitimate controversy about whether it worked); quasicrystal models invoke E8 projections as their parent lattice. This capstone narrates those stories without pretending to derive the physics, and it closes the loop by being honest about what the series deliberately skipped.

## Figures

1. **Heterotic strings, schematic.** The `E_8 × E_8` heterotic string as a 10D theory with gauge group `E_8 × E_8`. Show the "why two copies?" answer: anomaly cancellation requires a gauge group of dimension 496, and both `E_8 × E_8` and `SO(32)` qualify. The left-movers live on a 16D torus that is literally the `E_8 × E_8` lattice compactification. SVG, narrative.
2. **The 2007 AIM computation.** Timeline: a team of 18 mathematicians led by Jeffrey Adams spent years computing Kazhdan–Lusztig–Vogan polynomials for the split real form of E_8. The output was 60 GB; the largest coefficient was 11,808,808. Show a sample of the output and note the scale. Static, narrative.
3. **Viazovska's Fields Medal.** 2022, at the International Congress of Mathematicians in Helsinki (moved from St Petersburg for political reasons). Brief biography, her path from Kharkiv to Lausanne, and the reception of the packing proof. Static, narrative.
4. **Lisi's E8 Theory, honestly.** 2007 arXiv paper proposing E8 as the gauge group for a unified theory. Show the core idea (particles as elements of E8's Lie algebra, forces as roots), then the core criticism (Distler–Garibaldi 2009 showed the proposed embedding cannot accommodate a chiral fermion spectrum). Treat it as genuine physics not crank work, but be clear it did not pan out as originally proposed. Static.
5. **Quasicrystals and E8.** Penrose tilings and physical quasicrystals can be obtained as projections of higher-dimensional lattices. Some 5-fold symmetric models use projections of the E8 root system. Brief mention, one figure showing a quasicrystal tiling pattern next to its E8-projection origin. SVG.
6. **What we didn't cover.** A short but honest list: (a) Lie algebra rep theory proper, including the 248-dimensional adjoint representation and `248 = 240 + 8` as "roots plus Cartan"; (b) vertex operator algebras and the monster group; (c) octonions as an alternate realization of E8; (d) the Langlands program's use of E8; (e) Donaldson theory and the E8 manifold in 4-manifold topology. Each item is one paragraph with a pointer to a standard reference. Static.
7. **Further reading.** Conway & Sloane's *Sphere Packings, Lattices, and Groups* (the bible). Humphreys' *Reflection Groups and Coxeter Groups*. Fulton & Harris's *Representation Theory*. Viazovska's 2017 *Annals of Mathematics* paper. The AIM project website. Static.

## Key formulas / constructions

- Heterotic string anomaly condition: `dim(G) = 496`; satisfied by `SO(32)` and `E_8 × E_8`.
- `dim(𝔢₈) = 248 = 240 (roots) + 8 (Cartan subalgebra)`. Stated as the "rep theory seed we didn't plant."
- AIM computation output size: 60 GB of Kazhdan–Lusztig–Vogan polynomials.
- Viazovska's Fields Medal: 2022. E8 packing paper: 2017 (*Annals of Mathematics*, vol. 185).
- Distler–Garibaldi theorem: no embedding of the Standard Model fermion gauge representation into E8 can produce the observed chiral spectrum.

## Dependencies

- All of #01 through #14, in the sense that this explainer is the narrative payoff for the whole series and references the earlier explainers by name.
- Lib: none new. This explainer is almost entirely prose and static figures.

## Reader takeaway

The reader has a cultural-fluency picture of where E8 fits in the broader mathematical and physical landscape: they can hold a cocktail conversation about heterotic strings, the AIM computation, Viazovska's medal, and the Lisi episode, without faking expertise in any of them. They know what the series did not cover (rep theory, Lie algebras, vertex operator algebras, octonions, Langlands, Donaldson theory), and they have pointers to the standard references if they want to continue. Most importantly, they end with the sense that E8 is both a concrete computational object they personally understand and a rich vein that opens onto huge amounts of mathematics and physics they now know how to read into.
