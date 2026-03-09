import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { topCustomers } from "@/data/mockData";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const growth = ((d.revenue - d.pyRevenue) / d.pyRevenue) * 100;

  return (
    <div className="glass-card p-3 border border-border text-xs font-mono shadow-2xl">
      <p className="text-foreground font-sans font-medium mb-2">{d.name}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">CY Revenue</span>
          <span>${d.revenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">PY Revenue</span>
          <span className="text-muted-foreground">${d.pyRevenue.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-1 flex justify-between gap-4">
          <span className="text-muted-foreground">YoY</span>
          <span className={growth >= 0 ? "neon-text-green" : "neon-text-rose"}>
            {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

const ClientMatrix = () => {
  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Client Matrix</h2>
        <p className="text-xs text-muted-foreground">Top customers by revenue</p>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topCustomers}
            layout="vertical"
            margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
              width={100}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.length > 14 ? v.slice(0, 14) + "…" : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(217, 33%, 12%)" }} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} animationDuration={1200}>
              {topCustomers.map((entry) => {
                const growth = (entry.revenue - entry.pyRevenue) / entry.pyRevenue;
                return (
                  <Cell
                    key={entry.name}
                    fill={growth >= 0 ? "hsl(160, 84%, 39%)" : "hsl(350, 89%, 60%)"}
                    fillOpacity={0.7}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClientMatrix;
