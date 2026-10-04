import React, { useState, useEffect, useRef, useMemo } from 'react';

const REGIONS = [
  'All Regions',
  'Ottawa Valley',
  'Muskoka',
  'Simcoe County',
  'Huron County',
  'Oxford County',
  'Northumberland',
  'Kawarthas',
  'Hamilton',
  'Niagara'
];

export default function VenueExplorer({ initialVenues = [] }) {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(75);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [allVenues, setAllVenues] = useState(initialVenues);
  const [proximityVenues, setProximityVenues] = useState(null);

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersGroup = useRef(null);

  // Load venues on mount via API if SSR passed an empty list
  useEffect(() => {
    async function loadAllVenues() {
      try {
        const res = await fetch('/api/venues/search?radius=2000');
        const data = await res.json();
        if (data.venues && data.venues.length > 0) {
          setAllVenues(data.venues);
        }
      } catch (err) {
        console.error('Failed to load initial venues:', err);
      }
    }

    if (allVenues.length === 0) {
      loadAllVenues();
    }
  }, []);

  // Filter venues by region or proximity
  const displayedVenues = useMemo(() => {
    let list = proximityVenues !== null ? proximityVenues : allVenues;
    if (selectedRegion !== 'All Regions') {
      const target = selectedRegion.trim().toLowerCase();
      list = list.filter((v) => {
        const r = (v.region || '').trim().toLowerCase();
        return r === target || r.includes(target) || target.includes(r);
      });
    }
    return list;
  }, [proximityVenues, allVenues, selectedRegion]);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainer.current) return;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = await import('leaflet');

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!isMounted) return;

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapContainer.current).setView([44.5, -79.5], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstance.current);

        markersGroup.current = L.layerGroup().addTo(mapInstance.current);
      }

      updateMap(L, displayedVenues);
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync markers when displayed venues change
  useEffect(() => {
    if (mapInstance.current) {
      import('leaflet').then((L) => {
        updateMap(L, displayedVenues);
      });
    }
  }, [displayedVenues]);

  const updateMap = (L, list) => {
    if (!mapInstance.current || !markersGroup.current) return;
    markersGroup.current.clearLayers();

    const validPoints = [];

    list.forEach((v) => {
      const lat = parseFloat(v.latitude);
      const lng = parseFloat(v.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        validPoints.push([lat, lng]);
        const marker = L.marker([lat, lng]);
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
            <strong style="color: #1c1917; font-size: 14px;">${v.name}</strong><br/>
            <span style="color: #78716c;">${v.city || ''}${v.region ? ', ' + v.region : ''}</span><br/>
            ${v.distance_km !== undefined ? `<span style="color: #047857; font-weight: 600;">${v.distance_km.toFixed(1)} km away</span><br/>` : ''}
            <a href="/venues/${v.slug}" style="display: inline-block; margin-top: 6px; color: #78350f; font-weight: 700; text-decoration: underline;">View Details &rarr;</a>
          </div>
        `);
        markersGroup.current.addLayer(marker);
      }
    });

    if (validPoints.length > 0) {
      mapInstance.current.fitBounds(validPoints, { padding: [40, 40], maxZoom: 10 });
    } else {
      mapInstance.current.setView([44.5, -79.5], 6);
    }

    setTimeout(() => {
      if (mapInstance.current) mapInstance.current.invalidateSize();
    }, 200);
  };

  // Search handler (town proximity or region filter)
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    // If town/city is blank, filter all loaded venues by the selected region
    if (!searchTerm.trim()) {
      setProximityVenues(null);
      if (selectedRegion === 'All Regions') {
        setStatusMessage(`Showing all ${allVenues.length} venues.`);
      } else {
        const target = selectedRegion.trim().toLowerCase();
        const count = allVenues.filter((v) => {
          const r = (v.region || '').trim().toLowerCase();
          return r === target || r.includes(target) || target.includes(r);
        }).length;
        setStatusMessage(`Showing ${count} venue(s) in ${selectedRegion}.`);
      }
      return;
    }

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
        setStatusMessage(`Could not find "${searchTerm}" in Ontario.`);
        setLoading(false);
        return;
      }

      const userLat = parseFloat(geoData[0].lat);
      const userLng = parseFloat(geoData[0].lon);
      const placeName = geoData[0].display_name.split(',')[0];

      setStatusMessage(`Searching within ${radius} km of ${placeName}...`);

      const res = await fetch(`/api/venues/search?lat=${userLat}&lng=${userLng}&radius=${radius}`);
      const data = await res.json();
      setProximityVenues(data.venues || []);
      setStatusMessage(`Found ${(data.venues || []).length} venue(s) near ${placeName}.`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error searching venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);
    setProximityVenues(null);

    if (newRegion === 'All Regions') {
      setStatusMessage(`Showing all venues.`);
    } else {
      const target = newRegion.trim().toLowerCase();
      const count = allVenues.filter((v) => {
        const r = (v.region || '').trim().toLowerCase();
        return r === target || r.includes(target) || target.includes(r);
      }).length;
      setStatusMessage(`Showing ${count} venue(s) in ${newRegion}.`);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedRegion('All Regions');
    setProximityVenues(null);
    setStatusMessage('');
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1c1917' }}>
      {/* Dark Hero Header */}
      <div style={{ backgroundColor: '#1a1816', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
          Find Your Dream Rustic Venue in Ontario
        </h1>
        <p style={{ color: '#a8a29e', fontSize: '17px', margin: '0 auto 28px auto', maxWidth: '640px' }}>
          Explore the finest barns, historic estates, greenhouses, and countryside settings.
        </p>

        {/* Filter Controls Bar */}
        <form
          onSubmit={handleSearch}
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '12px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search town or city (optional)"
            style={{
              flex: '2 1 200px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d6d3d1',
              fontSize: '14px',
              color: '#1c1917',
              outline: 'none',
            }}
          />

          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            style={{
              flex: '1 1 150px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d6d3d1',
              fontSize: '14px',
              backgroundColor: '#fff',
              color: '#1c1917',
              cursor: 'pointer',
            }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{
              flex: '1 1 120px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d6d3d1',
              fontSize: '14px',
              backgroundColor: '#fff',
              color: '#1c1917',
              cursor: 'pointer',
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
              padding: '10px 22px',
              borderRadius: '8px',
              backgroundColor: '#78350f',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          {(searchTerm || selectedRegion !== 'All Regions' || proximityVenues !== null) && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#78350f',
                fontWeight: '600',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Reset
            </button>
          )}
        </form>

        {statusMessage && (
          <p style={{ marginTop: '16px', color: '#f59e0b', fontSize: '14px', fontWeight: '500' }}>
            {statusMessage}
          </p>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Compact Map Preview */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#78716c' }}>
              MAP OVERVIEW &bull; {displayedVenues.length} {displayedVenues.length === 1 ? 'VENUE' : 'VENUES'} PINNED
            </span>
          </div>
          <div
            ref={mapContainer}
            style={{
              width: '100%',
              height: '320px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e7e5e4',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              backgroundColor: '#e5e7eb',
            }}
          />
        </div>

        {/* Section Heading */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 6px 0', color: '#1c1917' }}>
            {selectedRegion === 'All Regions' ? 'Featured Venues' : `${selectedRegion} Venues`}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#78716c' }}>
            Showing {displayedVenues.length} rustic locations
          </p>
        </div>

        {/* Dynamic Venue Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px',
          }}
        >
          {displayedVenues.map((v) => (
            <div
              key={v.id || v.slug}
              style={{
                borderRadius: '16px',
                border: '1px solid #e7e5e4',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '210px', backgroundColor: '#f5f5f4' }}>
                <img
                  src={
                    v.image_url ||
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={v.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {v.region && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(28,25,23,0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '20px',
                    }}
                  >
                    {v.region}
                  </span>
                )}
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '19px', fontWeight: '700', margin: '0 0 6px 0', color: '#1c1917' }}>
                  {v.name}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#78716c' }}>
                  {v.city ? `${v.city}, ` : ''}
                  {v.region || 'Ontario'}
                </p>

                {v.distance_km !== undefined && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#047857' }}>
                    {v.distance_km.toFixed(1)} km away
                  </p>
                )}

                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#57534e', flex: 1 }}>
                  Explore scenic indoor and outdoor celebration spaces.
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f5f5f4',
                    paddingTop: '12px',
                    fontSize: '12px',
                    color: '#78716c',
                  }}
                >
                  <span>{v.capacity ? `Up to ${v.capacity} guests` : 'Capacity on request'}</span>
                  <a
                    href={`/venues/${v.slug}`}
                    style={{ color: '#78350f', fontWeight: '700', textDecoration: 'none' }}
                  >
                    View Details &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}