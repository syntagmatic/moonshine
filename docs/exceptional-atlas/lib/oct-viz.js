// oct-viz.js — shared visual conventions for "The Last Algebra"
//
// Attaches to the same `OCT` global as oct-math.js.
// Holds the color palette and reusable figure scaffolding.

(function (global) {
  'use strict';

  if (!global.OCT) {
    throw new Error('[OCT] oct-viz.js must be loaded after oct-math.js');
  }

  var OCT = global.OCT;

  var colors = {
    real:       EA.c('#2563eb'), // blue
    complex:    EA.c('#059669'), // green
    quat:       EA.c('#7c3aed'), // purple
    oct:        EA.c('#dc2626'), // red
    
    highlight:  EA.c('#f59e0b'), // amber
    axis:       EA.c('#64748b'), // slate
    text:       EA.c('#1a1a2e'),
    textSec:    EA.c('#4a4a6a'),
    bg:         EA.c('#fafafa'),
    figBg:      EA.c('#ffffff'),
    border:     EA.c('#e2e2e8'),
    
    // Fano Plane specific (one color per imaginary unit e1..e7)
    e: [
      EA.c('#ef4444'), // e1
      EA.c('#f97316'), // e2
      EA.c('#eab308'), // e3
      EA.c('#22c55e'), // e4
      EA.c('#06b6d4'), // e5
      EA.c('#3b82f6'), // e6
      EA.c('#a855f7')  // e7
    ]
  };

  function figure(container, options) {
    options = options || {};
    var fig = document.createElement('div');
    fig.className = 'figure';
    if (options.id) fig.id = options.id;

    var slot = document.createElement('div');
    slot.className = options.canvas ? 'canvas-slot' : 'svg-slot';
    fig.appendChild(slot);

    if (options.controls) {
      var controls = document.createElement('div');
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
      controls: fig.querySelector('.controls'),
      status: status,
      caption: caption
    };
  }

  OCT.viz = {
    colors: colors,
    figure: figure
  };

})(typeof window !== 'undefined' ? window : globalThis);
