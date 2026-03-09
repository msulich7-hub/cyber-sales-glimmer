// Generate day-by-day sales data for CY and PY
const generateDailyData = () => {
  const data = [];
  const startDate = new Date(2026, 0, 1);
  const today = new Date(2026, 2, 9); // March 9, 2026

  let cyCumulative = 0;
  let pyCumulative = 0;

  const dayCount = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < dayCount; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseRevenue = isWeekend ? 8000 : 22000;

    const cyDaily = Math.round(baseRevenue + (Math.random() - 0.3) * 12000);
    const pyDaily = Math.round(baseRevenue * 0.85 + (Math.random() - 0.4) * 10000);

    cyCumulative += cyDaily;
    pyCumulative += pyDaily;

    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();

    data.push({
      date: `${month} ${day}`,
      fullDate: date.toISOString().split('T')[0],
      cyDaily: Math.max(cyDaily, 2000),
      pyDaily: Math.max(pyDaily, 1500),
      cyCumulative,
      pyCumulative,
    });
  }

  return data;
};

export const dailyData = generateDailyData();

// KPIs
const lastEntry = dailyData[dailyData.length - 1];
export const kpis = {
  totalRevenueCY: lastEntry.cyCumulative,
  totalRevenuePY: lastEntry.pyCumulative,
  yoyGrowth: ((lastEntry.cyCumulative - lastEntry.pyCumulative) / lastEntry.pyCumulative) * 100,
  dailyRunRate: Math.round(lastEntry.cyCumulative / dailyData.length),
};

// Sales Reps
export const salesReps = [
  { id: 1, name: "Marcus Chen", initials: "MC", sales: 342500, target: 400000, deals: 28, avatar: null },
  { id: 2, name: "Sarah Williams", initials: "SW", sales: 298700, target: 350000, deals: 22, avatar: null },
  { id: 3, name: "Alex Rodriguez", initials: "AR", sales: 276300, target: 300000, deals: 31, avatar: null },
  { id: 4, name: "Jessica Park", initials: "JP", sales: 251800, target: 320000, deals: 19, avatar: null },
  { id: 5, name: "David Kim", initials: "DK", sales: 234100, target: 280000, deals: 24, avatar: null },
  { id: 6, name: "Emma Torres", initials: "ET", sales: 198500, target: 260000, deals: 17, avatar: null },
  { id: 7, name: "Ryan O'Brien", initials: "RO", sales: 187200, target: 250000, deals: 21, avatar: null },
  { id: 8, name: "Nina Patel", initials: "NP", sales: 165800, target: 240000, deals: 15, avatar: null },
].sort((a, b) => b.sales - a.sales);

// Top Customers
export const topCustomers = [
  { name: "Quantum Dynamics Corp", revenue: 185000, pyRevenue: 152000 },
  { name: "NovaTech Industries", revenue: 162300, pyRevenue: 178500 },
  { name: "Apex Global Solutions", revenue: 148700, pyRevenue: 121000 },
  { name: "Meridian Systems", revenue: 134200, pyRevenue: 98700 },
  { name: "Helix Biomedical", revenue: 121500, pyRevenue: 115200 },
  { name: "Stratos Aerospace", revenue: 108900, pyRevenue: 132400 },
  { name: "Vertex Financial", revenue: 96400, pyRevenue: 88100 },
  { name: "Pulse Energy Ltd", revenue: 87200, pyRevenue: 72300 },
].sort((a, b) => b.revenue - a.revenue);

// Revenue by Accounting Group
export const accountingGroups = [
  { name: "Enterprise SaaS", value: 485000, color: "hsl(160, 84%, 39%)" },
  { name: "Professional Services", value: 312000, color: "hsl(217, 91%, 60%)" },
  { name: "Hardware & Infra", value: 198000, color: "hsl(38, 92%, 50%)" },
  { name: "Support & Maintenance", value: 145000, color: "hsl(280, 70%, 55%)" },
  { name: "Training & Certs", value: 87000, color: "hsl(350, 89%, 60%)" },
];
