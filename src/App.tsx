import { useState } from "react";
import { AppStoreProvider, useAppStore } from "./store/AppStore";
import { Header } from "./components/Header";
import { Sidebar, type PageKey } from "./components/Sidebar";
import { MobileBottomNav } from "./components/MobileBottomNav";
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
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <Header />
      <div className="flex min-h-0 flex-1 relative">
        {!settings.presentationMode && <Sidebar active={page} onNavigate={setPage} />}
        <main className="min-h-0 flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-6">
          {pageContent}
        </main>
      </div>

      {!settings.presentationMode && <MobileBottomNav active={page} onNavigate={setPage} />}

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
