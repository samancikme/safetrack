import { EventHistory } from "../components/EventHistory";
import { useAppStore } from "../store/AppStore";

export function EventsPage() {
  const { t } = useAppStore();
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <h1 className="text-lg font-semibold text-ink">{t("navEvents")}</h1>
      <EventHistory />
    </div>
  );
}
