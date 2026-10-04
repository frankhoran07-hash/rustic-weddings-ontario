import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { unstable_getVarsForDev, unstable_readConfig } from "wrangler";
const DEFAULT_WRANGLER_CONFIG_FILES = ["wrangler.toml", "wrangler.json", "wrangler.jsonc"];
function resolveWranglerConfigPath(root, configPath) {
  if (configPath) {
    return fileURLToPath(new URL(configPath, root));
  }
  for (const file of DEFAULT_WRANGLER_CONFIG_FILES) {
    const candidate = new URL(`./${file}`, root);
    if (existsSync(candidate)) {
      return fileURLToPath(candidate);
    }
  }
  return void 0;
}
function loadWranglerEnv(root, configPath, logger) {
  const resolvedConfigPath = resolveWranglerConfigPath(root, configPath);
  if (!resolvedConfigPath) {
    return;
  }
  try {
    const env = process.env.CLOUDFLARE_ENV;
    const config = unstable_readConfig({ config: resolvedConfigPath, env }, { hideWarnings: true });
    const vars = unstable_getVarsForDev(
      config.configPath,
      void 0,
      config.vars,
      env,
      true,
      config.secrets
    );
    for (const [key, binding] of Object.entries(vars)) {
      const value = binding.value;
      if (value === void 0 || value === null) {
        continue;
      }
      process.env[key] = typeof value === "string" ? value : JSON.stringify(value);
    }
  } catch (e) {
    logger.warn(
      `Unable to read wrangler config, variables defined in it will not be available to astro:env at build time.`
    );
    logger.debug(String(e));
  }
}
export {
  loadWranglerEnv
};
