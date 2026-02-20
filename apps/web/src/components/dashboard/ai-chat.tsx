"use client";

import { AlertTriangle, ArrowUp, MessageSquareText, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { aiCannedResponses, aiConversationStarters } from "@/lib/mock-data";
import { buildCopilotContext } from "@/lib/retention/copilot-context";
import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

import type { ChatMessage } from "@/lib/types";

// ─── Helpers ────────────────────────────────────────────────────

function matchCannedResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("churn") || lower.includes("risk") || lower.includes("at-risk") || lower.includes("likely"))
    return aiCannedResponses["churn"] ?? "";
  if (lower.includes("revenue") || lower.includes("money") || lower.includes("trend") || lower.includes("quarter"))
    return aiCannedResponses["revenue"] ?? "";
  if (lower.includes("retention") || lower.includes("improve") || lower.includes("driving") || lower.includes("why"))
    return aiCannedResponses["retention"] ?? "";
  if (lower.includes("plan") || lower.includes("compare") || lower.includes("performance"))
    return aiCannedResponses["plan"] ?? "";
  if (lower.includes("campaign") || lower.includes("win-back") || lower.includes("suggest"))
    return aiCannedResponses["campaign"] ?? "";
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return aiCannedResponses["hello"] ?? "";
  return aiCannedResponses["help"] ?? "";
}

function buildRetentionContext(): string {
  const store = useGymStore.getState();
  return buildCopilotContext({
    page: store.copilotContext.page,
    memberId: store.copilotContext.memberId,
    members: store.members,
    riskAssessments: store.riskAssessments,
    interventions: store.interventions,
    gymHealthScore: store.gymHealthScore,
    plans: store.plans,
    transactions: store.transactions,
  });
}

// ─── Component ──────────────────────────────────────────────────

export function AiChat() {
  const chatMessages = useGymStore((s) => s.chatMessages);
  const addChatMessage = useGymStore((s) => s.addChatMessage);
  const clearChatMessages = useGymStore((s) => s.clearChatMessages);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [thinking, setThinking] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, streamedContent]);

  const streamFromApi = useCallback(async (userText: string, allMessages: ChatMessage[]) => {
    const retentionContext = buildRetentionContext();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          retentionContext,
        }),
        signal: controller.signal,
      });

      if (response.status === 503) {
        // API key not configured — use fallback
        setFallbackMode(true);
        return matchCannedResponse(userText);
      }

      if (!response.ok) {
        setFallbackMode(true);
        return matchCannedResponse(userText);
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      if (!reader) return matchCannedResponse(userText);

      const decoder = new TextDecoder();
      let fullContent = "";
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
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as { text: string };
              fullContent += parsed.text;
              setStreamedContent(fullContent);
            } catch {
              // Skip
            }
          }
        }
      }

      return fullContent;
    } catch {
      setFallbackMode(true);
      return matchCannedResponse(userText);
    }
  }, []);

  const streamCannedResponse = useCallback((text: string): Promise<string> => {
    const fullResponse = matchCannedResponse(text);
    return new Promise((resolve) => {
      let charIdx = 0;
      const interval = setInterval(() => {
        charIdx += 1;
        if (charIdx <= fullResponse.length) {
          setStreamedContent(fullResponse.slice(0, charIdx));
        } else {
          clearInterval(interval);
          resolve(fullResponse);
        }
      }, 15);
    });
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: ChatMessage = {
      id: generateId("msg"),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMsg);
    setInput("");
    setStreaming(true);
    setThinking(true);
    setStreamedContent("");

    const allMessages = [...chatMessages, userMsg];

    // Small delay for thinking indicator
    await new Promise((r) => setTimeout(r, 400));
    setThinking(false);

    let fullContent: string;
    if (fallbackMode) {
      fullContent = await streamCannedResponse(text);
    } else {
      fullContent = await streamFromApi(text, allMessages);
    }

    if (fullContent) {
      addChatMessage({
        id: generateId("msg"),
        role: "assistant",
        content: fullContent,
        timestamp: new Date().toISOString(),
      });
    }

    setStreamedContent("");
    setStreaming(false);
  }, [streaming, chatMessages, addChatMessage, fallbackMode, streamFromApi, streamCannedResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <div className="rounded-xl border border-peec-border-light bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-peec-border-light px-5 py-3">
        <MessageSquareText className="h-4 w-4 text-peec-text-muted" />
        <span className="text-xs font-medium text-peec-text-muted">AI Copilot</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-2xs text-green-600">Online</span>
        </span>
        {chatMessages.length > 0 && (
          <button
            type="button"
            onClick={() => clearChatMessages()}
            className="ml-2 rounded p-1 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
            title="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Fallback banner */}
      {fallbackMode && (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-5 py-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-2xs text-amber-700">
            Configure ANTHROPIC_API_KEY for real AI responses
          </span>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="h-[420px] overflow-y-auto p-5">
        {chatMessages.length === 0 && !streaming && (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="mb-4 text-sm text-peec-text-muted">Ask me anything about your gym</p>
            <div className="flex flex-wrap justify-center gap-2">
              {aiConversationStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => void sendMessage(starter)}
                  className="rounded-full border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50 hover:text-peec-dark"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user" ? "bg-peec-dark text-white" : "bg-stone-50 text-peec-dark"
              }`}>
                <MessageContent content={msg.content} isUser={msg.role === "user"} />
              </div>
            </div>
          ))}

          {streaming && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl bg-stone-50 px-4 py-3 text-sm text-peec-dark">
                {thinking ? (
                  <span className="inline-flex items-center gap-1 text-peec-text-muted">
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-peec-text-muted [animation-delay:0ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-peec-text-muted [animation-delay:150ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-peec-text-muted [animation-delay:300ms]" />
                  </span>
                ) : (
                  <>
                    <MessageContent content={streamedContent} isUser={false} />
                    <span className="animate-blink ml-0.5 inline-block h-4 w-[2px] bg-peec-dark align-middle" />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-peec-border-light px-5 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about retention, revenue, members..."
            disabled={streaming}
            className="flex-1 bg-transparent text-sm text-peec-dark placeholder:text-peec-text-muted focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || streaming}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-peec-dark text-white transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Content Renderer ───────────────────────────────────

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) return <>{content}</>;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] as string;

    if (line.includes("|") && (lines[i + 1]?.includes("---") || lines[i + 1]?.includes("---|"))) {
      const tableLines: string[] = [];
      while (i < lines.length && (lines[i] as string).includes("|")) {
        tableLines.push(lines[i] as string);
        i += 1;
      }
      elements.push(<InlineTable key={i} lines={tableLines} />);
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
      i += 1;
      continue;
    }

    elements.push(
      <p key={i} className="leading-relaxed">
        {renderBold(line)}
      </p>,
    );
    i += 1;
  }

  return <>{elements}</>;
}

function renderBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function InlineTable({ lines }: { lines: string[] }) {
  const parseRow = (line: string) =>
    line.split("|").map((cell) => cell.trim()).filter(Boolean);

  const headerLine = lines[0];
  if (!headerLine) return null;
  const headers = parseRow(headerLine);
  const rows = lines.slice(2).map(parseRow);

  return (
    <div className="my-2 overflow-x-auto rounded-lg border border-peec-border-light/50">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-stone-100/50">
            {headers.map((h, i) => (
              <th key={i} className="px-2 py-1.5 text-left font-medium text-peec-dark">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-t border-peec-border-light/30">
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-1.5 text-peec-text-secondary">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
