# Claims: Emergence series

Built 2026-09-25, the same way as the Algorithms & ML ledger. Every checkable claim in
the prose, captions, equations, readouts and alt text of the fourteen essays and the
series index, each checked this session: **Computed** means the page's own model code
was extracted and run in node (or the figure read in headless Chromium), **Derived**
means worked by hand, **Sourced** means read in the named primary source. `[x]` verified,
`[ ]` wrong, `[?]` unverifiable (reword or cut). Line numbers refer to the pages as of
commit a12a28f, before the fixes. The node and Playwright scripts were session scratch
and were not kept; each entry says what was run.

The wrong and unverifiable entries below were all addressed in the fix pass the same day
(corrected, reworded or cut), except where a fix record's "Not fixed" line says
otherwise. The "Fix pass" section at the end records what changed on each page and the
numbers each entry now carries. The entries themselves still describe the pages as
audited.

## Status

| # | article | verified | wrong | unverifiable | render-check | notes |
|---|---|---|---|---|---|---|
| 01 | Cellular Automata | 56 | 2 | 4 | PASS | ant highway 9,977 / period 104 confirmed; Lenia map reproduces but its fine-T explanation was wrong (catalogued shape dies, parameters do not) |
| 02 | Flocking | 38 | 2 | 6 | PASS | live Vicsek/frozen numbers hold across seeds; alignment-off "clumps" claim false; frozen curve misattributed to Mermin-Wagner |
| 03 | Traffic shockwaves | 48 | 6 | 6 | PASS | IDM wave speeds (-14, -10 km/h) hold; NaSch jam speed was the packed-edge speed, real jams move at -0.57 cells/tick (-15 km/h) |
| 04 | Coarsening and consensus | 40 | 2 | 5 | PASS | exponent 0.48 +- 0.03 (60 runs, range 0.42-0.55); stripes 0.339 at 32x32 vs Barros 0.3388; Deffuant majors sit 10-15% under 1/(2 eps) |
| 05 | Spin glass | 36 | 7 | 4 | PASS | exact enumeration reproduces 37 ferro valleys; anneal and valley ranges were off; dinner-party frustration rule wrong |
| 06 | Percolation | 31 | 5 | 9 | PASS | thresholds and SIR mapping hold (fire sweep crosses 50% at 0.593, SIR bands split above 1/2); Drossel-Schwabl density claim wrong (0.39 measured, not p_c); ignition rule not as described |
| 07 | Sandpile | 37 | 3 | 5 | PASS | fits and spectra reproduce; low-frequency "rise" is really a dip; identity-shape and forest-fire claims unsourced |
| 08 | Laplacian Growth | 43 | 5 | 6 | PASS | DLA fit reproduces (mean 1.67 on this canvas vs 1.715); relief map was rescaled per frame; Kirchner and Horton glosses wrong |
| 09 | Self-avoiding walks | 13 | 9 | 4 | PASS | "SAW" figures were growing walks that trap (~71 steps): Fig 1 SAWs came out smaller than random walks at N >= 200; now pivot-sampled |
| 10 | Stigmergy | 37 | 17 | 10 | PASS | bridge batch and late-opening claims wrong on rerun (evaporation 0.045-0.05 does rescue late colonies); trail walkers got stuck at default settings |
| 11 | Predator-prey in space | 42 | 2 | 4 | PASS | Hopf K_c = 1.1397, defaults (K=2) past it; lattice lambda_c ~ 0.20 (L=200) vs mean field 0.111, sweep was too short to see it; no historical data on page |
| 12 | Two ways to make a pattern | 43 | 4 | 5 | PASS | map is real runs (28 of 35 patterned tiles above the saddle-node curve); Gregor 1% claim wrong; scaling claim ignored Gregor 2005 |
| 13 | Excitable media | 23 | 17 | 11 | PASS | S1-S2 and "fibrillation" buttons produced nothing (activity dead by step 2000); Fig 4 default paced 5x faster than the tissue recovers; Hz/bpm readouts meaningless; no equations on page |
| 14 | The Kuramoto model | 26 | 5 | 9 | PASS | Kc and sqrt(1-Kc/K) sourced and hold at N=50 from K=1.5; Fig 2 was 9-time-unit single snapshots; firefly grid never ordered (additive pulses); bimodal window checked |
| idx | Series index | 15 | 5 | 2 | PASS | count 14 matches; "one or two models", "already agree", "soap films", "target waves", mechanism list missing frustration |
| | **Total** | **528** | **91** | **90** | | |

## 01 Cellular Automata

File: docs/emergence/01-cellular-automata.html. Checked 2026-09-25. Scripts (scratchpad w01-02/): eca.cjs (rule tables, Rule 90 vs Pascal, Rule 30 and 184 space-time), ant.cjs / ant2.cjs (page's ant code, highway detection, distance profile), load01.cjs (extracts LeniaFactory, ORBIUM and runCase from the page), v01.cjs (Figure 3 parameter runs, growth band, full Figure 4 map at sigma 0.015 and 0.017, state levels), hist.cjs / front.cjs / mu12.cjs (histogram, front/rear growth, mu 0.12 field), adapt.cjs (sigma 0.016 map; relax-then-ramp tests), pw.mjs (Playwright). Sources read this session: Wolfram NKS pp. 231, 235 (class definitions) and p. 317 (Rule 30 in Mathematica); Cook 2004 abstract (complex-systems.com) and Wikipedia summary of the proof chain; Gajardo, Moreira, Goles 2002 (arXiv nlin/0306022, full text: symmetric first ~500 steps, ~10,000 steps to highway, Bunimovich-Troubetzkoy result, open conjecture); Wikipedia "Langton's ant" (rules, 104-step highway); Chan 2019 (arXiv 1812.05433, full text); Chan's animals.json (Orbium unicaudatus entry); Davis and Bongard 2022 (arXiv 2205.12728 abstract). render-check: PASS.

### Prose and equations

- [x] Elementary CA: row of 0/1 cells, next state from left/self/right, 2^8 = 256 rules (`317`) : Derived.
- [x] Wolfram numbering lists neighbourhoods 111 down to 000 and reads outputs as binary; table under Fig 1 spells the number (`317`) : Computed. Display order [7..0]; parseRule bit i = output for neighbourhood i; 110 -> 01101110.
- [x] Rule 90 from a single cell draws a Sierpinski triangle; each cell is XOR of its two neighbours; row t is Pascal's row t mod 2 (`353`) : Computed. eca.cjs: 50 rows match C(t,k) mod 2 on alternate cells exactly; table 01011010 = l XOR r.
- [x] Rule 30 differs from Rule 90 in two output bits (`353`) : Derived. 30 XOR 90 = 01000100, two bits.
- [x] Rule 30 left flank diagonal stripes, right flank and centre irregular (`353`) : Computed. eca.cjs space-time print with the page's neighbourhood convention.
- [x] Wolfram used the centre column as a random number generator in Mathematica (`353`) : Sourced. NKS p. 317 notes: "Random[Integer] has generated 0's and 1's using exactly the rule 30 cellular automaton", returning the centre cell.
- [x] Rule 184 moves each 1 right when the cell ahead is empty, holds it otherwise (`355`) : Derived. Table 10111000: 110 -> 0, 010 -> 0 (car leaves), 101/100 -> 1 (car arrives), 111/011 -> 1 (blocked).
- [x] Rule 184 = Nagel-Schreckenberg with vmax 1 and no randomness (`355`) : Derived. NaSch with vmax 1, p = 0 reduces to the same update.
- [x] Random start: jams drift backward while cars pass through them (`355`) : Computed. eca.cjs at density 0.45 and 0.6: runs of 1s move left one cell per step while individual 1s leave their right ends.
- [x] Rule 110 from random start: particles over a periodic background (`355`) : Computed by eye in Chromium (Fig 1 Random start).
- [x] Cook proved (2004) Rule 110 collisions can emulate any Turing machine (`355`) : Sourced. Cook, Complex Systems 15, 1-40 (2004), proves Wolfram's 1985 conjecture that Rule 110 is universal (cyclic tag systems -> Turing machines).
- [ ] Class I = "rules whose patterns die out" (`357`) : WRONG. NKS p. 231: class 1 is "almost all initial conditions lead to exactly the same uniform final state" (can be all 1s). Same in the code's class blurb "dies out".
- [x] Classes II-IV descriptions and "sorted by eye" (`357`) : Sourced. NKS p. 235 (simple structures; seemingly random; localized structures that move and interact); p. 231: patterns from random starts "can almost always be assigned quite easily".
- [x] Preset class tags 30 III, 90 III, 110 IV, 184 II (Fig 1 tag) : Computed against the NKS definitions from random starts in Fig 1; Rule 110 as class 4 is Wolfram's standard example. A primary table listing 184 and 90 was not read.
- [x] Life is the same kind of rule on a square grid with eight neighbours (`357`) : Derived; Chan 2019 sec. 2.1.6 also frames GoL as the R = T = P = 1 case of Lenia. Link target exists.
- [x] Langton 1986; turn right on white, paint black, step; left on black, paint white, step (`361`) : Sourced. Wikipedia "Langton's ant" rules; Langton, Physica D 22 (1986) 120-149 (citation from Gajardo et al.). Code: white -> d+1 (clockwise on screen), black -> d+3.
- [x] Rule runs backward as easily as forward (`361`) : Derived. Each step is invertible (step back, flip, undo the turn).
- [x] First few hundred steps: small, nearly symmetric figures (`363`) : Sourced. Gajardo et al.: "a more or less symmetric trajectory in the first 500 steps".
- [x] Irregular blob grows for thousands of steps (`363`) : Sourced/Computed. Gajardo: "seemingly randomly for about 10,000 steps".
- [x] Distance creeps up unevenly in the blob phase, then climbs in a straight line (`363`) : Computed. ant2.cjs: max distance per 1,000-step window 12, 19, 23, 25, 24, 29, 23, 23, 35, 27; then 18 at 9,977 to 118 at 14,000, linear.
- [x] Highway from move 9,977, period 104 (`383`, live `ant-finding`) : Computed. ant.cjs with the page's detection: onset index 9,976 (move 9,977), period 104. Sourced: Wikipedia "highway pattern of 104 steps"; Gajardo "about 10,000 steps".
- [x] Each period carries the ant two cells along a diagonal (`383`) : Computed. Displacement per period (2, -2) rows/columns; the live sentence prints both.
- [x] "The rule contains no road and no number 104" (`383`) : Derived.
- [?] "no known method predicts the onset short of running the ant" (`383`) : Not in any source read; Gajardo et al. show hardness for general finite configurations, not for the blank-grid onset. Cut.
- [x] Bunimovich and Troubetzkoy 1992: path unbounded from any finite start (`383`) : Sourced via Gajardo et al.: "for any initial configuration, the trajectory of the ant is unbounded [2]", [2] = J. Stat. Phys. 67 (1992) 289-302. Primary paper paywalled, not read.
- [?] "Whether it always ends on a highway is open, though every finite start tried so far does" (`383`) : Open: Sourced (Gajardo: "it is conjectured"). "every finite start tried so far" is stronger than the source's "experiments suggest". Reword.
- [x] Chan's Lenia (2019) makes state, space, time continuous; ring kernel radius R; smooth growth; dt = 1/T (`387`) : Sourced. Chan 2019 eqs. 5, 15-16: R, T, P resolutions, dt = 1/T; Complex Systems 28, 251 (2019).
- [x] Update A <- clip(A + dt G(K*A)) (`389`) : Sourced/Computed. Chan eq. 15; code step() matches.
- [x] K(r) proportional to exp(4 - 1/(rho(1-rho))) (`393`) : Sourced. Chan eq. 10, exponential core exp(alpha - alpha/(4r(1-r))), alpha = 4. Code kernelCore matches.
- [x] Kernel zero at 0 and R, peaks at R/2, normalized to sum 1 (`395`) : Derived/Computed. Core 1 at rho 0.5, 0.9984 at 0.49; code divides by total.
- [x] u is the filled fraction of a fuzzy ring; own state does not enter (`395`) : Derived. Kernel weight at r = 0 is 0.
- [x] G(u) = 2 exp(-(u-mu)^2/(2 sigma^2)) - 1, range -1 to 1 (`399`, `401`) : Sourced. Chan eq. 13 exponential growth mapping; code growth() matches.
- [x] G > 0 only within sigma sqrt(2 ln 2) = 1.18 sigma of mu (`401`) : Derived. sqrt(2 ln 2) = 1.1774.
- [x] Orbium mu 0.15, sigma 0.015 (and R 13, T 10) (`401`, `435`) : Sourced. animals.json "Orbium unicaudatus" (O2u): R 13, T 10, b 1, m 0.15, s 0.015. The page's 20x20 pattern matches the catalogue RLE (first row decodes to 13/255 = 0.051, 4/255 = 0.0157, 60/255 = 0.235 at the page's positions).
- [x] Grows only while ring is 13.2% to 16.8% full (`401`) : Derived. 0.15 -/+ 0.01766 = 0.1323, 0.1677.
- [x] Otherwise fades at up to one unit of state per unit time (`401`) : Derived. min G = -1, times dt per step.
- [x] Fig 3 caption: R 13, T 10, 128 x 128 wrapping field; probe rings at R and R/2; kernel section; histogram of u over creature cells coloured by sign of G (`435`) : Computed. Code: N 128, arcs at R*s and R*s/2, histogram over A > 0.01, colour by G at bin centre.
- [x] Growth view green where gaining, red where live cells lose; front in green band, rear in red (`438`) : Computed. front.cjs at t = 5, 15, 20: growing cells average 1.8-2.1 cells ahead of the mass centre along the motion, fading cells 2.6-3.0 behind.
- [x] Body slides forward with nearly constant mass (`438`) : Computed. Mass 0.92-0.93 of start from t = 5 to 40; centroid moves.
- [x] Histogram: cells split between the narrow positive band and the negative tails (`438`) : Computed. t = 20: 96 growing, 112 fading; u concentrated 0.1-0.2 around the 0.132-0.168 band.
- [x] mu 0.16 starves and fades within a few time units (`440`) : Computed. Mass 0.72 at t = 3, below 5% by t = 4.
- [?] mu 0.12 "growth spills over and fills the whole field" (`440`) : Imprecise. mu12.cjs: mass reaches 35x by t = 20 and freezes as a speckle of small static spots over the whole field (17% of cells above 0.1). Reword.
- [x] sigma 0.014 kills it; 0.020 leaves it alive and slightly heavier (`440`) : Computed. 0.014: gone by t = 4. 0.020: mass 1.05 vs 0.93 at 0.015.
- [x] As R, T grow the update approaches dA/dt = G(K*A) with clip (`444`) : Sourced. Chan sec. 3.1.2: DL is the Euler method for CL; eq. 16.
- [x] Fig 4 runs: catalogued orbium resampled to R, simulated at T for 30 time units (`444`, `479`) : Computed. runCase seeds with scale R/13, steps round(30 T), early exit only below 1% or above 8x.
- [x] sigma 0.015: for R >= 10 survives at T 5 and 10, dies at 20 and 50 (`482`) : Computed. v01.cjs map: R 10-26 rows s/s at T 5, 10 (0.92-0.96), d 0.00 at T 20, 50. (R 8 survives only T 5.)
- [ ] "Its parameters were found at T = 10 and sit at the edge of its island, and refining the time step moves the edge" (`482`) : WRONG. adapt.cjs: an orbium relaxed at sigma 0.017 (or 0.016) at T = 20 or 50 and then ramped or jumped to 0.015 keeps gliding (mass 0.91-0.92 for 30 more units). sigma 0.015 is inside the island at fine T; it is the T = 10 catalogued shape that fails to make the switch. Chan 2019 Fig. 7: at finer T the orbium gets lighter and "the parameter range expands as time dilates". Davis and Bongard 2022 report Lenia gliders unstable at step sizes too small as well as too large. "found at T = 10" is also unsourced (catalogued at T = 10).
- [x] sigma 0.017: every run with R >= 8 and T >= 5 survives; finer resolution changes only sharpness (`482`) : Computed. Map: all s, masses 0.96-1.01.
- [x] Coarse still kills: R = 6 and T = 2, 3 die (`482`) : Computed. All d 0.00 at both sigmas.
- [x] At R = 6 the kernel peak is three cells out (`482`) : Derived. R/2.
- [x] At T = 2 or 3 one step moves a cell by a third to a half of its range (`482`) : Derived. |dt G| <= 1/T.
- [x] At R 13, T 10 a step changes a cell by at most 0.1 (`484`) : Computed. Max per-step change over 100 steps 0.100.
- [x] 4 levels: half a level 0.125, rounding erases every change, orbium freezes (`484`) : Computed. Mass 0.99 constant, total change from start 19.5 (vs 148 continuous) and none after the first steps.
- [x] 6 levels: it dies (`484`) : Computed. Mass 0 by t = 5.
- [x] Between 8 and 16 levels erratic (`484`) : Computed. 8, 10, 12 survive (0.90-0.95), 16 dies.
- [x] From about 24 levels up glides with the same mass as continuous (`484`) : Computed. 24, 32, 64: 0.91-0.94 vs 0.92-0.93.

### Figure 1 (elementary automata)

- [x] Caption: each row one generation, time down, row wraps (`350`) : Computed. nextRow uses modular neighbours.

### Figure 2 (Langton's ant)

- [x] Caption: blue cells last painted after the highway began; dashed line from the recorded-move scan at load (`380`) : Computed. lastFlip >= onset -> HWY colour; period/onset found from dirs at load, not hardcoded.

### Figure 4 (survival map)

- [x] Blue: survived with mass within a factor of two; pale: died (`479`) : Computed. outcome thresholds 0.5 and 2.
- [?] "Amber: grew without bound" (`479`) : Overstated. Code marks any final mass above 2x; no cell of either map is amber. Reword.
- [x] Map computed when scrolled into view; number is final/start mass (`479`) : Computed. Worker-run runCase; text = ratio.
- [x] Map colour scale fixed (categorical by outcome) : Computed.

### Anti-slop pass

- Em dashes: none. No cards or callouts. The class tag beside the rule number is a one-line label, acceptable. No closing summary.
- The class-tag blurb "dies out" in the code shares the Class I error above.

## 02 Flocking

File: docs/emergence/02-flocking.html. Checked 2026-09-25. Scripts (scratchpad w01-02/): load02.cjs (extracts rng, components, makeBoids, stepBoids, measureBoids, makeVicsek, stepVicsek from the page), v02.cjs (random-phi MC, boids background job, boids radius runs, Vicsek sweep over 8 seeds per point, 10 page-style sweeps, frozen network, Fig 2 traces), frz.cjs (frozen at eta 0), clump.cjs / clump2.cjs / clump3.cjs (boids clustering with alignment off), pw.mjs (Playwright). Sources read this session: Vicsek et al. 1995 (arXiv cond-mat/0611743, full text), Gregoire and Chate 2004 (arXiv cond-mat/0401208, full text), Tu and Toner 1995 (arXiv adap-org/9506001, full text), Ballerini et al. 2008 (arXiv 0709.1916 abstract), Reynolds boids page (red3d.com/cwr/boids). render-check: PASS.

Nearly every number on this page is a live readout computed at load (phi-random, bg-on/off, eta*, frozen-max, moving-max, mean-deg, giant-frac). The entries check that the computation is what the prose says and that the prose's qualitative claims hold across seeds.

### Prose and equations

- [?] "No bird leads a starling murmuration; each bird reacts to a few nearby birds" (`107`) : Second half Sourced (Ballerini 2008: each bird interacts with six to seven neighbours). "No bird leads" is not in any source read. Reword.
- [x] Reynolds 1987, three steering rules for "boids" (`107`, `123`) : Sourced. red3d.com: separation, alignment, cohesion; "Flocks, Herds, and Schools: A Distributed Behavioral Model", SIGGRAPH '87. Code matches the three terms.
- [x] phi = |(1/N) sum v_i| (`114`) : Derived. Matches stepBoids/stepVicsek return value and Vicsek's v_a (eq. 3, with |v| = v).
- [x] phi of order 1/sqrt N for random headings, "about 0.044" for 400 (`117`) : Computed. Page uses sqrt(pi/N)/2 = 0.0443 (Rayleigh mean); 20,000-sample MC gives 0.0447.
- [x] Boids fly at constant speed in a wrapping box with a small random wobble (`123`) : Computed. BV = 2, positions mod BW/BH, BNOISE 0.15 rad uniform.
- [x] Background runs: three runs of 1,500 steps, phi averaged over second half, default vs alignment 0 (`152`) : Computed. Code does exactly this (seeds 101-103). Node: 0.994 vs 0.050; browser prints 0.99 vs 0.08 (Chromium and node diverge in the chaotic trajectories; 20 other seeds give alignment-0 mean 0.070, range 0.042-0.111).
- [ ] "Separation and cohesion still gather the boids into clumps, but each clump churns in place" (`152`) : WRONG at the defaults. clump.cjs: with alignment 0 the mean neighbour count within 50 stays at 5.9-6.9, the same as the random start (5.5-6.1); with alignment 1 it rises to 31-35 and one cluster holds all 150. Mean neighbours within 25 after 750 steps: 1.7 (random 1.4). Clumping without alignment needs e.g. separation 0, cohesion 2, radius 100: 139-148 boids in one swarm with phi 0.06-0.09 (clump3.cjs).
- [?] "Many swarm robots gather this way. A common aggregation controller..." (`156`) : No source named or read; generalization about robotics practice. Reword as a statement about the rules, tied to the figure.
- [x] Small radius + Scatter: many small groups aligned inside, within-group phi well above global; groups merge and global creeps up (`160`) : Computed. Radius 10, 10 seeds: t=300 global 0.20 / within 0.97, 34.7 groups; t=1000 0.44 / 0.98; t=3000 0.80 / 0.99; t=6000 0.92, 3.3 groups. Radius 15 and 20 same pattern, faster.
- [x] Shrink radius without scattering: pieces keep their shared heading, global phi stays high (`160`) : Computed. Settle at 50 then radius 10 for 1,500 steps: global 0.99 -> 0.95 (0.92-0.97), 10.8 groups.
- [x] Vicsek 1995: constant speed, adopt average heading within distance 1 including itself, noise uniform in [-eta/2, eta/2] (`166`) : Sourced. Vicsek et al. eq. 2: "average direction of the velocities of particles (including particle i) being within a circle of radius r", Delta theta uniform on [-eta/2, eta/2], r = 1. Code matches (self at distance 0 is counted).
- [x] "Noise plays the role of temperature" (`166`) : Sourced. Vicsek: "noise which we shall use as a temperature-like variable".
- [x] At eta = 2 pi the new heading is completely random (`166`) : Derived. Uniform on [-pi, pi] added to any angle is uniform.
- [x] "Kept only alignment" (`166`) : Sourced. Vicsek: "The only rule of the model is ... assumes the average direction of motion".
- [x] Low noise: one hue, trace climbs toward 1; raise eta: trace sinks and swings; high noise: lies along dashed line (`193`) : Computed. Seed 55, v0 0.3, last 600 steps: eta 0.25 mean 0.986 sd 0.004; eta 1 0.893; eta 2 0.468 sd 0.124 (range 0.09-0.68); eta 6.28 0.045 (dashed line 0.044).
- [x] Sweep: 16 noise levels, fresh random start each, discard 400, average 600; error bars are within-run SD (`199`) : Computed. Code: ETAS 0.25..6.0 (16), TRANS 400, MEAS 600, sd = sqrt(E[f^2]-mean^2).
- [x] phi crosses 0.5 at eta ~ (live) (`212`) : Computed. 10 page-style sweeps: 1.96-2.21; 8-seed averaged curve crosses at 2.10. Browser runs printed 2.0-2.2.
- [x] "Fluctuations peak near that crossing" (`212`) : Computed. Within-run SD peaks at eta 2.17-2.55 (0.104, 0.111) around the 2.10 crossing.
- [x] "Vicsek's group reported a continuous one" (`216`) : Sourced. Abstract: "The transition is continuous since |v_a| is found to scale as (eta_c - eta)^beta with beta ~ 0.45."
- [x] Gregoire and Chate 2004 found it discontinuous (`216`) : Sourced. Abstract: "always discontinuous, including for the minimal model of Vicsek et al."; text: apparent continuity "due to strong finite-size effects".
- [x] Near threshold the ordered phase breaks into dense bands in a sparse disordered gas (`216`) : Sourced. GC2004: "In the ordered phase, the particles are organized in density waves moving steadily in a disordered 'vapour pressure' background" (Fig. 2, L = 1024, rho = 1/8).
- [?] "the bands appear only once the box is several times wider than a band" (`216`) : Not stated in GC2004. It shows bands in L = 1024 and says finite-size effects are strong. Reword to what the paper shows.
- [x] 20 x 20 box too small; curve is a rounded finite-size version (`216`) : Derived from the above (GC2004 system sizes 128-1024).
- [x] Frozen curve holds everything fixed except speed (`222`) : Computed. Same stepVicsek with v0 0.
- [x] Frozen best phi vs moving best (live) (`222`) : Computed. 10 page-style sweeps: frozen max 0.18-0.65, moving max 0.98-1.00; browser 0.18-0.47 vs 0.96-0.99. The comparison holds every time, but the frozen number varies a lot by run.
- [x] Speed zero, noise lowest, Randomize: patches of uniform colour that never agree (`222`) : Computed. frz.cjs, eta 0, v0 0, 600 steps: within-cluster phi 0.926-0.9999 (49-63 clusters), global 0.16-0.26.
- [x] Mean degree at density 1, radius 1 (live "3.2") (`226`) : Computed/Derived. 10 frozen configurations: 3.16; pi rho r^2 = 3.14.
- [x] Largest connected cluster (live "21%") (`226`) : Computed. Seeds 9001 + 7777t: mean 20.9%, range 15.8-36.7%.
- [x] Moving particles meet strangers and link everyone over time (`226`) : Computed. Time-aggregated contact graph at eta 2, v0 0.3: largest component 45 after 1 step, all 400 after 10 steps.
- [x] Mermin-Wagner: 2D static system aligning a continuous direction under noise cannot hold true long-range order; long-wavelength twists (`230`) : Sourced. Tu and Toner 1995: "the 2D XY model does not exhibit a long range ordered phase at temperatures T > 0 (due to spin wave fluctuations) ... in light of the Mermin-Wagner theorem".
- [x] Toner and Tu 1995: flocks escape this; motion carries heading information, ordered 2D flock in thermodynamic limit (`230`) : Sourced. Abstract: "our model exhibits a broken continuous symmetry even in d = 2"; text: convective term "further stabilizes the ordered phase ... two originally distant 'birds' can interact". Vicsek also notes v -> 0 is "an analog of the well known XY model".
- [ ] "the frozen curve shows the same principle at small scale" (`230`) : WRONG attribution. The frozen curve fails because its network is below percolation (21% giant cluster; the previous paragraph's own mechanism), not from spin-wave twists in a connected system.
- [x] Ballerini et al.: 3D reconstruction, six or seven nearest neighbours regardless of distance (`234`) : Sourced. Abstract: "each bird interacts on average with a fixed number of neighbours (six-seven), rather than with all neighbours within a fixed metric distance." Stereo photography is in the paper's methods (abstract says "3D positions"); not read beyond the abstract.
- [?] "A fixed-count rule keeps the neighbor network connected when the flock thins out" (`234`) : Stronger than the source. Ballerini: topological interaction gives "significantly higher cohesion" in simulations under density changes. Reword to their claim.
- [x] References line (`240`) : Sourced. Vicsek PRL 75, 1226 (1995); Toner and Tu PRL 75, 4326 (1995) (arXiv version titled "How birds fly together"); Gregoire and Chate PRL 92, 025702 (2004); Ballerini PNAS 105, 1232 (2008) (arXiv journal ref); Reynolds SIGGRAPH 1987.

### Figure 1 (boids)

- [x] "150 boids with separation, alignment and cohesion" (`147`) : Computed. BN 150; three force terms.
- [x] Group colouring by chains of neighbours within the vision radius (`147`) : Computed. measureBoids uses components(link = radius); ranks by size.
- [x] within-group phi = size-weighted average of group polarizations over groups of two or more (`147`) : Derived. sum |sum v| over groups / boids in groups = sum n_g phi_g / sum n_g.
- [x] Canvas aria-label "gray boids are loners" and the readout (`146`) : Computed. Loners are drawn #9ca3af; readout recomputed every 6 frames from the live state, no hardcoded values.

### Figure 2 (Vicsek)

- [x] 400 particles, 20 x 20 periodic box, density 1, radius 1 (`190`) : Computed. VN 400, VL 20, VR 1.
- [x] Trace plots phi every step; dashed line at random-heading level (`190`) : Computed. hist pushes stepVicsek return every step; dashed at PHI_RANDOM.
- [x] Colour by heading uses a fixed sinebow LUT (not rescaled) : Computed.
- [?] Trace axis labels drawn at 10px canvas font : below the 11px house minimum. Fix.

### Figure 3 (sweep)

- [x] Moving v0 0.3 and frozen v0 0, same density, radius and N (`208`) : Computed.
- [x] Vertical line at Figure 2's noise; clicking moves it there (`208`) : Computed in Chromium: click sets Figure 2's slider to the clicked eta and moves the line; slider input moves the line.
- [?] SVG text below 11px : d3 axis ticks rendered at 9.6px (1200) and 7.9px (390); "random headings" label overlapped the data at 390. Fix.

### Anti-slop pass

- Em dashes: none. No cards, badges or callouts. Headings plain. Closing paragraph is an argument, not a summary.

## 03 Traffic shockwaves

File: docs/emergence/03-traffic-shockwaves.html. Checked 2026-09-25. Scripts (scratchpad w03-04/): eng03.mjs (extracts the page's IDM and NaSch engines verbatim and replicates the Figure 1 readout estimator), t1.mjs (Fig 1 default run), t2.mjs (wave speed by page readout and by independent jam-front tracking, a = 0.5/0.8/1.0, N = 20..110), t3.mjs (Fig 2 tongue, dot checks, partial-derivative scaling, jam spacing), t4.mjs, t5.mjs, t6.mjs, t8b.mjs, t9.mjs (NaSch free flow, gaps, front and jam speeds, outflow, hysteresis), t10.mjs (Fig 3 caption and Fig 4 data); browser: pw.mjs (8-config sweep), figshots.mjs, click03.mjs. Sources read this session: Sugiyama et al. 2008 (NJP full text), Treiber, Hennecke, Helbing 2000 (arXiv cond-mat/0002177 full text), Wilson 2008 (full text, wpi.ac.at copy), Nagel and Schreckenberg 1992 (HAL full text), Barlovic et al. 1998 (arXiv abstract), Kerner and Rehborn 1996 (abstract text via search result only). render-check: PASS.

### Prose and equations

- [x] Sugiyama experiment: 22 cars, 230 m track, drivers asked for 30 km/h, Japanese group (`130`) : Sourced. Sugiyama et al. 2008 p.4: "The circumference is 230 m, and the number of vehicles is 22"; "requested to cruise at about 30 km h-1"; all affiliations in Japan (Nagoya, Osaka, Tokyo, Saga).
- [x] "Within minutes a cluster of stopped cars had formed and was drifting backwards" (`130`) : Sourced. Fig 3(b) caption "The snapshot 3 min later shows that a jam has been formed"; "vehicles inside the cluster of the jam stop completely"; "travels backward with a velocity of roughly 20 km h-1". Speed added to the page.
- [x] "Nothing on the track caused it" (`130`) : Sourced. Title and abstract: jam with no bottleneck.
- [x] IDM equation (`math-idm`, `140`) : Sourced. Treiber et al. 2000 Table I, acceleration exponent 4, s* = s0 + vT + v dv / (2 sqrt(ab)). Code matches, with the dynamic part of s* floored at 0 (a common variant, not stated; harmless).
- [x] v0 30 m/s, T 1.5 s, s0 2 m, 5 m cars, b 1.5 m/s^2 (`146`) : Computed. Match the IDM constants in code. (These are not Treiber 2000's values; the page did not claim they were.)
- [x] Evenly spaced cars at the balance speed are at equilibrium (`150`) : Computed. idmVeq bisection; N = 45 gives 10.08 m/s = 36 km/h (readout "uniform speed 36 km/h").
- [x] Fig 1 caption mechanics: about 30x real speed, a row every 2 s, nearest car behind, cross-correlation 40 s apart (`185`) : Computed. SIM_PER_SEC 30, ROW_EVERY 2, speedField, LAG 20 rows.
- [x] "the 1 m/s wobble at first shrinks" (`186`) : Computed. t1.mjs: speed spread 1.00 at t = 0, 0.24 m/s at 60 s, then grows.
- [ ] "then grows over several simulated minutes into a full stop-and-go wave" (`186`) : WRONG timescale. Spread passes 4 m/s (readout starts reporting) at about 480 s; jam cars reach a full stop at about 1400 to 1500 s (25 min). Under reduced motion the static state was t = 400 s, where speeds were 31 to 41 km/h and the readout said "no jam to measure", so the figure showed no jam at all.
- [x] Red bands tilt left; jam is always made of different cars (`191`) : Computed. Screenshot at t = 1600 s: bands run down-left; front tracking shows cars enter and leave.
- [x] Stretch between jams speeds up past equilibrium (`192`) : Computed. N = 45: fastest car 64 km/h vs uniform 36 km/h.
- [x] Stability criterion f_s <= f_v^2/2 + f_v f_dv (`math-stability`, `199`) : Sourced. Wilson 2008 eq. (3.8): instability iff (1/2)(D_v f)^2 - D_h f - D_hdot f D_v f < 0, with hdot the opening rate; the page's dv is the closing rate (f_dv = -D_hdot f), so the page's inequality is the same condition.
- [x] "if the gain at long wavelengths exceeds one, every follower amplifies" (`198`) : Derived. Wilson derives the condition from the ring dispersion relation at long wavelength; the gain framing is the equivalent headway-transfer statement. Left as is.
- [x] f_s and f_v scale like a, f_dv like sqrt(a); right side grows like a^(3/2) or faster (`203`) : Computed. t3.mjs at N = 45: f_v/a = -0.17813 and f_dv/sqrt(a) = -0.47460 for a = 0.4, 0.8, 1.6; f_s/a constant.
- [x] f_v and f_dv both negative (`203`) : Computed. Same run.
- [x] Fig 2: 120 x 80 grid; each dot its own ring for 15 min from uniform flow with one car 1 m/s slow; ring marks Fig 1; click moves it (`209`) : Computed. Code; click03.mjs: map click set N 75, a 1.50 and restarted Fig 1.
- [?] "Dots right at the edge can come out hollow" (`211`) : Partly. t3.mjs reruns all 88 checks: 79 agree with the criterion, no false positives; the 9 hollow-but-unstable dots are 25/0.6 (at the left edge) and eight at a = 1.0 to 1.2, near the tip, including 85/1.0 which is mid-band in density. Reworded "just inside the edge, especially near the tip".
- [x] Low density stable at any a (`215`) : Computed. Band lower edge 17, 20.75, 26, 30.25, 38 veh/km for a = 0.3, 0.5, 0.8, 1.0, 1.2.
- [ ] "At the highest densities the equilibrium speed is small and changes little with the gap" (implies stable) (`215`) : WRONG for a below 0.9. For a <= 0.85 the band runs to 141.75 veh/km (jam density 142.9); it closes at 140.5 for a = 0.9, 119.5 for a = 1.0. Derived limit at v -> 0, s -> s0: stable iff 2a^2 T^2/s0^2 > 2a/s0, i.e. a > s0/T^2 = 0.89 m/s^2 with these values. The figure itself shows the open right edge.
- [x] The band widens as drivers become more sluggish (`216`) : Computed (band edges above).
- [ ] "Standard highway values for the IDM put a near 1 m/s^2, close to the tip of the tongue" (`217`) : WRONG. Treiber et al. 2000 Table I: a = 0.73 m/s^2 (v0 120 km/h, T 1.6 s, b 1.67 m/s^2). Tongue tip is a = 1.26 with the page's parameters, 1.33 with Treiber's; a = 0.73 is unstable over 24.75 to 141.75 veh/km (page parameters), well inside.
- [?] "That is one reason the model fits real traffic well" (`218`) : Unverifiable. Cut.
- [x] Wave speed near -14 km/h at a = 0.8 (`221`) : Computed. t2.mjs after 3000 s: page readout -14.15 to -14.52 for N = 45, 60, 70 to 110; independent jam-front tracking -14.3 to -14.6.
- [x] Near -10 km/h at a = 0.5 (`221`) : Computed. Readout -10.21 to -10.40, front tracking -10.03 to -10.12, N = 35 to 110.
- [?] "Anywhere inside the unstable band ... about the same value" (`221`) : Partly. Holds once jam cars stop fully. Near band edges the wave does not stop cars and is slower: a = 0.8, N = 35: -10.5 (lo 10 km/h); N = 50: -11.7 after 3000 s; a = 1.0: -11.7 to -15.4, no full stops. Caveat added.
- [x] c_jam = -l/tau, l = 5 m + 2 m (`223`) : Computed. Stopped bumper spacing in a jam 6.94 m (t3.mjs).
- [x] Density independence (`227`) : Computed (the N sweep above).
- [x] tau about 1.8 s from -14 km/h (`228`) : Derived. 7 / (14/3.6) = 1.80 s; with the tracked -14.5, 1.74 s.
- [?] "loop detectors have tracked wide moving jams over tens of kilometres" (`231`) : Unverifiable as worded. Kerner and Rehborn 1996 abstract (via search result): jams kept their structure "for at least about 50 min", "the longest, 13.1 km, section". Reworded to 50 min over a 13 km stretch.
- [x] Downstream fronts travel upstream at about 15 km/h (`231`) : Sourced. Treiber et al. 2000 p.1: "isolated stop-and-go waves that propagate in the upstream direction with a characteristic velocity of about 15 km/h [23,16]" ([23] = Kerner and Rehborn 1996). Nagel and Schreckenberg 1992 §5 also quote about 15 km/h.
- [?] "roughly 10 to 20 km/h depending on the road and vehicle mix (Treiber and Kesting, 2013)" (`232`) : Unverifiable; book not read. Replaced with Sugiyama's roughly 20 km/h; Treiber-Kesting reference removed.
- [x] "an empirical regularity of human driving" (`233`) : Derived as framing; fine.
- [x] IDM deterministic; uniform flow is a fixed point (`237`) : Derived. makeRing with no slow car is an exact equilibrium to bisection precision; growth from 1e-15 would need about 35 e-folds (8000 s) at the measured rate.
- [x] NaSch four rules in parallel, integer speeds 0..vmax, one car per cell (`238`-`246`) : Sourced. Nagel and Schreckenberg 1992 §2 (acceleration, slowing down, randomization, car motion, "performed in parallel for all vehicles"). nsStep matches.
- [x] 7.5 m cell, 1 s tick (`248`) : Sourced. NaSch 1992 §5: "in a complete jam each car occupies about 7.5 m"; 4.5 sites per step = 120 km/h gives about 1 s per step.
- [x] vmax = 5 is 135 km/h (`248`) : Derived. 5 x 7.5 x 3.6.
- [x] Rule 3 is the only randomness (`249`) : Derived (rules).
- [x] Fig 3: 200 cells = 1.5 km, random start (`284`) : Derived / code.
- [x] At rho 0.15, p 0.25 jams appear and dissolve, drifting left (`286`) : Computed. A stopped car is present on 96% of ticks after warm-up (t10.mjs); jam pattern moves at -0.6 cells/tick.
- [x] At p = 0 the same density flows freely once the start sorts out (`287`) : Computed. 200/200 random starts reach all-cars-at-vmax, within 33 ticks.
- [x] Readout averages the last 100 ticks (`287`) : Code.
- [x] <v> = vmax - p in free flow, derivation (`294`) : Derived.
- [x] Single car 200,000 ticks gives 4.750 at p = 0.25 (`295`) : Computed. 4.7494 (SE about 0.001). Page now says 4.75.
- [x] Free-flow branch J = rho (vmax - p) (`296`) : Derived; computed 0.468 vs 0.475 at rho 0.10.
- [x] p = 0: vmax for rho < 1/(vmax+1); J = 1 - rho above (`298`) : Derived; computed J = 0.700 at rho 0.3 and 0.830/0.820 at 0.17/0.18.
- [x] From a random start at rho 0.3 gaps spread over 0 to 5 (`299`) : Computed. Gap histogram {0:29, 1:143, 2:186, 3:130, 4:65, 5:47}.
- [x] Jams at p = 0 are frozen leftovers (`300`) : Sourced/Computed. NaSch 1992: without randomness every configuration reaches a stationary pattern "shifted backwards ... one site per time step"; computed -1.000 cells/tick.
- [x] Front car waits 1/(1 - p) ticks (`302`) : Derived.
- [ ] "The front recedes at about 1 - p cells per tick ... -0.74 cells per tick at p = 0.25 and -0.48 at p = 0.5 ... -20 km/h" (`303`-`304`) : WRONG as the jam speed. These numbers reproduce only for the packed edge of a freshly placed 200-car block over its first 150 ticks (t4.mjs: -0.748, -0.490). Departing cars dawdle, the ones behind catch them and some stop again; the stopped region extends 150+ cells past that edge (t6.mjs). Steady jams on a 4000-cell ring, by cross-correlation of the smoothed stopped-car field: -0.59 to -0.55 cells/tick at p = 0.25 (lags 20 to 200) and -0.36 to -0.34 at p = 0.5; jam outflow 0.53 and 0.32 cars/tick (t5.mjs), consistent with NaSch 1992's own estimate (wave speed about the outflow, 0.3 at p = 0.5). -0.57 cells/tick = 4.3 m/s = -15 km/h, not -20.
- [x] Basic NaSch has no hysteresis: two starts differ by at most 0.006 (`307`) : Computed. 2000-cell ring, rho 0.10 to 0.18, p 0 and 0.25, homogeneous vs block start: max difference 0.0056.
- [x] Real motorways show metastable high flow; slow-to-start rule gives metastability (Barlovic et al. 1998) (`306`-`308`) : Sourced. Barlovic et al. abstract: "Measurements on real traffic have revealed the existence of metastable states with very high flow"; velocity-dependent randomization (slow-to-start) produces them.

### Figure 4 (fundamental diagrams)

- [x] Flow = density x mean speed, in cars per hour (`312`) : Derived; code units check (cars/tick x 3600; cells x 1000/7.5).
- [x] Caption mechanics: equilibrium by solving vdot = 0; rings a = 0.8, one car braked to a stop, 25 min, last 8 averaged; NaSch 400 cells, 1000 ticks after 500 (`318`) : Code (AVG 500 s = 8.3 min).
- [x] Shaded band is the a = 0.8 unstable range (`320`) : Computed. 26 to 135 on the axis (to 141.75 beyond it).
- [?] "Inside the unstable band, the IDM dots fall well below the equilibrium curve" (`324`) : Overstated. t10.mjs: 8 to 15% below across most of the band, 2% at 30 and 135 veh/km. Reworded to "about 10 to 15 percent below, less near the band's edges".
- [x] Outside the band the dots sit on the curve (`325`) : Computed. 0% difference at 5 to 25 veh/km.
- [x] Every p = 0.25 point sits below the p = 0 triangle; peak moves to lower density (`328`) : Computed. All 32 points below; peak 18.7 veh/km (1855 veh/h) vs 22.2 (3000 veh/h).
- [x] Dawdling slows free cars by p cells per tick (`329`) : Derived.
- [ ] "seeds jams that drain at only 1 - p cars per tick" (`329`) : WRONG. Measured outflow from a jam is 0.53 cars/tick at p = 0.25 (0.83 at p = 0), not 0.75.

### Rendering and anti-slop

- [ ] SVG text >= 11px : WRONG. 38 labels at 9.7px effective at 1200px (ticks font 10, labels 10 and 10.5), 40 at 8.5px at 390px (fixed 400-unit viewBox in a 308px column).
- Colour scales fixed: Fig 1 speed LUT 0 to 30 m/s fixed; Fig 3 palette fixed per vmax. No per-frame rescaling.
- Em dashes: none. No KPI cards or callouts. Readouts are one-line.
- Fig 2 map click is mouse-only, but Fig 1's sliders set the same state from the keyboard.

## 04 Coarsening and consensus

File: docs/emergence/04-coarsening-and-consensus.html. Checked 2026-09-25. Scripts (scratchpad w03-04/): eng04.mjs (extracts randomFill, sweepAsync, stepSync, frozenAsync, countOnes, unlikeBonds, sameGrid, deffuantInteract, deffuantClusters verbatim by brace matching), u1.mjs (sync freeze 200 runs; async 128x128 40 runs; Fig 2 exponent 60 runs), u2.mjs (Fig 3 outcomes, 1000 runs per bias at 32x32, 300 at 64x64, page's stepJob schedule and caps), u3.mjs (Fig 5 sweep, 100 runs per eps; Fig 4 readout at 200 meetings/person), u4.mjs (exponent by fit window); browser: pw.mjs, figshots.mjs. Sources read this session: Barros, Krapivsky, Redner 2009 (arXiv 0905.3521 full text and journal-ref), Spirin, Krapivsky, Redner 2001 (arXiv abstract), Deffuant, Neau, Amblard, Weisbuch "Mixing beliefs among interacting agents" (preprint full text), Fortunato 2004 (arXiv abstract), Allen and Cahn 1979 (bibliographic record and title via search). render-check: PASS.

### Prose and equations

- [x] Majority copying from a random 50/50 start snaps into patches within a few rounds (`192`) : Computed. L = 4.7 cells at t = 10 sweeps (u1.mjs run 0).
- [x] Domain width grows as sqrt(t) (`193`) : Computed, see Figure 2.
- [x] "about two runs in three end with one colour everywhere; the rest lock into straight bands" (`194`) : Sourced/Computed. Barros et al.: stripe probability 0.3388 for periodic boundaries; u2.mjs 32x32 at 50%: stripes 0.339 +- 0.015 (1000 runs); 128x128: 30/40 consensus.
- [x] Camp count predictable from the tolerance (`198`) : Computed, see Figure 5 (with the bound reading below).
- [x] Zero-temperature majority rule: random cell, 4 neighbours, 3-4 disagree switches, 2 on a coin flip, sweep = N picks (`204`-`208`) : Code. sweepAsync matches.
- [x] Synchronous 9-cell vote removes ties (`211`) : Derived (9 voters, odd).
- [x] Synchronous vote stops with domains a few cells across (`213`) : Computed. u1.mjs 200 runs: final L median 4.6.
- [?] "no cell on a surviving border is outvoted, and without ties nothing moves it" as the whole story (`214`) : Incomplete. 27/200 runs end in a period-2 blink, not a frozen state (the page's own status "frozen (blinking)"). Added a sentence.
- [x] Step cells face a 2-2 tie; steps wander and annihilate; curved borders retreat (`216`) : Derived. A corner cell on a staircase has 2 like and 2 unlike neighbours.
- [x] Fig 1: 128x128, wrap-around, 50/50 random start (`248`) : Code.
- [x] "The random-order rule usually ends in consensus after several thousand sweeps" (`248`) : Computed. 128x128, 40 runs: 30 consensus, median 3670 sweeps (p10 2250, p90 39600; the long tail is diagonal stripes, as Spirin et al. describe); 10 froze into stripes (median 9040).
- [?] "The synchronous vote freezes within about 20 to 30 steps" (`249`) : Slightly narrow. 200 runs: median 25, 5th to 95th percentile 20 to 36, max 51. Now "20 to 40".
- [x] "Playback stops when nothing can change" (`249`) : Code. frozenAsync checks every cell for 2+ opposite neighbours; sync checks a fixed point or 2-cycle.
- [x] Convex bulges retreat; straight horizontal/vertical borders cannot move (`252`-`256`) : Derived. A cell on a straight border has exactly 1 unlike neighbour.
- [x] L = cells / unlike neighbour pairs (`261`) : Code (unlikeBonds, N/b).
- [x] Border speed ~ curvature ~ 1/L, erase time ~ L^2, so L ~ t^(1/2) (`262`-`265`) : Derived.
- [x] Allen-Cahn law, reference Acta Metall. 27, 1085 (1979) (`265`, refs) : Sourced (bibliographic). "A microscopic theory for antiphase boundary motion and its application to antiphase domain coarsening", Acta Metall. 27(6) 1085-1095.
- [x] Fig 2 caption mechanics: 200x200, up to 2000 sweeps, log-log, dashed slope 1/2 pinned at t = 10, least-squares fit over 10 <= t <= 1000 (`286`) : Code.
- [x] "In repeated runs it lands between about 0.42 and 0.54" (`287`) : Computed. u1.mjs 60 runs: mean 0.476, sd 0.027, min 0.417, max 0.552, 5th to 95th percentile 0.438 to 0.527. u4.mjs by window (30 runs): 10-100 sweeps 0.465, 100-1000 0.483. Mean below 1/2 is a finite-time effect; caption now gives 0.42 to 0.55, mean 0.48.
- [x] "Beyond t = 1000 only a handful of domains remain" (`288`) : Computed. Median L at t = 1000 is 44 cells, about 4.5 domain widths across 200.
- [?] "the same law that governs grain growth in annealed metals" and "alloys and foams" (`266`, `292`) : Unverifiable this session (grain growth and foam coarsening have their own mechanisms; not read). Reworded to antiphase domains in ordered alloys (Allen and Cahn's case) and quenched magnets.
- [x] Adding thermal flips gives the Ising model, which coarsens the same way below Tc (`293`) : Sourced. Barros et al. abstract: zero-temperature quench of the Ising ferromagnet; "our approach generally applies to coarsening dynamics of non-conserved scalar fields in two dimensions". Link ../lattice-simulation/06-ising-z2-breaking.html exists.
- [x] Black and white win equally often from 50/50 (`301`) : Derived (symmetry); computed 0.341 / 0.320 at 32x32 (1000 runs, within noise).
- [x] Spirin, Krapivsky and Redner: a finite fraction freeze into stripes on the periodic square lattice (`301`-`303`) : Sourced. Abstract: "a frozen two-stripe state is apparently reached approximately 1/4 of the time"; PRE 63, 036118 (2001).
- [x] Barros, Krapivsky and Redner tied it to critical percolation crossing, about 0.34 (`303`-`305`) : Sourced. "the probability for periodic boundary conditions is 0.3388..."; PRE 80, 040101 (2009) (arXiv journal-ref).
- [x] Fig 3 caption: 40 runs (20 at 64), stop at consensus or frozen stripes, colour key, grey cap at sweep limit (`325`) : Code (trialsFor, capFor 8000/20000, check every 10 sweeps).
- [x] "At 50% the stripe fraction comes out near one third" (`329`) : Computed. 0.339 (32x32, 1000 runs); 0.39 +- 0.03 at 64x64 (300 runs).
- [x] "A two-point bias makes black the likely winner, and more so on the larger grid" (`329`) : Computed. 52%: black 0.56 (32) vs 0.72 (64).
- [x] "at 53% the 32-cell grid still gives white a few wins, while the 64-cell grid almost never does" (`330`) : Computed. White wins 0.094 (about 4 of 40) vs 0.027 (about 0.5 of 20).
- [x] Small excess over a bigger area is a more reliable majority (`333`-`335`) : Derived. Standard deviation of the initial fraction scales as 1/n.
- [x] Stripes thin out with bias (`336`) : Computed. 32x32: 0.339 -> 0.087 from 50% to 56%; 64x64: 0.39 -> 0.017.
- [x] Deffuant, Neau, Amblard and Weisbuch model: continuous opinions in [0,1], anyone meets anyone, threshold eps (`342`-`346`) : Sourced (preprint text: random pairs, adjust when closer than the threshold, uniform [0,1] start). Code: random pairs, strict |d| < eps.
- [?] "they move halfway toward each other" (`344`) : Ambiguous. Code moves both to the midpoint (mu = 0.5, the value Deffuant et al. use in their figures). Reworded "both move to the midpoint".
- [x] Large eps ends in a single consensus near the middle (`349`) : Computed. eps >= 0.375: 100/100 runs one major cluster, mean centre 0.497 to 0.504.
- [x] Small eps: clusters further apart than eps never interact, population freezes into camps (`350`) : Derived from the rule; computed convergence in all Fig 5 runs.
- [x] Fig 4: 300 people, uniform [0,1], meetings per person on x, clusters >= 5% ignored (`376`) : Code.
- [x] "Near the ends of the range a few people often end up in small outlying clusters" (`377`) : Computed/Sourced. All-cluster count exceeds major count at every eps from 0.05 to 0.475 (u3.mjs); Deffuant et al. report "wings" of a few percent near 0 and 1.
- [x] Fig 4 readout at default eps 0.15 (`stat-def-clusters`) : Computed. After 200 meetings per person: mean 2.92 major clusters (2 to 4), 1/(2 eps) = 3.3; 83% of runs converged by then.
- [x] Each cluster captures about eps either side, owns 2 eps, predicts about 1/(2 eps) (`380`-`382`) : Sourced. Deffuant et al.: "A rough evaluation of p_max based on a minimal distance of 2d between peaks ... plus a minimal distance of d of extreme peaks from 0 and 1 edges gives p_max = 1/(2d)". It is their bound on the maximum number of peaks.
- [?] "the estimate Weisbuch and colleagues gave" (`382`) : Unverifiable as attributed. Found in Deffuant et al. 2000 (Weisbuch a coauthor); Weisbuch et al. 2002 not read. Re-attributed to Deffuant and colleagues' original paper; Weisbuch 2002 reference removed.
- [x] Fig 5 caption: 300 people to convergence (gaps < 0.001 or wider than eps), five runs per eps, filled >= 5%, open all, dashed 1/(2 eps) (`392`) : Code. 0 of 1900 u3.mjs runs failed to converge.
- [ ] "The major-cluster count tracks 1/(2 eps) closely from about eps = 0.1 upward and falls a little short below that, where the clusters near the two ends absorb less than their share" (`396`-`398`) : WRONG. It is 10 to 15% short across the whole range to 0.2, not just below 0.1: mean majors 8.50 vs 10 (0.05), 4.37 vs 5 (0.1), 3.51 vs 4 (0.125), 2.95 vs 3.33 (0.15), 2.07 vs 2.5 (0.2), 1.91 vs 2 (0.25). Relative shortfall is no worse below 0.1 (15%) than at 0.1 to 0.15 (11 to 13%). Consistent with 1/(2 eps) being a maximum. The end-cluster explanation is untested.
- [x] "One major camp is typical once eps passes about 0.3" (`398`) : Computed. P(one major) 0.41 at 0.275, 0.84 at 0.30, 0.98 at 0.325.
- [x] "The open dots stay above the filled ones well past that point" (`399`) : Computed. Mean all-clusters 1.96 to 2.20 for eps 0.30 to 0.40, 1.57 at 0.425, 1.25 at 0.45, 1.02 at 0.50.
- [x] Fortunato: complete consensus only once eps exceeds 1/2 (`401`) : Sourced. Abstract: "the threshold value of eps above which all agents share the same opinion in the final configuration is 1/2, independently of the underlying social topology".
- [x] Closing contrast: majority stops only when every border is straight; bias makes that rarer; bounded confidence stops because clusters more than eps apart never interact (`407`-`412`) : Derived and computed above.

### Rendering and anti-slop

- [ ] SVG text >= 11px : WRONG. d3 axis ticks at 10px and legends at 10px in Figures 2, 3 and 5 (45 labels) at both widths.
- Colour scales fixed: grids are two fixed colours; Fig 3 colours fixed per theme; Fig 4 traces fixed. No rescaling.
- Readouts are plain inline label/value text (stat-row), not tiles. Em dashes: none. Section headings are numbered ("1. The rule, ..."), acceptable.
- Reduced motion: Figures 2, 4 compute the full run and show the final state; Figure 1 does not autoplay; Figures 3 and 5 compute progressively without animation. Animations pause when their figure leaves the screen.

## 05 Spin Glass

File: docs/emergence/05-spin-glass.html. Checked 2026-09-25. Scripts (scratchpad w05-06/): fig3.mjs (extracts the page's Section 3 code, buildEdges..quench, and runs it for 5 ferro and 200 random draws), anneal.c + runanneal.sh + agg.mjs (Figure 2: exact ground state of the 5x6 patch by Gray-code enumeration of all 2^29 configurations with one spin fixed, plus 400 anneals per sweep setting with the page's Metropolis rule and geometric T 5 -> 0.05, over 120 random bond draws), misc05.mjs (lattice counts, frustrated-triangle statistics, ferro valley structure, acceptance at T=5), pw.mjs (Playwright). render-check: PASS.

### Prose and equations

- [ ] "loops of odd length leave at least one pair unhappy" (`213`) : Derived. WRONG. A loop is frustrated when it holds an odd number of rival (antiferromagnetic) pairs, not when its length is odd; a triangle of three friend pairs is satisfiable. The page's own later sentence (`269`) states the correct rule.
- [x] Spin glass = random couplings, some aligning, some anti-aligning (`218`) : Sourced. Edwards and Anderson 1975, J. Phys. F 5, 965 (abstract read via ADS/IOP listing): interactions oscillate in sign, no mean ferro- or antiferromagnetism.
- [x] "on certain triangles no assignment satisfies every bond" (`219`) : Derived. Product of the three J negative -> at least one bond unsatisfied for all 8 spin states.
- [x] Frustration concept (Toulouse 1977 in references) : Sourced. Toulouse, Commun. Phys. 2, 115 (1977) introduced "frustration" for plaquettes with an odd number of antiferromagnetic bonds (search listing and Semantic Scholar record read).
- [x] Majority rule of essay 04 is this model at T=0 with all couplings ferromagnetic (`226`) : Derived. 04's code is zero-temperature random-order majority with ties by coin, i.e. zero-temperature Glauber dynamics of the ferromagnet.
- [x] "Frustration is a property of the bonds alone ... orange triangles stay orange" (`240`) : Computed/Derived. isFrustrated() reads only J; spin flips never change the set.
- [x] Frustrated iff odd number of AF bonds (`269`) : Derived. Same as product of J < 0.
- [x] Metropolis rule: accept downhill, uphill with exp(-dE/T) (`277`) : Computed. Code: dE <= 0 or rand < exp(-dE/T).
- [?] "High T accepts almost anything" (`279`) : Computed. At T = 5 from random spins, 79.3% of proposed flips are accepted (misc05.mjs, 200k proposals); "almost anything" overstates it. Reword with the number.
- [x] Schedule T = 5 to 0.05, slider sets sweeps (10 to 1000) (`284`) : Computed. Geometric T0*(T_END/T0)^progress; slider 10^1..10^3.
- [x] "Unsatisfying one extra bond costs 2 ... energies come in steps of 2" (`285`) : Derived. E = (#unsat - #sat) = 2*#unsat - 69.
- [x] 30-spin lattice (`286`) : Computed. 5x6 = 30 spins, 69 bonds, 40 triangles.
- [x] "a 10-sweep cooling leaves most runs one to four bonds above the lowest energy" (`286`) : Computed. 120 draws x 400 runs: median share of runs 1-4 bonds above the exact ground state 0.73 (p10 0.57); only 4.7% are 5+ bonds above; 23% reach the ground state.
- [ ] "A 1000-sweep cooling brings between half and nine tenths of runs down to that lowest energy" (`287`) : Computed. WRONG range. Share reaching the exact ground state: median 0.815, p10 0.475, p25 0.62, p90 0.98, min 0.26, max 1.00. Many draws exceed nine tenths and one in ten falls under half.
- [x] "runs that tie at the lowest energy usually sit in different configurations" (`289`) : Computed. Probability that two ground-state runs share a configuration (mod global flip): median 0.11 over draws; true except in the ~8% of draws with a unique ground state.
- [ ] "shared by anywhere from a handful to several dozen distinct configurations" (`291`) : Computed. WRONG range. Ground-state degeneracy mod global flip over 120 draws: median 9, p10 2, p90 44, p95 69, max 545; about one draw in ten has a single ground state, one in ten more than forty.
- [x] 20-spin patch has 2^20 about a million configurations (`346`) : Derived. 1,048,576.
- [x] Valley definition and zero-temperature quench always ends in a valley (`347`-`351`) : Computed. Quench accepts strictly lower flips only, so it stops at a stuck configuration; comp[] assigns every stuck configuration a valley.
- [?] "A zero-temperature quench, which is the majority rule again" (`349`) : Derived. Almost: the quench never takes zero-cost flips, whereas 04's majority rule flips ties by coin. Reword to name the difference.
- [x] All-ferro: 37 valleys (`360`) : Computed. fig3.mjs: 37 in 5/5 runs (deterministic).
- [x] All-ferro lowest valley catches "a little under half" (`356`) : Computed. 42.6% to 45.8% of 2000 quenches in 5 runs.
- [x] Other ferro valleys are walls running edge to edge (`358`) : Computed. All 192 stuck ferro configurations have 1-3 domains (2 all-aligned, 104 two-domain, 86 three-domain) and every domain touches the patch edge (misc05.mjs).
- [ ] "valley count rises from 37 to somewhere between about 40 and 150" (`360`) : Computed. Over 200 draws: min 24, p5 37, p25 59, median 75, p75 94, p95 134, max 186. The count does not always rise (5%+ of draws have 37 or fewer), and the upper end is lower.
- [x] "The lowest energy is sometimes shared by several valleys" (`361`) : Computed. 54.5% of draws have more than one ground valley (max 6). "Sometimes" undersells it; now "in about half the draws".
- [ ] "share of quenches that reach it falls to between about one in fifteen and one in four" (`362`) : Computed. Median 0.14 (one in seven), p5 0.042, p95 0.29, min 0.027, max 0.372. The stated range covers only about the middle 80% and misplaces both ends.
- [x] "more valleys for a greedy descent to stop in" (`407`) : Computed. Median 75 vs 37.
- [x] "lowest valleys are no longer related by a simple symmetry" (`408`) : Derived. With random J the only symmetry is the global flip, which the page already merges.
- [x] Planar lattice, no field: ground state in polynomial time by matching (`409`) : Sourced. Mertens, "Computational complexity for physicists" (arXiv cond-mat/0012185, HTML read): planar Ising reduces to minimum weight matching, solvable in polynomial time; the 4x5 and 5x6 open patches are planar.
- [x] Barahona 1982: field or 3D makes it NP-hard (`411`) : Sourced. Barahona, J. Phys. A 15, 3241 (1982), abstract via Semantic Scholar/scite listing: NP-hard "both in the two-dimensional case within a magnetic field, and in the three-dimensional cases".
- [?] "Parisi shared the 2021 Nobel Prize in part for solving the mean-field spin glass ... hierarchy of states" (`416`) : Sourced partly. Physics World and nobelprize listing: half the prize to Parisi "for the discovery of the interplay of disorder and fluctuations in physical systems from atomic to planetary scales" (the other half to Manabe and Hasselmann). RSB solution of the SK model: Charbonneau, arXiv 2211.01802 abstract. Hierarchical (ultrametric) organization of states: Mezard, Parisi, Sourlas, Toulouse, Virasoro, PRL 52, 1156 (1984) abstract. The page gave no citation or quote; reword with the citation and attribute the hierarchy.
- [x] Applications to neural network memory (`418`) : Sourced. Amit, Gutfreund, Sompolinsky, PRL 55, 1530 (1985): Hopfield model analysed as a spin glass, capacity alpha_c ~ 0.14.
- [x] Error-correcting codes : Sourced. Sourlas, Nature 339, 693 (1989): spin-glass models as error-correcting codes. (Sourlas used spin-glass mapping rather than "replica methods" specifically; now worded "the same ideas".)
- [x] TSP : Sourced. Mezard and Parisi, J. Physique 47, 1285 (1986), "A replica analysis of the travelling salesman problem".
- [x] Kirkpatrick et al. 1983 reference (annealing) : Sourced. Science 220, 671, abstract/listing read.

### Figure 1 (spins and bonds)

- [x] 30 spins, 40% antiferromagnetic bonds (`aria`, code) : Computed. 69 bonds, P(AF) = 0.4.
- [x] Readouts compute energy, satisfied bonds, frustrated triangles live (`246`-`258`) : Computed. updateStats from the model; mean frustrated count 19.85 of 40 (expected 0.496 x 40), p5-p95 15-25.
- [x] Caption: green satisfied, red not, orange frustrated (`265`) : Computed. bondEnergy < 0 green; isFrustrated polygons.
- [ ] Spin glyph text 9px at 390px width (`646`) : Computed (Playwright). SVG text under 11px on phones.

### Figure 2 (annealing)

- [x] Each coloured line is one run; dashed grey is T(t) on its own axis (caption) : Computed. Trace pushes energy per sample; temp path on right axis.
- [x] Run chips recall final state (caption) : Computed (Playwright click restores finalSpins).
- [x] Y axis rescales to all runs, not per frame : Computed. Domain from all traces, labelled axis; no colour scale involved.
- [?] Reduced motion: anneal animates regardless (prefersReducedMotion computed but unused) : Computed. House rule wants final state.

### Figure 3 (landscape)

- [x] "Every valley of a 4x5 triangular patch with open edges, found by exhaustive enumeration" (`394`) : Computed. enumerate() loops all 2^20 masks, 43 bonds.
- [x] Horizontal = energy above lowest; vertical = share of 2000 quenches, log scale (`395`) : Computed. x(v.energy - Emin), scaleLog.
- [x] Orange = lowest valleys; configuration and its global flip counted once (`398`) : Computed. mirror pairing via comp[rep ^ (M-1)].
- [x] Hover/tap shows one configuration with unsatisfied bonds heavy red (`399`) : Computed (Playwright hover; mini readout "E = ...").
- [ ] "never reached" label 9px (`1347`) : Computed. Under 11px.
- Also found: the ResizeObserver on the whole figure redrew the chart whenever the hover preview changed the figure height, replacing the hovered dot (Playwright could not hover a dot). Fixed, not a claim.

### Anti-slop pass

- No em dashes. Stat rows are one-line readouts, not cards. Run chips are controls, not badges. No closing summary (the Parisi paragraph is context, not a recap).

## 06 Percolation

File: docs/emergence/06-percolation.html. Checked 2026-09-25. Scripts (scratchpad w05-06/): perc.mjs (extracts the page's model code for Fig 1 fireStep, Fig 2 runTrial, Fig 5 outbreak/tValues and Fig 6/7 burn/step plus the page's histogram fit, runs them headless; Fig 3/4 cluster labelling reimplemented with the same union-find rule), fig4.mjs (log-binned cluster sizes per density), fire2.mjs + cand.sh (Fig 1 after the rule fix, preset tuning), grassberger2002.txt (text of Grassberger 2002 extracted with pypdf), pw.mjs, figshot.mjs (Playwright). render-check: PASS.

### Prose and equations

- [x] Subtitle and intro: at full ignition sparse forests stop, dense ones burn, sharp change at a critical density (`123`-`124`) : Computed. Center ignition on 150x150, 40 forests each: mean burned 0.1% at 40%, 29% at 59%, 78% at 63%, 99.3% at 75%.
- [ ] "Ignition probability is the chance that a burning cell lights each adjacent tree on a given step" (`130`) : Computed. WRONG as a description of the code. With ignition < 100% a burning cell stayed burning until it lit at least one neighbor, then turned to ash (`723`), so retries were unlimited and neighbors beyond the first lost their chance. Consequence: at density 70% ignition 50% still burned 55% of trees, and the model was neither site nor site-bond percolation.
- [x] Wind raises downwind, lowers upwind (`131`) : Computed. windFactor 1+s downwind, 1-s upwind, 1 crosswind, clamped to [0,1].
- [?] "The presets set all three knobs at once" with names Dry & calm / Damp / Windy drought (`132`, presets `860`-`862`) : Computed. The presets did not show what their names imply: Dry & calm (55%, 100%) is below threshold and burns 2% from the center; Windy drought (45%, 85%, E 0.8) burns 0.1%; Damp (70%, 35%) under the old rule 5%. Nothing on the page tells the reader what to expect from them.
- [x] Fig 1 caption: 40% burns a small cluster, 75% consumes most of the grid, dividing line near 59% (`215`-`217`) : Computed. 40%: median 0.0%; 75%: 99.3%; at 59% 57-62% of center fires pass 20% of trees, at 57% 5-13%, at 61% 80%.
- [x] Fig 2 method: random forests, ignite left edge, average fraction burned (`224`) : Computed. runTrial BFS from every left-edge tree.
- [x] "S-curve ... shooting up at p_c ~ 0.5927" (`225`) : Computed. 400 trials per density on 100x100: 0.061 at 0.50, 0.133 at 0.55, 0.458 at 0.59, 0.718 at 0.61, 0.871 at 0.63, 0.977 at 0.70; bisection with 1500 trials puts the 50% crossing at 0.5932.
- [x] Site square p_c ~ 0.5927 (`225`, `303`, KaTeX spans) : Sourced. Newman and Ziff, PRL 85, 4104 (2000): p_c = 0.59274621(13) (PubMed/ADS abstract).
- [?] Fig 2 caption "Each point averages several trials" (`244`) : Computed. Default 15, slider 5-40; the sweep also plotted duplicate points at 0.45, 0.55 and 0.65 because the float grid's indexOf dedupe failed (density list has 32 entries with 3 duplicates).
- [x] Connectivity: 4-neighbour clusters (`252`) : Computed. Union with left and upper neighbours only, i.e. von Neumann adjacency.
- [x] "Below the threshold all clusters are small. Above it, one giant cluster spans the grid" (`254`) : Computed. 150x150, 200 samples: P(left-right span) 0.000 at 55%, 0.025 at 57%, 0.37 at 59%, 0.51 at 0.5927, 0.92 at 61%, 1.00 at 63%; largest cluster 4.4% of sites at 55% vs 55% at 63%.
- [x] "At the critical point clusters of all sizes exist" (`255`) : Computed. At 59% sizes from 1 to about 2,000-3,000 in one forest.
- [ ] "At the critical point the counts fall on a straight line on log-log axes" (`286`, Fig 4) : Computed. Not what Figure 4 showed. It plotted raw counts per integer size from one forest: at 59%, 53-62 distinct sizes of which 27-37 have count 1, forming a flat floor; the all-points log-log slope is -0.57. The power law is only visible with binning: doubling bins give slope about -1.75 at 59% (100 forests), nearly straight (small bins -1.78, large -1.62).
- [x] "away from it the line bends" (`287`) : Computed (binned). At 45%: slope -1.52 for sizes 1-15, -2.95 beyond; at 50%: -1.55 vs -2.34. Above threshold (70%) few finite clusters remain (large-size bins present in 26 of 100 forests).
- [x] Power laws at the critical point signal a continuous transition (`288`) : Derived/standard; kept as stated.
- [x] Threshold depends on lattice and site vs bond, not on what percolates (`300`) : Sourced. Sykes and Essam 1964 (thresholds differ by lattice: triangular bond 2 sin(pi/18), square 1/2, honeycomb 1 - 2 sin(pi/18)).
- [?] "coffee seeping through grounds, and the conductivity of random resistor networks" (`301`) : Unverifiable as stated, no source on the page; cut in favour of the lattice-independence of exponents, which is sourced.
- [x] Site triangular = 1/2 exactly (`304`) : Sourced. Sykes and Essam, J. Math. Phys. 5, 1117 (1964) (search listing).
- [x] Bond square = 1/2 exactly (Kesten, 1980) (`305`, `332`) : Sourced. Kesten, Commun. Math. Phys. 74, 41 (1980), title states the result (Springer/Project Euclid).
- [x] SIR setup: one infectious step, each susceptible neighbour infected with probability T, then immune (`311`-`315`) : Computed. outbreak(): each infected site processed once, tries each susceptible neighbour once.
- [x] "Each pair of neighbors gets exactly one chance ... coins could be flipped in advance ... final size is one bond-percolation cluster" (`320`-`325`) : Derived from the code: an edge is tried only when one end is processed and the other still susceptible, never again.
- [?] "a mapping Grassberger made precise in 1983" (`326`) : Sourced partly. Grassberger, Math. Biosci. 63, 157 (1983) abstract: stationary properties of the general epidemic process are those of percolation (full text is a scanned image, unreadable here). Newman, PRE 66, 016128 (2002) (HTML read): "This correspondence appears first to have been pointed out by Grassberger for the case of the simple SIR model with fixed probabilities of infection and times of infectiveness." "Made precise" overstates; reworded to "first pointed out".
- [x] Epidemic threshold = bond threshold 1/2 on the square lattice (`332`) : Derived + Sourced (Kesten).
- [x] Below 1/2 outbreaks stay local; above, die early or reach a finite fraction (`332`-`335`) : Computed. L=100: P(outbreak > 10%) 0.01 at T=0.45, 0.96 at T=0.6, big-band mean 0.94 at T=0.6.
- [x] Geometry-free estimate 3T = 1 (`336`) : Derived. Branching with z-1 = 3 new contacts, the Bethe-lattice threshold 1/(z-1).
- [x] "the lattice needs more, because a spreading infection keeps running into people its own earlier cases already reached" (`338`) : Derived (loops reduce new contacts); consistent with 1/2 > 1/3.
- [x] Fig 5 caption "Above 1/2 the dots split into two bands" (`370`) : Computed. L=100: at T=0.55 small-band max 0.003 vs big-band min 0.667; at T=0.6 0.001 vs 0.914. Overlap only at 0.50-0.52.
- [x] "On a larger lattice the rise at 1/2 gets sharper" (`371`) : Computed. Mean outbreak at T=0.45: 0.085 / 0.016 / 0.003 for L = 40 / 100 / 250; at T=0.55: 0.72 / 0.75 / 0.79.
- [x] Drossel-Schwabl rules: growth p on empty, lightning f on trees, whole cluster burns in one step (`384`-`388`) : Computed. step() and burn(); matches Drossel and Schwabl 1992 as described in Grassberger 2002 introduction.
- [ ] "The forest thickens toward the connectivity threshold until a single spark clears a big cluster" (`393`) : Computed + Sourced. WRONG for this grid and for all simulations to date. Mean density after warm-up: 0.366 (small preset), 0.387 (critical), 0.42 (large), versus p_c = 0.593. Grassberger, New J. Phys. 4, 17 (2002) (full text read): previous simulations gave rho ~ 0.408; his runs to theta = 256,000 on lattices up to 65,536 give 0.3976 at theta = 1000 rising to 0.4093 at 128,000; he conjectures the limit is p_c but says it is far out of reach. The steady state is "composed of large patches of roughly uniform density, most of which are either far below or far above the critical density".
- [?] "The system hovers near criticality with nobody tuning it" (`394`) : Sourced. Grassberger 2002: scaling laws seen earlier "are spurious"; whether the limit is critical is open. Reword to fires of all sizes from patchiness, criticality contested.
- [x] Fig 6 caption "Density climbs between fires and crashes when a big cluster ignites" (`451`) : Computed. Largest fires remove up to 30% (critical) and 80% (large preset) of cells in one step.
- [?] "small-fire preset ... fires keep the forest thin and patchy" (`457`) : Computed. Density 0.366 vs 0.387 critical: barely thinner. What distinguishes it is fire size (largest about 2,000 trees in 18,000 steps vs about 3,000-3,700). Reword.
- [x] "large-fire preset ... forest grows dense and the occasional strike clears most of the grid" (`458`) : Computed. Largest fires 8,037-8,402 trees on 10,000 cells in 6 five-minute runs.
- [?] "In the critical preset fire sizes stretch across every scale the grid can hold" (`459`) : Computed. From 1 to about 3,000-3,700 trees, a third of the grid. Reword.
- [x] Fig 7 method: log bins divided by number of integer sizes, fit bins with at least three fires (`466`, caption) : Computed. updateHist code reproduced in perc.mjs.
- [x] "critical preset settles between about 1.1 and 1.3" (`470`) : Computed. Page fit after 600 / 3,600 / 18,000 steps (6 runs): 1.01-1.15 / 1.13-1.20 / 1.20-1.28.
- [?] "Runs on far larger grids give estimates that drift with grid size" (`471`) : Sourced, but the page's symbol clashed with the literature. Grassberger 2002: P(s) ~ s^(1-tau) with tau ~ 2.15-2.19, i.e. the page's slope is tau - 1 ~ 1.19, and effective values drift with theta (lightning rarity), not just grid size. Needs the notation note and the correct driver.
- [x] "a different power law from the earlier one" (`472`) : Derived. Fire sizes vs static cluster counts at fixed density.
- [ ] "slow accumulation and fast release drive the system to that edge [p_c] and hold it there" (`491`) : Computed + Sourced. WRONG (see `393`): density stays near 0.39-0.42.
- [x] References Broadbent-Hammersley 1957, Drossel-Schwabl 1992 (`500`) : Sourced via Grassberger 2002 reference list and standard citation; Kesten, Grassberger 1983, Newman-Ziff as above.

### Figure 2

- [x] Draggable line sets density of Figures 1 and 3; arrow keys nudge 1% (`1093`-`1124`) : Computed (Playwright drag and ArrowRight).
- [x] Dashed line at p_c (label "pc ~ 0.593") : Computed. PC = 0.5927.

### Figure 4

- [ ] y-axis ticks formatted '~s' and raw per-size counts (`1518`-`1521`) : see `286` entry; replaced.

### Figures 1, 5, 6 (controls)

- [?] Clicking a tree sets it alight but nothing happens until Play is pressed (`igniteCell`) : Computed (Playwright). Caption implies it spreads. Also reduced motion still animated the fire at 200 ms per step.
- d3 axis tick labels are 10px (d3 default) in Figures 2, 4, 5, 7: below the 11px house minimum.

### Anti-slop pass

- No em dashes. Stats rows are one-line readouts. The last paragraph before the footer restated the Drossel-Schwabl claim as a summary; rewritten to a correct bridge to the sandpile essay.

## 07 Sandpile

File: docs/emergence/07-sandpile.html. Checked 2026-09-25. Scripts (scratchpad w07-08/): s07a.mjs (Fig 1/2 model, copied BFS relaxation and the page's binning and fit, 100- and 60-wide, 700k grains), s07b.mjs (page's relax() and identity compute on 48), s07c.mjs (extracts Section 4 functions from the HTML and runs 10 spectra), s07d.mjs (cascade onset), s07e.mjs (identity at 24/48/96/192), pw.mjs (Playwright sweep), pw07b.mjs (default-state readouts). Sources read as PDFs/abstracts this session (pypdf text extraction). render-check: PASS.

### Prose and equations

- [x] BTW 1987 grid model reaches a critical state with no parameter to tune (`117`) : Sourced. BTW abstract (PRL 59, 381): "dynamical systems with spatial degrees of freedom naturally evolve into a self-organized critical point."
- [x] Toppling rule: 0-3 stable, topple at 4, one grain to each neighbor, lost at edges (`124`) : Derived. Matches dropAndRelax (grid -= 4, mass-- at edges).
- [x] "Early drops do nothing; cascades begin once most cells hold 2 or 3" (`128`) : Computed. s07d: first toppling at grain 2,400 (mean h 0.24); mean avalanche size 0.07 at h 1.0, 3.9 at h 1.98 (69% of cells >= 2), 129 at h 2.11 (75%).
- [x] "roughly 21,000 grains, an average of 2.1 per cell, before the pile stops filling up" (`128`) : Computed. s07a: mean height 2.065 at 21,000, 2.118 at 23,000, stationary 2.111 thereafter.
- [x] Skip drops 30,000 grains (`129`) : Computed (code).
- [x] Abelian: final state independent of drop order; commutativity gives the group (`165`) : Sourced/Derived. Dhar 1990 (PRL 64, 1613, abstract read); Meester/Redig/Znamenski-style intro "The Abelian sandpile; a mathematical introduction" (arXiv cond-mat/0301481) Prop. 3.1: addition operators on recurrent configurations form an abelian group.
- [x] "most drops trigger nothing, occasionally one sets off a chain involving thousands of cells" (`171`) : Computed. s07d: 57% of stationary drops topple nothing; largest per 2,000-grain window 18k to 45k topplings.
- [x] P(s) ~ s^-tau, no typical size (`175`, `179`) : Sourced (all four exponent papers below).
- [x] "fit on this grid settles near tau ~ 1.1" (`202`) : Computed. s07a (100-wide, page window 10-3000): 1.096 at 29.5k recorded avalanches, 1.087 at 200k. Browser: 1.08 after the autofill, 1.08 after 20 s auto-drop at speed 50.
- [x] Manna 1991 about 1.22 (`203`) : Sourced, secondary. Lin and Hu, arXiv cond-mat/0204243: "Manna [20] used Monte Carlo simulations to calculate tau=1.22 ... for the BTW model on the square lattice", [20] = Physica A 179, 249 (1991). Primary not accessible (ScienceDirect 403).
- [x] Priezzhev, Ktitarev, Ivashkevich 1996 argued for 6/5 (`204`) : Sourced. Ivashkevich and Priezzhev review (arXiv cond-mat/9801182, Sec. IV): tau_V = (2+2y)/(2+y) for total topplings, with y = 1/2 from ref [30] = PRL 76, 2093 (1996), giving 6/5. A conjecture from scaling arguments, "argued" is right.
- [x] Luebeck and Usadel 1.29 on grids thousands wide (`204`) : Sourced. arXiv cond-mat/9702059 (PRE 55, 4095): tau_s,inf = 1.293 +- 0.009, L up to 4096; also tau_s(L) = tau_inf - const/ln L.
- [x] Tebaldi, De Menech, Stella: toppling statistics multifractal, no simple FSS (`207`) : Sourced. arXiv cond-mat/9903270 abstract: areas obey FSS, "toppling numbers ... characterized by a full, nonlinear multifractal spectrum." The page fits toppling numbers.
- [ ] "about 1.1 on a 100-wide grid and about 1.2 on a 60-wide one" (`209`) : WRONG for 60. s07a: 60-wide 1.152-1.156 (29.5k to 200k avalanches), rounds to 1.15, not 1.2. 100-wide 1.09.
- [x] Recurrent configurations form a group; identity unique (`214`) : Sourced (cond-mat/0301481 Prop. 3.1).
- [x] Identity = (6 - 6°)°, two relaxations; adding it returns the other summand (`218`) : Computed. s07b on 48: e+e relaxes to e; e + r = r for 20 random recurrent r; 0 + e != 0 (0 not recurrent), as expected.
- [?] "mostly 2s and 3s, cut through by nested regions of 0s and 1s at many scales" (`218`) : Partly. s07b: 0s 9.5%, 1s 5.6%, 2s 34%, 3s 51% (85% 2s and 3s). On 48 the 0s/1s form thin lines round one central 20x20 square of 2s; "nested at many scales" is not visible at this size.
- [x] Caption: "four-fold symmetry of the square" (`233`) : Computed. Full D4 symmetry (rotations and reflections) holds exactly.
- [?] Caption: "nested, self-similar regions" (`234`) : Unverifiable at 48: one patch of 2s (s07e). Self-similar patches only appear on bigger grids.
- [x] "Larger grids add finer levels of nested detail" (`240`) : Computed. s07e: connected patches of 2s with >= 9 cells: 1 at 48, 5 at 96, 37 at 192 in 4 size classes.
- [?] "circular boundaries produce circular identities, and triangular ones triangular" (`241`) : Unverifiable; no source found this session (searches found Penrose/fractal-lattice identities, nothing on disc or triangle domains). Cut.
- [x] BTW introduced SOC as an explanation of 1/f noise (`247`) : Sourced. BTW abstract: "Flicker noise, or 1/f noise, can be identified with the dynamics of the critical state."
- [?] 1/f "turns up in resistors, river levels and starlight" (`248`) : Partly. Bak, How Nature Works (1996, archive.org text): "observed in systems as diverse as the flow of the river Nile, light from quasars ... and highway traffic". Resistors not in anything read this session. Replaced with Bak's list.
- [x] Size per grain: little memory, flat like white noise (`253`) : Computed. s07c, 10 runs: slope over 0.01-0.5 = +0.016 (range -0.01 to +0.05). Browser default +0.04.
- [ ] "apart from a slight rise at the lowest frequencies" (`256`) : WRONG direction. s07c: below 0.01 cycles/grain the power falls (slope +0.52, range +0.41 to +0.85; lowest bin 7.2e4 vs 2.9e5 plateau). It is a dip, which is what the stated mechanism (a big avalanche quiets later drops, anticorrelation) predicts.
- [x] JCF 1989 showed the flow falls as 1/f^2 (`264`) : Sourced. PRB 40, 7425 abstract: "the flow of sand down the slope ... has a 1/f^2 power spectrum in one and two dimensions." Mechanism (lifetimes to spectrum) also from abstract.
- [x] Laurson, Alava, Zapperi 2005: exponent below 2, equal to size-duration exponent (`267`) : Sourced. arXiv cond-mat/0509401 abstract ("significantly smaller than 2 and equals the scaling exponent relating the avalanche size to its duration"); text: alpha = 1.59 +- 0.05 for 2D BTW. Page said "somewhat"; now "significantly", with 1.59.
- [x] "On the 60-wide pile below the fitted slope comes out near -1.6" (`269`) : Computed. s07c: -1.614 (range -1.64 to -1.57); browser -1.58 to -1.62. Matches Laurson's 1.59.
- [x] "flattens out at the lowest frequencies" (`269`) : Computed. s07c: slope below 0.002 cycles/step -0.06 (range -0.21 to +0.17).
- [x] "Neither signal is 1/f" (`271`) : Computed (0.0 and -1.6).
- [x] Bak argued earthquakes, market crashes, extinctions follow sandpile-like laws; SOC is how nature works (`314`) : Sourced. How Nature Works text: earthquakes (190 mentions), extinction (105), crashes of 1929/1987, chapter "Real Economics Is Like Sand".
- [?] Bak argued the same for "forest fires" (`314`) : Unverifiable. "forest fire" does not occur in the book text. Removed.
- [x] Stationary mean height 17/8 on the infinite lattice (brief item; not on page before, added) : Sourced. Caracciolo and Sportiello (arXiv 1207.6074): <rho> = 17/8 for heights 0..3 (25/8 for 1..4); conjectured by Grassberger, proved in 2011 (Poghosyan, Priezzhev, Ruelle J. Stat. Mech. P10004; Kenyon and Wilson). Priezzhev 1994 computed the height probabilities. Finite grids sit lower: 2.111 (100), 2.102 (60) in s07a.

### Figure 1 (pile)

- [x] Caption: shading 0 lightest to 3 darkest; click drops where clicked; auto-drop random sites (`158`) : Computed (COLORS ramp, click handler, Math.random sites). Fixed four-colour map, not rescaled.
- [x] aria: Enter drops at the centre (`131`) : Computed (keydown handler; exercised in pw.mjs).
- [x] Mean height readout is mass/N^2 (`152`) : Computed. mass tracks drops minus edge losses; matches s07a.

### Figure 2 (histogram)

- [x] Density per log bin divided by bin width, so slope estimates -tau (`190`) : Derived. density = count / (integers in bin x total).
- [x] Fit over 10 to 3,000; edges excluded; red dashed (`192`) : Computed (FIT_LO/HI, count >= 5).
- [x] Recording starts at mean height 2.05, stationary about 2.11 (`195`) : Computed. s07a: recording starts at grain 20,834; stationary 2.111.
- [x] Pile fills itself if the reader arrives without driving Fig 1 : Computed. Browser: 50,000 drops, 12,816 recorded avalanches, tau 1.08.

### Figure 3 (identity)

- [x] 48x48 identity computed at runtime by (6 - 6°)° (`232`) : Computed (compute() on load; s07b reproduces it).
- [x] "Current pile" toggle shows Fig 1's pile (downsampled to 48 by nearest cell) : Computed (browser, both buttons).

### Figure 4 (spectra)

- [x] Fresh 60x60 pile, 10,800 unrecorded grains, 16,384 recorded, 8,000 parallel-update grains (`303`) : Computed (code: 3*M*M, N_DROPS, N_ACT_DROPS).
- [ ] "one quiet step between avalanches" (`306`) : WRONG. One zero is pushed per grain, including grains that topple nothing: s07c run had 8,000 zeros in 3,422 runs of quiet steps.
- [x] Segment-averaged, log-binned, fit over the range it spans; guides 0, -1, -2 (`307`) : Computed (spectrum(), fitSlope(), guide lines).

### Anti-slop and house rules

- Em dashes: none. No callout boxes or metric grids (stats rows are one-line readouts).
- d3 axis tick text was 10px and the flat/1/f guide labels 0.65rem (10.4px): below 11px on every config (pw.mjs pre-fix: 24-28 small text nodes per config). Fixed.
- Reduced motion: nothing animates unless the reader presses Auto-drop, and the loop stops off screen.

## 08 Laplacian Growth

File: docs/emergence/08-laplacian-growth.html. Checked 2026-09-25. Scripts (scratchpad w07-08/): s08a.mjs and s08b.mjs (extract the shared DLA utilities, DimTracker, strahlerCounts and fitRb from the HTML; grow Fig 1 clusters x40 and Fig 2 clusters at p = 1, 0.3, 0.05, 0.01), s08g.mjs (Fig 1 overlay vs 300,000 Monte Carlo walkers), s08c.mjs and s08d.mjs (extract the DBM constructor; eta sweep, relaxation-convergence test, 217x163 and 100x75 grids), s08e.mjs, s08f.mjs and s08h.mjs (extract the stream-power model; steady ratio, U doubling, relief, Rb, channel captures, Hack exponent, timing), pw.mjs, pw08b.mjs, pw08c.mjs (Playwright). render-check: PASS.

### Prose and equations

- [x] Witten and Sander 1981 introduced DLA (`135`) : Sourced. PRL 47, 1400 abstract (APS page): random aggregates, power-law density correlations, radius of gyration scaling.
- [x] Electrodeposited metal follows DLA (`135`) : Sourced. Matsushita et al., PRL 53, 286 (1984): zinc leaves, D = 1.66 +- 0.03, "agreed excellently with the two-dimensional DLA model" (abstract via ADS/search). Now cited.
- [?] "mineral dendrites on rock" follow the same arithmetic (`135`) : Unverifiable as stated. Chopard, Herrmann, Vicsek, Nature 353, 409 (1991) model them with a lattice reaction-diffusion model, not DLA. Cut.
- [x] Viscous fingers in a thin cell (`135`) : Sourced. Nittmann, Daccord, Stanley, Nature 314, 141 (1985): Hele-Shaw viscous fingers are fractal, interpreted with a modified DLA. Now cited.
- [x] Walkers start on a circle just outside the cluster, step N/S/E/W, stick on contact (`141`) : Computed (launchWalker radius + 15, stepWalker, randomNeighborValue).
- [x] u is harmonic, u = 0 on cluster, 1 on circle; arrival set by its slope (`176`) : Derived. One step averages u over four neighbours.
- [x] "a handful of outer tips collect most of the walkers ... fjords receive almost none" (`180`) : Computed. s08g, 2,000-particle cluster, 300,000 walkers: top 10% of perimeter sites receive 89.8% of arrivals; 1,505 of 2,409 perimeter sites got no walker.
- [x] Mullins-Sekerka instability of a diffusion-limited front (`181`) : Sourced. Mullins and Sekerka, J. Appl. Phys. 35, 444 (1964), stability of a planar solidification front (abstract via ADS). Now in references.
- [x] Lightning rod concentrates field (`181`) : Derived (field enhancement at a protrusion, same harmonic argument).
- [x] Reduced stickiness: "Small clusters come out denser, with a measured dimension close to 2" (`187`) : Computed. s08a, p = 0.05: D 1.9 to 2.2 at 500 particles, about 1.9 at 1,000; p = 0.01 reads 2.0 to 3.5 at 500 (the fit exceeds 2 on tiny clusters).
- [x] Crossover to ordinary DLA far out (`191`) : Computed trend plus the series trap note. s08a mean final D over 10 to 16 runs: p = 1 1.66, 0.3 1.69, 0.05 1.71 to 1.74, 0.01 1.97 (not yet crossed over). No primary source for the sticking-probability crossover was read this session (searches found only site vs bond sticking universality, arXiv cond-mat/0009297).
- [x] NPW 1984 proposed DBM for Lichtenberg-type discharges (`239`) : Sourced. PRL 52, 1033 abstract: stochastic breakdown model gives fractal discharge patterns; "planar discharges ... compared with properly designed experiments." Growth weight |grad phi|^eta matches code (1 - phi at the perimeter site).
- [x] eta = 1 statistically like DLA (`243`) : Sourced. Nicolas-Carlock and Carrillo-Estrada (arXiv 1611.08333) Table 2: NPW 1984 measured D = 1.89 (eta 0.5), 1.75 (eta 1), 1.6 (eta 2); average over studies 1.70 at eta 1, against DLA 1.715 +- 0.004.
- [x] eta = 0 is Eden growth, compact with rough edge (`243`) : Derived (uniform weights) and Sourced (same review: "isotropic compact structures with D = d, when eta = 0 (Eden clusters)"). s08c: D = 2.04 at eta 0.
- [?] "At large eta ... the cluster becomes a needle" (`243`) : Loosely true. Review Table 2: D about 1.26 at eta 3, 1.11 at eta 4, 1.04 at eta 5 (Hastings 2001 among the sources); "linear structures, D ~ 1, as eta >> 1". Added the numbers.
- [?] "Lightning is often drawn with this model at eta above 1" (`244`) : Unverifiable, no source read. Cut; kept the caveat about stepped leaders.
- [x] Stream-power law dh/dt = U - K A^(1/2) S, D8 steepest descent among eight, A counts itself, sea-level bottom row, uniform uplift (`290`, `294`) : Computed (code: route(), A.fill(1), rec over 8 neighbours with sqrt2 diagonals, step()).
- [x] Depressions filled before routing (`298`) : Computed (priority flood with EPS).
- [x] Steady state S = (U/K) A^(-1/2) (`341`) : Derived from dh/dt = 0.
- [x] Readout "climbs from 0 to 1 over the first few hundred steps" (`342`) : Computed. s08e (3 terrains): 0.00-0.01 at 50, 0.13-0.20 at 100, 0.98-0.99 at 200, 1.00 by 400.
- [x] "Double U and it drops to 0.5, then recovers as the relief grows to twice its old height" (`343`) : Computed. s08e: 0.50 immediately, 0.61-0.64 at 100, 1.00 by 200; relief ratio after 4,000 steps 1.87, 2.01, 1.88.
- [x] "after that the network changes only by occasional captures at the divides" (`343`) : Computed. s08f: channel-cell receiver changes per 100 steps between steps 2,000 and 3,000: 1 to 14 (of about 1,000 channel cells). (All-cell receiver changes are 40 to 160, mostly hillslope cells.)
- [x] "A DLA cluster never settles" (`344`) : Derived (particles frozen).
- [x] Strahler ordering definition (`347`) : Derived; matches strahlerCounts and strahlerRiver (checked on sample trees in the runs; counts decrease monotonically).
- [x] Horton: counts fall by a roughly constant factor per order (`348`) : Sourced. Kirchner 1993 (Geology 21, 591, PDF read) states Horton's (1945) law of stream numbers.
- [ ] "this bifurcation ratio ... sits between 3 and 5 for real rivers", attributed to Horton (`348`) : Misattributed/overstated. Kirchner: "RB generally varies between 3 and 5, with a modal value of 4" citing Chorley 1957, Smart 1972, Abrahams 1984. Reworded to "usually between 3 and 5, most often near 4".
- [?] "all three land near that range" (`349`) : Partly. River Rb 3.37 to 5.22 over 5 settled terrains (s08e/f); full DLA cluster 3.46 to 5.24, mean 3.86 (40 runs); discharge at eta 1 mean 4.93 on the 1200px canvas (217x163, 10 runs) and 3.92 on the phone canvas (100x75). Browser 1200px: River 3.6, DLA 4.2, Discharge 5.2. Reworded with the ranges.
- [ ] Kirchner: "almost any randomly branching tree has a bifurcation ratio near 4" (`353`) : WRONG gloss. Kirchner's abstract: the Horton regularities "describe virtually all possible networks", not specifically random ones; "near 4" is the modal value of real rivers. Reworded.
- [x] Channels declared at >= 20 cells; every cluster particle counts (`354`) : Computed (CHANNEL_A = 20; strahlerCounts over all nodes).
- [x] DLA harmonic field solved over all space; stream power sums area down the flow tree; river relaxes to steady state (`358`) : Derived from both models' code.
- [x] DLA D ~ 1.71 (`359`) : Sourced. Tolman and Meakin, PRA 40, 428 (1989): 1.715 +- 0.004 (via review Table 1); review average 1.71 +- 0.01. Now cited.
- [x] Devauchelle et al. 2012: seepage streams, Florida panhandle, 2pi/5 = 72 deg, found in the field (`363`) : Sourced. Abstract (Europe PMC): nearly 5,000 bifurcations, mean 71.9 +- 0.8 deg. Water table obeys a Poisson equation: PMC3529043 full text.
- [ ] Streams "grow at their heads in proportion to the groundwater flowing into them" (`363`) : Misstated. The paper's hypothesis: "streams grow forward in the direction from which groundwater enters their tips". Reworded.
- [x] Surface-runoff rivers follow stream power (`364`) : Derived (describes the model on the page; Braun and Willett 2013 in references).

### Figure 1 (DLA)

- [x] Coloured dark (early) to gold (late) by arrival order (`170`) : Computed (buildColorLUT over particle index).
- [x] D is the slope of log N vs log Rg over the last fourfold growth (`170`) : Computed (DimTracker.estimate uses samples with N >= n/4).
- [ ] "small clusters read high" (`170`) : Not reliable. s08b, 40 runs: mean 1.74 (sd 0.12, range 1.50 to 2.00) at N = 500, 1.76 at 1,000, 1.70 at 2,000, final 1.67. Cut; replaced by the measured scatter.
- [?] "large 2D DLA clusters settle near 1.71" as what the readout reaches (`170`) : The page cluster never gets large: it stops at the radius cap after 2,160 to 4,618 particles (MAX_PARTICLES 6,000 never reached); final readout mean 1.670, sd 0.084, range 1.47 to 1.81. 1.71 is the literature value (Tolman and Meakin). Caption now gives both.
- [x] Overlay: perimeter sites coloured by the chance the next walker lands there, relative to the most exposed (`170`) : Computed. s08g: u at perimeter sites (page's SOR, 500 sweeps) vs Monte Carlo landing shares, Pearson r = 0.965.

### Figure 2 (stickiness)

- [x] Each grown until it fills the canvas; D as in Fig 1 (`231`) : Computed (MAX_RADIUS 0.4 S or 8,000 particles).
- [x] "drifts down from 2 as the cluster outgrows the crossover scale" (`232`) : Computed. p = 0.05: about 1.9 to 2.0 at 500 to 1,000 particles, 1.72 to 1.74 at the end (means).
- [x] "At very low stickiness the crossover needs more particles than this canvas holds" (`232`) : Computed. p = 0.01 hits the 8,000-particle cap at radius 42 to 49 with D 1.89 to 2.07.
- [x] "Adjust the slider, then click Reset Both to apply" (`232`) : Computed (browser).

### Figure 3 (DBM)

- [x] Grows from a point on the top edge, phi = 0 on the other edges (`279`) : Computed (seed at row 0; edge cells never relaxed, start at 0; the rest of the top edge is also 0).
- [x] Over-relaxed Gauss-Seidel warm-started, glow shows potential (`280`) : Computed (relax(4) per step, w 1.85; glow alpha = 0.35 phi, a fixed scale). Convergence caveat: max residual 2 to 5e-2 with 4 sweeps, but s08d shows D and Rb unchanged within noise at 20 and 80 sweeps.
- [x] "Changing eta restarts the growth" (`281`) : Computed (change event and regime buttons call reinit).
- [x] Buttons Eden 0, DLA 1, Needle 4 produce the stated regimes (`271`) : Computed. s08c (217x163): mass-radius D 2.04 (eta 0), 1.36 (1), 0.97 (4); tips 76 / 272 / 20. Note: toward grounded edges this close the eta = 1 discharge is sparser than free DLA (D about 1.35 to 1.45 at both canvas sizes); caveat added to the caption.

### Figure 4 (river)

- [x] 100x100 landscape from low random noise (`339`) : Computed (h = 0.01 Math.random()).
- [?] Labeled simulated? (brief) : The prose said "stream-power landscape below" and "the one simulated here", but the caption did not say simulated. Added "simulated"; no real names used.
- [ ] "darker ground is higher" rendered on a per-frame rescaled scale (`339`) : Colour scale was rescaled to each frame's maximum height, so bare noise at step 0 was drawn with full relief contrast. Now fixed at 12 U/K (steady relief is 9.2 to 10.8 U/K over five U, K pairs, s08h).
- [x] Blue marks channels, cells draining >= 20 (`339`) : Computed.
- [x] Chart: segment counts per order on log scale for river (blue), DLA (gold), discharge (violet), fitted Rb each (`339`) : Computed (drawChart, fitRb log-linear least squares).
- [x] Last readout = median over channel cells of S / ((U/K) A^-1/2) (`340`) : Computed (steadyRatio()).
- [x] Hack's law (brief; not on the page) : Computed only. Steady networks give L ~ A^h with h = 0.56 to 0.63 (s08e/f, 5 terrains, channel cells, longest upstream path). Not added to the page.

### Anti-slop and house rules

- Em dashes: none. Readouts are one-line stat rows. No callout boxes.
- Reduced motion: Figs 1 to 3 pre-grew for 300 ms; Fig 4 showed only the initial noise and no channels. Fixed (up to 700 steps or 600 ms up front; browser: 582 steps, order 4, ratio 1.00).
- 390px, dark mode, keyboard: pw.mjs all 8 configs clean before and after (no console errors, no NaN, no overflow, no SVG text under 11px).

## 09 Self-avoiding walks

File: docs/emergence/09-self-avoiding-walks.html. Checked 2026-09-25. Scripts (scratchpad w09-10/): s09a.mjs (growing-walk trapping stats, 200,000 walks, page's generateSAW extracted), s09b.mjs (Fig 1 and Fig 2 exactly as the page computed them), pivot.js + s09c-f (pivot sampler, checked against exact enumeration), pw.mjs, figshot.mjs. render-check: PASS.

### Prose and equations

- [x] Walk rule "never revisit a cell" (`113`) : Derived. Matches generateSAW.
- [x] SAW models a polymer; SAWs expand faster than random walks (`117`-`119`) : Computed with uniform SAWs (pivot): mean end distance 26.2 vs 8.9 at N = 100, 86 vs 20 at N = 500. (The page's own figure did not show this; see Figure 1.)
- [x] "known numerically to many digits and conjectured exactly in two dimensions, but never proved" (`119`-`120`) : Sourced. Clisby and Dunweg 2016 (arXiv 2001.03138 abstract): nu = 0.58759700(40) in 3D. Bauerschmidt, Duminil-Copin, Goodman, Slade, "Lectures on self-avoiding walks" (arXiv 1206.2092, s1.6.2): 2D values predicted by Nienhuis, not proved.
- [x] Random walk distance ~ N^0.5 (`175`) : Computed. Page fit 0.498 mean over 100 runs (5-95%: 0.478-0.521 at 200 walks per length).
- [ ] "Nienhuis derived this in 1982 by mapping the walk onto a Coulomb gas; it is exact within that mapping" (`176`-`177`) : Overstated. Nienhuis PRL 49, 1062 abstract: maps the O(n) model onto an SOS model and "subject to some plausible assumptions" computes critical indices; lecture notes s1.6.2: "Based on non-rigorous Coulomb gas methods, Nienhuis predicted gamma = 43/32, nu = 3/4". Reword as a prediction.
- [x] LSW: a conformally invariant scaling limit must be SLE 8/3, which gives 3/4 (`177`-`179`) : Sourced. LSW 2004 abstract (arXiv math/0204277) and lecture notes s1.6.2 ("The values of gamma and nu are then recovered from an SLE 8/3 computation").
- [x] 3D nu ~ 0.5876 from pivot simulations (`179`-`180`) : Sourced. Clisby and Dunweg 2016, 0.58759700(40), chains to 2^25 steps.
- [?] Flory nu = 3/(d+2), 3/5 in 3D, "partly by luck, exactly 3/4 in 2D" (`180`-`181`) : Formula and values Sourced (lecture notes s1.6.3; Flory 1949 J. Chem. Phys. 17, 303, crossref). "Partly by luck" not found in anything read; reword ("far from a derivation", as the lecture notes put it).
- [ ] "The kinetic-growth method used here ... gives an effective exponent of 0.59-0.65" (`185`-`187`) : Wrong. s09b.mjs, page code, 100 runs: 0.654 mean at 200 walks per length (5-95%: 0.637-0.669; 0.614-0.685 at 50). And the SAW points are growing walks conditioned to survive, not SAWs.
- [ ] "On a 2D square lattice most SAWs eventually trap" (`218`-`219`) : Wrong object. Uniform SAWs do not trap; growing walks do, all of them: 200,000 of 200,000 trapped, longest 662 steps (s09a.mjs).
- [?] "Short walks almost never do, and the trapping probability rises slowly with length" (`219`-`220`) : Vague. s09a.mjs: none before step 7 (Hemmer: n >= 7), 1.0% by step 10, 42% by 50, 78% by 100; hazard 0.005/step over steps 0-20, 0.015 over 20-50, 0.019-0.022 beyond 50.
- [?] "neutron scattering confirms it" (`265`-`266`) : Not sourced this session (searches found only indirect mentions). Cut.
- [?] "Despite 60+ years of work, no exact formula for the number of SAWs" (`266`-`267`) : No-formula part Sourced (lecture notes s1.2: mu known only numerically, 2.63815853031(3); Jacobsen, Scullard, Guttmann 2016 abstract via OSTI: 2.63815853032790(3)); "60+ years" undated. Reworded around mu.
- New claims on the fixed page: Hemmer and Hemmer 1984, J. Chem. Phys. 81, 584, abstract via crossref: 60,000 walks, mean length 70.7 +/- 0.2, trapping possible from n >= 7, mean displacement of trapped walkers 11.9. Computed: 70.75 +/- 0.11, median 58, mean end displacement 11.94. Honeycomb mu = sqrt(2 + sqrt 2): Duminil-Copin and Smirnov, Ann. Math. 175, 1653 (2012), crossref title; Nienhuis 1982 prediction per lecture notes s1.2. Pivot algorithm: Lal 1969 (Mol. Phys. 17, 57, crossref), Madras and Sokal 1988 (J. Stat. Phys. 50, 109; ADS abstract: fixed-N ensemble, ergodicity proof).

### Figure 1 (overlay)

- [ ] Aria "Eighty self-avoiding walks of the same length ... spreading wider", readout "Steps each", caption "The self-avoiding walks spread further" (`137`, `148`, `169`) : Wrong. generateSAW stops when trapped, so walks are not the same length: at the default 100 steps 77% trapped early (mean length 60.8). From 200 steps up the "SAW" panel is smaller than the random-walk panel: mean end distance 11.8 vs 12.6 at 200, 11.9 vs 15.3 at 300, 11.9 vs 20.0 at 500 (s09b.mjs, 200 x 80 walks). The SAW distance saturates at Hemmer's 11.9.
- [x] Random walks stay compact and revisit (`169`) : Computed, 8.9 mean end distance at 100 steps.
- [x] Eighty walks overlaid (`133`) : Code TOTAL_WALKS = 80.

### Figure 2 (scaling)

- [x] Log-log plot, dashed best-fit power laws (`212`) : Code; least-squares slope on log mean distance.
- [ ] Legend "nu = 3/4 (exact 2D SAW)" (`647`) : Overstated; 3/4 is unproved.
- [ ] Slider "Walks per length" 50-500 (`206`) : Wrong for SAWs: sawTarget = min(samples, 200), so 250-500 changed only the random walks.
- [ ] SVG text 10px ticks and legend (`586`, `589`, `646`, `652`) : Under the 11px house minimum.

### Figure 3 (trapping)

- [x] Head turns red when all four neighbours are visited (`226`) : Code.
- [x] Histogram of trap lengths with median (`229`, `261`) : Computed; median 58 over 200,000; 500-walk batches give 54-61.5 (5-95%).
- [x] P(survive to 100) readout : Computed 22.2%; 500-walk batches 19-25%.
- [ ] Caption "a single SAW advancing" (`261`) : It is a growing walk, not a uniform SAW.
- [ ] SVG text: median label 9px, axis labels 10px (`870`, `872`, `884`) : Under 11px.

### References

- [x] Flory 1949, Nienhuis 1982, LSW 2004, Clisby and Dunweg 2016 (`273`) : Citations checked against crossref / arXiv metadata.

### Anti-slop pass

- No em dashes. No callouts or KPI grids (the stat rows are one-line readouts). Closing paragraph was a pair of loose facts; now the counting problem and mu.

## 10 Stigmergy

File: docs/emergence/10-stigmergy.html. Checked 2026-09-25. Scripts (scratchpad w09-10/): s10bridge.mjs and s10bridge2.mjs (page's Bridge() extracted; 400-600 colonies per setting), s10phys.mjs (page's Jones step() extracted; hole statistics of the trail field; NOOCC=1 drops the occupancy rule), s10trail*.mjs (page's Helbing step() extracted, full 30,000-step runs), s10term.mjs (page's termite step() extracted), pw.mjs, figshot.mjs. Sources read this session: Goss et al. 1989 full text (ULB repository PDF); Tero et al. 2010 full text (Fermat's Library copy); Helbing, Keltsch, Molnar arXiv cond-mat/9805158; Jones model descriptions in arXiv 1212.0023 (Jones) and 1204.2260 (Strano, Adamatzky, Jones); Dorigo, Maniezzo, Colorni 1996 PDF; Green et al. 2017 abstract (Europe PMC); Calovi et al. 2019 abstract (arXiv 1812.07047); crossref metadata for Grasse 1959, Deneubourg 1977, Deneubourg 1990, Theraulaz and Bonabeau 1995. render-check: PASS.

### Prose and equations

- [?] Grasse in the 1950s watched termites rebuild a damaged nest "and could find no sign that they coordinated with one another" (`118`) : Paper and topic Sourced (Insectes Sociaux 6, 41, 1959, "La reconstruction du nid et les coordinations interindividuelles ... la theorie de la stigmergie"); the "no sign" paraphrase not checked in the French text. Reworded.
- [x] Stigmergy from Greek for mark and work (`118`) : Derived (stigma, ergon).
- [x] Field equation with deposit, decay, diffusion (`125`) : Derived; matches the three figures' field updates.
- [x] Steady field of order q rho / lambda; reach ell = sqrt(D / lambda) (`128`) : Derived (uniform steady state; decay length of the screened diffusion equation).
- [x] Each figure has a control that moves one ratio (`132`) : Code (decay, evaporation, durability, lifetime).
- [x] Physarum is a single cell many centimetres across foraging as a tube network (`138`) : Sourced. Tero et al. 2010: "a large, single-celled amoeboid organism"; Fig. 1 arena 17 cm wide colonized by one plasmodium.
- [?] "Cytoplasm shuttles back and forth" (`138`) : Not in anything read. Reworded to streaming flow (Tero: "internal protoplasmic flow").
- [x] Tubes with more flow thicken, others shrink (`138`) : Sourced. Tero: "high rates of streaming stimulate an increase in tube diameter, whereas tubes tend to decline at low flow rates".
- [x] Jones model: three forward sensors, rotate toward strongest, one particle per cell, move-and-deposit or stay and pick a random heading, 3x3 mean filter times decay (`138`) : Sourced. arXiv 1212.0023 (sensory and motor stages, deposit only on a successful move, random new direction when blocked, 3x3 mean filter with damping); arXiv 1204.2260 (deposit 5 units, "damped by multiplying by 0.9"). Page code matches (updates particles in fixed rather than random order; minor).
- [ ] Without occupancy "the particles pile into a single thick band" (`142`) : Computed (s10phys.mjs NOOCC=1): after 1,000 steps the strand cells shrink to 7% of the grid and one hole fills 99% of the rest, so one or two dense bands, but thin, not thick.
- [?] Caption: "Defaults are the values Jones used most often (sensor and turn angle 45, sensor distance 9, deposit 5, decay 0.9)" (`185`) : Jones 2010 itself not readable here. Deposit 5 and x0.9 Sourced (1204.2260); other Jones papers use sensor angles 22.5-90 and offsets 9-15. "Most often" unverifiable.
- [x] Particles start over about 6% of cells (`185`) : Code, 0.06.
- [x] Web of strands within a few hundred steps (`189`) : Computed: 45 holes at step 200 on a 326x228 grid; screenshot.
- [?] Sensor distance 20: "the cells of the web roughly double in size" (`189`) : Computed: median hole area x2.4 at 200 steps, x2.7 at 500, x2.6 at 1,000 (linear x1.5-1.6). "Size" ambiguous; the web also keeps coarsening with time. Reworded to area at equal step count.
- [x] Decay 0.99 lingers about a hundred steps; strands thick and bright (`189`) : Derived 1/(1-0.99) = 100. Computed: strand-cell mean field 28.5 vs 5.2 at default, strand share 0.37 vs 0.27.
- [x] Decay 0.8 mostly gone in five steps; web forms thin and faint (`189`) : Derived 0.8^5 = 0.33. Computed: strand mean 2.7, strand share 0.24, 22 holes (default 21).
- [x] Turn angle 15: finer and ragged mesh (`189`) : Computed median hole 875 vs 2,663 cells at 1,000 steps; screenshot t15-0.png ragged.
- [?] Nakagaki, Yamada, Toth 2000 details: pieces fusing, plastic maze, several hours, "one of two where the maze offered two of equal length" (`193`) : Paper not readable here. Shortest-route result Sourced (Nature abstract as quoted by search/ADS: "find the minimum-length solution between two points in a labyrinth"; Tero 2010 intro). Details cut.
- [ ] Tero: "an agar plate shaped like the region, with bright light standing in for mountains and coastline" (`197`) : Wrong. Tero: "an experimental arena bounded by the Pacific coastline"; illumination used for "mountainous terrain or lakes", on some plates.
- [x] 36 cities; after about a day (`197`) : Sourced. "a template of 36 FSs"; Fig. 1F at 26 hr.
- [x] Metrics: total length, average distance between cities, fault tolerance (`197`) : Sourced (TL, MD, FT).
- [ ] "comparable on all three, better on some and worse on others from plate to plate" (`197`) : Mis-states the result. Tero: MD_MST 0.85 for both; TL_MST 1.75 +/- 0.30 (n = 21) vs ~1.8 for rail ("marginally lower overall cost"); FT: rail better, 4% of single faults isolate part of the rail network vs 14 +/- 4% for illuminated Physarum.
- [ ] "only some plates looked like the rail map" (`197`) : Tero: "a range of network solutions ... nonetheless, the topology of many Physarum networks bore similarity to the real rail network"; illuminated plates more so.
- [x] Model: conductance grows with flux, otherwise decays (`197`) : Sourced (conductivity D_ij, flux-driven growth, decline at low flow).
- [x] Argentine ants mark in both directions (`203`) : Sourced, Goss 1989 ("workers mark both leaving and returning to the nest").
- [x] Equal branches: one branch chosen at random from run to run (`203`) : Sourced. Goss: "Abruptly ... one branch becomes visibly preferred"; r = 1: 12/26, no significant preference.
- [ ] "With one branch twice as long, most colonies settled on the short one" (`203`) : Understated. Goss: r = 2, 14 of 14; r = 1.4, 15 of 18.
- [x] Choice function with n ~ 2, k ~ 20 (`206`) : Sourced. Goss eq. 3 uses exactly (20 + S)^2 / ((20 + S)^2 + (20 + L)^2), "based on our previous experimental study".
- [x] Short branch wins because its ants get back sooner and mark both ends first (`209`) : Sourced, Goss's delay argument.
- [x] "No term compares lengths" (`209`) : Derived from the rule.
- [x] Caption model: 30-cell short branch, 100 ants, one unit per cell, three end cells, window 100, 8,000 steps (`241`) : Code.
- [ ] "batches of 20 typically give between 14 and 17" (`245`) : Computed (400 colonies): P(short majority) = 0.743; binomial 10-90% for a batch of 20 is 12-17. Also below the ants' 14/14.
- [x] The rest lock onto the long branch early (`245`) : Computed: leader after the first 50 departures wins 83%, after 100 91%.
- [x] Ratio 1 is a coin flip decided early (`245`) : Computed: 0.500; only 1% of colonies end between 30% and 70%; first-100 leader wins 92%.
- [x] Goss late short branch: most colonies stayed (`249`) : Sourced: branch added after 30 min, 2 of 18 switched.
- [x] No evaporation: no colony switches (`249`) : Computed 0/400; long-branch end field about 2,100, a hundred times k.
- [x] Evaporation sinks the steady long-branch trail, order q rho / lambda, toward k (`249`) : Derived and Computed: at lambda = 0.04 end cells hold about 36 (k = 20).
- [ ] "Around lambda ~ 0.04 ... a few colonies in twenty switch" (`249`) : Wrong. Computed 42.5-43.5% of late colonies end with a short-branch majority at 0.04; 5.7% at 0.035.
- [x] Past about 0.06 traffic splits roughly evenly (`249`) : Computed: 77% of late colonies end between 30% and 70% at 0.06, 96-97% at 0.07-0.08.
- [ ] "No evaporation rate makes the late colonies reliably find the short branch" (`249`) : Wrong. Computed (600 colonies each): 78% at 0.045, 87% at 0.05 end with a short-branch majority (71% and 56% above 80%); open colonies reach 94-95%.
- [?] Dorigo's ACO "added evaporation to this rule for exactly that reason, so that a search can forget a bad early choice" (`249`) : Ant System (1996 PDF) has trail evaporation 1 - rho and reports "stagnation" (all ants on one tour) for heavy trail weighting, but its rule is not this one and the stated motive was not found. Reworded.
- [x] Helbing, Keltsch, Molnar 1997 active walker model; ground equation with saturation and durability T (`255`-`258`) : Sourced, arXiv cond-mat/9805158 eq. 1 (with G0 = 0).
- [?] Walker direction e = (e_dest + kappa grad V) / norm (`261`-`264`) : Helbing eq. 3 adds the raw vector d - r (not a unit vector) to grad V_tr, with no separate weight; kappa here is the page's own weight. Labelled as a weighted form of their rule.
- [x] Caption: 120x80 lawn, corners, Gaussian sigma 10 in place of exponential kernel (`286`) : Code; Helbing eq. 2 uses exp(-|r - r'| / sigma).
- [x] Few-hundred-step durability: walkers cover about 1.00 x the straight line (`290`) : Computed 1.001.
- [ ] Default durability: "walkers now travel roughly 10% farther" (`290`) : Model defect. Computed (s10trail2.mjs, full runs): at the default (T = 17,970, kappa 100) 10% of the last 100 walkers were pinned in place until the 4x cutoff (median 1.084, mean 1.20-1.43 run to run); at slider 90 or kappa 130 and above, every walker is pinned (4.1x). A trail across a walker's path whose pull exceeds the unit destination pull holds it there.
- [?] "The diagonals bow outward ... braided bundle, and the sides collect traffic from the diagonals" (`290`) : Screenshot: the long sides merge with the diagonals near the corners; the diagonals bow and cross in a braid; the short sides stay separate. Reworded.
- [x] Helbing: compromise between direct routes and minimal network; compared with photographs (`290`) : Sourced ("optimal compromise between convenience and shortness"; "A comparison of simulation results with photographs").
- [x] Attraction zero: wear traces the direct routes (`290`) : Computed 1.000.
- [x] Deneubourg 1977 cement pheromone model; pick-up (K/(K + c))^2 and drop (c/(c + K))^2 from Deneubourg's brood-sorting model (`296`) : Sourced. Crossref: Insectes Sociaux 24, 117 (1977). Sorting probabilities as restated in secondary sources (Ramos and Merelo, arXiv cs/0403001); Deneubourg 1991 not read.
- [x] Caption: about 690 pellets over 8%, 150 termites, K = 6, D = 0.2 (`319`) : Code (0.08 x 8,640 = 691).
- [ ] "the field on a lone pellet sits near K" (`323`) : Computed 2.7 at step 300, about K/2.
- [x] "the field on a pile of ten is several times K" (`323`) : Computed 22.7, about 3.8 K.
- [ ] "about six times as likely to pick up a lone pellet" (`323`) : Computed: (6/8.7)^2 / (6/28.7)^2 = 11 with those fields.
- [?] "within a few thousand steps nearly every pellet sits in one of a dozen or so piles" (`323`) : Computed (3 runs): 22 piles holding 86% at 2,000 steps, 17 and 90% at 5,000, 15 and 96% at 12,000. Loose; replaced with the numbers.
- [ ] "Past a lifetime of about 100 steps ... rho q / lambda climbs above K ... clustering stalls" (`323`) : Derived crossing at lifetime 75 (0.08 x 75 = 6). Computed decline is gradual: 77% in piles at lifetime 55, 60% at 95, 30% at 157, 11% at 218, 1% at 500.
- [x] Emission off: scatter stays a scatter (`323`) : Computed, 0 piles at 12,000 steps.
- [?] "No one has isolated it from termite mud; experiments on Macrotermes suggest fresh soil, moisture and surface shape" (`327`) : Partly Sourced: Green et al. 2017 (excavation and aggregation, "putative 'cement pheromone'"); Calovi et al. 2019 (surface curvature). "Isolated" and moisture not read. Reworded to the two sourced results.
- [ ] "it would work only within a limited range of lifetimes" (`327`) : Computed: a lifetime of 2 still clusters (100% in piles by 12,000 steps); only the upper limit exists.
- [x] Theraulaz and Bonabeau 1995 lattice-swarm wasp nests (`327`) : Sourced (crossref; abstract via search: agents on a 3D lattice respond to local configurations of matter).
- [ ] Termite drop rule has an undisclosed base rate 0.002 (code `854`) : Caption/prose gave only (c/(c + K))^2.
- [ ] Figure 3 static value "20000" (`273`) : Code computes 17,970 for the default slider position.
- [ ] Figure 2 chart label sits under the share line at 100% (screenshot f10-1.png).
- [ ] SVG text 10px: bridge axis ticks and histogram counts (`82`, `654`) : Under 11px.

### Anti-slop pass

- No em dashes. No callouts, KPI grids or summaries; readouts are single stat lines. Colour vocabulary unchanged.

## 11 Predator-prey in space

File: docs/emergence/11-predator-prey-in-space.html. Checked 2026-09-25. Scripts (scratchpad w11-12/): f1.mjs (Fig 1 RK4 model, conserved V, Jacobians, limit cycles), f2.mjs (Fig 2 160x160 grid, page step() and wellMixedRange()), f3.mjs (Fig 3 lattice, page sweep() at the page's sizes and at L=200), shot.mjs / figs.mjs (Chromium screenshots and readouts), pw.mjs (8-config sweep). render-check: PASS.

### Prose and equations

- [x] LV equations x' = ax - bxy, y' = ebxy - my (`262`) : Derived. Match deriv() with K = Infinity, h = 0.
- [x] Conserved V = eb x - m ln x + b y - a ln y (`269`-`270`) : Derived and Computed. dV/dt = (ebx - m)(a - by) + (by - a)(ebx - m) = 0. f1.mjs: along the default start (0.9, 0.2) over t = 160, V stays 4.0143140 to 4.0143141.
- [x] Orbits closed, never settle or blow up, no preferred size (`271`-`273`) : Computed. Default start gives prey 0.005 to 0.956 on repeat; other starts give other loops (ghost trajectories).
- [x] Neutral cycle is structurally unstable (`273`) : Derived. Center with pure imaginary eigenvalues; adding logistic term gives trace < 0 (below).
- [x] With carrying capacity the loops become inward spirals to a fixed point (`276`-`278`) : Computed. "log" mode, K 0.6 to 3: trace -0.30 to -0.06, discriminant < 0 at every K (focus).
- [x] Holling II b x / (1 + b h x) turns the model into Rosenzweig-MacArthur (`280`-`282`) : Derived. Matches deriv() with h = 0.5.
- [x] Below a threshold fixed point stable, above it every start goes to one limit cycle (`283`-`285`) : Computed. x* = 0.2574; trace changes sign at K = 2 x* + 1/(bh) = 1.1397 (trace -0.0025 at 1.13, +0.0026 at 1.15). At K = 2 five different starts all land on prey 2.80e-3 to 1.606.
- [x] Richer environment, deeper troughs (`285`) : Computed. Cycle prey minimum 0.119 (K 1.2), 0.025 (1.5), 2.8e-3 (2), 3.0e-4 (2.5), 3.0e-5 (3).
- [x] Rosenzweig's paradox of enrichment (1971) (`285`-`286`) : Sourced. Rosenzweig, Science 171:385 (1971), abstract via Europe PMC: "increasing the supply of limiting nutrients or energy tends to destroy the steady state".
- [x] Push K to 3: minimum below 0.0001, peak near 2.8 (`314`-`315`) : Computed. 3.02e-5 and 2.786; same to 4 digits at dt 0.005.
- [?] Huffaker (1958): small open array, predators ate all prey then starved; coexistence lasted "several cycles" only with barriers and dispersal routes (`317`-`321`) : Sourced only secondhand. Hilgardia 27:343 not readable (ucanr.edu 403; Huffaker's Citation Classic PDF is a scan). Wikipedia's article on the experiment (citing the paper) and the Hilgardia abstract text surfaced by search: simple universes went extinct after one oscillation; the complex universe (120 oranges, petroleum-jelly barriers, posts aiding prey dispersal) gave three oscillations. "Several" should be "three".
- [x] RM on a grid with diffusion, PDEs (`331`) : Derived. Match step(): 5-point Laplacian, explicit Euler dt 0.05 (stable: 4 D_P dt = 0.08).
- [x] Below the threshold the field goes flat (`340`-`342`) : Computed. f2.mjs K = 1.0, noise start: after t = 150 prey 0.2572 to 0.2580 everywhere, spatial SD 0.000.
- [x] No Turing instability in this model (`342`-`345`) : Derived. J_PP = e f(H*) - m = 0 at the fixed point (numerically 1e-11); below Hopf J_HH < 0; with J_HP J_PH < 0, det(J - Dk^2) = (J_HH - D_H k^2)(-D_P k^2) - J_HP J_PH > 0 for all k.
- [x] Above threshold, noise organises into waves and spirals (`347`-`353`) : Computed. Chromium screenshot after ~25 s at K = 2 (rd-noise.png): field of spirals.
- [x] Invasion from a point gives rings that break into irregular patches behind the front; Sherratt, Lewis and Fowler (1995) "chaos in the wake of invasion" (`353`-`356`) : Computed and Sourced. rd-inv.png shows concentric rings with break-up near the centre (the 160-cell periodic grid wraps the fronts after ~200 time units). PNAS 92:2524 abstract (Europe PMC): "The chaos is generated naturally in the wake of invasive waves of predators."
- [x] A single cell swings through most of the well-mixed cycle; grid total barely moves (`385`-`388`) : Computed. f2.mjs K = 2 after t = 150 and 1000: probe cell 0.0076-1.27 and 0.0046-1.41 vs well-mixed 0.0028-1.606; grid mean 0.30-0.47 and 0.325-0.405. "almost the full" slightly overstates (cell peak 80-88% of the cycle peak).
- [?] "prey drop to within a few thousandths of zero" (`386`) : Usually. Node runs 0.0046, 0.0076, 0.003; one browser run 0.04 (probe near a spiral core). Needs "usually".
- [?] "the whole sits near the fixed point that each cell keeps overshooting" (`389`-`390`) : Imprecise. Grid mean 0.33-0.40 vs x* = 0.257; stated as near the fixed point it is 30-50% above it.
- [x] Prey persist because emptied patches are recolonised from neighbours in other phases (`393`-`397`) : Derived from the model (diffusion from out-of-phase neighbours); consistent with the field never going extinct in any run.
- [x] Lattice rules and one sweep = one time unit (`402`-`410`) : Computed. sweep() does exactly this: L*L random picks per sweep, prey reproduce into empty neighbour w.p. sigma, predator dies w.p. mu else converts a prey neighbour w.p. lambda.
- [x] Mean field has the (1 - x - y) factor and a stable fixed point with no cycle (`415`-`418`) : Derived. da/dt = sigma a (1-a-b) - lambda' a b, db/dt = lambda' a b - mu b, lambda' = lambda(1-mu). Jacobian at the fixed point: trace -0.46 / -0.28 / -0.11 / -0.06 and det > 0 at lambda 0.12 / 0.2 / 0.5 / 1 (node near threshold, focus above).
- [?] Fluctuations "amplified by the spatial structure"; totals nearly constant on a big lattice (Mobilia, Georgiev, Tauber 2007) (`419`-`421`) : Second half Sourced: J Stat Phys 128:447, arXiv q-bio/0512039 abstract, "amplitudes that tend to zero in the thermodynamic limit. Yet in finite systems these oscillatory fluctuations are quite persistent". "Amplified" is not in the source; reword to "persist".
- [x] Predator-free state is absorbing (`453`-`454`) : Derived from the rules (no predator birth without a predator).
- [x] Mean-field threshold lambda(1-mu) = mu; lone predator in a sea of prey replaces itself (`455`-`456`) : Derived. Gain lambda(1-mu) at a = 1 vs loss mu; lambda_c = 0.111.
- [ ] "The lattice needs markedly more" with no number, and the page's own sweep misplaces it (`456`) : Qualitatively right, but the sweep (L=64, 800 sweeps) reports survival from 0.175 in some runs (predator density 0.002-0.003 at 0.175 in 2 of 5 node runs; browser readout "survived from 0.175"). f3.mjs at L = 200, 4000 sweeps: all runs at lambda <= 0.195 went extinct (by sweep 503-2274), 0.200 one of two extinct, 0.205 alive (0.0011-0.0013), 0.21 alive (0.009). So lambda_c ~ 0.20, 1.8x mean field. At L=64, 0.175 always dies by sweep 844 (10 runs), so 800 sweeps is too short.
- [x] Offspring next to parent compete for local prey (`456`-`458`) : Derived mechanism; plausible explanation, not a measurement. Softened to "part of the reason" in the fix.
- [x] DP universality class, Antal and Droz 2001; Mobilia et al 2007 (`459`-`461`) : Sourced. Mobilia et al abstract: "governed by the directed percolation universality class". Antal and Droz, PRE 63:056119, arXiv cond-mat/0009440 full text: "this absorbing state phase transition belongs to the DP universality class, as expected on general grounds" (their model differs; they also report a special non-DP point, not mentioned on the page, fine for "generic").
- [x] A small sweep cannot measure exponents (`461`-`462`) : Derived.
- [x] RPS: well mixed, finite population loses two of three; on a lattice spirals persist only while mobility is low enough that spirals fit the habitat (Reichenbach, Mobilia, Frey 2007) (`466`-`470`) : Sourced. arXiv 0709.0217 text: above M_c "the system can be considered to be well-mixed ... which predicts the extinction of two species"; "the spirals' wavelength exceeds the critical value and the patterns outgrow the system size causing the loss of biodiversity".
- [x] No Hudson's Bay lynx-hare or other historical data on the page : Checked; nothing to source or cut.

### Figure 1 (well-mixed phase plane)

- [x] "integrated with RK4" : Computed. integrate() is classical RK4, dt 0.02.
- [x] Dashed lines are nullclines, crossing is the fixed point : Derived. Prey nullcline y = a(1 - x/K)(1 + bhx)/b, predator nullcline x = x*.
- [x] Strip: prey green, predators red : Checked in screenshot.
- [x] "raise K past about 1.14 and every start converges to one cycle" : Computed (1.1397, five starts, above).
- [x] Readout values computed from the run : Computed. describe() integrates 3000 time units and reads the tail; unstable test uses the exact Hopf condition. Readout "Stable fixed point ... spiral in" at K 0.6-1.1 true (focus, discriminant < 0 at every K in range).
- [x] Reduced motion shows the final position of the runner : Code check and pw.mjs.
- Note: at K = 3 predators on the cycle reach 1.73, above the y axis max 1.4; the loop is clipped at the top. Left as is.

### Figure 2 (spatial RM)

- [x] 160x160 periodic grid, fixed colour scales (prey /1.6, predators /0.9, clamped) : Computed/code. No per-frame rescale.
- [x] Barriers block diffusion (no-flux via neighbour table) : Code check; drag and Enter both draw (pw.mjs).
- [x] "Invasion fills the grid with prey at K and releases predators at the centre" : Code check (r < 5 disc).
- [x] Dashed band = prey range of the well-mixed cycle at the same K : Computed. wellMixedRange() gives 0.0028-1.6063 at K = 2, same as RK4 (2.80e-3, 1.606).
- [x] Parameters listed a=1, b=3.2, h=0.5, e=0.6, m=0.35, D_H=0.02, D_P=0.4 : Code check.
- [x] Defaults sit past the Hopf threshold : K = 2 > 1.1397.
- [x] Readout "over the last 200 time units" : Computed. 400 samples x 10 steps x 0.05.

### Figure 3 (stochastic lattice)

- [x] 100x100, sigma 0.5, mu 0.1; 64x64 sweep lattices, 800 sweeps averaged over last 300; hollow ring over last 100 sweeps : Code check (as audited).
- [x] Dashed curves are the mean-field fixed point of the same rules : Derived (above).
- [x] "Near the threshold the lattice relaxes slowly, so those points are noisy" : Computed. Extinction times at L=200 grow from ~500 sweeps at 0.16 to >2500 at 0.20.
- [ ] Sweep readout brackets the threshold at 0.150/0.175 in some loads : see the lambda_c entry. 800 sweeps is shorter than the extinction time just below lambda_c.

### Anti-slop pass

- Em dashes: none. No cards, badges or callouts. Readouts are one-line sentences.
- SVG axis text rendered at 10.5 px (desktop) and 9.8 px (390 px); below the 11 px floor.

## 12 Two ways to make a pattern

File: docs/emergence/12-reaction-diffusion.html. Checked 2026-09-25. Scripts (scratchpad w11-12/): g2.mjs (Figure 2 page runTile() at all 280 tile centres, classified dead / uniform / patterned; presets at 64x64 for 10,000 steps), presets.mjs (clicks each preset pill, runs Figure 1 at 24x speed, screenshots at ~2-7k and ~40-58k steps; presets-early.png, late/), g34.mjs (page run1D(), peaks(), gradient() for Figures 3 and 4, same PRNG seeds), epmc.py (Europe PMC abstracts), pw.mjs, figs.mjs. render-check: PASS.

### Prose and equations

- [x] Fly embryo is a syncytium with thousands of nuclei; stripes by about three hours (`115`) : Derived/Sourced. 13 syncytial divisions (2^13 ~ 8000 nuclei); Lim et al. PNAS 2018 (search summary): pair-rule stripes visible within three hours, nuclear cycle 14 at 2-3 h.
- [x] Young angelfish has three stripes and adds more as it grows (`115`) : Sourced. Painter, Maini, Othmer PNAS 96:5549 (1999), PMC21897: "Young angelfish of this genus display three vertical white stripes ... new stripes develop via gradual insertion between the preexisting stripes".
- [x] Turing 1952 and Wolpert 1969 as the two answers (`118`) : Sourced. Green and Sharpe, Development 142:1203 (2015) abstract names these as the two big ideas. Sharpe, Development 146:dev185967 (2019): the French flag first appeared in 1968 (Waddington volume), the positional-information paper in 1969; page says 1969 for the positional answer, fine.
- [x] Gray-Scott equations, reaction U + 2V -> 3V, removal f + k (`124`-`126`) : Derived. Match simStep(), runTile(), run1D().
- [x] D_u = 0.21, D_v = 0.105, U diffuses twice as fast (`128`) : Code check. DU = 0.2097, DV = 0.105, ratio 1.997.
- [ ] "Short-range activation with longer-range inhibition is the combination Turing identified" (`128`) : Misattributed. Turing 1952 did not state it in those terms; Gierer and Meinhardt, Kybernetik 12:30 (1972): "autocatalytic, self-enhancing activation, combined with inhibitory or depletion effects of wider range" (abstract via Springer/MPI summary). GM is already in the reference list.
- [?] "At these diffusion constants the empty state is stable" (`131`) : Misleading qualifier. Jacobian at (1, 0) is diag(-f, -(f+k)), stable for every f, k and no diffusive instability is possible from it; nothing to do with the diffusion constants.
- [?] "The spacing that emerges does not depend on where the seeds were placed" (`131`) : Too strong. g34.mjs Figure 4 embryos (three random seeds each): spacings 14 to 17 cells, peak counts 12 to 14 in 200 cells; a band, not a single value (the page itself says so at `256`).
- [x] Uniform V-rich states exist only while (f+k)^2 <= f/4, i.e. below k = sqrt(f)/2 - f (`183`) : Derived. u = (f+k)/v into f(1-u) = u v^2 gives (f+k) v^2 - f v + f(f+k) = 0, discriminant f^2 - 4f(f+k)^2.
- [x] Well below the curve the seeds tip the grid into the V-rich uniform state (`183`) : Computed. g2.mjs: 137 of 162 tiles below the curve end uniform V-rich (the rest dead at very low f, or patterned near the curve).
- [ ] "that is where nearly all the patterns live" (`184`) : Overstated. g2.mjs: 28 patterned tiles above the curve, 7 below (80%).
- [x] Patterns survive because each feeds on surrounding substrate (`184`-`185`) : Derived (qualitative, consistent with every patterned tile sitting where the uniform V-rich state is absent or near its edge).
- [x] Every tile a separate 32x32 simulation from the same four seeds; click sends parameters (`186`-`187`) : Computed/code. runTile() at tile centre (f, k); 20 x 14 = 280.
- [?] "The spots are as far apart as the chemistry says, whether the tile is 32 cells wide or 256" (`206`-`207`) : Not measured in 2D. The 1D analogue is measured (Figure 3: ~15 cells from L = 40 to 300); 2D spot spacing across tile sizes was not computed.
- [x] Morphogen steady state D C'' = k_deg C, exponential with lambda = sqrt(D/k_deg) (`212`) : Derived.
- [x] Thresholds pick three fates; Wolpert's French flag, blue near the source (`213`-`214`) : Sourced. Sharpe 2019: fates "specified by threshold values (t1, t2)", blue/white/red.
- [x] Bicoid mRNA at the anterior pole; gradient with decay length about a fifth of egg length (`215`) : Sourced. Driever and Nusslein-Volhard, Cell 54:95 (1988) abstract: "derived from an anteriorly localized mRNA ... exponential concentration gradient"; Gregor et al. Cell 130:153 (2007), PMC2253670: "length constant lambda ~ 100 um" (egg ~500 um).
- [x] Extra bicoid copies shift head structures toward the tail (`216`) : Sourced. Driever and Nusslein-Volhard 1988: "Increases or decreases in bcd protein levels ... cause a corresponding posterior or anterior shift of anterior anlagen".
- [x] Hunchback switches on above a Bicoid threshold (`216`) : Sourced. Gregor et al. 2007 abstract: "readout of Bcd by the activation of Hunchback".
- [x] Figure 3 Turing row f = 0.038, k = 0.060 is just above the dashed curve (`225`) : Derived. sqrt(0.038)/2 - 0.038 = 0.0595 < 0.060.
- [x] Source-sink profile is a straight line 1 to 0 at any length (`227`) : Derived/Sourced. gradient() with lambda = Infinity; Sharpe 2019: values at both ends held fixed.
- [x] Turing row keeps its spacing, about 15 cells, and adds peaks (`244`) : Computed. g34.mjs: L = 40..300 give 3, 4, 6, 6, 8, 9, 10, 12, 12, 14, 16, 16, 18, 19 peaks, mean spacing 13.0 to 16.6; identical peak sets at 80,000 steps, so 40,000 is converged.
- [x] Kondo and Asai (1995): new stripes open between old ones, spacing roughly constant (`245`) : Sourced. Nature 376:765 abstract: "the stripes of Pomacanthus maintain the spaces between the lines by the continuous rearrangement of the patterns"; insertion between stripes per Painter et al. 1999.
- [x] Source-sink boundaries at one third and two thirds at every length (`246`) : Derived. Thresholds 2/3 and 1/3 on 1 - x/L.
- [x] Fixed-decay flag: short tissue never reaches red, long one mostly red (`246`-`247`) : Computed. Red fraction 0 at L = 40 and 60, 0.35 at 80, 0.85 at 300.
- [ ] "Fly embryos from differently sized eggs place their segments at nearly the same fractional positions, and how a gradient that fades over a fixed length could manage that is still open" (`247`-`248`) : Partly wrong. Gregor et al. PNAS 102:18403 (2005) abstract: across dipteran species "patterns of gene expression ... scale with egg length ... traced back to scaling of the Bcd gradient itself" (the decay length is not fixed). Within one species Houchmandzadeh, Wieschaus, Leibler, Nature 415:798 (2002): hb pattern "already includes the information about the scale of the embryo" while Bcd is variable. Cite both; "still open" only for the within-species case.
- [x] Turing's mechanism alone has only an internal length scale (`249`) : Derived (Figure 3).
- [x] Positional error sigma*lambda; 10% and 40 cells gives about 4 cells (`253`-`254`) : Derived. dx = dC/|C'| = sigma C / (C/lambda).
- [x] "ragged over several cells" (`254`) : Computed. g34.mjs defaults, four embryo sets: mean ragged zone 5.2 to 6.3 cells.
- [x] Scaling the gradient by a moves each crossing by lambda ln a (`255`) : Derived for a pure exponential (cosh profile deviates only near the far end); readout's lambda*sigma = 8.0 vs measured SD 7.9 to 9.0.
- [x] Turing peaks climb over a few cells, so read-out noise barely moves edges (`256`) : Computed. Profile around a peak: 0.048, 0.102, 0.186, 0.263, 0.301 (four cells from background to top). At 10% noise, 0 to 7 cells flip across the 0.15 threshold per 200-cell embryo (of ~26 edges).
- [x] Three random seeds; peaks fill the row; outermost settle a few cells from walls; different embryos, different counts (`257`-`259`) : Computed. Wall gaps 7 or 8 cells; counts 12 to 14 across 40 embryos.
- [ ] "Gregor, Tank, Wieschaus and Bialek measured the hunchback boundary to within about 1% of egg length, roughly one nucleus" (`289`-`290`) : Wrong as stated. PMC2253670: "Distinct fates in neighboring cells therefore means that they acquire positional information with an accuracy of ~1-2%"; Bcd profiles reproducible enough to read position "with an accuracy of ~2% of the embryo length"; the measured precisions are ~10% in concentration. The "near the limit set by counting Bicoid molecules" part is Sourced (abstract: "approaching the limits set by basic physical principles").
- [x] Self-organization gets sharp edges but a range of spacings (`290`-`291`) : Computed (Figure 4 numbers above).
- [x] Mouse limb: Bmp-Sox9-Wnt Turing network; Hox and Fgf gradients modulate the wavelength; Raspopovic 2014; Green and Sharpe 2015 (`291`-`292`) : Sourced. Science 345:566 abstract ("Turing network implemented by Bmp, Sox9, and Wnt ... modulated by morphogen gradients"); search summary of the paper: distal Hox level modulates the wavelength and Fgf gives a radial pattern with larger wavelength distally.
- [x] Reference list entries (Turing, Wolpert, Gierer-Meinhardt, Pearson, Driever-Nusslein-Volhard, Kondo-Asai, Gregor 2007, Raspopovic, Green-Sharpe) (`296`) : Sourced. Volumes and pages checked in Europe PMC / search: 237:37; 25:1; 12:30; 261:189; 54:95; 376:765; 130:153; 345:566; 142:1203.

### Figure 1 (Gray-Scott)

- [x] 256x256 torus, coloured by V : Code check (wrapping indices).
- [x] Changing f or k reseeds; click/drag drops seeds; Perturb adds seeds without wiping : Code check, exercised in pw.mjs.
- [x] Colour scale fixed (v * 2.5 into a fixed LUT, clamped) : Code check.
- [x] Reduced motion: starts paused with a 1,500-step precomputed pattern : Code check and pw.mjs.

### Figure 2 (parameter map)

- [x] Map built from real runs (no canned image) : Computed. runTile() runs at load; progress readout "All 280 tiles computed (32x32 grid, 5000 steps each)".
- [x] Dark tile = seeds died : Computed. 108 dead tiles, v max < 0.01, LUT index 0 is dark navy.
- [?] "a flat orange tile" for the V-rich uniform state : Imprecise. Uniform tiles range from cream to dark red (v up to ~0.43, x2.5 clamps to the top of the amber LUT) (map.png).
- [x] Dashed curve is the exact bound : Derived (above); drawn from saddleNodeK().
- [x] Named presets checked in a 64x64 run : Computed. g2.mjs: all seven pattern at 64x64 after 10,000 steps (V>0.15 fraction 0.23-0.60).
- [?] Preset descriptions (tooltips): "Solitons: isolated self-replicating spots", "Worms: elongated blobs", "Stripes: stripe bands", "Coral: branching coral growth" : Partly off. Figure 1 screenshots: Solitons ends as spots plus short worms; Worms as long worms; Stripes (0.055, 0.062) as a tangle; Coral (0.055, 0.064) grows as branching lines early but settles into parallel stripes. Names are informal (not Pearson's Greek-letter classes, which the page never uses).
- [x] Pearson 1993 cited for the model's pattern variety : Sourced. Science 261:189 abstract: "a surprising variety of irregular spatiotemporal patterns ... spots that grow until they reach a critical size, at which time they divide in two". Pearson's 12 classes were Greek letters (mrob.com xmorphia glossary / Pearson classes page, via search).

### Figure 3 (grow the tissue)

- [x] 14 separate 1D runs of 40,000 steps, measured peaks : Computed/code (LS = 40..300 by 20).
- [x] Exact steady state C = cosh((L-x)/lambda)/cosh(L/lambda) with no-flux far end : Derived (C(0) = 1, C'(L) = 0, C'' = C/lambda^2). Boundary formula L - lambda acosh(T cosh(L/lambda)) matches.
- [x] Readout at L = 200: 12 peaks, mean spacing 16.6; source-sink 67 and 133; decay-length 16 and 44 : Computed. Matches g34.mjs and lambda ln(3/2) = 16.2, lambda ln 3 = 43.9.

### Figure 4 (noise)

- [x] Ten embryos of 200 cells each; peak threshold 0.15; readout measured from the rows : Code check. Readout counts peaks from the noiseless V profile, not the noisy reading; the rows show the noisy reading. Minor, left.
- [x] Readout "dose alone predicts lambda*sigma ~ 8.0" vs measured SD : Computed. SD 7.9-9.0 over four embryo sets.

### Anti-slop pass

- Em dashes: none. No cards or callouts; status lines are one-line readouts.
- Figure 1 hover-only tooltip on the map (f, k) is also shown on click in the status line; preset pills are buttons (keyboard).

## 13 Excitable media

File: docs/emergence/13-excitable-media.html. Checked 2026-09-25. Scripts (scratchpad w13-14/): eng13.cjs (extracts fhnRestingState + ExcitableEngine from the page), fig1.cjs (Fig 1 stability/period sweep), kick.cjs (excitable threshold), sp13.cjs and sp13b.cjs (original periodic engine: wave speed, APD, collision, pacing, spiral scenarios, readouts), sp13c.cjs / sp13d.cjs / s1s2.cjs / sweep.cjs / pace2.cjs (reruns on the fixed no-flux engine), pw.mjs and pw13.mjs (Chromium sweep and interaction path). render-check: PASS (before and after).

### Prose and equations

- [?] "FitzHugh-Nagumo equations are the simplest model" and no equations anywhere on the page (`272`) : Unverifiable to a reader. Model du/dt = u - u^3/3 - v + I, dv/dt = eps(u + a - b v) lives only in a code comment (`546`). "Simplest" is contestable (Barkley, Greenberg-Hastings). FitzHugh 1961 (Biophys J 1:445) and Nagumo, Arimoto, Yoshizawa 1962 (Proc IRE 50:2061) citations confirmed by search this session.
- [x] BZ activator is bromous acid, slow variable the oxidized catalyst whose reaction releases bromide (`273`-`275`) : Sourced. Field and Noyes 1974, J Chem Phys 60:1877 (BioModels BIOMD0000000040 record read): X = HBrO2, Y = Br-, Z = Ce(IV); Oregonator step V (B + Z -> f/2 Y) is the oxidized catalyst reacting with organic acid to give bromide (Wikipedia Oregonator page read). Wording "reduction releases the bromide" is loose but right in substance.
- [x] Heart: membrane voltage and lumped recovery variable (`275`) : Derived. Standard FHN reading.
- [x] "With the steady drive used in Figure 1, the trajectory traces a limit cycle" (`280`) : Computed. fig1.cjs: I = 0.5, a = 0.5, eps 0.02: sustained oscillation, period 114.15 time units (761 steps at dt 0.15).
- [x] Stability of the fixed point decides tick vs rest (`281`) : Derived/Computed. Trace 1 - u*^2 - eps b; fixed point stable from a = 0.859 (eps 0.02), 0.865 (0.005), 0.835 (0.08).
- [ ] Reagent list "(cerium, malonic acid, bromate, sulfuric acid) ... spread into a thin film, organizes into turning spirals" (`262`) : WRONG emphasis. Waves and spirals were reported in the ferroin-catalyzed Zhabotinsky-Zaikin reagent (Zaikin and Zhabotinsky 1970 Nature 225:535 summary; Winfree 1972 Science 175:634 abstract: spirals appear where a wave is broken). Cerium is the stirred-oscillator recipe (Field, Koros, Noyes 1972 JACS 94:8649). Spirals do not simply "organize" from a thin film; they need a broken wave.
- [?] "spirals cause ventricular tachycardia and, if they shatter, fibrillation" (`264`) : Overstated. Davidenko et al. 1992 abstract (Europe PMC, read): re-entry "could be the result of spiral waves". Needs hedge and citation.
- [?] "Stirred in a beaker, the BZ solution ticks between yellow and clear" (`323`) : Unsourced as written. True for cerium: Ce(IV) yellow, Ce(III) colorless (WUSTL "Phenomenology of the BZ reaction" page, found this session).
- [ ] "The FHN model is a qualitative reduction of the full Oregonator scheme" (`324`) : WRONG. FHN is FitzHugh's reduction of Hodgkin-Huxley-type nerve dynamics; it shares the Oregonator's fast-slow shape but is not derived from it.
- [?] "Recipes for wave experiments are tuned just short of oscillating" (`330`) : Unverifiable; Zaikin and Zhabotinsky's own title calls their system self-oscillating. The simulation part is true: I = 0, a = 0.5 is stable (trace -0.078) and a point fires only when pushed; below a ~ 0.46 the rest state goes unstable (fig1/sp13 "osc": a = 0.45 fires spontaneously, 0.48 does not).
- [x] Colliding BZ waves annihilate; refractory trail (`337`-`339`) : Computed. sp13 collide: two page pokes, excited 18777 at step 500, 0 by step 1000 and after; no rebound.
- [x] Linear water waves pass through each other (`339`) : Derived (superposition).
- [ ] Myocyte "stays refractory while pumps reset the ion gradients" (`383`-`384`) : WRONG mechanism. Refractoriness comes from sodium channels staying inactivated until after repolarization (Klabunde, Cardiovascular Physiology Concepts, "Non-pacemaker action potentials: refractoriness", read). Rest of the sequence (Na upstroke, Ca entry, K repolarization) matches Klabunde.
- [x] Pulse rolls down a row and cannot reverse because trail is refractory (`388`-`389`) : Derived from Fig 3 code (excited cells excite resting neighbors only; refractory 30 steps).
- [ ] "A pacemaker ... fires at a steady rate, and every cell fires once per beat" (`415`) : WRONG at default. sp13b pace: at pacing 90 steps, 66 pokes in 6000 steps but only 11 upstrokes at (30,30); the cell stays above u = 0.3 for 236 steps (APD) and v > 0.3 for 83 more, so default pacing blocks 5 of 6 stimuli.
- [x] Pace faster than refractory and some pulses fail (`415`-`416`) : Computed (true at every slider value, which was the problem).
- [?] "Circular waves die at the boundaries" (`454`) : False for the simulation: engine used periodic boundaries (`805`-`812`), so there are no boundaries; waves wrap and annihilate with themselves. True for a real dish.
- [x] Broken front curls into a rotating spiral (`454`-`455`) : Computed. sp13b break: 1 persistent spiral, probe periods converge to 470 steps.
- [?] "emits wave after wave ... indefinitely" (`455`-`456`) : Only true on the torus. Davidenko 1992 abstract: drifting cores "dissipated at a tissue border".
- [x] Several spirals coexist (`460`) : Computed (sp13d many: 4 to 11 tips held constant for 10000 steps).
- [?] "compete for territory" (`460`-`461`) : Not shown; no drift or takeover observed in any run.
- [x] A single spiral fires the tissue faster than the sinus node (`461`-`462`) : Sourced. Fenton et al. 2002 Chaos 12:852 abstract (arXiv nlin/0204040, read): re-entrant waves recirculate "at a higher frequency than the waves produced by the heart's natural pacemaker". Davidenko 1992: ~180 ms, 3-5 times normal heart rate.
- [ ] "If the spiral fragments, the tissue fibrillates" (`462`-`463`) : Overstated as fact; breakup is one mechanism (Fenton 2002 abstract lists many). Gray, Pertsov, Jalife 1998 Nature 392:75 abstract (Europe PMC, read) finds fibrillation sources as phase singularities at a few sites.
- [x] S1-S2: planar S1, premature S2 on the recovering tail, spreads only into recovered tissue (`467`-`469`) : Derived as a description of the protocol.
- [?] "The S1-S2 protocol creates re-entry in a lab preparation" (`467`) : Unsourced.
- [x] Zaikin and Zhabotinsky 1970 traveling waves (`519`) : Sourced. Nature 225:535-537, 1970.
- [x] Winfree 1972 spiral waves (`520`) : Sourced. Science 175:634.
- [x] When Time Breaks Down (1987), heart as excitable medium, topology (`520`-`521`) : Sourced. Princeton UP 1987; Science review and publisher blurb read (vortices of rotating electrochemical activity in cardiac tissue, topological reasoning).
- [?] "A defibrillator works by depolarizing most of the heart at once, so that no wave has recovered tissue" (`522`-`523`) : Stated as settled mechanism; needs a source. Zipes et al. 1975 Am J Cardiol 36:37 (abstract read): fibrillation terminated by depolarizing a critical mass of myocardium.
- [ ] "same mathematics describes slime-mold aggregation, calcium waves on egg surfaces, cortical spreading depression in migraine, and forest-fire fronts" (`527`-`528`) : Two of four unsourced/loose. Slime mold (Tomchik and Devreotes 1981 Science, cAMP concentric and spiral waves, abstract read) and calcium (Lechleiter et al. 1991 Science 252:123, spiral Ca waves in Xenopus oocytes, abstract read) hold; CSD and forest-fire fronts not sourced.

### Figure 1 (phase plane)

- [x] Dashed curves are the nullclines, crossing at the fixed point (`316`) : Computed. Code draws v = u - u^3/3 + I and v = (u + a)/b; Newton fixed point.
- [ ] "When it sits on the middle branch the cell oscillates; near the outer branches it rests until perturbed" plus slider "Excitability (a)" (`316`, `301`) : WRONG in practice. Slider 0.1-0.9 oscillates for a < 0.859 (eps 0.02), so the resting regime is a sliver (0.86-0.9) and there is no way to perturb it. Raising "excitability" a makes the cell less excitable.
- [x] u solid, v dashed time series (`316`) : Computed (render code).
- [?] State label "rising" (`633`) : Also shown on the down-stroke; misleading.

### Figure 2 (BZ dish)

- [x] Colours: orange spiked, dark purple refractory wake, deep blue rest (`374`) : Computed. colorBZ at rest (u -1.032, v -0.666) = rgb(17,20,135); refractory (u -1.5, v 1.5) = rgb(32,24,93); u = 1 gives (242,167,35).
- [x] Click deposits activator and launches a circular wave (`374`) : Computed. Front radius 21, 36, 51, 66 cells at steps 100-400 (0.15 cells/step).
- [ ] Slider "Excitability" 0.2-0.8 (`347`-`349`) : WRONG label and range. Higher a is less excitable; below a ~ 0.46 the whole dish self-oscillates.

### Figure 3 (1D cable)

- [x] Two pulses meet in the middle and annihilate (`410`) : Derived from code (three-state automaton, symmetric start).
- [?] "A 1D cable of cardiac cells" (`410`) : The cells are a three-state automaton (excited 6, refractory 30), not the FHN model; unlabeled.

### Figure 4 (paced sheet)

- [x] "The same FHN equations as the BZ dish, in cardiac colors" (`447`) : Computed (same engine and parameters, cardiac palette).
- [ ] "Waves from the corner pacemaker sweep across the tissue as orderly fronts" at default (`447`) : WRONG at default pacing 90: 5 of 6 stimuli are blocked; periodic boundaries also let fronts wrap.
- [ ] Heart-rate readout "83 bpm" from an assumed 8 ms per step (`1197`-`1201`) : WRONG. 8 ms/step makes the model action potential 1.9 s; the readout is the stimulus rate, not the tissue rate.
- [ ] "Waves launched" counter (`445`) : WRONG label; counts stimuli, most of which never propagate.

### Figure 5 (spirals)

- [ ] "Seed spiral pair plants two counter-rotating spirals" (`515`) : WRONG. Seed has four free ends; phase-singularity count 4 throughout 8000 steps (sp13c).
- [ ] "S1-S2 protocol runs the protocol above" (`515`) : WRONG. Activity dies by step 2000, no spiral (sp13b s1s2); the S2 disc (radius 10) is too small and at 60 steps lands in excited tissue.
- [ ] "Induce fibrillation shatters the medium into turbulence" (`515`) : WRONG. Random refractory background plus 40 pokes: excited count 0 by step 1000 (sp13b fib). Nothing survives.
- [x] "Defibrillate resets every cell to refractory, erasing the gradients" (`515`) : Computed. Code sets u -1.2, v 1.8 everywhere; activity 0 at step 1000 after both pair and fib states. Mechanism differs from the prose (depolarizing, i.e. exciting, cells).
- [ ] Firing-rate readout "Hz" (`1538`-`1548`) : WRONG. Counts rising edges of the total excited count, which is nearly constant for a spiral: shows 0.1 Hz for a spiral whose probe period is 470 steps.
- [ ] Regime label (`1550`-`1556`) : WRONG verdict. A plain spiral pair reaches 45% active tissue, above the 0.45 "fibrillation" cut; "tachycardia" needs >4 Hz, unreachable.
- [x] Click to stimulate, Quench erases locally (`474`) : Computed (Chromium).
- [ ] Canvas not keyboard-operable (`473`) : no tabindex or key handler.

### Anti-slop pass

- Em dashes: none (grep U+2014).
- Stats rows are one-line readouts, allowed; "Regime" label was a status badge in effect (cut).
- Document-level Space handler (`1232`-`1241`) toggled Fig 4 whenever it was on screen, even when a button in another figure had focus.
- d3 tick labels 10px (render sweep), below the 11px floor.

## 14 The Kuramoto model

File: docs/emergence/14-kuramoto-model.html. Checked 2026-09-25. Scripts (scratchpad w13-14/): k14.cjs (extracts sampleFrequencies, computeOrderParameter, kuramotoStep from the page), fig2.cjs (page protocol vs long runs vs theory, N = 50), fig3.cjs (time-averaged r, r range and frequency-locked clusters per distribution, N = 60), ff.cjs (page firefly model), ff2.cjs (Mirollo-Strogatz variant), ring.cjs / ring2.cjs / ring3.cjs (ring states, recovery, locking time), pw.mjs and pw14.mjs (Chromium). Strogatz 2000 read in full this session (PDF from stevenstrogatz.com, text extracted: s2000.txt). render-check: PASS.

### Prose and equations

- [?] "Set a roomful of metronomes on a shared platform and within minutes they lock into step" (`246`-`247`) : Overstated. Pantaleone 2002 Am J Phys 70:992 (abstract read): two or more metronomes on a freely moving base synchronize, generally in phase; nothing about a roomful or minutes.
- [x] Kuramoto 1975 model, N oscillators, own natural frequency, pulled toward the mean phase (`251`-`252`) : Sourced. Strogatz 2000 eq. 3.1 and 3.3: d theta_i/dt = omega_i + K r sin(psi - theta_i); ref [4] Kuramoto 1975, Lecture Notes in Physics 39, p. 420. Code (`486`-`491`) implements eq. 3.3.
- [?] "A single coupling parameter controls a sharp phase transition" (`252`-`253`) : True only for N -> infinity; the page's own Fig 2 is smeared at N = 50. Needs the qualifier.
- [x] At K = 0 they spread around the circle (`259`) : Computed (random initial phases, free running).
- [x] Past Kc, oscillators near the mean frequency lock first, cluster grows with K (`260`-`261`) : Sourced. Strogatz 2000 sec. 3.3 ("the oscillators near the center of the frequency distribution lock together ... more and more oscillators are recruited").
- [x] r measures coherence, 0 incoherent, 1 synced (`261`-`262`) : Derived from the definition.
- [?] "a phase transition like the onset of ferromagnetic magnetization" (`294`-`295`) : Unsourced analogy.
- [x] Lorentzian with half-width gamma, Kc = 2 gamma exactly (`295`-`296`) : Sourced/Derived. Strogatz 2000 eq. 4.5-4.7: Kc = 2/(pi g(0)); Lorentzian g(0) = 1/(pi gamma) gives 2 gamma (also stated in sec. 9).
- [x] r = sqrt(1 - Kc/K) in the many-oscillator limit via self-consistency (`296`-`298`) : Sourced. Strogatz 2000 after eq. 4.7: "Kuramoto [4,5] integrated (4.5) exactly to obtain r = sqrt(1 - Kc/K) for all K >= Kc."
- [x] The K picked in Fig 2 drives Fig 1 (`298`) : Computed (Chromium: drag and arrow keys update slider-K).
- [x] Narrow distribution syncs easily, wide resists (`310`) : Derived from Kc = 2/(pi g(0)).
- [x] Bimodal: two clusters around each peak rotating at different speeds, r beats (`311`-`313`) : Computed and Sourced. fig3.cjs K = 1.5, N = 60: frequency-locked groups of 32-35 at -0.7 and 22-27 at +0.7, r ranges 0.07-0.94 within the averaging window. Martens et al. 2009 PRE 79:026204 abstract (arXiv 0809.2129, read): "standing wave state, where two counter-rotating groups of phase-locked oscillators emerge"; similar results for two Gaussians.
- [x] "With the peaks here at +-1 that window is roughly K = 1 to 2; by K = 3 the clusters have merged" (`313`-`314`) : Computed. Two groups from about K = 0.8 (3 runs) to 2; at K = 2.1 3 of 6 runs merged, at 2.2-2.4 6 of 6; K = 2.5 and 3 all 60 locked in one cluster, r 0.87-0.93 constant. Conservative but true.
- [ ] "Southeast Asian fireflies blink in unison through pulse coupling" (`350`) : WRONG attribution of mechanism. Buck and Buck 1968 Science 159:1319 abstract (read via search): Pteroptyx malaccae in Thailand, period ~560 ms, synchrony "regulated by central nervous feedback from preceding activity cycles ... rather than by direct contemporaneous response". Pulse coupling is Mirollo and Strogatz 1990's model (SIAM J Appl Math 50:1645; abstract read via Crossref).
- [ ] "Raise the coupling and random twinkling organizes into traveling waves" (`351`-`353`) : WRONG for the figure. ff.cjs on the page model (additive phase advance, cap 0.999): global r 0.02-0.04 for coupling 0-0.05, 0.10 at 0.1, 0.34 at 0.15 (slider max) after 120 s; neighbor phase difference 0.23-0.26, same as random (0.25). No waves, no local order. Constant phase advance gives no synchronizing drive; Mirollo-Strogatz needs a concave charge curve.
- [?] "click to perturb a region and watch the field heal" (`353`) : Unverifiable: there is no ordered field to heal at any coupling.
- [ ] "Local coupling is slower to sync" (`386`) : Unverifiable as stated (slower than what, at what K?); not measured by any figure.
- [x] Ring can sustain traveling phase waves (`387`-`388`) : Computed. ring.cjs, 20 runs each, 250 s: at K = 1, spread 0.5, 20/20 lock, 4 of them twisted (winding != 0), r < 0.8. Sourced: Wiley, Strogatz, Girvan 2006 Chaos 16:015103 (twisted states with winding number q compete with sync).
- [x] ... and clusters at different tempos (`388`) : Computed. ring2.cjs: spread 1, K 0.5: runs of 7, 4, 3 neighbors sharing a tempo, e.g. 1.37 / 1.63 / 1.57 rad/s.
- [?] "neurons of a central pattern generator" (`385`-`386`) : Unsourced analogy.
- [x] Recovery faster at higher coupling (`392`) : Computed. ring.cjs recover (3 kicked, 40 trials): median return above r = 0.8 36 s at K 0.25 (2 of 40 were synced), 1.9 s at 0.5, 1.3 s at 1, 0.40 s at 1.5, 0.14 s at 2. Caveat: 2 of 21 at K 1.5 never recovered (kicked into a twisted state).
- [x] Millennium Bridge wobbled on opening day in 2000, pedestrians fell into step (`427`-`429`) : Sourced. Strogatz et al. 2005 Nature 438:43 abstract; Cornell Chronicle 2005 (read): opened 10 June 2000.
- [?] "modeled it in 2005 as a Kuramoto transition" (`429`-`430`) : Close; the abstract says "adapting ideas originally developed to describe the collective synchronization of biological oscillators". Reword.
- [?] "The fix was dampers, which kept the sway too small for the crowd to lock onto" (`430`-`431`) : Mechanism phrasing unsourced; Cornell Chronicle: reopened 2002 with 91 dampers; the paper estimates damping needed.
- [x] Footer references Kuramoto 1975 LNP 39:420, Strogatz 2000 Physica D 143:1, Strogatz et al. 2005 Nature 438:43 (`436`) : Sourced (Strogatz 2000 reference list; Nature abstract page).

### Figure 1 (circle)

- [x] 50 oscillators on a unit circle coloured by natural frequency, arrow length r (`266`, `288`) : Computed (code).
- [x] Raise coupling and they cluster (`288`) : Computed. Chromium at K = 3: r about 0.8.
- [?] Caption does not name the distribution or Kc; "Near Kc" preset at 1.0 is right only because Fig 1 uses gamma 0.5.

### Figure 2 (transition)

- [x] Dashed line at Kc = 2 gamma = 1, gray curve sqrt(1 - Kc/K) (`304`) : Computed (code).
- [ ] "measured points, each the mean of 5 runs of 50 oscillators" as evidence of the curve (`304`, `668`-`683`) : WRONG measurement. Runs last 300 steps x 0.03 = 9 time units and take the final r only; with 5 runs the curve is jagged and redrawn at random on every load. Node, page protocol: K = 0.8 -> 0.384, K = 1.0 -> 0.190 (non-monotone); long runs (T = 300, mean of second half, 40 runs): 0.254 +- 0.083 and 0.337 +- 0.142.
- [x] Below Kc measured r sits at order 1/sqrt(N), residual coherence of 50 random phases (`304`) : Computed/Derived. K = 0: 0.126 +- 0.009 (long runs); sqrt(pi/(4N)) = 0.125.
- [x] Above Kc the measurement tracks theory (implied) : Computed. Long runs: K = 1.5 0.600 vs 0.577, 2 0.687 vs 0.707, 3 0.822 vs 0.816, 4 0.862 vs 0.866, 6 0.925 vs 0.913, 8 0.920 vs 0.935.

### Figure 3 (distributions)

- [x] Four distributions: Lorentzian gamma 0.5, Gaussian sd 0.5, uniform [-1.5, 1.5], bimodal +-1 with sd 0.25 (`330`-`333`, `460`-`474`) : Computed (code).
- [x] "For the bimodal one, try K ~ 1.5 to see two clusters" (`344`) : Computed (see bimodal entry).
- [x] Histogram piles heavy-tail outliers into end bins and labels them (`900`-`901`) : Computed (code); label font 10px (below floor).

### Figure 4 (fireflies)

- [x] 40 by 30 grid, each dot flashes when its phase crosses threshold and nudges neighbors forward (`377`) : Computed (code). Note flashThreshold 0.95 constant declared but unused.
- [ ] Figure shows organisation into waves (`351`-`353`) : WRONG (see ff.cjs above).

### Figure 5 (ring)

- [x] Twelve oscillators, pies show phase, mean-phase arrow (`397`) : Computed (code).
- [x] Recovery timer reports when order returns above 0.8 (`423`) : Computed (code, Chromium 0.6 s after Perturb 3 at K = 1).
- [?] Timer never reports from a twisted state and gives no hint why (`1370`-`1374`) : Reader-facing gap.

### Anti-slop pass

- Em dashes: none.
- d3 tick labels 10px and histogram edge labels 10px (below 11px).
- Display equation at 390px: none existed; after adding one it needed a two-line layout.

## idx Series index

File: docs/emergence/index.html. Checked 2026-09-25 against the article pages as they stood in this worktree (several already carried other workers' audit fixes). Scripts: pwidx.mjs (Chromium 1200/390 x light/dark x reduced/no-preference: 14 cards, no console errors, no NaN, no overflow, all relative links resolve). render-check: PASS.

### Prose

- [x] Subtitle "Simulations of systems where large-scale behavior comes from simple local rules" (`138`) : Derived from the 14 articles.
- [?] "A flock of starlings turns together with no bird in charge" (`145`) : Loose. 02 (line 107, 234) says each starling reacts to a handful of neighbours (Ballerini et al.); "no bird in charge" is not stated anywhere. Reword to match 02.
- [x] "A traffic jam travels backward through cars that are all trying to move forward" (`145`) : Matches 03 (backward wave in IDM and Nagel-Schreckenberg).
- [x] "These fourteen essays" (`148`) : Computed. 14 cards, 14 article files; docs/index.html count field is 14.
- [ ] Mechanism list omits frustrated couplings (`148`) : WRONG by omission; 05 Spin Glass is the frustration essay and PROMPT.md lists it.
- [ ] "Each essay follows one mechanism through one or two models" (`148`) : WRONG for 01 (three rules), 08 (DLA, dielectric breakdown, rivers), 10 (four systems).
- [x] Ising, Life and lattice Boltzmann flow past a cylinder are in Simulating on a Lattice (`151`) : Checked. ../lattice-simulation/ has 03-life..., 05-lattice-boltzmann (6 mentions of cylinder), 06-ising...; link resolves.

### Cards

- [x] 01 one-dimensional rules, Langton's ant, Lenia (`218`) : Matches 01 subtitle and sections.
- [?] 02 "Boids and swarm robots" (`219`) : Swarm robots get one sentence in 02 (line 156); the essay's measured model is Vicsek (15 mentions). Alignment-against-noise clause matches.
- [x] 03 IDM and Nagel-Schreckenberg, backward wave (`220`) : Matches.
- [ ] 04 "domains grow like soap films" (`221`) : WRONG analogy for the article; 04 explains curvature-driven coarsening from ordered alloys (lines 265-268) and the borders locking straight.
- [ ] 04 "Listen only to people who already agree" (`221`) : WRONG for Deffuant bounded confidence (interaction when opinions differ by less than a bound; PROMPT: "nearly agree"). Note 04's own subtitle has the same wording.
- [x] 05 conflicting couplings, valleys trap a quench or hurried anneal (`222`) : Matches 05.
- [x] 06 fires and epidemics share a threshold; finite below, spanning above (`223`) : Matches 06.
- [x] 07 self-tuned critical state, avalanches of every size (`224`) : Matches 07 ("avalanches at every scale"); finite pile caps the size.
- [x] 08 DLA, dielectric breakdown, eroding river networks (`225`) : Matches 08 (erosion model present).
- [x] 09 spreads faster than diffusion, polymer exponent (`226`) : Matches 09.
- [x] 10 slime mold, ant trails, footpaths, termite pellets (`227`) : Matches 10 (lawn paths, pellets).
- [x] 11 well-mixed Lotka-Volterra and what space changes (`228`) : Matches 11.
- [x] 12 Turing sets its own wavelength, gradients can scale (`229`) : Matches 12 subtitle.
- [ ] 13 "target waves" (`230`) : WRONG; 13 shows single circular waves and paced fronts, never target patterns.
- [x] 14 scattered frequencies lock above a critical coupling (`231`) : Matches 14. Title "Kuramoto Model" differs from the page's "The Kuramoto Model" (cosmetic).

### Vocabulary

- Five-role list is descriptive, no checkable claims beyond the examples, which all appear in the series.

## Fix pass

2026-09-25, one or two commits per page on this branch. Each page was verified after its
fixes with render-check and a Playwright sweep at 1200px and 390px, light and dark,
reduced motion on and off: no console errors, no NaN, undefined or Infinity on screen,
no horizontal overflow, no SVG text under 11px, every control exercised by click and
keyboard. Relative links from every page resolve, and no page contains U+2014.

One follow-up outside the 04 worker's pass: the 04 subtitle said the bounded-confidence
agents listen "only to people who already agree with you"; it now says "whose opinions
are already close to yours" and "a roughly predictable number of camps" (commit 32a9e3c).

### Fix record: 01-cellular-automata.html

Scripts (scratchpad w01-02/): eca.cjs, ant.cjs, ant2.cjs, v01.cjs, hist.cjs, front.cjs, mu12.cjs, adapt.cjs (node; Lenia engine, orbium and runCase extracted from the page by load01.cjs), pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference, all controls). render-check PASS. U+2014 count 0. No model code changed.

**LEDGER [ ] and [?] entries**

- [ ] Class I "patterns die out": fixed in prose ("rules that settle into a uniform state", NKS p. 231) and in the class-tag blurb ("uniform state"). The class sentence now says the sorting is "by how they behave from random starts".
- [?] "no known method predicts the onset short of running the ant": cut.
- [?] "every finite start tried so far does": reworded "Whether every finite start ends on a highway is an open conjecture; the experiments so far suggest it does" (Gajardo, Moreira, Goles 2002).
- [?] mu 0.12 "fills the whole field": reworded "within about twenty time units the whole field is covered in a speckle of small, frozen spots" (node: 35x mass by t = 20, static, 17% of cells above 0.1).
- [ ] sigma 0.015 fine-T explanation: rewritten. The map result stays (survives at T 5, 10; dies at 20, 50 for R >= 10). New text: Davis and Bongard (2022) report Lenia gliders failing at step sizes too small as well as too large; here the parameters are not what fails, since an orbium first run at sigma 0.017 with T = 20 or 50 and brought down to 0.015 keeps gliding at about 0.91 of its starting mass; what dies is the catalogued T = 10 shape, which at finer T must settle into a smoother, lighter form (Chan's trend) and does not survive the change near the edge of its island. Added: Chan's own resolution tests used sigma 0.016, where every run here with R >= 10 and T >= 5 survives (node: masses 0.93-0.98).
- [?] Fig 4 "Amber: grew without bound": now "Amber: more than doubled its mass" (the code's threshold).
- Added a references line to the footer: Wolfram NKS ch. 6; Cook 2004; Langton 1986 (Physica D 22, 120); Bunimovich and Troubetzkoy 1992 (J. Stat. Phys. 67, 289); Gajardo et al. 2002 (Discrete Appl. Math. 117, 41); Chan 2019 (Complex Systems 28, 251) and his animal catalogue; Davis and Bongard, ALife 2022.

**Layout fixes found in the browser pass**

- SVG text under 11px: ant chart ticks 8.4px (1200) / 7.1px (390), kernel and growth plots 9.4-9.9px, survival map 7.9-9.1px. Added a small fitter that sets each text's font size from its SVG's viewBox scale (min 11.5px on screen), refit on resize and when the map redraws. Ant chart margins widened (left 60, bottom 44) so the larger ticks don't collide with the axis titles; x ticks now read 0, 2k, ... instead of "0k".
- Survival map y-axis title "(finer space ->)" was clipped at 390px; shortened to "R, kernel radius in cells".
- Fig 3 caption said "Upper right / Lower right" but the panels stack on a phone; now "Beside the field (below it on a phone)".

**New numbers now on the page**

- 0.91: mass ratio of an orbium relaxed at sigma 0.017 (T 20 or 50) and then run at 0.015 for 30 time units (node: 0.91-0.92).
- sigma 0.016: all runs with R >= 10, T in {5, 10, 20, 50} survive (0.93-0.98).
- mu 0.12: field covered "within about twenty time units".

**Verification**

- Chromium, 8 configurations (after fixes): no console errors, no NaN/undefined/Infinity, document overflow 0, no SVG text under 10.9px effective (was 88 texts per config). Controls exercised: preset select (30, 184), Random start, Single cell, Step, Run/Pause, truth-table cell by Enter and Space, rule number input, ant slider Home/End/Arrow, Play/Pause, Reset to 0, chart drag, Lenia canvas arrow and Shift+arrow probe, three view buttons, mu and sigma sliders at both ends, Play/Pause, Reset, both sigma buttons in Fig 4, map square by keyboard Enter, state levels 4 and continuous, Replay. Figure 4 map in the browser matched the node map cell for cell at sigma 0.015.

Not fixed: the Rule 90 and 184 class assignments are checked against Wolfram's definitions and the figure's behaviour, not against a primary table. The Bunimovich-Troubetzkoy result is cited through Gajardo et al.; the 1992 paper itself is paywalled.

Commit: 1e9b4bb

PROMPT change: none (the Fig 4 argument about fine time steps changed in prose; the figure is unchanged)

### Fix record: 02-flocking.html

Scripts (scratchpad w01-02/): v02.cjs, frz.cjs, clump.cjs, clump2.cjs, clump3.cjs (node, model code extracted from the page by load02.cjs), pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference, all controls). render-check PASS. U+2014 count 0. No model code changed; every live number (phi-random, bg-on/off, eta*, frozen-max, moving-max, mean-deg, giant-frac) is still computed at load.

**LEDGER [ ] and [?] entries**

- [?] "No bird leads a starling murmuration": reworded to "Each starling in a murmuration reacts to a handful of nearby birds, not to the flock as a whole" (Ballerini 2008).
- [ ] Alignment off "still gather the boids into clumps": fixed. Prose now says that at the default weights the boids stop gathering too (1.7 neighbours within 25 units against 1.4 for random positions, node), so alignment also holds this flock together; and that cohesion alone gathers them when strong: alignment 0, separation 0, cohesion 2, radius 100 puts 139-148 of 150 boids in one swarm churning with phi 0.06-0.09 (node, 5 seeds).
- [?] Swarm-robot "common aggregation controller": reworded as a statement about the rules ("A controller that only moves each unit toward the neighbors it detects while keeping a collision buffer ... gathers units into a pile like that one"), pointing at the cohesion-only setting just described. No unsourced claim about robotics practice remains.
- [?] Bands "appear only once the box is several times wider than a band": replaced with what Gregoire and Chate show: smooth curves attributed to strong finite-size effects, bands shown in boxes hundreds of interaction radii across (up to 1,024).
- [ ] "the frozen curve shows the same principle at small scale": fixed. Now "the frozen curve above fails for the simpler reason in the previous paragraph: its network is in pieces" (21% giant cluster).
- [?] "A fixed-count rule keeps the neighbor network connected": reworded to Ballerini's own claim (fixed-count interaction held a group together far better than fixed-radius under density changes), then tied to the page's percolation point.
- [?] Fig 2 trace canvas labels at 10px: now 11px.
- [?] Fig 3 SVG text below 11px and label overlap at 390: all Fig 3 text now uses a font size computed from the viewBox scale (>= 11.5px on screen); at narrow widths the "6" tick is dropped (it collided with "2π") and "random headings" sits at the left end of its line instead of over the data.

**Verification**

- Chromium, 8 configurations: no console errors, no NaN/undefined/Infinity, document overflow 0, no SVG text under 10.9px effective (was 15-19 per config). Controls exercised: all four boid sliders Home/End by keyboard, Scatter, eta and v0 sliders Home/End/Arrow, Randomize, click on the Fig 3 chart (moves Fig 2's slider and the marker), Re-run left to finish (32 runs).
- Live values in the runs: eta* 2.0-2.2, frozen max 0.18-0.47, moving max 0.96-0.99, mean degree 3.2, giant cluster 21%, bg-on 0.99, bg-off 0.08.

Not fixed: bg-off prints 0.08 in Chromium and 0.05 in node for the same seeds (floating-point divergence in a chaotic run; both inside the 0.04-0.11 seed range). The frozen-max readout swings between runs (0.18-0.65 over 10 node sweeps); the prose only compares it with the moving maximum, which it always trails.

Commit: 0717eb1

PROMPT change: none

### Fix record: 03-traffic-shockwaves.html

Commit cee23eb. Scripts in scratchpad w03-04/ (eng03.mjs extracts the page engines; t1-t10 as in the ledger). Verification: render-check PASS; pw.mjs at 1200/390 x light/dark x reduced/no-preference, every slider to both ends by keyboard, every button by Enter and by click: 0 console errors, no NaN/undefined/Infinity, no em dash, no horizontal overflow, no SVG text under 11px effective, no SVG text outside its SVG, in all 8 configurations. click03.mjs: ring-canvas click brakes a car; stability-map click moves Figure 1 (N 75, a 1.50). Relative links (index.html, 02-flocking.html, 04-coarsening-and-consensus.html) resolve.

**LEDGER [ ] and [?] entries**

- [ ] Fig 1 "grows over several simulated minutes": caption now says cars in the jam stop about 25 simulated minutes in (under a minute of watching), and that the readout reports once speeds differ by more than 4 m/s. Reduced motion now pre-runs 1600 s instead of 400 s, so the static state shows the developed jam (readout "0-64 km/h, wave speed -14 km/h").
- [?] Fig 2 hollow dots: "just inside the edge, especially near the tip" (8 of 9 disagreements are at a = 1.0 to 1.2).
- [ ] "At the highest densities ... changes little with the gap": replaced. Now: the band runs to bumper-to-bumper below about a = 0.9 m/s^2 and disappears above about 1.26 m/s^2 (computed tip).
- [ ] "Standard highway values put a near 1, close to the tip": replaced with Treiber, Hennecke and Helbing's Table I values (a = 0.73, v0 120 km/h, T 1.6 s, b 1.67), which sit well inside the tongue with this page's settings.
- [?] "one reason the model fits real traffic well": cut.
- [?] "Anywhere inside the unstable band": now "once cars in the jam come to a full stop", plus a sentence that near the band edge the wave never stops the cars and moves back more slowly.
- [?] "tens of kilometres" and [?] "10 to 20 km/h (Treiber and Kesting)": paragraph rewritten: Kerner and Rehborn 1996 (about 50 minutes over a 13 km stretch), about 15 km/h characteristic speed attributed to Treiber et al. 2000, Sugiyama's roughly 20 km/h. Treiber-Kesting reference removed (no longer cited).
- [ ] NaSch "front recedes at 1 - p ... -0.74 / -0.48 ... -20 km/h": paragraph rewritten. Keeps the 1/(1 - p) wait and says the packed edge of a fresh jam recedes at that rate (-0.75 at p = 0.25), then explains why whole jams are slower and gives the measured -0.57 (p = 0.25) and -0.35 (p = 0.5) cells per tick, the outflows 0.53 and 0.32 cars per tick, notes this is how Nagel and Schreckenberg estimated wave speed, and converts -0.57 to 4.3 m/s = -15 km/h.
- [?] "IDM dots fall well below": "about 10 to 15 percent below, less near the band's edges".
- [ ] "jams that drain at only 1 - p cars per tick": "jams whose outflow is only about 0.53 cars per tick, against 0.83 at p = 0".
- [ ] SVG text under 11px: Figures 2 and 4 now size their viewBox to the container width (min 300), so one unit is one CSS pixel; all tick and label fonts 11.

Also: Sugiyama sentence now gives the measured backward speed (roughly 20 km/h, sourced); single-car value printed as 4.75.

**New numbers on the page**: ~25 simulated minutes to full stop; a = 0.9 and 1.26 m/s^2 tongue limits; a = 0.73 (Treiber 2000); 50 min / 13 km (Kerner and Rehborn 1996); 15 and 20 km/h (Treiber 2000, Sugiyama 2008); -0.75, -0.57, -0.35 cells/tick; 0.53, 0.32, 0.83 cars/tick; 4.3 m/s, -15 km/h; 10 to 15 percent.

Not fixed: Figure 2's click-to-move is mouse-only (Figure 1's sliders reach the same state by keyboard). The "gain exceeds one" framing of Wilson's long-wavelength criterion is left as is.

PROMPT change: none

### Fix record: 04-coarsening-and-consensus.html

Commit 6a0c208. Scripts in scratchpad w03-04/ (eng04.mjs extracts the page's model functions; u1-u4 as in the ledger). Verification: render-check PASS; pw.mjs at 1200/390 x light/dark x reduced/no-preference, every slider to both ends by keyboard, every button by Enter and by click (both update rules, both grid sizes, both sweeps, play/step/reset): 0 console errors, no NaN/undefined/Infinity, no em dash, no horizontal overflow, no SVG text under 11px effective, none outside its SVG, in all 8 configurations. figshots at 390 dark reduced: Figures 3 and 5 legible, dark bars still darker than light ones. Relative links (index.html, 03-, 05-, ../lattice-simulation/06-ising-z2-breaking.html) resolve.

**LEDGER [ ] and [?] entries**

- [?] Sync vote "without ties nothing moves it": added "(In about one run in seven a few cells are left blinking back and forth between two states instead.)" (27/200 runs).
- [?] Sync "freezes within about 20 to 30 steps": now "20 to 40" (median 25, 5th-95th percentile 20-36).
- [?] "grain growth in annealed metals" / "alloys and foams": now "worked out for antiphase domains in ordered alloys; the same law holds for domains in a quenched magnet" and "alloys and magnets".
- [?] "move halfway toward each other": now "both move to the midpoint of their two opinions".
- [?] "the estimate Weisbuch and colleagues gave": now "the rough bound Deffuant and colleagues gave in their original paper", with "allows at most about 1/(2 eps)"; Weisbuch et al. 2002 dropped from the references.
- [ ] "tracks 1/(2 eps) closely from about eps = 0.1 upward and falls a little short below that": replaced with "follows the shape of 1/(2 eps) but sits 10 to 15 percent below it for eps up to about 0.2, which is what a bound on the number of camps should do: clusters often form further apart than the minimum spacing". Untested end-cluster explanation cut.
- [ ] SVG text under 11px: CSS rule `svg .tick text { font-size: 11px; }` and all legend text 11 (Figures 2, 3, 5); Figure 3 legend wrap width and Figure 5 legend offset adjusted for the larger text.

Also: Figure 2 caption now gives the measured spread and mean ("between about 0.42 and 0.55 and averages 0.48, a little below 1/2; fits over only the early sweeps ... come out lowest (about 0.47)").

**New numbers on the page**: one run in seven blinking; 20 to 40 steps; 0.42 to 0.55, mean 0.48, early-window 0.47; 10 to 15 percent below 1/(2 eps).

Not fixed: Figure 1 animates if a reduced-motion reader presses Play (user-initiated, no autoplay). The page uses its own IntersectionObserver helpers rather than Motion.onVisible; behaviour is equivalent (pauses off screen).

PROMPT change: none

### Fix record: 05-spin-glass.html

Commit 6e3cd40. Verification: w05-06/fig3.mjs and anneal.c/agg.mjs (model reruns, numbers below), w05-06/pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference: flips by click and keyboard, both randomize buttons, cooling slider Home/End, speed End, two anneals with pause, hand flip and resume, run-chip recall, reset, clear runs, ferro/glass toggles, new bonds, arrow-key valley stepping, hover preview). render-check PASS. No console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11px, no em dashes, relative links resolve, in all 8 configurations.

**LEDGER [ ] and [?] entries**

- [ ] "loops of odd length": fixed to "any loop of people containing an odd number of rival pairs".
- [?] "High T accepts almost anything": now "At T = 5 about four proposed flips in five are accepted" (79.3% measured); low end reworded "only downhill and level moves survive".
- [ ] 1000-sweep "between half and nine tenths": now "about four runs in five down to it on a typical draw, but anywhere from under half to all of them" (median 0.815, p10 0.475, max 1.00). The paragraph now says the comparison is against the true ground state, checked offline over 120 draws by enumerating 2^29 configurations with 400 anneals per setting. 10-sweep claim restated as "about three runs in four one to four bonds above the ground state" (median 0.73).
- [ ] Degeneracy "a handful to several dozen": now "a typical draw has about nine distinct ground-state configurations ...; one draw in ten has a single one, and one in ten has more than forty" (median 9, p10 2, p90 44).
- [?] "quench, which is the majority rule again": now "(the majority rule again, except that a flip that changes nothing is never taken)".
- [ ] Valley count "rises from 37 to between about 40 and 150": now "usually rises: over 200 draws the median was 75 valleys, and nine draws in ten gave between 37 and 134". Ferro sentence now states the 37 and "one or two walls running edge to edge" (verified: all 192 stuck ferro configurations have 1-3 domains, every domain touches the edge).
- [x] "sometimes shared": sharpened to "In about half the draws" (54.5%).
- [ ] Quench share "one in fifteen to one in four": now "about one in seven on a typical draw (between 4% and 29% in nine draws of ten)" (median 0.14, p5 0.042, p95 0.29).
- [?] Parisi paragraph: now quotes the Nobel citation and prize split ("received half"), names the SK model and replica symmetry breaking, attributes the hierarchy to Mezard et al. 1984, and cites Amit-Gutfreund-Sompolinsky 1985, Sourlas 1989, Mezard-Parisi 1986 inline and in the references. "His replica methods" softened to "the same ideas" (Sourlas's code paper is a spin-glass mapping).
- [ ] Fig 1 spin glyphs 9px at phone width: minimum raised to 11px.
- [ ] Fig 3 "never reached" 9px: now 11px. Axis tick labels (d3 default 10px, temperature axis set to 10) raised to 11px by a page CSS rule.
- [?] Reduced motion in Fig 2: with Motion.reduced() a run now completes in one frame and shows the final state.
- Also fixed: Fig 3 ResizeObserver redrew the chart on height changes caused by the hover preview; it now redraws only on width change.

**New numbers on the page**

79.3% acceptance at T=5 ("four in five"); 120 draws x 400 runs; 10 sweeps: three in four 1-4 bonds above ground; 1000 sweeps: four in five reach ground, range under half to all; degeneracy median 9, one in ten single, one in ten over forty; 37 ferro valleys; glass median 75, 90% range 37-134; half of draws with shared ground valleys; quench share one in seven, 90% range 4%-29%.

Not fixed: randomness is unseeded (Math.random), so Figures 1-3 show a new bond draw per load; the prose gives ranges over draws rather than the loaded draw's values, which the readouts supply.

PROMPT change: none

### Fix record: 06-percolation.html

Commit 7cc8005. Verification: w05-06/fire2.mjs (Fig 1 model extracted from the fixed page), perc.mjs and fig4.mjs (Figs 2-7), w05-06/pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference: density Home/End, all three presets each ignited at center, left-edge ignite, random ignite, Step, Play/Pause, Reset, canvas click, all five wind buttons, ignition/speed/wind sliders Home/End; Fig 2 trials slider, Run sweep, arrow keys and drag on the plot; Fig 3 density slider Home/End/arrows and Regenerate; Fig 5 all three lattice sizes, trials slider, Run sweep; Fig 6 all three regimes, three sliders Home/End, Pause/Resume, Reset stats), figshot.mjs (figure screenshots light 1200 and dark 390). render-check PASS. No console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11px, no em dashes, relative links resolve, in all 8 configurations.

**LEDGER [ ] and [?] entries**

- [ ] Ignition rule not as described: fixed in the code to match a clean rule, and the prose now describes it: "A burning tree burns for one step. In that step it gets one chance to light each neighboring tree, succeeding with the ignition probability, and then it is ash." Each tree-tree link is tried at most once, so the burn is a mixed site-bond percolation cluster. Node, 150x150, center ignition: at density 100% the fire's dividing line in ignition is 50% (mean burned 0.1% at 40%, 26% at 50%, 92% at 60%), the square-lattice bond threshold; the caption now says so.
- [?] Presets: retuned and described. Dry & calm 70%/100% (burns 93-98%); Damp 80%/55% (a spark fizzles, 0.4% from center); Windy 80%/55%/east 0.8. Prose: lit from the left edge the windy fire burns about three quarters of the trees (76%, 60 runs) against about 3% with the wind off (3.5%).
- [?] Ignite did nothing until Play: igniting (click or buttons) now starts the fire; under reduced motion the fire burns to completion at once and shows the final state. Double-start guarded.
- [?] Fig 2 "several trials" and duplicate densities: density grid built from whole percents (no duplicates); caption states the default 15, adds that 1500-forest runs cross 50% burned at 0.593 on this grid, and names the keyboard control.
- [ ] Fig 4 straight line claim vs raw counts: Figure 4 now plots log-binned clusters per unit size (doubling bins, count divided by sizes covered) with a dashed reference of slope -187/91 drawn through the 8-15 bin; y label "Clusters per unit size", ticks '~g'. Prose: near the threshold the points are close to straight; well below, at 45%, they bend past a few dozen trees (-1.52 small vs -2.95 large); new paragraph gives the exact exponent 187/91 (Mertens and Moore 2018, eq. 8, read this session) as lattice-independent in 2D and the finite-size caveat: one 150-wide forest near 59% gives about 1.8 (100-forest mean 1.73-1.75).
- [?] "coffee ... resistor networks": cut. Replaced by "the exponents of the power laws do not depend on the lattice at all" and inline citations: Newman and Ziff 2000 (0.59274621), Sykes and Essam 1964, Kesten 1980.
- [?] "a mapping Grassberger made precise": now "a correspondence first pointed out by Grassberger (1983) for exactly this case of a fixed infectious period" (Newman 2002 added to references).
- [ ] "forest thickens toward the connectivity threshold": rewritten. On this grid the density settles near 0.39 (critical preset 0.386-0.388), well below 0.593; the forest is a patchwork of patches far below and far above the threshold (Grassberger 2002), fires of every size come from patches of every size, and whether the model is truly critical in the limit is still argued.
- [?] "hovers near criticality": folded into the rewrite above.
- [?] Small-fire preset "thin and patchy": now "growth only fifty times the lightning rate ... in our five-minute runs the largest burned about 2,000 trees" (1,793-2,498). Large preset "about 8,000 of the grid's 10,000 cells" (8,037-8,402).
- [?] "every scale the grid can hold": now "from single trees to about a third of the grid" (max 3,011-3,714).
- [?] Exponent drift: symbol changed from tau to alpha (prose, KaTeX, live readout) to avoid clashing with the literature; now "about 1.1 to 1.2 after a minute and 1.2 to 1.3 after five" (page fit, 6 runs) and "Grassberger (2002), on grids up to 65,536 wide, finds an effective value near 1.19 that keeps shifting as lightning gets rarer (he writes it as tau - 1, with his tau the exponent of the cluster-size distribution)".
- [ ] Closing paragraph "drive the system to that edge and hold it there": now "slow growth and fast burning produce fires of every size without anyone setting the density, even though the average density stays well below that value."
- Axis tick labels raised from d3's 10px to 11px by a page CSS rule.
- References added: Sykes and Essam 1964, Newman 2002, Grassberger 2002, Mertens and Moore 2018.

Not fixed: the Fig 5 "Tc = 1/2" label sits on the red line and the mean curve at 390px (legible, crowded). Randomness is unseeded; all quoted numbers are averages over many runs, not the loaded instance. The Fig 6 density readout counts trees before the fires of that step finish (a one-step lag, not visible at the two-decimal readout).

PROMPT change: Figure 1's fire rule changed (burning cells now burn one step with one try per neighbor) and the Drossel-Schwabl argument no longer says the forest self-tunes to p_c; the prompt's "lets trees regrow" line still fits, but a regenerated series should be told the DS density sits near 0.4, not at the percolation threshold.

### Fix record: 07-sandpile.html

Commit 2dc5455. Verification: s07a/s07c rerun against the page model (numbers below); render-check PASS; pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference, every button clicked twice, sliders to End/Home by keyboard, canvas Enter and click, identity toggles, spectrum signal toggles and New run): all 8 configs clean, no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11px, U+2014 count 0. pw07b.mjs default state: autofill 50,000 grains, 12,816 recorded, tau 1.08; spectra +0.04 (size per grain) and -1.62 (topplings per step); 20 s of auto-drop at speed 50: tau 1.08, mean height 2.11.

**LEDGER [ ] and [?] entries**

- [ ] "about 1.2 on a 60-wide one": now "about 1.09 on a 100-wide grid and about 1.16 on a 60-wide one" (s07a: 1.087-1.096 and 1.152-1.156).
- [?] identity "nested regions of 0s and 1s at many scales": now "mostly 2s and 3s (85% of the cells on the 48-wide grid below), with thin lines of 0s and 1s outlining patches."
- [?] caption "nested, self-similar regions": now "It has the symmetry of the square: a central square of 2s, ringed by 3s threaded with lines of 0s and 1s."
- [?] circular/triangular identities: cut. Replaced with the computed claim: the 48-wide identity has one patch of 2s of at least nine cells, the 192-wide one has 37 in four distinct sizes (s07e).
- [?] 1/f "in resistors, river levels and starlight": now Bak's own list, "the flow of the Nile, the light from quasars and highway traffic".
- [ ] "slight rise at the lowest frequencies": now "a dip at the lowest frequencies: a big avalanche drains grains from the pile, the drops after it are a little quieter, and over long stretches these swings partly cancel" (low-frequency slope +0.52).
- [ ] Fig 4 caption "one quiet step between avalanches": now "one quiet step for every grain, so grains that topple nothing add quiet steps between avalanches."
- [?] Bak and "forest fires": now "In How Nature Works (1996) Per Bak went on to argue that earthquakes, stock market crashes and mass extinctions follow sandpile-like power laws".

**Additions from the brief**

- Mean height: Fig 2 caption adds "On an infinite grid the stationary mean height is exactly 17/8 = 2.125; grains lost over the edges keep a finite pile a little lower" (finite: 2.111 at 100, 2.102 at 60).
- Exponent paragraph: Luebeck and Usadel now "1.29 on grids up to 4,096 cells wide"; added "Chessa and colleagues 1.27 in 1999" (PRE 59, R12, Table: 1.27 +- 0.01 for BTW).
- Laurson et al.: "significantly below 2 (1.59 for this model in two dimensions)"; the page's -1.6 matches.
- References added: Chessa et al. 1999; Priezzhev 1994; Poghosyan, Priezzhev and Ruelle 2011; Bak 1996.

**House rules**

- d3 tick labels and the spectrum guide labels were 10 to 10.4px: `svg .tick text { font-size: 11px }` and guide labels set to 11px.

Not fixed: Manna's 1.22 is sourced only through a secondary paper (Lin and Hu, cond-mat/0204243); the primary (Physica A 179, 249) was paywalled. Fig 1 auto-drop is a reader-started loop and still runs under reduced motion (it stops off screen).

PROMPT change: none

### Fix record: 08-laplacian-growth.html

Commit b8afc20. Verification: s08e rerun on the edited page (the river model is unchanged: ratio 0.97 at 200 steps, 1.00 from 400, Rb 3.52 on this terrain); render-check PASS; pw.mjs all 8 configs (1200/390 x light/dark x reduced/no-preference; all buttons including the regime buttons, all sliders by keyboard to End/Home plus change events, chart points focused by Tab): no console errors, no NaN/undefined/Infinity, no overflow, no SVG text under 11px, U+2014 count 0. pw08c.mjs (reduced motion, dark): Fig 4 shows 582 pre-run steps, max order 4, relief 0.266, steady ratio 1.00, channels visible. pw08b.mjs (1200px after growth): River Rb 3.6, DLA 4.2, Discharge 5.2.

**LEDGER [ ] and [?] entries**

- [?] "mineral dendrites on rock": cut (Chopard et al. model them by reaction-diffusion). Electrodeposition and viscous fingers now cite Matsushita et al. 1984 (D = 1.66) and Nittmann, Daccord and Stanley 1985.
- [?] "At large eta ... a needle": now "the dimension falls toward 1 (about 1.1 at eta = 4 in later, larger simulations) and the cluster becomes a needle". Also added NPW's measured D: 1.75 at eta 1, 1.89 at 0.5, about 1.6 at 2.
- [?] "Lightning is often drawn with this model at eta above 1": cut; now "The branching looks like lightning, but a real stepped leader involves ionization and charge transport that the model leaves out."
- [ ] Horton "between 3 and 5": now "Measured on real rivers, this bifurcation ratio ... is usually between 3 and 5, most often near 4."
- [?] "all three land near that range": now "in or near that range, moving from run to run: on this page the river gives about 3.4 to 5.2 once it settles, the full-grown DLA cluster 3.5 to 5.2 (mean 3.9), and the discharge about 4 to 5."
- [ ] Kirchner gloss: now "the Horton ratios measured on real rivers describe virtually all possible branching networks, random or not".
- [ ] Devauchelle growth rule: now "grow forward in the direction from which groundwater enters their tips".
- [ ] Fig 1 "small clusters read high" and [?] "settle near 1.71": caption now "On this canvas a cluster stops at 2,000 to 4,600 particles and the fit scatters from run to run (1.47 to 1.81 over 40 runs, mean 1.67); much larger simulations give 1.715 (Tolman and Meakin 1989)."
- [?] river not labeled simulated: caption now "a simulated 100 x 100 landscape".
- [ ] per-frame rescaled relief shading: now a fixed scale 12 U/K (steady relief 9.2 to 10.8 U/K, s08h); caption says "on a fixed scale set by U/K, so the map darkens as relief builds".

**Other changes**

- Fig 2 caption now quantifies the drift: "At the default 0.05 the reduced-stickiness value reads about 2 near 1,000 particles and drifts down (to about 1.74 on average when the canvas is full)".
- Fig 3 caption: "Because it grows toward grounded edges only a few hundred cells away, this discharge is sparser than a free DLA cluster even at eta = 1" (mass-radius D 1.35 to 1.45, s08c/s08d).
- NPW sentence now "branched surface discharges, called Lichtenberg figures, and compared it with discharges grown in the laboratory" (abstract: "compared with properly designed experiments").
- Reduced motion: Fig 4 pre-runs up to 700 steps or 600 ms so the static map has a drainage network.
- References added: Tolman and Meakin 1989; Matsushita et al. 1984; Nittmann, Daccord and Stanley 1985; Mullins and Sekerka 1964; Hastings 2001.

Not fixed: no primary source read for the stickiness crossover (the claim rests on the computed drift and the series' existing trap note). Fig 3 relaxes only 4 SOR sweeps per growth step (residual up to 5e-2); tested at 20 and 80 sweeps with no change in D or Rb, so left as is. Hack's law is not on the page (the model gives h = 0.56 to 0.63); not added.

PROMPT change: none

### Fix record: 09-self-avoiding-walks.html

Commit e90cdea. Scripts (scratchpad w09-10/): s09a.mjs, s09b.mjs (old page code), pivot.js, s09c-f.cjs (pivot sampler checks and new-figure statistics), pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference, sliders via keyboard End/Home/ArrowRight, every figure button by Enter and click), figshot.mjs (figure screenshots). render-check PASS; pw.mjs ALL OK in 8 configurations (no console errors, no NaN/undefined/Infinity, no overflow, no SVG text under 11px, no U+2014). Relative links (index.html, 08, 10) exist.

**Main change.** Figures 1 and 2 now sample uniform SAWs with the pivot algorithm (Lal 1969; Madras and Sokal 1988): rod start, 10N + 200 attempted pivots burn-in, 20 attempts between samples, 7 lattice symmetries. Checked against exact enumeration at N = 12 (324,932 walks, mean end distance 5.5371 exact vs 5.5383 pivot). Figure 3 keeps the growing walk (renamed growWalk) as the trapping demonstration.

**Ledger [ ] and [?] entries**

- [ ] Nienhuis "derived ... exact within that mapping": now "predicted ... from a Coulomb gas argument that is not a proof, still unproved".
- [?] Flory "partly by luck": now "exactly 3/4 in 2D, though the argument itself is far from a derivation"; Clisby and Dunweg named for 0.5876.
- [ ] Kinetic-growth exponent 0.59-0.65: section rewritten. Pivot fit over lengths 10, 20, 40, 80, 160, 320: 0.740 mean at 200 walks per length (5-95%: 0.721-0.759; 0.720-0.764 at 50, 0.729-0.747 at 500); long-chain ensemble means give 0.738 over 10-320 and 0.744 over 80-320, so the page says "near 0.74, a little under 3/4 because the shortest walks have not yet settled", runs "between about 0.72 and 0.76". Growing walks conditioned to survive are named as the wrong tool, "near 0.65" over 10-180 (0.654 computed).
- [ ] "most SAWs eventually trap": now "a walk grown one step at a time ... every growing walk traps sooner or later".
- [?] "rises slowly": now "cannot happen before step 7, fewer than 1 walk in 100 traps within 10 steps, by step 50 the risk has climbed to about 2% per step" (1.0%, 0.019-0.022/step computed). Hemmer and Hemmer cited: 60,000 walks, mean 70.7, ending about 12 units from the start; page batch "median lands in the 50s ... roughly one walk in five reaches 100 steps".
- [?] neutron scattering: cut. Replaced with Flory's motivation (lecture notes) and the counting problem.
- [?] "60+ years ... no exact formula": now mu ~ 2.638158530 (Jacobsen, Scullard, Guttmann 2016) and honeycomb sqrt(2 + sqrt 2) (Nienhuis 1982 prediction, Duminil-Copin and Smirnov 2012 proof).
- [ ] Figure 1 walks not the same length / SAWs smaller than RWs: fixed by pivot sampling. Both panels now share one scale sized to 1.6 N^(3/4). New numbers (100 batches of 80): mean end distance SAW / RW = 15.7 / 6.2 at 50 steps, 26.2 / 8.9 at 100, 43.9 / 12.6 at 200, 86.2 / 19.7 at 500. Caption gives the 100-step pair (about 26 against about 9). Strokes use a lighter blue in dark mode.
- [ ] Legend "exact": now "slope 3/4 (2D SAW prediction)", "slope 1/2 (random walk)".
- [ ] Hidden 200 cap: removed; the slider now sets both kinds of walk. Page run times 40-160 ms.
- [ ] SVG text under 11px: all ticks, legends, axis labels and the median label now 11px. Figure 2 min height 260 so the legend clears the data at 390px.
- [ ] Figure 3 caption: now "a single growing walk (green dot: start), its head circled red when it traps"; histogram described as starting from 500 walks.

**Not fixed:** the Figure 2 log y-axis labels only some ticks (d3 "~s" format); legible, left as is.

PROMPT change: Figures 1 and 2 now show uniform SAWs from the pivot algorithm (fitted exponent near 0.74) instead of growing walks; the growing walk is kept only for the trapping figure.

### Fix record: 10-stigmergy.html

Commits fe2000c and fc3e2f7. Scripts (scratchpad w09-10/): s10bridge.mjs, s10bridge2.mjs, s10phys.mjs, s10trail2.mjs / s10trail3.mjs (CAP env tests the pull cap), s10term.mjs, edit10a-c.py, pw.mjs, figshot.mjs. render-check PASS; pw.mjs ALL OK in 8 configurations (1200/390 x light/dark x reduced/no-preference; every slider driven to both ends by keyboard, every figure button pressed by Enter and by click, including Run 20 colonies): no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11px, no U+2014. Relative links (index.html, 09, 11) exist.

**Model change.** Figure 3: the pull of worn ground, kappa grad V, is capped at 0.9 of the destination's unit pull (PULL_MAX), which guarantees progress toward the destination. Rerun after the fix, full 30,000-step runs, no walker pinned at any setting tested: detour 1.001 at T = 300, 1.070 at the default (T = 17,970, kappa 100), 1.13 at T = 50,000, 1.17-1.19 at kappa 160, 1.000 at kappa 0. Caption says what the cap is and why.

**Ledger [ ] and [?] entries**

- [?] Grasse "no sign they coordinated": now "proposed that they coordinate through the work itself rather than with one another".
- [?] "Cytoplasm shuttles": now "Protoplasm streams through them; tubes that carry more flow thicken and the others decline (Tero and colleagues 2010)"; motor rule now says a blocked particle deposits nothing.
- [ ] No-occupancy "single thick band": now "after a thousand steps the particles have collapsed into one or two dense bands".
- [?] "values Jones used most often": now deposit 5 and decay 0.9 attributed to Strano, Adamatzky and Jones 2012 (reference added); the 45 degree angles and sensor distance 9 labelled as a setting chosen for this page.
- [?] Sensor distance 20 "roughly double": now "at the same step count, the holes ... two to three times larger in area" (x2.4-2.7 computed), plus a note that the web keeps coarsening.
- [?] Nakagaki details: cut to the sourced result (maze, food at two exits, dead ends withdrew, tube along the shortest route).
- [ ] Tero arena and lighting: now "arena bounded by the Pacific coastline ... on some plates used bright light ... for mountains and lakes"; 26 hours stated.
- [ ] Tero comparison: now "matched on distance, the slime mold was slightly cheaper in length, and the rail network was more robust: a single random broken link isolated part of the rail network 4% of the time and part of the lit slime-mold networks 14% of the time".
- [ ] "only some plates looked like the rail map": now "varied from plate to plate, though many resembled the rail map, and lit plates resembled it more".
- [ ] Goss numbers: now "left branch won in 12 of 26 trials" (equal), "15 of 18" (1.4x), "14 of 14" (2x); equation shows n = 2, k = 20 exactly, "as Goss and colleagues used"; c counts described as their model's units.
- [ ] Batches "14 to 17": now "about three colonies in four ... (a batch of 20 usually gives between 12 and 17), a less reliable result than the ants' 14 of 14"; early lock-in given as "whichever branch leads after the first 100 departures goes on to win 9 times in 10".
- Late opening: Goss 2 of 18 switched, after 30 min; no-evaporation lock "about a hundred times k".
- [ ] "Around 0.04 a few in twenty switch" and [ ] "No evaporation rate makes late colonies reliably find the short branch": replaced with the computed band: below 0.035 almost none switch; 0.04 about four in ten; 0.045-0.05 about four in five (78%, 87%), open colonies above nine in ten (94-95%); past 0.055 traffic splits. Checked in the browser: late, lambda 0.046, Run 20 colonies gave 16 of 20.
- [?] Dorigo motive: now "Dorigo's Ant System ... lets its trails evaporate by a set fraction each round; ... with the trail weighted too heavily, every ant soon follows the same tour and the search stops, which they called stagnation".
- [?] kappa in the walker equation: prose now says the figure uses "a weighted form of their rule, with the weight kappa as the attraction slider".
- [ ] "roughly 10% farther": fixed by the cap; now "about 7% farther ... and about 13% farther at the longest durability".
- [?] Trail geometry: now "Near each corner the long-side route and the diagonal share one trail; the diagonals bow outward toward the long sides and cross the middle as a braided bundle, while the two short sides stay separate trails" (matches the screenshot).
- [ ] Figure 3 static value 20000: now 17970.
- [ ] Lone-pellet field and pick-up ratio: now "about half of K ... about four times K ... roughly ten times as likely".
- [?] "dozen or so piles": now "By step 2,000 about twenty piles hold most of the pellets, and by the end of the run (12,000 steps) about fifteen piles hold nearly all of them" (22 / 86%, 15 / 96% computed; browser runs gave 12-17 piles, 95-97%).
- [ ] Lifetime threshold "about 100 ... stalls": now "Once the lifetime passes about 75 steps ... clustering slows: at a lifetime of 150 steps less than a third of the pellets end up in piles, and at 500 almost none".
- [?] Cement pheromone chemistry: now Green et al. 2017 (excavation sites that draw more diggers) and Calovi et al. 2019 (surface curvature), both added to references.
- [ ] "limited range of lifetimes": now "only while the signal fades fast enough".
- [ ] Undisclosed 0.002 base drop rate: now stated in the prose.
- [ ] Bridge chart label under the data: moved into a top margin (chart height 250 to 264).
- [ ] SVG text 10px: bridge ticks and histogram counts now 11px.

**Not fixed:** Figure 1 updates particles in a fixed order where Jones iterates in random order; the Jones 2010 paper itself (Artificial Life 16, 127) could not be read, so its own default parameters are unconfirmed.

PROMPT change: none

### Fix record: 11-predator-prey-in-space.html

Commit b26793c. Scripts (scratchpad w11-12/): f1.mjs, f2.mjs, f3.mjs (model checks), pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference, all buttons, sliders to Home/End by keyboard, drags and Enter on the canvases and the phase plane), figs.mjs (390 px dark screenshots). render-check PASS. U+2014 count 0. All 8 configurations: no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11 px effective. Relative links (index, 10, 12, 13) resolve.

**LEDGER [ ] and [?] entries**

- [?] Huffaker "several cycles": now "went through three oscillations together only when he enlarged the array and broke it up with barriers that slowed the predators and routes that helped the prey disperse". Primary (Hilgardia 27:343) still unread (403); wording follows the secondary account.
- [?] "within a few thousandths of zero": now "usually ... (a cell near the core of a spiral swings less)". "almost the full" boom and bust changed to "most of".
- [?] "sits near the fixed point": now "the grid mean stays between about 0.3 and 0.4 while each cell swings from near zero to above 1" (node: mean 0.30-0.47 early, 0.325-0.405 after t = 1000; browser runs 0.29-0.43, 0.33-0.40).
- [?] "amplified by the spatial structure": now "On a finite lattice these fluctuations persist, but they stay local: the amplitude of the population oscillations tends to zero as the lattice grows (Mobilia, Georgiev and Tauber 2007)", matching the abstract.
- [ ] "markedly more" with no number: prose now gives mean-field lambda_c = 0.111 and the measured value: "On a 200x200 lattice run for 4000 sweeps, predators died out at lambda = 0.195 and persisted at 0.205, so lambda_c ~ 0.20 for these rules." Mechanism sentence softened to "Part of the reason is".
- [ ] Sweep too short: SW_MCS 800 -> 1500 (still averaged over the last 300), caption updated. Node, L = 64, 1500 sweeps, 10 runs each: 0.175 extinct in 10/10 (by sweep 844), 0.200 marginal (density 0 to 0.014), 0.225 alive (0.097-0.122). Browser readout after the fix: "predators died out up to lambda = 0.175 and survived from 0.200 up; mean field puts lambda_c at 0.111".
- Anti-slop: axis tick and label text raised from 11 px to 12.5 px (15 px under 600 px) so it renders at >= 11 px in every figure (was 10.5 / 9.8).

**New numbers for the ledger**

- Hopf threshold K_c = 2x* + 1/(bh) = 1.1397 with x* = 0.2574; defaults K = 2 in Figures 1 (satiation mode) and 2 sit past it.
- Cycle prey range at K = 2: 0.0028 to 1.606; at K = 3: 3.0e-5 to 2.786.
- Lattice lambda_c ~ 0.20 (L = 200); page sweep brackets 0.175 / 0.200.

Not fixed: Figure 1 y axis stops at 1.4, so at K near 3 the top of the cycle (predators 1.73) is clipped. Huffaker primary source unread.

PROMPT change: none

### Fix record: 12-reaction-diffusion.html

Commit 8dcd3ec. Scripts (scratchpad w11-12/): g2.mjs, g34.mjs, presets.mjs (model checks), pw.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference, every button and preset pill, sliders to Home/End by keyboard, drags on both canvases), figs.mjs (390 px dark screenshots of each figure). render-check PASS. U+2014 count 0. All 8 configurations: no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11 px effective. Relative links resolve.

**LEDGER [ ] and [?] entries**

- [ ] "combination Turing identified": now "Self-enhancing activation with a depletion or inhibition of wider range is the combination Gierer and Meinhardt (1972) set out as the core requirement".
- [?] "At these diffusion constants the empty state is stable": now "stable for every f and k, since without V there is nothing to make more V".
- [?] "spacing does not depend on where the seeds were placed": now "Where the seeds go changes the layout of the pattern, but not its spacing, which stays within a narrow band (Figure 4 measures it)". Figure 4 measures 14-17 cells.
- [ ] "nearly all the patterns live" above the curve: now "most of the patterns live: in the map below, 28 of the 35 tiles that end patterned sit above the curve" (g2.mjs on the page's runTile()).
- [?] "32 cells wide or 256": replaced with the measured 1D fact, "in one dimension (Figure 3) it stays near 15 cells from a 40-cell row to a 300-cell one" (13.0-16.6).
- [?] "flat orange tile": now "flat cream-to-red tile".
- [?] Preset descriptions: tooltips rewritten from the Figure 1 runs (Solitons "self-replicating spots, a few stretched into short worms"; Worms "long worms"; Stripes "stripes that fill the grid in a tangle"; Coral "branching growth that settles into parallel stripes"). Caption now says the names are informal and that Pearson labelled his classes with Greek letters, and states the check as "V survives and patterns in a 64x64 run".
- [ ] Fly scaling "still open": rewritten with Gregor et al. 2005 (gradient scales across species via Bcd decay length) and Houchmandzadeh, Wieschaus and Leibler 2002 (hb boundary scales within a species despite variable Bcd; "how it does so is still debated"). Both added to the reference list.
- [ ] Gregor 2007 "1% of egg length, roughly one nucleus": now "Neighbouring nuclei sit about 1 to 2% of the egg length apart and see Bicoid levels that differ by about 10%; Gregor, Tank, Wieschaus and Bialek (2007) found that Hunchback reads differences that small reliably, and that the precision approaches the limit set by the random arrival of Bicoid molecules at their targets."

**New numbers for the ledger**

- Map: 280 tiles; 108 dead, 137 uniform V-rich, 35 patterned (28 above the curve, 7 below).
- Figure 3: peaks per length 3..19, spacing 13.0-16.6, converged by 40,000 steps (same peaks at 80,000). Decay-length flag red fraction 0 at L <= 60, 0.85 at 300.
- Figure 4 (defaults, four embryo sets): Turing peaks 12-14 per embryo, spacings 14-17, wall gaps 7-8; flag blue/white boundary SD 7.9-9.0 vs lambda*sigma = 8.0, ragged zone 5.2-6.3 cells.

Not fixed: Figure 4 readout counts Turing peaks on the noiseless V profile while the rows show the noisy reading; at the default 10% noise only 0 to 7 cells per embryo flip across the 0.15 display threshold. 2D spot spacing versus grid size was not measured. Raspopovic Hox/Fgf detail rests on a search summary of the paper, not the full text.

PROMPT change: none

### Fix record: 13-excitable-media.html

Commit 5ac761e. Scripts (scratchpad w13-14/): eng13.cjs extracts the engine from the page (PAGE=... for the fixed version); sp13c.cjs, sp13d.cjs, s1s2.cjs, sweep.cjs, pace2.cjs, kick.cjs rerun every figure's numbers on the fixed engine; pw.mjs (Chromium 1200/390 x light/dark x reduced/no-preference, sliders to extremes by keyboard, every button by Enter, canvas click and Enter); pw13.mjs (interaction path with readouts). render-check PASS. U+2014 count 0. No console errors, no NaN/undefined/Infinity, no horizontal overflow, SVG text >= 11px in all 8 configurations.

**Engine**

- Periodic boundaries replaced by no-flux edges (laplacian clamps to the border cell; pokes clip instead of wrapping). Now "circular waves die at the edges" is true of the sim, and pacing from a corner no longer wraps.
- Defibrillate now excites every cell (u = 2) instead of writing a refractory state, matching "depolarizes". All scenarios quiet within 221-245 steps (sp13d defib, 9 runs: break, pair, many spirals).
- New countTips(): phase singularities from the winding of atan2(v - 0.2, u) around 2x2 plaquettes. Break 1, pair 2, many spirals 4-11, S1-S2 in window 1, quiet 0.

**LEDGER entries**

- [?] no equations / "simplest": FHN equations now displayed (aligned, two lines) with b = 0.8, I = 0.5 (Fig 1) and I = 0 plus D lap u (tissue), cited FitzHugh 1961, Nagumo et al. 1962; "one of the simplest".
- [ ] reagent list / spirals organize: intro now "bromate and malonic acid in sulfuric acid, with a cerium or iron catalyst ... where a wave is broken the ends curl into spirals (Winfree 1972)".
- [?] spirals cause VT/VF: now "a leading explanation ... (Davidenko et al. 1992)".
- [?] yellow and clear: "yellow cerium(IV) and colorless cerium(III) (Field, Koros and Noyes 1972 tracked the swings with electrodes)".
- [ ] FHN a reduction of the Oregonator: cut. Section 1 now says the Oregonator (Field and Noyes 1974, built on FKN 1972) has HBrO2 fast and Ce(IV) slow, releasing bromide, and FHN has "the same fast-slow shape".
- [?] recipes tuned short of oscillating: replaced with the computed statement: at a = 0.5 each point rests; below about a = 0.46 the dish flashes by itself.
- [ ] refractory "while pumps reset gradients": now sodium channels stay inactivated until repolarization (Klabunde), plateau with calcium entry, potassium repolarization.
- [ ] "every cell fires once per beat" at default: pacing slider now 150-900 steps, default 600. pace2.cjs: far-corner upstroke intervals equal the pacing interval for every interval >= 470 steps; 465 -> 930 (2:1), 400 -> 800, 300 -> 600, 200 -> 600 (3:1). Prose: "follows every stimulus down to 470 steps; at 465 it answers only every second one."
- [?] "die at the boundaries": true now (no-flux).
- [?] "emits indefinitely": now "for as long as the tip stays in the tissue"; added spiral period 470 steps equals the 1:1 pacing limit (sp13c: probe periods 468-470 for break and pair at step 8000).
- [?] "compete for territory": cut.
- [x] faster than sinus node: kept, now cited Fenton et al. 2002 and Davidenko et al. 1992 (about 180 ms, 3-5x normal rate).
- [ ] "if the spiral fragments, fibrillates": replaced with Gray, Pertsov and Jalife 1998 (sources are phase singularities at a few sites, forming and vanishing), which also motivates the tip readout.
- [?] S1-S2 in lab preparation: cut; the paragraph now describes the model's vulnerable window.
- [?] defibrillator mechanism: now cites Zipes et al. 1975 (critical mass) and gives the model's number (quiet within about 250 steps).
- [ ] slime mold / calcium / CSD / forest fire: now only the two sourced ones (Tomchik and Devreotes 1981; Lechleiter et al. 1991).
- [ ] Fig 1 slider/regimes: slider renamed "Offset (a)", range 0.1-1.3; added Kick (+0.5 to u) and a computed readout "Fixed point: stable/unstable" from the Jacobian trace. Caption gives the switch (a about 0.84-0.87 depending on eps) and that a kick fires a cell near the knee but dies away at a = 1.3 (kick.cjs: a = 1.1 kick 0.3 max u -0.90, 0.6 fires; a = 1.3 kick 0.6 max u -0.74, 1.0 fires). Chromium: default "unstable", a = 1.3 "stable".
- [?] label "rising": now "switching".
- [ ] Fig 2 slider: "Offset (a)", range 0.3-0.8; caption says larger a gives slower, narrower waves (sweep.cjs: front radius at step 600 drops from 96 at a = 0.5 to 69 at 0.8, eps 0.015) and below 0.46 the whole dish fires. Caption states grid, D = 0.5, I = 0, no-flux edges, simulated, and that the two opening waves annihilate (sp13c collide: 61% active at 500, 0 from 1500).
- [?] Fig 3 cable: caption now says it is a three-state cartoon (excited 6, refractory 30).
- [ ] Fig 4 default / bpm / waves launched: readouts now "Stimuli" and "Far corner fires every N steps" (probe upstroke gaps). Chromium: pacing 600 -> 600 steps; pacing 300 -> 600 steps (2:1 block visible). bpm and the 8 ms/step assumption removed. Document-level Space handler removed.
- [ ] Spiral pair: reseeded as one broken front with two free ends; 2 tips at every a in 0.46-0.8 and eps 0.008-0.04 after 5000 steps (sweep.cjs). Fig 5 a slider now starts at 0.46.
- [ ] S1-S2: S2 is now the lower half of the tissue with x < 80, delay set by a new slider (200-1400, default 700). s1s2.cjs: spiral (1 tip) for delays 500-900; none at 450 or below, none at 950 or above. Chromium: 700 -> 1 tip; 300 -> 0 tips, 0% active.
- [ ] Induce fibrillation: renamed "Many spirals"; scatters 10 short broken fronts; sp13d many (5 runs): 4, 6, 7, 10, 11 tips, constant over 10000 steps. Caption says FHN spirals here do not break up, citing Fenton et al. 2002 for breakup in richer models.
- [x] Defibrillate: see Engine.
- [ ] Hz readout: replaced by "Firing period", the median upstroke gap at four probe cells (Chromium, pair after ~12 s: 494 steps, converging to 470).
- [ ] Regime label: replaced by "Spiral tips" (computed count).
- [ ] Canvas keyboard: tabindex and Enter/Space stimulate or quench at a random point.
- d3 ticks forced to 11px; KaTeX display overflow-x auto.

**New numbers now on the page**

a = 0.46 (dish self-oscillates below), a about 0.84-0.87 (Fig 1 rest threshold), 470 steps (1:1 pacing limit and spiral period), 465 steps (2:1), 500-900 steps (S1-S2 window), about 250 steps (defibrillation quiet), 180 ms and 3-5x (Davidenko).

Not fixed: the probe-period readout takes a few thousand steps to settle to 470 after a scenario starts (it reports the latest gaps, which shorten as the spiral's core forms). Colour palettes of the canvases are fixed (not theme-mapped), as before; legible in dark mode.

PROMPT change: Figure 5 now has an S2-delay slider and a spiral-tip count, "Induce fibrillation" is "Many spirals" (no breakup in FHN), and Figure 4 reports conduction block from a far-corner probe instead of a heart rate.

### Fix record: 14-kuramoto-model.html

Commit 683069c. Scripts (scratchpad w13-14/): k14.cjs, fig2.cjs, fig3.cjs, ff.cjs, ff2.cjs, ring.cjs, ring2.cjs, ring3.cjs (node); pw.mjs (Chromium 1200/390 x light/dark x reduced/no-preference, sliders to extremes by keyboard, every button, canvas click/Enter), pw14.mjs (readouts along the interaction path), wide.mjs (overflow audit: the only elements past the viewport are KaTeX's clipped sqrt SVG paths and hidden MathML, no document overflow). render-check PASS. U+2014 count 0. No console errors, no NaN, SVG text >= 11px in all 8 configurations. Page load 1.9 s including the Fig 2 computation.

**LEDGER entries**

- [?] roomful of metronomes: now "a few metronomes ticking on a board that can roll freely ... (Pantaleone 2002)".
- [?] sharp transition: now "For many oscillators". Added the model equation in both forms (Strogatz 2000 eq. 3.1/3.3), displayed on two aligned lines.
- [?] ferromagnet analogy: cut. Section 2 now states Kc = 2/(pi g(0)) for symmetric unimodal g (Kuramoto 1975, 1984; Strogatz 2000), g(0) = 1/(pi gamma) for the Lorentzian, and Kuramoto's closed form r = sqrt(1 - Kc/K).
- [ ] Fireflies mechanism: now Buck and Buck 1968 (Pteroptyx malaccae, Thailand, about 560 ms) and Mirollo and Strogatz 1990 named as the pulse-coupling cartoon, with the concave charge explained.
- [ ] Firefly waves: model rebuilt as Mirollo-Strogatz: charge x = ln(1 + (e^3 - 1) p)/3, each flash adds eps to neighbours' charge, anyone pushed to threshold fires in the same instant (cascade); sub-stepped at <= 0.02. Slider 0-0.1, default 0.01, new readout "whole-field synchrony r". ff2.cjs (same rule): eps 0 r 0.03; 0.01 r 0.09-0.16 with neighbour phase difference 0.10-0.12 (patches); 0.02 r 0.98 at 30 s, 0.99 at 90 s; 0.05-0.15 r 0.99. Chromium at 4x speed after 10 s: 0.02 / 0.04 / 1.00 for eps 0 / 0.01 / 0.05. Prose now says "patches that flash together" at 0.01 (no waves claimed) and "whole field as one within half a minute" from 0.02. Caption notes the straight-line charge leaves the grid twinkling even at 0.1 (ff.cjs: r 0.10).
- [?] field heals: now true: Chromium, eps 0.05, synced r 1.00, click perturb -> 0.99, 6 s later 1.00.
- [ ] "Local coupling is slower to sync": cut.
- [?] central pattern generator: cut.
- [x] twisted waves and tempo groups: kept, now cited Wiley, Strogatz and Girvan 2006 and "about one run in five ends twisted" (ring.cjs: 4 of 20 at K 1, spread 0.5). New "State" readout: every 5 s of sim time compares tempos; "locked, unison", "locked, twisted wave (winding q)", or "not locked: tempos differ by up to X rad/s, n groups". Caption notes locking can take a minute or more (ring3.cjs: tempo spread falls below 0.02 rad/s after 20-45 s in most runs; one run slipped at 45 s).
- [x] recovery faster at higher coupling: now quotes the node medians (1.9 s at 0.5, 0.14 s at 2); caption says a kick that leaves the ring twisted never gets back above 0.8.
- [?] Millennium Bridge "Kuramoto transition" and dampers: now "modeled it with the ideas developed for synchronizing oscillators ... estimates how much damping a crowded footbridge needs", opened 10 June 2000, reopened 2002 with dampers.
- [?] Fig 1 caption: names the Lorentzian (gamma 0.5, Kc = 1) and says the tail colours keep lapping the cluster.
- [ ] Fig 2 measurement: rebuilt. K = 0 to 8 in 0.25 steps, 20 runs per K of 50 fresh Lorentzian oscillators, 2000 steps of 0.05 (100 time units), r averaged over the second half; points plus a one-SD band. Chromium values (one load): K 0 0.131, 0.5 0.173, 1 0.365 (SD 0.13), 1.5 0.580 (theory 0.577), 2 0.729 (0.707), 3 0.836 (0.816), 4 0.882 (0.866), 6 0.928 (0.913), 8 0.919 (0.935). Caption: within a few hundredths from K = 1.5 up; K = 0 about 0.13 = sqrt(pi/4N); near Kc well above zero with large run-to-run spread (finite-size smearing).
- [?] Fig 5 timer from twisted state: caption now explains.

**Other changes**

- Section 3 rewritten around Kc = 2/(pi g(0)) with the three computed values: Lorentzian 1.00, Gaussian 2 sigma sqrt(2/pi) = 0.80, uniform 6/pi = 1.91 (now shown in a readout per distribution; "none (bimodal)"). Uniform transition called discontinuous (Pazó 2005, abstract read); at N = 60 r goes from about 0.5 at K 1.8 to 0.8-0.9 at K 2 (fig3.cjs). Gaussian locks between K 0.8 (r 0.35-0.39) and 1.2 (0.84).
- Bimodal paragraph: standing-wave state per Martens et al. 2009 (two Lorentzians; similar for two Gaussians); window now "from about K = 0.8, merge between K = 2 and 2.2" (fig3.cjs above). Fig 3 readouts "r now" and "range over the last 10 time units": Chromium bimodal K 1.5 -> 0.23 to 0.89; K 3 -> 0.93 to 0.93; caption matches.
- Histogram edge labels and all d3 ticks 11px. References list extended (Kuramoto 1984, Martens 2009, Pazó 2005, Pantaleone 2002, Buck and Buck 1968, Mirollo and Strogatz 1990, Wiley et al. 2006).

Not fixed: Fig 2 is still drawn from Math.random, so its points shift by a few hundredths between loads (the SD band shows the spread). Firefly glow uses a radial gradient on a fixed dark canvas (kept; it is the flash itself).

PROMPT change: Figure 4 (fireflies) now uses Mirollo-Strogatz pulse coupling with a synchrony readout, and Figure 3 shows Kc per distribution with an r-range readout; Figure 2 plots 20-run means with an SD band.

### Fix record: index.html

Commit 8db81b9. Verification: render-check PASS; pwidx.mjs (Chromium 1200/390 x light/dark x reduced/no-preference): 14 cards, 0 console errors, no NaN, no horizontal overflow, every relative link resolves. U+2014 count 0.

**LEDGER entries**

- [?] starlings "no bird in charge": now "Each starling in a flock reacts only to a few nearby birds, yet the flock turns together", matching 02.
- [ ] mechanism list: "frustrated couplings" added.
- [ ] "one or two models": now "a few models".
- [?] 02 "Boids and swarm robots": now "Boids and the Vicsek model".
- [ ] 04 soap films / already agree: now "domains grow as their borders straighten, until one opinion wins or the borders lock. Listen only to people whose views are already close to yours and opinions split into camps."
- [x] 07: reworded to "avalanches at every scale up to the size of the pile" to match 07's wording and the finite pile.
- [ ] 13 "target waves": now "colliding waves".
- 14 title now "The Kuramoto Model" to match the page.

Not fixed by this worker: 04's subtitle said "people who already agree with you"; fixed afterwards in 32a9e3c ("whose opinions are already close to yours"). docs/index.html count is 14 and its description matches; no change needed there.

PROMPT change: none

## Leads from FACT-CHECK.md (2026-09-27)

Non-claim issues from the queue's page-defect list.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 05, 06, 14 | Figures used unseeded Math.random, so no two loads matched | wrong, fixed | Headless Chromium with Math.random wrapped to count calls: 0 calls on each page after scrolling every figure into view and clicking every button; no page errors. | Added a mulberry32 PRNG per page and one fixed-seed stream per figure IIFE (05: 3, 06: 5, 14: 5); in 14 the shared samplers take the stream as an argument, and d3.shuffle became d3.shuffler(rand). Reshuffle and "new random" buttons keep drawing from their figure's stream, so each press still gives a new draw while the load state is reproducible. |
| 03 | Fig 2 (stability map) could only be moved by mouse click | wrong, fixed | Headless Chromium: focus the chart, ArrowRight then Shift+ArrowUp moved Figure 1 to N = 46, a = 1.05; focus-visible outline renders. | SVG is focusable (tabindex 0, role application, aria-label lists the keys); arrows step density by 1 car and a by 0.05 m/s² (Shift: five steps), clamped to the slider ranges; visible focus ring; caption mentions the keys. |

## Second opinion (all-series hunt, 2026-09-27)

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 11 | Intro: "in the models below it is spatial structure that keeps both species alive" | wrong, fixed | The page's own section 3: mean-field λc = μ/(1-μ) = 0.111, the lattice needs about 0.20, so on the lattice space makes predators harder to sustain. Section 2 (patches recolonising each other) is where space helps | Intro now says space steadies the totals and lets a crashed patch be recolonised, but on the lattice also makes predators harder to sustain |
| 12 | Outro: 13 "keeps a pair of reacting, diffusing species" | wrong, fixed | 13's code: `Dv: 0.0 // only the activator diffuses`; 13's prose couples points "by activator diffusion" | "keeps a pair of reacting species ... and there only the activator diffuses" |
| 02 | "Swarm robots built on these rules behave the same way" (restored by the prose sweep) | wrong, fixed | Unsourced generalization about robotics; the earlier row at 02 (`156`) had asked for a claim about the rules | Now a statement about the rules: cohesion and separation alone can pile agents up but give no common heading |
| 09 | "fewer than 1 walk in 100 traps within 10 steps" | wrong, fixed | Exact enumeration of the growing walk (uniform over unvisited neighbours), rational arithmetic: P(trapped by n) = 0.27% (7), 0.50% (8), 0.98% (9), 1.41% (10) | "only about 1 walk in 70 traps within 10 steps" |
| 06 | τ = 187/91 credited to Mertens and Moore 2018 | wrong, fixed | The exact 2D exponents come from den Nijs, J. Phys. A 12, 1857 (1979) and Nienhuis, J. Phys. A 15, 199 (1982); universality across lattices is conjectured, proved for triangular site percolation by Smirnov and Werner, Math. Res. Lett. 8, 729 (2001). Mertens and Moore 2018 is about hypercubic thresholds | Credits den Nijs and Nienhuis, says universality is proved for the triangular lattice; references line swaps Mertens-Moore for the three papers |
| 01 | Orbium σ = 0.015 "catalogued" | fine | Chan 2019 (arXiv 1812.05433), Figs 6 and 7 captions: "Orbium (µ = 0.15, σ = 0.016)"; the catalogue (animals.json) has 0.015, which the page uses and labels as catalogued. The paper's value is the 0.016 case the 01 rows already test | none; ledger now cites Chan 2019 Figs 6-7 for σ = 0.016 |

## Enrichment 2026-10-05 (articles 01-07)

Each article gained new computing figures and a prose pass, one agent per article. Rows below cover new or changed claims only; verdicts are computed / derived / sourced / from memory. Rows marked from memory or second-hand need a source check.

### 01 enrichment

Enrichment pass 2026-10-05 on docs/emergence/01-cellular-automata.html. Three new figures (2 damage spreading, 3 census of all 256 rules, 5 ant from random squares); old Figures 2-4 renumbered 4, 6, 7. Prose outside figures cut from 1,553 to 1,088 words (30%). Numbers below come from the page's own engines (`ECAEngine`, `AntEngine`) extracted into node by brace-matching the function source out of the HTML, plus headless Chromium readouts at 1280 and 390 px, light and dark. Scripts (session scratch, not kept): extract.cjs, nums.cjs, antnums.cjs, antall.cjs, antval2.cjs, pw.mjs. All seeds are fixed: ECA starts use mulberry32(1000 + s) for s = 0..15, density 0.5, 301 cells, 128 transient steps, 128 measured steps; ant trials use mulberry32(seed) for seeds 1..400.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 01 | Mirror images and 0/1 swaps behave identically, leaving 88 distinct rules | computed | `ECA.reps.length` = 88 (reflection and complement closure, minimum member as representative) | new |
| 01 | Every equivalent rule reproduces its class's measurements exactly | computed | each non-representative rule starts from the mirrored and/or complemented row; spread, entropy and uniform count equal the representative's for all 256 rules (0 mismatches) | new (engine design) |
| 01 | Fig 2 caption: 301 cells, 128 steps then flip middle cell, 128 more, 16 starts, spread = (final extent - 1)/128, at most 2 cells/step | computed | ECAEngine constants W 301, T0 128, T 128, SEEDS 16; extent <= 2T+1 = 257 | new |
| 01 | Rule 90's disagreement reaches both edges of the cone in every run | computed | ext[128] = 257 in all 16 runs | new |
| 01 | Rule 30's moves right one cell per step and left about 0.2 | computed | mean edge velocities +1.000 and -0.198 cells/step | new |
| 01 | Rule 110 spreads 0.40 cells per step | computed | spread 0.396; Fig 1/2/3 readouts print 0.40 | new |
| 01 | Rule 184's stays one to three cells wide in 15 of 16 starts | computed | final extents 1,1,1,3,1,1,1,213,1,... (one start 213) | new |
| 01 | Eight rules reach a uniform row from every start: class I | computed / sourced | rules 0, 8, 32, 40, 128, 136, 160, 168 uniform in 16/16 starts; class I definition NKS p. 231 (ledger 01) | new |
| 01 | Along the bottom, 61 keep a flip's influence under a fifth of a cell per step (class II) | computed | 69 classes with spread < 0.2, minus the 8 uniform | new |
| 01 | Rule 204 leaves a row as disordered as Rule 30's | computed | block-4 entropy 0.994 vs 0.993 bits/cell | new |
| 01 | Eleven, among them 30 and 90, spread a cell per step or more | computed | 18, 22, 30, 45, 60, 90, 105, 122, 126, 146, 150 (spreads 1.00 to 2.00) | new |
| 01 | Rule 110 sits between with seven others, no wide gap on either side | computed | 0.2 <= spread < 1: 14, 41, 43, 54, 57, 106, 110, 142; nearest neighbours across the cuts 0.167 (25) vs 0.245 (43), 0.919 (57) vs 1.000 (60) | new |
| 01 | Spreading rules gather at lambda 1/2: 28 of 70, none below 1/4; most at 1/2 do not spread | computed | per lambda k/8, rules with spread >= 0.2: 0, 0, 2/28, 9/56, 28/70, 9/56, 2/28, 0, 0 | new |
| 01 | Langton proposed lambda as a dial from order to chaos; reference "Computation at the edge of chaos," Physica D 42, 12 (1990) | from memory | not read this session; check title, volume and page | new reference |
| 01 | Fig 3 caption: entropy from blocks of four cells; categories < 0.2, 0.2-1, >= 1 cells/step | computed | entropy4 in ECAEngine; SPREAD_LO 0.2, SPREAD_HI 1 | new |
| 01 | Fig 5 stopping rule finds the highway onset correctly | computed | 200 trials (sides 20, 60, 120 at 0.5; side 20 at 0.1 and 0.9): a full scan for any period up to 400 over the move sequence, run 60,000 moves past onset, finds period 104 and the same onset every time; blank grid gives move 9,977 as in Fig 4 | new |
| 01 | All 3,200 runs at black fraction 0.5 reached the highway; all 28,800 across the nine fractions; slowest 394,020 moves | computed | antall.cjs: sides 10-160 x seeds 1-400 x p 0.1-0.9, 0 failures, 0 edge hits, cap 10^6; live readout prints 3,200 / 0 | new |
| 01 | At side 40 the median is 8,533 and 222 of 400 runs beat the blank grid | computed | antnums.cjs; live readout identical | new |
| 01 | Median grows from 3,420 at side 10 to 41,796 at side 160 | computed | antnums.cjs; live readout at side 160: 41,796 | new |
| 01 | Ant highway sentence now "turns repeat with period 104, each period carrying the ant 2 rows and 2 columns along a diagonal" | computed | live `ant-finding` text from the page's scan (unchanged detection) | reworded |
| 01 | Ant "nearly symmetric figures for a few hundred steps, an irregular blob for thousands" | sourced | unchanged claim, ledger 01 (Gajardo et al.) | trimmed |
| 01 | Rule 90 makes each cell the XOR of its neighbors, Pascal mod 2; Rule 30 RNG in Mathematica; Rule 184 traffic; Cook 2004 | sourced | unchanged claims, ledger 01 | trimmed; "differs in two bits" and "reversible" sentences cut |
| 01 | Lenia island, continuum map and state-level claims | computed | unchanged numbers from ledger 01; "T = 2 or 3 moves a cell half or a third of its range" = 1/T | trimmed |

### 02 enrichment

2026-10-05. Three new figures (4 bands, 5 influence spread, 6 metric vs topological predator test); old Figures 1-3 kept, Figure 3's method sentence moved into its caption. The Vicsek step was generalised to `makeVM` / `stepVM` (any N, L; angular or vectorial noise); `makeVicsek` / `stepVicsek` now call it and were checked bit-identical to the previous code over 3 seeds x 3 (eta, v0) settings x 500 steps (max difference 0). Prose (excluding figures and footer) 1,207 -> 872 words. Scripts (session scratch, `scratchpad/02/`): `load2.cjs` loads the page's own model code into node; `verify-pred.cjs 0 2 4 8`, `verify-spread.cjs`, `verify-bands.cjs` produce every number below; `pw.mjs` / `pw4.mjs` drive the figures in Playwright at 1280 and 390 px, light, dark and reduced motion. Sources read this session (full text via arXiv): Gregoire and Chate 2004 (cond-mat/0401208), Chate, Ginelli, Gregoire and Raynaud 2008 (0712.2062, PRE 77 046113 from the arXiv DOI), Ballerini et al. 2008 (0709.1916, main text and Fig. 4 caption). render-check: PASS.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 02 | Subtitle: the change is sharp, needs the agents to move, depends on how each picks its neighbors | derived | Summarises sections 4-6 below | new |
| 02 | Gregoire and Chate 2004: larger systems, transition discontinuous; ordered phase near threshold is dense bands travelling through a sparse disordered gas; phi bimodal | sourced | GC2004 abstract; text: "density waves moving steadily in a disordered 'vapour pressure' background"; "The distribution function of phi_t is bimodal around threshold" (Fig. 2c, L = 512, rho = 1/8) | rewritten from old para |
| 02 | With Vicsek's (angular) noise, at density 2 the discontinuity starts to show at box size about 128 interaction radii (Chate et al. 2008) | sourced | Chate 2008 Sec. III E: "at rho = 2 ... L* ~ 128 for angular noise, while it is very small for vectorial noise" | new |
| 02 | Gregoire and Chate also tried adding the noise to the summed neighbor headings as a random vector | sourced | GC2004 eq. (3): theta = arg(sum e^{i theta_k} + eta n_j e^{i xi}); page `stepVM(..., vec = true)` implements exactly this, xi uniform on [-pi, pi] | new |
| 02 | Fig 4 setup: 2,048 particles, 64 x 64 periodic box, density 1/2, v0 = 0.5; strips along the direction of travel, one row every 3 steps, shaded 0 to 4x mean | computed | Page code (L 64, N 2048, V0 0.5, B 64, EVERY 3, LUT h/4); parameters follow Chate 2008 Fig. 11 (rho 1/2, v0 0.5; vectorial bands at L = 64, eta 0.55) | new |
| 02 | Vector noise, eta 0.55: a band forms within a few hundred steps, densest strip 5 to 7 x the mean | computed | verify-bands.cjs, page seed 2: readout (mean of last 40 strip maxima) 2.9 at step 300, 4.6 at 600, 5.1 at 1,200; browser readout 6.8-6.9 at step ~3,300 (4 runs). Range across t1/t7 seeds 1-3: 4.3-8.4 | new |
| 02 | Raise eta to 0.6: within a few hundred steps the band dissolves, phi drops to about 0.1 | computed | verify-bands.cjs: after 1,500 steps at 0.55, eta 0.6 gives phi 0.14, 0.09, 0.04, 0.13, 0.15, 0.08 at +300..+1,800, strip max 2.4 -> 1.8. At 0.58 the band survives (phi 0.36-0.53) | new |
| 02 | Angle noise at this size: stripes broad and blurred, near 3 x the mean | computed | verify-bands.cjs eta 1.6 / 1.9 / 2.2: strip max 2.2-4.7 / 1.9-2.8 / 1.8-2.2; browser at step ~6,000: 3.1 and 3.2. Screenshots bands-ang-1.6/1.9.png | new |
| 02 | Chate et al. see sharp bands with angular noise only in boxes wider than a band | sourced | Chate 2008 Fig. 11 caption: "Sharp bands can only be observed if L is larger than the typical band width w"; text: "L_b ~ L*" | new |
| 02 | Frozen best phi vs moving best (live) | computed | Unchanged code; this session's browser runs: frozen 0.21-0.51, moving ~1, eta* 2.0-2.2 | kept |
| 02 | Mean neighbour count at density 1 (live "3.2") | computed | Unchanged code (giant-cluster readout removed; Fig 5 now carries that point) | trimmed |
| 02 | Fig 5: a particle within distance 1 of a reached one is reached, because it averaged in that heading; these are exactly the particles whose heading can depend on particle 0's | derived | The alignment average at step t uses all particles within distance 1 at step t (the same positions spreadStep uses), so dependence propagates along exactly these contacts | new |
| 02 | Frozen: influence stops at the edge of particle 0's cluster, on average 7% of the box, 2 to 76 particles over the ten starts | computed | verify-spread.cjs seeds 600-609, eta 1: final reach 2, 12, 25, 55, 25, 37, 3, 76, 12, 18 (mean 6.6%); equals particle 0's connected component (radius 1) in each start configuration, mean 26.5 | new |
| 02 | Moving at v0 0.3: 82% within 40 steps (live) and everyone soon after | computed | verify-spread.cjs: mean 37.9% at 20, 82.2% at 40, 99.9% at 80; all ten runs reach 400 of 400 (mean > 99.9% from step 78). v0 0.1: 60.5% at 40, 98.8% at 150 | new |
| 02 | Mermin-Wagner: 2D static system cannot hold true long-range order against noise; Toner and Tu: a flock can because motion carries heading information | sourced | Carried over from the 2026-09-25 ledger (Tu and Toner 1995 read then); shortened | trimmed |
| 02 | Ballerini: 3D reconstruction, six or seven nearest neighbours however far | sourced | Ballerini 2008 abstract | kept |
| 02 | Ballerini argued a fixed count holds a flock together through the density swings a predator causes, and tested it in a 2D alignment model | sourced | Ballerini text: "topological interaction is indispensable to maintain flock's cohesion against the large density changes caused by ... predation"; Fig. 4 caption: SPP model, alignment with neighbours, predator repulsion F0 [...]/r^2, N 200, n_c 3, r_c 0.15, CC defined by distance 3 r_c | new |
| 02 | Fig 6 model: 200 birds aligned in a disc of radius 5, alignment only plus turning noise of width 0.1; predator 4 units off centre flying the other way; pieces = chains with gaps at most 3 (paper's 3 r_c with r_c = 1) | computed | Page PRED constants. Differences from the paper, by choice: vector average of headings (paper writes an angle average), n_c = 7 (paper 3, chosen to match the observed 6-7), r_c = 1, noise 0.1 (paper has none), predator torque F0 (ey cos a - ex sin a)/r^2 applied after the alignment | new |
| 02 | Default strength 2: metric flock whole in none of 40 trials, topological in 29 | computed | verify-pred.cjs F0 2, seeds 1000-1039: metric M histogram {2:6, 3:7, 4:14, 5:10, 6:3}, mean 3.92; topological {1:29, 2:9, 3:1, 4:1}, mean 1.35. Browser identical (40 of 40, 3.9 / 1.4, 0 / 29) | new |
| 02 | Most extra pieces are stragglers: largest piece averaged 183 and 194 birds | computed | verify-pred.cjs F0 2: mean largest piece 183.13 (metric), 194.28 (topological) | new |
| 02 | At strength zero the metric flock still split in 19 of 40 trials, the topological in 2 | computed | verify-pred.cjs F0 0: metric whole 21 of 40 (mean 1.55), topological 38 of 40 (mean 1.05). Browser identical | new |
| 02 | (not on page) Larger strengths: metric whole 0 / 1, topological 6 / 6 at F0 4 / 8 | computed | verify-pred.cjs F0 4, 8; the topological advantage narrows but holds (mean pieces 4.28 vs 2.30, 4.50 vs 2.73) | context |
| 02 | Fig 3 caption: 600 steps averaged after discarding 400, error bars one standard deviation within the run | computed | Unchanged sweep code (TRANS 400, MEAS 600, sd) | moved from prose |
| 02 | References: added Chate, Ginelli, Gregoire and Raynaud, Phys. Rev. E 77, 046113 (2008) | sourced | arXiv 0712.2062 metadata DOI 10.1103/PhysRevE.77.046113 | new |

### 03 enrichment

Page: docs/emergence/03-traffic-shockwaves.html, 2026-10-05. Four new figures (1, 4, 6, 8), Figure 7 (was 4) gains a computed jam line, Figures 5 and 7 now seeded (mulberry32), old Figures 1-4 renumbered 2, 3, 5, 7. The page's model code now sits between `// ==== MODEL START` and `// ==== MODEL END`; the node scripts extract that block verbatim (mload.mjs) and call it. Scripts (session scratch, 03/): n1.mjs (Figure 1 scan, seeds 1-3, 600 s per run), t_all.mjs (Figure 4 series at a = 0.5/0.8/1.0, Figure 6 at p = 0..0.6 with the page's seeds 1000+i and 2000+i), n7.mjs and t_vdr2.mjs (Figure 7 shortfall, Figure 8 at the page's seed 11), t_vdr.mjs (Figure 8 seeds 1-5, 7), pw.mjs and click.mjs (headless Chromium). Sources read this session: Sugiyama et al. 2008 (NJP PDF, full text), Barlovic et al. 1998 (arXiv cond-mat/9804170, full text). Prose (paragraphs, excluding captions and references) 1,808 to 1,096 words; captions 437 to 678 (four new figures).

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| intro | 22 cars, 230 m, drivers asked to cruise at about 30 km/h | sourced | Sugiyama 2008 p.4: "The circumference is 230 m, and the number of vehicles is 22"; "requested to cruise at about 30 km h-1" | kept |
| intro | three minutes in, a cluster of five stopped cars | sourced | Fig 3(b) caption: "The snapshot 3 min later shows that a jam has been formed. A jam consists of five vehicles"; p.5 "vehicles inside the cluster of the jam stop completely" | new wording |
| intro | jam drifts back at roughly 20 km/h, cars outside at about 40 km/h | sourced | p.5: "the vehicles outside move freely (~40 km h-1)"; "travels backward with a velocity of roughly 20 km h-1" | 40 km/h new |
| Fig 1 | time headway 0.41 s gives uniform 30 km/h at 230/22 m spacing (5 m cars, page IDM otherwise) | computed | headwayFor(22, 230, 30/3.6) = 0.4126 s; idmVeq check 30.00 km/h | new |
| Fig 1 | 10 times real speed; noise seeded | computed | SIM_PER_SEC 10; makeRing sigma 0.1 m/s^1.5 white acceleration noise from mulberry32(seed) | new |
| Fig 1 | at a = 1.6 first stop three to four minutes in | computed | n1.mjs seeds 1, 2, 3: 187, 216, 228 s; page readout seed 1: 187 s, seed 2: 216 s | new |
| Fig 1 | jam moves back near 18 km/h | computed | crossSpeed on 1 m speed fields 20 s apart over last 120 s: -17.7, -17.8, -17.7 (seeds 1-3); page readout -17.7 (seed 1, 600 s) | new |
| Fig 1 | free cars reach about 45 km/h | computed | page readout "fastest car in window 45 km/h" at 600 s (0.5 s samples); node per-step max 46 | new |
| Fig 1 | jam holds about 12 cars, not 5 | computed | stopped (v < 0.1) at 600 s: 12, 11, 12; page 12 | new |
| Fig 1 | lower a gives a slower, longer jam | computed | a = 0.6: -8.9 to -9.0 km/h, 13-14 stopped; 1.0: -12.7, 12-13 | new |
| Fig 1 | from about 2 m/s² no car stops within ten minutes | computed | a = 2.0 seeds 1-3: no stop in 600 s; a = 1.9 first stops 492-568 s; linear criterion puts the boundary at a = 2.97 for this calibration (waves grow but do not stop cars) | new |
| Fig 4 | each dot a 1 km ring, one car braked to a stop, 25 min, last 10 min cross-correlated 40 s apart | computed | idmJamRun: TOT 1500 s, rows over last 600 s every 2 s, lag 20 rows | new |
| Fig 4 / prose | about -14.5 km/h at a = 0.8, -10.3 at a = 0.5, barely depending on density | computed | t_all.mjs: a = 0.8 median -14.49 over 19 full-stop rings (45-135/km, range -14.22 to -15.21); a = 0.5 median -10.26 over 22 rings (35-140, range -10.20 to -10.53); page readout "-14.5" | new numbers (were -14 and -10 from Fig 2 readout) |
| Fig 4 | near the band edge the wave does not stop cars and its speed wanders | computed | a = 1.0: 11 jammed rings (page filter), none with a full stop, -7.2 to -15.4 km/h; a = 0.8 at 35-40/km: -10.6, -13.1 without full stops | new |
| Fig 4 | forward-drifting patterns at the band's low edge left out | computed | a = 0.5 rho 25 (+18.3) and a = 0.8 rho 30 (+1.4) pass the jam filter with c > 0 | new |
| prose | stopped cars 6.9 m apart at a = 0.8, so each waits about 1.7 s | computed | median front-to-front spacing of neighbouring stopped cars 6.940 m; tau = 6.94 / (14.49/3.6) = 1.72 s; page readout "6.9 m ... 1.7 s" | replaces ell = 7 m, tau 1.8 s |
| prose | brisker drivers leave sooner, so Figure 1's jam speeds up with a | computed | Fig 1 scan: -8.9 (a 0.6) to -19.0 (a 1.8); Fig 4 slider a = 0.4: tau 2.9 s | new |
| Fig 6 | jam pattern speed by cross-correlation on 2,000-cell ring at rho 0.35, 50 ticks apart; outflow 400 cells past a 1,000-car block | computed | nsJamSpeed / nsOutflow code (detector at cell 1400, block 0-999, ticks 300-1500) | new |
| Fig 6 / prose | at p = 0.25: outflow 0.51, chord -0.58, pattern -0.59 cells/tick, -16 km/h | computed | t_all.mjs and page readout: out 0.514, chord -0.577, jam -0.585; x 27 = -15.8 km/h | replaces -0.57 / -15 km/h (ledger t5 on a 4000-cell ring; this page's estimator gives -0.585) |
| Fig 6 | chord J_out/(1 - J_out/(vmax - p)) tracks the measured speed for all p | computed | p 0..0.6: measured vs chord within 0.035 cells/tick (largest gap p = 0.15: -0.727 vs -0.693); p = 0.5: -0.369 vs -0.358 | new |
| prose | jam speed = flow difference over density difference (kinematic shock speed) | derived | conservation of cars across a moving boundary (Lighthill-Whitham shock condition; stated from memory, no citation on page) | new |
| prose | cars that just left dawdle and re-stop, so jams recede slower than 1 - p | computed | as in ledger (t4/t6) and Fig 6 dots below the 1 - p line for every p > 0 | kept, shortened |
| Fig 7 | violet jam line from jam density 1000/6.94 = 144/km with slope -14.49 km/h passes through the a = 0.8 ring dots; nothing fitted | computed | n7.mjs: ring flows 45-135/km fall by 72-73 veh/h per 5/km (slope -14.5 km/h) and reach zero near 144/km; screenshot shows dots on the line | new |
| prose | IDM rings carry about 10 to 15 percent less than uniform flow, less near edges | computed | t_vdr2.mjs: 35/km 15.1%, 45-100/km 10.4-11.8%, 110 9.3%, 120 7.5%, 130 4.2% | kept, "(less near the edges)" |
| Fig 8 | VDR rule: stopped cars dawdle with p0, moving with p; Barlovic values vmax 5, p = 1/64, p0 = 0.75 | sourced | Barlovic 1998 eq. (1) and p.8: "vmax = 5, braking probability p = 1/64 of the moving cars and a higher value p0 = 0.75" | new |
| Fig 8 | phase-separated branch (1 - p0)(1 - rho); free branch rho(vmax - p) | sourced | Barlovic 1998 eq. (2) and "Jhom = rho(vmax - p)" | new |
| prose | rho1 = 1/(1 + (vmax - p)/(1 - p0)) = 6.4 cars/km | sourced / derived | Barlovic: Delta x = Tw vf + 1 = 1/rho_f, Tw = 1/(1 - p0), rho_f = rho1; 1/(1 + 4.984/0.25) = 0.0478 x 133.3 = 6.37 | new |
| prose | adding cars: flow peaks about 2,900 cars/h at 22 cars/km, then drops to about 720 | computed | seed 11: peak 2882 at 22.0/km, next steps 1698 (mid-transition), 722, 706, 738; page readout 2882 at 22.0. Seeds 1-5: peak 2825-2885 at 21.3-22.0 | new |
| prose | 22 cars/km is where cars can no longer keep five empty cells ahead | derived | 1/(vmax + 1) = 0.1667 per cell = 22.2/km | new |
| prose | removing cars, jam survives down to about 7 cars/km | computed | seed 11: last jammed step 7.3/km (6.7/km back on the free line); page readout 7.3; seeds 1-5: 7.3-8.0 | new |
| prose | lower line's slope -(1 - p0) is the jam's speed; jam compact because moving cars rarely dawdle | sourced / derived | Barlovic p.9: "The condition p << 1 guarantees that interactions of cars due to velocity fluctuations are rare. As a consequence, the jam is compact"; slope from eq. (2) | new |
| prose | at p0 = p the two paths coincide | computed | page readout at p0 = 1/64: largest shortfall 22 cars/h, no jam below the peak | new |
| prose | real motorways: dense free flow persists until broken, jam outflow lower than flow before | sourced | Barlovic abstract ("metastable states with very high flow") and p.2 ("reduction of the outflow from a jam compared to the maximum possible flow") | reworded |
| Fig 5 / Fig 7 | NaSch runs now seeded (Fig 5 seed 1, Reset increments; Fig 7 seed 7) | computed | code | was Math.random |
| removed | "a single car simulated for 200,000 ticks gives 4.75"; "-0.75 packed edge"; "-0.35 at p = 0.5"; "0.32 outflow"; "64 vs 36 km/h" | n/a | cut for length; -0.35/0.32 superseded by Figure 6 (page now -0.37, 0.33 at p = 0.5) | cut |

Render check PASS. Headless Chromium at 1280 and 390, light and dark, motion on and reduced: 0 console errors, no horizontal overflow, no SVG text under 11px, no NaN/undefined/em dash. Interaction path driven: Figure 1 slider to 2.6 and back, New noise, Run 120 s (reduced); Figure 4 slider to 0.8, 0.4, 1.3, dot click loads N 50 / a 1.0 into Figure 2; Figure 3 arrow keys; Figure 5 p slider moves Figure 6's marker (readout p = 0.50: -0.37, outflow 0.33, chord -0.36); Figure 8 slider to p0 = p and 0.5 (jam to 13.3/km), Run again.

### 04 enrichment

2026-10-05. Page: docs/emergence/04-coarsening-and-consensus.html. Three new figures
(3 scaling collapse, 4 flip vs swap, 5 voter vs majority) and Figure 8 (was 5) rebuilt as a
two-rule bifurcation diagram; old Figures 3 and 4 renumbered 6 and 7. New figures use a
seeded mulberry32 (seed shown on the page). Numbers below were computed with the page's own
functions extracted verbatim by brace matching (scratch eng2.mjs) and run in node with the
page's loops and record schedules (run3.mjs, run4.mjs, run5.mjs, run8.mjs, t0.mjs); for the
default seeds the headless Chromium readouts match node exactly (Fig 3 0.52/0.52/0.51/0.51/0.52,
Fig 4 flip 0.43 / swap 0.24, Fig 5 0.58 / -0.48, Fig 8 2.17 / 2.45). Scripts were session
scratch and not kept. Sources read this session: Castellano, Fortunato, Loreto RMP 81, 591
(arXiv 0710.3256 full text: voter Eq. 10, Deffuant 1/(2 eps), HK section); Frachebourg and
Krapivsky (arXiv cond-mat/9508123 via ar5iv, abstract page journal-ref PRE 53, R3009);
Ben-Naim, Krapivsky, Redner (arXiv cond-mat/0212313 abstract and ar5iv text); Huse PRB 34,
7845 (abstract via search); Lifshitz and Slyozov (bibliographic record via search).

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 04 | Fig 3: in the default run (seed 1, 256x256) C(r) falls to 1/2 at 0.51 or 0.52 of L(t) at t = 10, 30, 100, 300, 1000 | computed | run3.mjs seed 1: 0.525, 0.517, 0.512, 0.513, 0.516; browser readout identical | new |
| 04 | L grows eightfold, 4.7 to 37 cells | computed | seed 1: L = 4.7, 7.5, 13.0, 20.7, 37.0 | new |
| 04 | Other seeds agree within 0.02 up to 300 sweeps; at 1000 the last curve can sit up to 0.08 lower; a domain spans a sixth of the grid | computed | seeds 2-6: 0.495-0.529 for t <= 300; at t = 1000 0.443-0.514 with L 40-48 (256/45 = 5.7) | new |
| 04 | Fig 3 crops 6L(t) wide look alike; curves collapse when rescaled | computed | figure screenshots, raw and rescaled | new |
| 04 | Swap (Kawasaki) rule fixes each opinion's head count, so consensus is impossible | derived | a swap exchanges two unlike cells | new |
| 04 | Noise rule 1/(1+e^{2d/T}); T = 0 reproduces the majority rule (coin flip on ties); T > 0 is Ising (Glauber), Tc = 2.27 | derived | heatBath table; E = 2 x unlike pairs + const so dE = 2d; Tc = 2/ln(1+sqrt 2) = 2.269; slider max 2.0 | new |
| 04 | At T = 1.5, flip slope 0.39 to 0.52 over ten seeds | computed | run4.mjs seeds 1-10: 0.385-0.524 (fit t >= 10 until half-width > 8 or one opinion > 75%) | new |
| 04 | Flips pass within 14 to 21 sweeps the domain size trades reach after 10,000 (about 2.6 cells to half-height) | computed | run4.mjs: swap half-width at 10,000 = 2.54-2.67; flip first reaches it at t = 14-21 | new |
| 04 | Swap slope rises from about 0.13 (10-100 sweeps) to 0.21-0.24 (last decade) | computed | run4.mjs: 10-100 0.126-0.142; 100-1000 0.164-0.191; 1000-10000 0.205-0.236 | new |
| 04 | At T = 0 trades stop making progress within about a hundred sweeps, domains two cells across | computed | t0.mjs: N/bonds 1.59 (t=10), 1.88 (100), 1.90 (1000 and 10000); half-width 0.94-0.95 | new |
| 04 | Lifshitz-Slyozov ripening gives t^(1/3); Huse: corrections from excess transport in interfaces delay it, why MC had not seen 1/3 | sourced | Huse 1986 abstract ("asymptotic exponent (1/3) has not been observed in Monte Carlo simulations ... attributed to such corrections ... due to excess transport in interfaces"); Lifshitz and Slyozov J. Phys. Chem. Solids 19, 35 (1961) bibliographic only, full text not read | new |
| 04 | Voter: rho(t) = pi/(2 ln t + ln 256) at large times, so 1/rho gains 2/pi per e-fold | sourced | Castellano et al. Eq. (10), citing Frachebourg and Krapivsky 1996; ar5iv text gives the same with time unit tau = 4/D (= 2 in 2D), so the constant depends on the time unit; the slope 2/pi does not. The page plots only the slope | new |
| 04 | Voter fitted gain 0.55-0.69, mean 0.62, over ten seeds (256x256, t >= 10 to 2000) | computed | run5.mjs seeds 1-10: 0.585, 0.635, 0.643, 0.652, 0.686, 0.655, 0.547, 0.656, 0.587, 0.557 (mean 0.620). At 160x160 the slope ran high (0.70-0.86), which is why the figure uses 256 | new |
| 04 | Majority rho falls as t^-0.45 to t^-0.51 (10-1000 sweeps) | computed | run5.mjs: -0.448 to -0.507 | new |
| 04 | After 1000 sweeps 14-16% of voter pairs disagree vs about 1% under majority | computed | run5.mjs: voter 0.138-0.161, majority 0.0104-0.0131 | new |
| 04 | Voter domains still coarsen and the model never freezes into stripes | derived / sourced | any unlike pair can flip, so only consensus is absorbing; Castellano et al.: for d <= 2 coarsening to consensus | new |
| 04 | Deffuant major-camp spacing 2.17 eps in default sweep (seed 2026), 2.12-2.21 over five seeds | computed | run8.mjs seeds 2026-2030: 2.174, 2.192, 2.209, 2.115, 2.213 (300 people, 91 eps from 0.05 to 0.5, 6 runs each) | new |
| 04 | Count runs 11-13% under 1/(2 eps) for eps <= 0.2 | computed | run8.mjs mean ratio count x 2 eps: 0.868-0.890. Agrees with the old ledger's 10-15% (old Fig 5) | replaces old "10 to 15 percent" sentence |
| 04 | Ben-Naim, Krapivsky, Redner rate equation: spacing 2.155 eps; minor camps between majors and at the ends | sourced | ar5iv cond-mat/0212313: period L = 2.155 in Delta = 1/(2 eps) units, clusters alternate major/minor, separation L/2, extreme minor clusters | new |
| 04 | More than half of pairwise runs leave at least one minor camp | computed | run8.mjs: 0.55-0.57 of runs, 0.74-0.79 minor camps per run | new |
| 04 | HK leaves a minor camp in about one run in twenty; majors about 2.5 eps apart; count a quarter under the bound | computed | run8.mjs: 0.04-0.06 of runs; spacing 2.455-2.511; ratio 0.730-0.747 | new |
| 04 | HK mean count falls to 1.5 by eps about 0.21; pairwise 0.26-0.28 | computed | run8.mjs first eps with mean <= 1.5: HK 0.205-0.22; Deffuant 0.255-0.28 | replaces old "one major camp typical once eps passes about 0.3" |
| 04 | Castellano et al.: HK consensus threshold about 0.2 on complete graphs for large N | sourced | review section on HK: "if <k> -> infinity ... complete graphs, eps_c = eps_2 ~ 0.2" | new |
| 04 | HK rule: everyone moves at once to the mean of opinions within eps | sourced | review Eq. (31); code uses strict < eps like the Deffuant code | new |
| 04 | Fig 8 caption: 300 people, 91 eps values, six runs per rule, all to convergence | code | epsList 0.05:0.005:0.5; Deffuant up to 200 blocks of 50N meetings, conv.mjs over seeds 2026 and 2027 (1,092 runs per rule): every run converged, at most 19 blocks; HK until max move < 1e-9 (at most 88 steps), cap 5000 | new |
| 04 | Fig 7 caption (was Fig 4) and Fig 6 caption (was Fig 3) shortened; "at 50% about a third of runs end in stripes" | computed (old ledger) | old ledger: 0.339 at 32x32 over 1000 runs | caption trimmed |
| 04 | Removed: open-dots-above-filled sentence and old Fig 5 (cluster count vs eps scatter) | n/a | superseded by Figure 8 (minor camps shown as grey dots) | cut |

Rendering: render-check PASS. Playwright (shots.mjs, interact.mjs) at 1280 and 390, light
and dark, reduced motion on and off: 0 console errors, no NaN/undefined/Infinity on screen,
no horizontal overflow, no SVG text under 11px, no U+2014. Driven: Fig 1 play/step/rule
buttons and speed slider; Fig 3 rescale toggle by keyboard, New start; Fig 4 noise slider
Home/End by keyboard, Play/Pause, New start; Fig 5 New start; Fig 7 eps slider; Fig 8 canvas
click, arrow and shift-arrow keys, Run again. New figures run only while on screen
(Motion.onVisible) and under reduced motion draw grids only at the end of a run.

### 05 enrichment

File: docs/emergence/05-spin-glass.html. 2026-10-05. Four new figures (2, 5, 6, 7); old Figures 2 and 3 are now 3 and 4. The model code for the new figures is one DOM-free block, `<script id="sg-model">` (object `SG`), which the figures call and which the scripts below extract from the HTML and run in node with the page's seeds. Scripts (session scratchpad 05/): drive.mjs (extracts mulberry32 and the sg-model block from the page), verify.mjs (Figures 2 and 5), verify2.mjs (Figures 6 and 7), pw.mjs and pwi.mjs (Playwright: every figure run to completion and screenshotted at 1280 and 390 px, light and dark, plus clicks, arrow keys and buttons; reduced-motion run), pwq.mjs (Chromium vs node check). render-check: PASS. No horizontal scroll at 390 px; no SVG text under 11 px; no console errors.

Seeds: Figure 2 mulberry32(5150), draw-major order over k = 0..43, 24 draws each. Figure 5 bonds mulberry32(640), spins and dynamics mulberry32(641) for every temperature. Figure 6 mulberry32(1975), per sample: couplings, steepest descent, quench, anneal, exact (N <= 20); 24 samples for N <= 256, 12 at 512, 6 at 1024. Figure 7 panel p uses mulberry32(1983 + p); "New" buttons step the seed.

Node and Chromium agree on every number quoted except Figure 7's third glass sample (|q| < 0.25: 40.7% in node 26, 39.9% in Chromium 147); long chaotic runs diverge between engines. The page quotes the browser's 40%.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 05 | The 20-spin patch has 43 bonds and 24 triangles | computed | SG.patch(4, 5) | new |
| 05 | Fig 2 dashed curve: expected frustrated share with exactly k of 43 bonds AF | derived | P(odd AF among 3 bonds drawn without replacement) = [k C(43-k,2) + C(k,3)] / C(43,3); matches column means (e.g. 0.503 vs 12.08/24 at k = 17) | new |
| 05 | Frustrated share reaches one half by 40% AF and climbs to every triangle at 100% | computed/derived | expectation first >= 0.5 at k = 16 (37%); k = 43: 24.0 of 24 in all draws (a triangle is an odd loop) | new |
| 05 | Broken bonds >= half the frustrated count (floor) | derived | each frustrated triangle needs >= 1 broken bond, each bond borders <= 2 triangles | new |
| 05 | At 40% (17 of 43): 12.1 of 24 frustrated, ground state breaks 8.0 bonds vs floor 6.0, median 6 ground states | computed | verify.mjs k = 17: 12.08, 8.04, 6.04, median 6 (browser readout identical) | new |
| 05 | All AF: 12 broken bonds pair the 24 triangles exactly; ground state unique on this patch | computed | verify.mjs k = 43: broken 12.00 = floor, count 1 in 24/24 draws (open parallelogram boundary) | new |
| 05 | On a large triangular lattice the all-AF ground-state count grows exponentially (Wannier 1950) | sourced | Wannier, Phys. Rev. 79, 357 (1950), "Antiferromagnetism. The Triangular Ising Net": nonzero entropy at T = 0 (0.323 k_B per spin after correction), via search listing and INSPIRE record | new |
| 05 | Median 17 ground states just short of all AF; more than 100 in 8 of 1,056 draws | computed | verify.mjs: highest column medians 17 (k = 39, 41); 8 draws > 100, max 232 (k = 29) | new |
| 05 | Planar ground state = pairing frustrated triangles with shortest strings of broken bonds, a matching problem | sourced (reworded) | Mertens cond-mat/0012185 (ledger row above: planar Ising reduces to minimum-weight matching); the string picture is Figure 2's floor argument | rewording of existing row |
| 05 | Fig 5: 64 x 64 periodic triangular lattice, 4,096 spins, 40% AF; same bonds and start at T = 0, 0.6, 1, 2 | computed | SG.bigLattice(64, 0.4), agingRun seeds above; T = 0 accepts only dE < 0 (the Figure 4 quench rule) | new |
| 05 | T = 0 quench stuck within seven sweeps at -0.426 per bond, no lower than T = 2 | computed | verify.mjs: final -0.4258 first recorded at sweep 7; T = 2 runs -0.419 to -0.434 (final -0.421) | new |
| 05 | T = 1: -0.544 at 300, -0.549 at 10,000 | computed | verify.mjs: -0.5443 at 289, -0.5485 at 10,000 | new |
| 05 | T = 0.6: -0.560 at 3,000, -0.562 at 10,000, still falling | computed | verify.mjs: -0.5599 at 3,156, -0.5615 at 10,000 (last change at sweep 6,234 on the recording grid) | new |
| 05 | T = 2: three ages give the same curve, forgets in a few dozen sweeps | computed | C at t = 30: 0.141, 0.155, 0.179 for ages 10, 100, 1000; about 0 by t = 300 | new |
| 05 | T = 0.6, 1,000 sweeps on: overlap 0.42 from age 10, 0.73 from age 1,000 | computed | verify.mjs t = 1,013: 0.417 and 0.733 | new |
| 05 | T = 1: 0.18 vs 0.41 after 1,000 sweeps | computed | verify.mjs t = 1,013: 0.175 (age 10), 0.405 (age 1,000) | new |
| 05 | Aging measured in CuMn by Lundgren, Svedlindh, Nordblad, Beckman 1983 | sourced | Phys. Rev. Lett. 51, 911 (1983), "Dynamics of the Relaxation-Time Spectrum in a CuMn Spin-Glass" (search listing and arXiv reviews citing it as the aging experiment) | new |
| 05 | SK model: all pairs coupled, Gaussian couplings of variance 1/N (Sherrington and Kirkpatrick 1975) | sourced | PRL 35, 1792 (1975), title and abstract summary via search: infinite-ranged Gaussian random interactions | new |
| 05 | SK freezes below T = 1 (with variance 1/N) | from memory | standard T_f = J result of the SK paper, not read this session; consistent with Fig 7 (P(q) collapses at T = 1.5) | check |
| 05 | Parisi ground-state energy -0.7633 per spin | sourced | Palassini, arXiv cond-mat/0307713: "e0 = -0.7633..." citing Parisi's RSB solution | new |
| 05 | Palassini: finite-size gap shrinks roughly as N^(-2/3) | sourced | same paper: <e_N> = e0 + b N^-omega, omega = 0.673 +- 0.002 | new |
| 05 | Exact ground state at 20 spins averages -0.654 per spin | computed | verify2.mjs, 24 samples (12: -0.641, 16: -0.664) | new |
| 05 | Anneal finds the exact ground state in 59 of 72 small samples | computed | 22/24 at N = 12, 18/24 at 16, 19/24 at 20 (node and browser agree) | new |
| 05 | Anneal reaches -0.749 at 1,024 spins; both descents near -0.68, about 0.07 higher | computed | N = 1024, 6 samples: anneal -0.7493, steepest -0.6760, quench -0.6818 (gaps 0.073, 0.068) | new |
| 05 | Steepest-first vs random order makes little difference | computed | means within about 0.02 of each other at every N from 12 to 1024, crossing back and forth | new |
| 05 | Parisi proposed the overlap distribution P(q) as order parameter (1983) | sourced | G. Parisi, PRL 50, 1946 (1983), "Order parameter for spin-glasses": order parameter related to the probability distribution of overlaps (search summary) | new |
| 05 | Fig 7: 64 spins, 2 copies x 12 temperatures (T to 1.6, or to 2.4 for T = 1.5), 20,000 sweeps, 4,000 burn-in | computed | SG.overlapRun; swap acceptance 0.72 to 0.74 at T = 0.5, 0.93 to 0.98 at 1.5; P(q < 0) between 0.488 and 0.495 at T = 0.5 (pq2.mjs, same seeds) (symmetric, so the copies mix) | new |
| 05 | Equal-coupling ferromagnet (1/N) also orders below T = 1 | derived | Curie-Weiss m = tanh(m/T), T_c = 1; Fig 7 peaks at q = +-0.94 match m^2 with m = 0.957 at T = 0.5 | new |
| 05 | Ferromagnet: two sharp peaks at q = +-0.94 | computed | peak bin q = -0.938 (= -30/32), 11.1% of samples; |q| < 0.25: 0% | new |
| 05 | Glass samples: |q| < 0.25 holds 26%, 6%, 40% | computed | Chromium 26.0%, 6.4%, 39.9% (node: 26.0, 6.4, 40.7) | new |
| 05 | T = 1.5: all four collapse to one bump around zero | computed | |q| < 0.25: 94%, 86%, 85%, 87% | new |
| 05 | Figure 3 (anneal) prose trimmed; ground-state degeneracy now "about nine ground states" | computed (earlier) | existing row: median 9 over 120 draws | reworded |

### 06 enrichment

File: docs/emergence/06-percolation.html. Checked 2026-10-05. Scripts (scratchpad 06/): engine.js (the page's Newman-Ziff `Perc` block), t1.cjs / t2.cjs / t3.cjs (Figure 2 and 6 statistics in node with the page's seeds; t3 reruns other seeds), t4.cjs / t5.cjs / sandbox.js (Figure 5 sandbox fits on the coupled forest), tau.mjs (Figure 4 slopes over 100 forests via the page itself), pw.mjs (Playwright at 1280 and 390, light and dark: runs every sweep to completion, drives the mode toggle, the nu slider, arrow keys on Figure 2 and the Figure 3 slider, and reads every readout). Node and Chromium give identical numbers (seeded mulberry32, one stream per lattice size). render-check: PASS.

Prose (paragraphs and captions) 1,764 words before, about 1,200 after. Figure count 7 to 9: old Figure 2 (fraction burned at one size) replaced; Figures 5 and 6 new; Figure 3 rebuilt on a coupled 256 x 256 forest; SIR and Drossel-Schwabl figures renumbered 7 to 9 with unchanged code.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| Fig 2 | One forest answers for every density: sites added in random order, spanning occupation number recorded, canonical curve by binomial convolution | derived | Newman and Ziff, PRL 85, 4104 (2000) method (already cited for p_c); code in `Perc.run` / `Perc.spanCurve` | replaces the old fraction-burned sweep and its "1500-forest crossing at 0.593" claim, now gone |
| Fig 2 | 50% points 0.590, 0.592, 0.593, 0.593, 0.593 at widths 16, 32, 64, 128, 256 (4,000 / 4,000 / 2,000 / 1,000 / 400 forests, seeds 2000 + L) | computed | pw.mjs readout; t2.cjs gives 0.5905, 0.5915, 0.5929, 0.5928, 0.5926 | new |
| prose | Curves cross near p_c "at about even odds" | computed | R(0.5927) = 0.516, 0.516, 0.502, 0.505, 0.518 for the five sizes (t2.cjs) | new |
| prose | 10%-90% width 0.16 of density at 16 wide, 0.023 at 256 | computed | widths 0.1608, 0.0975, 0.0589, 0.0337, 0.0231 (pw.mjs, t2.cjs); log-log slope -0.71 | new |
| prose | Least spread of the rescaled curves at nu = 1.39 for this seed, 1.31 to 1.37 for three others | computed | spread = RMS over levels 0.1..0.9 of the x-spread across sizes over the largest size's 10-90 width, scanned nu 1.00..2.00 step 0.01; seeds 3000+L, 4000+L give 1.31, 1.36; 5000+L with 4x samples gives 1.37 (t3.cjs). Spread at nu = 1 is 0.057 vs 0.015 at 4/3 | new |
| prose | nu = 4/3 exactly in two dimensions (den Nijs 1979; Smirnov and Werner 2001); correlation length diverges as abs(p - p_c)^-nu | from memory | den Nijs J. Phys. A 12, 1857 (conjecture) and Smirnov-Werner Math. Res. Lett. 8, 729 (proof for triangular site) are both already in the page's reference list; the nu value itself not re-read this session | check |
| Fig 3 | Coupled forest: each cell keeps a random number, tree iff below density, so the slider grows one forest | derived | code (`u[i] < density`) | new |
| Fig 3 | Default forest (seed 3046) at 59% spans, largest cluster 25,046; at 62% 35,081 | computed | pw.mjs readouts | new |
| prose | Figure 4 at 59% on 256 x 256: slope about -1.8 over 100 forests, per-forest -1.69 to -1.94 (pooled -1.83); 35 of 100 forests span | computed | tau.mjs (page's own forest + doubling bins, least squares on log bin density) | replaces the 150-wide "about 1.8" |
| prose | At 45% the counts bend down | computed | pooled 100 forests: local slopes 1.69 (4-8), 1.88 (8-16), 2.36 (16-32), 3.21 (32-64), 5.06 (64-128) | wording kept |
| prose | Critical cluster fills boxes as side^(91/48), which follows from tau = 187/91 via tau = 1 + 2/d_f | derived | 2 / (187/91 - 1) = 182/96 = 91/48; the hyperscaling relation tau = 1 + d/d_f is from memory | check |
| Fig 5 | Sandbox power (sides 5-65, up to 2,000 centres): 1.60 at 55%, 1.89 at 59%, 1.96 at 62%, 1.98 at 65%; same forest at p_c 1.90 | computed | pw.mjs readouts; t4.cjs over four seeds: p_c 1.85-1.90, 55% 1.40-1.67, 65% 1.98 | new |
| prose | Above p_c the power climbs to 2 in big boxes; below, it falls | computed | t5.cjs local slopes, seed 3046: 65% 1.89 at side 5 rising to 2.00 by 65; 55% 1.77 at 5 falling to 1.35 at 65; p_c 1.82-1.93 | new |
| Fig 6 | Crossing 50% points on 64 x 64: 0.591 site square, 0.500 bond square, 0.498 site triangular | computed | pw.mjs readouts (400 samples each, seeds 6000 + 1000k + L) | new |
| prose | Largest cluster at each lattice's own threshold vs width 16-256: fitted slopes 1.85, 1.88, 1.86 against 91/48 = 1.896 | computed | pw.mjs readouts; mean largest cluster at n = round(M p_c) occupied (microcanonical) | new |
| prose | Thresholds 0.5927 / 1/2 / 1/2 (Newman-Ziff; Sykes-Essam; Kesten) | sourced | rows carried from LEDGER 06 | shortened |
| prose | Epidemic, Drossel-Schwabl, fire-size claims | sourced / computed | unchanged from LEDGER 06 (density 0.39, fire sizes 2,000 / 8,000 / a third of the grid, slope readings, Grassberger 2002); only reworded and the presets paragraph folded into the Figure 8 caption | none |

### 07 enrichment

File: docs/emergence/07-sandpile.html. Enriched 2026-10-05. Old Figure 2 (one-grid histogram with a tau fit) and Figure 3 (identity only) were replaced; old Figure 4 (spectra) is now Figure 6. Every figure computes live in the page; all randomness is mulberry32 with fixed seeds (Fig 1 seed 1, Fig 2 seed 1 and seed+100, Fig 3 seed 1000+L, Fig 4 driven pile seed 7 and random pile seed 3, Fig 6 seed 500+run). Scripts (session scratchpad 07/): models.js, moments.js, deriv.js (BTW and Manna moment analysis, 4 seeds), abel.js (two-order demo), burn.js (identity, burning test, determinant), point.js and point2.js (point source by stack and by sweeps), spec.cjs (extracts Figure 6 functions from the page, runs 10 seeds), fig1.cjs (Figure 1 model with its seed), pw.mjs / pw2.mjs / pw3.mjs / pw4.mjs (Playwright readouts at 1280 and 390, light and dark, reduced motion). Sources read this session (PDF text): Luebeck 2000 (arXiv cond-mat/9910374), Chessa et al. 1999 (cond-mat/9808263), Tebaldi et al. 1999 (cond-mat/9903270), Pegden and Smart 2013 (arXiv 1105.0111, journal ref from the arXiv page), Dhar 1999 lecture notes (cond-mat/9909009), Dhar 1990 abstract (repository.ias.ac.in/9280 via search). render-check: PASS.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 07 | Roughly 21,000 grains before the mean height settles near 2.11 (Fig 1, now seeded) | computed | fig1.cjs: mean height 2.071 at 21,000, 2.109 at 23,000, 2.110 at 200,000; browser 2.12 after Skip (30,000) | Seed 1 replaces Math.random |
| 07 | Just over half the grains topple nothing in the stationary state | computed | fig1.cjs: 56.0% after grain 30,000 on the 100-wide grid; spectra pile 55.5-57.4% (spec.cjs) | |
| 07 | Final pile and per-cell toppling counts do not depend on order (Dhar 1990) | sourced | Pegden and Smart 2013 intro: "neither the final configuration nor the number of topplings which occur at each vertex depend on the order"; Dhar 1990 per existing ledger | |
| 07 | Fig 2: seed 1 relaxes in 94 topplings in both orders; up to 48 cells differ partway; 0 differ at the end | computed | abel.js (12 seeds, all 0 differences); browser readout | |
| 07 | P(s) = s^-tau G(s/L^D) scaling form | sourced | Chessa et al. eq. (1)-(2), x_c ~ L^beta | |
| 07 | Manna 1991 rule: a cell with 2 or more empties, each grain to a random neighbour | sourced | Luebeck 2000 Sec. II, citing Manna J. Phys. A 24, L363 | |
| 07 | Fig 3 local slopes (40,000 avalanches per grid, seeds 1000+L): BTW 2.35 at q=1, 2.54 at 2, 2.62 at 3.5; Manna 2.58, 2.70, 2.73; sigma(1) 1.91 and 1.90 | computed | pw4.mjs readout; 80,000 per grid gives BTW 2.35/2.53/2.61, Manna 2.58/2.68/2.70; deriv.js over 3 other seeds agrees | |
| 07 | Manna slope moves 0.06 from q=1.5 to 3.75; BTW 0.16 | computed | pw4.mjs at 40,000: Manna 2.676 to 2.735, BTW 2.467 to 2.627 (80,000: 0.028 and 0.147) | |
| 07 | Moment estimate: BTW D 2.62, tau 1.27; Manna D 2.73, tau 1.31 | computed | pw2.mjs (button), tau = 2 - sigma(1)/D, the relation in Chessa et al. | |
| 07 | Luebeck 2000: same bend on grids to 4,096; BTW and Manna in different universality classes | sourced | cond-mat/9910374 abstract and Sec. III (Fig. 3 inset: Manna derivative saturates, BTW has finite curvature; L up to 4096 for BTW) | |
| 07 | Tebaldi, De Menech, Stella: BTW toppling numbers multifractal | sourced | cond-mat/9903270 abstract | Reworded from "traced it" |
| 07 | Chessa et al. read moment analysis as one class, D about 2.7, tau 1.27 for both | sourced | cond-mat/9808263 abstract and Table I (Manna beta_s 2.74, BTW 2.73, tau_s 1.27 both) | |
| 07 | Luebeck and Usadel put Manna tau at 1.275 | sourced, secondary | Luebeck 2000 Fig. 2 caption: tau_s = 1.275 +- 0.011 "obtained from a regression analysis [9]", [9] = PRE 55, 4095. Primary not read | |
| 07 | sigma(1) = 2 exactly since <s> ~ L^2; grains wander about L^2 steps | sourced + derived | Chessa et al.: "the exact result <s> ~ L^2, which implies sigma_s(1) = 2"; random-walk reading is the standard Green's-function argument (Dhar 1999 Sec. 2 gives the order-L lower bound) | |
| 07 | Two neighbouring 0s are forbidden; burning test of Majumdar and Dhar 1992 | sourced | Dhar 1999 Secs. 4, 4.2 (heights 1-4 there; 0-3 here, so "burn if h >= unburnt neighbours"), burning test credited to ref [14] = Physica A 185, 129 | |
| 07 | Identity = (6 - 6deg)deg; 85% 2s and 3s; central square of 2s ringed by 3s | computed | burn.js: counts 0/1/2/3 = 220/128/780/1,176; existing ledger for the construction | |
| 07 | Fig 4 readouts: identity 5,216 grains, burns in 45 rounds; driven pile (seed 7) 4,818 grains, 111 rounds; random 0-3 (seed 3) 148 of 2,304 burn; adding e changes 1,693 cells and the result burns fully; adding e again changes 0 | computed | burn.js and pw2.mjs agree | |
| 07 | Adding grains to a recurrent pile keeps it recurrent, so (c + e)deg is recurrent for any c | derived | e is recurrent; recurrent set is closed under adding grains (standard Markov-chain argument, not checked against a source this session) | |
| 07 | Number of recurrent piles = det of toppling matrix (Dhar 1990); about 10^1178 on 48x48 vs 4^2304 = 10^1387 | sourced + computed | Dhar 1999 eq. (22); Dhar 1990 abstract ("determines its entropy for an arbitrary finite lattice"); log10 det from the Dirichlet Laplacian eigenvalues 4 - 2cos(j pi/49) - 2cos(k pi/49): 1177.99 (burn.js) | |
| 07 | Recurrent pile holds at least one grain per bond: 4,512 on 48x48, mean height >= 2(L-1)/L = 1.96 | sourced + derived | Dhar 1999 Sec. 4 (before 4.2): grains >= Ns + Nb in heights 1-4, i.e. >= Nb in 0-3 | Earlier draft justification via forbidden patterns was wrong; removed |
| 07 | Pegden and Smart: picture rescaled by sqrt(N) converges to a unique limit, characterised via an elliptic obstacle problem | sourced | arXiv 1105.0111 abstract and Thm 1.1 (rescaling by n^(1/d)); Duke Math. J. 162, 627 (2013) from the arXiv page | |
| 07 | Fig 5: 2^14 -> 4,900,462 topplings, radius 49.0, r/sqrt(N) 0.383; 2^16 -> 77,107,818, 97.3, 0.380; 2^17 -> 305,502,617 topplings, radius 137.2, about 4 s | computed | point2.js and pw2.mjs (3,979 ms headless) | |
| 07 | 2^16 grains take 77,107,818 topplings by sweeps and by a stack | computed | point.js (stack, floor(h/4) per pop) and point2.js (sweeps): identical | |
| 07 | Fig 6 now seeded: size per grain slope +0.00 to +0.04; topplings per step -1.56 to -1.67 (run 1: +0.03, -1.67); dip below 0.01 (slope +0.34 to +0.76); flat below 0.002 (-0.20 to +0.10) | computed | spec.cjs over runs 1-10 using the page's own functions | Prose "near -1.6" and "flat" unchanged |

House rules: no em dashes; canvas and d3 colours go through Theme.c / Theme.pick (the old page fed fixed RGB to canvases in dark mode; now paired). Captions say faint/strong instead of light/dark so they read in both themes. No SVG text under 11px at 1280 or 390, no horizontal overflow at 390, no console errors in light, dark or reduced motion.
