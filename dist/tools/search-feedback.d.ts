import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "search_feedback";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    query: string;
}, {
    query: string;
    limit?: number | undefined;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=search-feedback.d.ts.map