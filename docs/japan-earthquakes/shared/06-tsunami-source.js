// Tsunami source model for japan-earthquakes essay 06, "How a Tsunami Forms".
//
// 1. Okada (1985) surface displacement of a rectangular dip-slip fault in an
//    elastic half-space, summed over strips down dip so slip can taper.
//    Each observation point uses its own reference level (the local seafloor
//    or ground), the "varying reference elevation" approximation of Williams
//    and Wadge (1998), so the fault sits at its drawn depth below each point.
// 2. The initial sea surface: vertical seafloor motion, plus the horizontal
//    motion of the sloping seafloor (Tanioka and Satake 1996), smoothed by the
//    water column with Kajiura's (1963) 1/cosh(kh) filter.
// 3. Linear shallow-water equations in one dimension on the real depth
//    profile: a wall at the coast and an open boundary offshore.
//
// Units: km for distances and depths, m for slip and displacement.
// Works in the browser (window.TsunamiSource) and in node (module.exports).
(function (root) {
  "use strict";

  // ---- Okada (1985), surface displacement, dip-slip component ----
  // Okada's frame: x along strike, y horizontal perpendicular to it, fault
  // plane from (0, 0, -d) up dip to (x, W cos(dip), -d + W sin(dip)).
  // Positive U is reverse (thrust) slip: the hanging wall moves up dip.
  function okadaDipSlip(x, y, d, dip, L, W, U, nu) {
    const cs = Math.cos(dip), sn = Math.sin(dip);
    const mu_lm = 1 - 2 * nu; // mu / (lambda + mu)
    const p = y * cs + d * sn;
    const q = y * sn - d * cs;
    function f(xi, eta) {
      const R = Math.sqrt(xi * xi + eta * eta + q * q);
      const yt = eta * cs + q * sn;
      const dt = eta * sn - q * cs;
      const X = Math.sqrt(xi * xi + q * q);
      // Singular cases, following Okada (1985) section 5
      const lnReta = (R + eta) > 1e-12 ? Math.log(R + eta) : -Math.log(R - eta);
      const atanT = Math.abs(q) > 1e-12 ? Math.atan(xi * eta / (q * R)) : 0;
      const I5 = Math.abs(xi) > 1e-12
        ? mu_lm * 2 / cs * Math.atan((eta * (X + q * cs) + X * (R + X) * sn) / (xi * (R + X) * cs))
        : 0;
      const I4 = mu_lm / cs * (Math.log(R + dt) - sn * lnReta);
      const I3 = mu_lm * (yt / (cs * (R + dt)) - lnReta) + sn / cs * I4;
      const I1 = mu_lm * (-xi / (cs * (R + dt))) - sn / cs * I5;
      const RRxi = R * (R + xi);
      return [
        q / R - I3 * sn * cs,                          // u_x
        yt * q / RRxi + cs * atanT - I1 * sn * cs,     // u_y
        dt * q / RRxi + sn * atanT - I5 * sn * cs      // u_z
      ];
    }
    const a = f(x, p), b = f(x, p - W), c = f(x - L, p), e = f(x - L, p - W);
    const k = -U / (2 * Math.PI);
    return [0, 1, 2].map(i => k * (a[i] - b[i] - c[i] + e[i]));
  }

  // Fault on the profile. Profile coordinate s (km) runs east, seaward.
  // The fault dips west (landward) from its top edge at sTop, depth zTop km
  // below sea level, for W km down dip, L km along strike; the section cuts
  // the middle of its length. slipAt(frac) gives slip in m at fraction
  // 0 (top) .. 1 (bottom) of the width. refDepth(s) is the km below sea level
  // of the ground or seafloor at s (negative on land).
  // Returns east (seaward) and up displacement of the seafloor, in m.
  function seafloorDisplacement(opts, sList, refDepth) {
    const { sTop, zTop, W, L, dipDeg, slipAt, nu = 0.25, strips = 16 } = opts;
    const dip = dipDeg * Math.PI / 180;
    const cs = Math.cos(dip), sn = Math.sin(dip);
    const ue = new Float64Array(sList.length), uz = new Float64Array(sList.length);
    const w = W / strips;
    for (let k = 0; k < strips; k++) {
      const slip = slipAt((k + 0.5) / strips);
      if (!slip) continue;
      // strip k spans down-dip distance [k w, (k+1) w] from the top edge
      const sBottom = sTop - (k + 1) * w * cs;   // bottom edge position (west)
      const zBottom = zTop + (k + 1) * w * sn;   // bottom edge depth below sea level
      for (let i = 0; i < sList.length; i++) {
        const s = sList[i];
        const d = zBottom - refDepth(s);          // bottom-edge depth below this point's surface
        if (d - w * sn <= 0.05) continue;         // strip would reach above this surface
        // Okada y points up dip, which here is east: y = s - sBottom
        const u = okadaDipSlip(L / 2, s - sBottom, d, dip, L, w, slip, nu);
        ue[i] += u[1];
        uz[i] += u[2];
      }
    }
    return { ue, uz };
  }

  // Seismic moment and magnitude for the same fault. mu in Pa.
  function momentMagnitude(opts, mu = 4e10) {
    const { W, L, slipAt, strips = 16 } = opts;
    let mean = 0;
    for (let k = 0; k < strips; k++) mean += slipAt((k + 0.5) / strips) / strips;
    const M0 = mu * (L * 1e3) * (W * 1e3) * mean;
    return { M0, Mw: M0 > 0 ? (Math.log10(M0) - 9.1) / 1.5 : NaN, meanSlip: mean };
  }

  // Initial sea surface from seafloor motion on a uniform grid (spacing ds km).
  // depth[i] in m (positive in water, <= 0 on land), elev slope from the same
  // grid. horizontal: include the push of the sloping seafloor.
  function initialSurface(ue, uz, depth, ds, horizontal) {
    const n = uz.length, src = new Float64Array(n), eta = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let v = uz[i];
      if (horizontal && i > 0 && i < n - 1) {
        // elevation = -depth; d(elev)/ds per km, displacement in m, depth in m
        const slope = -(depth[i + 1] - depth[i - 1]) / (2 * ds * 1000);
        v += -ue[i] * slope;
      }
      src[i] = depth[i] > 0 ? v : 0;
    }
    // Kajiura filter: sea surface = seafloor uplift convolved with
    // (1 / 2h) sech(pi x / 2h), whose transform is 1 / cosh(k h).
    for (let i = 0; i < n; i++) {
      if (depth[i] <= 0) continue;
      const h = depth[i] / 1000; // km
      const reach = Math.ceil(6 * h / ds) + 1;
      let sum = 0, wsum = 0;
      for (let j = Math.max(0, i - reach); j <= Math.min(n - 1, i + reach); j++) {
        const x = (j - i) * ds;
        const g = 1 / Math.cosh(Math.PI * x / (2 * h));
        wsum += g;
        if (depth[j] > 0) sum += g * src[j];
      }
      eta[i] = wsum > 0 ? sum / wsum : 0;
    }
    return { src, eta };
  }

  // Linear shallow-water equations on a staggered grid. depth in m (> 0),
  // dx in km. Wall at index 0 (the coast side), radiating boundary at the end.
  // Returns frames of eta every `every` seconds up to tEnd seconds.
  function simulate(eta0, depth, dx, tEnd, every, g = 9.81) {
    const n = eta0.length, DX = dx * 1000;
    const h = Float64Array.from(depth, v => Math.max(v, 10));
    const hFace = new Float64Array(n + 1);
    for (let i = 1; i < n; i++) hFace[i] = 0.5 * (h[i - 1] + h[i]);
    hFace[n] = h[n - 1];
    const cmax = Math.sqrt(g * Math.max(...h));
    const dt = 0.5 * DX / cmax;
    const eta = Float64Array.from(eta0), q = new Float64Array(n + 1);
    const frames = [Float32Array.from(eta)];
    const cEnd = Math.sqrt(g * h[n - 1]);
    let t = 0, next = every;
    while (t < tEnd - 1e-9) {
      for (let i = 1; i < n; i++) q[i] -= dt * g * hFace[i] * (eta[i] - eta[i - 1]) / DX;
      q[0] = 0;                                   // wall at the coast
      q[n] = cEnd * eta[n - 1];                   // outgoing wave only
      for (let i = 0; i < n; i++) eta[i] -= dt * (q[i + 1] - q[i]) / DX;
      t += dt;
      if (t >= next - 1e-9) { frames.push(Float32Array.from(eta)); next += every; }
    }
    return { frames, dt, every };
  }

  // ---- Map view: the same physics on a latitude-longitude grid ----
  // grid: { lat0, lon0, dlat, dlon, nlat, nlon, elev[] } (06-bathy-grid.json),
  // elev in m, row-major from the south-west corner.
  const R_EARTH = 6371;
  const RAD = Math.PI / 180;
  // Local east/north km of (lat, lon) from an origin, flat-earth (good to well
  // under 1% over a few hundred km, which is all the fault needs).
  function toKm(lat, lon, o) {
    return [(lon - o[1]) * RAD * R_EARTH * Math.cos(o[0] * RAD), (lat - o[0]) * RAD * R_EARTH];
  }

  // Seafloor displacement over the grid from a fault whose top edge runs along
  // a straight line at azimuth `strike` through `anchor` (lat, lon), zTop km
  // below sea level, dipping to the right of the strike. The fault spans
  // along-strike distance [a0, a1] km from the anchor (positive along strike)
  // and W km down dip, with slip slipAt(frac) down dip (0 = top edge).
  // Returns east, north and up displacement (m) at every cell centre.
  // `within` (km) skips cells farther than that from the fault's surface
  // projection, where the motion is negligible. `rows` [i0, i1) and `into`
  // (a previous result) let a page fill the grid a slice at a time.
  function seafloorDisplacementMap(grid, opts) {
    const { anchor, strike, zTop, W, dipDeg, a0, a1, slipAt, nu = 0.25, strips = 16, within = 400 } = opts;
    const { nlat, nlon, elev } = grid;
    const N = nlat * nlon;
    const res = opts.into || { ue: new Float64Array(N), un: new Float64Array(N), uz: new Float64Array(N) };
    const { ue, un, uz } = res;
    const [r0, r1] = opts.rows || [0, nlat];
    const dip = dipDeg * RAD, cs = Math.cos(dip), sn = Math.sin(dip);
    // Okada frame: x along strike, y up dip (horizontal), z up; right-handed,
    // so y is the strike rotated 90 degrees anticlockwise in map view.
    const st = strike * RAD;
    const xe = Math.sin(st), xn = Math.cos(st);   // along strike
    const ye = -xn, yn = xe;                      // up dip (to the left of strike)
    const L = a1 - a0, w = W / strips;
    for (let i = r0; i < r1; i++) {
      const lat = grid.lat0 + i * grid.dlat;
      for (let j = 0; j < nlon; j++) {
        const lon = grid.lon0 + j * grid.dlon;
        const [e, n] = toKm(lat, lon, anchor);
        const xs = e * xe + n * xn, yp = e * ye + n * yn;   // along strike, up dip from the top edge
        const dx = xs < a0 ? a0 - xs : xs > a1 ? xs - a1 : 0;
        const dy = yp > 0 ? yp : yp < -W * cs ? -W * cs - yp : 0;
        if (dx * dx + dy * dy > within * within) continue;
        const k0 = i * nlon + j, ref = -elev[k0] / 1000;    // km below sea level of this point's surface
        let ux = 0, uy = 0, uzz = 0;
        for (let k = 0; k < strips; k++) {
          const slip = slipAt((k + 0.5) / strips);
          if (!slip) continue;
          const yB = -(k + 1) * w * cs;                     // bottom edge of strip k, up-dip coordinate
          const d = zTop + (k + 1) * w * sn - ref;
          if (d - w * sn <= 0.05) continue;
          const u = okadaDipSlip(xs - a0, yp - yB, d, dip, L, w, slip, nu);
          ux += u[0]; uy += u[1]; uzz += u[2];
        }
        ue[k0] = ux * xe + uy * ye;
        un[k0] = ux * xn + uy * yn;
        uz[k0] = uzz;
      }
    }
    return res;
  }

  // Grid metrics: cell widths in m (east-west per row, north-south).
  function gridMetrics(grid) {
    const dy = grid.dlat * RAD * R_EARTH * 1000;
    const dx = new Float64Array(grid.nlat), cosC = new Float64Array(grid.nlat), cosF = new Float64Array(grid.nlat + 1);
    for (let i = 0; i < grid.nlat; i++) {
      cosC[i] = Math.cos((grid.lat0 + i * grid.dlat) * RAD);
      dx[i] = grid.dlon * RAD * R_EARTH * 1000 * cosC[i];
    }
    for (let i = 0; i <= grid.nlat; i++) cosF[i] = Math.cos((grid.lat0 + (i - 0.5) * grid.dlat) * RAD);
    return { dx, dy, cosC, cosF };
  }

  // Initial sea surface on the grid: vertical seafloor motion plus, if asked,
  // the horizontal motion of the sloping seafloor, then Kajiura's filter
  // applied along each axis in turn (a product of two 1D sech kernels of the
  // local depth, the separable stand-in for the radial 2D kernel). Land and
  // water shallower than minDepth carry no water.
  function initialSurfaceMap(grid, disp, horizontal, minDepth = 10) {
    const { nlat: ny, nlon: nx, elev } = grid;
    const { dx, dy } = gridMetrics(grid);
    const N = nx * ny, src = new Float64Array(N);
    const wet = k => -elev[k] >= minDepth;
    for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
      const k = i * nx + j;
      if (!wet(k)) continue;
      let v = disp.uz[k];
      if (horizontal && i > 0 && i < ny - 1 && j > 0 && j < nx - 1) {
        const sx = (elev[k + 1] - elev[k - 1]) / (2 * dx[i]);     // elevation slope, m per m
        const sy = (elev[k + nx] - elev[k - nx]) / (2 * dy);
        v += disp.ue[k] * sx + disp.un[k] * sy;
      }
      src[k] = v;
    }
    const pass = (inp, along) => {
      const outp = new Float64Array(N);
      for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
        const k = i * nx + j;
        if (!wet(k)) continue;
        const h = -elev[k], step = along === "x" ? dx[i] : dy;
        const reach = Math.ceil(6 * h / step) + 1;
        let sum = 0, wsum = 0;
        for (let m = -reach; m <= reach; m++) {
          const ii = along === "x" ? i : i + m, jj = along === "x" ? j + m : j;
          if (ii < 0 || ii >= ny || jj < 0 || jj >= nx) continue;
          const g = 1 / Math.cosh(Math.PI * m * step / (2 * h));
          wsum += g;
          const kk = ii * nx + jj;
          if (wet(kk)) sum += g * inp[kk];
        }
        outp[k] = wsum > 0 ? sum / wsum : 0;
      }
      return outp;
    };
    const eta = pass(pass(src, "x"), "y");
    return { src, eta };
  }

  // Linear shallow-water equations on the sphere (no Coriolis: its period here
  // is about 20 hours, far longer than the first hour), staggered C grid.
  // Coast cells (shallower than minDepth) are walls; a sponge `sponge` cells
  // wide absorbs the wave at the grid's edges. Records the sea surface every
  // `every` s as Int16 cm frames, block-averaged over frameFactor x frameFactor
  // cells (wet cells only), the sea surface at each gauge {lat, lon} every
  // `gaugeEvery` s, and the highest sea surface each cell reaches (hmax).
  // createMapSim returns a stepper so a page can run it in slices:
  // sim.advance(t) steps until model time t (s) and returns true once tEnd is
  // reached. simulateMap runs it to the end.
  function createMapSim(grid, eta0, opts = {}) {
    const { tEnd = 3600, every = 20, gaugeEvery = 10, gauges = [], minDepth = 10, sponge = 16, g = 9.81, cfl = 0.8,
      keepFrames = true, frameFactor = 1 } = opts;
    const { nlat: ny, nlon: nx, elev } = grid;
    const { dx, dy, cosC, cosF } = gridMetrics(grid);
    const N = nx * ny;
    const h = new Float64Array(N);
    let hmaxDepth = 0;
    for (let k = 0; k < N; k++) { h[k] = -elev[k] >= minDepth ? -elev[k] : 0; if (h[k] > hmaxDepth) hmaxDepth = h[k]; }
    // face depths, 0 across any wall
    const W1 = nx + 1;
    const hP = new Float64Array(ny * W1), hQ = new Float64Array((ny + 1) * nx);
    for (let i = 0; i < ny; i++) for (let j = 1; j < nx; j++) {
      const a = h[i * nx + j - 1], b = h[i * nx + j];
      hP[i * W1 + j] = a > 0 && b > 0 ? 0.5 * (a + b) : 0;
    }
    for (let i = 1; i < ny; i++) for (let j = 0; j < nx; j++) {
      const a = h[(i - 1) * nx + j], b = h[i * nx + j];
      hQ[i * nx + j] = a > 0 && b > 0 ? 0.5 * (a + b) : 0;
    }
    let dxMin = Infinity; for (let i = 0; i < ny; i++) dxMin = Math.min(dxMin, dx[i]);
    const dt = cfl * Math.min(dxMin, dy) / Math.sqrt(2 * g * hmaxDepth);
    // sponge: damping per step on the cells near the edges
    const damp = new Float64Array(N).fill(1), spongeCells = [];
    for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
      const e = Math.min(i, j, ny - 1 - i, nx - 1 - j);
      if (e < sponge) {
        const r = (sponge - e) / sponge;
        damp[i * nx + j] = Math.exp(-dt * 0.02 * r * r);
        spongeCells.push(i, j);
      }
    }
    const eta = Float64Array.from(eta0);
    for (let k = 0; k < N; k++) if (!h[k]) eta[k] = 0;
    const P = new Float64Array(ny * W1), Q = new Float64Array((ny + 1) * nx);
    const hmax = new Float32Array(N);
    for (let k = 0; k < N; k++) hmax[k] = h[k] ? Math.max(0, eta[k]) : 0;
    // gauges: bilinear weights over wet neighbours
    const gw = gauges.map(gg => {
      const fi = (gg.lat - grid.lat0) / grid.dlat, fj = (gg.lon - grid.lon0) / grid.dlon;
      const i0 = Math.floor(fi), j0 = Math.floor(fj), a = fi - i0, b = fj - j0;
      const pts = [[i0, j0, (1 - a) * (1 - b)], [i0, j0 + 1, (1 - a) * b], [i0 + 1, j0, a * (1 - b)], [i0 + 1, j0 + 1, a * b]]
        .map(([i, j, w]) => [i * nx + j, w]).filter(([k]) => h[k] > 0);
      const s = pts.reduce((m, p) => m + p[1], 0);
      return pts.map(([k, w]) => [k, w / s]);
    });
    const gaugeNow = () => gw.map(pts => pts.reduce((s, [k, w]) => s + w * eta[k], 0));
    let prev = gaugeNow();
    const series = prev.map(v => [v]);
    // frames, block-averaged
    const F = frameFactor, fny = Math.floor(ny / F), fnx = Math.floor(nx / F);
    const frames = [];
    const snap = () => {
      const f = new Int16Array(fny * fnx);
      for (let I = 0; I < fny; I++) for (let J = 0; J < fnx; J++) {
        let s = 0, c = 0;
        for (let a = 0; a < F; a++) for (let b = 0; b < F; b++) {
          const k = (I * F + a) * nx + J * F + b;
          if (h[k]) { s += eta[k]; c++; }
        }
        f[I * fnx + J] = c ? Math.max(-32767, Math.min(32767, Math.round(s / c * 100))) : 0;
      }
      frames.push(f);
    };
    if (keepFrames) snap();
    let t = 0, nextF = every, nextG = gaugeEvery;
    function step() {
      const gdt = g * dt;
      for (let i = 0; i < ny; i++) {
        const r = i * W1, c = i * nx, f = gdt / dx[i];
        for (let j = 1; j < nx; j++) { const hp = hP[r + j]; if (hp) P[r + j] -= f * hp * (eta[c + j] - eta[c + j - 1]); }
      }
      const fy = gdt / dy;
      for (let i = 1; i < ny; i++) {
        const c = i * nx;
        for (let j = 0; j < nx; j++) { const hq = hQ[c + j]; if (hq) Q[c + j] -= fy * hq * (eta[c + j] - eta[c - nx + j]); }
      }
      for (let i = 0; i < ny; i++) {
        const r = i * W1, c = i * nx, ax = dt / dx[i], ay = dt / (dy * cosC[i]), cs = cosF[i], cn = cosF[i + 1];
        for (let j = 0; j < nx; j++) {
          const k = c + j;
          if (!h[k]) continue;
          const v = eta[k] - ax * (P[r + j + 1] - P[r + j]) - ay * (Q[k + nx] * cn - Q[k] * cs);
          eta[k] = v;
          if (v > hmax[k]) hmax[k] = v;
        }
      }
      for (let m = 0; m < spongeCells.length; m += 2) {
        const i = spongeCells[m], j = spongeCells[m + 1], d = damp[i * nx + j];
        eta[i * nx + j] *= d; P[i * W1 + j] *= d; Q[i * nx + j] *= d;
      }
      t += dt;
      if (gw.length) {
        const cur = gaugeNow();
        // linear in time between the last two steps
        while (t >= nextG - 1e-9 && nextG <= tEnd + 1e-9) {
          const a = 1 - (t - nextG) / dt;
          cur.forEach((v, m) => series[m].push(prev[m] + a * (v - prev[m])));
          nextG += gaugeEvery;
        }
        prev = cur;
      }
      if (keepFrames && t >= nextF - 1e-9) { snap(); nextF += every; }
    }
    const sim = {
      frames, every, series, gaugeEvery, hmax, dt, tEnd, frameNx: fnx, frameNy: fny, frameFactor: F,
      get t() { return t; },
      get done() { return t >= tEnd - 1e-9; },
      advance(until) {
        const stop = Math.min(until, tEnd);
        while (t < stop - 1e-9) step();
        return sim.done;
      }
    };
    return sim;
  }
  function simulateMap(grid, eta0, opts = {}) {
    const sim = createMapSim(grid, eta0, opts);
    sim.advance(Infinity);
    return sim;
  }

  // Checks, run by tests/japan-earthquakes.html (or in node:
  // node -e "require('./docs/japan-earthquakes/shared/06-tsunami-source.js').runChecks()").
  // Reference: surface displacement of the same fault (L 100, W 50 km, dip 20 deg,
  // bottom edge 30 km deep, 1 m reverse slip, Poisson 0.25) computed with cutde
  // (Nikkhoo and Walter 2015 triangular dislocations, two triangles), which shares
  // no code with Okada's formulas. Rows are [x, y, ux, uy, uz].
  const CUTDE_REF = [
      [-20, -80, 0.01668956675, 0.04061628359, -0.006257617462],
      [-20, -40, 0.0331089922, 0.05776701174, -0.01912375257],
      [-20, -10, 0.0357798002, 0.04952483322, -0.02771814056],
      [-20, 0, 0.02209505134, 0.03856005177, -0.02026907086],
      [-20, 15, -0.01468724462, 0.02560793638, 0.001847615629],
      [-20, 30, -0.05217112205, 0.02156844677, 0.02091582836],
      [-20, 46, -0.06340375402, 0.02444370825, 0.02367903154],
      [-20, 60, -0.04077953303, 0.01896100208, 0.01237244025],
      [-20, 100, -0.002879605614, -0.008803689621, 0.0006402901703],
      [10, -80, 0.01418566974, 0.06153492161, -0.009243077612],
      [10, -40, 0.03399091627, 0.1192254853, -0.04031835288],
      [10, -10, 0.04519269522, 0.1535725024, -0.08857930092],
      [10, 0, 0.03011226366, 0.141170561, -0.05836626222],
      [10, 15, -0.01856755135, 0.1434298883, 0.06682327195],
      [10, 30, -0.07572274992, 0.1530701191, 0.2104466567],
      [10, 46, -0.1030559854, 0.1817669757, 0.3272640757],
      [10, 60, -0.0549360626, 0.1191919148, 0.09814293316],
      [10, 100, -0.002297755678, -0.01330836595, 0.003698132239],
      [50, -80, 1.994931997e-17, 0.07560668109, -0.01129654653],
      [50, -40, 2.949029909e-17, 0.1601988698, -0.05407205053],
      [50, -10, 6.938893904e-18, 0.2107448467, -0.1190501708],
      [50, 0, -2.775557562e-17, 0.1924093283, -0.07700472318],
      [50, 15, 7.892991816e-17, 0.1896171555, 0.09089016601],
      [50, 30, -9.020562075e-17, 0.1983005385, 0.2754507615],
      [50, 46, -4.857225733e-17, 0.2339136109, 0.402548541],
      [50, 60, -1.387778781e-17, 0.1576827642, 0.1306086304],
      [50, 100, -4.445228907e-18, -0.01626036553, 0.005860649554],
      [80, -80, -0.01152883573, 0.06735623845, -0.01009275304],
      [80, -40, -0.02743534985, 0.1370084461, -0.04643042175],
      [80, -10, -0.03306515223, 0.181842526, -0.104493178],
      [80, 0, -0.02107540412, 0.1679385735, -0.06819331797],
      [80, 15, 0.01306427675, 0.1707218643, 0.08167351467],
      [80, 30, 0.04853971688, 0.1807910311, 0.2509690767],
      [80, 46, 0.05896895948, 0.2135051878, 0.3773503648],
      [80, 60, 0.0367441865, 0.1415563612, 0.1171116258],
      [80, 100, 0.001865320607, -0.01456485924, 0.004598717828],
      [130, -80, -0.01593341837, 0.03402336195, -0.005361691755],
      [130, -40, -0.02793018375, 0.04234987855, -0.01414365272],
      [130, -10, -0.02503461155, 0.03075905469, -0.0179963654],
      [130, 0, -0.01422611142, 0.02247602622, -0.01420735257],
      [130, 15, 0.01052463904, 0.01267459948, -0.004183779568],
      [130, 30, 0.0331196826, 0.009600001892, 0.004310543307],
      [130, 46, 0.03898779853, 0.01068726176, 0.006291657827],
      [130, 60, 0.02822505749, 0.008293742133, 0.003510348151],
      [130, 100, 0.002843257446, -0.00748697963, -0.0001873334543]
  ];
  function runChecks(print = true) {
    const out = [];
    const check = (name, ok, detail) => out.push({ name, ok: !!ok, detail });
    let worst = 0;
    CUTDE_REF.forEach(r => {
      const u = okadaDipSlip(r[0], r[1], 30, 20 * Math.PI / 180, 100, 50, 1, 0.25);
      for (let i = 0; i < 3; i++) worst = Math.max(worst, Math.abs(u[i] - r[2 + i]));
    });
    check("Okada dip-slip matches cutde at 45 surface points", worst < 1e-8, "max diff " + worst.toExponential(1) + " m per m of slip");
    // Thrust: uplift above the up-dip edge, subsidence beyond the down-dip edge
    const up = okadaDipSlip(50, 45, 30, 20 * Math.PI / 180, 100, 50, 1, 0.25)[2];
    const dn = okadaDipSlip(50, -20, 30, 20 * Math.PI / 180, 100, 50, 1, 0.25)[2];
    check("reverse slip lifts the hanging wall's up-dip end and drops beyond the down-dip end", up > 0 && dn < 0, "uz " + up.toFixed(3) + ", " + dn.toFixed(3));
    // Kajiura filter keeps volume in uniform depth
    const n = 400, depth = new Float64Array(n).fill(4000), z = new Float64Array(n);
    for (let i = 180; i < 220; i++) z[i] = 1;
    const { eta } = initialSurface(z, z, depth, 1, false);
    const v0 = z.reduce((a, b) => a + b, 0), v1 = eta.reduce((a, b) => a + b, 0);
    check("Kajiura filter keeps the displaced volume", Math.abs(v1 - v0) / v0 < 1e-3, v1.toFixed(3) + " vs " + v0);
    check("Kajiura filter leaves a 40 km step in 4 km of water nearly full height", d3max(eta) > 0.95, "peak " + d3max(eta).toFixed(3));
    const zn = new Float64Array(n); for (let i = 198; i < 202; i++) zn[i] = 1;
    const narrow = initialSurface(zn, zn, depth, 1, false).eta;
    check("Kajiura filter flattens a 4 km bump in 4 km of water", d3max(narrow) < 0.6, "peak " + d3max(narrow).toFixed(3));
    // Shallow-water solver: volume conserved with a wall, and speed sqrt(g h)
    const sim = simulate(eta, depth, 1, 600, 600);
    const f = sim.frames[1];
    const vol = f.reduce((a, b) => a + b, 0);
    check("shallow-water solver conserves volume before the wave reaches an edge", Math.abs(vol - v1) / v1 < 1e-6, vol.toFixed(4));
    // centroid of the right-going half (cell centres at i + 0.5)
    let m = 0, mx = 0;
    for (let i = 200; i < n; i++) { m += f[i]; mx += f[i] * (i + 0.5); }
    const moved = mx / m - 200, c = Math.sqrt(9.81 * 4000) * 600 / 1000;   // km in 600 s
    check("a pulse in 4,000 m of water moves at sqrt(g h)", Math.abs(moved - c) < 1, moved.toFixed(1) + " km vs " + c.toFixed(1));
    // Map view. Two halves of a fault sum to the whole (the fit relies on it)
    const g2 = { lat0: 37, lon0: 141, dlat: 1 / 15, dlon: 1 / 15, nlat: 46, nlon: 61, elev: new Array(46 * 61).fill(-4000) };
    const fo = { anchor: [38.5, 143], strike: 191.5, zTop: 5, W: 80, dipDeg: 12, slipAt: f => 10 * (1 - 0.5 * f) };
    const whole = seafloorDisplacementMap(g2, Object.assign({}, fo, { a0: -60, a1: 60 })).uz;
    const h1 = seafloorDisplacementMap(g2, Object.assign({}, fo, { a0: -60, a1: 0 })).uz;
    const h2 = seafloorDisplacementMap(g2, Object.assign({}, fo, { a0: 0, a1: 60 })).uz;
    let addErr = 0; for (let k = 0; k < whole.length; k++) addErr = Math.max(addErr, Math.abs(whole[k] - h1[k] - h2[k]));
    check("map view: two halves of a fault move the seafloor as much as the whole", addErr < 1e-9, "max diff " + addErr.toExponential(1) + " m");
    // and the map fault matches the cross-section formula on the line through its middle
    const mid = okadaDipSlip(60, 30 * Math.cos(12 * RAD) + 10, 5 + 30 * Math.sin(12 * RAD), 12 * RAD, 120, 30, 1, 0.25)[2];
    const g1 = { lat0: 0, lon0: 0, dlat: 1, dlon: 1, nlat: 1, nlon: 1, elev: [0] };
    const st = 191.5 * RAD;
    const pe = -Math.cos(st) * 10, pn = Math.sin(st) * 10;          // 10 km up dip of the top edge, mid-length
    const lat = 38.5 + pn / R_EARTH / RAD, lon = 143 + pe / (R_EARTH * Math.cos(38.5 * RAD)) / RAD;
    const one = seafloorDisplacementMap(Object.assign(g1, { lat0: lat, lon0: lon }),
      { anchor: [38.5, 143], strike: 191.5, zTop: 5, W: 30, dipDeg: 12, a0: -60, a1: 60, slipAt: () => 1, strips: 1 }).uz[0];
    check("map view: a point seaward of the fault's middle matches the plain Okada formula", Math.abs(one - mid) < 2e-3 * Math.abs(mid) + 1e-6, one.toFixed(5) + " vs " + mid.toFixed(5));
    // shallow water on the sphere: volume kept by walls, front at sqrt(g h), sponge absorbs
    const gb = { lat0: 36, lon0: 140, dlat: 1 / 30, dlon: 1 / 30, nlat: 120, nlon: 120, elev: new Array(14400).fill(-4000) };
    const e0 = new Float64Array(14400);
    for (let i = 0; i < 120; i++) for (let j = 0; j < 120; j++) e0[i * 120 + j] = Math.exp(-((i - 60) ** 2 + (j - 60) ** 2) / 9);
    const met = gridMetrics(gb), volOf = f => { let v = 0; for (let i = 0; i < 120; i++) for (let j = 0; j < 120; j++) v += f[i * 120 + j] * met.dx[i]; return v * met.dy; };
    const sw = simulateMap(gb, e0, { tEnd: 600, every: 600, sponge: 0 });
    const f600 = Float64Array.from(sw.frames[1], v => v / 100);
    check("map view: shallow-water volume is kept inside walls", Math.abs(volOf(f600) / volOf(e0) - 1) < 3e-3, (volOf(f600) / volOf(e0)).toFixed(4) + " (frames stored to 1 cm)");
    let bj = 60; for (let j = 60; j < 120; j++) if (f600[60 * 120 + j] > f600[60 * 120 + bj]) bj = j;
    const ring = (bj - 60) * met.dx[60] / 1000, c2 = Math.sqrt(9.81 * 4000) * 0.6;
    check("map view: the ring from a hump in 4,000 m of water moves at sqrt(g h)", Math.abs(ring - c2) < 3, ring.toFixed(1) + " km vs " + c2.toFixed(1));
    const sp = simulateMap(gb, e0, { tEnd: 3000, every: 3000 });
    let left = 0; for (const v of sp.frames[1]) left = Math.max(left, Math.abs(v) / 100);
    check("map view: the absorbing edge leaves under 1 cm after 50 minutes", left < 0.01, (left * 100).toFixed(1) + " cm");
    if (print && typeof console !== "undefined") out.forEach(r => console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.detail ? "  (" + r.detail + ")" : "")));
    return out;
  }
  function d3max(a) { let m = -Infinity; for (const v of a) if (v > m) m = v; return m; }

  const api = { okadaDipSlip, seafloorDisplacement, momentMagnitude, initialSurface, simulate,
    seafloorDisplacementMap, initialSurfaceMap, createMapSim, simulateMap, gridMetrics, toKm, runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TsunamiSource = api;
})(typeof window !== "undefined" ? window : globalThis);
