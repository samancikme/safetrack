import { AlertTriangle, Phone, MessageSquare, X, CheckCircle2, Loader2 } from "lucide-react";
import { useAppStore } from "../store/AppStore";

function StatusLine({
  icon,
  sendingLabel,
  doneLabel,
  status,
}: {
  icon: React.ReactNode;
  sendingLabel: string;
  doneLabel: string;
  status: "idle" | "sending" | "sent" | "failed";
}) {
  if (status === "idle") return null;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-500">{icon}</span>
      <span className={status === "sent" ? "font-semibold text-emerald-600" : "text-slate-600"}>
        {status === "sending" ? sendingLabel : doneLabel}
      </span>
      {status === "sending" && <Loader2 size={13} className="animate-spin text-slate-400" />}
      {status === "sent" && <CheckCircle2 size={13} className="text-emerald-500" />}
    </div>
  );
}

export function DangerAlert() {
  const { activeAlert, dismissAlert, callStatus, smsStatus, device, t } = useAppStore();

  if (!activeAlert) return null;

  const time = new Date(activeAlert.timestamp).toLocaleTimeString();

  return (
    <div className="fixed inset-x-3 top-16 sm:top-20 sm:left-auto sm:right-4 z-[1300] w-auto sm:w-full max-w-sm animate-slide-in">
      <div className="overflow-hidden rounded-xl border border-rose-500/40 bg-white shadow-2xl ring-1 ring-rose-500/20">
        <div className="flex items-center justify-between bg-rose-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle size={18} className="animate-bounce text-amber-300" />
            <span>{t("dangerDetectedTitle")}</span>
          </div>
          <button
            onClick={dismissAlert}
            className="rounded-lg p-1 text-white/80 hover:bg-rose-700 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-4 text-xs sm:text-sm">
          <p className="text-slate-800 leading-snug">
            <span className="font-bold text-slate-950">{device.name}</span> {t("dangerDetectedBody")}
          </p>

          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-lg bg-rose-50/70 p-3 text-xs border border-rose-100">
            <span className="font-semibold text-slate-500">{t("zoneLabel")}</span>
            <span className="font-bold text-rose-800">{activeAlert.zone.name}</span>
            <span className="font-semibold text-slate-500">{t("coordinatesLabel")}</span>
            <span className="font-mono font-semibold text-slate-800">
              {activeAlert.point.lat.toFixed(4)}, {activeAlert.point.lng.toFixed(4)}
            </span>
            <span className="font-semibold text-slate-500">{t("timeLabel")}</span>
            <span className="font-mono font-semibold text-slate-800">{time}</span>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <StatusLine
              icon={<Phone size={14} className="text-blue-600" />}
              sendingLabel={t("callSending")}
              doneLabel={t("callViaHardware")}
              status={callStatus}
            />
            <StatusLine
              icon={<MessageSquare size={14} className="text-emerald-600" />}
              sendingLabel={t("smsSending")}
              doneLabel={t("smsSentDone")}
              status={smsStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
