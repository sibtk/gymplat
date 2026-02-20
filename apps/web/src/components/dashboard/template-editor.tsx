"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

import type { EmailTemplate } from "@/lib/types";

interface TemplateEditorProps {
  template: EmailTemplate | null; // null = create new
  open: boolean;
  onClose: () => void;
}

const templateTypes = ["welcome", "win-back", "payment-reminder", "class-reminder", "milestone", "birthday", "general"] as const;
const commonVariables = ["memberName", "gymName", "planName", "amount", "dueDate", "className", "trainerName"];

export function TemplateEditor({ template, open, onClose }: TemplateEditorProps) {
  const { toast } = useToast();
  const addEmailTemplate = useGymStore((s) => s.addEmailTemplate);
  const updateEmailTemplate = useGymStore((s) => s.updateEmailTemplate);

  const [name, setName] = useState(template?.name ?? "");
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [body, setBody] = useState(template?.body ?? "");
  const [type, setType] = useState<string>(template?.type ?? "general");

  const handleSave = () => {
    const now = new Date().toISOString();
    const vars = commonVariables.filter((v) => body.includes(`{{${v}}}`) || subject.includes(`{{${v}}}`));

    if (template) {
      updateEmailTemplate(template.id, { name, subject, body, type: type as EmailTemplate["type"], variables: vars, updatedAt: now });
      toast("Template updated");
    } else {
      addEmailTemplate({
        id: generateId("tmpl"),
        name,
        subject,
        body,
        type: type as EmailTemplate["type"],
        variables: vars,
        createdAt: now,
        updatedAt: now,
      });
      toast("Template created");
    }
    onClose();
  };

  // Preview with mock data substituted
  const previewBody = body
    .replace(/\{\{memberName\}\}/g, "Sarah Chen")
    .replace(/\{\{gymName\}\}/g, "Iron Temple Fitness")
    .replace(/\{\{planName\}\}/g, "Premium")
    .replace(/\{\{amount\}\}/g, "$49.99")
    .replace(/\{\{dueDate\}\}/g, "Mar 1, 2026")
    .replace(/\{\{className\}\}/g, "Morning Yoga")
    .replace(/\{\{trainerName\}\}/g, "Sam Patel")
    .replace(/\{\{classTime\}\}/g, "7:30 AM")
    .replace(/\{\{milestone\}\}/g, "100 check-ins")
    .replace(/\{\{subject\}\}/g, subject)
    .replace(/\{\{heading\}\}/g, name)
    .replace(/\{\{body\}\}/g, "This is the email body content.");

  const inputClass = "w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-0 z-[61] flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="w-full max-w-4xl rounded-xl border border-peec-border-light bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-peec-border-light px-6 py-4">
                <h3 className="text-sm font-semibold text-peec-dark">
                  {template ? "Edit Template" : "Create Template"}
                </h3>
                <button type="button" onClick={onClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 divide-y divide-peec-border-light tablet:grid-cols-2 tablet:divide-x tablet:divide-y-0">
                {/* Editor */}
                <div className="space-y-3 p-6">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Template name" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-peec-dark">Type</label>
                      <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                        {templateTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-peec-dark">Subject</label>
                      <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} placeholder="Email subject" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Body (HTML)</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className={`${inputClass} resize-none font-mono text-xs`} placeholder="<h2>Hello {{memberName}}</h2>" />
                  </div>
                  <div>
                    <p className="mb-1 text-2xs font-medium text-peec-text-muted">Insert Variable:</p>
                    <div className="flex flex-wrap gap-1">
                      {commonVariables.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setBody((b) => `${b}{{${v}}}`)}
                          className="rounded bg-stone-100 px-2 py-0.5 text-2xs text-peec-text-secondary hover:bg-stone-200"
                        >
                          {`{{${v}}}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-6">
                  <p className="mb-3 text-xs font-medium text-peec-text-muted">Preview</p>
                  <div className="rounded-lg border border-peec-border-light bg-white p-4">
                    <div className="mb-3 border-b border-peec-border-light pb-3">
                      <p className="text-2xs text-peec-text-muted">To: sarah.c@email.com</p>
                      <p className="text-xs font-medium text-peec-dark">
                        {subject.replace(/\{\{memberName\}\}/g, "Sarah Chen").replace(/\{\{planName\}\}/g, "Premium")}
                      </p>
                    </div>
                    <div
                      className="prose prose-sm max-w-none text-xs text-peec-dark"
                      dangerouslySetInnerHTML={{ __html: previewBody }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-peec-border-light px-6 py-4">
                <button type="button" onClick={onClose} className="rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50">Cancel</button>
                <button type="button" onClick={handleSave} disabled={!name || !subject} className="rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-40">Save Template</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
