import { z } from "zod";
export const name = "update_feature_status";
export const description = "Updates the status of a feature request in Featuriq. " +
    "Use this when a feature moves through the development lifecycle: " +
    "from planned → in_progress → shipped, or to close a request that won't be built.";
export const inputSchema = z.object({
    feature_id: z
        .string()
        .min(1)
        .describe("The unique ID of the feature request to update (e.g. 'feat_01j8k...')"),
    status: z
        .enum(["planned", "in_progress", "shipped", "closed"])
        .describe("New status for the feature: " +
        "'planned' — accepted and on the roadmap; " +
        "'in_progress' — actively being built; " +
        "'shipped' — released to users; " +
        "'closed' — won't be built (declined or duplicate)"),
});
export async function execute(input, client) {
    const feature = await client.updateFeatureStatus({
        feature_id: input.feature_id,
        status: input.status,
    });
    return (`Feature status updated successfully.\n\n` +
        `[${feature.id}] ${feature.title}\n` +
        `New status: ${feature.status}\n` +
        `Updated at: ${feature.updated_at}\n` +
        `URL: ${feature.url}`);
}
//# sourceMappingURL=update-feature-status.js.map