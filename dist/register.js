/**
 * Creates and returns a fully configured McpServer instance.
 * Called once per HTTP request so each request gets its own FeaturiqClient
 * (and therefore its own auth token).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as getTopRequests from "./tools/get-top-requests.js";
import * as searchFeedback from "./tools/search-feedback.js";
import * as getFeatureFeedback from "./tools/get-feature-feedback.js";
import * as getPrioritization from "./tools/get-prioritization.js";
import * as updateFeatureStatus from "./tools/update-feature-status.js";
import * as notifyRequesters from "./tools/notify-requesters.js";
import * as createPost from "./tools/create-post.js";
import * as manageFeatureTags from "./tools/manage-feature-tags.js";
import * as roadmap from "./resources/roadmap.js";
import * as changelog from "./resources/changelog.js";
export function createMcpServer(client) {
    const server = new McpServer({ name: "featuriq-mcp", version: "0.1.0" });
    // ---- Tools ---------------------------------------------------------------
    server.tool(getTopRequests.name, getTopRequests.description, getTopRequests.inputSchema.shape, async (input) => {
        const text = await getTopRequests.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    server.tool(searchFeedback.name, searchFeedback.description, searchFeedback.inputSchema.shape, async (input) => {
        const text = await searchFeedback.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    server.tool(getFeatureFeedback.name, getFeatureFeedback.description, getFeatureFeedback.inputSchema.shape, async (input) => {
        const text = await getFeatureFeedback.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    server.tool(getPrioritization.name, getPrioritization.description, getPrioritization.inputSchema.shape, async (input) => {
        const text = await getPrioritization.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    server.tool(updateFeatureStatus.name, updateFeatureStatus.description, updateFeatureStatus.inputSchema.shape, async (input) => {
        const text = await updateFeatureStatus.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    server.tool(notifyRequesters.name, notifyRequesters.description, notifyRequesters.inputSchema.shape, async (input) => {
        const text = await notifyRequesters.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    server.tool(createPost.name, createPost.description, createPost.inputSchema.shape, async (input) => {
        const text = await createPost.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    server.tool(manageFeatureTags.name, manageFeatureTags.description, manageFeatureTags.inputSchema.shape, async (input) => {
        const text = await manageFeatureTags.execute(input, client);
        return { content: [{ type: "text", text }] };
    });
    // ---- Resources -----------------------------------------------------------
    server.resource(roadmap.name, roadmap.uri, { description: roadmap.description, mimeType: roadmap.mimeType }, async () => {
        const text = await roadmap.read(client);
        return { contents: [{ uri: roadmap.uri, mimeType: roadmap.mimeType, text }] };
    });
    server.resource(changelog.name, changelog.uri, { description: changelog.description, mimeType: changelog.mimeType }, async () => {
        const text = await changelog.read(client);
        return { contents: [{ uri: changelog.uri, mimeType: changelog.mimeType, text }] };
    });
    return server;
}
//# sourceMappingURL=register.js.map