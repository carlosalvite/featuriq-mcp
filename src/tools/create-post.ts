import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";

export const name = "create_post";

export const description =
  "Creates a new feedback post on a Featuriq board. " +
  "Use this to log feature requests, bug reports, or ideas captured in conversations, " +
  "meetings, or support tickets — so they're tracked in Featuriq for the team to see and vote on.";

export const inputSchema = z.object({
  board_id: z
    .string()
    .min(1)
    .describe(
      "The ID of the board to post to (e.g. 'board_features', 'board_bugs'). " +
        "Ask the user which board to use if unsure."
    ),
  title: z
    .string()
    .min(1)
    .max(200)
    .describe("Short, descriptive title for the feedback post (max 200 characters)"),
  description: z
    .string()
    .min(1)
    .max(5000)
    .describe(
      "Full description of the feature request or feedback. " +
        "Include context, use cases, and any relevant details the team should know."
    ),
});

export type Input = z.infer<typeof inputSchema>;

export async function execute(input: Input, client: FeaturiqClient): Promise<string> {
  const post = await client.createPost({
    board_id: input.board_id,
    title: input.title,
    description: input.description,
  });

  return (
    `Post created successfully.\n\n` +
    `[${post.id}] ${post.title}\n` +
    `Board: ${input.board_id}\n` +
    `Status: ${post.status}\n` +
    `Created at: ${post.created_at}\n` +
    `URL: ${post.url}`
  );
}
