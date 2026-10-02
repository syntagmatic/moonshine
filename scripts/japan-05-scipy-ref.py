"""Reference values for docs/japan-earthquakes/shared/05-renewal.js, from scipy.

    python3 scripts/japan-05-scipy-ref.py

Prints two JS tables to paste into 05-renewal.js:
  BPT_CDF_REF  [mu, alpha, t, cdf]  from scipy.stats.invgauss (BPT = inverse
               Gaussian with mean mu and shape mu/alpha^2, i.e. invgauss(alpha^2,
               scale=mu/alpha^2)), plus the pdf.
  MLE_REF      [name, mu, alpha]    the maximum-likelihood BPT fit of an interval
               set by Nelder-Mead on the scipy log-pdf (independent of the
               closed form the library uses).
scipy 1.13 was used.
"""
import numpy as np
from scipy.stats import invgauss
from scipy.optimize import minimize

def bpt(mu, a):
    return invgauss(a * a, scale=mu / (a * a))

pts = []
for mu in (88.2, 117, 180, 575):
    for a in (0.15, 0.24, 0.5, 1.0):
        for f in (0.3, 0.55, 0.9, 1.25, 1.6, 2.4):
            pts.append((mu, a, mu * f))
rows = []
for mu, a, t in pts[::5]:
    d = bpt(mu, a)
    rows.append((mu, a, round(t, 6), float(d.cdf(round(t, 6))), float(d.pdf(round(t, 6)))))
print("const BPT_REF = [")
for r in rows:
    print("  [%g, %g, %g, %.15g, %.15g]," % r)
print("];")

cases = {
    "I": np.diff([684.9, 887.7, 1098.1, 1361.6, 1498.7, 1605.1, 1707.8, 1855.0, 1946.0]),
    "III": np.diff([1361.6, 1498.7, 1605.1, 1707.8, 1855.0, 1946.0]),
    "V": np.diff([1707.8, 1855.0, 1946.0]),
}
print("const MLE_REF = [")
for k, iv in cases.items():
    nll = lambda p: -bpt(np.exp(p[0]), np.exp(p[1])).logpdf(iv).sum()
    r = minimize(nll, [np.log(iv.mean()), np.log(0.3)], method="Nelder-Mead",
                 options={"xatol": 1e-12, "fatol": 1e-14, "maxiter": 4000})
    mu, a = np.exp(r.x)
    print('  ["%s", %.9g, %.9g],' % (k, mu, a))
print("];")
