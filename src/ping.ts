import { DEFAULT_REGISTRY_URL, type PingPayload } from "./config";

const PING_SESSION_KEY = "hb-builtby-ping";
let pingSentThisPage = false;

/** Fire once per page load (sessionStorage prevents repeat on refresh). */
export function sendRegistryPing(payload: PingPayload, registryUrl = DEFAULT_REGISTRY_URL): void {
  if (pingSentThisPage) return;

  try {
    if (sessionStorage.getItem(PING_SESSION_KEY) === "1") {
      pingSentThisPage = true;
      return;
    }
    sessionStorage.setItem(PING_SESSION_KEY, "1");
  } catch {
    /* sessionStorage unavailable */
  }

  pingSentThisPage = true;

  const params = new URLSearchParams({
    host: payload.host,
    theme: payload.theme,
    v: payload.version,
  });
  if (payload.project) params.set("project", payload.project);

  const url = `${registryUrl}?${params.toString()}`;

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(url);
    return;
  }

  fetch(url, { mode: "no-cors", keepalive: true }).catch(() => {
    /* fire-and-forget */
  });
}
