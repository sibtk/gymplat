"use client";

import { ArrowUp, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";

const prompts = [
  "Show me members at risk of churning this month",
  "Compare revenue across all locations",
  "Which classes have the highest retention?",
  "Generate a win-back campaign for inactive members",
  "Predict next month's revenue growth",
];

export function AiTypingPrompt() {
  const [text, setText] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentPrompt = prompts[promptIdx] ?? "";

    if (!deleting) {
      if (text.length < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setText(currentPrompt.slice(0, text.length + 1));
        }, 45);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (text.length > 0) {
      const timeout = setTimeout(() => setText(text.slice(0, -1)), 25);
      return () => clearTimeout(timeout);
    }

    setDeleting(false);
    setPromptIdx((prev) => (prev + 1) % prompts.length);
    return undefined;
  }, [text, deleting, promptIdx]);

  return (
    <div className="rounded-2xl border border-peec-border-light bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-peec-text-muted" />
        <span className="text-xs font-medium text-peec-text-muted">AI Assistant</span>
      </div>
      <div className="mb-3 min-h-[24px]">
        <span className="text-sm text-peec-text-secondary">{text}</span>
        <span className="animate-blink ml-0.5 inline-block h-4 w-[2px] bg-peec-dark align-middle" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-peec-border-light px-2.5 py-0.5 text-2xs text-peec-text-muted">
            AI Agent
          </span>
          <span className="rounded-full border border-peec-border-light px-2.5 py-0.5 text-2xs text-peec-text-muted">
            Retention Analysis
          </span>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-peec-dark text-white"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
