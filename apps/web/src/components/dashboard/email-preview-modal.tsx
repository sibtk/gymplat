"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

interface EmailPreviewModalProps {
  open: boolean;
  onClose: () => void;
  to: { id: string; name: string; email: string };
  subject: string;
  body: string;
}

export function EmailPreviewModal({ open, onClose, to, subject, body }: EmailPreviewModalProps) {
  const { toast } = useToast();
  const addMessageRecord = useGymStore((s) => s.addMessageRecord);

  const handleSend = () => {
    addMessageRecord({
      id: generateId("msg"),
      memberId: to.id,
      memberName: to.name,
      channel: "email",
      subject,
      status: "sent",
      sentAt: new Date().toISOString(),
      openedAt: null,
    });
    toast(`Email sent to ${to.name}`);
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
            <div className="w-full max-w-2xl rounded-xl border border-peec-border-light bg-white shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-peec-border-light px-6 py-4">
                <h3 className="text-sm font-semibold text-peec-dark">Email Preview</h3>
                <button type="button" onClick={onClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Email envelope */}
              <div className="px-6 py-4">
                <div className="space-y-2 border-b border-peec-border-light pb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-peec-text-muted">To:</span>
                    <span className="font-medium text-peec-dark">{to.name} &lt;{to.email}&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-peec-text-muted">From:</span>
                    <span className="font-medium text-peec-dark">Iron Temple Fitness &lt;noreply@irontemple.com&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-peec-text-muted">Subject:</span>
                    <span className="font-medium text-peec-dark">{subject}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="mt-4 rounded-lg border border-peec-border-light bg-stone-50/50 p-5">
                  <div
                    className="prose prose-sm max-w-none text-xs leading-relaxed text-peec-text-secondary"
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-peec-border-light px-6 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800"
                >
                  <Send className="h-3.5 w-3.5" /> Send Email
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
