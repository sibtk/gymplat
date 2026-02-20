import type { GymHealthScore, RiskAssessment } from "./types";

// ─── Gym Health Score Aggregation ─────────────────────────────

export function computeGymHealth(
  assessments: Record<string, RiskAssessment>,
): GymHealthScore {
  const entries = Object.values(assessments);
  if (entries.length === 0) {
    return {
      overall: 50,
      components: { retention: 50, revenue: 50, engagement: 50, growth: 50 },
      trend: "stable",
      computedAt: new Date().toISOString(),
    };
  }

  // Retention: inverse of average risk score (low risk = high health)
  const avgRisk =
    entries.reduce((sum, a) => sum + a.compositeScore, 0) / entries.length;
  const retention = Math.round(100 - avgRisk);

  // Revenue: based on payment category scores
  const avgPaymentRisk =
    entries.reduce((sum, a) => sum + a.categoryScores.payment, 0) / entries.length;
  const revenue = Math.round(100 - avgPaymentRisk);

  // Engagement: based on engagement category scores
  const avgEngagementRisk =
    entries.reduce((sum, a) => sum + a.categoryScores.engagement, 0) / entries.length;
  const engagement = Math.round(100 - avgEngagementRisk);

  // Growth: based on lifecycle and proportion of low-risk members
  const lowRiskCount = entries.filter((a) => a.riskLevel === "low" || a.riskLevel === "moderate").length;
  const growthRatio = lowRiskCount / entries.length;
  const growth = Math.round(growthRatio * 100);

  // Overall: weighted combination
  const overall = Math.round(
    retention * 0.35 + revenue * 0.25 + engagement * 0.25 + growth * 0.15,
  );

  // Trend: based on previous scores
  const improving = entries.filter(
    (a) => a.previousScore !== null && a.compositeScore < a.previousScore,
  ).length;
  const declining = entries.filter(
    (a) => a.previousScore !== null && a.compositeScore > a.previousScore,
  ).length;

  let trend: "improving" | "stable" | "declining" = "stable";
  if (improving > declining * 1.5) trend = "improving";
  else if (declining > improving * 1.5) trend = "declining";

  return {
    overall,
    components: { retention, revenue, engagement, growth },
    trend,
    computedAt: new Date().toISOString(),
  };
}
