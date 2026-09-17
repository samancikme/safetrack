import type { AppEvent, AppSettings, BlynkConfig, DangerZone, Device, Language } from "../types";

const KEYS = {
  device: "safetrack.device",
  zones: "safetrack.zones",
  events: "safetrack.events",
  blynkConfig: "safetrack.blynkConfig",
  settings: "safetrack.settings",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — silently ignore for demo purposes
  }
}

export const defaultDevice: Device = {
  id: "GPS-01",
  name: "GPS-01",
  latitude: 42.46,
  longitude: 59.61,
  battery: 87,
  satellites: 8,
  status: "online",
  lastUpdate: new Date().toISOString(),
};

export const defaultBlynkConfig: BlynkConfig = {
  server: "https://blynk.cloud",
  token: "",
  deviceId: "GPS-01",
  triggerPin: "V0",
  resetDelaySeconds: 8,
};

export const defaultSettings: AppSettings = {
  deviceName: "GPS-01",
  emergencyPhone: "+998 90 226 88 22",
  language: "uz",
  presentationMode: false,
};

export const storage = {
  getDevice: () => read<Device>(KEYS.device, defaultDevice),
  setDevice: (d: Device) => write(KEYS.device, d),

  getZones: () => read<DangerZone[]>(KEYS.zones, []),
  setZones: (z: DangerZone[]) => write(KEYS.zones, z),

  getEvents: () => read<AppEvent[]>(KEYS.events, []),
  setEvents: (e: AppEvent[]) => write(KEYS.events, e),

  getBlynkConfig: () => read<BlynkConfig>(KEYS.blynkConfig, defaultBlynkConfig),
  setBlynkConfig: (c: BlynkConfig) => write(KEYS.blynkConfig, c),

  getSettings: () => read<AppSettings>(KEYS.settings, defaultSettings),
  setSettings: (s: AppSettings) => write(KEYS.settings, s),

  getLanguage: (): Language => read<AppSettings>(KEYS.settings, defaultSettings).language,
};
