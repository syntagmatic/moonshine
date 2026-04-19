// battery-math.js — shared electrochemistry for the lithium-ion series.
// Attaches a single `Li` object to window. No build step.
//
// Li.const       physical constants (F, R, T)
// Li.nernst      Nernst & thermodynamic voltages
// Li.ocv         OCV curves for graphite, LFP, NMC (smoothed empirical) + derivatives
// Li.bv          Butler–Volmer kinetics + Tafel
// Li.sphere      1-D spherical diffusion (explicit FD, Crank–Nicolson optional)
// Li.staging     graphite intercalation staging model
// Li.eis         impedance of Randles + Warburg circuits
// Li.dla         diffusion-limited aggregation for dendrites
// Li.aging       SEI growth + calendar/cycle fade
// Li.fmt         number/axis formatting helpers

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── constants ──
  var F = 96485.33212;      // C/mol
  var R = 8.31446;          // J/(mol·K)
  var T_ROOM = 298.15;      // K
  var RT_F = R * T_ROOM / F; // ≈ 0.02569 V  (thermal voltage)

  // ─────────────────────────────────────────── OCV curves ──
  // Empirical shape of graphite-lithium half-cell OCV vs x = Li content
  // (x = 0 → empty graphite at ~3 V, x = 1 → fully lithiated at ~0.05 V).
  // Three plateaus near stages 4/3 → 2 → 1 produce the characteristic flats.
  // Coefficients tuned to reproduce the classic Dahn graphite profile.
  function ocvGraphite(x) {
    x = Math.max(0.001, Math.min(0.999, x));
    // Piecewise-smooth form: logarithmic divergences + three sigmoid plateaus.
    var v = 0.124
          + 1.5 * Math.exp(-70 * x)
          - 0.0351 * tanh((x - 0.286) / 0.083)
          - 0.0045 * tanh((x - 0.849) / 0.119)
          - 0.035 * tanh((x - 0.1) / 0.03)
          - 0.0147 * tanh((x - 0.5) / 0.034)
          - 0.102 * tanh((x - 0.194) / 0.142)
          - 0.022 * tanh((x - 0.98) / 0.052)
          - 0.011 * tanh((x - 0.124) / 0.0226)
          + 0.0155 * tanh((x - 0.105) / 0.029);
    return v;
  }
  // LFP cathode OCV: flat ~3.42 V plateau with small curvature at edges.
  function ocvLFP(x) {
    x = Math.max(0.001, Math.min(0.999, x));
    var centre = 3.42;
    var plateau = centre
                + 0.004 * Math.log((1 - x) / x)    // entropic tails
                - 0.02 * tanh((x - 0.02) / 0.01)   // upper-corner drop
                + 0.02 * tanh((x - 0.98) / 0.01);
    return Math.max(2.0, Math.min(3.7, plateau));
  }
  // NMC (solid solution): smoother S-curve from ~4.2 V → ~3.4 V.
  function ocvNMC(x) {
    x = Math.max(0.001, Math.min(0.999, x));
    return 4.25
           - 1.1 * x
           - 0.1 * tanh((x - 0.55) / 0.08)
           - 0.05 * tanh((x - 0.78) / 0.05);
  }
  function tanh(x) {
    if (x > 20) return 1; if (x < -20) return -1;
    var e1 = Math.exp(x), e2 = Math.exp(-x);
    return (e1 - e2) / (e1 + e2);
  }

  // Cell OCV = cathode OCV(1-x) minus graphite OCV(x), schematically.
  function ocvCell(x, chem) {
    var cath = chem === 'LFP' ? ocvLFP(1 - x) : ocvNMC(1 - x);
    return cath - ocvGraphite(x);
  }

  // ─────────────────────────────────────────── Butler–Volmer ──
  // i = i0 * [ exp(alpha F η / RT) − exp(−(1−alpha) F η / RT) ]
  function butlerVolmer(eta, i0, alpha, T) {
    T = T || T_ROOM;
    var vT = R * T / F;
    var a1 = alpha * eta / vT;
    var a2 = -(1 - alpha) * eta / vT;
    return i0 * (Math.exp(a1) - Math.exp(a2));
  }
  // Tafel limit (|η| large): |η| = a + b log|i|, with slope b = ±RT/(αF)·ln10.
  function tafel(eta, i0, alpha, sign, T) {
    T = T || T_ROOM;
    var vT = R * T / F;
    if (sign > 0) return i0 * Math.exp(alpha * eta / vT);
    return -i0 * Math.exp(-(1 - alpha) * eta / vT);
  }
  // Invert BV: solve for η given current i (Newton; BV is monotonic in η).
  function bvInvert(i, i0, alpha, T) {
    T = T || T_ROOM;
    if (Math.abs(i) < 1e-12) return 0;
    var eta = (R * T / F) * Math.log(Math.abs(i) / i0 + 1) * Math.sign(i);
    for (var k = 0; k < 40; k++) {
      var f = butlerVolmer(eta, i0, alpha, T) - i;
      var df = (butlerVolmer(eta + 1e-5, i0, alpha, T)
              - butlerVolmer(eta - 1e-5, i0, alpha, T)) / 2e-5;
      var d = f / df;
      eta -= d;
      if (Math.abs(d) < 1e-8) break;
    }
    return eta;
  }

  // ─────────────────────────────────────────── sphere diffusion ──
  // 1-D radial Fickian diffusion in a sphere with flux boundary at r=R.
  //   ∂c/∂t = D/r² · ∂/∂r(r² ∂c/∂r)
  // Discretised on a uniform radial grid with finite volumes; Neumann at r=0,
  // flux j_n (mol/m²/s, positive = out) at r=R.
  //
  // State: Float64Array of length N (cell-centred). Indices 0..N-1 from centre.
  function makeSphere(N, R_particle, D, c0) {
    var c = new Float64Array(N); for (var i = 0; i < N; i++) c[i] = c0;
    var dr = R_particle / N;
    // Cell centres r_i, cell faces r_{i+1/2}
    var r = new Float64Array(N), rf = new Float64Array(N + 1);
    for (var i = 0; i < N; i++) r[i] = (i + 0.5) * dr;
    for (var i = 0; i <= N; i++) rf[i] = i * dr;
    var Vcell = new Float64Array(N), Aface = new Float64Array(N + 1);
    for (var i = 0; i < N; i++) Vcell[i] = (4/3) * Math.PI * (rf[i+1]**3 - rf[i]**3);
    for (var i = 0; i <= N; i++) Aface[i] = 4 * Math.PI * rf[i] * rf[i];
    return {
      N: N, R: R_particle, D: D, c: c, r: r, rf: rf, dr: dr,
      Vcell: Vcell, Aface: Aface, cMax: 1.0,
      step: function (dt, jSurface) {
        var flux = new Float64Array(N + 1);
        // Neumann at centre (flux[0] = 0)
        for (var i = 1; i < N; i++) {
          // gradient at face i between cells i-1 and i
          flux[i] = -this.D * (this.c[i] - this.c[i-1]) / this.dr * this.Aface[i];
        }
        // Surface: flux leaving cell N-1 to outside is jSurface * Aface[N]
        flux[N] = jSurface * this.Aface[N];
        var next = new Float64Array(N);
        for (var i = 0; i < N; i++) {
          next[i] = this.c[i] - dt * (flux[i+1] - flux[i]) / this.Vcell[i];
        }
        this.c = next;
      },
      avg: function () {
        var s = 0, V = 0;
        for (var i = 0; i < this.N; i++) { s += this.c[i] * this.Vcell[i]; V += this.Vcell[i]; }
        return s / V;
      },
      surface: function () { return this.c[this.N - 1]; }
    };
  }

  // Closed-form series solution of diffusion into a sphere with constant
  // surface flux (for GITT-style inspection). c(r,t) given in normalised
  // units where tau = D t / R².
  function sphereSeries(r, R_particle, D, t, jSurf, c0) {
    // Shorter series: use first M terms of Carslaw–Jaeger.
    var tau = D * t / (R_particle * R_particle);
    var rho = r / R_particle;
    var s = 0;
    for (var n = 1; n < 40; n++) {
      var np = n * Math.PI;
      s += (2 * Math.pow(-1, n) / (np * np)) * Math.sin(np * rho) / rho
           * Math.exp(-np * np * tau);
    }
    return c0 + (jSurf * R_particle / D) * (3 * tau + 0.5 * (rho*rho - 0.2) - s);
  }

  // ─────────────────────────────────────────── staging model ──
  // Minimal intercalation staging: lattice-gas on a 1-D sequence of gallery
  // sites; nearest-neighbour attractive interactions within a stage favour
  // filling one gallery fully before opening the next (the "staging" phase
  // transition that produces voltage plateaus).
  //
  // Returns a state map for visualisation: array of galleries, each an array
  // of site occupancies (0 or 1).
  function stagingConfig(x, nGalleries, sitesPerGallery) {
    // Compute stage number: at filling fraction x, stage n has every n-th
    // gallery filled. Order: empty → stage 4 → stage 3 → stage 2 → stage 1.
    var totalSites = nGalleries * sitesPerGallery;
    var filled = Math.round(x * totalSites);
    var galleries = [];
    for (var g = 0; g < nGalleries; g++) galleries.push(new Array(sitesPerGallery).fill(0));
    // Determine active stage from x
    var stage;
    if (x < 0.03) stage = 0;
    else if (x < 0.18) stage = 4;
    else if (x < 0.33) stage = 3;
    else if (x < 0.55) stage = 2;
    else stage = 1;
    // Active galleries = galleries 0, stage, 2*stage, ... (1-indexed mod)
    var active = [];
    if (stage === 0) {
      // sparse
      var want = filled;
      for (var g = 0; g < nGalleries && want > 0; g++) {
        galleries[g][0] = 1; want--;
      }
      return { galleries: galleries, stage: '∅' };
    }
    for (var g = 0; g < nGalleries; g += stage) active.push(g);
    // Fill active galleries first, then distribute remainder uniformly to
    // transitioning galleries
    var sitesInActive = active.length * sitesPerGallery;
    var perGalleryFrac = Math.min(1, filled / sitesInActive);
    active.forEach(function (g) {
      var want = Math.round(perGalleryFrac * sitesPerGallery);
      for (var i = 0; i < want; i++) galleries[g][i] = 1;
    });
    var used = active.length * Math.round(perGalleryFrac * sitesPerGallery);
    var remaining = filled - used;
    if (remaining > 0 && stage > 1) {
      // Begin populating the next-stage galleries (interleaves emerge)
      for (var g = Math.floor(stage / 2); g < nGalleries && remaining > 0; g += stage) {
        for (var i = 0; i < sitesPerGallery && remaining > 0; i++) {
          if (galleries[g][i] === 0) { galleries[g][i] = 1; remaining--; }
        }
      }
    }
    return { galleries: galleries, stage: stage };
  }

  // ─────────────────────────────────────────── impedance ──
  // Randles circuit: R_s + (R_ct || (Q_dl)) + W   (W = Warburg diffusional tail)
  // Returns Z(ω) = Z' − j Z'' (Nyquist convention: positive Z'' plotted up)
  function randlesZ(omega, Rs, Rct, Cdl, sigmaW, phiCPE) {
    // CPE: Z_CPE = 1 / (Y0 * (jω)^phi). Use phi = phiCPE ∈ [0.7, 1]; phi=1 → capacitor.
    phiCPE = phiCPE == null ? 1.0 : phiCPE;
    var Y0 = Cdl; // approximate
    var phi = phiCPE;
    // (jω)^phi = ω^phi · (cos(phi π/2) + j sin(phi π/2))
    var wp = Math.pow(omega, phi);
    var cosp = Math.cos(phi * Math.PI / 2), sinp = Math.sin(phi * Math.PI / 2);
    var Z_CPE_re = cosp / (Y0 * wp) / (cosp*cosp + sinp*sinp);
    var Z_CPE_im = -sinp / (Y0 * wp) / (cosp*cosp + sinp*sinp);
    // Parallel (R_ct, Z_CPE)
    var Yct_re = 1 / Rct, Yct_im = 0;
    var Ycpe_re = 1 / ((Z_CPE_re*Z_CPE_re + Z_CPE_im*Z_CPE_im)) * Z_CPE_re;
    var Ycpe_im = -1 / ((Z_CPE_re*Z_CPE_re + Z_CPE_im*Z_CPE_im)) * Z_CPE_im;
    var Yp_re = Yct_re + Ycpe_re, Yp_im = Yct_im + Ycpe_im;
    var magY = Yp_re*Yp_re + Yp_im*Yp_im;
    var Zp_re = Yp_re / magY, Zp_im = -Yp_im / magY;
    // Warburg: σ/√ω · (1 − j)
    var Zw_re = sigmaW / Math.sqrt(omega);
    var Zw_im = -sigmaW / Math.sqrt(omega);
    var Z_re = Rs + Zp_re + Zw_re;
    var Z_im = Zp_im + Zw_im;
    return { re: Z_re, im: Z_im };
  }

  // ─────────────────────────────────────────── dendrite DLA ──
  // Diffusion-limited aggregation in a rectangular box. Seed along the bottom
  // row (anode); random walkers enter from the top. Deposit onto cluster when
  // adjacent to a cluster cell. Returns a grid (Uint8Array) and a timeline.
  function makeDLA(W, H, seedCount) {
    var grid = new Uint8Array(W * H);
    seedCount = seedCount || 3;
    for (var s = 0; s < seedCount; s++) {
      var x = Math.floor((s + 0.5) * W / seedCount);
      grid[(H - 1) * W + x] = 1;
    }
    return {
      W: W, H: H, grid: grid, frontier: (H - 2),
      stickiness: 1.0, bias: 0.0, // bias > 0 pulls walkers down (field)
      walk: function (maxSteps) {
        var x = Math.floor(Math.random() * this.W);
        var y = 0;
        for (var step = 0; step < maxSteps; step++) {
          // Check neighbours for cluster
          if (this.grid[y * this.W + x]) return false;
          if (y > 0 && this.grid[(y - 1) * this.W + x]) { this.deposit(x, y); return true; }
          if (y < this.H - 1 && this.grid[(y + 1) * this.W + x]) { this.deposit(x, y); return true; }
          if (x > 0 && this.grid[y * this.W + (x - 1)]) { this.deposit(x, y); return true; }
          if (x < this.W - 1 && this.grid[y * this.W + (x + 1)]) { this.deposit(x, y); return true; }
          // Random walk step
          var r = Math.random();
          if (r < 0.25 - this.bias / 2) y = Math.max(0, y - 1);
          else if (r < 0.5 + this.bias / 2) y = Math.min(this.H - 1, y + 1);
          else if (r < 0.75) x = (x + 1) % this.W;
          else x = (x - 1 + this.W) % this.W;
        }
        return false;
      },
      deposit: function (x, y) {
        if (Math.random() > this.stickiness) return;
        this.grid[y * this.W + x] = 1;
        this.frontier = Math.min(this.frontier, y);
      },
      height: function () {
        for (var y = 0; y < this.H; y++) {
          for (var x = 0; x < this.W; x++) if (this.grid[y * this.W + x]) return this.H - 1 - y;
        }
        return 0;
      }
    };
  }

  // ─────────────────────────────────────────── OCV derivatives ──
  // dV/dx via central difference; small h because OCV is piecewise-smooth.
  function ocvDerivative(fn) {
    return function (x) {
      var h = 0.002;
      var a = Math.max(0.001, Math.min(0.999, x - h));
      var b = Math.max(0.001, Math.min(0.999, x + h));
      return (fn(b) - fn(a)) / (b - a);
    };
  }
  var dVdxGraphite = ocvDerivative(ocvGraphite);
  var dVdxLFP = ocvDerivative(ocvLFP);
  var dVdxNMC = ocvDerivative(ocvNMC);
  // dQ/dV is the reciprocal of dV/dx (with unit conversion: Q ∝ x, so
  // dQ/dV = (dx/dV) · Q_max = 1 / (dV/dx)). Peaks in dQ/dV at plateaus.
  function dQdVFactory(fn, qMax) {
    qMax = qMax || 1;
    var dVdx = ocvDerivative(fn);
    return function (x) {
      var s = dVdx(x);
      if (Math.abs(s) < 1e-6) s = Math.sign(s || 1) * 1e-6;
      return qMax / s;
    };
  }

  // ─────────────────────────────────────────── aging ──
  // SEI layer thickness grows as √(k(T) · t) — diffusion-limited growth
  // of the layer through itself. Arrhenius in T.
  //   k(T) = k_ref · exp( -Ea/R · (1/T - 1/T_ref) )
  // Defaults chosen so that at 25°C, 80% SOC storage: ~20 nm / year.
  var SEI_K_REF = 2e-20;   // m²/s at T_ref, SOC_ref
  var SEI_EA = 50000;      // J/mol  (activation energy ~0.5 eV)
  var SEI_T_REF = 298.15;
  var SEI_SOC_REF = 0.8;
  function seiRate(T, SOC) {
    T = T || T_ROOM; SOC = SOC == null ? SEI_SOC_REF : SOC;
    var arr = Math.exp(-SEI_EA / R * (1 / T - 1 / SEI_T_REF));
    // SOC dependence: higher SOC = higher driving force for electrolyte reduction.
    // Empirical exp(β·(SOC-SOC_ref)) with β ≈ 4.
    var socFactor = Math.exp(4 * (SOC - SEI_SOC_REF));
    return SEI_K_REF * arr * socFactor;
  }
  // SEI thickness (m) after time t (s) at temperature T, mean SOC.
  function seiThickness(t, T, SOC) {
    return Math.sqrt(seiRate(T, SOC) * Math.max(0, t));
  }
  // Calendar-aging capacity fade (fraction of initial Q lost). Proportional
  // to SEI thickness — each added layer consumes one layer of active lithium.
  //   Q_loss_cal = α · √t  with α set so ~3%/yr at 25°C, 50% SOC.
  function capacityFadeCalendar(t, T, SOC) {
    var thickness = seiThickness(t, T, SOC);
    var ALPHA = 1.5e6;  // m → fraction (tuned: 20 nm ≈ 0.03)
    return thickness * ALPHA;
  }
  // Cycle-aging capacity fade (fraction lost per cycle, integrated over N).
  // Simple power law: β · N^0.7, with β scaled by DOD and T.
  function capacityFadeCycle(N, DOD, T) {
    DOD = DOD == null ? 0.8 : DOD; T = T || T_ROOM;
    var beta = 1.5e-4;  // per cycle at 80% DOD, 25°C
    var dodFactor = Math.pow(DOD / 0.8, 1.5);
    var tFactor = Math.exp(SEI_EA / R * (1 / SEI_T_REF - 1 / T));
    return beta * dodFactor * tFactor * Math.pow(Math.max(1, N), 0.7);
  }
  // Resistance rise: SEI layer adds a series R proportional to its thickness.
  // Use R_ref such that 20 nm ≈ +10 mΩ·cm².
  function resistanceRise(t, T, SOC) {
    var thickness = seiThickness(t, T, SOC);
    return thickness * 5e5;  // Ω·m² per m SEI → Ω·m² result
  }
  // Integrated duty-cycle model: given a usage profile (avg SOC, avg T,
  // cycles/year, DOD), return fade curves over calendar years.
  function dutyCycleFade(profile, years) {
    years = years || 5;
    var pts = [];
    for (var yr = 0; yr <= years * 12; yr++) {
      var t = yr * (365.25 / 12) * 86400;  // seconds
      var cycles = profile.cyclesPerYear * (yr / 12);
      var cal = capacityFadeCalendar(t, profile.T, profile.SOC);
      var cyc = capacityFadeCycle(cycles, profile.DOD, profile.T);
      pts.push({
        t: t, yearFrac: yr / 12,
        calendar: cal, cycle: cyc,
        total: Math.min(1, cal + cyc),
        thickness: seiThickness(t, profile.T, profile.SOC)
      });
    }
    return pts;
  }

  // ─────────────────────────────────────────── scale presets ──
  // Six canonical systems that thread through the applied articles. Each carries
  // chemistry defaults, pack topology, cooling, BMS sophistication, and the
  // plausible safe operating envelope.
  var SYSTEMS = {
    flashlight: {
      key: 'flashlight', label: 'Flashlight', cell: 'AA',
      nS: 4, nP: 1, cellV: 1.5, cellQ: 2.0,
      chemistry: 'alkaline',
      typCurrent: 0.2, peakCurrent: 1.0,
      cooling: 'none', bms: 'none',
      safeT: { min: -10, max: 50 }, safeV: { min: 0.9, max: 1.6 },
      safeI: { min: -2, max: 2 },
      Rspread: 0.20, Qspread: 0.15
    },
    drill: {
      key: 'drill', label: 'Power drill', cell: '18650',
      nS: 5, nP: 2, cellV: 3.7, cellQ: 2.5,
      chemistry: 'NMC',
      typCurrent: 10, peakCurrent: 40,
      cooling: 'air', bms: 'basic',
      safeT: { min: 0, max: 60 }, safeV: { min: 2.7, max: 4.2 },
      safeI: { min: -50, max: 50 },
      Rspread: 0.12, Qspread: 0.06
    },
    ebike: {
      key: 'ebike', label: 'E-bike', cell: '18650',
      nS: 13, nP: 5, cellV: 3.7, cellQ: 2.9,
      chemistry: 'NMC',
      typCurrent: 8, peakCurrent: 25,
      cooling: 'air-separator', bms: 'midrange',
      safeT: { min: -10, max: 55 }, safeV: { min: 2.8, max: 4.2 },
      safeI: { min: -25, max: 25 },
      Rspread: 0.08, Qspread: 0.04
    },
    home: {
      key: 'home', label: 'Home battery', cell: 'prismatic LFP',
      nS: 16, nP: 40, cellV: 3.2, cellQ: 50,
      chemistry: 'LFP',
      typCurrent: 30, peakCurrent: 100,
      cooling: 'plate-air', bms: 'high',
      safeT: { min: 0, max: 50 }, safeV: { min: 2.5, max: 3.65 },
      safeI: { min: -100, max: 100 },
      Rspread: 0.05, Qspread: 0.03
    },
    ev: {
      key: 'ev', label: 'Electric vehicle', cell: '21700',
      nS: 96, nP: 74, cellV: 3.7, cellQ: 5.0,
      chemistry: 'NMC',
      typCurrent: 150, peakCurrent: 600,
      cooling: 'liquid-plate', bms: 'high-sophisticated',
      safeT: { min: -20, max: 55 }, safeV: { min: 2.7, max: 4.2 },
      safeI: { min: -600, max: 600 },
      Rspread: 0.03, Qspread: 0.02
    },
    grid: {
      key: 'grid', label: 'Grid storage', cell: 'prismatic LFP',
      nS: 416, nP: 120, cellV: 3.2, cellQ: 280,
      chemistry: 'LFP',
      typCurrent: 800, peakCurrent: 2000,
      cooling: 'immersion', bms: 'cluster',
      safeT: { min: 0, max: 45 }, safeV: { min: 2.5, max: 3.65 },
      safeI: { min: -2000, max: 2000 },
      Rspread: 0.02, Qspread: 0.015
    }
  };
  function systemPack(key) {
    var s = SYSTEMS[key];
    if (!s) return null;
    return {
      nS: s.nS, nP: s.nP,
      packV: s.nS * s.cellV,
      packQ: s.nP * s.cellQ,
      packE: s.nS * s.nP * s.cellV * s.cellQ,   // Wh
      cellCount: s.nS * s.nP,
      system: s
    };
  }

  // ─────────────────────────────────────────── pack ──
  // Simple drift monte-carlo: generate cells with capacity / resistance noise
  // drawn from the system's spread, then run N cycles. Each cycle consumes a
  // constant charge from each parallel string; weakest cell in each series
  // branch sets the termination voltage. Returns per-cell terminal-voltage
  // history to visualise fan-out.
  function packDrift(systemKey, nCycles, seed) {
    var sys = SYSTEMS[systemKey]; if (!sys) return null;
    var rng = (function (s) { return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })(seed || 17);
    // Cap simulated cells at a visualisation-friendly count; report scale factor.
    var visN = Math.min(sys.nS * sys.nP, 120);
    var scaleFactor = (sys.nS * sys.nP) / visN;
    var cells = [];
    for (var i = 0; i < visN; i++) {
      cells.push({
        R: 1 + sys.Rspread * (rng() - 0.5) * 2,     // relative R multiplier
        Qmax: 1 + sys.Qspread * (rng() - 0.5) * 2,  // relative capacity
        Qused: 0,
        Vhist: []
      });
    }
    for (var c = 0; c < nCycles; c++) {
      var avgPull = 0.85 + 0.10 * (rng() - 0.5);  // DOD per cycle
      cells.forEach(function (cell) {
        cell.Qused += avgPull / cell.Qmax;
        // Terminal V after this cycle, simple OCV + R drop approximation.
        var soc = Math.max(0, 1 - (cell.Qused % 1));
        var fade = 1 - 0.0003 * c * cell.R;
        var v = sys.cellV * (0.85 + 0.15 * soc) * fade;
        cell.Vhist.push(v);
      });
    }
    return { cells: cells, scaleFactor: scaleFactor, nCycles: nCycles, system: sys };
  }
  // Thermal runaway toy model. Grid of cells, one triggered; heat diffuses
  // into neighbours; cell ignites when its temperature crosses T_trigger.
  // Cooling removes heat at a topology-specific rate.
  function thermalSpread(systemKey, triggerIdx, steps) {
    var sys = SYSTEMS[systemKey]; if (!sys) return null;
    var W = Math.min(12, sys.nS);
    var H = Math.min(10, sys.nP);
    var N = W * H;
    var T = new Float64Array(N); for (var i = 0; i < N; i++) T[i] = 25;
    var ignited = new Uint8Array(N);
    var T_TRIGGER = 150;
    var Q_RELEASE = 250;  // °C equivalent per step when burning
    var coolingK = { 'none': 0.002, 'air': 0.015, 'air-separator': 0.03,
                     'plate-air': 0.06, 'liquid-plate': 0.14, 'immersion': 0.28 };
    var kCool = coolingK[sys.cooling] || 0.02;
    var kConduct = 0.25;  // cell-to-cell conduction
    if (triggerIdx == null) triggerIdx = Math.floor(N / 2);
    ignited[triggerIdx] = 1; T[triggerIdx] = 200;
    var history = [];
    for (var s = 0; s < steps; s++) {
      var Tnext = new Float64Array(N);
      for (var idx = 0; idx < N; idx++) {
        var x = idx % W, y = Math.floor(idx / W);
        var nbSum = 0, nbCount = 0;
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(function (d) {
          var nx = x + d[0], ny = y + d[1];
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            nbSum += T[ny * W + nx]; nbCount++;
          }
        });
        var nbAvg = nbCount ? nbSum / nbCount : T[idx];
        var dT = kConduct * (nbAvg - T[idx]) - kCool * (T[idx] - 25);
        if (ignited[idx]) dT += Q_RELEASE / 8;
        Tnext[idx] = T[idx] + dT;
        if (!ignited[idx] && Tnext[idx] > T_TRIGGER) ignited[idx] = 1;
      }
      T = Tnext;
      history.push({ T: new Float64Array(T), ignited: new Uint8Array(ignited) });
    }
    return { W: W, H: H, history: history, system: sys };
  }

  // ─────────────────────────────────────────── bms ──
  // Simple blended SoC estimator. Three strategies:
  //   'voltage'  — invert OCV(x) from the (noisy) terminal voltage directly.
  //   'coulomb'  — integrate current to update SoC from a starting guess.
  //   'blend'    — weighted average that trusts voltage when dV/dx is large
  //                (i.e. away from flat LFP plateaus) and coulomb otherwise.
  // Returns per-step {socTrue, socEst, strategy, weight} arrays.
  function socEstimate(strategy, systemKey, stepMinutes) {
    var sys = SYSTEMS[systemKey]; if (!sys) return null;
    stepMinutes = stepMinutes || 120;
    var chem = sys.chemistry === 'LFP' ? 'LFP' : 'NMC';
    var ocvFn = chem === 'LFP' ? ocvLFP : ocvNMC;
    var dVdxFn = chem === 'LFP' ? dVdxLFP : dVdxNMC;
    var pts = [];
    // Simulate a slow discharge from SOC 0.95 → 0.1 over stepMinutes
    var soc = 0.95;
    var socCoulomb = 0.92;  // starting guess is slightly wrong
    var socEst;
    for (var k = 0; k <= stepMinutes; k++) {
      soc = 0.95 - 0.85 * (k / stepMinutes);
      var vTrue = ocvFn(1 - soc);
      var vNoise = vTrue + (Math.random() - 0.5) * 0.006;  // ±3 mV sensor noise
      // Voltage-only estimate: invert by table lookup on a finer grid.
      var vSoc = invertOcv(chem, vNoise);
      // Coulomb estimate: integrate a (noisy) current
      var iNoise = 1 + (Math.random() - 0.5) * 0.02;
      socCoulomb -= 0.85 / stepMinutes * iNoise;
      // Weight for blending
      var dv = Math.abs(dVdxFn(1 - soc));
      var wVolt = Math.min(1, dv / 0.5);  // confidence in voltage
      if (strategy === 'voltage') socEst = vSoc;
      else if (strategy === 'coulomb') socEst = socCoulomb;
      else socEst = wVolt * vSoc + (1 - wVolt) * socCoulomb;
      pts.push({ t: k, socTrue: soc, socEst: socEst, wVolt: wVolt, vTrue: vTrue, vNoise: vNoise, socCoulomb: socCoulomb, socVolt: vSoc });
    }
    return pts;
  }
  // Invert ocv(1-soc) numerically; chem ∈ {LFP, NMC}.
  function invertOcv(chem, v) {
    var fn = chem === 'LFP' ? ocvLFP : ocvNMC;
    var lo = 0.001, hi = 0.999;
    for (var k = 0; k < 50; k++) {
      var mid = (lo + hi) / 2;
      var vm = fn(mid);
      if (vm < v) hi = mid; else lo = mid;
    }
    return 1 - (lo + hi) / 2;
  }

  // Balancing simulation. Mode ∈ {'passive', 'active'}. Passive shunts the
  // highest cell's top-of-charge excess through a bleeder resistor (hours).
  // Active transfers charge between cells via a flyback / capacitor network
  // (minutes). Returns history of per-cell SoC.
  function balanceSim(mode, systemKey, minutes) {
    var sys = SYSTEMS[systemKey]; if (!sys) return null;
    var n = Math.min(12, sys.nS);
    var cells = [];
    for (var i = 0; i < n; i++) {
      cells.push(0.80 + 0.12 * (Math.sin(i * 1.3) + 1) / 2 + 0.05 * (Math.random() - 0.5));
    }
    var history = [cells.slice()];
    var rate = mode === 'active' ? 0.12 / 60 : 0.015 / 60;  // per minute
    for (var t = 1; t <= minutes; t++) {
      var mean = cells.reduce(function (a, b) { return a + b; }, 0) / n;
      for (var i = 0; i < n; i++) {
        if (mode === 'passive') {
          // Only shunt above the target
          if (cells[i] > mean) cells[i] -= rate * (cells[i] - mean);
        } else {
          // Active: transfer toward mean symmetrically
          cells[i] -= rate * (cells[i] - mean);
        }
      }
      history.push(cells.slice());
    }
    return { history: history, n: n, mode: mode };
  }

  // Safe zone classifier. Returns {state, reasons} for a (V, I, T) point.
  function safeZone(systemKey, V, I, T_C) {
    var sys = SYSTEMS[systemKey]; if (!sys) return null;
    var r = [];
    var state = 'safe';
    function flag(s, msg) { if (severity(s) > severity(state)) state = s; r.push(msg); }
    function severity(s) { return { safe: 0, warn: 1, fault: 2, hard: 3 }[s] || 0; }
    if (V < sys.safeV.min) flag('fault', 'V below ' + sys.safeV.min + ' V');
    else if (V > sys.safeV.max) flag('fault', 'V above ' + sys.safeV.max + ' V');
    else if (V > sys.safeV.max - 0.05) flag('warn', 'near upper V limit');
    if (T_C < sys.safeT.min) flag('fault', 'T below ' + sys.safeT.min + ' °C');
    else if (T_C > sys.safeT.max) flag('fault', 'T above ' + sys.safeT.max + ' °C');
    else if (T_C > sys.safeT.max - 5) flag('warn', 'near upper T limit');
    if (Math.abs(I) > Math.abs(sys.safeI.max)) flag('hard', '|I| exceeds ' + Math.abs(sys.safeI.max) + ' A');
    else if (Math.abs(I) > 0.85 * Math.abs(sys.safeI.max)) flag('warn', '|I| near limit');
    if (!r.length) r.push('within safe envelope');
    return { state: state, reasons: r };
  }

  // ─────────────────────────────────────────── formatting ──
  function sci(v, d) {
    d = d || 2;
    if (v === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(v)));
    var m = v / Math.pow(10, e);
    return m.toFixed(d) + '×10' + sup(e);
  }
  function sup(n) {
    var map = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
    var s = String(n).replace('-', '⁻');
    return s.split('').map(function (ch) {
      return /[0-9]/.test(ch) ? map[+ch] : ch;
    }).join('');
  }
  function mV(v) { return (v * 1000).toFixed(1) + ' mV'; }

  // ─────────────────────────────────────────── export ──
  global.Li = {
    const: { F: F, R: R, T: T_ROOM, RT_F: RT_F },
    ocv: {
      graphite: ocvGraphite, LFP: ocvLFP, NMC: ocvNMC, cell: ocvCell,
      dVdx: { graphite: dVdxGraphite, LFP: dVdxLFP, NMC: dVdxNMC },
      dQdV: {
        graphite: dQdVFactory(ocvGraphite),
        LFP: dQdVFactory(ocvLFP),
        NMC: dQdVFactory(ocvNMC)
      }
    },
    bv: { eval: butlerVolmer, tafel: tafel, invert: bvInvert },
    sphere: { make: makeSphere, series: sphereSeries },
    staging: { config: stagingConfig },
    eis: { randles: randlesZ },
    dla: { make: makeDLA },
    aging: {
      seiRate: seiRate,
      seiThickness: seiThickness,
      fadeCal: capacityFadeCalendar,
      fadeCyc: capacityFadeCycle,
      resistanceRise: resistanceRise,
      duty: dutyCycleFade
    },
    systems: SYSTEMS,
    pack: {
      of: systemPack,
      drift: packDrift,
      thermal: thermalSpread
    },
    bms: {
      soc: socEstimate,
      invertOcv: invertOcv,
      balance: balanceSim,
      safeZone: safeZone
    },
    fmt: { sci: sci, sup: sup, mV: mV }
  };
})(window);
