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
  locationName: "Nukus IT Park",
  latitude: 42.4651,
  longitude: 59.6104,
  battery: 92,
  satellites: 10,
  status: "online",
  lastUpdate: new Date().toISOString(),
};

export const defaultZones: SafeZone[] = [
  {
    id: "zone-nukus-itpark-safe",
    name: "Nukus IT Park Xavfsiz Hududi",
    north: 42.4665,
    south: 42.4635,
    east: 59.6125,
    west: 59.6085,
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
    if (!d.locationName || (d.latitude === 42.46 && d.longitude === 59.61)) {
      return {
        ...d,
        locationName: "Nukus IT Park",
        latitude: 42.4651,
        longitude: 59.6104,
      };
    }
    return d;
  },
  setDevice: (d: Device) => write(KEYS.device, d),

  getZones: (): SafeZone[] => {
    const z = read<SafeZone[]>(KEYS.zones, defaultZones);
    return z.length > 0 ? z : defaultZones;
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
