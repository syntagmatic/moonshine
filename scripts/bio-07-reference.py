"""Independent reference values for essay-07.js (see bio-07-reference.mjs)."""
import json, sys
import numpy as np
from scipy.stats import spearmanr
from scipy.spatial.distance import pdist, squareform
from sklearn.manifold import TSNE
from sklearn.manifold._t_sne import _joint_probabilities

inp = json.load(open(sys.argv[1]))
X = np.array(inp["X"]); M = np.array(inp["moons"])

def eig(A):
    C = np.cov(A, rowvar=False)
    return sorted(np.linalg.eigh(C)[0].tolist(), reverse=True)[:5]

D = squareform(pdist(X, "sqeuclidean"))
P = squareform(_joint_probabilities(D, 30, 0))
tsne = TSNE(n_components=2, perplexity=30, early_exaggeration=12, learning_rate=50, max_iter=1000,
            init=np.array(inp["init"]), method="exact", random_state=0)
tsne.fit(X)

def recall(Xh, Yl, ks):
    n = len(Xh)
    Dh = squareform(pdist(Xh)); Dl = squareform(pdist(Yl))
    np.fill_diagonal(Dh, np.inf); np.fill_diagonal(Dl, np.inf)
    oh = np.argsort(Dh, axis=1, kind="stable"); ol = np.argsort(Dl, axis=1, kind="stable")
    return [float(np.mean([len(set(oh[i, :k]) & set(ol[i, :k])) / k for i in range(n)])) for k in ks]

Yt = np.array(inp["Ytsne"]); Yp = np.array(inp["Ypca"]); ks = inp["ks"]
dh = pdist(X)
out = {
    "pcaCells": {"values": eig(X)},
    "pcaMoons": {"values": eig(M)},
    "sklearnP": {"rows": P[:3].tolist()},
    "sklearnKL": {"cellsNorm": float(tsne.kl_divergence_)},
    "measures": {
        "ks": ks,
        "recallTsne": recall(X, Yt, ks), "recallPca": recall(X, Yp, ks),
        "spearmanTsne": float(spearmanr(dh, pdist(Yt)).statistic),
        "spearmanPca": float(spearmanr(dh, pdist(Yp)).statistic),
    },
}
json.dump(out, open(sys.argv[2], "w"))
