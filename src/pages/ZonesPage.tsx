import { Eye, Trash2, Power } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export function ZonesPage() {
  const { zones, deleteZone, toggleZoneActive, t } = useAppStore();

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <h1 className="text-lg font-semibold text-ink">{t("zonesPageTitle")}</h1>

      {zones.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-dim">{t("noZones")}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs font-medium text-ink-dim">
                <th className="px-4 py-2.5">{t("zonesTableName")}</th>
                <th className="px-4 py-2.5">{t("zonesTableStatus")}</th>
                <th className="px-4 py-2.5">{t("zonesTableCreated")}</th>
                <th className="px-4 py-2.5">{t("zonesTableDevice")}</th>
                <th className="px-4 py-2.5 text-right"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {zones.map((z) => (
                <tr key={z.id}>
                  <td className="px-4 py-3 font-medium text-ink">{z.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${
                        z.active ? "bg-success-50 text-success-600" : "bg-canvas text-ink-dim"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${z.active ? "bg-success-500" : "bg-ink-dim"}`} />
                      {z.active ? t("zonesActive") : t("zonesInactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono-data text-xs text-ink-dim">
                    {new Date(z.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${z.deviceInside ? "text-danger-600" : "text-ink-dim"}`}>
                      {z.deviceInside ? t("deviceInZone") : t("deviceOutZone")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title={z.active ? t("zonesActionDeactivate") : t("zonesActionActivate")}
                        onClick={() => toggleZoneActive(z.id)}
                        className="rounded-md p-1.5 text-ink-dim hover:bg-canvas hover:text-brand-600"
                      >
                        <Power size={15} />
                      </button>
                      <button
                        title={t("zonesActionView")}
                        className="rounded-md p-1.5 text-ink-dim hover:bg-canvas hover:text-brand-600"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        title={t("zonesActionDelete")}
                        onClick={() => deleteZone(z.id)}
                        className="rounded-md p-1.5 text-ink-dim hover:bg-danger-50 hover:text-danger-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
