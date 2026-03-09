// March day-by-day data for CY and PY
const today = 9; // March 9

const generateMonthData = () => {
  const data = [];
  const daysInMarch = 31;

  for (let day = 1; day <= daysInMarch; day++) {
    const dayOfWeek = new Date(2026, 2, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 9000 : 24000;

    const cyDaily = day <= today ? Math.round(base + (Math.random() - 0.25) * 14000) : null;
    const pyDaily = Math.round(base * 0.88 + (Math.random() - 0.35) * 11000);

    data.push({
      day,
      label: `Mar ${day}`,
      cyDaily: cyDaily !== null ? Math.max(cyDaily, 3000) : null,
      pyDaily: Math.max(pyDaily, 2000),
    });
  }

  return data;
};

export const marchData = generateMonthData();
export const currentDay = today;
