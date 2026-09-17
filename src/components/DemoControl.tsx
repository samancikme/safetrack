import { MapPin, Square, AlertTriangle, PhoneCall, RotateCcw } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export function DemoControl() {
  const {
    t,
    pickingLocation,
    drawingZone,
    startPickingLocation,
    cancelPickingLocation,
    startDrawingZone,
    cancelDrawingZone,
    testDangerButton,
    testCallButton,
    resetV0Manually,
    blynkV0Value,
  } = useAppStore();

  const actions = [
    {
      icon: MapPin,
      label: t("demoSetLocation"),
      onClick: () => (pickingLocation ? cancelPickingLocation() : startPickingLocation()),
      active: pickingLocation,
    },
    {
      icon: Square,
      label: t("demoCreateZone"),
      onClick: () => (drawingZone ? cancelDrawingZone() : startDrawingZone()),
      active: drawingZone,
    },
    {
      icon: AlertTriangle,
      label: t("demoTestDanger"),
      onClick: testDangerButton,
      danger: true,
    },
    {
      icon: PhoneCall,
      label: t("demoTestCall"),
      onClick: testCallButton,
    },
    {
      icon: RotateCcw,
      label: t("demoResetV0"),
      onClick: resetV0Manually,
    },
  ];

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("demoControlTitle")}</h3>
        <div className="flex items-center gap-1.5 rounded-md bg-canvas px-2 py-1 text-xs font-mono-data text-ink-dim">
          {t("blynkV0Label")}
          <span className={`font-semibold ${blynkV0Value === 1 ? "text-danger-600" : "text-ink"}`}>
            {blynkV0Value}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={`flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              a.active
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : a.danger
                ? "border-danger-500/30 text-danger-600 hover:bg-danger-50"
                : "border-line text-ink-dim hover:bg-canvas hover:text-ink"
            }`}
          >
            <a.icon size={16} />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
