// 03-kelvin.js: helpers for docs/foam/03-kelvins-bubble.html.
// Runs in the browser (window.Foam03, after cells.js and evolver.js) and in node (require).
//
// Public API:
//   KELVIN, ROUNDEST          truncation depths 1/3 and 1 - 1/sqrt(3)
//   family(d)                 octahedron with its six points cut to depth d (0 .. 1/2), edge
//                             of the uncut octahedron = 3 so Kelvin's cell has edge 1
//                             -> { verts, faces:[{idx,type}], squareSide, hexSides, squareArea,
//                                  hexArea, area, volume, cost, fill }
//   coverage(d, n)            sampled count of how many copies on the BCC lattice cover a point
//   frame(n, t)               soap film on a unit cubic wire frame with a central square of
//                             side t -> mesh with step(k), area(), pin(on), side(), bend(), films, lines
//   flatFrameArea(t), CONE    closed forms for the flat-film family and the twelve-plane cone
//   relaxed(level, steps)     Kelvin's foam relaxed with evolver.js -> evolver mesh
//   faceMap(mesh, fi)         one wall of that mesh seen face on: triangles as [x, y, height]
//   kelvinZ(r, phi)           Thomson's 1887 two-term approximation (apothem = 1)
//   bands(tri, levels)        cut a triangle [[x,y,h] x3] into polygons between contour levels
//   contours(tri, levels)     the segments where that triangle crosses each level
//   richardson(a, b, c)       limit of a sequence whose error falls by a fixed ratio
//   faceMix(foam)             share of 4-, 5-, 6-sided faces and faces per cell
//   vertexCensus(foam)        how many corners of a foam have 4, 8, ... edges
//   runChecks()               -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var inNode = typeof module !== 'undefined' && module.exports;
  function Cells() { return inNode ? require('./cells.js') : global.FoamCells; }
  function Evolver() { return inNode ? require('./evolver.js') : global.FoamEvolver; }

  var KELVIN = 1 / 3, ROUNDEST = 1 - 1 / Math.sqrt(3);

  // ---------- the truncation family ----------
  // Octahedron |x| + |y| + |z| <= h with h = 3 / sqrt 2 (edge 3), cut by |x|, |y|, |z| <= h (1 - d).
  // Corners: a big coordinate h (1 - d) on one axis, a small one h d on another.
  var TOPO = (function () {
    var key = {}, corners = [], faces = [];
    function id(i, si, j, sj) {
      var k = i + ':' + si + ':' + j + ':' + sj;
      if (key[k] == null) { key[k] = corners.length; corners.push({ i: i, si: si, j: j, sj: sj }); }
      return key[k];
    }
    for (var a = 0; a < 3; a++) for (var s = -1; s <= 1; s += 2) {
      var b = (a + 1) % 3, c = (a + 2) % 3;
      faces.push({ idx: [id(a, s, b, 1), id(a, s, c, 1), id(a, s, b, -1), id(a, s, c, -1)], type: 'square' });
    }
    for (var sx = -1; sx <= 1; sx += 2) for (var sy = -1; sy <= 1; sy += 2) for (var sz = -1; sz <= 1; sz += 2) {
      var sg = [sx, sy, sz];
      faces.push({ idx: [[0, 1], [1, 0], [1, 2], [2, 1], [2, 0], [0, 2]].map(function (p) { return id(p[0], sg[p[0]], p[1], sg[p[1]]); }), type: 'hex' });
    }
    return { corners: corners, faces: faces };
  })();

  function fillBcc(d) {
    // Tip at distance 1. Copies on a BCC lattice of cube edge a stay apart when neither
    // (a/2, 0, 0) nor (a/4, a/4, a/4) is inside the solid: a >= 2 (1 - d) and a >= 4/3.
    var a = Math.max(2 * (1 - d), 4 / 3), V = 4 / 3 - 4 * d * d * d;
    return V / (a * a * a / 2);
  }

  function family(d) {
    var h = 3 / Math.SQRT2, big = h * (1 - d), small = h * d;
    var verts = TOPO.corners.map(function (c) { var p = [0, 0, 0]; p[c.i] = c.si * big; p[c.j] = c.sj * small; return p; });
    var sq = 9 * d * d, hex = 9 * Math.sqrt(3) / 4 * (1 - 3 * d * d);
    var area = 6 * sq + 8 * hex, volume = 9 * Math.SQRT2 * (1 - 3 * d * d * d);
    return {
      depth: d, verts: verts, faces: TOPO.faces,
      squareSide: 3 * d, hexSides: [3 * d, 3 * (1 - 2 * d)],
      squareArea: sq, hexArea: hex, area: area, volume: volume,
      cost: area / Math.pow(volume, 2 / 3), fill: fillBcc(d),
      inradii: [big, h / Math.sqrt(3)]          // distance from the center to a square, to a hexagon
    };
  }

  // Sample n points of a Halton sequence in one BCC cube and count how many copies of the
  // depth-d solid cover each, with the copies as large as fillBcc assumes. -> { fill, most }
  function coverage(d, n) {
    var a = Math.max(2 * (1 - d), 4 / 3), c = 1 - d, covered = 0, most = 0;
    function halton(i, b) { var f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }
    function inside(x, y, z) { x = Math.abs(x); y = Math.abs(y); z = Math.abs(z); return x < c && y < c && z < c && x + y + z < 1; }
    for (var i = 1; i <= n; i++) {
      var p = [halton(i, 2) * a, halton(i, 3) * a, halton(i, 5) * a], hits = 0;
      for (var u = -1; u <= 2; u++) for (var v = -1; v <= 2; v++) for (var w = -1; w <= 2; w++) {
        if (inside(p[0] - u * a, p[1] - v * a, p[2] - w * a)) hits++;
        if (inside(p[0] - (u + 0.5) * a, p[1] - (v + 0.5) * a, p[2] - (w + 0.5) * a)) hits++;
      }
      if (hits) covered++; if (hits > most) most = hits;
    }
    return { fill: covered / n, most: most };
  }

  // ---------- soap film on a cubic wire frame ----------
  // The frame is the unit cube centered on the origin. Thirteen films: a central square of
  // side t in the plane z = 0, eight four-sided films from its sides to the top and bottom
  // frame edges, four triangles from its corners to the vertical frame edges. Triangle
  // corners on the frame are held; the rest move downhill in total area.
  var CONE = 3 * Math.SQRT2;
  function flatFrameArea(t) { return t * t + 2 * (1 + t) * Math.sqrt((1 - t) * (1 - t) + 1) + Math.SQRT2 * (1 - t); }

  function frame(n, t) {
    var X = [], index = {}, tris = [], kind = [], patch = [], held = [], lines = [], patches = [];
    function vid(p) {
      var k = Math.round(p[0] * 1e8) + ',' + Math.round(p[1] * 1e8) + ',' + Math.round(p[2] * 1e8);
      if (index[k] == null) {
        index[k] = X.length / 3; X.push(p[0], p[1], p[2]);
        var on = (Math.abs(Math.abs(p[0]) - 0.5) < 1e-9 ? 1 : 0) + (Math.abs(Math.abs(p[1]) - 0.5) < 1e-9 ? 1 : 0) + (Math.abs(Math.abs(p[2]) - 0.5) < 1e-9 ? 1 : 0);
        held.push(on >= 2);
      }
      return index[k];
    }
    function F(a, b, c) { return [a / 2, b / 2, c / 2]; }
    function Q(a, b) { return [a * t / 2, b * t / 2, 0]; }
    function lerp(a, b, s) { return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s]; }
    function quad(c0, c1, c2, c3, what) {
      var g = [], i, j, ids = [], pid = patches.length;
      for (j = 0; j <= n; j++) { g.push([]); for (i = 0; i <= n; i++) { g[j].push(vid(lerp(lerp(c0, c1, i / n), lerp(c3, c2, i / n), j / n))); ids.push(g[j][i]); } }
      for (j = 0; j < n; j++) for (i = 0; i < n; i++) {
        var a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], d = g[j + 1][i];
        if ((i + j) % 2) tris.push(a, b, c, a, c, d); else tris.push(a, b, d, b, c, d);
        kind.push(what, what); patch.push(pid, pid);
      }
      var loop = g[0].slice();
      for (j = 1; j <= n; j++) loop.push(g[j][n]);
      for (i = n - 1; i >= 0; i--) loop.push(g[n][i]);
      for (j = n - 1; j >= 1; j--) loop.push(g[j][0]);
      patches.push({ kind: what, ids: ids, loop: loop });
      return g;
    }
    function tri(apex, b0, b1) {
      var g = [], i, j, ids = [], pid = patches.length, l0 = [], l1 = [];
      for (i = 0; i <= n; i++) {
        g.push([]);
        var p0 = lerp(apex, b0, i / n), p1 = lerp(apex, b1, i / n);
        for (j = 0; j <= i; j++) { g[i].push(vid(i ? lerp(p0, p1, j / i) : apex)); ids.push(g[i][j]); }
        l0.push(g[i][0]); l1.push(g[i][i]);
      }
      for (i = 0; i < n; i++) for (j = 0; j <= i; j++) {
        tris.push(g[i][j], g[i + 1][j], g[i + 1][j + 1]); kind.push('tri'); patch.push(pid);
        if (j < i) { tris.push(g[i][j], g[i + 1][j + 1], g[i][j + 1]); kind.push('tri'); patch.push(pid); }
      }
      var loop = l0.slice();
      for (j = 1; j <= n; j++) loop.push(g[n][j]);
      for (i = n - 1; i >= 1; i--) loop.push(g[i][i]);
      patches.push({ kind: 'tri', ids: ids, loop: loop });
      lines.push(l0, l1);
    }
    var sq = quad(Q(-1, -1), Q(1, -1), Q(1, 1), Q(-1, 1), 'square'), r;
    lines.push(sq[0].slice(), sq[n].slice(), sq.map(function (row) { return row[0]; }), sq.map(function (row) { return row[n]; }));
    for (var s = -1; s <= 1; s += 2) for (var z = -1; z <= 1; z += 2) {
      quad(Q(-1, s), Q(1, s), F(1, s, z), F(-1, s, z), 'bent');
      quad(Q(s, -1), Q(s, 1), F(s, 1, z), F(s, -1, z), 'bent');
    }
    for (var a = -1; a <= 1; a += 2) for (var b = -1; b <= 1; b += 2) tri(Q(a, b), F(a, b, -1), F(a, b, 1));
    var corners = [vid(Q(-1, -1)), vid(Q(1, -1)), vid(Q(1, 1)), vid(Q(-1, 1))];

    var x = Float64Array.from(X), N = x.length, T = Int32Array.from(tris), NT = T.length / 3, G = new Float64Array(N);
    var free = new Uint8Array(N / 3);
    for (r = 0; r < N / 3; r++) free[r] = held[r] ? 0 : 1;

    function evaluate(y, grad) {
      var A = 0, k, i;
      if (grad) G.fill(0);
      for (k = 0; k < NT; k++) {
        var ia = T[3 * k] * 3, ib = T[3 * k + 1] * 3, ic = T[3 * k + 2] * 3;
        var ux = y[ib] - y[ia], uy = y[ib + 1] - y[ia + 1], uz = y[ib + 2] - y[ia + 2];
        var vx = y[ic] - y[ia], vy = y[ic + 1] - y[ia + 1], vz = y[ic + 2] - y[ia + 2];
        var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, L = Math.sqrt(nx * nx + ny * ny + nz * nz);
        A += L / 2;
        if (!grad || L < 1e-300) continue;
        var hx = nx / L / 2, hy = ny / L / 2, hz = nz / L / 2;
        var ex = y[ib] - y[ic], ey = y[ib + 1] - y[ic + 1], ez = y[ib + 2] - y[ic + 2];
        G[ia] += ey * hz - ez * hy; G[ia + 1] += ez * hx - ex * hz; G[ia + 2] += ex * hy - ey * hx;
        ex = y[ic] - y[ia]; ey = y[ic + 1] - y[ia + 1]; ez = y[ic + 2] - y[ia + 2];
        G[ib] += ey * hz - ez * hy; G[ib + 1] += ez * hx - ex * hz; G[ib + 2] += ex * hy - ey * hx;
        ex = y[ia] - y[ib]; ey = y[ia + 1] - y[ib + 1]; ez = y[ia + 2] - y[ib + 2];
        G[ic] += ey * hz - ez * hy; G[ic + 1] += ez * hx - ex * hz; G[ic + 2] += ex * hy - ey * hx;
      }
      if (grad) for (i = 0; i < N / 3; i++) if (!free[i]) { G[3 * i] = 0; G[3 * i + 1] = 0; G[3 * i + 2] = 0; }
      return A;
    }

    // Conjugate gradients (Polak-Ribiere, restarted) with a parabola line search, as in evolver.js.
    var dir = new Float64Array(N), gPrev = new Float64Array(N), trial = new Float64Array(N), have = false, hStep = 0.05, iters = 0;
    function vdot(p, q) { var sum = 0; for (var i = 0; i < N; i++) sum += p[i] * q[i]; return sum; }
    function areaAt(h) { for (var i = 0; i < N; i++) trial[i] = x[i] + h * dir[i]; return evaluate(trial, false); }
    function stepOnce() {
      var a0 = evaluate(x, true), gg = vdot(G, G), i;
      if (gg < 1e-30) return;
      var beta = 0;
      if (have && iters % 50 !== 0) {
        var num = 0, den = vdot(gPrev, gPrev);
        for (i = 0; i < N; i++) num += G[i] * (G[i] - gPrev[i]);
        beta = Math.max(0, num / den);
      }
      for (i = 0; i < N; i++) dir[i] = -G[i] + beta * dir[i];
      var slope = vdot(G, dir);
      if (slope >= 0) { for (i = 0; i < N; i++) dir[i] = -G[i]; slope = -gg; }
      gPrev.set(G); have = true; iters++;
      var h = hStep, a1 = areaAt(h), tries = 0;
      while (a1 > a0 && tries++ < 30) { h /= 4; a1 = areaAt(h); }
      var curv = (a1 - a0 - slope * h) / (h * h), hb = curv > 0 ? -slope / (2 * curv) : 2 * h;
      hb = Math.min(hb, 4 * h);
      if (areaAt(hb) > a1) hb = h;
      for (i = 0; i < N; i++) x[i] += hb * dir[i];
      hStep = Math.max(1e-7, Math.min(2, hb * 1.5));
    }
    function side() { var p = corners[0] * 3, q = corners[1] * 3; return Math.hypot(x[p] - x[q], x[p + 1] - x[q + 1], x[p + 2] - x[q + 2]); }
    function P(i) { return [x[3 * i], x[3 * i + 1], x[3 * i + 2]]; }
    // Largest distance of each kind of film from the flat sheet through its frame edge and
    // the central square's corners (flat sheets by symmetry, if the film is flat at all).
    function bend() {
      var out = { square: 0, bent: 0, tri: 0 };
      patches.forEach(function (pt) {
        var o, nrm;
        if (pt.kind === 'square') { o = [0, 0, 0]; nrm = [0, 0, 1]; }
        else {
          // the plane through the patch's first, last and one other corner as they are now
          var p0 = P(pt.ids[0]), p1 = P(pt.ids[pt.ids.length - 1]), p2 = P(pt.kind === 'tri' ? pt.ids[pt.ids.length - 1 - n] : pt.ids[n]);
          var u = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], v = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
          nrm = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
          var L = Math.hypot(nrm[0], nrm[1], nrm[2]); nrm = [nrm[0] / L, nrm[1] / L, nrm[2] / L]; o = p0;
        }
        pt.ids.forEach(function (i) {
          var p = P(i), dist = Math.abs((p[0] - o[0]) * nrm[0] + (p[1] - o[1]) * nrm[1] + (p[2] - o[2]) * nrm[2]);
          if (dist > out[pt.kind]) out[pt.kind] = dist;
        });
      });
      return out;
    }
    // Angle between the two sides of the central square at one of its corners, from the
    // first two mesh segments of each side (the same one-sided estimate as evolver.js).
    function cornerAngle() {
      function tangent(row) {
        var p0 = P(row[0]), p1 = P(row[1]), p2 = P(row[2]);
        var d1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], d2 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
        var tt = [3 * d1[0] - d2[0], 3 * d1[1] - d2[1], 3 * d1[2] - d2[2]], L = Math.hypot(tt[0], tt[1], tt[2]);
        return [tt[0] / L, tt[1] / L, tt[2] / L];
      }
      var a = tangent(sq[0]), b = tangent(sq.map(function (row) { return row[0]; }));
      return Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) * 180 / Math.PI;
    }

    return {
      x: x, tris: T, kind: kind, triangles: NT, vertices: N / 3, lines: lines, corners: corners,
      films: patches.map(function (pt) { return { kind: pt.kind, loop: pt.loop }; }),   // the 13 films as boundary loops
      area: function () { return evaluate(x, false); },
      step: function (k) { for (var i = 0; i < (k || 1); i++) stepOnce(); return evaluate(x, false); },
      pin: function (on) { corners.forEach(function (c) { free[c] = on ? 0 : 1; }); have = false; },
      side: side, bend: bend, cornerAngle: cornerAngle
    };
  }

  // ---------- Kelvin's relaxed cell, one wall at a time ----------
  var bccFoam = null;
  function bcc() { return bccFoam || (bccFoam = Cells().foam(Cells().sites.bcc())); }
  function relaxed(level, steps) {
    var m = Evolver().build(Cells().weld(bcc()), level);
    if (steps) m.step(steps);
    return m;
  }

  // Wall fi of an evolver mesh of the BCC foam, in the frame of its own flat face: x, y in
  // the flat plane from the face's center, h the height above it (toward the neighbor).
  // The x axis points at the middle of a rising edge (hexagon) or of any edge (square).
  function faceMap(mesh, fi) {
    var C = Cells(), V = C.vec, sites = bcc().sites, f = mesh.faces[fi];
    var nv = V.sub(V.add(sites[f.b], f.T), sites[f.a]), n = V.unit(nv), mid = V.add(sites[f.a], V.mul(nv, 0.5));
    var src = mesh.cellTriangles(f.a).filter(function (t) { return t.face === fi && V.dot(V.sub(C.polyCentroid(t.pts), sites[f.a]), n) > 0; });
    var flatFace = bcc().cells[f.a].faces.filter(function (g) { return g.j === f.b && g.T[0] === f.T[0] && g.T[1] === f.T[1] && g.T[2] === f.T[2]; })[0];
    var flatPts = flatFace.pts.map(function (p) { return V.sub(p, mid); });
    var edge = V.len(V.sub(flatPts[1], flatPts[0])), apothem = Math.abs(V.dot(V.unit(V.add(flatPts[0], flatPts[1])), flatPts[0]));
    // axis: toward the highest point if the wall bends, else toward the middle of an edge
    var top = null, hTop = 1e-7;
    src.forEach(function (t) { t.pts.forEach(function (p) { var h = V.dot(V.sub(p, mid), n); if (h > hTop) { hTop = h; top = p; } }); });
    var u = top ? V.sub(V.sub(top, mid), V.mul(n, hTop)) : V.add(flatPts[0], flatPts[1]);
    // snap to the nearest flat edge normal so coarse and fine meshes share one frame
    var best = null, bestDot = -Infinity;
    for (var e = 0; e < flatPts.length; e++) {
      var en = V.unit(V.add(flatPts[e], flatPts[(e + 1) % flatPts.length])), dd = V.dot(en, V.unit(u));
      if (dd > bestDot) { bestDot = dd; best = en; }
    }
    u = best; var v = V.cross(n, u);
    function local(p) { var q = V.sub(p, mid); return [V.dot(q, u), V.dot(q, v), V.dot(q, n)]; }
    var tris = [], rim = [], area = 0, hMax = -Infinity, hMin = Infinity;
    src.forEach(function (t) {
      var q = t.pts.map(local);
      tris.push(q);
      area += V.len(V.cross(V.sub(t.pts[1], t.pts[0]), V.sub(t.pts[2], t.pts[0]))) / 2;
      for (var i = 0; i < 3; i++) {
        if (q[i][2] > hMax) hMax = q[i][2];
        if (q[i][2] < hMin) hMin = q[i][2];
        if (t.edges[i]) rim.push([q[i], q[(i + 1) % 3]]);
      }
    });
    // the rim point straight out along each flat edge normal: where the middle of that edge went
    var mids = [];
    for (e = 0; e < flatPts.length; e++) {
      var en2 = V.unit(V.add(flatPts[e], flatPts[(e + 1) % flatPts.length])), ex = V.dot(en2, u), ey = V.dot(en2, v), pick = null, off = Infinity;
      rim.forEach(function (sg) {
        sg.forEach(function (p) { var along = p[0] * ex + p[1] * ey, across = Math.abs(-p[0] * ey + p[1] * ex); if (along > 0 && across < off) { off = across; pick = p; } });
      });
      mids.push({ r: pick[0] * ex + pick[1] * ey, h: pick[2], angle: Math.atan2(ey, ex) });
    }
    var flatArea = C.polyArea(flatFace.pts);
    return {
      sides: f.sides, tris: tris, rim: rim, flat: flatPts.map(function (p) { return [V.dot(p, u), V.dot(p, v)]; }),
      edge: edge, apothem: apothem, hMax: hMax, hMin: hMin, area: area, flatArea: flatArea, mids: mids,
      // how far the middle of an edge has moved from the middle of the flat edge, in space
      bow: Math.max.apply(null, mids.map(function (m) { return Math.hypot(m.r - apothem, m.h); }))
    };
  }
  // Mesh points on the line from the center toward the middle of a rising edge: [[r, h], ...]
  function ray(map) {
    var seen = {}, out = [[0, 0]];
    map.tris.forEach(function (t) { t.forEach(function (p) { if (Math.abs(p[1]) < 1e-7 && p[0] > 1e-7) { var k = p[0].toFixed(6); if (!seen[k]) { seen[k] = 1; out.push([p[0], p[2]]); } } }); });
    return out.sort(function (a, b) { return a[0] - b[0]; });
  }

  // Thomson (1887), section 17, equation (10): z = 0.03626 r^3 cos 3 phi - 0.001561 r^9 cos 9 phi,
  // with lengths in units of the hexagon's apothem and phi measured from a rising edge's middle.
  function kelvinZ(r, phi) { return 0.03626 * Math.pow(r, 3) * Math.cos(3 * phi) - 0.001561 * Math.pow(r, 9) * Math.cos(9 * phi); }

  // Cut a triangle of [x, y, h] corners into the pieces lying between successive levels.
  // -> [{ band: i, pts: [[x, y], ...] }] with band i between levels[i] and levels[i + 1].
  function bands(tri, levels) {
    function clip(poly, lv, keepAbove) {
      var out = [];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length], da = (a[2] - lv) * (keepAbove ? 1 : -1), db = (b[2] - lv) * (keepAbove ? 1 : -1);
        if (da >= 0) out.push(a);
        if ((da > 0 && db < 0) || (da < 0 && db > 0)) { var s = da / (da - db); out.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, lv]); }
      }
      return out;
    }
    var lo = Math.min(tri[0][2], tri[1][2], tri[2][2]), hi = Math.max(tri[0][2], tri[1][2], tri[2][2]), out = [];
    for (var i = 0; i + 1 < levels.length; i++) {
      if (levels[i + 1] <= lo && i + 2 < levels.length) continue;
      if (levels[i] >= hi && i > 0) continue;
      var poly = tri;
      if (i > 0) poly = clip(poly, levels[i], true);
      if (i + 2 < levels.length) poly = clip(poly, levels[i + 1], false);
      if (poly.length >= 3) out.push({ band: i, pts: poly.map(function (p) { return [p[0], p[1]]; }) });
    }
    return out;
  }

  // Where a triangle of [x, y, h] corners crosses each level: [[[x, y], [x, y]], ...]
  function contours(tri, levels) {
    var out = [];
    levels.forEach(function (lv) {
      var pts = [];
      for (var i = 0; i < 3; i++) {
        var a = tri[i], b = tri[(i + 1) % 3], da = a[2] - lv, db = b[2] - lv;
        if ((da > 0 && db <= 0) || (da <= 0 && db > 0)) { var s = da / (da - db); pts.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]); }
      }
      if (pts.length === 2) out.push(pts);
    });
    return out;
  }

  // Limit of a sequence a, b, c whose steps shrink by a constant ratio (Richardson).
  function richardson(a, b, c) { var d1 = a - b, d2 = b - c, ratio = d1 / d2; return { ratio: ratio, limit: c - d2 / (ratio - 1) }; }

  // Share of faces by number of sides, over all cells of a cells.js foam, and faces per cell.
  function faceMix(fm) {
    var count = {}, total = 0;
    fm.cells.forEach(function (c) { c.faces.forEach(function (f) { count[f.pts.length] = (count[f.pts.length] || 0) + 1; total++; }); });
    var share = {};
    Object.keys(count).forEach(function (k) { share[k] = count[k] / total; });
    return { share: share, facesPerCell: total / fm.cells.length };
  }

  // Edges meeting at each corner of a foam: { edges per corner: number of corners }.
  function vertexCensus(fm) {
    var w = Cells().weld(fm), seen = {}, deg = {};
    w.faces.forEach(function (f) {
      for (var i = 0; i < f.loop.length; i++) {
        var p = f.loop[i], q = f.loop[(i + 1) % f.loop.length], d = [q.o[0] - p.o[0], q.o[1] - p.o[1], q.o[2] - p.o[2]], flip = p.v > q.v;
        if (p.v === q.v) flip = d[0] < 0 || (d[0] === 0 && (d[1] < 0 || (d[1] === 0 && d[2] < 0)));
        var k = flip ? q.v + ':' + p.v + ':' + (-d[0]) + ',' + (-d[1]) + ',' + (-d[2]) : p.v + ':' + q.v + ':' + d[0] + ',' + d[1] + ',' + d[2];
        if (seen[k]) continue;
        seen[k] = 1; deg[p.v] = (deg[p.v] || 0) + 1; deg[q.v] = (deg[q.v] || 0) + 1;
      }
    });
    var census = {};
    Object.keys(deg).forEach(function (vx) { census[deg[vx]] = (census[deg[vx]] || 0) + 1; });
    return census;
  }

  // ---------- checks ----------
  function runChecks() {
    var C = Cells(), E = Evolver(), out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: detail == null ? '' : String(detail) }); }
    function near(name, got, want, tol) { ok(name, Math.abs(got - want) < (tol || 1e-9), got + ' vs ' + want); }

    // the truncation family
    var k = family(KELVIN), flat = (6 + 12 * Math.sqrt(3)) / Math.pow(8 * Math.SQRT2, 2 / 3);
    near('03 family at depth 1/3 costs (6 + 12 sqrt 3) / (8 sqrt 2)^(2/3)', k.cost, flat, 1e-12);
    near('03 family at depth 1/3 matches the BCC cell of cells.js', k.cost, bcc().s, 1e-12);
    ok('03 Kelvin cell: unit edges, 6 unit squares, hexagons of area 3 sqrt 3 / 2, volume 8 sqrt 2',
      Math.abs(k.squareSide - 1) < 1e-12 && Math.abs(k.hexSides[1] - 1) < 1e-12 && Math.abs(k.squareArea - 1) < 1e-12 && Math.abs(k.hexArea - 1.5 * Math.sqrt(3)) < 1e-12 && Math.abs(k.volume - 8 * Math.SQRT2) < 1e-12,
      [k.squareSide, k.hexSides[1], k.squareArea, k.hexArea, k.volume].join(' '));
    var worst = 0;
    [0.05, 0.2, KELVIN, 0.4, ROUNDEST, 0.48].forEach(function (d) {
      var g = family(d), poly = g.faces.map(function (f) { return { pts: f.idx.map(function (i) { return g.verts[i]; }) }; });
      var a = 0, vol = 0;
      poly.forEach(function (f) { var av = C.polyVec(f.pts), cen = C.polyCentroid(f.pts); a += C.vec.len(av); vol += Math.abs(C.vec.dot(cen, av)) / 3; });
      worst = Math.max(worst, Math.abs(a - g.area), Math.abs(vol - g.volume));
    });
    ok('03 family: area and volume formulas match the polyhedron built from its corners', worst < 1e-9, 'worst error ' + worst);
    near('03 depth 0 is the octahedron, cost 2 sqrt 3 / (sqrt 2 / 3)^(2/3)', family(0).cost, 2 * Math.sqrt(3) / Math.pow(Math.SQRT2 / 3, 2 / 3), 1e-12);
    near('03 depth 1/2 is the cuboctahedron, cost (6 + 2 sqrt 3) / (5 sqrt 2 / 3)^(2/3)', family(0.5).cost, (6 + 2 * Math.sqrt(3)) / Math.pow(5 * Math.SQRT2 / 3, 2 / 3), 1e-12);
    var bestD = 0, bestCost = Infinity;
    for (var i = 0; i <= 50000; i++) { var dd = i / 100000, cc = family(dd).cost; if (cc < bestCost) { bestCost = cc; bestD = dd; } }
    ok('03 the cheapest cut is at depth 1 - 1/sqrt 3 = 0.42265, cost 5.2499', Math.abs(bestD - ROUNDEST) < 2e-5 && Math.abs(bestCost - 5.24987) < 5e-5, bestD + ' ' + bestCost);
    var rr = family(ROUNDEST);
    near('03 at that depth all 14 faces are the same distance from the center', rr.inradii[0], rr.inradii[1], 1e-12);
    ok('03 fill is 1 at depth 1/3 and below 1 elsewhere', Math.abs(family(KELVIN).fill - 1) < 1e-12 && [0, 0.1, 0.3, 0.34, 0.4, 0.5].every(function (d) { return family(d).fill < 1; }),
      [0, 0.3, 0.34, ROUNDEST, 0.5].map(function (d) { return family(d).fill.toFixed(4); }).join(' '));
    ok('03 fill: octahedra 1/3, roundest cut 0.8702, cuboctahedra 45/64', Math.abs(family(0).fill - 1 / 3) < 1e-12 && Math.abs(family(ROUNDEST).fill - 0.8702) < 5e-5 && Math.abs(family(0.5).fill - 45 / 64) < 1e-12, [family(0).fill, family(ROUNDEST).fill, family(0.5).fill].join(' '));
    var covOk = true, covNote = [];
    [0.15, KELVIN, ROUNDEST, 0.5].forEach(function (d) {
      var cv = coverage(d, 20000), want = family(d).fill;
      covNote.push(d.toFixed(3) + ': ' + cv.fill.toFixed(4) + ' vs ' + want.toFixed(4) + ', most ' + cv.most);
      if (cv.most > 1 || Math.abs(cv.fill - want) > 0.004) covOk = false;
    });
    ok('03 fill formula agrees with a sampled count and the copies never overlap', covOk, covNote.join('; '));

    // the film on a cubic frame
    var f0 = frame(6, 0.1);
    near('03 frame: flat films with a square of side 0.1 match the closed form', f0.area(), flatFrameArea(0.1), 1e-12);
    near('03 frame: closing the square gives the twelve-plane cone, 3 sqrt 2', flatFrameArea(0), CONE, 1e-12);
    var fr = frame(8, 0.15); fr.step(400);
    var aRest = fr.area(), sRest = fr.side(), bd = fr.bend();
    ok('03 frame: let go, the film settles below the cone with a square of side 0.17 to 0.20', aRest < CONE - 0.002 && aRest > 4.2394 && sRest > 0.17 && sRest < 0.2, 'area ' + aRest.toFixed(6) + ' vs cone ' + CONE.toFixed(6) + ', side ' + sRest.toFixed(4));
    ok('03 frame: the square and the four triangles stay flat, the eight other films bend', bd.square < 1e-4 && bd.tri < 1e-4 && bd.bent > 1e-2, JSON.stringify(bd));
    ok('03 frame: the square corners open toward 109.47 degrees', Math.abs(fr.cornerAngle() - 109.4712) < 4, fr.cornerAngle().toFixed(2));
    var fp = frame(8, 0.3); fp.pin(true); fp.step(300);
    var fq = frame(8, 0.1); fq.pin(true); fq.step(300);
    ok('03 frame: held at side 0.1 the film is below the cone, at 0.3 above it', fq.area() < CONE && fp.area() > CONE, fq.area().toFixed(6) + ' ' + fp.area().toFixed(6));

    // the relaxed Kelvin cell
    var m = relaxed(2, 300), hi = m.faces.findIndex(function (f) { return f.sides === 6; }), si = m.faces.findIndex(function (f) { return f.sides === 4; });
    var H = faceMap(m, hi), S = faceMap(m, si);
    ok('03 relaxed hexagon rises and dips equally, 2.5 to 2.9 percent of an edge', Math.abs(H.hMax + H.hMin) < 1e-5 && H.hMax / H.edge > 0.025 && H.hMax / H.edge < 0.029, (H.hMax / H.edge).toFixed(5) + ' ' + (H.hMin / H.edge).toFixed(5));
    ok('03 hexagon edges rise and dip in turn', H.mids.every(function (q, j) { return (q.h > 0) === (j % 2 === (H.mids[0].h > 0 ? 0 : 1)); }), H.mids.map(function (q) { return q.h.toFixed(4); }).join(' '));
    ok('03 relaxed square stays flat', Math.max(S.hMax, -S.hMin) / S.edge < 1e-4, Math.max(S.hMax, -S.hMin) / S.edge);
    ok('03 the same edge seen from the square and from the hexagon has moved the same distance', Math.abs(S.bow - H.bow) / S.edge < 2e-3 && S.bow / S.edge > 0.03 && S.bow / S.edge < 0.036, (S.bow / S.edge).toFixed(5) + ' ' + (H.bow / H.edge).toFixed(5));
    ok('03 squares grow and hexagons shrink', S.area > S.flatArea * 1.07 && H.area < H.flatArea * 0.98, (S.area / S.flatArea).toFixed(4) + ' ' + (H.area / H.flatArea).toFixed(4));
    near('03 six squares and eight hexagons add up to the mesh total for one repeat', 6 * S.area + 8 * H.area, m.area(), 1e-5);
    var ry = ray(H), last = ry[ry.length - 1];
    ok('03 Thomson 1887 formula is 3 to 9 percent above the relaxed mesh at the edge', kelvinZ(last[0] / H.apothem, 0) * H.apothem / last[1] > 1.03 && kelvinZ(last[0] / H.apothem, 0) * H.apothem / last[1] < 1.09, (kelvinZ(last[0] / H.apothem, 0) * H.apothem / last[1]).toFixed(4));
    near('03 Thomson formula at r = 1 gives his sagitta 0.0245 after dividing by sqrt 2', kelvinZ(1, 0) / Math.SQRT2, 0.0245, 5e-5);
    var m1 = relaxed(1, 200), m3 = relaxed(3, 500), ex = richardson(m1.s(), m.s(), m3.s());
    ok('03 three meshes extrapolate to 5.3062 to 5.3064 (published 5.30628)', ex.limit > 5.3062 && ex.limit < 5.3064 && ex.ratio > 3 && ex.ratio < 5, [m1.s(), m.s(), m3.s()].map(function (v) { return v.toFixed(6); }).join(' ') + ' -> ' + ex.limit.toFixed(6) + ', ratio ' + ex.ratio.toFixed(2));

    // contour bands
    var tri = [[0, 0, -0.3], [1, 0, 0.9], [0, 1, 0.2]], bsum = 0;
    bands(tri, [-1, -0.2, 0, 0.5, 1]).forEach(function (b) { bsum += C.polyArea(b.pts.map(function (p) { return [p[0], p[1], 0]; })); });
    near('03 contour bands tile the triangle', bsum, 0.5, 1e-12);
    var cseg = contours(tri, [0, 0.5, 2]);
    ok('03 contour segments: one per level inside the range, ends on the level', cseg.length === 2 && Math.abs(cseg[0][0][0] * 1.2 + cseg[0][0][1] * 0.5 - 0.3) < 1e-12, JSON.stringify(cseg));

    // face shapes and corners
    var mk = faceMix(bcc()), mw = faceMix(C.equalVolumeA15().foam);
    ok('03 Kelvin: 6/14 squares, no pentagons, 8/14 hexagons, 14 faces', Math.abs(mk.share[4] - 6 / 14) < 1e-12 && !mk.share[5] && Math.abs(mk.share[6] - 8 / 14) < 1e-12 && mk.facesPerCell === 14, JSON.stringify(mk));
    ok('03 Weaire-Phelan: 96/108 pentagons, 12/108 hexagons, 13.5 faces', !mw.share[4] && Math.abs(mw.share[5] - 96 / 108) < 1e-12 && Math.abs(mw.share[6] - 12 / 108) < 1e-12 && mw.facesPerCell === 13.5, JSON.stringify(mw));
    var fcc = C.foam(C.sites.fcc()), vc = vertexCensus(fcc), vk = vertexCensus(bcc());
    ok('03 rhombic dodecahedron foam: corners with 4 edges and corners with 8', vc[4] === 8 && vc[8] === 4 && Object.keys(vc).length === 2, JSON.stringify(vc));
    ok('03 Kelvin foam: every corner has 4 edges', vk[4] === 12 && Object.keys(vk).length === 1, JSON.stringify(vk));
    var fa = E.build(C.weld(fcc), 0).junctionAngles().film, lo = Math.min.apply(null, fa), hiA = Math.max.apply(null, fa);
    ok('03 rhombic dodecahedron foam: every wall angle is 120 degrees', fa.length > 0 && Math.abs(lo - 120) < 1e-6 && Math.abs(hiA - 120) < 1e-6, lo + ' .. ' + hiA);
    var ka = E.build(C.weld(bcc()), 0).junctionAngles(), ed = ka.edge.map(function (q) { return Math.round(q * 100) / 100; });
    ok('03 flat Kelvin corners: edges meet at 90 (x2) and 120 (x4) degrees', ed.length === 72 && ed.filter(function (q) { return q === 90; }).length === 24 && ed.filter(function (q) { return q === 120; }).length === 48, ed.slice(0, 6).join(' '));
    return out;
  }

  var api = {
    KELVIN: KELVIN, ROUNDEST: ROUNDEST, family: family, coverage: coverage,
    frame: frame, flatFrameArea: flatFrameArea, CONE: CONE,
    relaxed: relaxed, faceMap: faceMap, ray: ray, kelvinZ: kelvinZ, bands: bands, contours: contours, richardson: richardson,
    faceMix: faceMix, vertexCensus: vertexCensus, runChecks: runChecks
  };
  if (inNode) module.exports = api;
  else global.Foam03 = api;
})(typeof window !== 'undefined' ? window : globalThis);
