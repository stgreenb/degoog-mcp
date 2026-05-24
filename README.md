# degoog-mcp

An [MCP](https://modelcontextprotocol.io) (Model Context Protocol) plugin for [degoog](https://github.com/degoog-org/degoog). Exposes degoog's multi-engine search as an MCP tool for AI clients like opencode, Claude Desktop, Cursor, etc.

## Features

- **Search across multiple engines**: Aggregates results from Google, DuckDuckGo, Bing, Brave, and more
- **Rich results**: Title, URL, snippet, source provenance (which engines contributed), relevance score, and related search suggestions
- **Flexible parameters**: `query` (required), `page`, `time` (any/hour/day/week/month/year/custom), `type` (web/images/news/files), `lang` (ISO 639-1)
- **SSE transport**: Standard MCP Server-Sent Events transport

## Installation

Place the plugin in degoog's `data/plugins/degoog-mcp/` directory:

```bash
git clone https://github.com/stgreenb/degoog-mcp.git /path/to/degoog/data/plugins/degoog-mcp
```

Restart your degoog instance. The MCP endpoint will be available at:

```
http://<degoog-host>:4321/api/plugin/degoog-mcp/mcp
```

## Usage

### MCP Tool: `search`

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `query` | string | yes | Search query |
| `page` | number | no | Page number (default: 1, max: 10) |
| `time` | string | no | Time range: `any`, `hour`, `day`, `week`, `month`, `year`, `custom` |
| `type` | string | no | Search type: `web`, `images`, `news`, `files` |
| `lang` | string | no | ISO 639-1 language code (e.g. `en`, `de`, `fr`) |

### Example (opencode config)

```jsonc
{
  "mcp": {
    "degoog": {
      "type": "remote",
      "url": "http://192.168.1.196:4321/api/plugin/degoog-mcp/mcp",
      "enabled": true
    }
  }
}
```

## How It Works

1. AI client connects via SSE to the MCP endpoint
2. Client calls `tools/list` → receives the `search` tool schema
3. Client calls `tools/call` with `{"name": "search", "arguments": {"query": "..."}}`
4. Plugin proxies the request to degoog's internal `/api/search`
5. Results are formatted as Markdown with linked titles, snippets, source attribution, and related searches

## Why degoog-mcp?

Unlike single-source search APIs (like Exa), degoog aggregates across multiple search engines, giving you broader coverage, source transparency, and privacy-friendly self-hosting.

## License

MIT
