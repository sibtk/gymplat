import { generateId } from "@/lib/utils";

import type {
  CopilotInsight,
  Intervention,
  MiddlewareWebhookEvent,
} from "./types";
import type { MemberFull } from "@/lib/types";

// ─── Simulation Engine ────────────────────────────────────────
// Browser-side simulation that generates realistic events to
// make the demo feel alive. Produces webhook events, score
// changes, and auto-executed interventions.

export interface SimulatorConfig {
  speed: number; // 1 = normal, 5 = 5x, 10 = 10x
  onWebhookEvent: (event: MiddlewareWebhookEvent) => void;
  onIntervention: (intervention: Intervention) => void;
  onInsight: (insight: CopilotInsight) => void;
  onScoreChange: (memberId: string, delta: number) => void;
  getMembers: () => MemberFull[];
  getAssessments: () => Record<string, { compositeScore: number; riskLevel: string }>;
}

interface SimulatorState {
  running: boolean;
  timers: ReturnType<typeof setTimeout>[];
  eventCount: number;
}

const EVENT_TYPES: MiddlewareWebhookEvent["type"][] = [
  "check_in",
  "payment_success",
  "payment_failed",
  "class_booked",
  "class_cancelled",
  "membership_change",
];

const EVENT_WEIGHTS = [40, 25, 5, 15, 5, 10]; // probability weights

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i] as number;
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function randomMember(members: MemberFull[]): MemberFull | null {
  if (members.length === 0) return null;
  return members[Math.floor(Math.random() * members.length)] as MemberFull;
}

// ─── Event Generators ─────────────────────────────────────────

function generateWebhookEvent(members: MemberFull[]): MiddlewareWebhookEvent | null {
  const member = randomMember(members);
  if (!member) return null;

  const typeIndex = weightedRandom(EVENT_WEIGHTS);
  const eventType = EVENT_TYPES[typeIndex] as MiddlewareWebhookEvent["type"];
  const now = new Date().toISOString();

  const payloads: Record<MiddlewareWebhookEvent["type"], Record<string, unknown>> = {
    check_in: { location: "Main Floor", method: "card_scan", duration: Math.floor(Math.random() * 120) + 30 },
    payment_success: { amount: Math.floor(Math.random() * 150) + 29, currency: "USD", method: "card" },
    payment_failed: { amount: Math.floor(Math.random() * 150) + 29, reason: "insufficient_funds", retryAt: now },
    class_booked: { className: ["HIIT", "Yoga", "Spin", "CrossFit", "Boxing"][Math.floor(Math.random() * 5)], time: "6:00 PM" },
    class_cancelled: { className: "Yoga", reason: "schedule_conflict" },
    membership_change: { from: "Standard", to: "Premium", effective: now },
  };

  return {
    id: generateId("evt"),
    type: eventType,
    memberId: member.id,
    payload: payloads[eventType],
    receivedAt: now,
    processedAt: now,
  };
}

function generateIntervention(
  members: MemberFull[],
  assessments: Record<string, { compositeScore: number; riskLevel: string }>,
): Intervention | null {
  // Find a high-risk member to generate intervention for
  const atRiskMembers = members.filter((m) => {
    const a = assessments[m.id];
    return a && (a.riskLevel === "high" || a.riskLevel === "critical");
  });

  const member = randomMember(atRiskMembers.length > 0 ? atRiskMembers : members);
  if (!member) return null;

  const types = [
    { type: "email" as const, title: "Send re-engagement email", desc: "Automated re-engagement campaign triggered" },
    { type: "discount" as const, title: "Offer 20% discount", desc: "Retention discount offer generated" },
    { type: "staff_task" as const, title: "Schedule follow-up call", desc: "Staff assigned for personal outreach" },
    { type: "class_recommendation" as const, title: "Recommend group class", desc: "Personalized class suggestion sent" },
  ];

  const chosen = types[Math.floor(Math.random() * types.length)] as (typeof types)[number];

  return {
    id: generateId("intv"),
    memberId: member.id,
    memberName: member.name,
    type: chosen.type,
    title: chosen.title,
    description: `${chosen.desc} for ${member.name}`,
    status: "recommended",
    priority: Math.random() > 0.5 ? "high" : "medium",
    estimatedImpact: `${Math.floor(Math.random() * 20) + 5}% retention improvement`,
    actualOutcome: null,
    createdAt: new Date().toISOString(),
    executedAt: null,
    completedAt: null,
    assignedTo: null,
  };
}

function generateInsight(
  members: MemberFull[],
  assessments: Record<string, { compositeScore: number; riskLevel: string }>,
): CopilotInsight | null {
  const member = randomMember(members);
  if (!member) return null;

  const assessment = assessments[member.id];
  const score = assessment?.compositeScore ?? 0;

  const insightTemplates = [
    {
      type: "risk_alert" as const,
      title: `${member.name}'s risk score increased`,
      description: `Risk score moved to ${score}. Consider immediate outreach.`,
      priority: "high" as const,
      actionLabel: "View Profile",
      actionType: "navigate" as const,
    },
    {
      type: "opportunity" as const,
      title: `Upsell opportunity for ${member.name}`,
      description: `${member.name} has been consistently attending classes. Consider premium plan upgrade.`,
      priority: "medium" as const,
      actionLabel: "Send Offer",
      actionType: "email" as const,
    },
    {
      type: "trend" as const,
      title: "Check-in velocity improving",
      description: "3 previously at-risk members showed increased visit frequency this week.",
      priority: "low" as const,
      actionLabel: null,
      actionType: null,
    },
    {
      type: "milestone" as const,
      title: `${member.name} hit 50 check-ins`,
      description: `Celebrate this milestone with a personalized congratulations message.`,
      priority: "low" as const,
      actionLabel: "Send Message",
      actionType: "email" as const,
    },
  ];

  const template = insightTemplates[Math.floor(Math.random() * insightTemplates.length)] as (typeof insightTemplates)[number];

  return {
    id: generateId("ins"),
    type: template.type,
    title: template.title,
    description: template.description,
    priority: template.priority,
    relatedMemberId: member.id,
    relatedMemberName: member.name,
    actionLabel: template.actionLabel,
    actionType: template.actionType,
    createdAt: new Date().toISOString(),
    dismissed: false,
    page: null,
  };
}

// ─── Simulator Class ──────────────────────────────────────────

export function createSimulator(config: SimulatorConfig) {
  const state: SimulatorState = {
    running: false,
    timers: [],
    eventCount: 0,
  };

  function scheduleNext(fn: () => void, baseMs: number) {
    if (!state.running) return;
    const jitter = baseMs * (0.5 + Math.random());
    const adjusted = jitter / config.speed;
    const timer = setTimeout(() => {
      if (!state.running) return;
      fn();
      scheduleNext(fn, baseMs);
    }, adjusted);
    state.timers.push(timer);
  }

  function emitEvent() {
    const members = config.getMembers();
    const event = generateWebhookEvent(members);
    if (event) {
      config.onWebhookEvent(event);
      state.eventCount++;

      // Certain events affect scores
      if (event.type === "payment_failed") {
        config.onScoreChange(event.memberId, Math.floor(Math.random() * 10) + 5);
      } else if (event.type === "check_in") {
        config.onScoreChange(event.memberId, -(Math.floor(Math.random() * 5) + 1));
      }
    }
  }

  function emitIntervention() {
    const members = config.getMembers();
    const assessments = config.getAssessments();
    const intervention = generateIntervention(members, assessments);
    if (intervention) {
      config.onIntervention(intervention);
    }
  }

  function emitInsight() {
    const members = config.getMembers();
    const assessments = config.getAssessments();
    const insight = generateInsight(members, assessments);
    if (insight) {
      config.onInsight(insight);
    }
  }

  return {
    start() {
      if (state.running) return;
      state.running = true;

      // Events every 8-15s (base)
      scheduleNext(emitEvent, 10000);

      // Interventions every 30s (base)
      scheduleNext(emitIntervention, 30000);

      // Insights every 45s (base)
      scheduleNext(emitInsight, 45000);
    },

    stop() {
      state.running = false;
      for (const timer of state.timers) {
        clearTimeout(timer);
      }
      state.timers = [];
    },

    isRunning() {
      return state.running;
    },

    getEventCount() {
      return state.eventCount;
    },

    // Manual trigger for demo
    triggerEvent() {
      emitEvent();
    },

    triggerTimeLapse(durationMs: number = 30000) {
      // Rapid-fire events to simulate a week of activity
      const burstCount = 20;
      const interval = durationMs / burstCount;

      for (let i = 0; i < burstCount; i++) {
        const timer = setTimeout(() => {
          emitEvent();
          if (i % 3 === 0) emitIntervention();
          if (i % 5 === 0) emitInsight();
        }, interval * i);
        state.timers.push(timer);
      }
    },
  };
}
