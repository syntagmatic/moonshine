#!/usr/bin/env python3
"""Fetch the Gaia DR3 sample behind the HR diagram in Astronomy article 2.

Writes two files to docs/astronomy/shared/data/:

gaia-100pc.csv
    A uniform 1-in-6 subsample (MOD(random_index, 6) = 0) of every Gaia DR3
    source with parallax > 10 mas and both G and BP-RP photometry, with no
    quality cut. The page applies the cut itself, so the reader can loosen it
    and watch spurious parallaxes fill the diagram. Columns:
      g       phot_g_mean_mag (mag)
      bp_rp   BP-RP colour (mag)
      plx     parallax (mas), no zero-point correction (see the article)
      plx_err parallax_error (mas)
      ruwe    renormalised unit weight error
      gcns    1 if the source is in the Gaia Catalogue of Nearby Stars
              (Gaia Collaboration, Smart et al. 2021, A&A 649, A6), else 0

bprp-teff.csv
    Gaia BP-RP colour against effective temperature for dwarfs, from
    Mamajek's "A Modern Mean Dwarf Stellar Color and Effective Temperature
    Sequence" (Pecaut & Mamajek 2013, ApJS 208, 9, updated table). Only used
    to give each star its blackbody colour.

Standard library only. Run from anywhere:
    python3 scripts/astronomy/fetch-gaia-hr.py
"""

import csv
import io
import pathlib
import sys
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "astronomy" / "shared" / "data"

TAP = "https://gea.esac.esa.int/tap-server/tap/sync"
EEM = "https://www.pas.rochester.edu/~emamajek/EEM_dwarf_UBVIJHK_colors_Teff.txt"

ADQL = """
SELECT g.source_id, g.phot_g_mean_mag, g.bp_rp, g.parallax, g.parallax_error,
       g.ruwe, c.source_id AS gcns_id
FROM gaiadr3.gaia_source AS g
LEFT OUTER JOIN external.gaiaedr3_gcns_main_1 AS c ON c.source_id = g.source_id
WHERE g.parallax > 10
  AND g.phot_g_mean_mag IS NOT NULL
  AND g.bp_rp IS NOT NULL
  AND MOD(g.random_index, 6) = 0
"""


def get(url, data=None, timeout=900):
    req = urllib.request.Request(url, data=data, headers={"User-Agent": "moonshine-astronomy/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8")


def fetch_gaia():
    body = urllib.parse.urlencode({
        "REQUEST": "doQuery", "LANG": "ADQL", "FORMAT": "csv", "QUERY": ADQL,
    }).encode()
    text = get(TAP, body)
    rows = list(csv.DictReader(io.StringIO(text)))
    if not rows or "phot_g_mean_mag" not in rows[0]:
        sys.exit("unexpected TAP response:\n" + text[:2000])
    out = OUT / "gaia-100pc.csv"
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["g", "bp_rp", "plx", "plx_err", "ruwe", "gcns"])
        for r in rows:
            # ruwe is null for a handful of 2-parameter solutions; keep them, empty field.
            ruwe = f"{float(r['ruwe']):.2f}" if r["ruwe"] else ""
            w.writerow([
                f"{float(r['phot_g_mean_mag']):.3f}",
                f"{float(r['bp_rp']):.3f}",
                f"{float(r['parallax']):.3f}",
                f"{float(r['parallax_error']):.3f}",
                ruwe,
                "1" if r["gcns_id"] else "0",
            ])
    # Keep a few source_ids on stdout so rows can be spot-checked against the archive.
    print(f"gaia: {len(rows)} rows -> {out.relative_to(ROOT)}")
    for r in rows[:3]:
        print("  sample", r["source_id"], r["phot_g_mean_mag"], r["bp_rp"], r["parallax"])


def fetch_teff():
    text = get(EEM, timeout=120)
    lines = text.splitlines()
    header = next(l for l in lines if l.startswith("#SpT"))
    cols = header.lstrip("#").split()
    i_spt, i_teff, i_bprp = cols.index("SpT"), cols.index("Teff"), cols.index("Bp-Rp")
    rows = []
    for l in lines[lines.index(header) + 1:]:
        if l.startswith("#") or not l.strip():
            break  # the first table ends at the next header or blank line
        p = l.split()
        try:
            rows.append((p[i_spt], int(p[i_teff]), float(p[i_bprp])))
        except ValueError:
            continue  # colour not tabulated for this type ("...")
    out = OUT / "bprp-teff.csv"
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["spt", "teff", "bp_rp"])
        w.writerows(rows)
    print(f"teff: {len(rows)} rows ({rows[0][0]}..{rows[-1][0]}) -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    fetch_teff()
    fetch_gaia()
