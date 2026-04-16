import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";

export const name = "get_feature_feedback";

export const description =
  "Returns all feedback, comments, and discussion for a specific feature request. " +
  "Use this to deeply understand what users are asking for, read their verbatim comments, " +
  "or find out who is most impacted by a particular feature.";

export const inputSchema = z.object({
  feature_id: z
    .string()
    .min(1)
    .describe("The unique ID of the feature request (e.g. 'feat_01j8k...')"),
});

export type Input = z.infer<typeof inputSchema>;

export async function execute(input: Input, client: FeaturiqClient): Promise<string> {
  const { feature, comments } = await client.getFeatureFeedback({
    feature_id: input.feature_id,
  });

  const revenueStr =
    feature.revenue_impact !== null
      ? `$${feature.revenue_impact.toLocaleString()} revenue impact`
      : "revenue impact not tracked";

  let output =
    `Feature: ${feature.title} [${feature.id}]\n` +
    `Status: ${feature.status} | Votes: ${feature.vote_count} | ${revenueStr}\n` +
    `URL: ${feature.url}\n\n` +
    `Description:\n${feature.description}\n`;

  if (comments.length === 0) {
    output += "\nNo comments yet.";
    return output;
  }

  output += `\n--- ${comments.length} Comment(s) ---\n`;

  for (const c of comments) {
    const label = c.is_internal ? " [internal]" : "";
    output +=
      `\n[${c.id}]${label} ${c.author.name} (${c.author.email}) — ${c.created_at}\n` +
      `${c.body}\n`;
  }

  return output;
}
