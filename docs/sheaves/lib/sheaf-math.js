// sheaf-math.js: cellular sheaves on graphs, as dense linear algebra.
//
// A sheaf on a graph puts a vector space (a stalk) on every vertex and every
// edge, and a linear restriction map from each vertex stalk to the stalk of
// each edge it touches. Everything the series computes comes from two
// matrices built from that data:
//
//   delta  the coboundary C^0 -> C^1. For an edge e = (u, v),
//          (delta x)_e = F_{v,e} x_v - F_{u,e} x_u
//   L      the sheaf Laplacian delta^T delta, so x^T L x is the total squared
//          disagreement over all edges.
//
// Global sections H^0 = ker delta = ker L.
//
// API (window.Sheaf, or module.exports in node):
//   Sheaf.create({ dims, edges })     dims[v] = stalk dimension at v; each edge is
//                                     { u, v, Fu, Fv } with Fu (de x dims[u]) and
//                                     Fv (de x dims[v]) as arrays of rows
//   Sheaf.coboundary(S)               dense matrix, rows = sum of edge dims
//   Sheaf.laplacian(S)                dense symmetric matrix
//   Sheaf.energy(S, x)                sum over edges of |(delta x)_e|^2
//   Sheaf.edgeDisagreement(S, x)      array of |(delta x)_e|, one per edge
//   Sheaf.symEig(A)                   { values (ascending), vectors (columns as arrays) }
//   Sheaf.heat(eig, x0, t)            exp(-t L) x0 from an eigendecomposition of L
//   Sheaf.kernelDim(eig, tol)         number of eigenvalues below tol
//   Sheaf.projectKernel(eig, x, tol)  orthogonal projection of x onto ker L
//   Sheaf.harmonicExtend(L, fixed, xFixed)  minimise x^T L x with x fixed on the
//                                     index set `fixed`; returns the full vector
//   Sheaf.rot(theta)                  2x2 rotation matrix
//   Sheaf.signedGraph(n, edges)       scalar sheaf of a signed graph; edges [u, v, sign]
//   Sheaf.rotationSheaf(n, edges)     R^2 stalks; edges [u, v, theta], section rule
//                                     x_v = rot(theta) x_u
//   Sheaf.cycleSpectrum(n, theta)     closed-form spectrum of the rotation sheaf on an
//                                     n-cycle with holonomy theta, ascending
//   Sheaf.mulberry32(seed)            seeded PRNG
(function (global) {
  'use strict';

  var TOL = 1e-9;

  function zeros(r, c) {
    var M = new Array(r);
    for (var i = 0; i < r; i++) { M[i] = new Float64Array(c); }
    return M;
  }

  function create(spec) {
    var dims = spec.dims.slice();
    var offV = [0];
    for (var i = 0; i < dims.length; i++) offV.push(offV[i] + dims[i]);
    var offE = [0];
    var edges = spec.edges.map(function (e, k) {
      var de = e.Fu.length;
      if (e.Fv.length !== de) throw new Error('edge ' + k + ': Fu and Fv disagree on the edge stalk');
      offE.push(offE[k] + de);
      return { u: e.u, v: e.v, Fu: e.Fu, Fv: e.Fv, de: de };
    });
    return { dims: dims, edges: edges, offV: offV, offE: offE,
      n0: offV[offV.length - 1], n1: offE[offE.length - 1] };
  }

  function coboundary(S) {
    var D = zeros(S.n1, S.n0);
    S.edges.forEach(function (e, k) {
      var r0 = S.offE[k];
      for (var a = 0; a < e.de; a++) {
        for (var b = 0; b < S.dims[e.v]; b++) D[r0 + a][S.offV[e.v] + b] += e.Fv[a][b];
        for (var c = 0; c < S.dims[e.u]; c++) D[r0 + a][S.offV[e.u] + c] -= e.Fu[a][c];
      }
    });
    return D;
  }

  function laplacian(S) {
    var D = coboundary(S), n = S.n0, L = zeros(n, n);
    for (var r = 0; r < D.length; r++) {
      var row = D[r];
      for (var i = 0; i < n; i++) {
        if (row[i] === 0) continue;
        for (var j = 0; j < n; j++) L[i][j] += row[i] * row[j];
      }
    }
    return L;
  }

  function edgeVec(S, x, k) {
    var e = S.edges[k], out = new Float64Array(e.de);
    for (var a = 0; a < e.de; a++) {
      var s = 0;
      for (var b = 0; b < S.dims[e.v]; b++) s += e.Fv[a][b] * x[S.offV[e.v] + b];
      for (var c = 0; c < S.dims[e.u]; c++) s -= e.Fu[a][c] * x[S.offV[e.u] + c];
      out[a] = s;
    }
    return out;
  }

  function edgeDisagreement(S, x) {
    return S.edges.map(function (_, k) {
      var d = edgeVec(S, x, k), s = 0;
      for (var a = 0; a < d.length; a++) s += d[a] * d[a];
      return Math.sqrt(s);
    });
  }

  function energy(S, x) {
    return edgeDisagreement(S, x).reduce(function (s, d) { return s + d * d; }, 0);
  }

  // Cyclic Jacobi for a real symmetric matrix. Small matrices only (the
  // series never goes past a few hundred rows), and accurate to ~1e-12.
  function symEig(A0) {
    var n = A0.length, A = zeros(n, n), V = zeros(n, n), i, j, k;
    for (i = 0; i < n; i++) { for (j = 0; j < n; j++) A[i][j] = A0[i][j]; V[i][i] = 1; }
    for (var sweep = 0; sweep < 100; sweep++) {
      var off = 0;
      for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
      if (off < 1e-24) break;
      for (var p = 0; p < n; p++) {
        for (var q = p + 1; q < n; q++) {
          var apq = A[p][q];
          if (Math.abs(apq) < 1e-300) continue;
          var tau = (A[q][q] - A[p][p]) / (2 * apq);
          var t = (tau >= 0 ? 1 : -1) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
          var c = 1 / Math.sqrt(1 + t * t), s = t * c;
          for (k = 0; k < n; k++) {
            var akp = A[k][p], akq = A[k][q];
            A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq;
          }
          for (k = 0; k < n; k++) {
            var apk = A[p][k], aqk = A[q][k];
            A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk;
          }
          for (k = 0; k < n; k++) {
            var vkp = V[k][p], vkq = V[k][q];
            V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq;
          }
        }
      }
    }
    var idx = [];
    for (i = 0; i < n; i++) idx.push(i);
    idx.sort(function (a, b) { return A[a][a] - A[b][b]; });
    return {
      values: idx.map(function (i) { return A[i][i]; }),
      vectors: idx.map(function (i) {
        var v = new Float64Array(n);
        for (var k = 0; k < n; k++) v[k] = V[k][i];
        return v;
      })
    };
  }

  function dot(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }

  function heat(eig, x0, t) {
    var n = x0.length, out = new Float64Array(n);
    for (var k = 0; k < eig.values.length; k++) {
      var phi = eig.vectors[k], c = dot(phi, x0) * Math.exp(-t * Math.max(0, eig.values[k]));
      if (c === 0) continue;
      for (var i = 0; i < n; i++) out[i] += c * phi[i];
    }
    return out;
  }

  function kernelDim(eig, tol) {
    tol = tol == null ? TOL : tol;
    return eig.values.filter(function (l) { return l < tol; }).length;
  }

  function projectKernel(eig, x, tol) {
    tol = tol == null ? TOL : tol;
    var out = new Float64Array(x.length);
    eig.values.forEach(function (l, k) {
      if (l >= tol) return;
      var phi = eig.vectors[k], c = dot(phi, x);
      for (var i = 0; i < x.length; i++) out[i] += c * phi[i];
    });
    return out;
  }

  // Solve A y = b for a small dense system by Gaussian elimination with
  // partial pivoting. Returns null when A is singular to working precision.
  function solve(A0, b0) {
    var n = b0.length, A = A0.map(function (r) { return Float64Array.from(r); }), b = Float64Array.from(b0);
    for (var c = 0; c < n; c++) {
      var p = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      if (Math.abs(A[p][c]) < 1e-12) return null;
      var tmp = A[c]; A[c] = A[p]; A[p] = tmp;
      var tb = b[c]; b[c] = b[p]; b[p] = tb;
      for (r = c + 1; r < n; r++) {
        var f = A[r][c] / A[c][c];
        if (f === 0) continue;
        for (var k = c; k < n; k++) A[r][k] -= f * A[c][k];
        b[r] -= f * b[c];
      }
    }
    var y = new Float64Array(n);
    for (var i = n - 1; i >= 0; i--) {
      var s = b[i];
      for (var j = i + 1; j < n; j++) s -= A[i][j] * y[j];
      y[i] = s / A[i][i];
    }
    return y;
  }

  // Harmonic extension: fix x on `fixed`, choose the rest to minimise x^T L x.
  // The minimiser solves L_II x_I = -L_IB x_B. When L_II is singular (a free
  // part carries its own global sections), take the minimum-norm solution.
  function harmonicExtend(L, fixed, xFixed) {
    var n = L.length, isFixed = new Uint8Array(n);
    fixed.forEach(function (i) { isFixed[i] = 1; });
    var free = [];
    for (var i = 0; i < n; i++) if (!isFixed[i]) free.push(i);
    var LII = free.map(function (i) { return free.map(function (j) { return L[i][j]; }); });
    var rhs = free.map(function (i) {
      var s = 0;
      fixed.forEach(function (j, k) { s -= L[i][j] * xFixed[k]; });
      return s;
    });
    var y = solve(LII, rhs);
    if (!y) {
      var e = symEig(LII);
      y = new Float64Array(free.length);
      e.values.forEach(function (l, k) {
        if (l < 1e-9) return;
        var phi = e.vectors[k], c = dot(phi, rhs) / l;
        for (var i = 0; i < y.length; i++) y[i] += c * phi[i];
      });
    }
    var x = new Float64Array(n);
    fixed.forEach(function (i, k) { x[i] = xFixed[k]; });
    free.forEach(function (i, k) { x[i] = y[k]; });
    return x;
  }

  function rot(theta) {
    var c = Math.cos(theta), s = Math.sin(theta);
    return [[c, -s], [s, c]];
  }

  // Scalar stalks everywhere. A positive edge asks x_u = x_v, a negative
  // edge asks x_u = -x_v.
  function signedGraph(n, edges) {
    var dims = [];
    for (var i = 0; i < n; i++) dims.push(1);
    return create({ dims: dims, edges: edges.map(function (e) {
      return { u: e[0], v: e[1], Fu: [[e[2]]], Fv: [[1]] };
    }) });
  }

  // R^2 stalks everywhere. Edge [u, v, theta] asks x_v = rot(theta) x_u,
  // written as (delta x)_e = x_v - rot(theta) x_u.
  function rotationSheaf(n, edges) {
    var dims = [];
    for (var i = 0; i < n; i++) dims.push(2);
    return create({ dims: dims, edges: edges.map(function (e) {
      return { u: e[0], v: e[1], Fu: rot(e[2]), Fv: [[1, 0], [0, 1]] };
    }) });
  }

  // Rotation sheaf on the n-cycle with total holonomy theta. Complexify: R^2
  // with rot(theta) is C with e^{i theta} plus its conjugate, so the spectrum
  // is the magnetic cycle's, 2 - 2 cos((2 pi k +/- theta) / n), each once.
  function cycleSpectrum(n, theta) {
    var out = [];
    for (var k = 0; k < n; k++) {
      out.push(2 - 2 * Math.cos((2 * Math.PI * k + theta) / n));
      out.push(2 - 2 * Math.cos((2 * Math.PI * k - theta) / n));
    }
    return out.sort(function (a, b) { return a - b; });
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Sanity checks against closed forms. Returns [{ name, ok, detail }].
  function runChecks() {
    var out = [];
    function check(name, ok, detail) { out.push({ name: name, ok: !!ok, detail: detail || '' }); }
    var close = function (a, b, t) { return Math.abs(a - b) < (t || 1e-8); };

    // Constant sheaf R on a path of 4: L is the graph Laplacian.
    var P = signedGraph(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1]]);
    var LP = laplacian(P);
    check('constant sheaf on a path gives the graph Laplacian',
      LP[0][0] === 1 && LP[1][1] === 2 && LP[0][1] === -1 && LP[0][2] === 0);
    var eP = symEig(LP);
    var pathSpec = [0, 1, 2, 3].map(function (k) { return 2 - 2 * Math.cos(Math.PI * k / 4); });
    check('path spectrum is 2 - 2cos(pi k / n)', eP.values.every(function (l, k) { return close(l, pathSpec[k]); }),
      eP.values.map(function (v) { return v.toFixed(4); }).join(' '));

    // Signed triangle: one negative edge is unbalanced, two are balanced.
    var un = signedGraph(3, [[0, 1, 1], [1, 2, 1], [2, 0, -1]]);
    var ba = signedGraph(3, [[0, 1, -1], [1, 2, -1], [2, 0, 1]]);
    check('signed triangle with one negative edge has H^0 = 0', kernelDim(symEig(laplacian(un))) === 0);
    check('signed triangle with two negative edges has H^0 = R', kernelDim(symEig(laplacian(ba))) === 1);

    // Rotation sheaf on cycles: spectrum matches the closed form.
    [[5, 0], [5, 1.1], [6, Math.PI], [7, 2.5]].forEach(function (c) {
      var n = c[0], th = c[1], edges = [];
      for (var i = 0; i < n; i++) edges.push([i, (i + 1) % n, i === 0 ? th : 0]);
      var e = symEig(laplacian(rotationSheaf(n, edges)));
      var cf = cycleSpectrum(n, th);
      check('rotation cycle n=' + n + ' theta=' + th + ' matches closed form',
        e.values.every(function (l, k) { return close(l, cf[k], 1e-7); }));
    });
    var e0 = symEig(laplacian(rotationSheaf(6, [[0, 1, 0.4], [1, 2, 0.3], [2, 3, -0.2], [3, 4, 0.5], [4, 5, 0.1], [5, 0, -1.1]])));
    check('holonomy 0 spread over edges gives dim H^0 = 2', kernelDim(e0) === 2);

    // Heat flow converges to the projection onto ker L and never raises energy.
    var S = rotationSheaf(6, [[0, 1, 0.4], [1, 2, 0.3], [2, 3, -0.2], [3, 4, 0.5], [4, 5, 0.1], [5, 0, -1.1]]);
    var L = laplacian(S), eg = symEig(L), rnd = mulberry32(7), x0 = new Float64Array(12);
    for (var i = 0; i < 12; i++) x0[i] = rnd() * 2 - 1;
    var xinf = heat(eg, x0, 400), pr = projectKernel(eg, x0);
    check('heat flow limit equals projection onto H^0', xinf.every(function (v, i) { return close(v, pr[i], 1e-9); }));
    check('limit is a global section', energy(S, xinf) < 1e-15);
    var mono = true, prev = Infinity;
    for (var t = 0; t <= 5; t += 0.25) { var en = energy(S, heat(eg, x0, t)); if (en > prev + 1e-12) mono = false; prev = en; }
    check('energy is non-increasing along heat flow', mono);
    var Lx = L.map(function (r) { return dot(r, x0); });
    check('x^T L x equals summed edge disagreement', close(dot(x0, Lx), energy(S, x0), 1e-10));

    // Harmonic extension on the path: linear interpolation.
    var h = harmonicExtend(laplacian(signedGraph(5, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1]])), [0, 4], [0, 4]);
    check('harmonic extension on a path interpolates linearly', [0, 1, 2, 3, 4].every(function (v, i) { return close(h[i], v); }));

    return out;
  }

  var api = {
    create: create, coboundary: coboundary, laplacian: laplacian, energy: energy,
    edgeDisagreement: edgeDisagreement, symEig: symEig, heat: heat, kernelDim: kernelDim,
    projectKernel: projectKernel, harmonicExtend: harmonicExtend, solve: solve, rot: rot,
    signedGraph: signedGraph, rotationSheaf: rotationSheaf, cycleSpectrum: cycleSpectrum,
    mulberry32: mulberry32, dot: dot, runChecks: runChecks
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else global.Sheaf = api;
})(this);
