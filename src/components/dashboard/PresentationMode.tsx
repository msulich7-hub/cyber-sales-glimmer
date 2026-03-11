import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize2, Monitor } from "lucide-react";
import CommandHeader from "./CommandHeader";
import MonthGhostChart from "./MonthGhostChart";
import ForecastChart from "./ForecastChart";
import TimeMachineChart from "./TimeMachineChart";
import SalesLeaderboard from "./SalesLeaderboard";
import RevenueHeatmap from "./RevenueHeatmap";
import SalesFunnel from "./SalesFunnel";
import WaterfallChart from "./WaterfallChart";
import RegionPerformance from "./RegionPerformance";
import ClientMatrix from "./ClientMatrix";
import RevenueDonut from "./RevenueDonut";

interface PresentationModeProps {
  open: boolean;
  onClose: () => void;
}

const slides = [
  { id: "kpi", title: "KPI Overview", component: CommandHeader },
  { id: "ghost", title: "March Day-by-Day", component: MonthGhostChart },
  { id: "forecast", title: "Revenue Forecast", component: ForecastChart },
  { id: "timemachine", title: "CY vs PY Timeline", component: TimeMachineChart },
  { id: "leaderboard", title: "Sales Leaderboard", component: SalesLeaderboard },
  { id: "heatmap", title: "Revenue Heatmap", component: RevenueHeatmap },
  { id: "funnel", title: "Sales Pipeline", component: SalesFunnel },
  { id: "waterfall", title: "Revenue Bridge", component: WaterfallChart },
  { id: "regions", title: "Regional Performance", component: RegionPerformance },
  { id: "matrix", title: "Client Matrix", component: ClientMatrix },
  { id: "donut", title: "Revenue Streams", component: RevenueDonut },
];

const PresentationMode = ({ open, onClose }: PresentationModeProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!open || !autoPlay) return;
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [open, autoPlay, goNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "p") setAutoPlay((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, goNext, goPrev]);

  // Fullscreen
  useEffect(() => {
    if (open) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const SlideComponent = slides[currentSlide].component;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 80, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[1200px] max-h-[85vh]"
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="max-w-[800px] mx-auto glass-card px-4 py-3 flex items-center justify-between gap-4">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-6 bg-neon-green neon-glow-green"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>

          {/* Slide info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono">
              {currentSlide + 1}/{slides.length}
            </p>
            <p className="text-sm font-medium">{slides[currentSlide].title}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                autoPlay ? "bg-neon-green/20 text-neon-green" : "bg-secondary/80 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={goNext}
              className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-neon-rose/10 text-neon-rose flex items-center justify-center hover:bg-neon-rose/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-play progress bar */}
      {autoPlay && (
        <motion.div
          key={`progress-${currentSlide}`}
          className="absolute top-0 left-0 h-0.5 bg-neon-green"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
          style={{ boxShadow: "0 0 8px hsl(var(--neon-green) / 0.5)" }}
        />
      )}
    </motion.div>
  );
};

export default PresentationMode;
