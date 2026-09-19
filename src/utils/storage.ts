import type { AppEvent, AppSettings, BlynkConfig, SafeZone, Device, Language } from "../types";

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
  locationName: "QDU Bosh Korpus (Glavniy Korpus)",
  latitude: 42.4586,
  longitude: 59.6162,
  battery: 95,
  satellites: 12,
  status: "online",
  lastUpdate: new Date().toISOString(),
};

export const defaultZones: SafeZone[] = [
  {
    id: "zone-qdu-campus-safe",
    name: "Qoraqalpoq Davlat Universiteti Kampusi",
    north: 42.4598,
    south: 42.4558,
    east: 59.6205,
    west: 59.6142,
    active: true,
    createdAt: new Date().toISOString(),
    deviceInside: true,
  },
];

export const defaultBlynkConfig: BlynkConfig = {
  server: "https://blynk.cloud",
  token: "rM6RkddaE8V9CY-4Qe1zPv7iCvYnpcr4",
  templateId: "TMPL4KVCqWp-b",
  templateName: "safetrack",
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
  getDevice: (): Device => {
    const d = read<Device>(KEYS.device, defaultDevice);
    if (!d.locationName || d.locationName.includes("Nukus IT Park") || d.latitude === 42.4578) {
      const updated = {
        ...d,
        locationName: "QDU Bosh Korpus (Glavniy Korpus)",
        latitude: 42.4586,
        longitude: 59.6162,
      };
      write(KEYS.device, updated);
      return updated;
    }
    return d;
  },
  setDevice: (d: Device) => write(KEYS.device, d),

  getZones: (): SafeZone[] => {
    const z = read<SafeZone[]>(KEYS.zones, defaultZones);
    if (z.length === 0 || z.some(item => item.id.includes("itpark") || item.id === "zone-qdu-safe")) {
      write(KEYS.zones, defaultZones);
      return defaultZones;
    }
    return z;
  },
  setZones: (z: SafeZone[]) => write(KEYS.zones, z),

  getEvents: () => read<AppEvent[]>(KEYS.events, []),
  setEvents: (e: AppEvent[]) => write(KEYS.events, e),

  getBlynkConfig: (): BlynkConfig => {
    const c = read<BlynkConfig>(KEYS.blynkConfig, defaultBlynkConfig);
    if (!c.token || !c.templateId) {
      const updated = {
        ...c,
        token: c.token || "rM6RkddaE8V9CY-4Qe1zPv7iCvYnpcr4",
        templateId: c.templateId || "TMPL4KVCqWp-b",
        templateName: c.templateName || "safetrack",
      };
      write(KEYS.blynkConfig, updated);
      return updated;
    }
    return c;
  },
  setBlynkConfig: (c: BlynkConfig) => write(KEYS.blynkConfig, c),

  getSettings: () => read<AppSettings>(KEYS.settings, defaultSettings),
  setSettings: (s: AppSettings) => write(KEYS.settings, s),

  getLanguage: (): Language => read<AppSettings>(KEYS.settings, defaultSettings).language,
};
