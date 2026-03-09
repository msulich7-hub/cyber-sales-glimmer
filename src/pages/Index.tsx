import { motion } from "framer-motion";
import CommandHeader from "@/components/dashboard/CommandHeader";
import TimeMachineChart from "@/components/dashboard/TimeMachineChart";
import SalesLeaderboard from "@/components/dashboard/SalesLeaderboard";
import ClientMatrix from "@/components/dashboard/ClientMatrix";
import RevenueDonut from "@/components/dashboard/RevenueDonut";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1440px] mx-auto space-y-4"
      >
        <motion.div variants={item}>
          <CommandHeader />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Hero chart spans 2 cols */}
          <motion.div variants={item} className="lg:col-span-2 min-h-[400px]">
            <TimeMachineChart />
          </motion.div>

          {/* Leaderboard */}
          <motion.div variants={item} className="min-h-[400px]">
            <SalesLeaderboard />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Client Matrix */}
          <motion.div variants={item} className="min-h-[380px]">
            <ClientMatrix />
          </motion.div>

          {/* Revenue Donut */}
          <motion.div variants={item} className="min-h-[380px]">
            <RevenueDonut />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
