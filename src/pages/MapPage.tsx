import { MapPin, Square } from "lucide-react";
import { MapView } from "../components/MapView";
import { DeviceCard } from "../components/DeviceCard";
import { useAppStore } from "../store/AppStore";

export function MapPage() {
  const {
    t,
    pickingLocation,
    drawingZone,
    startPickingLocation,
    cancelPickingLocation,
    startDrawingZone,
    cancelDrawingZone,
  } = useAppStore();

  return (
    <div className="flex h-full flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-ink">{t("mapPageTitle")}</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => (pickingLocation ? cancelPickingLocation() : startPickingLocation())}
            className={`flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
              pickingLocation
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-line text-ink-dim hover:bg-canvas"
            }`}
          >
            <MapPin size={15} />
            {t("setDeviceLocationBtn")}
          </button>
          <button
            onClick={() => (drawingZone ? cancelDrawingZone() : startDrawingZone())}
            className={`flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
              drawingZone
                ? "border-danger-500 bg-danger-500 text-white"
                : "border-line text-ink-dim hover:bg-canvas"
            }`}
          >
            <Square size={15} />
            {t("createZoneBtn")}
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <div className="min-h-[480px]">
          <MapView />
        </div>
        <DeviceCard />
      </div>
    </div>
  );
}
