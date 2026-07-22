/** Default CDN base when script origin cannot be detected. */
export const DEFAULT_CDN_BASE = "https://builtby.byhandbook.com/v1";

/** Optional registry ping endpoint (Cloudflare Worker). */
export const DEFAULT_REGISTRY_URL = "https://builtby.byhandbook.com/r";

export type CreditTheme = "light" | "dark";

export interface PingPayload {
  host: string;
  project?: string;
  theme: CreditTheme;
  version: string;
}

export function resolveScriptBase(): string {
  const script = document.currentScript;
  if (script instanceof HTMLScriptElement && script.src) {
    return script.src.replace(/\/[^/]+$/, "/");
  }
  return `${DEFAULT_CDN_BASE}/`;
}

export function normalizeTheme(value: string | null | undefined): CreditTheme {
  return value === "light" ? "light" : "dark";
}
