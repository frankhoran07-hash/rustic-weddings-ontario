import React, { useState, useEffect, useRef } from 'react';

export default function VenueExplorer({ initialVenues = [] }) {
  const [venues, setVenues] = useState(initialVenues);
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(75);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersGroup = useRef(null);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (typeof window === 'undefined' || !mapContainer.current) return;

      // Dynamically load Leaflet stylesheet if not already present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = await import('leaflet');

      // Fix default Leaflet icon paths in Vite / React
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!isMounted) return;

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapContainer.current).setView([44.5, -78.5], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstance.current);

        markersGroup.current = L.layerGroup().addTo(mapInstance.current);
        setMapReady(true);
      }

      drawPins(L, venues);
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Pins
  const drawPins = (L, list) => {
    if (!mapInstance.current || !markersGroup.current) return;
    markersGroup.current.clearLayers();

    list.forEach((v) => {
      if (v.latitude && v.longitude) {
        const marker = L.marker([v.latitude, v.longitude]);
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
            <strong style="color: #1c1917; font-size: 14px;">${v.name}</strong><br/>
            <span style="color: #78716c;">${v.city || v.region || 'Ontario'}</span><br/>
            ${v.distance_km !== undefined ? `<span style="color: #047857; font-weight: 600;">${v.distance_km.toFixed(1)} km away</span><br/>` : ''}
            <a href="/venues/${v.slug}" style="display: inline-block; margin-top: 6px; color: #78350f; font-weight: 700; text-decoration: underline;">View Venue &rarr;</a>
          </div>
        `);
        markersGroup.current.addLayer(marker);
      }
    });

    setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 200);
  };

  // Run Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setStatusMessage(`Locating "${searchTerm}"...`);

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm + ', Ontario, Canada'
        )}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        setStatusMessage(`Could not find "${searchTerm}" in Ontario. Try another town.`);
        setLoading(false);
        return;
      }

      const userLat = parseFloat(geoData[0].lat);
      const userLng = parseFloat(geoData[0].lon);
      const placeName = geoData[0].display_name.split(',')[0];

      setStatusMessage(`Searching within ${radius} km of ${placeName}...`);

      const res = await fetch(`/api/venues/search?lat=${userLat}&lng=${userLng}&radius=${radius}`);
      const data = await res.json();
      const results = data.venues || [];

      setVenues(results);

      if (mapInstance.current) {
        mapInstance.current.setView([userLat, userLng], 9);
        const L = await import('leaflet');
        drawPins(L, results);
      }

      setStatusMessage(`Found ${results.length} venue${results.length === 1 ? '' : 's'} near ${placeName}.`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error searching venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Search Input Controls */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          backgroundColor: '#f5f5f4',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e7e5e4'
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter an Ontario town (e.g. Almonte, Picton, Huntsville)"
          style={{
            flex: '1 1 240px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d6d3d1',
            fontSize: '15px',
            backgroundColor: '#ffffff'
          }}
        />

        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d6d3d1',
            backgroundColor: '#ffffff',
            fontSize: '15px'
          }}
        >
          <option value={25}>Within 25 km</option>
          <option value={50}>Within 50 km</option>
          <option value={75}>Within 75 km</option>
          <option value={100}>Within 100 km</option>
          <option value={200}>Within 200 km</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#78350f',
            color: '#ffffff',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Searching...' : 'Find Venues'}
        </button>
      </form>

      {statusMessage && (
        <p style={{ margin: '0', fontSize: '14px', color: '#44403c', fontWeight: '500' }}>
          {statusMessage}
        </p>
      )}

      {/* Map Viewport Container */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '480px',
          minHeight: '480px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e7e5e4',
          backgroundColor: '#e5e7eb',
          zIndex: 1
        }}
      />
    </div>
  );
}