#!/usr/bin/env python3
"""Fetch the data behind Astronomy article 4, Finding Other Worlds.

Writes to docs/astronomy/shared/data/:

transit-hd209458.csv
    TESS sector 56 two-minute light curve of HD 209458 (TIC 420814525), SPOC
    pipeline PDCSAP flux from MAST, good-quality cadences only. Kept: every
    cadence within WINDOW days of a predicted mid-transit (ephemeris from the
    NASA Exoplanet Archive), each window divided by a straight line fitted to
    its out-of-transit part (|dt| > OOT days). Columns: epoch (transit number
    in the sector), dt (days from predicted mid-transit), flux (relative).

lc-hd209458.csv
    The whole sector, normalised by its median and averaged into 30-minute
    bins. Columns: t (BTJD = BJD - 2457000), flux.

rv-51peg.csv
    Keck/HIRES radial velocities of 51 Peg (HD 217014) from the LCES survey,
    Butler et al. 2017 (AJ 153, 208), VizieR J/AJ/153/208/table1.
    Columns: bjd, rv (m/s), err (m/s).

hosts.csv
    Gaia DR3 photometry and parallax (Lindegren et al. 2021 zero point
    subtracted) of the two host stars, the FLAME radius and mass as a check,
    and quadratic TESS limb-darkening coefficients (Claret 2017, ATLAS,
    [M/H] = 0, microturbulence 2 km/s, least-squares method) interpolated to
    the Gaia GSP-Phot Teff and log g. Also the archive's planet parameters
    used as a reference.

exoplanets.csv
    NASA Exoplanet Archive, Planetary Systems Composite Parameters
    (pscomppars). Only measured values are kept: a radius or period flagged by
    the archive as a calculated value is dropped, and a mass is kept only
    when its provenance is "Mass" or "Msini" (not the archive's
    mass-radius estimate). Columns: name, method (short code), year,
    facility (Kepler / K2 / TESS / other), per (days), per_calc (1 if the
    period was computed here from the semi-major axis and the star's mass by
    Kepler's third law), a (AU), rade (Earth radii), rade_err (fractional),
    mass (Earth masses), msini (1 if the mass is a minimum mass), st_rad,
    st_mass, st_teff.

Stdlib only. The TESS FITS file is parsed by the minimal reader below.
"""

import csv
import importlib.util
import io
import json
import math
import pathlib
import struct
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "astronomy" / "shared" / "data"
CACHE = pathlib.Path(__file__).resolve().parent / ".cache"

MAST = "https://mast.stsci.edu/api/v0.1/Download/file?uri=mast:TESS/product/"
TESS_FILE = "tess2022244194134-s0056-0000000420814525-0243-s_lc.fits"
EXO = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
VIZ = "https://vizier.cds.unistra.fr/viz-bin/asu-tsv"
HOSTS = [("HD 209458", 1779546757669063552, "HD 209458 b"),
         ("51 Peg", 2835207319109249920, "51 Peg b")]
WINDOW = 0.25
OOT = 0.09

spec = importlib.util.spec_from_file_location("fp", pathlib.Path(__file__).with_name("fetch-parallax.py"))
fp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fp)
get = fp.get


def cached(name, url):
    CACHE.mkdir(exist_ok=True)
    path = CACHE / name
    if not path.exists():
        print(f"downloading {url}")
        path.write_bytes(get(url, binary=True))
    return path


def write(name, header, rows):
    out = OUT / name
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(f"wrote {out.relative_to(ROOT)} ({len(rows)} rows)")


def exo(adql):
    q = urllib.parse.urlencode({"query": adql, "format": "csv"})
    return list(csv.DictReader(io.StringIO(get(EXO + "?" + q))))


# ── Minimal FITS reader: headers and big-endian binary tables ──

def read_fits(data):
    pos, hdus = 0, []
    while pos < len(data):
        hdr = {}
        while True:
            block, pos, end = data[pos:pos + 2880], pos + 2880, False
            for i in range(36):
                card = block[i * 80:(i + 1) * 80].decode("ascii")
                if card[:8].strip() == "END":
                    end = True
                    break
                if card[8:10] == "= ":
                    v = card[10:].strip()
                    hdr[card[:8].strip()] = v.split("'")[1].strip() if v.startswith("'") else v.split("/")[0].strip()
            if end:
                break
        size = 0
        if int(hdr.get("NAXIS", 0)):
            size = abs(int(hdr["BITPIX"])) // 8
            for i in range(int(hdr["NAXIS"])):
                size *= int(hdr[f"NAXIS{i + 1}"])
            size += int(hdr.get("PCOUNT", 0))
        hdus.append((hdr, data[pos:pos + size]))
        pos += (size + 2879) // 2880 * 2880
    return hdus


def fits_columns(hdr, data, names):
    codes = {"D": ("d", 8), "E": ("f", 4), "J": ("i", 4), "I": ("h", 2), "K": ("q", 8), "B": ("B", 1)}
    off, spec_ = 0, {}
    for i in range(1, int(hdr["TFIELDS"]) + 1):
        form = hdr[f"TFORM{i}"]
        rep = int(form[:-1] or 1)
        c, sz = codes.get(form[-1], ("x", 1))
        spec_[hdr[f"TTYPE{i}"]] = (off, c)
        off += rep * sz
    width, n = int(hdr["NAXIS1"]), int(hdr["NAXIS2"])
    out = {k: [] for k in names}
    for r in range(n):
        row = data[r * width:(r + 1) * width]
        for k in names:
            o, c = spec_[k]
            out[k].append(struct.unpack(">" + c, row[o:o + struct.calcsize(c)])[0])
    return out


# ── Transit light curve ──

def transit(ephem):
    hdus = read_fits(cached(TESS_FILE, MAST + TESS_FILE).read_bytes())
    prim = hdus[0][0]
    assert prim["TICID"] == "420814525" and prim["SECTOR"] == "56"
    t = fits_columns(hdus[1][0], hdus[1][1], ["TIME", "PDCSAP_FLUX", "QUALITY"])
    pts = [(tt, f) for tt, f, q in zip(t["TIME"], t["PDCSAP_FLUX"], t["QUALITY"])
           if q == 0 and not math.isnan(f) and not math.isnan(tt)]
    med = sorted(f for _, f in pts)[len(pts) // 2]

    # 30-minute bins over the whole sector
    bins = {}
    for tt, f in pts:
        bins.setdefault(math.floor(tt * 48), []).append(f / med)
    write("lc-hd209458.csv", ["t", "flux"],
          [[f"{(k + 0.5) / 48:.4f}", f"{sum(v) / len(v):.5f}"] for k, v in sorted(bins.items()) if len(v) >= 8])

    # Transit windows, each normalised by a line through its out-of-transit part
    per, t0 = ephem["per"], ephem["t0"] - 2457000
    rows, epochs = [], 0
    n0, n1 = math.ceil((pts[0][0] - t0) / per), math.floor((pts[-1][0] - t0) / per)
    for n in range(n0, n1 + 1):
        tc = t0 + n * per
        win = [(tt - tc, f) for tt, f in pts if abs(tt - tc) < WINDOW]
        oot = [(d, f) for d, f in win if abs(d) > OOT]
        pre, post = sum(d < 0 for d, _ in oot), sum(d > 0 for d, _ in oot)
        # need the dip itself and some baseline on both sides
        if len(win) < 0.8 * 2 * WINDOW * 720 or pre < 40 or post < 40:
            continue
        mx = sum(d for d, _ in oot) / len(oot)
        my = sum(f for _, f in oot) / len(oot)
        slope = sum((d - mx) * (f - my) for d, f in oot) / sum((d - mx) ** 2 for d, _ in oot)
        epochs += 1
        for d, f in win:
            rows.append([epochs, f"{d:.5f}", f"{f / (my + slope * (d - mx)):.6f}"])
    write("transit-hd209458.csv", ["epoch", "dt", "flux"], rows)
    return prim


# ── 51 Peg radial velocities ──

def rv():
    q = urllib.parse.urlencode({"-source": "J/AJ/153/208/table1", "Name": "HD217014", "-out.max": "1000",
                                "-out": "BJD,RV,e_RV"})
    lines = [l.split("\t") for l in get(VIZ + "?" + q).splitlines() if l.strip()[:2] == "24"]
    write("rv-51peg.csv", ["bjd", "rv", "err"], [[l[0].strip(), l[1].strip(), l[2].strip()] for l in lines])


# ── Host stars ──

def claret(teff, logg):
    """Bilinear interpolation of Claret (2017) TESS quadratic LDCs."""
    t0 = 250 * math.floor(teff / 250)
    g0 = 0.5 * math.floor(logg / 0.5)
    grid = {}
    for tt in (t0, t0 + 250):
        for gg in (g0, g0 + 0.5):
            q = urllib.parse.urlencode({"-source": "J/A+A/600/A30/table25", "Teff": f"={tt}", "logg": f"={gg}", "Z": "=0.0",
                                        "xi": "=2.0", "-out": "aLSM,bLSM"})
            vals = [l.split("\t") for l in get(VIZ + "?" + q).splitlines() if l and l[0] in " 0-" and "\t" in l]
            vals = [v for v in vals if v[0].strip().replace(".", "").replace("-", "").isdigit()]
            assert len(vals) == 1, (tt, gg, vals)
            grid[tt, gg] = (float(vals[0][0]), float(vals[0][1]))
    ht, hg = (teff - t0) / 250, (logg - g0) / 0.5
    return [(1 - ht) * (1 - hg) * grid[t0, g0][i] + ht * (1 - hg) * grid[t0 + 250, g0][i]
            + (1 - ht) * hg * grid[t0, g0 + 0.5][i] + ht * hg * grid[t0 + 250, g0 + 0.5][i] for i in range(2)]


def hosts():
    ids = ",".join(str(s) for _, s, _ in HOSTS)
    gaia = {int(r["source_id"]): r for r in fp.tap(f"""
SELECT g.source_id, g.phot_g_mean_mag, g.bp_rp, g.parallax, g.parallax_error, g.nu_eff_used_in_astrometry,
       g.pseudocolour, g.ecl_lat, g.astrometric_params_solved, a.teff_gspphot, a.logg_gspphot,
       a.radius_flame, a.mass_flame, a.lum_flame
FROM gaiadr3.gaia_source AS g JOIN gaiadr3.astrophysical_parameters AS a USING (source_id)
WHERE g.source_id IN ({ids})""")}
    names = ",".join(f"'{p}'" for _, _, p in HOSTS)
    planets = {r["pl_name"]: r for r in exo(
        f"select pl_name,pl_orbper,pl_tranmid,pl_ratror,pl_imppar,pl_trandur,pl_rvamp,pl_orbeccen,"
        f"pl_rade,pl_bmasse,pl_orbincl,st_rad,st_mass from pscomppars where pl_name in ({names})")}
    tables = fp.load_zpt_tables()
    rows = []
    for name, sid, pl in HOSTS:
        g, p = gaia[sid], planets[pl]
        aps = int(g["astrometric_params_solved"])
        nu = float(g["nu_eff_used_in_astrometry"]) if g["nu_eff_used_in_astrometry"] else None
        pc = float(g["pseudocolour"]) if g["pseudocolour"] else None
        z = fp.zero_point(tables, float(g["phot_g_mean_mag"]), nu, pc, float(g["ecl_lat"]), aps)
        u1, u2 = claret(float(g["teff_gspphot"]), float(g["logg_gspphot"]))
        rows.append([name, sid, f"{float(g['phot_g_mean_mag']):.4f}", f"{float(g['bp_rp']):.4f}",
                     f"{float(g['parallax']) - z:.4f}", f"{float(g['parallax_error']):.4f}", f"{z:.4f}",
                     f"{float(g['teff_gspphot']):.0f}", f"{float(g['logg_gspphot']):.3f}",
                     f"{float(g['radius_flame']):.4f}", f"{float(g['mass_flame']):.4f}", f"{float(g['lum_flame']):.4f}",
                     f"{u1:.4f}", f"{u2:.4f}", pl, p["pl_orbper"], p["pl_tranmid"], p["pl_ratror"], p["pl_imppar"],
                     p["pl_trandur"], p["pl_rvamp"], p["pl_orbeccen"], p["pl_rade"], p["pl_bmasse"], p["pl_orbincl"],
                     p["st_rad"], p["st_mass"]])
    write("hosts.csv", ["star", "source_id", "g", "bp_rp", "plx", "plx_err", "zpt", "teff_gspphot", "logg_gspphot",
                        "radius_flame", "mass_flame", "lum_flame", "u1", "u2", "planet", "arc_per", "arc_t0",
                        "arc_ratror", "arc_b", "arc_dur_h", "arc_k", "arc_ecc", "arc_rade", "arc_masse", "arc_incl",
                        "arc_st_rad", "arc_st_mass"], rows)
    hd = planets["HD 209458 b"]
    return {"per": float(hd["pl_orbper"]), "t0": float(hd["pl_tranmid"])}


# ── The exoplanet population ──

METHOD = {"Transit": "tr", "Radial Velocity": "rv", "Microlensing": "ml", "Imaging": "im"}


def population():
    rows = exo("select pl_name,discoverymethod,disc_year,disc_facility,pl_orbper,pl_orbper_reflink,pl_orbsmax,"
               "pl_orbsmax_reflink,pl_rade,pl_radeerr1,pl_radeerr2,pl_rade_reflink,pl_bmasse,pl_bmassprov,"
               "pl_bmasse_reflink,st_rad,st_mass,st_teff from pscomppars")
    calc = lambda r, k: "CALCULATED_VALUE" in (r[k + "_reflink"] or "")
    out = []
    for r in sorted(rows, key=lambda r: r["pl_name"]):
        per = float(r["pl_orbper"]) if r["pl_orbper"] and not calc(r, "pl_orbper") else None
        a = float(r["pl_orbsmax"]) if r["pl_orbsmax"] and not calc(r, "pl_orbsmax") else None
        per_calc = 0
        if per is None and a and r["st_mass"]:
            per = 365.25 * math.sqrt(a ** 3 / float(r["st_mass"]))
            per_calc = 1
        rade = float(r["pl_rade"]) if r["pl_rade"] and not calc(r, "pl_rade") else None
        rerr = None
        if rade and r["pl_radeerr1"] and r["pl_radeerr2"]:
            rerr = (float(r["pl_radeerr1"]) - float(r["pl_radeerr2"])) / 2 / rade
        mass = None
        if r["pl_bmasse"] and r["pl_bmassprov"] in ("Mass", "Msini") and not calc(r, "pl_bmasse"):
            mass = float(r["pl_bmasse"])
        if per is None or (rade is None and mass is None):
            continue
        fac = r["disc_facility"]
        fac = "Kepler" if fac == "Kepler" else "K2" if fac == "K2" else \
            "TESS" if fac == "Transiting Exoplanet Survey Satellite (TESS)" else "other"
        f = lambda v, fmt: "" if v is None or v == "" else format(float(v), fmt)
        out.append([r["pl_name"], METHOD.get(r["discoverymethod"], "ot"), r["disc_year"], fac,
                    f(per, ".6g"), per_calc, f(a, ".4g"), f(rade, ".4g"), f(rerr, ".3f"), f(mass, ".4g"),
                    1 if mass is not None and r["pl_bmassprov"] == "Msini" else 0,
                    f(r["st_rad"], ".3g"), f(r["st_mass"], ".3g"), f(r["st_teff"], ".4g")])
    write("exoplanets.csv", ["name", "method", "year", "facility", "per", "per_calc", "a", "rade", "rade_err",
                             "mass", "msini", "st_rad", "st_mass", "st_teff"], out)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    ephem = hosts()
    transit(ephem)
    rv()
    population()
