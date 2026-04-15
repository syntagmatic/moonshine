// infogeo-math.js — math engine for "Information Geometry: The Space of Probability".
//
// Attaches a single `IG` object to the global scope (no modules, no build step).
// Act I needs: Fisher metrics for the basic parametric families, KL divergence,
// score functions, exponential-family canonicalisation, and geodesic helpers on
// the Poincaré half-plane (which is where the Gaussian family actually lives).
//
// Sign and parameter conventions
//   - A 1D Gaussian is parameterised as N(μ, σ) with σ > 0 (NOT σ²). The
//     Fisher matrix in (μ, σ) coordinates is diag(1/σ², 2/σ²). When we
//     switch to the (μ, σ²) parameterisation the (2,2) entry becomes
//     1/(2σ⁴). Both conversions are implemented so that explainer 02 can
//     show parameterisation invariance.
//   - KL is the natural-log version. D_KL(P || Q) = ∫ p log(p/q) dx. It
//     returns nats, not bits.
//   - All roots of integrals are closed-form for the exponential families
//     we handle. Where a closed form is unavailable we fall back on Simpson
//     quadrature over an adaptive grid (only needed for the asymmetric
//     heatmap in explainer 04 where one family is Gaussian and one is
//     Laplace, say).

(function (global) {
  'use strict';

  var LOG2PI = Math.log(2 * Math.PI);
  var EPS = 1e-12;

  // ───────────────────────────────────────────── Numerical helpers ─────

  function safeLog(x) {
    return Math.log(Math.max(x, EPS));
  }

  // Simpson quadrature on [a,b] with n (even) subintervals.
  function simpson(f, a, b, n) {
    if (n % 2 === 1) n += 1;
    var h = (b - a) / n;
    var s = f(a) + f(b);
    for (var i = 1; i < n; i++) {
      s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
    }
    return (h / 3) * s;
  }

  // 2×2 symmetric matrix inverse. Explicit so we never depend on mathjs.
  function inv2x2(m) {
    var a = m[0][0], b = m[0][1], c = m[1][0], d = m[1][1];
    var det = a * d - b * c;
    if (Math.abs(det) < EPS) throw new Error('[IG] inv2x2: singular matrix');
    return [
      [ d / det, -b / det],
      [-c / det,  a / det]
    ];
  }

  // 2×2 quadratic form x^T M x.
  function quad2(m, x) {
    return m[0][0]*x[0]*x[0] + (m[0][1] + m[1][0])*x[0]*x[1] + m[1][1]*x[1]*x[1];
  }

  // ───────────────────────────────────────────── Gaussian family ─────
  //
  // N(μ, σ), σ > 0. Log-density:
  //   log p(x|μ,σ) = -½ log(2π) - log σ - (x-μ)² / (2σ²)
  //
  // Score function ∂ log p:
  //   ∂/∂μ = (x-μ)/σ²
  //   ∂/∂σ = -1/σ + (x-μ)²/σ³
  //
  // Expected outer product of scores = Fisher matrix:
  //   E[(∂μ log p)²]  = E[(x-μ)²]/σ⁴ = 1/σ²
  //   E[(∂σ log p)²]  = 2/σ²
  //   E[∂μ ∂σ log p] = 0
  //
  // So g(μ,σ) = diag(1/σ², 2/σ²). The determinant scales as 1/σ⁴ and the
  // induced geometry is the Poincaré half-plane with constant curvature
  // κ = -½ (verified in explainer 02).

  function gaussianPdf(x, mu, sigma) {
    var z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  }

  function gaussianLogPdf(x, mu, sigma) {
    var z = (x - mu) / sigma;
    return -0.5 * LOG2PI - Math.log(sigma) - 0.5 * z * z;
  }

  // Score function (gradient of log p w.r.t. parameters).
  function gaussianScore(x, mu, sigma) {
    var d = x - mu;
    return {
      mu:    d / (sigma * sigma),
      sigma: -1 / sigma + (d * d) / (sigma * sigma * sigma)
    };
  }

  // Fisher matrix in (μ, σ) coordinates.
  function gaussianFisherMuSigma(mu, sigma) {
    var s2 = sigma * sigma;
    return [
      [1 / s2, 0],
      [0,      2 / s2]
    ];
  }

  // Fisher matrix in (μ, σ²) coordinates. Conversion: if θ' = (μ, v) with
  // v = σ², then by the change-of-variable rule g' = J^T g J where J is the
  // Jacobian ∂θ/∂θ'. Here ∂σ/∂v = 1/(2σ) so the (2,2) entry becomes
  // (2/σ²) · (1/(2σ))² = 1/(2σ⁴).
  function gaussianFisherMuVar(mu, variance) {
    return [
      [1 / variance,  0],
      [0,             1 / (2 * variance * variance)]
    ];
  }

  // Closed-form KL between two Gaussians. D_KL(N(μ1,σ1) || N(μ2,σ2)) =
  //   log(σ2/σ1) + (σ1² + (μ1-μ2)²)/(2σ2²) - ½.
  function klGaussian(mu1, sigma1, mu2, sigma2) {
    var v1 = sigma1 * sigma1;
    var v2 = sigma2 * sigma2;
    var dmu = mu1 - mu2;
    return Math.log(sigma2 / sigma1) + (v1 + dmu * dmu) / (2 * v2) - 0.5;
  }

  // Jeffreys (symmetrised KL) for Gaussians.
  function jeffreysGaussian(mu1, sigma1, mu2, sigma2) {
    return klGaussian(mu1, sigma1, mu2, sigma2) +
           klGaussian(mu2, sigma2, mu1, sigma1);
  }

  // Hellinger² between two Gaussians (proper symmetric metric).
  function hellinger2Gaussian(mu1, sigma1, mu2, sigma2) {
    var v1 = sigma1 * sigma1;
    var v2 = sigma2 * sigma2;
    var dmu = mu1 - mu2;
    var num = 2 * sigma1 * sigma2;
    var den = v1 + v2;
    var expTerm = Math.exp(-0.25 * (dmu * dmu) / den);
    return 1 - Math.sqrt(num / den) * expTerm;
  }

  // ───────────────────────────────────────────── Bernoulli family ─────
  //
  // Bern(p), p ∈ (0,1). log p(x|p) = x log p + (1-x) log(1-p).
  //
  // Fisher (scalar) = 1/(p(1-p)). This blows up at p=0 and p=1, reflecting
  // the fact that a coin near certainty is very easy to distinguish from
  // any other coin (so an infinitesimal change in p is "huge" in KL terms).

  function bernoulliFisher(p) {
    if (p <= 0 || p >= 1) return Infinity;
    return 1 / (p * (1 - p));
  }

  function klBernoulli(p, q) {
    if (q <= 0 || q >= 1) return Infinity;
    var a = p > 0 ? p * Math.log(p / q) : 0;
    var b = p < 1 ? (1 - p) * Math.log((1 - p) / (1 - q)) : 0;
    return a + b;
  }

  // ───────────────────────────────────────────── Beta family ─────
  //
  // Beta(α, β), both > 0. Used in explainer 02 for the Poincaré-disk
  // picture (a different coordinate system from Gaussian but with similar
  // hyperbolic flavour). The Fisher matrix requires the trigamma ψ'.

  // Trigamma ψ'(x), the derivative of the digamma function. Series
  // approximation good for x > 6; we shift by recurrence for small x.
  function trigamma(x) {
    var v = 0;
    while (x < 6) {
      v += 1 / (x * x);
      x += 1;
    }
    // Asymptotic expansion for large x.
    var ix = 1 / x;
    var ix2 = ix * ix;
    v += ix + 0.5 * ix2 +
         ix2 * ix / 6 -
         ix2 * ix2 * ix / 30 +
         ix2 * ix2 * ix2 * ix / 42;
    return v;
  }

  function betaFisher(alpha, beta) {
    var tab = trigamma(alpha + beta);
    return [
      [trigamma(alpha) - tab, -tab],
      [-tab,                  trigamma(beta) - tab]
    ];
  }

  // ───────────────────────────────────────────── Score function API ─────
  //
  // A generic score function calculator. Given a log-pdf function
  // logp(x, theta) and a parameter vector theta, return the gradient
  // w.r.t. theta via central differences. Used in explainer 05 and as
  // the core for the Taylor-expansion sanity check.

  function numericScore(logp, x, theta, h) {
    h = h || 1e-5;
    var grad = new Array(theta.length);
    for (var i = 0; i < theta.length; i++) {
      var tp = theta.slice(); tp[i] += h;
      var tm = theta.slice(); tm[i] -= h;
      grad[i] = (logp(x, tp) - logp(x, tm)) / (2 * h);
    }
    return grad;
  }

  // Numerical Fisher matrix via Monte Carlo (used for sanity checks in
  // test.html — never on the main figures, which use the closed forms).
  function numericFisher(sampler, logp, theta, samples) {
    samples = samples || 5000;
    var n = theta.length;
    var m = [];
    for (var i = 0; i < n; i++) {
      m.push(new Array(n).fill(0));
    }
    for (var s = 0; s < samples; s++) {
      var x = sampler(theta);
      var g = numericScore(logp, x, theta);
      for (var i2 = 0; i2 < n; i2++) {
        for (var j = 0; j < n; j++) {
          m[i2][j] += g[i2] * g[j];
        }
      }
    }
    for (var i3 = 0; i3 < n; i3++) {
      for (var j2 = 0; j2 < n; j2++) {
        m[i3][j2] /= samples;
      }
    }
    return m;
  }

  // ───────────────────────────────────────────── Poincaré half-plane ─────
  //
  // The (μ, σ) Gaussian manifold is isometric to the upper half-plane with
  // Fisher metric ds² = (dμ² + 2 dσ²) / σ². To reduce this to the standard
  // Poincaré half-plane metric ds² = (dx² + dy²) / y², substitute
  //   ν = √2 · σ      (so dν² = 2 dσ², σ = ν/√2)
  // which turns the Fisher metric into 2·(dμ² + dν²)/ν². So the Gaussian
  // geometry is TWICE the standard Poincaré half-plane metric — distances
  // are √2 times longer and the sectional curvature is κ = -1/2 (not -1).
  //
  // All helpers below do their math in (μ, ν) coordinates and convert back
  // to (μ, σ) at the end. Points are { mu, sigma } with sigma > 0.

  // Hyperbolic distance in the Gaussian Fisher metric.
  //
  //   d_Fisher(P1, P2) = √2 · arccosh(1 + ((μ1-μ2)² + 2(σ1-σ2)²) / (4 σ1 σ2))
  //
  // Derivation: the standard Poincaré distance with y = ν is
  //   arccosh(1 + ((μ1-μ2)² + (ν1-ν2)²) / (2 ν1 ν2))
  // Substituting ν = √2 σ gives (ν1-ν2)² = 2(σ1-σ2)² and 2 ν1 ν2 = 4 σ1 σ2.
  // Multiply by √2 because the Fisher metric is twice the standard one.
  function poincareGaussianDistance(p1, p2) {
    var dmu = p1.mu - p2.mu;
    var dsig = p1.sigma - p2.sigma;
    var arg = 1 + (dmu * dmu + 2 * dsig * dsig) / (4 * p1.sigma * p2.sigma);
    return Math.SQRT2 * Math.acosh(arg);
  }

  // Geodesic from P1 to P2 under the Gaussian Fisher metric. Returns a
  // function t → { mu, sigma } for t ∈ [0,1], with t=0 at P1 and t=1 at P2.
  //
  // NB: the parameterisation is NOT arc-length uniform along the curve —
  // t is linear in the central angle of the underlying semicircle in
  // (μ, ν) coordinates. This is fine for drawing the curve; use
  // poincareGaussianDistance() for true distances.
  //
  // Two cases:
  //   (a) Vertical (μ1 = μ2): σ(t) = σ1 · (σ2/σ1)^t. This IS arc-length
  //       uniform because ds = √2 dσ/σ along μ=const.
  //   (b) Semicircle: in (μ, ν) with ν = √2·σ, the geodesic is a Euclidean
  //       semicircle centered on the ν = 0 axis. Parameterise by the angle
  //       φ it subtends, then convert back to (μ, σ).
  function poincareGaussianGeodesic(p1, p2) {
    if (Math.abs(p1.mu - p2.mu) < EPS) {
      var lo = Math.log(p1.sigma);
      var hi = Math.log(p2.sigma);
      return function(t) {
        return { mu: p1.mu, sigma: Math.exp(lo + (hi - lo) * t) };
      };
    }
    var nu1 = Math.SQRT2 * p1.sigma;
    var nu2 = Math.SQRT2 * p2.sigma;
    // (μ1-c)² + ν1² = r² = (μ2-c)² + ν2² → solve for c, r.
    var c = ((p1.mu * p1.mu - p2.mu * p2.mu) + (nu1 * nu1 - nu2 * nu2))
          / (2 * (p1.mu - p2.mu));
    var r = Math.sqrt((p1.mu - c) * (p1.mu - c) + nu1 * nu1);
    var phi1 = Math.atan2(nu1, p1.mu - c);
    var phi2 = Math.atan2(nu2, p2.mu - c);
    return function(t) {
      var phi = phi1 + (phi2 - phi1) * t;
      return {
        mu: c + r * Math.cos(phi),
        sigma: (r * Math.sin(phi)) / Math.SQRT2
      };
    };
  }

  // Explicit semicircle parameters for drawing — returns the (μ, ν)
  // circle (c, r) and the angle range, useful if you want to sweep the
  // geodesic in SVG with a path arc. Throws on a vertical geodesic.
  function poincareGaussianGeodesicArc(p1, p2) {
    if (Math.abs(p1.mu - p2.mu) < EPS) {
      throw new Error('[IG] vertical geodesic has no circle representation');
    }
    var nu1 = Math.SQRT2 * p1.sigma;
    var nu2 = Math.SQRT2 * p2.sigma;
    var c = ((p1.mu * p1.mu - p2.mu * p2.mu) + (nu1 * nu1 - nu2 * nu2))
          / (2 * (p1.mu - p2.mu));
    var r = Math.sqrt((p1.mu - c) * (p1.mu - c) + nu1 * nu1);
    return {
      center: c,
      radius: r,
      phi1: Math.atan2(nu1, p1.mu - c),
      phi2: Math.atan2(nu2, p2.mu - c)
    };
  }

  // ───────────────────────────────────────────── Exponential families ─────
  //
  // An exponential family has log-density
  //   log p(x|θ) = <θ, T(x)> - ψ(θ) + h(x)
  // The log-partition ψ is the Legendre dual of the negative entropy and
  // generates moments via differentiation.
  //
  // For a 1D Gaussian with known unit variance, natural parameter θ = μ
  // and ψ(θ) = θ²/2 + ½ log(2π). The expectation parameter is η = dψ/dθ = θ.
  //
  // Here we implement the general (μ, σ) Gaussian, where there are TWO
  // natural parameters: θ₁ = μ/σ², θ₂ = -1/(2σ²), with sufficient statistics
  // T(x) = (x, x²), and
  //   ψ(θ₁,θ₂) = -θ₁²/(4θ₂) - ½ log(-2θ₂) + ½ log(2π).
  //
  // The expectation parameters are η₁ = μ, η₂ = μ² + σ². The Legendre dual
  // potential (negative entropy) is
  //   ϕ(η₁,η₂) = -½ log(2π(η₂ - η₁²)) - ½.

  function gaussianToNatural(mu, sigma) {
    var v = sigma * sigma;
    return { theta1: mu / v, theta2: -1 / (2 * v) };
  }

  function gaussianFromNatural(theta1, theta2) {
    var v = -1 / (2 * theta2);
    return { mu: theta1 * v, sigma: Math.sqrt(v) };
  }

  function gaussianToExpectation(mu, sigma) {
    return { eta1: mu, eta2: mu * mu + sigma * sigma };
  }

  function gaussianFromExpectation(eta1, eta2) {
    var v = eta2 - eta1 * eta1;
    if (v <= 0) throw new Error('[IG] eta2 must exceed eta1²');
    return { mu: eta1, sigma: Math.sqrt(v) };
  }

  // Log-partition ψ(θ) for the Gaussian family.
  function gaussianLogPartition(theta1, theta2) {
    if (theta2 >= 0) throw new Error('[IG] θ₂ must be negative');
    return -(theta1 * theta1) / (4 * theta2)
           - 0.5 * Math.log(-2 * theta2)
           + 0.5 * LOG2PI;
  }

  // Dual potential ϕ(η) = negative differential entropy of the Gaussian.
  function gaussianDualPotential(eta1, eta2) {
    var v = eta2 - eta1 * eta1;
    if (v <= 0) throw new Error('[IG] eta2 must exceed eta1²');
    return -0.5 * Math.log(2 * Math.PI * v) - 0.5;
  }

  // ───────────────────────────────────────────── e / m geodesics ─────
  //
  // On a dually flat statistical manifold there are two privileged classes
  // of "straight lines" (Act II material):
  //
  //   • e-geodesic (exponential, α=+1): in natural coordinates θ it is a
  //     straight line. For an exponential family the e-geodesic between
  //     two members is itself a member of the family, because the
  //     family is e-autoparallel.
  //
  //   • m-geodesic (mixture, α=-1): in expectation coordinates η it is a
  //     straight line. For an exponential family considered as its own
  //     manifold, the η-linear curve is an m-geodesic. On the larger
  //     manifold of all distributions, the m-geodesic is literally the
  //     probability mixture (1-t)P + tQ, which for two Gaussians is a
  //     bimodal distribution that leaves the Gaussian family entirely.
  //
  // The helpers below produce both curves for Gaussians. Each returns a
  // function of t ∈ [0,1] giving a (μ, σ) sample.

  function gaussianEGeodesic(p1, p2) {
    var n1 = gaussianToNatural(p1.mu, p1.sigma);
    var n2 = gaussianToNatural(p2.mu, p2.sigma);
    return function(t) {
      var theta1 = (1 - t) * n1.theta1 + t * n2.theta1;
      var theta2 = (1 - t) * n1.theta2 + t * n2.theta2;
      return gaussianFromNatural(theta1, theta2);
    };
  }

  function gaussianMGeodesic(p1, p2) {
    var e1 = gaussianToExpectation(p1.mu, p1.sigma);
    var e2 = gaussianToExpectation(p2.mu, p2.sigma);
    return function(t) {
      var eta1 = (1 - t) * e1.eta1 + t * e2.eta1;
      var eta2 = (1 - t) * e1.eta2 + t * e2.eta2;
      return gaussianFromExpectation(eta1, eta2);
    };
  }

  // Mixture of two Gaussians: the genuine m-geodesic on the manifold of
  // ALL distributions between N(mu1, sigma1) and N(mu2, sigma2). Returns
  // a density function of x, parameterised by the mixture weight t.
  function gaussianMixtureDensity(p1, p2) {
    return function(t, x) {
      return (1 - t) * gaussianPdf(x, p1.mu, p1.sigma) +
                   t * gaussianPdf(x, p2.mu, p2.sigma);
    };
  }

  // ───────────────────────────────────────────── Bregman divergences ─────
  //
  // D_φ(x || y) = φ(x) - φ(y) - <∇φ(y), x - y>
  //
  // A generator is an object { phi(x), grad(x) } where phi is scalar-
  // valued and grad returns a vector of the same length as x. For 1-D
  // inputs x, grad returns a number.

  function bregman(gen, x, y) {
    var gy = gen.grad(y);
    var cross;
    if (typeof x === 'number') {
      cross = gy * (x - y);
    } else {
      cross = 0;
      for (var i = 0; i < x.length; i++) cross += gy[i] * (x[i] - y[i]);
    }
    return gen.phi(x) - gen.phi(y) - cross;
  }

  // Reference generators.
  var BregmanGenerators = {
    // φ(x) = ‖x‖² / 2  →  squared Euclidean.
    squaredEuclidean: {
      phi:  function(x) {
        if (typeof x === 'number') return 0.5 * x * x;
        var s = 0;
        for (var i = 0; i < x.length; i++) s += x[i] * x[i];
        return 0.5 * s;
      },
      grad: function(x) { return typeof x === 'number' ? x : x.slice(); }
    },
    // φ(x) = Σ xᵢ log xᵢ − xᵢ  →  KL divergence on unnormalised measures.
    // Gradient ∂/∂xᵢ = log xᵢ.
    negativeEntropy: {
      phi: function(x) {
        if (typeof x === 'number') return x * safeLog(x) - x;
        var s = 0;
        for (var i = 0; i < x.length; i++) s += x[i] * safeLog(x[i]) - x[i];
        return s;
      },
      grad: function(x) {
        if (typeof x === 'number') return safeLog(x);
        return x.map(function(v) { return safeLog(v); });
      }
    },
    // φ(x) = -log x on positive reals  →  Itakura-Saito (speech/audio).
    itakuraSaito: {
      phi:  function(x) { return -safeLog(x); },
      grad: function(x) { return -1 / Math.max(x, EPS); }
    },
    // φ(x) = log(1 + eˣ)  →  softplus, for binary logistic loss.
    softplus: {
      phi: function(x) {
        return x > 0 ? x + Math.log(1 + Math.exp(-x)) : Math.log(1 + Math.exp(x));
      },
      grad: function(x) { return 1 / (1 + Math.exp(-x)); }
    }
  };

  // ───────────────────────────────────────────── Natural gradient ─────
  //
  // Standard gradient descent over θ ignores the curvature of the
  // statistical manifold. Natural gradient descent pre-multiplies ∇L by
  // the inverse Fisher matrix to follow the intrinsic steepest-descent
  // direction: θ_{t+1} = θ_t − η G(θ_t)⁻¹ ∇L(θ_t).
  //
  // The helper below takes a point and a Euclidean gradient and returns
  // the natural-gradient step for the 1D Gaussian family in (μ, σ)
  // coordinates, where G = diag(1/σ², 2/σ²).

  function gaussianNaturalGradientStep(mu, sigma, gradMu, gradSigma, stepSize) {
    // G⁻¹ = diag(σ², σ²/2)
    var s2 = sigma * sigma;
    return {
      mu:    mu - stepSize * s2 * gradMu,
      sigma: sigma - stepSize * (s2 / 2) * gradSigma
    };
  }

  function gaussianEuclideanGradientStep(mu, sigma, gradMu, gradSigma, stepSize) {
    return {
      mu:    mu - stepSize * gradMu,
      sigma: sigma - stepSize * gradSigma
    };
  }

  // Toy "negative log-likelihood" loss for Gaussian MLE on a synthetic
  // data set (mean m, variance v). L(μ, σ) = N · [ log σ + (v + (m-μ)²)/(2σ²) ].
  // Gradient: dL/dμ = −N · (m − μ) / σ²,  dL/dσ = N/σ − N·(v + (m-μ)²)/σ³.
  function gaussianMLELoss(mu, sigma, dataMean, dataVar, n) {
    n = n || 1;
    return n * (Math.log(sigma) + (dataVar + (dataMean - mu) * (dataMean - mu)) / (2 * sigma * sigma));
  }
  function gaussianMLEGrad(mu, sigma, dataMean, dataVar, n) {
    n = n || 1;
    var s2 = sigma * sigma;
    var s3 = s2 * sigma;
    return {
      mu:    -n * (dataMean - mu) / s2,
      sigma:  n / sigma - n * (dataVar + (dataMean - mu) * (dataMean - mu)) / s3
    };
  }

  // ───────────────────────────────────────────── EM for Gaussian mixture ─────
  //
  // Standard two-or-more-component Gaussian mixture fit by Expectation-
  // Maximization. Act III explainer 12 wants to drive this one step at a
  // time and watch the iterates converge.
  //
  // State: { weights: [π_k], means: [μ_k], sigmas: [σ_k] }, data: [x_i].
  // The E-step computes responsibilities γ[i][k] = π_k N(x_i|μ_k,σ_k) / Σ_j.
  // The M-step updates weights/means/sigmas from the responsibilities.
  // Log-likelihood is Σ_i log Σ_k π_k N(x_i|μ_k,σ_k).

  function emEStep(state, data) {
    var K = state.weights.length;
    var N = data.length;
    var gamma = new Array(N);
    for (var i = 0; i < N; i++) {
      var row = new Array(K);
      var total = 0;
      for (var k = 0; k < K; k++) {
        row[k] = state.weights[k] * gaussianPdf(data[i], state.means[k], state.sigmas[k]);
        total += row[k];
      }
      if (total < EPS) total = EPS;
      for (var k2 = 0; k2 < K; k2++) row[k2] /= total;
      gamma[i] = row;
    }
    return gamma;
  }

  function emMStep(gamma, data) {
    var K = gamma[0].length;
    var N = data.length;
    var weights = new Array(K).fill(0);
    var means = new Array(K).fill(0);
    var sigmas = new Array(K).fill(0);
    for (var k = 0; k < K; k++) {
      var Nk = 0;
      var sum = 0;
      for (var i = 0; i < N; i++) {
        Nk += gamma[i][k];
        sum += gamma[i][k] * data[i];
      }
      if (Nk < EPS) Nk = EPS;
      weights[k] = Nk / N;
      means[k] = sum / Nk;
      var varSum = 0;
      for (var i2 = 0; i2 < N; i2++) {
        var d = data[i2] - means[k];
        varSum += gamma[i2][k] * d * d;
      }
      sigmas[k] = Math.sqrt(Math.max(varSum / Nk, 1e-6));
    }
    return { weights: weights, means: means, sigmas: sigmas };
  }

  function emLogLikelihood(state, data) {
    var K = state.weights.length;
    var N = data.length;
    var s = 0;
    for (var i = 0; i < N; i++) {
      var mix = 0;
      for (var k = 0; k < K; k++) {
        mix += state.weights[k] * gaussianPdf(data[i], state.means[k], state.sigmas[k]);
      }
      s += safeLog(mix);
    }
    return s;
  }

  function emStep(state, data) {
    var gamma = emEStep(state, data);
    return emMStep(gamma, data);
  }

  // ───────────────────────────────────────────── Local KL ≈ Fisher ─────
  //
  // Given a family with log-pdf logp(x, theta) and a sampler that draws
  // x ~ p(·|theta), compute D_KL(p(·|theta) || p(·|theta + dtheta)) either
  // via a closed form (for Gaussian) or via Monte Carlo. The Fisher
  // quadratic form (1/2) dθ^T g(θ) dθ should agree with the KL up to
  // higher-order terms — this is the subject of explainer 05.

  function gaussianKLQuadraticForm(mu, sigma, dmu, dsigma) {
    var g = gaussianFisherMuSigma(mu, sigma);
    return 0.5 * quad2(g, [dmu, dsigma]);
  }

  function gaussianKLStep(mu, sigma, dmu, dsigma) {
    return klGaussian(mu, sigma, mu + dmu, sigma + dsigma);
  }

  // ───────────────────────────────────────────── Exports ─────

  var IG = {
    // Numerical primitives
    simpson: simpson,
    inv2x2: inv2x2,
    quad2: quad2,
    safeLog: safeLog,

    // Gaussian family
    gaussianPdf: gaussianPdf,
    gaussianLogPdf: gaussianLogPdf,
    gaussianScore: gaussianScore,
    gaussianFisherMuSigma: gaussianFisherMuSigma,
    gaussianFisherMuVar: gaussianFisherMuVar,
    klGaussian: klGaussian,
    jeffreysGaussian: jeffreysGaussian,
    hellinger2Gaussian: hellinger2Gaussian,
    gaussianKLQuadraticForm: gaussianKLQuadraticForm,
    gaussianKLStep: gaussianKLStep,

    // Bernoulli
    bernoulliFisher: bernoulliFisher,
    klBernoulli: klBernoulli,

    // Beta
    trigamma: trigamma,
    betaFisher: betaFisher,

    // Generic score / Fisher (for validation)
    numericScore: numericScore,
    numericFisher: numericFisher,

    // Poincaré / hyperbolic helpers
    poincareGaussianDistance: poincareGaussianDistance,
    poincareGaussianGeodesic: poincareGaussianGeodesic,
    poincareGaussianGeodesicArc: poincareGaussianGeodesicArc,

    // Exponential-family conversions for Gaussian
    gaussianToNatural: gaussianToNatural,
    gaussianFromNatural: gaussianFromNatural,
    gaussianToExpectation: gaussianToExpectation,
    gaussianFromExpectation: gaussianFromExpectation,
    gaussianLogPartition: gaussianLogPartition,
    gaussianDualPotential: gaussianDualPotential,

    // e/m geodesics for Gaussians
    gaussianEGeodesic: gaussianEGeodesic,
    gaussianMGeodesic: gaussianMGeodesic,
    gaussianMixtureDensity: gaussianMixtureDensity,

    // Bregman divergences
    bregman: bregman,
    BregmanGenerators: BregmanGenerators,

    // Natural gradient helpers
    gaussianNaturalGradientStep: gaussianNaturalGradientStep,
    gaussianEuclideanGradientStep: gaussianEuclideanGradientStep,
    gaussianMLELoss: gaussianMLELoss,
    gaussianMLEGrad: gaussianMLEGrad,

    // EM for Gaussian mixtures
    emEStep: emEStep,
    emMStep: emMStep,
    emStep: emStep,
    emLogLikelihood: emLogLikelihood,

    // Constants
    LOG2PI: LOG2PI,
    EPS: EPS
  };

  global.IG = IG;

})(typeof window !== 'undefined' ? window : globalThis);
