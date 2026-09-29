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
//   Sheaf.nullspace(A, cols, tol)     { rank, basis } for a dense matrix with `cols`
//                                     columns; basis vectors are orthonormal
//   Sheaf.cohomology(S)               { c0, c1, rank, h0, h1, sections } where sections
//                                     is an orthonormal basis of H^0
//   Sheaf.explain(S, b)               least-squares x minimising |delta x - b|; returns
//                                     { x, fit, residual }, residual in ker delta^T
//   Sheaf.subSheaf(S, edgeIdx)        the same stalks with only the listed edges
//   Sheaf.openStar(S, verts)          open set (Alexandrov topology) of the listed
//                                     vertices plus every edge touching them
//   Sheaf.sectionsOver(S, U)          { cells, n, basis }: sections over an open set U,
//                                     in coordinates listing each cell's stalk in turn
//   Sheaf.cech(S, cover)              Cech complex of a cover by open sets, through C^2;
//                                     { pieces, pairs, triples, d0, d1, c0, c1, c2, h0, h1 }
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

  function matVec(A, x) { return A.map(function (r) { return dot(r, x); }); }

  // Rank and an orthonormal basis of the null space of A (rows x cols), from
  // the eigendecomposition of the Gram matrix A^T A. Singular values below
  // sqrt(tol * max eigenvalue) count as zero.
  function nullspace(A, cols, tol) {
    tol = tol == null ? 1e-10 : tol;
    if (cols === 0) return { rank: 0, basis: [] };
    var G = zeros(cols, cols);
    A.forEach(function (row) {
      for (var i = 0; i < cols; i++) {
        if (row[i] === 0) continue;
        for (var j = 0; j < cols; j++) G[i][j] += row[i] * row[j];
      }
    });
    var e = symEig(G), top = Math.max(1, e.values[cols - 1]), basis = [];
    e.values.forEach(function (l, k) { if (l < tol * top) basis.push(e.vectors[k]); });
    return { rank: cols - basis.length, basis: basis };
  }

  function cohomology(S) {
    var ns = nullspace(coboundary(S), S.n0);
    return { c0: S.n0, c1: S.n1, rank: ns.rank, h0: S.n0 - ns.rank, h1: S.n1 - ns.rank, sections: ns.basis };
  }

  // Least squares: the vertex assignment whose disagreement comes closest to
  // prescribed edge values b. The residual b - delta x is orthogonal to the
  // image of delta, so it is the harmonic representative of b's class in H^1.
  function explain(S, b) {
    var D = coboundary(S), L = laplacian(S), eig = symEig(L);
    var y = new Float64Array(S.n0);
    D.forEach(function (row, r) { for (var i = 0; i < S.n0; i++) y[i] += row[i] * b[r]; });
    var x = new Float64Array(S.n0), top = Math.max(1, eig.values[S.n0 - 1] || 0);
    eig.values.forEach(function (l, k) {
      if (l < 1e-10 * top) return;
      var phi = eig.vectors[k], c = dot(phi, y) / l;
      for (var i = 0; i < S.n0; i++) x[i] += c * phi[i];
    });
    var fit = Float64Array.from(matVec(D, x));
    var residual = Float64Array.from(b, function (v, r) { return v - fit[r]; });
    return { x: x, fit: fit, residual: residual };
  }

  function subSheaf(S, edgeIdx) {
    return create({ dims: S.dims, edges: edgeIdx.map(function (k) { return S.edges[k]; }) });
  }

  // Open sets in the Alexandrov topology on the cell poset: a vertex is open
  // only together with every edge that touches it, while an edge alone is open.
  function openSet(S, verts, edges) {
    var vs = {}, es = {};
    verts.forEach(function (v) { vs[v] = 1; });
    (edges || []).forEach(function (k) { es[k] = 1; });
    S.edges.forEach(function (e, k) { if (vs[e.u] || vs[e.v]) es[k] = 1; });
    var num = function (o) { return Object.keys(o).map(Number).sort(function (a, b) { return a - b; }); };
    return { verts: num(vs), edges: num(es) };
  }
  function openStar(S, verts) { return openSet(S, verts, []); }

  function intersect(U, V) {
    var inV = function (list) { var o = {}; list.forEach(function (i) { o[i] = 1; }); return o; };
    var vv = inV(V.verts), ve = inV(V.edges);
    return { verts: U.verts.filter(function (i) { return vv[i]; }), edges: U.edges.filter(function (k) { return ve[k]; }) };
  }

  // Sections over an open set U: a vector on every cell of U such that each
  // edge's value is the restriction of each of its endpoints that lie in U.
  function sectionsOver(S, U) {
    var cells = [], n = 0, at = {};
    U.verts.forEach(function (v) { cells.push({ kind: 'v', i: v, dim: S.dims[v], off: n }); at['v' + v] = n; n += S.dims[v]; });
    U.edges.forEach(function (k) { cells.push({ kind: 'e', i: k, dim: S.edges[k].de, off: n }); at['e' + k] = n; n += S.edges[k].de; });
    var rows = [];
    U.edges.forEach(function (k) {
      var e = S.edges[k];
      [[e.u, e.Fu], [e.v, e.Fv]].forEach(function (end) {
        if (at['v' + end[0]] == null) return;
        for (var a = 0; a < e.de; a++) {
          var row = new Float64Array(n);
          row[at['e' + k] + a] = 1;
          for (var b = 0; b < S.dims[end[0]]; b++) row[at['v' + end[0]] + b] -= end[1][a][b];
          rows.push(row);
        }
      });
    });
    return { cells: cells, n: n, at: at, basis: nullspace(rows, n).basis };
  }

  // The restriction F(U) -> F(W) for W inside U, in the two orthonormal bases.
  function restriction(secU, secW) {
    return secW.basis.map(function (bw) {
      return secU.basis.map(function (bu) {
        var s = 0;
        secW.cells.forEach(function (c) {
          var from = secU.at[c.kind + c.i];
          for (var a = 0; a < c.dim; a++) s += bw[c.off + a] * bu[from + a];
        });
        return s;
      });
    });
  }

  // Cech complex C^0 -> C^1 -> C^2 of a cover, with the sign convention
  // (d0 c)_ij = c_j - c_i and (d1 c)_ijk = c_jk - c_ik + c_ij (all restricted).
  function cech(S, cover) {
    var pieces = cover.map(function (U, i) { return { idx: [i], set: U, sec: sectionsOver(S, U) }; });
    var empty = function (U) { return U.verts.length + U.edges.length === 0; };
    var pairs = [], triples = [], i, j, k;
    for (i = 0; i < cover.length; i++) for (j = i + 1; j < cover.length; j++) {
      var Uij = intersect(cover[i], cover[j]);
      if (!empty(Uij)) pairs.push({ idx: [i, j], set: Uij, sec: sectionsOver(S, Uij) });
    }
    for (i = 0; i < cover.length; i++) for (j = i + 1; j < cover.length; j++) for (k = j + 1; k < cover.length; k++) {
      var Uijk = intersect(intersect(cover[i], cover[j]), cover[k]);
      if (!empty(Uijk)) triples.push({ idx: [i, j, k], set: Uijk, sec: sectionsOver(S, Uijk) });
    }
    function offsets(list) { var o = [0]; list.forEach(function (p) { o.push(o[o.length - 1] + p.sec.basis.length); }); return o; }
    var o0 = offsets(pieces), o1 = offsets(pairs), o2 = offsets(triples);
    var c0 = o0[o0.length - 1], c1 = o1[o1.length - 1], c2 = o2[o2.length - 1];
    function block(M, r0, c0_, R, sign) {
      R.forEach(function (row, a) { row.forEach(function (v, b) { M[r0 + a][c0_ + b] += sign * v; }); });
    }
    var d0 = zeros(c1, c0);
    pairs.forEach(function (p, r) {
      block(d0, o1[r], o0[p.idx[1]], restriction(pieces[p.idx[1]].sec, p.sec), 1);
      block(d0, o1[r], o0[p.idx[0]], restriction(pieces[p.idx[0]].sec, p.sec), -1);
    });
    var pairAt = {};
    pairs.forEach(function (p, r) { pairAt[p.idx.join(',')] = r; });
    var d1 = zeros(c2, c1);
    triples.forEach(function (t, r) {
      var a = t.idx[0], b = t.idx[1], c = t.idx[2];
      [[[b, c], 1], [[a, c], -1], [[a, b], 1]].forEach(function (f) {
        var q = pairAt[f[0].join(',')];
        block(d1, o2[r], o1[q], restriction(pairs[q].sec, t.sec), f[1]);
      });
    });
    var r0 = nullspace(d0, c0).rank, r1 = nullspace(d1, c1).rank;
    return { pieces: pieces, pairs: pairs, triples: triples, o0: o0, o1: o1, o2: o2,
      d0: d0, d1: d1, c0: c0, c1: c1, c2: c2, rank0: r0, rank1: r1,
      h0: c0 - r0, h1: c1 - r1 - r0 };
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
    function transposeMul(D, r) {
      var o = new Float64Array(D[0].length);
      D.forEach(function (row, q) { for (var c = 0; c < row.length; c++) o[c] += row[c] * r[q]; });
      return o;
    }
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

    // Cohomology of graphs: cycles carry H^1, twists kill both groups on a cycle.
    function cyc(n, twist) {
      var ed = [];
      for (var i = 0; i < n; i++) ed.push([i, (i + 1) % n, i === 2 && twist ? -1 : 1]);
      return signedGraph(n, ed);
    }
    var hc = cohomology(cyc(6, false)), ht = cohomology(cyc(6, true));
    check('constant sheaf on the hexagon: H^0 = 1, H^1 = 1', hc.h0 === 1 && hc.h1 === 1);
    check('twisted hexagon: H^0 = 0, H^1 = 0', ht.h0 === 0 && ht.h1 === 0);
    var theta = signedGraph(6, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 1], [0, 3, 1]]);
    check('constant sheaf on the theta graph has H^1 = 2', cohomology(theta).h1 === 2);
    var tree = signedGraph(6, [[0, 1, 1], [1, 2, -1], [1, 3, 1], [3, 4, 1], [3, 5, -1]]);
    var htr = cohomology(tree);
    check('signed tree: H^0 = 1, H^1 = 0', htr.h0 === 1 && htr.h1 === 0);
    var bare = create({ dims: [0, 0], edges: [{ u: 0, v: 1, Fu: [[]], Fv: [[]] }] });
    check('tree with zero vertex stalks and an R edge has H^1 = 1', cohomology(bare).h1 === 1);
    var arcs = [0, 1, 2, 3, 4, 5].every(function (cut) {
      var keep = [0, 1, 2, 3, 4, 5].filter(function (k) { return k !== cut; });
      return cohomology(subSheaf(cyc(6, true), keep)).h0 === 1;
    });
    check('twisted hexagon minus any one edge has H^0 = 1', arcs);

    // Euler characteristic: h0 - h1 = dim C^0 - dim C^1 for any maps.
    var rr = mulberry32(5), euler = true;
    for (var trial = 0; trial < 20; trial++) {
      var nv = 3 + Math.floor(rr() * 3), dims = [], ed = [];
      for (i = 0; i < nv; i++) dims.push(Math.floor(rr() * 3));
      for (i = 0; i < nv; i++) for (var j2 = i + 1; j2 < nv; j2++) {
        if (rr() < 0.4) continue;
        var de = Math.floor(rr() * 3), rm = function (r_, c_) {
          var M = [];
          for (var a = 0; a < r_; a++) { M.push([]); for (var b = 0; b < c_; b++) M[a].push(rr() < 0.3 ? 0 : Math.round(rr() * 4 - 2)); }
          return M;
        };
        ed.push({ u: i, v: j2, Fu: rm(de, dims[i]), Fv: rm(de, dims[j2]) });
      }
      var Sr = create({ dims: dims, edges: ed }), hr = cohomology(Sr);
      if (hr.h0 - hr.h1 !== Sr.n0 - Sr.n1) euler = false;
    }
    check('h0 - h1 = dim C^0 - dim C^1 on 20 random sheaves', euler);

    // Least squares: the residual is orthogonal to im delta, and vanishes on a tree.
    var Sh = cyc(6, false), bb = new Float64Array(6);
    for (i = 0; i < 6; i++) bb[i] = rr() * 2 - 1;
    var ex = explain(Sh, bb), Dh = coboundary(Sh);
    var DtR = transposeMul(Dh, ex.residual);
    check('least-squares residual is orthogonal to im delta', DtR.every(function (v) { return Math.abs(v) < 1e-10; }));
    var circ = bb.reduce(function (s, v) { return s + v; }, 0) / 6;
    check('on the constant hexagon the residual is the mean circulation on every edge',
      ex.residual.every(function (v) { return close(v, circ, 1e-10); }));
    var bt = new Float64Array(5);
    for (i = 0; i < 5; i++) bt[i] = rr() * 2 - 1;
    check('on a signed tree every edge assignment is explained', explain(tree, bt).residual.every(function (v) { return Math.abs(v) < 1e-10; }));

    // Cech complexes of covers of the hexagon agree with the cellular complex,
    // except the one-piece cover whose piece has its own H^1.
    var covers = {
      three: [[0, 1, 2], [2, 3, 4], [4, 5, 0]],
      two: [[0, 1, 2, 3], [3, 4, 5, 0]],
      four: [[0, 1], [1, 2, 3], [3, 4], [4, 5, 0]],
      wide: [[0, 1, 2, 3], [2, 3, 4, 5], [4, 5, 0, 1]],
      one: [[0, 1, 2, 3, 4, 5]]
    };
    [false, true].forEach(function (tw) {
      var Sc = cyc(6, tw), cell = cohomology(Sc);
      Object.keys(covers).forEach(function (name) {
        var C = cech(Sc, covers[name].map(function (vs) { return openStar(Sc, vs); }));
        var agree = C.h0 === cell.h0 && C.h1 === cell.h1;
        var expect = !(name === 'one' && !tw);
        check('Cech ' + name + (tw ? ' (twisted)' : ' (constant)') + (expect ? ' agrees with cellular' : ' misses H^1'),
          agree === expect, 'Cech ' + C.h0 + ',' + C.h1 + ' cellular ' + cell.h0 + ',' + cell.h1);
      });
    });
    var Cw = cech(cyc(6, false), covers.wide.map(function (vs) { return openStar(cyc(6, false), vs); }));
    var dd = Cw.d1.map(function (row) { return Cw.d0[0].map(function (_, c) { var s = 0; for (var q = 0; q < row.length; q++) s += row[q] * Cw.d0[q][c]; return s; }); });
    check('Cech d1 d0 = 0 on the wide cover (triple overlap nonempty)', Cw.c2 > 0 && dd.every(function (r) { return r.every(function (v) { return Math.abs(v) < 1e-10; }); }));


    return out;
  }

  var api = {
    create: create, coboundary: coboundary, laplacian: laplacian, energy: energy,
    edgeDisagreement: edgeDisagreement, symEig: symEig, heat: heat, kernelDim: kernelDim,
    projectKernel: projectKernel, harmonicExtend: harmonicExtend, solve: solve, rot: rot,
    signedGraph: signedGraph, rotationSheaf: rotationSheaf, cycleSpectrum: cycleSpectrum,
    mulberry32: mulberry32, dot: dot, matVec: matVec, nullspace: nullspace, cohomology: cohomology,
    explain: explain, subSheaf: subSheaf, openSet: openSet, openStar: openStar, intersect: intersect,
    sectionsOver: sectionsOver, cech: cech, runChecks: runChecks
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else global.Sheaf = api;
})(this);
