### 10 enrichment

File: docs/emergence/10-stigmergy.html. 2026-10-05. Four new computed figures (2, 3, 5, 8; old 2-4 renumbered 4, 6, 7). Model code moved into one DOM-free block at the top of the page script (mulberry32, makeMaze, mazeShortest, Physarum, choiceColony, Bridge, Termites); Bridge and Termites take an rng argument and are otherwise unchanged (live Figures 4 and 7 pass Math.random). Scripts in the session scratchpad `10/`: models.js (byte-identical to the page block), load.mjs, smaze.mjs (50 mazes, mu 0.5-2.5, t = 1000, dt 0.2), seeds.mjs, surn.mjs, slam.mjs, sterm.mjs, pw.mjs and pwi.mjs (headless checks). Sources read this session: Bonifaci, Mehlhorn and Varma arXiv:1106.0423 (pages 1-6: model, theorem, related work); Hokkaido repository record for Tero, Kobayashi and Nakagaki 2007 (citation and abstract); search-result citation for Bonifaci et al. J. Theor. Biol. 309, 121-133 (2012). Prose 2,118 to 1,494 words. render-check PASS; headless 1280/390 x light/dark plus reduced motion: no console errors, no overflow, no SVG text under 11px, no NaN, no em dash.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 10 | Tero, Kobayashi and Nakagaki (2007) modelled the maze as tubes carrying a fixed flow between the food sources; Q_e = (D_e/L_e) dp_e | sourced | Bonifaci et al. 2012 sec. 1 restates [TKN07]: current 1 forced from s0 to s1, R_e = L_e/D_e | new |
| 10 | dD_e/dt = \|Q_e\|^mu - D_e | sourced (mu = 1) / from memory (mu as exponent) | Bonifaci eq. 1 is the mu = 1 case; Tero 2007 abstract names "a key parameter corresponding to the extent of the feedback regulation"; the power-law form with exponent mu is from memory of Tero 2007, not read | new |
| 10 | Nakagaki maze: food at two exits, dead ends withdrew, tube along the shortest route | sourced | Bonifaci et al. sec. 1 describing [NYT00] (Fig. 1) | reworded, shorter |
| 10 | At mu = 1 the network ends on the shortest route; proved for any network with a unique shortest route | sourced | Bonifaci et al. Theorem 2 ("If the shortest source-sink path is unique, the dynamics converge to the flow of value one along the shortest source-sink path") | new |
| 10 | Dead ends fade within a few time units | computed / derived | zero flow gives D = e^-t; drops under 0.01 at t = 4.6; chart for maze 13 shows the drop near t = 4 | new |
| 10 | 49 of 50 seeded mazes settled on the shortest route by t = 1000; the last by 1214 | computed | smaze.mjs, seeds 1-50, 13x8 nodes, 10 extra loops; maze 47 converges at t = 1214 (seeds.mjs, T = 3000) | new |
| 10 | Median time to settle 8 at mu = 2, 50 at mu = 1 | computed | smaze.mjs (checked every 2 time units): medians 50 (mu 1), 10 (1.5), 8 (2), 6 (2.5) | new |
| 10 | At mu = 2.5, 4 of 50 mazes kept a route up to 0.7% longer | computed | smaze.mjs: wrong at seeds 13, 19, 25, 28; lengths 0.25%, 0.49%, 0.66%, 0.33% over shortest; at mu = 2 only seed 13 | new |
| 10 | At mu = 0.5 the network keeps about twice the shortest length; 30% of its tubes would cut the food sources apart if lost | computed | smaze.mjs: mean open length / L* 2.16, mean share of bridge edges 0.30 (D > 0.01); 0.75 gives 1.92 and 0.35 | new |
| 10 | Figure 2 default (maze 13, mu 1): open tube 31.2 = shortest route at t = 1000; mu 0.5 gives 59.1 with 17 of 58 critical; mu 2.5 gives 31.3 | computed | headless readouts (pwi.mjs) | new |
| 10 | Tero 2010: 36 cities, 26 h, matched on distance, slightly shorter, rail more robust 4% vs 14% for lit networks | sourced (prior session) | as in the 2026-09-25 ledger rows; compressed | reworded |
| 10 | At n = 1 the choice rule is a Polya urn; final share sd sqrt(p(1-p)(N+2k)/(N(2k+1))) = 0.080 at k = 20, N = 1000 | derived | Polya urn with k balls of each colour; measured 0.073 over 400 colonies (2.5 standard errors low) | new |
| 10 | At n = 0.5 every colony ends between 40% and 60% (k = 20) | computed | surn.mjs with the page seeding mulberry32(k*1000 + col + 1) | new |
| 10 | At n = 2, k = 20: 72% send more than 80% one way, 5% end between 40% and 60% | computed | surn.mjs; page readout identical | new |
| 10 | At k = 100, n = 2: half the colonies between 40% and 60% after 1,000 ants | computed | surn.mjs: 50%; page readout identical | new |
| 10 | Deneubourg et al. 1990 cited only for the rule's source | sourced (prior) | "ants that cross one at a time" is now presented as this figure's simplification, not as their model | reworded |
| 10 | Long-branch end field before opening sits just under q rho / lambda, rho = 100/60 per cell per step | computed / derived | 100 ants x 2 passes per 120-step round trip on a 60-cell branch; slam.mjs measured 411 vs 417 at 0.004, 38.4 vs 41.7 at 0.04, 19.5 vs 20.8 at 0.08 | new |
| 10 | Up to lambda = 0.028 no late colony switched; 16 of 30 at 0.04; 23 and 26 of 30 at 0.044 and 0.048 | computed | slam.mjs, 30 colonies per setting, seed 1 + r*1000 + i*10 + m (identical to the page); 1 of 30 at 0.032, 4 of 30 at 0.036 | replaces the 2026-09-25 percentages (78%, 87% from 600 colonies) with the figure's own seeded batch |
| 10 | Switching starts as the field nears twice k | computed | field 44.4 at 0.036 (2.2 k), 38.4 at 0.04 (1.9 k) | new |
| 10 | Past about 0.056 traffic splits | computed | late colonies ending 30-70%: 16 of 30 at 0.056, 26 at 0.06, 30 at 0.072 | reworded |
| 10 | Open colonies 29 and 30 of 30 at 0.044 and 0.048 | computed | slam.mjs | dropped from prose in the cut; visible in Fig. 5 |
| 10 | In the model without evaporation no late colony switches | computed | slam.mjs 0 of 30 (prior session 0 of 400) | kept |
| 10 | Clustering threshold rho q / lambda = K at lifetime 75 | derived | 0.08 x 1 x 75 = 6 | kept |
| 10 | Lifetime 75: 42-43% in piles at step 4,000, 60-68% at 12,000; lifetime 15: 95% at 4,000 | computed | sterm.mjs, seeds mulberry32(1000*s + lifetime index), s = 1, 2 (identical to the page) | replaces "at 150 less than a third" style statements with the figure's numbers |
| 10 | Lifetime 150 about 31%, 250 7-8%, 500 2% or less at 12,000 | computed | sterm.mjs: 31/31, 7/8, 0/2 | updated (prior: "at 500 almost none") |
| 10 | Lifetime 2: no pile of ten at step 1,000; all pellets in 4 to 7 piles by 12,000 | computed | sterm.mjs: 0 piles at 1,000 both seeds; 100% in 7 and 4 piles at 12,000 | new |
| 10 | Lone pellet field about K/2, pile about 4K, pick-up ratio about ten; about fifteen piles hold nearly all by 12,000 | computed (prior session) | unchanged numbers; sterm.mjs lifetime 15/25 runs give 13-15 piles at 94-98% | compressed |
| 10 | Cement pheromone: Green 2017 excavation sites; Calovi 2019 surface curvature | sourced (prior session, abstracts) | compressed | reworded |
| 10 | Figure 5, 8 sweeps run only while on screen, in 24 ms chunks; seeded | code | makeBatch() | new |

Not fixed: Figure 1 still updates particles in a fixed order (Jones uses random order); Jones 2010's own default parameters still unconfirmed. The power-law exponent form of Tero 2007's f(Q) is from memory (marked above).
