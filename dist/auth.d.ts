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