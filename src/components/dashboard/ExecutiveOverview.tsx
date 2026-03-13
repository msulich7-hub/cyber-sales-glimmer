import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommandHeader from "@/components/dashboard/CommandHeader";
import TimeMachineChart from "@/components/dashboard/TimeMachineChart";
import SalesLeaderboard from "@/components/dashboard/SalesLeaderboard";
import MonthGhostChart from "@/components/dashboard/MonthGhostChart";
import ClientMatrix from "@/components/dashboard/ClientMatrix";
import RevenueDonut from "@/components/dashboard/RevenueDonut";
import ForecastChart from "@/components/dashboard/ForecastChart";
import RevenueHeatmap from "@/components/dashboard/RevenueHeatmap";
import SalesFunnel from "@/components/dashboard/SalesFunnel";
import RegionPerformance from "@/components/dashboard/RegionPerformance";
import WaterfallChart from "@/components/dashboard/WaterfallChart";
import PerformanceGauges from "@/components/dashboard/PerformanceGauges";
import LiveActivityFeed from "@/components/dashboard/LiveActivityFeed";
import PresentationMode from "@/components/dashboard/PresentationMode";
import { useDashboardSettings } from "@/contexts/DashboardSettings";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const animatedExit = { opacity: 0, scale: 0.95 };

const ExecutiveOverview = () => {
  const { settings } = useDashboardSettings();
  const [presentationOpen, setPresentationOpen] = useState(false);
  const compact = settings.compactMode;
  const gap = compact ? "gap-2" : "gap-4";

  return (
    <div className={compact ? "p-2 md:p-3" : "p-3 md:p-6"}>
      <motion.div
        id="dashboard-content"
        variants={container}
        initial="hidden"
        animate="show"
        className={`max-w-[1440px] mx-auto ${compact ? "space-y-2" : "space-y-4"}`}
      >
        <motion.div variants={item}>
          <CommandHeader onPresentationMode={() => setPresentationOpen(true)} />
        </motion.div>

        <AnimatePresence mode="popLayout">
          {settings.showMonthGhost && (
            <motion.div key="ghost" variants={item} initial="hidden" animate="show" exit={animatedExit}>
              <MonthGhostChart />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {settings.showForecast && (
            <motion.div key="forecast" variants={item} initial="hidden" animate="show" exit={animatedExit}>
              <ForecastChart />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${gap}`}>
          <AnimatePresence mode="popLayout">
            {settings.showGauges && (
              <motion.div key="gauges" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[280px]" : "min-h-[340px]"}>
                <PerformanceGauges />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {settings.showActivityFeed && (
              <motion.div key="activity" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[280px]" : "min-h-[340px]"}>
                <LiveActivityFeed />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${gap}`}>
          <AnimatePresence mode="popLayout">
            {settings.showTimeMachine && (
              <motion.div key="time" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={`lg:col-span-2 ${compact ? "min-h-[320px]" : "min-h-[400px]"}`}>
                <TimeMachineChart />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {settings.showLeaderboard && (
              <motion.div key="leader" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[320px]" : "min-h-[400px]"}>
                <SalesLeaderboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${gap}`}>
          <AnimatePresence mode="popLayout">
            {settings.showHeatmap && (
              <motion.div key="heatmap" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[260px]" : "min-h-[320px]"}>
                <RevenueHeatmap />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {settings.showFunnel && (
              <motion.div key="funnel" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[260px]" : "min-h-[320px]"}>
                <SalesFunnel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${gap}`}>
          <AnimatePresence mode="popLayout">
            {settings.showWaterfall && (
              <motion.div key="waterfall" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[280px]" : "min-h-[340px]"}>
                <WaterfallChart />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {settings.showRegions && (
              <motion.div key="regions" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[280px]" : "min-h-[340px]"}>
                <RegionPerformance />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${gap}`}>
          <AnimatePresence mode="popLayout">
            {settings.showClientMatrix && (
              <motion.div key="client" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[300px]" : "min-h-[380px]"}>
                <ClientMatrix />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {settings.showRevenueDonut && (
              <motion.div key="donut" variants={item} initial="hidden" animate="show" exit={animatedExit}
                className={compact ? "min-h-[300px]" : "min-h-[380px]"}>
                <RevenueDonut />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {presentationOpen && (
          <PresentationMode open={presentationOpen} onClose={() => setPresentationOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExecutiveOverview;
