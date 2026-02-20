"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Phone, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { CheckedInCounter } from "@/components/dashboard/checked-in-counter";
import { CopilotCard } from "@/components/dashboard/copilot-card";
import { HealthScoreOrb } from "@/components/dashboard/health-score-orb";
import { LiveActivityFeed } from "@/components/dashboard/live-activity-feed";
import { MemberFlowSankey } from "@/components/dashboard/member-flow-sankey";
import { CardHover, PageEntrance, StaggerItem } from "@/components/dashboard/motion";
import { RetentionChart } from "@/components/dashboard/retention-chart";
import { RevenueImpactTicker } from "@/components/dashboard/revenue-impact-ticker";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useCopilotInsights } from "@/hooks/use-copilot-insights";
import {
  recentActivity,
  retentionChartData,
  retentionChartMonths,
} from "@/lib/mock-data";
import { useGymStore, useDashboardStore } from "@/lib/store";
import { formatCurrency, getInitials } from "@/lib/utils";

import type { KpiStat } from "@/lib/mock-data";

const dateRangeLabels: Record<string, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last year",
};

export default function DashboardOverviewPage() {
  const dateRange = useDashboardStore((s) => s.dateRange);
  const members = useGymStore((s) => s.members);
  const transactions = useGymStore((s) => s.transactions);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const gymHealthScore = useGymStore((s) => s.gymHealthScore);
  const insights = useCopilotInsights("dashboard");

  const { kpiStats, topRisk } = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "active").length;
    const churned = members.filter((m) => m.status === "churned").length;
    const retentionRate = total > 0 ? Math.round((active / total) * 1000) / 10 : 0;
    const churnRate = total > 0 ? Math.round((churned / total) * 1000) / 10 : 0;
    const monthlyRevenue = transactions
      .filter((t) => t.type !== "refund" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const stats: KpiStat[] = [
      { label: "Total Members", value: total.toLocaleString(), change: "+3.2%", trend: "up" },
      { label: "Monthly Revenue", value: formatCurrency(monthlyRevenue), change: "+5.8%", trend: "up" },
      { label: "Retention Rate", value: `${retentionRate}%`, change: "+2.1%", trend: "up" },
      { label: "Churn Rate", value: `${churnRate}%`, change: "-1.4%", trend: "down" },
    ];

    const atRisk = members
      .filter((m) => {
        const assessment = riskAssessments[m.id];
        return assessment && (assessment.riskLevel === "critical" || assessment.riskLevel === "high" || assessment.riskLevel === "elevated");
      })
      .sort((a, b) => {
        const aScore = riskAssessments[a.id]?.compositeScore ?? 0;
        const bScore = riskAssessments[b.id]?.compositeScore ?? 0;
        return bScore - aScore;
      })
      .slice(0, 5);

    return { kpiStats: stats, topRisk: atRisk };
  }, [members, transactions, riskAssessments]);

  return (
    <PageEntrance>
      <div className="space-y-6">
        {/* Stats banner */}
        <StaggerItem>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 rounded-xl border border-peec-border-light bg-white px-5 py-3">
              <div className="flex items-center gap-2 text-sm text-peec-dark">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>
                  Overview &middot;{" "}
                  <span className="font-medium">
                    Iron Temple&apos;s retention trending up by 5.2% this month
                  </span>
                  <span className="ml-2 text-xs text-peec-text-muted">
                    {dateRangeLabels[dateRange]}
                  </span>
                </span>
              </div>
            </div>
            <CheckedInCounter />
          </div>
        </StaggerItem>

        {/* Hero row: Health Orb + Revenue Ticker + KPIs */}
        <StaggerItem>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-4">
            {/* Health Score Orb */}
            {gymHealthScore && (
              <div className="tablet:col-span-1">
                <HealthScoreOrb healthScore={gymHealthScore} />
              </div>
            )}

            {/* Revenue Ticker */}
            <div className="tablet:col-span-1">
              <RevenueImpactTicker />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 tablet:col-span-2">
              {kpiStats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* Copilot Insights Banner */}
        {insights.length > 0 && (
          <StaggerItem>
            <div className="space-y-2">
              <AnimatePresence>
                {insights.slice(0, 3).map((insight) => (
                  <CopilotCard key={insight.id} insight={insight} />
                ))}
              </AnimatePresence>
            </div>
          </StaggerItem>
        )}

        {/* Charts + Sankey */}
        <div className="grid grid-cols-1 gap-6 desktop:grid-cols-3">
          <StaggerItem className="desktop:col-span-2">
            <RetentionChart lines={retentionChartData} months={retentionChartMonths} />
          </StaggerItem>

          <StaggerItem>
            <MemberFlowSankey />
          </StaggerItem>
        </div>

        {/* At Risk Members with action buttons */}
        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-peec-dark">At-Risk Members</h3>
                <p className="text-xs text-peec-text-muted">Engine-computed risk scores with recommended actions</p>
              </div>
              <Link
                href={"/dashboard/members" as string}
                className="flex items-center gap-1 text-xs font-medium text-peec-dark hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {topRisk.map((member) => {
                const assessment = riskAssessments[member.id];
                return (
                  <CardHover key={member.id}>
                    <div className="rounded-lg border border-peec-border-light/50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-2xs font-medium text-peec-dark">
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-peec-dark">{member.name}</p>
                            <p className="text-2xs text-peec-text-muted">
                              {assessment?.explanation.summary ?? "Computing..."}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={member.status} />
                      </div>

                      {/* Risk score bar */}
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-stone-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              (assessment?.compositeScore ?? 0) >= 80
                                ? "bg-red-500"
                                : (assessment?.compositeScore ?? 0) >= 60
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${assessment?.compositeScore ?? 0}%` }}
                          />
                        </div>
                        <span className="text-2xs font-medium text-peec-text-secondary">
                          {assessment?.compositeScore ?? 0}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-md bg-stone-50 px-2 py-1 text-2xs text-peec-text-secondary hover:bg-stone-100"
                        >
                          <Mail className="h-3 w-3" /> Send Email
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-md bg-stone-50 px-2 py-1 text-2xs text-peec-text-secondary hover:bg-stone-100"
                        >
                          <Tag className="h-3 w-3" /> Offer Discount
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-md bg-stone-50 px-2 py-1 text-2xs text-peec-text-secondary hover:bg-stone-100"
                        >
                          <Phone className="h-3 w-3" /> Assign Staff
                        </button>
                      </div>
                    </div>
                  </CardHover>
                );
              })}
              {topRisk.length === 0 && (
                <p className="text-center text-xs text-peec-text-muted">No at-risk members</p>
              )}
            </div>
          </div>
        </StaggerItem>

        {/* Live Activity */}
        <StaggerItem>
          <LiveActivityFeed initialEvents={recentActivity} />
        </StaggerItem>
      </div>
    </PageEntrance>
  );
}
