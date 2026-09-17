import { LayoutDashboard, Map, Octagon, ListTree, Settings, Presentation, Shield } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export type PageKey = "dashboard" | "map" | "zones" | "events" | "settings";

interface SidebarProps {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const { t, settings, togglePresentationMode } = useAppStore();

  const items: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { key: "map", label: t("navMap"), icon: Map },
    { key: "zones", label: t("navZones"), icon: Octagon },
    { key: "events", label: t("navEvents"), icon: ListTree },
    { key: "settings", label: t("navSettings"), icon: Settings },
  ];

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200/80 bg-white shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      <div className="p-3">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white opacity-80" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-3 space-y-3">
        {/* System Badge */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-blue-50/40 p-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Shield size={14} className="text-blue-600" />
            <span>SafeTrack Core v2.4</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Hardware & Cloud GPS Sentinel Protocol
          </p>
        </div>

        <button
          onClick={togglePresentationMode}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-95 ${
            settings.presentationMode
              ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          <Presentation size={15} />
          {settings.presentationMode ? t("exitPresentation") : t("presentationMode")}
        </button>
      </div>
    </aside>
  );
}
