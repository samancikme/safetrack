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
    <div className="flex h-full flex-col gap-3 sm:gap-4 p-3.5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-base sm:text-lg font-bold text-slate-900">{t("mapPageTitle")}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => (pickingLocation ? cancelPickingLocation() : startPickingLocation())}
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 ${
              pickingLocation
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <MapPin size={15} />
            <span>{t("setDeviceLocationBtn")}</span>
          </button>
          <button
            onClick={() => (drawingZone ? cancelDrawingZone() : startDrawingZone())}
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 ${
              drawingZone
                ? "border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Square size={15} />
            <span>{t("createZoneBtn")}</span>
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <div className="min-h-[360px] sm:min-h-[480px]">
          <MapView />
        </div>
        <DeviceCard />
      </div>
    </div>
  );
}
