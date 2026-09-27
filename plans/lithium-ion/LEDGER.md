# Claims ledger: lithium-ion

This series hasn't had a full fact-check; these are settled leads only (from plans/FACT-CHECK.md, 2026-09-27).

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 03 | SEI activation energy "reported in the 40-60 kJ/mol range" (uncited); code uses 50 kJ/mol | unverifiable as worded, fixed with sources | Waldmann et al., J. Power Sources 262, 129 (2014): Ea = 0.38 eV (about 37 kJ/mol) for cycle aging of NMC/graphite 18650s above 25 C. Schmalstieg et al., J. Power Sources 257, 325 (2014): calendar fade factor proportional to exp(-6976/T), i.e. Ea about 58 kJ/mol. 50 kJ/mol sits inside that span | Parenthetical now cites both and says the page uses 50 |
| 03 | 25 to 45 C "multiplies k by about 4", "about four times sooner", caption "roughly quadruples" | wrong, fixed | exp(50000/8.314 (1/298.15 - 1/318.15)) = 3.55; 25 to 35 C gives 1.92 ("roughly doubles" is fine); sqrt(3.55) = 1.88 | Prose now "about 3.5" and "about 3.5 times sooner"; Figure 1 caption now "multiplies it by about 3.5" and thickness "about 1.4x and 1.9x" |
