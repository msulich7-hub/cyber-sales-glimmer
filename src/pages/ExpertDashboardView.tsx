import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getExpertDashboardModel, isExpertSlug, type ExpertSlug } from "@/data/expertDashboardData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const ExpertDashboardView = () => {
  const { slug } = useParams();

  const model = useMemo(() => {
    if (!slug || !isExpertSlug(slug)) return null;
    return getExpertDashboardModel(slug as ExpertSlug);
  }, [slug]);

  if (!slug || !isExpertSlug(slug)) {
    return <Navigate to="/showcase" replace />;
  }

  if (!model) return null;

  const accent = `hsl(${model.accentHsl})`;
  const trendHasBench = model.trend.some((t) => t.benchmark != null);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-[1440px] mx-auto px-3 md:px-6 py-3 flex items-center justify-between gap-3">
          <Link
            to="/showcase"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Biblioteka dashboardów
          </Link>
          <span className="text-xs font-mono text-muted-foreground truncate max-w-[50vw] text-right">{model.domain}</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1440px] mx-auto p-3 md:p-6 space-y-4 md:space-y-6"
      >
        <motion.div variants={item} className="glass-card p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-1">{model.domain}</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{model.title}</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{model.subtitle}</p>
            </div>
            <div
              className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border border-border/60 bg-card/40"
              style={{ borderColor: `${accent}55` }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
              Wzorzec Tableau: KPI → trend → breakdown → tabela → insights
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {model.kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-border/60 bg-card/30 p-3 md:p-4">
                <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
                <p className="text-lg md:text-xl font-mono font-semibold" style={{ color: accent }}>
                  {k.value}
                </p>
                <p
                  className={cn(
                    "text-xs mt-1 font-mono",
                    k.positive === false ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {k.deltaLabel}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <motion.div variants={item} className="glass-card p-4 md:p-6 min-h-[320px] flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Trend</h2>
              <p className="text-xs text-muted-foreground">{model.trendLabel}</p>
            </div>
            <div className="flex-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={model.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`fill-${model.slug}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="primary"
                    name="Wartość"
                    stroke={accent}
                    fill={`url(#fill-${model.slug})`}
                    strokeWidth={2}
                  />
                  {trendHasBench && (
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Benchmark"
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="6 4"
                      dot={false}
                      strokeWidth={2}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card p-4 md:p-6 min-h-[320px] flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Rozkład</h2>
              <p className="text-xs text-muted-foreground">{model.secondaryTitle}</p>
            </div>
            <div className="flex-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={model.breakdown}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} opacity={0.5} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={118}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" name="Wartość" fill={accent} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div variants={item} className="glass-card p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Szczegóły</h2>
          <Table>
            <TableHeader>
              <TableRow>
                {model.tableColumns.map((c) => (
                  <TableHead key={c.key} className={c.align === "right" ? "text-right" : ""}>
                    {c.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {model.tableRows.map((row, i) => (
                <TableRow key={i}>
                  {model.tableColumns.map((c) => (
                    <TableCell key={c.key} className={cn("font-mono text-xs md:text-sm", c.align === "right" && "text-right")}>
                      {row[c.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        <motion.div variants={item} className="glass-card p-4 md:p-6 border-l-4" style={{ borderLeftColor: accent }}>
          <h2 className="text-lg font-semibold mb-3">Insights (dobre praktyki jak w Tableau)</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {model.insights.map((line) => (
              <li key={line} className="flex gap-2">
                <span style={{ color: accent }} className="select-none">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ExpertDashboardView;
