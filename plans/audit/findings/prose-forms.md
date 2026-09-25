# Findings: prose pass, forms track (modular-forms, cohomology)

This was a Phase 3 prose pass. No articles were merged, split or renumbered. KaTeX, `\color` choices and figure code are unchanged, apart from reader-visible JS strings that had em dashes.

Word counts are visible text with script and style stripped. They include figure labels, controls and tables, which were not edited, so the cut to the prose itself is somewhat larger than the numbers show. Em dash counts cover reader-visible text, including `<title>`, plus JS string literals. Code comments are excluded.

## Numbers

| series | words before | words after | change | em dashes before | after |
|---|---|---|---|---|---|
| modular-forms (15 pages) | 17,897 | 14,209 | -21% | 42 (39 visible + 3 JS) | 0 |
| cohomology (7 pages) | 8,972 | 7,104 | -21% | 78 (70 visible + 8 JS) | 0 |

Per page (words before → after):
- modular-forms:
  - index 190 → 169
  - 01: 790 → 583
  - 02: 1168 → 1093
  - 03: 1177 → 777
  - 04: 810 → 639
  - 05: 1481 → 1362
  - 06: 1106 → 771
  - 07: 870 → 648
  - 08: 843 → 706
  - 09: 1099 → 886
  - 10: 848 → 703
  - 11: 1376 → 1129
  - 12: 1857 → 1225
  - 13: 2071 → 1723
  - 14: 2211 → 1795
- cohomology:
  - index 147 → 145
  - 01: 1770 → 1193
  - 02: 1371 → 1016
  - 03: 1097 → 901
  - 04: 1838 → 1299
  - 05: 1496 → 1297
  - 06: 1253 → 1253

Some pages were cut less on purpose:
- mf 02 and 05 are dense content that the merge pass had already rewritten.
- coh 05 and 06 are largely new prose from batch 2. 06 only had its title changed.

render-check passes on all 22 pages on :8104.

## What changed, series-wide
- **Title separators.** Every `<title>` now uses " · Series", replacing " — Series". The Act crumbs in coh 01 and 02 use "·".
- **Scaffolding removed.**
  - Every "Takeaways" and "What we take with us" list. Each is now at most a one-line pointer to the next article.
  - Every "Play:" and "Observe:" caption label.
  - About 30 bolded lead-ins.
  - All `.insight` and `.aside` callout boxes in cohomology, turned into prose. The unused CSS rules are still in the `<style>` blocks.
  - The notation callouts in mf 12, 13 and 14. Each is now a plain paragraph beginning "A note on notation: in Act IV".
- **Notation and continuity.**
  - Cusps are written ℚ ∪ {i∞} everywhere. The 04 subtitle and the index card had {∞}.
  - Modular-forms cross-references say "Part N", matching the nav footers.
  - The mf index "pressure system" and "thesis" framing is gone.
- **Worst patterns.**
  - Takeaways lists in a chattier voice than the body: "The Scrambler", "One tile to rule them all", "deep, mysterious arithmetic properties".
  - Intros restating the previous article.
  - "Play:" captions repeating the paragraph above them.
  - Inflated openers: "This is where everything converges", "two completely different areas ... are actually identical", "There is absolutely no obvious reason", "bizarre", "impossible-seeming".
  - Em dashes used as universal glue in cohomology 01 and 02 (about 20 each).

## Errors confirmed and fixed
- **coh 01, caption.** The annulus has 24 vertices, 48 edges and 24 triangles; the caption said "~40 edges". Counted from `COH.tri.annulus(8, 16)` in node.
- **coh 01, coboundaries.** The page claimed single edges can be coboundaries, and that an inner vertex has two incident edges. An inner vertex has degree 5, and the annulus has no bridge, so no single edge is a coboundary over Z/2. A coboundary δf is the cut between f = 1 and f = 0.
- **coh 02, rank 13.** The page put the rank of δ₁ down to "the missing 3-chain". There are no 3-simplices. The dependency is that the 14 rows sum to zero, because each edge lies in exactly two triangles.
- **coh 02, all-ones cochain.** The page said the all-ones 2-cochain is never a coboundary. That is false: 3F = 2E makes F even, so it pairs to 0 with the fundamental class. The text now uses a single-triangle cochain with the parity argument.
- **coh 03, commutativity.** (−1)^{pq} graded commutativity holds in cohomology, not on cochains. The false inference drawn from it was removed.
- **coh 05, connecting map.** The prose said δη_U is "supported on simplices in U" and is then pushed forward. The actual reason is that δη_U vanishes on U ∩ V, where it equals δη = 0, so it extends by zero to a cocycle on X. The page's own worked example extends by zero, which is consistent with this.
- **mf 08, intro.** The intro said "every Fourier coefficient is a fact about a prime", which is wrong for composite n. It now says a(p) is the T_p eigenvalue.
- **mf 12, dimension growth.** The page said "each subsequent dimension is roughly an order of magnitude larger". The ratios are 108, 40 and 22 (21296876/196883, 842609326/21296876, 18538750076/842609326), so the caption now says 20 to 110 times.
- **mf 14, Kac–Moody.** The page said standard Kac–Moody algebras cannot have exponential root-multiplicity growth. Hyperbolic Kac–Moody algebras do, for example Feingold–Frenkel.
  - The subtitle now says "finite and affine".
  - The Cartan sentence now says what a_ii = 2 forces: real simple roots of multiplicity 1.
- **mf 01, transformation law.** The page said the law "is written in PSL₂(ℝ)". It uses γ ∈ SL₂(ℤ), and (cτ+d)^k is not defined on PSL for odd k. Reworded.
- **mf 13, weight-2 space.** "V₁♮" in the Aut paragraph was ambiguous, because weight 1 is empty. It now says the weight-2 space.

## Suspected, not fixed (needs a human or a source)
- **mf 10, Shimura.** "Shimura (1964) refined it for CM curves" is probably a misattribution. Modularity of CM curves goes back to Deuring and Shimura via Hecke characters, and Shimura's role is usually described as sharpening the conjecture over ℚ.
- **mf 10, conductor.** "Conductor = rad(abc)" for the Frey curve needs the usual normalisation (b even, a ≡ −1 mod 4).
- **mf 10, FLT.** FLT is stated for n ≥ 3, but the argument only covers primes p ≥ 5. The page never says that n = 3 and n = 4 are classical.
- **mf 07, Herbrand–Ribet.** The sentence now reads "Congruences like Ramanujan's are the mechanism behind the Herbrand–Ribet theorem". This is defensible, since Ribet's proof uses an Eisenstein/cusp congruence mod p, but a specialist may want sharper wording.
- **mf 08, Hecke operators.** The page asserts that the T_n are simultaneously diagonalisable without mentioning Petersson self-adjointness.
- **mf 03, finite area.** "Finite area is what makes spaces of modular forms finite-dimensional" is a heuristic. The real argument is the valence formula in Part 5.
- **mf 13, twisted sector.** The sentence about θ-averaging and the twisted sector is plausible (FLM) but was not checked against the figure code.
- **mf 14, Gannon's date.** Gannon's Mathieu moonshine proof is dated 2012. It was on arXiv in 2012 and published in 2016.
- **coh 03, Cayley plane.** The OP² paragraph is true (H* = Z[α]/(α³), |α| = 8) but a tangent.
- **coh 03, reduced motion.** The caption's reduced-motion claim was carried over from the old prose without being tested.

## Left for a human
- The mf index act-machine figure is still decorative, as flagged last pass.
- Dead `.insight`, `.aside`, `.takeaway` and `.notation-callout` CSS remains in several `<style>` blocks.
