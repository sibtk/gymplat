import { NextResponse } from "next/server";
import { z } from "zod";

import { computeAllAssessments } from "@/lib/retention";
import {
  seedClassBookings,
  seedInvoices,
  seedMembers,
  seedPlans,
  seedSubscriptions,
  seedTransactions,
} from "@/lib/seed-data";
import { generateId } from "@/lib/utils";

import type { ComputeContext, Intervention, InterventionStatus } from "@/lib/retention";
import type { NextRequest } from "next/server";

// ─── Zod Schemas ──────────────────────────────────────────────

const createInterventionSchema = z.object({
  memberId: z.string().min(1, "memberId is required"),
  type: z.enum(["email", "discount", "staff_task", "phone_call", "class_recommendation", "pt_consultation"]),
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string().nullable().optional(),
});

const updateInterventionSchema = z.object({
  id: z.string().min(1, "id is required"),
  status: z.enum(["recommended", "approved", "executing", "completed", "dismissed", "failed"]),
  actualOutcome: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
});

// ─── In-memory intervention store (demo) ──────────────────────

const interventionStore: Intervention[] = [];

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

// Generate demo interventions from risk assessments on first call
function ensureSeeded(): void {
  if (interventionStore.length > 0) return;

  const context = buildContext();
  const assessments = computeAllAssessments(context);
  const now = new Date();

  for (const assessment of Object.values(assessments)) {
    const member = seedMembers.find((m) => m.id === assessment.memberId);
    if (!member) continue;

    for (const rec of assessment.recommendedInterventions) {
      interventionStore.push({
        id: generateId("intv"),
        memberId: member.id,
        memberName: member.name,
        type: rec.type,
        title: rec.title,
        description: rec.description,
        status: "recommended",
        priority: rec.priority,
        estimatedImpact: rec.estimatedImpact,
        actualOutcome: null,
        createdAt: now.toISOString(),
        executedAt: null,
        completedAt: null,
        assignedTo: null,
      });
    }
  }
}

// ─── GET /api/retention/interventions ─────────────────────────
// Query params:
//   ?memberId=mem_001    — filter by member
//   ?status=recommended  — filter by status
//   ?priority=urgent     — filter by priority

export function GET(request: NextRequest) {
  try {
    ensureSeeded();

    const { searchParams } = request.nextUrl;
    const memberId = searchParams.get("memberId");
    const statusFilter = searchParams.get("status");
    const priorityFilter = searchParams.get("priority");

    let results = [...interventionStore];

    if (memberId) {
      results = results.filter((i) => i.memberId === memberId);
    }

    if (statusFilter) {
      const validStatuses: InterventionStatus[] = [
        "recommended", "approved", "executing", "completed", "dismissed", "failed",
      ];
      if (!validStatuses.includes(statusFilter as InterventionStatus)) {
        return NextResponse.json(
          { error: "Invalid status filter", validValues: validStatuses },
          { status: 400 },
        );
      }
      results = results.filter((i) => i.status === statusFilter);
    }

    if (priorityFilter) {
      results = results.filter((i) => i.priority === priorityFilter);
    }

    return NextResponse.json({
      data: results,
      total: results.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── POST /api/retention/interventions ────────────────────────
// Create a new intervention

export async function POST(request: NextRequest) {
  try {
    ensureSeeded();

    const body: unknown = await request.json();
    const parsed = createInterventionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { memberId, type, title, description, priority, assignedTo } = parsed.data;

    // Verify member exists
    const member = seedMembers.find((m) => m.id === memberId);
    if (!member) {
      return NextResponse.json(
        { error: "Member not found", memberId },
        { status: 404 },
      );
    }

    const intervention: Intervention = {
      id: generateId("intv"),
      memberId,
      memberName: member.name,
      type,
      title,
      description,
      status: "recommended",
      priority,
      estimatedImpact: "Custom intervention — impact to be measured",
      actualOutcome: null,
      createdAt: new Date().toISOString(),
      executedAt: null,
      completedAt: null,
      assignedTo: assignedTo ?? null,
    };

    interventionStore.push(intervention);

    return NextResponse.json({ data: intervention }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PATCH /api/retention/interventions ───────────────────────
// Update an intervention's status

export async function PATCH(request: NextRequest) {
  try {
    ensureSeeded();

    const body: unknown = await request.json();
    const parsed = updateInterventionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { id, status, actualOutcome, assignedTo } = parsed.data;

    const intervention = interventionStore.find((i) => i.id === id);
    if (!intervention) {
      return NextResponse.json(
        { error: "Intervention not found", id },
        { status: 404 },
      );
    }

    // Valid status transitions
    const validTransitions: Record<InterventionStatus, InterventionStatus[]> = {
      recommended: ["approved", "dismissed"],
      approved: ["executing", "dismissed"],
      executing: ["completed", "failed"],
      completed: [],
      dismissed: [],
      failed: ["recommended"],
    };

    const allowed = validTransitions[intervention.status];
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status transition",
          current: intervention.status,
          requested: status,
          allowed: validTransitions[intervention.status],
        },
        { status: 422 },
      );
    }

    // Apply updates
    intervention.status = status;

    if (status === "executing") {
      intervention.executedAt = new Date().toISOString();
    }
    if (status === "completed") {
      intervention.completedAt = new Date().toISOString();
    }
    if (actualOutcome !== undefined) {
      intervention.actualOutcome = actualOutcome ?? null;
    }
    if (assignedTo !== undefined) {
      intervention.assignedTo = assignedTo ?? null;
    }

    return NextResponse.json({ data: intervention });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
