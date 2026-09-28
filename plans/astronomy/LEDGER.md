# Astronomy ledger

Every checkable claim in the series, and how we know it. D = derived (working
in the article or here), C = computed (by a figure at runtime, or by a node
check on the shipped data), S = sourced (read in the named primary source this
session). "Open" means not yet checked; it must be checked or cut before the
article ships.

## Data

| File | Source | Fetched by |
|---|---|---|
| `docs/astronomy/shared/data/gaia-100pc.csv` | ESA Gaia archive TAP, `gaiadr3.gaia_source` left-joined to `external.gaiaedr3_gcns_main_1`. All sources with parallax > 10 mas and G and BP-RP present, 1-in-6 by `MOD(random_index, 6) = 0`. 83,111 rows, fetched 2026-09-27. | `scripts/astronomy/fetch-gaia-hr.py` |
| `docs/astronomy/shared/data/parallax-stars.csv` | ESA Gaia archive TAP, `gaiadr3.gaia_source`, five named stars by source_id (identifiers from SIMBAD TAP: zet Dor, ksi Boo A, HD 245409 = V2689 Ori, 61 Cyg A). 4 rows, fetched 2026-09-27. | `scripts/astronomy/fetch-parallax.py` |
| `docs/astronomy/shared/data/m67.csv` | ESA Gaia archive TAP, `gaiadr3.gaia_source` within 0.5 deg of (132.846, 11.814), proper motion within 0.8 mas/yr of (-10.97, -2.94); no parallax cut. Lindegren et al. 2021 zero point subtracted, coefficients from the `gaiadr3_zeropoint` 0.1.0 wheel on PyPI. 1,338 rows, fetched 2026-09-27. | same script |
| `docs/astronomy/shared/data/cepheids.csv` | OGLE Collection of Variable Stars, `ogle4/OCVS/{lmc,smc}/cep/cepF.dat` (Soszynski et al. 2015, Acta Astron. 65, 297). Single-mode F Cepheids with both I and V: 2,314 LMC, 2,637 SMC. Fetched 2026-09-27. | `scripts/astronomy/fetch-cepheids.py` |
| `docs/astronomy/shared/data/cepheid-lc.csv` | Same archive, `phot/I/` for OGLE-LMC-CEP-3126, -0800, -0068 (484, 771, 642 epochs). | same script |
| `docs/astronomy/shared/data/pantheon.csv` | Pantheon+ data release, `Pantheon+_Data/4_DISTANCES_AND_COVAR/Pantheon+SH0ES.dat` (GitHub PantheonPlusSH0ES/DataRelease). 1,701 light curves (Scolnic et al. 2022 count 1,550 distinct SNe; the file has 1,543 distinct CIDs); 77 calibrator light curves (43 SNe), 277 Hubble-flow light curves (238 SNe). Fetched 2026-09-27. | `scripts/astronomy/fetch-pantheon.py` |
| `docs/astronomy/shared/data/bprp-teff.csv` | E. Mamajek, "A Modern Mean Dwarf Stellar Color and Effective Temperature Sequence", version 2022.04.16 (Pecaut & Mamajek 2013, ApJS 208, 9). Rows B9V to M9.5V with tabulated Bp-Rp (63 rows). | same script |
| `docs/astronomy/shared/data/bsc5.csv` | CDS catalogue V/50, Yale Bright Star Catalogue 5th rev. ed. (Hoffleit & Warren 1991), `catalog.gz`. Every star with a J2000 position and V <= 5.5: 2,887 stars. Proper names from the IAU Catalog of Star Names (WGSN list, Mamajek's text version dated 2022-04-04), joined on HR number: 324 named. Fetched 2026-09-27. | `scripts/astronomy/fetch-sky.py` |
| `docs/astronomy/shared/data/planets.csv` | JPL "Approximate Positions of the Planets" (Standish), Table 1 (1800 to 2050 AD), elements and rates for 8 bodies (EM barycentre as Earth). Fetched 2026-09-27. | same script |
| `docs/astronomy/shared/data/eclipses.csv` | NASA Five Millennium Catalog of Solar Eclipses, `5MCSE/5MKSEcatalog.txt` (Espenak & Meeus; file dated 2008 Oct 07). All 11,898 eclipses, -1999 to +3000. Fetched 2026-09-27. | same script |
| `docs/astronomy/shared/data/ssm.csv` | Bahcall-Serenelli 2005 standard solar model, BS2005-OP table (`sns.ias.edu/~jnb/SNdata/Export/BS2005/bs05op.dat`, astro-ph/0412440), every 5th of 1,268 zones (255 kept, plus the last). Table ends at r = 0.983 Rsun. Fetched 2026-09-27. | `scripts/astronomy/fetch-stars.py` |
| `docs/astronomy/shared/data/mist-tracks.csv` | MIST v1.2 EEP tracks, [Fe/H] = 0, v/vcrit = 0.4 (`mist.science/data/tarballs_v1.2/`), 11 masses 0.5 to 30 Msun, every 4th EEP plus primary EEPs. 3,796 rows. Fetched 2026-09-27. | same script |
| `docs/astronomy/shared/data/mist-masses.csv` | Same tarball, one row for each of the 196 tracks (0.1 to 300 Msun): age at EEP 454 and at the end, last EEP, final mass, He and C/O core masses at the end; log Tc, log rho_c, X_c, log L_pp, log L_CNO and convective-core mass at EEP 353. | same script |
| `docs/astronomy/shared/data/mist-iso.csv` | MIST v1.2 isochrones, `UBVRIplus` tarball, [Fe/H] = 0, v/vcrit = 0.4, Gaia EDR3 G/BP/RP, log age 7.5 to 10.15 (54 ages), EEP 202 to 707, odd EEPs below 454 dropped. 20,353 rows. | same script |
| `docs/astronomy/shared/data/clusters.csv` | Hunt & Reffert 2023 (A&A 673, A114), VizieR `J/A+A/673/A114/members`, every listed member of Melotte_22 (1,721) and NGC_2682 (1,844). Lindegren 2021 zero point subtracted, evaluated at G = 6 for brighter stars. Fetched 2026-09-27. | same script |

Spot-check: source_ids 143207476804948736 and 143455554116023040 re-queried
from the archive; G, BP-RP, parallax, parallax_error and RUWE match the
first two CSV rows after rounding (2026-09-27).

Zero-point port check: the stdlib port in `fetch-parallax.py` reproduces the
reference `zero_point.zpt.get_zpt` (run with numpy) to 0 mas on 300 sources
in the M67 field, 96 of them 6-parameter solutions (2026-09-27).

M67 contamination check: the same position-and-motion cut in four 0.5 deg
fields 2 deg away returns 11, 9, 7 and 14 sources, against 1,338 in the
cluster field, so under 1% of the sample is field stars.

## Article 2: The Distance Ladder

### Section 1, Parallax (figure 1)

| Claim | Kind | How we know |
|---|---|---|
| Earth's orbit is 300 million km across | D | 2 AU = 2.99e8 km |
| 1 pc = 206,265 AU = 3.26 ly; d[pc] = 1/parallax[arcsec] = 1000/parallax[mas] | D | 1 rad = 206,264.8 arcsec; 206,265 AU x 1.496e8 km / 9.461e12 km |
| No star has parallax >= 1 arcsec; nearest are a few hundred mas | S | Largest Gaia DR3 parallax is Proxima Cen, 768 mas (Gaia archive) |
| A coin (~2.3 cm) at 10 km subtends ~0.47 arcsec | D | 0.023/1e4 rad x 206,265 |
| Parallax path is Earth's orbit as seen from the star: circle at the ecliptic pole, line in the ecliptic, ellipse with axes parallax and parallax x sin(beta) between | D, C | Projection of a circle of radius 1 AU onto the plane of the sky; figure readout measures the computed path (e.g. zet Dor 86.8 and 82.9 mas vs 85.5 and 83.9, the difference being Earth's orbital eccentricity, 1.7%) |
| Gaia fits five astrometric parameters: two position, two proper motion, one parallax | S | Lindegren et al. 2021 (A&A 649, A2) five-parameter solutions; `astrometric_params_solved` = 31 |
| Parallax offsets: Delta alpha* = plx (X sin a - Y cos a), Delta delta = plx (X cos a sin d + Y sin a sin d - Z cos d), X,Y,Z Earth's barycentric position | D | From u' proportional to d u - b_E, projected on the local east and north unit vectors; checked by hand for Earth at -y giving +alpha shift |
| zet Dor near the south ecliptic pole (beta = -78.9), HD 245409 12 deg from the ecliptic (beta = -12.0) | C | Gaia DR3 `ecl_lat` |
| 61 Cyg A's yearly proper motion is 18 times its parallax | C | 5,282 mas/yr / 286.0 mas = 18.5 |
| 61 Cyg's large proper motion first drew astronomers to it (Piazzi); Bessel published its parallax in 1838, 313.6 mas for the system, the first reliable stellar distance | S | Wikipedia, "61 Cygni", History section (read 2026-09-27); secondary source, a primary (Bessel 1838, AN 16, 65) would be better |
| The four stars' parallax errors are 0.02 to 0.13 mas, distances good to a part in a thousand | C | Gaia DR3 `parallax_error`: 0.024 to 0.132 mas; worst fractional 0.13/148 = 0.09% |

### Section 1, Why you can't just invert (figure 2)

| Claim | Kind | How we know |
|---|---|---|
| 30% low parallax gives distance 43% high; 30% high gives 23% low | D | 1/0.7 = 1.43, 1/1.3 = 0.77 |
| M67 has over a thousand members moving together | C | 1,338 in the cut, < 1% field (check above) |
| Sample lies within 7 pc of the centre on the sky, under 1% of the distance | D | 0.5 deg x 835 pc = 7.3 pc |
| Bright members' parallaxes good to about 2% | C | Median parallax_error 0.021 mas for the 427 stars with error < 0.03 mas, / 1.197 = 1.7% |
| Cluster distance 835 pc (inverse-variance mean parallax 1.1975 mas of those 427) | C | Node/Python check on the CSV; page computes it live |
| At 30% (default group), mean of 1/plx is ~17% beyond the cluster; median ~848 pc; few negative parallaxes in the worst group (6 of 120 at 44%) | C | Figure readout; Python check |
| The predicted 1/plx distribution (from catalogue errors, no fit) follows the histogram | C | Visual; normalised residuals (plx - plx_c)/sigma have robust sd 1.0 to 1.1 above 25% error, 1.2 to 1.4 for bright stars (cluster depth plus known underestimated errors) |
| With L = 1000 pc the 30% group's posterior medians centre near 1,265 pc; L = 200 pc brings them to ~815 pc | C | Python check matching the page's grid (5 pc steps to 6 kpc) |
| Gaia distance catalogues use a prior from a 3D Galaxy model, direction by direction; photogeometric distances also use colour and magnitude | S | Bailer-Jones et al. 2021 (AJ 161, 147), abstract, arXiv:2012.05220 |
| Zero point subtracted per star; median -0.033 mas in M67, ~3% of its parallax | C | `zpt` column |

### Section 2, Brightness corrected for distance (figure 3, HR diagram)

| Claim | Kind | How we know |
|---|---|---|
| Five magnitudes is exactly a factor of 100 in flux; one magnitude is about 2.512 | D | Definition of the magnitude scale (Pogson); 100^(1/5) = 2.5119 |
| Smaller magnitude = brighter; colour is a difference of magnitudes, BP-RP larger for redder stars | D | Follows from m = -2.5 log10 F + const; red star has less BP flux, so larger BP magnitude |
| Gaia G runs 330 to 1,030 nm (visible into near infrared); BP up to ~670 nm, RP from ~620 nm | C, S | ESA (E)DR3 passband table (cosmos.esa.int/web/gaia/edr3-passbands, version 2), wavelengths where transmission exceeds 1% of peak: G 330-1030, BP 330-673, RP 620-1042 nm. Photometry paper: Riello et al. 2021 (A&A 649, A3) |
| M_G = G + 5 log10(parallax in mas) - 10 | D, S | d = 1000/parallax pc; G - 5 log10(d/10) = G - 5(2 - log10 parallax). Same form in Babusiaux et al. 2018 (A&A 616, A10), Sect. 2 |
| sigma_M = (5/ln 10) sigma_parallax / parallax = 2.17 / (parallax/error) | D | First-order propagation through the log |
| At parallax/error = 10, M_G uncertain by at most ~0.22 mag; the Gaia team used this cut for their HR diagrams | D, S | 2.17/10; Babusiaux et al. 2018 Sect. 2.1: "10% relative precision ... uncertainty on M_G smaller than 0.22 mag" |
| Reddening almost negligible within ~60 pc (Local Bubble); ignored out to 100 pc | S | Babusiaux et al. 2018 Sect. 2.2, citing Lallement et al. 2003; their local (<100 pc) HRDs skip the extinction cut. The article states the choice, not a claim that 100 pc is dust-free |
| Gaia parallax zero-point bias is a few tens of microarcseconds | S | Lindegren et al. 2021 (A&A 649, A4), abstract, arXiv:2012.01742 |
| Correcting it would move M_G by about 0.01 mag at most | D | 2.17 x 0.05 mas / 10 mas = 0.011 mag at the sample's smallest parallax |
| Spurious large parallaxes come mostly from close pairs resolved only on some scans, most likely in crowded fields | S | GCNS paper (Smart et al. 2021, A&A 649, A6), Sect. "Removal of spurious sources", citing Gaia DR2 paper Sect. 7.9 |
| GCNS uses a trained classifier (random forest) to remove spurious solutions; 331,312 objects | S | GCNS paper, abstract and Sect. 2; count confirmed by `SELECT COUNT(*)` on the archive table |
| RUWE >~ 1.4 indicates an ill-behaved single-star astrometric solution; high RUWE flags many unresolved binaries | S | GCNS paper, binaries section ("ruwe >~ 1.4 (indicative of an ill-behaved astrometric solution)") |
| Default cut: 58,144 of 83,111 stars pass; 85% are GCNS members | C | Figure readout; matches node check on the CSV |
| Haze below the red main sequence: GCNS keeps <1% at parallax/error < 10, 6.8% at 10 to 20, 89% above 20 | C | Node check on the CSV, haze region BP-RP 1.2 to 4, M_G > 12.5 + 0.8(BP-RP - 1.2), M_G < 18 |
| Cut 20 removes most of the haze (8,280 of 10,142 haze stars at >= 10 lie between 10 and 20) | C | Same node check |
| Giants (BP-RP 1.0 to 1.3, M_G < 2.5) median M_G 0.87, vs Sun-like dwarfs (BP-RP 0.8 to 0.9) 4.79: ~37x brighter, written "about 40 times" | C | Node check, parallax/error >= 20 (giants) and >= 10 (dwarfs) |
| White dwarfs at BP-RP 0.3 are ~11 mag (~26,000x) fainter than main-sequence stars of the same colour; written "some twenty-five thousand" | C | Node check at parallax/error >= 20: median M_G 12.97 (WD, 133 stars) vs 1.93 (MS) |
| Same colour means roughly the same surface temperature | D | Colour set by spectral shape, near-blackbody; hedged "roughly" (gravity and metallicity shift it slightly) |
| Sample lies at 10 to 100 pc, so apparent magnitudes are offset 0 to 5 mag; 87% of stars at parallax/error >= 10 are beyond 50 pc; median ~78 pc | D, C | 5 log10(100/10) = 5; node check |
| Sun-like dwarfs span 1.6 mag in M_G but 2.8 in G (middle 90%) | C | Figure readout with the preset |
| 10 pc to 10 kpc spreads a sequence over 15 mag | D | 5 log10(10000/10) = 15 |
| Blackbody colours: CIE 1931 fit (Wyman, Sloan & Shirley 2013), Planck spectrum, sRGB | C | Node test vs M. Charity's bbr_color table: 3000 K #ffb96e vs #ffb969, 4000 K #ffd4a5 vs #ffd5a1, 10000 K #cdd9ff vs #cfdaff |
| Temperature from BP-RP uses the dwarf relation; white dwarf and giant colours approximate; hot end clamped at 10,700 K (B9V) | D | Stated in the caption |
| Gaia DR3 summary paper is Gaia Collaboration, Vallenari et al. 2023 (A&A 674, A1) | S | arXiv:2208.00211; DOI 10.1051/0004-6361/202243940 resolves via Crossref to volume 674, article A1, 2023 |

### Section 3, Leavitt's law (figures 4, 5, 6)

| Claim | Kind | How we know |
|---|---|---|
| LMC is the Milky Way's largest satellite, ~50x M67's distance | D | 49.59 kpc / 0.835 kpc = 59; "fifty times further" than "less than a kiloparsec" |
| Cepheids thousands of times as luminous as the Sun | C | LMC V fit at 10 d: 14.76; minus 18.477 = M_V -3.7; Sun M_V 4.83; 10^(8.55/2.5) = 2,600 |
| Leavitt 1908 (brighter variables have longer periods, Harvard Annals); 1912 paper on 25 SMC Cepheids (Harvard Circular 173, Pickering credits Leavitt) | S | Wikipedia, "Henrietta Swan Leavitt" (read 2026-09-27); secondary source |
| mu = m - M = 5 log10(d/10 pc) | D | As in section 2 |
| Over 6.2 years a 10-day Cepheid completes >200 cycles; a 0.1% period error slides the last cycle ~0.2 out of phase | D | 2,247/10 = 225; 225 x 0.001 = 0.22 |
| PDM statistic (Stellingwerf 1978) with 10 bins; grid step 1/(6T) in frequency | C | Page code; deepest dip 12.6343 d vs OGLE 12.63666 d for CEP-0800 (grid resolution 0.005 d at 12.6 d) |
| Secondary dips at 2P, 3P and at (k +/- f)/n cycles per day | C | Python check listing the PDM minima for CEP-0800 |
| Cepheid light curves rise faster than they fall | C | Folded CEP-0800: rise over ~0.35 of the cycle |
| LMC W_I fit: slope -3.315, 15.889 at 1 d, sigma 0.078 (2,223 kept) vs OGLE -3.314, 15.888, 0.077; I: -2.907/16.820/0.145 vs -2.911/16.822/0.146; V: -2.660/17.422/0.205 vs -2.690/17.438/0.208 | C, S | Page and Python reproduce; published values from Soszynski et al. 2015 Table 2 (read from the paper PDF) |
| Scatter ~0.2 mag in V, 0.15 in I, under 0.08 in W_I, about half of I; single-star distance error under 4% | C | Fits above; 0.078 x 0.4605 = 3.6% |
| W_I = I - 1.55(V - I), "extinction-free" | S | Soszynski et al. 2015, Sect. 4 |
| Dust dims I by a fixed multiple (~1.55) of the V-I reddening, so W is unchanged | D | W' = (I + A_I) - 1.55(V - I + E) = W when A_I = 1.55 E |
| SMC scatter twice the LMC's (0.159 vs 0.078 in W) | C | Fits |
| SMC eclipsing binaries span up to 10 kpc in distance | S | Graczyk et al. 2020 (ApJ 904, 13), abstract, arXiv:2010.08754 |
| Metal-poor Cepheids slightly fainter, ~0.2 mag per dex | S | Breuval et al. 2025 (ApJ 994, 111), abstract, arXiv:2507.15936: gamma ~ -0.2 mag/dex, metal-rich brighter |
| SMC offset 0.553 mag (median, W) gives 64.0 kpc vs 62.44 +/- 0.47 +/- 0.81 from eclipsing binaries | C, S | Page readout; Graczyk et al. 2020 abstract |
| LMC distance 49.59 +/- 0.09 (stat) +/- 0.54 (sys) kpc from 20 eclipsing binaries, surface brightness-colour calibration; mu = 18.477, sigma 0.024 mag (1.1%) | S, D | Pietrzynski et al. 2019 (Nature 567, 200), abstract, arXiv:1903.08096; 5 log10(4959) = 18.477 |
| Eclipsing-binary sizes come from eclipses plus orbital velocities | D | Standard double-lined eclipsing binary method; the abstract names the systems as eclipsing binaries |
| SH0ES anchors: Gaia parallaxes of MW Cepheids, NGC 4258 masers, LMC DEBs; Cepheids in hosts of 42 SNe Ia at z < 0.01 (a few tens of Mpc) | S, D | Riess et al. 2022 (ApJL 934, L7), abstract, arXiv:2112.04510; cz < 3000 km/s / 73 = 41 Mpc. "Masers in its nucleus": general knowledge, the abstract says only "masers in N4258" |
| 30-day Cepheid at W = 24.5: M_W = -7.48, mu = 31.98, 24.9 Mpc; with 10 Cepheids +/-1.6% | C | Figure readout |

### Section 4, Supernovae and the Hubble constant (figures 7, 8)

| Claim | Kind | How we know |
|---|---|---|
| Cepheids reach several tens of Mpc | C | Largest Pantheon+ CEPH_DIST 34.526 = 80 Mpc (SN 2007A host) |
| Type Ia = thermonuclear explosion of a white dwarf; can rival its galaxy's light | S, D | Maoz, Mannucci & Nelemans 2014 (ARA&A 52, 107), abstract, arXiv:1312.0628: "runaway thermonuclear explosion of a degenerate carbon-oxygen stellar core, most likely a white dwarf". M_B -19.25 vs a Milky Way-like galaxy's ~ -20 supports "rival", not "outshine" |
| Peak M_B about -19.3; billions of Suns | C, D | Page: -19.252 (inverse-variance mean of m_b_corr - CEPH_DIST over 77 light curves); Sun M_B ~ 5.44 gives 10^(24.7/2.5) = 7.6e9 |
| Most distant supernova in the sample at z = 2.26 | C | max zHD = 2.26137 |
| Raw scatter ~0.26 mag (12%); stretch alone 0.22, colour alone 0.17, both 0.13 (6%) | C | Python check and figure readout on the 238 Hubble-flow SNe, one light curve each, mu from flat LCDM (Om = 0.3) second-order d_L |
| Best fit alpha = 0.131, beta = 2.55 (simple least squares, no bias corrections) | C | Same; Pantheon+'s own m_b_corr gives 0.136 mag scatter on the same SNe |
| Slower light curves are brighter (Phillips 1993); Tripp (1998) linear standardisation | S | Pantheon+ README names m_b_corr "Tripp1998 corrected"; Phillips 1993 (ApJ 413, L105) is general knowledge, not re-read |
| Redder supernovae fainter, partly dust and partly intrinsic | S, C | Brout & Scolnic 2021 (ApJ 909, 26), abstract, arXiv:2004.10206: intrinsic colours plus extrinsic dust-like colours; the positive beta in the figure shows the fainter-when-redder trend |
| q0 = -0.55, j0 = 1 for a flat universe with Om = 0.3 | D | q0 = Om/2 - OL = 0.15 - 0.7; j0 = 1 for flat LCDM |
| H0 = 10^((M_B + 5 a_B + 25)/5), a_B = log10(c z f(z)) - 0.2 m | D | From m = M + 5 log10(d_L/Mpc) + 25 and d_L = c z f(z)/H0 |
| Page H0 = 73.25 +/- 0.77 (stat) from 43 calibrators and 238 Hubble-flow SNe | C | Page and Python agree |
| SH0ES 73.04 +/- 1.04; 42 SNe Ia; anchors Gaia parallaxes, NGC 4258 masers, LMC DEBs | S | Riess et al. 2022, abstract |
| Local Distance Network 73.50 +/- 0.81, 7.1 sigma from flat LCDM with Planck+SPT+ACT | S | arXiv:2510.23823 abstract (2025) |
| CCHP 70.39 +/- 1.22 (stat) +/- 1.33 (sys) +/- 0.70 (sigma_SN), TRGB | S | Freedman et al. 2024, arXiv:2408.06153 abstract |
| Planck 67.4 +/- 0.5 assuming base LCDM | S | Planck 2018 VI (A&A 641, A6), abstract |
| JWST rejects unrecognised crowding of Cepheid photometry as the cause at 8 sigma | S | Riess et al. 2024, arXiv:2401.04773, title and abstract |
| Matching Planck needs +0.18 mag, every Cepheid distance ~9% larger | C | 5 log10(73.25/67.4) = 0.181; 10^(0.181/5) = 1.087 |
| A 0.1 mag zero-point shift moves H0 by ~5% | D | 10^(0.1/5) = 1.047 |

### Section 5, The ladder itself (figure 9)

| Claim | Kind | How we know |
|---|---|---|
| Parallax bar: 3.5 pc (61 Cyg) to 835 pc (M67); 10% reach for bright stars ~4.8 kpc | C | 1000/286 pc; M67 mean parallax; 1000/(10 x median error 0.021 mas) |
| EB anchors: LMC 49.59 kpc (1.1%), SMC 62.44 kpc | S | Pietrzynski 2019; Graczyk 2020 |
| Cepheid bar: LMC to SMC (Cepheid distance), and SN hosts 6.8 to 80 Mpc | C | Figure 5 offset; CEPH_DIST range |
| SN bar: calibrators, Hubble flow 78 to 685 Mpc, all Pantheon+ to 17 Gpc (luminosity distance, model-dependent beyond z 0.15) | C | MU_SH0ES ranges |
| M_B to 1.0% from calibrator scatter; H0 1.1% stat, ~1.5% with the LMC anchor alone | C | sd/sqrt(43) = 0.021 mag; readout |

## Article 1: The Sky From Where You Stand

Model checks (2026-09-27):
- Precession port (`LTP` in the page) against `pyerfa` `erfa.ltp`: max matrix
  difference 2e-16 at epochs -10000, -3000, 0, 1000, 2000, 2026, 5000, 14000, 15000.
- Planet model (`helio`) against JPL Horizons observer ecliptic longitude of Mars,
  daily 2024-09-01 to 2025-05-01 (after adding 50.29"/yr general precession to go
  from J2000 to of-date): max difference 0.011 deg; stations 2024 Dec 7 and
  2025 Feb 24 on the same days in both.
- Equation of time (Kepler model, eps 23.4393, e 0.01671, varpi 282.932): Meeus
  Example 28.b, 1992 Oct 13.0, gives 13m42.6s; model 13m43.9s. Max difference from
  Smart's series over 2026: 0.18 min.
- Saros from date: lunation N = round((JD - 2451550.09766)/29.530588861) matches the
  canon's lunation for 11,898/11,898; S = (38N + 132) mod 223 - 20 matches its saros
  number for 11,898/11,898 (also computed live on the page).
- Ballesteros 2012 eq. 14, T = 4600 [1/(0.92(B-V)+1.7) + 1/(0.92(B-V)+0.62)], read in
  arXiv:1201.1809.

| Claim | Kind | How we know |
|---|---|---|
| Earth's trip shifts the nearest stars by < 1" either way | S | Proxima's parallax 768 mas (Gaia DR3, article 2 data context) |
| RA measured east from the March equinox, in hours; Dec from celestial equator | D | definitions |
| Pole altitude = latitude; alt/az formulas; circumpolar if dec > 90 - lat | D | spherical triangle; code implements the same formulas (N, E, Up components) |
| At the equator no star is circumpolar; at the pole the northern half never sets | D | from the condition above (refraction ignored) |
| Fig 1 pole-star readout: nearest star V < 4 to the visible pole; Thuban (V 3.65) at 2800 BC, Polaris now | C | page readout at presets |
| Nothing in the figures uses a distance; EoT needs orbit shape not size; retrograde depends on ratios of orbit sizes (Kepler III fixes period ratios) | D | geometry: directions invariant under uniform scaling |
| Figure 1 counts: 1,399 above horizon, 329 circumpolar (40 N, 15 Jan 21:00, 2026) | C | page readout |
| 2,887 stars to V 5.5 in BSC | C | fetch script count |
| Sidereal day 23h56m04s; sky turns 0.9856 deg per solar day, 3m56s; 30 deg (2 h) per month | D | 360/(360+0.9856474) x 24 h; Almanac mean-longitude rate |
| LST = L + 15(t - 12) with t local mean time | D | mean solar time = hour angle of mean Sun + 12 h, mean Sun RA = L |
| Precession ~50"/yr, full turn ~26,000 yr | C | model: 50.38"/yr swept by the pole at 2000, 25,722 yr |
| Polaris now 0.6-0.7 deg from pole, closest 0.46 deg ~AD 2100 | C | model with BSC proper motion; page computes the prose numbers |
| Great Pyramid built c. 2600 BC | S | Wikipedia, Great Pyramid of Giza ("built c. 2600 BC"), read 2026-09-27. Secondary source; upgrade to a primary Egyptological date if revisited |
| Thuban ~1 deg from pole in 2600 BC (1.12); closest 0.10 deg ~2800 BC (-2795) | C | model. Note: Wikipedia says "about two degrees"; we state the model's value |
| Vega within 6 deg of pole ~AD 13,600 (5.70 deg at 13595) | C | model |
| Obliquity drifts 22.6-24.2 deg over -12000..14000 | C | model (22.62, 24.22) |
| Arcturus moves 16 deg in 26,000 yr; > 30 Moon widths | C | BSC pm (-1.093, -1.998)"/yr; 16.3 deg; Moon 0.5 deg |
| Precession caused by Sun and Moon torque on the equatorial bulge | D | standard mechanics (torque on oblate spinning body) |
| EoT = alpha_mean - alpha_sun = (L - lambda) + (lambda - alpha) | D | definition, sign sundial minus clock |
| Perihelion early January | D | Almanac g = 0 at 1999 Jan 3.25 |
| EoT extremes +16 min 25 s on 3 Nov, -14 min 15 s on 11 Feb (2026) | C | page readout; Smart's series agrees to 0.2 min |
| Eccentricity term amplitude 7.7 min, tilt term 9.9 min | C | model (7.66, 9.87) |
| Tilt term ~ eps^2 (tan^2(eps/2)), declination ~ eps; so small tilt gives an ellipse | D | Smart's series first term y sin 2L, y = tan^2(eps/2) |
| 1 minute of time = 0.25 deg | D | 360/1440 |
| Perihelion 283 deg from March equinox | C | Almanac L - g = 282.93 |
| Mars model vs JPL ephemeris ~0.01 deg over 2024-25 | C | Horizons check above |
| Retrograde spell averages 1990-2040: Mercury 22 d/13 deg, Venus 42/16, Mars 74/16, Jupiter 121/10, Saturn 137/7, Uranus 152/4, Neptune 159/3 | C | page (FIG3.AVG) |
| Mars 2024-25 retrograde 7 Dec to 24 Feb, 79 d, 19.2 deg, opposition-centred | C | page; stations match Horizons |
| Retrograde centred on opposition (outer) / inferior conjunction (inner) | D | geometry; seen in the strip at each spell |
| Synodic 29.530589, draconic 27.212221, anomalistic 27.554550 d | S | NASA SEsaros page (Espenak) |
| 223 syn = 6585.321 d; 242 drac = 6585.358; 239 anom = 6585.537 | D | products. NASA page prints 6585.3223 for 223 syn; the product of its own month is 6585.3213 |
| Moon's orbit tilted ~5 deg (5.145) | S | NASA Moon fact sheet |
| Sidereal month 27.32 d | S | NASA Moon fact sheet, sidereal period 655.720 h |
| Nodes regress once per 18.6 yr | D | 1/(1/27.212221 - 1/27.3217) = 6,793 d = 18.60 yr |
| Saros 18 yr 11 d (10 or 12), ~8 h; shift ~120 deg west | S/D | NASA page; 0.321 d = 7.7 h = 116 deg |
| Median shift between consecutive central eclipses 117 deg west | C | canon, all series |
| Moon ~0.5 deg (0.48) further from node each saros | D/C | (6585.3575 - 6585.3213)/27.2122 x 360 = 0.48 deg; page readout 0.5 |
| Eclipse window ~35 deg wide around the node | D/C | mean complete-series length 73.5 x 0.48 deg per saros = 35 deg |
| Complete families average 74 eclipses | C | canon, 116 complete series, mean 73.5 |
| Complete series: 70-86 eclipses, 1,244-1,533 yr | C | canon, 116 series wholly inside the window |
| About 40 series running at once | C | canon: 40 active in 2026; 39-47 over -1500..2500, mean 42 |
| Inex = 358 months = 388.5 draconic months, opposite node; neighbouring series alternate | C | page readout 0.0 deg from opposite node; odd series gamma decreases (92+5 series), even increase (98) |
| 669 months: day dial back within 13 deg | C | page readout (0.9 h short) |
| Saros 139: 71 eclipses 1501-2763, 16 P, 12 H, 43 T; includes 2024 Apr 8 | C | canon |
| Gamma step ~0.043 per saros | C | canon median 0.042 overall |
| Gamma beyond ~+-1 misses Earth, only partial | D | gamma in Earth radii; partials at |gamma| > ~0.997 plus penumbra |

## Article 3: Lives of Stars

Model checks (2026-09-27, node, same code as the page):
- Lane-Emden RK4 (h = 0.001): xi1 = 2.44949 (n=0), 3.14159 (n=1), 3.65375 (n=1.5),
  6.89685 (n=3), 14.97155 (n=4), 31.83646 (n=4.5); rho_c/rho_mean = 1, 3.290, 5.991,
  54.18, 622.4, 6189. Max |theta - closed form|: 4e-8 (n=0), 2e-8 (n=1), 5e-14 (n=5, to xi=20).
  n=3 values match the standard tabulated 6.89685 and 54.18.
- Gamow saddle-point <sigma v> against direct numerical integration of the
  Maxwell x tunnelling integrand: within 3% (pp) and 1% (14N+p) at 10, 15.7, 25 MK.
- White dwarf integrator: mass at rho_c = 1e16 is 1.4563 Msun; Chandrasekhar closed form
  omega_3 sqrt(3 pi)/2 (hbar c/G)^1.5/(mu_e m_u)^2 with omega_3 = 2.01824, mu_e = 2 gives
  1.4563. Mass rises monotonically with rho_c on the plotted range.
- Isochrone fit reproduced in Python (fit.py logic, same cost): M67 minimum log age 9.65
  on the grid (page, with parabola refinement: 9.64, 4.39 Gyr); Pleiades 8.30 (page 8.30,
  201 Myr). Fit uses prob >= 0.5 and M_G < 4.5; changing the probability cut to 0.3
  moves the Pleiades to 8.25 and leaves M67 at 9.65.

| Claim | Kind | How we know |
|---|---|---|
| L = 4 pi R^2 sigma T^4 fixes R from L and T | D | Stefan-Boltzmann; readout radii from it (Sun at ZAMS 0.88 Rsun in MIST) |
| Main sequence is fixed almost entirely by mass | D, C | Vogt-Russell idea; figure 3 tracks at one composition, figure 2 Tc(M) |
| Hydrostatic equilibrium and mass continuity equations | D | force balance on a shell |
| P_c ~ GM^2/R^4 ~ 1e16 dyn/cm^2, ten billion atmospheres | D | 6.674e-8 x (1.989e33)^2 / (6.957e10)^4 = 1.13e16; / 1.013e6 = 1.1e10 atm |
| Polytrope P = K rho^(1+1/n) reduces to Lane-Emden with rho = rho_c theta^n | D | standard substitution |
| Closed forms at n = 0, 1, 5 | D, C | checked in the page (readout) |
| Eddington used n = 3 in the 1920s; n = 3 means radiation pressure a fixed fraction of the total | D | Eddington standard model: P_rad/P constant gives P proportional to rho^(4/3). Attribution and decade are general knowledge, not re-read |
| n = 3 scaled to the Sun: P_c 1.24e17 (half the SSM's 2.36e17), T_c 12.1 MK with mu = 0.61 | C | page readout; W_3 = 1/(4 pi 4 theta'(xi1)^2) = 11.05 |
| SSM centre 15.7 MK, 152.9 g/cm^3, rho_c/rho_mean 108 ("twice as concentrated" as n=3's 54) | C | BS05 table first zone; rho_mean = 1.410 g/cm^3 |
| SSM core has burned about half its hydrogen | C | X_c = 0.346 vs surface X = 0.740 in the table |
| Helium-rich gas has fewer particles per gram (higher mu), so needs higher T or rho for the same P | D | mu = 1/(2X + 3Y/4 + Z/2): 0.61 at X 0.7, 0.85 at the SSM centre; ideal-gas T_c from the SSM's own P_c/rho_c gives 15.9 MK with mu 0.85 |
| n = 1.5 is an adiabatic monatomic gas (gamma = 5/3); convection keeps gas on an adiabat | D | 1 + 1/n = 5/3 |
| Smallest red dwarfs are fully convective | C | MIST convective-core mass equals the total mass at 0.10 and 0.15 Msun (mist-masses.csv) |
| Nuclear force range ~1e-13 cm; Coulomb barrier ~1 MeV there | D | e^2/r = 1.44 MeV fm / 1 fm |
| kT at the Sun's centre 1.3 keV, ~1000x below the barrier | D | 8.617e-8 keV/K x 1.567e7 K = 1.35 keV |
| Tunnelling ~ exp(-sqrt(E_G/E)), E_G = 2 m_r c^2 (pi alpha Z1 Z2)^2; rate ~ exp(-tau), tau = 3(E_G/4kT)^(1/3); local exponent nu = (tau - 2)/3 | D | Gamow factor and saddle point; d ln(T^-2/3 e^-tau)/d ln T = -2/3 + tau/3 |
| At the Sun's centre pp ~ T^3.8, CNO ~ T^19.5 ("fourth" and "twentieth" power) | C | page readout at 1 Msun (MIST Tc 15.9 MK) |
| S11(0) = 4.01e-25 MeV b; S114(0) = 1.66 keV b; ratio 4e21 | S, D | Adelberger et al. 2011 (Solar Fusion II), arXiv:1004.2318 source, Table and Eqs. for S11 and S1,14; 1.66e-3 / 4.01e-25 = 4.1e21 |
| pp: 26.2 MeV per 4He (two pp reactions); CNO: 25.0 MeV per cycle | D | 26.73 MeV Q minus neutrino losses (2 x 0.265 for pp-I; ~0.7 + ~1.0 for 13N, 15O decays). Standard values, not re-read |
| Formulas summed over BS05: 0.79 Lsun, 0.6% CNO | C | page readout (ssmSum), with BS05's own Lsun 3.8418e33 |
| MIST 1 Msun at mid-MS: CNO 0.8% of H burning | C | 10^cno/(10^pp + 10^cno) at EEP 353 |
| Borexino detected CNO neutrinos in 2020; pp chain ~99% of solar energy | S | Borexino Collaboration, arXiv:2006.15115 abstract (Nature 587, 577) |
| MIST CNO share passes one half at 1.49 Msun ("about 1.5") | C | page readout (interpolated in mist-masses.csv) |
| Formula rates equal at 18.7 MK at the Sun's central composition | C | page readout (bisection) |
| Convective core appears at ~1.2 Msun in MIST | C | mass_conv_core at EEP 353: 0 up to 1.14, 0.002 at 1.18, 0.007 at 1.20, 0.028 at 1.22 |
| Steep T dependence acts as a thermostat, so each mass has one T_c | D | stability argument (perturbation heats, expands, cools); standard, not re-read |
| Screening: electrons partly cancel the nuclear charge and lower the barrier | D | Debye-Hueckel screening; qualitative only |
| MIST: MESA-based, 0.1 to 300 Msun | S, C | MIST tarball contents (196 tracks 0.1 to 300); Choi et al. 2016 |
| L ~ M^4 between 1 and 10 Msun | C | MIST ZAMS (EEP 202) log L: 1 Msun -0.127, 5 Msun 2.727, 9 Msun 3.658: slopes 4.1 and 4.0 |
| 10 Msun burns core H hundreds of times faster | C | MS age 9.92 Gyr / 24.2 Myr = 410 |
| Giant branch up to thousands of Lsun for the Sun | C | 1 Msun track max log L on phase 2: 3.36 (2,300 Lsun) |
| Tracks from 9 Msun up end at core carbon burning; 7 and 8 Msun end at the start of the TP-AGB; up to 5 Msun reach the WD cooling sequence, 6 Msun post-AGB | S, C | MIST README_tables.pdf EEP table (low-mass type: 808 = TPAGB, 1409 post-AGB, 1710 WDCS; high-mass type: 808 = C-burn); track headers mark 9 Msun the first high-mass type |
| Clusters: one age, one composition, one distance; a few hundred to thousands of members | D, C | the two clusters here: 1,721 and 1,844 listed members |
| Pleiades 135 pc, M67 837 pc (mean parallax of prob >= 0.5, RUWE < 1.4 members, zero point subtracted) | C | page: 7.414 and 1.195 mas |
| E(B-V) = 0.045 (Pleiades), 0.037 (M67); A0 = 3.1 E(B-V); extinction coefficient polynomial | S | Babusiaux et al. 2018 (A&A 616, A10) arXiv source, Table 1 (coefficients), Eq. 1, Table 2 (E(B-V)) |
| M67 best fit 4.39 Gyr ("about 4.4"), turnoff 1.25 Msun | C | page readout after Best fit |
| M67 age "close to solar" per the Gaia team | S | Babusiaux et al. 2018 Sect. on M67: "an age close to solar (~4 Gyr)" |
| M67 has blue stragglers above the turnoff | S | Babusiaux et al. 2018: "Blue stragglers are also visible over the main-sequence turn-off"; mechanism (mass transfer) is general knowledge, not re-read |
| Pleiades fit broad and shallow, minimum ~200 Myr | C | page: 201 Myr; cost curve |
| Pleiades lithium-depletion and eclipsing-binary ages log 8.04 to 8.10 (110 to 126 Myr, written "about 110 to 125") | S | Babusiaux et al. 2018: "log(age) is in the range 8.04 +/- 0.03 - 8.10 +/- 0.06 and is derived from the lithium depletion boundary or from eclipsing binaries" |
| Isochrone age depends on model rotation | D | MIST v/vcrit 0.4 vs 0 grids differ; stated as a reminder, not quantified |
| Degenerate electrons: P ~ rho^(5/3) non-relativistic (n=1.5), rho^(4/3) relativistic (n=3); n=3 with fixed K has a unique mass; R ~ M^(-1/3) | D | Fermi gas limits; Lane-Emden mass-radius scaling M ~ R^((3-n)/(1-n)) |
| White dwarf ~1 Msun, Earth-sized; Sirius B smaller than Earth | S, D | Bond et al. 2017b Table 3: Sirius B 1.018 Msun, 0.008098 Rsun = 0.88 R_Earth |
| Chandrasekhar limit 1.456 for mu_e = 2 (written 1.46) | C | page: integration and closed form agree |
| Usually quoted ~1.4; Coulomb, electron capture (inverse beta decay) and GR are left out here and included in fuller treatments | D, S | our equation of state; Rotondo et al. 2011 (arXiv:1012.0154) abstract |
| Four WDs: Procyon B 0.592/0.01232, Sirius B 1.018/0.008098, Stein 2051 B 0.675/0.0114, 40 Eri B 0.573/0.01308 (Msun/Rsun) | S | Bond et al. 2017 (ApJ 848, 16), arXiv:1709.00478 source, Table 3 |
| MIST WDs from <= 6 Msun: 0.52 to 0.98 Msun | C | he_core at track end, 0.8 to 6 Msun |
| MIST cores pass the limit at 9.5 Msun | C | page readout (interpolated) |
| Collapse to nuclear density; NS or BH, outcomes interleaved in mass; mean NS 1.4 Msun | S | Sukhbold et al. 2016 (ApJ 821, 38), arXiv:1510.04643 abstract |
| Sun to 2 Msun: T_c 15.9 to 23.5 MK; central CNO/pp from 0.087 to 27 | C | page (FIG2 share at 1 and 2 Msun) |
| M67 default 2.0 Gyr; below G ~ 15 the best-fit isochrone is bluer than the dwarfs; fit excludes them | C | figure at best fit, visual; fit region M_G < 4.5 is G < 14.1 |
| Above 1e9 g/cm^3, a hundredfold density rise adds < 0.1 Msun | C | page: 1.367 at 1e9, 1.451 at 1e11 |
| Cores above the limit burn carbon and heavier elements to iron, which yields no fusion energy | D | binding energy per nucleon peaks near iron; general knowledge, not re-read |
| Stars of 8 to 10 Msun hardest to model; 7 and 8 Msun MIST tracks stop with cores still growing | C | MIST ends at TP-AGB start for 7, 8 Msun (README EEP table); "hardest to model" is a hedge, not re-read |
| Chandrasekhar found the limit by solving hydrostatic balance with the degenerate EOS | D | general knowledge (Chandrasekhar 1931, ApJ 74, 81), not re-read |

## Series-level facts (from PROMPT.md, to check when each article is written)

Open: 51 Peg b 1995 (Mayor & Queloz); RV gives m sin i; transit probability
~R*/a. Checked in article 3: Chandrasekhar limit (1.456 computed, ~1.4 quoted) and the
Sun's CNO fraction (0.6% formulas, 0.8% MIST, Borexino ~99% pp). H0 values checked in
article 2 (2026-09-27).
