import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";

interface SpeedometerGaugeProps {
  title: string;
  value: number;
  max: number;
  suffix?: string;
  color?: string;
}

const SpeedometerGauge = ({
  title,
  value,
  max,
  suffix = "%",
  color = "hsl(160, 84%, 39%)",
}: SpeedometerGaugeProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = 251.2; // circumference for r=40, half circle ≈ π*80
  const arcLength = 251.2 * 0.75; // 270 degrees
  const filledLength = (percentage / 100) * arcLength;

  const getStatusColor = () => {
    if (percentage >= 90) return "hsl(160, 84%, 39%)";
    if (percentage >= 70) return "hsl(38, 92%, 50%)";
    return "hsl(350, 89%, 60%)";
  };

  const statusColor = getStatusColor();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-20">
        <svg viewBox="0 0 100 65" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 58 A 40 40 0 1 1 90 58"
            fill="none"
            stroke="hsl(217, 33%, 14%)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <motion.path
            d="M 10 58 A 40 40 0 1 1 90 58"
            fill="none"
            stroke={statusColor}
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{
              filter: `drop-shadow(0 0 6px ${statusColor})`,
            }}
          />
          {/* Needle dot */}
          <motion.circle
            cx="50"
            cy="58"
            r="3"
            fill={statusColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ filter: `drop-shadow(0 0 4px ${statusColor})` }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <AnimatedNumber
            value={value}
            suffix={suffix}
            decimals={suffix === "%" ? 1 : 0}
            className="text-lg font-bold font-mono text-foreground"
          />
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{title}</span>
    </div>
  );
};

export default SpeedometerGauge;
