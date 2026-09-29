// germs.js: germs of holomorphic functions and analytic continuation, for the
// last essay of the sheaves series.
//
// A germ here is a power series sum a_n (z - c)^n about a centre c != 0, for one
// of three functions with a branch point at 0:
//
//   'sqrt'  z^(1/2)    satisfies 2 z f' = f     two sheets
//   'cbrt'  z^(1/3)    satisfies 3 z f' = f     three sheets
//   'log'   log z      satisfies z f' = 1       infinitely many
//
// The radius of convergence is |c|, the distance to the branch point.
// Continuation moves the centre in small steps. Each step sums the old series
// at the new centre (a point well inside the old disk), which is the value of
// the continued function there; the differential equation then fixes every
// other coefficient of the new germ from that value. `reexpand` computes the
// low coefficients the other way, by re-expanding the old series about the new
// centre, and the checks confirm the two agree. (Re-expanding every coefficient
// at every step is numerically unstable: truncation errors in the high
// coefficients grow geometrically from step to step.)
//
// Complex numbers are [re, im] pairs.
//
// API (window.Germs, or module.exports in node):
//   Germs.germ(kind, c, a0)          the germ at c with value a0 at c
//   Germs.principal(kind, c)         the germ at c with the principal value there
//   Germs.evaluate(g, z)             the series summed at z (|z - c| < |c|)
//   Germs.reexpand(g, c2, K)         first K coefficients of the old series about c2
//   Germs.moveTo(g, target, rmin)    continue g to the germ at target, stepping in
//                                    polar coordinates (the shorter way round, never
//                                    closer to 0 than rmin); { germ, centres, values }
//                                    with the germ's value at every intermediate centre
//   Germs.sheet(g)                   integer m with a0 = principal value times
//                                    e^(2 pi i m / sheets) (roots, m mod sheets) or
//                                    a0 = Log c + 2 pi i m (log)
//   Germs.monodromy(kind)            the loop's effect on the local system of
//                                    solutions, as a complex matrix (1x1 or 2x2)
//   Germs.cover(n)                   n disks round the unit circle, placed so the
//                                    negative real axis runs midway between two
//                                    centres: { centres, r, cut } with cut the index k
//                                    of the overlap k, k+1 that straddles it
//   Germs.nerveSheaf(kind, n, m)     the local system of solutions on the disk cover,
//                                    as a cellular sheaf on its nerve (an n-cycle),
//                                    realified; m[k] is disk k's chosen branch.
//                                    { S, scal } with scal[k] the complex map on
//                                    overlap k, k+1 writing g_k in g_{k+1}'s basis, so
//                                    the product (log: sum) round the cycle is the
//                                    counterclockwise monodromy
//   Germs.flat(x, K)                 derivatives 0..K of exp(-1/x) (0 for x <= 0)
//   Germs.runChecks()                [{ name, ok, detail }]
(function (global) {
  'use strict';

  var N = 48, TAU = 2 * Math.PI;
  var KINDS = { sqrt: { alpha: 1 / 2, sheets: 2 }, cbrt: { alpha: 1 / 3, sheets: 3 }, log: { log: true } };

  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function mul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function scale(a, s) { return [a[0] * s, a[1] * s]; }
  function div(a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
  function abs(a) { return Math.hypot(a[0], a[1]); }
  function arg(a) { return Math.atan2(a[1], a[0]); }
  function polar(r, t) { return [r * Math.cos(t), r * Math.sin(t)]; }
  function cexp(a) { return polar(Math.exp(a[0]), a[1]); }
  function clog(a) { return [Math.log(abs(a)), arg(a)]; }

  function principalValue(kind, c) {
    var K = KINDS[kind];
    if (K.log) return clog(c);
    return polar(Math.pow(abs(c), K.alpha), K.alpha * arg(c));
  }

  // Coefficients from the differential equation: a_{n+1} = a_n (alpha - n) / ((n + 1) c)
  // for z^alpha, and a_n = (-1)^(n+1) / (n c^n) for log.
  function germ(kind, c, a0) {
    var K = KINDS[kind], a = [a0], inv = div([1, 0], c), n;
    if (K.log) {
      var p = inv;
      for (n = 1; n < N; n++) { a.push(scale(p, (n % 2 ? 1 : -1) / n)); p = mul(p, inv); }
    } else {
      for (n = 0; n < N - 1; n++) a.push(scale(mul(a[n], inv), (K.alpha - n) / (n + 1)));
    }
    return { kind: kind, c: c, a: a };
  }
  function principal(kind, c) { return germ(kind, c, principalValue(kind, c)); }

  function evaluate(g, z) {
    var h = sub(z, g.c), s = [0, 0], p = [1, 0];
    for (var n = 0; n < g.a.length; n++) { s = add(s, mul(g.a[n], p)); p = mul(p, h); }
    return s;
  }

  function reexpand(g, c2, K) {
    var h = sub(c2, g.c), hp = [[1, 0]], out = [], n, k;
    for (n = 1; n < g.a.length; n++) hp.push(mul(hp[n - 1], h));
    for (k = 0; k < K; k++) {
      var s = [0, 0], C = 1;
      for (n = k; n < g.a.length; n++) {
        if (n > k) C = C * n / (n - k);
        s = add(s, scale(mul(g.a[n], hp[n - k]), C));
      }
      out.push(s);
    }
    return out;
  }

  function step(g, c2) { return germ(g.kind, c2, evaluate(g, c2)); }

  // Polar steps of at most 0.18 in log r and in angle keep |c2 - c| / |c| below 0.3,
  // where the 48-term series is exact to double precision.
  function moveTo(g, target, rmin) {
    rmin = rmin || 0;
    var r1 = Math.max(abs(target), rmin), r0 = abs(g.c);
    var t0 = arg(g.c), dt = arg(target) - t0;
    dt -= TAU * Math.round(dt / TAU);
    var dl = Math.log(r1 / r0);
    var n = Math.max(1, Math.ceil(Math.max(Math.abs(dt), Math.abs(dl)) / 0.18));
    var centres = [g.c], values = [g.a[0]];
    for (var i = 1; i <= n; i++) {
      var c2 = polar(r0 * Math.exp(dl * i / n), t0 + dt * i / n);
      g = step(g, c2);
      centres.push(c2);
      values.push(g.a[0]);
    }
    return { germ: g, centres: centres, values: values };
  }

  function sheet(g) {
    var K = KINDS[g.kind], p = principalValue(g.kind, g.c);
    if (K.log) return Math.round((g.a[0][1] - p[1]) / TAU);
    var m = Math.round(arg(div(g.a[0], p)) / (TAU / K.sheets));
    return ((m % K.sheets) + K.sheets) % K.sheets;
  }

  // Local system of solutions. For z^alpha it is spanned by one branch g, and a
  // loop multiplies g by e^(2 pi i alpha). For log, by 1 and a branch g of log, and
  // a loop sends g to g + 2 pi i: in the basis (1, g) the matrix [[1, 2 pi i], [0, 1]].
  function monodromy(kind) {
    var K = KINDS[kind];
    if (K.log) return [[[1, 0], [0, TAU]], [[0, 0], [1, 0]]];
    return [[polar(1, TAU * K.alpha)]];
  }

  // n disks centred on the unit circle at angles 2 pi k / n, turned by pi / n when n
  // is even, so that no centre lies on the negative real axis and the axis runs
  // through the middle of one overlap, k = floor((n - 1) / 2), for every n.
  // Consecutive disks overlap, others are disjoint, and none contains 0, so the
  // nerve is an n-cycle and every disk and overlap is convex.
  function cover(n) {
    var r = n === 3 ? 0.93 : Math.min(0.92, (Math.sin(Math.PI / n) + Math.sin(TAU / n)) / 2);
    var centres = [], off = n % 2 ? 0 : Math.PI / n;
    for (var k = 0; k < n; k++) centres.push(polar(1, off + TAU * k / n));
    return { centres: centres, r: r, cut: Math.floor((n - 1) / 2) };
  }

  function realify(M) {
    var R = [];
    M.forEach(function (row) {
      var re = [], im = [];
      row.forEach(function (z) { re.push(z[0], -z[1]); im.push(z[1], z[0]); });
      R.push(re, im);
    });
    return R;
  }

  // Disk k carries the branch g_k: the germ at its centre with the principal value
  // times e^(2 pi i m_k / sheets), or Log + 2 pi i m_k. On the overlap of disks k and
  // k+1 the edge stalk uses disk k+1's basis, so F_{k+1 <| e} = I and F_{k <| e} is the
  // matrix that writes g_k in terms of g_{k+1} there (g_k = s g_{k+1}, or
  // g_k = g_{k+1} + d for log). Continuing g_0 counterclockwise through the disks then
  // multiplies it by the product of the s (adds the sum of the d), so the holonomy
  // round the cycle is the monodromy, not its inverse. Both branches are continued to
  // the midpoint of the two centres and compared, so the map is measured, not assumed.
  function branch(kind, c, m) {
    var K = KINDS[kind], p = principalValue(kind, c);
    return germ(kind, c, K.log ? add(p, [0, TAU * m]) : mul(p, polar(1, TAU * m / K.sheets)));
  }
  function nerveSheaf(kind, n, m) {
    var K = KINDS[kind], cv = cover(n), dim = K.log ? 2 : 1, edges = [], scal = [];
    var gs = cv.centres.map(function (c, k) { return branch(kind, c, (m && m[k]) || 0); });
    for (var k = 0; k < n; k++) {
      var j = (k + 1) % n, mid = scale(add(cv.centres[k], cv.centres[j]), 0.5);
      var vk = moveTo(gs[k], mid).germ.a[0], vj = moveTo(gs[j], mid).germ.a[0], M;
      if (K.log) {
        var d = sub(vk, vj);
        M = [[[1, 0], d], [[0, 0], [1, 0]]];
        scal.push(d);
      } else {
        var s = div(vk, vj);
        M = [[s]];
        scal.push(s);
      }
      var I = dim === 1 ? [[[1, 0]]] : [[[1, 0], [0, 0]], [[0, 0], [1, 0]]];
      edges.push({ u: k, v: j, Fu: realify(M), Fv: realify(I) });
    }
    var dims = cv.centres.map(function () { return 2 * dim; });
    return { S: { dims: dims, edges: edges }, scal: scal, cover: cv };
  }

  // exp(-1/x): every derivative is P_k(1/x) exp(-1/x) with P_0 = 1 and
  // P_{k+1}(t) = t^2 (P_k(t) - P_k'(t)).
  function flat(x, K) {
    var out = [];
    if (x <= 0) { for (var k = 0; k <= K; k++) out.push(0); return out; }
    var t = 1 / x, e = Math.exp(-t), P = [1];
    for (var j = 0; j <= K; j++) {
      var v = 0, tp = 1;
      for (var i = 0; i < P.length; i++) { v += P[i] * tp; tp *= t; }
      out.push(v * e);
      var Q = new Array(P.length + 2).fill(0);
      for (i = 0; i < P.length; i++) {
        Q[i + 2] += P[i];
        if (i > 0) Q[i + 1] -= i * P[i];
      }
      P = Q;
    }
    return out;
  }

  function runChecks() {
    var out = [];
    function check(name, ok, detail) { out.push({ name: name, ok: !!ok, detail: detail || '' }); }
    var Sh = global.Sheaf || (typeof require === 'function' ? require('./sheaf-math.js') : null);
    var e3 = function (x) { return x.toExponential(1); };

    // Series against closed forms inside the disk.
    var worst = 0;
    ['sqrt', 'cbrt', 'log'].forEach(function (kind) {
      [[1, 0], [-0.3, 0.8], [0.2, -1.4]].forEach(function (c) {
        var g = principal(kind, c);
        for (var t = 0; t < 12; t++) {
          var z = add(c, polar(0.6 * abs(c), TAU * t / 12));
          // continue the principal value from c to z along the segment
          var exact = principalValue(kind, z), phase = arg(z) - arg(c);
          phase -= TAU * Math.round(phase / TAU);
          var want = KINDS[kind].log ? [exact[0], arg(c) + phase] :
            polar(Math.pow(abs(z), KINDS[kind].alpha), KINDS[kind].alpha * (arg(c) + phase));
          worst = Math.max(worst, abs(sub(evaluate(g, z), want)));
        }
      });
    });
    check('series of sqrt, cbrt, log about c agree with the continued closed form at 0.6 of the radius', worst < 1e-8, 'max error ' + e3(worst));

    // Differential equation coefficients match re-expansion of the old series.
    worst = 0;
    ['sqrt', 'cbrt', 'log'].forEach(function (kind) {
      var g = principal(kind, [0.9, 0.4]), c2 = add(g.c, polar(0.28 * abs(g.c), 1.1));
      var b = reexpand(g, c2, 10), s = step(g, c2);
      for (var k = 0; k < 10; k++) worst = Math.max(worst, abs(sub(b[k], s.a[k])) * Math.pow(abs(c2), k));
    });
    check('one continuation step: the first 10 coefficients from the ODE equal those from re-expanding the old series', worst < 1e-10, 'max scaled error ' + e3(worst));

    // Monodromy: one loop, several loops, both directions.
    function loop(g, turns, r) {
      r = r || abs(g.c);
      var t0 = arg(g.c), steps = Math.ceil(Math.abs(turns) * 40);
      for (var i = 1; i <= steps; i++) g = moveTo(g, polar(r, t0 + TAU * turns * i / steps)).germ;
      return g;
    }
    var gS = loop(principal('sqrt', [1, 0]), 1), gS2 = loop(principal('sqrt', [1, 0]), 2);
    check('sqrt continued once round 0 returns as -sqrt, twice as +sqrt', abs(sub(gS.a[0], [-1, 0])) < 1e-10 && abs(sub(gS2.a[0], [1, 0])) < 1e-10 && sheet(gS) === 1 && sheet(gS2) === 0,
      'values ' + gS.a[0][0].toFixed(12) + ', ' + gS2.a[0][0].toFixed(12));
    var gL = loop(principal('log', [0.5, 0.5]), 1), gLm = loop(principal('log', [0.5, 0.5]), -2);
    var lp = principalValue('log', [0.5, 0.5]);
    check('log continued once counterclockwise gains 2 pi i; twice clockwise loses 4 pi i', abs(sub(gL.a[0], add(lp, [0, TAU]))) < 1e-10 && abs(sub(gLm.a[0], add(lp, [0, -2 * TAU]))) < 1e-10 && sheet(gL) === 1 && sheet(gLm) === -2,
      'sheets ' + sheet(gL) + ', ' + sheet(gLm));
    var gC = loop(principal('cbrt', [0, 1.2]), 1), gC3 = loop(principal('cbrt', [0, 1.2]), 3), cp = principalValue('cbrt', [0, 1.2]);
    check('cbrt: one loop multiplies by e^(2 pi i/3), three loops return', abs(sub(gC.a[0], mul(cp, polar(1, TAU / 3)))) < 1e-10 && abs(sub(gC3.a[0], cp)) < 1e-10,
      'sheets ' + sheet(gC) + ', ' + sheet(gC3));
    var lastErr = 0;
    ['sqrt', 'log'].forEach(function (kind) {
      var g = loop(principal(kind, [1, 0]), 3), ex = kind === 'log' ? germ(kind, [1, 0], [0, 3 * TAU]) : germ(kind, [1, 0], [-1, 0]);
      for (var k = 0; k < N; k++) lastErr = Math.max(lastErr, abs(sub(g.a[k], ex.a[k])));
    });
    check('after three loops every coefficient matches the closed-form germ', lastErr < 1e-9, 'max error ' + e3(lastErr));

    // Homotopy invariance: a loop that does not enclose 0 changes nothing; two
    // paths from 1 to -1 on either side differ by the monodromy.
    var g0 = principal('sqrt', [1, 0]), g = g0;
    [[2, 0.5], [2.5, 2], [1.2, 2.2], [1, 0]].forEach(function (p) { g = moveTo(g, p).germ; });
    var up = moveTo(moveTo(g0, [0, 1]).germ, [-1, 0]).germ, down = moveTo(moveTo(g0, [0, -1]).germ, [-1, 0]).germ;
    check('a loop not enclosing 0 returns the same germ; paths above and below 0 reach -1 as i and -i', abs(sub(g.a[0], g0.a[0])) < 1e-10 && abs(sub(up.a[0], [0, 1])) < 1e-10 && abs(sub(down.a[0], [0, -1])) < 1e-10);

    // The disk cover: geometry, then the Cech complex of the local system.
    var geomOk = true;
    for (var n = 3; n <= 8; n++) {
      var cv = cover(n);
      if (cv.r >= 1) geomOk = false;
      for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) {
        var dd = abs(sub(cv.centres[a], cv.centres[b])), adj = (b - a === 1) || (a === 0 && b === n - 1);
        if (adj !== (dd < 2 * cv.r)) geomOk = false;
      }
    }
    check('disk covers n = 3..8: no disk contains 0, exactly consecutive disks overlap (no triple overlaps)', geomOk);

    if (Sh) {
      var rows = [], allOk = true;
      [['sqrt', 0, 0], ['cbrt', 0, 0], ['log', 1, 1]].forEach(function (want) {
        for (var n = 3; n <= 8; n++) {
          var ns = nerveSheaf(want[0], n), co = Sh.cohomology(Sh.create(ns.S));
          if (co.h0 / 2 !== want[1] || co.h1 / 2 !== want[2]) allOk = false;
          if (n === 6) rows.push(want[0] + ' ' + co.h0 / 2 + ',' + co.h1 / 2);
        }
      });
      check('nerve of the disk cover: H^0, H^1 = ker, coker(M - 1): sqrt 0,0; cbrt 0,0; log 1,1 (complex dims), for n = 3..8', allOk, rows.join('; '));

      // The one -1 must sit on the overlap whose lens the negative real axis bisects,
      // and on no other, for every n.
      var cutOk = true, cutRows = [];
      for (n = 3; n <= 8; n++) {
        var nsq = nerveSheaf('sqrt', n), cvq = nsq.cover, kc = cvq.cut;
        var midc = scale(add(cvq.centres[kc], cvq.centres[(kc + 1) % n]), 0.5);
        if (!(midc[0] < 0 && Math.abs(midc[1]) < 1e-12)) cutOk = false;
        nsq.scal.forEach(function (s, k) {
          if (abs(sub(s, [k === kc ? -1 : 1, 0])) > 1e-10) cutOk = false;
          if (Math.abs(arg(cvq.centres[k]) - Math.PI) < 1e-9) cutOk = false;
        });
        if (n === 6) cutRows.push(nsq.scal.map(function (s) { return Math.round(s[0]); }).join(','));
      }
      check('principal branches, n = 3..8: every overlap +1 except the one the negative real axis bisects, -1 (no centre on the axis)', cutOk, 'n = 6: ' + cutRows.join(''));

      var inv = true, prodErr = 0;
      for (var trial = 0; trial < 20; trial++) {
        var kind = ['sqrt', 'cbrt', 'log'][trial % 3], nn = 3 + (trial % 6);
        var mm = []; for (var q = 0; q < nn; q++) mm.push(((trial * 7 + q * 5) % 5) - 2);
        var nsm = nerveSheaf(kind, nn, mm), com = Sh.cohomology(Sh.create(nsm.S)), base = Sh.cohomology(Sh.create(nerveSheaf(kind, nn).S));
        if (com.h0 !== base.h0 || com.h1 !== base.h1) inv = false;
        var hol = kind === 'log' ? nsm.scal.reduce(add, [0, 0]) : nsm.scal.reduce(mul, [1, 0]);
        var mono = monodromy(kind), wantHol = kind === 'log' ? mono[0][1] : mono[0][0];
        prodErr = Math.max(prodErr, abs(sub(hol, wantHol)));
      }
      check('changing the branch on any disks leaves H^0, H^1 and the holonomy (product, or sum for log) unchanged, equal to the counterclockwise monodromy', inv && prodErr < 1e-9, 'max holonomy error ' + e3(prodErr));

      // Gluing axiom for the open-star cover of a cellular sheaf is ker delta.
      var eqOk = true;
      var rnd = Sh.mulberry32(29);
      for (trial = 0; trial < 20; trial++) {
        var nv = 4 + (trial % 3), dims = [], es = [];
        for (var v = 0; v < nv; v++) dims.push(1 + Math.floor(rnd() * 2));
        for (v = 0; v < nv; v++) for (var w = v + 1; w < nv; w++) if (rnd() < 0.55) {
          var de = 1 + Math.floor(rnd() * 2), mat = function (r, c) { var M = []; for (var i = 0; i < r; i++) { M.push([]); for (var j = 0; j < c; j++) M[i].push(Math.round(rnd() * 4 - 2)); } return M; };
          es.push({ u: v, v: w, Fu: mat(de, dims[v]), Fv: mat(de, dims[w]) });
        }
        var S = Sh.create({ dims: dims, edges: es }), stars = [];
        for (v = 0; v < nv; v++) stars.push(Sh.openStar(S, [v]));
        var ch = Sh.cech(S, stars), cc = Sh.cohomology(S);
        if (ch.h0 !== cc.h0) eqOk = false;
        ch.pieces.forEach(function (p, i) { if (p.sec.basis.length !== dims[i]) eqOk = false; });
      }
      check('open-star cover of 20 random cellular sheaves: each star carries F(v), and the equalizer (Cech H^0) is ker delta', eqOk);
    }

    // The flat function: every derivative tends to 0 at 0 from the right.
    var d1 = flat(0.02, 6), d2 = flat(0.01, 6), f5 = flat(0.5, 5);
    var fd = (flat(0.5 + 1e-5, 0)[0] - flat(0.5 - 1e-5, 0)[0]) / 2e-5;
    check('exp(-1/x): derivatives 0..6 shrink toward 0 as x -> 0+, and the recursion matches a finite difference', Math.max.apply(null, d2.map(Math.abs)) < Math.max.apply(null, d1.map(Math.abs)) && Math.max.apply(null, d2.map(Math.abs)) < 1e-15 && Math.abs(fd - f5[1]) < 1e-8,
      'max at 0.02: ' + e3(Math.max.apply(null, d1.map(Math.abs))) + ', at 0.01: ' + e3(Math.max.apply(null, d2.map(Math.abs))));
    return out;
  }

  var api = { N: N, KINDS: KINDS, add: add, sub: sub, mul: mul, div: div, abs: abs, arg: arg, polar: polar, cexp: cexp, clog: clog,
    principalValue: principalValue, germ: germ, principal: principal, evaluate: evaluate, reexpand: reexpand, step: step,
    moveTo: moveTo, sheet: sheet, monodromy: monodromy, cover: cover, realify: realify, branch: branch, nerveSheaf: nerveSheaf,
    flat: flat, runChecks: runChecks };
  global.Germs = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
