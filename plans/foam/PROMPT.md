# Foam: Dividing Space with the Least Surface

I want three short articles on one question asked in dimension after dimension: what is the least-wall way to divide space into cells of equal size? It is for curious readers comfortable with some math and new to crystallography. The plane has a proven answer, two bubbles have a proven answer, and filling three-dimensional space is still open: Kelvin's elegant guess stood for 106 years, then lost by about 0.3% to a two-cell foam found in 1993. The series stops there. A reader should finish knowing Plateau's laws by feel, why the hexagon wins in the plane, why a double bubble looks the way it does, and why Kelvin's flat cell cannot be the answer as drawn.

The series index opens with a real Voronoi strip whose seed points slide from random to a triangular lattice, so the cells go from froth to honeycomb across the page.

## Articles

### 1. The Honeycomb
In the plane three films always meet at 120 degrees, and the regular hexagonal grid spends the least wall per unit area; Hales' honeycomb theorem proves it beats every equal-area partition. The signature figure relaxes a random froth step by step (Lloyd relaxation of Voronoi cells) and shows the junctions settling toward 120-degree forks, the mean side count going to six, and the wall cost falling toward the hexagon's value. Smaller figures rank the three regular tilings by wall cost and show three pentagons around a vertex leaving a gap, a frustration that returns in 3D, where foam cells are mostly pentagons.

### 2. The Double Bubble
One volume gives the sphere: a figure compares shapes enclosing the same area and their perimeters, and the prose gives the cube's and tetrahedron's surface excess over the sphere at equal volume. Two volumes give the familiar double bubble. The signature figure is a double bubble in cross-section with a volume-ratio slider, built from the 120-degree condition, whose middle wall is flat only when the volumes are equal. The history: the equal-volume case by a computer-assisted proof in 1995 (Hass, Hutchings and Schlafly), the general case in 2002 (Hutchings, Morgan, Ritoré and Ros) with no computer. It closes on a non-standard competitor, one region wrapped as a torus around the other, of the kind the proof had to rule out.

### 3. Kelvin's Bubble
Kelvin's 1887 cell is the truncated octahedron, the territory of one point of the body-centered cubic lattice. The reader turns the cell over, then checks Plateau's two rules in 3D (120 degrees along an edge, the tetrahedral angle where four edges meet) and sees the flat cell break both: its faces meet at 109.47 and 125.26 degrees, so they must curve. A last figure compares dimensionless surface area for the flat cell, the relaxed cell and the 1993 Weaire-Phelan foam that beats it, on a zoomed axis.

## What to get right

- Wall cost counts each shared wall once, split between its two cells; state that convention beside the hexagon's number, and keep "least perimeter" distinct from "most circular cell".
- Check every isoperimetric ratio by computing it (the cube matching a unit sphere's volume has about 24% more surface, the regular tetrahedron about 49%).
- The smaller bubble is at higher pressure, so the middle wall bulges into the larger one. Prose and figure must agree on this.
- Weaire-Phelan is the best known foam and nobody has proved it optimal. Its two cell types have equal volume.
- Surface-area values (Kelvin relaxed about 5.306, Weaire-Phelan about 5.288) should be published Surface Evolver results or computed from a formula, labelled as which. Plot them as points on an honestly labelled zoomed axis; bars on a truncated axis exaggerate the gap.
- One color language throughout: film in a warm color, equilibrium angles in another, lattice points in a neutral. Kelvin's relaxation has so far only been described; showing it, even approximately, would help.
