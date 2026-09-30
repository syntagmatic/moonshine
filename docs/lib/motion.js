// motion.js — shared site chrome used across every series:
//   1. a motion setting (Motion.reduced) with a toggle button and a callout,
//   2. a light/dark theme toggle that remembers the reader's choice, and
//   3. a dismissable notice that the content is machine-generated.
//
// Both settings work the same way. Pages style dark mode with
// `@media (prefers-color-scheme: dark)` and reduced motion with
// `@media (prefers-reduced-motion: reduce)`, and some scripts read the same
// features through matchMedia. We rewrite those features, in every stylesheet
// media rule and in matchMedia queries, to a constant true/false media query
// that reflects the reader's choice. This runs synchronously in <head>, and a
// MutationObserver catches stylesheets parsed after it, so the page never
// paints in the wrong state. Toggling stores the choice and reloads, since
// figures bake colors in at draw time and simulations check Motion.reduced()
// once at startup.
//
// Theme: `localStorage['moonshine-theme']` = 'light' | 'dark'. With no stored
// choice the page follows the OS. <html data-theme> carries the effective theme.
//
// Motion: on for everyone by default, even when the OS asks for reduced motion,
// because many figures only work animated. `localStorage['moonshine-motion']` =
// 'reduced' turns it off site-wide. Readers whose OS asks for reduced motion and
// who haven't chosen get a callout pointing at the toggle. <html data-motion> is
// 'full' or 'reduced'; page CSS scopes its reduce rules with
// `html:not([data-motion="full"])`.
//
// Public API: window.Motion.{reduced, overridden, enable, disable, mountBanner,
// mountNotice, dismissNotice, onVisible, theme, setTheme, mountControls}.

(function (global) {
  'use strict';

  var MOTION_KEY = 'moonshine-motion';
  var NOTICE_KEY = 'li-notice-dismissed';
  var THEME_KEY = 'moonshine-theme';

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  var nativeMatchMedia = global.matchMedia ? global.matchMedia.bind(global) : null;
  function systemMatches(q) { return !!(nativeMatchMedia && nativeMatchMedia(q).matches); }

  var forcedTheme = read(THEME_KEY);
  if (forcedTheme !== 'light' && forcedTheme !== 'dark') forcedTheme = null;
  function currentTheme() {
    return forcedTheme || (systemMatches('(prefers-color-scheme: dark)') ? 'dark' : 'light');
  }

  var motionChoice = read(MOTION_KEY);
  if (motionChoice !== 'reduced' && motionChoice !== 'full') motionChoice = null;
  var motionReduced = motionChoice === 'reduced';
  function systemReducesMotion() { return systemMatches('(prefers-reduced-motion: reduce)'); }

  // ---- Media query rewriting ---------------------------------------------
  var SCHEME_FEATURE = /\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/gi;
  var MOTION_FEATURE = /\(\s*prefers-reduced-motion\s*(?::\s*(reduce|no-preference)\s*)?\)/gi;
  var ALWAYS = '(min-width: 0px)';
  var NEVER = '(max-width: 0px) and (min-width: 1px)';
  function rewriteQuery(q) {
    q = String(q).replace(MOTION_FEATURE, function (m, v) {
      var wantsReduce = !v || v.toLowerCase() === 'reduce';
      return wantsReduce === motionReduced ? ALWAYS : NEVER;
    });
    if (forcedTheme) {
      q = q.replace(SCHEME_FEATURE, function (m, v) {
        return v.toLowerCase() === forcedTheme ? ALWAYS : NEVER;
      });
    }
    return q;
  }
  var REWRITTEN = /prefers-(color-scheme|reduced-motion)/i;

  var patchedSheets = typeof WeakSet === 'function' ? new WeakSet() : null;
  function patchRules(rules) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (r.media && REWRITTEN.test(r.media.mediaText)) {
        r.media.mediaText = rewriteQuery(r.media.mediaText);
      }
      if (r.styleSheet) patchSheet(r.styleSheet);
      if (r.cssRules) patchRules(r.cssRules);
    }
  }
  function patchSheet(sheet) {
    if (!sheet || !patchedSheets || patchedSheets.has(sheet)) return;
    var rules;
    try { rules = sheet.cssRules; } catch (e) { return; } // not loaded yet, or cross-origin
    if (!rules) return;
    patchedSheets.add(sheet);
    var owner = sheet.ownerNode;
    if (owner && owner.media && REWRITTEN.test(owner.media)) {
      owner.media = rewriteQuery(owner.media);
    }
    patchRules(rules);
  }
  function patchAllSheets() {
    var sheets = global.document && global.document.styleSheets;
    if (!sheets) return;
    for (var i = 0; i < sheets.length; i++) patchSheet(sheets[i]);
  }

  // Motion is always forced (the default differs from the OS for readers who
  // ask for reduced motion), so the rewriting always runs.
  if (nativeMatchMedia) {
    global.matchMedia = function (q) { return nativeMatchMedia(rewriteQuery(q)); };
  }
  var doc0 = global.document;
  if (doc0 && doc0.documentElement) {
    doc0.documentElement.dataset.motion = motionReduced ? 'reduced' : 'full';
    patchAllSheets();
    // Stylesheets parsed after this script. Mutation records are delivered
    // before each later parser-blocking script runs and before first paint.
    var sheetObserver = global.MutationObserver && new global.MutationObserver(patchAllSheets);
    if (sheetObserver) sheetObserver.observe(doc0.documentElement, { childList: true, subtree: true });
    doc0.addEventListener('load', function (e) {
      if (e.target && e.target.tagName === 'LINK') patchAllSheets();
    }, true);
    doc0.addEventListener('DOMContentLoaded', patchAllSheets);
    global.addEventListener('load', function () {
      patchAllSheets();
      if (sheetObserver) sheetObserver.disconnect();
    });
  }

  function markTheme() {
    var doc = global.document;
    if (doc && doc.documentElement) doc.documentElement.dataset.theme = currentTheme();
    var btn = doc && doc.getElementById('theme-toggle');
    if (btn) paintThemeToggle(btn);
  }
  markTheme();
  if (!forcedTheme && nativeMatchMedia) {
    var schemeQuery = nativeMatchMedia('(prefers-color-scheme: dark)');
    if (schemeQuery.addEventListener) schemeQuery.addEventListener('change', markTheme);
    else if (schemeQuery.addListener) schemeQuery.addListener(markTheme);
  }

  // ---- Controls ------------------------------------------------------------
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  var ICON_MOON = svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>');
  var ICON_SUN = svg('<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>');
  var ICON_PAUSE = svg('<path d="M9 5v14M15 5v14"/>');
  var ICON_PLAY = svg('<path d="M7 4.5v15l12-7.5z"/>');

  function label(btn, text) {
    btn.setAttribute('aria-label', text);
    btn.title = text;
  }
  function paintThemeToggle(btn) {
    var dark = currentTheme() === 'dark';
    // Show the theme a click switches to.
    btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
    label(btn, dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  function paintMotionToggle(btn) {
    if (motionReduced) {
      // Off is the state where figures break, so say so in words.
      btn.innerHTML = ICON_PLAY + '<span>Motion off</span>';
      btn.className = 'is-off';
      label(btn, 'Animations are off. Turn them back on');
    } else {
      btn.innerHTML = ICON_PAUSE;
      btn.className = '';
      label(btn, 'Turn off animations (reduced motion)');
    }
  }

  var CONTROLS_CSS = [
    '#site-controls{position:fixed;top:12px;right:12px;z-index:1000;display:flex;gap:6px;align-items:center}',
    '#site-controls button{height:32px;min-width:32px;display:flex;align-items:center;justify-content:center;gap:6px;',
    'padding:0;border-radius:16px;cursor:pointer;border:1px solid #d4d4d8;background:rgba(255,255,255,.85);',
    'color:#52525b;opacity:.7;transition:opacity .15s,border-color .15s;',
    "font:600 0.8rem/1 'Source Sans 3',system-ui,sans-serif}",
    '#site-controls button:hover,#site-controls button:focus-visible{opacity:1;border-color:#a1a1aa}',
    '#site-controls button.is-off{opacity:1;padding:0 12px 0 10px;border-color:#d97706;background:#fef3c7;color:#92400e}',
    '#site-controls button.is-off:hover{border-color:#b45309}',
    '[data-theme="dark"] #site-controls button{border-color:#3f3f46;background:rgba(24,24,27,.85);color:#d4d4d8}',
    '[data-theme="dark"] #site-controls button:hover{border-color:#71717a}',
    '[data-theme="dark"] #site-controls button.is-off{border-color:#b45309;background:#2a2110;color:#fcd34d}',
    // Narrow screens: the article runs edge to edge, so sit clear of the top chrome.
    '@media (max-width:760px){#site-controls{top:auto;bottom:14px;right:14px}}',
    '@media print{#site-controls{display:none}}'
  ].join('');

  // Banner colors follow the active theme, like the pages' own dark themes.
  function palette() {
    return currentTheme() === 'dark' ? {
      motion: { border: '#78350f', bg: '#2a2110', text: '#fcd34d', btnBorder: '#b45309', btnBg: '#1c1917' },
      notice: { border: '#7f1d1d', accent: '#f87171', bg: '#2a1215', text: '#fecaca', btnBorder: '#b91c1c', btnBg: '#1c0a0c', btnText: '#fecaca' }
    } : {
      motion: { border: '#fde68a', bg: '#fef3c7', text: '#713f12', btnBorder: '#b45309', btnBg: '#fff' },
      notice: { border: '#fca5a5', accent: '#dc2626', bg: '#fef2f2', text: '#7f1d1d', btnBorder: '#dc2626', btnBg: '#fff', btnText: '#991b1b' }
    };
  }
  function bannerButton(doc, text, c, onClick) {
    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    btn.style.cssText = [
      "font-family: 'Source Sans 3', system-ui, sans-serif",
      'font-size: 0.85rem',
      'font-weight: 600',
      'padding: 0.4rem 0.9rem',
      'border-radius: 5px',
      'border: 1px solid ' + c.btnBorder,
      'background: ' + c.btnBg,
      'color: ' + c.text,
      'cursor: pointer'
    ].join(';');
    btn.addEventListener('click', onClick);
    return btn;
  }

  function setMotion(choice) {
    write(MOTION_KEY, choice);
    global.location && global.location.reload();
  }

  var Motion = {
    reduced: function () { return motionReduced; },
    // True once the reader has made an explicit motion choice either way.
    overridden: function () { return motionChoice !== null; },
    enable: function () { setMotion('full'); },
    disable: function () { setMotion('reduced'); },
    theme: currentTheme,
    setTheme: function (t) {
      write(THEME_KEY, t === 'dark' ? 'dark' : 'light');
      global.location && global.location.reload();
    },
    mountControls: function () {
      var doc = global.document;
      if (!doc || !doc.body || doc.getElementById('site-controls')) return;
      var css = doc.createElement('style');
      css.textContent = CONTROLS_CSS;
      doc.head.appendChild(css);
      var bar = doc.createElement('div');
      bar.id = 'site-controls';

      var motionBtn = doc.createElement('button');
      motionBtn.type = 'button';
      motionBtn.id = 'motion-toggle';
      paintMotionToggle(motionBtn);
      motionBtn.addEventListener('click', function () {
        if (motionReduced) Motion.enable(); else Motion.disable();
      });

      var themeBtn = doc.createElement('button');
      themeBtn.type = 'button';
      themeBtn.id = 'theme-toggle';
      paintThemeToggle(themeBtn);
      themeBtn.addEventListener('click', function () {
        Motion.setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });

      bar.appendChild(motionBtn);
      bar.appendChild(themeBtn);
      doc.body.appendChild(bar);
    },
    onVisible: function (element, callback) {
      if (!element || typeof callback !== 'function') return function () {};
      if (!global.IntersectionObserver) {
        callback(true);
        return function () {};
      }
      var visible = true;
      var observer = new global.IntersectionObserver(function (entries) {
        visible = !!(entries[0] && entries[0].isIntersecting);
        callback(visible);
      }, { rootMargin: '80px 0px 80px 0px', threshold: 0.01 });
      observer.observe(element);
      callback(visible);
      return function () { observer.disconnect(); };
    },
    // Callout for readers whose OS asks for reduced motion but who haven't
    // chosen here: animations are on, and the toggle can turn them off.
    mountBanner: function () {
      if (motionChoice !== null || !systemReducesMotion()) return;
      var doc = global.document;
      if (!doc) return;
      var host = doc.querySelector('.article') || doc.body;
      if (!host || doc.getElementById('motion-banner')) return;
      var c = palette().motion;
      var b = doc.createElement('div');
      b.id = 'motion-banner';
      b.setAttribute('role', 'status');
      b.style.cssText = [
        'margin: 0 0 1rem',
        'padding: 0.7rem 1rem',
        'border: 1px solid ' + c.border,
        'background: ' + c.bg,
        "font-family: 'Source Sans 3', system-ui, sans-serif",
        'font-size: 0.9rem',
        'color: ' + c.text,
        'border-radius: 6px',
        'display: flex',
        'align-items: center',
        'justify-content: space-between',
        'gap: 1rem',
        'flex-wrap: wrap'
      ].join(';');
      var msg = doc.createElement('span');
      msg.style.flex = '1 1 20rem';
      msg.innerHTML = 'Your system asks for <strong>reduced motion</strong>. Animations stay on here because many figures only work animated. You can turn them off any time with the pause button in the corner.';
      var actions = doc.createElement('span');
      actions.style.cssText = 'display:flex;gap:0.5rem;flex-wrap:wrap';
      actions.appendChild(bannerButton(doc, 'Turn off animations', c, function () { Motion.disable(); }));
      actions.appendChild(bannerButton(doc, 'Keep them on', c, function () {
        write(MOTION_KEY, 'full');
        motionChoice = 'full';
        if (b.parentNode) b.parentNode.removeChild(b);
      }));
      b.appendChild(msg); b.appendChild(actions);
      host.insertBefore(b, host.firstChild);
    },
    dismissNotice: function () {
      write(NOTICE_KEY, '1');
      var doc = global.document;
      var el = doc && doc.getElementById('generated-notice');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    },
    mountNotice: function () {
      if (read(NOTICE_KEY) === '1') return;
      var doc = global.document;
      if (!doc) return;
      var host = doc.querySelector('.article') || doc.body;
      if (!host || doc.getElementById('generated-notice')) return;
      var c = palette().notice;
      var b = doc.createElement('div');
      b.id = 'generated-notice';
      b.setAttribute('role', 'note');
      // Prominent on purpose: readers should see it before trusting a claim.
      b.style.cssText = [
        'margin: 0 0 1.25rem',
        'padding: 0.8rem 1rem',
        'border: 1px solid ' + c.border,
        'border-left: 5px solid ' + c.accent,
        'background: ' + c.bg,
        "font-family: 'Source Sans 3', system-ui, sans-serif",
        'font-size: 0.98rem',
        'line-height: 1.4',
        'color: ' + c.text,
        'border-radius: 6px',
        'display: flex',
        'align-items: center',
        'justify-content: space-between',
        'gap: 0.75rem'
      ].join(';');
      var msg = doc.createElement('span');
      msg.innerHTML = '<strong>This content is machine-generated and may contain errors.</strong> Check claims against the cited sources before relying on them.';
      // Bilingual series (shared/i18n.js) translate these two by key.
      msg.setAttribute('data-i18n', 'site_notice');
      var btn = doc.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Dismiss notice');
      btn.textContent = 'Dismiss';
      btn.setAttribute('data-i18n', 'site_dismiss');
      btn.style.cssText = [
        "font-family: 'Source Sans 3', system-ui, sans-serif",
        'font-size: 0.85rem',
        'font-weight: 600',
        'padding: 0.35rem 0.8rem',
        'border-radius: 5px',
        'border: 1px solid ' + c.btnBorder,
        'background: ' + c.btnBg,
        'color: ' + c.btnText,
        'cursor: pointer',
        'flex-shrink: 0'
      ].join(';');
      btn.addEventListener('click', function () { Motion.dismissNotice(); });
      b.appendChild(msg); b.appendChild(btn);
      // Mount above the motion banner so the disclaimer sits topmost.
      host.insertBefore(b, host.firstChild);
    }
  };

  // Auto-mount site chrome on DOM ready. Mount the motion banner first, then
  // the notice, so the notice (inserted last, before firstChild) sits topmost.
  function mountChrome() {
    Motion.mountBanner();
    Motion.mountNotice();
    Motion.mountControls();
  }
  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', mountChrome);
    } else {
      mountChrome();
    }
  }

  global.Motion = Motion;
})(typeof window !== 'undefined' ? window : globalThis);
