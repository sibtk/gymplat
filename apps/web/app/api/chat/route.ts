import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

interface ChatRequestMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatRequestMessage[];
  memberContext?: string;
  retentionContext?: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 },
    );
  }

  const body = (await request.json()) as ChatRequestBody;
  const { messages, memberContext, retentionContext } = body;

  const systemPrompt = `You are the AI Copilot for Iron Temple Fitness, a premium gym retention intelligence platform. You help gym owners and managers with:

- Analyzing member behavior and identifying churn risks using the retention engine
- Revenue analysis, forecasting, and impact of retention efforts
- Campaign suggestions for re-engagement, win-back, and upsell
- Interpreting risk scores and recommending interventions
- Class scheduling optimization and member engagement
- Understanding the gym health score and its components

You have access to real-time retention engine data including risk assessments, intervention history, and gym health metrics.

${retentionContext ? `\nRetention Engine Context:\n${retentionContext}` : ""}

${memberContext ? `\nAdditional Context:\n${memberContext}` : ""}

Guidelines:
- Keep responses concise and actionable
- Use markdown tables when presenting comparative data
- Reference specific members by name when discussing risk
- Suggest specific interventions with expected impact
- Be proactive — surface insights the user hasn't asked about
- When discussing risk scores, explain the contributing factors
- Format numbers with proper units ($, %, etc.)`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${response.status}`, detail: errorText },
        { status: response.status },
      );
    }

    // Stream the response through
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
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
                  const parsed = JSON.parse(data) as {
                    type: string;
                    delta?: { type: string; text?: string };
                  };
                  if (
                    parsed.type === "content_block_delta" &&
                    parsed.delta?.type === "text_delta" &&
                    parsed.delta.text
                  ) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`),
                    );
                  }
                  if (parsed.type === "message_stop") {
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
