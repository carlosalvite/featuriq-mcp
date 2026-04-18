import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "notify_requesters";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    feature_id: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    feature_id: string;
}, {
    message: string;
    feature_id: string;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=notify-requesters.d.ts.map