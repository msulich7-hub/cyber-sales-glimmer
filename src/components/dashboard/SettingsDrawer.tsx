import { Settings, BarChart3, Minimize2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useDashboardSettings } from "@/contexts/DashboardSettings";

const SettingsDrawer = () => {
  const { settings, updateSetting, drawerOpen, setDrawerOpen } = useDashboardSettings();

  const widgetToggles = [
    { key: "showMonthGhost" as const, label: "Month Ghost Chart" },
    { key: "showTimeMachine" as const, label: "Time Machine Chart" },
    { key: "showLeaderboard" as const, label: "Sales Leaderboard" },
    { key: "showClientMatrix" as const, label: "Client Matrix" },
    { key: "showRevenueDonut" as const, label: "Revenue Donut" },
    { key: "showForecast" as const, label: "Revenue Forecast" },
    { key: "showHeatmap" as const, label: "Revenue Heatmap" },
    { key: "showFunnel" as const, label: "Sales Pipeline" },
    { key: "showRegions" as const, label: "Regional Performance" },
    { key: "showWaterfall" as const, label: "Revenue Bridge" },
    { key: "showGauges" as const, label: "Performance Gauges" },
    { key: "showActivityFeed" as const, label: "Live Activity Feed" },
  ];

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="glass-card border-l border-border bg-card/95 backdrop-blur-2xl w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-neon-blue" />
            Dashboard Settings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Chart Type
            </h3>
            <div className="flex bg-secondary/80 rounded-lg p-0.5 border border-border/50">
              {(["bar", "area"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateSetting("chartType", type)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    settings.chartType === type
                      ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 neon-glow-blue"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type === "bar" ? "Bar Chart" : "Area Chart"}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-2">
              <Minimize2 className="w-3.5 h-3.5" />
              Layout
            </h3>
            <div className="flex items-center justify-between glass-card px-4 py-3 rounded-lg">
              <span className="text-sm">Compact Mode</span>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(v) => updateSetting("compactMode", v)}
                className="data-[state=checked]:bg-neon-purple"
              />
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              Widgets
            </h3>
            <div className="space-y-1">
              {widgetToggles.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {settings[key] ? (
                      <Eye className="w-3.5 h-3.5 text-neon-green" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-sm">{label}</span>
                  </div>
                  <Switch
                    checked={settings[key]}
                    onCheckedChange={(v) => updateSetting(key, v)}
                    className="data-[state=checked]:bg-neon-green"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
