// figkit.js: small helpers shared by the figures in this series.
//   FigKit.width(host, max, min)  layout width for an SVG drawn at 1:1 scale, so text
//                                 keeps its pixel size on a phone instead of shrinking
//                                 with a fixed viewBox.
//   FigKit.keyMove(sel, label, step)  keyboard access for a draggable mark: arrow keys
//                                 call step(dx, dy) with dx, dy in {-1, 0, 1}, times 5
//                                 with Shift. step should run the same update the drag does.
//   FigKit.pressable(sel, label, fn)  keyboard access for a clickable mark: Enter or
//                                 Space calls fn with (event, datum), like a click.
//   FigKit.fit(sel, x, y, W)      place a text label beside the mark at (x, y), flipping it
//                                 to the left (or below) when it would leave the W-wide svg.
//   FigKit.seeded(seed, fn)      run fn with Math.random replaced by a seeded PRNG
//                                 (mulberry32), so a default dataset is the same on every
//                                 visit even when the generator lives in a shared library.
//   FigKit.dark()                 true when the reader's colour scheme is dark, for
//                                 figures that must pick resolved colours (d3 scales).
(function (global) {
  'use strict';

  function width(host, max, min) {
    var w = host && host.clientWidth ? host.clientWidth : max;
    return Math.max(min || 280, Math.min(max, Math.floor(w)));
  }

  function labelFor(label, d, i) {
    return typeof label === 'function' ? label(d, i) : label;
  }

  function keyMove(sel, label, step) {
    sel.attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-roledescription', 'draggable point')
      .attr('aria-label', function (d, i) { return labelFor(label, d, i); })
      .on('keydown.figkit', function (event, d) {
        var k = event.key, m = event.shiftKey ? 5 : 1, dx = 0, dy = 0;
        if (k === 'ArrowLeft') dx = -m;
        else if (k === 'ArrowRight') dx = m;
        else if (k === 'ArrowUp') dy = m;
        else if (k === 'ArrowDown') dy = -m;
        else return;
        event.preventDefault();
        step.call(this, dx, dy, d);
      });
    return sel;
  }

  function pressable(sel, label, fn) {
    sel.attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', function (d, i) { return labelFor(label, d, i); })
      .on('keydown.figkit', function (event, d) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        fn.call(this, event, d);
      });
    return sel;
  }

  function fit(sel, x, y, W, gap) {
    gap = gap == null ? 10 : gap;
    var node = sel.node();
    var len = node && node.getComputedTextLength ? node.getComputedTextLength() : 0;
    var left = x + gap + len > W - 2;
    sel.attr('x', left ? x - gap : x + gap)
      .attr('text-anchor', left ? 'end' : 'start')
      .attr('y', y - gap < 12 ? y + gap + 10 : y - gap);
    return sel;
  }

  function seeded(seed, fn) {
    var a = seed >>> 0, saved = Math.random;
    Math.random = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { return fn(); } finally { Math.random = saved; }
  }

  function dark() {
    return !!(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  global.FigKit = { width: width, keyMove: keyMove, pressable: pressable, fit: fit, seeded: seeded, dark: dark };
})(window);
