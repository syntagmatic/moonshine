#!/usr/bin/env python3
"""Fetch the Gaia DR3 data behind the parallax section of Astronomy article 2.

Writes two files to docs/astronomy/shared/data/:

parallax-stars.csv
    Five-parameter astrometry (Gaia DR3, reference epoch J2016.0) for four
    nearby stars chosen to show the parallax ellipse at different ecliptic
    latitudes, plus 61 Cygni A, the first star with a measured parallax.
    Columns: name, source_id, ra, dec (deg), plx (mas), pmra, pmdec (mas/yr,
    pmra includes cos dec), g (mag), bp_rp (mag), ecl_lat (deg).

m67.csv
    Every Gaia DR3 source within 0.5 deg of the open cluster M67 whose proper
    motion lies within 0.8 mas/yr of the cluster's (-10.97, -2.94) mas/yr.
    Nothing is selected on parallax, so the parallax errors are left whole.
    Columns:
      g        phot_g_mean_mag (mag)
      bp_rp    BP-RP colour (mag), empty where missing
      plx      parallax (mas) with the Lindegren et al. (2021, A&A 649, A4)
               zero point subtracted
      plx_err  parallax_error (mas)
      zpt      the zero point that was subtracted (mas)
    The zero point comes from the coefficient tables of the official
    gaiadr3_zeropoint package (PyPI), evaluated here in plain Python; sources
    outside its valid range (G outside 6 to 21, or a 2-parameter solution)
    are dropped.

Standard library only. Run from anywhere:
    python3 scripts/astronomy/fetch-parallax.py
"""

import bisect
import csv
import io
import math
import pathlib
import sys
import urllib.parse
import urllib.request
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "astronomy" / "shared" / "data"

TAP = "https://gea.esac.esa.int/tap-server/tap/sync"
ZPT_WHEEL = ("https://files.pythonhosted.org/packages/89/8b/08547b59619f29e63205686603c0275e37cc193725a2248164959a1e838b/"
             "gaiadr3_zeropoint-0.1.0-py3-none-any.whl")

STARS = [
    # name, Gaia DR3 source_id (identifiers from SIMBAD)
    ("ζ Doradus", 4763906879239461632),
    ("ξ Boötis A", 1237090738916392704),
    ("HD 245409", 3339921875389105152),
    ("61 Cygni A", 1872046609345556480),
]

M67 = dict(ra=132.846, dec=11.814, radius=0.5, pmra=-10.97, pmdec=-2.94, pmwin=0.8)


def get(url, data=None, timeout=600, binary=False):
    req = urllib.request.Request(url, data=data, headers={"User-Agent": "moonshine-astronomy/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        b = r.read()
    return b if binary else b.decode("utf-8")


def tap(adql):
    body = urllib.parse.urlencode({"REQUEST": "doQuery", "LANG": "ADQL", "FORMAT": "csv", "QUERY": adql}).encode()
    text = get(TAP, body)
    rows = list(csv.DictReader(io.StringIO(text)))
    if not rows or "source_id" not in rows[0]:
        sys.exit("unexpected TAP response:\n" + text[:2000])
    return rows


# ── Lindegren et al. 2021 parallax zero point, ported from gaiadr3_zeropoint ──

def load_zpt_tables():
    z = zipfile.ZipFile(io.BytesIO(get(ZPT_WHEEL, binary=True)))
    tables = {}
    for n, name in [(5, "z5_200720.txt"), (6, "z6_200720.txt")]:
        lines = [[float(v) for v in l.split(",")] for l in z.read("zero_point/coefficients/" + name).decode().splitlines() if l.strip()]
        j = [int(v) for v in lines[0][1:]]
        k = [int(v) for v in lines[1][1:]]
        g = [l[0] for l in lines[2:]]
        q = [l[1:] for l in lines[2:]]
        tables[n] = (j, k, g, q)
    return tables


def zero_point(tables, gmag, nu_eff, pseudocolour, ecl_lat, params_solved):
    """Zero point in mas; subtract it from the catalogue parallax."""
    n = 5 if params_solved == 31 else 6
    col = nu_eff if n == 5 else pseudocolour
    j, k, g, q = tables[n]
    c = [1.0,
         max(-0.24, min(0.24, col - 1.48)),
         min(0.24, max(0.0, 1.48 - col)) ** 3,
         min(0.0, col - 1.24),
         max(0.0, col - 1.72)]
    sb = math.sin(math.radians(ecl_lat))
    b = [1.0, sb, sb * sb - 1 / 3]
    ig = max(0, min(len(g) - 2, bisect.bisect_right(g, gmag) - 1))
    h = max(0.0, min(1.0, (gmag - g[ig]) / (g[ig + 1] - g[ig])))
    z = sum(((1 - h) * q[ig][i] + h * q[ig + 1][i]) * c[j[i]] * b[k[i]] for i in range(len(j)))
    return round(z * 0.001, 6)


def fetch_stars():
    ids = ",".join(str(s) for _, s in STARS)
    rows = {int(r["source_id"]): r for r in tap(
        f"SELECT source_id, ra, dec, parallax, pmra, pmdec, phot_g_mean_mag, bp_rp, ecl_lat "
        f"FROM gaiadr3.gaia_source WHERE source_id IN ({ids})")}
    out = OUT / "parallax-stars.csv"
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["name", "source_id", "ra", "dec", "plx", "pmra", "pmdec", "g", "bp_rp", "ecl_lat"])
        for name, sid in STARS:
            r = rows[sid]
            w.writerow([name, sid, f"{float(r['ra']):.6f}", f"{float(r['dec']):.6f}", f"{float(r['parallax']):.3f}",
                        f"{float(r['pmra']):.3f}", f"{float(r['pmdec']):.3f}", f"{float(r['phot_g_mean_mag']):.3f}",
                        f"{float(r['bp_rp']):.3f}", f"{float(r['ecl_lat']):.3f}"])
    print(f"wrote {out.relative_to(ROOT)} ({len(STARS)} rows)")


def fetch_m67():
    m = M67
    rows = tap(f"""
SELECT source_id, phot_g_mean_mag, bp_rp, parallax, parallax_error,
       nu_eff_used_in_astrometry, pseudocolour, ecl_lat, astrometric_params_solved
FROM gaiadr3.gaia_source
WHERE 1 = CONTAINS(POINT(ra, dec), CIRCLE({m['ra']}, {m['dec']}, {m['radius']}))
  AND SQRT(POWER(pmra - ({m['pmra']}), 2) + POWER(pmdec - ({m['pmdec']}), 2)) < {m['pmwin']}
  AND parallax IS NOT NULL
""")
    tables = load_zpt_tables()
    out = OUT / "m67.csv"
    kept = 0
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["g", "bp_rp", "plx", "plx_err", "zpt"])
        for r in sorted(rows, key=lambda r: float(r["phot_g_mean_mag"])):
            gmag = float(r["phot_g_mean_mag"])
            aps = int(r["astrometric_params_solved"])
            if not (6 < gmag < 21) or aps not in (31, 95):
                continue
            nu = float(r["nu_eff_used_in_astrometry"]) if r["nu_eff_used_in_astrometry"] else None
            pc = float(r["pseudocolour"]) if r["pseudocolour"] else None
            z = zero_point(tables, gmag, nu, pc, float(r["ecl_lat"]), aps)
            w.writerow([f"{gmag:.3f}", f"{float(r['bp_rp']):.3f}" if r["bp_rp"] else "",
                        f"{float(r['parallax']) - z:.4f}", f"{float(r['parallax_error']):.4f}", f"{z:.4f}"])
            kept += 1
    print(f"wrote {out.relative_to(ROOT)} ({kept} of {len(rows)} rows)")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    fetch_stars()
    fetch_m67()
