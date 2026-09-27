# Claims ledger: lattice-simulation

This series hasn't had a full fact-check; these are settled leads only (from plans/FACT-CHECK.md, 2026-09-27).

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 06 | "moderate disorder ... leaves the exponents unchanged" | wrong (too strong), fixed | Harris criterion: disorder is relevant if alpha > 0. For 2D Ising alpha = 0, so weak bond disorder is marginal; it is marginally irrelevant and gives logarithmic corrections to pure-Ising scaling (Dotsenko and Dotsenko 1983; Shalaev 1984; Shankar 1987; Ludwig 1987) | Replaced with a sentence saying disorder is borderline in 2D: exponents survive with log corrections |
| 05 | Shedding onset given as Re about 47 (regime text), above about 50 (caption), below 40 steady / past 50 (wake section) | inconsistent, fixed | Literature onset for an unconfined circular cylinder is Re_c about 46 to 47 (Provansal, Mathis and Boyer 1987; Jackson 1987, 46.2; Williamson 1996, about 49 from experiments). Note: the page's channel (D = 22 in a 90-cell channel, blockage about 0.24, uniform inlet) is confined, which shifts the simulated onset; not measured here | Caption and wake section now say Re about 47, matching the regime paragraph |
| 05 | "Below Ma about 0.3 ... this is invisible" | wrong (overstated), fixed | The O(u^3) truncation error of the D2Q9 equilibrium shrinks with Ma but is not zero; LBM practice keeps Ma near 0.1 (Kruger et al., The Lattice Boltzmann Method, 2017). Page slider: U up to 0.12, Ma = U sqrt(3) about 0.21 | Now says practitioners keep Ma near 0.1 and the page tops out near Ma 0.2, where the error is small but not zero |
