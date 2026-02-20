"use client";

import {
  Brain,
  CheckCircle2,
  Clock,
  Gift,
  Mail,
  Phone,
  Target,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import { AiTypingPrompt } from "@/components/dashboard/ai-typing-prompt";
import { CardHover, PageEntrance } from "@/components/dashboard/motion";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useToast } from "@/components/dashboard/toast";
import {
  aiActionsLog,
  aiRecommendations,
  atRiskMembers,
  campaignSuggestions,
} from "@/lib/mock-data";

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

export default function InsightsPage() {
  const weeklyAtRisk = atRiskMembers.slice(0, 4);
  const { toast } = useToast();

  return (
    <PageEntrance>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-peec-dark">AI Insights</h1>
          <p className="text-sm text-peec-text-tertiary">
            AI-powered retention analysis and recommendations
          </p>
        </div>

        {/* AI Chat */}
        <AiTypingPrompt />

        {/* Recommendations */}
        <div>
            <h2 className="mb-3 text-sm font-semibold text-peec-dark">AI Recommendations</h2>
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
              {aiRecommendations.map((rec) => (
                <CardHover key={rec.id}>
                  <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-card">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-peec-dark">{rec.title}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-peec-text-secondary">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-2xs font-medium text-green-700">
                        {rec.impact}
                      </span>
                      <button
                        type="button"
                        onClick={() => toast(`${rec.action} initiated`)}
                        className="rounded-lg bg-peec-dark px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-stone-800"
                      >
                        {rec.action}
                      </button>
                    </div>
                  </div>
                </CardHover>
              ))}
            </div>
        </div>

        {/* At Risk This Week */}
        <div>
            <h2 className="mb-3 text-sm font-semibold text-peec-dark">At Risk This Week</h2>
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
              {weeklyAtRisk.map((member) => (
                <CardHover key={member.id}>
                  <div className="rounded-xl border border-peec-border-light bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-peec-dark">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-peec-dark">{member.name}</p>
                          <p className="text-2xs text-peec-text-muted">
                            {member.plan} &middot; {member.lastVisit}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={member.status} />
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-stone-100">
                        <div
                          className={`h-full rounded-full ${
                            member.riskScore >= 80 ? "bg-red-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${member.riskScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-peec-text-secondary">
                        {member.riskScore}% risk
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {member.riskFactors.map((factor) => (
                        <span
                          key={factor}
                          className="rounded bg-red-50 px-1.5 py-0.5 text-2xs text-red-600"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toast(`Win-back email sent to ${member.name}`)}
                        className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50"
                      >
                        <Mail className="h-3 w-3" />
                        Win-back
                      </button>
                      <button
                        type="button"
                        onClick={() => toast(`Discount offer sent to ${member.name}`)}
                        className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50"
                      >
                        <Gift className="h-3 w-3" />
                        Discount
                      </button>
                      <button
                        type="button"
                        onClick={() => toast(`Call scheduled with ${member.name}`)}
                        className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50"
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </button>
                    </div>
                  </div>
                </CardHover>
              ))}
            </div>
        </div>

        {/* Campaign Suggestions */}
        <div>
            <h2 className="mb-3 text-sm font-semibold text-peec-dark">Campaign Suggestions</h2>
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
              {campaignSuggestions.map((campaign) => {
                const Icon = campaignIcons[campaign.type] ?? Target;
                const colorClass = campaignColors[campaign.type] ?? "bg-stone-50 text-stone-600";
                return (
                  <CardHover key={campaign.id}>
                    <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-card">
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
                          onClick={() => toast(`${campaign.name} campaign launched`)}
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

        {/* AI Actions Log */}
        <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <h3 className="mb-1 text-sm font-semibold text-peec-dark">Recent AI Actions</h3>
            <p className="mb-4 text-xs text-peec-text-muted">Log of automated AI-driven actions</p>
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
                      Result
                    </th>
                    <th className="px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aiActionsLog.map((action) => (
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
      </div>
    </PageEntrance>
  );
}
