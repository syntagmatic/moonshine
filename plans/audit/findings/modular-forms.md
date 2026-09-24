# Findings: modular-forms track

The series went from 20 articles to 14. Numeric checks were run in node, mostly with exact BigInt arithmetic. The scripts are in the session scratchpad and are not committed.

## Cut, merged, renumbered

Cut: 13 maass-forms, 14 automorphic-landscape, 17 lattices-e8-and-leech, 18 the-bridge-and-moonshine-specification.

Merged:
- 02 + 05 became `02-sl2z-and-mobius.html`, "SL₂(ℤ), Generators and Relations".
- 06 + 09 became `05-modular-forms-definition.html`, "Modular Forms and Their Dimensions".

| old | new |
|---|---|
| 01-upper-half-plane | 01 (same) |
| 02-sl2z-and-mobius + 05-generators-and-structure | 02-sl2z-and-mobius |
| 03-fundamental-domain | 03 (same) |
| 04-cusps-and-cusp-forms | 04 (same) |
| 06-modular-forms-definition + 09-ring-and-dimensions | 05-modular-forms-definition |
| 07-eisenstein-series | 06-eisenstein-series |
| 08-discriminant-and-ramanujan-tau | 07-discriminant-and-ramanujan-tau |
| 10-hecke-operators | 08-hecke-operators |
| 11-weight-2-and-modular-curves | 09-weight-2-and-modular-curves |
| 12-modularity-theorem | 10-modularity-theorem |
| 15-the-j-function | 11-the-j-function |
| 16-the-monster-and-mckay | 12-the-monster-and-mckay |
| 19-vertex-operators-and-moonshine-module | 13-vertex-operators-and-moonshine-module |
| 20-borcherds-proof-and-beyond | 14-borcherds-proof-and-beyond |

Other changes:
- The footers, "Part N of 14" labels and "explainer N" cross-references were regenerated or fixed.
- The correct material from 18 moved into 13: the modular/algebra dictionary, graded dimension and graded trace, the Conway–Norton wish list, and the grade decomposition table. The "four-step bridge" and the claim that E8³ sits inside Leech were dropped.
- Salvage from the cut pages:
  - 13: the Maass heatmap is fake and nothing was kept.
  - 14: the genus chart is a copy of the one in 09.
  - 17: the Coxeter ring figure was invented. Its Golay decoder is real (weight enumerator 1/759/2576/759/1, checked), but exceptional-atlas/14 already covers Golay → Leech. Suggested home if wanted: exceptional-atlas/14. Source: `git show HEAD~:docs/modular-forms/17-lattices-e8-and-leech.html`, "Figure 3".

## Errors confirmed and fixed

The five flagged errors are all fixed:
- **E_k integrality (06).** c_12 = 65520/691 was confirmed. c_k is an integer for k = 4, 6, 8, 10, 14 and not for 12 or 16.
- **Ring over ℤ (05, 06).** The ring is ℤ[E4, E6, Δ]/(E4³ − E6² − 1728Δ). Δ is not an integer combination aE4³ + bE6².
- **Mordell/Hecke (07).** Mordell's 1917 proof used operators that Hecke generalised in 1937.
- **Ribet (10).** Ribet proved the epsilon (level-lowering) conjecture. Serre's conjecture was proved by Khare–Wintenberger in 2009.
- **Hyperbolic metric (01).** The figure now draws a true hyperbolic disk of radius 0.4: centre y·cosh R, Euclidean radius y·sinh R. It shrinks toward the real axis.

Other errors confirmed and fixed:
- **06:**
  - The E_k normalisation was 1/2 and is now 1/(2ζ(k)).
  - The page said E6's coefficients "alternate"; they are all negative.
- **07:**
  - Δ = η²⁴ had a stray (2π)¹².
  - The E12 relation "Δ = (E12 − E6²)/(65520/691)" is false. It was replaced by 691E12 = 691E4³ − 432000Δ, checked exactly to n = 40, with the mod-691 derivation (65520 ≡ −432000 ≡ 566).
  - Sato–Tate needs τ(p)/(2p^{11/2}).
  - The Lehmer bound was updated to 8×10²³.
  - A broken "&sup4;" entity was fixed.
- **09:** the root number is ε = −η, where η is the Atkin–Lehner eigenvalue. The page had ε equal to the eigenvalue. 11a coefficients and a_p point counts were verified.
- **02** (merge fork):
  - The word builder computed products in reverse.
  - ρ was said to be "in ℤ".
  - The elliptic-point and trace wording was fixed.
- **05** (merge fork):
  - The dimension-formula cases were swapped (dim M4 came out as 0).
  - The "cusp part" subtracted the wrong form.
  - Double-precision coefficients were wrong past 2^53.
  - The checker was truncated to 25 terms.
- **11:**
  - The asymptotic ratio at n = 1 is 0.97, not "~20× under".
  - Heegner near-integrality holds only for d = 43, 67, 163.
  - The moonshine section was trimmed to a handoff.
- **12:**
  - The largest irrep is about 2.6×10²⁶, not 10²⁸. A fabricated 1.37×10²⁸ "twin" was removed, and lib twinDim became maxDim.
  - 59 and 71 are the largest primes, not the smallest.
  - "Subgroups" became subquotients.
  - Links to the cut 17/18 now point to exceptional-atlas.
- **13:**
  - Co1 is not a subgroup of M; 2^{1+24}.Co1 is.
  - Aut(V_Leech⁺) is 2^24.Co1.
  - 194 classes give 171 distinct series.
  - VOA weight and grade numbering were reconciled (the Griess algebra is weight 2).
  - The θ action was corrected.
  - c = 24 is not the critical dimension.
  - Thompson moonshine attribution was corrected.
- **14:**
  - The norm of (1, n) is −2n.
  - 194 became 171.
  - The product formula for j(p) − j(q) is due to Koike, Norton and Zagier, not Borcherds.
  - The trinity section and the grand-summary coda were cut.

Rejected: none of the flagged errors turned out wrong. The Monster decomposition data (12, 13) and the grade decompositions from 18 are correct and sum-checked, so they stay.

## Figures made honest

- **01 metric figure:** now draws true hyperbolic circles.
- **04 q-expansion figure:** it was four free sliders, and its preset buttons were dead. It now evaluates real E4, E6 and Δ on iy from 300 terms (Δ in BigInt), with the first N terms kept as a truncation. Checked against S-invariance.
- **06 lattice figure:** the "lattice sum" added up |mτ+n|^{-k}, a positive real number, and compared it with complex E_k. It now forms the complex sum divided by 2ζ(k), which converges to the q-expansion value (checked to 5 digits).
- **08 Hecke calculator:**
  - It used doubles, so the eigenvalue table reported ✗ for p = 17, 19, 23: τ(2p) lay past the 30-term array.
  - It is now exact BigInt with 80 terms, and all 9 primes verify.
  - The non-eigenform example is now E4³ in M12. E4²E6 was replaced because in weight 14 it is actually a multiple of E14, an eigenform.
- **02:** the matrix-to-word decomposition was added, and the stabiliser figure was rebuilt with a draggable probe.
- **05:** a new dimension staircase with exact basis reduction to k = 48.
- **11:** Heegner distances are now computed.
- **13:** the boson chart now computes p(n), 1/η²⁴, Θ_Leech/η²⁴ = j − 720, and the V♮ orbifold count.
- **14:** the KNZ product is now multiplied out exactly, and the replication cascade is computed (it had used Math.random).

## Unresolved, needs a human

- Em dashes and "Play:/Takeaways" scaffolding remain in paragraphs that weren't touched. This is left for the prose pass.
- The index intro still calls the series "a pressure system" and the act-machine figure is decorative. Both were left for the prose pass. The KPI-style facts grid on the index was removed.

## Inbound links

Other series link only to `modular-forms/index.html`, which still exists:
- cohomology/index
- exceptional-atlas/07, 07b and index
- index
- mathematical-diagrams/index
- parallel-coordinates/15 and 23

No links point into deleted or renamed pages.

## Homepage entry

- title: Modular Forms
- count: 14
- desc: From the hyperbolic plane to monstrous moonshine: SL₂(ℤ), Eisenstein series and Δ, Hecke operators computed exactly, point counts over 𝔽_p, then the j-function, the Monster, the moonshine module and Borcherds' proof.
- tags: number theory, modular forms, moonshine, hyperbolic geometry
