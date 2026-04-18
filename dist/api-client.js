/**
 * Featuriq REST API client.
 *
 * All methods are typed against the expected Featuriq API shapes.
 * Implementations currently throw "Not implemented" — wire up real
 * fetch calls once the API endpoints are finalized.
 */
export function getConfig() {
    const apiKey = process.env.FEATURIQ_API_KEY;
    if (!apiKey) {
        throw new Error("FEATURIQ_API_KEY environment variable is required. " +
            "Get your API key at https://featuriq.io/settings/api");
    }
    return {
        apiKey,
        baseUrl: process.env.FEATURIQ_API_URL ?? "https://featuriq.io/v1",
    };
}
// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
export class FeaturiqClient {
    apiKey;
    baseUrl;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;
    }
    // ---- helpers (will be used when real endpoints are wired up) -------------
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async request(method, path, body) {
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const text = await response.text().catch(() => "");
            throw new Error(`Featuriq API error ${response.status} ${response.statusText}: ${text}`);
        }
        return response.json();
    }
    // ---- Tools ---------------------------------------------------------------
    /** Returns the top feature requests sorted by votes or revenue impact. */
    async getTopRequests(params) {
        return this.request("GET", `/features?sort_by=${params.sort_by ?? "votes"}&limit=${params.limit ?? 10}`);
    }
    /** Semantic search across all feedback posts. */
    async searchFeedback(params) {
        return this.request("GET", `/feedback/search?q=${encodeURIComponent(params.query)}&limit=${params.limit ?? 10}`);
    }
    /** Returns all feedback and comments for a specific feature request. */
    async getFeatureFeedback(params) {
        const qs = params.include_internal ? "?include_internal=true" : "";
        return this.request("GET", `/features/${params.feature_id}/feedback${qs}`);
    }
    /** Returns all workspace tags. */
    async getTags(_params) {
        return this.request("GET", "/tags");
    }
    /** Replaces the tags assigned to a feature (pass an empty array to clear). */
    async setFeatureTags(params) {
        return this.request("PUT", `/features/${params.feature_id}/tags`, { tag_ids: params.tag_ids });
    }
    /** Returns an AI-prioritized list of features scored by selected factors. */
    async getPrioritization(params) {
        return this.request("POST", "/features/prioritize", {
            factors: params.factors,
            limit: params.limit ?? 10,
        });
    }
    /** Updates the status of a feature request. */
    async updateFeatureStatus(params) {
        return this.request("PATCH", `/features/${params.feature_id}`, { status: params.status });
    }
    /** Sends a personalized notification to everyone who requested a feature. */
    async notifyRequesters(params) {
        return this.request("POST", `/features/${params.feature_id}/notify`, { message: params.message });
    }
    /** Creates a new feedback post on a board. */
    async createPost(params) {
        return this.request("POST", `/boards/${params.board_id}/posts`, {
            title: params.title,
            description: params.description,
        });
    }
    // ---- Resources -----------------------------------------------------------
    /** Returns the current roadmap grouped by status. */
    async getRoadmap() {
        return this.request("GET", "/roadmap");
    }
    /** Returns the N most recently shipped features with release notes. */
    async getChangelog(params) {
        return this.request("GET", `/changelog?limit=${params.limit ?? 20}`);
    }
}
//# sourceMappingURL=api-client.js.map