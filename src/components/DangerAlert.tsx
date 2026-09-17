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
      <span className="text-ink-dim">{icon}</span>
      <span className={status === "sent" ? "text-success-600" : "text-ink-dim"}>
        {status === "sending" ? sendingLabel : doneLabel}
      </span>
      {status === "sending" && <Loader2 size={12} className="animate-spin text-ink-dim" />}
      {status === "sent" && <CheckCircle2 size={12} className="text-success-500" />}
    </div>
  );
}

export function DangerAlert() {
  const { activeAlert, dismissAlert, callStatus, smsStatus, device, t } = useAppStore();

  if (!activeAlert) return null;

  const time = new Date(activeAlert.timestamp).toLocaleTimeString();

  return (
    <div className="fixed right-4 top-20 z-[1300] w-full max-w-sm animate-slide-in">
      <div className="overflow-hidden rounded-lg border border-danger-500/30 bg-surface shadow-xl">
        <div className="flex items-center justify-between bg-danger-50 px-4 py-3">
          <div className="flex items-center gap-2 text-danger-600">
            <AlertTriangle size={17} />
            <span className="text-sm font-semibold">{t("dangerDetectedTitle")}</span>
          </div>
          <button onClick={dismissAlert} className="text-danger-600/70 hover:text-danger-600">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 px-4 py-3.5 text-sm">
          <p className="text-ink">
            <span className="font-medium">{device.name}</span> {t("dangerDetectedBody")}
          </p>

          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            <span className="text-ink-dim">{t("zoneLabel")}</span>
            <span className="font-medium text-ink">{activeAlert.zone.name}</span>
            <span className="text-ink-dim">{t("coordinatesLabel")}</span>
            <span className="font-mono-data text-ink">
              {activeAlert.point.lat.toFixed(4)}, {activeAlert.point.lng.toFixed(4)}
            </span>
            <span className="text-ink-dim">{t("timeLabel")}</span>
            <span className="font-mono-data text-ink">{time}</span>
          </div>

          <div className="space-y-1.5 border-t border-line pt-2.5">
            <StatusLine
              icon={<Phone size={13} />}
              sendingLabel={t("callSending")}
              doneLabel={t("callViaHardware")}
              status={callStatus}
            />
            <StatusLine
              icon={<MessageSquare size={13} />}
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
