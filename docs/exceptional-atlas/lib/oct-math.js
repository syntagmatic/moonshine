// oct-math.js — math engine for "The Last Algebra: A Tour of the Octonions"
//
// Attaches a single `OCT` object to the global scope.
// Implements R, C, H, O using the Cayley-Dickson recursive doubling recipe.
//
// Basis convention for Octonions: e0, e1, e2, e3, e4, e5, e6, e7
// e0 is the real unit.
// The generic Cayley-Dickson helper below uses the recursive binary basis
// ordering, so e1*e2 = e3 in the 8D stage. The public OCT.oct product later
// uses Baez's Fano-plane basis convention, where directed lines such as
// (1,2,4) give +e_k cyclically. Keep these conventions separate.

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
    return a.map(function(x) { return x * s; });
  }

  // ───────────────────────────────────────────── Cayley-Dickson ─────
  // Cayley-Dickson convention: (a, b)(c, d) = (ac - conj(d)*b, d*a + b*conj(c)).
  // This recursive basis is useful for the doubling-machine narrative. The
  // octonion multiplication table exposed as OCT.oct.mul is the direct Baez
  // Fano table below, not this binary-basis table.

  function cdMul(p1, p2) {
    // Base case: Reals
    if (typeof p1 === 'number' && typeof p2 === 'number') {
      return p1 * p2;
    }

    // Split pairs
    var n = p1.length / 2;
    var a = p1.slice(0, n);
    var b = p1.slice(n);
    var c = p2.slice(0, n);
    var d = p2.slice(n);

    // If n=1, they are effectively numbers (Reals)
    if (n === 1) {
      a = a[0]; b = b[0]; c = c[0]; d = d[0];
    }

    // (ac - conj(d)*b)
    var term1 = sub(cdMul(a, c), cdMul(conjugate(d), b));
    // (d*a + b*conj(c))
    var term2 = add(cdMul(d, a), cdMul(b, conjugate(c)));

    // Re-assemble
    if (n === 1) return [term1, term2];
    return term1.concat(term2);
  }

  // ───────────────────────────────────────────── Specific Algebras ─────

  var OCT = {
    // Reals
    real: {
      mul: function(a, b) { return a * b; },
      conj: function(a) { return a; },
      normSq: function(a) { return a * a; }
    },

    // Complex (2D)
    complex: {
      mul: function(a, b) { return cdMul(a, b); },
      conj: function(a) { return conjugate(a); },
      normSq: function(a) { return a[0]*a[0] + a[1]*a[1]; }
    },

    // Quaternions (4D)
    quat: {
      mul: function(a, b) { return cdMul(a, b); },
      conj: function(a) { return conjugate(a); },
      normSq: function(a) { 
        var s = 0;
        for(var i=0; i<4; i++) s += a[i]*a[i];
        return s;
      }
    },

    // Octonions (8D)
    //
    // The product below uses John Baez's canonical multiplication table from
    // "The Octonions" (Bull. AMS 2002). The 7 Fano-plane triples
    //     (e_i, e_{i+1}, e_{i+3}) mod 7  for i = 1..7
    // i.e., (1,2,4), (2,3,5), (3,4,6), (4,5,7), (5,6,1), (6,7,2), (7,1,3)
    // each give e_a · e_b = +e_c cyclically (and −e_c in reverse).
    //
    // We use a direct signed lookup rather than Cayley-Dickson so the
    // Fano diagrams in explainers 09 and 10 can be drawn with Baez's
    // published layout. The generic `OCT.cd` doubling continues to use
    // Cayley-Dickson for explainer 08's "doubling machine" narrative.
    oct: (function () {
      // BAEZ_PROD[i][j] for i, j ∈ {1..7} encodes e_i·e_j:
      //   positive k ⇒ +e_k, negative k ⇒ −e_k, null ⇒ diagonal (−1).
      var BAEZ_PROD = [
        [null,   4,   7,  -2,   6,  -5,  -3],
        [  -4, null,   5,   1,  -3,   7,  -6],
        [  -7,  -5, null,   6,   2,  -4,   1],
        [   2,  -1,  -6, null,   7,   3,  -5],
        [  -6,   3,  -2,  -7, null,   1,   4],
        [   5,  -7,   4,  -3,  -1, null,   2],
        [   3,   6,  -1,   5,  -4,  -2, null]
      ];

      function octMul(a, b) {
        var r = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 8; i++) {
          if (a[i] === 0) continue;
          for (var j = 0; j < 8; j++) {
            if (b[j] === 0) continue;
            var prod = a[i] * b[j];
            if (i === 0 && j === 0)       r[0] += prod;
            else if (i === 0)             r[j] += prod;
            else if (j === 0)             r[i] += prod;
            else if (i === j)             r[0] -= prod;                // e_i·e_i = −1
            else {
              var p = BAEZ_PROD[i - 1][j - 1];
              var k = Math.abs(p);
              r[k] += (p < 0) ? -prod : prod;
            }
          }
        }
        return r;
      }

      return {
        mul: octMul,
        conj: function(a) { return conjugate(a); },
        normSq: function(a) {
          var s = 0;
          for (var i = 0; i < 8; i++) s += a[i] * a[i];
          return s;
        },
        // 7D cross product of purely imaginary octonions.
        // a × b = Im(a·b) where a, b have a[0]=b[0]=0.
        cross: function(a, b) {
          var p = octMul(a, b);
          p[0] = 0;
          return p;
        }
      };
    })(),

    // Generic Cayley-Dickson
    cd: cdMul,
    
    // Utils
    utils: {
      conjugate: conjugate,
      add: add,
      sub: sub,
      scale: scale,
      dot: function(a, b) {
        var s = 0;
        for(var i=0; i<a.length; i++) s += a[i]*b[i];
        return s;
      },
      normSq: function(v) {
        if (typeof v === 'number') return v*v;
        var s = 0;
        for(var i=0; i<v.length; i++) s += v[i]*v[i];
        return s;
      },
      norm: function(v) { return Math.sqrt(this.normSq(v)); }
    }
  };

  global.OCT = OCT;

})(typeof window !== 'undefined' ? window : globalThis);
