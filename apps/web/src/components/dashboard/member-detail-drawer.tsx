"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gift, Mail, Phone, X } from "lucide-react";
import { useEffect } from "react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { useToast } from "@/components/dashboard/toast";

import type { Member } from "@/lib/mock-data";

interface MemberDetailDrawerProps {
  member: Member | null;
  open: boolean;
  onClose: () => void;
}

// Fake weekly visit data for mini bar chart
const weeklyVisits = [3, 5, 2, 4];
const weekLabels = ["W1", "W2", "W3", "W4"];
const maxVisit = Math.max(...weeklyVisits);

export function MemberDetailDrawer({ member, open, onClose }: MemberDetailDrawerProps) {
  const { toast } = useToast();

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
    return undefined;
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && member && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white shadow-xl tablet:w-[420px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-lg font-semibold text-peec-dark">
                  {member.avatar}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-peec-dark">{member.name}</h2>
                  <p className="text-xs text-peec-text-muted">{member.email}</p>
                  <div className="mt-1">
                    <StatusBadge status={member.status} />
                  </div>
                </div>
              </div>

              {/* Visit Frequency */}
              <div className="mb-6">
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
                      <span className="text-2xs text-peec-text-muted">{weekLabels[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Timeline (for at-risk members) */}
              {member.status === "at-risk" && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
                    Risk Timeline
                  </h3>
                  <div className="relative space-y-3 border-l-2 border-red-200 pl-4">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                      <p className="text-xs font-medium text-peec-dark">Visit frequency dropped</p>
                      <p className="text-2xs text-peec-text-muted">2 weeks ago</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <p className="text-xs font-medium text-peec-dark">Engagement score declined</p>
                      <p className="text-2xs text-peec-text-muted">1 week ago</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
                      <p className="text-xs font-medium text-peec-dark">Flagged as at-risk</p>
                      <p className="text-2xs text-peec-text-muted">3 days ago</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Membership Details */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
                  Membership Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-peec-border-light/50 p-3">
                    <p className="text-2xs text-peec-text-muted">Plan</p>
                    <p className="text-sm font-medium text-peec-dark">{member.plan}</p>
                  </div>
                  <div className="rounded-lg border border-peec-border-light/50 p-3">
                    <p className="text-2xs text-peec-text-muted">Member Since</p>
                    <p className="text-sm font-medium text-peec-dark">{member.memberSince}</p>
                  </div>
                  <div className="rounded-lg border border-peec-border-light/50 p-3">
                    <p className="text-2xs text-peec-text-muted">Last Check-in</p>
                    <p className="text-sm font-medium text-peec-dark">{member.lastCheckIn}</p>
                  </div>
                  <div className="rounded-lg border border-peec-border-light/50 p-3">
                    <p className="text-2xs text-peec-text-muted">Status</p>
                    <p className="text-sm font-medium capitalize text-peec-dark">{member.status}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => toast(`Email sent to ${member.name}`)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-peec-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
                <button
                  type="button"
                  onClick={() => toast(`Discount offer sent to ${member.name}`)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-peec-border-light px-4 py-2 text-sm font-medium text-peec-dark transition-colors hover:bg-stone-50"
                >
                  <Gift className="h-4 w-4" />
                  Offer Discount
                </button>
                <button
                  type="button"
                  onClick={() => toast(`Call scheduled with ${member.name}`)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-peec-border-light px-4 py-2 text-sm font-medium text-peec-dark transition-colors hover:bg-stone-50"
                >
                  <Phone className="h-4 w-4" />
                  Schedule Call
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
