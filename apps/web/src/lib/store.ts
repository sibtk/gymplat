"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { generateId } from "@/lib/utils";

import type {
  AutomationConfig,
  CopilotInsight,
  GymHealthScore,
  Intervention,
  MiddlewareWebhookEvent,
  RiskAssessment,
} from "@/lib/retention/types";
import type {
  ActivityEvent,
  Campaign,
  ChatMessage,
  ClassBooking,
  EmailTemplate,
  GymClass,
  GymSettings,
  Invoice,
  Location,
  MemberFull,
  MemberNote,
  MemberStatus,
  MessageRecord,
  PaymentMethod,
  Plan,
  ReportConfig,
  StaffMemberFull,
  Subscription,
  TransactionFull,
} from "@/lib/types";

// ─── Types ──────────────────────────────────────────────────────

export type DateRange = "7d" | "30d" | "90d" | "1y";

export interface Notification {
  id: string;
  type: "alert" | "payment" | "member" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

// ─── Store Interface ────────────────────────────────────────────

interface LedgerStore {
  // ── Hydration ──
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // ── Seeded flag ──
  _seeded: boolean;
  setSeeded: (v: boolean) => void;

  // ── Dashboard ──
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  checkedInCount: number;
  setCheckedInCount: (count: number) => void;
  incrementCheckedIn: (delta: number) => void;

  // ── Members ──
  members: MemberFull[];
  addMember: (member: MemberFull) => void;
  updateMember: (id: string, updates: Partial<MemberFull>) => void;
  removeMember: (id: string) => void;
  memberNotes: Record<string, MemberNote[]>;
  addMemberNote: (note: MemberNote) => void;

  // ── Plans ──
  plans: Plan[];
  addPlan: (plan: Plan) => void;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  removePlan: (id: string) => void;

  // ── Billing ──
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  removeSubscription: (id: string) => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (pm: PaymentMethod) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  removePaymentMethod: (id: string) => void;
  transactions: TransactionFull[];
  addTransaction: (txn: TransactionFull) => void;
  processRefund: (transactionId: string, amount: number, reason: string) => void;

  // ── Classes ──
  classes: GymClass[];
  addClass: (cls: GymClass) => void;
  updateClass: (id: string, updates: Partial<GymClass>) => void;
  removeClass: (id: string) => void;
  classBookings: ClassBooking[];
  addClassBooking: (booking: ClassBooking) => void;
  updateClassBooking: (id: string, updates: Partial<ClassBooking>) => void;
  removeClassBooking: (id: string) => void;

  // ── Communication ──
  emailTemplates: EmailTemplate[];
  addEmailTemplate: (template: EmailTemplate) => void;
  updateEmailTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  removeEmailTemplate: (id: string) => void;
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  messageHistory: MessageRecord[];
  addMessageRecord: (msg: MessageRecord) => void;

  // ── Settings ──
  gymSettings: GymSettings;
  updateGymSettings: (updates: Partial<GymSettings>) => void;
  locations: Location[];
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  removeLocation: (id: string) => void;
  staffMembers: StaffMemberFull[];
  addStaffMember: (staff: StaffMemberFull) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMemberFull>) => void;
  removeStaffMember: (id: string) => void;

  // ── AI Chat ──
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChatMessages: () => void;

  // ── Activity ──
  activityEvents: ActivityEvent[];
  addActivityEvent: (event: ActivityEvent) => void;

  // ── Reports ──
  savedReports: ReportConfig[];
  addSavedReport: (report: ReportConfig) => void;
  updateSavedReport: (id: string, updates: Partial<ReportConfig>) => void;
  removeSavedReport: (id: string) => void;

  // ── Retention Engine ──
  riskAssessments: Record<string, RiskAssessment>;
  setRiskAssessments: (assessments: Record<string, RiskAssessment>) => void;
  updateRiskAssessment: (memberId: string, assessment: RiskAssessment) => void;

  // ── Interventions ──
  interventions: Intervention[];
  addIntervention: (intervention: Intervention) => void;
  updateIntervention: (id: string, updates: Partial<Intervention>) => void;

  // ── Copilot ──
  copilotInsights: CopilotInsight[];
  addCopilotInsight: (insight: CopilotInsight) => void;
  dismissCopilotInsight: (id: string) => void;

  // ── Automation ──
  automationConfig: AutomationConfig;
  updateAutomationConfig: (updates: Partial<AutomationConfig>) => void;

  // ── Gym Health ──
  gymHealthScore: GymHealthScore | null;
  setGymHealthScore: (score: GymHealthScore) => void;

  // ── Simulation ──
  simulationRunning: boolean;
  setSimulationRunning: (running: boolean) => void;
  webhookEvents: MiddlewareWebhookEvent[];
  addWebhookEvent: (event: MiddlewareWebhookEvent) => void;

  // ── Copilot UI ──
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotContext: { page: string; memberId: string | null };
  setCopilotContext: (ctx: { page: string; memberId: string | null }) => void;

  // ── Bulk seed ──
  seedStore: (data: SeedData) => void;
}

export interface SeedData {
  members: MemberFull[];
  plans: Plan[];
  invoices: Invoice[];
  subscriptions: Subscription[];
  paymentMethods: PaymentMethod[];
  transactions: TransactionFull[];
  classes: GymClass[];
  classBookings: ClassBooking[];
  emailTemplates: EmailTemplate[];
  campaigns: Campaign[];
  messageHistory: MessageRecord[];
  locations: Location[];
  staffMembers: StaffMemberFull[];
  gymSettings: GymSettings;
  memberNotes: Record<string, MemberNote[]>;
  chatMessages: ChatMessage[];
  savedReports: ReportConfig[];
  activityEvents: ActivityEvent[];
  notifications: Notification[];
}

// ─── Store Implementation ───────────────────────────────────────

export const useGymStore = create<LedgerStore>()(
  persist(
    (set, get) => ({
      // ── Hydration ──
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      // ── Seeded flag ──
      _seeded: false,
      setSeeded: (v) => set({ _seeded: v }),

      // ── Dashboard ──
      dateRange: "30d",
      setDateRange: (range) => set({ dateRange: range }),
      notifications: [],
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        }),
      unreadCount: 0,
      markAsRead: (id) => {
        const updated = get().notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        );
        set({
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        });
      },
      markAllAsRead: () => {
        const updated = get().notifications.map((n) => ({ ...n, read: true }));
        set({ notifications: updated, unreadCount: 0 });
      },
      checkedInCount: 47,
      setCheckedInCount: (count) => set({ checkedInCount: count }),
      incrementCheckedIn: (delta) =>
        set((state) => ({ checkedInCount: Math.max(0, state.checkedInCount + delta) })),

      // ── Members ──
      members: [],
      addMember: (member) =>
        set((state) => ({ members: [...state.members, member] })),
      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updates } : m,
          ),
        })),
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),
      memberNotes: {},
      addMemberNote: (note) =>
        set((state) => ({
          memberNotes: {
            ...state.memberNotes,
            [note.memberId]: [
              ...(state.memberNotes[note.memberId] ?? []),
              note,
            ],
          },
        })),

      // ── Plans ──
      plans: [],
      addPlan: (plan) =>
        set((state) => ({ plans: [...state.plans, plan] })),
      updatePlan: (id, updates) =>
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),
      removePlan: (id) =>
        set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),

      // ── Billing ──
      invoices: [],
      addInvoice: (invoice) =>
        set((state) => ({ invoices: [...state.invoices, invoice] })),
      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv,
          ),
        })),
      subscriptions: [],
      addSubscription: (sub) =>
        set((state) => ({ subscriptions: [...state.subscriptions, sub] })),
      updateSubscription: (id, updates) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),
      removeSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        })),
      paymentMethods: [],
      addPaymentMethod: (pm) =>
        set((state) => ({ paymentMethods: [...state.paymentMethods, pm] })),
      updatePaymentMethod: (id, updates) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((pm) =>
            pm.id === id ? { ...pm, ...updates } : pm,
          ),
        })),
      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((pm) => pm.id !== id),
        })),
      transactions: [],
      addTransaction: (txn) =>
        set((state) => ({ transactions: [txn, ...state.transactions] })),
      processRefund: (transactionId, amount, reason) => {
        const state = get();
        const original = state.transactions.find((t) => t.id === transactionId);
        if (!original) return;
        const refundTxn: TransactionFull = {
          id: generateId("txn"),
          memberId: original.memberId,
          memberName: original.memberName,
          amount: -amount,
          type: "refund",
          status: "completed",
          method: original.method,
          description: `Refund: ${reason}`,
          invoiceId: original.invoiceId,
          refundReason: reason,
          date: new Date().toISOString(),
        };
        set((s) => ({ transactions: [refundTxn, ...s.transactions] }));
      },

      // ── Classes ──
      classes: [],
      addClass: (cls) =>
        set((state) => ({ classes: [...state.classes, cls] })),
      updateClass: (id, updates) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      removeClass: (id) =>
        set((state) => ({ classes: state.classes.filter((c) => c.id !== id) })),
      classBookings: [],
      addClassBooking: (booking) =>
        set((state) => ({
          classBookings: [...state.classBookings, booking],
          classes: state.classes.map((c) =>
            c.id === booking.classId ? { ...c, enrolled: c.enrolled + 1 } : c,
          ),
        })),
      updateClassBooking: (id, updates) =>
        set((state) => ({
          classBookings: state.classBookings.map((b) =>
            b.id === id ? { ...b, ...updates } : b,
          ),
        })),
      removeClassBooking: (id) => {
        const booking = get().classBookings.find((b) => b.id === id);
        set((state) => ({
          classBookings: state.classBookings.filter((b) => b.id !== id),
          classes: booking
            ? state.classes.map((c) =>
                c.id === booking.classId
                  ? { ...c, enrolled: Math.max(0, c.enrolled - 1) }
                  : c,
              )
            : state.classes,
        }));
      },

      // ── Communication ──
      emailTemplates: [],
      addEmailTemplate: (template) =>
        set((state) => ({ emailTemplates: [...state.emailTemplates, template] })),
      updateEmailTemplate: (id, updates) =>
        set((state) => ({
          emailTemplates: state.emailTemplates.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),
      removeEmailTemplate: (id) =>
        set((state) => ({
          emailTemplates: state.emailTemplates.filter((t) => t.id !== id),
        })),
      campaigns: [],
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),
      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      messageHistory: [],
      addMessageRecord: (msg) =>
        set((state) => ({ messageHistory: [msg, ...state.messageHistory] })),

      // ── Settings ──
      gymSettings: {
        name: "Iron Temple Fitness",
        address: "123 Main Street, New York, NY 10001",
        phone: "(555) 123-4567",
        email: "admin@irontemple.com",
      },
      updateGymSettings: (updates) =>
        set((state) => ({
          gymSettings: { ...state.gymSettings, ...updates },
        })),
      locations: [],
      addLocation: (location) =>
        set((state) => ({ locations: [...state.locations, location] })),
      updateLocation: (id, updates) =>
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === id ? { ...l, ...updates } : l,
          ),
        })),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id),
        })),
      staffMembers: [],
      addStaffMember: (staff) =>
        set((state) => ({ staffMembers: [...state.staffMembers, staff] })),
      updateStaffMember: (id, updates) =>
        set((state) => ({
          staffMembers: state.staffMembers.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),
      removeStaffMember: (id) =>
        set((state) => ({
          staffMembers: state.staffMembers.filter((s) => s.id !== id),
        })),

      // ── AI Chat ──
      chatMessages: [],
      addChatMessage: (msg) =>
        set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
      clearChatMessages: () => set({ chatMessages: [] }),

      // ── Activity ──
      activityEvents: [],
      addActivityEvent: (event) =>
        set((state) => ({
          activityEvents: [event, ...state.activityEvents].slice(0, 100),
        })),

      // ── Reports ──
      savedReports: [],
      addSavedReport: (report) =>
        set((state) => ({ savedReports: [...state.savedReports, report] })),
      updateSavedReport: (id, updates) =>
        set((state) => ({
          savedReports: state.savedReports.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),
      removeSavedReport: (id) =>
        set((state) => ({
          savedReports: state.savedReports.filter((r) => r.id !== id),
        })),

      // ── Retention Engine ──
      riskAssessments: {},
      setRiskAssessments: (assessments) => set({ riskAssessments: assessments }),
      updateRiskAssessment: (memberId, assessment) =>
        set((state) => ({
          riskAssessments: { ...state.riskAssessments, [memberId]: assessment },
        })),

      // ── Interventions ──
      interventions: [],
      addIntervention: (intervention) =>
        set((state) => ({
          interventions: [intervention, ...state.interventions],
        })),
      updateIntervention: (id, updates) =>
        set((state) => ({
          interventions: state.interventions.map((i) =>
            i.id === id ? { ...i, ...updates } : i,
          ),
        })),

      // ── Copilot ──
      copilotInsights: [],
      addCopilotInsight: (insight) =>
        set((state) => ({
          copilotInsights: [insight, ...state.copilotInsights].slice(0, 50),
        })),
      dismissCopilotInsight: (id) =>
        set((state) => ({
          copilotInsights: state.copilotInsights.map((i) =>
            i.id === id ? { ...i, dismissed: true } : i,
          ),
        })),

      // ── Automation ──
      automationConfig: {
        email_sequences: "approval_required",
        discount_offers: "approval_required",
        staff_tasks: "suggestion_only",
        phone_calls: "suggestion_only",
        class_recommendations: "full_auto",
        pt_consultations: "suggestion_only",
      },
      updateAutomationConfig: (updates) =>
        set((state) => ({
          automationConfig: { ...state.automationConfig, ...updates },
        })),

      // ── Gym Health ──
      gymHealthScore: null,
      setGymHealthScore: (score) => set({ gymHealthScore: score }),

      // ── Simulation ──
      simulationRunning: false,
      setSimulationRunning: (running) => set({ simulationRunning: running }),
      webhookEvents: [],
      addWebhookEvent: (event) =>
        set((state) => ({
          webhookEvents: [event, ...state.webhookEvents].slice(0, 100),
        })),

      // ── Copilot UI ──
      copilotOpen: false,
      setCopilotOpen: (open) => set({ copilotOpen: open }),
      copilotContext: { page: "dashboard", memberId: null },
      setCopilotContext: (ctx) => set({ copilotContext: ctx }),

      // ── Bulk seed ──
      seedStore: (data) =>
        set({
          _seeded: true,
          members: data.members,
          plans: data.plans,
          invoices: data.invoices,
          subscriptions: data.subscriptions,
          paymentMethods: data.paymentMethods,
          transactions: data.transactions,
          classes: data.classes,
          classBookings: data.classBookings,
          emailTemplates: data.emailTemplates,
          campaigns: data.campaigns,
          messageHistory: data.messageHistory,
          locations: data.locations,
          staffMembers: data.staffMembers,
          gymSettings: data.gymSettings,
          memberNotes: data.memberNotes,
          chatMessages: data.chatMessages,
          savedReports: data.savedReports,
          activityEvents: data.activityEvents,
          notifications: data.notifications.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            description: n.description,
            timestamp: n.timestamp,
            read: n.read,
          })),
          unreadCount: data.notifications.filter((n) => !n.read).length,
        }),
    }),
    {
      name: "gym-platform-store",
      partialize: (state) => {
        // Exclude ephemeral UI state from persistence
        const {
          _hasHydrated: _hydrated,
          copilotOpen: _copilotOpen,
          simulationRunning: _simRunning,
          copilotContext: _copilotCtx,
          ...rest
        } = state;
        void _hydrated;
        void _copilotOpen;
        void _simRunning;
        void _copilotCtx;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

// ─── Backward compatibility alias ───────────────────────────────

export const useDashboardStore = useGymStore;

// ─── Selector hooks (convenience) ───────────────────────────────

export function useMemberById(id: string | null): MemberFull | undefined {
  return useGymStore((s) => s.members.find((m) => m.id === id));
}

export function useMembersByStatus(status: MemberStatus): MemberFull[] {
  const members = useGymStore((s) => s.members);
  return useMemo(() => members.filter((m) => m.status === status), [members, status]);
}

export function usePlanById(id: string): Plan | undefined {
  return useGymStore((s) => s.plans.find((p) => p.id === id));
}
