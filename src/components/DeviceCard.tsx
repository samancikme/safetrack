import { Battery, MapPin, Satellite, Wifi } from "lucide-react";
import { useAppStore } from "../store/AppStore";

function timeAgo(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
}

export function DeviceCard() {
  const { device, t } = useAppStore();

  const statusConfig = {
    online: { dot: "bg-success-500", text: t("deviceStatusActive"), textColor: "text-success-600" },
    offline: { dot: "bg-ink-dim", text: t("deviceStatusOffline"), textColor: "text-ink-dim" },
    danger: { dot: "bg-danger-500", text: t("deviceStatusDanger"), textColor: "text-danger-600" },
  }[device.status];

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-ink">{device.name}</div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
          <span className={statusConfig.textColor}>{statusConfig.text}</span>
        </div>
      </div>

      <dl className="space-y-2.5 text-sm">
        <Row icon={<MapPin size={14} />} label={t("deviceGpsMode")} value={t("deviceGpsDemo")} />
        <Row
          icon={<span className="inline-block w-3.5 text-center text-[10px] font-bold text-ink-dim">Y</span>}
          label={t("deviceLatitude")}
          value={device.latitude.toFixed(5)}
          mono
        />
        <Row
          icon={<span className="inline-block w-3.5 text-center text-[10px] font-bold text-ink-dim">X</span>}
          label={t("deviceLongitude")}
          value={device.longitude.toFixed(5)}
          mono
        />
        <Row icon={<Satellite size={14} />} label={t("deviceSatellites")} value={String(device.satellites)} />
        <Row icon={<Battery size={14} />} label={t("deviceBattery")} value={`${device.battery}%`} />
        <Row icon={<Wifi size={14} />} label={t("deviceNetwork")} value="Blynk ●" valueColor="text-success-600" />
      </dl>

      <div className="mt-3 border-t border-line pt-2.5 text-xs text-ink-dim">
        {t("deviceLastUpdate")}: {timeAgo(device.lastUpdate)} {t("secondsAgo")}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  mono,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-dim">
        <span className="text-ink-dim">{icon}</span>
        {label}
      </span>
      <span className={`${mono ? "font-mono-data" : "font-medium"} ${valueColor ?? "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
