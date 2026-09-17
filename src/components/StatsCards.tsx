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
      accent: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      icon: Satellite,
      label: t("statGps"),
      value: t("deviceGpsDemo"),
      sub: `${device.satellites} ${t("statSatellites")}`,
      accent: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      icon: Radar,
      label: t("statZones"),
      value: String(activeZones),
      sub: t("statActive"),
      accent: "text-danger-600",
      bg: "bg-danger-50",
    },
    {
      icon: AlertTriangle,
      label: t("statEventsToday"),
      value: String(eventsToday),
      sub: "",
      accent: "text-warn-500",
      bg: "bg-warn-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-ink-dim">{c.label}</span>
            <span className={`flex h-7 w-7 items-center justify-center rounded-md ${c.bg} ${c.accent}`}>
              <c.icon size={15} />
            </span>
          </div>
          <div className="text-2xl font-semibold text-ink">{c.value}</div>
          {c.sub && <div className="mt-0.5 text-xs text-ink-dim">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
