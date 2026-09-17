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

const NUKUS_CENTER: [number, number] = [42.46, 59.61];

function deviceIcon(status: "online" | "offline" | "danger") {
  const color = status === "danger" ? "#c8342a" : status === "offline" ? "#94a3b8" : "#2358a8";
  const html = `
    <div style="position:relative;width:26px;height:26px;">
      ${
        status === "danger"
          ? `<div style="position:absolute;inset:-6px;border-radius:999px;background:rgba(200,52,42,0.35);animation:pulse-ring 1.6s cubic-bezier(0.2,0.6,0.4,1) infinite;"></div>`
          : ""
      }
      <div style="
        width:26px;height:26px;border-radius:999px;
        background:${color};border:3px solid white;
        box-shadow:0 1px 4px rgba(15,23,42,0.35);
        display:flex;align-items:center;justify-content:center;">
        <div style="width:6px;height:6px;border-radius:999px;background:white;"></div>
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
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

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-lg border border-line`}>
      {showingInstruction && (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-[1000] flex justify-center">
          <div className="rounded-md bg-ink px-3.5 py-2 text-xs font-medium text-white shadow-lg">
            {pickingLocation
              ? t("setDeviceLocationInstruction")
              : t("createZoneInstruction")}
          </div>
        </div>
      )}

      <MapContainer
        center={NUKUS_CENTER}
        zoom={13}
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
              color: "#c8342a",
              weight: 2,
              fillColor: "#c8342a",
              fillOpacity: zone.active ? 0.16 : 0.05,
              dashArray: zone.active ? undefined : "6 4",
            }}
          >
            <Tooltip direction="top" sticky>
              {zone.name}
            </Tooltip>
          </Rectangle>
        ))}

        {drawStart && drawPreview && (
          <Rectangle
            bounds={[
              [normalizeBounds(drawStart, drawPreview).south, normalizeBounds(drawStart, drawPreview).west],
              [normalizeBounds(drawStart, drawPreview).north, normalizeBounds(drawStart, drawPreview).east],
            ]}
            pathOptions={{ color: "#c8342a", weight: 2, dashArray: "4 4", fillOpacity: 0.08 }}
          />
        )}

        <Marker position={[device.latitude, device.longitude]} icon={deviceIcon(device.status)}>
          <Tooltip direction="top" offset={[0, -14]} permanent opacity={0.95}>
            {device.name}
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}
