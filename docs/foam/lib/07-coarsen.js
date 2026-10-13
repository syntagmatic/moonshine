// 07-coarsen.js — a two-dimensional dry foam that coarsens, for "Foams in Motion".
// No dependencies; runs in the browser (window.FoamCoarsen) and in node (require).
//
// THE MODEL. The foam is a network of films on a periodic box. Each film is a chain
// of short straight segments between two junctions, where three films meet. The code
// knows two rules and nothing else:
//
//   1. Films pull. Every segment pulls on its two end nodes with tension 1, and the gas
//      on each side pushes on it with that bubble's pressure. A node moves at a speed
//      proportional to the net force on it (film mobility M per unit length). Junctions
//      are ordinary nodes that happen to have three neighbors, so the 120 degree rule
//      is not imposed anywhere: it is where three equal pulls balance.
//   2. Gas leaks. Each bubble holds an amount of gas, measured as the area it fills.
//      Gas crosses a film at a rate D times the film's length times the pressure
//      difference across it. The pressures are whatever they must be for every bubble
//      to fill exactly the area of the gas it holds (one sparse linear solve per step).
//
// Nothing in the update refers to the number of sides of a bubble. In the continuum
// limit this model obeys von Neumann's law exactly, dA/dt = k (pi/3)(n - 6) with
// k = M D / (M + D). (Film motion sweeps area at M [sum of (p_i - p_j) L_ij - T_i] and
// the leak removes it at D sum of (p_i - p_j) L_ij, where T_i is the turning of the
// bubble's walls; equate the two and eliminate the pressures.) M >> D is a soap froth
// whose films are circular arcs, D >> M is Mullins's curvature flow for metal grains.
// On a finite mesh the law holds up to a discretization error, which runChecks()
// measures (under 1% for one bubble, about 0.015 sides of rms scatter in a froth) and
// which the article plots rather than hides. The one tuned ingredient is the mobility
// of a junction, chosen so that its lumped share of film is consistent with the rest
// of the mesh to first order; see geom().
//
// TOPOLOGY. A film that is still shrinking when it gets shorter than 0.3 mesh lengths
// (about 7% of a typical film) is replaced by a film at right angles to it (T1, a
// neighbor swap), unless one of the two bubbles it separates is a triangle. A bubble
// with three sides (or, rarely, two) is removed once its area is under 0.6% of the
// mean or one of its films is that short, and its gas is given to its neighbors (T2).
// Bubbles with more sides shed them by T1 as they shrink. Both are counted as they
// happen; a T1 that is reversed almost at once is not counted.
//
// Public API:
//   random(opts)      -> Foam   seeded random froth on a periodic box
//                        opts: { n, seed, aspect, M, D, res }
//   lone(n, opts)     -> Foam   one n-sided bubble inside a fixed circular wall (tests)
//   honeycomb(nx, ny, opts) -> Foam   regular hexagons on a periodic box (tests)
//   foam.step()               one explicit time step (returns dt)
//   foam.advance(T)           step until foam.t has grown by T
//   foam.relax(steps)         steps with gas diffusion switched off
//   foam.outlines()           [{ id, n, area, p, pts:[x,y,...] }] for drawing
//   foam.stats()              { t, bubbles, meanSides, length, area, gas, t1, t2 }
//   foam.rateConstant()       k (pi/3): the predicted dA/dt per side away from six
//   bubble(n)                 the symmetric n-sided bubble with 120 degree corners, area 1
//   foam.burst(film)          remove one film: the two bubbles beside it become one
//   defect(nx, ny, opts)      -> Foam   a honeycomb with one change at its middle,
//                        opts.kind 'burst' (one film removed) or 'inflate' (one bubble
//                        given twice the gas of the others); foam.marked is that bubble
//   runChecks(opts)           -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var PI = Math.PI;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ---------------------------------------------------------------- Voronoi start
  // Voronoi cells of points on a W x H torus, by clipping a big square with the
  // perpendicular bisectors to every other point and its eight nearest images.
  // Returns one polygon per site: counterclockwise vertices, and for each vertex
  // the site across the wall that leaves it.
  function voronoiTorus(pts, W, H) {
    var N = pts.length, polys = [];
    var S = W + H;
    // spatial bins so each site only clips against near sites
    var bsz = Math.sqrt(W * H / N) * 1.0;
    var nx = Math.max(1, Math.floor(W / bsz)), ny = Math.max(1, Math.floor(H / bsz));
    var bw = W / nx, bh = H / ny, bins = [];
    for (var q = 0; q < nx * ny; q++) bins.push([]);
    pts.forEach(function (p, i) {
      var ix = Math.min(nx - 1, Math.floor(p[0] / bw)), iy = Math.min(ny - 1, Math.floor(p[1] / bh));
      bins[iy * nx + ix].push(i);
    });
    var RING = 3, useBins = nx >= 2 * RING + 1 && ny >= 2 * RING + 1;

    function clipCell(i, cand) {
      var p = pts[i];
      var X = [-S, S, S, -S], Y = [-S, -S, S, S], T = [-1, -1, -1, -1]; // relative to p
      for (var c = 0; c < cand.length; c++) {
        var j = cand[c][0], qx = cand[c][1], qy = cand[c][2]; // q = neighbor - p
        var h = 0.5 * (qx * qx + qy * qy), n = X.length, any = false, k;
        var d = new Array(n);
        for (k = 0; k < n; k++) { d[k] = X[k] * qx + Y[k] * qy - h; if (d[k] > 0) any = true; }
        if (!any) continue;
        var NX = [], NY = [], NT = [];
        for (k = 0; k < n; k++) {
          var k2 = (k + 1) % n, din = d[k] <= 0, dout = d[k2] <= 0;
          if (din) { NX.push(X[k]); NY.push(Y[k]); NT.push(dout ? T[k] : T[k]); }
          if (din !== dout) {
            var u = d[k] / (d[k] - d[k2]);
            NX.push(X[k] + u * (X[k2] - X[k])); NY.push(Y[k] + u * (Y[k2] - Y[k]));
            NT.push(din ? j : T[k]);
          }
        }
        X = NX; Y = NY; T = NT;
      }
      return { X: X, Y: Y, T: T };
    }
    function candidatesAll(i) {
      var p = pts[i], out = [];
      for (var j = 0; j < N; j++) for (var sx = -1; sx <= 1; sx++) for (var sy = -1; sy <= 1; sy++) {
        if (j === i && sx === 0 && sy === 0) continue;
        out.push([j, pts[j][0] + sx * W - p[0], pts[j][1] + sy * H - p[1]]);
      }
      out.sort(function (a, b) { return a[1] * a[1] + a[2] * a[2] - b[1] * b[1] - b[2] * b[2]; });
      return out;
    }
    function candidatesNear(i) {
      var p = pts[i], out = [];
      var ix = Math.min(nx - 1, Math.floor(p[0] / bw)), iy = Math.min(ny - 1, Math.floor(p[1] / bh));
      for (var ax = -RING; ax <= RING; ax++) for (var ay = -RING; ay <= RING; ay++) {
        var jx = ((ix + ax) % nx + nx) % nx, jy = ((iy + ay) % ny + ny) % ny, list = bins[jy * nx + jx];
        for (var k = 0; k < list.length; k++) {
          var j = list[k]; if (j === i) continue;
          var qx = pts[j][0] - p[0], qy = pts[j][1] - p[1];
          qx -= W * Math.round(qx / W); qy -= H * Math.round(qy / H);
          out.push([j, qx, qy]);
        }
      }
      out.sort(function (a, b) { return a[1] * a[1] + a[2] * a[2] - b[1] * b[1] - b[2] * b[2]; });
      return out;
    }
    for (var i = 0; i < N; i++) {
      var cell = null;
      if (useBins) {
        cell = clipCell(i, candidatesNear(i));
        var rmax = 0, open = false;
        for (var k = 0; k < cell.X.length; k++) {
          rmax = Math.max(rmax, Math.hypot(cell.X[k], cell.Y[k]));
          if (cell.T[k] < 0) open = true;
        }
        if (open || 2 * rmax > RING * Math.min(bw, bh)) cell = null; // not provably complete
      }
      if (!cell) cell = clipCell(i, candidatesAll(i));
      for (var v = 0; v < cell.X.length; v++) { cell.X[v] += pts[i][0]; cell.Y[v] += pts[i][1]; }
      polys.push(cell);
    }
    return polys;
  }

  // ---------------------------------------------------------------- the foam
  function Foam(o) {
    o = o || {};
    this.periodic = o.periodic !== false;
    this.W = o.W || 1; this.H = o.H || 1;
    this.M = o.M === undefined ? 5 : o.M;   // film mobility
    this.D = o.D === undefined ? 1 : o.D;   // film permeability to gas
    this.res = o.res || 4;                  // segments on a film of typical length
    this.cfl = o.cfl || 0.4;
    this.fixedH0 = o.h0 || 0;               // tests can pin the mesh size
    this.J = []; this.E = []; this.C = [];
    this.t = 0; this.steps = 0; this.t1 = 0; this.t2 = 0; this.t2lens = 0; this.undone = 0; this.blocked = 0;
    this.bubbles = 0; this.events = [];     // recent events, for drawing: {type, x, y, t}
    this.cgIters = 0;
    this._cap = 0;
  }

  Foam.prototype.dX = function (d) { return this.periodic ? d - this.W * Math.round(d / this.W) : d; };
  Foam.prototype.dY = function (d) { return this.periodic ? d - this.H * Math.round(d / this.H) : d; };
  Foam.prototype.boxArea = function () { return this.W * this.H; };
  Foam.prototype.meanArea = function () { return this._meanArea || this.boxArea() / Math.max(1, this.bubbles); };
  Foam.prototype.h0 = function () { return this.fixedH0 || 0.62 * Math.sqrt(this.meanArea()) / this.res; };
  // dA/dt = rateConstant() * (n - 6) in the continuum limit.
  Foam.prototype.rateConstant = function () {
    var k = this.D === Infinity ? this.M : this.M * this.D / (this.M + this.D);
    return k * PI / 3;
  };

  Foam.prototype.addJunction = function (x, y, fixed) {
    this.J.push({ x: x, y: y, e: [], fixed: !!fixed, alive: true, Tx: 0, Ty: 0, Wx: 0, Wy: 0,
      sa: 0, s1x: 0, s1y: 0, sxx: 0, sxy: 0, syy: 0, mxx: 0, mxy: 0, myy: 0 });
    return this.J.length - 1;
  };
  Foam.prototype.addEdge = function (a, b, cl, cr, fixed) {
    this.E.push({ a: a, b: b, cl: cl, cr: cr, x: [], y: [], fixed: !!fixed, alive: true, L: 0, Lprev: Infinity, w: 0, s: 0,
      t0x: 0, t0y: 0, t1x: 0, t1y: 0, l0: 0, l1: 0, r0x: 0, r0y: 0, r1x: 0, r1y: 0, off: 0, flipT: -Infinity });
    var id = this.E.length - 1;
    this.J[a].e.push(id); this.J[b].e.push(id);
    return id;
  };
  Foam.prototype.addCell = function () {
    this.C.push({ alive: true, n: 0, A: 0, gas: 0, p: 0, cx: 0, cy: 0, sx: 0, sy: 0, cnt: 0, epoch: 0, tEvent: -Infinity, ext: 0 });
    this.bubbles++;
    return this.C.length - 1;
  };

  // Finish construction: side counts, reference points, mesh, gas = area.
  Foam.prototype.init = function () {
    var self = this, C = this.C;
    C.forEach(function (c) { c.n = 0; });
    this.E.forEach(function (e) {
      if (!e.alive) return;
      if (e.cl >= 0) C[e.cl].n++;
      if (e.cr >= 0) C[e.cr].n++;
      // any junction on the boundary is a good enough first reference point
      var a = self.J[e.a], b = self.J[e.b];
      if (e.cl >= 0 && !C[e.cl].ref) { C[e.cl].cx = a.x; C[e.cl].cy = a.y; C[e.cl].ref = true; }
      if (e.cr >= 0 && !C[e.cr].ref) { C[e.cr].cx = b.x; C[e.cr].cy = b.y; C[e.cr].ref = true; }
    });
    this.geom(); this.geom(); // second pass uses the improved reference points
    this.remesh(true);
    this.geom();
    C.forEach(function (c) { c.gas = c.A; });
    return this;
  };

  Foam.prototype._grow = function (n) {
    if (n <= this._cap) return;
    var cap = Math.max(256, n * 2);
    this.nTx = new Float64Array(cap); this.nTy = new Float64Array(cap);
    this.ngx = new Float64Array(cap); this.ngy = new Float64Array(cap);
    this.nil = new Float64Array(cap); this.ndl = new Float64Array(cap);
    this._cap = cap;
  };
  Foam.prototype._growCells = function () {
    var n = this.C.length + 1;
    if (this.vp && this.vp.length >= n) return;
    var cap = n * 2, old = this.vp;
    this.vp = new Float64Array(cap); if (old) this.vp.set(old);
    this.vr = new Float64Array(cap); this.vz = new Float64Array(cap); this.vd = new Float64Array(cap);
    this.vq = new Float64Array(cap); this.vb = new Float64Array(cap); this.vdiag = new Float64Array(cap);
  };

  // One pass over the mesh: segment lengths, the tension force on every node, the
  // gradient of every bubble's area with respect to every node, bubble areas, and
  // the stiffest node (which sets the time step).
  Foam.prototype.geom = function () {
    var E = this.E, J = this.J, C = this.C, M = this.M, i, e, nodes = 0;
    for (i = 0; i < E.length; i++) if (E[i].alive) nodes += E[i].x.length;
    this._grow(nodes);
    for (i = 0; i < J.length; i++) { var j = J[i]; j.Tx = 0; j.Ty = 0; j.sa = 0; j.s1x = 0; j.s1y = 0; j.sxx = 0; j.sxy = 0; j.syy = 0; }
    for (i = 0; i < C.length; i++) { var c = C[i]; c.A = 0; c.sx = 0; c.sy = 0; c.cnt = 0; c.ext = 0; }
    var nTx = this.nTx, nTy = this.nTy, ngx = this.ngx, ngy = this.ngy, nil = this.nil, ndl = this.ndl;
    var off = 0, maxLam = 0, total = 0, per = this.periodic, W = this.W, H = this.H;
    for (i = 0; i < E.length; i++) {
      e = E[i]; if (!e.alive) continue;
      var a = J[e.a], b = J[e.b], m = e.x.length + 1, cl = e.cl, cr = e.cr;
      var px = a.x, py = a.y, ulx = 0, uly = 0, urx = 0, ury = 0, aL = 0, aR = 0;
      if (cl >= 0) { ulx = px - C[cl].cx; uly = py - C[cl].cy; if (per) { ulx -= W * Math.round(ulx / W); uly -= H * Math.round(uly / H); } var cc = C[cl]; cc.sx += ulx; cc.sy += uly; cc.cnt++; var ex = Math.max(Math.abs(ulx), Math.abs(uly)); if (ex > cc.ext) cc.ext = ex; }
      if (cr >= 0) { urx = px - C[cr].cx; ury = py - C[cr].cy; if (per) { urx -= W * Math.round(urx / W); ury -= H * Math.round(ury / H); } }
      var L = 0, w = 0, s = 0, ptx = 0, pty = 0, pl = 0, prx = 0, pry = 0;
      e.off = off;
      for (var k = 0; k < m; k++) {
        var qx = k < m - 1 ? e.x[k] : b.x, qy = k < m - 1 ? e.y[k] : b.y;
        var dx = qx - px, dy = qy - py;
        if (per) { dx -= W * Math.round(dx / W); dy -= H * Math.round(dy / H); }
        var l = Math.sqrt(dx * dx + dy * dy) || 1e-300, tx = dx / l, ty = dy / l, rx = 0.5 * dy, ry = -0.5 * dx;
        aL += ulx * dy - uly * dx; ulx += dx; uly += dy;
        aR += urx * dy - ury * dx; urx += dx; ury += dy;
        if (k === 0) { e.t0x = tx; e.t0y = ty; e.l0 = l; e.r0x = rx; e.r0y = ry; }
        else {
          var o = off + k - 1, gx = prx + rx, gy = pry + ry, il = 2 / (pl + l);
          var Tx = tx - ptx, Ty = ty - pty;
          nTx[o] = Tx; nTy[o] = Ty; ngx[o] = gx; ngy[o] = gy; nil[o] = il; ndl[o] = l - pl;
          w += (gx * gx + gy * gy) * il; s += (gx * Tx + gy * Ty) * il;
          var lam = M * il * (1 / pl + 1 / l); if (lam > maxLam) maxLam = lam;
        }
        if (k === m - 1) { e.t1x = tx; e.t1y = ty; e.l1 = l; e.r1x = rx; e.r1y = ry; }
        L += l; ptx = tx; pty = ty; pl = l; prx = rx; pry = ry; px = qx; py = qy;
      }
      off += m - 1;
      e.L = L; e.w = w; e.s = s; total += L;
      if (cl >= 0) C[cl].A += 0.5 * aL;
      if (cr >= 0) { C[cr].A -= 0.5 * aR; C[cr].sx += urx; C[cr].sy += ury; C[cr].cnt++; }
      // per junction: the pull of this film, and the sums over its three films that
      // make up the junction's mobility (see junction mobility, below). The normal of
      // a film leaving along (ux, uy) is (-uy, ux); only its outer products are used.
      var ia = 1 / e.l0, ib = 1 / e.l1;
      a.Tx += e.t0x; a.Ty += e.t0y; a.sa += ia; a.s1x -= ia * e.t0y; a.s1y += ia * e.t0x;
      a.sxx += ia * e.t0y * e.t0y; a.sxy -= ia * e.t0x * e.t0y; a.syy += ia * e.t0x * e.t0x;
      b.Tx -= e.t1x; b.Ty -= e.t1y; b.sa += ib; b.s1x += ib * e.t1y; b.s1y -= ib * e.t1x;
      b.sxx += ib * e.t1y * e.t1y; b.sxy -= ib * e.t1x * e.t1y; b.syy += ib * e.t1x * e.t1x;
    }
    // Junction mobility. A junction owns half of each first segment of its three
    // films. Its mobility is the 2x2 matrix (8M/9) sum_q a_q (n_q - nbar)(n_q - nbar)^T,
    // a_q = 1 / (length of first segment q), n_q its normal, nbar the a-weighted mean
    // normal. For three equal segments this is 4M / (3 l): the value for which, to
    // first order, a junction whose films are off 120 degrees by some angle sweeps
    // area out of each bubble at M times that angle, as the films beside it do.
    for (i = 0; i < J.length; i++) {
      j = J[i]; if (!j.alive) continue;
      if (j.fixed || !(j.sa > 0)) { j.mxx = j.mxy = j.myy = 0; continue; }
      var c8 = 8 * M / 9;
      j.mxx = c8 * (j.sxx - j.s1x * j.s1x / j.sa); j.mxy = c8 * (j.sxy - j.s1x * j.s1y / j.sa); j.myy = c8 * (j.syy - j.s1y * j.s1y / j.sa);
      var lj = 0.5 * (j.mxx * j.sxx + 2 * j.mxy * j.sxy + j.myy * j.syy); if (lj > maxLam) maxLam = lj;
    }
    // move each bubble's reference point to the mean of its junctions
    for (i = 0; i < C.length; i++) { c = C[i]; if (c.alive && c.cnt) { c.cx += c.sx / c.cnt; c.cy += c.sy / c.cnt; } }
    this.totalLength = total; this.maxLam = maxLam;
    return maxLam;
  };

  // Pressures: solve (G + D Lap) p = rhs by conjugate gradients, where G p is the
  // rate at which pressures p inflate each bubble through film motion, and D Lap p
  // is the rate at which gas leaves it. The films are packed into flat arrays first.
  Foam.prototype._pack = function () {
    var E = this.E, J = this.J, nC = this.C.length, M = this.M, Dk = this.D === Infinity ? 0 : this.D, i, e;
    if (!this.pa || this.pa.length < E.length) {
      var ne = E.length;
      this.pa = new Int32Array(ne); this.pb = new Int32Array(ne); this.pl = new Int32Array(ne); this.pr = new Int32Array(ne); this.pid = new Int32Array(ne);
      this.pk = new Float64Array(ne); this.pdp = new Float64Array(ne);
      this.p0x = new Float64Array(ne); this.p0y = new Float64Array(ne); this.p1x = new Float64Array(ne); this.p1y = new Float64Array(ne);
    }
    if (!this.jmxx || this.jmxx.length < J.length) {
      var nj = J.length;
      this.jmxx = new Float64Array(nj); this.jmxy = new Float64Array(nj); this.jmyy = new Float64Array(nj);
      this.jWx = new Float64Array(nj); this.jWy = new Float64Array(nj); this.jUx = new Float64Array(nj); this.jUy = new Float64Array(nj);
    }
    var n = 0;
    for (i = 0; i < E.length; i++) {
      e = E[i]; if (!e.alive || e.fixed) continue;
      var open = e.cl < 0 || e.cr < 0;
      this.pa[n] = e.a; this.pb[n] = e.b; this.pl[n] = e.cl < 0 ? nC : e.cl; this.pr[n] = e.cr < 0 ? nC : e.cr; this.pid[n] = i;
      this.pk[n] = M * e.w + (open ? 0 : Dk * e.L);
      this.p0x[n] = e.r0x; this.p0y[n] = e.r0y; this.p1x[n] = e.r1x; this.p1y[n] = e.r1y;
      n++;
    }
    this.pn = n;
    for (i = 0; i < J.length; i++) { var j = J[i]; this.jmxx[i] = j.mxx; this.jmxy[i] = j.mxy; this.jmyy[i] = j.myy; }
  };
  Foam.prototype._apply = function (p, out) {
    var n = this.pn, nC = this.C.length, nj = this.J.length, k, a, b, dp;
    var pa = this.pa, pb = this.pb, pl = this.pl, pr = this.pr, pk = this.pk, pdp = this.pdp;
    var p0x = this.p0x, p0y = this.p0y, p1x = this.p1x, p1y = this.p1y;
    var Wx = this.jWx, Wy = this.jWy, Ux = this.jUx, Uy = this.jUy, mxx = this.jmxx, mxy = this.jmxy, myy = this.jmyy;
    for (k = 0; k <= nC; k++) out[k] = 0;
    for (k = 0; k < nj; k++) { Wx[k] = 0; Wy[k] = 0; }
    for (k = 0; k < n; k++) {
      dp = p[pl[k]] - p[pr[k]]; pdp[k] = dp; a = pa[k]; b = pb[k];
      Wx[a] += dp * p0x[k]; Wy[a] += dp * p0y[k]; Wx[b] += dp * p1x[k]; Wy[b] += dp * p1y[k];
    }
    for (k = 0; k < nj; k++) { Ux[k] = mxx[k] * Wx[k] + mxy[k] * Wy[k]; Uy[k] = mxy[k] * Wx[k] + myy[k] * Wy[k]; }
    for (k = 0; k < n; k++) {
      a = pa[k]; b = pb[k];
      var f = pk[k] * pdp[k] + p0x[k] * Ux[a] + p0y[k] * Uy[a] + p1x[k] * Ux[b] + p1y[k] * Uy[b];
      out[pl[k]] += f; out[pr[k]] -= f;
    }
    out[nC] = 0;
  };

  Foam.prototype.solve = function (tau) {
    this._growCells(); this._pack();
    var E = this.E, J = this.J, C = this.C, M = this.M, nC = C.length, i, k, e;
    var p = this.vp, r = this.vr, z = this.vz, d = this.vd, q = this.vq, rhs = this.vb, diag = this.vdiag;
    if (this.D === Infinity) { for (i = 0; i <= nC; i++) p[i] = 0; this._apply(p, q); return 0; }
    for (i = 0; i <= nC; i++) { rhs[i] = 0; diag[i] = 0; }
    for (k = 0; k < this.pn; k++) {
      e = E[this.pid[k]];
      var a = J[e.a], b = J[e.b];
      var f = M * e.s
        + e.r0x * (a.mxx * a.Tx + a.mxy * a.Ty) + e.r0y * (a.mxy * a.Tx + a.myy * a.Ty)
        + e.r1x * (b.mxx * b.Tx + b.mxy * b.Ty) + e.r1y * (b.mxy * b.Tx + b.myy * b.Ty);
      var dg = this.pk[k]
        + a.mxx * e.r0x * e.r0x + 2 * a.mxy * e.r0x * e.r0y + a.myy * e.r0y * e.r0y
        + b.mxx * e.r1x * e.r1x + 2 * b.mxy * e.r1x * e.r1y + b.myy * e.r1y * e.r1y;
      var il = this.pl[k], ir = this.pr[k];
      rhs[il] -= f; rhs[ir] += f; diag[il] += dg; diag[ir] += dg;
    }
    var alive = 0, mean = 0;
    for (i = 0; i < nC; i++) {
      if (!C[i].alive) { rhs[i] = 0; p[i] = 0; diag[i] = 1; continue; }
      if (tau > 0) rhs[i] += (C[i].gas - C[i].A) / tau;
      alive++; mean += rhs[i];
    }
    rhs[nC] = 0; p[nC] = 0; diag[nC] = 1;
    // On a closed box the pressures are defined up to a constant: keep them mean zero.
    var gauge = this.periodic || this.closed;
    if (gauge) { mean /= alive; for (i = 0; i < nC; i++) if (C[i].alive) rhs[i] -= mean; }
    this._apply(p, q);
    var rz = 0, bb = 0, rr = 0;
    for (i = 0; i < nC; i++) {
      r[i] = rhs[i] - q[i]; z[i] = diag[i] > 0 ? r[i] / diag[i] : 0; d[i] = z[i];
      rz += r[i] * z[i]; bb += rhs[i] * rhs[i]; rr += r[i] * r[i];
    }
    d[nC] = 0;
    var tol = this.cgTol * this.cgTol * bb + 1e-30, it = 0;
    while (rr > tol && it < 400) {
      this._apply(d, q);
      var dq = 0; for (i = 0; i < nC; i++) dq += d[i] * q[i];
      if (!(dq > 0)) break;
      var al = rz / dq, rz2 = 0; rr = 0;
      for (i = 0; i < nC; i++) {
        p[i] += al * d[i]; r[i] -= al * q[i];
        z[i] = diag[i] > 0 ? r[i] / diag[i] : 0; rz2 += r[i] * z[i]; rr += r[i] * r[i];
      }
      var be = rz2 / rz; rz = rz2;
      for (i = 0; i < nC; i++) d[i] = z[i] + be * d[i];
      it++;
    }
    if (gauge) {
      mean = 0; for (i = 0; i < nC; i++) if (C[i].alive) mean += p[i];
      mean /= alive; for (i = 0; i < nC; i++) if (C[i].alive) p[i] -= mean;
    }
    this._apply(p, q); // leaves pdp and the junction forces consistent with the final pressures
    for (k = 0; k < this.pn; k++) E[this.pid[k]].dp = this.pdp[k];
    for (i = 0; i < J.length; i++) { J[i].Wx = this.jWx[i]; J[i].Wy = this.jWy[i]; }
    this.cgIters += it;
    return it;
  };
  Foam.prototype.cgTol = 1e-3; // relative residual; the area feedback in step() absorbs the rest

  // One explicit step. diffuse = false freezes the gas (used to relax a start).
  Foam.prototype.step = function (diffuse) {
    var E = this.E, J = this.J, C = this.C, M = this.M, i, e;
    this.geom();
    var dt = this.cfl / this.maxLam;
    if (this.dtMax && dt > this.dtMax) dt = this.dtMax;
    var Dsave = this.D;
    if (diffuse === false) this.D = 0;
    this.solve(5 * dt);
    var p = this.vp, D = this.D === Infinity ? 0 : this.D;
    var nTx = this.nTx, nTy = this.nTy, ngx = this.ngx, ngy = this.ngy, nil = this.nil, ndl = this.ndl;
    for (i = 0; i < E.length; i++) {
      e = E[i]; if (!e.alive || e.fixed) continue;
      var dp = e.dp, n = e.x.length, o = e.off;
      for (var k = 0; k < n; k++, o++) {
        var gx = ngx[o], gy = ngy[o], c = M * nil[o] * dt;
        // normal motion from tension and pressure, plus a slide along the chord of
        // the two neighbors that evens out the spacing and changes no area
        var sl = 0.05 * ndl[o] / Math.sqrt(gx * gx + gy * gy);
        e.x[k] += c * (nTx[o] + dp * gx) - sl * gy;
        e.y[k] += c * (nTy[o] + dp * gy) + sl * gx;
      }
      if (D > 0 && e.cl >= 0 && e.cr >= 0) { var fl = D * e.L * dp * dt; C[e.cl].gas -= fl; C[e.cr].gas += fl; }
    }
    for (i = 0; i < J.length; i++) {
      var j = J[i]; if (!j.alive || j.fixed) continue;
      var fx = j.Tx + j.Wx, fy = j.Ty + j.Wy;
      j.x += dt * (j.mxx * fx + j.mxy * fy); j.y += dt * (j.mxy * fx + j.myy * fy);
    }
    for (i = 0; i < C.length; i++) if (C[i].alive) C[i].p = p[i];
    this.D = Dsave;
    this.t += dt; this.steps++;
    if (!this.noTopology) this.topology();
    return dt;
  };
  Foam.prototype.advance = function (T, maxSteps) {
    var end = this.t + T, n = 0;
    while (this.t < end && n < (maxSteps || 1e9)) { this.step(); n++; }
    return n;
  };
  Foam.prototype.relax = function (steps) {
    for (var i = 0; i < steps; i++) this.step(false);
    return this;
  };

  // ---------------------------------------------------------------- remeshing
  Foam.prototype.segmentsFor = function (L, h0) {
    return Math.min(48, Math.max(this.minSeg, Math.round(L / h0)));
  };
  Foam.prototype.resample = function (e, m) {
    var J = this.J, a = J[e.a], b = J[e.b], n = e.x.length, X = [a.x], Y = [a.y], S = [0], k;
    for (k = 0; k <= n; k++) {
      var qx = k < n ? e.x[k] : b.x, qy = k < n ? e.y[k] : b.y;
      var dx = this.dX(qx - X[k]), dy = this.dY(qy - Y[k]);
      X.push(X[k] + dx); Y.push(Y[k] + dy); S.push(S[k] + Math.hypot(dx, dy));
    }
    var L = S[n + 1], nx = [], ny = [], seg = 0;
    for (k = 1; k < m; k++) {
      var s = L * k / m;
      while (seg < n && S[seg + 1] < s) seg++;
      var u = (s - S[seg]) / ((S[seg + 1] - S[seg]) || 1);
      nx.push(X[seg] + u * (X[seg + 1] - X[seg])); ny.push(Y[seg] + u * (Y[seg + 1] - Y[seg]));
    }
    e.x = nx; e.y = ny;
  };
  Foam.prototype.remesh = function (force) {
    var E = this.E, h0 = this.h0(), changed = 0;
    for (var i = 0; i < E.length; i++) {
      var e = E[i]; if (!e.alive || e.fixed) continue;
      var m = e.x.length + 1, want = this.segmentsFor(e.L, h0);
      if (want === m) continue;
      // hysteresis: only change when the length is clearly on the other side
      if (!force && (this.segmentsFor(e.L * 1.12, h0) === m || this.segmentsFor(e.L / 1.12, h0) === m)) continue;
      this.resample(e, want); changed++;
    }
    return changed;
  };

  // ---------------------------------------------------------------- topology
  Foam.prototype.other = function (e, j) { return e.a === j ? e.b : e.a; };
  Foam.prototype.borders = function (e, c) { return e.cl === c || e.cr === c; };
  Foam.prototype.touch = function (c) { if (c >= 0) { this.C[c].epoch++; this.C[c].tEvent = this.t; } };
  Foam.prototype.note = function (type, x, y) {
    this.events.push({ type: type, x: x, y: y, t: this.t });
    if (this.events.length > 64) this.events.shift();
  };

  // T1: the short film e between bubbles cl and cr is replaced by a film at right
  // angles, between the two bubbles that sat at its ends. cl and cr lose a side,
  // the end bubbles gain one.
  Foam.prototype.t1Flip = function (ei) {
    var E = this.E, J = this.J, C = this.C, e = E[ei];
    if (e.x.length || e.fixed) return false;
    var ja = J[e.a], jb = J[e.b];
    if (ja.fixed || jb.fixed || e.a === e.b || e.cl < 0 || e.cr < 0 || e.cl === e.cr) return false;
    if (C[e.cl].n < 4 || C[e.cr].n < 4) return false; // a triangle does not lose a side, it vanishes (T2)
    var self = this, aL = -1, aR = -1, bL = -1, bR = -1;
    ja.e.forEach(function (f) { if (f === ei) return; if (self.borders(E[f], e.cl)) aL = f; else aR = f; });
    jb.e.forEach(function (f) { if (f === ei) return; if (self.borders(E[f], e.cl)) bL = f; else bR = f; });
    if (aL < 0 || aR < 0 || bL < 0 || bR < 0 || aL === bL || aR === bR) return false;
    if (!this.borders(E[aR], e.cr) || !this.borders(E[bR], e.cr)) return false;
    var ca = E[aL].cl === e.cl ? E[aL].cr : E[aL].cl, cb = E[bL].cl === e.cl ? E[bL].cr : E[bL].cl;
    if (ca === cb || ca < 0 || cb < 0 || !this.borders(E[aR], ca) || !this.borders(E[bR], cb)) return false;
    var dx = this.dX(jb.x - ja.x), dy = this.dY(jb.y - ja.y), l = Math.hypot(dx, dy) || 1e-12;
    var mx = ja.x + 0.5 * dx, my = ja.y + 0.5 * dy, nx = -dy / l, ny = dx / l; // left normal, toward cl
    var half = 0.5 * this.t1Length;
    // positions are only ever used through nearest-image differences, so any image will do
    ja.x = mx + half * nx; ja.y = my + half * ny;
    jb.x = mx - half * nx; jb.y = my - half * ny;
    if (E[bL].a === e.b) E[bL].a = e.a; else E[bL].b = e.a;
    if (E[aR].a === e.a) E[aR].a = e.b; else E[aR].b = e.b;
    ja.e = [ei, aL, bL]; jb.e = [ei, aR, bR];
    C[e.cl].n--; C[e.cr].n--; C[ca].n++; C[cb].n++;
    this.touch(e.cl); this.touch(e.cr); this.touch(ca); this.touch(cb);
    e.cl = cb; e.cr = ca;
    e.Lprev = Infinity;
    // a flip that undoes the previous flip of the same film is a failed swap, not two swaps
    if (this.t - e.flipT < this.t1Undo) { this.t1--; e.flipT = -Infinity; this.undone++; }
    else { this.t1++; e.flipT = this.t; this.note('T1', mx, my); }
    return true;
  };

  Foam.prototype.cellEdges = function (c) {
    var E = this.E, out = [];
    for (var i = 0; i < E.length; i++) if (E[i].alive && (E[i].cl === c || E[i].cr === c)) out.push(i);
    return out;
  };

  // T2: a three-sided or two-sided bubble that has shrunk to almost nothing is
  // removed. Its last gas goes to the neighbors in proportion to the area each gains.
  Foam.prototype.t2Remove = function (c) {
    var E = this.E, J = this.J, C = this.C, self = this, cell = C[c];
    var edges = this.cellEdges(c);
    if (edges.length !== cell.n || (cell.n !== 3 && cell.n !== 2)) return false;
    var js = [];
    edges.forEach(function (ei) { [E[ei].a, E[ei].b].forEach(function (j) { if (js.indexOf(j) < 0) js.push(j); }); });
    if (js.length !== cell.n) return false;
    var outer = js.map(function (j) { var o = -1; J[j].e.forEach(function (f) { if (edges.indexOf(f) < 0) o = f; }); return o; });
    if (outer.indexOf(-1) >= 0) return false;
    for (var q = 0; q < js.length; q++) if (J[js[q]].fixed) return false;
    var nb = [];
    edges.forEach(function (ei) { var o = E[ei].cl === c ? E[ei].cr : E[ei].cl; if (nb.indexOf(o) < 0) nb.push(o); });
    if (nb.indexOf(c) >= 0 || nb.indexOf(-1) >= 0) return false;
    var before = nb.map(function (o) { return C[o].A; });
    // centroid of the junctions, in the image of the first
    var j0 = J[js[0]], cx = 0, cy = 0;
    js.forEach(function (j) { cx += self.dX(J[j].x - j0.x); cy += self.dY(J[j].y - j0.y); });
    cx = j0.x + cx / js.length; cy = j0.y + cy / js.length;

    if (cell.n === 3) {
      if (outer[0] === outer[1] || outer[1] === outer[2] || outer[0] === outer[2]) return false;
      if (nb.length !== 3) return false;
      edges.forEach(function (ei) { E[ei].alive = false; });
      for (q = 1; q < 3; q++) {
        var o = E[outer[q]];
        if (o.a === js[q]) o.a = js[0]; else o.b = js[0];
        J[js[q]].alive = false; J[js[q]].e = [];
      }
      j0.x = cx; j0.y = cy; j0.e = outer.slice();
      nb.forEach(function (o) { C[o].n--; self.touch(o); });
    } else {
      // two-sided: the two outer films join into one
      if (outer[0] === outer[1] || nb.length !== 2) return false;
      var o1 = E[outer[0]], o2 = E[outer[1]];
      if (o1.fixed || o2.fixed) return false;
      if (o1.a === js[0]) { // reverse so that o1 ends at js[0]
        var t = o1.a; o1.a = o1.b; o1.b = t; t = o1.cl; o1.cl = o1.cr; o1.cr = t; o1.x.reverse(); o1.y.reverse();
      }
      var x2 = o2.x.slice(), y2 = o2.y.slice(), far = o2.b;
      if (o2.a !== js[1]) { x2.reverse(); y2.reverse(); far = o2.a; }
      if (far === o1.a) return false;
      o1.x = o1.x.concat([cx], x2); o1.y = o1.y.concat([cy], y2);
      // re-chain so consecutive stored points are in adjacent images
      var px = J[o1.a].x, py = J[o1.a].y;
      for (q = 0; q < o1.x.length; q++) { px += this.dX(o1.x[q] - px); py += this.dY(o1.y[q] - py); o1.x[q] = px; o1.y[q] = py; }
      o1.b = far;
      var fj = J[far]; fj.e[fj.e.indexOf(outer[1])] = outer[0];
      o2.alive = false; edges.forEach(function (ei) { E[ei].alive = false; });
      J[js[0]].alive = false; J[js[1]].alive = false; J[js[0]].e = []; J[js[1]].e = [];
      nb.forEach(function (o) { C[o].n -= 2; self.touch(o); });
      o1.Lprev = Infinity;
    }
    cell.alive = false; this.bubbles--; this.t2++; if (cell.n === 2) this.t2lens++;
    this.note('T2', cx, cy);
    // hand the vanished bubble's gas to the neighbors by the area each one gained
    this.geom();
    var gain = nb.map(function (o, i) { return Math.max(0, C[o].A - before[i]); }), sum = 0;
    gain.forEach(function (g) { sum += g; });
    nb.forEach(function (o, i) { C[o].gas += cell.gas * (sum > 0 ? gain[i] / sum : 1 / nb.length); });
    cell.gas = 0;
    return true;
  };

  // A film bursts: the two bubbles beside it become one, which keeps the gas of both.
  // At each end of the lost film two films are left, and they join into one. The
  // merged bubble has four sides fewer than the two had between them, and the bubble
  // at each end loses one. This is the one event here that is not gas diffusion; the
  // coarsening rules never call it. Returns the index of the merged bubble.
  Foam.prototype.burst = function (ei) {
    var E = this.E, J = this.J, C = this.C, self = this, e = E[ei];
    if (!e || !e.alive || e.fixed) return -1;
    var keep = e.cl, gone = e.cr, ends = [e.a, e.b], q;
    if (keep < 0 || gone < 0 || keep === gone || e.a === e.b) return -1;
    for (q = 0; q < 2; q++) if (J[ends[q]].fixed || J[ends[q]].e.length !== 3) return -1;
    e.alive = false;
    E.forEach(function (g) { if (!g.alive) return; if (g.cl === gone) g.cl = keep; if (g.cr === gone) g.cr = keep; });
    ends.forEach(function (j) {
      var rest = J[j].e.filter(function (x) { return x !== ei; }), o1 = E[rest[0]], o2 = E[rest[1]], t;
      if (o1.a === j) { // reverse so that o1 ends at j
        t = o1.a; o1.a = o1.b; o1.b = t; t = o1.cl; o1.cl = o1.cr; o1.cr = t; o1.x.reverse(); o1.y.reverse();
      }
      var x2 = o2.x.slice(), y2 = o2.y.slice(), far = o2.b;
      if (o2.a !== j) { x2.reverse(); y2.reverse(); far = o2.a; }
      o1.x = o1.x.concat([J[j].x], x2); o1.y = o1.y.concat([J[j].y], y2);
      // re-chain so consecutive stored points are in adjacent images
      var px = J[o1.a].x, py = J[o1.a].y;
      for (var k = 0; k < o1.x.length; k++) { px += self.dX(o1.x[k] - px); py += self.dY(o1.y[k] - py); o1.x[k] = px; o1.y[k] = py; }
      o1.b = far;
      var fj = J[far]; fj.e[fj.e.indexOf(rest[1])] = rest[0];
      o2.alive = false; J[j].alive = false; J[j].e = []; o1.Lprev = Infinity;
    });
    C[keep].gas += C[gone].gas; C[gone].gas = 0; C[gone].alive = false; this.bubbles--;
    C.forEach(function (c) { c.n = 0; });
    E.forEach(function (g) { if (!g.alive) return; if (g.cl >= 0) C[g.cl].n++; if (g.cr >= 0) C[g.cr].n++; });
    this.touch(keep);
    this.geom(); this.geom(); this.remesh(true); this.geom();
    return keep;
  };

  Foam.prototype.topology = function () {
    var E = this.E, C = this.C, i;
    var h0 = this.h0(), mean = this.meanArea();
    var delta = this.t1Frac * h0, aT2 = 0.006 * mean;
    this.t1Length = 1.5 * delta;
    this.t1Undo = 0.02 * mean / this.rateConstant();
    if (this.bubbles > this.minBubbles) {
      for (i = 0; i < C.length; i++) {
        var c = C[i]; if (!c.alive || c.n > 3) continue;
        if (c.A < aT2) { this.t2Remove(i); continue; }
        // a film of a triangle or a lens that has become too short to keep: the bubble goes
        var ce = this.cellEdges(i), short = false;
        for (var k = 0; k < ce.length; k++) if (E[ce[k]].L < delta) short = true;
        if (short) this.t2Remove(i);
      }
      for (i = 0; i < E.length; i++) {
        var e = E[i]; if (!e.alive || e.fixed) continue;
        if (e.x.length === 0 && e.L < delta && e.L < e.Lprev) { if (!this.t1Flip(i)) this.blocked++; }
        e.Lprev = e.L;
      }
    }
    this.remesh(false);
  };
  Foam.prototype.minBubbles = 12;
  Foam.prototype.minSeg = 1;
  Foam.prototype.t1Frac = 0.3;

  // ---------------------------------------------------------------- readouts
  // Each bubble's boundary as a closed polyline, unwrapped around the bubble.
  Foam.prototype.outlines = function () {
    var E = this.E, J = this.J, C = this.C, lists = [], i, self = this;
    for (i = 0; i < C.length; i++) lists.push(null);
    for (i = 0; i < E.length; i++) {
      var e = E[i]; if (!e.alive) continue;
      if (e.cl >= 0) (lists[e.cl] || (lists[e.cl] = [])).push([i, 1]);
      if (e.cr >= 0) (lists[e.cr] || (lists[e.cr] = [])).push([i, -1]);
    }
    var out = [];
    for (i = 0; i < C.length; i++) {
      var c = C[i], list = lists[i]; if (!c.alive || !list) continue;
      var pts = [], used = 0, cur = list[0], guard = 0;
      var start = cur[1] > 0 ? E[cur[0]].a : E[cur[0]].b;
      var px = c.cx + this.dX(J[start].x - c.cx), py = c.cy + this.dY(J[start].y - c.cy);
      var ok = true, sx = 0, sy = 0, np = 0;
      while (used < list.length && guard++ < 100) {
        e = E[cur[0]]; var fwd = cur[1] > 0, n = e.x.length, endJ = fwd ? e.b : e.a;
        pts.push(px, py); sx += px; sy += py; np++;
        for (var k = 0; k < n; k++) {
          var kk = fwd ? k : n - 1 - k;
          px += this.dX(e.x[kk] - px); py += this.dY(e.y[kk] - py);
          pts.push(px, py);
        }
        px += this.dX(J[endJ].x - px); py += this.dY(J[endJ].y - py);
        used++;
        if (used === list.length) break;
        var next = null;
        for (var q = 0; q < list.length; q++) {
          var it = list[q]; if (it === cur || it.done) continue;
          var sj = it[1] > 0 ? E[it[0]].a : E[it[0]].b;
          if (sj === endJ) { next = it; break; }
        }
        cur.done = true;
        if (!next) { ok = false; break; }
        cur = next;
      }
      if (ok) out.push({ id: i, n: c.n, area: c.A, gas: c.gas, p: c.p, pts: pts, cx: sx / np, cy: sy / np });
    }
    return out;
  };

  // Nearest-image geometry needs every bubble to span well under half the box, so a
  // run ends when the largest bubble gets close to that, or at minN bubbles.
  Foam.prototype.finished = function (minN) {
    if (this.bubbles <= (minN || this.minBubbles)) return true;
    if (!this.periodic) return false;
    var lim = 0.33 * Math.min(this.W, this.H), C = this.C;
    for (var i = 0; i < C.length; i++) if (C[i].alive && C[i].ext > lim) return true;
    return false;
  };

  Foam.prototype.stats = function () {
    var C = this.C, n = 0, sides = 0, area = 0, gas = 0;
    for (var i = 0; i < C.length; i++) { var c = C[i]; if (!c.alive) continue; n++; sides += c.n; area += c.A; gas += c.gas; }
    return { t: this.t, bubbles: n, meanSides: sides / n, length: this.totalLength, area: area, gas: gas, t1: this.t1, t2: this.t2, t2lens: this.t2lens };
  };

  // Recount everything from the films and compare with the running bookkeeping.
  Foam.prototype.audit = function () {
    var E = this.E, J = this.J, C = this.C, n = C.map(function () { return 0; }), V = 0, Ne = 0, F = 0, bad = [];
    E.forEach(function (e, i) {
      if (!e.alive) return; Ne++;
      if (e.cl >= 0) n[e.cl]++; if (e.cr >= 0) n[e.cr]++;
      [e.a, e.b].forEach(function (j) { if (!J[j].alive || J[j].e.indexOf(i) < 0) bad.push('edge ' + i + ' not on junction ' + j); });
      if (e.cl === e.cr) bad.push('edge ' + i + ' has one bubble on both sides');
    });
    J.forEach(function (j, i) {
      if (!j.alive) return; V++;
      if (!j.fixed && j.e.length !== 3) bad.push('junction ' + i + ' has ' + j.e.length + ' films');
      j.e.forEach(function (f) { if (!E[f].alive || (E[f].a !== i && E[f].b !== i)) bad.push('junction ' + i + ' lists film ' + f); });
    });
    C.forEach(function (c, i) { if (!c.alive) return; F++; if (c.n !== n[i]) bad.push('bubble ' + i + ' side count ' + c.n + ' vs ' + n[i]); });
    return { V: V, E: Ne, F: F, bad: bad };
  };

  // ---------------------------------------------------------------- constructors
  function random(o) {
    o = o || {};
    var N = o.n || 200, aspect = o.aspect || 1, rand = mulberry32(o.seed === undefined ? 7 : o.seed);
    // units: mean bubble area 1 at the start
    var W = Math.sqrt(N * aspect), H = N / W; // aspect = width / height
    var f = new Foam({ W: W, H: H, M: o.M, D: o.D, res: o.res, cfl: o.cfl });
    // random points, rejecting any closer than dmin to an earlier one, so the start
    // has no vanishingly small bubbles
    var dmin = o.dmin === undefined ? 0.55 : o.dmin, pts = [], tries = 0;
    while (pts.length < N && tries < N * 4000) {
      tries++;
      var x = rand() * W, y = rand() * H, ok = true;
      for (var i = 0; i < pts.length && ok; i++) {
        var dx = f.dX(x - pts[i][0]), dy = f.dY(y - pts[i][1]);
        if (dx * dx + dy * dy < dmin * dmin) ok = false;
      }
      if (ok) pts.push([x, y]);
    }
    fromVoronoi(f, pts);
    return f.init();
  }

  function fromVoronoi(f, pts) {
    var polys = voronoiTorus(pts, f.W, f.H), W = f.W, H = f.H;
    var qz = 1e-6 * Math.sqrt(W * H / pts.length), NXq = Math.round(W / qz), NYq = Math.round(H / qz), map = {};
    function junctionAt(x, y) {
      x = ((x % W) + W) % W; y = ((y % H) + H) % H;
      var ix = Math.round(x / qz), iy = Math.round(y / qz);
      for (var ax = -1; ax <= 1; ax++) for (var ay = -1; ay <= 1; ay++) {
        var key = (((ix + ax) % NXq) + NXq) % NXq + ',' + (((iy + ay) % NYq) + NYq) % NYq;
        if (map[key] !== undefined) return map[key];
      }
      var id = f.addJunction(x, y);
      map[(ix % NXq) + ',' + (iy % NYq)] = id;
      return id;
    }
    pts.forEach(function () { f.addCell(); });
    var seen = {};
    polys.forEach(function (P, i) {
      var n = P.X.length;
      for (var k = 0; k < n; k++) {
        var k2 = (k + 1) % n, j = P.T[k];
        var ja = junctionAt(P.X[k], P.Y[k]), jb = junctionAt(P.X[k2], P.Y[k2]);
        if (seen[jb + ',' + ja + ',' + j + ',' + i]) continue;
        seen[ja + ',' + jb + ',' + i + ',' + j] = true;
        f.addEdge(ja, jb, i, j);
      }
    });
  }

  // One n-sided bubble of circumradius r0 at the center of a fixed circular wall of
  // radius R, joined to it by n straight films. By symmetry the spokes stay straight
  // and the n outer bubbles share one pressure, so this is the textbook lone bubble.
  function lone(n, o) {
    o = o || {};
    var r0 = o.r0 || 1, R = o.R || 3;
    var f = new Foam({ periodic: false, M: o.M, D: o.D, res: o.res, cfl: o.cfl, h0: o.h0 });
    f.closed = true; f.minBubbles = Infinity; // no topology in this test
    f.noTopology = !!o.noTopology;
    f.addCell(); for (var k = 0; k < n; k++) f.addCell();
    var inner = [], outerJ = [];
    for (k = 0; k < n; k++) {
      var a = 2 * PI * k / n + (o.phase || 0);
      inner.push(f.addJunction(r0 * Math.cos(a), r0 * Math.sin(a)));
      outerJ.push(f.addJunction(R * Math.cos(a), R * Math.sin(a), true));
    }
    for (k = 0; k < n; k++) {
      var k2 = (k + 1) % n;
      f.addEdge(inner[k], inner[k2], 0, 1 + k);
      f.addEdge(inner[k], outerJ[k], 1 + k, 1 + (k - 1 + n) % n);
      var ring = f.addEdge(outerJ[k], outerJ[k2], 1 + k, -1, true);
      // the wall is a fixed polyline along the circle
      var a0 = 2 * PI * k / n + (o.phase || 0), segs = 12;
      for (var s = 1; s < segs; s++) { var aa = a0 + (2 * PI / n) * s / segs; f.E[ring].x.push(R * Math.cos(aa)); f.E[ring].y.push(R * Math.sin(aa)); }
    }
    f._meanArea = PI * r0 * r0;
    return f.init();
  }

  // nx by ny regular hexagons (ny even) on a periodic box, unit area each.
  function honeycomb(nx, ny, o) {
    o = o || {};
    var s = Math.sqrt(2 / (3 * Math.sqrt(3))), w = Math.sqrt(3) * s, pts = [];
    for (var r = 0; r < ny; r++) for (var c = 0; c < nx; c++) pts.push([(c + 0.5 * (r % 2) + 0.25) * w, (r + 0.25) * 1.5 * s]);
    var f = new Foam({ W: nx * w, H: ny * 1.5 * s, M: o.M, D: o.D, res: o.res });
    fromVoronoi(f, pts);
    return f.init();
  }

  // A honeycomb of nx by ny unit hexagons with one change made at its middle.
  //   kind 'burst':   the film nearest the middle of the box is removed, leaving one
  //                   eight-sided bubble of area 2 with a five-sided bubble at each end.
  //   kind 'inflate': the bubble nearest the middle is given twice the gas of every
  //                   other bubble (the total is unchanged), and keeps its six sides.
  // foam.marked is the changed bubble. Call relax() before letting the gas move.
  function defect(nx, ny, o) {
    o = o || {};
    var f = honeycomb(nx, ny, o), best = -1, bd = Infinity, i;
    if (o.kind === 'inflate') {
      f.outlines().forEach(function (c) {
        var d = Math.hypot(c.cx - f.W / 2, c.cy - f.H / 2);
        if (d < bd - 1e-9) { bd = d; best = c.id; }
      });
      var unit = f.boxArea() / (f.bubbles + 1);
      f.C.forEach(function (c, k) { c.gas = k === best ? 2 * unit : unit; });
      f.marked = best;
    } else {
      for (i = 0; i < f.E.length; i++) {
        var e = f.E[i], a = f.J[e.a], b = f.J[e.b];
        var d = Math.hypot(a.x + 0.5 * f.dX(b.x - a.x) - f.W / 2, a.y + 0.5 * f.dY(b.y - a.y) - f.H / 2);
        if (d < bd - 1e-9) { bd = d; best = i; }
      }
      f.marked = f.burst(best);
    }
    return f;
  }

  // ---------------------------------------------------------------- the symmetric bubble
  // An n-sided bubble with every corner at 120 degrees, by symmetry: corners on a
  // circle, walls circular arcs. Going once around, the tangent turns 2 pi. Each
  // corner turns it by pi/3, so each wall must turn it by 2 pi/n - pi/3 (negative
  // for n > 6: the wall bulges inward). Scaled to area 1.
  function bubble(n) {
    var theta = 2 * PI / n - PI / 3;           // turning along one wall
    var rho = 1, chord = 2 * rho * Math.sin(PI / n);
    var at = Math.abs(theta), r = at < 1e-12 ? Infinity : chord / (2 * Math.sin(at / 2));
    var poly = 0.5 * n * rho * rho * Math.sin(2 * PI / n);
    var seg = r === Infinity ? 0 : 0.5 * r * r * (at - Math.sin(at)) * (theta > 0 ? 1 : -1);
    var area = poly + n * seg, k = 1 / Math.sqrt(area);
    return {
      n: n, wallTurn: theta, cornerTurn: PI / 3, totalWallTurn: n * theta,
      rho: rho * k, chord: chord * k, radius: r * k, arcLength: r === Infinity ? chord * k : r * k * at,
      curvature: r === Infinity ? 0 : (theta > 0 ? 1 : -1) / (r * k),
      // curvature x length summed over the walls: (pi/3)(6 - n)
      flux: n * theta
    };
  }

  // ---------------------------------------------------------------- measuring
  // Follows every bubble between samples and returns one (sides, dA/dt) point for
  // each bubble that took part in no event during the interval: no film of its own
  // flipped and no neighbor vanished, so its side count was constant. An interval
  // that starts within `settle` mean areas (in time units of 1/k) of such an event
  // is skipped too, because the mesh takes a few steps to absorb one. The area is
  // the polygon area of the bubble's mesh, not the gas bookkeeping.
  function Meter(foam, settle) {
    this.foam = foam; this.prev = null; this.t = foam.t; this.settle = settle === undefined ? 0.005 : settle;
  }
  Meter.prototype.sample = function () {
    var f = this.foam, C = f.C, now = [], out = [], dt = f.t - this.t, lag = this.settle * f.meanArea();
    for (var i = 0; i < C.length; i++) {
      var c = C[i]; if (!c.alive) { now.push(null); continue; }
      now.push({ A: c.A, epoch: c.epoch, n: c.n });
      var p = this.prev && this.prev[i];
      if (p && dt > 0 && p.epoch === c.epoch && p.n === c.n && this.t >= c.tEvent + lag) out.push({ id: i, n: c.n, rate: (c.A - p.A) / dt, area: 0.5 * (c.A + p.A) });
    }
    this.prev = now; this.t = f.t;
    return out;
  };

  function fitLine(pts) { // least squares rate = a + b n
    var n = pts.length, sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
    pts.forEach(function (p) { sx += p.n; sy += p.rate; sxx += p.n * p.n; sxy += p.n * p.rate; syy += p.rate * p.rate; });
    var b = (n * sxy - sx * sy) / (n * sxx - sx * sx), a = (sy - b * sx) / n;
    var ssr = 0, sst = 0, my = sy / n;
    pts.forEach(function (p) { var r = p.rate - a - b * p.n; ssr += r * r; sst += (p.rate - my) * (p.rate - my); });
    return { slope: b, intercept: a, zero: -a / b, r2: 1 - ssr / sst, rms: Math.sqrt(ssr / n), count: n };
  }

  // ---------------------------------------------------------------- checks
  function runChecks(opts) {
    opts = opts || {};
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: String(detail) }); }

    // 1. The symmetric bubble: corners turn n pi/3, walls turn the rest of 2 pi.
    var worst = 0;
    for (var n = 2; n <= 12; n++) { var b = bubble(n); worst = Math.max(worst, Math.abs(n * b.cornerTurn + b.totalWallTurn - 2 * PI), Math.abs(b.curvature * b.arcLength * n - (PI / 3) * (6 - n))); }
    ok('symmetric bubble: corner turning + wall turning = 2 pi, and curvature x length = (pi/3)(6 - n)', worst < 1e-12, 'worst error ' + worst.toExponential(2));

    // 2. A lone n-sided bubble changes area at k (pi/3)(n - 6).
    var rows = [], worstRel = 0, worstAbs = 0;
    [3, 4, 5, 6, 7, 8, 9].forEach(function (n) {
      var f = lone(n, { M: 5, D: 1, res: 6 });
      f.relax(400); f.advance(0.02); // let the geometry start following the gas before timing
      var A0 = f.C[0].A, t0 = f.t, target = (n < 6 ? 0.85 : 1.1) * A0, guard = 0;
      if (n === 6) f.advance(0.3); else while ((n < 6 ? f.C[0].A > target : f.C[0].A < target) && guard++ < 200000) f.step();
      var rate = (f.C[0].A - A0) / (f.t - t0), want = f.rateConstant() * (n - 6);
      rows.push(n + ': ' + rate.toFixed(4) + ' vs ' + want.toFixed(4));
      if (n === 6) worstAbs = Math.abs(rate); else worstRel = Math.max(worstRel, Math.abs(rate / want - 1));
    });
    ok('lone n-sided bubble: dA/dt within 2% of k (pi/3)(n - 6), n = 3..9 (6 segments per film)', worstRel < 0.02 && worstAbs < 0.005, rows.join('; '));

    // 3. The error falls as the mesh is refined.
    var errs = [3, 6, 12].map(function (res) {
      var f = lone(4, { M: 5, D: 1, res: res });
      f.relax(100 * res * res / 9); f.advance(0.02);
      var A0 = f.C[0].A, t0 = f.t; while (f.C[0].A > 0.9 * A0) f.step();
      return Math.abs((f.C[0].A - A0) / (f.t - t0) / (f.rateConstant() * -2) - 1);
    });
    ok('lone 4-sided bubble: rate error shrinks with refinement (3, 6, 12 segments per film)', errs[2] < errs[1] && errs[1] < errs[0] && errs[2] < 0.005,
      errs.map(function (e) { return (100 * e).toFixed(2) + '%'; }).join(', '));

    // 4. With the gas frozen, a lone bubble relaxes to the analytic shape: wall nodes
    //    on a circle of the predicted radius, and the area untouched.
    (function () {
      var n = 4, f = lone(n, { M: 5, D: 1, res: 12 }), A0 = f.C[0].A;
      f.relax(6000);
      var b = bubble(n), scale = Math.sqrt(f.C[0].A), R = b.radius * scale;
      // center of the arc for wall 0 lies on the bisector of corners 0 and 1
      var e = f.E[0], ja = f.J[e.a], jb = f.J[e.b];
      var mx = 0.5 * (ja.x + jb.x), my = 0.5 * (ja.y + jb.y), ml = Math.hypot(mx, my);
      var dist = ml - Math.sqrt(R * R - 0.25 * Math.pow(Math.hypot(jb.x - ja.x, jb.y - ja.y), 2));
      var cx = mx / ml * dist, cy = my / ml * dist, dev = 0;
      for (var k = 0; k < e.x.length; k++) dev = Math.max(dev, Math.abs(Math.hypot(e.x[k] - cx, e.y[k] - cy) - R) / R);
      // corner angle of the bubble, from the tangents of that circle at the two ends
      ok('frozen gas: lone 4-sided bubble keeps its area and its walls relax onto the analytic arc',
        Math.abs(f.C[0].A / A0 - 1) < 1e-6 && dev < 0.005, 'area drift ' + (f.C[0].A / A0 - 1).toExponential(2) + ', worst node off the arc by ' + (100 * dev).toFixed(3) + '% of its radius');
    })();

    // 5. A honeycomb is stationary: every bubble has six sides.
    (function () {
      var f = honeycomb(6, 6), A0 = f.C.map(function (c) { return c.A; }), L0 = f.totalLength;
      f.advance(0.5);
      var d = 0; f.C.forEach(function (c, i) { d = Math.max(d, Math.abs(c.A - A0[i])); });
      ok('honeycomb: no bubble changes area and no film moves', d < 1e-9 && Math.abs(f.totalLength - L0) < 1e-9 && f.t1 === 0 && f.t2 === 0,
        'max area change ' + d.toExponential(2) + ' over t = 0.5, wall cost ' + (f.totalLength / 36).toFixed(4) + ' (hexagon 1.8612)');
    })();

    // 6. A random froth: conservation, Euler, the law, and the events.
    (function () {
      var N = opts.n || 300, f = random({ n: N, seed: 20261010, aspect: 1.6 });
      f.relax(300); f.advance(0.02); // let the geometry start following the gas before timing
      var s0 = f.stats(), meter = new Meter(f), pts = [], Lprev = f.totalLength, Lup = 0, maxGap = 0;
      meter.sample();
      var win = 0.02, guard = 0;
      while (f.bubbles > N * 0.4 && guard++ < 4000) {
        f.advance(win * f.meanArea());
        pts = pts.concat(meter.sample());
        if (f.totalLength > Lprev) Lup++;
        Lprev = f.totalLength;
        f.C.forEach(function (c) { if (c.alive) maxGap = Math.max(maxGap, Math.abs(c.A - c.gas) / f.meanArea()); });
      }
      var s = f.stats(), au = f.audit(), fit = fitLine(pts), kc = f.rateConstant();
      ok('froth: total area and total gas conserved', Math.abs(s.area / f.boxArea() - 1) < 1e-9 && Math.abs(s.gas / f.boxArea() - 1) < 1e-9,
        'area/box - 1 = ' + (s.area / f.boxArea() - 1).toExponential(2) + ', gas/box - 1 = ' + (s.gas / f.boxArea() - 1).toExponential(2));
      ok('froth: every bubble fills its gas to within 0.02 mean areas (the largest gaps follow a T2, whose neighbors absorb up to 0.006)', maxGap < 0.02, 'worst |area - gas| = ' + maxGap.toExponential(2) + ' mean areas');
      ok('froth: topology consistent, V = 2F, E = 3F, mean sides exactly 6', au.bad.length === 0 && au.V === 2 * au.F && au.E === 3 * au.F && Math.abs(s.meanSides - 6) < 1e-12,
        'V ' + au.V + ', E ' + au.E + ', F ' + au.F + ', mean sides ' + s.meanSides + (au.bad.length ? ', ' + au.bad[0] : ''));
      ok('froth: film length falls', s.length < s0.length && Lup <= 0.02 * guard, 'from ' + s0.length.toFixed(2) + ' to ' + s.length.toFixed(2) + ', rose in ' + Lup + ' of ' + guard + ' windows');
      var worstPt = 0; pts.forEach(function (p) { worstPt = Math.max(worstPt, Math.abs(p.rate / kc - (p.n - 6))); });
      ok('froth: measured dA/dt against sides fits the n - 6 line', Math.abs(fit.slope / kc - 1) < 0.02 && Math.abs(fit.zero - 6) < 0.02 && fit.r2 > 0.99,
        'slope ' + (fit.slope / kc).toFixed(4) + ' k(pi/3), zero at n = ' + fit.zero.toFixed(3) + ', r^2 ' + fit.r2.toFixed(4) + ', rms scatter ' + (fit.rms / kc).toFixed(3) + ', worst single point off by ' + worstPt.toFixed(2) + ' (units of k pi/3), ' + fit.count + ' measurements');
      // a film the rules could not resolve would keep shrinking: none may be far under the T1 threshold
      var shortest = Infinity; f.E.forEach(function (e) { if (e.alive) shortest = Math.min(shortest, e.L); });
      shortest /= f.t1Frac * f.h0();
      ok('froth: both kinds of event happen, bubbles only disappear, and no film is left stuck short', f.t1 > 0 && f.t2 === N - s.bubbles && shortest > 0.5,
        'T1 ' + f.t1 + ' (' + f.undone + ' more undone at once), T2 ' + f.t2 + ' of which ' + f.t2lens + ' two-sided, bubbles ' + N + ' -> ' + s.bubbles + ', shortest film ' + shortest.toFixed(2) + ' of the T1 threshold');
    })();

    // 7. Scaling state: mean area grows linearly in time.
    if (opts.scaling !== false) (function () {
      var N = opts.nScaling || 1200, f = random({ n: N, seed: 4, aspect: 1, M: 2 });
      f.relax(200);
      var series = [], guard = 0;
      while (f.bubbles > N / 8 && guard++ < 1e6) { f.advance(0.05 * f.meanArea()); series.push([f.t, f.meanArea()]); }
      // slopes over the last three doublings of the mean area
      var marks = [N / 1, N / 2, N / 4, N / 8].map(function (m) { for (var i = 0; i < series.length; i++) if (f.boxArea() / series[i][1] <= m) return series[i]; return series[series.length - 1]; });
      var slopes = [0, 1, 2].map(function (i) { return (marks[i + 1][1] - marks[i][1]) / (marks[i + 1][0] - marks[i][0]) / f.rateConstant(); });
      var late = series.filter(function (p) { return p[1] >= 2; }), fit = fitLine(late.map(function (p) { return { n: p[0], rate: p[1] }; }));
      ok('scaling: mean bubble area grows linearly once the start is forgotten', Math.abs(slopes[2] / slopes[1] - 1) < 0.15 && fit.r2 > 0.995,
        'd<A>/dt in units of k(pi/3) over successive doublings: ' + slopes.map(function (s) { return s.toFixed(3); }).join(', ') + '; straight-line r^2 from <A> = 2 on: ' + fit.r2.toFixed(4) + '; ' + N + ' -> ' + f.bubbles + ' bubbles');
    })();

    // 8. One film removed from a honeycomb, and one bubble inflated in another.
    if (opts.defect !== false) (function () {
      var f = defect(12, 10, { kind: 'burst' }), big = f.marked, hist = {}, au = f.audit(), s0 = f.stats();
      f.C.forEach(function (c) { if (c.alive) hist[c.n] = (hist[c.n] || 0) + 1; });
      ok('burst film: one eight-sided bubble of area 2, two five-sided, the rest six, mean sides 6', hist[8] === 1 && hist[5] === 2 && hist[6] === 116 && f.bubbles === 119 && au.bad.length === 0 &&
        Math.abs(f.C[big].gas - 2) < 1e-9 && Math.abs(s0.meanSides - 6) < 1e-12 && Math.abs(s0.area / f.boxArea() - 1) < 1e-9 && Math.abs(s0.gas / f.boxArea() - 1) < 1e-9,
        JSON.stringify(hist) + ', marked bubble n = ' + f.C[big].n + ', gas ' + f.C[big].gas.toFixed(6) + ', V ' + au.V + ' E ' + au.E + ' F ' + au.F);
      f.relax(300);
      var kc = f.rateConstant(), tg = f.t, A0 = f.C[big].A, t0 = 0, n0 = f.C[big].n, ep = f.C[big].epoch, pred = A0, worst = 0, tPrev = f.t, guard = 0;
      // follow the marked bubble: between changes of its side count its area must move at n - 6
      while ((f.t - tg) * kc < 2.5 && guard++ < 200000) {
        var nBefore = f.C[big].n; f.step();
        pred += (nBefore - 6) * (f.t - tPrev) * kc; tPrev = f.t;
        worst = Math.max(worst, Math.abs(f.C[big].A - pred));
      }
      var six = 0, alive = 0; f.C.forEach(function (c) { if (c.alive) { alive++; if (c.n === 6) six++; } });
      ok('burst film: the eight-sided bubble keeps growing and gaining sides, at n - 6 throughout', f.C[big].alive && f.C[big].n >= 12 && f.C[big].A > 10 && worst < 0.25 && f.audit().bad.length === 0,
        'after 2.5 time units: ' + f.C[big].n + ' sides, area ' + f.C[big].A.toFixed(2) + ' (law integrated over its side counts: ' + pred.toFixed(2) + ', worst gap ' + worst.toFixed(3) + '); ' + six + ' of ' + alive + ' bubbles still six-sided; T1 ' + f.t1 + ', T2 ' + f.t2);
      var g = defect(12, 10, { kind: 'inflate' }), m = g.marked;
      g.relax(600);
      var B0 = g.C.map(function (c) { return c.A; }), tg2 = g.t, d = 0;
      while ((g.t - tg2) * g.rateConstant() < 2.5) g.step();
      g.C.forEach(function (c, i) { d = Math.max(d, Math.abs(c.A - B0[i])); });
      ok('inflated bubble: twice the area, six sides, and nothing changes', g.C[m].n === 6 && Math.abs(g.C[m].A / g.C[m === 0 ? 1 : 0].A - 2) < 1e-6 && d < 1e-9 && g.t1 === 0 && g.t2 === 0,
        'area ' + g.C[m].A.toFixed(4) + ' against ' + g.C[m === 0 ? 1 : 0].A.toFixed(4) + ', largest area change over 2.5 time units ' + d.toExponential(2) + ', events ' + (g.t1 + g.t2));
    })();

    return out;
  }

  var api = {
    Foam: Foam, Meter: Meter, random: random, lone: lone, honeycomb: honeycomb, defect: defect, bubble: bubble,
    fitLine: fitLine, voronoiTorus: voronoiTorus, mulberry32: mulberry32, runChecks: runChecks
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamCoarsen = api;
})(typeof window !== 'undefined' ? window : globalThis);
