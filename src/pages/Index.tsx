import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, LayoutDashboard, Settings } from "lucide-react";
import { DashboardProvider, useDashboardSettings } from "@/contexts/DashboardSettings";
import DailySalesView from "@/pages/DailySalesView";
import ExecutiveOverview from "@/components/dashboard/ExecutiveOverview";
import SettingsDrawer from "@/components/dashboard/SettingsDrawer";

type TabKey = "daily" | "executive";

const tabs: { key: TabKey; label: string; icon: typeof BarChart2 }[] = [
  { key: "daily", label: "Daily Sales", icon: BarChart2 },
  { key: "executive", label: "Executive Overview", icon: LayoutDashboard },
];

const TabBar = ({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) => {
  const { setDrawerOpen } = useDashboardSettings();

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "hsl(160,84%,39%)", boxShadow: "0 0 8px hsl(160,84%,39%,0.5)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("daily");

  return (
    <div className="min-h-screen bg-background">
      <TabBar active={activeTab} onChange={setActiveTab} />
      <AnimatePresence mode="wait">
        {activeTab === "daily" ? (
          <motion.div
            key="daily"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <DailySalesView embedded />
          </motion.div>
        ) : (
          <motion.div
            key="executive"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <ExecutiveOverview />
          </motion.div>
        )}
      </AnimatePresence>
      <SettingsDrawer />
    </div>
  );
};

const Index = () => (
  <DashboardProvider>
    <DashboardContent />
  </DashboardProvider>
);

export default Index;
