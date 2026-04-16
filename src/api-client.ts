/**
 * Featuriq REST API client.
 *
 * All methods are typed against the expected Featuriq API shapes.
 * Implementations currently throw "Not implemented" — wire up real
 * fetch calls once the API endpoints are finalized.
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface FeaturiqClientConfig {
  apiKey: string;
  baseUrl: string;
}

export function getConfig(): FeaturiqClientConfig {
  const apiKey = process.env.FEATURIQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "FEATURIQ_API_KEY environment variable is required. " +
        "Get your API key at https://featuriq.io/settings/api"
    );
  }
  return {
    apiKey,
    baseUrl: process.env.FEATURIQ_API_URL ?? "https://api.featuriq.io/v1",
  };
}

// ---------------------------------------------------------------------------
// Shared domain types
// ---------------------------------------------------------------------------

export type FeatureStatus = "planned" | "in_progress" | "shipped" | "closed";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  vote_count: number;
  revenue_impact: number | null; // USD, null if not available
  created_at: string; // ISO 8601
  updated_at: string;
  board_id: string;
  url: string;
}

export interface FeedbackPost {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  vote_count: number;
  status: FeatureStatus;
  created_at: string;
  url: string;
}

export interface FeatureComment {
  id: string;
  body: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  is_internal: boolean;
}

export interface PrioritizedFeature {
  feature: FeatureRequest;
  total_score: number;
  scores: {
    votes?: number;
    revenue?: number;
    effort?: number;
    strategic_fit?: number;
  };
  reasoning: string;
}

export interface NotifyResult {
  feature_id: string;
  notified_count: number;
  message_preview: string; // example of the personalized message sent
}

export interface RoadmapGroup {
  planned: FeatureRequest[];
  in_progress: FeatureRequest[];
  shipped: FeatureRequest[];
}

export interface ChangelogEntry {
  feature: FeatureRequest;
  shipped_at: string;
  release_notes: string | null;
}

// ---------------------------------------------------------------------------
// Request param types
// ---------------------------------------------------------------------------

export interface GetTopRequestsParams {
  limit?: number;
  sort_by?: "votes" | "revenue_impact";
}

export interface SearchFeedbackParams {
  query: string;
  limit?: number;
}

export interface GetFeatureFeedbackParams {
  feature_id: string;
}

export type PrioritizationFactor = "votes" | "revenue" | "effort" | "strategic_fit";

export interface GetPrioritizationParams {
  factors: PrioritizationFactor[];
  limit?: number;
}

export interface UpdateFeatureStatusParams {
  feature_id: string;
  status: FeatureStatus;
}

export interface NotifyRequestersParams {
  feature_id: string;
  message: string;
}

export interface CreatePostParams {
  board_id: string;
  title: string;
  description: string;
}

export interface GetChangelogParams {
  limit?: number;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class FeaturiqClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: FeaturiqClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  // ---- helpers (will be used when real endpoints are wired up) -------------

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async request<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
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
      throw new Error(
        `Featuriq API error ${response.status} ${response.statusText}: ${text}`
      );
    }

    return response.json() as Promise<T>;
  }

  // ---- Tools ---------------------------------------------------------------

  /** Returns the top feature requests sorted by votes or revenue impact. */
  async getTopRequests(params: GetTopRequestsParams): Promise<FeatureRequest[]> {
    // TODO: implement
    // return this.request<FeatureRequest[]>(
    //   "GET",
    //   `/features?sort_by=${params.sort_by ?? "votes"}&limit=${params.limit ?? 10}`
    // );
    void params;
    throw new Error("Not implemented");
  }

  /** Semantic search across all feedback posts. */
  async searchFeedback(params: SearchFeedbackParams): Promise<FeedbackPost[]> {
    // TODO: implement
    // return this.request<FeedbackPost[]>(
    //   "GET",
    //   `/feedback/search?q=${encodeURIComponent(params.query)}&limit=${params.limit ?? 10}`
    // );
    void params;
    throw new Error("Not implemented");
  }

  /** Returns all feedback and comments for a specific feature request. */
  async getFeatureFeedback(
    params: GetFeatureFeedbackParams
  ): Promise<{ feature: FeatureRequest; comments: FeatureComment[] }> {
    // TODO: implement
    // return this.request<{ feature: FeatureRequest; comments: FeatureComment[] }>(
    //   "GET",
    //   `/features/${params.feature_id}/feedback`
    // );
    void params;
    throw new Error("Not implemented");
  }

  /** Returns an AI-prioritized list of features scored by selected factors. */
  async getPrioritization(
    params: GetPrioritizationParams
  ): Promise<PrioritizedFeature[]> {
    // TODO: implement
    // return this.request<PrioritizedFeature[]>("POST", "/features/prioritize", {
    //   factors: params.factors,
    //   limit: params.limit ?? 10,
    // });
    void params;
    throw new Error("Not implemented");
  }

  /** Updates the status of a feature request. */
  async updateFeatureStatus(
    params: UpdateFeatureStatusParams
  ): Promise<FeatureRequest> {
    // TODO: implement
    // return this.request<FeatureRequest>(
    //   "PATCH",
    //   `/features/${params.feature_id}`,
    //   { status: params.status }
    // );
    void params;
    throw new Error("Not implemented");
  }

  /** Sends a personalized notification to everyone who requested a feature. */
  async notifyRequesters(params: NotifyRequestersParams): Promise<NotifyResult> {
    // TODO: implement
    // return this.request<NotifyResult>(
    //   "POST",
    //   `/features/${params.feature_id}/notify`,
    //   { message: params.message }
    // );
    void params;
    throw new Error("Not implemented");
  }

  /** Creates a new feedback post on a board. */
  async createPost(params: CreatePostParams): Promise<FeedbackPost> {
    // TODO: implement
    // return this.request<FeedbackPost>("POST", `/boards/${params.board_id}/posts`, {
    //   title: params.title,
    //   description: params.description,
    // });
    void params;
    throw new Error("Not implemented");
  }

  // ---- Resources -----------------------------------------------------------

  /** Returns the current roadmap grouped by status. */
  async getRoadmap(): Promise<RoadmapGroup> {
    // TODO: implement
    // return this.request<RoadmapGroup>("GET", "/roadmap");
    throw new Error("Not implemented");
  }

  /** Returns the N most recently shipped features with release notes. */
  async getChangelog(params: GetChangelogParams): Promise<ChangelogEntry[]> {
    // TODO: implement
    // return this.request<ChangelogEntry[]>(
    //   "GET",
    //   `/changelog?limit=${params.limit ?? 20}`
    // );
    void params;
    throw new Error("Not implemented");
  }
}
