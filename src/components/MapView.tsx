import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Rectangle,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useAppStore } from "../store/AppStore";
import type { LatLng } from "../types";
import { normalizeBounds } from "../utils/geofence";

const KSU_CENTER: [number, number] = [42.4578, 59.6172];

function deviceIcon(status: "online" | "offline" | "danger") {
  const color = status === "danger" ? "#dc2626" : status === "offline" ? "#64748b" : "#10b981";
  const html = `
    <div style="position:relative;width:32px;height:32px;">
      ${
        status === "danger"
          ? `<div style="position:absolute;inset:-8px;border-radius:999px;background:rgba(220,38,38,0.35);animation:pulse-ring 1.6s cubic-bezier(0.2,0.6,0.4,1) infinite;"></div>`
          : `<div style="position:absolute;inset:-4px;border-radius:999px;background:rgba(16,185,129,0.25);animation:pulse-ring 2.5s ease-out infinite;"></div>`
      }
      <div style="
        width:32px;height:32px;border-radius:999px;
        background:${color};border:3px solid white;
        box-shadow:0 4px 10px rgba(15,23,42,0.35);
        display:flex;align-items:center;justify-content:center;color:white;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function ksuLandmarkIcon() {
  const html = `
    <div style="
      background: #0f172a; border: 2px solid #38bdf8; border-radius: 8px;
      padding: 3px 8px; color: white; font-size: 11px; font-weight: 700;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 5px;
      white-space: nowrap;">
      <span style="display:inline-block;width:6px;height:6px;border-radius:999px;background:#38bdf8;"></span>
      <span>Qoraqalpoq Davlat Universiteti</span>
    </div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [180, 24],
    iconAnchor: [90, 12],
  });
}

function MapEventsHandler({
  onClick,
  onMouseMove,
}: {
  onClick: (point: LatLng) => void;
  onMouseMove?: (point: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    mousemove(e) {
      onMouseMove?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function MapView({ heightClass = "h-full" }: { heightClass?: string }) {
  const {
    device,
    zones,
    pickingLocation,
    drawingZone,
    handleMapClick,
    handleZoneDrawn,
    t,
  } = useAppStore();

  const [drawStart, setDrawStart] = useState<LatLng | null>(null);
  const [drawPreview, setDrawPreview] = useState<LatLng | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!drawingZone) {
      setDrawStart(null);
      setDrawPreview(null);
    }
  }, [drawingZone]);

  const onMapClick = (point: LatLng) => {
    if (pickingLocation) {
      handleMapClick(point);
      return;
    }
    if (drawingZone) {
      if (!drawStart) {
        setDrawStart(point);
        setDrawPreview(point);
      } else {
        const bounds = normalizeBounds(drawStart, point);
        handleZoneDrawn(bounds);
        setDrawStart(null);
        setDrawPreview(null);
      }
    }
  };

  const showingInstruction = pickingLocation || (drawingZone && !drawStart) || (drawingZone && drawStart);
  const currentLocName = device.locationName || "Qoraqalpoq Davlat Universiteti";

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-slate-200/80 shadow-xs`}>
      {showingInstruction && (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-[1000] flex justify-center">
          <div className="rounded-lg bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md">
            {pickingLocation
              ? t("setDeviceLocationInstruction")
              : t("createZoneInstruction")}
          </div>
        </div>
      )}

      {/* Location Badge Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span>Joylashuv: {currentLocName}</span>
        <span className="font-mono text-[10px] text-slate-400 font-normal">
          ({device.latitude.toFixed(4)}, {device.longitude.toFixed(4)})
        </span>
      </div>

      <MapContainer
        center={[device.latitude || KSU_CENTER[0], device.longitude || KSU_CENTER[1]]}
        zoom={16}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler
          onClick={onMapClick}
          onMouseMove={(point) => {
            if (drawingZone && drawStart) setDrawPreview(point);
          }}
        />

        {zones.map((zone) => (
          <Rectangle
            key={zone.id}
            bounds={[
              [zone.south, zone.west],
              [zone.north, zone.east],
            ]}
            pathOptions={{
              color: "#10b981",
              weight: 2.5,
              fillColor: "#10b981",
              fillOpacity: zone.active ? 0.18 : 0.05,
              dashArray: zone.active ? undefined : "6 4",
            }}
          >
            <Tooltip direction="top" sticky className="font-sans font-bold text-xs">
              🛡️ {zone.name} (Xavfsiz Zona)
            </Tooltip>
          </Rectangle>
        ))}

        {drawStart && drawPreview && (
          <Rectangle
            bounds={[
              [normalizeBounds(drawStart, drawPreview).south, normalizeBounds(drawStart, drawPreview).west],
              [normalizeBounds(drawStart, drawPreview).north, normalizeBounds(drawStart, drawPreview).east],
            ]}
            pathOptions={{ color: "#10b981", weight: 2, dashArray: "4 4", fillOpacity: 0.1 }}
          />
        )}

        {/* Karakalpak State University Landmark Marker */}
        <Marker position={KSU_CENTER} icon={ksuLandmarkIcon()}>
          <Tooltip direction="top" offset={[0, -10]}>
            Qoraqalpoq Davlat Universiteti (Nukus sh., Karakalpakstan)
          </Tooltip>
        </Marker>

        {/* GPS Device Marker */}
        <Marker position={[device.latitude, device.longitude]} icon={deviceIcon(device.status)}>
          <Tooltip direction="top" offset={[0, -18]} permanent opacity={0.95}>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-xs">{device.name} — {currentLocName}</span>
              <span className="font-mono text-[10px] text-slate-500">
                {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
              </span>
            </div>
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}
