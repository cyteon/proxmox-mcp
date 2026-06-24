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

  server.registerTool(
    "lxcUpdateConfig",
    {
      description: "Update the config of a LXC container",
      inputSchema: {
        node: z.string().describe("Node the container is on"),
        vmid: z.string().describe("ID of the container"),
        config: z
          .object({
            arch: z
              .enum(["amd64", "i386", "arm64", "armhf", "riscv32", "riscv64"])
              .optional(),
            cmode: z.enum(["shell", "console", "tty"]).optional(),
            console: z.boolean().optional(),
            cores: z.number().int().min(1).max(8192).optional(),
            cpulimit: z.number().min(0).max(8192).optional(),
            cpuunits: z.number().int().min(0).max(500000).optional(),
            debug: z.boolean().optional(),
            delete: z
              .string()
              .optional()
              .describe("A list of settings you want to delete."),
            description: z.string().optional(),
            digest: z.string(), // to make sure the llm has read the config
            entrypoint: z.string().optional(),
            env: z.string().optional(),
            features: z.string().optional(),
            hookscript: z.string().optional(),
            hostname: z.string().optional(),
            lock: z
              .enum([
                "backup",
                "create",
                "destroyed",
                "disk",
                "fstrim",
                "migrate",
                "mounted",
                "rollback",
                "snapshot",
                "snapshot-delete",
              ])
              .optional(),
            memory: z.number().int().min(16).optional().describe("in MB"),
            nameserver: z.string().optional(),
            onboot: z.boolean().optional(),
            ostype: z
              .enum([
                "debian",
                "devuan",
                "ubuntu",
                "centos",
                "fedora",
                "opensuse",
                "archlinux",
                "alpine",
                "gentoo",
                "nixos",
                "unmanaged",
              ])
              .optional(),
            protection: z.boolean().optional(),
            revert: z.string().optional().describe("Revert a pending change"),
            rootfs: z.string().optional(),
            searchdomain: z.string().optional(),
            startup: z
              .string()
              .optional()
              .describe("[[order=]\\d+] [,up=\\d+] [,down=\\d+]"),
            swap: z.number().int().min(0).optional(),
            tags: z.string().optional(),
            template: z.boolean().optional(),
            timezone: z.string().optional(),
            tty: z.number().int().min(0).max(6).optional(),
            unprivileged: z.boolean().optional(),
          })
          .loose()
          .describe("Values to update"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async ({ node, vmid, config }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/lxc/${vmid}/config`, {
                method: "PUT",
                body: JSON.stringify(config),
              }),
            ),
          },
        ],
      };
    },
  );
}
