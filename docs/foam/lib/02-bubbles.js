// 02-bubbles.js: model code for Foam part 2, "The Double Bubble".
// No DOM. Runs in the browser (window.FoamBubbles) and in node. Depends on nothing.
//
// Everything is closed-form geometry of circles and spheres plus one-dimensional root
// finding; nothing is fitted.
//
// Public API:
//   solids()                 -> the five Platonic solids, each with its surface area over
//                               that of a sphere of the same volume (from coordinates)
//   cylinderRatio(t)         -> the same ratio for a cylinder of height t diameters
//   cylinderBand(level)      -> [tLow, tHigh] where the cylinder's ratio equals `level`
//   planeRatio(n)            -> perimeter of a regular n-gon over the circle's, equal area
//   doubleBubble(dim, beta)  -> the standard double bubble with its seam at distance 1
//                               from the axis, in the plane (dim 2) or in space (dim 3).
//                               beta is the angle of the right cap's tangent at the seam,
//                               in degrees, between -30 and 90; 30 is equal sizes.
//   solveDouble(dim, share)  -> the double bubble whose right chamber holds `share` of the
//                               total content, scaled to total content 1
//   doubleOutline(d, n)      -> its three films as point lists
//   chain(share, split)      -> the plane cluster with region 1 (area `share` of the total)
//                               in two pieces on opposite sides of region 2; `split` is the
//                               fraction of region 1 in the left piece. Total area 1.
//   chainOutline(c, slide)   -> the six arcs of that cluster as point lists, the left piece
//                               slid `slide` (0..1) of the way round to touch the right one
//   triple(fa, fb, fc, w0)   -> the standard plane triple bubble with those area shares
//   tripleFromPole(w)        -> the same family by its parameter (w = 0 is equal areas)
//   runChecks()              -> [{name, ok, detail}]

(function (global) {
  'use strict';

  var PI = Math.PI, DEG = PI / 180;
  var SPHERE = Math.pow(36 * PI, 1 / 3);     // surface of a sphere of volume 1

  function bisect(f, lo, hi, n) {
    var flo = f(lo);
    for (var i = 0; i < (n || 52); i++) {
      var mid = 0.5 * (lo + hi), fm = f(mid);
      if ((fm > 0) === (flo > 0)) { lo = mid; flo = fm; } else hi = mid;
    }
    return 0.5 * (lo + hi);
  }

  // ---------------------------------------------------------------- one volume
  // Platonic solids from coordinates: faces are found as the planes that have every
  // vertex on one side, so area and volume are measured, not quoted.
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { return Math.sqrt(dot(a, a)); }

  function evenPerms(v) { return [[v[0], v[1], v[2]], [v[1], v[2], v[0]], [v[2], v[0], v[1]]]; }
  function signs(v) {
    var out = [];
    for (var a = -1; a <= 1; a += 2) for (var b = -1; b <= 1; b += 2) for (var c = -1; c <= 1; c += 2) {
      var p = [a * v[0], b * v[1], c * v[2]], dup = false;
      for (var i = 0; i < out.length; i++) if (norm(sub(out[i], p)) < 1e-9) dup = true;
      if (!dup) out.push(p);
    }
    return out;
  }
  function platonicVertices(name) {
    var g = (1 + Math.sqrt(5)) / 2, out = [];
    if (name === 'tetrahedron') return [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
    if (name === 'cube') return signs([1, 1, 1]);
    if (name === 'octahedron') { evenPerms([1, 0, 0]).forEach(function (p) { out = out.concat(signs(p)); }); return out; }
    if (name === 'icosahedron') { evenPerms([0, 1, g]).forEach(function (p) { out = out.concat(signs(p)); }); return out; }
    if (name === 'dodecahedron') {
      out = signs([1, 1, 1]);
      evenPerms([0, 1 / g, g]).forEach(function (p) { out = out.concat(signs(p)); });
      return out;
    }
    return null;
  }
  // Surface area, volume and face count of the convex hull of points around the origin.
  function hullMeasure(P) {
    var n = P.length, seen = [], area = 0, vol = 0;
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) for (var k = j + 1; k < n; k++) {
      var nrm = cross(sub(P[j], P[i]), sub(P[k], P[i])), len = norm(nrm);
      if (len < 1e-9) continue;
      nrm = [nrm[0] / len, nrm[1] / len, nrm[2] / len];
      var d = dot(nrm, P[i]);
      if (d < 0) { nrm = [-nrm[0], -nrm[1], -nrm[2]]; d = -d; }
      var ok = true, on = [];
      for (var m = 0; m < n; m++) {
        var s = dot(nrm, P[m]) - d;
        if (s > 1e-9) { ok = false; break; }
        if (s > -1e-9) on.push(P[m]);
      }
      if (!ok) continue;
      var dup = false;
      for (var q = 0; q < seen.length; q++) if (norm(sub(seen[q], nrm)) < 1e-7) dup = true;
      if (dup) continue;
      seen.push(nrm);
      // order the face's corners by angle around its centroid, then fan-triangulate
      var c = [0, 0, 0];
      on.forEach(function (p) { c[0] += p[0] / on.length; c[1] += p[1] / on.length; c[2] += p[2] / on.length; });
      var e1 = sub(on[0], c); var l1 = norm(e1); e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1];
      var e2 = cross(nrm, e1);
      on.sort(function (a, b) {
        return Math.atan2(dot(sub(a, c), e2), dot(sub(a, c), e1)) - Math.atan2(dot(sub(b, c), e2), dot(sub(b, c), e1));
      });
      var fa = 0;
      for (var t = 0; t < on.length; t++) fa += 0.5 * norm(cross(sub(on[t], c), sub(on[(t + 1) % on.length], c)));
      area += fa; vol += fa * d / 3;
    }
    return { area: area, volume: vol, faces: seen.length };
  }
  function solids() {
    return ['tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron'].map(function (name) {
      var m = hullMeasure(platonicVertices(name));
      return { name: name, faces: m.faces, ratio: m.area / (SPHERE * Math.pow(m.volume, 2 / 3)) };
    });
  }
  // Cylinder of radius 1 and height 2t (t diameters tall): V = 2 pi t, A = 2 pi (1 + 2t).
  function cylinderRatio(t) { return 2 * PI * (1 + 2 * t) / (SPHERE * Math.pow(2 * PI * t, 2 / 3)); }
  function cylinderBand(level) {
    if (level <= cylinderRatio(1)) return null;
    return [bisect(function (t) { return cylinderRatio(t) - level; }, 1e-3, 1),
            bisect(function (t) { return cylinderRatio(t) - level; }, 1, 1e3)];
  }
  function planeRatio(n) { return Math.sqrt(n * Math.tan(PI / n) / PI); }

  // ---------------------------------------------------------------- two volumes
  // A cap of a circle (dim 2) or sphere (dim 3) of radius r cut off by a line or plane,
  // h deep: what it holds and how much boundary it has.
  function cap(dim, r, h) {
    if (dim === 3) return { content: PI * h * h * (3 * r - h) / 3, boundary: 2 * PI * r * h };
    var half = Math.sqrt(Math.max(0, 2 * r * h - h * h)), x = 2 * Math.atan2(half, r - h);
    // x - sin x loses every digit for a nearly flat arc, so use its series there
    var xs = x < 0.05 ? x * x * x / 6 * (1 - x * x / 20 * (1 - x * x / 42)) : x - Math.sin(x);
    return { content: 0.5 * r * r * xs, boundary: r * x };
  }
  // The seam is the pair of points (0, +-1) in the plane, or the unit circle about the x
  // axis in space. A film through the seam whose tangent there makes the angle theta with
  // the axis is a circle centered (tan theta, 0) of radius 1 / |cos theta|. Three films
  // at theta, theta + 120, theta + 240 meet at 120 degrees.
  function doubleBubble(dim, betaDeg) {
    function film(thDeg) {
      var c = Math.cos(thDeg * DEG);
      if (Math.abs(c) < 1e-12) return { flat: true, cx: 0, r: Infinity, k: 0 };
      return { flat: false, cx: Math.tan(thDeg * DEG), r: 1 / Math.abs(c), k: Math.abs(c) };
    }
    var R = film(betaDeg), L = film(betaDeg + 120), W = film(betaDeg + 240);
    var capR = cap(dim, R.r, R.cx + R.r), capL = cap(dim, L.r, L.r - L.cx);
    var wall, sign = 0, apex = 0;                 // sign +1: the wall bows to the right
    if (W.flat) wall = { content: 0, boundary: dim === 3 ? PI : 2 };
    else {
      sign = W.cx < 0 ? 1 : -1;
      var hW = 1 / (W.r + Math.abs(W.cx));      // = r - sqrt(r^2 - 1), without the cancellation
      wall = cap(dim, W.r, hW); apex = sign * hW;
    }
    return {
      dim: dim, beta: betaDeg, right: R, left: L, wall: W, wallSign: sign, wallApex: apex,
      contentR: capR.content - sign * wall.content, contentL: capL.content + sign * wall.content,
      boundaryR: capR.boundary, boundaryL: capL.boundary, boundaryW: wall.boundary,
      boundary: capR.boundary + capL.boundary + wall.boundary
    };
  }
  function ball(dim, content) {      // boundary of one circle or sphere holding `content`
    return dim === 3 ? SPHERE * Math.pow(content, 2 / 3) : 2 * Math.sqrt(PI * content);
  }
  // The double bubble whose right chamber holds `share` of the total, scaled to total 1.
  function solveDouble(dim, share) {
    var beta = bisect(function (b) {
      var d = doubleBubble(dim, b); return d.contentR / (d.contentR + d.contentL) - share;
    }, -30 + 1e-7, 90 - 1e-7);
    var d = doubleBubble(dim, beta), tot = d.contentR + d.contentL;
    var s = Math.pow(tot, -1 / dim);                       // length scale to total content 1
    var bScale = Math.pow(s, dim - 1);
    d.scale = s; d.share = share;
    d.total = d.boundary * bScale;                         // area (or perimeter) at total content 1
    d.separate = ball(dim, share) + ball(dim, 1 - share);  // two separate spheres, same contents
    d.single = ball(dim, 1);                               // one sphere holding both
    d.rRight = d.right.r * s; d.rLeft = d.left.r * s; d.rWall = d.wall.flat ? Infinity : d.wall.r * s;
    d.kRight = 1 / d.rRight; d.kLeft = 1 / d.rLeft; d.kWall = d.wall.flat ? 0 : 1 / d.rWall;
    return d;
  }

  // The three films as point lists from the upper seam point to the lower one, scaled
  // by d.scale when solveDouble set it.
  function doubleOutline(d, n) {
    n = n || 48;
    var s = d.scale || 1;
    function side(f, sgn) {
      var pts = [], i;
      if (f.flat) { for (i = 0; i <= n; i++) pts.push([0, s * (1 - 2 * i / n)]); return pts; }
      var a0 = Math.atan2(1, -f.cx), a1 = Math.atan2(-1, -f.cx), dlt = a1 - a0;
      if (sgn > 0) { while (dlt > 0) dlt -= 2 * PI; } else { while (dlt < 0) dlt += 2 * PI; }
      for (i = 0; i <= n; i++) { var a = a0 + dlt * i / n; pts.push([s * (f.cx + f.r * Math.cos(a)), s * f.r * Math.sin(a)]); }
      return pts;
    }
    return { right: side(d.right, 1), left: side(d.left, -1), wall: side(d.wall, d.wallSign > 0 ? 1 : -1) };
  }

  // ---------------------------------------------------------------- a rival in the plane
  // Region 1 in two pieces stuck to opposite sides of region 2. Each piece meets region 2
  // exactly as in a standard double bubble, so region 2's outer boundary lies on one
  // circle. Put that circle at the origin with radius 1: a piece described by the angle
  // beta (as in doubleBubble, with region 2 as the right chamber) has seam half-width
  // cos(beta), covers the half-angle 90 - beta of the circle, and its two films are
  // doubleBubble(2, beta)'s left cap and wall scaled by cos(beta).
  function piece(beta) {
    var d = doubleBubble(2, beta), y = Math.cos(beta * DEG);
    return {
      beta: beta, y: y, d: d,
      area: y * y * d.contentL,                 // the piece itself
      kept: y * y * d.contentR,                 // what region 2 keeps of the disc on this side
      films: y * (d.boundaryL + d.boundaryW),   // cap plus wall
      covered: 2 * (90 - beta) * DEG,           // arc of the unit circle under the piece
      pressure: d.left.k / y                    // curvature of the piece's cap
    };
  }
  function chainRaw(b1, b3) {
    var p1 = piece(b1), p3 = piece(b3);
    var mid = p1.kept + p3.kept - PI;
    return { left: p1, right: p3, a1: p1.area, a3: p3.area, mid: mid,
             perimeter: p1.films + p3.films + 2 * PI - p1.covered - p3.covered,
             gap: (b1 + b3) * DEG };            // free arc of the circle on each side
  }
  function chain(share, split) {
    var want = share / (1 - share);             // region 1 over region 2
    function b3For(b1) {                        // right piece that gives the wanted ratio
      return bisect(function (b3) {
        var c = chainRaw(b1, b3);
        return c.mid <= 0 ? 1 : (c.a1 + c.a3) / c.mid - want;
      }, Math.max(-30 + 1e-7, -b1 + 1e-7), 90 - 1e-9);
    }
    var b1 = bisect(function (b) {
      var c = chainRaw(b, b3For(b)); return split - c.a1 / (c.a1 + c.a3);
    }, -30 + 1e-6, 90 - 1e-9);
    var c = chainRaw(b1, b3For(b1)), tot = c.a1 + c.a3 + c.mid, s = 1 / Math.sqrt(tot);
    var std = solveDouble(2, share);
    return {
      share: share, split: split, b1: b1, b3: b3For(b1), raw: c, scale: s,
      areaLeft: c.a1 / tot, areaRight: c.a3 / tot, areaMid: c.mid / tot,
      perimeter: c.perimeter * s, standard: std.total, separate: std.separate,
      nested: 2 * Math.sqrt(PI) * (1 + Math.sqrt(Math.min(share, 1 - share))),
      pLeft: c.left.pressure / s, pRight: c.right.pressure / s, pMid: 1 / s,
      gap: c.gap, ok: c.mid > 0 && c.gap >= -1e-9
    };
  }
  // Points along the six films, in units where the total area is 1 and region 2's circle
  // is centered at the origin. `slide` turns the left piece about that center: 0 leaves
  // it opposite the right piece, 1 brings their upper corners together.
  function chainOutline(c, slide, n) {
    n = n || 40;
    var s = c.scale, turn = (slide || 0) * c.gap;       // clockwise, over the top
    function arcPts(cx, r, x0, sideSign) {              // arc through (x0, +-y) reaching x = cx + sideSign r
      var out = [];
      return function (y) {
        var a0 = Math.atan2(y, x0 - cx), a1 = Math.atan2(-y, x0 - cx), dlt = a1 - a0;
        if (sideSign > 0) { while (dlt > 0) dlt -= 2 * PI; } else { while (dlt < 0) dlt += 2 * PI; }
        for (var i = 0; i <= n; i++) { var a = a0 + dlt * i / n; out.push([cx + r * Math.cos(a), r * Math.sin(a)]); }
        return out;
      };
    }
    function pieceFilms(p, mirror, rot) {
      var d = p.d, y = p.y, x0 = -Math.sin(p.beta * DEG);     // chord of a left-hand piece
      var capArc = arcPts(x0 + y * d.left.cx, y * d.left.r, x0, -1)(y);
      var wallArc;
      if (d.wall.flat) wallArc = [[x0, y], [x0, -y]];
      else wallArc = arcPts(x0 + y * d.wall.cx, y * d.wall.r, x0, d.wallSign)(y);
      function place(q) {
        var x = mirror ? -q[0] : q[0], yy = q[1];
        var cs = Math.cos(rot), sn = Math.sin(rot);
        return [s * (x * cs + yy * sn), s * (-x * sn + yy * cs)];
      }
      return { cap: capArc.map(place), wall: wallArc.map(place), top: place([x0, y]), bottom: place([x0, -y]) };
    }
    var L = pieceFilms(c.raw.left, false, turn), R = pieceFilms(c.raw.right, true, 0);
    function circleArc(from, to) {                      // clockwise along the unit circle
      var a0 = Math.atan2(from[1], from[0]), a1 = Math.atan2(to[1], to[0]), dlt = a1 - a0, out = [];
      while (dlt > 1e-9) dlt -= 2 * PI;
      for (var i = 0; i <= n; i++) { var a = a0 + dlt * i / n; out.push([s * Math.cos(a), s * Math.sin(a)]); }
      return out;
    }
    return { leftCap: L.cap, leftWall: L.wall, rightCap: R.cap, rightWall: R.wall,
             top: circleArc(L.top, R.top), bottom: circleArc(R.bottom, L.bottom),
             corners: [L.top, L.bottom, R.top, R.bottom], radius: s };
  }

  // ---------------------------------------------------------------- three areas
  // The symmetric triple bubble: three straight walls from the origin to the corners
  // exp(i 90), exp(i 210), exp(i 330), and three caps of radius sqrt(3)/2 centered half a
  // unit out. A map z -> z / (1 - w z) sends circles to circles and keeps angles, and it
  // keeps the curvatures at each corner summing to zero (the three circles through a
  // corner still share a second point), so the image is again a balanced cluster. The
  // two real numbers in w set the two area ratios.
  function cmul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function cdiv(a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
  function mobius(w) { return function (z) { var wz = cmul(w, z); return cdiv(z, [1 - wz[0], -wz[1]]); }; }
  function pol(r, deg) { return [r * Math.cos(deg * DEG), r * Math.sin(deg * DEG)]; }

  // Circular arc from P to Q through M.
  function arc3(P, M, Q) {
    var ax = M[0] - P[0], ay = M[1] - P[1], bx = Q[0] - M[0], by = Q[1] - M[1];
    var turn = ax * by - ay * bx, chord = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
    if (Math.abs(turn) < 1e-13 * (1 + chord * chord)) return { P: P, Q: Q, flat: true, k: 0, length: chord, seg: 0 };
    var d = 2 * (P[0] * (M[1] - Q[1]) + M[0] * (Q[1] - P[1]) + Q[0] * (P[1] - M[1]));
    var p2 = P[0] * P[0] + P[1] * P[1], m2 = M[0] * M[0] + M[1] * M[1], q2 = Q[0] * Q[0] + Q[1] * Q[1];
    var cx = (p2 * (M[1] - Q[1]) + m2 * (Q[1] - P[1]) + q2 * (P[1] - M[1])) / d;
    var cy = (p2 * (Q[0] - M[0]) + m2 * (P[0] - Q[0]) + q2 * (M[0] - P[0])) / d;
    var r = Math.hypot(P[0] - cx, P[1] - cy), dir = turn > 0 ? 1 : -1;
    var a0 = Math.atan2(P[1] - cy, P[0] - cx), a1 = Math.atan2(Q[1] - cy, Q[0] - cx), sweep = (a1 - a0) * dir;
    while (sweep < 0) sweep += 2 * PI;
    while (sweep >= 2 * PI) sweep -= 2 * PI;
    // k and seg are signed for travel from P to Q: positive when the arc turns left
    return { P: P, Q: Q, flat: false, cx: cx, cy: cy, r: r, dir: dir, a0: a0, sweep: sweep,
             k: dir / r, length: r * sweep, seg: dir * 0.5 * r * r * (sweep - Math.sin(sweep)) };
  }
  function arcPoints(a, n) {
    var out = [], i;
    if (a.flat) { for (i = 0; i <= n; i++) out.push([a.P[0] + (a.Q[0] - a.P[0]) * i / n, a.P[1] + (a.Q[1] - a.P[1]) * i / n]); return out; }
    for (i = 0; i <= n; i++) { var t = a.a0 + a.dir * a.sweep * i / n; out.push([a.cx + a.r * Math.cos(t), a.cy + a.r * Math.sin(t)]); }
    return out;
  }
  function arcTangent(a, atEnd) {     // unit tangent in the direction of travel
    if (a.flat) { var L = a.length; return [(a.Q[0] - a.P[0]) / L, (a.Q[1] - a.P[1]) / L]; }
    var t = a.a0 + (atEnd ? a.dir * a.sweep : 0);
    return [-a.dir * Math.sin(t), a.dir * Math.cos(t)];
  }
  var TRI_R = Math.sqrt(3) / 2;
  function poleInside(w) {            // is the map's pole inside the symmetric cluster?
    var m = Math.hypot(w[0], w[1]);
    if (m < 1e-12) return false;
    var z = cdiv([1, 0], w), ang = Math.atan2(z[1], z[0]) / DEG;
    for (var k = 0; k < 3; k++) {
      var c = pol(0.5, 150 + 120 * k), dd = ((ang - (150 + 120 * k)) % 360 + 540) % 360 - 180;
      if (Math.abs(dd) <= 60 + 1e-9 && Math.hypot(z[0] - c[0], z[1] - c[1]) < TRI_R * 1.0005) return true;
    }
    return false;
  }
  // Bubble k (0, 1, 2 = A, B, C) sits between corners k and k+1, going counterclockwise.
  function tripleFromPole(w) {
    var f = mobius(w), O = f([0, 0]), V = [], walls = [], caps = [], k;
    for (k = 0; k < 3; k++) V.push(f(pol(1, 90 + 120 * k)));
    for (k = 0; k < 3; k++) walls.push(arc3(O, f(pol(0.5, 90 + 120 * k)), V[k]));               // center -> corner k
    for (k = 0; k < 3; k++) caps.push(arc3(V[k], f(pol(0.5 + TRI_R, 150 + 120 * k)), V[(k + 1) % 3]));
    var areas = [], pressures = [], perimeter = 0;
    for (k = 0; k < 3; k++) {
      var n = (k + 1) % 3;
      // counterclockwise round bubble k: out along wall k, along cap k, back along wall k+1
      var poly = 0.5 * ((O[0] * V[k][1] - V[k][0] * O[1]) + (V[k][0] * V[n][1] - V[n][0] * V[k][1]) + (V[n][0] * O[1] - O[0] * V[n][1]));
      areas.push(poly + walls[k].seg + caps[k].seg - walls[n].seg);
      pressures.push(caps[k].k);
      perimeter += walls[k].length + caps[k].length;
    }
    var tot = areas[0] + areas[1] + areas[2];
    return { w: w, O: O, V: V, walls: walls, caps: caps, areas: areas, total: tot,
             shares: areas.map(function (a) { return a / tot; }), pressures: pressures, perimeter: perimeter,
             valid: !poleInside(w) && areas[0] > 0 && areas[1] > 0 && areas[2] > 0 && caps[0].k > 0 && caps[1].k > 0 && caps[2].k > 0 };
  }
  // Newton's method on the two numbers in w, walking from a known cluster to the target
  // shares in short steps so it cannot jump the pole into the cluster.
  function triple(fa, fb, fc, w0) {
    var sum = fa + fb + fc; fa /= sum; fb /= sum;
    var w = w0 ? [w0[0], w0[1]] : [0, 0], cur = tripleFromPole(w);
    if (!cur.valid) { w = [0, 0]; cur = tripleFromPole(w); }
    var s0 = [cur.shares[0], cur.shares[1]];
    var dist = Math.hypot(fa - s0[0], fb - s0[1]), steps = Math.max(1, Math.ceil(dist / 0.04)), iters = 0;
    for (var st = 1; st <= steps; st++) {
      var ta = s0[0] + (fa - s0[0]) * st / steps, tb = s0[1] + (fb - s0[1]) * st / steps;
      for (var it = 0; it < 30; it++) {
        var ra = cur.shares[0] - ta, rb = cur.shares[1] - tb, res = Math.hypot(ra, rb);
        if (res < 1e-13) break;
        var h = 1e-7, cu = tripleFromPole([w[0] + h, w[1]]), cv = tripleFromPole([w[0], w[1] + h]);
        var j11 = (cu.shares[0] - cur.shares[0]) / h, j12 = (cv.shares[0] - cur.shares[0]) / h;
        var j21 = (cu.shares[1] - cur.shares[1]) / h, j22 = (cv.shares[1] - cur.shares[1]) / h;
        var det = j11 * j22 - j12 * j21;
        if (Math.abs(det) < 1e-300) break;
        var du = -(j22 * ra - j12 * rb) / det, dv = -(-j21 * ra + j11 * rb) / det, lam = 1, next = null;
        for (var ls = 0; ls < 40; ls++) {
          var cand = tripleFromPole([w[0] + lam * du, w[1] + lam * dv]);
          if (cand.valid && Math.hypot(cand.shares[0] - ta, cand.shares[1] - tb) < res) { next = cand; break; }
          lam *= 0.5;
        }
        if (!next) break;
        cur = next; w = cur.w; iters++;
      }
    }
    // scale to total area 1
    var s = 1 / Math.sqrt(cur.total);
    cur.scale = s; cur.iterations = iters;
    cur.residual = Math.hypot(cur.shares[0] - fa, cur.shares[1] - fb);
    cur.perimeter1 = cur.perimeter * s;
    cur.pressures1 = cur.pressures.map(function (p) { return p / s; });
    cur.separate = cur.shares.reduce(function (t, f) { return t + 2 * Math.sqrt(PI * f); }, 0);
    return cur;
  }
  // The largest departure from 120 degrees at the four corners, and from the pressure
  // rule on the three walls (wall curvature = difference of the two cap curvatures).
  function tripleDefects(t) {
    var worstAngle = 0, worstK = 0, kScale = Math.max(t.pressures[0], t.pressures[1], t.pressures[2]);
    function ang(u, v) { return Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) / DEG; }
    function neg(u) { return [-u[0], -u[1]]; }
    var out0 = [arcTangent(t.walls[0], false), arcTangent(t.walls[1], false), arcTangent(t.walls[2], false)];
    for (var k = 0; k < 3; k++) {
      worstAngle = Math.max(worstAngle, Math.abs(ang(out0[k], out0[(k + 1) % 3]) - 120));
      // corner k: wall k arrives, cap k leaves, cap k-1 arrives
      var p = (k + 2) % 3, rays = [neg(arcTangent(t.walls[k], true)), arcTangent(t.caps[k], false), neg(arcTangent(t.caps[p], true))];
      for (var i = 0; i < 3; i++) worstAngle = Math.max(worstAngle, Math.abs(ang(rays[i], rays[(i + 1) % 3]) - 120));
      // wall k has bubble k on its left going outward and bubble k-1 on its right; it turns
      // left (bows into k-1) when bubble k is at the higher pressure
      worstK = Math.max(worstK, Math.abs(t.walls[k].k - (t.pressures[k] - t.pressures[p])) / kScale);
    }
    return { angle: worstAngle, curvature: worstK };
  }

  // ---------------------------------------------------------------- checks
  function runChecks() {
    var out = [];
    function check(name, ok, detail) { out.push({ name: name, ok: !!ok, detail: detail }); }
    function near(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9); }

    var S = solids(), by = {}; S.forEach(function (s) { by[s.name] = s; });
    var g = (1 + Math.sqrt(5)) / 2;
    var closed = {
      tetrahedron: Math.sqrt(3) / (SPHERE * Math.pow(1 / (6 * Math.sqrt(2)), 2 / 3)),
      cube: 6 / SPHERE,
      octahedron: 2 * Math.sqrt(3) / (SPHERE * Math.pow(Math.sqrt(2) / 3, 2 / 3)),
      dodecahedron: 3 * Math.sqrt(25 + 10 * Math.sqrt(5)) / (SPHERE * Math.pow((15 + 7 * Math.sqrt(5)) / 4, 2 / 3)),
      icosahedron: 5 * Math.sqrt(3) / (SPHERE * Math.pow(5 * (3 + Math.sqrt(5)) / 12, 2 / 3))
    };
    check('Platonic solids: face counts 4, 6, 8, 12, 20', S.map(function (s) { return s.faces; }).join() === '4,6,8,12,20', S.map(function (s) { return s.faces; }).join());
    check('Platonic solids: measured area ratios match the closed forms',
      S.every(function (s) { return near(s.ratio, closed[s.name], 1e-9); }),
      S.map(function (s) { return s.name + ' ' + s.ratio.toFixed(4); }).join(', '));
    check('cube 24.07% and tetrahedron 49.00% over the sphere', near(by.cube.ratio, 1.2407, 5e-5) && near(by.tetrahedron.ratio, 1.4900, 5e-5),
      by.cube.ratio.toFixed(5) + ', ' + by.tetrahedron.ratio.toFixed(5));
    var best = bisect(function (t) { return cylinderRatio(t * 1.0001) - cylinderRatio(t); }, 0.2, 5);
    check('best cylinder is as tall as it is wide, 14.47% over the sphere', near(best, 1, 1e-3) && near(cylinderRatio(1), Math.pow(1.5, 1 / 3), 1e-12),
      'minimum at t = ' + best.toFixed(4) + ', ratio ' + cylinderRatio(1).toFixed(5));
    var bandCube = cylinderBand(by.cube.ratio), bandOct = cylinderBand(by.octahedron.ratio);
    check('cylinder beats the cube from 0.44 to 2.47 diameters tall, the octahedron from 0.59 to 1.75, never the dodecahedron',
      near(cylinderRatio(bandCube[0]), by.cube.ratio, 1e-9) && near(cylinderRatio(bandCube[1]), by.cube.ratio, 1e-9) &&
      near(bandCube[0], 0.439, 1e-3) && near(bandCube[1], 2.474, 1e-3) && near(bandOct[0], 0.589, 1e-3) && near(bandOct[1], 1.753, 1e-3) &&
      cylinderBand(by.dodecahedron.ratio) === null,
      'cube band ' + bandCube[0].toFixed(3) + ' to ' + bandCube[1].toFixed(3) + '; octahedron band ' + bandOct[0].toFixed(3) + ' to ' + bandOct[1].toFixed(3));
    check('plane: square 1.128 and triangle 1.286 times the circle', near(planeRatio(4), 2 / Math.sqrt(PI), 1e-12) && near(planeRatio(3), 1.2861, 5e-5),
      planeRatio(4).toFixed(4) + ', ' + planeRatio(3).toFixed(4));

    // double bubble
    var okK = true, okSide = true, worstQuad = 0;
    for (var b = -25; b <= 85; b += 5) for (var dim = 2; dim <= 3; dim++) {
      var d = doubleBubble(dim, b);
      var small = Math.max(d.left.k, d.right.k), large = Math.min(d.left.k, d.right.k);
      if (!near(d.wall.k, small - large, 1e-12)) okK = false;
      if (b !== 30 && (d.wallSign > 0) !== (d.contentR > d.contentL)) okSide = false;
      // contents against brute-force quadrature of the outline
      var q = quadrature(d);
      worstQuad = Math.max(worstQuad, Math.abs(q.R - d.contentR) / d.contentR, Math.abs(q.L - d.contentL) / d.contentL, Math.abs(q.B - d.boundary) / d.boundary);
    }
    check('double bubble: wall curvature is the difference of the cap curvatures', okK);
    check('double bubble: the wall bows into the chamber that holds more', okSide);
    check('double bubble: closed-form contents and areas match quadrature', worstQuad < 2e-5, 'worst relative gap ' + worstQuad.toExponential(1));
    var e3 = solveDouble(3, 0.5), e2 = solveDouble(2, 0.5);
    check('equal volumes: flat wall, 27 pi R^2 / 4 of film, 5.51% under two spheres',
      near(e3.beta, 30, 1e-6) && near(e3.total / e3.separate, 6.75 / (8 * Math.pow(27 / 32, 2 / 3)), 1e-9) && near(1 - e3.total / e3.separate, 0.0551, 5e-5),
      'ratio ' + (e3.total / e3.separate).toFixed(5) + ', against one sphere ' + (e3.total / e3.single).toFixed(4));
    check('equal areas in the plane: 10.31% under two circles', near(1 - e2.total / e2.separate, 0.1031, 5e-5), (e2.total / e2.separate).toFixed(5));
    var mono = true, prev = 0;
    for (var f = 0.02; f <= 0.5001; f += 0.02) { var sv = 1 - solveDouble(3, f).total / solveDouble(3, f).separate; if (sv <= prev) mono = false; prev = sv; }
    check('the saving grows all the way to equal volumes', mono);
    var t3 = solveDouble(3, 0.75);
    check('solveDouble returns the requested share and total volume 1',
      near(t3.contentR / (t3.contentR + t3.contentL), 0.75, 1e-10) && near((t3.contentR + t3.contentL) * Math.pow(t3.scale, 3), 1, 1e-10) && t3.rRight > t3.rLeft && near(t3.kWall, t3.kLeft - t3.kRight, 1e-9),
      'radii ' + t3.rLeft.toFixed(4) + ', ' + t3.rRight.toFixed(4) + ', wall ' + t3.rWall.toFixed(4));

    (function () {
      var dd = solveDouble(3, 0.8), oo = doubleOutline(dd, 6), top = oo.wall[0], midW = oo.wall[3];
      check('double bubble outline: films start at the seam and the wall bows toward the 80% chamber',
        near(top[0], 0, 1e-12) && near(oo.right[0][1], dd.scale, 1e-12) && near(oo.left[6][1], -dd.scale, 1e-12) && midW[0] > 0 && near(midW[0], dd.wallApex * dd.scale, 1e-12),
        'wall apex ' + midW[0].toFixed(4) + ' right of the seam, total volume 1');
    })();
    // chain
    var c = chain(0.5, 0.5);
    check('split rival at equal areas: areas 1/4, 1/2, 1/4 and equal pressures in the two pieces',
      near(c.areaLeft, 0.25, 1e-9) && near(c.areaRight, 0.25, 1e-9) && near(c.areaMid, 0.5, 1e-9) && near(c.pLeft, c.pRight, 1e-7),
      'perimeter ' + (c.perimeter / c.standard).toFixed(5) + ' of the standard; two circles ' + (c.separate / c.standard).toFixed(5));
    var o = chainOutline(c, 0, 400);
    function polyArea(pts) { var s = 0; for (var i = 0; i < pts.length; i++) { var p = pts[i], q2 = pts[(i + 1) % pts.length]; s += p[0] * q2[1] - q2[0] * p[1]; } return Math.abs(s) / 2; }
    function polyLen(pts) { var s = 0; for (var i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
    function outlineMeasure(o2) {
      return {
        left: polyArea(o2.leftCap.concat(o2.leftWall.slice().reverse())),
        right: polyArea(o2.rightCap.concat(o2.rightWall.slice().reverse())),
        mid: polyArea(o2.leftWall.concat(o2.bottom.slice().reverse(), o2.rightWall.slice().reverse(), o2.top.slice().reverse())),
        len: polyLen(o2.leftCap) + polyLen(o2.leftWall) + polyLen(o2.rightCap) + polyLen(o2.rightWall) + polyLen(o2.top) + polyLen(o2.bottom)
      };
    }
    var m0 = outlineMeasure(o);
    check('split rival: the drawn outline has the stated areas and perimeter',
      near(m0.left, c.areaLeft, 2e-5) && near(m0.right, c.areaRight, 2e-5) && near(m0.mid, c.areaMid, 2e-5) && near(m0.len, c.perimeter, 2e-5),
      'left ' + m0.left.toFixed(5) + ', mid ' + m0.mid.toFixed(5) + ', length ' + m0.len.toFixed(5) + ' vs ' + c.perimeter.toFixed(5));
    var m1 = outlineMeasure(chainOutline(c, 1, 400)), mh = outlineMeasure(chainOutline(c, 0.5, 400));
    var oT = chainOutline(c, 1, 8);
    check('sliding a piece round the middle circle keeps every area and the perimeter, and ends with the corners touching',
      near(m1.mid, m0.mid, 2e-5) && near(mh.mid, m0.mid, 2e-5) && near(m1.len, m0.len, 2e-5) && near(mh.len, m0.len, 2e-5) &&
      Math.hypot(oT.corners[0][0] - oT.corners[2][0], oT.corners[0][1] - oT.corners[2][1]) < 1e-9,
      'free arc ' + (c.gap / DEG).toFixed(2) + ' degrees');
    // corners of the outline meet at 120 degrees
    (function () {
      var oo = chainOutline(c, 0.3, 2000), worst = 0;
      function dirFrom(pts, atStart) { var a = atStart ? pts[0] : pts[pts.length - 1], b2 = atStart ? pts[1] : pts[pts.length - 2]; var L = Math.hypot(b2[0] - a[0], b2[1] - a[1]); return [(b2[0] - a[0]) / L, (b2[1] - a[1]) / L]; }
      function ang(u, v) { return Math.acos(u[0] * v[0] + u[1] * v[1]) / DEG; }
      var sets = [[dirFrom(oo.leftCap, true), dirFrom(oo.leftWall, true), dirFrom(oo.top, true)],
                  [dirFrom(oo.rightCap, true), dirFrom(oo.rightWall, true), dirFrom(oo.top, false)],
                  [dirFrom(oo.leftCap, false), dirFrom(oo.leftWall, false), dirFrom(oo.bottom, false)],
                  [dirFrom(oo.rightCap, false), dirFrom(oo.rightWall, false), dirFrom(oo.bottom, true)]];
      sets.forEach(function (r) { for (var i = 0; i < 3; i++) worst = Math.max(worst, Math.abs(ang(r[i], r[(i + 1) % 3]) - 120)); });
      check('split rival: all four corners meet at 120 degrees', worst < 0.2, 'worst ' + worst.toFixed(3) + ' degrees off (chords of a 2000-point outline)');
    })();
    var peak = true, ends = true, slope = true, lastP = 0;
    for (var sp = 0.02; sp <= 0.5001; sp += 0.02) {
      var cc = chain(0.5, sp), cm = chain(0.5, 1 - sp);
      if (cc.perimeter <= lastP || !cc.ok) peak = false; lastP = cc.perimeter;
      if (!near(cc.perimeter, cm.perimeter, 1e-8)) peak = false;
      // slope of the perimeter in the area moved = pressure difference between the pieces
      var hh = 1e-5, dP = (chain(0.5, sp + hh).perimeter - chain(0.5, sp - hh).perimeter) / (2 * hh * 0.5);
      if (!near(dP, cc.pLeft - cc.pRight, 1e-4)) slope = false;
    }
    var tiny = chain(0.5, 1e-6);
    ends = near(tiny.perimeter, tiny.standard, 5e-3) && tiny.perimeter > tiny.standard;
    check('split rival: perimeter climbs from the standard value to a peak at the even split', peak && ends, 'at a one-in-a-million split ' + (tiny.perimeter / tiny.standard).toFixed(5) + ' of the standard');
    check('split rival: slope of perimeter in area moved equals the pressure difference of the pieces', slope);
    var always = true, lo = 9, hi = 0;
    for (var sh = 0.1; sh <= 0.9001; sh += 0.05) {
      var ce = chain(sh, 0.5), rr = ce.perimeter / ce.standard;
      if (!ce.ok || rr <= 1 || ce.separate <= ce.standard) always = false;
      lo = Math.min(lo, rr); hi = Math.max(hi, rr);
    }
    check('split rival exists and loses to the standard for split-region shares from 10% to 90%', always, 'excess from ' + ((lo - 1) * 100).toFixed(2) + '% to ' + ((hi - 1) * 100).toFixed(2) + '%');

    // triple bubble
    var sym = tripleFromPole([0, 0]), dsym = tripleDefects(sym);
    check('symmetric triple bubble: equal areas, 120 degree corners, flat walls',
      near(sym.shares[0], 1 / 3, 1e-12) && near(sym.shares[1], 1 / 3, 1e-12) && dsym.angle < 1e-9 && dsym.curvature < 1e-9,
      'perimeter over three circles ' + (triple(1, 1, 1).perimeter1 / triple(1, 1, 1).separate).toFixed(5));
    var worstA = 0, worstC = 0, worstR = 0, allValid = true, count = 0;
    for (var ia = 1; ia <= 8; ia++) for (var ib = 1; ib <= 8; ib++) {
      var t = triple(ia, ib, 3), df = tripleDefects(t);
      worstA = Math.max(worstA, df.angle); worstC = Math.max(worstC, df.curvature); worstR = Math.max(worstR, t.residual);
      if (!t.valid || t.perimeter1 >= t.separate) allValid = false; count++;
    }
    check('triple bubble solver: every area ratio from 1:1:3 to 8:8:3 is reached', worstR < 1e-10 && allValid, count + ' cases, worst share error ' + worstR.toExponential(1));
    check('triple bubble: corners at 120 degrees and walls curved by the pressure difference, at every ratio', worstA < 1e-6 && worstC < 1e-8,
      'worst angle error ' + worstA.toExponential(1) + ' degrees, worst curvature error ' + worstC.toExponential(1));
    (function () {
      // brute-force check of one lopsided case against sampled outlines
      var t = triple(6, 1, 2), n = 4000, areas = [];
      for (var k = 0; k < 3; k++) {
        var nx = (k + 1) % 3;
        var pts = arcPoints(t.walls[k], n).concat(arcPoints(t.caps[k], n), arcPoints(t.walls[nx], n).reverse());
        areas.push(polyArea(pts));
      }
      var tot = areas[0] + areas[1] + areas[2];
      check('triple bubble 6:1:2: sampled outline areas match', near(areas[0] / tot, 6 / 9, 1e-6) && near(areas[1] / tot, 1 / 9, 1e-6),
        areas.map(function (a) { return (a / tot).toFixed(6); }).join(', '));
      // the limit of one vanishing bubble is the double bubble
      var t2 = triple(1, 1, 0.0005), d2 = solveDouble(2, 0.5);
      check('triple bubble with one bubble shrunk to nothing approaches the double bubble', near(t2.perimeter1, d2.total, 0.06) && t2.perimeter1 > d2.total,
        t2.perimeter1.toFixed(4) + ' against ' + d2.total.toFixed(4));
    })();
    return out;
  }
  // Slow, independent measure of a double bubble: integrate the outline numerically.
  function quadrature(d) {
    var n = 20000, dim = d.dim;
    function arcSide(f, side) {       // points of a film from (0,1) to the axis, on one side
      var pts = [], i;
      if (f.flat) { for (i = 0; i <= n; i++) pts.push([0, 1 - i / n]); return pts; }
      var a0 = Math.atan2(1, -f.cx), a1 = side > 0 ? 0 : PI, dlt = a1 - a0;
      if (side > 0) { while (dlt > 0) dlt -= 2 * PI; } else { while (dlt < 0) dlt += 2 * PI; }
      for (i = 0; i <= n; i++) { var a = a0 + dlt * i / n; pts.push([f.cx + f.r * Math.cos(a), f.r * Math.sin(a)]); }
      return pts;
    }
    function contentUnder(pts) {      // signed integral along x of y (dim 2, doubled) or pi y^2 (dim 3)
      var s = 0;
      for (var i = 1; i < pts.length; i++) {
        var dx = pts[i][0] - pts[i - 1][0], ya = pts[i - 1][1], yb = pts[i][1];
        s += dim === 3 ? PI * dx * (ya * ya + ya * yb + yb * yb) / 3 : dx * (ya + yb);
      }
      return s;
    }
    function boundaryOf(pts) {
      var s = 0;
      for (var i = 1; i < pts.length; i++) {
        var ds = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        s += dim === 3 ? 2 * PI * 0.5 * (pts[i][1] + pts[i - 1][1]) * ds : 2 * ds;
      }
      return s;
    }
    var pr = arcSide(d.right, 1), pl = arcSide(d.left, -1), pw = arcSide(d.wall, d.wallSign > 0 ? 1 : -1);
    var w = contentUnder(pw);         // positive when the wall bows right
    return { R: contentUnder(pr) - w, L: -contentUnder(pl) + w, B: boundaryOf(pr) + boundaryOf(pl) + boundaryOf(pw) };
  }

  var api = {
    SPHERE: SPHERE, solids: solids, cylinderRatio: cylinderRatio, cylinderBand: cylinderBand, planeRatio: planeRatio,
    doubleBubble: doubleBubble, solveDouble: solveDouble, doubleOutline: doubleOutline, ball: ball,
    chain: chain, chainOutline: chainOutline,
    triple: triple, tripleFromPole: tripleFromPole, tripleDefects: tripleDefects, arcPoints: arcPoints,
    runChecks: runChecks
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.FoamBubbles = api;
})(typeof window !== 'undefined' ? window : globalThis);
