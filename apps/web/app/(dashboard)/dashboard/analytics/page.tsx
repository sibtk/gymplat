"use client";

import { Shield, TrendingUp, Users } from "lucide-react";

import { AnimatedNumber, CardHover, PageEntrance } from "@/components/dashboard/motion";
import { RetentionChart } from "@/components/dashboard/retention-chart";
import {
  cohortData,
  locationComparison,
  planComparison,
  retentionChartData,
  retentionChartMonths,
  retentionImpact,
  riskBuckets,
} from "@/lib/mock-data";

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

function parseImpactValue(value: string): { num: number; prefix: string; suffix: string } {
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^([^0-9]*)([0-9.]+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: "" };
  return {
    prefix: match[1] ?? "",
    num: parseFloat(match[2] ?? "0"),
    suffix: match[3] ?? "",
  };
}

export default function AnalyticsPage() {
  return (
    <PageEntrance>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-peec-dark">Analytics</h1>
          <p className="text-sm text-peec-text-tertiary">
            Retention insights and churn analysis
          </p>
        </div>

        {/* Impact Hero */}
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
          {retentionImpact.map((item, idx) => {
              const Icon = impactIcons[idx] as typeof Users;
              const { num, prefix, suffix } = parseImpactValue(item.value);
              return (
                <CardHover key={item.label}>
                  <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-card">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-peec-dark">
                      <AnimatedNumber value={num} prefix={prefix} suffix={suffix} />
                    </p>
                    <p className="text-xs text-peec-text-tertiary">{item.label}</p>
                    <p className="mt-1 text-2xs text-peec-text-muted">{item.description}</p>
                  </div>
                </CardHover>
              );
          })}
        </div>

        {/* Full Retention Chart */}
        <RetentionChart lines={retentionChartData} months={retentionChartMonths} />

        {/* Cohort Analysis */}
        <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <h3 className="mb-1 text-sm font-semibold text-peec-dark">Cohort Analysis</h3>
            <p className="mb-4 text-xs text-peec-text-muted">Member retention by signup month</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-peec-border-light bg-stone-50/50">
                    <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Cohort
                    </th>
                    <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Members
                    </th>
                    <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Month 1
                    </th>
                    <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Month 3
                    </th>
                    <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Month 6
                    </th>
                    <th className="px-4 py-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Month 12
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((row) => (
                    <tr key={row.month} className="border-b border-peec-border-light/50 last:border-0">
                      <td className="px-4 py-2.5 text-xs font-medium text-peec-dark">{row.month}</td>
                      <td className="px-4 py-2.5 text-xs text-peec-text-secondary">{row.totalMembers}</td>
                      <td className="px-4 py-2.5 text-center">
                        <CohortCell value={row.m1} />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <CohortCell value={row.m3} />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <CohortCell value={row.m6} />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <CohortCell value={row.m12} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        {/* Risk Buckets */}
        <div className="rounded-xl border border-peec-border-light bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-peec-dark">Churn Prediction Breakdown</h3>
            <p className="mb-4 text-xs text-peec-text-muted">Members categorized by churn risk level</p>
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
                          width: `${(bucket.count / 234) * 100}%`,
                          backgroundColor: bucket.color,
                        }}
                      />
                    </div>
                  </div>
                </CardHover>
              ))}
          </div>
        </div>

        {/* Plan + Location Comparison */}
        <div className="grid grid-cols-1 gap-6 desktop:grid-cols-2">
            {/* Plan comparison */}
            <div className="rounded-xl border border-peec-border-light bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold text-peec-dark">Plan Comparison</h3>
              <p className="mb-4 text-xs text-peec-text-muted">Retention by membership type</p>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-2xs text-peec-text-muted">
                    <th className="pb-2 font-normal">#</th>
                    <th className="pb-2 font-normal">Plan</th>
                    <th className="pb-2 font-normal">Type</th>
                    <th className="pb-2 font-normal">Share</th>
                    <th className="pb-2 font-normal">Retention</th>
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

            {/* Location comparison */}
            <div className="rounded-xl border border-peec-border-light bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold text-peec-dark">Location Comparison</h3>
              <p className="mb-4 text-xs text-peec-text-muted">Performance across gym locations</p>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-2xs text-peec-text-muted">
                    <th className="pb-2 font-normal">#</th>
                    <th className="pb-2 font-normal">Location</th>
                    <th className="pb-2 font-normal">Retention</th>
                    <th className="pb-2 font-normal">Members</th>
                    <th className="pb-2 font-normal">Score</th>
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
                          <span
                            className={`ml-1 text-2xs ${loc.delta > 0 ? "text-green-500" : "text-red-500"}`}
                          >
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
