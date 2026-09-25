// figure-a11y.js: accessibility and phone-width floor for every .figure on a page.
//
// 1. Each top-level <svg> or <canvas> in a figure gets a role and an aria-label.
//    The label comes from a data-label attribute on the element (or on the
//    figure), else from the first sentence of the figure caption. Graphics
//    whose parts can be clicked get role="group" so the parts stay reachable;
//    the rest get role="img".
// 2. Anything inside a figure that is clickable but is not a native control
//    (an SVG edge, a board cell, a bead) becomes focusable, gets role="button",
//    and turns Enter or Space into a click at the element's center. Its name
//    comes from data-label, aria-label, a <title> child, or its text.
// 3. SVG text drawn in a viewBox is scaled down with the drawing. On a phone a
//    12-unit label can land at 5px. Text is enlarged in user units until it
//    renders at least MIN_PX on screen. A figure can opt out with
//    data-text-floor="off" or pick its own floor with data-text-floor="8".
// Figures redraw themselves, so all of this reruns after DOM mutations and on
// resize, coalesced to one pass per animation frame.
(function () {
  'use strict';
  var MIN_PX = 9;
  var NATIVE = /^(BUTTON|INPUT|SELECT|TEXTAREA|A|LABEL|OPTION|SUMMARY)$/;
  var capSeq = 0;

  function captionText(fig) {
    var cap = fig.querySelector('.figure-caption');
    if (!cap) return '';
    // KaTeX renders math twice (MathML and HTML) plus a TeX annotation, so
    // textContent would repeat every formula. Keep only the MathML tokens.
    var clone = cap.cloneNode(true);
    clone.querySelectorAll('.katex-html, .figure-label, annotation').forEach(function (n) { n.remove(); });
    var t = clone.textContent.replace(/\s+/g, ' ').trim();
    var m = t.match(/^(.{20,}?[.!?])(\s|$)/);
    return m ? m[1] : t;
  }

  function nameOf(el) {
    if (el.dataset && el.dataset.label) return el.dataset.label;
    var t = el.querySelector && el.querySelector('title');
    if (t && t.textContent.trim()) return t.textContent.trim();
    var txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return txt.slice(0, 60);
  }

  function isClickable(el) {
    if (NATIVE.test(el.tagName)) return false;
    if (el.closest('.katex')) return false;
    var cs = getComputedStyle(el);
    if (cs.cursor !== 'pointer') return false;
    // Only the outermost pointer element of a nested group.
    var p = el.parentElement;
    if (p && !p.classList.contains('figure') && getComputedStyle(p).cursor === 'pointer' && !(p.tagName === 'svg' || p.tagName === 'g')) return false;
    return true;
  }

  function onKey(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.currentTarget;
    e.preventDefault();
    var r = el.getBoundingClientRect();
    var opts = { bubbles: true, cancelable: true, view: window, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  }

  function textFloor(fig, svg) {
    var setting = fig.dataset.textFloor || svg.dataset.textFloor;
    if (setting === 'off') return;
    var min = setting ? parseFloat(setting) : MIN_PX;
    var vb = svg.viewBox && svg.viewBox.baseVal;
    if (!vb || !vb.width) return;
    var w = svg.getBoundingClientRect().width;
    if (!w) return;
    var scale = w / vb.width;
    svg.querySelectorAll('text').forEach(function (t) {
      if (t.dataset.fs0 === undefined) {
        t.dataset.fs0 = parseFloat(getComputedStyle(t).fontSize) || 12;
        t.dataset.fs0Inline = t.style.fontSize;
      }
      var fs0 = parseFloat(t.dataset.fs0);
      var want = fs0 * scale < min ? min / scale : null;
      t.style.fontSize = want ? want.toFixed(1) + 'px' : t.dataset.fs0Inline;
    });
  }

  function apply() {
    document.querySelectorAll('.figure').forEach(function (fig) {
      var cap = fig.querySelector('.figure-caption');
      if (cap && !cap.id) cap.id = 'figcap-' + (++capSeq);
      var gfx = Array.prototype.filter.call(fig.querySelectorAll('svg, canvas'), function (e) {
        return !e.closest('.katex') && !(e.parentElement && e.parentElement.closest('svg'));
      });
      var clickables = [];
      fig.querySelectorAll('*').forEach(function (el) {
        if (el.hasAttribute('data-a11y-skip')) return;
        if (el.getAttribute('tabindex') !== null || NATIVE.test(el.tagName)) return;
        if (isClickable(el)) clickables.push(el);
      });
      clickables.forEach(function (el) {
        el.setAttribute('tabindex', '0');
        if (!el.getAttribute('role')) el.setAttribute('role', 'button');
        if (!el.getAttribute('aria-label')) {
          var n = nameOf(el);
          if (n) el.setAttribute('aria-label', n);
        }
        el.addEventListener('keydown', onKey);
      });
      gfx.forEach(function (g) {
        if (g.tagName.toLowerCase() === 'svg') textFloor(fig, g);
        if (g.getAttribute('aria-label') && g.getAttribute('role')) return;
        var interactive = g.querySelector('[tabindex]') || getComputedStyle(g).cursor !== 'auto';
        if (!g.getAttribute('role')) g.setAttribute('role', interactive ? 'group' : 'img');
        if (!g.getAttribute('aria-label')) {
          var label = g.dataset.label || fig.dataset.label || captionText(fig);
          if (label) g.setAttribute('aria-label', label);
        }
        if (cap && !g.getAttribute('aria-describedby')) g.setAttribute('aria-describedby', cap.id);
      });
    });
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; apply(); });
  }

  function start() {
    var style = document.createElement('style');
    style.textContent = '.figure [role="button"]:focus-visible{outline:2px solid #2563eb;outline-offset:2px}' +
      '.figure svg [role="button"]:focus-visible{outline:none;stroke:#2563eb;stroke-width:3px}';
    document.head.appendChild(style);
    // Only element insertions matter; text updates (a status line, a tick
    // label) do not need a new pass.
    var mo = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var added = list[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1) { schedule(); return; }
        }
      }
    });
    document.querySelectorAll('.figure').forEach(function (f) { mo.observe(f, { childList: true, subtree: true }); });
    window.addEventListener('resize', schedule);
    schedule();
  }

  // Labels read the captions, so wait until the page's own scripts have
  // rendered KaTeX into them.
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', function () { start(); schedule(); });
})();
