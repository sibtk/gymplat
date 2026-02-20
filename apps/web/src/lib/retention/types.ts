import type { ClassBooking, Invoice, MemberFull, Plan, Subscription, TransactionFull } from "@/lib/types";

// ─── Retention Engine Domain Types ──────────────────────────────

export type SignalCategory = "visit_frequency" | "payment" | "engagement" | "lifecycle";

export type RiskLevel = "low" | "moderate" | "elevated" | "high" | "critical";

export type InterventionType =
  | "email"
  | "discount"
  | "staff_task"
  | "phone_call"
  | "class_recommendation"
  | "pt_consultation";

export type InterventionStatus =
  | "recommended"
  | "approved"
  | "executing"
  | "completed"
  | "dismissed"
  | "failed";

export type InterventionPriority = "low" | "medium" | "high" | "urgent";

export type AutomationLevel =
  | "full_auto"
  | "approval_required"
  | "suggestion_only"
  | "disabled";

// ─── Risk Signals ──────────────────────────────────────────────

export interface RiskSignal {
  id: string;
  category: SignalCategory;
  label: string;
  score: number; // 0-100 (100 = highest risk)
  weight: number; // relative weight within category
  confidence: number; // 0-1
  dataPoints: number;
  trend: "improving" | "stable" | "declining";
  metadata: Record<string, string | number>;
}

// ─── Risk Assessment ───────────────────────────────────────────

export interface ExplanationFactor {
  signal: string;
  description: string;
  impact: number; // percentage contribution to overall score
}

export interface RiskExplanation {
  summary: string; // "Sarah's visits dropped 40% over 3 weeks"
  factors: ExplanationFactor[];
}

export interface InterventionRecommendation {
  type: InterventionType;
  title: string;
  description: string;
  priority: InterventionPriority;
  estimatedImpact: string;
}

export interface RiskAssessment {
  memberId: string;
  computedAt: string;
  compositeScore: number;
  previousScore: number | null;
  confidence: number;
  signals: RiskSignal[];
  categoryScores: Record<SignalCategory, number>;
  explanation: RiskExplanation;
  recommendedInterventions: InterventionRecommendation[];
  riskLevel: RiskLevel;
}

// ─── Interventions ─────────────────────────────────────────────

export interface Intervention {
  id: string;
  memberId: string;
  memberName: string;
  type: InterventionType;
  title: string;
  description: string;
  status: InterventionStatus;
  priority: InterventionPriority;
  estimatedImpact: string;
  actualOutcome: string | null;
  createdAt: string;
  executedAt: string | null;
  completedAt: string | null;
  assignedTo: string | null;
}

// ─── Copilot ───────────────────────────────────────────────────

export interface CopilotInsight {
  id: string;
  type: "risk_alert" | "opportunity" | "trend" | "action_needed" | "milestone";
  title: string;
  description: string;
  priority: InterventionPriority;
  relatedMemberId: string | null;
  relatedMemberName: string | null;
  actionLabel: string | null;
  actionType: InterventionType | "navigate" | "dismiss" | null;
  createdAt: string;
  dismissed: boolean;
  page: string | null; // null = global, "dashboard" = dashboard-only, etc.
}

// ─── Automation ────────────────────────────────────────────────

export interface AutomationConfig {
  email_sequences: AutomationLevel;
  discount_offers: AutomationLevel;
  staff_tasks: AutomationLevel;
  phone_calls: AutomationLevel;
  class_recommendations: AutomationLevel;
  pt_consultations: AutomationLevel;
}

// ─── Gym Health ────────────────────────────────────────────────

export interface GymHealthScore {
  overall: number;
  components: {
    retention: number;
    revenue: number;
    engagement: number;
    growth: number;
  };
  trend: "improving" | "stable" | "declining";
  computedAt: string;
}

// ─── Middleware / Webhook ──────────────────────────────────────

export interface MiddlewareWebhookEvent {
  id: string;
  type:
    | "check_in"
    | "payment_success"
    | "payment_failed"
    | "class_booked"
    | "class_cancelled"
    | "membership_change";
  memberId: string;
  payload: Record<string, unknown>;
  receivedAt: string;
  processedAt: string | null;
}

// ─── Visualization Data ───────────────────────────────────────

export interface MemberFlowNode {
  id: string;
  label: string;
  count: number;
}

export interface MemberFlowLink {
  source: string;
  target: string;
  value: number;
}

export interface MemberFlowData {
  nodes: MemberFlowNode[];
  links: MemberFlowLink[];
}

export interface RiskHeatmapCell {
  day: number;
  hour: number;
  riskScore: number;
  memberCount: number;
}

// ─── Compute Context ──────────────────────────────────────────

export interface ComputeContext {
  now: Date;
  allMembers: MemberFull[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  transactions: TransactionFull[];
  classBookings: ClassBooking[];
  plans: Plan[];
}

export interface SignalComputer {
  id: string;
  category: SignalCategory;
  label: string;
  weight: number;
  compute: (member: MemberFull, context: ComputeContext) => RiskSignal;
}
