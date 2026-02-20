"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  CreditCard,
  Edit3,
  Mail,
  Pause,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { CopilotCard } from "@/components/dashboard/copilot-card";
import { EditMemberForm } from "@/components/dashboard/edit-member-form";
import { ScoreBreakdownCard } from "@/components/dashboard/score-breakdown-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useToast } from "@/components/dashboard/toast";
import { useCopilotInsights } from "@/hooks/use-copilot-insights";
import { useGymStore, useMemberById } from "@/lib/store";
import { formatCurrency, formatDate, generateId } from "@/lib/utils";

import type { MemberNote } from "@/lib/types";

// ─── Types ──────────────────────────────────────────────────────

type DrawerTab = "overview" | "risk" | "billing" | "checkins" | "notes";

interface MemberDetailDrawerProps {
  memberId: string | null;
  open: boolean;
  onClose: () => void;
}

// ─── Drawer ─────────────────────────────────────────────────────

export function MemberDetailDrawer({ memberId, open, onClose }: MemberDetailDrawerProps) {
  const member = useMemberById(memberId);
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { toast } = useToast();
  const updateMember = useGymStore((s) => s.updateMember);
  const addActivityEvent = useGymStore((s) => s.addActivityEvent);

  // Reset tab when drawer opens with new member
  useEffect(() => {
    if (open) setActiveTab("overview");
  }, [open, memberId]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !editOpen && !pauseOpen && !cancelOpen) onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
    return undefined;
  }, [open, onClose, editOpen, pauseOpen, cancelOpen]);

  const handlePause = () => {
    if (!member) return;
    const pauseDate = new Date(Date.now() + 30 * 86400000).toISOString();
    updateMember(member.id, { status: "paused", pausedUntil: pauseDate });
    addActivityEvent({
      id: generateId("evt"),
      type: "update",
      description: "membership paused for 30 days",
      timestamp: new Date().toISOString(),
      member: member.name,
    });
    toast(`${member.name}'s membership paused`);
  };

  const handleCancel = () => {
    if (!member) return;
    updateMember(member.id, { status: "churned", cancelledAt: new Date().toISOString() });
    addActivityEvent({
      id: generateId("evt"),
      type: "cancellation",
      description: `cancelled membership${cancelReason ? `: ${cancelReason}` : ""}`,
      timestamp: new Date().toISOString(),
      member: member.name,
    });
    toast(`${member.name}'s membership cancelled`);
    setCancelReason("");
  };

  const handleSendEmail = () => {
    if (!member) return;
    toast(`Email sent to ${member.name}`);
  };

  const tabs: { key: DrawerTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "risk", label: "Risk" },
    { key: "billing", label: "Billing" },
    { key: "checkins", label: "Check-ins" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <AnimatePresence>
      {open && member && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-xl tablet:w-[480px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="border-b border-peec-border-light p-6">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-lg font-semibold text-peec-dark">
                  {member.avatar}
                </div>
                <div>
                  <h2 className="text-base font-bold text-peec-dark">{member.name}</h2>
                  <p className="text-xs text-peec-text-muted">{member.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={member.status} />
                    {member.pausedUntil && (
                      <span className="text-2xs text-peec-text-muted">
                        Until {formatDate(member.pausedUntil)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-4 flex gap-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeTab === t.key
                        ? "bg-peec-dark text-white"
                        : "text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "overview" && <OverviewTab member={member} />}
              {activeTab === "risk" && <RiskTab memberId={member.id} memberName={member.name} />}
              {activeTab === "billing" && <BillingTab memberId={member.id} />}
              {activeTab === "checkins" && <CheckinsTab member={member} />}
              {activeTab === "notes" && <NotesTab memberId={member.id} />}
            </div>

            {/* Actions */}
            <div className="border-t border-peec-border-light p-4">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-3 py-1.5 text-xs font-medium text-peec-dark hover:bg-stone-50">
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
                {member.status !== "paused" && member.status !== "churned" && (
                  <button type="button" onClick={() => setPauseOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50">
                    <Pause className="h-3 w-3" /> Pause
                  </button>
                )}
                {member.status !== "churned" && (
                  <button type="button" onClick={() => setCancelOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    <Ban className="h-3 w-3" /> Cancel
                  </button>
                )}
                <button type="button" onClick={handleSendEmail} className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800">
                  <Mail className="h-3 w-3" /> Send Email
                </button>
              </div>
            </div>

            {/* Dialogs */}
            <EditMemberForm member={member} open={editOpen} onClose={() => setEditOpen(false)} />
            <ConfirmDialog
              open={pauseOpen}
              onClose={() => setPauseOpen(false)}
              onConfirm={handlePause}
              title="Pause Membership"
              description={`Pause ${member.name}'s membership for 30 days? They will not be billed during this period.`}
              confirmLabel="Pause Membership"
            />
            <ConfirmDialog
              open={cancelOpen}
              onClose={() => setCancelOpen(false)}
              onConfirm={handleCancel}
              title="Cancel Membership"
              description={`This will cancel ${member.name}'s membership. This action cannot be undone.`}
              confirmLabel="Cancel Membership"
              destructive
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Reason (optional)</label>
                <input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark"
                  placeholder="e.g., Moving to another city"
                />
              </div>
            </ConfirmDialog>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Overview Tab ───────────────────────────────────────────────

function OverviewTab({ member }: { member: NonNullable<ReturnType<typeof useMemberById>> }) {
  const plans = useGymStore((s) => s.plans);
  const locations = useGymStore((s) => s.locations);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const plan = plans.find((p) => p.id === member.planId);
  const location = locations.find((l) => l.id === member.locationId);
  const assessment = riskAssessments[member.id];
  const memberInsights = useCopilotInsights("members", member.id);

  // Visit frequency mini chart — compute from all check-in history
  const weeklyVisits = [0, 0, 0, 0];
  const now = Date.now();
  for (const ci of member.checkInHistory) {
    const daysAgo = Math.floor((now - new Date(ci).getTime()) / 86400000);
    const week = Math.min(3, Math.floor(daysAgo / 7));
    if (week >= 0 && week <= 3) {
      weeklyVisits[3 - week] = (weeklyVisits[3 - week] ?? 0) + 1;
    }
  }
  const maxVisit = Math.max(...weeklyVisits, 1);

  const lastCheckInLabel = member.checkInHistory.length > 0
    ? (() => {
        const days = Math.floor((now - new Date(member.checkInHistory[0] as string).getTime()) / 86400000);
        return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
      })()
    : "Never";

  return (
    <div className="space-y-5">
      {/* Inline copilot suggestion */}
      {memberInsights.length > 0 && (
        <div>
          {memberInsights.slice(0, 1).map((insight) => (
            <CopilotCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Visit Frequency */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
          Visit Frequency (Last 4 Weeks)
        </h3>
        <div className="flex items-end gap-3">
          {weeklyVisits.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t bg-peec-dark"
                initial={{ height: 0 }}
                animate={{ height: `${(v / maxVisit) * 80}px` }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              />
              <span className="text-2xs text-peec-text-muted">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Summary from engine */}
      {assessment && assessment.riskLevel !== "low" && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
            Risk Summary
          </h3>
          <p className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
            {assessment.explanation.summary}
          </p>
        </div>
      )}

      {/* Membership Details */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
          Membership Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <DetailCard label="Plan" value={plan?.name ?? "Unknown"} />
          <DetailCard label="Location" value={location?.name ?? "Unknown"} />
          <DetailCard label="Member Since" value={member.memberSince} />
          <DetailCard label="Last Check-in" value={lastCheckInLabel} />
          <DetailCard label="Phone" value={member.phone} />
          <DetailCard label="Risk Score" value={`${assessment?.compositeScore ?? member.riskScore}`} />
        </div>
      </div>

      {/* Tags */}
      {member.tags.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {member.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-2xs text-peec-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Risk Tab ──────────────────────────────────────────────────

function RiskTab({ memberId, memberName }: { memberId: string; memberName: string }) {
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const interventions = useGymStore((s) => s.interventions);
  const assessment = riskAssessments[memberId];

  const memberInterventions = interventions.filter(
    (i) => i.memberId === memberId,
  );

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-peec-text-muted">No risk assessment available</p>
        <p className="text-2xs text-peec-text-muted">Engine is computing scores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Score Breakdown */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
          Risk Assessment
        </h3>
        <ScoreBreakdownCard assessment={assessment} />
      </div>

      {/* Recommended Interventions */}
      {assessment.recommendedInterventions.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
            Recommended Actions
          </h3>
          <div className="space-y-2">
            {assessment.recommendedInterventions.map((rec, i) => (
              <div key={i} className="rounded-lg border border-peec-border-light p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-peec-dark">{rec.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
                    rec.priority === "urgent" ? "bg-red-100 text-red-700" :
                    rec.priority === "high" ? "bg-orange-100 text-orange-700" :
                    rec.priority === "medium" ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="mt-1 text-2xs text-peec-text-muted">{rec.description}</p>
                <p className="mt-1 text-2xs text-green-600">Impact: {rec.estimatedImpact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intervention History */}
      {memberInterventions.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
            Intervention History
          </h3>
          <div className="space-y-2">
            {memberInterventions.map((int) => (
              <div key={int.id} className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-3">
                <div>
                  <p className="text-xs font-medium text-peec-dark">{int.title}</p>
                  <p className="text-2xs text-peec-text-muted">{formatDate(int.createdAt)}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-2xs font-medium capitalize ${
                  int.status === "completed" ? "bg-green-50 text-green-700" :
                  int.status === "dismissed" ? "bg-stone-100 text-stone-600" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {int.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {memberInterventions.length === 0 && assessment.recommendedInterventions.length === 0 && (
        <p className="text-center text-xs text-peec-text-muted">
          {memberName} is in good standing — no interventions needed
        </p>
      )}
    </div>
  );
}

// ─── Billing Tab ────────────────────────────────────────────────

function BillingTab({ memberId }: { memberId: string }) {
  const subscription = useGymStore((s) => s.subscriptions.find((sub) => sub.memberId === memberId));
  const paymentMethod = useGymStore((s) => s.paymentMethods.find((pm) => pm.memberId === memberId && pm.isDefault));
  const allInvoices = useGymStore((s) => s.invoices);
  const invoices = useMemo(
    () => allInvoices.filter((inv) => inv.memberId === memberId).slice(0, 5),
    [allInvoices, memberId],
  );

  return (
    <div className="space-y-5">
      {/* Current Subscription */}
      {subscription && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
            Current Subscription
          </h3>
          <div className="rounded-lg border border-peec-border-light p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-peec-dark">{subscription.planName}</span>
              <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
                subscription.status === "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {subscription.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-peec-text-secondary">
              {formatCurrency(subscription.amount)}/{subscription.billingCycle === "monthly" ? "mo" : "yr"}
            </p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
            Payment Method
          </h3>
          <div className="flex items-center gap-3 rounded-lg border border-peec-border-light p-3">
            <CreditCard className="h-5 w-5 text-peec-text-muted" />
            <div>
              <p className="text-xs font-medium capitalize text-peec-dark">
                {paymentMethod.brand} ending in {paymentMethod.last4}
              </p>
              <p className="text-2xs text-peec-text-muted">
                Expires {String(paymentMethod.expMonth).padStart(2, "0")}/{paymentMethod.expYear}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
          Recent Invoices
        </h3>
        {invoices.length === 0 ? (
          <p className="text-xs text-peec-text-muted">No invoices found</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-3">
                <div>
                  <p className="text-xs font-medium text-peec-dark">{formatCurrency(inv.total)}</p>
                  <p className="text-2xs text-peec-text-muted">{formatDate(inv.issuedAt)}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
                  inv.status === "paid"
                    ? "bg-green-50 text-green-700"
                    : inv.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                }`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Check-ins Tab ──────────────────────────────────────────────

function CheckinsTab({ member }: { member: NonNullable<ReturnType<typeof useMemberById>> }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
        Check-in History
      </h3>
      {member.checkInHistory.length === 0 ? (
        <p className="text-xs text-peec-text-muted">No check-ins recorded</p>
      ) : (
        <div className="space-y-2">
          {member.checkInHistory.slice(0, 20).map((ci, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-3">
              <span className="text-xs text-peec-dark">{formatDate(ci)}</span>
              <span className="text-2xs text-peec-text-muted">
                {new Date(ci).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Notes Tab ──────────────────────────────────────────────────

function NotesTab({ memberId }: { memberId: string }) {
  const notes = useGymStore((s) => s.memberNotes[memberId] ?? []);
  const addMemberNote = useGymStore((s) => s.addMemberNote);
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState<MemberNote["type"]>("general");

  const handleAdd = () => {
    if (!content.trim()) return;
    addMemberNote({
      id: generateId("note"),
      memberId,
      content: content.trim(),
      type: noteType,
      createdAt: new Date().toISOString(),
      author: "You",
    });
    setContent("");
    toast("Note added");
  };

  const noteTypes: MemberNote["type"][] = ["general", "billing", "health", "complaint", "follow-up"];

  return (
    <div className="space-y-4">
      {/* Add Note */}
      <div className="rounded-lg border border-peec-border-light p-3">
        <div className="mb-2 flex items-center gap-2">
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value as MemberNote["type"])}
            className="rounded border border-peec-border-light px-2 py-1 text-2xs text-peec-dark"
          >
            {noteTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          rows={3}
          className="w-full resize-none rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark placeholder:text-peec-text-muted focus:border-peec-dark focus:outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-40"
          >
            <Plus className="h-3 w-3" /> Add Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-peec-text-muted">History</h3>
      {notes.length === 0 ? (
        <p className="text-xs text-peec-text-muted">No notes yet</p>
      ) : (
        <div className="space-y-2">
          {[...notes].reverse().map((note) => (
            <div key={note.id} className="rounded-lg border border-peec-border-light/50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-2xs font-medium ${
                  note.type === "complaint" ? "bg-red-50 text-red-600" :
                  note.type === "billing" ? "bg-blue-50 text-blue-600" :
                  note.type === "health" ? "bg-green-50 text-green-600" :
                  note.type === "follow-up" ? "bg-amber-50 text-amber-600" :
                  "bg-stone-100 text-stone-600"
                }`}>
                  {note.type}
                </span>
                <span className="text-2xs text-peec-text-muted">{formatDate(note.createdAt)}</span>
                <span className="text-2xs text-peec-text-muted">by {note.author}</span>
              </div>
              <p className="text-xs text-peec-dark">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Detail Card ────────────────────────────────────────────────

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-peec-border-light/50 p-3">
      <p className="text-2xs text-peec-text-muted">{label}</p>
      <p className="text-sm font-medium text-peec-dark">{value}</p>
    </div>
  );
}
