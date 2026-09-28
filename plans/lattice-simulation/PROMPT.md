# Simulating on a Lattice

I want six essays on what a grid and a time step keep of continuum symmetry, and what goes wrong when they don't. Continuous physics is symmetric under every rotation and conserves energy exactly; a grid has only a handful of rotations and a time step has no reason to conserve anything. Each essay asks which symmetry survives the discretisation. It is for readers who know some mechanics and linear algebra and want to know why some lattice methods work and others quietly fail.

At the end a reader should be able to look at a lattice and a stencil and say which symmetries it can represent, pick an integrator for a long run and know what its energy error will do, and explain why fluid simulators moved from squares to hexagons and then back to squares with the right weights. Lattice models studied for their collective behavior belong to a companion series on emergence.

## Articles

### Act I: Discretising space and time

### 1. Lattices and Wallpaper Groups
The plane has five kinds of lattice and seventeen kinds of periodic pattern, and the point group at a lattice site limits what a simulation built on that lattice can get right. A search over lattice shapes shows that only rotation orders 1, 2, 3, 4 and 6 fit a lattice. The reader drags two basis vectors and watches the lattice snap between the five Bravais types, places the seventeen groups by their computed lattice and point group, tiles one motif under each, and names groups in a short quiz. The article ends on why square and hexagonal lattices are the ones simulations use: polar plots of stencil moments by rank, and a wave spreading on each grid, show how much closer the hexagon comes to a circle.

### 2. Symplectic Integrators
A Hamiltonian flow preserves phase-space area; an integrator that preserves it too keeps its energy error bounded, and one that doesn't lets the error grow. The reader runs Euler, RK4 and velocity Verlet on a pendulum and watches Euler's orbit spiral out while Verlet's closes, maps each method's one-step area change across the phase plane, watches a small square of initial conditions inflate or keep its area, and checks the shadow Hamiltonian's band against step size. Running each method forward and back separates symplectic from reversible. A Kepler orbit shows Verlet conserving angular momentum exactly and energy only up to a shadow Hamiltonian, while the orbit slowly precesses because the Runge-Lenz symmetry is lost.

### Act II: Rules on the grid

### 3. Life and Symmetry Attractors
Conway's rule commutes with the eight symmetries of the square, so a pattern's symmetry group can grow over time but never shrink. The reader toggles neighbours in a stencil to see which symmetries a rule commutes with, runs soups while an exact detector (up to translation on the torus) reports the board's stabiliser each generation, and sees oscillators and spaceships whose symmetry lives across phases rather than in one. Symmetric soups are followed across the subgroup lattice, where Life's arrows only point up, and a census of many soups shows that most debris objects are highly symmetric while whole boards almost never are.

### 4. HPP vs FHP: Why Hexagons
A lattice gas on a square grid transports momentum anisotropically, while the same idea on hexagons gives isotropic Navier-Stokes, and the reason is a rank-4 tensor that the square velocity set cannot make isotropic. The reader rotates the fourth-moment tensor of each velocity set, reads a census of which regular polygons are isotropic at which rank, catches a spurious conserved quantity that FHP has without its three-body rule, decays shear waves in each automaton, and measures viscosity against wave angle.

### 5. Lattice Boltzmann and the D2Q9 Stencil
Replace Boolean particles with continuous distributions on nine velocities, weighted so the square lattice's moments match the Maxwellian's through rank 4 (eight moving vectors are already isotropic; the rest weight is what lets the rank-2 and rank-4 moments share one sound speed). The reader picks weights on a plane of choices where isotropy and the right sound speed meet only at D2Q9, edits the equilibrium distribution live against the Maxwellian's moments, measures viscosity by direction and drift under a Galilean boost, then watches flow past a cylinder break its mirror symmetry at a measured growth rate and shed a Kármán vortex street with the Strouhal number measured as it runs.

### 6. Ising and the Z2 Break
The Ising Hamiltonian is unchanged when every spin flips, yet below the critical temperature the system settles into one of the two signs. The reader runs Metropolis and Wolff updates on a live grid, watches the magnetisation trace wander and lock, runs a grid against its exact mirror image, counts reversals by grid size, locates the critical temperature from a Binder cumulant crossing, compares Metropolis and Wolff autocorrelation at the critical point, and sweeps temperature to compare the measured magnetisation against Onsager's exact curve.

## What to get right

- Each act has one colour and each concept keeps its colour across all six essays. The through-line is a symmetry kept or lost, so every essay should say plainly which symmetry the continuum has, which one the discretisation keeps, and what the reader can measure to tell.
- The wallpaper tiler must apply symmetry operations in lattice coordinates correctly (a Cartesian rotation matrix applied to hexagonal lattice coordinates is a shear, which draws several groups wrong), and it should be checked against the International Tables generators: seventeen groups, thirteen symmorphic, ten crystallographic point groups. p3m1 and p31m are easy to swap.
- Symplectic does not mean most accurate. RK4 beats Verlet on energy error over a fairly long Kepler run; the point is bounded versus growing error. Get the sign of the shadow-Hamiltonian correction right, and make any area figure's numbers match what the code computes.
- The lattice-gas and lattice Boltzmann figures must actually run and measure. Shear-wave decay on periodic lattices shows HPP's anisotropy honestly (at one orientation it never decays). The D2Q9 equilibrium must be correct in every channel or the flow blows up, walls are bounce-back and so no-slip, the Strouhal number comes from measured crossings, and the loss of symmetry behind the vortex street is a Hopf bifurcation. Don't invent quotes or anecdotes about the lattice-gas pioneers.
- Ising: magnetisation reversals on a small grid are much rarer than intuition suggests, so quote measured sweep counts. The Onsager transition is continuous with infinite slope, and finite-size points overshoot the exact curve near and above the critical temperature. Real 2D Ising materials are layered magnets like K2CoF4; binary alloys and the liquid-gas point are 3D Ising.
- HPP's viscosity is zero on the axes and largest at 45 degrees, but it does not follow the mean-field sin^2 2θ law and its 45-degree value grows with wavelength, so don't quote it as a material constant. FHP is isotropic only to rank 4; a small sixfold variation remains.
- In a confined channel the shedding onset and Strouhal number differ from the unconfined-cylinder literature values; quote what the page measures. Inlet and outlet boundaries must conserve mass flux or the wake re-symmetrises.
- A symmetry detector must work up to translation on the torus; a bounding-box test reports false symmetry drops.
- Numbers in the prose must match the figures; measure any throughput claim or leave it out.
