import { motion } from "framer-motion";
import { Filter, ArrowRight } from "lucide-react";
import { funnelData } from "@/data/executiveData";
import AnimatedNumber from "./AnimatedNumber";

const SalesFunnel = () => {
  const maxVal = funnelData[0].value;

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-neon-blue" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Sales Pipeline</h2>
            <p className="text-xs text-muted-foreground">Conversion funnel · Q1 2026</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2">
        {funnelData.map((stage, i) => {
          const widthPct = (stage.value / maxVal) * 100;
          const convRate = i > 0 ? ((stage.value / funnelData[i - 1].value) * 100).toFixed(0) : null;

          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="flex items-center gap-3">
                <div className="w-full relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{stage.stage}</span>
                    <span className="text-xs font-mono text-foreground">
                      <AnimatedNumber value={stage.value} className="font-semibold" />
                    </span>
                  </div>
                  <div className="w-full h-8 bg-secondary/30 rounded-md overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ delay: i * 0.12 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-md relative overflow-hidden group-hover:brightness-125 transition-all duration-300"
                      style={{
                        background: `linear-gradient(90deg, ${stage.color}cc, ${stage.color})`,
                        boxShadow: `0 0 12px ${stage.color}40`,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${stage.color}30, transparent)`,
                          animation: "shimmer 2s ease-in-out infinite",
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
              {convRate && (
                <div className="flex items-center gap-1 mt-0.5 ml-1">
                  <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {convRate}% conversion
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Overall conversion</span>
        <span className="text-sm font-mono font-bold neon-text-green">
          {((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default SalesFunnel;
