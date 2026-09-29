# Sheaf essay series: source verification (2026-09-28)

Method: arXiv PDFs downloaded and text-extracted (copies of the extracted text sit next to
this file: `1808.01513.txt`, `2005.12798.txt`, `2202.04579.txt`, `1603.01446.txt`,
`1805.08927.txt`, `1303.3255.txt`, `0905.3174.txt`, `1102.0075.txt`, `miller.txt`).
Venue metadata comes from the Crossref API (`api.crossref.org/works/<doi>`). Section and
theorem numbers are from the arXiv versions named below. The published versions may number
things differently, so check against the journal PDF before you quote page numbers.

---

## 1. Hansen & Ghrist, "Toward a spectral theory of cellular sheaves"

**Citation.** Jakob Hansen and Robert Ghrist, "Toward a spectral theory of cellular sheaves,"
*Journal of Applied and Computational Topology* 3(4):315-358, 2019 (online 30 Aug 2019).
DOI 10.1007/s41468-019-00038-7. arXiv:1808.01513.

**Coboundary (Sec. 2.2.2, p. 7).** "Given a signed incidence relation on P_X, there exist
coboundary maps δ^k : C^k(X;F) → C^{k+1}(X;F). These are given by the formula
δ^k|_{F(σ)} = Σ_{dim(τ)=k+1} [σ:τ] F_{σ⊴τ}", and "H^0(X;F) is naturally isomorphic to
Γ(X;F), the space of global sections."

**Laplacian (Sec. 3.2, pp. 10-11).** Hodge Laplacian Δ^k = (δ^k)*δ^k + δ^{k-1}(δ^{k-1})*,
with up-Laplacian Δ^k_+ = (δ^k)*δ^k. "We will further elide the index k when k = 0, denoting
the graph sheaf Laplacian by simply L." Block form: diagonal Σ F*_{v⊴e}F_{v⊴e}, off-diagonal
−F*_{u⊴e}F_{v⊴e}. So L = δ*δ (adjoint with respect to the stalk inner products, which is δ^T δ
in orthonormal bases).

**ker L = H^0 (Theorem 3.1, "central theorem of discrete Hodge theory").** "ker Δ^k ≅ H^k(C•)."
For k = 0 this gives ker L ≅ H^0 = global sections.

**Heat equation (Sec. 8.1, Proposition 8.1).** "The dynamical system ẋ = −Δ^k_F x has as its
space of equilibria H^k(X;F) ... The trajectory ... initialized at x0 converges exponentially
quickly to the orthogonal projection of x0 onto H^k(X;F)." Then: "for k = 0, this result
implies that a distributed system can reach consensus on the nearest global section to an
initial condition." NOTE: this paper has no α. The form dx/dt = −αLx with α > 0 comes from
the discourse-sheaves paper (item 2, eq. 1.1 for graphs, eq. 4.1 for sheaves).

**Harmonic extension (Sec. 4.1, Proposition 4.1).** "Let X be a regular cell complex with a
weighted cellular sheaf F. Let B ⊆ X be a subcomplex and let x|_B ∈ C^k(B;F) be an F-valued
k-cochain specified on B. If H^k(X,B;F) = 0, then there exists a unique cochain x ∈ C^k(X;F)
which restricts to x|_B on B and is harmonic on S = X \ B." Followed by: "harmonic extension
is always possible for 0-cochains, with uniqueness if and only if H^0(X,B;F) = 0." Sec. 4.2
uses this for Kron reduction (Schur complement), and shows that Kron reduction does not in
general carry over to sheaves.

**Singer & Wu.** Cited, yes (Sec. 3.6): "The graph connection Laplacian, introduced by Singer
and Wu in [SW12], is simply the sheaf Laplacian of an O(n)-vector bundle over a graph."
Sec. 3.5 defines discrete O(n)-bundles as restriction maps that are scalar multiples of
orthonormal maps. Singer's angular synchronization [Sin11] also appears in the applications
sketches.

**Signed graphs / structural balance.** NOT FOUND in this paper. The text contains no
occurrence of "signed graph", "balance" (other than the phrase "for the balance of this
paper"), "Harary" or "structural balance". Signed graphs and antagonism show up in the
discourse-sheaves paper instead (item 2, Sec. 12, citing Altafini).

**Verdict: confirmed, with two differences.** (a) The spectral paper writes the heat equation
without α, as ẋ = −Δx. (b) This paper does not use signed graphs or structural balance as
examples.

---

## 2. Hansen & Ghrist, "Opinion dynamics on discourse sheaves"

**Citation.** Jakob Hansen and Robert Ghrist, "Opinion Dynamics on Discourse Sheaves,"
*SIAM Journal on Applied Mathematics* 81(5):2033-2060, 2021. DOI 10.1137/20M1341088.
arXiv:2005.12798 (v1, 26 May 2020).

**Setup (Sec. 3).** "Each agent (vertex) v has an opinion space, a real vector space with
basis some collection of topics ... This opinion space comprises the stalk F(v)". Over each
edge, the shared topics "form the basis of an abstract discourse space, F(e), the stalk over
e." Restriction maps F_{v⊴e} : F(v) → F(e) are "expressions of opinions". "A 0-cochain
x ∈ C^0(G;F) is a private opinion distribution"; "a 1-cochain ... is a distribution of
expressed opinions"; "The sheaf Laplacian L_F ... registers the 'discord' in the system."
Consensus on an edge means F_{u⊴e}(x_u) = F_{v⊴e}(x_v), which "does not imply that u and v
have the same opinions". Intro wording: "private opinions selectively expressed or combined
into policies."

**Opinion diffusion (Sec. 4, eq. 4.1, Theorem 4.1).** dx/dt = −α L_F x, α > 0. "Solutions
x(t) to (4.1) converge as t→∞ to the orthogonal projection of x(0) onto H^0(G;F)." Example
4.2, "In polite company", includes agents who "tell a polite lie".

**Named phenomena.**
- Sec. 5: harmonic extension with stubborn/inflexible agents, decided by a cohomology computation.
- Sec. 6: controllability and observability via sheaf cohomology.
- **Sec. 8 "Learning to Lie"**: opinions are held fixed and the restriction maps (the
  expression) evolve, dF_{v⊴e}/dt = −β(F_{v⊴e}x_v − F_{u⊴e}x_u)x_v^T (eq. 8.1).
  Theorem 8.1: F(t) converges to "the nearest sheaf such that x is a global section" in
  squared Frobenius norm. Fig. 6 caption: the agent with the more extreme opinion "has
  'learned to lie' in order to come to consensus."
- Sec. 9: joint opinion-expression diffusion ("Learning to lie, redux", Ex. 9.5).
- Secs. 10-11: nonlinear Laplacians and bounded confidence (Hegselmann-Krause style).
- **Sec. 12 "Antagonistic Dynamics"**: negative edges E−, signed sheaf Laplacian
  L^S_F = δ^T S δ, which "is not necessarily positive semidefinite". Proposition 12.1: if E−
  is a cutset, then under a surjectivity condition L^S_F is indefinite. It cites Altafini
  (structurally balanced networks) as [2, 3, 4].

The abstract says the paper covers "selective opinion modulation and lying ... evolve both
opinions and communications with diffusion dynamics ... controllability, reachability,
bounded confidence, and harmonic extension."

**Verdict: confirmed** (SIAM J. Appl. Math. 2021, 81(5)). Use "learning to lie" as the name,
not "learning restriction maps".

---

## 3. Michael Robinson: sensor integration and consistency radius

**Citation A.** Michael Robinson, "Sheaves are the canonical data structure for sensor
integration," *Information Fusion* 36:208-224, July 2017. DOI 10.1016/j.inffus.2016.12.002.
arXiv:1603.01446 (v3, Dec 2016). The arXiv title writes "datastructure" as one word.

Definition 20 there (arXiv v3, Sec. 4): "An ε-approximate section for a presheaf of
pseudometric spaces S is an assignment s ∈ Π_{U∈T} S(U) for which
d_V(s(V), S(V⊆U)s(U)) ≤ ε for all V ⊆ U. The minimum value of ε for which an assignment ...
is an ε-approximate section is called the consistency radius of s."

**Citation B.** Michael Robinson, "Assignments to sheaves of pseudometric spaces,"
*Compositionality* 2, 2 (2020). Accepted 2020-05-14. arXiv:1805.08927 (v6). The journal
DOI is presumably 10.32408/compositionality-2-2, following the journal's pattern; I did not
check it against Crossref.

Definition 7: "For a sheaf S of sets on a topological space (X,T), an assignment is an element
a ∈ Π_{U∈T} S(U). If S is a sheaf of pseudometric spaces, then the set of assignments has the
assignment pseudometric D(a,b) := sup_{U∈T} d_U(a(U), b(U)). For an assignment a to a sheaf
S, each value d_U((S(U⊆V))a(V), a(U)) where U⊆V∈T, is called a critical threshold. The
consistency radius given by c_S(a) := sup_{U⊆V∈T} d_U((S(U⊆V))a(V), a(U)), is the supremum of
all critical thresholds." Proposition 1 (citing the 2017 paper's Prop. 23):
D(a,s) ≥ c_S(a)/(1+K) for every global section s, when every restriction is K-Lipschitz.
Theorem 1: consistency radius is continuous.

**Verdict: confirmed.** Both venues and years are correct. The consistency radius first
appears in the 2017 Information Fusion paper (Def. 20 in arXiv v3), stated as a minimum ε.
The 2020 Compositionality paper restates it as a sup over all pairs U ⊆ V (Def. 7).

---

## 4. Bodnar et al., "Neural Sheaf Diffusion"

**Citation.** Cristian Bodnar, Francesco Di Giovanni, Benjamin Paul Chamberlain, Pietro Liò,
Michael M. Bronstein, "Neural Sheaf Diffusion: A Topological Perspective on Heterophily and
Oversmoothing in GNNs," *Advances in Neural Information Processing Systems 35* (NeurIPS 2022).
arXiv:2202.04579 (arXiv comment: "Accepted to NeurIPS 2022").

**Linear separation (Sec. 3.2).** Definition 7: a hypothesis class H^d "has linear separation
power over a family of graphs G if for any labelled graph G ∈ G, there is a sheaf ... that can
linearly separate the classes of G in the time limit of Equation 3 for almost all initial
conditions." The sheaf hierarchy and results:
- Symmetric invertible H^d_sym (F_{v⊴e} = F_{u⊴e}; for d=1 these are the weighted graph
  Laplacians). Prop. 8: separates two classes under a homophily condition. Prop. 9: cannot
  separate on bipartite graphs with |A|=|B|, for any initial condition.
- Non-symmetric invertible H^d. Prop. 10: H^1 separates any two-class connected graph,
  using −α_e / +α_e maps, which are "transport maps −1 for the inter-class edges". This is
  offered as "a sheaf-theoretic explanation for why negatively-weighted edges have been widely
  adopted in heterophilic settings."
- Prop. 11: H^1 cannot separate C ≥ 3 classes.
- Diagonal invertible H^d_diag. Prop. 12: separates C ≥ 3 classes when d ≥ C.
- Orthogonal H^d_orth (O(d)-bundles). Prop. 13: separates C ≤ 2d classes for d ∈ {2, 4}.
- Summary line: "solving any node classification task can be reduced to performing diffusion
  with the right sheaf."

The models in Table 1 are **Diag-NSD, O(d)-NSD, Gen-NSD**, where Gen-NSD learns general
(unconstrained) restriction maps. The theory hierarchy has five classes: symmetric,
non-symmetric, diagonal, orthogonal, and general. "Diagonal / O(d) / general" is correct for
the learned models, not for the full theory hierarchy.

**Benchmarks (Table 1, sorted by homophily).**

| Dataset | Hom | Nodes | Edges | Classes |
|---|---|---|---|---|
| Texas | 0.11 | 183 | 295 | 5 |
| Wisconsin | 0.21 | 251 | 466 | 5 |
| Film | 0.22 | 7,600 | 26,752 | 5 |
| Squirrel | 0.22 | 5,201 | 198,493 | 5 |
| Chameleon | 0.23 | 2,277 | 31,421 | 5 |
| Cornell | 0.30 | 183 | 280 | 5 |
| Citeseer | 0.74 | 3,327 | 4,676 | 7 |
| Pubmed | 0.80 | 18,717 | 44,327 | 3 |
| Cora | 0.81 | 2,708 | 5,278 | 6 |

Evaluation uses "the 10 fixed splits provided by Pei et al. [53]", described as
48%/32%/20% train/val/test.

**Raw WebKB files (Geom-GCN repo).** The repository `graphdml-uiuc-jlu/geom-gcn` now
redirects to https://github.com/bingzhewei/geom-gcn (branch `master`).
- `https://raw.githubusercontent.com/bingzhewei/geom-gcn/master/new_data/{texas,cornell,wisconsin}/out1_node_feature_label.txt`
  (tab-separated: `node_id  feature(comma-separated 0/1)  label`)
- `https://raw.githubusercontent.com/bingzhewei/geom-gcn/master/new_data/{texas,cornell,wisconsin}/out1_graph_edges.txt`
  (tab-separated `node_id  node_id`, with a header line)
- Splits: `https://github.com/bingzhewei/geom-gcn/tree/master/splits`, files
  `<name>_split_0.6_0.2_<k>.npz`, k = 0..9. The filename says 0.6/0.2, while NSD reports
  48/32/20. This is a known naming mismatch in the literature; I did not verify it here.
- **License:** the GitHub API reports none. README "Statement of data source": "This code
  imports published data sets from other researchers that are contained in the folders
  'new-data' and 'data' ... Users of this code should cite the original data sets and their
  sources, if used." WebKB itself comes from the CMU WebKB project (Craven et al.). Cite that
  source and Pei et al. 2020 (Geom-GCN, ICLR 2020, arXiv:2002.05287).

Counts computed from the downloaded raw files (copies in `webkb/` here):

| | nodes | features | classes | edge lines (directed) | self-loops | undirected non-loop pairs | edge homophily (edge lines) |
|---|---|---|---|---|---|---|---|
| Texas | 183 | 1703 | 5 | 325 | 16 | 279 | 0.108 |
| Cornell | 183 | 1703 | 5 | 298 | 3 | 277 | 0.131 |
| Wisconsin | 251 | 1703 | 5 | 515 | 16 | 450 | 0.196 |

The edge counts do not match the NSD table (295 / 280 / 466). Different papers count edges
differently (directed vs. undirected, with or without self-loops), so quote whichever
convention you use. NSD's Cornell homophily of 0.30 does not match the raw-file edge
homophily of ≈0.13. Texas (0.11) and Wisconsin (0.21) do match.

**Verdict: confirmed, with one caveat.** Venue, authors and linear-separation claims are all
correct. The dataset node counts match the raw files (Texas/Cornell 183, Wisconsin 251). Edge
counts depend on convention, and NSD's Cornell homophily (0.30) is inconsistent with the raw
files.

---

## 5. Harary, "On the notion of balance of a signed graph"

**Citation.** Frank Harary, "On the notion of balance of a signed graph," *Michigan
Mathematical Journal* 2(2):143-146, 1953 (the issue is dated 1953-54). DOI
10.1307/mmj/1028989917. Confirmed via Crossref and the Project Euclid record.

**Theorem.** I could not fetch the primary text: Project Euclid's PDF is bot-blocked
(Incapsula). Secondary sources, including Wikipedia "Signed graph" and Zaslavsky-lineage
surveys, attribute to Harary 1953 that a signed graph is balanced (every cycle positive, i.e.,
an even number of negative edges) if and only if the vertices split into two sets with every
positive edge inside a set and every negative edge between them. They also attribute the
equivalent statement that all paths between any two vertices have the same sign.

**Verdict:** citation confirmed. The theorem's wording is not verified against the primary
text. Host-side check: open the Project Euclid PDF in a browser (it is open access) and copy
the theorem statement and number.

---

## 6. Singer & Wu, "Vector diffusion maps and the connection Laplacian"

**Citation.** A. Singer and H.-T. Wu, "Vector diffusion maps and the connection Laplacian,"
*Communications on Pure and Applied Mathematics* 65(8):1067-1144, 2012 (online 30 Mar 2012).
DOI 10.1002/cpa.21395. arXiv:1102.0075. Dedicated to the memory of Partha Niyogi.

Abstract: "VDM is based on the heat kernel for vector fields ... we prove the relation between
VDM and the connection-Laplacian operator for vector fields over the manifold." The paper
attaches "to every edge of the graph not only a weight but also a linear orthogonal
transformation."

**Verdict: confirmed.**

---

## 7. Curry thesis and the origin of cellular sheaves

**Citation.** Justin Michael Curry, *Sheaves, Cosheaves and Applications*, PhD dissertation,
University of Pennsylvania, 2014. Supervisor Robert Ghrist; committee Ghrist, MacPherson,
Pantev. arXiv:1303.3255 (v1 2013, 188 pp.; v2 17 Dec 2014, 307 pp.).

**Definitions.**
- Def. 4.1.6: "A cellular sheaf F valued in D on X is a functor F : Cell(X) → D, i.e. ... an
  assignment to each cell ... an object F(σ), and to every pair of incident cells
  X_σ ⊂ closure(X_τ) a restriction map ρ_{σ,τ}: F(σ) → F(τ)." Footnote: "Shepard calls these
  co-restriction maps ... but we will see they are restriction maps in the Alexandrov topology."
- Def. 4.2.2 (Alexandrov topology on a preorder): the open sets are the up-closed sets, with
  basis U_x = {y : x ≤ y}, "the open star at x".
- Corollary 4.2.13: "A cellular sheaf on X is a sheaf on P_X equipped with the Alexandrov
  topology. Such a sheaf is uniquely determined by a functor F : P_X → D."

**Origin (Curry, Intro p. xiv and Sec. 4.1).** "The notion of a cellular sheaf, developed by
Allen Shepard [She85] under MacPherson's direction ... Unfortunately, Shepard's thesis was
never published". Also: "Although Shepard never explained this, cellular sheaves are actual
sheaves when viewed through the Alexandrov topology." Curry's reference is
"[She85] Allen Shepard. A Cellular Description of the Derived Category of a Stratified
Space. PhD thesis, Brown University, May 1985." Curry also notes that the same diagrams were
"known as 'stacks' in the first published volume of Zeeman's 1954 thesis [Zee62a, p. 626]",
and that combinatorial descriptions of sheaves were found independently by Kashiwara [Kas84]
and by MacPherson and Zeeman.

**Verdict: confirmed.** Shepard 1985 (Brown, advised by MacPherson) is the standard
attribution for cellular sheaves. For precision: Zeeman's "stacks" (1954 thesis, published
1962) are an earlier version of the same idea. Hansen-Ghrist and the discourse paper cite
Curry for the definition.

---

## 8. Leray, faisceaux, and the analytic-continuation precursor

**Main source.** Haynes Miller, "Leray in Oflag XVIIA: The origins of sheaf theory, sheaf
cohomology, and spectral sequences" (dated Feb 23, 2000; https://math.mit.edu/~hrm/papers/ss.pdf).
I believe it appeared in *Gazette des Mathématiciens* 84 suppl. (2000), but I did not check
that. Supporting sources: MacTutor Leray biography, and Wikipedia "Sheaf (mathematics)"
History (citing Dieudonné, *A History of Algebraic and Differential Topology 1900-1960*,
pp. 123-141).

**Facts, per Miller.**
- Leray "was made prisoner by the Germans in 1940. He spent the next five years in captivity
  in an officers' camp, Oflag XVIIA in Austria [not far from Salzburg]". He founded a camp
  university and became its "recteur". He switched to algebraic topology so that his
  competence as a "mécanicien" would not be used for the German war effort. MacTutor says the
  same: captured 1940, in Austria "until the end of the war in 1945".
- The captivity course was announced in CRAS notes on 4 May 1942 and published in 1945 in
  J. Math. Pures Appl., subtitled "cours de topologie algébrique professé en captivité".
  It already contains the proto-structure: cochain complexes C•(F) attached to closed subsets
  with restriction maps, "the first example of the structure Leray would later, in 1946, call
  a faisceau."
- **The word "faisceau" first appears after the war**, in J. Leray, "L'anneau d'homologie
  d'une représentation," CRAS 222 (1946) 1366-1368, dated 27 May 1946. The companion note
  "Structure de l'anneau d'homologie d'une représentation," CRAS 222 (1946) 1419-1422,
  introduces spectral sequences. Leray's sheaves lived on **closed** subsets; "it was not
  until 1950 that Cartan refounded the theory using open subspaces." The espace étalé
  definition dates from the Cartan seminar, 1950 (Wikipedia, citing Dieudonné; usually
  credited to Lazard).

**Precursor (analytic continuation / germs).** Wikipedia "Sheaf" History says the origins
"may be co-extensive with the idea of analytic continuation" (flagged "clarify"). Wikipedia
"Analytic continuation" constructs the Riemann surface of germs, including the log example.
SEP "Hermann Weyl" says Weyl's *Die Idee der Riemannschen Fläche* (1913) "contains the first
construction of an abstract manifold". A Springer chapter summary (via search) says that
before Weyl "only the Weierstrass approach based on the analytic continuation of power series
(function elements) was held to be rigorous." None of these is a primary history source for
the claim that the étalé space is the Weierstrass/Weyl space of germs. It is standard
textbook framing (e.g., Forster, *Lectures on Riemann Surfaces*, which I did not check). I
could not reach Gray's "Fragments of the history of sheaf theory" (LNM 753, 1979,
DOI 10.1007/BFb0061812) or Houzel's chapter in Kashiwara-Schapira, *Sheaves on Manifolds*
(both paywalled).

**Verdict: confirmed, with one precision.** Leray was a POW 1940-45 in Oflag XVII-A, Austria,
and taught algebraic topology there. The proto-sheaf structure appears in the 1945 captivity
course, but the word "faisceau" and the explicit notion date from **1946** (CRAS, after
release), defined on closed sets. The "Weierstrass germs → étalé space" genealogy is
supported only by tertiary sources; for a primary citation, use Gray 1979 or Houzel.

---

## 9. Singer, "Angular synchronization by eigenvectors and semidefinite programming"

**Citation.** A. Singer, "Angular synchronization by eigenvectors and semidefinite
programming," *Applied and Computational Harmonic Analysis* 30(1):20-36, 2011 (January).
DOI 10.1016/j.acha.2010.02.001. arXiv:0905.3174 (v2, Nov 2009).

**Setup (abstract and Sec. 1).** "The angular synchronization problem is to obtain an accurate
estimation (up to a constant additive phase) for a set of unknown angles θ_1,...,θ_n from m
noisy measurements of their offsets θ_i − θ_j mod 2π." The measured pairs form the edge set of
a graph G = (V,E).

**Matrix (eq. 1.6).** H_ij = e^{ι δ_ij} for {i,j} ∈ E and 0 otherwise, where δ_ij is the
**measured** offset. "H is Hermitian ... because the offsets are skew-symmetric." Estimator
(eq. 1.7): e^{ι θ̂_i} = v_1(i)/|v_1(i)|, where v_1 is the top eigenvector. For good edges,
H_ij = e^{ι(θ_i−θ_j)}; the paper defines H from the noisy δ_ij, and it equals e^{ι(θ_i−θ_j)}
only on noise-free edges. There is also an SDP relaxation (eqs. 1.8-1.10), likened to
Goemans-Williamson.

**Outlier model and robustness.** Outliers are offsets "uniformly distributed in [0, 2π) and
carry no information on the true offsets". Sec. 4 model: with probability p an edge is good
(H_ij = e^{ι(θ_i−θ_j)}), and otherwise H_ij is uniform on the circle. Random-matrix analysis
(Wigner semicircle, rank-one perturbation), complete graph: "the top eigenvector of H ... has
a non-trivial correlation with the vector of true angles as soon as the proportion p of good
offset measurements becomes greater than 1/√n. In particular, the correlation goes to 1 as
np² → ∞". Abstract example: "we successfully estimate n = 400 angles from a full set of
m = C(400,2) offset measurements of which 90% are outliers in less than a second." Sec. 5:
the method is information-theoretically near-optimal, since "no method whatsoever can
accurately estimate the angles if the proportion of good measurements is o(√n/m)."

**Verdict: confirmed, with one precision.** The paper defines H_ij from the measured offsets,
H_ij = e^{ιδ_ij}. The form e^{ι(θ_i−θ_j)} holds only on good edges. The robustness threshold
for the complete graph is p > 1/√n.

---

## 3 (addendum, 2026-09-28 session 3): Robinson re-read for essay 03

Both arXiv PDFs re-extracted (1603.01446v3, 1805.08927v6). Read and used:
2017 Problem 19 (nearest global section in the sup distance), Def. 20, Prop. 23 with its
proof (D(a, s) >= eps / (1 + K) for K-Lipschitz restrictions), Prop. 25 (claims a unique
solution of Problem 19 for sheaves of Banach spaces), Theorem 29 (Leray, stated with
citations to Leray, Hubbard and Bredon; a secondary statement, so the essay 02 Leray lead
stays open for a primary source). 2020 Def. 7, Prop. 1, Remark 3 (radius, not diameter),
Def. 15-17 and Prop. 8-9 (local radius, assignments supported on a subset, epsilon-consistent
collections), Example 4 (constant sheaf, circumcentre extension), Sec. 9 and Def. 19 (star
consistency radius; star-supported assignments can have larger radius, Example 2).

Caveat: Prop. 25's uniqueness fails for the max norm (see the LEDGER example with two
sensors of x and one of y). The essays do not repeat it.

## 10. Intel Berkeley Research Lab sensor data

https://db.csail.mit.edu/labdata/labdata.html (page read 2026-09-28). 54 Mica2Dot motes
with weather boards, 28 Feb to 5 Apr 2004, readings about every 31 s; schema date, time,
epoch, moteid, temperature (C), humidity, light, voltage; mote_locs.txt gives x, y in
metres from the upper right corner of the lab. Collected by Peter Bodik, Wei Hong, Carlos
Guestrin, Sam Madden, Mark Paskin and Romain Thibaux; use permitted with acknowledgement.
Essay 03's data file is built by scripts/sheaves-intel-lab.mjs from data.txt.gz and
mote_locs.txt.

---

## 2 (addendum, 2026-09-28 session 4): Hansen & Ghrist re-read for essay 05

Read Secs. 1-9 and 12 of the arXiv text in full. The dynamics are: (4.1) opinion diffusion,
(5.1) stubborn agents with Thm 5.1 (limit is the harmonic extension nearest x0), (6.1) linear
control with Thms 6.1/6.2 (stabilizable/detectable when relative H^0 vanishes), (7.1) weighted
reluctance via a stubborn "parent" on an augmented graph, (8.1)-(8.3) restriction-map diffusion
with Thm 8.1, (9.1) the joint flow with Lemma 9.1, Thms 9.2-9.4, and Secs. 10-12 nonlinear,
bounded-confidence and antagonistic dynamics. **There is no diffusion on expressed 1-cochains**;
the paper's "evolution of expression" is the map flow. Thm 9.3 as printed writes the condition
with x0^T x0 where the proof uses x x^T. The proof's d/dt diag(M) = 0 is the conserved
quantity used in essay 05.

## 11. Zachary's karate club

**Citation.** W. W. Zachary, "An Information Flow Model for Conflict and Fission in Small
Groups," *Journal of Anthropological Research* 33(4):452-473, December 1977. DOI
10.1086/jar.33.4.3629752 (Crossref, confirmed this session). Paper not read.

**Data used.** NetworkX `karate_club_graph` (networkx/generators/social.py, main branch,
fetched 2026-09-28): 34x34 matrix of interaction counts and the 'club' attribute ("Club After
Split From Data" column of Zachary's Table 3; Mr. Hi's club = nodes 0-8, 10-13, 16, 17, 19,
21). The matrix is asymmetric in 7 pairs (e.g. (0, 12) is 2 above the diagonal and 1 below,
(22, 33) is 0 above and 3 below); NetworkX keeps the lower-triangle value because it adds
rows in order. The union of nonzero entries is the standard 78-edge graph, which is what the
page uses, unweighted.

---

## 4 (addendum, 2026-09-28 session 5): Bodnar et al. re-read for essay 06

Read in the arXiv PDF (2202.04579, text extracted with pypdf): Secs. 2 to 6, App. B proofs of
Props. 8 to 11, App. E, App. F. Model details the page relies on: eq. 6 layer; eq. 55 learned
(1 + eps) "used across all of our experiments in the discrete models"; augmented normalisation
(D + I)^{-1/2}; Phi = sigma(V[x_v || x_u]); O(d) maps from Householder reflections via Torch
Householder; WebKB learning rate 0.02, hidden channels 8 to 32, stalk dim 1 to 5, layers 2 to 8,
ELU. Linear separation in Def. 7 is affine (Prop. 9's proof compares sqrt weighted degrees across
classes). Prop. 10 as printed writes y_v = +/- sqrt(sum alpha_e); with maps +/- alpha_e the
weighted degree is sum alpha_e^2, a harmless slip. The synthetic experiment keeps the sheaf fixed
over time and learns it from X(0).

Splits verified: the ten `<name>_split_0.6_0.2_<k>.npz` files hold 48/32/20% of nodes
(Texas 87/59/37), so the filename is misleading and NSD's 48/32/20 is right. Edge homophily of
Texas with undirected non-loop edges is 0.061 (17 of 279); the 0.108 above counts directed lines
with self-loops. Data file: `docs/sheaves/data/webkb.js` from `scripts/sheaves-webkb.mjs`.
