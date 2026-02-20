"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

import type { Subscription } from "@/lib/types";

interface SubscriptionManagerProps {
  subscription: Subscription;
}

export function SubscriptionManager({ subscription }: SubscriptionManagerProps) {
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(subscription.planId);
  const { toast } = useToast();
  const plans = useGymStore((s) => s.plans);
  const updateSubscription = useGymStore((s) => s.updateSubscription);

  const handleChangePlan = () => {
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return;
    updateSubscription(subscription.id, {
      planId: plan.id,
      planName: plan.name,
      amount: plan.priceMonthly,
    });
    toast(`Plan changed to ${plan.name}`);
    setChangePlanOpen(false);
  };

  const handleCancel = () => {
    updateSubscription(subscription.id, { cancelAtPeriodEnd: true });
    toast("Subscription will cancel at period end");
  };

  const handlePause = () => {
    updateSubscription(subscription.id, { status: "paused" });
    toast("Subscription paused");
  };

  return (
    <div className="rounded-lg border border-peec-border-light p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-peec-dark">{subscription.memberName}</p>
          <p className="text-xs text-peec-text-secondary">
            {subscription.planName} &middot; {formatCurrency(subscription.amount)}/{subscription.billingCycle === "monthly" ? "mo" : "yr"}
          </p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
          subscription.status === "active"
            ? "bg-green-50 text-green-700"
            : subscription.status === "paused"
              ? "bg-blue-50 text-blue-700"
              : "bg-stone-100 text-stone-600"
        }`}>
          {subscription.status}
          {subscription.cancelAtPeriodEnd && " (cancelling)"}
        </span>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setChangePlanOpen(true)} className="rounded border border-peec-border-light px-2 py-1 text-2xs font-medium text-peec-dark hover:bg-stone-50">
          Change Plan
        </button>
        {subscription.status === "active" && (
          <button type="button" onClick={() => setPauseOpen(true)} className="rounded border border-amber-200 px-2 py-1 text-2xs font-medium text-amber-700 hover:bg-amber-50">
            Pause
          </button>
        )}
        {!subscription.cancelAtPeriodEnd && subscription.status !== "cancelled" && (
          <button type="button" onClick={() => setCancelOpen(true)} className="rounded border border-red-200 px-2 py-1 text-2xs font-medium text-red-600 hover:bg-red-50">
            Cancel
          </button>
        )}
      </div>

      {/* Change Plan Dialog */}
      <ConfirmDialog
        open={changePlanOpen}
        onClose={() => setChangePlanOpen(false)}
        onConfirm={handleChangePlan}
        title="Change Plan"
        description="Select a new plan for this subscription."
        confirmLabel="Change Plan"
      >
        <div className="space-y-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                selectedPlanId === plan.id
                  ? "border-peec-dark bg-stone-50"
                  : "border-peec-border-light hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-peec-dark">{plan.name}</span>
                <span className="text-xs text-peec-text-secondary">{formatCurrency(plan.priceMonthly)}/mo</span>
              </div>
            </button>
          ))}
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Subscription"
        description={`Cancel ${subscription.memberName}'s ${subscription.planName} subscription at the end of the current billing period?`}
        confirmLabel="Cancel Subscription"
        destructive
      />
      <ConfirmDialog
        open={pauseOpen}
        onClose={() => setPauseOpen(false)}
        onConfirm={handlePause}
        title="Pause Subscription"
        description={`Pause ${subscription.memberName}'s subscription? They will not be billed while paused.`}
        confirmLabel="Pause"
      />
    </div>
  );
}
