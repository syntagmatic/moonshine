// coh-math.js — Computational engine for the cohomology series.
// Attaches a single `COH` object to the global scope.
// Depends on `tda-math.js` (must be loaded first) for simplicial complexes,
// boundary operators over Z/2, and persistent homology.
//
// Public sections — API SURFACE IS FROZEN. See plans/cohomology/AGENTS.md.
// -------------------------------------------------------------------------
//   COH.tri          Canonical triangulations (torus, sphere, RP^2, Klein, annulus, figure-8)
//   COH.cochain      Cochain groups as the duals of TDA chain groups
//   COH.coboundary   The δ operator = transpose of TDA.boundary
//   COH.cohomology   Cohomology computation: ker δ_k / im δ_{k-1} over Z/2
//   COH.cup          Cup product via Alexander–Whitney
//   COH.deRham       De Rham forms on a sphere mesh; closed/exact tests; loop integration
//   COH.mv           Mayer–Vietoris: cover assembly, restriction maps, long exact sequence
//   COH.persistCoh   Persistent cohomology (dual of TDA.persistence) + circular coordinates
//   COH.fmt          Formatting helpers (cocycle pretty-print, ring element rendering)
//
// All linear algebra is over Z/2 (GF(2)) unless noted otherwise (de Rham uses R).

(function (global) {
  'use strict';

  if (!global.TDA) {
    throw new Error('coh-math.js requires tda-math.js to be loaded first');
  }

  var TDA = global.TDA;
  var simplexKey = TDA._util.simplexKey;
  var gauss = TDA.homology.gaussianElimZ2;

  // Build an index { "sorted-key": i } for a simplex list.
  function indexSimplices(simplices) {
    var idx = {};
    for (var i = 0; i < simplices.length; i++) {
      idx[simplexKey(simplices[i])] = i;
    }
    return idx;
  }

  // Transpose a Uint8Array-row matrix.
  function transpose(mat, nRows, nCols) {
    var T = [];
    for (var i = 0; i < nCols; i++) T[i] = new Uint8Array(nRows);
    for (var i = 0; i < nRows; i++) {
      for (var j = 0; j < nCols; j++) T[j][i] = mat[i][j];
    }
    return T;
  }

  // Matrix-vector product over Z/2.
  function matVec(mat, vec, nRows, nCols) {
    var out = new Uint8Array(nRows);
    for (var i = 0; i < nRows; i++) {
      var s = 0;
      for (var j = 0; j < nCols; j++) s ^= (mat[i][j] & vec[j]);
      out[i] = s;
    }
    return out;
  }

  // Dimension of a complex's k-skeleton.
  function dimCk(complex, k) {
    return (complex.simplices[k] || []).length;
  }

  // ─────────────────────────────────────────── COH.tri ──

  var tri = {};

  tri.torus7 = function () {
    return TDA.complex.presets.torus7();
  };

  // Minimal 6-vertex RP^2: complete graph K_6's edges with 10 of the 20 possible
  // triangles, chosen so each pair of vertices is in exactly two triangles.
  // χ = 6 − 15 + 10 = 1. ✓
  tri.rp2 = function () {
    return TDA.complex.fromMaximal([
      [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 1, 5],
      [1, 2, 4], [2, 3, 5], [1, 3, 4], [2, 4, 5], [1, 3, 5]
    ]);
  };

  tri.s2 = function () {
    return TDA.complex.presets.boundaryTetrahedron();
  };

  // 9-vertex Klein bottle as the quotient of a 3×3-cell square with
  // (i, 3) ≡ (i, 0) (a-edges glued same direction) and
  // (3, j) ≡ (0, 3-j) (b-edges glued reversed). χ = 9 − 27 + 18 = 0.
  tri.klein = function () {
    function label(i, j) {
      if (i === 3 && j === 3) return 0;
      if (i === 3) return ((3 - j) % 3) * 1;
      if (j === 3) return i * 3;
      return i * 3 + j;
    }
    var maximal = [];
    for (var a = 0; a < 3; a++) {
      for (var b = 0; b < 3; b++) {
        var bl = label(a, b);
        var br = label(a + 1, b);
        var tl = label(a, b + 1);
        var tr = label(a + 1, b + 1);
        if (bl !== br && bl !== tl && br !== tl) maximal.push([bl, br, tl]);
        if (br !== tr && br !== tl && tr !== tl) maximal.push([br, tr, tl]);
      }
    }
    return TDA.complex.fromMaximal(maximal);
  };

  // Annulus: inner ring of `inner` vertices at radius 0.5, outer ring of
  // `outer` vertices at radius 1.0, triangulated as an annular strip.
  // Returns the usual complex shape plus a `cycles` field with the two
  // canonical boundary 1-chains as edge-index lists.
  tri.annulus = function (inner, outer) {
    inner = inner || 8;
    outer = outer || inner * 2;
    var maximal = [];

    // For each outer vertex k (in 0..outer-1), pick the inner vertex it
    // "anchors" to. With outer ≥ inner, this is floor(k * inner / outer).
    function anchor(k) { return Math.floor(k * inner / outer); }

    for (var k = 0; k < outer; k++) {
      var ok = inner + k;
      var ok1 = inner + ((k + 1) % outer);
      var ak = anchor(k);
      var ak1 = anchor((k + 1) % outer);
      if (ak === ak1) {
        // Both outer vertices anchor to the same inner — single triangle.
        maximal.push([ok, ok1, ak]);
      } else {
        // Anchor jumps — two triangles spanning the quad.
        maximal.push([ok, ok1, ak1]);
        maximal.push([ok, ak1, ak]);
      }
    }

    var cpx = TDA.complex.fromMaximal(maximal);

    // The two canonical 1-cycles as lists of edge keys (so a caller can
    // recover the edge-index list against any later sorted edge ordering).
    var innerCycle = [];
    for (var i = 0; i < inner; i++) {
      innerCycle.push(simplexKey([i, (i + 1) % inner]));
    }
    var outerCycle = [];
    for (var i = 0; i < outer; i++) {
      outerCycle.push(simplexKey([inner + i, inner + ((i + 1) % outer)]));
    }
    cpx.cycles = [innerCycle, outerCycle];

    // Vertex positions for drawing
    cpx.positions = [];
    for (var i = 0; i < inner; i++) {
      var t = (2 * Math.PI * i) / inner;
      cpx.positions.push([0.5 * Math.cos(t), 0.5 * Math.sin(t)]);
    }
    for (var i = 0; i < outer; i++) {
      var t = (2 * Math.PI * i) / outer;
      cpx.positions.push([Math.cos(t), Math.sin(t)]);
    }

    return cpx;
  };

  // S^1 ∨ S^1 ∨ S^2 wedged at vertex 0. Same Betti as T^2; trivial cup product
  // between the two H^1 generators because their supports never share a
  // 2-simplex's front-and-back face.
  tri.wedgeS1S1S2 = function () {
    return TDA.complex.fromMaximal([
      [0, 1], [1, 2], [0, 2],          // first S^1
      [0, 3], [3, 4], [0, 4],          // second S^1
      [0, 5, 6], [0, 5, 7],            // sphere (boundary of tet on {0,5,6,7})
      [0, 6, 7], [5, 6, 7]
    ]);
  };

  tri.figureEight = function () {
    return TDA.complex.fromMaximal([
      [0, 1], [1, 2], [0, 2],
      [0, 3], [3, 4], [0, 4]
    ]);
  };

  // ─────────────────────────────────────────── COH.cochain ──

  var cochain = {};

  cochain.zero = function (complex, k) {
    return new Uint8Array(dimCk(complex, k));
  };

  cochain.indicator = function (complex, k, i) {
    var c = new Uint8Array(dimCk(complex, k));
    c[i] = 1;
    return c;
  };

  cochain.add = function (a, b) {
    var n = a.length;
    var out = new Uint8Array(n);
    for (var i = 0; i < n; i++) out[i] = a[i] ^ b[i];
    return out;
  };

  cochain.eval = function (alpha, chain) {
    var n = Math.min(alpha.length, chain.length);
    var s = 0;
    for (var i = 0; i < n; i++) s ^= (alpha[i] & chain[i]);
    return s;
  };

  // ─────────────────────────────────────────── COH.coboundary ──

  var coboundary = {};

  // δ_k : C^k → C^{k+1} is the transpose of ∂_{k+1} : C_{k+1} → C_k.
  // We return the same shape as TDA.boundary.matrix:
  //   { matrix, rows, cols, rowSimplices, colSimplices }
  // with rows = (k+1)-simplices and cols = k-simplices.
  coboundary.matrix = function (complex, k) {
    var rowSimplices = complex.simplices[k + 1] || [];
    var colSimplices = complex.simplices[k] || [];
    if (rowSimplices.length === 0 || colSimplices.length === 0) {
      return { matrix: [], rows: [], cols: [],
        rowSimplices: rowSimplices, colSimplices: colSimplices };
    }
    var bd = TDA.boundary.matrix(complex, k + 1);
    // bd.matrix: rows = k-simplices, cols = (k+1)-simplices. Transpose.
    var mat = transpose(bd.matrix, bd.matrix.length, bd.matrix[0].length);
    return {
      matrix: mat,
      rows: rowSimplices.map(simplexKey),
      cols: colSimplices.map(simplexKey),
      rowSimplices: rowSimplices,
      colSimplices: colSimplices
    };
  };

  coboundary.apply = function (complex, k, a) {
    var d = coboundary.matrix(complex, k);
    if (d.matrix.length === 0) return new Uint8Array(0);
    return matVec(d.matrix, a, d.matrix.length, d.matrix[0].length);
  };

  coboundary.isClosed = function (complex, k, a) {
    var da = coboundary.apply(complex, k, a);
    for (var i = 0; i < da.length; i++) if (da[i] !== 0) return false;
    return true;
  };

  // a is exact ⟺ a ∈ im δ_{k-1} ⟺ augmenting δ_{k-1}'s columns with a
  // does not increase its rank.
  coboundary.isExact = function (complex, k, a) {
    if (k === 0) {
      // δ_{-1} has zero image — only the zero cochain is "exact".
      for (var i = 0; i < a.length; i++) if (a[i] !== 0) return false;
      return true;
    }
    var d = coboundary.matrix(complex, k - 1);
    if (d.matrix.length === 0) {
      for (var i = 0; i < a.length; i++) if (a[i] !== 0) return false;
      return true;
    }
    var nRows = d.matrix.length;
    var nCols = d.matrix[0].length;
    var baseRank = gauss(d.matrix, nRows, nCols).rank;
    var aug = [];
    for (var r = 0; r < nRows; r++) {
      aug[r] = new Uint8Array(nCols + 1);
      for (var c = 0; c < nCols; c++) aug[r][c] = d.matrix[r][c];
      aug[r][nCols] = a[r] || 0;
    }
    var augRank = gauss(aug, nRows, nCols + 1).rank;
    return augRank === baseRank;
  };

  // ─────────────────────────────────────────── COH.cohomology ──

  var cohomology = {};

  // H^k(complex; Z/2) = ker δ_k / im δ_{k-1}.
  // Returns { betti, basis } where basis is a list of cocycle representatives
  // (Uint8Array indexed by complex.simplices[k]).
  cohomology.compute = function (complex, k) {
    var nk = dimCk(complex, k);
    if (nk === 0) return { betti: 0, basis: [] };

    var dk = coboundary.matrix(complex, k);
    var dkm = (k > 0) ? coboundary.matrix(complex, k - 1) : null;

    // Compute ker δ_k as the null space.
    var kernel = [];
    if (dk.matrix.length === 0) {
      // δ_k = 0 — every cochain is a cocycle.
      for (var j = 0; j < nk; j++) {
        var e = new Uint8Array(nk);
        e[j] = 1;
        kernel.push(e);
      }
    } else {
      var nRows = dk.matrix.length;
      var res = gauss(dk.matrix, nRows, nk);
      var pivotCols = {};
      for (var i = 0; i < res.pivotCols.length; i++) {
        pivotCols[res.pivotCols[i]] = res.pivotRows[i];
      }
      // Free variables generate the kernel.
      for (var j = 0; j < nk; j++) {
        if (pivotCols[j] !== undefined) continue;
        var v = new Uint8Array(nk);
        v[j] = 1;
        for (var c = 0; c < nk; c++) {
          if (c === j) continue;
          if (pivotCols[c] !== undefined) {
            v[c] = res.reduced[pivotCols[c]][j];
          }
        }
        kernel.push(v);
      }
    }

    // Quotient by im δ_{k-1}: drop kernel elements that are exact.
    if (k === 0 || !dkm || dkm.matrix.length === 0) {
      return { betti: kernel.length, basis: kernel };
    }
    var nDkmRows = dkm.matrix.length;
    var nDkmCols = dkm.matrix[0].length;
    var baseRank = gauss(dkm.matrix, nDkmRows, nDkmCols).rank;
    var basis = [];
    var pending = kernel.slice();

    function augmentedRank(extras) {
      var totalCols = nDkmCols + extras.length;
      var aug = [];
      for (var r = 0; r < nDkmRows; r++) {
        aug[r] = new Uint8Array(totalCols);
        for (var c = 0; c < nDkmCols; c++) aug[r][c] = dkm.matrix[r][c];
        for (var e = 0; e < extras.length; e++) {
          aug[r][nDkmCols + e] = extras[e][r] || 0;
        }
      }
      return gauss(aug, nDkmRows, totalCols).rank;
    }

    for (var i = 0; i < pending.length; i++) {
      var trial = basis.concat([pending[i]]);
      if (augmentedRank(trial) > baseRank + basis.length) {
        // This kernel element is independent modulo (im δ_{k-1} + previous basis).
        basis.push(pending[i]);
      }
    }
    return { betti: basis.length, basis: basis };
  };

  cohomology.ring = function (complex, maxDim) {
    maxDim = maxDim === undefined ? 2 : maxDim;
    var out = [];
    for (var k = 0; k <= maxDim; k++) {
      var h = cohomology.compute(complex, k);
      out.push({ degree: k, betti: h.betti, basis: h.basis });
    }
    return out;
  };

  // ─────────────────────────────────────────── COH.cup ──

  var cup = {};

  // Alexander–Whitney: (α ∪ β)(σ) = α(front_p(σ)) · β(back_q(σ))
  // where σ = [v_0 < v_1 < ... < v_{p+q}],
  //       front_p(σ) = [v_0, ..., v_p],
  //       back_q(σ)  = [v_p, ..., v_{p+q}].
  cup.product = function (complex, alpha, beta, p, q) {
    var n = p + q;
    var sigs = complex.simplices[n] || [];
    var out = new Uint8Array(sigs.length);
    if (sigs.length === 0) return out;

    var pSimplices = complex.simplices[p] || [];
    var qSimplices = complex.simplices[q] || [];
    var pIdx = indexSimplices(pSimplices);
    var qIdx = indexSimplices(qSimplices);

    for (var i = 0; i < sigs.length; i++) {
      var sigma = sigs[i];  // sorted ascending
      var front = sigma.slice(0, p + 1);
      var back = sigma.slice(p);
      var fi = pIdx[simplexKey(front)];
      var bi = qIdx[simplexKey(back)];
      if (fi === undefined || bi === undefined) continue;
      out[i] = (alpha[fi] & beta[bi]);
    }
    return out;
  };

  // Multiplication table of H^* up to maxDim, indexed [p][q] -> array of
  // ring-element coefficient vectors (one per pair of basis elements).
  // Each entry is the cup product of the i-th degree-p basis with the j-th
  // degree-q basis, expressed in the chosen H^{p+q} basis.
  cup.table = function (complex, maxDim) {
    maxDim = maxDim === undefined ? 2 : maxDim;
    var ring = cohomology.ring(complex, maxDim);
    var table = {};
    for (var p = 0; p <= maxDim; p++) {
      table[p] = {};
      for (var q = 0; q <= maxDim - p; q++) {
        var entries = [];
        var pBasis = ring[p].basis;
        var qBasis = ring[q].basis;
        var rBasis = ring[p + q].basis;
        for (var i = 0; i < pBasis.length; i++) {
          for (var j = 0; j < qBasis.length; j++) {
            var prod = cup.product(complex, pBasis[i], qBasis[j], p, q);
            var coeffs = expressInBasis(complex, p + q, prod, rBasis);
            entries.push({ i: i, j: j, prod: prod, coeffs: coeffs });
          }
        }
        table[p][q] = entries;
      }
    }
    return table;
  };

  // Given a cocycle `c` in C^k and a basis `basis` for H^k, find coefficients
  // such that c ≡ Σ a_i · basis[i]  (mod im δ_{k-1}).
  // Returns null if c is not in the span (shouldn't happen for cocycles).
  function expressInBasis(complex, k, c, basis) {
    // Solve basisMatrix · a + δ_{k-1} · b = c over Z/2.
    var nk = dimCk(complex, k);
    var dkm = (k > 0) ? coboundary.matrix(complex, k - 1) : null;
    var dkmCols = (dkm && dkm.matrix.length > 0) ? dkm.matrix[0].length : 0;

    // Build augmented [basis | δ_{k-1} | c]
    var width = basis.length + dkmCols + 1;
    var M = [];
    for (var r = 0; r < nk; r++) {
      M[r] = new Uint8Array(width);
      for (var i = 0; i < basis.length; i++) M[r][i] = basis[i][r] || 0;
      for (var i = 0; i < dkmCols; i++) M[r][basis.length + i] = dkm.matrix[r][i];
      M[r][width - 1] = c[r] || 0;
    }
    var res = gauss(M, nk, width);
    // Read off coefficients of the basis cols from the reduced matrix:
    var coeffs = new Uint8Array(basis.length);
    for (var i = 0; i < res.pivotCols.length; i++) {
      var col = res.pivotCols[i];
      var row = res.pivotRows[i];
      if (col < basis.length && res.reduced[row][width - 1] === 1) {
        coeffs[col] = 1;
      }
    }
    return coeffs;
  }

  cup._expressInBasis = expressInBasis;

  // ─────────────────────────────────────────── COH.deRham ──
  // Discrete differential forms on an icosphere mesh. Real-valued.
  // Mesh shape: { positions: number[3][], faces: number[3][],
  //               edges: number[2][], edgeIndex: {"i,j": k} }.

  var deRham = {};

  function icosahedron() {
    var phi = (1 + Math.sqrt(5)) / 2;
    var raw = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [0, -1,  phi], [0,  1,  phi], [0, -1, -phi], [0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];
    var positions = raw.map(function (p) {
      var L = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
      return [p[0] / L, p[1] / L, p[2] / L];
    });
    var faces = [
      [0,11,5], [0,5,1], [0,1,7], [0,7,10], [0,10,11],
      [1,5,9], [5,11,4], [11,10,2], [10,7,6], [7,1,8],
      [3,9,4], [3,4,2], [3,2,6], [3,6,8], [3,8,9],
      [4,9,5], [2,4,11], [6,2,10], [8,6,7], [9,8,1]
    ];
    return { positions: positions, faces: faces };
  }

  function subdivideOnce(mesh) {
    var positions = mesh.positions.slice();
    var midCache = {};
    function midpoint(a, b) {
      var k = a < b ? a + '-' + b : b + '-' + a;
      if (midCache[k] !== undefined) return midCache[k];
      var pa = positions[a], pb = positions[b];
      var m = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2];
      var L = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
      m = [m[0] / L, m[1] / L, m[2] / L];
      var idx = positions.length;
      positions.push(m);
      midCache[k] = idx;
      return idx;
    }
    var newFaces = [];
    for (var i = 0; i < mesh.faces.length; i++) {
      var f = mesh.faces[i];
      var a = midpoint(f[0], f[1]);
      var b = midpoint(f[1], f[2]);
      var c = midpoint(f[2], f[0]);
      newFaces.push([f[0], a, c], [f[1], b, a], [f[2], c, b], [a, b, c]);
    }
    return { positions: positions, faces: newFaces };
  }

  function buildEdges(mesh) {
    var edgeIndex = {};
    var edges = [];
    function addEdge(i, j) {
      var k = i < j ? i + ',' + j : j + ',' + i;
      if (edgeIndex[k] === undefined) {
        edgeIndex[k] = edges.length;
        edges.push(i < j ? [i, j] : [j, i]);
      }
    }
    for (var i = 0; i < mesh.faces.length; i++) {
      var f = mesh.faces[i];
      addEdge(f[0], f[1]); addEdge(f[1], f[2]); addEdge(f[2], f[0]);
    }
    return { positions: mesh.positions, faces: mesh.faces,
      edges: edges, edgeIndex: edgeIndex };
  }

  deRham.sphereMesh = function (nSub) {
    nSub = nSub === undefined ? 1 : nSub;
    var m = icosahedron();
    for (var i = 0; i < nSub; i++) m = subdivideOnce(m);
    return buildEdges(m);
  };

  // Edge values are stored against the canonical edge orientation i < j.
  // ω(i→j) = value if i < j else -value.
  function edgeValue(mesh, omega, i, j) {
    var k = (i < j) ? mesh.edgeIndex[i + ',' + j] : mesh.edgeIndex[j + ',' + i];
    if (k === undefined) return 0;
    var raw = omega[k];
    return (i < j) ? raw : -raw;
  }

  deRham.oneForm = function (mesh, preset) {
    var n = mesh.edges.length;
    var omega = new Float64Array(n);

    function setEdgeOrdered(i, j, v) {
      var key = (i < j) ? i + ',' + j : j + ',' + i;
      var k = mesh.edgeIndex[key];
      if (k === undefined) return;
      omega[k] = (i < j) ? v : -v;
    }

    function fScalar(name, p) {
      if (name === 'df_z') return p[2];
      if (name === 'df_x') return p[0];
      if (name === 'bump') {
        // Smooth bump centered on the +z pole.
        var d = (1 - p[2]);
        return Math.exp(-8 * d * d);
      }
      return 0;
    }

    if (preset === 'df_z' || preset === 'df_x' || preset === 'bump') {
      // df is exact: ω(i→j) = f(j) − f(i).
      for (var e = 0; e < mesh.edges.length; e++) {
        var edge = mesh.edges[e];
        var fi = fScalar(preset, mesh.positions[edge[0]]);
        var fj = fScalar(preset, mesh.positions[edge[1]]);
        omega[e] = fj - fi;
      }
    } else if (preset === 'latitude') {
      // dθ where θ = atan2(y, x). Closed off the poles; multi-valued, so we
      // store the principal-branch difference along each edge — i.e. take the
      // shortest angular jump in (−π, π].
      for (var e = 0; e < mesh.edges.length; e++) {
        var edge = mesh.edges[e];
        var pa = mesh.positions[edge[0]];
        var pb = mesh.positions[edge[1]];
        var ta = Math.atan2(pa[1], pa[0]);
        var tb = Math.atan2(pb[1], pb[0]);
        var d = tb - ta;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d <= -Math.PI) d += 2 * Math.PI;
        omega[e] = d;
      }
    } else if (preset === 'rotation') {
      // Same as latitude, kept as an alias.
      return deRham.oneForm(mesh, 'latitude');
    }
    return omega;
  };

  // Discrete d: 2-form value on face = sum of oriented edge values around its
  // boundary. (Stokes-on-a-triangle.)
  deRham.d = function (mesh, omega) {
    var out = new Float64Array(mesh.faces.length);
    for (var i = 0; i < mesh.faces.length; i++) {
      var f = mesh.faces[i];
      out[i] = edgeValue(mesh, omega, f[0], f[1])
             + edgeValue(mesh, omega, f[1], f[2])
             + edgeValue(mesh, omega, f[2], f[0]);
    }
    return out;
  };

  deRham.integrate = function (mesh, omega, loop) {
    if (!loop || loop.length < 2) return 0;
    var s = 0;
    for (var i = 0; i < loop.length - 1; i++) {
      s += edgeValue(mesh, omega, loop[i], loop[i + 1]);
    }
    // If caller didn't explicitly close the loop, close it.
    if (loop[loop.length - 1] !== loop[0]) {
      s += edgeValue(mesh, omega, loop[loop.length - 1], loop[0]);
    }
    return s;
  };

  // ─────────────────────────────────────────── COH.mv ──
  // Mayer–Vietoris for U ∪ V = X via vertex partition.

  var mv = {};

  // Restrict a complex to the simplices whose every vertex passes `test`.
  function restrictComplex(complex, test) {
    var maximal = [];
    function consider(s) {
      for (var i = 0; i < s.length; i++) if (!test(s[i])) return;
      maximal.push(s);
    }
    var keys = Object.keys(complex.simplices).map(Number).sort(function (a, b) { return b - a; });
    for (var di = 0; di < keys.length; di++) {
      var d = keys[di];
      var sims = complex.simplices[d];
      for (var i = 0; i < sims.length; i++) consider(sims[i]);
    }
    if (maximal.length === 0) {
      return { vertices: [], simplices: { 0: [] } };
    }
    return TDA.complex.fromMaximal(maximal);
  }

  mv.cover = function (complex, vertexMask) {
    var U = restrictComplex(complex, function (v) { return (vertexMask[v] & 1) === 1; });
    var V = restrictComplex(complex, function (v) { return (vertexMask[v] & 2) === 2; });
    var UV = restrictComplex(complex, function (v) { return vertexMask[v] === 3; });
    return { X: complex, U: U, V: V, UV: UV, vertexMask: vertexMask };
  };

  // π* : H^k(X) → H^k(U) ⊕ H^k(V). For each basis cocycle on X, restrict to
  // U and V (zero out the simplices absent from each), and express in their
  // own H^k bases. We return a matrix whose columns are (a_U, a_V) stacked.
  mv.restrict = function (cover, k) {
    var hX = cohomology.compute(cover.X, k);
    var hU = cohomology.compute(cover.U, k);
    var hV = cohomology.compute(cover.V, k);
    var rows = hU.betti + hV.betti;
    var cols = hX.betti;
    var mat = [];
    for (var r = 0; r < rows; r++) mat[r] = new Uint8Array(cols);

    var uSimplices = (cover.U.simplices[k] || []);
    var vSimplices = (cover.V.simplices[k] || []);
    var xSimplices = (cover.X.simplices[k] || []);
    var uMap = indexSimplices(uSimplices);
    var vMap = indexSimplices(vSimplices);

    for (var j = 0; j < hX.betti; j++) {
      var alpha = hX.basis[j];
      var aU = new Uint8Array(uSimplices.length);
      var aV = new Uint8Array(vSimplices.length);
      for (var i = 0; i < xSimplices.length; i++) {
        if (!alpha[i]) continue;
        var key = simplexKey(xSimplices[i]);
        if (uMap[key] !== undefined) aU[uMap[key]] = 1;
        if (vMap[key] !== undefined) aV[vMap[key]] = 1;
      }
      var cU = expressInBasis(cover.U, k, aU, hU.basis);
      var cV = expressInBasis(cover.V, k, aV, hV.basis);
      for (var r = 0; r < hU.betti; r++) mat[r][j] = cU[r];
      for (var r = 0; r < hV.betti; r++) mat[hU.betti + r][j] = cV[r];
    }
    return { matrix: mat, rows: rows, cols: cols, hU: hU, hV: hV, hX: hX };
  };

  // (i_U^* − i_V^*) : H^k(U) ⊕ H^k(V) → H^k(U ∩ V).
  // Over Z/2 the minus is also a plus.
  mv.difference = function (cover, k) {
    var hU = cohomology.compute(cover.U, k);
    var hV = cohomology.compute(cover.V, k);
    var hUV = cohomology.compute(cover.UV, k);
    var rows = hUV.betti;
    var cols = hU.betti + hV.betti;
    var mat = [];
    for (var r = 0; r < rows; r++) mat[r] = new Uint8Array(cols);

    var uvSimplices = cover.UV.simplices[k] || [];
    var uSimplices = cover.U.simplices[k] || [];
    var vSimplices = cover.V.simplices[k] || [];
    var uvMap = indexSimplices(uvSimplices);

    function project(srcSimplices, alpha) {
      var out = new Uint8Array(uvSimplices.length);
      for (var i = 0; i < srcSimplices.length; i++) {
        if (!alpha[i]) continue;
        var key = simplexKey(srcSimplices[i]);
        if (uvMap[key] !== undefined) out[uvMap[key]] = 1;
      }
      return out;
    }

    for (var j = 0; j < hU.betti; j++) {
      var a = project(uSimplices, hU.basis[j]);
      var coeffs = expressInBasis(cover.UV, k, a, hUV.basis);
      for (var r = 0; r < hUV.betti; r++) mat[r][j] = coeffs[r];
    }
    for (var j = 0; j < hV.betti; j++) {
      var a = project(vSimplices, hV.basis[j]);
      var coeffs = expressInBasis(cover.UV, k, a, hUV.basis);
      for (var r = 0; r < hUV.betti; r++) mat[r][hU.betti + j] = coeffs[r];
    }
    return { matrix: mat, rows: rows, cols: cols, hU: hU, hV: hV, hUV: hUV };
  };

  // δ* : H^k(U ∩ V) → H^{k+1}(X). For each cocycle on U∩V, extend by zero to
  // a (non-cocycle) cochain on U and on V; their boundaries agree on U∩V and
  // patch to a (k+1)-cocycle on X. Express in H^{k+1}(X) basis.
  mv.connecting = function (cover, k) {
    var hUV = cohomology.compute(cover.UV, k);
    var hX = cohomology.compute(cover.X, k + 1);
    var rows = hX.betti;
    var cols = hUV.betti;
    var mat = [];
    for (var r = 0; r < rows; r++) mat[r] = new Uint8Array(cols);
    if (rows === 0 || cols === 0) {
      return { matrix: mat, rows: rows, cols: cols, hUV: hUV, hX: hX };
    }

    var uvSimplices = cover.UV.simplices[k] || [];
    var uSimplices = cover.U.simplices[k] || [];
    var uMap = indexSimplices(uSimplices);
    var xSimplicesNext = cover.X.simplices[k + 1] || [];
    var xMap = indexSimplices(xSimplicesNext);

    for (var j = 0; j < hUV.betti; j++) {
      var eta = hUV.basis[j];
      // Lift to η_U ∈ C^k(U) by zero extension (we only need η_U; η_V can be 0
      // because over Z/2 the difference of two extensions is in U∩V, and δη_U
      // already represents the connecting class up to the choice).
      var etaU = new Uint8Array(uSimplices.length);
      for (var i = 0; i < uvSimplices.length; i++) {
        if (!eta[i]) continue;
        var key = simplexKey(uvSimplices[i]);
        if (uMap[key] !== undefined) etaU[uMap[key]] = 1;
      }
      var dEtaU = coboundary.apply(cover.U, k, etaU);
      // Push δη_U back to X (it has support only on (k+1)-simplices wholly
      // in U; embedding into X is well-defined).
      var xCochain = new Uint8Array(xSimplicesNext.length);
      var uNext = cover.U.simplices[k + 1] || [];
      for (var i = 0; i < uNext.length; i++) {
        if (!dEtaU[i]) continue;
        var key = simplexKey(uNext[i]);
        if (xMap[key] !== undefined) xCochain[xMap[key]] = 1;
      }
      var coeffs = expressInBasis(cover.X, k + 1, xCochain, hX.basis);
      for (var r = 0; r < hX.betti; r++) mat[r][j] = coeffs[r];
    }
    return { matrix: mat, rows: rows, cols: cols, hUV: hUV, hX: hX };
  };

  mv.longExactSequence = function (cover, maxDim) {
    maxDim = maxDim === undefined ? 2 : maxDim;
    var seq = [];
    for (var k = 0; k <= maxDim; k++) {
      seq.push({ group: 'H^' + k + '(U∩V)', betti: cohomology.compute(cover.UV, k).betti });
      seq.push({ group: 'H^' + (k + 1) + '(X)', betti: cohomology.compute(cover.X, k + 1).betti });
      seq.push({ group: 'H^' + (k + 1) + '(U)⊕H^' + (k + 1) + '(V)',
        betti: cohomology.compute(cover.U, k + 1).betti + cohomology.compute(cover.V, k + 1).betti });
    }
    return seq;
  };

  // ─────────────────────────────────────────── COH.persistCoh ──

  var persistCoh = {};

  // Persistent cohomology. We compute persistent homology via TDA.persistence,
  // then for each non-trivial bar attach a cocycle representative computed at
  // a representative scale (the bar's midpoint). Cheap and correct on the
  // typical demo input (annulus, figure-8); for high-volume data, replace
  // with a true dual reduction.
  persistCoh.compute = function (filt) {
    var ph = TDA.persistence.compute(filt);
    var enriched = [];
    for (var i = 0; i < ph.bars.length; i++) {
      var bar = ph.bars[i];
      var rep = null;
      if (bar.dim === 1 && bar.death !== Infinity) {
        rep = persistCoh._h1CocycleAtScale(filt, (bar.birth + bar.death) / 2, bar);
      } else if (bar.dim === 1 && bar.death === Infinity) {
        rep = persistCoh._h1CocycleAtScale(filt, bar.birth * 1.001, bar);
      }
      enriched.push({
        dim: bar.dim, birth: bar.birth, death: bar.death,
        birthSimplex: bar.birthSimplex, deathSimplex: bar.deathSimplex,
        rep: rep
      });
    }
    return { bars: enriched };
  };

  // Build the Rips subcomplex at scale ε and return one H^1 cocycle rep.
  // For a bar with multiple H^1 generators alive at ε, the choice between
  // them is arbitrary but deterministic (first in the gauss-elim ordering).
  persistCoh._h1CocycleAtScale = function (filt, eps, bar) {
    var simplices = { 0: [], 1: [], 2: [] };
    for (var i = 0; i < filt.events.length; i++) {
      var ev = filt.events[i];
      if (ev.birth <= eps) {
        if (!simplices[ev.dim]) simplices[ev.dim] = [];
        simplices[ev.dim].push(ev.simplex);
      }
    }
    var vertSet = {};
    for (var i = 0; i < simplices[0].length; i++) vertSet[simplices[0][i][0]] = true;
    var cpx = { vertices: Object.keys(vertSet).map(Number), simplices: simplices };
    var h1 = cohomology.compute(cpx, 1);
    if (h1.basis.length === 0) return null;
    return { edges: simplices[1], cocycle: h1.basis[0] };
  };

  // Circular coordinates from a 1-cocycle (de Silva–Vejdemo-Johansson 2011,
  // simplified). Take the Z/2 cocycle ω, lift to ±1 on the canonical
  // orientation, and solve the harmonic least-squares problem
  //     minimize ||δθ − ω̃||²
  // i.e. the graph-Laplacian equation L θ = δ^T ω̃, pinning θ[0] = 0.
  // The result, taken mod 1, is the circular coordinate.
  persistCoh.circularCoords = function (points, filtration, rep) {
    var n = points.length;
    var angles = new Float64Array(n);
    if (!rep || !rep.edges || !rep.cocycle) return angles;
    var edges = rep.edges;

    // Build L (n × n) and the right-hand side δ^T ω̃ (length n).
    var L = [];
    for (var i = 0; i < n; i++) L[i] = new Float64Array(n);
    var rhs = new Float64Array(n);
    for (var e = 0; e < edges.length; e++) {
      var i = edges[e][0], j = edges[e][1];
      var w = rep.cocycle[e] ? 1 : 0;
      L[i][i] += 1; L[j][j] += 1;
      L[i][j] -= 1; L[j][i] -= 1;
      // Canonical edge orientation i < j; δθ on this edge = θ(j) − θ(i).
      // δ^T ω̃ at v = (sum of ω̃ on edges ending at v) − (sum on edges starting at v).
      rhs[i] -= w;
      rhs[j] += w;
    }

    // Solve L θ = rhs with θ[0] = 0. L is singular (kernel = constants), so
    // remove row 0 and column 0 and solve the (n−1)×(n−1) reduced system.
    // For demo sizes (≤200 points) plain Gaussian elimination is fine.
    var m = n - 1;
    var A = [];
    var b = new Float64Array(m);
    for (var i = 0; i < m; i++) {
      A[i] = new Float64Array(m + 1);
      for (var j = 0; j < m; j++) A[i][j] = L[i + 1][j + 1];
      A[i][m] = rhs[i + 1];
    }
    // Partial-pivoting Gauss-Jordan.
    for (var col = 0; col < m; col++) {
      var pivot = col;
      for (var r = col + 1; r < m; r++) {
        if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
      }
      if (Math.abs(A[pivot][col]) < 1e-12) continue;  // degenerate; skip
      if (pivot !== col) { var tmp = A[col]; A[col] = A[pivot]; A[pivot] = tmp; }
      var diag = A[col][col];
      for (var c = col; c <= m; c++) A[col][c] /= diag;
      for (var r = 0; r < m; r++) {
        if (r === col) continue;
        var factor = A[r][col];
        if (factor === 0) continue;
        for (var c = col; c <= m; c++) A[r][c] -= factor * A[col][c];
      }
    }
    var theta = new Float64Array(n);
    theta[0] = 0;
    for (var i = 0; i < m; i++) theta[i + 1] = A[i][m];

    // Map θ to [0, 2π) by its fractional part (the lift adds an integer
    // around each fundamental cycle; we want the angle on S¹).
    for (var i = 0; i < n; i++) {
      var t = theta[i] - Math.floor(theta[i]);
      angles[i] = 2 * Math.PI * t;
    }
    return angles;
  };

  // ─────────────────────────────────────────── COH.fmt ──

  var fmt = {};

  fmt.cochain = function (complex, k, c) {
    var sims = complex.simplices[k] || [];
    var parts = [];
    for (var i = 0; i < sims.length; i++) {
      if (c[i]) parts.push('[' + sims[i].join(',') + ']');
    }
    return parts.length ? parts.join(' + ') : '0';
  };

  fmt.ringElement = function (coeffs, basisNames) {
    var parts = [];
    for (var i = 0; i < coeffs.length; i++) {
      if (coeffs[i]) parts.push(basisNames[i] || ('e_' + i));
    }
    return parts.length ? parts.join(' + ') : '0';
  };

  // ─────────────────────────────────────────── sanity checks ──

  function runChecks() {
    var ok = true;

    function check(name, got, want) {
      var eq = JSON.stringify(got) === JSON.stringify(want);
      if (!eq) {
        console.error('COH check FAIL:', name, 'got', got, 'want', want);
        ok = false;
      }
      return eq;
    }

    // H^* of canonical surfaces (Z/2).
    var s2 = tri.s2();
    check('H^*(S^2; Z/2) betti', [
      cohomology.compute(s2, 0).betti,
      cohomology.compute(s2, 1).betti,
      cohomology.compute(s2, 2).betti
    ], [1, 0, 1]);

    var t2 = tri.torus7();
    check('H^*(T^2; Z/2) betti', [
      cohomology.compute(t2, 0).betti,
      cohomology.compute(t2, 1).betti,
      cohomology.compute(t2, 2).betti
    ], [1, 2, 1]);

    var rp2 = tri.rp2();
    check('H^*(RP^2; Z/2) betti', [
      cohomology.compute(rp2, 0).betti,
      cohomology.compute(rp2, 1).betti,
      cohomology.compute(rp2, 2).betti
    ], [1, 1, 1]);

    var klein = tri.klein();
    check('H^*(Klein; Z/2) betti', [
      cohomology.compute(klein, 0).betti,
      cohomology.compute(klein, 1).betti,
      cohomology.compute(klein, 2).betti
    ], [1, 2, 1]);

    var wedge = tri.wedgeS1S1S2();
    check('H^*(S^1∨S^1∨S^2; Z/2) betti', [
      cohomology.compute(wedge, 0).betti,
      cohomology.compute(wedge, 1).betti,
      cohomology.compute(wedge, 2).betti
    ], [1, 2, 1]);

    // The annulus has β = (1, 1, 0).
    var ann = tri.annulus(8, 16);
    check('H^*(annulus; Z/2) betti', [
      cohomology.compute(ann, 0).betti,
      cohomology.compute(ann, 1).betti,
      cohomology.compute(ann, 2).betti
    ], [1, 1, 0]);

    // δ ∘ δ = 0 on the torus.
    var d0 = coboundary.matrix(t2, 0);
    var d1 = coboundary.matrix(t2, 1);
    if (d0.matrix.length > 0 && d1.matrix.length > 0) {
      // d1 ∘ d0: shape (n_2 × n_0). For each 2-simplex row and each 0-simplex col,
      // sum over 1-simplices in between.
      var n2 = d1.matrix.length;
      var n1 = d1.matrix[0].length;
      var n0 = d0.matrix[0].length;
      var zero = true;
      for (var r = 0; r < n2; r++) {
        for (var c = 0; c < n0; c++) {
          var s = 0;
          for (var m = 0; m < n1; m++) s ^= (d1.matrix[r][m] & d0.matrix[m][c]);
          if (s) { zero = false; break; }
        }
        if (!zero) break;
      }
      if (!zero) { console.error('COH check FAIL: δ∘δ ≠ 0 on T^2'); ok = false; }
    }

    // Cup product on RP^2: α ∪ α should be the generator of H^2.
    var h1 = cohomology.compute(rp2, 1);
    var h2 = cohomology.compute(rp2, 2);
    if (h1.basis.length === 1 && h2.basis.length === 1) {
      var alpha = h1.basis[0];
      var aa = cup.product(rp2, alpha, alpha, 1, 1);
      // Reduce aa mod im δ_1 to see if it's nonzero in H^2.
      var aaCoeffs = cup._expressInBasis(rp2, 2, aa, h2.basis);
      check('α ∪ α generates H^2(RP^2; Z/2)', aaCoeffs[0], 1);
    } else {
      console.warn('COH: RP^2 basis sizes unexpected', h1.basis.length, h2.basis.length);
    }

    // On the wedge S^1∨S^1∨S^2: any two H^1 classes cup to zero.
    var h1w = cohomology.compute(wedge, 1);
    var h2w = cohomology.compute(wedge, 2);
    if (h1w.basis.length === 2 && h2w.basis.length === 1) {
      var ab = cup.product(wedge, h1w.basis[0], h1w.basis[1], 1, 1);
      var abCoeffs = cup._expressInBasis(wedge, 2, ab, h2w.basis);
      check('α ∪ β = 0 on S^1∨S^1∨S^2', abCoeffs[0], 0);
    }

    // Klein-vs-torus distinguisher: Klein has α with α∪α ≠ 0 in H^2(Z/2);
    // torus has every α∪α = 0. (Both have β = (1,2,1) so the betti check
    // above does not separate them.)
    var h1k = cohomology.compute(klein, 1);
    var h2k = cohomology.compute(klein, 2);
    if (h1k.basis.length === 2 && h2k.basis.length === 1) {
      var foundSquared = 0;
      for (var i = 0; i < 2; i++) {
        var aa_k = cup.product(klein, h1k.basis[i], h1k.basis[i], 1, 1);
        var aaC = cup._expressInBasis(klein, 2, aa_k, h2k.basis);
        if (aaC[0]) foundSquared++;
      }
      check('Klein has ≥1 H^1 generator with α∪α ≠ 0', foundSquared >= 1, true);
    }
    var h1t = cohomology.compute(t2, 1);
    var h2t = cohomology.compute(t2, 2);
    if (h1t.basis.length === 2 && h2t.basis.length === 1) {
      var allZero = true;
      for (var i = 0; i < 2; i++) {
        var aa_t = cup.product(t2, h1t.basis[i], h1t.basis[i], 1, 1);
        var aaC = cup._expressInBasis(t2, 2, aa_t, h2t.basis);
        if (aaC[0]) allZero = false;
      }
      check('Torus has α∪α = 0 for both H^1 generators', allZero, true);
    }

    // de Rham: an exact 1-form on the sphere has dω = 0 everywhere (Stokes
    // on a triangle).
    var mesh = deRham.sphereMesh(1);
    var dfz = deRham.oneForm(mesh, 'df_z');
    var ddfz = deRham.d(mesh, dfz);
    var maxAbs = 0;
    for (var i = 0; i < ddfz.length; i++) {
      if (Math.abs(ddfz[i]) > maxAbs) maxAbs = Math.abs(ddfz[i]);
    }
    if (maxAbs > 1e-9) {
      console.error('COH check FAIL: d(df_z) should be 0, got max', maxAbs);
      ok = false;
    }

    if (ok) console.log('COH: all sanity checks passed');
  }

  // ─────────────────────────────────────────── publish ──

  global.COH = {
    tri: tri,
    cochain: cochain,
    coboundary: coboundary,
    cohomology: cohomology,
    cup: cup,
    deRham: deRham,
    mv: mv,
    persistCoh: persistCoh,
    fmt: fmt,
    _runChecks: runChecks,
    _version: '0.1.0'
  };

  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
