import { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Eye, CalendarDays } from "lucide-react";
import { marchData, currentDay } from "@/data/marchData";

const GhostTooltip = ({ active, payload, showPY }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const cy = d.cyDaily;
  const py = d.pyDaily;
  const isFuture = cy === null;
  const delta = cy != null && py > 0 ? ((cy - py) / py) * 100 : null;

  return (
    <div className="glass-card p-3 border border-border text-xs font-mono shadow-2xl min-w-[160px]">
      <p className="text-foreground font-sans font-medium mb-2 text-sm">{d.label}</p>
      <div className="space-y-1.5">
        {isFuture ? (
          <span className="text-muted-foreground italic font-sans text-[11px]">No data yet</span>
        ) : (
          <div className="flex justify-between gap-4 items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neon-green" />
              CY 2026
            </span>
            <span className="text-foreground font-semibold">${cy?.toLocaleString()}</span>
          </div>
        )}
        {showPY && (
          <div className="flex justify-between gap-4 items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neon-blue" />
              PY 2025
            </span>
            <span className="text-muted-foreground">${py?.toLocaleString()}</span>
          </div>
        )}
        {delta !== null && showPY && (
          <div className="border-t border-border pt-1.5 flex justify-between items-center">
            <span className="text-muted-foreground">vs PY</span>
            <span className={delta >= 0 ? "neon-text-green font-semibold" : "neon-text-rose font-semibold"}>
              {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const TodayLabel = ({ viewBox }: any) => {
  const { x } = viewBox;
  return (
    <g>
      <foreignObject x={x - 28} y={4} width={56} height={22}>
        <div className="badge-pulse-green text-[9px] text-center px-1.5 py-0.5 rounded-full">
          TODAY
        </div>
      </foreignObject>
    </g>
  );
};

const MonthGhostChart = () => {
  const [showPY, setShowPY] = useState(false);

  return (
    <div className="glass-card p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-neon-green" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">March 2026 — Day by Day</h2>
            <p className="text-xs text-muted-foreground">Granular daily revenue with ghost overlay</p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3 glass-card px-4 py-2.5 rounded-lg">
          <Eye className="w-4 h-4 text-neon-blue" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">Overlay PY</span>
          <Switch
            checked={showPY}
            onCheckedChange={setShowPY}
            className="data-[state=checked]:bg-neon-blue"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={marchData} margin={{ top: 28, right: 8, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 84%, 45%)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="hsl(160, 84%, 25%)" stopOpacity={0.6} />
              </linearGradient>
              <filter id="glowLine">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 13%)" vertical={false} />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "hsl(215, 20%, 50%)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickFormatter={(v) => (v % 5 === 0 || v === 1 ? `${v}` : "")}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215, 20%, 50%)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={<GhostTooltip showPY={showPY} />}
              cursor={{ fill: "hsl(217, 33%, 10%)", radius: 4 }}
            />

            {/* Today reference line */}
            <ReferenceLine
              x={currentDay}
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={<TodayLabel />}
            />

            {/* CY Bars */}
            <Bar
              dataKey="cyDaily"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
              animationDuration={1000}
            />

            {/* PY Ghost Line */}
            {showPY && (
              <Line
                dataKey="pyDaily"
                type="monotone"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                filter="url(#glowLine)"
                animationDuration={1200}
                animationEasing="ease-in-out"
                isAnimationActive={true}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(to bottom, hsl(160,84%,45%), hsl(160,84%,25%))" }} />
          <span>CY 2026 Daily Revenue</span>
        </div>
        <AnimatePresence>
          {showPY && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-0 border-t-2 border-dashed border-neon-blue" />
              <span>PY 2025 Ghost Layer</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MonthGhostChart;
