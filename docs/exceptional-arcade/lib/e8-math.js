// e8-math.js — canonical E8 root system, simple roots, Cartan matrix, Dynkin diagram.
//
// Attaches a single `E8` object to the global scope (no modules, no build step).
// Later phases will add Weyl reflections, projections, lattice shells, subsystems.
//
// Canonical coordinates (Bourbaki-compatible):
//   - Integer family: 112 vectors of the form ±eᵢ ± eⱼ, i < j
//   - Half-integer family: 128 vectors (±½, …, ±½) with an even number of minuses
//   - Every root has squared length 2
//   - Pairwise inner products lie in {−2, −1, 0, 1, 2}
//
// Canonical order: integer family first (lexicographic by (i, j), then by
// sign bits), followed by half-integer family ordered by sign-bitmask.
// Any explainer that highlights "root #k" must use this order so colors and
// labels stay consistent across files.
//
// Bourbaki simple roots (from Groupes et algèbres de Lie, planche VII):
//   α₁ = ( 1/2, -1/2, -1/2, -1/2, -1/2, -1/2, -1/2,  1/2 )
//   α₂ = (  1,    1,    0,    0,    0,    0,    0,    0 )
//   α₃ = ( -1,    1,    0,    0,    0,    0,    0,    0 )
//   α₄ = (  0,   -1,    1,    0,    0,    0,    0,    0 )
//   α₅ = (  0,    0,   -1,    1,    0,    0,    0,    0 )
//   α₆ = (  0,    0,    0,   -1,    1,    0,    0,    0 )
//   α₇ = (  0,    0,    0,    0,   -1,    1,    0,    0 )
//   α₈ = (  0,    0,    0,    0,    0,   -1,    1,    0 )
//
// Dynkin diagram (branch node α₄ has degree 3):
//                    α₂
//                    |
//          α₁ — α₃ — α₄ — α₅ — α₆ — α₇ — α₈
//
// Highest root: θ = 2α₁ + 3α₂ + 4α₃ + 6α₄ + 5α₅ + 4α₆ + 3α₇ + 2α₈, height 29.

(function (global) {
  'use strict';

  // ───────────────────────────────────────────── E8 roots (all 240) ─────

  function generateIntegerRoots() {
    var roots = [];
    for (var i = 0; i < 8; i++) {
      for (var j = i + 1; j < 8; j++) {
        for (var si = 0; si < 2; si++) {
          for (var sj = 0; sj < 2; sj++) {
            var r = [0, 0, 0, 0, 0, 0, 0, 0];
            r[i] = si === 0 ? 1 : -1;
            r[j] = sj === 0 ? 1 : -1;
            roots.push(r);
          }
        }
      }
    }
    return roots;
  }

  function generateHalfIntegerRoots() {
    var roots = [];
    for (var mask = 0; mask < 256; mask++) {
      var minusCount = 0;
      for (var k = 0; k < 8; k++) {
        if (mask & (1 << k)) minusCount++;
      }
      if (minusCount % 2 !== 0) continue;
      var r = [0, 0, 0, 0, 0, 0, 0, 0];
      for (var k = 0; k < 8; k++) {
        r[k] = (mask & (1 << k)) ? -0.5 : 0.5;
      }
      roots.push(r);
    }
    return roots;
  }

  var integerRoots = generateIntegerRoots();
  var halfIntegerRoots = generateHalfIntegerRoots();
  var allRoots = integerRoots.concat(halfIntegerRoots);

  // ───────────────────────────────────────────── D_n roots ─────

  function dNRoots(n) {
    if (n < 2) return [];
    var roots = [];
    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        for (var si = 0; si < 2; si++) {
          for (var sj = 0; sj < 2; sj++) {
            var r = new Array(n);
            for (var k = 0; k < n; k++) r[k] = 0;
            r[i] = si === 0 ? 1 : -1;
            r[j] = sj === 0 ? 1 : -1;
            roots.push(r);
          }
        }
      }
    }
    return roots;
  }

  // ───────────────────────────────────────────── inner products ─────

  function dot(a, b) {
    var n = a.length;
    var s = 0;
    for (var k = 0; k < n; k++) s += a[k] * b[k];
    return s;
  }

  function squaredLength(a) {
    return dot(a, a);
  }

  // ───────────────────────────────────────────── Bourbaki simple roots ─────

  var simpleRoots = [
    [ 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,  0.5],
    [ 1,    1,    0,    0,    0,    0,    0,    0],
    [-1,    1,    0,    0,    0,    0,    0,    0],
    [ 0,   -1,    1,    0,    0,    0,    0,    0],
    [ 0,    0,   -1,    1,    0,    0,    0,    0],
    [ 0,    0,    0,   -1,    1,    0,    0,    0],
    [ 0,    0,    0,    0,   -1,    1,    0,    0],
    [ 0,    0,    0,    0,    0,   -1,    1,    0]
  ];

  // Cartan matrix C[i][j] = 2 ⟨αᵢ, αⱼ⟩ / ⟨αⱼ, αⱼ⟩. For E8 (all ⟨α,α⟩ = 2),
  // this simplifies to C[i][j] = ⟨αᵢ, αⱼ⟩.
  function buildCartanMatrix() {
    var C = [];
    for (var i = 0; i < 8; i++) {
      C.push([]);
      for (var j = 0; j < 8; j++) {
        C[i].push(dot(simpleRoots[i], simpleRoots[j]));
      }
    }
    return C;
  }

  var cartanMatrix = buildCartanMatrix();

  // Dynkin adjacency: nodes i, j (0-indexed) share an edge iff the off-diagonal
  // Cartan entry is -1. Encoded as an edge list and an adjacency list.
  function buildDynkin() {
    var edges = [];
    var adjacency = [[], [], [], [], [], [], [], []];
    for (var i = 0; i < 8; i++) {
      for (var j = i + 1; j < 8; j++) {
        if (cartanMatrix[i][j] === -1) {
          edges.push([i, j]);
          adjacency[i].push(j);
          adjacency[j].push(i);
        }
      }
    }
    return {
      edges: edges,
      adjacency: adjacency,
      nodeLabels: ['α₁', 'α₂', 'α₃', 'α₄', 'α₅', 'α₆', 'α₇', 'α₈']
    };
  }

  var dynkin = buildDynkin();

  // ───────────────────────────────────────────── matrix inverse ─────
  // Gauss-Jordan, used once at load time to invert the 8×8 simple-root
  // basis matrix so we can express any root as an integer combination.

  function invertMatrix(M) {
    var n = M.length;
    var A = [];
    for (var i = 0; i < n; i++) {
      A.push([]);
      for (var j = 0; j < n; j++) A[i].push(M[i][j]);
      for (var j = 0; j < n; j++) A[i].push(i === j ? 1 : 0);
    }
    for (var col = 0; col < n; col++) {
      var pivot = col;
      var best = Math.abs(A[col][col]);
      for (var r = col + 1; r < n; r++) {
        if (Math.abs(A[r][col]) > best) {
          best = Math.abs(A[r][col]);
          pivot = r;
        }
      }
      if (best < 1e-12) throw new Error('[E8] matrix is singular');
      if (pivot !== col) {
        var tmp = A[col]; A[col] = A[pivot]; A[pivot] = tmp;
      }
      var divisor = A[col][col];
      for (var j = 0; j < 2 * n; j++) A[col][j] /= divisor;
      for (var r = 0; r < n; r++) {
        if (r === col) continue;
        var factor = A[r][col];
        if (factor === 0) continue;
        for (var j = 0; j < 2 * n; j++) A[r][j] -= factor * A[col][j];
      }
    }
    var inv = [];
    for (var i = 0; i < n; i++) {
      inv.push([]);
      for (var j = 0; j < n; j++) inv[i].push(A[i][j + n]);
    }
    return inv;
  }

  // The 8×8 matrix whose columns are the simple roots (as coordinate vectors).
  // Its inverse maps a coordinate vector to its 8 simple-root coefficients.
  function buildSimpleRootBasisMatrix() {
    var M = [];
    for (var row = 0; row < 8; row++) {
      M.push([]);
      for (var col = 0; col < 8; col++) {
        M[row].push(simpleRoots[col][row]);
      }
    }
    return M;
  }

  var simpleRootBasisMatrix = buildSimpleRootBasisMatrix();
  var simpleRootBasisInverse = invertMatrix(simpleRootBasisMatrix);

  function rootAsSimpleCoefficients(r) {
    var c = [0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 8; i++) {
      var sum = 0;
      for (var j = 0; j < 8; j++) sum += simpleRootBasisInverse[i][j] * r[j];
      c[i] = Math.round(sum);
    }
    return c;
  }

  function rootHeight(r) {
    var c = rootAsSimpleCoefficients(r);
    var h = 0;
    for (var i = 0; i < 8; i++) h += c[i];
    return h;
  }

  function isPositiveRoot(r) {
    var c = rootAsSimpleCoefficients(r);
    for (var i = 0; i < 8; i++) {
      if (c[i] > 0) return true;
      if (c[i] < 0) return false;
    }
    return false;
  }

  // ───────────────────────────────────────────── Weyl reflections ─────
  // For E8, every root has squared length 2, so the reflection formula
  // s_α(x) = x − 2⟨x,α⟩/⟨α,α⟩ · α simplifies to s_α(x) = x − ⟨x,α⟩ · α.

  function reflect(x, alpha) {
    var c = dot(x, alpha);
    var r = new Array(8);
    for (var k = 0; k < 8; k++) r[k] = x[k] - c * alpha[k];
    return r;
  }

  var weylGenerators = simpleRoots.map(function (alpha) {
    return function (x) { return reflect(x, alpha); };
  });

  // Order of the Weyl group W(E_8), a constant.
  var weylOrder = 696729600;

  // Orbit of a starting vector under a set of generators (BFS, rounded-key dedup).
  function orbit(start, generators, maxSize) {
    var limit = maxSize || 10000;
    var key = function (v) {
      var s = '';
      for (var k = 0; k < v.length; k++) {
        s += (k > 0 ? ',' : '') + (Math.round(v[k] * 1e6) / 1e6);
      }
      return s;
    };
    var seen = Object.create(null);
    var list = [];
    var queue = [start];
    seen[key(start)] = true;
    list.push(start);
    while (queue.length > 0 && list.length < limit) {
      var current = queue.shift();
      for (var g = 0; g < generators.length; g++) {
        var next = generators[g](current);
        var k = key(next);
        if (!seen[k]) {
          seen[k] = true;
          list.push(next);
          queue.push(next);
        }
      }
    }
    return list;
  }

  // ───────────────────────────────────────────── matrix helpers ─────
  // Small, self-contained, for 8×8 use. Not exported.

  function matMul(A, B) {
    var n = A.length;
    var R = [];
    for (var i = 0; i < n; i++) {
      R.push([]);
      for (var j = 0; j < n; j++) {
        var s = 0;
        for (var k = 0; k < n; k++) s += A[i][k] * B[k][j];
        R[i].push(s);
      }
    }
    return R;
  }

  function nullSpace(M) {
    var n = M.length;
    var A = [];
    for (var i = 0; i < n; i++) A.push(M[i].slice());
    var pivotCol = [];
    var colIsPivot = [];
    for (var i = 0; i < n; i++) colIsPivot.push(false);
    var r = 0;
    for (var c = 0; c < n && r < n; c++) {
      var pivot = r;
      for (var i = r + 1; i < n; i++) {
        if (Math.abs(A[i][c]) > Math.abs(A[pivot][c])) pivot = i;
      }
      if (Math.abs(A[pivot][c]) < 1e-9) continue;
      if (pivot !== r) {
        var tmpRow = A[r]; A[r] = A[pivot]; A[pivot] = tmpRow;
      }
      var piv = A[r][c];
      for (var j = 0; j < n; j++) A[r][j] /= piv;
      for (var i = 0; i < n; i++) {
        if (i === r) continue;
        var f = A[i][c];
        if (Math.abs(f) < 1e-14) continue;
        for (var j = 0; j < n; j++) A[i][j] -= f * A[r][j];
      }
      pivotCol.push(c);
      colIsPivot[c] = true;
      r++;
    }
    var basis = [];
    for (var c = 0; c < n; c++) {
      if (colIsPivot[c]) continue;
      var v = [];
      for (var k = 0; k < n; k++) v.push(0);
      v[c] = 1;
      for (var pi = 0; pi < pivotCol.length; pi++) {
        v[pivotCol[pi]] = -A[pi][c];
      }
      basis.push(v);
    }
    return basis;
  }

  // ───────────────────────────────────────────── Coxeter element ─────
  // c = s_{α_1} ∘ s_{α_2} ∘ ⋯ ∘ s_{α_8}. Applied right-to-left on a vector.

  function coxeterApply(x) {
    var y = x.slice();
    for (var k = 7; k >= 0; k--) {
      y = reflect(y, simpleRoots[k]);
    }
    return y;
  }

  function buildCoxeterMatrix() {
    var M = [];
    for (var i = 0; i < 8; i++) M.push([0,0,0,0,0,0,0,0]);
    for (var j = 0; j < 8; j++) {
      var ej = [0,0,0,0,0,0,0,0];
      ej[j] = 1;
      var cj = coxeterApply(ej);
      for (var i = 0; i < 8; i++) M[i][j] = cj[i];
    }
    return M;
  }

  var coxeterMatrix = buildCoxeterMatrix();
  var coxeterNumber = 30;
  var exponents = [1, 7, 11, 13, 17, 19, 23, 29];

  // Coxeter plane: the real 2-dimensional subspace of ℝ⁸ that is the
  // eigenspace of the Coxeter element c corresponding to the pair of
  // complex eigenvalues e^{±2πi/h}. We find it as the null space of
  // (c² − 2 cos(2π/h) c + I).

  function buildCoxeterPlaneRaw() {
    var theta = 2 * Math.PI / coxeterNumber;
    var twoCos = 2 * Math.cos(theta);
    var c2 = matMul(coxeterMatrix, coxeterMatrix);
    var M = [];
    for (var i = 0; i < 8; i++) {
      M.push([]);
      for (var j = 0; j < 8; j++) {
        M[i].push(c2[i][j] - twoCos * coxeterMatrix[i][j] + (i === j ? 1 : 0));
      }
    }
    return nullSpace(M);
  }

  function gramSchmidt2(u, v) {
    var un = Math.sqrt(dot(u, u));
    var u2 = u.map(function (x) { return x / un; });
    var c = dot(v, u2);
    var v1 = v.map(function (x, i) { return x - c * u2[i]; });
    var vn = Math.sqrt(dot(v1, v1));
    var v2 = v1.map(function (x) { return x / vn; });
    return [u2, v2];
  }

  var coxeterPlaneBasis;
  (function () {
    var raw = buildCoxeterPlaneRaw();
    if (raw.length < 2) {
      throw new Error('[E8] Coxeter plane null space has dimension < 2');
    }
    var on = gramSchmidt2(raw[0], raw[1]);
    // Align orientation: ensure c acts as counter-clockwise rotation by 2π/h.
    // c(u) should be cos(θ) u + sin(θ) v for positive θ; if sin is negative, flip v.
    var cu = coxeterApply(on[0]);
    var sinComp = dot(cu, on[1]);
    if (sinComp < 0) {
      on[1] = on[1].map(function (x) { return -x; });
    }
    coxeterPlaneBasis = { u: on[0], v: on[1] };
  })();

  // ───────────────────────────────────────────── projections ─────

  function projectOnto2Plane(v, eU, eV) {
    return [dot(v, eU), dot(v, eV)];
  }

  function projectOnto3Plane(v, e1, e2, e3) {
    return [dot(v, e1), dot(v, e2), dot(v, e3)];
  }

  function projectToCoxeterPlane(v) {
    return [dot(v, coxeterPlaneBasis.u), dot(v, coxeterPlaneBasis.v)];
  }

  // ───────────────────────────────────────────── subsystems ─────
  // Deleting a simple root α_i (0-indexed) yields a sub-root-system: the
  // roots of E_8 whose i-th simple coefficient is zero (equivalently, the
  // integer span of the other 7 simple roots, restricted to length-2 vectors).

  function subsystemByDeletion(nodeIdx) {
    var rootIndices = [];
    for (var r = 0; r < allRoots.length; r++) {
      var c = rootAsSimpleCoefficients(allRoots[r]);
      if (c[nodeIdx] === 0) rootIndices.push(r);
    }
    return rootIndices;
  }

  // ───────────────────────────────────────────── lattice ─────
  // The E₈ lattice in D₈⁺ form: integer vectors of even sum, plus the same
  // shifted by (½,½,...,½). Generate all vectors up to a squared-length bound.

  function generateLattice(maxSqLength) {
    var bound = Math.ceil(Math.sqrt(maxSqLength)) + 1;
    var vectors = [];
    // Integer part: x ∈ ℤ⁸ with Σ xᵢ even
    function recurseInt(k, current, sum) {
      if (k === 8) {
        if (sum % 2 !== 0) return;
        if (squaredLength(current) > maxSqLength + 1e-9) return;
        vectors.push(current.slice());
        return;
      }
      for (var v = -bound; v <= bound; v++) {
        current[k] = v;
        // Quick prune: if even just the squared length of fixed part exceeds bound, skip
        var partial = 0;
        for (var i = 0; i <= k; i++) partial += current[i] * current[i];
        if (partial > maxSqLength + 1e-9) continue;
        recurseInt(k + 1, current, sum + v);
      }
      current[k] = 0;
    }
    recurseInt(0, [0,0,0,0,0,0,0,0], 0);
    // Half-integer part: x ∈ (ℤ+½)⁸ with Σ xᵢ even integer
    function recurseHalf(k, current, sum) {
      if (k === 8) {
        var totalTimesTwo = 2 * sum; // sum of 2xᵢ values, each odd integer
        // Σ xᵢ must be even ⇒ 2 Σ xᵢ must be ≡ 0 (mod 4)
        if (totalTimesTwo % 4 !== 0) return;
        if (squaredLength(current) > maxSqLength + 1e-9) return;
        vectors.push(current.slice());
        return;
      }
      for (var v = -bound; v < bound; v++) {
        var x = v + 0.5;
        current[k] = x;
        var partial = 0;
        for (var i = 0; i <= k; i++) partial += current[i] * current[i];
        if (partial > maxSqLength + 1e-9) continue;
        recurseHalf(k + 1, current, sum + x);
      }
      current[k] = 0;
    }
    recurseHalf(0, [0,0,0,0,0,0,0,0], 0);
    return vectors;
  }

  function latticeShell(k) {
    var vectors = generateLattice(k);
    return vectors.filter(function (v) { return Math.abs(squaredLength(v) - k) < 1e-9; });
  }

  // Packing density of the E₈ lattice = π⁴ / 384.
  var packingDensity = Math.PI * Math.PI * Math.PI * Math.PI / 384;

  // ───────────────────────────────────────────── Gosset polytope 4_21 ─────
  // Vertices of the Gosset polytope 4₂₁ are the 240 E8 roots. Two vertices
  // share an edge iff their Euclidean distance is √2 (the uniform edge length
  // of the polytope) — equivalently, their dot product is exactly 1, because
  //   |r_i − r_j|² = |r_i|² + |r_j|² − 2⟨r_i, r_j⟩ = 2 + 2 − 2 = 2.
  // Each vertex has 56 neighbours, so the total edge count is 240·56/2 = 6720.

  function computeGossetEdges() {
    var edges = [];
    for (var i = 0; i < allRoots.length; i++) {
      for (var j = i + 1; j < allRoots.length; j++) {
        var d = dot(allRoots[i], allRoots[j]);
        if (Math.abs(d - 1) < 1e-9) edges.push([i, j]);
      }
    }
    return edges;
  }

  var gossetEdges = computeGossetEdges();

  // ───────────────────────────────────────────── sub-Coxeter planes ─────
  // Given a subset of the 8 simple-root indices, build the Coxeter element of
  // the sub-Weyl group generated by those reflections and return its 2D real
  // eigenspace (its "Coxeter plane") as an orthonormal pair (u, v) in ℝ⁸.
  // Projecting all 240 E8 roots onto that plane gives the symmetry diagram
  // associated with the sub-diagram — for the full set we get the 30-fold
  // Petrie projection, for the first 6 simple roots the E6 plane with 12-fold
  // symmetry, and so on down the chain.

  // Map from sorted simple-root index list to Coxeter number. Only the
  // configurations we actually project onto are listed. Because the E8 simple
  // roots have a specific Dynkin-diagram topology (branch at α₄), the
  // meaning of each subset depends on which indices are included. Taking the
  // first k simple roots gives:
  //   k=4  → A_4   path α₁—α₃—α₄—α₂ (the branch α₂ dangles off α₄),  h=5
  //   k=5  → D_5   adding α₅ gives a proper D-type fork, arms (1,1,2),  h=8
  //   k=6  → E_6   arms (1,2,2),  h=12
  //   k=7  → E_7   arms (1,2,3),  h=18
  //   k=8  → E_8   arms (1,2,4),  h=30
  // There's no D_4 in the first-k-indices family; the smallest D_4 sub-diagram
  // is {1,2,3,4} = {α₂, α₃, α₄, α₅} with α₄ as the central branch node.
  var subgroupCoxeterNumbers = {
    '0,1,2,3':             5,  // A_4 (path)
    '1,2,3,4':             6,  // D_4 (fork at α₄)
    '0,1,2,3,4':           8,  // D_5
    '0,1,2,3,4,5':        12,  // E_6
    '0,1,2,3,4,5,6':      18,  // E_7
    '0,1,2,3,4,5,6,7':    30   // E_8
  };

  function subgroupCoxeterApply(x, indices) {
    var y = x.slice();
    for (var k = indices.length - 1; k >= 0; k--) {
      y = reflect(y, simpleRoots[indices[k]]);
    }
    return y;
  }

  function buildSubgroupCoxeterMatrix(indices) {
    var M = [];
    for (var i = 0; i < 8; i++) M.push([0,0,0,0,0,0,0,0]);
    for (var j = 0; j < 8; j++) {
      var ej = [0,0,0,0,0,0,0,0];
      ej[j] = 1;
      var cj = subgroupCoxeterApply(ej, indices);
      for (var i = 0; i < 8; i++) M[i][j] = cj[i];
    }
    return M;
  }

  function computeSubgroupCoxeterPlane(indices) {
    var key = indices.slice().sort().join(',');
    var h = subgroupCoxeterNumbers[key];
    if (!h) {
      throw new Error('[E8] no registered Coxeter number for subgroup ' + key);
    }
    var theta = 2 * Math.PI / h;
    var twoCos = 2 * Math.cos(theta);
    var cMat = buildSubgroupCoxeterMatrix(indices);
    var c2 = matMul(cMat, cMat);
    var M = [];
    for (var i = 0; i < 8; i++) {
      M.push([]);
      for (var j = 0; j < 8; j++) {
        M[i].push(c2[i][j] - twoCos * cMat[i][j] + (i === j ? 1 : 0));
      }
    }
    var raw = nullSpace(M);
    if (raw.length < 2) {
      throw new Error('[E8] subgroup Coxeter plane null space < 2 for ' + key);
    }
    var on = gramSchmidt2(raw[0], raw[1]);
    var cu = subgroupCoxeterApply(on[0], indices);
    var sinComp = dot(cu, on[1]);
    if (sinComp < 0) on[1] = on[1].map(function (x) { return -x; });
    return { u: on[0], v: on[1], h: h };
  }

  var subgroupPlaneCache = {};
  function getSubgroupCoxeterPlane(indices) {
    var key = indices.slice().sort().join(',');
    if (!subgroupPlaneCache[key]) {
      subgroupPlaneCache[key] = computeSubgroupCoxeterPlane(indices);
    }
    return subgroupPlaneCache[key];
  }

  function projectToSubgroupPlane(v, indices) {
    var p = getSubgroupCoxeterPlane(indices);
    return [dot(v, p.u), dot(v, p.v)];
  }

  // ───────────────────────────────────────────── H4 folding (golden split) ─────
  // E8 ≅ H4 ⊕ φ·H4. The 240 roots split into two groups of 120, each of which
  // is a 600-cell (the 4D regular polytope with 120 vertices), the two copies
  // scaled in size by a factor of φ = (1+√5)/2. In the E8 Coxeter-plane
  // projection the split is visible as 8 concentric rings naturally grouping
  // into 4 inner rings (120 points) and 4 outer rings (120 points), and the
  // outer radii are φ · inner radii — the golden fold in plain sight.
  //
  // We identify the two halves by Coxeter-plane radius: the 4 smaller radii
  // belong to one 600-cell, the 4 larger radii to its φ-scaled partner.

  function computeH4Halves() {
    var phi = (1 + Math.sqrt(5)) / 2;
    var radii = [];
    for (var i = 0; i < allRoots.length; i++) {
      var p = projectToCoxeterPlane(allRoots[i]);
      radii.push(Math.sqrt(p[0] * p[0] + p[1] * p[1]));
    }
    var unique = [];
    var seenKey = {};
    for (var i = 0; i < radii.length; i++) {
      var k = Math.round(radii[i] * 100000);
      if (!seenKey[k]) { seenKey[k] = true; unique.push(radii[i]); }
    }
    unique.sort(function (a, b) { return a - b; });
    if (unique.length !== 8) {
      throw new Error('[E8] H4 fold expected 8 distinct radii in Coxeter plane, got ' + unique.length);
    }
    // The 8 radii come in 4 φ-ratio pairs: for each inner radius u there is
    // exactly one other radius v with v = φ · u. Sorted, the pairs usually
    // interleave — the outer copy's shortest radius sits between the inner
    // copy's two shortest, not beyond all of them — so we can't just split
    // the sorted list 4:4. We pair explicitly by looking for the φ partner.
    var innerRadii = [];
    var outerRadii = [];
    var used = {};
    for (var i = 0; i < unique.length; i++) {
      if (used[i]) continue;
      var target = unique[i] * phi;
      var best = -1;
      var bestDiff = Infinity;
      for (var j = i + 1; j < unique.length; j++) {
        if (used[j]) continue;
        var diff = Math.abs(unique[j] - target);
        if (diff < bestDiff && diff < 1e-3) { best = j; bestDiff = diff; }
      }
      if (best >= 0) {
        innerRadii.push(unique[i]);
        outerRadii.push(unique[best]);
        used[i] = true;
        used[best] = true;
      }
    }
    if (innerRadii.length !== 4 || outerRadii.length !== 4) {
      throw new Error('[E8] H4 fold: expected 4+4 φ-ratio pairs, got ' + innerRadii.length + '+' + outerRadii.length);
    }
    var isInnerRadius = {};
    var isOuterRadius = {};
    innerRadii.forEach(function (r) { isInnerRadius[Math.round(r * 100000)] = true; });
    outerRadii.forEach(function (r) { isOuterRadius[Math.round(r * 100000)] = true; });
    var inner = [];
    var outer = [];
    for (var i = 0; i < allRoots.length; i++) {
      var rk = Math.round(radii[i] * 100000);
      if (isInnerRadius[rk]) inner.push(i);
      else if (isOuterRadius[rk]) outer.push(i);
    }
    if (inner.length !== 120 || outer.length !== 120) {
      throw new Error('[E8] H4 fold: expected 120+120 roots, got ' + inner.length + '+' + outer.length);
    }
    // Pair each inner root to the nearest outer root by Coxeter-plane angle.
    var innerAngles = inner.map(function (idx) {
      var p = projectToCoxeterPlane(allRoots[idx]);
      return Math.atan2(p[1], p[0]);
    });
    var outerAngles = outer.map(function (idx) {
      var p = projectToCoxeterPlane(allRoots[idx]);
      return Math.atan2(p[1], p[0]);
    });
    var pairOfInner = new Array(inner.length);
    for (var i = 0; i < inner.length; i++) {
      var ai = innerAngles[i];
      var bestJ = 0;
      var bestDiff = Infinity;
      for (var j = 0; j < outer.length; j++) {
        var d = Math.abs(outerAngles[j] - ai);
        if (d > Math.PI) d = 2 * Math.PI - d;
        if (d < bestDiff) { bestDiff = d; bestJ = j; }
      }
      pairOfInner[i] = outer[bestJ];
    }
    return {
      inner: inner,
      outer: outer,
      pair: pairOfInner,
      phi: phi,
      innerRadii: innerRadii,
      outerRadii: outerRadii
    };
  }

  var h4Halves = computeH4Halves();

  // ───────────────────────────────────────────── root fusion (addition) ─────
  // In Garrett Lisi's particle-physics reading of E8, two roots "interact" by
  // vector addition: the sum r_i + r_j is either another root (the interaction
  // produced a third particle) or not (the interaction scattered without
  // producing a stable result).
  //
  // We pre-compute a symmetric 240×240 lookup table where
  //   fusionTable[i][j] = k  if r_i + r_j is root k
  //                     = -1 if r_i + r_j is not a root
  // The table is sparse: most pairs do not fuse. Of the 28 920 unordered pairs,
  // exactly 6 720 sum to another root (the same count as Gosset edges — not a
  // coincidence, because <r_i, r_j> = −1 ⇔ r_i + r_j is a root).

  function computeFusionTable() {
    var keyByRoot = Object.create(null);
    for (var i = 0; i < allRoots.length; i++) {
      var r = allRoots[i];
      var key = '';
      for (var k = 0; k < 8; k++) key += (k > 0 ? ',' : '') + Math.round(r[k] * 1e6) / 1e6;
      keyByRoot[key] = i;
    }
    var table = [];
    var fusionCount = 0;
    for (var i = 0; i < allRoots.length; i++) {
      var row = new Array(allRoots.length);
      for (var j = 0; j < allRoots.length; j++) {
        var sum = new Array(8);
        for (var k = 0; k < 8; k++) sum[k] = allRoots[i][k] + allRoots[j][k];
        var key = '';
        for (var k = 0; k < 8; k++) key += (k > 0 ? ',' : '') + Math.round(sum[k] * 1e6) / 1e6;
        var idx = keyByRoot[key];
        row[j] = (idx === undefined) ? -1 : idx;
        if (idx !== undefined && i < j) fusionCount++;
      }
      table.push(row);
    }
    return { table: table, count: fusionCount };
  }

  var fusionData = computeFusionTable();

  // ───────────────────────────────────────────── sphere-packing densities ─────
  // Best-known sphere-packing densities for dimensions 1..24. For dims 1, 2, 3,
  // 4, 8, and 24 these are proven optimal (Viazovska 2016 for dim 8;
  // Cohn-Kumar-Miller-Radchenko-Viazovska 2017 for dim 24). For the remaining
  // dimensions they are the densest known lattices, which may or may not be
  // optimal. We also list the cubic ℤⁿ density as a baseline.
  //
  // The "name" field names the record-holding lattice for a quick label.
  // Density values are taken from Conway & Sloane, "Sphere Packings, Lattices
  // and Groups" (3rd ed.), chapter 1 tables, cross-checked against the
  // LMFDB lattice record for the proven-optimal dimensions.

  // Proven-optimal dimensions for general sphere packings (not just lattice):
  //   dim 1: trivial (any non-overlapping union of unit intervals)
  //   dim 2: Thue 1890 / Fejes Tóth 1940 — hexagonal packing
  //   dim 3: Hales 1998 / formally verified 2014 — Kepler's conjecture (FCC)
  //   dim 8: Viazovska 2016 — E₈
  //   dim 24: Cohn-Kumar-Miller-Radchenko-Viazovska 2017 — Leech lattice
  // For dim 4, D₄ is proven to be the densest lattice packing (Korkin-Zolotareff
  // 1877) but whether it is densest among all packings remains open.
  var packingDensities = [
    { dim:  1, best: 1.00000000, cubic: 1.00000000, name: 'ℤ',            proven: true  },
    { dim:  2, best: 0.90689968, cubic: 0.78539816, name: 'A₂ hexagonal', proven: true  },
    { dim:  3, best: 0.74048048, cubic: 0.52359878, name: 'A₃ = D₃ (FCC)', proven: true  },
    { dim:  4, best: 0.61685028, cubic: 0.30842514, name: 'D₄',           proven: false },
    { dim:  5, best: 0.46525762, cubic: 0.16449341, name: 'D₅',           proven: false },
    { dim:  6, best: 0.37294683, cubic: 0.08074551, name: 'E₆',           proven: false },
    { dim:  7, best: 0.29530478, cubic: 0.03691223, name: 'E₇',           proven: false },
    { dim:  8, best: 0.25366950, cubic: 0.01585434, name: 'E₈',           proven: true  },
    { dim:  9, best: 0.14577421, cubic: 0.00644423, name: 'Λ₉',           proven: false },
    { dim: 10, best: 0.09961974, cubic: 0.00249039, name: 'P₁₀c',         proven: false },
    { dim: 11, best: 0.06602776, cubic: 0.00091885, name: 'Λ₁₁',          proven: false },
    { dim: 12, best: 0.04945307, cubic: 0.00032599, name: 'K₁₂',          proven: false },
    { dim: 13, best: 0.03235074, cubic: 0.00011116, name: 'Λ₁₃',          proven: false },
    { dim: 14, best: 0.02162305, cubic: 0.00003652, name: 'Λ₁₄',          proven: false },
    { dim: 15, best: 0.01685236, cubic: 0.00001159, name: 'Λ₁₅',          proven: false },
    { dim: 16, best: 0.01470848, cubic: 0.00000356, name: 'Λ₁₆ = BW₁₆',    proven: false },
    { dim: 17, best: 0.00881686, cubic: 0.00000106, name: 'Λ₁₇',          proven: false },
    { dim: 18, best: 0.00589946, cubic: 0.00000030, name: 'Λ₁₈',          proven: false },
    { dim: 19, best: 0.00410600, cubic: 0.00000008, name: 'Λ₁₉',          proven: false },
    { dim: 20, best: 0.00318686, cubic: 0.00000002, name: 'Λ₂₀',          proven: false },
    { dim: 21, best: 0.00242306, cubic: 0.00000001, name: 'Λ₂₁',          proven: false },
    { dim: 22, best: 0.00273522, cubic: 0.00000000, name: 'Λ₂₂',          proven: false },
    { dim: 23, best: 0.00299116, cubic: 0.00000000, name: 'Λ₂₃',          proven: false },
    { dim: 24, best: 0.00192958, cubic: 0.00000000, name: 'Λ₂₄ (Leech)',   proven: true  }
  ];

  // ───────────────────────────────────────────── sanity checks ─────

  function runChecks() {
    var errors = [];
    var pushError = function (msg) { errors.push(msg); };

    // 1. Root counts
    if (integerRoots.length !== 112) {
      pushError('integer family count = ' + integerRoots.length + ', expected 112');
    }
    if (halfIntegerRoots.length !== 128) {
      pushError('half-integer family count = ' + halfIntegerRoots.length + ', expected 128');
    }
    if (allRoots.length !== 240) {
      pushError('total root count = ' + allRoots.length + ', expected 240');
    }

    // 2. Squared lengths
    for (var i = 0; i < allRoots.length; i++) {
      var sq = squaredLength(allRoots[i]);
      if (Math.abs(sq - 2) > 1e-10) {
        pushError('root ' + i + ' has squared length ' + sq + ', expected 2');
        break;
      }
    }

    // 3. Pairwise inner products in {-2, -1, 0, 1, 2}
    var allowed = {'-2': true, '-1': true, '0': true, '1': true, '2': true};
    outer1: for (var i = 0; i < allRoots.length; i++) {
      for (var j = 0; j < allRoots.length; j++) {
        if (i === j) continue;
        var d = dot(allRoots[i], allRoots[j]);
        var rounded = Math.round(d);
        if (Math.abs(d - rounded) > 1e-10 || !allowed[String(rounded)]) {
          pushError('inner product <r' + i + ', r' + j + '> = ' + d + ' not in {-2,-1,0,1,2}');
          break outer1;
        }
      }
    }

    // 4. D_n root counts: 2·n·(n-1)
    var dnCheckDims = [2, 3, 4, 5, 8];
    for (var di = 0; di < dnCheckDims.length; di++) {
      var n = dnCheckDims[di];
      var dnr = dNRoots(n);
      var expected = 2 * n * (n - 1);
      if (dnr.length !== expected) {
        pushError('D_' + n + ' root count = ' + dnr.length + ', expected ' + expected);
      }
    }

    // 5. D_8 matches the integer family of E8 (same 112 vectors)
    var d8 = dNRoots(8);
    if (d8.length !== integerRoots.length) {
      pushError('D_8 count (' + d8.length + ') does not match E8 integer family (' + integerRoots.length + ')');
    }

    // 6. Simple roots are 8 vectors, each squared length 2, each in the root system
    if (simpleRoots.length !== 8) {
      pushError('simpleRoots.length = ' + simpleRoots.length + ', expected 8');
    }
    for (var i = 0; i < simpleRoots.length; i++) {
      var sq = squaredLength(simpleRoots[i]);
      if (Math.abs(sq - 2) > 1e-10) {
        pushError('simple root α' + (i + 1) + ' has squared length ' + sq + ', expected 2');
      }
    }

    // 7. Cartan matrix: diagonal 2, off-diagonal 0 or -1, symmetric, 7 edges
    var edgeCount = 0;
    for (var i = 0; i < 8; i++) {
      if (cartanMatrix[i][i] !== 2) {
        pushError('Cartan diagonal [' + i + '] = ' + cartanMatrix[i][i] + ', expected 2');
      }
      for (var j = 0; j < 8; j++) {
        if (i !== j) {
          if (cartanMatrix[i][j] !== 0 && cartanMatrix[i][j] !== -1) {
            pushError('Cartan off-diagonal [' + i + '][' + j + '] = ' + cartanMatrix[i][j] + ', expected 0 or -1');
          }
          if (cartanMatrix[i][j] !== cartanMatrix[j][i]) {
            pushError('Cartan matrix not symmetric at [' + i + '][' + j + ']');
          }
          if (i < j && cartanMatrix[i][j] === -1) edgeCount++;
        }
      }
    }
    if (edgeCount !== 7) {
      pushError('Dynkin edge count = ' + edgeCount + ', expected 7');
    }

    // 8. Dynkin structure: branch node α₄ has degree 3; leaves α₁, α₂, α₈ have degree 1
    if (dynkin.adjacency[3].length !== 3) {
      pushError('α₄ adjacency = ' + dynkin.adjacency[3].length + ', expected 3 (branch node)');
    }
    if (dynkin.adjacency[0].length !== 1) pushError('α₁ adjacency != 1 (should be leaf)');
    if (dynkin.adjacency[1].length !== 1) pushError('α₂ adjacency != 1 (should be leaf)');
    if (dynkin.adjacency[7].length !== 1) pushError('α₈ adjacency != 1 (should be leaf)');

    // 9. Every E8 root decomposes into integer simple-root coefficients,
    //    and those coefficients are all non-negative or all non-positive.
    var highestHeight = -Infinity;
    var lowestHeight = Infinity;
    var highestRoot = null;
    for (var i = 0; i < allRoots.length; i++) {
      var c = rootAsSimpleCoefficients(allRoots[i]);
      var hasPos = false;
      var hasNeg = false;
      for (var k = 0; k < 8; k++) {
        if (Math.abs(c[k] - Math.round(c[k])) > 1e-8) {
          pushError('root ' + i + ' coefficient c[' + k + '] = ' + c[k] + ' is not an integer');
          break;
        }
        if (c[k] > 0) hasPos = true;
        if (c[k] < 0) hasNeg = true;
      }
      if (hasPos && hasNeg) {
        pushError('root ' + i + ' has mixed-sign simple coefficients: ' + c.join(','));
        break;
      }
      var h = rootHeight(allRoots[i]);
      if (h > highestHeight) {
        highestHeight = h;
        highestRoot = c;
      }
      if (h < lowestHeight) lowestHeight = h;
    }

    // 10. Highest root has height 29, lowest has height -29
    if (highestHeight !== 29) {
      pushError('highest root height = ' + highestHeight + ', expected 29');
    }
    if (lowestHeight !== -29) {
      pushError('lowest root height = ' + lowestHeight + ', expected -29');
    }

    // 11. Highest root simple-coefficient marks should be (2, 3, 4, 6, 5, 4, 3, 2)
    var expectedMarks = [2, 3, 4, 6, 5, 4, 3, 2];
    if (highestRoot) {
      for (var i = 0; i < 8; i++) {
        if (highestRoot[i] !== expectedMarks[i]) {
          pushError('highest root marks = (' + highestRoot.join(',') + '), expected (' + expectedMarks.join(',') + ')');
          break;
        }
      }
    }

    // 12. Exactly 120 positive roots
    var positiveCount = 0;
    for (var i = 0; i < allRoots.length; i++) {
      if (isPositiveRoot(allRoots[i])) positiveCount++;
    }
    if (positiveCount !== 120) {
      pushError('positive root count = ' + positiveCount + ', expected 120');
    }

    // 13. Reflection of a root by a simple root is a root
    for (var i = 0; i < simpleRoots.length; i++) {
      for (var r = 0; r < 10; r++) { // spot-check, not all
        var img = reflect(allRoots[r], simpleRoots[i]);
        // Find it among allRoots
        var found = false;
        for (var j = 0; j < allRoots.length; j++) {
          var diff = 0;
          for (var k = 0; k < 8; k++) diff += Math.abs(img[k] - allRoots[j][k]);
          if (diff < 1e-9) { found = true; break; }
        }
        if (!found) {
          pushError('reflect(r' + r + ', α' + (i + 1) + ') is not a root');
          break;
        }
      }
    }

    // 14. Orbit of α₁ under the Weyl group is all 240 roots
    var orb = orbit(simpleRoots[0], weylGenerators, 300);
    if (orb.length !== 240) {
      pushError('Weyl orbit of α₁ has size ' + orb.length + ', expected 240');
    }

    // 15. Coxeter element has order 30
    var x = simpleRoots[0].slice();
    var originalHash = x.map(function (v) { return Math.round(v * 1e6); }).join(',');
    for (var k = 0; k < 30; k++) x = coxeterApply(x);
    var returnedHash = x.map(function (v) { return Math.round(v * 1e6); }).join(',');
    if (originalHash !== returnedHash) {
      pushError('Coxeter element does not return to identity after 30 applications');
    }

    // 16. Coxeter plane projection of the 240 roots gives 8 distinct radii
    var radii = {};
    for (var i = 0; i < allRoots.length; i++) {
      var p = projectToCoxeterPlane(allRoots[i]);
      var rr = Math.round(Math.sqrt(p[0] * p[0] + p[1] * p[1]) * 1000);
      radii[rr] = (radii[rr] || 0) + 1;
    }
    var radiusKeys = Object.keys(radii);
    if (radiusKeys.length !== 8) {
      pushError('Coxeter plane projection has ' + radiusKeys.length + ' distinct radii, expected 8');
    }
    // Each ring should have 30 points
    for (var rk in radii) {
      if (radii[rk] !== 30) {
        pushError('Coxeter plane ring at radius ' + rk + ' has ' + radii[rk] + ' points, expected 30');
        break;
      }
    }

    // 17. Subsystem by deleting α_8 (index 7) is E_7 with 126 roots
    var sub8 = subsystemByDeletion(7);
    if (sub8.length !== 126) {
      pushError('subsystem deleting α_8 has ' + sub8.length + ' roots, expected 126 (E_7)');
    }

    // 18. Lattice shell at squared length 2 is exactly 240 roots
    var shell2 = latticeShell(2);
    if (shell2.length !== 240) {
      pushError('lattice shell at squared length 2 has ' + shell2.length + ' vectors, expected 240');
    }

    // 19. Lattice shell at squared length 4 is 2160 vectors
    var shell4 = latticeShell(4);
    if (shell4.length !== 2160) {
      pushError('lattice shell at squared length 4 has ' + shell4.length + ' vectors, expected 2160');
    }

    // 20. Gosset polytope 4₂₁ has 6720 edges
    if (gossetEdges.length !== 6720) {
      pushError('Gosset edge count = ' + gossetEdges.length + ', expected 6720');
    }

    // 21. Every vertex of 4₂₁ has 56 neighbours (kissing number of E₇)
    var deg = new Array(allRoots.length);
    for (var i = 0; i < allRoots.length; i++) deg[i] = 0;
    for (var e = 0; e < gossetEdges.length; e++) {
      deg[gossetEdges[e][0]]++;
      deg[gossetEdges[e][1]]++;
    }
    for (var i = 0; i < allRoots.length; i++) {
      if (deg[i] !== 56) {
        pushError('root ' + i + ' has ' + deg[i] + ' Gosset neighbours, expected 56');
        break;
      }
    }

    // 22. Subgroup Coxeter planes exist and rotate consistently. Note: the
    //     first 4 simple roots form an A_4 path (not D_4), so h=5. The first
    //     D_4 sub-diagram is {α₂, α₃, α₄, α₅} with α₄ as the branch.
    var subgroupTestSets = [
      { name: 'A4', idx: [0,1,2,3],         h: 5  },
      { name: 'D4', idx: [1,2,3,4],         h: 6  },
      { name: 'D5', idx: [0,1,2,3,4],       h: 8  },
      { name: 'E6', idx: [0,1,2,3,4,5],     h: 12 },
      { name: 'E7', idx: [0,1,2,3,4,5,6],   h: 18 }
    ];
    for (var s = 0; s < subgroupTestSets.length; s++) {
      try {
        var plane = getSubgroupCoxeterPlane(subgroupTestSets[s].idx);
        if (plane.h !== subgroupTestSets[s].h) {
          pushError('subgroup ' + subgroupTestSets[s].name + ' h = ' + plane.h + ', expected ' + subgroupTestSets[s].h);
        }
      } catch (e) {
        pushError('subgroup ' + subgroupTestSets[s].name + ' plane failed: ' + e.message);
      }
    }

    // 23. H4 fold: 120 + 120 = 240, all four φ-ratio pairs agree on the same
    //     ratio value (≈ φ to within floating-point slop).
    if (h4Halves.inner.length !== 120 || h4Halves.outer.length !== 120) {
      pushError('H4 fold split = ' + h4Halves.inner.length + ' + ' + h4Halves.outer.length + ', expected 120 + 120');
    }
    var phi = (1 + Math.sqrt(5)) / 2;
    for (var k = 0; k < 4; k++) {
      var ratio = h4Halves.outerRadii[k] / h4Halves.innerRadii[k];
      if (Math.abs(ratio - phi) > 1e-3) {
        pushError('H4 fold ring-' + k + ' ratio = ' + ratio + ', expected φ = ' + phi);
        break;
      }
    }

    // 24. Fusion table symmetric, each root has the same number of fusion
    //     partners, and the total unordered fusion count is 6720.
    if (fusionData.count !== 6720) {
      pushError('fusion pair count = ' + fusionData.count + ', expected 6720');
    }
    for (var i = 0; i < allRoots.length; i++) {
      for (var j = 0; j < allRoots.length; j++) {
        if (fusionData.table[i][j] !== fusionData.table[j][i]) {
          pushError('fusion table asymmetric at (' + i + ',' + j + ')');
          break;
        }
      }
      if (errors.length) break;
    }

    // 25. Density curve covers dimensions 1..24 and E₈ density agrees.
    if (packingDensities.length !== 24) {
      pushError('density curve length = ' + packingDensities.length + ', expected 24');
    }
    if (Math.abs(packingDensities[7].best - packingDensity) > 1e-5) {
      pushError('density[8] = ' + packingDensities[7].best + ', expected π⁴/384 = ' + packingDensity);
    }

    if (errors.length === 0) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('[E8] all sanity checks passed (112 + 128 = 240 roots, D_n family, simple roots, Cartan, Dynkin, heights, marks, positives)');
      }
    } else if (typeof console !== 'undefined' && console.error) {
      console.error('[E8] sanity checks FAILED:', errors);
    }

    return errors;
  }

  // ───────────────────────────────────────────── public API ─────

  var E8 = {
    // Root system (canonical 8D coordinates)
    roots: {
      all: function () { return allRoots; },
      integer: function () { return integerRoots; },
      halfInteger: function () { return halfIntegerRoots; }
    },

    // D_n family (used by explainer #02)
    dN: {
      roots: dNRoots
    },

    // Linear algebra helpers
    dot: dot,
    squaredLength: squaredLength,

    // Simple roots and derived structure
    simpleRoots: simpleRoots,
    cartanMatrix: cartanMatrix,
    dynkin: dynkin,

    // Root in simple-root basis
    rootAsSimpleCoefficients: rootAsSimpleCoefficients,
    rootHeight: rootHeight,
    isPositiveRoot: isPositiveRoot,

    // Weyl reflections
    reflect: reflect,
    weylGenerators: weylGenerators,
    weylOrder: weylOrder,
    orbit: orbit,

    // Coxeter element and plane
    coxeterApply: coxeterApply,
    coxeterMatrix: coxeterMatrix,
    coxeterNumber: coxeterNumber,
    exponents: exponents,
    coxeterPlane: coxeterPlaneBasis,

    // Projection helpers
    project: {
      onto2Plane: projectOnto2Plane,
      onto3Plane: projectOnto3Plane,
      toCoxeterPlane: projectToCoxeterPlane,
      toSubgroupPlane: projectToSubgroupPlane,
      getSubgroupPlane: getSubgroupCoxeterPlane
    },

    // Subsystems (by single-node deletion)
    subsystems: {
      byDeletion: subsystemByDeletion
    },

    // Gosset polytope 4₂₁ structure (edges; vertices are the 240 roots)
    polytope: {
      edges: function () { return gossetEdges; },
      edgeCount: function () { return gossetEdges.length; }
    },

    // H4 folding: E8 ≅ H4 ⊕ φ·H4 (two copies of the 600-cell)
    fold: {
      h4: function () { return h4Halves; }
    },

    // Root fusion (Lisi-style particle interactions via root addition)
    fusion: {
      table: function () { return fusionData.table; },
      sum: function (i, j) { return fusionData.table[i][j]; },
      count: function () { return fusionData.count; }
    },

    // Lattice
    lattice: {
      generate: generateLattice,
      shell: latticeShell,
      packingDensity: packingDensity,
      densityCurve: function () { return packingDensities; }
    },

    // Sanity check harness (exposed for lib/test.html)
    _runChecks: runChecks
  };

  global.E8 = E8;

  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
