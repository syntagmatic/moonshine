// Ledger run for docs/foam/07-foams-in-motion.html: 3,000 bubbles with the page's settings (M = 5, D = 1, res = 4).
// Usage: node scripts/foam-07-coarsen-run.cjs   (about a minute)
const F = require('../docs/foam/lib/07-coarsen.js');
const N = 3000, t0 = Date.now();
const f = F.random({ n: N, seed: 2007, aspect: 1, M: 5, D: 1, res: 4, dmin: 0.25 });
f.relax(200); const tg = f.t; f.advance(0.01);
const k = f.rateConstant(), meter = new F.Meter(f); meter.sample();
let pts = [], series = [], next = f.t + 0.02 * f.meanArea(), rises = 0, lastL = f.totalLength, intervals = 0;
const resid = [];
while (f.bubbles > N / 16) {
  f.step();
  if (f.t >= next) {
    next = f.t + 0.02 * f.meanArea();
    const s = meter.sample(); s.forEach(p => { pts.push({ n: p.n, rate: p.rate }); resid.push([p.area / f.meanArea(), Math.abs(p.rate / k - (p.n - 6)), p.n]); });
    intervals++; if (f.totalLength > lastL) rises++; lastL = f.totalLength;
    series.push([(f.t - tg) * k, f.meanArea(), f.bubbles, f.totalLength]);
  }
}
const fit = F.fitLine(pts);
console.log('run time', Date.now() - t0, 'ms; steps', f.steps);
console.log('von Neumann fit over', fit.count, 'measurements: slope', (fit.slope / k).toFixed(4), 'zero', fit.zero.toFixed(4), 'r2', fit.r2.toFixed(5), 'rms', (fit.rms / k).toFixed(4));
const byN = {}; pts.forEach(p => { const b = byN[p.n] = byN[p.n] || { c: 0, s: 0 }; b.c++; b.s += p.rate / k; });
console.log('mean rate by n:', Object.keys(byN).map(n => n + ': ' + (byN[n].s / byN[n].c).toFixed(3) + ' (' + byN[n].c + ')').join(', '));
// residual against relative area
[[0, 0.05], [0.05, 0.2], [0.2, 0.5], [0.5, 1], [1, 2], [2, 99]].forEach(([a, b]) => { const r = resid.filter(x => x[0] >= a && x[0] < b).map(x => x[1]); if (r.length) console.log('  area', a, '-', b, 'mean areas: n =', r.length, 'rms residual', Math.sqrt(r.reduce((s, v) => s + v * v, 0) / r.length).toFixed(4), 'max', Math.max(...r).toFixed(3)); });
// growth rate per doubling
const marks = [1, 2, 4, 8, 16].map(m => series.find(s => s[1] >= m) || series[series.length - 1]);
for (let i = 0; i < 4; i++) console.log('  <A> from', marks[i][1].toFixed(2), 'to', marks[i + 1][1].toFixed(2), ': d<A>/dtau =', ((marks[i + 1][1] - marks[i][1]) / (marks[i + 1][0] - marks[i][0])).toFixed(4));
const late = series.filter(s => s[1] >= 4).map(s => ({ n: s[0], rate: s[1] })), lf = F.fitLine(late);
console.log('straight-line fit of <A>(tau) from <A> = 4 on: slope', lf.slope.toFixed(4), 'r2', lf.r2.toFixed(5), 'points', lf.count);
console.log('film length rose in', rises, 'of', intervals, 'intervals; L from', series[0][3].toFixed(1), 'to', series[series.length - 1][3].toFixed(1));
// check L ~ <A>^(-1/2): L * sqrt(<A>) / box area constant?
console.log('film length over that of a honeycomb with as many equal cells, L / (1.8612 N sqrt<A>), at marks:', marks.map(m => (m[3] / (m[2] * Math.sqrt(m[1])) / 1.8612097).toFixed(4)).join(', '));
const hist = {}; let mu2 = 0; f.C.forEach(c => { if (c.alive) { hist[c.n] = (hist[c.n] || 0) + 1; mu2 += (c.n - 6) * (c.n - 6); } });
const st = f.stats(), au = f.audit();
console.log('end:', st.bubbles, 'bubbles, mean sides', st.meanSides, 'mu2', (mu2 / st.bubbles).toFixed(3), JSON.stringify(hist));
console.log('T1', f.t1, 'undone', f.undone, 'T2', f.t2, 'two-sided', f.t2lens, 'audit bad', au.bad.length, 'V,E,F', au.V, au.E, au.F, 'area err', (st.area / f.boxArea() - 1).toExponential(2), 'gas err', (st.gas / f.boxArea() - 1).toExponential(2));
