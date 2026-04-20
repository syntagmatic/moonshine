// atlas-of-atlases shared helpers
// Exposed under window.Atlas.

(function () {
  'use strict';

  // ---- Series manifest -----------------------------------------------------
  // Every atlas-of-atlases figure references nodes by { series, title, num? }.
  // This manifest is the single source of truth for colors, tags, counts.
  var SERIES = [
    { key: 'emergence',                 title: 'Emergence',                     count: 43, color: '#059669',
      tags: ['local-rules', 'self-org', 'dynamics', 'agent-based'],
      href: '../emergence/index.html' },
    { key: 'sph',                       title: 'SPH',                           count: 4,  color: '#0891b2',
      tags: ['particles', 'gpu', 'dynamics', 'fluid'],
      href: '../sph/index.html' },
    { key: 'algorithms-ml',             title: 'Algorithms & ML',               count: 12, color: '#dc2626',
      tags: ['optimization', 'spectral', 'data', 'dynamics'],
      href: '../algorithms-ml/index.html' },
    { key: 'decision-trees',            title: 'Decision Trees',                count: 8,  color: '#b91c1c',
      tags: ['data', 'trees', 'combinatorial'],
      href: '../decision-trees/index.html' },
    { key: 'bioinformatics',            title: 'Bioinformatics',                count: 15, color: '#16a34a',
      tags: ['data', 'genomics', 'graphs'],
      href: '../bioinformatics/index.html' },
    { key: 'grateful-dead',             title: 'Grateful Dead',                 count: 7,  color: '#c026d3',
      tags: ['data', 'networks', 'time-series'],
      href: '../grateful-dead/index.html' },
    { key: 'japan-earthquakes',         title: 'Japan Earthquakes',             count: 20, color: '#ea580c',
      tags: ['data', 'geospatial', 'time-series', 'dynamics'],
      href: '../japan-earthquakes/index.html' },
    { key: 'parallel-coordinates',      title: 'Parallel Coordinates',          count: 23, color: '#2563eb',
      tags: ['data', 'geometry', 'duality', 'polytopes'],
      href: '../parallel-coordinates/index.html' },
    { key: 'exceptional-atlas',         title: 'Exceptional Atlas',             count: 17, color: '#7c3aed',
      tags: ['groups', 'geometry', 'lattices', 'lie'],
      href: '../exceptional-atlas/index.html' },
    { key: 'mathematical-diagrams',     title: 'Visual Language of Algebra',    count: 14, color: '#8b5cf6',
      tags: ['diagrams', 'groups', 'graphs', 'posets'],
      href: '../mathematical-diagrams/index.html' },
    { key: 'modular-forms',             title: 'Modular Forms',                 count: 20, color: '#a855f7',
      tags: ['groups', 'geometry', 'spectral', 'hyperbolic'],
      href: '../modular-forms/index.html' },
    { key: 'noether',                   title: 'Invariance: Noether',           count: 15, color: '#9333ea',
      tags: ['groups', 'dynamics', 'algebra'],
      href: '../noether/index.html' },
    { key: 'game-is-the-math',          title: 'The Game Is the Math',          count: 15, color: '#0d9488',
      tags: ['combinatorial', 'trees', 'values'],
      href: '../game-is-the-math/index.html' },
    { key: 'information-geometry',      title: 'Information Geometry',          count: 15, color: '#1d4ed8',
      tags: ['geometry', 'statistics', 'manifold', 'bayesian'],
      href: '../information-geometry/index.html' },
    { key: 'topological-data-analysis', title: 'Topological Data Analysis',     count: 3,  color: '#be123c',
      tags: ['topology', 'graphs', 'data', 'spectral'],
      href: '../topological-data-analysis/index.html' },
    { key: 'd3-power-tools',            title: 'D3 Power Tools',                count: 37, color: '#475569',
      tags: ['visualization', 'idioms', 'interaction'],
      href: '../d3-power-tools/index.html' },
    { key: 'autoresearch',              title: 'Autoresearch',                  count: 13, color: '#be185d',
      tags: ['ai', 'iteration', 'data', 'statistics'],
      href: '../autoresearch/index.html' },
    { key: 'directions',                title: 'Future Directions',             count: 24, color: '#334155',
      tags: ['design', 'visualization', 'process'],
      href: '../directions/index.html' },
    { key: 'type-systems',              title: 'Type Systems',                  count: 12, color: '#f59e0b',
      tags: ['types', 'groups', 'geometry', 'algebra'],
      href: '../type-systems/index.html' },
    { key: 'lithium-ion',               title: 'The Lithium-Ion Cell',          count: 7,  color: '#84cc16',
      tags: ['physics', 'dynamics', 'spectral'],
      href: '../lithium-ion/index.html' },
    { key: 'lattice-simulation',        title: 'Simulating on a Lattice',       count: 15, color: '#6366f1',
      tags: ['groups', 'lattices', 'dynamics', 'graphs'],
      href: '../lattice-simulation/index.html' }
  ];

  var byKey = {};
  SERIES.forEach(function (s) { byKey[s.key] = s; });

  // ---- Poset primitives ----------------------------------------------------

  // Transitive closure of a DAG. edges: [[parent,child], ...]  returns set of "a>b".
  function transitiveClosure(nodes, edges) {
    var adj = {};
    nodes.forEach(function (n) { adj[n] = {}; });
    edges.forEach(function (e) { adj[e[0]][e[1]] = true; });
    // Floyd-Warshall-ish closure
    var changed = true;
    while (changed) {
      changed = false;
      nodes.forEach(function (a) {
        nodes.forEach(function (b) {
          if (adj[a][b]) {
            nodes.forEach(function (c) {
              if (adj[b][c] && !adj[a][c]) { adj[a][c] = true; changed = true; }
            });
          }
        });
      });
    }
    return adj;
  }

  // Up-cone: ancestors of node (incl. self). Down-cone: descendants.
  function upCone(node, edges) {
    var parents = {}; edges.forEach(function (e) {
      (parents[e[1]] = parents[e[1]] || []).push(e[0]);
    });
    var seen = {}; seen[node] = true;
    var stack = [node];
    while (stack.length) {
      var n = stack.pop();
      (parents[n] || []).forEach(function (p) {
        if (!seen[p]) { seen[p] = true; stack.push(p); }
      });
    }
    return seen;
  }
  function downCone(node, edges) {
    var children = {}; edges.forEach(function (e) {
      (children[e[0]] = children[e[0]] || []).push(e[1]);
    });
    var seen = {}; seen[node] = true;
    var stack = [node];
    while (stack.length) {
      var n = stack.pop();
      (children[n] || []).forEach(function (c) {
        if (!seen[c]) { seen[c] = true; stack.push(c); }
      });
    }
    return seen;
  }

  // Assign rank (longest path from any root) for layered layout.
  function layerize(nodes, edges) {
    var children = {}, parents = {};
    nodes.forEach(function (n) { children[n] = []; parents[n] = []; });
    edges.forEach(function (e) { children[e[0]].push(e[1]); parents[e[1]].push(e[0]); });
    var rank = {};
    function rankOf(n) {
      if (n in rank) return rank[n];
      if (parents[n].length === 0) { rank[n] = 0; return 0; }
      var r = 1 + Math.max.apply(null, parents[n].map(rankOf));
      rank[n] = r;
      return r;
    }
    nodes.forEach(rankOf);
    return rank;
  }

  // Group nodes by rank into layers, then order by given `order` array index (stable).
  function layout(nodes, edges, opts) {
    opts = opts || {};
    var rank = layerize(nodes, edges);
    var layers = {};
    nodes.forEach(function (n) {
      var r = rank[n];
      (layers[r] = layers[r] || []).push(n);
    });
    var maxRank = Math.max.apply(null, Object.values(rank));
    var xPad = opts.xPad || 30;
    var yPad = opts.yPad || 30;
    var W = opts.W || 720;
    var H = opts.H || 360;
    var pos = {};
    for (var r = 0; r <= maxRank; r++) {
      var row = layers[r] || [];
      row.sort(function (a, b) {
        return (opts.orderIdx && opts.orderIdx[a] - opts.orderIdx[b]) || a.localeCompare(b);
      });
      // y: top=high rank (supergroups up) so invert
      var y = H - yPad - (r / Math.max(1, maxRank)) * (H - 2 * yPad);
      if (opts.direction === 'downward') y = yPad + (r / Math.max(1, maxRank)) * (H - 2 * yPad);
      row.forEach(function (n, i) {
        var x = xPad + ((i + 1) / (row.length + 1)) * (W - 2 * xPad);
        pos[n] = { x: x, y: y, rank: r };
      });
    }
    return { pos: pos, rank: rank, maxRank: maxRank, layers: layers };
  }

  // ---- Tag mapping ---------------------------------------------------------

  // Given a tag, return all series whose manifest tag-list matches.
  function seriesWithTag(tag) {
    return SERIES.filter(function (s) { return s.tags.indexOf(tag) >= 0; });
  }

  // ---- Public export -------------------------------------------------------

  window.Atlas = {
    SERIES: SERIES,
    byKey: byKey,
    transitiveClosure: transitiveClosure,
    upCone: upCone,
    downCone: downCone,
    layerize: layerize,
    layout: layout,
    seriesWithTag: seriesWithTag
  };
})();
