# Quasicrystals

I want four articles on ordered patterns that never repeat, for curious readers with some math comfort and no crystallography. The through-line is one construction, cut-and-project: take a periodic lattice in a higher dimension, keep the points inside a thin slab around a subspace at an irrational angle, and project them down. Each article builds on the same move, from a line cut from the square grid, to the Penrose tiling cut from the five-dimensional integer lattice, to substitution rules that turn out to produce the same patterns, to the diffraction that made a 1982 alloy famous.

Every figure should compute from the construction it shows: lattice points, windows in internal space, substitution rules and Fourier sums, evaluated as the reader moves controls. A reader should finish able to explain why the pattern is ordered, why it never repeats, what the hidden internal coordinate decides, and why five-fold symmetry in a diffraction pattern was a shock.

## Articles

### 1. The Fibonacci Chain
A square grid, a line at slope one over the golden ratio, and a window give a chain of two tile lengths that is completely ordered and never periodic. The reader moves slope and window sliders and sees lattice points project into tiles, with two lengths at the natural window width, repetition at rational slopes, and a third length when the window widens. Later figures show each point's conjugate in internal space, colored by the word of tiles that follows it so every look-ahead word owns one interval of the window, and then slide the window to produce phason flips, with each crossing point matched to a swapped pair of tiles in the chain.

### 2. Five Grids and the Penrose Tiling
De Bruijn's pentagrid turns five families of parallel lines into Penrose rhombs, and the same tiling is a slice of the five-dimensional lattice with four pentagons as its window. The signature figure links the grid and the tiling so hovering a crossing lights its tile and whole ribbons of tiles. The reader then drags the internal shift, watching every vertex's image stay inside its pentagon and flips arrive as rows of hexagons, and finally sees each vertex-neighborhood type fill its own region of the windows.

### 3. Inflation
Cutting every tile into smaller tiles by a fixed rule gives the same patterns as cut-and-project, because in internal space the rule is a multiplication that shrinks the window into itself. The reader steps the Fibonacci substitution and compares it letter by letter with the projected chain, scans scale factors from 1 to 3 to see which ones map the chain back onto itself, and runs the Robinson-triangle substitution in the plane with each vertex tested against the pentagon windows. The 2023 aperiodic monotile gets one sourced paragraph as a different road to aperiodicity.

### 4. Diffraction
A periodic crystal can only have two-, three-, four- or six-fold rotational symmetry, and a cut-and-project set escapes that restriction while still diffracting into sharp peaks. The reader works the two-center crystallographic restriction argument, then compares computed diffraction of the Fibonacci chain, a periodic approximant and a random chain against the peaks the window predicts, and finally sees the Penrose vertex set's ten-fold spots next to a square lattice. It closes on Shechtman's April 1982 observation and its reception.

## What to get right

- History must come from primary or authoritative sources such as the Nobel committee's scientific background and the 1984 Physical Review Letters paper: the date of the observation, the delay before publication, Levine and Steinhardt's naming, and the redefinition of "crystal" by the International Union of Crystallography. Avoid details the sources disagree on, such as the alloy's exact composition, and avoid unsourced quotes. Don't call the hat the first monotile.
- Window conventions matter. The half-open window that makes the substitution word equal the projected chain is a different one from the window closed under multiplication by the golden ratio. Check which statement each window supports before writing it.
- Phason flips in the Penrose tiling arrive in rows of hexagons, several at once, unlike the one-at-a-time flips of the chain.
- Every "check" readout should be a real comparison that could fail, and diffraction must come from an actual sum over points compared with the window's prediction. A schematic intensity envelope is not acceptable.
- Keep one color language across the four: physical space in one warm color, internal space and the window in another, the long and short tiles (and thick and thin rhombs) in a fixed pair, flips in a warning color, the ambient lattice in a neutral gray.
- De Bruijn's theorem that every Penrose rhomb tiling comes from a pentagrid, and Hof's results on diffraction, should be checked against the papers.
