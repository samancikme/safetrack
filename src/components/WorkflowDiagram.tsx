import { AlertTriangle, Radio, Cpu, Smartphone, PhoneCall } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export function WorkflowDiagram() {
  const { t } = useAppStore();

  const steps = [
    { icon: AlertTriangle, label: t("workflowDanger") },
    { icon: Radio, label: t("workflowBlynk") },
    { icon: Cpu, label: t("workflowEsp32") },
    { icon: Smartphone, label: t("workflowSim") },
    { icon: PhoneCall, label: t("workflowCallSms") },
  ];

  return (
    <div className="card p-4">
      <h3 className="mb-4 text-sm font-semibold text-ink">{t("workflowTitle")}</h3>
      <div className="flex flex-col gap-0 sm:flex-row sm:items-center sm:gap-0">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center gap-2 py-2 text-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-canvas text-brand-600">
                <s.icon size={16} />
              </span>
              <span className="text-xs font-medium leading-tight text-ink-dim">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden h-px w-6 shrink-0 bg-line sm:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
