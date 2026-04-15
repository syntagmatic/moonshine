// lie-math.js — Root systems, Cartan matrices, Dynkin diagrams, and Weyl
// groups for every finite-dimensional simple Lie algebra over ℂ.
//
// Attaches a single `Lie` object to the global scope (no modules, no build
// step). Companion to `../e8-lattice/lib/e8-math.js`, which remains the
// authoritative source for E₈-specific helpers (Coxeter plane projection,
// full lattice shells, Viazovska packing density, etc.). Pages that need
// those helpers load both files — this one is authoritative for everything
// except the E₈-specific extras.
//
// Supported types (with the conventional minimum rank at which the Dynkin
// diagram becomes irreducible and non-isomorphic to a lower-rank case):
//
//   A_n  (n ≥ 1):  sl(n+1)     dim n²+2n    Coxeter n+1     |W|=(n+1)!
//   B_n  (n ≥ 2):  so(2n+1)    dim n(2n+1)  Coxeter 2n      |W|=2ⁿ·n!
//   C_n  (n ≥ 2):  sp(2n)      dim n(2n+1)  Coxeter 2n      |W|=2ⁿ·n!
//   D_n  (n ≥ 3):  so(2n)      dim n(2n-1)  Coxeter 2n-2    |W|=2ⁿ⁻¹·n!
//   E_6:                       dim 78       Coxeter 12      |W|=51840
//   E_7:                       dim 133      Coxeter 18      |W|=2903040
//   E_8:                       dim 248      Coxeter 30      |W|=696729600
//   F_4:                       dim 52       Coxeter 12      |W|=1152
//   G_2:                       dim 14       Coxeter 6       |W|=12
//
// Public API
// ----------
// Lie.build(type, rank) → { …algebra struct }    (central entry point)
//
// Shortcuts: Lie.A(n), Lie.B(n), Lie.C(n), Lie.D(n),
//            Lie.E6(), Lie.E7(), Lie.E8(), Lie.F4(), Lie.G2()
//
// Each returned struct has:
//   type              'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
//   rank              the rank (number of simple roots)
//   dim               dimension of the Lie algebra as a complex vector space
//   name              e.g. 'A_5', 'E_8', 'F_4'
//   ambientDim        dimension of the ambient Euclidean space
//   coxeterNumber     the Coxeter number h
//   weylOrder         |W|
//   simpleRoots       rank-many vectors in ambient coordinates
//   roots             all roots in ambient coordinates
//   posRoots          lex-positive half of `roots`
//   cartan            rank×rank integer Cartan matrix
//   dynkin            { edges, adjacency, nodeLabels, layout }
//   reflect(x, α)     Weyl reflection of x across the hyperplane ⊥ α
//   weylGenerators    [reflections in each simple root]
//   orbit(start,lim)  BFS orbit under the simple-root reflections
//   toSimpleCoefficients(v)  expand a vector in the simple-root basis
//
// Each Dynkin edge is an object { i, j, mult, arrow }, where i < j are the
// 0-indexed simple roots meeting at the edge, `mult` is 1/2/3 (the product
// C_{ij}·C_{ji}), and `arrow` is null for a simple edge or [long, short] for
// a double/triple edge, pointing from the longer simple root to the shorter.
//
// The dynkin.layout gives each node an { id, x, y } pair in a nominal
// coordinate space (~60 units per edge). Consumers scale and center it.

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── linear algebra primitives ──

  function zeros(n) {
    var a = new Array(n);
    for (var i = 0; i < n; i++) a[i] = 0;
    return a;
  }

  function dot(a, b) {
    var s = 0;
    var n = a.length;
    for (var i = 0; i < n; i++) s += a[i] * b[i];
    return s;
  }

  function squaredLength(a) { return dot(a, a); }

  function reflect(x, alpha) {
    var c = 2 * dot(x, alpha) / dot(alpha, alpha);
    var out = new Array(x.length);
    for (var i = 0; i < x.length; i++) out[i] = x[i] - c * alpha[i];
    return out;
  }

  function factorial(n) {
    var r = 1;
    for (var i = 2; i <= n; i++) r *= i;
    return r;
  }

  // Gauss-Jordan inverse; small square matrices only.
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
      if (best < 1e-12) throw new Error('[Lie] matrix is singular');
      if (pivot !== col) {
        var tmp = A[col]; A[col] = A[pivot]; A[pivot] = tmp;
      }
      var div = A[col][col];
      for (var j = 0; j < 2 * n; j++) A[col][j] /= div;
      for (var rr = 0; rr < n; rr++) {
        if (rr === col) continue;
        var f = A[rr][col];
        if (f === 0) continue;
        for (var j2 = 0; j2 < 2 * n; j2++) A[rr][j2] -= f * A[col][j2];
      }
    }
    var inv = [];
    for (var i2 = 0; i2 < n; i2++) {
      inv.push([]);
      for (var j3 = 0; j3 < n; j3++) inv[i2].push(A[i2][j3 + n]);
    }
    return inv;
  }

  // Expand a vector v in a basis of `simple` roots using the Gram matrix
  // normal equations. Works even when the simple roots span a proper
  // subspace of the ambient Euclidean space (as for A_n and G_2).
  function simpleCoefficientSolver(simple) {
    var k = simple.length;
    var G = [];
    for (var i = 0; i < k; i++) {
      G.push([]);
      for (var j = 0; j < k; j++) G[i].push(dot(simple[i], simple[j]));
    }
    var Ginv = invertMatrix(G);
    return function (v) {
      var b = new Array(k);
      for (var i = 0; i < k; i++) b[i] = dot(simple[i], v);
      var c = new Array(k);
      for (var i = 0; i < k; i++) {
        var s = 0;
        for (var j = 0; j < k; j++) s += Ginv[i][j] * b[j];
        // Snap near-integers — every root of a simple Lie algebra expands
        // into integer simple-root coefficients.
        var rounded = Math.round(s);
        c[i] = Math.abs(s - rounded) < 1e-7 ? rounded : s;
      }
      return c;
    };
  }

  // ─────────────────────────────────────────── Weyl orbit (BFS) ──

  function keyOf(v) {
    var s = '';
    for (var i = 0; i < v.length; i++) {
      s += (i > 0 ? ',' : '') + Math.round(v[i] * 1e6);
    }
    return s;
  }

  function orbit(start, generators, maxSize) {
    var limit = maxSize || 20000;
    var seen = Object.create(null);
    var list = [];
    var queue = [start];
    seen[keyOf(start)] = true;
    list.push(start);
    while (queue.length > 0 && list.length < limit) {
      var cur = queue.shift();
      for (var g = 0; g < generators.length; g++) {
        var next = generators[g](cur);
        var k = keyOf(next);
        if (!seen[k]) {
          seen[k] = true;
          list.push(next);
          queue.push(next);
        }
      }
    }
    return list;
  }

  // ─────────────────────────────────────────── classical families ──

  function typeA(n) {
    if (n < 1) throw new Error('[Lie] A_n requires n ≥ 1');
    var d = n + 1;
    var roots = [];
    // n(n+1) roots of the form e_i − e_j, i ≠ j
    for (var i = 0; i < d; i++) {
      for (var j = 0; j < d; j++) {
        if (i === j) continue;
        var r = zeros(d);
        r[i] = 1; r[j] = -1;
        roots.push(r);
      }
    }
    var simple = [];
    for (var i = 0; i < n; i++) {
      var r = zeros(d);
      r[i] = 1; r[i + 1] = -1;
      simple.push(r);
    }
    return finalize({
      type: 'A', rank: n, name: 'A_' + n,
      dim: n * (n + 2),
      ambientDim: d,
      coxeterNumber: n + 1,
      weylOrder: factorial(n + 1),
      simple: simple, roots: roots
    });
  }

  function typeB(n) {
    if (n < 2) throw new Error('[Lie] B_n requires n ≥ 2');
    var roots = [];
    // 2n(n−1) long roots: ±e_i ± e_j
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      for (var si = 0; si < 2; si++) for (var sj = 0; sj < 2; sj++) {
        var r = zeros(n);
        r[i] = si === 0 ? 1 : -1;
        r[j] = sj === 0 ? 1 : -1;
        roots.push(r);
      }
    }
    // 2n short roots: ±e_i
    for (var i2 = 0; i2 < n; i2++) {
      var p = zeros(n); p[i2] = 1; roots.push(p);
      var q = zeros(n); q[i2] = -1; roots.push(q);
    }
    var simple = [];
    for (var k = 0; k < n - 1; k++) {
      var r2 = zeros(n); r2[k] = 1; r2[k + 1] = -1; simple.push(r2);
    }
    var last = zeros(n); last[n - 1] = 1; simple.push(last);
    return finalize({
      type: 'B', rank: n, name: 'B_' + n,
      dim: n * (2 * n + 1),
      ambientDim: n,
      coxeterNumber: 2 * n,
      weylOrder: (1 << n) * factorial(n),
      simple: simple, roots: roots
    });
  }

  function typeC(n) {
    if (n < 2) throw new Error('[Lie] C_n requires n ≥ 2');
    var roots = [];
    // 2n(n−1) short roots: ±e_i ± e_j
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      for (var si = 0; si < 2; si++) for (var sj = 0; sj < 2; sj++) {
        var r = zeros(n);
        r[i] = si === 0 ? 1 : -1;
        r[j] = sj === 0 ? 1 : -1;
        roots.push(r);
      }
    }
    // 2n long roots: ±2e_i
    for (var i2 = 0; i2 < n; i2++) {
      var p = zeros(n); p[i2] = 2; roots.push(p);
      var q = zeros(n); q[i2] = -2; roots.push(q);
    }
    var simple = [];
    for (var k = 0; k < n - 1; k++) {
      var r2 = zeros(n); r2[k] = 1; r2[k + 1] = -1; simple.push(r2);
    }
    var last = zeros(n); last[n - 1] = 2; simple.push(last);
    return finalize({
      type: 'C', rank: n, name: 'C_' + n,
      dim: n * (2 * n + 1),
      ambientDim: n,
      coxeterNumber: 2 * n,
      weylOrder: (1 << n) * factorial(n),
      simple: simple, roots: roots
    });
  }

  function typeD(n) {
    if (n < 3) throw new Error('[Lie] D_n requires n ≥ 3');
    var roots = [];
    // 2n(n−1) roots: ±e_i ± e_j
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      for (var si = 0; si < 2; si++) for (var sj = 0; sj < 2; sj++) {
        var r = zeros(n);
        r[i] = si === 0 ? 1 : -1;
        r[j] = sj === 0 ? 1 : -1;
        roots.push(r);
      }
    }
    var simple = [];
    for (var k = 0; k < n - 1; k++) {
      var r2 = zeros(n); r2[k] = 1; r2[k + 1] = -1; simple.push(r2);
    }
    var fork = zeros(n); fork[n - 2] = 1; fork[n - 1] = 1; simple.push(fork);
    return finalize({
      type: 'D', rank: n, name: 'D_' + n,
      dim: n * (2 * n - 1),
      ambientDim: n,
      coxeterNumber: 2 * n - 2,
      weylOrder: (1 << (n - 1)) * factorial(n),
      simple: simple, roots: roots
    });
  }

  // ─────────────────────────────────────────── E-series ──
  // Bourbaki conventions. The E_8 Dynkin diagram:
  //
  //                   α₂
  //                   |
  //          α₁ — α₃ — α₄ — α₅ — α₆ — α₇ — α₈
  //
  // E_7 is obtained by deleting α_8; E_6 by deleting α_7 and α_8.

  var E8_SIMPLE_ROOTS = [
    [ 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,  0.5], // α_1
    [ 1,    1,    0,    0,    0,    0,    0,    0 ],  // α_2
    [-1,    1,    0,    0,    0,    0,    0,    0 ],  // α_3
    [ 0,   -1,    1,    0,    0,    0,    0,    0 ],  // α_4
    [ 0,    0,   -1,    1,    0,    0,    0,    0 ],  // α_5
    [ 0,    0,    0,   -1,    1,    0,    0,    0 ],  // α_6
    [ 0,    0,    0,    0,   -1,    1,    0,    0 ],  // α_7
    [ 0,    0,    0,    0,    0,   -1,    1,    0 ]   // α_8
  ];

  function e8AllRoots() {
    var roots = [];
    // 112 integer-family roots: ±e_i ± e_j
    for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) {
      for (var si = 0; si < 2; si++) for (var sj = 0; sj < 2; sj++) {
        var r = zeros(8);
        r[i] = si === 0 ? 1 : -1;
        r[j] = sj === 0 ? 1 : -1;
        roots.push(r);
      }
    }
    // 128 half-integer-family roots: (±½)⁸ with an even number of minuses
    for (var mask = 0; mask < 256; mask++) {
      var bits = 0;
      for (var k = 0; k < 8; k++) if (mask & (1 << k)) bits++;
      if (bits % 2 !== 0) continue;
      var r2 = zeros(8);
      for (var kk = 0; kk < 8; kk++) r2[kk] = (mask & (1 << kk)) ? -0.5 : 0.5;
      roots.push(r2);
    }
    return roots;
  }

  function typeE(rank) {
    if (rank < 6 || rank > 8) throw new Error('[Lie] E_n requires n ∈ {6,7,8}');
    var all = e8AllRoots();
    var simple = E8_SIMPLE_ROOTS.slice(0, rank).map(function (r) { return r.slice(); });
    var solver8 = simpleCoefficientSolver(E8_SIMPLE_ROOTS);
    var roots = rank === 8 ? all : all.filter(function (r) {
      var c = solver8(r);
      for (var k = rank; k < 8; k++) {
        if (Math.abs(c[k]) > 1e-6) return false;
      }
      return true;
    });
    var stats = {
      6: { dim: 78,  coxeter: 12, weyl: 51840 },
      7: { dim: 133, coxeter: 18, weyl: 2903040 },
      8: { dim: 248, coxeter: 30, weyl: 696729600 }
    }[rank];
    return finalize({
      type: 'E', rank: rank, name: 'E_' + rank,
      dim: stats.dim,
      ambientDim: 8,
      coxeterNumber: stats.coxeter,
      weylOrder: stats.weyl,
      simple: simple, roots: roots
    });
  }

  // ─────────────────────────────────────────── F_4 ──
  // Long roots have squared length 2, short roots squared length 1.

  function typeF4() {
    var simple = [
      [0,    1,   -1,    0  ],              // α_1 = e_2 − e_3          long
      [0,    0,    1,   -1  ],              // α_2 = e_3 − e_4          long
      [0,    0,    0,    1  ],              // α_3 = e_4                short
      [0.5, -0.5, -0.5, -0.5]                // α_4 = ½(e_1−e_2−e_3−e_4) short
    ];
    var roots = [];
    // 24 long: ±e_i ± e_j, i < j
    for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) {
      for (var si = 0; si < 2; si++) for (var sj = 0; sj < 2; sj++) {
        var r = zeros(4);
        r[i] = si === 0 ? 1 : -1;
        r[j] = sj === 0 ? 1 : -1;
        roots.push(r);
      }
    }
    // 8 short: ±e_i
    for (var k = 0; k < 4; k++) {
      var p = zeros(4); p[k] = 1; roots.push(p);
      var q = zeros(4); q[k] = -1; roots.push(q);
    }
    // 16 short: ½(±e_1 ± e_2 ± e_3 ± e_4)
    for (var mask = 0; mask < 16; mask++) {
      var r2 = zeros(4);
      for (var kk = 0; kk < 4; kk++) r2[kk] = (mask & (1 << kk)) ? -0.5 : 0.5;
      roots.push(r2);
    }
    return finalize({
      type: 'F', rank: 4, name: 'F_4',
      dim: 52,
      ambientDim: 4,
      coxeterNumber: 12,
      weylOrder: 1152,
      simple: simple, roots: roots
    });
  }

  // ─────────────────────────────────────────── G_2 ──
  // Embedded in ℝ³ on the hyperplane x+y+z=0 (the same ambient space as A_2).

  function typeG2() {
    var simple = [
      [ 1, -1,  0],    // α_1 = e_1 − e_2           short (squared length 2)
      [-2,  1,  1]     // α_2 = −2e_1 + e_2 + e_3   long  (squared length 6)
    ];
    var roots = [];
    // 6 short: ±(e_i − e_j) for i ≠ j
    var pairs = [[0, 1], [0, 2], [1, 2]];
    for (var p = 0; p < pairs.length; p++) {
      var i = pairs[p][0], j = pairs[p][1];
      var a = zeros(3); a[i] = 1; a[j] = -1; roots.push(a);
      var b = zeros(3); b[i] = -1; b[j] = 1; roots.push(b);
    }
    // 6 long: ±(2e_i − e_j − e_k)
    for (var ii = 0; ii < 3; ii++) {
      var pos = zeros(3);
      pos[ii] = 2;
      for (var kk = 0; kk < 3; kk++) if (kk !== ii) pos[kk] = -1;
      roots.push(pos.slice());
      var neg = pos.map(function (x) { return -x; });
      roots.push(neg);
    }
    return finalize({
      type: 'G', rank: 2, name: 'G_2',
      dim: 14,
      ambientDim: 3,
      coxeterNumber: 6,
      weylOrder: 12,
      simple: simple, roots: roots
    });
  }

  // ─────────────────────────────────────────── finalize ──
  // From a skeleton {type, rank, simple, roots, …} derive Cartan matrix,
  // Dynkin edges/adjacency/layout, lex-positive roots, Weyl generators, and
  // the simple-coefficient solver.

  function finalize(spec) {
    var rank = spec.rank;

    // Cartan matrix
    var cartan = [];
    for (var i = 0; i < rank; i++) {
      cartan.push([]);
      for (var j = 0; j < rank; j++) {
        var raw = 2 * dot(spec.simple[i], spec.simple[j]) / dot(spec.simple[j], spec.simple[j]);
        cartan[i].push(Math.round(raw));
      }
    }

    // Dynkin edges
    var edges = [];
    for (var a = 0; a < rank; a++) {
      for (var b = a + 1; b < rank; b++) {
        var mult = cartan[a][b] * cartan[b][a];
        if (mult === 0) continue;
        var arrow = null;
        if (mult >= 2) {
          var la = dot(spec.simple[a], spec.simple[a]);
          var lb = dot(spec.simple[b], spec.simple[b]);
          arrow = la > lb ? [a, b] : [b, a];
        }
        edges.push({ i: a, j: b, mult: mult, arrow: arrow });
      }
    }

    // Adjacency
    var adjacency = [];
    for (var k = 0; k < rank; k++) adjacency.push([]);
    for (var e = 0; e < edges.length; e++) {
      adjacency[edges[e].i].push(edges[e].j);
      adjacency[edges[e].j].push(edges[e].i);
    }

    var dynkin = {
      edges: edges,
      adjacency: adjacency,
      nodeLabels: buildNodeLabels(rank),
      layout: layoutFor(spec.type, rank)
    };

    // Simple-coefficient expansion
    var toSimple = simpleCoefficientSolver(spec.simple);

    // Lex-positive split: α is positive iff its first nonzero simple
    // coefficient is positive. This always partitions Δ into two halves of
    // the same size, even for non-simply-laced types.
    var posRoots = spec.roots.filter(function (r) {
      var c = toSimple(r);
      for (var m = 0; m < c.length; m++) {
        if (c[m] > 1e-9) return true;
        if (c[m] < -1e-9) return false;
      }
      return false;
    });

    // Weyl generators (reflections in each simple root)
    var weylGenerators = spec.simple.map(function (alpha) {
      return function (x) { return reflect(x, alpha); };
    });

    return {
      type: spec.type,
      rank: rank,
      dim: spec.dim,
      name: spec.name,
      ambientDim: spec.ambientDim,
      coxeterNumber: spec.coxeterNumber,
      weylOrder: spec.weylOrder,
      simpleRoots: spec.simple,
      roots: spec.roots,
      posRoots: posRoots,
      cartan: cartan,
      dynkin: dynkin,
      reflect: reflect,
      weylGenerators: weylGenerators,
      orbit: function (start, limit) { return orbit(start, weylGenerators, limit); },
      toSimpleCoefficients: toSimple
    };
  }

  // ─────────────────────────────────────────── labels + Dynkin layout ──

  var SUBSCRIPTS = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};

  function subDigits(n) {
    var out = '';
    var str = String(n);
    for (var i = 0; i < str.length; i++) out += SUBSCRIPTS[str.charAt(i)] || str.charAt(i);
    return out;
  }

  function buildNodeLabels(rank) {
    var out = [];
    for (var i = 1; i <= rank; i++) out.push('α' + subDigits(i));
    return out;
  }

  // All layouts use a nominal 60-unit edge length. Consumers rescale.
  function layoutFor(type, rank) {
    var dx = 60;
    var nodes;
    if (type === 'A' || type === 'B' || type === 'C' || type === 'F' || type === 'G') {
      nodes = [];
      for (var i = 0; i < rank; i++) nodes.push({ id: i, x: i * dx, y: 0 });
      return { nodes: nodes };
    }
    if (type === 'D') {
      // Main chain α_1 — α_2 — … — α_{n-1}, with α_n above α_{n-2}.
      nodes = new Array(rank);
      for (var k = 0; k < rank - 1; k++) nodes[k] = { id: k, x: k * dx, y: 0 };
      nodes[rank - 1] = { id: rank - 1, x: (rank - 3) * dx, y: -dx };
      return { nodes: nodes };
    }
    if (type === 'E') {
      // Main chain α_1 — α_3 — α_4 — α_5 — … — α_rank, with α_2 above α_4.
      nodes = new Array(rank);
      var main = [0, 2, 3];
      for (var m = 4; m < rank; m++) main.push(m);
      for (var p = 0; p < main.length; p++) {
        nodes[main[p]] = { id: main[p], x: p * dx, y: 0 };
      }
      nodes[1] = { id: 1, x: 2 * dx, y: -dx };
      return { nodes: nodes };
    }
    throw new Error('[Lie] unknown layout type: ' + type);
  }

  // ─────────────────────────────────────────── structural constants ──
  // A lightweight lookup table, independent of root-system construction.

  var CONSTANTS = {
    A: function (n) { return { dim: n * (n + 2),   rank: n, coxeter: n + 1, weyl: factorial(n + 1) }; },
    B: function (n) { return { dim: n * (2*n + 1), rank: n, coxeter: 2 * n, weyl: (1 << n) * factorial(n) }; },
    C: function (n) { return { dim: n * (2*n + 1), rank: n, coxeter: 2 * n, weyl: (1 << n) * factorial(n) }; },
    D: function (n) { return { dim: n * (2*n - 1), rank: n, coxeter: 2*n - 2, weyl: (1 << (n - 1)) * factorial(n) }; },
    E6: { dim: 78,  rank: 6, coxeter: 12, weyl: 51840 },
    E7: { dim: 133, rank: 7, coxeter: 18, weyl: 2903040 },
    E8: { dim: 248, rank: 8, coxeter: 30, weyl: 696729600 },
    F4: { dim: 52,  rank: 4, coxeter: 12, weyl: 1152 },
    G2: { dim: 14,  rank: 2, coxeter: 6,  weyl: 12 }
  };

  // ─────────────────────────────────────────── sanity checks ──

  function runChecks() {
    var errors = [];
    var push = function (msg) { errors.push(msg); };
    var cases = [
      { build: function () { return typeA(1);  }, rc: 2,   pc: 1   },
      { build: function () { return typeA(2);  }, rc: 6,   pc: 3   },
      { build: function () { return typeA(3);  }, rc: 12,  pc: 6   },
      { build: function () { return typeA(5);  }, rc: 30,  pc: 15  },
      { build: function () { return typeB(2);  }, rc: 8,   pc: 4   },
      { build: function () { return typeB(3);  }, rc: 18,  pc: 9   },
      { build: function () { return typeB(4);  }, rc: 32,  pc: 16  },
      { build: function () { return typeC(2);  }, rc: 8,   pc: 4   },
      { build: function () { return typeC(3);  }, rc: 18,  pc: 9   },
      { build: function () { return typeC(4);  }, rc: 32,  pc: 16  },
      { build: function () { return typeD(3);  }, rc: 12,  pc: 6   },
      { build: function () { return typeD(4);  }, rc: 24,  pc: 12  },
      { build: function () { return typeD(5);  }, rc: 40,  pc: 20  },
      { build: function () { return typeE(6);  }, rc: 72,  pc: 36  },
      { build: function () { return typeE(7);  }, rc: 126, pc: 63  },
      { build: function () { return typeE(8);  }, rc: 240, pc: 120 },
      { build: function () { return typeF4();  }, rc: 48,  pc: 24  },
      { build: function () { return typeG2();  }, rc: 12,  pc: 6   }
    ];
    var allowed = { '0':1, '-1':1, '-2':1, '-3':1 };

    for (var t = 0; t < cases.length; t++) {
      var a;
      try { a = cases[t].build(); } catch (e) { push('build ' + t + ' failed: ' + e.message); continue; }

      if (a.roots.length !== cases[t].rc) {
        push(a.name + ' root count ' + a.roots.length + ' ≠ ' + cases[t].rc);
      }
      if (a.posRoots.length !== cases[t].pc) {
        push(a.name + ' positive root count ' + a.posRoots.length + ' ≠ ' + cases[t].pc);
      }
      if (a.rank + a.roots.length !== a.dim) {
        push(a.name + ' rank+|Δ| = ' + (a.rank + a.roots.length) + ' ≠ dim ' + a.dim);
      }
      // Cartan matrix integrality and allowed-entry constraints
      for (var i = 0; i < a.rank; i++) {
        if (a.cartan[i][i] !== 2) push(a.name + ' cartan[' + i + '][' + i + '] ≠ 2');
        for (var j = 0; j < a.rank; j++) {
          if (i === j) continue;
          if (!allowed[String(a.cartan[i][j])]) {
            push(a.name + ' cartan[' + i + '][' + j + '] = ' + a.cartan[i][j]);
          }
        }
      }
      // Weyl orbit of α_1 = {roots of the same squared length as α_1}.
      var targetLen = squaredLength(a.simpleRoots[0]);
      var sameLen = 0;
      for (var rr = 0; rr < a.roots.length; rr++) {
        if (Math.abs(squaredLength(a.roots[rr]) - targetLen) < 1e-9) sameLen++;
      }
      var orb = a.orbit(a.simpleRoots[0], a.roots.length + 50);
      if (orb.length !== sameLen) {
        push(a.name + ' orbit(α_1) size ' + orb.length + ' ≠ same-length root count ' + sameLen);
      }
      // Every root expands into integer simple-coefficients of one sign.
      for (var r2 = 0; r2 < a.roots.length; r2++) {
        var c = a.toSimpleCoefficients(a.roots[r2]);
        var hasPos = false, hasNeg = false, ok = true;
        for (var kk = 0; kk < c.length; kk++) {
          if (Math.abs(c[kk] - Math.round(c[kk])) > 1e-6) { ok = false; break; }
          var rc = Math.round(c[kk]);
          if (rc > 0) hasPos = true;
          if (rc < 0) hasNeg = true;
        }
        if (!ok) { push(a.name + ' root ' + r2 + ' has non-integer simple coefficients'); break; }
        if (hasPos && hasNeg) { push(a.name + ' root ' + r2 + ' has mixed-sign simple coefficients'); break; }
      }
    }

    if (errors.length === 0) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('[Lie] all sanity checks passed (' + cases.length + ' root systems verified)');
      }
    } else if (typeof console !== 'undefined' && console.error) {
      console.error('[Lie] sanity checks FAILED:', errors);
    }
    return errors;
  }

  // ─────────────────────────────────────────── public API ──

  var Lie = {
    build: function (type, rank) {
      switch (type) {
        case 'A': return typeA(rank);
        case 'B': return typeB(rank);
        case 'C': return typeC(rank);
        case 'D': return typeD(rank);
        case 'E': return typeE(rank);
        case 'F': return typeF4();
        case 'G': return typeG2();
        default: throw new Error('[Lie] unknown type: ' + type);
      }
    },
    A: typeA,
    B: typeB,
    C: typeC,
    D: typeD,
    E6: function () { return typeE(6); },
    E7: function () { return typeE(7); },
    E8: function () { return typeE(8); },
    F4: typeF4,
    G2: typeG2,

    dot: dot,
    squaredLength: squaredLength,
    reflect: reflect,
    orbit: orbit,
    invertMatrix: invertMatrix,
    simpleCoefficientSolver: simpleCoefficientSolver,

    constants: CONSTANTS,
    _runChecks: runChecks
  };

  global.Lie = Lie;
  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
