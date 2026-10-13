// 01-honeycomb.js: the arithmetic behind "The Honeycomb".
// No dependencies of its own. The foam functions drive the two-dimensional film model
// in 07-coarsen.js (window.FoamCoarsen in the browser, require in node) with the gas
// frozen and every bubble given the same amount of it, so the films relax at equal
// areas instead of coarsening. Nothing in 07-coarsen.js is changed.
//
// Wall cost throughout: half a cell's perimeter over the square root of its area, so a
// wall shared by two cells is counted once. The regular hexagon scores 12^(1/4).
//
// Public API (window.FoamHoneycomb):
//   HEX                      12^(1/4) = 1.8612..., the honeycomb's wall cost
//   HALES                    0.0505, the constant in Hales's Theorem 4 (full perimeter per side)
//   polyCost(x)              wall cost of the regular polygon with x sides (x real, > 2)
//   mixCost(counts)          mean of polyCost over a mix {sides: count}, and its mean sides
//   halesFloor(n, T, area)   Hales's lower bound on half the perimeter of one cell
//   pins(b)                  four pins on a unit square joined through a bridge of length |b|
//   pinsMin()                the bridge that minimizes pins(b).length, found numerically
//   equalAreaRandom(F, seed) random froth of 64 bubbles, each handed one unit of gas
//   scrambled(F, k, seed)    8 x 8 honeycomb with k walls swapped at random
//   swapWall(f, ei)          one neighbor swap on film ei, whatever its length
//   relax(f, steps)          steps with the gas frozen; returns true once the film length has settled
//   settle(f)                relax until settled (or 120,000 steps); returns whether it settled
//   census(f)                { cells, nonHex, mu2, cost, sides: {n: count}, maxAreaError }
//   cellTable(f)             [{ n, area, half, T, poly, hales }] for every bubble
//   SURVEY                   wall costs of 96 relaxed foams, written by scripts/foam-01-survey.mjs
//   runChecks()              -> [{name, ok, detail}]
(function (global) {
  'use strict';

  var PI = Math.PI;
  var HEX = Math.pow(12, 0.25);
  var HALES = 0.0505;
  var NX = 8, NY = 8, CELLS = NX * NY;
  var ASPECT = 2 / Math.sqrt(3);      // the 8 x 8 honeycomb's box, width over height
  var SWAP_LENGTH = 0.3;              // length given to the new film of a forced swap (a hexagon's side is 0.62)

  function coarsen() {
    if (global.FoamCoarsen) return global.FoamCoarsen;
    if (typeof require === 'function') return require('./07-coarsen.js');
    return null;
  }

  // ---------------------------------------------------------------- regular polygons
  // Half the perimeter of the regular x-gon of unit area. For whole x this is the least
  // any x-sided polygon of unit area can have; the formula also makes sense in between.
  function polyCost(x) { return Math.sqrt(x * Math.tan(PI / x)); }

  function mixCost(counts) {
    var cells = 0, sides = 0, cost = 0;
    Object.keys(counts).forEach(function (n) {
      var c = counts[n]; cells += c; sides += c * n; cost += c * polyCost(+n);
    });
    return { cells: cells, meanSides: sides / cells, floor: cost / cells };
  }

  // Hales 2001, Theorem 4, halved to this page's convention. A cell with n corners,
  // area `area` (capped at 1) and perimeter L satisfies
  //   L >= -T 12^(1/4) - (n - 6) 0.0505 + 2 min(1, area) 12^(1/4),
  // where T adds up, over the cell's walls, the area between the wall and the straight
  // chord joining its ends (positive where the wall bulges outward), each term clipped
  // to [-1/2, 1/2].
  function halesFloor(n, T, area) {
    var alpha = Math.min(1, area === undefined ? 1 : area);
    return 0.5 * (-T * HEX - (n - 6) * HALES + 2 * alpha * HEX);
  }

  // ---------------------------------------------------------------- four pins
  // Pins at the corners of a unit square. Two junctions sit on the midline, a distance
  // |b| apart, each joined to the two pins on its side; b > 0 puts the bridge
  // horizontal, b < 0 vertical, b = 0 is the X.
  function pins(b) {
    var a = Math.abs(b), arm = Math.sqrt((1 - a) * (1 - a) + 1) / 2;
    return {
      bridge: a, arm: arm, length: a + 4 * arm,
      // angle between the two arms at a junction, in degrees
      fork: a >= 1 ? 180 : 2 * Math.atan(1 / (1 - a)) * 180 / PI,
      horizontal: b >= 0
    };
  }
  function pinsMin() { // golden-section search on [0, 1]
    var g = (Math.sqrt(5) - 1) / 2, lo = 0, hi = 1;
    for (var i = 0; i < 80; i++) {
      var x1 = hi - g * (hi - lo), x2 = lo + g * (hi - lo);
      if (pins(x1).length < pins(x2).length) hi = x2; else lo = x1;
    }
    var b = 0.5 * (lo + hi);
    return { bridge: b, length: pins(b).length, fork: pins(b).fork };
  }

  // ---------------------------------------------------------------- equal-area foams
  function equalAreaRandom(F, seed) {
    var f = F.random({ n: CELLS, seed: seed, aspect: ASPECT });
    f.C.forEach(function (c) { c.gas = 1; });
    f._L = Infinity; f._since = 0;
    return f;
  }

  // The simulator only swaps a film that has shrunk to nothing. This forces one on any
  // film: straighten it, then let the simulator's own swap replace it by a film of
  // length SWAP_LENGTH at right angles through its midpoint.
  function swapWall(f, ei) {
    var e = f.E[ei];
    if (!e || !e.alive || e.fixed) return false;
    if (f.C[e.cl].n < 5 || f.C[e.cr].n < 5) return false; // never make a triangle by hand
    var sx = e.x, sy = e.y;
    e.x = []; e.y = [];
    f.t1Length = SWAP_LENGTH; f.t1Undo = 0;
    var ok = f.t1Flip(ei);
    if (!ok) { e.x = sx; e.y = sy; }
    return ok;
  }

  function scrambled(F, k, seed) {
    var f = F.honeycomb(NX, NY), rand = F.mulberry32(7919 * k + seed), done = 0, guard = 0;
    while (done < k && guard++ < 50 * (k + 1)) {
      if (swapWall(f, Math.floor(rand() * f.E.length))) done++;
    }
    f.geom();
    f.t1 = 0; f.undone = 0; f.events = [];
    f.swapped = done; f._L = Infinity; f._since = 0;
    return f;
  }

  // Advance with the gas frozen. Settled means the total film length moved by less
  // than 1e-7 per bubble over the last 400 steps.
  var WINDOW = 400, TOL = 1e-7;
  function relax(f, steps) {
    for (var i = 0; i < steps; i++) {
      f.step(false);
      if (++f._since >= WINDOW) {
        f._since = 0;
        var L = f.totalLength, was = f._L;
        f._L = L;
        if (Math.abs(L - was) < TOL * f.bubbles) { f.geom(); return true; }
      }
    }
    f.geom();
    return false;
  }
  function settle(f, maxSteps) {
    var n = 0, cap = maxSteps || 120000;
    while (n < cap) { n += 2000; if (relax(f, 2000)) return true; }
    return false;
  }

  function census(f) {
    var sides = {}, cells = 0, nonHex = 0, mu2 = 0, err = 0, area = 0;
    f.C.forEach(function (c) {
      if (!c.alive) return;
      cells++; sides[c.n] = (sides[c.n] || 0) + 1; area += c.A;
      if (c.n !== 6) nonHex++;
      mu2 += (c.n - 6) * (c.n - 6);
    });
    var mean = area / cells;
    f.C.forEach(function (c) { if (c.alive) err = Math.max(err, Math.abs(c.A / mean - 1)); });
    return { cells: cells, nonHex: nonHex, mu2: mu2 / cells, sides: sides, maxAreaError: err,
      cost: f.totalLength / cells / Math.sqrt(mean) };
  }

  // Per bubble: sides, area, half the perimeter, Hales's T, and the two floors.
  // A film runs from junction a to junction b with bubble cl on its left, so the area
  // between the film and its chord, taken counterclockwise, is what cl gains from it.
  function cellTable(f) {
    f.geom();
    var rows = f.C.map(function (c) { return { n: c.n, area: c.A, half: 0, T: 0, alive: c.alive }; });
    f.E.forEach(function (e) {
      if (!e.alive) return;
      var a = f.J[e.a], b = f.J[e.b], m = e.x.length, px = 0, py = 0, qx = a.x, qy = a.y, s = 0;
      for (var k = 0; k <= m; k++) {
        var tx = k < m ? e.x[k] : b.x, ty = k < m ? e.y[k] : b.y;
        var nx = px + f.dX(tx - qx), ny = py + f.dY(ty - qy);
        s += px * ny - nx * py; px = nx; py = ny; qx = tx; qy = ty;
      }
      var x = Math.max(-0.5, Math.min(0.5, 0.5 * s));
      rows[e.cl].half += 0.5 * e.L; rows[e.cl].T += x;
      rows[e.cr].half += 0.5 * e.L; rows[e.cr].T -= x;
    });
    return rows.filter(function (r) { return r.alive; }).map(function (r) {
      return { n: r.n, area: r.area, half: r.half, T: r.T,
        poly: polyCost(r.n) * Math.sqrt(r.area), hales: halesFloor(r.n, r.T, r.area) };
    });
  }

  // ---------------------------------------------------------------- survey
  // Written by scripts/foam-01-survey.mjs: every foam relaxed until settle() returns.
  // Rows are [walls swapped (0 = random start), seed, cells left that are not hexagons, wall cost].
  /* SURVEY-BEGIN */
  var SURVEY = [
    [8,1,0,1.86121],
    [8,2,0,1.86121],
    [8,3,0,1.86121],
    [8,4,0,1.86121],
    [8,5,0,1.86121],
    [8,6,0,1.86121],
    [8,7,0,1.86121],
    [16,1,4,1.86722],
    [16,2,0,1.86121],
    [16,3,4,1.86722],
    [16,4,0,1.86121],
    [16,5,10,1.87264],
    [16,6,0,1.86121],
    [16,7,4,1.86722],
    [24,1,0,1.86121],
    [24,2,0,1.86121],
    [24,3,4,1.86478],
    [24,4,8,1.86897],
    [24,5,8,1.87358],
    [24,6,4,1.86478],
    [24,7,10,1.87219],
    [32,1,8,1.86793],
    [32,2,0,1.86121],
    [32,3,12,1.87486],
    [32,4,4,1.86478],
    [32,5,0,1.86121],
    [32,6,4,1.86478],
    [32,7,6,1.86714],
    [48,1,26,1.88828],
    [48,2,20,1.8911],
    [48,3,25,1.88735],
    [48,4,16,1.88634],
    [48,5,22,1.89222],
    [48,6,8,1.87081],
    [48,7,26,1.89334],
    [64,1,29,1.916],
    [64,2,27,1.89422],
    [64,3,25,1.89327],
    [64,4,19,1.88209],
    [64,5,18,1.88807],
    [64,6,30,1.90023],
    [64,7,21,1.89479],
    [96,1,35,1.91796],
    [96,2,31,1.90686],
    [96,3,31,1.93822],
    [96,4,34,1.91895],
    [96,5,34,1.92828],
    [96,6,24,1.89967],
    [96,7,32,1.91869],
    [128,1,39,1.92769],
    [128,2,27,1.91004],
    [128,3,36,1.90259],
    [128,4,33,1.92276],
    [128,5,35,1.92646],
    [128,6,31,1.90543],
    [128,7,24,1.90217],
    [0,1,39,1.93417],
    [0,2,35,1.91081],
    [0,3,31,1.90096],
    [0,4,40,1.9195],
    [0,5,32,1.90884],
    [0,6,33,1.9114],
    [0,7,37,1.92661],
    [0,8,37,1.91993],
    [0,9,30,1.91433],
    [0,10,33,1.90879],
    [0,11,30,1.91259],
    [0,12,31,1.91314],
    [0,13,42,1.91411],
    [0,14,36,1.91508],
    [0,15,31,1.90702],
    [0,16,38,1.91992],
    [0,17,29,1.91285],
    [0,18,33,1.91926],
    [0,19,37,1.91066],
    [0,20,39,1.91826],
    [0,21,28,1.90225],
    [0,22,37,1.91084],
    [0,23,33,1.9189],
    [0,24,39,1.92274],
    [0,25,36,1.92591],
    [0,26,35,1.91374],
    [0,27,35,1.91993],
    [0,28,36,1.91526],
    [0,29,43,1.94692],
    [0,30,34,1.91989],
    [0,31,34,1.91028],
    [0,32,33,1.91016],
    [0,33,25,1.91256],
    [0,34,35,1.90876],
    [0,35,35,1.91451],
    [0,36,32,1.90999],
    [0,37,25,1.90377],
    [0,38,32,1.90718],
    [0,39,40,1.92259],
    [0,40,32,1.91537]
  ];
  /* SURVEY-END */

  // ---------------------------------------------------------------- checks
  function runChecks() {
    var out = [];
    function ok(name, cond, detail) { out.push({ name: name, ok: !!cond, detail: String(detail) }); }

    ok('regular polygons: hexagon 12^(1/4), square 2, triangle 2.2795',
      Math.abs(polyCost(6) - HEX) < 1e-14 && Math.abs(polyCost(4) - 2) < 1e-14 && Math.abs(polyCost(3) - Math.sqrt(3 * Math.sqrt(3))) < 1e-14,
      [3, 4, 5, 6, 7, 8].map(function (n) { return n + ': ' + polyCost(n).toFixed(4); }).join(', '));

    var m = pinsMin(), exact = 1 - 1 / Math.sqrt(3);
    ok('four pins: least film at bridge 1 - 1/sqrt(3), length 1 + sqrt(3), forks at 120 degrees; the X is 2 sqrt(2)',
      Math.abs(m.bridge - exact) < 1e-6 && Math.abs(m.length - (1 + Math.sqrt(3))) < 1e-12 && Math.abs(m.fork - 120) < 1e-4 &&
      Math.abs(pins(0).length - 2 * Math.SQRT2) < 1e-14 && Math.abs(pins(-m.bridge).length - m.length) < 1e-14,
      'bridge ' + m.bridge.toFixed(5) + ', length ' + m.length.toFixed(5) + ', fork ' + m.fork.toFixed(3) + ', X ' + pins(0).length.toFixed(5) +
      ', saving ' + (100 * (1 - m.length / pins(0).length)).toFixed(2) + '%');

    // convexity of polyCost, and the bound it gives for mixes that average six sides
    var minBend = Infinity, x;
    for (x = 2.5; x < 60; x += 0.01) minBend = Math.min(minBend, polyCost(x + 0.01) - 2 * polyCost(x) + polyCost(x - 0.01));
    var worstMix = Infinity, mixes = 0;
    (function rec(n, left, sides, counts) { // every mix of 12 cells with 3 to 12 sides averaging six
      if (n > 12) { if (left === 0 && sides === 72) { mixes++; var c = mixCost(counts).floor; if (c - HEX < worstMix && counts[6] !== 12) worstMix = c - HEX; } return; }
      for (var c = 0; c <= left; c++) { if (sides + c * n > 72) break; counts[n] = c; rec(n + 1, left - c, sides + c * n, counts); }
      counts[n] = 0;
    })(3, 12, 0, {});
    ok('polygon cost bends upward everywhere, so every mix of 12 cells averaging six sides costs more than 12 hexagons',
      minBend > 0 && worstMix > 0, mixes + ' mixes; the cheapest that is not all hexagons is ' + worstMix.toFixed(5) + ' above (one 5 and one 7: ' +
      (mixCost({ 5: 1, 6: 10, 7: 1 }).floor - HEX).toFixed(5) + ')');

    var clear = Infinity, at = 0;
    for (var n = 3; n <= 200; n++) { var c = polyCost(n) - halesFloor(n, 0, 1); if (n !== 6 && c < clear) { clear = c; at = n; } }
    ok("Hales's line through the hexagon stays under every other regular polygon", clear > 0 && at === 7 && Math.abs(halesFloor(6, 0, 1) - HEX) < 1e-14,
      'closest at ' + at + ' sides, clear by ' + clear.toFixed(6) + '; slope ' + (HALES / 2) + ' per side against hexagon-to-heptagon drop ' + (polyCost(6) - polyCost(7)).toFixed(6));

    var F = coarsen();
    if (!F) { ok('film model available', false, '07-coarsen.js not loaded'); return out; }

    // symmetric bubbles: curved walls beat the polygon for fewer than six sides, and Hales's floor still holds
    var bub = [3, 4, 5, 6, 7, 8, 9].map(function (n) {
      var b = F.bubble(n), polyArea = 0.5 * n * b.rho * b.rho * Math.sin(2 * PI / n);
      return { n: n, half: n * b.arcLength / 2, slack: n * b.arcLength / 2 - halesFloor(n, 1 - polyArea, 1) };
    });
    ok('symmetric bubbles with 120 degree corners: 3 to 5 sides cost less than the regular polygon, 7 sides less than the hexagon, a 5 and a 7 together more than two hexagons, none less than Hales allows',
      bub.every(function (b) { return b.slack > -1e-12 && (b.n >= 6 || b.half < polyCost(b.n)); }) &&
      bub[2].half > HEX && bub[4].half < HEX && bub[2].half + bub[4].half > 2 * HEX,
      bub.map(function (b) { return b.n + ': ' + b.half.toFixed(4) + ' (polygon ' + polyCost(b.n).toFixed(4) + ', slack ' + b.slack.toFixed(4) + ')'; }).join('; '));

    // one swap in a honeycomb heals
    var f = scrambled(F, 1, 1), before = census(f);
    var done = settle(f), s = census(f);
    ok('honeycomb with one wall swapped: two 5s and two 7s, which relax back to 64 hexagons',
      done && before.nonHex === 4 && before.sides[5] === 2 && before.sides[7] === 2 && s.nonHex === 0 && Math.abs(s.cost - HEX) < 1e-6 && f.t2 === 0,
      'before ' + JSON.stringify(before.sides) + ', after ' + JSON.stringify(s.sides) + ', cost ' + s.cost.toFixed(6) + ', swaps undone ' + f.undone);

    // a scrambled honeycomb and a random start: equal areas, mean six, above the honeycomb, every cell above Hales's floor
    [['32 walls swapped, seed 1', scrambled(F, 32, 1), 32, 1], ['random start, seed 1', equalAreaRandom(F, 1), 0, 1]].forEach(function (job) {
      var g = job[1], d = settle(g), cs = census(g), rows = cellTable(g), worst = Infinity, under = 0, few = 0, sumT = 0, slack = 0, sides = 0;
      rows.forEach(function (r) {
        worst = Math.min(worst, r.half - r.hales); slack += r.half - r.hales; sumT += r.T; sides += r.n;
        if (r.n < 6) { few++; if (r.half < r.poly) under++; }
      });
      var row = null; SURVEY.forEach(function (q) { if (q[0] === job[2] && q[1] === job[3]) row = q; });
      ok(job[0] + ': settles with 64 equal cells averaging six sides, costs more than the honeycomb, and matches the embedded survey row',
        d && cs.cells === CELLS && g.t2 === 0 && cs.maxAreaError < 1e-4 && sides === 6 * CELLS && cs.cost > HEX + 1e-4 &&
        (!SURVEY.length || (row && row[2] === cs.nonHex && Math.abs(row[3] - cs.cost) < 2e-5)),
        'cost ' + cs.cost.toFixed(5) + ', ' + cs.nonHex + ' not hexagons, worst area error ' + cs.maxAreaError.toExponential(1) + (row ? ', survey row ' + JSON.stringify(row) : ', no survey row'));
      ok(job[0] + ": every cell is above Hales's floor, the slack averages the foam's excess over the honeycomb, and cells with under six sides dip below the polygon floor",
        worst > 0 && Math.abs(sumT) < 1e-9 && Math.abs(slack / CELLS - (cs.cost - HEX)) < 1e-6 && under > 0,
        'least slack ' + worst.toFixed(5) + ', mean slack ' + (slack / CELLS).toFixed(5) + ', sum of T ' + sumT.toExponential(1) + ', ' + under + ' of ' + few + ' cells with under six sides beat their regular polygon');
    });

    if (SURVEY.length) {
      var lo = Infinity; SURVEY.forEach(function (q) { if (q[2] > 0) lo = Math.min(lo, q[3]); });
      ok('survey: no foam is below the honeycomb, and every one that kept a defect is above it',
        SURVEY.every(function (q) { return q[3] > HEX - 1e-6 && (q[2] > 0 || Math.abs(q[3] - HEX) < 1e-5); }) && lo > HEX + 1e-4,
        SURVEY.length + ' foams; cheapest with a defect ' + lo.toFixed(5));
    }
    return out;
  }

  var api = {
    HEX: HEX, HALES: HALES, CELLS: CELLS, SWAP_LENGTH: SWAP_LENGTH,
    polyCost: polyCost, mixCost: mixCost, halesFloor: halesFloor, pins: pins, pinsMin: pinsMin,
    equalAreaRandom: equalAreaRandom, scrambled: scrambled, swapWall: swapWall, relax: relax, settle: settle,
    census: census, cellTable: cellTable, SURVEY: SURVEY, runChecks: runChecks
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamHoneycomb = api;
})(typeof window !== 'undefined' ? window : globalThis);
