import { venueImage, venueLocation, venueName, venueSlug, venueType, type Venue } from '@/lib/venues'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'

export function VenueCard({ venue }: { venue: Venue }) {
  const name = venueName(venue)
  const type = venueType(venue)
  const location = venueLocation(venue)
  const imageSrc = venueImage(venue) || FALLBACK_IMAGE

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <a href={`/venues/${encodeURIComponent(venueSlug(venue))}`} className="block">
        <img
          src={imageSrc}
          alt={name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE
          }}
          className="aspect-[4/3] w-full object-cover bg-stone-100"
        />
        <div className="p-4">
          {type && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{type}</p>
          )}
          <h3 className="mt-2 font-serif text-2xl font-semibold text-foreground">{name}</h3>
          {location && <p className="mt-1 text-sm text-muted-foreground">{location}</p>}
          {venue.capacity != null && venue.capacity !== '' && (
            <p className="mt-3 text-sm text-muted-foreground">Up to {String(venue.capacity)} guests</p>
          )}
        </div>
      </a>
    </article>
  )
}