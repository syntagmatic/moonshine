// noether-viz.js — shared visual conventions for the Noether series.
//
// Attaches to the same `NOETHER` global as noether-math.js. Loads after it.
// Holds the color palette, a few reusable SVG helpers, and a thin figure
// scaffold. Keeping this file small is deliberate — figure-specific code
// belongs in the per-explainer HTML, not here. Only put something in
// noether-viz.js if at least two explainers need it the same way.

(function (global) {
  'use strict';

  if (!global.NOETHER) {
    throw new Error('[NOETHER] noether-viz.js must be loaded after noether-math.js');
  }

  var NOETHER = global.NOETHER;

  // ───────────────────────────────────────────── color palette ─────
  // Semantic colors chosen to match the SPH register. Also exposed as CSS
  // custom properties when an explainer calls `installCSSVariables()`.

  var colors = {
    // Neutrals and accents
    bg:        '#fafafa',
    figBg:     '#ffffff',
    border:    '#e2e2e8',
    text:      '#1a1a2e',
    text2:     '#4a4a6a',
    accent:    '#2563eb',
    accentLight: '#dbeafe',

    // Noether-specific semantic colors
    invariant: '#059669', // emerald — a quantity/object that survives
    broken:    '#dc2626', // red     — a quantity/object that does not survive
    symmetry:  '#7c3aed', // violet  — a symmetry generator or group element
    orbit:     '#f59e0b', // amber   — points in the orbit of a base point
    stabilizer:'#059669', // same as invariant (a subgroup that fixes something)
    selected:  '#dc2626', // red     — the "currently picked" object
    highlight: '#f59e0b', // amber   — hover highlight
    axis:      '#64748b', // slate
    grid:      '#e2e8f0', // faint slate
    lattice:   '#0f172a', // near-black for dense point clouds

    // Conservation law colors (for Act II)
    energy:    '#0ea5e9', // sky
    momentum:  '#8b5cf6', // violet
    angular:   '#f97316', // orange
    charge:    '#ec4899'  // pink
  };

  // Palette entries go through lib/theme.js (loaded later, so resolved at draw
  // time) to get their dark-mode hex when the reader's system is dark.
  function themed(c) { return global.Theme ? global.Theme.c(c) : c; }

  // ───────────────────────────────────────────── KaTeX helper ─────
  // Convenience wrapper so each explainer doesn't redefine the same function.
  // Usage: `NOETHER.viz.math('fig-1-label', '\\mathbb{R}^n', false);`

  function renderMath(id, tex, displayMode) {
    if (typeof katex === 'undefined') {
      console.warn('[NOETHER.viz.math] KaTeX not loaded; skipping render of #' + id);
      return;
    }
    var el = document.getElementById(id);
    if (!el) return;
    katex.render(tex, el, { throwOnError: false, displayMode: !!displayMode });
  }

  // ───────────────────────────────────────────── SVG scaffolding ─────
  // Creates a responsive inline SVG inside `container`, sized to a viewBox,
  // and returns a D3 selection for the root and a centered group.

  function makeSVG(container, width, height, translate) {
    var svg = d3.select(container).append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('width', '100%')
      .style('max-width', width + 'px')
      .style('height', 'auto')
      .style('display', 'block');
    var g = svg.append('g');
    if (translate) {
      g.attr('transform', 'translate(' + translate[0] + ',' + translate[1] + ')');
    }
    return { svg: svg, g: g, width: width, height: height };
  }

  // Axis / gridline pair — a common D3 idiom for Cartesian 2D figures with
  // origin at (cx, cy) and a uniform scale.
  function drawAxes(g, cx, cy, halfW, halfH, options) {
    options = options || {};
    var tickSpacing = options.tickSpacing || 40;
    var color = themed(options.color || colors.axis);
    var gridColor = themed(options.gridColor || colors.grid);

    // Gridlines
    var grid = g.append('g').attr('class', 'grid');
    for (var x = -halfW; x <= halfW; x += tickSpacing) {
      if (x === 0) continue;
      grid.append('line')
        .attr('x1', cx + x).attr('x2', cx + x)
        .attr('y1', cy - halfH).attr('y2', cy + halfH)
        .attr('stroke', gridColor).attr('stroke-width', 1);
    }
    for (var y = -halfH; y <= halfH; y += tickSpacing) {
      if (y === 0) continue;
      grid.append('line')
        .attr('x1', cx - halfW).attr('x2', cx + halfW)
        .attr('y1', cy + y).attr('y2', cy + y)
        .attr('stroke', gridColor).attr('stroke-width', 1);
    }

    // Axes
    var axes = g.append('g').attr('class', 'axes');
    axes.append('line')
      .attr('x1', cx - halfW).attr('x2', cx + halfW)
      .attr('y1', cy).attr('y2', cy)
      .attr('stroke', color).attr('stroke-width', 1.5);
    axes.append('line')
      .attr('x1', cx).attr('x2', cx)
      .attr('y1', cy - halfH).attr('y2', cy + halfH)
      .attr('stroke', color).attr('stroke-width', 1.5);
  }

  // Draw a labelled point with a small circle + text underneath.
  function drawLabeledPoint(g, cx, cy, text, options) {
    options = options || {};
    var r = options.r || 5;
    var fill = themed(options.fill || colors.selected);
    var labelDy = options.labelDy != null ? options.labelDy : 18;
    var pt = g.append('g');
    pt.append('circle')
      .attr('cx', cx).attr('cy', cy).attr('r', r)
      .attr('fill', fill)
      .attr('stroke', themed('#ffffff')).attr('stroke-width', 1.5);
    if (text) {
      pt.append('text')
        .attr('x', cx).attr('y', cy + labelDy)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Source Sans 3, sans-serif')
        .attr('font-size', 12)
        .attr('fill', themed(colors.text))
        .text(text);
    }
    return pt;
  }

  // ───────────────────────────────────────────── animation loop ─────
  // Drop-in replacement for d3.timer(cb) that respects the reader:
  //  - it only runs while `el` (or its enclosing .figure) is on screen, and
  //    `elapsed` only advances while it runs;
  //  - under reduced motion it draws no frames: it fast-forwards the callback
  //    through `reducedMs` of simulated time (or until the callback stops the
  //    timer) and leaves the final state on screen.
  // The callback receives the elapsed milliseconds, like d3.timer.
  function timer(el, cb, opts) {
    var node = el && el.node ? el.node() : el;
    var fig = node && node.closest ? (node.closest('.figure') || node) : node;
    var stopped = false, elapsed = 0, handle = null, visible = true, last = null, unwatch = null;
    var api = {
      stop: function () {
        stopped = true;
        if (handle) cancelAnimationFrame(handle);
        handle = null;
        if (unwatch) { unwatch(); unwatch = null; }
      }
    };
    if (global.Motion && global.Motion.reduced()) {
      var maxMs = (opts && opts.reducedMs) || 6000;
      // Deferred so the caller has stored the returned handle before the
      // callback tries to stop it.
      Promise.resolve().then(function () {
        while (!stopped && elapsed <= maxMs) { cb(elapsed); elapsed += 1000 / 60; }
        api.stop();
      });
      return api;
    }
    function frame(ts) {
      handle = null;
      if (stopped) return;
      if (last !== null) elapsed += Math.min(ts - last, 100);
      last = ts;
      cb(elapsed);
      if (!stopped && visible) handle = requestAnimationFrame(frame);
    }
    function wake(v) {
      visible = v;
      if (v && !stopped && !handle) { last = null; handle = requestAnimationFrame(frame); }
    }
    if (global.Motion && fig) unwatch = global.Motion.onVisible(fig, wake);
    else wake(true);
    return api;
  }

  // ───────────────────────────────────────────── seeded PRNG ─────
  // mulberry32: a small deterministic generator, so figures that sample
  // "random" data draw the same picture on every load.
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ───────────────────────────────────────────── public API ─────

  NOETHER.viz = {
    colors: colors,
    math: renderMath,
    makeSVG: makeSVG,
    drawAxes: drawAxes,
    drawLabeledPoint: drawLabeledPoint,
    timer: timer,
    rng: rng
  };

})(typeof window !== 'undefined' ? window : globalThis);
