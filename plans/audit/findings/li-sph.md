# Findings: lithium-ion and sph

Before: lithium-ion 7 articles, sph 4. After: lithium-ion 5, sph 2.

# lithium-ion

Article words went from 8,710 to 7,606 (-13%). The three merged pages went from 3,797 words to 2,561 (-33%). The electrochemistry pages were kept almost whole, which is why the total cut is smaller than the reviewer's 25%.

## 1. Cut, merged, renumbered

| new | built from |
|---|---|
| 01-voltage-at-rest | 04-voltage-at-rest |
| 02-voltage-under-load | 05-voltage-under-load |
| 03-aging-and-failure | 06-aging-and-failure |
| 04-impedance-spectroscopy | 07-impedance-spectroscopy |
| 05-from-cell-to-pack | 01-cell-in-hand + 02-packs + 03-bms, rewritten |

Deleted: 01-cell-in-hand, 02-packs, 03-bms.

**Ordering.** The reviewer said to lead with old 04, so the electrochemistry arc comes first and the merged systems article comes last. The merged article is a capstone in any case. Its SOC estimator depends on dV/dx from Part 1, the CCCV taper on the loss stack from Part 2, charging and fast-charge limits on resistance growth and plating from Part 3, and the forward references to thermal runaway in Part 3 now point to Part 5. Every "Part N" reference, link and nav footer was renumbered.

**What the merged article keeps.** It is a new article with four figures. Every model is new and lives in `lib/battery-math.js`.
1. CCCV charge. The taper is computed from I = (Vmax - OCV)/R on the real OCV curve, and a second panel sweeps C-rate. The old figure was a hand-shaped exponential.
2. Series string. It draws cell capacities and SOC offsets and discharges until the first cell is empty, with three balancing modes. A Monte Carlo panel shows usable capacity against string length, which is the non-obvious point: expected loss grows with the order statistic of n draws. This replaces old 02's drift figure (fake, see 4) and old 03's balancing figure.
3. SOC estimation. A real two-state EKF (SOC plus one RC state) runs against coulomb counting and voltage lookup on a cell with an RC polarisation, a biased current sensor and a wrong initial guess. Grey spans mark where dOCV/dSOC is flat. This replaces old 03's heuristic "blend".
4. Runaway propagation. A 12-cell stack is modelled as a lumped thermal network, with Arrhenius self-heating and a finite energy per cell. There is no fixed trigger temperature (Semenov). A second panel maps the propagating share over G and h, recomputed per SOC. This replaces old 02's CA, whose ignited cells released heat forever.

Dropped without a home: the form-factor gallery (no computation), the flashlight-driver figure (it does compute OCV - IR against a CC-driver dropout, but it teaches nothing beyond Part 2's IR drop), the "scale" card galleries and SCALE pills (dashboard chrome), and the safe-envelope figure (a lookup table with status verdicts). The envelope content survives as one prose paragraph on protection limits.

## 2. Errors confirmed and fixed

- **01 facts (old 01).** The claims "most flashlight 26650s are LFP" and "Powerwall is full of prismatic LFP pouch cells" are false. Powerwall 1 and 2 used NMC cylinders. Both claims left with the page, and the merged article makes neither.
- **"CV tail lengthens proportionally" (old 01): overstated, confirmed by computation.** At 30 mΩ on 5 Ah, going from 1C to 3C cuts the total charge time from 82 to 53 min, while CV time grows from 32 to 43 min. The merged article gives these numbers, and the live readout reproduces them.
- **Pack drift (old 02): fake, confirmed.** `packDrift` computed "voltage" as `cellV*(0.85+0.15*soc)*fade`, with soc = 1 - (Qused mod 1), so the fan-out was an artefact of the modulo. Removed and replaced (Figure 2).
- **Thermal CA (old 02): confirmed.** Ignited cells added 250/8 °C every step forever, with no energy budget. Replaced (Figure 4).
- **"Seeded 3% integrator bias" (old 03): confirmed.** The code starts from a 3-point offset and adds zero-mean noise, so there is no bias and no drift. The EKF claim was also false, since the estimator was a dV/dx-weighted average. Replaced with a real EKF and a real sensor bias.
- **Randles circuit (old 07, now 04): confirmed.** The code had R_s + (R_ct || CPE) + W, so the Warburg element sat outside the parallel block. `randlesZ` now puts W in series with R_ct inside the faradaic branch. Checked numerically: with φ = 1 the low-frequency tail has slope 1.0000 and meets the real axis at 0.169355, against R_s + R_ct - 2σ²C_dl = 0.169360. The KaTeX formula was updated to match.
- **"Additive form is not an approximation" (old 05, now 02): confirmed wrong.** Replaced with a sentence saying it is the lumped first model and naming the couplings it ignores.
- **Onboard EIS overclaim (old 07): confirmed.** Replaced with a paragraph on where spectra are actually measured (bench, end of line, second-life grading). Vehicle BMSes use pulse resistance. The "cell's diary" ending section was removed.
- **"Part 2" cited for R_s (old 07): confirmed stretch.** R_s now points to the IR term of Part 2 (the loss stack), in the prose and in the Nyquist chapter labels.
- **Aging-figure capacity readout (old 07): fake, not flagged.** It printed `1 - 0.2*age` as "remaining capacity" as if it were estimated from the spectrum. Removed. The caption now states the element multipliers as chosen values, and no longer calls them "empirical".
- **Staging figure (old 04, now 01): confirmed.** The lib comment claimed a lattice-gas, but the code used hard-coded thresholds and, in the stage-1 region, spread lithium uniformly through all galleries, which contradicts the prose on phase coexistence. The comment is now honest. `stagingConfig` draws the ideal Rüdorff-Hofmann sequence (stage n = LiC6n at x = 1/n) and uses the lever rule to split the lattice into side-by-side domains in each two-phase region. This is a documented phase sequence drawn faithfully, so it is not a relabelled fake: the figure no longer claims to simulate anything, and every filled-site count equals x.
- **Graphite OCV curve (not flagged, the biggest error in the series).** The old fit went below 0 V vs Li/Li+ for x > 0.48 (it read -0.03 V, which would mean plating at rest), and it had no plateaus near 0.20 or 0.12 V, although the captions claimed them. It is replaced by the published fit of Chen et al., J. Electrochem. Soc. 167, 080534 (2020), with plateaus at 0.21, 0.13 and 0.09 V. Full-cell voltages fall by about 0.1 V as a result: an NMC cell is now 2.9-4.2 V over the SOC window and LFP about 3.25-3.3 V on the plateau. The Part 1 plateau bands and captions, the dV/dx text and Part 2's "3.42 V plateau" caption were updated to match.
- **"A new pack tolerates 3C charging at 0 °C" (old 06, now 03).** This is false for graphite cells, since high-rate charging at 0 °C plates even new cells. Replaced with a claim without numbers: a protocol that is safe on a new cell can plate on the same cell years later.
- **Slop in the kept pages.** Removed "a feature, not a bug" and the Takeaways list in 03. Em dashes in untouched paragraphs were left for the prose pass, as the brief says.

## 3. Errors rejected

- None of the flagged items were rejected. Two were only partly right:
  - The reviewer's "staging uses hard-coded thresholds" is true. The fix is a faithful drawing of the known phase sequence, not a lattice-gas simulation, and I judged that enough for the figure's teaching purpose.
  - The DLA overlap with emergence/08-laplacian-growth is real, but the dendrite figure stays. Its separator-short framing is specific to this series.

## 4. Figures made honest or removed

- Replaced with real computations: CCCV, pack drift, thermal runaway, SOC estimation and balancing (all now in 05).
- Removed: form-factor gallery, flashlight drivers, scale galleries, safe envelope, and the 04 capacity readout.
- Relabelled with the stated assumptions (the computation itself is real): the 04 aging multipliers, and the 01 staging drawing.

## 5. Unresolved (needs a human)

- The merged article's thermal model is conduction only, with parameters I chose: Ea = 151 kJ/mol tuned to a 0.02 K/min onset at 100 °C, E = 30 kJ, Cth = 45 J/K. It is honest about that, but a battery-safety expert should look at the propagation map before anyone quotes it.
- The EKF is given the exact cell model, so its NMC result is a best case. The caption says so. On NMC with a sensor bias, its ±2σ band is overconfident (the readout reports "outside 46% of the time" with a 0.3-point error). This is left as is, since the readout states it honestly.
- Part 1's gallery-opening story (an elastic cost per opened gallery) simplifies Safran's interlayer-repulsion picture of staging. This was not changed.
- Em dashes remain in paragraphs I didn't touch (about 25 across 01-04), along with the "Figure 1, building the circuit" headings in 04.

## 6. Inbound links

None. No page outside docs/lithium-ion links to any lithium-ion article file. The homepage links only to lithium-ion/index.html.

## 7. Homepage entry

- title: The Lithium-Ion Cell
- count: 5
- desc: Why a cell's resting voltage has plateaus and what that does to state-of-charge estimation, the stack of losses under load, aging and dendrites, impedance spectra, and what changes when cells are put together into a pack.
- tags: OCV · Butler-Volmer · SEI · Nyquist · Kalman filter · thermal runaway

# sph

Before: 4 articles. After: 2.

## 1. Cut, merged, renumbered

| new | built from |
|---|---|
| 01-particles-and-forces | 01 (boids figure removed) + the SDF obstacle figure from 03, rewritten as a "Walls and Obstacles" section |
| 02-gpu | 02 (setTimeout "CPU vs GPU" figure removed) |

Cut: 03-beyond-water, 04-playground. No file was renamed.

**Merging 03 into 01.** I merged it, but kept only the SDF collision figure. It is the one part of 03 that is SPH practice and not a material toy, and it explains something 01 leaves unexplained: how the final simulation's container walls work. The rest was cut:
- Springs is a mass-spring network. It is not SPH.
- Sand's "friction" is -mu_f v_tan W, which is proportional to sliding velocity. It vanishes at rest, so it cannot hold a static slope, and the "piles into a cone" claim is false. This was confirmed from the force law.
- Temperature is an ad hoc k(T), and the prose itself calls it intuition only.
- Emitters, sinks and vortex are a demo with no idea behind them.

A trimmed standalone 03 would have been two thin figures. That did not justify a third article.

**04-playground.** Cut, with nothing salvaged. It wraps a sandbox in 194 words, and its sand and ice repeat 03's flawed models.

**Boids detour (01).** Removed, since it duplicates emergence/02-flocking. sph/02 is now the gallery's only home for spatial hashing, because lattice-simulation/13 was cut in batch 1.

## 2. Errors confirmed and fixed

- **Kernel normalization (01).** W = (1-q)^3 integrates to pi h^2/10 over the disk. The prose now gives the 10/(pi h^2) constant and explains why leaving it out is absorbed by the rest density and stiffness.
- **Gravity divided by density.** This was in 01 Fig 6, the 02 CPU fallback, the 02 WGSL and the ported SDF figure. The acceleration came out as g/rho. Gravity now enters as rho*g, with a prose note.
- **02 forceAndIntegrate data race.** It is now split into forcePass (writing the previously unused force buffer) and integratePass. The prose and pipeline figure now match the 5 dispatches per substep.
- **02 CPU-vs-GPU setTimeout figure.** Removed, and its prose folded into "GPU Parallelism".
- **Index "tens of thousands".** The limit is 4,000 particles (1,200 on CPU). The card and caption now say so.
- **Index Vocabulary section.** Removed.

Found beyond the review:
- **01 Fig 5 integrators.**
  - The caption said four methods, but there were three.
  - The energy readout used E0 = potential only.
  - "Cheaper methods spiral outward" was false for Verlet.
  - Verlet's velocity lagged a step.

  The figure now shows explicit Euler, symplectic Euler, velocity Verlet and RK4, and its claims were checked against the live readout. At dt 0.035 after 25 steps: explicit +231%, symplectic +1.1%, Verlet about 0.01%, RK4 about -0.004%.
- **02 Fig 2 hash counts.** It compared one particle's checks with brute force summed over all particles. It now compares like with like: 39 vs 5 per particle, 1560 vs 190 in total.
- **02 pipeline example.** The force example was missing a /2 and the pressure example a max(0, ...).
- **02 WebGPU grid.** The grid was ceil(800/H) wide, so particles fell off it on canvases wider than 800 px. It is now ceil(2400/H).
- **SDF box normal.** It picked the farther face; it now picks the nearest. The velocity handling also now matches the displayed equation: the inward normal velocity is removed, where the old code reflected it with a factor of 1.2.
- **Series name.** "Smooth" is now "Smoothed Particle Hydrodynamics".

## 3. Errors rejected

None. All flagged errors were confirmed.

## 4. Figures made honest or removed

- Removed: 02 CPU vs GPU timer, 01 boids, all of 03 except the SDF figure, and the 04 sandbox.
- Made honest: 01 Fig 5 energy readout and method set, 02 Fig 2 check counts.

## 5. Unresolved

- The series still explains how to build the loop, never why. It does not cover momentum conservation of the symmetric pressure form (the Müller form is only symmetric when rho_i = rho_j), the cost of weak compressibility, or tensile instability. That is prose-phase work.
- The WebGPU path ran headless (with --enable-unsafe-webgpu) with no shader errors. It has not been tried on real hardware for long runs. MAX_PER_CELL = 32 silently drops overflow.

## 6. Inbound links

None to the deleted pages. game-is-the-math/index.html links to ../sph/index.html, which still exists.

## 7. Homepage entry

- title: Smoothed Particle Hydrodynamics
- count: 2
- desc: Building a particle fluid from a smoothing kernel, pressure and viscosity, then moving it onto the GPU with a spatial hash and WebGPU compute passes. Made by Ian Johnson.
- tags: SPH · WebGPU · physics simulation · spatial hashing

# Gate

- render-check over http://localhost:8104 passes on all 9 pages: the lithium-ion index, 01-05, the sph index, 01 and 02.
- Playwright drove every changed figure, with no errors, and each display changed:
  - lithium-ion 05, all four figures: sliders, selects, the reseed buttons, the chemistry radio and a click on the thermal map.
  - lithium-ion 01, the staging slider and the cathode toggle.
  - lithium-ion 02, the cascade C-rate and chemistry.
  - lithium-ion 04, the Nyquist σW slider and the aging slider.
  - sph: the integrator sliders, Figs 6 and 7 (including dragging an obstacle), the pipeline Next button, the hash particle slider, and the 02 sim on both backends.
- The prose numbers in lithium-ion 05 were checked against the live readouts (the CCCV switch points and times, string loss by length, EKF errors, the propagation share at 100% and 50% SOC).
- At a 390 px viewport there is no horizontal scroll on 05, 01 or the index. KaTeX displays now scroll inside their own box.
