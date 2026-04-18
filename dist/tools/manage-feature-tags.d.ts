import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "manage_feature_tags";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    feature_id: z.ZodOptional<z.ZodString>;
    tag_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    feature_id?: string | undefined;
    tag_ids?: string[] | undefined;
}, {
    feature_id?: string | undefined;
    tag_ids?: string[] | undefined;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=manage-feature-tags.d.ts.map