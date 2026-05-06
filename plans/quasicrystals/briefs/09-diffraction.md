# 09 - Diffraction

## Pitch

This is the essay where the math meets the X-ray plate. A periodic crystal's diffraction pattern is a discrete grid of bright spots — Bragg peaks — at the reciprocal lattice positions. A truly random arrangement gives a diffuse haze. A quasicrystal gives the surprise: a *discrete* set of Bragg peaks, but at irrational positions in reciprocal space. Pure-point spectrum, no periodicity. The empirical hallmark.

The cut-and-project derivation makes the structure exact. For a model set Λ★(o) with reciprocal lattice Λ*, every Bragg peak sits at a position k_∥ = π_∥(K) for some K ∈ Λ*, and its complex amplitude is `χ̂_W(k_⊥) · e^{2πi⟨k_⊥, o⟩}` where χ̂_W is the Fourier transform of the acceptance window evaluated at the internal projection k_⊥ = π_⊥(K). Two consequences are load-bearing. First, peak *positions* are exact and depend only on the lattice — not on the window, not on the offset. Second, peak *amplitudes* depend on the window FT and carry an offset-dependent phase. The phason offset rotates phases without moving peaks. Aperiodic order is recoverable from a single diffraction snapshot.

The window FT explains the visual structure of real diffraction patterns. For Fibonacci, the window is an interval and its FT is a sinc envelope: peak intensities decay as 1/|k_⊥|. For the H₃ quasicrystal, the window is a 600-cell and its FT is approximated by a 4D ball Bessel envelope; peak positions are exact (purely a property of L_I*), only the amplitude approximation depends on this envelope. The high-shell peaks in Shechtman's pattern decay accordingly.

## Math basis

For a generic offset o, the diffraction measure of Λ★(o) is pure-point (Hof 1995; Schlottmann 1998). Squishy-thing's `diffraction(scheme, opts)` enumerates the reciprocal lattice via BFS on `(latticeBasis⁻¹)ᵀ` and, for each reciprocal lattice point K, emits a peak at k_∥ = π_∥(K) with amplitude `|χ̂_W(k_⊥)|`. Window FT support: `ball` (dimensions 1–4 with sin-Bessel and J₁/J₂ series), `interval` (sinc), `product` (complex multiplication of factor FTs), `sixHundredCell` as an isotropic ball approximation at the apothem radius.

## Figures

1. **Pure-point spectrum** (interactive, hero): live diffraction pattern of Λ★(o) for a chosen scheme. Reader picks Fibonacci, Penrose, or H₃ and rotates the reciprocal-space view. Bragg peaks sized by |amplitude|.
2. **Periodic vs. random vs. quasi** (static, three-up): three diffraction patterns side by side at the same overall density. Periodic: discrete grid at integer k. Random: diffuse haze. Quasi: discrete peaks at irrational k. The reader sees the three are visually distinct.
3. **Window FT changes amplitudes only** (interactive): live diffraction with a window-shape selector (interval / ball / 600-cell). As the window changes, peak amplitudes shift but peak *positions* stay fixed. The reader can verify by toggling.
4. **Phason phase** (interactive): live diffraction with a phason offset slider. As `o` sweeps, peak amplitudes pick up an `e^{2πi⟨k_⊥, o⟩}` phase factor — visible as colour rotation when amplitudes are rendered as complex numbers. Positions don't move.
5. **Shechtman's pattern, predicted** (static): reproduction of Shechtman's 1984 electron-diffraction image alongside the predicted H₃-quasicrystal pattern from `diffraction(h3Quasicrystal())`. Foreshadows essay 10.

## Key terms

- `Bragg peak`: a delta function in the diffraction measure.
- `pure-point spectrum`: the diffraction measure is supported on a discrete set.
- `reciprocal lattice Λ*`: the dual of Λ; sits in (E_∥ ⊕ E_⊥)*.
- `window Fourier transform χ̂_W`: the analytic shape of the amplitude envelope.

## Misreadings to avoid

- Do not say a Bragg peak's amplitude is "the structure factor at k." It is the window FT evaluated at *the internal projection of K*, not at k_∥ itself. The two coordinates of K play different roles.
- Do not claim peak positions depend on the window. They depend only on the reciprocal lattice and the projection π_∥; the window only modulates amplitudes. This separation is the essay's central point.
- Do not say diffraction is pure-point for every cut-and-project scheme unconditionally. The Hof / Schlottmann theorems require generic offset and window-regularity assumptions.
- Do not present squishy-thing's `sixHundredCell` window FT as exact. It is an isotropic ball approximation; positions are exact, only the amplitude envelope is approximated. Test invariant #3 rides on positions, not amplitudes.

## Library substrate

- `diffraction(scheme, opts)` and `windowFourierTransform(window, k)` in `/Users/kai/git/squishy-thing/packages/e8-core/src/cut-and-project.ts`.
- Test invariant #3 in `cut-and-project.test.ts`: H₃-symmetric peak clustering in `|k_∥|` buckets.
- `apps/gallery/src/interactives/diffraction-lab.ts` — shipped diffraction interactive, embed for figure 1 or 3.

## Bridge notes

Essay 6 introduced the offset; this essay shows how it acts on diffraction (phase rotation, position-invariance). Essay 5's inflation factor enters as a multiplicative structure on the peak set: peaks at φᴺk_∥ for inflated vertex sets. Essay 10 takes Shechtman's 1984 plate as the empirical confirmation.

## Reader takeaway

A quasicrystal's diffraction pattern is pure-point: a discrete set of Bragg peaks at irrational positions in reciprocal space. Peak positions depend only on the reciprocal lattice and projection; peak amplitudes depend on the window FT; the phason offset enters as a phase on each peak. Aperiodic order is recoverable from a single diffraction snapshot — which is exactly what Shechtman saw in 1982.
