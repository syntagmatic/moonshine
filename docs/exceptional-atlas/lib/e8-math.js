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
      toCoxeterPlane: projectToCoxeterPlane
    },

    // Subsystems (by single-node deletion)
    subsystems: {
      byDeletion: subsystemByDeletion
    },

    // Lattice
    lattice: {
      generate: generateLattice,
      shell: latticeShell,
      packingDensity: packingDensity
    },

    // Sanity check harness (exposed for lib/test.html)
    _runChecks: runChecks
  };

  global.E8 = E8;

  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
