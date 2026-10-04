import React from 'react';

export interface Venue {
  id: string;
  name: string;
  slug: string;
  city?: string;
  region?: string;
  image_url?: string;
  capacity?: number | string;
  starting_price?: number | string;
  distance_km?: number;
}

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <img
          src={venue.image_url || fallbackImage}
          alt={venue.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {venue.region && (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {venue.region}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold tracking-tight text-stone-900 transition group-hover:text-amber-900">
          {venue.name}
        </h3>

        <p className="mt-1 text-sm font-medium text-stone-500">
          {venue.city ? `${venue.city}, ` : ''}
          {venue.region || 'Ontario'}
        </p>

        {venue.distance_km !== undefined && (
          <p className="mt-2 text-xs font-semibold text-emerald-700">
            {venue.distance_km.toFixed(1)} km away
          </p>
        )}

        <p className="mt-2 text-sm text-stone-600">
          Explore scenic rustic indoor and outdoor celebration spaces.
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 text-xs text-stone-500">
          <span>
            {venue.capacity ? `Up to ${venue.capacity} guests` : 'Capacity on request'}
          </span>
          {venue.starting_price && (
            <span className="font-semibold text-stone-800">
              From ${venue.starting_price}
            </span>
          )}
        </div>

        <a
          href={`/venues/${venue.slug}`}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-900/10 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-900 hover:text-white"
        >
          View Details &rarr;
        </a>
      </div>
    </div>
  );
}