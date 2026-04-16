// diagram-math.js — Computational engine for the Mathematical Diagrams series.
// Attaches a single `Diag` object to the global scope.
// No modules, no build step. Works alongside the D3 + KaTeX stack.
//
// Public sections
// ---------------
//   Diag.poset        Poset and Hasse diagram construction
//   Diag.sugiyama     Layered (Sugiyama) graph layout for DAGs
//   Diag.partition     Integer partitions and Young diagrams
//   Diag.group        Finite group tables and Cayley graph data
//   Diag.braid        Braid word operations
//   Diag.knot         Knot diagram helpers
//   Diag.string       String diagram (monoidal category) helpers
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

  // ─────────────────────────────────────────── poset ──

  var poset = {
    // Build a poset from a set of elements and a list of cover relations
    // covers: [[a,b], ...] meaning a < b and no c with a < c < b
    fromCovers: function (elements, covers) {
      var idx = {};
      elements.forEach(function (e, i) { idx[e] = i; });
      // Build adjacency for transitive closure
      var n = elements.length;
      var adj = [];
      for (var i = 0; i < n; i++) { adj.push([]); }
      covers.forEach(function (c) {
        adj[idx[c[0]]].push(idx[c[1]]);
      });
      return { elements: elements, covers: covers, idx: idx, adj: adj, n: n };
    },

    // Boolean lattice 2^S for S = {1,...,k}
    boolean: function (k) {
      var elems = [];
      var total = 1 << k;
      for (var i = 0; i < total; i++) {
        var bits = [];
        for (var b = 0; b < k; b++) { if (i & (1 << b)) bits.push(b + 1); }
        elems.push({ id: i, label: '{' + bits.join(',') + '}', bits: i });
      }
      elems[0].label = '∅';
      var covers = [];
      for (var i = 0; i < total; i++) {
        for (var b = 0; b < k; b++) {
          if (!(i & (1 << b))) {
            var j = i | (1 << b);
            // Check it's a cover: j has exactly one more bit than i
            covers.push([i, j]);
          }
        }
      }
      return {
        elements: elems.map(function (e) { return e.id; }),
        labels: elems.reduce(function (m, e) { m[e.id] = e.label; return m; }, {}),
        covers: covers
      };
    },

    // Divisor lattice of n
    divisors: function (n) {
      var divs = [];
      for (var i = 1; i <= n; i++) { if (n % i === 0) divs.push(i); }
      divs.sort(function (a, b) { return a - b; });
      var covers = [];
      for (var i = 0; i < divs.length; i++) {
        for (var j = i + 1; j < divs.length; j++) {
          if (divs[j] % divs[i] === 0) {
            var ratio = divs[j] / divs[i];
            // Check it's a cover: ratio must be prime
            var isPrime = ratio > 1;
            for (var p = 2; p * p <= ratio; p++) {
              if (ratio % p === 0) { isPrime = false; break; }
            }
            if (isPrime) covers.push([divs[i], divs[j]]);
          }
        }
      }
      var labels = {};
      divs.forEach(function (d) { labels[d] = String(d); });
      return { elements: divs, labels: labels, covers: covers };
    },

    // Partition lattice of {1,...,k} (set partitions ordered by refinement)
    // Only practical for k <= 4
    partitionLattice: function (k) {
      var parts = poset._enumSetPartitions(range(k).map(function (i) { return i + 1; }));
      // Label each partition
      var labels = {};
      parts.forEach(function (p, i) {
        labels[i] = p.map(function (block) { return block.join(''); }).join('|');
      });
      // Covers: p refines q if we can merge exactly two blocks of p to get q
      var covers = [];
      for (var i = 0; i < parts.length; i++) {
        for (var j = 0; j < parts.length; j++) {
          if (i === j) continue;
          if (parts[i].length === parts[j].length + 1) {
            // Check if merging two blocks of parts[i] gives parts[j]
            if (poset._isMergeCover(parts[i], parts[j])) {
              covers.push([i, j]);
            }
          }
        }
      }
      return { elements: range(parts.length), labels: labels, covers: covers };
    },

    _enumSetPartitions: function (set) {
      if (set.length === 0) return [[]];
      if (set.length === 1) return [[[set[0]]]];
      var first = set[0];
      var rest = set.slice(1);
      var subParts = poset._enumSetPartitions(rest);
      var result = [];
      subParts.forEach(function (sp) {
        // first goes in its own block
        result.push([[first]].concat(sp.map(function (b) { return b.slice(); })));
        // first joins each existing block
        for (var i = 0; i < sp.length; i++) {
          var newPart = sp.map(function (b, j) {
            if (j === i) return [first].concat(b).sort(function (a, b) { return a - b; });
            return b.slice();
          });
          result.push(newPart);
        }
      });
      // Sort blocks within each partition, then sort partitions
      result.forEach(function (p) {
        p.sort(function (a, b) { return a[0] - b[0]; });
      });
      return result;
    },

    _isMergeCover: function (finer, coarser) {
      // Check if coarser is obtained by merging exactly two blocks of finer
      var used = new Array(finer.length);
      for (var ci = 0; ci < coarser.length; ci++) {
        var cBlock = coarser[ci];
        var cSet = {};
        cBlock.forEach(function (x) { cSet[x] = true; });
        // Find which blocks of finer make up this coarser block
        var matched = [];
        for (var fi = 0; fi < finer.length; fi++) {
          if (used[fi]) continue;
          var fBlock = finer[fi];
          var allIn = fBlock.every(function (x) { return cSet[x]; });
          if (allIn) matched.push(fi);
        }
        if (matched.length === 0) return false;
        // Check total size
        var total = 0;
        matched.forEach(function (fi) { total += finer[fi].length; });
        if (total !== cBlock.length) return false;
        matched.forEach(function (fi) { used[fi] = true; });
      }
      return true;
    },

    // Face lattice of a cube (vertices < edges < faces < cube)
    faceLattice: function () {
      // 3D cube: 8 vertices, 12 edges, 6 faces, 1 solid
      // Plus the empty face at bottom
      var elems = [];
      var labels = {};
      var id = 0;

      // Bottom element
      elems.push(id); labels[id] = '∅'; id++;

      // Vertices (corners of unit cube)
      var verts = [];
      for (var i = 0; i < 8; i++) {
        var bits = [(i >> 2) & 1, (i >> 1) & 1, i & 1];
        verts.push({ id: id, bits: bits, label: bits.join('') });
        elems.push(id); labels[id] = bits.join('');
        id++;
      }

      // Edges: pairs of vertices differing in exactly one coordinate
      var edges = [];
      for (var i = 0; i < 8; i++) {
        for (var j = i + 1; j < 8; j++) {
          var diff = 0;
          for (var d = 0; d < 3; d++) { if (verts[i].bits[d] !== verts[j].bits[d]) diff++; }
          if (diff === 1) {
            edges.push({ id: id, verts: [verts[i].id, verts[j].id] });
            elems.push(id);
            labels[id] = verts[i].label + '-' + verts[j].label;
            id++;
          }
        }
      }

      // Faces: quads sharing two fixed coordinates
      var faces = [];
      for (var axis = 0; axis < 3; axis++) {
        for (var val = 0; val < 2; val++) {
          var faceVerts = verts.filter(function (v) { return v.bits[axis] === val; });
          var faceEdges = edges.filter(function (e) {
            return faceVerts.some(function (v) { return v.id === e.verts[0]; }) &&
                   faceVerts.some(function (v) { return v.id === e.verts[1]; });
          });
          faces.push({ id: id, verts: faceVerts.map(function (v) { return v.id; }),
                        edges: faceEdges.map(function (e) { return e.id; }) });
          elems.push(id);
          var axisName = ['x', 'y', 'z'][axis];
          labels[id] = axisName + '=' + val;
          id++;
        }
      }

      // Top element (the cube itself)
      elems.push(id); labels[id] = 'cube'; var cubeId = id;

      // Covers
      var covers = [];
      // ∅ < each vertex
      verts.forEach(function (v) { covers.push([0, v.id]); });
      // vertex < edge if vertex is an endpoint
      edges.forEach(function (e) {
        e.verts.forEach(function (vid) { covers.push([vid, e.id]); });
      });
      // edge < face if edge is on the face boundary
      faces.forEach(function (f) {
        f.edges.forEach(function (eid) { covers.push([eid, f.id]); });
      });
      // face < cube
      faces.forEach(function (f) { covers.push([f.id, cubeId]); });

      return { elements: elems, labels: labels, covers: covers };
    },

    // Compute layers (ranks) via longest-path from sources
    layers: function (elements, covers) {
      var idx = {};
      elements.forEach(function (e, i) { idx[e] = i; });
      var n = elements.length;
      var inDeg = new Array(n).fill(0);
      var children = [];
      for (var i = 0; i < n; i++) children.push([]);
      covers.forEach(function (c) {
        children[idx[c[0]]].push(idx[c[1]]);
        inDeg[idx[c[1]]]++;
      });
      var rank = new Array(n).fill(0);
      // Topological sort with longest path
      var queue = [];
      for (var i = 0; i < n; i++) { if (inDeg[i] === 0) queue.push(i); }
      while (queue.length) {
        var u = queue.shift();
        children[u].forEach(function (v) {
          rank[v] = Math.max(rank[v], rank[u] + 1);
          inDeg[v]--;
          if (inDeg[v] === 0) queue.push(v);
        });
      }
      return rank;
    },

    // Up-set: all elements >= x (transitively)
    upset: function (x, elements, covers) {
      var idx = {};
      elements.forEach(function (e, i) { idx[e] = i; });
      var children = {};
      elements.forEach(function (e) { children[e] = []; });
      covers.forEach(function (c) { children[c[0]].push(c[1]); });
      var visited = {};
      var stack = [x];
      while (stack.length) {
        var u = stack.pop();
        if (visited[u]) continue;
        visited[u] = true;
        (children[u] || []).forEach(function (v) { stack.push(v); });
      }
      return Object.keys(visited).map(function (k) { return isNaN(k) ? k : Number(k); });
    },

    // Down-set: all elements <= x
    downset: function (x, elements, covers) {
      var parents = {};
      elements.forEach(function (e) { parents[e] = []; });
      covers.forEach(function (c) { parents[c[1]].push(c[0]); });
      var visited = {};
      var stack = [x];
      while (stack.length) {
        var u = stack.pop();
        if (visited[u]) continue;
        visited[u] = true;
        (parents[u] || []).forEach(function (v) { stack.push(v); });
      }
      return Object.keys(visited).map(function (k) { return isNaN(k) ? k : Number(k); });
    },

    // Check if a poset is a lattice (every pair has a join and meet)
    isLattice: function (elements, covers) {
      var n = elements.length;
      // Build reachability matrix
      var reach = [];
      for (var i = 0; i < n; i++) {
        reach.push(new Uint8Array(n));
        reach[i][i] = 1;
      }
      var idx = {};
      elements.forEach(function (e, i) { idx[e] = i; });
      covers.forEach(function (c) { reach[idx[c[0]]][idx[c[1]]] = 1; });
      // Transitive closure (Floyd-Warshall)
      for (var k = 0; k < n; k++) {
        for (var i = 0; i < n; i++) {
          for (var j = 0; j < n; j++) {
            if (reach[i][k] && reach[k][j]) reach[i][j] = 1;
          }
        }
      }
      // Check every pair has a join and meet
      for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          // Upper bounds of i and j
          var ubs = [];
          for (var k = 0; k < n; k++) {
            if (reach[i][k] && reach[j][k]) ubs.push(k);
          }
          if (ubs.length === 0) return false;
          // Join = least upper bound
          var hasJoin = ubs.some(function (u) {
            return ubs.every(function (v) { return reach[u][v]; });
          });
          if (!hasJoin) return false;

          // Lower bounds
          var lbs = [];
          for (var k = 0; k < n; k++) {
            if (reach[k][i] && reach[k][j]) lbs.push(k);
          }
          if (lbs.length === 0) return false;
          var hasMeet = lbs.some(function (l) {
            return lbs.every(function (m) { return reach[m][l]; });
          });
          if (!hasMeet) return false;
        }
      }
      return true;
    }
  };

  // ─────────────────────────────────────────── sugiyama ──
  // Simplified Sugiyama layered layout for small DAGs

  var sugiyama = {
    // Given elements, covers, and rank array, produce {x, y} positions
    // width, height: drawing dimensions; pad: margin
    layout: function (elements, covers, ranks, width, height, pad) {
      pad = pad || 40;
      var maxRank = 0;
      ranks.forEach(function (r) { maxRank = Math.max(maxRank, r); });

      // Group elements by rank
      var layers = [];
      for (var r = 0; r <= maxRank; r++) layers.push([]);
      elements.forEach(function (e, i) { layers[ranks[i]].push(i); });

      // Simple crossing reduction: barycenter method, 2 passes
      var idx = {};
      elements.forEach(function (e, i) { idx[e] = i; });
      var children = [];
      for (var i = 0; i < elements.length; i++) children.push([]);
      covers.forEach(function (c) { children[idx[c[0]]].push(idx[c[1]]); });

      for (var pass = 0; pass < 3; pass++) {
        for (var r = 1; r <= maxRank; r++) {
          var posInLayer = {};
          layers[r - 1].forEach(function (node, pos) { posInLayer[node] = pos; });
          // Sort layer r by barycenter of parents
          layers[r].sort(function (a, b) {
            var aParents = [], bParents = [];
            covers.forEach(function (c) {
              if (idx[c[1]] === a) aParents.push(posInLayer[idx[c[0]]] || 0);
              if (idx[c[1]] === b) bParents.push(posInLayer[idx[c[0]]] || 0);
            });
            var aAvg = aParents.length ? aParents.reduce(function (s, v) { return s + v; }, 0) / aParents.length : 0;
            var bAvg = bParents.length ? bParents.reduce(function (s, v) { return s + v; }, 0) / bParents.length : 0;
            return aAvg - bAvg;
          });
        }
      }

      // Assign positions
      var positions = [];
      var yScale = maxRank > 0 ? (height - 2 * pad) / maxRank : 0;
      for (var r = 0; r <= maxRank; r++) {
        var layer = layers[r];
        var layerWidth = width - 2 * pad;
        var step = layer.length > 1 ? layerWidth / (layer.length - 1) : 0;
        var offset = layer.length > 1 ? pad : width / 2;
        layer.forEach(function (nodeIdx, pos) {
          positions[nodeIdx] = {
            x: offset + pos * step,
            y: pad + r * yScale
          };
        });
      }

      return positions;
    }
  };

  // ─────────────────────────────────────────── partition ──

  var partition = {
    // Parse a partition from an array [5,3,2,1] (non-increasing)
    validate: function (parts) {
      for (var i = 1; i < parts.length; i++) {
        if (parts[i] > parts[i - 1]) return false;
      }
      return parts.every(function (p) { return p > 0 && Number.isInteger(p); });
    },

    // Sum of partition
    sum: function (parts) {
      return parts.reduce(function (s, v) { return s + v; }, 0);
    },

    // Conjugate (transpose) of a partition
    conjugate: function (parts) {
      if (parts.length === 0) return [];
      var conj = [];
      for (var j = 0; j < parts[0]; j++) {
        var count = 0;
        for (var i = 0; i < parts.length; i++) {
          if (parts[i] > j) count++; else break;
        }
        conj.push(count);
      }
      return conj;
    },

    // Hook length at position (i,j) in the diagram
    hook: function (parts, i, j) {
      if (i >= parts.length || j >= parts[i]) return 0;
      var arm = parts[i] - j - 1; // cells to the right
      var conj = partition.conjugate(parts);
      var leg = conj[j] - i - 1; // cells below
      return arm + leg + 1;
    },

    // Hook-length formula: n! / product of all hook lengths
    hookLengthCount: function (parts) {
      var n = partition.sum(parts);
      var product = 1;
      for (var i = 0; i < parts.length; i++) {
        for (var j = 0; j < parts[i]; j++) {
          product *= partition.hook(parts, i, j);
        }
      }
      return Math.round(factorial(n) / product);
    },

    // Check if a filling is a valid standard Young tableau
    isStandardTableau: function (parts, filling) {
      // filling[i][j] = number in row i, col j
      for (var i = 0; i < parts.length; i++) {
        for (var j = 0; j < parts[i]; j++) {
          var val = filling[i][j];
          if (val === undefined || val === null) return false;
          // Check row-increasing
          if (j > 0 && filling[i][j - 1] >= val) return false;
          // Check column-increasing
          if (i > 0 && j < parts[i - 1] && filling[i - 1][j] >= val) return false;
        }
      }
      return true;
    },

    // Generate all partitions of n
    enumerate: function (n) {
      var result = [];
      function recurse(remaining, maxPart, current) {
        if (remaining === 0) { result.push(current.slice()); return; }
        for (var p = Math.min(remaining, maxPart); p >= 1; p--) {
          current.push(p);
          recurse(remaining - p, p, current);
          current.pop();
        }
      }
      recurse(n, n, []);
      return result;
    },

    // Famous preset partitions
    presets: {
      staircase: function (k) {
        var p = [];
        for (var i = k; i >= 1; i--) p.push(i);
        return p;
      },
      rectangle: function (rows, cols) {
        var p = [];
        for (var i = 0; i < rows; i++) p.push(cols);
        return p;
      },
      hook: function (arm, leg) {
        var p = [arm];
        for (var i = 1; i < leg; i++) p.push(1);
        return p;
      }
    }
  };

  // ─────────────────────────────────────────── group ──
  // Small finite groups with multiplication tables and Cayley graph data

  var group = {
    // Cyclic group Z_n
    cyclic: function (n) {
      var elements = range(n);
      var labels = {};
      elements.forEach(function (e) { labels[e] = String(e); });
      var mult = function (a, b) { return (a + b) % n; };
      var inv = function (a) { return (n - a) % n; };
      return {
        name: 'ℤ' + String.fromCharCode(0x2080 + (n < 10 ? n : 0)),
        nameAscii: 'Z_' + n,
        elements: elements, labels: labels, mult: mult, inv: inv,
        generators: [1],
        generatorLabels: { 1: 'r' },
        order: n
      };
    },

    // Symmetric group S_3
    s3: function () {
      // Elements as permutations: [0,1,2], [1,0,2], [0,2,1], [2,1,0], [1,2,0], [2,0,1]
      var perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
      var labels = { 0: 'e', 1: '(23)', 2: '(12)', 3: '(132)', 4: '(123)', 5: '(13)' };
      var multTable = {};
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
          // compose: (perms[i] ∘ perms[j])(k) = perms[i][perms[j][k]]
          var comp = [perms[i][perms[j][0]], perms[i][perms[j][1]], perms[i][perms[j][2]]];
          for (var k = 0; k < 6; k++) {
            if (arrEq(comp, perms[k])) { multTable[i + ',' + j] = k; break; }
          }
        }
      }
      var mult = function (a, b) { return multTable[a + ',' + b]; };
      var inv = function (a) {
        for (var i = 0; i < 6; i++) { if (mult(a, i) === 0) return i; }
        return 0;
      };
      return {
        name: 'S₃', nameAscii: 'S_3',
        elements: range(6), labels: labels, mult: mult, inv: inv,
        generators: [2, 1], // (12) and (23)
        generatorLabels: { 2: 's₁', 1: 's₂' },
        order: 6
      };
    },

    // Dihedral group D_4 (symmetries of the square, order 8)
    d4: function () {
      // r = rotation 90°, s = reflection
      // Elements: e, r, r², r³, s, sr, sr², sr³
      var labels = { 0:'e', 1:'r', 2:'r²', 3:'r³', 4:'s', 5:'sr', 6:'sr²', 7:'sr³' };
      // r^a * r^b = r^{(a+b)%4}, s * r^a = sr^{(-a)%4} ... actually
      // D4: generated by r (rotation) and s (reflection) with r^4=e, s^2=e, srs=r^{-1}
      // Elements: r^i (i=0..3) and s*r^i (i=0..3)
      // Multiplication: r^a * r^b = r^{(a+b)%4}
      //                 r^a * sr^b = sr^{(b-a)%4}
      //                 sr^a * r^b = sr^{(a+b)%4}
      //                 sr^a * sr^b = r^{(b-a)%4} -- wait, let me be careful
      // Convention: element i: 0-3 = r^i, 4-7 = s*r^{i-4}
      // srs^{-1} = r^{-1}, so s*r = r^{-1}*s
      // Mult: (type_a, a_exp) * (type_b, b_exp)
      //   r^a * r^b = r^{(a+b)%4}
      //   r^a * s*r^b = s*r^{(b-a+4)%4}
      //   s*r^a * r^b = s*r^{(a+b)%4}
      //   s*r^a * s*r^b = r^{(a-b+4)%4}  [since s^2=e, s*r^a*s = r^{-a}]
      var mult = function (x, y) {
        var xa = x < 4, ya = y < 4;
        var xe = x % 4, ye = y % 4;
        if (xa && ya) return (xe + ye) % 4;
        if (xa && !ya) return 4 + (ye - xe + 4) % 4;
        if (!xa && ya) return 4 + (xe + ye) % 4;
        return (xe - ye + 4) % 4;
      };
      var inv = function (a) {
        if (a < 4) return (4 - a) % 4;
        return a; // reflections are self-inverse
      };
      return {
        name: 'D₄', nameAscii: 'D_4',
        elements: range(8), labels: labels, mult: mult, inv: inv,
        generators: [1, 4], // r, s
        generatorLabels: { 1: 'r', 4: 's' },
        order: 8
      };
    },

    // Klein four-group Z_2 x Z_2
    klein4: function () {
      var labels = { 0: 'e', 1: 'a', 2: 'b', 3: 'ab' };
      var mult = function (x, y) { return x ^ y; }; // XOR
      var inv = function (x) { return x; }; // every element is self-inverse
      return {
        name: 'V₄', nameAscii: 'V_4',
        elements: [0, 1, 2, 3], labels: labels, mult: mult, inv: inv,
        generators: [1, 2],
        generatorLabels: { 1: 'a', 2: 'b' },
        order: 4
      };
    },

    // Quaternion group Q_8
    q8: function () {
      // Elements: 1, -1, i, -i, j, -j, k, -k
      var labels = { 0:'1', 1:'−1', 2:'i', 3:'−i', 4:'j', 5:'−j', 6:'k', 7:'−k' };
      // Multiplication table
      var table = [
        [0,1,2,3,4,5,6,7],
        [1,0,3,2,5,4,7,6],
        [2,3,1,0,6,7,5,4],
        [3,2,0,1,7,6,4,5],
        [4,5,7,6,1,0,2,3],
        [5,4,6,7,0,1,3,2],
        [6,7,4,5,3,2,1,0],
        [7,6,5,4,2,3,0,1]
      ];
      var mult = function (a, b) { return table[a][b]; };
      var inv = function (a) {
        for (var i = 0; i < 8; i++) { if (mult(a, i) === 0) return i; }
        return 0;
      };
      return {
        name: 'Q₈', nameAscii: 'Q_8',
        elements: range(8), labels: labels, mult: mult, inv: inv,
        generators: [2, 4], // i, j
        generatorLabels: { 2: 'i', 4: 'j' },
        order: 8
      };
    },

    // Build Cayley graph edges for a group with selected generators
    cayleyEdges: function (grp, gens) {
      var edges = [];
      gens.forEach(function (gen, gi) {
        grp.elements.forEach(function (g) {
          edges.push({ from: g, to: grp.mult(g, gen), generator: gen, genIndex: gi });
        });
      });
      return edges;
    },

    // Find left cosets of a subgroup
    cosets: function (grp, subgroup) {
      var remaining = {};
      grp.elements.forEach(function (e) { remaining[e] = true; });
      var result = [];
      grp.elements.forEach(function (g) {
        if (!remaining[g]) return;
        var coset = subgroup.map(function (h) { return grp.mult(g, h); });
        coset.forEach(function (c) { delete remaining[c]; });
        result.push(coset);
      });
      return result;
    },

    // Available groups
    catalog: function () {
      return [
        { key: 'Z3', build: function () { return group.cyclic(3); }, label: 'ℤ₃ (cyclic, order 3)' },
        { key: 'Z4', build: function () { return group.cyclic(4); }, label: 'ℤ₄ (cyclic, order 4)' },
        { key: 'Z5', build: function () { return group.cyclic(5); }, label: 'ℤ₅ (cyclic, order 5)' },
        { key: 'Z6', build: function () { return group.cyclic(6); }, label: 'ℤ₆ (cyclic, order 6)' },
        { key: 'V4', build: function () { return group.klein4(); }, label: 'V₄ (Klein four-group)' },
        { key: 'S3', build: function () { return group.s3(); }, label: 'S₃ (symmetric, order 6)' },
        { key: 'D4', build: function () { return group.d4(); }, label: 'D₄ (dihedral, order 8)' },
        { key: 'Q8', build: function () { return group.q8(); }, label: 'Q₈ (quaternion, order 8)' }
      ];
    }
  };

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

  // ─────────────────────────────────────────── string ──
  // String diagram (monoidal category) helpers

  var string = {
    // A string diagram is a list of layers (rows of boxes)
    // Each box: { label, inputs: n, outputs: n }
    // Wires connect output ports to input ports of the next layer

    // Compose two diagrams horizontally (sequential composition)
    compose: function (diag1, diag2) {
      return { layers: diag1.layers.concat(diag2.layers) };
    },

    // Tensor two diagrams vertically (parallel composition)
    tensor: function (diag1, diag2) {
      var result = { layers: [] };
      var maxLen = Math.max(diag1.layers.length, diag2.layers.length);
      for (var i = 0; i < maxLen; i++) {
        var layer1 = (i < diag1.layers.length) ? diag1.layers[i] : [];
        var layer2 = (i < diag2.layers.length) ? diag2.layers[i] : [];
        result.layers.push(layer1.concat(layer2));
      }
      return result;
    },

    // Identity wire on n strands
    identity: function (n) {
      return { layers: [], wires: n };
    },

    // Swap (braiding) on 2 wires
    swap: function () {
      return { layers: [{ type: 'swap', inputs: 2, outputs: 2 }], wires: 2 };
    },

    // Cup (unit of duality): 0 inputs, 2 outputs
    cup: function () {
      return { layers: [{ type: 'cup', inputs: 0, outputs: 2 }] };
    },

    // Cap (counit): 2 inputs, 0 outputs
    cap: function () {
      return { layers: [{ type: 'cap', inputs: 2, outputs: 0 }] };
    },

    // Preset string diagrams
    presets: {
      identity: function () {
        return {
          name: 'Identity',
          boxes: [],
          wires: [{ from: [0, 'in', 0], to: [0, 'out', 0] }],
          nInputs: 1, nOutputs: 1
        };
      },
      composition: function () {
        return {
          name: 'Composition f ; g',
          boxes: [
            { id: 0, label: 'f', x: 200, y: 80, inputs: 1, outputs: 1 },
            { id: 1, label: 'g', x: 200, y: 200, inputs: 1, outputs: 1 }
          ],
          wires: [
            { from: 'input:0', to: 'box:0:in:0' },
            { from: 'box:0:out:0', to: 'box:1:in:0' },
            { from: 'box:1:out:0', to: 'output:0' }
          ],
          nInputs: 1, nOutputs: 1
        };
      },
      tensor: function () {
        return {
          name: 'Tensor product f ⊗ g',
          boxes: [
            { id: 0, label: 'f', x: 140, y: 140, inputs: 1, outputs: 1 },
            { id: 1, label: 'g', x: 280, y: 140, inputs: 1, outputs: 1 }
          ],
          wires: [
            { from: 'input:0', to: 'box:0:in:0' },
            { from: 'input:1', to: 'box:1:in:0' },
            { from: 'box:0:out:0', to: 'output:0' },
            { from: 'box:1:out:0', to: 'output:1' }
          ],
          nInputs: 2, nOutputs: 2
        };
      },
      swap: function () {
        return {
          name: 'Swap (braiding)',
          boxes: [],
          wires: [
            { from: 'input:0', to: 'output:1', type: 'crossing' },
            { from: 'input:1', to: 'output:0', type: 'crossing' }
          ],
          nInputs: 2, nOutputs: 2
        };
      },
      trace: function () {
        return {
          name: 'Trace (cup-cap)',
          boxes: [
            { id: 0, label: 'f', x: 200, y: 140, inputs: 2, outputs: 2 }
          ],
          wires: [
            { from: 'input:0', to: 'box:0:in:0' },
            { from: 'box:0:out:0', to: 'output:0' },
            { from: 'box:0:out:1', to: 'box:0:in:1', type: 'feedback' }
          ],
          nInputs: 1, nOutputs: 1
        };
      },
      cnot: function () {
        return {
          name: 'CNOT gate',
          boxes: [
            { id: 0, label: 'CNOT', x: 200, y: 140, inputs: 2, outputs: 2 }
          ],
          wires: [
            { from: 'input:0', to: 'box:0:in:0' },
            { from: 'input:1', to: 'box:0:in:1' },
            { from: 'box:0:out:0', to: 'output:0' },
            { from: 'box:0:out:1', to: 'output:1' }
          ],
          nInputs: 2, nOutputs: 2
        };
      }
    }
  };

  // ─────────────────────────────────────────── commutative diagrams ──

  var commDiag = {
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
            { from: 'X', to: 'A', label: 'fₐ' },
            { from: 'X', to: 'B', label: 'f_b' },
            { from: 'X', to: 'AxB', label: '∃!h', style: 'dashed' },
            { from: 'AxB', to: 'A', label: 'π₁' },
            { from: 'AxB', to: 'B', label: 'π₂' }
          ],
          commutes: true
        };
      },
      snakeLemma: function () {
        return {
          name: 'Snake lemma',
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

  // ─────────────────────────────────────────── dynkin ──
  // Dynkin diagrams: nodes, edges, and the ADE classification

  var dynkin = {
    // Build a Dynkin diagram from a type string (e.g. 'A4', 'D5', 'E6')
    build: function (type) {
      var letter = type.charAt(0).toUpperCase();
      var n = parseInt(type.substring(1), 10);
      if (isNaN(n) || n < 1) return null;

      var nodes = [];
      var edges = []; // {from, to, multiplicity} — multiplicity > 1 for B,C,F,G
      var labels = {};

      for (var i = 0; i < n; i++) {
        nodes.push(i);
        labels[i] = 'α' + dynkin._sub(i + 1);
      }

      if (letter === 'A') {
        // Linear chain: 0—1—2—...—(n-1)
        for (var i = 0; i < n - 1; i++) edges.push({ from: i, to: i + 1, mult: 1 });
      } else if (letter === 'B' && n >= 2) {
        // Linear chain with double bond at the end: 0—1—...—(n-2)=>=(n-1)
        for (var i = 0; i < n - 2; i++) edges.push({ from: i, to: i + 1, mult: 1 });
        edges.push({ from: n - 2, to: n - 1, mult: 2 });
      } else if (letter === 'C' && n >= 2) {
        // Like B but arrow reversed: 0—1—...—(n-2)<=(n-1)
        for (var i = 0; i < n - 2; i++) edges.push({ from: i, to: i + 1, mult: 1 });
        edges.push({ from: n - 2, to: n - 1, mult: 2 });
      } else if (letter === 'D' && n >= 4) {
        // Fork: 0—1—...—(n-3) branches to (n-2) and (n-1)
        for (var i = 0; i < n - 2; i++) edges.push({ from: i, to: i + 1, mult: 1 });
        // Remove last edge, add fork
        edges.pop();
        for (var i = 0; i < n - 3; i++) edges.push({ from: i, to: i + 1, mult: 1 });
        edges.push({ from: n - 3, to: n - 2, mult: 1 });
        edges.push({ from: n - 3, to: n - 1, mult: 1 });
      } else if (letter === 'E' && n >= 6 && n <= 8) {
        // E6, E7, E8: main chain + one branch
        // Main chain: 0—1—2—3—4 (—5—6 for E7, —5—6—7 for E8)
        // Branch from node 2 to an extra node
        var mainLen = n - 1;
        for (var i = 0; i < mainLen - 1; i++) edges.push({ from: i, to: i + 1, mult: 1 });
        // Branch: node 2 connects to last node
        edges.push({ from: 2, to: n - 1, mult: 1 });
      } else if (letter === 'F' && n === 4) {
        // F4: 0—1=>=2—3
        edges.push({ from: 0, to: 1, mult: 1 });
        edges.push({ from: 1, to: 2, mult: 2 });
        edges.push({ from: 2, to: 3, mult: 1 });
      } else if (letter === 'G' && n === 2) {
        // G2: 0≡≡≡1 (triple bond)
        edges.push({ from: 0, to: 1, mult: 3 });
      }

      return { type: type, letter: letter, rank: n, nodes: nodes, edges: edges, labels: labels };
    },

    _sub: function (n) {
      return String(n).split('').map(function (c) {
        return String.fromCharCode(0x2080 + parseInt(c));
      }).join('');
    },

    // Compute Cartan matrix from a Dynkin diagram
    cartanMatrix: function (diagram) {
      var n = diagram.rank;
      var C = [];
      for (var i = 0; i < n; i++) {
        C.push(new Array(n).fill(0));
        C[i][i] = 2;
      }
      diagram.edges.forEach(function (e) {
        if (e.mult === 1) {
          C[e.from][e.to] = -1;
          C[e.to][e.from] = -1;
        } else if (e.mult === 2) {
          // B/C/F type: short root gets -2
          C[e.from][e.to] = -1;
          C[e.to][e.from] = -2;
        } else if (e.mult === 3) {
          // G2
          C[e.from][e.to] = -1;
          C[e.to][e.from] = -3;
        }
      });
      return C;
    },

    // Layout positions for rendering (linear + branch for D/E)
    layout: function (diagram, width, height, pad) {
      pad = pad || 40;
      var pos = [];
      var n = diagram.rank;
      var letter = diagram.letter;

      if (letter === 'D' && n >= 4) {
        // Main chain nodes 0..n-3, then fork to n-2 (up) and n-1 (down)
        var mainLen = n - 2;
        var step = (width - 2 * pad) / Math.max(mainLen, 1);
        for (var i = 0; i < mainLen; i++) {
          pos[i] = { x: pad + i * step, y: height / 2 };
        }
        var forkX = pad + (mainLen - 1) * step + step;
        pos[n - 2] = { x: forkX, y: height / 2 - 40 };
        pos[n - 1] = { x: forkX, y: height / 2 + 40 };
      } else if (letter === 'E' && n >= 6) {
        // Main chain 0..n-2 horizontal, branch node n-1 drops down from node 2
        var mainLen = n - 1;
        var step = (width - 2 * pad) / Math.max(mainLen - 1, 1);
        for (var i = 0; i < mainLen; i++) {
          pos[i] = { x: pad + i * step, y: height / 2 - 20 };
        }
        pos[n - 1] = { x: pad + 2 * step, y: height / 2 + 40 };
      } else {
        // Linear layout
        var step = n > 1 ? (width - 2 * pad) / (n - 1) : 0;
        for (var i = 0; i < n; i++) {
          pos[i] = { x: n > 1 ? pad + i * step : width / 2, y: height / 2 };
        }
      }
      return pos;
    },

    // The ADE simply-laced types
    adeList: function () {
      var result = [];
      for (var n = 1; n <= 8; n++) result.push('A' + n);
      for (var n = 4; n <= 8; n++) result.push('D' + n);
      result.push('E6', 'E7', 'E8');
      return result;
    },

    // Full catalog
    catalog: function () {
      var result = [];
      for (var n = 1; n <= 8; n++) result.push('A' + n);
      for (var n = 2; n <= 8; n++) result.push('B' + n);
      for (var n = 2; n <= 8; n++) result.push('C' + n);
      for (var n = 4; n <= 8; n++) result.push('D' + n);
      result.push('E6', 'E7', 'E8', 'F4', 'G2');
      return result;
    },

    // McKay correspondence: finite subgroup of SU(2) → affine Dynkin diagram
    mckay: {
      'Z_n':   { diagram: 'Ã_n', desc: 'Cyclic group → affine A' },
      'D_n':   { diagram: 'D̃_n', desc: 'Binary dihedral → affine D' },
      'T':     { diagram: 'Ẽ₆',  desc: 'Binary tetrahedral → affine E₆' },
      'O':     { diagram: 'Ẽ₇',  desc: 'Binary octahedral → affine E₇' },
      'I':     { diagram: 'Ẽ₈',  desc: 'Binary icosahedral → affine E₈' }
    }
  };

  // ─────────────────────────────────────────── quiver ──
  // Quiver diagrams: directed graphs encoding algebras

  var quiver = {
    // A quiver is { vertices: [id,...], arrows: [{from, to, label},...] }

    // Build from adjacency data
    build: function (nVertices, arrows) {
      var vertices = range(nVertices);
      return { vertices: vertices, arrows: arrows };
    },

    // Path algebra dimension for finite-type quivers (A_n type)
    pathCount: function (q) {
      // Count all directed paths including length-0 (vertices)
      var n = q.vertices.length;
      var adj = [];
      for (var i = 0; i < n; i++) { adj.push(new Array(n).fill(0)); }
      q.arrows.forEach(function (a) { adj[a.from][a.to]++; });

      // Reachability matrix (transitive closure with counts)
      var reach = [];
      for (var i = 0; i < n; i++) {
        reach.push(new Array(n).fill(0));
        reach[i][i] = 1; // identity paths
      }
      // Add direct arrows
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) reach[i][j] += adj[i][j];
      }
      // Compose (limited iterations for acyclic)
      for (var len = 2; len < n; len++) {
        for (var i = 0; i < n; i++) {
          for (var j = 0; j < n; j++) {
            for (var k = 0; k < n; k++) {
              reach[i][j] += adj[i][k] * reach[k][j];
            }
          }
        }
      }
      var total = 0;
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) total += reach[i][j];
      return total;
    },

    // Quiver mutation at vertex k
    mutate: function (q, k) {
      var newArrows = [];
      // Step 1: for each pair i→k→j, add i→j
      var intoK = q.arrows.filter(function (a) { return a.to === k; });
      var outOfK = q.arrows.filter(function (a) { return a.from === k; });
      var added = {};
      intoK.forEach(function (a1) {
        outOfK.forEach(function (a2) {
          var key = a1.from + '→' + a2.to;
          if (!added[key]) {
            newArrows.push({ from: a1.from, to: a2.to, label: '' });
            added[key] = true;
          }
        });
      });
      // Step 2: reverse arrows touching k
      q.arrows.forEach(function (a) {
        if (a.from === k) {
          newArrows.push({ from: a.to, to: a.from, label: a.label });
        } else if (a.to === k) {
          newArrows.push({ from: a.to, to: a.from, label: a.label });
        } else {
          newArrows.push({ from: a.from, to: a.to, label: a.label });
        }
      });
      // Step 3: cancel opposite arrows
      var final = [];
      var cancelSet = {};
      for (var i = 0; i < newArrows.length; i++) {
        for (var j = i + 1; j < newArrows.length; j++) {
          if (newArrows[i].from === newArrows[j].to && newArrows[i].to === newArrows[j].from) {
            cancelSet[i] = true;
            cancelSet[j] = true;
          }
        }
      }
      newArrows.forEach(function (a, i) {
        if (!cancelSet[i]) final.push(a);
      });
      return { vertices: q.vertices.slice(), arrows: final };
    },

    // Preset quivers
    presets: {
      a3: function () {
        return {
          name: 'A₃ (linear)',
          vertices: [0, 1, 2],
          arrows: [{ from: 0, to: 1, label: 'α' }, { from: 1, to: 2, label: 'β' }],
          labels: { 0: '1', 1: '2', 2: '3' }
        };
      },
      a4: function () {
        return {
          name: 'A₄ (linear)',
          vertices: [0, 1, 2, 3],
          arrows: [{ from: 0, to: 1, label: 'α' }, { from: 1, to: 2, label: 'β' }, { from: 2, to: 3, label: 'γ' }],
          labels: { 0: '1', 1: '2', 2: '3', 3: '4' }
        };
      },
      d4: function () {
        return {
          name: 'D₄ (star)',
          vertices: [0, 1, 2, 3],
          arrows: [{ from: 0, to: 1, label: '' }, { from: 2, to: 1, label: '' }, { from: 3, to: 1, label: '' }],
          labels: { 0: '1', 1: '2', 2: '3', 3: '4' }
        };
      },
      triangle: function () {
        return {
          name: 'Oriented triangle',
          vertices: [0, 1, 2],
          arrows: [{ from: 0, to: 1, label: 'α' }, { from: 1, to: 2, label: 'β' }, { from: 2, to: 0, label: 'γ' }],
          labels: { 0: '1', 1: '2', 2: '3' }
        };
      },
      kronecker: function () {
        return {
          name: 'Kronecker (2 arrows)',
          vertices: [0, 1],
          arrows: [{ from: 0, to: 1, label: 'α' }, { from: 0, to: 1, label: 'β' }],
          labels: { 0: '1', 1: '2' }
        };
      },
      jordanQuiver: function () {
        return {
          name: 'Jordan quiver (loop)',
          vertices: [0],
          arrows: [{ from: 0, to: 0, label: 'α' }],
          labels: { 0: '1' }
        };
      }
    }
  };

  // ─────────────────────────────────────────── dessin ──
  // Dessins d'enfants: bipartite graphs on surfaces

  var dessin = {
    // A dessin is { black: [{x,y},...], white: [{x,y},...], edges: [{b,w},...] }
    // b indexes into black, w indexes into white

    // Passport: degree sequence of (black, white, face) vertices
    passport: function (d) {
      var bDeg = new Array(d.black.length).fill(0);
      var wDeg = new Array(d.white.length).fill(0);
      d.edges.forEach(function (e) { bDeg[e.b]++; wDeg[e.w]++; });
      bDeg.sort(function (a, b) { return b - a; });
      wDeg.sort(function (a, b) { return b - a; });
      return { black: bDeg, white: wDeg, nEdges: d.edges.length };
    },

    // Euler characteristic: V - E + F = 2 - 2g (genus)
    euler: function (d) {
      var V = d.black.length + d.white.length;
      var E = d.edges.length;
      // F requires face computation — approximate for planar: F = E - V + 2
      var F = E - V + 2;
      return { V: V, E: E, F: F, chi: V - E + F, genus: (2 - (V - E + F)) / 2 };
    },

    // Preset dessins
    presets: {
      // The simplest: a single edge
      segment: function () {
        return {
          name: 'Segment (1 edge)',
          black: [{ x: 150, y: 150 }],
          white: [{ x: 300, y: 150 }],
          edges: [{ b: 0, w: 0 }]
        };
      },
      // Triangle: 3 black, 3 white, 3 edges on a circle
      triangle: function () {
        var r = 100, cx = 225, cy = 160;
        var b = [], w = [];
        for (var i = 0; i < 3; i++) {
          var a1 = (2 * i / 6) * Math.PI * 2 - Math.PI / 2;
          var a2 = ((2 * i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
          b.push({ x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) });
          w.push({ x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) });
        }
        return {
          name: 'Triangle',
          black: b, white: w,
          edges: [{ b: 0, w: 0 }, { b: 1, w: 1 }, { b: 2, w: 2 },
                  { b: 0, w: 2 }, { b: 1, w: 0 }, { b: 2, w: 1 }]
        };
      },
      // Star: one central black vertex connected to n white vertices
      star: function (n) {
        n = n || 5;
        var cx = 225, cy = 160, r = 90;
        var b = [{ x: cx, y: cy }];
        var w = [];
        var edges = [];
        for (var i = 0; i < n; i++) {
          var a = (i / n) * 2 * Math.PI - Math.PI / 2;
          w.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
          edges.push({ b: 0, w: i });
        }
        return { name: 'Star (' + n + ' edges)', black: b, white: w, edges: edges };
      },
      // The cube dessin (3 black of degree 4, 4 white of degree 3)
      cube: function () {
        return {
          name: 'Cube dessin',
          black: [
            { x: 150, y: 80 }, { x: 300, y: 80 }, { x: 225, y: 240 }
          ],
          white: [
            { x: 120, y: 160 }, { x: 225, y: 50 },
            { x: 330, y: 160 }, { x: 225, y: 180 }
          ],
          edges: [
            { b: 0, w: 0 }, { b: 0, w: 1 }, { b: 0, w: 3 }, { b: 0, w: 0 },
            { b: 1, w: 1 }, { b: 1, w: 2 }, { b: 1, w: 3 },
            { b: 2, w: 0 }, { b: 2, w: 2 }, { b: 2, w: 3 }
          ]
        };
      },
      // The tetrahedron dessin (passport [3,3], [2,2,2])
      tetrahedron: function () {
        var cx = 225, cy = 160, r = 90;
        return {
          name: 'Tetrahedron dessin',
          black: [
            { x: cx, y: cy - r },
            { x: cx - r * 0.87, y: cy + r * 0.5 },
            { x: cx + r * 0.87, y: cy + r * 0.5 }
          ],
          white: [
            { x: cx - r * 0.43, y: cy - r * 0.25 },
            { x: cx + r * 0.43, y: cy - r * 0.25 },
            { x: cx, y: cy + r * 0.5 }
          ],
          edges: [
            { b: 0, w: 0 }, { b: 0, w: 1 },
            { b: 1, w: 0 }, { b: 1, w: 2 },
            { b: 2, w: 1 }, { b: 2, w: 2 }
          ]
        };
      }
    }
  };

  // ─────────────────────────────────────────── weight ──
  // Weight diagrams for Lie algebra representations

  var weight = {
    // sl₂ weights: a single row from -λ to λ in steps of 2
    sl2: function (highestWeight) {
      var weights = [];
      for (var w = highestWeight; w >= -highestWeight; w -= 2) {
        weights.push({ weight: [w], mult: 1 });
      }
      return { algebra: 'sl₂', highestWeight: [highestWeight], weights: weights, dim: highestWeight + 1 };
    },

    // sl₃ weights for irrep with highest weight (a, b) (Dynkin labels)
    // Returns weights on the hexagonal lattice
    sl3: function (a, b) {
      // Simple roots: α₁ = [2,-1], α₂ = [-1,2]
      // Fundamental weights: ω₁ = [1,0], ω₂ = [0,1]
      // Generate all weights by subtracting simple roots
      var weights = {};
      var hw = [a, b];
      var queue = [hw];
      var visited = {};
      visited[hw.join(',')] = true;

      while (queue.length > 0) {
        var w = queue.shift();
        // Multiplicity (simplified — use Freudenthal for exact)
        var key = w.join(',');
        weights[key] = weights[key] || { weight: w, mult: 0 };
        weights[key].mult++;

        // Subtract α₁ if w₁ > 0
        if (w[0] > 0) {
          var w1 = [w[0] - 2, w[1] + 1];
          // But we need Dynkin label subtraction: w - α₁ in Dynkin coords
          // α₁ in Dynkin coords is [2, -1]
          var next1 = [w[0] - 2, w[1] + 1];
          var k1 = next1.join(',');
          if (!visited[k1] && next1[0] >= -a - b && next1[1] >= -a - b) {
            visited[k1] = true;
            queue.push(next1);
          }
        }
        // Subtract α₂ if w₂ > 0
        if (w[1] > 0) {
          var next2 = [w[0] + 1, w[1] - 2];
          var k2 = next2.join(',');
          if (!visited[k2] && next2[0] >= -a - b && next2[1] >= -a - b) {
            visited[k2] = true;
            queue.push(next2);
          }
        }
      }

      var result = Object.keys(weights).map(function (k) { return weights[k]; });
      var dim = 0;
      result.forEach(function (w) { dim += w.mult; });

      return { algebra: 'sl₃', highestWeight: [a, b], weights: result, dim: dim };
    },

    // Convert Dynkin label coordinates to Cartesian for sl₃ hexagonal lattice
    // ω₁ = (1, 0), ω₂ = (1/2, √3/2) in Cartesian
    toCartesian: function (dynkinCoords) {
      var w1 = dynkinCoords[0], w2 = dynkinCoords[1];
      return {
        x: w1 + w2 * 0.5,
        y: w2 * Math.sqrt(3) / 2
      };
    },

    // Weyl dimension formula for sl₃: dim(a,b) = (a+1)(b+1)(a+b+2)/2
    sl3Dim: function (a, b) {
      return (a + 1) * (b + 1) * (a + b + 2) / 2;
    },

    // Preset representations
    presets: {
      // sl₂
      sl2_spin1: function () { return weight.sl2(2); },   // spin 1, dim 3
      sl2_spin2: function () { return weight.sl2(4); },   // spin 2, dim 5
      sl2_fund:  function () { return weight.sl2(1); },   // fundamental, dim 2
      // sl₃
      sl3_fund:  function () { return weight.sl3(1, 0); }, // fundamental 3, dim 3
      sl3_adj:   function () { return weight.sl3(1, 1); }, // adjoint 8, dim 8
      sl3_sym2:  function () { return weight.sl3(2, 0); }, // symmetric square, dim 6
      sl3_10:    function () { return weight.sl3(3, 0); }, // 10-dim
      sl3_27:    function () { return weight.sl3(2, 2); }  // 27-dim
    }
  };

  // ─────────────────────────────────────────── chord ──
  // Chord diagrams: circles with paired chords (Vassiliev invariants)

  var chord = {
    // A chord diagram on 2n points: n chords connecting paired points on a circle
    // Represented as an array of pairs: [[0,3],[1,4],[2,5]] for 3 chords on 6 points

    // Build from pairs
    build: function (nChords, pairs) {
      return { n: nChords, nPoints: 2 * nChords, pairs: pairs };
    },

    // Intersection number: count how many pairs of chords cross
    intersections: function (diagram) {
      var count = 0;
      var pairs = diagram.pairs;
      for (var i = 0; i < pairs.length; i++) {
        for (var j = i + 1; j < pairs.length; j++) {
          if (chord._cross(pairs[i], pairs[j], diagram.nPoints)) count++;
        }
      }
      return count;
    },

    // Check if two chords cross on the circle
    _cross: function (p1, p2, n) {
      // Two chords [a,b] and [c,d] cross iff exactly one of c,d lies
      // in the arc from a to b (going clockwise)
      var a = Math.min(p1[0], p1[1]), b = Math.max(p1[0], p1[1]);
      var c = Math.min(p2[0], p2[1]), d = Math.max(p2[0], p2[1]);
      var cIn = a < c && c < b;
      var dIn = a < d && d < b;
      return cIn !== dIn; // exactly one inside
    },

    // Generate layout positions on a circle
    layout: function (diagram, cx, cy, r) {
      var positions = [];
      for (var i = 0; i < diagram.nPoints; i++) {
        var angle = (i / diagram.nPoints) * 2 * Math.PI - Math.PI / 2;
        positions.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
      }
      return positions;
    },

    // The 4T (four-term) relation:
    // Given a chord diagram with a distinguished pair of chords,
    // the 4T relation says D_parallel - D_cross + D_cross' - D_parallel' = 0
    // We just describe this structurally
    fourT: {
      description: 'The four-term relation: for any two chords sharing a neighbourhood, the alternating sum of four resolutions vanishes. This is the defining relation of the space of chord diagrams modulo 4T, which is dual to the space of Vassiliev invariants.'
    },

    // Preset chord diagrams
    presets: {
      // 1 chord: the simplest
      single: function () {
        return { name: '1 chord', n: 1, nPoints: 2, pairs: [[0, 1]] };
      },
      // 2 chords, non-crossing
      parallel2: function () {
        return { name: '2 parallel chords', n: 2, nPoints: 4, pairs: [[0, 1], [2, 3]] };
      },
      // 2 chords, crossing
      crossing2: function () {
        return { name: '2 crossing chords', n: 2, nPoints: 4, pairs: [[0, 2], [1, 3]] };
      },
      // 3 chords, all pairwise crossing
      allCross3: function () {
        return { name: '3 all-crossing chords', n: 3, nPoints: 6, pairs: [[0, 3], [1, 4], [2, 5]] };
      },
      // 3 chords, none crossing
      parallel3: function () {
        return { name: '3 parallel chords', n: 3, nPoints: 6, pairs: [[0, 1], [2, 3], [4, 5]] };
      },
      // 4 chords, mixed
      mixed4: function () {
        return { name: '4 chords (mixed)', n: 4, nPoints: 8, pairs: [[0, 4], [1, 5], [2, 6], [3, 7]] };
      },
      // The trefoil chord diagram (from its Gauss diagram)
      trefoil: function () {
        return { name: 'Trefoil (3 crossings)', n: 3, nPoints: 6, pairs: [[0, 3], [1, 4], [2, 5]] };
      }
    }
  };

  // ─────────────────────────────────────────── tangle ──
  // Tangle diagrams: open-ended braids/knots with boundary points

  var tangle = {
    // A tangle has boundary points on top (NW, NE) and bottom (SW, SE)
    // and strands connecting them through crossings.
    // A rational tangle is built by alternating horizontal (twist) and vertical (twist) operations.

    // Build a rational tangle from a continued fraction [a_1, a_2, ..., a_n]
    // Start with the 0-tangle (two vertical strands) or ∞-tangle (two horizontal)
    // Twist: add crossings at the bottom (horizontal) or right (vertical)
    rational: function (twists) {
      // Each twist value generates |t| crossings of sign sgn(t)
      // Alternating between horizontal and vertical twists
      var crossings = [];
      var stepY = 50;
      var y = 0;
      twists.forEach(function (t, i) {
        var n = Math.abs(t);
        var sign = t >= 0 ? 1 : -1;
        var orient = (i % 2 === 0) ? 'horizontal' : 'vertical';
        for (var j = 0; j < n; j++) {
          crossings.push({ y: y, sign: sign, orient: orient, index: crossings.length });
          y += stepY;
        }
      });
      return { twists: twists, crossings: crossings, height: y + stepY };
    },

    // Conway notation fraction: [a_1, a_2, ..., a_n] → continued fraction p/q
    fraction: function (twists) {
      if (twists.length === 0) return { p: 0, q: 1 };
      var p = twists[twists.length - 1];
      var q = 1;
      for (var i = twists.length - 2; i >= 0; i--) {
        var tmp = p;
        p = twists[i] * p + q;
        q = tmp;
      }
      return { p: p, q: q };
    },

    // Sum of two tangles (horizontal composition)
    sum: function (t1, t2) {
      return {
        type: 'sum',
        left: t1,
        right: t2,
        twists: null // not rational in general
      };
    },

    // Numerator closure: connect NW-NE and SW-SE → a knot/link
    numeratorClosure: function (t) {
      return { type: 'numerator', tangle: t };
    },

    // Denominator closure: connect NW-SW and NE-SE → a knot/link
    denominatorClosure: function (t) {
      return { type: 'denominator', tangle: t };
    },

    // Preset tangles
    presets: {
      zero: function () {
        return { name: '0-tangle', twists: [0], crossings: [], height: 50,
                 desc: 'Two vertical strands, no crossings' };
      },
      infinity: function () {
        return { name: '∞-tangle', twists: [], crossings: [], height: 50,
                 type: 'infinity', desc: 'Two horizontal strands, no crossings' };
      },
      twist2: function () {
        var t = tangle.rational([2]);
        t.name = '[2] twist';
        t.desc = 'Two right-handed horizontal twists';
        return t;
      },
      twist3: function () {
        var t = tangle.rational([3]);
        t.name = '[3] twist';
        t.desc = 'Three right-handed horizontal twists';
        return t;
      },
      rational2_3: function () {
        var t = tangle.rational([2, 3]);
        t.name = '[2, 3] rational';
        t.desc = '2 horizontal twists then 3 vertical twists';
        return t;
      },
      rational3_2_1: function () {
        var t = tangle.rational([3, 2, 1]);
        t.name = '[3, 2, 1] rational';
        t.desc = 'Continued fraction 3 + 1/(2 + 1/1) = 10/3';
        return t;
      },
      trefoilTangle: function () {
        var t = tangle.rational([3]);
        t.name = '[3] → trefoil';
        t.desc = 'Numerator closure gives the trefoil knot';
        return t;
      }
    }
  };

  // ─────────────────────────────────────────── penrose ──
  // Penrose graphical notation for tensors

  var penrose = {
    // A tensor node: { label, rank, upperIndices, lowerIndices, x, y }
    // Upper indices = contravariant (lines going up), lower = covariant (going down)
    // Contractions: wire connecting an upper index of one tensor to a lower index of another

    // Build a tensor node
    tensor: function (label, upper, lower) {
      return { label: label, upper: upper || 0, lower: lower || 0, rank: (upper || 0) + (lower || 0) };
    },

    // Matrix: 1 upper, 1 lower index
    matrix: function (label) { return penrose.tensor(label, 1, 1); },

    // Vector: 1 upper index
    vector: function (label) { return penrose.tensor(label, 1, 0); },

    // Covector (1-form): 1 lower index
    covector: function (label) { return penrose.tensor(label, 0, 1); },

    // Metric tensor: 2 lower indices (symmetric)
    metric: function () { return { label: 'g', upper: 0, lower: 2, rank: 2, symmetric: true }; },

    // Inverse metric: 2 upper indices
    inverseMetric: function () { return { label: 'g⁻¹', upper: 2, lower: 0, rank: 2, symmetric: true }; },

    // Levi-Civita symbol: n indices
    leviCivita: function (n, type) {
      return { label: 'ε', upper: type === 'upper' ? n : 0, lower: type === 'lower' ? n : 0,
               rank: n, antisymmetric: true };
    },

    // Kronecker delta: 1 upper, 1 lower
    delta: function () { return { label: 'δ', upper: 1, lower: 1, rank: 2, special: 'delta' }; },

    // Trace: contract the single upper and lower index of a (1,1)-tensor
    trace: function (t) {
      if (t.upper >= 1 && t.lower >= 1) {
        return { label: 'tr(' + t.label + ')', upper: t.upper - 1, lower: t.lower - 1,
                 rank: t.rank - 2, traced: true };
      }
      return null;
    },

    // Contract two tensors on specified indices
    contract: function (t1, t2, upperIdx, lowerIdx) {
      return {
        label: t1.label + '·' + t2.label,
        upper: t1.upper + t2.upper - 1,
        lower: t1.lower + t2.lower - 1,
        rank: t1.rank + t2.rank - 2,
        contraction: { from: t1.label, to: t2.label, upperIdx: upperIdx, lowerIdx: lowerIdx }
      };
    },

    // Preset diagrams for rendering
    presets: {
      matrixVector: function () {
        return {
          name: 'Matrix × Vector (Av)',
          nodes: [
            { id: 0, label: 'A', upper: 1, lower: 1, x: 200, y: 100 },
            { id: 1, label: 'v', upper: 1, lower: 0, x: 200, y: 220 }
          ],
          contractions: [{ from: 0, fromPort: 'lower', fromIdx: 0, to: 1, toPort: 'upper', toIdx: 0 }],
          freeUpper: [{ node: 0, idx: 0 }],
          freeLower: [],
          result: 'Vector (1 free upper index)'
        };
      },
      matrixProduct: function () {
        return {
          name: 'Matrix product (AB)',
          nodes: [
            { id: 0, label: 'A', upper: 1, lower: 1, x: 150, y: 140 },
            { id: 1, label: 'B', upper: 1, lower: 1, x: 300, y: 140 }
          ],
          contractions: [{ from: 0, fromPort: 'lower', fromIdx: 0, to: 1, toPort: 'upper', toIdx: 0 }],
          freeUpper: [{ node: 0, idx: 0 }],
          freeLower: [{ node: 1, idx: 0 }],
          result: 'Matrix (1 upper, 1 lower)'
        };
      },
      trace: function () {
        return {
          name: 'Trace (tr A)',
          nodes: [
            { id: 0, label: 'A', upper: 1, lower: 1, x: 220, y: 140 }
          ],
          contractions: [{ from: 0, fromPort: 'upper', fromIdx: 0, to: 0, toPort: 'lower', toIdx: 0 }],
          freeUpper: [],
          freeLower: [],
          result: 'Scalar (no free indices)'
        };
      },
      innerProduct: function () {
        // g_{ij} u^i v^j — metric contracts two vectors to a scalar.
        // Both contractions are upper-to-lower (valid Penrose).
        return {
          name: 'Inner product g(u,v)',
          nodes: [
            { id: 0, label: 'u', upper: 1, lower: 0, x: 160, y: 140 },
            { id: 1, label: 'g', upper: 0, lower: 2, x: 240, y: 80, symmetric: true, shape: 'cup' },
            { id: 2, label: 'v', upper: 1, lower: 0, x: 320, y: 140 }
          ],
          contractions: [
            { from: 0, fromPort: 'upper', fromIdx: 0, to: 1, toPort: 'lower', toIdx: 0 },
            { from: 2, fromPort: 'upper', fromIdx: 0, to: 1, toPort: 'lower', toIdx: 1 }
          ],
          freeUpper: [],
          freeLower: [],
          result: 'Scalar (metric contraction g_{ij} u^i v^j)'
        };
      },
      outerProduct: function () {
        return {
          name: 'Outer product (u ⊗ v)',
          nodes: [
            { id: 0, label: 'u', upper: 1, lower: 0, x: 160, y: 140 },
            { id: 1, label: 'v', upper: 1, lower: 0, x: 300, y: 140 }
          ],
          contractions: [],
          freeUpper: [{ node: 0, idx: 0 }, { node: 1, idx: 0 }],
          freeLower: [],
          result: 'Rank-2 tensor (2 free upper indices)'
        };
      },
      riemann: function () {
        return {
          name: 'Riemann curvature R',
          nodes: [
            { id: 0, label: 'R', upper: 1, lower: 3, x: 220, y: 120 }
          ],
          contractions: [],
          freeUpper: [{ node: 0, idx: 0 }],
          freeLower: [{ node: 0, idx: 0 }, { node: 0, idx: 1 }, { node: 0, idx: 2 }],
          result: 'Type (1,3) tensor — 4 free indices'
        };
      },
      einsteinSummation: function () {
        return {
          name: 'Einstein summation (AᵢⱼBʲₖ)',
          nodes: [
            { id: 0, label: 'A', upper: 0, lower: 2, x: 160, y: 120 },
            { id: 1, label: 'B', upper: 1, lower: 1, x: 300, y: 120 }
          ],
          contractions: [{ from: 0, fromPort: 'lower', fromIdx: 1, to: 1, toPort: 'upper', toIdx: 0 }],
          freeUpper: [],
          freeLower: [{ node: 0, idx: 0 }, { node: 1, idx: 0 }],
          result: 'Type (0,2) tensor — sum over shared index'
        };
      }
    }
  };

  // ─────────────────────────────────────────── export ──

  global.Diag = {
    poset: poset,
    sugiyama: sugiyama,
    partition: partition,
    group: group,
    braid: braid,
    knot: knot,
    string: string,
    commDiag: commDiag,
    dynkin: dynkin,
    quiver: quiver,
    dessin: dessin,
    weight: weight,
    chord: chord,
    tangle: tangle,
    penrose: penrose,
    fmt: fmt
  };

})(typeof window !== 'undefined' ? window : this);
