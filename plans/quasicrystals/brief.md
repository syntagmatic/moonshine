# Four-Article Brief

This is the canonical brief for the shipped quasicrystal series. It replaces the retired twelve-file brief set, so future planning should update this file instead of rebuilding the old article structure.

## 1 - Fibonacci, Cut-and-Project, and Phasons

**Pitch.** Start with the smallest model set and let it carry the whole vocabulary. A projected Z2 lattice gives a one-dimensional Fibonacci tiling; exact Z[phi] arithmetic explains why the physical and internal coordinates come as a pair; the internal window shows why membership is a hidden gate; moving that window produces phason flips. The article should feel like the reader is learning one machine, not four separate tricks.

**Math basis.** The working object is the Fibonacci cut-and-project scheme `(Lambda, pi_parallel, pi_perp, W)` with `Lambda = Z2`, a physical line of slope `1 / phi`, an orthogonal internal coordinate, and an interval window. Elements `a + b phi` are shown with their Galois conjugates under `sigma(phi) = 1 - phi`; this gives the first exact-arithmetic preview for later H3/H4 material. The offset version of the model set is `Lambda_star(o) = { pi_parallel(p) : pi_perp(p) - o in W }`.

**Figures.** Interactive strip-and-projection hero with slope and window controls; golden-arithmetic linked number lines for `(a, b)` and its Galois pair; generalized anatomy diagram for Fibonacci, Penrose, and icosahedral schemes; internal-density buildup as enumeration radius grows; two-gate pruning comparison for physical-only, internal-only, and both gates; phason slider with crossing count; boundary-distance graph showing generic versus singular offsets.

**Key terms.** `cut-and-project scheme`, `model set`, `physical projection`, `internal projection`, `acceptance window`, `Galois automorphism`, `phason`, `singular offset`, `local-isomorphism class`.

**Misreadings to avoid.** Do not let "irrational" read as "random." Do not present the window as decorative. Do not treat phason flips as arbitrary animation events; they are boundary crossings in internal space. Do not imply that floating-point coordinates are the mathematical source of truth.

**Library substrate.** `fibonacciScheme()`, `project(scheme, bounds)`, phason mechanics, and the `fibonacci-phason` / `cut-and-project` gallery interactives in squishy-thing. The shipped article may re-implement this directly because the 2D projection is small enough to inspect.

**Reader takeaway.** Aperiodic order can be deterministic, exact, and locally finite. The hidden coordinate is not a metaphor; it is the membership test.

## 2 - Penrose Projection and Inflation

**Pitch.** Move from the one-dimensional toy model to the canonical two-dimensional Penrose construction. The reader should see why Penrose is five-fold from the start: five grid directions, five projected basis vectors, five preferred edge directions. Matching rules and phi-inflation then become alternate interfaces to the same local order, not disconnected facts from tiling folklore.

**Math basis.** The public construction is classical de Bruijn / Z5 Penrose, with five families of parallel lines and physical basis directions `(cos(2 pi j / 5), sin(2 pi j / 5))` for `j = 0..4`. The related in-house `penroseFromE8` slice is useful background but is not the canonical public source for this article. Inflation uses the golden factor `phi`; finite patches should show interior agreement and boundary caveats rather than claiming that a finite crop is invariant.

**Figures.** Interactive pentagrid and projected patch with phase control; local Penrose matching-rule checker for rhomb edges; orientational-order comparison showing the five preferred directions against square/triangular periodic lattices; phi-inflation overlay that separates interior agreement from boundary effects.

**Key terms.** `de Bruijn pentagrid`, `Z5 projection`, `Penrose rhomb`, `matching rule`, `five-fold orientational order`, `inflation factor`, `substitution`.

**Misreadings to avoid.** Do not use the E8 slice as the canonical Penrose generator. Do not claim matching rules and cut-and-project are equivalent in all examples; here they meet because Penrose is a well-behaved case. Do not animate inflation as ordinary zooming.

**Library substrate.** Classical Penrose logic should live in `quasi-viz.js` until a five-fold-aligned reusable primitive exists. Squishy-thing remains the reference for exact phi arithmetic and related phason/projection mechanics.

**Reader takeaway.** Penrose order can be read globally from a pentagrid, locally from matching rules, and recursively through phi-inflation.

## 3 - Icosahedral Diffraction and Discovery

**Pitch.** Bring the series into three-dimensional matter. Five-fold symmetry is forbidden for a periodic 3D lattice, yet icosahedral quasicrystals exhibit five-fold, three-fold, and two-fold orientational order with sharp diffraction peaks. The article ties the theorem, the H3/H4 arithmetic substrate, pure-point diffraction, and Shechtman's 1982 observation into one arc.

**Math basis.** The crystallographic restriction theorem uses the integer trace condition for rotations preserving a periodic lattice. H3 is the icosahedral Coxeter symmetry in physical 3-space; H4 and the 600-cell supply the higher-dimensional arithmetic language. The in-house `elserSloane()` / `h3Quasicrystal()` substrate should be described as Hurwitz-golden / icosian Galois-pair structure, with E8 treated as nearby geometry rather than the projected source lattice. Diffraction peaks are indexed by a finite-rank Fourier module, with window Fourier transforms controlling amplitudes.

**Figures.** Icosahedron axis-class interactive with the integer-trace argument; periodic-versus-aperiodic comparison showing why five-fold order escapes periodic crystallography; Galois-pair flow from `H[phi]` to physical/internal coordinates; compact H3/H4 substrate scene with 600-cell/H4 cloud and H3 slice; finite diffraction oracle with window and threshold controls; Shechtman-style comparison between multiple twinning and one coherent ten-fold module.

**Key terms.** `crystallographic restriction theorem`, `H3`, `H4`, `icosian ring`, `Galois-pair lattice`, `Bragg peak`, `pure-point spectrum`, `Fourier module`, `multiple twinning`.

**Misreadings to avoid.** Do not say five-fold symmetry is impossible in matter; it is impossible for periodic 3D lattices. Do not conflate a schematic rights-safe diffraction comparison with Shechtman's original plate. Do not present the current H3/H4 finite view as an all-radius proof. Do not imply that E8 is the physical source lattice.

**Library substrate.** `h3Quasicrystal()`, `elserSloane()`, `diffraction(scheme, opts)`, `sixHundredCell`, icosian research dossiers, and the `diffraction-lab` gallery interactive. The current shipped figures are compact re-implementations and should be upgraded to embeds or direct library oracles when the build boundary allows it.

**Reader takeaway.** Periodicity is not the same thing as order. A quasicrystal can have sharp, coherent, non-crystallographic diffraction without a 3D translation lattice.

## 4 - Beyond Cut-and-Project

**Pitch.** Close by loosening the definition. The first three articles use regular cut-and-project model sets because they are visual and computational, but aperiodic order also appears through substitution fixed points, matching-rule tilings, diffraction-first definitions, Wang tiles, and single-tile monotiles. The final article should keep the landscape honest: the routes overlap under hypotheses, not by slogan.

**Math basis.** The comparison is between four lenses: model sets, substitution tilings, matching rules, and pure-point diffraction. Wang tiles represent the local-rule/undecidability side of the field. Hat and Spectre sit at the monotile frontier: the Hat admits tilings with reflected copies, while the Spectre is chiral. Socolar's 2023 analysis means Hat tilings should not be casually described as unrelated to projection, but regular model-set and diffraction claims need careful wording.

**Figures.** Definitions matrix comparing model set, substitution, matching-rule, and diffraction lenses; substitution/Wang local-rule interactive; Hat/Spectre single-tile comparison using actual monotile-family outlines; Hat/Spectre patch explorer with reflection/chirality controls and an open-question readout; final local-rule / monotile card glyph for the series index.

**Key terms.** `substitution fixed point`, `matching rule`, `Wang tile`, `domino problem`, `aperiodic monotile`, `Hat`, `Spectre`, `einstein problem`, `definition equivalence`.

**Misreadings to avoid.** Do not present cut-and-project as the only real definition of quasicrystal. Do not claim the Hat or Spectre is an ordinary regular model set. Do not reduce Wang tiles to a decorative puzzle; the undecidability result is the point. Do not end on uncritical celebration; the monotile breakthroughs close famous problems while opening structure questions.

**Library substrate.** No single squishy-thing primitive owns this article. It uses the earlier model-set vocabulary as a comparison point and should cite the Smith-Myers-Kaplan-Goodman-Strauss Hat/Spectre papers, Socolar's monotile-structure analysis, and Berger/Wang local-rule history.

**Reader takeaway.** Cut-and-project is a powerful working lens, but aperiodic order is broader. The reader should leave knowing which claims depend on model sets, which depend on local rules, and which remain active research questions.
