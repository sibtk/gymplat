import { NextResponse } from "next/server";
import { z } from "zod";

import { generateId } from "@/lib/utils";

import type { MiddlewareWebhookEvent } from "@/lib/retention";
import type { NextRequest } from "next/server";

// ─── Zod Schema ────────────────────────────────────────────────

const webhookEventSchema = z.object({
  type: z.enum([
    "check_in",
    "payment_success",
    "payment_failed",
    "class_booked",
    "class_cancelled",
    "membership_change",
  ]),
  memberId: z.string().min(1, "memberId is required"),
  payload: z.record(z.string(), z.unknown()).default({}),
});

// ─── In-memory event log (demo) ───────────────────────────────

const eventLog: MiddlewareWebhookEvent[] = [];

// ─── POST /api/retention/webhook ──────────────────────────────
// Accepts a webhook event, validates it, and returns the
// processed event with a processedAt timestamp.
//
// In a real system this would trigger the retention engine
// to re-compute risk scores for the affected member.

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = webhookEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { type, memberId, payload } = parsed.data;
    const now = new Date().toISOString();

    const event: MiddlewareWebhookEvent = {
      id: generateId("evt"),
      type,
      memberId,
      payload,
      receivedAt: now,
      processedAt: now,
    };

    // Append to event log
    eventLog.push(event);

    // In production, this would:
    // 1. Validate webhook signature (Stripe / internal)
    // 2. Check for duplicate events (idempotency)
    // 3. Re-compute risk assessment for the member
    // 4. Trigger automation rules if thresholds crossed

    return NextResponse.json(
      {
        data: event,
        message: `Event ${event.id} processed successfully`,
        _meta: {
          note: "Demo endpoint — no real processing occurs",
          totalEventsReceived: eventLog.length,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
