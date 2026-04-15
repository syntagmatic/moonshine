// cgt-math.js — combinatorial game theory primitives.
//
// Attaches a single `CGT` object to the global scope. No modules, no build step.
// Loads before cgt-games.js; game engines populate `CGT.games.*`.
//
// Primitives exposed (as CGT.math.*):
//   - mex(set)              — minimum excludant (smallest non-negative int not in set)
//   - xor(values)           — bitwise XOR fold (Nim sum for integer heaps)
//   - grundyValue(pos, fn)  — recursive Grundy value via mex on options
//
// Later explainers (surreal numbers, temperature, partizan game sums) will
// extend CGT.math with their own primitives.

(function (global) {
  'use strict';

  // ───────────────────────────────────────────── mex ─────
  // Minimum excludant of a set of non-negative integers.
  //   mex(∅)        = 0
  //   mex({1, 2})   = 0
  //   mex({0, 1, 2}) = 3
  function mex(set) {
    var s;
    if (set instanceof Set) {
      s = set;
    } else {
      s = new Set();
      for (var i = 0; i < set.length; i++) s.add(set[i]);
    }
    var k = 0;
    while (s.has(k)) k++;
    return k;
  }

  // ───────────────────────────────────────────── xor fold ─────
  // Nim sum of an array of non-negative integers.
  //   xor([3, 5, 7]) = 3 ^ 5 ^ 7 = 1
  function xor(values) {
    var r = 0;
    for (var i = 0; i < values.length; i++) r ^= values[i];
    return r;
  }

  // ───────────────────────────────────────────── Grundy value ─────
  // Recursive Grundy value: G(x) = mex{G(y) : y ∈ options(x)}.
  // Uses a memoization map keyed by stable position serialization.
  //
  //   position: any JSON-serializable value
  //   optionsFn: function(position) → array of next positions
  //   cache: optional Map for memoization across calls
  function grundyValue(position, optionsFn, cache) {
    cache = cache || new Map();
    var key = JSON.stringify(position);
    if (cache.has(key)) return cache.get(key);
    var opts = optionsFn(position);
    var childValues = [];
    for (var i = 0; i < opts.length; i++) {
      childValues.push(grundyValue(opts[i], optionsFn, cache));
    }
    var v = mex(childValues);
    cache.set(key, v);
    return v;
  }

  // ───────────────────────────────────────────── sanity checks ─────
  function runChecks() {
    var errors = [];

    // mex
    if (mex([]) !== 0) errors.push('mex([]) should be 0');
    if (mex([0, 1, 2]) !== 3) errors.push('mex([0,1,2]) should be 3');
    if (mex([1, 2]) !== 0) errors.push('mex([1,2]) should be 0');
    if (mex([0, 2, 3]) !== 1) errors.push('mex([0,2,3]) should be 1');

    // xor
    if (xor([3, 5, 7]) !== 1) errors.push('xor([3,5,7]) should be 1');
    if (xor([1, 2, 3]) !== 0) errors.push('xor([1,2,3]) should be 0');
    if (xor([]) !== 0) errors.push('xor([]) should be 0');

    // Grundy value of a "subtraction game" where you can remove 1 or 2 tokens:
    // positions 0, 1, 2, 3, 4, ... with options {n-1, n-2} (if valid).
    // Values: G(0)=0, G(1)=mex{G(0)}=1, G(2)=mex{G(1),G(0)}=2, G(3)=mex{G(2),G(1)}=0,
    //         G(4)=mex{G(3),G(2)}=1, G(5)=mex{G(4),G(3)}=2, ... period 3: 0,1,2.
    var subtractionOptions = function (n) {
      var o = [];
      if (n >= 1) o.push(n - 1);
      if (n >= 2) o.push(n - 2);
      return o;
    };
    var expected = [0, 1, 2, 0, 1, 2, 0, 1, 2];
    for (var n = 0; n < 9; n++) {
      var g = grundyValue(n, subtractionOptions, new Map());
      if (g !== expected[n]) {
        errors.push('Grundy(subtraction, n=' + n + ') = ' + g + ', expected ' + expected[n]);
      }
    }

    if (errors.length === 0) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('[CGT] cgt-math.js sanity checks passed (mex, xor, grundyValue)');
      }
    } else if (typeof console !== 'undefined' && console.error) {
      console.error('[CGT] cgt-math.js sanity checks FAILED:', errors);
    }
    return errors;
  }

  // ───────────────────────────────────────────── public API ─────
  var CGT = {
    math: {
      mex: mex,
      xor: xor,
      grundyValue: grundyValue
    },
    games: {},  // populated by cgt-games.js
    _runChecks: runChecks
  };

  global.CGT = CGT;
  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
