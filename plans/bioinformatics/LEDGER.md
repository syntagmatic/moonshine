# Bioinformatics Visualization: claims ledger

This series has not had a full fact-check. The rows below are only the leads
flagged in plans/FACT-CHECK.md and settled on 2026-09-27.

| Page | Claim | Verdict | Source or derivation | Fix |
|---|---|---|---|---|
| 02 | PROMPT: TP53 and p21 visible in every article | wrong (scope), fixed | Pages as they stand: TP53/CDKN1A carry 01, 04, 06, 08; 03 and 05 refer back; 02 uses EGFR throughout; 07 uses generic simulated cells. | PROMPT opening and "What to get right" bullet rewritten to match |
| 03 | "Circos defines five primitives" | wrong, fixed | Circos 2D track types include scatter, line, histogram, heat map, tile, text, connector and highlight (circos.ca tutorials, 2D data tracks). | Now says Circos has more track types (text, connectors, highlights) but five carry most quantitative data |
| 03 | Human-mouse synteny shuffled over "roughly 90 million years" | wrong (overprecise), fixed | Mouse Genome Sequencing Consortium 2002: about 75 Mya; TimeTree median in the high 80s; molecular estimates range to about 96 Mya. | "roughly 75 to 90 million years since their lineages split" |
| 06 | "recovers the planted subtype for 74 of the 80 patients"; most of the six misses are hypermutated tumors near the quiet group | fine | Data and clustering use seeded mulberry32 (seed 42), no Math.random. Headless run (twice) prints "assigned 74 of 80"; misses are 5 planted Hypermutator -> Quiet and 1 Quiet -> Hypermutator. | none |
