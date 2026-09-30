import { VenueCard } from '@/components/venue-card'
import { REGIONS, filterVenues, regionsFromVenues, venueName, type Venue } from '@/lib/venues'

type FeaturedVenuesProps = {
  venues: Venue[]
  q?: string
  region?: string
  type?: string
}

export function FeaturedVenues({ venues, q, region, type }: FeaturedVenuesProps) {
  const isFiltered = Boolean(q || region || type)
  const results = filterVenues(venues, { q, region, type })
  const regions = regionsFromVenues(venues)
  const regionLinks = regions.length > 0 ? regions : [...REGIONS]

  return (
    <section id="featured" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {isFiltered ? 'Search results' : 'Hand-picked this season'}
            </p>
            <h2 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Featured Venues
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {isFiltered
                ? `${results.length} ${results.length === 1 ? 'venue matches' : 'venues match'} your search.`
                : 'Barns, farms and greenhouses our couples love — each one visited and vetted by our team.'}
            </p>
          </div>
          {isFiltered && (
            <a href="/#featured" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Clear filters
            </a>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {results.map((venue) => (
              <VenueCard key={String(venue.id ?? venue.slug ?? venueName(venue))} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <h3 className="font-serif text-2xl font-semibold">No featured venues match just yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try a different region or venue type, or clear your filters to see every featured venue.
            </p>
          </div>
        )}

        <div id="regions" className="mt-16 scroll-mt-24">
          <h3 className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Browse by region
          </h3>
          <ul className="mt-5 flex flex-wrap justify-center gap-3">
            {regionLinks.map((name) => (
              <li key={name}>
                <a
                  href={`/?region=${encodeURIComponent(name)}#featured`}
                  aria-current={region === name ? 'true' : undefined}
                  className="inline-flex rounded-full border border-border bg-card px-5 py-2.5 font-serif text-lg font-medium text-foreground transition-colors hover:border-primary hover:text-primary aria-[current=true]:border-primary aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
