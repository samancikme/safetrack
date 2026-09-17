import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, Info, Eye, EyeOff, Copy, Check } from "lucide-react";
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
  const [templateId, setTemplateId] = useState(blynkConfig.templateId || "TMPL4KVCqWp-b");
  const [templateName, setTemplateName] = useState(blynkConfig.templateName || "safetrack");
  const [triggerPin, setTriggerPin] = useState(blynkConfig.triggerPin);
  const [deviceName, setDeviceName] = useState(settings.deviceName);
  const [phone, setPhone] = useState(settings.emergencyPhone);
  const [tokenVisible, setTokenVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const save = () => {
    updateBlynkConfig({ ...blynkConfig, server, token, templateId, templateName, triggerPin });
    updateSettings({ ...settings, deviceName, emergencyPhone: phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const cppCodeSnippet = `#define BLYNK_TEMPLATE_ID "${templateId}"
#define BLYNK_TEMPLATE_NAME "${templateName}"
#define BLYNK_AUTH_TOKEN "${token}"`;

  const copyCppCode = () => {
    navigator.clipboard.writeText(cppCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const maskedToken = token ? "•".repeat(Math.min(token.length, 24)) : "";

  return (
    <div className="max-w-2xl space-y-4 p-4 sm:p-6">
      <h1 className="text-lg font-bold text-slate-900">{t("settingsTitle")}</h1>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-sm font-bold text-slate-800">{t("settingsDeviceSection")}</h2>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t("settingsDeviceName")}</label>
        <input
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">{t("settingsBlynkSection")}</h2>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200/60">
            Blynk IoT Cloud
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Blynk Template ID</label>
              <input
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                placeholder="TMPL4KVCqWp-b"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Blynk Template Name</label>
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="safetrack"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t("settingsBlynkServer")}</label>
            <input
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t("settingsBlynkToken")}</label>
            <div className="relative">
              <input
                type={tokenVisible ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={t("settingsBlynkTokenPlaceholder")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-9 text-sm font-mono font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setTokenVisible((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {tokenVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!tokenVisible && token && (
              <p className="mt-1 font-mono text-xs text-slate-400">{maskedToken}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t("settingsTriggerPin")}</label>
              <input
                value={triggerPin}
                onChange={(e) => setTriggerPin(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Firmware C++ Header snippet box */}
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-3.5 text-white">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">ESP32 Firmware Header Defines</span>
              <button
                onClick={copyCppCode}
                className="flex items-center gap-1.5 rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedCode ? "Nusxalandi" : "Nusxalash"}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto p-2 bg-slate-950/80 rounded border border-slate-800">
              {cppCodeSnippet}
            </pre>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={testConnection}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:scale-95 transition-all"
            >
              {connectionState === "checking" && <Loader2 size={15} className="animate-spin text-blue-600" />}
              {t("settingsTestConnection")}
            </button>
            {connectionState === "connected" && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={15} /> {t("settingsConnectionOk")}
              </span>
            )}
            {connectionState === "failed" && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                <XCircle size={15} /> {t("settingsConnectionFail")}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-sm font-bold text-slate-800">{t("settingsEmergencySection")}</h2>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t("settingsPhoneNumber")}</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-sm font-bold text-slate-800">{t("settingsLanguageSection")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("uz")}
            className={`rounded-lg border px-4 py-2 text-sm font-bold transition-all ${
              settings.language === "uz"
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t("langUz")}
          </button>
          <button
            onClick={() => setLanguage("qq")}
            className={`rounded-lg border px-4 py-2 text-sm font-bold transition-all ${
              settings.language === "qq"
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t("langQq")}
          </button>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-xs text-slate-800">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="leading-relaxed">
          <span className="font-bold text-amber-900">{t("settingsSecurityNoteTitle")}</span> {t("settingsSecurityNoteBody")}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={save}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20"
        >
          {t("save")}
        </button>
        {saved && <span className="text-xs font-bold text-emerald-600">{t("settingsSaved")}</span>}
      </div>
    </div>
  );
}
