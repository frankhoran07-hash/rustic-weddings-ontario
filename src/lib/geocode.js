// src/lib/geocode.js
export async function getCoordinatesForTown(townName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(townName + ', Ontario, Canada')}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RusticWeddingsOntario/1.0' }
    });
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name
    };
  }