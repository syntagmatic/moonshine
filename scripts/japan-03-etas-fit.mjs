// Fit the temporal ETAS model to the Tohoku box for japan-earthquakes essay 03
// and write docs/japan-earthquakes/shared/data/03-etas-fit.json.
//
//   node scripts/japan-03-etas-fit.mjs [--quick]     (about 10 minutes; --quick skips M4.5)
//
// Model and code: docs/japan-earthquakes/shared/03-aftershock.js (global Aftershock),
// SAPP's parameterization: lambda(t) = mu + sum K exp(alpha (M_j - Mz)) / (t - t_j + c)^p,
// time in days from 2000-01-01 UTC. Events are the USGS catalog's earthquakes inside the
// box 34.5-42 N, 139-146 E with M >= Mz. The target window is the whole catalog minus
// gaps: after every M7+ event in the box, until Helmstetter, Kagan & Jackson's (2006)
// completeness curve Mc(t) = Mmain - 4.5 - 0.75 log10(t) falls to Mz (Completeness
// helper); events in a gap still trigger but are not scored. Fit: Nelder-Mead on
// (ln mu, ln K, ln c, alpha, p) with restarts, standard errors from a central-difference
// Hessian. Mz = 5.0 is the homogeneous cutoff (Completeness.eraContrast: the M4.5-4.9
// counts differ before and after 2010 at every level, M5+ does not); 4.5 and 5.5 are fitted
// for the page's cutoff toggle.
//
// The file also carries the SAPP reference results (scripts/japan-03-sapp-fixture.json,
// made by scripts/japan-03-sapp-fixture.R) that the library's checks use, and the
// published Jalilian (2019) fit for comparison.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shared = path.join(root, "docs/japan-earthquakes/shared");
const A = require(path.join(shared, "03-aftershock.js"));
const C = require(path.join(shared, "completeness.js"));
const quick = process.argv.includes("--quick");

const DAY = 86400000, ORIGIN = Date.UTC(2000, 0, 1);
const BOX = { s: 34.5, n: 42, w: 139, e: 146 };

function parseCsv(txt) {
  const rows = []; let row = [], cur = "", q = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if (q) { if (ch === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
    else if (ch !== "\r") cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const rows = parseCsv(fs.readFileSync(path.join(shared, "data/earthquakes.csv"), "utf8"));
const h = rows[0], ix = k => h.indexOf(k);
const quakes = rows.slice(1).filter(r => r[ix("type")] === "earthquake").map(r => ({
  time: +new Date(r[ix("time")]), lat: +r[ix("latitude")], lon: +r[ix("longitude")], mag: +r[ix("mag")]
})).sort((a, b) => a.time - b.time);
if (quakes[0].time < ORIGIN) throw new Error("catalog starts before 2000");
const inBox = d => d.lat >= BOX.s && d.lat <= BOX.n && d.lon >= BOX.w && d.lon <= BOX.e;
const boxEv = quakes.filter(inBox);
const main = quakes.reduce((a, b) => (b.mag > a.mag ? b : a));
const tEnd = (quakes[quakes.length - 1].time - ORIGIN) / DAY + 1e-6;
const t0 = (main.time - ORIGIN) / DAY;

const round = (v, d = 6) => +(+v).toPrecision(d);
const fits = {};
const mzList = quick ? [5.0, 5.5] : [5.0, 5.5, 4.5];
const starts = { 4.5: { mu: 0.046, K: 0.039, c: 0.03, alpha: 1.5, p: 1.055 }, 5.0: { mu: 0.039, K: 0.0135, c: 0.027, alpha: 1.95, p: 1.1 }, 5.5: { mu: 0.0175, K: 0.0073, c: 0.023, alpha: 2.17, p: 1.148 } };
for (const Mz of mzList) {
  const ev = boxEv.filter(d => d.mag >= Mz - 1e-9);
  const t = ev.map(d => (d.time - ORIGIN) / DAY), m = ev.map(d => d.mag);
  const gaps = ev.filter(d => d.mag >= 7).map(d => { const a = (d.time - ORIGIN) / DAY; return [a, a + C.tCompleteAfter(d.mag, Mz)]; }).filter(g => g[1] - g[0] > 1e-4);
  const o = { Mz, tStart: 0, tEnd, gaps };
  const t1 = Date.now();
  const fit = A.etasFit(t, m, o, starts[Mz], { iters: Mz === 4.5 ? 250 : 500, restarts: Mz === 4.5 ? 2 : 5 });
  const se = A.etasStdErr(t, m, o, fit.x);
  const par = fit.par;
  const bv = C.bValue(m, Mz);
  const nBr = A.branchingRatio(par, bv.b, Mz, main.mag, Infinity);
  const nBr25 = A.branchingRatio(par, bv.b, Mz, main.mag, tEnd);
  const root = t.findIndex(v => Math.abs(v - t0) < 1e-6);
  const d = A.declustering(t, m, par, Mz, root);
  let bgSum = 0, nTarget = 0;
  for (let i = 0; i < t.length; i++) if (!gaps.some(g => t[i] >= g[0] && t[i] < g[1])) { bgSum += d.bg[i]; nTarget++; }
  const rt = A.residualTimes(t, m, par, o), ks = A.ksUniform(rt.tau.map(v => v / rt.total));
  fits[Mz.toFixed(1)] = {
    Mz, n: t.length, nTarget, gaps: gaps.map(g => [round(g[0], 9), round(g[1], 9)]),
    par: Object.fromEntries(Object.entries(par).map(([k, v]) => [k, round(v, 8)])),
    x: fit.x.map(v => round(v, 8)), se: se.map(v => round(v, 4)),
    negLogLik: round(fit.nll, 10), b: round(bv.b, 4), bSe: round(bv.se, 3),
    branching: { Mmax: main.mag, infinite: round(nBr, 4), toEnd: round(nBr25, 4) },
    backgroundShare: round(bgSum / nTarget, 4), muPerYear: round(par.mu * 365.25, 5),
    ks: { D: round(ks.D, 4), crit95: round(ks.crit95, 4) },
    seconds: Math.round((Date.now() - t1) / 1000)
  };
  console.error(`Mz ${Mz}: n ${t.length}, mu/yr ${(par.mu * 365.25).toFixed(1)}, c ${par.c.toFixed(4)} d, alpha ${par.alpha.toFixed(2)}, p ${par.p.toFixed(3)}, bg ${(bgSum / nTarget).toFixed(2)}, branching ${nBr.toFixed(2)}, KS D ${ks.D.toFixed(3)} (${fits[Mz.toFixed(1)].seconds} s)`);
}

// Bath's law in the fitted model: the Tohoku mainshock alone, no background, first year
const f5 = fits["5.0"];
const bath = A.bathSimulate({ ...f5.par, mu: 0 }, f5.b, 5.0, main.mag, 365, 400, 1000);
const obs = (() => { const a = boxEv.filter(d => d.time > main.time && d.time <= main.time + 365 * DAY); const mx = a.reduce((x, y) => (y.mag > x.mag ? y : x)); return { mag: mx.mag, dM: round(main.mag - mx.mag, 3), hours: round((mx.time - main.time) / 3600000, 3) }; })();

const sapp = JSON.parse(fs.readFileSync(path.join(root, "scripts/japan-03-sapp-fixture.json"), "utf8"));
const outObj = {
  source: "scripts/japan-03-etas-fit.mjs; model in shared/03-aftershock.js (Aftershock), completeness in shared/completeness.js. Box 34.5-42N 139-146E, USGS earthquakes M >= Mz, 2000-2025, days from 2000-01-01 UTC. Gaps: after each M7+ event in the box until Helmstetter, Kagan & Jackson (2006) Mc(t) = Mmain - 4.5 - 0.75 log10 t reaches Mz. Nelder-Mead MLE with restarts; se = standard errors of x = (ln mu, ln K, ln c, alpha, p) from a numerical Hessian.",
  origin: "2000-01-01T00:00:00Z", box: BOX, tEnd: round(tEnd, 9),
  catalog: { quakes: quakes.length, boxQuakes: boxEv.length, mainshockDay: round(t0, 9), mainshockMag: main.mag },
  fits,
  bath: { simulated: { ...bath, Mmain: main.mag, days: 365, runs: 400 }, observed: obs, law: 1.2, lawSource: "Bath (1965) Tectonophysics 2:483-514" },
  jalilian2019: {
    source: "Jalilian A. (2019) ETAS: An R package for fitting the space-time ETAS model to earthquake data. J. Stat. Softw. 88(CS1), Code Snippet 1, pp. 29-32: etas() on Zhuang's sample catalog (JMA, M >= 4.5, depth < 100 km, Japan polygon, 1953-05-26 to 1990-01-08), agreeing with etas8p to 1e-3",
    beta: 1.9734, b: 0.857, mu: 0.5505, A: 0.1658, c: 0.0296, alpha: 1.6579, p: 1.1534, D: 0.0018, q: 1.9507, gamma: 1.067,
    logLik: -15310.96, backgroundProbMean: 0.5452, backgroundProbMedian: 0.7565,
    note: "space-time model: K and A are not comparable with the temporal K, c and p are"
  },
  sapp
};
fs.writeFileSync(path.join(shared, "data/03-etas-fit.json"), JSON.stringify(outObj) + "\n");
console.error("wrote", (fs.statSync(path.join(shared, "data/03-etas-fit.json")).size / 1024).toFixed(0), "KB");
