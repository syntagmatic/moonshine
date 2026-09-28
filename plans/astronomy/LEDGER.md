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

## Series-level facts (from PROMPT.md, to check when each article is written)

Open: 51 Peg b 1995 (Mayor & Queloz); RV gives m sin i; transit probability
~R*/a; Chandrasekhar limit ~1.4 Msun for C/O; Sun's CNO fraction ~1%; saros =
223 synodic months, ~18 yr 11 d, ~1/3 of Earth's rotation shift; current SH0ES,
CCHP and Planck H0 values (check at writing time).
