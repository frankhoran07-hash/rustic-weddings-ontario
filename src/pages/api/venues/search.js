import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export async function GET({ request, locals }) {
  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat'));
  const lng = parseFloat(url.searchParams.get('lng'));
  const radius = parseFloat(url.searchParams.get('radius')) || 75;
  const region = url.searchParams.get('region');

  const env = locals?.runtime?.env || {};
  const supabaseUrl = 
    import.meta.env.PUBLIC_SUPABASE_URL || 
    process.env.PUBLIC_SUPABASE_URL || 
    env.PUBLIC_SUPABASE_URL;

  const supabaseKey = 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 
    process.env.PUBLIC_SUPABASE_ANON_KEY || 
    env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase credentials missing', venues: [] }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from('venues')
    .select('id, name, slug, city, region, image_url, capacity, starting_price, latitude, longitude')
    .order('name', { ascending: true });

  const { data: venues, error } = await query;

  if (error || !venues) {
    return new Response(JSON.stringify({ error: error?.message || 'Query failed', venues: [] }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  let result = venues;

  // If region specified without lat/lng coordinates
  if (region && region !== 'All Regions' && (isNaN(lat) || isNaN(lng))) {
    const regTarget = region.trim().toLowerCase();
    result = result.filter(v => {
      const r = (v.region || '').trim().toLowerCase();
      return r === regTarget || r.includes(regTarget) || regTarget.includes(r);
    });
    return new Response(JSON.stringify({ venues: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // If no lat/lng provided, return all venues
  if (isNaN(lat) || isNaN(lng)) {
    return new Response(JSON.stringify({ venues: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Haversine formula calculation for proximity
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;

  result = result
    .map((venue) => {
      const vLat = parseFloat(venue.latitude);
      const vLng = parseFloat(venue.longitude);
      if (isNaN(vLat) || isNaN(vLng)) return null;

      const dLat = toRad(vLat - lat);
      const dLon = toRad(vLng - lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat)) * Math.cos(toRad(vLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return {
        ...venue,
        distance_km: distance,
      };
    })
    .filter((venue) => venue !== null && venue.distance_km <= radius)
    .sort((a, b) => a.distance_km - b.distance_km);

  return new Response(JSON.stringify({ venues: result }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}