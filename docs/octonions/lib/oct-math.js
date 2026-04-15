// oct-math.js — math engine for "The Last Algebra: A Tour of the Octonions"
//
// Attaches a single `OCT` object to the global scope.
// Implements R, C, H, O using the Cayley-Dickson recursive doubling recipe.
//
// Basis convention for Octonions: e0, e1, e2, e3, e4, e5, e6, e7
// e0 is the real unit.
// Fano Plane (1,2,3) cycle: e1*e2 = e3, etc. (cyclic convention from Baez,
// "The Octonions" Bull. AMS 2002). The doubling formula below is the Baez
// sign variant, which is the specific Cayley-Dickson formulation under
// which the cyclic Fano triples on e_1..e_7 give +e_k rather than -e_k.

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
  // Baez convention: (a, b)(c, d) = (ac - conj(d)*b, d*a + b*conj(c))
  //
  // This is the specific Cayley-Dickson sign convention under which the
  // cyclic Fano triples on e_1..e_7 listed in explainer #04 give +e_k
  // along the cyclic direction (rather than -e_k). Other common choices
  // in the literature differ by an anti-isomorphism — they produce an
  // isomorphic algebra but flip basis-product signs.

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
    oct: {
      mul: function(a, b) { return cdMul(a, b); },
      conj: function(a) { return conjugate(a); },
      normSq: function(a) {
        var s = 0;
        for(var i=0; i<8; i++) s += a[i]*a[i];
        return s;
      },
      // 7D Cross product of purely imaginary octonions
      cross: function(a, b) {
        // Ensure they are 8D and purely imaginary (a0=0, b0=0)
        var p = cdMul(a, b);
        var res = p.slice();
        res[0] = 0; // Purely imaginary part
        return res;
      }
    },

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
