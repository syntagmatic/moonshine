// infogeo-viz.js — shared visual conventions for "Information Geometry".
//
// Attaches to the same `IG` global as infogeo-math.js.
// Holds the color palette and the figure() scaffolding used by every
// explainer. Kept deliberately light: the heavy lifting (contour plots,
// Voronoi, geodesic rendering) is done inline in each explainer so that
// the figure code sits right next to the prose that describes it.

(function (global) {
  'use strict';

  if (!global.IG) {
    throw new Error('[IG] infogeo-viz.js must be loaded after infogeo-math.js');
  }

  var IG = global.IG;

  // Color palette. Semantic names so we can swap the hex values without
  // touching the explainer code. "Current" and "target" map onto the
  // recurring red/blue pair used in e8-lattice and octonions, so a reader
  // moving between the Moonshine series sees consistent signals.
  var colors = {
    // Point types
    current:    '#2563eb', // blue — "the reader is here"
    target:     '#dc2626', // red  — "the distribution we want to reach"
    geodesic:   '#7c3aed', // purple — Fisher-metric geodesic
    euclid:     '#f59e0b', // amber — naive Euclidean comparison
    manifold:   '#059669', // green — the 2-parameter family as a surface

    // Divergence channels
    forwardKL:  '#dc2626',
    reverseKL:  '#2563eb',
    jeffreys:   '#7c3aed',
    hellinger:  '#059669',

    // Scaffolding
    axis:       '#64748b',
    grid:       '#e2e8f0',
    text:       '#1a1a2e',
    textSec:    '#4a4a6a',
    bg:         '#fafafa',
    figBg:      '#ffffff',
    border:     '#e2e2e8',

    // Discrete palette for multi-series plots (α-connection families, etc.)
    categorical: [
      '#2563eb',
      '#dc2626',
      '#059669',
      '#7c3aed',
      '#f59e0b',
      '#0891b2',
      '#be185d'
    ]
  };

  // A "figure" is a standardised bundle: title-less content area, a slot
  // for a D3 SVG, an optional controls row, a status bar for live readouts,
  // and a caption. Each explainer calls figure() once per interactive.
  function figure(container, options) {
    options = options || {};
    var fig = document.createElement('div');
    fig.className = 'figure';
    if (options.id) fig.id = options.id;

    var slot = document.createElement('div');
    slot.className = options.canvas ? 'canvas-slot' : 'svg-slot';
    fig.appendChild(slot);

    var controls = null;
    if (options.controls) {
      controls = document.createElement('div');
      controls.className = 'controls';
      fig.appendChild(controls);
    }

    var status = document.createElement('p');
    status.className = 'status-bar';
    fig.appendChild(status);

    var caption = document.createElement('p');
    caption.className = 'figure-caption';
    if (options.caption) {
      if (options.label) {
        var lbl = document.createElement('span');
        lbl.className = 'figure-label';
        lbl.textContent = options.label;
        caption.appendChild(lbl);
        caption.appendChild(document.createTextNode(' '));
      }
      caption.appendChild(document.createTextNode(options.caption));
    }
    fig.appendChild(caption);

    container.appendChild(fig);

    return {
      element: fig,
      slot: slot,
      controls: controls,
      status: status,
      caption: caption
    };
  }

  // KaTeX convenience: render TeX into an element by id.
  function renderMath(id, tex, display) {
    var el = document.getElementById(id);
    if (el && global.katex) {
      global.katex.render(tex, el, {
        throwOnError: false,
        displayMode: !!display
      });
    }
  }

  // Linearly-sampled contour levels from a 2D grid. Returns an array of
  // level values chosen so that N contours sit at equal KL increments
  // (useful for contour plots of the divergence landscape).
  function linearLevels(min, max, n) {
    var levels = [];
    for (var i = 1; i < n; i++) {
      levels.push(min + (max - min) * i / n);
    }
    return levels;
  }

  // Log-spaced levels. Preferred for KL contours because KL grows
  // quadratically near the centre point — linear levels would crowd there.
  function logLevels(min, max, n) {
    var levels = [];
    var lo = Math.log(Math.max(min, 1e-6));
    var hi = Math.log(Math.max(max, min + 1e-6));
    for (var i = 1; i < n; i++) {
      levels.push(Math.exp(lo + (hi - lo) * i / n));
    }
    return levels;
  }

  IG.viz = {
    colors: colors,
    figure: figure,
    renderMath: renderMath,
    linearLevels: linearLevels,
    logLevels: logLevels
  };

})(typeof window !== 'undefined' ? window : globalThis);
