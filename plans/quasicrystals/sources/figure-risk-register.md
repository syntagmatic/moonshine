# Figure Risk Register

Use this before implementation. The goal is not to avoid hard figures; it is to label them so the reader knows exactly what object they are seeing.

## R1: Classical Penrose vs `penroseFromE8`

Affected essays:

- 04, 05, 06, 09, README cross-links.

Risk:

- Using `penroseFromE8()` while captioning it as canonical 5-fold Penrose.

Required handling:

- Essay 4 canonical figure must use de Bruijn / pentagrid / Z5 -> R2.
- Any `penroseFromE8()` figure must be labeled "related 8D in-house slice; default 2-fold."

Status:

- Medium risk. May 2026 UX pass added a first-pass pentagrid view, matching-rule checker, and five-direction orientation view. The pentagrid is still a finite explanatory construction, not a full production-grade Penrose tiler.

## R2: E8 Source-Lattice Fog

Affected essays:

- 03, 06, 07, 08, 09.

Risk:

- Saying `elserSloane()` projects from E8.

Required handling:

- Use "Hurwitz-golden Galois-pair lattice `rho(H[phi])`" for shipped `elserSloane()`.
- Use "nearby E8" for Wilson/Bourbaki-frame icosian construction.

Status:

- High conceptual risk, currently patched in prose.

## R3: H3 Symmetry Overclaim

Affected essays:

- 07, 09, 10.

Risk:

- Presenting finite-radius H3 output as a globally proven all-radius W(H3)-symmetric Delone set from current code.

Required handling:

- Say "finite-radius computational evidence" for shipped scenes.
- Visually distinguish interior from boundary.
- Use orbit-shell language for diffraction evidence.

Status:

- Medium risk. May 2026 UX pass added a periodic-vs-aperiodic contrast and a finite H3/H4 substrate scene. The audited H3 quasicrystal interior embed remains a follow-up.

## R4: Pure-Point Means "Separated Dots"

Affected essays:

- 09, 10, 11, 12.

Risk:

- Saying pure-point diffraction means a uniformly spaced or separated reciprocal lattice.

Required handling:

- Say "atomic Bragg peaks indexed by a finite-rank Fourier module."
- Explain that modules can be dense; finite views and intensity thresholds reveal the visible pattern.

Status:

- Lower medium risk. May 2026 UX pass added a finite diffraction oracle with threshold and window-envelope controls, but the production diffraction-lab embed is still not wired in.

## R5: 600-Cell Fourier Transform

Affected essays:

- 09, 10.

Risk:

- Treating squishy-thing's 600-cell FT as exact.

Required handling:

- Caption H3 amplitudes as "600-cell window with 4D-ball amplitude approximation."
- Make peak-position claims separately from amplitude-envelope claims.

Status:

- Medium risk for the shipped standalone oracle; high risk remains if replacing it with the full diffraction lab. The shipped figure keeps peak-position and amplitude-envelope claims separate.

## R6: Rights-Sensitive History Images

Affected essays:

- 10.

Risk:

- Copying Shechtman's notebook or PRL figure without rights-safe source.

Required handling:

- Use public-domain / licensed source only if verified.
- Otherwise redraw schematically and cite the original.

Status:

- Medium risk. May 2026 UX pass added a rights-safe schematic twinning-vs-quasicrystal comparison and notebook-style redraw. Historical image assets remain unsourced by design.

## R7: Chair Tiling Classification

Affected essays:

- 11.

Risk:

- Using chair as "not a model set" without noting p-adic internal-space model-set formulations.

Required handling:

- If chair appears, caption as "not Euclidean-window CP; p-adic model-set caveat."
- Prefer pinwheel or Wang examples for clean divergence from strict DIFF / CP.

Status:

- Medium risk. May 2026 UX pass added a substitution/Wang local-rule view with the chair p-adic caveat kept explicit.

## R8: Hat Projection Claims

Affected essays:

- 12.

Risk:

- Saying Hat/Spectre have no projection structure, or saying Hat is a regular model set.

Required handling:

- Cite Socolar for quasiperiodic / 6D projection-style structure.
- Keep regular model-set and diffraction status cautious.

Status:

- Medium risk. May 2026 UX pass replaces decorative placeholder outlines with generated Hat/Spectre monotile-family outlines and compact local patch diagrams, but larger validated tiling patches and projection/diffraction claims remain deferred.

## R9: Natural Quasicrystal Census

Affected essays:

- 10, 12.

Risk:

- Framing the live question as "are there more than two natural quasicrystals?"

Required handling:

- Use formation mechanisms: Khatyrka, Trinity-test material, electrical-discharge fulgurite, possible cosmic/geologic/lab processes.

Status:

- Low risk after source packet update.

## R10: Exact Arithmetic vs Floating Point

Affected essays:

- 03, 04, 05, 08.

Risk:

- Overclaiming that all quasicrystal computation must be exact, or underclaiming drift risk in inflation/projection tests.

Required handling:

- Say exact arithmetic is load-bearing for non-crystallographic identities and invariant tests.
- Use floats for visuals when harmless, but not for proof-like equality/inflation claims.

Status:

- Medium risk.
