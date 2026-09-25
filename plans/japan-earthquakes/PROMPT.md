# Japan Earthquakes

Made with Daniel Overstreet. Keep that credit on the series index and wherever the series is listed.

I want a seven-article series on Japan's earthquakes for a science-literate reader who lives in Japan and has felt these quakes, written in English with a full Japanese translation the reader can switch to. Japan sits where four tectonic plates meet, and the series works from real data: mostly the complete USGS catalog of magnitude 4.5 and larger earthquakes around Japan from 2000 through 2025, about seventeen thousand events. The through-line runs from where the earthquakes strike, to why, to how they cluster in time and how often the big ones come, and then to what follows from them for people: history, tsunamis and early warning.

By the end the reader should be able to look at a map of dots and read the subducting slabs in it, know what the Gutenberg-Richter law does and doesn't predict, and understand what an early warning can and can't buy them.

## Articles

### 1. Where the Earth Cracks Open
Twenty-six years of earthquakes on a map colored by depth, linked to a timeline. The reader brushes a region on the map to filter the timeline and brushes a time span to filter the map, and sees the clusters line up along trenches, with the deep events concentrated under Izu-Bonin.

### 2. Tectonic Plate Geometry of Japan
Why the four-plate junction produces these clusters. The reader clicks transects across a map of plate boundaries and catalog events and sees each cross-section in depth, where the dots themselves trace the sinking slab down to the base of the transition zone. Sections follow the Japan Trench, the Nankai Trough, the Kanto triple junction, and the difference between shallow and deep danger.

### 3. When the Ground Won't Stop Shaking
The whole catalog animated in time, with speed and minimum-magnitude controls and a running sparkline of cumulative seismic energy. The reader watches aftershock sequences burst and fade and sees Tohoku dominate the energy total, which motivates why the magnitude scale is logarithmic.

### 4. How Often the Big Ones Come
The Gutenberg-Richter law fitted live to the catalog. The reader drags the cutoff magnitude and watches the maximum-likelihood b-value and the predicted count of M7+ events change against the observed count, with a strip showing where magnitude types switch. Small multiples then compare fitted b-values across eight regions, with their uncertainty.

### 5. Thirteen Centuries of Earthquakes
Japan's written record from 684 to 2024: thirty-seven significant earthquakes on a timeline, a magnitude-versus-deaths scatter, and a map. The reader hovers each event for its story, sees how weakly magnitude predicts deaths, and follows the Jogan precedent and what each disaster changed.

### 6. Tsunami Propagation
How the 2011 Tohoku earthquake sent waves across the Pacific. The reader sets ocean depth and sees wave speed and predicted arrival times at Hilo and Crescent City beside the observed ones, watches the wavefront cross the ocean, and sees shoaling turn an invisible deep-water wave into a destructive coastal one. It ends with why only some fault types make tsunamis.

### 7. Earthquake Early Warning
Warning comes from the gap between the fast P wave and the damaging S wave. The reader moves a distance slider and watches both wavefronts expand past cities, with the remaining warning time at each, then follows the timeline of the 2011 alert and sees what protective actions fit into a few seconds.

## What to get right

- The catalog is real USGS data, fetched from the USGS earthquake catalog for a fixed box and date range, and every count, fit and prediction in the prose is computed from it in the page. Nothing is hand-typed. The historical list comes from the NOAA NCEI significant earthquake database, one source for every value, and events NOAA lacks are left out. Plate boundaries come from a published model such as Bird (2003).
- Use USGS magnitudes for modern events (Tohoku M9.1, Kumamoto M7.0, Noto M7.5), noting the JMA value once where it differs. Fit b-values by maximum likelihood; a least-squares fit to cumulative counts is biased.
- Facts drafts get wrong: Tokyo received no public warning in 2011 (the alert went to five Tohoku prefectures); the S-P gap grows about 12 seconds per 100 km; the deepest slab events sit near 680 km, at the base of the transition zone; Tohoku's run-up reached about 40 m; the Nankai 30-year probability was revised in 2025, so check the current official figure. Check tsunami arrival times against observations and let the gap show.
- Depth color runs from red for shallow to blue for deep on every map. The index introduces the shindo intensity scale and its palette, which is how Japan actually rates shaking.
- The Japanese translation covers all prose, captions and labels, and a native speaker should review it.
