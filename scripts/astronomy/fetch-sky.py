#!/usr/bin/env python3
"""Fetch the data behind Astronomy article 1, The Sky From Where You Stand.

Writes to docs/astronomy/shared/data/:

bsc5.csv
    Yale Bright Star Catalogue, 5th revised edition (Hoffleit & Warren 1991),
    from CDS (catalogue V/50), every star with V <= 5.5 and a J2000 position.
    Proper names from the IAU Catalog of Star Names (WGSN), joined on the HR
    number. Columns:
      hr        Harvard Revised number
      name      IAU proper name, if any
      bayer     Bayer/Flamsteed designation as printed in the catalogue
      ra, dec   J2000 position (degrees)
      pmra      proper motion in RA (arcsec/yr, great-circle, FK5)
      pmdec     proper motion in Dec (arcsec/yr)
      V         visual magnitude
      bv        B-V colour (blank if missing)

planets.csv
    JPL "Approximate Positions of the Planets" (E. M. Standish), Table 1,
    Keplerian elements and rates for 1800 AD to 2050 AD, from
    https://ssd.jpl.nasa.gov/planets/approx_pos.html. One row per body, with
    the J2000 value and the rate per Julian century for a, e, I, L, varpi
    (longitude of perihelion) and Omega (longitude of ascending node).
    Units: au, radians, degrees.

eclipses.csv
    Five Millennium Catalog of Solar Eclipses, -1999 to +3000 (Espenak &
    Meeus 2006, NASA/TP-2006-214141; catalogue file dated 2008), from
    https://eclipse.gsfc.nasa.gov/5MCSE/5MKSEcatalog.txt. Every eclipse.
    Columns: y, m, d (calendar date of greatest eclipse, Julian calendar
    before 1582 Oct 15, astronomical year numbering), td (Terrestrial Time
    of greatest eclipse, hours), luna (Meeus lunation number), saros, type
    (P partial, A annular, T total, H hybrid), gamma (the Moon's shadow axis
    distance from Earth's centre, Earth radii), lat, lon (point of greatest
    eclipse, degrees, north and east positive).

Standard library only. Run from anywhere:
    python3 scripts/astronomy/fetch-sky.py
"""

import csv
import gzip
import html
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "astronomy" / "shared" / "data"
BSC_URL = "https://cdsarc.cds.unistra.fr/ftp/V/50/catalog.gz"
CSN_URL = "https://www.pas.rochester.edu/~emamajek/WGSN/IAU-CSN.txt"
JPL_URL = "https://ssd.jpl.nasa.gov/planets/approx_pos.html"
ECL_URL = "https://eclipse.gsfc.nasa.gov/5MCSE/5MKSEcatalog.txt"
VMAX = 5.5


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "moonshine-astronomy/1.0"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read()


def num(s):
    s = s.strip()
    return float(s) if s else None


def bsc():
    names = {}
    for line in get(CSN_URL).decode("utf-8").splitlines():
        if line.startswith(("#", "$")) or not line.strip():
            continue
        # Fixed columns: ASCII name in 1-18, designation in 37-49.
        m = re.match(r"(.{18})(.{18})(HR \d+)", line)
        if m:
            names[int(m.group(3)[3:])] = m.group(1).strip()
    rows = []
    for line in gzip.decompress(get(BSC_URL)).decode("latin-1").splitlines():
        f = lambda a, b: line[a - 1:b]
        if not f(76, 77).strip() or not f(103, 107).strip():
            continue  # no J2000 position (novae, galaxies, clusters) or no V
        V = float(f(103, 107))
        if V > VMAX:
            continue
        hr = int(f(1, 4))
        ra = 15 * (int(f(76, 77)) + int(f(78, 79)) / 60 + float(f(80, 83)) / 3600)
        dec = int(f(85, 86)) + int(f(87, 88)) / 60 + int(f(89, 90)) / 3600
        if f(84, 84) == "-":
            dec = -dec
        bv = num(f(110, 114))
        rows.append([hr, names.get(hr, ""), " ".join(f(5, 14).split()),
                     f"{ra:.4f}", f"{dec:.4f}",
                     f(149, 154).strip() or "0", f(155, 160).strip() or "0",
                     f"{V:.2f}", "" if bv is None else f"{bv:.2f}"])
    with (OUT / "bsc5.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["hr", "name", "bayer", "ra", "dec", "pmra", "pmdec", "V", "bv"])
        w.writerows(rows)
    print(f"bsc5.csv: {len(rows)} stars, {sum(1 for r in rows if r[1])} named")


def planets():
    page = get(JPL_URL).decode("utf-8")
    table = html.unescape(re.findall(r"<pre>(.*?)</pre>", page, re.S)[0])
    rows, cur = [], None
    for l in table.splitlines():
        m = re.match(r"^(Mercury|Venus|EM Bary|Mars|Jupiter|Saturn|Uranus|Neptune)\s+(.*)$", l)
        if m:
            cur = [m.group(1).replace("EM Bary", "Earth"), *m.group(2).split()]
        elif cur and re.match(r"^\s+-?\d", l):
            rates = l.split()
            rows.append([cur[0], *[v for pair in zip(cur[1:], rates) for v in pair]])
            cur = None
    cols = ["body"] + [f"{k}{s}" for k in ("a", "e", "I", "L", "varpi", "Omega") for s in ("", "_dot")]
    with (OUT / "planets.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(cols)
        w.writerows(rows)
    print(f"planets.csv: {len(rows)} bodies")


def eclipses():
    rows = []
    months = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
    for line in get(ECL_URL).decode("latin-1").splitlines():
        t = line.split()
        if len(t) < 15 or not t[0].isdigit():
            continue
        y, mon, d, hms = int(t[2]), months[t[3]], int(t[4]), t[5]
        h, mi, s = (int(x) for x in hms.split(":"))
        lat = float(t[13][:-1]) * (1 if t[13][-1] == "N" else -1)
        lon = float(t[14][:-1]) * (1 if t[14][-1] == "E" else -1)
        rows.append([y, mon, d, f"{h + mi / 60 + s / 3600:.4f}", t[7], t[8], t[9][0], t[11], f"{lat:.1f}", f"{lon:.1f}"])
    with (OUT / "eclipses.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["y", "m", "d", "td", "luna", "saros", "type", "gamma", "lat", "lon"])
        w.writerows(rows)
    print(f"eclipses.csv: {len(rows)} eclipses")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    bsc()
    planets()
    eclipses()


if __name__ == "__main__":
    main()
