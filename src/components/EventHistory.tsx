import { useState } from "react";
import { AlertTriangle, MapPin, Radio, Phone, MessageSquare, Info } from "lucide-react";
import { useAppStore } from "../store/AppStore";
import type { EventType } from "../types";

const iconFor: Record<EventType, typeof AlertTriangle> = {
  danger: AlertTriangle,
  gps: MapPin,
  blynk: Radio,
  call: Phone,
  sms: MessageSquare,
  system: Info,
};

const colorFor: Record<EventType, string> = {
  danger: "text-rose-600 bg-rose-50 border-rose-100",
  gps: "text-blue-600 bg-blue-50 border-blue-100",
  blynk: "text-indigo-600 bg-indigo-50 border-indigo-100",
  call: "text-emerald-600 bg-emerald-50 border-emerald-100",
  sms: "text-emerald-600 bg-emerald-50 border-emerald-100",
  system: "text-slate-600 bg-slate-100 border-slate-200",
};

export function EventHistory({ compact = false }: { compact?: boolean }) {
  const { events, t } = useAppStore();
  const [filter, setFilter] = useState<"all" | EventType>("all");

  const filters: { key: "all" | EventType; label: string }[] = [
    { key: "all", label: t("eventFilterAll") },
    { key: "danger", label: t("eventFilterDanger") },
    { key: "gps", label: t("eventFilterGps") },
    { key: "blynk", label: t("eventFilterBlynk") },
    { key: "call", label: t("eventFilterCall") },
    { key: "sms", label: t("eventFilterSms") },
  ];

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);
  const list = compact ? filtered.slice(0, 6) : filtered;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-800">{t("eventHistoryTitle")}</h3>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 px-3 py-2 bg-slate-50/50">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all active:scale-95 ${
                filter === f.key
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="scrollbar-thin max-h-[400px] overflow-y-auto">
        {list.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs sm:text-sm font-medium text-slate-400">{t("noEvents")}</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((e) => {
              const Icon = iconFor[e.type];
              return (
                <li key={e.id} className="flex items-start gap-3 px-3.5 py-2.5 hover:bg-slate-50/50 transition-colors">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${colorFor[e.type]}`}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold leading-snug text-slate-900">{e.message}</p>
                    {e.zoneName && (
                      <p className="mt-0.5 text-xs font-medium text-slate-500">
                        {e.zoneName}
                        {e.latitude != null && e.longitude != null && (
                          <span className="font-mono block text-[11px] text-slate-400">
                            {e.latitude.toFixed(4)}, {e.longitude.toFixed(4)}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-[11px] font-semibold text-slate-400">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
