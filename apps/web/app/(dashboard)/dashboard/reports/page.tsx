"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileBarChart, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { MetricPicker } from "@/components/dashboard/metric-picker";
import { PageEntrance } from "@/components/dashboard/motion";
import { ReportCanvas } from "@/components/dashboard/report-canvas";
import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";

import type { MetricId } from "@/lib/report-engine";

export default function ReportsPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricId[]>([]);
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("month");
  const [reportName, setReportName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { toast } = useToast();
  const savedReports = useGymStore((s) => s.savedReports);
  const removeSavedReport = useGymStore((s) => s.removeSavedReport);

  const handleLoadReport = (report: { name: string; metrics: string[]; groupBy: "day" | "week" | "month" }) => {
    setSelectedMetrics(report.metrics as MetricId[]);
    setGroupBy(report.groupBy);
    setReportName(report.name);
  };

  const handleNewReport = () => {
    setSelectedMetrics([]);
    setGroupBy("month");
    setReportName("");
  };

  const handleDeleteReport = (id: string) => {
    removeSavedReport(id);
    toast("Report deleted");
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-peec-dark">Reports</h1>
            <p className="text-sm text-peec-text-muted">Build custom reports with metrics, charts, and CSV export</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg border border-peec-border-light px-3 py-1.5 text-xs font-medium text-peec-dark hover:bg-stone-50 tablet:hidden"
          >
            {sidebarOpen ? "Hide Panel" : "Show Panel"}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar — Saved Reports + Metric Picker */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-[260px] space-y-5">
                  {/* Saved Reports */}
                  <div className="rounded-xl border border-peec-border-light bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-peec-dark">Saved Reports</h3>
                      <button
                        type="button"
                        onClick={handleNewReport}
                        className="flex items-center gap-1 rounded-md bg-peec-dark px-2 py-1 text-2xs font-medium text-white hover:bg-stone-800"
                      >
                        <Plus className="h-3 w-3" /> New
                      </button>
                    </div>
                    {savedReports.length === 0 ? (
                      <p className="text-2xs text-peec-text-muted">No saved reports yet</p>
                    ) : (
                      <div className="space-y-1">
                        {savedReports.map((report) => (
                          <div
                            key={report.id}
                            className="group flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-stone-50"
                          >
                            <button
                              type="button"
                              onClick={() => handleLoadReport(report)}
                              className="flex items-center gap-2 text-left"
                            >
                              <FileBarChart className="h-3.5 w-3.5 text-peec-text-muted" />
                              <div>
                                <p className="text-xs font-medium text-peec-dark">{report.name}</p>
                                <p className="text-2xs text-peec-text-muted">
                                  {report.metrics.length} metric{report.metrics.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteReport(report.id)}
                              className="rounded p-1 text-peec-text-muted opacity-0 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Report Config */}
                  <div className="rounded-xl border border-peec-border-light bg-white p-4">
                    <h3 className="mb-3 text-xs font-semibold text-peec-dark">Report Name</h3>
                    <input
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      className="mb-4 w-full rounded-lg border border-peec-border-light px-3 py-1.5 text-xs text-peec-dark placeholder:text-peec-text-muted focus:border-peec-dark focus:outline-none"
                      placeholder="e.g., Monthly Overview"
                    />

                    <h3 className="mb-3 text-xs font-semibold text-peec-dark">Group By</h3>
                    <div className="mb-4 flex gap-1 rounded-lg border border-peec-border-light bg-stone-50 p-1">
                      {(["day", "week", "month"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGroupBy(opt)}
                          className={`flex-1 rounded-md px-2 py-1 text-2xs font-medium capitalize transition-colors ${
                            groupBy === opt ? "bg-white text-peec-dark shadow-sm" : "text-peec-text-muted hover:text-peec-dark"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <h3 className="mb-3 text-xs font-semibold text-peec-dark">Metrics</h3>
                    <MetricPicker selected={selectedMetrics} onChange={setSelectedMetrics} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content — Report Canvas */}
          <div className="min-w-0 flex-1">
            <ReportCanvas metrics={selectedMetrics} groupBy={groupBy} reportName={reportName} />
          </div>
        </div>
      </div>
    </PageEntrance>
  );
}
