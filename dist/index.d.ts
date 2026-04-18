#!/usr/bin/env node
/**
 * Featuriq MCP Server
 *
 * Runs an Express HTTP server on the MCP Streamable HTTP transport.
 * Deploy to Railway and point AI clients at: https://mcp.featuriq.io
 *
 * Design: stateless — each POST /mcp creates a fresh McpServer + transport,
 * scoped to the requesting user's Bearer token. No shared state between requests.
 *
 * Env vars:
 *   PORT                 — HTTP port (Railway injects this automatically)
 *   FEATURIQ_API_URL     — Featuriq REST API base (default: https://featuriq.io/v1)
 *   FEATURIQ_APP_URL     — Featuriq app base for OAuth URLs (default: https://featuriq.io)
 *   FEATURIQ_JWT_SECRET  — Must match JWT_SECRET in the Feed-Flow deployment.
 *                          Enables local JWT validation so the server works even
 *                          when Railway can't reach featuriq.io via fetch.
 */
export {};
//# sourceMappingURL=index.d.ts.map