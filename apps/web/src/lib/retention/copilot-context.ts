import type {
  GymHealthScore,
  Intervention,
  RiskAssessment,
} from "./types";
import type { MemberFull } from "@/lib/types";

// ─── Copilot Context Builder ─────────────────────────────────
// Builds rich context strings for AI chat and spotlight prompts,
// incorporating retention engine data, current page, and member focus.

interface CopilotContextInput {
  page: string;
  memberId: string | null;
  members: MemberFull[];
  riskAssessments: Record<string, RiskAssessment>;
  interventions: Intervention[];
  gymHealthScore: GymHealthScore | null;
  plans: { id: string; name: string; priceMonthly: number; memberCount: number }[];
  transactions: { amount: number; type: string; status: string }[];
}

export function buildCopilotContext(input: CopilotContextInput): string {
  const {
    page,
    memberId,
    members,
    riskAssessments,
    interventions,
    gymHealthScore,
    plans,
    transactions,
  } = input;

  const sections: string[] = [];

  // ── Current View Context ──
  sections.push(`Current View: ${page}`);

  // ── Gym Health Score ──
  if (gymHealthScore) {
    sections.push(
      `Gym Health Score: ${gymHealthScore.overall}/100 (trend: ${gymHealthScore.trend})` +
        `\n  Retention: ${gymHealthScore.components.retention}, Revenue: ${gymHealthScore.components.revenue}, ` +
        `Engagement: ${gymHealthScore.components.engagement}, Growth: ${gymHealthScore.components.growth}`,
    );
  }

  // ── Member Summary ──
  const total = members.length;
  const active = members.filter((m) => m.status === "active").length;
  const atRisk = members.filter(
    (m) => m.status === "at-risk" || m.status === "critical",
  ).length;
  const paused = members.filter((m) => m.status === "paused").length;
  const churned = members.filter((m) => m.status === "churned").length;

  sections.push(
    `Members: ${total} total (Active: ${active}, At-Risk: ${atRisk}, Paused: ${paused}, Churned: ${churned})`,
  );

  // ── Revenue ──
  const completedRevenue = transactions
    .filter((t) => t.type !== "refund" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  sections.push(`Monthly Revenue: $${completedRevenue.toLocaleString()}`);

  // ── Plans ──
  const planSummary = plans
    .map((p) => `${p.name}: ${p.memberCount} members, $${p.priceMonthly}/mo`)
    .join("\n  ");
  if (planSummary) {
    sections.push(`Plans:\n  ${planSummary}`);
  }

  // ── Risk Assessment Summary ──
  const assessments = Object.values(riskAssessments);
  const criticalMembers = assessments.filter((a) => a.riskLevel === "critical");
  const highRiskMembers = assessments.filter((a) => a.riskLevel === "high");
  const elevatedMembers = assessments.filter((a) => a.riskLevel === "elevated");

  sections.push(
    `Risk Distribution: ${criticalMembers.length} critical, ${highRiskMembers.length} high, ${elevatedMembers.length} elevated`,
  );

  // ── Top At-Risk Members ──
  const topRisk = assessments
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 5);

  if (topRisk.length > 0) {
    const riskDetails = topRisk
      .map((a) => {
        const member = members.find((m) => m.id === a.memberId);
        if (!member) return null;
        return `${member.name} (score: ${a.compositeScore}, level: ${a.riskLevel}): ${a.explanation.summary}`;
      })
      .filter(Boolean)
      .join("\n  ");
    sections.push(`Top At-Risk Members:\n  ${riskDetails}`);
  }

  // ── Pending Interventions ──
  const pendingInterventions = interventions.filter(
    (i) => i.status === "recommended" || i.status === "approved",
  );
  if (pendingInterventions.length > 0) {
    const interventionDetails = pendingInterventions
      .slice(0, 5)
      .map(
        (i) =>
          `[${i.priority}] ${i.title} for ${i.memberName} (${i.type}, status: ${i.status})`,
      )
      .join("\n  ");
    sections.push(
      `Pending Interventions (${pendingInterventions.length} total):\n  ${interventionDetails}`,
    );
  }

  // ── Focused Member Context ──
  if (memberId) {
    const member = members.find((m) => m.id === memberId);
    const assessment = riskAssessments[memberId];
    if (member) {
      const plan = plans.find((p) => p.id === member.planId);
      const memberInterventions = interventions.filter(
        (i) => i.memberId === memberId,
      );

      let memberContext = `\nFocused Member: ${member.name}`;
      memberContext += `\n  Email: ${member.email}, Status: ${member.status}`;
      memberContext += `\n  Plan: ${plan?.name ?? "Unknown"}, Member Since: ${member.memberSince}`;
      memberContext += `\n  Check-ins: ${member.checkInHistory.length} total`;

      if (assessment) {
        memberContext += `\n  Risk Score: ${assessment.compositeScore}/100 (${assessment.riskLevel})`;
        memberContext += `\n  Risk Summary: ${assessment.explanation.summary}`;
        memberContext += `\n  Category Scores: Visit=${assessment.categoryScores.visit_frequency}, Payment=${assessment.categoryScores.payment}, Engagement=${assessment.categoryScores.engagement}, Lifecycle=${assessment.categoryScores.lifecycle}`;

        if (assessment.recommendedInterventions.length > 0) {
          const recs = assessment.recommendedInterventions
            .map((r) => `${r.title} (${r.priority}, impact: ${r.estimatedImpact})`)
            .join("; ");
          memberContext += `\n  Recommended Actions: ${recs}`;
        }
      }

      if (memberInterventions.length > 0) {
        const hist = memberInterventions
          .slice(0, 3)
          .map((i) => `${i.title} (${i.status})`)
          .join("; ");
        memberContext += `\n  Intervention History: ${hist}`;
      }

      sections.push(memberContext);
    }
  }

  return sections.join("\n\n");
}
