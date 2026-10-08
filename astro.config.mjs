import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

export default defineConfig({
  site: 'https://rusticweddingsontario.ca',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    react(),
    sitemap({
      customPages: async () => {
        if (!supabaseUrl || !supabaseKey) return [];
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: venues } = await supabase.from('venues').select('slug');
          return (venues || []).map((v) => `https://rusticweddingsontario.ca/venues/${v.slug}`);
        } catch {
          return [];
        }
      },
    }),
  ],
});