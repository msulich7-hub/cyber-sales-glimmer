import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, DollarSign, UserPlus, FileCheck, TrendingUp, AlertTriangle } from "lucide-react";

interface FeedEvent {
  id: string;
  type: "deal" | "lead" | "milestone" | "alert";
  message: string;
  time: string;
  value?: string;
}

const eventPool: Omit<FeedEvent, "id" | "time">[] = [
  { type: "deal", message: "Marcus Chen closed $42k deal with Quantum Dynamics", value: "+$42,000" },
  { type: "lead", message: "New enterprise lead: Horizon AI Technologies", value: "Qualified" },
  { type: "milestone", message: "APAC region hit 90% of Q1 target", value: "90%" },
  { type: "deal", message: "Sarah Williams upsold NovaTech subscription", value: "+$18,500" },
  { type: "alert", message: "Latin America conversion dropped below 20%", value: "19%" },
  { type: "deal", message: "Alex Rodriguez signed Stratos Aerospace renewal", value: "+$28,000" },
  { type: "lead", message: "Inbound demo request from Vertex Financial", value: "Hot Lead" },
  { type: "milestone", message: "Enterprise SaaS revenue crossed $500k mark", value: "$485k" },
  { type: "deal", message: "Jessica Park closed multi-year contract with Helix", value: "+$65,000" },
  { type: "alert", message: "Pipeline velocity below weekly average", value: "-12%" },
  { type: "lead", message: "Partner referral: Zenith Robotics", value: "Enterprise" },
  { type: "deal", message: "David Kim secured Meridian Systems expansion", value: "+$31,200" },
];

const iconMap = {
  deal: DollarSign,
  lead: UserPlus,
  milestone: TrendingUp,
  alert: AlertTriangle,
};

const colorMap = {
  deal: { bg: "bg-neon-green/10", border: "border-neon-green/20", text: "text-neon-green" },
  lead: { bg: "bg-neon-blue/10", border: "border-neon-blue/20", text: "text-neon-blue" },
  milestone: { bg: "bg-neon-purple/10", border: "border-neon-purple/20", text: "text-neon-purple" },
  alert: { bg: "bg-neon-rose/10", border: "border-neon-rose/20", text: "text-neon-rose" },
};

const LiveActivityFeed = () => {
  const [events, setEvents] = useState<FeedEvent[]>(() => {
    return eventPool.slice(0, 5).map((e, i) => ({
      ...e,
      id: `init-${i}`,
      time: `${i + 1}m ago`,
    }));
  });

  useEffect(() => {
    let counter = 5;
    const interval = setInterval(() => {
      const randomEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
      const newEvent: FeedEvent = {
        ...randomEvent,
        id: `event-${counter++}`,
        time: "Just now",
      };
      setEvents((prev) => {
        const updated = [newEvent, ...prev.slice(0, 5)];
        return updated.map((e, i) => ({
          ...e,
          time: i === 0 ? "Just now" : `${i * 2}m ago`,
        }));
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center relative">
            <Activity className="w-4 h-4 text-neon-green" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-green animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-green" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Live Activity</h2>
            <p className="text-xs text-muted-foreground">Real-time sales feed</p>
          </div>
        </div>
        <span className="badge-pulse-green text-[10px]">● LIVE</span>
      </div>

      <div className="flex-1 space-y-1.5 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {events.map((event) => {
            const Icon = iconMap[event.type];
            const colors = colorMap[event.type];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                layout
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${colors.border} ${colors.bg} transition-colors`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug line-clamp-2">{event.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{event.time}</p>
                </div>
                {event.value && (
                  <span className={`text-[10px] font-mono font-semibold shrink-0 ${colors.text}`}>
                    {event.value}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
