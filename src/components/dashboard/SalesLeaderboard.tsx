import { Crown, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { salesReps } from "@/data/mockData";

const SalesLeaderboard = () => {
  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">The Arena</h2>
        <p className="text-xs text-muted-foreground">Sales Rep Leaderboard</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {salesReps.map((rep, index) => {
          const progress = Math.round((rep.sales / rep.target) * 100);
          const isFirst = index === 0;

          return (
            <div
              key={rep.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isFirst
                  ? "bg-secondary/80 gold-crown"
                  : "bg-secondary/30 border border-transparent hover:border-border/50"
              }`}
            >
              <div className="text-xs font-mono text-muted-foreground w-5 text-center">
                {isFirst ? (
                  <Crown className="w-4 h-4 text-neon-amber" />
                ) : (
                  `#${index + 1}`
                )}
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
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
                  <span className="text-xs font-mono neon-text-green ml-2">
                    ${(rep.sales / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-1.5 flex-1 bg-secondary" />
                  <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesLeaderboard;
