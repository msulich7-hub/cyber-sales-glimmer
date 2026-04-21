/**
 * Deterministic mock datasets for "expert" dashboard showcases.
 * Layout patterns follow common Tableau best practices: KPI band → trend → breakdown → detail table → narrative.
 */

export type ExpertSlug =
  | "finance-controller"
  | "exec-strategy"
  | "sales-performance"
  | "marketing-attribution"
  | "customer-success"
  | "product-analytics"
  | "operations-efficiency"
  | "hr-workforce"
  | "supply-chain"
  | "inventory-warehousing"
  | "manufacturing-oee"
  | "healthcare-quality"
  | "retail-store-ops"
  | "education-outcomes"
  | "real-estate-portfolio"
  | "cx-nps-voc"
  | "risk-compliance"
  | "sustainability-esg"
  | "it-cyber-soc"
  | "support-ticketing";

export interface KpiCard {
  label: string;
  value: string;
  deltaLabel: string;
  positive?: boolean;
}

export interface TrendPoint {
  period: string;
  primary: number;
  benchmark?: number;
}

export interface BreakdownItem {
  name: string;
  value: number;
}

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "right";
}

export interface ExpertDashboardModel {
  slug: ExpertSlug;
  domain: string;
  title: string;
  subtitle: string;
  accentHsl: string;
  kpis: KpiCard[];
  trend: TrendPoint[];
  trendLabel: string;
  secondaryTitle: string;
  breakdown: BreakdownItem[];
  tableColumns: TableColumn[];
  tableRows: Record<string, string | number>[];
  insights: string[];
}

function seedFromSlug(slug: string): number {
  let h = 1779033703;
  for (let i = 0; i < slug.length; i++) {
    h = Math.imul(h ^ slug.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatUsd(n: number, compact = true): string {
  if (compact && Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (compact && Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}

function formatPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

function buildTrend(seed: number, periods: string[], base: number, volatility: number): TrendPoint[] {
  const rand = mulberry32(seed);
  let v = base;
  return periods.map((period) => {
    const drift = (rand() - 0.48) * volatility;
    v = Math.max(0, v * (1 + drift / 100));
    const bench = v * (0.92 + rand() * 0.08);
    return { period, primary: Math.round(v), benchmark: Math.round(bench) };
  });
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function listExpertSlugs(): ExpertSlug[] {
  return [
    "finance-controller",
    "exec-strategy",
    "sales-performance",
    "marketing-attribution",
    "customer-success",
    "product-analytics",
    "operations-efficiency",
    "hr-workforce",
    "supply-chain",
    "inventory-warehousing",
    "manufacturing-oee",
    "healthcare-quality",
    "retail-store-ops",
    "education-outcomes",
    "real-estate-portfolio",
    "cx-nps-voc",
    "risk-compliance",
    "sustainability-esg",
    "it-cyber-soc",
    "support-ticketing",
  ];
}

export function getExpertDashboardMeta(slug: ExpertSlug): {
  domain: string;
  title: string;
  subtitle: string;
  accentHsl: string;
} {
  const m = getExpertDashboardModel(slug);
  return { domain: m.domain, title: m.title, subtitle: m.subtitle, accentHsl: m.accentHsl };
}

export function getExpertDashboardModel(slug: ExpertSlug): ExpertDashboardModel {
  const seed = seedFromSlug(slug);
  const rand = mulberry32(seed);
  const periods = MONTHS_SHORT.slice(0, 12);

  const base = (): ExpertDashboardModel => ({
    slug,
    domain: "",
    title: "",
    subtitle: "",
    accentHsl: "160 84% 39%",
    kpis: [],
    trend: [],
    trendLabel: "",
    secondaryTitle: "",
    breakdown: [],
    tableColumns: [],
    tableRows: [],
    insights: [],
  });

  const mkBreakdown = (labels: string[], scale: number): BreakdownItem[] =>
    labels.map((name, i) => ({
      name,
      value: Math.round(scale * (0.55 + rand() * 0.9) * (1 - i * 0.06)),
    }));

  switch (slug) {
    case "finance-controller": {
      const trend = buildTrend(seed + 1, periods, 2_400_000, 2.2);
      return {
        ...base(),
        domain: "Finance & FP&A",
        title: "Close Readiness & Cash Discipline",
        subtitle: "Variance vs forecast, liquidity guardrails, and working-capital levers — Tableau-style executive band.",
        accentHsl: "160 84% 39%",
        kpis: [
          { label: "FCF (TTM)", value: formatUsd(18_200_000), deltaLabel: "+6.1% vs plan", positive: true },
          { label: "DSO", value: "41 days", deltaLabel: "−3d vs Q4", positive: true },
          { label: "OpEx ratio", value: "24.8%", deltaLabel: "+40 bps YoY", positive: false },
          { label: "Forecast accuracy", value: "96.4%", deltaLabel: "+1.1pp", positive: true },
        ],
        trend,
        trendLabel: "Cash from operations (12 mo.)",
        secondaryTitle: "Spend by function (mock)",
        breakdown: mkBreakdown(["R&D", "GTM", "G&A", "COGS", "CapEx"], 3_200_000),
        tableColumns: [
          { key: "entity", label: "Entity" },
          { key: "variance", label: "Var vs FC", align: "right" },
          { key: "owner", label: "Owner" },
        ],
        tableRows: [
          { entity: "NA Commercial", variance: formatPct(1.8), owner: "FP&A" },
          { entity: "EMEA", variance: formatPct(-0.9), owner: "Controller" },
          { entity: "APAC", variance: formatPct(2.4), owner: "Regional CFO" },
          { entity: "Corp", variance: formatPct(0.3), owner: "HQ" },
        ],
        insights: [
          "Keep the KPI band to four tiles; push drill-downs to the table to reduce cognitive load.",
          "Pair a cash trend with a benchmark (plan or prior year) to mirror Tableau reference lines.",
          "Use consistent currency scaling in tooltips — avoid mixing raw and compact formats on one sheet.",
        ],
      };
    }
    case "exec-strategy": {
      const trend = buildTrend(seed + 2, periods, 112, 1.4);
      return {
        ...base(),
        domain: "Strategy & Board",
        title: "North-Star Scorecard",
        subtitle: "One narrative line: growth, profitability, retention, and strategic initiative progress.",
        accentHsl: "217 91% 60%",
        kpis: [
          { label: "Rule of 40", value: "47", deltaLabel: "+2 pts QoQ", positive: true },
          { label: "NRR", value: "121%", deltaLabel: "+3pp YoY", positive: true },
          { label: "Gross margin", value: "78.2%", deltaLabel: "+0.6pp", positive: true },
          { label: "Strategic OKRs on track", value: "73%", deltaLabel: "4 at risk", positive: false },
        ],
        trend: trend.map((p) => ({ ...p, primary: p.primary, benchmark: p.benchmark ? p.benchmark * 0.95 : undefined })),
        trendLabel: "Composite strategy index (indexed)",
        secondaryTitle: "Initiative funding mix",
        breakdown: mkBreakdown(["Core growth", "Innovation", "Efficiency", "M&A"], 4200),
        tableColumns: [
          { key: "initiative", label: "Initiative" },
          { key: "status", label: "RAG" },
          { key: "impact", label: "Impact", align: "right" },
        ],
        tableRows: [
          { initiative: "Enterprise land motion", status: "Green", impact: "High" },
          { initiative: "Self-serve expansion", status: "Amber", impact: "Med" },
          { initiative: "Partner channel", status: "Green", impact: "Med" },
          { initiative: "Cost structure program", status: "Red", impact: "High" },
        ],
        insights: [
          "Board packs work best with a single headline KPI row and one primary time series.",
          "Use RAG in tables sparingly — reserve it for exceptions that need decisions.",
          "Avoid duplicating the same metric as both KPI and chart unless the chart adds a time dimension.",
        ],
      };
    }
    case "sales-performance": {
      const trend = buildTrend(seed + 3, periods, 9_200_000, 2.8);
      return {
        ...base(),
        domain: "Revenue & Sales",
        title: "Pipeline Hygiene & Coverage",
        subtitle: "Rep performance, stage conversion, and forecast risk in one glance.",
        accentHsl: "38 92% 50%",
        kpis: [
          { label: "Bookings (QTD)", value: formatUsd(24_100_000), deltaLabel: formatPct(11.2) + " vs plan", positive: true },
          { label: "Coverage", value: "3.1×", deltaLabel: "Target 3.0×", positive: true },
          { label: "Slip rate", value: "6.8%", deltaLabel: "−0.9pp", positive: true },
          { label: "Win rate", value: "29%", deltaLabel: "+1.4pp", positive: true },
        ],
        trend,
        trendLabel: "Bookings vs benchmark (12 mo.)",
        secondaryTitle: "Pipeline by stage",
        breakdown: mkBreakdown(["Qualify", "Discovery", "Proposal", "Negotiate", "Closed"], 5_500_000),
        tableColumns: [
          { key: "segment", label: "Segment" },
          { key: "ae", label: "AE count", align: "right" },
          { key: "quota", label: "Quota attainment", align: "right" },
        ],
        tableRows: [
          { segment: "Enterprise", ae: 42, quota: "104%" },
          { segment: "Mid-market", ae: 68, quota: "97%" },
          { segment: "SMB", ae: 31, quota: "112%" },
          { segment: "Partners", ae: 12, quota: "88%" },
        ],
        insights: [
          "Tableau sales dashboards often anchor on bookings trend + stage breakdown — mirror that pairing here.",
          "Keep stage labels short; long names break horizontal bar readability.",
          "Surface slip rate alongside coverage to explain forecast uncertainty without extra tabs.",
        ],
      };
    }
    case "marketing-attribution": {
      const trend = buildTrend(seed + 4, periods, 540_000, 3.1);
      return {
        ...base(),
        domain: "Marketing",
        title: "Acquisition Efficiency & CAC Payback",
        subtitle: "Channel mix, blended CAC, and pipeline contribution — optimized for weekly reviews.",
        accentHsl: "280 70% 55%",
        kpis: [
          { label: "Blended CAC", value: formatUsd(1280), deltaLabel: "−6% QoQ", positive: true },
          { label: "Payback", value: "11 mo.", deltaLabel: "−0.6 mo.", positive: true },
          { label: "MQL → SQL", value: "34%", deltaLabel: "+2.1pp", positive: true },
          { label: "Brand SOV", value: "19%", deltaLabel: "+1.2pp", positive: true },
        ],
        trend,
        trendLabel: "Paid spend (12 mo.)",
        secondaryTitle: "Pipeline $ by channel",
        breakdown: mkBreakdown(["Paid search", "Social", "Events", "Content", "Partners"], 1_800_000),
        tableColumns: [
          { key: "campaign", label: "Campaign" },
          { key: "cpa", label: "CPA", align: "right" },
          { key: "roi", label: "ROI proxy", align: "right" },
        ],
        tableRows: [
          { campaign: "Q1 enterprise push", cpa: formatUsd(980), roi: "4.2×" },
          { campaign: "Dev community", cpa: formatUsd(420), roi: "6.8×" },
          { campaign: "Webinar series", cpa: formatUsd(760), roi: "3.1×" },
          { campaign: "Retargeting", cpa: formatUsd(210), roi: "2.4×" },
        ],
        insights: [
          "Attribution dashboards benefit from one spend trend and one outcome breakdown — avoid triple counting KPIs.",
          "Use the same time grain in trend and table (e.g., monthly) to prevent reconciliation confusion.",
          "Keep CPA and payback adjacent; they tell one story for finance and marketing alignment.",
        ],
      };
    }
    case "customer-success": {
      const trend = buildTrend(seed + 5, periods, 42, 1.1);
      return {
        ...base(),
        domain: "Customer Success",
        title: "Health, Adoption, Expansion",
        subtitle: "Leading indicators of churn risk and expansion readiness across cohorts.",
        accentHsl: "185 90% 48%",
        kpis: [
          { label: "Gross churn", value: "4.9%", deltaLabel: "−0.4pp", positive: true },
          { label: "NPS (rolling)", value: "54", deltaLabel: "+6", positive: true },
          { label: "Time-to-value", value: "18 days", deltaLabel: "−3d", positive: true },
          { label: "Expansion ARR", value: formatUsd(6_700_000), deltaLabel: formatPct(22) + " YoY", positive: true },
        ],
        trend: trend.map((p) => ({ period: p.period, primary: p.primary / 100_000, benchmark: p.benchmark ? p.benchmark / 100_000 : undefined })),
        trendLabel: "Adoption index (normalized)",
        secondaryTitle: "Tickets by severity (mock)",
        breakdown: mkBreakdown(["P1", "P2", "P3", "P4"], 1200),
        tableColumns: [
          { key: "cohort", label: "Cohort" },
          { key: "health", label: "Avg health", align: "right" },
          { key: "risk", label: "At-risk %", align: "right" },
        ],
        tableRows: [
          { cohort: "2025 Q4", health: "78", risk: "6%" },
          { cohort: "2025 Q3", health: "74", risk: "9%" },
          { cohort: "2025 Q2", health: "71", risk: "11%" },
          { cohort: "Enterprise", health: "81", risk: "4%" },
        ],
        insights: [
          "CS dashboards should separate leading (usage) from lagging (churn) — here adoption index leads the story.",
          "Heat-style breakdowns work well for ticket severity; keep ordering consistent week to week.",
          "Add cohort tables only when the row count stays scannable (≤8 rows on executive view).",
        ],
      };
    }
    case "product-analytics": {
      const trend = buildTrend(seed + 6, periods, 128_000, 2.5);
      return {
        ...base(),
        domain: "Product",
        title: "Activation & Feature Adoption",
        subtitle: "Funnel health, WAU/MAU stickiness, and release impact tracking.",
        accentHsl: "350 89% 60%",
        kpis: [
          { label: "WAU/MAU", value: "38%", deltaLabel: "+2.4pp", positive: true },
          { label: "D7 activation", value: "44%", deltaLabel: "+3.1pp", positive: true },
          { label: "Time-to-aha", value: "6m 12s", deltaLabel: "−48s", positive: true },
          { label: "Error rate", value: "0.38%", deltaLabel: "+5 bps", positive: false },
        ],
        trend,
        trendLabel: "Weekly active users (000s)",
        secondaryTitle: "Top features by adoption",
        breakdown: mkBreakdown(["Workflows", "Reports", "Integrations", "API", "Mobile"], 48_000),
        tableColumns: [
          { key: "release", label: "Release" },
          { key: "delta", label: "Δ activation", align: "right" },
          { key: "note", label: "Notes" },
        ],
        tableRows: [
          { release: "R24.3", delta: "+1.8pp", note: "Onboarding v2" },
          { release: "R24.2", delta: "+0.6pp", note: "Perf wins" },
          { release: "R24.1", delta: "+0.2pp", note: "Bugfix train" },
          { release: "R23.12", delta: "+2.1pp", note: "New templates" },
        ],
        insights: [
          "Product analytics dashboards often fail when every chart is a funnel — diversify with one usage trend.",
          "Pair activation with error rate to catch quality regressions early.",
          "Keep release notes textual but short; executives want the delta, not the changelog.",
        ],
      };
    }
    case "operations-efficiency": {
      const trend = buildTrend(seed + 7, periods, 92, 0.9);
      return {
        ...base(),
        domain: "Operations",
        title: "Throughput & SLA Attainment",
        subtitle: "Cycle times, backlog aging, and capacity — operations control tower.",
        accentHsl: "160 84% 39%",
        kpis: [
          { label: "On-time delivery", value: "94.6%", deltaLabel: "+0.8pp", positive: true },
          { label: "Cycle time P50", value: "2.4d", deltaLabel: "−0.3d", positive: true },
          { label: "Backlog >14d", value: "7.1%", deltaLabel: "−1.2pp", positive: true },
          { label: "Capacity util", value: "86%", deltaLabel: "+2pp", positive: true },
        ],
        trend,
        trendLabel: "Orders fulfilled (000s)",
        secondaryTitle: "Aging buckets",
        breakdown: mkBreakdown(["0–2d", "3–7d", "8–14d", "15–30d", "30d+"], 18_000),
        tableColumns: [
          { key: "site", label: "Site" },
          { key: "otd", label: "OTD", align: "right" },
          { key: "issue", label: "Top driver" },
        ],
        tableRows: [
          { site: "Dallas", otd: "96%", issue: "Staffing" },
          { site: "Rotterdam", otd: "93%", issue: "Inbound spikes" },
          { site: "Singapore", otd: "95%", issue: "Customs" },
          { site: "Sydney", otd: "92%", issue: "Carrier delays" },
        ],
        insights: [
          "Ops dashboards shine with SLA + aging together — the story is flow, not just totals.",
          "Use consistent units in backlog buckets (counts vs %) and stick to one.",
          "Site-level tables should highlight exceptions; consider conditional formatting in Tableau for drivers.",
        ],
      };
    }
    case "hr-workforce": {
      const trend = buildTrend(seed + 8, periods, 1180, 1.2);
      return {
        ...base(),
        domain: "HR & People",
        title: "Hiring, Retention, Engagement",
        subtitle: "Headcount plan vs actual, regrettable attrition, and engagement pulse.",
        accentHsl: "217 91% 60%",
        kpis: [
          { label: "Regrettable attrition", value: "6.2%", deltaLabel: "−0.5pp", positive: true },
          { label: "Time-to-hire", value: "31 days", deltaLabel: "−4d", positive: true },
          { label: "Engagement", value: "78", deltaLabel: "+3", positive: true },
          { label: "Diversity (leadership)", value: "41%", deltaLabel: "+1.2pp", positive: true },
        ],
        trend,
        trendLabel: "Headcount (FTE)",
        secondaryTitle: "Open roles by department",
        breakdown: mkBreakdown(["Eng", "Sales", "CS", "G&A", "Ops"], 220),
        tableColumns: [
          { key: "region", label: "Region" },
          { key: "attr", label: "Attrition", align: "right" },
          { key: "hc", label: "HC vs plan", align: "right" },
        ],
        tableRows: [
          { region: "Americas", attr: "5.8%", hc: "+2%" },
          { region: "EMEA", attr: "7.1%", hc: "−1%" },
          { region: "APAC", attr: "6.0%", hc: "+0%" },
          { region: "Remote", attr: "5.4%", hc: "+4%" },
        ],
        insights: [
          "People analytics works best when metrics are comparable across regions — normalize definitions.",
          "Avoid overloading HR dashboards with survey verbatim; keep pulse as a single KPI.",
          "Pair hiring funnel with time-to-hire to diagnose recruiter capacity vs demand.",
        ],
      };
    }
    case "supply-chain": {
      const trend = buildTrend(seed + 9, periods, 14_200, 2.0);
      return {
        ...base(),
        domain: "Supply Chain",
        title: "Fill Rate, Lead Time, Cost",
        subtitle: "Supplier reliability and inbound variability — classic Tableau SCOR view.",
        accentHsl: "38 92% 50%",
        kpis: [
          { label: "Fill rate", value: "97.1%", deltaLabel: "+0.4pp", positive: true },
          { label: "Lead time P90", value: "17 days", deltaLabel: "+1d", positive: false },
          { label: "In-full %", value: "94.3%", deltaLabel: "+0.9pp", positive: true },
          { label: "Freight cost index", value: "102", deltaLabel: "−3", positive: true },
        ],
        trend,
        trendLabel: "Inbound units (000s)",
        secondaryTitle: "Supplier contribution",
        breakdown: mkBreakdown(["Supplier A", "Supplier B", "Supplier C", "Supplier D", "Other"], 420_000),
        tableColumns: [
          { key: "lane", label: "Lane" },
          { key: "otif", label: "OTIF", align: "right" },
          { key: "risk", label: "Risk" },
        ],
        tableRows: [
          { lane: "Asia → NA", otif: "95%", risk: "Port congestion" },
          { lane: "EU → EU", otif: "98%", risk: "Carrier capacity" },
          { lane: "NA → NA", otif: "97%", risk: "Weather" },
          { lane: "Intermodal", otif: "93%", risk: "Dwell time" },
        ],
        insights: [
          "Supply chain views should connect inbound volume with reliability metrics — not just averages.",
          "P90 lead times surface tail risk better than means for executive audiences.",
          "Supplier breakdowns belong as a bar chart; pie charts rarely survive SC scrutiny.",
        ],
      };
    }
    case "inventory-warehousing": {
      const trend = buildTrend(seed + 10, periods, 38, 1.5);
      return {
        ...base(),
        domain: "Inventory",
        title: "Turns, DOH, and Obsolescence",
        subtitle: "Working capital efficiency with location-level exceptions.",
        accentHsl: "185 90% 48%",
        kpis: [
          { label: "Inventory turns", value: "6.4", deltaLabel: "+0.2", positive: true },
          { label: "DOH", value: "57", deltaLabel: "−2d", positive: true },
          { label: "Carrying cost", value: formatUsd(2_100_000), deltaLabel: "−3% QoQ", positive: true },
          { label: "Obsolete %", value: "1.1%", deltaLabel: "+10 bps", positive: false },
        ],
        trend: trend.map((p) => ({ ...p, primary: p.primary / 100, benchmark: p.benchmark ? p.benchmark / 100 : undefined })),
        trendLabel: "Weeks of supply (target band)",
        secondaryTitle: "Stock by category",
        breakdown: mkBreakdown(["Finished goods", "WIP", "Raw", "MRO", "Packaging"], 9_200_000),
        tableColumns: [
          { key: "sku", label: "SKU cluster" },
          { key: "doh", label: "DOH", align: "right" },
          { key: "action", label: "Action" },
        ],
        tableRows: [
          { sku: "High velocity", doh: "22", action: "Maintain" },
          { sku: "Promo", doh: "41", action: "Markdown plan" },
          { sku: "Long tail", doh: "118", action: "Rationalize" },
          { sku: "New launch", doh: "35", action: "Watch sell-through" },
        ],
        insights: [
          "Inventory dashboards should reconcile turns and DOH — if both move wrong, investigate mix.",
          "Use SKU clusters for exec views; item-level belongs in operational workbooks.",
          "Obsolete % is a lagging indicator — pair with weeks of supply for early signals.",
        ],
      };
    }
    case "manufacturing-oee": {
      const trend = buildTrend(seed + 11, periods, 84, 0.7);
      return {
        ...base(),
        domain: "Manufacturing",
        title: "OEE & Downtime Drivers",
        subtitle: "Availability × performance × quality — loss tree by line.",
        accentHsl: "270 70% 60%",
        kpis: [
          { label: "OEE", value: "82.4%", deltaLabel: "+1.1pp", positive: true },
          { label: "Scrap rate", value: "0.62%", deltaLabel: "−8 bps", positive: true },
          { label: "MTBF", value: "118 h", deltaLabel: "+6 h", positive: true },
          { label: "Planned downtime", value: "6.4%", deltaLabel: "+0.3pp", positive: false },
        ],
        trend,
        trendLabel: "Throughput (units/hr)",
        secondaryTitle: "Downtime by reason",
        breakdown: mkBreakdown(["Changeover", "Material", "Maintenance", "Operator", "Utilities"], 4200),
        tableColumns: [
          { key: "line", label: "Line" },
          { key: "oee", label: "OEE", align: "right" },
          { key: "topLoss", label: "Top loss" },
        ],
        tableRows: [
          { line: "Line A", oee: "84%", topLoss: "Changeover" },
          { line: "Line B", oee: "81%", topLoss: "Material" },
          { line: "Line C", oee: "79%", topLoss: "Maintenance" },
          { line: "Packout", oee: "88%", topLoss: "Operator" },
        ],
        insights: [
          "OEE dashboards should show losses as Pareto bars — biggest lever first.",
          "Throughput trend without OEE context can mislead when mix shifts.",
          "Keep planned vs unplanned downtime separate; blending hides maintenance strategy.",
        ],
      };
    }
    case "healthcare-quality": {
      const trend = buildTrend(seed + 12, periods, 220, 1.0);
      return {
        ...base(),
        domain: "Healthcare",
        title: "Quality, Safety, Throughput",
        subtitle: "Clinical outcomes and operational throughput — mock PHI-safe aggregates.",
        accentHsl: "160 84% 39%",
        kpis: [
          { label: "HAI rate", value: "0.42", deltaLabel: "−0.06", positive: true },
          { label: "Readmissions", value: "11.2%", deltaLabel: "−0.4pp", positive: true },
          { label: "LWBS", value: "1.8%", deltaLabel: "−0.2pp", positive: true },
          { label: "Patient sat", value: "87", deltaLabel: "+2", positive: true },
        ],
        trend,
        trendLabel: "Patient volume (index)",
        secondaryTitle: "Visits by service line",
        breakdown: mkBreakdown(["ED", "Inpatient", "Outpatient", "Surgery", "Imaging"], 18_000),
        tableColumns: [
          { key: "unit", label: "Unit" },
          { key: "complication", label: "Complications/1k", align: "right" },
          { key: "board", label: "Board focus" },
        ],
        tableRows: [
          { unit: "ICU", complication: "6.1", board: "Line infections" },
          { unit: "Med/Surg", complication: "4.4", board: "Fall risk" },
          { unit: "Ortho", complication: "3.9", board: "DVT prophylaxis" },
          { unit: "ED", complication: "2.2", board: "Throughput" },
        ],
        insights: [
          "Healthcare dashboards must avoid misleading rates — show denominators in tooltips when possible.",
          "Pair safety metrics with throughput to show operational trade-offs transparently.",
          "Service line breakdowns help leaders allocate capacity without patient-level detail.",
        ],
      };
    }
    case "retail-store-ops": {
      const trend = buildTrend(seed + 13, periods, 1_080_000, 2.6);
      return {
        ...base(),
        domain: "Retail",
        title: "Comp Sales, Conversion, Basket",
        subtitle: "Store productivity with traffic and promo effectiveness.",
        accentHsl: "350 89% 60%",
        kpis: [
          { label: "Comp sales", value: formatPct(4.2), deltaLabel: "vs LY", positive: true },
          { label: "Conversion", value: "22.4%", deltaLabel: "+0.7pp", positive: true },
          { label: "UPT", value: "2.31", deltaLabel: "+0.04", positive: true },
          { label: "Shrink", value: "1.05%", deltaLabel: "+3 bps", positive: false },
        ],
        trend,
        trendLabel: "Net sales (weekly)",
        secondaryTitle: "Sales by category",
        breakdown: mkBreakdown(["Apparel", "Footwear", "Accessories", "Home", "Clearance"], 2_200_000),
        tableColumns: [
          { key: "store", label: "Store tier" },
          { key: "prod", label: "$/sqft", align: "right" },
          { key: "traffic", label: "Traffic Δ", align: "right" },
        ],
        tableRows: [
          { store: "Flagship", prod: "$482", traffic: "+6%" },
          { store: "A", prod: "$312", traffic: "+2%" },
          { store: "B", prod: "$268", traffic: "−1%" },
          { store: "Outlet", prod: "$198", traffic: "+9%" },
        ],
        insights: [
          "Retail dashboards should align traffic, conversion, and basket — the productivity triangle.",
          "Weekly seasonality makes daily charts noisy; rolling weeks often read better in Tableau.",
          "Shrink is small numerically but high impact — keep it visible for loss prevention alignment.",
        ],
      };
    }
    case "education-outcomes": {
      const trend = buildTrend(seed + 14, periods, 76, 0.8);
      return {
        ...base(),
        domain: "Education",
        title: "Learner Progress & Program ROI",
        subtitle: "Completion, assessment gains, and instructor effectiveness — privacy-safe aggregates.",
        accentHsl: "217 91% 60%",
        kpis: [
          { label: "Completion", value: "81%", deltaLabel: "+3.4pp", positive: true },
          { label: "Avg assessment Δ", value: "+12.4 pts", deltaLabel: "+1.1", positive: true },
          { label: "Attendance", value: "91%", deltaLabel: "+0.8pp", positive: true },
          { label: "Cost per learner", value: formatUsd(186), deltaLabel: "−4%", positive: true },
        ],
        trend,
        trendLabel: "Active learners (000s)",
        secondaryTitle: "Engagement by modality",
        breakdown: mkBreakdown(["Live", "Async", "Hybrid", "Lab", "Peer"], 42_000),
        tableColumns: [
          { key: "program", label: "Program" },
          { key: "retention", label: "90d retention", align: "right" },
          { key: "nps", label: "Learner NPS", align: "right" },
        ],
        tableRows: [
          { program: "Core skills", retention: "86%", nps: "62" },
          { program: "Leadership", retention: "79%", nps: "58" },
          { program: "Data", retention: "83%", nps: "64" },
          { program: "Compliance", retention: "92%", nps: "44" },
        ],
        insights: [
          "Education outcomes dashboards should emphasize cohort trends, not individual learners, in exec views.",
          "Pair completion with assessment gains to show learning transfer, not just participation.",
          "Modality breakdowns help allocate content investment across live vs async.",
        ],
      };
    }
    case "real-estate-portfolio": {
      const trend = buildTrend(seed + 15, periods, 92.5, 0.6);
      return {
        ...base(),
        domain: "Real Estate",
        title: "Occupancy, NOI, Lease Roll",
        subtitle: "Portfolio performance with expirations and rent spreads.",
        accentHsl: "38 92% 50%",
        kpis: [
          { label: "Occupancy", value: "93.6%", deltaLabel: "+0.5pp", positive: true },
          { label: "NOI margin", value: "62%", deltaLabel: "+0.7pp", positive: true },
          { label: "Rent spread (renewals)", value: formatPct(8.4), deltaLabel: "vs expiring", positive: true },
          { label: "Lease expirations (12m)", value: "14%", deltaLabel: "by GLA", positive: true },
        ],
        trend,
        trendLabel: "NOI (indexed)",
        secondaryTitle: "NOI by asset class",
        breakdown: mkBreakdown(["Office", "Industrial", "Retail", "Multifamily", "Life science"], 42_000_000),
        tableColumns: [
          { key: "market", label: "Market" },
          { key: "occ", label: "Occ.", align: "right" },
          { key: "cap", label: "Cap signal" },
        ],
        tableRows: [
          { market: "NYC", occ: "94%", cap: "Tight" },
          { market: "DFW", occ: "92%", cap: "Balanced" },
          { market: "London", occ: "91%", cap: "Selective" },
          { market: "Singapore", occ: "95%", cap: "Core" },
        ],
        insights: [
          "Real estate dashboards benefit from occupancy trend + expirations table — time and risk together.",
          "Use indexed NOI for multi-currency portfolios to avoid FX noise in headlines.",
          "Cap rates belong in analyst views; executives often want spreads and occupancy first.",
        ],
      };
    }
    case "cx-nps-voc": {
      const trend = buildTrend(seed + 16, periods, 48, 1.3);
      return {
        ...base(),
        domain: "CX & VoC",
        title: "NPS, CSAT, and Sentiment Themes",
        subtitle: "Experience metrics with emerging complaint themes — qualitative + quantitative.",
        accentHsl: "280 70% 55%",
        kpis: [
          { label: "NPS", value: "42", deltaLabel: "+5", positive: true },
          { label: "CSAT (post-ticket)", value: "4.5 / 5", deltaLabel: "+0.1", positive: true },
          { label: "FCR", value: "73%", deltaLabel: "+2.4pp", positive: true },
          { label: "Negative sentiment", value: "12%", deltaLabel: "−1.1pp", positive: true },
        ],
        trend,
        trendLabel: "VoC volume (000s mentions)",
        secondaryTitle: "Themes (share of mentions)",
        breakdown: mkBreakdown(["Billing", "Onboarding", "Latency", "Policy", "Account"], 28_000),
        tableColumns: [
          { key: "journey", label: "Journey stage" },
          { key: "csat", label: "CSAT", align: "right" },
          { key: "topTheme", label: "Top theme" },
        ],
        tableRows: [
          { journey: "Discover", csat: "4.6", topTheme: "Pricing clarity" },
          { journey: "Buy", csat: "4.4", topTheme: "Contract terms" },
          { journey: "Onboard", csat: "4.2", topTheme: "Time-to-value" },
          { journey: "Use", csat: "4.5", topTheme: "Reliability" },
        ],
        insights: [
          "CX dashboards should connect survey KPIs to operational metrics (FCR) to show causality hypotheses.",
          "Theme breakdowns work best as ranked bars with stable category definitions.",
          "Avoid word clouds for exec audiences — bars are easier to track week over week.",
        ],
      };
    }
    case "risk-compliance": {
      const trend = buildTrend(seed + 17, periods, 210, 1.6);
      return {
        ...base(),
        domain: "Risk & Compliance",
        title: "Control Effectiveness & Issues",
        subtitle: "Open findings, overdue controls, and incident trend — audit-ready summary.",
        accentHsl: "350 89% 60%",
        kpis: [
          { label: "Open issues", value: "38", deltaLabel: "−6", positive: true },
          { label: "Overdue controls", value: "4", deltaLabel: "−2", positive: true },
          { label: "Policy attestations", value: "97%", deltaLabel: "+1.2pp", positive: true },
          { label: "Incidents (90d)", value: "7", deltaLabel: "+1", positive: false },
        ],
        trend,
        trendLabel: "Control testing volume",
        secondaryTitle: "Issues by domain",
        breakdown: mkBreakdown(["Access", "Change mgmt", "Vendor", "Data", "BCP"], 420),
        tableColumns: [
          { key: "reg", label: "Framework" },
          { key: "gaps", label: "Gaps", align: "right" },
          { key: "eta", label: "Remediation ETA" },
        ],
        tableRows: [
          { reg: "SOC 2", gaps: "2", eta: "Apr 2026" },
          { reg: "ISO 27001", gaps: "1", eta: "Mar 2026" },
          { reg: "GDPR", gaps: "0", eta: "—" },
          { reg: "PCI", gaps: "3", eta: "May 2026" },
        ],
        insights: [
          "Compliance dashboards should emphasize aging and ownership — counts without dates create false comfort.",
          "Separate incidents from issues; blending them confuses severity and response playbooks.",
          "Use testing volume as context, not a goal — more tests ≠ better risk posture.",
        ],
      };
    }
    case "sustainability-esg": {
      const trend = buildTrend(seed + 18, periods, 42_000, 1.7);
      return {
        ...base(),
        domain: "Sustainability (ESG)",
        title: "Carbon, Energy, and Water Intensity",
        subtitle: "Intensity metrics normalized to revenue — investor-grade storyline.",
        accentHsl: "160 84% 39%",
        kpis: [
          { label: "Scope 1+2 tCO₂e", value: "12.4k", deltaLabel: "−4.2% YoY", positive: true },
          { label: "Renewable %", value: "64%", deltaLabel: "+6pp", positive: true },
          { label: "Energy intensity", value: "58 MWh/$M", deltaLabel: "−3%", positive: true },
          { label: "Water intensity", value: "3.1 m³/$M", deltaLabel: "−2%", positive: true },
        ],
        trend,
        trendLabel: "Emissions (tCO₂e, monthly)",
        secondaryTitle: "Emissions by scope",
        breakdown: mkBreakdown(["Scope 1", "Scope 2 (loc)", "Scope 2 (mkt)", "Scope 3 (cat 1)", "Other"], 12_400),
        tableColumns: [
          { key: "site", label: "Site" },
          { key: "intensity", label: "tCO₂e/$M", align: "right" },
          { key: "proj", label: "Project" },
        ],
        tableRows: [
          { site: "Portland", intensity: "41", proj: "Solar PPA" },
          { site: "Frankfurt", intensity: "52", proj: "Heat recovery" },
          { site: "Hyderabad", intensity: "68", proj: "Grid mix shift" },
          { site: "São Paulo", intensity: "55", proj: "Biomass" },
        ],
        insights: [
          "ESG dashboards should lead with science-based normalization — intensity beats raw totals for comparability.",
          "Keep scope definitions consistent with reporting standards; label market-based vs location-based energy.",
          "Trend lines should match reporting cadence (monthly/quarterly) to avoid false volatility.",
        ],
      };
    }
    case "it-cyber-soc": {
      const trend = buildTrend(seed + 19, periods, 4200, 2.2);
      return {
        ...base(),
        domain: "IT & Cybersecurity",
        title: "SOC Throughput & Mean Time",
        subtitle: "Alerts, true positives, and remediation speed — SOC leadership view.",
        accentHsl: "217 91% 60%",
        kpis: [
          { label: "MTTD", value: "18 min", deltaLabel: "−4 min", positive: true },
          { label: "MTTR", value: "3.6 h", deltaLabel: "−0.4 h", positive: true },
          { label: "Critical open", value: "9", deltaLabel: "−3", positive: true },
          { label: "Phish click rate", value: "3.1%", deltaLabel: "−0.4pp", positive: true },
        ],
        trend,
        trendLabel: "Alerts ingested (weekly)",
        secondaryTitle: "Alerts by category",
        breakdown: mkBreakdown(["Malware", "Phish", "Identity", "Cloud", "Network"], 18_000),
        tableColumns: [
          { key: "control", label: "Control" },
          { key: "cov", label: "Coverage", align: "right" },
          { key: "gap", label: "Gap" },
        ],
        tableRows: [
          { control: "EDR", cov: "98%", gap: "Legacy servers" },
          { control: "MFA", cov: "96%", gap: "Service accounts" },
          { control: "CSPM", cov: "92%", gap: "Shadow projects" },
          { control: "DLP", cov: "78%", gap: "Endpoints off-VPN" },
        ],
        insights: [
          "SOC dashboards should balance noise (alert volume) with signal (TP rate) — show both explicitly.",
          "MTTD/MTTR pair tells response maturity; keep definitions stable across quarters.",
          "Security coverage tables need owners — metrics without accountability rarely improve.",
        ],
      };
    }
    case "support-ticketing": {
      const trend = buildTrend(seed + 20, periods, 11_200, 2.0);
      return {
        ...base(),
        domain: "Customer Support",
        title: "Backlog, SLA, and Quality",
        subtitle: "Classic support ops dashboard: volume, aging, and CSAT recovery.",
        accentHsl: "38 92% 50%",
        kpis: [
          { label: "CSAT", value: "4.6 / 5", deltaLabel: "+0.1", positive: true },
          { label: "First response SLA", value: "96.2%", deltaLabel: "+0.6pp", positive: true },
          { label: "Backlog", value: "1,842", deltaLabel: "−6%", positive: true },
          { label: "Reopen rate", value: "4.1%", deltaLabel: "+0.2pp", positive: false },
        ],
        trend,
        trendLabel: "Tickets opened (weekly)",
        secondaryTitle: "Tickets by priority",
        breakdown: mkBreakdown(["P1", "P2", "P3", "P4", "P5"], 48_000),
        tableColumns: [
          { key: "queue", label: "Queue" },
          { key: "aht", label: "AHT", align: "right" },
          { key: "sla", label: "SLA hit", align: "right" },
        ],
        tableRows: [
          { queue: "Billing", aht: "9m", sla: "97%" },
          { queue: "Tech", aht: "14m", sla: "95%" },
          { queue: "Account", aht: "11m", sla: "98%" },
          { queue: "VIP", aht: "7m", sla: "99%" },
        ],
        insights: [
          "Support dashboards should connect backlog to SLA — the story is capacity vs demand.",
          "AHT without quality metrics can incentivize the wrong behavior — pair with CSAT or reopen rate.",
          "Priority distribution should be stable; sudden spikes often indicate product or comms issues.",
        ],
      };
    }
    default: {
      const exhaustive: never = slug;
      throw new Error(`Unknown expert slug: ${exhaustive}`);
    }
  }
}

export function isExpertSlug(s: string): s is ExpertSlug {
  return (listExpertSlugs() as string[]).includes(s);
}
