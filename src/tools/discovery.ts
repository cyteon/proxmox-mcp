import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "version",
    {
      title: "version",
      description: "API version details",
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

  server.registerTool(
    "cluster/resources",
    {
      title: "cluster/resources",
      description: "Resources index (cluster wide)",
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
            text: JSON.stringify(await pve("cluster/resources")),
          },
        ],
      };
    },
  );

  server.registerTool(
    "cluster/status",
    {
      title: "cluster/status",
      description: "Get cluster status information",
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
            text: JSON.stringify(await pve("cluster/status")),
          },
        ],
      };
    },
  );

  server.registerTool(
    "cluster/nextid",
    {
      title: "cluster/nextid",
      description:
        "Get next free VMID. Pass a VMID to assert that its free (at time of check).",
      inputSchema: {
        vmid: z.number().optional(),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ vmid }) => {
      const path = vmid ? `cluster/nextid?vmid=${vmid}` : "cluster/nextid";

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(path)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "nodes",
    {
      title: "nodes",
      description: "List all cluster nodes",
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
            text: JSON.stringify(await pve("nodes")),
          },
        ],
      };
    },
  );

  server.registerTool(
    "cluster/log",
    {
      title: "cluster/log",
      description: "Get cluster log entries",
      inputSchema: {
        max: z.number().optional(),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ max }) => {
      const path = max ? `cluster/log?max=${max}` : "cluster/log";

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(path)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "cluster/tasks",
    {
      title: "cluster/tasks",
      description: "Get cluster tasks",
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
            text: JSON.stringify(await pve("cluster/tasks")),
          },
        ],
      };
    },
  );
}
