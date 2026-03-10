import { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Target } from "lucide-react";
import { forecastData } from "@/data/executiveData";

const ForecastTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="glass-card p-3 border border-border text-xs font-mono shadow-2xl min-w-[170px]">
      <p className="text-foreground font-sans font-medium mb-2 text-sm">{d.month} 2026</p>
      <div className="space-y-1.5">
        {d.actual !== null && (
          <div className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neon-green" />
              Actual
            </span>
            <span className="font-semibold text-foreground">${(d.actual / 1000).toFixed(0)}k</span>
          </div>
        )}
        {d.forecast !== null && (
          <>
            <div className="flex justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-purple" />
                Forecast
              </span>
              <span className="neon-text-purple">${(d.forecast / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex justify-between gap-4 text-muted-foreground">
              <span>Range</span>
              <span>${(d.lower / 1000).toFixed(0)}k – ${(d.upper / 1000).toFixed(0)}k</span>
            </div>
          </>
        )}
        <div className="flex justify-between gap-4 border-t border-border pt-1.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-amber" />
            Target
          </span>
          <span className="text-neon-amber">${(d.target / 1000).toFixed(0)}k</span>
        </div>
      </div>
    </div>
  );
};

const ForecastChart = () => {
  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-neon-purple" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Revenue Forecast</h2>
            <p className="text-xs text-muted-foreground">Actuals + AI projection with confidence bands</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-neon-amber" />
          <span className="text-xs font-mono text-neon-amber">Annual Target</span>
        </div>
      </div>

      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 13%)" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ForecastTooltip />} />

            {/* Confidence band */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#forecastBand)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="hsl(var(--background))"
              animationDuration={1500}
            />

            {/* Target line */}
            <Line
              type="monotone"
              dataKey="target"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
              animationDuration={1200}
            />

            {/* Actual revenue */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2.5}
              fill="url(#actualGrad)"
              dot={{ r: 4, fill: "hsl(160, 84%, 39%)", stroke: "hsl(222, 47%, 8%)", strokeWidth: 2 }}
              animationDuration={1200}
              connectNulls={false}
            />

            {/* Forecast line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="hsl(270, 70%, 60%)"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={{ r: 3, fill: "hsl(270, 70%, 60%)", stroke: "hsl(222, 47%, 8%)", strokeWidth: 2 }}
              animationDuration={1500}
              connectNulls={false}
            />

            {/* "Now" divider */}
            <ReferenceLine
              x="Mar"
              stroke="hsl(215, 20%, 35%)"
              strokeDasharray="3 3"
              label={{
                value: "NOW",
                position: "top",
                fill: "hsl(215, 20%, 55%)",
                fontSize: 9,
                fontFamily: "JetBrains Mono",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full bg-neon-green" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0 border-t-[2px] border-dashed border-neon-purple" />
          <span>Forecast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-neon-purple/15" />
          <span>Confidence Band</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0 border-t-[1.5px] border-dashed border-neon-amber" />
          <span>Target</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
