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
  var btn = document.createElement("button");
  btn.id = "lang-toggle";
  btn.setAttribute("aria-label", "Toggle language");
  Object.assign(btn.style, {
    position: "fixed", top: "1rem", right: "1rem", zIndex: "9999",
    fontFamily: "'Source Sans 3', 'Noto Sans JP', system-ui, sans-serif",
    fontSize: "0.82rem", fontWeight: "600",
    background: "#fff", color: "#2563eb",
    border: "1.5px solid #2563eb", borderRadius: "999px",
    padding: "0.3rem 0.9rem", cursor: "pointer",
    boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
    transition: "background 0.15s, color 0.15s"
  });
  btn.addEventListener("mouseenter", function () {
    btn.style.background = "#2563eb"; btn.style.color = "#fff";
  });
  btn.addEventListener("mouseleave", function () {
    btn.style.background = "#fff"; btn.style.color = "#2563eb";
  });
  document.body.appendChild(btn);

  // --- Apply language ---
  function applyLang(lang) {
    document.documentElement.lang = lang;
    btn.textContent = lang === "en" ? "日本語" : "English";

    var ja = window.PAGE_JA || {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
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

    // Notify JS-driven content (SVG labels, status bars, etc.)
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  btn.addEventListener("click", function () {
    var next = getLang() === "en" ? "ja" : "en";
    localStorage.setItem(STORAGE_KEY, next);
    applyLang(next);
  });

  // Expose current language getter for page scripts
  window.getPageLang = getLang;

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
