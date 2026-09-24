# Track noether findings

Scope: `docs/noether/` (15 articles, now 13). Main review: `plans/audit/reviews/puremath.md`.
`simulation.md` and `simulation-lattice.md` mention Noether only in passing, about other
series (lattice-simulation 04 and 15). They flag nothing in this series.

## Cut, merged and renumbered

| New file | From | What happened |
|---|---|---|
| 01 to 05 | 01 to 05 | Kept, fixed |
| 06-time-translation-and-energy.html | 06 + 07 | 07 merged into 06. The title is now "Energy, Momentum and Angular Momentum". I kept the filename so inbound links stay valid |
| 07-keplers-hidden-symmetry.html | 08 | Renumbered, fixed |
| 08-phase-and-electric-charge.html | 09 | Renumbered, fixed |
| 09-noethers-second-theorem.html | 10 | Renumbered, fixed |
| 10-ideals-as-new-numbers.html | 11 | Renumbered, fixed |
| 11-noetherian-rings.html | 12 | Renumbered, fixed |
| 12-hilberts-basis-theorem.html | 13 | Renumbered, fixed; gained the Buchberger figure from 15 |
| 13-noether-normalization.html | 14 | Renumbered, fixed; now the last article |

Deleted: `07-space-translation-and-rotation.html` (merged), `15-the-abstract-method-in-the-wild.html` (cut).

**How 07 was merged.** 07 had four separate animations: two-body free, two-body with gravity, central
potential, and an anisotropic potential. 06 now has two new sections with two figures:
- Fig 4: the two-body spring with a gravity toggle. It plots P_x and P_y, and with gravity on it also plots the
  quasi-symmetry current P_y + (m1+m2) g t, which stays flat. The prose now explains that a vertical
  shift is still a quasi-symmetry with F = -(m1+m2) g t. 07 had said it was simply "not conserved".
- Fig 5: one particle, with a select between the central potential and the stiffened one. It shows the orbit,
  the area swept in the last second, and L_z(t).
- 07's three-row symmetry table is now a compact table at the end of 06.

Every "Part N of 15", "explainer N" reference and nav link in the series was renumbered. 13's footer
now points back to the index.

## Errors confirmed and fixed

- 01: "the conjecture that ended her teacher's career". Replaced with the facts: Gordan proved the binary case in 1868 and Hilbert proved the n-ary case in 1890.
- 02: Gordan footnote. "Twenty years later" was wrong, since 1890 to 1921 is 31 years. I added Gordan's 1868 binary result. I softened "invariants are f.g. *because* polynomial rings are Noetherian": Hilbert's argument rests on that fact, but it is not the whole proof. I removed the duplicate "Theologie" quote and pointed to 12.
- 03: literal `−` in the pendulum readout label and value (HTML text, not JS).
- 04: "Only the free particle has continuous symmetries". I scoped it to transformations of q and noted that all three Lagrangians have time-translation symmetry. I dropped the "highest number of conserved quantities" claim.
- 05: literal `̇`/`θ` escapes in two status bars. "Noether's theorem is an iff" is replaced by the actual reason: step (1) fails, and the pendulum's energy comes from time translation. I softened the summary bullet the same way.
- 05 **workshop check never passed (bug).** `rangeDrift` was computed after the ±15% axis padding, so it was always at least 0.15, above the 0.02 threshold. Every combination said "not conserved", including free particle + translation. It is now computed before the padding. I verified in the browser: free/translation and free/boost pass; the others fail with the correct ranges.
- 05: the pendulum status said "Not conserved, range 0.000" before play. It now asks the reader to press play.
- 06: the EM row. I verified that H = p·v - L = ½mv² + eφ for static fields, which is the mechanical energy. The page called it "canonical energy, not the mechanical energy" and styled the row red. I rewrote the row prose: A enters the canonical momentum and H(p), not the value of H. The summary bullet "H = T+V only when V is velocity-independent" now says "homogeneous quadratic T", with the rotating-hoop bead as a genuine counterexample.
- 07 (old 08): "Pauli a year before Schrödinger" is wrong. Both date from early 1926: Pauli's paper was received on 17 Jan 1926 and Schrödinger's first paper on 27 Jan. "Nineteenth-century physicists missed LRL" is wrong: Hermann and Bernoulli had it around 1710, Laplace in 1799 and Hamilton in the 1840s. I rewrote the paragraph and cut the "which is why her framework became canonical" puffery. I also fixed "gave Kepler his three laws".
- 08 (old 09): "Every conserved charge in particle physics is ... internal". I replaced it with a correct split between internal charges and spacetime charges.
- 09 (old 10): Noether came to Göttingen in spring 1915, not 1917. I rewrote the history card and two sentences. The Klein–Hilbert exchange was published in 1918.
- 10 (old 11): "the chain condition is the only axiom, the Dedekind story falls out". I replaced it with the correct content: 1921 gives primary decomposition; the 1927 axioms give Dedekind domains (Noetherian, integrally closed, dim 1). Dedekind's row now says "ring of integers of a number field".
- 11 (old 12): "every ring of algebraic integers" is now "the ring of integers of every number field". The ring of all algebraic integers is not Noetherian.
- 12 (old 13): Hilbert's 1890 contribution was forms in any number of variables. Gordan had the binary case in 1868. I fixed the lament paragraph.
- 13 (old 14): k[t³,t⁴,t⁵] was labeled "twisted cubic". It is now "monomial curve (t³, t⁴, t⁵)". I checked the rank 3 and dim 1 in the row.
- 07 (old), carried into 06: the quadrupole formula ½(qx²−qy²)+½(qx²+qy²) simplifies to qx². That did not match the code, which uses ½|q|² + qx². The merged figure uses and states V = ½|q|² + qx².

## Rejected or left

- No flagged error was rejected: each one checked out when I derived it or looked it up.
- 09 (old 10): the reviewer calls the field-shift figure "weak". It is honest (it draws φ and φ+α(x) from sliders) but teaches little. I left it; see Unresolved.
- Em dashes remain in paragraphs I did not touch (about 40 across the series). That is left for the prose pass.

## Figures made honest or removed

- No fake figures were found in the surviving pages. The only broken check was the 05 workshop, which always failed and is now fixed.
- New figures in 06 and 12 compute everything they show: RK4 on the stated Lagrangians, and Buchberger via `NOETHER.grobner.buchberger`.
- Reduced motion: both new 06 animations jump straight to the final state when `Motion.reduced()` is set.

## Salvage from 15

- Buchberger stepper: ported to 12 as Fig 4, under a new section "From existence to an algorithm". It is the constructive answer to Gordan's complaint.
- Homology figure (`15-...html`, figure 4, git history): computes H0/H1 mod 2 of four small complexes via `NOETHER.topology.simplicialRanks`. It is real, but overlaps the TDA/cohomology series. A possible home is cohomology 01, as a warm-up. Not ported.
- Scheme figure (schematic) and equivariance figure (decoration): not worth keeping.

## Unresolved (needs a human)

- 09 Fig 1 (global vs local shift) is weak. A figure that computed ∂μα terms in the Lagrangian would earn its place.
- 12 Figs 2 and 3 are proof diagrams. They are honest schematics, but static.
- The workshop's verdict badge and status-bar styling border on the "status badge" anti-pattern. Left for the prose/design pass.
- 13's summary claim "eliminating one variable per ideal generator" is loose, since the proof eliminates one variable per algebraic dependence. Not flagged by the reviewer; left.

## Inbound links

None. The only other reference to this series is `docs/lattice-simulation/index.html` → `../noether/index.html`, which is unchanged. The homepage's `count: 15` needs updating.

## Homepage entry

- title: Invariance: The Mathematics of Emmy Noether
- count: 13
- desc: Noether's two theorems and her algebra. Build the first theorem from a Lagrangian, and watch energy, momentum and angular momentum stay flat or drift as symmetries hold or break. Meet the Laplace-Runge-Lenz vector and electric charge, then follow the chain condition through ideals, Noetherian rings, Hilbert's basis theorem with Buchberger's algorithm, and Noether normalization.
- tags: Noether's theorem · Lagrangians · conservation laws · Noetherian rings · Hilbert basis
