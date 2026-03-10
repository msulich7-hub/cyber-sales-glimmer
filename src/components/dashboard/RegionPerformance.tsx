import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";
import { regionData } from "@/data/executiveData";
import AnimatedNumber from "./AnimatedNumber";
import { Progress } from "@/components/ui/progress";

const RegionPerformance = () => {
  const totalRevenue = regionData.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Regional Performance</h2>
            <p className="text-xs text-muted-foreground">Revenue by geography</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {regionData.map((region, i) => {
          const pct = (region.revenue / region.target) * 100;
          const shareOfTotal = (region.revenue / totalRevenue) * 100;
          const isGrowing = region.growth > 0;

          return (
            <motion.div
              key={region.region}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="glass-card-interactive p-3 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{region.region}</span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isGrowing
                        ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                        : "bg-neon-rose/10 text-neon-rose border border-neon-rose/20"
                    }`}
                  >
                    {isGrowing ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {Math.abs(region.growth)}%
                  </span>
                </div>
                <span className="text-sm font-mono font-bold neon-text-green">
                  <AnimatedNumber value={region.revenue} prefix="$" />
                </span>
              </div>

              <Progress value={Math.min(pct, 100)} className="h-1.5 bg-secondary" />

              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground font-mono">
                <div className="flex gap-3">
                  <span>{region.deals} deals</span>
                  <span>{region.conversion}% conv.</span>
                  <span>{region.satisfaction}% CSAT</span>
                </div>
                <span>{shareOfTotal.toFixed(0)}% of total</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionPerformance;
