/**
 * Creates and returns a fully configured McpServer instance.
 * Called once per HTTP request so each request gets its own FeaturiqClient
 * (and therefore its own auth token).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FeaturiqClient } from "./api-client.js";
export declare function createMcpServer(client: FeaturiqClient): McpServer;
//# sourceMappingURL=register.d.ts.map