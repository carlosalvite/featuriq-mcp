import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "get_top_requests";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["votes", "revenue_impact"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    sort_by: "votes" | "revenue_impact";
}, {
    limit?: number | undefined;
    sort_by?: "votes" | "revenue_impact" | undefined;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=get-top-requests.d.ts.map