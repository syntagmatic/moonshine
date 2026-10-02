// Worker for essay 01: the random-position control repeated over many seeds, off the main thread.
// In:  { slabUrl, depths: Float32Array, box: [lat0, lat1, lon0, lon1], seeds: [int, ...] }
// Out: { seed, dist: Float32Array } once per seed, the 3D distance of each quake (keeping its depth,
//      position drawn at random in the box with PlateDistance.nullEpicentres) to the nearest slab surface.
importScripts("slab.js", "01-plates.js");
onmessage = async ev => {
  const { slabUrl, depths, box, seeds } = ev.data;
  const model = Slab.load(await (await fetch(slabUrl)).json());
  for (const seed of seeds) {
    const pos = PlateDistance.nullEpicentres(depths.length, seed, box), dist = new Float32Array(depths.length);
    for (let i = 0; i < depths.length; i++) dist[i] = PlateDistance.entry(model, { lat: pos[i].lat, lon: pos[i].lon, depth: depths[i] }).dist;
    postMessage({ seed, dist }, [dist.buffer]);
  }
};
