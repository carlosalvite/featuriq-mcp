/**
 * Featuriq REST API client.
 *
 * All methods are typed against the expected Featuriq API shapes.
 * Implementations currently throw "Not implemented" — wire up real
 * fetch calls once the API endpoints are finalized.
 */
export interface FeaturiqClientConfig {
    apiKey: string;
    baseUrl: string;
}
export declare function getConfig(): FeaturiqClientConfig;
export type FeatureStatus = "planned" | "in_progress" | "shipped" | "closed";
export interface Tag {
    id: string;
    name: string;
    color: string;
}
export interface FeatureRequest {
    id: string;
    title: string;
    description: string;
    status: FeatureStatus;
    vote_count: number;
    revenue_impact: number | null;
    tags: Tag[];
    created_at: string;
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
    is_ai_question: boolean;
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
    message_preview: string;
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
    include_internal?: boolean;
}
export interface GetTagsParams {
}
export interface SetFeatureTagsParams {
    feature_id: string;
    tag_ids: string[];
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
export declare class FeaturiqClient {
    private readonly apiKey;
    private readonly baseUrl;
    constructor(config: FeaturiqClientConfig);
    private request;
    /** Returns the top feature requests sorted by votes or revenue impact. */
    getTopRequests(params: GetTopRequestsParams): Promise<FeatureRequest[]>;
    /** Semantic search across all feedback posts. */
    searchFeedback(params: SearchFeedbackParams): Promise<FeedbackPost[]>;
    /** Returns all feedback and comments for a specific feature request. */
    getFeatureFeedback(params: GetFeatureFeedbackParams): Promise<{
        feature: FeatureRequest;
        comments: FeatureComment[];
    }>;
    /** Returns all workspace tags. */
    getTags(_params?: GetTagsParams): Promise<Tag[]>;
    /** Replaces the tags assigned to a feature (pass an empty array to clear). */
    setFeatureTags(params: SetFeatureTagsParams): Promise<Tag[]>;
    /** Returns an AI-prioritized list of features scored by selected factors. */
    getPrioritization(params: GetPrioritizationParams): Promise<PrioritizedFeature[]>;
    /** Updates the status of a feature request. */
    updateFeatureStatus(params: UpdateFeatureStatusParams): Promise<FeatureRequest>;
    /** Sends a personalized notification to everyone who requested a feature. */
    notifyRequesters(params: NotifyRequestersParams): Promise<NotifyResult>;
    /** Creates a new feedback post on a board. */
    createPost(params: CreatePostParams): Promise<FeedbackPost>;
    /** Returns the current roadmap grouped by status. */
    getRoadmap(): Promise<RoadmapGroup>;
    /** Returns the N most recently shipped features with release notes. */
    getChangelog(params: GetChangelogParams): Promise<ChangelogEntry[]>;
}
//# sourceMappingURL=api-client.d.ts.map