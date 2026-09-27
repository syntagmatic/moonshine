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
