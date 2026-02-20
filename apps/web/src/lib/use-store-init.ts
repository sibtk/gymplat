"use client";

import { useEffect } from "react";

import { computeAllAssessments } from "@/lib/retention/engine";
import { computeGymHealth } from "@/lib/retention/health-score";
import {
  seedCampaigns,
  seedClassBookings,
  seedClasses,
  seedEmailTemplates,
  seedGymSettings,
  seedInvoices,
  seedLocations,
  seedMemberNotes,
  seedMembers,
  seedMessageHistory,
  seedNotifications,
  seedPaymentMethods,
  seedPlans,
  seedSavedReports,
  seedStaff,
  seedSubscriptions,
  seedTransactions,
  seedActivityEvents,
  seedChatMessages,
} from "@/lib/seed-data";
import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

import type { ComputeContext } from "@/lib/retention/types";
import type { CopilotInsight } from "@/lib/retention/types";

export function useStoreInit(): boolean {
  const seeded = useGymStore((s) => s._seeded);
  const hasHydrated = useGymStore((s) => s._hasHydrated);
  const seedStore = useGymStore((s) => s.seedStore);
  const setRiskAssessments = useGymStore((s) => s.setRiskAssessments);
  const setGymHealthScore = useGymStore((s) => s.setGymHealthScore);
  const addCopilotInsight = useGymStore((s) => s.addCopilotInsight);
  const addIntervention = useGymStore((s) => s.addIntervention);
  const updateMember = useGymStore((s) => s.updateMember);

  useEffect(() => {
    if (hasHydrated && !seeded) {
      // 1. Seed the base store data
      seedStore({
        members: seedMembers,
        plans: seedPlans,
        invoices: seedInvoices,
        subscriptions: seedSubscriptions,
        paymentMethods: seedPaymentMethods,
        transactions: seedTransactions,
        classes: seedClasses,
        classBookings: seedClassBookings,
        emailTemplates: seedEmailTemplates,
        campaigns: seedCampaigns,
        messageHistory: seedMessageHistory,
        locations: seedLocations,
        staffMembers: seedStaff,
        gymSettings: seedGymSettings,
        memberNotes: seedMemberNotes,
        chatMessages: seedChatMessages,
        savedReports: seedSavedReports,
        activityEvents: seedActivityEvents,
        notifications: seedNotifications,
      });

      // 2. Run retention engine
      const context: ComputeContext = {
        now: new Date(),
        allMembers: seedMembers,
        subscriptions: seedSubscriptions,
        invoices: seedInvoices,
        transactions: seedTransactions,
        classBookings: seedClassBookings,
        plans: seedPlans,
      };

      const assessments = computeAllAssessments(context);
      setRiskAssessments(assessments);

      // 3. Sync riskScore/riskFactors on each member for backward compat
      for (const member of seedMembers) {
        const assessment = assessments[member.id];
        if (assessment) {
          updateMember(member.id, {
            riskScore: assessment.compositeScore,
            riskFactors: assessment.explanation.factors
              .filter((f) => f.impact > 10)
              .map((f) => f.signal),
          });
        }
      }

      // 4. Compute gym health score
      const health = computeGymHealth(assessments);
      setGymHealthScore(health);

      // 5. Generate initial copilot insights from assessments
      const criticalMembers = Object.values(assessments)
        .filter((a) => a.riskLevel === "critical" || a.riskLevel === "high")
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 5);

      for (const assessment of criticalMembers) {
        const member = seedMembers.find((m) => m.id === assessment.memberId);
        if (!member) continue;

        const insight: CopilotInsight = {
          id: generateId("insight"),
          type: "risk_alert",
          title: `${member.name} needs attention`,
          description: assessment.explanation.summary,
          priority: assessment.riskLevel === "critical" ? "urgent" : "high",
          relatedMemberId: member.id,
          relatedMemberName: member.name,
          actionLabel: assessment.recommendedInterventions[0]?.title ?? "View Profile",
          actionType: assessment.recommendedInterventions[0]?.type ?? "navigate",
          createdAt: new Date().toISOString(),
          dismissed: false,
          page: null, // global
        };
        addCopilotInsight(insight);
      }

      // Add a trend insight
      addCopilotInsight({
        id: generateId("insight"),
        type: "trend",
        title: "Visit frequency declining across Student plan",
        description: "Student plan members show a 23% average decline in visit frequency over the past 2 weeks. Consider targeted engagement.",
        priority: "medium",
        relatedMemberId: null,
        relatedMemberName: null,
        actionLabel: "View Analytics",
        actionType: "navigate",
        createdAt: new Date().toISOString(),
        dismissed: false,
        page: "dashboard",
      });

      // Add an opportunity insight
      addCopilotInsight({
        id: generateId("insight"),
        type: "opportunity",
        title: "3 members eligible for PT upsell",
        description: "Premium members with high engagement scores could benefit from PT Package upgrade. Estimated +$210/mo MRR.",
        priority: "medium",
        relatedMemberId: null,
        relatedMemberName: null,
        actionLabel: "Create Campaign",
        actionType: "email",
        createdAt: new Date().toISOString(),
        dismissed: false,
        page: "dashboard",
      });

      // 6. Seed initial interventions from top risk assessments
      const sortedAssessments = Object.values(assessments)
        .filter((a) => a.recommendedInterventions.length > 0 && a.riskLevel !== "low")
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 8);

      const statusOptions = ["recommended", "recommended", "recommended", "approved", "completed"] as const;

      for (const assessment of sortedAssessments) {
        const member = seedMembers.find((m) => m.id === assessment.memberId);
        if (!member) continue;

        for (const rec of assessment.recommendedInterventions.slice(0, 2)) {
          const statusPick = statusOptions[Math.floor(Math.random() * statusOptions.length)] as (typeof statusOptions)[number];
          const createdDate = new Date();
          createdDate.setHours(createdDate.getHours() - Math.floor(Math.random() * 48));

          addIntervention({
            id: generateId("intv"),
            memberId: member.id,
            memberName: member.name,
            type: rec.type,
            title: rec.title,
            description: rec.description,
            status: statusPick,
            priority: rec.priority,
            estimatedImpact: rec.estimatedImpact,
            actualOutcome: statusPick === "completed" ? "Member re-engaged after outreach" : null,
            createdAt: createdDate.toISOString(),
            executedAt: statusPick === "approved" || statusPick === "completed"
              ? new Date(createdDate.getTime() + 3600000).toISOString()
              : null,
            completedAt: statusPick === "completed"
              ? new Date(createdDate.getTime() + 7200000).toISOString()
              : null,
            assignedTo: statusPick === "approved" ? "Mike Johnson" : null,
          });
        }
      }
    }
  }, [hasHydrated, seeded, seedStore, setRiskAssessments, setGymHealthScore, addCopilotInsight, addIntervention, updateMember]);

  return hasHydrated;
}
