function cfHeadersPatternToRegex(pattern) {
  let regexStr = "";
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "*") {
      regexStr += ".*";
      i++;
    } else if (ch === ":" && /[A-Za-z]/.test(pattern[i + 1] ?? "")) {
      i++;
      while (i < pattern.length && /\w/.test(pattern[i])) i++;
      regexStr += "[^/]+";
    } else {
      regexStr += ch.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
      i++;
    }
  }
  return new RegExp(`^${regexStr}$`);
}
function headersFileHasCacheControlForPath(content, path) {
  let matchesCurrentSection = false;
  for (const rawLine of content.split("\n")) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const isSectionHeader = !/^\s/.test(rawLine);
    if (isSectionHeader) {
      const pathOnly = trimmed.replace(/^https?:\/\/[^/]+/, "");
      try {
        matchesCurrentSection = cfHeadersPatternToRegex(pathOnly).test(path);
      } catch {
        matchesCurrentSection = false;
      }
    } else if (matchesCurrentSection && // Either `Cache-Control: value` (set) or `! Cache-Control` (detach).
    /^\s+(?:!\s+cache-control\s*$|cache-control\s*:)/i.test(rawLine)) {
      return true;
    }
  }
  return false;
}
async function buildAssetsHeadersContent(opts, readFile) {
  const { assetsDir, basePrefix, headersPath } = opts;
  const assetsPattern = `${basePrefix}/${assetsDir}/*`;
  const probePath = `${basePrefix}/${assetsDir}/probe`;
  let existingHeaders = "";
  try {
    existingHeaders = await readFile(headersPath);
  } catch {
  }
  if (headersFileHasCacheControlForPath(existingHeaders, probePath)) {
    return null;
  }
  const cacheBlock = `${assetsPattern}
  Cache-Control: public, max-age=31536000, immutable
`;
  const normalizedExisting = existingHeaders && !existingHeaders.endsWith("\n") ? existingHeaders + "\n" : existingHeaders;
  const content = normalizedExisting ? `${cacheBlock}
${normalizedExisting}` : cacheBlock;
  return { content, assetsPattern };
}
export {
  buildAssetsHeadersContent,
  headersFileHasCacheControlForPath
};
