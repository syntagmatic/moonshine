// 07-law3d.js — the three-dimensional growth law evaluated on foam cells, for
// "Foams in Motion". Needs cells.js and evolver.js (window.FoamCells, window.FoamEvolver
// in the browser; require()d in node). Exposes window.FoamLaw3D.
//
// THE LAW. MacPherson and Srolovitz (2007): a cell D whose walls move in proportion to
// their mean curvature, and meet in threes at 120 degrees, changes volume at
//
//     dV/dt = -2 pi M gamma ( L(D) - (1/6) E(D) )
//
// where E is the total length of the cell's triple lines and L is its mean width. For a
// cell with flat facets the mean width is a sum over every edge of the facets,
//
//     L = (1 / 2 pi) sum_i e_i a_i
//
// with e_i the edge's length and a_i its exterior angle: the angle between the outward
// normals of the two facets it joins, positive where the cell is convex. (Lazar, Mason,
// MacPherson and Srolovitz, "A more accurate three-dimensional grain growth algorithm",
// eqs. 1, 3 and 4. A cube of side a has L = 3a and a ball of radius r has L = 4r.)
// Nothing here knows which cells should grow: the code adds up edge lengths and angles
// on the triangle mesh that evolver.js hands back.
//
// For a soap foam in equilibrium the same number is the gas the cell loses: every wall
// has constant mean curvature (pressure difference over tension), a triple line turns by
// pi/3, and so 2 pi (L - E/6) is the sum over the walls of pressure difference times
// area.
//
// Public API:
//   meanWidth(tris)            tris: [{pts:[p0,p1,p2], edges:[bool x3]}] closed, outward
//                              -> { L, E, excess: L - E/6, area, volume, open }
//   weightFor(kind, ratio)     the site weight that gives the two cell classes that
//                              volume ratio. kind 'wp' (dodecahedron over fourteen-faced
//                              cell) or 'kelvin' (one cell of the repeat over the other)
//   model(kind, ratio, refine) -> { mesh, kind, ratio, cells:[a, b], counts:[na, nb] }
//   measure(model)             -> [{ faces, volume, L, E, excess, rate }, same for b]
//                              rate = dV/dt in units of 2 pi M gamma (mean cell volume)^(1/3)
//   RANGE                      volume ratios over which each foam keeps its faces
//   runChecks()                -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var node = typeof module !== 'undefined' && module.exports;
  var Cells = node ? require('./cells.js') : global.FoamCells;
  var Evolver = node ? require('./evolver.js') : global.FoamEvolver;
  var PI = Math.PI;

  function meanWidth(tris) {
    var map = {}, normals = [], area = 0, vol = 0, t, i;
    function key(p) { return Math.round(p[0] * 1e7) + ',' + Math.round(p[1] * 1e7) + ',' + Math.round(p[2] * 1e7); }
    for (t = 0; t < tris.length; t++) {
      var P = tris[t].pts, a = P[0], b = P[1], c = P[2];
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1e-300;
      area += nl / 2; normals.push([nx / nl, ny / nl, nz / nl]);
      vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
      for (i = 0; i < 3; i++) {
        var p = P[i], q = P[(i + 1) % 3], kp = key(p), kq = key(q), k = kp < kq ? kp + '|' + kq : kq + '|' + kp;
        (map[k] || (map[k] = [])).push({ t: t, p: p, q: q, triple: !!(tris[t].edges && tris[t].edges[i]) });
      }
    }
    var turn = 0, E = 0, open = 0;
    Object.keys(map).forEach(function (k) {
      var list = map[k];
      if (list.length !== 2) { open++; return; }
      var A = list[0], n1 = normals[A.t], n2 = normals[list[1].t];
      var dx = A.q[0] - A.p[0], dy = A.q[1] - A.p[1], dz = A.q[2] - A.p[2], len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      // signed exterior angle about the edge as the first triangle runs along it
      var cx = n1[1] * n2[2] - n1[2] * n2[1], cy = n1[2] * n2[0] - n1[0] * n2[2], cz = n1[0] * n2[1] - n1[1] * n2[0];
      var sin = (cx * dx + cy * dy + cz * dz) / len, cos = n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2];
      turn += len * Math.atan2(sin, cos);
      if (A.triple || list[1].triple) E += len;
    });
    var L = turn / (2 * PI);
    return { L: L, E: E, excess: L - E / 6, area: area, volume: vol, open: open };
  }

  // Two classes of cell per foam: [index of a cell of class a, of class b], and how many
  // of each there are in one repeat.
  var KIND = {
    wp: { sites: function () { return Cells.sites.a15(); }, weights: function (w) { return Cells.a15Weights(w); }, cells: [0, 2], counts: [2, 6], lo: -0.07, hi: 0.08, sign: -1 },
    kelvin: { sites: function () { return Cells.sites.bcc(); }, weights: function (w) { return [w, 0]; }, cells: [0, 1], counts: [1, 1], lo: -0.22, hi: 0.22, sign: 1 }
  };
  // The cells keep their faces (12 pentagons; 12 pentagons and 2 hexagons; 6 squares
  // and 8 hexagons) across these volume ratios, checked in runChecks.
  var RANGE = { wp: [0.5, 1.8], kelvin: [0.4, 2.5] };

  function flatFoam(kind, w) { var K = KIND[kind]; return Cells.foam(K.sites(), K.weights(w)); }
  function ratioOf(kind, fm) { var K = KIND[kind]; return fm.cells[K.cells[0]].volume / fm.cells[K.cells[1]].volume; }

  function weightFor(kind, ratio) {
    var K = KIND[kind], lo = K.lo, hi = K.hi;
    for (var it = 0; it < 34; it++) {
      var mid = (lo + hi) / 2, r = ratioOf(kind, flatFoam(kind, mid));
      if ((r > ratio) === (K.sign > 0)) hi = mid; else lo = mid;
    }
    return (lo + hi) / 2;
  }

  function faceCounts(cell) {
    var h = {};
    cell.faces.forEach(function (f) { h[f.pts.length] = (h[f.pts.length] || 0) + 1; });
    return h;
  }

  function model(kind, ratio, refine) {
    var K = KIND[kind], w = weightFor(kind, ratio), fm = flatFoam(kind, w);
    return {
      kind: kind, ratio: ratioOf(kind, fm), weight: w, cells: K.cells.slice(), counts: K.counts.slice(),
      faces: K.cells.map(function (k) { return faceCounts(fm.cells[k]); }),
      mesh: Evolver.build(Cells.weld(fm), refine === undefined ? (kind === 'wp' ? 1 : 2) : refine)
    };
  }

  function measure(m) {
    var vols = m.mesh.volumes(), mean = 0;
    vols.forEach(function (v) { mean += v; }); mean /= vols.length;
    var unit = Math.pow(mean, 1 / 3);
    return m.cells.map(function (k, i) {
      var w = meanWidth(m.mesh.cellTriangles(k)), nf = 0;
      Object.keys(m.faces[i]).forEach(function (s) { nf += m.faces[i][s]; });
      return { faces: nf, faceCounts: m.faces[i], volume: w.volume / mean, L: w.L / unit, E: w.E / unit, excess: w.excess / unit, rate: -w.excess / unit, area: w.area / (unit * unit), open: w.open };
    });
  }

  // ---------------------------------------------------------------- checks
  function runChecks() {
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: String(detail) }); }
    function tri(a, b, c) { return { pts: [a, b, c], edges: [false, false, false] }; }

    // 1. A unit cube: 12 edges of length 1, each turning pi/2.
    (function () {
      var v = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
      var quads = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]], tris = [];
      quads.forEach(function (q) { tris.push(tri(v[q[0]], v[q[1]], v[q[2]]), tri(v[q[0]], v[q[2]], v[q[3]])); });
      var w = meanWidth(tris);
      ok('mean width of the unit cube is 3', Math.abs(w.L - 3) < 1e-12 && Math.abs(w.volume - 1) < 1e-12 && w.open === 0, w.L + ', volume ' + w.volume);
    })();

    // 2. A ball: an octahedron split four times and pushed out to the unit sphere.
    (function () {
      var T = [];
      [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]].forEach(function (s) {
        var a = [s[0], 0, 0], b = [0, s[1], 0], c = [0, 0, s[2]];
        T.push(s[0] * s[1] * s[2] > 0 ? [a, b, c] : [a, c, b]);
      });
      function mid(p, q) { var m = [p[0] + q[0], p[1] + q[1], p[2] + q[2]], l = Math.hypot(m[0], m[1], m[2]); return [m[0] / l, m[1] / l, m[2] / l]; }
      var vals = [];
      for (var r = 0; r < 5; r++) {
        if (r >= 3) vals.push(meanWidth(T.map(function (t) { return tri(t[0], t[1], t[2]); })).L);
        var N = [];
        T.forEach(function (t) { var ab = mid(t[0], t[1]), bc = mid(t[1], t[2]), ca = mid(t[2], t[0]); N.push([t[0], ab, ca], [ab, t[1], bc], [ca, bc, t[2]], [ab, bc, ca]); });
        T = N;
      }
      ok('mean width of a ball of radius 1 approaches 4 as its mesh is refined', Math.abs(vals[1] - 4) < 0.01 && Math.abs(vals[1] - 4) < Math.abs(vals[0] - 4), vals.map(function (v) { return v.toFixed(5); }).join(', ') + ' at 512 and 2048 triangles');
    })();

    // 3. Kelvin's cell, flat and relaxed: zero by symmetry.
    (function () {
      var m = model('kelvin', 1, 2), flat = measure(m);
      m.mesh.step(200);
      var rel = measure(m);
      ok('Kelvin cell: mean width equals one sixth of its edge length, flat and relaxed', Math.abs(flat[0].excess) < 1e-9 && Math.abs(rel[0].excess) < 1e-6 && Math.abs(rel[1].excess) < 1e-6 && flat[0].faces === 14,
        'flat L ' + flat[0].L.toFixed(5) + ', E/6 ' + (flat[0].E / 6).toFixed(5) + '; relaxed L ' + rel[0].L.toFixed(5) + ', E/6 ' + (rel[0].E / 6).toFixed(5) + ', difference ' + rel[0].excess.toExponential(1));
    })();

    // 4. Weaire-Phelan at equal volumes: the dodecahedron loses what the six others gain.
    (function () {
      var vals = [0, 1, 2].map(function (r) { var m = model('wp', 1, r); m.mesh.step(120); return measure(m); });
      var a = vals[2][0], b = vals[2][1];
      var d1 = vals[0][0].excess - vals[1][0].excess, d2 = vals[1][0].excess - vals[2][0].excess, lim = vals[2][0].excess - d2 / (d1 / d2 - 1);
      ok('Weaire-Phelan at equal volumes: the dodecahedron shrinks and the fourteen-faced cell grows', a.faces === 12 && b.faces === 14 && a.rate < -0.137 && a.rate > -0.141 && b.rate > 0.045 && b.rate < 0.048 && Math.abs(2 * a.rate + 6 * b.rate) < 1e-4 && Math.abs(a.volume - 1) < 1e-9,
        'rates ' + a.rate.toFixed(4) + ' and +' + b.rate.toFixed(4) + ' (2 x first + 6 x second = ' + (2 * a.rate + 6 * b.rate).toExponential(1) + '); L - E/6 for the dodecahedron on 276, 1104, 4416 triangles: ' +
        vals.map(function (v) { return v[0].excess.toFixed(5); }).join(', ') + ', extrapolated ' + lim.toFixed(4) + '; L ' + a.L.toFixed(4) + ', E/6 ' + (a.E / 6).toFixed(4));
      // An independent route to the same number. In equilibrium 2 pi (L - E/6) is the
      // pressure difference times the dodecahedron's wall area, and the pressure
      // difference is also half the change in total wall area per unit of volume moved
      // into each of the two dodecahedra. The second uses no angles at all.
      var ar = [0.98, 1.02].map(function (r) { var m = model('wp', r, 1); m.mesh.step(300); return [r / (2 * r + 6), m.mesh.area()]; });
      var one = vals[1][0], dpWidth = 2 * PI * one.excess / one.area, dpEnergy = 0.5 * (ar[1][1] - ar[0][1]) / (ar[1][0] - ar[0][0]) * 0.5;
      ok('pressure difference between the two cell types: mean-width route agrees with the change of wall area with volume', Math.abs(dpWidth / dpEnergy - 1) < 0.005 && dpWidth > 0.16 && dpWidth < 0.17,
        '(p12 - p14) V^(1/3) / tension = ' + dpWidth.toFixed(4) + ' from L - E/6 and ' + dpEnergy.toFixed(4) + ' from dA/dV (1104 triangles); ' + (2 * PI * a.excess / a.area).toFixed(4) + ' from L - E/6 on 4416');
    })();

    // 5. Across the range of volume ratios the page offers.
    (function () {
      var rows = [], good = true;
      RANGE.wp.concat([0.75, 1.4]).forEach(function (r) {
        var m = model('wp', r, 1); m.mesh.step(80);
        var v = measure(m);
        if (!(v[0].rate < 0 && v[1].rate > 0 && v[0].faceCounts[5] === 12 && v[1].faceCounts[5] === 12 && v[1].faceCounts[6] === 2 && Math.abs(m.ratio - r) < 1e-6 && v[0].open === 0)) good = false;
        rows.push(r + ': ' + v[0].rate.toFixed(4));
      });
      ok('Weaire-Phelan with unequal cells: the dodecahedron shrinks at every volume ratio from ' + RANGE.wp[0] + ' to ' + RANGE.wp[1], good, rows.join(', '));
      rows = []; good = true;
      RANGE.kelvin.concat([1.2]).forEach(function (r) {
        var m = model('kelvin', r, 2); m.mesh.step(80);
        var v = measure(m);
        if (!((v[0].rate > 0) === (r > 1) && Math.abs(v[0].rate + v[1].rate) < 1e-6 && v[0].faceCounts[4] === 6 && v[0].faceCounts[6] === 8 && v[1].faceCounts[4] === 6 && v[1].faceCounts[6] === 8 && Math.abs(m.ratio - r) < 1e-6)) good = false;
        rows.push(r + ': ' + v[0].rate.toFixed(4));
      });
      ok('Kelvin with two cell sizes: both cells keep 14 faces, the larger grows and the smaller shrinks', good, rows.join(', '));
    })();

    return out;
  }

  var api = { meanWidth: meanWidth, weightFor: weightFor, model: model, measure: measure, RANGE: RANGE, runChecks: runChecks };
  if (node) module.exports = api; else global.FoamLaw3D = api;
})(typeof window !== 'undefined' ? window : globalThis);
