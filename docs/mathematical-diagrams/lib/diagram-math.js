// diagram-math.js — Computational engine for the Mathematical Diagrams series.
// Attaches a single `Diag` object to the global scope.
// No modules, no build step. Works alongside the D3 + KaTeX stack.
//
// Public sections
// ---------------
//   Diag.braid        Braid word operations
//   Diag.knot         Knot diagram helpers
//   Diag.commDiag     Commutative diagram presets and path checks
//   Diag.fmt          Formatting helpers

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── helpers ──

  function arrEq(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) { if (a[i] !== b[i]) return false; }
    return true;
  }

  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }

  function factorial(n) { var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }

  function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

  // ─────────────────────────────────────────── braid ──

  var braid = {
    // A braid word is an array of integers: +i means σ_i (strand i over i+1),
    // -i means σ_i^{-1} (strand i+1 over i).

    // Compute the permutation a braid induces (forget over/under)
    permutation: function (word, n) {
      var perm = range(n);
      word.forEach(function (sigma) {
        var i = Math.abs(sigma) - 1;
        var tmp = perm[i]; perm[i] = perm[i + 1]; perm[i + 1] = tmp;
      });
      return perm;
    },

    // Cancel adjacent σ_i σ_i^{-1} pairs
    cancel: function (word) {
      var changed = true;
      var w = word.slice();
      while (changed) {
        changed = false;
        for (var i = 0; i < w.length - 1; i++) {
          if (w[i] + w[i + 1] === 0 && Math.abs(w[i]) === Math.abs(w[i + 1])) {
            w.splice(i, 2);
            changed = true;
            break;
          }
        }
      }
      return w;
    },

    // Apply a single Yang-Baxter move: σ_i σ_{i+1} σ_i = σ_{i+1} σ_i σ_{i+1}
    // Returns null if not applicable at position pos
    yangBaxter: function (word, pos) {
      if (pos + 2 >= word.length) return null;
      var a = word[pos], b = word[pos + 1], c = word[pos + 2];
      // Check: |a| and |c| same, |b| = |a| ± 1, all same sign pattern
      if (a === c && Math.abs(Math.abs(b) - Math.abs(a)) === 1 &&
          ((a > 0 && b > 0 && c > 0) || (a < 0 && b < 0 && c < 0))) {
        var w = word.slice();
        w[pos] = b;
        w[pos + 1] = a;
        w[pos + 2] = b;
        return w;
      }
      return null;
    },

    // Simplify by repeated cancellation
    simplify: function (word) {
      return braid.cancel(word);
    },

    // Format a braid word as a string
    format: function (word) {
      if (word.length === 0) return 'e';
      return word.map(function (s) {
        var i = Math.abs(s);
        var sub = String.fromCharCode(0x2080 + i);
        return s > 0 ? 'σ' + sub : 'σ' + sub + '⁻¹';
      }).join(' ');
    },

    // Compute the strand paths for rendering
    strandPaths: function (word, n) {
      // Each crossing occupies a vertical "slot"
      // Track where each strand is at each step
      var positions = [range(n)]; // initial positions
      word.forEach(function (sigma) {
        var prev = positions[positions.length - 1].slice();
        var i = Math.abs(sigma) - 1;
        var tmp = prev[i]; prev[i] = prev[i + 1]; prev[i + 1] = tmp;
        positions.push(prev);
      });
      return positions;
    }
  };

  // ─────────────────────────────────────────── knot ──

  var knot = {
    // Writhe: sum of crossing signs (+1 for positive, -1 for negative)
    writhe: function (crossings) {
      return crossings.reduce(function (s, c) { return s + c.sign; }, 0);
    },

    // Crossing number: total number of crossings
    crossingNumber: function (crossings) {
      return crossings.length;
    },

    // Preset knots as crossing sequences
    // Each crossing: { over: strandIdx, under: strandIdx, sign: +1/-1 }
    presets: {
      unknot: function () {
        return { name: 'Unknot', points: [], crossings: [] };
      },
      trefoil: function () {
        // Three-crossing trefoil
        var r = 120, cx = 0, cy = 0;
        var pts = [];
        for (var i = 0; i < 60; i++) {
          var t = (i / 60) * 2 * Math.PI;
          // Trefoil parametric curve
          var x = Math.sin(t) + 2 * Math.sin(2 * t);
          var y = Math.cos(t) - 2 * Math.cos(2 * t);
          pts.push([x * 40 + 200, y * 40 + 160]);
        }
        return {
          name: 'Trefoil (3₁)',
          points: pts,
          crossings: [
            { pos: 5, sign: 1 },
            { pos: 25, sign: 1 },
            { pos: 45, sign: 1 }
          ],
          crossingNumber: 3
        };
      },
      figureEight: function () {
        var pts = [];
        for (var i = 0; i < 80; i++) {
          var t = (i / 80) * 2 * Math.PI;
          var x = (2 + Math.cos(2 * t)) * Math.cos(3 * t);
          var y = (2 + Math.cos(2 * t)) * Math.sin(3 * t);
          pts.push([x * 30 + 200, y * 30 + 160]);
        }
        return {
          name: 'Figure-eight (4₁)',
          points: pts,
          crossings: [
            { pos: 10, sign: 1 },
            { pos: 30, sign: -1 },
            { pos: 50, sign: 1 },
            { pos: 70, sign: -1 }
          ],
          crossingNumber: 4
        };
      },
      hopfLink: function () {
        return {
          name: 'Hopf link',
          components: 2,
          crossings: [
            { pos: 0, sign: 1 },
            { pos: 1, sign: 1 }
          ],
          crossingNumber: 2
        };
      }
    },

    // Kauffman bracket polynomial (simplified, for small knots)
    // Returns coefficients as {power: coeff} in variable A
    kauffmanBracket: function (nCrossings) {
      // For n crossings, the bracket involves 2^n states
      // Each state smooths each crossing in one of two ways
      // Simplified: return known values for small crossing numbers
      var known = {
        0: { 0: 1 },                           // unknot
        3: { 7: 1, 3: 1, '-1': -1, '-5': -1 }, // trefoil (left)
        4: { 8: -1, 4: -1, 0: 1, '-4': 1, '-8': -1 } // figure eight (approximate)
      };
      return known[nCrossings] || { 0: 1 };
    }
  };

  // ─────────────────────────────────────────── commutative diagrams ──

  var commDiag = {
    // Words are arrays of morphism labels in standard right-to-left order
    // (g ∘ f is ['g', 'f']). A relation { a: word, b: word } may be applied
    // in either direction at any position.
    rewrites: function (word, relations) {
      var out = [];
      relations.forEach(function (rel, ri) {
        [[rel.a, rel.b], [rel.b, rel.a]].forEach(function (pair) {
          var L = pair[0], R = pair[1];
          if (L.length === 0) return;
          for (var i = 0; i + L.length <= word.length; i++) {
            if (arrEq(word.slice(i, i + L.length), L)) {
              out.push({ word: word.slice(0, i).concat(R, word.slice(i + L.length)), rel: ri, at: i });
            }
          }
        });
      });
      return out;
    },

    // Breadth-first search for a chain of rewrites from word a to word b.
    // Returns the chain [{ word, rel, at }, ...] starting at a (rel = -1), or
    // null when none exists within the limits. In an acyclic diagram every
    // rewrite of a path is another path with the same ends, so the search
    // space is finite and the answer is exact; the limits only guard
    // hand-built diagrams with cycles.
    equalityChain: function (a, b, relations, opts) {
      opts = opts || {};
      var maxLen = opts.maxLen || 16, maxStates = opts.maxStates || 20000;
      var key = function (w) { return w.join('\u0001'); };
      var start = { word: a.slice(), rel: -1, at: -1, prev: null };
      var seen = {}; seen[key(a)] = true;
      var queue = [start], count = 1;
      var target = key(b);
      while (queue.length) {
        var cur = queue.shift();
        if (key(cur.word) === target) {
          var chain = [];
          for (var n = cur; n; n = n.prev) chain.unshift({ word: n.word, rel: n.rel, at: n.at });
          return chain;
        }
        var next = commDiag.rewrites(cur.word, relations);
        for (var i = 0; i < next.length; i++) {
          var k = key(next[i].word);
          if (seen[k] || next[i].word.length > maxLen) continue;
          seen[k] = true;
          if (++count > maxStates) return null;
          queue.push({ word: next[i].word, rel: next[i].rel, at: next[i].at, prev: cur });
        }
      }
      return null;
    },

    // Check if two paths compose to the same morphism (by label equality)
    // paths: array of arrays of morphism labels
    checkCommutativity: function (paths) {
      if (paths.length < 2) return true;
      // Compare all paths: composition is concatenation of labels
      var first = paths[0].join(' ∘ ');
      for (var i = 1; i < paths.length; i++) {
        if (paths[i].join(' ∘ ') !== first) return false;
      }
      return true;
    },

    // Find all directed paths between two nodes in a diagram
    findPaths: function (graph, from, to) {
      var results = [];
      function dfs(node, path, labels) {
        if (node === to) { results.push(labels.slice()); return; }
        (graph.edges[node] || []).forEach(function (edge) {
          if (path.indexOf(edge.to) === -1) {
            path.push(edge.to);
            labels.push(edge.label);
            dfs(edge.to, path, labels);
            path.pop();
            labels.pop();
          }
        });
      }
      dfs(from, [from], []);
      return results;
    },

    // Preset commutative diagrams
    presets: {
      square: function () {
        return {
          name: 'Commutative square',
          nodes: [
            { id: 'A', x: 100, y: 60, label: 'A' },
            { id: 'B', x: 300, y: 60, label: 'B' },
            { id: 'C', x: 100, y: 220, label: 'C' },
            { id: 'D', x: 300, y: 220, label: 'D' }
          ],
          arrows: [
            { from: 'A', to: 'B', label: 'f' },
            { from: 'A', to: 'C', label: 'g' },
            { from: 'B', to: 'D', label: 'g\'', style: 'plain' },
            { from: 'C', to: 'D', label: 'f\'', style: 'plain' }
          ],
          commutes: true
        };
      },
      triangle: function () {
        return {
          name: 'Factorisation triangle',
          nodes: [
            { id: 'A', x: 100, y: 60, label: 'A' },
            { id: 'B', x: 300, y: 60, label: 'B' },
            { id: 'C', x: 200, y: 220, label: 'C' }
          ],
          arrows: [
            { from: 'A', to: 'B', label: 'f' },
            { from: 'A', to: 'C', label: 'h' },
            { from: 'C', to: 'B', label: 'g' }
          ],
          commutes: true
        };
      },
      exactSequence: function () {
        return {
          name: 'Short exact sequence',
          nodes: [
            { id: '0a', x: 40, y: 140, label: '0' },
            { id: 'A', x: 140, y: 140, label: 'A' },
            { id: 'B', x: 260, y: 140, label: 'B' },
            { id: 'C', x: 380, y: 140, label: 'C' },
            { id: '0b', x: 480, y: 140, label: '0' }
          ],
          arrows: [
            { from: '0a', to: 'A', label: '', style: 'plain' },
            { from: 'A', to: 'B', label: 'f', style: 'mono' },
            { from: 'B', to: 'C', label: 'g', style: 'epi' },
            { from: 'C', to: '0b', label: '', style: 'plain' }
          ],
          commutes: null
        };
      },
      product: function () {
        return {
          name: 'Universal property of product',
          nodes: [
            { id: 'X', x: 200, y: 40, label: 'X' },
            { id: 'AxB', x: 200, y: 160, label: 'A×B' },
            { id: 'A', x: 80, y: 260, label: 'A' },
            { id: 'B', x: 320, y: 260, label: 'B' }
          ],
          arrows: [
            { from: 'X', to: 'A', label: 'p' },
            { from: 'X', to: 'B', label: 'q' },
            { from: 'X', to: 'AxB', label: '∃!h', style: 'dashed' },
            { from: 'AxB', to: 'A', label: 'π₁' },
            { from: 'AxB', to: 'B', label: 'π₂' }
          ],
          commutes: true
        };
      },
      // Two exact rows joined by vertical maps: the input to the snake lemma
      // (which then builds kernel and cokernel rows), not the lemma itself.
      // Kept under the old key so existing callers still resolve.
      snakeLemma: function () {
        return {
          name: 'Morphism of short exact sequences',
          nodes: [
            { id: '0a', x: 30, y: 80, label: '0' },
            { id: 'A', x: 130, y: 80, label: 'A' },
            { id: 'B', x: 260, y: 80, label: 'B' },
            { id: 'C', x: 390, y: 80, label: 'C' },
            { id: '0b', x: 490, y: 80, label: '0' },
            { id: '0c', x: 30, y: 220, label: '0' },
            { id: 'A2', x: 130, y: 220, label: "A'" },
            { id: 'B2', x: 260, y: 220, label: "B'" },
            { id: 'C2', x: 390, y: 220, label: "C'" },
            { id: '0d', x: 490, y: 220, label: '0' }
          ],
          arrows: [
            { from: '0a', to: 'A', label: '' },
            { from: 'A', to: 'B', label: 'f' },
            { from: 'B', to: 'C', label: 'g' },
            { from: 'C', to: '0b', label: '' },
            { from: 'A', to: 'A2', label: 'α' },
            { from: 'B', to: 'B2', label: 'β' },
            { from: 'C', to: 'C2', label: 'γ' },
            { from: '0c', to: 'A2', label: '' },
            { from: 'A2', to: 'B2', label: "f'" },
            { from: 'B2', to: 'C2', label: "g'" },
            { from: 'C2', to: '0d', label: '' }
          ],
          commutes: true
        };
      }
    }
  };

  // ─────────────────────────────────────────── fmt ──

  var fmt = {
    // Format a number with thousand separators
    group: function (n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Subscript digits
    sub: function (n) {
      return String(n).split('').map(function (c) {
        return String.fromCharCode(0x2080 + parseInt(c));
      }).join('');
    },

    // Superscript digits
    sup: function (n) {
      var map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
      return String(n).split('').map(function (c) { return map[c] || c; }).join('');
    }
  };

  // ─────────────────────────────────────────── export ──

  global.Diag = {
    braid: braid,
    knot: knot,
    commDiag: commDiag,
    fmt: fmt
  };

})(typeof window !== 'undefined' ? window : this);
