import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ExportPDF = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    toast.info("Generating PDF report...");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Find the dashboard container
      const dashboard = document.getElementById("dashboard-content");
      if (!dashboard) {
        toast.error("Dashboard not found");
        setExporting(false);
        return;
      }

      // Capture the dashboard
      const canvas = await html2canvas(dashboard, {
        backgroundColor: "#0a0f1a",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1440,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Create PDF in landscape for better dashboard fit
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth * 0.5, imgHeight * 0.5],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth * 0.5, imgHeight * 0.5);

      // Add footer
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(8);
      pdf.setTextColor(120, 130, 150);
      pdf.text(
        `Sales Analytics Report • Generated ${new Date().toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
        })}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      pdf.save(`sales-dashboard-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 glass-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-neon-purple/40 transition-all cursor-pointer disabled:opacity-50"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin text-neon-purple" />
      ) : (
        <FileDown className="w-4 h-4 text-neon-purple" />
      )}
      <span className="font-mono text-xs">{exporting ? "Exporting..." : "Export PDF"}</span>
    </motion.button>
  );
};

export default ExportPDF;
