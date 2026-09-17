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
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs px-4">
      <div className="w-full max-w-sm animate-slide-in rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">{t("zoneModalTitle")}</h2>
          <button
            onClick={cancelCreateZone}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t("zoneNameLabel")}</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("zoneNameDefault")}
          className="mb-5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={cancelCreateZone}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
