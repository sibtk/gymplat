"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  maxWidth?: string;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  maxWidth = "max-w-md",
  children,
}: ConfirmDialogProps) {
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
            transition={{ duration: 0.15 }}
          >
            <div className={`w-full ${maxWidth} rounded-xl border border-peec-border-light bg-white p-6 shadow-lg`}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-peec-dark">{title}</h3>
                  <p className="mt-1 text-xs text-peec-text-muted">{description}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {children && <div className="mb-4">{children}</div>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark transition-colors hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`rounded-lg px-4 py-2 text-xs font-medium text-white transition-colors ${
                    destructive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-peec-dark hover:bg-stone-800"
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
