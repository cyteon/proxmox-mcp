import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "nodeStatus",
    {
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

  server.registerTool(
    "rebootNode",
    {
      description: "Reboot a node",
      inputSchema: {
        node: z.string().describe("Node to reboot"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async ({ node }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/status`, {
                method: "POST",
                body: JSON.stringify({ command: "reboot" }),
              }),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "nodeRRDData",
    {
      description: "Read node RRD statistics",
      inputSchema: {
        node: z.string().describe("Node to get RRD data for"),
        timeframe: z
          .enum(["hour", "day", "week", "month", "year", "decade"])
          .describe("Timeframe for RRD data"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, timeframe }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/rrddata?timeframe=${timeframe}`),
            ),
          },
        ],
      };
    },
  );
}
