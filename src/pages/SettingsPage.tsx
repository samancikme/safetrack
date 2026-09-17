import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, Info, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export function SettingsPage() {
  const {
    blynkConfig,
    updateBlynkConfig,
    settings,
    updateSettings,
    connectionState,
    testConnection,
    setLanguage,
    t,
  } = useAppStore();

  const [server, setServer] = useState(blynkConfig.server);
  const [token, setToken] = useState(blynkConfig.token);
  const [triggerPin, setTriggerPin] = useState(blynkConfig.triggerPin);
  const [deviceName, setDeviceName] = useState(settings.deviceName);
  const [phone, setPhone] = useState(settings.emergencyPhone);
  const [tokenVisible, setTokenVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateBlynkConfig({ ...blynkConfig, server, token, triggerPin });
    updateSettings({ ...settings, deviceName, emergencyPhone: phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const maskedToken = token ? "•".repeat(Math.min(token.length, 24)) : "";

  return (
    <div className="max-w-2xl space-y-4 p-4 sm:p-6">
      <h1 className="text-lg font-semibold text-ink">{t("settingsTitle")}</h1>

      <section className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">{t("settingsDeviceSection")}</h2>
        <label className="mb-1.5 block text-xs font-medium text-ink-dim">{t("settingsDeviceName")}</label>
        <input
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </section>

      <section className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">{t("settingsBlynkSection")}</h2>
        <div className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-dim">{t("settingsBlynkServer")}</label>
            <input
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2 text-sm font-mono-data outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-dim">{t("settingsBlynkToken")}</label>
            <div className="relative">
              <input
                type={tokenVisible ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={t("settingsBlynkTokenPlaceholder")}
                className="w-full rounded-md border border-line px-3 py-2 pr-9 text-sm font-mono-data outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={() => setTokenVisible((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink"
              >
                {tokenVisible ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {!tokenVisible && token && (
              <p className="mt-1 font-mono-data text-xs text-ink-dim">{maskedToken}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-dim">{t("settingsTriggerPin")}</label>
            <input
              value={triggerPin}
              onChange={(e) => setTriggerPin(e.target.value)}
              className="w-40 rounded-md border border-line px-3 py-2 text-sm font-mono-data outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={testConnection}
              className="flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm font-medium text-ink-dim hover:bg-canvas"
            >
              {connectionState === "checking" && <Loader2 size={14} className="animate-spin" />}
              {t("settingsTestConnection")}
            </button>
            {connectionState === "connected" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-success-600">
                <CheckCircle2 size={14} /> {t("settingsConnectionOk")}
              </span>
            )}
            {connectionState === "failed" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-danger-600">
                <XCircle size={14} /> {t("settingsConnectionFail")}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">{t("settingsEmergencySection")}</h2>
        <label className="mb-1.5 block text-xs font-medium text-ink-dim">{t("settingsPhoneNumber")}</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm font-mono-data outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </section>

      <section className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">{t("settingsDemoSection")}</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-dim">{t("settingsDemoGpsLabel")}</span>
          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {t("settingsDemoGpsOn")}
          </span>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">{t("settingsLanguageSection")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("uz")}
            className={`rounded-md border px-3.5 py-2 text-sm font-medium ${
              settings.language === "uz" ? "border-brand-600 bg-brand-600 text-white" : "border-line text-ink-dim"
            }`}
          >
            {t("langUz")}
          </button>
          <button
            onClick={() => setLanguage("qq")}
            className={`rounded-md border px-3.5 py-2 text-sm font-medium ${
              settings.language === "qq" ? "border-brand-600 bg-brand-600 text-white" : "border-line text-ink-dim"
            }`}
          >
            {t("langQq")}
          </button>
        </div>
      </section>

      <div className="flex items-start gap-2.5 rounded-md border border-warn-500/30 bg-warn-50 p-3.5 text-xs text-ink">
        <Info size={15} className="mt-0.5 shrink-0 text-warn-500" />
        <p>
          <span className="font-semibold">{t("settingsSecurityNoteTitle")}</span> {t("settingsSecurityNoteBody")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          {t("save")}
        </button>
        {saved && <span className="text-xs font-medium text-success-600">{t("settingsSaved")}</span>}
      </div>
    </div>
  );
}
