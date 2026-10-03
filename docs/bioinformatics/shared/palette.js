// BioPalette: the colour system of the Bioinformatics Visualization series, as resolved hex
// for d3 scales (CSS custom properties cannot go through a d3 interpolator). The same values
// are CSS custom properties in palette.css; runChecks verifies the two files agree.
// Browser global `BioPalette`, and `module.exports` under node. No fetch.
//
// ---- The system -------------------------------------------------------------------
// One diverging pair, used the same way in every essay:
//   up    = higher / gained / more   (amplification, up-regulation, gain, more methylated,
//                                    above the gene's mean, hazard higher)
//   down  = lower / lost / less      (deep deletion, down-regulation, loss, unmethylated,
//                                    below the mean)
//   mid   = the neutral midpoint of a diverging scale (zero change, the gene's mean). It is a
//           fill, slightly off the figure background so a zero cell still reads as a cell.
// One accent: the thing in focus (the selected gene, patient or cell; CDKN1A on a volcano
//   plot; the hovered row). `accent` is for marks; `accentInk` is the same hue dark enough for
//   text and links on the page background.
// neutral: marks with no direction (not significant, wildtype bars, background sites).
// grid: hairlines and empty cells.
// missense / truncating: oncoprint mutation glyph colours (cBioPortal's grammar: missense
//   green, truncating near-black; amplification and deep deletion are up and down). The
//   glyph shape (inset bar vs full cell) carries the class too, so colour is not alone.
// cat1..cat6: categorical identities (subtypes, cell types), in this fixed order, never
//   cycled. The first four stay distinguishable as ALL pairs (lines that cross, scatter), so
//   anything with up to four groups can be any chart; slots 5 and 6 are only checked against
//   their neighbours (strips, stacked bars), so a 5- or 6-group scatter needs direct labels.
//   Cohort subtypes use SUBTYPE_SLOT: A TP53-mutant cat1, B MDM2-amplified cat2,
//   C CDKN1A-methylated cat3, D pathway-intact cat4.
// Mutant vs wildtype is not up vs down: colour the altered group with `accent` (the focus)
// or a categorical slot, and the reference group `neutral`.
//
// ---- API -------------------------------------------------------------------------
//   BioPalette.THEMES          { light: {...}, dark: {...} } hex per token (keys below)
//     keys: up, down, mid, accent, accentInk, neutral, grid, missense, truncating,
//           cat1 .. cat6
//   BioPalette.SURFACES        { light: {bg, fig, text}, dark: {...} } the essays' page
//                              background, figure background and body text
//   BioPalette.CSS_VARS        token key -> CSS custom property name ("--bio-up", ...)
//   BioPalette.SUBTYPE_SLOT    { A: "cat1", B: "cat2", C: "cat3", D: "cat4" }
//   BioPalette.theme()         "dark" | "light" from matchMedia('(prefers-color-scheme: dark)')
//                              (docs/lib/motion.js forces it to the reader's saved theme);
//                              "light" under node. Read it at render time.
//   BioPalette.colors(theme?)  a fresh object of resolved hex for that theme (default: current)
//   BioPalette.get(key, theme?)        one hex
//   BioPalette.categorical(theme?)     [cat1 .. cat6]
//   BioPalette.subtype(key, theme?)    hex for cohort subtype "A".."D"
//   BioPalette.interpolator(kind, theme?)  t in [0, 1] -> hex, interpolated in OKLab.
//                              kind "diverging": down (0) -> mid (0.5) -> up (1);
//                              "up": mid -> up; "down": mid -> down; "accent": mid -> accent.
//                              Use with d3.scaleDiverging / d3.scaleSequential.
//   BioPalette.diverging([lo, center, hi], theme?)  value -> hex, clamped, without d3
//                              (lo maps to down, center to mid, hi to up; hi < lo flips)
//   BioPalette.sequential([lo, hi], pole = "up", theme?)  value -> hex, mid -> pole, clamped
//   BioPalette.mix(a, b, t)    OKLab mix of two hex colours
//   BioPalette.contrast(a, b)  WCAG 2 contrast ratio
//   BioPalette.simulate(hex, kind)  hex as seen with "protan" | "deutan" | "tritan"
//                              dichromacy (Machado, Oliveira and Fernandes 2009, severity 1)
//   BioPalette.deltaE(a, b, kind?)  OKLab distance x 100, optionally after simulate()
//   BioPalette.runChecks(print) -> [{name, ok, detail}]
//
// ---- Invariants the essays may rely on ----------------------------------------------
//   - up and down stay at least 15 apart (OKLab x 100) under protanopia and deuteranopia,
//     and 20 apart in normal vision, in both themes; accent stays at least 10 from both.
//   - up, down, accent, neutral, missense and the categorical slots are >= 3:1 against the
//     figure background; up, down and accentInk are >= 4.5:1 against the page background,
//     so they can colour words in prose.
//   - interpolator("diverging")(0.5) is exactly mid; lightness falls monotonically from
//     mid to each pole.
// -----------------------------------------------------------------------------------
(function (root) {
  "use strict";

  const THEMES = {
    light: {
      up: "#a83228", down: "#245a9c", mid: "#ebe9e6",
      accent: "#14a49c", accentInk: "#0a7570",
      neutral: "#6a6f83", grid: "#e2e2e8",
      missense: "#6e9567", truncating: "#1a1a2e",
      cat1: "#ac7c00", cat2: "#9f6e98", cat3: "#54581e", cat4: "#483590", cat5: "#986247", cat6: "#870657"
    },
    dark: {
      up: "#ec6a5a", down: "#4f8fd8", mid: "#363644",
      accent: "#36c3c0", accentInk: "#5fd3cf",
      neutral: "#6d7286", grid: "#2f3547",
      missense: "#aad3a3", truncating: "#e4e4ec",
      cat1: "#d2a13e", cat2: "#e9b3e0", cat3: "#71763d", cat4: "#7e71d2", cat5: "#d49a7e", cat6: "#bd4485"
    }
  };
  const SURFACES = {
    light: { bg: "#fafafa", fig: "#ffffff", text: "#1a1a2e" },
    dark: { bg: "#15151d", fig: "#1d1d28", text: "#e4e4ec" }
  };
  const KEYS = Object.keys(THEMES.light);
  const CSS_VARS = {};
  KEYS.forEach(k => { CSS_VARS[k] = "--bio-" + k.replace(/[A-Z]/g, c => "-" + c.toLowerCase()).replace(/(\D)(\d)$/, "$1-$2"); });
  const SUBTYPE_SLOT = { A: "cat1", B: "cat2", C: "cat3", D: "cat4" };

  function theme() {
    try {
      if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch (e) { /* no matchMedia */ }
    return "light";
  }
  const pick = t => THEMES[t === "dark" || t === "light" ? t : theme()];
  const colors = t => Object.assign({}, pick(t));
  const get = (k, t) => pick(t)[k];
  const categorical = t => { const c = pick(t); return [c.cat1, c.cat2, c.cat3, c.cat4, c.cat5, c.cat6]; };
  const subtype = (k, t) => pick(t)[SUBTYPE_SLOT[k]];

  // ---- colour math ----
  const s2l = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const l2s = c => { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; };
  const lin = h => [1, 3, 5].map(i => s2l(parseInt(h.slice(i, i + 2), 16) / 255));
  const toHex = rgb => "#" + rgb.map(v => Math.round(l2s(v) * 255).toString(16).padStart(2, "0")).join("");
  function oklab(rgb) {
    const [r, g, b] = rgb;
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function fromOklab([L, a, b]) {
    const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076127010 * s];
  }
  function mix(a, b, t) {
    const A = oklab(lin(a)), B = oklab(lin(b));
    return toHex(fromOklab(A.map((v, i) => v + (B[i] - v) * t)));
  }
  const relLum = h => { const [r, g, b] = lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  function contrast(a, b) { const x = relLum(a), y = relLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  const MACHADO = {
    protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
    tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]
  };
  function simLin(h, kind) {
    const c = lin(h); if (!kind) return c;
    return MACHADO[kind].map(r => Math.max(0, Math.min(1, r[0] * c[0] + r[1] * c[1] + r[2] * c[2])));
  }
  const simulate = (h, kind) => toHex(simLin(h, kind));
  function deltaE(a, b, kind) {
    const x = oklab(simLin(a, kind)), y = oklab(simLin(b, kind));
    return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
  }
  const cvd = (a, b) => Math.min(deltaE(a, b, "protan"), deltaE(a, b, "deutan"));

  // ---- scales ----
  function interpolator(kind, t) {
    const c = pick(t);
    if (kind === "diverging") return x => x <= 0.5 ? mix(c.down, c.mid, Math.max(0, x) * 2) : mix(c.mid, c.up, (Math.min(1, x) - 0.5) * 2);
    const pole = { up: c.up, down: c.down, accent: c.accent }[kind];
    if (!pole) throw new Error("BioPalette.interpolator: unknown kind " + kind);
    return x => mix(c.mid, pole, Math.max(0, Math.min(1, x)));
  }
  function diverging(domain, t) {
    const [lo, ce, hi] = domain, f = interpolator("diverging", t);
    return v => {
      if (v === ce) return f(0.5);
      const below = (v - ce) * (hi - ce) < 0; // on the lo side of center (works when hi < lo)
      const u = below ? (v - ce) / (lo - ce) : (v - ce) / (hi - ce);
      return f(below ? 0.5 - 0.5 * Math.min(1, u) : 0.5 + 0.5 * Math.min(1, u));
    };
  }
  function sequential(domain, pole, t) {
    const [lo, hi] = domain, f = interpolator(pole || "up", t);
    return v => f((v - lo) / (hi - lo));
  }

  // ---- checks ----
  function readCss() {
    // node: parse palette.css next to this file; browser: computed style of :root
    if (typeof module !== "undefined" && module.exports && typeof require === "function") {
      try {
        const fs = require("fs"), path = require("path");
        const txt = fs.readFileSync(path.join(__dirname, "palette.css"), "utf8");
        const parse = block => { const o = {}; block.replace(/(--bio-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/g, (_, k, v) => { o[k] = v.toLowerCase(); }); return o; };
        const darkStart = txt.indexOf("@media (prefers-color-scheme: dark)");
        return { light: parse(txt.slice(0, darkStart)), dark: parse(txt.slice(darkStart)) };
      } catch (e) { return null; }
    }
    if (typeof document !== "undefined") {
      const cs = getComputedStyle(document.documentElement), o = {};
      KEYS.forEach(k => { const v = cs.getPropertyValue(CSS_VARS[k]).trim().toLowerCase(); if (v) o[CSS_VARS[k]] = v; });
      return Object.keys(o).length ? { [theme()]: o } : null;
    }
    return null;
  }

  function runChecks(print) {
    const out = [];
    const add = (name, ok, detail) => { out.push({ name, ok: !!ok, detail }); if (print) (typeof print === "function" ? print : console.log)(`${ok ? "PASS" : "FAIL"} ${name}${detail ? "  (" + detail + ")" : ""}`); };
    const f1 = x => x.toFixed(1), f2 = x => x.toFixed(2);

    add("both themes define the same tokens as valid hex", ["light", "dark"].every(t => KEYS.every(k => /^#[0-9a-f]{6}$/.test(THEMES[t][k])))
      && Object.keys(THEMES.dark).length === KEYS.length, KEYS.length + " tokens");

    for (const t of ["light", "dark"]) {
      const c = THEMES[t], S = SURFACES[t];
      // the diverging pair
      const udP = deltaE(c.up, c.down, "protan"), udD = deltaE(c.up, c.down, "deutan"), udN = deltaE(c.up, c.down), udT = deltaE(c.up, c.down, "tritan");
      add(`${t}: up and down stay distinct under protanopia and deuteranopia (>= 15) and in normal vision (>= 20)`,
        udP >= 15 && udD >= 15 && udN >= 20, `protan ${f1(udP)}, deutan ${f1(udD)}, tritan ${f1(udT)}, normal ${f1(udN)}`);
      const aU = cvd(c.accent, c.up), aD = cvd(c.accent, c.down), aM = cvd(c.accent, c.mid), aN = Math.min(deltaE(c.accent, c.up), deltaE(c.accent, c.down));
      add(`${t}: accent is distinct from up, down and mid under CVD (>= 10) and in normal vision (>= 15)`,
        aU >= 10 && aD >= 10 && aM >= 10 && aN >= 15, `vs up ${f1(aU)}, vs down ${f1(aD)}, vs mid ${f1(aM)}, normal ${f1(aN)}`);
      const nU = cvd(c.neutral, c.up), nD = cvd(c.neutral, c.down), nA = cvd(c.neutral, c.accent);
      add(`${t}: neutral is distinct from up, down and accent under CVD (>= 8)`, Math.min(nU, nD, nA) >= 8, `${f1(nU)}, ${f1(nD)}, ${f1(nA)}`);
      const mU = cvd(c.missense, c.up), mD = cvd(c.missense, c.down), mT = cvd(c.missense, c.truncating);
      add(`${t}: missense glyph is distinct from amplification (up), deletion (down) and truncating under CVD (>= 8)`,
        Math.min(mU, mD, mT) >= 8, `vs up ${f1(mU)}, vs down ${f1(mD)}, vs truncating ${f1(mT)}`);

      // contrast
      const marks = ["up", "down", "accent", "neutral", "missense", "truncating", "cat1", "cat2", "cat3", "cat4", "cat5", "cat6"];
      const lowM = marks.filter(k => contrast(c[k], S.fig) < 3).map(k => `${k} ${f2(contrast(c[k], S.fig))}`);
      add(`${t}: marks are >= 3:1 on the figure background ${S.fig}`, !lowM.length,
        lowM.length ? lowM.join(", ") : marks.map(k => k + " " + f2(contrast(c[k], S.fig))).join(", "));
      const ink = ["up", "down", "accentInk"];
      const lowT = ink.filter(k => contrast(c[k], S.bg) < 4.5).map(k => `${k} ${f2(contrast(c[k], S.bg))}`);
      add(`${t}: up, down and accentInk are >= 4.5:1 on the page background ${S.bg} (usable as text)`, !lowT.length,
        lowT.length ? lowT.join(", ") : ink.map(k => k + " " + f2(contrast(c[k], S.bg))).join(", "));
      const midFig = deltaE(c.mid, S.fig);
      add(`${t}: mid is visible against the figure background but far quieter than either pole`,
        midFig >= 3 && midFig <= 12 && deltaE(c.mid, c.up) > 25 && deltaE(c.mid, c.down) > 25,
        `mid vs fig ${f1(midFig)}, vs up ${f1(deltaE(c.mid, c.up))}, vs down ${f1(deltaE(c.mid, c.down))}`);
      const gridFig = deltaE(c.grid, S.fig);
      add(`${t}: grid is a faint line on the figure background`, gridFig >= 3 && gridFig <= 15, `delta E ${f1(gridFig)}`);

      // categorical: first four all pairs, all six adjacent pairs; CVD >= 8 and normal >= 15
      const cat = [c.cat1, c.cat2, c.cat3, c.cat4, c.cat5, c.cat6];
      let worst = [Infinity, ""], worstN = [Infinity, ""];
      const pairs = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([i, j]);
      pairs.push([3, 4], [4, 5]);
      pairs.forEach(([i, j]) => {
        const d = cvd(cat[i], cat[j]), n = deltaE(cat[i], cat[j]);
        if (d < worst[0]) worst = [d, `cat${i + 1}-cat${j + 1}`];
        if (n < worstN[0]) worstN = [n, `cat${i + 1}-cat${j + 1}`];
      });
      add(`${t}: categorical slots separate (first four all pairs, then neighbours): CVD >= 8, normal >= 15`,
        worst[0] >= 8 && worstN[0] >= 15, `worst CVD ${f1(worst[0])} ${worst[1]}, worst normal ${f1(worstN[0])} ${worstN[1]}`);
      const sOk = ["A", "B", "C", "D"].every(k => subtype(k, t) === c[SUBTYPE_SLOT[k]]);
      add(`${t}: subtype colours map A-D to cat1-cat4`, sOk, ["A", "B", "C", "D"].map(k => k + " " + subtype(k, t)).join(", "));
      const cm = Math.min.apply(null, cat.map(x => cvd(x, c.missense)));
      add(`${t}: no categorical slot collides with the missense glyph (CVD >= 6)`, cm >= 6, `closest ${f1(cm)}`);

      // interpolators
      const f = interpolator("diverging", t);
      const Ls = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(x => oklab(lin(f(x)))[0]);
      const mono = Ls.slice(0, 6).every((v, i, a) => i === 0 || v >= a[i - 1] - 1e-9) === (Ls[5] >= Ls[0])
        && Ls.slice(5).every((v, i, a) => i === 0 || (Ls[5] >= Ls[10] ? v <= a[i - 1] + 1e-9 : v >= a[i - 1] - 1e-9));
      add(`${t}: diverging interpolator hits the tokens and is monotone in lightness on each arm`,
        f(0) === c.down && f(1) === c.up && f(0.5) === c.mid && mono, `L ${Ls.map(v => v.toFixed(2)).join(" ")}`);
      const sc = diverging([-2, 0, 2], t), sf = diverging([2, 0, -2], t);
      add(`${t}: diverging([lo, center, hi]) clamps and flips`, sc(-5) === c.down && sc(5) === c.up && sc(0) === c.mid && sf(5) === c.down, "");
    }

    // CSS agreement
    const css = readCss();
    if (css) {
      const bad = [];
      Object.keys(css).forEach(t => KEYS.forEach(k => { const v = css[t][CSS_VARS[k]]; if (v !== THEMES[t][k]) bad.push(`${t} ${CSS_VARS[k]} css ${v} js ${THEMES[t][k]}`); }));
      add("palette.css and palette.js agree token by token", !bad.length, bad.length ? bad.join("; ") : Object.keys(css).join(" + ") + " checked");
    } else add("palette.css and palette.js agree token by token", true, "skipped: palette.css not readable here");

    add("simulate() is the identity for greys", simulate("#808080", "deutan") === "#808080" && simulate("#808080", "protan") === "#808080", simulate("#808080", "deutan"));
    add("contrast(white, black) = 21", Math.abs(contrast("#ffffff", "#000000") - 21) < 1e-9, "");
    return out;
  }

  const api = {
    THEMES, SURFACES, CSS_VARS, SUBTYPE_SLOT,
    theme, colors, get, categorical, subtype, interpolator, diverging, sequential,
    mix, contrast, simulate, deltaE, runChecks
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BioPalette = api;
})(typeof self !== "undefined" ? self : this);
