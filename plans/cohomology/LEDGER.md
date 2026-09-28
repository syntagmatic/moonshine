# Claims — Cohomology series

One row per essay. Update when you claim, when you finish, when you hand off.

See [`AGENTS.md`](AGENTS.md) for the claim convention. The file-level lock lives in `briefs/` (renamed suffix `.md` → `.claimed.md` → `.done.md`); this file is the readable summary.

## Status

| # | essay | brief | owner | started | finished | LOC | notes |
|---|---|---|---|---|---|---|---|
| 01 | From holes to obstructions | `briefs/01-from-holes-to-obstructions.done.md` | parallel-agent-1 | 2026-05-26 | 2026-05-26 | 624 | done |
| 02 | Singular cohomology on a triangulated torus | `briefs/02-singular-cohomology-torus.done.md` | parallel-agent-2 | 2026-05-26 | 2026-05-26 | 599 | done; caught Klein H¹ error in original brief (see Notes) |
| 03 | The cup product on $\mathbb{RP}^2$ and $T^2$ | `briefs/03-cup-product-rp2-t2.done.md` | parallel-agent-3 | 2026-05-26 | 2026-05-26 | 599 | done |
| 04 | de Rham: differential forms on $S^2$ | `briefs/04-de-rham-sphere.done.md` | parallel-agent-4 | 2026-05-26 | 2026-05-26 | 596 | done |
| 05 | Mayer–Vietoris as a computation engine | `briefs/05-mayer-vietoris.done.md` | parallel-agent-5 | 2026-05-26 | 2026-05-26 | 559 | done |
| 06 | Persistent cohomology and circular coordinates | `briefs/06-persistent-cohomology.done.md` | parallel-agent-6 | 2026-05-26 | 2026-05-26 | 600 | done |

## Library

| component | brief | owner | status |
|---|---|---|---|
| `lib/coh-math.js` API surface (cochains, δ, cup, MV, dual persistence) | spine §lib + each brief's lib-contract | initial scaffold | **built** (v0.1.0, sanity checks green) |
| `lib/test.html` browser sanity-check page | — | initial scaffold | built |

`coh-math.js` ships its frozen API surface in v0.1.0. Sanity checks verify:
- H^*(S^2/T^2/RP^2/Klein/wedge/annulus; Z/2) matches expected Betti numbers
- δ∘δ = 0 on the torus
- α∪α generates H^2(RP^2; Z/2)
- α∪β = 0 on S^1∨S^1∨S^2 (cup ring distinguishes from T^2)
- Klein has at least one H^1 generator with α∪α ≠ 0; torus has α∪α = 0 for both (the bona-fide Klein-vs-torus distinguisher; betti numbers agree)
- d(df) = 0 on the sphere mesh (Stokes-on-a-triangle)

Run the checks in a browser by opening `tests/cohomology.html`, or in Node via the harness at `temp/coh-test.js`.

## Notes for next pass

(Substantive cross-essay observations land here. Typos and phrasing fixes can be made directly on done essays.)

- **2026-05-26 — Brief 02 had Klein H¹ wrong.** The original brief's Betti table claimed $H^1(\text{Klein}; \mathbb{Z}/2) = \mathbb{Z}/2$ (rank 1). Correct value is $(\mathbb{Z}/2)^2$ (rank 2) by UCT — Klein has $H_1(K;\mathbb{Z}) = \mathbb{Z} \oplus \mathbb{Z}/2$, tensoring with $\mathbb{Z}/2$ gives $\mathbb{Z}/2 \oplus \mathbb{Z}/2$, and Tor adds another copy. The lib's sanity check has always returned $(1, 2, 1)$ for Klein; agent 02 caught the discrepancy and the essay states it correctly. Brief patched after the fact. **Pedagogical bonus**: this is exactly the point of essay 03 — torus and Klein have the same $\mathbb{Z}/2$ Betti numbers but different cup product rings.
- **2026-05-26 — Three post-build bugs, patched.**
  - **Essays 02 and 03**: prose used `$…$` inline math but the agents loaded `katex.min.js` only, not the `auto-render` extension. Fixed by adding `<script defer src="…/contrib/auto-render.min.js" onload="renderMathInElement(document.body, …)">` to both file headers (matching essays 01 and 04).
  - **Essay 06 hung the browser on load.** Root cause: the agent ran the Rips filtration on pixel-rescaled coordinates (range ~600 px) with `maxEps = maxD * 0.6 ≈ 360 px`, so the filtration captured nearly C(80,2) edges and O(80³) triangles; the lib's `persistCoh.compute` then ran a gauss-elim cocycle rep computation on every one of ~770 H¹ bars. Fixed by (a) separating raw coords (for Rips/filtration) from pixel coords (for SVG rendering), (b) lowering n to 60 and maxEps to 0.40 of diameter, (c) inlining a `persistenceTopReps(filt, k)` wrapper that calls `TDA.persistence.compute` for bars and only computes reps for the top-K=6 longest H¹ bars. Post-fix wall time: annulus 319ms, figure-8 250ms, linked rings 600ms.
  - **Lib note (not a bug, but caller-facing).** `COH.persistCoh.compute` already says it is "cheap and correct on the typical demo input; for high-volume data, replace with a true dual reduction." The essay-06 case exceeded "typical." Consider adding a `kTop` parameter to the lib's `compute` for a future v0.2.

## Proposed lib additions

(If an essay genuinely needs a shared helper not in `COH`, propose it here with a one-line justification before editing `coh-math.js`. See [`AGENTS.md`](AGENTS.md#the-library-is-frozen).)

- _none yet_

## Proposed spine changes

(If an essay finds the spine wrong or under-specified, propose the change here before editing `README.md`.)

- _none yet_

## Claims: leads from FACT-CHECK.md (2026-09-27)

Only the flagged leads below were checked; this is not a full fact-check of the series.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 04 | df_z preset: "Arrows point upward, vanishing at the equator" | wrong, fixed | On the unit sphere the tangential gradient of z is e_z - z p, of length sqrt(1 - z^2): largest at the equator, zero at the poles | Now "Arrows point toward the north pole, longest at the equator and vanishing at the poles" |
| 06 | Rips H1 class on the annulus fills "at a scale near the hole's diameter" | wrong (imprecise), fixed | Page's ε is the pairwise distance (balls of radius ε/2). For points evenly on a circle of radius r the Rips H1 class dies at ε = sqrt(3) r (chord of 120 degrees; Adamaszek and Adams 2017). Computed Figure 1's seeded annulus (inner radius 0.6, diameter 1.2): long H1 bar is [0.40, 1.11], so a little below the hole's diameter | Now "a little below the hole's diameter", plus one sentence giving sqrt(3) r for a circle |
| 04 | Figure 2: integral "computed as a Riemann sum" that "is not exactly 2π but converges to it as the number of vertices grows" | wrong, fixed | annIntegrate sums wrapped atan2 differences. A straight segment not through the origin subtends less than π, so its wrapped difference is exactly the integral of dθ along it; a closed polyline gives exactly 2πk | Caption says the integral is exact per segment and the result is an exact multiple of 2π for any closed polyline |
| 04 | Latitude preset reads "about zero on loops that stay in one hemisphere and about ±2π on loops that wind around a pole" | wrong, fixed | Ran COH.deRham in node on the page's mesh (sphereMesh(2)): the 6-vertex link of the north pole at z ≈ 0.95 integrates to 2π. The value is 2π times the winding number around the z-axis, not a hemisphere test | Now "2π times the number of times the loop winds around the z-axis", noting a small loop inside one hemisphere still gives ±2π |
| 04 | Latitude dω: "the equatorial band is white and the polar caps light up"; bullet says nonzero "on triangles that wrap a pole" | wrong, fixed | Same node run: dω is nonzero on 2 of 320 faces, +2π on face 110 at the north pole and -2π on face 141 at the south, each the pole-fan triangle straddling θ = ±π (atan2(0,0) = 0 at the pole vertex) | Now "every triangle is white except one at each pole, which reads ±2π", with the reason; bullet says "one triangle at each pole" |
| index, 06 | "compute every number by linear algebra over ℤ/2, or over ℤ/47 in the last essay"; "Essays 02 to 05 worked over ℤ/2" | wrong, fixed | 04 uses real-valued edge values and states H^1(S^2; R), H^1(A; R) (coh-math.js: "de Rham uses R"); 02, 03, 05 are over ℤ/2 | Index names the de Rham essay's real-valued forms as the second exception; 06 now says 02, 03 and 05, with 04 on real-valued forms |
| 04 | d(df) = (∂_y∂_x f - ∂_x∂_y f) dx∧dy | wrong (sign), fixed | d(∂_x f dx + ∂_y f dy) = ∂_y∂_x f dy∧dx + ∂_x∂_y f dx∧dy = (∂_x∂_y f - ∂_y∂_x f) dx∧dy (∂_x∂_y f meaning ∂_x of ∂_y f); still 0 | Terms swapped to the correct order |

### 01 (enrichment, 2026-09-27)

All numbers are computed in the page over ℤ/2 from COH and TDA; the ones below were re-derived in node and read back from the page headlessly.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 01 | Figure 1 default (α on 01 and 02, b both triangles): ⟨δα, b⟩ = ⟨α, ∂b⟩ = 1, three amber cells, column 02 cancels out of ∂b | checked | By hand: δα(012) = 1+1+0 = 0, δα(023) = 1+0+0 = 1; ∂b = 01+12+23+03; ⟨α, ∂b⟩ = α(01) = 1. Page readout agrees, and after toggling b to {012} both read 0 with 2 cells | none |
| 01 | The library's H¹ generator of annulus(8, 16) is three edges cutting the strip once (8-9, 0-9, 0-1), pairing 1 with γ_in and γ_out, and stays 1 under repeated δf | checked | COH.cohomology.compute(annulus, 1).basis[0] in node; page readout after δf at v = 0 and v = 3 still (1, 1) and "nonzero class" | none |
| 01 | Flipping a single edge breaks closedness and the two loop evaluations can disagree | checked | Flipping inner edge 0-1 from the generator: δα = 1 on 1 triangle, ⟨α, γ_in⟩ = 1, ⟨α, γ_out⟩ = 0 | none |
| 01 | Figure 3: BFS tree from vertex 0 leaves 25 of 48 edges; for the generator 3 disagree with δf, the same 3 for generator + δg, 0 for δg; the amber edges are exactly the loops with odd winding | checked | 48 − 23 = 25. Stepped through all 25 left-over edges headlessly in both modes: ⟨α, loop⟩ = 1 exactly for 4-17, 4-5, 16-17 (winding 1), 0 for the other 22 (winding 0). If α' = α + δg then f' = f + g + g(0), so the defect set is class-invariant | none |
| 01 | Figure 4 ranks: annulus 3+6 (9, 18, 9), ranks 8, 9; 8+16 (24, 48, 24), ranks 23, 24; 16+32 (48, 96, 48), ranks 47, 48; all H* = (1, 1, 0). Coned annulus (25, 56, 32), ranks 24, 32, H* = (1, 0, 0) | checked | Gaussian elimination on COH.coboundary.matrix in node, cross-checked against COH.cohomology.compute in the page (readout says "matching") | none |
| 01 | Over a field the pairing between H¹ and H₁ is perfect | standard | Universal coefficients over a field: H¹(X; F) ≅ Hom(H₁(X; F), F) | none |
| 01 | Hairy ball: Euler class of TS² evaluates to 2 on [S²] and would vanish given a nowhere-zero field; homology can prove the theorem via degree of the antipodal map | standard | e(TS²)[S²] = χ(S²) = 2; a nowhere-zero section forces e = 0; antipodal map has degree −1 on S², a nowhere-zero field gives a homotopy to the identity | none |

### 05 (enrichment, 2026-09-27)

All numbers below were computed with COH over ℤ/2 in node on the page's own complexes and checked against the page headlessly.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 05 | Klein bottle, "bands sideways": U ∪ V has β = (1, 3, 0) against the Klein bottle's (1, 2, 1) | checked | COH.mv.cover leaves 6 simplices missing; COH.cohomology on fromMaximal(U ∪ V) gives (1, 3, 0); COH.mv.exactness on that cover is exact | none |
| 05 | Degree 0: coker d₀ has one dimension per independent cycle of the graph (nodes = components of U and V, edges = components of U ∩ V) | checked | d₀ over ℤ/2 is the graph's incidence matrix (each row has a 1 in its U and its V component), rank = nodes − graph components; cokernel = edges − rank = cycle rank. Page shows it equal to the lib's rank of δ* from degree 0 (two annuli: 2 − 1 = 1; star: 1 − 1 = 0) | none |
| 05 | Two annuli on T²: the δ*-born H¹ class counts, mod 2, crossings of one overlap circle | checked | δ*(indicator of one overlap circle) = δ of that indicator extended into U; it is 1 exactly on edges leaving that circle into the U-only band, so it pairs with a loop by its crossing parity | reworded from "crosses from one band to the other" |
| 05 | Star of a vertex on the 4×4 torus: U ∩ V is one hexagon; β(U) = (1, 2, 0), β(V) = (1, 0, 0), β(U∩V) = (1, 1, 0); both H¹ classes come from U | checked | COH on the page's complex; ranks π*₁ = 2, d₁ = 0, δ*₀ = 0 | none |
| 05 | In every preset of Figure 3, H² comes entirely from the overlap | checked | for all five preset rows β₂(U) = β₂(V) = 0 and rank δ*₁ = 1 | none |
| 05 | Octahedron: flipping a spoke [n, eᵢ] flips δη_U on exactly the two northern triangles containing it, so the triangle count keeps its parity and δ*[η] = (sum of η around the equator) · generator | checked | headless run: default count 1; spoke [0,1] → 1; then [0,2] → 3; then equator [2,3] → 2 with class 0 | none |
