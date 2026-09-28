#!/usr/bin/env python3
"""Fetch the Pantheon+SH0ES supernova table behind sections 4 and 5 of Astronomy article 2.

Source: the Pantheon+ data release (Scolnic et al. 2022, Brout et al. 2022;
Riess et al. 2022 for the Cepheid host distances),
https://github.com/PantheonPlusSH0ES/DataRelease, file
Pantheon+_Data/4_DISTANCES_AND_COVAR/Pantheon+SH0ES.dat.

Writes docs/astronomy/shared/data/pantheon.csv, one row per light curve
(some supernovae were observed by more than one survey and appear more than
once; the page keeps the most precise light curve per supernova where that
matters). Columns:
  cid     supernova name
  z       zHD, redshift corrected to the CMB frame and for peculiar velocities
  mB      SALT2 peak B magnitude, uncorrected
  x1      SALT2 stretch
  c       SALT2 colour
  mcorr   m_b_corr, the Pantheon+ standardised magnitude
  err     m_b_corr_err_DIAG (for plotting only; the release warns that fits
          need the full covariance)
  mu      MU_SH0ES, distance modulus with the SH0ES absolute magnitude
  ceph    CEPH_DIST, Cepheid distance modulus of the host, empty if none
  hf      1 if in the SH0ES Hubble-flow sample, else 0

Standard library only. Run from anywhere:
    python3 scripts/astronomy/fetch-pantheon.py
"""

import csv
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "astronomy" / "shared" / "data"
URL = ("https://raw.githubusercontent.com/PantheonPlusSH0ES/DataRelease/main/"
       "Pantheon+_Data/4_DISTANCES_AND_COVAR/Pantheon+SH0ES.dat")


def main():
    req = urllib.request.Request(URL, headers={"User-Agent": "moonshine-astronomy/1.0"})
    with urllib.request.urlopen(req, timeout=300) as r:
        lines = r.read().decode("utf-8").split("\n")
    head = lines[0].split()
    rows = [dict(zip(head, l.split())) for l in lines[1:] if l.strip()]
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / "pantheon.csv"
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["cid", "z", "mB", "x1", "c", "mcorr", "err", "mu", "ceph", "hf"])
        for r in rows:
            w.writerow([r["CID"], r["zHD"], r["mB"], r["x1"], r["c"], r["m_b_corr"], r["m_b_corr_err_DIAG"],
                        r["MU_SH0ES"], r["CEPH_DIST"] if r["IS_CALIBRATOR"] == "1" else "", r["USED_IN_SH0ES_HF"]])
    print(f"wrote {out.relative_to(ROOT)} ({len(rows)} light curves)")


if __name__ == "__main__":
    main()
