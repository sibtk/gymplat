"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

import type { TransactionFull } from "@/lib/types";

interface RefundDialogProps {
  transaction: TransactionFull | null;
  open: boolean;
  onClose: () => void;
}

export function RefundDialog({ transaction, open, onClose }: RefundDialogProps) {
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [reason, setReason] = useState("");
  const processRefund = useGymStore((s) => s.processRefund);
  const { toast } = useToast();

  if (!transaction) return null;

  const maxAmount = Math.abs(transaction.amount);

  const handleRefund = () => {
    const amount = refundType === "full" ? maxAmount : parseFloat(partialAmount) || 0;
    if (amount <= 0 || amount > maxAmount) return;
    processRefund(transaction.id, amount, reason || "No reason provided");
    toast(`Refund of ${formatCurrency(amount)} processed`);
    setRefundType("full");
    setPartialAmount("");
    setReason("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="w-full max-w-md rounded-xl border border-peec-border-light bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-peec-dark">Process Refund</h3>
                <button type="button" onClick={onClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 rounded-lg border border-peec-border-light bg-stone-50 p-3">
                <p className="text-xs text-peec-text-muted">Original Transaction</p>
                <p className="text-sm font-medium text-peec-dark">{transaction.memberName}</p>
                <p className="text-xs text-peec-text-secondary">
                  {formatCurrency(transaction.amount)} &middot; {transaction.date}
                </p>
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundType("full")}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      refundType === "full"
                        ? "border-peec-dark bg-peec-dark text-white"
                        : "border-peec-border-light text-peec-dark hover:bg-stone-50"
                    }`}
                  >
                    Full Refund ({formatCurrency(maxAmount)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefundType("partial")}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      refundType === "partial"
                        ? "border-peec-dark bg-peec-dark text-white"
                        : "border-peec-border-light text-peec-dark hover:bg-stone-50"
                    }`}
                  >
                    Partial Refund
                  </button>
                </div>

                {refundType === "partial" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      max={maxAmount}
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(e.target.value)}
                      className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none"
                      placeholder={`Max: ${formatCurrency(maxAmount)}`}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-peec-dark">Reason</label>
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none"
                    placeholder="e.g., Customer requested refund"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50">
                  Cancel
                </button>
                <button type="button" onClick={handleRefund} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">
                  Process Refund
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
