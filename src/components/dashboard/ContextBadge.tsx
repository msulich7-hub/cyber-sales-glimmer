import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Award } from "lucide-react";

interface ContextBadgeProps {
  value: number;
  label: string;
  type?: "percent" | "text";
}

const ContextBadge = ({ value, label, type = "percent" }: ContextBadgeProps) => {
  const isPositive = value >= 0;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`badge-context ${isPositive ? "text-neon-green border-neon-green/20" : "text-neon-rose border-neon-rose/20"}`}
      style={{
        background: isPositive
          ? "hsl(var(--neon-green) / 0.08)"
          : "hsl(var(--neon-rose) / 0.08)",
        borderColor: isPositive
          ? "hsl(var(--neon-green) / 0.2)"
          : "hsl(var(--neon-rose) / 0.2)",
        color: isPositive
          ? "hsl(var(--neon-green))"
          : "hsl(var(--neon-rose))",
      }}
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {type === "percent" ? `${isPositive ? "+" : ""}${value.toFixed(1)}%` : label}
    </motion.span>
  );
};

export default ContextBadge;
