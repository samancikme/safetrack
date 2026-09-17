import { AlertTriangle, MapPinned, Radar, Satellite } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export function StatsCards() {
  const { zones, events, device, t } = useAppStore();

  const activeZones = zones.filter((z) => z.active).length;
  const today = new Date().toDateString();
  const eventsToday = events.filter((e) => new Date(e.timestamp).toDateString() === today).length;

  const cards = [
    {
      icon: MapPinned,
      label: t("statDevices"),
      value: "1",
      sub: t("statActive"),
      accent: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      icon: Satellite,
      label: t("statGps"),
      value: t("deviceGpsDemo"),
      sub: `${device.satellites} ${t("statSatellites")}`,
      accent: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-100",
    },
    {
      icon: Radar,
      label: t("statZones"),
      value: String(activeZones),
      sub: t("statActive"),
      accent: "text-rose-600",
      bg: "bg-rose-50 border-rose-100",
    },
    {
      icon: AlertTriangle,
      label: t("statEventsToday"),
      value: String(eventsToday),
      sub: "Barchasi",
      accent: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">{c.label}</span>
            <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border ${c.bg} ${c.accent}`}>
              <c.icon size={16} />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{c.value}</div>
          {c.sub && <div className="mt-0.5 text-[11px] font-medium text-slate-400">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
