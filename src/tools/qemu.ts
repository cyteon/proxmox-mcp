import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "qemu.list",
    {
      title: "qemu.list",
      description: "List all QEMU virtual machines",
      inputSchema: {
        node: z.string().describe("Node to list VMs on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/qemu`)),
          },
        ],
      };
    },
  );
}
