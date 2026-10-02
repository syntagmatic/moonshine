# Source check for 05 Reading the Matrix (2026-10-02)

Every check below was made against primary text: full text, the publisher supplement, or the
authors' arXiv LaTeX source, as noted for each item. Working copies of the downloaded texts sit in
the session scratchpad (gu.xml/gu_supp.pdf, tu.pdf, wu_par.pdf + wusrc/, re.pdf, slam.pdf,
abh (CiteSeerX PDF), fiedler.pdf, var.xml + vsrc/, fbsrc/, ngsrc/). None of them were copied
into the repo.

## 1. Gu et al. 2015, Nat Commun 6, 8414. CONFIRMED, WITH TWO CORRECTIONS (normalisation; ranks)
Sources: full text, Europe PMC JATS of PMC4600713 (https://europepmc.org/article/PMC/PMC4600713),
equation images from https://www.nature.com/articles/ncomms9414 (Equ1 to Equ3), and the
Supplementary Information PDF (41467_2015_BFncomms9414_MOESM132_ESM.pdf, 42 pp).
doi 10.1038/ncomms9414, published 1 Oct 2015. Authors: Gu, Pasqualetti, Cieslak, Telesford, Yu,
Kahn, Medaglia, Vettel, Miller, Grafton, Bassett.

Model (Methods, "Dynamic model of neural processes", Eq. 1):
"x(t+1) = A x(t) + B_K u_K(t)", "a simplified noise-free linear discrete-time and time-invariant
network model". "The diagonal elements of the matrix A satisfy Aii=0." B_K = [e_k1 ... e_km]
(Eq. 2); "we ... choose control nodes one at a time, and thus the input matrix B in fact reduces
to a one-dimensional vector."

Gramian (Eq. 3), infinite horizon: "W_K = sum_{tau=0}^{inf} A^tau B_K B_K^T A^tau".

Normalisation. The paper does NOT say A/(1+xi_0(A)). Main text, Methods: "we construct a
weighted adjacency matrix whose elements indicate the number of white matter streamlines
connecting two different brain regions ... and we stabilize this matrix by dividing by the the
mean edge weight." The supplement calls it "A our (normalized) adjacency matrix" and "Since A is
stable" (Supp. Methods, pp. 3-4), with no other formula.
The 1 + largest-eigenvalue form comes from the follow-ups and the lab's code, not from this paper:
- Tu et al. 2018 (item 2) describe "the Gu et al. approach" as "A_norm = A/(1 + lambda_max(A));
  where lambda_max(A) is the maximum absolute value of the eigenvalues of the matrix A".
- Wu-Yan et al. 2018 (item 2) Sec. 2.2.1: "we scaled the elements of A by 1/(1 + lambda_max)
  (where lambda_max is the largest eigenvalue of unscaled A), which ensures that the scaled
  version of A is Schur stable".
- nctpy (Bassett lab package; ave_control cites Gu 2015), utils.matrix_normalization:
  `A_norm = A / (c + l)` with `l = np.abs(w).max()` over eigenvalues, default c=1
  (https://github.com/BassettLab/nctpy, src/nctpy/utils.py).
For symmetric nonnegative A, the largest |eigenvalue| equals the largest singular value, so
"1 + xi_0" and "1 + lambda_max" are the same number. Attribute the formula to the follow-up
literature or the standard code, not to Gu 2015's text.

Average controllability (Methods, "Average controllability"): "As a known result, average input
energy is proportional to Trace(W_K^-1), the trace of the inverse of the controllability Gramian.
Instead, we adopt Trace(W_K) as a measure of average controllability for two main reasons: first,
Trace(W_K^-1) and Trace(W_K) satisfy a relation of inverse proportionality ... and, second, W_K is
typically very ill-conditioned ... It should be noted that Trace(W_K) encodes a well-defined
control metric, namely the energy of the network impulse response or, equivalently, the network
H2 norm." So: trace of the (infinite-horizon) Gramian, not of its inverse.
Caveat for the essay: Wu-Yan et al. 2018 write "average controllability ... is computed as
zeta = Trace(W_K^-1)" (their Eq. 4), the opposite of Gu's text. Use Trace(W_K).

Their own degree explanation (Supp. Methods, "Correlation Between Degree and Average
Controllability", pp. 3-4, Supp. Eq. 4): "the average controllability with a single control node
j equals the j-th diagonal elements of (I - A^2)^-1. Since A is stable, a first order
approximation yields (I - A^2)^-1 ~ I + A^2, ... and the j-th diagonal element of (I - A^2)^-1 is
1 + sum_i A_ij^2. Since the degree of the j-th node equals d_j = sum_i A_ij, a positive
correlation between node degree and average controllability is mathematically expected in the
networks that we study here."

Data (Methods): DSI, "eight subjects in triplicate", "257 directions using a Q5 half-shell
acquisition scheme with a maximum b-value of 5,000 and an isotropic voxel size of 2.4 mm";
reconstructed in DSI Studio with QSDR; "Deterministic fibre tracking using a modified FACT
algorithm was performed until 100,000 streamlines were reconstructed for each individual."
Lausanne 2008 atlas, "A parcellation scheme including 234 regions". Edges are streamline counts:
"sparse, weighted, undirected structural brain networks for each subject (N=8) and each scanning
session (n=3)". Replications: DTI in 85 adults (30 directions, b=1,000), same 234-region atlas;
macaque CoCoMac "2,402 projections between 95 cortical and subcortical areas".

Did they report the correlation themselves? YES.
Results, "Average controllability": "the average controllability is strongly correlated with
weighted degree (also known as node strength; Pearson correlation r=0.91, P=8 x 10^-92; Fig. 2b)".
Modal: "r=-0.99, P=2 x 10^-213" (Fig. 2d). Boundary: "r=0.13, P=0.03" (Fig. 2f).
These are correlations between RANKS averaged over subjects and sessions, not raw values. Fig. 2b
legend: "Scatter plot of weighted degree (ranked for all 234 brain regions), averaged across three
scanning sessions and eight persons, versus average controllability". Methods: "for each of the
controllability diagnostics we (i) rank the scalar values for each subject and (ii) average the
ranked values across the subjects."
Replications (Fig. 3 legend): DTI r=0.88 (P=1.0 x 10^-78), macaque r=0.90 (P=4.9 x 10^-34).
(The DTI text gives P=2.5 x 10^-80 for the same r=0.88.)
Supp. Table 2 (p. 18), rank degree vs AC across Lausanne scales: Scale 33 (N=83) 0.9764;
Scale 60 0.9429; Scale 125 (N=234) 0.9205; Scale 250 0.9114; Scale 500 (N=1015) 0.9122.
Wording for the essay: "Gu et al. themselves reported r = 0.91 between ranked average
controllability and ranked strength (234 regions, 8 people, 3 scans each)."

## 2. Follow-ups: average controllability is close to degree. PARTLY CONFIRMED; Wu-Yan does not report it

### Tu et al. 2018, NeuroImage 176, 83-91. CONFIRMED
doi 10.1016/j.neuroimage.2018.04.010. Authors: Tu, Rocha, Corbetta, Zampieri, Zorzi, Suweis.
Source: published PDF (repository copy),
https://research.unipd.it/retrieve/e14fb26f-8846-3de1-e053-1705fe0ac030/1-s2.0-S1053811918302982-main.pdf
(arXiv 1705.08261 is an earlier version).
Abstract: "random null models, with no biological resemblance to brain network architecture,
produce the same type of relationship observed by Gu et al. between the average/modal
controllability and weighted degree."
Data (p. 85): four human sets from the USC Multimodal Connectivity Database: APOE-4 (30 + 25
people, n=110 regions), Rockland (195 people, n=188), Hagmann 2008 (average of 5 people, n=66),
Autism (94 people, n=264); plus synthetic BA, small-world and ER networks matched to APOE-4.
Normalisation: "A_norm = A/(1 + lambda_max(A))" (quoted in item 1).
They report LINEAR FITS on averaged-rank plots, not correlation coefficients. Table 2 (p. 89):
"the results of the linear fit describing the relation between node controllability and degree.
Upper row: empirical brain data; lower row: the corresponding randomized networks. Each cell
includes an angular coefficient, its standard error and the goodness of fit (R2)."
Average controllability, empirical / randomized:
- Rockland: m=0.93 +- 0.021, R2=0.91 / m=0.90 +- 0.024, R2=0.88
- APOE-4: m=0.76 +- 0.038, R2=0.79 / m=0.83 +- 0.023, R2=0.92
- Autism: m=0.88 +- 0.031, R2=0.75 / m=0.86 +- 0.016, R2=0.92
- Hagmann: m=0.96 +- 0.036, R2=0.92 / m=0.92 +- 0.05, R2=0.84
(Columns read from layout-mode extraction of the PDF table; R2 = r^2 of the rank-rank fit, so
r is roughly 0.87 to 0.96.)
Text (p. 88): "this is true for any network satisfying a_ij << 1, also the random ones", and
"the range in values of both average and modal controllability is extremely limited, a feature
not evident in the work of Gu et al. (2015) as they showed only rank-rank plots."
Randomization: rewiring that "kept the in-degree and out-degree of each node" (null model 1) and
a configuration model keeping the degree sequence (null model 2).

### Wu-Yan et al. 2018, J Nonlinear Sci. DOES NOT REPORT an AC-degree correlation
doi 10.1007/s00332-018-9448-z; open access; received 21 Sep 2017, accepted 5 Feb 2018 (online
2018). Crossref lists the issue as J Nonlinear Sci 30(5), 2195-2233 (Oct 2020): cite as "J
Nonlinear Sci 30, 2195-2233 (2020; online 2018)". Authors: Wu-Yan, Betzel, Tang, Gu, Pasqualetti,
Bassett. Sources: accepted PDF https://par.nsf.gov/servlets/purl/10066854 and arXiv 1706.05117
(v1 LaTeX).
They benchmark global, average, modal and boundary controllability on 8 canonical graphs (WRG,
RL, WS, MD2, MD4, MD8, RG, BA), 128/256/512 nodes, with Gaussian, power-law, streamline-count and
FA edge weights. The correlations they report are AC vs MC, AC vs BC and MC vs BC (Spearman rho),
across nodes and across graphs. I found no correlation of average controllability with degree or
strength anywhere in the paper or supplement ("strength" appears only as "connection strength").
Do not cite it for "AC ~ degree". Note their Eq. 4 defines AC as Trace(W_K^-1) (item 1).

### Pasqualetti, Gu & Bassett 2019, "RE: Warnings and caveats in brain controllability",
NeuroImage 197, 586-588. CONFIRMED; DOES NOT DISPUTE the degree correlation
doi 10.1016/j.neuroimage.2019.05.001. Source: accepted PDF https://par.nsf.gov/servlets/purl/10105276.
They argue "(i) brain networks are controllable from a single region, (ii) brain networks require
large control energy, and (iii) brain networks feature distinctive controllability properties
with respect to a class of random network models." Their evidence is Fig. 1, which places brain
networks (FA-weighted, 128 nodes, 30 networks) apart from canonical random models in
(average, modal, boundary) space. They say nothing about the correlation with degree. On null
models: "the fact that certain random networks may feature controllability properties similar to
brain networks cannot invalidate the direct analysis conducted in [1]".

### Suweis et al. 2019, "Brain controllability: Not a slam dunk yet", NeuroImage 200, 552-555
doi 10.1016/j.neuroimage.2019.07.012; arXiv 1906.06778. "it is useful to remind the reader that
modal and average controllability show near-perfect correlations with node degree (see [1], [2],
[9])" ([1] Tu 2018, [2] Gu 2015, [9] Medaglia et al. 2018 J Neurosci).

### Average controllability on the C. elegans connectome: NONE FOUND
Tu 2018 analyses the worm (N2U, JSH from WormAtlas) only by STRUCTURAL controllability (maximum
matching): "N_D = 18 and N_D = 21 to control the N2U and L4 individuals". Yan et al. 2017
(Nature 550, 519) and Towlson & Barabasi (arXiv 1907.11297) use structural controllability;
Badhwar & Bagler 2015 (PLoS ONE e0139204) use driver nodes; Liu et al. 2025 (Biomimetics
10, 744) use structural and target control. A Europe PMC search for "average controllability"
AND elegans returned only human or theoretical papers. If the essay computes AC on the worm, say
it is our own computation, not a published one.

## 3. Atkins, Boman & Hendrickson 1998, SIAM J Comput 28(1), 297-310. CONFIRMED
doi 10.1137/S0097539795285771. Source: the published SIAM PDF (CiteSeerX 10.1.1.104.6137 via
web.archive.org). (An earlier version exists as the Sandia/OSTI report "A spectral algorithm for
the seriation problem", Nov 1994, OSTI 10107947.)
Sec. 2.1 (p. 300): Laplacian "L_A = D_A - A, where D_A is a diagonal matrix with
d_ii = sum_j a_ij". "the Fiedler value is given by min_{x^T e = 0, x^T x = 1} x^T L_A x, and a
Fiedler vector is any vector x that achieves this minimum".
Sec. 2.3 (pp. 300-301), the relaxation: "We define g(pi) = sum_(i,j) f(i,j)(pi_i - pi_j)^2.
Unfortunately, minimizing g is NP-hard due to the discrete nature of the permutation [13].
Instead we approximate it by a function h of continuous variables ... h(x) = sum_(i,j)
f(i,j)(x_i - x_j)^2." Eq. (1): "Minimize h(x) = sum_(i,j) f(i,j)(x_i - x_j)^2 subject to
sum_i x_i = 0, and sum_i x_i^2 = 1." "We can rewrite h(x) as x^T L_F x ... Consequently, a
solution to the constrained minimization problem is just a Fiedler vector." "Even if the problem
is not well posed, sorting the entries of the Fiedler vector generates an ordering that tries to
keep highly correlated elements near each other."
So yes: the Fiedler order is the sorted solution of the continuous relaxation of
sum w_ij (pi_i - pi_j)^2, with zero-mean and unit-norm constraints. (Strictly, h counts each
unordered pair once if the sum is over pairs, which gives x^T L x.)
The exactness result: Theorem 3.2 "If A is an R-matrix then it has a monotone Fiedler vector";
Theorem 3.3: for a pre-R-matrix with a simple Fiedler value and no repeated entries in the
Fiedler vector, sorting it gives the R-matrix orderings. R-matrix (p. 299): symmetric with
"a_ij <= a_ik for j < k < i, a_ij >= a_ik for i < j < k" (entries fall off away from the
diagonal). It recovers an ordering exactly only when such an ordering exists.
Fiedler refs in ABH: "[10] M. Fiedler, Algebraic connectivity of graphs, Czech. Math. Journal, 23
(1973), pp. 298-305. [11] M. Fiedler, A property of eigenvectors of nonnegative symmetric
matrices and its application to graph theory, Czech. Math. Journal, 25 (1975), pp. 619-633."

Fiedler 1973. CONFIRMED. Czechoslovak Mathematical Journal 23(98), No. 2, 298-305 (1973), doi
10.21136/CMJ.1973.101168. Source: DML-CZ PDF
https://dml.cz/bitstream/handle/10338.dmlcz/101168/CzechMathJ_23-1973-2_11.pdf. "We shall call
the second smallest eigenvalue a(G) of the matrix A(G) algebraic connectivity of the graph G."
The eigenvector (ordering) properties are in the 1975 paper [11]; cite 1973 for the eigenvalue
and 1975 for the vector, or both.

## 4. Varshney et al. 2011, PLoS Comput Biol 7(2), e1001066. YES; the axis splits head from cord, it is not sensory-to-motor
Sources: Europe PMC JATS of PMC3033362; arXiv 0907.2373 LaTeX source including the figure EPS
files (sideview.eps, topview.eps).
Fig. 2 legend: "(a). Signal flow view shows neurons arranged so that the direction of signal flow
is mostly downward. (b). Affinity view shows structure in the horizontal plane reflecting
weighted non-directional adjacency of neurons in the network."
Axis labels in the figure source: sideview.eps (Fig. 2a, "SIGNAL FLOW VIEW") has axes
"processing depth" and "normalized Laplacian eigenvector 2"; topview.eps (Fig. 2b, "AFFINITY
VIEW") has "normalized Laplacian eigenvector 2" and "normalized Laplacian eigenvector 3".
Text (Results): "The vertical axis in Figure 2(a), represents the position of neurons in the
signal flow hierarchy [34], [35] of the chemical synapse network with sensory neurons at the top
and motor neurons at the bottom". "Neuronal position on the horizontal plane, Figure 2(b),
represents the connectivity closeness of neurons in the combined chemical and electrical synapse
network. Neuronal coordinates are given by the second and third eigenmodes of the symmetrized
network's graph Laplacian". "Thus, Figure 2 represents not the physical placement of neurons in
the worm but signal flow and closeness in the network. Such visualization reveals that
motorneurons and some interneurons segregate into two lobes along the first horizontal axis: the
right lobe contains motorneurons in the ventral cord and the left lobe consists of neck neurons.
The bi-lobe structure suggests partial autonomy of motorneurons in the ventral cord and neck."
(The arXiv version says "neck/tail neurons" and "ventral cord and neck/tail"; the published text
says "neck".)
Method (Text S1; arXiv appendix "Algorithm for Directed Network Drawing"): W = (A + A^T)/2 with
A = gap + chemical; L = D - W; "To find the horizontal coordinates, we use the Laplacian, L,
normalized by the number-of-terminals matrix D, Q = D^-1/2 L D^-1/2. The eigenmodes
corresponding to the second and third lowest eigenvalues of Q are denoted v2 and v3. Then, the
horizontal coordinates are x = D^-1/2 v2 and y = D^-1/2 v3." Vertical: minimize
E = 1/2 sum W_ij (z_i - z_j - sgn(A_ij - A_ji))^2, solved as L z = b with a pseudoinverse.
So their axis is the random-walk (generalized, L x = lambda D x) Fiedler vector of the combined
symmetrized network, not the unnormalised Laplacian of ABH.
What the eigenvector-2 axis corresponds to: the paper says neck vs ventral-cord motor neurons. My
own reading of the label x-positions in sideview.eps (278 labels; not a quote): the far left is
all nerve-ring and head neurons (URA, IL1, IL2, RME, RIP, OLQ, RMD; 68 head-class labels average
x = 4,023); the far right is mid-body ventral-cord motor neurons (VB03 to VB06, DD02 to DD05,
VD03 to VD08; 72 VNC labels average x = 9,750); tail neurons (PHA/B/C, PLM, LUA, PVD, DVB, PDA,
PDB, PVN, PVW, PQR) sit at x = 8,100 to 9,640, beside the cord and not beyond it. ALN, PLN and
PVQ sit nearer the middle.
Wording for the essay: the second eigenvector separates head neurons from ventral-cord and tail
neurons, a body-position split (roughly anterior vs posterior), and not the sensory-to-motor
axis, which Varshney et al. put on the separate vertical "processing depth" axis. Calling it
"head-to-tail" overstates it a little: the extreme end is mid-cord motor neurons, not the tail.
Check our own Fiedler order against body position before printing "head to tail".
Also (arXiv text, published numbers lost as images): sensory-to-motor "depth is typically 2--3
[Durbin 1987]".

## 5. Fortunato & Barthelemy 2007, PNAS 104(1), 36-41. CONFIRMED; notation differs
doi 10.1073/pnas.0605965104. Sources: arXiv physics/0607100 LaTeX source; the PMC1765466 page
(read through a fetch tool) for equation numbering. The arXiv numbering matches the PMC
equation numbers seen (Eq. 1, 17, 21).
Eq. 1: "Q = sum_{s=1}^{m} [ l_s/L - (d_s/2L)^2 ]", "l_s is the number of links inside module s,
L is the total number of links in the network, and d_s is the total degree of the nodes in module
s" (they cite Newman & Girvan 2004).
Eq. 12: two modules stay separate (Q_A > Q_B) when l_2 > 2 L a_1 / ((a_1+b_1+2)(a_2+b_2+2)).
Eq. 16: l < l_R^max = L/4 (fuzzy modules). Eq. 17: with one link between the two modules and one
to the rest (a_1=a_2=b_1=b_2=1/l), Eq. 12 fails for "l < l_R^min = sqrt(L/2)".
Eq. 21: "if modularity optimization finds a module S with l_S internal links, it may be that the
latter is a combination of two or more smaller communities if l_S < 2 l_R^min = sqrt(2L)."
So sqrt(2L) is the internal-link count of a merged module (two merged modules of sqrt(L/2) links
each). The published abstract gives no formula ("a scale which depends on the total size of the
network and on the degree of interconnectedness of the modules"); only the arXiv abstract says
"of the order of sqrt(2L) or smaller".
Ring of cliques (Sec. "Consequences", Fig. 3A). THEIR NOTATION: n cliques, each K_m with m nodes
(the reverse of "m cliques of size k"). "the network has a total of N = nm nodes and
L = nm(m-1)/2 + n links." Eq. 18: "Q_single = 1 - 2/(m(m-1)+2) - 1/n". Eq. 19:
"Q_pairs = 1 - 1/(m(m-1)+2) - 2/n". Eq. 20: "The condition Q_single > Q_pairs is satisfied if
and only if m(m-1) + 2 > n." Example: "for m=5 and n=30, Q_single=0.876 and Q_pairs=0.888 >
Q_single" (checked: 1 - 2/22 - 1/30 = 0.8758; 1 - 1/22 - 2/30 = 0.8879).
In the essay's notation (m cliques of k nodes): pairs win when m > k(k-1) + 2, i.e. more than
k(k-1)+2 cliques. The Fig. 3 legend gives the loose form: "If the number of cliques is larger
than about sqrt(L), modularity optimization would lead to a partition where the cliques are
combined into groups of two or more". Strictly, Eq. 20 compares only singles against pairs; it
shows singles are not the maximum, without claiming pairs are.

## 6. Newman & Girvan 2004, Phys Rev E 69, 026113. CONFIRMED
"Finding and evaluating community structure in networks", M. E. J. Newman and M. Girvan, Phys.
Rev. E 69(2), 026113, published 26 Feb 2004, doi 10.1103/PhysRevE.69.026113. Source: arXiv
cond-mat/0308217 v1 LaTeX (section "Quantifying the strength of community structure").
"Let us define a k x k symmetric matrix e whose element e_ij is the fraction of all edges in the
network that link vertices in community i to vertices in community j". "we further define the
row (or column) sums a_i = sum_j e_ij, which represent the fraction of edges that connect to
vertices in community i ... we can define a modularity measure by Q = sum_i (e_ii - a_i^2) =
Tr e - ||e^2||" (Eq. 5 in the arXiv source; the published equation number was not checked).
"If the number of within-community edges is no better than random, we will get Q=0. Values
approaching Q=1, which is the maximum, indicate strong community structure". "In practice, values
for such networks typically fall in the range from about 0.3 to 0.7."
This is the same quantity as Fortunato-Barthelemy Eq. 1 with e_ss = l_s/L and a_s = d_s/2L.
