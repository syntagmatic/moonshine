// Exceptional Atlas: dark theme for figure code (generated table, see
// plans/audit/findings/figures-atlas.md). d3 attributes, canvas fills and
// KaTeX \\color{} need literal colors, so EA.c(hex) returns the dark-theme
// value of a light-theme literal when the reader's system is dark (read once).
(function (root) {
  'use strict';
  var dark = !!(root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches);
  var MAP = { "#000": "#e8e6dd", "#000000": "#e8e6dd", "#047857": "#9cfce1", "#059669": "#34d399", "#065f46": "#9ff9e0", "#06b6d4": "#47e0fa", "#0891b2": "#4ad5f7", "#0f172a": "#f1f5f9", "#16a34a": "#4ade80", "#1a1a2e": "#e8e6dd", "#1d4ed8": "#93c5fd", "#1e40af": "#5e7de3", "#22c55e": "#5ee38f", "#2563eb": "#60a5fa", "#334155": "#bfcad9", "#34d399": "#64ddb1", "#377eb8": "#6ea6d4", "#3b82f6": "#60a5fa", "#475569": "#c2cad6", "#4a4a6a": "#a0a0b4", "#4daf4a": "#7dc77a", "#4f46e5": "#625ae8", "#60a5fa": "#60a5fa", "#6366f1": "#6366f1", "#64748b": "#94a3b8", "#66c2a5": "#78c9b0", "#6b7280": "#7f8694", "#7c3aed": "#a78bfa", "#8da0cb": "#8da0cb", "#94a3b8": "#8391a8", "#984ea3": "#b97fc2", "#a6d854": "#afdc65", "#a78bfa": "#a78bfa", "#a855f7": "#a855f7", "#b45309": "#f6954b", "#c026d3": "#e879f9", "#cbd5e1": "#4a5568", "#d1fae5": "#1c4a32", "#d97706": "#fbbf24", "#db2777": "#e45d99", "#dbeafe": "#182f4e", "#dc2626": "#f87171", "#dde": "#3a3a50", "#e11d48": "#e95878", "#e2e2e8": "#34344a", "#e2e8f0": "#34344a", "#e41a1c": "#ec5657", "#e5e7eb": "#34344a", "#e78ac3": "#e78ac3", "#ea580c": "#fb923c", "#eab308": "#f9ce49", "#ef4444": "#f87171", "#f0abfc": "#f0abfc", "#f1f5f9": "#28333e", "#f3f4f6": "#14161a", "#f3f4f9": "#22222f", "#f4f6fb": "#22222f", "#f59e0b": "#fbbf24", "#f8fafc": "#1b1b27", "#f97316": "#fa9047", "#fafafa": "#16161f", "#fafbff": "#1b1b27", "#fb7185": "#fb7185", "#fbbf24": "#fcc946", "#fc8d62": "#fc8d62", "#fcfcff": "#1b1b27", "#fee2e2": "#4d1919", "#fef3c7": "#4e4318", "#ff7f00": "#ffa042", "#fff": "#20202e", "#fff7ed": "#4f3617", "#ffffff": "#20202e" };
  function c(hex) { return dark ? (MAP[String(hex).toLowerCase()] || hex) : hex; }
  function tex(src) { return dark ? String(src).replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, c) : src; }
  root.EA = { dark: dark, c: c, tex: tex };
  var k = root.katex;
  if (dark && k && !k.__eaDark) {
    var render = k.render, toString = k.renderToString;
    k.render = function (expr, el, opts) { return render.call(k, tex(expr), el, opts); };
    k.renderToString = function (expr, opts) { return toString.call(k, tex(expr), opts); };
    k.__eaDark = true;
  }
})(window);
