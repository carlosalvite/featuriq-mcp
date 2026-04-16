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
 *   PORT              — HTTP port (Railway injects this automatically)
 *   FEATURIQ_API_URL  — Featuriq REST API base (default: https://api.featuriq.io/v1)
 *   FEATURIQ_APP_URL  — Featuriq app base for OAuth URLs (default: https://featuriq.io)
 */

import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { FeaturiqClient } from "./api-client.js";
import { validateBearerToken, AuthError } from "./auth.js";
import { createMcpServer } from "./register.js";

const PORT = parseInt(process.env.PORT ?? "3000", 10);
const FEATURIQ_API_URL = process.env.FEATURIQ_API_URL ?? "https://api.featuriq.io/v1";
const FEATURIQ_APP_URL = process.env.FEATURIQ_APP_URL ?? "https://featuriq.io";

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// Health check
// Railway uses this to confirm the service is up.
// ---------------------------------------------------------------------------

app.get("/health", (_req, res) => {
  res.json({ status: "ok", server: "featuriq-mcp", version: "0.1.0" });
});

// ---------------------------------------------------------------------------
// OAuth authorization server metadata
//
// MCP clients (Claude, Cursor, etc.) fetch this endpoint to discover where to
// send users for OAuth authorization. We point at Featuriq's OAuth server.
//
// Spec: https://datatracker.ietf.org/doc/html/rfc8414
// ---------------------------------------------------------------------------

app.get("/.well-known/oauth-authorization-server", (_req, res) => {
  res.json({
    issuer: FEATURIQ_APP_URL,
    authorization_endpoint: `${FEATURIQ_APP_URL}/oauth/authorize`,
    token_endpoint: `${FEATURIQ_APP_URL}/oauth/token`,
    registration_endpoint: `${FEATURIQ_APP_URL}/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: ["mcp:read", "mcp:write"],
  });
});

// ---------------------------------------------------------------------------
// MCP endpoint — POST /mcp
//
// Each request:
//   1. Validates the Bearer token (Featuriq OAuth access token or API key)
//   2. Creates a FeaturiqClient scoped to that token
//   3. Spins up a fresh McpServer with all tools + resources
//   4. Handles the MCP protocol exchange
//   5. Tears down — fully stateless
// ---------------------------------------------------------------------------

app.post("/mcp", async (req, res) => {
  try {
    const { token } = await validateBearerToken(
      req.headers.authorization,
      FEATURIQ_API_URL
    );

    const client = new FeaturiqClient({ apiKey: token, baseUrl: FEATURIQ_API_URL });
    const server = createMcpServer(client);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless — no persistent sessions needed
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[featuriq-mcp] request error: ${message}\n`);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Stateful GET/DELETE (SSE sessions) — not supported in stateless mode
app.all("/mcp", (_req, res) => {
  res
    .status(405)
    .set("Allow", "POST")
    .json({ error: "Only POST is supported on this endpoint." });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  process.stderr.write(
    `[featuriq-mcp] listening on port ${PORT}\n` +
    `[featuriq-mcp] MCP endpoint → http://localhost:${PORT}/mcp\n` +
    `[featuriq-mcp] OAuth metadata → http://localhost:${PORT}/.well-known/oauth-authorization-server\n`
  );
});
