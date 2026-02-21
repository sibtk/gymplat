"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Phone, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

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
import { useToast } from "@/components/dashboard/toast";
import { useCopilotInsights } from "@/hooks/use-copilot-insights";
import {
  recentActivity,
  retentionChartData,
  retentionChartMonths,
} from "@/lib/mock-data";
import { useGymStore, useDashboardStore } from "@/lib/store";
import { formatCurrency, generateId, getInitials } from "@/lib/utils";

import type { KpiStat } from "@/lib/mock-data";
import type { CopilotInsight } from "@/lib/retention/types";

const dateRangeLabels: Record<string, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last year",
};

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dateRange = useDashboardStore((s) => s.dateRange);
  const members = useGymStore((s) => s.members);
  const transactions = useGymStore((s) => s.transactions);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const gymHealthScore = useGymStore((s) => s.gymHealthScore);
  const addIntervention = useGymStore((s) => s.addIntervention);
  const addActivityEvent = useGymStore((s) => s.addActivityEvent);
  const insights = useCopilotInsights("dashboard");

  const handleInsightAction = useCallback((insight: CopilotInsight) => {
    if (insight.actionType === "navigate") {
      if (insight.actionLabel === "View Analytics") {
        router.push("/dashboard/analytics" as string);
      } else if (insight.actionLabel === "View Profile" && insight.relatedMemberId) {
        router.push("/dashboard/members" as string);
      } else {
        router.push("/dashboard/insights" as string);
      }
      return;
    }

    if (insight.actionType && insight.actionType !== "dismiss") {
      const member = insight.relatedMemberId
        ? members.find((m) => m.id === insight.relatedMemberId)
        : null;
      addIntervention({
        id: generateId("intv"),
        memberId: insight.relatedMemberId ?? "unknown",
        memberName: insight.relatedMemberName ?? member?.name ?? "Unknown",
        type: insight.actionType,
        title: insight.actionLabel ?? insight.title,
        description: insight.description,
        status: "recommended",
        priority: insight.priority,
        estimatedImpact: "Reduce churn likelihood",
        actualOutcome: null,
        createdAt: new Date().toISOString(),
        executedAt: null,
        completedAt: null,
        assignedTo: null,
      });
      addActivityEvent({
        id: generateId("act"),
        type: "update",
        description: `Queued: ${insight.actionLabel ?? insight.title}`,
        timestamp: new Date().toISOString(),
        member: insight.relatedMemberName ?? "Unknown",
      });
      toast(`${insight.actionLabel ?? "Action"} queued`);
    }
  }, [router, members, addIntervention, addActivityEvent, toast]);

  const { kpiStats, kpiExplanations, topRisk } = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "active").length;
    const churned = members.filter((m) => m.status === "churned").length;
    const retentionRate = total > 0 ? Math.round((active / total) * 1000) / 10 : 0;
    const churnRate = total > 0 ? Math.round((churned / total) * 1000) / 10 : 0;
    const monthlyRevenue = transactions
      .filter((t) => t.type !== "refund" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const rangeMultiplier: Record<string, number> = {
      "7d": 0.25, "30d": 1, "90d": 3, "1y": 12,
    };
    const rangeRevenueLabel: Record<string, string> = {
      "7d": "Weekly Revenue",
      "30d": "Monthly Revenue",
      "90d": "Quarterly Revenue",
      "1y": "Annual Revenue",
    };
    const multiplier = rangeMultiplier[dateRange] ?? 1;
    const scaledRevenue = Math.round(monthlyRevenue * multiplier);
    const revenueLabel = rangeRevenueLabel[dateRange] ?? "Monthly Revenue";

    const stats: KpiStat[] = [
      { label: "Total Members", value: total.toLocaleString(), change: "+3.2%", trend: "up" },
      { label: revenueLabel, value: formatCurrency(scaledRevenue), change: "+5.8%", trend: "up" },
      { label: "Retention Rate", value: `${retentionRate}%`, change: "+2.1%", trend: "up" },
      { label: "Churn Rate", value: `${churnRate}%`, change: "-1.4%", trend: "down" },
    ];

    const periodDesc = dateRange === "7d" ? "this week" : dateRange === "90d" ? "this quarter" : dateRange === "1y" ? "this year" : "this month";
    const explanations: Record<string, string> = {
      "Total Members": `Count of all registered members across all plan types (${active} active, ${churned} churned, ${total - active - churned} frozen). The +3.2% change reflects net growth compared to the previous period.`,
      [revenueLabel]: `Sum of all completed, non-refunded transactions ${periodDesc} (${formatCurrency(scaledRevenue)}). Includes membership fees, PT sessions, and add-on services. Growth is driven primarily by premium plan upgrades and new sign-ups.`,
      "Retention Rate": `${active} of ${total} members remain active (${retentionRate}%). This is calculated as active members divided by total members. Industry average for gyms is around 72%, so ${retentionRate > 72 ? "you're outperforming" : "there's room to improve vs"} the benchmark.`,
      "Churn Rate": `${churned} of ${total} members have churned (${churnRate}%). Churn rate is the inverse of retention — lower is better. The -1.4% improvement means fewer members are leaving compared to the previous period.`,
    };

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

    return { kpiStats: stats, kpiExplanations: explanations, topRisk: atRisk };
  }, [members, transactions, riskAssessments, dateRange]);

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
          <div className="grid grid-cols-1 items-stretch gap-4 tablet:grid-cols-4">
            {/* Health Score Orb */}
            {gymHealthScore && (
              <div className="tablet:col-span-1">
                <HealthScoreOrb healthScore={gymHealthScore} />
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 content-center gap-4 tablet:col-span-2">
              {kpiStats.map((stat) => (
                <StatCard key={stat.label} stat={stat} explanation={kpiExplanations[stat.label]} />
              ))}
            </div>

            {/* Revenue Ticker */}
            <div className="tablet:col-span-1">
              <RevenueImpactTicker />
            </div>
          </div>
        </StaggerItem>

        {/* Copilot Insights Banner */}
        {insights.length > 0 && (
          <StaggerItem>
            <div className="space-y-2">
              <AnimatePresence>
                {insights.slice(0, 3).map((insight) => (
                  <CopilotCard key={insight.id} insight={insight} onAction={handleInsightAction} />
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
                <h3 className="text-sm font-medium text-peec-dark">At-Risk Members</h3>
                <p className="mt-0.5 text-xs text-peec-text-muted">Engine-computed risk scores with recommended actions</p>
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
