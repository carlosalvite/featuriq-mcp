import { z } from "zod";
export const name = "get_top_requests";
export const description = "Returns the top feature requests from Featuriq, sorted by vote count or " +
    "revenue impact. Use this to quickly see what users want most, or to " +
    "identify the highest-value items on the backlog.";
export const inputSchema = z.object({
    limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
        .describe("Maximum number of feature requests to return (default: 10, max: 100)"),
    sort_by: z
        .enum(["votes", "revenue_impact"])
        .default("votes")
        .describe("Sort order: 'votes' ranks by number of upvotes; " +
        "'revenue_impact' ranks by estimated ARR impact (requires revenue tracking to be enabled)"),
});
export async function execute(input, client) {
    const features = await client.getTopRequests({
        limit: input.limit,
        sort_by: input.sort_by,
    });
    if (features.length === 0) {
        return "No feature requests found.";
    }
    const lines = features.map((f, i) => {
        const revenue = f.revenue_impact !== null ? ` | Revenue impact: $${f.revenue_impact.toLocaleString()}` : "";
        const tags = f.tags && f.tags.length > 0 ? `\n   Tags: ${f.tags.map(t => t.name).join(", ")}` : "";
        return (`${i + 1}. [${f.id}] ${f.title}\n` +
            `   Status: ${f.status} | Votes: ${f.vote_count}${revenue}${tags}\n` +
            `   ${f.url}`);
    });
    return `Top ${features.length} feature requests (sorted by ${input.sort_by}):\n\n${lines.join("\n\n")}`;
}
//# sourceMappingURL=get-top-requests.js.map