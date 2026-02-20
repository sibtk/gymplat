"use client";

import { CreditCard, Star, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";

import type { PaymentMethod } from "@/lib/types";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
}

export function PaymentMethodCard({ paymentMethod }: PaymentMethodCardProps) {
  const [removeOpen, setRemoveOpen] = useState(false);
  const { toast } = useToast();
  const updatePaymentMethod = useGymStore((s) => s.updatePaymentMethod);
  const removePaymentMethod = useGymStore((s) => s.removePaymentMethod);
  const paymentMethods = useGymStore((s) => s.paymentMethods);

  const handleSetDefault = () => {
    // Unset all other defaults for this member
    const memberPms = paymentMethods.filter((pm) => pm.memberId === paymentMethod.memberId);
    for (const pm of memberPms) {
      if (pm.id !== paymentMethod.id && pm.isDefault) {
        updatePaymentMethod(pm.id, { isDefault: false });
      }
    }
    updatePaymentMethod(paymentMethod.id, { isDefault: true });
    toast("Default payment method updated");
  };

  const handleRemove = () => {
    removePaymentMethod(paymentMethod.id);
    toast("Payment method removed");
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-peec-border-light p-3">
      <div className="flex items-center gap-3">
        <CreditCard className="h-5 w-5 text-peec-text-muted" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium capitalize text-peec-dark">
              {paymentMethod.brand} &bull;&bull;&bull;&bull; {paymentMethod.last4}
            </p>
            {paymentMethod.isDefault && (
              <span className="flex items-center gap-0.5 rounded bg-green-50 px-1.5 py-0.5 text-2xs font-medium text-green-700">
                <Star className="h-2.5 w-2.5" /> Default
              </span>
            )}
          </div>
          <p className="text-2xs text-peec-text-muted">
            {paymentMethod.memberName} &middot; Exp {String(paymentMethod.expMonth).padStart(2, "0")}/{paymentMethod.expYear}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!paymentMethod.isDefault && (
          <button type="button" onClick={handleSetDefault} className="rounded px-2 py-1 text-2xs font-medium text-peec-dark hover:bg-stone-50">
            Set Default
          </button>
        )}
        <button type="button" onClick={() => setRemoveOpen(true)} className="rounded p-1 text-peec-text-muted hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <ConfirmDialog
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
        title="Remove Payment Method"
        description={`Remove ${paymentMethod.brand} ending in ${paymentMethod.last4}?`}
        confirmLabel="Remove"
        destructive
      />
    </div>
  );
}
