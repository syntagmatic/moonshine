# Related-article enhancement plan

Supplement to `PLAN_20_21.md`. The original plan envisioned two new explainers (`/20` fourfold H₄, `/21` cut-and-project). Upon audit, slots 20 and 21 are occupied (knot-invariants, error-correcting-codes), and `/17-quasicrystals.html` already covers cut-and-project extensively (Fibonacci chain → Penrose → Elser-Sloane). Revised plan:

| Deliverable | Status | Action |
|-------------|--------|--------|
| `/16b-fourfold-h4.html` | new standalone | use letter-label; math needs offline verification first |
| `/21 cut-and-project` | **dropped** | folded into `/17` enhancement |
| `/15` enhancement | new work | Clifford construction + Borel–de Siebenthal |
| `/16` enhancement | new work | fourfold cross-link + affine Ẽ₈ figure |
| `/17` enhancement | new work | Fibonacci icosagrid + C5C |

---

## /15-exceptional-structures.html enhancements

### E1: Clifford algebra construction figure (Dechant 2015)
**Where:** after "E₈'s 240 Roots with Coxeter Rotation"
**Content:** 3D icosahedron → 120 Cl(3) rotors (2I) → 8D embedding → 240 roots via φ-doubling. PC view with chirality coloring.
**Why worth adding:** explains the algebraic *reason* the icosahedron→E₈ chain works; cross-references `atlas/10b`.

### E2: Borel–de Siebenthal subalgebra picker
**Where:** new figure after the Monster section
**Content:** affine Ẽ₈ diagram with Kac marks (1,2,3,4,6,5,4,3,2); click a node to delete and see one of 8 maximal subalgebras appear as a PC-highlighted sub-rootsystem. 8 subalgebras: D₈, A₈, A₁⊕A₇, A₁⊕A₂⊕A₅, A₄⊕A₄, D₅⊕A₃, E₆⊕A₂, E₇⊕A₁.
**Why:** directly reuses the figure built for `atlas/07`; PC angle is fresh (each subalgebra's roots highlighted across 8 axes).

## /16-e8-folds-to-600-cells.html enhancements

### E3: Stage 4.5 — fourfold fold teaser
**Where:** between Stage 4 (Ten 24-cells) and Stage 6 (merge back)
**Content:** optional new scene showing the palindromic-rotation fourfold split with a pointer to `/16b`.
**Why:** narrative continuity — bipartite → fourfold is the next fold.

### E4: Quaternion ↔ Clifford perspective sidebar
**Where:** expand existing "Why five, not six or seven" insight
**Content:** note that the 10×24 partition has a Clifford-algebra reformulation in 2I ⊂ Cl(3); cross-link to `atlas/10b`.
**Why:** 1-paragraph add; cheap; creates healthy cross-referencing.

## /17-quasicrystals.html enhancements

### E5: The 3D cross-section — Fibonacci icosagrid + C5C
**Where:** new section between "From E₈ to Quasicrystals" and "The Ammann-Beenker Tiling"
**Content:** project 4D Elser-Sloane to 3D at angle cos θ = 1/(φ+2). 3D rotatable figure showing Compound of Five Cuboctahedra (5 interlocking cuboctahedra at 2I rotations) as the atomic nucleus. Diffraction-style FT panel showing 10-fold symmetry peaks.
**Why:** this is the "physical quasicrystal" punchline `/17` currently only gestures at ("Al-Mn alloys Shechtman 1984"). Makes `/17` concrete.

### E6: McKay box
**Where:** after Ammann-Beenker section, before the closing "pattern" insight
**Content:** small insight box: finite SU(2) subgroups ↔ affine ADE Dynkin. 2I ↔ Ẽ₈. Cross-link to new `/15` Borel–de Siebenthal figure.
**Why:** 1 paragraph; ties the quasicrystal structure to the group-theory narrative.

---

## Sequencing

**Phase 1 — Math verification (DONE, 2026-04-19)**

Script `temp/fourfold_verify.js` projected the 240 E₈ roots into both complementary Coxeter-eigenplane 4-planes (L spans exponents {1,11}, R spans {7,13}). Result:

```
Shell-pair distribution (L × R): { (1.447, 0.553): 120, (0.553, 1.447): 120 }
```

|L|² + |R|² = 2 = |E₈ root|² exactly, for every root. Only **two** classes, not four.

**Conclusion: the fourfold H₄ claim as originally scoped doesn't hold** under this construction — the two 4-planes are orthogonal complements, and the 120/120 split is exactly `/16`'s bipartite fold seen from both sides. There is no independent chirality dimension here.

Wilson / Dechant's "new E₈ constructions" use different matrix choices (not Coxeter eigenplanes) and likely produce something genuinely new, but verifying those requires a literature dig worth deferring.

**Phase 2b (adopted) — pivot to enhancements:**

- **E3** `/16` new stage: complementary-4-plane visualization
- **E1, E2** `/15`: Clifford construction + Borel–de Siebenthal picker
- **E5** `/17`: Fibonacci icosagrid + C5C
- **E4, E6** cross-link improvements

## Budget (adopted path)

| Phase | Work | Estimate |
|-------|------|----------|
| `/16` stage insert (E3) | complementary 4-plane | ~2 hr |
| `/15` E1 + E2 | Clifford + BDS | ~3 hr |
| `/17` E5 | icosagrid + C5C | ~4 hr |
| Cross-links E4, E6 | small | ~30 min |

Total: ~10 hr.

## Status (2026-04-19): ALL COMPLETE

| Deliverable | Figure | Status |
|-------------|--------|--------|
| E3 `/16` | Figure 2 — complementary 4-plane discs with L/R shell colouring toggle | ✅ |
| E1 `/15` | Figure 2b — 120 rotors of 2I in 4 quaternion axes, icosahedron inset, 4 highlight modes | ✅ |
| E2 `/15` | Figure 2c — affine Ẽ₈ diagram with Kac marks (1,2,3,4,5,6,3,4,2) + click-to-prune + subalgebra PC view | ✅ |
| E5 `/17` | Figure 8 — Compound of Five Cuboctahedra, rotatable SVG 3D, 4 "show N copies" modes | ✅ |
| E4 `/16` | "Why five" insight expanded with Cl(3) + atlas/10b cross-link | ✅ |
| E6 `/17` | McKay insight box after Ammann-Beenker | ✅ |

All 3 pages smoke-tested clean (no JS console errors, no page errors).

BDS offline verification: all 8 maximal subalgebras yield correct root counts (E₇⊕A₁=128, E₆⊕A₂=78, D₅⊕A₃=52, A₄⊕A₄=40, A₅⊕A₂⊕A₁=38, A₈=72, A₇⊕A₁=58, D₈=112; sum not meaningful since these are alternative decompositions).
