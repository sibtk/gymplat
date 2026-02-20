"use client";

import { Download, Save } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useToast } from "@/components/dashboard/toast";
import {
  availableMetrics,
  downloadCsv,
  generateCsv,
  generateReportData,
} from "@/lib/report-engine";
import { useGymStore } from "@/lib/store";
import { formatCurrency, generateId } from "@/lib/utils";

import type { MetricId } from "@/lib/report-engine";

interface ReportCanvasProps {
  metrics: MetricId[];
  groupBy: "day" | "week" | "month";
  reportName: string;
}

const metricColors = [
  "#171717", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444",
];

export function ReportCanvas({ metrics, groupBy, reportName }: ReportCanvasProps) {
  const members = useGymStore((s) => s.members);
  const transactions = useGymStore((s) => s.transactions);
  const plans = useGymStore((s) => s.plans);
  const addSavedReport = useGymStore((s) => s.addSavedReport);
  const { toast } = useToast();

  const { chartData, summary } = useMemo(
    () => generateReportData(metrics, members, transactions, plans, groupBy),
    [metrics, members, transactions, plans, groupBy],
  );

  if (metrics.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-peec-border-light bg-white">
        <p className="text-sm text-peec-text-muted">Select metrics to generate a report</p>
      </div>
    );
  }

  const handleExport = () => {
    const csv = generateCsv(chartData, metrics);
    downloadCsv(csv, `${reportName || "report"}.csv`);
    toast("CSV exported");
  };

  const handleSave = () => {
    addSavedReport({
      id: generateId("rpt"),
      name: reportName || "Untitled Report",
      metrics: [...metrics],
      dateRange: { start: "", end: "" },
      groupBy,
      filters: {},
      createdAt: new Date().toISOString(),
    });
    toast("Report saved");
  };

  const metricLabels = metrics.map((id) => availableMetrics.find((m) => m.id === id)?.label ?? id);

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
        {metrics.map((metric, i) => {
          const label = metricLabels[i];
          const value = summary[metric] ?? 0;
          const isRevenue = metric.includes("revenue") || metric.includes("refund");
          return (
            <div key={metric} className="rounded-xl border border-peec-border-light bg-white p-4">
              <p className="text-2xs text-peec-text-muted">{label}</p>
              <p className="text-lg font-bold text-peec-dark">
                {isRevenue ? formatCurrency(value) : metric.includes("rate") ? `${value}%` : value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-peec-dark">{reportName || "Report"}</h3>
          <div className="flex gap-2">
            <button type="button" onClick={handleExport} className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs font-medium text-peec-dark hover:bg-stone-50">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button type="button" onClick={handleSave} className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800">
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#78716c" }} />
            <YAxis tick={{ fontSize: 11, fill: "#78716c" }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }}
            />
            {metrics.map((metric, i) => (
              <Bar
                key={metric}
                dataKey={metric}
                name={metricLabels[i]}
                fill={metricColors[i % metricColors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3">
          {metrics.map((metric, i) => (
            <div key={metric} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: metricColors[i % metricColors.length] }} />
              <span className="text-2xs text-peec-text-secondary">{metricLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-peec-dark">Raw Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-peec-border-light bg-stone-50/50">
                <th className="px-3 py-2 text-left text-2xs font-medium uppercase text-peec-text-muted">Period</th>
                {metricLabels.map((label) => (
                  <th key={label} className="px-3 py-2 text-right text-2xs font-medium uppercase text-peec-text-muted">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => (
                <tr key={row.label} className="border-b border-peec-border-light/50 last:border-0">
                  <td className="px-3 py-2 text-xs font-medium text-peec-dark">{row.label}</td>
                  {metrics.map((metric) => {
                    const val = row[metric] as number | undefined;
                    const isRevenue = metric.includes("revenue") || metric.includes("refund");
                    return (
                      <td key={metric} className="px-3 py-2 text-right text-xs text-peec-text-secondary">
                        {isRevenue ? formatCurrency(val ?? 0) : metric.includes("rate") ? `${val}%` : (val ?? 0).toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
