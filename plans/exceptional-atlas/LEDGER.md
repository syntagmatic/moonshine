# Exceptional Atlas: claims ledger

This series has not had a full fact-check. The rows below are only the leads
flagged in plans/FACT-CHECK.md and settled on 2026-09-27.

| Page | Claim | Verdict | Source or derivation | Fix |
|---|---|---|---|---|
| 02 | Weyl group "rebuilds the whole root system from a single root" (old subtitle) | fine | Body says one orbit only when simply-laced (two orbits otherwise). Subtitle, index card and PROMPT no longer make the claim; PROMPT only says one E8 root's orbit fills all 240, which is true (E8 is simply-laced). | none |
| 05 | Every finite subgroup of SU(2) except Z/2 has a_ij in {0, 1} | wrong, fixed | Trivial group: V = 2 rho_0, so a_00 = 2 (double loop, degenerate affine A_0). Z/2: a_01 = 2. Z/n for n >= 3: V = chi_1 + chi_-1 distinct, so 0/1; binary dihedral and 2T/2O/2I graphs are simple. | "except two", added the trivial-group case |
| 05 | Intro: double covers of the Platonic rotation groups produce the ADE diagrams | wrong, fixed | Klein's list: cyclic and binary dihedral groups give A_n, D_n; only 2T, 2O, 2I (Platonic double covers) give E6, E7, E8. | Intro now assigns each family its diagrams |
| 07 | The three branched solutions of 1/p + 1/q + 1/r > 1 | wrong, fixed | (n, 2, 2) satisfies it for all n (with Part 4's arm convention, p + q + r - 2 nodes, giving D_{n+2}); only the exceptional solutions number three. | Sentence names the (n, 2, 2) family, then the three exceptional ones |
| 08 | Fig 9 caption: 600-cell inner products are cosines of multiples of 36 degrees | wrong, fixed | Inner products among 2I are 0, +-1/2, +-phi/2, +-1/(2 phi), +-1; +-1/2 is cos 60 / cos 120, not a multiple of 36. The runtime readout already listed 60. | Caption adds 60 and 120 degrees and the value list |
| 09 | Kissing table best known: dim 9 = 272, dim 10 = 336 | wrong, fixed | 272 and 336 are the laminated-lattice kissing numbers. Cohn's table of kissing bounds / Wikipedia (2026): 9 -> 306, 10 -> 510 (Ganzhinov 2022), 12 -> 841 (2026, arXiv 2606.18984 / 2609.09179), 20 -> 19,448 (Cohn and Li 2024, arXiv 2411.04916). | Table rows 9, 10 and chart data 9, 10, 12, 20 updated; caption cites Cohn's table as of 2026 |
| 09 | phi "is a combination of modular forms of weight 8 and 12" (prose and KaTeX sketch) | wrong, fixed | Viazovska, arXiv 1603.04246, eq. (28): phi_0 = phi_-4 E2^2 + 2 phi_-2 E2 + j - 1728, "not modular" (quasimodular, weight 0); eq. (43): psi_I, a weakly holomorphic modular form of weight -2 for Gamma(2). Each eigenfunction is sin^2(pi r^2/2) times a Laplace-type integral of phi(-1/z) z^2 e^{pi i r^2 z} (up to constants). | Prose describes the two pieces; formula replaced with the integral shape; dropped the undefined "linear operator A" |

## 06 octonions: Fano plane and related facts (2026-09-27)

Checked by computation (node against `lib/oct-math.js`, and headless Chromium
reading the drawn SVG), not by eye.

| Page | Claim | Verdict | Source or derivation | Fix |
|---|---|---|---|---|
| 06 | `OCT.oct.mul` is Baez's table, triples (i, i+1, i+3) mod 7 | fine | All 42 ordered products of distinct units match the seven triples and their reverses; all 21 pairs covered once. Random tests: norm multiplicative, alternative and Moufang laws hold to 1e-14, associator up to 9. | none |
| 06 | Cayley-Dickson formula (a, b)(c, d) = (ac - conj(d) b, da + b conj(c)) gives the octonions, then sedenions with zero divisors | fine | `OCT.cd` at 8D: norm multiplicative, alternative to 1e-14. At 16D: (e3 + e10)(e6 - e15) = 0. | none |
| 06 | Fig 1 layout: sides, medians and inscribed circle are the seven Baez lines; index doubling rotates the picture by a third of a turn | fine | Midpoints and circle radius R/2 checked; each drawn line holds its triple; i -> 2i sends 1 -> 2 -> 4 and 3 -> 6 -> 5 by +120 degrees, fixes 7. | none |
| 06 | Fig 1 direction arrows give each line's cyclic order | wrong, fixed | Arrows pointed from L[0] toward L[1]. On (5, 6, 1) and (4, 5, 7) those are the line's endpoints, so the arrow read e5 -> e1 -> e6 (implying e5 e1 = +e6; it is -e6) and e4 -> e7 -> e5. Rendered SVG read back: 2 of 7 wrong before, 7 of 7 right after. | Arrow now runs from the endpoint that starts the cycle toward the middle point; selected pairs bold the line's own arrow instead of drawing a separate pair arrow that could contradict it |
| 06 | Moufang identities 3 "(ab)(ca) = a(bc)a" and 4 "flexible variant (ab)(ca) = (a(bc))a" | wrong, fixed | Both computed (a(bc))a, so 4 duplicated 3; "flexible" names (ab)a = a(ba), a different law. | 3 is (ab)(ca) = (a(bc))a, 4 is (ab)(ca) = a((bc)a); both verified on octonions, fail on sedenions |
| 06 | Each doubling from R to S loses one property | wrong, fixed | O -> S loses alternativity and the multiplicative norm (the page's own table shows two crosses). | Caption and prose say the step to S loses two |
| 06 | Fig 7 detail: +-1 "span the one-dimensional Cartan of su(2)" | wrong, fixed | +-1 are the two roots of an su(2) in E8 = E7 x A1 + (56, 2); roots are not the Cartan. The main text already said roots. | Detail now says roots |
| 06 | 240 integral units split 2 / 126 / 112 by real part; 126 are E7's roots; 112 = (56, 2) | fine | Ran the page's generator: 240 units closed under all 57,600 products, split 2 / 126 / 112, inner products {0, +-1/2, +-1}. | none |
| 06 | Magic square dimensions from Der(A) + A' x J' + Der(J) | fine | O row: 14 + 7(3 dim B + 2) + {3, 8, 21, 52} = 52, 78, 133, 248; symmetric. | none |
| 06 | Associator figure labels | fixed (display) | Showed products equal to +-1 as "e0" / "-e0". | Shows 1 / -1 with a real minus sign |

