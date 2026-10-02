# Independent reference for PlateDistance.kagan / mechClass (shared/01-plates.js).
# Builds each double couple as a moment tensor (Aki and Richards 1980 NED convention),
# takes the eigenvectors with numpy, and the Kagan (1991) angle as the smallest scipy
# Rotation magnitude over the four 180-degree symmetry rotations of a double couple.
# The JS builds the same angle from explicit slip/normal vectors, so the two share only
# the sign convention.  Prints the table pasted into the library as REF.
#   python3 scripts/japan-01-kagan-ref.py
import numpy as np, json
from scipy.spatial.transform import Rotation as Rot
def tensor(s, d, r):
    s, d, r = np.radians([s, d, r])
    # Aki and Richards, x north, y east, z down; M = u n + n u (unit moment)
    n = np.array([-np.sin(d)*np.sin(s), np.sin(d)*np.cos(s), -np.cos(d)])
    u = np.array([np.cos(r)*np.cos(s) + np.cos(d)*np.sin(r)*np.sin(s),
                  np.cos(r)*np.sin(s) - np.cos(d)*np.sin(r)*np.cos(s),
                  -np.sin(d)*np.sin(r)])
    return np.outer(u, n) + np.outer(n, u)
def axes(M):
    w, v = np.linalg.eigh(M)           # ascending: P, B, T
    P, B, T = v[:, 0], v[:, 1], v[:, 2]
    if np.dot(np.cross(T, B), P) < 0: P = -P   # right-handed T, B, P
    return T, B, P
def plunge(v): return abs(np.degrees(np.arcsin(v[2]/np.linalg.norm(v))))
def frame(s, d, r):
    T, B, P = axes(tensor(s, d, r)); return np.column_stack([T, B, P])
SYM = [Rot.from_matrix(np.diag(x)) for x in ([1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1])]
def kagan(a, b):
    Ra, Rb = Rot.from_matrix(frame(*a)), Rot.from_matrix(frame(*b))
    rel = Ra.inv() * Rb
    return min((rel * q).magnitude() for q in SYM) * 180/np.pi
def mech(sdr):
    T, B, P = axes(tensor(*sdr)); pt, pb, pp = plunge(T), plunge(B), plunge(P)
    if pp >= 52 and pt <= 35: return 'normal'
    if pt >= 52 and pp <= 35: return 'thrust'
    if pb >= 52 and pp <= 35 and pt <= 35: return 'strike'
    return 'oblique'
rng = np.random.default_rng(1)
g = json.load(open('docs/japan-earthquakes/shared/data/01-gcmt.json'))['events']
idx = rng.choice(len(g), 24, replace=False)
out = []
for i in range(0, 24, 2):
    a, b = g[idx[i]], g[idx[i+1]]
    A, Bp = [round(x) for x in a[5:8]], [round(x) for x in b[5:8]]
    out.append([*A, *Bp, round(kagan(A, Bp), 6)])
mm = [[*[round(x) for x in g[j][5:8]], mech([round(x) for x in g[j][5:8]])] for j in idx[:12]]
print('KAGAN =', json.dumps(out)); print('MECH =', json.dumps(mm))

# chi-square survival values (scipy) for PlateDistance.chi2sf, and a Python port of mulberry32
from scipy.stats import chi2
cases = [(391.0, 311), (311.0, 311), (50.0, 30), (3.84, 1), (12.0, 20), (600.0, 311), (0.5, 4)]
print('CHI2 =', json.dumps([[x, k, float(chi2.sf(x, k))] for x, k in cases]))
def mulberry32(a):
    M = 0xFFFFFFFF
    def nxt():
        nonlocal a
        a = (a + 0x6D2B79F5) & M
        t = a
        t = ((t ^ (t >> 15)) * (t | 1)) & M
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & M)) & M
        return ((t ^ (t >> 14)) & M) / 4294967296
    return nxt
g1 = mulberry32(12345)
print('RNG =', json.dumps([g1() for _ in range(5)]))
