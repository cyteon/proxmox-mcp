import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "version",
    {
      title: "version",
      description: "Get PVE cluster version",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve("version")),
          },
        ],
      };
    },
  );
}
