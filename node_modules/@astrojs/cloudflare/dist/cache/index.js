function cacheCloudflare() {
  return {
    name: "cloudflare",
    entrypoint: "@astrojs/cloudflare/cache/provider"
  };
}
export {
  cacheCloudflare
};
