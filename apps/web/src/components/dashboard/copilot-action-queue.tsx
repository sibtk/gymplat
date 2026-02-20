"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Tag,
  Target,
  UserCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

import type { Intervention, InterventionType } from "@/lib/retention/types";

const typeIcons: Record<InterventionType, typeof Mail> = {
  email: Mail,
  discount: Tag,
  staff_task: UserCheck,
  phone_call: Phone,
  class_recommendation: Target,
  pt_consultation: MessageSquare,
};

const typeLabels: Record<InterventionType, string> = {
  email: "Email",
  discount: "Discount",
  staff_task: "Staff Task",
  phone_call: "Phone Call",
  class_recommendation: "Class Rec",
  pt_consultation: "PT Consult",
};

const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

type FilterType = "all" | InterventionType;
type StatusFilter = "all" | "recommended" | "approved" | "completed" | "dismissed";

interface CopilotActionQueueProps {
  compact?: boolean;
}

export function CopilotActionQueue({ compact }: CopilotActionQueueProps) {
  const interventions = useGymStore((s) => s.interventions);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const members = useGymStore((s) => s.members);
  const updateIntervention = useGymStore((s) => s.updateIntervention);
  const addActivityEvent = useGymStore((s) => s.addActivityEvent);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Also generate interventions from risk assessments if none exist
  const allInterventions = useMemo(() => {
    if (interventions.length > 0) return interventions;

    // Generate from assessments
    const generated: Intervention[] = [];
    const assessmentEntries = Object.values(riskAssessments)
      .filter((a) => a.recommendedInterventions.length > 0 && a.riskLevel !== "low")
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 10);

    for (const assessment of assessmentEntries) {
      const member = members.find((m) => m.id === assessment.memberId);
      if (!member) continue;

      for (const rec of assessment.recommendedInterventions.slice(0, 2)) {
        generated.push({
          id: generateId("int"),
          memberId: member.id,
          memberName: member.name,
          type: rec.type,
          title: rec.title,
          description: rec.description,
          status: "recommended",
          priority: rec.priority,
          estimatedImpact: rec.estimatedImpact,
          actualOutcome: null,
          createdAt: new Date().toISOString(),
          executedAt: null,
          completedAt: null,
          assignedTo: null,
        });
      }
    }

    return generated;
  }, [interventions, riskAssessments, members]);

  const filtered = useMemo(() => {
    return allInterventions.filter((i) => {
      if (typeFilter !== "all" && i.type !== typeFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      return true;
    });
  }, [allInterventions, typeFilter, statusFilter]);

  // Revenue impact estimate
  const totalImpact = useMemo(() => {
    const pending = allInterventions.filter(
      (i) => i.status === "recommended" || i.status === "approved",
    );
    return pending.length * 65; // Avg $65 per intervention
  }, [allInterventions]);

  const handleApprove = (intervention: Intervention) => {
    updateIntervention(intervention.id, {
      status: "approved",
      executedAt: new Date().toISOString(),
    });
    addActivityEvent({
      id: generateId("act"),
      type: "update",
      description: `Approved: ${intervention.title}`,
      timestamp: new Date().toISOString(),
      member: intervention.memberName,
    });
  };

  const handleDismiss = (intervention: Intervention) => {
    updateIntervention(intervention.id, { status: "dismissed" });
  };

  const limit = compact ? 5 : filtered.length;

  return (
    <div className={compact ? "" : "space-y-4"}>
      {!compact && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-peec-dark">Action Queue</h3>
              <p className="text-2xs text-peec-text-muted">
                {allInterventions.filter((i) => i.status === "recommended").length} pending &middot; est. ${totalImpact.toLocaleString()} revenue impact
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(["all", "email", "discount", "staff_task", "phone_call", "class_recommendation", "pt_consultation"] as FilterType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-full px-2.5 py-1 text-2xs font-medium transition-colors ${
                  typeFilter === t
                    ? "bg-peec-dark text-white"
                    : "bg-stone-100 text-peec-text-muted hover:bg-stone-200"
                }`}
              >
                {t === "all" ? "All" : typeLabels[t]}
              </button>
            ))}

            <div className="mx-1 h-5 w-px bg-peec-border-light" />

            {(["all", "recommended", "approved", "completed", "dismissed"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-2.5 py-1 text-2xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-peec-dark text-white"
                    : "bg-stone-100 text-peec-text-muted hover:bg-stone-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Intervention list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.slice(0, limit).map((intervention) => {
            const Icon = typeIcons[intervention.type];
            const isDone =
              intervention.status === "completed" ||
              intervention.status === "dismissed";

            return (
              <motion.div
                key={intervention.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isDone ? 0.6 : 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-peec-border-light bg-white p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-50">
                    <Icon className="h-4 w-4 text-peec-text-secondary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-peec-dark">
                        {intervention.memberName}
                      </p>
                      <span className={`rounded-full px-1.5 py-0.5 text-2xs font-medium ${priorityColors[intervention.priority]}`}>
                        {intervention.priority}
                      </span>
                    </div>
                    <p className="text-2xs font-medium text-peec-text-secondary">
                      {intervention.title}
                    </p>
                    <p className="mt-0.5 text-2xs text-peec-text-muted">
                      {intervention.description}
                    </p>
                    {intervention.estimatedImpact && (
                      <p className="mt-1 text-2xs text-green-600">
                        Impact: {intervention.estimatedImpact}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {intervention.status === "recommended" && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => handleApprove(intervention)}
                        className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100"
                        title="Approve"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismiss(intervention)}
                        className="rounded-lg bg-stone-50 p-1.5 text-peec-text-muted hover:bg-stone-100"
                        title="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  {intervention.status === "approved" && (
                    <span className="flex items-center gap-1 text-2xs text-amber-600">
                      <Clock className="h-3 w-3" /> Executing
                    </span>
                  )}
                  {intervention.status === "completed" && (
                    <span className="flex items-center gap-1 text-2xs text-green-600">
                      <Check className="h-3 w-3" /> Done
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-xs text-peec-text-muted">
            No interventions match your filters
          </p>
        )}
      </div>
    </div>
  );
}
