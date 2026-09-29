// nsd.js: a small neural sheaf diffusion model that trains in the page.
//
// Bodnar, Di Giovanni, Chamberlain, Lio, Bronstein, "Neural Sheaf Diffusion"
// (NeurIPS 2022, arXiv:2202.04579), eq. 6 with the residual scaling of their
// eq. 55:
//
//   X_{t+1} = (1 + eps_t) X_t - elu( Delta_{F(t)} (I (x) W1_t) X_t W2_t )
//
// X is n x (d f): d stalk dimensions, f channels, stored row-major with
// column k f + c holding stalk coordinate k of channel c. Delta_F is the
// sheaf Laplacian normalised by the augmented block diagonal,
// (D + I)^{-1/2} L_F (D + I)^{-1/2}. Each restriction map is learned from the
// two endpoint features, F_{v <| e} = Phi(x_v, x_u) = sigma(V [x_v || x_u]).
// A linear layer with elu maps the bag-of-words features to X_0 and a final
// linear layer gives class logits.
//
// Map kinds:
//   'mlp'    no diffusion layers at all (the features alone)
//   'plain'  every restriction map the identity: Delta is the augmented
//            normalised graph Laplacian on each stalk coordinate. Plain diffusion.
//   'diag'   diagonal maps, entries tanh(V [x_v || x_u]) (the paper's Diag-NSD)
//   'rot'    d = 2, each map a rotation by pi tanh(V [x_v || x_u]) (a subset of
//            O(2); the paper's O(d)-NSD builds maps from Householder reflections)
//
// API (window.NSD, or module.exports in node):
//   NSD.graph(n, edges)                  { n, edges, src, dst, rev, deg }: each undirected
//                                        edge becomes two incidences, dst receiving from src
//   NSD.laplacian(G, kind, maps, d)      dense normalised Laplacian for given maps (checks)
//   NSD.model(cfg, data, seed)           { params, forward(train), transports(), cfg }
//   NSD.trainer(cfg, data, split, seed)  { step(k), done, best, history, model }
//   NSD.homophily(edges, labels)         fraction of edges joining equal labels
//   NSD.fromWebKB(raw)                   sparse row-normalised features, labels, graph
//   NSD.runChecks()                      [{ name, ok, detail }]
(function (global) {
  'use strict';

  // ---------- reverse-mode autodiff on dense row-major matrices ----------
  var tape = null;
  function T(r, c, d) {
    this.r = r; this.c = c; this.d = d || new Float64Array(r * c); this.g = null;
  }
  T.prototype.grad = function () { if (!this.g) this.g = new Float64Array(this.r * this.c); return this.g; };
  function rec(out, back) { if (tape) tape.push(function () { if (out.g) back(out.g); }); return out; }

  function matmul(A, B) {
    var n = A.r, k = A.c, m = B.c, o = new T(n, m), a = A.d, b = B.d, od = o.d;
    for (var i = 0; i < n; i++) for (var p = 0; p < k; p++) {
      var x = a[i * k + p]; if (x === 0) continue;
      for (var j = 0; j < m; j++) od[i * m + j] += x * b[p * m + j];
    }
    return rec(o, function (g) {
      var ga = A.grad(), gb = B.grad();
      for (var i = 0; i < n; i++) for (var p = 0; p < k; p++) {
        var s = 0, x = a[i * k + p];
        for (var j = 0; j < m; j++) { s += g[i * m + j] * b[p * m + j]; gb[p * m + j] += x * g[i * m + j]; }
        ga[i * k + p] += s;
      }
    });
  }
  // Sparse constant S (rows of column indices and values) times parameter W.
  function spmm(S, W) {
    var m = W.c, o = new T(S.n, m), od = o.d, wd = W.d;
    for (var i = 0; i < S.n; i++) {
      var ix = S.idx[i], vs = S.val[i];
      for (var q = 0; q < ix.length; q++) { var r = ix[q] * m, v = vs[q]; for (var j = 0; j < m; j++) od[i * m + j] += v * wd[r + j]; }
    }
    return rec(o, function (g) {
      var gw = W.grad();
      for (var i = 0; i < S.n; i++) {
        var ix = S.idx[i], vs = S.val[i];
        for (var q = 0; q < ix.length; q++) { var r = ix[q] * m, v = vs[q]; for (var j = 0; j < m; j++) gw[r + j] += v * g[i * m + j]; }
      }
    });
  }
  function map2(A, B, f, fa, fb) {
    var o = new T(A.r, A.c);
    for (var i = 0; i < o.d.length; i++) o.d[i] = f(A.d[i], B.d[i]);
    return rec(o, function (g) {
      var ga = A.grad(), gb = B.grad();
      for (var i = 0; i < g.length; i++) { ga[i] += g[i] * fa(A.d[i], B.d[i]); gb[i] += g[i] * fb(A.d[i], B.d[i]); }
    });
  }
  function add(A, B) { return map2(A, B, function (a, b) { return a + b; }, function () { return 1; }, function () { return 1; }); }
  function sub(A, B) { return map2(A, B, function (a, b) { return a - b; }, function () { return 1; }, function () { return -1; }); }
  function mul(A, B) { return map2(A, B, function (a, b) { return a * b; }, function (a, b) { return b; }, function (a) { return a; }); }
  function map1(A, f, df) {
    var o = new T(A.r, A.c);
    for (var i = 0; i < o.d.length; i++) o.d[i] = f(A.d[i]);
    return rec(o, function (g) {
      var ga = A.grad();
      for (var i = 0; i < g.length; i++) ga[i] += g[i] * df(A.d[i], o.d[i]);
    });
  }
  function elu(A) { return map1(A, function (x) { return x > 0 ? x : Math.exp(x) - 1; }, function (x, y) { return x > 0 ? 1 : y + 1; }); }
  function tanh(A) { return map1(A, Math.tanh, function (x, y) { return 1 - y * y; }); }
  function cos(A) { return map1(A, Math.cos, function (x) { return -Math.sin(x); }); }
  function sin(A) { return map1(A, Math.sin, function (x) { return Math.cos(x); }); }
  function scale(A, s) { return map1(A, function (x) { return s * x; }, function () { return s; }); }
  function addConst(A, s) { return map1(A, function (x) { return x + s; }, function () { return 1; }); }
  function rsqrt(A) { return map1(A, function (x) { return 1 / Math.sqrt(x); }, function (x, y) { return -0.5 * y / x; }); }
  // A (n x c) plus a 1 x c row.
  function addRow(A, b) {
    var o = new T(A.r, A.c), c = A.c;
    for (var i = 0; i < o.d.length; i++) o.d[i] = A.d[i] + b.d[i % c];
    return rec(o, function (g) {
      var ga = A.grad(), gb = b.grad();
      for (var i = 0; i < g.length; i++) { ga[i] += g[i]; gb[i % c] += g[i]; }
    });
  }
  // X (m x d f) with stalk block k scaled by F[i][k]; F is m x d, or 1 x d
  // for a row shared by every node.
  function mulBlocks(X, F, d) {
    var m = X.r, w = X.c, f = w / d, o = new T(m, w), shared = F.r === 1 && m > 1;
    for (var i = 0; i < m; i++) for (var k = 0; k < d; k++) {
      var s = F.d[(shared ? 0 : i) * d + k];
      for (var c = 0; c < f; c++) o.d[i * w + k * f + c] = s * X.d[i * w + k * f + c];
    }
    return rec(o, function (g) {
      var gx = X.grad(), gf = F.grad();
      for (var i = 0; i < m; i++) for (var k = 0; k < d; k++) {
        var s = F.d[(shared ? 0 : i) * d + k], acc = 0;
        for (var c = 0; c < f; c++) { var q = i * w + k * f + c; gx[q] += s * g[q]; acc += X.d[q] * g[q]; }
        gf[(shared ? 0 : i) * d + k] += acc;
      }
    });
  }
  // Rows of A picked by idx.
  function gather(A, idx) {
    var c = A.c, o = new T(idx.length, c);
    for (var i = 0; i < idx.length; i++) for (var j = 0; j < c; j++) o.d[i * c + j] = A.d[idx[i] * c + j];
    return rec(o, function (g) {
      var ga = A.grad();
      for (var i = 0; i < idx.length; i++) for (var j = 0; j < c; j++) ga[idx[i] * c + j] += g[i * c + j];
    });
  }
  // Sum the rows of A into n rows, row i going to idx[i].
  function scatter(A, idx, n) {
    var c = A.c, o = new T(n, c);
    for (var i = 0; i < idx.length; i++) for (var j = 0; j < c; j++) o.d[idx[i] * c + j] += A.d[i * c + j];
    return rec(o, function (g) {
      var ga = A.grad();
      for (var i = 0; i < idx.length; i++) for (var j = 0; j < c; j++) ga[i * c + j] += g[idx[i] * c + j];
    });
  }
  function concat(A, B) {
    var n = A.r, a = A.c, b = B.c, o = new T(n, a + b);
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < a; j++) o.d[i * (a + b) + j] = A.d[i * a + j];
      for (j = 0; j < b; j++) o.d[i * (a + b) + a + j] = B.d[i * b + j];
    }
    return rec(o, function (g) {
      var ga = A.grad(), gb = B.grad();
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < a; j++) ga[i * a + j] += g[i * (a + b) + j];
        for (j = 0; j < b; j++) gb[i * b + j] += g[i * (a + b) + a + j];
      }
    });
  }
  // (I (x) W1): out[v, k f + c] = sum_j W1[k][j] X[v, j f + c].
  function stalkMix(X, W, d) {
    var n = X.r, w = X.c, f = w / d, o = new T(n, w);
    for (var v = 0; v < n; v++) for (var k = 0; k < d; k++) for (var j = 0; j < d; j++) {
      var a = W.d[k * d + j]; if (a === 0) continue;
      for (var c = 0; c < f; c++) o.d[v * w + k * f + c] += a * X.d[v * w + j * f + c];
    }
    return rec(o, function (g) {
      var gx = X.grad(), gw = W.grad();
      for (var v = 0; v < n; v++) for (var k = 0; k < d; k++) for (var j = 0; j < d; j++) {
        var a = W.d[k * d + j], s = 0;
        for (var c = 0; c < f; c++) { s += g[v * w + k * f + c] * X.d[v * w + j * f + c]; gx[v * w + j * f + c] += a * g[v * w + k * f + c]; }
        gw[k * d + j] += s;
      }
    });
  }
  // X W2 on every stalk block: the n x (d f) data viewed as (n d) x f.
  function chanMix(X, W, d) {
    var view = new T(X.r * d, X.c / d, X.d);
    rec(view, function (g) { var gx = X.grad(); for (var i = 0; i < g.length; i++) gx[i] += g[i]; });
    var o = matmul(view, W), out = new T(X.r, X.c, o.d);
    return rec(out, function (g) { var go = o.grad(); for (var i = 0; i < g.length; i++) go[i] += g[i]; });
  }
  // d = 2: rotate each row's two stalk blocks by the angle whose cos and sin
  // are given per row (m x 1).
  function rotate(X, C, S) {
    var m = X.r, w = X.c, f = w / 2, o = new T(m, w);
    for (var i = 0; i < m; i++) {
      var c = C.d[i], s = S.d[i];
      for (var q = 0; q < f; q++) {
        var a = X.d[i * w + q], b = X.d[i * w + f + q];
        o.d[i * w + q] = c * a - s * b; o.d[i * w + f + q] = s * a + c * b;
      }
    }
    return rec(o, function (g) {
      var gx = X.grad(), gc = C.grad(), gs = S.grad();
      for (var i = 0; i < m; i++) {
        var c = C.d[i], s = S.d[i], ac = 0, as = 0;
        for (var q = 0; q < f; q++) {
          var a = X.d[i * w + q], b = X.d[i * w + f + q], g0 = g[i * w + q], g1 = g[i * w + f + q];
          gx[i * w + q] += c * g0 + s * g1; gx[i * w + f + q] += -s * g0 + c * g1;
          ac += a * g0 + b * g1; as += -b * g0 + a * g1;
        }
        gc[i] += ac; gs[i] += as;
      }
    });
  }
  function dropout(A, p, rnd) {
    if (!p) return A;
    var o = new T(A.r, A.c), mask = new Float64Array(A.d.length), k = 1 / (1 - p);
    for (var i = 0; i < mask.length; i++) { mask[i] = rnd() < p ? 0 : k; o.d[i] = A.d[i] * mask[i]; }
    return rec(o, function (g) { var ga = A.grad(); for (var i = 0; i < g.length; i++) ga[i] += g[i] * mask[i]; });
  }
  // Mean cross-entropy of softmax(logits) over the rows in idx.
  function crossEntropy(Z, labels, idx) {
    var c = Z.c, o = new T(1, 1), P = new Float64Array(idx.length * c), loss = 0;
    idx.forEach(function (v, t) {
      var mx = -Infinity, s = 0, j;
      for (j = 0; j < c; j++) mx = Math.max(mx, Z.d[v * c + j]);
      for (j = 0; j < c; j++) { P[t * c + j] = Math.exp(Z.d[v * c + j] - mx); s += P[t * c + j]; }
      for (j = 0; j < c; j++) P[t * c + j] /= s;
      loss -= Math.log(P[t * c + labels[v]] + 1e-300);
    });
    o.d[0] = loss / idx.length;
    return rec(o, function (g) {
      var gz = Z.grad(), k = g[0] / idx.length;
      idx.forEach(function (v, t) {
        for (var j = 0; j < c; j++) gz[v * c + j] += k * (P[t * c + j] - (j === labels[v] ? 1 : 0));
      });
    });
  }
  function backward(loss, record) {
    loss.grad()[0] = 1;
    for (var i = record.length - 1; i >= 0; i--) record[i]();
  }

  // ---------- the graph and its Laplacians ----------
  function graph(n, edges) {
    var src = [], dst = [], rev = [], deg = new Float64Array(n);
    edges.forEach(function (e, k) {
      dst.push(e[1]); src.push(e[0]); dst.push(e[0]); src.push(e[1]);
      rev.push(2 * k + 1, 2 * k);
      deg[e[0]]++; deg[e[1]]++;
    });
    var s = new T(n, 1);
    for (var v = 0; v < n; v++) s.d[v] = 1 / Math.sqrt(deg[v] + 1);
    return { n: n, edges: edges, src: src, dst: dst, rev: rev, deg: deg, sInv: s };
  }

  // Apply Delta_F to Z (n x d f). maps: null for 'plain'; for 'rot' the angle
  // phi_i of F_{dst <| e} per incidence (m x 1); for 'diag' the entries of
  // F_{dst <| e} per incidence (m x d).
  function applyDelta(G, kind, maps, Z, d) {
    var n = G.n, degT;
    if (kind === 'plain' || kind === 'rot') {
      var S2 = new T(n, d); for (var v = 0; v < n; v++) for (var k = 0; k < d; k++) S2.d[v * d + k] = G.sInv.d[v];
      degT = new T(n, d); for (v = 0; v < n; v++) for (k = 0; k < d; k++) degT.d[v * d + k] = G.deg[v];
      var Y = mulBlocks(Z, S2, d), msg = gather(Y, G.src);
      if (kind === 'rot') {
        // Transport into dst: F_dst^T F_src = rot(phi_src - phi_dst).
        var ang = sub(gather(maps, G.rev), maps);
        msg = rotate(msg, cos(ang), sin(ang));
      }
      var LY = sub(mulBlocks(Y, degT, d), scatter(msg, G.dst, n));
      return mulBlocks(LY, S2, d);
    }
    // diag: L_vv = sum F_dst^2 over incidences into v, D + I = 1 + L_vv.
    var sq = scatter(mul(maps, maps), G.dst, n);
    var s = rsqrt(addConst(sq, 1));
    var Yd = mulBlocks(Z, s, d);
    var trans = mul(maps, gather(maps, G.rev));
    var agg = scatter(mulBlocks(gather(Yd, G.src), trans, d), G.dst, n);
    return mulBlocks(sub(mulBlocks(Yd, sq, d), agg), s, d);
  }

  // Dense Delta for given maps, through sheaf-math.js when available: checks only.
  function laplacian(G, kind, maps, d) {
    var n = G.n, N = n * d, M = [];
    for (var j = 0; j < N; j++) {
      var Z = new T(n, d);
      Z.d[j] = 1;
      var col = applyDelta(G, kind, maps, Z, d).d;
      for (var i = 0; i < N; i++) { if (!M[i]) M[i] = new Float64Array(N); M[i][j] = col[i]; }
    }
    return M;
  }

  // ---------- model ----------
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function glorot(r, c, rnd) {
    var t = new T(r, c), a = Math.sqrt(6 / (r + c));
    for (var i = 0; i < t.d.length; i++) t.d[i] = (2 * rnd() - 1) * a;
    return t;
  }
  function eye(d) { var t = new T(d, d); for (var i = 0; i < d; i++) t.d[i * d + i] = 1; return t; }

  // cfg: { kind, d, f, layers, dropout, lr, wd, epochs, patience }
  function model(cfg, data, seed) {
    var rnd = rng(seed), d = cfg.kind === 'rot' ? 2 : cfg.d, f = cfg.f, h = d * f, C = data.classes;
    var layers = cfg.kind === 'mlp' ? 0 : cfg.layers;
    var P = { Win: glorot(data.X.cols, h, rnd), bin: new T(1, h), Wout: glorot(h, C, rnd), bout: new T(1, C), L: [] };
    for (var t = 0; t < layers; t++) {
      var Lp = cfg.vanilla ? {} : { W1: eye(d), W2: eye(f), eps: new T(1, d) };
      if (cfg.kind === 'diag') {
        Lp.V = glorot(2 * h, d, rnd); Lp.b = new T(1, d);
        if (cfg.mapInit) Lp.b.d.fill(Math.atanh(cfg.mapInit));
      }
      if (cfg.kind === 'rot') { Lp.V = glorot(2 * h, 1, rnd); Lp.b = new T(1, 1); }
      P.L.push(Lp);
    }
    var list = [P.Win, P.bin, P.Wout, P.bout];
    P.L.forEach(function (Lp) { Object.keys(Lp).forEach(function (k) { list.push(Lp[k]); }); });
    var G = data.G, lastMaps = [];

    function learnMaps(Lp, X) {
      var pair = concat(gather(X, G.dst), gather(X, G.src));
      var z = addRow(matmul(pair, Lp.V), Lp.b);
      return cfg.kind === 'rot' ? scale(tanh(z), Math.PI) : tanh(z);
    }
    function forward(train) {
      var p = train ? cfg.dropout : 0;
      var X = dropout(elu(addRow(spmm(data.X, P.Win), P.bin)), p, rnd);
      lastMaps = [];
      P.L.forEach(function (Lp) {
        var maps = cfg.kind === 'plain' ? null : learnMaps(Lp, X);
        lastMaps.push(maps);
        if (cfg.vanilla) { X = sub(X, applyDelta(G, cfg.kind, maps, X, d)); return; }
        var Z = chanMix(stalkMix(dropout(X, p, rnd), Lp.W1, d), Lp.W2, d);
        Z = elu(applyDelta(G, cfg.kind, maps, Z, d));
        X = sub(mulBlocks(X, addConst(tanh(Lp.eps), 1), d), Z);
      });
      return addRow(matmul(X, P.Wout), P.bout);
    }
    // Learned transport per undirected edge, from the last evaluation
    // forward pass: the scalar F_v F_u per stalk coordinate for 'diag', the
    // rotation angle phi_u - phi_v in (-pi, pi] for 'rot'. One array per layer.
    function transports() {
      return lastMaps.map(function (maps) {
        if (!maps) return null;
        return G.edges.map(function (e, k) {
          var i = 2 * k, j = 2 * k + 1;
          if (cfg.kind === 'rot') {
            var a = maps.d[j] - maps.d[i];
            while (a > Math.PI) a -= 2 * Math.PI;
            while (a <= -Math.PI) a += 2 * Math.PI;
            return a;
          }
          var out = [];
          for (var q = 0; q < d; q++) out.push(maps.d[i * d + q] * maps.d[j * d + q]);
          return out;
        });
      });
    }
    return { params: list, P: P, forward: forward, transports: transports, cfg: cfg, d: d };
  }

  function adam(params, lr, wd) {
    var m = params.map(function (p) { return new Float64Array(p.d.length); });
    var v = params.map(function (p) { return new Float64Array(p.d.length); });
    var t = 0, b1 = 0.9, b2 = 0.999;
    return function () {
      t++;
      var c1 = 1 - Math.pow(b1, t), c2 = 1 - Math.pow(b2, t);
      params.forEach(function (p, k) {
        var g = p.g, mk = m[k], vk = v[k];
        for (var i = 0; i < p.d.length; i++) {
          var gi = (g ? g[i] : 0) + wd * p.d[i];
          mk[i] = b1 * mk[i] + (1 - b1) * gi; vk[i] = b2 * vk[i] + (1 - b2) * gi * gi;
          p.d[i] -= lr * (mk[i] / c1) / (Math.sqrt(vk[i] / c2) + 1e-8);
        }
        p.g = null;
      });
    };
  }

  function accuracy(Z, labels, idx) {
    var c = Z.c, ok = 0;
    idx.forEach(function (v) {
      var best = 0;
      for (var j = 1; j < c; j++) if (Z.d[v * c + j] > Z.d[v * c + best]) best = j;
      if (best === labels[v]) ok++;
    });
    return ok / idx.length;
  }

  // Train with Adam and early stopping on validation accuracy (ties broken by
  // validation loss); report test accuracy at the best validation epoch.
  function trainer(cfg, data, split, seed) {
    var M = model(cfg, data, seed), opt = adam(M.params, cfg.lr, cfg.wd);
    var idx = { t: [], v: [], s: [] };
    for (var i = 0; i < split.length; i++) idx[split[i]].push(i);
    var st = { epoch: 0, done: false, history: [], best: null, model: M, idx: idx, since: 0 };
    st.step = function (k) {
      for (var r = 0; r < k && !st.done; r++) {
        var rec0 = []; tape = rec0;
        var loss = crossEntropy(M.forward(true), data.labels, idx.t);
        tape = null;
        backward(loss, rec0);
        opt();
        var Z = M.forward(false);
        var h = { epoch: ++st.epoch, loss: loss.d[0], train: accuracy(Z, data.labels, idx.t),
          val: accuracy(Z, data.labels, idx.v), test: accuracy(Z, data.labels, idx.s),
          valLoss: crossEntropy(Z, data.labels, idx.v).d[0] };
        st.history.push(h);
        if (!st.best || h.val > st.best.val || (h.val === st.best.val && h.valLoss < st.best.valLoss)) {
          st.best = h; st.since = 0; st.bestTransports = M.transports();
        } else st.since++;
        if (st.epoch >= cfg.epochs || st.since >= cfg.patience) st.done = true;
      }
      return st;
    };
    return st;
  }

  function homophily(edges, labels) {
    return edges.filter(function (e) { return labels[e[0]] === labels[e[1]]; }).length / edges.length;
  }

  // Raw WebKB record (see data/webkb.js) to model input: bag-of-words rows
  // normalised to sum 1.
  function fromWebKB(raw) {
    var idx = [], val = [];
    raw.words.forEach(function (w) {
      var ix = w ? w.split(' ').map(function (s) { return parseInt(s, 36); }) : [];
      idx.push(ix); val.push(ix.map(function () { return 1 / ix.length; }));
    });
    var classes = 1 + Math.max.apply(null, raw.labels);
    return { X: { n: raw.n, cols: raw.used, idx: idx, val: val }, labels: raw.labels, classes: classes,
      G: graph(raw.n, raw.edges), splits: raw.splits };
  }

  // ---------- checks ----------
  function runChecks() {
    var out = [];
    function check(name, ok, detail) { out.push({ name: name, ok: !!ok, detail: detail || '' }); }
    var Sh = global.Sheaf || (typeof require === 'function' ? require('./sheaf-math.js') : null);
    var rnd = rng(5);

    // A small random connected graph with features and labels.
    var n = 9, edges = [];
    for (var v = 1; v < n; v++) edges.push([Math.floor(rnd() * v), v]);
    [[0, 5], [2, 7], [3, 8], [1, 6]].forEach(function (e) { edges.push(e); });
    var G = graph(n, edges);

    // Delta for rotation and diagonal maps matches sheaf-math's Laplacian of the
    // same sheaf, normalised by (D + I)^{-1/2}.
    function denseCheck(kind, d) {
      var m = G.src.length, maps = new T(m, kind === 'rot' ? 1 : d);
      for (var i = 0; i < maps.d.length; i++) maps.d[i] = kind === 'rot' ? (2 * rnd() - 1) * Math.PI : 2 * rnd() - 1;
      var M = laplacian(G, kind, maps, d);
      var S = Sh.create({ dims: new Array(n).fill(d), edges: edges.map(function (e, k) {
        var Fu, Fv, i = 2 * k, j = 2 * k + 1; // incidence i has dst = e[1], j has dst = e[0]
        if (kind === 'rot') { Fu = Sh.rot(maps.d[j]); Fv = Sh.rot(maps.d[i]); } else {
          Fu = []; Fv = [];
          for (var a = 0; a < d; a++) { Fu.push(new Array(d).fill(0)); Fv.push(new Array(d).fill(0)); Fu[a][a] = maps.d[j * d + a]; Fv[a][a] = maps.d[i * d + a]; }
        }
        return { u: e[0], v: e[1], Fu: Fu, Fv: Fv };
      }) });
      var L = Sh.laplacian(S), err = 0;
      // Stalk coordinate k of vertex v sits at row v d + k in both layouts when f = 1.
      for (var a = 0; a < n * d; a++) for (var b = 0; b < n * d; b++) {
        var na = 1 / Math.sqrt(L[a][a] + 1), nb = 1 / Math.sqrt(L[b][b] + 1);
        err = Math.max(err, Math.abs(M[a][b] - na * L[a][b] * nb));
      }
      return err;
    }
    var eRot = denseCheck('rot', 2), eDiag = denseCheck('diag', 3);
    check('rotation maps: Delta equals (D + I)^{-1/2} L (D + I)^{-1/2} with L from sheaf-math', eRot < 1e-12, 'max error ' + eRot.toExponential(1));
    check('diagonal maps: Delta equals (D + I)^{-1/2} L (D + I)^{-1/2} with L from sheaf-math', eDiag < 1e-12, 'max error ' + eDiag.toExponential(1));

    // Plain diffusion is the augmented normalised graph Laplacian. The kernel
    // of L is the constants, so the kernel of Delta is (D + I)^{1/2} 1.
    var Mp = laplacian(G, 'plain', null, 1), kv = [];
    for (v = 0; v < n; v++) kv.push(Math.sqrt(G.deg[v] + 1));
    var res = 0;
    for (v = 0; v < n; v++) { var s = 0; for (var u = 0; u < n; u++) s += Mp[v][u] * kv[u]; res = Math.max(res, Math.abs(s)); }
    check('plain Delta kills (D + I)^{1/2} 1', res < 1e-12, 'residual ' + res.toExponential(1));

    // With W1 = W2 = I, eps = 0 and the identity in place of elu, one layer is
    // an explicit Euler step of dX/dt = -Delta X.
    var X0 = new T(n, 2), maps0 = new T(G.src.length, 1);
    for (var i = 0; i < X0.d.length; i++) X0.d[i] = rnd() - 0.5;
    for (i = 0; i < maps0.d.length; i++) maps0.d[i] = rnd() * 6;
    var step = sub(X0, applyDelta(G, 'rot', maps0, chanMix(stalkMix(X0, eye(2), 2), eye(1), 2), 2));
    var Mr = laplacian(G, 'rot', maps0, 2), eu = 0;
    for (var a = 0; a < 2 * n; a++) { var sa = X0.d[a]; for (var b = 0; b < 2 * n; b++) sa -= Mr[a][b] * X0.d[b]; eu = Math.max(eu, Math.abs(sa - step.d[a])); }
    check('a layer with identity weights and activation is one Euler step of sheaf diffusion', eu < 1e-12, 'max error ' + eu.toExponential(1));

    // Gradients: autodiff against central finite differences for every kind.
    var words = [];
    for (v = 0; v < n; v++) { var w = []; for (var q = 0; q < 12; q++) if (rnd() < 0.3) w.push(q); if (!w.length) w.push(v); words.push(w); }
    var data = { X: { n: n, cols: 12, idx: words, val: words.map(function (w) { return w.map(function () { return 1 / w.length; }); }) },
      labels: [0, 1, 2, 0, 1, 2, 0, 1, 2], classes: 3, G: G };
    ['plain', 'diag', 'rot', 'mlp'].forEach(function (kind) {
      var M = model({ kind: kind, d: 2, f: 3, layers: 2, dropout: 0 }, data, 11);
      // Move eps and W1 off their initial values so their gradients are generic.
      M.params.forEach(function (p) { for (var i = 0; i < p.d.length; i++) p.d[i] += 0.3 * (rnd() - 0.5); });
      var all = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      var rec0 = []; tape = rec0;
      var loss = crossEntropy(M.forward(false), data.labels, all);
      tape = null;
      backward(loss, rec0);
      var worst = 0, count = 0;
      M.params.forEach(function (p) {
        for (var t2 = 0; t2 < 3; t2++) {
          var i = Math.floor(rnd() * p.d.length), x = p.d[i], hh = 1e-6;
          p.d[i] = x + hh; var lp = crossEntropy(M.forward(false), data.labels, all).d[0];
          p.d[i] = x - hh; var lm = crossEntropy(M.forward(false), data.labels, all).d[0];
          p.d[i] = x;
          var fd = (lp - lm) / (2 * hh), ad = p.g ? p.g[i] : 0;
          worst = Math.max(worst, Math.abs(fd - ad) / Math.max(1e-6, Math.abs(fd) + Math.abs(ad)));
          count++;
        }
      });
      check(kind + ': autodiff gradients match finite differences', worst < 1e-5, count + ' entries, worst relative error ' + worst.toExponential(1));
    });

    // Training fits: on a two-class graph where every edge joins the classes,
    // the sign-learning model reaches full training accuracy.
    var n2 = 16, e2 = [], lab2 = [];
    for (v = 0; v < n2; v++) lab2.push(v % 2);
    for (v = 0; v < n2; v++) { e2.push([v, (v + 1) % n2].sort(function (x, y) { return x - y; })); }
    e2.push([0, 5], [2, 9], [4, 11], [6, 13]);
    var w2 = lab2.map(function (c, v) { return [v % 3, 3 + (v % 4)]; });
    var d2 = { X: { n: n2, cols: 7, idx: w2, val: w2.map(function () { return [0.5, 0.5]; }) }, labels: lab2, classes: 2, G: graph(n2, e2) };
    var tr = trainer({ kind: 'diag', d: 1, f: 4, layers: 2, dropout: 0, lr: 0.02, wd: 0, epochs: 300, patience: 300 }, d2, 'tttttttttttttttt', 1).step(300);
    check('diag model fits a bipartite two-class toy graph', tr.history[tr.history.length - 1].train === 1,
      'train accuracy ' + tr.history[tr.history.length - 1].train.toFixed(2));
    return out;
  }

  // The page's four models. Hidden width 16 each; diffusion-only layers
  // (vanilla: W1 = W2 = I, no activation, eps = 0), as in the paper's
  // synthetic experiment; full: true switches to the eq. 55 layer.
  // Hyperparameters were fixed by hand, one set for all four, not tuned.
  function presets(full) {
    var base = { layers: 2, dropout: 0.5, lr: 0.02, wd: 5e-4, epochs: 300, patience: 100, vanilla: !full };
    function mk(o) { var c = {}; Object.keys(base).forEach(function (k) { c[k] = base[k]; }); Object.keys(o).forEach(function (k) { c[k] = o[k]; }); return c; }
    return {
      mlp: mk({ kind: 'mlp', d: 1, f: 16 }),
      plain: mk({ kind: 'plain', d: 1, f: 16 }),
      scalar: mk({ kind: 'diag', d: 1, f: 16, mapInit: 0.9 }),
      rot: mk({ kind: 'rot', d: 2, f: 8 })
    };
  }

  var api = { presets: presets, graph: graph, laplacian: laplacian, model: model, trainer: trainer, homophily: homophily,
    fromWebKB: fromWebKB, runChecks: runChecks, rng: rng,
    _ops: { T: T, applyDelta: applyDelta, crossEntropy: crossEntropy, backward: backward } };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else global.NSD = api;
})(this);
