// noether-math.js — shared math primitives for the Noether series.
//
// Attaches a single `NOETHER` object to the global scope. No modules, no build
// step. Organized by mathematical role: numerical helpers, 2×2 matrices, groups,
// group actions, invariants, binary forms, and Lagrangian mechanics primitives.
//
// Canonical conventions:
//   - Group elements are named records carrying either a 2×2 matrix (D₄, SL₂)
//     or a permutation array (S₃, S₄).
//   - Each group has an `act(g, x)` method so callers don't have to know how
//     the element is represented internally.
//   - Binary forms are stored as `{ degree, coeffs, eval(x, y) }`. Transforms
//     return a new form; they do not mutate.
//   - Lagrangians are closures `L(q, qdot, t) → number`, with `q` either a
//     scalar or a small array.
//   - Floating-point equality uses a tolerance (default 1e-8 for structural
//     checks, 1e-6 for sampled invariance checks).
//
// Each new explainer may extend sections of this file, but shared functionality
// should only live here once it is used by at least two explainers.

(function (global) {
  'use strict';

  // ───────────────────────────────────────────── numerical helpers ─────

  var EPS = 1e-8;

  function approxEq(a, b, tol) {
    tol = tol == null ? EPS : tol;
    return Math.abs(a - b) <= tol;
  }

  function vecApproxEq(a, b, tol) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!approxEq(a[i], b[i], tol)) return false;
    }
    return true;
  }

  function clone(x) {
    if (Array.isArray(x)) return x.slice();
    return x;
  }

  // ───────────────────────────────────────────── 2×2 matrices ─────

  function mat2(a, b, c, d) {
    return [[a, b], [c, d]];
  }

  function mat2apply(M, v) {
    return [
      M[0][0] * v[0] + M[0][1] * v[1],
      M[1][0] * v[0] + M[1][1] * v[1]
    ];
  }

  function mat2mul(M, N) {
    return [
      [
        M[0][0] * N[0][0] + M[0][1] * N[1][0],
        M[0][0] * N[0][1] + M[0][1] * N[1][1]
      ],
      [
        M[1][0] * N[0][0] + M[1][1] * N[1][0],
        M[1][0] * N[0][1] + M[1][1] * N[1][1]
      ]
    ];
  }

  function mat2det(M) {
    return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  }

  function rot2(theta) {
    var c = Math.cos(theta), s = Math.sin(theta);
    return mat2(c, -s, s, c);
  }

  // ───────────────────────────────────────────── groups ─────

  // D₄: dihedral group of order 8, symmetries of the square.
  // Generators: r (90° CCW rotation), s (reflection across the x-axis).
  // All elements are written as powers of r composed with s.
  // Vertex labeling convention: corner 0 = (1, 1), numbered CCW.
  var D4 = {
    name: 'D\u2084',
    order: 8,
    elements: [
      { name: 'e',     mat: mat2( 1,  0,  0,  1), label: 'identity' },
      { name: 'r',     mat: mat2( 0, -1,  1,  0), label: '90\u00B0 rotation' },
      { name: 'r\u00B2', mat: mat2(-1,  0,  0, -1), label: '180\u00B0 rotation' },
      { name: 'r\u00B3', mat: mat2( 0,  1, -1,  0), label: '270\u00B0 rotation' },
      { name: 's',     mat: mat2( 1,  0,  0, -1), label: 'flip across x-axis' },
      { name: 'rs',    mat: mat2( 0,  1,  1,  0), label: 'flip across y = x' },
      { name: 'r\u00B2s', mat: mat2(-1,  0,  0,  1), label: 'flip across y-axis' },
      { name: 'r\u00B3s', mat: mat2( 0, -1, -1,  0), label: 'flip across y = \u2212x' }
    ],
    act: function (g, p) { return mat2apply(g.mat, p); }
  };

  // S₃: symmetric group on 3 elements, 6 permutations.
  // A permutation is stored as `perm[i] = j`, meaning "position i goes to j".
  // The action on a length-3 array x is `(g · x)[perm[i]] = x[i]`.
  var S3 = {
    name: 'S\u2083',
    order: 6,
    elements: [
      { name: 'e',     perm: [0, 1, 2], label: 'identity' },
      { name: '(12)',  perm: [1, 0, 2], label: 'swap slots 1 and 2' },
      { name: '(13)',  perm: [2, 1, 0], label: 'swap slots 1 and 3' },
      { name: '(23)',  perm: [0, 2, 1], label: 'swap slots 2 and 3' },
      { name: '(123)', perm: [1, 2, 0], label: 'cyclic 1\u21922\u21923\u21921' },
      { name: '(132)', perm: [2, 0, 1], label: 'cyclic 1\u21923\u21922\u21921' }
    ],
    act: function (g, x) {
      var out = [0, 0, 0];
      for (var i = 0; i < 3; i++) out[g.perm[i]] = x[i];
      return out;
    }
  };

  // Apply a symmetry to a labelled copy of something (used when the object
  // is just a decorated record and the group acts by relabelling).
  function permuteLabels(g, labels) {
    var out = labels.slice();
    for (var i = 0; i < labels.length; i++) out[g.perm[i]] = labels[i];
    return out;
  }

  // ───────────────────────────────────────────── group actions ─────

  function orbit(x, group, eqFn) {
    eqFn = eqFn || vecApproxEq;
    var result = [];
    for (var i = 0; i < group.elements.length; i++) {
      var gx = group.act(group.elements[i], x);
      var seen = false;
      for (var j = 0; j < result.length; j++) {
        if (eqFn(result[j].point, gx)) { seen = true; break; }
      }
      if (!seen) result.push({ point: gx, via: group.elements[i] });
    }
    return result;
  }

  function stabilizer(x, group, eqFn) {
    eqFn = eqFn || vecApproxEq;
    var result = [];
    for (var i = 0; i < group.elements.length; i++) {
      var gx = group.act(group.elements[i], x);
      if (eqFn(gx, x)) result.push(group.elements[i]);
    }
    return result;
  }

  // ───────────────────────────────────────────── invariants ─────

  function checkInvariant(fn, group, samples, tol) {
    tol = tol == null ? 1e-6 : tol;
    for (var s = 0; s < samples.length; s++) {
      var x = samples[s];
      var fx = fn(x);
      for (var i = 0; i < group.elements.length; i++) {
        var gx = group.act(group.elements[i], x);
        var fgx = fn(gx);
        if (Math.abs(fx - fgx) > tol) {
          return {
            invariant: false,
            failAt: { x: x, g: group.elements[i], fx: fx, fgx: fgx }
          };
        }
      }
    }
    return { invariant: true };
  }

  // ───────────────────────────────────────────── binary forms ─────

  // Binary quadratic form f(x, y) = a x\u00B2 + b x y + c y\u00B2.
  function quadraticForm(a, b, c) {
    return {
      degree: 2,
      coeffs: [a, b, c],
      eval: function (x, y) { return a * x * x + b * x * y + c * y * y; }
    };
  }

  // Binary cubic form f(x, y) = a x\u00B3 + b x\u00B2 y + c x y\u00B2 + d y\u00B3.
  function cubicForm(a, b, c, d) {
    return {
      degree: 3,
      coeffs: [a, b, c, d],
      eval: function (x, y) {
        return a * x * x * x + b * x * x * y + c * x * y * y + d * y * y * y;
      }
    };
  }

  // Substitute (x, y) ↦ (p x + q y, r x + s y) into a quadratic form.
  function transformQuadratic(form, M) {
    var a = form.coeffs[0], b = form.coeffs[1], c = form.coeffs[2];
    var p = M[0][0], q = M[0][1], r = M[1][0], s = M[1][1];
    var a2 = a * p * p + b * p * r + c * r * r;
    var b2 = 2 * a * p * q + b * (p * s + q * r) + 2 * c * r * s;
    var c2 = a * q * q + b * q * s + c * s * s;
    return quadraticForm(a2, b2, c2);
  }

  // Substitute (x, y) ↦ (p x + q y, r x + s y) into a cubic form.
  // Expansion of f(px+qy, rx+sy) = a(px+qy)³ + b(px+qy)²(rx+sy) + c(px+qy)(rx+sy)² + d(rx+sy)³.
  function transformCubic(form, M) {
    var a = form.coeffs[0], b = form.coeffs[1], c = form.coeffs[2], d = form.coeffs[3];
    var p = M[0][0], q = M[0][1], r = M[1][0], s = M[1][1];
    var a3 = a * p * p * p + b * p * p * r + c * p * r * r + d * r * r * r;
    var b3 = 3 * a * p * p * q + b * (p * p * s + 2 * p * q * r) + c * (2 * p * r * s + q * r * r) + 3 * d * r * r * s;
    var c3 = 3 * a * p * q * q + b * (2 * p * q * s + q * q * r) + c * (p * s * s + 2 * q * r * s) + 3 * d * r * s * s;
    var d3 = a * q * q * q + b * q * q * s + c * q * s * s + d * s * s * s;
    return cubicForm(a3, b3, c3, d3);
  }

  function transformForm(form, M) {
    if (form.degree === 2) return transformQuadratic(form, M);
    if (form.degree === 3) return transformCubic(form, M);
    throw new Error('transformForm: unsupported degree ' + form.degree);
  }

  function discriminant(form) {
    if (form.degree === 2) {
      var c = form.coeffs;
      return c[1] * c[1] - 4 * c[0] * c[2];
    }
    if (form.degree === 3) {
      var a = form.coeffs[0], b = form.coeffs[1], cc = form.coeffs[2], d = form.coeffs[3];
      return 18 * a * b * cc * d
           - 4 * b * b * b * d
           + b * b * cc * cc
           - 4 * a * cc * cc * cc
           - 27 * a * a * d * d;
    }
    throw new Error('discriminant: unsupported degree ' + form.degree);
  }

  // ───────────────────────────────────────────── physical systems ─────
  // A "system" is a record { name, L(q, qdot, t), accel(q, qdot, t), params }.
  // The Lagrangian is provided so that δL and Noether currents can be computed
  // by numerical differentiation; the accel is provided separately so that the
  // RK4 integrator can use it directly without solving Euler-Lagrange at runtime.

  function freeParticle(m) {
    m = (m == null) ? 1 : m;
    return {
      name: 'free particle',
      L: function (q, qdot, t) { return 0.5 * m * qdot * qdot; },
      accel: function (q, qdot, t) { return 0; },
      params: { m: m }
    };
  }

  function harmonicOscillator(m, k) {
    m = (m == null) ? 1 : m;
    k = (k == null) ? 1 : k;
    return {
      name: 'harmonic oscillator',
      L: function (q, qdot, t) { return 0.5 * m * qdot * qdot - 0.5 * k * q * q; },
      accel: function (q, qdot, t) { return -(k / m) * q; },
      params: { m: m, k: k }
    };
  }

  function pendulum(m, l, g) {
    m = (m == null) ? 1 : m;
    l = (l == null) ? 1 : l;
    g = (g == null) ? 9.81 : g;
    return {
      name: 'pendulum',
      L: function (theta, thetadot, t) {
        return 0.5 * m * l * l * thetadot * thetadot - m * g * l * (1 - Math.cos(theta));
      },
      accel: function (theta, thetadot, t) { return -(g / l) * Math.sin(theta); },
      params: { m: m, l: l, g: g }
    };
  }

  function particleInPotential(m, V, Vprime) {
    // 1D particle in an arbitrary potential V(q), with first derivative supplied.
    m = (m == null) ? 1 : m;
    return {
      name: 'particle in potential',
      L: function (q, qdot, t) { return 0.5 * m * qdot * qdot - V(q); },
      accel: function (q, qdot, t) { return -Vprime(q) / m; },
      params: { m: m, V: V, Vprime: Vprime }
    };
  }

  // 2D particle in a central potential V(r), r = |q|. q and qdot are length-2.
  function centralForce2D(m, V, Vprime) {
    m = (m == null) ? 1 : m;
    return {
      name: 'central force 2D',
      L: function (q, qdot, t) {
        var v2 = qdot[0] * qdot[0] + qdot[1] * qdot[1];
        var r = Math.sqrt(q[0] * q[0] + q[1] * q[1]);
        return 0.5 * m * v2 - V(r);
      },
      accel: function (q, qdot, t) {
        var r = Math.sqrt(q[0] * q[0] + q[1] * q[1]);
        if (r < 1e-12) return [0, 0];
        var f = -Vprime(r) / m / r;
        return [f * q[0], f * q[1]];
      },
      energy: function (q, qdot) {
        var v2 = qdot[0] * qdot[0] + qdot[1] * qdot[1];
        var r = Math.sqrt(q[0] * q[0] + q[1] * q[1]);
        return 0.5 * m * v2 + V(r);
      },
      angularMomentum: function (q, qdot) {
        return m * (q[0] * qdot[1] - q[1] * qdot[0]);
      },
      params: { m: m, V: V, Vprime: Vprime }
    };
  }

  // Kepler: 2D inverse-square attractive force with coupling GM.
  // Returns a centralForce2D plus a Laplace-Runge-Lenz helper.
  function kepler(m, GM) {
    m = (m == null) ? 1 : m;
    GM = (GM == null) ? 1 : GM;
    var V = function (r) { return -GM * m / r; };
    var Vprime = function (r) { return GM * m / (r * r); };
    var sys = centralForce2D(m, V, Vprime);
    sys.name = 'kepler';
    sys.params = { m: m, GM: GM };
    // LRL vector A = p × L − m k r̂, with k = GM m, L = m (q × v) ẑ.
    // In 2D: A_x = m v_y · L/m − m k q_x/|q|  (using L scalar = m (q×v))
    //        A_y = −m v_x · L/m − m k q_y/|q|
    sys.LRL = function (q, qdot) {
      var Lz = q[0] * qdot[1] - q[1] * qdot[0]; // per unit mass
      var r = Math.sqrt(q[0] * q[0] + q[1] * q[1]);
      var k = GM;
      return [
        qdot[1] * Lz - k * q[0] / r,
        -qdot[0] * Lz - k * q[1] / r
      ];
    };
    return sys;
  }

  // Vector Noether current: (∂L/∂q̇_i) X_i − F, for q, qdot length-n arrays
  // and X(q, t) returning a length-n array.
  function noetherCurrentVec(L, X, F, q, qdot, t) {
    var n = q.length;
    var Xv = X(q, t);
    var Fv = F ? F(q, t) : 0;
    var Q = -Fv;
    var h = H_STEP;
    for (var i = 0; i < n; i++) {
      var vp = qdot.slice(), vm = qdot.slice();
      vp[i] += h; vm[i] -= h;
      var dL = (L(q, vp, t) - L(q, vm, t)) / (2 * h);
      Q += dL * Xv[i];
    }
    return Q;
  }

  // Hamiltonian for a vector Lagrangian. H = Σ q̇_i · ∂L/∂q̇_i − L.
  function hamiltonianVec(L, q, qdot, t) {
    var n = q.length;
    var H = -L(q, qdot, t);
    var h = H_STEP;
    for (var i = 0; i < n; i++) {
      var vp = qdot.slice(), vm = qdot.slice();
      vp[i] += h; vm[i] -= h;
      var dL = (L(q, vp, t) - L(q, vm, t)) / (2 * h);
      H += qdot[i] * dL;
    }
    return H;
  }

  // ───────────────────────────────────────────── Lagrangian mechanics ─────
  // Numerical differentiation + the two Noether-related quantities. All work
  // on scalar `q, qdot` (the 1D case that Act I lives in). Higher-dimensional
  // Lagrangians can use these coordinate-by-coordinate.

  var H_STEP = 1e-5;

  function partialQ(L, q, qdot, t) {
    return (L(q + H_STEP, qdot, t) - L(q - H_STEP, qdot, t)) / (2 * H_STEP);
  }

  function partialQdot(L, q, qdot, t) {
    return (L(q, qdot + H_STEP, t) - L(q, qdot - H_STEP, t)) / (2 * H_STEP);
  }

  // Hamiltonian H = qdot · (∂L/∂qdot) − L (scalar 1D version).
  function hamiltonian(L, q, qdot, t) {
    return qdot * partialQdot(L, q, qdot, t) - L(q, qdot, t);
  }

  // Noether conserved current for a one-parameter symmetry `q ↦ q + ε X(q, t)`
  // with quasi-symmetry boundary piece F(q, t) (pass 0 if the symmetry is strict).
  // Returns Q = (∂L/∂qdot) · X − F.
  function noetherCurrent(L, X, F, q, qdot, t) {
    var Xval = X(q, t);
    var Fval = F ? F(q, t) : 0;
    return partialQdot(L, q, qdot, t) * Xval - Fval;
  }

  // Numerical δL under q ↦ q + ε X(q, t). X is a function of (q, t) only
  // (the standard Noether setting for configuration-space symmetries), so
  // Xdot along the trajectory is (∂X/∂q) qdot + ∂X/∂t.
  function deltaL(L, X, q, qdot, t) {
    var dXdq = (X(q + H_STEP, t) - X(q - H_STEP, t)) / (2 * H_STEP);
    var dXdt = (X(q, t + H_STEP) - X(q, t - H_STEP)) / (2 * H_STEP);
    var Xdot = dXdq * qdot + dXdt;
    var Xval = X(q, t);
    var eps = 1e-4;
    var Lplus = L(q + eps * Xval, qdot + eps * Xdot, t);
    var Lminus = L(q - eps * Xval, qdot - eps * Xdot, t);
    return (Lplus - Lminus) / (2 * eps);
  }

  // ───────────────────────────────────────────── Lagrangian mechanics (core) ─────
  // Minimal API used in Act I explainers #3, #4, #5. Later phases extend this.

  // Numerical action S[q] = ∫ L(q, q̇, t) dt along a discretized path.
  // `path` is an array of [t, q] pairs (q can be scalar or array).
  function actionIntegral(L, path) {
    var S = 0;
    for (var i = 0; i < path.length - 1; i++) {
      var t0 = path[i][0], t1 = path[i + 1][0];
      var q0 = path[i][1], q1 = path[i + 1][1];
      var dt = t1 - t0;
      if (dt <= 0) continue;
      var isVec = Array.isArray(q0);
      var qmid, qdot;
      if (isVec) {
        qmid = new Array(q0.length);
        qdot = new Array(q0.length);
        for (var k = 0; k < q0.length; k++) {
          qmid[k] = 0.5 * (q0[k] + q1[k]);
          qdot[k] = (q1[k] - q0[k]) / dt;
        }
      } else {
        qmid = 0.5 * (q0 + q1);
        qdot = (q1 - q0) / dt;
      }
      var tmid = 0.5 * (t0 + t1);
      S += L(qmid, qdot, tmid) * dt;
    }
    return S;
  }

  // RK4 integrator for qdotdot = accel(q, qdot, t). Returns an array of
  // state records [{ t, q, qdot }].
  function rk4(accel, q0, qdot0, dt, steps) {
    var isVec = Array.isArray(q0);
    var q = isVec ? q0.slice() : q0;
    var v = isVec ? qdot0.slice() : qdot0;
    var t = 0;
    var history = [{ t: t, q: isVec ? q.slice() : q, qdot: isVec ? v.slice() : v }];

    function add(a, b, scale) {
      if (isVec) {
        var out = new Array(a.length);
        for (var i = 0; i < a.length; i++) out[i] = a[i] + b[i] * scale;
        return out;
      }
      return a + b * scale;
    }

    for (var step = 0; step < steps; step++) {
      var k1q = v;
      var k1v = accel(q, v, t);
      var q2 = add(q, k1q, dt / 2), v2 = add(v, k1v, dt / 2);
      var k2q = v2;
      var k2v = accel(q2, v2, t + dt / 2);
      var q3 = add(q, k2q, dt / 2), v3 = add(v, k2v, dt / 2);
      var k3q = v3;
      var k3v = accel(q3, v3, t + dt / 2);
      var q4 = add(q, k3q, dt), v4 = add(v, k3v, dt);
      var k4q = v4;
      var k4v = accel(q4, v4, t + dt);

      if (isVec) {
        var newQ = new Array(q.length), newV = new Array(v.length);
        for (var j = 0; j < q.length; j++) {
          newQ[j] = q[j] + dt / 6 * (k1q[j] + 2 * k2q[j] + 2 * k3q[j] + k4q[j]);
          newV[j] = v[j] + dt / 6 * (k1v[j] + 2 * k2v[j] + 2 * k3v[j] + k4v[j]);
        }
        q = newQ; v = newV;
      } else {
        q = q + dt / 6 * (k1q + 2 * k2q + 2 * k3q + k4q);
        v = v + dt / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);
      }
      t += dt;
      history.push({ t: t, q: isVec ? q.slice() : q, qdot: isVec ? v.slice() : v });
    }
    return history;
  }

  // ───────────────────────────────────────────── algebra: ℤ[√−5] ─────
  // Elements are records { a, b } representing a + b √(−5).

  var ZsqrtM5 = {
    make: function (a, b) { return { a: a, b: b }; },
    add:  function (x, y) { return { a: x.a + y.a, b: x.b + y.b }; },
    sub:  function (x, y) { return { a: x.a - y.a, b: x.b - y.b }; },
    mul:  function (x, y) {
      // (a + b √−5)(c + d √−5) = (ac − 5 bd) + (ad + bc) √−5
      return { a: x.a * y.a - 5 * x.b * y.b, b: x.a * y.b + x.b * y.a };
    },
    norm: function (x) { return x.a * x.a + 5 * x.b * x.b; },
    eq:   function (x, y) { return x.a === y.a && x.b === y.b; },
    str:  function (x) {
      if (x.b === 0) return '' + x.a;
      if (x.a === 0) return (x.b === 1 ? '' : x.b === -1 ? '−' : x.b) + '√−5';
      var sign = x.b > 0 ? ' + ' : ' − ';
      var mag = Math.abs(x.b);
      return x.a + sign + (mag === 1 ? '' : mag) + '√−5';
    },
    zero: { a: 0, b: 0 },
    one:  { a: 1, b: 0 }
  };

  // ───────────────────────────────────────────── algebra: univariate polys ─────
  // Over the rationals (stored as JS numbers). coeffs[i] is the x^i coefficient.

  var polyUni = {
    make: function (coeffs) {
      // Strip trailing zeros.
      var c = coeffs.slice();
      while (c.length > 1 && Math.abs(c[c.length - 1]) < 1e-12) c.pop();
      return c;
    },
    degree: function (p) { return p.length === 1 && p[0] === 0 ? -Infinity : p.length - 1; },
    lc:     function (p) { return p[p.length - 1]; },
    add:    function (p, q) {
      var n = Math.max(p.length, q.length);
      var r = new Array(n).fill(0);
      for (var i = 0; i < n; i++) r[i] = (p[i] || 0) + (q[i] || 0);
      return polyUni.make(r);
    },
    sub:    function (p, q) {
      var n = Math.max(p.length, q.length);
      var r = new Array(n).fill(0);
      for (var i = 0; i < n; i++) r[i] = (p[i] || 0) - (q[i] || 0);
      return polyUni.make(r);
    },
    mul:    function (p, q) {
      var r = new Array(p.length + q.length - 1).fill(0);
      for (var i = 0; i < p.length; i++)
        for (var j = 0; j < q.length; j++)
          r[i + j] += p[i] * q[j];
      return polyUni.make(r);
    }
  };

  // ───────────────────────────────────────────── algebra: multivariate polys ─────
  // Stored as arrays of { c, e } where `e` is a length-`nvars` exponent vector and
  // `c` is a rational coefficient. Terms kept in lex-descending order, deduplicated.
  // Lex order: compare exponent vectors left-to-right; larger first.

  function monCompare(a, b) {
    // Returns positive if a > b in lex order.
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  }

  function monEq(a, b) {
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  function monAdd(a, b) {
    var r = new Array(a.length);
    for (var i = 0; i < a.length; i++) r[i] = a[i] + b[i];
    return r;
  }

  function monSub(a, b) {
    var r = new Array(a.length);
    for (var i = 0; i < a.length; i++) r[i] = a[i] - b[i];
    return r;
  }

  function monDivides(a, b) {
    // Does monomial a divide monomial b?  i.e. a_i ≤ b_i for all i.
    for (var i = 0; i < a.length; i++) if (a[i] > b[i]) return false;
    return true;
  }

  function monLcm(a, b) {
    var r = new Array(a.length);
    for (var i = 0; i < a.length; i++) r[i] = Math.max(a[i], b[i]);
    return r;
  }

  function polyNormalize(terms) {
    // Sort lex-desc, merge duplicates, drop zeros.
    terms = terms.slice().sort(function (u, v) { return -monCompare(u.e, v.e); });
    var out = [];
    for (var i = 0; i < terms.length; i++) {
      if (out.length && monEq(out[out.length - 1].e, terms[i].e)) {
        out[out.length - 1].c += terms[i].c;
      } else {
        out.push({ c: terms[i].c, e: terms[i].e.slice() });
      }
    }
    return out.filter(function (t) { return Math.abs(t.c) > 1e-12; });
  }

  var polyMulti = {
    nvars: 0,
    zero: function () { return []; },
    make: function (terms) { return polyNormalize(terms); },
    // Convenience: build from [[c, [e0, e1, …]], …] pairs.
    from: function (pairs) {
      return polyNormalize(pairs.map(function (p) { return { c: p[0], e: p[1].slice() }; }));
    },
    isZero: function (p) { return p.length === 0; },
    lt:     function (p) { return p[0]; }, // leading term
    lm:     function (p) { return p[0].e; }, // leading monomial exponent
    lc:     function (p) { return p[0].c; }, // leading coefficient
    add:    function (p, q) { return polyNormalize(p.concat(q)); },
    sub:    function (p, q) {
      var neg = q.map(function (t) { return { c: -t.c, e: t.e }; });
      return polyNormalize(p.concat(neg));
    },
    mul:    function (p, q) {
      var out = [];
      for (var i = 0; i < p.length; i++)
        for (var j = 0; j < q.length; j++)
          out.push({ c: p[i].c * q[j].c, e: monAdd(p[i].e, q[j].e) });
      return polyNormalize(out);
    },
    scale:  function (p, s) {
      if (Math.abs(s) < 1e-12) return [];
      return p.map(function (t) { return { c: t.c * s, e: t.e.slice() }; });
    },
    // Multiply by a single monomial c · x^e.
    mulMono: function (p, c, e) {
      return p.map(function (t) { return { c: t.c * c, e: monAdd(t.e, e) }; });
    },
    str: function (p, names) {
      if (p.length === 0) return '0';
      names = names || ['x', 'y', 'z', 'w'];
      return p.map(function (t, i) {
        var sign = t.c < 0 ? ' − ' : (i > 0 ? ' + ' : '');
        var mag = Math.abs(t.c);
        var core = '';
        for (var j = 0; j < t.e.length; j++) {
          if (t.e[j] === 0) continue;
          core += names[j];
          if (t.e[j] !== 1) core += '^' + t.e[j];
        }
        var coef;
        if (core === '') coef = String(mag);
        else coef = (Math.abs(mag - 1) < 1e-12 ? '' : String(mag));
        return sign + coef + core;
      }).join('');
    }
  };

  // S-polynomial of f and g: (L/LT(f)) f − (L/LT(g)) g, where L = lcm(lm(f), lm(g)).
  function sPolynomial(f, g) {
    var lf = polyMulti.lt(f), lg = polyMulti.lt(g);
    var L = monLcm(lf.e, lg.e);
    var a = polyMulti.mulMono(f, 1 / lf.c, monSub(L, lf.e));
    var b = polyMulti.mulMono(g, 1 / lg.c, monSub(L, lg.e));
    return polyMulti.sub(a, b);
  }

  // Multivariate division: return the remainder of f modulo the list G.
  function polyReduce(f, G) {
    var r = [];
    while (f.length > 0) {
      var divided = false;
      for (var i = 0; i < G.length; i++) {
        if (G[i].length === 0) continue;
        var lg = G[i][0];
        if (monDivides(lg.e, f[0].e)) {
          var q = { c: f[0].c / lg.c, e: monSub(f[0].e, lg.e) };
          f = polyMulti.sub(f, polyMulti.mulMono(G[i], q.c, q.e));
          divided = true;
          break;
        }
      }
      if (!divided) {
        r.push(f[0]);
        f = f.slice(1);
      }
    }
    return polyNormalize(r);
  }

  // Buchberger's algorithm — returns the completed basis plus a history list.
  function buchberger(F, maxSteps) {
    maxSteps = maxSteps || 50;
    var G = F.slice();
    var history = [{ step: 0, action: 'init', G: G.slice() }];
    var pairs = [];
    for (var i = 0; i < G.length; i++)
      for (var j = i + 1; j < G.length; j++)
        pairs.push([i, j]);
    var step = 0;
    while (pairs.length > 0 && step < maxSteps) {
      step++;
      var pair = pairs.shift();
      var S = sPolynomial(G[pair[0]], G[pair[1]]);
      var r = polyReduce(S, G);
      history.push({ step: step, action: 'spoly', pair: pair, S: S, remainder: r });
      if (r.length > 0) {
        var newIndex = G.length;
        for (var k = 0; k < G.length; k++) pairs.push([k, newIndex]);
        G = G.concat([r]);
        history.push({ step: step, action: 'add', newIndex: newIndex, G: G.slice() });
      }
    }
    return { basis: G, history: history };
  }

  // ───────────────────────────────────────────── topology: small homology ─────
  // Compute H0, H1 (mod-2 for simplicity) of a small simplicial complex.
  // Complex is { verts: n, edges: [[i,j], …], triangles: [[i,j,k], …] }.
  // Returns { H0: rank, H1: rank } using mod-2 Smith-form shortcut for small cases.

  function ranks(complex) {
    // Computes β0 and β1 over ℚ via rank-nullity. (Torsion ignored; small examples.)
    var n = complex.verts;
    var edges = complex.edges || [];
    var tris  = complex.triangles || [];
    // ∂1 : C1 → C0, signed.
    var d1 = []; // rows = n, cols = edges.length
    for (var r = 0; r < n; r++) d1.push(new Array(edges.length).fill(0));
    for (var e = 0; e < edges.length; e++) {
      d1[edges[e][1]][e] += 1;
      d1[edges[e][0]][e] -= 1;
    }
    // ∂2 : C2 → C1, signed.
    var d2 = [];
    for (var r2 = 0; r2 < edges.length; r2++) d2.push(new Array(tris.length).fill(0));
    function edgeIdx(a, b) {
      var lo = Math.min(a, b), hi = Math.max(a, b);
      for (var i = 0; i < edges.length; i++) {
        if (edges[i][0] === lo && edges[i][1] === hi) return i;
      }
      return -1;
    }
    for (var t = 0; t < tris.length; t++) {
      var T = tris[t];
      var e01 = edgeIdx(T[0], T[1]);
      var e02 = edgeIdx(T[0], T[2]);
      var e12 = edgeIdx(T[1], T[2]);
      if (e01 >= 0) d2[e01][t] += 1;
      if (e12 >= 0) d2[e12][t] += 1;
      if (e02 >= 0) d2[e02][t] -= 1;
    }
    var rank1 = matRank(d1);
    var rank2 = matRank(d2);
    var H0 = n - rank1;
    var H1 = edges.length - rank1 - rank2;
    return { H0: H0, H1: H1, rank1: rank1, rank2: rank2 };
  }

  function matRank(M) {
    // Gaussian elimination over rationals for a small dense matrix.
    if (M.length === 0 || M[0].length === 0) return 0;
    var rows = M.map(function (r) { return r.slice(); });
    var nrows = rows.length, ncols = rows[0].length;
    var r = 0;
    for (var c = 0; c < ncols && r < nrows; c++) {
      // Find pivot.
      var pivot = -1;
      for (var i = r; i < nrows; i++) {
        if (Math.abs(rows[i][c]) > 1e-9) { pivot = i; break; }
      }
      if (pivot < 0) continue;
      var tmp = rows[r]; rows[r] = rows[pivot]; rows[pivot] = tmp;
      for (var i = r + 1; i < nrows; i++) {
        var factor = rows[i][c] / rows[r][c];
        for (var j = c; j < ncols; j++) rows[i][j] -= factor * rows[r][j];
      }
      r++;
    }
    return r;
  }

  // ───────────────────────────────────────────── public API ─────

  var NOETHER = {
    EPS: EPS,
    approxEq: approxEq,
    vecApproxEq: vecApproxEq,
    clone: clone,

    mat2: {
      make: mat2,
      apply: mat2apply,
      mul: mat2mul,
      det: mat2det,
      rot: rot2
    },

    groups: {
      D4: D4,
      S3: S3
    },

    action: {
      orbit: orbit,
      stabilizer: stabilizer,
      permuteLabels: permuteLabels
    },

    invariants: {
      check: checkInvariant
    },

    forms: {
      quadratic: quadraticForm,
      cubic: cubicForm,
      transform: transformForm,
      discriminant: discriminant
    },

    lagrangian: {
      action: actionIntegral,
      rk4: rk4,
      partialQ: partialQ,
      partialQdot: partialQdot
    },

    systems: {
      freeParticle: freeParticle,
      harmonicOscillator: harmonicOscillator,
      pendulum: pendulum,
      particleInPotential: particleInPotential,
      centralForce2D: centralForce2D,
      kepler: kepler
    },

    symmetry: {
      deltaL: deltaL
    },

    noether: {
      hamiltonian: hamiltonian,
      hamiltonianVec: hamiltonianVec,
      current: noetherCurrent,
      currentVec: noetherCurrentVec
    },

    rings: {
      ZsqrtM5: ZsqrtM5,
      polyUni: polyUni,
      polyMulti: polyMulti
    },

    grobner: {
      sPolynomial: sPolynomial,
      reduce: polyReduce,
      buchberger: buchberger
    },

    topology: {
      simplicialRanks: ranks
    }
  };

  global.NOETHER = NOETHER;

})(typeof window !== 'undefined' ? window : globalThis);
