"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LogIn,
  TrendingUp,
  UserMinus,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import { RetentionChart } from "@/components/dashboard/retention-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  atRiskMembers,
  kpiStats,
  recentActivity,
  retentionChartData,
  retentionChartMonths,
} from "@/lib/mock-data";

import type { ActivityEvent } from "@/lib/mock-data";

function activityIcon(type: ActivityEvent["type"]) {
  switch (type) {
    case "check-in":
      return <LogIn className="h-4 w-4 text-blue-500" />;
    case "signup":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "cancellation":
      return <UserMinus className="h-4 w-4 text-red-500" />;
    case "payment":
      return <CreditCard className="h-4 w-4 text-purple-500" />;
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
}

export default function DashboardOverviewPage() {
  const topRisk = atRiskMembers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats banner */}
      <div className="rounded-xl border border-peec-border-light bg-white px-5 py-3 shadow-card">
        <div className="flex items-center gap-2 text-sm text-peec-dark">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span>
            Overview &middot;{" "}
            <span className="font-medium">
              Iron Temple&apos;s retention trending up by 5.2% this month
            </span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
        {kpiStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Chart + At Risk */}
      <div className="grid grid-cols-1 gap-6 desktop:grid-cols-3">
        {/* Retention Chart */}
        <div className="desktop:col-span-2">
          <RetentionChart lines={retentionChartData} months={retentionChartMonths} />
        </div>

        {/* At Risk Members */}
        <div className="rounded-xl border border-peec-border-light bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-peec-dark">At-Risk Members</h3>
              <p className="text-xs text-peec-text-muted">Highest churn probability</p>
            </div>
            <Link
              href={"/dashboard/members" as string}
              className="flex items-center gap-1 text-xs font-medium text-peec-dark hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {topRisk.map((member) => (
              <div
                key={member.id}
                className="rounded-lg border border-peec-border-light/50 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-2xs font-medium text-peec-dark">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-peec-dark">{member.name}</p>
                      <p className="text-2xs text-peec-text-muted">{member.lastVisit}</p>
                    </div>
                  </div>
                  <StatusBadge status={member.status} />
                </div>
                {/* Risk score bar */}
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full ${
                        member.riskScore >= 80
                          ? "bg-red-500"
                          : member.riskScore >= 60
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${member.riskScore}%` }}
                    />
                  </div>
                  <span className="text-2xs font-medium text-peec-text-secondary">
                    {member.riskScore}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {member.riskFactors.map((factor) => (
                    <span
                      key={factor}
                      className="rounded bg-stone-50 px-1.5 py-0.5 text-2xs text-peec-text-muted"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-peec-dark">Recent Activity</h3>
        <div className="space-y-0">
          {recentActivity.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 border-b border-peec-border-light/50 py-3 last:border-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-50">
                {activityIcon(event.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-peec-dark">
                  <span className="font-medium">{event.member}</span>{" "}
                  {event.description}
                </p>
              </div>
              <span className="shrink-0 text-xs text-peec-text-muted">{event.timestamp}</span>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
