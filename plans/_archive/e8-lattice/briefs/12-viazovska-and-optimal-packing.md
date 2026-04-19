# 12 — Viazovska and Optimal Sphere Packing in 8D

## Pitch

Sphere packing and kissing are different questions: kissing asks how many spheres can touch a central one, packing asks how much of all space can be filled with equal non-overlapping spheres. In 8 dimensions, E8's packing density is `π⁴ / 384 ≈ 0.2537`, and in 2016 Maryna Viazovska proved this is the maximum possible density — a landmark result that had been open for decades and was still open when the parallel kissing-number problem was settled in 1979. Her proof uses modular forms to construct a "magic function" that, when plugged into a Cohn–Elkies-style linear programming bound, pinches the upper and lower bounds together at exactly `π⁴ / 384`. This explainer describes the structure of the proof without pretending to derive it, acknowledges the mathematical density of the tools involved, and points the reader at the real paper if they want to go deeper.

## Figures

1. **Packing vs kissing, side by side.** Two panels: the 240-sphere kissing configuration around one central sphere (local question) and a portion of the E8 lattice packing (global question). The reader sees they are different optimization targets on the same geometric object. SVG + canvas.
2. **Computing E₈'s packing density from scratch.** A five-step derivation rendered as a sequence of KaTeX cards the reader can step through:
   1. Unit ball volume in 8D: `V₈ = π⁴ / Γ(5) = π⁴ / 24`.
   2. E₈'s minimum vector length is `√2`, so packing balls have radius `r = √2/2 = 1/√2` (so two adjacent lattice points just touch).
   3. Ball volume at radius `r`: `V₈ · r⁸ = (π⁴/24) · (1/√2)⁸ = (π⁴/24) · (1/16) = π⁴/384`.
   4. E₈ is unimodular, so the covolume (volume of the fundamental parallelepiped) equals 1.
   5. Packing density = ball volume / covolume = `π⁴/384 ≈ 0.25367`.
   
   The whole derivation is elementary arithmetic; the reader verifies every step. This is the single cleanest "show, then claim" moment in the series: we compute a *lower bound* of `π⁴/384`, and then spend the rest of the explainer on the 37-year saga of proving it's also an *upper bound*. SVG with KaTeX.
3. **The Cohn–Elkies bound.** State the 2003 Cohn–Elkies linear programming bound for sphere packing: if `f : ℝⁿ → ℝ` is Schwartz with `f(0) = f̂(0)`, `f(x) ≤ 0` for `|x| ≥ r`, and `f̂ ≥ 0`, then the packing density is at most a specific expression. Before 2016, the best known bounds for dimension 8 were close but did not meet the E8 lower bound. SVG.
4. **The bound gap visualized.** Line chart: Cohn–Elkies upper bound and E8 lower bound in dimension 8, across years. Pre-2016 they are close but separated; in 2016 they meet. Annotate with the Viazovska paper. SVG.
5. **Viazovska's magic function.** Describe (not derive) the construction: a function whose Fourier transform has prescribed vanishing behavior on the E8 lattice, built from modular forms of weight 8 and weight 12. Show its graph. Caveat clearly: *this is an outline, not a proof*. SVG.
6. **Modular form connection.** The theta series of E_8 (from explainer #10) is a modular form of weight 4. Viazovska's magic function leverages other modular forms of weights 8 and 12. Sketch the web of connections. SVG with KaTeX.
7. **Historical capstone figure.** Timeline: Minkowski (1905) formulates lattice packing, Blichfeldt (1929) improves bounds, Cohn–Elkies (2003) introduces LP bounds, Viazovska (2016) closes the 8D case, Cohn–Kumar–Miller–Radchenko–Viazovska (2016, two weeks later) close the 24D case. Static.

## Key formulas / constructions

- Packing density of `E_8`: `π⁴ / 384 ≈ 0.25367`.
- Derivation (all five steps, shown in figure 2):
  - `V_8 = π⁴ / 24` (unit 8-ball volume via `π^{n/2}/Γ(n/2+1)`, with `Γ(5) = 4! = 24`).
  - Minimum vector length `= √2`, packing radius `r = 1/√2`.
  - Ball volume at radius `r` is `V_8 · r⁸ = π⁴/24 · 1/16 = π⁴/384`.
  - Covolume `= 1` because `E_8` is unimodular (dual lattice equals the lattice).
  - Density `= ball volume / covolume = π⁴/384`.
- Cohn–Elkies bound: `density ≤ (π^{n/2} / Γ(n/2 + 1)) · f(0) / (f̂(0) · r^n · 2^n)` for admissible `f`, where `r` is the minimum distance.
- Viazovska's function is constructed by solving a specific interpolation problem using modular forms of weights 8 and 12 in the Maass space.

## Dependencies

- #10 (lattice, shell structure, unimodularity hinted, theta series).
- #11 (LP bound setup for kissing — provides the machinery the reader needs to understand the Cohn–Elkies analog).
- Lib: `E8.lattice.packingDensity()` (returns `π⁴ / 384`), `E8.lattice.isUnimodular()`.
- **No actual modular form machinery in the lib.** The modular-form content is narrative; we do not compute modular forms in the explainer.

## Reader takeaway

The reader knows that `E_8` achieves the densest sphere packing in 8 dimensions, what the density number is, and that the proof is due to Viazovska in 2016. They understand the structure of the proof at the level of "LP bound + magic function from modular forms," know that the proof genuinely required new ideas (not just computation), and know that a nearly identical argument works for the Leech lattice in 24D two weeks after Viazovska's first paper. They leave with cultural fluency about one of the biggest theorems in discrete geometry of the last 50 years, honestly told without faked rigor.
