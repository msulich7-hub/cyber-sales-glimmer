import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from "date-fns";
import {
  CalendarIcon, DollarSign, TrendingUp, TrendingDown, BarChart3, Handshake,
  Crown, Flame, X, Download, ArrowLeft, Star, Users, PieChart
} from "lucide-react";
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Brush, Cell, PieChart as RPieChart, Pie, Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import AnimatedNumber from "@/components/dashboard/AnimatedNumber";
import { dailySalesData, type DailySalesEntry } from "@/data/dailySalesData";
import { useNavigate } from "react-router-dom";

const formatCurrency = (v: number) => {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v}`;
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

type Preset = "7d" | "30d" | "thisMonth" | "lastMonth" | "custom";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const rev = payload.find((p: any) => p.dataKey === "revenue");
  const avg = payload.find((p: any) => p.dataKey === "rollingAvg");
  const entry = payload[0]?.payload;
  const delta = entry ? ((entry.revenue - entry.priorPeriodRevenue) / entry.priorPeriodRevenue * 100) : 0;
  const isUp = delta >= 0;

  return (
    <div className="glass-card p-3 min-w-[200px] border border-border/60" style={{ backdropFilter: "blur(20px)" }}>
      <p className="text-xs text-muted-foreground font-mono mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(160,84%,39%)" }} />
          <span className="text-xs text-muted-foreground">Revenue:</span>
          <span className="text-sm font-mono font-bold neon-text-green">{formatCurrency(rev?.value || 0)}</span>
        </div>
        {avg && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "hsl(38,92%,50%)" }} />
            <span className="text-xs text-muted-foreground">7d Avg:</span>
            <span className="text-sm font-mono font-semibold" style={{ color: "hsl(38,92%,50%)" }}>{formatCurrency(avg.value || 0)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 pt-1 border-t border-border/40">
          {isUp ? <TrendingUp className="w-3 h-3" style={{ color: "hsl(160,84%,39%)" }} /> : <TrendingDown className="w-3 h-3" style={{ color: "hsl(350,89%,60%)" }} />}
          <span className={`text-xs font-mono font-bold ${isUp ? "neon-text-green" : "neon-text-rose"}`}>
            {isUp ? "+" : ""}{delta.toFixed(1)}% vs prior
          </span>
        </div>
      </div>
    </div>
  );
};

const DailySalesView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<Preset>("30d");
  const today = new Date(2026, 2, 13);

  const getRange = useCallback((p: Preset): { from: Date; to: Date } => {
    switch (p) {
      case "7d": return { from: subDays(today, 6), to: today };
      case "30d": return { from: subDays(today, 29), to: today };
      case "thisMonth": return { from: startOfMonth(today), to: today };
      case "lastMonth": {
        const lm = subMonths(today, 1);
        return { from: startOfMonth(lm), to: endOfMonth(lm) };
      }
      default: return { from: subDays(today, 29), to: today };
    }
  }, []);

  const [dateRange, setDateRange] = useState(getRange("30d"));
  const [selectedDay, setSelectedDay] = useState<DailySalesEntry | null>(null);
  const [sortCol, setSortCol] = useState<string>("date");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const handlePreset = (p: Preset) => {
    setPreset(p);
    if (p !== "custom") {
      setDateRange(getRange(p));
      setSelectedDay(null);
    }
  };

  const filteredData = useMemo(() => {
    return dailySalesData.filter(d => {
      const date = parseISO(d.date);
      return isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
    });
  }, [dateRange]);

  // Compute rolling 7-day average
  const chartData = useMemo(() => {
    return filteredData.map((entry, i) => {
      const lookback = filteredData.slice(Math.max(0, i - 6), i + 1);
      const rollingAvg = Math.round(lookback.reduce((s, e) => s + e.revenue, 0) / lookback.length);
      return {
        ...entry,
        label: format(parseISO(entry.date), "MMM d"),
        rollingAvg,
      };
    });
  }, [filteredData]);

  // KPIs
  const kpis = useMemo(() => {
    if (!filteredData.length) return null;
    const totalRevenue = filteredData.reduce((s, d) => s + d.revenue, 0);
    const avgDaily = Math.round(totalRevenue / filteredData.length);
    const bestDay = filteredData.reduce((best, d) => d.revenue > best.revenue ? d : best, filteredData[0]);
    const totalDeals = filteredData.reduce((s, d) => s + d.deals, 0);
    return { totalRevenue, avgDaily, bestDay, totalDeals };
  }, [filteredData]);

  // Sparkline data helper
  const sparkline = useMemo(() => {
    const len = filteredData.length;
    const step = Math.max(1, Math.floor(len / 12));
    return filteredData.filter((_, i) => i % step === 0 || i === len - 1).map(d => ({ v: d.revenue }));
  }, [filteredData]);

  // Sorted table data
  const tableData = useMemo(() => {
    const avg = kpis?.avgDaily || 0;
    const bestDate = kpis?.bestDay?.date || "";
    const withMeta = filteredData.map((d, i) => {
      // Check consecutive growth
      let streak = 0;
      for (let j = i; j >= 1; j--) {
        if (filteredData[j].revenue > filteredData[j - 1].revenue) streak++;
        else break;
      }
      return { ...d, isAboveAvg: d.revenue >= avg, isBest: d.date === bestDate, streak };
    });
    const sorted = [...withMeta].sort((a, b) => {
      let va: any, vb: any;
      switch (sortCol) {
        case "date": va = a.date; vb = b.date; break;
        case "revenue": va = a.revenue; vb = b.revenue; break;
        case "deals": va = a.deals; vb = b.deals; break;
        case "delta": va = (a.revenue - a.priorPeriodRevenue) / a.priorPeriodRevenue; vb = (b.revenue - b.priorPeriodRevenue) / b.priorPeriodRevenue; break;
        default: va = a.date; vb = b.date;
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortCol, sortAsc, kpis]);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const exportCSV = () => {
    const header = "Date,Day,Revenue,Deals,Prior Period Revenue,Delta %\n";
    const rows = filteredData.map(d => {
      const delta = ((d.revenue - d.priorPeriodRevenue) / d.priorPeriodRevenue * 100).toFixed(1);
      return `${d.date},${format(parseISO(d.date), "EEE")},${d.revenue},${d.deals},${d.priorPeriodRevenue},${delta}%`;
    }).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-sales-${format(dateRange.from, "yyyy-MM-dd")}-to-${format(dateRange.to, "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported! 📊", description: `${filteredData.length} days exported to CSV.` });
  };

  const MiniSparkline = ({ data, color }: { data: { v: number }[]; color: string }) => (
    <ResponsiveContainer width="100%" height={32}>
      <ComposedChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-3 md:p-6">
        <div className="max-w-[1440px] mx-auto space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  const kpiCards = kpis ? [
    { label: "Total Revenue", value: kpis.totalRevenue, prefix: "$", color: "neon-text-green", icon: DollarSign, sparkColor: "hsl(160,84%,39%)" },
    { label: "Avg Daily Revenue", value: kpis.avgDaily, prefix: "$", color: "neon-text-blue", icon: BarChart3, sparkColor: "hsl(185,90%,48%)" },
    { label: "Best Day", value: kpis.bestDay.revenue, prefix: "$", color: "text-neon-amber", icon: Star, sparkColor: "hsl(38,92%,50%)", sub: format(parseISO(kpis.bestDay.date), "MMM d") },
    { label: "Total Deals", value: kpis.totalDeals, prefix: "", color: "neon-text-blue", icon: Handshake, sparkColor: "hsl(217,91%,60%)" },
  ] : [];

  const presets: { key: Preset; label: string }[] = [
    { key: "7d", label: "Last 7 days" },
    { key: "30d", label: "Last 30 days" },
    { key: "thisMonth", label: "This Month" },
    { key: "lastMonth", label: "Last Month" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1440px] mx-auto space-y-4">

        {/* TOP BAR */}
        <motion.div variants={item} className="glass-card p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/")}
                className="glass-card p-2 hover:border-primary/30 transition-all cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </motion.button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  Daily Sales <span className="neon-text-green">Intelligence</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">Deep-dive into day-by-day performance</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Presets */}
              {presets.map(p => (
                <Button key={p.key} variant={preset === p.key ? "default" : "outline"} size="sm"
                  onClick={() => handlePreset(p.key)}
                  className={cn("text-xs font-mono", preset === p.key && "neon-glow-green")}>
                  {p.label}
                </Button>
              ))}

              {/* Date pickers */}
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs font-mono gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {format(dateRange.from, "MMM d")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateRange.from}
                      onSelect={(d) => { if (d) { setDateRange(prev => ({ ...prev, from: d })); setPreset("custom"); } }}
                      className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-muted-foreground">—</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs font-mono gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {format(dateRange.to, "MMM d")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={dateRange.to}
                      onSelect={(d) => { if (d) { setDateRange(prev => ({ ...prev, to: d })); setPreset("custom"); } }}
                      className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Export */}
              <Button variant="outline" size="sm" onClick={exportCSV}
                className="text-xs font-mono gap-1 border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                <Download className="w-3 h-3" /> Export CSV
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI CARDS */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {kpiCards.map((kpi, i) => (
            <motion.div key={kpi.label} variants={item} whileHover={{ scale: 1.02, y: -2 }}
              className="glass-card p-4 border border-border/50 hover:border-primary/30 hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.12)] transition-all">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              </div>
              <AnimatedNumber value={kpi.value} prefix={kpi.prefix} className={`text-xl md:text-2xl font-bold font-mono ${kpi.color}`} />
              {kpi.sub && <span className="text-[10px] text-muted-foreground font-mono ml-1">({kpi.sub})</span>}
              <div className="mt-2 opacity-60">
                <MiniSparkline data={sparkline} color={kpi.sparkColor} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* MAIN CHART */}
        <motion.div variants={item} className="glass-card p-4 md:p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neon-green" /> Day-by-Day Revenue
          </h2>
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={chartData} onClick={(e: any) => {
              if (e?.activePayload?.[0]?.payload) {
                const entry = dailySalesData.find(d => d.date === e.activePayload[0].payload.date);
                if (entry) setSelectedDay(entry);
              }
            }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,17%)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160,84%,39%)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(160,84%,39%)" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38,92%,50%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(38,92%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="rollingAvg" fill="url(#areaGrad)" stroke="none" />
              <Bar dataKey="revenue" fill="url(#barGrad)" radius={[4, 4, 0, 0]} cursor="pointer">
                {chartData.map((entry) => (
                  <Cell key={entry.date}
                    fill={selectedDay?.date === entry.date ? "hsl(160,84%,55%)" : "url(#barGrad)"}
                    stroke={selectedDay?.date === entry.date ? "hsl(160,84%,39%)" : "none"}
                    strokeWidth={selectedDay?.date === entry.date ? 2 : 0} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="rollingAvg" stroke="hsl(38,92%,50%)" strokeWidth={2}
                strokeDasharray="6 3" dot={false} />
              <Brush dataKey="label" height={28} stroke="hsl(217,33%,25%)"
                fill="hsl(222,47%,8%)" travellerWidth={8} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* DATA TABLE */}
        <motion.div variants={item} className="glass-card p-4 md:p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-neon-blue" /> Daily Breakdown
          </h2>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card/90 backdrop-blur-sm z-10">
                <tr className="border-b border-border/50">
                  {[
                    { key: "date", label: "Date" },
                    { key: "dow", label: "Day" },
                    { key: "revenue", label: "Revenue" },
                    { key: "deals", label: "Deals" },
                    { key: "delta", label: "vs Prior" },
                    { key: "badge", label: "Badge" },
                  ].map(col => (
                    <th key={col.key} onClick={() => col.key !== "dow" && col.key !== "badge" && toggleSort(col.key)}
                      className={cn("text-left px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider font-medium",
                        col.key !== "dow" && col.key !== "badge" && "cursor-pointer hover:text-foreground transition-colors")}>
                      {col.label}
                      {sortCol === col.key && <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((d) => {
                  const delta = ((d.revenue - d.priorPeriodRevenue) / d.priorPeriodRevenue * 100);
                  const isUp = delta >= 0;
                  return (
                    <motion.tr key={d.date}
                      onClick={() => setSelectedDay(dailySalesData.find(e => e.date === d.date) || null)}
                      className={cn(
                        "border-b border-border/30 cursor-pointer transition-all duration-200",
                        "hover:shadow-[0_0_10px_hsl(var(--neon-blue)/0.08)]",
                        d.isAboveAvg ? "bg-neon-green/[0.03] hover:bg-neon-green/[0.07]" : "bg-neon-rose/[0.02] hover:bg-neon-rose/[0.05]",
                        selectedDay?.date === d.date && "ring-1 ring-neon-green/40 bg-neon-green/[0.08]"
                      )}
                      whileHover={{ scale: 1.002 }}>
                      <td className="px-3 py-2.5 font-mono text-xs">{format(parseISO(d.date), "MMM d, yyyy")}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{format(parseISO(d.date), "EEE")}</td>
                      <td className="px-3 py-2.5 font-mono text-xs font-semibold neon-text-green">{formatCurrency(d.revenue)}</td>
                      <td className="px-3 py-2.5 font-mono text-xs">{d.deals}</td>
                      <td className="px-3 py-2.5">
                        <span className={cn("inline-flex items-center gap-1 text-xs font-mono font-semibold",
                          isUp ? "neon-text-green" : "neon-text-rose")}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isUp ? "+" : ""}{delta.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          {d.isBest && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono"
                              style={{ background: "hsl(38,92%,50%,0.15)", color: "hsl(38,92%,50%)", border: "1px solid hsl(38,92%,50%,0.3)" }}>
                              <Crown className="w-3 h-3" /> Top Day
                            </span>
                          )}
                          {d.streak >= 3 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono"
                              style={{ background: "hsl(350,89%,60%,0.12)", color: "hsl(350,89%,60%)", border: "1px solid hsl(350,89%,60%,0.3)" }}>
                              <Flame className="w-3 h-3" /> {d.streak}d streak
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No data in selected range</p>
            </div>
          )}
        </motion.div>

        {/* DAY DETAIL PANEL */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold">
                      {format(parseISO(selectedDay.date), "EEEE, MMMM d, yyyy")}
                    </h2>
                    <span className="text-2xl font-bold font-mono neon-text-green">
                      {formatCurrency(selectedDay.revenue)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">({selectedDay.deals} deals)</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDay(null)}
                    className="glass-card p-2 hover:border-neon-rose/40 transition-all cursor-pointer">
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* 3-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                  {/* LEFT: Rep Performance */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-3">
                      <Users className="w-3 h-3" /> Rep Performance
                    </h3>
                    {selectedDay.repBreakdown.map((rep, i) => {
                      const share = selectedDay.revenue > 0 ? (rep.revenue / selectedDay.revenue * 100) : 0;
                      const isTop = i === 0 && rep.revenue > 0;
                      return (
                        <motion.div key={rep.repId} initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className={cn("flex items-center gap-3 p-2 rounded-lg transition-all",
                            rep.revenue === 0 ? "opacity-40" : "hover:bg-accent/30",
                            isTop && "gold-crown bg-neon-amber/[0.05]")}>
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold",
                            isTop ? "bg-neon-amber/20 text-neon-amber" : "bg-secondary text-muted-foreground")}>
                            {rep.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium truncate">{rep.repName}</span>
                              {isTop && <Crown className="w-3 h-3 text-neon-amber" />}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${share}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.05 }}
                                  className="h-full rounded-full"
                                  style={{ background: isTop ? "hsl(38,92%,50%)" : "hsl(160,84%,39%)" }} />
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground">{share.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-semibold neon-text-green">{formatCurrency(rep.revenue)}</span>
                            <p className="text-[10px] text-muted-foreground">{rep.deals} deals</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* MIDDLE: Top Clients */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-3">
                      <Handshake className="w-3 h-3" /> Client Transactions
                    </h3>
                    {selectedDay.clientBreakdown.map((client, i) => {
                      const maxRev = selectedDay.clientBreakdown[0]?.revenue || 1;
                      const barWidth = (client.revenue / maxRev) * 100;
                      return (
                        <motion.div key={client.clientName + i} initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="p-2 rounded-lg hover:bg-accent/30 transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium truncate flex-1">{client.clientName}</span>
                            <span className="text-xs font-mono font-semibold neon-text-green ml-2">{formatCurrency(client.revenue)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                                className="h-full rounded-full"
                                style={{ background: client.groupColor }} />
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono border border-border/50"
                              style={{ background: `${client.groupColor}15`, color: client.groupColor }}>
                              {client.accountingGroup.split(" ")[0]}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* RIGHT: Day Stats */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-3">
                      <PieChart className="w-3 h-3" /> Category Breakdown
                    </h3>
                    {/* Donut chart of accounting groups */}
                    {(() => {
                      const groups: Record<string, { value: number; color: string }> = {};
                      selectedDay.clientBreakdown.forEach(c => {
                        if (!groups[c.accountingGroup]) groups[c.accountingGroup] = { value: 0, color: c.groupColor };
                        groups[c.accountingGroup].value += c.revenue;
                      });
                      const pieData = Object.entries(groups).map(([name, { value, color }]) => ({ name: name.split(" ")[0], value, fill: color }));
                      return (
                        <ResponsiveContainer width="100%" height={180}>
                          <RPieChart>
                            <Pie data={pieData} dataKey="value" cx="50%" cy="50%"
                              innerRadius={45} outerRadius={70} strokeWidth={0} paddingAngle={2}>
                              {pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                            </Pie>
                            <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }}
                              formatter={(v) => <span className="text-muted-foreground text-[10px]">{v}</span>} />
                            <Tooltip formatter={(v: number) => formatCurrency(v)}
                              contentStyle={{ background: "hsl(222,47%,8%)", border: "1px solid hsl(217,33%,20%)", borderRadius: 8, fontSize: 11 }} />
                          </RPieChart>
                        </ResponsiveContainer>
                      );
                    })()}

                    {/* Revenue vs target */}
                    <div className="glass-card p-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>vs Daily Target</span>
                        <span className="font-mono">{formatCurrency(selectedDay.revenue)} / $22k</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, selectedDay.revenue / 22000 * 100)}%` }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full"
                          style={{ background: selectedDay.revenue >= 22000 ? "hsl(160,84%,39%)" : "hsl(38,92%,50%)" }} />
                      </div>
                      {selectedDay.revenue >= 22000 && (
                        <p className="text-[10px] neon-text-green mt-1 font-mono">✓ Target achieved</p>
                      )}
                    </div>

                    {/* Prior period comparison */}
                    <div className="glass-card p-3">
                      <p className="text-xs text-muted-foreground mb-2">vs Prior Period</p>
                      <div className="flex items-center gap-2">
                        <AnimatedNumber value={selectedDay.revenue} prefix="$" className="text-sm font-mono font-bold neon-text-green" />
                        <span className="text-xs text-muted-foreground">vs</span>
                        <span className="text-sm font-mono text-muted-foreground">{formatCurrency(selectedDay.priorPeriodRevenue)}</span>
                      </div>
                      {(() => {
                        const d = ((selectedDay.revenue - selectedDay.priorPeriodRevenue) / selectedDay.priorPeriodRevenue * 100);
                        return (
                          <span className={cn("text-xs font-mono font-bold mt-1 inline-flex items-center gap-1",
                            d >= 0 ? "neon-text-green" : "neon-text-rose")}>
                            {d >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {d >= 0 ? "+" : ""}{d.toFixed(1)}%
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default DailySalesView;
