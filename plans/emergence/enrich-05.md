### 05 enrichment

File: docs/emergence/05-spin-glass.html. 2026-10-05. Four new figures (2, 5, 6, 7); old Figures 2 and 3 are now 3 and 4. The model code for the new figures is one DOM-free block, `<script id="sg-model">` (object `SG`), which the figures call and which the scripts below extract from the HTML and run in node with the page's seeds. Scripts (session scratchpad 05/): drive.mjs (extracts mulberry32 and the sg-model block from the page), verify.mjs (Figures 2 and 5), verify2.mjs (Figures 6 and 7), pw.mjs and pwi.mjs (Playwright: every figure run to completion and screenshotted at 1280 and 390 px, light and dark, plus clicks, arrow keys and buttons; reduced-motion run), pwq.mjs (Chromium vs node check). render-check: PASS. No horizontal scroll at 390 px; no SVG text under 11 px; no console errors.

Seeds: Figure 2 mulberry32(5150), draw-major order over k = 0..43, 24 draws each. Figure 5 bonds mulberry32(640), spins and dynamics mulberry32(641) for every temperature. Figure 6 mulberry32(1975), per sample: couplings, steepest descent, quench, anneal, exact (N <= 20); 24 samples for N <= 256, 12 at 512, 6 at 1024. Figure 7 panel p uses mulberry32(1983 + p); "New" buttons step the seed.

Node and Chromium agree on every number quoted except Figure 7's third glass sample (|q| < 0.25: 40.7% in node 26, 39.9% in Chromium 147); long chaotic runs diverge between engines. The page quotes the browser's 40%.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 05 | The 20-spin patch has 43 bonds and 24 triangles | computed | SG.patch(4, 5) | new |
| 05 | Fig 2 dashed curve: expected frustrated share with exactly k of 43 bonds AF | derived | P(odd AF among 3 bonds drawn without replacement) = [k C(43-k,2) + C(k,3)] / C(43,3); matches column means (e.g. 0.503 vs 12.08/24 at k = 17) | new |
| 05 | Frustrated share reaches one half by 40% AF and climbs to every triangle at 100% | computed/derived | expectation first >= 0.5 at k = 16 (37%); k = 43: 24.0 of 24 in all draws (a triangle is an odd loop) | new |
| 05 | Broken bonds >= half the frustrated count (floor) | derived | each frustrated triangle needs >= 1 broken bond, each bond borders <= 2 triangles | new |
| 05 | At 40% (17 of 43): 12.1 of 24 frustrated, ground state breaks 8.0 bonds vs floor 6.0, median 6 ground states | computed | verify.mjs k = 17: 12.08, 8.04, 6.04, median 6 (browser readout identical) | new |
| 05 | All AF: 12 broken bonds pair the 24 triangles exactly; ground state unique on this patch | computed | verify.mjs k = 43: broken 12.00 = floor, count 1 in 24/24 draws (open parallelogram boundary) | new |
| 05 | On a large triangular lattice the all-AF ground-state count grows exponentially (Wannier 1950) | sourced | Wannier, Phys. Rev. 79, 357 (1950), "Antiferromagnetism. The Triangular Ising Net": nonzero entropy at T = 0 (0.323 k_B per spin after correction), via search listing and INSPIRE record | new |
| 05 | Median 17 ground states just short of all AF; more than 100 in 8 of 1,056 draws | computed | verify.mjs: highest column medians 17 (k = 39, 41); 8 draws > 100, max 232 (k = 29) | new |
| 05 | Planar ground state = pairing frustrated triangles with shortest strings of broken bonds, a matching problem | sourced (reworded) | Mertens cond-mat/0012185 (ledger row above: planar Ising reduces to minimum-weight matching); the string picture is Figure 2's floor argument | rewording of existing row |
| 05 | Fig 5: 64 x 64 periodic triangular lattice, 4,096 spins, 40% AF; same bonds and start at T = 0, 0.6, 1, 2 | computed | SG.bigLattice(64, 0.4), agingRun seeds above; T = 0 accepts only dE < 0 (the Figure 4 quench rule) | new |
| 05 | T = 0 quench stuck within seven sweeps at -0.426 per bond, no lower than T = 2 | computed | verify.mjs: final -0.4258 first recorded at sweep 7; T = 2 runs -0.419 to -0.434 (final -0.421) | new |
| 05 | T = 1: -0.544 at 300, -0.549 at 10,000 | computed | verify.mjs: -0.5443 at 289, -0.5485 at 10,000 | new |
| 05 | T = 0.6: -0.560 at 3,000, -0.562 at 10,000, still falling | computed | verify.mjs: -0.5599 at 3,156, -0.5615 at 10,000 (last change at sweep 6,234 on the recording grid) | new |
| 05 | T = 2: three ages give the same curve, forgets in a few dozen sweeps | computed | C at t = 30: 0.141, 0.155, 0.179 for ages 10, 100, 1000; about 0 by t = 300 | new |
| 05 | T = 0.6, 1,000 sweeps on: overlap 0.42 from age 10, 0.73 from age 1,000 | computed | verify.mjs t = 1,013: 0.417 and 0.733 | new |
| 05 | T = 1: 0.18 vs 0.41 after 1,000 sweeps | computed | verify.mjs t = 1,013: 0.175 (age 10), 0.405 (age 1,000) | new |
| 05 | Aging measured in CuMn by Lundgren, Svedlindh, Nordblad, Beckman 1983 | sourced | Phys. Rev. Lett. 51, 911 (1983), "Dynamics of the Relaxation-Time Spectrum in a CuMn Spin-Glass" (search listing and arXiv reviews citing it as the aging experiment) | new |
| 05 | SK model: all pairs coupled, Gaussian couplings of variance 1/N (Sherrington and Kirkpatrick 1975) | sourced | PRL 35, 1792 (1975), title and abstract summary via search: infinite-ranged Gaussian random interactions | new |
| 05 | SK freezes below T = 1 (with variance 1/N) | from memory | standard T_f = J result of the SK paper, not read this session; consistent with Fig 7 (P(q) collapses at T = 1.5) | check |
| 05 | Parisi ground-state energy -0.7633 per spin | sourced | Palassini, arXiv cond-mat/0307713: "e0 = -0.7633..." citing Parisi's RSB solution | new |
| 05 | Palassini: finite-size gap shrinks roughly as N^(-2/3) | sourced | same paper: <e_N> = e0 + b N^-omega, omega = 0.673 +- 0.002 | new |
| 05 | Exact ground state at 20 spins averages -0.654 per spin | computed | verify2.mjs, 24 samples (12: -0.641, 16: -0.664) | new |
| 05 | Anneal finds the exact ground state in 59 of 72 small samples | computed | 22/24 at N = 12, 18/24 at 16, 19/24 at 20 (node and browser agree) | new |
| 05 | Anneal reaches -0.749 at 1,024 spins; both descents near -0.68, about 0.07 higher | computed | N = 1024, 6 samples: anneal -0.7493, steepest -0.6760, quench -0.6818 (gaps 0.073, 0.068) | new |
| 05 | Steepest-first vs random order makes little difference | computed | means within about 0.02 of each other at every N from 12 to 1024, crossing back and forth | new |
| 05 | Parisi proposed the overlap distribution P(q) as order parameter (1983) | sourced | G. Parisi, PRL 50, 1946 (1983), "Order parameter for spin-glasses": order parameter related to the probability distribution of overlaps (search summary) | new |
| 05 | Fig 7: 64 spins, 2 copies x 12 temperatures (T to 1.6, or to 2.4 for T = 1.5), 20,000 sweeps, 4,000 burn-in | computed | SG.overlapRun; swap acceptance 0.72 to 0.74 at T = 0.5, 0.93 to 0.98 at 1.5; P(q < 0) between 0.488 and 0.495 at T = 0.5 (pq2.mjs, same seeds) (symmetric, so the copies mix) | new |
| 05 | Equal-coupling ferromagnet (1/N) also orders below T = 1 | derived | Curie-Weiss m = tanh(m/T), T_c = 1; Fig 7 peaks at q = +-0.94 match m^2 with m = 0.957 at T = 0.5 | new |
| 05 | Ferromagnet: two sharp peaks at q = +-0.94 | computed | peak bin q = -0.938 (= -30/32), 11.1% of samples; |q| < 0.25: 0% | new |
| 05 | Glass samples: |q| < 0.25 holds 26%, 6%, 40% | computed | Chromium 26.0%, 6.4%, 39.9% (node: 26.0, 6.4, 40.7) | new |
| 05 | T = 1.5: all four collapse to one bump around zero | computed | |q| < 0.25: 94%, 86%, 85%, 87% | new |
| 05 | Figure 3 (anneal) prose trimmed; ground-state degeneracy now "about nine ground states" | computed (earlier) | existing row: median 9 over 120 draws | reworded |
