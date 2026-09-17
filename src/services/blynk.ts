import type { BlynkConfig } from "../types";

/**
 * Thin wrapper around the real Blynk Cloud HTTP API.
 * https://<server>/external/api/... (Legacy HTTP(S) API using an auth token)
 *
 * NOTE: for this demo/prototype the token is stored in localStorage and the
 * request is made directly from the browser. This is NOT secure for a real
 * production deployment (see Settings page warning) — a production build
 * should proxy these calls through a backend that holds the token.
 */

function buildUrl(config: BlynkConfig, path: string, params: Record<string, string>): string {
  const base = config.server.replace(/\/+$/, "");
  const url = new URL(`${base}/external/api/${path}`);
  url.searchParams.set("token", config.token);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

export class BlynkError extends Error {}

export async function setVirtualPin(
  config: BlynkConfig,
  pin: string,
  value: number | string
): Promise<void> {
  if (!config.token) {
    throw new BlynkError("Blynk token is not configured");
  }
  const url = buildUrl(config, "update", { pin, value: String(value) });
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new BlynkError(`Blynk update failed with status ${res.status}`);
  }
}

export async function getVirtualPin(config: BlynkConfig, pin: string): Promise<string> {
  if (!config.token) {
    throw new BlynkError("Blynk token is not configured");
  }
  const url = buildUrl(config, "get", { pin });
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new BlynkError(`Blynk get failed with status ${res.status}`);
  }
  const text = await res.text();
  // Blynk legacy API returns a JSON array like ["1"] for GET requests
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? String(parsed[0]) : String(parsed);
  } catch {
    return text;
  }
}

export async function testBlynkConnection(config: BlynkConfig): Promise<boolean> {
  try {
    await getVirtualPin(config, config.triggerPin || "V0");
    return true;
  } catch {
    return false;
  }
}
