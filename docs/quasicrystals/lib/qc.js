// qc.js: the constructions behind every figure in the quasicrystals series.
// Pure math, no DOM. Exposes a global QC in the browser and module.exports in
// node, so the same code the figures draw from can be checked from a script.
//
//   fibonacci   cut-and-project from Z^2 (strip model), window and offset
//   pentagrid   de Bruijn's five grids -> Penrose rhomb tiling, with each
//               vertex's integer 5-vector K, its internal image and index
//   windows     the four pentagons of internal space (projected hypersimplices)
//   robinson    Penrose rhombs by Robinson-triangle substitution, with exact
//               integer coordinates recovered from the edges
//   diffraction direct Fourier sums over a finite point set

(function (root) {
  'use strict';

  var PHI = (1 + Math.sqrt(5)) / 2;
  var TAU = 2 * Math.PI;

  // ---------------------------------------------------------------- Fibonacci
  // Lattice point (a, b) in Z^2. The physical line has direction (1, s)/n and
  // the internal direction is (-s, 1)/n. For s = 1/phi, scaling both by n*phi
  // gives phys = a*phi + b and int = b - a/phi, the Galois conjugate.
  function stripBasis(s) {
    var n = Math.hypot(1, s);
    return { par: [1 / n, s / n], perp: [-s / n, 1 / n] };
  }

  // Width of the unit square's shadow on the internal axis: the canonical window.
  function canonicalWidth(s) {
    var b = stripBasis(s);
    var vals = [0, b.perp[0], b.perp[1], b.perp[0] + b.perp[1]];
    return Math.max.apply(null, vals) - Math.min.apply(null, vals);
  }
  // Lower edge of the canonical window (window is [lo, lo + width)).
  function canonicalLow(s) {
    var b = stripBasis(s);
    return Math.min(0, b.perp[0], b.perp[1], b.perp[0] + b.perp[1]);
  }

  // Enumerate lattice points of a box and test the window [lo+off, lo+off+w).
  function stripModelSet(opts) {
    var s = opts.slope, w = opts.width, off = opts.offset || 0, lim = opts.limit || 10;
    var lo = (opts.low != null ? opts.low : canonicalLow(s) + (canonicalWidth(s) - w) / 2) + off;
    var b = stripBasis(s);
    var pts = [];
    for (var a = -lim; a <= lim; a++) {
      for (var c = -lim; c <= lim; c++) {
        var par = a * b.par[0] + c * b.par[1];
        var perp = a * b.perp[0] + c * b.perp[1];
        // half-open window [lo, hi), with a small tolerance so that rational slopes, whose
        // lattice points sit exactly on both edges, are not split by rounding
        pts.push({ a: a, b: c, par: par, perp: perp, inside: perp >= lo - 1e-9 && perp < lo + w - 1e-9 });
      }
    }
    return { points: pts, lo: lo, hi: lo + w, basis: b };
  }

  // The golden chain in algebraic form: x = a*phi + b with conjugate
  // x* = b - a/phi in [lo, lo + phi). Returns points sorted by x within |x|<=X.
  function fibonacciChain(X, offset, lo) {
    lo = (lo == null ? -1 / PHI : lo) + (offset || 0);
    var hi = lo + PHI;
    var out = [];
    var A = Math.ceil(X / PHI) + 3;
    for (var a = -A; a <= A; a++) {
      // x* = b - a/phi in [lo, hi)  =>  b in [lo + a/phi, hi + a/phi)
      var bmin = Math.ceil(lo + a / PHI - 1e-12), bmax = Math.ceil(hi + a / PHI - 1e-12) - 1;
      for (var b = bmin; b <= bmax; b++) {
        var x = a * PHI + b;
        if (Math.abs(x) <= X) out.push({ a: a, b: b, x: x, xs: b - a / PHI });
      }
    }
    out.sort(function (p, q) { return p.x - q.x; });
    return out;
  }

  function chainWord(chain) {
    var w = '';
    for (var i = 1; i < chain.length; i++) w += (chain[i].x - chain[i - 1].x) > 1.3 ? 'L' : 'S';
    return w;
  }

  // Fibonacci substitution L -> LS, S -> L, n times from 'L'.
  function substitute(word, n) {
    for (var i = 0; i < n; i++) {
      var out = '';
      for (var j = 0; j < word.length; j++) out += word[j] === 'L' ? 'LS' : 'L';
      word = out;
    }
    return word;
  }

  // ---------------------------------------------------------------- Pentagrid
  var E = [], EI = [];
  for (var j = 0; j < 5; j++) {
    E.push([Math.cos(TAU * j / 5), Math.sin(TAU * j / 5)]);
    EI.push([Math.cos(2 * TAU * j / 5), Math.sin(2 * TAU * j / 5)]); // internal star
  }

  function phys(K) {
    var x = 0, y = 0;
    for (var j = 0; j < 5; j++) { x += K[j] * E[j][0]; y += K[j] * E[j][1]; }
    return [x, y];
  }
  function internal(K) {
    var x = 0, y = 0;
    for (var j = 0; j < 5; j++) { x += K[j] * EI[j][0]; y += K[j] * EI[j][1]; }
    return [x, y];
  }

  // A shift gamma with sum zero whose internal image is (u, v) and whose
  // physical image is zero, added to a base shift.
  function gammaFor(base, u, v) {
    var g = [];
    for (var j = 0; j < 5; j++) g.push(base[j] + 0.4 * (u * EI[j][0] + v * EI[j][1]));
    return g;
  }

  // de Bruijn: every crossing of a line from grid r with a line from grid s
  // becomes a rhomb. Lines of grid j: x . e_j + gamma_j = k (integer k).
  function pentagrid(gamma, R) {
    var M = Math.ceil(R + 2);
    var tiles = [];
    for (var r = 0; r < 5; r++) {
      for (var s = r + 1; s < 5; s++) {
        var a1 = E[r][0], b1 = E[r][1], a2 = E[s][0], b2 = E[s][1];
        var det = a1 * b2 - a2 * b1;
        for (var kr = -M; kr <= M; kr++) {
          for (var ks = -M; ks <= M; ks++) {
            var c1 = kr - gamma[r], c2 = ks - gamma[s];
            var x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det;
            if (x * x + y * y > R * R) continue;
            var K = [];
            for (var jj = 0; jj < 5; jj++) {
              K.push(jj === r ? kr : jj === s ? ks : Math.ceil(x * E[jj][0] + y * E[jj][1] + gamma[jj]));
            }
            var corners = [[0, 0], [1, 0], [1, 1], [0, 1]].map(function (d) {
              var Kc = K.slice(); Kc[r] += d[0]; Kc[s] += d[1]; return Kc;
            });
            var d = s - r;
            tiles.push({
              r: r, s: s, kr: kr, ks: ks, cross: [x, y],
              thick: d === 1 || d === 4,
              K: corners,
              pts: corners.map(phys),
              key: corners.map(function (c) { return c.join(','); }).sort().join('|')
            });
          }
        }
      }
    }
    return tiles;
  }

  // Unique vertices of a set of tiles, each with K, position, internal image, index.
  function vertices(tiles) {
    var seen = {}, out = [];
    tiles.forEach(function (t) {
      t.K.forEach(function (K, i) {
        var k = K.join(',');
        if (seen[k]) return;
        seen[k] = 1;
        out.push({ K: K, p: t.pts[i], q: internal(K), index: K[0] + K[1] + K[2] + K[3] + K[4] });
      });
    });
    return out;
  }

  // Window for index k in {1,2,3,4}: convex hull of the internal images of the
  // 0/1 vectors with k ones (a slice of the projected unit 5-cube), shifted by
  // the internal image of gamma.
  function windowPolygon(k, gamma) {
    var pts = [];
    for (var m = 0; m < 32; m++) {
      var bits = [], c = 0;
      for (var j = 0; j < 5; j++) { var bit = (m >> j) & 1; bits.push(bit); c += bit; }
      if (c === k) pts.push(internal(bits));
    }
    var g = internal(gamma);
    return hull(pts).map(function (p) { return [p[0] + g[0], p[1] + g[1]]; });
  }

  function hull(points) {
    var p = points.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lower = [], upper = [];
    p.forEach(function (q) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 1e-12) lower.pop();
      lower.push(q);
    });
    for (var i = p.length - 1; i >= 0; i--) {
      var q = p[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 1e-12) upper.pop();
      upper.push(q);
    }
    upper.pop(); lower.pop();
    return lower.concat(upper);
  }

  function pointInPolygon(pt, poly, eps) {
    eps = eps || 1e-9;
    // convex, counter-clockwise
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length];
      if ((b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0]) < -eps) return false;
    }
    return true;
  }

  // ------------------------------------------------------ Robinson substitution
  // Half-rhomb triangles [type, A, B, C] as complex numbers [re, im].
  // type 0 = half of a thin rhomb, type 1 = half of a thick rhomb. The rule is
  // the standard one for the rhomb tiling (edge length shrinks by phi per step).
  function cadd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function csub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function cscale(a, t) { return [a[0] * t, a[1] * t]; }

  function robinsonSeed() {
    var tris = [];
    for (var i = 0; i < 10; i++) {
      // spokes at multiples of 36 degrees, so every edge is one of +-e_j
      var B = [Math.cos((i - 1) * Math.PI / 5), Math.sin((i - 1) * Math.PI / 5)];
      var C = [Math.cos(i * Math.PI / 5), Math.sin(i * Math.PI / 5)];
      if (i % 2 === 0) { var t = B; B = C; C = t; }
      tris.push([0, [0, 0], B, C]);
    }
    return tris;
  }

  function robinsonStep(tris) {
    var out = [];
    tris.forEach(function (t) {
      var A = t[1], B = t[2], C = t[3];
      if (t[0] === 0) {
        var P = cadd(A, cscale(csub(B, A), 1 / PHI));
        out.push([0, C, P, B], [1, P, C, A]);
      } else {
        var Q = cadd(B, cscale(csub(A, B), 1 / PHI));
        var Rr = cadd(B, cscale(csub(C, B), 1 / PHI));
        out.push([1, Rr, C, A], [1, Q, Rr, B], [0, Rr, Q, A]);
      }
    });
    return out;
  }

  function robinson(n) {
    var t = robinsonSeed();
    for (var i = 0; i < n; i++) t = robinsonStep(t);
    return t;
  }

  // Recover integer 5-vectors for every vertex by walking unit edges from the
  // center. After n steps the edge length is phi^-n; rescale so edges are 1.
  // Every tile edge is one of the ten unit vectors +-e_j, so each vertex is
  // sum K_j e_j with integer K (defined up to adding (1,1,1,1,1)).
  function robinsonVertices(tris, n) {
    var scale = Math.pow(PHI, n);
    var key = function (p) { return Math.round(p[0] * scale * 1e4) + ',' + Math.round(p[1] * scale * 1e4); };
    var nodes = {}, adj = {};
    function node(p) {
      var k = key(p);
      if (!nodes[k]) { nodes[k] = { p: [p[0] * scale, p[1] * scale] }; adj[k] = []; }
      return k;
    }
    tris.forEach(function (t) {
      var ks = [node(t[1]), node(t[2]), node(t[3])];
      for (var i = 0; i < 3; i++) {
        var u = ks[i], v = ks[(i + 1) % 3];
        var d = csub(nodes[v].p, nodes[u].p);
        if (Math.abs(Math.hypot(d[0], d[1]) - 1) < 1e-6) { adj[u].push(v); adj[v].push(u); }
      }
    });
    var start = key([0, 0]);
    if (!nodes[start]) return [];
    nodes[start].K = [0, 0, 0, 0, 0];
    var queue = [start], bad = 0;
    while (queue.length) {
      var u = queue.shift();
      adj[u].forEach(function (v) {
        if (nodes[v].K) return;
        var d = csub(nodes[v].p, nodes[u].p);
        var ang = Math.atan2(d[1], d[0]);
        var idx = Math.round(ang / (Math.PI / 5));    // multiple of 36 degrees
        idx = ((idx % 10) + 10) % 10;
        var K = nodes[u].K.slice();
        if (idx % 2 === 0) K[idx / 2] += 1;           // +e_j at angle 72j
        else K[((idx + 5) % 10) / 2] -= 1;             // -e_j at angle 72j + 180
        nodes[v].K = K;
        var p = phys(K);
        if (Math.hypot(p[0] - nodes[v].p[0], p[1] - nodes[v].p[1]) > 1e-6) bad++;
        queue.push(v);
      });
    }
    var out = [];
    Object.keys(nodes).forEach(function (k) {
      var nd = nodes[k];
      if (!nd.K) return;
      out.push({ K: nd.K, p: nd.p, q: internal(nd.K), index: nd.K.reduce(function (s, x) { return s + x; }, 0) });
    });
    out.bad = bad;
    return out;
  }

  // ------------------------------------------------------------- Diffraction
  // Normalized intensity |sum_x w_x exp(-2 pi i k x)|^2 / (sum w)^2 on a 1D grid.
  function diffraction1D(xs, ks, weights) {
    var out = new Float64Array(ks.length), W = 0;
    for (var i = 0; i < xs.length; i++) W += weights ? weights[i] : 1;
    for (var m = 0; m < ks.length; m++) {
      var re = 0, im = 0, k = ks[m];
      for (var n = 0; n < xs.length; n++) {
        var w = weights ? weights[n] : 1, a = TAU * k * xs[n];
        re += w * Math.cos(a); im -= w * Math.sin(a);
      }
      out[m] = (re * re + im * im) / (W * W);
    }
    return out;
  }

  // One row (fixed ky) of a 2D diffraction image over kx = k0 + i*dk, using a
  // per-point phase recurrence instead of trig in the inner loop.
  function diffractionRow(pts, weights, ky, k0, dk, n, out, offset) {
    var re = new Float64Array(n), im = new Float64Array(n);
    for (var p = 0; p < pts.length; p++) {
      var x = pts[p][0], y = pts[p][1], w = weights[p];
      var a0 = -TAU * (k0 * x + ky * y), da = -TAU * dk * x;
      var cr = w * Math.cos(a0), ci = w * Math.sin(a0);
      var sr = Math.cos(da), si = Math.sin(da);
      for (var i = 0; i < n; i++) {
        re[i] += cr; im[i] += ci;
        var t = cr * sr - ci * si; ci = cr * si + ci * sr; cr = t;
      }
    }
    for (var i2 = 0; i2 < n; i2++) out[offset + i2] = re[i2] * re[i2] + im[i2] * im[i2];
  }

  var QC = {
    PHI: PHI, E: E, EI: EI,
    stripBasis: stripBasis, canonicalWidth: canonicalWidth, canonicalLow: canonicalLow,
    stripModelSet: stripModelSet, fibonacciChain: fibonacciChain, chainWord: chainWord,
    substitute: substitute,
    phys: phys, internal: internal, gammaFor: gammaFor, pentagrid: pentagrid,
    vertices: vertices, windowPolygon: windowPolygon, hull: hull, pointInPolygon: pointInPolygon,
    robinson: robinson, robinsonStep: robinsonStep, robinsonSeed: robinsonSeed,
    robinsonVertices: robinsonVertices,
    diffraction1D: diffraction1D, diffractionRow: diffractionRow
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = QC;
  else root.QC = QC;
})(typeof window !== 'undefined' ? window : this);
