import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "get_feature_feedback";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    feature_id: z.ZodString;
    include_internal: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    feature_id: string;
    include_internal: boolean;
}, {
    feature_id: string;
    include_internal?: boolean | undefined;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=get-feature-feedback.d.ts.map