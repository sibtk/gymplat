"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Edit3, Mail, Plus, Send, Trash2 } from "lucide-react";
import { useState } from "react";

import { CampaignBuilder } from "@/components/dashboard/campaign-builder";
import { DataTable } from "@/components/dashboard/data-table";
import { PageEntrance } from "@/components/dashboard/motion";
import { TemplateEditor } from "@/components/dashboard/template-editor";
import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

import type { Campaign, EmailTemplate, MessageRecord } from "@/lib/types";

const tabs = ["Templates", "Campaigns", "Message History"] as const;
type Tab = (typeof tabs)[number];

// ─── Campaign columns ───────────────────────────────────────────

const campaignColumns = [
  {
    key: "name",
    label: "Campaign",
    render: (row: Campaign) => <span className="text-sm font-medium text-peec-dark">{row.name}</span>,
  },
  {
    key: "template",
    label: "Template",
    render: (row: Campaign) => <span className="text-xs text-peec-text-secondary">{row.templateName}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (row: Campaign) => (
      <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
        row.status === "sent" ? "bg-green-50 text-green-700" :
        row.status === "draft" ? "bg-stone-100 text-stone-600" :
        "bg-blue-50 text-blue-700"
      }`}>{row.status}</span>
    ),
  },
  {
    key: "recipients",
    label: "Recipients",
    render: (row: Campaign) => <span className="text-xs text-peec-text-secondary">{row.recipientCount}</span>,
  },
  {
    key: "opens",
    label: "Opens",
    render: (row: Campaign) => (
      <span className="text-xs text-peec-text-secondary">
        {row.recipientCount > 0 ? `${Math.round((row.openCount / row.recipientCount) * 100)}%` : "-"}
      </span>
    ),
    className: "hidden tablet:table-cell",
  },
];

// ─── Message columns ────────────────────────────────────────────

const messageColumns = [
  {
    key: "member",
    label: "Member",
    render: (row: MessageRecord) => <span className="text-sm font-medium text-peec-dark">{row.memberName}</span>,
  },
  {
    key: "subject",
    label: "Subject",
    render: (row: MessageRecord) => <span className="text-xs text-peec-text-secondary">{row.subject}</span>,
  },
  {
    key: "channel",
    label: "Channel",
    render: (row: MessageRecord) => (
      <span className="rounded bg-stone-50 px-2 py-0.5 text-2xs capitalize text-peec-text-secondary">{row.channel}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: MessageRecord) => (
      <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
        row.status === "opened" ? "bg-green-50 text-green-700" :
        row.status === "delivered" ? "bg-blue-50 text-blue-700" :
        row.status === "bounced" ? "bg-red-50 text-red-700" :
        "bg-stone-100 text-stone-600"
      }`}>{row.status}</span>
    ),
  },
  {
    key: "date",
    label: "Sent",
    render: (row: MessageRecord) => <span className="text-xs text-peec-text-muted">{formatDate(row.sentAt)}</span>,
    className: "hidden tablet:table-cell",
  },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Templates");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [campaignOpen, setCampaignOpen] = useState(false);

  const { toast } = useToast();
  const templates = useGymStore((s) => s.emailTemplates);
  const campaigns = useGymStore((s) => s.campaigns);
  const messageHistory = useGymStore((s) => s.messageHistory);
  const removeEmailTemplate = useGymStore((s) => s.removeEmailTemplate);

  const handleEditTemplate = (tmpl: EmailTemplate) => {
    setEditTemplate(tmpl);
    setEditorOpen(true);
  };

  const handleNewTemplate = () => {
    setEditTemplate(null);
    setEditorOpen(true);
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-peec-dark">Communication</h1>
            <p className="text-sm text-peec-text-muted">Manage email templates, campaigns, and message history</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-peec-border-light bg-stone-50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab ? "bg-white text-peec-dark shadow-sm" : "text-peec-text-muted hover:text-peec-dark"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {activeTab === "Templates" && (
              <div>
                <div className="mb-4 flex justify-end">
                  <button type="button" onClick={handleNewTemplate} className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">
                    <Plus className="h-3.5 w-3.5" /> Create Template
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
                  {templates.map((tmpl) => (
                    <div key={tmpl.id} className="rounded-xl border border-peec-border-light bg-white p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-peec-text-muted" />
                          <span className="text-sm font-medium text-peec-dark">{tmpl.name}</span>
                        </div>
                        <span className="rounded bg-stone-50 px-2 py-0.5 text-2xs capitalize text-peec-text-muted">{tmpl.type}</span>
                      </div>
                      <p className="mb-3 text-2xs text-peec-text-muted line-clamp-2">{tmpl.subject}</p>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleEditTemplate(tmpl)} className="flex items-center gap-1 rounded border border-peec-border-light px-2 py-1 text-2xs text-peec-dark hover:bg-stone-50">
                          <Edit3 className="h-3 w-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => { removeEmailTemplate(tmpl.id); toast("Template deleted"); }}
                          className="flex items-center gap-1 rounded border border-red-200 px-2 py-1 text-2xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "Campaigns" && (
              <div>
                <div className="mb-4 flex justify-end">
                  <button type="button" onClick={() => setCampaignOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">
                    <Send className="h-3.5 w-3.5" /> New Campaign
                  </button>
                </div>
                <DataTable<Campaign>
                  data={campaigns}
                  columns={campaignColumns}
                  searchable
                  searchKeys={["name", "templateName"]}
                  filters={[
                    { label: "Sent", value: "sent" },
                    { label: "Draft", value: "draft" },
                    { label: "Scheduled", value: "scheduled" },
                  ]}
                  filterKey="status"
                  emptyMessage="No campaigns yet"
                />
              </div>
            )}
            {activeTab === "Message History" && (
              <DataTable<MessageRecord>
                data={messageHistory}
                columns={messageColumns}
                searchable
                searchKeys={["memberName", "subject"]}
                filters={[
                  { label: "Opened", value: "opened" },
                  { label: "Delivered", value: "delivered" },
                  { label: "Sent", value: "sent" },
                  { label: "Bounced", value: "bounced" },
                ]}
                filterKey="status"
                emptyMessage="No messages sent"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <TemplateEditor template={editTemplate} open={editorOpen} onClose={() => { setEditorOpen(false); setEditTemplate(null); }} />
      <CampaignBuilder open={campaignOpen} onClose={() => setCampaignOpen(false)} />
    </PageEntrance>
  );
}
