// typeviz.js — Visual vocabulary for the Type Systems series.
// Attaches a single `TV` object to the global scope.
// No build step. Works alongside D3 v7 + KaTeX.
//
// Public sections
// ---------------
//   TV.palette     Reserved atomic-type colors (Position, Velocity, Force, Mass, Time, Id)
//   TV.pipe        Colored connector carrying a value of some atomic type
//   TV.product     Nested/paired container for (A, B) / records
//   TV.sum         Split/forked shape for A | B / variants
//   TV.wall        Boundary rendered into phase/state space (refinement type / invariant)
//   TV.effectStrip Capability column beside a trajectory (Det / Rand / ...)
//   TV.shapeIndex  Small tag on a pipe showing tensor rank or dimension
//   TV.signature   Top-level assemblage composing the above into animated diagrams
//
// All primitives attach to a D3 selection (typically an <svg:g>) and return that
// selection. Where animation is involved the primitive exposes .feed(value) so the
// enclosing explainer can push live simulation values through the diagram every tick.

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── palette ──
  // Reserved atomic-type colors. Never shadow these in an explainer.
  var palette = {
    Position: '#2563eb', // blue
    Velocity: '#d97706', // orange
    Force:    '#dc2626', // red
    Mass:     '#6b7280', // gray
    Time:     '#059669', // green
    Id:       '#64748b', // neutral slate
    // Extension pool for per-explainer atomic types (use sparingly).
    Extra1:   '#7c3aed',
    Extra2:   '#db2777',
    Extra3:   '#0891b2'
  };

  // ─────────────────────────────────────────── pipe ──
  // A colored connector. Typed by atomic kind. Can animate a dot travelling along it.
  function pipe(sel, opts) {
    opts = opts || {};
    var kind = opts.kind || 'Id';
    var color = palette[kind] || palette.Id;
    var g = sel.append('g').attr('class', 'tv-pipe tv-kind-' + kind);
    g.append('line')
      .attr('x1', opts.x1 || 0).attr('y1', opts.y1 || 0)
      .attr('x2', opts.x2 || 80).attr('y2', opts.y2 || 0)
      .attr('stroke', color).attr('stroke-width', opts.width || 3)
      .attr('stroke-linecap', 'round');
    var dot = g.append('circle')
      .attr('r', opts.dotR || 4).attr('fill', color)
      .attr('cx', opts.x1 || 0).attr('cy', opts.y1 || 0)
      .attr('opacity', 0);
    g.feed = function (t) {
      // t in [0, 1] along the pipe; 0 snaps dot invisible at source.
      t = Math.max(0, Math.min(1, t));
      var x1 = +g.select('line').attr('x1'), y1 = +g.select('line').attr('y1');
      var x2 = +g.select('line').attr('x2'), y2 = +g.select('line').attr('y2');
      dot.attr('cx', x1 + (x2 - x1) * t).attr('cy', y1 + (y2 - y1) * t)
         .attr('opacity', t > 0 && t < 1 ? 1 : 0);
      return g;
    };
    return g;
  }

  // ─────────────────────────────────────────── product ──
  // Paired container. Children render inside a rounded rect.
  function product(sel, opts) {
    opts = opts || {};
    var g = sel.append('g').attr('class', 'tv-product');
    g.append('rect')
      .attr('x', opts.x || 0).attr('y', opts.y || 0)
      .attr('width', opts.w || 140).attr('height', opts.h || 60)
      .attr('rx', 6).attr('fill', '#fff')
      .attr('stroke', '#334155').attr('stroke-width', 1.2);
    if (opts.label) {
      g.append('text')
        .attr('x', (opts.x || 0) + 8).attr('y', (opts.y || 0) + 14)
        .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.7rem')
        .attr('fill', '#334155').text(opts.label);
    }
    return g;
  }

  // ─────────────────────────────────────────── sum ──
  // Fork/split container. Each variant gets a labeled band with its color stripe.
  // opts: { x, y, w, h, variants: [{ label, color }], label }
  function sum(sel, opts) {
    opts = opts || {};
    var g = sel.append('g').attr('class', 'tv-sum');
    var variants = opts.variants || [];
    var w = opts.w || 140, h = opts.h || 20 * variants.length + 10;
    var x = opts.x || 0, y = opts.y || 0;
    var bandH = (h - 6) / variants.length;

    g.append('rect')
      .attr('x', x).attr('y', y).attr('width', w).attr('height', h)
      .attr('rx', 6).attr('fill', '#fff')
      .attr('stroke', '#334155').attr('stroke-width', 1.2);

    variants.forEach(function (v, i) {
      var by = y + 3 + i * bandH;
      g.append('rect')
        .attr('x', x + 4).attr('y', by + 1).attr('width', 4).attr('height', bandH - 2)
        .attr('fill', v.color || '#64748b').attr('rx', 1);
      g.append('text')
        .attr('x', x + 14).attr('y', by + bandH / 2 + 4)
        .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.68rem')
        .attr('fill', '#334155').text(v.label);
    });

    if (opts.label) {
      g.append('text')
        .attr('x', x).attr('y', y - 5)
        .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.7rem')
        .attr('fill', '#334155').text(opts.label);
    }

    return g;
  }

  // ─────────────────────────────────────────── wall ──
  // Dashed boundary in phase space representing a refinement predicate.
  // opts: { x1,y1,x2,y2 (line) | path (arbitrary SVG path) | color | label, labelX, labelY, width }
  function wall(sel, opts) {
    opts = opts || {};
    var g = sel.append('g').attr('class', 'tv-wall');
    var color = opts.color || '#f59e0b';
    var width = opts.width || 2;

    if (opts.path) {
      g.append('path').attr('d', opts.path)
        .attr('fill', 'none').attr('stroke', color).attr('stroke-width', width)
        .attr('stroke-dasharray', '6 4').attr('stroke-linecap', 'round');
    } else if (opts.x1 !== undefined) {
      g.append('line')
        .attr('x1', opts.x1).attr('y1', opts.y1)
        .attr('x2', opts.x2).attr('y2', opts.y2)
        .attr('stroke', color).attr('stroke-width', width)
        .attr('stroke-dasharray', '6 4').attr('stroke-linecap', 'round');
    }

    if (opts.label) {
      g.append('text')
        .attr('x', opts.labelX != null ? opts.labelX : 0)
        .attr('y', opts.labelY != null ? opts.labelY : 0)
        .attr('font-family', 'Source Code Pro, monospace')
        .attr('font-size', '0.7rem').attr('fill', color)
        .text(opts.label);
    }
    return g;
  }

  // ─────────────────────────────────────────── effectStrip ──
  // Stacked capability tags beside a trajectory (Det / Rand / IO / Mut).
  // opts: { x, y, w, h, gap, effects: [{ label, color, active }] }
  function effectStrip(sel, opts) {
    opts = opts || {};
    var g = sel.append('g').attr('class', 'tv-effect-strip');
    var effects = opts.effects || [];
    var x = opts.x || 0, y = opts.y || 0;
    var w = opts.w || 54, h = opts.h || 20;
    var gap = opts.gap || 3;

    effects.forEach(function (e, i) {
      var cy = y + i * (h + gap);
      var active = e.active !== false;
      var color = e.color || '#64748b';
      g.append('rect')
        .attr('x', x).attr('y', cy)
        .attr('width', w).attr('height', h)
        .attr('rx', 3)
        .attr('fill', active ? color : '#fff')
        .attr('stroke', color).attr('stroke-width', 1)
        .attr('opacity', active ? 1 : 0.45);
      g.append('text')
        .attr('x', x + w / 2).attr('y', cy + h / 2 + 4)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Source Code Pro, monospace')
        .attr('font-size', '0.66rem').attr('font-weight', 600)
        .attr('fill', active ? '#fff' : color)
        .text(e.label);
    });
    return g;
  }

  // ─────────────────────────────────────────── shapeIndex ──
  // Compact shape/rank tag rendered above a pipe: [10×10], [3], etc.
  // opts: { x, y, shape (array or number), label (override), color }
  function shapeIndex(sel, opts) {
    opts = opts || {};
    var g = sel.append('g').attr('class', 'tv-shape-index');
    var x = opts.x || 0, y = opts.y || 0;
    var label;
    if (Array.isArray(opts.shape)) label = '[' + opts.shape.join('×') + ']';
    else if (typeof opts.shape === 'number') label = '[' + opts.shape + ']';
    else label = opts.label || '';
    var color = opts.color || '#7c3aed';

    g.append('text')
      .attr('x', x).attr('y', y)
      .attr('font-family', 'Source Code Pro, monospace')
      .attr('font-size', '0.66rem').attr('font-weight', 600)
      .attr('fill', color).text(label);
    return g;
  }

  // ─────────────────────────────────────────── signature ──
  // Compose inputs + function-box + output into a single, consistently-laid-out
  // signature diagram. Used by #10+ so later explainers don't hand-roll §3.
  //
  // Spec shape:
  //   {
  //     x, y,                        top-left origin (optional; default 0,0)
  //     name: 'step',                function-box label (required)
  //     inputs: [                    rendered top-to-bottom on the left
  //       { pipe:    { kind, label } },
  //       { product: { label, pipes: [{ kind, label }] } },
  //       { sum:     { label, variants: [{ label, color }] } }
  //     ],
  //     output:  { pipe: {...} } | { product: {...} },
  //     tag:     'law = Symp'        optional small pill above the output (phantom annotation)
  //     tagColor: '#7c3aed',
  //     animate: true                fire a dot along each input curve then one along output
  //   }
  //
  // Returns the wrapper <g>. Existing §3 diagrams in #1–#9 were hand-rolled and need
  // not be migrated; this helper is for the remaining explainers and future reuse.
  function signature(sel, spec) {
    spec = spec || {};
    var g = sel.append('g').attr('class', 'tv-signature')
      .attr('transform', 'translate(' + (spec.x || 0) + ',' + (spec.y || 0) + ')');

    var inputs = spec.inputs || [];
    var INPUT_W = 160;
    var INPUT_GAP = 14;
    var FN_GAP_LEFT = 90, FN_W = 100, FN_H = 40;
    var FN_GAP_RIGHT = 50, OUTPUT_W = 160;

    // Height of each input block.
    function inputHeight(inp) {
      if (inp.pipe) return 28;
      if (inp.product) return 26 + ((inp.product.pipes || []).length * 15);
      if (inp.sum) return 18 + ((inp.sum.variants || []).length * 16);
      return 30;
    }

    var heights = inputs.map(inputHeight);
    var totalH = heights.reduce(function (a, b) { return a + b; }, 0) + Math.max(0, inputs.length - 1) * INPUT_GAP;
    totalH = Math.max(totalH, FN_H + 20);

    // Render inputs; collect right-edge anchors for curve wiring.
    var inputAnchors = [];
    var cursorY = 0;
    inputs.forEach(function (inp, i) {
      var h = heights[i];
      var y0 = cursorY;

      if (inp.pipe) {
        var cy = y0 + h / 2;
        pipe(g, { kind: inp.pipe.kind, x1: 0, y1: cy, x2: INPUT_W, y2: cy, width: 3, dotR: 4 });
        if (inp.pipe.label) {
          g.append('text').attr('x', 0).attr('y', cy - 8)
            .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.7rem')
            .attr('fill', palette[inp.pipe.kind] || palette.Id).text(inp.pipe.label);
        }
        inputAnchors.push({ x: INPUT_W, y: cy });
      } else if (inp.product) {
        product(g, { x: 0, y: y0, w: INPUT_W, h: h - 4, label: inp.product.label });
        (inp.product.pipes || []).forEach(function (p, j) {
          var py = y0 + 22 + j * 15;
          pipe(g, { kind: p.kind, x1: 10, y1: py, x2: 60, y2: py, width: 2, dotR: 3 });
          g.append('text').attr('x', 68).attr('y', py + 4)
            .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.62rem')
            .attr('fill', '#334155').text(p.label || '');
        });
        inputAnchors.push({ x: INPUT_W, y: y0 + (h - 4) / 2 });
      } else if (inp.sum) {
        sum(g, {
          x: 0, y: y0 + 12, w: INPUT_W,
          h: (inp.sum.variants || []).length * 16 + 6,
          variants: inp.sum.variants, label: inp.sum.label
        });
        inputAnchors.push({ x: INPUT_W, y: y0 + 12 + ((inp.sum.variants || []).length * 16 + 6) / 2 });
      }
      cursorY += h + INPUT_GAP;
    });

    // Function box — vertically centered against the input stack.
    var fnX = INPUT_W + FN_GAP_LEFT;
    var fnCy = totalH / 2;
    g.append('rect')
      .attr('x', fnX).attr('y', fnCy - FN_H / 2).attr('width', FN_W).attr('height', FN_H)
      .attr('rx', 6).attr('fill', '#fff').attr('stroke', '#334155').attr('stroke-width', 1.2);
    g.append('text').attr('x', fnX + FN_W / 2).attr('y', fnCy + 5)
      .attr('text-anchor', 'middle').attr('font-family', 'Source Code Pro, monospace')
      .attr('font-size', '0.82rem').attr('fill', '#334155').text(spec.name || 'f');

    // Curves from each input anchor into the function box.
    var fnIn = { x: fnX, y: fnCy };
    var inputCurvePaths = [];
    inputAnchors.forEach(function (a) {
      var d = 'M ' + a.x + ',' + a.y +
              ' C ' + (a.x + 50) + ',' + a.y +
              ' ' + (fnIn.x - 50) + ',' + fnIn.y +
              ' ' + fnIn.x + ',' + fnIn.y;
      var p = g.append('path').attr('d', d)
        .attr('stroke', '#334155').attr('stroke-width', 1.2).attr('fill', 'none');
      inputCurvePaths.push(p.node());
    });

    // Output.
    var outputX = fnX + FN_W + FN_GAP_RIGHT;
    var outputAnchor = { x: outputX, y: fnCy };
    var output = spec.output;
    var outputDot = null, outputLineLen = 0;
    if (output) {
      if (output.pipe) {
        pipe(g, { kind: output.pipe.kind, x1: outputX, y1: fnCy, x2: outputX + OUTPUT_W, y2: fnCy, width: 3, dotR: 4 });
        outputLineLen = OUTPUT_W;
        if (output.pipe.label) {
          g.append('text').attr('x', outputX).attr('y', fnCy - 8)
            .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.7rem')
            .attr('fill', palette[output.pipe.kind] || palette.Id).text(output.pipe.label);
        }
        outputDot = g.append('circle').attr('r', 4)
          .attr('fill', palette[output.pipe.kind] || palette.Id)
          .attr('cx', outputX).attr('cy', fnCy).attr('opacity', 0);
      } else if (output.product) {
        var outH = 26 + ((output.product.pipes || []).length * 15);
        var oy = fnCy - outH / 2;
        product(g, { x: outputX, y: oy, w: OUTPUT_W, h: outH, label: output.product.label });
        (output.product.pipes || []).forEach(function (p, j) {
          var py = oy + 22 + j * 15;
          pipe(g, { kind: p.kind, x1: outputX + 10, y1: py, x2: outputX + 60, y2: py, width: 2, dotR: 3 });
          g.append('text').attr('x', outputX + 68).attr('y', py + 4)
            .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.62rem')
            .attr('fill', '#334155').text(p.label || '');
        });
      }

      // Connector from function box to output.
      var outD = 'M ' + (fnX + FN_W) + ',' + fnCy +
                 ' C ' + (fnX + FN_W + 20) + ',' + fnCy +
                 ' ' + (outputX - 20) + ',' + fnCy +
                 ' ' + outputX + ',' + fnCy;
      g.append('path').attr('d', outD)
        .attr('stroke', '#334155').attr('stroke-width', 1.2).attr('fill', 'none');
    }

    // Optional tag (phantom / law / effect annotation) above output.
    if (spec.tag) {
      var tagColor = spec.tagColor || '#334155';
      var tagX = outputX + 10, tagY = fnCy - 22;
      // Own subgroup so the text is a direct child (`insert` uses querySelector,
      // which would otherwise match nested <text> inside sum/product children).
      var tagG = g.append('g').attr('class', 'tv-sig-tag');
      var lbl = tagG.append('text')
        .attr('x', tagX + 8).attr('y', tagY - 4)
        .attr('font-family', 'Source Code Pro, monospace').attr('font-size', '0.66rem')
        .attr('font-weight', 600).attr('fill', tagColor).text(spec.tag);
      var bbox = lbl.node().getBBox();
      tagG.insert('rect', 'text')
        .attr('x', bbox.x - 6).attr('y', bbox.y - 2)
        .attr('width', bbox.width + 12).attr('height', bbox.height + 4)
        .attr('rx', 8).attr('fill', '#fff').attr('stroke', tagColor).attr('stroke-width', 1);
      tagG.append('line')
        .attr('x1', bbox.x + bbox.width / 2).attr('y1', bbox.y + bbox.height + 2)
        .attr('x2', outputX + 20).attr('y2', fnCy - 4)
        .attr('stroke', tagColor).attr('stroke-dasharray', '2 2').attr('stroke-width', 1);
    }

    // Animation: fire dots along input curves, then one along the output line.
    if (spec.animate) {
      var inputDots = inputAnchors.map(function (a, i) {
        // Color the dot the same as its input kind if available.
        var inp = inputs[i];
        var color = '#334155';
        if (inp.pipe) color = palette[inp.pipe.kind] || palette.Id;
        else if (inp.sum && inp.sum.variants && inp.sum.variants.length)
          color = inp.sum.variants[0].color || '#334155';
        return g.append('circle').attr('r', 4).attr('fill', color).attr('opacity', 0);
      });

      var t0 = performance.now();
      function tick() {
        var phase = ((performance.now() - t0) / 1800) % 1;
        if (phase < 0.5) {
          var p = phase * 2;
          inputDots.forEach(function (dot, i) {
            var path = inputCurvePaths[i];
            if (!path || !path.getTotalLength) return;
            var L = path.getTotalLength();
            var pt = path.getPointAtLength(p * L);
            dot.attr('cx', pt.x).attr('cy', pt.y).attr('opacity', 1);
          });
          if (outputDot) outputDot.attr('opacity', 0);
        } else {
          inputDots.forEach(function (dot) { dot.attr('opacity', 0); });
          if (outputDot) {
            var q = (phase - 0.5) * 2;
            outputDot.attr('cx', outputX + q * outputLineLen).attr('opacity', q < 1 ? 1 : 0);
          }
        }
        requestAnimationFrame(tick);
      }
      tick();
    }

    return g;
  }

  // ─────────────────────────────────────────── exports ──
  global.TV = {
    palette: palette,
    pipe: pipe,
    product: product,
    sum: sum,
    wall: wall,
    effectStrip: effectStrip,
    shapeIndex: shapeIndex,
    signature: signature
  };

})(window);
