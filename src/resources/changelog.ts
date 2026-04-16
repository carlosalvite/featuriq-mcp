import { FeaturiqClient } from "../api-client.js";

export const uri = "featuriq://changelog";
export const name = "changelog";
export const description =
  "The Featuriq changelog: the most recently shipped features with ship dates and release notes. " +
  "Read this to understand what has been delivered recently, or to draft communications " +
  "about recent product updates.";
export const mimeType = "text/plain";

const DEFAULT_LIMIT = 20;

export async function read(client: FeaturiqClient, limit = DEFAULT_LIMIT): Promise<string> {
  const entries = await client.getChangelog({ limit });

  if (entries.length === 0) {
    return "# Featuriq Changelog\n\nNo shipped features yet.";
  }

  const lines = entries.map((e, i) => {
    const notes = e.release_notes ? `\n   ${e.release_notes}` : "";
    return (
      `${i + 1}. [${e.feature.id}] ${e.feature.title}\n` +
      `   Shipped: ${e.shipped_at} | Votes: ${e.feature.vote_count}${notes}\n` +
      `   ${e.feature.url}`
    );
  });

  return `# Featuriq Changelog (last ${entries.length} shipped)\n\n${lines.join("\n\n")}`;
}
