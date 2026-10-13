// 06-lattice.js — the lattice recipe in two, three and four dimensions, for Foam part 6.
// No dependencies; runs in the browser (window.FoamLattice) and in node (require).
//
// A lattice is given by basis vectors (rows, in any ambient space). Its Voronoi cell is
// the set of points nearer to the origin than to any other lattice point: the
// intersection of the half-spaces m.x <= |m|^2 / 2 over lattice vectors m. Only a few
// m matter (the "relevant" ones, at most 2(2^n - 1)); the cell's corners are found by
// solving every n of those planes at once and keeping the solutions inside all of them.
// Faces of every dimension, and their lengths, areas and volumes, come from which
// planes each corner lies on.
//
// Public API:
//   voronoi(basis)      -> { n, det, verts, planes:[{m, d, verts, contact}], minDist, kissing,
//                            volume, area, cost, density, f:[#corners, #edges, ...], ok }
//                          cost = boundary / volume^((n-1)/n); density of the ball packing
//   bases.square/triangular/rhombic(theta)          2D, theta in radians
//   bases.sc/bcc/fcc/rhombohedral(alpha)            3D, alpha in radians
//   bases.z4/d4/d4dual/a4/a4dual, bases.anDual(n)   4D (anDual(3) is BCC)
//   cellInFrame(basis)  -> voronoi(basis) with corners and wall normals expressed in the
//                          coordinates the (square) basis was given in
//   faces3(cell)        -> [{pts, contact}] face loops of a 3D cell, counterclockwise from outside
//   edgesOf(cell)       -> [[i, j], ...] corner pairs joined by an edge
//   facesOfDim(cell, k) -> [[corner indices], ...] all k-dimensional faces
//   dihedral(cell)      -> [degrees, ...] distinct angles between neighbouring walls
//   leftQuat(q)         -> 4x4 matrix of x -> q x (a double rotation of 4-space), apply(M, v)
//   ballVolume(n)
//   junctions(cell)     -> [{dim, codim, count, cells, rays, links, angles, pairs}] one entry per
//                          kind of place where three or more cells of the foam meet: rays are
//                          unit directions (in the space across the junction) of the faces one
//                          dimension up that run into it, links the pairs of rays that bound a
//                          common face two dimensions up, angles the angle of each link in degrees
//   plateau(junction)   -> {ok, kind}: is this one of the junctions a soap film can rest in
//                          (three walls at 120 degrees; four lines at arccos(-1/3); in four
//                          dimensions, five lines toward a simplex's corners or sixteen toward a
//                          hypercube's)
//   moments(cell)       -> {coverRadius, thickness, G}: the farthest corner, the density of the
//                          covering by balls of that radius, and the dimensionless second moment
//   rng(seed), strain(n, rand), deform(basis, S, eps)   seeded random volume-preserving
//                          deformations: basis rows b -> b (I + eps S), S symmetric, trace 0, norm 1
//   runChecks()         -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var EPS = 1e-9;

  function dot(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
  function sub(a, b) { return a.map(function (x, i) { return x - b[i]; }); }
  function axpy(a, k, b) { return a.map(function (x, i) { return x + k * b[i]; }); }
  function len(a) { return Math.sqrt(dot(a, a)); }

  // Solve M x = d by elimination with partial pivoting; null when the rows are dependent.
  // The work is done in one reused buffer (rows swapped by offset): the corner search
  // calls this tens of thousands of times for a four-dimensional cell.
  var SOLVE_W = new Float64Array(64), SOLVE_ROW = [0, 0, 0, 0, 0, 0, 0];
  function solve(M, d) {
    var n = d.length, w = n + 1, W = SOLVE_W, ROW = SOLVE_ROW, i, j, k, r;
    if (n > 7) throw new Error('solve: at most 7 unknowns');
    for (i = 0; i < n; i++) { r = M[i]; ROW[i] = i * w; for (j = 0; j < n; j++) W[i * w + j] = r[j]; W[i * w + n] = d[i]; }
    for (i = 0; i < n; i++) {
      var p = i;
      for (k = i + 1; k < n; k++) if (Math.abs(W[ROW[k] + i]) > Math.abs(W[ROW[p] + i])) p = k;
      if (Math.abs(W[ROW[p] + i]) < 1e-10) return null;
      var t = ROW[i]; ROW[i] = ROW[p]; ROW[p] = t;
      var ri = ROW[i], piv = W[ri + i];
      for (k = i + 1; k < n; k++) {
        var rk = ROW[k], f = W[rk + i] / piv;
        if (f) for (j = i; j <= n; j++) W[rk + j] -= f * W[ri + j];
      }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) {
      var rb = ROW[i], s = W[rb + n];
      for (j = i + 1; j < n; j++) s -= W[rb + j] * x[j];
      x[i] = s / W[rb + i];
    }
    return x;
  }

  // Basis rows in any ambient space -> lower-triangular rows in R^n with the same Gram matrix.
  function squareBasis(B) {
    var n = B.length, L = [], i, j, k;
    for (i = 0; i < n; i++) {
      L.push(new Array(n).fill(0));
      for (j = 0; j <= i; j++) {
        var s = dot(B[i], B[j]);
        for (k = 0; k < j; k++) s -= L[i][k] * L[j][k];
        L[i][j] = i === j ? Math.sqrt(Math.max(s, 0)) : s / L[j][j];
      }
    }
    return L;
  }

  function ballVolume(n) { return n === 2 ? Math.PI : n === 3 ? 4 * Math.PI / 3 : n === 4 ? Math.PI * Math.PI / 2 : NaN; }

  // Orthonormal basis of the directions spanned by the points of S (relative to S[0]).
  function spanOf(pts) {
    var basis = [];
    for (var i = 1; i < pts.length; i++) {
      var v = sub(pts[i], pts[0]);
      for (var b = 0; b < basis.length; b++) v = axpy(v, -dot(v, basis[b]), basis[b]);
      var L = len(v);
      if (L > 1e-7) basis.push(v.map(function (x) { return x / L; }));
    }
    return basis;
  }
  function distToSpan(p, origin, basis) {
    var v = sub(p, origin);
    for (var b = 0; b < basis.length; b++) v = axpy(v, -dot(v, basis[b]), basis[b]);
    return len(v);
  }

  function voronoi(basisIn, opts) {
    opts = opts || {};
    var B = squareBasis(basisIn), n = B.length, R = opts.range || (n === 4 ? 2 : 3), i, j;
    var det = 1; for (i = 0; i < n; i++) det *= B[i][i];

    // Lattice vectors with coefficients in [-R, R].
    var cand = [], c = new Array(n).fill(-R);
    for (;;) {
      var v = new Array(n).fill(0), zero = true;
      for (i = 0; i < n; i++) if (c[i]) { zero = false; v = axpy(v, c[i], B[i]); }
      if (!zero) cand.push({ m: v, q: dot(v, v) });
      for (i = 0; i < n && ++c[i] > R; i++) c[i] = -R;
      if (i === n) break;
    }
    cand.sort(function (a, b) { return a.q - b.q; });
    var minQ = cand[0].q, tol = EPS * minQ;

    // m is relevant exactly when m/2 is strictly nearer to 0 and m than to every other
    // lattice point (Voronoi): |v|^2 > m.v for all lattice v other than 0 and m.
    var planes = [];
    cand.forEach(function (a) {
      for (var k = 0; k < cand.length; k++) {
        var b = cand[k];
        if (b === a) continue;
        if (b.q - dot(a.m, b.m) <= 1e-7 * minQ) return;
      }
      planes.push({ m: a.m, d: a.q / 2, verts: [], contact: a.q < minQ * (1 + 1e-7) });
    });

    // Corners: every n planes that meet in one point lying inside all the others. A corner
    // lies on exactly the planes that produced it (from every such choice of n), and two
    // solutions are one corner only when they agree to nine digits, so a cell with a very
    // short edge (a lattice a hair away from a special one) keeps that edge's two ends apart.
    var verts = [], onPlane = [], pick = [], rowsM = new Array(n), rowsD = new Array(n);
    var slack = 1e-9 * minQ, same = 1e-9 * Math.sqrt(minQ);
    function tryCorner() {
      var q, k, vi;
      for (q = 0; q < n; q++) { rowsM[q] = planes[pick[q]].m; rowsD[q] = planes[pick[q]].d; }
      var x = solve(rowsM, rowsD);
      if (!x) return;
      for (k = 0; k < planes.length; k++) if (dot(planes[k].m, x) - planes[k].d > slack) return;
      search: for (vi = 0; vi < verts.length; vi++) {
        for (q = 0; q < n; q++) if (Math.abs(verts[vi][q] - x[q]) > same) continue search;
        break;
      }
      if (vi === verts.length) { verts.push(x); onPlane.push({}); }
      for (q = 0; q < n; q++) onPlane[vi][pick[q]] = true;
    }
    (function choose(start, depth) {
      if (depth === n) { tryCorner(); return; }
      for (var k = start; k < planes.length; k++) { pick[depth] = k; choose(k + 1, depth + 1); }
    })(0, 0);
    verts.forEach(function (x, vi) {
      planes.forEach(function (p, pi) { if (onPlane[vi][pi]) p.verts.push(vi); });
    });
    planes = planes.filter(function (p) { return p.verts.length >= n; });

    // Faces of every dimension, with their k-dimensional measure, by cutting a face
    // with each plane in turn. A k-face's measure is the sum over its (k-1)-faces of
    // (distance from an inside point to that face) * (its measure) / k.
    var memo = {}, byDim = [];
    for (i = 0; i <= n; i++) byDim.push([]);
    function measure(S, k) {
      var key = S.join(',');
      if (memo[key] != null) return memo[key];
      byDim[k].push(S);
      var val;
      if (k === 0) val = 1;
      else if (k === 1) val = len(sub(verts[S[0]], verts[S[S.length - 1]]));
      else {
        var cen = new Array(n).fill(0);
        S.forEach(function (vi) { cen = axpy(cen, 1 / S.length, verts[vi]); });
        var inS = {}; S.forEach(function (vi) { inS[vi] = true; });
        var subs = {}; val = 0;
        planes.forEach(function (p) {
          var T = p.verts.filter(function (vi) { return inS[vi]; });
          if (T.length < k || T.length === S.length) return;
          var tk = T.join(',');
          if (subs[tk]) return;
          var pts = T.map(function (vi) { return verts[vi]; }), sp = spanOf(pts);
          if (sp.length !== k - 1) return;
          subs[tk] = true;
          val += distToSpan(cen, pts[0], sp) * measure(T, k - 1) / k;
        });
      }
      memo[key] = val;
      return val;
    }
    var all = verts.map(function (_, vi) { return vi; });
    var volume = measure(all, n), area = 0;
    planes.forEach(function (p) { area += memo[p.verts.join(',')]; });
    verts.forEach(function (_, vi) { measure([vi], 0); });

    var minDist = Math.sqrt(minQ), kissing = 0;
    cand.forEach(function (a) { if (a.q < minQ * (1 + 1e-7)) kissing++; });
    return {
      n: n, basis: B, det: det, verts: verts, planes: planes, faces: byDim,
      f: byDim.slice(0, n).map(function (list) { return list.length; }),
      minDist: minDist, kissing: kissing, volume: volume, area: area,
      cost: area / Math.pow(volume, (n - 1) / n),
      density: ballVolume(n) * Math.pow(minDist / 2, n) / det,
      // The cell must hold exactly one lattice point's share of space.
      ok: Math.abs(volume - det) < 1e-6 * det
    };
  }

  function facesOfDim(cell, k) { return cell.faces[k]; }
  function edgesOf(cell) { return cell.faces[1].map(function (S) { return [S[0], S[S.length - 1]]; }); }

  // Face loops of a 3D cell, counterclockwise seen from outside.
  function faces3(cell) {
    function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    return cell.planes.map(function (p) {
      var pts = p.verts.map(function (vi) { return cell.verts[vi]; }), L = len(p.m);
      var nn = p.m.map(function (x) { return x / L; }), cen = [0, 0, 0];
      pts.forEach(function (q) { cen = axpy(cen, 1 / pts.length, q); });
      var ref = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], u = cross(nn, ref), ul = len(u);
      u = u.map(function (x) { return x / ul; });
      var w = cross(nn, u);
      pts.sort(function (a, b) {
        var da = sub(a, cen), db = sub(b, cen);
        return Math.atan2(dot(da, w), dot(da, u)) - Math.atan2(dot(db, w), dot(db, u));
      });
      return { pts: pts, contact: p.contact, m: p.m, center: p.m.map(function (x) { return x / 2; }) };
    });
  }

  // Angles between walls that share an (n-2)-face, in degrees, distinct values only.
  function dihedral(cell) {
    var ridges = {}, out = [];
    cell.faces[cell.n - 2].forEach(function (S) { ridges[S.join(',')] = []; });
    cell.planes.forEach(function (p, pi) {
      var has = {}; p.verts.forEach(function (vi) { has[vi] = true; });
      cell.faces[cell.n - 2].forEach(function (S) {
        if (S.every(function (vi) { return has[vi]; })) ridges[S.join(',')].push(pi);
      });
    });
    Object.keys(ridges).forEach(function (k) {
      var pr = ridges[k];
      if (pr.length !== 2) return;
      var a = cell.planes[pr[0]].m, b = cell.planes[pr[1]].m;
      var ang = 180 - Math.acos(dot(a, b) / (len(a) * len(b))) * 180 / Math.PI;
      if (!out.some(function (x) { return Math.abs(x - ang) < 1e-6; })) out.push(ang);
    });
    return out.sort(function (x, y) { return x - y; });
  }

  // ---- where cells meet ----
  // All lattice vectors with coefficients in [-R, R] on the given (square) basis, zero left out.
  function latticeVectors(B, R) {
    var n = B.length, out = [], c = new Array(n).fill(-R), i;
    for (;;) {
      var v = new Array(n).fill(0), zero = true;
      for (i = 0; i < n; i++) if (c[i]) { zero = false; v = axpy(v, c[i], B[i]); }
      if (!zero) out.push(v);
      for (i = 0; i < n && ++c[i] > R; i++) c[i] = -R;
      if (i === n) break;
    }
    return out;
  }
  function pointKey(p) { return p.map(function (t) { return Math.round(t * 1e6); }).join(','); }
  function centroid(pts) {
    var c = new Array(pts[0].length).fill(0);
    pts.forEach(function (p) { c = axpy(c, 1 / pts.length, p); });
    return c;
  }
  // An orthonormal basis of the directions perpendicular to the given orthonormal vectors.
  function complementOf(span, n) {
    var out = [];
    for (var a = 0; a < n && out.length < n - span.length; a++) {
      var v = new Array(n).fill(0); v[a] = 1;
      span.concat(out).forEach(function (u) { v = axpy(v, -dot(v, u), u); });
      var l = len(v);
      if (l > 1e-7) out.push(v.map(function (x) { return x / l; }));
    }
    return out;
  }
  function angleDeg(a, b) { return Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) * 180 / Math.PI; }

  // Every face of the cell of dimension n-2 or less is a place where three or more cells of
  // the foam meet. For each one: the cells that share it (lattice points equally near to all
  // its corners), the faces one dimension up that run into it (from every one of those
  // cells), as unit directions in the space across the junction, and which pairs of those
  // bound a common face two dimensions up. Junctions that look the same are counted once.
  function junctions(cell) {
    var n = cell.n, V = cell.verts, lat = latticeVectors(cell.basis, n === 4 ? 2 : 3), out = [], index = {};
    var zero = new Array(n).fill(0);
    function through(S, sKeys, cellsAt, k) {
      // translated copies of the cell's k-faces that contain the junction S
      var found = {};
      cellsAt.forEach(function (p) {
        cell.faces[k].forEach(function (F) {
          var pts = F.map(function (vi) { return axpy(V[vi], 1, p); }), has = {};
          pts.forEach(function (q) { has[pointKey(q)] = true; });
          if (!sKeys.every(function (key) { return has[key]; })) return;
          found[Object.keys(has).sort().join('|')] = { pts: pts, has: has };
        });
      });
      return Object.keys(found).sort().map(function (key) { return found[key]; });
    }
    for (var k = n - 2; k >= 0; k--) {
      cell.faces[k].forEach(function (S) {
        var pts = S.map(function (vi) { return V[vi]; }), sKeys = pts.map(pointKey);
        var cellsAt = [zero].concat(lat.filter(function (p) {
          var h = dot(p, p) / 2;
          return pts.every(function (v) { return Math.abs(dot(p, v) - h) < 1e-7; });
        }));
        var up1 = through(S, sKeys, cellsAt, k + 1), up2 = through(S, sKeys, cellsAt, k + 2);
        var across = complementOf(spanOf(pts), n), c0 = centroid(pts);
        var rays = up1.map(function (F) {
          var d = sub(centroid(F.pts), c0), r = across.map(function (u) { return dot(d, u); }), l = len(r);
          return r.map(function (x) { return x / l; });
        });
        var links = [];
        up2.forEach(function (G) {
          var pair = [];
          up1.forEach(function (F, fi) { if (Object.keys(F.has).every(function (key) { return G.has[key]; })) pair.push(fi); });
          if (pair.length === 2) links.push(pair);
        });
        var angles = links.map(function (l) { return angleDeg(rays[l[0]], rays[l[1]]); });
        var pairs = {};
        for (var i = 0; i < rays.length; i++) for (var j = i + 1; j < rays.length; j++) {
          var a = angleDeg(rays[i], rays[j]).toFixed(2);
          pairs[a] = (pairs[a] || 0) + 1;
        }
        var sig = [k, cellsAt.length, rays.length, angles.map(function (a) { return a.toFixed(4); }).sort().join(' '), JSON.stringify(Object.keys(pairs).sort().map(function (a) { return [a, pairs[a]]; }))].join(';');
        if (index[sig] == null) {
          index[sig] = out.length;
          out.push({ dim: k, codim: n - k, count: 0, cells: cellsAt.length, rays: rays, links: links, angles: angles, pairs: pairs });
        }
        out[index[sig]].count++;
      });
    }
    return out;
  }

  // Is a junction one a soap film can rest in? Across a junction of walls, three walls at
  // 120 degrees. Across a junction of those, four lines at arccos(-1/3), toward the corners
  // of a regular tetrahedron (Taylor 1976: in three dimensions nothing else is minimising).
  // One level further, in four dimensions, two arrangements are known to be minimising: five
  // lines toward the corners of a regular simplex, and sixteen toward the corners of a
  // hypercube (Brakke 1991). Anything else is reported as not passing.
  function plateau(j) {
    function all(target) { return j.angles.every(function (a) { return Math.abs(a - target) < 1e-6; }); }
    var deg = 180 / Math.PI;
    if (j.codim === 2) return { ok: j.rays.length === 3 && all(120), kind: 'three walls' };
    if (j.codim === 3) return { ok: j.rays.length === 4 && j.links.length === 6 && all(Math.acos(-1 / 3) * deg), kind: 'tetrahedron' };
    if (j.codim === 4) {
      if (j.rays.length === 5 && j.links.length === 10 && all(Math.acos(-1 / 4) * deg)) return { ok: true, kind: 'simplex' };
      var p = j.pairs;
      if (j.rays.length === 16 && j.cells === 8 && j.links.length === 32 && all(60) && p['60.00'] === 32 && p['90.00'] === 48 && p['120.00'] === 32 && p['180.00'] === 8) return { ok: true, kind: 'hypercube' };
    }
    return { ok: false, kind: null };
  }

  // ---- two more scores from the same cell ----
  // The covering score: blow the balls up until they reach the cell's farthest corner and
  // they cover space; thickness is ball volume over cell volume (1 would be no overlap).
  // The quantizer score G: the mean squared distance from a point of the cell to its
  // centre, per dimension, with the cell scaled to volume 1. Both come from cutting the
  // cell into simplices (cell centre, wall centre, ..., an edge's two ends), for which
  // the integral of |x|^2 is V (sum |v_i|^2 + |sum v_i|^2) / ((n+1)(n+2)).
  function detOf(M) {
    var n = M.length, A = M.map(function (r) { return r.slice(); }), d = 1, i, j, k;
    for (i = 0; i < n; i++) {
      var p = i;
      for (k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;
      if (Math.abs(A[p][i]) < 1e-14) return 0;
      if (p !== i) { var t = A[i]; A[i] = A[p]; A[p] = t; d = -d; }
      d *= A[i][i];
      for (k = i + 1; k < n; k++) { var f = A[k][i] / A[i][i]; for (j = i; j < n; j++) A[k][j] -= f * A[i][j]; }
    }
    return d;
  }
  function moments(cell) {
    var n = cell.n, V = cell.verts, vol = 0, m2 = 0, fac = 1, i;
    for (i = 2; i <= n; i++) fac *= i;
    (function walk(S, k, chain) {
      if (k === 1) {
        var P = chain.concat([V[S[0]], V[S[S.length - 1]]]), M = [], s1 = 0, sum = new Array(n).fill(0);
        for (var q = 1; q <= n; q++) M.push(sub(P[q], P[0]));
        var v = Math.abs(detOf(M)) / fac;
        P.forEach(function (p) { s1 += dot(p, p); sum = axpy(sum, 1, p); });
        vol += v; m2 += v * (s1 + dot(sum, sum)) / ((n + 1) * (n + 2));
        return;
      }
      var inS = {}; S.forEach(function (vi) { inS[vi] = true; });
      var c = centroid(S.map(function (vi) { return V[vi]; }));
      cell.faces[k - 1].forEach(function (T) {
        if (T.every(function (vi) { return inS[vi]; })) walk(T, k - 1, chain.concat([c]));
      });
    })(V.map(function (_, vi) { return vi; }), n, []);
    var R = 0; V.forEach(function (v) { R = Math.max(R, len(v)); });
    return { volume: vol, coverRadius: R, thickness: ballVolume(n) * Math.pow(R, n) / cell.det, G: m2 / n / Math.pow(vol, 1 + 2 / n) };
  }

  // ---- seeded random deformations ----
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // A random direction in the space of shape changes: a symmetric matrix with trace zero
  // (so volume is kept to first order) and unit norm, drawn evenly over all such matrices.
  function strain(n, rand) {
    var S = [], i, j, tr = 0, f = 0;
    function gauss() { return Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand()); }
    for (i = 0; i < n; i++) S.push(new Array(n).fill(0));
    for (i = 0; i < n; i++) for (j = i; j < n; j++) S[i][j] = S[j][i] = gauss() * (i === j ? 1 : Math.SQRT1_2);
    for (i = 0; i < n; i++) tr += S[i][i];
    for (i = 0; i < n; i++) S[i][i] -= tr / n;
    S.forEach(function (row) { row.forEach(function (x) { f += x * x; }); });
    f = Math.sqrt(f);
    return S.map(function (row) { return row.map(function (x) { return x / f; }); });
  }
  // Every lattice point x moves to x (I + eps S). The basis must be square.
  function deform(B, S, eps) {
    return B.map(function (b) {
      return b.map(function (_, j) { var s = b[j]; for (var k = 0; k < b.length; k++) s += eps * b[k] * S[k][j]; return s; });
    });
  }

  // ---- lattices ----
  var bases = {
    square: function () { return [[1, 0], [0, 1]]; },
    triangular: function () { return bases.rhombic(Math.PI / 3); },
    // Two unit vectors at angle theta: 90 degrees is the square lattice, 60 the triangular.
    rhombic: function (theta) { return [[1, 0], [Math.cos(theta), Math.sin(theta)]]; },
    sc: function () { return [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; },
    bcc: function () { return [[1, 1, -1], [1, -1, 1], [-1, 1, 1]]; },
    fcc: function () { return [[1, 1, 0], [1, 0, 1], [0, 1, 1]]; },
    // Three unit vectors with every pair at angle alpha, placed evenly round the z axis:
    // a cube stretched or squashed along its body diagonal. 60 degrees is FCC,
    // 90 simple cubic, arccos(-1/3) = 109.47 BCC.
    rhombohedral: function (alpha) {
      var c = Math.cos(alpha), s = Math.sqrt(2 * (1 - c) / 3), h = Math.sqrt(Math.max(0, (1 + 2 * c) / 3)), out = [];
      for (var k = 0; k < 3; k++) out.push([s * Math.cos(2 * Math.PI * k / 3), s * Math.sin(2 * Math.PI * k / 3), h]);
      return out;
    },
    z4: function () { return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]; },
    // D4, the checkerboard lattice: integer points whose coordinates sum to an even number.
    d4: function () { return [[1, 1, 0, 0], [1, -1, 0, 0], [0, 1, -1, 0], [0, 0, 1, -1]]; },
    // A4: integer points of 5-space with coordinate sum zero. A4* is its dual, the
    // four-dimensional relative of BCC (its cell is the 4D permutohedron).
    a4: function () { return [[1, -1, 0, 0, 0], [0, 1, -1, 0, 0], [0, 0, 1, -1, 0], [0, 0, 0, 1, -1]]; },
    a4dual: function () { return bases.anDual(4); },
    // A_n*: the n+1 unit vectors of (n+1)-space pushed onto the plane where coordinates
    // sum to zero; any n of them are a basis. n = 3 gives BCC.
    anDual: function (n) {
      var out = [];
      for (var i = 0; i < n; i++) { var v = new Array(n + 1).fill(-1 / (n + 1)); v[i] += 1; out.push(v); }
      return out;
    },
    // Cube corners plus cube centres in 4D (the dual of D4).
    d4dual: function () { return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0.5, 0.5, 0.5, 0.5]]; }
  };

  // ---- four-dimensional rotation ----
  // Left multiplication by a unit quaternion q = (a, b, c, d) acting on x = (x0, x1, x2, x3):
  // a rotation of 4-space that turns two perpendicular planes by the same angle at once.
  function leftQuat(q) {
    var a = q[0], b = q[1], c = q[2], d = q[3];
    return [[a, -b, -c, -d], [b, a, -d, c], [c, d, a, -b], [d, -c, b, a]];
  }
  function apply(M, v) { return M.map(function (row) { return dot(row, v); }); }

  // ---- checks against closed forms and counts ----
  function runChecks() {
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: String(detail) }); }
    function near(name, got, want, tol) { ok(name, Math.abs(got - want) < (tol || 1e-9), got + ' vs ' + want); }
    var deg = Math.PI / 180;

    // 2D
    var sq = voronoi(bases.square()), tri = voronoi(bases.triangular());
    near('square lattice: perimeter 4, area 1', sq.cost, 4);
    near('square lattice density pi/4', sq.density, Math.PI / 4);
    ok('triangular lattice cell is a hexagon', tri.f[0] === 6 && tri.f[1] === 6, tri.f.join(' '));
    near('triangular lattice half-perimeter cost 1.8612', tri.cost / 2, 3 / Math.sqrt(3 * Math.sqrt(3) / 2));
    near('triangular lattice density pi/sqrt(12)', tri.density, Math.PI / Math.sqrt(12));

    // 3D, against closed forms (the same values cells.js reaches by clipping)
    var sc = voronoi(bases.sc()), bcc = voronoi(bases.bcc()), fcc = voronoi(bases.fcc());
    near('simple cubic cost 6', sc.cost, 6);
    near('simple cubic density pi/6', sc.density, Math.PI / 6);
    near('BCC cost (6 + 12 sqrt 3)/(8 sqrt 2)^(2/3)', bcc.cost, (6 + 12 * Math.sqrt(3)) / Math.pow(8 * Math.sqrt(2), 2 / 3));
    near('BCC density pi sqrt(3)/8', bcc.density, Math.PI * Math.sqrt(3) / 8);
    ok('BCC cell: 24 corners, 36 edges, 14 faces, 8 touching', bcc.f.join(',') === '24,36,14' && bcc.kissing === 8, bcc.f.join(',') + ' kissing ' + bcc.kissing);
    near('FCC cost 3 * 2^(5/6)', fcc.cost, 3 * Math.pow(2, 5 / 6));
    near('FCC density pi/sqrt(18)', fcc.density, Math.PI / Math.sqrt(18));
    ok('FCC cell: 14 corners, 24 edges, 12 faces, 12 touching', fcc.f.join(',') === '14,24,12' && fcc.kissing === 12, fcc.f.join(',') + ' kissing ' + fcc.kissing);
    ok('FCC walls all meet at 120 degrees', dihedral(fcc).length === 1 && Math.abs(dihedral(fcc)[0] - 120) < 1e-9, dihedral(fcc).join(' '));
    var dk = dihedral(bcc);
    ok('BCC walls meet at 109.47 and 125.26 degrees', dk.length === 2 && Math.abs(dk[0] - Math.acos(-1 / 3) / deg) < 1e-9 && Math.abs(dk[1] - Math.acos(-1 / Math.sqrt(3)) / deg) < 1e-9, dk.join(' '));

    // The rhombohedral family passes through all three.
    var r60 = voronoi(bases.rhombohedral(60 * deg)), r90 = voronoi(bases.rhombohedral(90 * deg)), rb = voronoi(bases.rhombohedral(Math.acos(-1 / 3)));
    near('rhombohedral 60 degrees is FCC', r60.cost, fcc.cost);
    near('rhombohedral 90 degrees is simple cubic', r90.cost, 6);
    near('rhombohedral arccos(-1/3) is BCC', rb.cost, bcc.cost);
    near('rhombohedral BCC density', rb.density, bcc.density);
    var allOk = true, worst = 0;
    for (var a = 46; a <= 116; a += 0.5) {
      var cellA = voronoi(bases.rhombohedral(a * deg));
      worst = Math.max(worst, Math.abs(cellA.volume / cellA.det - 1));
      if (!cellA.ok) allOk = false;
    }
    ok('rhombohedral cells from 46 to 116 degrees all have volume = det', allOk, 'worst relative gap ' + worst.toExponential(2));
    var allOk2 = true;
    for (var th = 40; th <= 95; th += 0.5) if (!voronoi(bases.rhombic(th * deg)).ok) allOk2 = false;
    ok('rhombic cells from 40 to 95 degrees all have area = det', allOk2, '');

    // A second, independent count for cells.js-style verification when it is loaded.
    var FC = global.FoamCells || (typeof require === 'function' ? (function () { try { return require('./cells.js'); } catch (e) { return null; } })() : null);
    if (FC) {
      near('agrees with cells.js on FCC', fcc.cost, FC.foam(FC.sites.fcc()).s, 1e-9);
      near('agrees with cells.js on BCC', bcc.cost, FC.foam(FC.sites.bcc()).s, 1e-9);
    }

    // 4D
    var z4 = voronoi(bases.z4()), d4 = voronoi(bases.d4()), a4 = voronoi(bases.a4()), a4d = voronoi(bases.a4dual());
    near('4D cube cost 8', z4.cost, 8);
    near('4D cube density pi^2/32', z4.density, Math.PI * Math.PI / 32);
    ok('4D cube: 16 corners, 32 edges, 24 squares, 8 cubes', z4.f.join(',') === '16,32,24,8', z4.f.join(','));
    ok('D4 cell: 24 corners, 96 edges, 96 triangles, 24 walls', d4.f.join(',') === '24,96,96,24', d4.f.join(','));
    ok('D4 cell volume equals det = 2', d4.ok && Math.abs(d4.volume - 2) < 1e-9, d4.volume);
    near('D4 cell boundary 8 sqrt 2', d4.area, 8 * Math.SQRT2);
    near('D4 cost 8 / 2^(1/4)', d4.cost, 8 / Math.pow(2, 0.25));
    near('D4 density pi^2/16', d4.density, Math.PI * Math.PI / 16);
    ok('D4 kissing number 24', d4.kissing === 24, d4.kissing);
    ok('D4 walls are octahedra (6 corners, 12 edges, 8 triangles each)', d4.planes.every(function (p) {
      var has = {}; p.verts.forEach(function (vi) { has[vi] = true; });
      function inside(S) { return S.every(function (vi) { return has[vi]; }); }
      return p.verts.length === 6 && d4.faces[1].filter(inside).length === 12 && d4.faces[2].filter(inside).length === 8;
    }), '');
    var dd = dihedral(d4);
    ok('D4 walls all meet at 120 degrees', dd.length === 1 && Math.abs(dd[0] - 120) < 1e-9, dd.join(' '));
    var rs = d4.verts.map(len), es = d4.faces[1].map(function (S) { return len(sub(d4.verts[S[0]], d4.verts[S[1]])); });
    ok('D4 cell corners all at distance 1, edges all length 1', Math.max.apply(null, rs) - Math.min.apply(null, rs) < 1e-9 && Math.max.apply(null, es) - Math.min.apply(null, es) < 1e-9 && Math.abs(es[0] - 1) < 1e-9, rs[0] + ' ' + es[0]);
    // counts again straight from the corner set: edges are pairs at the least distance,
    // triangles are triples of mutually joined corners
    var E = 0, T = 0, adj = d4.verts.map(function () { return {}; });
    d4.verts.forEach(function (p, i) { d4.verts.forEach(function (q, j) { if (i < j && Math.abs(len(sub(p, q)) - 1) < 1e-9) { E++; adj[i][j] = adj[j][i] = true; } }); });
    for (var i = 0; i < 24; i++) for (var j = i + 1; j < 24; j++) if (adj[i][j]) for (var k = j + 1; k < 24; k++) if (adj[i][k] && adj[j][k]) T++;
    ok('D4 cell from the corner set alone: 96 edges, 96 triangles', E === 96 && T === 96, E + ' ' + T);
    ok('Euler: 24 - 96 + 96 - 24 = 0', d4.f[0] - d4.f[1] + d4.f[2] - d4.f[3] === 0, '');

    // Self-dual: the 24 nearest neighbours (wall normals) are the cell's corners turned and scaled by sqrt 2.
    var keyOf = function (v) { return v.map(function (t) { return Math.round(t * 1e6); }).join(','); };
    var Sm = [[1, 1, 0, 0], [1, -1, 0, 0], [0, 0, 1, 1], [0, 0, 1, -1]];
    var d4i = cellInFrame(bases.d4());
    var nset = {}; d4i.planes.forEach(function (p) { nset[keyOf(p.m)] = true; });
    ok('self-dual: a similarity carries the 24 corners onto the 24 neighbours', d4i.verts.every(function (v) { return nset[keyOf(apply(Sm, v))]; }), '');
    // The 60-degree double rotation by (1+i+j+k)/2 maps the corner set to itself, caps onto cube corners.
    var W = leftQuat([0.5, 0.5, 0.5, 0.5]), vset = {};
    d4i.verts.forEach(function (v) { vset[keyOf(v)] = true; });
    var caps = d4i.verts.filter(function (v) { return v.some(function (t) { return Math.abs(Math.abs(t) - 1) < 1e-9; }); });
    ok('8 cap corners and 16 cube corners', caps.length === 8, caps.length);
    ok('the double rotation by 60 degrees keeps the corner set and sends every cap to a cube corner',
      d4i.verts.every(function (v) { return vset[keyOf(apply(W, v))]; }) &&
      caps.every(function (v) { return Math.abs(Math.abs(apply(W, v)[0]) - 0.5) < 1e-9; }), '');

    ok('A4* cell is the 4D permutohedron: 120 corners, 240 edges, 150 faces, 30 walls', a4d.f.join(',') === '120,240,150,30' && a4d.ok, a4d.f.join(','));
    // closed form: perms of (1..5): volume 125 sqrt 5, boundary 10*32 + 20*3 sqrt 6
    near('A4* cost matches the permutohedron closed form', a4d.cost, (320 + 60 * Math.sqrt(6)) / Math.pow(125 * Math.sqrt(5), 0.75), 1e-9);
    ok('A4 cell: 30 corners, 20 walls, volume = det', a4.f[0] === 30 && a4.f[3] === 20 && a4.ok, a4.f.join(','));
    ok('in 4D, D4 has both the highest density and the lowest cost of Z4, A4, A4*, D4',
      d4.density > Math.max(z4.density, a4.density, a4d.density) && d4.cost < Math.min(z4.cost, a4.cost, a4d.cost),
      'density ' + [z4, a4, a4d, d4].map(function (c) { return c.density.toFixed(4); }).join(' ') + '; cost ' + [z4, a4, a4d, d4].map(function (c) { return c.cost.toFixed(4); }).join(' '));
    // D4* (cube corners plus centres) is D4 turned and scaled: Sm sends its basis into D4 and the volumes match.
    var d4s = voronoi(bases.d4dual());
    ok('centred hypercubic lattice is D4 up to a similarity', bases.d4dual().every(function (v) {
      var w = apply(Sm, v), sum = 0;
      return w.every(function (t) { sum += t; return Math.abs(t - Math.round(t)) < 1e-12; }) && Math.round(sum) % 2 === 0;
    }) && Math.abs(d4s.det * 4 - d4.det) < 1e-12, 'det ' + d4s.det + ' * 4 vs ' + d4.det);
    near('centred hypercubic cost equals D4 cost', d4s.cost, d4.cost);
    near('centred hypercubic density equals D4 density', d4s.density, d4.density);
    var a3d = voronoi(bases.anDual(3));
    near('A3* is BCC (cost)', a3d.cost, bcc.cost);
    near('A3* is BCC (density)', a3d.density, bcc.density);
    var a3 = voronoi([[1, -1, 0, 0], [0, 1, -1, 0], [0, 0, 1, -1]]);
    near('A3 is FCC (cost)', a3.cost, fcc.cost);
    near('A3 is FCC (density)', a3.density, fcc.density);
    var d3 = cellInFrame(bases.fcc()), tips3 = d3.verts.filter(function (v) { return Math.abs(len(v) - 1) < 1e-9; });
    ok('checkerboard cell in 3D: 6 tips at distance 1, 8 cube corners at sqrt(3)/2', tips3.length === 6 &&
      d3.verts.filter(function (v) { return Math.abs(len(v) - Math.sqrt(3) / 2) < 1e-9; }).length === 8, '');
    function cubeEdges(cell) {
      return cell.faces[1].filter(function (S) { return S.every(function (vi) { return !cell.verts[vi].some(function (t) { return Math.abs(Math.abs(t) - 1) < 1e-9; }); }); }).length;
    }
    ok('cube-to-cube edges: none of the 24 in 3D, 32 of the 96 in 4D', cubeEdges(d3) === 0 && cubeEdges(d4i) === 32, cubeEdges(d3) + ' ' + cubeEdges(d4i));
    ok('in 3D, FCC has the higher density and BCC the lower cost', fcc.density > bcc.density && bcc.cost < fcc.cost, '');

    // ---- covering and second moment (Figure 5) ----
    var mom = { tri: moments(tri), sq: moments(sq), sc: moments(sc), bcc: moments(bcc), fcc: moments(fcc), z4: moments(z4), d4: moments(d4), a4: moments(a4), a4d: moments(a4d) };
    var cellsByName = { tri: tri, sq: sq, sc: sc, bcc: bcc, fcc: fcc, z4: z4, d4: d4, a4: a4, a4d: a4d }, worstVol = 0;
    Object.keys(mom).forEach(function (k) { worstVol = Math.max(worstVol, Math.abs(mom[k].volume / cellsByName[k].det - 1)); });
    ok('the simplices each cell is cut into add up to its volume (nine lattices)', worstVol < 1e-9, 'worst relative gap ' + worstVol.toExponential(2));
    near('second moment of a square, cube and 4-cube is 1/12', Math.max(Math.abs(mom.sq.G - 1 / 12), Math.abs(mom.sc.G - 1 / 12), Math.abs(mom.z4.G - 1 / 12)), 0, 1e-12);
    near('hexagon second moment 5/(36 sqrt 3)', mom.tri.G, 5 / (36 * Math.sqrt(3)), 1e-12);
    near('BCC second moment 19/(192 2^(1/3))', mom.bcc.G, 19 / (192 * Math.pow(2, 1 / 3)), 1e-12);
    near('FCC second moment 2^(-11/3)', mom.fcc.G, Math.pow(2, -11 / 3), 1e-12);
    near('D4 second moment 13/(120 sqrt 2)', mom.d4.G, 13 / (120 * Math.SQRT2), 1e-12);
    // published: Agrell and Allen, "On the best lattice quantizers", Table I
    ok('second moments match the published table (A2 0.080187537, A3* 0.078543281, D4 0.076603235)',
      Math.abs(mom.tri.G - 0.080187537) < 6e-10 && Math.abs(mom.bcc.G - 0.078543281) < 6e-10 && Math.abs(mom.d4.G - 0.076603235) < 6e-10,
      [mom.tri.G, mom.bcc.G, mom.d4.G].map(function (v) { return v.toFixed(10); }).join(' '));
    near('triangular covering 2 pi/(3 sqrt 3)', mom.tri.thickness, 2 * Math.PI / (3 * Math.sqrt(3)), 1e-12);
    near('simple cubic covering pi sqrt(3)/2', mom.sc.thickness, Math.PI * Math.sqrt(3) / 2, 1e-12);
    near('FCC covering 2 pi/3', mom.fcc.thickness, 2 * Math.PI / 3, 1e-12);
    near('BCC covering 5 sqrt(5) pi/24', mom.bcc.thickness, 5 * Math.sqrt(5) * Math.PI / 24, 1e-12);
    near('D4 covering pi^2/4', mom.d4.thickness, Math.PI * Math.PI / 4, 1e-12);
    near('4-cube covering pi^2/2', mom.z4.thickness, Math.PI * Math.PI / 2, 1e-12);
    // published: Schuermann and Vallentin, "Computational approaches to lattice packing and
    // covering problems", Table 1 (1.209199, 1.463505, 1.765529)
    ok('coverings match the published table to five places (A2 1.20920, A3* 1.46350, A4* 1.76553)',
      Math.abs(mom.tri.thickness - 1.209199) < 5e-6 && Math.abs(mom.bcc.thickness - 1.463505) < 5e-6 && Math.abs(mom.a4d.thickness - 1.765529) < 5e-6,
      [mom.tri.thickness, mom.bcc.thickness, mom.a4d.thickness].map(function (v) { return v.toFixed(7); }).join(' '));
    function order(key, sign, names) { return names.slice().sort(function (p, q) { return sign * (key(p) - key(q)); }).join(' '); }
    var G = function (k) { return mom[k].G; }, C = function (k) { return cellsByName[k].cost; }, Th = function (k) { return mom[k].thickness; }, Dn = function (k) { return cellsByName[k].density; };
    ok('3D: BCC is best at covering, second moment and wall cost; FCC only at packing',
      order(Th, 1, ['sc', 'fcc', 'bcc']) === 'bcc fcc sc' && order(G, 1, ['sc', 'fcc', 'bcc']) === 'bcc fcc sc' && order(C, 1, ['sc', 'fcc', 'bcc']) === 'bcc fcc sc' && order(Dn, -1, ['sc', 'fcc', 'bcc']) === 'fcc bcc sc', '');
    ok('4D: D4 is best at packing, second moment and wall cost; A4* at covering; second moment and wall cost agree on the whole order',
      order(Dn, -1, ['z4', 'a4', 'a4d', 'd4']) === 'd4 a4 a4d z4' && order(Th, 1, ['z4', 'a4', 'a4d', 'd4']) === 'a4d d4 a4 z4' &&
      order(G, 1, ['z4', 'a4', 'a4d', 'd4']) === 'd4 a4d a4 z4' && order(C, 1, ['z4', 'a4', 'a4d', 'd4']) === 'd4 a4d a4 z4', '');

    // ---- where cells meet (Figure 6) ----
    var tet = Math.acos(-1 / 3) / deg;
    function kinds(cell) { return junctions(cell).map(function (j) { j.pass = plateau(j).ok; return j; }); }
    function allNear(list, want) { return list.every(function (a) { return Math.abs(a - want) < 1e-6; }); }
    function sortedTo(list, want) { var s = list.slice().sort(function (p, q) { return p - q; }); return s.length === want.length && s.every(function (a, i) { return Math.abs(a - want[i]) < 1e-6; }); }
    var jt = kinds(tri), jq = kinds(sq), jb = kinds(bcc), jf = kinds(fcc), jd = kinds(d4), js = kinds(sc);
    ok('hexagons: one kind of corner, 3 cells, walls 120 degrees apart, passes', jt.length === 1 && jt[0].count === 6 && jt[0].cells === 3 && allNear(jt[0].angles, 120) && jt[0].pass, '');
    ok('square lattice: 4 walls 90 degrees apart at each corner, fails', jq.length === 1 && jq[0].rays.length === 4 && allNear(jq[0].angles, 90) && !jq[0].pass, '');
    ok('simple cubic: 4 walls round each edge, 8 cells and 6 lines at each corner, fails both', js.length === 2 && js[0].rays.length === 4 && !js[0].pass && js[1].cells === 8 && js[1].rays.length === 6 && !js[1].pass, '');
    ok('BCC: 3 walls round each of 36 edges at 109.47, 125.26, 125.26, fails', jb[0].dim === 1 && jb[0].count === 36 && jb[0].cells === 3 && sortedTo(jb[0].angles, [tet, 180 - tet / 2, 180 - tet / 2]) && !jb[0].pass, jb[0].angles.join(' '));
    ok('BCC: 4 lines at each of 24 corners, two pairs 90 and four pairs 120 degrees apart, fails', jb.length === 2 && jb[1].count === 24 && jb[1].cells === 4 && sortedTo(jb[1].angles, [90, 90, 120, 120, 120, 120]) && !jb[1].pass, jb[1].angles.join(' '));
    var jfTip = jf.filter(function (j) { return j.dim === 0 && j.rays.length === 8; })[0], jfCube = jf.filter(function (j) { return j.dim === 0 && j.rays.length === 4; })[0];
    ok('FCC: 3 walls 120 degrees apart round each of 24 edges, passes', jf.length === 3 && jf[0].dim === 1 && jf[0].count === 24 && allNear(jf[0].angles, 120) && jf[0].pass, '');
    ok('FCC: at 8 corners 4 cells and 4 lines at arccos(-1/3), passes', jfCube && jfCube.count === 8 && jfCube.cells === 4 && jfCube.links.length === 6 && allNear(jfCube.angles, tet) && jfCube.pass, '');
    ok('FCC: at 6 corners 6 cells and 8 lines toward the corners of a cube (neighbours 70.53 apart), fails', jfTip && jfTip.count === 6 && jfTip.cells === 6 && jfTip.links.length === 12 && allNear(jfTip.angles, 180 - tet) && !jfTip.pass, '');
    ok('D4: 3 walls 120 degrees apart round each of 96 triangles, passes', jd.length === 3 && jd[0].dim === 2 && jd[0].count === 96 && jd[0].cells === 3 && allNear(jd[0].angles, 120) && jd[0].pass, '');
    ok('D4: 4 cells and 4 triangles at arccos(-1/3) round each of 96 edges, passes', jd[1].dim === 1 && jd[1].count === 96 && jd[1].cells === 4 && jd[1].links.length === 6 && allNear(jd[1].angles, tet) && jd[1].pass, '');
    ok('D4: 8 cells, 16 edges, 32 triangles and 24 walls at each of 24 corners', jd[2].dim === 0 && jd[2].count === 24 && jd[2].cells === 8 && jd[2].rays.length === 16 && jd[2].links.length === 32, jd[2].cells + ' ' + jd[2].rays.length + ' ' + jd[2].links.length);
    // the 16 edge directions are the corners of a 4-cube: from any one, 4 at 60, 6 at 90, 4 at 120, 1 at 180 degrees
    var hp = jd[2].pairs;
    ok('D4: the 16 edges at a corner point at the corners of a hypercube, passes (Brakke 1991)', hp['60.00'] === 32 && hp['90.00'] === 48 && hp['120.00'] === 32 && hp['180.00'] === 8 && jd[2].pass && plateau(jd[2]).kind === 'hypercube', JSON.stringify(hp));
    var ja = kinds(a4), jaBad = ja.filter(function (j) { return j.dim === 1 && !j.pass; })[0];
    ok('A4: walls 120 degrees apart round every triangle, but 30 of its 70 edges carry 6 cells and 8 lines', ja[0].dim === 2 && ja[0].pass && jaBad && jaBad.count === 30 && jaBad.cells === 6 && jaBad.rays.length === 8 && a4.f[1] === 70, a4.f.join(','));

    var jk = kinds(a4d), jz = kinds(z4);
    ok('A4* and the 4D cubic lattice fail where walls meet (so of SC, FCC, BCC, Z4, A4, A4*, D4 only D4 passes everywhere)',
      !jk.filter(function (j) { return j.codim === 2; }).some(function (j) { return j.pass; }) && !jz[0].pass &&
      [js, jf, jb, jz, ja, jk].every(function (list) { return list.some(function (j) { return !j.pass; }); }) && jd.every(function (j) { return j.pass; }),
      'A4* wall angles ' + jk.filter(function (j) { return j.codim === 2; }).map(function (j) { return j.angles.map(function (a) { return a.toFixed(2); }).join('/'); }).join(' and '));

    // ---- seeded deformations (Figure 7) ----
    var rr = rng(7), S4 = strain(4, rr), tr4 = 0, nrm = 0, sym = true;
    S4.forEach(function (row, i) { tr4 += row[i]; row.forEach(function (x, j) { nrm += x * x; if (x !== S4[j][i]) sym = false; }); });
    ok('a random strain is symmetric, trace 0, norm 1', sym && Math.abs(tr4) < 1e-12 && Math.abs(nrm - 1) < 1e-12, tr4 + ' ' + nrm);
    near('the same seed gives the same numbers', rng(7)(), rng(7)(), 0.5e-300);
    near('deforming by 5 percent changes the cell volume by less than eps^2', voronoi(deform(bases.d4(), S4, 0.05)).det / 2, 1, 0.0025);
    function localTest(basis, seed, count, eps) {
      var r = rng(seed), base = voronoi(basis).cost, lower = 0, bad = 0, lo = Infinity;
      for (var q = 0; q < count; q++) {
        var c = voronoi(deform(basis, strain(basis.length, r), eps)), d = c.cost - base;
        if (!c.ok || !isFinite(d)) bad++; else { if (d < 0) lower++; lo = Math.min(lo, d / (eps * eps)); }
      }
      return { lower: lower, bad: bad, lo: lo, text: lower + ' of ' + count + ' lower; least change / eps^2 ' + lo.toFixed(3) + '; ' + bad + ' failed' };
    }
    var ltB = localTest(bases.bcc(), 6, 400, 0.02), ltF = localTest(bases.fcc(), 6, 400, 0.02);
    var ltD = localTest(bases.d4(), 6, 60, 0.02), ltK = localTest(squareBasis(bases.a4dual()), 6, 60, 0.02), ltA = localTest(squareBasis(bases.a4()), 6, 60, 0.02);
    ok('BCC: none of 400 seeded deformations lowers the wall cost', ltB.lower === 0 && ltB.bad === 0 && ltB.lo > 0.7, ltB.text);
    ok('FCC: some of 400 seeded deformations lower the wall cost (a saddle)', ltF.lower > 20 && ltF.bad === 0, ltF.text);
    ok('D4: none of 60 seeded deformations lowers the wall cost', ltD.lower === 0 && ltD.bad === 0 && ltD.lo > 1.2, ltD.text);
    ok('A4* (Kelvin\'s relative): none of 60 seeded deformations lowers the wall cost', ltK.lower === 0 && ltK.bad === 0 && ltK.lo > 0.6, ltK.text);
    ok('A4: some of 60 seeded deformations lower the wall cost (a saddle)', ltA.lower > 10 && ltA.bad === 0, ltA.text);
    // Cells a hair away from a special lattice (edges a millionth long) used to come back
    // with corners assigned to the wrong walls and a volume of NaN.
    var ltTiny = localTest(bases.fcc(), 6, 2000, 0.001), ltTiny4 = localTest(squareBasis(bases.a4()), 41, 152, -0.05);
    ok('2000 FCC cells deformed by 0.1 percent, and the A4 cell that used to fail, all have volume = det', ltTiny.bad === 0 && ltTiny4.bad === 0, ltTiny.bad + ' and ' + ltTiny4.bad + ' failed');
    return out;
  }

  // voronoi() works in a rotated (triangular) copy of the basis. For a square basis,
  // carry the corners and wall normals back to the coordinates it was given in.
  function cellInFrame(Bi) {
    var cell = voronoi(Bi), Lt = transpose(cell.basis), n = Bi.length;
    function back(v) {
      var coef = solve(Lt, v), out = new Array(n).fill(0);
      for (var i = 0; i < n; i++) out = axpy(out, coef[i], Bi[i]);
      return out;
    }
    cell.verts = cell.verts.map(back);
    cell.planes.forEach(function (p) { p.m = back(p.m); });
    cell.basis = Bi;
    return cell;
  }
  function transpose(M) { return M[0].map(function (_, j) { return M.map(function (r) { return r[j]; }); }); }

  var api = {
    voronoi: voronoi, bases: bases, faces3: faces3, edgesOf: edgesOf, facesOfDim: facesOfDim, dihedral: dihedral,
    cellInFrame: cellInFrame, leftQuat: leftQuat, apply: apply, ballVolume: ballVolume, squareBasis: squareBasis,
    junctions: junctions, plateau: plateau, moments: moments, rng: rng, strain: strain, deform: deform,
    runChecks: runChecks, vec: { dot: dot, sub: sub, axpy: axpy, len: len }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamLattice = api;
})(typeof window !== 'undefined' ? window : globalThis);
