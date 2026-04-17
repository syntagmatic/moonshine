// oct-math.js — octonion math for the Exceptional Arcade (Track B).
//
// Supersets docs/exceptional-atlas/lib/oct-math.js with primitives the three
// Track B games need:
//   - Fano-plane basis multiplication as the source of truth.
//     (The cyclic Fano lines used in Exceptional Atlas Part 9 are the
//     authoritative convention for this arcade.)
//   - Cayley-Dickson doubling with a step-by-step expansion so B2 can
//     show the reader exactly which sub-product produced each coordinate.
//   - The 240 octavian integer units (realized as E8 roots) with a
//     pedagogical classifier for B3.
//
// Attaches a single `OCT` global that covers the original API plus the
// new surface under OCT.fano, OCT.cdSteps, and OCT.octavian.

(function (global) {
  'use strict';

  // ───────────────────────────────────────────── Core Helpers ─────

  function conjugate(a) {
    if (typeof a === 'number') return a;
    if (a.length === 1) return [a[0]];
    var res = [a[0]];
    for (var i = 1; i < a.length; i++) res.push(-a[i]);
    return res;
  }

  function add(a, b) {
    if (typeof a === 'number') return a + b;
    var res = [];
    for (var i = 0; i < a.length; i++) res.push(a[i] + b[i]);
    return res;
  }

  function sub(a, b) {
    if (typeof a === 'number') return a - b;
    var res = [];
    for (var i = 0; i < a.length; i++) res.push(a[i] - b[i]);
    return res;
  }

  function scale(a, s) {
    if (typeof a === 'number') return a * s;
    return a.map(function (x) { return x * s; });
  }

  function zeroOf(n) {
    var v = [];
    for (var i = 0; i < n; i++) v.push(0);
    return v;
  }

  // ───────────────────────────────────────────── Cayley-Dickson ─────
  // Baez convention: (a, b)(c, d) = (ac - conj(d)·b, d·a + b·conj(c))
  //
  // This is the specific sign convention under which the cyclic Fano
  // lines in explainer #04 hold exactly: e_i·e_j = +e_k when (i,j,k)
  // is a directed cycle, −e_k against it.

  function cdMul(p1, p2) {
    if (typeof p1 === 'number' && typeof p2 === 'number') {
      return p1 * p2;
    }

    var n = p1.length / 2;
    var a = p1.slice(0, n);
    var b = p1.slice(n);
    var c = p2.slice(0, n);
    var d = p2.slice(n);

    if (n === 1) {
      a = a[0]; b = b[0]; c = c[0]; d = d[0];
    }

    var term1 = sub(cdMul(a, c), cdMul(conjugate(d), b));
    var term2 = add(cdMul(d, a), cdMul(b, conjugate(c)));

    if (n === 1) return [term1, term2];
    return term1.concat(term2);
  }

  // ───────────────────────────────────────────── Fano plane ─────
  // The cyclic Fano convention used in explainer #04: seven oriented
  // triples (a, b, c) where e_a·e_b = e_c, e_b·e_c = e_a, e_c·e_a = e_b.
  // Reversing any of those gets a minus sign.

  var FANO_LINES = [
    [1, 2, 3],
    [1, 4, 5],
    [1, 7, 6],
    [2, 4, 6],
    [2, 5, 7],
    [3, 4, 7],
    [3, 6, 5]
  ];

  function fanoLineContaining(i, j) {
    if (i === 0 || j === 0 || i === j) return null;
    for (var l = 0; l < FANO_LINES.length; l++) {
      var line = FANO_LINES[l];
      if (line.indexOf(i) >= 0 && line.indexOf(j) >= 0) return line.slice();
    }
    return null;
  }

  // Signed product of two basis units e_i · e_j. Returns {idx, sign}
  // where the result is (sign)·e_idx. Handles the real axis and
  // self-squared cases.
  function fanoProduct(i, j) {
    if (i === 0) return { idx: j, sign: 1 };
    if (j === 0) return { idx: i, sign: 1 };
    if (i === j) return { idx: 0, sign: -1 };

    var line = fanoLineContaining(i, j);
    if (!line) return null;

    var ii = line.indexOf(i);
    var jj = line.indexOf(j);
    var kk = 3 - ii - jj;
    var cyclic = ((ii + 1) % 3) === jj;
    return { idx: line[kk], sign: cyclic ? 1 : -1 };
  }

  // Signed × signed product. Arguments are {idx, sign}; returns {idx, sign}.
  function fanoSignedProduct(a, b) {
    var base = fanoProduct(a.idx, b.idx);
    if (!base) return null;
    return { idx: base.idx, sign: base.sign * a.sign * b.sign };
  }

  // 8×8 multiplication table as {idx, sign} entries.
  function fanoTable() {
    var T = [];
    for (var i = 0; i < 8; i++) {
      T.push([]);
      for (var j = 0; j < 8; j++) {
        T[i].push(fanoProduct(i, j));
      }
    }
    return T;
  }

  // Canonical layout of the Fano plane (same positions as explainer #04,
  // translated into a [0,1]×[0,1] box so callers can scale at will).
  // Triangle: e1 (top), e2 (bottom-right), e4 (bottom-left).
  // Midpoints: e3 (e1-e2 side midpoint), e6 (e1-e4 side midpoint),
  //            e5 (e2-e4 side midpoint).
  // Center:   e7 (triangle center, also the inner circle's center).
  var _s = Math.sqrt(3) / 2;
  var FANO_LAYOUT = {
    1: { x: 0.5,              y: 0.08 },
    2: { x: 0.5 + 0.42 * _s,  y: 0.08 + 0.42 * 1.5 },
    4: { x: 0.5 - 0.42 * _s,  y: 0.08 + 0.42 * 1.5 },
    3: { x: 0.5 + 0.21 * _s,  y: 0.08 + 0.21 * 1.5 },
    6: { x: 0.5 - 0.21 * _s,  y: 0.08 + 0.21 * 1.5 },
    5: { x: 0.5,              y: 0.08 + 0.42 * 1.5 },
    7: { x: 0.5,              y: 0.08 + 0.28 * 1.5 }
  };

  // Build a basis vector e_i as an 8-component octonion.
  function basisVec(i, sign) {
    var v = zeroOf(8);
    v[i] = (sign === undefined) ? 1 : sign;
    return v;
  }

  // Pretty-print ±e_i.
  function basisLabel(idx, sign) {
    var prefix = (sign < 0) ? '\u2212' : '';
    return prefix + 'e' + idx;
  }

  // ───────────────────────────────────────────── Cayley-Dickson steps ─────
  // Explode a single doubled product so the B2 game can show each factor.
  // Both p1 and p2 must be vectors of the same even length (≥ 2).
  //
  // Returns (matching the Baez formula ac − conj(d)·b, d·a + b·conj(c)):
  //   {
  //     level,                // total dimension n (2, 4, or 8)
  //     a, b, c, d,           // the two halves of each input, each length n/2
  //     conjB, conjC, conjD,  // conjugates at the parent level
  //     ac, conjDb,           // sub-products contributing to the first half
  //     da, bConjC,           // sub-products contributing to the second half
  //     first, second,        // ac − conj(d)·b   and   d·a + b·conj(c)
  //     result                // concatenation of first and second
  //   }

  function cdSteps(p1, p2) {
    var n = p1.length;
    var half = n / 2;
    var a = p1.slice(0, half);
    var b = p1.slice(half);
    var c = p2.slice(0, half);
    var d = p2.slice(half);

    var ac, conjDb, da, bConjC, first, second;

    if (half === 1) {
      var aS = a[0], bS = b[0], cS = c[0], dS = d[0];
      ac = aS * cS;
      conjDb = dS * bS;           // conj of a real is itself
      da = dS * aS;
      bConjC = bS * cS;
      first = [ac - conjDb];
      second = [da + bConjC];
    } else {
      ac = cdMul(a, c);
      conjDb = cdMul(conjugate(d), b);
      da = cdMul(d, a);
      bConjC = cdMul(b, conjugate(c));
      first = sub(ac, conjDb);
      second = add(da, bConjC);
    }

    var result = (half === 1)
      ? [first[0], second[0]]
      : first.concat(second);

    return {
      level: n,
      a: a, b: b, c: c, d: d,
      conjB: conjugate(b),
      conjC: conjugate(c),
      conjD: conjugate(d),
      ac: (half === 1) ? [ac] : ac,
      conjDb: (half === 1) ? [conjDb] : conjDb,
      da: (half === 1) ? [da] : da,
      bConjC: (half === 1) ? [bConjC] : bConjC,
      first: first,
      second: second,
      result: result
    };
  }

  // ───────────────────────────────────────────── Octavian units ─────
  // The 240 octavian integer units realized as E8 roots (norm² = 2):
  //   112 "integer" roots: ±e_i ± e_j for 0 ≤ i < j ≤ 7
  //   128 "half-integer" roots: (±½, ±½, ..., ±½) with even minus count
  //
  // All 240 are closed under multiplication (as octonion units after the
  // usual rescaling x ↦ x/√2). Here we keep them at the natural E8 scale
  // so coordinates are {0, ±½, ±1} and the lattice arithmetic stays tidy.

  function buildOctavianUnits() {
    var units = [];
    // Integer family: 28 pairs × 4 sign combinations = 112
    for (var i = 0; i < 8; i++) {
      for (var j = i + 1; j < 8; j++) {
        var signs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (var s = 0; s < 4; s++) {
          var v = zeroOf(8);
          v[i] = signs[s][0];
          v[j] = signs[s][1];
          units.push(v);
        }
      }
    }
    // Half-integer family: 2^8 sign patterns, keep the 128 with even minus count
    for (var mask = 0; mask < 256; mask++) {
      var minusCount = 0;
      var bits = [];
      for (var k = 0; k < 8; k++) {
        var bit = (mask >> k) & 1;
        bits.push(bit);
        if (bit) minusCount++;
      }
      if (minusCount % 2 !== 0) continue;
      var hv = [];
      for (var k2 = 0; k2 < 8; k2++) hv.push(bits[k2] ? -0.5 : 0.5);
      units.push(hv);
    }
    return units;
  }

  var OCTAVIAN_UNITS = buildOctavianUnits();

  function octNormSq(v) {
    var s = 0;
    for (var i = 0; i < v.length; i++) s += v[i] * v[i];
    return s;
  }

  function approxEqual(a, b) { return Math.abs(a - b) < 1e-9; }

  function isHalfInt(x) { return approxEqual(Math.abs(x), 0.5); }

  function isIntCoord(x) {
    return approxEqual(x, Math.round(x));
  }

  // isUnit(v) — true iff v is one of the 240 octavian integer units.
  function isOctavianUnit(v) {
    if (!v || v.length !== 8) return false;
    if (!approxEqual(octNormSq(v), 2)) return false;
    // Decide the family: all integer coords vs all half-integer coords.
    var allInt = true;
    var allHalf = true;
    for (var i = 0; i < 8; i++) {
      if (!isIntCoord(v[i])) allInt = false;
      if (!isHalfInt(v[i])) allHalf = false;
    }
    if (allInt) {
      // Must have exactly two ±1 entries and six zeros.
      var nonzero = 0;
      for (var j = 0; j < 8; j++) {
        if (!approxEqual(v[j], 0)) {
          nonzero++;
          if (!(approxEqual(v[j], 1) || approxEqual(v[j], -1))) return false;
        }
      }
      return nonzero === 2;
    }
    if (allHalf) {
      // Every coordinate is ±½ and the minus count is even.
      var minus = 0;
      for (var k = 0; k < 8; k++) {
        if (v[k] < 0) minus++;
      }
      return (minus % 2) === 0;
    }
    return false;
  }

  // classify(v) — pedagogical breakdown for the "why / why not" panel.
  // Returns { valid, family, reason }. family is one of:
  //   'integer' — a D8-type root ±e_i ± e_j
  //   'half'    — a half-integer root (128 family)
  //   'mixed'   — has both integer and half-integer entries (illegal)
  //   'wrong-norm'      — coords are legal shape, length is wrong
  //   'wrong-parity'    — half-integer vector with odd minus count
  //   'wrong-support'   — integer vector with the wrong number of nonzeros
  //   'wrong-magnitude' — integer vector with a ±2 or other spike
  //   'other'           — doesn't match any family at all
  function classifyOctavian(v) {
    if (!v || v.length !== 8) return { valid: false, family: 'other', reason: 'not an 8-vector' };

    var allInt = true;
    var allHalf = true;
    for (var i = 0; i < 8; i++) {
      if (!isIntCoord(v[i])) allInt = false;
      if (!isHalfInt(v[i])) allHalf = false;
    }

    if (allInt && allHalf) {
      // Only possible if every coord is 0 (which isn't half-integer either),
      // so this branch is effectively unreachable, but stays defensive.
      return { valid: false, family: 'other', reason: 'zero vector' };
    }

    if (!allInt && !allHalf) {
      return {
        valid: false,
        family: 'mixed',
        reason: 'coordinates mix integer and half-integer entries; E8 roots can\u2019t'
      };
    }

    var nsq = octNormSq(v);

    if (allInt) {
      var nonzero = 0;
      var magOk = true;
      var anyTwo = false;
      for (var j = 0; j < 8; j++) {
        if (!approxEqual(v[j], 0)) {
          nonzero++;
          if (!(approxEqual(v[j], 1) || approxEqual(v[j], -1))) {
            magOk = false;
            if (approxEqual(Math.abs(v[j]), 2)) anyTwo = true;
          }
        }
      }
      if (!magOk) {
        return {
          valid: false,
          family: anyTwo ? 'wrong-magnitude' : 'wrong-magnitude',
          reason: 'integer roots of E8 use only coordinates in {0, \u00b11}'
        };
      }
      if (nonzero !== 2) {
        return {
          valid: false,
          family: 'wrong-support',
          reason: 'integer E8 roots have exactly two nonzero coordinates, not ' + nonzero
        };
      }
      if (!approxEqual(nsq, 2)) {
        return { valid: false, family: 'wrong-norm', reason: '|v|\u00b2 = ' + nsq + ', not 2' };
      }
      return { valid: true, family: 'integer', reason: 'D\u2088-type root \u00b1e_i\u00b1e_j' };
    }

    // allHalf
    if (!approxEqual(nsq, 2)) {
      return { valid: false, family: 'wrong-norm', reason: '|v|\u00b2 = ' + nsq + ', not 2' };
    }
    var minus = 0;
    for (var k = 0; k < 8; k++) if (v[k] < 0) minus++;
    if ((minus % 2) !== 0) {
      return {
        valid: false,
        family: 'wrong-parity',
        reason: 'half-integer roots need an even number of minus signs; this has ' + minus
      };
    }
    return { valid: true, family: 'half', reason: 'half-integer root with even minus count' };
  }

  // Random non-unit "trap" generators for drill variety. Each one produces
  // an 8-vector that is *not* an octavian unit and falls into a specific
  // failure family, so B3 can serve a balanced mix of traps.
  function randSign() { return Math.random() < 0.5 ? -1 : 1; }
  function randInt(n) { return Math.floor(Math.random() * n); }

  function trapWrongSupport() {
    var v = zeroOf(8);
    var nonzero = [1, 3, 4][randInt(3)]; // one of 1, 3, 4 nonzeros
    var positions = [];
    while (positions.length < nonzero) {
      var p = randInt(8);
      if (positions.indexOf(p) < 0) positions.push(p);
    }
    for (var i = 0; i < positions.length; i++) v[positions[i]] = randSign();
    return v;
  }

  function trapWrongMagnitude() {
    var v = zeroOf(8);
    var i = randInt(8);
    var j = randInt(8);
    while (j === i) j = randInt(8);
    v[i] = 2 * randSign();
    v[j] = randSign();
    return v;
  }

  function trapWrongParity() {
    // Half-integer 8-vector with an odd number of minus signs.
    var minuses = [1, 3, 5, 7][randInt(4)];
    var minusSet = [];
    while (minusSet.length < minuses) {
      var p = randInt(8);
      if (minusSet.indexOf(p) < 0) minusSet.push(p);
    }
    var v = [];
    for (var k = 0; k < 8; k++) v.push(minusSet.indexOf(k) >= 0 ? -0.5 : 0.5);
    return v;
  }

  function trapMixed() {
    var v = zeroOf(8);
    // Make a legal integer root and then spoil one coord into a ½.
    var i = randInt(8);
    var j = randInt(8);
    while (j === i) j = randInt(8);
    v[i] = randSign();
    v[j] = 0.5 * randSign();
    return v;
  }

  function trapWrongNormIntegers() {
    // All integer, nonzeros ∈ {0, ±1}, but wrong count (3 or 4).
    var nonzero = Math.random() < 0.5 ? 3 : 4;
    var v = zeroOf(8);
    var positions = [];
    while (positions.length < nonzero) {
      var p = randInt(8);
      if (positions.indexOf(p) < 0) positions.push(p);
    }
    for (var q = 0; q < positions.length; q++) v[positions[q]] = randSign();
    return v;
  }

  // Pick a random trap — one that deliberately fails a specific check.
  var TRAP_GENERATORS = [
    trapWrongSupport,
    trapWrongMagnitude,
    trapWrongParity,
    trapMixed,
    trapWrongNormIntegers
  ];

  function randomTrap() {
    return TRAP_GENERATORS[randInt(TRAP_GENERATORS.length)]();
  }

  function randomUnit() {
    return OCTAVIAN_UNITS[randInt(OCTAVIAN_UNITS.length)].slice();
  }

  // ───────────────────────────────────────────── API surface ─────

  var OCT = {
    real: {
      mul: function (a, b) { return a * b; },
      conj: function (a) { return a; },
      normSq: function (a) { return a * a; }
    },

    complex: {
      mul: function (a, b) { return cdMul(a, b); },
      conj: function (a) { return conjugate(a); },
      normSq: function (a) { return a[0] * a[0] + a[1] * a[1]; }
    },

    quat: {
      mul: function (a, b) { return cdMul(a, b); },
      conj: function (a) { return conjugate(a); },
      normSq: function (a) {
        var s = 0;
        for (var i = 0; i < 4; i++) s += a[i] * a[i];
        return s;
      }
    },

    oct: {
      mul: function (a, b) { return cdMul(a, b); },
      conj: function (a) { return conjugate(a); },
      normSq: function (a) {
        var s = 0;
        for (var i = 0; i < 8; i++) s += a[i] * a[i];
        return s;
      },
      cross: function (a, b) {
        var p = cdMul(a, b);
        var res = p.slice();
        res[0] = 0;
        return res;
      },
      // Fano-based basis multiplication: matches the cyclic convention
      // used in octonion series explainer #04. Returns {idx, sign}.
      basisMul: fanoProduct,
      basisVec: basisVec,
      basisLabel: basisLabel
    },

    cd: cdMul,
    cdSteps: cdSteps,

    fano: {
      lines: FANO_LINES,
      layout: FANO_LAYOUT,
      lineContaining: fanoLineContaining,
      product: fanoProduct,
      signedProduct: fanoSignedProduct,
      table: fanoTable
    },

    octavian: {
      units: OCTAVIAN_UNITS,
      isUnit: isOctavianUnit,
      classify: classifyOctavian,
      randomUnit: randomUnit,
      randomTrap: randomTrap,
      traps: {
        wrongSupport: trapWrongSupport,
        wrongMagnitude: trapWrongMagnitude,
        wrongParity: trapWrongParity,
        mixed: trapMixed,
        wrongNormIntegers: trapWrongNormIntegers
      }
    },

    utils: {
      conjugate: conjugate,
      add: add,
      sub: sub,
      scale: scale,
      zeroOf: zeroOf,
      dot: function (a, b) {
        var s = 0;
        for (var i = 0; i < a.length; i++) s += a[i] * b[i];
        return s;
      },
      normSq: octNormSq,
      norm: function (v) { return Math.sqrt(octNormSq(v)); }
    }
  };

  // ───────────────────────────────────────────── sanity checks ─────
  function runChecks() {
    var errors = [];

    // Fano: all 7 lines close cyclically.
    for (var l = 0; l < FANO_LINES.length; l++) {
      var line = FANO_LINES[l];
      var ab = fanoProduct(line[0], line[1]);
      var bc = fanoProduct(line[1], line[2]);
      var ca = fanoProduct(line[2], line[0]);
      if (!ab || ab.idx !== line[2] || ab.sign !== 1)
        errors.push('fano line ' + line + ' broke at a*b');
      if (!bc || bc.idx !== line[0] || bc.sign !== 1)
        errors.push('fano line ' + line + ' broke at b*c');
      if (!ca || ca.idx !== line[1] || ca.sign !== 1)
        errors.push('fano line ' + line + ' broke at c*a');
      var ba = fanoProduct(line[1], line[0]);
      if (!ba || ba.idx !== line[2] || ba.sign !== -1)
        errors.push('fano line ' + line + ' broke at b*a');
    }

    // Anti-commutativity check on every off-diagonal pair.
    for (var i = 1; i < 8 && errors.length < 10; i++) {
      for (var j = 1; j < 8; j++) {
        if (i === j) continue;
        var pij = fanoProduct(i, j);
        var pji = fanoProduct(j, i);
        if (!pij || !pji || pij.idx !== pji.idx || pij.sign !== -pji.sign) {
          errors.push('fano anticommute broke at e' + i + ',e' + j);
          break;
        }
      }
    }

    // Self-square: e_i * e_i = -e_0 for i >= 1.
    for (var m = 1; m < 8; m++) {
      var ss = fanoProduct(m, m);
      if (!ss || ss.idx !== 0 || ss.sign !== -1) {
        errors.push('e' + m + '\u00b2 != -1');
      }
    }

    // Octavian units: exactly 240, all with norm² = 2, closed under isUnit.
    if (OCTAVIAN_UNITS.length !== 240) {
      errors.push('octavian unit count ' + OCTAVIAN_UNITS.length + ' != 240');
    }
    for (var u = 0; u < OCTAVIAN_UNITS.length; u++) {
      if (!approxEqual(octNormSq(OCTAVIAN_UNITS[u]), 2)) {
        errors.push('unit ' + u + ' has wrong norm');
        break;
      }
      if (!isOctavianUnit(OCTAVIAN_UNITS[u])) {
        errors.push('unit ' + u + ' rejected by isUnit');
        break;
      }
    }

    // cdSteps reality check: ensure its `result` equals cdMul(p1, p2).
    var e1o = basisVec(1), e2o = basisVec(2);
    var steps = cdSteps(e1o, e2o);
    var direct = cdMul(e1o, e2o);
    for (var t = 0; t < 8; t++) {
      if (!approxEqual(steps.result[t], direct[t])) {
        errors.push('cdSteps.result != cdMul at coord ' + t);
        break;
      }
    }

    if (errors.length === 0) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('[OCT] sanity checks passed');
      }
    } else if (typeof console !== 'undefined' && console.error) {
      console.error('[OCT] sanity checks FAILED:', errors);
    }
    return errors;
  }

  OCT._runChecks = runChecks;
  global.OCT = OCT;
  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
