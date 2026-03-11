import { createContext, useContext, useState, ReactNode } from "react";

export interface DashboardSettings {
  chartType: "bar" | "area";
  compactMode: boolean;
  showLeaderboard: boolean;
  showClientMatrix: boolean;
  showRevenueDonut: boolean;
  showTimeMachine: boolean;
  showMonthGhost: boolean;
  showForecast: boolean;
  showHeatmap: boolean;
  showFunnel: boolean;
  showRegions: boolean;
  showWaterfall: boolean;
  showGauges: boolean;
  showActivityFeed: boolean;
}

interface DashboardContextType {
  settings: DashboardSettings;
  updateSetting: <K extends keyof DashboardSettings>(key: K, value: DashboardSettings[K]) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboardSettings = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboardSettings must be used within DashboardProvider");
  return ctx;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<DashboardSettings>({
    chartType: "bar",
    compactMode: false,
    showLeaderboard: true,
    showClientMatrix: true,
    showRevenueDonut: true,
    showTimeMachine: true,
    showMonthGhost: true,
    showForecast: true,
    showHeatmap: true,
    showFunnel: true,
    showRegions: true,
    showWaterfall: true,
    showGauges: true,
    showActivityFeed: true,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const updateSetting = <K extends keyof DashboardSettings>(key: K, value: DashboardSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardContext.Provider value={{ settings, updateSetting, drawerOpen, setDrawerOpen }}>
      {children}
    </DashboardContext.Provider>
  );
};
