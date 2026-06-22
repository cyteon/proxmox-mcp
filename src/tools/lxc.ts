import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "lxc.list",
    {
      title: "lxc.list",
      description: "List all LXC virtual machines",
      inputSchema: {
        node: z.string().describe("Node to list containers on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/lxc`)),
          },
        ],
      };
    },
  );
}
