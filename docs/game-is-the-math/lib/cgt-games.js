// cgt-games.js — game engines for combinatorial game theory.
//
// Loaded after cgt-math.js. Each game exports a common interface:
//   { options(pos), isTerminal(pos), optimalMove(pos, opts), ... }
// Game-specific methods may be added as needed.
//
// Act I engines: Nim (full strategy under normal and misère play).
// Later phases add Hackenbush, Domineering, Hex, etc.

(function (global) {
  'use strict';

  if (!global.CGT) {
    throw new Error('[CGT] cgt-games.js must be loaded after cgt-math.js');
  }

  var CGT = global.CGT;

  // ───────────────────────────────────────────── Nim ─────
  // Position: an array of non-negative integers (heap sizes).
  // Move: pick a heap index and a take count in [1, heap size].

  var nim = {
    // All positions reachable by a single legal move.
    options: function (pos) {
      var opts = [];
      for (var i = 0; i < pos.length; i++) {
        for (var k = 1; k <= pos[i]; k++) {
          var next = pos.slice();
          next[i] = pos[i] - k;
          opts.push(next);
        }
      }
      return opts;
    },

    isTerminal: function (pos) {
      for (var i = 0; i < pos.length; i++) {
        if (pos[i] > 0) return false;
      }
      return true;
    },

    // Nim sum of heap sizes. Zero iff the position is losing under normal play.
    xorValue: function (pos) {
      return CGT.math.xor(pos);
    },

    // Apply a move: return the resulting position (does not mutate).
    applyMove: function (pos, heapIdx, take) {
      var next = pos.slice();
      next[heapIdx] = pos[heapIdx] - take;
      return next;
    },

    // Optimal move under the selected convention. Returns {heap, take, next}
    // or null if no move is legal.
    //
    //   opts.convention: 'normal' (default) or 'misere'
    optimalMove: function (pos, opts) {
      var convention = (opts && opts.convention) || 'normal';
      if (convention === 'normal') return optimalMoveNormal(pos);
      if (convention === 'misere') return optimalMoveMisere(pos);
      throw new Error('[CGT] unknown Nim convention: ' + convention);
    }
  };

  function optimalMoveNormal(pos) {
    var s = CGT.math.xor(pos);
    if (s === 0) {
      // Losing: play any legal move (take one from first nonzero heap).
      for (var i = 0; i < pos.length; i++) {
        if (pos[i] > 0) {
          var next = pos.slice();
          next[i] -= 1;
          return { heap: i, take: 1, next: next };
        }
      }
      return null;
    }
    // Winning: find heap whose XOR with s is strictly less than it.
    for (var i = 0; i < pos.length; i++) {
      var target = pos[i] ^ s;
      if (target < pos[i]) {
        var next = pos.slice();
        next[i] = target;
        return { heap: i, take: pos[i] - target, next: next };
      }
    }
    return null;
  }

  function optimalMoveMisere(pos) {
    var bigCount = 0;
    var ones = 0;
    for (var i = 0; i < pos.length; i++) {
      if (pos[i] >= 2) bigCount++;
      else if (pos[i] === 1) ones++;
    }

    // All-ones endgame: winning iff ones is even; take a 1 to leave ones−1.
    if (bigCount === 0) {
      for (var i = 0; i < pos.length; i++) {
        if (pos[i] === 1) {
          var next = pos.slice();
          next[i] = 0;
          return { heap: i, take: 1, next: next };
        }
      }
      return null;
    }

    var s = CGT.math.xor(pos);

    // Losing position (n >= 1 and xor = 0): play any move.
    if (s === 0) {
      for (var i = 0; i < pos.length; i++) {
        if (pos[i] > 0) {
          var next = pos.slice();
          next[i] -= 1;
          return { heap: i, take: 1, next: next };
        }
      }
      return null;
    }

    // Winning with multiple big heaps: play normal Nim strategy.
    if (bigCount >= 2) {
      for (var i = 0; i < pos.length; i++) {
        var target = pos[i] ^ s;
        if (target < pos[i]) {
          var next = pos.slice();
          next[i] = target;
          return { heap: i, take: pos[i] - target, next: next };
        }
      }
      return null;
    }

    // Exactly one big heap. Try to make XOR zero while keeping it big;
    // otherwise reduce the big heap so that all-ones has odd count.
    var bigIdx = -1;
    for (var i = 0; i < pos.length; i++) {
      if (pos[i] >= 2) { bigIdx = i; break; }
    }
    var target = pos[bigIdx] ^ s;
    if (target >= 2 && target < pos[bigIdx]) {
      var next = pos.slice();
      next[bigIdx] = target;
      return { heap: bigIdx, take: pos[bigIdx] - target, next: next };
    }
    // Reduce the big heap so that resulting all-ones configuration has
    // an odd number of 1s (which is losing for the opponent under misère).
    var targetValue = (ones % 2 === 1) ? 0 : 1;
    var next = pos.slice();
    next[bigIdx] = targetValue;
    return { heap: bigIdx, take: pos[bigIdx] - targetValue, next: next };
  }

  CGT.games.nim = nim;

  // ───────────────────────────────────────────── sanity checks ─────
  function runChecks() {
    var errors = [];

    // Nim: terminal detection
    if (!nim.isTerminal([0, 0, 0])) errors.push('Nim isTerminal([0,0,0]) should be true');
    if (nim.isTerminal([1, 0, 0])) errors.push('Nim isTerminal([1,0,0]) should be false');

    // Nim: XOR
    if (nim.xorValue([3, 5, 7]) !== 1) errors.push('Nim (3,5,7) xor should be 1');
    if (nim.xorValue([2, 2]) !== 0) errors.push('Nim (2,2) xor should be 0');

    // Nim normal optimal move from (3, 5, 7): all three heaps have a valid
    // XOR-zeroing move; verify we return one that makes XOR zero.
    var m = nim.optimalMove([3, 5, 7]);
    if (!m || nim.xorValue(m.next) !== 0) {
      errors.push('Nim normal optimal move from (3,5,7) should result in xor=0, got ' + (m ? m.next.join(',') : 'null'));
    }

    // Nim normal from (1,2,3): xor=0, losing. Any move is equally bad; just verify we return something.
    var m2 = nim.optimalMove([1, 2, 3]);
    if (!m2 || !m2.next) errors.push('Nim normal should return a move from losing position');

    // Nim misère from (1): single 1. bigCount=0, ones=1 odd → losing. Take the 1, lose.
    var m3 = nim.optimalMove([1], { convention: 'misere' });
    if (!m3 || m3.next.join(',') !== '0') errors.push('Nim misère from (1) should take the 1');

    // Nim misère from (2, 1): bigCount=1, ones=1 odd. xor=3 != 0.
    // Option: reduce heap 0 to target=2^3=1, but 1 < 2, so we could make XOR=0 by (1,1).
    // BUT target=1 < 2, so we skip option (b). Option (a): ones odd → targetValue = 0.
    // Move: reduce heap 0 to 0, leaving (0, 1). That's losing for opponent (m=1 odd).
    var m4 = nim.optimalMove([2, 1], { convention: 'misere' });
    if (!m4 || m4.next.join(',') !== '0,1') {
      errors.push('Nim misère from (2,1) should move to (0,1), got ' + (m4 ? m4.next.join(',') : 'null'));
    }

    // Nim misère from (3, 1, 1): bigCount=1, ones=2 even. xor=3.
    // Target=3^3=0, not >= 2, skip option (b). Option (a): ones even → targetValue=1.
    // Reduce heap 0 from 3 to 1, leaving (1,1,1). m=3 odd → losing for opponent.
    var m5 = nim.optimalMove([3, 1, 1], { convention: 'misere' });
    if (!m5 || m5.next.join(',') !== '1,1,1') {
      errors.push('Nim misère from (3,1,1) should move to (1,1,1), got ' + (m5 ? m5.next.join(',') : 'null'));
    }

    if (errors.length === 0) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('[CGT] cgt-games.js sanity checks passed (Nim normal + misère)');
      }
    } else if (typeof console !== 'undefined' && console.error) {
      console.error('[CGT] cgt-games.js sanity checks FAILED:', errors);
    }
    return errors;
  }

  CGT.games._runChecks = runChecks;
  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
