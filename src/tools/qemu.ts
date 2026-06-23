import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "listVMs",
    {
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

  server.registerTool(
    "qemuStatus",
    {
      description: "Get the status of a VM",
      inputSchema: {
        node: z.string().describe("Node the VM is on"),
        vmid: z.string().describe("ID of the VM"),
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
              await pve(`nodes/${node}/qemu/${vmid}/status/current`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "qemuConfig",
    {
      description: "Get the configuration of a VM",
      inputSchema: {
        node: z.string().describe("Node the VM is on"),
        vmid: z.string().describe("ID of the VM"),
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
              await pve(`nodes/${node}/qemu/${vmid}/config`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "qemuPowerAction",
    {
      description: "Perform a power action on a VM",
      inputSchema: {
        node: z.string().describe("Node the VM is on"),
        vmid: z.string().describe("ID of the VM"),
        action: z
          .enum([
            "start",
            "stop",
            "reset",
            "reboot",
            "shutdown",
            "suspend",
            "resume",
          ])
          .describe("Power action to perform"),
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
              await pve(`nodes/${node}/qemu/${vmid}/status/${action}`, {
                method: "POST",
              }),
            ),
          },
        ],
      };
    },
  );
}
