import { Radio, Minimize2 } from "lucide-react";
import { useAppStore } from "../store/AppStore";
import { BlynkStatus } from "./BlynkStatus";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function Header() {
  const { t, settings, togglePresentationMode } = useAppStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md transition-all sm:px-6">
      <div className="flex items-center gap-4">
        <Logo size="md" showSubtitle={true} />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <BlynkStatus />
        
        {settings.presentationMode ? (
          <button
            onClick={togglePresentationMode}
            className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm transition-all hover:bg-amber-100 hover:border-amber-300 active:scale-95"
          >
            <Minimize2 size={13} className="text-amber-700" />
            {t("exitPresentation")}
          </button>
        ) : (
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-xs md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <Radio size={13} className="text-slate-500" />
            <span className="font-mono text-[11px] font-semibold text-slate-700">{t("demoGps")}</span>
          </div>
        )}

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

        <LanguageSwitcher />
      </div>
    </header>
  );
}
