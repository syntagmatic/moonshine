# Fact-check

The gallery's one queue for fact-checking. I want every claim a reader can
check to be derived, computed or sourced, and this file tracks how far each
series has got and which suspect claims are still waiting for a look.

- **Status** says which series have been through a full fact-check. A full
  check produces a claims ledger at `plans/<series>/LEDGER.md` (one row per
  claim: verified, wrong or unverifiable, with the source) and a fix pass;
  `plans/algorithms-ml/` is the reference for both.
- **Open leads** are claims someone flagged but didn't fix: during a prose
  sweep, a review, a reader report. One line each: page, the claim, and why
  it looks wrong. Add new ones under their series.
- When a series' fact-check settles a lead (fixed, or checked and fine),
  delete the line here and record the outcome in that series' ledger. This
  file only holds what's still open.

## Status

| Series | Fact-checked | Notes |
|---|---|---|
| algorithms-ml | 778056b | ledger: 205 verified / 39 wrong / 33 unverifiable, all fixed |
| emergence | 5753d65 | ledger: 528 / 91 / 90, all fixed |
| modular-forms | 1670df4 | ledger: 467 / 90 / 44, all fixed |
| japan-earthquakes | a12a28f | ledger: 178 / 11 / 15, all fixed |
| noether | | |
| parallel-coordinates | | |
| mathematical-diagrams | | |
| exceptional-atlas | | |
| bioinformatics | | |
| cohomology | | its `LEDGER.md` is a build tracker, not a claims ledger |
| decision-trees | | |
| lattice-simulation | | |
| lithium-ion | | |
| grateful-dead | | |
| quasicrystals | | |
| foam | | its `LEDGER.md` is a build tracker, not a claims ledger |
| sph | | Ian's series; ask before touching |

## Open leads

### modular-forms

- 03: "Finite area is what makes spaces of modular forms finite-dimensional"
  is a strong causal claim; check the ledger covers it.
- 07: "tau(n) grows roughly as n^(11/2)" follows an upper bound, so it says
  more than the bound shows.
- 08 subtitle: "Hecke eigenforms have multiplicative coefficients" lacks the
  a(1) = 1 normalisation the body has.
- 10: "Fourier coefficients of a cusp form ... are point counts"
  (a_p = p + 1 - #E(F_p) determines the count; it isn't the count).
- 11: "c(0) = 744 is a convention" (744 is forced once j is normalised by
  1728; the choice is j versus J).

### emergence

- Three primary sources are paywalled and unverified (see the ledger's
  unverifiable rows).

### japan-earthquakes

- 03: "about ten dots a week" conflicts with "about one a day" for
  2001-2010.
- 06: p12 says thrust or normal faults make tsunamis; the fault-types
  caption says only shallow thrust faults do. Check against the ledger.

### noether

- 04: the "Symmetry of L vs symmetry of the equations of motion" section says
  a transformation changing L by a total derivative is "a symmetry of the
  equations of motion ... and it still gives a Noether conservation law",
  which reads as if EOM symmetry suffices; Fig 1 scaling is an EOM symmetry
  with no conservation law.
- 06: the driven oscillator's Hamiltonian is said to track a "loss", but
  driving can also add energy.
- 07: Pauli's 1926 hydrogen derivation is called "first" (debatable); check
  the 1710/1799 dates.
- 09: check "spring 1915" and "only six independent" equations.
- 11: Fig 1 caption "at most d(12) = 6" is a loose bound; "Dedekind used ACC
  implicitly" needs a source.
- 12 / index: Buchberger is presented as the answer to Gordan's objection,
  but they concern different problems (page wording softened in the sweep;
  the index card still says "the constructive answer").
- 13: the quadric cone z^2 = xy is said to open "along the z-axis"; its axis
  is the line x = y, z = 0. "Two preimages over a generic point" holds over
  C, not R; a generic change of variables needs an infinite field; the page
  states neither.

### parallel-coordinates

- 02: crossings "gather where many pairs share a linear trend" holds only
  for negative trends; positive trends converge outside the strip (the page
  says so earlier).
- 03: "With equal coefficients the polylines form a symmetric fan" is
  unverified; the Hyperplanes section never shows the indexed-point
  representation the PROMPT implies.
- 04: the greedy ordering grows the chain from both ends, so it's a variant
  of nearest-neighbour TSP, not the heuristic itself; "most of them hide the
  interesting structure" is unsupported.
- 05: "to the right of the right axis for positive correlation" holds only
  for slopes between 0 and 1; 05 spells "h-star", 06 "hstar".
- 06: the circle's bowtie is said to be widest at the center's height and to
  pinch toward the extremes; band width 2r·sqrt((1-t)^2+t^2) is narrowest
  midway between the axes. Check the ellipse "wider on one side" claim too.
- 07: slope is defined as (x_j - x_i)/d, so a slope range selects a diagonal
  band of differences, not a wedge by ratio; the wedge wording conflicts
  with the formula.
- 08: the Fig 1 hint says labels turn red "outside the normal bundle" but
  the caption says "exceeds spec" (±3σ); the reactor data isn't captioned
  as simulated until Fig 2's text.
- 09: "A controller can't evaluate the CPA formula for every pair" is
  doubtful; conflict-detection software computes CPA routinely.
- 10: the 3-link solution family is called "the null space of the redundant
  arm"; it's the self-motion manifold (the null space is the Jacobian's).
  N - K holds generically, away from singularities.
- 11: "slopes between axes show trade-off rates" conflates one design's two
  values with a rate between designs.
- 12: the text says "stereographic wireframe", the aria label says
  "perspective wireframe".

### mathematical-diagrams

- 02: the Tait conjecture is paraphrased as "as knotted as it looks"; the
  precise claim is about minimal crossing number.
- 03: "entropy falls off fastest toward the corners" is questionable (the
  gradient is steepest at the edges); check Aitchison 1982 for perturbation
  and powering.
- 04: "finite in finite type and has a lowest-weight vertex when the
  representation is finite-dimensional" is muddled; in finite type the
  second condition is redundant.
- 06: unbounded ends correspond to boundary lattice segments, not boundary
  lattice points (the count 3d is unchanged).
- 08: "the diagram determines the algebra, through its ordered dimension
  group" merges Bratteli's result with Elliott's.
- 10: check the intermediate contraction sizes 720 and 1500 against the
  figure code.

### exceptional-atlas

- 02: the old subtitle said the Weyl group "rebuilds the whole root system
  from a single root"; the body says that holds only for simply-laced
  systems (two orbits otherwise). The subtitle no longer says it; check the
  index and PROMPT don't either.
- 05: "every finite subgroup of SU(2) except Z/2 has a_ij in {0, 1}" also
  fails for the trivial group; the intro credits the Platonic double covers
  with all the ADE diagrams, but the cyclic and binary dihedral groups
  aren't Platonic.
- 07: "the three branched solutions of 1/p+1/q+1/r > 1" ignores the
  (n, 2, 2) family (D_n); three holds only for the exceptional ones.
- 08: Fig 9 caption says the 600-cell's inner products are cosines of
  multiples of 36 degrees; cos 60 = 1/2 is also one.
- 09: the kissing-number table's best-known values for dimensions 9 (272)
  and 10 (336) may be out of date; "phi is a combination of modular forms of
  weight 8 and 12" glosses over the quasimodular and weakly holomorphic
  forms Viazovska used.

### bioinformatics

- 02: the PROMPT says TP53 and p21 appear in every article; 02 uses EGFR
  throughout (scope, not a factual error).
- 03: "Circos defines five primitives" undercounts its track types; check
  "roughly 90 million years" for human-mouse divergence (estimates run
  about 75 to 90 Mya).
- 06: prose hard-codes "74 of the 80 patients" beside an in-browser
  computation; confirm it's seeded.

### lithium-ion

- 03: the activation energy is uncited.

## Other open issues

Not claims, but found during checks and not yet fixed.

- emergence 05, 06, 14: randomness is unseeded.
- emergence 03: Fig 2's click interaction is mouse-only.
- japan-earthquakes: the Japan Trench label overlaps dots.
- mathematical-diagrams 03: ids `m-delta` and `m-r3-2` are duplicated, so
  only the first copy of each renders.
