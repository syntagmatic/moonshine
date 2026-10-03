// Libraries checked by tests/bioinformatics.html and scripts/bio-test.mjs.
// Each library exposes runChecks(print, data) returning [{name, ok, detail}].
// `data` (optional) is a JSON file under docs/bioinformatics/shared/data/, passed as
// the second argument. Entries whose library or data file does not exist are skipped.
// The essay slots are reserved so per-essay work never has to edit this file.
var BIO_TEST_LIBS = [
  { file: "palette.js", global: "BioPalette" },
  { file: "cohort.js", global: "BioCohort" },
  { file: "locus.js", global: "BioLocus", data: "locus.json" },
  { file: "essay-01.js", global: "BioEssay01", data: "essay-01.json" },
  { file: "essay-02.js", global: "BioEssay02", data: "essay-02.json" },
  { file: "essay-03.js", global: "BioEssay03", data: "essay-03.json" },
  { file: "essay-04.js", global: "BioEssay04", data: "essay-04.json" },
  { file: "essay-05.js", global: "BioEssay05", data: "essay-05.json" },
  { file: "essay-06.js", global: "BioEssay06", data: "essay-06.json" },
  { file: "essay-07.js", global: "BioEssay07", data: "essay-07.json" },
  { file: "essay-08.js", global: "BioEssay08", data: "essay-08.json" }
];
if (typeof module !== "undefined" && module.exports) module.exports = BIO_TEST_LIBS;
