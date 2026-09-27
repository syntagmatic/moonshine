# Claims ledger: decision-trees

This series hasn't had a full fact-check; these are settled leads only (from plans/FACT-CHECK.md, 2026-09-27).

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 05, index | TreeSHAP credited to "Lundberg (2017)" | wrong, fixed | The 2017 paper (Lundberg and Lee, NeurIPS, "A Unified Approach to Interpreting Model Predictions") introduced SHAP and KernelSHAP. Exact polynomial-time TreeSHAP is Lundberg, Erion and Lee, "Consistent Individualized Feature Attribution for Tree Ensembles", arXiv:1802.03888 (2018); journal version Lundberg et al., Nature Machine Intelligence 2, 56-67 (2020) | 05 now credits Lundberg, Erion and Lee (2018); index references list SHAP (2017) and TreeSHAP (2018) separately |
| 02 | "Oblique trees (1994)" | wrong, fixed | Breiman, Friedman, Olshen and Stone, CART (1984), sec. 5.2, already offered linear-combination splits; 1994 is OC1 (Murthy, Kasif and Salzberg, JAIR 2, 1-32), which searches for them by randomized hill climbing | Sentence now credits CART (1984) and describes OC1 (1994) as the randomized search |
