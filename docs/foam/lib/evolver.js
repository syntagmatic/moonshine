// evolver.js — a small periodic soap-film relaxer for the Foam series.
// No dependencies; runs in the browser (window.FoamEvolver) and in node (require).
//
// Takes a welded polyhedral foam from cells.js, cuts every wall into triangles and
// moves the triangle corners downhill in total wall area while holding every cell's
// volume fixed. This is the method of Ken Brakke's Surface Evolver, reduced to the
// one thing these pages need. Corners are shared across the periodic seam, so the
// mesh has no boundary.
//
// Public API:
//   build(welded, refine)  -> mesh    refine = number of 1-to-4 triangle splits
//   mesh.area()            -> total wall area in one repeat
//   mesh.volumes()         -> [volume of each cell]
//   mesh.s()               -> mean cell area / (mean cell volume)^(2/3)
//   mesh.step(n)           -> run n conjugate-gradient steps; returns s
//   mesh.cellTriangles(k, pos) -> [{pts, face, sides, edges}] closed surface of cell k
//   mesh.X                 -> Float64Array of vertex positions (xyz, mod the lattice)
//   mesh.junctionAngles()  -> { film:[deg...], edge:[deg...] } dihedral and vertex angles
//   runChecks(Cells)       -> [{name, ok, detail}]

(function (global) {
  'use strict';

  function build(welded, refine) {
    var K = welded.cells;
    var X = [];                                   // flat xyz
    welded.verts.forEach(function (p) { X.push(p[0], p[1], p[2]); });
    var faces = welded.faces.map(function (f) { return { a: f.a, b: f.b, T: f.T, sides: f.sides }; });

    // Triangles as corner triples: vertex index + integer lattice offset. Every
    // polygon is first cut into a fan around its centroid.
    var TV = [], TO = [], TF = [];                // 3 per tri, 9 per tri, 1 per tri
    var isEdge = {};                              // vertices on the original cell edges
    welded.faces.forEach(function (f, fi) {
      var c = [0, 0, 0], n = f.loop.length;
      f.loop.forEach(function (q) {
        isEdge[q.v] = true;
        c[0] += welded.verts[q.v][0] + q.o[0]; c[1] += welded.verts[q.v][1] + q.o[1]; c[2] += welded.verts[q.v][2] + q.o[2];
      });
      var ci = X.length / 3; X.push(c[0] / n, c[1] / n, c[2] / n);
      for (var i = 0; i < n; i++) {
        var p = f.loop[i], q = f.loop[(i + 1) % n];
        TV.push(ci, p.v, q.v);
        TO.push(0, 0, 0, p.o[0], p.o[1], p.o[2], q.o[0], q.o[1], q.o[2]);
        TF.push(fi);
      }
    });
    // Original edges, as vertex pairs with relative offset, so refinement can tell
    // which new midpoints lie on a triple line.
    var edgeKeys = {};
    welded.faces.forEach(function (f) {
      for (var i = 0; i < f.loop.length; i++) edgeKeys[pairKey(f.loop[i].v, f.loop[i].o, f.loop[(i + 1) % f.loop.length].v, f.loop[(i + 1) % f.loop.length].o).key] = true;
    });

    function pairKey(v1, o1, v2, o2) {
      var d = [o2[0] - o1[0], o2[1] - o1[1], o2[2] - o1[2]], flip = v1 > v2;
      if (v1 === v2) flip = d[0] < 0 || (d[0] === 0 && (d[1] < 0 || (d[1] === 0 && d[2] < 0)));
      return flip ? { key: v2 + ':' + v1 + ':' + (-d[0]) + ',' + (-d[1]) + ',' + (-d[2]), base: o2, first: v2, second: v1, d: [-d[0], -d[1], -d[2]] }
                  : { key: v1 + ':' + v2 + ':' + d[0] + ',' + d[1] + ',' + d[2], base: o1, first: v1, second: v2, d: d };
    }

    function refineOnce() {
      var mids = {}, nTV = [], nTO = [], nTF = [], nEdge = {};
      function mid(v1, o1, v2, o2) {
        var k = pairKey(v1, o1, v2, o2), m = mids[k.key];
        if (m == null) {
          m = X.length / 3;
          var a = k.first * 3, b = k.second * 3;
          X.push((X[a] + X[b] + k.d[0]) / 2, (X[a + 1] + X[b + 1] + k.d[1]) / 2, (X[a + 2] + X[b + 2] + k.d[2]) / 2);
          mids[k.key] = m;
          if (edgeKeys[k.key]) {
            isEdge[m] = true;
            nEdge[pairKey(k.first, [0, 0, 0], m, [0, 0, 0]).key] = true;
            nEdge[pairKey(m, [0, 0, 0], k.second, k.d).key] = true;
          }
        }
        return { v: m, o: k.base };
      }
      for (var t = 0; t < TF.length; t++) {
        var v = [TV[3 * t], TV[3 * t + 1], TV[3 * t + 2]];
        var o = [TO.slice(9 * t, 9 * t + 3), TO.slice(9 * t + 3, 9 * t + 6), TO.slice(9 * t + 6, 9 * t + 9)];
        var m01 = mid(v[0], o[0], v[1], o[1]), m12 = mid(v[1], o[1], v[2], o[2]), m20 = mid(v[2], o[2], v[0], o[0]);
        [[{ v: v[0], o: o[0] }, m01, m20], [m01, { v: v[1], o: o[1] }, m12], [m20, m12, { v: v[2], o: o[2] }], [m01, m12, m20]].forEach(function (tri) {
          nTV.push(tri[0].v, tri[1].v, tri[2].v);
          nTO.push(tri[0].o[0], tri[0].o[1], tri[0].o[2], tri[1].o[0], tri[1].o[1], tri[1].o[2], tri[2].o[0], tri[2].o[1], tri[2].o[2]);
          nTF.push(TF[t]);
        });
      }
      TV = nTV; TO = nTO; TF = nTF; edgeKeys = nEdge;
    }
    for (var r = 0; r < (refine || 0); r++) refineOnce();

    var NT = TF.length, N = X.length;
    X = Float64Array.from(X);
    var tv = Int32Array.from(TV), to = Float64Array.from(TO);
    var fa = new Int32Array(NT), fb = new Int32Array(NT), fT = new Float64Array(3 * NT);
    for (var t = 0; t < NT; t++) {
      var f = faces[TF[t]];
      fa[t] = f.a; fb[t] = f.b; fT[3 * t] = f.T[0]; fT[3 * t + 1] = f.T[1]; fT[3 * t + 2] = f.T[2];
    }

    // Area and its gradient; volumes of cells 0..K-1 and their gradients.
    var G = new Float64Array(N), CG = [], vol = new Float64Array(K);
    for (var k = 0; k < K - 1; k++) CG.push(new Float64Array(N));   // the last volume is fixed by the rest

    function evaluate(x, wantGrad) {
      var area = 0, t, i;
      if (wantGrad) { G.fill(0); for (i = 0; i < K - 1; i++) CG[i].fill(0); }
      vol.fill(0);
      for (t = 0; t < NT; t++) {
        var ia = tv[3 * t] * 3, ib = tv[3 * t + 1] * 3, ic = tv[3 * t + 2] * 3, o = 9 * t;
        var ax = x[ia] + to[o], ay = x[ia + 1] + to[o + 1], az = x[ia + 2] + to[o + 2];
        var bx = x[ib] + to[o + 3], by = x[ib + 1] + to[o + 4], bz = x[ib + 2] + to[o + 5];
        var cx = x[ic] + to[o + 6], cy = x[ic + 1] + to[o + 7], cz = x[ic + 2] + to[o + 8];
        var ux = bx - ax, uy = by - ay, uz = bz - az, vx = cx - ax, vy = cy - ay, vz = cz - az;
        var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        var L = Math.sqrt(nx * nx + ny * ny + nz * nz);
        area += L / 2;
        var A = fa[t], B = fb[t], Tx = fT[3 * t], Ty = fT[3 * t + 1], Tz = fT[3 * t + 2];
        // signed volume under the triangle, seen from cell A (outward) and from cell B
        // (the same triangle shifted by -T, facing the other way)
        vol[A] += (ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx)) / 6;
        var a2x = ax - Tx, a2y = ay - Ty, a2z = az - Tz, b2x = bx - Tx, b2y = by - Ty, b2z = bz - Tz, c2x = cx - Tx, c2y = cy - Ty, c2z = cz - Tz;
        vol[B] -= (a2x * (b2y * c2z - b2z * c2y) + a2y * (b2z * c2x - b2x * c2z) + a2z * (b2x * c2y - b2y * c2x)) / 6;
        if (!wantGrad) continue;
        if (L > 1e-300) {
          var hx = nx / L / 2, hy = ny / L / 2, hz = nz / L / 2;
          // dA/da = (b - c) x nhat / 2, and cyclic
          var ex = bx - cx, ey = by - cy, ez = bz - cz;
          G[ia] += ey * hz - ez * hy; G[ia + 1] += ez * hx - ex * hz; G[ia + 2] += ex * hy - ey * hx;
          ex = cx - ax; ey = cy - ay; ez = cz - az;
          G[ib] += ey * hz - ez * hy; G[ib + 1] += ez * hx - ex * hz; G[ib + 2] += ex * hy - ey * hx;
          ex = ax - bx; ey = ay - by; ez = az - bz;
          G[ic] += ey * hz - ez * hy; G[ic + 1] += ez * hx - ex * hz; G[ic + 2] += ex * hy - ey * hx;
        }
        if (A < K - 1) {
          var ga = CG[A];
          ga[ia] += (by * cz - bz * cy) / 6; ga[ia + 1] += (bz * cx - bx * cz) / 6; ga[ia + 2] += (bx * cy - by * cx) / 6;
          ga[ib] += (cy * az - cz * ay) / 6; ga[ib + 1] += (cz * ax - cx * az) / 6; ga[ib + 2] += (cx * ay - cy * ax) / 6;
          ga[ic] += (ay * bz - az * by) / 6; ga[ic + 1] += (az * bx - ax * bz) / 6; ga[ic + 2] += (ax * by - ay * bx) / 6;
        }
        if (B < K - 1) {
          var gb = CG[B];
          gb[ia] -= (b2y * c2z - b2z * c2y) / 6; gb[ia + 1] -= (b2z * c2x - b2x * c2z) / 6; gb[ia + 2] -= (b2x * c2y - b2y * c2x) / 6;
          gb[ib] -= (c2y * a2z - c2z * a2y) / 6; gb[ib + 1] -= (c2z * a2x - c2x * a2z) / 6; gb[ib + 2] -= (c2x * a2y - c2y * a2x) / 6;
          gb[ic] -= (a2y * b2z - a2z * b2y) / 6; gb[ic + 1] -= (a2z * b2x - a2x * b2z) / 6; gb[ic + 2] -= (a2x * b2y - a2y * b2x) / 6;
        }
      }
      return area;
    }

    function vdot(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
    // Solve the small symmetric system M y = r (Gaussian elimination, partial pivoting).
    function solve(M, r) {
      var n = r.length, A = M.map(function (row, i) { return row.concat([r[i]]); }), i, j, k;
      for (i = 0; i < n; i++) {
        var p = i;
        for (j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > Math.abs(A[p][i])) p = j;
        var tmp = A[i]; A[i] = A[p]; A[p] = tmp;
        for (j = i + 1; j < n; j++) { var m = A[j][i] / A[i][i]; for (k = i; k <= n; k++) A[j][k] -= m * A[i][k]; }
      }
      var y = new Array(n);
      for (i = n - 1; i >= 0; i--) { var s = A[i][n]; for (j = i + 1; j < n; j++) s -= A[i][j] * y[j]; y[i] = s / A[i][i]; }
      return y;
    }
    function gram() {
      var M = [];
      for (var i = 0; i < K - 1; i++) { M.push([]); for (var j = 0; j < K - 1; j++) M[i].push(j < i ? M[j][i] : vdot(CG[i], CG[j])); }
      return M;
    }
    // Remove from d its components along the volume gradients, so a step along d
    // keeps every volume fixed to first order.
    function project(d) {
      if (K < 2) return;
      var y = solve(gram(), CG.map(function (c) { return vdot(c, d); }));
      for (var k = 0; k < K - 1; k++) { var c = CG[k], yk = y[k]; for (var i = 0; i < N; i++) d[i] -= yk * c[i]; }
    }
    // Pull the volumes back to their targets (Newton step along the volume gradients).
    var target = null;
    function restoreVolumes() {
      if (K < 2) return;
      for (var pass = 0; pass < 3; pass++) {
        evaluate(X, true);
        var r = [], worst = 0;
        for (var k = 0; k < K - 1; k++) { r.push(vol[k] - target[k]); worst = Math.max(worst, Math.abs(r[k])); }
        if (worst < 1e-13) return;
        var y = solve(gram(), r);
        for (k = 0; k < K - 1; k++) { var c = CG[k], yk = y[k]; for (var i = 0; i < N; i++) X[i] -= yk * c[i]; }
      }
    }

    evaluate(X, false);
    target = Array.from(vol);

    // Nonlinear conjugate gradients (Polak-Ribiere, restarted) on the projected
    // gradient, with a quadratic line search along each direction.
    var dir = new Float64Array(N), gPrev = new Float64Array(N), gp = new Float64Array(N), trial = new Float64Array(N);
    var haveDir = false, hStep = 0.1, iters = 0;
    function areaAt(h) { for (var i = 0; i < N; i++) trial[i] = X[i] + h * dir[i]; return evaluate(trial, false); }
    function stepOnce() {
      var a0 = evaluate(X, true), i;
      gp.set(G); project(gp);
      var gg = vdot(gp, gp);
      if (gg < 1e-28) return a0;
      var beta = 0;
      if (haveDir && iters % 40 !== 0) {
        var num = 0, den = vdot(gPrev, gPrev);
        for (i = 0; i < N; i++) num += gp[i] * (gp[i] - gPrev[i]);
        beta = Math.max(0, num / den);
      }
      for (i = 0; i < N; i++) dir[i] = -gp[i] + beta * dir[i];
      project(dir);
      var slope = vdot(gp, dir);
      if (slope >= 0) { for (i = 0; i < N; i++) dir[i] = -gp[i]; slope = -gg; }
      gPrev.set(gp); haveDir = true; iters++;
      // fit a parabola through a0, the slope, and one trial point
      var h = hStep, a1 = areaAt(h), tries = 0;
      while (a1 > a0 && tries++ < 20) { h /= 4; a1 = areaAt(h); }
      var curv = (a1 - a0 - slope * h) / (h * h), hBest = curv > 0 ? -slope / (2 * curv) : 2 * h;
      hBest = Math.min(hBest, 4 * h);
      var a2 = areaAt(hBest);
      if (a2 > a1) { hBest = h; }
      for (i = 0; i < N; i++) X[i] += hBest * dir[i];
      hStep = Math.max(1e-6, Math.min(2, hBest * 1.5));
      restoreVolumes();
      return a0;
    }

    function meanS() {
      var a = evaluate(X, false), V = 0;
      for (var k = 0; k < K; k++) V += vol[k];
      return (2 * a / K) / Math.pow(V / K, 2 / 3);
    }

    // Closed surface of cell k, in the frame where it surrounds its own site:
    // [{ pts:[p0,p1,p2], face, sides, edges:[bool x3] }], counterclockwise from outside.
    // edges marks triangle sides lying on a triple line. pos (optional) replaces the
    // current vertex positions, for drawing a blend of two states.
    function cellTriangles(k, pos) {
      var out = [], x = pos || X;
      for (var t = 0; t < NT; t++) {
        var isA = fa[t] === k, isB = fb[t] === k;
        if (!isA && !isB) continue;
        var P = [], O = [], c;
        for (c = 0; c < 3; c++) {
          var i = tv[3 * t + c] * 3, o = 9 * t + 3 * c;
          P.push([x[i] + to[o], x[i + 1] + to[o + 1], x[i + 2] + to[o + 2]]);
          O.push([to[o], to[o + 1], to[o + 2]]);
        }
        var e = [0, 1, 2].map(function (c) { return !!edgeKeys[pairKey(tv[3 * t + c], O[c], tv[3 * t + (c + 1) % 3], O[(c + 1) % 3]).key]; });
        var sides = faces[TF[t]].sides;
        if (isA) out.push({ pts: [P[0], P[1], P[2]], face: TF[t], sides: sides, edges: e });
        if (isB) {
          var Tx = fT[3 * t], Ty = fT[3 * t + 1], Tz = fT[3 * t + 2];
          var Q = P.map(function (p) { return [p[0] - Tx, p[1] - Ty, p[2] - Tz]; });
          out.push({ pts: [Q[0], Q[2], Q[1]], face: TF[t], sides: sides, edges: [e[2], e[1], e[0]] });
        }
      }
      return out;
    }

    // Angles at the junctions, measured on the mesh. film: the three angles between
    // walls around each mesh segment of a triple line. edge: the angles between the
    // triple lines leaving each original vertex.
    function junctionAngles() {
      var segs = {}, t, c;
      for (t = 0; t < NT; t++) {
        for (c = 0; c < 3; c++) {
          var c2 = (c + 1) % 3, c3 = (c + 2) % 3;
          var v1 = tv[3 * t + c], v2 = tv[3 * t + c2];
          var o1 = [to[9 * t + 3 * c], to[9 * t + 3 * c + 1], to[9 * t + 3 * c + 2]], o2 = [to[9 * t + 3 * c2], to[9 * t + 3 * c2 + 1], to[9 * t + 3 * c2 + 2]];
          var k = pairKey(v1, o1, v2, o2);
          if (!edgeKeys[k.key]) continue;
          var p1 = [X[3 * k.first], X[3 * k.first + 1], X[3 * k.first + 2]];
          var p2 = [X[3 * k.second] + k.d[0], X[3 * k.second + 1] + k.d[1], X[3 * k.second + 2] + k.d[2]];
          var v3 = tv[3 * t + c3], sh = [to[9 * t + 3 * c3] - k.base[0], to[9 * t + 3 * c3 + 1] - k.base[1], to[9 * t + 3 * c3 + 2] - k.base[2]];
          var p3 = [X[3 * v3] + sh[0], X[3 * v3 + 1] + sh[1], X[3 * v3 + 2] + sh[2]];
          (segs[k.key] = segs[k.key] || { p1: p1, p2: p2, third: [], v1: k.first, v2: k.second }).third.push(p3);
        }
      }
      var film = [], spokes = {};
      Object.keys(segs).forEach(function (key) {
        var s = segs[key], e = [s.p2[0] - s.p1[0], s.p2[1] - s.p1[1], s.p2[2] - s.p1[2]];
        var el = Math.hypot(e[0], e[1], e[2]); e = [e[0] / el, e[1] / el, e[2] / el];
        (spokes[s.v1] = spokes[s.v1] || []).push({ to: s.v2, d: [e[0] * el, e[1] * el, e[2] * el] });
        (spokes[s.v2] = spokes[s.v2] || []).push({ to: s.v1, d: [-e[0] * el, -e[1] * el, -e[2] * el] });
        if (s.third.length !== 3) return;
        // directions of the three walls, perpendicular to the segment
        var w = s.third.map(function (p) {
          var d = [p[0] - s.p1[0], p[1] - s.p1[1], p[2] - s.p1[2]], along = d[0] * e[0] + d[1] * e[1] + d[2] * e[2];
          d = [d[0] - along * e[0], d[1] - along * e[1], d[2] - along * e[2]];
          var dl = Math.hypot(d[0], d[1], d[2]); return [d[0] / dl, d[1] / dl, d[2] / dl];
        });
        [[0, 1], [1, 2], [2, 0]].forEach(function (ij) {
          var cs = w[ij[0]][0] * w[ij[1]][0] + w[ij[0]][1] * w[ij[1]][1] + w[ij[0]][2] * w[ij[1]][2];
          film.push(Math.acos(Math.max(-1, Math.min(1, cs))) * 180 / Math.PI);
        });
      });
      // Triple lines curve most near a corner, so the chord to the next mesh vertex is a
      // poor tangent. Use the one-sided three-point estimate 3 d1 - d2 from the first two
      // mesh segments leaving the corner.
      var edge = [];
      Object.keys(spokes).forEach(function (v) {
        var sp = spokes[v];
        if (sp.length !== 4) return;                 // only the original vertices have four
        var tan = sp.map(function (a) {
          var next = spokes[a.to], d1 = a.d, t = d1;
          if (next && next.length === 2) {
            // the segment that continues away from the corner, not the one coming back
            var back0 = next[0].d[0] * d1[0] + next[0].d[1] * d1[1] + next[0].d[2] * d1[2];
            var back1 = next[1].d[0] * d1[0] + next[1].d[1] * d1[1] + next[1].d[2] * d1[2];
            var d2 = back0 > back1 ? next[0].d : next[1].d;
            t = [3 * d1[0] - d2[0], 3 * d1[1] - d2[1], 3 * d1[2] - d2[2]];
          }
          var L = Math.hypot(t[0], t[1], t[2]); return [t[0] / L, t[1] / L, t[2] / L];
        });
        for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) {
          var cs = tan[i][0] * tan[j][0] + tan[i][1] * tan[j][1] + tan[i][2] * tan[j][2];
          edge.push(Math.acos(Math.max(-1, Math.min(1, cs))) * 180 / Math.PI);
        }
      });
      return { film: film, edge: edge };
    }

    // How far each wall is from flat: per original face, the largest distance of its
    // triangle corners from the plane through its mean normal and centroid.
    function flatness() {
      var acc = faces.map(function () { return { n: [0, 0, 0], pts: [] }; }), t, c;
      for (t = 0; t < NT; t++) {
        var P = [];
        for (c = 0; c < 3; c++) { var i = tv[3 * t + c] * 3, o = 9 * t + 3 * c; P.push([X[i] + to[o], X[i + 1] + to[o + 1], X[i + 2] + to[o + 2]]); }
        var u = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]], v = [P[2][0] - P[0][0], P[2][1] - P[0][1], P[2][2] - P[0][2]];
        var a = acc[TF[t]];
        a.n[0] += u[1] * v[2] - u[2] * v[1]; a.n[1] += u[2] * v[0] - u[0] * v[2]; a.n[2] += u[0] * v[1] - u[1] * v[0];
        a.pts.push(P[0], P[1], P[2]);
      }
      return acc.map(function (a, fi) {
        var L = Math.hypot(a.n[0], a.n[1], a.n[2]), n = [a.n[0] / L, a.n[1] / L, a.n[2] / L], m = 0, lo = Infinity, hi = -Infinity;
        a.pts.forEach(function (p) { m += p[0] * n[0] + p[1] * n[1] + p[2] * n[2]; });
        m /= a.pts.length;
        a.pts.forEach(function (p) { var d = p[0] * n[0] + p[1] * n[1] + p[2] * n[2] - m; lo = Math.min(lo, d); hi = Math.max(hi, d); });
        return { sides: faces[fi].sides, a: faces[fi].a, b: faces[fi].b, below: lo, above: hi };
      });
    }

    return {
      cells: K, triangles: NT, vertices: N / 3, faces: faces, X: X,
      area: function () { return evaluate(X, false); },
      volumes: function () { evaluate(X, false); return Array.from(vol); },
      s: meanS,
      step: function (n) { for (var i = 0; i < (n || 1); i++) stepOnce(); return meanS(); },
      iterations: function () { return iters; },
      cellTriangles: cellTriangles,
      junctionAngles: junctionAngles,
      flatness: flatness
    };
  }

  function runChecks(Cells) {
    Cells = Cells || (typeof require !== 'undefined' ? require('./cells.js') : global.FoamCells);
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: detail }); }
    function spread(a) { var lo = Infinity, hi = -Infinity; a.forEach(function (x) { lo = Math.min(lo, x); hi = Math.max(hi, x); }); return [lo, hi]; }

    var bcc = Cells.foam(Cells.sites.bcc()), k0 = build(Cells.weld(bcc), 0);
    ok('unrefined Kelvin mesh reproduces the flat cell', Math.abs(k0.s() - bcc.s) < 1e-12, k0.s() + ' vs ' + bcc.s);
    var k2 = build(Cells.weld(bcc), 2), a0 = k2.junctionAngles();
    ok('flat Kelvin film angles are 109.47 and 125.26', Math.abs(spread(a0.film)[0] - 109.4712) < 1e-3 && Math.abs(spread(a0.film)[1] - 125.2644) < 1e-3, spread(a0.film).join(' .. '));
    var before = k2.s(); k2.step(300); var after = k2.s(), v = k2.volumes();
    ok('relaxing Kelvin lowers s into (5.3063, 5.3100)', after < before && after > 5.3063 && after < 5.31, before + ' -> ' + after);
    ok('relaxing Kelvin keeps both volumes at 1/2', Math.abs(v[0] - 0.5) < 1e-10 && Math.abs(v[1] - 0.5) < 1e-10, v.join(' '));
    var a1 = k2.junctionAngles(), f1 = spread(a1.film);
    ok('relaxed Kelvin film angles move toward 120', f1[0] > 114 && f1[1] < 124, f1.join(' .. '));

    var eq = Cells.equalVolumeA15(), w1 = build(Cells.weld(eq.foam), 1);
    ok('unrefined-geometry Weaire-Phelan mesh matches the flat foam', Math.abs(w1.s() - eq.foam.s) < 1e-12, w1.s() + ' vs ' + eq.foam.s);
    var wb = w1.s(); w1.step(200); var wa = w1.s(), wv = spread(w1.volumes());
    ok('relaxing Weaire-Phelan lowers s into (5.2883, 5.2950)', wa < wb && wa > 5.2883 && wa < 5.295, wb + ' -> ' + wa);
    ok('relaxing Weaire-Phelan keeps all eight volumes at 1/8', Math.abs(wv[0] - 0.125) < 1e-10 && Math.abs(wv[1] - 0.125) < 1e-10, wv.join(' .. '));
    ok('relaxed Weaire-Phelan stays below relaxed Kelvin', wa < after, wa + ' < ' + after);
    return out;
  }

  var api = { build: build, runChecks: runChecks };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamEvolver = api;
})(typeof window !== 'undefined' ? window : globalThis);
