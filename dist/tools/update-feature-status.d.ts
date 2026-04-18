import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "update_feature_status";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    feature_id: z.ZodString;
    status: z.ZodEnum<["planned", "in_progress", "shipped", "closed"]>;
}, "strip", z.ZodTypeAny, {
    status: "planned" | "in_progress" | "shipped" | "closed";
    feature_id: string;
}, {
    status: "planned" | "in_progress" | "shipped" | "closed";
    feature_id: string;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=update-feature-status.d.ts.map