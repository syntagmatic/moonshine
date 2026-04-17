// modular-math.js — Eisenstein series, modular forms, SL₂(ℤ) geometry,
// Hecke operators, and dimension formulas for the Modular Forms series.
//
// Attaches a single `Mod` object to the global scope (no modules, no build
// step). Companion to `./moonshine-math.js` in this same lib directory,
// which remains authoritative for Monster-specific data (irrep dimensions,
// McKay–Thompson heads). Pages that need both load both files.
//
// Public API
// ----------
//   Mod.complex       Complex arithmetic
//   Mod.sl2z          SL₂(ℤ) geometry, fundamental domain, tiling, geodesics
//   Mod.qseries       q-series arithmetic (add, mul, div, scale)
//   Mod.eisenstein     Eisenstein series E_k: coefficients and evaluation
//   Mod.delta          Discriminant Δ and Ramanujan τ(n)
//   Mod.jfn            j-function: coefficients, evaluation, special values
//   Mod.dim            Dimension formulas: dim M_k, dim S_k, monomial basis
//   Mod.hecke          Hecke operators T_p on q-series
//   Mod.gamma0         Congruence subgroups Γ₀(N): index, genus, cusps
//   Mod.elliptic       Elliptic curves: point counting, Frobenius traces
//   Mod.lattice        Lattice-point generators for visualisation
//   Mod.lfn            L-function partial sums
//   Mod.eta            Dedekind eta function
//   Mod.maass          Maass form eigenvalues and Bessel-based approximation
//   Mod.fmt            Number and q-term formatting

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── complex arithmetic ──

  function cAdd(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
  function cSub(a, b) { return { re: a.re - b.re, im: a.im - b.im }; }
  function cMul(a, b) {
    return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
  }
  function cDiv(a, b) {
    var d = b.re * b.re + b.im * b.im;
    return { re: (a.re * b.re + a.im * b.im) / d,
             im: (a.im * b.re - a.re * b.im) / d };
  }
  function cAbs(z) { return Math.sqrt(z.re * z.re + z.im * z.im); }
  function cArg(z) { return Math.atan2(z.im, z.re); }
  function cConj(z) { return { re: z.re, im: -z.im }; }
  function cExp(z) {
    var r = Math.exp(z.re);
    return { re: r * Math.cos(z.im), im: r * Math.sin(z.im) };
  }
  function cScale(z, s) { return { re: z.re * s, im: z.im * s }; }
  function cReal(x) { return { re: x, im: 0 }; }
  function qFromTau(tau) {
    return cExp({ re: -2 * Math.PI * tau.im, im: 2 * Math.PI * tau.re });
  }

  var complex = {
    add: cAdd, sub: cSub, mul: cMul, div: cDiv,
    abs: cAbs, arg: cArg, conj: cConj, exp: cExp,
    scale: cScale, real: cReal, q: qFromTau
  };

  // ─────────────────────────────────────────── SL₂(ℤ) geometry ──

  var S_MAT = [[0, -1], [1, 0]];
  var T_MAT = [[1, 1], [0, 1]];
  var TINV = [[1, -1], [0, 1]];
  var ST_MAT = [[0, -1], [1, 1]];

  function matMul(A, B) {
    return [
      [A[0][0] * B[0][0] + A[0][1] * B[1][0],
       A[0][0] * B[0][1] + A[0][1] * B[1][1]],
      [A[1][0] * B[0][0] + A[1][1] * B[1][0],
       A[1][0] * B[0][1] + A[1][1] * B[1][1]]
    ];
  }

  function mobius(mat, tau) {
    var a = mat[0][0], b = mat[0][1], c = mat[1][0], d = mat[1][1];
    return cDiv({ re: a * tau.re + b, im: a * tau.im },
                { re: c * tau.re + d, im: c * tau.im });
  }

  function applyS(tau) {
    var n = tau.re * tau.re + tau.im * tau.im;
    return { re: -tau.re / n, im: tau.im / n };
  }
  function applyT(tau) { return { re: tau.re + 1, im: tau.im }; }
  function applyTinv(tau) { return { re: tau.re - 1, im: tau.im }; }

  function reduceToF(tau, maxSteps) {
    var steps = [{ re: tau.re, im: tau.im, action: 'start' }];
    var cur = { re: tau.re, im: tau.im };
    var limit = maxSteps || 40;
    for (var i = 0; i < limit; i++) {
      var shifted = false;
      while (cur.re < -0.5 + 1e-9) { cur = applyT(cur); shifted = true; }
      while (cur.re > 0.5 + 1e-9) { cur = applyTinv(cur); shifted = true; }
      if (shifted) steps.push({ re: cur.re, im: cur.im, action: 'T' });
      var norm = cur.re * cur.re + cur.im * cur.im;
      if (norm >= 1 - 1e-9) break;
      cur = applyS(cur);
      steps.push({ re: cur.re, im: cur.im, action: 'S' });
    }
    return { point: cur, steps: steps };
  }

  function poincareMetric(tau) { return 1 / (tau.im * tau.im); }

  function hypDist(z1, z2) {
    var dx = z1.re - z2.re, dy = z1.im - z2.im;
    return Math.acosh(1 + (dx * dx + dy * dy) / (2 * z1.im * z2.im));
  }

  // Upper-half-plane ↔ Poincaré disk
  function toDisk(tau) {
    return cDiv({ re: tau.re, im: tau.im - 1 }, { re: tau.re, im: tau.im + 1 });
  }
  function fromDisk(w) {
    return cDiv(cMul({ re: 0, im: 1 }, cAdd(cReal(1), w)), cSub(cReal(1), w));
  }

  function fundDomainPath(yMax) {
    yMax = yMax || 3;
    var pts = [];
    pts.push({ re: -0.5, im: yMax });
    pts.push({ re: -0.5, im: Math.sqrt(3) / 2 });
    for (var i = 0; i <= 40; i++) {
      var angle = (2 * Math.PI / 3) * (1 - i / 40) + (Math.PI / 3) * (i / 40);
      pts.push({ re: Math.cos(angle), im: Math.sin(angle) });
    }
    pts.push({ re: 0.5, im: yMax });
    return pts;
  }

  function tilingMatrices(maxCount) {
    maxCount = maxCount || 30;
    var mats = [[[1, 0], [0, 1]]];
    var seen = { '1,0,0,1': true };
    var gens = [S_MAT, T_MAT, TINV];
    var queue = [[[1, 0], [0, 1]]];
    while (queue.length > 0 && mats.length < maxCount) {
      var cur = queue.shift();
      for (var g = 0; g < gens.length; g++) {
        var next = matMul(gens[g], cur);
        var key = next[0].join(',') + ',' + next[1].join(',');
        var neg = [-next[0][0], -next[0][1], -next[1][0], -next[1][1]].join(',');
        if (!seen[key] && !seen[neg]) {
          seen[key] = true; seen[neg] = true;
          mats.push(next); queue.push(next);
        }
      }
    }
    return mats;
  }

  function geodesic(z1, z2, nPts) {
    nPts = nPts || 30;
    var pts = [];
    if (Math.abs(z1.re - z2.re) < 1e-10) {
      for (var i = 0; i <= nPts; i++) {
        var t = i / nPts;
        pts.push({ re: z1.re, im: z1.im + t * (z2.im - z1.im) });
      }
      return pts;
    }
    var cx = ((z2.re * z2.re + z2.im * z2.im) -
              (z1.re * z1.re + z1.im * z1.im)) / (2 * (z2.re - z1.re));
    var r = Math.sqrt((z1.re - cx) * (z1.re - cx) + z1.im * z1.im);
    var a1 = Math.atan2(z1.im, z1.re - cx);
    var a2 = Math.atan2(z2.im, z2.re - cx);
    for (var i = 0; i <= nPts; i++) {
      var a = a1 + (i / nPts) * (a2 - a1);
      pts.push({ re: cx + r * Math.cos(a), im: r * Math.sin(a) });
    }
    return pts;
  }

  var RHO = { re: -0.5, im: Math.sqrt(3) / 2 };

  var sl2z = {
    S: S_MAT, T: T_MAT, Tinv: TINV, ST: ST_MAT,
    mobius: mobius, matMul: matMul,
    applyS: applyS, applyT: applyT, applyTinv: applyTinv,
    reduce: reduceToF,
    metric: poincareMetric, hypDist: hypDist,
    toDisk: toDisk, fromDisk: fromDisk,
    fundDomainPath: fundDomainPath,
    tiling: tilingMatrices,
    geodesic: geodesic,
    rho: RHO,
    i: { re: 0, im: 1 }
  };

  // ─────────────────────────────────────────── number theory ──

  function divisors(n) {
    var d = [];
    for (var i = 1; i * i <= n; i++) {
      if (n % i === 0) { d.push(i); if (i !== n / i) d.push(n / i); }
    }
    return d.sort(function (a, b) { return a - b; });
  }

  function sigmaK(n, k) {
    if (n < 1) return 0;
    var s = 0, d = divisors(n);
    for (var i = 0; i < d.length; i++) s += Math.pow(d[i], k);
    return s;
  }

  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }

  function eulerPhi(n) {
    if (n <= 0) return 0;
    var result = n, m = n;
    for (var p = 2; p * p <= m; p++) {
      if (m % p === 0) {
        while (m % p === 0) m /= p;
        result -= result / p;
      }
    }
    if (m > 1) result -= result / m;
    return Math.round(result);
  }

  // ─────────────────────────────────────────── q-series arithmetic ──

  var MAX_Q = 30;

  function qMul(a, b, N) {
    N = N || Math.min(a.length + b.length - 2, MAX_Q);
    var r = new Array(N + 1);
    for (var n = 0; n <= N; n++) {
      var s = 0;
      for (var k = 0; k <= n; k++) {
        if (k < a.length && (n - k) < b.length) s += a[k] * b[n - k];
      }
      r[n] = s;
    }
    return r;
  }

  function qAdd(a, b) {
    var N = Math.max(a.length, b.length), r = new Array(N);
    for (var n = 0; n < N; n++) r[n] = (n < a.length ? a[n] : 0) + (n < b.length ? b[n] : 0);
    return r;
  }

  function qScale(a, c) {
    var r = new Array(a.length);
    for (var n = 0; n < a.length; n++) r[n] = a[n] * c;
    return r;
  }

  function qDiv(a, b, N) {
    N = N || Math.min(a.length, MAX_Q);
    var r = new Array(N);
    for (var n = 0; n < N; n++) {
      var s = (n < a.length) ? a[n] : 0;
      for (var k = 0; k < n; k++) {
        if (k < r.length && (n - k) < b.length) s -= r[k] * b[n - k];
      }
      r[n] = s / b[0];
    }
    return r;
  }

  var qseries = { mul: qMul, add: qAdd, scale: qScale, div: qDiv };

  // ─────────────────────────────────────────── Eisenstein series ──

  // E_k = 1 + c_k · Σ σ_{k-1}(n) q^n   where c_k = −2k/B_k
  var EIS_CONST = { 4: 240, 6: -504, 8: 480, 10: -264 };

  function eisensteinCoeffs(k, N) {
    N = N || MAX_Q;
    var ck = EIS_CONST[k];
    if (ck === undefined) return null;
    var c = new Array(N + 1);
    c[0] = 1;
    for (var n = 1; n <= N; n++) c[n] = ck * sigmaK(n, k - 1);
    return c;
  }

  var E4 = eisensteinCoeffs(4);
  var E6 = eisensteinCoeffs(6);

  function eisensteinEval(k, tau, nTerms) {
    nTerms = nTerms || 25;
    var c = (k === 4) ? E4 : (k === 6) ? E6 : eisensteinCoeffs(k, nTerms);
    if (!c) return null;
    var q = qFromTau(tau);
    var result = cReal(c[0]);
    var qn = { re: 1, im: 0 };
    for (var n = 1; n <= Math.min(nTerms, c.length - 1); n++) {
      qn = cMul(qn, q);
      result = cAdd(result, cScale(qn, c[n]));
    }
    return result;
  }

  var eisenstein = {
    coeffs: eisensteinCoeffs, E4: E4, E6: E6,
    eval: eisensteinEval, sigma: sigmaK, divisors: divisors
  };

  // ─────────────────────────────────────────── discriminant Δ ──

  // Δ = (E_4³ − E_6²) / 1728.  Coefficients are τ(n).
  function computeDelta(N) {
    N = N || MAX_Q;
    var e4 = E4.slice(0, N + 1);
    var e4_3 = qMul(qMul(e4, e4, N), e4, N);
    var e6 = E6.slice(0, N + 1);
    var e6_2 = qMul(e6, e6, N);
    var d = new Array(N + 1);
    for (var n = 0; n <= N; n++) {
      d[n] = Math.round(((n < e4_3.length ? e4_3[n] : 0) -
                          (n < e6_2.length ? e6_2[n] : 0)) / 1728);
    }
    return d;
  }

  var DELTA = computeDelta();

  function ramanujanTau(n) {
    return (n >= 1 && n < DELTA.length) ? DELTA[n] : null;
  }

  function deltaEval(tau, nTerms) {
    nTerms = nTerms || 25;
    var q = qFromTau(tau);
    var result = { re: 0, im: 0 };
    var qn = { re: 1, im: 0 };
    for (var n = 0; n <= Math.min(nTerms, DELTA.length - 1); n++) {
      if (DELTA[n]) result = cAdd(result, cScale(qn, DELTA[n]));
      qn = cMul(qn, q);
    }
    return result;
  }

  var delta = { coeffs: DELTA, tau: ramanujanTau, eval: deltaEval };

  // ─────────────────────────────────────────── j-function ──

  // j(τ) = E_4³ / Δ = q⁻¹ + 744 + 196 884 q + ⋯
  function computeJ(N) {
    N = N || MAX_Q;
    var e4 = E4.slice(0, N + 2);
    var e4_3 = qMul(qMul(e4, e4, N + 1), e4, N + 1);
    // Divide E_4³ by (Δ shifted left one place): Δ/q = [1, −24, 252, …]
    var dShifted = DELTA.slice(1, N + 2);
    return qDiv(e4_3, dShifted, N + 1);
  }

  var J = computeJ();

  // c(n) where j = Σ c(n) q^n,  J[0] = c(−1), J[1] = c(0), J[2] = c(1), …
  function jCoeff(n) {
    var idx = n + 1;
    return (idx >= 0 && idx < J.length) ? Math.round(J[idx]) : null;
  }

  function jEval(tau, nTerms) {
    nTerms = nTerms || 20;
    var q = qFromTau(tau);
    var qInv = cDiv(cReal(1), q);
    var result = cScale(qInv, J[0]);
    var qn = cReal(1);
    for (var n = 1; n < Math.min(nTerms + 1, J.length); n++) {
      result = cAdd(result, cScale(qn, J[n]));
      qn = cMul(qn, q);
    }
    return result;
  }

  var jfn = {
    coeffs: J, coeff: jCoeff, eval: jEval,
    special: [
      { tau: { re: 0, im: 1 }, j: 1728, label: 'j(i) = 1728' },
      { tau: RHO, j: 0, label: 'j(ρ) = 0' }
    ]
  };

  // ─────────────────────────────────────────── dimension formulas ──

  function dimM(k) {
    if (k < 0 || k % 2 !== 0) return 0;
    if (k === 0) return 1;
    if (k === 2) return 0;
    return (k % 12 === 2) ? Math.floor(k / 12) : Math.floor(k / 12) + 1;
  }

  function dimS(k) {
    if (k < 0 || k % 2 !== 0 || k < 12) return 0;
    return dimM(k) - 1;
  }

  // Monomials E_4^a E_6^b with 4a + 6b = k
  function basisMonomials(k) {
    if (k < 0 || k % 2 !== 0) return [];
    var monoms = [];
    for (var b = 0; 6 * b <= k; b++) {
      var rem = k - 6 * b;
      if (rem % 4 === 0) monoms.push({ a: rem / 4, b: b });
    }
    return monoms;
  }

  function monomialQSeries(a, b, N) {
    N = N || MAX_Q;
    var result = [1];
    for (var i = 0; i < a; i++) result = qMul(result, E4, N);
    for (var i = 0; i < b; i++) result = qMul(result, E6, N);
    return result;
  }

  var dim = { M: dimM, S: dimS, basis: basisMonomials, monomialQ: monomialQSeries };

  // ─────────────────────────────────────────── Hecke operators ──

  // T_p on weight-k form: b(n) = a(pn) + p^{k−1} a(n/p)
  function heckeT(p, coeffs, k) {
    var N = Math.floor((coeffs.length - 1) / p) + 1;
    N = Math.min(N, coeffs.length);
    var result = new Array(N);
    var pk1 = Math.pow(p, k - 1);
    for (var n = 0; n < N; n++) {
      var t1 = (p * n < coeffs.length) ? coeffs[p * n] : 0;
      var t2 = (n % p === 0 && n / p < coeffs.length) ? pk1 * coeffs[n / p] : 0;
      result[n] = t1 + t2;
    }
    return result;
  }

  var hecke = { T: heckeT };

  // ─────────────────────────────────────────── Γ₀(N) ──

  function gamma0Index(N) {
    var idx = N, n = N;
    for (var p = 2; p * p <= n; p++) {
      if (n % p === 0) {
        idx = idx * (1 + 1 / p);
        while (n % p === 0) n /= p;
      }
    }
    if (n > 1) idx = idx * (1 + 1 / n);
    return Math.round(idx);
  }

  function gamma0Cusps(N) {
    var d = divisors(N), count = 0;
    for (var i = 0; i < d.length; i++) count += eulerPhi(gcd(d[i], N / d[i]));
    return count;
  }

  // ε₂: solutions of x² ≡ −1 (mod N)
  function nu2(N) {
    var count = 0;
    for (var x = 0; x < N; x++) if ((x * x + 1) % N === 0) count++;
    return count;
  }

  // ε₃: solutions of x² + x + 1 ≡ 0 (mod N)
  function nu3(N) {
    var count = 0;
    for (var x = 0; x < N; x++) if ((x * x + x + 1) % N === 0) count++;
    return count;
  }

  function gamma0Genus(N) {
    if (N <= 1) return 0;
    var mu = gamma0Index(N);
    return Math.round(1 + mu / 12 - nu2(N) / 4 - nu3(N) / 3 - gamma0Cusps(N) / 2);
  }

  var gamma0 = {
    index: gamma0Index, cusps: gamma0Cusps,
    genus: gamma0Genus, dimS2: gamma0Genus
  };

  // ─────────────────────────────────────────── elliptic curves ──

  function legendreSymbol(a, p) {
    if (p === 2) return (a % 2 === 0) ? 0 : 1;
    a = ((a % p) + p) % p;
    if (a === 0) return 0;
    var exp = (p - 1) / 2, base = a, result = 1;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % p;
      base = (base * base) % p;
      exp = Math.floor(exp / 2);
    }
    return (result === 1) ? 1 : -1;
  }

  // #E(𝔽_p) for y² = x³ + Ax + B
  function countPointsFp(A, B, p) {
    var count = 1;
    for (var x = 0; x < p; x++) {
      var rhs = ((x * x % p * x + A * x + B) % p + p) % p;
      count += 1 + legendreSymbol(rhs, p);
    }
    return count;
  }

  function frobeniusTrace(A, B, p) { return p + 1 - countPointsFp(A, B, p); }

  function curveDiscriminant(A, B) { return -16 * (4 * A * A * A + 27 * B * B); }
  function curveJ(A, B) {
    var d = 4 * A * A * A + 27 * B * B;
    return (d === 0) ? Infinity : -1728 * 64 * A * A * A / d;
  }

  var elliptic = {
    count: countPointsFp, ap: frobeniusTrace,
    discriminant: curveDiscriminant, j: curveJ,
    legendre: legendreSymbol
  };

  // ─────────────────────────────────────────── lattice points ──

  function latticePoints(tau, range) {
    range = range || 5;
    var pts = [];
    for (var m = -range; m <= range; m++) {
      for (var n = -range; n <= range; n++) {
        if (m === 0 && n === 0) continue;
        pts.push({ m: m, n: n, re: m + n * tau.re, im: n * tau.im });
      }
    }
    return pts;
  }

  var lattice = { points: latticePoints };

  // ─────────────────────────────────────────── L-function ──

  function lPartialSum(coeffs, sRe, sIm, nMax) {
    nMax = nMax || coeffs.length - 1;
    var result = { re: 0, im: 0 };
    for (var n = 1; n <= nMax && n < coeffs.length; n++) {
      if (coeffs[n] === 0) continue;
      var logn = Math.log(n);
      var nms = cExp({ re: -sRe * logn, im: -sIm * logn });
      result = cAdd(result, cScale(nms, coeffs[n]));
    }
    return result;
  }

  var lfn = { partialSum: lPartialSum };

  // ─────────────────────────────────────────── Dedekind eta ──

  function etaEval(tau, nTerms) {
    nTerms = nTerms || 50;
    var q = qFromTau(tau);
    var q24 = cExp({ re: -Math.PI * tau.im / 12, im: Math.PI * tau.re / 12 });
    var result = q24;
    var qn = { re: 1, im: 0 };
    for (var n = 1; n <= nTerms; n++) {
      qn = cMul(qn, q);
      result = cMul(result, cSub(cReal(1), qn));
    }
    return result;
  }

  function etaAbsSq(tau, nTerms) {
    nTerms = nTerms || 50;
    var q = qFromTau(tau);
    var qAbs = cAbs(q);
    var result = Math.pow(qAbs, 1 / 12);
    var qn = { re: 1, im: 0 };
    for (var n = 1; n <= nTerms; n++) {
      qn = cMul(qn, q);
      result *= (1 - qn.re) * (1 - qn.re) + qn.im * qn.im;
    }
    return result;
  }

  var eta = { eval: etaEval, absSq: etaAbsSq };

  // ─────────────────────────────────────────── Maass forms ──

  // First Laplacian eigenvalues r on SL₂(ℤ)\ℍ (λ = 1/4 + r²)
  var MAASS_R = [
    { r: 9.53370, label: 'r₁' },
    { r: 12.17301, label: 'r₂' },
    { r: 13.77975, label: 'r₃' },
    { r: 14.35851, label: 'r₄' },
    { r: 16.13808, label: 'r₅' }
  ];

  function besselK(r, y) {
    if (y > 50) return Math.sqrt(Math.PI / (2 * y)) * Math.exp(-y);
    var sum = 0, dt = 0.04, tMax = 15 + 2 * Math.log(1 + y);
    for (var t = 0; t < tMax; t += dt) {
      sum += Math.cos(r * t) * Math.exp(-y * Math.cosh(t)) * dt;
    }
    return sum;
  }

  function maassApprox(r, x, y, nTerms) {
    nTerms = nTerms || 3;
    var val = 0;
    for (var n = 1; n <= nTerms; n++) {
      val += Math.sqrt(y) * besselK(r, 2 * Math.PI * n * y) * Math.cos(2 * Math.PI * n * x);
    }
    return val;
  }

  var maass = { eigenvalues: MAASS_R, besselK: besselK, approx: maassApprox };

  // ─────────────────────────────────────────── formatting ──

  function groupDigits(n) {
    var s = String(Math.round(n));
    var neg = s[0] === '-';
    if (neg) s = s.slice(1);
    var out = '';
    for (var i = s.length; i > 0; i -= 3) {
      out = s.slice(Math.max(0, i - 3), i) + (out ? '\u2009' + out : '');
    }
    return (neg ? '\u2212' : '') + out;
  }

  function superscript(n) {
    var map = { '-': '\u207b', '0': '\u2070', '1': '\u00b9', '2': '\u00b2',
                '3': '\u00b3', '4': '\u2074', '5': '\u2075', '6': '\u2076',
                '7': '\u2077', '8': '\u2078', '9': '\u2079' };
    return String(n).split('').map(function (c) { return map[c] || c; }).join('');
  }

  function qTerm(coeff, power, first) {
    if (coeff === 0) return '';
    var sign = first ? (coeff < 0 ? '\u2212' : '') : (coeff < 0 ? ' \u2212 ' : ' + ');
    var abs = Math.abs(coeff);
    var c = (abs === 1 && power !== 0) ? '' : groupDigits(abs);
    var q = power === 0 ? '' : power === 1 ? 'q' : 'q' + superscript(power);
    if (power === 0) return sign + groupDigits(abs);
    return sign + c + q;
  }

  var fmt = { group: groupDigits, sup: superscript, qTerm: qTerm };

  // ─────────────────────────────────────────── export ──

  global.Mod = {
    complex: complex, sl2z: sl2z, qseries: qseries,
    eisenstein: eisenstein, delta: delta, jfn: jfn,
    dim: dim, hecke: hecke, gamma0: gamma0,
    elliptic: elliptic, lattice: lattice, lfn: lfn,
    eta: eta, maass: maass, fmt: fmt
  };

})(typeof window !== 'undefined' ? window : this);
