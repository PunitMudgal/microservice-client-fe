import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { NextRequest } from "next/server";

export const maxDuration = 30;

const systemPrompt = `You are a helpful restaurant assistant for Nesta Foods. You help customers with:
- Browsing and searching the menu
- Checking order status and details
- Answering questions about food items, prices, and availability

Rules:
- Keep responses short and concise (1-3 sentences)
- Only answer questions related to the restaurant, menu, and orders
- If asked something off-topic, politely redirect to restaurant-related topics
- Use the tools provided to fetch real-time data
- Be friendly and professional`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const cookie = req.headers.get("cookie") || "";

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const transport = new StdioClientTransport({
    command: "bun",
    args: ["run", "src/mcp/server.ts"],
    env: {
      ...Object.fromEntries(
        Object.entries(process.env).filter((e): e is [string, string] => e[1] != null),
      ),
      AUTH_COOKIE: cookie,
    },
  });

  const mcpClient = new Client({ name: "chat-client", version: "1.0.0" });
  await mcpClient.connect(transport);

  const mcpTools = await mcpClient.listTools();

  const tools: Record<string, { description: string; inputSchema: object; execute: (args: Record<string, unknown>) => Promise<unknown> }> = {};

  for (const t of mcpTools.tools) {
    tools[t.name] = {
      description: t.description ?? "",
      inputSchema: t.inputSchema as object,
      execute: async (args: Record<string, unknown>) => {
        const result = await mcpClient.callTool({ name: t.name, arguments: args });
        return result.content;
      },
    };
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    messages,
    tools: tools as never,
    toolsContext: {} as never,
  });

  return result.toTextStreamResponse();
}
