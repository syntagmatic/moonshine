#!/usr/bin/env python3
"""Fetch the OGLE Cepheid data behind the Leavitt's law section of Astronomy article 2.

Source: the OGLE Collection of Variable Stars, classical Cepheids in the
Magellanic Clouds (Soszynski et al. 2015, Acta Astron. 65, 297), served from
https://www.astrouw.edu.pl/ogle/ogle4/OCVS/. Writes to docs/astronomy/shared/data/:

cepheids.csv
    Every single-mode fundamental-mode (F) Cepheid in the LMC and SMC with
    both mean magnitudes (cepF.dat). Columns:
      gal   LMC or SMC
      P     period (days)
      I, V  intensity-mean I- and V-band magnitudes

cepheid-lc.csv
    OGLE-IV I-band time series of three LMC Cepheids with periods near 3.4, 12.6
    and 28.4 days, chosen large in amplitude and away from whole-day periods
    (a period near a whole number of days is sampled at only a few phases
    by nightly observations). Columns: id, P (catalogue period, days), hjd (HJD - 2450000),
    I (mag), err (mag).

Standard library only. Run from anywhere:
    python3 scripts/astronomy/fetch-cepheids.py
"""

import csv
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "astronomy" / "shared" / "data"
BASE = "https://www.astrouw.edu.pl/ogle/ogle4/OCVS/{gal}/cep/"
LC_STARS = ["OGLE-LMC-CEP-3126", "OGLE-LMC-CEP-0800", "OGLE-LMC-CEP-0068"]


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "moonshine-astronomy/1.0"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read().decode("utf-8")


def parse_cepF(text):
    """Fixed-width columns per the catalogue README; '-' marks a missing value."""
    for line in text.splitlines():
        if not line.strip():
            continue
        f = lambda a, b: line[a - 1:b].strip()
        I, V, P = f(20, 25), f(27, 32), f(34, 44)
        yield f(1, 17), float(P), (float(I) if I not in ("", "-") else None), (float(V) if V not in ("", "-") else None)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    periods = {}
    out = OUT / "cepheids.csv"
    n = {}
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["gal", "P", "I", "V"])
        for gal in ("lmc", "smc"):
            for sid, P, I, V in parse_cepF(get(BASE.format(gal=gal) + "cepF.dat")):
                periods[sid] = P
                if I is None or V is None:
                    continue
                w.writerow([gal.upper(), f"{P:.7f}", f"{I:.3f}", f"{V:.3f}"])
                n[gal] = n.get(gal, 0) + 1
    print(f"wrote {out.relative_to(ROOT)} ({n})")

    out = OUT / "cepheid-lc.csv"
    rows = 0
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["id", "P", "hjd", "I", "err"])
        for sid in LC_STARS:
            for line in get(BASE.format(gal="lmc") + f"phot/I/{sid}.dat").splitlines():
                if line.strip():
                    t, m, e = line.split()[:3]
                    w.writerow([sid, f"{periods[sid]:.7f}", t, m, e])
                    rows += 1
    print(f"wrote {out.relative_to(ROOT)} ({rows} rows)")


if __name__ == "__main__":
    main()
