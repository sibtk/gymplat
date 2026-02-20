import { NextResponse } from "next/server";

import { computeAllAssessments, computeGymHealth } from "@/lib/retention";
import {
  seedClassBookings,
  seedInvoices,
  seedMembers,
  seedPlans,
  seedSubscriptions,
  seedTransactions,
} from "@/lib/seed-data";

import type { ComputeContext } from "@/lib/retention";

// ─── GET /api/retention/health ─────────────────────────────────
// Returns the aggregate gym health score computed from all
// member risk assessments using seed data.

export function GET() {
  try {
    const context: ComputeContext = {
      now: new Date(),
      allMembers: seedMembers,
      subscriptions: seedSubscriptions,
      invoices: seedInvoices,
      transactions: seedTransactions,
      classBookings: seedClassBookings,
      plans: seedPlans,
    };

    const assessments = computeAllAssessments(context);
    const health = computeGymHealth(assessments);

    // Compute summary statistics for context
    const allAssessments = Object.values(assessments);
    const riskDistribution = {
      critical: allAssessments.filter((a) => a.riskLevel === "critical").length,
      high: allAssessments.filter((a) => a.riskLevel === "high").length,
      elevated: allAssessments.filter((a) => a.riskLevel === "elevated").length,
      moderate: allAssessments.filter((a) => a.riskLevel === "moderate").length,
      low: allAssessments.filter((a) => a.riskLevel === "low").length,
    };

    const avgScore = allAssessments.length > 0
      ? Math.round(
          allAssessments.reduce((sum, a) => sum + a.compositeScore, 0) /
            allAssessments.length,
        )
      : 0;

    return NextResponse.json({
      data: health,
      summary: {
        totalMembers: allAssessments.length,
        averageRiskScore: avgScore,
        riskDistribution,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
