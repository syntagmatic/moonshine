// Runs every japan-earthquakes library's runChecks() in node.
// Usage: node scripts/japan-test.mjs   (exit code 1 on any failure)
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shared = path.join(root, "docs/japan-earthquakes/shared");
const libs = require(path.join(root, "tests/japan-earthquakes.libs.js"));

let total = 0, failed = 0;
for (const lib of libs) {
  const file = path.join(shared, lib.file);
  if (!existsSync(file)) { console.log(`-- ${lib.file}: not present, skipped`); continue; }
  console.log(`== ${lib.file}`);
  const api = require(file);
  const data = lib.data ? JSON.parse(readFileSync(path.join(shared, "data", lib.data), "utf8")) : undefined;
  let results;
  try { results = api.runChecks(false, data); }
  catch (e) { results = [{ name: "runChecks threw", ok: false, detail: String(e) }]; }
  for (const r of results) {
    total++; if (!r.ok) failed++;
    console.log(`${r.ok ? "PASS" : "FAIL"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  }
}
console.log(`\n${total - failed} / ${total} passed`);
process.exit(failed ? 1 : 0);
