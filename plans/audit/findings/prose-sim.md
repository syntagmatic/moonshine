# Findings: prose pass, sim track (emergence, lattice-simulation)

Word counts come from a script that strips script, style, svg and math blocks and counts the words left. The count includes captions, control labels and reference lists, so the running prose shrank by a few points more than these totals show. Em dashes are counted in visible text (including `<title>`) and in JS string literals. Code comments are not counted.

## Numbers

| series | words before | after | change | em dashes before (visible + JS) | after |
|---|---|---|---|---|---|
| emergence (14 + index) | 21,186 | 19,223 | -9% | 2 + 2 | 0 |
| lattice-simulation (6 + index) | 13,712 | 12,045 | -12% | 31 + 5 | 0 |

Per page:

| page | before | after |
|---|---|---|
| emergence/01 cellular automata | 1878 | 1695 |
| emergence/02 flocking | 1382 | 1269 |
| emergence/03 traffic | 2168 | 2030 |
| emergence/04 coarsening | 1601 | 1417 |
| emergence/05 spin glass | 1064 | 986 |
| emergence/06 percolation | 1458 | 1248 |
| emergence/07 sandpile | 1332 | 1212 |
| emergence/08 Laplacian growth | 1819 | 1655 |
| emergence/09 self-avoiding walks | 525 | 466 |
| emergence/10 stigmergy | 2473 | 2240 |
| emergence/11 predator-prey | 1506 | 1329 |
| emergence/12 reaction-diffusion | 1863 | 1706 |
| emergence/13 excitable media | 1065 | 983 |
| emergence/14 Kuramoto | 755 | 735 |
| emergence/index | 297 | 252 |
| lattice/01 wallpaper groups | 2232 | 2117 |
| lattice/02 symplectic | 2770 | 2454 |
| lattice/03 Life | 2219 | 1927 |
| lattice/04 HPP vs FHP | 2062 | 1745 |
| lattice/05 LBM | 1828 | 1580 |
| lattice/06 Ising | 2310 | 1982 |
| lattice/index | 291 | 240 |

Both series fall short of the 20-30% target, and that is deliberate. The previous track had just rewritten most of these pages, and nearly every sentence left carries a number, a parameter or an instruction for a figure. The cuts were aimed at slop, repetition and prose that duplicated a caption. They stopped at the point where content would have gone.

Almost all of the lattice em dashes were `—` readout placeholders. They are now `…`, except for two that got words: the empty-board bbox in lattice/03 now reads "empty", and the Recovery readout in emergence/14 reads "none yet". Page-title separators are now ` | `. Only JS string literals changed inside scripts; a script-block diff against HEAD confirms that no logic changed.

## Worst patterns found

- Bolded lead-in sentences: lattice/02 ("Simplicity is the point.", "Liouville's theorem, in miniature."), lattice/04, 05 and 06 ("Why this is cheap.", "Why exactly nine.") and emergence/03 (three of them). All are now plain prose.
- Grand closers: emergence/06 ("Catastrophes of every size are not exceptions..."), emergence/07 ("Criticality is the attractor", "edge of chaos"), lattice/04 ("That is the whole story..."). All cut.
- Not-X-but-Y constructions and stagey lines: "Now the punchline", "Enter lattice Boltzmann.", "This is the payoff.", "Here is the subtle part.", "That single constraint changes everything."
- Tricolons, several of them in subtitles (emergence/13, 14, index).
- Repetition: lattice/02 made the Euler area argument twice. lattice/06 made the pairing argument for ⟨M⟩ = 0 twice. emergence/10 said three times that the slime mold does not reproduce the Tokyo rail map. Captions across both series restated the prose.

## Content fixes (each confirmed)

- **emergence/03.** The page said "a scales every term, so the right side grows like a²". Because s* contains vΔv/(2√(ab)), f_Δv scales like √a. That puts the ½f_v² term at a² and the f_v·f_Δv term at a^{3/2}. The text now says so. The conclusion that brisk drivers are stable is unchanged.
- **emergence/06.** "The percolation threshold is universal" was wrong: thresholds depend on the lattice, and the exponents are what is universal. A garbled statement of the Drossel-Schwabl condition f ≪ p was also rewritten.
- **emergence/index.**
  - Removed "zebrafish stripes from two diffusing chemicals". Zebrafish stripes come from interactions between pigment cells. Article 12 uses the angelfish (Kondo and Asai 1995).
  - The claim that the index's vocabulary is "colour-coded across the series" was false, since only 01, 04 and 06 use those classes. It was reworded.
  - The article 12 card now says gradients "can scale" with the tissue, matching the article's own statement that scaling is an open question.
- **lattice/02.**
  - The Verlet kick and drift had their arguments swapped. They now read K(q) and D(p); the update formula was already right.
  - The subtitle "Verlet wins" contradicted Fig 3, where RK4 beats Verlet's band. It now contrasts bounded error with growing error.
  - Cut a line about "a 10-billion-step Hamiltonian Monte Carlo run". HMC trajectories are short, and the correct reason for using Verlet in HMC is already on the page.
- **lattice/05.**
  - Nine velocities is the minimum only on the square lattice, since the hexagonal set also works. D2Q8 was checked by hand and turns out inconsistent.
  - "Unique up to normalisation" is now just "unique".
- **lattice/06.**
  - The text called the Onsager transition a "step" or "discontinuity". M0 goes to zero continuously, with infinite slope.
  - A bound of "ξ ≲ 40 on 80×80" sat in a paragraph about the 32×32 Fig 3. It was removed.
  - The intro placed binary alloys and the liquid-gas point in the 2D class. They are 3D Ising.

## Suspected errors, not fixed

**emergence/02 and 03, the unverified numbers.**
- All hardcoded parameters in the prose match the simulation code: boid count, Vicsek N, L, R, v0 and noise law, IDM v0, T, s0, b and vehicle length, and the NaSch sizes.
- The polarization values in 02 are computed live on the page, so they cannot drift.
- Stated but never rerun:
  - Wave speeds of about -14 km/h at a = 0.8 and about -10 km/h at a = 0.5.
  - "a near 1 m/s² is close to the tip of the tongue" in Fig 2.
  - Jam-front speeds of -0.74 and -0.48 cells/tick.
  - A maximum hysteresis-test difference of 0.006.
  - The 200,000-tick single-car value of 4.750.

  These agree with theory where theory exists (front speed ≈ -(1-p), and ⟨v⟩ = vmax - p). None has been rerun.
- 02's last paragraph ties the fixed-count neighbor rule to "where the fixed-radius particles lost their order". Those particles lost order because they were frozen in place, not because the flock thinned, so the link is loose.
- The swarm-robot aggregation controller in 02 is unsourced.

**Other pages.**
- **emergence/06, Fig 7 "slope α ≈ 2".** This is hardcoded in KaTeX. The histogram counts fires per log bin without dividing by bin width, so the raw slope should be near -0.1 to -0.3. The prose probably contradicts the figure's own live fit. Rerun it, then either change the number or normalize the bins as 07 does. Separately, whether 2D Drossel-Schwabl is truly critical is contested (Grassberger 2002), and the page states SOC without a caveat.
- **emergence/09.** The prose gives the kinetic-growth effective exponent as 0.59-0.65, but the previous track measured 0.635-0.65. One of the two is stale. "Most SAWs eventually trap" understates the growing walk, which traps with probability 1.
- **emergence/10.** The Fig 1 caption says the defaults (sensor angle 45°) are "the values Jones used most often". I recall 22.5° being common in Jones 2010, so this needs checking against the paper. The simulation-behaviour numbers were not rerun: 14-17 of 20 colonies, λ thresholds around 0.04 and 0.06, a 10% lawn detour, and cells doubling at sensor distance 20.
- **emergence/12.** Gregor et al.'s "about 1% of egg length" precision is from memory; published values run from 1% to 2%.
- **emergence/13.** The units of the "Hz" readout are still unchecked. "Forest-fire fronts" appears in a list of FHN-like media, but they are excitable, not FHN.
- **emergence/14.** Not verified at default settings: that the ring figure shows travelling phase waves and clusters at different tempos, and that recovery time shrinks as coupling rises.
- **lattice/02.** "Each further shadow-Hamiltonian term shrinks the band again". Only the first correction is measured.
- **lattice/03.** The census fractions ("three objects in four", "one in eight") are stochastic and were not rerun.
- **lattice/06, Fig 3 caption.** The caption says the points "undershoot" Onsager near Tc because of box size. Finite size makes |M| overshoot at and above Tc (|M| ∝ L^{-1/8}, about 0.65 at L = 32). Just below Tc the infinite-slope onset can leave points under the curve, but 200 Metropolis warm-up sweeps near Tc (z ≈ 2.17) is the likelier cause. Run the sweep to settle it.
- **lattice/06, other.** "Ten million spin-flips per second in a browser" was never measured. The text says a 64×64 grid while Fig 1 is 80×80; the arithmetic is right for 64×64.

## Needs a human

- **lattice/06.** The Fig 1 side panel has a JS-driven "Above Tc" status pill. That is dashboard creep, but removing it means changing figure code.
- **lattice/04.** The Fig 1 tensor panels carry "Isotropic" and "Not isotropic" verdict labels. They are borderline badges.
- **emergence/index.** Decide whether to keep the Vocabulary swatch block, which reads as a legend.
- **Cutting depth.** Decide whether to push the recently rewritten pages (emergence 04, 05, 08-13 and lattice 01) further toward the 20-30% target. That would mean cutting content, not slop.
