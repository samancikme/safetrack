import { useAppStore } from "../store/AppStore";

export function BlynkStatus() {
  const { connectionState, t } = useAppStore();

  const config = {
    connected: {
      dotBg: "bg-emerald-500",
      pingBg: "bg-emerald-400",
      pillBg: "bg-emerald-50/80 border-emerald-200/80 text-emerald-800",
      label: t("blynkConnected"),
    },
    checking: {
      dotBg: "bg-amber-500 animate-pulse",
      pingBg: "bg-amber-400",
      pillBg: "bg-amber-50/80 border-amber-200/80 text-amber-800",
      label: t("blynkChecking"),
    },
    failed: {
      dotBg: "bg-rose-500",
      pingBg: "bg-rose-400",
      pillBg: "bg-rose-50/80 border-rose-200/80 text-rose-800",
      label: t("blynkDisconnected"),
    },
    unknown: {
      dotBg: "bg-slate-400",
      pingBg: "bg-slate-300",
      pillBg: "bg-slate-100/80 border-slate-200/80 text-slate-700",
      label: t("blynkDisconnected"),
    },
  }[connectionState];

  return (
    <div className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-2xs ${config.pillBg}`}>
      <span className="relative flex h-2 w-2">
        {connectionState === "connected" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.pingBg}`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dotBg}`} />
      </span>
      <span className="hidden sm:inline font-mono text-[11px] tracking-tight">{config.label}</span>
    </div>
  );
}
