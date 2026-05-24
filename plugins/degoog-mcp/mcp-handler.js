// MCP protocol message handlers

export const TOOL_SCHEMA = {
  name: "search",
  description: "Search using degoog search aggregator",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query (required)" },
      page: { type: "number", description: "Page number (default: 1)" },
      time: {
        type: "string",
        description: "Time range filter: any, hour, day, week, month, year, custom",
      },
      type: {
        type: "string",
        description: "Search type: web, images, news, files",
      },
      lang: {
        type: "string",
        description: "ISO 639-1 language code (e.g. en, de, fr, es, zh)",
      },
    },
    required: ["query"],
  },
};

export async function handleRequest(message, searchFn) {
  const { id, method, params } = message;

  if (id === undefined || id === null) {
    return null;
  }

  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "degoog-mcp", version: "0.1.0" },
          },
        };

      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: { tools: [TOOL_SCHEMA] },
        };

      case "tools/call":
        if (params?.name === "search") {
          const content = await searchFn(params.arguments || {});
          return { jsonrpc: "2.0", id, result: { content } };
        }
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Unknown tool: ${params?.name}` },
        };

      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
    }
  } catch (err) {
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: err.message || "Internal error" },
    };
  }
}
