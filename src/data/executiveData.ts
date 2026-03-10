// Executive-grade mock data for Tableau-style widgets

// Weekly revenue heatmap (13 weeks, Mon-Sun)
export const generateHeatmapData = () => {
  const weeks: { week: number; days: { day: string; value: number; label: string }[] }[] = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startDate = new Date(2026, 0, 5); // First Monday of 2026

  for (let w = 0; w < 10; w++) {
    const days = dayNames.map((name, d) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      const isWeekend = d >= 5;
      const base = isWeekend ? 8000 : 24000;
      const value = Math.round(base + (Math.random() - 0.3) * 15000);
      const isFuture = date > new Date(2026, 2, 9);
      return {
        day: name,
        value: isFuture ? 0 : Math.max(value, 2000),
        label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });
    weeks.push({ week: w + 1, days });
  }
  return weeks;
};

export const heatmapData = generateHeatmapData();

// Sales pipeline / funnel
export const funnelData = [
  { stage: "Leads Generated", value: 2840, color: "hsl(217, 91%, 60%)" },
  { stage: "Qualified", value: 1920, color: "hsl(185, 90%, 48%)" },
  { stage: "Proposal Sent", value: 1280, color: "hsl(160, 84%, 39%)" },
  { stage: "Negotiation", value: 720, color: "hsl(38, 92%, 50%)" },
  { stage: "Closed Won", value: 485, color: "hsl(160, 84%, 50%)" },
];

// Forecast data with confidence bands
export const forecastData = (() => {
  const data = [];
  let cumulative = 0;
  for (let m = 0; m < 12; m++) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const isActual = m < 3; // Jan, Feb, Mar partial
    const base = 180000 + Math.sin(m * 0.5) * 40000;
    const actual = isActual ? Math.round(base + (Math.random() - 0.3) * 30000) : null;
    const forecast = !isActual ? Math.round(base + (Math.random() - 0.4) * 20000) : null;
    const target = Math.round(base * 1.1);
    cumulative += actual || forecast || 0;

    data.push({
      month: monthNames[m],
      actual,
      forecast,
      target,
      upper: forecast ? Math.round(forecast * 1.15) : null,
      lower: forecast ? Math.round(forecast * 0.85) : null,
      cumulative,
    });
  }
  return data;
})();

// Regional performance
export const regionData = [
  {
    region: "North America",
    revenue: 685000,
    target: 720000,
    deals: 142,
    growth: 14.2,
    conversion: 28,
    satisfaction: 92,
  },
  {
    region: "Europe",
    revenue: 412000,
    target: 450000,
    deals: 98,
    growth: 8.7,
    conversion: 24,
    satisfaction: 88,
  },
  {
    region: "Asia Pacific",
    revenue: 298000,
    target: 320000,
    deals: 76,
    growth: 22.5,
    conversion: 31,
    satisfaction: 85,
  },
  {
    region: "Latin America",
    revenue: 145000,
    target: 180000,
    deals: 42,
    growth: -3.2,
    conversion: 19,
    satisfaction: 79,
  },
];

// KPI Waterfall data
export const waterfallData = [
  { name: "Q4 2025", value: 1380000, type: "start" as const },
  { name: "New Clients", value: 285000, type: "increase" as const },
  { name: "Upsells", value: 142000, type: "increase" as const },
  { name: "Renewals", value: 98000, type: "increase" as const },
  { name: "Churn", value: -175000, type: "decrease" as const },
  { name: "Downgrades", value: -62000, type: "decrease" as const },
  { name: "Q1 2026", value: 1668000, type: "total" as const },
];
