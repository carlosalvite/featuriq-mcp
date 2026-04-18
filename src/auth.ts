/**
 * Per-request Bearer token validation.
 *
 * Supports two token types:
 *
 *   1. OAuth JWT (issued by Featuriq's OAuth server)
 *      Verified locally using FEATURIQ_JWT_SECRET — no network call needed.
 *      This avoids the "fetch failed" error when Railway can't reach featuriq.io.
 *
 *   2. API key (starts with "featuriq_")
 *      Validated by calling GET /v1/me on the Featuriq API.
 *
 * Env vars:
 *   FEATURIQ_JWT_SECRET — must match the JWT_SECRET in the Feed-Flow deployment.
 *                         Required for OAuth token validation without a network call.
 */

import jwt from "jsonwebtoken";

const BEARER_PREFIX = "Bearer ";

// Set FEATURIQ_JWT_SECRET to the same value as JWT_SECRET in your Feed-Flow deployment.
const JWT_SECRET = process.env.FEATURIQ_JWT_SECRET;

export interface TokenInfo {
  token: string;
}

export class AuthError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Extracts and validates the Bearer token from an Authorization header.
 *
 * OAuth JWTs are verified locally (no network).
 * API keys are validated via GET /v1/me.
 */
export async function validateBearerToken(
  authorizationHeader: string | undefined,
  featuriqBaseUrl: string
): Promise<TokenInfo> {
  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    throw new AuthError(
      401,
      "Missing Authorization header. " +
        "Provide your Featuriq OAuth token or API key as: Authorization: Bearer <token>"
    );
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();

  if (!token) {
    throw new AuthError(401, "Empty Bearer token.");
  }

  // ── OAuth JWT path: validate locally, no network needed ──────────────────
  if (!token.startsWith("featuriq_")) {
    process.stderr.write(`[featuriq-mcp] auth: JWT token received, JWT_SECRET set=${!!JWT_SECRET}\n`);
    if (JWT_SECRET) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as {
          workspaceId?: string;
          type?: string;
        };
        process.stderr.write(`[featuriq-mcp] auth: JWT verified OK, type=${payload.type} workspace=${payload.workspaceId}\n`);
        if (payload.type !== "oauth" || !payload.workspaceId) {
          throw new AuthError(401, "Invalid token: not a Featuriq OAuth token.");
        }
        return { token };
      } catch (err) {
        if (err instanceof AuthError) throw err;
        const reason = err instanceof Error ? err.message : String(err);
        process.stderr.write(`[featuriq-mcp] auth: JWT verify failed: ${reason}\n`);
        throw new AuthError(401, "Invalid or expired OAuth token.");
      }
    }

    // No JWT_SECRET configured — fall back to API call
    return validateViaApi(token, featuriqBaseUrl);
  }

  // ── API key path: validate via GET /v1/me ─────────────────────────────────
  return validateViaApi(token, featuriqBaseUrl);
}

async function validateViaApi(token: string, featuriqBaseUrl: string): Promise<TokenInfo> {
  let response: Response;
  try {
    response = await fetch(`${featuriqBaseUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    // Network failure (DNS, timeout, etc.) — surface a clear error
    const detail = err instanceof Error ? err.message : String(err);
    throw new AuthError(
      503,
      `Cannot reach Featuriq API (${featuriqBaseUrl}/me): ${detail}. ` +
        "Set FEATURIQ_JWT_SECRET to enable offline JWT validation."
    );
  }

  if (!response.ok) {
    throw new AuthError(401, "Invalid or expired Featuriq token.");
  }

  return { token };
}
