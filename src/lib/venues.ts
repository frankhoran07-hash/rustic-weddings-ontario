export type Venue = {
  id?: string | number
  slug?: string | null
  name?: string | null
  title?: string | null
  region?: string | null
  type?: string | null
  venue_type?: string | null
  city?: string | null
  location?: string | null
  description?: string | null
  image_url?: string | null
  image?: string | null
  cover_image?: string | null
  photo_url?: string | null
  capacity?: number | string | null
  [key: string]: unknown
}

export const REGIONS = [
  'Ottawa Valley',
  'Prince Edward County',
  'Niagara',
  'Muskoka',
  'Grey-Bruce',
  'Kawarthas',
  'Southwestern Ontario',
] as const

export const VENUE_TYPES = ['Barn', 'Farm', 'Greenhouse'] as const

export function venueName(venue: Venue) {
  return String(venue.name ?? venue.title ?? 'Untitled venue')
}

export function venueSlug(venue: Venue) {
  return String(venue.slug ?? venue.id ?? venueName(venue))
}

export function venueType(venue: Venue) {
  return String(venue.type ?? venue.venue_type ?? '')
}

export function venueImage(venue: Venue) {
  return String(
    venue.image_url ?? venue.image ?? venue.cover_image ?? venue.photo_url ?? '/images/hero.png',
  )
}

export function venueLocation(venue: Venue) {
  return [venue.city, venue.location, venue.region].filter(Boolean).join(' · ')
}

export function regionsFromVenues(venues: Venue[]) {
  const names = venues
    .map((venue) => venue.region)
    .filter((region): region is string => Boolean(region))
  return [...new Set(names)].sort((a, b) => a.localeCompare(b))
}

export function filterVenues(
  venues: Venue[],
  { q, region, type }: { q?: string; region?: string; type?: string },
) {
  const query = q?.trim().toLowerCase()

  return venues.filter((venue) => {
    const haystack = [venueName(venue), venue.description, venue.city, venue.location, venue.region]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesQuery = !query || haystack.includes(query)
    const matchesRegion =
      !region ||
      [venue.region, venue.location, venue.city].some(
        (value) => String(value ?? '').toLowerCase() === region.toLowerCase(),
      ) ||
      haystack.includes(region.toLowerCase())
    const matchesType =
      !type ||
      venueType(venue).toLowerCase() === type.toLowerCase() ||
      venueType(venue).toLowerCase().includes(type.toLowerCase())

    return matchesQuery && matchesRegion && matchesType
  })
}
