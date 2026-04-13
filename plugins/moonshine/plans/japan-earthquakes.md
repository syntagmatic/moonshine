# Japan Earthquakes — 20 Moonshine Explainers

Stress test of moonshine's range: 20 working-prototype explanations about earthquake history in Japan.

## Context

- **Audience:** A friend living in Japan who is science-literate with lived earthquake experience, learning to use AI tools. English language.
- **Quality target:** Working prototype. Each piece functions with real data and real interaction, prose is serviceable. Best ones get polished later.
- **Data sources:** USGS Earthquake Catalog, JMA (Japan Meteorological Agency), NOAA Significant Earthquake Database. Mix of data strategies across pieces.
- **Output:** Each explanation goes in `~/.agent/moonshine/japan-earthquakes/NN-slug/index.html` with optional `data/` folder.

## The 20 Explainers

### Insight Explanations (8)

Each insight gets two variations with different interaction designs.

**1a. Spatial Clustering — Brush-linked map + timeline**
Map of Japan with earthquake locations colored by depth. Brush on the timeline filters the map. Brush on the map filters the timeline. Linked views reveal that quakes cluster along specific subduction zone segments.
- Data: USGS catalog, M4.5+, 2000-present
- Data strategy: External CSV in `data/` folder
- Key interaction: Bidirectional brush between map and timeline

**1b. Spatial Clustering — Scroll-driven narrative**
Sticky map with scrolling text steps. Each step highlights a different plate boundary (Pacific, Philippine Sea, Eurasian, North American) and the quakes associated with it. Reader scrolls through the story of Japan's four-plate collision.
- Data: USGS catalog, M4.5+, 2000-present (same as 1a)
- Data strategy: Inline JSON (curated subset ~500 quakes)
- Key interaction: Scroll-driven, step-based map transitions

**2a. Temporal Patterns — Interactive calendar heatmap + map**
Calendar heatmap (year × day-of-year) showing earthquake frequency. Click a cell to see that day's quakes on the map. Reveals aftershock sequences as bright streaks and seasonal patterns (if any).
- Data: JMA catalog, M3+, 2010-present
- Data strategy: Pre-aggregated daily counts (inline JSON) + detail data loaded on demand from `data/` folder
- Key interaction: Click calendar cell to filter map

**2b. Temporal Patterns — Animated timeline playback**
Map with play/pause controls that animate through time. Speed control and magnitude filter. Aftershock sequences appear as bursts. A running sparkline shows cumulative seismic energy.
- Data: USGS catalog, M4.5+, 2010-present
- Data strategy: External JSON in `data/` folder
- Key interaction: Play/pause animation with speed and magnitude controls

**3a. Scale & Frequency — Gutenberg-Richter interactive plot + map**
Log-frequency vs magnitude plot (Gutenberg-Richter law) with a linked map. Drag a threshold on the GR plot to filter which quakes appear on the map. Shows that small quakes are exponentially more common and fill in the plate boundaries densely.
- Data: USGS catalog, all magnitudes available, 2000-present
- Data strategy: Inline JSON (pre-binned magnitude counts + individual quakes for map)
- Key interaction: Draggable magnitude threshold on GR plot filters map

**3b. Scale & Frequency — Small multiples by region**
Grid of small GR plots, one per region of Japan (Hokkaido, Tohoku, Kanto, Chubu, Kansai, Chugoku, Shikoku, Kyushu, Okinawa). Shared axes for comparison. Hover a region to highlight it on a central map.
- Data: USGS catalog, M2+, 2000-present
- Data strategy: External CSV, client-side binning per region
- Key interaction: Hover small multiple to highlight region on map

**4a. Human Impact — Scroll-driven before/after narrative**
Scroll through Japan's most devastating earthquakes chronologically: 1923 Kanto, 1995 Kobe, 2011 Tohoku, 2024 Noto. Each step shows the quake on the map, then reveals casualty numbers, infrastructure damage, and what changed in policy/engineering afterward.
- Data: NOAA Significant Earthquake Database + hand-curated metadata for 10-15 major events
- Data strategy: Inline JSON (curated dataset, ~15 events with rich metadata)
- Key interaction: Scroll-driven narrative with map + stats panels

**4b. Human Impact — Linked map + casualty/damage charts**
Map showing significant earthquakes sized by magnitude, colored by deaths. Linked bar charts show deaths, economic damage, and buildings destroyed. Brush the map or any chart to cross-filter. Reveals that impact depends on location and era, not just magnitude.
- Data: NOAA Significant Earthquake Database, Japan subset, 1900-present
- Data strategy: External JSON in `data/` folder
- Key interaction: Brush any view to cross-filter all others

### Dataset Explainers (4)

**5. USGS Earthquake Catalog**
What's in it: fields (time, lat, lon, depth, mag, magType, place), coverage (global, ~1970+ comprehensive, ~1900+ for significant), access methods (API, CSV download). Quirks: magnitude types change over time, completeness varies by region, location names are approximate.
- Visualization: Map of coverage density + timeline of catalog completeness
- Data strategy: Live API fetch from USGS with fallback to embedded sample

**6. JMA Seismic Database**
What's in it: shindo intensity scale (unique to Japan), denser coverage of small quakes in Japan, station-level intensity reports. How it differs from USGS: more events, intensity vs magnitude focus, Japanese-language primary source.
- Visualization: Side-by-side event count comparison (JMA vs USGS for same region/period)
- Data strategy: Pre-downloaded JMA data in external CSV (JMA doesn't have a clean public API)

**7. NOAA Significant Earthquake Database**
What's in it: historically significant earthquakes going back to 2000 BCE. Fields include deaths, injuries, damage ($), houses destroyed, tsunami flag. Curated (not comprehensive), editorial judgment on what counts as "significant."
- Visualization: Timeline of significant events with magnitude + impact encoding
- Data strategy: External JSON, full Japan subset embedded

**8. Three Datasets Compared**
Side-by-side comparison: event count by year, magnitude distribution, geographic coverage, temporal depth. Where they agree and diverge. Which to use for what question.
- Visualization: Small multiples showing the same time period from each dataset's perspective
- Data strategy: All three datasets loaded from `data/` folder, aligned by time and location

### Data Strategy Explainers (4)

**9. Inline JSON**
Explains and demonstrates embedding data directly in the HTML file as a JS object or JSON string. Shows the tradeoff: simple, self-contained, no CORS issues, but file size grows. Best for curated datasets under ~1MB.
- Visualization: A working earthquake map with inline data, plus a "view source" toggle showing the embedded data
- Data strategy: Inline JSON (demonstrating itself)

**10. External CSV/JSON Files**
Explains loading data from companion files via fetch/d3.csv/d3.json. Shows the `data/` folder convention, CORS considerations for local files, and how to handle loading states.
- Visualization: Same earthquake map as #9 but loading from external file, with visible loading state
- Data strategy: External files (demonstrating itself)

**11. Live API Fetching**
Explains runtime API calls to USGS earthquake API. Shows URL construction, pagination, rate limits, error handling, and fallback to cached data when offline.
- Visualization: "Live" earthquake map that fetches recent quakes on load, with cached fallback
- Data strategy: Live API with embedded fallback (demonstrating itself)

**12. Pre-aggregated Summaries**
Explains when and how to pre-aggregate: daily/weekly/monthly counts, magnitude bins, spatial grid cells. Shows the raw-vs-aggregated tradeoff for performance and file size.
- Visualization: Toggle between raw points (slow at 50k+) and aggregated hexbin (fast), showing the same data both ways
- Data strategy: Both raw and pre-aggregated versions in `data/` folder (demonstrating itself)

### Contextual Explainers (4)

**13. Tectonic Plate Geometry of Japan**
Why Japan has so many earthquakes: four plates (Pacific, Philippine Sea, Eurasian, North American) converge here. Subduction zones, the Japan Trench, the Nankai Trough. Cross-section diagrams showing plates diving under each other.
- Visualization: Map with plate boundaries + interactive cross-section (click a transect line on the map, see depth profile below)
- Data strategy: Plate boundary GeoJSON (inline) + earthquake depth data from USGS (external CSV)

**14. Magnitude Scales Explained**
Richter vs moment magnitude vs JMA shindo intensity. Why shindo matters in Japan: it measures what you feel, not what the fault did. Interactive comparison showing the same quake rated on different scales.
- Visualization: Interactive converter + map showing how shindo varies across distance from epicenter for a single quake
- Data strategy: Inline (formulas + curated example events with multi-scale ratings)

**15. Tsunami Propagation**
How undersea earthquakes generate tsunamis. The 2011 Tohoku tsunami as case study: generation, propagation across the Pacific, arrival times. Why shallow thrust quakes on the trench produce the worst tsunamis.
- Visualization: Animated wave propagation on a map (concentric wavefronts expanding from epicenter with arrival time contours)
- Data strategy: Pre-computed wavefront contours (inline JSON) + NOAA tsunami data (external)

**16. Earthquake Early Warning Systems**
How JMA's early warning system works: P-wave detection, magnitude estimation, intensity prediction, alert distribution. The seconds-to-tens-of-seconds warning window. How the system performed in 2011.
- Visualization: Animated simulation of P-wave vs S-wave propagation from an epicenter, showing the warning window shrinking with distance
- Data strategy: Inline (physics parameters + curated station locations)
