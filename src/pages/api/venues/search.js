import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat') || '0');
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const radius = parseFloat(url.searchParams.get('radius') || '100');

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Database environment variables not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.rpc('get_venues_near', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radius
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ venues: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}