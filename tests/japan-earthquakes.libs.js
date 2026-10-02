// Libraries checked by tests/japan-earthquakes.html and scripts/japan-test.mjs.
// Each library exposes runChecks(print, data) returning [{name, ok, detail}].
// `data` (optional) is a path under docs/japan-earthquakes/shared/data/ whose JSON
// is passed as the second argument. Entries whose file does not exist yet are skipped.
var JAPAN_TEST_LIBS = [
  { file: "06-tsunami-source.js", global: "TsunamiSource" },
  { file: "slab.js", global: "Slab", data: "slab2.json" },
  { file: "01-plates.js", global: "PlateDistance" },
  { file: "completeness.js", global: "Completeness" },
  { file: "03-aftershock.js", global: "Aftershock", data: "03-etas-fit.json" },
  { file: "04-gr.js", global: "GutenbergRichter" },
  { file: "05-renewal.js", global: "Renewal" },
  { file: "07-eew.js", global: "EEW" }
];
if (typeof module !== "undefined" && module.exports) module.exports = JAPAN_TEST_LIBS;
