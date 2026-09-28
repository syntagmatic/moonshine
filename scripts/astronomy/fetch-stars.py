#!/usr/bin/env python3
"""Fetch the data behind Astronomy article 3, Lives of Stars.

Writes to docs/astronomy/shared/data/:

ssm.csv
    The Bahcall-Serenelli 2005 standard solar model (BS2005-OP,
    astro-ph/0412440), every 5th zone. Columns: m (mass fraction), r (R/Rsun),
    t (K), rho (g/cm3), p (dyn/cm2), l (L/Lsun), x (1H mass fraction),
    he3, c12, n14, o16 (mass fractions).

mist-tracks.csv
    MIST v1.2 evolutionary tracks, [Fe/H] = 0, v/vcrit = 0.4 (Choi et al.
    2016; Dotter 2016), for the masses in TRACK_MASSES, thinned to every
    STEP-th equivalent evolutionary point (EEP) with every primary EEP kept.
    Columns: mass (initial, Msun), eep, age (yr), logt (log Teff), logl
    (log L/Lsun), phase (MIST phase code: -1 pre-MS, 0 MS, 2 RGB, 3 core He
    burning, 4 early AGB, 5 TP-AGB, 6 post-AGB / white dwarf).

mist-masses.csv
    One row per track in the solar-metallicity grid (0.1 to 300 Msun):
    mass, age at the end of the main sequence
    (EEP 454), age at the end of the track, last EEP, final mass, final
    He-, C/O-core masses; and, at the intermediate-age main sequence point
    (EEP 353), log central temperature and density, central hydrogen, and
    log L from the pp chain and from the CNO cycle, and the mass of the
    convective core (Msun).

mist-iso.csv
    MIST v1.2 isochrones, [Fe/H] = 0, v/vcrit = 0.4, with Gaia EDR3
    synthetic photometry (Vega mags, no extinction), log age 7.5 to 10.15 in
    steps of 0.05, EEPs 202 (zero-age main sequence) to 707 (end of core
    helium burning), every 2nd EEP on the main sequence. Columns: logage,
    eep, mini, logt, logl, g (absolute G), bp_rp.

clusters.csv
    Gaia DR3 members of the Pleiades (Melotte 22) and M67 (NGC 2682) from
    the Hunt & Reffert (2023, A&A 673, A114) catalogue on VizieR, every listed
    member with its membership probability. Parallaxes have the Lindegren et al. (2021) zero
    point subtracted (port in fetch-parallax.py), evaluated at G = 6 for the
    few brighter stars; 2-parameter solutions are dropped.
    Columns: cluster, g, bp_rp, plx, plx_err, ruwe, prob.

The MIST tarballs are large (270 MB together); they are cached in
scripts/astronomy/.cache/ (gitignored) between runs.

Standard library only:
    python3 scripts/astronomy/fetch-stars.py
"""

import csv
import importlib.util
import io
import lzma
import pathlib
import tarfile
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "astronomy" / "shared" / "data"
CACHE = pathlib.Path(__file__).resolve().parent / ".cache"

SSM_URL = "https://www.sns.ias.edu/~jnb/SNdata/Export/BS2005/bs05op.dat"
MIST = "https://mist.science/data/tarballs_v1.2/"
EEPS_TAR = "MIST_v1.2_feh_p0.00_afe_p0.0_vvcrit0.4_EEPS.txz"
ISO_TAR = "MIST_v1.2_vvcrit0.4_UBVRIplus.txz"
ISO_FILE = "MIST_v1.2_vvcrit0.4_UBVRIplus/MIST_v1.2_feh_p0.00_afe_p0.0_vvcrit0.4_UBVRIplus.iso.cmd"
VIZIER = "https://tapvizier.cds.unistra.fr/TAPVizieR/tap/sync"

TRACK_MASSES = [0.5, 0.8, 1.0, 1.2, 1.5, 2.0, 3.0, 5.0, 9.0, 15.0, 30.0]
PRIMARY = {1, 202, 353, 454, 605, 631, 707, 808, 1409, 1710}
STEP = 4
CLUSTERS = [("Pleiades", "Melotte_22"), ("M67", "NGC_2682")]

spec = importlib.util.spec_from_file_location("fp", pathlib.Path(__file__).with_name("fetch-parallax.py"))
fp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fp)


def cached(name, url):
    CACHE.mkdir(exist_ok=True)
    path = CACHE / name
    if not path.exists():
        print(f"downloading {url}")
        req = urllib.request.Request(url, headers={"User-Agent": "moonshine-astronomy/1.0"})
        with urllib.request.urlopen(req, timeout=1800) as r, path.open("wb") as f:
            while chunk := r.read(1 << 20):
                f.write(chunk)
    return path


def g(x, fmt):
    return format(x, fmt)


def ssm():
    text = cached("bs05op.dat", SSM_URL).read_text()
    rows = []
    started = False
    for line in text.splitlines():
        if line.strip().startswith("M/Msun"):
            started = True
            continue
        elif started and line.strip():
            if line.strip().startswith(("Lsun", "Rsun")):
                break
            rows.append([float(v) for v in line.split()])
    out = OUT / "ssm.csv"
    kept = rows[::5]
    if kept[-1] is not rows[-1]:
        kept.append(rows[-1])
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["m", "r", "t", "rho", "p", "l", "x", "he3", "c12", "n14", "o16"])
        for r in kept:
            m, rad, t, rho, p, l, x, y, he3, c12, n14, o16 = r
            w.writerow([g(m, ".7f"), g(rad, ".5f"), g(t, ".4e"), g(rho, ".4e"), g(p, ".4e"), g(l, ".5f"),
                        g(x, ".5f"), g(he3, ".3e"), g(c12, ".3e"), g(n14, ".3e"), g(o16, ".3e")])
    print(f"wrote {out.relative_to(ROOT)} ({len(kept)} of {len(rows)} zones)")


def parse_eep(text):
    lines = text.splitlines()
    header = None
    rows = []
    for line in lines:
        if line.startswith("#"):
            parts = line[1:].split()
            if parts and parts[0] == "star_age":
                header = parts
            continue
        if line.strip():
            rows.append([float(v) for v in line.split()])
    return header, rows


def tracks():
    tar = tarfile.open(cached(EEPS_TAR, MIST + EEPS_TAR), "r:xz")
    members = sorted((m for m in tar.getmembers() if m.name.endswith(".track.eep")), key=lambda m: m.name)
    out_t = OUT / "mist-tracks.csv"
    out_m = OUT / "mist-masses.csv"
    n_t = 0
    with out_t.open("w", newline="", encoding="utf-8") as ft, out_m.open("w", newline="", encoding="utf-8") as fm:
        wt = csv.writer(ft, lineterminator="\n")
        wm = csv.writer(fm, lineterminator="\n")
        wt.writerow(["mass", "eep", "age", "logt", "logl", "phase"])
        wm.writerow(["mass", "age_ms", "age_end", "eep_end", "m_final", "he_core", "co_core",
                     "logtc", "logrhoc", "xc", "log_pp", "log_cno", "m_conv_core"])
        for m in members:
            mass = int(m.name.split("/")[-1][:5]) / 100
            h, rows = parse_eep(tar.extractfile(m).read().decode())
            c = {k: i for i, k in enumerate(h)}
            last = rows[-1]
            ms = rows[453] if len(rows) >= 454 else None
            mid = rows[352] if len(rows) >= 353 else None
            wm.writerow([g(mass, ".2f"),
                         g(ms[c["star_age"]], ".4e") if ms else "",
                         g(last[c["star_age"]], ".4e"), len(rows),
                         g(last[c["star_mass"]], ".4f"), g(last[c["he_core_mass"]], ".4f"),
                         g(last[c["c_core_mass"]], ".4f"),
                         g(mid[c["log_center_T"]], ".4f") if mid else "",
                         g(mid[c["log_center_Rho"]], ".4f") if mid else "",
                         g(mid[c["center_h1"]], ".4f") if mid else "",
                         g(mid[c["pp"]], ".4f") if mid else "",
                         g(mid[c["cno"]], ".4f") if mid else "",
                         g(mid[c["mass_conv_core"]], ".4f") if mid else ""])
            if any(abs(mass - t) < 1e-6 for t in TRACK_MASSES):
                for i, r in enumerate(rows):
                    eep = i + 1
                    if eep in PRIMARY or eep % STEP == 0 or eep == len(rows):
                        wt.writerow([g(mass, ".2f"), eep, g(r[c["star_age"]], ".5e"), g(r[c["log_Teff"]], ".4f"),
                                     g(r[c["log_L"]], ".4f"), int(round(r[c["phase"]]))])
                        n_t += 1
    print(f"wrote {out_t.relative_to(ROOT)} ({n_t} rows) and {out_m.relative_to(ROOT)} ({len(members)} tracks)")


def isochrones():
    tar = tarfile.open(cached(ISO_TAR, MIST + ISO_TAR), "r:xz")
    text = tar.extractfile(ISO_FILE).read().decode()
    header = None
    out = OUT / "mist-iso.csv"
    n = 0
    ages = set()
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["logage", "eep", "mini", "logt", "logl", "g", "bp_rp"])
        for line in text.splitlines():
            if line.startswith("#"):
                parts = line[1:].split()
                if parts and parts[0] == "EEP":
                    header = {k: i for i, k in enumerate(parts)}
                continue
            if not line.strip():
                continue
            v = line.split()
            logage = float(v[header["log10_isochrone_age_yr"]])
            eep = int(float(v[header["EEP"]]))
            if not (7.5 - 1e-6 <= logage <= 10.15 + 1e-6) or not (202 <= eep <= 707):
                continue
            if eep < 454 and eep % 2 and eep not in PRIMARY:
                continue
            G = float(v[header["Gaia_G_EDR3"]])
            bp_rp = float(v[header["Gaia_BP_EDR3"]]) - float(v[header["Gaia_RP_EDR3"]])
            w.writerow([g(logage, ".2f"), eep, g(float(v[header["initial_mass"]]), ".5f"),
                        g(float(v[header["log_Teff"]]), ".4f"), g(float(v[header["log_L"]]), ".4f"),
                        g(G, ".3f"), g(bp_rp, ".3f")])
            ages.add(round(logage, 2))
            n += 1
    print(f"wrote {out.relative_to(ROOT)} ({n} rows, {len(ages)} ages)")


def vizier(adql):
    body = urllib.parse.urlencode({"REQUEST": "doQuery", "LANG": "ADQL", "FORMAT": "csv", "QUERY": adql}).encode()
    req = urllib.request.Request(VIZIER, data=body, headers={"User-Agent": "moonshine-astronomy/1.0"})
    with urllib.request.urlopen(req, timeout=600) as r:
        return list(csv.DictReader(io.StringIO(r.read().decode("utf-8"))))


def clusters():
    names = ",".join(f"'{n}'" for _, n in CLUSTERS)
    label = {n: l for l, n in CLUSTERS}
    rows = vizier(f'SELECT Name, Prob, Gmag, "BP-RP", Plx, e_Plx, RUWE, nueff, pscol, ELAT, Solved '
                  f'FROM "J/A+A/673/A114/members" WHERE Name IN ({names})')
    tables = fp.load_zpt_tables()
    out = OUT / "clusters.csv"
    kept = 0
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["cluster", "g", "bp_rp", "plx", "plx_err", "ruwe", "prob"])
        for r in sorted(rows, key=lambda r: (r["Name"], float(r["Gmag"]))):
            gmag = float(r["Gmag"])
            aps = int(r["Solved"])
            if aps not in (31, 95) or not r["BP-RP"]:
                continue
            nu = float(r["nueff"]) if r["nueff"] else None
            pc = float(r["pscol"]) if r["pscol"] else None
            # The zero point is calibrated for 6 < G < 21; brighter stars get
            # the G = 6 value (a few hundredths of a mas, 0.3% of the Pleiades'
            # parallax), since the Pleiades' turnoff is brighter than G = 6.
            z = fp.zero_point(tables, min(max(gmag, 6.0), 21.0), nu, pc, float(r["ELAT"]), aps)
            w.writerow([label[r["Name"]], g(gmag, ".3f"), g(float(r["BP-RP"]), ".3f"),
                        g(float(r["Plx"]) - z, ".4f"), g(float(r["e_Plx"]), ".4f"),
                        g(float(r["RUWE"]), ".2f") if r["RUWE"] else "", g(float(r["Prob"]), ".2f")])
            kept += 1
    print(f"wrote {out.relative_to(ROOT)} ({kept} of {len(rows)} members)")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    ssm()
    tracks()
    isochrones()
    clusters()
