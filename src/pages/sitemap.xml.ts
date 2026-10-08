import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl =
    import.meta.env.PUBLIC_SUPABASE_URL ||
    env.PUBLIC_SUPABASE_URL ||
    process?.env?.PUBLIC_SUPABASE_URL ||
    '';
  const supabaseKey =
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
    env.PUBLIC_SUPABASE_ANON_KEY ||
    process?.env?.PUBLIC_SUPABASE_ANON_KEY ||
    '';

  const baseUrl = 'https://rusticweddingsontario.ca';
  const urls: string[] = [baseUrl];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: venues } = await supabase.from('venues').select('slug');
      if (venues) {
        venues.forEach((v) => {
          if (v.slug) urls.push(`${baseUrl}/venues/${v.slug}`);
        });
      }
    } catch (e) {
      // Continue with homepage if db query fails
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === baseUrl ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};