// e8-viz.js — shared visual conventions for the E8 lattice series.
//
// Attaches to the same `E8` global as e8-math.js. Loads after e8-math.js.
// Holds the color palette, a few reusable SVG helpers, and a minimal 3D
// projection utility that multiple explainers use for rotating 3D views.
//
// Keeping this file thin is deliberate: figure-specific code belongs in the
// per-explainer HTML, not here. Only put something in e8-viz.js if at least
// two explainers need it exactly the same way.

(function (global) {
  'use strict';

  if (!global.E8) {
    throw new Error('[E8] e8-viz.js must be loaded after e8-math.js');
  }

  var E8 = global.E8;

  // ───────────────────────────────────────────── color palette ─────
  // Matches the semantic choices in docs/parallel-coordinates/*.html so that
  // readers who move between the two series see the same family colors.

  var colors = {
    // Root families
    integerFamily:     '#2563eb', // blue   — integer (D_8) roots
    halfIntegerFamily: '#6366f1', // indigo — half-integer roots
    allRoots:          '#1e40af', // darker blue when mixing families

    // Highlights and selection
    highlight:         '#f59e0b', // amber — hover / selection
    selectedPrimary:   '#dc2626', // red   — the "currently picked" root
    selectedSecondary: '#7c3aed', // purple — the "other" picked root in workbenches

    // Structure
    edge:              '#94a3b8', // slate — polytope edges
    edgeFaint:         '#cbd5e1', // lighter slate — faint background edges
    axis:              '#64748b', // slate — axes, gridlines
    lattice:           '#0f172a', // near-black — lattice points in dense scenes

    // Subsystems (seven colors for deletion-of-node highlights)
    subsystem: [
      '#ef4444', // red
      '#f97316', // orange
      '#eab308', // yellow
      '#22c55e', // green
      '#06b6d4', // cyan
      '#3b82f6', // blue
      '#a855f7'  // purple
    ],

    // Background shades
    bg:                '#fafafa',
    figBg:             '#ffffff',
    border:            '#e2e2e8',

    // Text
    text:              '#1a1a2e',
    textSecondary:     '#4a4a6a'
  };

  // ───────────────────────────────────────────── figure scaffolding ─────
  // Creates a figure container with caption, status bar, and (optional)
  // controls slot. Returns refs to the slots so the caller can populate them.
  // Used by most explainers; keeps markup consistent across the series.

  function figure(container, options) {
    options = options || {};
    var fig = document.createElement('div');
    fig.className = 'figure';
    if (options.id) fig.id = options.id;

    var svgSlot = null;
    var canvasSlot = null;
    if (options.canvas) {
      canvasSlot = document.createElement('div');
      canvasSlot.className = 'canvas-slot';
      fig.appendChild(canvasSlot);
    } else {
      svgSlot = document.createElement('div');
      svgSlot.className = 'svg-slot';
      fig.appendChild(svgSlot);
    }

    var controlsSlot = null;
    if (options.controls) {
      controlsSlot = document.createElement('div');
      controlsSlot.className = 'controls';
      fig.appendChild(controlsSlot);
    }

    var statusSlot = null;
    if (options.status !== false) {
      statusSlot = document.createElement('p');
      statusSlot.className = 'status-bar';
      fig.appendChild(statusSlot);
    }

    var caption = document.createElement('p');
    caption.className = 'figure-caption';
    if (options.caption) {
      if (options.figureLabel) {
        var label = document.createElement('span');
        label.className = 'figure-label';
        label.textContent = options.figureLabel;
        caption.appendChild(label);
        caption.appendChild(document.createTextNode(' '));
      }
      caption.appendChild(document.createTextNode(options.caption));
    }
    fig.appendChild(caption);

    container.appendChild(fig);

    return {
      element: fig,
      svg: svgSlot,
      canvas: canvasSlot,
      controls: controlsSlot,
      status: statusSlot,
      caption: caption
    };
  }

  // ───────────────────────────────────────────── 3D projection helpers ─────
  // Classic rotation around X and Y axes, then orthographic projection to 2D.
  // Used by #01 (FCC kissing), #06 (Gosset polytope), and later explainers.

  function rotate3D(v, rotX, rotY) {
    var cx = Math.cos(rotX), sx = Math.sin(rotX);
    var cy = Math.cos(rotY), sy = Math.sin(rotY);
    // Rotate around X
    var y1 = v[1] * cx - v[2] * sx;
    var z1 = v[1] * sx + v[2] * cx;
    // Rotate around Y
    var x2 = v[0] * cy + z1 * sy;
    var z2 = -v[0] * sy + z1 * cy;
    return [x2, y1, z2];
  }

  function project3D(v, rotX, rotY, scale, cx, cy) {
    var r = rotate3D(v, rotX, rotY);
    return {
      x: cx + r[0] * scale,
      y: cy - r[1] * scale,
      z: r[2]
    };
  }

  // ───────────────────────────────────────────── parallel coordinates ─────
  // Basic axis + polyline drawing for N-dimensional vectors. Returns a handle
  // the caller can use to redraw with new data or highlight specific rows.

  function parallelCoords(svgRoot, dims, options) {
    options = options || {};
    var width  = options.width  || 640;
    var height = options.height || 300;
    var margin = options.margin || {top: 20, right: 20, bottom: 30, left: 40};
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;
    var yMin = options.yMin != null ? options.yMin : -1;
    var yMax = options.yMax != null ? options.yMax :  1;

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('style', 'max-width: ' + width + 'px; height: auto;');
    svgRoot.appendChild(svg);

    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    svg.appendChild(g);

    function xScale(k) {
      if (dims === 1) return innerW / 2;
      return (k / (dims - 1)) * innerW;
    }
    function yScale(v) {
      return innerH - (v - yMin) / (yMax - yMin) * innerH;
    }

    // Axes
    for (var k = 0; k < dims; k++) {
      var axis = document.createElementNS(svgNS, 'line');
      axis.setAttribute('x1', xScale(k));
      axis.setAttribute('y1', 0);
      axis.setAttribute('x2', xScale(k));
      axis.setAttribute('y2', innerH);
      axis.setAttribute('stroke', colors.axis);
      axis.setAttribute('stroke-width', '1');
      g.appendChild(axis);
      var label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', xScale(k));
      label.setAttribute('y', innerH + 18);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '11');
      label.setAttribute('fill', colors.textSecondary);
      label.textContent = (options.axisLabels && options.axisLabels[k]) || ('x' + (k + 1));
      g.appendChild(label);
    }

    var polylinesGroup = document.createElementNS(svgNS, 'g');
    polylinesGroup.setAttribute('class', 'polylines');
    g.appendChild(polylinesGroup);

    function drawPolylines(rows, rowOptions) {
      while (polylinesGroup.firstChild) polylinesGroup.removeChild(polylinesGroup.firstChild);
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        var opts = rowOptions ? rowOptions(row, r) : {};
        var pts = [];
        for (var k = 0; k < dims; k++) {
          pts.push(xScale(k) + ',' + yScale(row[k]));
        }
        var poly = document.createElementNS(svgNS, 'polyline');
        poly.setAttribute('points', pts.join(' '));
        poly.setAttribute('fill', 'none');
        poly.setAttribute('stroke', opts.stroke || colors.integerFamily);
        poly.setAttribute('stroke-width', opts.strokeWidth || 1);
        poly.setAttribute('stroke-opacity', opts.opacity != null ? opts.opacity : 0.6);
        if (opts.id) poly.setAttribute('data-id', opts.id);
        polylinesGroup.appendChild(poly);
      }
    }

    return {
      svg: svg,
      g: g,
      xScale: xScale,
      yScale: yScale,
      drawPolylines: drawPolylines
    };
  }

  // ───────────────────────────────────────────── public API ─────

  E8.viz = {
    colors: colors,
    figure: figure,
    rotate3D: rotate3D,
    project3D: project3D,
    parallelCoords: parallelCoords
  };

})(typeof window !== 'undefined' ? window : globalThis);
