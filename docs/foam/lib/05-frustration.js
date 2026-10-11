// 05-frustration.js — model code for Foam part 5, "Why It Recurs".
// No DOM. Runs in the browser (window.FoamFrustration, after cells.js) and in node.
//
// Everything here is read off geometry: tetrahedra built from coordinates, Voronoi
// cells from cells.js, and two sets of published crystal coordinates.
//
// Public API:
//   tetraRing(t)            -> five tetrahedra around a shared edge. t = 0 regular (a gap
//                              is left), t = 1 outer edges stretched until the gap closes.
//                              { tets:[{pts, faces, center}], gapWedge, dihedral, covered, gap, outer }
//   sites.c15()             -> the 24 atoms of the cubic Laves phase MgCu2 (C15), AFLOW setting
//   shell(sites, i, w)      -> site i's Voronoi cell and the neighbors across its walls
//   census(sites, w)        -> corners, edges, walls, cell kinds and averages for one repeat
//   equalVolume(sites, idx) -> { w, foam }  weight on sites idx that equalizes all volumes
//   paulingMarsh()          -> 46 oxygen positions of chlorine hydrate (Pauling & Marsh 1952)
//   iceNet()                -> the A15 foam's corner network beside those oxygen positions
//   runChecks()             -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var FC = (typeof module !== 'undefined' && module.exports) ? require('./cells.js') : global.FoamCells;
  var V = FC.vec;
  var DEG = 180 / Math.PI;

  // ---- five tetrahedra around an edge ----
  // The shared edge AB has length 1 and stands on the y axis. Ring corners sit at
  // distance sqrt(3)/2 from it, so every edge to A or B has length 1. The outer (ring)
  // edges have length `outer`; at 1 the tetrahedra are regular.
  var H_RING = Math.sqrt(3) / 2;
  var OUTER_CLOSED = 2 * H_RING * Math.sin(Math.PI / 5);   // ring edge when five close up

  function orient(tri, inside) {
    var n = V.cross(V.sub(tri[1], tri[0]), V.sub(tri[2], tri[0]));
    return V.dot(n, V.sub(tri[0], inside)) < 0 ? [tri[0], tri[2], tri[1]] : tri;
  }
  // Angle between the planes ABC and ABD, measured at the edge AB.
  function dihedral(A, B, C, D) {
    var e = V.unit(V.sub(B, A));
    function perp(P) { var d = V.sub(P, A); return V.unit(V.sub(d, V.mul(e, V.dot(d, e)))); }
    return Math.acos(Math.max(-1, Math.min(1, V.dot(perp(C), perp(D)))));
  }

  function tetraRing(t) {
    var outer = 1 + t * (OUTER_CLOSED - 1);
    var phi = 2 * Math.asin(outer / (2 * H_RING));
    var gapRad = 2 * Math.PI - 5 * phi;
    var A = [0, 0.5, 0], B = [0, -0.5, 0], ring = [];
    for (var k = 0; k <= 5; k++) {
      var th = gapRad / 2 + k * phi;                      // the gap straddles +z, toward the viewer
      ring.push([H_RING * Math.sin(th), 0, H_RING * Math.cos(th)]);
    }
    var tets = [];
    for (k = 0; k < 5; k++) {
      var pts = [A, B, ring[k], ring[k + 1]], c = V.mul(pts.reduce(V.add, [0, 0, 0]), 0.25);
      tets.push({
        pts: pts, center: c,
        faces: [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].map(function (f) { return orient([pts[f[0]], pts[f[1]], pts[f[2]]], c); })
      });
    }
    // The leftover wedge between the last and first tetrahedron, as its two outside faces.
    var mid = V.mul(V.add(ring[5], ring[0]), 0.5), wc = V.mul(V.add(V.add(A, B), V.mul(mid, 2)), 0.25);
    var gapWedge = gapRad > 1e-9 ? [orient([A, ring[5], ring[0]], wc), orient([B, ring[5], ring[0]], wc)] : [];
    var measured = dihedral(A, B, ring[0], ring[1]);       // read back off the coordinates
    return {
      tets: tets, gapWedge: gapWedge, wedgeCenter: wc,
      dihedral: measured * DEG, covered: 5 * measured * DEG, gap: 360 - 5 * measured * DEG,
      outer: V.len(V.sub(ring[1], ring[0]))
    };
  }

  // ---- sites ----
  // C15, the cubic Laves phase MgCu2: Mg on 8b, Cu on 16c of Fd-3m, coordinates as listed
  // in the AFLOW prototype encyclopedia (A2B_cF24_227_c_b). Sites 0-7 are Mg, 8-23 Cu.
  function c15() {
    var fccT = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
    var mg = [[3 / 8, 3 / 8, 3 / 8], [5 / 8, 5 / 8, 5 / 8]];
    var cu = [[0, 0, 0], [0.25, 0.25, 0], [0.25, 0, 0.25], [0, 0.25, 0.25]];
    var out = [];
    mg.concat(cu).forEach(function (p) {
      fccT.forEach(function (s) { out.push([(p[0] + s[0]) % 1, (p[1] + s[1]) % 1, (p[2] + s[2]) % 1]); });
    });
    return out;
  }
  var sites = { a15: FC.sites.a15, bcc: FC.sites.bcc, c15: c15 };

  // ---- one site, its cell and its shell of neighbors ----
  // A neighbor is a site whose cell shares a wall with this one. Three walls meet at
  // each corner of the cell, so each corner gives a triangle of neighbors, and that
  // triangle with the center site is a tetrahedron. The number of triangles at a
  // neighbor is the number of tetrahedra around the bond to it.
  function shell(pts, i, weights) {
    var c = FC.cell(pts, i, weights), p = c.center, F = c.faces.length;
    var nbr = c.faces.map(function (f) {
      var q = V.sub(V.add(pts[f.j], f.T), p);
      return { p: q, site: f.j, sides: f.pts.length, dist: V.len(q), around: 0 };
    });
    var corners = [], at = [];
    c.faces.forEach(function (f, fi) {
      f.pts.forEach(function (x) {
        var k = -1;
        for (var q = 0; q < corners.length; q++) if (V.len(V.sub(corners[q], x)) < 1e-7) { k = q; break; }
        if (k < 0) { k = corners.length; corners.push(x); at.push([]); }
        at[k].push(fi);
      });
    });
    var tris = [], edgeSet = {}, edges = [];
    at.forEach(function (fs) {
      if (fs.length !== 3) { tris.push(null); return; }
      var tri = orient([nbr[fs[0]].p, nbr[fs[1]].p, nbr[fs[2]].p], [0, 0, 0]);
      tris.push({ idx: fs, pts: tri });
      fs.forEach(function (a) { nbr[a].around++; });
      [[fs[0], fs[1]], [fs[1], fs[2]], [fs[0], fs[2]]].forEach(function (e) {
        var a = Math.min(e[0], e[1]), b = Math.max(e[0], e[1]), key = a + ':' + b;
        if (!edgeSet[key]) { edgeSet[key] = 1; edges.push({ a: a, b: b, len: V.len(V.sub(nbr[a].p, nbr[b].p)) }); }
      });
    });
    var five = 0, six = 0, other = 0, dsum = 0;
    nbr.forEach(function (n) { if (n.around === 5) five++; else if (n.around === 6) six++; else other++; dsum += n.dist; });
    var all = nbr.map(function (n) { return n.dist; }).concat(edges.map(function (e) { return e.len; }));
    return {
      site: i, Z: F, cell: c,
      faces: c.faces.map(function (f) { return { pts: f.pts.map(function (x) { return V.sub(x, p); }), sides: f.pts.length }; }),
      neighbors: nbr, tris: tris.filter(Boolean), allTriangles: tris.every(Boolean), edges: edges,
      five: five, six: six, other: other, meanDist: dsum / F,
      shortest: Math.min.apply(null, all), longest: Math.max.apply(null, all)   // every edge of every tetrahedron at this site
    };
  }

  // ---- counts over one repeat ----
  function census(pts, weights) {
    var fm = FC.foam(pts, weights), w = FC.weld(fm), sides = 0, bySides = {}, edges = {};
    var cellsAt = w.verts.map(function () { return {}; });
    w.faces.forEach(function (f) {
      sides += f.sides; bySides[f.sides] = (bySides[f.sides] || 0) + 1;
      for (var k = 0; k < f.loop.length; k++) {
        var c = f.loop[k], d = f.loop[(k + 1) % f.loop.length];
        cellsAt[c.v][f.a + '|' + V.mul(c.o, -1).join(',')] = 1;
        cellsAt[c.v][f.b + '|' + V.sub(f.T, c.o).join(',')] = 1;
        var fwd = c.v < d.v || (c.v === d.v && lexPos(V.sub(d.o, c.o)));
        var key = fwd ? c.v + ':' + d.v + ':' + V.sub(d.o, c.o).join(',') : d.v + ':' + c.v + ':' + V.sub(c.o, d.o).join(',');
        edges[key] = 1;
      }
    });
    var kinds = {};
    fm.cells.forEach(function (c) { kinds[c.faces.length] = (kinds[c.faces.length] || 0) + 1; });
    var perCorner = {};
    cellsAt.forEach(function (s) { var n = Object.keys(s).length; perCorner[n] = (perCorner[n] || 0) + 1; });
    return {
      foam: fm, weld: w, cells: pts.length, corners: w.verts.length, edges: Object.keys(edges).length, walls: w.faces.length,
      bySides: bySides, kinds: kinds, cellsPerCorner: perCorner,
      meanSides: sides / w.faces.length, meanFaces: 2 * w.faces.length / pts.length, s: fm.s
    };
  }
  function lexPos(d) { return d[0] > 0 || (d[0] === 0 && (d[1] > 0 || (d[1] === 0 && d[2] > 0))); }

  // Slide the walls of the sites in `idx` (one weight for all of them) until every cell
  // of the repeat has the same volume. Works when the repeat has two kinds of cell.
  function equalVolume(pts, idx) {
    var inSet = {}, other = -1;
    idx.forEach(function (i) { inSet[i] = 1; });
    for (var i = 0; i < pts.length; i++) if (!inSet[i]) { other = i; break; }
    function weights(w) { return pts.map(function (_, k) { return inSet[k] ? w : 0; }); }
    var lo = -0.05, hi = 0.05;
    for (var it = 0; it < 48; it++) {             // one cell of each kind is enough to compare
      var mid = (lo + hi) / 2, ws = weights(mid);
      if (FC.cell(pts, idx[0], ws).volume - FC.cell(pts, other, ws).volume > 0) hi = mid; else lo = mid;
    }
    var w = (lo + hi) / 2;
    return { w: w, foam: FC.foam(pts, weights(w)) };
  }

  // ---- chlorine hydrate, Pauling & Marsh, PNAS 38 (1952) 112-118 ----
  // Space group Pm-3n, cube edge 11.82 angstrom. Oxygen on 6(c) 1/4 0 1/2; 16(i) x x x
  // with x = 0.183; 24(k) 0 y z with y = 0.310, z = 0.116. Dodecahedra are centered on
  // 0 0 0 and 1/2 1/2 1/2, the same setting as FoamCells.sites.a15().
  var PM = { a: 11.82, x: 0.183, y: 0.310, z: 0.116 };
  function paulingMarsh() {
    var out = [], seen = {}, sizes = [];
    function put(p) {
      p = p.map(function (v) { v = ((v % 1) + 1) % 1; return v > 1 - 1e-9 ? 0 : v; });
      var k = p.map(function (v) { return v.toFixed(6); }).join(',');
      if (!seen[k]) { seen[k] = 1; out.push(p); }
    }
    // Pm-3n: sign changes and cyclic permutations, then the same after swapping x and y
    // and shifting by (1/2, 1/2, 1/2).
    function orbit(p) {
      var n0 = out.length;
      [[0, 1, 2], [1, 2, 0], [2, 0, 1]].forEach(function (pm) {
        for (var s = 0; s < 8; s++) {
          var q = [0, 1, 2].map(function (i) { return p[pm[i]] * ((s >> i) & 1 ? -1 : 1); });
          put(q); put([q[1] + 0.5, q[0] + 0.5, q[2] + 0.5]);
        }
      });
      sizes.push(out.length - n0);
    }
    orbit([0.25, 0, 0.5]); orbit([PM.x, PM.x, PM.x]); orbit([0, PM.y, PM.z]);
    return { pts: out, orbits: sizes, a: PM.a };
  }

  // The corner network of the flat equal-volume A15 foam of part 4, with each corner
  // paired to the nearest published oxygen position (same lattice image).
  function iceNet() {
    var eq = FC.equalVolumeA15(), w = FC.weld(eq.foam), pm = paulingMarsh();
    var used = {}, oneToOne = true, maxMove = 0;
    var oxygen = w.verts.map(function (v) {
      var best = -1, bd = Infinity, bp = null;
      pm.pts.forEach(function (p, i) {
        var q = [0, 1, 2].map(function (k) { return p[k] + Math.round(v[k] - p[k]); }), d = V.len(V.sub(q, v));
        if (d < bd) { bd = d; best = i; bp = q; }
      });
      if (used[best]) oneToOne = false;
      used[best] = 1; maxMove = Math.max(maxMove, bd);
      return bp;
    });
    // edges once each, with whether the edge lies on a dodecahedron (sites 0 and 1)
    var edges = {}, list = [];
    w.faces.forEach(function (f) {
      var onD12 = f.a < 2 || f.b < 2;
      for (var k = 0; k < f.loop.length; k++) {
        var c = f.loop[k], d = f.loop[(k + 1) % f.loop.length];
        var fwd = c.v < d.v || (c.v === d.v && lexPos(V.sub(d.o, c.o)));
        var a = fwd ? c : d, b = fwd ? d : c, o = V.sub(b.o, a.o), key = a.v + ':' + b.v + ':' + o.join(',');
        if (!edges[key]) { edges[key] = { a: a.v, b: b.v, o: o, onD12: false }; list.push(edges[key]); }
        if (onD12) edges[key].onD12 = true;
      }
    });
    var degree = w.verts.map(function () { return 0; });
    list.forEach(function (e) { degree[e.a]++; degree[e.b]++; });
    function lengths(pos) {
      var lo = Infinity, hi = 0;
      list.forEach(function (e) { var L = V.len(V.sub(V.add(pos[e.b], e.o), pos[e.a])); lo = Math.min(lo, L); hi = Math.max(hi, L); });
      return [lo, hi];
    }
    // The twelve walls of the dodecahedron around the cube's center (site 1), as loops of
    // corners { v, o }: corner v shifted by the lattice vector o.
    var centerCell = [];
    w.faces.forEach(function (f) {
      if (f.a === 1) centerCell.push(f.loop.map(function (c) { return { v: c.v, o: c.o }; }));
      if (f.b === 1) centerCell.push(f.loop.map(function (c) { return { v: c.v, o: V.sub(c.o, f.T) }; }));
    });
    return {
      sites: FC.sites.a15(), corners: w.verts, oxygen: oxygen, edges: list, degree: degree, centerCell: centerCell,
      oneToOne: oneToOne, maxMove: maxMove, cornerLengths: lengths(w.verts), oxygenLengths: lengths(oxygen), a: pm.a
    };
  }

  // ---- checks against closed forms, counts and published values ----
  function runChecks() {
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: String(detail) }); }
    function near(name, got, want, tol) { ok(name, Math.abs(got - want) < (tol || 1e-9), got + ' vs ' + want); }

    var r0 = tetraRing(0), r1 = tetraRing(1), edgeLens = [];
    r0.tets.forEach(function (t) { for (var a = 0; a < 4; a++) for (var b = a + 1; b < 4; b++) edgeLens.push(V.len(V.sub(t.pts[a], t.pts[b]))); });
    ok('t = 0: all thirty tetrahedron edges have length 1', edgeLens.every(function (L) { return Math.abs(L - 1) < 1e-12; }), Math.min.apply(null, edgeLens) + ' .. ' + Math.max.apply(null, edgeLens));
    near('regular dihedral, measured from coordinates, is arccos(1/3)', r0.dihedral, Math.acos(1 / 3) * DEG, 1e-10);
    near('gap after five regular tetrahedra is 360 - 5 arccos(1/3) = 7.3561 degrees', r0.gap, 7.356103172453, 1e-9);
    near('t = 1: the gap is closed', r1.gap, 0, 1e-9);
    near('t = 1: each tetrahedron takes 72 degrees', r1.dihedral, 72, 1e-9);
    near('t = 1: outer edges are sqrt(3) sin 36 = 1.01807', r1.outer, Math.sqrt(3) * Math.sin(Math.PI / 5), 1e-12);
    ok('t = 0 has a two-face gap wedge, t = 1 has none', r0.gapWedge.length === 2 && r1.gapWedge.length === 0, r0.gapWedge.length + ' ' + r1.gapWedge.length);
    var g = (1 + Math.sqrt(5)) / 2;   // icosahedron corners (0, +-1, +-g): edge 2, radius sqrt(1 + g^2)
    near('icosahedron edge over radius is 1 / sin 72 = 1.05146', 2 / Math.sqrt(1 + g * g), 1 / Math.sin(2 * Math.PI / 5), 1e-12);
    near('ideal tetrahedra per bond 360 / 70.53 = 5.1043, and 12 / (6 - n) = 13.397 faces', 12 / (6 - 2 * Math.PI / Math.acos(1 / 3)), 13.3973325714, 1e-9);
    near('70.53 is 180 minus the Plateau angle arccos(-1/3)', Math.acos(1 / 3) * DEG, 180 - Math.acos(-1 / 3) * DEG, 1e-10);

    var A = sites.a15(), C = c15();
    function shellCheck(name, sh, Z, five, six) {
      var Vn = sh.neighbors.length, En = sh.edges.length, Fn = sh.tris.length;
      ok(name + ': ' + Z + ' neighbors, ' + five + ' bonds with five tetrahedra and ' + six + ' with six',
        sh.Z === Z && sh.five === five && sh.six === six && sh.other === 0 && sh.allTriangles, sh.Z + ' ' + sh.five + ' ' + sh.six + ' ' + sh.other);
      ok(name + ': shell is a closed triangulated surface (V - E + F = 2, F = 2V - 4)', Vn - En + Fn === 2 && Fn === 2 * Vn - 4, Vn + ' ' + En + ' ' + Fn);
      ok(name + ': tetrahedra around each bond equal the sides of the wall it crosses',
        sh.neighbors.every(function (n) { return n.around === n.sides; }), '');
    }
    shellCheck('A15 corner site', shell(A, 0), 12, 12, 0);
    shellCheck('A15 face site', shell(A, 2), 14, 12, 2);
    shellCheck('C15 Mg site', shell(C, 0), 16, 12, 4);
    shellCheck('C15 Cu site', shell(C, 8), 12, 12, 0);
    near('A15 corner site: all 12 neighbors at sqrt(5)/4', shell(A, 0).meanDist, Math.sqrt(5) / 4, 1e-9);

    var ca = census(A), cc = census(C), cb = census(sites.bcc());
    ok('A15 repeat: 46 corners, 92 edges, 54 walls (48 pentagons, 6 hexagons), 8 cells',
      ca.corners === 46 && ca.edges === 92 && ca.walls === 54 && ca.bySides[5] === 48 && ca.bySides[6] === 6, JSON.stringify([ca.corners, ca.edges, ca.walls, ca.bySides]));
    ok('A15: four cells meet at every corner', ca.cellsPerCorner[4] === 46, JSON.stringify(ca.cellsPerCorner));
    ok('A15: 2 cells with 12 faces, 6 with 14', ca.kinds[12] === 2 && ca.kinds[14] === 6, JSON.stringify(ca.kinds));
    near('A15 mean sides per wall is 46/9', ca.meanSides, 46 / 9, 1e-12);
    ok('C15 repeat: 136 corners, 272 edges, 160 walls, 16 cells with 12 faces and 8 with 16',
      cc.corners === 136 && cc.edges === 272 && cc.walls === 160 && cc.kinds[12] === 16 && cc.kinds[16] === 8 && cc.cellsPerCorner[4] === 136,
      JSON.stringify([cc.corners, cc.edges, cc.walls, cc.kinds]));
    near('C15 mean sides per wall is 5.1', cc.meanSides, 5.1, 1e-12);
    [['A15', ca], ['C15', cc], ['BCC', cb]].forEach(function (d) {
      near(d[0] + ': mean sides = 6 - 12 / mean faces (Euler)', d[1].meanSides, 6 - 12 / d[1].meanFaces, 1e-12);
    });
    near('BCC mean faces per cell is 14', cb.meanFaces, 14, 1e-12);

    var ea = equalVolume(A, [2, 3, 4, 5, 6, 7]), ec = equalVolume(C, [0, 1, 2, 3, 4, 5, 6, 7]);
    near('equalVolume on A15 reproduces cells.js equalVolumeA15', ea.foam.s, FC.equalVolumeA15().foam.s, 1e-9);
    var vmin = Infinity, vmax = 0;
    ec.foam.cells.forEach(function (c) { vmin = Math.min(vmin, c.volume); vmax = Math.max(vmax, c.volume); });
    ok('equal-volume C15: all 24 volumes are 1/24', Math.abs(vmin - 1 / 24) < 1e-9 && Math.abs(vmax - 1 / 24) < 1e-9, vmin + ' .. ' + vmax);
    var kc = {}; ec.foam.cells.forEach(function (c) { kc[c.faces.length] = (kc[c.faces.length] || 0) + 1; });
    ok('equal-volume C15 keeps 16 cells of 12 faces and 8 of 16', kc[12] === 16 && kc[16] === 8, JSON.stringify(kc));
    ok('flat equal-volume wall cost: C15 above BCC above A15', ec.foam.s > cb.s && cb.s > ea.foam.s, ec.foam.s + ' > ' + cb.s + ' > ' + ea.foam.s);

    var pm = paulingMarsh(), net = iceNet();
    ok('Pauling-Marsh oxygen orbits have 6 + 16 + 24 = 46 positions', pm.pts.length === 46 && pm.orbits.join(',') === '6,16,24', pm.orbits.join(','));
    ok('each foam corner pairs with a different oxygen position', net.oneToOne && net.oxygen.length === 46, 'max move ' + net.maxMove);
    ok('corner network: 92 edges, four at every corner', net.edges.length === 92 && net.degree.every(function (d) { return d === 4; }), net.edges.length);
    ok('60 of the 92 edges lie on the two dodecahedra', net.edges.filter(function (e) { return e.onD12; }).length === 60, '');
    ok('published oxygen positions give all 92 bonds within 0.01 of 2.75 angstrom',
      net.oxygenLengths[0] * net.a > 2.74 && net.oxygenLengths[1] * net.a < 2.76, (net.oxygenLengths[0] * net.a) + ' .. ' + (net.oxygenLengths[1] * net.a));
    ok('foam corners sit within 0.05 cube edges of the oxygen positions', net.maxMove < 0.05, net.maxMove);
    var cc12 = [0, 0, 0], n12 = 0;
    net.centerCell.forEach(function (loop) { loop.forEach(function (c) { cc12 = V.add(cc12, V.add(net.corners[c.v], c.o)); n12++; }); });
    ok('center dodecahedron: 12 pentagonal walls around (1/2, 1/2, 1/2)',
      net.centerCell.length === 12 && n12 === 60 && V.len(V.sub(V.mul(cc12, 1 / n12), [0.5, 0.5, 0.5])) < 1e-9, net.centerCell.length + ' walls, ' + n12 + ' corners');
    return out;
  }

  var api = {
    tetraRing: tetraRing, sites: sites, shell: shell, census: census, equalVolume: equalVolume,
    paulingMarsh: paulingMarsh, iceNet: iceNet, runChecks: runChecks, OUTER_CLOSED: OUTER_CLOSED
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamFrustration = api;
})(typeof window !== 'undefined' ? window : globalThis);
