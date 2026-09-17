import { useAppStore } from "../store/AppStore";

export function LanguageSwitcher() {
  const { settings, setLanguage, t } = useAppStore();

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 text-xs font-bold shadow-2xs">
      <button
        onClick={() => setLanguage("uz")}
        title={t("langUz")}
        className={`rounded-md px-2.5 py-1 transition-all ${
          settings.language === "uz"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        UZ
      </button>
      <button
        onClick={() => setLanguage("qq")}
        title={t("langQq")}
        className={`rounded-md px-2.5 py-1 transition-all ${
          settings.language === "qq"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        QQ
      </button>
    </div>
  );
}
