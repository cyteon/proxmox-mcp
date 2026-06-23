import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "nodeStatus",
    {
      title: "nodeStatus",
      description: "Get node status",
      inputSchema: {
        node: z.string().describe("Node to get status for"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(`nodes/${node}/status`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "nodeListAvailableUpdates",
    {
      title: "nodeListAvailableUpdates",
      description: "List available APT updates",
      inputSchema: {
        node: z.string().describe("Node to list available updates for"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(`nodes/${node}/apt/update`)),
          },
        ],
      };
    },
  );
}
