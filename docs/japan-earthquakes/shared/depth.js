// Series depth colour: red at the surface, through magenta and purple, to blue
// from 300 km down. Piecewise, so the 0-70 km range where most events sit gets
// two hues, and no pale middle, so every depth stands out on both backgrounds.
// Returns resolved hex (Lab interpolation), clamped to the 0-680 km domain.
window.DEPTH_DOMAIN = [0, 30, 70, 170, 300, 450, 680];
window.depthScale = function (dark) {
  const stops = dark
    ? ["#ff6a3d", "#f0444f", "#e8559a", "#b872dc", "#8a8cf5", "#6b9dff", "#9cc2ff"]
    : ["#e34a1f", "#cc1f2d", "#b0135e", "#7e2e9e", "#4a55d0", "#2f64cc", "#1c3a94"];
  const s = d3.scaleLinear().domain(window.DEPTH_DOMAIN).range(stops)
    .interpolate(d3.interpolateLab).clamp(true);
  const f = d => d3.color(s(d)).formatHex();
  f.domain = () => [0, 680];
  return f;
};
