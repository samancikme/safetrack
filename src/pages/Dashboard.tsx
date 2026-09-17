import { StatsCards } from "../components/StatsCards";
import { MapView } from "../components/MapView";
import { DeviceCard } from "../components/DeviceCard";
import { DemoControl } from "../components/DemoControl";
import { EventHistory } from "../components/EventHistory";
import { WorkflowDiagram } from "../components/WorkflowDiagram";
import { useAppStore } from "../store/AppStore";

export function Dashboard() {
  const { t } = useAppStore();

  return (
    <div className="space-y-4 p-3.5 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-lg font-bold text-slate-900">{t("dashboardTitle")}</h1>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="h-[320px] xs:h-[380px] sm:h-[420px]">
          <MapView />
        </div>
        <div className="space-y-4">
          <DeviceCard />
          <DemoControl />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WorkflowDiagram />
        <EventHistory compact />
      </div>
    </div>
  );
}
