import React, { useState, useEffect, useRef } from 'react';

export default function VenueExplorer({ initialVenues = [] }) {
  const [venues, setVenues] = useState(initialVenues);
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(75);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mapCenter, setMapCenter] = useState([44.5, -78.5]);
  const [mapZoom, setMapZoom] = useState(7);

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersGroup = useRef(null);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainer.current) return;
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (!isMounted) return;

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapContainer.current).setView(mapCenter, mapZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        markersGroup.current = L.layerGroup().addTo(mapInstance.current);
      }
      renderMarkers(L, venues);
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update markers when venues change
  const renderMarkers = async (L, venueList) => {
    if (!mapInstance.current || !markersGroup.current) return;
    const leaflet = L || (await import('leaflet'));

    markersGroup.current.clearLayers();

    venueList.forEach((v) => {
      if (v.latitude && v.longitude) {
        const marker = leaflet.marker([v.latitude, v.longitude]);
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 14px; min-width: 180px;">
            <strong style="color: #1f2937;">${v.name}</strong><br/>
            <span style="color: #4b5563;">${v.city || v.region || 'Ontario'}</span><br/>
            ${v.distance_km ? `<span style="color: #059669; font-weight: 600;">${v.distance_km.toFixed(1)} km away</span><br/>` : ''}
            <a href="/venues/${v.slug}" style="display: inline-block; margin-top: 6px; color: #b45309; font-weight: bold; text-decoration: none;">View Venue &rarr;</a>
          </div>
        `);
        markersGroup.current.addLayer(marker);
      }
    });
  };

  // Search by town/city name using OpenStreetMap Nominatim
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setStatusMessage('Locating town...');

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm + ', Ontario, Canada'
        )}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        setStatusMessage(`Could not find "${searchTerm}" in Ontario.`);
        setLoading(false);
        return;
      }

      const userLat = parseFloat(geoData[0].lat);
      const userLng = parseFloat(geoData[0].lon);

      setStatusMessage(`Searching within ${radius}km of ${geoData[0].display_name.split(',')[0]}...`);

      // Query local API route
      const venueRes = await fetch(`/api/venues/search?lat=${userLat}&lng=${userLng}&radius=${radius}`);
      const data = await venueRes.json();

      setVenues(data.venues || []);
      setMapCenter([userLat, userLng]);
      setMapZoom(9);

      if (mapInstance.current) {
        mapInstance.current.setView([userLat, userLng], 9);
        const L = await import('leaflet');
        renderMarkers(L, data.venues || []);
      }

      setStatusMessage(`Found ${data.venues?.length || 0} venues near ${geoData[0].display_name.split(',')[0]}.`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error searching venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Bar & Radius Controls */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px'
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter an Ontario town (e.g. Almonte, Picton, Huntsville)"
          style={{
            flex: '1 1 260px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '15px'
          }}
        />

        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
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
            padding: '10px 20px',
            borderRadius: '6px',
            backgroundColor: '#78350f',
            color: '#ffffff',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Find Venues'}
        </button>
      </form>

      {statusMessage && (
        <p style={{ margin: '0', fontSize: '14px', color: '#4b5563' }}>{statusMessage}</p>
      )}

      {/* Map Element */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '460px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      />

      {/* Venues Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {venues.map((v) => (
          <div
            key={v.id || v.slug}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#ffffff'
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px' }}>{v.name}</h3>
            <p style={{ margin: '0 0 6px 0', color: '#6b7280', fontSize: '14px' }}>
              {v.city ? `${v.city}, ` : ''}{v.region || 'Ontario'}
            </p>
            {v.distance_km && (
              <p style={{ margin: '0 0 10px 0', color: '#059669', fontWeight: 'bold', fontSize: '13px' }}>
                {v.distance_km.toFixed(1)} km from search
              </p>
            )}
            <a
              href={`/venues/${v.slug}`}
              style={{
                display: 'inline-block',
                marginTop: '8px',
                color: '#78350f',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              View Venue Details &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}