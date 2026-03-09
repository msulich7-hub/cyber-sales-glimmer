import { motion, AnimatePresence } from "framer-motion";
import CommandHeader from "@/components/dashboard/CommandHeader";
import TimeMachineChart from "@/components/dashboard/TimeMachineChart";
import SalesLeaderboard from "@/components/dashboard/SalesLeaderboard";
import MonthGhostChart from "@/components/dashboard/MonthGhostChart";
import ClientMatrix from "@/components/dashboard/ClientMatrix";
import RevenueDonut from "@/components/dashboard/RevenueDonut";
import SettingsDrawer from "@/components/dashboard/SettingsDrawer";
import { DashboardProvider, useDashboardSettings } from "@/contexts/DashboardSettings";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const DashboardContent = () => {
  const { settings } = useDashboardSettings();
  const compact = settings.compactMode;

  return (
    <div className={`min-h-screen bg-background ${compact ? "p-2 md:p-3" : "p-3 md:p-6"}`}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`max-w-[1440px] mx-auto ${compact ? "space-y-2" : "space-y-4"}`}
      >
        <motion.div variants={item}>
          <CommandHeader />
        </motion.div>

        <AnimatePresence mode="popLayout">
          {settings.showMonthGhost && (
            <motion.div
              key="ghost"
              variants={item}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
              transition={{ duration: 0.3 }}
            >
              <MonthGhostChart />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${compact ? "gap-2" : "gap-4"}`}>
          <AnimatePresence mode="popLayout">
            {settings.showTimeMachine && (
              <motion.div
                key="time"
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95 }}
                className={`lg:col-span-2 ${compact ? "min-h-[320px]" : "min-h-[400px]"}`}
              >
                <TimeMachineChart />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {settings.showLeaderboard && (
              <motion.div
                key="leader"
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95 }}
                className={compact ? "min-h-[320px]" : "min-h-[400px]"}
              >
                <SalesLeaderboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${compact ? "gap-2" : "gap-4"}`}>
          <AnimatePresence mode="popLayout">
            {settings.showClientMatrix && (
              <motion.div
                key="client"
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95 }}
                className={compact ? "min-h-[300px]" : "min-h-[380px]"}
              >
                <ClientMatrix />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {settings.showRevenueDonut && (
              <motion.div
                key="donut"
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95 }}
                className={compact ? "min-h-[300px]" : "min-h-[380px]"}
              >
                <RevenueDonut />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

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
