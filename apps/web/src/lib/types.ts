// Re-export key retention types for convenience
export type {
  RiskAssessment,
  RiskLevel,
  Intervention,
  CopilotInsight,
  GymHealthScore,
  AutomationConfig,
  InterventionType,
  InterventionStatus,
  InterventionPriority,
  AutomationLevel,
  SignalCategory,
} from "@/lib/retention/types";

// ─── Core Types ─────────────────────────────────────────────────

export type MemberStatus = "active" | "at-risk" | "paused" | "churned" | "critical";
export type BillingCycle = "monthly" | "annual";
export type PaymentMethodType = "card" | "bank" | "wallet";
export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";
export type InvoiceStatus = "paid" | "pending" | "overdue" | "void" | "refunded";
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "past_due" | "trialing";
export type ClassType = "strength" | "cardio" | "yoga" | "hiit" | "pilates" | "boxing" | "crossfit" | "spin";
export type BookingStatus = "confirmed" | "cancelled" | "attended" | "no-show";
export type CampaignStatus = "draft" | "scheduled" | "sent";
export type MessageStatus = "sent" | "delivered" | "opened" | "bounced";
export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// ─── Member ─────────────────────────────────────────────────────

export interface MemberFull {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  avatar: string;
  locationId: string;
  planId: string;
  subscriptionId: string;
  paymentMethodId: string;
  status: MemberStatus;
  riskScore: number;
  riskFactors: string[];
  lastCheckIn: string;
  memberSince: string;
  waiverSigned: boolean;
  pausedUntil: string | null;
  cancelledAt: string | null;
  checkInHistory: string[];
  tags: string[];
}

export interface MemberNote {
  id: string;
  memberId: string;
  content: string;
  type: "general" | "billing" | "health" | "complaint" | "follow-up";
  createdAt: string;
  author: string;
}

// ─── Plan ───────────────────────────────────────────────────────

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  type: "base" | "standard" | "premium" | "discount" | "b2b";
  memberCount: number;
}

// ─── Invoice ────────────────────────────────────────────────────

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
}

// ─── Subscription ───────────────────────────────────────────────

export interface Subscription {
  id: string;
  memberId: string;
  memberName: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  amount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

// ─── Payment Method ─────────────────────────────────────────────

export interface PaymentMethod {
  id: string;
  memberId: string;
  memberName: string;
  type: PaymentMethodType;
  last4: string;
  brand: CardBrand;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

// ─── Transaction ────────────────────────────────────────────────

export interface TransactionFull {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: "subscription" | "one-time" | "refund";
  status: "completed" | "pending" | "failed";
  method: PaymentMethodType;
  description: string;
  invoiceId: string | null;
  refundReason: string | null;
  date: string;
}

// ─── Class ──────────────────────────────────────────────────────

export interface GymClass {
  id: string;
  name: string;
  type: ClassType;
  trainerId: string;
  trainerName: string;
  locationId: string;
  locationName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  capacity: number;
  enrolled: number;
  color: string;
  description: string;
}

export interface ClassBooking {
  id: string;
  classId: string;
  className: string;
  memberId: string;
  memberName: string;
  date: string;
  status: BookingStatus;
}

// ─── Communication ──────────────────────────────────────────────

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "welcome" | "win-back" | "payment-reminder" | "class-reminder" | "milestone" | "birthday" | "general";
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  segment: string;
  status: CampaignStatus;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface MessageRecord {
  id: string;
  memberId: string;
  memberName: string;
  channel: "email" | "sms" | "push";
  subject: string;
  status: MessageStatus;
  sentAt: string;
  openedAt: string | null;
}

// ─── Location ───────────────────────────────────────────────────

export interface Location {
  id: string;
  name: string;
  address: string;
  timezone: string;
  memberCount: number;
  capacity: number;
}

// ─── Settings ───────────────────────────────────────────────────

export interface GymSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface StaffMemberFull {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "trainer" | "front-desk";
  avatar: string;
  joinedAt: string;
}

// ─── Report ─────────────────────────────────────────────────────

export interface ReportConfig {
  id: string;
  name: string;
  metrics: string[];
  dateRange: { start: string; end: string };
  groupBy: "day" | "week" | "month";
  filters: Record<string, string>;
  createdAt: string;
}

// ─── AI Chat ────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ─── Activity ───────────────────────────────────────────────────

export interface ActivityEvent {
  id: string;
  type: "check-in" | "signup" | "cancellation" | "payment" | "alert" | "note" | "update";
  description: string;
  timestamp: string;
  member: string;
}
