# Claims ledger: Noether series

This series has not had a full fact-check. The rows below are only the leads
flagged in `plans/FACT-CHECK.md` and settled on 2026-09-27.

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 04 | A transformation changing L by a total derivative is "a symmetry of the equations of motion ... and it still gives a Noether conservation law" | misleading, fixed | Noether needs the total-derivative form of δL, not EOM invariance. Fig 1's rescaling q -> λq preserves q'' = 0 but multiplies L by λ², so Noether gives nothing from it | Said the conservation law comes from the total-derivative form, and that EOM invariance alone (the Fig 1 rescaling) gives none |
| 06 | Driven oscillator: "the Hamiltonian tracks that loss" | wrong, fixed | L = ½mq'² - ½kq² + q f(t); dH/dt = -∂L/∂t = -q f'(t), either sign | Replaced "loss" with the rate -q f'(t) and a note that the drive can add or remove energy |
| 07 | Pauli 1926 gave "the first quantum-mechanical derivation of the hydrogen spectrum" | defensible but contested, reworded | Pauli, Z. Phys. 36 (1926) 336, received 17 Jan 1926; Schrödinger, Ann. Phys. 79 (1926) 361, received 27 Jan 1926 | Now: January 1926, from matrix mechanics, submitted ten days before Schrödinger's wave-equation solution |
| 07 | Hermann and Johann Bernoulli around 1710, Laplace 1799, Hamilton 1840s | fine | Goldstein, Am. J. Phys. 43 (1975) 737 and 44 (1976) 1123; Laplace, Traité de mécanique céleste vol. 1 (1799); Hamilton 1845-47. Wikipedia "Laplace-Runge-Lenz vector", History | none |
| 09 | Noether came to Göttingen "in the spring of 1915" | fine | She arrived late April 1915 (Kimberling; MacTutor biography) | none |
| 09 | Of the ten Einstein equations "only six are independent, because the other four are fixed by the Bianchi identity" | loose, fixed | The contracted Bianchi identity gives four differential relations; the four G^{0ν} equations become constraints on initial data, not algebraic consequences of the other six (cf. Carroll, Spacetime and Geometry, §4.2) | "effectively only six are independent", four differential relations, parenthetical on constraints |
| 11 | Fig 1: a chain from (12) "has at most length d(12) = 6" | loose, fixed | Each strict step removes at least one prime factor of 12 = 2·2·3, so at most Ω(12) = 3 strict steps, e.g. (12) ⊂ (6) ⊂ (3) ⊂ (1) | Caption now gives three strict steps with that example |
| 11 | ACC is a condition "Dedekind used implicitly and Noether made explicit" | understated, fixed | Toader, "Why Did Weyl Think that Emmy Noether Made Algebra the Eldorado of Axiomatics?" (arXiv:2408.08552): ACC "had been articulated first by Dedekind (in 1894) for rings of algebraic integers" | Now: Dedekind stated it in 1894 for rings of algebraic integers; Noether made it an axiom for all commutative rings |
| 12 / index / PROMPT | Buchberger's algorithm is "the constructive answer" to Gordan's objection | wrong framing, fixed | Gordan objected to Hilbert's non-constructive finiteness proof for invariant rings; Buchberger (1965) computes Gröbner bases of polynomial ideals. The page body already calls it "a constructive counterpart" for ideals | Index card and PROMPT.md now call it a later constructive tool for ideals that halts by the same chain condition |
| 13 | The cone z² = xy opens "along the z-axis" | wrong, fixed | x = u + v, y = u - v gives z² + v² = u²: a circular cone around the u-axis, i.e. the line x = y, z = 0 | Axis stated with the substitution; Fig 2 caption notes the schematic is drawn upright |
| 13 | A generic point of the plane has two preimages on the cone | holds over C only, fixed | Over R, z² = xy has two real roots only where xy > 0 and none where xy < 0 | Prose and Fig 2 caption say "over the complex numbers" and describe the real case |
| 13 | Proof uses a generic linear change of variables | incomplete, fixed | Generic c_i need an infinite field; over a finite field Nagata's substitution x_i -> x_i + x_n^{r^i} works (e.g. Eisenbud, Commutative Algebra, Thm 13.3) | Added a sentence on infinite fields and the finite-field substitution |
| 12 | "What fails without Noetherianness": I = (x_1, x_2, ...) in k[x_1, x_2, ...][x] gives a never-stabilizing J_d chain, breaking step (2); display rendered placeholder text | wrong, fixed | For that I every J_d = (x_1, x_2, ...), so the chain is constant and the proof fails at step (3), J_0 not finitely generated. For I = (x_1 x, x_2 x^2, ...) the coefficient of x^j in any element lies in (x_1, ..., x_j) and x_d x^d is in I, so J_d = (x_1, ..., x_d), strictly increasing | Example ideal changed to (x_1 x, x_2 x^2, ...); display now shows J_1 ⊊ J_2 ⊊ J_3 ⊊ ... with a one-line reason; step (2) claim now true |
| 08 | Gauge rule A_μ -> A_μ + ∂_μα / q with D_μ = ∂_μ - iqA_μ/ħ | wrong, fixed | D(e^{iα}ψ) = e^{iα}(∂ψ + i∂α ψ - iqA'ψ/ħ); cancellation needs qA'/ħ = qA/ħ + ∂α, so A' = A + (ħ/q)∂α | Rule now A_μ -> A_μ + (ħ/q)∂_μα |
| 08 | Table: U(1)_Q -> photon (QED), SU(2)_L -> W±, Z | wrong, fixed | The gauge group is SU(2)_L × U(1)_Y with bosons W±, Z, γ; U(1)_Q is the unbroken combination after symmetry breaking (any SM text, e.g. PDG review "Electroweak model and constraints on new physics") | Row replaced by SU(2)_L × U(1)_Y -> W±, Z, photon; a sentence after the table explains U(1)_Q as the unbroken subgroup, electric charge, photon, QED |
| 01 | Fig 3 prose: off the diagonal the orbit has eight points | wrong, fixed | A nonzero point on an axis, e.g. (1, 0), is fixed by the reflection across that axis; orbit {(±1, 0), (0, ±1)} has 4 points | Prose now says a diagonal or an axis gives four points and a reflection in the stabilizer |
| 01 | "The smallest non-trivial finite group in this series is D_4" | wrong, fixed | S_3 (order 6) appears on the same page, Z/2 in part 10 | Now "the first finite group we look at closely" |
| 01 | Invariant functions of a, b, c under S_3 are polynomials in e_1, e_2, e_3, "a classical theorem of Newton" | wrong, fixed | max(a, b, c) is symmetric and in the page's own Fig 4 but not a polynomial; the fundamental theorem is about symmetric polynomials, stated by Waring (Meditationes Algebraicae, 1770), proved by Gauss (1816). Newton gave the power-sum identities | Restricted to symmetric polynomials, max(a, b, c) noted as a non-polynomial example, credited Waring 1770 / Gauss 1816 |
| 10 | Kummer invented ideal numbers in 1847 "trying to prove Fermat's Last Theorem" | popular myth, fixed | H. M. Edwards, "The background of Kummer's proof of Fermat's Last Theorem for regular primes", Arch. Hist. Exact Sci. 14 (1975) 219-236: the motive was higher reciprocity and cyclotomic integers | Now: working on higher reciprocity laws in Z[ζ_p]; he soon applied them to Fermat; cites Edwards 1975. Timeline row (effective for FLT for regular primes) kept |
| 09 | A conserved scalar energy in GR only with a Killing vector | incomplete, fixed | Asymptotically flat spacetimes have ADM energy at spatial infinity and Bondi energy at null infinity without a global Killing vector (Wald, General Relativity, §11.2) | Added the asymptotically flat case with ADM and Bondi energies |
| 03 | Fig 1 static status: straight 1.000 s, sag 0.913 s, cycloid 0.879 s | wrong, fixed | Live values were 0.629 / 0.589 / 0.562 from a midpoint-speed rule that undercounts near v = 0. Exact: straight √(4/g) = 0.639 s; cycloid through (1, -1) has θ = 2.412, R = 0.5729, T = θ√(R/g) = 0.583 s | Integrator (and bead playback) now uses 2 ds / (v_0 + v_1) per chord, exact for uniform acceleration; node run gives 0.639 / 0.600 / 0.583, matching the refined-grid limit. Static text updated to those |
| 04 | Fig 1 no-JS text "δL (at λ = 1.5) = 1.25" | wrong, fixed | ½(λ² - 1) at λ = 1.5 is 0.625; the page's own update() computes 0.6250 | Static text now 0.6250 |
| 11 | A chain from (f) in k[x] has at most deg f + 1 distinct steps | off by one, fixed | Each strict step drops at least one irreducible factor, and f has at most deg f of them, e.g. (x²) ⊂ (x) ⊂ (1) has 2 steps | Now "at most deg f strict steps" |
| 13 | Noether normalization gives a polynomial ring "in fewer variables" | wrong, fixed | d = dim k[x]/I ≤ n with equality for I = 0, as the page's own affine-plane row shows | Now "at most n variables (fewer unless the ideal is zero)" |

### 08 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 08 | Fig 2: the Crank-Nicolson lattice current J = Im(ψ_j* ψ_{j+1})/h satisfies a discrete continuity equation exactly | derived, computed | With m = (ψ^n + ψ^{n+1})/2, h(|ψ_j^{n+1}|² - |ψ_j^n|²) = 2h Re(m_j* Δψ_j) = -dt (J_{j+1/2} - J_{j-1/2}) evaluated on m; the page checks box charge against start value plus integrated edge flux, gap ~1e-14 | none |
| 08 | Adding -λ Re(ψ²) to L gives dN/dt = -(2λ/ħ) ∫ Im(ψ²) dx while energy stays conserved | derived, computed | EOM iħψ_t = Hψ + λψ*; dN/dt = ∫ 2 Re(ψ* ψ_t) = -(2λ/ħ)∫ Im ψ². The implicit midpoint step obeys the same identity exactly on the midpoint; page reports the per-step gap (~1e-13) and energy drift (~1e-14). Unstable for λ at or above the trap ground energy 1 (node run at λ = 1 grows 29×), so the slider stops at 0.6 | none |
| 08 | Implicit midpoint conserves the energy of a linear system exactly | fine (from memory) | Quadratic invariants are conserved by the implicit midpoint rule (Hairer, Lubich, Wanner, Geometric Numerical Integration, ch. IV; cited from memory). Confirmed numerically in node and on the page | none |
| 08 | Wilson built lattice gauge theory with link phases in 1974 | fine (from memory) | K. G. Wilson, "Confinement of quarks", Phys. Rev. D 10 (1974) 2445; cited from memory, not re-read | none |
| 08 | Fig 5: e^{iβx}ψ run with link phases U_j = e^{-iβh} has the same density as ψ at all times | derived, computed | Links transform as U_j -> e^{iα_j} U_j e^{-iα_{j+1}}; with α = βx and U = 1 this gives U_j = e^{-iβh}, and H' = G H G† so the CN evolution commutes with G; page shows max density gap ~1e-14 vs 0.22 without the field at β = 1 | none |

### 12 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 12 | Fig 1: for I = (6x³, 4x³ + 4x² + 5) in ℤ[x] the leading-coefficient chain is (75) ⊊ (15) ⊊ (3) ⊊ (1) = ⋯, d* = 3 | computed, cross-checked | Page computes a BigInt echelon form of all shifts x^k f of degree ≤ 24 and checks degree 40 gives the same chain. Mod 3, I = (x³ + x² + 2) has no nonzero element of degree ≤ 2, so 3 divides J_0, J_1, J_2; mod 5, I = (x²), so 5 divides J_0, J_1. Consistent with 75, 15, 3 | none |
| 12 | Fig 2: a walk that stalls on a leading coefficient outside J_δ proves the input is not in I | derived | Everything subtracted lies in I, so the stalled h is in I iff g is; h ∈ I would put lc(h) in J_δ. Valid because J_δ is computed exactly (Fig 1) | none |
| 12 | Noether (1916): in characteristic zero the invariants of a finite group G acting linearly are generated in degree ≤ \|G\| | fine (from memory) | E. Noether, "Der Endlichkeitssatz der Invarianten endlicher Gruppen", Math. Ann. 77 (1916) 89-92; cited from memory, not re-read | none |
| 12 | Fig 3: for Z/n acting by (ζx, ζ^k y) the invariants are spanned by monomials with a + kb ≡ 0 mod n, and every minimal generator has a, b ≤ n | derived | Diagonal action sends each monomial to a multiple of itself. x^n and y^n are invariant, so a monomial with a > n (or b > n) factors off x^n (y^n). Page finds generators by brute force over that box and shows max degree ≤ n | none |
| 12 | Fig 4: (x² − y, xy − 1) has reduced lex basis {x − y², y³ − 1} and graded basis {x² − y, xy − 1, y² − x}; both leave 3 standard monomials | computed | Exact BigInt-rational Buchberger in the page, matched in node. By hand: y(x² − y) − x(xy − 1) = x − y², and (xy − 1) − y(x − y²) = y³ − 1 | none |
| 12 | Fig 5: y³ − 1 is in (x² − y, xy − 1) but has remainder y³ − 1 on division by the two generators | derived | y³ − 1 = (xy − 1) − y(x − y²) with x − y² = y(x² − y) − x(xy − 1); no leading term of x² − y or xy − 1 (lex) divides y³ | none |

### 05 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 05 | Noether, Invariante Variationsprobleme, Nachr. Ges. Wiss. Göttingen, Math.-Phys. Kl. (1918) 235-257 | fine (from memory) | Standard citation (e.g. Tavel's translation, Transport Theory and Stat. Phys. 1 (1971) 183); cited from memory, not re-read. Kept from the previous page | none |
| 05 | Steps (2)-(4) give δL = d/dt(∂L/∂q̇ X) on any solution for any generator; Fig 1 gap on the true path is finite-difference error | derived, computed | Chain rule plus Euler-Lagrange; the page differences a path sampled at h = 0.001, so the gap is O(h²): 3.4e-7 (X = 1), 6.4e-7 (X = θ), versus 0.184 on the bent path at a = 0.3; node run agrees (8e-8 on 0.1 s samples) | none |
| 05 | Fig 3: at κ = 0 the total momentum drift is rounding because the spring forces cancel at every RK4 stage | derived, computed | Each stage adds k e − k e = 0 to m₁v₁ + m₂v₂, so any Runge-Kutta scheme keeps it to rounding; node and page give 1.7e-15 (dt 0.005), 5.4e-15 (dt 0.0025) | none |
| 05 | Fig 3: drift grows in proportion to κ at small κ | derived, computed | dP/dt = −κ q₁, so ΔP ≈ −κ ∫ q₁ dt to first order; page fits slope 0.993 over κ ≤ 0.01; halving the step changes drifts by < 1e-10 relative | none |
| 05 | Fig 4: only translation and boost on the free particle conserve Q; the drift equals ∫(δL − Ḟ) dt | derived, computed | e.g. pendulum X = 1 from θ = π/3 at rest: Q = θ̇ ranges over 2·√(2(1 − cos 60°)) = 2.00, as shown; free particle X = q: Q = q q̇ = 0.5 + t, range 6.00. Trapezoid prediction matches Q to ~1e-5 | none |
| 05 | Fig 5: vertical shift under gravity gives Q = mẏ + mgt with F = −mgt | derived | δL = −mgε = d/dt(−mgε t); velocity Verlet is exact for a constant force, so the page's spread (~1e-14) is rounding | none |

### 09 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 09 | Fig 1: 7 by 5 open lattice, tree gauge zeroes 34 links (sites − 1) and the remaining 24 are fixed by the 24 plaquettes | derived, computed | 58 links = 30 horizontal + 28 vertical; 35 − 1 = 34 tree links; 58 − 34 = 24 = 6·4 plaquettes. In tree gauge each plaquette gives θ_top = θ_bottom − F, fixing row by row from the zeroed bottom row. Page reports 34 of 34 zeroed and invariant energies changing by ~1e-14 | none |
| 09 | Fig 2: ∂_ν∂_μF^{μν} vanishes to rounding for any A on the grid; the symmetric S gives no identity | derived, computed | Forward differences build F, backward differences build j and ∂·j; difference operators commute, so the discrete identity is exact. Page: max ∂·j 2.8e-14 vs max j 28 (seed 7); for S, 308 vs 69 | none |
| 09 | Toy L = ½m₁(ẋ₁ − a)² + ½m₂(ẋ₂ − a)² − V(x₂ − x₁) has local symmetry x_i → x_i + ε(t), a → a + ε̇ and identity E₁ + E₂ − Ė_a ≡ 0; adding ½μa² turns the sum into μȧ | derived, computed | E_i = −∂V/∂x_i − ṗ_i, E_a = −(p₁ + p₂) − μa; ΣE_i = −d/dt(p₁ + p₂) = Ė_a + μȧ. Page: 2.2e-14 without μ, and with μ = 2 the sum matches μȧ to 3e-5 (finite differences) | none |
| 09 | Fig 4: solutions for different a(t) with the same data at t = 0 differ in x₁ but not in x₂ − x₁ | derived, computed | ẍ₂ − ẍ₁ = −k s (1/m₁ + 1/m₂) is independent of a; page: x₁(8) spreads over 16.0, separation over 1.9e-14 | none |
| 09 | Of the ten Einstein equations effectively six are independent; the four G^{0ν} equations are constraints | fine | Existing row above (Carroll §4.2); wording kept | none |
| 09 | FRW with p = wρ: comoving energy ρa³ ∝ a^{−3w}, and its change equals −∫p d(a³) | derived, computed | ρ̇ = −3H(1 + w)ρ gives ρ ∝ a^{−3(1+w)}; d(ρa³) = −p d(a³) is the same equation. Page integrates Friedmann plus continuity by RK4 and measures slopes −3w to 4 decimals, first-law gap ≤ 1e-6 relative | none |
| 09 | Klein published his exchange of letters with Hilbert on energy in 1918 | fine (from memory) | F. Klein, "Zu Hilberts erster Note über die Grundlagen der Physik", Nachr. Ges. Wiss. Göttingen (1918) 469-482, which prints the letters; cited from memory, not re-read. Kept from the previous page | none |

### 03 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 03 | Johann Bernoulli posed the brachistochrone in the Acta Eruditorum in June 1696; Leibniz, Jakob Bernoulli, Tschirnhaus, l'Hôpital and Newton (anonymously) answered with the cycloid | fine | MacTutor, "The brachistochrone problem"; Wikipedia "Brachistochrone curve" (Acta Eruditorum May 1697 prints Leibniz, Johann, Jakob and a Latin translation of Newton; l'Hôpital's solution was not published until 1988). Checked by web search 2026-09-28 | Tschirnhaus added; "within months" dropped |
| 03 | Hamilton stated the principle in 1834 | fine (from memory) | W. R. Hamilton, "On a General Method in Dynamics", Phil. Trans. R. Soc. 124 (1834) 247-308; cited from memory | none |
| 03 | Fig 1/2 times: straight 0.639 s, sag (a = 0.35) 0.600 s, cycloid 0.583 s; best of the family -x - a sin πx is a = 0.267, T = 0.5970 s, 2.4% above the cycloid | computed | Node: cycloid through (1, -1) has θ = 2.4120, R = 0.5729, T = θ√(R/g) = 0.58290 s; chord rule 2ds/(v0+v1) gives 0.63855 / 0.60004 / 0.58290 at N = 200 to 20000; family scan min at a ≈ 0.265 (page golden-section 0.267) | none |
| 03 | Fig 3: thrown ball L = ½q̇² - gq on [0, 1], least action over 8-segment paths -3.9472, smooth parabola -g²/24 = -4.0098 | derived, computed | S[(g/2)t(1-t)] = g²/24 - g²/12 = -g²/24; discrete EL q_{i+1} - 2q_i + q_{i-1} = -gh² is solved exactly by the parabola's knot values, S = -3.94718 (node and page) | none |
| 03 | Fig 5: oscillator ω = π pinned at q = 0; d²S/dε² along sin(nπt/T) is (T/2)((nπ/T)² - ω²), negative once T > n s | derived, computed | S[ε sin(nπt/T)] = ε²(T/4)((nπ/T)² - ω²); page Simpson values match to 2 decimals (e.g. T = 1.4: -3.38, 7.19, 24.82) | none |
| 03 | Fig 6: RK4 at dt = 1/240 s keeps pendulum energy (θ0 = 60°) to about 1e-10 relative | computed | Node: max abs(ΔE)/E = 7.5e-10 over 60 s; page readout 1e-10 over the first seconds | none |

### 04 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 04 | Stiffened bowl ½(x²+y²) + y²: rotation about any centre fails; about the origin max abs(X·∇V) on [-2, 2]² is 8 | derived, computed | About c: X·∇V = 2xy + c_y x - 3c_x y, never identically zero; at c = 0 max abs(2xy) = 8. Page grid search over centres returns (0, 0) and 8.0000 | none |
| 04 | Tilted bowl ½(x²+y²) - 0.8y is rotation-symmetric about (0, 0.8) | derived, computed | ∇V = (x, y - 0.8), X = (-(y - 0.8), x): X·∇V = 0. Page search returns (0.00, 0.80), 0.0000 | none |
| 04 | Free particle: boost q + st shifts every path's action by s + s²/2 (0.625 at s = 0.5); scaling by 1 + s multiplies it by (1+s)², maps solutions to solutions, and is no quasi-symmetry | derived, computed | ΔS = ∫(sq̇ + s²/2) = s[q] + s²/2 with q(0) = 0, q(1) = 1; page: spread 0 for boost, 3.13 for scale, EL residual of the image 0 in both | Replaces the old Fig 1 side boxes |
| 04 | Oscillator L = ½q̇² - ½q² has the quasi-symmetry X = sin t with δL = d/dt(q cos t); its charge q̇ sin t - q cos t is conserved | derived, computed | δL = q̇ cos t - q sin t = d/dt(q cos t); d/dt(q̇ sin t - q cos t) = (q̈ + q) sin t = 0 on shell. Page: grid test passes, RK4 drift 2e-9 over 8 s | none |
| 04 | Vertical shift under gravity: δL = -g = d/dt(-gt), charge q̇ + gt conserved | derived, computed | Page RK4: q̇ drifts 78.48 over 8 s (= g·8), q̇ + gt holds to 8e-13 | none |
| 04 | A gauge transformation changes a charged particle's Lagrangian by q dχ/dt | derived | L = ½mv² - qφ + qv·A with A -> A + ∇χ, φ -> φ - ∂χ/∂t gives δL = q(∂χ/∂t + v·∇χ) = q dχ/dt | none |

### 13 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 13 | Fig 3: projecting xy = 1 to t = x - cy gives fibers c y² + t y - 1 = 0; for c ≠ 0 two points with multiplicity at every t, for c = 0 one point for t ≠ 0 and none at t = 0 | derived, computed | Substitute x = t + cy into xy = 1. The page counts roots with multiplicity at 601 samples of t in [-3, 3] and plots \|y\|; at c = 0.25 the largest \|y\| is 12.32 (root of 0.25y² + 3y - 1), at c = 0 it is 100 (y = 1/t at t = 0.01) | none |
| 13 | Fig 4: k[t³, t⁴, t⁵] is free over k[t³] on 1, t⁴, t⁵ (rank 3), over k[t⁴] on 1, t⁵, t⁶, t³ (rank 4) | derived, computed | Semigroup ⟨3, 4, 5⟩ = ℕ minus {1, 2}; least element in each residue class mod a (the Apéry set) generates that class over k[t^a]. Page computes the semigroup and Apéry set | none |
| 13 | The ideal of the curve (t³, t⁴, t⁵) is (y² - xz, x³ - yz, z² - x²y) | fine (from memory), checked | 2×2 minors of [[x, y, z], [y, z, x²]]; each vanishes on the curve by direct substitution. That they generate the whole ideal is cited from memory (Herzog 1970, monomial space curves); consistent with the page's HF(s) = 5s - 1, degree 5, and fiber count 3 over k[x] matching Fig 4's rank | none |
| 13 | For large s the number of standard monomials of degree ≤ s (graded order) is a polynomial in s of degree dim A | fine (from memory) | Affine Hilbert polynomial; Cox, Little, O'Shea, Ideals, Varieties, and Algorithms, ch. 9 §3; cited from memory. Page values: line s + 1, plane (s+1)(s+2)/2, elliptic curve 3s, hyperbola 2s + 1, cone (s+1)², each with d matching the known dimension | none |
| 13 | Fig 5: generic fiber sizes 2 (elliptic over k[x], hyperbola over k[x + y], cone over k[x, y]) and 3 (curve over k[x]) | computed | Page adds the subring's linear equations at five seeded random rational base points, runs exact Buchberger and counts standard monomials of the zero-dimensional quotient; matched in node | none |
| 13 | Fig 2 census on the 41×41 grid over [-2, 2]²: real fiber 2 / 1 / 0 at 800 / 81 / 800 samples | computed | 20 nonzero values per sign on each axis: 2·20·20 = 800 per sign class, 41 + 41 - 1 = 81 on the axes | none |

### 10 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 10 | Old Fig 4 listed 𝔭𝔮 among the non-principal ideals | wrong, fixed | 𝔭𝔮 has index 6 and contains 1 + √−5 (norm 6), so 𝔭𝔮 = (1 + √−5); the page's own prose said so | Figure replaced by the computed prime census; every principal/non-principal label now comes from a search for an element of norm equal to the index |
| 10 | Fig 3: 21 has 3 factorizations into irreducibles, 42 has 9, all of equal length | computed, checked independently | Page: exhaustive divisor search on norms. Independent count: (42) = 𝔭²𝔮𝔮̄𝔯𝔯̄ with all six primes non-principal, and irreducibles are principal products of two of them, so factorizations are pairings of the multiset: 3 (𝔭 with 𝔭) + 6 (𝔭's with two distinct others) = 9; for 21, the 3 pairings of {𝔮, 𝔮̄, 𝔯, 𝔯̄} | none |
| 10 | Carlitz 1960: in a ring of integers, all factorizations of an element have the same length exactly when the class number is at most 2 | fine (from memory) | L. Carlitz, "A characterization of algebraic number fields with class number two", Proc. Amer. Math. Soc. 11 (1960) 391-392; cited from memory, not rechecked against the paper | none |
| 10 | p = a² + 5b² exactly when p ≡ 1, 9 (mod 20) | fine (from memory), computed | D. Cox, Primes of the Form x² + ny², introduction (cited from memory). Fig 4 computes it for every prime below 200 by direct search | none |
| 10 | Minkowski bound (2/π)√20 ≈ 2.85, leaving (1) and 𝔭 as class representatives | derived | M = (n!/nⁿ)(4/π)^{r₂}√|D| with n = 2, r₂ = 1, D = −20: (1/2)(4/π)√20 = 2.847; ideals of norm ≤ 2 are (1) and 𝔭 (2 ramifies) | none |
| 10 | Fig 4 census over primes < 200: non-principal × non-principal principal 91/91, principal × non-principal non-principal 117/117, principal × principal 45/45 | computed | 13 non-principal (2 and 3, 7 mod 20) and 9 principal (5 and 1, 9 mod 20) split or ramified primes; pairs with repetition: 13·14/2 = 91, 13·9 = 117, 9·10/2 = 45 | none |
| 10 | Class number of ℤ[√−d] equals the number of reduced primitive forms of discriminant −4d; h = 1 only at d = 1, 2 among squarefree d ≤ 100, d ≡ 1, 2 mod 4 | fine (from memory), computed | Form/ideal class correspondence: Cox, Primes of the Form x² + ny², Thm 7.7 (from memory). Node run matches standard values recalled from memory, h(−20) = 2, h(−56) = 4, h(−104) = 6; the h = 1 list agrees with Heegner-Baker-Stark (only d = 1, 2 have ring of integers ℤ[√−d]) | none |
| 10 | 2x² + 2xy + 3y² = N(2x + (1+√−5)y)/2 | derived | (2x + y)² + 5y² = 4x² + 4xy + 6y² | none |

### 11 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 11 | A chain from (n) in ℤ has at most Ω(n) strict steps | derived, computed | Each strict step (m) ⊊ (m') has m' a proper divisor of m, removing at least one prime factor. Fig 1 computes the longest path in the divisor diagram by dynamic programming and shows it (60 → 4, 360 → 6, 64 → 6) | none |
| 11 | Fig 2 Euclid step counts: gcd(f, x² + 1) takes 3 division steps, gcd(x² − x, x + 1) takes 2 | computed, checked by hand | f mod (x² + 1) = 2x + 2; (x² + 1) mod (2x + 2) = 2; then 0. x² − x = (x + 1)(x − 2) + 2; then 0 | none |
| 11 | Once a monomial ideal in k[x, y] contains a pure power of each variable, the number of monomials outside bounds the remaining strict steps; before that, (x) ⊊ (x, yᵏ) ⊊ ... ⊊ (x, y) is arbitrarily long | derived | Each strict step adds at least one new monomial to the ideal. Default (x⁴, x²y, y³) leaves 1, y, y², x, xy, xy², x², x³ outside: 8 | none |
| 11 | In the ring of all algebraic integers (2) ⊊ (2^{1/2}) ⊊ (2^{1/4}) ⊊ ... | derived | Quotient 2^{1/2^{k+1}} is a root of the monic x^{2^{k+1}} − 2; its inverse has minimal polynomial x^{2^{k+1}} − 1/2 (Eisenstein makes x^N − 2 irreducible), not integral | none |
| 11 | In the ring of integers of ℚ(2^{1/n}), (2) = 𝔓ⁿ with 𝔓 = (2^{1/n}), so exactly n + 1 ideals contain (2) | derived (standard) | x^n − 2 is Eisenstein at 2, so 2 is totally ramified; (2^{1/n}) has norm 2 and lies in 𝔓, hence equals it; ideals containing 𝔓ⁿ are 𝔓^j (e.g. Neukirch, Algebraic Number Theory, I §8, from memory) | none |
| 11 | Fig 4 streams (seed 1, 300 draws): x, y stream stops after 7 strict steps at draw 64 with union (x³, x²y, xy², y³); x₁, x₂, ... stream reaches 89 steps | computed | Page and a node rerun of the same seeded generator agree | none |

### 01-02 enrichment

| page | claim | verdict | source or derivation | fix |
|---|---|---|---|---|
| 01 | Fig 2: 40 of the 64 ordered pairs in D4 commute | computed, checked | Page multiplies the 2×2 matrices; independently, commuting pairs = \|G\| × (number of conjugacy classes) = 8 × 5 = 40 | none |
| 01 | Fig 3 invariant counts {e} 7, ⟨s⟩ 5, C2 5, C4 3, D4 3, O(2) 1 over the seven listed polynomials | computed, checked by hand | e.g. r(x, y) = (−y, x) sends xy to −xy and x² − y² to y² − x², fixes x²y² and x⁴ + y⁴; a 45° rotation moves x⁴ + y⁴ | none |
| 01 | Fig 5: 6 orbits of 2-colourings and 21 of 3-colourings of the square's corners under D4 | computed, checked | Burnside: (k⁴ + 2k³ + 3k² + 2k)/8 gives 48/8 = 6 and 168/8 = 21; page enumerates orbits directly and matches | none |
| 01 | Burnside's lemma: Burnside's 1897 book credits Frobenius (1887); Cauchy knew it in 1845 | fine | Wikipedia "Burnside's lemma", History section (fetched 2026-09-28), citing Neumann (1979) | none |
| 01 | Fig 6: (a−b)²(b−c)²(c−a)² = e1²e2² − 4e2³ − 4e1³e3 + 18e1e2e3 − 27e3², the cubic discriminant; a³+b³+c³ = e1³ − 3e1e2 + 3e3 | computed exactly (BigInt), checked | Page's reduction plus evaluation at (2, −1, 3): both sides 144 and 34; matches the standard cubic discriminant 18abcd − 4b³d + b²c² − 4ac³ − 27a²d² with (1, −e1, e2, −e3) | none |
| 02 | Weights: binary discriminants have weight 2, 6, 12 in degrees 2, 3, 4; quartic I, J have weights 4, 6; general weight nd/2 | computed for the examples; rule from memory | Node check over 300 random integer forms and matrices: Δ(f·M) = det^{n(n−1)} Δ(f), I ↦ det⁴ I, J ↦ det⁶ J exactly; page's log-log fits give slopes 2.000, 6.000, 12.000, 4.000, 6.000, 0.000. The nd/2 rule is standard (Olver, Classical Invariant Theory, 1999), cited from memory | none |
| 02 | 27Δ = 4I³ − J² with I = 12ae − 3bd + c², J = 72ace + 9bcd − 27ad² − 27eb² − 2c³ | computed, checked | Node: equality exact on 300 random integer quartics, with Δ from the Sylvester resultant | none |
| 02 | The SL2 invariants of the binary quartic are generated by I and J; Gordan 1868 finite generation for binary forms | from memory | Classical (Cayley, Boole; Gordan 1868). Cited from memory, e.g. Olver 1999 ch. 2, Sturmfels, Algorithms in Invariant Theory | none |
| 02 | A real binary cubic has three real zero lines when Δ > 0 and one when Δ < 0; for x³ − 3xy² + ty³, Δ = 108 − 27t², zero at t = ±2 | derived, computed | Cubic formula with (a, b, c, d) = (1, 0, −3, t); page bisects Δ and reports ±2.000; root count from bracketing matches the sign | none |
| 02 | x² + y² and −x² − y² (Δ = −4) lie in different SL2(ℝ) orbits | derived, computed | Definiteness is preserved by any real invertible substitution; page: a′ > 0 on all 400 forms from x² + y² and < 0 on all 400 from −x² − y² | none |
| 02 | Noether's 1907 dissertation topic: the system of forms of the ternary biquadratic form, under Gordan at Erlangen | fine (unchanged from before) | Title Über die Bildung des Formensystems der ternären biquadratischen Form (MacTutor biography) | none |
