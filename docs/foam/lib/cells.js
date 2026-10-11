// cells.js — periodic foams as polyhedral complexes, for the Foam series.
// No dependencies; runs in the browser (window.FoamCells) and in node (require).
//
// A foam here is a set of sites in the unit cube, repeated on the cubic lattice.
// Each site owns the points nearer to it than to any other site. With weights the
// test is |x - p_i|^2 - w_i, which slides the flat walls without tilting them (a
// power diagram), so cell volumes can be tuned.
//
// Public API:
//   sites.bcc(), sites.fcc(), sites.sc(), sites.a15()  -> [[x,y,z],...] in the unit cube
//   cell(sites, i, weights)   -> { faces:[{pts, j, T}], volume, area }   convex cell of site i
//   foam(sites, weights)      -> { cells:[...], s }   s = mean cell area / (mean volume)^(2/3)
//   equalVolumeA15()          -> { w, foam }   weight on the 6 column sites that equalizes volumes
//   weld(foam)                -> { verts, faces:[{loop:[{v,o}], a, b, T}] }   shared vertices mod lattice
//   polyArea(pts), polyCentroid(pts), slice(faces, n, d) -> [[x,y,z],...] cross-section polygon
//   runChecks()               -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var EPS = 1e-9;

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a) { return Math.hypot(a[0], a[1], a[2]); }
  function unit(a) { var L = len(a) || 1; return [a[0] / L, a[1] / L, a[2] / L]; }
  function close(a, b) { return Math.abs(a[0] - b[0]) < 1e-7 && Math.abs(a[1] - b[1]) < 1e-7 && Math.abs(a[2] - b[2]) < 1e-7; }

  function polyCentroid(pts) {
    var s = [0, 0, 0];
    pts.forEach(function (p) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; });
    return mul(s, 1 / pts.length);
  }
  // Vector area of a polygon (Newell); its length is the area for a planar polygon.
  function polyVec(pts) {
    var n = [0, 0, 0];
    for (var i = 0; i < pts.length; i++) {
      var c = cross(pts[i], pts[(i + 1) % pts.length]);
      n[0] += c[0]; n[1] += c[1]; n[2] += c[2];
    }
    return mul(n, 0.5);
  }
  function polyArea(pts) { return len(polyVec(pts)); }

  // ---- sites ----
  var sites = {
    sc: function () { return [[0, 0, 0]]; },
    bcc: function () { return [[0, 0, 0], [0.5, 0.5, 0.5]]; },
    fcc: function () { return [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]; },
    // A15 (Cr3Si, beta-tungsten): 2 sites on a BCC lattice, then 6 in pairs along
    // the three face-bisecting lines of the cube. Sites 0-1 become the 12-faced
    // cells, sites 2-7 the 14-faced ones.
    a15: function () {
      return [[0, 0, 0], [0.5, 0.5, 0.5],
        [0.25, 0.5, 0], [0.75, 0.5, 0], [0, 0.25, 0.5], [0, 0.75, 0.5], [0.5, 0, 0.25], [0.5, 0, 0.75]];
    }
  };

  // ---- convex polyhedron clipping ----
  // Faces are point loops, counterclockwise seen from outside.
  function box(c, r) {
    var x0 = c[0] - r, x1 = c[0] + r, y0 = c[1] - r, y1 = c[1] + r, z0 = c[2] - r, z1 = c[2] + r;
    return [
      { pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] },
      { pts: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]] },
      { pts: [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]] },
      { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] },
      { pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] },
      { pts: [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]] }
    ];
  }

  // Keep the part of the polyhedron with n.x <= d; the new face gets `tag` merged in.
  function clip(faces, n, d, tag) {
    var anyOut = false, i, k;
    for (i = 0; i < faces.length && !anyOut; i++)
      for (k = 0; k < faces[i].pts.length; k++) if (dot(n, faces[i].pts[k]) - d > EPS) { anyOut = true; break; }
    if (!anyOut) return faces;

    var out = [], cut = [];
    function pushCut(p) { for (var q = 0; q < cut.length; q++) if (close(cut[q], p)) return; cut.push(p); }
    faces.forEach(function (f) {
      var pts = f.pts, res = [];
      function push(p) { if (!res.length || !close(res[res.length - 1], p)) res.push(p); }
      for (var a = 0; a < pts.length; a++) {
        var A = pts[a], B = pts[(a + 1) % pts.length];
        var da = dot(n, A) - d, db = dot(n, B) - d;
        var sa = da > EPS ? 1 : (da < -EPS ? -1 : 0), sb = db > EPS ? 1 : (db < -EPS ? -1 : 0);
        if (sa <= 0) { push(A); if (sa === 0) pushCut(A); }
        if (sa * sb < 0) {
          var t = da / (da - db), P = add(A, mul(sub(B, A), t));
          push(P); pushCut(P);
        }
      }
      if (res.length > 1 && close(res[0], res[res.length - 1])) res.pop();
      if (res.length >= 3 && polyArea(res) > 1e-12) {
        var g = { pts: res };
        for (var key in f) if (key !== 'pts') g[key] = f[key];
        out.push(g);
      }
    });
    if (cut.length >= 3) {
      var c = polyCentroid(cut), nn = unit(n);
      var ref = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      var u = unit(cross(nn, ref)), v = cross(nn, u);
      cut.sort(function (p, q) {
        var a = sub(p, c), b = sub(q, c);
        return Math.atan2(dot(a, v), dot(a, u)) - Math.atan2(dot(b, v), dot(b, u));
      });
      if (polyArea(cut) > 1e-12) {
        var cap = { pts: cut };
        if (tag) for (var tk in tag) cap[tk] = tag[tk];
        out.push(cap);
      }
    }
    return out;
  }

  function measure(faces) {
    var vol = 0, area = 0;
    faces.forEach(function (f) {
      var a = polyVec(f.pts);
      area += len(a);
      vol += dot(f.pts[0], a) / 3;   // pyramid from the origin over a planar face
    });
    return { volume: vol, area: area };
  }

  // Cell of site i in the periodic power diagram. Each face records the neighbor
  // site j and the lattice translation T of the copy of j across that wall.
  function cell(pts, i, weights) {
    var p = pts[i], wi = weights ? weights[i] : 0, planes = [];
    for (var j = 0; j < pts.length; j++)
      for (var a = -2; a <= 2; a++) for (var b = -2; b <= 2; b++) for (var c = -2; c <= 2; c++) {
        if (j === i && a === 0 && b === 0 && c === 0) continue;
        var q = [pts[j][0] + a, pts[j][1] + b, pts[j][2] + c], wj = weights ? weights[j] : 0;
        var n = sub(q, p);
        var L = len(n);
        // h: distance from the site to this wall's plane
        planes.push({ n: mul(n, 2), d: dot(q, q) - dot(p, p) - wj + wi, h: (L * L + wi - wj) / (2 * L), tag: { j: j, T: [a, b, c] } });
      }
    planes.sort(function (x, y) { return x.h - y.h; });
    var faces = box(p, 2), reach = Infinity;
    for (var k = 0; k < planes.length; k++) {
      var pl = planes[k];
      if (pl.h > reach + 1e-9) break;              // every later plane misses the cell
      var cut = clip(faces, pl.n, pl.d, pl.tag);
      if (cut !== faces) {
        faces = cut; reach = 0;
        faces.forEach(function (f) { f.pts.forEach(function (x) { reach = Math.max(reach, len(sub(x, p))); }); });
      }
    }
    faces = faces.filter(function (f) { return f.j != null; });
    var m = measure(faces.map(function (f) { return { pts: f.pts.map(function (x) { return sub(x, p); }) }; }));
    return { site: i, center: p, faces: faces, volume: m.volume, area: m.area };
  }

  // Whole foam: one cell per site. s is the dimensionless wall cost, cell area over
  // volume^(2/3), averaged over the cells of one repeat.
  function foam(pts, weights) {
    var cells = pts.map(function (_, i) { return cell(pts, i, weights); });
    var area = 0, vol = 0;
    cells.forEach(function (c) { area += c.area; vol += c.volume; });
    var K = cells.length;
    return { sites: pts, weights: weights || null, cells: cells, s: (area / K) / Math.pow(vol / K, 2 / 3) };
  }

  function a15Weights(w) { return [0, 0, w, w, w, w, w, w]; }

  // Plain Voronoi cells of A15 are unequal. Raising the weight of the six column
  // sites pushes their walls outward; bisect for the weight where all eight match.
  function equalVolumeA15() {
    var pts = sites.a15(), lo = -0.05, hi = 0.05, f;
    function gap(w) { f = foam(pts, a15Weights(w)); return f.cells[2].volume - f.cells[0].volume; }
    for (var it = 0; it < 60; it++) {
      var mid = (lo + hi) / 2;
      if (gap(mid) > 0) hi = mid; else lo = mid;
    }
    var w = (lo + hi) / 2;
    return { w: w, foam: foam(pts, a15Weights(w)) };
  }

  // ---- weld: one vertex list shared across cells, modulo the lattice ----
  // A corner is { v, o }: vertex v translated by the integer vector o.
  var SHIFT = [0.137, 0.291, 0.419];   // keeps wrapped coordinates away from the 0/1 seam
  function weld(fm) {
    var verts = [], index = {}, faces = [];
    function corner(p) {
      var q = add(p, SHIFT), o = [Math.floor(q[0]), Math.floor(q[1]), Math.floor(q[2])];
      var r = sub(q, o);
      var key = Math.round(r[0] * 1e6) + ',' + Math.round(r[1] * 1e6) + ',' + Math.round(r[2] * 1e6);
      if (index[key] == null) { index[key] = verts.length; verts.push(sub(p, o)); }
      return { v: index[key], o: o };
    }
    fm.cells.forEach(function (c) {
      c.faces.forEach(function (f) {
        var T = f.T, first = f.j > c.site || (f.j === c.site && (T[0] > 0 || (T[0] === 0 && (T[1] > 0 || (T[1] === 0 && T[2] > 0)))));
        if (!first) return;
        faces.push({ loop: f.pts.map(corner), a: c.site, b: f.j, T: T, sides: f.pts.length });
      });
    });
    return { verts: verts, faces: faces, cells: fm.cells.length };
  }

  // Cross-section of a convex cell with the plane n.x = d: an ordered polygon, or null.
  function slice(faces, n, d) {
    var cut = [];
    function pushCut(p) { for (var q = 0; q < cut.length; q++) if (close(cut[q], p)) return; cut.push(p); }
    faces.forEach(function (f) {
      for (var a = 0; a < f.pts.length; a++) {
        var A = f.pts[a], B = f.pts[(a + 1) % f.pts.length], da = dot(n, A) - d, db = dot(n, B) - d;
        if (Math.abs(da) <= EPS) pushCut(A);
        else if (da * db < 0 && Math.abs(db) > EPS) pushCut(add(A, mul(sub(B, A), da / (da - db))));
      }
    });
    if (cut.length < 3) return null;
    var c = polyCentroid(cut), nn = unit(n), ref = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    var u = unit(cross(nn, ref)), v = cross(nn, u);
    cut.sort(function (p, q) {
      var a = sub(p, c), b = sub(q, c);
      return Math.atan2(dot(a, v), dot(a, u)) - Math.atan2(dot(b, v), dot(b, u));
    });
    return polyArea(cut) > 1e-12 ? cut : null;
  }

  // ---- checks against closed forms and counts ----
  function runChecks() {
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: detail }); }
    function near(name, got, want, tol) { ok(name, Math.abs(got - want) < (tol || 1e-9), got + ' vs ' + want); }
    function sideCounts(c) { var h = {}; c.faces.forEach(function (f) { h[f.pts.length] = (h[f.pts.length] || 0) + 1; }); return h; }

    var sc = foam(sites.sc());
    near('simple cubic cell is the unit cube, s = 6', sc.s, 6);

    var bcc = foam(sites.bcc()), h = sideCounts(bcc.cells[0]);
    ok('BCC cell has 6 squares and 8 hexagons', h[4] === 6 && h[6] === 8 && bcc.cells[0].faces.length === 14, JSON.stringify(h));
    near('BCC cell volume 1/2', bcc.cells[0].volume, 0.5);
    near('BCC s = (6 + 12 sqrt 3) / (8 sqrt 2)^(2/3)', bcc.s, (6 + 12 * Math.sqrt(3)) / Math.pow(8 * Math.sqrt(2), 2 / 3));

    var fcc = foam(sites.fcc()), hf = sideCounts(fcc.cells[0]);
    ok('FCC cell has 12 rhombic faces', hf[4] === 12 && fcc.cells[0].faces.length === 12, JSON.stringify(hf));
    near('FCC s = 3 * 2^(5/6) (rhombic dodecahedron)', fcc.s, 3 * Math.pow(2, 5 / 6));

    var plain = foam(sites.a15()), h0 = sideCounts(plain.cells[0]), h2 = sideCounts(plain.cells[2]);
    ok('A15 site 0 cell: 12 pentagons', h0[5] === 12 && plain.cells[0].faces.length === 12, JSON.stringify(h0));
    ok('A15 site 2 cell: 12 pentagons + 2 hexagons', h2[5] === 12 && h2[6] === 2 && plain.cells[2].faces.length === 14, JSON.stringify(h2));
    var tot = 0; plain.cells.forEach(function (c) { tot += c.volume; });
    near('A15 Voronoi cells fill the unit cube', tot, 1);
    ok('A15 plain Voronoi volumes are unequal', Math.abs(plain.cells[0].volume - plain.cells[2].volume) > 1e-3,
      plain.cells[0].volume.toFixed(6) + ' vs ' + plain.cells[2].volume.toFixed(6));

    var eq = equalVolumeA15(), vmin = Infinity, vmax = -Infinity;
    eq.foam.cells.forEach(function (c) { vmin = Math.min(vmin, c.volume); vmax = Math.max(vmax, c.volume); });
    ok('weighted A15 volumes all 1/8', Math.abs(vmin - 0.125) < 1e-10 && Math.abs(vmax - 0.125) < 1e-10, vmin + ' .. ' + vmax + ' at w = ' + eq.w);
    var he = sideCounts(eq.foam.cells[0]), he2 = sideCounts(eq.foam.cells[2]);
    ok('weighted A15 keeps 12 and 12+2 faces', he[5] === 12 && he2[5] === 12 && he2[6] === 2, JSON.stringify(he) + ' ' + JSON.stringify(he2));

    var wp = weld(eq.foam), edges = {};
    wp.faces.forEach(function (f) {
      for (var i = 0; i < f.loop.length; i++) {
        var p = f.loop[i], q = f.loop[(i + 1) % f.loop.length];
        var k = p.v < q.v ? p.v + ':' + q.v + ':' + sub(q.o, p.o).join(',') : q.v + ':' + p.v + ':' + sub(p.o, q.o).join(',');
        if (p.v === q.v) { var dd = sub(q.o, p.o), neg = dd[0] < 0 || (dd[0] === 0 && (dd[1] < 0 || (dd[1] === 0 && dd[2] < 0))); k = p.v + ':' + p.v + ':' + (neg ? mul(dd, -1) : dd).join(','); }
        edges[k] = (edges[k] || 0) + 1;
      }
    });
    var E = Object.keys(edges).length, three = Object.keys(edges).every(function (k) { return edges[k] === 3; });
    ok('Weaire-Phelan repeat: 46 vertices, 92 edges, 54 faces, 8 cells', wp.verts.length === 46 && E === 92 && wp.faces.length === 54, wp.verts.length + ' ' + E + ' ' + wp.faces.length);
    ok('every edge borders exactly three faces', three);

    var kv = weld(bcc);
    ok('Kelvin repeat (2 cells): 12 vertices, 14 faces', kv.verts.length === 12 && kv.faces.length === 14, kv.verts.length + ' ' + kv.faces.length);

    var sq = slice(sc.cells[0].faces, [0, 0, 1], 0.2);
    near('slice of the unit cube is a unit square', sq ? polyArea(sq) : -1, 1);
    return out;
  }

  var api = {
    sites: sites, cell: cell, foam: foam, a15Weights: a15Weights, equalVolumeA15: equalVolumeA15,
    weld: weld, slice: slice, clip: clip, box: box, measure: measure,
    polyArea: polyArea, polyVec: polyVec, polyCentroid: polyCentroid, runChecks: runChecks,
    vec: { sub: sub, add: add, mul: mul, dot: dot, cross: cross, len: len, unit: unit }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamCells = api;
})(typeof window !== 'undefined' ? window : globalThis);
