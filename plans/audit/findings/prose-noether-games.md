# Findings: prose pass, track noether-games

Series: `docs/noether/` (13 articles + index) and `docs/game-is-the-math/` (10 articles + index).

Word counts are all visible page text with `<script>`, `<style>` and comments stripped. That includes figure labels, table cells and control text as well as prose, so the reduction in prose alone is larger than these numbers show. Em dashes are counted in visible text and, separately, in JS string literals.

| Series | Words before | Words after | Change | Em dashes before (text + JS) | After |
|---|---|---|---|---|---|
| noether | 16,286 | 13,193 | −19% | 41 + 18 | 0 + 0 |
| game-is-the-math | 12,570 | 12,247 | −3% | 0 + 0 | 0 + 0 |

Every page passes `render-check.mjs` on port 8105.

## Noether: what changed

- Removed every "Concept Summary" block (articles 01 to 13). They were grand summaries that repeated the section above. The few items they held that appeared nowhere else were moved into the prose: the bead-on-a-hoop example in 06 and the field-theory continuity-equation point in 08.
- 09: turned the "First vs. second, at a glance" two-column card and the amber history card into prose.
- Changed "explainer N" to "Part N" throughout, matching the subtitles. Fixed "the next fourteen explainers" in 01 (the series has 13 parts), "the last five explainers" in 09 (it is Parts 5 to 8), the 05 nav label (which pointed at the old title of 06), and the 04 workshop verdict string (it sent readers to Part 5 for the Galilean boost, which is actually covered in 04).
- Changed the page titles from "X — Invariance: ..." to "X | Invariance: ...", matching the games series.
- Changed the table placeholder cells in 01 and the 04 sample rows from "—" to blank or "·". A non-finite value in the 01 function table now reads "undefined".
- Cut contrast tics, "not X but Y" constructions, rhetorical questions and inflated words (beautiful, miracle, astonishing, "the whole business"), and trimmed captions that repeated the prose.

## Noether: errors fixed (each confirmed)

- 02: the text said a binary quadratic form is "zero on a conic section", with negative discriminant meaning "a closed ellipse". The zero set of a homogeneous quadratic is the origin (definite), two lines, or one line. Ellipses and hyperbolas are its level curves. Fixed in the prose and the Figure 1 caption. The figure's own status text was already right.
- 02: "Knowing the invariants is the same as knowing which orbit you are on" is false here. For Δ < 0 the level set has two sheets (positive definite and negative definite forms), which are separate SL2(R) orbits. Softened the claim and added that caveat.
- 03: "predates Lagrangian mechanics by a hundred and forty years" (1696). That is 92 years to Lagrange (1788) and 138 years to Hamilton (1834), so it now says "Hamilton's version".
- 04: rotations are not a symmetry of ½r² − 2y about the origin, but the sentence about "discrete directions that preserve the axis" was muddled. Replaced it with "rotations about the origin no longer preserve it". I also dropped "rigid-body rotations for some Lagrangians" as an example of a quasi-symmetry, since it is not a standard one. The replacement example, a gauge transformation of the EM potentials, changes a charged particle's L by q dχ/dt, which is standard.
- 06: "first written by Hamilton in 1833". Hamilton's dynamics papers are 1834 and 1835, so it now says "the 1830s".
- 07: "A free particle in 3D ... its bound states in a spherically symmetric potential" was self-contradictory. It now says "a particle in a spherically symmetric potential".
- 08: the Figure 1 caption said the Schrödinger equation "cares about the lower curve (|ψ|²), not the upper". Relative phase does matter; only a global phase is unobservable. Also, "the theory you get is QED" needs a relativistic electron field, not the Schrödinger field. Both are fixed.
- 10: "(which Dedekind called a *Dedekind domain*)". The name came later, and the same article credits Noether's 1927 characterization. It now says "in later terminology". The Figure 3 caption said "each of the four prime ideals". There are three distinct primes (p appears twice). The caption was rewritten, and the prose now spells out (1±√−5) = p q and p q̄ (checked by hand).
- 11: the argument that x_{n+1} ∉ (x_1..x_n) ("monomials in different variables are linearly independent") was weak. It is replaced by the substitution x_1..x_n → 0. Also, "a technique we'll use in the proof of Hilbert's basis theorem" referred to the maximal-element form, but 12's proof uses the chain and finite generation, so that is corrected.
- 12: the closing paragraph said localizations and formal power series rings are Noetherian "because the basis theorem says so". Localization needs a separate (easy) argument, and power series need an analogous theorem. It is replaced with the true statement that quotients of Noetherian rings are Noetherian, so coordinate rings are.
- 13: the proof sketch said "iterate for every generator of the ideal, eliminating one variable at a time". The standard proof eliminates one variable per algebraic dependence among the remaining variables, which the previous track also flagged. Rewritten to match. The real-fiber claims were also wrong: "for most x, two real solutions" fails on y² = x³ − x, where half the line has none, and the cone's branch locus was called "the apex" in the prose but "xy = 0" in the caption. Both are fixed (the branch locus is xy = 0).

## Games: what changed

This series was rewritten last pass and has almost no slop left. I cut lightly on purpose rather than forcing 20 to 30 percent out of prose that already reads well.

- 03, 06: removed intros that re-explained the previous article (the stalk argument, the BR stalk options, Berlekamp's rule) and replaced them with one-line pointers.
- 05: removed a rhetorical question ("Why 1/2 and not ...?") and a first-person "I checked"; 10 had the same first-person line.
- 06: its subtitle lacked "Part 6 of 10"; added.
- 04, index: "Sprague–Grundy" (en dash) is now "Sprague-Grundy", matching the rest of the series.
- 06, 08, 09, 10 (and noether 08): switched British spellings (colour, centre, analysing, idealised, neighbour, organise) to the series' majority American spelling, in prose only. JS variable names are untouched.
- 08, 09: small caption and intro trims. In 09, removed the word "striking".
- index: *On Numbers and Games* (1976) was Academic Press, not A K Peters (A K Peters published the 2001 second edition). The Hex card said the first player has a strategy "nobody knows", which is false for small boards; it is now qualified.

Checked and left alone: the 08 hottest-first arithmetic ({6|−2}+{2|0}, the three Go fights), the 10 turn-count/long-chain parity derivation against Berlekamp's rule (dots + long chains even for the first player), the 10 Figure 4 tallies (68 + 1,108 + 32 + 1,396 = 2,604), and 04's Marienbad claim (1⊕3⊕5⊕7 = 0, fat, so it is lost for the first player).

## Suspected issues not fixed

- noether 04: V = ½(x²+y²) − 2y is ½(x² + (y−2)²) − 2, so it is still rotationally symmetric about (0, 2). The figure only rotates about the origin, so nothing on the page is false, but a sharp reader will notice. A different bias (e.g. a cubic term) would make the "broken symmetry" point cleaner. That is a figure change, so I left it.
- noether 11, Figure 1 caption: "(12) has at most length d(12) = 6" is a true but loose bound. The longest strict chain from (12) has 4 ideals (Ω(12) + 1). Not wrong, so I left it.
- noether 07: the S³ picture is now phrased as "bound Kepler motion at a fixed energy can be mapped onto a 3-sphere" (Fock/Moser). I did not check a primary source for the exact form of the statement.
- noether 13: "for generic constants c_i" assumes an infinite field. Standard, but unstated.
- game 07: the value of 2×3 and the outcome claims for 9×9/10×10/11×11 come from the previous track. I did not re-verify them.
- game 09: the "centre opening on 10-by-10" solved in 2013 comes from the previous track and was not re-verified.

## Needs a human

- Dead CSS: `.takeaway-list` (noether 01) and `.compare-card` and `.history-card` (noether 09) no longer have any markup. They are harmless, and I left them to keep the diff prose-only.
- The games series is still far short of the 20 to 30 percent length target (−3%). I think it is already at about the right length. If you want it shorter, the candidates are the long captions in 07 (Figures 2 and 6) and 10 (Figures 1 and 4), and Gale's proof paragraph in 09.
- The games index back-links to four other series (Exceptional Atlas, Parallel Coordinates, SPH, Emergence) that have nothing to do with this one. All four directories still exist.
