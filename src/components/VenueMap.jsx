import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function VenueMap({ venues, center = [44.5, -78.5], zoom = 7 }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView(center, zoom);
    }

    // Clear old markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add venue pins
    venues.forEach((v) => {
      if (v.latitude && v.longitude) {
        const marker = L.marker([v.latitude, v.longitude]).addTo(mapInstance.current);
        marker.bindPopup(`
          <div style="font-size: 14px;">
            <strong>${v.name}</strong><br/>
            <span>${v.city || v.region}</span><br/>
            ${v.distance_km ? `<em>${v.distance_km.toFixed(1)} km away</em><br/>` : ''}
            <a href="/venues/${v.slug}" style="color: #8b5a2b; font-weight: bold; display: inline-block; margin-top: 4px;">View Venue &rarr;</a>
          </div>
        `);
      }
    });
  }, [venues, center, zoom]);

  return <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '12px' }} />;
}