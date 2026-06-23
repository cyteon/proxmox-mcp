import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "storageList",
    {
      title: "storageList",
      description: "List all storage pools",
      inputSchema: {
        node: z.string().describe("Node to list storage pools on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/storage`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "storageStatus",
    {
      title: "storageStatus",
      description: "Get the status of a storage pool",
      inputSchema: {
        node: z.string().describe("Node the storage pool is on"),
        storageId: z.string().describe("ID of the storage pool"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, storageId }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/storage/${storageId}/status`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "storageContent",
    {
      title: "storageContent",
      description: "Get the content of a storage pool",
      inputSchema: {
        node: z.string().describe("Node the storage pool is on"),
        storageId: z.string().describe("ID of the storage pool"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, storageId }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/storage/${storageId}/content`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "storageGetPruneInfo",
    {
      title: "storageGetPruneInfo",
      description: "Get prune information for backups.",
      inputSchema: {
        node: z.string().describe("Node the storage pool is on"),
        storageId: z.string().describe("ID of the storage pool"),
        retention: z
          .string()
          .optional()
          .describe(
            "[keep-all=<1|0>] [,keep-daily=<N>] [,keep-hourly=<N>] [,keep-last=<N>] [,keep-monthly=<N>] [,keep-weekly=<N>] [,keep-yearly=<N>]",
          ),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, storageId, retention }) => {
      const url = `nodes/${node}/storage/${storageId}/prunebackups${retention ? `?prune-backups=${encodeURIComponent(retention)}` : ""}`;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(url)),
          },
        ],
      };
    },
  );
}
