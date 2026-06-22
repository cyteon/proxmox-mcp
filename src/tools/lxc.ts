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

  server.registerTool(
    "lxc.status",
    {
      title: "lxc1.status",
      description: "Get the status of a LXC container",
      inputSchema: {
        node: z.string().describe("Node the container is on"),
        vmid: z.string().describe("ID of the container"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, vmid }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/lxc/${vmid}/status/current`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "lxc.config",
    {
      title: "lxc.config",
      description: "Get the config of a LXC container",
      inputSchema: {
        node: z.string().describe("Node the container is on"),
        vmid: z.string().describe("ID of the container"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, vmid }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(`nodes/${node}/lxc/${vmid}/config`)),
          },
        ],
      };
    },
  );
}
