// BioEssay03: the model code behind essay 03 (Circos Plot).
//
// Two things live here so they can be checked outside the page:
//   1. The real human-mouse synteny blocks of Figure 4 and the layout arithmetic that
//      decides which ribbons cross: mouse chromosome order, orientation (flips), the
//      crossing count, and the circle geometry the page draws from.
//   2. The simulated structural-variant generator of Figure 1, whose intrachromosomal
//      events must have their breakpoints exactly `size` apart.
//
// Browser global `BioEssay03`; `module.exports = api` under node. No fetch.
//
// ---- Synteny data ------------------------------------------------------------------
// UCSC hg38 netMm39 alignment net (GRCh38 against GRCm39), top-level fills on human
// chr1-6 whose human span is at least 3 Mb; fetched from api.genome.ucsc.edu
// (getData/track?genome=hg38;track=netMm39;chrom=chrN), positions in Mb rounded to 0.1.
// The set was re-derived independently in the 2026-10 audit: 68 blocks, exact match.
// Row: [human chr, start, end, mouse chr, start, end, strand of the mouse block].
// Strand "-" means the mouse coordinate falls as the human coordinate rises.
//
// ---- Layouts -----------------------------------------------------------------------
// The circle puts human chr1-6 on the right half, running clockwise (top to bottom),
// and the mouse chromosomes on the left half. A layout says, for the left half, the
// mouse chromosomes from top to bottom (`order`) and which of them run bottom to top
// (`flip`). With both halves read top to bottom, two block chords cross exactly when the
// blocks' order on the human side disagrees with their order on the mouse side, which is
// the count of "inversions" between two parallel axes.
//   "clockwise"  the common default and the page's old figure: mouse chromosomes in
//                numeric order, placed clockwise like the human half, so on the left
//                they run bottom to top (numeric order from the bottom, every chr flipped)
//   "aligned"    numeric order, every mouse chromosome running top to bottom
//   "reordered"  aligned, with mouse chromosomes sorted by the length-weighted mean human
//                position of their blocks (barycentre)
//   "flipped"    reordered, then each mouse chromosome flipped when that lowers the count
//                (greedy, three passes in barycentre order)
//
// ---- API ---------------------------------------------------------------------------
//   BLOCKS, HUMAN_SIZES {1..6: Mb}, MOUSE_SIZES {n: Mb}  (hg38 / mm39 chrom.sizes, 0.001 Mb)
//   blocks()                       [{i, h, hs, he, m, ms, me, strand, span}]
//   layout(kind)                   {kind, order: [m top to bottom], flip: {m: bool}}
//   mouseAxis(layout)              block -> {y0, y1, mid}: position along the mouse side,
//                                  top to bottom, of the block's ms end, me end and middle
//   humanAxis(block)               {x0, x1, mid}: chr1-6 concatenated, top to bottom
//   crossings(layout)              {total, sameMouse, pairs, perBlock[]} by brute force
//   crossingsMergeSort(layout)     total only, by merge-sort inversion count (independent)
//   circleArcs(layout, opts)       per chromosome {species, n, size, c, s, a0, a1}: the
//                                  drawn angle of position p is c + s * (p - size / 2)
//                                  (radians, 0 at 12 o'clock, clockwise positive)
//   chordsCross(a, b)              geometric test on two chords given as [angle, angle]
//   circleCrossings(layout)        count of crossing block chords from circleArcs angles
//   barycentreOrder(), greedyFlips(order)
//   mulberry32(seed), generateSVs(chrs, rng), mappableRange(chr)
//   runChecks(print) -> [{name, ok, detail}]
(function (root) {
  "use strict";

  const BLOCKS = [
    [1,0.9,58.5,4,103.2,156.3,'-'], [1,58.7,67.1,4,94.8,103.2,'+'], [1,68.1,120.3,3,97.7,159.6,'-'], [1,146.1,158.2,3,86.9,98.0,'-'],
    [1,158.5,207.4,1,130.4,174.3,'-'], [1,207.4,223.6,1,182.4,194.9,'-'], [1,223.6,227.5,1,179.7,182.4,'-'], [1,229.3,235.2,8,124.5,127.7,'+'],
    [1,235.2,239.9,13,9.9,14.4,'-'], [1,240.1,247.0,1,174.3,179.7,'+'], [2,0.2,16.1,12,12.8,31.1,'-'], [2,16.2,26.1,12,3.3,12.8,'-'],
    [2,28.8,51.5,17,71.9,92.0,'+'], [2,53.7,68.5,11,16.9,31.1,'-'], [2,68.5,88.9,6,70.7,87.6,'-'], [2,96.5,106.2,1,36.3,43.9,'+'],
    [2,113.7,121.8,1,118.2,125.6,'-'], [2,132.4,137.9,1,125.6,130.3,'+'], [2,139.7,187.5,2,39.9,84.3,'+'], [2,189.6,195.7,1,46.9,53.4,'-'],
    [2,195.7,241.8,1,53.4,93.8,'+'], [3,0.0,12.8,6,103.3,115.8,'+'], [3,16.3,20.2,17,50.3,54.0,'+'], [3,23.1,27.5,14,3.5,7.8,'+'],
    [3,27.7,52.3,9,106.0,118.3,'-'], [3,52.3,64.0,14,8.3,31.0,'-'], [3,64.0,75.3,6,92.3,103.3,'+'], [3,75.8,90.3,16,62.7,75.3,'-'],
    [3,93.8,125.6,16,33.0,62.8,'-'], [3,130.2,148.4,9,90.2,105.9,'-'], [3,149.3,168.1,3,57.2,75.9,'+'], [3,168.2,183.1,3,29.0,36.1,'+'],
    [3,183.2,195.6,16,19.6,31.2,'+'], [4,4.2,8.8,5,35.6,38.5,'-'], [4,9.8,31.8,5,38.5,59.0,'+'], [4,32.8,49.1,5,59.9,73.6,'+'],
    [4,51.8,58.8,5,73.6,79.3,'+'], [4,59.0,88.1,5,79.4,104.7,'+'], [4,88.6,94.3,6,58.8,65.1,'+'], [4,94.4,119.8,3,122.4,142.2,'-'],
    [4,121.3,140.3,3,36.2,52.1,'+'], [4,140.3,190.0,8,41.9,84.2,'-'], [5,0.2,7.9,13,68.7,74.5,'-'], [5,8.9,42.9,15,3.3,32.8,'-'],
    [5,50.3,96.8,13,74.8,117.5,'-'], [5,99.1,102.3,1,94.1,96.8,'+'], [5,103.4,110.7,17,59.2,65.8,'+'], [5,110.9,131.0,18,32.8,60.3,'+'],
    [5,131.2,134.7,11,51.6,54.8,'-'], [5,134.7,137.8,13,55.8,58.3,'+'], [5,139.5,148.2,18,35.8,44.3,'+'], [5,151.0,155.0,11,54.8,58.1,'+'],
    [5,155.8,172.5,11,32.3,47.8,'-'], [5,178.1,181.3,11,48.7,51.6,'-'], [6,0.2,20.1,13,30.7,48.6,'+'], [6,20.1,28.5,13,21.5,30.5,'-'],
    [6,29.4,33.3,17,34.1,37.7,'-'], [6,33.4,39.1,17,27.1,31.2,'+'], [6,39.3,49.7,17,41.1,50.2,'-'], [6,52.8,55.9,9,75.6,78.2,'-'],
    [6,60.2,73.2,1,21.5,33.7,'-'], [6,73.4,85.7,9,78.3,88.4,'+'], [6,87.1,99.8,4,21.4,34.9,'-'], [6,100.1,149.9,10,7.5,51.3,'-'],
    [6,150.1,154.7,10,3.3,7.3,'+'], [6,154.7,159.0,17,3.2,7.2,'+'], [6,159.7,166.9,17,7.3,13.2,'-'], [6,167.2,170.6,17,13.3,15.7,'+']
  ];
  // hg38.chrom.sizes and mm39.chrom.sizes (UCSC), in Mb.
  const HUMAN_SIZES = { 1: 248.956, 2: 242.194, 3: 198.296, 4: 190.215, 5: 181.538, 6: 170.806 };
  const MOUSE_SIZES = { 1: 195.154, 2: 181.755, 3: 159.745, 4: 156.861, 5: 151.758, 6: 149.588,
    8: 130.128, 9: 124.360, 10: 130.531, 11: 121.973, 12: 120.093, 13: 120.883, 14: 125.140,
    15: 104.074, 16: 98.009, 17: 95.295, 18: 90.721 };
  const MOUSE_NUMS = Object.keys(MOUSE_SIZES).map(Number).sort((a, b) => a - b);
  const HUMAN_NUMS = [1, 2, 3, 4, 5, 6];

  const B = BLOCKS.map(([h, hs, he, m, ms, me, strand], i) => ({ i, h, hs, he, m, ms, me, strand, span: he - hs }));
  function blocks() { return B.map(b => Object.assign({}, b)); }

  const hoff = {};
  { let o = 0; for (const h of HUMAN_NUMS) { hoff[h] = o; o += HUMAN_SIZES[h]; } }
  const HUMAN_TOTAL = HUMAN_NUMS.reduce((s, h) => s + HUMAN_SIZES[h], 0);
  const MOUSE_TOTAL = MOUSE_NUMS.reduce((s, m) => s + MOUSE_SIZES[m], 0);
  function humanAxis(b) { return { x0: hoff[b.h] + b.hs, x1: hoff[b.h] + b.he, mid: hoff[b.h] + (b.hs + b.he) / 2 }; }

  function mouseAxis(lay) {
    const off = {}; let o = 0;
    for (const m of lay.order) { off[m] = o; o += MOUSE_SIZES[m]; }
    const at = (m, p) => off[m] + (lay.flip[m] ? MOUSE_SIZES[m] - p : p);
    return b => ({ y0: at(b.m, b.ms), y1: at(b.m, b.me), mid: at(b.m, (b.ms + b.me) / 2) });
  }

  // Brute force over all pairs: chords cross when the two axes order the blocks differently.
  function crossings(lay) {
    const my = mouseAxis(lay);
    const x = B.map(b => humanAxis(b).mid), y = B.map(b => my(b).mid);
    let total = 0, sameMouse = 0; const pairs = [], perBlock = B.map(() => 0);
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      if ((x[i] - x[j]) * (y[i] - y[j]) < 0) {
        total++; perBlock[i]++; perBlock[j]++; pairs.push([i, j]);
        if (B[i].m === B[j].m) sameMouse++;
      }
    }
    return { total, sameMouse, pairs, perBlock };
  }

  // Independent: sort by human position, count inversions of the mouse sequence by merge sort.
  function crossingsMergeSort(lay) {
    const my = mouseAxis(lay);
    const seq = B.map(b => [humanAxis(b).mid, my(b).mid]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
    function sortCount(a) {
      if (a.length < 2) return [a, 0];
      const k = a.length >> 1;
      const [l, cl] = sortCount(a.slice(0, k)), [r, cr] = sortCount(a.slice(k));
      const out = []; let i = 0, j = 0, c = cl + cr;
      while (i < l.length && j < r.length) {
        if (r[j] < l[i]) { out.push(r[j++]); c += l.length - i; } else out.push(l[i++]);
      }
      return [out.concat(l.slice(i), r.slice(j)), c];
    }
    return sortCount(seq)[1];
  }

  function barycentreOrder() {
    const bary = {};
    for (const m of MOUSE_NUMS) {
      const bs = B.filter(b => b.m === m);
      bary[m] = bs.reduce((s, b) => s + humanAxis(b).mid * b.span, 0) / bs.reduce((s, b) => s + b.span, 0);
    }
    return MOUSE_NUMS.slice().sort((a, b) => bary[a] - bary[b]);
  }

  function greedyFlips(order) {
    let flip = {};
    for (let pass = 0; pass < 3; pass++) for (const m of order) {
      const base = crossingsMergeSort({ order, flip });
      const t = Object.assign({}, flip); t[m] = !t[m];
      if (crossingsMergeSort({ order, flip: t }) < base) flip = t;
    }
    return flip;
  }

  const LAYOUT_CACHE = {};
  function layout(kind) {
    if (LAYOUT_CACHE[kind]) return LAYOUT_CACHE[kind];
    let lay;
    if (kind === "clockwise") {
      const flip = {}; MOUSE_NUMS.forEach(m => { flip[m] = true; });
      lay = { kind, order: MOUSE_NUMS.slice().reverse(), flip };
    } else if (kind === "aligned") lay = { kind, order: MOUSE_NUMS.slice(), flip: {} };
    else if (kind === "reordered") lay = { kind, order: barycentreOrder(), flip: {} };
    else if (kind === "flipped") { const order = barycentreOrder(); lay = { kind, order, flip: greedyFlips(order) }; }
    else throw new Error("unknown layout " + kind);
    return (LAYOUT_CACHE[kind] = lay);
  }

  // Circle geometry. Human: right half, 5 to 175 degrees, 2-degree gaps, clockwise.
  // Mouse: left half, 355 down to 185 degrees, 1.2-degree gaps, `order` from the top.
  function circleArcs(lay, opts) {
    const o = Object.assign({ hStart: 5, hEnd: 175, hGap: 2, mTop: 355, mBottom: 185, mGap: 1.2 }, opts || {});
    const rad = d => d * Math.PI / 180;
    const arcs = [];
    const hAvail = rad(o.hEnd - o.hStart) - rad(o.hGap) * (HUMAN_NUMS.length - 1);
    let a = rad(o.hStart);
    for (const h of HUMAN_NUMS) {
      const size = HUMAN_SIZES[h], arc = hAvail * size / HUMAN_TOTAL;
      arcs.push({ species: "human", n: h, size, a0: a, a1: a + arc, c: a + arc / 2, s: arc / size });
      a += arc + rad(o.hGap);
    }
    const mAvail = rad(o.mTop - o.mBottom) - rad(o.mGap) * (lay.order.length - 1);
    let top = rad(o.mTop);
    for (const m of lay.order) {
      const size = MOUSE_SIZES[m], arc = mAvail * size / MOUSE_TOTAL;
      // Running top to bottom on the left half means the angle falls as position rises.
      arcs.push({ species: "mouse", n: m, size, a0: top - arc, a1: top, c: top - arc / 2,
        s: (lay.flip[m] ? 1 : -1) * arc / size, flipped: !!lay.flip[m] });
      top -= arc + rad(o.mGap);
    }
    return arcs;
  }
  function angleAt(arc, p) { return arc.c + arc.s * (p - arc.size / 2); }

  function chordsCross(p, q) {
    const lo = Math.min(p[0], p[1]), hi = Math.max(p[0], p[1]);
    const inside = x => x > lo && x < hi;
    return inside(q[0]) !== inside(q[1]);
  }
  function circleCrossings(lay) {
    const arcs = circleArcs(lay);
    const H = {}, M = {};
    arcs.forEach(a => { (a.species === "human" ? H : M)[a.n] = a; });
    const ch = B.map(b => [angleAt(H[b.h], (b.hs + b.he) / 2), angleAt(M[b.m], (b.ms + b.me) / 2)]);
    let n = 0;
    for (let i = 0; i < ch.length; i++) for (let j = i + 1; j < ch.length; j++) if (chordsCross(ch[i], ch[j])) n++;
    return n;
  }

  // ---- Simulated structural variants (Figure 1) ----------------------------------
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  // Breakpoints stay off the acrocentric short arms (satellite stalks and repeats, no
  // assembled genes) and off the heterochromatic end of chrY.
  const ACRO = { chr13: 18.9, chr14: 18.2, chr15: 20.5, chr21: 13.0, chr22: 17.4 };
  function mappableRange(chr) {
    if (ACRO[chr.name] != null) return [ACRO[chr.name] + 0.5, chr.size - 0.5];
    if (chr.name === "chrY") return [2.8, 26.6];
    return [0.5, chr.size - 0.5];
  }
  // Event sizes are exaggerated (2 to 40 Mb) so they show at genome scale; most real
  // somatic SVs are far smaller. Intrachromosomal events: breakpoints `size` apart, and the
  // segment between them is the deleted, duplicated or inverted piece.
  const SIZE_RANGE = { deletion: [2, 30], duplication: [2, 30], inversion: [3, 40] };
  function generateSVs(chrs, rng, n) {
    const types = ["translocation", "inversion", "duplication", "deletion"];
    const out = [];
    for (let i = 0; i < (n || 28); i++) {
      const type = types[Math.floor(rng() * 4)];
      const c1 = chrs[Math.floor(rng() * chrs.length)];
      const [lo1, hi1] = mappableRange(c1);
      if (type === "translocation") {
        let c2 = c1;
        while (c2 === c1) c2 = chrs[Math.floor(rng() * chrs.length)];
        const [lo2, hi2] = mappableRange(c2);
        out.push({ type, a: { chr: c1, pos: lo1 + rng() * (hi1 - lo1) }, b: { chr: c2, pos: lo2 + rng() * (hi2 - lo2) } });
      } else {
        const [smin, smax] = SIZE_RANGE[type];
        let size = Math.exp(Math.log(smin) + rng() * (Math.log(smax) - Math.log(smin)));
        size = Math.min(size, (hi1 - lo1) * 0.6);
        const start = lo1 + rng() * (hi1 - lo1 - size);
        out.push({ type, size, a: { chr: c1, pos: start }, b: { chr: c1, pos: start + size } });
      }
    }
    return out;
  }

  // ---- Checks --------------------------------------------------------------------
  function runChecks(print) {
    const res = [];
    const ok = (name, cond, detail) => { res.push({ name, ok: !!cond, detail: detail || "" }); };
    ok("68 synteny blocks, each spanning at least 3 Mb of human sequence", B.length === 68 && B.every(b => b.span >= 3 - 1e-9), B.length + " blocks");
    const mset = [...new Set(B.map(b => b.m))].sort((a, b) => a - b);
    ok("blocks land on 17 mouse chromosomes (1-6, 8-18)", mset.join(",") === MOUSE_NUMS.join(","), mset.join(","));
    const h3 = [...new Set(B.filter(b => b.h === 3).map(b => b.m))];
    ok("human 3 splits across six mouse chromosomes", h3.length === 6, h3.sort((a, b) => a - b).join(","));
    const h4 = B.filter(b => b.h === 4 && b.he <= 88.2);
    ok("human 4, 0-88 Mb: five blocks on mouse 5 in increasing mouse order",
      h4.length === 5 && h4.every(b => b.m === 5) && h4.every((b, k) => k === 0 || b.ms > h4[k - 1].ms), h4.map(b => b.ms).join(" "));
    ok("every block lies inside its chromosome", B.every(b => b.he <= HUMAN_SIZES[b.h] + 0.05 && b.me <= MOUSE_SIZES[b.m] + 0.05 && b.hs >= 0 && b.ms >= 0));

    // Closed-form reference: reversing n parallel chords gives n(n-1)/2 crossings.
    ok("chord-crossing test against the closed form n(n-1)/2", (() => {
      const ch = [0, 1, 2, 3, 4].map(k => [0.2 + 0.1 * k, Math.PI + 0.2 + 0.1 * k]);
      let n = 0; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) if (chordsCross(ch[i], ch[j])) n++;
      return n === 10;
    })() && (() => {
      const ch = [0, 1, 2, 3, 4].map(k => [0.2 + 0.1 * k, 2 * Math.PI - 0.2 - 0.1 * k]);
      let n = 0; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) if (chordsCross(ch[i], ch[j])) n++;
      return n === 0;
    })(), "5 chords, one side reversed: 10 = 5*4/2; same direction: 0");

    // The audit's independent prototype (layout-proto.cjs) found these counts.
    const expect = { clockwise: 1454, aligned: 824, reordered: 670, flipped: 591 };
    for (const k of Object.keys(expect)) {
      const lay = layout(k), bf = crossings(lay).total, ms = crossingsMergeSort(lay), geo = circleCrossings(lay);
      ok(`${k}: brute force = merge sort = circle geometry = audit prototype`, bf === ms && ms === geo && geo === expect[k],
        `${bf} / ${ms} / ${geo} / ${expect[k]}`);
    }
    ok("barycentre order matches the audit prototype", barycentreOrder().join(" ") === "4 12 1 2 3 6 14 16 9 5 11 8 17 15 13 18 10", barycentreOrder().join(" "));
    ok("flipped layout leaves 36 crossings between blocks on the same mouse chromosome", crossings(layout("flipped")).sameMouse === 36, String(crossings(layout("flipped")).sameMouse));

    // The old figure's reading rule: with mouse running clockwise, adjacent blocks whose
    // order is kept cross and reversed ones nest; aligned, the opposite.
    function adjacent(lay) {
      const arcs = circleArcs(lay), H = {}, M = {};
      arcs.forEach(a => { (a.species === "human" ? H : M)[a.n] = a; });
      const c = { keptCross: 0, keptNest: 0, revCross: 0, revNest: 0 };
      for (let i = 0; i + 1 < B.length; i++) {
        const p = B[i], q = B[i + 1];
        if (p.h !== q.h || p.m !== q.m) continue;
        const cp = [angleAt(H[p.h], (p.hs + p.he) / 2), angleAt(M[p.m], (p.ms + p.me) / 2)];
        const cq = [angleAt(H[q.h], (q.hs + q.he) / 2), angleAt(M[q.m], (q.ms + q.me) / 2)];
        const x = chordsCross(cp, cq), kept = q.ms > p.ms;
        c[(kept ? "kept" : "rev") + (x ? "Cross" : "Nest")]++;
      }
      return c;
    }
    const cw = adjacent(layout("clockwise")), al = adjacent(layout("aligned"));
    ok("clockwise layout: all 12 order-kept adjacent pairs cross, all 11 reversed pairs nest",
      cw.keptCross === 12 && cw.keptNest === 0 && cw.revCross === 0 && cw.revNest === 11, JSON.stringify(cw));
    ok("aligned layout: the 12 order-kept pairs nest and the 11 reversed pairs cross",
      al.keptCross === 0 && al.keptNest === 12 && al.revCross === 11 && al.revNest === 0, JSON.stringify(al));

    // SV generator.
    const chrs = [["chr1", 248.956], ["chr9", 138.395], ["chr14", 107.044], ["chr21", 46.71], ["chr22", 50.818], ["chrY", 57.227]]
      .map(([name, size]) => ({ name, size }));
    const s1 = generateSVs(chrs, mulberry32(7), 400), s2 = generateSVs(chrs, mulberry32(7), 400);
    ok("SV generator is deterministic for a seed", JSON.stringify(s1.map(s => [s.type, s.a.pos, s.b.pos])) === JSON.stringify(s2.map(s => [s.type, s.a.pos, s.b.pos])));
    const intra = s1.filter(s => s.type !== "translocation");
    ok("intrachromosomal SVs: breakpoints exactly `size` apart", intra.every(s => Math.abs((s.b.pos - s.a.pos) - s.size) < 1e-9 && s.size > 0), intra.length + " events");
    ok("SV breakpoints avoid acrocentric short arms and the end of chrY", s1.every(s => [s.a, s.b].every(e => {
      const [lo, hi] = mappableRange(e.chr); return e.pos >= lo && e.pos <= hi;
    })));
    ok("translocations join two different chromosomes", s1.filter(s => s.type === "translocation").every(s => s.a.chr !== s.b.chr));

    if (print) res.forEach(r => print((r.ok ? "PASS " : "FAIL ") + r.name + (r.detail ? "  (" + r.detail + ")" : "")));
    return res;
  }

  const api = {
    BLOCKS, HUMAN_SIZES, MOUSE_SIZES, MOUSE_NUMS, HUMAN_TOTAL, MOUSE_TOTAL,
    blocks, humanAxis, mouseAxis, layout, crossings, crossingsMergeSort, barycentreOrder, greedyFlips,
    circleArcs, angleAt, chordsCross, circleCrossings,
    mulberry32, mappableRange, generateSVs, runChecks
  };
  root.BioEssay03 = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
