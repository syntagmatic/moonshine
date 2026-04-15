# 01 — What Is an Invariant?

## Pitch

An invariant is a quantity that survives a transformation. Rotate a circle and the radius survives the rotation; permute the coordinates of a sum and the sum survives the permutation. This explainer fixes three ideas the whole series depends on — *group action*, *orbit*, *invariant function* — using transformations the reader can watch on the page: rotations of the plane, reflections of a square, shuffles of three coordinates. By the end, the reader can look at a transformation and a quantity and decide, by inspection and calculation, whether that quantity is invariant.

## Figures

1. **Rotating the plane.** A circle and a square sit in ℝ². A slider rotates the plane by θ. The circle is unchanged; the square moves. A panel below reports live: "distance from origin: invariant", "x-coordinate: not invariant", "x² + y²: invariant". SVG.
2. **The symmetries of a square.** All 8 elements of D₄ (4 rotations, 4 reflections) laid out as a click-through gallery. Click any to apply; watch the square land on itself. A second panel shows which labeled vertices moved where. SVG.
3. **Orbit and stabilizer under D₄.** Drag a point in the plane; its orbit under D₄ (up to 8 image points) lights up. The stabilizer is displayed as the subgroup fixing that point. Special points (center, corner, midpoint) show smaller orbits and bigger stabilizers. SVG.
4. **Symmetric functions of three variables.** A live workshop: type three numbers `(a, b, c)`, then see a list of candidate quantities — `a + b + c`, `a·b·c`, `a² + b² + c²`, `a − b`, `max(a, b, c)` — each labeled "invariant under S₃" or "not" after a "swap" button permutes the inputs. SVG.
5. **Two senses of invariance.** Side-by-side: "the quantity doesn't change" (distance under rotation) vs. "the object doesn't change" (a circle under rotation). Reinforces that the series will use both senses and that they are not the same. SVG.

## Key formulas / constructions

- Group action: a map `G × X → X`, written `(g, x) ↦ g · x`, with `e · x = x` and `(gh) · x = g · (h · x)`.
- Orbit of `x`: `G · x = {g · x : g ∈ G}`.
- Stabilizer of `x`: `G_x = {g ∈ G : g · x = x}`.
- Orbit–stabilizer (finite `G`): `|G| = |G · x| · |G_x|`.
- Invariant function: `f : X → Y` with `f(g · x) = f(x)` for all `g ∈ G`.
- Examples: distance from origin is invariant under `SO(2)`; elementary symmetric polynomials are invariant under `S_n`.

## Dependencies

- None (first explainer).
- Lib: `NOETHER.groups.D4`, `NOETHER.groups.S3`, `NOETHER.action.orbit(x, group)`, `NOETHER.invariants.check(fn, group, samples)`.

## Reader takeaway

The reader can define a group action, compute an orbit and stabilizer on small examples, and test whether a candidate function is invariant under a group. They have the vocabulary to recognize two senses of invariance (function-invariance and object-invariance) and understand that the rest of the series will be one long amplification of this idea.
