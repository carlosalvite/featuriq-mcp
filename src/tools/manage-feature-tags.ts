import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";

export const name = "manage_feature_tags";

export const description =
  "List all workspace tags, or assign/update tags on a specific feature request. " +
  "Tags are admin-only labels used to internally categorize feedback (e.g. 'Q3', 'core-workflow', 'enterprise'). " +
  "Call without a feature_id to list available tags. Call with a feature_id and tag_ids to assign tags " +
  "(this replaces any existing tags on that feature — pass an empty array to clear all tags).";

export const inputSchema = z.object({
  feature_id: z
    .string()
    .optional()
    .describe(
      "The unique ID of the feature to tag. Omit to just list all available workspace tags."
    ),
  tag_ids: z
    .array(z.string())
    .optional()
    .describe(
      "List of tag IDs to assign to the feature. Replaces existing tags. " +
      "Pass an empty array [] to remove all tags. Required when feature_id is provided."
    ),
});

export type Input = z.infer<typeof inputSchema>;

export async function execute(input: Input, client: FeaturiqClient): Promise<string> {
  // List-only mode
  if (!input.feature_id) {
    const tags = await client.getTags();
    if (tags.length === 0) {
      return "No tags have been created in this workspace yet. Create tags from the admin board in the Featuriq app.";
    }
    const lines = tags.map(t => `  • [${t.id}] ${t.name} (${t.color})`);
    return `Workspace tags (${tags.length}):\n${lines.join("\n")}`;
  }

  // Assign mode
  if (input.tag_ids === undefined) {
    return "Error: tag_ids is required when feature_id is provided. Pass an array of tag IDs to assign, or [] to clear tags.";
  }

  const updated = await client.setFeatureTags({
    feature_id: input.feature_id,
    tag_ids: input.tag_ids,
  });

  if (updated.length === 0) {
    return `Tags cleared from feature ${input.feature_id}.`;
  }

  const names = updated.map(t => t.name).join(", ");
  return `Tags updated for feature ${input.feature_id}: ${names}`;
}
