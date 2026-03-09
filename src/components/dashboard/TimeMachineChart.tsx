import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart,
} from "recharts";
import { motion } from "framer-motion";
import { dailyData } from "@/data/mockData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const cy = payload.find((p: any) => p.dataKey.startsWith("cy"))?.value || 0;
  const py = payload.find((p: any) => p.dataKey.startsWith("py"))?.value || 0;
  const variance = cy - py;
  const variancePct = py > 0 ? ((variance / py) * 100).toFixed(1) : "N/A";

  return (
    <div className="glass-card p-3 border border-border text-xs font-mono shadow-2xl">
      <p className="text-muted-foreground mb-2 font-sans font-medium">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-6">
          <span className="text-neon-green">● CY 2026</span>
          <span className="text-foreground">${cy.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">◌ PY 2025</span>
          <span className="text-muted-foreground">${py.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-1 flex justify-between gap-6">
          <span className="text-muted-foreground">Variance</span>
          <span className={variance >= 0 ? "neon-text-green" : "neon-text-rose"}>
            {variance >= 0 ? "+" : ""}${variance.toLocaleString()} ({variancePct}%)
          </span>
        </div>
      </div>
    </div>
  );
};

const TimeMachineChart = () => {
  const [mode, setMode] = useState<"daily" | "cumulative">("cumulative");

  const cyKey = mode === "daily" ? "cyDaily" : "cyCumulative";
  const pyKey = mode === "daily" ? "pyDaily" : "pyCumulative";

  // Sample data for performance (show every 3rd day)
  const chartData = dailyData.filter((_, i) => i % 2 === 0 || i === dailyData.length - 1);

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold">The Time Machine</h2>
          <p className="text-xs text-muted-foreground">Day-by-day CY vs PY comparison</p>
        </div>
        <div className="flex bg-secondary/80 rounded-lg p-0.5 border border-border/50">
          {(["daily", "cumulative"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === m
                  ? "bg-primary/20 text-primary border border-primary/30 neon-glow-green"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "daily" ? "Daily" : "Cumulative (YTD)"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="cyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(217, 33%, 15%)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
              tickLine={false}
              axisLine={false}
              interval={mode === "daily" ? 6 : 10}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={cyKey}
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#cyGradient)"
              dot={false}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey={pyKey}
              stroke="hsl(215, 20%, 45%)"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeMachineChart;
