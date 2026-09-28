# Invariance: The Mathematics of Emmy Noether

I want a thirteen-part series on Emmy Noether's two big legacies, symmetry and conservation in physics and finiteness in algebra, told as one instinct: find what stays the same, and let it do the work. It is for a reader who knows calculus and a little linear algebra and has heard "symmetry implies conservation" without seeing why. It starts in invariant theory, builds the first theorem from the action principle, runs it on mechanical systems where the reader can break a symmetry and watch the conserved quantity drift, then follows her into commutative algebra, where one chain condition on ideals rebuilt the subject.

By the end a reader should be able to derive a conserved quantity from a symmetry on a small example, tell a genuine symmetry from a broken one by watching a plot, and explain why ascending chains of ideals must stop in a polynomial ring.

## Articles

**Act I · The Principle of Invariance**

### 1. What Is an Invariant?
Group actions, orbits, stabilisers, and functions a group leaves unchanged. The reader rotates a point and sees which computed quantities hold still, drags a point to see its orbit and stabiliser satisfy orbit-stabiliser, composes moves in the D4 Cayley table, counts square colourings by Burnside, and reduces a symmetric polynomial to elementary ones step by step.

### 2. Invariants of a Binary Form
Noether's 1907 dissertation topic: invariants of binary forms under linear substitution, starting with the discriminant. The reader transforms a quadratic, cubic or quartic form by an integer matrix and sees the discriminant and the quartic invariants I and J scale by the predicted power of the determinant in exact arithmetic, fits those powers on a log-log plot, and watches a cubic's roots merge where the discriminant vanishes.

### 3. Least Action and Lagrangians
The action principle and the Euler–Lagrange equation, with the brachistochrone as the first variational problem. The reader races beads down a straight line, a sagging curve and a cycloid, compares a family of curves against the cycloid, relaxes a knotted trial path onto the true motion, checks the Euler-Lagrange residual by finite differences, and sees when the action is a saddle rather than a minimum.

### 4. Symmetries of a Lagrangian
Continuous symmetries as infinitesimal generators, and the change in L that the theorem is built on, including quasi-symmetries that shift L by a total derivative. A computed grid of Lagrangians against generators sorts true symmetries, quasi-symmetries and non-symmetries, and the reader integrates each charge with and without the total-derivative term.

### 5. Noether's First Theorem
A short derivation turns each continuous symmetry into a conserved current. The reader checks the on-shell identity at the heart of the proof, breaks a two-block system's translation symmetry and measures momentum drift against the breaking strength, reads a Lagrangian-by-generator census of charges, and follows the gravity quasi-symmetry on a projectile hodograph.

**Act II · Conservation Laws from Symmetry**

### 6. Energy, Momentum and Angular Momentum
Time translation gives energy, space translation momentum, rotation angular momentum. The signature interactive is the pendulum phase portrait: the reader kicks the pendulum, and energy holds between kicks and jumps at each one. A drift-against-step plot separates integrator error from physics, a driven oscillator and a spinning hoop show H and T + V parting ways, and a census pairs five Lagrangians with four transformations.

### 7. Kepler's Hidden Symmetry
The Laplace–Runge–Lenz vector is a fourth conserved quantity of the inverse-square orbit, coming from a hidden SO(4) that also explains hydrogen's degeneracies. The reader adds a small 1/r³ correction and watches the LRL vector precess at the first-order rate while energy and angular momentum stay flat, follows the flow the LRL vector generates, reads the SO(4) bracket table, and sees hydrogen-like levels lose their degeneracy.

### 8. Phase and Electric Charge
Global phase rotation of a Schrödinger field is an internal symmetry whose conserved charge is total probability, and making the phase local forces a gauge field. The reader rotates the phase of a wave packet, checks charge in a box against the current through its walls, adds a phase-breaking term and sees charge drift at the predicted rate, and sees a local phase break the kinetic term on a lattice until link phases repair it.

### 9. Noether's Second Theorem
Local symmetries give identities instead of conservation laws: the gauge identity in electromagnetism and the contracted Bianchi identity in general relativity. The reader shifts phases on a lattice globally and locally, checks the Maxwell identity off shell on a grid, sees gauge choices fan out solutions while invariant quantities agree, and tracks energy in an expanding universe.

**Act III · The Algebraic Revolution**

### 10. Ideals as the New Numbers
Unique factorisation fails in ℤ[√−5], and Dedekind rescues it by factoring ideals. The reader sees 6 factor two incompatible ways on the lattice of the ring, multiplies ideals as sublattices, sees every factorisation refine to the same prime ideals, sorts primes by class, and reads class numbers of ℤ[√−d].

### 11. Noetherian Rings
Rings where every ascending chain of ideals stabilises. The reader builds chains in ℤ and in k[x] by adding elements, fills a staircase of monomial ideals in k[x, y] that must stop, races the same random monomial stream in two and in infinitely many variables, and sees the ideals above 2 in all algebraic integers climb forever.

### 12. Hilbert's Basis Theorem
If R is Noetherian so is R[x], the result Gordan called theology. Then Buchberger's algorithm, a later constructive tool for polynomial ideals whose termination rests on the same chain condition; it is not an answer to Gordan's objection, which was about invariants. The reader watches the leading-coefficient chain of the proof stop, walks a reduction down to zero, finds generators of a cyclic invariant ring against Noether's bound, and steps Buchberger's algorithm through a small ideal in exact arithmetic as S-polynomials join the basis until it closes.

### 13. Noether Normalization
Every affine variety is a finite cover of affine space, and the dimension of that space is the variety's dimension. The reader slides a fiber along an elliptic curve and watches two preimages merge at the branch points, counts real fibers over the cone's base, sees a generic substitution stop a root escaping to infinity, and reads dimension off Hilbert-function growth.

## What to get right

- Physics figures should integrate the stated Lagrangian and plot the conserved quantity, so a broken symmetry visibly drifts and an intact one visibly holds.
- Quasi-symmetries count: a vertical shift under gravity conserves momentum plus a time term, and H equals T + V only when kinetic energy is homogeneous quadratic.
- History is easy to garble. Gordan proved the binary case in 1868 and Hilbert the general case in 1890; Noether came to Göttingen in 1915; Pauli and Schrödinger both solved hydrogen in early 1926; the LRL vector was known to Hermann, Bernoulli and Laplace. The ring of integers of a number field is Noetherian; the ring of all algebraic integers is not.
- Keep one colour for a conserved quantity that holds and another for one that breaks, across every act, so the reader learns to read drift at a glance.
- Voice: warm about Noether without hagiography; let the theorems carry the admiration.
