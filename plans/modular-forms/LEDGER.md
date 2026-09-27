# Claims: Modular Forms series

Built 2026-09-25, the same way the Algorithms & ML series was audited. Every checkable
claim in the prose, captions, equations, readouts and alt text of the fourteen essays,
the series index and the two shared math libraries, each checked this session:
**Computed** means the page's own code (or the `lib/` function it calls) was extracted
and run in node, or the figure was read in headless Chromium; **Derived** means worked
by hand; **Sourced** means read in the named primary source (paper or arXiv text, LMFDB,
OEIS, ATLAS data, a standard text). `[x]` verified, `[ ]` wrong, `[?]` unverifiable
(reword or cut). Line numbers refer to the pages as of commit a12a28f. The node, Python
and Playwright scripts were session scratch and were not kept; each entry says what was
run.

Entries marked **SPECIALIST** still want a number theorist's eye even after sourcing,
usually because the best source could not be read in full or a convention is subtle.

The wrong and unverifiable entries below were all addressed in the fix pass the same
day (corrected, reworded or cut); the "Fix pass" section at the end records what
changed on each page and the new numbers each entry now carries. The entries themselves
still describe the pages as audited, before the fixes.

## Status

| # | article | verified | wrong | unverifiable | render-check | notes |
|---|---|---|---|---|---|---|
| 01 | Upper half-plane | 22 | 1 | 0 | PASS | disk panel drew a truncated, straight-edged F |
| 02 | SL2(Z) and Mobius maps | 25 | 2 | 0 | PASS | word algorithm exact on 121k matrices; tile edges drawn as chords |
| 03 | Fundamental domain | 20 | 6 | 3 | PASS | figure captions and "many rounds" claim overstated; j head matches OEIS A000521 |
| 04 | Cusps and cusp forms | 18 | 6 | 1 | PASS | cusp matrix wrong for most negative inputs; tiles chords; ticks 10px |
| 05 | Modular forms and dimensions | 44 | 2 | 0 | PASS | checker's "relative difference" blew up at zeros of E_k; all math verified |
| 06 | Eisenstein series | 27 | 1 | 1 | PASS | "691 in every denominator" false (n = 1381); rest verified |
| 07 | Discriminant and tau | 30 | 3 | 4 | PASS | heatmap wrong near real axis; checker capped at mn <= 30; irregular-prime wording |
| 08 | Hecke operators | 19 | 4 | 2 | PASS | S26 missing; Mordell/Ramanujan conflated; route boxes overflow |
| 09 | Weight 2 and modular curves | 26 | 5 | 3 | PASS | Deligne misattributed for weight 2; converse theorem overstated; caption wrong |
| 10 | Modularity theorem | 22 | 8 | 4 | PASS | history of the conjecture wrong; lib j and p = 2 counts wrong |
| 11 | The j-function | 45 | 13 | 2 | PASS | figure 1 evaluated divergent q-series off F; asymptotic misattributed to Hardy-Ramanujan |
| 12 | Monster and McKay | 40 | 9 | 6 | PASS | "Diophantine constraint" argument false (dim 1 exists); c(4), c(5) sums not unique |
| 13 | Vertex operators, moonshine module | 44 | 6 | 4 | PASS | FLM date and Griess/Tits attribution wrong; figures genuinely compute; label defects |
| 14 | Borcherds' proof and beyond | 43 | 14 | 7 | PASS | Gannon/umbral dating, BRST misattribution, Koike credit, GKM figure contradicted its legend |
| idx | Series index | 14 | 2 | 2 | PASS | rho-bar mislabel in header viz; four card/h1 title drifts left for lead |
| lib | lib/modular-math.js | 8 | 3 | 2 | n/a (lib) | all coefficient values correct to n = 30; float internals fragile, j wrong from c(11) |
| moonlib | lib/moonshine-math.js | 20 | 5 | 3 | n/a (lib) | no data value wrong; five comments misattributed history |
| | **Total** | **467** | **90** | **44** | | |

Counts are the `[x]` / `[ ]` / `[?]` entries in each section below (a few sections cross-reference another section's entry; those are counted where they appear).

## Open items from earlier passes

- **10, Shimura/CM attribution.** Resolved: the page said "Shimura (1964) refined it for CM curves", which is wrong. Shimura stated the conjecture for all elliptic curves over Q (to Serre and Weil, most likely 1964; Harris arXiv 2003.08242, quoting Lang, Notices AMS 42 (1995)); CM curves over Q were proved modular by Shimura, Nagoya Math. J. 43 (1971), building on Deuring and Hecke. Weil 1967 proved the converse theorem. Page rewritten. See 10, entry `185`.
- **10, Frey curve conductor normalisation.** Resolved: the conductor of y^2 = x(x - a^p)(x + b^p) is rad(abc) and the minimal discriminant (abc)^(2p)/2^8 only after normalising (b even, a = -1 mod 4; Serre, Duke 54 (1987) sec. 4.1, quoted in Ribet, Ann. Fac. Sci. Toulouse 11 (1990)). Page now states the normalisation; Ribet's level-lowering lands at level 2, where S_2(Gamma_0(2)) = 0. The mod-4 sign convention is flagged SPECIALIST. See 10, entry `202`.
- **10, "classical" for n = 3 and 4.** Resolved as accurate: n = 4 is Fermat's descent; n = 3 is Euler 1770 (with a gap usually filled from his other work), with Kausler and Legendre giving independent proofs. Primary texts not read (SPECIALIST). See 10, entry `198`.
- **Gannon proof date.** It appears only on 14 (line `239`). Now "proved in 2012 (published 2016)", with what he proved: that the twined genera found by Cheng, Gaberdiel-Hohenegger-Volpato and Eguchi-Hikami are characters of genuine M24 representations (arXiv 1211.5531; Adv. Math. 301 (2016) 322-358).
- **Monster and moonshine numbers.** Monster order, the 194 irreducible dimensions (sum of squares equals |M| exactly), 196883, 21296876, 842609326, the largest dimension (~2.59 x 10^26), 171 distinct McKay-Thompson series, j coefficients through c(30), the Leech theta series and 196884 = 98580 + 98304 are all verified (entries under 11, 12, 13, 14, lib/moonshine-math.js). Wrong history around them was fixed: FLM dated 1984 (PNAS) and 1988 (book); Tits, not Griess, proved the Monster is the full automorphism group of the Griess algebra; Norton conjectured and Koike proved the replication property for the Hauptmoduln; umbral moonshine began with six groups in 2012 (arXiv 1204.2779) and grew to the 23 Niemeier cases in 2013 (arXiv 1307.5793), proved by Duncan, Griffin and Ono 2015; the j-coefficient asymptotic is Petersson 1932 / Rademacher 1938, not Hardy-Ramanujan.

## Items for a specialist

1. 05: the one-relation presentation of integer-coefficient forms as Z[E4, E6, Delta]/(E4^3 - E6^2 - 1728 Delta), attributed to Deligne's Formulaire; not read in the primary source.
2. 07: wording of "g2^3 - 27 g3^2 = (2 pi)^12 Delta" (Serre VII.4.4 read) and Sato-Tate for Delta (BLGHT 2011, from citation records).
3. 10: Frey's lecture year (1984 in secondary sources, "1985 Oberwolfach" in Ribet's Notices item); now left unstated on the page.
4. 10: the mod-4 sign convention for the Frey curve (Serre's A = -1 mod 4 against Ribet's "a = 1 mod 4" for a^l + b^l + c^l = 0).
5. 10: the n = 3 history (Euler's gap, Kausler, Legendre) rests on secondary sources.
6. 11: j(tau) generates the Hilbert class field (standard, Cox Thm 11.1 not read here).
7. 12: Thompson, Bull. LMS 11 (1979) 352-353 not read (paywalled); the decompositions themselves are sourced from Gannon.
8. 12: the Fischer-Griess prediction compressed from three steps (involution centraliser, order, 196883); Norton's role in 196883 and the framing of Ogg's supersingular-primes remark.
9. 13: whether Co1 embeds in the Monster at all; the page now claims only what the non-split extension 2^{1+24}.Co1 implies.
10. 13: sign conventions for lifting x -> -x to the lattice VOA, and FLM's extra involution (FLM book not read).
11. 14: "above 26 dimensions negative-norm states appear" (Brower 1972, not read); the "only indirectly" wording on Borcherds and genus zero.

## 01 The Upper Half-Plane and Hyperbolic Geometry

File: docs/modular-forms/01-upper-half-plane.html. Checked 2026-09-25. Scripts (in g1/): load.mjs (loads lib/modular-math.js and lib/moonshine-math.js into a node vm), t01.mjs (metric, distance, geodesics, isometries, Cayley, disk image of F), pw.mjs (Playwright sweep), figs.mjs (figure crops in shots/). Source read this session: K. Conrad, "SL(2,Z)" (kconrad.math.uconn.edu/blurbs/grouptheory/SL(2,Z).pdf), Appendix B. render-check: PASS.

### Prose and equations

- [x] ℍ is the complex numbers with positive imaginary part (`95`) : Derived. Definition.
- [x] Poincaré metric divides Euclidean length by height; the real axis is infinitely far away (`95`) : Derived. ds = |dτ|/y; the integral of dy/y diverges at y = 0.
- [x] ds² = |dτ|²/(Im τ)² = (dx² + dy²)/y² (`107`, KaTeX `math-metric`) : Sourced. Conrad App. B defines d_H as the integral of sqrt(x'² + y'²)/y along the path.
- [x] d(τ₁, τ₂) = arcosh(1 + |τ₁ − τ₂|²/(2 Im τ₁ Im τ₂)) (`111`, `math-dist`) : Computed. t01.mjs: numerically integrated |dτ|/y along the lib geodesic (20000 steps) for three pairs: 3.636893, 1.791759, 2.737085, equal to the formula to 6 decimals.
- [x] It depends only on |τ₁ − τ₂| and Im τ₁ Im τ₂ (`115`) : Derived. Read off the formula.
- [x] On one vertical line the distance is the log of the ratio of heights (`115`) : Computed/Sourced. d(0.5i, 3i) = 1.791759 = ln 6 (t01.mjs); Conrad Example B.1 gives |log(y1/y0)|.
- [x] Geodesics are vertical lines and semicircles centred on the real axis; horizontal lines are not (`119`) : Sourced. Conrad App. B ("Lines in h are the vertical lines ... or the semicircles ... that meet the x-axis in a 90-degree angle").
- [x] Travel at height 2 costs half as much per Euclidean unit as at height 1, so the geodesic between points at equal height detours upward (`119`) : Computed. For ±1.5 + 0.5i the arc has hyperbolic length 3.637 and the straight segment 6.000 (t01.mjs).
- [x] Orientation-preserving isometries form PSL₂(ℝ) = SL₂(ℝ)/{±I}, acting by Möbius maps; 3-dimensional (`136`, `140`) : Sourced. Conrad App. B and footnote 8 (orientation-preserving isometries are SL₂(ℝ)/{±I}); dimension 4 − 1 = 3 Derived.
- [x] Im(γτ) = Im τ/|cτ + d|² (`140`) : Computed. 10000 random SL₂(ℝ) matrices: max relative error 3e-15; distances preserved to 4e-13 (t01.mjs).
- [x] Disk metric ds² = 4|dw|²/(1 − |w|²)² (`144`) : Computed. Local scale factor through the Cayley map equals the half-plane one (ratio 0.99999994 with h = 1e-6).
- [x] Cayley transform w = (τ − i)/(τ + i), inverse τ = i(1 + w)/(1 − w), real axis to ∂𝔻, i to 0 (`146`, `148`) : Computed/Derived. toDisk(i) = 0, |toDisk(2)| = 1, round trip exact; inverse solved by hand.
- [x] Geodesics go to diameters and arcs orthogonal to ∂𝔻 (`148`) : Derived. Möbius maps are conformal and send circles/lines to circles/lines; the real axis maps to ∂𝔻, so arcs orthogonal to it map to arcs orthogonal to ∂𝔻.
- [x] f(γτ) = (cτ + d)^k f(τ), automorphy factor is a cocycle (`161`) : Derived. j(γδ, τ) = j(γ, δτ) j(δ, τ) for j(γ, τ) = cτ + d.
- [x] Parts 2 to 4 build the group and quotient; Part 5 puts functions on it (`161`) : Derived. Matches the titles of 02 to 05.
- [x] Naming ("Poincaré metric", "Poincaré disk", "Cayley transform", "Möbius transformation") : Derived. Standard names; no historical claim (date, priority) is made on the page.

### Figure 1 (metric disk)

- [x] Green circle = points within hyperbolic distance 0.4 of τ, Euclidean centre height (Im τ) cosh 0.4, radius (Im τ) sinh 0.4 (`104`, code `R_HYP`) : Computed. 360 points on the drawn circle for three τ: max |d − 0.4| = 1.3e-15.
- [x] Circle shrinks near the real axis; lower grid rows are hyperbolically wider (`104`) : Derived. Radius proportional to Im τ; row 0.5 to 1 has height ln 2 = 0.69, row 2.5 to 3 has ln 1.2 = 0.18.
- [x] Live readout ds²/|dτ|² = 1/(Im τ)² and Euclidean radius (code `update`) : Computed at runtime from τ; checked in the Playwright sweep (no NaN).

### Figure 2 (geodesics)

- [x] Purple geodesic, dashed Euclidean segment, readout d(τ₁, τ₂) (`131`) : Computed. Lib geodesic endpoints hit τ₁, τ₂; its integrated length equals hypDist (above).
- [x] "Unless the endpoints share a real part, the geodesic is a semicircular arc" (`131`) : Derived. Lib draws an arc of the circle centred on the real axis through both points; vertical case handled separately.

### Figure 3 (disk model)

- [x] Dragging either point moves the other through the Cayley transform (`156`) : Computed. Both handlers call toDisk/fromDisk; round trip exact.
- [ ] "The shaded region is the fundamental domain of SL₂(ℤ)" (`156`), disk panel : WRONG as drawn. The disk shape was lib fundDomainPath(4) mapped point by point: the vertical edges were 2 points each (so drawn as straight chords, midpoint off by 0.04 from the true arc) and the region was cut off at height 4, whose image has |w| = 0.605, so the shaded "domain" stopped well short of the boundary instead of running into the cusp at w = 1 (a point needs Im ≈ 208 to reach |w| > 0.99).

verified 22, wrong 1, unverifiable 0. Note: disk panel drew a truncated, straight-edged F.

## 02 SL₂(ℤ), Generators and Relations

File: docs/modular-forms/02-sl2z-and-mobius.html. Checked 2026-09-25. Scripts (in g1/): t02.mjs (extracts the page's euclidWord, tangent and angleDeg and runs them with lib Mod.sl2z), pw.mjs, figs.mjs. Source read this session: K. Conrad, "SL(2,Z)" (kconrad.math.uconn.edu/blurbs/grouptheory/SL(2,Z).pdf): Thm 1.1, Thm 2.7, Remark 2.8, Appendix A (Examples A.1, A.2, Thm A.3), Appendix C (Thm C.1), and the remarks on Γ(2)/{±I} being free of rank 2. render-check: PASS.

### Prose and equations

- [x] SL₂(ℤ) acts by (aτ + b)/(cτ + d); generated by S and T; relations S² = (ST)³ = −I (`94`, `146`, `160`) : Sourced/Computed. Conrad Thm 1.1 (S, T generate), and "S² = −I₂", "(ST)³ = −I₂". t02.mjs: S² = (ST)³ = (TS)³ = −I.
- [x] Integer matrices of SL₂(ℝ) form an infinite discrete subgroup; action preserves ℍ (`97`, `130`, `136`, `138`) : Derived. Im formula with ad − bc = 1 (also checked numerically on page 01).
- [x] γ and −γ act the same; PSL₂(ℤ) acts faithfully (`140`) : Sourced. Conrad App. A ("±I₂ both act trivially"), Thm A.3(3) (generic stabiliser is exactly ±I).
- [x] S: τ ↦ −1/τ inverts modulus, reflects across the imaginary axis, swaps inside/outside of the unit circle, fixes i (`148`) : Derived. −1/τ = −τ̄/|τ|².
- [x] Euclidean-algorithm proof: n nearest to a/c makes |a − nc| < |c|; S⁻¹ sends the column to (c, −(a − nc)); c = 0 forces ±Tᵐ (`150`, `math-euclid`) : Computed. euclidWord extracted from the page reproduces M exactly for 121,622 random determinant-1 matrices (entries up to 10⁵, 0 failures, up to 27 tokens), plus ±I, ±Tⁿ, ±S.
- [x] [[2,1],[1,1]] = T²ST; [[5,2],[7,3]] = TST⁴ST²ST in three rounds (`154`) : Computed. t02.mjs and the page readout in Chromium.
- [x] 5/7 = 1 − 1/(4 − 1/2), exponents are the partial quotients of this (nearest-integer, minus-sign) continued fraction; a/c = γ·∞ (`154`) : Derived. 4 − 1/2 = 7/2, 1 − 2/7 = 5/7.
- [x] In PSL₂(ℤ), S has order 2 and ST order 3 (`162`) : Sourced. Conrad Remark after Cor. 2.3 ("As a transformation on h, ST has order 3").
- [x] PSL₂(ℤ) = ⟨S, T | S² = (ST)³ = 1⟩ ≅ ℤ/2 ∗ ℤ/3; alternating words are equal only if identical (`162`, `166`, `math-pres`) : Sourced. Conrad Thm C.1 (unique reduced form; "PSL₂(Z) is a free product of Z/(2) and Z/(3)").
- [x] Trivial centre; free subgroups of every finite rank (`166`) : Sourced/Derived. Conrad: Γ(2)/{±I₂} is free of rank 2; a free group of rank 2 contains free subgroups of every finite rank (standard, e.g. commutator subgroup). Trivial centre: the centre of a nontrivial free product is trivial.
- [x] Clicking S twice, or S then T three times, returns to −I and the image to τ (`168`) : Computed. Chromium: both give "normal form: −I (±I: acts trivially), d(τ, γτ) = 0.000".
- [x] Images never pile up in ℍ; any two distinct images are at least as far apart as τ from its nearest image (`184`) : Derived. d(gτ, hτ) = d(τ, g⁻¹hτ) by isometry; discreteness gives a positive minimum.
- [x] Stab(i) = {I, S} in PSL₂(ℤ); S is a half-turn about i (`190`, `math-stab`) : Sourced/Computed. Conrad Ex. A.1 (Stab_i = {±I, ±S} in SL₂); derivative of S at i is −1 (t02.mjs).
- [x] ρ = e^{2πi/3}; ST·τ = −1/(τ + 1); ST·ρ = ρ; Stab(ρ) = {I, ST, (ST)²} ≅ ℤ/3; rotation by 2π/3 (`192`) : Sourced/Computed. Conrad Ex. A.2 (Stab_ω = ⟨ST⟩, order 6 in SL₂); derivative of ST at ρ has argument −120° (t02.mjs).
- [x] γ ≠ ±I fixes a point of ℍ only if |tr γ| < 2; integer trace in {−1, 0, 1} (`208`) : Sourced. Conrad App. A, Step 1: discriminant (d + a)² − 4 < 0.
- [x] Trace 0 gives γ² = −I and γ conjugate in SL₂(ℤ) to ±S; trace ±1 gives order 3 in PSL₂(ℤ), conjugate to (ST)^{±1} (`208`) : Sourced. Conrad Thm 2.7 proof (Cayley-Hamilton cases) and Remark 2.8 (order 4 conjugate to S or −S; orders 3 and 6 conjugate to powers of ST up to sign).
- [x] Every elliptic point is equivalent to i or ρ; ρ + 1 = −ρ̄ = T·ρ (`208`) : Sourced. Conrad Thm A.3.
- [x] Quotient has cone points with angles π and 2π/3 (`210`) : Derived. 2π divided by stabiliser orders 2 and 3.
- [x] Cone points return as fractional correction terms in Part 5's count (`210`) : Derived. Standard dimension formula / valence formula has 1/2 and 1/3 terms at i and ρ; 05 covers it (not re-audited here).

### Figure 1 (Möbius action and word)

- [x] Image γ·τ, dashed unit circle, word from the Euclidean algorithm recomputed on entry (`121`) : Computed. Chromium: 8 typed matrices, including [[233,144],[144,89]] → T²ST³ST³ST³ST³ST³ST, det ≠ 1 matrices report "No word", ±I report I / −I.
- [x] Status Im(γτ) = Im τ/|cτ + d|² (code) : Computed at runtime from the entries.

### Figure 2 (word builder)

- [x] Product written right to left; pressing S then T builds TS (`181`) : Computed. Code multiplies each new generator on the left; label reverses the list.
- [ ] "the status line reduces the product back to Euclidean normal form, which collapses to I whenever the word is a consequence of S² = (ST)³ = −I" (`181`) : WRONG. For those words the status shows "−I" (e.g. SS and (TS)³), not I.
- [x] Shaded region is F (`181`) : Computed. drawFundDomain uses the identity copy of F.

### Figure 3 (elliptic stabilisers)

- [x] Images of the probe stay on one hyperbolic circle; geodesics meet at 180° at i and 120° at ρ (`196`, `205`) : Computed. 20,000 random probes: max angle deviation 2e-6° at i, 5e-13° at ρ; spread of the three distances 3e-15 (t02.mjs, with the page's tangent/angleDeg). Chromium readouts "120.0°, 120.0°, 120.0°" and "180.0°".
- [x] Button labels "order 2", "order 3" (`201`, `202`) : Sourced. As above, in PSL₂(ℤ).
- [ ] Background "neighbouring tiles γ(F)" (code comment and figure) : WRONG as drawn. Tiles were lib fundDomainPath(4.2) mapped point by point, 2 points per vertical edge, so each mapped vertical edge (a circular arc) was drawn as a straight chord and the tile stopped short of its cusp.

verified 25, wrong 2, unverifiable 0. Note: word algorithm exact on 121k matrices; tile edges drawn as chords.

## 03 The Fundamental Domain and Its Boundaries

File: docs/modular-forms/03-fundamental-domain.html. Checked 2026-09-25. Scripts (in g1/): t03.mjs (area, angles, reduction, j evaluation, lightness map), t03b.mjs (reduction round counts on a 6M-point grid), t03c.mjs (winding of j about ρ, darkness radius), pw.mjs, figs.mjs. Sources read this session: K. Conrad, "SL(2,Z)" (Thm 1.1 proof and discussion of F, Thm A.3); OEIS A000521 b-file (j coefficients). render-check: PASS.

### Prose and equations

- [x] F = {|Re τ| ≤ 1/2, |τ| ≥ 1} (`93`, `math-F-def`) : Sourced. Conrad's F (proof of Thm 1.1).
- [x] Left/right edges identified by T, arc halves by S (`93`, `116`, `math-identifications`) : Computed. S sends e^{iθ} on the arc to angle 180° − θ (100° → 80°, 119° → 61°; t03.mjs).
- [x] Translates tile ℍ; quotient has genus 0 (`93`, `128`, `136`) : Sourced/Derived. Conrad: each orbit meets F, interior points inequivalent; genus 0 via j (Part 11).
- [x] Fundamental domain: one representative per orbit up to boundary identifications (`96`) : Sourced. Conrad, remark after proof of Thm 1.1.
- [x] Boundary pieces: verticals Re = ±1/2 above √3/2; arc from ρ to −ρ̄ = 1/2 + (√3/2)i with apex i (`116`) : Derived.
- [x] Every τ is equivalent to a point of F; distinct interior points inequivalent (`120`) : Sourced. Conrad Thm 1.1 proof.
- [x] Area π/3 (`122`, `140`) : Computed. Midpoint rule on ∫ dx/√(1 − x²) over [−1/2, 1/2]: 1.04719755119 vs π/3 = 1.04719755120.
- [x] Finite area / compactification with the cusp gives finite dimensions; a form is determined by its values on F (`124`) : Derived as a heuristic; the page presents it as motivation, not a proof.
- [x] Tiles overlap only along boundaries; all congruent hyperbolically, shrinking Euclidean size near the axis (`128`) : Derived. Isometries.
- [x] Gluing gives a cylinder closed at the bottom: sphere with one puncture; ℍ/SL₂(ℤ) ≅ ℙ¹ \ {∞} ≅ ℂ; j realises it (`132`, `134`, `136`) : Derived. j: ℍ/SL₂(ℤ) → ℂ bijective (standard; covered by Part 11).
- [x] i and ρ have stabilisers of orders 2 and 3 in PSL₂(ℤ) (`138`) : Sourced. Conrad Thm A.3 (orders 4 and 6 in SL₂(ℤ)).
- [x] F is a triangle with angles π/3, π/3, 0; Gauss-Bonnet area π − 2π/3 = π/3; ρ and −ρ̄ merge into one cone point of angle 2π/3 (`140`) : Computed/Derived. Angle between the vertical and the unit circle at ρ = 60.000° (t03.mjs); matches the area integral.
- [x] Reduction alternates T-shifts into [−1/2, 1/2] with S (`144`) : Computed. Lib reduce on 200,000 random points: all end in F.
- [?] "On |τ| < 1, S increases Im τ, so the process terminates" (`144`) : Unverifiable as argued. True, but an increasing sequence need not stop; the missing step is that only finitely many (c, d) have |cτ + d| < 1.
- [x] Points high in ℍ need at most one T-shift (`152`) : Computed. 10,000 points with Im τ ≥ 1 need no S.
- [ ] "Points near the real axis can need many rounds, and the count grows as τ gets closer to the axis" (`152`) : WRONG for this figure. Over a 4001 x 1501 grid of Re ∈ [−1/2, 1/2], Im ∈ [0.05, 1] (the drag floor is 0.05) the S-count is 0, 1 or 2 (histogram 276,297 / 5,344,580 / 384,624); τ = 0.001i needs one. Growth is only logarithmic: max 3 at Im 0.01, 5 at Im 0.001 (t03b.mjs).
- [x] Hue = arg j, once round the wheel from 0 to 2π (`156`) : Computed. Code maps atan2 to hue.
- [ ] "Brightness gives log |j(τ)|, from black near the zero at ρ to white near the pole" (`156`) : WRONG. HSL lightness is 0.15 + 0.85(1 − 1/(1 + 0.3 log₁₀(|j| + 1))): 0.15 at j = 0 (not black), 0.75 at the top of the plot (|j(3i)| = 1.5 × 10⁸; pastel, not white).
- [ ] "sum the first ten terms of j(τ)" (`158`) : WRONG. The code sums 12 terms, q⁻¹ through q¹⁰ (Moon.j.coefficients). Those coefficients match OEIS A000521 exactly. The first omitted term is < 1.5 × 10⁻⁹ at |q| = e^{−π√3} = 0.00433 (t03.mjs); j(i) = 1728.000, j(ρ) = 1.4e-9.
- [x] After reduction Im τ ≥ √3/2 so |q| is small (`158`) : Computed. |q| ≤ 0.00433; Moon.modular.reduce reaches F on all 96,800 pixels of the High canvas.
- [x] j(γτ) = j(τ): each tile carries F's colouring; zeros cluster to every rational; a weight-k form picks up (cτ + d)^k (`173`) : Derived.
- [?] "every tile has its own white cusp" (`173`) : Unverifiable/misleading. Tiles meeting at the same rational share one cusp, and the pole region is light, not white.

### Figure 1 (tessellation)

- [x] Each region is γ·F, F in blue at the top, every tile area π/3 (`107`) : Derived.
- [ ] Tiles as drawn (code domainPathScreen) : WRONG geometry. Vertical edges were 2 points each, so their images (arcs) were drawn as chords; off-screen points were dropped and only the "longest contiguous segment" kept, distorting clipped tiles.
- [ ] Status "N tiles shown" (code) : WRONG. The "40" button gives 41 tiles (BFS overshoots), and tiles off the plot are not drawn but were still counted.

### Figure 2 (reduction)

- [x] Orange T-translations, purple S-inversions carry τ into F (`149`) : Computed. Readout ends with |τ_reduced| ≥ 1 in every Chromium config.

### Figure 3 (domain colouring)

- [ ] "the dark spots at tile corners are the zeros, at ρ and its images" (`170`) : WRONG as a description of what is visible. Lightness is below 0.3 only within ~0.03 of ρ (|j| = 3.3 there), about 1 to 2 pixels at Medium resolution, so there are no visible dark spots. What does mark the zeros: all hues meet there, winding 3 times (triple zero; computed winding number 3.000 about ρ, 0 about i).
- [x] The bright band at the top is the pole at the cusp (`170`) : Computed. Lightness rises to 0.75 toward Im 3.
- [?] "The grid toggle overlays the tessellation" (`170`) : Incomplete. The overlay drew only images of the bottom arc (44 matrices), not the images of the vertical edges.

verified 20, wrong 6, unverifiable 3. Note: figure captions and "many rounds" claim overstated; j head matches OEIS A000521.

## 04 Cusps and the Cusp-Form Condition

File: docs/modular-forms/04-cusps-and-cusp-forms.html. Checked 2026-09-25. Scripts (in g1/): t04.mjs (extracts the page's cusp utilities and its Figure 2 coefficient code; cusp matrices, Δ/E₄/E₆ values, modularity checks, truncation errors, Γ₀(N) cusp counts), t04b.mjs (determinant of matToInfty over all reduced p/q with |p| ≤ 30, q ≤ 30), pw.mjs, figs.mjs. Sources read this session: K. Conrad, "SL(2,Z)" (Thm 1.1; stabiliser discussion). render-check: PASS.

### Prose and equations

- [ ] Subtitle "Cusps are the rational points ℚ ∪ {i∞}" (`92`) : WRONG wording (i∞ is not a rational point). Otherwise correct: all equivalent, holomorphic at cusps, cusp forms vanish there.
- [x] F has a spike to i∞; not compact (`95`) : Derived.
- [ ] "Every other tile has a spike too, ending at a rational point of the real axis" (`95`) : WRONG. The translates TⁿF share the spike at i∞; only tiles γF with c ≠ 0 end at a rational γ·i∞ = a/c.
- [x] There is always a matrix in SL₂(ℤ) carrying one fraction to another (`97`, `121`) : Computed. t04.mjs, 20,015 pairs with the fixed code: every γ has det 1 and γ·r₂ = r₁.
- [x] Cusps are ℚ ∪ {i∞}, on the boundary (`115`) : Derived.
- [x] [[p, −y],[q, x]] with px + qy = 1 has det 1 and sends i∞ to p/q; all cusps equivalent, one orbit (`119`, `121`) : Derived. det = px + qy = 1; γ·i∞ = p/q. (The prose named the Bézout coefficients a, b while the display above uses b, d for other entries: confusing, reworded.)
- [ ] The figure's cusp matrix (code matToInfty/extGcd) : WRONG for negative numerators larger than the denominator. extGcd mixed truncating % with Math.floor, so px + qy ≠ 1: 510 of 1111 reduced fractions with |p| ≤ 30, q ≤ 30 gave det ≠ 1 (e.g. −30/7 det 27, −29/3 det 5; t04b.mjs). The presets happened to be fine. Also "1/0" parsed as 1 instead of i∞.
- [x] ℍ*/SL₂(ℤ) compact genus 0 with one cusp (`123`) : Derived. One cusp orbit (above); genus 0 from Part 3.
- [ ] "The congruence subgroups Γ₀(N) of Part 9 have more inequivalent cusps as N grows" (`123`) : WRONG as a monotone claim. Cusp count Σ_{d | N} φ(gcd(d, N/d)) is 2 for every prime (N = 11, 13) but 6 at N = 12 and 16 (lib Mod.gamma0.cusps, checked by hand for 12).
- [x] Stabiliser of i∞ is ±Tⁿ (`127`, `math-stab`) : Derived. c = 0 forces a = d = ±1.
- [x] Invariance under it is period-1 periodicity; Fourier expansion in q (`131`, `135`, `math-periodic`) : Derived.
- [x] τ ↦ q maps ℍ onto the punctured unit disk; |q| = e^{−2πy}; i∞ ↦ 0 (`139`, `math-qabs`) : Derived.
- [x] Holomorphic at the cusp iff a(n) = 0 for n < 0; cusp form iff also a(0) = 0 (`143`) : Derived (standard definition; matches 05).
- [x] Eisenstein series have constant term 1 after normalisation (`145`) : Computed. Page's E₄ = 1 + 240q + 2160q² ..., E₆ = 1 − 504q − 16632q² ...
- [x] Δ = q − 24q² + 252q³ − ⋯, a(0) = 0, first cusp form (weight 12) (`145`) : Computed. Page's BigInt product q∏(1 − qⁿ)²⁴ gives 0, 1, −24, 252, −1472, 4830, −6048, −16744; Δ(i/y) = y¹² Δ(iy) to 1e-15 at y = 0.5, 0.7, 1.
- [x] M_k/S_k is spanned by Eisenstein series (`145`) : Derived. For k ≥ 4 even, M_k = ℂE_k ⊕ S_k since E_k has constant term 1.
- [x] Expansion converges fast for large Im τ, slowly near the axis (`145`) : Computed. Terms for 1e-6 relative accuracy: E₄ 2 at y = 2, 12 at y = 0.3; Δ 3 at y = 2, 20 at y = 0.3.
- [x] Figure 2 uses 300 terms; E₄, E₆ level off at 1; Δ falls like |q| (`151`) : Computed. Tail beyond 250 terms is zero to double precision at y = 0.3; E₄(0.3i) = 123.456814 equals 0.3⁻⁴ E₄(i/0.3); Δ(iy)/e^{−2πy} = 0.956 at y = 1, 0.99992 at y = 2. (The code sums a(0) to a(300), 301 coefficients.)

### Figure 1 (cusp equivalence)

- [x] Two cusps, the geodesic semicircle between them, γ mapping one to the other, zoom to fit (`110`) : Computed for the presets (det 1, correct image). For other input see the matToInfty entry above.
- [ ] Tile shading (code): the tile M·F was lib fundDomainPath mapped point by point with 2 points per vertical edge, so its sides were chords, not arcs.
- [?] "Each shaded region is the tile ... whose spike ends at that cusp" (`110`) : Unverifiable as worded: infinitely many tiles end at each cusp; the figure shows one.
- [ ] SVG text size: tick labels and both axis tick groups at font-size 10 (below the 11 px house floor).

### Figure 2 (q-expansion)

- [x] Solid curve is |f(iy)| from 300 terms, dashed keeps first N (`163`) : Computed. evalAt(a, y, N) sums a[0..N−1].
- [x] "High up, one or two terms agree to many digits; toward the real axis the truncation fails" (`163`) : Computed. At y = 2 two terms: E₄ rel. err 2.6e-8, E₆ 2.0e-7, Δ 8.4e-5 (one nonzero term). At y = 0.3 with the maximum 8 terms: E₄ 4.0e-4, E₆ 4.8e-3, Δ 12.4 (sign wrong).
- [x] E₆ dips to zero at y = 1 because E₆(i) = 0 (`163`) : Computed/Derived. E₆(i) = −3.4e-16 from 301 terms; E₆(−1/τ) = τ⁶E₆(τ) at τ = i gives E₆(i) = −E₆(i).

verified 18, wrong 6, unverifiable 1. Note: cusp matrix wrong for most negative inputs; tiles chords; ticks 10px.

## 05 Modular Forms and Their Dimensions

File: docs/modular-forms/05-modular-forms-definition.html. Checked 2026-09-25. Scripts (in g2/): p05.mjs (extracts the page's helper block, BERN/eisConstExact/evalEk, and runs it in node with lib/modular-math.js), lib.mjs (BigInt q-series vs OEIS), pw.mjs 05 (Playwright, 1200/390 x light/dark x reduced on/off, all controls, Fig 3 slider stepped through every k), figshot.mjs. render-check: PASS.

### Prose and equations

- [x] Subtitle: weight-k law, bounded at the cusp, M_k finite-dimensional, every form a polynomial in E4 and E6 (`100`) : Sourced. Stein, Modular Forms: A Computational Approach, level_one chapter, Thm 2.17 (basis E4^a E6^b, 4a+6b=k) read this session (wstein.org/books/modform/modform/level_one.html).
- [x] "only about k/12 independent forms, all built from two generators" (`103`) : Computed. Mod.dim.M(k) = floor(k/12) or floor(k/12)+1 for k <= 200, equal to the number of monomials E4^aE6^b of weight k at every even k <= 200 (lib.mjs).
- [x] Every E_k tends to 1 at the top of the domain (`124`) : Derived. Constant term 1, higher terms carry |q|^n = e^{-2 pi n Im tau}.
- [x] E4 vanishes at rho, E6 at i, E10 at both (`124`) : Computed. p05.mjs with the page's evalEk: |E4(rho)| = 5e-16, |E6(i)| = 3e-16, |E10(rho)| = 1.5e-15, |E10(i)| = 3e-16; |E4(i)| = 1.46, |E6(rho)| = 2.88.
- [x] "the zero of E12 sits on the arc |tau| = 1 between them" (`124`) : Computed. min |E12(e^{i theta})| = 6e-6 at theta = 75.44 deg (tau = 0.251 + 0.968i), strictly between i (90) and rho+1 (60); on F away from the arc (|tau|^2 >= 1.02) min |E12| = 0.14; |E12(i)| = 1.97, |E12(rho)| = 3.00.
- [x] Definition (a) transformation law, (b) holomorphic at i infinity (`128`, KaTeX `281`) : Derived. Standard (Stein Sec. 1, Serre VII.2).
- [x] Periodicity gives a q-expansion with no negative powers; cusp form iff a0 = 0; notation M_k, S_k (`132`-`136`) : Derived.
- [x] T has (c tau+d)^k = 1, S has tau^k; S and T generate so two equations suffice (`138`-`146`) : Derived. S = [[0,-1],[1,0]] gives c tau + d = tau.
- [x] Odd weights: -I gives f = (-1)^k f (`148`) : Derived.
- [x] Cocycle identities j(g2 g1, tau) = j(g2, g1 tau) j(g1, tau) and the (2,1),(2,2)-entry expansion (`152`-`164`, KaTeX `289`-`293`) : Derived by multiplying out.
- [x] Slash operator is a right action; modular forms are its bounded fixed points (`166`) : Derived. (f|g1)|g2 = f|(g1 g2) from the cocycle.
- [ ] "The q-series is summed until the tail is below double precision, so the relative difference left over is rounding error" (`170`) : WRONG in two ways. (1) The loop stops when the next term is below 1e-17 of the sum, not the tail (harmless). (2) The readout divides by |(c tau+d)^k f(tau)|, which is 0 at every zero of E_k, so the "relative difference" is not rounding error there: at tau = i, reachable from the default by 6 ArrowLeft and 4 ArrowDown presses, k = 6, gamma = S the page printed "relative difference = 2.00e+0" (p05.mjs and Playwright). Over x in [-4,4], y in [0.15,4] the worst printed values were 5.9e1 (k=6), 2.9e5 (k=10), all at images of i or rho. Measured against the size of the terms the worst residual is 1.4e-10 (k=10, ST, tau near 3.8+0.55i where gamma tau has Im 0.04).
- [x] Product law: fg has weight j+k, M_* graded ring (`191`-`195`, KaTeX `295`) : Derived.
- [x] Structure theorem M_* = C[E4, E6] (`195`-`197`) : Sourced. Stein Thm 2.17.
- [x] Algebraic independence argument via E4^3/E6^2 (0 at rho, 1 at i infinity) (`199`) : Derived. A relation can be taken weight-homogeneous; dividing by a power of E6 gives a polynomial in E4^3/E6^2; E4(rho) = 0, E6(rho) = 2.88 != 0 (p05.mjs).
- [x] Delta = q - 24q^2 + 252q^3 - ... has integer coefficients; no integer combination a E4^3 + b E6^2 equals it (`201`) : Derived and Computed. Constant term forces b = -a, giving 1728 a Delta; tau(n) match OEIS A000594 for n <= 30 (lib.mjs).
- [x] Forms with integer q-expansions = Z[E4, E6, Delta]/(E4^3 - E6^2 - 1728 Delta), Delta a third generator (`201`-`205`, KaTeX `299`) : Sourced/Derived. Stein Lemma 2.20 (the Victor Miller basis of S_k lies in Z[[q]]) read this session; a search summary attributes the Z-presentation to Deligne (Formulaire). Derived: for each c the monomial E4^a E6^b Delta^c with a <= 2, b <= 1 starts at q^c with coefficient 1, so these span the same Z-lattice as the Miller basis. SPECIALIST: the full ring presentation (one relation generates all relations over Z) was not read in a primary source (Deligne, "Courbes elliptiques: formulaire", LNM 476, 1975).
- [x] Valence formula (`209`-`211`, KaTeX `301`) : Sourced. Stein Thm 2.11.
- [x] Elliptic points count 1/2, 1/3 because stabilisers in PSL2(Z) have order 2 and 3 (`213`) : Derived.
- [x] k = 2: 1/6 has no representation n + a/2 + b/3, so M_2 = 0; E2 = 1 - 24 sum sigma_1(n) q^n fails the S-law by a term proportional to tau (`216`) : Derived and Computed. Node at tau = 0.3 + 1.2i: E2(-1/tau) - tau^2 E2(tau) = 2.29183 - 0.57296i = 6 tau/(pi i) exactly.
- [x] k = 4 forces a simple zero at rho only, k = 6 a zero at i only (`217`) : Derived from the valence formula; Computed above.
- [x] Delta has a simple zero at the cusp, so no zeros in H (`218`) : Derived.
- [x] S_k = Delta M_{k-12}, dim S_k = dim M_{k-12} (`221`-`223`, KaTeX `303`) : Derived.
- [x] For even k >= 4 a monomial with constant term 1 exists, so dim M_k = dim M_{k-12} + 1; valence gives dim 1 at k = 0,4,6,8,10 and 0 at k = 2 (`225`) : Derived.
- [x] Dimension formula (`227`, KaTeX `305`) and "k = 2 mod 12 one short" (`229`) : Sourced (Stein Cor 2.16) and Computed (lib dimM and the page's local dimM agree for k <= 200).
- [x] A form in M_k is determined by its first dim M_k coefficients (`233`) : Derived. ord_inf >= d forces k/12 - d in {n + a/2 + b/3}; for k = 2 mod 12, k/12 - d = 1/6, impossible; otherwise d > k/12.
- [x] Reduced basis f_i = q^i + O(q^d), f_1.. span S_k; E_k from its first d coefficients predicts the rest (`233`) : Computed. Playwright stepped the slider through every even k from 4 to 48: "matches exactly" was N of N every time (15 of 15 at d=1 ... 11 of 11 at k=48).
- [x] E12 = f0 + (65520/691) f1 (`245`) : Computed. Browser table at k=12: f0 = 1 + 0q + 196560q^2 + 16773120q^3, f1 = q - 24q^2 + 252q^3; E12 = f0 + (65520/691)f1, 14 of 14 predicted coefficients match.
- [x] E12 = (441 E4^3 + 250 E6^2)/691 (KaTeX `307`) : Sourced and Computed. Ramanujan 1916, "On certain arithmetical functions", Table I row 6: "691 + 65520 Phi_{0,11}(x) = 441 Q^3 + 250 R^2" (ramanujan.sirinudi.org/Volumes/published/ram18.html, read this session). Node: (441*720 - 250*1008)/691 = 65520/691; all coefficients to q^40 match 65520 sigma_11(n)/691 (A029828 / 691).
- [x] 691 is the numerator of B12 (`249`) : Computed. Page's exact Bernoulli recursion: B12 = -691/2730; B2..B14 = 1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6.
- [x] E8 = E4^2, E10 = E4 E6 (`255`, KaTeX `309`) : Computed to q^40 in BigInt (lib.mjs); also E14 = E4^2 E6.
- [x] sigma_7(n) = sigma_3(n) + 120 sum sigma_3(m) sigma_3(n-m) (`259`, KaTeX `311`) : Computed for n <= 200 (p05.mjs); Derived from E8 = E4^2 (480 = 2*240, 240^2/480 = 120).
- [x] "an identity about integers whose standard proof is the finite-dimensionality of M_8" (`261`) : Derived. Hedged enough ("standard"); elementary proofs are not claimed absent.
- [x] E4^3 - E6^2 = 1728 Delta (`261`-`263`, KaTeX `313`) : Computed to q^40 in BigInt against the product q prod (1-q^n)^24 and A000594.
- [x] At k = 12, f1 = Delta with 1, -24, 252, -1472 (`265`) : Computed (browser table).
- [x] First weight with dim S_k > 1 is 24, S24 = Delta M12 spanned by Delta E4^3 and Delta^2 (`265`) : Derived. dim M_{k-12} >= 2 first at k - 12 = 12.
- [x] Part 8 uses Hecke operators to choose a basis there (`265`) : Checked 08-hecke-operators.html line 166 says the same.

### Figure 1 (heatmap of log|E_k|)

- [x] log|E_k| on the fundamental domain, dark spots are zeros; buttons k = 4..12 (`105`, `121`, aria `393`) : Computed. Canvas evaluates evalEk per pixel; zeros confirmed above. Colour domain is d3.extent per weight (rescaled when k changes, static otherwise); caption now says so.
- [x] Side panel checks f(-1/tau) = tau^k f(tau) at the marked point 0.2 + 1.0i (`121`) : Computed. Residual 6e-16, 1.2e-15, 9e-16, 6e-16, 2.8e-15 for k = 4..12 (far from any zero, so the relative measure was fine here).

### Figure 2 (transformation-law checker)

- [x] Drag, click, or arrow keys move tau; gamma in {S, T, ST}; k in {4,6,8,10}; tau blue, gamma tau red (`186`) : Computed (Playwright: drag, keyboard, all 12 button combinations).
- [ ] Readout "relative difference" (`603`, and "relative diff" in Fig 1 panel `489`) : WRONG near zeros of E_k, see the `170` entry: 2.00e+0 at tau = i, k = 6.

### Figure 3 (dimensions and computed basis)

- [x] Bars: dim M_k blue, dim S_k red, k to 48; click a bar or drag the slider (`242`) : Computed. Bars match dimM/dimS; clicking a bar selects it.
- [x] "exact determinant of the monomial block" (`242`) : Computed. Bareiss in BigInt; nonzero at every k: 1 (k <= 10, 14), -1728 (k = 12, 16-22, 26), -5159780352 (24, 28-34, 38), 2.662e19 (36, 40-46), 2.373e32 (48).
- [x] "check E_k against sigma_{k-1} up to q^15" (`242`) : Computed. NQ = 16; all predictions match (see above).
- [x] "Coefficients over 10 digits are rounded" (`242`) : Computed. fmtBig switches to d.ddd x 10^n above 10 digits.
- [x] c_k = -2k/B_k line (`821`) : Computed. c4..c16 = 240, -504, 480, -264, 65520/691, -24, 16320/3617.

Other defects (not claims): axis tick labels in Fig 3 were 10px (< 11px).

verified 44, wrong 2, unverifiable 0. Note: checker's "relative difference" blew up at zeros of E_k; all math verified.

## 06 Eisenstein Series and q-Expansions

File: docs/modular-forms/06-eisenstein-series.html. Checked 2026-09-25. Scripts (in g2/): p06.mjs (runs the page's lattice-sum, zeta and eisQ code with lib/modular-math.js in node), lib.mjs (BigInt E_k vs OEIS), pw.mjs 06 (Playwright, 8 configs, all controls), figshot.mjs. render-check: PASS.

### Prose and equations

- [x] Subtitle: E_k = (1/2 zeta(k)) sum 1/(m tau+n)^k, converges for k >= 4, divisor-sum q-expansion, integer coefficients for k = 4..10, 691 in the denominator at k = 12 (`98`) : Derived and Computed. Normalisation G_k = 2 zeta(k) E_k: the page's box lattice sum / 2 zeta(k) converges to the q-series (p06.mjs: at tau = 0.15 + i, k = 10, |lattice - q| = 4e-11 at range 8; k = 4: 2.1e-3, falling like 1/R^2).
- [x] "the modular group only reshuffles the lattice, the sum comes out modular" (`101`) : Derived.
- [x] tau = i gives a square lattice, tau = e^{2 pi i/3} a hexagonal one (`103`) : Derived.
- [x] Near the real axis the sum grows; as Im tau grows it tends to 1 (`121`) : Computed. E4(0.15 + 0.15i) = -493.8, E10 = -5.4e6 i; at Im tau = 3.5 all equal 1.0000.
- [x] The factor 1/(2 zeta(k)) fixes the constant term at 1; as tau -> i infinity only m = 0 survives and sum_{n != 0} n^{-k} = 2 zeta(k) (`129`) : Derived.
- [x] Absolute convergence for k >= 4, not k = 2; annulus count R^{1-k} (`133`, KaTeX `convergence`) : Derived. About 2 pi R / area points per unit annulus, each of size R^{-k}.
- [?] "At k = 2 the sum converges only conditionally and gives a quasi-modular form" (`133`) : Imprecise. The double sum is not absolutely convergent and its value depends on the order of summation; summed in the standard order (over n inside, then m) it gives G2, which is quasi-modular. Reword.
- [x] The row m = 0 alone converges for k >= 2; the 2D count pushes the bound to 4 (`137`) : Derived.
- [x] E_k is holomorphic on H and bounded at the cusp (`137`) : Derived (standard; Serre VII.2.3).
- [x] Odd k vanishes by pairing (m,n) with (-m,-n) (`139`) : Derived.
- [x] q-expansion E_k = 1 + c_k sum sigma_{k-1}(n) q^n via Lipschitz summation, c_k = -2k/B_k (`143`-`147`, KaTeX `qexpansion`) : Derived and Computed. Lipschitz: sum_n (tau+n)^{-k} = (-2 pi i)^k/(k-1)! sum d^{k-1} q^d; with 2 zeta(k) = -(2 pi i)^k B_k/k! this gives c_k = -2k/B_k. Lattice sum and q-series agree numerically (above).
- [x] c4 = 240, c6 = -504, c8 = 480, c10 = -264 (KaTeX `ck-values`) : Computed. Exact Bernoulli (page 05's routine): B4 = -1/30, B6 = 1/42, B8 = -1/30, B10 = 5/66.
- [x] E4 is the nonconstant form of lowest weight; M2 = 0 and dim M4 = 1 (`153`) : Derived (Part 5 dimension formula).
- [x] E4 = 1 + 240 sum sigma_3(n) q^n, sigma_3(1..4) = 1, 9, 28, 73; E4 = 1 + 240q + 2160q^2 + 6720q^3 + 17520q^4 + 30240q^5 (`157`, KaTeX) : Computed. Matches OEIS A004009 (29 terms, fetched this session).
- [x] M6 one-dimensional spanned by E6 (`163`) : Derived.
- [x] E6 = 1 - 504 sum sigma_5(n) q^n; sigma_5(2) = 33, -504*33 = -16632; E6 = 1 - 504q - 16632q^2 - 122976q^3 - 532728q^4 (`167`, KaTeX) : Computed. Matches OEIS A013973 (25 terms).
- [x] E4 coefficients all positive, E6 after the constant all negative; both integral; E8 = E4^2, E10 = E4 E6 (`171`) : Derived / Computed to q^40.
- [x] sigma_k definition; sigma_3(12) = 1 + 8 + 27 + 64 + 216 + 1728 = 2044; sigma_0 counts, sigma_1 sums (`175`-`179`) : Computed.
- [x] sigma_k multiplicative, geometric sum at prime powers (`181`, KaTeX `sigma-prime`) : Derived.
- [x] sigma_k(p) = 1 + p^k, coefficient c_k(1 + p^{k-1}); sigma_3(6) = 9 * 28 = 252 (`185`) : Computed.
- [x] c_k integer for k = 4, 6, 8, 10 and 14 (`200`) : Computed. c14 = -24 (B14 = 7/6); c12 = 65520/691, c16 = 16320/3617 are not.
- [x] B12 = -691/2730 gives c12 = 65520/691 (`200`) : Computed. 24 * 2730 = 65520; 691 prime, 65520 mod 691 = 566 != 0. E12 * 691 matches OEIS A029828 (17 terms).
- [ ] "E12 = 1 + (65520/691) sum sigma_11(n) q^n has 691 in every denominator" (`200`) : WRONG. 691 | sigma_11(n) whenever n has a prime factor p = -1 mod 691 to an odd power, since then 1 + p^11 = 0 mod 691 (x -> x^11 is a bijection mod 691 because gcd(11, 690) = 1). For n <= 3000 this happens at n = 1381 = 2*691 - 1 (prime) and 2762 (p06.mjs), where the coefficient is an integer.
- [x] Over Z the ring needs Delta as a third generator, single relation E4^3 - E6^2 = 1728 Delta (`200`) : See ledger-05 `201`-`205` (Sourced/Derived, SPECIALIST note there).
- [x] Lattice sum shows modularity, q-expansion shows arithmetic; Lipschitz summation connects them (`204`) : Derived (framing).

### Figure 1 (lattice)

- [x] Lattice Z + tau Z, each point coloured by 1/|m tau + n|^k, origin marked excluded (`118`) : Computed. Mod.lattice.points gives m + n tau for |m|,|n| <= range; contribution normalised to the max for colour and radius (relative, recomputed on each change; static figure).
- [x] "Raising the range shows the partial sum converging" and status compares lattice sum with q-expansion (`118`, `121`) : Computed. At tau = 0.15 + i, |lattice - q| for range 2, 3, 5, 8: k=4 2.5e-2, 1.3e-2, 5.1e-3, 2.1e-3; k=10 4.4e-6 ... 4.0e-11. Status at the lowest handle position (Im 0.15, k=4): lattice -493.7848, q-series -493.8271.
- [x] q-series in the status uses 400 terms, enough at Im tau >= 0.15 (`eisQ`) : Computed. 400 vs 3000 terms differ by 0 at tau = 0.15 + 0.15i for k = 4, 10.

### Figure 2 (coefficient table)

- [x] "The first 12 coefficients c_k sigma_{k-1}(n) of E_k, with the divisors behind each sum" (`197`) : Computed. n = 1..12 for k = 4, 6, 8, 10; every entry equals the BigInt value (10^12 scale at k = 10 is below 2^53).

Other defects: none visible (one U+2014 in a code comment only).

verified 27, wrong 1, unverifiable 1. Note: "691 in every denominator" false (n = 1381); rest verified.

## 07 The Discriminant, Ramanujan's tau, and Cusp Forms

File: docs/modular-forms/07-discriminant-and-ramanujan-tau.html. Checked 2026-09-25. Scripts (in g2/): p07.mjs (the page's heatmap grid through Mod.delta.eval(tau, 20) vs log|Delta| from the product formula; table congruences; bounds), lib.mjs (BigInt tau vs OEIS A000594), pw.mjs 07 (Playwright, 8 configs), figshot.mjs; sources fetched: ram18.html + ram18_tab1.png (Ramanujan 1916), arXiv 1312.6819 PDF (Derickx-van Hoeij-Zeng), OEIS A000594. render-check: PASS.

### Prose and equations

- [?] Subtitle "Delta ... the unique weight-12 cusp form" (`107`) : Imprecise. Unique up to scalar (dim S12 = 1); Delta is the unique normalised one. The body (`124`) says "up to scalar". Add "normalised".
- [x] Subtitle Delta = eta^24 = q prod (1-q^n)^24 = sum tau(n) q^n; multiplicative; tau = sigma_11 mod 691 (`107`) : Computed. Product and (E4^3 - E6^2)/1728 agree to q^40 in BigInt and match A000594 (30 terms); congruence holds for n <= 40.
- [x] Eisenstein series tend to 1 at the cusp; Delta vanishes there (`110`) : Derived.
- [x] "In the heatmap, |Delta| is largest near the bottom arc of the fundamental domain and falls to zero toward the cusp" (`110`) : Computed, with a caveat. On F the maximum is at the corners rho, rho+1: log10|Delta| = -2.32 there vs -2.75 at i. But the heatmap also shows the neighbours below F, where |Delta| is far larger (log10 up to 1.98 at y = 0.16), so the brightest part of the figure is not near the arc. Clarified in the fix.
- [x] E4^3 - E6^2 has constant term 0; 1/1728 normalises; Delta = q - 24q^2 + 252q^3 - 1472q^4 (`120`-`124`) : Computed. q-coefficient 720 + 1008 = 1728.
- [x] dim S12 = 1 (`124`) : Derived (Part 5).
- [x] eta definition; eta almost weight 1/2, 24th roots of unity; eta^24 modular of weight 12 (`126`-`132`) : Derived. Standard (eta(-1/tau) = sqrt(tau/i) eta(tau), eta(tau+1) = e^{pi i/12} eta(tau)).
- [x] Product formula shows a simple zero at the cusp (`134`) : Derived.
- [x] "the cubic's discriminant g2^3 - 27 g3^2 equals (2 pi)^12 Delta(tau)" (`136`) : Sourced for the identity (Serre, Course, VII.4.4 defines Delta = g2^3 - 27 g3^2 and shows its q-expansion is (2 pi)^12 (q - 24 q^2 ...); consistent with the page's normalisation) but loosely worded: the discriminant of 4x^3 - g2 x - g3 is 16(g2^3 - 27 g3^2). Counted as verified; wording tightened. SPECIALIST: Serre was recalled, not read this session.
- [x] Delta != 0 iff distinct roots; Delta vanishes only at the cusp, so every lattice gives a non-singular curve (`136`) : Derived.
- [x] tau(1..5) = 1, -24, 252, -1472, 4830; signs irregular (`144`, KaTeX `tau-def`) : Computed (A000594).
- [?] "magnitudes grow as n^{11/2}" (`144`) : Imprecise. |tau(n)|/n^{11/2} for n <= 30 ranges from 0.20 (n=14) to 1.18 (n=17); the sizes are on that scale, they do not grow like it. Reword.
- [x] "In 1916 Ramanujan computed the first 30 values" (`146`) : Sourced. Ramanujan, Trans. Camb. Phil. Soc. 22 (1916), sec. 17, Table: n = 1..30 (image ram18_tab1.png read this session); all 30 values agree with our BigInt tau.
- [x] Conjectured multiplicativity and the prime-power recursion (`149`-`150`) : Sourced. Same paper, sec. 18, eq. (101) Euler product sum tau(n) n^{-t} = prod (1 - tau(p) p^{-t} + p^{11-2t})^{-1}, "equivalent to" (102), and "tau(nn') = tau(n) tau(n')" for coprime n, n'.
- [x] Conjectured |tau(p)| <= 2 p^{11/2} (`151`) : Sourced. Sec. 18 eq. (103), the condition that theta_p with cos theta_p = (1/2) p^{-11/2} tau(p) be real (the transcription reads "{2 tau(p)}^2 <= p^11", a transcription slip for tau(p)^2 <= 4p^11 given cos theta_p as printed), and (104) |tau(n)| <= n^{11/2} d(n).
- [x] Mordell proved the first two in 1917 (`154`) : Sourced. Mordell, "On Mr. Ramanujan's empirical expansions of modular functions", Proc. Camb. Phil. Soc. 19 (1917) 117-124 (citation via search); LMFDB knowl lfunction.history.ramanujan_tau (read): "The first two of these ... were verified by Mordell in 1917 ... and the last by Deligne in 1974".
- [x] Mordell's operators generalised by Hecke in 1937 (`154`) : Sourced. Hecke, "Uber Modulfunktionen und die Dirichletschen Reihen mit Eulerscher Produktentwicklung I, II", Math. Ann. 114 (1937) 1-28, 316-351 (Springer/EuDML records via search).
- [x] Delta a Hecke eigenform, eigenforms have multiplicative coefficients (`154`) : Derived (dim S12 = 1).
- [x] Third property proved by Deligne's 1974 proof of the Weil conjectures (`154`) : Sourced. Deligne, "La conjecture de Weil. I", Publ. Math. IHES 43 (1974) 273-307 (numdam record read); LMFDB knowl above. (Deligne 1969/71 had reduced Ramanujan to Weil; not claimed otherwise.)
- [x] Congruence tau(n) = sigma_11(n) mod 691 for all n (KaTeX `cong`) and "Ramanujan also found" (`183`) : Computed for n <= 40 (BigInt). Sourced (attribution): Berndt and Ono, "Ramanujan's unpublished manuscript on the partition and tau functions with proofs and commentary", Sem. Lothar. Combin. 42 (1999), per search summary; Calegari's notes cite it as Ramanujan's. It does not appear in the 1916 paper (grep of ram18.html for "691", "mod", "equiv"); the page gives no date, so fine.
- [x] 691 is the numerator of B12/12, B12 = -691/2730 (`187`) : Computed. B12/12 = -691/32760.
- [x] E12 = 1 + (65520/691) sum sigma_11(n) q^n; dim M12 = 2; E12 = E4^3 - (432000/691) Delta; q-coefficient of E4^3 is 720 (`187`, KaTeX `e12-relation`) : Computed. 691 E4^3 - 691 E12 = 432000 Delta to q^40 in BigInt; 65520/691 - 720 = -432000/691.
- [x] Both 65520 and -432000 are 566 mod 691; 566 invertible (`191`) : Computed. 65520 mod 691 = 566; -432000 mod 691 = 566; 566^{-1} = 199 mod 691.
- [x] "first case of a general pattern: primes dividing Bernoulli numerators control congruences between modular forms" (`191`) : Derived (Eisenstein congruences, standard; Calegari AWS notes sec. 1.1 read this session call it "the first incarnation of the main conjecture of Iwasawa theory").
- [ ] "691 is an irregular prime: it divides the numerator of B12/12, equivalently the class group of Q(zeta_p) has p-torsion" (`193`) : WRONG as worded. Irregularity is p dividing the numerator of some B_k with 2 <= k <= p - 3 (here k = 12 <= 688), and Kummer's criterion makes that equivalent to p dividing the class number of Q(zeta_p). "Divides B12/12, equivalently ..." states a false equivalence for a single k.
- [?] "Congruences like Ramanujan's are the mechanism behind the Herbrand-Ribet theorem" (`193`) : Vague. Ribet, "A modular construction of unramified p-extensions of Q(mu_p)", Invent. Math. 34 (1976) 151-162 (citation via search) proved the converse of Herbrand's theorem via a congruence between an Eisenstein series and a cusp form; Herbrand's direction (1932) does not use modular forms. Reword and attribute.
- [x] Lehmer (1947) asked whether tau(n) = 0 for some n (`197`) : Sourced. D. H. Lehmer, "The vanishing of Ramanujan's function tau(n)", Duke Math. J. 14 (1947) 429-433 (Project Euclid record read).
- [x] "tau(n) != 0 verified for all n below 8 x 10^23 (Derickx, van Hoeij and Zeng, 2013)" (`197`) : Sourced. arXiv 1312.6819 (v1 24 Dec 2013), Corollary 1.2: "non-vanishing ... holds for all n with n < 816212624008487344127999 = 8 * 10^23", via tau(p) mod l for l in {11,13,17,19,29,31,41} plus known congruences mod powers of 2, 3, 5, 7, 23, 691; Remark 1.3 cites the previous bound 9.8e20. OEIS A000594 still cites this bound (read this session); searches found no larger published bound (Bosman 2007: 2.28e19). An unrefereed 2025 arXiv claim of a proof (2503.23498) exists; "still open" stands. The page's "below 8 x 10^23" is true but rounds down; now "about 8.16 x 10^23".
- [x] Deligne's bound implies |tau(n)| <= d(n) n^{11/2} (`199`) : Derived; also Ramanujan's own (104). Computed tau(p)/(2 p^{11/2}) for p <= 29 all in [-0.59, 0.58].
- [x] Sato-Tate for Delta, BLGHT 2011, measure (2/pi) sqrt(1-t^2) dt, half the trace of a random SU(2) matrix (`201`) : Sourced/Derived. Barnet-Lamb, Geraghty, Harris, Taylor, "A family of Calabi-Yau varieties and potential automorphy II", Publ. RIMS 47 (2011) 29-98 (citation via search; covers non-CM holomorphic newforms of weight >= 2). Half-trace of Haar SU(2) is cos theta with density (2/pi) sin^2 theta, i.e. (2/pi) sqrt(1-t^2) dt. SPECIALIST: theorem statement recalled, not read this session.

### Figure 1 (heatmap of log|Delta|)

- [ ] Values at the bottom of the map (`115`, code `Mod.delta.eval(tau, 20)`) : WRONG near the real axis. 20 terms of the q-series cancel badly at Im tau < 0.2: 64 of 14000 pixels off by more than 0.05 in log10, worst at tau = -1.0 + 0.16i (page -2.64, true -7.19 from the product). The same routine drove the probe readout. The rest of the map is right (probe at i: -2.7483 both).
- [x] Outline of F in white, pointer/tap/arrow-key probe starting at tau = i (`115`) : Computed (Playwright).
- [x] Colour scale fixed (computed once over the grid; static figure) : Computed.

### Figure 2 (tau bar chart and table)

- [x] "The first 20 values of tau(n), blue positive and red negative" (`164`) : Computed. 20 bars; fill var(--c-pos)/var(--c-neg) = #2563eb/#dc2626 (light), #60a5fa/#f87171 (dark).
- [x] "every row matches" sigma_11(n) mod 691 = tau(n) mod 691 (`164`) : Computed. Rows read in the browser; Mod.eisenstein.sigma(n, 11) is exact for n <= 20 (float sigma_11 first goes wrong at n = 29).

### Figure 3 (multiplicativity checker)

- [ ] "The sliders test Ramanujan's first conjecture for m, n up to 15" (`169`) : WRONG. Only m n <= 30 worked (lib Delta has 30 coefficients); 15 x 15, 7 x 13, 11 x 14 printed "exceeds our precomputed coefficients (30 terms)".
- [?] "When gcd(m, n) > 1 the prime-power recursion governs instead" (`178`) : Vague, and the figure checked nothing in that case (it only printed "!="). The relation that holds is tau(m) tau(n) = sum_{d | gcd(m,n)} d^11 tau(mn/d^2), which the recursion is the prime-power case of.

verified 30, wrong 3, unverifiable 4. Note: heatmap wrong near real axis; checker capped at mn <= 30; irregular-prime wording.

## 08 Hecke Operators and the Hecke Algebra

File: docs/modular-forms/08-hecke-operators.html. Checked 2026-09-25. Scripts: g3/c08.mjs (extracts the page's BigInt q-series and heckeBig code and runs it in node), g3/pw.mjs (Playwright sweep, all 3 pages). render-check: PASS. Line numbers are the page as audited (prose lines are unchanged by the fix pass; script lines are approximate).

### Prose and equations

- [x] Subtitle: T_p acts by a_m -> a_pm + p^(k-1) a_(m/p) (`107`) : Derived. Standard level-1 formula (Serre, Course in Arithmetic VII.5.3); matches heckeBig.
- [?] "A form that every T_n merely rescales is a Hecke eigenform. Its coefficients are then multiplicative ... a(p) is the eigenvalue" (`110`) : Needs the normalisation a(1) = 1 (an eigenform c·Δ has coefficients c·τ(n), not multiplicative, and eigenvalue τ(p), not c·τ(p)). Reword.
- [x] T_p sends Δ, E4, E6 to scalar multiples; E4^3 is not an eigenform (`112`) : Computed. c08.mjs, all computed coefficients, p = 2,3,5,7: Δ eigenvalues -24, 252, 4830, -16744; E4 9, 28, 126, 344 (= 1+p^3); E6 33, 244, 3126, 16808 (= 1+p^5); E4^3 fails for every p (T2(E4^3) starts 2049 + 179280q, E4^3 starts 1 + 720q).
- [x] E4^3 lies in M12 = span(Δ, E12) whose eigenvalues differ (`112`) : Computed/Derived. T2 eigenvalues τ(2) = -24 vs σ11(2) = 2049; the q^0 ratio 2049 and q^1 ratio 179280/720 = 249 differ.
- [x] Hecke formula b(m) = a(pm) + p^(k-1) a(m/p) (`148`, `246`) : Computed. Agrees with the general T_n formula b(m) = Σ_{d|(m,n)} d^(k-1) a(mn/d^2) on E4^3.
- [x] T_p linear, preserves M_k and S_k (`152`) : Derived. b(0) = (1+p^(k-1)) a(0), so a(0) = 0 gives b(0) = 0.
- [x] T_mn = T_m T_n for coprime m, n; T_(p^r) = T_p T_(p^(r-1)) - p^(k-1) T_(p^(r-2)) (`154`) : Computed. On E4^3: T2T3 = T3T2 = T6 on 14 coefficients; T4 = T2^2 - 2^11 on 21 coefficients.
- [x] The T_n commute (`160`, `248`) : Computed (same run) and standard.
- [x] Simultaneously diagonalisable commutative algebra (`162`) : Derived. T_n self-adjoint for the Petersson product on S_k, Eisenstein series are eigenforms.
- [ ] "When dim S_k = 1 ... This applies to S12, S16, S18, S20, S22" (`164`) : WRONG (incomplete). Computed dim S_k for k = 12..40: dim 1 exactly at 12, 16, 18, 20, 22 and 26. S26 is missing.
- [x] First weight with dim S_k > 1 is k = 24, dim 2 (`166`) : Computed.
- [x] λ_p = a(p)/a(1) from the q^1 coefficient (`170`-`174`, `250`) : Derived. The q^1 coefficient of T_p f is a(p) since p does not divide 1.
- [x] Multiplicativity and prime-power recursion for eigenform coefficients (`180`, `252`) : Computed. τ(mn) = τ(m)τ(n) for all coprime mn <= 80; τ(p^(r+1)) = τ(p)τ(p^r) - p^11 τ(p^(r-1)) for p = 2,3,5,7 within q^80.
- [x] Δ is a normalised eigenform with eigenvalue τ(p) (`184`, `188`, `254`) : Computed. Every computed coefficient of T_p(Δ) equals τ(p)·τ(i) for p <= 23 (41 coefficients at p = 2, 4 at p = 23).
- [x] τ(6) = τ(2)τ(3) = -6048; τ(4) = 576 - 2048 = -1472 (`214`) : Computed and Sourced. OEIS A000594 first 12 terms 1, -24, 252, -1472, 4830, -6048, -16744, 84480, -113643, -115920, 534612, -370944 match the page's Δ.
- [ ] "This is Mordell's 1917 proof of Ramanujan's conjecture" (`214`) : WRONG as worded. Mordell (Proc. Cambridge Philos. Soc. 19 (1917) 117-124) proved Ramanujan's first two conjectures (multiplicativity and the prime-power recursion); "Ramanujan's conjecture" normally means the bound |τ(p)| <= 2p^(11/2), proved by Deligne in 1974. Sourced: LMFDB knowledge page lfunction.history.ramanujan_tau (via search summary) and the paper's bibliographic record.
- [x] L(s,f) as Dirichlet series (`218`, `258`) : Derived.
- [x] Euler product with factor (1 - a(p)p^-s + p^(k-1-2s))^-1, and for Δ with p^11 (`222`-`226`, `260`, `262`) : Derived from the prime-power recursion (generating function of a(p^r)).
- [x] ζ is the simplest Euler product; L(s,Δ) is a weight-12 analogue (`230`) : Derived.

### Figure 1 (Hecke calculator)

- [x] Exact BigInt coefficients to q^80; eigen test over every computed coefficient (`~450`) : Computed. Numbers above; no float.
- [x] Status line "Eigenform: T_p(f) = λ·f, checked on all N computed coefficients" (`~455`) : Computed. N = 41, 27, 17, 12 for p = 2, 3, 5, 7, as printed.
- [ ] Route diagram legibility (`~330`-`345`) : WRONG. Box titles at font-size 10 (10.7px rendered at 1200px); exact values overflow their boxes for large coefficients, e.g. E4^3, p = 7, m = 6: "a(42) = 68 053 817 808 375 759 360" and "b(6) = ..." run past 170px/150px boxes. Playwright.
- [ ] Code comment "Coefficients of E4^3 pass 2^53 by n = 30" (`~269`) : WRONG (not visible). First coefficient above 2^53 is n = 19.

### Figure 2 (eigenvalue table)

- [x] τ(p) for p <= 23 and T_p(Δ) a(1), a(2) columns (`~500`) : Computed.
- [?] Caption "compares it with τ(p)·Δ" and status "T_p(Δ) = τ(p)·Δ for every prime p tested" (`207`, `~530`) : Overclaims the code. Only a(1) and a(2) were compared. The statement is true (full check above) but the figure did not test it.

verified 19, wrong 4, unverifiable 2. Note: S26 missing; Mordell/Ramanujan conflated; route boxes overflow.

## 09 Weight 2, Differential Forms, and Modular Curves

File: docs/modular-forms/09-weight-2-and-modular-curves.html. Checked 2026-09-25. Scripts: g3/c09.mjs (runs lib/modular-math.js Mod.gamma0 in node; eta product for level 11; point counts on 11a1 and 37a1), g3/pw.mjs. render-check: PASS. Prose line numbers are unchanged by the fix pass.

### Prose and equations

- [x] Subtitle: weight-2 forms on Γ0(N) are holomorphic 1-forms on X0(N); Mellin gives functional equations (`98`) : Derived.
- [x] No (nonzero) weight-2 forms for SL2(Z) (`101`) : Derived. dim M_2 = 0 from the level-1 dimension formula; E2 is only quasimodular.
- [x] Γ0(N) definition, N | c (`101`, math-gamma0-def) : Derived.
- [ ] "the quotient stops being a sphere and becomes a curve X0(N) with genuine holes" (`101`) : WRONG as a general statement. Computed: genus 0 at N = 1-10, 12, 13, 16, 18, 25 (N <= 50).
- [x] genus = dim S2(Γ0(N)) because cusp forms are holomorphic differentials (`103`, math-dims2) : Derived (standard, Diamond-Shurman 3.x).
- [x] Genus 0 until N = 11 (`103`, `150`) : Computed and Sourced (OEIS A001617).
- [x] Γ0(2) has index 3 (`126`) : Computed.
- [x] Index formula N ∏(1 + 1/p) (math-index-formula) : Computed/Derived; lib values 1,3,4,6,6,12,... agree with the formula.
- [x] Cusp count Σ_{d|N} φ(gcd(d, N/d)) (`135`, math-cusp-formula) : Computed and Sourced. N = 1..50 match OEIS A001616 term for term.
- [x] Genus formula g = 1 + μ/12 - ν2/4 - ν3/3 - c/2 (`141`, math-genus-formula) : Computed and Sourced. N = 1..50 match OEIS A001617 term for term; the unrounded value is an integer for every N (the lib's Math.round hides nothing).
- [x] ν2 counts x^2 ≡ -1, ν3 counts x^2 + x + 1 ≡ 0 mod N (`146`) : Derived. Counts vanish automatically for 4 | N and 9 | N, matching the usual product formulas.
- [x] Prime N: index p+1, 2 cusps, ν2 = 1 + (-1|p), ν3 = 1 + (-3|p); N = 11 genus 1; 23 and 37 genus 2 (`148`) : Computed.
- [x] X0(11) is an elliptic curve; its form corresponds to y^2 + y = x^3 - x^2 - 10x - 20, first curve in Cremona's tables (`150`) : Sourced. LMFDB 11.a2 = Cremona 11a1, a-invariants [0,-1,1,-10,-20], Γ0(11)-optimal, rank 0.
- [x] (cτ+d)^2 matches d(γτ) so f(τ)dτ is invariant (`154`, math-differential) : Derived.
- [x] Descends to a holomorphic 1-form; weight k gives k/2-differentials (`158`) : Derived.
- [x] N = 11 form q - 2q^2 - q^3 + 2q^4 + q^5 + 2q^6 - 2q^7 (`160`) : Computed and Sourced. η(τ)^2η(11τ)^2 expansion 1,-2,-1,2,1,2,-2,0,-2,-2,1,...; a_p = p+1-#E(F_p) on 11a1 matches for p = 2..37 (p ≠ 11). LMFDB 11.2.a.a gives the eta product η(z)^2η(11z)^2.
- [x] Riemann-Roch: dim of holomorphic 1-forms = g (`162`) : Derived.
- [?] "0 at N = 1, 1 at N = 11, 2 at N = 23, 3 at N = 30" (`166`) : True values, but 11 and 30 are the first levels of genus 1 and 3 while 23 is not the first of genus 2: N = 22 is (Computed; genus-2 levels <= 50: 22, 23, 26, 28, 29, 31, 37, 50). Figure 2 (computed) marks 22, so the prose and figure disagree.
- [x] Petersson product, Abel-Jacobi, Torelli carry over (`166`) : Derived (loose but accurate).
- [x] Converges for Re(s) > 3/2 (`174`) : Derived from |a(n)| <= d(n) n^(1/2).
- [ ] "Deligne's bound |a(n)| = O(n^(1/2+ε)) from the Weil conjectures" (`174`) : WRONG attribution for weight 2. In weight 2 the bound follows from Eichler-Shimura (a(p) as a trace of Frobenius on a curve) plus Weil's Riemann hypothesis for curves (1948); Deligne (1974) did all weights. Sourced: arXiv 2004.00284 (via search summary: "Eichler ... reducing the weight k=2 case to the Weil conjectures for algebraic curves").
- [?] "For Hecke eigenforms there is also an Euler product" followed by a formula with bad factors (1 - a(p)p^-s)^-1 (`174`, math-euler) : That shape is for newforms; an oldform eigenform at level N need not have it at p | N. Reword to newform.
- [x] Mellin transform identity ∫ f(it) t^(s-1) dt = (2π)^-s Γ(s) L(s,f) (`182`, math-mellin) : Derived.
- [x] Λ(s) = (√N/2π)^s Γ(s) L(s,f), entire, Λ(s) = ε Λ(2-s) (`186`, math-completed, math-functional-eq) : Derived.
- [x] ε = -η in weight 2, η the w_N eigenvalue (`190`) : Derived (Λ(f,s) = i^k Λ(f|W_N, k-s), i^2 = -1) and Sourced consistency: LMFDB 11.2.a.a Fricke sign -1, analytic rank 0; 37.2.a.a Fricke sign +1, analytic rank 1; 37.2.a.b Fricke sign -1, rank 0.
- [x] ε = -1 forces L(1,f) = 0; BSD predicts positive rank (`190`) : Derived.
- [x] Prime N: η = -a(N); N = 11: a(11) = 1, η = -1, ε = +1, rank 0 (`192`) : Computed (a(11) = 1 from the eta product) and Sourced (LMFDB above).
- [?] "At N = 37, ε = -1 forces L(1,f) = 0, and the curve has rank 1" (`192`) : Ambiguous. dim S2(Γ0(37)) = 2 with two newforms: 37.2.a.a (y^2 + y = x^3 - x, a(37) = -1 computed, ε = -1, rank 1) and 37.2.a.b (ε = +1, rank 0). LMFDB. Name the curve.
- [ ] "The functional equation of Λ is equivalent to the modularity of f" (`194`) : WRONG as stated. One functional equation gives modularity only at level 1 (Hecke); at level N Weil's converse theorem (Math. Ann. 1967) needs functional equations for twists too. Sourced: Harris, "Virtues of Priority", arXiv 2003.08242 (on Weil 1967 vs Hecke 1936: "the result of Weil's paper requires a collection of functional equations").
- [x] "The modularity theorem says every elliptic curve over Q arises from such a form" (`194`) : Sourced (see ledger 10).

### Figure 1 (explorer table)

- [x] Index, cusps, genus, dim S2 computed live from Mod.gamma0 (`~250`) : Computed; not hardcoded; values match OEIS above.
- [ ] Caption "Levels where genus first reaches a new value are highlighted" (`111`) : WRONG. The code highlights only the selected level's row.

### Figure 2 (genus bar chart)

- [x] Milestone bars computed: first genus 1, 2, 3 at N = 11, 22, 30; legend text computed; bar follows the slider and click/tap (`117`, `~300`) : Computed (c09.mjs; Playwright: bar 22 click reads "N = 22: index = 36, cusps = 4, genus = 2").
- [ ] SVG text sizes (`~324`, `~386`) : WRONG. Axis ticks and legend at font-size 10.

verified 26, wrong 5, unverifiable 3. Note: Deligne misattributed for weight 2; converse theorem overstated; caption wrong.

## 10 The Modularity Theorem and Elliptic Curves

File: docs/modular-forms/10-modularity-theorem.html. Checked 2026-09-25. Scripts: g3/c10.mjs (runs lib Mod.elliptic against brute-force counts over every (A,B) in the slider range), g3/pw.mjs. Sources read this session: Harris, "Virtues of Priority", arXiv 2003.08242 (quotes Lang, Notices AMS 42 (1995) 1301-1307, and Serre); Ribet, "From the Taniyama-Shimura conjecture to Fermat's Last Theorem", Ann. Fac. Sci. Toulouse 11 (1990) 116-139 (math.berkeley.edu/~ribet/Articles/toulousela.pdf); Ribet, AMS Notices news item (math.berkeley.edu/~ribet/Articles/notices.pdf); Shimura, Nagoya Math. J. 43 (1971) 199-208 (Cambridge Core abstract page); LMFDB 64.a3; bibliographic records for Wiles, Taylor-Wiles, Ribet 1990, Khare-Wintenberger. render-check: PASS. Line numbers are the page as audited.

### Prose and equations

- [x] Subtitle: every E/Q of conductor N comes from a newform in S2(Γ0(N)); Wiles' proof (1995) implies FLT (`108`) : Sourced. Wiles, Ann. of Math. 141 (1995) 443-551; semistable case suffices for FLT (Ribet Toulouse).
- [x] a_p = p + 1 - #E(F_p), "how far the count is from p + 1" (`111`, `226`) : Derived.
- [ ] "each nonsingular curve you make has a weight-2 newform whose q-expansion reproduces the same bar chart" (`113`) : WRONG as stated. Only the good-prime bars; the grey bars are counts on a singular model (and at p = 2 were also miscounted, below).
- [x] Weierstrass form, Δ = -16(4A^3 + 27B^2) (`159`-`165`, `224`) : Derived; lib discriminant agrees.
- [x] Mordell-Weil: E(Q) finitely generated (`167`) : Derived (standard).
- [x] p ∤ Δ gives good reduction (`169`) : Derived (sufficient condition for this model).
- [x] Hasse |a_p| <= 2√p; ratio "always < 1" (`148`, `173`) : Computed. Over all 118 nonsingular (A,B) in [-5,5]^2 and good p <= 47 the max ratio is 0.9878 (A = 0, B = -3, p = 31, a_p = 11); strict since 2√p is irrational.
- [ ] L(s,E) = Σ a_n n^-s = ∏_{p∤N} (1 - a_p p^-s + p^(1-2s))^-1 (`175`, `228`) : WRONG. The full Dirichlet series also has the bad factors ∏_{p|N} (1 - a_p p^-s)^-1.
- [x] Converges for Re(s) > 3/2; continuation follows from modularity; BSD predicts ord = rank (`177`) : Derived.
- [x] Theorem statement, a_p(f) = a_p(E), equivalently L(s,E) = L(s,f) (`181`) : Derived/Sourced (Wiles; BCDT).
- [ ] Conductor: "bad primes contribute p^k" (`183`) : WRONG/imprecise, and k is the weight elsewhere. Exponent is 1 for multiplicative, 2 for additive at p >= 5, at most 5 at p = 3 and 8 at p = 2 (Ogg-Saito; Ribet Toulouse: semistable conductor is ∏ p^1).
- [ ] "Taniyama (1955) suggested the link, Shimura (1964) refined it for CM curves, and Weil (1967) added the functional-equation condition" (`185`) : WRONG. Sourced (Harris arXiv 2003.08242, quoting Lang 1995): Taniyama posed problems 12-13 at the 1955 Tokyo-Nikko conference, "not literally correct as stated"; Shimura stated the conjecture for elliptic curves over Q to Serre and Weil at the IAS, "most likely in 1964" (Shimura to Harris 1998), Lang: "early 60s"; nothing to do with CM. Weil 1967 (Math. Ann. 168, "Über die Bestimmung Dirichletscher Reihen durch Funktionalgleichungen") proved the converse theorem, and Serre credits Weil with making N = conductor explicit. CM curves over Q: proved modular by Shimura, Nagoya Math. J. 43 (1971) 199-208, whose opening recalls Hecke ("every L-function of an imaginary quadratic field K with a Grössen-character is the Mellin transform of a cusp form") and cites Deuring's 1953-57 zeta-function papers. SPECIALIST: priority is contested; the new wording states the facts without ranking.
- [x] 1995: Wiles, with Taylor, semistable modularity (`188`) : Sourced. Ann. of Math. 141 (1995) 443-551 and Taylor-Wiles 553-572.
- [x] 2001: BCDT all curves (`189`) : Sourced. J. Amer. Math. Soc. 14 (2001) 843-939 (Harris fn. 5).
- [x] a_p(f) = a_p(E) links complex analysis and point counts (`192`) : Derived.
- [x] FLT statement, n >= 3, positive integers (`196`) : Derived.
- [?] Jump to "prime p >= 5" with no word on n = 3, 4 (`198`) : Open item (c). Sourced (secondary, Wikipedia "Proof of Fermat's Last Theorem for specific exponents", citing Fermat, Œuvres I p. 340; Euler 1770, Vollständige Anleitung zur Algebra; Kausler 1802, Novi Acta Acad. Petrop. 13; Legendre 1823, Mém. Acad. Sci. 6): n = 4 follows from Fermat's descent proof (area of a Pythagorean triangle is not a square); n = 3 published by Euler 1770 with a gap, usually credited to him because the missing lemma is in his other work; Kausler and Legendre gave independent proofs. Calling both cases classical is accurate. Every n >= 3 is divisible by 4 or an odd prime. SPECIALIST: primary texts not read.
- [?] "Frey (1984) observed" (`198`) : Ribet's own Notices item says "a 1985 Oberwolfach lecture by G. Frey"; secondary sources say 1984; the paper is Ann. Univ. Saraviensis 1 (1986) 1-40. Date uncertain. SPECIALIST.
- [x] Frey curve y^2 = x(x - a^p)(x + b^p) (`200`, `230`) : Sourced. Ribet Toulouse, same equation.
- [ ] "discriminant involving (abc)^(2p) and conductor the radical of abc" (`202`) : Imprecise to the point of wrong: the conductor is rad(abc) and the minimal discriminant (abc)^(2p)/2^8 only after normalising (Serre 1987 §4.1 conditions 32 | B, A ≡ -1 mod 4 for y^2 = x(x - A)(x + B), quoted by Ribet Toulouse eq. (2)-(3)); with A = a^p, B = b^p that is b even and a ≡ -1 mod 4. Ribet's own FLT paragraph writes "a ≡ 1 mod 4" for a^ℓ + b^ℓ + c^ℓ = 0; with the page's a^p + b^p = c^p and this curve, the Serre condition gives a ≡ -1 mod 4. SPECIALIST (sign convention).
- [?] "Frey and Serre argued this curve cannot be modular" (`202`) : Loose. Frey suggested it and outlined an incomplete argument; Serre formulated the conjectures (Duke Math. J. 54 (1987) 179-230) that imply it (Ribet Notices).
- [x] Ribet (1990) proved the epsilon conjecture: level-lowers to level 2 (`204`) : Sourced. Invent. Math. 100 (1990) 431-476; Ribet Notices: proved July 1986. Derived: odd ℓ | N drop because v_ℓ(Δ_min) = 2p·v_ℓ(abc); 2 stays since 2p·v2(abc) - 8 ≢ 0 mod p.
- [x] Serre's full conjecture proved by Khare and Wintenberger in 2009 (`204`) : Sourced. Invent. Math. 178 (2009) 485-504 and 505-586 (the general case also uses Kisin's 2-adic modularity, same volume).
- [x] S2(Γ0(2)) = 0 because X0(2) has genus 0 (`204`) : Computed (genus(2) = 0) and Sourced (Ribet Toulouse: "the dimension g(2) of S(2) is 0").
- [x] Frey curve semistable; Wiles covers semistable curves (`206`) : Sourced (Ribet Toulouse, Serre §4.1).
- [x] "A 358-year-old problem" (`206`) : Derived. 1995 - 1637; Fermat's note is dated only approximately (c. 1637).

### Figure 1 (curve builder, field grid, table)

- [ ] #E(F_2) in the table (`243`, lib countPointsFp) : WRONG. lib legendreSymbol(a, 2) returns 1 for odd a, so y^2 ≡ 1 (mod 2) is counted as 2 roots. c10.mjs: 90 of the 118 nonsingular curves give a wrong count at p = 2 (e.g. y^2 = x^3 + x + 1: lib 5, true 3). Correct at every odd p (brute force agrees).
- [ ] j readout (`238`, lib curveJ) : WRONG. lib returns -1728·64A^3/(4A^3 + 27B^2), off by a factor -16 from j = 1728·4A^3/(4A^3 + 27B^2). y^2 = x^3 - x showed j = -27 648 (true 1728); y^2 = x^3 + x + 1 showed about -3567 (true 6912/31); the page also rounded a non-integer j.
- [x] Bad primes greyed = primes dividing Δ (`148`, `242`) : Computed. For p >= 3 the model is minimal (p^4 ∤ A for A ≠ 0 in range), so p | Δ means bad reduction. At 2: v2(4A^3 + 27B^2) <= 8 in range, the only case at 8 is y^2 = x^3 - 4x, LMFDB 64.a3 (conductor 64), so every curve in range is bad at 2.
- [x] Field grid lit points = brute-force solutions, readout a_p (`280`-`360`) : Computed; agrees with the corrected table at p = 5, 7, 11.
- [x] Presets and sliders update table, grid, chart; singular (A,B) = (-3,-2), (-3,2), (0,0) flagged (`395`) : Computed/Playwright.
- [ ] SVG text sizes (`337`, `339`, d3 axes) : WRONG. Grid labels and axis ticks at 10px.

### Figure 2 (a_p bar chart)

- [?] Caption "By the modularity theorem, these are the Fourier coefficients of a weight-2 newform" (`154`) : Includes the grey bad-prime bars, which are counts on a singular non-minimal-type model and need not equal a(p) of the newform.
- [x] Bars from the same computed rows; colours fixed; transition 0 under Motion.reduced() (`479`) : Computed/read.

verified 22, wrong 8, unverifiable 4. Note: history of the conjecture wrong; lib j and p = 2 counts wrong.

## 11 The j-Function

File: docs/modular-forms/11-the-j-function.html. Checked 2026-09-25. Line numbers refer to the file at a12a28f (copy kept as g4/orig-11.html). Scripts in g4/: num.py (exact integer j and Delta coefficients, mpmath 60-digit e^{pi sqrt d}, Bessel/asymptotic ratios), libcheck.cjs (loads lib/modular-math.js + lib/moonshine-math.js in node: page's own coefficient tables, Heegner figure code, j eval at points inside and outside F), pw.mjs (Playwright sweep), clip.mjs (figure screenshots shot-*.png, m390/b390/h390/g1200/g390.png). render-check: PASS (before and after fixes).

Sources read this session: OEIS A000521 b-file (j coefficients), OEIS A003173 (Heegner numbers), Wikipedia "J-invariant" raw text (j = 1728 g2^3/Delta = 1728 E4^3/(E4^3 - E6^2), j(i) = 1728, j(rho) = 0, rational functions of j give all level-one modular functions, Petersson 1932 / Rademacher 1938 citations for the asymptotic), Ikeda arXiv 2510.10598 intro ("This formula was independently proved by Petersson [11] and Rademacher [12] using the circle method"), Wikipedia "Complex multiplication" raw ("values j(a) are real algebraic integers, and generate the Hilbert class field H of K"), Gannon arXiv math/0402345 (McKay 1978).

### Prose and equations

- [x] Subtitle: j = q^-1 + 744 + 196884 q + ..., weight 0, SL2(Z)-invariant, bijection from the modular curve to C u {inf} (`122`) : Computed + Derived. num.py: exact j coefficients match OEIS A000521. X(1) = compactified curve maps isomorphically to P^1.
- [x] j is a ratio of two weight-12 forms, weight 0, invariant (`125`) : Derived.
- [x] Two elliptic curves over C isomorphic iff same j (`128`) : Sourced. Wikipedia J-invariant; standard (Silverman III.1.4b over alg. closed fields).
- [ ] "Every meromorphic SL2(Z)-invariant function on H is a rational function of j" (`129`) : WRONG as stated. Needs meromorphy at the cusp too; exp(j) is invariant and holomorphic on H but not a rational function of j. Wikipedia J-invariant says "every (level one) modular function", where modular function includes the cusp condition.
- [x] J = j - 744 is the graded dimension of V natural; coefficients of J are the graded dimensions (`130`) : Sourced. Gannon math/0402345 eq. (3.2b): dim V(tau) = qJ(tau).
- [x] j = E4^3/Delta = 1728 E4^3/(E4^3 - E6^2) (`268`, equation) : Computed. num.py: (E4^3 - E6^2) is divisible by 1728 coefficientwise and equals Delta = q - 24q^2 + 252q^3 - 1472q^4 + ...; Sourced Wikipedia J-invariant.
- [x] j(gamma tau) = j(tau) (`270`) : Derived (weights cancel).
- [ ] "An SL2(Z)-invariant meromorphic function on H is a modular function" (`173`) : WRONG, same missing cusp condition as `129`.
- [x] 1728 = 12^3 makes j(i) = 1728 (`173`) : Derived. E6(i) = 0 so j(i) = 1728 E4^3/E4^3.
- [x] j holomorphic on H with a simple pole at the cusp; X(1) genus 0, j: X(1) = P^1 (`175`) : Derived. Delta nonvanishing on H, Delta = q + O(q^2), E4^3 = 1 + O(q).
- [x] Delta = q - 24q^2 + 252q^3 - ... (`179`) : Computed. num.py.
- [x] q-expansion 744, 196884, 21493760, 864299970 (`272`) : Computed + Sourced. num.py exact integers; OEIS A000521.
- [x] Every c(n), n >= 1, is a positive integer (`183`) : Computed for n <= 30 (num.py); Derived in general from the Rademacher series (all terms of the leading Bessel term dominate) / Sourced via A000521 comments. Fine as stated.
- [ ] Growth attributed to "Hardy-Ramanujan-Rademacher" (`183`) : WRONG attribution. Ikeda arXiv 2510.10598: proved independently by Petersson (1932, Acta Math. 58) and Rademacher (1938, Amer. J. Math. 60) by the circle method; Hardy-Ramanujan is the partition function p(n).
- [x] c(0) = 744 is a convention; V natural has an empty grade-0 piece in the q-power indexing (`185`) : Sourced Gannon (3.2): V0 = rho1, V1 = 0 in weight indexing; q-power grade 0 = weight 1. Consistent with Part 13's statement of the shift.
- [x] j(i) = 1728, j(rho) = 0 (`274`) : Computed. libcheck.cjs: Mod.jfn.eval(i) = 1728.000, eval(rho) = -4.9e-14.
- [x] i: square lattice, order-4 symmetry; rho: hexagonal, order 6; only lattices with extra symmetry (`193`) : Derived (automorphism group of a lattice up to homothety is mu2, mu4 or mu6).
- [x] E4(rho) = 0 gives j(rho) = 0; E6(i) = 0 with E4(i) != 0 gives 1728 (`193`) : Derived / Computed (libcheck).
- [ ] "Outside these special points, j is bijective on F" and equation H/SL2(Z) -> C u {inf} (`195`, `276`) : WRONG. j is bijective on the whole quotient, special points included (they are exactly where j = 0, 1728 once each). And H/SL2(Z) maps onto C; C u {inf} is the image of the compactified X(1).
- [x] Any modular function holomorphic on H with a simple pole at the cusp is aj + b (`199`) : Derived. f - a j is holomorphic on the compact X(1), hence constant.
- [x] Integer coefficients because E4, Delta in Z[[q]] and Delta/q is a unit in Z[[q]] (`203`) : Derived; Computed (num.py inverse of Delta/q is integral).
- [x] Holomorphic-on-H modular functions with integer coefficients form Z[j] (`203`) : Derived. Such f is a polynomial in j (principal part at the cusp); since j = q^-1 + ... is monic with integer coefficients, peeling leading terms keeps integer coefficients.
- [ ] "The Hardy-Littlewood circle method, applied to modular forms, gives the leading-order growth" (`207`) : WRONG-ish attribution (see `183`). Sourced: Petersson and Rademacher, circle method.
- [x] c(n) ~ e^{4 pi sqrt n}/(sqrt 2 n^{3/4}) (`278`) : Sourced Ikeda (1.1); Computed num.py (ratio -> 1, 0.96% at n = 10).
- [x] Same kind of asymptotic as p(n) (`211`) : Derived (both from the circle method; exponential in sqrt n).
- [x] 4 pi = 12.566; e^{12.57} ~ 286000 (`211`) : Computed. e^{4 pi} = 286751.3.
- [x] n = 1: leading term 202764 against 196884, 3% high (`213`) : Computed. num.py: 202764, +2.986%.
- [?] "next term multiplies by roughly 1 - 3/(32 pi sqrt n), which predicts 2.9% at n = 1 and 0.9% at n = 10, matching" (`213`) : Imprecise. Derived: I_1(z) ~ e^z/sqrt(2 pi z)(1 - 3/(8z)), z = 4 pi sqrt n gives 3/(32 pi sqrt n). Computed: predicts 2.98% (n = 1) and 0.94% (n = 10); actual gaps 2.99% and 0.96%. "2.9%" truncates and "0.9%" rounds the other way; both fine to about 0.1 point but should read 3.0% and 0.94%.
- [x] "Smooth envelope carries no finite-group information" (`213`) : Derived (interpretive; the asymptotic depends only on the pole at the cusp).
- [x] Q(sqrt -163) class number 1, 163 largest such d (`222`) : Sourced OEIS A003173 (1, 2, 3, 7, 11, 19, 43, 67, 163).
- [x] j((1 + i sqrt 163)/2) = -640320^3 = -262 537 412 640 768 000 (`280`) : Computed. num.py q-series at 60 digits gives -262537412640768000.0; 640320^3 = 262537412640768000.
- [x] q = -e^{-pi sqrt 163}, q^-1 = -e^{pi sqrt 163} (`226`) : Derived (e^{pi i} = -1).
- [?] "error of about 10^-12" and |eps| <~ 10^-12 (`230`, `282`) : Loose. Computed: e^{pi sqrt 163} = 262537412640768743.99999999999925007..., so e^{pi sqrt 163} - 640320^3 - 744 = -7.4993e-13. eps = sum c(n) q^n = -7.5e-13. Give the value.
- [x] "Near-integrality forced because the q-tail is exponentially small" (`230`) : Derived.
- [x] Lattice/ curve classification: C/L' = C/L iff L' = aL, every lattice rescales to Z + tau Z, same orbit iff equivalent (`239`, `284`) : Derived (standard).
- [x] y^2 = x^3 - 27j0/(j0 - 1728) x - 54j0/(j0 - 1728) has j-invariant j0 (`243`) : Derived + Computed. With A, B as given, 1728 4A^3/(4A^3 + 27B^2) = j0 (exact Fractions for j0 = 5, -3375, 8000, 1/7).
- [x] j determines the curve over Q-bar but not over Q (twists) (`243`) : Derived (standard, quadratic twists share j).
- [x] j(tau) algebraic integer for quadratic irrational tau; K(j(tau)) = Hilbert class field when Z + Z tau = O_K (`245`) : Sourced. Wikipedia Complex multiplication ("values j(a) are real algebraic integers, and generate the Hilbert class field"). SPECIALIST: the standard reference is Cox, Primes of the form x^2 + ny^2, Thm 11.1; not read here.
- [x] In 1978 McKay noticed 196884 = 196883 + 1 (`249`, `286`) : Sourced. Gannon math/0402345 sec. 1-3; Wikipedia Monstrous moonshine; He, arXiv 2305.00850 ("In 1978 ...").
- [x] "smallest non-trivial Monster irrep" 196883 (`286`) : Sourced OEIS A001379.

### Figure 1 (j on the fundamental domain)

- [x] Special points marked at i (j = 1728) and rho (j = 0) (`145`) : Computed.
- [ ] Readout j(tau) (`480`) and |j| heatmap (`407`) : WRONG away from F. The point can be dragged anywhere with Im tau >= 0.15 and the 20-term (heatmap: 8-term) q-series is evaluated directly, which diverges in practice for small Im tau. libcheck.cjs: tau = 0.4 + 0.3i gives -5.15e6 - 1.22e6 i, true value (at the reduced point 0.4 + 1.2i) -860.9 - 1050.1 i; tau = 1 + 0.15i gives 1.9e15, true 1.55e18. Browser at keyboard extreme 1.15 + 0.15i printed |j| = 1.0e15, true 1.25e9. The heatmap below the arc is wrong for the same reason.
- [ ] Caption "Drag the blue point tau inside the fundamental domain" (`145`) : WRONG; the drag is not confined to F.
- [x] "As Im tau -> inf, |j| grows without bound" (`145`) : Computed (Im 3: 1.54e8).
- [x] Heatmap colour scale fixed ([0, log 3000]), not rescaled (`399`) : Computed (code).

### Figure 2 (j versus J bridge)

- [x] Bars q^-1, q^0, q^1, q^2 with 1, 744, 196884, 21493760; J has 0 at q^0 (`291`) : Computed; values correct but hardcoded in the page rather than read from the library (flag).
- [x] Readouts: constant term would imply a nonempty grade 0; subtracting 744 leaves every positive coefficient unchanged (`355`) : Derived.
- [ ] Axis/label text below 11px: bars labels 10px and the SVG is drawn wider than its padded panel, so text rendered at 9.3-10.2px (pw.mjs).

### Figure 3 (growth)

- [x] Purple bars exact c(n), n = 1..10 (`217`) : Computed. Moon.j.coefficients equal OEIS A000521 (libcheck).
- [ ] "on log-log axes" (`217`) : WRONG. x is a linear band scale in n; only y is logarithmic.
- [ ] Dashed line labelled "Hardy-Ramanujan" (`217`, `540`, `597`) : WRONG attribution (Petersson-Rademacher).
- [x] "Agree to within a dot's width from n = 1 on" (`217`) : Computed. Max gap 2.99% = 0.013 decade on a 13.8-decade, ~250 px axis, about 0.2 px.
- [ ] Legend overlapped the n = 10 bar and line at 1200px (screenshot) : defect.

### Figure 4 (Heegner near-integers)

- [x] Nine Heegner numbers, the full class-number-one list (`234`) : Sourced OEIS A003173.
- [x] j at each is a rational integer (`234`) : Computed. num.py series: 1728, 8000, 0, -3375, -32768, -884736, -884736000, -147197952000, -640320^3.
- [x] Formula e^{pi sqrt d} = 744 - j + sum c(n) q^n, q = -e^{-pi sqrt d}; d = 1, 2 via tau = i sqrt d and e^{2 pi sqrt d} (`234`, `608`) : Derived.
- [x] Bars computed from the q-series tail with the page's coefficients (`234`) : Computed. libcheck runs the figure code: distances 0.492, 0.349, 0.235, 0.0679, 0.143, 0.222, 2.225e-4, 1.338e-6, 7.499e-13; num.py (60 digits, direct exponentials) gives the same to 4 digits.
- [x] d = 43, 67, 163 about 2e-4, 1e-6, 7e-13 (`234`) : Computed (2.2e-4, 1.3e-6, 7.5e-13). "7e-13" truncates 7.5e-13; changed to 7.5.
- [ ] "For d <= 19 the tail is of order 1" (`234`) : WRONG for d = 1, 2 (tails about 448 and 27; num.py). What is true is that the distances are 0.07 to 0.49, i.e. not small.
- [ ] Bar value labels 9.5px (`674`), axis 10px : below 11px.

### Anti-slop pass

- No em dashes. No callouts/KPI cards. h1 "The j-Function: The Cliff Edge into Moonshine" uses the colon template (not changed; title shared with index card).

verified 45, wrong 13, unverifiable 2. Note: figure 1 evaluated divergent q-series off F; asymptotic misattributed to Hardy-Ramanujan.

| 11 | The j-Function | 45 | 13 | 2 | PASS | Fig 1 j readout wrong off F; asymptotic misattributed; bijection statement wrong |

## 12 The Monster and McKay's Coincidence

File: docs/modular-forms/12-the-monster-and-mckay.html. Checked 2026-09-25. Line numbers refer to the file at a12a28f (copy kept as g4/orig-12.html). Scripts in g4/: monster.py (all 194 Monster irrep dimensions from OEIS A001379 b-file: sum of squares vs |M|, max, ratios, decomposition sums, Co0 order), supersing.py (supersingular primes by point counting over F_p, p < 400), libcheck.cjs (library tables and verify()), pw.mjs, clip.mjs (screenshots d390/d1200/c390.png, shot-12-*.png). render-check: PASS (before and after).

Sources read this session: OEIS A001379 b-file (194 degrees), A000521 b-file (j), A001228 (sporadic orders); Ogg, "Automorphismes de courbes modulaires", Sem. Delange-Pisot-Poitou 16 (1974/75) exp. 7, numdam PDF (Corollaire and Remarque 1: Tits's lecture of 14 Jan 1975, "Une bouteille de Jack Daniels est offerte..."); Gannon arXiv math/0402345 (sec. 2-3: Fischer-Griess 1973, 194 classes, eq. 3.1a-b decompositions, 171 series, Ogg 1975); Duncan-Ono arXiv 1411.5354 abstract; R. A. Wilson, "Fischer's Monsters" (Bielefeld 2017 slides: Norton proved the degree-196883 representation; Fischer, Livingstone and Thorne computed the character table); Y.-H. He et al., McKay obituary arXiv 2305.00850 (FLT 1978 table "based on this conjectured degree"; decompositions incl. the two for c(4)); Wikipedia raw text of Monster group, Monstrous moonshine, Griess algebra, Classification of finite simple groups, Sporadic group, Supersingular prime (moonshine theory).

### Prose and equations

- [x] Subtitle: predicted 1973, constructed by hand 1982, 194 irreps, dims 1 to ~2.6e26, McKay 1978, 196883 = c(1) - 1 (`142`) : Sourced (Gannon; Wikipedia Monster group: announced 14 Jan 1980, published 1982) + Computed (monster.py). Construction "1982" is the publication year; fine for a subtitle.
- [x] Notation: J = j - 744 = q^-1 + 0 + 196884q (`147`) : Derived.
- [x] Simple group definition; Jordan-Holder (`167`) : Derived (standard).
- [?] CFSG "over roughly 1955-2004 in tens of thousands of pages by more than a hundred mathematicians" (`169`) : Sourced Wikipedia CFSG: "tens of thousands of pages in several hundred journal articles written by about 100 authors, published mostly between 1955 and 2004". "More than a hundred" overstates; say "about a hundred".
- [x] Four families: cyclic, alternating n >= 5, 16 Lie-type families, 26 sporadics (`172`-`175`) : Sourced Wikipedia CFSG ("18 specific infinite families ... 16 other infinite families ... simple groups of Lie type"). Tits group convention not mentioned; fine.
- [x] Sporadics found 1861-1976; M11 order 7920 (`178`) : Sourced Wikipedia Sporadic group table (Mathieu 1861, J4 1976, O'N 1976); OEIS A001228 first term 7920.
- [x] 20 of 26 are subquotients (happy family), six pariahs (`178`) : Sourced Wikipedia Monster group.
- [x] Predicted independently by Fischer and Griess in 1973 (`182`) : Sourced Gannon sec. 2.1 ("conjectured in 1973 by Fischer and Griess"); Wikipedia Griess algebra.
- [?] "from the structure of the centraliser of an involution. The prediction said the Monster has order ... with smallest faithful representation of dimension 196883" (`182`, `190`) : Compresses three steps. Sourced: prediction = a simple group with a double cover of the Baby Monster as an involution centraliser (Wikipedia Monster group; Wilson slides "involution centralizer 2.B"); the order was computed by Griess within months with Thompson's order formula (Wikipedia); the 196883 representation was proved by Norton (Wilson slides). SPECIALIST: exact priority for "196883 predicted" (Griess/Conway/Norton, 1974-78).
- [x] Order 2^46 3^20 5^9 7^6 11^2 13^3 17 19 23 29 31 41 47 59 71 = 808017424794512875886459904961710757005754368000000000 ~ 8.08 x 10^53 (`184`-`187`, rendered from lib) : Computed (monster.py product; libcheck Moon.monster.order()); Sourced He arXiv 2305.00850 eq. (2.6).
- [x] Griess construction by hand, Aut of 196884-dim commutative non-associative real algebra (`190`) : Sourced Wikipedia Griess algebra ("dimension 196884 ... constructed it in 1980 ... published in 1982"). The page says "In 1982 Griess constructed it": announced Jan 1980; reword to give both years.
- [x] Griess algebra = 1 + 196883 as a Monster module; McKay's 1978 observation (`190`) : Sourced Wikipedia Griess algebra (1-dim fixed subspace + 196883), Gannon.
- [x] 15 distinct primes; largest power 2^46; 59 and 71 divide once (`194`) : Computed.
- [x] Supersingular primes = primes with all supersingular j in F_p (`198`, `209`) : Computed. supersing.py (count of j in F_p with a_p = 0 vs total supersingular count, p < 400) returns exactly 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 41, 47, 59, 71. Sourced Ogg Corollaire.
- [x] "That these are exactly the primes dividing |M| is Ogg's observation of 1975" (`198`) : Sourced Ogg Remarque 1 (after Tits's lecture of 14 January 1975).
- [x] "In 1975, Andrew Ogg classified the primes for which X0(p)+ has genus zero" (`203`) : Sourced Ogg (Sem. DPP 1974/75): genus g+ = 0 iff p in the list, and all supersingular j in F_p iff g+ = 0 (formula (15), Corollaire). Reworded to say what he proved.
- [x] 15-prime list (`206`) : Computed (supersing.py) and matches the Monster primes.
- [x] Ogg offered a bottle of Jack Daniel's (`209`) : Sourced Ogg Remarque 1 (verbatim "Une bouteille de Jack Daniels est offerte a celui qui expliquera cette coincidence").
- [x] Borcherds 1992 addresses it only indirectly; direct explanation open (`209`) : Sourced Wikipedia Monstrous moonshine ("a route from the monster to the genus-zero property but not in the reverse direction ... not fully resolved") and Duncan-Ono arXiv 1411.5354 abstract. SPECIALIST (contested wording).
- [x] About 8 x 10^53 elements (`211`) : Computed.
- [?] "Everything known about it comes from representations, character tables and subgroup structure" (`211`) : Unverifiable sweeping claim; soften.
- [ ] "one row per conjugacy class and one column per irrep" (`215`) : WRONG against the stated source's convention. ATLAS rows are characters (irreps) and columns are classes. "orthogonal rows and orthogonal columns under a weighted inner product" is loose (rows use the class-size-weighted product, columns the centraliser-order one).
- [x] k classes give k irreps; entries algebraic integers (`215`) : Derived (standard).
- [x] 194 classes, 194 irreps (`217`) : Sourced Gannon sec. 2.1; OEIS A001379 has 194 terms.
- [x] Character table computed by Fischer, Livingstone and Thorne in 1978, published in ATLAS (`217`) : Sourced He et al. 2305.00850 and Wilson slides (Birmingham notes 1978). Wikipedia Monster group says 1979; the Birmingham notes are dated 1978.
- [?] "The computation propagated constraints from known subgroups (the Baby Monster, the Fischer groups, the Harada-Norton group, and others) inward" (`217`) : Unverifiable; the sources read say it assumed the 196883 character (He: "Based on this conjectured degree"; Wilson). Cut.
- [ ] "long before Griess's 1982 construction" (`217`) : WRONG-ish: 1978 vs announcement in January 1980.
- [x] Sum of squares of the 194 dimensions = |M| (`223`) : Computed. monster.py: exact equality with the A001379 list.
- [x] Largest dimension 258823477531055064045234375 ~ 2.6 x 10^26 (`225`, `316`) : Computed/Sourced (A001379 a(194); lib MONSTER_MAX_DIM equal).
- [x] First five dims 1, 196883, 21296876, 842609326, 18538750076 (`324`, table) : Sourced A001379; Gannon lists the first four.
- [x] "After rho2 each dimension is 20 to 110 times the one before" (`238`) : Computed. Ratios 108.2, 39.6, 22.0.
- [x] sqrt|M| ~ 9.0 x 10^26 (`243`, `316` "8.99") : Computed 8.989 x 10^26.
- [x] Square of rho194 about 8% of |M| (`247`) : Computed 8.29%.
- [x] On a log scale dim rho2 and c(1) look identical (`251`) : Computed (figure).
- [x] j head 196884, 21493760, 864299970 (`320`) : Sourced A000521.
- [ ] Heading "McKay's 1978 letter" and "McKay wrote to John Thompson" (`258`, `268`) : Unverifiable as worded. Sources say McKay "informed Thompson" (Wikipedia, citing Conway-Norton); the letter form is anecdotal and the two retellings differ (He: Conway showed McKay the number). Reword.
- [?] "Thompson looked at the next coefficients:" (`268`) : Thompson, Bull. LMS 11 (1979) 352-353, "Some numerology between the Fischer-Griess Monster and the elliptic modular function" is paywalled and was not read. The decompositions themselves are Sourced (Gannon eq. 3.1a-b). SPECIALIST.
- [x] c(1) = rho1 + rho2; c(2) = rho1 + rho2 + rho3; c(3) = 2rho1 + 2rho2 + rho3 + rho4 (`271`-`280`) : Computed (sums exact, monster.py and lib verify()) and Sourced Gannon (3.1a-b) as the V natural decompositions.
- [x] "small non-negative multiplicities, at first only 0, 1 or 2, higher irreps enter one at a time" (`283`) : True of c(1)-c(3); Wikipedia/He list two numerically valid c(4) sums, so "at first" should be pinned to these three.
- [ ] "Five in a row, for c(1) through c(5), are not [an accident]" (`287`) : WRONG/unsupported. Only three are shown; c(4) and c(5) have more than one non-negative decomposition (Wikipedia; He: 20245856256 = 3r1 + 3r2 + r3 + 2r4 + r5 = 2r1 + 3r2 + 2r3 + r4 + r6, both checked exact in monster.py).
- [ ] "expressing each as a non-negative integer combination ... is a Diophantine constraint with no reason to be satisfiable unless an actual representation is behind it" (`287`) : WRONG. dim rho1 = 1, so every positive integer is such a combination. The evidential step was Thompson's suggestion to look at traces of other elements (Wikipedia, Gannon sec. 3.1).
- [x] Thompson's reading: graded Monster module V natural with dim = coefficients (`289`-`293`) : Sourced Wikipedia Monstrous moonshine ("Thompson suggested ... graded traces"), Gannon (3.2).
- [?] Equation dim V_n = c(n) for n from -1 (`328`) with c(n) the j-coefficient (so c(0) = 744) : Inconsistent with the prose ("for n != 0"); should say coefficient of J.
- [x] Conway-Norton: graded traces of every element are Hauptmoduln of genus-zero groups (`295`) : Sourced Gannon sec. 3.1.
- [x] Link to Exceptional Atlas for E8/Leech (`295`) : file exists (links.cjs).

### Figure 1 (prime factorisation)

- [x] One bar per prime, height = exponent, from Moon.monster.primes (`351`-`417`) : Computed.
- [ ] "The orange bars mark the supersingular primes" (`198`) : Misleading; every bar is orange (all 15 are supersingular), which the sentence implies is a subset.
- [ ] Exponent labels and axis text 10px (`414`) : below 11px.

### Figure 2 (dimension table)

- [x] First five dims and log10 values from Moon.monster.irreps (`419`-`430`) : Computed (0.0, 5.3, 7.3, 8.9, 10.3).

### Figure 3 (comparison)

- [x] Pairs rho1/c(-1), rho2/c(1), ..., rho5/c(4) with correct values (`448`-`454`) : Computed; hardcoded in the page (flag) but equal to A001379/A000521.
- [x] Caption: difference of one between rho2 and c(1) is rho1 (`255`) : Derived.
- [ ] Axis text 10px (`467`, `475`) : below 11px.

### Figure 4 (decomposition explorer)

- [x] Multiplicities from Moon.mckay.heads; totals exact; builder reaches "exact Monster decomposition" for c(1)-c(3) (`505`-`692`) : Computed (pw.mjs clicked every + button: 196884, 21493760, 864299970, remaining 0).
- [ ] Caption "Each bar is one term, dim rho_k times its multiplicity" (`162`) : WRONG of the drawing: the code drew one segment per copy (two rho1 segments, two rho2), and the per-copy labels "dim rho1 dim rho1 dim rho2 dim rho2 dim rho3" piled on top of each other at the left end for c(3) (all under 16px wide), at 10px.
- [x] "From c(1) to c(3) more irreps enter and the multiplicities stay small" (`162`) : Computed.

### Anti-slop pass

- One em dash, in a JS comment (`399`). `.notation-callout` CSS defined but unused. No KPI cards.

verified 40, wrong 9, unverifiable 6. Note: "Diophantine constraint" argument false (dim 1 exists); c(4), c(5) sums not unique.

| 12 | The Monster and McKay | 40 | 9 | 6 | PASS | coincidence argument false (dim rho1 = 1); history compressed; Fig 4 labels piled up |

## 13 Vertex Operators and the Moonshine Module

File: docs/modular-forms/13-vertex-operators-and-moonshine-module.html. Checked 2026-09-25. Scripts (in g5/): p13.mjs (extracts the page's graded-dimension code and reruns it, plus an independent E4^3/Delta expansion), verify.mjs (Playwright sweep), shot.mjs/shots.sh (screenshots o13-*, v13-*). Sources read this session: Borcherds 1992 (Invent. Math. 109, PDF from math.berkeley.edu/~reb, text in borcherds1992.txt), Gannon "Monstrous moonshine: the first twenty-five years" (arXiv math/0402345, gannon-25yrs.txt), Shimakura 2004 (arXiv math/0311141, shimakura2004.txt), FLM PNAS 81 (1984) 3256 (search record), arXiv 2508.01037 abstract (Tits), OEIS A000521, A008408, Wikipedia Monster group, Griess algebra. render-check: PASS (before and after).

### Prose and equations

- [ ] "In 1988 Frenkel, Lepowsky and Meurman (FLM) built the moonshine module" (`81`) : Sourced. FLM announced the construction in PNAS 81 (1984) 3256-3260 ("A natural representation of the Fischer-Griess Monster with the modular function J as character"); the book "Vertex Operator Algebras and the Monster" is Academic Press 1988 (Borcherds 1992 refs [16],[17]). "In 1988" alone misdates the construction.
- [x] VOA as "a framework from string theory" (`81`) : Sourced. Gannon 2004 sec. 4.2: vertex operators came from string theory and independently from Lepowsky-Wilson in Lie theory. Reworded to "string theory and conformal field theory".
- [x] j = q^-1 + 744 + ..., J = j - 744 = q^-1 + 0 + 196884q (`83`) : Computed. p13.mjs E4^3/Delta: 1, 744, 196884, ... matches OEIS A000521.
- [x] Graded space, graded dimension, graded trace definitions (`87-97`, KaTeX `280-290`) : Derived. Standard; T_g for g = 1 is gdim.
- [x] Dictionary table (`101-111`) : Derived. Matches Borcherds 1992 sec. 1 (T_1 = j - 744).
- [x] Conway-Norton conjecture (1979): graded Monster module with gdim J, every T_g a Hauptmodul of a genus-zero group (`114`) : Sourced. Borcherds 1992 Thm 1.1 and ref [13] (Bull. LMS 11 (1979) 308-339).
- [x] Grade -1 dim 1 trivial, grade 0 empty (`116`) : Computed (J coefficients) and Sourced (Gannon 2004 eq. 3.2b, V_1 = 0).
- [x] Empty grade 0 needed for a finite automorphism group; grade 0 would be a Lie algebra (`116`) : Sourced. Gannon 2004 sec. 4.2: "Aut(V) contains e^{V_1} ... Aut(V) can be finite only when V_1 = 0".
- [x] Constant term 0 comes from Leech having no norm-2 vectors (`116`) : Computed. p13.mjs: Leech theta q^1 coefficient 0 (A008408: 1, 0, 196560, ...). Page completes the argument at `223` with theta killing the 24 oscillators.
- [x] Grade 1 dim 196884 with Griess's commutative non-associative product (1982), 196884 = 1 + 196883 (`116`) : Sourced. Wikipedia Griess algebra: 196884-dim, announced 1980, published 1982; Gannon 2004 sec. 4.2 (V_2 = Griess algebra plus identity).
- [x] "Thompson worked out the first few from the character table" (`118`) : Sourced. Thompson, "Some numerology between the Fischer-Griess Monster and the elliptic modular function", Bull. LMS 11 (1979) 352-353 (Gannon 2004 ref 114; decompositions 3.1a,b). SPECIALIST: paper itself not read.
- [x] Hauptmodul definition; exists iff compactified quotient has genus zero (`132`) : Derived. Standard.
- [x] 194 classes, algebraically conjugate classes share a series, 171 distinct functions; 23A/23B example (`132`) : Sourced. Gannon 2004 sec. 3.1: "at most 194 ... T_g = T_h whenever <g> = <h> ... only 171". 23A and 23B generate conjugate cyclic subgroups (power maps), so share a series.
- [x] Vertex operator Y(v,z) = sum v_(n) z^{-n-1} (`136`, KaTeX `248`) : Sourced. Gannon 2004 sec. 4.2 (same convention).
- [x] "In physics Y(v,z) is a field ... z the worldsheet coordinate" (`140`) : Derived. Standard gloss.
- [x] VOA: V = sum_{n>=0} V_n, vacuum in V_0, omega in V_2 (`144`) : Sourced. Gannon 2004 sec. 4.2 (V = sum_{n>=0} V_n, one-dimensional V_0 for moonshine-type VOAs).
- [x] Vacuum, translation ([T,Y] = d/dz Y, T|0> = 0), locality ((z-w)^N [Y,Y] = 0), Virasoro ([L_m,L_n] = (m-n)L_{m+n} + c/12 (m^3-m) delta) (`146-158`, KaTeX `252-258`) : Derived. Standard FLM/Kac axioms and Virasoro relation.
- [x] Lattice VOA has c = rank; V-natural has c = 24 (`160`) : Derived. d free bosons give c = d; orbifolding preserves c.
- [x] gdim = sum dim V_k q^{k-1}; vacuum at q^-1; weight-1 space is the empty grade 0; Griess algebra is weight 2 (`160`) : Derived. q^{-c/24} = q^-1 shift.
- [?] "These axioms make V-natural so rigid that an automorphism is fixed by what it does on the weight-2 space" (`162`) : The axioms alone do not give this; it holds because V-natural is generated as a VOA by its weight-2 space (FLM). Reworded.
- [x] Free boson (Heisenberg) VOA, c = 1, gdim = prod (1-q^n)^-1 = 1 + q + 2q^2 + 3q^3 + 5q^4 + 7q^5 (`166`, KaTeX `260`) : Computed. p13.mjs b1 row: 1,1,2,3,5,7,11,15,22.
- [x] d bosons give c = d; lattice VOA gdim = Theta/eta^d; bosonic string on R^d/Lambda (`172`, KaTeX `264`) : Derived. Standard (q^{-d/24} absorbed in eta).
- [x] V_Lambda weight-1 dimension 24, abelian Lie algebra (`178`) : Computed. p13.mjs leech[1] = 24.
- [?] "Conway-Norton rules out continuous symmetries" (`178`) : The conjecture says nothing about symmetries directly; what rules V_Lambda out is that J has constant term 0 (so V-natural's weight-1 space must vanish). Reworded.
- [x] c = 24 is the number of transverse directions of the critical bosonic string (26) (`180`) : Derived. 26 - 2 lightcone.
- [x] Borcherds used the no-ghost theorem as an algebraic lemma (`180`) : Sourced. Borcherds 1992 sec. 5 "We prove a slight extension of the no-ghost theorem".
- [x] theta: x -> -x lifts, -1 on each oscillator, e^alpha -> +/- e^{-alpha} (`188`) : Sourced. Gannon 2004 sec. 4.2/5.1 (orbifold by the +/-1 symmetry); FLM construction. Sign detail SPECIALIST (lift conventions).
- [x] V_Lambda^+ has no weight-1 states, but its graded dimension does not match J (`192`) : Computed. p13.mjs: plus-part weights 0..3 = 1, 0, 98580, 10745856 vs J 1, 0, 196884, 21493760.
- [x] Twisted sector: anti-periodic strings, take the +1 part (`196`) : Derived. Consistent with the half-integer oscillator product the page uses.
- [x] V-natural = V_Lambda^+ + V_Lambda^{T,+}, c = 24 (`200`, KaTeX `276`) : Sourced. Gannon 2004 sec. 4.2 ("direct sum of two parts: an invariant part and a twisted part").
- [x] Theta_Lambda = E4^3 - 720 Delta, so Theta/eta^24 = j - 720 (`206`) : Computed. p13.mjs theta: 1, 0, 196560, 16773120, 398034000, 4629381120 = OEIS A008408; leech row 1, 24, 196884, 21493760 = j - 720.
- [x] Twisted sector starts at weight 3/2 with 2^12 ground states; theta-invariant part is the integer-weight part (`206`) : Derived and Computed. Ground weight 24/16 = 3/2; the page's 2^12 q^{3/2} prod(1-q^{n-1/2})^-24 integer-weight part gives 98304 = 2^12 x 24 at weight 2 and makes every total equal J.
- [x] At weight 1 only the 24 oscillators, negated by theta; twisted adds nothing at weight 1 (`223`) : Computed. p13.mjs plus[1] = (24 + (-24))/2 = 0, tw weight 1 = 0.
- [x] Weight 2: 98580 + 98304 = 2^12 x 24 = 196884 (`223`) : Computed. p13.mjs; 98580 = 196560/2 + 300 (theta-even oscillator states 300 plus half the minimal vectors).
- [x] FLM's main theorem Aut(V-natural) = M (`227`) : Sourced. Gannon 2004 sec. 4.2; arXiv 2508.01037 abstract ("the Monster is the full automorphism group of both the Griess algebra and the Moonshine module"; previous proofs by Tits).
- [x] Griess product is the v_(1)w coefficient (`227`) : Derived and Sourced. wt(u_(n)v) = 2 + 2 - n - 1 = 2 at n = 1; Gannon 2004 "u x v := u_1 v".
- [ ] "whose automorphism group Griess proved to be the Monster in 1982" (`227`) : Sourced. Griess constructed M as automorphisms of the algebra (Wikipedia Griess algebra); that M is the FULL automorphism group was proved by Tits (1983, 1984; Invent. Math. 78 (1984) 491-499, "On R. Griess' 'Friendly giant'"), as arXiv 2508.01037 records.
- [x] Aut(V_Lambda^+) = 2^24.Co1 with Co1 = Co0/{+-1}, Co0 = Aut(Leech) (`229`) : Sourced. Shimakura 2004 (J. Algebra; arXiv math/0311141) Thm 4.1: for even unimodular L without roots, Aut(V_L^+) = Hom(L, Z2).(O(L)/<-1>).
- [x] Sector-preserving symmetries 2^{1+24}.Co1 = centraliser of a 2B involution (`229`) : Sourced. Wikipedia Monster maximal subgroups ("centralizer of an involution of class 2B"); Borcherds 1992 sec. 9.
- [?] "Co1 ... does not sit inside M as a subgroup" (`229`) : Not sourced this session. What follows from the ATLAS "." notation (non-split extension) is only that Co1 is not a complement inside 2^{1+24}.Co1 (a simple subgroup isomorphic to Co1 there would meet the normal 2-group trivially and split the extension). Reworded to that weaker, derivable claim. SPECIALIST: whether Co1 embeds anywhere in M.
- [x] FLM add one sector-mixing automorphism that with 2^{1+24}.Co1 generates M (`229`) : Sourced. Gannon 2004 sec. 4.2 (orbifold "enhances the symmetry ... to all of M"); FLM's extra involution. SPECIALIST: FLM book not read.
- [x] FLM could compute graded traces for elements of 2^{1+24}.Co1 but not all 194 classes; full conjecture needed Borcherds (`233`) : Sourced. Borcherds 1992 sec. 9: "In their book [16] FLM give an explicit formula for the Thompson series of any element of the centralizer of an involution of type 2B"; sec. 1: remaining problem "to calculate the character of V".

### Figure 1 (dictionary table)

- [x] Rows as above (`101-111`) : Derived.

### Figure 2 (grade decomposition browser)

- [x] n = -1: 1; n = 1: 1 + 196883; n = 2: 1 + 196883 + 21296876 = 21493760; n = 3: 2 + 2x196883 + 21296876 + 842609326 = 864299970 (`120-129`, lib MCKAY_THOMPSON) : Computed and Sourced. Sums rechecked in node; Gannon 2004 eqs. 3.1a,b. The figure plots a hardcoded table from lib/moonshine-math.js (flagged: tabulated, not computed; values correct).
- [x] Irrep dims 196883, 21296876, 842609326 (lib) : Sourced. Gannon 2004 eq. 3.1.
- [ ] Figure title "V_n decomposition" prints a literal subscript n for n = 1, 2, 3 (`486`, `544`) : Rendered in Chromium. Fixed to show the actual index.
- [ ] Labels under thin segments overlap (n = 2, 3 at all widths) and use 9-10px text (`508-527`) : Rendered (o13-*, v13-decomp). Fixed.

### Figure 3 (graded dimensions computed)

- [x] Caption: one boson gives partitions; 24 bosons give coefficients of q/Delta (`218`) : Computed. b24 row 1, 24, 324, 3200, 25650, 176256 = prod(1-q^n)^-24.
- [x] Leech VOA has 24 states at weight 1 (`218`, readout `404-406`) : Computed. leech[1] = 24; readout "q^-1 + 24 + 196884q = j - 720", "Leech lattice has 0 roots".
- [x] "every weight matches a coefficient of J" (`218`, readout `408-421`) : Computed. p13.mjs: nat totals 1, 0, 196884, 21493760, 864299970, 20245856256, 333202640600, 4252023300096, 44656994071935 equal A000521 c(-1..7) with c(0) replaced by 0; readout says "all 9 weights ... every one matches". The comparison is against the lib's hardcoded table, which matches OEIS A000521.
- [x] 24-boson readout "far below the j-coefficients" (`400-402`) : Computed. 324 vs 196884 at weight 2.
- [?] "stacks the theta-invariant untwisted part (orange) on the twisted part (purple)" (`218`) : Rendered. Bars are split in proportion to the two parts on a log axis, so the orange top reads about 10^2.6 when the untwisted part is 98580. Caption now says the axis reads only the bar top and the halves are nearly equal.
- [ ] SVG title strings "Leech lattice VOA V_Λ" and "V♮ = V_Λ⁺ ⊕ V_Λ^{T,+}" show raw TeX-style underscores and braces (`333-334`) : Rendered. Fixed.
- [ ] Bar value labels 8.5px, axis ticks 10px (`363`, `391`) : Below the 11px floor. Fixed.

verified 44, wrong 6, unverifiable 4. Note: FLM date and Griess/Tits attribution wrong; figures genuinely compute; label defects.

## 14 Borcherds' Proof and Beyond

File: docs/modular-forms/14-borcherds-proof-and-beyond.html. Checked 2026-09-25. Scripts (in g5/): p14.mjs (extracts the page's JC, KNZ grid() and replication code and reruns them for every slider value; compares with OEIS A000521), verify.mjs (Playwright), shot.mjs (o14-*, v14-*). Sources read this session: Borcherds 1992 Invent. Math. 109, 405-444 (full text, borcherds1992.txt), Carnahan "Generalized moonshine II: Borcherds products" arXiv 0908.4223 (carnahan-gm2.txt), Gannon 2004 arXiv math/0402345, arXiv abstracts 1004.0956, 1005.5415, 1006.0221, 1008.3778, 1008.4924, 1211.5531, 1204.2779, 1307.5793, 1503.01472, 1702.03516, 1504.08179, 1607.03078; ScienceDirect/MathSciNet record for Gannon Adv. Math. 301 (2016) 322-358; Wikipedia Richard Borcherds (IMU citation), Mathieu group M24; ATLAS v3 M24 page; OEIS A000521. render-check: PASS.

### Prose and equations

- [x] Finite and affine algebras cannot match j's exponential growth (`99`, `117`) : Derived. c(n) ~ e^{4 pi sqrt n}/(sqrt2 n^{3/4}); at n = 10 the asymptotic gives 2.29e16 vs c(10) = 2.2567e16.
- [x] Borcherds introduced generalised Kac-Moody algebras and used the no-ghost theorem to get a Monster Lie algebra from V-natural (`99`, `102`) : Sourced. Borcherds 1992 abstract; ref [4] Borcherds, "Generalized Kac-Moody algebras", J. Algebra 115 (1988).
- [x] j vs J notation; j(p) - j(q) = J(p) - J(q); c(0) = 0 (`104`) : Derived.
- [x] Replication: coefficients at n = 1, 2, 3, 5 plus the series of the powers of g fix all others (`106`, `210`, `214`) : Sourced. Borcherds 1992 sec. 9: "if n = 4 or n > 5 then c_g(n) is determined by c_g(i) and c_{g^2}(i) for 1 <= i < n, so if we know all the coefficients c_g(n) for n = 1, 2, 3, and 5 and all elements g ... we can work out all".
- [ ] "affine Kac-Moody adds null directions but with polynomial multiplicity growth" (`117`) : Derived. Affine imaginary roots are the multiples of delta with multiplicity at most the rank (bounded), not polynomially growing.
- [x] KM: a_ii = 2, every simple root positive norm, multiplicity 1 (`119`) : Derived.
- [ ] "Borcherds allowed a_ii <= 2" (`123`) : Derived. Borcherds' condition is a_ii = 2 or a_ii <= 0 (Borcherds 1988; Kac 3rd ed.); 0 < a_ii < 2 is not what is added. Following sentences are right.
- [x] Imaginary simple roots: non-positive norm, no reflection, multiplicity possibly > 1; root spaces, triangular decomposition, Weyl group survive (`123-127`) : Sourced. Borcherds 1992 sec. 1 (simple roots (1,n) with multiplicity c(n)) and sec. 4.
- [x] Real roots = Weyl orbit of positive-norm simple roots, multiplicity 1; others imaginary; affine imaginary roots are multiples of delta (`131-133`) : Derived. Standard (Kac).
- [x] Weyl denominator identity (`146`, KaTeX `281`) : Derived.
- [x] GKM denominator identity with sum over sets S of pairwise-orthogonal imaginary simple roots, (-1)^|S| e^{-sigma(S)} (`150-154`, KaTeX `285`) : Sourced. Borcherds 1992 sec. 4 (character "sum epsilon(alpha) e^alpha" over sums of pairwise orthogonal imaginary simple roots).
- [x] Goddard and Thorn (1972) no-ghost theorem in 26 dimensions; physical states identified with the 24 transverse ones (`158`) : Sourced. Borcherds 1992 sec. 5 and ref [21] (Phys. Lett. B 40 (1972) 235-238). "Above 26 dimensions negative-norm states appear": standard (Brower 1972), not read this session. SPECIALIST.
- [?] "Applying the no-ghost theorem to the BRST cohomology gives a Z^2-graded Lie algebra" (`160`) : Borcherds 1992 builds the Lie algebra as P^1 modulo the null space of the bilinear form (sec. 5-6) and only notes the semi-infinite (BRST) cohomology construction of Frenkel-Garland-Zuckerman as an alternative (p. 22). Reworded to his construction.
- [x] m_(m,n) is V-natural_{mn} as a Monster module for (m,n) != (0,0); (0,0) is 2-dimensional; empty for mn = 0 or mn <= -2 (`168`) : Sourced. Borcherds 1992 Thm 5.1 (quotient of P^1_r is V_{1-(r,r)/2} for r != 0, V_1 + R^2 for r = 0) and sec. 1.
- [?] "The no-ghost theorem guarantees a non-degenerate invariant bilinear form" (`168`) : The form is non-degenerate because the null space is quotiented out (Borcherds Thm 5.1 statement), not a separate guarantee. Reworded.
- [x] Tensor with V_{II_{1,1}}, c = 24 + 2 = 26 (`170`) : Sourced. Borcherds 1992 Thm 5.1.
- [x] Root lattice II_{1,1}, (m,n) norm -2mn; simple roots (1,-1) real norm 2 mult 1, (1,n) n >= 1 imaginary norm -2n mult c(n); c(1..3) = 196884, 21493760, 864299970 (`174`, KaTeX `294`) : Sourced and Computed. Borcherds 1992 p. 4-5 and p. 13 ("this element has norm -2mn"); coefficients from p14.mjs JC = A000521.
- [x] Product formula p^-1 prod_{m>0, n in Z} (1 - p^m q^n)^{c(mn)} = j(p) - j(q) (`180-182`, KaTeX `298`) : Sourced and Computed. Borcherds 1992 p. 5; p14.mjs grid for D = 2..6: 9/9, 16/16, 25/25, 36/36, 49/49 coefficients agree.
- [x] "Koike, Norton and Zagier each found and proved in the 1980s" (`184`) : Sourced. Carnahan arXiv 0908.4223 sec. 1: "During the 1980s, Koike, Norton, and Zagier independently proved the following remarkable formula". Gannon 2004 attributes the collected form to Zagier.
- [?] "... by modular-function methods" (`184`) : Not in any source read. Cut.
- [x] Borcherds used the product formula to identify the simple roots and multiplicities (`184`) : Sourced. Borcherds 1992 p. 5: "we really have to use this argument in reverse, using the product formula for the j function in order to work out what the simple roots ... are".
- [x] KNZ is the identity-element case; Conway-Norton asks every T_g to be a Hauptmodul (`200`) : Sourced. Borcherds 1992 sec. 1.
- [ ] "Computing the Euler-Poincare characteristic of the BRST complex twisted by g produces a twisted denominator formula" (`202`) : Sourced. Borcherds 1992 sec. 1 and 8: the identity is Lambda(E) = H(E), exterior powers against Lie algebra homology of the positive part E, then take traces of g (Adams operations). No BRST complex.
- [x] Twisted denominator formula p^-1 prod exp(-sum_k Tr(g^k|V_mn) p^{mk} q^{nk}/k) = T_g(p) - T_g(q) (`204`, KaTeX `302`) : Sourced. Borcherds 1992 eq. (8.3), same form.
- [x] Replication formulas express a_g(n) through smaller indices of T_g and T_{g^d} (`210`) : Sourced. Borcherds 1992 eq. (9.1) (uses c_g and c_{g^2}).
- [x] J^2 - 2c(1) = J(2 tau) + J(tau/2) + J((tau+1)/2) gives c(2n), n >= 2; at n = 1 it reads c(2) = c(2) (`212`) : Derived and Computed. Both sides are q^-2 + O(q) with zero constant term; p14.mjs verifies the derived c(2n) formula for n = 1..32 (c up to 64), and c(4) = c(3) + (c(1)^2 - c(1))/2 (Gannon 2004 sec. 3.3).
- [ ] "Similar identities built from J(3 tau), J(4 tau) and so on reach the remaining indices" (`212`) : Sourced. Borcherds 1992 sec. 9 gets all four recursions (4k, 4k+1, 4k+2, 4k+3) from the p^2 and p^4 coefficients only; for J they are Mahler's (1974). J(3 tau) is not needed. Reworded.
- [ ] "Norton and Koike had already verified by direct calculation that ... Hauptmodul candidates ... satisfy the same replication formulas" (`229`) : Sourced. Borcherds 1992 sec. 8-9: "Norton [28] stated and Koike [25] proved"; "Norton's conjectures that these modular functions are completely replicable were proved by Koike".
- [x] 171 distinct functions for 194 classes (`229`) : Sourced. Gannon 2004 sec. 3.1.
- [?] Initial coefficients "computable from the known decompositions of those spaces into Monster irreducibles" (`231`) : Borcherds 1992 sec. 9 does not take the decompositions as known; he derives them by evaluating traces at seven elements of 2^{1+24}.Co1 (2B plus six odd-order Leech automorphisms, via FLM's formula) with a nonsingular 7x7 character matrix, since only chi_1..chi_7 fit in V_1..V_5. He checks all of c_g(1..5). Reworded.
- [?] "Borcherds received the Fields Medal in 1998 for this work" (`231`) : Sourced. IMU citation (Wikipedia Richard Borcherds): "for his contributions to algebra, the theory of automorphic forms, and mathematical physics, including the introduction of vertex algebras and Borcherds' Lie algebras, the proof of the Conway-Norton moonshine conjecture and the discovery of a new class of automorphic infinite products". Year right; "for this work" overstates. Reworded.
- [x] Eguchi, Ooguri, Tachikawa 2010 (`239`) : Sourced. arXiv 1004.0956, 6 Apr 2010; Experiment. Math. 20 (2011) 91-96.
- [?] "the elliptic genus of K3 surfaces decomposes into representations of M24" (`239`) : Sourced. EOT abstract: "a natural decomposition in terms of dimensions of irreducible representations of M24"; the decomposition is of the multiplicities of N = 4 superconformal characters. Made precise.
- [x] M24 order 244823040, acts on S(5,8,24) (`239`) : Sourced. ATLAS v3 M24 page "244823040 = 2^10.3^3.5.7.11.23"; Wikipedia M24 (automorphism group of the S(5,8,24) design); node 2^10*27*5*7*11*23 = 244823040.
- [x] Weak Jacobi form coefficients encode M24 representations (`239`) : Sourced. EOT abstract; Gannon 1211.5531 abstract.
- [ ] "Gannon proved the conjecture in 2012" (`239`) : Sourced. arXiv 1211.5531, v1 23 Nov 2012, published Adv. Math. 301 (2016) 322-358 (DOI 10.1016/j.aim.2016.06.014). What he proved: the class functions from the candidate twining genera (Cheng arXiv 1005.5415; Gaberdiel-Hohenegger-Volpato 1006.0221, 1008.3778; Eguchi-Hikami 1008.4924) are true characters of M24. The bare "in 2012" hides that the candidates came from others and that publication was 2016.
- [ ] "Cheng, Duncan, and Harvey generalised Mathieu Moonshine to a family of 23 ... instances" under the heading 2012 (`241-243`) : Sourced. arXiv 1204.2779 (Apr 2012) describes "a certain system of six finite groups"; the 23 Niemeier cases are arXiv 1307.5793 (Jul 2013; Res. Math. Sci. 1 (2014)).
- [x] Niemeier lattices with roots: 23; even unimodular rank 24 (`243`) : Sourced. 1307.5793 abstract ("the 23 even unimodular positive-definite lattices of rank 24 with non-trivial root systems"). Page's gloss omitted "positive-definite"; added.
- [x] Each instance pairs a finite group with (vector-valued) mock modular forms (`243`) : Sourced. 1307.5793 abstract.
- [x] Duncan, Griffin and Ono proved it in 2015 (`243`) : Sourced. arXiv 1503.01472, Res. Math. Sci. 2 (2015) 26; they prove the remaining 22 cases, Gannon having done M24. Added.
- [?] Leech "has no umbral instance; its moonshine is the monstrous one" (`243`) : First half follows from 1307.5793; second half is loose (Leech also underlies Conway moonshine). Reworded to "it is the lattice the moonshine module itself is built from".
- [x] O'Nan moonshine: Duncan, Mertens, Ono 2017, weight 3/2, arithmetic invariants of elliptic curves (`245-247`) : Sourced. arXiv 1702.03516 (Feb 2017).
- [x] Thompson moonshine: Harvey-Rayhaun proposed, weight 1/2 weakly holomorphic; Griffin-Mertens proved (`247`) : Sourced. arXiv 1504.08179; 1607.03078 (Res. Math. Sci. 3 (2016) 36).
- [x] Link to Exceptional Atlas (`249`) : Checked. Target exists.

### References

- [x] Conway & Norton (1979) Bull. LMS 11, 308-339 (`254`) : Sourced. Borcherds 1992 ref [13].
- [x] FLM (1988) VOAs and the Monster, Academic Press (`255`) : Sourced. Borcherds 1992 ref [16].
- [x] Borcherds (1992) Invent. Math. 109, 405-444 (`256`) : Sourced. Paper header.
- [x] Gannon (2006) Moonshine Beyond the Monster, CUP (`257`) : Sourced. Publisher record via search (Cambridge Monographs on Mathematical Physics, 2006).
- [x] EOT (2011) Experiment. Math. 20, 91-96 (`258`) : Sourced. arXiv journal-ref.
- [x] CDH (2014) Commun. Number Theory Phys. 8, 101-242 (`259`) : Sourced. arXiv 1204.2779 journal-ref.
- [ ] Duncan, Mertens & Ono (2017), Amer. J. Math., no volume (`260`) : Sourced. Published Amer. J. Math. 143 (2021) 1115-1159 (arXiv 1702.03516).

### Figure 1 (proof pipeline)

- [x] Six stages and details (`313-318`) : Sourced as the prose entries above. Stage 3 sub "Monster Lie algebra" etc. fine.
- [ ] Stage subtitles 9-9.5px (`379`) : Below the 11px floor. Fixed (shorter subtitles at 11px).

### Figure 2 (roots)

- [x] A2 has six real roots (`137-141`, `425-432`) : Computed. Six unit vectors at 60 degrees.
- [ ] Schematic GKM: four "real" roots at (+-0.75, +-1.3) lie inside the drawn 45-degree light cone, where the legend says norm <= 0 (`439-442`, `477-488`) : Rendered and Derived (|y| > |x|). Contradicts the legend. Fixed by moving them to (+-1.3, +-0.75).
- [ ] Caption "imaginary simple roots are open amber circles"; aria "imaginary roots on and inside the light cone" (`141`, `419`) : Derived. The open circles are imaginary roots generally, with made-up multiplicities; none sits on the cone. Fixed.
- [ ] At 390px the outermost imaginary roots overlap the title and legend (`422`, scale 55) : Rendered (v14-gkm-390 before fix). Fixed by fitting the scale to H.

### Figure 3 (KNZ product, computed)

- [x] Left side multiplied out exactly with exponents c(mn) from E4^3/Delta (`195`, `556-615`) : Computed. JC(1..10) = A000521; grid code reruns: all coefficients agree for every slider value 2..6.
- [ ] "The first row and column reproduce J(q) and J(p)" (`195`) : Computed. The first displayed row is a = -1 (only 1 at b = 0); -J(q) sits in row a = 0 and J(p) in column b = 0. Fixed.
- [x] Every mixed coefficient is 0; halves "grow past 10^11" (`195`) : Computed. Max |half| in mixed cells: 2.1e7, 2.0e10, 4.3e12, 4.0e14, 2.3e16 for D = 2..6. True but vague; caption now says 2.3 x 10^16 at the largest setting.
- [x] Summary "N of N agree ... In k mixed cells ... cancel" (`655`) : Computed. D = 4: 25/25, 9 cells.
- [x] Default readout (1,2): -864299970 and +864299970 cancel (`617-622`) : Computed.

### Figure 4 (replication cascade)

- [x] c(2n) = c(n+1) + 1/2 sum c(i)c(n-i) - 1/2 [n even] c(n/2), compared with direct E4^3/Delta (`224`, `713-719`) : Computed. n = 1..32 all identical (slider covers 2..10). Arcs use exactly the indices in the formula.
- [ ] Axis numerals 10px (`688`) : Fixed to 11px.

verified 43, wrong 14, unverifiable 7. Note: Gannon/umbral dating, BRST misattribution, Koike credit, GKM figure contradicted its legend.

## idx Modular Forms series index

File: docs/modular-forms/index.html. Checked 2026-09-25. Scripts (in g5/): cards.py (spot-checks each card's claims against its page text), verify.mjs (Playwright; counts cards, resolves every href), shot.mjs (oidx-*, vidx-390.png). render-check: PASS.

### Prose, cards and footer

- [x] "fourteen parts and four acts" (`162`) : Checked. 14 card entries, 14 article files 01..14, four act headings; every card href exists on disk.
- [x] Intro: coefficients carry divisor sums, Hecke eigenvalues, point counts, characters (`167-169`) : Derived. Matches the PROMPT through-line and Acts II-IV.
- [x] Exceptional Atlas link covers Leech with E8 (`171`) : Checked. ../exceptional-atlas/index.html exists (09-packing-and-leech.html).
- [x] Footer refs: Serre Course in Arithmetic Ch. VII; Diamond & Shurman; Zagier 1-2-3 (`177`) : Derived. Serre Ch. VII is "Modular forms"; standard texts.
- [x] Act I intro: finite area, one cusp, two orbifold points (`270`) : Derived. H/SL2(Z) has area pi/3, cusp i-infinity, elliptic points i and rho.
- [x] Cards 01-04 (`272-283`) : Checked against pages (cards.py): Cayley, metric, Euclidean word, (ST)^3, reduction, j colouring, truncation all present. F = {|Re tau| <= 1/2, |tau| >= 1} Derived.
- [x] Act II intro and cards 05-08 (`288-301`) : Checked/Derived. S_k = Delta M_{k-12}; E_k = G_k/2 zeta(k); integer coefficients through weight 10, 691 at 12 (E12 = 1 + 65520/691 sum sigma_11); Delta = eta^24; T_p a(m) -> a(pm) + p^{k-1} a(m/p).
- [?] Act III intro "point counts over F_p are Fourier coefficients" (`306`) : Loose: a_p = p + 1 - #E(F_p); the coefficients are traces, which determine the counts. Reworded.
- [x] Cards 09-10: X0(N), Mellin, functional equation; Wiles, Taylor, BCDT; Ribet level-lowering settles Fermat (`308-313`) : Checked (page 10 names BCDT, Ribet) and Derived.
- [x] Act IV intro: CN conjecture, FLM built the module, Borcherds proved (`318`) : Sourced. Borcherds 1992 abstract.
- [x] Card 11: j = q^-1 + 744 + 196884q, Hauptmodul, J = j - 744 (`321-322`) : Computed (p13.mjs / A000521).
- [x] Card 12: predicted 1973, constructed 1982, 194 irreps, McKay 1978 (`324-325`) : Sourced. Gannon arXiv math/0402345: conjectured 1973 by Fischer and Griess; Griess construction announced 1980, published 1982 (Wikipedia Monster). 194 irreps = 194 classes.
- [ ] Card 13 title "Vertex Operators and the Moonshine Module V♮" (`327`) : Page h1 and PROMPT title have no "V♮". Fixed.
- [x] Card 13 desc: graded traces Hauptmoduln; FLM orbifold of Leech VOA; dim V_n = c(n) (`328`) : Computed (p13.mjs) and Sourced (Gannon 2004 sec. 4.2).
- [x] Card 14 desc (`331`) : Sourced. Borcherds 1992 abstract and secs. 1, 8, 9.

### Header figure

- [ ] Point 1/2 + i sqrt3/2 labelled "rho-bar" (`245`) : Derived. With rho = -1/2 + i sqrt3/2 (Mod.sl2z.rho), rho-bar = -1/2 - i sqrt3/2 lies in the lower half-plane; the marked point is rho + 1 = -rho-bar. Relabelled "ρ + 1" and the aria-label updated.
- [x] Tiling of H by SL2(Z) translates with standard domain outlined (`183-264`) : Rendered (oidx-*). Dark mode legible.

### Card titles vs page h1 (not fixed here; pages belong to other workers)

- [?] Card titles differ from page h1s for 03 ("...and Its Boundaries"), 07 ("..., and Cusp Forms"), 09 ("Weight 2, Differential Forms, and Modular Curves"), 11 ("The j-Function: The Cliff Edge into Moonshine"). Card titles match PROMPT.md; the h1s drifted. Lead to decide which side to change.

verified 13, wrong 2, unverifiable 2. Note: rho-bar mislabel in header viz; four card/h1 title drifts left for lead.

## lib/modular-math.js core functions

File: docs/modular-forms/lib/modular-math.js (not edited). Checked 2026-09-25. Scripts (in g2/): lib.mjs (loads the lib in a node vm; recomputes everything in BigInt; compares to OEIS text records fetched this session by oeis.mjs: A000594, A004009, A013973, A029828, A006352, A000203), jlib.mjs (j coefficients), p05.mjs (page 05's exact Bernoulli routine).

### Verified

- [x] Mod.eisenstein.E4, E6 (n <= 30) : Computed. Equal to BigInt 240 sigma_3, -504 sigma_5 and to OEIS A004009 (29 terms) and A013973 (25 terms).
- [x] Mod.eisenstein.coeffs(k) for k = 8, 10 : Computed. E8 = E4^2 and E10 = E4 E6 to q^40 in BigInt; lib values match.
- [x] EIS_CONST comment "c_k = -2k/B_k" with 240, -504, 480, -264 : Computed from exact Bernoulli numbers (B4 = -1/30, B6 = 1/42, B8 = -1/30, B10 = 5/66, B12 = -691/2730, B14 = 7/6).
- [x] E12 normalisation: 691 E12 = 691 + 65520 sum sigma_11 q^n : Computed, matches A029828 (17 terms). 691 E4^3 - 691 E12 = 432000 Delta and 441 E4^3 + 250 E6^2 = 691 E12 to q^40.
- [x] Mod.delta.coeffs / Mod.delta.tau(n), n = 1..30 : Computed. All 30 equal A000594 and the BigInt product q prod (1-q^n)^24. (But see the precision entry below.)
- [x] tau(n) = sigma_11(n) mod 691 for n <= 40 : Computed (BigInt).
- [x] Mod.dim.M, Mod.dim.S, Mod.dim.basis : Computed for even k <= 200: dim M_k equals the number of monomials E4^a E6^b of weight k; values 1,0,1,1,1,1,2,1,2,2,2,2,3,2,3,3 for k = 0..30; dim S = 0 below 12; odd/negative k give 0. Formula matches Stein, Modular Forms, Cor 2.16 (read this session).
- [x] Mod.hecke.T(2, Delta, 12) = -24 Delta on all available coefficients : Computed.

### Precision problems (propose fixes; no page I own is affected after my page fixes)

- [ ] computeDelta builds Delta in doubles: E4^3 coefficients pass 2^53 from n = 19 (E4^3[30] = 1680521624263117440), and Mod.dim.monomialQ(3,0) = E4^3 is wrong at n = 25, 26, 29, 30, monomialQ(0,2) = E6^2 at 25, 26, 28, 29, 30. The final tau(n) survive only because the errors are under 864 before dividing by 1728 and rounding. Proposed fix: compute DELTA from the product in BigInt and convert, e.g.
  `var P=[1n]; for (var i=1;i<=N;i++) P.push(0n); for (var m=1;m<=N;m++) for (var r=0;r<24;r++) for (var n=N;n>=m;n--) P[n]-=P[n-m]; DELTA=[0].concat(P.slice(0,N).map(Number));` (all |tau(n)| < 2^53 up to n in the thousands), and document that monomialQ is approximate beyond n = 24 (or make it BigInt).
- [ ] Mod.jfn.coeffs / Mod.jfn.coeff(n) (float qDiv): not exact integers from c(11) on (c(11..29) all differ from the BigInt values); relative error 2.2e-15 at c(13), 9.5e-14 at c(21), 1.2e-11 at c(29). Used by page 11 line 635 (Heegner tail sum; the effect there is below its 1e-12 scale, but anything printing c(n) for n >= 11 would show wrong digits). Proposed fix: compute J in BigInt (E4^3 divided by Delta/q, both BigInt; exact since Delta/q has leading coefficient 1) and store as strings/BigInt with a Number view.
- [ ] Mod.eisenstein.sigma(n, k) is a float sum: sigma_11 is wrong from n = 29 (168 of n <= 200 wrong); smaller k fail later (sums pass 2^53 once n^k does). Page 07 uses it only for n <= 20 (exact). Proposed fix: add a BigInt variant sigmaBig(n, k) or document the range.
- [?] Mod.delta.tau(n) returns null for n > 30 (MAX_Q = 30); callers must guard. Page 07's checker used to refuse m n > 30 for this reason (now page-local BigInt).
- [?] Mod.eisenstein.coeffs(k) returns null for k = 2, 12 and k >= 14 (EIS_CONST only has 4..10). Not a bug, but the comment suggests the general formula; either document or add exact Bernoulli-based constants (page 05 has a BigInt Bernoulli routine that could move into the lib).

verified 8, wrong 3, unverifiable 2. Note: all coefficient values correct to n = 30; float internals fragile, j wrong from c(11).

## lib/moonshine-math.js (Moon)

File: docs/modular-forms/lib/moonshine-math.js (363 lines, a12a28f). Checked 2026-09-25. Scripts in g4/: libcheck.cjs (loads the lib in a node vm and compares with exact values), num.py (exact j coefficients by integer series), monster.py (A001379 b-file: count, sum of squares, max; Co0 order), supersing.py. Not edited (shared file); proposed fixes below for the lead.

Sources: OEIS A000521 b-file, A001379 b-file (194 terms), A001228; Gannon arXiv math/0402345; Ikeda arXiv 2510.10598 (Petersson/Rademacher); Ogg Sem. DPP 1974/75 exp. 7 (numdam); Wikipedia raw: Monster group, Monstrous moonshine, Kissing number, Conway group.

### Data (all values used by pages)

- [x] J_COEFFICIENTS c(-1..10) = 1, 744, 196884, 21493760, 864299970, 20245856256, 333202640600, 4252023300096, 44656994071935, 401490886656000, 3176440229784420, 22567393309593600 (`75`-`88`) : Computed (num.py, exact integer E4^3/Delta) and Sourced OEIS A000521. libcheck: table equal to exact BigInts. Also Mod.jfn.coeff (modular-math.js, float series) equals them exactly through n = 10.
- [x] jAsymptotic formula e^{4 pi sqrt n}/(sqrt 2 n^{3/4}) (`100`) : Sourced Ikeda (1.1); Computed ratio to exact 1.0299 (n = 1) ... 1.0096 (n = 10).
- [ ] Comment "Hardy-Ramanujan asymptotic" (`97`) : WRONG attribution. Petersson (1932) and Rademacher (1938), independently, by the circle method.
- [?] Comment "as they appear in Conway-Norton (1979) and the ATLAS of Finite Groups" (`69`-`70`) : The ATLAS does not tabulate j coefficients; cite OEIS A000521 instead.
- [ ] Comment "We store only the values we can verify against the Monster-module decompositions below" (`71`-`73`) : WRONG: coefficients go to c(10), decompositions only to c(3).
- [x] "Coefficients are integer and all >= 0 for n >= 0" (`68`) : Computed n <= 30.
- [x] MONSTER_PRIMES exponents 46, 20, 9, 6, 2, 3, 1 x 9 (`121`-`137`); monsterOrder() = 808017424794512875886459904961710757005754368000000000 : Computed; Sourced He arXiv 2305.00850 (2.6) and consistent with sum of squares of A001379 (exact).
- [x] "15 primes dividing |M| are exactly the primes for which the supersingular j-invariants in char p lie in F_p (Ogg, 1975), the Jack Daniel's problem" (`117`-`119`) : Computed (supersing.py, p < 400) and Sourced Ogg, Corollaire + Remarque 1.
- [x] MONSTER_IRREPS 1, 196883, 21296876, 842609326, 18538750076 (`155`-`161`) : Sourced A001379.
- [x] 194 classes / 194 irreps (`149`, `163`, `175`) : Sourced Gannon sec. 2.1; A001379 has 194 terms.
- [x] MONSTER_MAX_DIM = 258823477531055064045234375 (`167`) : Sourced A001379 a(194); Computed: it is the max of the list and the list's squares sum to |M| exactly.
- [x] "every dimension is below sqrt|M| ~ 9e26" (`166`) : Computed 8.989e26.
- [x] leech.kissingNumber 196560, minimumNorm 4, dimension 24 (`181`-`183`) : Sourced Wikipedia Kissing number.
- [ ] Comment "optimal in dimension 24 (CKMRV 2017)" (`183`) : WRONG attribution. The kissing number 196560 was proved optimal by Levenshtein (1979) and Odlyzko-Sloane (1979) (Wikipedia Kissing number, citing both). CKMRV (Cohn-Kumar-Miller-Radchenko-Viazovska, Annals 2017) proved the Leech lattice is the densest sphere packing in dimension 24.
- [x] co0Order 8315553613086720000 = 2^22 3^9 5^4 7^2 11 13 23; co1Order = half = 4157776806543360000 (`185`-`186`) : Computed; Sourced Wikipedia Conway group (both values).
- [x] MCKAY_THOMPSON sums: c(1) = 1 + 196883, c(2) = 1 + 196883 + 21296876, c(3) = 2 + 2.196883 + 21296876 + 842609326 (`201`-`214`) : Computed (verify() ok for all four entries) and Sourced Gannon eq. (3.1a-b) as the actual V natural decompositions (not just numerically valid sums).
- [ ] Comment "decompositions John McKay and John Thompson found in 1978" (`191`-`192`) : Inaccurate. McKay 1978 observed c(1) = 1 + 196883; Thompson's note is Bull. LMS 11 (1979) 352-353 (not read, paywalled).
- [ ] Comment "These five terms are the numerical miracle that convinced Conway and Norton to make the moonshine conjecture" (`198`-`199`) : WRONG count (four entries, n = -1..3) and overclaims: Conway-Norton's conjecture rested on computed traces of other elements (Wikipedia Monstrous moonshine; Gannon sec. 3.1).
- [?] Section/name "McKay-Thompson heads" (`12`, `189`) : Misnomer. McKay-Thompson series are the graded traces T_g, not decompositions of dimensions. Rename in comments ("Monster decompositions of the first J coefficients").
- [x] modular.reduce (used now by Part 11 Fig 1): Computed. libcheck reduces 0.4 + 0.3i -> 0.4 + 1.2i, 1 + 0.15i -> 0 + 6.667i, 0.3 + 0.9i -> -1/3 + i, with |tau| >= 1 and |Re| <= 1/2 at the end; default maxSteps 24 can stop early for Im tau near 0 (Part 11 passes 60).
- [x] fundamentalOutline, mobius, S, T (`251`-`340`) : Derived by reading (standard formulas).
- [?] fmt.order (`40`-`49`) truncates instead of rounding (2.588e26 -> "2.58"). Pages 11/12 do not call it; harmless now.

### Monster/moonshine numbers not in pages 11-12 or this lib (checked for the lead, for use on other pages)

- [x] 171 distinct McKay-Thompson series among 194 classes : Sourced Gannon sec. 3.1 ("turns out to be only 171").
- [x] Centraliser of a 2B involution is 2^{1+24}.Co1 : Sourced Wikipedia Monster group. |2^{1+24}.Co1| divides |M| (monster.py). Co1 is a subquotient, not a subgroup, via this centraliser.
- [x] Griess algebra 196884-dim, announced Ann Arbor 14 January 1980, published Invent. Math. 69 (1982) 1-102 : Sourced Wikipedia Monster group / Griess algebra. (Gannon's survey calls it 196883-dimensional, i.e. the non-trivial summand.)
- [x] Uniqueness: Thompson reduced it to a 196883-dim faithful rep; Norton announced; first complete published proof Griess-Meierfrankenfeld-Segev 1989 : Sourced Wikipedia Monster group; He 2305.00850.
- [x] Character table: Fischer, Livingstone, Thorne (Birmingham, 1978) : Sourced He 2305.00850, Wilson slides. Wikipedia says 1979; the Birmingham notes are dated 1978.
- [x] Heegner numbers 1, 2, 3, 7, 11, 19, 43, 67, 163 : Sourced OEIS A003173. e^{pi sqrt 163} = 262537412640768743.99999999999925007..., minus (640320^3 + 744) = -7.4993e-13 : Computed (mpmath, 60 digits). j((1 + sqrt -163)/2) = -640320^3 : Computed.
- Hermite 1859, Heegner 1952, Baker, Stark 1967, Klein, Dedekind: not claimed on pages 11, 12 or in this lib (only 07 mentions any of these names; not audited here).

### Proposed lib fixes (for the lead to apply)

1. Line 97: `// Hardy–Ramanujan asymptotic ...` -> `// Petersson (1932) / Rademacher (1938) asymptotic for the j coefficients (circle method):`
2. Lines 69-73: replace with `// Values from OEIS A000521 (checked against an exact E4^3/Delta expansion). Only c(-1)..c(3) have stored Monster decompositions below.`
3. Line 183: `// exact; optimal in dimension 24 (Levenshtein 1979; Odlyzko-Sloane 1979). The Leech lattice's packing optimality is CKMRV 2017.`
4. Lines 189-199: `// Monster decompositions of the first coefficients of J = j - 744 (McKay 1978 noticed c(1) = 1 + 196883; the next ones are in Thompson 1979 and Conway-Norton 1979). ... These four entries ...` and drop the "convinced Conway and Norton" sentence. Optionally rename the section comment "McKay–Thompson heads" (lines 12, 189) to "Monster decompositions"; keep the property name `mckay.heads` to avoid breaking callers.
5. Optional: fmt.order round instead of truncate (`(Number(s.slice(0, 4)) / 1000).toFixed(2)`), only if a page starts using it.

No data value in the lib is wrong. verified 14, wrong 5, unverifiable 3 (lib section only).

## Fix pass

Run 2026-09-25 by five agents (01-04, 05-07, 08-10, 11-12, 13-14 plus the index), each fixing every wrong or unverifiable entry on its pages. Each re-ran its model checks in node, passed render-check, and swept headless Chromium at 1200px and 390px, light and dark, reduced motion on and off, exercising every control. Library fixes were proposed by the agents and applied by the main session (see "Fix record: lib" at the end). The main session then re-ran render-check on all fifteen pages and `lib/test.html` (all PASS, 60/60 lib tests), an em dash scan (none), a relative-link check (no broken targets), and a sweep of every page in all eight configurations with every range input driven to both ends, every select option and every button clicked: no console errors, no NaN, undefined or Infinity on screen, no horizontal overflow. The records below are the per-page fix logs; the scripts they name were session scratch and were not kept.

Commits (branch worktree-agent-ab4a701ec3a68f62b): 456d3ad (01), bb3079f (02), 92dc631 (03), b1f2649 (04), f8a42ef (08), fe391ad (09), 62a8435 (10 and lib elliptic fixes), 038110b (11), b445b9f (12 and moonshine-math comments), 35517c1 (lib exactness), 1aff712 (05), 52fb1da (06), daa07da (07), 83a5dd3 (13), e0ca82a (14), 69d7264 (index).

Left open: the h1 headings of 03, 07, 09 and 11 differ from their index card titles (the cards match PROMPT.md); this is editorial, not a factual error, and was not changed. `Mod.sl2z.tiling(n)` can return n + 1 matrices (harmless for the pages). No page's argument or signature figure changed materially, so PROMPT.md was not updated.

### Fix record: 01-upper-half-plane.html

- [ ] Fig 3 disk image of F: fixed. The page now builds its own dense copy of F for the disk panel (each vertical edge sampled at 81 heights geometrically from √3/2 to 1e5, the arc at 40 points) and closes the path at w = 1. The disk region now runs into the boundary at w = 1 with curved edges. Caption adds: "in the disk its two vertical edges become arcs that meet the boundary circle at w = 1, the image of i∞". The half-plane panel is unchanged. Lib untouched.

Verification: render-check PASS. pw.mjs at 1200 and 390 px, light and dark, reduced motion on and off (8 configs): no console errors, no NaN/undefined/Infinity in text, no document overflow, no SVG text under 11 px; all preset buttons clicked, every keyboard handle driven with arrows and Shift+arrows, every grab handle dragged. Relative links resolve; no U+2014. Crops: shots/fig-01fig-disk-{light,dark}.png.

New numbers for the ledger: none beyond the disk shape (top of drawn F now at Im 1e5, |w| within 1e-5 of 1, plus the explicit point w = 1).

Not fixed: nothing open.

PROMPT change: none

### Fix record: 02-sl2z-and-mobius.html

- [ ] Fig 2 caption "collapses to I": fixed, now "collapses to ±I whenever the word is a consequence of S² = (ST)³ = −I". The status line already printed −I and "(±I: acts trivially)".
- [ ] Fig 3 neighbouring tiles drawn with straight chords: fixed. The figure now maps a page-local dense copy of F (vertical edges sampled at 61 heights from √3/2 up to 1e4, arc at 40 points) through each of the 15 tiling matrices, so every tile edge is the true arc and each tile runs into its cusp. The identity copy of F (drawFundDomain) is unchanged. Lib untouched.

Verification: render-check PASS. pw.mjs, 8 configs (1200/390, light/dark, reduced motion on/off): no console errors, no NaN/undefined/Infinity, no overflow, no SVG text under 11 px. Exercised: all 5 presets, 8 typed matrices (incl. det ≠ 1 and ±I), S/T/T⁻¹/Reset (SS and (TS)³ both give −I, d = 0.000), both stabiliser modes (120.0° x3, 180.0°), keyboard on every handle, drags. Links resolve; no U+2014. Crop: shots/fig-02fig-elliptic-{light,dark}.png.

Not fixed: nothing open.

PROMPT change: none

### Fix record: 03-fundamental-domain.html

- [?] Termination argument: reworded. "S multiplies Im τ by 1/|τ|² > 1. Since Im(γτ) = Im τ/|cτ + d|² and only finitely many integer pairs (c, d) make |cτ + d| < 1, the orbit of τ has only finitely many heights above Im τ, and the process terminates."
- [ ] "many rounds ... count grows": replaced with "Points with Im τ ≥ 1 need only a T-shift. Points nearer the real axis need S-inversions too, but not many: after a T-shift |Re τ| ≤ 1/2, so when Im τ is small each S multiplies it by at least 1/(1/4 + (Im τ)²), close to 4, and the number of rounds grows only like log(1/Im τ). Anywhere in this figure (Im τ ≥ 0.05) it takes at most two; at Im τ = 0.001 it can take five." (t03b.mjs numbers.)
- [ ] Brightness "black ... white": now "Brightness rises with log |j(τ)|, from dark near the zero at ρ to light near the pole at the cusp."
- [ ] "first ten terms": now "sum the twelve terms from q⁻¹ to q¹⁰ of j(τ)"; the convergence sentence now gives the numbers: |q| ≤ e^{−π√3} ≈ 0.0043 and the first omitted term below 2 × 10⁻⁹.
- [?] "every tile has its own white cusp": now "every tile reaches the real axis at a light cusp, the rational point γ · i∞".
- [ ] Fig 1 tile geometry: fixed. New page-local DENSE_F (vertical edges at 61 heights from √3/2 to 1e4, arc at 40 points); every tile is mapped whole and clamped to the plot's height range, the SVG clipping the sides. Same helper for the Fig 2 background tiles.
- [ ] Fig 1 status: fixed. Tiling list is sliced to exactly n, and the status counts tiles actually drawn: "N tiles drawn, F included" (tiles.mjs: 20/38/53 at 1200 px, 18/31/43 at 390 px for the 20/40/60 buttons).
- [ ] Fig 3 "dark spots": caption rewritten: "The light band at the top is the pole at the cusp. The zeros sit at the tile corners, ρ and its images, where every hue meets: the colour wheel goes round three times about each one, because j has a triple zero at ρ. The darkening there is only a pixel or two wide." (winding number 3.000, t03c.mjs.)
- [?] Grid overlay incomplete: fixed. The overlay now also draws the images of the vertical edge Re = −1/2 (from ρ up to 1e4, clamped at the canvas top) under the same 44 matrices, so both edge orbits of the tessellation show.

Verification: render-check PASS (after last edit). pw.mjs, 8 configs: no console errors, no NaN/undefined/Infinity, no overflow, no SVG text under 11 px. Exercised: tile buttons 20/40/60, resolution select Low/High/Medium, grid toggle on/off, keyboard on the reduction handle (arrows, Shift+arrows), drag toward the axis. Links resolve; no U+2014. Crops: shots/fig-03fig-tiling-*.png, shots/fig-03fig-domain-color-*.png.

Note for lead (not a lib bug, just a naming wrinkle): lib Mod.sl2z.tiling(n) can return n+1 matrices (BFS pushes past maxCount); the page now slices.

- Canvas aria-label: now "hue is the argument of j, brightness rises with log |j|, light at the cusps; all hues meet at the zeros on the orbit of rho".

Not fixed: nothing open.

PROMPT change: none

### Fix record: 04-cusps-and-cusp-forms.html

- [ ] Subtitle: "Cusps are the points ℚ ∪ {i∞} on the boundary of ℍ" (dropped "rational").
- [ ] "Every other tile has a spike": now "Every tile has a spike too: the translates of F share the one at i∞, and every other tile ends at a rational point of the real axis."
- [ ] matToInfty/extGcd: fixed. extGcd now uses Math.trunc to match JS's truncating %, and matToInfty flips signs when the gcd comes back −1, so px + qy = +1 always. t04b.mjs: 0 of 1111 fractions with det ≠ 1; t04.mjs: 20,015 random pairs all det 1 with γ·r₂ = r₁. parseRat now reads x/0 as i∞ (e.g. "1/0" ↔ 2/5 gives γ = [−2, 1; −5, 2]). Status now states the direction: "γ · r₂ = r₁ for γ = [...], det = 1".
- Bézout letters: prose now "finds integers x, y with px + qy = 1, and then [[p, −y],[q, x]] has determinant 1".
- [ ] Γ₀(N) cusps: now "have more than one: two when N is prime, and more when N has repeated or many prime factors (six for N = 12)".
- [ ] Fig 1 tiles: fixed. Page-local dense F (vertical edges at 61 heights up to max(1e4, 4 × view height), arc at 40 points) before mapping, so tile sides are arcs.
- [?] "the tile whose spike ends": now "a tile of the tessellation whose spike ends at that cusp".
- [ ] Font size: the cusp tick labels and both d3 axis groups now 11 px.

Verification: render-check PASS. pw.mjs, 8 configs: no console errors, no NaN/undefined/Infinity, no overflow, no SVG text under 11 px. Exercised: compute and three preset buttons; typed pairs −5/3 ↔ 7/4 (γ = [13, −24; −7, 13]), 1/0 ↔ 2/5, 3 ↔ −11/8, abc ↔ 1/2, 4/6 ↔ −2/−3, all det 1; E₄/E₆/Δ buttons; both sliders to Home and End from the keyboard (e.g. Δ at y = 0.3 with 8 terms: relative error 1.2e+1; at y = 2: 0). Links resolve; no U+2014. Crop: shots/fig-04fig-cusp-equiv-{light,dark}.png.

Not fixed: text input "abc" is read as 0 (harmless, shown in the status).

PROMPT change: none

### Fix record: 05-modular-forms-definition.html

**Ledger [ ] entries**

- [ ] `170` "tail below double precision ... relative difference is rounding error": fixed. evalEk is now a wrapper over evalEkScale, which also returns the sum of |terms| (the scale). Both the checker readout and the Fig 1 side panel divide the difference of the two sides by |c tau + d|^k times that scale, labelled "difference / term size". Prose now says the loop stops when the next term is below double precision, that the measure stays meaningful at zeros, and that the residual is about 1e-15 at most points, growing toward 1e-10 when tau or gamma tau is near the real axis. Node sweep (p05.mjs, x in [-4,4], y in [0.15,4], k in {4..12}, gamma in {S,T,ST}): worst scaled residual 2.4e-14 (k=4), 2.4e-13 (6), 6.4e-12 (8), 1.4e-10 (10), 4.5e-9 (12, heatmap panel only, at a fixed benign point). At tau = i, k = 6, S the page now prints 2.18e-16 (was 2.00e+0).
- [ ] Fig 2 readout `603` / Fig 1 panel `489`: fixed by the same change. Fig 2 caption now also names the red point gamma tau, mentions the arrow keys, and states what the last line divides by.

**Other defects**

- Fig 3 axis tick labels 10px -> 11px.
- Fig 1 caption now says the colour scale is fitted to each weight (it was rescaled per k without saying so).

**Verification**

render-check PASS. pw.mjs 05: 1200 and 390 px, light and dark, reduced motion on and off (8 configs): no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11px, no U+2014. Controls exercised: all heatmap weight buttons; every gamma x k combination in the checker; keyboard moves of tau (to tau = i); a mouse drag; the dims slider from Home through every value to End by ArrowRight; a bar click. Relative links (index, 04, 06, vendor css, theme.css) resolve.

**New numbers for the ledger**

- Checker "difference / term size": ~1e-15 typical; <= 1.4e-10 anywhere on the checker's range for k <= 10.
- Fig 3: every k in 4..48 predicts all later coefficients to q^15 exactly; leading determinants 1, -1728, -5159780352, 2.662e19, 2.373e32 by dimension 1..5.

Not fixed: nothing open. Fig 2 at 390px is a tall narrow strip (pre-existing layout, equal-scale axes), readable and within bounds.

PROMPT change: none

### Fix record: 06-eisenstein-series.html

**Ledger [ ] and [?] entries**

- [ ] `200` "691 in every denominator": fixed. Now "has 691 in the denominator of its q-coefficient and of almost every later one. (The exceptions are the n with 691 dividing sigma_11(n); the first is the prime n = 1381, which is -1 mod 691.)" Node: the only n <= 3000 with 691 | sigma_11(n) are 1381 and 2762.
- [?] `133` "At k = 2 the sum converges only conditionally and gives a quasi-modular form": reworded to "At k = 2 the sum does not converge absolutely; summed in a fixed order it converges, but to a function that is only quasi-modular."

**Other defects**

- U+2014 in a code comment (not visible) replaced by a semicolon.

**Verification**

render-check PASS. pw.mjs 06, 8 configs (1200/390, light/dark, reduced on/off): no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11px, no U+2014 on screen. Controls: all four coefficient-table buttons; all four weights in the lattice select; range slider Home and End by keyboard; tau handle moved by keyboard to the floor (Im 0.15) and top (Im 3.5); mouse drag. Links (index, 05, 07, vendor, theme) resolve.

Not fixed: nothing open.

PROMPT change: none

### Fix record: 07-discriminant-and-ramanujan-tau.html

**Ledger [ ] and [?] entries**

- [?] `107` "the unique weight-12 cusp form": now "the unique normalised weight-12 cusp form".
- `110` heatmap sentence (verified with caveat): now "|Delta| on the fundamental domain is largest at its bottom corners rho and rho + 1 and falls to zero toward the cusp. Below the domain it grows again, as the factor (c tau + d)^12 takes over, except near the rational points on the real axis, which are cusps too." (log10|Delta| = -2.32 at rho, -2.75 at i, up to 1.98 at y = 0.16, -7.9 at y = 0.155 over the integers.)
- `136` discriminant wording: now "g2^3 - 27 g3^2, which is the cubic's discriminant up to a factor of 16, equals (2 pi)^12 Delta(tau)".
- [?] `144` "magnitudes grow as n^{11/2}": now "the sizes sit on the scale of n^{11/2}: for n <= 30 the ratio |tau(n)|/n^{11/2} stays between 0.2 and 1.2" (computed: 0.20 to 1.18).
- [ ] `193` irregular prime: now "divides the numerator of a Bernoulli number B_k with k <= p - 3 (here B12), which by Kummer's criterion is the same as p dividing the class number of Q(zeta_p)".
- [?] `193` Herbrand-Ribet: now "Ribet (1976) used a congruence of this kind, between an Eisenstein series and a cusp form, to prove the converse of Herbrand's theorem: p dividing B_k forces a specific piece of that class group to be nontrivial."
- `197` Lehmer bound (verified): now "below about 8.16 x 10^23" (DvHZ Corollary 1.2: 816212624008487344127999).
- [ ] Fig 1 heatmap values near the real axis: fixed. New page-local log10AbsDelta(tau) sums 12 log|1 - q^n|^2 + log|q| until |q|^n < 1e-18 (no cancellation); grid and probe both use it. Caption says it is computed from the product. Node: agrees with the product reference everywhere by construction; old page values were off by up to 4.55 in log10 at y < 0.19.
- [ ] `169` Fig 3 capped at mn <= 30: fixed. The checker computes tau(1..225) exactly in BigInt from the product formula (local TAU table, local digit grouping for BigInt), so every slider pair works.
- [?] `178` "prime-power recursion governs instead": fixed. For gcd > 1 the checker now evaluates sum_{d | gcd} d^11 tau(mn/d^2) and confirms it equals tau(m) tau(n) (e.g. 15 x 15: tau(225) + 3^11 tau(25) + 5^11 tau(9) + 15^11 tau(1) = 1 481 478 465 600 = tau(15)^2; 4 x 6: tau(24) + 2^11 tau(6) = 8 902 656). Caption states the relation.

**Other defects**

- Bar chart x and y tick labels 10px -> 11px; at widths under 500px only odd n are labelled so the numbers do not run together.

**Verification**

render-check PASS. pw.mjs 07, 8 configs (1200/390, light/dark, reduced on/off): no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 11px, no U+2014. Controls: sliders set to 1x1, 15x15, 2x15, 15x2, 4x6, 2x3, 5x6, 3x9 (all "holds"/"equals this sum"), keyboard End/Home on both sliders; heatmap focused and probed by 20 ArrowDown + 8 ArrowLeft and a click. Table rows 1..20 all match mod 691. Screenshots h07.png, t07b.png, m07.png (390px dark/light) checked by eye. Links (index, 06, 08, vendor, theme) resolve.

Not fixed: the tau table and bar chart still read Mod.delta.tau (float-built, exact only by luck; see ledger-lib.md) and Mod.eisenstein.sigma (exact for n <= 20 here). Both are correct for the 20 rows shown.

PROMPT change: none

### Fix record: 08-hecke-operators.html

- [?] eigenform intro (`110`): now "Scaled so that a(1) = 1, its coefficients are then multiplicative ...".
- [ ] dim S_k = 1 list (`164`): now "S12, S16, S18, S20, S22 and S26, and for no other weight" (dim S_k computed for k <= 40; for k >= 28 dim >= 2).
- [ ] Mordell (`214`): now "Mordell's 1917 proof of Ramanujan's multiplicativity conjectures, in modern language. (Ramanujan's third conjecture, the size bound |τ(p)| <= 2p^(11/2), waited for Deligne in 1974.)"
- [ ] route diagram: box titles 10 -> 12px; each box value now measured after drawing (getComputedTextLength); if the exact value would overflow it shows "a(42) ≈ 6.81×10¹⁹" (rounded to 3 significant figures), then drops to 12px if still too wide. The equation line above the boxes keeps the exact values. Playwright: no box or SVG-edge overflow for any form x p x m (4x4x2 states checked) at 1200 and 390.
- [ ] code comment 2^53: now "at n = 19".
- [?] Fig 2: the Match column now tests every computed coefficient (tp.every(c === τ(p)·τ(i))); status reads "All 9 primes agree: T_p(Δ) = τ(p) · Δ on every coefficient computed from Δ to q⁸⁰ (41 coefficients for p = 2, 4 for p = 23)."; caption adds "Two coefficients are shown; the check covers every coefficient of T_p(Δ) that Δ to q^80 determines."

Verification: render-check PASS. g3/pw.mjs at 1200/390 x light/dark x reduced/no-preference: no console errors, no NaN/undefined/Infinity, no horizontal overflow, all SVG text >= 11px rendered, every form/prime/m button clicked (32 states), relative links resolve. No em dashes.

Not fixed: none.

PROMPT change: none

### Fix record: 09-weight-2-and-modular-curves.html

- [ ] "stops being a sphere" (`101`): now "the quotient is a compact curve X0(N) that, for most levels N, is no longer a sphere but a surface with genuine holes." (Genus 0 at 15 of the levels 1..50; 35 of 50 have positive genus.)
- [?] genus milestones (`166`): now "0 at N = 1, and first 1, 2 and 3 at N = 11, 22 and 30", matching Figure 2's computed legend.
- [ ] Deligne attribution (`174`): now "This converges for Re(s) > 3/2, because |a(n)| = O(n^(1/2+ε)). In weight 2 that bound comes from Eichler and Shimura, who tied a(p) to point counts on a curve over F_p, and Weil's Riemann hypothesis for curves; Deligne proved the analogue in every weight."
- [?] Euler product (`174`): "For Hecke eigenforms" -> "For a newform".
- [?] N = 37 (`192`): now names the curve y^2 + y = x^3 - x, a(37) = -1, η = +1, ε = -1, rank 1, and notes the second newform at 37 with ε = +1 and rank 0 (LMFDB 37.2.a.a / 37.2.a.b).
- [ ] converse (`194`): now "The functional equation of Λ is the Atkin-Lehner symmetry of f read through the Mellin transform ... Weil's converse theorem (1967) runs the other way: if a Dirichlet series and enough of its twists have functional equations of this shape, it comes from a modular form."
- [ ] Fig 1 caption: now "... all computed from the formulas below. The row for the selected level is highlighted."
- [ ] SVG text: axis ticks and legend 10 -> 11.

Verification: render-check PASS. g3/pw.mjs at 1200/390 x light/dark x reduced/no-preference: no console errors, no NaN/undefined/Infinity, no horizontal overflow, SVG text >= 11px rendered; slider driven by keyboard Home/End (N = 1 and 50; chart selection follows to N = 50); bar click tested; relative links resolve. No em dashes.

Not fixed: none.

PROMPT change: none

### Fix record: 10-modularity-theorem.html

- [ ] builder intro (`113`): now "... whose coefficients a(p) reproduce the coloured bars, the primes of good reduction."
- [ ] L(s,E) (`228`): bad-prime factor ∏_{p|N} (1 - a_p p^-s)^-1 added; the lead-in (`173`) now says N is the conductor and a_p is 1, -1 or 0 at a bad prime according to the reduction type.
- [ ] conductor (`183`): now "A bad prime contributes p when the reduction is multiplicative (a node) and p^2 when it is additive (a cusp), except that the exponent can reach 5 at p = 3 and 8 at p = 2."
- [ ] history (`185`), open item (a): replaced with: Taniyama raised the question in a problem list at the 1955 Tokyo-Nikko symposium, in a form not quite correct; Shimura put it in its modern shape for curves over Q in conversations with Serre and Weil in the early 1960s; Weil's 1967 paper proved a converse theorem and made the level equal to the conductor, which is why all three names are attached; Shimura showed in 1971 that CM curves over Q are modular, building on Deuring's description of their L-functions as Hecke L-functions.
- [?] n = 3, 4 (`198`), open item (c): new paragraph: every n >= 3 is a multiple of 4 or of an odd prime; Fermat's infinite descent settles n = 4; Euler published n = 3 in 1770 with a gap repaired from his other work; independent proofs by Kausler (1802) and Legendre (1823); that leaves p >= 5.
- [?] Frey date (`198`): "Frey (1984)" -> "Frey, in an Oberwolfach lecture published in 1986". The setup now states the normalisation: a, b, c coprime, reorder and change signs so b is even and a ≡ -1 (mod 4).
- [ ] Frey curve invariants (`202`), open item (b): now "is semistable, with minimal discriminant (abc)^(2p)/2^8 and conductor N = rad(abc), the product of the primes dividing abc."
- [?] "Frey and Serre argued" (`202`): now "Frey suggested this curve could not be modular, and Serre (1987) formulated the conjectures that would prove it."
- Ribet paragraph (`204`, was [x]): made precise: proved 1986, published in Inventiones 1990; level N = rad(abc); odd primes drop because p divides their exponent in the discriminant, 2 stays because 2p·v2(abc) - 8 is not a multiple of p.
- "358-year-old" (`206`, [x]): reworded "A problem Fermat wrote in a margin around 1637" since the note's date is approximate.
- [ ] #E(F_2) (lib count bug): the page now counts every row by brute force over F_p x F_p (the existing finiteFieldPoints) instead of Mod.elliptic.count/ap. y^2 = x^3 + x + 1 at p = 2 now shows 3, a_2 = 0.
- [ ] j readout (lib j bug): page computes j = 6912A^3/(4A^3 + 27B^2) itself as a reduced fraction. Presets now read j = 1 728 (y^2 = x^3 - x), j = 0 (y^2 = x^3 - 1), j = 6 912/31 (y^2 = x^3 + x + 1); singular curves read "j = not defined".
- Fig 1 caption: adds "2 always divides this Δ, and every curve in the slider range really has bad reduction at 2."
- [?] Fig 2 caption: now "Grey bars: primes of bad reduction, where the count on this singular model need not match the newform. By the modularity theorem, the blue and red bars are Fourier coefficients a(p) of a weight-2 newform."
- [ ] SVG text: grid labels 10 -> 11; d3 axes set to 11 after each call.

Proposed lib fixes (not applied; lib is shared, only page 10 calls these):
- lib/modular-math.js curveJ: `return (d === 0) ? Infinity : 6912 * A * A * A / d;` (currently -1728 * 64 * A^3 / d, off by -16).
- lib/modular-math.js legendreSymbol / countPointsFp at p = 2: y^2 ≡ r (mod 2) always has exactly one root, so for p = 2 use `count += 1` per x (or have legendreSymbol(a, 2) return 0 for all a, which gives 1 + 0 = 1 root). Currently odd r counts 2 roots.
Page 10 no longer depends on either, so the lib fix is optional for correctness here.

Verification: render-check PASS. g3/pw.mjs at 1200/390 x light/dark x reduced/no-preference: no console errors, no NaN/undefined/Infinity (including the singular state A = -3, B = 2), no horizontal overflow, SVG text >= 11px rendered; both sliders driven to both ends by keyboard, all three presets x p = 5, 7, 11, chart bar click; relative links resolve. No em dashes. Screenshot g3/s10-390-dark.png.

Not fixed: the Frey lecture year (1984 vs Ribet's "1985") is left unstated; the n = 3 gap story rests on a secondary source.

PROMPT change: none

### Fix record: 11-the-j-function.html

Scripts (g4/): fix11.py (the scripted edits), libcheck.cjs, num.py, pw.mjs, clip.mjs. render-check PASS. pw.mjs: 1200/390 x light/dark x reduced motion on/off, 8/8 configs clean: no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 10.9px effective, 0 em dashes. Controls exercised: all four "Snap to" buttons, both normalisation buttons, the tau handle by keyboard (Shift+arrows to both extremes of x and y) and by mouse drag. Relative links (index, parts 10 and 12, libs, vendor) all resolve (links.cjs).

**Ledger [ ] and [?] entries**

- [ ] Hauptmodul statement missing the cusp condition (`129`): now "Every SL2(Z)-invariant function that is meromorphic on H and at the cusp is a rational function of j."
- [ ] Modular function definition (`173`): now adds "and at the cusp (its q-expansion has only finitely many negative powers)".
- [ ] "Hardy-Ramanujan-Rademacher" (`183`): now "(Petersson 1932, Rademacher 1938)".
- [ ] "Outside these special points, j is bijective on F" + equation to C u {inf} (`195`, `276`): now "j takes every complex value exactly once on the quotient, the two special points included:" and the equation reads j: H/SL2(Z) -> C (X(1) -> P^1 is already stated at `175`).
- [ ] Circle-method sentence (`207`): now "Petersson (1932) and Rademacher (1938) independently found the leading-order growth of the coefficients, using versions of the circle method that Hardy and Ramanujan had introduced for the partition function".
- [?] 2.9% / 0.9% (`213`): now "predicts gaps of 3.0% at n = 1 and 0.94% at n = 10, against actual gaps of 3.0% and 0.96%" (num.py: 2.98/0.94 predicted, 2.99/0.96 actual).
- [?] "about 10^-12" (`230`, `282`): now "about 7.5 x 10^-13: e^{pi sqrt 163} = 262 537 412 640 768 743.999 999 999 999 25..." and the equation says eps ~ -7.5 x 10^-13 (sign checked: eps = sum c(n) q^n with q < 0).
- [ ] Fig 1 readout and heatmap off F (`407`, `480`): the page now reduces tau into F with Moon.modular.reduce(tau, 60) before evaluating (heatmap too). Status line shows "(in F: x + yi)" when the point was moved. New values: 1.15 + 0.15i -> in F -0.333 + 3.333i, j = -6.2346e8 + 1.0799e9 i (|j| 1.247e9); 0.3 + 0.9i -> -0.333 + 1.000i, j = 260.44 + 210.05i (unchanged, it was already accurate there). The heatmap now shows the correct periodic |j| pattern below the arc.
- [ ] Fig 1 caption "inside the fundamental domain" (`145`): now "Drag the blue point tau (or use the arrow keys) ... Outside the fundamental domain the page first moves tau to its SL2(Z)-equivalent point in F, where the q-series converges fast, and the readout names that point."
- [ ] Fig 2 small text: bridge label and axis text 10 -> 11px; SVG width now computed from the panel width net of padding (it was scaled to 93%). Coefficients now read from Moon.j.coefficient instead of a hardcoded table (J at q^0 = 744 - 744).
- [ ] Fig 3 "log-log axes" (`217`): now "on a logarithmic scale".
- [ ] Fig 3 "Hardy-Ramanujan" in caption, aria-label and legend (`217`, `540`, `597`): now "Petersson-Rademacher". Legend moved to the top-left (it overlapped the n = 10 bar at 1200px); axis tick text 10 -> 11px.
- [ ] Fig 4 "tail is of order 1" (`234`): now "For d <= 19 the tail is not small (the distances run from 0.07 to 0.49) and nothing is forced." 7 x 10^-13 -> 7.5 x 10^-13 in caption and aria-label.
- [ ] Fig 4 label sizes: bar values 9.5 -> 11px, axis 10 -> 11px.

**New numbers the ledger should carry**

- e^{pi sqrt 163} = 262537412640768743.99999999999925007...; minus (640320^3 + 744) = -7.4993e-13.
- Heegner distances: d = 1 0.492, 2 0.349, 3 0.235, 7 0.0679, 11 0.143, 19 0.222, 43 2.23e-4, 67 1.34e-6, 163 7.50e-13.
- Asymptotic/exact - 1: n = 1 2.99%, n = 10 0.96%; 3/(32 pi sqrt n): 2.98%, 0.94%.

Not fixed: h1 keeps the colon-subtitle form ("The j-Function: The Cliff Edge into Moonshine"); the "i: j=1728" label sits on the dashed arc at 390px (cosmetic, pre-existing). The Hilbert class field sentence is sourced to Wikipedia only (SPECIALIST: Cox Thm 11.1).

PROMPT change: none

### Fix record: 12-the-monster-and-mckay.html

Scripts (g4/): fix12.py (scripted edits) plus two small follow-up edits (label layout, em dash in a JS comment), monster.py, supersing.py, pw.mjs, clip.mjs, links.cjs. render-check PASS. pw.mjs: 1200/390 x light/dark x reduced motion on/off, 8/8 configs clean (no console errors, no NaN/undefined/Infinity, no horizontal overflow, no SVG text under 10.9px effective, 0 em dashes in the file). Controls exercised: the three Decompose buttons; in each, every "+ rho_k" button clicked until disabled (status reaches "remaining 0, exact Monster decomposition" for 196884, 21493760, 864299970), then Reset and Reveal by keyboard (Enter). Relative links resolve.

**Ledger [ ], [?] entries and reworded [x] entries**

- [?] CFSG authors (`169`): "by about a hundred authors".
- [?] Prediction/order/196883 compressed (`182`, `190`): now "predicted independently by Fischer and Griess in 1973, as a simple group in which some involution has centraliser a double cover of Fischer's Baby Monster. Within months Griess had computed, from Thompson's order formula, that such a group would have order [order block]. Norton later showed that such a group would have a faithful representation of dimension 196883, the smallest possible. Griess announced a construction by hand in January 1980 and published it in 1982: the Monster is the automorphism group of a 196884-dimensional ... Griess algebra."
- [ ] Prime-figure caption (`198`): "Every bar is orange because every one of these primes is a supersingular prime, one of the 15 primes p for which ...".
- [x] Ogg sentence (`203`, `209`), reworded to what the paper proves and how the observation arose: "In a 1974-75 seminar paper, Andrew Ogg showed that the primes p for which every supersingular j-invariant lies in F_p are exactly the primes for which the curve X0(p)+ has genus zero" ... "In a lecture on 14 January 1975, Jacques Tits had described the conjectured Monster and its order, and Ogg noticed that its prime divisors are exactly these fifteen. In a remark at the end of the paper he offered a bottle of Jack Daniel's ..." Borcherds sentence: "gives a route from the Monster to the genus-zero property but not back again, and Duncan and Ono (2014) still describe the coincidence as unexplained; the bottle is unclaimed." (SPECIALIST for the last clause's framing.)
- [?] "Everything known comes from ..." (`211`): "the Monster cannot be stored element by element. Computations with it go through its representations, its character table and its subgroups."
- [ ] Rows/columns (`215`): rows = irreps, columns = classes (ATLAS convention); "whose rows and columns both satisfy orthogonality relations".
- [?] + [ ] Character table method and "long before 1982" (`217`): "computed by Fischer, Livingstone and Thorne in Birmingham in 1978, on the assumption that the group existed with an irreducible character of degree 196883, and was later printed in the ATLAS of Finite Groups (1985). The table came before Griess's 1980 construction showed that the group exists."
- [ ] "McKay's 1978 letter" / "wrote to Thompson" (`258`, `268`): heading "McKay's 1978 observation"; "In 1978 McKay noticed that c(1) = ... and told John Thompson."
- [?] "Thompson looked at the next coefficients" (`268`): now "The next coefficients split the same way:" (no attribution to the unread Thompson 1979 note).
- [x] "at first only 0, 1 or 2" (`283`): pinned to "In these three".
- [ ] + [ ] "Why this is not a coincidence" paragraph (`285`-`287`): replaced. Heading "What a sum can and cannot show"; text: a sum alone proves little because dim rho1 = 1 makes every integer a non-negative combination, and from c(4) on the combination is not unique, with both c(4) sums written out (3.1 + 3.196883 + 21296876 + 2.842609326 + 18538750076 = 2.1 + 3.196883 + 2.21296876 + 842609326 + 19360062527 = 20245856256, both exact in monster.py); what made it hard to dismiss was the recurring small sums and Thompson's sharper test via traces of other elements. The next paragraph ("Thompson's reading ...") follows on unchanged.
- [?] V natural equation (`328`): now "dim V_n = coefficient of q^n in J"; prose adds "and dim V_0 = 0, the coefficients of J. (Here V_n is indexed by the power of q; Part 13 explains how this differs by one from the usual weight.)" Consistent with Part 13 line 160.
- [ ] Fig 4 per-copy segments and piled labels (`583`-`654`): one segment per term (dim rho_k x multiplicity), labelled "2.rho1", "rho4", etc. when wider than 44px; the terms too thin to label are listed once on a second line ("also 2.rho1 + 2.rho2 + rho3, too thin to label"); SVG height 180 -> 196 to fit it. Caption now true as written.
- [ ] Sub-11px text: prime exponent labels, all axis ticks, comparison axis, decomposition labels 10 -> 11px.
- Em dash in a JS comment (`399`) replaced with a colon.

**New numbers the ledger should carry**

- sum of squares of the 194 A001379 degrees = |M| exactly; max degree 258823477531055064045234375; max^2/|M| = 8.29%; sqrt|M| = 8.989 x 10^26; ratios rho3/rho2 108.2, rho4/rho3 39.6, rho5/rho4 22.0.
- Supersingular primes recomputed (p < 400): exactly the 15 Monster primes.

Not fixed: the unused `.notation-callout` CSS rule stays (no element uses it). Figure 3's pairs array remains hardcoded in the page but matches OEIS A001379/A000521. SPECIALIST: Thompson 1979 note not read; Norton's role in 196883; Ogg-problem framing.

PROMPT change: none

### Fix record: 13-vertex-operators-and-moonshine-module.html

Pre-fix copy: g5/orig-13.html. Verification: p13.mjs (reruns the page's graded-dimension code from the edited file: totals 1, 0, 196884, ..., 44656994071935 = A000521 with c(0) -> 0; weight 2 = 98580 + 98304), verify.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference: all four grade buttons, all four mode buttons, keyboard Enter on a mode button; checks no console errors, no NaN/undefined/Infinity/"mismatch" in text, no document overflow, no rendered SVG text under 11px, all hrefs resolve; 8/8 configs pass). render-check PASS. U+2014 count 0. Screenshots v13-*.png.

**Ledger [ ] and [?] entries**

- [ ] FLM "In 1988" (`81`): now "announcing it in 1984 and giving the full construction in their 1988 book"; VOA framework "drawn from string theory and conformal field theory".
- [?] rigidity from "these axioms" (`162`): now "V♮ is generated as a VOA by its weight-2 space, so an automorphism is fixed by what it does there".
- [?] "Conway-Norton rules out continuous symmetries" (`178`): now "J has constant term 0, so the weight-1 space of V♮ must be empty; hence V_Λ24 ≠ V♮".
- [ ] Griess proved Aut = M (`227`): now "Griess built the Monster as a group of automorphisms of this algebra (published 1982), and Tits proved in 1983-84 that it is the full automorphism group."
- [?] Co1 not a subgroup of M (`229`): now "The extension does not split, so Co1 appears here only as the quotient of that subgroup by 2^{1+24}, not as a subgroup of it."
- [ ] Decomposition title/total showed a literal subscript n: now the actual index via Unicode subscripts (V₁♮, V₂♮, V₃♮, V₋₁♮).
- [ ] Overlapping labels under thin segments: segments narrower than 70px are no longer labelled underneath; they are listed on one line above the bar ("at left, too thin to see: 2×dim ρ1 + 2×dim ρ2 + dim ρ3"). All figure text now 11px.
- [?] log-scale stacking (`218`): caption now says each bar is split in proportion between the two nearly equal parts and the log axis reads only the bar top.
- [ ] SVG titles with raw TeX (`333-334`): now "Leech lattice VOA (c = 24)" and "V♮: θ-fixed untwisted ⊕ θ-fixed twisted".
- [ ] 8.5px bar labels, 10px ticks: now 11px; bar labels use one-digit mantissa at narrow widths (e.g. "4e13") and two significant digits wide ("4.5e13") so they do not collide at 390px.

**Not fixed:** the decomposition figure still draws from the hardcoded MCKAY_THOMPSON table in lib/moonshine-math.js (values correct, sourced to Gannon 2004 eq. 3.1); the figure-3 comparison uses the lib's hardcoded J table (matches A000521). No lib change proposed.

PROMPT change: none

### Fix record: 14-borcherds-proof-and-beyond.html

Pre-fix copy: g5/orig-14.html. Verification: p14.mjs on the edited file (JC(1..10) = A000521; KNZ grid 9/9, 16/16, 25/25, 36/36, 49/49 for slider 2..6; max cancelling half 2.26e16 at D = 6; replication c(2n) identical for n = 1..32), verify.mjs (Playwright, 1200/390 x light/dark x reduced/no-preference: all six pipeline buttons plus keyboard Enter, both root-mode buttons, KNZ and cascade sliders to Home/End by keyboard, KNZ cell click and keyboard Enter; summary "49 of 49", cascade "identical", readout "they agree"; no console errors, no NaN/undefined/Infinity/"mismatch", no document overflow, no rendered SVG text under 11px, all hrefs resolve; 8/8 pass). render-check PASS. U+2014 count 0. Screenshots v14-*.png.

**Ledger [ ] and [?] entries**

- [ ] affine "polynomial multiplicity growth" (`117`): now "its root multiplicities stay bounded (at most the rank)".
- [ ] "Borcherds allowed a_ii <= 2" (`123`): now "Borcherds kept a_ii = 2 and also allowed a_ii <= 0".
- [?] BRST cohomology gives the Lie algebra (`160`): now "The physical states of that string, taken modulo the null vectors of their bilinear form, form a Z²-graded Lie algebra, and the no-ghost theorem identifies each graded piece with a piece of V♮."
- [?] no-ghost "guarantees" the form (`168`): now "Because the null vectors have been divided out, 𝔪 carries a non-degenerate invariant bilinear form."
- [?] KNZ "by modular-function methods" (`184`): cut; now "proved independently in the 1980s" (Carnahan 0908.4223). Pipeline stage 4 detail likewise "already known".
- [ ] twisted formula from "the BRST complex" (`202`): now from comparing exterior powers of the positive part of 𝔪 with its Lie algebra homology (Euler-Poincaré principle), taking traces of g.
- [ ] "J(3τ), J(4τ) and so on" (`212`): now "The corresponding identity at order 4 reaches the odd indices, apart from 1, 3 and 5; for J these recursions go back to Mahler (1974)."
- [ ] "Norton and Koike had already verified by direct calculation" (`229`): now "Norton had conjectured, and Koike proved".
- [?] initial coefficients "from the known decompositions" (`231`): now explains that only the first seven irreducibles fit in V1..V5 and Borcherds fixed the decompositions from traces of seven elements of 2^{1+24}·Co1 via FLM's formula.
- [?] Fields Medal "for this work" (`231`): now "The citation for Borcherds' 1998 Fields Medal names the proof of the Conway-Norton conjecture."
- [?] EOT "elliptic genus decomposes into representations" (`239`): now the N = 4 character multiplicities are sums of dimensions of M24 representations.
- [ ] Gannon 2012 (`239`): now "Cheng, Gaberdiel-Hohenegger-Volpato and Eguchi-Hikami then found a candidate twined genus for every element of M24. Gannon proved in 2012 (published 2016) that the resulting class functions are characters of genuine M24 representations, which proves the conjecture." Reference added: Gannon (2016) Adv. Math. 301, 322-358, arXiv:1211.5531 (2012).
- [ ] umbral 23 instances in 2012 (`243`): now "first to six groups in 2012 and then in 2013 to a family of 23"; Niemeier gloss now "the 24 even unimodular positive-definite lattices of rank 24"; "vector-valued mock modular forms"; "Gannon's theorem covers the M24 case, and Duncan, Griffin and Ono proved the remaining 22 in 2015". References added for CDH 2013/2014 (Res. Math. Sci. 1, arXiv:1307.5793) and DGO 2015 (Res. Math. Sci. 2, 26); CDH 2014 gains arXiv:1204.2779 (2012).
- [?] Leech "its moonshine is the monstrous one" (`243`): now "it is the lattice the moonshine module itself is built from".
- [ ] DMO reference (`260`): now (2021) Amer. J. Math. 143, 1115-1159, arXiv:1702.03516 (2017).
- [ ] pipeline stage subtitles 9-9.5px: now 11px with shorter text ("the module", "Lie algebra", "product formula", "seeds 1, 2, 3, 5").
- [ ] GKM real roots inside the light cone: moved to (±1.3, ±0.75), outside the 45-degree cone; comment updated.
- [ ] GKM caption/aria: caption now "a schematic GKM root system in a Lorentzian plane. Real roots (positive norm, outside the dashed light cone) are filled circles; imaginary roots (inside it) are open amber circles, with illustrative multiplicities."; aria "real roots outside the light cone and imaginary roots inside it".
- [ ] GKM overlap at 390px: scale = min(55, (H/2 - 45)/2.9), 41 at H = 320; roots clear title and legend.
- [ ] KNZ caption rows: now "The a = 0 row reproduces −J(q) and the b = 0 column reproduces J(p); every mixed coefficient is 0, although the two halves that cancel there reach 2.3 × 10^16 at the largest setting." Slider label "Product terms:" renamed "Degree bound:" (it bounds the p- and q-degrees).
- [ ] cascade axis numerals 10px, GKM multiplicity labels 10px: now 11px.

**Not fixed:** "Above 26 dimensions negative-norm states appear" kept as standard (Brower 1972), not read this session; SPECIALIST. The GKM panel remains a schematic with invented multiplicities (now labelled as such).

PROMPT change: none

### Fix record: index.html

Pre-fix copy: g5/orig-index.html. Verification: verify.mjs (8 configs pass; 14 cards; every href resolves; no console errors, overflow, or sub-11px SVG text), render-check PASS, U+2014 count 0, vidx-390.png.

- [ ] header viz "ρ̄" on 1/2 + i√3/2: relabelled "ρ + 1"; aria-label now "elliptic points i, rho and rho + 1 marked".
- [ ] card 13 title: dropped "V♮" to match the page h1 and PROMPT.md.
- [?] Act III intro: now "has the L-function of a weight-2 newform, whose Fourier coefficients a_p = p + 1 − #E(𝔽_p) count points over 𝔽_p."

**Not fixed (for the lead):** card titles vs page h1 for 03, 07, 09, 11 differ (cards match PROMPT.md; h1s drifted). Pages belong to other groups.

PROMPT change: none

### Fix record: lib

Applied by the main session from the agents' proposals.

**lib/modular-math.js**

- [ ] `curveJ` off by a factor of -16 (08-10 agent): now `6912 A^3 / (4A^3 + 27B^2)` = 1728 * 4A^3 / (4A^3 + 27B^2). Node: j(y^2 = x^3 - x) = 1728, j(y^2 = x^3 - 1) = 0, j(y^2 = x^3 + x + 1) = 6912/31 = 222.97.
- [ ] `countPointsFp` at p = 2 counted two roots for odd right-hand sides (08-10 agent): over F_2 every r has exactly one square root, so each x adds 1. y^2 = x^3 + x + 1 over F_2 now counts 3 (a_2 = 0); over F_5 still 9.
- [ ] `computeDelta` built Delta from E4^3 - E6^2 in doubles, past 2^53 from n = 19 (05-07 agent): now q prod (1 - q^n)^24 in BigInt, converted to Number. tau(1..30) unchanged; tau(30) = -29211840.
- [ ] `computeJ` / `Mod.jfn.coeff` not exact from c(11) (05-07 agent): now exact BigInt division of E4^3 by Delta/q, converted to Number (the nearest double; c(n) passes 2^53 from n = 11). All 31 stored coefficients c(-1)..c(29) equal the nearest doubles of an independent exact Python expansion.
- [ ] `sigmaK` float sum wrong for sigma_11 from n = 29 (05-07 agent): now summed in BigInt, returning the correctly rounded Number.
- [?] `Mod.delta.tau(n)` returns null for n > 30 and `Mod.eisenstein.coeffs(k)` only covers k = 4..10: documented in the ledger, not changed (page 07 now computes tau in BigInt itself).
- `lib/test.html` expected a_5(y^2 = x^3 - x) = 2; the true value is -2 (#E(F_5) = 8; LMFDB 32.a3). Test corrected; 60/60 pass (the j tests that the curveJ bug would have failed now pass).
- Em dashes removed from comments in `modular-math.js` and `test.html`.

**lib/moonshine-math.js** (comments only; no data value was wrong)

- Asymptotic for the j coefficients credited to Petersson (1932) / Rademacher (1938), not Hardy-Ramanujan.
- j coefficient block comment now says the values come from OEIS A000521, checked against an exact E4^3/Delta expansion.
- Kissing number 196560 optimality credited to Levenshtein 1979 and Odlyzko-Sloane 1979 (CKMRV 2017 is the packing result).
- Decomposition block: McKay 1978 noticed c(1) = 1 + 196883; the next ones are in Thompson 1979 and Conway-Norton 1979. The "numerical miracle that convinced Conway and Norton" sentence was dropped.

Verification after the lib changes: render-check PASS on all fifteen pages and `lib/test.html`; the eight-configuration sweep above was run after these changes.

## Leads from FACT-CHECK.md (2026-09-27)

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 03 | "Finite area is what makes spaces of modular forms finite-dimensional" (`124`) | wrong, fixed | Derived. The existing row at 03 (`124`) accepted it as a heuristic, but finite area is not the mechanism: finiteness comes from compactness of the quotient with the cusp added plus holomorphy at the cusp, made exact by the valence formula (Part 5; Serre, A Course in Arithmetic, VII.3). | Reworded: finite area is a first sign; the working reason is compactness plus holomorphy at the cusp; points to Part 5's valence formula. |
| 07 | "So tau(n) grows roughly as n^(11/2)" after the Deligne bound (`201`) | wrong, fixed | Derived: Deligne gives only the upper bound abs(tau(n)) <= d(n) n^(11/2). The typical size n^(11/2) is Rankin 1939 (Proc. Cambridge Philos. Soc. 35): sum over n <= x of tau(n)^2 ~ c x^12. | States the bound as a cap up to d(n), says it alone does not give the typical size, cites Rankin's mean-square asymptotic for that. |
| 08 | "Hecke eigenforms have multiplicative coefficients" without a(1) = 1 | wrong, fixed | Derived: a(mn) = a(m)a(n) needs a(1) = 1; E4 as used on the page has a(n) = 240 sigma_3(n), and 240 sigma_3(6) != 240 sigma_3(2) * 240 sigma_3(3). The 08 subtitle itself only speaks of tau (tau(1) = 1) and the 08 body already normalises; the unnormalised wording was in 07 (`156`), the 08 index card and PROMPT.md. | 07 `156`, index card 08 and PROMPT.md now say "scaled so that a(1) = 1". |
| 10 | "Fourier coefficients of a cusp form ... are point counts over finite fields" (`192`) | wrong, fixed | Derived: a_p(E) = p + 1 - #E(F_p) at good primes, so a_p determines the count but is not it. | Now "determine point counts ...: #E(F_p) = p + 1 - a_p(f) at every prime p of good reduction". PROMPT.md Part 10 line reworded the same way. |
| 11 | "The constant c(0) = 744 is a convention" (`185`) | wrong, fixed | Derived: j = E4^3/Delta (the normalisation j(i) = 1728); E4^3 = 1 + 720q + ..., 1/Delta = q^-1 (1 + 24q + ...), so c(0) = 744 is forced. The real choice is j versus J = j - 744 (any j + c is a Hauptmodul). | Says 744 is forced by the 1728 normalisation (720 + 24) and that the convention is the choice of j versus the constant-term-0 Hauptmodul J. |

## Second opinion (all-series hunt, 2026-09-27)

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 03 | "Every tile in these figures touches the real axis at one rational point" (outro) and "every tile reaches the real axis at a light cusp, the rational point γ · i∞" | wrong, fixed | Derived: for γ = T^n (c = 0), γ · i∞ = i∞, so F and its translates T^n F have their cusp at i∞ and never reach the real axis; 04 already says so | Both sentences now except the translates of F, which run up to i∞ |
| 12 | "from c(4) on the combination is not even unique" | wrong, fixed | Derived: dim ρ1 = 1, so every c(n) >= 2 has many decompositions by trading ρ1 copies. What starts at c(4) is non-uniqueness among small-multiplicity decompositions; both displayed sums equal 20 245 856 256 (checked) | "in many ways once ρ1 is allowed to pad the sum. Even the decompositions with small multiplicities stop being unique at c(4)" |
| 13 | Subtitle: "dimensions are the coefficients of j" | wrong, fixed | dim V♮_0 = 0 while j has constant term 744; the graded dimension is J = j - 744 (13's own body and code) | Subtitle and index card 13 now say J = j - 744 (the card had dim V_n♮ = c(n), false at n = 0) |
| 06 | 691 in the denominator of "almost every later" coefficient of E12 | wrong, fixed | Derived: 691 divides σ11(n) whenever a prime p ≡ -1 mod 691 divides n exactly once (x^11 = -1 has only x = -1 mod 691 since gcd(11, 690) = 1), and almost every n has such a factor, so the exceptions have density 1. Computed: first exception 1381, then 2762, 4143, 5524, 5527; share 0.09% up to 10^4, 0.14% up to 2·10^5 | "every later one up to n = 1380", exceptions rare early (about 1 in 700 up to 200 000) but asymptotically almost all n |
| 14 | Subtitle: "defining identity is a product formula for j"; index card and PROMPT: "denominator identity is the product formula for j" | wrong, fixed | 14's body: the Koike-Norton-Zagier product is for j(p) - j(q), and Borcherds matched it to the denominator identity of the Monster Lie algebra | Subtitle, index card 14 and PROMPT Part 14 now say "denominator identity is the product formula for j(p) − j(q)" |
