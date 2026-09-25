// foam3d.js — tiny canvas 3D engine shared across the Foam series.
// No dependencies. Solid convex polyhedra rendered with backface culling +
// painter's algorithm + Lambert shading, draggable to rotate. Face colors are
// read from the page's CSS custom properties so dark mode works for free.
//
// Public API (window.Foam3D):
//   truncatedOctahedron()      -> { verts, faces:[{idx, type}] }   (Kelvin / BCC cell)
//   cube(), octahedron(), rhombicDodecahedron()                    (FCC cell)
//   makeViewer(canvas, geom, opts) -> { redraw, state, geom, stopSpin }
//
// geom = { verts: [[x,y,z],...], faces: [{idx:[vertexIndices], type:'square'|'hex'|...}] }

(function (global) {
  'use strict';

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var L = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / L, a[1] / L, a[2] / L]; }
  function avg(pts) {
    var s = [0, 0, 0];
    pts.forEach(function (p) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; });
    return [s[0] / pts.length, s[1] / pts.length, s[2] / pts.length];
  }

  function rotate(verts, ax, ay) {
    var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    return verts.map(function (p) {
      var x = p[0], y = p[1], z = p[2];
      var y1 = y * cx - z * sx, z1 = y * sx + z * cx;     // around X
      var x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;  // around Y
      return [x2, y1, z2];
    });
  }

  // Newell's method: robust normal for polygonal (possibly non-triangular) faces.
  function faceNormalRaw(pts) {
    var n = [0, 0, 0];
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i], b = pts[(i + 1) % pts.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]);
      n[1] += (a[2] - b[2]) * (a[0] + b[0]);
      n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    }
    return n;
  }

  // Order a face's vertex indices cyclically around its centroid (in-plane angle).
  // For these origin-centered cells the outward face normal is just the centroid
  // direction, which (unlike Newell on still-unordered points) is well defined here.
  function orderFace(verts, idxs) {
    var pts = idxs.map(function (i) { return verts[i]; });
    var c = avg(pts), n = norm(c);
    var ref = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    var u = norm(cross(n, ref)), v = cross(n, u);
    return idxs.slice().sort(function (a, b) {
      var pa = sub(verts[a], c), pb = sub(verts[b], c);
      return Math.atan2(dot(pa, v), dot(pa, u)) - Math.atan2(dot(pb, v), dot(pb, u));
    });
  }

  function permutations(arr) {
    if (arr.length === 1) return [arr];
    var out = [];
    arr.forEach(function (x, i) {
      permutations(arr.slice(0, i).concat(arr.slice(i + 1))).forEach(function (p) { out.push([x].concat(p)); });
    });
    return out;
  }
  function findIdx(verts, pred) { var r = []; verts.forEach(function (v, i) { if (pred(v)) r.push(i); }); return r; }

  // Truncated octahedron (Kelvin cell, Voronoi cell of BCC): perms of (0,±1,±2).
  function truncatedOctahedron() {
    var verts = [], seen = {};
    permutations([0, 1, 2]).forEach(function (p) {
      for (var sx = -1; sx <= 1; sx += 2)
        for (var sy = -1; sy <= 1; sy += 2)
          for (var sz = -1; sz <= 1; sz += 2) {
            var v = [p[0] * sx, p[1] * sy, p[2] * sz], key = v.join(',');
            if (!seen[key]) { seen[key] = true; verts.push(v); }
          }
    });
    var faces = [];
    for (var axis = 0; axis < 3; axis++)
      for (var s = -2; s <= 2; s += 4)
        faces.push({ idx: orderFace(verts, findIdx(verts, (function (axis, s) { return function (v) { return v[axis] === s; }; })(axis, s))), type: 'square' });
    for (var a = -1; a <= 1; a += 2)
      for (var b = -1; b <= 1; b += 2)
        for (var c = -1; c <= 1; c += 2)
          faces.push({ idx: orderFace(verts, findIdx(verts, (function (a, b, c) { return function (v) { return v[0] * a + v[1] * b + v[2] * c === 3; }; })(a, b, c))), type: 'hex' });
    return { verts: verts, faces: faces };
  }

  function cube() {
    var verts = [];
    for (var x = -1; x <= 1; x += 2) for (var y = -1; y <= 1; y += 2) for (var z = -1; z <= 1; z += 2) verts.push([x, y, z]);
    var faces = [];
    for (var ax = 0; ax < 3; ax++) for (var s = -1; s <= 1; s += 2)
      faces.push({ idx: orderFace(verts, findIdx(verts, (function (ax, s) { return function (v) { return v[ax] === s; }; })(ax, s))), type: 'square' });
    return { verts: verts, faces: faces };
  }

  function octahedron() {
    var verts = [[2, 0, 0], [-2, 0, 0], [0, 2, 0], [0, -2, 0], [0, 0, 2], [0, 0, -2]];
    var faces = [];
    for (var a = -1; a <= 1; a += 2) for (var b = -1; b <= 1; b += 2) for (var c = -1; c <= 1; c += 2) {
      var idx = [
        verts.findIndex(function (v) { return v[0] === 2 * a; }),
        verts.findIndex(function (v) { return v[1] === 2 * b; }),
        verts.findIndex(function (v) { return v[2] === 2 * c; })
      ];
      faces.push({ idx: orderFace(verts, idx), type: 'tri' });
    }
    return { verts: verts, faces: faces };
  }

  // Rhombic dodecahedron (Voronoi cell of FCC). 12 rhombic faces on (±1,±1,0)&perms.
  function rhombicDodecahedron() {
    var verts = [[2, 0, 0], [-2, 0, 0], [0, 2, 0], [0, -2, 0], [0, 0, 2], [0, 0, -2]];
    for (var x = -1; x <= 1; x += 2) for (var y = -1; y <= 1; y += 2) for (var z = -1; z <= 1; z += 2) verts.push([x, y, z]);
    var dirs = [[1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0], [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1], [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1]];
    var faces = [];
    dirs.forEach(function (d) {
      var idx = findIdx(verts, function (v) { return v[0] * d[0] + v[1] * d[1] + v[2] * d[2] === 2; });
      if (idx.length >= 3) faces.push({ idx: orderFace(verts, idx), type: 'rhomb' });
    });
    return { verts: verts, faces: faces };
  }

  // ---- color helpers ----
  function cssVar(name, fb) { var v = getComputedStyle(document.documentElement).getPropertyValue(name); return (v && v.trim()) || fb; }
  function toRgb(col) {
    col = col.trim();
    if (col[0] === '#') {
      var h = col.slice(1);
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    var m = col.match(/(\d+\.?\d*)/g);
    return (m && m.length >= 3) ? [+m[0], +m[1], +m[2]] : [14, 116, 144];
  }
  function clamp(x) { return Math.max(0, Math.min(255, Math.round(x))); }

  function makeViewer(canvas, geom, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var DPR = global.devicePixelRatio || 1;
    var W = opts.width || canvas.clientWidth || 360, H = opts.height || 340;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(DPR, DPR);

    var colors = opts.colors || {};
    function faceRgb(type) {
      if (colors[type]) return toRgb(colors[type]);
      if (type === 'square') return toRgb(cssVar('--c-lattice', '#2563eb'));
      if (type === 'hex') return toRgb(cssVar('--c-cell', '#0e7490'));
      if (type === 'rhomb') return toRgb(cssVar('--c-d14', '#7c3aed'));
      if (type === 'tri') return toRgb(cssVar('--c-d12', '#0d9488'));
      return toRgb(cssVar('--c-cell', '#0e7490'));
    }
    var edgeCol = opts.edge || cssVar('--text', '#1a1a2e');
    var light = norm(opts.light || [0.4, 0.55, 0.78]);
    var state = {
      ax: opts.ax != null ? opts.ax : -0.42,
      ay: opts.ay != null ? opts.ay : 0.62,
      scale: opts.scale || 58,
      highlight: opts.highlight || null
    };

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var rv = rotate(geom.verts, state.ax, state.ay);
      var cx = W / 2, cy = H / 2, s = state.scale;
      var order = geom.faces.map(function (f) {
        var zc = 0; f.idx.forEach(function (k) { zc += rv[k][2]; });
        return { f: f, z: zc / f.idx.length };
      }).sort(function (a, b) { return a.z - b.z; });

      order.forEach(function (o) {
        var f = o.f, pts3 = f.idx.map(function (k) { return rv[k]; });
        var c = avg(pts3), n = norm(faceNormalRaw(pts3));
        if (dot(n, c) < 0) n = [-n[0], -n[1], -n[2]];
        if (n[2] <= 0.001) return; // backface cull (camera looks along -z from +z)
        var lam = 0.45 + 0.55 * Math.max(0, dot(n, light));
        var dim = state.highlight && f.type !== state.highlight;
        var rgb = faceRgb(f.type), k = lam * (dim ? 0.6 : 1), add = dim ? 70 : 0;
        ctx.beginPath();
        f.idx.forEach(function (vi, j) {
          var p = rv[vi], X = cx + p[0] * s, Y = cy - p[1] * s;
          if (j === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgb(' + clamp(rgb[0] * k + add) + ',' + clamp(rgb[1] * k + add) + ',' + clamp(rgb[2] * k + add) + ')';
        ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = edgeCol; ctx.globalAlpha = dim ? 0.35 : 0.85;
        ctx.stroke(); ctx.globalAlpha = 1;
      });
    }

    var dragging = false, lx = 0, ly = 0;
    canvas.style.touchAction = 'none'; canvas.style.cursor = 'grab';
    // keyboard: arrow keys turn the solid
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    if (opts.label) canvas.setAttribute('aria-label', opts.label + ' Drag or use the arrow keys to rotate.');
    canvas.addEventListener('keydown', function (e) {
      var d = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
      if (!d) return;
      e.preventDefault();
      state.ax += d[0] * 0.15; state.ay += d[1] * 0.15; draw();
    });
    canvas.addEventListener('pointerdown', function (e) { dragging = true; lx = e.clientX; ly = e.clientY; canvas.style.cursor = 'grabbing'; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      state.ay += (e.clientX - lx) * 0.01; state.ax += (e.clientY - ly) * 0.01;
      lx = e.clientX; ly = e.clientY; draw();
    });
    function end() { dragging = false; canvas.style.cursor = 'grab'; }
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);

    var spinning = false, raf = null;
    function spin() { if (!spinning) return; if (!dragging) { state.ay += 0.004; draw(); } raf = requestAnimationFrame(spin); }
    function startSpin() { if (global.Motion && Motion.reduced()) { draw(); return; } if (spinning) return; spinning = true; raf = requestAnimationFrame(spin); }
    function stopSpin() { spinning = false; if (raf) cancelAnimationFrame(raf); }
    if (opts.spin === false) { draw(); }
    else if (global.Motion && Motion.onVisible) { Motion.onVisible(canvas, function (v) { v ? startSpin() : stopSpin(); }); }
    else { startSpin(); }

    draw();
    return { redraw: draw, state: state, geom: geom, stopSpin: stopSpin };
  }

  global.Foam3D = {
    truncatedOctahedron: truncatedOctahedron,
    cube: cube,
    octahedron: octahedron,
    rhombicDodecahedron: rhombicDodecahedron,
    makeViewer: makeViewer,
    rotate: rotate
  };
})(typeof window !== 'undefined' ? window : globalThis);
