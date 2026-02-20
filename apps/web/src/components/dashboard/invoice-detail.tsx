"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

import type { Invoice } from "@/lib/types";

interface InvoiceDetailProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceDetail({ invoice, open, onClose }: InvoiceDetailProps) {
  const { toast } = useToast();
  const updateInvoice = useGymStore((s) => s.updateInvoice);
  const gymSettings = useGymStore((s) => s.gymSettings);

  if (!invoice) return null;

  const handleVoid = () => {
    updateInvoice(invoice.id, { status: "void" });
    toast("Invoice voided");
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
            <div className="w-full max-w-lg rounded-xl border border-peec-border-light bg-white shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-peec-border-light px-6 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-peec-dark">Invoice {invoice.id}</h3>
                  <p className="text-2xs text-peec-text-muted">Issued {formatDate(invoice.issuedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
                    invoice.status === "paid" ? "bg-green-50 text-green-700" :
                    invoice.status === "pending" ? "bg-amber-50 text-amber-700" :
                    invoice.status === "void" ? "bg-stone-100 text-stone-600" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {invoice.status}
                  </span>
                  <button type="button" onClick={onClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* From / To */}
                <div className="mb-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-1 text-2xs font-medium uppercase text-peec-text-muted">From</p>
                    <p className="text-xs font-medium text-peec-dark">{gymSettings.name}</p>
                    <p className="text-2xs text-peec-text-secondary">{gymSettings.address}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-2xs font-medium uppercase text-peec-text-muted">Bill To</p>
                    <p className="text-xs font-medium text-peec-dark">{invoice.memberName}</p>
                  </div>
                </div>

                {/* Line Items */}
                <table className="mb-4 w-full">
                  <thead>
                    <tr className="border-b border-peec-border-light">
                      <th className="pb-2 text-left text-2xs font-medium uppercase text-peec-text-muted">Description</th>
                      <th className="pb-2 text-right text-2xs font-medium uppercase text-peec-text-muted">Qty</th>
                      <th className="pb-2 text-right text-2xs font-medium uppercase text-peec-text-muted">Price</th>
                      <th className="pb-2 text-right text-2xs font-medium uppercase text-peec-text-muted">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item, i) => (
                      <tr key={i} className="border-b border-peec-border-light/50">
                        <td className="py-2 text-xs text-peec-dark">{item.description}</td>
                        <td className="py-2 text-right text-xs text-peec-text-secondary">{item.quantity}</td>
                        <td className="py-2 text-right text-xs text-peec-text-secondary">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2 text-right text-xs font-medium text-peec-dark">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="space-y-1 text-right">
                  <div className="flex justify-end gap-8">
                    <span className="text-xs text-peec-text-muted">Subtotal</span>
                    <span className="text-xs text-peec-dark">{formatCurrency(invoice.amount)}</span>
                  </div>
                  <div className="flex justify-end gap-8">
                    <span className="text-xs text-peec-text-muted">Tax</span>
                    <span className="text-xs text-peec-dark">{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="flex justify-end gap-8 border-t border-peec-border-light pt-1">
                    <span className="text-xs font-semibold text-peec-dark">Total</span>
                    <span className="text-xs font-semibold text-peec-dark">{formatCurrency(invoice.total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                  {invoice.status !== "void" && invoice.status !== "paid" && (
                    <button type="button" onClick={handleVoid} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                      Void Invoice
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { toast("Invoice resent"); onClose(); }}
                    className="rounded-lg bg-peec-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                  >
                    Resend
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
