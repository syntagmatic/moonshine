// BioEssay04: the model code behind essay 04 (ChIP-seq Peaks).
//
// What it holds. A seeded ChIP-seq read simulator (fragments drawn over a region, with
// a shared local bias that the input control also sees), a toy peak caller in the spirit
// of MACS (Zhang et al. 2008, Genome Biol 9:R137): fragment pileup, a local Poisson rate
// lambda = max(lambda_BG, lambda_1k, lambda_5k, lambda_10k) from the control, an exact
// Poisson upper tail in log space, Benjamini-Hochberg over every bin, then runs of called
// bins with a summit at the bin of greatest pileup), a two-condition differential call
// over replicates, a counter of real ReMap TP53 peaks over a motif window, and the
// sequence-logo arithmetic (information content per column, a PWM score split by position).
// It knows nothing about the CDKN1A locus: the page passes real positions in from BioLocus.
//
// Works in the browser (window.BioEssay04) and in node (module.exports).
//
// API
//   mulberry32(seed)                    -> () => uniform [0, 1)
//   poissonScore(k, lambda)             -> -log10 P(X >= k), X ~ Poisson(lambda). Exact, summed
//                                          in log space from the k term outward, so it never
//                                          saturates (no clamp, no plateau).
//   bhScores(scores)                    -> Float64Array of -log10 q (Benjamini-Hochberg), given
//                                          -log10 p; computed in log space, floored at 0.
//   biasField(nBins, seed, opts)        -> Float64Array, mean about 1: smooth log-normal noise
//                                          (opts.sd, opts.knotBins) times opts.open bumps
//                                          [{bin, sdBins, fold}] (accessible chromatin, which
//                                          ChIP and input both over-sample).
//   simulateSample(o)                   -> {pileup, centers, total, binSize, start0, nBins}
//       o = {start0, end0, binSize, bias, perKb, sites:[{pos0, n}], fragMean, fragSd,
//            spread, seed}. Background fragment centres fall with density proportional
//            to bias; each site adds Poisson(n) fragments centred Normal(pos0, spread).
//            pileup[i] = fragments covering the centre of bin i; centers[i] = fragment
//            centres inside bin i.
//   localLambda(chip, input, o)         -> Float64Array of the MACS-style local rate per bin
//                                          (o.d fragment length, o.windows in bp).
//   scoreTrack(chip, input, o)          -> {p, q, lambda}: -log10 p and -log10 q per bin.
//   callPeaks(track, thresh, o)         -> [{startBin, endBin, start0, end0, length,
//                                          summitBin, summit0, height, maxQ}]
//       track = {q, pileup, binSize, start0}. Bins with q >= thresh; runs separated by at
//       most o.maxGapBins uncalled bins are joined; regions shorter than o.minLen bp are
//       dropped. Summit = the bin of greatest pileup (ties: greatest q, then the middle).
//   simulateLocus(o)                    -> {wt:[rep...], mut:[rep...], input, track(sample, rep),
//                                          setSites(sample, values)}: one bias for the region,
//                                          WT and mutant replicates at the same depth. o.sites
//                                          [{pos0, wt, mut}] carry expected fragment counts;
//                                          o.open [{pos0, sd, fold}] adds open-chromatin bumps.
//   windowCount(sample, pos0, half)     -> fragment centres within pos0 +- half
//   diffSite(sim, pos0, o)              -> {wtCalled, mutCalled, wtRep, mutRep (called per
//                                          replicate), wtCounts, mutCounts, inputCount,
//                                          wtAbove, mutAbove, lfc, verdict}: lfc is log2 of
//                                          (mutant + 1) / (WT + 1) fragments above input in
//                                          pos0 +- o.half; verdict rules beside VERDICTS.
//   remapSupport(data, start0, end0)    -> number of distinct ReMap experiments with a TP53
//                                          peak overlapping [start0, end0)
//   infoContent(pfm)                    -> {cols:[{n, freq:{A,C,G,T}, ic, smallSample, stack}],
//                                          total, maxSmallSample}. Sequence-logo information
//                                          content per column in bits against a uniform
//                                          background, 2 - H, from raw frequencies (no
//                                          pseudocount; Schneider and Stephens 1990).
//                                          smallSample is the correction e(n) = 3 / (2 ln2 n)
//                                          (Schneider et al. 1986), reported, not subtracted.
//                                          stack: letters bottom to top, height = freq * ic.
//   revcomp(s)                          -> reverse complement (A<->T, C<->G).
//   siteLoss(pwm, site)                 -> {pos:[{base, score, best, bestBase, loss}], score, max,
//                                          loss}: a PWM score taken apart by position. pwm has
//                                          cols [{A,C,G,T}] (log-odds, as BioLocus.pwm); site is
//                                          read in the matrix's orientation; loss = best - score.
//   runChecks(print, data)              -> [{name, ok, detail}]
(function (root) {
  "use strict";

  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rnd) {
    var u = 1 - rnd(), v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function poissonDraw(rnd, mean) {
    if (mean <= 0) return 0;
    if (mean > 60) return Math.max(0, Math.round(mean + Math.sqrt(mean) * gauss(rnd)));
    var L = Math.exp(-mean), k = 0, p = 1;
    do { k++; p *= rnd(); } while (p > L);
    return k - 1;
  }

  // ---------- statistics ----------
  var LF = [0];
  function logFact(n) {
    for (var i = LF.length; i <= n; i++) LF[i] = LF[i - 1] + Math.log(i);
    return LF[n];
  }
  // -log10 P(X >= k) for X ~ Poisson(lam), k a non-negative integer.
  function poissonScore(k, lam) {
    k = Math.round(k);
    if (k <= 0) return 0;
    if (!(lam > 0)) return Infinity;
    if (k > lam) {
      // P(X >= k) = pmf(k) * (1 + lam/(k+1) + lam^2/((k+1)(k+2)) + ...), every ratio < 1
      var lp = -lam + k * Math.log(lam) - logFact(k), s = 1, t = 1;
      for (var j = k + 1; j < k + 100000; j++) { t *= lam / j; s += t; if (t < 1e-17 * s) break; }
      return -(lp + Math.log(s)) / Math.LN10;
    }
    // k <= lam: the tail is at least about one half, so 1 - CDF(k - 1) loses nothing.
    var lp1 = -lam + (k - 1) * Math.log(lam) - logFact(k - 1), s2 = 1, t2 = 1;
    for (var i = k - 1; i > 0; i--) { t2 *= i / lam; s2 += t2; if (t2 < 1e-17 * s2) break; }
    var sf = 1 - Math.exp(lp1) * s2;
    return sf >= 1 ? 0 : -Math.log10(sf);
  }
  // BH in -log10 space: q_(i) = min over j >= i of p_(j) m / j.
  function bhScores(scores) {
    var m = scores.length, order = new Array(m), q = new Float64Array(m), i;
    for (i = 0; i < m; i++) order[i] = i;
    order.sort(function (a, b) { return scores[b] - scores[a] || a - b; });   // smallest p first
    var run = -Infinity, lm = Math.log10(m);
    for (var r = m - 1; r >= 0; r--) {
      var v = scores[order[r]] - (lm - Math.log10(r + 1));
      if (v > run) run = v;
      q[order[r]] = Math.max(0, run);
    }
    return q;
  }

  // ---------- simulation ----------
  function biasField(nBins, seed, opts) {
    opts = opts || {};
    var sd = opts.sd == null ? 0.25 : opts.sd, kb = opts.knotBins || 40, rnd = mulberry32(seed);
    var nk = Math.ceil(nBins / kb) + 2, knots = [], i;
    for (i = 0; i < nk; i++) knots.push(gauss(rnd) * sd);
    var out = new Float64Array(nBins);
    for (i = 0; i < nBins; i++) {
      var f = i / kb, k0 = Math.floor(f), t = f - k0, w = (1 - Math.cos(Math.PI * t)) / 2;
      var g = knots[k0] * (1 - w) + knots[k0 + 1] * w, fold = 1;
      (opts.open || []).forEach(function (o) { fold += (o.fold - 1) * Math.exp(-0.5 * Math.pow((i - o.bin) / o.sdBins, 2)); });
      out[i] = Math.exp(g - sd * sd / 2) * fold;
    }
    return out;
  }

  function simulateSample(o) {
    var rnd = mulberry32(o.seed), bs = o.binSize, len = o.end0 - o.start0, nBins = Math.round(len / bs);
    var bias = o.bias, cum = new Float64Array(nBins), tot = 0, i;
    for (i = 0; i < nBins; i++) { tot += bias[i]; cum[i] = tot; }
    var nBg = poissonDraw(rnd, o.perKb * len / 1000 * (tot / nBins));
    var diff = new Int32Array(len + 1), centers = new Int32Array(nBins), total = 0;
    function addFragment(c) {
      var flen = Math.max(80, Math.round(o.fragMean + o.fragSd * gauss(rnd)));
      var a = Math.round(c - flen / 2), b = a + flen;
      var ci = Math.floor(c / bs);
      if (ci >= 0 && ci < nBins) centers[ci]++;
      a = Math.max(0, a); b = Math.min(len, b);
      if (a < b) { diff[a]++; diff[b]--; }
      total++;
    }
    for (i = 0; i < nBg; i++) {
      var u = rnd() * tot, lo = 0, hi = nBins - 1;
      while (lo < hi) { var mid = (lo + hi) >> 1; if (cum[mid] < u) lo = mid + 1; else hi = mid; }
      addFragment((lo + rnd()) * bs);
    }
    (o.sites || []).forEach(function (s) {
      var n = poissonDraw(rnd, s.n);
      for (var j = 0; j < n; j++) addFragment(s.pos0 - o.start0 + o.spread * gauss(rnd));
    });
    var pileup = new Int32Array(nBins), run = 0, p = 0;
    for (i = 0; i < nBins; i++) {
      var c = Math.floor(i * bs + bs / 2);
      while (p <= c) { run += diff[p]; p++; }
      pileup[i] = run;
    }
    return { pileup: pileup, centers: centers, total: total, binSize: bs, start0: o.start0, nBins: nBins };
  }

  function localLambda(chip, input, o) {
    var d = o.d, wins = o.windows || [1000, 5000, 10000], n = chip.nBins, bs = chip.binSize;
    var pre = new Float64Array(n + 1), i;
    for (i = 0; i < n; i++) pre[i + 1] = pre[i] + input.centers[i];
    var scale = chip.total / input.total, bg = chip.total * d / (n * bs), lam = new Float64Array(n);
    for (i = 0; i < n; i++) {
      var l = bg;
      wins.forEach(function (w) {
        var h = Math.round(w / bs / 2), a = Math.max(0, i - h), b = Math.min(n, i + h);
        var v = (pre[b] - pre[a]) * d / ((b - a) * bs) * scale;
        if (v > l) l = v;
      });
      lam[i] = l;
    }
    return lam;
  }
  function scoreTrack(chip, input, o) {
    var lam = localLambda(chip, input, o), p = new Float64Array(chip.nBins);
    for (var i = 0; i < chip.nBins; i++) p[i] = poissonScore(chip.pileup[i], lam[i]);
    return { p: p, q: bhScores(p), lambda: lam };
  }

  function callPeaks(track, thresh, o) {
    o = o || {};
    var q = track.q, pu = track.pileup, bs = track.binSize, n = q.length;
    var minLen = o.minLen == null ? 0 : o.minLen, gap = o.maxGapBins == null ? 2 : o.maxGapBins;
    var runs = [], s = -1, i;
    for (i = 0; i <= n; i++) {
      var on = i < n && q[i] >= thresh;
      if (on && s < 0) s = i;
      if (!on && s >= 0) { runs.push([s, i - 1]); s = -1; }
    }
    var merged = [];
    runs.forEach(function (r) {
      var last = merged[merged.length - 1];
      if (last && r[0] - last[1] - 1 <= gap) last[1] = r[1]; else merged.push(r.slice());
    });
    var out = [];
    merged.forEach(function (r) {
      var length = (r[1] - r[0] + 1) * bs;
      if (length < minLen) return;
      var best = -1, bestQ = -Infinity, ties = [], maxQ = -Infinity;
      for (var j = r[0]; j <= r[1]; j++) {
        if (q[j] > maxQ) maxQ = q[j];
        if (pu[j] > best || (pu[j] === best && q[j] > bestQ)) { best = pu[j]; bestQ = q[j]; ties = [j]; }
        else if (pu[j] === best && q[j] === bestQ) ties.push(j);
      }
      var sb = ties[(ties.length - 1) >> 1];
      out.push({ startBin: r[0], endBin: r[1], start0: track.start0 + r[0] * bs, end0: track.start0 + (r[1] + 1) * bs,
        length: length, summitBin: sb, summit0: track.start0 + sb * bs + bs / 2, height: best, maxQ: maxQ });
    });
    return out;
  }

  var DEFAULTS = { binSize: 20, perKb: 22, fragMean: 200, fragSd: 50, spread: 60, biasSd: 0.25 };
  function simulateLocus(o) {
    var c = {}; Object.keys(DEFAULTS).forEach(function (k) { c[k] = o[k] == null ? DEFAULTS[k] : o[k]; });
    var nBins = Math.round((o.end0 - o.start0) / c.binSize);
    var bias = biasField(nBins, o.seed * 7 + 3, { sd: c.biasSd, open: (o.open || []).map(function (x) {
      return { bin: (x.pos0 - o.start0) / c.binSize, sdBins: x.sd / c.binSize, fold: x.fold };
    }) });
    var reps = o.reps || 2;
    function sample(kind, r) {
      return simulateSample({ start0: o.start0, end0: o.end0, binSize: c.binSize, bias: bias, perKb: c.perKb,
        fragMean: c.fragMean, fragSd: c.fragSd, spread: c.spread, seed: o.seed * 101 + (kind === "wt" ? 11 : kind === "mut" ? 23 : 37) + r * 1009,
        sites: kind === "input" ? [] : o.sites.map(function (s) { return { pos0: s.pos0, n: kind === "wt" ? s.wt : s.mut }; }) });
    }
    var sim = { start0: o.start0, end0: o.end0, binSize: c.binSize, nBins: nBins, bias: bias, params: c, sites: o.sites,
      wt: [], mut: [], input: sample("input", 0), _tracks: {} };
    for (var r = 0; r < reps; r++) { sim.wt.push(sample("wt", r)); sim.mut.push(sample("mut", r)); }
    // Change one sample's site strengths (values in site order) and redraw only its
    // replicates. The seeds do not change, so the background fragments stay the same.
    sim.setSites = function (kind, values) {
      o.sites.forEach(function (s, i) { s[kind] = values[i]; });
      for (var k = 0; k < reps; k++) { sim[kind][k] = sample(kind, k); delete sim._tracks[kind + k]; }
    };
    sim.track = function (kind, rep) {
      var key = kind + rep;
      if (!sim._tracks[key]) {
        var chip = sim[kind][rep], t = scoreTrack(chip, sim.input, { d: c.fragMean });
        sim._tracks[key] = { p: t.p, q: t.q, lambda: t.lambda, pileup: chip.pileup, binSize: c.binSize, start0: o.start0 };
      }
      return sim._tracks[key];
    };
    return sim;
  }

  function windowCount(sample, pos0, half) {
    var bs = sample.binSize, a = Math.max(0, Math.floor((pos0 - half - sample.start0) / bs)),
      b = Math.min(sample.nBins, Math.ceil((pos0 + half - sample.start0) / bs)), n = 0;
    for (var i = a; i < b; i++) n += sample.centers[i];
    return n;
  }

  // Verdict rules (the page's caption quotes them):
  //   called = a peak region at q <= 10^-thresh lies within `near` bp of the site.
  //   lost    WT called in every replicate, mutant in none
  //   gained  mutant called in every replicate, WT in none
  //   reduced / kept / raised   called in both conditions; log2 FC <= -1 / between / >= +1
  //   none    called in neither
  //   unclear anything else (replicates disagree)
  var VERDICTS = ["lost", "reduced", "kept", "raised", "gained", "none", "unclear"];
  function diffSite(sim, pos0, o) {
    o = o || {};
    var thresh = o.thresh == null ? -Math.log10(0.05) : o.thresh, near = o.near == null ? 100 : o.near, half = o.half == null ? 250 : o.half;
    function called(kind, r) {
      return callPeaks(sim.track(kind, r), thresh, o).some(function (p) { return p.start0 - near < pos0 && p.end0 + near > pos0; });
    }
    var reps = sim.wt.length, wtC = 0, mutC = 0, wtN = [], mutN = [], wtRep = [], mutRep = [];
    for (var r = 0; r < reps; r++) {
      wtRep.push(called("wt", r)); mutRep.push(called("mut", r));
      if (wtRep[r]) wtC++;
      if (mutRep[r]) mutC++;
      wtN.push(windowCount(sim.wt[r], pos0, half)); mutN.push(windowCount(sim.mut[r], pos0, half));
    }
    var mean = function (a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; };
    // Fold change of fragments above input: each replicate's window count minus the input's
    // count in the same window scaled to that replicate's depth, floored at 0, plus 1.
    var inN = windowCount(sim.input, pos0, half);
    function above(kind, counts) { return mean(counts.map(function (n, r) { return Math.max(0, n - inN * sim[kind][r].total / sim.input.total); })); }
    var wtAbove = above("wt", wtN), mutAbove = above("mut", mutN);
    var lfc = Math.log2((mutAbove + 1) / (wtAbove + 1)), v;
    if (wtC === reps && mutC === 0) v = "lost";
    else if (mutC === reps && wtC === 0) v = "gained";
    else if (wtC === 0 && mutC === 0) v = "none";
    else if (wtC > 0 && mutC > 0 && wtC + mutC >= reps + 1) v = lfc <= -1 ? "reduced" : lfc >= 1 ? "raised" : "kept";
    else v = "unclear";
    return { wtCalled: wtC, mutCalled: mutC, wtRep: wtRep, mutRep: mutRep, reps: reps, wtCounts: wtN, mutCounts: mutN, inputCount: inN,
      wtAbove: wtAbove, mutAbove: mutAbove, lfc: lfc, verdict: v };
  }

  function remapSupport(data, start0, end0) {
    var seen = {};
    data.peaks.forEach(function (p) { if (p[0] < end0 && p[1] > start0) seen[p[3]] = 1; });
    return Object.keys(seen).length;
  }

  // ---------- motif logo ----------
  var BASES = ["A", "C", "G", "T"], COMP = { A: "T", C: "G", G: "C", T: "A" };
  function infoContent(pfm) {
    var L = pfm.A.length, cols = [], total = 0, maxE = 0;
    for (var i = 0; i < L; i++) {
      var n = 0, H = 0, f = {};
      BASES.forEach(function (b) { n += pfm[b][i]; });
      BASES.forEach(function (b) { var p = pfm[b][i] / n; f[b] = p; if (p > 0) H -= p * Math.log(p) / Math.LN2; });
      var ic = 2 - H, e = 3 / (2 * Math.LN2 * n);
      var stack = BASES.map(function (b, k) { return { base: b, k: k, freq: f[b], height: f[b] * ic }; })
        .sort(function (a, b) { return a.height - b.height || a.k - b.k; });
      cols.push({ n: n, freq: f, ic: ic, smallSample: e, stack: stack });
      total += ic; maxE = Math.max(maxE, e);
    }
    return { cols: cols, total: total, maxSmallSample: maxE };
  }
  function revcomp(s) { var o = ""; for (var i = s.length - 1; i >= 0; i--) o += COMP[s[i].toUpperCase()] || "N"; return o; }
  function siteLoss(pwm, site) {
    var pos = [], score = 0, max = 0;
    for (var k = 0; k < pwm.cols.length; k++) {
      var c = pwm.cols[k], b = site[k].toUpperCase(), best = -Infinity, bb = null;
      BASES.forEach(function (x) { if (c[x] > best) { best = c[x]; bb = x; } });
      pos.push({ base: b, score: c[b], best: best, bestBase: bb, loss: best - c[b] });
      score += c[b]; max += best;
    }
    return { pos: pos, score: score, max: max, loss: max - score };
  }

  // ---------- checks ----------
  function runChecks(print, data) {
    var res = [];
    function check(name, ok, detail) { res.push({ name: name, ok: !!ok, detail: detail || "" }); if (print) console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); }

    // Poisson tail against scipy 1.13.1: -poisson.logsf(k - 1, lam) / ln 10
    var ref = [[10, 2.0, 4.332565026178537], [25, 4.3, 11.143499449994856], [150, 5.0, 160.0682444264756],
      [3, 6.5, 0.01910437552835813], [0, 3.0, 0], [60, 12.25, 21.855196097311257]];
    var worst = 0;
    ref.forEach(function (r) { var v = poissonScore(r[0], r[1]); worst = Math.max(worst, Math.abs(v - r[2]) / Math.max(1e-12, Math.abs(r[2]) || 1)); });
    check("poissonScore matches scipy poisson.logsf (6 cases)", worst < 1e-9, "max rel err " + worst.toExponential(2));
    var mono = true, prev = -1;
    for (var k = 5; k <= 400; k++) { var s = poissonScore(k, 4); if (!(s > prev) || !isFinite(s)) mono = false; prev = s; }
    check("poissonScore strictly increasing in k up to 400 at lambda 4 (no clamp plateau)", mono, "score at 400 = " + prev.toFixed(1));

    // BH against scipy.stats.false_discovery_control
    var pv = [0.01, 0.04, 0.03, 0.005, 0.2, 0.0001, 0.5, 0.049, 1e-12, 0.9];
    var qref = [0.025, 0.06666666666666667, 0.06, 0.016666666666666666, 0.25, 0.0005, 0.5555555555555556, 0.07, 1e-11, 0.9];
    var qs = bhScores(pv.map(function (p) { return -Math.log10(p); })), bhErr = 0;
    qref.forEach(function (q, i) { bhErr = Math.max(bhErr, Math.abs(Math.pow(10, -qs[i]) - q) / q); });
    check("bhScores matches scipy false_discovery_control (10 p-values)", bhErr < 1e-9, "max rel err " + bhErr.toExponential(2));

    // Planted sites in a synthetic 40-kb region
    var sim = simulateLocus({ start0: 0, end0: 40000, seed: 99, reps: 2,
      sites: [{ pos0: 15000, wt: 60, mut: 6 }, { pos0: 15900, wt: 35, mut: 3.5 }, { pos0: 26000, wt: 0, mut: 30 }],
      open: [{ pos0: 20000, sd: 250, fold: 2.2 }] });
    var tr = sim.track("wt", 0), peaks = callPeaks(tr, -Math.log10(0.05)), summitOk = true, detail = [];
    peaks.forEach(function (p) {
      var mx = -1; for (var j = p.startBin; j <= p.endBin; j++) mx = Math.max(mx, tr.pileup[j]);
      if (tr.pileup[p.summitBin] !== mx) summitOk = false;
      detail.push(p.start0 + "-" + p.end0 + "@" + p.summit0);
    });
    check("callPeaks summit is the bin of greatest pileup in every region", summitOk && peaks.length > 0, detail.join(", "));
    var near = function (pos) { return peaks.filter(function (p) { return Math.abs(p.summit0 - pos) <= 80; }).length === 1; };
    check("both planted WT sites called at q <= 0.05 with summits within 80 bp", near(15000) && near(15900));
    check("open-chromatin bump at 20 kb (in input too) not called in WT", !peaks.some(function (p) { return p.start0 < 20500 && p.end0 > 19500; }));
    var widths = [], ts = [2, 5, 10, 15, 20, 25];
    ts.forEach(function (t) { var pk = callPeaks(tr, t).filter(function (p) { return Math.abs(p.summit0 - 15000) <= 300; }); widths.push(pk.length ? pk[0].length : 0); });
    var shrink = widths.every(function (w, i) { return i === 0 || w <= widths[i - 1]; });
    check("region at the strong site never widens as the threshold rises", shrink, "widths " + widths.join(","));
    var maxQ = 0; for (var b = 0; b < tr.q.length; b++) maxQ = Math.max(maxQ, tr.q[b]);
    var top = callPeaks(tr, maxQ, { minLen: 0 });
    check("at the maximum threshold the call is the summit neighbourhood only", top.length === 1 && top[0].length <= 100 && Math.abs(top[0].summit0 - 15000) <= 80, top.length ? top[0].length + " bp" : "none");

    // Null: background only, 10 seeds, q <= 0.05
    var fp = 0;
    for (var sd = 1; sd <= 10; sd++) {
      var nul = simulateLocus({ start0: 0, end0: 40000, seed: 500 + sd, reps: 1, sites: [], open: [{ pos0: 20000, sd: 250, fold: 2.2 }] });
      fp += callPeaks(nul.track("wt", 0), -Math.log10(0.05)).length;
    }
    check("background-only regions called at q <= 0.05 over 10 seeds is small", fp <= 2, fp + " regions");

    var d1 = diffSite(sim, 15000), d2 = diffSite(sim, 26000);
    check("diffSite: strong WT-only site with 10% mutant occupancy is lost or reduced", d1.verdict === "lost" || d1.verdict === "reduced", d1.verdict + ", lfc " + d1.lfc.toFixed(2));
    check("diffSite: mutant-only site is gained", d2.verdict === "gained", d2.verdict);

    // Sequence logo: toy columns by hand, then JASPAR MA0106.3 against logomaker 0.8.7
    // (transform_matrix counts -> information, pseudocount 0, uniform background).
    var toy = infoContent({ A: [8, 4, 2, 7, 4], C: [0, 4, 2, 1, 2], G: [0, 0, 2, 1, 2], T: [0, 0, 2, 1, 0] });
    var toyWant = [2, 1, 0, 0.6432203505529603, 0.5], toyErr = 0;
    toy.cols.forEach(function (c, i) { toyErr = Math.max(toyErr, Math.abs(c.ic - toyWant[i])); });
    check("infoContent: hand-computed columns (2, 1, 0, 0.6432, 0.5 bits)", toyErr < 1e-12, "max err " + toyErr.toExponential(1));
    var MA0106_3 = { A: [7544, 10514, 45, 11931, 1710, 8, 244, 1228, 1145, 3851, 3584, 7104, 0, 12925, 1825, 327, 879, 1472],
      C: [1037, 116, 19689, 204, 374, 2, 12014, 17286, 11875, 1474, 756, 26, 19350, 250, 118, 33, 3338, 9183],
      G: [6563, 2433, 13, 653, 137, 20393, 109, 417, 2151, 9954, 17846, 8821, 4, 157, 89, 20549, 116, 825],
      T: [2268, 735, 837, 739, 18893, 0, 7106, 2642, 3774, 2118, 1546, 190, 1, 1155, 17864, 68, 17859, 9120] };
    var lmIC = [0.321211843, 0.976401095, 1.724754728, 1.308772748, 1.412609908, 1.993550539, 0.918363341, 1.027460847, 0.51286178,
      0.385962661, 0.863822682, 0.912112691, 1.996361941, 1.390433732, 1.465527281, 1.835828272, 1.112600597, 0.502037873];
    var lmCol1 = { A: 0.139169661, C: 0.019130294, G: 0.12107244, T: 0.041839447 };
    var ma = infoContent(MA0106_3), icErr = 0, hErr = 0, stackErr = 0;
    ma.cols.forEach(function (c, i) {
      icErr = Math.max(icErr, Math.abs(c.ic - lmIC[i]));
      var sum = c.stack.reduce(function (a, x) { return a + x.height; }, 0); stackErr = Math.max(stackErr, Math.abs(sum - c.ic));
    });
    ma.cols[0].stack.forEach(function (x) { hErr = Math.max(hErr, Math.abs(x.height - lmCol1[x.base])); });
    check("infoContent: MA0106.3 per-column bits and column-1 letter heights match logomaker", icErr < 1e-8 && hErr < 1e-8 && stackErr < 1e-12,
      "total " + ma.total.toFixed(2) + " bits; max err " + Math.max(icErr, hErr).toExponential(1));
    check("small-sample correction for MA0106.3 is negligible (under 0.001 bits per column)", ma.maxSmallSample < 0.001,
      "max e(n) " + ma.maxSmallSample.toExponential(2) + " bits");
    // siteLoss: sum of losses is max - score, and a minus-strand window read as its reverse
    // complement scores what the scanner's reverse-strand formula gives.
    var tp = { cols: [{ A: 1.5, C: -2, G: 0.2, T: -1 }, { A: -3, C: 1.9, G: -0.5, T: 0.1 }, { A: 0.3, C: -1, G: -4, T: 1.2 }] };
    var w = "GCA", sl = siteLoss(tp, w), lsum = sl.pos.reduce(function (a, x) { return a + x.loss; }, 0);
    var revScore = 0; for (var kk = 0; kk < 3; kk++) revScore += tp.cols[2 - kk][COMP[w[kk]]];
    check("siteLoss: losses sum to max - score; reverse-complement reading equals the reverse-strand score",
      Math.abs(lsum - (sl.max - sl.score)) < 1e-12 && Math.abs(siteLoss(tp, revcomp(w)).score - revScore) < 1e-12 && Math.abs(sl.score - (0.2 + 1.9 + 0.3)) < 1e-12,
      "score " + sl.score.toFixed(2) + ", max " + sl.max.toFixed(2));

    if (data && data.peaks) {
      var okRows = data.peaks.every(function (p) { return p[0] <= p[2] && p[2] < p[1] && p[3] >= 0 && p[3] < data.experiments.length; });
      check("ReMap data: summits inside peaks, experiment indices valid", okRows, data.peaks.length + " peaks, " + data.experiments.length + " experiments");
      // Independent counts (Python over the raw UCSC response): 18-bp motif windows, 1-based starts
      var want = [[36676450, 87], [36684542, 3], [36682644, 63], [36672851, 0], [36673390, 0], [36677332, 38]], got = [];
      var ok = want.every(function (w) { var n = remapSupport(data, w[0] - 1, w[0] - 1 + 18); got.push(n); return n === w[1]; });
      check("remapSupport matches an independent count at the six best motif windows", ok, got.join(","));
    }
    return res;
  }

  var api = { mulberry32: mulberry32, poissonScore: poissonScore, bhScores: bhScores, biasField: biasField,
    simulateSample: simulateSample, localLambda: localLambda, scoreTrack: scoreTrack, callPeaks: callPeaks,
    simulateLocus: simulateLocus, windowCount: windowCount, diffSite: diffSite, VERDICTS: VERDICTS,
    remapSupport: remapSupport, infoContent: infoContent, revcomp: revcomp, siteLoss: siteLoss,
    DEFAULTS: DEFAULTS, runChecks: runChecks };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioEssay04 = api;
})(typeof self !== "undefined" ? self : this);
