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
//   Sheaf.consistency(S, x, y, skip)  critical thresholds and consistency radius of the
//                                     assignment x on vertices, y on edges (y omitted:
//                                     midpoints, the radius-minimising choice); vertices
//                                     in skip are withheld. { edge: [{u, v, max}], radius,
//                                     worst, y }
//   Sheaf.fuse(S, a)                  nearest global section in least squares, the
//                                     orthogonal projection onto H^0; { x, residual }
//   Sheaf.supDistance(S, x, y, s)     Robinson's sup distance from the assignment (x, y)
//                                     to the global section s
//   Sheaf.lipschitz(S)                largest operator norm among the restriction maps
//   Sheaf.positionSheaf(phi, dirs)    sensors locating a point in the plane: world frame,
//                                     a frame turned by phi, and one line of position per
//                                     direction angle in dirs
//   Sheaf.stubborn(S, x0, fixed)      opinion flow with the vertices in `fixed` held at
//                                     x0 (Hansen-Ghrist Thm 5.1); { at(t), limit, rate }
//   Sheaf.relativeH0(S, fixed)        dim H^0(G, U; F), sections vanishing on `fixed`
//   Sheaf.nearestSheaf(S, x)          Frobenius-nearest sheaf with x a global section,
//                                     the limit of the map flow (Thm 8.1)
//   Sheaf.jointFlow(S, x0, alpha, beta, T, steps, samples)  opinions and restriction
//                                     maps flowing together (eq. 9.1), RK4; snapshots
//                                     [{ t, x, S }]
//   Sheaf.normalizedLaplacian(S, aug) D^{-1/2} L D^{-1/2} with D the block diagonal of L
//                                     (plus I with aug), as in neural sheaf diffusion
//   Sheaf.thresholdAccuracy(v, labels) best accuracy of a threshold on scalars, labels 0/1
//   Sheaf.separable2(points, labels, k)  can a line cut class k from the rest in R^2
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

  // F x_w for one end of an edge, as a new array of length de.
  function applyMap(F, x, off, dim) {
    return F.map(function (row) { var s = 0; for (var b = 0; b < dim; b++) s += row[b] * x[off + b]; return s; });
  }
  function dist(p, q) { var s = 0; for (var a = 0; a < p.length; a++) s += (p[a] - q[a]) * (p[a] - q[a]); return Math.sqrt(s); }

  // Consistency (Robinson 2017, Def. 20; 2020, Def. 7). An assignment puts a
  // value on every cell: x in C^0 on the vertices, y in C^1 on the edges. The
  // critical threshold of an incidence w <| e is |y_e - F_{w,e} x_w|, and the
  // consistency radius is the largest one; it is zero exactly on sections.
  // With y omitted, each edge takes the value that minimises its larger
  // threshold, the midpoint (F_u x_u + F_v x_v) / 2, so both thresholds are
  // |(delta x)_e| / 2. Vertices in `skip` are withheld: their incidences are
  // not compared, and an edge value left free follows the other end.
  function consistency(S, x, y, skip) {
    var off = {};
    (skip || []).forEach(function (v) { off[v] = 1; });
    var edge = [], radius = 0, worst = -1, yUsed = new Float64Array(S.n1);
    S.edges.forEach(function (e, k) {
      var fu = applyMap(e.Fu, x, S.offV[e.u], S.dims[e.u]), fv = applyMap(e.Fv, x, S.offV[e.v], S.dims[e.v]);
      var ye = fu.map(function (_, a) {
        if (y) return y[S.offE[k] + a];
        return off[e.u] ? fv[a] : off[e.v] ? fu[a] : (fu[a] + fv[a]) / 2;
      });
      ye.forEach(function (v, a) { yUsed[S.offE[k] + a] = v; });
      var tu = off[e.u] ? 0 : dist(ye, fu), tv = off[e.v] ? 0 : dist(ye, fv), m = Math.max(tu, tv);
      edge.push({ u: tu, v: tv, max: m });
      if (m > radius) { radius = m; worst = k; }
    });
    return { edge: edge, radius: radius, worst: worst, y: yUsed };
  }

  // Nearest global section in least squares: the orthogonal projection of a
  // vertex assignment onto H^0 = ker delta. Unique, and linear in the data.
  function fuse(S, a) {
    var x = new Float64Array(S.n0);
    cohomology(S).sections.forEach(function (q) {
      var c = dot(q, a);
      for (var i = 0; i < S.n0; i++) x[i] += c * q[i];
    });
    return { x: x, residual: Float64Array.from(a, function (v, i) { return v - x[i]; }) };
  }

  // Robinson's assignment distance D(a, s) = sup over cells of |a(c) - s(c)|,
  // for an assignment (x, y) and a global section s given on the vertices.
  function supDistance(S, x, y, s) {
    var D = 0;
    S.dims.forEach(function (d, v) {
      D = Math.max(D, dist(Array.from(x).slice(S.offV[v], S.offV[v] + d), Array.from(s).slice(S.offV[v], S.offV[v] + d)));
    });
    S.edges.forEach(function (e, k) {
      var se = applyMap(e.Fu, s, S.offV[e.u], S.dims[e.u]);
      D = Math.max(D, dist(Array.from(y).slice(S.offE[k], S.offE[k] + e.de), se));
    });
    return D;
  }

  // Sensors locating one point p in the plane. Vertex 0 reports p in world
  // coordinates (R^2), vertex 1 reports rot(-phi) p in a frame turned by phi
  // (R^2), and vertex 1 + k reports the single number u_k . p for a unit
  // direction u_k = (cos t_k, sin t_k) (a line of position). Edges compare
  // what each pair can both see: 0-1 on R^2 (maps I and rot(phi)), and 0-k,
  // 1-k on R. Two line sensors share nothing and get no edge.
  function positionSheaf(phi, dirs) {
    var dims = [2, 2], R = rot(phi), edges = [{ u: 0, v: 1, Fu: [[1, 0], [0, 1]], Fv: R }];
    dirs.forEach(function (t, k) {
      var u = [Math.cos(t), Math.sin(t)], uR = [u[0] * R[0][0] + u[1] * R[1][0], u[0] * R[0][1] + u[1] * R[1][1]];
      dims.push(1);
      edges.push({ u: 0, v: 2 + k, Fu: [u], Fv: [[1]] });
      edges.push({ u: 1, v: 2 + k, Fu: [uR], Fv: [[1]] });
    });
    return create({ dims: dims, edges: edges });
  }

  // Largest Lipschitz constant (operator norm) among the restriction maps.
  function lipschitz(S) {
    var K = 0;
    S.edges.forEach(function (e) {
      [[e.Fu, S.dims[e.u]], [e.Fv, S.dims[e.v]]].forEach(function (m) {
        if (!m[1] || !e.de) return;
        var G = zeros(m[1], m[1]);
        m[0].forEach(function (row) { for (var i = 0; i < m[1]; i++) for (var j = 0; j < m[1]; j++) G[i][j] += row[i] * row[j]; });
        var ev = symEig(G).values;
        K = Math.max(K, Math.sqrt(Math.max(0, ev[ev.length - 1])));
      });
    });
    return K;
  }

  // Neural sheaf diffusion (Bodnar et al. 2022) normalises L by its block
  // diagonal D: Delta = D^{-1/2} L D^{-1/2}, or (D + I)^{-1/2} L (D + I)^{-1/2}
  // with augment. Blocks are inverted through their eigendecomposition, so
  // they must be positive definite (every vertex touches a nonzero map).
  function normalizedLaplacian(S, augment) {
    var L = laplacian(S), n = S.n0, R = zeros(n, n);
    S.dims.forEach(function (dv, v) {
      var o = S.offV[v], B = zeros(dv, dv);
      for (var i = 0; i < dv; i++) for (var j = 0; j < dv; j++) B[i][j] = L[o + i][o + j] + (augment && i === j ? 1 : 0);
      var e = symEig(B);
      for (i = 0; i < dv; i++) for (j = 0; j < dv; j++) {
        var s = 0;
        e.values.forEach(function (l, k) { s += e.vectors[k][i] * e.vectors[k][j] / Math.sqrt(l); });
        R[o + i][o + j] = s;
      }
    });
    var RL = zeros(n, n), out = zeros(n, n), i, j, k;
    for (i = 0; i < n; i++) for (k = 0; k < n; k++) { if (R[i][k] === 0) continue; for (j = 0; j < n; j++) RL[i][j] += R[i][k] * L[k][j]; }
    for (i = 0; i < n; i++) for (k = 0; k < n; k++) { if (RL[i][k] === 0) continue; for (j = 0; j < n; j++) out[i][j] += RL[i][k] * R[k][j]; }
    return out;
  }

  // Linear separation, as Bodnar et al. use it: an affine hyperplane with one
  // class strictly on one side. thresholdAccuracy(values, labels) is the best
  // accuracy of a threshold rule on scalars with two labels (0, 1), either
  // orientation. separable2(points, labels, k) says whether class k can be cut
  // from the rest of a set of points in the plane by a line: a strict
  // separating line exists iff one exists perpendicular to a direction just
  // off a normal of some segment joining two points, so those directions are
  // tried, plus a fine sweep.
  function thresholdAccuracy(values, labels) {
    var idx = values.map(function (_, i) { return i; }).sort(function (a, b) { return values[a] - values[b]; });
    var n = idx.length, ones = labels.filter(function (l) { return l === 1; }).length, best = 0, below1 = 0;
    for (var c = 0; c <= n; c++) {
      if (c > 0) below1 += labels[idx[c - 1]] === 1 ? 1 : 0;
      if (c > 0 && c < n && values[idx[c]] === values[idx[c - 1]]) continue;
      var zerosBelow = c - below1, onesAbove = ones - below1;
      best = Math.max(best, (zerosBelow + onesAbove) / n, (below1 + (n - c - onesAbove)) / n);
    }
    return best;
  }
  function separable2(points, labels, k) {
    var dirs = [], n = points.length, i, j;
    for (i = 0; i < 720; i++) dirs.push(Math.PI * i / 360);
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      var a = Math.atan2(points[j][1] - points[i][1], points[j][0] - points[i][0]) + Math.PI / 2;
      [-1e-7, 1e-7].forEach(function (eps) { dirs.push(a + eps, a + Math.PI + eps); });
    }
    return dirs.some(function (a) {
      var c = Math.cos(a), s = Math.sin(a), lo = Infinity, hi = -Infinity;
      for (var i = 0; i < n; i++) {
        var p = c * points[i][0] + s * points[i][1];
        if (labels[i] === k) lo = Math.min(lo, p); else hi = Math.max(hi, p);
      }
      return lo > hi + 1e-12 * (1 + Math.abs(hi));
    });
  }

  // Discourse sheaves (Hansen and Ghrist 2021). A vertex stalk holds a
  // person's private opinions, an edge stalk the topic a pair discusses, and
  // a restriction map how that person expresses their opinions to that
  // neighbour.

  // Stubborn agents (their Thm 5.1): x' = -L x on the free vertices while the
  // vertices in `fixed` keep their values from x0. On the free coordinates Y,
  // y' = -(L_YY y + L_YU u). The forcing L_YU u lies in im L_YY, so with
  // y_inf = P_ker y0 - L_YY^+ L_YU u the solution is
  // y(t) = y_inf + exp(-t L_YY)(y0 - y_inf), and y_inf is the harmonic
  // extension of u nearest x0. Returns { at(t), limit, rate } where rate is
  // the smallest nonzero eigenvalue of L_YY.
  function stubborn(S, x0, fixed) {
    var L = laplacian(S), isFixed = {}, Y = [], U = [];
    fixed.forEach(function (v) { isFixed[v] = 1; });
    S.dims.forEach(function (d, v) { for (var b = 0; b < d; b++) (isFixed[v] ? U : Y).push(S.offV[v] + b); });
    var eig = symEig(Y.map(function (i) { return Y.map(function (j) { return L[i][j]; }); }));
    var r = Y.map(function (i) { var s = 0; U.forEach(function (j) { s += L[i][j] * x0[j]; }); return s; });
    var y0 = Y.map(function (i) { return x0[i]; }), yinf = new Float64Array(Y.length), rate = Infinity;
    eig.values.forEach(function (l, k) {
      var phi = eig.vectors[k], c = l < TOL ? dot(phi, y0) : -dot(phi, r) / l;
      if (l >= TOL) rate = Math.min(rate, l);
      for (var i = 0; i < Y.length; i++) yinf[i] += c * phi[i];
    });
    var diff = y0.map(function (v, i) { return v - yinf[i]; });
    var coef = eig.vectors.map(function (phi) { return dot(phi, diff); });
    function at(t) {
      var out = Float64Array.from(x0);
      Y.forEach(function (i, a) { out[i] = yinf[a]; });
      if (t === Infinity) return out;
      eig.values.forEach(function (l, k) {
        if (l < TOL) return;
        var c = coef[k] * Math.exp(-t * l), phi = eig.vectors[k];
        Y.forEach(function (i, a) { out[i] += c * phi[a]; });
      });
      return out;
    }
    return { at: at, limit: at(Infinity), rate: rate };
  }

  // Relative cohomology H^0(G, U; F): global sections that vanish on the
  // vertices in U. Zero means values on U determine the harmonic extension,
  // and (their Thm 6.1) that controlling U is enough to steer the network.
  function relativeH0(S, fixed) {
    var isFixed = {}, Y = [];
    fixed.forEach(function (v) { isFixed[v] = 1; });
    S.dims.forEach(function (d, v) { for (var b = 0; b < d; b++) if (!isFixed[v]) Y.push(S.offV[v] + b); });
    var D = coboundary(S).map(function (row) { return Y.map(function (i) { return row[i]; }); });
    return Y.length - nullspace(D, Y.length).rank;
  }

  function copySheaf(S) {
    return create({ dims: S.dims, edges: S.edges.map(function (e) {
      return { u: e.u, v: e.v, Fu: e.Fu.map(function (r) { return Array.from(r); }), Fv: e.Fv.map(function (r) { return Array.from(r); }) };
    }) });
  }

  // Learning to lie (their Thm 8.1): with opinions x held fixed, the map flow
  // d delta_e / dt = -beta delta_e x_e x_e^T converges to the sheaf nearest in
  // Frobenius norm for which x is a global section. Edge by edge that is
  // delta_e (I - x_e x_e^T / |x_e|^2), where x_e stacks x_u and x_v; in the
  // maps, Fv -= g x_v^T / |x_e|^2 and Fu += g x_u^T / |x_e|^2 with g = (delta x)_e.
  function nearestSheaf(S, x) {
    var T = copySheaf(S);
    T.edges.forEach(function (e, k) {
      var g = edgeVec(S, x, k), du = S.dims[e.u], dv = S.dims[e.v], n2 = 0, a, b;
      for (b = 0; b < du; b++) n2 += x[S.offV[e.u] + b] * x[S.offV[e.u] + b];
      for (b = 0; b < dv; b++) n2 += x[S.offV[e.v] + b] * x[S.offV[e.v] + b];
      if (n2 === 0) return;
      for (a = 0; a < e.de; a++) {
        for (b = 0; b < du; b++) e.Fu[a][b] += g[a] * x[S.offV[e.u] + b] / n2;
        for (b = 0; b < dv; b++) e.Fv[a][b] -= g[a] * x[S.offV[e.v] + b] / n2;
      }
    });
    return T;
  }

  // Joint opinion-expression diffusion (their eq. 9.1):
  //   x' = -alpha delta^T delta x,   delta_e' = -beta delta_e x_e x_e^T,
  // so Fu' = beta g x_u^T and Fv' = -beta g x_v^T with g = (delta x)_e.
  // alpha = 0 is learning to lie alone (8.1), beta = 0 is plain opinion
  // diffusion (4.1). Fourth-order Runge-Kutta, `steps` steps to time T,
  // `samples` + 1 snapshots { t, x, S } evenly spaced in time.
  function jointFlow(S0, x0, alpha, beta, T, steps, samples) {
    samples = samples || 1;
    var S = copySheaf(S0), n0 = S.n0, idx = [], p = n0;
    S.edges.forEach(function (e) {
      idx.push({ fu: p, fv: p + e.de * S.dims[e.u] });
      p += e.de * (S.dims[e.u] + S.dims[e.v]);
    });
    var z = new Float64Array(p);
    for (var i = 0; i < n0; i++) z[i] = x0[i];
    S.edges.forEach(function (e, k) {
      var du = S.dims[e.u], dv = S.dims[e.v];
      for (var a = 0; a < e.de; a++) {
        for (var b = 0; b < du; b++) z[idx[k].fu + a * du + b] = e.Fu[a][b];
        for (b = 0; b < dv; b++) z[idx[k].fv + a * dv + b] = e.Fv[a][b];
      }
    });
    function deriv(z) {
      var d = new Float64Array(p);
      S.edges.forEach(function (e, k) {
        var du = S.dims[e.u], dv = S.dims[e.v], ou = S.offV[e.u], ov = S.offV[e.v], a, b;
        for (a = 0; a < e.de; a++) {
          var g = 0;
          for (b = 0; b < dv; b++) g += z[idx[k].fv + a * dv + b] * z[ov + b];
          for (b = 0; b < du; b++) g -= z[idx[k].fu + a * du + b] * z[ou + b];
          for (b = 0; b < dv; b++) {
            d[ov + b] -= alpha * z[idx[k].fv + a * dv + b] * g;
            d[idx[k].fv + a * dv + b] -= beta * g * z[ov + b];
          }
          for (b = 0; b < du; b++) {
            d[ou + b] += alpha * z[idx[k].fu + a * du + b] * g;
            d[idx[k].fu + a * du + b] += beta * g * z[ou + b];
          }
        }
      });
      return d;
    }
    function snap(t) {
      var Sk = copySheaf(S);
      Sk.edges.forEach(function (e, k) {
        var du = S.dims[e.u], dv = S.dims[e.v];
        for (var a = 0; a < e.de; a++) {
          for (var b = 0; b < du; b++) e.Fu[a][b] = z[idx[k].fu + a * du + b];
          for (b = 0; b < dv; b++) e.Fv[a][b] = z[idx[k].fv + a * dv + b];
        }
      });
      return { t: t, x: z.slice(0, n0), S: Sk };
    }
    var every = Math.max(1, Math.round(steps / samples));
    steps = every * samples;
    var h = T / steps, out = [snap(0)];
    function axpy(a, s, b) { var o = new Float64Array(p); for (var i = 0; i < p; i++) o[i] = a[i] + s * b[i]; return o; }
    for (var st = 1; st <= steps; st++) {
      var k1 = deriv(z), k2 = deriv(axpy(z, h / 2, k1)), k3 = deriv(axpy(z, h / 2, k2)), k4 = deriv(axpy(z, h, k3));
      for (var q = 0; q < p; q++) z[q] += h / 6 * (k1[q] + 2 * k2[q] + 2 * k3[q] + k4[q]);
      if (st % every === 0) out.push(snap(st * h));
    }
    return out;
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



    // Consistency radius and fusion (Robinson). Random sheaves with stalks of
    // dimension 1-2, random assignments on vertices and edges.
    var rc = mulberry32(11), midOK = true, zeroOK = true, boundOK = true, trials = 0;
    for (trial = 0; trial < 20; trial++) {
      var nv2 = 3 + Math.floor(rc() * 3), dims2 = [], ed2 = [];
      for (i = 0; i < nv2; i++) dims2.push(1 + Math.floor(rc() * 2));
      for (i = 0; i < nv2; i++) for (j2 = i + 1; j2 < nv2; j2++) {
        if (rc() < 0.35) continue;
        var de2 = 1 + Math.floor(rc() * 2), rm2 = function (r_, c_) {
          var M = [];
          for (var a = 0; a < r_; a++) { M.push([]); for (var b = 0; b < c_; b++) M[a].push(rc() * 2 - 1); }
          return M;
        };
        ed2.push({ u: i, v: j2, Fu: rm2(de2, dims2[i]), Fv: rm2(de2, dims2[j2]) });
      }
      var Sc2 = create({ dims: dims2, edges: ed2 });
      if (!Sc2.n1) continue;
      trials++;
      var xa = new Float64Array(Sc2.n0);
      for (i = 0; i < Sc2.n0; i++) xa[i] = rc() * 4 - 2;
      var cm = consistency(Sc2, xa), dxa = edgeDisagreement(Sc2, xa);
      if (!close(cm.radius, Math.max.apply(null, dxa) / 2, 1e-10)) midOK = false;
      for (var s2 = 0; s2 < 30; s2++) {
        var yr = Float64Array.from(cm.y, function (v) { return v + (rc() - 0.5) * 0.5; });
        if (consistency(Sc2, xa, yr).radius < cm.radius - 1e-12) midOK = false;
      }
      var K2 = lipschitz(Sc2), fz = fuse(Sc2, xa);
      var yRand = Float64Array.from(cm.y, function (v) { return v + (rc() - 0.5); }), cr = consistency(Sc2, xa, yRand).radius;
      if (supDistance(Sc2, xa, yRand, fz.x) < cr / (1 + K2) - 1e-12) boundOK = false;
      cohomology(Sc2).sections.forEach(function (q) {
        if (consistency(Sc2, q).radius > 1e-9) zeroOK = false;
        if (supDistance(Sc2, xa, yRand, q) < cr / (1 + K2) - 1e-12) boundOK = false;
      });
    }
    check('midpoint edge values minimise the radius, which is max |(delta x)_e| / 2 (' + trials + ' random sheaves)', midOK);
    check('every global section has consistency radius 0', zeroOK);
    check('D(a, s) >= c(a) / (1 + K) for the fused section and every basis section (Robinson Prop. 23)', boundOK);

    var Kg = signedGraph(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 0, 1], [0, 2, 1]]), xg = [3, -1, 4, 1.5];
    check('fusing on the constant sheaf of a connected graph gives the mean everywhere',
      Array.from(fuse(Kg, xg).x).every(function (v) { return close(v, 1.875, 1e-10); }));
    var loo = harmonicExtend(laplacian(Kg), [1, 2, 3], [-1, 4, 1.5]);
    check('harmonic extension to one withheld vertex of the constant sheaf is its neighbours\' mean', close(loo[0], (-1 + 4 + 1.5) / 3, 1e-10));

    // Plane position sheaf: R (world), C (turned 35 deg), two lines of position.
    var phi = 35 * Math.PI / 180, tP = 0, tQ = 2 * Math.PI / 3, Sp = positionSheaf(phi, [tP, tQ]), hp = cohomology(Sp);
    check('position sheaf: H^0 = R^2 (a point), H^1 = R^2, K = 1', hp.h0 === 2 && hp.h1 === 2 && close(lipschitz(Sp), 1, 1e-9));
    var pr2 = [0.3, -0.2], pc = [-0.4, 0.5], cP = 0.7, cQ = -0.1, Rm = rot(-phi);
    var ap = [pr2[0], pr2[1], Rm[0][0] * pc[0] + Rm[0][1] * pc[1], Rm[1][0] * pc[0] + Rm[1][1] * pc[1], cP, cQ];
    var fp = fuse(Sp, ap).x, uP = [1, 0], uQ = [Math.cos(tQ), Math.sin(tQ)];
    var N = [[2 + uP[0] * uP[0] + uQ[0] * uQ[0], uP[0] * uP[1] + uQ[0] * uQ[1]], [uP[0] * uP[1] + uQ[0] * uQ[1], 2 + uP[1] * uP[1] + uQ[1] * uQ[1]]];
    var rhs2 = [pr2[0] + pc[0] + cP * uP[0] + cQ * uQ[0], pr2[1] + pc[1] + cP * uP[1] + cQ * uQ[1]], pn = solve(N, rhs2);
    check('position sheaf: fusion equals the normal equations (2I + u_P u_P^T + u_Q u_Q^T) p = r + c + c_P u_P + c_Q u_Q',
      close(fp[0], pn[0], 1e-10) && close(fp[1], pn[1], 1e-10) && close(fp[4], uP[0] * pn[0] + uP[1] * pn[1], 1e-10));

    // In the sup distance a nearest section need not be unique: two scalar
    // sensors of x read 0 and 2 (edge value 1), a third sensor of y reads 5
    // alone. Sections are (t, t, w); D >= max(|t|, |t - 2|) >= 1, and D = 1 for
    // every w in [4, 6].
    var Su = create({ dims: [1, 1, 1], edges: [{ u: 0, v: 1, Fu: [[1]], Fv: [[1]] }] }), au = [0, 2, 5], yu = [1];
    var dA = supDistance(Su, au, yu, [1, 1, 4.5]), dB = supDistance(Su, au, yu, [1, 1, 5.5]), gridMin = Infinity;
    for (var tt = -1; tt <= 3; tt += 0.05) for (var ww = 3; ww <= 7; ww += 0.05) gridMin = Math.min(gridMin, supDistance(Su, au, yu, [tt, tt, ww]));
    check('sup-distance nearest section is not unique: (1, 1, 4.5) and (1, 1, 5.5) both attain the minimum 1',
      close(dA, 1) && close(dB, 1) && gridMin > 1 - 1e-9, 'grid min ' + gridMin.toFixed(4));
    var fu2 = fuse(Su, au).x;
    check('least-squares fusion of the same data is the single section (1, 1, 5)', close(fu2[0], 1) && close(fu2[1], 1) && close(fu2[2], 5));

    // Discourse sheaves (Hansen and Ghrist 2021).
    var rd = mulberry32(2021);
    function randSheaf(nv, ne, maxDim) {
      var dimsR = [], edgesR = [], seen = {};
      for (var v = 0; v < nv; v++) dimsR.push(1 + Math.floor(rd() * maxDim));
      for (v = 1; v < nv; v++) seen[(v - 1) + ',' + v] = 1;
      var pairsR = [];
      for (v = 1; v < nv; v++) pairsR.push([v - 1, v]);
      while (pairsR.length < ne) {
        var a = Math.floor(rd() * nv), b = Math.floor(rd() * nv);
        if (a === b || seen[Math.min(a, b) + ',' + Math.max(a, b)]) continue;
        seen[Math.min(a, b) + ',' + Math.max(a, b)] = 1;
        pairsR.push([Math.min(a, b), Math.max(a, b)]);
      }
      pairsR.forEach(function (pq) {
        var de = 1 + Math.floor(rd() * maxDim), m = function (c) {
          var M = [];
          for (var i = 0; i < de; i++) { var row = []; for (var j = 0; j < c; j++) row.push(rd() * 2 - 1); M.push(row); }
          return M;
        };
        edgesR.push({ u: pq[0], v: pq[1], Fu: m(dimsR[pq[0]]), Fv: m(dimsR[pq[1]]) });
      });
      return create({ dims: dimsR, edges: edgesR });
    }
    function randVec(n, s) { var o = new Float64Array(n); for (var i = 0; i < n; i++) o[i] = (rd() * 2 - 1) * (s || 1); return o; }
    function frob(A, B) {
      var s = 0;
      A.edges.forEach(function (e, k) {
        [['Fu', e.Fu], ['Fv', e.Fv]].forEach(function (m) {
          m[1].forEach(function (row, a) { row.forEach(function (val, b) { var d = val - B.edges[k][m[0]][a][b]; s += d * d; }); });
        });
      });
      return s;
    }

    // Stubborn agents: the fixed vertices never move, the limit is harmonic
    // off them, and a component with no stubborn vertex keeps its own mean.
    var Sst = randSheaf(7, 10, 2), xs0 = randVec(Sst.n0), st = stubborn(Sst, xs0, [0, 3]), Lst = laplacian(Sst);
    var fixedIdx = [];
    [0, 3].forEach(function (v) { for (var b = 0; b < Sst.dims[v]; b++) fixedIdx.push(Sst.offV[v] + b); });
    var holds = [0, 0.3, 2, 10].every(function (t) { var xt = st.at(t); return fixedIdx.every(function (i) { return xt[i] === xs0[i]; }); });
    var Lx = matVec(Lst, st.limit), harm = Lx.every(function (v, i) { return fixedIdx.indexOf(i) >= 0 || Math.abs(v) < 1e-9; });
    check('stubborn flow: fixed vertices hold, the limit is harmonic elsewhere (Thm 5.1)', holds && harm);
    var tBig = st.at(60 / st.rate);
    check('stubborn flow at large t reaches the limit', tBig.every(function (v, i) { return close(v, st.limit[i], 1e-9); }));
    var Su0 = randSheaf(7, 10, 2);
    while (relativeH0(Su0, [0, 3]) !== 0) Su0 = randSheaf(7, 10, 2);
    var fixU = [];
    [0, 3].forEach(function (v) { for (var b = 0; b < Su0.dims[v]; b++) fixU.push(Su0.offV[v] + b); });
    var xu0 = randVec(Su0.n0), he = harmonicExtend(laplacian(Su0), fixU, fixU.map(function (i) { return xu0[i]; }));
    var stU = stubborn(Su0, xu0, [0, 3]);
    check('with H^0(G, U) = 0 the limit is the unique harmonic extension', he.every(function (v, i) { return close(v, stU.limit[i], 1e-8); }));
    var two = signedGraph(5, [[0, 1, 1], [1, 2, 1], [3, 4, 1]]), st2 = stubborn(two, [1, -1, 0.5, 2, 0.4], [0]);
    check('a component with no stubborn vertex converges to its own mean; H^0(G, U) = 1',
      relativeH0(two, [0]) === 1 && close(st2.limit[1], 1) && close(st2.limit[2], 1) && close(st2.limit[3], 1.2) && close(st2.limit[4], 1.2));
    var hex6 = signedGraph(6, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 1]]);
    check('constant sheaf: one stubborn vertex gives H^0(G, {v}) = 0 (Example 6.3); none gives H^0', relativeH0(hex6, [2]) === 0 && relativeH0(hex6, []) === 1);

    // Learning to lie: the map flow with opinions fixed lands on the
    // Frobenius-nearest sheaf with x a section.
    var edge1 = create({ dims: [1, 1], edges: [{ u: 0, v: 1, Fu: [[1]], Fv: [[1]] }] }), xl = [-4, 1];
    var ns1 = nearestSheaf(edge1, xl);
    check('Example 8.2: constant sheaf on an edge with x = (-4, 1) learns maps (-3/17, 12/17)',
      close(ns1.edges[0].Fu[0][0], -3 / 17, 1e-12) && close(ns1.edges[0].Fv[0][0], 12 / 17, 1e-12));
    var Sl = randSheaf(6, 8, 2), xlr = randVec(Sl.n0).map(function (v) { return v + (v < 0 ? -0.5 : 0.5); }), nsl = nearestSheaf(Sl, xlr);
    check('nearest sheaf has x as a global section', energy(nsl, xlr) < 1e-20);
    var mf = jointFlow(Sl, xlr, 0, 1, 60, 12000, 1), fin = mf[mf.length - 1];
    check('map flow (alpha = 0) converges to the nearest sheaf (Thm 8.1)', frob(fin.S, nsl) < 1e-14 && fin.x.every(function (v, i) { return v === xlr[i]; }),
      'Frobenius^2 gap ' + frob(fin.S, nsl).toExponential(1));
    var nearer = true;
    for (var tr = 0; tr < 20; tr++) {
      // Any other sheaf with x a section: perturb, then project edge by edge.
      var Sp2 = copySheaf(nsl);
      Sp2.edges.forEach(function (e) { e.Fu.forEach(function (r) { r.forEach(function (_, b) { r[b] += (rd() - 0.5) * 0.5; }); }); e.Fv.forEach(function (r) { r.forEach(function (_, b) { r[b] += (rd() - 0.5) * 0.5; }); }); });
      var other = nearestSheaf(Sp2, xlr);
      if (frob(other, Sl) < frob(nsl, Sl) - 1e-12) nearer = false;
    }
    check('no other sheaf with x a section is nearer in Frobenius norm (20 random competitors)', nearer);

    // Joint flow (9.1): diagonal blocks of alpha delta^T delta - beta x x^T are
    // conserved (proof of Thm 9.3); |delta|_F, |x|, |delta x| and the Rayleigh
    // quotient never increase (Thm 9.4).
    var Sj = randSheaf(5, 7, 2), xj = randVec(Sj.n0, 1.5), al = 0.7, be = 1.3;
    var jf = jointFlow(Sj, xj, al, be, 40, 40000, 80);
    function diagBlocks(S, x) {
      var D = coboundary(S), blocks = [];
      S.dims.forEach(function (d, v) {
        var o = S.offV[v], B = [];
        for (var i = 0; i < d; i++) {
          B.push([]);
          for (var j = 0; j < d; j++) {
            var s = 0;
            for (var r = 0; r < D.length; r++) s += D[r][o + i] * D[r][o + j];
            B[i].push(al * s - be * x[o + i] * x[o + j]);
          }
        }
        blocks.push(B);
      });
      return blocks;
    }
    var b0 = diagBlocks(Sj, xj), drift = 0;
    jf.forEach(function (sn) {
      diagBlocks(sn.S, sn.x).forEach(function (B, v) { B.forEach(function (row, i) { row.forEach(function (val, j) { drift = Math.max(drift, Math.abs(val - b0[v][i][j])); }); }); });
    });
    check('joint flow conserves each vertex block of alpha delta^T delta - beta x x^T', drift < 1e-8, 'max drift ' + drift.toExponential(1));
    var mono2 = true, prev = null;
    jf.forEach(function (sn) {
      var D = coboundary(sn.S), dF = 0;
      D.forEach(function (row) { row.forEach(function (v) { dF += v * v; }); });
      var nx = dot(sn.x, sn.x), e2 = energy(sn.S, sn.x), cur = [dF, nx, e2, e2 / nx];
      if (prev && cur.some(function (v, i) { return v > prev[i] + 1e-10; })) mono2 = false;
      prev = cur;
    });
    check('joint flow: |delta|_F^2, |x|^2, |delta x|^2 and |delta x|^2 / |x|^2 never increase (Thm 9.4)', mono2);
    var endJ = jf[jf.length - 1], midJ = jf[(jf.length - 1) / 2], e0J = energy(Sj, xj), eEnd = energy(endJ.S, endJ.x);
    check('joint flow heads for a global section, but slowly: energy down 10^4-fold by t = 40 and still falling, x not tending to 0',
      eEnd < 1e-4 * e0J && eEnd < energy(midJ.S, midJ.x) && dot(endJ.x, endJ.x) > 1,
      'energy ' + e0J.toFixed(2) + ' -> ' + energy(midJ.S, midJ.x).toExponential(1) + ' (t = 20) -> ' + eEnd.toExponential(1) + ' (t = 40)');

    // One edge, scalar stalks: alpha F_v^2 - beta x_v^2 is conserved for each
    // agent, so an agent that starts with it negative never changes the sign of
    // their opinion, and one that starts with it positive never changes the
    // sign of their map.
    var dich = true, both = [0, 0];
    for (var tr2 = 0; tr2 < 40; tr2++) {
      var xo = [(rd() * 2 - 1) * 4, (rd() * 2 - 1) * 4], Fo = [(rd() * 2 - 1) * 1.5, (rd() * 2 - 1) * 1.5];
      var a2 = 0.2 + rd() * 1.8, b2 = 0.2 + rd() * 1.8;
      var ed = create({ dims: [1, 1], edges: [{ u: 0, v: 1, Fu: [[Fo[0]]], Fv: [[Fo[1]]] }] });
      var run = jointFlow(ed, xo, a2, b2, 20, 8000, 400);
      [0, 1].forEach(function (w) {
        var c = a2 * Fo[w] * Fo[w] - b2 * xo[w] * xo[w];
        run.forEach(function (sn) {
          var F = w === 0 ? sn.S.edges[0].Fu[0][0] : sn.S.edges[0].Fv[0][0];
          if (c < 0 && sn.x[w] * xo[w] <= 0) dich = false;
          if (c > 0 && F * Fo[w] <= 0) dich = false;
        });
        both[c < 0 ? 0 : 1]++;
      });
    }
    check('one edge: an agent with alpha F^2 < beta x^2 keeps the sign of their opinion, one with alpha F^2 > beta x^2 the sign of their map',
      dich && both[0] > 5 && both[1] > 5, both[0] + ' firm, ' + both[1] + ' flexible');
    var ex95 = jointFlow(edge1, xl, 1, 1, 40, 40000, 1), e95 = ex95[1];
    check('Example 9.5 (alpha = beta = 1): the agent at -4 ends lying (map < 0) with opinion still below -sqrt(15)',
      e95.S.edges[0].Fu[0][0] < 0 && e95.x[0] < -Math.sqrt(15) + 1e-9 && e95.S.edges[0].Fv[0][0] > 0 && energy(e95.S, e95.x) < 1e-12,
      'x = (' + e95.x[0].toFixed(3) + ', ' + e95.x[1].toFixed(3) + '), F = (' + e95.S.edges[0].Fu[0][0].toFixed(3) + ', ' + e95.S.edges[0].Fv[0][0].toFixed(3) + ')');

    // Neural sheaf diffusion (Bodnar et al. 2022), Sec. 3. Random connected
    // bipartite graphs with |A| = |B| = 6, A = even vertices.
    var rb = mulberry32(606);
    function bip(extra) {
      var E = [], seen = {};
      function put(u, v) { var k = Math.min(u, v) + ',' + Math.max(u, v); if (u !== v && !seen[k]) { seen[k] = 1; E.push([u, v]); } }
      for (var v = 1; v < 12; v++) {
        var u; do { u = Math.floor(rb() * v); } while (u % 2 === v % 2);
        put(u, v);
      }
      for (var q = 0; q < extra; q++) { var a = 2 * Math.floor(rb() * 6), b = 2 * Math.floor(rb() * 6) + 1; put(a, b); }
      return E;
    }
    var lab2 = []; for (var q2 = 0; q2 < 12; q2++) lab2.push(q2 % 2);
    function limitOf(S, aug) {
      var eN = symEig(normalizedLaplacian(S, aug)), x0 = [];
      for (var i = 0; i < S.n0; i++) x0.push(rb() * 2 - 1);
      return { eig: eN, x0: x0, lim: projectKernel(eN, x0, 1e-8) };
    }

    // Normalised constant sheaf: kernel spanned by sqrt(deg); heat flow on
    // Delta converges to <x0, y> y.
    var Eb = bip(4), Cb = signedGraph(12, Eb.map(function (e) { return [e[0], e[1], 1]; }));
    var lc = limitOf(Cb), degB = new Float64Array(12);
    Eb.forEach(function (e) { degB[e[0]]++; degB[e[1]]++; });
    var yb = Array.from(degB, Math.sqrt), ny = Math.sqrt(dot(yb, yb)), cb = dot(yb, lc.x0) / (ny * ny);
    var hb = heat(lc.eig, lc.x0, 400);
    check('normalised graph Laplacian: heat flow tends to <x0, y> y with y = sqrt(deg)',
      yb.every(function (y, v) { return close(hb[v], cb * y, 1e-8) && close(lc.lim[v], cb * y, 1e-10); }));

    // Prop. 9: symmetric positive weights on a bipartite graph with |A| = |B|
    // never sort the classes. Sum over A of y^2 equals the sum over B.
    var sorted = 0, balance = 0;
    for (var t9 = 0; t9 < 200; t9++) {
      var E9 = bip(1 + Math.floor(rb() * 8));
      var S9 = create({ dims: new Array(12).fill(1), edges: E9.map(function (e) { var w = 0.1 + 2 * rb(); return { u: e[0], v: e[1], Fu: [[w]], Fv: [[w]] }; }) });
      var L9 = laplacian(S9), y9 = [];
      for (var v9 = 0; v9 < 12; v9++) y9.push(Math.sqrt(L9[v9][v9]));
      var sA = 0, sB = 0, maxA = -Infinity, minA = Infinity, maxB = -Infinity, minB = Infinity;
      y9.forEach(function (y, v) {
        if (v % 2 === 0) { sA += y * y; maxA = Math.max(maxA, y); minA = Math.min(minA, y); }
        else { sB += y * y; maxB = Math.max(maxB, y); minB = Math.min(minB, y); }
      });
      if (maxA < minB || maxB < minA) sorted++;
      balance = Math.max(balance, Math.abs(sA - sB));
      var k9 = kernelDim(symEig(normalizedLaplacian(S9)), 1e-8);
      if (k9 !== 1) sorted += 1000;
    }
    check('Prop. 9: symmetric weights on a bipartite graph with |A| = |B| never put all of A below all of B', sorted === 0 && balance < 1e-9,
      '200 random weighted graphs, sum_A y^2 - sum_B y^2 at most ' + balance.toExponential(1));

    // Prop. 10: F = -alpha on the A end, +alpha on the B end separates any
    // two-class connected graph, including same-class edges.
    var sep10 = 0;
    for (var t10 = 0; t10 < 50; t10++) {
      var E10 = bip(3);
      // Add same-class edges too.
      E10.push([0, 2], [1, 3], [4, 8]);
      var S10 = create({ dims: new Array(12).fill(1), edges: E10.map(function (e) {
        var a = 0.2 + rb() * 1.5;
        return { u: e[0], v: e[1], Fu: [[e[0] % 2 === 0 ? -a : a]], Fv: [[e[1] % 2 === 0 ? -a : a]] };
      }) });
      var l10 = limitOf(S10);
      if (kernelDim(l10.eig, 1e-8) === 1 && thresholdAccuracy(l10.lim, lab2) === 1) sep10++;
    }
    check('Prop. 10: -alpha on the class-A end, +alpha on the B end separates the classes in the limit', sep10 === 50, sep10 + ' of 50 graphs');

    // Prop. 11: with one-dimensional stalks and three classes, the limit is
    // <x0, h> h, so one class sits between the others and cannot be cut off.
    var lab3 = []; for (var q3 = 0; q3 < 12; q3++) lab3.push(q3 % 3);
    var E3 = [];
    for (var v3 = 0; v3 < 12; v3++) { E3.push([v3, (v3 + 1) % 12]); if (v3 % 3 === 0) E3.push([v3, (v3 + 4) % 12]); }
    var fail11 = 0, tried11 = 0;
    for (var t11 = 0; t11 < 60; t11++) {
      // A path-independent sheaf of lines: F_{v <| e} = g_v a_e with random signs
      // and scales g_v, so dim H^0 = 1 (Lemma 6).
      var g = []; for (var q = 0; q < 12; q++) g.push((rb() < 0.5 ? -1 : 1) * (0.3 + rb()));
      var S11 = create({ dims: new Array(12).fill(1), edges: E3.map(function (e) { var a = 0.3 + rb(); return { u: e[0], v: e[1], Fu: [[a / g[e[0]]]], Fv: [[a / g[e[1]]]] }; }) });
      var l11 = limitOf(S11);
      if (kernelDim(l11.eig, 1e-8) !== 1) continue;
      tried11++;
      var pts = Array.from(l11.lim, function (x) { return [x, 0]; });
      if ([0, 1, 2].every(function (k) { return separable2(pts, lab3, k); })) fail11++;
    }
    check('Prop. 11: one-dimensional stalks never separate three classes in the limit', fail11 === 0 && tried11 > 50, tried11 + ' sheaves with dim H^0 = 1');

    // Prop. 13 construction: rotation by 2 pi c / 3 on every map out of a
    // class-c vertex. Path-independent, dim H^0 = 2 = d (Lemma 6), and the limit
    // puts each class on its own ray.
    var S13 = create({ dims: new Array(12).fill(2), edges: E3.map(function (e) { return { u: e[0], v: e[1], Fu: rot(2 * Math.PI * lab3[e[0]] / 3), Fv: rot(2 * Math.PI * lab3[e[1]] / 3) }; }) });
    var l13 = limitOf(S13), p13 = [];
    for (var v13 = 0; v13 < 12; v13++) p13.push([l13.lim[2 * v13], l13.lim[2 * v13 + 1]]);
    var ang13 = p13.map(function (p, v) { var r = rot(2 * Math.PI * lab3[v] / 3); return Math.atan2(r[1][0] * p[0] + r[1][1] * p[1], r[0][0] * p[0] + r[0][1] * p[1]); });
    check('Prop. 13: rotations by 2 pi c / 3 give dim H^0 = 2 and separate three classes',
      kernelDim(l13.eig, 1e-8) === 2 && [0, 1, 2].every(function (k) { return separable2(p13, lab3, k); }) &&
      ang13.every(function (a) { return close(Math.cos(a - ang13[0]), 1, 1e-8); }),
      'rotating each limit back by its class angle gives one common direction');
    var S13b = create({ dims: new Array(12).fill(2), edges: E3.map(function (e) { return { u: e[0], v: e[1], Fu: rot(rb() * 6), Fv: rot(rb() * 6) }; }) });
    check('Lemma 6: random rotations on a graph with cycles have dim H^0 < 2 (here 0)', kernelDim(symEig(normalizedLaplacian(S13b)), 1e-8) === 0);
    check('augmented normalisation (D + I) keeps the kernel of L and shrinks the spectrum below 2',
      kernelDim(symEig(normalizedLaplacian(S13, true)), 1e-8) === 2 && symEig(normalizedLaplacian(S13, true)).values[23] < 2);
    check('threshold accuracy: 0.2, 0.9 | 0.5, 1.4 with labels 0, 1, 1, 0 is 0.75',
      close(thresholdAccuracy([0.2, 0.5, 0.9, 1.4], [0, 1, 1, 0]), 0.75));
    return out;
  }

  var api = {
    create: create, coboundary: coboundary, laplacian: laplacian, energy: energy,
    edgeDisagreement: edgeDisagreement, symEig: symEig, heat: heat, kernelDim: kernelDim,
    projectKernel: projectKernel, harmonicExtend: harmonicExtend, solve: solve, rot: rot,
    signedGraph: signedGraph, rotationSheaf: rotationSheaf, cycleSpectrum: cycleSpectrum,
    mulberry32: mulberry32, dot: dot, matVec: matVec, nullspace: nullspace, cohomology: cohomology,
    explain: explain, subSheaf: subSheaf, openSet: openSet, openStar: openStar, intersect: intersect,
    sectionsOver: sectionsOver, cech: cech, consistency: consistency, fuse: fuse,
    supDistance: supDistance, lipschitz: lipschitz, positionSheaf: positionSheaf,
    normalizedLaplacian: normalizedLaplacian, thresholdAccuracy: thresholdAccuracy, separable2: separable2,
    stubborn: stubborn, relativeH0: relativeH0, nearestSheaf: nearestSheaf, jointFlow: jointFlow, runChecks: runChecks
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else global.Sheaf = api;
})(this);
