import { NextResponse } from "next/server";
import { z } from "zod";

import { computeRiskAssessment } from "@/lib/retention";
import {
  seedClassBookings,
  seedInvoices,
  seedPlans,
  seedSubscriptions,
  seedTransactions,
} from "@/lib/seed-data";
import { generateId } from "@/lib/utils";

import type { ComputeContext, RiskAssessment } from "@/lib/retention";
import type { MemberFull } from "@/lib/types";
import type { NextRequest } from "next/server";

// ─── Zod Schema ────────────────────────────────────────────────

const importRequestSchema = z.object({
  csv: z.string().min(1, "CSV data is required"),
  hasHeader: z.boolean().default(true),
});

// ─── CSV Row Parsing ───────────────────────────────────────────

interface ParsedRow {
  name: string;
  email: string;
  phone: string;
  planId: string;
  memberSince: string;
  status: MemberFull["status"];
}

function parseCsvRow(columns: string[]): ParsedRow | null {
  // Expected columns: name, email, phone, planId, memberSince, status
  if (columns.length < 3) return null;

  const name = (columns[0] ?? "").trim();
  const email = (columns[1] ?? "").trim();
  const phone = (columns[2] ?? "").trim();
  const planId = (columns[3] ?? "plan_1").trim();
  const memberSince = (columns[4] ?? new Date().toISOString().split("T")[0] ?? "").trim();
  const rawStatus = (columns[5] ?? "active").trim().toLowerCase();

  if (!name || !email) return null;

  const validStatuses: MemberFull["status"][] = ["active", "at-risk", "paused", "churned", "critical"];
  const status: MemberFull["status"] = validStatuses.includes(rawStatus as MemberFull["status"])
    ? (rawStatus as MemberFull["status"])
    : "active";

  return { name, email, phone, planId, memberSince, status };
}

function buildMemberFromRow(row: ParsedRow): MemberFull {
  const id = generateId("mem");
  const now = new Date();

  // Generate simple check-in history based on status
  const checkInCount =
    row.status === "active" ? 12 :
    row.status === "at-risk" ? 4 :
    row.status === "churned" ? 1 :
    row.status === "critical" ? 2 : 8;

  const checkInHistory: string[] = Array.from({ length: checkInCount }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 3 - 1);
    return d.toISOString();
  });

  return {
    id,
    name: row.name,
    email: row.email,
    phone: row.phone || "(555) 000-0000",
    dateOfBirth: "1990-01-01",
    address: "Unknown",
    emergencyContact: "Not provided",
    avatar: "",
    locationId: "loc_1",
    planId: row.planId,
    subscriptionId: generateId("sub"),
    paymentMethodId: generateId("pm"),
    status: row.status,
    riskScore: 0,
    riskFactors: [],
    lastCheckIn: checkInHistory[0] ?? now.toISOString(),
    memberSince: row.memberSince,
    waiverSigned: true,
    pausedUntil: null,
    cancelledAt: row.status === "churned" ? now.toISOString() : null,
    checkInHistory,
    tags: [],
  };
}

// ─── POST /api/retention/import ────────────────────────────────
// Accepts CSV text in the request body, parses it into member
// objects, runs the retention engine on each, and returns the
// members with their computed risk scores.
//
// Expected CSV format (with or without header):
//   name,email,phone,planId,memberSince,status
//
// Only name and email are required; other fields have defaults.

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = importRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { csv, hasHeader } = parsed.data;

    // Split CSV into lines
    const lines = csv
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return NextResponse.json(
        { error: "CSV contains no data" },
        { status: 400 },
      );
    }

    // Skip header row if present
    const dataLines = hasHeader ? lines.slice(1) : lines;

    if (dataLines.length === 0) {
      return NextResponse.json(
        { error: "CSV contains no data rows (only header)" },
        { status: 400 },
      );
    }

    // Parse rows
    const members: MemberFull[] = [];
    const errors: Array<{ line: number; reason: string }> = [];

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i] as string;
      const columns = line.split(",");
      const row = parseCsvRow(columns);

      if (!row) {
        errors.push({ line: i + (hasHeader ? 2 : 1), reason: "Missing required fields (name, email)" });
        continue;
      }

      members.push(buildMemberFromRow(row));
    }

    if (members.length === 0) {
      return NextResponse.json(
        { error: "No valid rows found in CSV", parseErrors: errors },
        { status: 400 },
      );
    }

    // Build compute context with imported members merged into existing seed data
    const context: ComputeContext = {
      now: new Date(),
      allMembers: members,
      subscriptions: seedSubscriptions,
      invoices: seedInvoices,
      transactions: seedTransactions,
      classBookings: seedClassBookings,
      plans: seedPlans,
    };

    // Compute risk assessments for imported members
    const results: Array<{
      member: MemberFull;
      assessment: RiskAssessment;
    }> = [];

    for (const member of members) {
      const assessment = computeRiskAssessment(member, context);
      // Update member with computed values
      member.riskScore = assessment.compositeScore;
      member.riskFactors = assessment.explanation.factors.map((f) => f.description);
      results.push({ member, assessment });
    }

    return NextResponse.json(
      {
        data: results,
        summary: {
          totalParsed: dataLines.length,
          successCount: members.length,
          errorCount: errors.length,
          parseErrors: errors.length > 0 ? errors : undefined,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
