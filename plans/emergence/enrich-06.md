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
