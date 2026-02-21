"use client";

import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Plus, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { AddMemberWizard } from "@/components/dashboard/add-member-wizard";
import { CopilotCard } from "@/components/dashboard/copilot-card";
import { DataTable } from "@/components/dashboard/data-table";
import { MemberDetailDrawer } from "@/components/dashboard/member-detail-drawer";
import { PageEntrance, StaggerItem } from "@/components/dashboard/motion";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useToast } from "@/components/dashboard/toast";
import { useCopilotInsights } from "@/hooks/use-copilot-insights";
import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

import type { CopilotInsight } from "@/lib/retention/types";
import type { MemberFull } from "@/lib/types";

function riskDot(score: number): string {
  if (score >= 65) return "bg-red-500";
  if (score >= 45) return "bg-amber-500";
  if (score >= 25) return "bg-yellow-400";
  return "bg-green-500";
}

const columns = [
  {
    key: "name",
    label: "Member",
    render: (row: MemberFull) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-2xs font-medium text-peec-dark">
          {row.avatar}
        </div>
        <div>
          <p className="text-sm font-medium text-peec-dark">{row.name}</p>
          <p className="text-2xs text-peec-text-muted">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "plan",
    label: "Plan",
    render: (row: MemberFull) => {
      const plans = useGymStore.getState().plans;
      const plan = plans.find((p) => p.id === row.planId);
      return (
        <span className="rounded bg-stone-50 px-2 py-0.5 text-xs text-peec-text-secondary">
          {plan?.name ?? "Unknown"}
        </span>
      );
    },
  },
  {
    key: "riskScore",
    label: "Risk",
    render: (row: MemberFull) => {
      const assessments = useGymStore.getState().riskAssessments;
      const assessment = assessments[row.id];
      const score = assessment?.compositeScore ?? row.riskScore;
      return (
        <div className="flex items-center gap-1.5">
          <span className={`inline-block h-2 w-2 rounded-full ${riskDot(score)}`} />
          <span className="text-xs font-medium text-peec-text-secondary">{score}</span>
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row: MemberFull) => <StatusBadge status={row.status} />,
  },
  {
    key: "lastCheckIn",
    label: "Last Check-in",
    render: (row: MemberFull) => {
      const dates = row.checkInHistory;
      if (dates.length === 0) return <span className="text-xs text-peec-text-muted">Never</span>;
      const last = new Date(dates[0] as string);
      const days = Math.floor((Date.now() - last.getTime()) / 86400000);
      const label = days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
      return <span className="text-xs text-peec-text-secondary">{label}</span>;
    },
  },
  {
    key: "memberSince",
    label: "Member Since",
    render: (row: MemberFull) => (
      <span className="text-xs text-peec-text-secondary">{row.memberSince}</span>
    ),
    className: "hidden tablet:table-cell",
  },
];

const filters = [
  { label: "Active", value: "active" },
  { label: "At Risk", value: "at-risk" },
  { label: "Paused", value: "paused" },
  { label: "Churned", value: "churned" },
];

export default function MembersPage() {
  const members = useGymStore((s) => s.members);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const addIntervention = useGymStore((s) => s.addIntervention);
  const addActivityEvent = useGymStore((s) => s.addActivityEvent);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const insights = useCopilotInsights("members");
  const { toast } = useToast();

  const handleInsightAction = useCallback(
    (insight: CopilotInsight) => {
      if (insight.actionType === "navigate" && insight.relatedMemberId) {
        setSelectedMemberId(insight.relatedMemberId);
        setDrawerOpen(true);
        return;
      }

      if (insight.actionType === "dismiss") return;

      // For email, discount, staff_task, phone_call, class_recommendation, pt_consultation
      const memberName = insight.relatedMemberName ?? "Member";
      const interventionType = insight.actionType ?? "email";

      addIntervention({
        id: generateId("int"),
        memberId: insight.relatedMemberId ?? "",
        memberName,
        type: interventionType as Exclude<typeof interventionType, "navigate" | "dismiss">,
        title: insight.title,
        description: insight.description,
        status: "recommended",
        priority: insight.priority,
        estimatedImpact: "Pending assessment",
        actualOutcome: null,
        createdAt: new Date().toISOString(),
        executedAt: null,
        completedAt: null,
        assignedTo: null,
      });

      addActivityEvent({
        id: generateId("act"),
        type: "update",
        description: `Intervention created: ${insight.title}`,
        timestamp: new Date().toISOString(),
        member: memberName,
      });

      toast(`Intervention created for ${memberName}`);
    },
    [addIntervention, addActivityEvent, toast],
  );

  const handleRowClick = (member: MemberFull) => {
    setSelectedMemberId(member.id);
    setDrawerOpen(true);
  };

  const statusCounts = useMemo(() => {
    const counts = { total: members.length, active: 0, "at-risk": 0, paused: 0, churned: 0 };
    for (const m of members) {
      if (m.status === "active") counts.active++;
      else if (m.status === "at-risk" || m.status === "critical") counts["at-risk"]++;
      else if (m.status === "paused") counts.paused++;
      else if (m.status === "churned") counts.churned++;
    }
    return counts;
  }, [members]);

  // Count urgent members
  const urgentCount = useMemo(() => {
    return Object.values(riskAssessments).filter(
      (a) => a.riskLevel === "critical" || a.riskLevel === "high",
    ).length;
  }, [riskAssessments]);

  return (
    <PageEntrance>
      <div className="space-y-6">
        <StaggerItem>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-peec-dark">Members</h1>
              <p className="text-sm text-peec-text-muted">
                Manage and monitor all gym members
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Member
            </button>
          </div>
        </StaggerItem>

        {/* Urgent alert banner */}
        {urgentCount > 0 && (
          <StaggerItem>
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2.5">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-700">
                {urgentCount} member{urgentCount !== 1 ? "s" : ""} need{urgentCount === 1 ? "s" : ""} urgent attention
              </span>
            </div>
          </StaggerItem>
        )}

        {/* Copilot insights for members page */}
        {insights.length > 0 && (
          <StaggerItem>
            <div className="space-y-3">
              <AnimatePresence>
                {insights.slice(0, 2).map((insight) => (
                  <CopilotCard key={insight.id} insight={insight} onAction={handleInsightAction} />
                ))}
              </AnimatePresence>
            </div>
          </StaggerItem>
        )}

        {/* Status counts */}
        <StaggerItem>
          <div className="flex flex-wrap gap-3">
            <StatusCountBadge label="Total" count={statusCounts.total} color="bg-stone-100 text-stone-700" />
            <StatusCountBadge label="Active" count={statusCounts.active} color="bg-green-50 text-green-700" />
            <StatusCountBadge label="At Risk" count={statusCounts["at-risk"]} color="bg-amber-50 text-amber-700" />
            <StatusCountBadge label="Paused" count={statusCounts.paused} color="bg-blue-50 text-blue-700" />
            <StatusCountBadge label="Churned" count={statusCounts.churned} color="bg-stone-100 text-stone-600" />
          </div>
        </StaggerItem>

        <DataTable<MemberFull>
          data={members}
          columns={columns}
          searchable
          searchKeys={["name", "email"]}
          filters={filters}
          filterKey="status"
          emptyMessage="No members found"
          onRowClick={handleRowClick}
        />
      </div>

      <MemberDetailDrawer
        memberId={selectedMemberId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <AddMemberWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </PageEntrance>
  );
}

function StatusCountBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${color}`}>
      <Users className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{count} {label}</span>
    </div>
  );
}
