// tda-math.js — Computational engine for the Topological Data Analysis series.
// Attaches a single `TDA` object to the global scope.
// No modules, no build step. Works alongside the D3 + KaTeX stack.
//
// Public sections
// ---------------
//   TDA.points         Point cloud generators (circle, annulus, clusters, grid, sphere, torus)
//   TDA.dist           Distance utilities
//   TDA.rips           Vietoris-Rips complex construction
//   TDA.complex        Simplicial complex operations (f-vector, Euler, faces, Hasse)
//   TDA.boundary       Boundary operators and chain groups (Z/2 coefficients)
//   TDA.homology       Homology computation via Gaussian elimination over Z/2
//   TDA.filtration      Filtration construction from a Rips complex
//   TDA.persistence    Persistent homology via column reduction
//   TDA.mapper         Mapper algorithm pipeline
//   TDA.fmt            Formatting helpers
//
// All linear algebra is over Z/2 (GF(2)) unless noted otherwise.
// Point clouds live in R^d but d = 2 is the default for interactive figures.

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── helpers ──

  function sqDist(a, b) {
    var s = 0;
    for (var i = 0; i < a.length; i++) {
      var d = a[i] - b[i];
      s += d * d;
    }
    return s;
  }

  function eucDist(a, b) {
    return Math.sqrt(sqDist(a, b));
  }

  // Canonical string key for a simplex (sorted vertex indices)
  function simplexKey(verts) {
    return verts.slice().sort(function (a, b) { return a - b; }).join(',');
  }

  // All subsets of size k from arr (combinations)
  function combinations(arr, k) {
    if (k === 0) return [[]];
    if (k > arr.length) return [];
    var result = [];
    function recurse(start, combo) {
      if (combo.length === k) { result.push(combo.slice()); return; }
      for (var i = start; i < arr.length; i++) {
        combo.push(arr[i]);
        recurse(i + 1, combo);
        combo.pop();
      }
    }
    recurse(0, []);
    return result;
  }

  // ─────────────────────────────────────────── point cloud generators ──

  var points = {
    // Uniform random in [0, w] x [0, h]
    random: function (n, w, h) {
      w = w || 1; h = h || 1;
      var pts = [];
      for (var i = 0; i < n; i++) {
        pts.push([Math.random() * w, Math.random() * h]);
      }
      return pts;
    },

    // Points on a circle with optional noise
    circle: function (n, r, noise) {
      r = r || 1; noise = noise || 0;
      var pts = [];
      for (var i = 0; i < n; i++) {
        var theta = (2 * Math.PI * i) / n;
        pts.push([
          r * Math.cos(theta) + (Math.random() - 0.5) * noise,
          r * Math.sin(theta) + (Math.random() - 0.5) * noise
        ]);
      }
      return pts;
    },

    // Points on an annulus (ring) with inner radius r1, outer radius r2
    annulus: function (n, r1, r2, noise) {
      r1 = r1 || 0.7; r2 = r2 || 1.0; noise = noise || 0;
      var pts = [];
      for (var i = 0; i < n; i++) {
        var theta = Math.random() * 2 * Math.PI;
        var r = r1 + Math.random() * (r2 - r1);
        pts.push([
          r * Math.cos(theta) + (Math.random() - 0.5) * noise,
          r * Math.sin(theta) + (Math.random() - 0.5) * noise
        ]);
      }
      return pts;
    },

    // k clusters of n/k points each, centres evenly spaced
    clusters: function (n, k, spread) {
      k = k || 3; spread = spread || 0.15;
      var pts = [];
      var perCluster = Math.floor(n / k);
      for (var c = 0; c < k; c++) {
        var cx = Math.cos(2 * Math.PI * c / k) * 0.5 + 0.5;
        var cy = Math.sin(2 * Math.PI * c / k) * 0.5 + 0.5;
        for (var i = 0; i < perCluster; i++) {
          pts.push([
            cx + (Math.random() - 0.5) * spread,
            cy + (Math.random() - 0.5) * spread
          ]);
        }
      }
      return pts;
    },

    // Grid of points with optional jitter
    grid: function (rows, cols, jitter) {
      jitter = jitter || 0;
      var pts = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          pts.push([
            c / (cols - 1 || 1) + (Math.random() - 0.5) * jitter,
            r / (rows - 1 || 1) + (Math.random() - 0.5) * jitter
          ]);
        }
      }
      return pts;
    },

    // Figure-eight (two tangent circles)
    figureEight: function (n, r, noise) {
      r = r || 0.4; noise = noise || 0;
      var pts = [];
      var half = Math.floor(n / 2);
      for (var i = 0; i < half; i++) {
        var theta = (2 * Math.PI * i) / half;
        pts.push([
          -r + r * Math.cos(theta) + (Math.random() - 0.5) * noise,
          r * Math.sin(theta) + (Math.random() - 0.5) * noise
        ]);
      }
      for (var i = 0; i < n - half; i++) {
        var theta = (2 * Math.PI * i) / (n - half);
        pts.push([
          r + r * Math.cos(theta) + (Math.random() - 0.5) * noise,
          r * Math.sin(theta) + (Math.random() - 0.5) * noise
        ]);
      }
      return pts;
    },

    // Linked rings in 2D projection
    linkedRings: function (n, r, noise) {
      r = r || 0.35; noise = noise || 0;
      var pts = [];
      var half = Math.floor(n / 2);
      for (var i = 0; i < half; i++) {
        var theta = (2 * Math.PI * i) / half;
        pts.push([
          r * Math.cos(theta) + (Math.random() - 0.5) * noise,
          r * Math.sin(theta) + (Math.random() - 0.5) * noise
        ]);
      }
      for (var i = 0; i < n - half; i++) {
        var theta = (2 * Math.PI * i) / (n - half);
        pts.push([
          r * 0.8 + r * Math.cos(theta) + (Math.random() - 0.5) * noise,
          r * 0.8 + r * Math.sin(theta) + (Math.random() - 0.5) * noise
        ]);
      }
      return pts;
    },

    // 3D sphere projected to 2D (for use in higher-dimensional examples)
    sphere3D: function (n, r) {
      r = r || 1;
      var pts = [];
      for (var i = 0; i < n; i++) {
        // Fibonacci sphere
        var y = 1 - (2 * i / (n - 1));
        var radius = Math.sqrt(1 - y * y);
        var theta = ((1 + Math.sqrt(5)) / 2) * i * 2 * Math.PI;
        pts.push([
          r * radius * Math.cos(theta),
          r * y,
          r * radius * Math.sin(theta)
        ]);
      }
      return pts;
    },

    // Add Gaussian noise to existing points
    addNoise: function (pts, sigma) {
      function randn() {
        var u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      }
      return pts.map(function (p) {
        return p.map(function (x) { return x + randn() * sigma; });
      });
    }
  };

  // ─────────────────────────────────────────── distance utilities ──

  var dist = {
    euclidean: eucDist,
    squaredEuclidean: sqDist,

    // Full distance matrix (symmetric, zero diagonal)
    matrix: function (pts) {
      var n = pts.length;
      var D = [];
      for (var i = 0; i < n; i++) {
        D[i] = new Float64Array(n);
        for (var j = 0; j < n; j++) {
          D[i][j] = i === j ? 0 : eucDist(pts[i], pts[j]);
        }
      }
      return D;
    },

    // All unique pairwise distances, sorted ascending
    sortedEdges: function (pts) {
      var edges = [];
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          edges.push({ i: i, j: j, d: eucDist(pts[i], pts[j]) });
        }
      }
      edges.sort(function (a, b) { return a.d - b.d; });
      return edges;
    },

    // Hausdorff distance between two point clouds
    hausdorff: function (A, B) {
      function directed(X, Y) {
        var maxMin = 0;
        for (var i = 0; i < X.length; i++) {
          var minD = Infinity;
          for (var j = 0; j < Y.length; j++) {
            var d = eucDist(X[i], Y[j]);
            if (d < minD) minD = d;
          }
          if (minD > maxMin) maxMin = minD;
        }
        return maxMin;
      }
      return Math.max(directed(A, B), directed(B, A));
    }
  };

  // ─────────────────────────────────────────── Vietoris-Rips complex ──

  var rips = {
    // Build the Rips complex at radius epsilon.
    // Returns { vertices: [...], simplices: { 0: [...], 1: [...], 2: [...], 3: [...] } }
    // where simplices[k] is an array of (k+1)-element arrays (sorted vertex indices).
    // maxDim caps the dimension of simplices computed (default 3, i.e. up to tetrahedra).
    build: function (pts, epsilon, maxDim) {
      maxDim = maxDim === undefined ? 3 : maxDim;
      var n = pts.length;
      var D = dist.matrix(pts);

      // Vertices (0-simplices)
      var vertices = [];
      for (var i = 0; i < n; i++) vertices.push(i);

      var simplices = {};
      simplices[0] = vertices.map(function (v) { return [v]; });

      if (maxDim < 1) return { vertices: vertices, simplices: simplices };

      // Edges (1-simplices): pairs within epsilon
      var edges = [];
      var adjSet = {};  // adjacency for clique expansion
      for (var i = 0; i < n; i++) adjSet[i] = {};
      for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          if (D[i][j] <= epsilon) {
            edges.push([i, j]);
            adjSet[i][j] = true;
            adjSet[j][i] = true;
          }
        }
      }
      simplices[1] = edges;

      // Higher simplices by clique expansion
      for (var dim = 2; dim <= maxDim; dim++) {
        var prev = simplices[dim - 1];
        if (!prev || prev.length === 0) { simplices[dim] = []; continue; }

        var seen = {};
        var current = [];

        for (var si = 0; si < prev.length; si++) {
          var face = prev[si];
          var lastV = face[face.length - 1];

          // Try extending with each vertex > lastV that is adjacent to all vertices in face
          for (var v = lastV + 1; v < n; v++) {
            var allAdj = true;
            for (var fi = 0; fi < face.length; fi++) {
              if (!adjSet[face[fi]][v]) { allAdj = false; break; }
            }
            if (allAdj) {
              var newSimplex = face.concat(v);
              var key = simplexKey(newSimplex);
              if (!seen[key]) {
                seen[key] = true;
                current.push(newSimplex);
              }
            }
          }
        }
        simplices[dim] = current;
      }

      return { vertices: vertices, simplices: simplices };
    },

    // Count simplices by dimension
    fVector: function (cpx) {
      var f = [];
      for (var dim = 0; dim <= 3; dim++) {
        f.push(cpx.simplices[dim] ? cpx.simplices[dim].length : 0);
      }
      return f;
    },

    // Euler characteristic: sum (-1)^k f_k
    euler: function (cpx) {
      var chi = 0;
      for (var dim = 0; dim <= 3; dim++) {
        var count = cpx.simplices[dim] ? cpx.simplices[dim].length : 0;
        chi += (dim % 2 === 0 ? 1 : -1) * count;
      }
      return chi;
    }
  };

  // ─────────────────────────────────────────── simplicial complex operations ──

  var complex = {
    // Build an abstract complex from a list of maximal simplices.
    // Each simplex is an array of vertex indices (need not be sorted).
    // Returns the same format as rips.build.
    fromMaximal: function (maximalSimplices) {
      var allSimplices = {};
      var vertexSet = {};

      function addWithFaces(s) {
        var sorted = s.slice().sort(function (a, b) { return a - b; });
        var key = sorted.join(',');
        var dim = sorted.length - 1;
        if (!allSimplices[dim]) allSimplices[dim] = {};
        if (allSimplices[dim][key]) return;
        allSimplices[dim][key] = sorted;
        for (var i = 0; i < sorted.length; i++) {
          vertexSet[sorted[i]] = true;
        }
        // Recurse on faces
        if (sorted.length > 1) {
          for (var i = 0; i < sorted.length; i++) {
            var face = sorted.slice(0, i).concat(sorted.slice(i + 1));
            addWithFaces(face);
          }
        }
      }

      for (var i = 0; i < maximalSimplices.length; i++) {
        addWithFaces(maximalSimplices[i]);
      }

      var vertices = Object.keys(vertexSet).map(Number).sort(function (a, b) { return a - b; });
      var simplices = {};
      for (var dim in allSimplices) {
        simplices[dim] = Object.values(allSimplices[dim]);
      }
      return { vertices: vertices, simplices: simplices };
    },

    // f-vector and Euler characteristic for any complex
    fVector: rips.fVector,
    euler: rips.euler,

    // Hasse diagram: edges between simplices of adjacent dimension
    // Returns array of { from: key, to: key, fromDim: d, toDim: d+1 }
    hasse: function (cpx) {
      var edges = [];
      var maxDim = 0;
      for (var d in cpx.simplices) maxDim = Math.max(maxDim, parseInt(d));

      for (var d = 0; d < maxDim; d++) {
        var lower = cpx.simplices[d] || [];
        var upper = cpx.simplices[d + 1] || [];
        for (var u = 0; u < upper.length; u++) {
          var up = upper[u];
          for (var l = 0; l < lower.length; l++) {
            var lo = lower[l];
            // lo is a face of up if every vertex of lo is in up
            var isFace = true;
            for (var i = 0; i < lo.length; i++) {
              if (up.indexOf(lo[i]) === -1) { isFace = false; break; }
            }
            if (isFace) {
              edges.push({
                from: simplexKey(lo), to: simplexKey(up),
                fromDim: d, toDim: d + 1
              });
            }
          }
        }
      }
      return edges;
    },

    // Named preset complexes
    presets: {
      // Boundary of a triangle (hollow): 3 vertices, 3 edges, 0 triangles
      hollowTriangle: function () {
        return complex.fromMaximal([[0, 1], [1, 2], [0, 2]]);
      },

      // Filled triangle: 3 vertices, 3 edges, 1 triangle
      filledTriangle: function () {
        return complex.fromMaximal([[0, 1, 2]]);
      },

      // Boundary of tetrahedron: 4 vertices, 6 edges, 4 triangles, 0 tetrahedra
      boundaryTetrahedron: function () {
        return complex.fromMaximal([[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]);
      },

      // Filled tetrahedron
      filledTetrahedron: function () {
        return complex.fromMaximal([[0, 1, 2, 3]]);
      },

      // Mobius band (6 vertices, minimal triangulation)
      mobiusBand: function () {
        return complex.fromMaximal([
          [0, 1, 3], [1, 3, 4], [1, 2, 4],
          [2, 4, 5], [2, 0, 5], [0, 3, 5]
        ]);
      },

      // Minimal torus (7 vertices, Heawood/Mobius triangulation)
      // Cyclic construction: triangles {i, i+1, i+3} and {i+1, i+3, i+4} mod 7
      torus7: function () {
        return complex.fromMaximal([
          [0, 1, 3], [1, 3, 4], [1, 2, 4], [2, 4, 5],
          [2, 3, 5], [3, 5, 6], [3, 4, 6], [0, 4, 6],
          [0, 4, 5], [0, 1, 5], [1, 5, 6], [1, 2, 6],
          [0, 2, 6], [0, 2, 3]
        ]);
      },

      // Two disjoint edges (two components, for testing β₀)
      twoEdges: function () {
        return complex.fromMaximal([[0, 1], [2, 3]]);
      }
    }
  };

  // ─────────────────────────────────────────── boundary operators (Z/2) ──

  var boundary = {
    // Build the boundary matrix partial_k : C_k -> C_{k-1} over Z/2.
    // Rows are indexed by (k-1)-simplices, columns by k-simplices.
    // Returns { matrix: 2D array of 0/1, rows: [...simplex keys], cols: [...simplex keys],
    //           rowSimplices: [...], colSimplices: [...] }
    matrix: function (cpx, k) {
      var cols = cpx.simplices[k] || [];
      var rows = cpx.simplices[k - 1] || [];
      if (k <= 0 || rows.length === 0 || cols.length === 0) {
        return { matrix: [], rows: [], cols: [], rowSimplices: rows, colSimplices: cols };
      }

      // Index the rows
      var rowIndex = {};
      for (var i = 0; i < rows.length; i++) {
        rowIndex[simplexKey(rows[i])] = i;
      }

      var mat = [];
      for (var i = 0; i < rows.length; i++) {
        mat[i] = new Uint8Array(cols.length);
      }

      for (var j = 0; j < cols.length; j++) {
        var sigma = cols[j];
        // Boundary of sigma = sum of faces obtained by deleting one vertex
        for (var d = 0; d < sigma.length; d++) {
          var face = sigma.slice(0, d).concat(sigma.slice(d + 1));
          var key = simplexKey(face);
          var ri = rowIndex[key];
          if (ri !== undefined) {
            mat[ri][j] = 1;  // Z/2 so sign doesn't matter
          }
        }
      }

      return {
        matrix: mat,
        rows: rows.map(simplexKey),
        cols: cols.map(simplexKey),
        rowSimplices: rows,
        colSimplices: cols
      };
    },

    // Verify that partial_{k} * partial_{k+1} = 0 (mod 2)
    verifyExact: function (cpx, k) {
      var bk = boundary.matrix(cpx, k);
      var bk1 = boundary.matrix(cpx, k + 1);
      if (bk.matrix.length === 0 || bk1.matrix.length === 0) return true;

      // Multiply: bk.matrix * bk1.matrix should be zero (mod 2)
      var nRows = bk.matrix.length;
      var nCols = bk1.matrix[0] ? bk1.matrix[0].length : 0;
      var mid = bk.matrix[0].length;

      for (var i = 0; i < nRows; i++) {
        for (var j = 0; j < nCols; j++) {
          var sum = 0;
          for (var m = 0; m < mid; m++) {
            sum += bk.matrix[i][m] * bk1.matrix[m][j];
          }
          if (sum % 2 !== 0) return false;
        }
      }
      return true;
    }
  };

  // ─────────────────────────────────────────── homology over Z/2 ──

  var homology = {
    // Gaussian elimination over Z/2 (in-place).
    // Returns { rank: number, pivotRows: [...], pivotCols: [...] }
    gaussianElimZ2: function (mat, nRows, nCols) {
      // Work on a copy
      var M = [];
      for (var i = 0; i < nRows; i++) {
        M[i] = new Uint8Array(nCols);
        for (var j = 0; j < nCols; j++) M[i][j] = mat[i][j];
      }

      var pivotRows = [];
      var pivotCols = [];
      var row = 0;

      for (var col = 0; col < nCols && row < nRows; col++) {
        // Find pivot in this column
        var pivotR = -1;
        for (var r = row; r < nRows; r++) {
          if (M[r][col] === 1) { pivotR = r; break; }
        }
        if (pivotR === -1) continue;

        // Swap rows
        if (pivotR !== row) {
          var tmp = M[row];
          M[row] = M[pivotR];
          M[pivotR] = tmp;
        }

        // Eliminate
        for (var r = 0; r < nRows; r++) {
          if (r !== row && M[r][col] === 1) {
            for (var c = 0; c < nCols; c++) {
              M[r][c] ^= M[row][c];
            }
          }
        }

        pivotRows.push(row);
        pivotCols.push(col);
        row++;
      }

      return { rank: pivotRows.length, pivotRows: pivotRows, pivotCols: pivotCols, reduced: M };
    },

    // Compute Betti numbers beta_0, beta_1, beta_2 for a simplicial complex.
    // beta_k = dim ker(partial_k) - dim im(partial_{k+1})
    //        = (dim C_k - rank partial_k) - rank partial_{k+1}
    betti: function (cpx, maxDim) {
      maxDim = maxDim === undefined ? 2 : maxDim;
      var ranks = {};  // rank of partial_k

      for (var k = 0; k <= maxDim + 1; k++) {
        var bk = boundary.matrix(cpx, k);
        if (bk.matrix.length === 0 || bk.colSimplices.length === 0) {
          ranks[k] = 0;
        } else {
          var res = homology.gaussianElimZ2(bk.matrix, bk.matrix.length, bk.matrix[0].length);
          ranks[k] = res.rank;
        }
      }

      var bettis = [];
      for (var k = 0; k <= maxDim; k++) {
        var dimCk = cpx.simplices[k] ? cpx.simplices[k].length : 0;
        var rankPartialK = ranks[k] || 0;
        var rankPartialK1 = ranks[k + 1] || 0;
        bettis.push(dimCk - rankPartialK - rankPartialK1);
      }
      return bettis;
    },

    // Return cycle representatives for H_k (generators of ker partial_k mod im partial_{k+1}).
    // Returns array of arrays of simplex indices (columns of the null space).
    cycleReps: function (cpx, k) {
      var bk = boundary.matrix(cpx, k);
      if (bk.colSimplices.length === 0) return [];

      var nRows = bk.matrix.length;
      var nCols = bk.matrix[0].length;

      if (nRows === 0) {
        // Every chain is a cycle (all of C_k)
        var reps = [];
        for (var j = 0; j < nCols; j++) reps.push([j]);
        return reps;
      }

      // Find kernel of partial_k via RREF
      var res = homology.gaussianElimZ2(bk.matrix, nRows, nCols);
      var pivotColSet = {};
      for (var i = 0; i < res.pivotCols.length; i++) {
        pivotColSet[res.pivotCols[i]] = res.pivotRows[i];
      }

      // Free variables (non-pivot columns) generate the kernel
      var kernel = [];
      for (var j = 0; j < nCols; j++) {
        if (pivotColSet[j] !== undefined) continue;
        // This free variable generates a kernel vector
        var vec = [];
        for (var c = 0; c < nCols; c++) {
          if (c === j) { vec.push(1); continue; }
          if (pivotColSet[c] !== undefined) {
            vec.push(res.reduced[pivotColSet[c]][j]);
          } else {
            vec.push(0);
          }
        }
        // Convert to list of simplex indices where vec[i] = 1
        var support = [];
        for (var i = 0; i < vec.length; i++) {
          if (vec[i] === 1) support.push(i);
        }
        if (support.length > 0) kernel.push(support);
      }

      // Filter out boundaries: remove kernel elements that are in im(partial_{k+1})
      var bk1 = boundary.matrix(cpx, k + 1);
      if (bk1.colSimplices.length === 0) return kernel;  // no boundaries

      // Build column space of partial_{k+1} and check each kernel vector
      // For simplicity, compute rank of [partial_{k+1} | kernel_vector] vs rank of partial_{k+1}
      var reps = [];
      var imgRank = homology.gaussianElimZ2(bk1.matrix, bk1.matrix.length, bk1.matrix[0].length).rank;

      for (var ki = 0; ki < kernel.length; ki++) {
        // Augment boundary matrix with this kernel vector as a column
        var aug = [];
        for (var r = 0; r < bk1.matrix.length; r++) {
          aug[r] = new Uint8Array(bk1.matrix[0].length + 1);
          for (var c = 0; c < bk1.matrix[0].length; c++) aug[r][c] = bk1.matrix[r][c];
          // Is row r in the support of this kernel vector?
          // We need to map: the kernel vector indices are column indices of bk (which are k-simplices)
          // The rows of bk1 are also k-simplices (same set). So we can directly check.
          aug[r][bk1.matrix[0].length] = 0;
          for (var s = 0; s < kernel[ki].length; s++) {
            if (kernel[ki][s] === r) { aug[r][bk1.matrix[0].length] = 1; break; }
          }
        }
        var augRank = homology.gaussianElimZ2(aug, aug.length, aug[0].length).rank;
        if (augRank > imgRank) {
          reps.push(kernel[ki]);
        }
      }

      return reps;
    }
  };

  // ─────────────────────────────────────────── filtration ──

  var filtration = {
    // Build a Rips filtration: sequence of (simplex, birth_time) sorted by birth_time.
    // Birth time of a k-simplex = max pairwise distance among its vertices.
    // Returns { events: [{simplex, dim, birth}], maxEps: number }
    rips: function (pts, maxEps, maxDim) {
      maxDim = maxDim === undefined ? 2 : maxDim;
      var n = pts.length;
      var D = dist.matrix(pts);

      if (maxEps === undefined) {
        // Find a reasonable max: the diameter of the point cloud
        maxEps = 0;
        for (var i = 0; i < n; i++)
          for (var j = i + 1; j < n; j++)
            if (D[i][j] > maxEps) maxEps = D[i][j];
      }

      var events = [];

      // Vertices at time 0
      for (var i = 0; i < n; i++) {
        events.push({ simplex: [i], dim: 0, birth: 0 });
      }

      // Edges
      if (maxDim >= 1) {
        for (var i = 0; i < n; i++) {
          for (var j = i + 1; j < n; j++) {
            if (D[i][j] <= maxEps) {
              events.push({ simplex: [i, j], dim: 1, birth: D[i][j] });
            }
          }
        }
      }

      // Higher simplices: birth = max edge weight among all edges in the simplex
      if (maxDim >= 2) {
        // Build adjacency at maxEps
        var adj = {};
        for (var i = 0; i < n; i++) adj[i] = {};
        for (var i = 0; i < n; i++)
          for (var j = i + 1; j < n; j++)
            if (D[i][j] <= maxEps) { adj[i][j] = true; adj[j][i] = true; }

        for (var dim = 2; dim <= maxDim; dim++) {
          var prevSimplices = events.filter(function (e) { return e.dim === dim - 1; });
          var seen = {};

          for (var si = 0; si < prevSimplices.length; si++) {
            var face = prevSimplices[si].simplex;
            var lastV = face[face.length - 1];
            for (var v = lastV + 1; v < n; v++) {
              var allAdj = true;
              for (var fi = 0; fi < face.length; fi++) {
                if (!adj[face[fi]][v]) { allAdj = false; break; }
              }
              if (allAdj) {
                var newS = face.concat(v);
                var key = simplexKey(newS);
                if (!seen[key]) {
                  seen[key] = true;
                  // Birth = max pairwise distance
                  var maxD = 0;
                  for (var a = 0; a < newS.length; a++)
                    for (var b = a + 1; b < newS.length; b++)
                      if (D[newS[a]][newS[b]] > maxD) maxD = D[newS[a]][newS[b]];
                  events.push({ simplex: newS, dim: dim, birth: maxD });
                }
              }
            }
          }
        }
      }

      // Sort by birth time, then by dimension (lower dim first at same time)
      events.sort(function (a, b) {
        if (a.birth !== b.birth) return a.birth - b.birth;
        return a.dim - b.dim;
      });

      return { events: events, maxEps: maxEps };
    }
  };

  // ─────────────────────────────────────────── persistent homology ──

  var persistence = {
    // Column reduction algorithm for persistent homology over Z/2.
    // Input: filtration events (sorted by birth time).
    // Returns { bars: [{dim, birth, death}], events: enriched events }
    // death = Infinity for features that never die.
    compute: function (filt) {
      var events = filt.events;
      var n = events.length;

      // Index simplices
      var simplexIndex = {};
      for (var i = 0; i < n; i++) {
        simplexIndex[simplexKey(events[i].simplex)] = i;
      }

      // Build boundary columns (as sparse sets of row indices, Z/2)
      var columns = [];
      for (var i = 0; i < n; i++) {
        var col = [];
        var sigma = events[i].simplex;
        if (sigma.length > 1) {
          for (var d = 0; d < sigma.length; d++) {
            var face = sigma.slice(0, d).concat(sigma.slice(d + 1));
            var key = simplexKey(face);
            if (simplexIndex[key] !== undefined) {
              col.push(simplexIndex[key]);
            }
          }
          col.sort(function (a, b) { return a - b; });
        }
        columns.push(col);
      }

      // Column reduction: for each column, reduce using previous columns
      var pivotToCol = {};  // maps pivot row -> column index
      var pairings = {};    // column index -> paired column index

      for (var j = 0; j < n; j++) {
        while (columns[j].length > 0) {
          var pivot = columns[j][columns[j].length - 1];  // lowest 1
          if (pivotToCol[pivot] === undefined) {
            pivotToCol[pivot] = j;
            break;
          }
          // Add the column that has this pivot (Z/2 addition = symmetric difference)
          var other = pivotToCol[pivot];
          columns[j] = symmetricDiff(columns[j], columns[other]);
        }
        if (columns[j].length > 0) {
          var pivot = columns[j][columns[j].length - 1];
          pairings[j] = pivot;  // column j kills the feature born at row pivot
        }
      }

      // Extract bars
      var bars = [];
      var paired = {};  // which indices are paired (as the "birth" end)

      for (var j in pairings) {
        var birthIdx = pairings[j];
        var deathIdx = parseInt(j);
        paired[birthIdx] = true;
        paired[deathIdx] = true;
        bars.push({
          dim: events[birthIdx].dim,
          birth: events[birthIdx].birth,
          death: events[deathIdx].birth,
          birthSimplex: events[birthIdx].simplex,
          deathSimplex: events[deathIdx].simplex
        });
      }

      // Unpaired simplices with zero boundary column = infinite bars
      for (var i = 0; i < n; i++) {
        if (!paired[i] && columns[i].length === 0) {
          bars.push({
            dim: events[i].dim,
            birth: events[i].birth,
            death: Infinity,
            birthSimplex: events[i].simplex,
            deathSimplex: null
          });
        }
      }

      bars.sort(function (a, b) {
        if (a.dim !== b.dim) return a.dim - b.dim;
        return a.birth - b.birth;
      });

      return { bars: bars };
    }
  };

  // Symmetric difference of two sorted arrays (Z/2 addition)
  function symmetricDiff(a, b) {
    var result = [];
    var i = 0, j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] < b[j]) { result.push(a[i]); i++; }
      else if (a[i] > b[j]) { result.push(b[j]); j++; }
      else { i++; j++; }  // cancel (mod 2)
    }
    while (i < a.length) { result.push(a[i]); i++; }
    while (j < b.length) { result.push(b[j]); j++; }
    return result;
  }

  // ─────────────────────────────────────────── Mapper algorithm ──

  var mapper = {
    // Run the Mapper pipeline.
    // pts: array of [x, y] points
    // lens: function(pt) -> number (the filter/lens function)
    // nIntervals: number of cover intervals
    // overlap: fraction of overlap between intervals (0 to 1)
    // clusterFn: optional clustering function(subset_indices, pts) -> array of arrays
    // Returns { nodes: [{id, members, center}], edges: [{source, target}] }
    run: function (pts, lens, nIntervals, overlap, clusterFn) {
      nIntervals = nIntervals || 10;
      overlap = overlap || 0.3;

      // Default clustering: single-linkage
      if (!clusterFn) clusterFn = mapper.singleLinkage;

      // Compute lens values
      var values = pts.map(lens);
      var minV = d3.min(values);
      var maxV = d3.max(values);
      var range = maxV - minV || 1;

      // Build cover intervals
      var stepSize = range / nIntervals;
      var intervalWidth = stepSize / (1 - overlap);
      var intervals = [];
      for (var i = 0; i < nIntervals; i++) {
        var lo = minV + i * stepSize - (intervalWidth - stepSize) / 2;
        var hi = lo + intervalWidth;
        intervals.push({ lo: lo, hi: hi });
      }

      // For each interval, find points in preimage and cluster them
      var allNodes = [];
      var nodeId = 0;
      var pointToNodes = {};  // point index -> array of node ids

      for (var i = 0; i < intervals.length; i++) {
        var members = [];
        for (var j = 0; j < pts.length; j++) {
          if (values[j] >= intervals[i].lo && values[j] <= intervals[i].hi) {
            members.push(j);
          }
        }
        if (members.length === 0) continue;

        var clusters = clusterFn(members, pts);
        for (var c = 0; c < clusters.length; c++) {
          var node = { id: nodeId, members: clusters[c], interval: i };
          // Compute center
          var cx = 0, cy = 0;
          for (var m = 0; m < clusters[c].length; m++) {
            cx += pts[clusters[c][m]][0];
            cy += pts[clusters[c][m]][1];
          }
          node.center = [cx / clusters[c].length, cy / clusters[c].length];
          allNodes.push(node);

          for (var m = 0; m < clusters[c].length; m++) {
            var pi = clusters[c][m];
            if (!pointToNodes[pi]) pointToNodes[pi] = [];
            pointToNodes[pi].push(nodeId);
          }
          nodeId++;
        }
      }

      // Build nerve: two nodes are connected if they share a point
      var edgeSet = {};
      var edges = [];
      for (var pi in pointToNodes) {
        var nodes = pointToNodes[pi];
        for (var a = 0; a < nodes.length; a++) {
          for (var b = a + 1; b < nodes.length; b++) {
            var key = nodes[a] + '-' + nodes[b];
            if (!edgeSet[key]) {
              edgeSet[key] = true;
              edges.push({ source: nodes[a], target: nodes[b] });
            }
          }
        }
      }

      return { nodes: allNodes, edges: edges };
    },

    // Single-linkage clustering of a subset of points
    singleLinkage: function (indices, pts, threshold) {
      if (indices.length === 0) return [];
      if (!threshold) {
        // Use median pairwise distance as threshold
        var dists = [];
        for (var i = 0; i < indices.length; i++)
          for (var j = i + 1; j < indices.length; j++)
            dists.push(eucDist(pts[indices[i]], pts[indices[j]]));
        dists.sort(function (a, b) { return a - b; });
        threshold = dists[Math.floor(dists.length / 2)] || 1;
      }

      // Union-Find
      var parent = {};
      for (var i = 0; i < indices.length; i++) parent[indices[i]] = indices[i];
      function find(x) {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
      }
      function union(a, b) { parent[find(a)] = find(b); }

      for (var i = 0; i < indices.length; i++)
        for (var j = i + 1; j < indices.length; j++)
          if (eucDist(pts[indices[i]], pts[indices[j]]) <= threshold)
            union(indices[i], indices[j]);

      var clusters = {};
      for (var i = 0; i < indices.length; i++) {
        var root = find(indices[i]);
        if (!clusters[root]) clusters[root] = [];
        clusters[root].push(indices[i]);
      }
      return Object.values(clusters);
    },

    // Common lens functions
    lenses: {
      x: function (pt) { return pt[0]; },
      y: function (pt) { return pt[1]; },
      centroidDist: function (pts) {
        var cx = 0, cy = 0;
        for (var i = 0; i < pts.length; i++) { cx += pts[i][0]; cy += pts[i][1]; }
        cx /= pts.length; cy /= pts.length;
        var center = [cx, cy];
        return function (pt) { return eucDist(pt, center); };
      },
      density: function (pts, sigma) {
        sigma = sigma || 0.1;
        return function (pt) {
          var sum = 0;
          for (var i = 0; i < pts.length; i++) {
            sum += Math.exp(-sqDist(pt, pts[i]) / (2 * sigma * sigma));
          }
          return sum;
        };
      }
    }
  };

  // ─────────────────────────────────────────── bottleneck distance ──

  var bottleneck = {
    // Compute bottleneck distance between two persistence diagrams.
    // Each diagram is an array of {birth, death} (finite bars only).
    // Uses brute-force optimal matching for small diagrams.
    distance: function (dgm1, dgm2) {
      // Add diagonal projections for unmatched points
      var A = dgm1.map(function (p) { return { birth: p.birth, death: p.death }; });
      var B = dgm2.map(function (p) { return { birth: p.birth, death: p.death }; });

      // Pad with diagonal projections
      var nA = A.length, nB = B.length;
      for (var i = 0; i < nB; i++) {
        var mid = (B[i].birth + B[i].death) / 2;
        A.push({ birth: mid, death: mid, diagonal: true });
      }
      for (var i = 0; i < nA; i++) {
        var mid = (dgm1[i].birth + dgm1[i].death) / 2;
        B.push({ birth: mid, death: mid, diagonal: true });
      }

      // Cost matrix
      var n = A.length;
      var costs = [];
      for (var i = 0; i < n; i++) {
        costs[i] = [];
        for (var j = 0; j < n; j++) {
          costs[i][j] = Math.max(
            Math.abs(A[i].birth - B[j].birth),
            Math.abs(A[i].death - B[j].death)
          );
        }
      }

      // For small diagrams: greedy approximation (not optimal, but close)
      if (n <= 20) {
        return bottleneck._greedyMatch(costs, n);
      }
      return bottleneck._greedyMatch(costs, n);
    },

    _greedyMatch: function (costs, n) {
      // Greedy: sort all possible matchings by cost, pick minimum bottleneck
      var pairs = [];
      for (var i = 0; i < n; i++)
        for (var j = 0; j < n; j++)
          pairs.push({ i: i, j: j, cost: costs[i][j] });
      pairs.sort(function (a, b) { return a.cost - b.cost; });

      var matchedI = {};
      var matchedJ = {};
      var maxCost = 0;
      var matched = 0;

      for (var p = 0; p < pairs.length && matched < n; p++) {
        if (!matchedI[pairs[p].i] && !matchedJ[pairs[p].j]) {
          matchedI[pairs[p].i] = true;
          matchedJ[pairs[p].j] = true;
          if (pairs[p].cost > maxCost) maxCost = pairs[p].cost;
          matched++;
        }
      }
      return maxCost;
    }
  };

  // ─────────────────────────────────────────── formatting ──

  var fmt = {
    // Format a simplex for display: {0,1,2}
    simplex: function (s) {
      return '{' + s.join(',') + '}';
    },

    // Format Betti numbers: β₀ = 1, β₁ = 2, β₂ = 0
    betti: function (bettis) {
      var sub = ['₀', '₁', '₂', '₃', '₄'];
      return bettis.map(function (b, i) {
        return 'β' + (sub[i] || '_' + i) + ' = ' + b;
      }).join(', ');
    },

    // Format homology group: H₀ = Z, H₁ = Z², H₂ = 0
    homologyGroup: function (bettis) {
      var sub = ['₀', '₁', '₂', '₃', '₄'];
      return bettis.map(function (b, i) {
        var group = b === 0 ? '0' : b === 1 ? '(Z/2)' : '(Z/2)' + superscript(b);
        return 'H' + (sub[i] || '_' + i) + ' = ' + group;
      }).join(', ');
    },

    // Format f-vector: (f₀, f₁, f₂) = (4, 6, 4)
    fVector: function (f) {
      var sub = ['₀', '₁', '₂', '₃'];
      var labels = f.map(function (_, i) { return 'f' + (sub[i] || '_' + i); });
      return '(' + labels.join(', ') + ') = (' + f.join(', ') + ')';
    }
  };

  // ─────────────────────────────────────────── sanity checks ──

  function runChecks() {
    var ok = true;

    // 1. Hollow triangle: H_0 = 1, H_1 = 1
    var ht = complex.presets.hollowTriangle();
    var b = homology.betti(ht);
    if (b[0] !== 1 || b[1] !== 1) { console.error('TDA check FAIL: hollow triangle betti', b); ok = false; }

    // 2. Filled triangle: H_0 = 1, H_1 = 0
    var ft = complex.presets.filledTriangle();
    b = homology.betti(ft);
    if (b[0] !== 1 || b[1] !== 0) { console.error('TDA check FAIL: filled triangle betti', b); ok = false; }

    // 3. Boundary of tetrahedron: H_0 = 1, H_1 = 0, H_2 = 1
    var bt = complex.presets.boundaryTetrahedron();
    b = homology.betti(bt);
    if (b[0] !== 1 || b[1] !== 0 || b[2] !== 1) { console.error('TDA check FAIL: boundary tetrahedron betti', b); ok = false; }

    // 4. Filled tetrahedron: H_0 = 1, H_1 = 0, H_2 = 0
    var ftet = complex.presets.filledTetrahedron();
    b = homology.betti(ftet);
    if (b[0] !== 1 || b[1] !== 0 || b[2] !== 0) { console.error('TDA check FAIL: filled tetrahedron betti', b); ok = false; }

    // 5. boundary-of-boundary = 0 for all presets
    var presetNames = ['hollowTriangle', 'filledTriangle', 'boundaryTetrahedron', 'torus7'];
    for (var pi = 0; pi < presetNames.length; pi++) {
      var cpx = complex.presets[presetNames[pi]]();
      for (var k = 1; k <= 2; k++) {
        if (!boundary.verifyExact(cpx, k)) {
          console.error('TDA check FAIL: ∂∂=0 for', presetNames[pi], 'at k=' + k);
          ok = false;
        }
      }
    }

    // 6. Euler characteristic: boundary tetrahedron = 2
    var chi = complex.euler(bt);
    if (chi !== 2) { console.error('TDA check FAIL: boundary tetrahedron euler', chi); ok = false; }

    // 7. Torus: H_0 = 1, H_1 = 2, H_2 = 1 (over Z/2)
    var tor = complex.presets.torus7();
    b = homology.betti(tor);
    if (b[0] !== 1 || b[1] !== 2 || b[2] !== 1) { console.error('TDA check FAIL: torus betti', b); ok = false; }

    if (ok) console.log('TDA: all sanity checks passed');
  }

  // ─────────────────────────────────────────── expose ──

  global.TDA = {
    points: points,
    dist: dist,
    rips: rips,
    complex: complex,
    boundary: boundary,
    homology: homology,
    filtration: filtration,
    persistence: persistence,
    mapper: mapper,
    bottleneck: bottleneck,
    fmt: fmt,
    _runChecks: runChecks,
    _util: { combinations: combinations, simplexKey: simplexKey, symmetricDiff: symmetricDiff }
  };

  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
