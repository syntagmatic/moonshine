# Check of REPORT.md (2026-09-30)

REPORT.md was checked against primary sources by three passes; details in
datasets.md, topics-1-8.md and topics-9-13.md. Use it for framing and reading
lists only. No number from it goes into a page without its own ledger entry.

- Headline dataset counts mostly hold (FlyWire v783, hemibrain, Winding 2023,
  H01, Markov 2014, C. elegans 302/385 neurons).
- Every "(d) worked example" uses invented inputs with correct arithmetic on
  top. Two conclusions are reversed: C. elegans small-worldness survives a
  spatial null (sigma about 5; degree-preserving nulls take it to about 2.2),
  and MT sits above V2 in the Markov hierarchy.
- Invented or misattributed: Takemura 2013 T4 inputs and Fact 8 mechanism,
  mushroom-body co-sampling numbers (real source: Zheng et al. 2022),
  Witvliet 1,328/6,654 and feedforward 1.26 to 2.53, Lee 2016 like-to-like
  numbers, the Pang 2023 rebuttal (real: Faskowitz et al. bioRxiv
  10.1101/2023.07.20.549785), 4 bibliography entries, 14 bad DOIs, and most
  of the Section 6 edge counts and licenses.
- The vizbench-notes numbers were laundered into citations. Male CNS is
  Berg et al. (bioRxiv 2025.10.09.680999, now Cell): 166,691 neurons, 11,691
  types, 94% presynaptic and 42% postsynaptic sites on traced bodies. From a
  traced neuron's view its input partners are ~94% known and its outputs
  ~42% captured (the vizbench labels are right); the lost pieces are
  postsynaptic dendrite twigs, not thin axon twigs as the report says. No
  "13x" dimorphism figure exists in the paper.
- Cook 2019 and Witvliet 2021 data carry no stated license; Markov 2014 is
  CC BY-NC.

## Data for the figures (checked 2026-10-01)

Every figure in plans/connectomes/PROMPT.md has a confirmed, token-free source;
see data-mouse.md, data-fly.md and data-other.md. Raw files are cached in
scripts/connectomes/.cache/ (gitignored). Gaps: Calabrese 2015 dMRI is not
public (use Trinkle 2021); MICrONS covers only VISp, RL, AL; the macaque
white-matter distance matrix is public only for 11 targets (628 pathways);
Chen 2006 predicted positions must be recomputed from WormAtlas fixed points.
