// PlateDistance: how close each earthquake sits to a plate, and whether the focal
// mechanism agrees with where the model puts it. Shared by Japan Earthquakes 01.
// Browser global `PlateDistance`, and `module.exports` under node. No fetch in here.
//
// The geometry (3D distance from a hypocentre to the Slab2 surface) is Slab's
// (shared/slab.js, `Slab.load(data).nearest`). This library adds what essay 01 needs
// on top of it:
//   - classes for a hypocentre relative to the plate: on the plate, above it (crust of
//     the overriding plate), inside it, seaward of the trench (no slab beneath, east of
//     Honshu), behind the arc (no slab beneath, elsewhere), deep (70 km and deeper)
//   - a seeded null catalogue: the same depths at epicentres uniform on the sphere over
//     the catalogue box, so "within 30 km of the plate" can be compared with chance
//   - the Kagan (1991) angle between two double-couple mechanisms, the principal axes,
//     a thrust / normal / strike-slip / oblique class (Frohlich-style plunge limits), and
//     "interface-like" = within `maxKagan` degrees of a thrust on the Slab2 surface there
//   - matching catalogue events to Global CMT solutions (time and distance window,
//     one-to-one)
//   - the chi-square tail used to say whether a variance/mean ratio differs from 1
//
// ---- API -----------------------------------------------------------------
//   PlateDistance.isFixedDepth(z)          true for the catalogue's default depths (10, 33, 35 km)
//   PlateDistance.entry(model, e, opts)    e = {lat, lon, depth}; model = Slab.load(...). Returns
//                                          { dist, signed, vert, slab, family, cls, fixed }
//   PlateDistance.dipAt(model, entry, e)   { strike, dip } of the slab under the epicentre, or null
//                                          cls: "plate" |signed| <= plateTol (20 km), "above"
//                                          (signed < -plateTol), "inside" (> plateTol, shallower than
//                                          deepFrom), "seaward" (no slab beneath and the nearest slab
//                                          point shallower than 40 km: off the trench), "behind" (no slab
//                                          beneath, nearest point deeper), "deep" (depth >= deepFrom, 70)
//   PlateDistance.trenchSide(lat, lon, lines)  "seaward" (subducting-plate side of the nearest PB2002 SUB
//                                          trace) or "behind"; entry/classify use it when opts.trenches
//                                          = lines is given, else the 40 km heuristic above
//   PlateDistance.CLASSES                  ["plate", "above", "inside", "seaward", "behind", "deep"]
//   PlateDistance.classify(r, e, opts)     the class alone, from a Slab nearest() result
//   PlateDistance.nullEpicentres(n, seed, box)  [{lat, lon}] uniform on the sphere in box
//                                          [lat0, lat1, lon0, lon1] (uniform in sin(lat) and lon)
//   PlateDistance.mulberry32(seed)         the seeded generator, () => [0, 1)
//   PlateDistance.logBins(lo, hi, n)       {lo, hi, n, bin(d)} log-spaced bins; bin(d) clamps
//   PlateDistance.cumulative(counts)       running share 0..1 of an array of bin counts
//   PlateDistance.shareWithin(dists, d)    share of values <= d
//   PlateDistance.axes(sdr)                { T, B, P } each { plunge, azimuth } degrees
//   PlateDistance.mechClass(sdr)           "thrust" | "normal" | "strike" | "oblique"
//   PlateDistance.kagan(a, b)              Kagan angle (degrees, 0..120) between [strike, dip, rake]
//   PlateDistance.interfaceLike(sdr, dipInfo, maxKagan)  dipInfo = { strike, dip } of the slab
//                                          there; Kagan angle to [strike, dip, 90] <= maxKagan (30)
//   PlateDistance.matchGcmt(events, gcmt, opts)  events [{t, lat, lon}] (t in seconds), gcmt rows
//                                          [t, lat, lon, ...] as in 01-gcmt.json; opts {dt: 60,
//                                          dr: 100}. { match: Int32Array (gcmt row or -1), n }
//   PlateDistance.chi2sf(x, k)             chi-square upper tail
//   PlateDistance.dispersion(counts)       { vm, D, dof, p } for a count series versus Poisson
//   PlateDistance.runChecks(print)         [{ name, ok, detail }]; self-contained (scipy and
//                                          Python reference values below, synthetic slabs)
// ---------------------------------------------------------------------------
(function (root) {
  "use strict";
  const RAD = Math.PI / 180, R = 6371;
  const CLASSES = ["plate", "above", "inside", "seaward", "behind", "deep"];
  const FIXED = [10, 33, 35];
  const isFixedDepth = z => FIXED.indexOf(z) >= 0;

  // ---- seeded random ------------------------------------------------------
  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function nullEpicentres(n, seed, box) {
    const rnd = mulberry32(seed), out = new Array(n);
    const s0 = Math.sin(box[0] * RAD), s1 = Math.sin(box[1] * RAD);
    for (let i = 0; i < n; i++) {
      const lat = Math.asin(s0 + (s1 - s0) * rnd()) / RAD;
      out[i] = { lat, lon: box[2] + (box[3] - box[2]) * rnd() };
    }
    return out;
  }

  // ---- side of the trench (PB2002) ----------------------------------------
  // lines = PB2002 boundary records [{pair, cls, p: [lat, lon, ...]}]. Each trace runs in Bird's
  // listing order with the first plate of `pair` on its left; a backslash in the pair means that
  // first plate is the one going down, a slash that it is the one on top. Returns "seaward" when
  // the point is on the subducting-plate side of the nearest subduction trace (local planar
  // distance), else "behind". Beyond a trace's end the side still comes from that end segment.
  function trenchSide(lat, lon, lines) {
    const kx = Math.cos(lat * RAD);
    let best = Infinity, subLeft = false, left = false;
    for (const ln of lines) {
      if (ln.cls !== "SUB") continue;
      const p = ln.p, down = ln.pair.indexOf("\\") >= 0;
      for (let i = 0; i + 3 < p.length; i += 2) {
        const ax = (p[i + 1] - lon) * kx, ay = p[i] - lat, bx = (p[i + 3] - lon) * kx, by = p[i + 2] - lat;
        const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
        const t = L2 > 0 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L2)) : 0;
        const d2 = (ax + t * dx) ** 2 + (ay + t * dy) ** 2;
        if (d2 < best) { best = d2; subLeft = down; left = dx * (0 - ay) - dy * (0 - ax) > 0; }
      }
    }
    if (best === Infinity) return null;
    return left === subLeft ? "seaward" : "behind";
  }

  // ---- classes ------------------------------------------------------------
  function classify(r, e, opts) {
    const o = opts || {}, tol = o.plateTol == null ? 20 : o.plateTol, deepFrom = o.deepFrom == null ? 70 : o.deepFrom;
    if (e.depth >= deepFrom) return "deep";
    // no slab beneath the epicentre: with the PB2002 traces (opts.trenches), the side of the nearest
    // subduction trace; without them the heuristic below: seaward when the nearest slab point is the slab's shallow
    // trench edge (the event is off the trench, in the incoming plate), behind the arc otherwise
    if (!r || r.vert == null) {
      const sd = o.trenches && e.lat != null ? trenchSide(e.lat, e.lon, o.trenches) : null;
      if (sd) return sd;
    }
    if (!r || r.vert == null) return r && r.foot && r.foot.depth < (o.edgeDepth == null ? 40 : o.edgeDepth) ? "seaward" : "behind";
    if (r.signed < -tol) return "above";
    return r.signed <= tol ? "plate" : "inside";
  }
  function entry(model, e, opts) {
    const r = model.nearest(e.lat, e.lon, e.depth);
    const cls = classify(r, e, opts);
    return { dist: r ? r.dist : Infinity, signed: r ? r.signed : null, vert: r ? r.vert : null, slab: r ? r.slab : null,
      family: r ? r.family : null, cls, fixed: isFixedDepth(e.depth) };
  }
  // Strike and dip of the slab surface under an epicentre, for the entry's nearest slab
  // region; null when the event had no slab beneath it or the region has no grid.
  function dipAt(model, en, e) {
    if (!en || en.vert == null || !model.dip || (model.names && model.names.indexOf(en.slab) < 0)) return null;
    return model.dip(en.slab, e.lat, e.lon);
  }

  // ---- distributions ------------------------------------------------------
  function logBins(lo, hi, n) {
    const a = Math.log10(lo), step = (Math.log10(hi) - a) / n;
    return { lo, hi, n, step, edge: i => Math.pow(10, a + i * step),
      bin: d => d <= lo ? 0 : d >= hi ? n - 1 : Math.min(n - 1, Math.floor((Math.log10(d) - a) / step)) };
  }
  function cumulative(counts) {
    const tot = counts.reduce((s, c) => s + c, 0), out = new Array(counts.length);
    let run = 0;
    for (let i = 0; i < counts.length; i++) { run += counts[i]; out[i] = tot ? run / tot : 0; }
    return out;
  }
  function shareWithin(v, d) {
    let k = 0;
    for (let i = 0; i < v.length; i++) if (v[i] <= d) k++;
    return v.length ? k / v.length : NaN;
  }

  // ---- focal mechanisms ---------------------------------------------------
  // Aki and Richards (1980), x north, y east, z down: n points into the hanging wall,
  // u is the slip of the hanging wall. The tensor is u n + n u, so T = (u + n)/sqrt2,
  // P = (u - n)/sqrt2 and B = P x T, a right-handed frame (T, B, P).
  function unit(v) { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function frame(sdr) {
    const s = sdr[0] * RAD, d = sdr[1] * RAD, r = sdr[2] * RAD;
    const n = [-Math.sin(d) * Math.sin(s), Math.sin(d) * Math.cos(s), -Math.cos(d)];
    const u = [Math.cos(r) * Math.cos(s) + Math.cos(d) * Math.sin(r) * Math.sin(s),
      Math.cos(r) * Math.sin(s) - Math.cos(d) * Math.sin(r) * Math.cos(s), -Math.sin(d) * Math.sin(r)];
    const T = unit([u[0] + n[0], u[1] + n[1], u[2] + n[2]]);
    const P = unit([u[0] - n[0], u[1] - n[1], u[2] - n[2]]);
    return [T, cross(P, T), P];
  }
  function axes(sdr) {
    const f = frame(sdr), out = {};
    ["T", "B", "P"].forEach((k, i) => {
      const v = f[i];
      out[k] = { plunge: Math.abs(Math.asin(Math.max(-1, Math.min(1, v[2])))) / RAD,
        azimuth: ((Math.atan2(v[1], v[0]) / RAD) + 360) % 360 };
    });
    return out;
  }
  // Plunge limits after Frohlich and Apperson (1992) / the World Stress Map scheme:
  // thrust = T steep and P shallow, normal = P steep and T shallow, strike-slip = B steep.
  function mechClass(sdr) {
    const a = axes(sdr), pt = a.T.plunge, pb = a.B.plunge, pp = a.P.plunge;
    if (pp >= 52 && pt <= 35) return "normal";
    if (pt >= 52 && pp <= 35) return "thrust";
    if (pb >= 52 && pp <= 35 && pt <= 35) return "strike";
    return "oblique";
  }
  const SYM = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
  // Kagan (1991): the smallest rotation taking one double couple onto the other. With
  // frames A and B (columns T, B, P), the relative rotation is A^T B, and a double couple
  // is unchanged by 180 degree turns about its axes, so take the best of the four.
  function kagan(a, b) {
    const A = frame(a), B = frame(b), d = [0, 0, 0];
    for (let i = 0; i < 3; i++) d[i] = A[i][0] * B[i][0] + A[i][1] * B[i][1] + A[i][2] * B[i][2];
    let best = 180;
    for (const s of SYM) {
      const c = Math.max(-1, Math.min(1, (s[0] * d[0] + s[1] * d[1] + s[2] * d[2] - 1) / 2));
      best = Math.min(best, Math.acos(c) / RAD);
    }
    return best;
  }
  function interfaceLike(sdr, dipInfo, maxKagan) {
    if (!dipInfo || dipInfo.dip == null) return false;
    return kagan(sdr, [dipInfo.strike, dipInfo.dip, 90]) <= (maxKagan == null ? 30 : maxKagan);
  }

  // ---- matching catalogue events to GCMT solutions --------------------------
  function hav(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * RAD, dLon = (lon2 - lon1) * RAD;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  // GCMT rows must be sorted by time; events may come in any order. Candidate pairs inside the window are taken in order
  // of a combined score (time / dt + distance / dr), each side used once.
  function matchGcmt(events, gcmt, opts) {
    const dt = (opts && opts.dt) || 60, dr = (opts && opts.dr) || 100;
    const pairs = [];
    let lo = 0;
    const order = events.map((e, i) => i).sort((a, b) => events[a].t - events[b].t);
    for (const i of order) {
      const e = events[i];
      while (lo < gcmt.length && gcmt[lo][0] < e.t - dt) lo++;
      for (let j = lo; j < gcmt.length && gcmt[j][0] <= e.t + dt; j++) {
        const dist = hav(e.lat, e.lon, gcmt[j][1], gcmt[j][2]);
        if (dist <= dr) pairs.push([Math.abs(gcmt[j][0] - e.t) / dt + dist / dr, i, j]);
      }
    }
    pairs.sort((a, b) => a[0] - b[0]);
    const match = new Int32Array(events.length).fill(-1), used = new Uint8Array(gcmt.length);
    let n = 0;
    for (const [, i, j] of pairs) if (match[i] < 0 && !used[j]) { match[i] = j; used[j] = 1; n++; }
    return { match, n };
  }

  // ---- chi-square tail (Numerical Recipes gammq) ----------------------------
  function lgamma(x) {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, t = x + 5.5;
    t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015;
    for (let j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  function chi2sf(x, k) {
    if (x <= 0) return 1;
    const a = k / 2, xx = x / 2, g = lgamma(a);
    if (xx < a + 1) { // series for P, return 1 - P
      let ap = a, sum = 1 / a, del = sum;
      for (let n = 0; n < 1000; n++) { ap++; del *= xx / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
      return 1 - sum * Math.exp(-xx + a * Math.log(xx) - g);
    }
    let b = xx + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d; // continued fraction for Q
    for (let i = 1; i < 1000; i++) {
      const an = -i * (i - a);
      b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-xx + a * Math.log(xx) - g) * h;
  }
  // Poisson dispersion test: (n - 1) * variance / mean is chi-square with n - 1 degrees
  // of freedom for independent counts at one rate. p is the upper tail.
  function dispersion(counts) {
    const n = counts.length;
    let m = 0; for (const c of counts) m += c; m /= n;
    let v = 0; for (const c of counts) v += (c - m) * (c - m); v /= (n - 1);
    const D = (n - 1) * v / m;
    return { vm: v / m, D, dof: n - 1, p: chi2sf(D, n - 1) };
  }

  // ---- checks ---------------------------------------------------------------
  // Reference values from scripts/japan-01-kagan-ref.py: moment tensors, numpy eigenvectors
  // and scipy Rotation for the Kagan angle (the JS builds the frame from slip and normal
  // vectors), scipy.stats.chi2.sf, and a Python port of mulberry32.
  const REF_KAGAN = [[297, 33, 150, 76, 48, 143, 77.101923], [216, 28, 99, 211, 45, 63, 36.18735], [151, 38, -119, 303, 27, 147, 102.74351], [286, 41, -103, 200, 30, 106, 87.921827], [186, 18, 77, 37, 30, 83, 49.586068], [357, 11, 64, 146, 61, 11, 82.782487], [252, 15, -39, 213, 25, 94, 76.338546], [346, 85, -1, 180, 24, 71, 91.56386], [15, 44, 92, 38, 51, 138, 35.283168], [238, 15, 115, 27, 17, -108, 32.612349], [164, 42, -43, 190, 17, 79, 93.17823], [219, 23, 105, 188, 20, 69, 13.578244]];
  const REF_MECH = [[297, 33, 150, "oblique"], [76, 48, 143, "thrust"], [216, 28, 99, "thrust"], [211, 45, 63, "thrust"], [151, 38, -119, "normal"], [303, 27, 147, "thrust"], [286, 41, -103, "normal"], [200, 30, 106, "thrust"], [186, 18, 77, "thrust"], [37, 30, 83, "thrust"], [357, 11, 64, "thrust"], [146, 61, 11, "strike"]];
  const REF_CHI2 = [[391, 311, 0.0013769361169215608], [311, 311, 0.48933553907610255], [50, 30, 0.012402060718900541], [3.84, 1, 0.050043521248705085], [12, 20, 0.9160759830051242], [600, 311, 1.42341766724716e-20], [0.5, 4, 0.9735009788392561]];
  const REF_RNG = [0.9797282677609473, 0.3067522644996643, 0.484205421525985, 0.817934412509203, 0.5094283693470061];

  function runChecks(print) {
    const out = [], log = print || (() => {});
    const add = (name, ok, detail) => { out.push({ name, ok: !!ok, detail }); log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); };

    // 1. Kagan angle against the independent Python/scipy values
    let worst = 0;
    for (const r of REF_KAGAN) worst = Math.max(worst, Math.abs(kagan(r.slice(0, 3), r.slice(3, 6)) - r[6]));
    add("Kagan angle matches scipy Rotation on 12 GCMT pairs", worst < 1e-5, "worst " + worst.toExponential(1) + " deg");

    // 2. identities: same mechanism, its auxiliary plane, thrust against normal on one plane
    const same = kagan([30, 40, 80], [30, 40, 80]);
    const auxSwap = kagan([0, 45, 90], [180, 45, 90]); // the auxiliary plane of a 45 degree thrust: same double couple
    add("Kagan angle: identical mechanisms give 0, and a thrust against its auxiliary plane (0/45/90 vs 180/45/90) gives 0",
      same < 1e-4 && auxSwap < 1e-4, "identical " + same.toExponential(1) + ", auxiliary " + auxSwap.toExponential(1));
    const tn = kagan([0, 45, 90], [0, 45, -90]);
    add("Kagan angle: a thrust and a normal fault on the same plane differ by 90 degrees", Math.abs(tn - 90) < 1e-6, tn.toFixed(6) + " deg");

    // 3. mechanism class against the Python plunge rules
    let bad = 0;
    for (const r of REF_MECH) if (mechClass(r.slice(0, 3)) !== r[3]) bad++;
    const exp = { thrust: mechClass([0, 45, 90]), normal: mechClass([0, 60, -90]), strike: mechClass([0, 90, 0]) };
    add("mechClass matches the Python plunge rules on 12 GCMT mechanisms and the textbook cases", bad === 0 && exp.thrust === "thrust" && exp.normal === "normal" && exp.strike === "strike", bad + " mismatches");
    const ax = axes([0, 45, 90]);
    add("principal axes of a 45 degree thrust: T vertical, P and B horizontal", Math.abs(ax.T.plunge - 90) < 1e-6 && ax.P.plunge < 1e-6 && ax.B.plunge < 1e-6,
      "T " + ax.T.plunge.toFixed(1) + ", P " + ax.P.plunge.toFixed(1) + ", B " + ax.B.plunge.toFixed(1));

    // 4. chi-square tail against scipy
    let w = 0;
    for (const [x, k, p] of REF_CHI2) w = Math.max(w, Math.abs(chi2sf(x, k) - p) / p);
    add("chi2sf matches scipy.stats.chi2.sf to a relative 1e-9 on 7 cases", w < 1e-9, "worst relative error " + w.toExponential(1));
    const disp = dispersion(new Array(100).fill(5));
    add("dispersion: a constant count series has variance/mean 0 and p near 1", disp.vm === 0 && disp.p > 0.999, "vm " + disp.vm + ", p " + disp.p.toFixed(4));

    // 5. seeded generator and null catalogue
    const g = mulberry32(12345), got = REF_RNG.map(() => g());
    const dr = Math.max(...got.map((v, i) => Math.abs(v - REF_RNG[i])));
    add("mulberry32 reproduces the Python port for seed 12345", dr < 1e-15, "worst " + dr.toExponential(1));
    const box = [24, 46, 122, 150], N = 20000;
    const a = nullEpicentres(N, 7, box), b = nullEpicentres(N, 7, box), c = nullEpicentres(N, 8, box);
    const det = a.every((p, i) => p.lat === b[i].lat && p.lon === b[i].lon) && (a[0].lat !== c[0].lat);
    const s0 = Math.sin(24 * RAD), s1 = Math.sin(46 * RAD);
    let ms = 0, inb = true;
    for (const p of a) { ms += Math.sin(p.lat * RAD); if (p.lat < 24 || p.lat > 46 || p.lon < 122 || p.lon > 150) inb = false; }
    ms /= N;
    const lons = a.map(p => (p.lon - 122) / 28).sort((x, y) => x - y);
    let ks = 0; lons.forEach((v, i) => { ks = Math.max(ks, Math.abs(v - i / N), Math.abs(v - (i + 1) / N)); });
    const sl = a.map(p => (Math.sin(p.lat * RAD) - s0) / (s1 - s0)).sort((x, y) => x - y);
    let ks2 = 0; sl.forEach((v, i) => { ks2 = Math.max(ks2, Math.abs(v - i / N), Math.abs(v - (i + 1) / N)); });
    add("null epicentres: deterministic per seed, in the box, uniform on the sphere (mean sin(lat) and KS on lon and sin(lat))",
      det && inb && Math.abs(ms - (s0 + s1) / 2) < 0.005 && ks < 1.63 / Math.sqrt(N) && ks2 < 1.63 / Math.sqrt(N),
      "mean sin " + ms.toFixed(4) + " vs " + ((s0 + s1) / 2).toFixed(4) + ", KS " + ks.toFixed(4) + " / " + ks2.toFixed(4) + " (5% limit " + (1.36 / Math.sqrt(N)).toFixed(4) + ")");

    // 6. classes on a synthetic slab: a flat plate 40 km deep under lon >= 139 and none elsewhere
    const model = { nearest(lat, lon, z) {
      if (lon < 130) return null;
      return { dist: Math.abs(z - 40), signed: z - 40, vert: z - 40, slab: "syn", family: "pac" };
    }, dip: () => ({ strike: 0, dip: 0 }) };
    const cases = [[{ lat: 35, lon: 141, depth: 40 }, "plate"], [{ lat: 35, lon: 141, depth: 15 }, "above"], [{ lat: 35, lon: 141, depth: 65 }, "inside"],
      [{ lat: 35, lon: 141, depth: 100 }, "deep"], [{ lat: 35, lon: 145, depth: 20 }, "plate"], [{ lat: 35, lon: 128, depth: 20 }, "behind"], [{ lat: 40, lon: 150, depth: 10 }, "above"]];
    let cb = 0;
    for (const [e, want] of cases) if (entry(model, e).cls !== want) cb++;
    const edge = d => ({ nearest: () => ({ dist: 50, signed: -50, vert: null, slab: "syn", family: "pac", foot: { depth: d } }) });
    const outside = { nearest: () => null };
    const seaward = entry(edge(12), { lat: 38, lon: 144, depth: 20 }).cls === "seaward" && entry(edge(120), { lat: 33, lon: 128, depth: 20 }).cls === "behind" && entry(outside, { lat: 33, lon: 128, depth: 20 }).cls === "behind";
    const ent = entry(model, { lat: 35, lon: 141, depth: 33 });
    add("classes on a synthetic flat slab: plate / above / inside / deep / behind / seaward, fixed-depth flag", cb === 0 && seaward && ent.fixed && !entry(model, { lat: 35, lon: 141, depth: 34 }).fixed && Math.abs(ent.dist - 7) < 1e-12, cb + " wrong");
    const dm = { names: ["s"], nearest: () => ({ dist: 5, signed: 5, vert: 5, slab: "s", family: "pac" }), dip: () => ({ strike: 10, dip: 20 }) };
    const fe = { lat: 35, lon: 141, depth: 30 }, fl = dipAt(dm, entry(dm, fe), fe);
    add("dipAt returns the slab dip and strike, and null with no slab beneath or for a supplement point", fl && fl.dip === 20 && fl.strike === 10 && dipAt(outside, entry(outside, fe), fe) === null && dipAt(dm, { vert: 1, slab: "supp" }, fe) === null, "");

    // side of the trench: a synthetic trace running north, first plate (left, west) on top ("OK/PA"),
    // then the same trench listed the other way round as "PA\\OK" (running south, first plate = subducting, on its left = east)
    const tr = [{ pair: "OK/PA", cls: "SUB", p: [30, 140, 40, 140] }], trD = [{ pair: "PA\\OK", cls: "SUB", p: [40, 140, 30, 140] }];
    const sides = [trenchSide(35, 142, tr), trenchSide(35, 138, tr), trenchSide(35, 142, trD), trenchSide(35, 138, trD), trenchSide(28, 142, tr)];
    const ent2 = entry(outside, { lat: 35, lon: 142, depth: 20 }, { trenches: tr }).cls, ent3 = entry(edge(120), { lat: 35, lon: 142, depth: 20 }, { trenches: tr }).cls;
    add("trenchSide: subducting side is seaward, overriding side behind, for both pair conventions (and past the trace end); classify uses it over the 40 km heuristic",
      sides.join() === "seaward,behind,seaward,behind,seaward" && ent2 === "seaward" && ent3 === "seaward" && entry(edge(120), { lat: 35, lon: 138, depth: 20 }, { trenches: tr }).cls === "behind", sides.join());

    // interface-like: a thrust parallel to the slab, one rotated 40 degrees, one normal fault
    const slabSD = { strike: 200, dip: 15 };
    add("interfaceLike: a thrust on the slab yes (and on its auxiliary plane), the same plane as a normal fault no, a 40 degree turn no",
      interfaceLike([200, 15, 90], slabSD) && interfaceLike([20, 75, 90], slabSD) && !interfaceLike([200, 15, -90], slabSD) && !interfaceLike([240, 15, 90], slabSD),
      "Kagan to a strike +40 thrust " + kagan([240, 15, 90], [200, 15, 90]).toFixed(1) + " deg");

    // 7. GCMT matching: nearest by combined score, one-to-one, window honoured
    const gc = [[1000, 35, 140], [1030, 35.2, 140.1], [5000, 36, 141]];
    const ev = [{ t: 1010, lat: 35.01, lon: 140.0 }, { t: 1032, lat: 35.2, lon: 140.1 }, { t: 5200, lat: 36, lon: 141 }, { t: 5001, lat: 36, lon: 142.5 }];
    const mm = matchGcmt(ev, gc);
    add("matchGcmt: nearest in time and place, each solution used once, outside the 60 s and 100 km windows no match",
      mm.match[0] === 0 && mm.match[1] === 1 && mm.match[2] === -1 && mm.match[3] === -1 && mm.n === 2, Array.from(mm.match).join(","));
    const mm3 = matchGcmt([ev[2], ev[1], ev[0]], gc);
    const mm2 = matchGcmt([{ t: 1000, lat: 35, lon: 140 }, { t: 1000, lat: 35.05, lon: 140 }], [[1000, 35.04, 140]]);
    add("matchGcmt: event order does not matter", mm3.match[0] === -1 && mm3.match[1] === 1 && mm3.match[2] === 0, Array.from(mm3.match).join(","));
    add("matchGcmt: two events competing for one solution, the closer wins", mm2.match[1] === 0 && mm2.match[0] === -1, Array.from(mm2.match).join(","));

    // 8. bins and shares
    const lb = logBins(1, 1000, 30);
    const cum = cumulative([1, 2, 3, 4]);
    add("logBins and cumulative: decade edges, clamping, running share ends at 1; shareWithin counts <=",
      lb.bin(1) === 0 && lb.bin(0.2) === 0 && lb.bin(1000) === 29 && lb.bin(5000) === 29 && lb.bin(10) === 10 && Math.abs(lb.edge(10) - 10) < 1e-9 && cum[3] === 1 && Math.abs(cum[0] - 0.1) < 1e-12 && shareWithin([1, 5, 30, 31, 100], 30) === 0.6,
      "bin(10) " + lb.bin(10));
    return out;
  }

  const api = { CLASSES, isFixedDepth, mulberry32, nullEpicentres, trenchSide, classify, entry, dipAt, logBins, cumulative, shareWithin, axes, mechClass, kagan,
    interfaceLike, matchGcmt, chi2sf, dispersion, hav, runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PlateDistance = api;
})(typeof window !== "undefined" ? window : globalThis);
