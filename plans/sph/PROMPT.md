# Smoothed Particle Hydrodynamics

I want a two-part series that builds a particle fluid from nothing and then makes it fast. Smoothed particle hydrodynamics simulates a fluid as a crowd of particles: each one estimates the local density from its neighbors, turns density into pressure, and feels pressure and viscosity forces from the particles around it. The reader is a programmer who wants to write one. The first part builds that loop one term at a time until a small fluid pours into a container around obstacles; the second part moves the same loop onto the GPU so it runs thousands of particles in the browser.

The through-line is one simulation assembled in view. Every figure in the first part is a piece of the final fluid, and the second part runs that same fluid at scale. At the end the reader has seen every term of the loop, can play with the knobs that make it splash or ooze, and knows why a spatial hash and a pass-by-pass GPU pipeline are what make it cheap.

## Articles

### 1. Particles, Neighborhoods, and Forces
Particles replace grid cells, and a smoothing kernel turns a set of points into a continuous field. The reader drags neighbors around a particle to see kernel weights and a density sum update in the equation, watches pressure and viscosity forces act on a probe, compares four integrators on one orbit with their energy error shown, and then plays with a full 2D fluid filling a container from a spout. It ends with walls and obstacles handled through signed distance functions, where the reader drags a circle and a box through the fluid.

### 2. Moving to the GPU
Brute-force neighbor search costs n squared, and a spatial hash cuts it to the few cells around each particle. The reader counts distance checks for brute force against a cell lookup on the same particles, steps through the compute passes of one GPU substep (density, pressure, forces, integration) to see what each column of threads reads and writes, and then runs the Part 1 fluid with a few thousand particles, falling back to the CPU where the GPU compute API is missing.

## What to get right

- Normalize the kernel correctly and say what happens if you don't (the constant is absorbed by rest density and stiffness). Gravity enters as a force density (density times g), so it must not end up divided by density.
- Integrator claims must match the live energy readout: explicit Euler gains energy, symplectic Euler and Verlet stay bounded, RK4 is accurate but costlier. The energy readout counts kinetic and potential energy.
- Compare like with like in the neighbor-search figure (per particle against per particle, total against total). Split force and integration into separate passes so no pass reads what another thread is writing, and make the pipeline figure show the real number of dispatches.
- Give the honest scale: a few thousand particles on the GPU and around a thousand on the CPU fallback. Size the hash grid to the whole canvas and say what happens when a cell overflows.
- Keep one color per concept across both parts: particle, kernel and neighborhood, force, tension, compression. The series was made by Ian Johnson; keep that credit.
