import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppEvent,
  AppSettings,
  BlynkConfig,
  BlynkConnectionState,
  DangerZone,
  Device,
  EventType,
  Language,
  LatLng,
  RectBounds,
} from "../types";
import { storage } from "../utils/storage";
import { setVirtualPin, testBlynkConnection } from "../services/blynk";
import { translate } from "../data/translations";
import { useGeofence } from "../hooks/useGeofence";

type CallSmsStatus = "idle" | "sending" | "sent" | "failed";

interface ActiveAlert {
  zone: DangerZone;
  point: LatLng;
  timestamp: string;
}

interface AppStoreValue {
  device: Device;
  zones: DangerZone[];
  events: AppEvent[];
  blynkConfig: BlynkConfig;
  settings: AppSettings;
  connectionState: BlynkConnectionState;
  pickingLocation: boolean;
  drawingZone: boolean;
  pendingZoneBounds: RectBounds | null;
  activeAlert: ActiveAlert | null;
  callStatus: CallSmsStatus;
  smsStatus: CallSmsStatus;
  blynkV0Value: 0 | 1;
  blynkError: string | null;

  t: (key: string, vars?: Record<string, string>) => string;
  setLanguage: (lang: Language) => void;
  togglePresentationMode: () => void;

  startPickingLocation: () => void;
  cancelPickingLocation: () => void;
  handleMapClick: (point: LatLng) => void;

  startDrawingZone: () => void;
  cancelDrawingZone: () => void;
  handleZoneDrawn: (bounds: RectBounds) => void;
  confirmCreateZone: (name: string) => void;
  cancelCreateZone: () => void;
  deleteZone: (id: string) => void;
  toggleZoneActive: (id: string) => void;

  updateBlynkConfig: (config: BlynkConfig) => void;
  updateSettings: (settings: AppSettings) => void;
  testConnection: () => Promise<void>;

  testDangerButton: () => void;
  testCallButton: () => void;
  resetV0Manually: () => void;
  dismissAlert: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<Device>(() => storage.getDevice());
  const [zones, setZones] = useState<DangerZone[]>(() => storage.getZones());
  const [events, setEvents] = useState<AppEvent[]>(() => storage.getEvents());
  const [blynkConfig, setBlynkConfig] = useState<BlynkConfig>(() => storage.getBlynkConfig());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [connectionState, setConnectionState] = useState<BlynkConnectionState>("unknown");

  const [pickingLocation, setPickingLocation] = useState(false);
  const [drawingZone, setDrawingZone] = useState(false);
  const [pendingZoneBounds, setPendingZoneBounds] = useState<RectBounds | null>(null);
  const [activeAlert, setActiveAlert] = useState<ActiveAlert | null>(null);
  const [callStatus, setCallStatus] = useState<CallSmsStatus>("idle");
  const [smsStatus, setSmsStatus] = useState<CallSmsStatus>("idle");
  const [blynkV0Value, setBlynkV0Value] = useState<0 | 1>(0);
  const [blynkError, setBlynkError] = useState<string | null>(null);

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => translate(settings.language, key, vars),
    [settings.language]
  );

  const persistZones = useCallback((next: DangerZone[]) => {
    setZones(next);
    storage.setZones(next);
  }, []);

  const persistDevice = useCallback((next: Device) => {
    setDevice(next);
    storage.setDevice(next);
  }, []);

  const pushEvent = useCallback(
    (type: EventType, message: string, extra?: Partial<AppEvent>) => {
      setEvents((prev) => {
        const next = [
          { id: uid("evt"), type, message, timestamp: new Date().toISOString(), ...extra },
          ...prev,
        ].slice(0, 200);
        storage.setEvents(next);
        return next;
      });
    },
    []
  );

  const setLanguage = useCallback((lang: Language) => {
    setSettings((prev) => {
      const next = { ...prev, language: lang };
      storage.setSettings(next);
      return next;
    });
  }, []);

  const togglePresentationMode = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, presentationMode: !prev.presentationMode };
      storage.setSettings(next);
      return next;
    });
  }, []);

  const startPickingLocation = useCallback(() => {
    setDrawingZone(false);
    setPickingLocation(true);
  }, []);
  const cancelPickingLocation = useCallback(() => setPickingLocation(false), []);

  const handleMapClick = useCallback(
    (point: LatLng) => {
      if (pickingLocation) {
        const next: Device = {
          ...device,
          latitude: Number(point.lat.toFixed(6)),
          longitude: Number(point.lng.toFixed(6)),
          lastUpdate: new Date().toISOString(),
        };
        persistDevice(next);
        pushEvent("gps", t("setDeviceLocationBtn"));
        setPickingLocation(false);
      }
    },
    [pickingLocation, device, persistDevice, pushEvent, t]
  );

  const startDrawingZone = useCallback(() => {
    setPickingLocation(false);
    setDrawingZone(true);
  }, []);
  const cancelDrawingZone = useCallback(() => setDrawingZone(false), []);

  const handleZoneDrawn = useCallback((bounds: RectBounds) => {
    setDrawingZone(false);
    setPendingZoneBounds(bounds);
  }, []);

  const confirmCreateZone = useCallback(
    (name: string) => {
      if (!pendingZoneBounds) return;
      const zone: DangerZone = {
        id: uid("zone"),
        name: name.trim() || t("zoneNameDefault"),
        ...pendingZoneBounds,
        active: true,
        createdAt: new Date().toISOString(),
        deviceInside: false,
      };
      persistZones([zone, ...zones]);
      pushEvent("system", `${t("createZoneBtn")}: ${zone.name}`);
      setPendingZoneBounds(null);
    },
    [pendingZoneBounds, zones, persistZones, pushEvent, t]
  );

  const cancelCreateZone = useCallback(() => setPendingZoneBounds(null), []);

  const deleteZone = useCallback(
    (id: string) => {
      persistZones(zones.filter((z) => z.id !== id));
    },
    [zones, persistZones]
  );

  const toggleZoneActive = useCallback(
    (id: string) => {
      persistZones(zones.map((z) => (z.id === id ? { ...z, active: !z.active } : z)));
    },
    [zones, persistZones]
  );

  const updateBlynkConfig = useCallback((config: BlynkConfig) => {
    setBlynkConfig(config);
    storage.setBlynkConfig(config);
  }, []);

  const updateSettings = useCallback((next: AppSettings) => {
    setSettings(next);
    storage.setSettings(next);
  }, []);

  const testConnection = useCallback(async () => {
    setConnectionState("checking");
    const ok = await testBlynkConnection(blynkConfig);
    setConnectionState(ok ? "connected" : "failed");
  }, [blynkConfig]);

  const scheduleV0Reset = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(async () => {
      try {
        await setVirtualPin(blynkConfig, blynkConfig.triggerPin, 0);
        setBlynkV0Value(0);
        pushEvent("blynk", `${blynkConfig.triggerPin} = 0`);
      } catch {
        // reset failure is non-critical for the demo; leave value as-is
      }
    }, Math.max(1, blynkConfig.resetDelaySeconds) * 1000);
  }, [blynkConfig, pushEvent]);

  const runCallSmsSequence = useCallback(
    (coordsText: string) => {
      setCallStatus("sending");
      setSmsStatus("sending");
      window.setTimeout(() => {
        setCallStatus("sent");
        pushEvent("call", t("callViaHardware"));
      }, 700);
      window.setTimeout(() => {
        setSmsStatus("sent");
        pushEvent("sms", t("smsSentDone"));
      }, 1100);
      void coordsText;
    },
    [pushEvent, t]
  );

  const triggerDangerFlow = useCallback(
    async (zone: DangerZone, point: LatLng) => {
      const now = new Date().toISOString();
      persistDevice({ ...device, status: "danger", lastUpdate: now });
      setActiveAlert({ zone, point, timestamp: now });
      pushEvent("danger", `${device.name} ${t("dangerDetectedBody")}`, {
        zoneName: zone.name,
        latitude: point.lat,
        longitude: point.lng,
      });

      try {
        await setVirtualPin(blynkConfig, blynkConfig.triggerPin, 1);
        setBlynkV0Value(1);
        setBlynkError(null);
        pushEvent("blynk", `${blynkConfig.triggerPin} = 1`);
        runCallSmsSequence(`${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`);
        scheduleV0Reset();
      } catch (err) {
        setBlynkError(err instanceof Error ? err.message : "Blynk error");
        pushEvent("blynk", t("settingsConnectionFail"));
      }
    },
    [device, blynkConfig, pushEvent, t, runCallSmsSequence, scheduleV0Reset, persistDevice]
  );

  const handleGeofenceTransitions = useCallback(
    (
      transitions: { zone: DangerZone; entered: boolean }[],
      updatedZones: DangerZone[]
    ) => {
      persistZones(updatedZones);

      for (const transition of transitions) {
        if (transition.entered) {
          void triggerDangerFlow(transition.zone, {
            lat: device.latitude,
            lng: device.longitude,
          });
        } else {
          pushEvent("gps", `${transition.zone.name}: ${t("deviceOutZone")}`);
        }
      }

      const stillInAny = updatedZones.some((z) => z.deviceInside);
      if (!stillInAny && device.status === "danger") {
        persistDevice({ ...device, status: "online" });
      }
    },
    [persistZones, triggerDangerFlow, device, pushEvent, t, persistDevice]
  );

  useGeofence(
    { lat: device.latitude, lng: device.longitude },
    zones,
    handleGeofenceTransitions
  );

  const testDangerButton = useCallback(() => {
    const point = { lat: device.latitude, lng: device.longitude };
    const containingZone = zones.find(
      (z) =>
        z.active &&
        point.lat >= z.south &&
        point.lat <= z.north &&
        point.lng >= z.west &&
        point.lng <= z.east
    );
    if (containingZone) {
      void triggerDangerFlow(containingZone, point);
    } else {
      pushEvent("system", t("deviceOutZone"));
    }
  }, [device, zones, triggerDangerFlow, pushEvent, t]);

  const testCallButton = useCallback(async () => {
    try {
      await setVirtualPin(blynkConfig, blynkConfig.triggerPin, 1);
      setBlynkV0Value(1);
      setBlynkError(null);
      pushEvent("blynk", `${blynkConfig.triggerPin} = 1 (test)`);
      runCallSmsSequence("test");
      scheduleV0Reset();
    } catch (err) {
      setBlynkError(err instanceof Error ? err.message : "Blynk error");
      pushEvent("blynk", t("settingsConnectionFail"));
    }
  }, [blynkConfig, pushEvent, runCallSmsSequence, scheduleV0Reset, t]);

  const resetV0Manually = useCallback(async () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    try {
      await setVirtualPin(blynkConfig, blynkConfig.triggerPin, 0);
      setBlynkV0Value(0);
      pushEvent("blynk", `${blynkConfig.triggerPin} = 0 (manual)`);
    } catch (err) {
      setBlynkError(err instanceof Error ? err.message : "Blynk error");
    }
  }, [blynkConfig, pushEvent]);

  const dismissAlert = useCallback(() => {
    setActiveAlert(null);
    setCallStatus("idle");
    setSmsStatus("idle");
  }, []);

  const value: AppStoreValue = useMemo(
    () => ({
      device,
      zones,
      events,
      blynkConfig,
      settings,
      connectionState,
      pickingLocation,
      drawingZone,
      pendingZoneBounds,
      activeAlert,
      callStatus,
      smsStatus,
      blynkV0Value,
      blynkError,
      t,
      setLanguage,
      togglePresentationMode,
      startPickingLocation,
      cancelPickingLocation,
      handleMapClick,
      startDrawingZone,
      cancelDrawingZone,
      handleZoneDrawn,
      confirmCreateZone,
      cancelCreateZone,
      deleteZone,
      toggleZoneActive,
      updateBlynkConfig,
      updateSettings,
      testConnection,
      testDangerButton,
      testCallButton,
      resetV0Manually,
      dismissAlert,
    }),
    [
      device,
      zones,
      events,
      blynkConfig,
      settings,
      connectionState,
      pickingLocation,
      drawingZone,
      pendingZoneBounds,
      activeAlert,
      callStatus,
      smsStatus,
      blynkV0Value,
      blynkError,
      t,
      setLanguage,
      togglePresentationMode,
      startPickingLocation,
      cancelPickingLocation,
      handleMapClick,
      startDrawingZone,
      cancelDrawingZone,
      handleZoneDrawn,
      confirmCreateZone,
      cancelCreateZone,
      deleteZone,
      toggleZoneActive,
      updateBlynkConfig,
      updateSettings,
      testConnection,
      testDangerButton,
      testCallButton,
      resetV0Manually,
      dismissAlert,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
