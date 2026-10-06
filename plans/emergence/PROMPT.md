# Emergence: Simple Rules, Complex Worlds

I want fourteen essays on systems where large-scale behavior comes from simple local rules, for a curious reader with a little calculus. The essays are grouped by mechanism instead of subject: local copying and alignment, frustrated couplings, a density threshold, a slowly driven system that relaxes in bursts, growth fed by a field that piles up at the tips, agents that write into their surroundings and read it back, and oscillators or chemicals coupled across space.

Every claim about collective behavior should be backed by a simulation on the page that computes it. By the end a reader can push each model across its interesting boundary and watch the measured quantity move the way the prose says. Leave Ising, Life and lattice Boltzmann to a companion series on lattice simulation.

## Articles

### 1. Cellular Automata
How much structure a rule that sees only its neighbors can build, and what survives when the grid goes continuous. The reader edits an elementary rule table, measures how far one flipped cell spreads across all 256 rules (Langton's lambda against damage spread), sends Langton's ant into random obstacles to time its highway, and sweeps Lenia's resolution to see where the orbium glider survives.

### 2. Flocking
Alignment against noise decides whether a crowd moves as one. The reader sweeps noise in the Vicsek model against a live polarization trace, watches travelling bands make the transition sharp, sees frozen particles fail to pass headings across a broken contact network, and tests neighbors within a radius against the nearest seven under a predator.

### 3. Traffic Shockwaves
Phantom jams in a car-following model (the Intelligent Driver Model) and in the Nagel-Schreckenberg automaton share a wave that travels backward. The reader reproduces Sugiyama's 22-car ring road, measures the backward jam speed against density and dawdle probability, sees it as the slope of the fundamental diagram's congested branch, and runs a slow-to-start rule to see hysteresis.

### 4. Coarsening and Consensus
Copy your local majority and domains grow roughly as the square root of time, until one opinion wins or the borders lock into stripes. Listen only to people who nearly agree and the population splits into a predictable number of camps. The reader measures the coarsening exponent and its scaling collapse, sees conserved swaps slow growth toward t^(1/3) and the voter model's 1/log t, and compares camp counts under pairwise (Deffuant) and group (Hegselmann-Krause) averaging.

### 5. Spin Glass
When couplings conflict, the energy landscape fills with valleys that trap a quench or a hurried anneal. The reader counts what frustration costs by exact enumeration, runs anneals of different speeds, explores every valley of a small patch, watches a large lattice age, and compares searches and overlap distributions P(q) in the Sherrington-Kirkpatrick model against Parisi's solution.

### 6. Percolation
Forest fires and epidemics share a threshold below which clusters stay finite. The reader locates the threshold by finite-size scaling, measures the critical cluster's 91/48 dimension, sees thresholds differ across lattices while exponents agree, runs an SIR epidemic that maps onto bond percolation, and lets trees regrow (a regrowing Drossel-Schwabl forest settles near density 0.4, well below the site threshold, so it does not self-tune to p_c).

### 7. Sandpile
Drop grains one at a time and the pile tunes itself to a critical state with avalanches of every size. The reader topples a pile in two orders to see it end the same, collapses avalanche sizes across grid sizes against the stochastic Manna rule, burns piles to test recurrence and finds the group identity, grows the fractal from grains dropped at one point, and tests the claim that the pile makes 1/f noise.

### 8. Laplacian Growth
Diffusion-limited aggregation, dielectric breakdown and river networks are growth driven by a field that concentrates at the tips. The reader grows a cluster with a live fractal-dimension fit, fires walkers at a frozen DLA cluster and an Eden blob to see where they land (harmonic measure), measures how stickiness and the breakdown exponent eta set the dimension, and tests a simulated river basin against a DLA tree with Hack's law and drainage-area distributions.

### 9. Self-Avoiding Walks
A walk that cannot cross itself spreads faster than diffusion, with an exponent that models polymers. The reader counts every walk to 20 steps and extrapolates the growth rate toward the connective constant, steps through pivot moves accepted and rejected, fits end-to-end distance against length for pivot-sampled SAWs and random walks, collapses the end-distance distribution, and watches a growing walk trap itself (about 71 steps on average). Rosenbluth weights show why grown walks, weighted or not, cannot stand in for SAWs at length.

### 10. Stigmergy
Slime mold, ant trails, lawn footpaths and termite pellets share one loop: write into a shared field, let it fade and spread, steer toward the strongest. Signature figures are a particle model of Physarum, Tero's flow-reinforced tubes solving mazes, the double-bridge experiment run as live batches of colonies with symmetry breaking against the choice exponent, and evaporation and pheromone-lifetime sweeps that test deposit-over-decay against the response threshold.

### 11. Predator-Prey in Space
The well-mixed Lotka-Volterra cycle is a knife-edge; space keeps the local boom and bust but stops the whole population swinging. The reader sees the paradox of enrichment as a bifurcation diagram, draws barriers across a spatial field, watches the grid mean's swing shrink as the landscape grows while one cell keeps swinging, follows an invasion front that leaves chaos in its wake, and finds the lattice extinction threshold from directed-percolation decay.

### 12. Two Ways to Make a Pattern
Turing's reaction-diffusion sets its own wavelength, while positional gradients can scale with the tissue. The reader explores a Gray-Scott parameter map built from real runs, derives the Turing band from the Jacobian and measures it mode by mode on a ring, checks the 2D spacing across box sizes, then grows the tissue (peaks split as it grows) and adds noise to watch the two mechanisms come apart. At Gray-Scott's usual diffusion ratio of 2 the Turing band is almost empty, so say the 2D patterns grow from seeds, and run the size and noise comparison at a ratio where the flat state is genuinely unstable.

### 13. Excitable Media
One pair of equations models the traveling and spiral waves of the Belousov-Zhabotinsky reaction and of heart muscle. The reader launches waves in a BZ dish, paces a cardiac cable into 2:1 block with measured restitution of duration and speed, circulates a pulse on a shrinking ring until it dies, then finds the S1-S2 window that breaks a wavefront into a spiral and tries to clear it. Show the model's equations, and pace the tissue no faster than it recovers.

### 14. The Kuramoto Model
Oscillators with scattered frequencies lock together once coupling passes a critical value. The reader raises coupling and sees which oscillators lock (the plateau of width 2Kr), watches the measured order parameter track theory and sharpen with N, sets the full model beside the one-line Ott-Antonsen equation, then changes the frequency distribution to find the uniform one's jump.

## What to get right

- Every number in the prose comes from the running simulation or a cited paper, and figures compute what their captions say. An earlier draft faked parameter maps and rescaled colours each frame to invent patterns; run sweeps for real and keep colour scales fixed.
- Pick update rules that can do what the claim needs. A synchronous majority vote freezes and never coarsens; random-sequential updates do. Predator-prey defaults must sit past the Hopf threshold or the waves decay to a flat field.
- Easy claims to get wrong: percolation thresholds depend on the lattice (the exponents are universal); the sandpile's signals are not 1/f; reduced stickiness in DLA is a crossover to ordinary DLA; the BZ slow variable is the oxidized catalyst; zebrafish stripes come from pigment cells, so use the angelfish for Turing; bimodal Kuramoto clusters do merge eventually. BTW avalanche exponents drift with grid size and differ from the stochastic Manna rule's; an IDM ring tuned to Sugiyama's jam speed holds a longer jam than the experiment did, so say so.
- Cite the primary source for each headline result and give finite-size caveats where a measurement differs from the literature.
- Keep a shared five-colour vocabulary (agent, local rule, emergent pattern, threshold, feedback) and use it consistently.
