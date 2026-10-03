# Sources for article 7 (verification pass of 2026-10-03)

Full texts cached under `scripts/connectomes/.cache/papers/` (zheng2022, caron2013, eichler2017 from PMC HTML; li2020 from Europe PMC XML; dasgupta2017 from the bioRxiv HTML).

## Zheng, Li, Fisher et al. 2022, Curr Biol 32: 3334 (PMC9413950, author manuscript)

- "The MB contains about 2,200 intrinsic neurons, called Kenyon cells (KCs), on each side of the brain"; "~150 olfactory projection neurons (PNs), which relay information from the 51 olfactory glomeruli"; claws ensheathe a single PN bouton; "each KC samples input from an average of ~6-8 PNs".
- "all olfactory PN inputs to 7,102 claws arising from 1,356 KCs were mapped and identified (~62% of all claws on the right side of the brain)"; "Each KC was found to have 5.2 claws on average". KCs randomly sampled from a cross-section of the pedunculus.
- Methods: "~9% of claws receive inputs from" multiglomerular PNs, thermo/hygrosensory PNs, fewer than 3 synapses, or LHNs/APL/MBONs; analysis uses "91% of the claws that receive input from uniglomerular olfactory PNs".
- Conditional input: "Select all KCs having at least one claw receiving input from a bouton of Glom A. The number of inputs to these KCs from Glom B, C, D ... are counted"; 10,000 randomizations; z = (observed - mean) / sd. Code: `get_raw_inputs` (subtracts the number of selected KCs on the diagonal).
- Random bouton model: claws assigned to boutons uniformly. Random claw model: "the number of claws receiving input from a given PN type ... and the number of claws each KC has ... are maintained" (code permutes glomerulus labels across claws).
- Fig. 3C: core-community claws observed 1,916 vs random bouton 1,421.7 +/- 35.7 (z 13.8). Fig. 4D: "-0.044 +/- 2.11 vs. -0.058 +/- 1.47" (our computation: random bouton 2.10, random claw 1.47).
- Core community "nearly all ... preferentially responsive to food-related odorants"; overconvergence dominated by αβ and α′β′ KCs.
- Caron data reanalysed: no community; "When connectivity data from the present study were randomly sub-sampled to match this lower number, minimal network structure was detected".
- Local random model: "each claw of each KC is randomly assigned to one of the five nearest PN boutons (including the one it ensheathed in the observed network)"; the code (`pick_random_from_neighbours`) excludes the observed bouton. Fig. 5B: 1,890.6 +/- 22.5 core claws; core community disappears against this null (Fig. 5E-F).
- Core PN axons clustered; αβ and α′β′ dendrites constrained to core territories; the 46 KCs with most core input form "4 clusters ... that may correspond to the 4 KC neuroblasts".
- Fig. 7: discrimination worse for realistic connectivity, recovered "if signal was channeled exclusively through the community PN types".
- Repository bocklab/pn_kc (MIT): revision branch (claw table, bouton table, code, `200926-RD_local_random_tbl.csv` covering only the 439 manually traced KCs), master branch (`data/pre_post_info/pn_all_kc` synapse records).

## Caron, Ruta, Abbott & Axel 2013, Nature 497: 113 (PMC4148081)

- Abstract: "each KC integrates input from a different and apparently random combination of glomeruli ... no discernible organization with respect to their odour tuning, anatomic features, or developmental origins".
- "between 2 and 11 dendritic claws (average = 7, n = 200)"; "on average 3 glomerular inputs were identified per KC"; 665 connections.
- Shuffle "maintaining the number of connections each of them receives"; pairs, trios and quartets "consistent with expectations from the shuffled data set".

## Li, Lindsey, Marin et al. 2020, eLife 9: e62576 (PMC7909955, CC BY)

- Deviation from the random model "due to differential sampling of olfactory glomeruli by γ, α′/β′, and α/β KCs"; DP1m and DM1 favoured by α′/β′ and α/β.
- Radius shuffle: "models with PN-to-KC connectivity randomly shuffled within a specified radius r ... (note that the model and the data are identical for r = 0)"; effect "modest"; "Noticeable effects are present when the length scales for random shuffling is greater than approximately 10 μm"; strongest for α/β and α′/β′; "Nevertheless, it might be relevant for specific odor categories".

## Dasgupta, Stevens & Navlakha 2017, Science 358: 793 (bioRxiv 10.1101/180471 v1, CC BY-NC-ND)

- "There are 50 ORN types"; "50 PNs project to 2000 Kenyon cells (KCs), connected by a sparse, binary random connection matrix"; "Each Kenyon cell receives and sums the firing rates from about 6 randomly selected PNs"; APL: "all but the highest firing 5% of Kenyon cells are silenced"; the circuit is "a novel variant of ... locality-sensitive hashing"; LSH uses random projections. Step 1 "centers the mean" by divisive normalization.

## Hallem & Carlson 2006, Cell 125: 143

- Abstract (Europe PMC): "a panel of over 100 odors"; "strong responses are sparse"; "inhibitory responses are widespread among receptors".
- Table from drosolf (commit 2ff3591); 1,426 CAS-matched values (62 odours x 23 receptors) equal DoOR.data's `Hallem.2006.EN` column minus the spontaneous rate; spontaneous rates equal DoOR's SFR row. Other odours did not match on CAS spelling and were not compared.

## Eichler et al. 2017, Nature 548: 175 (PMC5806122)

- Larva: "most Kenyon cells integrate random combinations of inputs but that a subset receives stereotyped inputs from single projection neurons". Not used on the page.
