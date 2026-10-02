"""Independent reference values for docs/japan-earthquakes/shared/04-gr.js.

Needs ETH seismostats and OpenQuake hmtk, so it is run by hand, not by the test harness:

  uv venv /tmp/ref && VIRTUAL_ENV=/tmp/ref uv pip install seismostats scipy pandas \
      shapely pyproj fiona pyogrio numpy
  VIRTUAL_ENV=/tmp/ref uv pip install --no-deps openquake-engine
  (plus decorator toml h5py psutil numba h3 alpha-shapes pyzmq, which hmtk imports)
  /tmp/ref/bin/python scripts/japan-04-reference.py

Runs on the real catalog (shared/data/earthquakes.csv, earthquakes only):
  - ETH seismostats: b by the Utsu / Aki maximum-likelihood estimator and its Shi-Bolt
    standard error at Mc 4.5 to 6.0, and Mc by b-stability (Cao & Gao 2002; Woessner &
    Wiemer 2005), stability range 0.5 (both with the Utsu form). The exact discrete ML b is also recorded.
  - OpenQuake hmtk: GardnerKnopoffType1 with GardnerKnopoffWindow (fs_time_prop 1), the
    same windows as the page. Compares mainshock flags with 04-gr.js and lists every
    event of M6+ on which they disagree.
  - scipy: the tapered Gutenberg-Richter survival function integrated numerically.
It prints a JSON block of the constants that 04-gr.js embeds as REFERENCE (the library is
self-contained, so runChecks needs no data file).
"""
import json, subprocess, sys, os
import numpy as np, pandas as pd

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
cat = pd.read_csv(os.path.join(ROOT, "docs/japan-earthquakes/shared/data/earthquakes.csv"))
cat = cat[cat["type"] == "earthquake"].copy()
cat["t"] = pd.to_datetime(cat["time"], utc=True)
cat["mag"] = cat["mag"].round(1)
cat = cat.sort_values("t").reset_index(drop=True)
mags = cat["mag"].to_numpy()
out = {}

from seismostats.analysis import ClassicBValueEstimator, UtsuBValueEstimator, estimate_mc_b_stability
est = UtsuBValueEstimator()   # Utsu (1966) half-bin form: the estimator the page uses
exact = ClassicBValueEstimator()  # exact discrete maximum likelihood, for the size of the approximation
out["b"] = []
for mc in [4.5, 4.8, 5.0, 5.2, 5.5, 6.0]:
    sel = mags[mags >= mc - 0.05]
    est.calculate(sel, mc=mc, delta_m=0.1)
    exact.calculate(sel, mc=mc, delta_m=0.1)
    out["b"].append({"mc": mc, "n": int(len(sel)), "b": float(est.b_value), "se_sb": float(est.std), "b_exact": float(exact.b_value)})
mc, info = estimate_mc_b_stability(mags, delta_m=0.1, mcs_test=np.round(np.arange(4.5, 6.6, 0.1), 1), b_method=UtsuBValueEstimator)
out["mc_b_stability"] = float(mc)
out["diff_bs"] = [float(v) for v in info["diff_bs"]]

# tapered G-R survival (Kagan 2002): S(M) = (M0t/M0)^beta exp((M0t - M0)/M0c), M0 = 10^(1.5 M + 9.1)
from scipy.integrate import quad
def surv(m, mt, beta, mcor):
    M0 = lambda x: 10 ** (1.5 * x + 9.1)
    return (M0(mt) / M0(m)) ** beta * np.exp((M0(mt) - M0(m)) / M0(mcor))
beta = 2 * 1.0 / 3
# density -dS/dm integrated from 8 to 9 against S(8) - S(9)
dens = lambda m: -(surv(m + 1e-6, 5.2, beta, 8.8) - surv(m - 1e-6, 5.2, beta, 8.8)) / 2e-6
out["tapered"] = {"mt": 5.2, "beta": beta, "corner": 8.8,
                  "S8": float(surv(8.0, 5.2, beta, 8.8)), "S9": float(surv(9.0, 5.2, beta, 8.8)),
                  "integral_8_9": float(quad(dens, 8.0, 9.0)[0])}

# Gardner-Knopoff
from openquake.hmtk.seismicity.catalogue import Catalogue
from openquake.hmtk.seismicity.declusterer.dec_gardner_knopoff import GardnerKnopoffType1
from openquake.hmtk.seismicity.declusterer.distance_time_windows import GardnerKnopoffWindow
t = cat["t"]
c = Catalogue()
c.data = {
    "year": t.dt.year.to_numpy().astype(int), "month": t.dt.month.to_numpy().astype(int),
    "day": t.dt.day.to_numpy().astype(int), "hour": t.dt.hour.to_numpy().astype(int),
    "minute": t.dt.minute.to_numpy().astype(int), "second": t.dt.second.to_numpy().astype(float),
    "longitude": cat["longitude"].to_numpy(), "latitude": cat["latitude"].to_numpy(),
    "depth": cat["depth"].fillna(10).to_numpy(), "magnitude": mags,
}
c.end_year = int(t.dt.year.max())
vcl, flag = GardnerKnopoffType1().decluster(c, {"time_distance_window": GardnerKnopoffWindow(), "fs_time_prop": 1.0})
oq_main = np.asarray(flag) == 0
cat["oq_main"] = oq_main
out["oq"] = {"n": int(len(cat)), "mainshocks": int(oq_main.sum())}
cat.to_pickle(os.path.join(os.environ.get("TMPDIR", "/tmp"), "japan04-oq.pkl"))
# windows at M6 and M9.1 as OQ computes them
sw_s, sw_t = GardnerKnopoffWindow().calc(np.array([6.0, 9.1]), None)
out["windows"] = {"M6_km": float(sw_s[0]), "M6_days": float(sw_t[0] * 364.75), "M91_km": float(sw_s[1]), "M91_days": float(sw_t[1] * 364.75)}
# fixtures that 04-gr.js embeds: the catalog's magnitude histogram (0.1 bins from 4.5), and the
# M5.5+ events of 2010-2012 with OpenQuake's flags from a run on that subset
hist = np.bincount(np.round((mags - 4.5) * 10).astype(int))
out["hist"] = [int(v) for v in hist]
sub = cat[(t >= "2010-01-01") & (t < "2013-01-01") & (cat["mag"] >= 5.5)].reset_index(drop=True)
ts = sub["t"]
c2 = Catalogue()
c2.data = {"year": ts.dt.year.to_numpy().astype(int), "month": ts.dt.month.to_numpy().astype(int),
           "day": ts.dt.day.to_numpy().astype(int), "hour": ts.dt.hour.to_numpy().astype(int),
           "minute": ts.dt.minute.to_numpy().astype(int), "second": ts.dt.second.to_numpy().astype(float),
           "longitude": sub["longitude"].to_numpy(), "latitude": sub["latitude"].to_numpy(),
           "depth": sub["depth"].fillna(10).to_numpy(), "magnitude": sub["mag"].to_numpy()}
c2.end_year = 2012
_, f2 = GardnerKnopoffType1().decluster(c2, {"time_distance_window": GardnerKnopoffWindow(), "fs_time_prop": 1.0})
out["gk_fixture"] = [[int(ts[i].value // 10**6), round(float(sub["latitude"][i]), 3), round(float(sub["longitude"][i]), 3),
                      float(sub["mag"][i]), int(f2[i] == 0)] for i in range(len(sub))]
out["gk_flags_full"] = [int(v) for v in oq_main]
print(json.dumps(out, ensure_ascii=False))
