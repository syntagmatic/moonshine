#!/usr/bin/env bash
# Fetch third-party assets into docs/vendor/ so pages render with no external egress.
#
# docs/vendor/ is gitignored. Run this on the host before working in a sandboxed
# container (which has no CDN access), and in CI before deploying Pages.
# It must live under docs/ because the Pages workflow publishes only that directory.
#
#   ./scripts/vendor.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."
V=docs/vendor
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

fail=0
get() { # get <url> <dest>
  mkdir -p "$(dirname "$V/$2")"
  curl -sfL --retry 3 --retry-delay 2 "$1" -o "$V/$2" || { echo "FAIL  $1" >&2; fail=1; }
}

rm -rf "$V"; mkdir -p "$V"

echo "==> KaTeX"
# Two versions are in use across the docs; both are vendored rather than
# silently upgrading pages to a version they were not checked against.
for kv in 0.16.11 0.16.9; do
  get "https://cdn.jsdelivr.net/npm/katex@$kv/dist/katex.min.js"               "katex@$kv/katex.min.js"
  get "https://cdn.jsdelivr.net/npm/katex@$kv/dist/katex.min.css"              "katex@$kv/katex.min.css"
  get "https://cdn.jsdelivr.net/npm/katex@$kv/dist/contrib/auto-render.min.js" "katex@$kv/auto-render.min.js"
  # katex.min.css references fonts/*.woff2 relative to itself
  grep -oE 'fonts/[A-Za-z0-9_-]+\.woff2' "$V/katex@$kv/katex.min.css" | sort -u | while read -r f; do
    curl -sfL --retry 3 "https://cdn.jsdelivr.net/npm/katex@$kv/dist/$f" -o "$V/katex@$kv/$f" --create-dirs
  done
done

echo "==> Plotting / geo libraries"
get https://d3js.org/d3.v7.min.js         js/d3.v7.min.js
get https://d3js.org/topojson.v3.min.js   js/topojson.v3.min.js
get https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js  js/topojson-client.min.js
get https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js         js/d3-sankey.min.js

# Self-contained ESM bundle (jsdelivr's /+esm is a stub that imports further URLs)
stub=$(curl -sfL --retry 3 "https://esm.sh/@observablehq/plot?bundle&target=es2022") || { echo "FAIL  plot" >&2; fail=1; }
path=$(printf '%s' "${stub:-}" | grep -oE '"/[^"]+\.mjs"' | head -1 | tr -d '"')
mkdir -p "$V/esm"
if [ -n "$path" ]; then
  curl -sfL --retry 3 "https://esm.sh$path" -o "$V/esm/plot.mjs" || { echo "FAIL  plot bundle" >&2; fail=1; }
else
  printf '%s' "${stub:-}" > "$V/esm/plot.mjs"
fi

echo "==> Topology data"
get https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json   data/world-atlas/countries-50m.json
get https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json  data/world-atlas/countries-110m.json
get https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json         data/us-atlas/states-10m.json

echo "==> Fonts"
# Sets are defined in scripts/font-sets.txt, the single source of truth shared
# with the page rewriter. Fetched with a browser UA so Google serves woff2.
while IFS=$'\t' read -r name url; do
  case "$name" in ''|\#*) continue ;; esac
  mkdir -p "$V/fonts/$name"
  css=$(curl -sfL --retry 3 -A "$UA" "$url") || { echo "FAIL  font $name" >&2; fail=1; continue; }
  printf '%s' "$css" | grep -oE 'https://fonts\.gstatic\.com/[^)]*' | sort -u | while read -r f; do
    curl -sfL --retry 3 "$f" -o "$V/fonts/$name/$(basename "$f")"
  done
  printf '%s' "$css" | sed -E 's#https://fonts\.gstatic\.com/[^)]*/([^/)]+)#\1#g' > "$V/fonts/$name/fonts.css"
  echo "    $name: $(ls "$V/fonts/$name" | wc -l | tr -d ' ') files"
done < scripts/font-sets.txt

echo
find "$V" -type f | wc -l | xargs echo "vendored files:"
du -sh "$V" | cut -f1 | xargs echo "total size:"
[ "$fail" = 0 ] || { echo "one or more assets failed to download" >&2; exit 1; }
