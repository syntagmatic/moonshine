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
# Simulation group: sph and lithium-ion

## sph (4 articles + index, 2026-04-13, 2,611 words)

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-particles-and-forces | 3 4 3 3 | KEEP (minor fixes) | Textbook Muller-2003 SPH, correctly staged (kernel, density sum, symmetric pressure, Laplacian viscosity, integrator comparison). Figures compute for real: a Stam stable-fluids grid solver, real boids, kernel/density sums from dragged particles, and an O(n^2) SPH loop. Bugs: prose says the kernel is "normalized so it integrates to 1" but the code and equation use unnormalized (1-q)^3. Gravity goes into the force and is then divided by density, so heavier regions fall slower. The boids detour duplicates emergence/01. |
| 02-gpu | 3 4 3 2 | FIX | The WebGPU path is real: WGSL compute passes (clear grid, atomic insert, density, force+integrate) with a CPU fallback. forceAndIntegrate writes pos[] in place while other threads read it, which is a data race. Fig 3 "CPU vs GPU" is setTimeout theater (200 ms ticks) and teaches nothing. The spatial-hash content duplicates lattice-simulation/13. |
| 03-beyond-water | 2 3 3 3 | FIX or MERGE -> 01 | Springs, "friction", temperature, SDF and emitters are each a small real sim, but the physics is hand-waved. The "friction" is tangential velocity damping (it cannot hold a static angle of repose), and the phase model is an ad hoc k(T) that the prose admits is intuition only. Ends in a toolbox listicle summary. |
| 04-playground | 1 3 2 1 | CUT (or fold the sandbox into 03) | 194 words wrapped around a sandbox. The sand material in the code has no inter-particle friction, only floor damping, so it does not match what 03 claims. A capstone with no ideas. |
| index | - | - | The "Vocabulary" color-legend section is filler. The card for 02 promises "tens of thousands of particles". |

The series gives a competent, correct-in-outline tutorial on how to build an SPH toy, and the core sims are real, not faked. It does not reach a Distill bar, though. It never asks a non-obvious question: why the kernel gradient choice matters, why the symmetric pressure form conserves momentum, what weak compressibility costs you, or why tensile instability happens. It stays at "here is the loop". 02 is mostly a generic spatial-hash and GPU-parallelism lesson that lattice-simulation/13 already covers. 03 and 04 are material-toolbox demos. Keep 01, fold 03's best figure (springs or SDF) into it or into a tightened 02, and cut 04. One or two strong articles could come out of this. Overall 5/10, TRIM. Cut about 25% of articles and 7% of words, or about 50% of articles and 40% of words if 03 is merged.

## lithium-ion (7 articles + index, 2026-04-19, 8,417 words)

Why the metrics show figs=0: figures are `<div class="figure">`, not `<figure>`, and they are drawn by D3 into SVG/canvas. The index cards are also JS-built. Shared model code is in docs/lithium-ion/lib/battery-math.js (692 lines).

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01-cell-in-hand | 3 3 2 3 | FIX / MERGE -> 02 | Consumer primer: form factors, OCV, CCCV, flashlight drivers. Factual slips: most flashlight 26650s are NMC/IMR, not LFP. Powerwall 1/2 were NMC cylindrical, not "prismatic LFP pouch". "CV tail lengthens proportionally" is overstated. The CV taper is a hand-shaped exponential. Slop: "quiet infrastructure of modern life", a Takeaways list. |
| 02-packs | 3 3 2 3 | FIX / MERGE with 01+03 | nSpP arithmetic and weakest-cell logic are correct and useful. Drift is seeded noise. Thermal runaway is a 12x10 heat-diffusion CA whose ignited cells release heat forever (no energy budget). The captions read like a dashboard ("Watch for", status-bar verdicts "chain stopped / partial / full runaway"). 13 em dashes, Takeaways list. |
| 03-bms | 3 2 2 3 | FIX / MERGE with 01+02 | Prose invokes the EKF, but the "blended" estimator is a heuristic dV/dx-weighted average. The caption's "seeded 3% integrator bias" is actually a constant initial offset with zero-mean noise, so coulomb counting does not drift as claimed. Balancing uses fixed per-minute rates. The safe envelope is a lookup table. "SCALE: EV" badges and a status bar that "names the winner" are KPI-style. |
| 04-voltage-at-rest | 4 3 4 4 | KEEP | The best piece. Staging, then common tangent, then plateaus, then dV/dx as SOC observability is a real, non-obvious argument that ties thermodynamics to BMS software. Weaknesses: OCV curves are tanh fits (fine), and the staging figure uses hard-coded x thresholds, not a lattice-gas, although the lib comment claims one. |
| 05-voltage-under-load | 4 4 3 4 | KEEP (minor) | Butler-Volmer inverted by Newton, a limiting-current ln(1-i/ilim) term, and a quasi-steady parabolic particle profile. The ternary "regime triangle" is a genuinely good figure. Wrong line: "The additive form is not an approximation." |
| 06-aging-and-failure | 4 4 3 3 | KEEP (minor) | SEI parabolic growth with Arrhenius, and the Arrhenius numbers check out (50 kJ/mol gives about 1.9x per 10 C). The calendar vs cycle split is empirical but honest. Dendrites use real DLA, which overlaps emergence/12-diffusion-limited-aggregation. "A feature, not a bug" is slop. |
| 07-impedance-spectroscopy | 4 4 3 4 | KEEP (minor fix) | Real complex impedance with a CPE, computed across 8 decades. Mismatch: the code puts Warburg in series after the Rct||CPE block, not in the Rct branch as a Randles circuit does, so the stated tail intercept Rs+Rct-2*sigma^2*Cdl does not hold for the plotted curve. Aging uses empirical scalings. "A production BMS running a handful of impedance sweeps per hour" overclaims, since onboard EIS is rare. Ends on "the cell's diary". Cross-refs cite "Part 2" for Rs wiring, which is a stretch. |
| index | - | - | 117 words, "an everyday miracle of chemistry and engineering". The nav links out to Information Geometry and Exceptional Atlas, which looks like a stray breadcrumb. |

The series splits in two. Parts 4-7 (electrochemistry: OCV thermodynamics, loss stack, aging, EIS) are substantive, mostly correct, and backed by real models in a shared library. They come close to the bar and cohere as an arc. Parts 1-3 (cell, pack, BMS) are consumer and engineering overviews with factual slips, toy or heuristic sims that the prose oversells (the EKF, the "bias"), and dashboard-flavored captions and status bars. Restructure: merge 01-03 into one tight "from cell to pack to BMS" article, or cut them, and lead with 04. Scrub em dashes (8-14 per page in 01-03 and 05-06), Takeaways lists, and "Watch for" caption scripts. Overall 6/10, RESTRUCTURE. Cut about 29% of articles and about 25% of words (merge 3 into 1), or 43% and 43% if 01-03 are cut outright.

## Overlaps outside this pair
- sph/02 spatial hashing and lattice-simulation/13-spatial-hashing-vs-octrees: same topic.
- sph/01 boids figure and emergence/01-flocking.
- lithium-ion/06 DLA dendrites and emergence/12-diffusion-limited-aggregation.
- lithium-ion/04 first-order transitions and common tangent may overlap emergence/40-phase-transitions and lattice-simulation/09-ising (not checked).
# lattice-simulation (15 articles + index, all added 2026-04-19, ~32.4k words)

Code checked (<=120-line windows): 04 (integrators), 07 (HPP/FHP), 08 (LBM), 09 (Ising), 11 (SLLVM + DP figure), 12 (NaSch), 14 (volume fraction), 05/15 (figure data sources), 13 (hash/quadtree builders).

Metric notes: em-dash counts (06:12, 08:14, 13:12, 10:10) are almost all "—" placeholder glyphs in readouts, not prose. The prose is nearly em-dash-free except the index. figs=0 on 13 (and 03) is a metric artifact: figures are JS-built divs/canvases, not missing.

| article | S F C Fit | verdict | reason |
|---|---|---|---|
| 01 Bravais lattices | 3 3 3 3 | MERGE -> 02 | Correct basics, but it claims LBM "works on a D6 lattice and fails on a D4 one", which 07/08 contradict (D2Q9 is square and isotropic). The lattice builder is real; the poset hover is decoration. |
| 02 Wallpaper groups | 2 4 3 3 | FIX (absorb 01) | Real orbit tiler and guess-the-group quiz. Errors: "eleven" 2D point groups (there are 10); "without glides the count would be eleven" (13 are symmorphic); garbled claims about glides and joins in the poset. |
| 03 Periodic boundaries | 3 3 3 2 | CUT | Correct but textbook (quotient torus, Weyl, minimum image). The figures are real but elementary. Nothing non-obvious here. |
| 04 Symplectic integrators | 4 5 4 4 | KEEP | The best piece. Euler, RK4 and Verlet are real step functions on the pendulum, HO and quartic. The Euler-vs-Verlet area of a 32-point square is computed. Minor slips: takeaway says "first-order symplectic"; the "iff symplectic" Noether slogan overclaims. |
| 05 Symmetry reduction | 2 2 2 1 | CUT | Off-theme quantum chemistry. "|atoms|/|G| independent atoms" is wrong for atoms on symmetry elements, and the benzene arithmetic is garbled ("½ atom, round up"). Fig 1 reports |G|=12 for D6h (order 24). The Hessian figure is "randomly filled" cartoon blocks, and poset asymDim is just 36/|G|. |
| 06 Life & symmetry attractors | 2 4 3 2 | FIX | Real Life plus a real D4 stabiliser detector, and the equivariance/monotone-stabiliser argument is a good idea. But the facts are wrong: pulsar "C4 at some phases" (D4 always, and that would contradict its own theorem); blinker "still-frame D1, orbit size 4" (D2, orbit 2); "debris mostly C1 still-lifes" (block, beehive and ship are symmetric). Life also overlaps emergence/02. |
| 07 HPP vs FHP | 4 3 3 5 | FIX | Heart of the series: the rank-4 tensor argument is correct (HPP 2δδδ term, FHP A=B=3/4, D4 has 2 invariants and D6 has 1). The HPP/FHP automata are genuine, with correct collision tables and hex streaming. But the "drag anisotropy" probe mostly measures how a seeded stream is split onto the discrete velocity set, not hydrodynamic anisotropy, and the left boundary is sticky. The Frisch/Hasslacher/Pomeau quote "We finally understood..." and the "conversation at Los Alamos" anecdote look fabricated. |
| 08 Lattice Boltzmann | 3 5 3 3 | KEEP (minor fixes) | Real D2Q9 BGK: correct feq, halfway bounce-back, equilibrium inlet, zero-gradient outlet, FFT Strouhal probe. Errors: calls the Re~47 onset a pitchfork (it is a Hopf bifurcation); "ε = 1/τ" as the Chapman-Enskog parameter; τ is silently clamped at 0.52, capping Re below the slider max. Overlaps emergence/19 vortex streets. |
| 09 Ising Z2 breaking | 3 5 3 2 | KEEP (dedupe) | Real Metropolis (ΔE table) and Wolff (pAdd = 1-e^{-2/T}). The |M|(T) sweep is computed live and overlaid with the correct Onsager curve. Prose is accurate but textbook. Should be the gallery's single Ising piece; emergence/32 and 40 overlap. |
| 10 Graph automorphisms | 2 3 3 1 | CUT | Off-theme networked control. |Aut| of the 4×K6 ring is given as 2·120^4 (the dihedral factor is 8). Says "coarser" where it means "finer" about orbits vs equitable partitions. The brute-force Aut and Jacobi Fiedler figures are real but serve a thin point. |
| 11 Spatial Lotka-Volterra | 1 2 3 1 | CUT (or MERGE -> emergence/33 after rewrite) | The core claim is backwards: in the stochastic lattice LV model, predators go extinct below λc, not above. Fig 2's DP phase diagram is a hardcoded schematic (λc=1.0 arbitrary, direction reversed). Calling the lattice rules "exactly the same" as the ODE is false (site exclusion adds carrying capacity). The lattice sim itself is a legit random-sequential update. Overlaps emergence/07 and 33. |
| 12 Nagel-Schreckenberg | 2 4 3 1 | MERGE -> emergence/04 | Real NaSch update (accelerate, brake to gap, randomise, advance), space-time diagram and computed FD. Errors: free-flow ⟨v⟩ = vmax - p/(1-p) (it is vmax - p); claims hysteresis/bistability in standard NaSch (that needs slow-to-start variants); says the p=0 jammed state has cars "separated by vmax empty cells". |
| 13 Spatial hashing vs octrees | 3 4 2 2 | MERGE -> sph (neighbour search) | Real hash grid and quadtree, with examined-count figures. But the content is generic CS with an aspect table and pseudo-math dressing ("2-adic lattice"). Overlaps sph 01/02 neighbour grids. |
| 14 Gyroid & TPMS | 1 3 2 2 | CUT | The prose says sheet volume fraction φ ≈ 0.5 at t=0, but its own figure computes |f|<t, which gives 0. Calls Ia-3d chiral with no mirror planes (it is centrosymmetric, with glides). "Catenoid array" as a doubly periodic minimal surface. Engineering claims are unsourced, in a numbered "four properties" listicle. Off-theme; possible overlap with the foam series. |
| 15 Equivariant networks | 3 2 1 2 | CUT (or MERGE -> algorithms-ml) | Standard G-CNN material. Fig 2 learning curves are hardcoded exponentials (admitted "illustrative"). The Fig 3 poset is hover decoration. Wrong claims: "receptive field quadrupled for free"; spherical CNNs "replaced planar convolutions in operational weather systems"; gauge equivariance gives "charge conservation" via Noether. The finale is a grand summary ("That is the whole game"). |
| index | - | FIX | Advertises "fifteen explainers", including a boid swarm that isn't in the series. Grand "two pillars" framing, one prose em dash. |

**Series paragraph.** This is the most technically ambitious series in the group, and several simulations are genuinely correct. Verlet/RK4/Euler, HPP and FHP Boolean automata, D2Q9 BGK with bounce-back, Metropolis+Wolff with a live Onsager comparison, and NaSch are all real update rules, not visual imitations. The exceptions are hardcoded schematics (11 DP diagram, 15 learning curves, 05 Hessian). The trouble is the "lattice + group" frame. It stretches past its natural core (04, 06, 07, 08, 09, plus a Bravais/wallpaper opener) into quantum chemistry (05), network control (10), ecology (11), traffic (12), data structures (13), additive manufacturing (14) and ML (15). Those are the weakest pages, and they carry the most factual errors. Several are backwards or self-contradicting: the SLLVM extinction direction, the gyroid volume fraction contradicted by its own figure, the NaSch free-flow speed, the Life stabilisers. There is a probably fabricated FHP quote. 01/02 claim LBM fails on square lattices, which 07/08 then correctly refute. Reduced to six parts (02+01, 04, 06, 07, 08, 09), with the errors fixed, it would be a tight, distinctive series on "symmetry survives discretisation". Cut: 6 articles, and merge out 3 more (~60% of articles, ~58% of words).
