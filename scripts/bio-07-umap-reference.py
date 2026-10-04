"""umap-learn reference values for essay-07.js's UMAP (see bio-07-umap-reference.mjs)."""
import json, sys, warnings
import numpy as np
import scipy.sparse as sp
from scipy.stats import spearmanr
from sklearn.metrics import pairwise_distances
import umap
from umap.umap_ import fuzzy_simplicial_set, find_ab_params
from umap.spectral import component_layout

warnings.filterwarnings("ignore")
inp = json.load(open(sys.argv[1])); seeds = int(sys.argv[3])
X = np.array(inp["X"]); lab = np.array(inp["labels"]); n = len(X)
a, b = find_ab_params(1.0, 0.1)
G, sig, rho = fuzzy_simplicial_set(pairwise_distances(X), 15, np.random.RandomState(0), "precomputed", {}, None, None)[:3]
row0 = G.tocsr()[0]
nc, cl = sp.csgraph.connected_components(G)
meta = component_layout(X, nc, cl, 2, np.random.RandomState(0))
DH = pairwise_distances(X); np.fill_diagonal(DH, np.inf); OH = np.argsort(DH, axis=1, kind="stable")
ch = np.array([X[lab == t].mean(0) for t in range(5)]); iu = np.triu_indices(5, 1); cdh = pairwise_distances(ch)[iu]
def measures(Y):
    DL = pairwise_distances(Y); np.fill_diagonal(DL, np.inf); OL = np.argsort(DL, axis=1, kind="stable")
    rec = [float(np.mean([len(set(OH[i, :k]) & set(OL[i, :k])) / k for i in range(n)])) for k in (10, 15, 100, 200)]
    c = np.array([Y[lab == t].mean(0) for t in range(5)])
    return rec + [float(spearmanr(cdh, pairwise_distances(c)[iu])[0])]
runs = {}
for init in ("spectral", "random"):
    rows = np.array([measures(umap.UMAP(random_state=s, init=init).fit_transform(X)) for s in range(seeds)])
    runs[init] = {"mean": rows.mean(0).tolist(), "sdRho": float(rows[:, 4].std(ddof=1)), "n": seeds}
out = {"version": umap.__version__, "a": float(a), "b": float(b), "sigma": sig[:5].astype(float).tolist(), "rho": rho[:5].astype(float).tolist(),
       "nnz": int(G.nnz), "row0": {"idx": row0.indices.tolist(), "val": row0.data.astype(float).tolist()},
       "components": int(nc), "componentTypes": [int(np.bincount(lab[cl == c]).argmax()) for c in range(nc)], "meta": meta.tolist(), "runs": runs}
json.dump(out, open(sys.argv[2], "w"))
