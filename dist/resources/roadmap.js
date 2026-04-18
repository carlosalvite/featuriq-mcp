export const uri = "featuriq://roadmap";
export const name = "roadmap";
export const description = "The current Featuriq roadmap, grouped by status: planned, in_progress, and shipped. " +
    "Read this to get a bird's-eye view of what the product team is working on, " +
    "what's coming up, and what's already been delivered.";
export const mimeType = "text/plain";
function formatFeature(f, index) {
    const revenue = f.revenue_impact !== null ? ` | Revenue impact: $${f.revenue_impact.toLocaleString()}` : "";
    return `  ${index + 1}. [${f.id}] ${f.title} (${f.vote_count} votes${revenue})\n     ${f.url}`;
}
export async function read(client) {
    const roadmap = await client.getRoadmap();
    const sections = [];
    if (roadmap.in_progress.length > 0) {
        const items = roadmap.in_progress.map(formatFeature).join("\n");
        sections.push(`## In Progress (${roadmap.in_progress.length})\n${items}`);
    }
    else {
        sections.push("## In Progress\n  (none)");
    }
    if (roadmap.planned.length > 0) {
        const items = roadmap.planned.map(formatFeature).join("\n");
        sections.push(`## Planned (${roadmap.planned.length})\n${items}`);
    }
    else {
        sections.push("## Planned\n  (none)");
    }
    if (roadmap.shipped.length > 0) {
        const items = roadmap.shipped.map(formatFeature).join("\n");
        sections.push(`## Recently Shipped (${roadmap.shipped.length})\n${items}`);
    }
    else {
        sections.push("## Recently Shipped\n  (none)");
    }
    return `# Featuriq Roadmap\n\n${sections.join("\n\n")}`;
}
//# sourceMappingURL=roadmap.js.map