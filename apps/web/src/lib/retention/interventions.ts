import type {
  InterventionRecommendation,
  RiskLevel,
  RiskSignal,
} from "./types";
import type { MemberFull } from "@/lib/types";

// ─── Intervention Recommender ─────────────────────────────────

export function recommendInterventions(
  member: MemberFull,
  signals: RiskSignal[],
  compositeScore: number,
  riskLevel: RiskLevel,
): InterventionRecommendation[] {
  const recommendations: InterventionRecommendation[] = [];
  const firstName = member.name.split(" ")[0] ?? member.name;

  // Helper to check signal scores
  const getSignalScore = (id: string): number =>
    signals.find((s) => s.id === id)?.score ?? 0;

  const hasPaymentIssues =
    getSignalScore("payment_failures") > 30 || getSignalScore("late_payments") > 30;
  const hasVisitDecay = getSignalScore("visit_frequency_decay") > 40;
  const hasLowEngagement = getSignalScore("class_participation") > 40;
  const isNewMember = getSignalScore("tenure_factor") > 40;
  const hasRenewalSoon = getSignalScore("renewal_proximity") > 40;

  // Critical risk (80+): urgent interventions
  if (compositeScore >= 80) {
    if (hasPaymentIssues) {
      recommendations.push({
        type: "email",
        title: "Payment Recovery Email",
        description: `Send ${firstName} a payment reminder with updated payment link`,
        priority: "urgent",
        estimatedImpact: "Resolve payment and retain membership",
      });
      recommendations.push({
        type: "discount",
        title: "Retention Offer",
        description: `Offer ${firstName} a 20% discount for 3 months to prevent cancellation`,
        priority: "urgent",
        estimatedImpact: `Save ~$${Math.round((member.riskScore / 100) * 50)}/mo in recurring revenue`,
      });
    }
    recommendations.push({
      type: "phone_call",
      title: "Personal Outreach Call",
      description: `Manager should call ${firstName} to understand concerns and offer solutions`,
      priority: "urgent",
      estimatedImpact: "Direct engagement reduces churn by up to 35%",
    });
  }

  // High risk (65-79): proactive engagement
  if (riskLevel === "high" || (compositeScore >= 60 && compositeScore < 80)) {
    if (hasVisitDecay) {
      recommendations.push({
        type: "class_recommendation",
        title: "Personalized Class Suggestions",
        description: `Send ${firstName} curated class recommendations based on past preferences`,
        priority: "high",
        estimatedImpact: "+40% likelihood of visit within 7 days",
      });
    }
    if (hasLowEngagement) {
      recommendations.push({
        type: "staff_task",
        title: "Staff Follow-Up",
        description: `Assign trainer to check in with ${firstName} during next visit`,
        priority: "high",
        estimatedImpact: "Personal attention increases retention by 25%",
      });
    }
  }

  // Elevated risk (45-64): early warning
  if (riskLevel === "elevated" || (compositeScore >= 40 && compositeScore < 65)) {
    if (hasVisitDecay || hasLowEngagement) {
      recommendations.push({
        type: "email",
        title: "Re-Engagement Email",
        description: `Send ${firstName} a personalized check-in email with workout tips`,
        priority: "medium",
        estimatedImpact: "15% re-engagement rate for this segment",
      });
    }
    if (isNewMember) {
      recommendations.push({
        type: "pt_consultation",
        title: "Free PT Consultation",
        description: `Offer ${firstName} a complimentary PT session to build commitment`,
        priority: "medium",
        estimatedImpact: "New members with PT are 3x more likely to stay",
      });
    }
  }

  // Moderate risk (25-44): monitor with light touch
  if (riskLevel === "moderate" && recommendations.length === 0) {
    if (hasRenewalSoon) {
      recommendations.push({
        type: "email",
        title: "Renewal Reminder",
        description: `Send ${firstName} a friendly renewal reminder with benefit highlights`,
        priority: "low",
        estimatedImpact: "Proactive reminder reduces lapse by 20%",
      });
    }
  }

  // Low risk — milestone opportunity
  if (riskLevel === "low" && compositeScore < 20) {
    const months = signals.find((s) => s.id === "tenure_factor")?.metadata["monthsTenure"] as number | undefined;
    if (months && months >= 11 && months <= 13) {
      recommendations.push({
        type: "email",
        title: "Anniversary Celebration",
        description: `Celebrate ${firstName}'s 1-year anniversary with a special offer`,
        priority: "low",
        estimatedImpact: "Reinforces loyalty and encourages referrals",
      });
    }
  }

  return recommendations;
}
