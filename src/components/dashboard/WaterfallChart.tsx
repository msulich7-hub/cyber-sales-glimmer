import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { waterfallData } from "@/data/executiveData";
import AnimatedNumber from "./AnimatedNumber";

const WaterfallChart = () => {
  // Compute cumulative positions for the waterfall
  let running = 0;
  const computed = waterfallData.map((item) => {
    if (item.type === "start") {
      running = item.value;
      return { ...item, bottom: 0, height: item.value };
    }
    if (item.type === "total") {
      return { ...item, bottom: 0, height: item.value };
    }
    const bottom = item.value > 0 ? running : running + item.value;
    running += item.value;
    return { ...item, bottom, height: Math.abs(item.value) };
  });

  const maxVal = Math.max(...computed.map((c) => c.bottom + c.height));

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-amber/10 border border-neon-amber/20 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-neon-amber" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Revenue Bridge</h2>
            <p className="text-xs text-muted-foreground">Q4 2025 → Q1 2026 waterfall</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end gap-1.5 md:gap-3 min-h-[200px]">
        {computed.map((item, i) => {
          const totalHeight = 100;
          const barHeightPct = (item.height / maxVal) * totalHeight;
          const bottomPct = (item.bottom / maxVal) * totalHeight;

          const color =
            item.type === "increase"
              ? "hsl(160, 84%, 39%)"
              : item.type === "decrease"
              ? "hsl(350, 89%, 60%)"
              : "hsl(217, 91%, 60%)";

          const glowColor =
            item.type === "increase"
              ? "hsl(160, 84%, 39%, 0.3)"
              : item.type === "decrease"
              ? "hsl(350, 89%, 60%, 0.3)"
              : "hsl(217, 91%, 60%, 0.3)";

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              style={{ originY: 1 }}
              className="flex-1 flex flex-col items-center group cursor-default"
            >
              <div className="text-[10px] font-mono font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color }}
              >
                {item.type === "decrease" ? "-" : item.type === "increase" ? "+" : ""}
                ${(Math.abs(item.value) / 1000).toFixed(0)}k
              </div>
              <div className="w-full relative" style={{ height: "180px" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeightPct}%` }}
                  transition={{ delay: i * 0.12 + 0.3, duration: 0.7, ease: "easeOut" }}
                  className="absolute left-0 right-0 rounded-t-md group-hover:brightness-125 transition-all duration-200"
                  style={{
                    bottom: `${bottomPct}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${glowColor}`,
                  }}
                />
              </div>
              <span className="text-[9px] md:text-[10px] text-muted-foreground mt-1.5 text-center leading-tight font-medium">
                {item.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Net change</span>
        <span className="text-sm font-mono font-bold neon-text-green">
          +$<AnimatedNumber value={waterfallData[waterfallData.length - 1].value - waterfallData[0].value} />
        </span>
      </div>
    </div>
  );
};

export default WaterfallChart;
