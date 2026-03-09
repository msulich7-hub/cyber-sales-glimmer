import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { accountingGroups } from "@/data/mockData";
import AnimatedNumber from "./AnimatedNumber";

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 12px ${fill})` }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="hsl(210, 40%, 93%)" fontSize={11} fontFamily="Inter" fontWeight="600">
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
                <Cell
                  key={index}
                  fill={entry.color}
                  fillOpacity={activeIndex === -1 ? 0.75 : activeIndex === index ? 1 : 0.2}
                  style={{ transition: "fill-opacity 0.3s ease" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <AnimatePresence>
          {activeIndex < 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <p className="text-2xl font-bold font-mono neon-text-green">
                  ${(total / 1000).toFixed(0)}k
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {accountingGroups.map((group, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-2 text-xs cursor-pointer rounded-md px-2 py-1 transition-all duration-200 ${
              activeIndex === i ? "bg-secondary/80" : "hover:bg-secondary/40"
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(-1)}
            whileHover={{ x: 3 }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
              style={{
                backgroundColor: group.color,
                transform: activeIndex === i ? "scale(1.5)" : "scale(1)",
                boxShadow: activeIndex === i ? `0 0 8px ${group.color}` : "none",
              }}
            />
            <span className={`truncate transition-colors ${activeIndex === i ? "text-foreground" : "text-muted-foreground"}`}>
              {group.name}
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              ${(group.value / 1000).toFixed(0)}k
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RevenueDonut;
