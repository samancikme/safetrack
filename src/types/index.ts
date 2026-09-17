export type DeviceStatus = "online" | "offline" | "danger";

export interface Device {
  id: string;
  name: string;
  locationName?: string;
  latitude: number;
  longitude: number;
  battery: number;
  satellites: number;
  status: DeviceStatus;
  lastUpdate: string; // ISO timestamp
}

export interface DangerZone {
  id: string;
  name: string;
  north: number;
  south: number;
  east: number;
  west: number;
  active: boolean;
  createdAt: string;
  /** whether the device was inside this zone on the last check (for edge-triggering) */
  deviceInside: boolean;
}

export type EventType = "danger" | "gps" | "blynk" | "call" | "sms" | "system";

export interface AppEvent {
  id: string;
  type: EventType;
  message: string;
  zoneName?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string; // ISO
}

export interface BlynkConfig {
  server: string;
  token: string;
  deviceId: string;
  triggerPin: string;
  resetDelaySeconds: number;
}

export type Language = "uz" | "qq";

export interface AppSettings {
  deviceName: string;
  emergencyPhone: string;
  language: Language;
  presentationMode: boolean;
}

export type BlynkConnectionState = "unknown" | "checking" | "connected" | "failed";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RectBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
