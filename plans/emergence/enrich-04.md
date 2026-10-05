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
