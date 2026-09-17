import { useState } from "react";
import { AppStoreProvider, useAppStore } from "./store/AppStore";
import { Header } from "./components/Header";
import { Sidebar, type PageKey } from "./components/Sidebar";
import { DangerZoneModal } from "./components/DangerZoneModal";
import { DangerAlert } from "./components/DangerAlert";
import { Dashboard } from "./pages/Dashboard";
import { MapPage } from "./pages/MapPage";
import { ZonesPage } from "./pages/ZonesPage";
import { EventsPage } from "./pages/EventsPage";
import { SettingsPage } from "./pages/SettingsPage";

function Shell() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const { settings } = useAppStore();

  const pageContent = {
    dashboard: <Dashboard />,
    map: <MapPage />,
    zones: <ZonesPage />,
    events: <EventsPage />,
    settings: <SettingsPage />,
  }[page];

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex min-h-0 flex-1">
        {!settings.presentationMode && <Sidebar active={page} onNavigate={setPage} />}
        <main className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">{pageContent}</main>
      </div>

      <DangerZoneModal />
      <DangerAlert />
    </div>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <Shell />
    </AppStoreProvider>
  );
}
