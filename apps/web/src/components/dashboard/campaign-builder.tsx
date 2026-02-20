"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

interface CampaignBuilderProps {
  open: boolean;
  onClose: () => void;
}

const segments = [
  { label: "All Active Members", value: "all-active", count: 0 },
  { label: "At-Risk Members", value: "at-risk", count: 0 },
  { label: "Churned (last 90 days)", value: "churned-90d", count: 0 },
  { label: "New Members (last 30 days)", value: "new-30d", count: 0 },
  { label: "Paused Members", value: "paused", count: 0 },
];

export function CampaignBuilder({ open, onClose }: CampaignBuilderProps) {
  const [step, setStep] = useState(0);
  const [segment, setSegment] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [name, setName] = useState("");

  const { toast } = useToast();
  const templates = useGymStore((s) => s.emailTemplates);
  const members = useGymStore((s) => s.members);
  const addCampaign = useGymStore((s) => s.addCampaign);
  const addMessageRecord = useGymStore((s) => s.addMessageRecord);

  // Calculate segment counts dynamically
  const segmentCounts: Record<string, number> = {
    "all-active": members.filter((m) => m.status === "active").length,
    "at-risk": members.filter((m) => m.status === "at-risk" || m.status === "critical").length,
    "churned-90d": members.filter((m) => m.status === "churned").length,
    "new-30d": members.filter((m) => m.tags.includes("new-member")).length || 0,
    "paused": members.filter((m) => m.status === "paused").length,
  };

  const selectedTemplate = templates.find((t) => t.id === templateId);
  const recipientCount = segmentCounts[segment] ?? 0;

  const handleSend = () => {
    if (!selectedTemplate || !segment) return;

    const now = new Date().toISOString();
    const campaignId = generateId("cmp");

    addCampaign({
      id: campaignId,
      name: name || `Campaign ${campaignId}`,
      templateId,
      templateName: selectedTemplate.name,
      segment: segments.find((s) => s.value === segment)?.label ?? segment,
      status: "sent",
      recipientCount,
      openCount: 0,
      clickCount: 0,
      scheduledAt: now,
      sentAt: now,
      createdAt: now,
    });

    // Create message records for recipients
    const targetMembers = getSegmentMembers(segment, members);
    for (const m of targetMembers.slice(0, 20)) {
      addMessageRecord({
        id: generateId("msg"),
        memberId: m.id,
        memberName: m.name,
        channel: "email",
        subject: selectedTemplate.subject.replace("{{memberName}}", m.name),
        status: "sent",
        sentAt: now,
        openedAt: null,
      });
    }

    toast(`Campaign sent to ${recipientCount} recipients`);
    setStep(0);
    setSegment("");
    setTemplateId("");
    setName("");
    onClose();
  };

  const handleClose = () => {
    setStep(0);
    setSegment("");
    setTemplateId("");
    setName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} />
          <motion.div className="fixed inset-0 z-[61] flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="w-full max-w-lg rounded-xl border border-peec-border-light bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-peec-dark">
                  {step === 0 ? "Select Audience" : step === 1 ? "Choose Template" : "Review & Send"}
                </h3>
                <button type="button" onClick={handleClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Step 0: Segment */}
              {step === 0 && (
                <div className="space-y-2">
                  {segments.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => { setSegment(s.value); setStep(1); }}
                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                        segment === s.value ? "border-peec-dark bg-stone-50" : "border-peec-border-light hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-xs font-medium text-peec-dark">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-peec-text-secondary">{segmentCounts[s.value]} members</span>
                        <ChevronRight className="h-3.5 w-3.5 text-peec-text-muted" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Template */}
              {step === 1 && (
                <div className="space-y-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setTemplateId(t.id); setStep(2); }}
                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                        templateId === t.id ? "border-peec-dark bg-stone-50" : "border-peec-border-light hover:bg-stone-50"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-medium text-peec-dark">{t.name}</p>
                        <p className="text-2xs text-peec-text-muted">{t.type}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-peec-text-muted" />
                    </button>
                  ))}
                  <button type="button" onClick={() => setStep(0)} className="mt-3 text-xs text-peec-text-secondary hover:underline">Back</button>
                </div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Campaign Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none"
                      placeholder="e.g., March Win-Back"
                    />
                  </div>
                  <div className="rounded-lg border border-peec-border-light bg-stone-50 p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-peec-text-muted">Audience</span>
                      <span className="text-xs font-medium text-peec-dark">{segments.find((s) => s.value === segment)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-peec-text-muted">Recipients</span>
                      <span className="text-xs font-medium text-peec-dark">{recipientCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-peec-text-muted">Template</span>
                      <span className="text-xs font-medium text-peec-dark">{selectedTemplate?.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="text-xs text-peec-text-secondary hover:underline">Back</button>
                    <button type="button" onClick={handleSend} className="rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">
                      Send Campaign
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getSegmentMembers(segment: string, members: { id: string; name: string; status: string; tags: string[] }[]) {
  switch (segment) {
    case "all-active": return members.filter((m) => m.status === "active");
    case "at-risk": return members.filter((m) => m.status === "at-risk" || m.status === "critical");
    case "churned-90d": return members.filter((m) => m.status === "churned");
    case "paused": return members.filter((m) => m.status === "paused");
    case "new-30d": return members.filter((m) => m.tags.includes("new-member"));
    default: return [];
  }
}
