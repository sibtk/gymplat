"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { aiCannedResponses } from "@/lib/mock-data";
import { useGymStore } from "@/lib/store";

interface CopilotSpotlightProps {
  open: boolean;
  onClose: () => void;
}

const contextSuggestions: Record<string, string[]> = {
  dashboard: [
    "Who needs attention right now?",
    "What's driving our retention improvements?",
    "Show me today's risk alerts",
  ],
  members: [
    "Which members are most likely to churn?",
    "Compare plan retention rates",
    "Find members with declining engagement",
  ],
  analytics: [
    "What trends should I worry about?",
    "Show me revenue forecast",
    "Which location has the best retention?",
  ],
  insights: [
    "Suggest a win-back campaign",
    "What interventions are working?",
    "How can we improve Student plan retention?",
  ],
  payments: [
    "Show me failed payments",
    "Revenue trends this quarter",
    "Which plans generate the most revenue?",
  ],
};

export function CopilotSpotlight({ open, onClose }: CopilotSpotlightProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const copilotContext = useGymStore((s) => s.copilotContext);
  const interventions = useGymStore((s) => s.interventions);

  const pendingCount = interventions.filter(
    (i) => i.status === "recommended",
  ).length;

  const suggestions = contextSuggestions[copilotContext.page] ?? contextSuggestions["dashboard"] ?? [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResponse("");
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setLoading(true);
      setResponse("");

      const lower = text.toLowerCase();

      // Try to stream from API
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: text }],
            context: `Page: ${copilotContext.page}. ${pendingCount} pending interventions.`,
          }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data) as { text?: string };
                  if (parsed.text) {
                    setResponse((prev) => prev + parsed.text);
                  }
                } catch {
                  // skip parse errors
                }
              }
            }
          }

          setLoading(false);
          return;
        }
      } catch {
        // Fall through to canned responses
      }

      // Canned response fallback
      let canned = "";
      if (lower.includes("churn") || lower.includes("risk") || lower.includes("attention"))
        canned = aiCannedResponses["churn"] ?? "";
      else if (lower.includes("revenue") || lower.includes("forecast"))
        canned = aiCannedResponses["revenue"] ?? "";
      else if (lower.includes("retention") || lower.includes("trend") || lower.includes("improv"))
        canned = aiCannedResponses["retention"] ?? "";
      else if (lower.includes("plan") || lower.includes("compare"))
        canned = aiCannedResponses["plan"] ?? "";
      else if (lower.includes("campaign") || lower.includes("win-back"))
        canned = aiCannedResponses["campaign"] ?? "";
      else
        canned = aiCannedResponses["help"] ?? "I can help with churn prediction, revenue analysis, and campaign design. What would you like to explore?";

      // Simulate streaming
      for (let i = 0; i < canned.length; i += 3) {
        await new Promise((r) => setTimeout(r, 8));
        setResponse(canned.slice(0, i + 3));
      }
      setResponse(canned);
      setLoading(false);
    },
    [copilotContext.page, pendingCount],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(query);
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Spotlight modal */}
          <motion.div
            className="fixed left-1/2 top-[15%] z-50 w-[90vw] max-w-2xl -translate-x-1/2 tablet:left-[calc(50%+7.5rem)]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="overflow-hidden rounded-2xl border border-peec-border-light bg-white shadow-2xl">
              {/* Context line */}
              <div className="flex items-center justify-between border-b border-peec-border-light/50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-peec-dark" />
                  <span className="text-2xs text-peec-text-muted">
                    Viewing: <span className="capitalize">{copilotContext.page}</span>
                    {pendingCount > 0 && ` | ${pendingCount} actions pending`}
                  </span>
                </div>
                <button type="button" onClick={onClose} className="rounded p-0.5 text-peec-text-muted hover:bg-stone-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Input */}
              <div className="px-4 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your gym..."
                  className="w-full bg-transparent text-sm text-peec-dark outline-none placeholder:text-peec-text-muted"
                />
              </div>

              {/* Suggestions (shown when empty) */}
              {!response && !loading && (
                <div className="border-t border-peec-border-light/50 px-4 py-3">
                  <p className="mb-2 text-2xs text-peec-text-muted">Suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setQuery(s);
                          void handleSubmit(s);
                        }}
                        className="rounded-full border border-peec-border-light bg-stone-50 px-3 py-1 text-2xs text-peec-text-secondary transition-colors hover:bg-stone-100"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Response area */}
              {(response || loading) && (
                <div className="max-h-80 overflow-y-auto border-t border-peec-border-light/50 px-4 py-3">
                  {loading && !response && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-stone-400" />
                      <span className="text-xs text-peec-text-muted">Thinking...</span>
                    </div>
                  )}
                  {response && (
                    <div className="prose prose-sm prose-stone max-w-none text-xs leading-relaxed text-peec-text-secondary">
                      {response.split("\n").map((line, i) => (
                        <p key={i} className={line.trim() === "" ? "h-2" : ""}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                            part.startsWith("**") && part.endsWith("**")
                              ? <strong key={j}>{part.slice(2, -2)}</strong>
                              : part,
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-peec-border-light/50 px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs text-peec-text-muted">
                    Press <kbd className="rounded border border-peec-border-light bg-stone-50 px-1 py-0.5 text-2xs">Enter</kbd> to ask
                  </span>
                  <span className="text-2xs text-peec-text-muted">
                    <kbd className="rounded border border-peec-border-light bg-stone-50 px-1 py-0.5 text-2xs">Esc</kbd> to close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
