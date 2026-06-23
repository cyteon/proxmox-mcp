import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "listContainers",
    {
      description: "List all LXC containers",
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
    "lxcStatus",
    {
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
    "lxcConfig",
    {
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

  server.registerTool(
    "lxcPowerAction",
    {
      description: "Perform a power action on a LXC container",
      inputSchema: {
        node: z.string().describe("Node the container is on"),
        vmid: z.string().describe("ID of the container"),
        action: z
          .enum(["start", "stop", "shutdown", "reboot", "suspend", "resume"])
          .describe("Power action"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async ({ node, vmid, action }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/lxc/${vmid}/status/${action}`, {
                method: "POST",
              }),
            ),
          },
        ],
      };
    },
  );
}
