import { motion } from "framer-motion";
import { Gauge, Zap, Target, TrendingUp, Users, DollarSign } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import { kpis } from "@/data/mockData";
import { funnelData, regionData } from "@/data/executiveData";

const GaugeRing = ({
  percentage,
  color,
  size = 72,
  strokeWidth = 5,
  label,
  value,
  suffix = "%",
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  value: number;
  suffix?: string;
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  const getGlowColor = () => {
    if (percentage >= 90) return "hsl(160, 84%, 39%)";
    if (percentage >= 70) return "hsl(38, 92%, 50%)";
    return "hsl(350, 89%, 60%)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-1.5 cursor-default"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(217, 33%, 14%)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getGlowColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 4px ${getGlowColor()})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedNumber
            value={value}
            suffix={suffix}
            decimals={suffix === "%" ? 0 : 0}
            className="text-xs font-bold font-mono text-foreground"
          />
        </div>
      </div>
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider text-center max-w-[72px] leading-tight">
        {label}
      </span>
    </motion.div>
  );
};

const PerformanceGauges = () => {
  const targetAchievement = Math.round((kpis.totalRevenueCY / (kpis.totalRevenuePY * 1.15)) * 100);
  const conversionRate = Math.round((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100);
  const avgSatisfaction = Math.round(regionData.reduce((s, r) => s + r.satisfaction, 0) / regionData.length);
  const avgConversion = Math.round(regionData.reduce((s, r) => s + r.conversion, 0) / regionData.length);
  const dealVelocity = 78; // mock
  const retention = 94; // mock

  const gauges = [
    { label: "Target Achievement", value: targetAchievement, percentage: targetAchievement, suffix: "%" },
    { label: "Pipeline Conv.", value: conversionRate, percentage: conversionRate * 3, suffix: "%" },
    { label: "CSAT Score", value: avgSatisfaction, percentage: avgSatisfaction, suffix: "%" },
    { label: "Deal Velocity", value: dealVelocity, percentage: dealVelocity, suffix: "%" },
    { label: "Avg Conversion", value: avgConversion, percentage: avgConversion * 3, suffix: "%" },
    { label: "Retention", value: retention, percentage: retention, suffix: "%" },
  ];

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Performance Gauges</h2>
            <p className="text-xs text-muted-foreground">Live KPI health indicators</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 place-items-center content-center">
        {gauges.map((g, i) => (
          <GaugeRing
            key={g.label}
            label={g.label}
            value={g.value}
            percentage={g.percentage}
            color="hsl(160, 84%, 39%)"
            suffix={g.suffix}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceGauges;
