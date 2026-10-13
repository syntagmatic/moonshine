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
//   shell(sites, i, w, L)   -> site i's Voronoi cell and the neighbors across its walls
//                              (L, optional: lattice vectors for a non-cubic repeat)
//   structures.a15/c15/z()  -> { L, pts }  lattice vectors (rows) and sites in lattice coordinates
//   cellIn(L, pts, i, R)    -> Voronoi cell of site i in a general lattice, walls moved in by R
//   bonds(structure)        -> every wall of one repeat counted once: how many bonds are ringed
//                              by five tetrahedra, how many by six, and where the sixes run
//   ratioFoam(sites, idx, w)-> flat foam with weight w on sites idx, and its cell-volume ratio
//   softSphere              -> Ziherl and Kamien's free energy for FCC, BCC and A15
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
  function shell(pts, i, weights, L) {
    var c, rel;
    if (L) {
      c = cellIn(L, pts, i);
      rel = c.faces.map(function (f) { return { pts: f.pts, q: f.d, j: f.j }; });
    } else {
      c = FC.cell(pts, i, weights);
      rel = c.faces.map(function (f) {
        return { pts: f.pts.map(function (x) { return V.sub(x, c.center); }), q: V.sub(V.add(pts[f.j], f.T), c.center), j: f.j };
      });
    }
    var F = rel.length;
    var nbr = rel.map(function (f) { return { p: f.q, site: f.j, sides: f.pts.length, dist: V.len(f.q), around: 0 }; });
    var corners = [], at = [];
    rel.forEach(function (f, fi) {
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
      faces: rel.map(function (f) { return { pts: f.pts, sides: f.pts.length }; }),
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

  // ---- general lattices ----
  // A structure is { L, pts }: L holds the three lattice vectors as rows, in units where
  // the cube edge (or the hexagonal a) is 1, and pts are sites in lattice coordinates.
  var CUBIC = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  function cart(L, f) {
    return [f[0] * L[0][0] + f[1] * L[1][0] + f[2] * L[2][0], f[0] * L[0][1] + f[1] * L[1][1] + f[2] * L[2][1], f[0] * L[0][2] + f[1] * L[1][2] + f[2] * L[2][2]];
  }
  // The Frank-Kasper Z phase, Zr4Al3: space group P6/mmm, a = 5.433, c = 5.390 angstrom,
  // Zr on 2d (1/3, 2/3, 1/2), Zr on 2e (0, 0, z) with z = 1/4, Al on 3f (1/2, 0, 0), as in
  // the AFLOW prototype encyclopedia (A3B4_hP7_191_f_de, after Wilson, Thomas and Spooner
  // 1960). Sites 0-1 have 15 neighbors, 2-3 have 14, 4-6 have 12.
  var Z_A = 5.433, Z_C = 5.390;
  function zPhase() {
    return {
      L: [[0.5, -Math.sqrt(3) / 2, 0], [0.5, Math.sqrt(3) / 2, 0], [0, 0, Z_C / Z_A]],
      pts: [[1 / 3, 2 / 3, 0.5], [2 / 3, 1 / 3, 0.5], [0, 0, 0.25], [0, 0, 0.75], [0.5, 0, 0], [0, 0.5, 0], [0.5, 0.5, 0]]
    };
  }
  var structures = {
    bcc: function () { return { L: CUBIC, pts: FC.sites.bcc() }; },
    fcc: function () { return { L: CUBIC, pts: FC.sites.fcc() }; },
    a15: function () { return { L: CUBIC, pts: FC.sites.a15() }; },
    c15: function () { return { L: CUBIC, pts: c15() }; },
    z: zPhase
  };

  // Cell of site i in a lattice with vectors L, in coordinates centered on the site.
  // shrink moves every wall toward the site by that distance (0 gives the Voronoi cell);
  // weights slide walls as in cells.js. Each face records the neighbor j, its lattice
  // translation T and the vector d from this site to that neighbor. Returns volume 0 and
  // no faces when the walls have closed in past the site.
  function cellIn(L, pts, i, shrink, weights) {
    var p = cart(L, pts[i]), wi = weights ? weights[i] : 0, planes = [];
    for (var j = 0; j < pts.length; j++)
      for (var a = -2; a <= 2; a++) for (var b = -2; b <= 2; b++) for (var c = -2; c <= 2; c++) {
        if (j === i && a === 0 && b === 0 && c === 0) continue;
        var d = V.sub(cart(L, [pts[j][0] + a, pts[j][1] + b, pts[j][2] + c]), p), len = V.len(d), wj = weights ? weights[j] : 0;
        planes.push({ n: V.mul(d, 1 / len), h: (len * len + wi - wj) / (2 * len) - (shrink || 0), tag: { j: j, T: [a, b, c], d: d } });
      }
    planes.sort(function (x, y) { return x.h - y.h; });
    if (planes[0].h <= 0) return { site: i, center: p, faces: [], volume: 0, area: 0 };
    var faces = FC.box([0, 0, 0], 3), reach = Infinity;
    for (var k = 0; k < planes.length; k++) {
      var pl = planes[k];
      if (pl.h > reach + 1e-9) break;
      var cut = FC.clip(faces, pl.n, pl.h, pl.tag);
      if (cut !== faces) {
        faces = cut; reach = 0;
        faces.forEach(function (f) { f.pts.forEach(function (x) { reach = Math.max(reach, V.len(x)); }); });
      }
    }
    faces = faces.filter(function (f) { return f.j != null; });
    var m = FC.measure(faces);
    return { site: i, center: p, faces: faces, volume: m.volume, area: m.area };
  }

  // Every wall of one repeat, once. A wall with n sides is a bond with n tetrahedra around
  // it; `six` lists the bonds ringed by six as { i, j, T }: site i to site j shifted by T.
  function bonds(st) {
    var K = st.pts.length, walls = 0, sides = 0, bySides = {}, kinds = {}, faces = [], six = [];
    for (var i = 0; i < K; i++) {
      var c = cellIn(st.L, st.pts, i);
      faces.push(c.faces.length); kinds[c.faces.length] = (kinds[c.faces.length] || 0) + 1;
      c.faces.forEach(function (f) {
        if (!(f.j > i || (f.j === i && lexPos(f.T)))) return;
        var n = f.pts.length;
        walls++; sides += n; bySides[n] = (bySides[n] || 0) + 1;
        if (n === 6) six.push({ i: i, j: f.j, T: f.T, d: f.d });
      });
    }
    return {
      cells: K, walls: walls, bySides: bySides, kinds: kinds, faces: faces, six: six,
      sixShare: six.length / walls, meanSides: sides / walls, meanFaces: 2 * walls / K
    };
  }
  // If every bond had five or six tetrahedra around it, this share would need six.
  var SIX_SHARE_IDEAL = 2 * Math.PI / Math.acos(1 / 3) - 5;

  // Flat foam with one weight w on the sites in idx, and how unequal its cells are:
  // ratio = volume of a cell in idx over the volume of a cell outside it.
  function ratioFoam(pts, idx, w) {
    var inSet = {}, other = -1, kinds = {};
    idx.forEach(function (i) { inSet[i] = 1; });
    for (var i = 0; i < pts.length; i++) if (!inSet[i]) { other = i; break; }
    var fm = FC.foam(pts, pts.map(function (_, k) { return inSet[k] ? w : 0; }));
    fm.cells.forEach(function (c) { kinds[c.faces.length] = (kinds[c.faces.length] || 0) + 1; });
    return { foam: fm, ratio: fm.cells[idx[0]].volume / fm.cells[other].volume, kinds: kinds };
  }

  // ---- Ziherl and Kamien, "Soap froths and crystal structures", PRL 85, 3528 (2000) ----
  // A micelle is a hard core of radius R inside a soft coat. n is the number density
  // times R^3. Free energies are per micelle, in units of kT.
  //   bulk:    free-volume theory. The core's center may go wherever the core stays inside
  //            its own cell, which is the cell with every wall moved inward by R. The free
  //            energy is -ln(that volume / R^3), averaged over the sites of a repeat. For
  //            A15 the authors use the equal-volume cells, as here.
  //   surface: (l N / R) gamma n^(-2/3) / (1/n - 4 pi / 3), their equation 5: gamma is the
  //            wall cost of the lattice's foam, N the number of chains per micelle and l a
  //            length that measures how strongly the coats resist being squeezed.
  var softSphere = (function () {
    var wA15 = null;
    function lattice(name) {
      if (name === 'a15') { if (!wA15) wA15 = FC.a15Weights(FC.equalVolumeA15().w); return { pts: FC.sites.a15(), w: wA15 }; }
      return { pts: FC.sites[name](), w: null };
    }
    function bulk(name, n) {
      var lt = lattice(name), K = lt.pts.length, R = Math.pow(n / K, 1 / 3), F = 0, memo = {};
      for (var i = 0; i < K; i++) {
        var kind = lt.w ? lt.w[i] : 0;              // sites with the same weight are alike here
        if (memo[kind] == null) memo[kind] = cellIn(CUBIC, lt.pts, i, R, lt.w).volume;
        if (memo[kind] <= 0) return Infinity;
        F -= Math.log(memo[kind] / (R * R * R));
      }
      return F / K;
    }
    // The authors' closed forms: equation 2 for FCC and BCC, and their fit for A15
    // (equation 3, with S = 1.64 and C = 1.38).
    var closed = {
      fcc: function (n) { return -Math.log(Math.pow(2, 2.5) * Math.pow(Math.pow(2, -5 / 6) / Math.pow(n, 1 / 3) - 1, 3)); },
      bcc: function (n) { return -Math.log(4 * Math.sqrt(3) * Math.pow(Math.pow(2, -5 / 3) * Math.sqrt(3) / Math.pow(n, 1 / 3) - 1, 3)); },
      a15: function (n) {
        var u = Math.sqrt(5) / (4 * Math.pow(n, 1 / 3)) - 1, h = 1 / (2 * Math.pow(n, 1 / 3)) - 1;
        return -(0.25 * Math.log(4 * Math.PI * 1.64 / 3 * u * u * u) + 0.75 * Math.log(2 * Math.PI * 1.38 * u * u * h));
      }
    };
    function surfPer(n) { return Math.pow(n, -2 / 3) / (1 / n - 4 * Math.PI / 3); }   // surface term per unit of gamma l N / R
    // Coat strength l / R at which lattice Y takes over from lattice X (Y has the lower wall cost).
    function takeover(x, y, n, gamma, N) {
      return (bulk(y, n) - bulk(x, n)) / ((N || softSphere.N) * surfPer(n) * (gamma[x] - gamma[y]));
    }
    return { N: 162, melt: 0.120, a15Max: 0.125, bulk: bulk, closed: closed, surfPer: surfPer, takeover: takeover };
  })();

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


    // general lattices, the Z phase and the bonds ringed by six
    var gA = cellIn(CUBIC, A, 2), fA = FC.cell(A, 2);
    near('cellIn on the cubic lattice reproduces cells.js (A15 face site volume)', gA.volume, fA.volume, 1e-12);
    ok('cellIn on the cubic lattice reproduces cells.js (A15 face site, 14 walls)', gA.faces.length === 14 && Math.abs(gA.area - fA.area) < 1e-12, gA.faces.length);
    var Zs = zPhase(), bz = bonds(Zs), ba = bonds(structures.a15()), bc = bonds(structures.c15());
    ok('Z phase (Zr4Al3): 2 sites with 15 neighbors, 2 with 14, 3 with 12', bz.faces.join(',') === '15,15,14,14,12,12,12', bz.faces.join(','));
    ok('Z phase repeat: 47 walls, 42 pentagons and 5 hexagons', bz.walls === 47 && bz.bySides[5] === 42 && bz.bySides[6] === 5, JSON.stringify(bz.bySides));
    near('Z phase mean faces per cell is 94/7 = 13.43', bz.meanFaces, 94 / 7, 1e-12);
    var zvol = 0; Zs.pts.forEach(function (_, i) { zvol += cellIn(Zs.L, Zs.pts, i).volume; });
    near('Z phase cells fill the hexagonal repeat, volume (sqrt 3 / 2)(c/a)', zvol, Math.sqrt(3) / 2 * Z_C / Z_A, 1e-9);
    shellCheck('Z phase 15 site', shell(Zs.pts, 0, null, Zs.L), 15, 12, 3);
    shellCheck('Z phase 14 site', shell(Zs.pts, 2, null, Zs.L), 14, 12, 2);
    shellCheck('Z phase 12 site', shell(Zs.pts, 4, null, Zs.L), 12, 12, 0);
    ok('bonds() agrees with census(): A15 6 of 54 walls are hexagons, C15 16 of 160', ba.six.length === 6 && ba.walls === 54 && bc.six.length === 16 && bc.walls === 160,
      ba.six.length + '/' + ba.walls + ' ' + bc.six.length + '/' + bc.walls);
    near('share of bonds that must be ringed by six, 360/70.53 - 5 = 0.1043', SIX_SHARE_IDEAL, 0.104299312, 1e-8);
    ok('share ringed by six: C15 0.1000 < needed 0.1043 < Z 0.1064 < A15 0.1111',
      bc.sixShare < SIX_SHARE_IDEAL && SIX_SHARE_IDEAL < bz.sixShare && bz.sixShare < ba.sixShare, [bc.sixShare, bz.sixShare, ba.sixShare].join(' '));
    // angles between the six-ringed bonds leaving one site
    function sixAngles(b, site) {
      var ds = [];
      b.six.forEach(function (s) { if (s.i === site) ds.push(s.d); if (s.j === site) ds.push(V.mul(s.d, -1)); });
      var out = [];
      for (var x = 0; x < ds.length; x++) for (var y = x + 1; y < ds.length; y++) out.push(Math.acos(V.dot(V.unit(ds[x]), V.unit(ds[y]))) * DEG);
      return { n: ds.length, angles: out };
    }
    function allNear(a, v) { return a.every(function (x) { return Math.abs(x - v) < 1e-6; }); }
    var s14 = sixAngles(ba, 2), s16 = sixAngles(bc, 0), s15 = sixAngles(bz, 0), sz14 = sixAngles(bz, 2);
    ok('A15: the two six-ringed bonds at a 14 site are in line (180 degrees)', s14.n === 2 && allNear(s14.angles, 180), s14.angles.join(' '));
    ok('C15: the four six-ringed bonds at a 16 site are 109.47 degrees apart', s16.n === 4 && allNear(s16.angles, Math.acos(-1 / 3) * DEG), s16.angles.join(' '));
    ok('Z: the three six-ringed bonds at a 15 site are 120 degrees apart, the two at a 14 site in line',
      s15.n === 3 && allNear(s15.angles, 120) && sz14.n === 2 && allNear(sz14.angles, 180), s15.angles.join(' ') + ' | ' + sz14.angles.join(' '));
    // how the six-ringed bonds join up: groups of sites linked by them, ignoring lattice shifts
    function groups(b) {
      var parent = b.faces.map(function (_, i) { return i; });
      function find(i) { while (parent[i] !== i) i = parent[i]; return i; }
      b.six.forEach(function (s) { parent[find(s.i)] = find(s.j); });
      var g = {};
      b.faces.forEach(function (f, i) { if (f !== 12) { var r = find(i); (g[r] = g[r] || []).push(f); } });
      return Object.keys(g).map(function (k) { return g[k].length + 'x' + g[k][0]; }).sort().join(' ');
    }
    ok('six-ringed bonds join A15 into three chains, Z into one sheet and one chain, C15 into one network',
      groups(ba) === '2x14 2x14 2x14' && groups(bz) === '2x14 2x15' && groups(bc) === '8x16', groups(ba) + ' | ' + groups(bz) + ' | ' + groups(bc));
    ok('no 12 site has a six-ringed bond', sixAngles(ba, 0).n === 0 && sixAngles(bc, 8).n === 0 && sixAngles(bz, 4).n === 0, '');

    // unequal cells
    var rc0 = ratioFoam(C, [0, 1, 2, 3, 4, 5, 6, 7], 0), rc1 = ratioFoam(C, [0, 1, 2, 3, 4, 5, 6, 7], ec.w), ra0 = ratioFoam(A, [2, 3, 4, 5, 6, 7], 0);
    near('nearest-point C15: a 16-faced cell is 1.2298 times a 12-faced one', rc0.ratio, 1.2298, 5e-5);
    near('nearest-point A15: a 14-faced cell is 129/125 of a 12-faced one', ra0.ratio, 129 / 125, 1e-9);
    near('ratioFoam at the equalizing weight gives ratio 1', rc1.ratio, 1, 1e-9);
    ok('flat C15 wall cost per average cell: 5.2876 with nearest-point volumes, 5.3279 with equal ones',
      Math.abs(rc0.foam.s - 5.28757) < 1e-5 && Math.abs(rc1.foam.s - 5.32790) < 1e-5, rc0.foam.s + ' ' + rc1.foam.s);
    var EV = (typeof module !== 'undefined' && module.exports) ? require('./evolver.js') : global.FoamEvolver;
    if (EV) {
      var mC = EV.build(FC.weld(rc1.foam), 1), sC = mC.step(40), mK = EV.build(FC.weld(FC.foam(sites.bcc())), 2), sK = mK.step(80), vC = mC.volumes();
      ok('relaxed equal-volume C15 on the page mesh (3264 triangles) lands in (5.3240, 5.3250)', sC > 5.3240 && sC < 5.3250, sC);
      ok('relaxed C15 costs more than relaxed Kelvin', sC > sK && sK < 5.3075, sC + ' > ' + sK);
      ok('relaxing C15 keeps all 24 volumes at 1/24', vC.every(function (v) { return Math.abs(v - 1 / 24) < 1e-10; }), Math.min.apply(null, vC) + ' .. ' + Math.max.apply(null, vC));
      var mU = EV.build(FC.weld(rc0.foam), 1), sU = mU.step(40);
      ok('relaxed C15 with nearest-point volumes costs less than relaxed Weaire-Phelan (5.2883)', sU < 5.2883 && sU > 5.28, sU);
    }

    // Ziherl and Kamien's model
    var SS = softSphere;
    near('free-volume bulk term from eroded cells equals the closed form, FCC at n = 0.120', SS.bulk('fcc', 0.12), SS.closed.fcc(0.12), 1e-9);
    near('free-volume bulk term from eroded cells equals the closed form, BCC at n = 0.120', SS.bulk('bcc', 0.12), SS.closed.bcc(0.12), 1e-9);
    var worst = 0;
    [0.110, 0.115, 0.118, 0.120, 0.122, 0.124].forEach(function (n) { worst = Math.max(worst, Math.abs(SS.bulk('a15', n) / SS.closed.a15(n) - 1)); });
    ok('A15 bulk term from eroded equal-volume cells is within 0.2% of the authors\' fit, n = 0.110 to 0.124', worst < 2e-3, 'worst ' + worst);
    ok('A15 bulk term diverges at n = 0.125, where cores touch along the columns', SS.bulk('a15', 0.12501) === Infinity && isFinite(SS.bulk('a15', 0.12499)), SS.bulk('a15', 0.12499));
    var GAM = { fcc: 3 * Math.pow(2, 5 / 6), bcc: 5.306, a15: 5.288 };
    var t1 = SS.takeover('fcc', 'bcc', 0.12, GAM), t2 = SS.takeover('bcc', 'a15', 0.12, GAM);
    ok('at n = 0.120 BCC takes over from FCC at l = 0.092 R and A15 from BCC at 0.296 R (authors: about 0.1 and 0.3)',
      Math.abs(t1 - 0.0921) < 5e-4 && Math.abs(t2 - 0.2956) < 5e-4, t1 + ' ' + t2);
    ok('those thresholds are 0.48 and 1.55 k per chain (authors: 0.5 and 1.5)',
      Math.abs(t1 * GAM.bcc * SS.surfPer(0.12) - 0.48) < 0.01 && Math.abs(t2 * GAM.a15 * SS.surfPer(0.12) - 1.55) < 0.01, (t1 * GAM.bcc * SS.surfPer(0.12)) + ' ' + (t2 * GAM.a15 * SS.surfPer(0.12)));

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
    paulingMarsh: paulingMarsh, iceNet: iceNet, runChecks: runChecks, OUTER_CLOSED: OUTER_CLOSED,
    structures: structures, cart: cart, cellIn: cellIn, bonds: bonds, SIX_SHARE_IDEAL: SIX_SHARE_IDEAL,
    ratioFoam: ratioFoam, softSphere: softSphere
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamFrustration = api;
})(typeof window !== 'undefined' ? window : globalThis);
