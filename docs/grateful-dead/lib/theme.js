// Grateful Dead series: resolved colors for figure code. d3 attributes and
// scales need literal hex, so GD.c(hex) swaps a light-theme neutral for its
// dark-theme value when the reader's system is in dark mode (read once).
(function (root) {
  'use strict';
  var dark = !!(root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches);
  var DARK = {
    '#1a1a2e': '#e8e6dd', '#333': '#d4d4dc', '#4a4a6a': '#a0a0b4', '#555': '#b4b4c4',
    '#666': '#a0a0b4', '#999': '#7a7a90', '#bbb': '#56566c', '#ccc': '#4a4a60',
    '#ddd': '#3e3e52', '#e8e8e8': '#34344a', '#f0f0f0': '#2a2a3a', '#f5f5f8': '#2a2a3a',
    '#f8f9fa': '#1b1b27', '#fafafa': '#16161f', '#fff': '#20202e', '#ffffff': '#20202e',
    '#95a5a6': '#7f8c8d', '#b8b8c8': '#56566c', '#9090a0': '#7a7a90'
  };
  root.GD = {
    dark: dark,
    c: function (hex) { return dark ? (DARK[hex.toLowerCase()] || hex) : hex; }
  };
})(window);
