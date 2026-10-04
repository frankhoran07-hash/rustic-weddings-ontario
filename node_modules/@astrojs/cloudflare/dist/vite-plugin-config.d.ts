import type { PluginOption } from 'vite';
export interface CompileImageConfig {
    base: string;
    assetsPrefix: string | undefined;
    imageServiceEntrypoint: string;
    buildAssets: string;
    transformWithBinding: boolean;
}
export interface Config {
    sessionKVBindingName: string;
    compileImageConfig: CompileImageConfig | null;
    isPrerender: boolean;
    /**
     * True when the user has configured the Cloudflare cache provider.
     * Used by the request handler to default uncached responses to
     * `Cloudflare-CDN-Cache-Control: no-store`, so that opting in to the
     * cache provider never accidentally caches routes that don't use it.
     */
    cacheProviderEnabled: boolean;
}
export declare function createConfigPlugin(config: Omit<Config, 'isPrerender'>): PluginOption;
