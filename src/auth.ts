/**
 * Per-request Bearer token validation.
 *
 * Each MCP request carries the user's Featuriq OAuth access token (or API key)
 * as a standard Bearer token. We extract it here and — once /v1/me exists —
 * validate it against the Featuriq API before the request proceeds.
 */

const BEARER_PREFIX = "Bearer ";

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
 * Validation flow (once Featuriq API is live):
 *   GET /v1/me  →  200 = valid token, 401 = reject
 *
 * For now: any non-empty token is accepted here; invalid tokens will fail
 * on the first real Featuriq API call with a clear error from the API.
 */
export async function validateBearerToken(
  authorizationHeader: string | undefined,
  featuriqBaseUrl: string
): Promise<TokenInfo> {
  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    throw new AuthError(
      401,
      "Missing Authorization header. " +
        "Provide your Featuriq API key as: Authorization: Bearer <key>"
    );
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();

  if (!token) {
    throw new AuthError(401, "Empty Bearer token.");
  }

  // TODO: validate token against Featuriq API once /v1/me is implemented
  // const response = await fetch(`${featuriqBaseUrl}/me`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!response.ok) {
  //   throw new AuthError(401, "Invalid or expired Featuriq API key.");
  // }

  void featuriqBaseUrl; // remove once the fetch above is wired up

  return { token };
}
