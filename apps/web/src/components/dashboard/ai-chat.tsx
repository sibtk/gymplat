"use client";

import { ArrowUp, MessageSquareText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { aiCannedResponses, aiConversationStarters } from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── Helpers ─────────────────────────────────────────────────────

function matchResponse(input: string): string {
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
  if (lower.includes("help") || lower.includes("what can"))
    return aiCannedResponses["help"] ?? "";
  return aiCannedResponses["help"] ?? "";
}

// ─── Component ───────────────────────────────────────────────────

export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedContent]);

  const [thinking, setThinking] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim() || streaming) return;

    idCounter.current += 1;
    const userMsg: ChatMessage = {
      id: `msg-${idCounter.current}`,
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);
    setThinking(true);
    setStreamedContent("");

    const fullResponse = matchResponse(text);

    // Show thinking indicator, then stream
    setTimeout(() => {
      setThinking(false);
      let charIdx = 0;

      const interval = setInterval(() => {
        charIdx += 1;
        if (charIdx <= fullResponse.length) {
          setStreamedContent(fullResponse.slice(0, charIdx));
        } else {
          clearInterval(interval);
          idCounter.current += 1;
          const aiMsg: ChatMessage = {
            id: `msg-${idCounter.current}`,
            role: "assistant",
            content: fullResponse,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setStreamedContent("");
          setStreaming(false);
        }
      }, 25);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="rounded-xl border border-peec-border-light bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-peec-border-light px-5 py-3">
        <MessageSquareText className="h-4 w-4 text-peec-text-muted" />
        <span className="text-xs font-medium text-peec-text-muted">AI Assistant</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-2xs text-green-600">Online</span>
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-[420px] overflow-y-auto p-5">
        {messages.length === 0 && !streaming && (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="mb-4 text-sm text-peec-text-muted">
              Ask me anything about your gym
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {aiConversationStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="rounded-full border border-peec-border-light px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50 hover:text-peec-dark"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-peec-dark text-white"
                    : "bg-stone-50 text-peec-dark"
                }`}
              >
                <MessageContent content={msg.content} isUser={msg.role === "user"} />
              </div>
            </div>
          ))}

          {/* Thinking / Streaming message */}
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
            onClick={() => sendMessage(input)}
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

// ─── Message Content Renderer ────────────────────────────────────
// Renders markdown-like content with tables and bold text

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) return <>{content}</>;

  // Split content by lines and render
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] as string;

    // Table detection
    if (line.includes("|") && (lines[i + 1]?.includes("---") || lines[i + 1]?.includes("---|"))) {
      const tableLines: string[] = [];
      while (i < lines.length && (lines[i] as string).includes("|")) {
        tableLines.push(lines[i] as string);
        i += 1;
      }
      elements.push(<InlineTable key={i} lines={tableLines} />);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
      i += 1;
      continue;
    }

    // Regular text with bold support
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

  // Skip separator line (index 1)
  const rows = lines.slice(2).map(parseRow);

  return (
    <div className="my-2 overflow-x-auto rounded-lg border border-peec-border-light/50">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-stone-100/50">
            {headers.map((h, i) => (
              <th key={i} className="px-2 py-1.5 text-left font-medium text-peec-dark">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-t border-peec-border-light/30">
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-1.5 text-peec-text-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
