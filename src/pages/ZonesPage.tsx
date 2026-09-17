import { Trash2, Power } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export function ZonesPage() {
  const { zones, deleteZone, toggleZoneActive, t } = useAppStore();

  return (
    <div className="space-y-4 p-3.5 sm:p-6">
      <h1 className="text-base sm:text-lg font-bold text-slate-900">{t("zonesPageTitle")}</h1>

      {zones.length === 0 ? (
        <div className="rounded-xl border border-slate-200/80 bg-white p-10 text-center text-sm font-medium text-slate-500 shadow-xs">
          {t("noZones")}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500">
                  <th className="px-4 py-3">{t("zonesTableName")}</th>
                  <th className="px-4 py-3">{t("zonesTableStatus")}</th>
                  <th className="px-4 py-3">{t("zonesTableCreated")}</th>
                  <th className="px-4 py-3">{t("zonesTableDevice")}</th>
                  <th className="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{z.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          z.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${z.active ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {z.active ? t("zonesActive") : t("zonesInactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {new Date(z.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${z.deviceInside ? "text-rose-600" : "text-slate-500"}`}>
                        {z.deviceInside ? t("deviceInZone") : t("deviceOutZone")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          title={z.active ? t("zonesActionDeactivate") : t("zonesActionActivate")}
                          onClick={() => toggleZoneActive(z.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 active:scale-95 transition-all"
                        >
                          <Power size={16} />
                        </button>
                        <button
                          title={t("zonesActionDelete")}
                          onClick={() => deleteZone(z.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
