/* Language toggle for Japan Earthquake explainers
   Usage: each page defines window.PAGE_JA = { key: "Japanese HTML", ... }
   and marks translatable elements with data-i18n="key" attributes.
   This script creates a toggle button, swaps content, and persists the choice. */

(function () {
  var STORAGE_KEY = "japan-eq-lang";

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  // --- Toggle button ---
  // On wide screens it floats in the top-right margin. Below 1000px there is
  // no margin to float in, so it sits in its own row at the top of the
  // article instead of covering the heading or the notice banner.
  var css = document.createElement("style");
  css.textContent =
    ".lang-bar{display:flex;justify-content:flex-end;margin:0 0 0.75rem}" +
    "#lang-toggle{font-family:'Source Sans 3','Noto Sans JP',system-ui,sans-serif;" +
    "font-size:0.82rem;font-weight:600;line-height:1.4;background:var(--fig-bg,#fff);" +
    "color:var(--accent,#2563eb);border:1.5px solid var(--accent,#2563eb);" +
    "border-radius:999px;padding:0.3rem 0.9rem;cursor:pointer;" +
    "transition:background 0.15s,color 0.15s}" +
    "#lang-toggle:hover,#lang-toggle:focus-visible{background:var(--accent,#2563eb);color:var(--fig-bg,#fff)}" +
    "@media (min-width:1000px){.lang-bar{margin:0;height:0}" +
    "#lang-toggle{position:fixed;top:1rem;right:1rem;z-index:9999;box-shadow:0 1px 6px rgba(0,0,0,0.10)}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.id = "lang-toggle";
  btn.setAttribute("aria-label", "Toggle language / 言語を切り替える");
  var bar = document.createElement("div");
  bar.className = "lang-bar";
  bar.appendChild(btn);
  var host = document.querySelector(".article");
  if (host) host.insertBefore(bar, host.firstChild);
  else document.body.insertBefore(bar, document.body.firstChild);

  // --- Apply language ---
  function applyLang(lang) {
    document.documentElement.lang = lang;
    btn.textContent = lang === "en" ? "日本語" : "English";
    translate(lang, document);

    // Notify JS-driven content (SVG labels, status bars, etc.)
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  // Site chrome from ../lib/motion.js, shared by every page in the series.
  var SITE_JA = {
    site_notice: "<strong>このコンテンツは機械で生成されたもので、誤りを含むことがあります。</strong>参照する前に、引用元の資料で内容を確かめてください。",
    site_dismiss: "閉じる"
  };

  function translate(lang, root) {
    var ja = Object.assign({}, SITE_JA, window.PAGE_JA || {});
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var isSVG = el.namespaceURI === "http://www.w3.org/2000/svg";
      if (lang === "ja") {
        if (!el.hasAttribute("data-i18n-orig"))
          el.setAttribute("data-i18n-orig", isSVG ? el.textContent : el.innerHTML);
        if (ja[key]) {
          if (isSVG) el.textContent = ja[key]; else el.innerHTML = ja[key];
        }
      } else {
        var orig = el.getAttribute("data-i18n-orig");
        if (orig !== null) {
          if (isSVG) el.textContent = orig; else el.innerHTML = orig;
        }
      }
    });
  }

  btn.addEventListener("click", function () {
    var next = getLang() === "en" ? "ja" : "en";
    localStorage.setItem(STORAGE_KEY, next);
    applyLang(next);
  });

  // Expose current language getter for page scripts
  window.getPageLang = getLang;

  // Figures that draw asynchronously (after a data fetch) call this once their
  // data-i18n labels exist, so a page loaded in Japanese translates them too.
  // It does not fire langchange, so it is safe to call from a draw function.
  window.translatePageLabels = function (root) {
    if (getLang() === "ja") translate("ja", root || document);
  };

  // Apply on load (deferred so PAGE_JA is defined)
  var saved = getLang();
  btn.textContent = saved === "en" ? "日本語" : "English";
  if (saved === "ja") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { applyLang("ja"); });
    } else {
      requestAnimationFrame(function () { applyLang("ja"); });
    }
  }
})();
