import { NextResponse } from "next/server";

import { computeAllAssessments, computeRiskAssessment } from "@/lib/retention";
import {
  seedClassBookings,
  seedInvoices,
  seedMembers,
  seedPlans,
  seedSubscriptions,
  seedTransactions,
} from "@/lib/seed-data";

import type { ComputeContext } from "@/lib/retention";
import type { NextRequest } from "next/server";

// ─── Helper: build compute context from seed data ──────────────

function buildContext(): ComputeContext {
  return {
    now: new Date(),
    allMembers: seedMembers,
    subscriptions: seedSubscriptions,
    invoices: seedInvoices,
    transactions: seedTransactions,
    classBookings: seedClassBookings,
    plans: seedPlans,
  };
}

// ─── GET /api/retention/scores ─────────────────────────────────
// Query params:
//   ?memberId=mem_001   — single member assessment
//   ?riskLevel=high     — filter by risk level
//   ?limit=10           — limit results (default: all)
//   (no params)         — all member assessments

export function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const memberId = searchParams.get("memberId");
    const riskLevelFilter = searchParams.get("riskLevel");
    const limitParam = searchParams.get("limit");

    const context = buildContext();

    // Single member lookup
    if (memberId) {
      const member = seedMembers.find((m) => m.id === memberId);
      if (!member) {
        return NextResponse.json(
          { error: "Member not found", memberId },
          { status: 404 },
        );
      }
      const assessment = computeRiskAssessment(member, context);
      return NextResponse.json({ data: assessment });
    }

    // Batch computation
    const assessments = computeAllAssessments(context);
    let results = Object.values(assessments);

    // Filter by risk level
    if (riskLevelFilter) {
      const validLevels = ["low", "moderate", "elevated", "high", "critical"];
      if (!validLevels.includes(riskLevelFilter)) {
        return NextResponse.json(
          {
            error: "Invalid riskLevel filter",
            validValues: validLevels,
          },
          { status: 400 },
        );
      }
      results = results.filter((a) => a.riskLevel === riskLevelFilter);
    }

    // Sort by composite score descending (highest risk first)
    results.sort((a, b) => b.compositeScore - a.compositeScore);

    // Limit
    const limit = limitParam ? parseInt(limitParam, 10) : null;
    if (limit !== null && !Number.isNaN(limit) && limit > 0) {
      results = results.slice(0, limit);
    }

    return NextResponse.json({
      data: results,
      total: results.length,
      computedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
