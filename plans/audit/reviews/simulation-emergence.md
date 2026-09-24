# emergence (43 articles + index, all added 2026-04-11, 22.5k words total)

Scores are S F C Fit (Substance, Figures, Craft, Fit), 1-5 each.

Code checks (grep plus windows of 120 lines or less) on 08, 19, 04, 27, 43, 37, 44, 22, 23, 38, 41, 40, 21, 10, 28, 25:
- **Real update rules:** BTW toppling (08), D2Q9 BGK LBM with a measured Strouhal number (19), IDM car-following (04), mean-field Kuramoto with r(K) computed from real simulation runs (27), overdamped Langevin ratchet (37), D8 flow accumulation with stream-power erosion (41), Metropolis Ising (40 Fig 1), 2-4-1 backprop (21), chartist/fundamentalist price update (10), FHN excitable medium (28).
- **Fakes or broken figures:**
  - 43 galaxy is a 2D N-body code (x,y only). The page's central claim, that a cloud flattens into a disk, cannot happen in it.
  - 40 Fig 2 susceptibility is a hand-drawn Lorentzian. The magnetization is Onsager's exact formula, and nothing on that figure is simulated.
  - 44 Fig 2 immune curve is a hardcoded exponential.
  - 19 Fig 2 Re readout computes 1e6*v*L, 1000x too large. The code comment itself expects ~150 where the page shows ~150,000.
  - 22 Fig 3 says "click to regrow with a fresh random seed", but the crystal sim is deterministic. The "temperature trajectories" in the caption are just three threshold values.

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-flocking | 2 4 3 2 | FIX | Real boids, but it's the most-reproduced demo on the web. The lateral-line "wave" is decorative. It also duplicates type-systems/02-boids and sph/01's boids figure. Absorb 30. |
| 02-cellular-automata | 2 4 2 2 | FIX | Clickable rule truth table is good. The rest is encyclopedic (Wolfram classes, Rule 110). Overlaps lattice-simulation/06 (Life). Absorb 11. |
| 03-reaction-diffusion | 3 4 3 3 | FIX | Real Gray-Scott with a parameter map, but ~400 words of generic prose. Overlaps type-systems/09. Absorb 29 so the page has an argument (Turing vs positional information). |
| 04-traffic-shockwaves | 3 4 3 3 | FIX | Real IDM with space-time diagrams and a measured fundamental diagram. Prose is thin and the "20 km/h physical constant" is asserted without argument. Overlaps lattice-simulation/12 (NaSch); pick one home. |
| 05-epidemic-spreading | 2 3 2 1 | MERGE -> 13 | SIR-on-graph duplicates type-systems/06. The one non-obvious point (the epidemic threshold is percolation) belongs in 13. |
| 06-schelling-segregation | 2 3 2 2 | CUT | 288 words. Parable of the Polygons already did this better, and no new idea is added. |
| 07-predator-prey | 2 3 3 1 | MERGE -> 33 | ODE phase portrait plus Wa-Tor. Triplicated by 33, lattice-simulation/11 and type-systems/04. |
| 08-sandpile | 4 5 3 4 | FIX | Strongest idea density: real BTW, avalanche power law, the sandpile-group identity. Wrong claim: per-drop avalanche sizes in BTW are nearly uncorrelated, so the page's own spectrum figure will not show the promised -1 slope (Jensen et al. find 1/f^2, not 1/f). tau~1 is also doubtful. Sonification and composition mode are padding. |
| 09-ant-colony | 2 3 2 2 | MERGE -> 14 | Generic ACO overview in listicle sections. Belongs in a single stigmergy essay. |
| 10-market-bubbles | 2 3 2 3 | CUT | Real chartist model, but the core of the page is a five-phase listicle (Stealth/Awareness/Mania...) with heuristic "phase detection". |
| 11-langtons-ant | 2 3 3 2 | MERGE -> 02 | 356 words. A correct but thin retelling. |
| 12-diffusion-limited-aggregation | 4 4 3 4 | KEEP | Screening heatmap, sticking vs fractal dimension, DBM eta, and lightning/river duality: a real argument with real Laplacian relaxation. Should absorb 22, 38 and 41. |
| 13-fire-spread | 4 5 4 4 | KEEP | Best in series. Percolation S-curve, cluster statistics, then Drossel-Schwabl SOC, with the static-vs-dynamic power laws distinguished explicitly. |
| 14-slime-mold | 3 4 2 3 | FIX | Real Jones-style agent model. The Tokyo comparison is oversold and there are 12 em dashes. Make this the stigmergy hub (09, 26, 42). |
| 15-wave-interference | 2 3 2 1 | CUT | Linear superposition is the opposite of emergence. Textbook Young/Chladni; the "electron orbitals" line is loose. |
| 16-genetic-algorithms | 2 3 3 1 | CUT | Weasel-program-style demo. Duplicates type-systems/10-fitness-ga, and search is off-theme here. |
| 17-strange-attractors | 2 4 3 1 | CUT | Standard Lorenz demo. Chaos isn't emergence. Overlaps atlas-of-atlases/06. |
| 18-random-walks | 2 4 3 1 | CUT | Correct (Polya 34%), but generic. Duplicates type-systems/08 and algorithms-ml/03. |
| 19-vortex-streets | 3 4 3 2 | MERGE -> lattice-simulation/08 | Real LBM and a measured St. But the Fig 2 Re readout is 1000x off, and Tacoma Narrows is misattributed to vortex shedding (it was aeroelastic flutter). Duplicates the LBM article. |
| 20-opinion-dynamics | 2 3 3 2 | MERGE -> 35 | 354 words of Deffuant. Pairs naturally with majority rule. |
| 21-neural-networks-as-emergence | 1 3 3 1 | CUT | 349 words. An XOR MLP is not emergence in any useful sense. algorithms-ml covers it. |
| 22-crystal-growth | 1 2 3 1 | CUT | 255 words. A weaker DLA. The prose invokes surface energy the code lacks, and the "random seed" regrow is fake. |
| 23-collective-construction | 1 3 3 1 | CUT | 244 words, with a rule table and no argument. Subsumed by 26. |
| 24-sorting-networks | 3 4 3 1 | CUT (or move to algorithms-ml) | A decent, correct piece (known optima 0,1,3,5,9,12), but a fixed comparator network is the opposite of emergence. |
| 25-lenia | 3 4 2 4 | FIX | Distinct and visually real. 11 em dashes, and the kernel/growth explanation is shallow. |
| 26-termite-mounds | 3 3 3 2 | MERGE -> 14 | Pellet-pheromone clustering is fine. The arch and ventilation sims are toy rules presented as mechanism. |
| 27-kuramoto-model | 4 5 3 4 | KEEP | Correct Kc = 2*gamma, r(K) from real sweeps, and local vs mean-field coupling. Millennium Bridge fix correctly credited to dampers. |
| 28-belousov-zhabotinsky | 4 4 3 4 | KEEP | Real FHN phase plane leading to BZ dish, cardiac cable and spirals, with an S1-S2 protocol. A real throughline; trim the em dashes. |
| 29-morphogenesis | 2 4 3 2 | MERGE -> 03 | French flag plus exponential gradient is correct but textbook. Positional information vs Turing should be one essay. |
| 30-swarm-robotics | 2 3 3 1 | MERGE -> 01 | Aggregation is boids cohesion again. Sorting and shape formation are thin. |
| 31-power-law-networks | 2 3 3 2 | CUT | Standard BA plus robustness. Overlaps atlas-of-atlases/03. |
| 32-spin-glass | 3 4 3 3 | FIX | Frustration and multi-run annealing are real. The "sorted by energy, forest of minima" description is incoherent (sorting by energy gives a monotone curve). Absorb 40. |
| 33-predator-prey-space | 3 4 3 2 | FIX | Real reaction-diffusion predator-prey with refugia. Near-duplicate of lattice-simulation/11. Keep one of the two. |
| 34-self-avoiding-walks | 4 4 3 3 | KEEP | Honest about kinetic-growth bias (effective exponent 0.59-0.65 vs 3/4). Minor: 0.588 is not "the Flory" value (Flory gives 3/5), and 3/4 is Nienhuis's Coulomb-gas result, not proven via SLE. |
| 35-majority-rule | 3 4 3 3 | KEEP | Measured coarsening exponent vs sqrt(t), with bias sweep. Lead text says one colour always takes the grid, which contradicts its own frozen-stripes caveat. |
| 37-brownian-ratchet | 3 3 3 4 | FIX | Error: "at equilibrium even a tilted sawtooth gives zero drift" (a tilt is a force, so it drifts; should say untilted). The drift chart is a heuristic formula labelled "predicted", not measured from the particles shown. |
| 38-tumor-growth | 2 3 3 1 | CUT | 295 words. Same Laplacian-growth mechanism as 12 and 22. |
| 40-phase-transitions | 2 2 3 1 | CUT | 318 words. The susceptibility curve is fabricated. Duplicates lattice-simulation/09 and 32. |
| 41-river-networks | 3 3 3 2 | MERGE -> 12 | 233 words. The real stream-power sim with Horton ratios is the only good part. The "mathematical necessity" closing is overclaimed. |
| 42-trail-systems | 3 3 2 3 | MERGE -> 14 | Helbing active walkers. Fine, but it is stigmergy page #4. |
| 43-galaxy-formation | 1 2 3 3 | CUT | 2D sim cannot show flattening. "Angular momentum is conserved only perpendicular to the spin axis" is wrong. Prose contradicts the caption on high spin. Collisionless disks need dissipation this ignores. |
| 44-immune-response | 2 2 3 3 | CUT | "10 billion T-cells" is wrong (~4x10^11). The clonal-expansion curve is hardcoded. The agent sim has a handful of receptor types, which undercuts the diversity thesis. |
| 45-coral-reef-growth | 2 3 3 3 | CUT | Toy light-competition sim. Asserts intermediate-disturbance diversity without measuring diversity. |

**Series paragraph.** This is a catalogue, not a series. 43 classic complex-systems demos were generated in one day at about 500 words each. Each follows the same template: a hook, a named model, a sim with sliders, and a one-line moral ("No bird decides...", "Order from coupling."). The sims are mostly honest implementations of the standard rule. The problems are elsewhere:
- **Padding.** A third of the pages restate the same mechanism in a new costume. Laplacian growth appears four times (12, 22, 38, 41). Stigmergy appears five times (09, 14, 23, 26, 42). Predator-prey appears twice here, plus two more in other series.
- **Thin pages.** About ten pages are under 360 words with no argument at all (06, 11, 20, 21, 22, 23, 38, 40, 41).
- **Off-theme topics.** Sorting networks, wave interference, strange attractors and neural nets are not emergence.
- **Wrong or fabricated claims** are concentrated in the late, thin pages: 43, 44, 40, 22, and 37's tilted-sawtooth line.

The series also overlaps heavily with type-systems (boids, SIR, predator-prey, random walks, reaction-diffusion, GA, n-body), lattice-simulation (Life, LBM, Ising, NaSch, spatial LV) and atlas-of-atlases. The genuinely Distill-grade material is 08, 12, 13, 27, 28 and 34, with 35, 32 and 03 close behind.

**Recommendation:** rebuild as roughly 12 deeper essays organised by mechanism:
- threshold/percolation: 13 + 05
- SOC: 08
- Laplacian growth: 12 + 41
- stigmergy: 14 + 09/26/42
- excitable media and sync: 28, 27
- coarsening and opinion: 35 + 20
- frustration: 32 + 40
- pattern formation: 03 + 29
- polymers/walks: 34
- collective motion: 01 + 30
- CA: 02 + 11, plus 25

Tally: KEEP 6 (4.8k words), FIX 10 (5.9k), MERGE 11 (5.1k), CUT 16 (6.7k).
