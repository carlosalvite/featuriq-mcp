/**
 * Per-request Bearer token validation.
 *
 * Supports two token types:
 *
 *   1. OAuth JWT (issued by Featuriq's OAuth server)
 *      Verified locally using FEATURIQ_JWT_SECRET when set.
 *      Falls back to GET /v1/me if local verification fails or secret is missing.
 *
 *   2. API key (starts with "featuriq_")
 *      Validated by calling GET /v1/me on the Featuriq API.
 *
 * Env vars:
 *   FEATURIQ_JWT_SECRET — optional. When set and matching Feed-Flow's JWT_SECRET,
 *                         enables offline JWT validation (faster, no network call).
 */
import jwt from "jsonwebtoken";
const BEARER_PREFIX = "Bearer ";
const JWT_SECRET = process.env.FEATURIQ_JWT_SECRET;
export class AuthError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AuthError";
    }
}
/**
 * Extracts and validates the Bearer token from an Authorization header.
 *
 * OAuth JWTs are verified locally (no network).
 * API keys are validated via GET /v1/me.
 */
export async function validateBearerToken(authorizationHeader, featuriqBaseUrl) {
    if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
        throw new AuthError(401, "Missing Authorization header. " +
            "Provide your Featuriq OAuth token or API key as: Authorization: Bearer <token>");
    }
    const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();
    if (!token) {
        throw new AuthError(401, "Empty Bearer token.");
    }
    // ── OAuth JWT path ────────────────────────────────────────────────────────
    if (!token.startsWith("featuriq_")) {
        // Fast path: verify locally if FEATURIQ_JWT_SECRET is configured and matches.
        if (JWT_SECRET) {
            try {
                const payload = jwt.verify(token, JWT_SECRET);
                if (payload.type !== "oauth" || !payload.workspaceId) {
                    throw new AuthError(401, "Invalid token: not a Featuriq OAuth token.");
                }
                process.stderr.write(`[featuriq-mcp] auth: JWT verified locally OK (workspace=${payload.workspaceId})\n`);
                return { token };
            }
            catch (err) {
                if (err instanceof AuthError)
                    throw err;
                const reason = err instanceof Error ? err.message : String(err);
                process.stderr.write(`[featuriq-mcp] auth: local JWT verify failed (${reason}), falling back to API\n`);
                // Fall through to API validation — /v1/me accepts OAuth JWTs too.
            }
        }
        // Slow path: validate via API (handles secret mismatch and missing FEATURIQ_JWT_SECRET).
        return validateViaApi(token, featuriqBaseUrl);
    }
    // ── API key path: validate via GET /v1/me ─────────────────────────────────
    return validateViaApi(token, featuriqBaseUrl);
}
async function validateViaApi(token, featuriqBaseUrl) {
    let response;
    try {
        response = await fetch(`${featuriqBaseUrl}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
    catch (err) {
        // Network failure (DNS, timeout, etc.) — surface a clear error
        const detail = err instanceof Error ? err.message : String(err);
        throw new AuthError(503, `Cannot reach Featuriq API (${featuriqBaseUrl}/me): ${detail}. ` +
            "Set FEATURIQ_JWT_SECRET to enable offline JWT validation.");
    }
    if (!response.ok) {
        throw new AuthError(401, "Invalid or expired Featuriq token.");
    }
    return { token };
}
//# sourceMappingURL=auth.js.map