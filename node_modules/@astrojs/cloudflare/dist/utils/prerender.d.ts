/**
 * Prerender utilities for Cloudflare adapter
 *
 * During the build process, Astro prerenders pages by making requests to internal endpoints
 * served by the Cloudflare worker running in workerd. These endpoints are:
 *
 * - `/__astro_static_paths`: Returns all static paths that need to be prerendered.
 *   The prerenderer calls this to discover which routes/pages need to be generated.
 *
 * - `/__astro_prerender`: Renders a specific page given its URL and route data.
 *   The prerenderer calls this for each path to generate the static HTML.
 *
 * These endpoints are only active during the prerender build phase and are not
 * available in production or development.
 */
import type { BaseApp } from 'astro/app';
/**
 * Replicates core's `BuildErrorHandler` semantics on the worker app during
 * the prerender phase. The production app converts render errors into a
 * rendered 500 error page, which makes a crash indistinguishable from a page
 * that intentionally returns an error status. During prerendering, a render
 * error must instead propagate as a throw so `handlePrerenderRequest` can
 * surface it to the build process, while intentional non-2xx responses
 * (e.g. a custom 404 page) still render through the default error handler.
 */
export declare function installPrerenderErrorPropagation(app: BaseApp): void;
/**
 * Checks if the request is for the static paths prerender endpoint.
 * This endpoint returns all paths that need to be prerendered.
 */
export declare function isStaticPathsRequest(request: Request): boolean;
/**
 * Checks if the request is for the prerender endpoint.
 * This endpoint renders a specific page during the prerender phase.
 */
export declare function isPrerenderRequest(request: Request): boolean;
/**
 * Handles the static paths request, returning all paths that need prerendering.
 */
export declare function handleStaticPathsRequest(app: BaseApp): Promise<Response>;
/**
 * Handles a prerender request, rendering the specified page.
 *
 * The response body is fully buffered before being returned so that streaming
 * errors (e.g. a component throwing mid-render) are caught inside workerd and
 * surfaced as a 500 response.  Without buffering, the HTTP layer commits
 * status 200 before the stream completes, and a mid-stream error silently
 * truncates the HTML output.
 */
export declare function handlePrerenderRequest(app: BaseApp, request: Request): Promise<Response>;
export declare function isStaticImagesRequest(request: Request): boolean;
export declare function isImageTransformRequest(request: Request): boolean;
/** Serializes the global staticImages map collected in workerd back to the Node-side build. */
export declare function handleStaticImagesRequest(): Response;
interface ImageTransformOptions {
    /** The Cloudflare IMAGES binding for image transformation. */
    images?: ImagesBinding;
    /** The Cloudflare ASSETS fetcher for loading local images. */
    assets?: Fetcher;
}
/**
 * Transforms a single image with the Cloudflare IMAGES binding and streams the raw
 * bytes back to the Node-side build.
 *
 * The transform parameters arrive as query parameters on the request URL, in the same
 * shape `/_image` uses. Handling one image per request keeps peak memory proportional to
 * a single variant rather than to the whole image set, since neither the request body
 * nor the response body is ever buffered in the isolate.
 *
 * Local originals are uploaded as the request body: at this point in the build they live
 * in Astro's intermediate output, not in the client directory the ASSETS binding serves,
 * so the worker cannot fetch them itself. Remote images have no body and are resolved
 * here, exactly as the runtime `image-transform-endpoint` does.
 */
export declare function handleImageTransformRequest(request: Request, { images, assets }: ImageTransformOptions): Promise<Response>;
export {};
