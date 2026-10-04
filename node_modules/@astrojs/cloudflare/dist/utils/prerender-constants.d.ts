/**
 * Constants for prerender endpoints used by Cloudflare adapter
 */
/** Internal endpoint for fetching all static paths during prerendering */
export declare const STATIC_PATHS_ENDPOINT = "/__astro_static_paths";
/** Internal endpoint for rendering a specific page during prerendering */
export declare const PRERENDER_ENDPOINT = "/__astro_prerender";
/** Internal endpoint for fetching static images collected in workerd during `compile` builds */
export declare const STATIC_IMAGES_ENDPOINT = "/__astro_static_images";
/**
 * Internal endpoint for transforming a single image with the IMAGES binding during
 * `cloudflare-binding` builds. Takes the same query parameters as `/_image` and streams
 * the optimized bytes back, one image per request.
 */
export declare const IMAGE_TRANSFORM_ENDPOINT = "/__astro_image_transform";
