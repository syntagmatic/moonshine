# Sheaves

I want seven essays that explain sheaves to a working mathematician (someone who knows topology, linear algebra and a little category theory) by computing with them. The reader should come away seeing a sheaf as local data plus rules for how neighbours must agree, global sections as the answers that agree everywhere, and cohomology as the name for why local answers sometimes can't be glued. Then they should see that picture doing real work: sensor fusion, consensus and opinion dynamics, recovering orientations from noisy pairwise measurements, and graph neural networks that don't wash out their features.

The series starts with cellular sheaves on graphs and small cell complexes, where a sheaf is a pile of matrices and every figure can compute its answer live by linear algebra in the page. It ends with the classical sheaf of holomorphic germs, so the reader sees that the finite version was copying the classical one all along. The series does not re-derive simplicial cohomology; the cohomology series in this gallery does that, and these essays link to it where they lean on it.

## Articles

**Act I: Local to global**

### 1. Stalks and restriction maps
A cellular sheaf on a graph is a vector space on every vertex and edge and a linear map from each vertex to each edge it touches. Global sections are the kernel of one matrix. The reader edits a sheaf on a small graph (stalk dimensions, restriction maps chosen from a palette of projections, rotations and scalings) and watches dim H^0 change as the coboundary is rebuilt. The anchor example is a twisted sheaf around a cycle: it looks like the constant sheaf at every vertex and edge, and still has no nonzero global section. The poset view (a cell complex as a poset, a sheaf as a functor out of it) is given in one paragraph for the category-minded reader.

### 2. When local sections don't glue
H^1 as the cokernel of the coboundary, and what a nonzero class means: a set of edge discrepancies no vertex assignment can explain. The reader picks local sections on the pieces of a cover and sees exactly where gluing fails, and the Cech complex of a cover is computed next to the cellular one to show they agree. Twists are only visible around loops, which is why H^1 of a sheaf on a tree is always zero. Links to cohomology essays 1 and 5 for the constant-coefficient case.

**Act II: Sheaves at work**

### 3. Sensor fusion and the consistency radius
Overlapping sensors report local readings that don't quite agree. A sheaf encodes what each sensor measures and how overlapping measurements must relate; the consistency radius measures how far an assignment is from being a section, and a least-squares fit finds the nearest global section. Data is either a real public dataset with overlapping measurements or clearly labelled as simulated. The reader corrupts one sensor and watches which edges light up.

### 4. The sheaf Laplacian
The Laplacian L = delta^T delta turns a sheaf into a quadratic energy, the total squared disagreement across edges, and heat flow on it settles onto the orthogonal projection into H^0. The graph Laplacian is the constant sheaf. Figures, in order: a signed graph as a scalar sheaf, where heat flow splits the vertices into two factions exactly when the graph is balanced (Harary) and decays to zero otherwise; a rotation sheaf on a cycle with arrows at the vertices, where a holonomy dial decides whether the arrows settle into agreement or shrink to nothing, with a live log-energy trace whose slope is the smallest eigenvalue; the spectrum of the rotation cycle as a function of holonomy, computed by eigensolver and checked against the closed form 2 - 2cos((2 pi k +/- theta)/n); and angular synchronization, recovering forty unknown orientations from noisy relative angles on the edges of a random graph using the bottom eigenvectors of L, with sliders for noise and the fraction of corrupted edges that show both success and breakdown.

### 5. Opinion dynamics on discourse sheaves
People hold private opinions and express them through public stances on shared topics; the restriction maps are how each person translates. Heat flow on opinions, on expressions, or on the maps themselves gives consensus, persuasion, and people who learn to say what their neighbour wants to hear. The reader builds a small discourse network and runs each dynamic, and sees consensus reached on expressions while private opinions stay apart.

### 6. Neural sheaf diffusion
Graph neural networks average neighbours, which washes out features on heterophilic graphs, where linked nodes tend to differ. Diffusion with learned restriction maps can keep classes apart. The reader first sees a graph Laplacian flatten a two-class graph, then a sheaf Laplacian with sign-flipping or rotating maps separate it, and finally a small sheaf diffusion model trained in the page on a real small heterophilic benchmark graph, compared with plain diffusion.

**Act III: Where the idea came from**

### 7. Germs and analytic continuation
The sheaf of holomorphic functions on the plane, its stalks of germs, and the space of germs (the etale space) that assembles them. The reader drags a disk of convergence along a path around a branch point and watches the power series of sqrt z and log z continue, return different, and trace out their Riemann surfaces as sheets of the etale space. The gluing axiom is stated in its classical form and matched against the cellular definition from essay 1. The essay closes on where the idea came from (Leray) and names cosheaves, sheaf-theoretic persistence and contextuality as directions the series did not take.

## What to get right

- Sign and orientation conventions: fix (delta x)_e = F_{v,e} x_v - F_{u,e} x_u for e = (u, v) once and use it everywhere. L does not depend on the orientation choice; delta does.
- H^0 = ker delta = ker L. Heat flow dx/dt = -Lx converges to the orthogonal projection of x(0) onto H^0, and the rate is set by the smallest nonzero eigenvalue. Figures that claim convergence compute it from an eigendecomposition, not from a canned animation.
- A rotation sheaf on a cycle has dim H^0 = 2 when the holonomy is 0 mod 2 pi and 0 otherwise. The holonomy is the product of the rotations around the loop, not any single edge.
- Signed graph balance: H^0 is nonzero iff every cycle has an even number of negative edges. Show both outcomes.
- Angular synchronization breaks down gradually with noise and sharply with outliers. Report the error after the optimal global rotation, since a global rotation of the answer is still a section.
- Cite the applied papers for what they actually show (Hansen and Ghrist on spectral sheaf theory and discourse sheaves, Robinson on consistency radius and sensor integration, Bodnar et al. on neural sheaf diffusion, Singer on angular synchronization). Benchmark numbers come from the page's own runs, not from the papers' tables.
- Series colors: vertex stalk data in teal, restriction maps and edges in ochre, global sections and agreement in olive green, disagreement (delta x) in brick red, holonomy and twist in plum, fixed or observed values in ink slate. No default blue-purple pair.
