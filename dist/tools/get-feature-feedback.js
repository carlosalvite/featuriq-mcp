import { z } from "zod";
export const name = "get_feature_feedback";
export const description = "Returns all feedback, comments, and discussion for a specific feature request. " +
    "Use this to deeply understand what users are asking for, read their verbatim comments, " +
    "or find out who is most impacted by a particular feature.";
export const inputSchema = z.object({
    feature_id: z
        .string()
        .min(1)
        .describe("The unique ID of the feature request (e.g. 'feat_01j8k...')"),
    include_internal: z
        .boolean()
        .default(false)
        .describe("When true, internal admin-only comments are included in the output. " +
        "Defaults to false (public comments only)."),
});
export async function execute(input, client) {
    const { feature, comments } = await client.getFeatureFeedback({
        feature_id: input.feature_id,
        include_internal: input.include_internal,
    });
    const revenueStr = feature.revenue_impact !== null
        ? `$${feature.revenue_impact.toLocaleString()} revenue impact`
        : "revenue impact not tracked";
    const tagsStr = feature.tags && feature.tags.length > 0
        ? `\nTags: ${feature.tags.map(t => t.name).join(", ")}`
        : "";
    let output = `Feature: ${feature.title} [${feature.id}]\n` +
        `Status: ${feature.status} | Votes: ${feature.vote_count} | ${revenueStr}${tagsStr}\n` +
        `URL: ${feature.url}\n\n` +
        `Description:\n${feature.description}\n`;
    // AI-generated follow-up questions are already filtered server-side;
    // any remaining is_ai_question:true entries are shown with a clear label.
    const userComments = comments.filter(c => !c.is_ai_question);
    if (userComments.length === 0) {
        output += "\nNo comments yet.";
        return output;
    }
    output += `\n--- ${userComments.length} Comment(s) ---\n`;
    for (const c of userComments) {
        const label = c.is_internal ? " [internal]" : "";
        output +=
            `\n[${c.id}]${label} ${c.author.name} (${c.author.email}) — ${c.created_at}\n` +
                `${c.body}\n`;
    }
    return output;
}
//# sourceMappingURL=get-feature-feedback.js.map