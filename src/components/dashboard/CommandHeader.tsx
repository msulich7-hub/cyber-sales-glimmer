import { CalendarDays, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { kpis } from "@/data/mockData";

const CommandHeader = () => {
  const isGrowthPositive = kpis.yoyGrowth > 0;

  const kpiCards = [
    {
      label: "Total Revenue (YTD)",
      value: kpis.totalRevenueCY,
      prefix: "$",
      icon: DollarSign,
      accent: "neon-text-green",
    },
    {
      label: "CY vs PY",
      value: kpis.totalRevenueCY - kpis.totalRevenuePY,
      prefix: kpis.totalRevenueCY > kpis.totalRevenuePY ? "+$" : "-$",
      icon: BarChart3,
      accent: kpis.totalRevenueCY > kpis.totalRevenuePY ? "neon-text-green" : "neon-text-rose",
    },
    {
      label: "Daily Run Rate",
      value: kpis.dailyRunRate,
      prefix: "$",
      icon: Activity,
      accent: "neon-text-green",
    },
    {
      label: "YoY Growth",
      value: Math.abs(kpis.yoyGrowth),
      prefix: isGrowthPositive ? "+" : "-",
      suffix: "%",
      decimals: 1,
      icon: isGrowthPositive ? TrendingUp : TrendingDown,
      accent: isGrowthPositive ? "neon-text-green" : "neon-text-rose",
      badge: true,
    },
  ];

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Sales Analytics <span className="neon-text-green">Command Center</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time performance intelligence</p>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 py-2 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 text-neon-green" />
          <span className="font-mono">Jan 1, 2026 — Mar 9, 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-secondary/50 rounded-lg p-3 md:p-4 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix || ""}
                decimals={kpi.decimals || 0}
                className={`text-lg md:text-2xl font-bold font-mono ${kpi.accent}`}
              />
              {kpi.badge && (
                <span className={isGrowthPositive ? "badge-pulse-green" : "badge-pulse-rose"}>
                  {isGrowthPositive ? "▲" : "▼"}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommandHeader;
