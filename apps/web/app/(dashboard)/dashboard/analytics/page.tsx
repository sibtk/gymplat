"use client";

import { Shield, Sparkles, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";

import { MemberFlowSankey } from "@/components/dashboard/member-flow-sankey";
import { AnimatedNumber, CardHover, PageEntrance, StaggerItem } from "@/components/dashboard/motion";
import { RetentionChart } from "@/components/dashboard/retention-chart";
import { RiskHeatmap } from "@/components/dashboard/risk-heatmap";
import {
  cohortData,
  locationComparison,
  planComparison,
  retentionChartData,
  retentionChartMonths,
} from "@/lib/mock-data";
import { useDashboardStore, useGymStore } from "@/lib/store";

function typeBadgeClass(type: string): string {
  switch (type) {
    case "Premium":
      return "bg-amber-50 text-amber-700";
    case "Base":
      return "bg-blue-50 text-blue-700";
    case "Standard":
      return "bg-green-50 text-green-700";
    case "B2B":
      return "bg-purple-50 text-purple-700";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

const impactIcons = [Users, TrendingUp, Shield];

export default function AnalyticsPage() {
  const members = useGymStore((s) => s.members);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const gymHealthScore = useGymStore((s) => s.gymHealthScore);

  const interventions = useGymStore((s) => s.interventions);
  const dateRange = useDashboardStore((s) => s.dateRange);

  const { retentionImpact, riskBuckets } = useMemo(() => {
    const rangeMultiplier: Record<string, number> = {
      "7d": 0.25, "30d": 1, "90d": 3, "1y": 12,
    };
    const multiplier = rangeMultiplier[dateRange] ?? 1;
    const total = members.length;
    const active = members.filter((m) => m.status === "active").length;
    const retentionRate = total > 0 ? Math.round((active / total) * 1000) / 10 : 0;

    // Match the Revenue Impact Ticker calculation
    const completed = interventions.filter(
      (i) => i.status === "completed" || i.status === "executing",
    );
    let interventionRevenue = 0;
    for (const intervention of completed) {
      switch (intervention.type) {
        case "email": interventionRevenue += 45; break;
        case "discount": interventionRevenue += 85; break;
        case "staff_task": interventionRevenue += 60; break;
        case "phone_call": interventionRevenue += 120; break;
        case "class_recommendation": interventionRevenue += 35; break;
        case "pt_consultation": interventionRevenue += 200; break;
      }
    }
    const savedRevenue = Math.round(4820 * multiplier) + interventionRevenue;
    const interventionCount = Math.round(14 * multiplier) + completed.length;

    // Confidence scales with data window — more data = higher accuracy
    const confidenceOffset: Record<string, number> = {
      "7d": -8, "30d": -3, "90d": 0, "1y": 2,
    };
    const baseConfidence = gymHealthScore
      ? Math.round(gymHealthScore.overall * 0.95)
      : 85;
    const confidencePercent = Math.min(99, baseConfidence + (confidenceOffset[dateRange] ?? 0));

    // Members retained scales — cumulative saves over period
    const retainedBase = Math.round(active * multiplier * 0.85);
    const retainedLabel = dateRange === "7d" ? "Members Active This Week"
      : dateRange === "90d" ? "Members Retained (Quarter)"
      : dateRange === "1y" ? "Members Retained (Year)"
      : "Members Retained";

    const periodLabel = dateRange === "7d" ? "this week" : dateRange === "90d" ? "this quarter" : dateRange === "1y" ? "this year" : "this month";
    const impact = [
      { label: retainedLabel, value: `${retainedBase}`, description: `${retentionRate}% retention rate ${periodLabel}` },
      { label: "Revenue Saved", value: `$${savedRevenue.toLocaleString()}`, description: `From ${interventionCount} interventions ${periodLabel}` },
      { label: "Engine Confidence", value: `${confidencePercent}%`, description: `Prediction accuracy based on ${periodLabel} data window` },
    ];

    // Use real risk assessments for buckets
    const assessments = Object.values(riskAssessments);
    const lowRisk = assessments.filter((a) => a.riskLevel === "low" || a.riskLevel === "moderate").length;
    const medRisk = assessments.filter((a) => a.riskLevel === "elevated").length;
    const highRisk = assessments.filter((a) => a.riskLevel === "high" || a.riskLevel === "critical").length;

    const bucketTotal = lowRisk + medRisk + highRisk;

    const buckets = [
      {
        level: "Low",
        count: lowRisk,
        percentage: bucketTotal > 0 ? Math.round((lowRisk / bucketTotal) * 100) : 0,
        color: "#22c55e",
      },
      {
        level: "Medium",
        count: medRisk,
        percentage: bucketTotal > 0 ? Math.round((medRisk / bucketTotal) * 100) : 0,
        color: "#f59e0b",
      },
      {
        level: "High",
        count: highRisk,
        percentage: bucketTotal > 0 ? Math.round((highRisk / bucketTotal) * 100) : 0,
        color: "#ef4444",
      },
    ];

    return { retentionImpact: impact, riskBuckets: buckets };
  }, [members, riskAssessments, gymHealthScore, interventions, dateRange]);

  return (
    <PageEntrance>
      <div className="space-y-6">
        <StaggerItem>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-peec-dark">Analytics</h1>
              <p className="text-sm text-peec-text-muted">
                Retention insights and churn analysis powered by the retention engine
              </p>
            </div>
            {gymHealthScore && (
              <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50/50 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-xs text-purple-700">
                  Health: {gymHealthScore.overall}/100
                </span>
              </div>
            )}
          </div>
        </StaggerItem>

        {/* Impact Hero */}
        <StaggerItem>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
            {retentionImpact.map((item, idx) => {
                const Icon = impactIcons[idx] as typeof Users;
                const cleaned = item.value.replace(/,/g, "");
                const match = cleaned.match(/^([^0-9]*)([0-9.]+)(.*)$/);
                const prefix = match?.[1] ?? "";
                const num = parseFloat(match?.[2] ?? "0");
                const suffix = match?.[3] ?? "";
                return (
                  <CardHover key={item.label}>
                    <div className="rounded-xl border border-peec-border-light bg-white p-5">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-peec-dark">
                        <AnimatedNumber value={num} prefix={prefix} suffix={suffix} />
                      </p>
                      <p className="text-xs text-peec-text-muted">{item.label}</p>
                      <p className="mt-1 text-2xs text-peec-text-muted">{item.description}</p>
                    </div>
                  </CardHover>
                );
            })}
          </div>
        </StaggerItem>

        {/* Heatmap + Sankey */}
        <div className="grid grid-cols-1 gap-6 desktop:grid-cols-2">
          <StaggerItem>
            <RiskHeatmap />
          </StaggerItem>
          <StaggerItem>
            <MemberFlowSankey />
          </StaggerItem>
        </div>

        {/* Full Retention Chart */}
        <StaggerItem>
          <RetentionChart lines={retentionChartData} months={retentionChartMonths} />
        </StaggerItem>

        {/* Cohort Analysis */}
        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold text-peec-dark">Cohort Analysis</h3>
              <p className="mb-4 text-xs text-peec-text-muted">Member retention by signup month</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-peec-border-light bg-stone-50/50">
                      <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Cohort</th>
                      <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Members</th>
                      <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Month 1</th>
                      <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Month 3</th>
                      <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Month 6</th>
                      <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Month 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((row) => (
                      <tr key={row.month} className="border-b border-peec-border-light/50 last:border-0">
                        <td className="px-4 py-2.5 text-xs font-medium text-peec-dark">{row.month}</td>
                        <td className="px-4 py-2.5 text-xs text-peec-text-secondary">{row.totalMembers}</td>
                        <td className="px-4 py-2.5 text-center"><CohortCell value={row.m1} /></td>
                        <td className="px-4 py-2.5 text-center"><CohortCell value={row.m3} /></td>
                        <td className="px-4 py-2.5 text-center"><CohortCell value={row.m6} /></td>
                        <td className="px-4 py-2.5 text-center"><CohortCell value={row.m12} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        </StaggerItem>

        {/* Risk Buckets */}
        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <h3 className="mb-1 text-sm font-semibold text-peec-dark">Churn Prediction Breakdown</h3>
            <p className="mb-4 text-xs text-peec-text-muted">Members categorized by engine-computed risk level</p>
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
              {riskBuckets.map((bucket) => (
                <CardHover key={bucket.level}>
                  <div className="rounded-lg border border-peec-border-light/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-peec-dark">{bucket.level} Risk</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-2xs font-medium"
                        style={{
                          backgroundColor: `${bucket.color}15`,
                          color: bucket.color,
                        }}
                      >
                        {bucket.percentage}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-peec-dark">{bucket.count}</p>
                    <p className="text-2xs text-peec-text-muted">members</p>
                    <div className="mt-2 h-1.5 rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${members.length > 0 ? (bucket.count / members.length) * 100 : 0}%`,
                          backgroundColor: bucket.color,
                        }}
                      />
                    </div>
                  </div>
                </CardHover>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* Plan + Location Comparison */}
        <div className="grid grid-cols-1 gap-6 desktop:grid-cols-2">
          <StaggerItem>
            <div className="rounded-xl border border-peec-border-light bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold text-peec-dark">Plan Comparison</h3>
              <p className="mb-4 text-xs text-peec-text-muted">Retention by membership type</p>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-peec-border-light bg-stone-50/50">
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">#</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Plan</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Type</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Share</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Retention</th>
                  </tr>
                </thead>
                <tbody>
                  {planComparison.map((plan) => (
                    <tr key={plan.name} className="border-t border-peec-border-light/50">
                      <td className="py-2 text-xs text-peec-text-muted">{plan.rank}</td>
                      <td className="py-2 text-xs font-medium text-peec-dark">{plan.name}</td>
                      <td className="py-2">
                        <span className={`rounded px-1.5 py-0.5 text-2xs font-medium ${typeBadgeClass(plan.type)}`}>
                          {plan.type}
                        </span>
                      </td>
                      <td className="py-2 text-xs text-peec-text-secondary">{plan.share}</td>
                      <td className="py-2 text-xs text-peec-text-secondary">{plan.avgRetention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-xl border border-peec-border-light bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold text-peec-dark">Location Comparison</h3>
              <p className="mb-4 text-xs text-peec-text-muted">Performance across gym locations</p>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-peec-border-light bg-stone-50/50">
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">#</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Location</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Retention</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Members</th>
                    <th className="px-3 py-2.5 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {locationComparison.map((loc) => (
                    <tr key={loc.name} className="border-t border-peec-border-light/50">
                      <td className="py-2 text-xs text-peec-text-muted">{loc.rank}</td>
                      <td className="py-2 text-xs font-medium text-peec-dark">{loc.name}</td>
                      <td className="py-2">
                        <span className="text-xs text-peec-dark">{loc.retention}</span>
                        {loc.delta !== undefined && (
                          <span className={`ml-1 text-2xs ${loc.delta > 0 ? "text-green-500" : "text-red-500"}`}>
                            {loc.delta > 0 ? "\u2191" : "\u2193"} {Math.abs(loc.delta)}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-peec-text-secondary">{loc.members}</td>
                      <td className="py-2 text-xs text-peec-text-secondary">{loc.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StaggerItem>
        </div>
      </div>
    </PageEntrance>
  );
}

function CohortCell({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-2xs text-peec-text-muted">&mdash;</span>;
  }

  const intensity =
    value >= 90
      ? "bg-green-100 text-green-800"
      : value >= 80
        ? "bg-green-50 text-green-700"
        : value >= 70
          ? "bg-amber-50 text-amber-700"
          : "bg-red-50 text-red-700";

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-2xs font-medium ${intensity}`}>
      {value}%
    </span>
  );
}
