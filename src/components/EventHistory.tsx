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
  danger: "text-danger-600 bg-danger-50",
  gps: "text-brand-600 bg-brand-50",
  blynk: "text-brand-600 bg-brand-50",
  call: "text-success-600 bg-success-50",
  sms: "text-success-600 bg-success-50",
  system: "text-ink-dim bg-canvas",
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
    <div className="card flex flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold text-ink">{t("eventHistoryTitle")}</h3>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-2.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-brand-600 text-white"
                  : "bg-canvas text-ink-dim hover:bg-brand-50 hover:text-brand-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="scrollbar-thin max-h-[420px] overflow-y-auto">
        {list.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-ink-dim">{t("noEvents")}</div>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((e) => {
              const Icon = iconFor[e.type];
              return (
                <li key={e.id} className="flex items-start gap-3 px-4 py-2.5">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${colorFor[e.type]}`}>
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-ink">{e.message}</p>
                    {e.zoneName && (
                      <p className="mt-0.5 text-xs text-ink-dim">
                        {e.zoneName}
                        {e.latitude != null && e.longitude != null && (
                          <span className="font-mono-data block">{e.latitude.toFixed(4)}, {e.longitude.toFixed(4)}</span>
                        )}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono-data text-xs text-ink-dim">
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
