// BioEssay03: the model code behind essay 03 (Circos Plot).
//
// Two things live here so they can be checked outside the page:
//   1. The real human-mouse synteny blocks of Figure 4 and the layout arithmetic that
//      decides which ribbons cross: mouse chromosome order, orientation (flips), the
//      crossing count, the exact minimum over all orders and flips, and the circle
//      geometry the page draws from.
//   2. The simulated structural-variant generator of Figure 1, whose intrachromosomal
//      events must have their breakpoints exactly `size` apart.
//
// Browser global `BioEssay03`; `module.exports = api` under node. No fetch: the page
// fetches data/essay-03.json and hands it to load(); runChecks(print, data) does the same.
//
// ---- Synteny data (data/essay-03.json, built by scripts/bio-03-synteny.mjs) --------
// UCSC hg38 netMm39 alignment net (GRCh38 against GRCm39), top-level (level-1) fills on
// human chr1-22 and X whose human span is at least 3 Mb; positions in Mb rounded to 0.1,
// chromosome sizes from hg38/mm39 chrom.sizes to 0.001 Mb.
// Row: [human chr, start, end, mouse chr, start, end, strand of the mouse block].
// Strand "-" means the mouse coordinate falls as the human coordinate rises.
// Chromosomes are named by strings ("1".."22", "X").
//
// ---- Layouts -----------------------------------------------------------------------
// The circle puts the human chromosomes on the right half, in numeric order running
// clockwise (top to bottom), and the mouse chromosomes on the left half. A layout says,
// for the left half, the mouse chromosomes from top to bottom (`order`) and which of them
// run bottom to top (`flip`). With both halves read top to bottom, two block chords cross
// exactly when the blocks' order on the human side disagrees with their order on the
// mouse side, which is the count of "inversions" between two parallel axes.
//   "clockwise"  the common default: mouse chromosomes in numeric order, placed clockwise
//                like the human half, so on the left they run bottom to top (numeric
//                order from the bottom, every chr flipped)
//   "aligned"    numeric order, every mouse chromosome running top to bottom
//   "reordered"  aligned, with mouse chromosomes sorted by the length-weighted mean human
//                position of their blocks (barycentre)
//   "best"       the fewest crossings any order and flips of the mouse half can give.
// The count splits exactly in two. A pair of blocks on two different mouse chromosomes
// crosses or not depending only on which of the two chromosomes is drawn higher (each
// chromosome's blocks sit inside its own stretch of the axis, so flipping moves nothing
// across another chromosome). A pair on the same mouse chromosome depends only on that
// chromosome's flip. So the best flips are chosen chromosome by chromosome, and the best
// order is a linear ordering problem over the mouse chromosomes, solved exactly by
// dynamic programming over subsets (2^n states; n = 20 here).
//
// ---- API ---------------------------------------------------------------------------
//   load(data, {human}?)           install a data set (optionally only some human chrs);
//                                  returns api. Everything below reads the loaded set.
//   HUMAN, MOUSE                   chromosome names in numeric order (mouse: those used)
//   HUMAN_SIZES, MOUSE_SIZES, HUMAN_TOTAL, MOUSE_TOTAL, BLOCKS (rows)
//   blocks()                       [{i, h, hs, he, m, ms, me, strand, span}] in human order
//   layout(kind)                   {kind, order: [m top to bottom], flip: {m: bool}}
//   mouseAxis(layout)              block -> {y0, y1, mid}: position along the mouse side,
//                                  top to bottom, of the block's ms end, me end and middle
//   humanAxis(block)               {x0, x1, mid}: human chromosomes concatenated
//   crossings(layout)              {total, sameMouse, pairs, perBlock[]} by brute force
//   crossingsMergeSort(layout)     total only, by merge-sort inversion count (independent)
//   pairCost()                     {W, within}: W[a][b] = crossings between the blocks of
//                                  mouse a and b when a is drawn above b; within[m] =
//                                  [unflipped, flipped] crossings inside mouse m
//   layoutCost(layout)             total from pairCost (third independent count)
//   bestFlips(), barycentreOrder(), bestOrder() -> {order, cost}, lowerBound()
//   circleArcs(layout, opts)       per chromosome {species, n, size, c, s, a0, a1}: the
//                                  drawn angle of position p is c + s * (p - size / 2)
//                                  (radians, 0 at 12 o'clock, clockwise positive)
//   chordsCross(a, b)              geometric test on two chords given as [angle, angle]
//   circleCrossings(layout)        count of crossing block chords from circleArcs angles
//   mulberry32(seed), generateSVs(chrs, rng), mappableRange(chr)
//   runChecks(print, data) -> [{name, ok, detail}]
(function (root) {
  "use strict";

  const chrKey = c => c === "X" ? 23 : c === "Y" ? 24 : Number(c);
  const byChr = (a, b) => chrKey(a) - chrKey(b);

  // The loaded data set. load() replaces every field.
  let DATA = null, B = [], HUMAN = [], MOUSE = [], HUMAN_SIZES = {}, MOUSE_SIZES = {};
  let HUMAN_TOTAL = 0, MOUSE_TOTAL = 0, hoff = {};
  let LAYOUT_CACHE = {}, PAIR_CACHE = null, BEST_CACHE = null;

  function load(data, opts) {
    DATA = data;
    const keep = opts && opts.human ? new Set(opts.human.map(String)) : null;
    const rows = data.blocks.filter(r => !keep || keep.has(String(r[0])));
    HUMAN = Object.keys(data.humanSizes).filter(h => !keep || keep.has(h)).sort(byChr);
    MOUSE = [...new Set(rows.map(r => String(r[3])))].sort(byChr);
    HUMAN_SIZES = Object.fromEntries(HUMAN.map(h => [h, data.humanSizes[h]]));
    MOUSE_SIZES = Object.fromEntries(MOUSE.map(m => [m, data.mouseSizes[m]]));
    hoff = {}; let o = 0;
    for (const h of HUMAN) { hoff[h] = o; o += HUMAN_SIZES[h]; }
    HUMAN_TOTAL = o;
    MOUSE_TOTAL = MOUSE.reduce((s, m) => s + MOUSE_SIZES[m], 0);
    B = rows.map(([h, hs, he, m, ms, me, strand]) => ({ h: String(h), hs, he, m: String(m), ms, me, strand, span: he - hs }))
      .sort((a, b) => byChr(a.h, b.h) || a.hs - b.hs)
      .map((b, i) => Object.assign(b, { i }));
    LAYOUT_CACHE = {}; PAIR_CACHE = null; BEST_CACHE = null;
    Object.assign(api, { HUMAN, MOUSE, HUMAN_SIZES, MOUSE_SIZES, HUMAN_TOTAL, MOUSE_TOTAL, BLOCKS: rows });
    return api;
  }

  function blocks() { return B.map(b => Object.assign({}, b)); }
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

  // The decomposition: W[a][b] counts block pairs (p on a, q on b) that cross when a is
  // drawn above b, which is when q lies left of p in human; within[m] counts pairs inside m.
  function pairCost() {
    if (PAIR_CACHE) return PAIR_CACHE;
    const W = {}, within = {};
    const xs = m => B.filter(b => b.m === m).map(b => ({ x: humanAxis(b).mid, y: (b.ms + b.me) / 2 }));
    const on = Object.fromEntries(MOUSE.map(m => [m, xs(m)]));
    for (const a of MOUSE) {
      W[a] = {};
      for (const b of MOUSE) {
        if (a === b) continue;
        let n = 0; for (const p of on[a]) for (const q of on[b]) if (q.x < p.x) n++;
        W[a][b] = n;
      }
      let up = 0, fl = 0; const bs = on[a];
      for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
        const dx = bs[i].x - bs[j].x, dy = bs[i].y - bs[j].y;
        if (dx * dy < 0) up++; if (dx * dy > 0) fl++;
      }
      within[a] = [up, fl];
    }
    return (PAIR_CACHE = { W, within });
  }
  function layoutCost(lay) {
    const { W, within } = pairCost();
    let n = 0;
    lay.order.forEach((a, i) => {
      n += within[a][lay.flip[a] ? 1 : 0];
      for (let j = i + 1; j < lay.order.length; j++) n += W[a][lay.order[j]];
    });
    return n;
  }
  // Each chromosome's flip only touches its own pairs, so this is exact.
  function bestFlips() {
    const { within } = pairCost(), flip = {};
    for (const m of MOUSE) if (within[m][1] < within[m][0]) flip[m] = true;
    return flip;
  }
  // Sum over pairs of the cheaper of the two orders, plus the cheaper flip of each chr.
  function lowerBound() {
    const { W, within } = pairCost();
    let n = 0;
    MOUSE.forEach((a, i) => {
      n += Math.min(within[a][0], within[a][1]);
      for (let j = i + 1; j < MOUSE.length; j++) n += Math.min(W[a][MOUSE[j]], W[MOUSE[j]][a]);
    });
    return n;
  }
  // Exact linear ordering by dynamic programming over subsets: f[S] is the fewest
  // between-chromosome crossings with the chromosomes in S drawn above all others. Adding c
  // below S costs the sum of W[a][c] over a in S, read from two half-word tables.
  function bestOrder(list) {
    if (!list && BEST_CACHE) return BEST_CACHE;
    const L = list || MOUSE;
    const { W } = pairCost(), n = L.length, N = 1 << n;
    const lo = Math.min(n, 10), hiBits = n - lo, LO = 1 << lo, HI = 1 << hiBits;
    const tLo = [], tHi = [];
    for (let c = 0; c < n; c++) {
      const a = new Int32Array(LO), b = new Int32Array(HI);
      for (let s = 1; s < LO; s++) { const k = 31 - Math.clz32(s & -s); a[s] = a[s & (s - 1)] + (k === c ? 0 : W[L[k]][L[c]]); }
      for (let s = 1; s < HI; s++) { const k = 31 - Math.clz32(s & -s); b[s] = b[s & (s - 1)] + (k + lo === c ? 0 : W[L[k + lo]][L[c]]); }
      tLo.push(a); tHi.push(b);
    }
    const f = new Int32Array(N).fill(0x7fffffff), last = new Int8Array(N).fill(-1);
    f[0] = 0;
    for (let S = 0; S < N; S++) {
      const fs = f[S]; if (fs === 0x7fffffff) continue;
      const sl = S & (LO - 1), sh = S >>> lo;
      for (let c = 0; c < n; c++) {
        if (S & (1 << c)) continue;
        const T = S | (1 << c), v = fs + tLo[c][sl] + tHi[c][sh];
        if (v < f[T]) { f[T] = v; last[T] = c; }
      }
    }
    const order = []; let S = N - 1;
    while (S) { const c = last[S]; order.unshift(L[c]); S &= ~(1 << c); }
    const out = { order, cost: f[N - 1] };
    if (!list) BEST_CACHE = out;
    return out;
  }

  function barycentreOrder() {
    const bary = {};
    for (const m of MOUSE) {
      const bs = B.filter(b => b.m === m);
      bary[m] = bs.reduce((s, b) => s + humanAxis(b).mid * b.span, 0) / bs.reduce((s, b) => s + b.span, 0);
    }
    return MOUSE.slice().sort((a, b) => bary[a] - bary[b]);
  }

  function layout(kind) {
    if (LAYOUT_CACHE[kind]) return LAYOUT_CACHE[kind];
    let lay;
    if (kind === "clockwise") {
      const flip = {}; MOUSE.forEach(m => { flip[m] = true; });
      lay = { kind, order: MOUSE.slice().reverse(), flip };
    } else if (kind === "aligned") lay = { kind, order: MOUSE.slice(), flip: {} };
    else if (kind === "reordered") lay = { kind, order: barycentreOrder(), flip: {} };
    else if (kind === "best") lay = { kind, order: bestOrder().order, flip: bestFlips() };
    else throw new Error("unknown layout " + kind);
    return (LAYOUT_CACHE[kind] = lay);
  }

  // Circle geometry. Human: right half, 5 to 175 degrees, clockwise.
  // Mouse: left half, 355 down to 185 degrees, `order` from the top.
  function circleArcs(lay, opts) {
    const o = Object.assign({ hStart: 5, hEnd: 175, hGap: 0.8, mTop: 355, mBottom: 185, mGap: 0.8 }, opts || {});
    const rad = d => d * Math.PI / 180;
    const arcs = [];
    const hAvail = rad(o.hEnd - o.hStart) - rad(o.hGap) * (HUMAN.length - 1);
    let a = rad(o.hStart);
    for (const h of HUMAN) {
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
  function runChecks(print, data) {
    const res = [];
    const ok = (name, cond, detail) => { res.push({ name, ok: !!cond, detail: detail || "" }); };

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

    if (!data && !DATA) ok("synteny checks need data/essay-03.json", false, "no data passed");
    else {
      data = data || DATA;
      const fourWays = lay => [crossings(lay).total, crossingsMergeSort(lay), circleCrossings(lay), layoutCost(lay)];
      const allEqual = a => a.every(v => v === a[0]);

      // The first pass drew human chr1-6 only; the same rows must reproduce its numbers.
      load(data, { human: ["1", "2", "3", "4", "5", "6"] });
      ok("chr1-6 subset: the 68 blocks and 17 mouse chromosomes of the first pass", B.length === 68 && MOUSE.join(",") === "1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18",
        B.length + " blocks; mouse " + MOUSE.join(","));
      const old = { clockwise: 1454, aligned: 824, reordered: 670 };
      for (const k of Object.keys(old)) {
        const w = fourWays(layout(k));
        ok(`chr1-6 ${k}: four counts agree with the audit prototype (${old[k]})`, allEqual(w) && w[0] === old[k], w.join(" / "));
      }
      ok("chr1-6 barycentre order matches the audit prototype", barycentreOrder().join(" ") === "4 12 1 2 3 6 14 16 9 5 11 8 17 15 13 18 10", barycentreOrder().join(" "));
      const oldFlip = crossings({ order: barycentreOrder(), flip: bestFlips() });
      ok("chr1-6 sorted and flipped gives the first pass's 591, 36 inside one mouse chromosome", oldFlip.total === 591 && oldFlip.sameMouse === 36, oldFlip.total + ", " + oldFlip.sameMouse);
      const sub = { best: crossings(layout("best")).total, lb: lowerBound(), dp: bestOrder().cost };
      ok("chr1-6 fewest crossings: exact order and flips, at or above the pairwise bound", sub.best <= 591 && sub.best >= sub.lb,
        `best ${sub.best}, bound ${sub.lb}, between-chromosome ${sub.dp}`);

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

      // Genome-wide.
      load(data);
      ok("160 blocks on human 1-22 and X, each spanning at least 3 Mb of human sequence",
        B.length === 160 && HUMAN.length === 23 && B.every(b => b.span >= 3 - 1e-9), B.length + " blocks on " + HUMAN.length + " human chromosomes");
      ok("blocks land on all 20 mouse chromosomes (1-19 and X)", MOUSE.join(",") === "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,X", MOUSE.join(","));
      ok("every block lies inside its chromosome", B.every(b => b.he <= HUMAN_SIZES[b.h] + 0.05 && b.me <= MOUSE_SIZES[b.m] + 0.05 && b.hs >= 0 && b.ms >= 0 && b.me > b.ms));
      ok("human X blocks all land on mouse X", B.filter(b => b.h === "X").every(b => b.m === "X") && B.filter(b => b.m === "X").every(b => b.h === "X"),
        B.filter(b => b.h === "X").length + " blocks");
      const h3 = [...new Set(B.filter(b => b.h === "3").map(b => b.m))];
      ok("human 3 splits across six mouse chromosomes", h3.length === 6, h3.sort(byChr).join(","));
      const h4 = B.filter(b => b.h === "4" && b.he <= 88.2);
      ok("human 4, 0-88 Mb: five blocks on mouse 5 in increasing mouse order",
        h4.length === 5 && h4.every(b => b.m === "5") && h4.every((b, k) => k === 0 || b.ms > h4[k - 1].ms), h4.map(b => b.ms).join(" "));

      // Counts from a separate prototype written for the genome-wide pass (temp/bio-audit/g03/proto.cjs).
      const proto = { clockwise: 7529, aligned: 5191, reordered: 3965 };
      for (const k of Object.keys(proto)) {
        const w = fourWays(layout(k));
        ok(`${k}: brute force = merge sort = circle geometry = pair table = prototype (${proto[k]})`, allEqual(w) && w[0] === proto[k], w.join(" / "));
      }
      const bw = fourWays(layout("best")), bestX = crossings(layout("best"));
      const lb = lowerBound(), within = MOUSE.reduce((s, m) => s + Math.min(...pairCost().within[m]), 0);
      ok("fewest crossings: four counts agree, equal to the exact order's cost plus the best flips", allEqual(bw) && bw[0] === bestOrder().cost + within,
        bw.join(" / ") + " = " + bestOrder().cost + " + " + within);
      ok("fewest crossings lies between the pairwise lower bound and the prototype's local search (3,605)", bw[0] >= lb && bw[0] <= 3605, `${lb} <= ${bw[0]} <= 3605`);
      ok("same-chromosome crossings in the best layout equal the sum of each chromosome's better flip", bestX.sameMouse === within, bestX.sameMouse + " = " + within);
      // Exhaustive check of the subset DP: every permutation of 7 mouse chromosomes.
      const seven = ["1", "2", "3", "4", "5", "6", "7"], { W } = pairCost();
      let brute = Infinity;
      (function perm(a, k) {
        if (k === a.length) { let c = 0; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) c += W[a[i]][a[j]]; if (c < brute) brute = c; return; }
        for (let i = k; i < a.length; i++) { [a[k], a[i]] = [a[i], a[k]]; perm(a, k + 1); [a[k], a[i]] = [a[i], a[k]]; }
      })(seven.slice(), 0);
      const dp7 = bestOrder(seven);
      ok("subset dynamic program = brute force over all 5,040 orders of mouse 1-7", dp7.cost === brute, dp7.cost + " = " + brute);
      // Flips only change pairs inside one chromosome: a random flip set moves sameMouse, never the rest.
      const rf = {}; MOUSE.forEach((m, k) => { if (k % 3 === 0) rf[m] = true; });
      const a0 = crossings(layout("reordered")), a1 = crossings({ order: layout("reordered").order, flip: rf });
      ok("flipping chromosomes changes only same-chromosome crossings", a0.total - a0.sameMouse === a1.total - a1.sameMouse,
        `${a0.total - a0.sameMouse} = ${a1.total - a1.sameMouse}`);
      const cw = adjacent(layout("clockwise")), al = adjacent(layout("aligned"));
      ok("clockwise layout: every order-kept adjacent pair crosses and every reversed pair nests; aligned, the opposite",
        cw.keptNest === 0 && cw.revCross === 0 && al.keptCross === 0 && al.revNest === 0 && cw.keptCross === al.keptNest && cw.revNest === al.revCross && cw.keptCross > 0,
        "clockwise " + JSON.stringify(cw) + ", aligned " + JSON.stringify(al));
    }

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
    load, byChr, blocks, humanAxis, mouseAxis, layout, crossings, crossingsMergeSort, pairCost, layoutCost,
    bestFlips, barycentreOrder, bestOrder, lowerBound,
    circleArcs, angleAt, chordsCross, circleCrossings,
    mulberry32, mappableRange, generateSVs, runChecks
  };
  root.BioEssay03 = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
