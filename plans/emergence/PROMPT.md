# Emergence: Simple Rules, Complex Worlds

I want fourteen essays on systems where large-scale behavior comes from simple local rules, for a curious reader with a little calculus. The essays are grouped by mechanism instead of subject: local copying and alignment, frustrated couplings, a density threshold, a slowly driven system that relaxes in bursts, growth fed by a field that piles up at the tips, agents that write into their surroundings and read it back, and oscillators or chemicals coupled across space.

Every claim about collective behavior should be backed by a simulation on the page that computes it. By the end a reader can push each model across its interesting boundary and watch the measured quantity move the way the prose says. Leave Ising, Life and lattice Boltzmann to a companion series on lattice simulation.

## Articles

### 1. Cellular Automata
How much structure a rule that sees only its neighbors can build, and what survives when the grid goes continuous. The reader edits an elementary rule table, watches Langton's ant build its highway, and sweeps Lenia's resolution to see where the orbium glider survives.

### 2. Flocking
Alignment against noise decides whether a crowd moves as one. The reader sweeps noise in the Vicsek model against a live polarization trace, and frozen particles at the same density show the order needs the motion.

### 3. Traffic Shockwaves
Phantom jams in a car-following model (the Intelligent Driver Model) and in the Nagel-Schreckenberg automaton share a wave that travels backward. The reader brakes one car on a ring road and watches the jam in a space-time diagram.

### 4. Coarsening and Consensus
Copy your local majority and domains grow roughly as the square root of time, until one opinion wins or the borders lock into stripes. Listen only to people who nearly agree and the population splits into a predictable number of camps; the reader measures the coarsening exponent and the camp count live.

### 5. Spin Glass
When couplings conflict, the energy landscape fills with valleys that trap a quench or a hurried anneal. The reader runs anneals of different speeds and explores an exact enumeration of every valley in a small patch.

### 6. Percolation
Forest fires and epidemics share a threshold below which clusters stay finite. The reader lights forests at different densities, runs an SIR epidemic that maps onto bond percolation, and lets trees regrow.

### 7. Sandpile
Drop grains one at a time and the pile tunes itself to a critical state with avalanches of every size. The reader fits the avalanche exponent, sees the sandpile group's identity element, and tests the claim that the pile makes 1/f noise.

### 8. Laplacian Growth
Diffusion-limited aggregation, dielectric breakdown and river networks are growth driven by a field that concentrates at the tips. The reader grows a cluster with a live fractal-dimension fit and compares branching statistics across cluster, discharge and a simulated river basin.

### 9. Self-Avoiding Walks
A walk that cannot cross itself spreads faster than diffusion, with an exponent that models polymers. The reader fits end-to-end distance against length for both kinds of walk and watches a growing walk trap itself.

### 10. Stigmergy
Slime mold, ant trails, lawn footpaths and termite pellets share one loop: write into a shared field, let it fade and spread, steer toward the strongest. Signature figures are a particle model of Physarum building networks and the double-bridge experiment run as live batches of colonies.

### 11. Predator-Prey in Space
The well-mixed Lotka-Volterra cycle is a knife-edge; space keeps the local boom and bust but stops the whole population swinging. The reader draws barriers across a spatial field and sweeps predation rate on a stochastic lattice to find where predators die out.

### 12. Two Ways to Make a Pattern
Turing's reaction-diffusion sets its own wavelength, while positional gradients can scale with the tissue. The reader explores a Gray-Scott parameter map built from real runs, then grows the tissue and adds noise to watch the two mechanisms come apart.

### 13. Excitable Media
One pair of equations gives the spiral waves of a chemical dish and of a failing heart. The reader launches waves in a BZ dish and in cardiac tissue, then breaks a wavefront into a spiral and tries to clear it.

### 14. The Kuramoto Model
Oscillators with scattered frequencies lock together once coupling passes a critical value. The reader raises coupling and watches the measured order parameter track theory, then changes the frequency distribution.

## What to get right

- Every number in the prose comes from the running simulation or a cited paper, and figures compute what their captions say. An earlier draft faked parameter maps and rescaled colours each frame to invent patterns; run sweeps for real and keep colour scales fixed.
- Pick update rules that can do what the claim needs. A synchronous majority vote freezes and never coarsens; random-sequential updates do. Predator-prey defaults must sit past the Hopf threshold or the waves decay to a flat field.
- Easy claims to get wrong: percolation thresholds depend on the lattice (the exponents are universal); the sandpile's signals are not 1/f; reduced stickiness in DLA is a crossover to ordinary DLA; the BZ slow variable is the oxidized catalyst; zebrafish stripes come from pigment cells, so use the angelfish for Turing; bimodal Kuramoto clusters do merge eventually.
- Cite the primary source for each headline result and give finite-size caveats where a measurement differs from the literature.
- Keep a shared five-colour vocabulary (agent, local rule, emergent pattern, threshold, feedback) and use it consistently.
