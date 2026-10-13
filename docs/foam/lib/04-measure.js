// 04-measure.js: measurements on the foams of "The Counterexample" (Foam, part 4).
// Needs cells.js and evolver.js; runs in the browser (window.Foam04) and in node (require).
//
// Public API:
//   KS                    Kusner and Sullivan (1996) in the page's units, <s> = 2 mu^(1/3)
//   flatCost(v)           closed-form cost of the flat-faced foam on the eight points whose
//                         dodecahedra each take the share v of the cube
//   wallsFoam(Cells, t)   that foam from cells.js: t = 0 nearest-point walls, t = 1 equal volumes
//   surface(tris)         -> { area, volume } of a closed triangulated cell ([{pts:[a,b,c]}], outward)
//   cellCost(tris)        -> area / volume^(2/3)
//   pressures(mesh)       -> { p:[per cell, last = 0], resid, verts } from force balance on a mesh
//   fitLimit(points)      -> { limit, slope }  least squares s = limit + slope h^2 over [{h, s}]
//   richardson(a, b, c)   -> { ratio, limit }  from three successive halvings of the triangles
//   LIVE, FINE            mesh levels the page relaxes itself, and the finer precomputed ones
//   runChecks()           -> [{name, ok, detail}]

(function (global) {
  'use strict';
  var inNode = typeof module !== 'undefined' && module.exports;
  function lib(name, glob) { return inNode ? require('./' + name) : global[glob]; }

  // ---- Kusner and Sullivan, "Comparing the Weaire-Phelan equal-volume foam to Kelvin's
  // foam", Forma 11 (1996) 233-242. They score a foam by mu = A^3 / V^2 with A half the
  // mean cell area; this series uses <s> = (cell area) / V^(2/3) = 2 mu^(1/3).
  function fromMu(mu) { return 2 * Math.cbrt(mu); }
  var FLOOR_MU = 27 / 16 * Math.pow(1 + Math.sqrt(1.5), 3);   // printed as "> 18.5816"
  var KS = {
    fromMu: fromMu,
    floorMu: FLOOR_MU,
    floor: fromMu(FLOOR_MU),          // no partition in the Kelvin pattern costs less: 5.29734
    kelvinFlat: fromMu(18.7653),      // "unrelaxed foam has cost 18.7653..."
    kelvin: fromMu(18.67582),         // Evolver, "just under 18.67582": 5.30628
    wpFlat: fromMu(18.57752),         // weighted Voronoi partition, "just under 18.57752"
    wp: fromMu(18.4871)               // Evolver, "just under 18.4871": 5.28834
  };

  // Their section 3: in a cube of edge 4 the flat faces need 4b = 2c = 3a, the area of one
  // repeat is 8A = 24 + 24 sqrt 6 + (12 sqrt 5 - 8 sqrt 6 - 6) c^2 and a dodecahedron holds
  // 4 c^3. With v the dodecahedron's share of the cube, c^3 = 16 v, and <s> = 8A / 16.
  function flatCost(v) {
    var c2 = Math.pow(16 * v, 2 / 3);
    return (24 + 24 * Math.sqrt(6) + (12 * Math.sqrt(5) - 8 * Math.sqrt(6) - 6) * c2) / 16;
  }

  var eqCache = null;
  function wallsFoam(Cells, t) {
    eqCache = eqCache || Cells.equalVolumeA15();
    return t === 1 ? eqCache.foam : Cells.foam(Cells.sites.a15(), Cells.a15Weights(t * eqCache.w));
  }

  // ---- one cell as a closed triangulated surface ----
  function surface(tris) {
    var area = 0, vol = 0;
    for (var i = 0; i < tris.length; i++) {
      var a = tris[i].pts[0], b = tris[i].pts[1], c = tris[i].pts[2];
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      area += Math.sqrt(nx * nx + ny * ny + nz * nz) / 2;
      vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
    }
    return { area: area, volume: vol };
  }
  function cellCost(tris) { var m = surface(tris); return m.area / Math.pow(m.volume, 2 / 3); }

  // ---- pressures from force balance ----
  // At rest the pull of the films on every mesh corner is balanced by the cell pressures:
  // grad(area) = sum_k p_k grad(volume_k), with film tension 1. The volume gradients sum
  // to zero, so pressures are fixed up to a constant; the last cell is set to 0 and the
  // rest found by least squares. resid is what the fit leaves over (0 at perfect rest).
  function pressures(mesh) {
    var K = mesh.cells, index = {}, n = 0, G = [], CG = [], k, i;
    function vid(p) {
      var key = '';
      for (var d = 0; d < 3; d++) { var f = (p[d] + 0.137) % 1; if (f < 0) f += 1; key += (Math.round(f * 1e6) % 1e6) + ','; }
      if (index[key] == null) index[key] = n++;
      return index[key];
    }
    function add(arr, at, bx, by, bz, cx, cy, cz, w) {      // arr[at] += w * (b x c)
      arr[at] = (arr[at] || 0) + w * (by * cz - bz * cy);
      arr[at + 1] = (arr[at + 1] || 0) + w * (bz * cx - bx * cz);
      arr[at + 2] = (arr[at + 2] || 0) + w * (bx * cy - by * cx);
    }
    for (k = 0; k < K; k++) {
      CG.push([]);
      mesh.cellTriangles(k).forEach(function (t) {
        var P = t.pts, a = P[0], b = P[1], c = P[2];
        var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
        var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, L = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (!L) return;
        nx /= L; ny /= L; nz /= L;
        for (var q = 0; q < 3; q++) {
          var at = 3 * vid(P[q]), B = P[(q + 1) % 3], C = P[(q + 2) % 3];
          // d(area)/d(corner) = (B - C) x n / 2; each wall is met once from either side
          add(G, at, B[0] - C[0], B[1] - C[1], B[2] - C[2], nx, ny, nz, 0.25);
          add(CG[k], at, B[0], B[1], B[2], C[0], C[1], C[2], 1 / 6);
        }
      });
    }
    var N = 3 * n, m = K - 1, M = [], r = [], j;
    function dot(a, b) { var s = 0; for (var x = 0; x < N; x++) s += (a[x] || 0) * (b[x] || 0); return s; }
    for (i = 0; i < m; i++) { M.push([]); for (j = 0; j < m; j++) M[i].push(j < i ? M[j][i] : dot(CG[i], CG[j])); r.push(dot(CG[i], G)); }
    for (i = 0; i < m; i++) {
      var piv = i;
      for (j = i + 1; j < m; j++) if (Math.abs(M[j][i]) > Math.abs(M[piv][i])) piv = j;
      var tm = M[i]; M[i] = M[piv]; M[piv] = tm; var tr = r[i]; r[i] = r[piv]; r[piv] = tr;
      for (j = i + 1; j < m; j++) { var f = M[j][i] / M[i][i]; for (k = i; k < m; k++) M[j][k] -= f * M[i][k]; r[j] -= f * r[i]; }
    }
    var p = new Array(K);
    for (i = m - 1; i >= 0; i--) { var s = r[i]; for (j = i + 1; j < m; j++) s -= M[i][j] * p[j]; p[i] = s / M[i][i]; }
    p[K - 1] = 0;
    var res = 0;
    for (i = 0; i < N; i++) { var e = G[i] || 0; for (k = 0; k < m; k++) e -= p[k] * (CG[k][i] || 0); res += e * e; }
    return { p: p, resid: Math.sqrt(res), verts: n };
  }

  // ---- mesh refinement ----
  // Flat triangles overestimate a curved film by an amount that falls with the square of
  // their size. h is the triangle edge relative to the coarsest mesh (1, 1/2, 1/4, ...).
  function fitLimit(points) {
    var n = points.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
    points.forEach(function (d) { var x = d.h * d.h; sx += x; sy += d.s; sxx += x * x; sxy += x * d.s; });
    var slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    return { limit: (sy - slope * sx) / n, slope: slope };
  }
  function richardson(a, b, c) {
    var d1 = a - b, d2 = b - c, ratio = d1 / d2;
    return { ratio: ratio, limit: c - d2 / (ratio - 1) };
  }

  // Levels the page relaxes itself (refinement level, relaxer steps), and the two finer
  // ones from `node scripts/foam-04-refine.mjs`, which take minutes.
  var LIVE = {
    k: [{ level: 1, steps: 60 }, { level: 2, steps: 100 }, { level: 3, steps: 300 }],
    w: [{ level: 0, steps: 300 }, { level: 1, steps: 300 }, { level: 2, steps: 600 }]
  };
  var FINE = {
    k: [{ level: 4, triangles: 18432, steps: 6000, s: 5.3063142 }, { level: 5, triangles: 73728, steps: 12000, s: 5.3062859 }],
    w: [{ level: 3, triangles: 17664, steps: 12000, s: 5.2883693 }, { level: 4, triangles: 70656, steps: 12000, s: 5.2883489 }]
  };

  function runChecks() {
    var Cells = lib('cells.js', 'FoamCells'), Evolver = lib('evolver.js', 'FoamEvolver');
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: detail }); }
    function near(name, got, want, tol) { ok(name, Math.abs(got - want) < tol, got + ' vs ' + want); }

    // Kusner and Sullivan's numbers against the page's own geometry
    var eq = Cells.equalVolumeA15(), plain = Cells.foam(Cells.sites.a15()), bcc = Cells.foam(Cells.sites.bcc());
    near('K-S Evolver costs convert to 5.30628 and 5.28834', KS.kelvin + KS.wp, 5.30628 + 5.28834, 1e-5);
    near('K-S unrelaxed Kelvin cost 18.7653 is the flat truncated octahedron', KS.kelvinFlat, bcc.s, 1e-5);
    near('closed-form flat cost matches cells.js at equal volumes', flatCost(1 / 8), eq.foam.s, 1e-10);
    near('closed-form flat cost matches cells.js for nearest-point walls', flatCost(125 / 1024), plain.s, 1e-10);
    ok('flat equal-volume cost is just under K-S 18.57752', KS.wpFlat - eq.foam.s > 0 && KS.wpFlat - eq.foam.s < 1e-6, eq.foam.s + ' < ' + KS.wpFlat);
    near('K-S floor for the Kelvin pattern is 18.5816, or 5.29734', KS.floorMu, 18.5816, 1e-4);
    ok('flat equal-volume foam lies under the floor by about 0.0004', KS.floor - eq.foam.s > 3.5e-4 && KS.floor - eq.foam.s < 4.5e-4, (KS.floor - eq.foam.s).toFixed(6));
    ok('nearest-point walls cost less than equal volumes', plain.s < eq.foam.s, plain.s + ' < ' + eq.foam.s);
    near('wallsFoam(1.5) dodecahedron share', wallsFoam(Cells, 1.5).cells[0].volume, 0.126482, 1e-6);

    // per-cell costs
    var cube = Evolver.build(Cells.weld(Cells.foam(Cells.sites.sc())), 0), cm = surface(cube.cellTriangles(0));
    ok('surface() of the unit cube: area 6, volume 1', Math.abs(cm.area - 6) < 1e-12 && Math.abs(cm.volume - 1) < 1e-12, cm.area + ' ' + cm.volume);
    var wp = Evolver.build(Cells.weld(eq.foam), 1), kel = Evolver.build(Cells.weld(bcc), 1);
    // equivalent cells agree only as far as the relaxation has converged, so average each kind
    function kinds(mesh) {
      var c = [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return cellCost(mesh.cellTriangles(k)); });
      return { d12: (c[0] + c[1]) / 2, d14: (c[2] + c[3] + c[4] + c[5] + c[6] + c[7]) / 6 };
    }
    var flat = kinds(wp), f12 = flat.d12, f14 = flat.d14, fk = cellCost(kel.cellTriangles(0));
    near('flat dodecahedron cost', f12, eq.foam.cells[0].area / Math.pow(eq.foam.cells[0].volume, 2 / 3), 1e-10);
    near('flat cell costs average to the foam cost', (2 * f12 + 6 * f14) / 8, eq.foam.s, 1e-10);
    ok('flat: dodecahedron dearer than Kelvin\'s cell, fourteen-faced cell cheaper', f12 > fk && f14 < fk, f12.toFixed(4) + ' > ' + fk.toFixed(4) + ' > ' + f14.toFixed(4));
    wp.step(300); kel.step(100);
    var rel = kinds(wp), r12 = rel.d12, r14 = rel.d14, rk = cellCost(kel.cellTriangles(0));
    near('relaxed cell costs average to the foam cost', (2 * r12 + 6 * r14) / 8, wp.s(), 1e-9);
    ok('relaxed: dodecahedron cheapest, both cells under Kelvin\'s', r12 < r14 && r14 < rk, r12.toFixed(4) + ' < ' + r14.toFixed(4) + ' < ' + rk.toFixed(4));
    ok('relaxing lowers the dodecahedron and raises the fourteen-faced cell', r12 < f12 && r14 > f14, (r12 - f12).toFixed(4) + ' ' + (r14 - f14).toFixed(4));

    // pressures, two ways
    var pk = pressures(kel), pw = pressures(wp);
    ok('force balance finds every mesh corner once', pw.verts === wp.vertices && pk.verts === kel.vertices, pw.verts + ' ' + pk.verts);
    ok('Kelvin: both cells at one pressure', Math.abs(pk.p[0] - pk.p[1]) < 1e-4, pk.p.join(' '));
    var dp = (pw.p[0] + pw.p[1]) / 2 - (pw.p[2] + pw.p[3] + pw.p[4] + pw.p[5] + pw.p[6] + pw.p[7]) / 6;
    var spread = Math.max.apply(null, pw.p.slice(2)) - Math.min.apply(null, pw.p.slice(2));
    ok('Weaire-Phelan: dodecahedra above the others by 0.332 to 0.333', dp > 0.332 && dp < 0.333 && spread < 1e-3 && pw.resid < 1e-3, dp.toFixed(5) + ', spread ' + spread.toExponential(1) + ', resid ' + pw.resid.toExponential(1));
    var lo = Evolver.build(Cells.weld(wallsFoam(Cells, 0.5)), 1), hi = Evolver.build(Cells.weld(wallsFoam(Cells, 1.5)), 1);
    lo.step(300); hi.step(300);
    // one repeat has area <s> in a unit cube; moving volume dv into each of two dodecahedra
    // out of six neighbors changes it by 2 (p12 - p14) dv
    var slope = (hi.s() - lo.s()) / (wallsFoam(Cells, 1.5).cells[0].volume - wallsFoam(Cells, 0.5).cells[0].volume);
    near('half the slope of relaxed cost against dodecahedron share is the same pressure', slope / 2, dp, 2e-3);

    // refinement
    var fit = fitLimit([{ h: 1, s: 7 }, { h: 0.5, s: 5.5 }, { h: 0.25, s: 5.125 }]);
    near('fitLimit recovers s = 5 + 2 h^2', fit.limit + fit.slope, 7, 1e-12);
    near('richardson recovers the same limit', richardson(7, 5.5, 5.125).limit, 5, 1e-12);
    function live(id, welded) {
      return LIVE[id].map(function (d, i) { var m = Evolver.build(welded, d.level); m.step(d.steps); return { h: Math.pow(0.5, i), s: m.s(), triangles: m.triangles }; });
    }
    var lk = live('k', Cells.weld(bcc)), lw = live('w', Cells.weld(eq.foam));
    near('Kelvin: limit fitted to the three live meshes', fitLimit(lk).limit, KS.kelvin, 2e-5);
    near('Weaire-Phelan: limit fitted to the three live meshes', fitLimit(lw).limit, KS.wp, 4e-5);
    ok('live meshes end on the page\'s 4,608 and 4,416 triangles', lk[2].triangles === 4608 && lw[2].triangles === 4416, lk[2].triangles + ' ' + lw[2].triangles);
    near('Kelvin: three finest meshes extrapolate to the published cost', richardson(lk[2].s, FINE.k[0].s, FINE.k[1].s).limit, KS.kelvin, 3e-6);
    near('Weaire-Phelan: finest precomputed mesh within 0.00001 of the published cost', FINE.w[1].s, KS.wp, 1e-5);
    var k4 = Evolver.build(Cells.weld(bcc), 4); k4.step(60);
    ok('a short run of the 18,432-triangle Kelvin mesh lands on the precomputed value', k4.triangles === FINE.k[0].triangles && Math.abs(k4.s() - FINE.k[0].s) < 1e-5, k4.s() + ' vs ' + FINE.k[0].s);
    return out;
  }

  var api = {
    KS: KS, flatCost: flatCost, wallsFoam: wallsFoam, surface: surface, cellCost: cellCost,
    pressures: pressures, fitLimit: fitLimit, richardson: richardson, LIVE: LIVE, FINE: FINE, runChecks: runChecks
  };
  if (inNode) module.exports = api;
  else global.Foam04 = api;
})(typeof window !== 'undefined' ? window : globalThis);
