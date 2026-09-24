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
