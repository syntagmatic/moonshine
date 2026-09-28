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

### 04 (enrichment, 2026-09-27)

All numbers are computed in the page over ℝ (inline signed coboundaries, Gaussian elimination with partial pivoting); the ℤ/2 comparison uses TDA.homology.betti. Re-derived in node on the same complexes and read back from the page headlessly.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 04 | Old "Suggest loop" equator loop and clicked loops integrated to 0 on df presets | wrong, fixed | The old loop took every other equatorial vertex, so consecutive vertices were often not adjacent; COH.deRham.integrate counts a non-edge as 0, and df_z read −0.642. Equator is now the boundary of the northern hemisphere of faces (a real edge loop), clicks are joined by shortest edge paths, and a dashed shortest path closes the loop | Exact presets now read 0.000 on equator, pole-link and off-axis loops; dθ reads 2π, 2π, 0 |
| 04 | Figure 2: ∮ over the cap boundary equals Σ dω over the cap for every cap; dθ steps to 2π at the north pole-jump triangle, stays there, and returns to 0 at the south one; every line ends at 0 | checked | Boundary found afresh per cap by cancelling opposite directed edges; node run over all 320 caps agrees with the running face sum to 3e-15 (dθ steps up at cap 5 and back at cap 315); Σ dω over all 320 faces = 4e-16 | none |
| 04 | Figure 3 annulus (annulus(5, 10): 15 V, 30 E, 15 F), ω = dθ + dg: max abs(dω) 2e-16; BFS tree from vertex 0 has 14 edges; of 16 other edges 13 agree with df and 3 are off by exactly 2π; leftover around the inner ring = 2π | checked | Each annulus triangle misses the origin, so wrapped angle differences sum to 0 around it; a fundamental cycle winds 0 or ±1 times, giving leftover 0 or 2π along the arrow | none |
| 04 | Figure 3 sphere (annulus coned at both ends: 17 V, 45 E, 30 F, χ = 2): random cochain projected onto ker δ¹ is closed (max abs(dω) 8e-16) and all 29 non-tree edges agree with df | checked | Projection ω = r − δ¹ᵀy with δ¹δ¹ᵀy = δ¹r; H¹(S²; ℝ) = 0 so closed = exact; tried two seeds and roots 0, centre | none |
| 04 | Figure 5 ranks over ℝ: tetrahedron (4, 6, 4) ranks 3, 3; icosahedron (12, 30, 20) 11, 19; icosphere 1 (42, 120, 80) 41, 79; icosphere 2 (162, 480, 320) 161, 319; all H* = (1, 0, 1). Annulus (15, 30, 15) → (1, 1, 0); torus7 → (1, 2, 1); RP² (6, 15, 10) → (1, 0, 0); Klein (9, 27, 18) → (1, 1, 0) | checked | node run of the same elimination; ℤ/2 column: RP² (1, 1, 1), Klein (1, 2, 1), others equal to ℝ | none |
| 04 | Over ℝ, RP² and the Klein bottle have H² = 0 because they are non-orientable, and RP² has H¹ = 0 | standard | H₁(RP²; ℤ) = ℤ/2, H₁(K; ℤ) = ℤ ⊕ ℤ/2, H₂ = 0 for both; universal coefficients over ℝ | none |

### 03 (enrichment, 2026-09-27)

All numbers are computed in the page with COH over ℤ/2 (cohomology.ring, cup.table, cup.product, cup._expressInBasis, coboundary.apply/matrix) on the lib's own triangulations, re-derived in node, and read back from the page headlessly.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 03 | Cup tables: RP² α² = γ (3 of 10 triangles); T² α² = 0 (0 of 14), αβ = βα = γ (1), β² = 0 (2); Klein α² = 0, αβ = γ, β² = γ (3 of 18); wedge all four H¹ products 0 (0 of 4); S² 1 ⌣ γ = γ | checked | COH.cup.table in node and the page's table; H² coefficient agrees with triangle-count parity in every case | none |
| 03 | On a closed connected surface over ℤ/2, a 2-cochain is a coboundary iff it is 1 on an even number of triangles | standard | δ(edge) = the two triangles containing it, so im δ¹ ⊆ even cochains; H² = ℤ/2 makes im δ¹ codimension 1, so equality | none |
| 03 | Figure 2 (torus7, lib basis α, β): with f on {0, 2}, α′ = α + δf has 8 edges, α′ ⌣ β is 1 on 3 triangles, α ⌣ β on 1, they differ on 4 = supp δ(f ⌣ β), class γ | checked | node: exhaustive over all 1- and 2-vertex f, the changed set equals δ(f ⌣ β) every time (f ⌣ β[v0,v1] = f(v0)β[v0,v1]) | none |
| 03 | Squaring H¹ → H² is linear over ℤ/2; zero on T², nonzero on the Klein bottle, so the rings differ though Betti numbers are (1, 2, 1) for both | checked | (x+y)² = x² + xy + yx + y² and xy = yx in cohomology over ℤ/2; page squares every class on the summed cocycle and checks against xᵀGx | none |
| 03 | Cup pairing G has full rank on closed surfaces (T², K: 2; RP²: 1) and is 0 on S¹ ∨ S¹ ∨ S² | checked | Poincaré duality over ℤ/2 for closed manifolds; ranks computed by Gaussian elimination in the page | none |
| 03 | Reversing the vertex order turns the Alexander–Whitney cochain α ⌣ β into β ⌣ α (original order); the two differ by δc | checked | reversed σ = [v2, v1, v0]: front [v2, v1], back [v1, v0], value α[v1v2]β[v0v1] = (β ⌣ α)(σ). Page: reverse differs from identity on 2 triangles, c = {13, 14, 24} solves δc = difference; shuffles and swaps checked the same way | none |
| 03 | H*(OP²; ℤ) = ℤ[α]/(α³), \|α\| = 8, OP² = F₄/Spin(9) of real dimension 16 | standard | Borel; standard | none |

### 02 (enrichment, 2026-09-27)

All numbers are computed in the page from the lib's triangulations (COH.tri torus7, klein, rp2, s2): ℤ/2 ranks via TDA.homology.gaussianElimZ2 and COH.cohomology/coboundary; integer invariant factors by an inline Smith normal form on signed coboundaries. Checked in node and headless Chromium.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 02 | Figure 1: for any vertex function f every triangle meets δf in 0 or 2 edges (so δδf = 0); f = {0} gives 6 edges, 6 triangles with count 2; f = {1, 3} gives 10 edges, 10 triangles with 2 and 4 with 0; f constant gives δf = 0 | checked | A triangle's three vertices split into f = 1 and f = 0 as 3/0, 2/1 or 1/2, crossing 0 or 2 edges; counts read in headless run | none |
| 02 | Mod-2 ranks: torus δ₀ 6, δ₁ 13 of 21 columns (8 free); Klein 8, 17 of 27; ℝP² 5, 9 of 15; S² 3, 3 of 6; Betti (1,2,1), (1,2,1), (1,1,1), (1,0,1) | checked | node + page; agrees with tests/cohomology.html | none |
| 02 | Old surface drawings (torus as hexagon + centre with all 21 edges as chords, Klein as 9 interior points) did not show the triangulations | wrong, fixed | torus now a 7-rhombus strip with label a + 3b mod 7; Klein the 4×4 grid with lib gluing; ℝP² the hemi-icosahedron star; every drawn triangle/edge mapped back to a lib index (all 14/18/10/4 triangles and 21/27/15/6 edges covered) | redrawn |
| 02 | Every edge of each of the four surfaces lies in exactly two triangles, so coboundaries are even on triangles and one triangle is a nonexact 2-cocycle; parity agrees with COH.coboundary.isExact | checked | computed per edge in the page; isExact verified on the default and after edge moves | none |
| 02 | Smith normal form over ℤ: δ₀ diagonal all 1 (rank n₀ − 1); δ₁ torus 13 ones, S² 3 ones, ℝP² 9 ones + one 2 (full rank 10), Klein 17 ones + one 2 (full rank 18). So H*(ℤ): S² (ℤ,0,ℤ), ℝP² (ℤ,0,ℤ/2), T² (ℤ,ℤ²,ℤ), K (ℤ,ℤ,ℤ/2); over ℚ and ℤ/3: ℝP² (1,0,0), K (1,1,0) | checked | inline SNF, δδ = 0 over ℤ verified; matches standard values (Hatcher §3.1) | none |
| 02 | The Klein bottle's second ℤ/2 in H¹(K; ℤ/2) comes from torsion in H₁(K; ℤ) = ℤ ⊕ ℤ/2 (UCT: Hom(H₁, ℤ/2) = (ℤ/2)²) | standard | universal coefficient theorem | none |
