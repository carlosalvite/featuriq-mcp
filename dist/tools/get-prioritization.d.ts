import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "get_prioritization";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    factors: z.ZodArray<z.ZodEnum<["votes", "revenue", "effort", "strategic_fit"]>, "many">;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    factors: ("votes" | "revenue" | "effort" | "strategic_fit")[];
}, {
    factors: ("votes" | "revenue" | "effort" | "strategic_fit")[];
    limit?: number | undefined;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=get-prioritization.d.ts.map