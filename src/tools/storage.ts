import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "listStorage",
    {
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
    "storagePruneInfo",
    {
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

  server.registerTool(
    "listDisks",
    {
      description: "List all disks on a node",
      inputSchema: {
        node: z.string().describe("Node to list disks on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/disks/list`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "getDiskSMART",
    {
      description: "Get SMART information for a disk",
      inputSchema: {
        node: z.string().describe("Node the disk is on"),
        disk: z.string().describe("Block device name"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, disk }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(
                `nodes/${node}/disks/smart?disk=${encodeURIComponent(disk)}`,
              ),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "listDirStorages",
    {
      description: "PVE Managed Directory storages",
      inputSchema: {
        node: z.string().describe("Node to list directory storages on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/disks/directory`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "listLVMVolumes",
    {
      description: "List LVM Volume Groups",
      inputSchema: {
        node: z.string().describe("Node to list LVM volumes on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/disks/lvm`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "listLVMThinVolumes",
    {
      description: "List LVM Thin Pools",
      inputSchema: {
        node: z.string().describe("Node to list LVM thin pools on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/disks/lvmthin`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "listZFSVolumes",
    {
      description: "List ZFS Pools",
      inputSchema: {
        node: z.string().describe("Node to list ZFS pools on"),
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
            text: JSON.stringify(await pve(`nodes/${node}/disks/zfs`)),
          },
        ],
      };
    },
  );
}
