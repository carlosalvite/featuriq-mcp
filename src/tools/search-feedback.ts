import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";

export const name = "search_feedback";

export const description =
  "Semantically searches all feedback posts in Featuriq using natural language. " +
  "Use this to find relevant customer feedback for a topic, theme, or specific problem " +
  "even when the exact words don't match.";

export const inputSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe(
      "Natural language search query, e.g. 'slow dashboard loading', 'mobile app crashes', " +
        "'CSV export feature'"
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe("Maximum number of results to return (default: 10, max: 50)"),
});

export type Input = z.infer<typeof inputSchema>;

export async function execute(input: Input, client: FeaturiqClient): Promise<string> {
  const posts = await client.searchFeedback({ query: input.query, limit: input.limit });

  if (posts.length === 0) {
    return `No feedback found matching "${input.query}".`;
  }

  const lines = posts.map((p, i) => {
    const snippet =
      p.description.length > 120 ? p.description.slice(0, 120) + "…" : p.description;
    return (
      `${i + 1}. [${p.id}] ${p.title}\n` +
      `   By: ${p.author.name} | Votes: ${p.vote_count} | Status: ${p.status}\n` +
      `   "${snippet}"\n` +
      `   ${p.url}`
    );
  });

  return (
    `Found ${posts.length} feedback post(s) matching "${input.query}":\n\n` +
    lines.join("\n\n")
  );
}
