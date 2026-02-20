import { generateExplanation } from "./explanations";
import { recommendInterventions } from "./interventions";

import type {
  ComputeContext,
  RiskAssessment,
  RiskLevel,
  RiskSignal,
  SignalCategory,
  SignalComputer,
} from "./types";
import type { MemberFull } from "@/lib/types";

// ─── Category Weights ──────────────────────────────────────────

const CATEGORY_WEIGHTS: Record<SignalCategory, number> = {
  visit_frequency: 0.35,
  payment: 0.25,
  engagement: 0.25,
  lifecycle: 0.15,
};

// ─── Utility Helpers ───────────────────────────────────────────

function daysBetween(a: Date, b: Date): number {
  return Math.abs(Math.floor((a.getTime() - b.getTime()) / 86400000));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
}

// ─── Signal Computers ─────────────────────────────────────────

// 1. Visit Frequency Decay — compares last 2 weeks vs prior 2 weeks
const visitFrequencyDecay: SignalComputer = {
  id: "visit_frequency_decay",
  category: "visit_frequency",
  label: "Visit Frequency Trend",
  weight: 0.45,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const now = context.now;
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);
    const fourWeeksAgo = new Date(now.getTime() - 28 * 86400000);

    const dates = member.checkInHistory.map((d) => new Date(d));
    const recent = dates.filter((d) => d >= twoWeeksAgo && d <= now).length;
    const prior = dates.filter((d) => d >= fourWeeksAgo && d < twoWeeksAgo).length;

    let score: number;
    let trend: "improving" | "stable" | "declining";

    if (prior === 0 && recent === 0) {
      score = 75;
      trend = "stable";
    } else if (prior === 0) {
      score = 15;
      trend = "improving";
    } else {
      const ratio = recent / prior;
      if (ratio >= 1.1) {
        score = clamp(20 - (ratio - 1) * 30, 0, 20);
        trend = "improving";
      } else if (ratio >= 0.8) {
        score = clamp(30 + (1 - ratio) * 50, 20, 40);
        trend = "stable";
      } else {
        score = clamp(40 + (1 - ratio) * 80, 40, 100);
        trend = "declining";
      }
    }

    return {
      id: "visit_frequency_decay",
      category: "visit_frequency",
      label: "Visit Frequency Trend",
      score: Math.round(score),
      weight: 0.45,
      confidence: clamp(dates.length / 8, 0.3, 1),
      dataPoints: dates.length,
      trend,
      metadata: { recentVisits: recent, priorVisits: prior },
    };
  },
};

// 2. Days Since Last Visit
const daysSinceLastVisit: SignalComputer = {
  id: "days_since_last_visit",
  category: "visit_frequency",
  label: "Days Since Last Visit",
  weight: 0.35,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const now = context.now;
    const dates = member.checkInHistory.map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    const lastVisit = dates[0];

    if (!lastVisit) {
      return {
        id: "days_since_last_visit",
        category: "visit_frequency",
        label: "Days Since Last Visit",
        score: 90,
        weight: 0.35,
        confidence: 0.3,
        dataPoints: 0,
        trend: "declining",
        metadata: { daysSince: -1 },
      };
    }

    const days = daysBetween(now, lastVisit);
    // PT members expected more frequently
    const plan = context.plans.find((p) => p.id === member.planId);
    const isPT = plan?.type === "premium";
    const threshold = isPT ? 4 : 7;

    let score: number;
    if (days <= threshold) score = 5;
    else if (days <= threshold * 2) score = 30;
    else if (days <= threshold * 3) score = 55;
    else if (days <= threshold * 4) score = 75;
    else score = clamp(75 + (days - threshold * 4) * 2, 75, 100);

    return {
      id: "days_since_last_visit",
      category: "visit_frequency",
      label: "Days Since Last Visit",
      score: Math.round(score),
      weight: 0.35,
      confidence: 0.8,
      dataPoints: 1,
      trend: days > threshold * 2 ? "declining" : "stable",
      metadata: { daysSince: days },
    };
  },
};

// 3. Visit Consistency — std deviation of gaps
const visitConsistency: SignalComputer = {
  id: "visit_consistency",
  category: "visit_frequency",
  label: "Visit Consistency",
  weight: 0.2,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const dates = member.checkInHistory
      .map((d) => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length < 3) {
      return {
        id: "visit_consistency",
        category: "visit_frequency",
        label: "Visit Consistency",
        score: 50,
        weight: 0.2,
        confidence: 0.3,
        dataPoints: dates.length,
        trend: "stable",
        metadata: { stdDev: 0, gaps: 0, contextNow: context.now.toISOString() },
      };
    }

    const gaps: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      gaps.push(daysBetween(dates[i] as Date, dates[i - 1] as Date));
    }

    const stdDev = standardDeviation(gaps);
    // High std dev = inconsistent = higher risk
    const score = clamp(stdDev * 8, 0, 100);

    return {
      id: "visit_consistency",
      category: "visit_frequency",
      label: "Visit Consistency",
      score: Math.round(score),
      weight: 0.2,
      confidence: clamp(gaps.length / 6, 0.3, 1),
      dataPoints: gaps.length,
      trend: stdDev > 5 ? "declining" : "stable",
      metadata: { stdDev: Math.round(stdDev * 10) / 10, gaps: gaps.length },
    };
  },
};

// 4. Payment Failures
const paymentFailures: SignalComputer = {
  id: "payment_failures",
  category: "payment",
  label: "Payment Failures",
  weight: 0.45,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const ninetyDaysAgo = new Date(context.now.getTime() - 90 * 86400000);
    const memberTxns = context.transactions.filter(
      (t) =>
        t.memberId === member.id &&
        t.status === "failed" &&
        new Date(t.date) >= ninetyDaysAgo,
    );

    const count = memberTxns.length;
    const score = count === 0 ? 0 : count === 1 ? 40 : count === 2 ? 70 : 95;

    return {
      id: "payment_failures",
      category: "payment",
      label: "Payment Failures",
      score,
      weight: 0.45,
      confidence: 0.9,
      dataPoints: count,
      trend: count > 0 ? "declining" : "stable",
      metadata: { failedCount: count },
    };
  },
};

// 5. Late Payments (overdue invoices)
const latePayments: SignalComputer = {
  id: "late_payments",
  category: "payment",
  label: "Overdue Invoices",
  weight: 0.35,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const overdue = context.invoices.filter(
      (inv) => inv.memberId === member.id && inv.status === "overdue",
    );

    const count = overdue.length;
    const score = count === 0 ? 0 : count === 1 ? 45 : count === 2 ? 75 : 95;

    return {
      id: "late_payments",
      category: "payment",
      label: "Overdue Invoices",
      score,
      weight: 0.35,
      confidence: 0.9,
      dataPoints: count,
      trend: count > 0 ? "declining" : "stable",
      metadata: { overdueCount: count },
    };
  },
};

// 6. Plan Downgrade Detection
const planDowngrade: SignalComputer = {
  id: "plan_downgrade",
  category: "payment",
  label: "Plan Changes",
  weight: 0.2,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const sub = context.subscriptions.find((s) => s.memberId === member.id);
    const plan = context.plans.find((p) => p.id === member.planId);

    const cancelAtEnd = sub?.cancelAtPeriodEnd ?? false;
    const isPastDue = sub?.status === "past_due";
    const isPaused = sub?.status === "paused";

    let score = 0;
    if (cancelAtEnd) score = 80;
    else if (isPastDue) score = 60;
    else if (isPaused) score = 45;

    return {
      id: "plan_downgrade",
      category: "payment",
      label: "Plan Changes",
      score,
      weight: 0.2,
      confidence: 0.8,
      dataPoints: sub ? 1 : 0,
      trend: score > 0 ? "declining" : "stable",
      metadata: {
        planName: plan?.name ?? "Unknown",
        cancelAtEnd: cancelAtEnd ? 1 : 0,
      },
    };
  },
};

// 7. Class Participation Trend
const classParticipation: SignalComputer = {
  id: "class_participation",
  category: "engagement",
  label: "Class Participation",
  weight: 0.5,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const now = context.now;
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000);

    const bookings = context.classBookings.filter(
      (b) => b.memberId === member.id,
    );
    const recent = bookings.filter((b) => new Date(b.date) >= thirtyDaysAgo).length;
    const prior = bookings.filter(
      (b) => new Date(b.date) >= sixtyDaysAgo && new Date(b.date) < thirtyDaysAgo,
    ).length;

    let score: number;
    let trend: "improving" | "stable" | "declining";

    if (recent === 0 && prior === 0) {
      // No class engagement — moderate risk signal
      score = 45;
      trend = "stable";
    } else if (prior === 0) {
      score = 10;
      trend = "improving";
    } else {
      const ratio = recent / prior;
      if (ratio >= 1) {
        score = 10;
        trend = "improving";
      } else if (ratio >= 0.5) {
        score = 40;
        trend = "stable";
      } else {
        score = 70;
        trend = "declining";
      }
    }

    return {
      id: "class_participation",
      category: "engagement",
      label: "Class Participation",
      score: Math.round(score),
      weight: 0.5,
      confidence: clamp(bookings.length / 4, 0.3, 1),
      dataPoints: bookings.length,
      trend,
      metadata: { recentBookings: recent, priorBookings: prior },
    };
  },
};

// 8. Engagement Diversity
const engagementDiversity: SignalComputer = {
  id: "engagement_diversity",
  category: "engagement",
  label: "Engagement Breadth",
  weight: 0.5,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const hasCheckIns = member.checkInHistory.length > 0;
    const hasBookings = context.classBookings.some((b) => b.memberId === member.id);
    const plan = context.plans.find((p) => p.id === member.planId);
    const hasPT = plan?.type === "premium";

    let diversityCount = 0;
    if (hasCheckIns) diversityCount++;
    if (hasBookings) diversityCount++;
    if (hasPT) diversityCount++;

    // More diverse engagement = lower risk
    const score = diversityCount === 0 ? 80 : diversityCount === 1 ? 50 : diversityCount === 2 ? 25 : 10;

    return {
      id: "engagement_diversity",
      category: "engagement",
      label: "Engagement Breadth",
      score,
      weight: 0.5,
      confidence: 0.7,
      dataPoints: diversityCount,
      trend: "stable",
      metadata: {
        checkIns: hasCheckIns ? 1 : 0,
        classes: hasBookings ? 1 : 0,
        pt: hasPT ? 1 : 0,
      },
    };
  },
};

// 9. Tenure Factor — new members are higher risk
const tenureFactor: SignalComputer = {
  id: "tenure_factor",
  category: "lifecycle",
  label: "Member Tenure",
  weight: 0.5,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const memberSinceDate = new Date(member.memberSince);
    const months = (context.now.getTime() - memberSinceDate.getTime()) / (30 * 86400000);

    let score: number;
    if (months < 1) score = 70;
    else if (months < 3) score = 55;
    else if (months < 6) score = 35;
    else if (months < 12) score = 20;
    else score = 10;

    return {
      id: "tenure_factor",
      category: "lifecycle",
      label: "Member Tenure",
      score: Math.round(score),
      weight: 0.5,
      confidence: 0.9,
      dataPoints: 1,
      trend: "stable",
      metadata: { monthsTenure: Math.round(months * 10) / 10 },
    };
  },
};

// 10. Renewal Proximity
const renewalProximity: SignalComputer = {
  id: "renewal_proximity",
  category: "lifecycle",
  label: "Renewal Proximity",
  weight: 0.5,
  compute: (member: MemberFull, context: ComputeContext): RiskSignal => {
    const sub = context.subscriptions.find((s) => s.memberId === member.id);

    if (!sub) {
      return {
        id: "renewal_proximity",
        category: "lifecycle",
        label: "Renewal Proximity",
        score: 60,
        weight: 0.5,
        confidence: 0.3,
        dataPoints: 0,
        trend: "stable",
        metadata: { daysUntilRenewal: -1 },
      };
    }

    const endDate = new Date(sub.currentPeriodEnd);
    const daysUntil = Math.floor(
      (endDate.getTime() - context.now.getTime()) / 86400000,
    );

    let score: number;
    if (daysUntil > 14) score = 10;
    else if (daysUntil > 7) score = 30;
    else if (daysUntil > 3) score = 50;
    else score = 70;

    // If cancelling at period end, high risk
    if (sub.cancelAtPeriodEnd) score = Math.max(score, 85);

    return {
      id: "renewal_proximity",
      category: "lifecycle",
      label: "Renewal Proximity",
      score: Math.round(score),
      weight: 0.5,
      confidence: 0.8,
      dataPoints: 1,
      trend: daysUntil < 7 ? "declining" : "stable",
      metadata: { daysUntilRenewal: daysUntil },
    };
  },
};

// ─── All Signal Computers ─────────────────────────────────────

export const signalComputers: SignalComputer[] = [
  visitFrequencyDecay,
  daysSinceLastVisit,
  visitConsistency,
  paymentFailures,
  latePayments,
  planDowngrade,
  classParticipation,
  engagementDiversity,
  tenureFactor,
  renewalProximity,
];

// ─── Risk Level Classification ────────────────────────────────

function classifyRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "elevated";
  if (score >= 25) return "moderate";
  return "low";
}

// ─── Core Engine ──────────────────────────────────────────────

export function computeRiskAssessment(
  member: MemberFull,
  context: ComputeContext,
  previousScore?: number | null,
): RiskAssessment {
  // Skip churned members — they're already gone
  if (member.status === "churned") {
    return {
      memberId: member.id,
      computedAt: context.now.toISOString(),
      compositeScore: 95,
      previousScore: previousScore ?? null,
      confidence: 0.95,
      signals: [],
      categoryScores: { visit_frequency: 95, payment: 95, engagement: 95, lifecycle: 95 },
      explanation: { summary: `${member.name} has already churned.`, factors: [] },
      recommendedInterventions: [],
      riskLevel: "critical",
    };
  }

  // Compute all signals
  const signals = signalComputers.map((computer) => computer.compute(member, context));

  // Compute category scores (weighted average within each category)
  const categoryScores: Record<SignalCategory, number> = {
    visit_frequency: 0,
    payment: 0,
    engagement: 0,
    lifecycle: 0,
  };

  const categories: SignalCategory[] = ["visit_frequency", "payment", "engagement", "lifecycle"];

  for (const category of categories) {
    const categorySignals = signals.filter((s) => s.category === category);
    const totalWeight = categorySignals.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight > 0) {
      categoryScores[category] = Math.round(
        categorySignals.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight,
      );
    }
  }

  // Composite score: weighted average of category scores
  const compositeScore = Math.round(
    categories.reduce(
      (sum, cat) => sum + categoryScores[cat] * CATEGORY_WEIGHTS[cat],
      0,
    ),
  );

  // Overall confidence: average signal confidence, floor of 0.3
  const avgConfidence =
    signals.length > 0
      ? signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length
      : 0.3;
  const confidence = Math.max(0.3, Math.round(avgConfidence * 100) / 100);

  const riskLevel = classifyRiskLevel(compositeScore);

  const explanation = generateExplanation(member, signals, compositeScore);
  const recommendedInterventions = recommendInterventions(
    member,
    signals,
    compositeScore,
    riskLevel,
  );

  return {
    memberId: member.id,
    computedAt: context.now.toISOString(),
    compositeScore,
    previousScore: previousScore ?? null,
    confidence,
    signals,
    categoryScores,
    explanation,
    recommendedInterventions,
    riskLevel,
  };
}

// ─── Batch Computation ────────────────────────────────────────

export function computeAllAssessments(
  context: ComputeContext,
  previousAssessments?: Record<string, RiskAssessment>,
): Record<string, RiskAssessment> {
  const results: Record<string, RiskAssessment> = {};

  for (const member of context.allMembers) {
    const previous = previousAssessments?.[member.id];
    results[member.id] = computeRiskAssessment(
      member,
      context,
      previous?.compositeScore ?? null,
    );
  }

  return results;
}
