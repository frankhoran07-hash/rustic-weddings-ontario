/**
 * Returns true if the given `_headers` content already declares (or detaches)
 * a `Cache-Control` directive on any rule whose URL pattern matches `path`.
 *
 * Used to avoid emitting a second `Cache-Control` rule for hashed assets when
 * the user already has one — Cloudflare merges duplicate header values across
 * matching rules with a comma, which produces contradictory cache directives.
 */
export declare function headersFileHasCacheControlForPath(content: string, path: string): boolean;
/**
 * Computes the content to write to `_headers` to inject an immutable
 * Cache-Control rule for the hashed assets directory.
 *
 * Returns `null` when injection should be skipped because the existing
 * `_headers` already declares `Cache-Control` on a rule matching the assets
 * path — Cloudflare merges duplicate header values with a comma, which would
 * produce contradictory directives.
 */
export declare function buildAssetsHeadersContent(opts: {
    assetsDir: string;
    basePrefix: string;
    headersPath: URL;
}, readFile: (path: URL) => Promise<string>): Promise<{
    content: string;
    assetsPattern: string;
} | null>;
