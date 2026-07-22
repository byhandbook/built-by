/** Default CDN base when script origin cannot be detected. */
export const DEFAULT_CDN_BASE = "https://builtby.byhandbook.com/v1";

/** Optional registry ping endpoint (Cloudflare Worker). */
export const DEFAULT_REGISTRY_URL = "https://builtby.byhandbook.com/r";

export const DEFAULT_MARK_SIZE = 24;
export const DEFAULT_TEXT_SIZE = 16;

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

/** Parse a pixel size from a data attribute; fall back if invalid. */
export function parsePixelSize(
  value: string | null | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

/** True when animate / data-animate is present (empty, "1", or "true"). */
export function isAnimateEnabled(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "" || normalized === "1" || normalized === "true";
}
