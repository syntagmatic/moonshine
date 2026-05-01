// weil-viz.js — shared visual library for the Force and Attention series.
//
// Attaches to a single `WEIL` global. No external dependencies required.
// Each explainer loads this file, then its own inline scripts.
//
// Thin on purpose: figure-specific code belongs in per-explainer HTML.
// A primitive belongs here only if at least two explainers need it identically.
//
// Public API:
//   WEIL.colors                                — semantic hex palette
//   WEIL.figure(container, opts)               — figure scaffold (caption, controls, status)
//   WEIL.severanceLink(svg, src, dst, s, opts) — sign↔referent link, s ∈ [0, 1]
//   WEIL.forceField(sources, opts)             — Newtonian attractor physics; caller renders
//   WEIL.overlayLayers(controlsEl, layers)     — toggle-button visibility manager
//   WEIL.stackedLadder(svg, rungs, opts)       — vertical rung diagram with optional severance
//   WEIL.splitArrangements(svg, panes, opts)   — three-panel comparison primitive
//   WEIL.quoteCard(parent, opts)               — source-anchored quote block

(function (global) {
  'use strict';

  // ───────────────────────────────────────────────── semantic palette ────
  // All values are resolved hex — never CSS var() strings. D3 color scales
  // cannot interpolate var() references (feedback_d3_css_vars).

  var colors = {
    // Weil concept roles
    gravity:       '#1e293b',  // deep slate  — the pull of necessity, heavy, downward
    force:         '#991b1b',  // deep rust   — coercive, external, thingifying
    attention:     '#475569',  // medium slate — receptive, open, waiting
    affliction:    '#581c87',  // deep plum   — severe, locked; malheur
    grace:         '#d97706',  // amber-gold  — counter-movement, not earned
    rootedness:    '#78350f',  // dark earth  — grounded, warm; enracinement
    void:          '#f8fafc',  // near-white  — clearing, emptied of fantasy
    sign:          '#2563eb',  // clear blue  — what appears, the sign-surface
    referent:      '#1e3a8a',  // deep navy   — what is, the referent (muted beneath)
    severance:     '#94a3b8',  // faded slate — the severed link

    // Indexed layer palette: bodily → social → economic → temporal
    // Used by stackedLadder (03, 08, 09) and factory-day figures.
    layers: ['#991b1b', '#9a3412', '#92400e', '#065f46'],

    // UI chrome — matches exceptional-atlas family
    bg:            '#fafafa',
    figBg:         '#ffffff',
    border:        '#e2e2e8',
    text:          '#1a1a2e',
    textSecondary: '#4a4a6a',
    accent:        '#2563eb',
    accentLight:   '#dbeafe'
  };

  // ─────────────────────────────────────────── color helpers (private) ────

  function hexToRgb(h) {
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  }

  function lerpColor(c1, c2, t) {
    var a = hexToRgb(c1), b = hexToRgb(c2);
    return '#' + [0,1,2].map(function(i){
      return ('0'+Math.max(0,Math.min(255,Math.round(a[i]+(b[i]-a[i])*t))).toString(16)).slice(-2);
    }).join('');
  }

  // ──────────────────────────────────────────────── figure scaffold ────
  // Returns refs to named slots. Mirrors docs/exceptional-atlas/lib/e8-viz.js.
  // Slots: { element, svg, canvas, controls, status, caption }

  function figure(container, opts) {
    opts = opts || {};
    var fig = document.createElement('div');
    fig.className = 'figure';
    if (opts.id) fig.id = opts.id;

    var svgSlot = null, canvasSlot = null;
    if (opts.canvas) {
      canvasSlot = document.createElement('div');
      canvasSlot.className = 'canvas-slot';
      fig.appendChild(canvasSlot);
    } else {
      svgSlot = document.createElement('div');
      svgSlot.className = 'svg-slot';
      fig.appendChild(svgSlot);
    }

    var controlsSlot = null;
    if (opts.controls) {
      controlsSlot = document.createElement('div');
      controlsSlot.className = 'controls';
      fig.appendChild(controlsSlot);
    }

    var statusSlot = null;
    if (opts.status !== false) {
      statusSlot = document.createElement('p');
      statusSlot.className = 'status-bar';
      fig.appendChild(statusSlot);
    }

    var caption = document.createElement('p');
    caption.className = 'figure-caption';
    if (opts.caption) {
      if (opts.figureLabel) {
        var label = document.createElement('span');
        label.className = 'figure-label';
        label.textContent = opts.figureLabel;
        caption.appendChild(label);
        caption.appendChild(document.createTextNode(' '));
      }
      caption.appendChild(document.createTextNode(opts.caption));
    }
    fig.appendChild(caption);
    container.appendChild(fig);

    return { element: fig, svg: svgSlot, canvas: canvasSlot,
             controls: controlsSlot, status: statusSlot, caption: caption };
  }

  // ─────────────────────────────────────────────── severanceLink ────
  // Draws a sign↔referent link from src to dst.
  // s ∈ [0,1]:
  //   0  → solid, full-opacity arrow in colors.sign
  //   0.5 → thinning, dashed line in muted grey
  //   1  → near-transparent stub, no arrowhead
  //
  // Returns { line, marker, update(s) } — call update() to animate interactively.
  // Used in explainers 07, 08, 09, 10, 11.

  var _slId = 0;

  function severanceLink(svgEl, src, dst, s, opts) {
    opts = opts || {};
    var ns = 'http://www.w3.org/2000/svg';
    s = s !== undefined ? Math.max(0, Math.min(1, s)) : 0;

    var defs = svgEl.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(ns, 'defs');
      svgEl.insertBefore(defs, svgEl.firstChild);
    }

    var uid = 'weil-mk-' + (_slId++);
    var marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', uid);
    marker.setAttribute('viewBox', '0 0 10 6');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('markerWidth', '7');
    marker.setAttribute('markerHeight', '5');
    marker.setAttribute('orient', 'auto');
    var arrowPath = document.createElementNS(ns, 'path');
    arrowPath.setAttribute('d', 'M0,0 L10,3 L0,6 Z');
    marker.appendChild(arrowPath);
    defs.appendChild(marker);

    var line = document.createElementNS(ns, 'line');
    svgEl.appendChild(line);

    function apply(sv) {
      sv = Math.max(0, Math.min(1, sv));
      var col  = lerpColor(colors.sign, colors.severance, sv);
      var w    = 2.5 - sv * 1.8;   // 2.5 → 0.7
      var op   = 1 - sv * 0.85;    // 1.0 → 0.15
      var dash = sv < 0.3 ? 'none'
               : (Math.round(4 + sv*6) + ',' + Math.round(2 + sv*4));

      line.setAttribute('x1', src.x);   line.setAttribute('y1', src.y);
      line.setAttribute('x2', dst.x);   line.setAttribute('y2', dst.y);
      line.setAttribute('stroke', col);
      line.setAttribute('stroke-width', w);
      line.setAttribute('stroke-opacity', op);
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('stroke-dasharray', dash);
      line.setAttribute('marker-end', sv >= 0.9 ? 'none' : 'url(#' + uid + ')');
      arrowPath.setAttribute('fill', col);
    }

    apply(s);
    return { line: line, marker: marker, update: apply };
  }

  // ────────────────────────────────────────────────── forceField ────
  // Newtonian attractor physics. The caller handles all SVG rendering;
  // this manages the math and animation loop.
  //
  // Returns { step, reset, start(onStep), stop, state }
  // Used in explainers 01, 07.

  function forceField(sources, opts) {
    opts   = opts || {};
    var G       = opts.G       || 2000;
    var damping = opts.damping || 0.93;
    var dt      = opts.dt      || 0.016;
    var state   = { x: opts.x || 0, y: opts.y || 0, vx: 0, vy: 0 };
    var raf     = null;

    function step() {
      var ax = 0, ay = 0;
      for (var i = 0; i < sources.length; i++) {
        var sc = sources[i];
        var dx = sc.x - state.x, dy = sc.y - state.y;
        var d2 = dx*dx + dy*dy;
        if (d2 < 9) continue;
        var d = Math.sqrt(d2);
        var f = G * (sc.mass || 1) / d2;
        ax += f * dx / d;
        ay += f * dy / d;
      }
      state.vx = (state.vx + ax * dt) * damping;
      state.vy = (state.vy + ay * dt) * damping;
      state.x += state.vx;
      state.y += state.vy;
      return { x: state.x, y: state.y };
    }

    function reset(pos) {
      state.x = pos.x; state.y = pos.y;
      state.vx = 0; state.vy = 0;
    }

    function start(onStep) {
      if (raf) return;
      // Respect prefers-reduced-motion via docs/lib/motion.js if loaded.
      if (global.Motion && global.Motion.reduced()) {
        for (var k = 0; k < 240; k++) step();
        onStep({ x: state.x, y: state.y });
        return;
      }
      function loop() { onStep(step()); raf = requestAnimationFrame(loop); }
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    return { step: step, reset: reset, start: start, stop: stop, state: state };
  }

  // ──────────────────────────────────────────── overlayLayers ────
  // Toggle-button manager for a set of named SVG or DOM overlay layers.
  // layers: [{name, el, onToggle?}] — caller creates the elements.
  // Returns { set(i, bool) } for programmatic control.
  // Used in explainers 02, 03, 04, 11.

  function overlayLayers(controlsEl, layers, opts) {
    opts = opts || {};

    function setVisible(el, v) {
      if (!el) return;
      el.style.opacity       = v ? '1' : '0';
      el.style.pointerEvents = v ? ''  : 'none';
      el.setAttribute('aria-hidden', v ? 'false' : 'true');
    }

    var active = {};
    layers.forEach(function (layer, i) {
      var on = opts.initial ? !!opts.initial[i] : true;
      active[i] = on;
      setVisible(layer.el, on);

      var btn = document.createElement('button');
      btn.className = 'btn' + (on ? ' active' : '');
      btn.type = 'button';
      btn.textContent = layer.name;
      btn.addEventListener('click', function () {
        active[i] = !active[i];
        btn.classList.toggle('active', active[i]);
        setVisible(layer.el, active[i]);
        if (typeof layer.onToggle === 'function') layer.onToggle(active[i]);
      });
      controlsEl.appendChild(btn);
    });

    return { set: function (i, v) { active[i] = v; setVisible(layers[i].el, v); } };
  }

  // ────────────────────────────────────────────── stackedLadder ────
  // Builds a vertical stack of labeled rungs in an SVG element.
  // rungs: [{label, sub?, annotation?, color?, severance?}]
  // Returns { groups: [<g>...] } — one group per rung for caller to enrich.
  // Used in explainers 03, 08, 09.

  function stackedLadder(svgEl, rungs, opts) {
    opts   = opts || {};
    var ns = 'http://www.w3.org/2000/svg';
    var rh = opts.rungHeight || 42;
    var rw = opts.rungWidth  || 300;
    var x0 = opts.x          || 20;
    var y0 = opts.y          || 16;
    var gap     = opts.gap     || 6;
    var annotX  = opts.annotX  || (x0 + rw + 14);
    var groups  = [];

    rungs.forEach(function (rung, i) {
      var g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'ladder-rung');
      svgEl.appendChild(g);
      groups.push(g);

      var y   = y0 + i * (rh + gap);
      var col = rung.color || colors.layers[i % colors.layers.length];

      var bg = document.createElementNS(ns, 'rect');
      bg.setAttribute('x', x0);         bg.setAttribute('y', y);
      bg.setAttribute('width', rw);     bg.setAttribute('height', rh);
      bg.setAttribute('rx', '4');
      bg.setAttribute('fill', col);           bg.setAttribute('fill-opacity', '0.12');
      bg.setAttribute('stroke', col);         bg.setAttribute('stroke-width', '1.5');
      g.appendChild(bg);

      var tx = document.createElementNS(ns, 'text');
      tx.setAttribute('x', x0 + 10);
      tx.setAttribute('y', y + (rung.sub ? rh/2 : rh/2 + 5));
      tx.setAttribute('fill', colors.text);
      tx.setAttribute('font-size', '13');
      tx.setAttribute('font-weight', '600');
      tx.textContent = rung.label || '';
      g.appendChild(tx);

      if (rung.sub) {
        var sub = document.createElementNS(ns, 'text');
        sub.setAttribute('x', x0 + 10);
        sub.setAttribute('y', y + rh/2 + 14);
        sub.setAttribute('fill', colors.textSecondary);
        sub.setAttribute('font-size', '11');
        sub.textContent = rung.sub;
        g.appendChild(sub);
      }

      if (rung.annotation) {
        var ann = document.createElementNS(ns, 'text');
        ann.setAttribute('x', annotX);
        ann.setAttribute('y', y + rh/2 + 5);
        ann.setAttribute('fill', colors.textSecondary);
        ann.setAttribute('font-size', '11');
        ann.setAttribute('font-style', 'italic');
        ann.textContent = '↳ ' + rung.annotation;
        svgEl.appendChild(ann);
      }

      if (opts.showSeverance && i < rungs.length - 1) {
        var sv = typeof rung.severance === 'number' ? rung.severance : i / (rungs.length - 1);
        var ny = y0 + (i + 1) * (rh + gap);
        var mx = x0 + rw / 2;
        severanceLink(svgEl,
          { x: mx, y: y + rh },
          { x: mx, y: ny },
          sv, opts.linkOpts
        );
      }
    });

    return { groups: groups };
  }

  // ──────────────────────────────────────── splitArrangements ────
  // Divides an SVG into N labeled panels separated by dashed dividers.
  // panes: [{label, desc?}] — typically 3 items (tool / method / system etc.)
  // Returns { panels: [<g>...], panelWidth, height } for the caller to populate.
  // Used in explainers 11, 12.

  function splitArrangements(svgEl, panes, opts) {
    opts   = opts || {};
    var ns = 'http://www.w3.org/2000/svg';
    var vb = (svgEl.getAttribute('viewBox') || '0 0 600 280').split(' ');
    var W  = parseFloat(vb[2]) || 600;
    var H  = parseFloat(vb[3]) || 280;
    var n  = panes.length;
    var pw = W / n;
    var labelY = opts.labelY || 22;
    var panels = [];

    panes.forEach(function (pane, i) {
      var xOff = i * pw;

      if (i > 0) {
        var div = document.createElementNS(ns, 'line');
        div.setAttribute('x1', xOff); div.setAttribute('y1', 0);
        div.setAttribute('x2', xOff); div.setAttribute('y2', H);
        div.setAttribute('stroke', colors.border);
        div.setAttribute('stroke-width', '1');
        div.setAttribute('stroke-dasharray', '4,4');
        svgEl.appendChild(div);
      }

      var lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', xOff + pw / 2);
      lbl.setAttribute('y', labelY);
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-weight', '700');
      lbl.setAttribute('font-size', '12');
      lbl.setAttribute('fill', colors.text);
      lbl.textContent = pane.label || ('Panel ' + (i + 1));
      svgEl.appendChild(lbl);

      if (pane.desc) {
        var desc = document.createElementNS(ns, 'text');
        desc.setAttribute('x', xOff + pw / 2);
        desc.setAttribute('y', labelY + 16);
        desc.setAttribute('text-anchor', 'middle');
        desc.setAttribute('font-size', '10');
        desc.setAttribute('fill', colors.textSecondary);
        desc.textContent = pane.desc;
        svgEl.appendChild(desc);
      }

      var g = document.createElementNS(ns, 'g');
      g.setAttribute('transform', 'translate(' + xOff + ',0)');
      g.setAttribute('class', 'split-panel');
      svgEl.appendChild(g);
      panels.push(g);
    });

    return { panels: panels, panelWidth: pw, height: H };
  }

  // ──────────────────────────────────────────────── quoteCard ────
  // Creates a source-anchored quote block and appends it to parent.
  // opts: { quote, attribution, translator?, edition?, cautionLabel?, className? }
  // Expected CSS classes: .weil-quote, .weil-quote blockquote, .weil-quote cite, .source-caution
  // Returns the outer div element.
  // Used in every explainer.

  function quoteCard(parent, opts) {
    opts = opts || {};
    var card = document.createElement('div');
    card.className = 'weil-quote' + (opts.className ? ' ' + opts.className : '');

    var q = document.createElement('blockquote');
    q.textContent = opts.quote || '';
    card.appendChild(q);

    var parts = [];
    if (opts.attribution) parts.push(opts.attribution);
    if (opts.translator)  parts.push('trans. ' + opts.translator);
    if (opts.edition)     parts.push(opts.edition);

    var cite = document.createElement('cite');
    if (opts.cautionLabel) {
      cite.appendChild(document.createTextNode(parts.join(', ')));
      var sp = document.createElement('span');
      sp.className = 'source-caution';
      sp.textContent = ' [' + opts.cautionLabel + ']';
      cite.appendChild(sp);
    } else {
      cite.textContent = parts.join(', ');
    }
    card.appendChild(cite);

    if (parent) parent.appendChild(card);
    return card;
  }

  // ──────────────────────────────────────────────── public API ────

  if (!global.WEIL) global.WEIL = {};

  global.WEIL.colors            = colors;
  global.WEIL.figure            = figure;
  global.WEIL.severanceLink     = severanceLink;
  global.WEIL.forceField        = forceField;
  global.WEIL.overlayLayers     = overlayLayers;
  global.WEIL.stackedLadder     = stackedLadder;
  global.WEIL.splitArrangements = splitArrangements;
  global.WEIL.quoteCard         = quoteCard;

})(typeof window !== 'undefined' ? window : globalThis);
