import { Battery, MapPin, Satellite, Wifi, Building2 } from "lucide-react";
import { useAppStore } from "../store/AppStore";

function timeAgo(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
}

export function DeviceCard() {
  const { device, t } = useAppStore();

  const statusConfig = {
    online: { dot: "bg-emerald-500", text: t("deviceStatusActive"), textColor: "text-emerald-700" },
    offline: { dot: "bg-slate-400", text: t("deviceStatusOffline"), textColor: "text-slate-500" },
    danger: { dot: "bg-rose-500", text: t("deviceStatusDanger"), textColor: "text-rose-700" },
  }[device.status];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="text-base font-bold text-slate-900">{device.name}</div>
          <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-0.5">
            <Building2 size={12} />
            <span>Nukus IT Park</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold border border-slate-200/60">
          <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
          <span className={statusConfig.textColor}>{statusConfig.text}</span>
        </div>
      </div>

      <dl className="space-y-2.5 text-xs font-medium">
        <Row icon={<Building2 size={14} className="text-slate-400" />} label="Joylashuv" value={device.locationName || "Nukus IT Park"} valueColor="text-blue-700 font-bold" />
        <Row icon={<MapPin size={14} className="text-slate-400" />} label={t("deviceGpsMode")} value={t("deviceGpsDemo")} />
        <Row
          icon={<span className="inline-block w-3.5 text-center text-[10px] font-bold text-slate-400">Y</span>}
          label={t("deviceLatitude")}
          value={device.latitude.toFixed(5)}
          mono
        />
        <Row
          icon={<span className="inline-block w-3.5 text-center text-[10px] font-bold text-slate-400">X</span>}
          label={t("deviceLongitude")}
          value={device.longitude.toFixed(5)}
          mono
        />
        <Row icon={<Satellite size={14} className="text-slate-400" />} label={t("deviceSatellites")} value={`${device.satellites} sputnik`} />
        <Row icon={<Battery size={14} className="text-slate-400" />} label={t("deviceBattery")} value={`${device.battery}%`} />
        <Row icon={<Wifi size={14} className="text-slate-400" />} label={t("deviceNetwork")} value="Blynk ●" valueColor="text-emerald-600 font-bold" />
      </dl>

      <div className="mt-3 border-t border-slate-100 pt-2.5 text-[11px] font-medium text-slate-400">
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
      <span className="flex items-center gap-2 text-slate-500">
        {icon}
        <span>{label}</span>
      </span>
      <span className={`${mono ? "font-mono font-semibold" : "font-semibold"} ${valueColor ?? "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}
