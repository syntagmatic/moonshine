// theme.js: dark-mode colors for figures drawn in JavaScript.
//
// The page CSS switches its color tokens under prefers-color-scheme: dark
// (lib/theme.css plus a per-page block of concept colors). Colors that
// figures write directly (an SVG fill, a canvas pixel, a d3 interpolator
// endpoint) cannot follow a CSS variable, so they go through Theme.c(hex),
// which returns the hex unchanged in light mode and a resolved dark-mode hex
// otherwise. The mapping is the same one used to generate the CSS blocks:
//   - very light colors (backgrounds, tints) become dark tints of the same hue,
//   - very dark, greyish colors (text, ink) become light,
//   - saturated accents are lifted into a band that reads on a dark ground.
// The scheme is read once at load; there is no toggle.
(function (global) {
  'use strict';
  var dark = !!(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);

  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
  }
  function rgbToHsl(c) {
    var r = c[0], g = c[1], b = c[2];
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0;
    if (mx !== mn) {
      var d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  }
  function hslToHex(h, s, l) {
    function f(n) {
      var k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l);
      var v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return ('0' + Math.round(v * 255).toString(16)).slice(-2);
    }
    return '#' + f(0) + f(8) + f(4);
  }
  var NAMED = { white: '#ffffff', black: '#000000' };

  function toDark(hex) {
    var hsl = rgbToHsl(hexToRgb(NAMED[hex] || hex));
    var h = hsl[0], s = hsl[1], l = hsl[2];
    if (l >= 0.75) return hslToHex(h, s * 0.55, 0.13 + (1 - l) * 0.9);
    if (l <= 0.2 || (l <= 0.35 && s < 0.5)) return hslToHex(h, s * 0.9, 0.92 - l * 0.6);
    return hslToHex(h, s * 0.75, Math.max(0.55, Math.min(0.72, l + 0.15)));
  }

  var cache = {};
  function c(hex) {
    if (!dark || typeof hex !== 'string') return hex;
    var key = hex.toLowerCase();
    if (!(key in cache)) cache[key] = (/^#[0-9a-f]{3}([0-9a-f]{3})?$/.test(key) || NAMED[key]) ? toDark(key) : hex;
    return cache[key];
  }
  // Resolve a CSS custom property to its current hex, for d3 scales and canvas.
  function token(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || null;
  }
  global.Theme = { dark: dark, c: c, token: token };
})(typeof window !== 'undefined' ? window : globalThis);
