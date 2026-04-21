import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { getExpertDashboardMeta, listExpertSlugs } from "@/data/expertDashboardData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardMotion = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const ShowcaseHub = () => {
  const slugs = listExpertSlugs();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-[1440px] mx-auto px-3 md:px-6 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do Command Center
          </Link>
          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">20 widoków eksperckich</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-3 md:p-8">
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
            <LayoutGrid className="w-4 h-4" />
            Biblioteka dashboardów
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Wzorce inspirowane Tableau</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl text-sm md:text-base">
            Zamiast uruchamiać dziesiątki równoległych agentów, zebrałem{" "}
            <span className="text-foreground font-medium">20 spójnych układów</span> — każdy w innej dziedzinie, z tym
            samym szkieletem: pas KPI, trend z benchmarkiem, rozkład, tabela szczegółów i krótkie insights. Dane są
            deterministyczne (mock) i służą jako canvas pod prawdziwe źródła.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {slugs.map((slug) => {
            const meta = getExpertDashboardMeta(slug);
            const accent = `hsl(${meta.accentHsl})`;
            return (
              <motion.div key={slug} variants={cardMotion}>
                <Link
                  to={`/showcase/${slug}`}
                  className="group block h-full rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 transition-colors p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">{meta.domain}</p>
                  <h2 className="text-lg font-semibold group-hover:text-primary transition-colors leading-snug">
                    {meta.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{meta.subtitle}</p>
                  <div
                    className="mt-4 h-1 w-12 rounded-full opacity-80 group-hover:w-20 transition-all"
                    style={{ background: accent }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ShowcaseHub;
