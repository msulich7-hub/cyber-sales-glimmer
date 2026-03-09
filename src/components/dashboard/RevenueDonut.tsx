import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { accountingGroups } from "@/data/mockData";

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 8px ${fill})` }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="hsl(210, 40%, 93%)" fontSize={11} fontFamily="Inter">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="hsl(215, 20%, 55%)" fontSize={10} fontFamily="JetBrains Mono">
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

const RevenueDonut = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = accountingGroups.reduce((sum, g) => sum + g.value, 0);

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Revenue Streams</h2>
        <p className="text-xs text-muted-foreground">By accounting group</p>
      </div>

      <div className="flex-1 relative min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={accountingGroups}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="78%"
              dataKey="value"
              activeIndex={activeIndex >= 0 ? activeIndex : undefined}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              animationDuration={1200}
              stroke="hsl(222, 47%, 8%)"
              strokeWidth={2}
            >
              {accountingGroups.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={activeIndex === index ? 1 : 0.75} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {activeIndex < 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono neon-text-green">
                ${(total / 1000).toFixed(0)}k
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {accountingGroups.map((group, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs cursor-pointer"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: group.color }}
            />
            <span className="text-muted-foreground truncate">{group.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueDonut;
