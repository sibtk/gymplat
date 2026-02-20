import type { MemberFull, Plan, TransactionFull } from "@/lib/types";

// ─── Available Metrics ──────────────────────────────────────────

export const availableMetrics = [
  { id: "total_members", label: "Total Members", category: "member" },
  { id: "active_members", label: "Active Members", category: "member" },
  { id: "at_risk_members", label: "At-Risk Members", category: "member" },
  { id: "churned_members", label: "Churned Members", category: "member" },
  { id: "new_signups", label: "New Signups", category: "member" },
  { id: "total_revenue", label: "Total Revenue", category: "revenue" },
  { id: "avg_revenue_per_member", label: "Avg Revenue / Member", category: "revenue" },
  { id: "refund_total", label: "Total Refunds", category: "revenue" },
  { id: "check_ins", label: "Total Check-ins", category: "engagement" },
  { id: "avg_visits_per_member", label: "Avg Visits / Member", category: "engagement" },
  { id: "retention_rate", label: "Retention Rate", category: "retention" },
  { id: "churn_rate", label: "Churn Rate", category: "retention" },
] as const;

export type MetricId = (typeof availableMetrics)[number]["id"];

// ─── Data Point ─────────────────────────────────────────────────

export interface ReportDataPoint {
  label: string;
  [key: string]: string | number;
}

// ─── Generate Report Data ───────────────────────────────────────

export function generateReportData(
  metrics: MetricId[],
  members: MemberFull[],
  transactions: TransactionFull[],
  plans: Plan[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _groupBy: "day" | "week" | "month",
): { chartData: ReportDataPoint[]; summary: Record<string, number> } {
  void plans;

  // Compute summary values
  const summary: Record<string, number> = {};
  const active = members.filter((m) => m.status === "active").length;
  const atRisk = members.filter((m) => m.status === "at-risk" || m.status === "critical").length;
  const churned = members.filter((m) => m.status === "churned").length;
  const totalRevenue = transactions
    .filter((t) => t.type !== "refund" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const refundTotal = transactions
    .filter((t) => t.type === "refund")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalCheckIns = members.reduce((sum, m) => sum + m.checkInHistory.length, 0);

  for (const metric of metrics) {
    switch (metric) {
      case "total_members": summary[metric] = members.length; break;
      case "active_members": summary[metric] = active; break;
      case "at_risk_members": summary[metric] = atRisk; break;
      case "churned_members": summary[metric] = churned; break;
      case "new_signups": summary[metric] = members.filter((m) => m.tags.includes("new-member")).length; break;
      case "total_revenue": summary[metric] = Math.round(totalRevenue * 100) / 100; break;
      case "avg_revenue_per_member": summary[metric] = members.length > 0 ? Math.round((totalRevenue / members.length) * 100) / 100 : 0; break;
      case "refund_total": summary[metric] = Math.round(refundTotal * 100) / 100; break;
      case "check_ins": summary[metric] = totalCheckIns; break;
      case "avg_visits_per_member": summary[metric] = members.length > 0 ? Math.round((totalCheckIns / members.length) * 10) / 10 : 0; break;
      case "retention_rate": summary[metric] = members.length > 0 ? Math.round((active / members.length) * 1000) / 10 : 0; break;
      case "churn_rate": summary[metric] = members.length > 0 ? Math.round((churned / members.length) * 1000) / 10 : 0; break;
    }
  }

  // Generate mock time-series chart data (last 6 months)
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const chartData: ReportDataPoint[] = months.map((month, i) => {
    const point: ReportDataPoint = { label: month };
    for (const metric of metrics) {
      const base = summary[metric] ?? 0;
      // Simulate trend: gradually increasing to current value
      const factor = 0.7 + (i / (months.length - 1)) * 0.3;
      const noise = 1 + (Math.random() - 0.5) * 0.1;
      point[metric] = Math.round(base * factor * noise * 100) / 100;
    }
    return point;
  });

  return { chartData, summary };
}

// ─── CSV Export ──────────────────────────────────────────────────

export function generateCsv(data: ReportDataPoint[], metrics: MetricId[]): string {
  const metricLabels = metrics.map((id) => availableMetrics.find((m) => m.id === id)?.label ?? id);
  const header = ["Period", ...metricLabels].join(",");
  const rows = data.map((point) => {
    const values = metrics.map((m) => point[m] ?? "");
    return [point.label, ...values].join(",");
  });
  return [header, ...rows].join("\n");
}

export function downloadCsv(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
