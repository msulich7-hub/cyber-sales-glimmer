import { useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { heatmapData } from "@/data/executiveData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getHeatColor = (value: number, max: number) => {
  if (value === 0) return "hsl(var(--secondary))";
  const ratio = value / max;
  if (ratio > 0.8) return "hsl(160, 84%, 39%)";
  if (ratio > 0.6) return "hsl(160, 84%, 30%)";
  if (ratio > 0.4) return "hsl(160, 60%, 22%)";
  if (ratio > 0.2) return "hsl(185, 50%, 18%)";
  return "hsl(217, 33%, 14%)";
};

const getGlow = (value: number, max: number) => {
  const ratio = value / max;
  if (ratio > 0.8) return "0 0 8px hsl(160, 84%, 39%, 0.4)";
  return "none";
};

const RevenueHeatmap = () => {
  const allValues = heatmapData.flatMap((w) => w.days.map((d) => d.value)).filter(Boolean);
  const maxVal = Math.max(...allValues);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-neon-green" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Revenue Heatmap</h2>
            <p className="text-xs text-muted-foreground">Daily intensity · Q1 2026</p>
          </div>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Low</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((r) => (
            <div
              key={r}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getHeatColor(r * maxVal, maxVal) }}
            />
          ))}
          <span>High</span>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex-1 flex flex-col gap-[3px]">
          {/* Day headers */}
          <div className="flex gap-[3px] ml-8">
            {heatmapData.map((w) => (
              <div key={w.week} className="flex-1 text-center text-[9px] text-muted-foreground font-mono">
                W{w.week}
              </div>
            ))}
          </div>

          {dayLabels.map((dayName, dayIdx) => (
            <div key={dayName} className="flex gap-[3px] items-center">
              <span className="w-7 text-[10px] text-muted-foreground font-mono shrink-0">{dayName}</span>
              {heatmapData.map((week) => {
                const cell = week.days[dayIdx];
                return (
                  <Tooltip key={`${week.week}-${dayIdx}`}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (week.week * 7 + dayIdx) * 0.008 }}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        className="flex-1 aspect-square rounded-sm cursor-pointer transition-all duration-150"
                        style={{
                          backgroundColor: getHeatColor(cell.value, maxVal),
                          boxShadow: getGlow(cell.value, maxVal),
                          minHeight: "14px",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="glass-card border border-border text-xs font-mono p-2">
                      <p className="font-sans font-medium text-foreground mb-1">{cell.label}</p>
                      {cell.value > 0 ? (
                        <p className="neon-text-green">${cell.value.toLocaleString()}</p>
                      ) : (
                        <p className="text-muted-foreground italic font-sans">No data</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default RevenueHeatmap;
