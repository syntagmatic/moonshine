# 10 — From Root System to Lattice: the D₈⁺ Construction

## Pitch

Up to this point the series has treated E8 as a finite set of 240 vectors. But the *lattice* E8 is the integer span of those vectors — an infinite discrete subgroup of ℝ⁸, a very different object. The root system is a subset of it (the 240 vectors of minimal nonzero squared length), but the lattice also contains vectors of squared length 4, 6, 8, and so on, in counts that form one of the most famous sequences in number theory (1, 240, 2160, 6720, 17520, …). This explainer makes the transition from finite to infinite explicit, introduces the elegant D₈⁺ construction that describes the E8 lattice as a simple coset union, and sets up the shell structure and theta series that the packing explainers need.

## Figures

1. **Finite vs infinite.** Side-by-side: the 240 roots as a bounded set, and a tiny neighborhood of the E8 lattice (say, all vectors of squared length ≤ 4) as a much larger set. Both projected to 2D via the Coxeter plane. SVG.
2. **The D₈⁺ construction.** `E_8 = D_8 ∪ (D_8 + (½,½,½,½,½,½,½,½))`. Show D_8 and its shifted copy as two separate point clouds in parallel coordinates, then unioned. SVG.
3. **Equivalence of descriptions.** Interactive: take any vector in the root-system form and express it in the D₈⁺ form; and vice versa. The reader can type in a vector or click one, and see both representations. SVG + DOM form.
4. **Lattice shells.** Bar chart: squared length `k` (for `k = 0, 2, 4, 6, 8, 10, 12, 14, 16`) vs the number of lattice vectors of that squared length. Values: 1, 240, 2160, 6720, 17520, 30240, 60480, 82560, 140400. SVG.
5. **Shell explorer.** Pick `k` with a slider; see all vectors of squared length `k` in a Coxeter-plane projection. The rings for `k > 2` form richer patterns than the minimal shell. SVG + canvas.
6. **Theta series as a sticky note.** Display `Θ_{E_8}(q) = 1 + 240 q² + 2160 q⁴ + …` and note (without proof) that this is a modular form of weight 4. Static SVG with KaTeX.

## Key formulas / constructions

- Lattice E_8 defined two ways:
  1. **Root-span form:** `E_8 = ℤ[α₁, …, α₈]` (the integer span of the simple roots, equivalently the integer span of all 240 roots).
  2. **D₈⁺ form:** `E_8 = { x ∈ ℤ⁸ ∪ (ℤ + ½)⁸ : Σᵢ xᵢ ∈ 2ℤ }`, equivalently `D_8 ∪ (D_8 + (½,…,½))`.
- Shell counts: 240, 2160, 6720, 17520, 30240, 60480, 82560, 140400, … (the first several coefficients of the theta series minus the constant term).
- Theta series: `Θ_{E_8}(q) = Σ_{v ∈ E_8} q^{⟨v,v⟩}` = `1 + 240q² + 2160q⁴ + ⋯`.
- The theta series equals `E_4(τ)`, the weight-4 Eisenstein series, where `q = e^{2πiτ}`. Stated, not proven.
- E_8 is *unimodular*: its dual lattice equals itself, which makes the theta series a modular form.

## Dependencies

- #03 (240 roots as the shell at squared length 2).
- #02 (D_n construction; D_8 is the 112-root part).
- Lib: `E8.lattice.generate(maxSquaredLength)`, `E8.lattice.shell(k)`, `E8.lattice.inD8PlusForm(v)`, `E8.lattice.isLatticeVector(v)`.

## Reader takeaway

The reader knows that the root system is the minimal shell of the lattice, not the lattice itself. They can write the E8 lattice in two different ways (root-span and D₈⁺) and convert between them. They have seen the first few lattice shells and understand that a lattice is an infinite family of shells whose shell counts form a structured sequence. They are primed to believe (though not yet prove) that this structured sequence is a modular form — which matters for explainer #12.
