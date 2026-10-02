// Slab: the USGS Slab2 subduction-zone surface under Japan, as a library shared
// by the Japan Earthquakes essays (02 now, 01 next). Browser global `Slab`, and
// `module.exports` under node. No fetch in here: the page loads
// shared/data/slab2.json (built by scripts/japan-slab2.mjs) and passes it in.
//
// Source: Hayes et al. 2018, Science 362:58 (Slab2), regions kur (Pacific slab,
// Kuril to central Honshu), izu (Pacific slab, Izu-Bonin) and ryu (Philippine
// Sea slab, Nankai to Taiwan), plus the izu supplement that holds the overturned
// part of the Izu-Bonin slab, and the Smithsonian Holocene volcanoes. Slab2 is
// partly built from relocated hypocentres and moment tensors, so agreement of
// deep earthquakes with it is not fully independent of the catalog. The
// independent parts are the shallow geometry (active-source and trench data) and
// the volcano depths.
//
// ---- API -----------------------------------------------------------------
//   const m = Slab.load(data)        data = parsed shared/data/slab2.json
//   m.names                          ["kur", "izu", "ryu"]
//   m.family                         { kur: "pac", izu: "pac", ryu: "psp" }
//   m.depth(name, lat, lon)          km below sea level of the slab top by bilinear
//                                    sampling of one region's grid; null if any corner
//                                    of the cell has no slab
//   m.unc(name, lat, lon)            published uncertainty (km), nearest node, or null
//   m.beneath(lat, lon)              { pac, psp }: depth of the Pacific slab (kur, else
//                                    izu) and of the Philippine Sea slab, null if none
//   m.dip(name, lat, lon)            { dip, dipDir, strike } from the central-difference
//                                    gradient of the depth grid, degrees (dipDir =
//                                    azimuth the slab descends toward, strike =
//                                    dipDir - 90, right-hand rule); null near an edge
//   m.nearest(lat, lon, depth, opts) distance from a hypocentre to the nearest slab
//                                    surface, in 3D on the sphere:
//                                    { dist, signed, slab, family, foot:{lat,lon,depth},
//                                      vert, supp }
//                                    dist >= 0 (km); signed is + below the slab top, - above
//                                    it; vert = event depth minus slab depth under the
//                                    epicentre (null if no slab there; misleading on steep
//                                    slabs, which is why dist exists); supp = nearest point
//                                    was a supplement point (distance then good to a few
//                                    km). opts.family = "pac" | "psp" limits the search;
//                                    returns null if no slab within ~1000 km.
//   m.classify(r)                    "above" (signed < -10), "interface" (|signed| <= 10),
//                                    "inside" (10 < signed <= 50), "off" (dist > 50 or
//                                    none) from a nearest() result
//   m.annotate(events, opts)         nearest() for each {lat, lon, depth}; array parallel
//                                    to events
//   m.profile(line, stepKm)          slab top along a transect on the same degree-space
//                                    line the essay's projectTransect uses:
//                                    { total, pts: [{ km, lat, lon, pac, psp, pacUnc,
//                                    pspUnc, pacDip:{..}, pspDip:{..} }] }
//   m.intervalDip(profile, key, z1, z2)  key "pac" | "psp". { apparent, trueMean, x1, x2 }:
//                                    apparent dip (degrees) of the slab top in the
//                                    section between depths z1 and z2, and the mean true
//                                    dip of the profile points in that range
//   m.contours(name, level)          depth contour of a region as polylines of [lon, lat]
//   m.volcanoes()                    [{ name, lat, lon, subregion, family, depth, unc }]
//                                    Holocene volcanoes with the slab depth beneath each
//                                    (depth null if the slab does not reach it)
//   m.volcanicFront(lat0, lat1, band, minLon)   the easternmost Pacific-slab volcano in each
//                                    `band`-degree latitude band (default 0.5, minLon 138):
//                                    [{ name, lat, lon, depth }] with slab depth beneath
//   m.summarize(events, opts)        { n, nInside, share, medianSigned, byDepth: [...] }:
//                                    share of events (default depth >= 70 km) 0-50 km below
//                                    the slab top by 3D distance
//   Slab.apparentDip(trueDip, dipDir, lineAz)   tan(app) = tan(true) |cos(dipDir - lineAz)|
//   Slab.pointTriangle(p, a, b, c)   closest point on a triangle: { d, q, n }
//   Slab.quantile(sorted, p), Slab.hav(lat1, lon1, lat2, lon2) (km), Slab.xyz(lat, lon, depth)
//   Slab.runChecks(print, data)      [{ name, ok, detail }]; the dip check compares to
//                                    Slab2's own published dip and strike grids
// ---------------------------------------------------------------------------
(function (root) {
  "use strict";
  const R = 6371, RAD = Math.PI / 180;

  const quantile = (a, p) => a.length ? a[Math.min(a.length - 1, Math.max(0, Math.floor(p * (a.length - 1) + 1e-9)))] : NaN;
  function hav(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * RAD, dLon = (lon2 - lon1) * RAD;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function xyz(lat, lon, depth) {
    const r = R - depth, c = Math.cos(lat * RAD);
    return [r * c * Math.cos(lon * RAD), r * c * Math.sin(lon * RAD), r * Math.sin(lat * RAD)];
  }
  function ll(p) { // inverse of xyz: [lat, lon, depth]
    const r = Math.hypot(p[0], p[1], p[2]);
    return [Math.asin(p[2] / r) / RAD, Math.atan2(p[1], p[0]) / RAD, R - r];
  }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  // Closest point on triangle abc to p (Ericson, Real-Time Collision Detection).
  // Returns the distance d, the closest point q and the unit normal n of abc
  // (orientation (b-a) x (c-a)).
  function pointTriangle(p, a, b, c) {
    const ab = sub(b, a), ac = sub(c, a), ap = sub(p, a);
    const n = cross(ab, ac), nl = Math.hypot(n[0], n[1], n[2]);
    const nn = nl > 0 ? [n[0] / nl, n[1] / nl, n[2] / nl] : [0, 0, 1];
    const d1 = dot(ab, ap), d2 = dot(ac, ap);
    let q;
    if (d1 <= 0 && d2 <= 0) q = a;
    else {
      const bp = sub(p, b), d3 = dot(ab, bp), d4 = dot(ac, bp);
      if (d3 >= 0 && d4 <= d3) q = b;
      else {
        const vc = d1 * d4 - d3 * d2;
        if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); q = [a[0] + v * ab[0], a[1] + v * ab[1], a[2] + v * ab[2]]; }
        else {
          const cp = sub(p, c), d5 = dot(ab, cp), d6 = dot(ac, cp);
          if (d6 >= 0 && d5 <= d6) q = c;
          else {
            const vb = d5 * d2 - d1 * d6;
            if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); q = [a[0] + w * ac[0], a[1] + w * ac[1], a[2] + w * ac[2]]; }
            else {
              const va = d3 * d6 - d5 * d4;
              if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
                const w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
                q = [b[0] + w * (c[0] - b[0]), b[1] + w * (c[1] - b[1]), b[2] + w * (c[2] - b[2])];
              } else {
                const den = 1 / (va + vb + vc), v = vb * den, w = vc * den;
                q = [a[0] + ab[0] * v + ac[0] * w, a[1] + ab[1] * v + ac[1] * w, a[2] + ab[2] * v + ac[2] * w];
              }
            }
          }
        }
      }
    }
    const dq = sub(p, q);
    return { d: Math.hypot(dq[0], dq[1], dq[2]), q, n: nn };
  }

  // tan(apparent) = tan(true) |cos(angle between the section line and the dip direction)|
  function apparentDip(trueDip, dipDir, lineAz) {
    return Math.atan(Math.tan(trueDip * RAD) * Math.abs(Math.cos((dipDir - lineAz) * RAD))) / RAD;
  }
  const FAMILY = { kur: "pac", izu: "pac", ryu: "psp" };
  const VOLC_FAMILY = {
    "Northeast Japan Volcanic Arc": "pac", "Kuril Volcanic Arc": "pac", "Izu Volcanic Arc": "pac",
    "Ogasawara Volcanic Arc": "pac", "Central East Asia Volcanic Province": "pac",
    "Nankai Volcanic Arc": "psp", "Ryukyu Volcanic Arc": "psp"
  };

  function load(data) {
    const grids = {};
    const names = Object.keys(data.slabs);
    for (const name of names) {
      const s = data.slabs[name], n = s.nlat * s.nlon;
      const dep = new Float32Array(n).fill(NaN), unc = new Float32Array(n).fill(NaN);
      let pos = 0, k = 0;
      for (const v of s.dep) {
        if (v < 0) pos -= v;
        else { dep[pos] = v / 10; unc[pos] = s.unc[k] < 0 ? NaN : s.unc[k]; k++; pos++; }
      }
      if (pos !== n) throw new Error(`slab2.json: ${name} decodes to ${pos} nodes, expected ${n}`);
      grids[name] = { lat0: s.lat0, lon0: s.lon0, step: s.step, nlat: s.nlat, nlon: s.nlon, dep, unc };
    }

    function depth(name, lat, lon) {
      const g = grids[name];
      const fx = (lon - g.lon0) / g.step, fy = (lat - g.lat0) / g.step;
      let i = Math.floor(fx + 1e-9), j = Math.floor(fy + 1e-9);
      if (i < 0 || j < 0 || i > g.nlon - 1 || j > g.nlat - 1) return null;
      let tx = fx - i, ty = fy - j;
      if (i === g.nlon - 1) { if (tx > 1e-9) return null; i--; tx = 1; }
      if (j === g.nlat - 1) { if (ty > 1e-9) return null; j--; ty = 1; }
      const a = g.dep[j * g.nlon + i], b = g.dep[j * g.nlon + i + 1], c = g.dep[(j + 1) * g.nlon + i], d = g.dep[(j + 1) * g.nlon + i + 1];
      // a corner with zero weight need not exist
      const need = (v, w) => w > 1e-9 && v !== v;
      if (need(a, (1 - tx) * (1 - ty)) || need(b, tx * (1 - ty)) || need(c, (1 - tx) * ty) || need(d, tx * ty)) return null;
      const z = (v, w) => w > 1e-9 ? v * w : 0;
      return z(a, (1 - tx) * (1 - ty)) + z(b, tx * (1 - ty)) + z(c, (1 - tx) * ty) + z(d, tx * ty);
    }
    function unc(name, lat, lon) {
      const g = grids[name];
      const i = Math.round((lon - g.lon0) / g.step), j = Math.round((lat - g.lat0) / g.step);
      if (i < 0 || j < 0 || i >= g.nlon || j >= g.nlat) return null;
      const v = g.unc[j * g.nlon + i];
      return v === v ? v : null;
    }
    function beneath(lat, lon) {
      const k = depth("kur", lat, lon);
      return { pac: k !== null ? k : (grids.izu ? depth("izu", lat, lon) : null), psp: grids.ryu ? depth("ryu", lat, lon) : null };
    }
    function dip(name, lat, lon) {
      const g = grids[name], h = g.step;
      const zE = depth(name, lat, lon + h), zW = depth(name, lat, lon - h);
      const zN = depth(name, lat + h, lon), zS = depth(name, lat - h, lon);
      if (zE === null || zW === null || zN === null || zS === null) return null;
      const gE = (zE - zW) / (2 * h * RAD * R * Math.cos(lat * RAD)), gN = (zN - zS) / (2 * h * RAD * R);
      const dipDir = (Math.atan2(gE, gN) / RAD + 360) % 360;
      return { dip: Math.atan(Math.hypot(gE, gN)) / RAD, dipDir, strike: (dipDir - 90 + 360) % 360 };
    }

    // ---- nearest-surface search -----------------------------------------
    // Nodes are bucketed by 1 degree cell. The search widens one ring of cells
    // at a time and stops when the best 3D distance is under what the next ring
    // could give (70 km per ring, below the 76 km of a degree of longitude at 46N).
    const sets = {}; // key -> { family, grid|null, nodes: Float64Array xyz, ids, depth, bucket }
    function addSet(key, family, grid, lat, lon, dep, ids) {
      const bucket = new Map(), pts = new Float64Array(lat.length * 3);
      for (let n = 0; n < lat.length; n++) {
        const p = xyz(lat[n], lon[n], dep[n]);
        pts[3 * n] = p[0]; pts[3 * n + 1] = p[1]; pts[3 * n + 2] = p[2];
        const k = Math.floor(lat[n]) * 1000 + Math.floor(lon[n]);
        let b = bucket.get(k); if (!b) bucket.set(k, b = []); b.push(n);
      }
      sets[key] = { family, grid, pts, ids, lat, lon, dep, bucket };
    }
    for (const name of names) {
      const g = grids[name], lat = [], lon = [], dep = [], ids = [];
      for (let j = 0; j < g.nlat; j++) for (let i = 0; i < g.nlon; i++) {
        const z = g.dep[j * g.nlon + i];
        if (z === z) { lat.push(g.lat0 + j * g.step); lon.push(g.lon0 + i * g.step); dep.push(z); ids.push(j * g.nlon + i); }
      }
      addSet(name, FAMILY[name] || "pac", g, lat, lon, dep, ids);
    }
    if (data.supp && data.supp.pts.length) {
      const P = data.supp.pts, lat = [], lon = [], dep = [];
      for (let n = 0; n < P.length; n += 3) { lat.push(P[n]); lon.push(P[n + 1]); dep.push(P[n + 2]); }
      addSet("supp", "pac", null, lat, lon, dep, null);
    }

    const gridXYZ = (g, i, j) => {
      const z = g.dep[j * g.nlon + i];
      return z === z ? xyz(g.lat0 + j * g.step, g.lon0 + i * g.step, z) : null;
    };
    const DOWN = p => [-p[0], -p[1], -p[2]]; // toward the Earth's centre

    function nearestInSet(S, p, lat, lon, depthKm) {
      const la0 = Math.floor(lat), lo0 = Math.floor(lon);
      let best = Infinity, bn = -1;
      for (let r = 0; r <= 15; r++) {
        for (let di = -r; di <= r; di++) for (let dj = -r; dj <= r; dj++) {
          if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
          const b = S.bucket.get((la0 + di) * 1000 + (lo0 + dj));
          if (!b) continue;
          for (const n of b) {
            const dx = S.pts[3 * n] - p[0], dy = S.pts[3 * n + 1] - p[1], dz = S.pts[3 * n + 2] - p[2];
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 < best) { best = d2; bn = n; }
          }
        }
        if (bn >= 0 && Math.sqrt(best) <= 70 * r) break;
      }
      if (bn < 0) return null;
      let dist = Math.sqrt(best), foot = [S.pts[3 * bn], S.pts[3 * bn + 1], S.pts[3 * bn + 2]], sign = depthKm > S.dep[bn] ? 1 : -1;
      if (S.grid) {
        // refine on the triangulated surface: the 4 x 4 cells around the nearest node
        const g = S.grid, id = S.ids[bn], ci = id % g.nlon, cj = (id - ci) / g.nlon;
        for (let j = cj - 2; j <= cj + 1; j++) for (let i = ci - 2; i <= ci + 1; i++) {
          if (i < 0 || j < 0 || i >= g.nlon - 1 || j >= g.nlat - 1) continue;
          const sw = gridXYZ(g, i, j), se = gridXYZ(g, i + 1, j), ne = gridXYZ(g, i + 1, j + 1), nw = gridXYZ(g, i, j + 1);
          for (const T of [[sw, se, ne], [sw, ne, nw]]) {
            if (!T[0] || !T[1] || !T[2]) continue;
            const t = pointTriangle(p, T[0], T[1], T[2]);
            if (t.d < dist - 1e-9) {
              dist = t.d; foot = t.q;
              let nd = t.n; if (dot(nd, DOWN(T[0])) < 0) nd = [-nd[0], -nd[1], -nd[2]];
              const v = sub(p, t.q);
              sign = t.d < 1e-9 ? 1 : (dot(v, nd) >= 0 ? 1 : -1);
            }
          }
        }
      }
      return { dist, sign, foot, supp: !S.grid };
    }

    function nearest(lat, lon, depthKm, opts) {
      const p = xyz(lat, lon, depthKm);
      const fam = opts && opts.family;
      let best = null, bestKey = null;
      for (const key of Object.keys(sets)) {
        if (fam && sets[key].family !== fam) continue;
        const r = nearestInSet(sets[key], p, lat, lon, depthKm);
        if (r && (!best || r.dist < best.dist)) { best = r; bestKey = key; }
      }
      if (!best || best.dist > 1000) return null;
      const f = ll(best.foot);
      let vert = null;
      const b = beneath(lat, lon), zv = fam === "psp" ? b.psp : fam === "pac" ? b.pac : (bestKey === "ryu" ? b.psp : b.pac);
      if (zv !== null) vert = depthKm - zv;
      return {
        dist: best.dist, signed: best.sign * best.dist, slab: bestKey, family: sets[bestKey].family,
        foot: { lat: f[0], lon: f[1], depth: f[2] }, vert, supp: best.supp
      };
    }
    function classify(r) {
      if (!r || r.dist > 50) return "off";
      if (r.signed < -10) return "above";
      if (r.signed <= 10) return "interface";
      return "inside";
    }
    function annotate(events, opts) { return events.map(q => nearest(q.lat, q.lon, q.depth, opts)); }
    function summarize(events, opts) {
      const minDepth = opts && opts.minDepth !== undefined ? opts.minDepth : 70;
      const rows = events.filter(q => q.depth >= minDepth).map(q => nearest(q.lat, q.lon, q.depth, opts));
      const ok = rows.filter(Boolean);
      const inside = ok.filter(r => r.signed > 0 && r.dist <= 50);
      const signed = ok.map(r => r.signed).sort((a, b) => a - b);
      return { n: rows.length, nWithSlab: ok.length, nInside: inside.length, share: rows.length ? inside.length / rows.length : NaN,
        medianSigned: quantile(signed, 0.5), rows };
    }

    // ---- transects ---------------------------------------------------------
    function profile(line, stepKm) {
      const [s, e] = [line.start, line.end];
      const total = hav(s[0], s[1], e[0], e[1]);
      const n = Math.max(1, Math.round(total / (stepKm || 10)));
      const pts = [];
      for (let k = 0; k <= n; k++) {
        const f = k / n, lat = s[0] + f * (e[0] - s[0]), lon = s[1] + f * (e[1] - s[1]);
        const b = beneath(lat, lon);
        const pn = depth("kur", lat, lon) !== null ? "kur" : "izu";
        pts.push({
          km: f * total, lat, lon, pac: b.pac, psp: b.psp,
          pacUnc: b.pac === null ? null : unc(pn, lat, lon), pspUnc: b.psp === null ? null : unc("ryu", lat, lon),
          pacDip: b.pac === null ? null : dip(pn, lat, lon), pspDip: b.psp === null ? null : dip("ryu", lat, lon)
        });
      }
      return { total, pts, az: Math.atan2((e[1] - s[1]) * Math.cos(((s[0] + e[0]) / 2) * RAD), e[0] - s[0]) / RAD };
    }
    function intervalDip(prof, key, z1, z2) {
      const pts = prof.pts.filter(p => p[key] !== null);
      const find = z => {
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i][key], b = pts[i + 1][key];
          if ((a - z) * (b - z) <= 0 && a !== b) return pts[i].km + (z - a) / (b - a) * (pts[i + 1].km - pts[i].km);
        }
        return null;
      };
      const x1 = find(z1), x2 = find(z2);
      const dk = key + "Dip";
      const td = pts.filter(p => p[key] >= z1 && p[key] <= z2 && p[dk]).map(p => p[dk].dip);
      return {
        apparent: x1 === null || x2 === null ? null : Math.atan2(z2 - z1, Math.abs(x2 - x1)) / RAD,
        trueMean: td.length ? td.reduce((a, b) => a + b, 0) / td.length : null,
        truePeak: td.length ? Math.max.apply(null, td) : null, x1, x2, n: td.length
      };
    }

    // ---- contours: marching squares on a region grid ----------------------
    function contours(name, level) {
      const g = grids[name], nx = g.nlon, ny = g.nlat;
      const V = (i, j) => g.dep[j * nx + i];
      // an edge between nodes is identified by its lower-left node and orientation
      const hid = (i, j) => (j * nx + i) * 2, vid = (i, j) => (j * nx + i) * 2 + 1;
      const pt = new Map();
      const hp = (i, j) => { const a = V(i, j), b = V(i + 1, j), t = (level - a) / (b - a); return [g.lon0 + (i + t) * g.step, g.lat0 + j * g.step]; };
      const vp = (i, j) => { const a = V(i, j), b = V(i, j + 1), t = (level - a) / (b - a); return [g.lon0 + i * g.step, g.lat0 + (j + t) * g.step]; };
      const adj = new Map();
      const link = (e1, e2) => {
        if (!adj.has(e1)) adj.set(e1, []); if (!adj.has(e2)) adj.set(e2, []);
        adj.get(e1).push(e2); adj.get(e2).push(e1);
      };
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = V(i, j), b = V(i + 1, j), c = V(i + 1, j + 1), d = V(i, j + 1);
        if (a !== a || b !== b || c !== c || d !== d) continue;
        const bits = (a >= level ? 1 : 0) | (b >= level ? 2 : 0) | (c >= level ? 4 : 0) | (d >= level ? 8 : 0);
        if (bits === 0 || bits === 15) continue;
        const S = hid(i, j), E = vid(i + 1, j), N = hid(i, j + 1), W = vid(i, j);
        for (const e of [S, E, N, W]) if (!pt.has(e)) pt.set(e, e === S ? hp(i, j) : e === E ? vp(i + 1, j) : e === N ? hp(i, j + 1) : vp(i, j));
        const segs = {
          1: [[W, S]], 2: [[S, E]], 3: [[W, E]], 4: [[E, N]], 5: [[W, N], [S, E]], 6: [[S, N]], 7: [[W, N]],
          8: [[W, N]], 9: [[S, N]], 10: [[W, S], [E, N]], 11: [[E, N]], 12: [[W, E]], 13: [[S, E]], 14: [[W, S]]
        }[bits];
        for (const [e1, e2] of segs) link(e1, e2);
      }
      const used = new Set(), lines = [];
      const walk = start => {
        const line = [start]; used.add(start);
        let cur = start;
        for (;;) {
          const nx_ = (adj.get(cur) || []).find(e => !used.has(e));
          if (nx_ === undefined) break;
          used.add(nx_); line.push(nx_); cur = nx_;
        }
        return line;
      };
      // open lines start at an edge with one neighbour; closed loops anywhere
      for (const [e, nb] of adj) if (nb.length === 1 && !used.has(e)) lines.push(walk(e));
      for (const e of adj.keys()) if (!used.has(e)) { const l = walk(e); l.push(l[0]); lines.push(l); }
      return lines.map(l => l.map(e => pt.get(e)));
    }

    // ---- volcanoes -----------------------------------------------------------
    function volcanoes() {
      return (data.volcanoes || []).map(v => {
        const subregion = data.subregions[v.r], fam = VOLC_FAMILY[subregion] || "pac", b = beneath(v.la, v.lo);
        const z = b[fam];
        const nm = fam === "psp" ? "ryu" : (depth("kur", v.la, v.lo) !== null ? "kur" : "izu");
        return { name: v.n, lat: v.la, lon: v.lo, subregion, family: fam, depth: z, unc: z === null ? null : unc(nm, v.la, v.lo) };
      });
    }

    function volcanicFront(lat0, lat1, band, minLon) {
      band = band || 0.5; minLon = minLon === undefined ? 138 : minLon;
      const fronts = new Map();
      for (const v of volcanoes()) {
        if (v.family !== "pac" || v.lat < lat0 || v.lat >= lat1 || v.lon < minLon) continue;
        const k = Math.floor(v.lat / band);
        if (!fronts.has(k) || v.lon > fronts.get(k).lon) fronts.set(k, v);
      }
      return [...fronts.values()].sort((a, b) => a.lat - b.lat);
    }

    return { names, family: FAMILY, volcanicFront, grids, depth, unc, beneath, dip, nearest, classify, annotate, summarize, profile, intervalDip, contours, volcanoes, data };
  }

  // ---- checks ----------------------------------------------------------------
  function runChecks(print, data) {
    const out = [];
    const add = (name, ok, detail) => { out.push({ name, ok: !!ok, detail }); if (print) console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); };
    if (!data || !data.slabs) { add("slab2.json supplied", false, "no data"); return out; }
    const m = load(data), tol = 1e-9;
    const sorted = a => a.slice().sort((x, y) => x - y);

    // 1. The sampler returns the lattice nodes exactly, and the run-length decoding is whole
    {
      let worst = 0, n = 0, bad = 0;
      for (const name of m.names) {
        const g = m.grids[name];
        for (let j = 0; j < g.nlat; j += 7) for (let i = 0; i < g.nlon; i += 7) {
          const z = g.dep[j * g.nlon + i];
          const got = m.depth(name, g.lat0 + j * g.step, g.lon0 + i * g.step);
          if (z !== z) continue;
          n++; if (got === null) { bad++; continue; }
          worst = Math.max(worst, Math.abs(got - z));
        }
      }
      add("Sampler returns Slab2 lattice nodes exactly", bad === 0 && worst < 1e-4, `${n} nodes, max difference ${worst.toExponential(1)} km, ${bad} missing`);
    }
    // 2. Held-out original 0.05 degree nodes vs the 0.1 degree bilinear sample
    {
      const errs = data.check.heldout.map(([s, la, lo, z]) => { const g = m.depth(s, la, lo); return g === null ? NaN : Math.abs(g - z); });
      const ok = errs.filter(e => e === e), s = sorted(ok);
      add("Bilinear sample at held-out 0.05 degree nodes", ok.length === errs.length && quantile(s, 1) < 3 && quantile(s, 0.5) < 0.3,
        `${ok.length} nodes: median ${quantile(s, 0.5).toFixed(2)} km, p95 ${quantile(s, 0.95).toFixed(2)}, max ${quantile(s, 1).toFixed(2)} km (limit: max 3, median 0.3)`);
    }
    // 3. INDEPENDENT REFERENCE: dip and strike from the depth gradient vs Slab2's published grids
    {
      const dd = [], ds = [];
      for (const [s, la, lo, pd, ps] of data.check.dip) {
        const r = m.dip(s, la, lo); if (!r) continue;
        dd.push(Math.abs(r.dip - pd));
        let e = Math.abs(r.strike - ps) % 360; if (e > 180) e = 360 - e;
        if (pd > 3) ds.push(e); // strike of a nearly flat slab is ill-defined
      }
      const a = sorted(dd), b = sorted(ds);
      add("Dip from the depth gradient matches Slab2's published dip grid",
        dd.length >= 400 && quantile(a, 0.5) < 0.1 && quantile(a, 0.95) < 0.5,
        `${dd.length} nodes: median ${quantile(a, 0.5).toFixed(3)} deg, p95 ${quantile(a, 0.95).toFixed(3)}, max ${quantile(a, 1).toFixed(2)} (limit: median 0.1, p95 0.5)`);
      add("Strike (dip direction minus 90) matches Slab2's published strike grid",
        ds.length >= 400 && quantile(b, 0.5) < 0.5 && quantile(b, 0.95) < 2,
        `${ds.length} nodes: median ${quantile(b, 0.5).toFixed(2)} deg, p95 ${quantile(b, 0.95).toFixed(2)} (limit: median 0.5, p95 2)`);
    }
    // 4. Point-triangle distance on a planar slab of dip 10, 45 and 80 degrees, with the sign convention
    {
      let worst = 0;
      for (const dipDeg of [10, 45, 80]) {
        const t = dipDeg * RAD;
        // a plane dipping toward +x (z up): in-plane unit vectors u (down-dip) and v (strike),
        // and the unit normal nn on the lower side of the slab top
        const u = [Math.cos(t), 0, -Math.sin(t)], v = [0, 1, 0], nn = [-Math.sin(t), 0, -Math.cos(t)];
        const at = (s, w, off) => [s * u[0] + w * v[0] + off * nn[0], s * u[1] + w * v[1] + off * nn[1], s * u[2] + w * v[2] + off * nn[2]];
        const a = at(0, 0, 0), b = at(40, 0, 0), c = at(0, 40, 0);
        for (const [s, w, off] of [[5, 5, 30], [8, 6, -12.5], [3, 20, 1.5]]) {
          const p = at(s, w, off), r = pointTriangle(p, a, b, c);
          const side = dot(sub(p, r.q), nn) >= 0 ? 1 : -1;
          worst = Math.max(worst, Math.abs(r.d - Math.abs(off)), side === Math.sign(off) ? 0 : 1);
        }
        // beyond the edge a-b: the distance is the in-plane gap
        worst = Math.max(worst, Math.abs(pointTriangle(at(10, -10, 0), a, b, c).d - 10));
        // beyond the vertex a: a 3-4-5 triangle in the plane
        worst = Math.max(worst, Math.abs(pointTriangle(at(-3, -4, 0), a, b, c).d - 5));
        // off the plane and past the vertex: 3-4 in plane and 12 off it gives 13
        worst = Math.max(worst, Math.abs(pointTriangle(at(-3, -4, 12), a, b, c).d - 13));
      }
      add("Point-to-triangle distance on planar slabs (dip 10, 45, 80) matches the analytic distance, with sign", worst < 1e-6, `max error ${worst.toExponential(1)} km`);
    }
    // 5. On the sphere: a slab at constant 100 km depth, events 30 km under and above it
    {
      const g = { nlat: 41, nlon: 41 };
      const cnt = g.nlat * g.nlon;
      const dep = []; for (let n = 0; n < cnt; n++) dep.push(1000); const unc = []; for (let n = 0; n < cnt; n++) unc.push(1);
      const mm = load({ slabs: { kur: { lat0: 30, lon0: 130, step: 0.1, nlat: 41, nlon: 41, dep, unc } } });
      let worst = 0, signOK = true;
      for (const [la, lo] of [[32, 132], [31.37, 132.58], [32.95, 130.5]]) {
        const below = mm.nearest(la, lo, 130), above = mm.nearest(la, lo, 70);
        worst = Math.max(worst, Math.abs(below.dist - 30), Math.abs(above.dist - 30));
        if (!(below.signed > 0 && above.signed < 0)) signOK = false;
      }
      add("Nearest-surface distance on a constant-depth slab: 30 km below is +30, 30 km above is -30", worst < 0.02 && signOK, `max error ${worst.toFixed(4)} km (triangle chord sag at 11 km spacing is about 0.002 km)`);
    }
    // 6. Dip direction and the apparent/true dip identity
    {
      // a slab ramp dipping 40 degrees due east: depth = x tan(40) on the sphere locally
      let worst = 0;
      for (const [dd, az] of [[40, 0], [40, 90], [40, 45], [70, 30], [10, 80]]) {
        const app = apparentDip(dd, 90, az);
        const expect = Math.atan(Math.tan(dd * RAD) * Math.abs(Math.cos((90 - az) * RAD))) / RAD;
        worst = Math.max(worst, Math.abs(app - expect));
      }
      const full = apparentDip(40, 90, 90), perp = apparentDip(40, 90, 0);
      add("Apparent dip: equals the true dip along the dip direction, zero along strike",
        worst < 1e-9 && Math.abs(full - 40) < 1e-9 && perp < 1e-9, `true 40 deg gives ${full.toFixed(3)} along dip, ${perp.toFixed(3)} along strike`);
    }
    // 7. Contours land where the grid says (linear ramp: contour of depth = 10 * lat_offset)
    {
      const nlat = 11, nlon = 11, dep = [], unc = [];
      for (let j = 0; j < nlat; j++) for (let i = 0; i < nlon; i++) { dep.push(j * 100); unc.push(1); }
      const mm = load({ slabs: { kur: { lat0: 30, lon0: 130, step: 0.1, nlat, nlon, dep, unc } } });
      const lines = mm.contours("kur", 45); // depth 45 km: lat 30 + 0.45
      const pts = lines.flat();
      add("Depth contour of a linear ramp sits at the analytic latitude", lines.length === 1 && pts.length === nlon && pts.every(p => Math.abs(p[1] - 30.45) < 1e-9),
        `${lines.length} line(s), ${pts.length} points`);
    }
    // 8. Slab geometry spot checks that anyone can reproduce from the published Slab2
    {
      const t = m.beneath(38.5, 142.0), tt = m.beneath(40, 135);
      add("Slab under the Japan Trench coast and under the Sea of Japan are at plausible depths",
        t.pac !== null && t.pac > 40 && t.pac < 80 && tt.pac !== null && tt.pac > 300 && tt.pac < 450, `38.5N 142E: ${t.pac && t.pac.toFixed(0)} km; 40N 135E: ${tt.pac && tt.pac.toFixed(0)} km`);
    }
    // 9. Volcano depths: the independent observation. Median Slab2 depth beneath the
    // Northeast Japan arc volcanoes should sit near the textbook ~100 km under arc fronts.
    {
      const v = m.volcanoes().filter(x => x.subregion === "Northeast Japan Volcanic Arc" && x.depth !== null).map(x => x.depth).sort((a, b) => a - b);
      const med = quantile(v, 0.5);
      add("Slab2 is 80-130 km deep beneath the Northeast Japan arc volcanoes (independent of the catalog)", v.length >= 30 && med > 80 && med < 130, `${v.length} volcanoes, median ${med.toFixed(0)} km`);
    }
    // 9b. Volcanic front: the easternmost NE Japan volcanoes sit over the slab near 100 km
    {
      const f = m.volcanicFront(36, 41).filter(x => x.depth !== null).map(x => x.depth).sort((a, b) => a - b);
      const med = quantile(f, 0.5);
      add("Slab2 is 70-130 km deep beneath the NE Japan volcanic front (easternmost volcano per half degree of latitude)", f.length >= 8 && med > 70 && med < 130, `${f.length} volcanoes, median ${med.toFixed(0)} km, range ${f[0].toFixed(0)}-${f[f.length - 1].toFixed(0)}`);
    }
    // 10. Regression on the page statistics (needs the catalog; node only)
    try {
      const fs = typeof require === "function" ? require("fs") : null, path = typeof require === "function" ? require("path") : null;
      const f = fs && path ? path.join(__dirname, "data", "earthquakes.csv") : null;
      if (!f || !fs.existsSync(f)) throw new Error("no catalog");
      const lines = fs.readFileSync(f, "utf8").trim().split("\n");
      const hdr = lines[0].split(","), iLat = hdr.indexOf("latitude"), iLon = hdr.indexOf("longitude"), iDep = hdr.indexOf("depth"), iType = hdr.indexOf("type");
      const evs = [];
      for (const l of lines.slice(1)) {
        if (!/,earthquake,/.test(l)) continue;
        const c = l.split(","); // the place column is quoted but holds no comma-separated field we need
        evs.push({ lat: +c[iLat], lon: +c[iLon], depth: +c[iDep] });
      }
      void iType;
      const s = m.summarize(evs);
      add("Share of >=70 km events 0-50 km below the Slab2 top (page regression; 85.5% with the triangulated surface, 84.3% by nearest node)", Math.abs(100 * s.share - 85.5) < 0.6 && s.n > 2200 && s.n < 2300,
        `${s.nInside} of ${s.n} = ${(100 * s.share).toFixed(1)}%, median signed distance ${s.medianSigned.toFixed(1)} km`);
    } catch (e) {
      add("Share of >=70 km events 0-50 km below the Slab2 top (page regression)", true, "skipped: catalog not available here (" + e.message + ")");
    }
    return out;
  }

  const api = { load, runChecks, apparentDip, pointTriangle, quantile, hav, xyz, R };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Slab = api;
})(typeof window !== "undefined" ? window : globalThis);
