// Ledger run for Figure 5 of docs/foam/07-foams-in-motion.html: a honeycomb with one film
// removed, and one with a bubble doubled, at the page's settings (20 x 16, M = 5, D = 1, res = 4).
// Usage: node scripts/foam-07-defect-run.cjs [--wide]   (--wide adds a 32 x 26 box, about 10 s)
const F = require('../docs/foam/lib/07-coarsen.js');
function burst(nx, ny, tEnd) {
  const f = F.defect(nx, ny, { kind: 'burst', M: 5, D: 1, res: 4 }); f.relax(600);
  const k = f.rateConstant(), tg = f.t, big = f.marked, tau = () => (f.t - tg) * k;
  let pred = f.C[big].A, tp = f.t, cur = null, shown = false; const st = [], marks = [];
  function ring() {
    const nb = new Set(); f.E.forEach(e => { if (!e.alive) return; if (e.cl === big) nb.add(e.cr); if (e.cr === big) nb.add(e.cl); });
    const h = {}; let non6 = 0, inRing = 0, six = 0;
    f.C.forEach((c, i) => { if (!c.alive || i === big) return; if (c.n === 6) { six++; return; } non6++; h[c.n] = (h[c.n] || 0) + 1; if (nb.has(i)) inRing++; });
    return { six, non6, inRing, h };
  }
  console.log(`${nx} x ${ny}: start ${f.bubbles} bubbles, marked bubble ${f.C[big].n} sides, area ${f.C[big].A.toFixed(4)}`);
  while (!f.finished(12) && tau() < tEnd) {
    const n0 = f.C[big].n; f.step(); pred += (n0 - 6) * (f.t - tp) * k; tp = f.t;
    const t = tau(), c = f.C[big];
    if (!cur || cur.n !== c.n) { if (cur) st.push(cur); cur = { n: c.n, t0: t, A0: c.A, t1: t, A1: c.A }; } else { cur.t1 = t; cur.A1 = c.A; }
    if (t >= marks.length) marks.push(`${marks.length}: ${c.n} sides, area ${c.A.toFixed(1)}`);
    if (!shown && t >= 5.5) {
      shown = true; const r = ring();
      let per = 0; const o = f.outlines().find(q => q.id === big); for (let i = 0; i < o.pts.length; i += 2) { const j = (i + 2) % o.pts.length; per += Math.hypot(o.pts[j] - o.pts[i], o.pts[j + 1] - o.pts[i + 1]); }
      console.log(`  at ${t.toFixed(3)}: ${c.n} sides, area ${c.A.toFixed(2)} (law integrated over its side counts: ${pred.toFixed(2)}), ${f.bubbles} bubbles, ${r.six} six-sided, ${r.non6} others ${JSON.stringify(r.h)} of which ${r.inRing} touch it; T1 ${f.t1}, T2 ${f.t2}; perimeter ${per.toFixed(1)}, ${(per / c.n).toFixed(2)} per side, sides / sqrt(area) ${(c.n / Math.sqrt(c.A)).toFixed(2)}; steps ${f.steps - 600}`);
    }
  }
  st.push(cur);
  console.log('  by unit time: ' + marks.join('; '));
  console.log('  slope of its area over each stretch of fixed side count longer than 0.1: ' + st.filter(s => s.t1 - s.t0 > 0.1).map(s => `${s.n}: ${((s.A1 - s.A0) / (s.t1 - s.t0)).toFixed(2)}`).join(', '));
  console.log(`  stopped at ${tau().toFixed(3)} (${f.finished(12) ? 'box limit' : 'time limit'}): ${f.C[big].n} sides, area ${f.C[big].A.toFixed(1)}, ${f.bubbles} bubbles, audit ${f.audit().bad.length}`);
}
burst(20, 16, 99);
if (process.argv.includes('--wide')) burst(32, 26, 99);
const g = F.defect(20, 16, { kind: 'inflate', M: 5, D: 1, res: 4 }), L0 = g.totalLength; g.relax(600);
const A0 = g.C.map(c => c.A), tg = g.t, m = g.marked; let d = 0, pmax = 0;
while ((g.t - tg) * g.rateConstant() < 5.5) g.step();
g.C.forEach((c, i) => { d = Math.max(d, Math.abs(c.A - A0[i])); pmax = Math.max(pmax, Math.abs(c.p)); });
console.log(`doubled bubble: ${g.C[m].n} sides, area ${g.C[m].A.toFixed(4)} against ${g.C[m === 0 ? 1 : 0].A.toFixed(4)}; over 5.5 time units largest area change ${d.toExponential(1)}, largest pressure ${pmax.toExponential(1)}, T1 ${g.t1}, T2 ${g.t2}, film length ${g.totalLength.toFixed(3)} (honeycomb ${L0.toFixed(3)}), steps ${g.steps - 600}`);
