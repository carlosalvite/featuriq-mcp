import { z } from "zod";
import { FeaturiqClient } from "../api-client.js";
export declare const name = "create_post";
export declare const description: string;
export declare const inputSchema: z.ZodObject<{
    board_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    board_id: string;
    title: string;
    description: string;
}, {
    board_id: string;
    title: string;
    description: string;
}>;
export type Input = z.infer<typeof inputSchema>;
export declare function execute(input: Input, client: FeaturiqClient): Promise<string>;
//# sourceMappingURL=create-post.d.ts.map