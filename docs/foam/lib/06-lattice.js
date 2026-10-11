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
//   runChecks()         -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var EPS = 1e-9;

  function dot(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
  function sub(a, b) { return a.map(function (x, i) { return x - b[i]; }); }
  function axpy(a, k, b) { return a.map(function (x, i) { return x + k * b[i]; }); }
  function len(a) { return Math.sqrt(dot(a, a)); }

  // Solve M x = d by elimination with partial pivoting; null when the rows are dependent.
  function solve(M, d) {
    var n = d.length, A = M.map(function (r, i) { return r.concat([d[i]]); }), i, j, k;
    for (i = 0; i < n; i++) {
      var p = i;
      for (k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;
      if (Math.abs(A[p][i]) < 1e-10) return null;
      var t = A[i]; A[i] = A[p]; A[p] = t;
      for (k = i + 1; k < n; k++) {
        var f = A[k][i] / A[i][i];
        if (f) for (j = i; j <= n; j++) A[k][j] -= f * A[i][j];
      }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) {
      var s = A[i][n];
      for (j = i + 1; j < n; j++) s -= A[i][j] * x[j];
      x[i] = s / A[i][i];
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

    // Corners: every n planes that meet in one point lying inside all the others.
    var verts = [], seen = {}, pick = [];
    function tryCorner() {
      var x = solve(pick.map(function (k) { return planes[k].m; }), pick.map(function (k) { return planes[k].d; }));
      if (!x) return;
      for (var k = 0; k < planes.length; k++) if (dot(planes[k].m, x) - planes[k].d > 1e-7 * minQ) return;
      var key = x.map(function (t) { return Math.round(t * 1e6); }).join(',');
      if (seen[key] == null) { seen[key] = verts.length; verts.push(x); }
    }
    (function choose(start, depth) {
      if (depth === n) { tryCorner(); return; }
      for (var k = start; k < planes.length; k++) { pick[depth] = k; choose(k + 1, depth + 1); }
    })(0, 0);
    verts.forEach(function (x, vi) {
      planes.forEach(function (p) { if (Math.abs(dot(p.m, x) - p.d) < 1e-6 * minQ) p.verts.push(vi); });
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
    runChecks: runChecks, vec: { dot: dot, sub: sub, axpy: axpy, len: len }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamLattice = api;
})(typeof window !== 'undefined' ? window : globalThis);
