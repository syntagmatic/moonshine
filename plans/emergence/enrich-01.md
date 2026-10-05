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
