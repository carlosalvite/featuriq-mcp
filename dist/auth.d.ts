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
export interface TokenInfo {
    token: string;
}
export declare class AuthError extends Error {
    readonly statusCode: number;
    constructor(statusCode: number, message: string);
}
/**
 * Extracts and validates the Bearer token from an Authorization header.
 *
 * OAuth JWTs are verified locally (no network).
 * API keys are validated via GET /v1/me.
 */
export declare function validateBearerToken(authorizationHeader: string | undefined, featuriqBaseUrl: string): Promise<TokenInfo>;
//# sourceMappingURL=auth.d.ts.map