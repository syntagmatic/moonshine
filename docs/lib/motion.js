// motion.js — shared reduced-motion override used across every series.
//
// If the OS reports `prefers-reduced-motion: reduce` we respect it by default:
//   • the page's own `@media (prefers-reduced-motion: reduce)` CSS rule, scoped
//     via `html:not([data-motion="full"]) * { ... 0s !important }`, collapses
//     all transition/animation durations to zero,
//   • every simulation queries `Motion.reduced()` and skips/short-circuits
//     its animation loop accordingly.
//
// Users with a persistent preference to watch animations anyway can opt in.
// We set `localStorage['li-motion-override'] = '1'`, mark the <html> element
// with `data-motion="full"` synchronously (before the page's inline <style>
// parses), and reload so every simulation re-runs with `Motion.reduced() ===
// false`. A banner at the top of .article surfaces the toggle.
//
// Public API: window.Motion.{reduced, overridden, enable, disable, mountBanner,
// onVisible}.

(function (global) {
  'use strict';

  var MOTION_KEY = 'li-motion-override';

  function override() {
    try { return localStorage.getItem(MOTION_KEY) === '1'; } catch (e) { return false; }
  }
  function system() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var Motion = {
    reduced: function () { return system() && !override(); },
    overridden: override,
    onVisible: function (element, callback) {
      if (!element || typeof callback !== 'function') return function () {};
      if (!global.IntersectionObserver) {
        callback(true);
        return function () {};
      }
      var visible = true;
      var observer = new global.IntersectionObserver(function (entries) {
        visible = !!(entries[0] && entries[0].isIntersecting);
        callback(visible);
      }, { rootMargin: '80px 0px 80px 0px', threshold: 0.01 });
      observer.observe(element);
      callback(visible);
      return function () { observer.disconnect(); };
    },
    enable: function () {
      try { localStorage.setItem(MOTION_KEY, '1'); } catch (e) {}
      if (global.document) global.document.documentElement.dataset.motion = 'full';
      global.location && global.location.reload();
    },
    disable: function () {
      try { localStorage.removeItem(MOTION_KEY); } catch (e) {}
      if (global.document) delete global.document.documentElement.dataset.motion;
      global.location && global.location.reload();
    },
    mountBanner: function () {
      if (!system() || override()) return;
      var doc = global.document;
      if (!doc) return;
      // Prefer to inject into the article wrapper; fall back to <body>.
      var host = doc.querySelector('.article') || doc.body;
      if (!host || doc.getElementById('motion-banner')) return;
      var b = doc.createElement('div');
      b.id = 'motion-banner';
      b.setAttribute('role', 'status');
      b.style.cssText = [
        'margin: 0 0 1rem',
        'padding: 0.7rem 1rem',
        'border: 1px solid #fde68a',
        'background: #fef3c7',
        "font-family: 'Source Sans 3', system-ui, sans-serif",
        'font-size: 0.9rem',
        'color: #713f12',
        'border-radius: 6px',
        'display: flex',
        'align-items: center',
        'justify-content: space-between',
        'gap: 1rem',
        'flex-wrap: wrap'
      ].join(';');
      var msg = doc.createElement('span');
      msg.innerHTML = 'Your system requests <strong>reduced motion</strong>. Simulations are showing static end-states. You can enable full motion site-wide.';
      var btn = doc.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Enable animations';
      btn.style.cssText = [
        "font-family: 'Source Sans 3', system-ui, sans-serif",
        'font-size: 0.85rem',
        'font-weight: 600',
        'padding: 0.4rem 0.9rem',
        'border-radius: 5px',
        'border: 1px solid #b45309',
        'background: #fff',
        'color: #713f12',
        'cursor: pointer'
      ].join(';');
      btn.addEventListener('click', function () { Motion.enable(); });
      b.appendChild(msg); b.appendChild(btn);
      host.insertBefore(b, host.firstChild);
    }
  };

  // Apply data-motion synchronously before the inline <style> parses so the
  // scoped `@media (prefers-reduced-motion: reduce)` rule misses on first paint.
  if (override() && global.document && global.document.documentElement) {
    global.document.documentElement.dataset.motion = 'full';
  }

  // Auto-mount the banner on DOM ready.
  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', Motion.mountBanner);
    } else {
      Motion.mountBanner();
    }
  }

  global.Motion = Motion;
})(typeof window !== 'undefined' ? window : globalThis);
