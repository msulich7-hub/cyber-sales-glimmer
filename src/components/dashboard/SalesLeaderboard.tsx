import { Crown, Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { salesReps } from "@/data/mockData";

const SalesLeaderboard = () => {
  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">The Arena</h2>
          <p className="text-xs text-muted-foreground">Sales Rep Leaderboard</p>
        </div>
        <Trophy className="w-4 h-4 text-neon-amber" />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {salesReps.map((rep, index) => {
          const progress = Math.round((rep.sales / rep.target) * 100);
          const isFirst = index === 0;
          const targetMet = progress >= 100;

          return (
            <motion.div
              key={rep.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-default ${
                isFirst
                  ? "bg-secondary/80 gold-crown"
                  : "bg-secondary/30 border border-transparent hover:border-border/50 hover:bg-secondary/50"
              } ${targetMet ? "celebration-glow target-met-shimmer" : ""}`}
            >
              <div className="text-xs font-mono text-muted-foreground w-5 text-center">
                {isFirst ? (
                  <Crown className="w-4 h-4 text-neon-amber" />
                ) : (
                  `#${index + 1}`
                )}
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                  isFirst
                    ? "bg-neon-amber/20 text-neon-amber border border-neon-amber/30"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                {rep.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{rep.name}</span>
                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="text-xs font-mono neon-text-green">
                      ${(rep.sales / 1000).toFixed(0)}k
                    </span>
                    {targetMet && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-neon-amber"
                      >
                        <Target className="w-3 h-3" />
                      </motion.span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-1.5 flex-1 bg-secondary" />
                  <span className={`text-[10px] font-mono w-8 text-right ${
                    targetMet ? "neon-text-green" : "text-muted-foreground"
                  }`}>
                    {progress}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesLeaderboard;
