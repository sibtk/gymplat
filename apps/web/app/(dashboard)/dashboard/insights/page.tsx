"use client";

import {
  CheckCircle2,
  Clock,
  Gift,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Target,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

import { CopilotActionQueue } from "@/components/dashboard/copilot-action-queue";
import { CardHover, PageEntrance, StaggerItem } from "@/components/dashboard/motion";
import { ScoreBreakdownCard } from "@/components/dashboard/score-breakdown-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useToast } from "@/components/dashboard/toast";
import { campaignSuggestions } from "@/lib/mock-data";
import { useGymStore } from "@/lib/store";
import { generateId, getInitials } from "@/lib/utils";

import type { InterventionType } from "@/lib/retention/types";
import type { MemberFull } from "@/lib/types";

const campaignIcons: Record<string, typeof Target> = {
  "win-back": Gift,
  "re-engagement": Zap,
  upsell: Target,
};

const campaignColors: Record<string, string> = {
  "win-back": "bg-purple-50 text-purple-600",
  "re-engagement": "bg-blue-50 text-blue-600",
  upsell: "bg-green-50 text-green-600",
};

export default function RetentionIntelligencePage() {
  const { toast } = useToast();
  const members = useGymStore((s) => s.members);
  const plans = useGymStore((s) => s.plans);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const interventions = useGymStore((s) => s.interventions);
  const gymHealthScore = useGymStore((s) => s.gymHealthScore);
  const addIntervention = useGymStore((s) => s.addIntervention);
  const addActivityEvent = useGymStore((s) => s.addActivityEvent);

  const createIntervention = (
    member: MemberFull,
    type: InterventionType,
    title: string,
    description: string,
    priority: "low" | "medium" | "high" | "urgent",
  ) => {
    const assessment = riskAssessments[member.id];
    addIntervention({
      id: generateId("intv"),
      memberId: member.id,
      memberName: member.name,
      type,
      title,
      description,
      status: "recommended",
      priority,
      estimatedImpact: assessment
        ? `Risk score: ${assessment.compositeScore} — reduce churn likelihood`
        : "Improve member retention",
      actualOutcome: null,
      createdAt: new Date().toISOString(),
      executedAt: null,
      completedAt: null,
      assignedTo: null,
    });
    addActivityEvent({
      id: generateId("act"),
      type: "update",
      description: `Created: ${title} for ${member.name}`,
      timestamp: new Date().toISOString(),
      member: member.name,
    });
    toast(`${title} added to Action Queue for ${member.name}`);
  };

  const weeklyAtRisk = useMemo(
    () =>
      members
        .filter((m) => {
          const a = riskAssessments[m.id];
          return a && (a.riskLevel === "critical" || a.riskLevel === "high" || a.riskLevel === "elevated");
        })
        .sort((a, b) => {
          const aScore = riskAssessments[a.id]?.compositeScore ?? 0;
          const bScore = riskAssessments[b.id]?.compositeScore ?? 0;
          return bScore - aScore;
        })
        .slice(0, 4),
    [members, riskAssessments],
  );

  const getPlanName = (member: MemberFull) =>
    plans.find((p) => p.id === member.planId)?.name ?? "Unknown";

  // Build intervention history as a normalized list
  interface HistoryRow {
    id: string;
    timestamp: string;
    description: string;
    result: string;
    status: "success" | "pending" | "failed";
  }

  const interventionHistory: HistoryRow[] = useMemo(() => {
    if (interventions.length > 0) {
      return interventions.slice(0, 12).map((i) => {
        const statusMap: Record<string, HistoryRow["status"]> = {
          completed: "success",
          executing: "pending",
          approved: "pending",
          recommended: "pending",
          failed: "failed",
          dismissed: "failed",
        };
        return {
          id: i.id,
          timestamp: new Date(i.createdAt).toLocaleString(),
          description: `${i.title} for ${i.memberName}`,
          result: i.actualOutcome ?? i.estimatedImpact,
          status: statusMap[i.status] ?? "pending",
        };
      });
    }
    // Generate from assessments for initial view
    return Object.values(riskAssessments)
      .filter((a) => a.recommendedInterventions.length > 0)
      .slice(0, 6)
      .flatMap((a) => {
        const member = members.find((m) => m.id === a.memberId);
        return a.recommendedInterventions.slice(0, 1).map((rec) => ({
          id: `hist_${a.memberId}_${rec.type}`,
          timestamp: new Date(a.computedAt).toLocaleString(),
          description: `${rec.title} for ${member?.name ?? "Unknown"}`,
          result: rec.estimatedImpact,
          status: "success" as const,
        }));
      });
  }, [interventions, riskAssessments, members]);

  const confidencePercent = gymHealthScore
    ? Math.round(gymHealthScore.overall * 0.95)
    : 85;

  return (
    <PageEntrance>
      <div className="space-y-6">
        {/* Header */}
        <StaggerItem>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <h1 className="text-xl font-bold text-peec-dark">
                  Retention Intelligence
                </h1>
              </div>
              <p className="text-sm text-peec-text-muted">
                AI-powered retention engine with real-time risk scoring
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50/50 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-xs text-purple-700">
                Engine confidence: {confidencePercent}%
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Action Queue */}
        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <CopilotActionQueue />
          </div>
        </StaggerItem>

        {/* At Risk This Week — with real engine data */}
        <StaggerItem>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-peec-dark">At Risk This Week</h2>
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
              {weeklyAtRisk.map((member) => {
                const assessment = riskAssessments[member.id];
                return (
                  <CardHover key={member.id}>
                    <div className="rounded-xl border border-peec-border-light bg-white p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-peec-dark">
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-peec-dark">{member.name}</p>
                            <p className="text-2xs text-peec-text-muted">
                              {getPlanName(member)} &middot; {member.checkInHistory.length} check-ins
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={member.status} />
                      </div>

                      {/* Score breakdown card */}
                      {assessment && (
                        <div className="mb-3">
                          <ScoreBreakdownCard assessment={assessment} />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            createIntervention(
                              member,
                              "email",
                              "Win-Back Email",
                              `Send ${member.name.split(" ")[0]} a personalized win-back email with re-engagement offer`,
                              assessment?.riskLevel === "critical" ? "urgent" : "high",
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50"
                        >
                          <Mail className="h-3 w-3" />
                          Win-back
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            createIntervention(
                              member,
                              "discount",
                              "Retention Discount",
                              `Offer ${member.name.split(" ")[0]} a 20% discount for 3 months to prevent cancellation`,
                              assessment?.riskLevel === "critical" ? "urgent" : "high",
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50"
                        >
                          <Gift className="h-3 w-3" />
                          Discount
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            createIntervention(
                              member,
                              "phone_call",
                              "Personal Outreach Call",
                              `Schedule a personal check-in call with ${member.name.split(" ")[0]} to understand concerns`,
                              "high",
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50"
                        >
                          <Phone className="h-3 w-3" />
                          Call
                        </button>
                      </div>
                    </div>
                  </CardHover>
                );
              })}
              {weeklyAtRisk.length === 0 && (
                <p className="col-span-2 text-center text-sm text-peec-text-muted">No at-risk members this week</p>
              )}
            </div>
          </div>
        </StaggerItem>

        {/* Campaign Suggestions */}
        <StaggerItem>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-peec-dark">Campaign Suggestions</h2>
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
              {campaignSuggestions.map((campaign) => {
                const Icon = campaignIcons[campaign.type] ?? Target;
                const colorClass = campaignColors[campaign.type] ?? "bg-stone-50 text-stone-600";
                return (
                  <CardHover key={campaign.id}>
                    <div className="rounded-xl border border-peec-border-light bg-white p-5">
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-peec-dark">{campaign.name}</h3>
                      <p className="mb-3 text-xs leading-relaxed text-peec-text-secondary">
                        {campaign.description}
                      </p>
                      <div className="mb-3 flex items-center gap-3 text-xs text-peec-text-muted">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {campaign.targetCount} targets
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-2xs font-medium text-green-700">
                          {campaign.estimatedImpact}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            // Create interventions for target members in this campaign
                            const campaignType: InterventionType =
                              campaign.type === "win-back" ? "email"
                                : campaign.type === "upsell" ? "discount"
                                  : "email";
                            const targets = weeklyAtRisk.slice(0, 3);
                            for (const target of targets) {
                              createIntervention(
                                target,
                                campaignType,
                                `${campaign.name}: ${target.name.split(" ")[0]}`,
                                campaign.description,
                                "medium",
                              );
                            }
                            toast(`${campaign.name} launched — ${targets.length} interventions queued`);
                          }}
                          className="text-xs font-medium text-peec-dark hover:underline"
                        >
                          Launch
                        </button>
                      </div>
                    </div>
                  </CardHover>
                );
              })}
            </div>
          </div>
        </StaggerItem>

        {/* Intervention History */}
        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <h3 className="mb-1 text-sm font-semibold text-peec-dark">Intervention History</h3>
            <p className="mb-4 text-xs text-peec-text-muted">
              Real-time log of AI-driven and manual interventions
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-peec-border-light bg-stone-50/50">
                    <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Impact
                    </th>
                    <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interventionHistory.map((action) => (
                    <tr
                      key={action.id}
                      className="border-b border-peec-border-light/50 last:border-0"
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-peec-text-muted">
                        {action.timestamp}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-peec-dark">{action.description}</td>
                      <td className="px-4 py-2.5 text-xs text-peec-text-secondary">{action.result}</td>
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-1">
                          {action.status === "success" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : action.status === "pending" ? (
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                          )}
                          <span className="text-2xs capitalize text-peec-text-secondary">
                            {action.status}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </StaggerItem>

        {/* Copilot hint */}
        <StaggerItem>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/30 py-3">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-purple-700">
              Press <kbd className="rounded border border-purple-200 bg-white px-1.5 py-0.5 text-2xs">⌘J</kbd> to open the AI Copilot for deeper analysis
            </span>
          </div>
        </StaggerItem>
      </div>
    </PageEntrance>
  );
}
