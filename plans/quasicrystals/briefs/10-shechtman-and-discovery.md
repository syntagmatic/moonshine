# 10 - Shechtman and the discovery

## Pitch

Tell the story. On 8 April 1982, at the National Bureau of Standards, Dan Shechtman pointed an electron beam at a rapidly-cooled aluminum-manganese alloy and got a diffraction pattern with ten distinct bright spots arranged in a perfect decagon — ten-fold symmetry, equivalent to five-fold under inversion. Five-fold long-range order in a solid was, by the crystallographic restriction theorem of essay 7, supposed to be impossible. Shechtman wrote in his lab notebook: "10 Fold ???". The notation is preserved.

Two years of rejection followed. Co-authors withdrew. Linus Pauling, twice a Nobel laureate and the most decorated American chemist alive, declared "There are no quasicrystals, only quasi-scientists." The mainstream interpretation was multiple-twinning — five conventional crystal grains arranged with rotational alignment to mimic the symmetry. Shechtman ruled this out by careful tilt-series electron diffraction, but the paper was rejected by *Journal of Applied Physics* before being accepted by *Physical Review Letters* in October 1984 (Shechtman, Blech, Gratias, Cahn). Within months, Levine and Steinhardt provided the cut-and-project model essays 1–9 have been building.

The 2011 Nobel Prize in Chemistry came to Shechtman alone. Two further notes the essay should make. First, in 2009 Bindi, Steinhardt, and collaborators identified a *naturally occurring* quasicrystal in a meteorite fragment from Khatyrka, Russia — long-range icosahedral order produced by no laboratory. The mineral was named *icosahedrite*. Second, the term "quasicrystal" was coined by Levine and Steinhardt in their model paper; Shechtman's original term was "icosahedral phase." The community standard now is to use "quasicrystal" for the diffraction-positive object and "quasiperiodic tiling" for the underlying mathematical tiling — a distinction that essay 11 will return to.

## Math basis

The H₃ quasicrystal's predicted diffraction pattern (essay 9, `diffraction(h3Quasicrystal())`) reproduces Shechtman's observed pattern: 5-fold, 3-fold, 2-fold rotational symmetry; Bragg peaks at irrational positions on each axis; intensity decay with reciprocal-space radius governed by the 600-cell window FT. The cut-and-project derivation is what supplies the falsifiable predictions: peak positions, intensity ratios, and the phason mode.

## Figures

1. **Shechtman's notebook** (static): scan or careful redraw of the lab notebook page with "10 Fold ???"; date "8 April 1982" visible. Public-domain image; cite the source.
2. **The diffraction plate** (static): Shechtman's 1984 PRL Figure 1 alongside the predicted H₃-quasicrystal pattern from `diffraction(h3Quasicrystal())`. Side-by-side. The reader sees agreement.
3. **Multiple-twinning vs. quasicrystal** (interactive): two attempts to produce 10-fold diffraction. Multiple-twinning: five conventional crystals oriented at 72° around a common axis. Quasi: a single 3D vertex set with H₃ symmetry. The reader can rotate each and see that twinning produces split peaks that quasi does not, which is what Shechtman's tilt-series ruled out.
4. **Timeline** (static): 1982 observation; 1984 PRL; 1984 Levine–Steinhardt cut-and-project model; 2009 Khatyrka meteorite; 2011 Nobel Prize. Annotated with Pauling's quote.
5. **Natural quasicrystal** (static): the icosahedrite mineral cross-section from the 2009 *Science* paper; the meteorite specimen.

## Key terms

- `electron diffraction`: the experimental technique Shechtman used; produces a diffraction pattern from a thin sample illuminated by an electron beam.
- `multiple-twinning`: the conventional explanation Shechtman ruled out — multiple crystals stacked with rotational alignment.
- `icosahedrite`: the 2009-named natural quasicrystal mineral; aluminum-copper-iron, long-range icosahedral order, origin in the Khatyrka meteorite.
- `quasicrystal`: the diffraction-positive object; coined Levine & Steinhardt 1984.

## Misreadings to avoid

- Do not present Shechtman's discovery as "obvious in retrospect." The community resistance was real; the multiple-twinning hypothesis was not unreasonable a priori; ruling it out required careful tilt-series work.
- Do not say Pauling was simply wrong. He was wrong, but the sociological point matters: a Nobel laureate publicly opposing a result delays acceptance, and that is part of why the 2011 Nobel matters as institutional acknowledgement.
- Do not skip the Khatyrka discovery. "Quasicrystals are an artifact of rapid cooling" was a real concern; the natural-quasicrystal finding settled it.
- Do not conflate Shechtman's "icosahedral phase" terminology with the later mathematical "quasicrystal." The math object came after the experiment, partly to explain it.

## Library substrate

- `diffraction(h3Quasicrystal())` reproduces the predicted pattern; figure 2's right-hand side is `diffraction-lab.ts` configured with the H₃ scheme.
- `apps/gallery/src/interactives/diffraction-lab.ts` for the live comparison.

## Bridge notes

Essays 7–9 supplied the math; this essay supplies the experimental confirmation and the historical context. Essay 11 returns to the definitions question — which definitions does Shechtman's pattern actually pick out? — and shows the four candidate definitions of "quasicrystal" diverge in important cases.

## Reader takeaway

In 1982, Dan Shechtman observed long-range icosahedral order in an aluminum-manganese alloy. The community spent two years rejecting it before *Physical Review Letters* accepted the paper in 1984. Levine and Steinhardt's cut-and-project model arrived in the same year, supplying falsifiable predictions. A natural quasicrystal was found in a meteorite in 2009; Shechtman received the 2011 Nobel. The math of essays 1–9 is what made the observation interpretable.
