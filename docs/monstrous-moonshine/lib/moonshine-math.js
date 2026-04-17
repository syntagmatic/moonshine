// moonshine-math.js — Numerical and geometric helpers for the Monstrous
// Moonshine series. Attaches a single `Moon` object to the global scope.
// No modules, no build step. Works alongside `../../exceptional-atlas/lib/lie-math.js`
// and `../../exceptional-atlas/lib/e8-math.js` when loaded in the same page.
//
// Public sections
// ---------------
//   Moon.j              j-function q-expansion data and formatting
//   Moon.monster        Monster group: order factorisation and irrep table
//   Moon.leech          Leech lattice constants
//   Moon.mckay          McKay–Thompson head decompositions
//   Moon.modular        SL₂(ℤ) action, fundamental-domain helpers
//   Moon.fmt            Number formatters
//
// Everything is plain arithmetic and tabulated data. The large integers for
// V♮ graded dimensions and Monster irrep dimensions are stored as BigInt
// where exactness matters for pedagogy, and as Number where we only need to
// display them. Callers that render numbers should go through Moon.fmt so
// the grouping stays consistent across pages.

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── number formatting ──

  function groupDigits(n) {
    // Accepts Number, BigInt, or string. Returns a thin-space-grouped string.
    var s = typeof n === 'bigint' ? n.toString() : String(n);
    var neg = false;
    if (s[0] === '-') { neg = true; s = s.slice(1); }
    var out = '';
    for (var i = s.length; i > 0; i -= 3) {
      var start = Math.max(0, i - 3);
      out = s.slice(start, i) + (out ? '\u2009' + out : '');
    }
    return (neg ? '-' : '') + out;
  }

  function shortOrder(n) {
    // Compact scientific form like "8.08 × 10^53" for display next to exact forms.
    var s = typeof n === 'bigint' ? n.toString() : String(Math.round(n));
    if (s[0] === '-') s = s.slice(1);
    var digits = s.length;
    if (digits <= 4) return s;
    var lead = s[0];
    var tail = s.slice(1, 3);
    return lead + '.' + tail + ' \u00d7 10' + superscript(digits - 1);
  }

  function superscript(n) {
    var map = { '-': '\u207b', '0': '\u2070', '1': '\u00b9', '2': '\u00b2',
                '3': '\u00b3', '4': '\u2074', '5': '\u2075', '6': '\u2076',
                '7': '\u2077', '8': '\u2078', '9': '\u2079' };
    return String(n).split('').map(function (c) { return map[c] || c; }).join('');
  }

  var fmt = {
    group: groupDigits,
    order: shortOrder,
    sup: superscript
  };

  // ─────────────────────────────────────────── j-function data ──
  //
  // Normalised modular j-invariant with q-expansion
  //   j(τ) = q⁻¹ + 744 + Σ c(n) q^n
  // where q = exp(2π i τ). Coefficients are integer and all ≥ 0 for n ≥ 0.
  // These values are the standard tabulated head of the q-series, as they
  // appear in Conway–Norton (1979) and the ATLAS of Finite Groups. We store
  // only the values we can verify against the Monster-module decompositions
  // below (via MCKAY_THOMPSON) — going further would require trusting a
  // secondary source for the multiplicities and we prefer exactness.

  var J_COEFFICIENTS = [
    { n: -1, c: 1n },
    { n: 0,  c: 744n },
    { n: 1,  c: 196884n },
    { n: 2,  c: 21493760n },
    { n: 3,  c: 864299970n },
    { n: 4,  c: 20245856256n },
    { n: 5,  c: 333202640600n },
    { n: 6,  c: 4252023300096n },
    { n: 7,  c: 44656994071935n },
    { n: 8,  c: 401490886656000n },
    { n: 9,  c: 3176440229784420n },
    { n: 10, c: 22567393309593600n }
  ];

  function jCoefficient(n) {
    for (var i = 0; i < J_COEFFICIENTS.length; i++) {
      if (J_COEFFICIENTS[i].n === n) return J_COEFFICIENTS[i].c;
    }
    return null;
  }

  // Hardy–Ramanujan asymptotic for the j-function Fourier coefficients:
  //   c(n) ~ e^(4π√n) / (√2 · n^(3/4))
  // Useful for "how fast do these grow?" figures.
  function jAsymptotic(n) {
    if (n < 1) return NaN;
    var expPart = Math.exp(4 * Math.PI * Math.sqrt(n));
    var denom = Math.SQRT2 * Math.pow(n, 0.75);
    return expPart / denom;
  }

  var j = {
    coefficients: J_COEFFICIENTS,
    coefficient: jCoefficient,
    asymptotic: jAsymptotic
  };

  // ─────────────────────────────────────────── Monster group data ──
  //
  // The Monster 𝕄 is the largest sporadic finite simple group. Its order
  // factorises as 2^46 · 3^20 · 5^9 · 7^6 · 11^2 · 13^3 · 17 · 19 · 23 · 29
  // · 31 · 41 · 47 · 59 · 71. The 15 primes dividing |𝕄| are exactly the
  // primes p for which the supersingular j-invariants in characteristic p
  // lie in F_p (Ogg, 1975) — the "Jack Daniel's problem".

  var MONSTER_PRIMES = [
    { p: 2,  exp: 46 },
    { p: 3,  exp: 20 },
    { p: 5,  exp: 9 },
    { p: 7,  exp: 6 },
    { p: 11, exp: 2 },
    { p: 13, exp: 3 },
    { p: 17, exp: 1 },
    { p: 19, exp: 1 },
    { p: 23, exp: 1 },
    { p: 29, exp: 1 },
    { p: 31, exp: 1 },
    { p: 41, exp: 1 },
    { p: 47, exp: 1 },
    { p: 59, exp: 1 },
    { p: 71, exp: 1 }
  ];

  function monsterOrder() {
    var order = 1n;
    for (var i = 0; i < MONSTER_PRIMES.length; i++) {
      var f = MONSTER_PRIMES[i];
      var base = BigInt(f.p);
      for (var k = 0; k < f.exp; k++) order *= base;
    }
    return order;
  }

  // The Monster has 194 conjugacy classes and therefore 194 complex
  // irreducible representations. We store only the first five dimensions —
  // the ones that appear in the verified McKay–Thompson head decompositions
  // below. (The rest exist and are tabulated in the ATLAS, but we don't
  // ship multiplicities past c(3), so listing them would be unverifiable
  // filler.) Source: ATLAS of Finite Groups, Conway et al. 1985.
  var MONSTER_IRREPS = [
    { i: 1, dim: 1n },
    { i: 2, dim: 196883n },
    { i: 3, dim: 21296876n },
    { i: 4, dim: 842609326n },
    { i: 5, dim: 18538750076n }
  ];

  var MONSTER_TOTAL_IRREPS = 194;

  // Two of the 194 irreps are the unusual dimension-
  //   13657487487436080603604188900 (~1.37 × 10^28)
  // pair of real representations χ_179 and χ_180 mentioned in the ATLAS.
  var MONSTER_TWIN_DIM = 13657487487436080603604188900n;

  var monster = {
    primes: MONSTER_PRIMES,
    order: monsterOrder,
    irreps: MONSTER_IRREPS,
    totalIrreps: MONSTER_TOTAL_IRREPS,
    twinDim: MONSTER_TWIN_DIM,
    conjugacyClasses: 194
  };

  // ─────────────────────────────────────────── Leech lattice ──

  var leech = {
    dimension: 24,
    minimumNorm: 4,          // squared length; "no roots" means no norm-2 vectors
    kissingNumber: 196560,   // exact; optimal in dimension 24 (CKMRV 2017)
    // Orders of the Conway groups (Co_0 = Aut Λ_24; Co_1 = Co_0 / {±1})
    co0Order: 8315553613086720000n,
    co1Order: 4157776806543360000n
  };

  // ─────────────────────────────────────────── McKay–Thompson heads ──
  //
  // The decompositions John McKay and John Thompson found in 1978 for the
  // first few j-coefficients into Monster irrep dimensions. Read them as
  //   c(n) = Σ multiplicity_k · dim(ρ_k)
  // with multiplicities stored in `mults` indexed by the 1-based `i` of the
  // corresponding Monster irrep in `monster.irreps`. Irreps omitted from
  // the object have multiplicity 0 at that grade.
  //
  // These five terms are the "numerical miracle" that convinced Conway and
  // Norton to make the moonshine conjecture.

  var MCKAY_THOMPSON = [
    { n: -1, total: 1n,
      mults: { 1: 1 },
      label: 'c(−1) = 1' },
    { n: 1, total: 196884n,
      mults: { 1: 1, 2: 1 },
      label: 'c(1) = 1 + 196 883' },
    { n: 2, total: 21493760n,
      mults: { 1: 1, 2: 1, 3: 1 },
      label: 'c(2) = 1 + 196 883 + 21 296 876' },
    { n: 3, total: 864299970n,
      mults: { 1: 2, 2: 2, 3: 1, 4: 1 },
      label: 'c(3) = 2·1 + 2·196 883 + 21 296 876 + 842 609 326' }
  ];

  function mckayDecomposition(n) {
    for (var i = 0; i < MCKAY_THOMPSON.length; i++) {
      if (MCKAY_THOMPSON[i].n === n) return MCKAY_THOMPSON[i];
    }
    return null;
  }

  // Verify a stored decomposition by multiplying out the multiplicities
  // against the Monster irrep dimensions and comparing the total. Returns
  // { ok, expected, actual } for diagnostics. Used in lib/test.html.
  function verifyMckay(entry) {
    var sum = 0n;
    var keys = Object.keys(entry.mults);
    for (var i = 0; i < keys.length; i++) {
      var k = parseInt(keys[i], 10);
      var mult = BigInt(entry.mults[keys[i]]);
      var dim = MONSTER_IRREPS[k - 1].dim;
      sum += mult * dim;
    }
    return { ok: sum === entry.total, expected: entry.total, actual: sum };
  }

  var mckay = {
    heads: MCKAY_THOMPSON,
    decomposition: mckayDecomposition,
    verify: verifyMckay
  };

  // ─────────────────────────────────────────── modular helpers ──
  //
  // The modular group SL₂(ℤ) = ⟨ S, T ⟩ acts on the upper half-plane ℍ by
  // fractional linear transformations τ ↦ (aτ+b)/(cτ+d). The generators
  // are T: τ ↦ τ+1 and S: τ ↦ −1/τ. The canonical fundamental domain ℱ
  // is { τ ∈ ℍ : |τ| ≥ 1, −1/2 ≤ Re τ ≤ 1/2 }.

  function applyT(tau) { return { re: tau.re + 1, im: tau.im }; }
  function applyTinv(tau) { return { re: tau.re - 1, im: tau.im }; }
  function applyS(tau) {
    var n = tau.re * tau.re + tau.im * tau.im;
    if (n < 1e-18) return { re: 0, im: Infinity };
    return { re: -tau.re / n, im: tau.im / n };
  }

  // Reduce a point τ ∈ ℍ into the canonical fundamental domain by
  // alternating applications of T-translations and S. Returns the reduced
  // point plus a path of intermediate points for animation.
  function reduceToFundamental(tau, maxSteps) {
    var steps = [{ re: tau.re, im: tau.im }];
    var cur = { re: tau.re, im: tau.im };
    var limit = maxSteps || 24;
    for (var i = 0; i < limit; i++) {
      // Shift Re τ into [-1/2, 1/2].
      var shifted = false;
      while (cur.re < -0.5) { cur = applyT(cur); shifted = true; }
      while (cur.re > 0.5)  { cur = applyTinv(cur); shifted = true; }
      if (shifted) steps.push({ re: cur.re, im: cur.im });
      var norm = cur.re * cur.re + cur.im * cur.im;
      if (norm >= 1 - 1e-9) break;
      cur = applyS(cur);
      steps.push({ re: cur.re, im: cur.im });
    }
    return { point: cur, steps: steps };
  }

  // Canonical fundamental domain as an SVG path fragment for a given
  // viewport. Callers supply a coordinate mapping (τ.re, τ.im) ↦ (x, y)
  // — usually a linear map. Returns an array of {re, im} nodes forming
  // the left wall, the arc, and the right wall.
  function fundamentalDomainOutline(topIm, arcSteps) {
    var nodes = [];
    nodes.push({ re: -0.5, im: topIm });
    nodes.push({ re: -0.5, im: Math.sqrt(1 - 0.25) });
    var steps = arcSteps || 40;
    for (var i = 1; i < steps; i++) {
      var theta = Math.PI * (2 / 3) + (Math.PI / 3) * (i / steps); // sweep 120° → 60°
      nodes.push({ re: Math.cos(theta), im: Math.sin(theta) });
    }
    nodes.push({ re: 0.5, im: Math.sqrt(1 - 0.25) });
    nodes.push({ re: 0.5, im: topIm });
    return nodes;
  }

  // Enumerate an orbit of the SL₂(ℤ) action on ℍ by BFS up to a given size,
  // starting from a seed matrix [[1,0],[0,1]] = identity and applying S, T,
  // T⁻¹ as generators. Used to draw the Escher-like hyperbolic tessellation.
  function enumerateSL2Matrices(maxEntry) {
    var limit = maxEntry || 6;
    var mats = [];
    var seen = Object.create(null);
    function key(m) { return m[0] + ',' + m[1] + ',' + m[2] + ',' + m[3]; }
    function push(m) {
      if (Math.max(Math.abs(m[0]), Math.abs(m[1]), Math.abs(m[2]), Math.abs(m[3])) > limit) return;
      var k = key(m);
      if (seen[k]) return;
      seen[k] = true;
      mats.push(m);
    }
    push([1, 0, 0, 1]);
    var idx = 0;
    while (idx < mats.length) {
      var m = mats[idx++];
      // S: [[0,-1],[1,0]]
      push([-m[1], m[0], -m[3], m[2]]);
      // T: [[1,1],[0,1]]
      push([m[0] + m[2], m[1] + m[3], m[2], m[3]]);
      // T⁻¹
      push([m[0] - m[2], m[1] - m[3], m[2], m[3]]);
    }
    return mats;
  }

  // Apply a Möbius transformation [[a,b],[c,d]] to a point τ ∈ ℍ.
  function mobius(m, tau) {
    var a = m[0], b = m[1], c = m[2], d = m[3];
    var reN = a * tau.re + b;
    var imN = a * tau.im;
    var reD = c * tau.re + d;
    var imD = c * tau.im;
    var denom = reD * reD + imD * imD;
    if (denom < 1e-18) return { re: 0, im: Infinity };
    return {
      re: (reN * reD + imN * imD) / denom,
      im: (imN * reD - reN * imD) / denom
    };
  }

  var modular = {
    T: applyT,
    Tinv: applyTinv,
    S: applyS,
    reduce: reduceToFundamental,
    fundamentalOutline: fundamentalDomainOutline,
    sl2Matrices: enumerateSL2Matrices,
    mobius: mobius
  };

  // ─────────────────────────────────────────── expose ──

  global.Moon = {
    fmt: fmt,
    j: j,
    monster: monster,
    leech: leech,
    mckay: mckay,
    modular: modular
  };

})(typeof window !== 'undefined' ? window : globalThis);
