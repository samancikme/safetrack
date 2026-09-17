import { useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export function DangerZoneModal() {
  const { pendingZoneBounds, confirmCreateZone, cancelCreateZone, t } = useAppStore();
  const [name, setName] = useState("");

  if (!pendingZoneBounds) return null;

  const submit = () => {
    confirmCreateZone(name);
    setName("");
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm animate-slide-in card p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">{t("zoneModalTitle")}</h2>
          <button onClick={cancelCreateZone} className="text-ink-dim hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <label className="mb-1.5 block text-xs font-medium text-ink-dim">{t("zoneNameLabel")}</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("zoneNameDefault")}
          className="mb-5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={cancelCreateZone}
            className="rounded-md border border-line px-3.5 py-2 text-sm font-medium text-ink-dim hover:bg-canvas"
          >
            {t("cancel")}
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-brand-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
