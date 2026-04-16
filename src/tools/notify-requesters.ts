import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";

export const name = "notify_requesters";

export const description =
  "Sends a personalized notification to every user who voted for or requested a feature. " +
  "Featuriq personalizes the message for each recipient using their name and context. " +
  "Use this when a feature ships, when its status changes, or when you want to close the " +
  "feedback loop with the users who asked for it.";

export const inputSchema = z.object({
  feature_id: z
    .string()
    .min(1)
    .describe("The unique ID of the feature request whose voters will be notified"),
  message: z
    .string()
    .min(1)
    .max(2000)
    .describe(
      "The message to send. Write it in first person as your product team's voice. " +
        "Featuriq will personalize it per recipient. " +
        "Example: 'Great news! The CSV export you requested is now live. " +
        "You can find it under Reports → Export. Let us know what you think!'"
    ),
});

export type Input = z.infer<typeof inputSchema>;

export async function execute(input: Input, client: FeaturiqClient): Promise<string> {
  const result = await client.notifyRequesters({
    feature_id: input.feature_id,
    message: input.message,
  });

  return (
    `Notifications sent successfully.\n\n` +
    `Feature: ${result.feature_id}\n` +
    `Users notified: ${result.notified_count}\n\n` +
    `Message preview (as personalized by Featuriq):\n"${result.message_preview}"`
  );
}
