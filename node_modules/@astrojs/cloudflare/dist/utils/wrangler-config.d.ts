import type { AstroIntegrationLogger } from 'astro';
/**
 * Resolves the effective environment variables for the project's Wrangler config
 * — `vars` merged with any `.dev.vars`/`.env` overrides, exactly as `wrangler dev`
 * resolves them — and assigns them to `process.env`.
 *
 * Astro's `astro:env` inlines public variables at build time using Vite's
 * `loadEnv()`, which only reads from `process.env` and `.env` files. Cloudflare
 * makes these variables available at runtime (through `cloudflare:workers`), but
 * they are invisible to the build-time step, so direct imports resolve to
 * `undefined`. Surfacing them on `process.env` here lets `astro:env` pick them up
 * during the build.
 */
export declare function loadWranglerEnv(root: URL, configPath: string | undefined, logger: AstroIntegrationLogger): void;
