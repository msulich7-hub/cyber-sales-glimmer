import { salesReps, topCustomers, accountingGroups } from "./mockData";

export interface RepBreakdown {
  repId: number;
  repName: string;
  initials: string;
  revenue: number;
  deals: number;
}

export interface ClientBreakdown {
  clientName: string;
  revenue: number;
  accountingGroup: string;
  groupColor: string;
}

export interface DailySalesEntry {
  date: string;
  revenue: number;
  deals: number;
  priorPeriodRevenue: number;
  repBreakdown: RepBreakdown[];
  clientBreakdown: ClientBreakdown[];
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const generateDailySalesData = (): DailySalesEntry[] => {
  const data: DailySalesEntry[] = [];
  const start = new Date(2026, 0, 1);
  const end = new Date(2026, 2, 13);

  let dayIndex = 0;
  const current = new Date(start);

  while (current <= end) {
    const dow = current.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const seed = dayIndex + 1000;
    const rng = () => seededRandom(seed + dayIndex * 7 + data.length);

    // Upward trend + weekday/weekend variation
    const trendMultiplier = 1 + dayIndex * 0.003;
    const baseRevenue = isWeekend ? 9000 : 24000;
    const variance = (rng() - 0.35) * 14000;
    const dailyRevenue = Math.max(3000, Math.round((baseRevenue + variance) * trendMultiplier));

    // Prior period is ~15% less with its own variance
    const pyVariance = (seededRandom(seed + 999) - 0.4) * 10000;
    const priorPeriodRevenue = Math.max(2000, Math.round((baseRevenue * 0.82 + pyVariance) * (trendMultiplier * 0.9)));

    // Rep breakdown: 2-5 reps active
    const activeRepCount = Math.min(salesReps.length, 2 + Math.floor(seededRandom(seed + 1) * 4));
    const shuffledReps = [...salesReps].sort((a, b) => seededRandom(seed + a.id) - seededRandom(seed + b.id));
    const activeReps = shuffledReps.slice(0, activeRepCount);

    let remainingRevenue = dailyRevenue;
    let remainingDeals = 0;
    const repBreakdown: RepBreakdown[] = activeReps.map((rep, i) => {
      const isLast = i === activeReps.length - 1;
      const share = isLast ? remainingRevenue : Math.round(remainingRevenue * (0.2 + seededRandom(seed + rep.id + 10) * 0.4));
      remainingRevenue -= share;
      const deals = Math.max(1, Math.round(1 + seededRandom(seed + rep.id + 20) * 3));
      remainingDeals += deals;
      return {
        repId: rep.id,
        repName: rep.name,
        initials: rep.initials,
        revenue: Math.max(500, share),
        deals,
      };
    });

    // Add inactive reps with 0
    const inactiveReps = shuffledReps.slice(activeRepCount).map(rep => ({
      repId: rep.id,
      repName: rep.name,
      initials: rep.initials,
      revenue: 0,
      deals: 0,
    }));

    // Client breakdown: 3-8 clients
    const clientCount = 3 + Math.floor(seededRandom(seed + 50) * 6);
    const shuffledClients = [...topCustomers].sort((a, b) => seededRandom(seed + 60 + topCustomers.indexOf(a)) - seededRandom(seed + 60 + topCustomers.indexOf(b)));
    let clientRemaining = dailyRevenue;
    const clientBreakdown: ClientBreakdown[] = shuffledClients.slice(0, clientCount).map((client, i) => {
      const isLast = i === clientCount - 1;
      const share = isLast ? clientRemaining : Math.round(clientRemaining * (0.1 + seededRandom(seed + 70 + i) * 0.35));
      clientRemaining -= share;
      const group = accountingGroups[Math.floor(seededRandom(seed + 80 + i) * accountingGroups.length)];
      return {
        clientName: client.name,
        revenue: Math.max(200, share),
        accountingGroup: group.name,
        groupColor: group.color,
      };
    });

    data.push({
      date: current.toISOString().split("T")[0],
      revenue: dailyRevenue,
      deals: remainingDeals,
      priorPeriodRevenue,
      repBreakdown: [...repBreakdown.sort((a, b) => b.revenue - a.revenue), ...inactiveReps],
      clientBreakdown: clientBreakdown.sort((a, b) => b.revenue - a.revenue),
    });

    current.setDate(current.getDate() + 1);
    dayIndex++;
  }

  return data;
};

export const dailySalesData = generateDailySalesData();
