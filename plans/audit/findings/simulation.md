# Findings: simulation track (emergence, lattice-simulation)

Before: emergence 43 articles, lattice-simulation 15. After: emergence 14, lattice-simulation 6.

emergence ends up at 14 essays, not the 12 we aimed for. Getting to 12 would have meant merging two strong KEEP pages that use different mechanisms (Kuramoto sync and excitable media), or cutting self-avoiding walks, which the reviewer ranked Distill-grade. I kept all three. The track also had to give traffic and spatial predator-prey a home, and the reviewer's grouping had no slot for either.

## 1. Cut, merged, renumbered

### emergence (old -> new)
| new | built from |
|---|---|
| 01-cellular-automata | 02-cellular-automata + 11-langtons-ant + 25-lenia (Game of Life removed; its home is lattice-simulation/03) |
| 02-flocking | 01-flocking + 30-swarm-robotics |
| 03-traffic-shockwaves | 04-traffic-shockwaves (IDM) + lattice-simulation/12-nagel-schreckenberg |
| 04-coarsening-and-consensus | 35-majority-rule + 20-opinion-dynamics |
| 05-spin-glass | 32-spin-glass (did not absorb 40: Ising lives in lattice-simulation/06) |
| 06-percolation | 13-fire-spread + 05-epidemic-spreading |
| 07-sandpile | 08-sandpile |
| 08-laplacian-growth | 12-diffusion-limited-aggregation + 41-river-networks |
| 09-self-avoiding-walks | 34-self-avoiding-walks |
| 10-stigmergy | 14-slime-mold + 09-ant-colony + 26-termite-mounds + 42-trail-systems |
| 11-predator-prey-in-space | 33-predator-prey-space + 07-predator-prey + the update rule of lattice-simulation/11 |
| 12-reaction-diffusion ("Two Ways to Make a Pattern") | 03-reaction-diffusion + 29-morphogenesis |
| 13-excitable-media | 28-belousov-zhabotinsky |
| 14-kuramoto-model | 27-kuramoto-model |

Cut: 06-schelling, 10-market-bubbles, 15-wave-interference, 16-genetic-algorithms, 17-strange-attractors, 18-random-walks, 19-vortex-streets (merged into lattice-simulation/05; nothing needed porting), 21-neural-networks, 22-crystal-growth, 23-collective-construction, 24-sorting-networks, 31-power-law-networks, 37-brownian-ratchet, 38-tumor-growth, 40-phase-transitions, 43-galaxy-formation, 44-immune-response, 45-coral-reef-growth.

I disagree with the reviewer on one verdict: 37-brownian-ratchet was marked FIX, and I cut it. It is a single-particle effect with no collective behaviour, so it is off-theme for a series organised by emergent mechanism. Its drift chart was also a heuristic "predicted" formula. See Salvage.

### lattice-simulation (old -> new)
| new | built from |
|---|---|
| 01-lattices-and-wallpaper-groups | 02-wallpaper-groups + 01-bravais-lattices |
| 02-symplectic-integrators | 04 + a Kepler figure built on the idea in plans/salvage/type-systems/07-n-body-symplectic (the salvage integrators were checked and are correct) |
| 03-life-and-symmetry-attractors | 06 |
| 04-hpp-vs-fhp | 07 |
| 05-lattice-boltzmann | 08 (+ emergence/19, nothing ported) |
| 06-ising-z2-breaking | 09 |

Cut: 03-periodic-boundaries, 05-symmetry-reduction, 10-graph-automorphisms, 11-spatial-lotka-volterra (its update rule now lives in emergence/11), 12-nagel-schreckenberg (merged into emergence/03), 13-spatial-hashing-vs-octrees, 14-gyroid-and-tpms, 15-equivariant-networks. None of 10-15 was worth keeping in this series.

Each model now has one home. Ising: lattice/06. Life: lattice/03. LBM and vortex streets: lattice/05. NaSch and IDM: emergence/03. Spatial Lotka-Volterra: emergence/11.

## 2. Errors confirmed and fixed (by page)

**emergence/01-cellular-automata.** The draft had wrong Lenia survival ranges, checked by rerunning the page's own Lenia code: at sigma = 0.015 the orbium survives at T = 5 and 10 from R >= 10, not R >= 13, and at sigma = 0.017 every run survives from R >= 8, T >= 5. The Langton's ant highway was computed from recorded moves: it repeats from move 9,977 with period 104, which matches the literature. The orbium pattern was an unfilled placeholder in the draft. The growth curve used stale mu/sigma after a slider moved. Removed: the Life figure, Wolfram class cards, Rule 110 trivia and the Lenia species gallery.

**emergence/02-flocking.** The decorative lateral-line wave is gone. The page now measures polarization phi against noise, with a live 16-level sweep that compares moving particles to frozen ones. The prose states the Gregoire-Chate (2004) discontinuous result and the finite-size caveat, and every number it gives comes from the running simulation.

**emergence/03-traffic-shockwaves.** The NaSch free-flow speed was checked: it is vmax - p, and the page now shows it live. The hysteresis/bistability claim is now stated as absent from basic NaSch (it needs slow-to-start variants). The "20 km/h constant" is replaced by a wave speed measured in the IDM sim (about -14 km/h at a = 0.8) and a derivation from the delay, plus the empirical 10-20 km/h range from Kerner and Rehborn (1996) and Treiber and Kesting (2013). The p = 0 "separated by vmax cells" wording was dropped. The worker was cut off before writing notes, so this entry comes from reading the finished page.

**emergence/04-coarsening-and-consensus.** Old 35 never coarsened. Its synchronous 9-cell vote freezes within 19-28 steps with domains about 3 cells wide, so its "sqrt(t)" and "one colour wins" claims were false. The main rule is now random-sequential, 4-neighbour, with coin-flip ties, and gives a measured exponent of 0.42-0.54. The old rule stays as a toggle, with the explanation of why it freezes. Stripes appear in 37-38% of runs, against the published 0.34 (Barros, Krapivsky and Redner 2009), and the lead now matches. The bias sweep is now a measured outcome chart. The Deffuant cluster count was measured: it tracks 1/(2 eps) for eps >= 0.1. The hardcoded "critical 0.25" marker is removed.

**emergence/05-spin-glass.** The "forest of minima" figure was a monotone staircase. It is now an exact enumeration of a 20-spin patch (stable states by energy against quench basin frequency, with a ferro/glass toggle). The lattice was not triangular: mirrored diagonal bonds drew long crossing edges, now fixed. Annealing never got cold (the slowest setting ended at T = 0.41). It now cools from 5 to 0.05, with measured success rates in the prose. The Figure 1 caption's bond colours were wrong. The NP-hardness claim now cites Barahona (1982).

**emergence/06-percolation.** New section: SIR with one infectious step maps onto bond percolation (Grassberger 1983), so T_c = 1/2 (Kesten 1980). New Figure 5 is a real SIR sweep. Mean final size at L = 250 is 0.003 at T = 0.46, 0.21 at 0.50 and 0.74 at 0.54.

**emergence/07-sandpile.** The spectrum figure was all filling transient (1,000 drops on an empty grid) and had no reference line. It now warms up first, then shows size per grain (flat, slope +0.01) and topplings per step (-1.62), with slope 0/-1/-2 guides. The prose cites Jensen, Christensen and Fogedby (1989) and Laurson, Alava and Zapperi (2005), and says neither signal is 1/f. The old tau fit measured tau - 1 (it read about 0.35). A density fit now gives 1.09, with the literature value of 1.2-1.3 and the finite-size drift explained. Beyond the review: the "identity" figure failed e + e = e and is now (6 - 6°)°, verified. A promised "red flash" never existed. Reaching criticality takes about 21,000 drops, not "a few thousand", so a skip button was added. Sonification and composition mode were removed.

**emergence/08-laplacian-growth.** The D readout used log N / log Rg and read about 2.0. It now fits the mass-radius slope and gives about 1.69. "Stickiness controls D" was wrong: it is a crossover to ordinary DLA. The heatmap and DBM solvers were not converged (24% total-variation error, now 0.2%). Clusters grew into the launch circle, which is now prevented. Old 41's erosion had no slope term and never reached steady state; it is replaced by a stream-power model dh/dt = U - K sqrt(A) S. Horton ratios are computed live for the river, the DLA cluster and the DBM discharge, and the prose cites Kirchner (1993) on why R_b of about 4 is weak evidence.

**emergence/09-self-avoiding-walks.** Flory's value is 3/5; the modern 3D estimate is 0.5876. The 2D exponent 3/4 is Nienhuis (1982), and SLE 8/3 gives it only conjecturally. The kinetic-growth range was measured at 0.635-0.65.

**emergence/10-stigmergy.** The page is built on one loop, deposit/decay/diffuse, with two ratios. The Tokyo claim now matches Tero et al. (2010): 36 cities, comparable cost, efficiency and fault tolerance, and a flow-conductance model rather than particles. The Jones model lacked the one-particle-per-cell rule, so the population collapsed into a band; it now forms networks. Termite pellets were not conserved. The "Helbing" code was not Helbing's model; it is rewritten to the 1997 equations. There is a new double-bridge figure (Deneubourg/Goss choice rule) with live 20-colony batches.

**emergence/11-predator-prey-in-space.** The old default K = 1 sits on the stable side of the Hopf threshold (about 1.14), and its spatial spread of prey decays from 4e-2 to 4e-7. The "waves", presets and refugia figure were flat fields made to look patterned by rescaling colours every frame. Colour scales are now fixed and the defaults are unstable. From lattice/11, all three reviewer claims were confirmed: extinction happens below lambda_c, not above (a live 24-point sweep shows extinction up to 0.175 and survival from 0.200, against a mean-field value of 0.111); site exclusion adds carrying capacity; and the DP diagram was a schematic, so it was not ported. The old "non-spatial LV predicts extinction" was wrong. Wa-Tor was dropped.

**emergence/12-reaction-diffusion.** The Figure 2 parameter map was fake: a heuristic boundary with hand-tuned colour bumps, under a caption claiming steady-state behaviour. It is now 280 real runs plus the exact saddle-node curve k = sqrt(f)/2 - f. Old prose had "V diffuses faster" (the code has U twice as fast) and the U/V roles reversed. The dead "Waves" preset was removed. New Figures 3 and 4 compare tissue scaling and noise robustness between Turing and gradient mechanisms.

**emergence/13-excitable-media.** The BZ slow variable is the oxidized catalyst, not bromide. The page's sheet is excitable, not oscillating. Credits are now precise: Zaikin and Zhabotinsky 1970, Winfree 1972.

**emergence/14-kuramoto-model.** The r(K) sweep matches sqrt(1 - Kc/K), and that theory curve was added. "Bimodal clusters never merge" is false: they merge by K of about 3. The starling line was removed, and Strogatz et al. (2005) is credited for the bridge.

**lattice/01-lattices-and-wallpaper-groups.** The tiler applied Cartesian rotation matrices to lattice coordinates, which are shears on the hex and rhombic lattices, so 7 groups were drawn wrong. The p3m1/p31m descriptions were swapped. It is rebuilt from International Tables generators, and a test confirms all 17 groups, 13 of them symmorphic. The builder classified the typed basis rather than the lattice; it now reduces the basis and finds the point group by search. "Eleven" point groups is now 10. The LBM D4/D6 claim is replaced by worked 4th-moment sums (HPP fails, FHP and D2Q9 pass). The poset figures, which carried their own errors, were removed.

**lattice/02-symplectic-integrators.** The shadow Hamiltonian correction H2 had its sign flipped; the fix tightens the energy band from 6.4e-3 to 4.8e-5. "Verlet wins above a few thousand steps" was false (on Kepler, RK4 is 3e-8 against Verlet's 1.3e-4 at 50k steps). Figure 2 said 64 points (the code has 32) and gave a wrong area claim; it now runs at h = 0.05, where the area is exactly 1.0025^n. The Noether slogan is replaced by a section on why angular momentum is conserved exactly and energy only approximately. The Takeaways list with "first-order symplectic" is gone.

**lattice/03-life-and-symmetry-attractors.** The Pulsar preset was a 16-cell pattern that died in 3 steps; it is now a real 48-cell pulsar that reads D4 in every phase. The "Clock" preset grew into a ship; it was relabelled, and a real clock was added. Blinker: D2, order 4, orbit 2. "Debris mostly C1" was replaced by a live census of 120 soups: about 75% of objects have a stabiliser of order 4 or more, while 119-120 of 120 whole boards have only the identity. The stabiliser theorem was correct as stated.

**lattice/04-hpp-vs-fhp.** The drag probe was replaced by shear-wave decay on periodic lattices. HPP at 0 degrees never decays (column momentum is conserved); FHP gives equal rates at 0 and 30 degrees, matching nu = 1/(12 d (1-d)^3) - 1/8. The fabricated FHP quote and the Los Alamos anecdote were removed (no primary source found). HPP "mass (4)" is now 2, Figure 1 is 4x4 (not 16x16), and the FHP three-body rationale is corrected.

**lattice/05-lattice-boltzmann** (lead):
- **Not in the review:** the collision step used y-mirrored equilibria for the four diagonal channels. The sim went NaN within about 500 steps, so the page showed a black canvas and no Karman street. Fixed.
- **Not in the review:** the Strouhal, frequency and steps/sec readouts never updated at speed 1 (they fired on steps % 30 at frame boundaries). They now run on a frame counter.
- The caption claimed FFT, but the code counted zero crossings over 1,024 steps (St quantised to 0.13/0.27). It now uses interpolated upward crossings over 8,192 steps: St is about 0.18-0.23 at Re = 120.
- The caption said slip walls; the code has bounce-back (no-slip). Caption fixed.
- Pitchfork is now Hopf, with the reflection-plus-half-period space-time symmetry. epsilon is now the Knudsen number. The tau clamp is stated, along with its Re cap (about 99 at U = 0.03).
- "Drag crises" was removed and the Takeaways list dropped.

**lattice/06-ising-z2-breaking** (lead):
- "10x10 at T = 1.5 flips every few hundred sweeps" is false. My Metropolis runs gave about 1,400 sweeps per reversal at T = 2.2, about 25,000 at 2.0, and none in 200,000 at 1.5. The prose now uses these numbers.
- The SSB limits paragraph reversed its own order of limits. Rewritten.
- Cu-Zn is 3D Ising; it is replaced by K2CoF4 and Rb2CoF4.
- The Act IV/V framing and the Takeaways list were removed.

## 3. Errors rejected
- Old 35's "measured coarsening exponent", which the reviewer praised: the code could not produce one. The rule is replaced, and a real exponent is measured now.
- No other flagged error was rejected. The lattice/06 stabiliser theorem was flagged only for checking and was correct.

## 4. Figures made honest or removed
Made honest:
- emergence/04: coarsening rule, bias sweep, Deffuant count
- emergence/05: minima enumeration, annealing
- emergence/07: spectrum, tau fit, identity
- emergence/08: D fit, solvers, river model, Horton ratios
- emergence/11: fixed colour scales, lattice LV sweep
- emergence/12: parameter map
- emergence/10: Jones model, Helbing, termites
- lattice/01: tiler, builder
- lattice/02: area figure
- lattice/04: shear-wave probe
- lattice/05: LBM collision, Strouhal readout

Removed:
- emergence/01: Life figure and Lenia species gallery
- emergence/02: lateral-line wave
- emergence/07: sonification and composition mode
- emergence/11: refugia figure and Wa-Tor
- emergence/12: "painting" figure and 29's three figures
- lattice/01: poset figures
- plans/salvage/type-systems/04: the RPS salvage panel was not used. Its "fair" rule has no empty sites, so the "stable spirals" caption is doubtful.

## 5. Unresolved (needs a human)
- lattice/05: the measured Strouhal number drifts down over tens of thousands of steps (about 0.23 to 0.18). Possible causes are density drift from the inlet/outlet boundary conditions or D/H = 0.24 confinement.
- lattice/04: the FHP-I viscosity formula was not independently sourced. The sims match it within about 10%.
- emergence/10: two claims are from memory and unchecked: Goss 1989 late-opening colonies, and Helbing's campus-photo comparison. The termite "cement pheromone" hedge has no citation.
- emergence/11: that a drawn barrier spawns spirals is not confirmed, so the claim was softened.
- emergence/01: the orbium pattern was not checked against Chan's catalogue (it does glide). Figure 4 takes 15-25 s to fill.
- emergence/12: Figure 2 takes about 5 s of chunked main-thread compute.
- emergence/13: the units of the "Hz" readout are unchecked.
- emergence/03 and 02: those workers were cut off before writing notes. I verified render and interaction; a closer read of the numbers in the prose would help.

## 6. Salvage (not homed here)
- git HEAD:docs/emergence/24-sorting-networks.html: correct (known optima 0, 1, 3, 5, 9, 12). Home: algorithms-ml.
- git HEAD:docs/emergence/37-brownian-ratchet.html: a real overdamped Langevin ratchet, but its drift chart is a heuristic and it has a tilted-sawtooth error. It would need a measured drift before any reuse.
- git HEAD:docs/lattice-simulation/13-spatial-hashing-vs-octrees.html: a real hash grid and quadtree with examined-count figures. Home: sph neighbour search.
- git HEAD:docs/emergence/29-morphogenesis.html Figures 2 and 3: a correct 2D diffusion-degradation field and a two-morphogen fate map. Home: a future developmental-biology page.
- git HEAD:docs/emergence/12-diffusion-limited-aggregation.html: the multi-seed competing-cluster figure.
- 42-trail-systems click-to-add-destination; the old 14 MST overlay, which could become an honest Tero-style flow-conductance figure; and the 26 pillar sim, only if rebuilt on Bonabeau et al. 1998.
- 20-opinion-dynamics small-world figure: only once its rewiring claim is measured.
- git HEAD:docs/emergence/18-random-walks.html (Polya 34%) and 31-power-law-networks: correct but generic. Candidates for a networks or probability series if one exists.

## 7. Inbound links from other series
- docs/index.html:189 links emergence/01-flocking.html, which is now emergence/02-flocking.html.
- No other file outside these two series links into renamed or deleted pages. Checked with a grep of all of docs/.

## 8. Homepage entries
- **Emergence**: count 14. desc: "Fourteen essays grouped by mechanism: local copying, thresholds, self-organized criticality, growth at the tips, stigmergy, and coupled oscillators and chemistry, each with simulations that compute the claim." tags: complex systems, simulation, criticality, pattern formation.
- **Simulating on a Lattice**: count 6. desc: "What a grid and a time step keep of continuum symmetry: wallpaper groups, symplectic integrators, Life, HPP vs FHP, lattice Boltzmann and the Ising model." tags: lattices, symmetry, numerical methods, fluids.
