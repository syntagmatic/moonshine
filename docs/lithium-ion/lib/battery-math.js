// battery-math.js — shared electrochemistry for the lithium-ion series.
// Attaches a single `Li` object to window. No build step.
//
// Li.const       physical constants (F, R, T)
// Li.nernst      Nernst & thermodynamic voltages
// Li.ocv         OCV curves for graphite, LFP, NMC (smoothed empirical) + derivatives
// Li.bv          Butler–Volmer kinetics + Tafel
// Li.sphere      1-D spherical diffusion (explicit FD, Crank–Nicolson optional)
// Li.staging     idealised graphite stage sequence with lever-rule coexistence
// Li.eis         impedance of a Randles circuit (Warburg in the faradaic branch)
// Li.dla         diffusion-limited aggregation for dendrites
// Li.aging       SEI growth + calendar/cycle fade
// Li.cell        cell OCV against SOC over a fixed electrode window
// Li.charge      CCCV charging of one cell (OCV + lumped R)
// Li.string      series-string capacity with cell spread and balancing modes
// Li.bms         SOC estimation: coulomb counting, voltage lookup, 2-state EKF
// Li.thermal     runaway propagation in a lumped thermal network (Arrhenius)
// Li.fmt         number/axis formatting helpers
// Li.theme       dark-scheme colour mapping and phone-width figure sizing

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── constants ──
  var F = 96485.33212;      // C/mol
  var R = 8.31446;          // J/(mol·K)
  var T_ROOM = 298.15;      // K
  var RT_F = R * T_ROOM / F; // ≈ 0.02569 V  (thermal voltage)

  // ─────────────────────────────────────────── OCV curves ──
  // Graphite half-cell OCV vs x = Li content (x = 0 empty, x = 1 LiC6).
  // Published fit for the graphite(-SiOx) negative electrode of an LG M50
  // cell: Chen et al., J. Electrochem. Soc. 167, 080534 (2020). Plateaus
  // near 0.21 V, 0.13 V and 0.09 V are the staging two-phase regions.
  function ocvGraphite(x) {
    x = Math.max(0.001, Math.min(0.999, x));
    return 1.9793 * Math.exp(-39.3631 * x) + 0.2482
         - 0.0909 * tanh(29.8538 * (x - 0.1234))
         - 0.04478 * tanh(14.9159 * (x - 0.2769))
         - 0.0205 * tanh(30.4444 * (x - 0.6103));
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
  // Idealised Rüdorff-Hofmann staging drawn from the phase sequence, not
  // simulated. Pure stage n has every n-th gallery full, composition LiC_(6n),
  // so x = 1/n (stage 4: 0.25, stage 3: 1/3, stage 2: 0.5, stage 1: 1). A
  // dilute phase with lithium scattered through every gallery covers x < 0.04.
  // Between two pure phases the electrode is a two-phase mixture, and the
  // lever rule sets how much of each is present: fraction (x - xa)/(xb - xa)
  // of the lateral extent is drawn as the richer phase b (Daumas-Hérold
  // domains). The compositions are the textbook ideal; measured plateaus
  // (ocvGraphite above) sit at nearby but not identical x.
  //
  // Returns { galleries: [nGalleries][sitesPerGallery] of 0/1, stage: label }.
  var STAGE_PHASES = [
    { label: 'dilute', x: 0.04, n: 0 },
    { label: '4', x: 0.25, n: 4 },
    { label: '3', x: 1 / 3, n: 3 },
    { label: '2', x: 0.5, n: 2 },
    { label: '1', x: 1.0, n: 1 }
  ];
  function stagePattern(phase, g, s, nGalleries, x) {
    if (phase.n === 0) {
      // dilute: occupancy x spread evenly over every gallery
      return ((s * 7 + g * 3) % 25) < Math.round(x * 25) ? 1 : 0;
    }
    // stage n: galleries n-1, 2n-1, ... (counting from the bottom) are full
    return (g % phase.n) === phase.n - 1 ? 1 : 0;
  }
  function stagingConfig(x, nGalleries, sitesPerGallery) {
    x = Math.max(0, Math.min(1, x));
    var galleries = [];
    for (var g = 0; g < nGalleries; g++) galleries.push(new Array(sitesPerGallery).fill(0));
    var P = STAGE_PHASES;
    var a, b, f, label;
    if (x <= P[0].x) {
      for (var g1 = 0; g1 < nGalleries; g1++)
        for (var s1 = 0; s1 < sitesPerGallery; s1++)
          galleries[g1][s1] = stagePattern(P[0], g1, s1, nGalleries, x);
      return { galleries: galleries, stage: 'dilute', fraction: 0 };
    }
    for (var k = 0; k < P.length - 1; k++) {
      if (x <= P[k + 1].x) { a = P[k]; b = P[k + 1]; break; }
    }
    f = (x - a.x) / (b.x - a.x);             // lever rule: fraction of phase b
    var split = Math.round((1 - f) * sitesPerGallery);  // sites [0, split) are phase a
    for (var g2 = 0; g2 < nGalleries; g2++) {
      for (var s2 = 0; s2 < sitesPerGallery; s2++) {
        var ph = s2 < split ? a : b;
        galleries[g2][s2] = stagePattern(ph, g2, s2, nGalleries, a.x);
      }
    }
    if (f < 0.03) label = a.label;
    else if (f > 0.97) label = b.label;
    else label = a.label + ' + ' + b.label;
    return { galleries: galleries, stage: label, fraction: f };
  }

  // ─────────────────────────────────────────── impedance ──
  // Randles circuit: R_s + [ (R_ct + Z_W) || Z_CPE ].
  // The Warburg element sits in the faradaic branch, in series with R_ct,
  // because diffusion only limits the current that crosses the interface;
  // the double-layer current bypasses it. With an ideal capacitor (phi = 1)
  // the low-f tail extrapolates to R_s + R_ct - 2 sigma^2 C_dl on the real axis.
  // Returns Z(ω) = Z' + j Z'' (Z'' < 0 for capacitive behaviour; Nyquist plots −Z'').
  function randlesZ(omega, Rs, Rct, Cdl, sigmaW, phiCPE) {
    // CPE: Z_CPE = 1 / (Q (jω)^phi) with Q = Cdl; phi = 1 is a capacitor.
    var phi = phiCPE == null ? 1.0 : phiCPE;
    var Q = Cdl;
    // Admittance of the CPE: Q ω^phi (cos(phi π/2) + j sin(phi π/2))
    var wp = Math.pow(omega, phi);
    var Yc_re = Q * wp * Math.cos(phi * Math.PI / 2);
    var Yc_im = Q * wp * Math.sin(phi * Math.PI / 2);
    // Faradaic branch: R_ct + σ/√ω (1 − j)
    var zf_re = Rct + sigmaW / Math.sqrt(omega);
    var zf_im = -sigmaW / Math.sqrt(omega);
    var mf = zf_re * zf_re + zf_im * zf_im;
    var Yf_re = zf_re / mf, Yf_im = -zf_im / mf;
    var Y_re = Yf_re + Yc_re, Y_im = Yf_im + Yc_im;
    var mY = Y_re * Y_re + Y_im * Y_im;
    return { re: Rs + Y_re / mY, im: -Y_im / mY };
  }

  // ─────────────────────────────────────────── dendrite DLA ──
  // Diffusion-limited aggregation in a rectangular box. Seed along the bottom
  // row (anode); random walkers enter from the top. Deposit onto cluster when
  // adjacent to a cluster cell. Returns a grid (Uint8Array) and a timeline.
  // `rand` is an optional uniform [0,1) source (a seeded rng for a
  // reproducible growth); it defaults to Math.random.
  function makeDLA(W, H, seedCount, rand) {
    var grid = new Uint8Array(W * H);
    seedCount = seedCount || 3;
    for (var s = 0; s < seedCount; s++) {
      var x = Math.floor((s + 0.5) * W / seedCount);
      grid[(H - 1) * W + x] = 1;
    }
    return {
      W: W, H: H, grid: grid, frontier: (H - 2),
      stickiness: 1.0, bias: 0.0, // bias > 0 pulls walkers down (field)
      rand: rand || Math.random,
      walk: function (maxSteps) {
        var x = Math.floor(this.rand() * this.W);
        var y = 0;
        for (var step = 0; step < maxSteps; step++) {
          // Check neighbours for cluster
          if (this.grid[y * this.W + x]) return false;
          if (y > 0 && this.grid[(y - 1) * this.W + x]) { this.deposit(x, y); return true; }
          if (y < this.H - 1 && this.grid[(y + 1) * this.W + x]) { this.deposit(x, y); return true; }
          if (x > 0 && this.grid[y * this.W + (x - 1)]) { this.deposit(x, y); return true; }
          if (x < this.W - 1 && this.grid[y * this.W + (x + 1)]) { this.deposit(x, y); return true; }
          // Random walk step
          var r = this.rand();
          if (r < 0.25 - this.bias / 2) y = Math.max(0, y - 1);
          else if (r < 0.5 + this.bias / 2) y = Math.min(this.H - 1, y + 1);
          else if (r < 0.75) x = (x + 1) % this.W;
          else x = (x - 1 + this.W) % this.W;
        }
        return false;
      },
      deposit: function (x, y) {
        if (this.rand() > this.stickiness) return;
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
  // k_ref = (20 nm)² / 1 yr. It was 2e-20, which grew 790 nm in the first
  // year, ran off the 0-50 nm axis of Part 3's Figure 1 and pinned Figure 2's
  // calendar fade at its 30% clamp.
  var SEI_K_REF = 1.27e-23;   // m²/s at T_ref, SOC_ref
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

  // ─────────────────────────────────────────── cell window ──
  // A cell never uses an electrode's full range. Cell SOC 0..1 maps onto the
  // middle of the graphite range, x = 0.14..0.88, and the cathode takes 1 - x.
  // With the curves above this gives an NMC cell 2.9 V empty, 4.18 V full,
  // and an LFP cell sitting on its 3.1-3.3 V plateau for almost all of it.
  var X_EMPTY = 0.14, X_FULL = 0.895;
  function ocvSoc(soc, chem) {
    return ocvCell(X_EMPTY + (X_FULL - X_EMPTY) * soc, chem);
  }
  function dOcvdSoc(soc, chem) {
    var h = 0.002;
    return (ocvSoc(soc + h, chem) - ocvSoc(soc - h, chem)) / (2 * h);
  }

  // Seeded PRNG (mulberry32) and standard normal draws (Box-Muller).
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normal(r) {
    var u = 1 - r(), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // ─────────────────────────────────────────── CCCV charge ──
  // One cell, OCV(SOC) plus a lumped resistance R. Constant current at
  // cRate until the terminal voltage OCV + I R reaches vMax, then hold vMax:
  // I = (vMax - OCV) / R, which falls as OCV rises. Stop when I < cutoff.
  // Q in Ah, R in ohms. Returns samples and the SOC/time of the CC->CV switch.
  function cccv(opts) {
    var Q = opts.Q || 5, R = opts.R, c = opts.cRate, chem = opts.chem || 'NMC';
    var vMax = opts.vMax || 4.2, cutoff = (opts.cutoffC || 0.05) * Q;
    var soc = opts.soc0 == null ? 0 : opts.soc0;
    var dt = opts.dt || 2, t = 0, phase = 'CC', sw = null;
    var Icc = c * Q, out = [], I = 0, V = 0;
    for (var k = 0; k < 200000; k++) {
      var ocv = ocvSoc(soc, chem);
      if (phase === 'CC') {
        I = Icc; V = ocv + I * R;
        if (V >= vMax) { phase = 'CV'; sw = { t: t, soc: soc }; }
      }
      if (phase === 'CV') { I = Math.min(Icc, (vMax - ocv) / R); V = vMax; }
      if (k % 5 === 0) out.push({ t: t, soc: soc, I: I, V: V, phase: phase });
      if (phase === 'CV' && I < cutoff) break;
      soc += I * dt / (3600 * Q);
      t += dt;
    }
    out.push({ t: t, soc: soc, I: I, V: V, phase: phase });
    return { pts: out, sw: sw, tEnd: t, socEnd: soc };
  }

  // ─────────────────────────────────────────── series string ──
  // n cells in series share one current. Capacities are drawn with relative
  // spread sQ; starting charge offsets (SOC imbalance) with spread sS.
  // mode 'none'   : the string was charged until its fullest cell hit 100%,
  //                 so each cell sits below full by its offset.
  // mode 'top'    : passive top balancing has bled every cell to 100%.
  // mode 'active' : ideal lossless shuttling keeps every cell at one SOC.
  // Discharge stops when the first cell reaches 0%. Returns usable Ah.
  function drawString(n, sQ, sS, seed, Q0) {
    var r = rng(seed), cells = [];
    Q0 = Q0 || 5;
    for (var i = 0; i < n; i++) {
      var Q = Q0 * (1 + sQ * normal(r));
      var off = Q0 * sS * normal(r);
      cells.push({ Q: Q, off: off });
    }
    var maxOff = -Infinity;
    cells.forEach(function (c) { if (c.off > maxOff) maxOff = c.off; });
    // headroom below full at end of charge: the cell with the largest offset is full
    cells.forEach(function (c) { c.head = Math.min(c.Q, maxOff - c.off); });
    return cells;
  }
  function usable(cells, mode) {
    if (mode === 'active') {
      var s = 0; cells.forEach(function (c) { s += c.Q; }); return s / cells.length;
    }
    var m = Infinity;
    cells.forEach(function (c) { var q = c.Q - (mode === 'top' ? 0 : c.head); if (q < m) m = q; });
    return Math.max(0, m);
  }
  // Mean usable fraction of nominal over many random strings of length n.
  function usableMC(n, sQ, sS, mode, trials, seed, Q0) {
    Q0 = Q0 || 5;
    var acc = 0;
    for (var k = 0; k < trials; k++) acc += usable(drawString(n, sQ, sS, seed + 7919 * k, Q0), mode) / Q0;
    return acc / trials;
  }

  // ─────────────────────────────────────────── SOC estimation ──
  // Truth: one cell of Q Ah with series resistance R0 and one RC pair
  // (R1, tau) for polarisation, driven by a seeded drive profile.
  // Sensors: current with a constant bias plus noise (0.5% of 1C), voltage
  // with noise sigmaV. Three estimators see the same measurements:
  //   cc   : coulomb counting from the (wrong) starting guess
  //   v    : invert OCV(V + I R0) by bisection each sample (ignores the RC)
  //   ekf  : two-state extended Kalman filter, x = [SOC, v_RC], predicting
  //          with measured current and correcting with voltage through
  //          H = [dOCV/dSOC, -1] at the current estimate (Plett 2004 style).
  // The filter is handed the true OCV curve, R0, R1 and tau, which a real
  // BMS only has approximately. sd is the filter's own SOC standard deviation.
  function invertSoc(v, chem) {
    var lo = 0, hi = 1;
    for (var k = 0; k < 40; k++) {
      var mid = (lo + hi) / 2;
      if (ocvSoc(mid, chem) < v) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }
  function estimate(opts) {
    var chem = opts.chem || 'NMC', Q = opts.Q || 5;
    var R0 = opts.R0 || 0.015, R1 = opts.R1 || 0.015, tau = opts.tau || 60;
    var r = rng(opts.seed || 1);
    var bias = (opts.biasC || 0) * Q;           // A
    var sI = 0.005 * Q, sV = opts.sigmaV || 0.002;
    var dt = 1, a = Math.exp(-dt / tau);
    var soc = opts.soc0 || 0.95, v1 = 0;
    var cc = soc + (opts.initErr || 0);
    var x0 = cc, x1 = 0;                        // EKF state
    var P00 = 0.2 * 0.2, P01 = 0, P11 = 0.01 * 0.01;
    var q0 = Math.pow(0.02 * dt / 3600, 2);     // allows a current error of ~2% of 1C
    var q1 = Math.pow(0.0005, 2);
    var Rv = Math.pow(opts.sigmaModel || 0.004, 2);
    var out = [], I = 0, segLeft = 0, t = 0;
    while (soc > 0.05 && t < 6 * 3600) {
      if (segLeft <= 0) {
        var u = r();
        I = u < 0.15 ? 0 : (u < 0.25 ? -0.3 * Q * r() : Q * (0.2 + 1.2 * r()));
        segLeft = 60 + Math.floor(240 * r());
      }
      segLeft -= dt;
      // truth
      soc -= I * dt / (3600 * Q);
      v1 = a * v1 + R1 * (1 - a) * I;
      var V = ocvSoc(soc, chem) - v1 - I * R0 + sV * normal(r);
      var Im = I + bias + sI * normal(r);
      // coulomb counting and voltage lookup
      cc -= Im * dt / (3600 * Q);
      var vs = invertSoc(V + Im * R0, chem);
      // EKF predict: F = diag(1, a)
      x0 -= Im * dt / (3600 * Q);
      x1 = a * x1 + R1 * (1 - a) * Im;
      P00 += q0; P01 = a * P01; P11 = a * a * P11 + q1;
      // EKF update, H = [h0, -1]
      var xs = Math.max(0.001, Math.min(0.999, x0));
      var h0 = dOcvdSoc(xs, chem);
      var y = V - (ocvSoc(xs, chem) - x1 - Im * R0);
      var PH0 = P00 * h0 - P01, PH1 = P01 * h0 - P11;   // P H^T
      var S = h0 * PH0 - PH1 + Rv;
      var K0 = PH0 / S, K1 = PH1 / S;
      x0 += K0 * y; x1 += K1 * y;
      var n00 = P00 - K0 * PH0, n01 = P01 - K0 * PH1, n11 = P11 - K1 * PH1;
      P00 = n00; P01 = n01; P11 = n11;
      if (t % 10 === 0) out.push({ t: t, soc: soc, cc: cc, v: vs, ekf: x0, sd: Math.sqrt(Math.max(0, P00)), I: I });
      t += dt;
    }
    return out;
  }

  // ─────────────────────────────────────────── thermal propagation ──
  // A W x H module of cells as a lumped thermal network. Each cell has heat
  // capacity Cth (J/K), conductance G (W/K) to each of its four neighbours
  // and conductance h (W/K) to coolant at 25 C. Inside each cell a single
  // Arrhenius reaction releases a finite energy E (J): heat rate E k(T) c,
  // with c the unreacted fraction and k(T) = k0 exp(-Ea / RT). Ea = 151
  // kJ/mol and k0 are set so self-heating is about 0.02 K/min at 100 C and
  // about 10 K/s at 200 C for E = 30 kJ, Cth = 45 J/K (a 45 g cylinder).
  // There is no fixed trigger temperature: a cell runs away when its own
  // heat release outruns what the neighbours and coolant carry off
  // (Semenov's criterion). Venting and ejecta are not modelled.
  // The trigger cell starts at 200 C and is forced to react at a rate of at
  // least 0.5 /s, standing in for an internal short. dt = 0.25 s.
  var EA_R = 18200, K0 = 7.8e14;
  function thermal(opts) {
    var W = opts.W || 9, H = opts.H || 6, N = W * H;
    var Cth = opts.Cth || 45, G = opts.G, h = opts.h, E = opts.E;
    var Tc = 25, tEnd = opts.tEnd || 900, dt = 0.25, every = opts.every || 4;
    var T = new Float64Array(N).fill(Tc), c = new Float64Array(N).fill(1);
    var tRun = new Float64Array(N).fill(-1);
    var trig = opts.trigger == null ? Math.floor(H / 2) * W + Math.floor(W / 2) : opts.trigger;
    T[trig] = 200;
    var frames = [], peak = Tc, perFrame = Math.round(every / dt);
    for (var s = 0; s * dt <= tEnd; s++) {
      var t = s * dt;
      var dT = new Float64Array(N);
      for (var i = 0; i < N; i++) {
        var x = i % W, y = (i / W) | 0, q = -h * (T[i] - Tc);
        if (x > 0) q += G * (T[i - 1] - T[i]);
        if (x < W - 1) q += G * (T[i + 1] - T[i]);
        if (y > 0) q += G * (T[i - W] - T[i]);
        if (y < H - 1) q += G * (T[i + W] - T[i]);
        var k = K0 * Math.exp(-EA_R / (T[i] + 273.15));
        if (i === trig && k < 0.5) k = 0.5;
        var dc = c[i] * (1 - Math.exp(-k * dt));   // exact for one step
        c[i] -= dc;
        dT[i] = (q * dt + E * dc) / Cth;
      }
      for (var j = 0; j < N; j++) {
        T[j] += dT[j];
        if (T[j] > peak) peak = T[j];
        if (tRun[j] < 0 && c[j] < 0.5) tRun[j] = t;
      }
      if (s % perFrame === 0) frames.push({ t: t, T: Float64Array.from(T), c: Float64Array.from(c) });
    }
    var count = 0, last = 0;
    for (var m = 0; m < N; m++) if (tRun[m] >= 0) { count++; if (tRun[m] > last) last = tRun[m]; }
    return { W: W, H: H, frames: frames, tRun: tRun, count: count, last: last, peak: peak, trigger: trig };
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

  // ─────────────────────────────────────────── theme ──
  // Figure code and KaTeX strings are written with the light-theme hex
  // values. theme.c(hex) returns the dark-theme counterpart when the reader
  // prefers a dark scheme, so d3 always gets a resolved hex. The same pairs
  // appear in each page's dark :root block. A scheme change reloads the page,
  // since every figure bakes its colours in when it is built.
  var DARK = {
    // ink
    '#1a1a2e': '#e4e4ec', '#111': '#e4e4ec', '#111827': '#e4e4ec',
    '#0f172a': '#e4e4ec', '#1e293b': '#e4e4ec',
    '#4a4a6a': '#a9abbf', '#334155': '#cbd5e1', '#475569': '#94a3b8',
    '#64748b': '#9aa5b8',
    // surfaces and rules
    '#fff': '#1c1f26', '#ffffff': '#1c1f26', 'white': '#1c1f26',
    '#fafafa': '#14161b',
    '#f1f5f9': '#272b34', '#eef2f7': '#272b34', '#eef0f3': '#272b34',
    '#e2e2e8': '#353945', '#e2e8f0': '#353945',
    '#cbd5e1': '#4b5263', '#d4d4d8': '#4b5263', '#c0c0c0': '#5b6070',
    // tints
    '#dbeafe': '#1e3a5f', '#fee2e2': '#4a1f24', '#fef3c7': '#3d3212',
    '#fed7aa': '#4a2e14', '#ede9fe': '#312a55',
    // hues
    '#2563eb': '#60a5fa', '#1d4ed8': '#93c5fd', '#1e3a8a': '#bfdbfe',
    '#7c3aed': '#a78bfa', '#059669': '#34d399', '#0f766e': '#2dd4bf',
    '#0369a1': '#38bdf8', '#0891b2': '#22d3ee',
    '#d97706': '#f59e0b', '#b45309': '#fbbf24', '#92400e': '#fcd34d',
    '#ea580c': '#fb923c', '#dc2626': '#f87171',
    '#78350f': '#e3a969', '#5c2a0a': '#f0c08a', '#d6a36a': '#9a6a3a'
  };
  var darkMQ = global.matchMedia ? global.matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark() { return !!(darkMQ && darkMQ.matches); }
  // theme.c(hex, darkHex): pass darkHex when the colour's role needs a
  // different dark counterpart than the shared table gives.
  function themeColor(hex, darkHex) {
    if (!isDark()) return hex;
    if (typeof darkHex === 'string') return darkHex;
    var k = String(hex).toLowerCase();
    return DARK.hasOwnProperty(k) ? DARK[k] : hex;
  }
  function themeTex(s) {
    return isDark() ? s.replace(/#[0-9a-fA-F]{6}\b/g, function (h) { return themeColor(h); }) : s;
  }
  if (darkMQ && darkMQ.addEventListener) {
    darkMQ.addEventListener('change', function () { global.location.reload(); });
  }
  // Make a drag-cursor figure usable from the keyboard. The svg becomes a
  // focusable slider: arrows step, Shift+arrow steps 5x, Home/End jump.
  // opts: label, min, max, step, get() -> value, set(value), text(value).
  function keyCursor(svgNode, opts) {
    var el = svgNode.node ? svgNode.node() : svgNode;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', opts.label);
    el.setAttribute('aria-valuemin', opts.min);
    el.setAttribute('aria-valuemax', opts.max);
    function sync() {
      var v = opts.get();
      el.setAttribute('aria-valuenow', +v.toFixed(4));
      if (opts.text) el.setAttribute('aria-valuetext', opts.text(v));
    }
    el.addEventListener('keydown', function (e) {
      var v = opts.get(), s = opts.step * (e.shiftKey ? 5 : 1), nv = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') nv = v + s;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') nv = v - s;
      else if (e.key === 'Home') nv = opts.min;
      else if (e.key === 'End') nv = opts.max;
      if (nv === null) return;
      e.preventDefault();
      opts.set(Math.max(opts.min, Math.min(opts.max, nv)));
      sync();
    });
    sync();
    return sync;
  }
  // Width of a figure's drawing coordinates. On a phone the host is about
  // 340 px wide, so a 680-unit viewBox would shrink 10-unit labels to 5 px.
  // Below 560 px the figure is drawn in `narrow` units instead.
  function figW(host, wide, narrow) {
    var el = typeof host === 'string' ? document.querySelector(host) : host;
    var w = el ? el.getBoundingClientRect().width : wide;
    return w && w < 560 ? narrow : wide;
  }

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
    cell: { ocvSoc: ocvSoc, dOcvdSoc: dOcvdSoc, invertSoc: invertSoc },
    rand: { rng: rng, normal: normal },
    charge: { cccv: cccv },
    string: { draw: drawString, usable: usable, usableMC: usableMC },
    bms: { estimate: estimate },
    thermal: { run: thermal },
    fmt: { sci: sci, sup: sup, mV: mV },
    theme: { dark: isDark, c: themeColor, tex: themeTex, figW: figW, keyCursor: keyCursor }
  };
})(window);
