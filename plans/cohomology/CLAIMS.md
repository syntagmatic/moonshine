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

Run the checks in a browser by opening `docs/cohomology/lib/test.html`, or in Node via the harness at `temp/coh-test.js`.

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
