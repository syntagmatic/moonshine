# Claims ledger: Sheaves series

Every checkable claim in the prose and captions. Verdicts: derived (working in
the page or here), computed (a figure or `sheaf-math.js` check computes it),
sourced (read in the named primary source this session).

| page | claim | kind | how we know |
|---|---|---|---|
| lib | Constant sheaf R on a graph has L equal to the graph Laplacian D - A | computed | `Sheaf.runChecks`: path of 4, entries and spectrum 2 - 2cos(pi k/4) |
| lib | x^T L x = sum over edges of the squared discrepancy | derived, computed | L = delta^T delta so x^T L x = |delta x|^2; check on a random rotation sheaf |
| lib | Heat flow exp(-tL) x0 tends to the orthogonal projection of x0 onto ker L; energy never increases | derived, computed | L symmetric PSD: components along eigenvectors decay as e^{-lambda t}; checks at t = 400 and monotone energy on a grid of t |
| lib | Rotation sheaf on the n-cycle with holonomy theta has spectrum 2 - 2cos((2 pi k +/- theta)/n), k = 0..n-1 | derived, computed | R^2 with rot(theta) is e^{i theta} plus e^{-i theta} on C; each gives the magnetic cycle's spectrum. Checked against Jacobi for (5, 0), (5, 1.1), (6, pi), (7, 2.5) |
| lib | Holonomy 0 spread over several edges gives dim H^0 = 2 | computed | check with six edge angles summing to 0 |
| lib | Signed triangle: one negative edge gives H^0 = 0, two give H^0 = R | computed | checks |
| exp | (random graph, not the page config) Spectral synchronization recovers angles exactly without noise, degrades gradually with Gaussian-ish noise, and fails once outliers dominate | computed | node run, n = 40, p = 0.25, seed 3: error 0.0 deg (clean), 3.0 (sigma 0.2), 7.4 (sigma 0.5), 10.9 (30% outliers), 36.3 (60%), 76.7 (85%) |
| 04 | ker L = H^0; heat flow x' = -Lx converges to the orthogonal projection onto H^0 | derived, sourced | Hansen and Ghrist, J. Appl. Comput. Topol. 3(4):315-358 (2019), arXiv:1808.01513, Thm 3.1 and Prop 8.1 (written x' = -Delta x) |
| 04 | The connection Laplacian (Singer and Wu) is the sheaf Laplacian of an O(n) bundle | sourced | Hansen and Ghrist 2019 say so directly; Singer and Wu, Comm. Pure Appl. Math. 65(8):1067-1144 (2012), arXiv:1102.0075 |
| 04 | Signed graph has a nonzero section iff every cycle has an even number of negative edges (Harary) | derived, computed; citation confirmed | BFS sign propagation: a conflict closes a cycle with sign product -1, and the page's finder names it. Harary, Michigan Math. J. 2(2):143-146 (1953). OPEN: theorem wording not read in the primary PDF (Project Euclid blocks scripts) |
| 04 | Fig 1 default: balanced, flow splits {A, C, F, H} from {B, D, E, G}; flipping edge AB makes cycle B-A-C odd, lambda_min 0.276 | computed | headless run of the page |
| 04 | lambda_min = 2 - 2cos(theta/n) ~ theta^2/n^2; doubling n quarters it | derived, computed | Taylor expansion; Fig 3 readout at 90 deg: 0.06815 (n = 6) vs 0.01711 (n = 12), ratio 3.98 |
| 04 | Singer's spectral method uses the top eigenvector of H_ij = e^{i delta_ij}; on a regular graph L = dI - H has the same eigenvectors | sourced, derived | Singer, Appl. Comput. Harmon. Anal. 30(1):20-36 (2011), arXiv:0905.3174. Real 2x2 rotation blocks are the realification of e^{i delta} |
| 04 | On the complete graph Singer recovers n = 400 angles with 90% outliers | sourced | Singer 2011, numerical example; threshold p > 1/sqrt(n) for nontrivial correlation |
| 04 | Fig 4: each object has about nine neighbours | computed | 182 edges on 40 vertices, mean degree 9.1 |
| 04 | Fig 4 default (noise 10 deg, 20% corrupted, seed 11): most errors under 20 deg, none reach 45 | computed | headless run: bins 21 / 14 / 4 / 1 over 0-40 deg, median 9.5, worst 39.0 |
| 04 | Fig 4: at 60% corrupted the estimate is near random; noise alone at 90 deg also degrades it | computed | headless run: median 67.5 deg and 61.7 deg |
| lib | dim H^0 = dim C^0 - rank delta, dim H^1 = dim C^1 - rank delta; so h0 - h1 = dim C^0 - dim C^1 for any maps | derived, computed | rank-nullity; `Sheaf.runChecks` on 20 random sheaves with stalk dims 0-2 and integer maps |
| lib | Constant sheaf on the hexagon: H^0 = H^1 = R. One -1 edge: H^0 = H^1 = 0. Constant sheaf on the hexagon with a chord: H^1 = R^2 | computed | checks |
| lib | Signed tree has H^0 = R, H^1 = 0; a single edge with stalk R between zero vertex stalks has H^1 = R | derived, computed | root the tree and solve outward, which needs the far endpoint's map surjective; counterexample check |
| lib | Twisted hexagon with any one edge removed has dim H^0 = 1 | computed | check over all six cuts |
| lib | Least-squares residual b - delta x lies in ker delta^T; on the constant hexagon it equals the mean of b on every edge; on a signed tree it is zero | derived, computed | normal equations; checks |
| lib | Cech complex of the five hexagon covers agrees with the cellular complex for the constant and twisted sheaves, except the one-piece cover of the constant sheaf (Cech 1, 0 vs cellular 1, 1); d1 d0 = 0 on the wide cover | computed | checks. Sections over each open set computed as a kernel; restrictions as coordinate projections in orthonormal bases |
| 01 | Reversing an edge negates its block row of delta and leaves ker delta unchanged | derived | (delta x)_e changes sign |
| 01 | A cellular sheaf is a functor from the cell poset; with the Alexandrov topology (up-closed sets open, basis the open stars) it is an honest sheaf; definition credited to Shepard 1985 | sourced | Curry thesis arXiv:1303.3255, Def. 4.1.6, Def. 4.2.2, Cor. 4.2.13 and Intro p. xiv (see SOURCES.md item 7) |
| 01 | Fig 1 presets: constant R gives H^0 = 1 (and C^1 leftover 1); constant R^2 gives 2; projections onto one coordinate give 4 with H^1 = 0; one quarter turn on the triangle gives 0 | computed | headless run of the page |
| 01 | The pendant edge CD constrains C only when D's map onto the edge is not surjective | derived | surjective map lets D match any value; zero or R to R^2 inclusion does not |
| 01 | Twisted hexagon: every proper arc is isomorphic to the constant sheaf; the loop has no nonzero section; the gap lands on the closing edge | derived, computed | vertex-by-vertex rescaling on a path; x_0 = h x_0; Fig 2 readout moves the gap with the start vertex |
| 01 | For sheaves of lines with invertible scalar maps on a cycle, holonomy is a complete isomorphism invariant | derived | rescaling g_v at a vertex multiplies one incident scalar by g_v and divides the other; product telescopes; equal holonomies let you rescale around the path to match |
| 01 | Fig 2: holonomy -1 then flip E keeps -1; changing AB to -1 gives +1 and H^0 = 1; to 2 gives -2 | computed | headless run of the page |
| 02 | H^1 = C^1 / im delta is isomorphic to ker delta^T, the least-squares residual | derived; sourced for the Hodge form | orthogonal decomposition; Hansen and Ghrist 2019 Thm 3.1 (ker Delta^k = H^k) |
| 02 | Cellular sheaves are sheaves for the Alexandrov topology, so Cech covers by open stars make sense | sourced | Curry Cor. 4.2.13 |
| 02 | Two-arc cover overlaps in two components with F(U12) = R^2; wide cover has triple overlap {BC, DE, FA} with F = R^3; four-arc cover is R^4 -> R^6 -> R^2 | computed | Fig 2 readout, headless run |
| 02 | Cech agrees with sheaf cohomology when pieces and intersections are acyclic ("usually credited to Leray") | background | standard theorem. OPEN: not read in a primary source this session; the page only names it and shows the computed cases |
