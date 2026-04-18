import { z } from "zod";
export const name = "get_prioritization";
export const description = "Returns an AI-generated prioritized list of feature requests, scored and explained " +
    "across the factors you choose: votes (user demand), revenue (ARR impact), effort " +
    "(engineering estimate), and strategic_fit (alignment with company goals). " +
    "Use this to build a data-driven prioritization stack for your next sprint or quarter.";
export const inputSchema = z.object({
    factors: z
        .array(z.enum(["votes", "revenue", "effort", "strategic_fit"]))
        .min(1)
        .describe("Which factors to weigh in the prioritization. Choose one or more: " +
        "'votes' (user demand), 'revenue' (revenue impact), " +
        "'effort' (engineering effort — lower is better), " +
        "'strategic_fit' (alignment with company strategy)"),
    limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe("Number of features to include in the prioritized list (default: 10, max: 50)"),
});
export async function execute(input, client) {
    const results = await client.getPrioritization({
        factors: input.factors,
        limit: input.limit,
    });
    if (results.length === 0) {
        return "No features available to prioritize.";
    }
    const factorLabel = {
        votes: "Votes",
        revenue: "Revenue",
        effort: "Effort",
        strategic_fit: "Strategic fit",
    };
    const lines = results.map((r, i) => {
        const scoreBreakdown = input.factors
            .map((f) => {
            const val = r.scores[f];
            return val !== undefined ? `${factorLabel[f]}: ${val.toFixed(1)}` : null;
        })
            .filter(Boolean)
            .join(" | ");
        return (`${i + 1}. [${r.feature.id}] ${r.feature.title} — Score: ${r.total_score.toFixed(2)}\n` +
            `   ${scoreBreakdown}\n` +
            `   Reasoning: ${r.reasoning}\n` +
            `   ${r.feature.url}`);
    });
    return (`Prioritized features (factors: ${input.factors.join(", ")}):\n\n` +
        lines.join("\n\n"));
}
//# sourceMappingURL=get-prioritization.js.map