# 02 - Cut-and-project

## Pitch

Generalize the Fibonacci recipe to arbitrary dimension. A cut-and-project scheme is four objects: a lattice Λ in some ambient ℝ^N; an orthogonal split of ℝ^N into a physical subspace E_∥ (dimension d_∥) and an internal subspace E_⊥ (dimension N − d_∥); a bounded acceptance window W ⊂ E_⊥. The model set Λ★ is the projection π_∥(p) of every lattice point whose internal projection π_⊥(p) lies in W. Fibonacci is the (N=2, d_∥=1) instance; everything else in the series is this same machine at higher N.

Two structural points lock here. First, why the internal gate is load-bearing. For any cut-and-project scheme, π_⊥(Λ) is dense in E_⊥ — there are lattice points with arbitrarily small physical projection but unbounded internal projection. Pruning by physical radius alone never terminates. The window's job is not aesthetic; it is what makes the model set well-defined as a Delone set. Second, why ambient dimension matters. The available *physical* symmetries are exactly the subgroups of Λ's automorphism group that preserve the orthogonal split. Penrose's 5-fold and the icosahedral 3-fold, 5-fold, 2-fold axes are unavailable to any periodic ℤ³ lattice; they appear here because the ambient ℤ⁵ and ℤ⁸ supply them.

## Math basis

Squishy-thing represents the scheme as `CutAndProjectScheme { ambientDim, physicalDim, internalDim, latticeBasis, piPhysical, piInternal, window, offset }`. `project(scheme, bounds)` is a breadth-first walker on the lattice with both physical and internal gates active; the BFS uses ±basis-vector neighbours rather than 240-root neighbours, which keeps the visited-set bound tractable. Window variants are a discriminated union: `ball`, `interval`, `sixHundredCell`, `convexHull`, `product`. Different window shapes drive different symmetry tests downstream.

## Figures

1. **Anatomy, generalized** (static): the four-part object diagram from essay 1, redrawn with N as a parameter. The same warm/cool palette.
2. **Density of internal projections** (interactive): for a chosen scheme, draw the internal projections of all lattice points within physical radius R. Increase R; watch π_⊥(Λ) fill E_⊥ densely. Forces the load-bearing point about the internal gate.
3. **Two-gate pruning** (interactive comparison): a small (N=3, d_∥=1) example. Three side-by-side BFS runs: physical-only (never terminates, accumulates near origin), internal-only (misses the right region), both-active (correct termination). The reader watches each BFS expand.
4. **The canonical schemes** (static, table): Fibonacci (N=2 → 1), Penrose-classical (5 → 2), Penrose-from-E8 (8 → 2), H₃ quasicrystal (8 → 3), Elser–Sloane (8 → 4). Columns: ambient dim, physical dim, window shape, symmetry of physical projection.

## Key terms

- `ambient dimension N`: dimension of ℝ^N where the lattice lives.
- `physical / internal subspace`: the two halves of the orthogonal split, dimensions d_∥ and N − d_∥.
- `BFS enumerator`: lattice walk with both physical-radius and internal-norm gates.
- `Delone set`: uniformly discrete and relatively dense; what the model set is once the window is bounded.

## Misreadings to avoid

- Do not claim cut-and-project is the only definition of "quasicrystal." Substitution rules and matching rules are equivalent under conditions, not unconditionally; essay 11 returns to this.
- Do not conflate the physical projection π_∥ (a linear map) with the physical subspace E_∥ (its image). Squishy-thing's API distinguishes them; the typed split is load-bearing.
- Do not present density of π_⊥(Λ) as a defect. It is the property that makes the model set rich; without it, only finitely many internal projections exist and the window collapses to a finite check.

## Library substrate

- `CutAndProjectScheme` type, `Window` discriminated union, `project(scheme, bounds)` in `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts`.
- Test invariant #1 in `cut-and-project.test.ts`: physical vertex count scales as O(R^d_∥) for physical ball of radius R.
- `apps/gallery/src/interactives/cut-and-project.ts` — the schematic interactive, available for figure 1 embed.

## Bridge notes

Essay 3 examines the ℤ[φ] arithmetic that the canonical schemes need. Essay 4 instantiates the recipe at (N=8, d_∥=2) for Penrose. Essays 7–8 take the recipe to (N=8, d_∥=3) and (N=8, d_∥=4) — H₃ and Elser–Sloane. The two-gate point reappears in essay 11 when substitution-rule tilings *don't* arise from a cut-and-project scheme.

## Reader takeaway

Cut-and-project is one recipe parametrized by ambient dimension. Both gates — physical radius and internal norm — are load-bearing because internal projections of lattice points are dense in the internal subspace. The available physical symmetries are exactly those that survive the orthogonal split; this is why higher ambient dimension buys non-crystallographic symmetry.
