// theme.js: light/dark colour choice for canvas, d3 and KaTeX.
//
// CSS colours switch through the @media (prefers-color-scheme: dark) block
// in theme.css. Canvas pixels, d3 attributes and KaTeX \color{} values are
// literal hex, so pages pass them through Theme.c(hex): in light mode it
// returns the hex unchanged, in dark mode the paired dark-mode hex. The
// scheme is read once at load; there is no toggle.
//
// Public API: Theme.dark, Theme.c(hex), Theme.pick(light, dark), Theme.tex(tex).
// KaTeX render calls are wrapped so \color{#hex} is mapped automatically.
(function (global) {
  'use strict';
  var dark = !!(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);

  // light hex -> dark hex. Neutrals invert (paper becomes ink and vice versa);
  // saturated colours keep their hue and are lifted to read on a dark page.
  var MAP = {
    // paper and panel fills
    '#fff': '#1c1d25', '#ffffff': '#1c1d25', '#fafafa': '#191a21', '#f8fafc': '#1f2029',
    '#f1f5f9': '#23242e', '#f1f1f5': '#23242e', '#f0f0f5': '#23242e', '#f1f1f4': '#262733',
    '#eceef4': '#262733', '#f4f2f8': '#23242e', '#eee': '#2a2b36', '#e6e4ee': '#2a2b36',
    // hairlines and grids
    '#e2e2e8': '#33354a', '#e2e8f0': '#33354a', '#e9e9ef': '#2e3040', '#ddd': '#3a3c50',
    '#cbd5e1': '#4a4c60', '#ccc': '#4a4c60', '#c9c9d6': '#4a4c60', '#c8c8d4': '#4a4c60',
    '#c8c8d0': '#4a4c60', '#bbb': '#565870', '#b8b8c8': '#565870',
    // secondary ink
    '#a0a0b0': '#7d8198', '#94a3b8': '#7d8198', '#9ca3af': '#7d8198', '#8a8aa0': '#8a8ea4',
    '#64748b': '#9aa0b4', '#6b7280': '#9aa0b4', '#666': '#9aa0b4', '#4a4a6a': '#a4a4ba',
    '#475569': '#a4a4ba',
    // primary ink
    '#1a1a2e': '#e4e4ec', '#1e293b': '#dfe3ec', '#0f172a': '#e4e4ec', '#111': '#e4e4ec',
    '#2a2a2a': '#d8d8e0',
    // blues
    '#2563eb': '#5b8def', '#1d4ed8': '#7aa2f7', '#3b82f6': '#6b9ef8', '#1e3a8a': '#6a8ee0',
    '#0369a1': '#3ba3dc', '#2b59c3': '#6a8ee6',
    // reds
    '#dc2626': '#f05252', '#b91c1c': '#f26b6b', '#991b1b': '#f58a8a', '#ef4444': '#f26464',
    '#e74c3c': '#f06a5c', '#d64541': '#ec6a66', '#ff6060': '#ff7a7a',
    // violets
    '#7c3aed': '#a07cf5', '#6d28d9': '#9f7af0', '#8b5cf6': '#a58af8', '#a855f7': '#c08cfa',
    '#7c4dcc': '#a283e6', '#7c6fd6': '#9d93ea',
    // cyans and teals
    '#0891b2': '#2cb8d8', '#0e7490': '#35aecb', '#0ea5e9': '#40bff0', '#0d9488': '#2cc2b3',
    '#0f766e': '#2bb3a4',
    // greens
    '#059669': '#2fbf8a', '#047857': '#34b88a', '#10b981': '#34d399', '#065f46': '#6ee7b7',
    '#65a30d': '#8ccf3a',
    // oranges and ambers
    '#ea580c': '#f97a3c', '#c2410c': '#f0763c', '#9a3412': '#f59462', '#b45309': '#e8a33d',
    '#78350f': '#f5c26b', '#f97316': '#fb8a3c', '#c98a12': '#e0a93a',
    // pinks
    '#db2777': '#f0609f', '#be185d': '#ef5a98',
    // pale tints used as backgrounds
    '#fee2e2': '#3a1d22', '#d1fae5': '#15332a', '#dbeafe': '#1f2c4d', '#faf5ff': '#2a2140',
    '#f3e8ff': '#2a2140', '#fef3c7': '#382c17', '#ffedd5': '#382c17', '#fde2d4': '#3d2419',
    '#fca5a5': '#7a3434'
  };

  function c(hex) {
    if (!dark || typeof hex !== 'string') return hex;
    return MAP[hex.toLowerCase()] || hex;
  }
  function tex(s) {
    if (!dark || typeof s !== 'string') return s;
    return s.replace(/\\color\{(#[0-9a-fA-F]{3,6})\}/g, function (m, h) { return '\\color{' + c(h) + '}'; });
  }

  global.Theme = {
    dark: dark,
    c: c,
    pick: function (light, darkValue) { return dark ? darkValue : light; },
    tex: tex
  };

  if (dark && global.katex) {
    var render = global.katex.render, toString = global.katex.renderToString;
    global.katex.render = function (expr, el, opts) { return render.call(this, tex(expr), el, opts); };
    global.katex.renderToString = function (expr, opts) { return toString.call(this, tex(expr), opts); };
  }
})(window);
