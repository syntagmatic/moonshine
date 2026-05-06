# UX Quality Pass

May 2026 pass over `docs/quasicrystals`.

## What changed

- The article renderer now supports multiple figures per article instead of a single hero figure.
- Article 1 gained the two missing load-bearing cut-and-project figures: internal-density buildup and two-gate pruning.
- Article 2 gained a matching-rule checker and five-direction orientational-order comparison. The classical de Bruijn primitive is still not complete.
- Article 1 now distinguishes boundary crossings during slider movement from state differences relative to offset zero, and gained a boundary-distance graph.
- Article 3 gained the periodic-vs-aperiodic five-fold contrast.
- Article 4 gained substitution and Wang-tile local-rule views.
- The public series collapsed from twelve short articles to six, then to four denser articles.
- Added first-pass signature figures for the classical pentagrid Penrose view, Penrose phi-inflation, H3/H4 substrate, finite diffraction oracle, Shechtman twinning comparison, and Hat/Spectre patch exploration.
- Article 4 no longer uses decorative heptagons for Hat/Spectre. It draws actual monotile-family outlines and compact patch diagrams, while still avoiding claims about regular model-set status.
- The dead D3 dependency was removed from the quasicrystal HTML shells.

## Remaining load-bearing gaps

- The pentagrid figure is now a first-pass finite dual construction, but still not a complete production-grade de Bruijn tiler.
- The H3/H4 and diffraction scenes are local standalone oracles, not squishy-thing embeds.
- The Shechtman figure is rights-safe and schematic, not a sourced historical image.
- The Hat/Spectre patch figure uses actual monotile-family outlines in compact local patch diagrams, but not a validated large tiling patch.

## Article-count decision

The shipped series is now four articles:

1. Fibonacci, cut-and-project, and phasons.
2. Penrose projection and inflation.
3. Icosahedral diffraction and discovery.
4. Beyond cut-and-project, Hat/Spectre, and open definitions.

The four-article version is the stronger UX at the current implementation depth. The original twelve-file brief set and old figure audit have been retired; use `plans/quasicrystals/brief.md` as the planning source of truth unless a fresh four-article figure audit becomes the target again.
