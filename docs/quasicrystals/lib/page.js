// page.js: small DOM helpers shared by the quasicrystals articles.
(function (root) {
  'use strict';

  // Resolved color of a CSS custom property (hex or rgb string), for canvas
  // and for anything passed through a d3 scale or interpolator.
  function color(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';
  }

  // KaTeX \\color{} takes literal hex, so swap the light concept colors for
  // their dark-theme values (mirrors the dark block in style.css).
  var DARK = root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches;
  var DARK_HEX = { '#c2410c': '#fb923c', '#4338ca': '#a5b4fc', '#b7791f': '#fbbf24',
    '#0f766e': '#2dd4bf', '#be123c': '#fb7185', '#64748b': '#94a3b8' };
  function tex(src) {
    return DARK ? src.replace(/#[0-9a-fA-F]{6}/g, function (h) { return DARK_HEX[h.toLowerCase()] || h; }) : src;
  }

  // Render [data-tex] and [data-tex-display] once KaTeX has loaded.
  function renderTex() {
    if (!root.katex) return;
    document.querySelectorAll('[data-tex]').forEach(function (el) {
      katex.render(tex(el.getAttribute('data-tex')), el, { throwOnError: false });
    });
    document.querySelectorAll('[data-tex-display]').forEach(function (el) {
      katex.render(tex(el.getAttribute('data-tex-display')), el, { throwOnError: false, displayMode: true });
    });
  }
  root.addEventListener('load', renderTex);

  // A canvas sized W x H in CSS pixels at device resolution. Returns ctx with
  // the transform already scaled, so drawing code uses CSS pixel units.
  // label: aria-label text (role="img"), or null for a decorative canvas.
  function canvas(host, W, H, label) {
    var c = document.createElement('canvas');
    if (label) { c.setAttribute('role', 'img'); c.setAttribute('aria-label', label); }
    else if (label === null) c.setAttribute('aria-hidden', 'true');
    var dpr = Math.min(root.devicePixelRatio || 1, 2);
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    c.style.aspectRatio = W + ' / ' + H;
    host.appendChild(c);
    var ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { el: c, ctx: ctx, W: W, H: H, dpr: dpr };
  }

  // Pointer position in the canvas's CSS coordinate system (W x H).
  function pointer(cv, ev) {
    var r = cv.el.getBoundingClientRect();
    return [(ev.clientX - r.left) / r.width * cv.W, (ev.clientY - r.top) / r.height * cv.H];
  }

  // Coalesce redraws into one per animation frame.
  function throttle(fn) {
    var pending = false, args;
    return function () {
      args = arguments;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; fn.apply(null, args); });
    };
  }

  function fmt(x, n) { return (Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n); }

  root.Page = { color: color, tex: tex, renderTex: renderTex, canvas: canvas, pointer: pointer, throttle: throttle, fmt: fmt };
})(window);
