// Exceptional Atlas: keyboard, touch and screen-reader access for figures.
// Loaded in <head>, before any figure code, so it can see which elements get
// pointer listeners (d3's .on() uses addEventListener too). After the page
// draws, and again whenever a figure redraws, it:
//   - names every figure <svg>/<canvas> from the first sentence of its caption,
//     with role="img", or role="group" when it holds focusable parts;
//   - makes clickable non-control elements focusable buttons that answer
//     Enter and Space;
//   - makes hover-only elements focusable (focus acts as hover) and sticky
//     on tap, so their readout survives the pointerleave a tap ends with.
(function (root) {
  'use strict';
  var CLICK = { click: 1, mousedown: 1, pointerdown: 1 };
  var HOVER = { mouseover: 1, mouseenter: 1, pointerenter: 1, pointerover: 1 };
  var NATIVE = /^(BUTTON|INPUT|SELECT|TEXTAREA|A|LABEL|OPTION|DETAILS|SUMMARY)$/;
  var add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (this instanceof Element) (this.__eaOn || (this.__eaOn = {}))[type] = true;
    return add.call(this, type, fn, opts);
  };

  function center(el) {
    var b = el.getBoundingClientRect();
    return { clientX: b.left + b.width / 2, clientY: b.top + b.height / 2, bubbles: true, view: root };
  }
  function fire(el, types) {
    var o = center(el);
    types.forEach(function (t) {
      var E = /^pointer/.test(t) && root.PointerEvent ? PointerEvent : MouseEvent;
      el.dispatchEvent(new E(t, Object.assign({}, o, { bubbles: !/enter|leave/.test(t) })));
    });
  }
  function nameOf(el) {
    var d = el.__data__;
    if (typeof d === 'string' || typeof d === 'number') return String(d);
    if (d && typeof d === 'object') {
      var k = d.label || d.name || d.id || d.key;
      if (typeof k === 'string' || typeof k === 'number') return String(k);
    }
    var t = (el.textContent || '').trim().replace(/\s+/g, ' ');
    return t && t.length < 60 ? t : '';
  }
  function has(on, set) { for (var k in on) if (set[k]) return true; return false; }

  function wire(el) {
    var on = el.__eaOn;
    if (!on || el.__eaWired || NATIVE.test(el.tagName)) return;
    var click = has(on, CLICK), hover = has(on, HOVER);
    if (!click && !hover) return;
    el.__eaWired = true;
    var surface = el.tagName === 'svg' || el.tagName === 'CANVAS';
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (click && !surface && !el.getAttribute('role')) el.setAttribute('role', 'button');
    if (!surface && !el.getAttribute('aria-label')) { var n = nameOf(el); if (n) el.setAttribute('aria-label', n); }
    add.call(el, 'keydown', function (e) {
      if (e.target !== el || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      if (click) fire(el, on.pointerdown ? ['pointerdown', 'pointerup', 'click'] : on.mousedown ? ['mousedown', 'mouseup', 'click'] : ['click']);
    });
    if (hover && !surface) {
      add.call(el, 'focus', function () { fire(el, ['pointerover', 'pointerenter', 'mouseover', 'mouseenter']); });
      add.call(el, 'blur', function () { fire(el, ['pointerout', 'pointerleave', 'mouseout', 'mouseleave']); });
      // A tap ends with pointerleave; re-enter afterwards so the hover state stays.
      if (!click) add.call(el, 'click', function () { fire(el, ['pointerenter', 'mouseenter', 'mouseover']); });
    }
  }

  function captionText(fig) {
    var cap = fig.querySelector('.figure-caption, figcaption, .caption');
    if (!cap) return '';
    var t = cap.textContent.replace(/\s+/g, ' ').trim().replace(/^Figure\s+\d+[.:]\s*/, '');
    var m = t.match(/^.*?[.!?](\s|$)/);
    return (m ? m[0] : t).trim();
  }
  function label(fig) {
    var text = captionText(fig);
    var surfaces = fig.querySelectorAll('svg, canvas');
    var n = 0;
    surfaces.forEach(function (s) {
      if (s.parentElement.closest('svg') || s.closest('.katex, button')) return;
      var b = s.getBoundingClientRect();
      if (b.width < 40 || b.height < 30) return;
      n++;
    });
    var i = 0;
    surfaces.forEach(function (s) {
      if (s.parentElement.closest('svg') || s.closest('.katex, button')) return;
      var b = s.getBoundingClientRect();
      if (b.width < 40 || b.height < 30) return;
      i++;
      if (!s.getAttribute('aria-label') && !s.getAttribute('aria-labelledby') && text) {
        s.setAttribute('aria-label', (n > 1 ? 'Panel ' + i + ' of ' + n + '. ' : '') + text);
      }
      if (!s.getAttribute('role')) s.setAttribute('role', s.querySelector('[tabindex]') || s.hasAttribute('tabindex') ? 'group' : 'img');
    });
  }

  function scan(fig) {
    fig.querySelectorAll('*').forEach(wire);
    label(fig);
  }
  function start() {
    document.querySelectorAll('.figure, figure').forEach(function (fig) {
      scan(fig);
      var timer = null;  // debounced: animated figures redraw every frame
      new MutationObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(function () { scan(fig); }, 250);
      }).observe(fig, { childList: true, subtree: true });
    });
  }
  if (document.readyState === 'complete') start();
  else root.addEventListener('load', start);
})(window);
