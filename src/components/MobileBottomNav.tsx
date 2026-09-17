import { LayoutDashboard, Map, Octagon, ListTree, Settings } from "lucide-react";
import { useAppStore } from "../store/AppStore";
import type { PageKey } from "./Sidebar";

interface MobileBottomNavProps {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function MobileBottomNav({ active, onNavigate }: MobileBottomNavProps) {
  const { t } = useAppStore();

  const items: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { key: "map", label: t("navMap"), icon: Map },
    { key: "zones", label: t("navZones"), icon: Octagon },
    { key: "events", label: t("navEvents"), icon: ListTree },
    { key: "settings", label: t("navSettings"), icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <nav className="flex items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-1 flex-col items-center justify-center py-1.5 px-1 transition-all rounded-xl active:scale-95 ${
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 font-medium hover:text-slate-800"
              }`}
            >
              <div
                className={`relative flex items-center justify-center rounded-xl p-1.5 transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </div>
              <span className="mt-0.5 text-[10px] tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
